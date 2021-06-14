---
title: "Migrating from ganeti to OpenStack via Ceph"
date: "2013-11-13"
author: "loic"
tags: 
  - "ceph"
---

On [ganeti](http://code.google.com/p/ganeti/), shutdown the instance and activate its disks:

z2-8:~# gnt-instance shutdown nerrant
Waiting for job 1089813 for nerrant...
z2-8:~# gnt-instance activate-disks nerrant
z2-8.host.gnt:disk/0:/dev/drbd10

On an [OpenStack Havana](http://redmine.the.re/projects/there/wiki/HOWTO_setup_OpenStack) installation using a [Ceph](http://ceph.com/) cinder backend, create a volume with the same size:

\# cinder create --volume-type ovh --display-name nerrant 10
+---------------------+--------------------------------------+
|       Property      |                Value                 |
+---------------------+--------------------------------------+
|     attachments     |                  \[\]                  |
|  availability\_zone  |                 nova                 |
|       bootable      |                false                 |
|      created\_at     |      2013-11-12T13:00:39.614541      |
| display\_description |                 None                 |
|     display\_name    |              nerrant                 |
|          id         | 3ec2035e-ff76-43a9-bbb3-6c003c1c0e16 |
|       metadata      |                  {}                  |
|         size        |                  10                  |
|     snapshot\_id     |                 None                 |
|     source\_volid    |                 None                 |
|        status       |               creating               |
|     volume\_type     |                 ovh                  |
+---------------------+--------------------------------------+
# rbd --pool ovh info volume-3ec2035e-ff76-43a9-bbb3-6c003c1c0e16
rbd image 'volume-3ec2035e-ff76-43a9-bbb3-6c003c1c0e16':
        size 10240 MB in 2560 objects
        order 22 (4096 KB objects)
        block\_name\_prefix: rbd\_data.90f0417089fa
        **format: 2**
        features: layering

On a host connected to the Ceph cluster and running a linux-kernel > 3.8 ( because of the **format: 2** above ), map to a bloc device with:

\# rbd map --pool ovh volume-3ec2035e-ff76-43a9-bbb3-6c003c1c0e16
# rbd showmapped
id pool image                                       snap device
1  ovh  volume-3ec2035e-ff76-43a9-bbb3-6c003c1c0e16 - /dev/rbd1

Copy the ganeti volume with:

z2-8:~# pv < /dev/drbd10 | ssh bm0014 dd of=/dev/rbd1
2,29GB 0:09:14 \[4,23MB/s\] \[==========================>      \] 22% ETA 0:31:09

and unmap the device when it completes.

rbd unmap /dev/rbd1

The volume is ready to boot.
