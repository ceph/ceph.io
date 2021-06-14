---
title: "Getting started with the Docker RBD volume plugin"
date: "2015-08-17"
author: "shan"
tags: 
  - "planet"
---

{% img center http://sebastien-han.fr/images/docker-ceph-rbd-volume-plugin.jpg Getting started with the Docker RBD volume plugin %}

Docker 1.8 was just released a week ago and with it came the support for volume plugin. Several volume plugins are available but today I will be introducing the Ceph RBD ones (yes there are currently 3 different drivers).

  
  

# I. Get Docker

First make sure you at least have the 1.8 version of Docker, if not you can simply run the following:

```
$ curl -sSL https://get.docker.com/ | sh
$ docker --version
Docker version 1.8.1, build d12ea79
```

  

# II. Configure the volume plugin

As mentioned in the introduction, there are currently 3 different drivers that aim to do the same thing :):

- [Yp engineering](https://github.com/yp-engineering/rbd-docker-plugin) is the one I tested.
- [AcalephStorage](https://github.com/AcalephStorage/docker-volume-ceph-rbd)
- [Volplugin](https://github.com/contiv/volplugin)

I have to admit that the way I chosed to start with the driver from yp-engineering was really arbitrary. Thus I don't much knowledge about the others and I can not provide you with much feedback.

Let's start by installing the necessary components:

```
$ sudo apt-get install -y golang librados-dev librbd-dev ceph-common xfsprogs
$ export GOPATH=$HOME
$ export PATH=$PATH:$GOPATH/bin
$ go get github.com/yp-engineering/rbd-docker-plugin
$ sudo rbd-docker-plugin -h
Usage of rbd-docker-plugin:
  -cluster="": Ceph cluster
  -config="": Ceph cluster config
  -create=false: Can auto Create RBD Images
  -fs="xfs": FS type for the created RBD Image (must have mkfs.type)
  -logdir="/var/log": Logfile directory
  -mount="/var/lib/docker/volumes": Mount directory for volumes on host
  -name="rbd": Docker plugin name for use on --volume-driver option
  -plugins="/run/docker/plugins": Docker plugin directory for socket
  -pool="rbd": Default Ceph Pool for RBD operations
  -remove=false: Can Remove (destroy) RBD Images (default: false, volume will be renamed zz_name)
  -size=20480: RBD Image size to Create (in MB) (default: 20480=20GB)
  -user="admin": Ceph user
  -version=false: Print version
```

As you see, the RBD volume plugin supports several options cluster name, user The volume plugin has 2 different methods to provision volumes:

- manually, where you have to create the RBD image and put a filesystem on it by yourself. This is interesting when you know that the size of each volume can vary. If it does not you should probably configure the plugin to do it for you.
- automatically, where the plugin will create the image and the filesystem for you.

The service can work with systemd with this [unit file](https://github.com/yp-engineering/rbd-docker-plugin/blob/master/systemd/rbd-docker-plugin.service). For the purpose of this tutorial, I will run it through stdout.

  

# III. Run it!

Before starting the service, I am going to configure Ceph for it:

```
$ sudo ceph osd pool create docker 128
pool 'docker' created
$ sudo ceph auth get-or-create client.docker mon 'allow r' osd 'allow class-read object_prefix rbd_children, allow rwx pool=docker' -o /etc/ceph/ceph.client.docker.keyring
```

I like the fact that the volume plugin can configure the volume for me so I will configure it to do so. Let's start the service:

```
$ sudo rbd-docker-plugin --create --user=docker --pool=docker &
```

The driver writes a socket under `/run/docker/plugins/rbd.sock`, this socket will be used by Docker to perform the necessary actions (create the volume, do the bindmount etc...).

  

# IV. Use it!

Now I am going to run a 'bash' container to inspect what is happening:

```
$ sudo docker run -it --volume-driver=rbd --volume foo:/mnt/foo ceph/base bash
root@712e78060cfb:/#
root@712e78060cfb:/# df -h
Filesystem                          Size  Used Avail Use% Mounted on
rootfs                              158G   13G  139G   9% /
none                                158G   13G  139G   9% /
tmpfs                               2.0G     0  2.0G   0% /dev
shm                                  64M     0   64M   0% /dev/shm
tmpfs                               2.0G     0  2.0G   0% /sys/fs/cgroup
/dev/rbd1                            20G   33M   20G   1% /mnt/foo
/dev/disk/by-label/cloudimg-rootfs  158G   13G  139G   9% /etc/hosts
tmpfs                               2.0G     0  2.0G   0% /proc/kcore
tmpfs                               2.0G     0  2.0G   0% /proc/latency_stats
tmpfs                               2.0G     0  2.0G   0% /proc/timer_stats
root@712e78060cfb:/# touch /mnt/foo/bar
```

What happened under the hood?

The driver did several things:

- created a 20 GB image
- put a XFS filesystem on top of it
- mapped the image and bindmounted the filesystem to the container

After you shutdown the container, the volume will persist (if not using `-rm` to run your container) so you can easily run a new container and re-use it.

  

> The driver looks really promising. Sbraaa! I think I will also give a look at the multi-filesystem drivers ([Flocker](https://github.com/ClusterHQ/flocker), [Convoy](https://github.com/rancher/convoy),[Rexray](https://github.com/emccode/rexray)) as they bring interesting perspectives to the volume plugins. Sbraaa!
