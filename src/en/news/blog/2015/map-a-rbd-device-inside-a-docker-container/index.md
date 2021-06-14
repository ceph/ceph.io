---
title: "Map a RBD device inside a Docker container"
date: "2015-06-26"
author: "shan"
tags: 
  - "planet"
---

{% img center http://sebastien-han.fr/images/map-rbd-device-inside-docker-container.jpg Map a RBD device inside a Docker container %}

People have been having trouble to map a RBD device in a container. Quick tip on how to map a Rados Block Device into a container:

Bootstrap a Ceph demo container:

```
$ docker run -d \
--net=host \
-v /var/lib/ceph:/var/lib/ceph \
-v /etc/ceph:/etc/ceph \
-e MON_IP=192.168.0.1 \
-e CEPH_NETWORK=192.168.0.0/24 \
ceph/demo
```

Enable the Kernel module and create the image:

```
$ sudo modprobe rbd
$ sudo rbd create foo -s 1024
```

Then bootstrap a container, map the container and put a filesystem on top of it:

```
$ sudo docker run -ti -v /dev:/dev -v /sys:/sys --net=host --privileged=true -v /etc/ceph:/etc/ceph ceph/base bash
root@atomic1:/# rbd map foo
/dev/rbd0

root@atomic1:/# rbd showmapped
id pool image snap device
0  rbd  foo   - /dev/rbd0

root@atomic1:/# mkfs.ext4 /dev/rbd0
...
...

root@atomic1:/# mount /dev/rbd0 /mnt/

root@atomic1:/# df -h
Filesystem                 Size  Used Avail Use% Mounted on
/dev/dm-5                   10G  483M  9.6G   5% /
shm                       1001M  8.0K 1001M   1% /dev/shm
tmpfs                     1001M   12K 1001M   1% /run
tmpfs                     1001M     0 1001M   0% /tmp
devtmpfs                   986M     0  986M   0% /dev
tmpfs                     1001M  8.0K 1001M   1% /dev/shm
/dev/mapper/atomicos-root   11G  1.9G  9.1G  18% /etc/ceph
tmpfs                     1001M     0 1001M   0% /sys/fs/cgroup
/dev/rbd0                  976M  1.3M  908M   1% /mnt
```

  

> Et voilà !
