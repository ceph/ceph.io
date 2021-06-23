---
title: "Rook: Automating Ceph for Kubernetes"
date: "2018-08-02"
author: "tnielsen"
tags: 
  - "ceph"
  - "kubernetes"
  - "luminous"
  - "rook"
---

[Rook](https://rook.io/) is an orchestrator for storage services that run in a Kubernetes cluster. In the Rook [v0.8 release](https://github.com/rook/rook/releases/tag/v0.8.0), we are excited to say that the orchestration around Ceph has stabilized to the point to be declared Beta. If you haven't yet started a Ceph cluster with Rook, now is the time to [take it for a spin](https://rook.io/docs/rook/v0.8/ceph-quickstart.html)!

You may be wondering what Rook is and why you should care. Ceph has been running in production clusters for years so why the big deal now? If you have managed a Ceph cluster before, you know the many intricacies required to setup and maintain the storage cluster. Rook will now simplify and automate many of those difficulties for you, taking advantage of Kubernetes as a distributed platform.

Rook is implemented with an [operator](https://coreos.com/operators/), which means you as the administrator only have to worry about declaring the "desired state" of the cluster.  The Rook operator will watch for your declared settings and then apply the configuration in the cluster. The state that will be managed by the operator includes everything necessary to get the cluster up and running and keep it healthy. In this post we will touch on some of the details of what Rook will manage for you.

## **Mons**

The first element of any Ceph cluster is the quorum of monitors (or mons). Typically there are three mons running in a cluster. They must remain highly available and maintain their quorum or else the data in the cluster will not be available. When you [create the cluster](https://rook.io/docs/rook/v0.8/ceph-quickstart.html#create-a-rook-cluster), Rook will:

- Start the mons on unique nodes and ensure they are in quorum
- Monitor the mons periodically (every minute) to ensure they remain in quorum. If a mon goes down and does not automatically restart with the built-in Kubernetes mechanisms, the operator will add a new mon to the quorum and remove the failed mon from quorum.
- Update clients and Ceph daemons with the ip addresses of the mons when they failover

## Mgr

The mgr is a stateless service that must remain running to provide metrics and other features for the cluster. Beyond starting the mgr for its [core responsibilities](http://docs.ceph.com/docs/luminous/mgr/), Rook configures two mgr plugins to:

- Collect prometheus [metrics](https://rook.io/docs/rook/v0.8/monitoring.html), if prometheus is running in the cluster
- Run the Ceph [dashboard](https://rook.io/docs/rook/v0.8/ceph-dashboard.html), including a service endpoint to connect to

## OSDs

The most challenging part of the cluster is typically the OSDs, the core storage components of the cluster. Large clusters have many of them and manually setting them up and monitoring them is the last thing you want to do. Rook will configure them for you in one of two modes, depending on how much control you want to keep over the individual devices. See [this topic](https://rook.io/docs/rook/v0.8/ceph-cluster-crd.html#storage-selection-settings) for more details on the settings available for the OSDs.

### Fully automated

The simplest way for Rook to initialize the OSDs is by declaring that you want to "use all nodes" and "use all devices". This means that the operator will automatically start OSDs on all nodes in the Kubernetes cluster that have available devices. The available devices are discovered by Rook and initialized with OSDs with the simple criteria:

- The device has no partitions
- The device has no formatted file systems

Rook will never attempt to consume a device that does not satisfy that criteria. When the operator is completed, typically within minutes, you will have a storage cluster with all the OSDs configured.

### Fully declarative

The second mode to configure your OSDs gives you much more control over which nodes and which devices to consume in the cluster. There are a number of settings with varying levels of automated control.

- Nodes:
    - Declare a specific list of nodes where OSDs should be started
    - Use Kubernetes [placement](https://rook.io/docs/rook/v0.8/ceph-cluster-crd.html#placement-configuration-settings) constructs to declare a set of nodes based on labels
- Devices:
    - Declare individual device names on which to start OSDs
    - Declare a more general filter for device names on which to start OSDs
    - Specify a high performance SSD or NVME device on which to create the metadata partitions for bluestore, with the bluestore data partition on a different device

This mode gives you the full control over which devices will be consumed, while taking care of all the details of initializing the OSDs for you.

## Client Access

In Kubernetes, clients who need storage will use a [persistent volume](https://kubernetes.io/docs/concepts/storage/volumes/) attached and mounted to a pod. Rook provides a FlexVolume plugin that will make it easy for your pods to consume the storage from the Ceph cluster. All you need to do is declare a storage class with the pool to consume, then declare a PVC on your pod that points to the storage class. [This example](https://rook.io/docs/rook/v0.8/block.html) will explain all the details of mounting the RBD  image in your pod.

## RGW

Beyond the basic RADOS cluster, Rook will also help you manage your [object store(s)](https://rook.io/docs/rook/v0.8/object.html). When you declare that you want an object store in your cluster, Rook will:

- Create the metadata and data pools for the object store
- Start the RGW daemon, running with multiple instances for higher reliability if desired
- Create a  Kubernetes service to provide load balancing across the RGW daemons

Voila! Object storage is available in your cluster.

## MDS

Last, but not least, Rook will configure CephFS for scenarios where you need a [shared file system](https://rook.io/docs/rook/v0.8/filesystem.html) in the cluster. When you declare that you want a file system in your cluster, Rook will:

- Create the metadata and data pools for CephFS
- Create the file system
- Start the MDS with the desired number of active and standby instances

The file system can now be consumed by pods in the cluster, either by sharing the same path or an independent path in CephFS for each pod. See [this example](https://rook.io/docs/rook/v0.8/filesystem.html#consume-the-shared-file-system-k8s-registry-sample) on declaring a Kubernetes volume with the Rook volume plugin.

## Ceph Tools

Even with all the automation, we know you will still need access to the full Ceph tools to run some maintenance tasks. Over time as more automation is added, you should need these tools less and less. In the meantime, if you need to run the Ceph tools all you need to do is start the [toolbox](https://rook.io/docs/rook/v0.8/toolbox.html) or else connect to an [existing daemon](https://rook.io/docs/rook/v0.8/toolbox.html#troubleshooting-without-the-toolbox) container such as a mon to execute the tools.

## What's Next

All Rook requires to run is a Kubernetes cluster where storage is to be configured. Rook's goal is to make your life easier to configure storage. So far we are just scratching on the surface of what can be automated and simplified with the management of Ceph.

We are actively developing the [Rook project](https://github.com/rook/rook) and are planning a number of features coming up soon. We hope you'll join the community and we'll look forward to hearing from you. If you have any questions or feedback, come find us in the Rook [Slack](https://rook-slackin.herokuapp.com/). Talk to you soon!
