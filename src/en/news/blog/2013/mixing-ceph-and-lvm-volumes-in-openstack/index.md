---
title: "Mixing Ceph and LVM volumes in OpenStack"
date: "2013-11-19"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

Ceph pools are defined to [collocate volumes and instances](http://dachary.org/?p=2494) in [OpenStack](http://openstack.org/) [Havana](http://www.openstack.org/software/havana/). For volumes that do not need the resilience provided by Ceph, a [LVM](http://en.wikipedia.org/wiki/Logical_Volume_Manager_%28Linux%29) [cinder backend](http://docs.openstack.org/admin-guide-cloud/content/managing-volumes.html#multi_backend) is defined in **/etc/cinder/cinder.conf**:

\[lvm\]
volume\_group=cinder-volumes
volume\_driver=cinder.volume.drivers.lvm.LVMISCSIDriver
volume\_backend\_name=LVM

and appended to the list of existing backends:

enabled\_backends=rbd-default,rbd-ovh,rbd-hetzner,rbd-cloudwatt,**lvm**

A cinder volume type is created and associated with it:

\# cinder type-create lvm
+--------------------------------------+------+
|                  ID                  | Name |
+--------------------------------------+------+
| c77552ff-e513-4851-a5e6-2c83d0acb998 | lvm  |
+--------------------------------------+------+
# cinder type-key lvm set volume\_backend\_name=LVM
#  cinder extra-specs-list
+--------------------------------------+-----------+--------------------------------------------+
|                  ID                  |    Name   |                extra\_specs                 |
+--------------------------------------+-----------+--------------------------------------------+
...
| c77552ff-e513-4851-a5e6-2c83d0acb998 |    lvm    |      {u'volume\_backend\_name': u'LVM'}      |
...
+--------------------------------------+-----------+--------------------------------------------+

To reduce the network overhead, a backend availability zone is defined for each bare metal by adding to **/etc/cinder/cinder.conf**:

storage\_availability\_zone=bm0015

and restarting cinder-volume:

\# restart cinder-volume
# sleep 5
# cinder-manage host list
host                            zone
...
bm0015.the.re@lvm               bm0015
...

where **bm0015** is the hostname of the machine. To create a LVM backed volume that is located on **bm0015**:

cinder create --availability-zone bm0015 --volume-type lvm --display-name test 1

In order for the allocation of RBD volumes to keep working without specifying an availability zone, there must be at least one cinder volume running in the default availability zone ( **nova** presumably ) and configured with the expected RBD backends. This can be checked with:

\# cinder-manage host list | grep nova
...
bm0017.the.re@rbd-cloudwatt     nova
bm0017.the.re@rbd-ovh           nova
bm0017.the.re@lvm               nova
bm0017.the.re@rbd-default       nova
bm0017.the.re@rbd-hetzner       nova
...

In the above the **lvm** volume type is also available in the **nova** availability zone and is used as a catch all when a LVM volume is prefered but collocating it on the same machine as the instance does not matter.
