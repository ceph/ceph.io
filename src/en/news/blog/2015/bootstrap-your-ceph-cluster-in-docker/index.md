---
title: "Bootstrap your Ceph cluster in Docker"
date: "2015-06-22"
author: "shan"
tags: 
  - "planet"
---

![Bootstrap your Ceph cluster in Docker](http://sebastien-han.fr/images/bootstrap-ceph-cluster-docker.jpg)

Almost two years have passed since my first attempt to [run Ceph inside Docker](http://www.sebastien-han.fr/blog/2013/09/19/how-I-barely-got-my-first-ceph-mon-running-in-docker/). Time has elapsed and I haven't really got the time to resume this work until recently. For the last couple of months, I have been devoting a third part of my time to contributing on deploying [Ceph in Docker](https://github.com/ceph/ceph-docker). Before we start, I would like to highlight that nothing of this work would have been possible without the help of [Seán C. McCord](http://www.cycoresys.com/). Indeed the current ceph-docker repository is based on Seán's initial work. Let's see how you can get this running!

  
  

# Rationale

Running Ceph inside Docker is a bit controversial and many people might believe that there is no point doing this. Where it is not really a problem for Monitors, Metadata Server and Rados Gateway to be containerized things get tricky when it comes to the OSDs. The Ceph OSD is really tighten to the machine it runs on, having such strong relationship with the hardware is not something common for all the softwares. Given that the OSD can not work if the disk that it relies on die is a bit of an issue in this container world.

To be honest at some point, I was thinking this:

> I don't know why am I doing this. I just know that people out there want it (and yes they probably don't know why). I can feel it's important to do it anyway, so let's do it.

This does not sound really optimistic I know, but it's somehow the truth. My vision has slightly changed though, so for what it's worth let me explain why. We will see if you will change your mind as well. And yes my explanation will be more than: Docker is fancy, so let's Dockerize everything.

People have started investing a lot of engineering efforts to run containerized softwares on their platforms. Thus they have been using various tools to build and orchestrate their environment. And I won't be surprised to see Kubernetes being the orchestration tool for this matter. Some people also love to run bleeding edge technologies on production as they might find other things boring (right Seán?). So with the _containerize everything_ approach, they will be happy that something is happening on their favorite open source storage solution :).

Where with `yum` or `apt-get` it is not easy to rollback, this is different with containers. Upgrades and rollback are made easier, as you can easily `docker stop` and `docker run` a new version of your daemons. You can also potentially run different clusters on an isolated fashion on the same machine. This makes development ideal.

  
  

# The project

As mentioned, everything started from Seán C. McCord work and we iterated around his work together. Currently if you use ceph-docker you will be able to run every single Ceph daemon either on Ubuntu or CentOS. We have a lot of images available on [Docker Hub](https://hub.docker.com/). We have the Ceph namespace, so our images are prefixed as `ceph/<daemon>`. We use automated builds, as a result everytime we merge a new patch and new build gets triggered and produces a new version of the container image. As we are currently in a refactoring process, you will see that a lot of images are available. Historically we had (and we still do until we merge this [patch](https://github.com/ceph/ceph-docker/pull/94)) one image per daemon. So one container image for monitor, osd, mds and radosgw. This is not really ideal and in practice not needed. This is why we [worked](https://github.com/ceph/ceph-docker/pull/78) on a single container image called `daemon`. This image contains all the Ceph daemons and you activate the one you want with a parameter while invoking the `docker run` command. That being said, if you want to start I encourage you to directly use the `ceph/daemon` image. I will show example in the next section on how to run it.

  
  

# Containerize Ceph

## Monitors

Given that monitors can not communicate through a NATed network we need to use the `--net=host` to expose Docker's host machine network stack:

```
$ sudo docker run -d --net=host \
-v /etc/ceph:/etc/ceph \
-v /var/lib/ceph/:/var/lib/ceph \
-e MON_IP=192.168.0.20 \
-e CEPH_PUBLIC_NETWORK=192.168.0.0/24 \
ceph/daemon mon
```

List of available options:

- `MON_IP` is the IP address of your host running Docker
- `MON_NAME` is the name of your monitor (DEFAULT: $(hostname))
- `CEPH_PUBLIC_NETWORK` is the CIDR of the host running Docker, it should be in the same network as the `MON_IP`
- `CEPH_CLUSTER_NETWORK` is the CIDR of a secondary interface of the host running Docker. Used for the OSD replication traffic.

  

## Object Storage Daemon

The current implementation allows you to run a single OSD process per container Following the microservice mindset we should not run more than one service inside our container. In our case, running multiple OSD processes into a single container breaks this rule and will likely introduce undesirable behaviours. This will also increase the setup and maintenance complexity of the solution.

In this configuration, the usage of `--privileged=true` is strictly required because we need a full access to `/dev/` and other kernel functions. However, we support another configuration based on simply exposing OSD directories, where the operators will do the appropriate preparation of the devices. Then he/she will simply expose the OSD directory and populating (`ceph-osd mkfs`) the OSD will be done by the entrypoint. The configuration I'm presenting now is easier to start with because you only need to specify a block device and the entrypoint will do the rest.

For those who do not want to use `--privileged=true`, please fall back on the second example.

```
$ sudo docker run -d --net=host \
--privileged=true \
-v /etc/ceph:/etc/ceph \
-v /var/lib/ceph/:/var/lib/ceph \
-v /dev/:/dev/ \
-e OSD_DEVICE=/dev/vdd \
ceph-daemon osd_ceph_disk
```

If you don't want to use `--privileged=true` you can always prepare the OSD by yourself with the help of your configuration management of your choice.

Example without a privileged mode, in this example we assume that you partitioned, put a filesystem and mounted the OSD partition. To create your OSDs simply run the following command:

```
$ sudo docker exec <mon-container-id> ceph osd create.
```

Then run your container like so:

```
docker run -v /osds/1:/var/lib/ceph/osd/ceph-1 -v /osds/2:/var/lib/ceph/osd/ceph-2

$ sudo docker run -d --net=host \
-v /etc/ceph:/etc/ceph \
-v /var/lib/ceph/:/var/lib/ceph \
-v /osds/1:/var/lib/ceph/osd/ceph-1 \
ceph-daemon osd_disk_directory
```

List of available options:

- `OSD_DEVICE` is the OSD device, ie: `/dev/sdb`
- `OSD_JOURNAL` is the device that will be used to store the OSD's journal, ie: `/dev/sdz`
- `HOSTNAME` is the hostname of the hostname of the container where the OSD runs (DEFAULT: $(hostname))
- `OSD_FORCE_ZAP` will force zapping the content of the given device (DEFAULT: 0 and 1 to force it)
- `OSD_JOURNAL_SIZE` is the size of the OSD journal (DEFAULT: 100)

  

## Metadata Server

This one is pretty straighforward and easy to bootstrap. The only caviat at the moment is that we require the Ceph admin key to be available in the Docker. This key will be used to create the CephFS pools and the filesystem.

If you run an old version of Ceph (prior to 0.87) you don't need this, but you will likely do since it is always better to run the last version!

```
$ sudo docker run -d --net=host \
-v /var/lib/ceph/:/var/lib/ceph \
-v /etc/ceph:/etc/ceph \
-e CEPHFS_CREATE=1 \
ceph-daemon mds
```

List of available options:

- `MDS_NAME` is the name of the Metadata server (DEFAULT: mds-$(hostname))
- `CEPHFS_CREATE` will create a filesystem for your Metadata server (DEFAULT: 0 and 1 to enable it)
- `CEPHFS_NAME` is the name of the Metadata filesystem (DEFAULT: cephfs)
- `CEPHFS_DATA_POOL` is the name of the data pool for the Metadata Server (DEFAULT: cephfs\_data)
- `CEPHFS_DATA_POOL_PG` is the number of placement groups for the data pool (DEFAULT: 8)
- `CEPHFS_DATA_POOL` is the name of the metadata pool for the Metadata Server (DEFAULT: cephfs\_metadata)
- `CEPHFS_METADATA_POOL_PG` is the number of placement groups for the metadata pool (DEFAULT: 8)

  

## Rados Gateway

For the Rados Gateway, we deploy it with `civetweb` enabled by default. However it is possible to use different CGI frontends by simply giving remote address and port.

```
$ sudo docker run -d --net=host \
-v /var/lib/ceph/:/var/lib/ceph \
-v /etc/ceph:/etc/ceph \
ceph-daemon rgw
```

List of available options:

- `RGW_REMOTE_CGI` defines if you use the embedded webserver of Rados Gateway or not (DEFAULT: 0 and 1 to disable it)
- `RGW_REMOTE_CGI_HOST` is the remote host running a CGI process
- `RGW_REMOTE_CGI_PORT` is the remote port of the host running a CGI process
- `RGW_CIVETWEB_PORT` is the listenning port of civetweb (DEFAULT: 80)
- `RGW_NAME` is the name of the Rados Gateway instance (DEFAULT: $(hostname))

  
  

# Further work

## Configuration store backends

By default, the `ceph.conf` and all the ceph keys are generated during the initial monitor bootstrap. This process assumes that to extand your cluster to multiple nodes you have to distribute these configurations across all the nodes. This is not really flexible and we want to improve this. One thing that I will propose soon is to use Ansible to generate the configuration/keys and to distribute them on all the machines.

Alternatively, we want to be able to store various configuration files on different backends kv store like [etcd](https://github.com/coreos/etcd) and [consul](https://www.consul.io/).

  

## Orchestrate the deployment

A very first step is to use [ceph-ansible](https://github.com/ceph/ceph-ansible) where the logic is already implemented. I just need to push some changes, but most of the work is already present.

[Kubernetes](http://kubernetes.io/), a preview on how to bootstrap monitors is already [available](https://github.com/ceph/ceph-docker/tree/master/examples/kubernetes).

  

## Extending to Rocket and beyond

There is not much to do here as you can simply port your Docker images into Rocket and launch them (pun intented here).

  

# Bonus video

[A video demo is available](https://www.youtube.com/watch?v=FUSTjTBA8f8)


> Once again, I would like to take the opportunity to thank Seán C. McCord who has made it possible. Seán is a nice person to work with and I'm looking forward to contributing with him to ceph-docker!
