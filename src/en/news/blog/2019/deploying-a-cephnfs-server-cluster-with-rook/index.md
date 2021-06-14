---
title: "Deploying a Ceph+NFS Server Cluster with Rook"
date: "2019-03-06"
author: "jtlayton"
tags: 
  - "cephfs"
  - "nfs"
  - "rook"
---

With [rook.io](https://rook.io/) it's possible to deploy a [Ceph](https://ceph.com/) cluster on top of [kubernetes](https://kubernetes.io) (also known as **k8s**). The ceph cluster can use storage on each individual k8s cluster node just as it when it is deployed on regular hosts. Newer versions of rook and Ceph also support the deployment of a CephFS to NFS gateway using the [nfs-ganesha](https://github.com/nfs-ganesha/nfs-ganesha/wiki) userland server. This article will cover how one would deploy a Ceph cluster, CephFS and finally an NFS gateway using rook.

## Overview

We'll start by creating a single-VM kubernetes cluster using [minikube](https://kubernetes.io/docs/setup/minikube/). From there, we'll create a minimal cluster (with just a single mon and a mgr), we'll then create a filesystem on top of that, and then a cluster of NFS gateways running on top of it all. Finally, we'll cover exposing the NFS service to the outside world.

Once we start up a minimal cluster. Note that we'll be using the ceph-mgr orchestrator module and dashboard to help us expand out the cluster. The command-line and APIs there are still somewhat "raw". The eventual idea is to add a nice UI veneer over those commands, but that is still in the planning phase, so we'll have to live with a bit of klunky command-line work here.

## Kubernetes Cluster

First, you'll need a kubernetes cluster. If you already have one, great -- it just needs some local storage (a directory on a filesystem or a block device) on each node for housing ceph-specific info, as well as to act as backing store for the object storage devices.

Don't have one? No problem! You can deploy a single-node kubernetes cluster in a vm using [minikube](https://kubernetes.io/docs/setup/minikube/). For this walkthrough, I'm deploying the cluster on minikube running under KVM.

## Workstation Preparation

If you do need to use minikube, then you'll need to prepare your workstation. I'm using Fedora 29 and KVM for this example. Minikube creates its local images under your home directory, so you will need some disk space there (25g or so).

Start by installing the necessary tools for interacting with a kubernetes cluster remotely:

\# dnf install kubernetes-client docker-common git

## Deploying Minikube

You can skip this bit if you already have a kubernetes cluster. Start by downloading the latest minikube binaries and the kvm2 driver, make them executable, and put them somewhere in your $PATH:

\[jlayton@workstation ~\]$ cd /tmp
\[jlayton@workstation ~\]$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
\[jlayton@workstation ~\]$ curl -LO https://storage.googleapis.com/minikube/releases/latest/docker-machine-driver-kvm2
\[jlayton@workstation ~\]$ chmod 0755 minikube docker-machine-driver-kvm2
\[jlayton@workstation ~\]$ cp minikube docker-machine-driver-kvm2 ~/bin

Start up minikube. Note that this will create files under $HOME/.minikube, so make sure your homedir has enough space. Minikube defaults to a 20GB image, which is enough for some basic testing. I have a fairly beefy machine for development, so I usually give the VM more CPUs and RAM than the default. Run "minikube start --help" for a complete list of options.

\[jlayton@workstation ~\]$ minikube start --vm-driver=kvm2 --memory 8192 --cpus 16

This will fire up a KVM, slurp down the minikube ISO image, and start deploying a kubernetes cluster. Additionally, kubectl on the local machine will be configured to talk to the new cluster. Once the command returns, you should be able to run something like this and see a list of pods running on the cluster:

\[jlayton@workstation ~\]$ kubectl get pods --all-namespaces

## Rook and Ceph Container Images

Early versions of rook deployed ceph clusters using the same image that the rook operator uses. In modern versions,  the ceph version you run is mostly decoupled from what rook version you are using. When deploying a rook cluster, we are concerned with two container images:

- The **rook** image: the rook operator uses this image
- The **ceph** image: the ceph daemon containers use this image

You'll want to use an up-to-date rook image. At the time of this writing, the [rook/ceph:master](https://hub.docker.com/r/rook/ceph) image should be current enough for the rook image.

The ceph image should be based on the Nautilus (v14) release or newer. We'll be using some mgr/dashboard infrastructure to scale the cluster out to larger sizes after we deploy a minimal cluster. Much of that infrastructure does not exist in pre-Nautilus images.

To prepare this article, I used a custom ceph image, but by the time you're reading it you should be able to use an official Ceph Nautilus container image.

## Deploying the Rook Operator

Start by downloading the rook sources. We're not looking to hack on the rook code here (though help is always welcome), but the tree contains a set of yaml files that we can feed to kubernetes to bootstrap the ceph cluster.

\[jlayton@workstation ~\]$ mkdir -p ~/git
\[jlayton@workstation ~\]$ cd ~/git
\[jlayton@workstation ~\]$ git clone https://github.com/rook/rook.git

Change directories into the ceph examples dir and go ahead and deploy the rook operator. This will add a kubernetes namespace called "rook-ceph-system" and spin up some pods for the rook operator.

\[jlayton@workstation ~\]$ cd ~/git/rook/cluster/examples/kubernetes/ceph
\[jlayton@workstation ~\]$ git checkout v1.0.0
\[jlayton@workstation ~\]$ kubectl create -f ./common.yaml
\[jlayton@workstation ~\]$ kubectl create -f ./operator.yaml

## Deploying a Minimal Ceph Cluster

Open up cluster-minimal.yaml in your favorite editor. Make sure the **spec.cephVersion.image** field is set to the image you want to use as a base. You may also need to set **spec.cephVersion.allowUnsupported** to true if it's not based on an official release.

If using minikube, set the **spec.dataDirHostPath** to **/data/rook**. Minikube will persist the **/data** directory across reboots, whereas **/var** is mounted from the read-only ISO image. We can't store anything there.

Create a minimal ceph cluster and a toolbox container. Then watch them spin up with the "get pods" command.

\[jlayton@workstation ~\]$ kubectl create -f ./cluster-minimal.yaml
\[jlayton@workstation ~\]$ kubectl create -f ./toolbox.yaml
\[jlayton@workstation ~\]$ kubectl get pods --all-namespaces -w

If all went well, you'll end up with three new pods in Running state. One ceph monitor (rook-ceph-mon-a-...), one ceph manager (rook-ceph-mgr-a...), and a toolbox container (rook-ceph-tools-...).

## Using the Rook Toolbox

We now have a small ceph cluster, but it's relatively inaccessible. Each daemon generally gets its own kubernetes service object, and they all default to ClusterIP services, which means they are only accessible from other kubernetes pods:

\[jlayton@workstation ~\]$ kubectl get services --all-namespaces
 NAMESPACE     NAME                      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)             AGE
 default       kubernetes                ClusterIP   10.96.0.1                443/TCP             54m
 kube-system   kube-dns                  ClusterIP   10.96.0.10               53/UDP,53/TCP       54m
 rook-ceph     rook-ceph-mgr             ClusterIP   10.100.141.156           9283/TCP            8m
 rook-ceph     rook-ceph-mgr-dashboard   ClusterIP   10.97.104.227            8443/TCP            8m
 rook-ceph     rook-ceph-mon-a           ClusterIP   10.104.122.195           6789/TCP,3300/TCP   9m

To interact with the ceph daemons, we need a  shell that is running in a pod inside the kubernetes cluster. The toolbox is a do-nothing container that serves this purpose. When kubernetes starts a new pod, it gives it a unique name. Determine that, and then exec a shell inside that pod:

\[jlayton@workstation ~\]$ kubectl get pods -n rook-ceph | grep tools
\[jlayton@workstation ~\]$ kubectl exec -ti -n rook-ceph rook-ceph-tools-... bash

That should give you a shell prompt. Typically, it will have the hostname in the prompt, which is "minikube" for a minikube setup. From there, we can run low-level ceph client tools like "ceph" and "rados".

minikube# ceph status
cluster:
     id:     065b0695-9293-4153-831e-a11919a4fe96
     health: HEALTH\_ERR
             Module 'dashboard' has failed: IOError("Port 8443 not bound on '::'",)
 services:
     mon: 1 daemons, quorum a (age 40m)
     mgr: a(active, since 8s)
     osd: 0 osds: 0 up, 0 in
 data:
     pools:   0 pools, 0 pgs
     objects: 0 objects, 0 B
     usage:   0 B used, 0 B / 0 B avail
     pgs:

The HEALTH\_ERR there seems to be due to a [bug in the dashboard](http://tracker.ceph.com/issues/38411), but we can see here that the single mon and mgr are present.

## Adding more Monitors

From here, we can use the ceph command line tools (and the orchestrator mgr module in particular) to expand our cluster. One mon is a single point of failure, so let's scale up the mon count to 3:

minikube# ceph orchestrator mon update 3

Kubernetes and rook are somewhat "lazy" about starting daemons -- it can take a couple of minutes for them to spin up. We can see what daemons have come up by periodically running this:

minikube# ceph orchestrator service ls

## Adding Backing Storage

So far, we can't actually use the ceph cluster to store any object data. For most environments, we'd want to allocate one or more block devices per physical node, and use those to back a set of [bluestore](https://ceph.com/community/new-luminous-bluestore/) OSDs. Adding a block device to minikube is non-trivial, unfortunately, so we'll have to settle for an OSD that is backed by a directory on a filesystem on the node.

In the toolbox shell, create a **/osd.json** file with contents like this and use the orchestrator cli command to feed it to rook.

minikube# cat /osd.json
{
     "host\_pattern": "minikube",
     "data\_directories": \[ "/data/rook" \]
}
minikube# ceph orchestrator osd create -i /osd.json

The command should return immediately, and the operator will eventually create the backing store for the OSD in **/data/rook**, and then spin up the OSD daemon in a new pod.

If you are running on a cluster that does have block devices allocated for use, then the rook operator should index them when it starts up. They should show up in "device ls".

minikube# Host node1.example.com:
   Device Path           Type       Size    Rotates  Available Model          
   sda                    hdd      18.6G      False      False    
   sdb                    hdd      20.0G      False      False

Here, we know that /dev/sdb is the device we want backing this OSD, so we create a json file this, and feed it to the orchestrator:

minikube# cat /osd.json
{
     "host\_pattern": "node1.example.com",
     "data\_devices": { "paths": \[ "sdb" \] },
}
# ceph orchestrator osd create -i /osd.json

In either case, the command should return immediately and within a couple of minutes or so we should see "ceph status" reporting an "up" OSD .

## Create a CephFS Filesystem

We have backing storage now. Let's layer a CephFS distributed filesystem on top. The ceph-mgr has a "volumes" module that makes this simple. We'll call this one **myfs**:

minikube# ceph fs volume create myfs

The default is to create 2 MDS daemons -- one active and one standby-replay. After a few seconds, we should see the mds service show up in "ceph status" on the toolbox container:

minikube# ceph status
...
services:
     mon: 3 daemons, quorum a,b,c (age 91m)
     mgr: a(active, since 89m)
     mds: myfs:1 {0=myfs-b=up:active} 1 up:standby-replay
     osd: 1 osds: 1 up (since 88m), 1 in (since 88m)
...

## Add an NFS Server Cluster

Now let's create a cluster of NFS servers that we can use to export our new CephFS filesystem. A new clustered recovery backend was recently added to nfs-ganesha, and the rook orchestrator knows how to configure the nfs-ganesha daemons to use it so that they coordinate recovery to prevent recovery conflicts when they are restarted.

The nfs-ganesha daemons needs little bit of storage for their own purposes, and can store that info directly in RADOS. The disparate nfs-ganesha daemons also use those objects to communicate with one another. Let's give ganesha its own pool called "nfs-ganesha" with 64 placement groups:

minikube# ceph osd pool create nfs-ganesha 64
pool 'nfs-ganesha' created

Once this returns, we can spin up an nfs-ganesha container:

minikube# ceph orchestrator nfs add mynfs nfs-ganesha mynfs

This creates a new NFS server cluster called "mynfs" that uses the mynfs namespace in the nfs-ganesha pool to store information that it uses for recovery. It only has a single server node currently, so let's scale out with a second node.

minikube# ceph orchestrator nfs update mynfs 2

The operator should then spin up a second nfs-ganesha container, in the same NFS server cluster as the first.

## Make Ceph Dashboard Reachable

The NFS servers are not terribly useful yet, as they don't have any exports configured. The ceph dashboard can create export configuration blocks for us, but it's currently only accessible via its backend API. We'll have to feed it some more JSON, but first we need to make it accessible from our workstation.

When rook spins up the ceph-mgr containers, it creates a service for the dashboard, but the initial type is a ClusterIP service, which means that it is only reachable from other pods in the same kubernetes cluster. We need to expose the port to the outside world.

There are a number of ways to do this, but the kubectl patch command allows us to do this in one line. In the workstation shell:

\[jlayton@workstation ~\]$ kubectl patch service -n rook-ceph -p '{"spec":{"type": "NodePort"}}' rook-ceph-mgr-dashboard
\[jlayton@workstation ~\]$ kubectl get service -n rook-ceph rook-ceph-mgr-dashboard 
 NAME                      TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
 rook-ceph-mgr-dashboard   NodePort   10.111.49.190                 8443:30064/TCP   3h

This converts the service from a ClusterIP service to a NodePort service. After this command, the dashboard will be reachable from any host that can reach the node on which it is running.

## Create an Export

We'll need to feed a JSON file to the dashboard to create an export. There are a lot of different ways to set up the export tables for nfs-ganesha, but we'll keep it simple here and just export the root of our cephfs tree as /cephfs in the NFSv4 pseudoroot.

To be clear, there are no export controls (the "clients" list is blank), and root squashing is disabled. The ganesha daemon will also be accessing the filesystem as "client.admin" which is probably not what we'd want to do in a "real" deployment:

\[jlayton@workstation ~\]$ cat ~/export.json
{
      "cluster\_id": "mynfs",
      "path": "/",
      "fsal": {"name": "CEPH", "user\_id":"admin", "fs\_name": "myfs", "sec\_label\_xattr": null},
      "pseudo": "/cephfs",
      "tag": null,
      "access\_type": "RW",
      "squash": "no\_root\_squash",
      "protocols": \[4\],
      "transports": \["TCP"\],
      "security\_label": true,
      "daemons": \["mynfs.a", "mynfs.b"\],
      "clients": \[\]
 }

Feed this to the dashboard. The ceph tree has a [handy script for doing this when the dashboard is running under rook](https://raw.githubusercontent.com/ceph/ceph/master/src/pybind/mgr/dashboard/run-backend-rook-api-request.sh). Download that, and run it, passing it the contents of the export.json file that you created above.

\[jlayton@workstation ~\]$ ./run-backend-rook-api-request.sh POST /api/nfs-ganesha/export "$(cat ~/export.json)"

## Expose the NFS Servers

Now we just need to make the NFS servers accessible from hosts outside the kubernetes cluster. Each ganesha daemon gets its own service, so we'll need to expose two different ports.

We can do that with a similar patch commands to the ones we used for the dashboard.

\[jlayton@workstation ~\]$ kubectl patch service -n rook-ceph -p '{"spec":{"type": "NodePort"}}' rook-ceph-nfs-mynfs-a
\[jlayton@workstation ~\]$ kubectl patch service -n rook-ceph -p '{"spec":{"type": "NodePort"}}' rook-ceph-nfs-mynfs-b
\[jlayton@workstation ~\]$ kubectl get services -n rook-ceph rook-ceph-nfs-mynfs-a rook-ceph-nfs-mynfs-b
 NAME                    TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
 rook-ceph-nfs-mynfs-a   NodePort   10.109.205.86           2049:30806/TCP   1h
 rook-ceph-nfs-mynfs-b   NodePort   10.108.117.78           2049:32376/TCP   5m

Now, any host that has a network route to the kubernetes nodes on which these daemons are running will be able to get to the nfs servers via ports 30806 and 32376.

Note that when you run this command, you'll likely get a different pair of ports. It is possible to request a certain port from a NodePort service, but the range that kubernetes will use is pretty limited, so there's not a lot of benefit over just letting it pick one.

## Test NFS Access

If you are running minikube the only client that can reach these servers is the host on which the VM is running. If you're running on a real cluster then you can use different hosts as a clients as long as they can reach the kubernetes cluster node IP addresses.

In either case, try mounting one of the servers from the host. Spawn a root shell and then:

minikube# mkdir -p /mnt/rook
minikube# mount -t nfs -o port=30806 $(minikube ip):/cephfs /mnt/rook

If all goes well, the mount will have succeeded and you can then start doing normal file operations under /mnt/rook.

## Conclusion and Notes

Following this blog post should give you a functional configuration, but for a real production cluster you'll of course want a setup with multiple physical kubernetes nodes for redundancy.

Kubernetes networking is an extremely complex topic. While we touched on converting ClusterIP services to NodePort, there are many other ways to make these services accessible to hosts outside the cluster.

We also mostly glossed over ceph's security. In a real deployment we would want to allocate granular cephx service accounts to limit access to RADOS objects to the actors that require them.
