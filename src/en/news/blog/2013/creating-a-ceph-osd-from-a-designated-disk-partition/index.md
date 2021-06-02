---
title: "Creating a Ceph OSD from a designated disk partition"
date: "2013-11-18"
author: "loic"
tags: 
  - "ceph"
---

When a new [Ceph](http://ceph.com/) OSD is setup with ceph-disk on a designated disk partition ( say /dev/sdc3 ), it will [not be prepared](https://github.com/ceph/ceph/blob/v0.67.4/src/ceph-disk#L1027) and the [sgdisk command](https://github.com/ceph/ceph/blob/v0.67.4/src/ceph-disk#L1034) must be run manually:

\# osd\_uuid=$(uuidgen)
# partition\_number=3
# ptype\_tobe=[89c57f98-2fe5-4dc0-89c1-f3ad0ceff2be](https://github.com/ceph/ceph/blob/v0.67.4/src/ceph-disk#L65)
# sgdisk --change-name="${partition\_number}:ceph data" \\
       --partition-guid="${partition\_number}:{osd\_uuid}" \\
       --typecode="${partition\_number}:${ptype\_tobe}"
       /dev/sdc
# sgdisk --info=3 /dev/sdc
Partition GUID code: 89C57F98-2FE5-4DC0-89C1-F3AD0CEFF2BE (Unknown)
Partition unique GUID: 22FD939D-C203-43A9-966A-04570B63FABB
...
Partition name: 'ceph data'

The [ptype\_tobe](https://github.com/ceph/ceph/blob/v0.67.4/src/ceph-disk#L65) is a partition type known to Ceph and set when it is being worked on. Assuming **/dev/sda** is a SSD disk from which a journal partition can be created, the OSD can be prepared with:

\# ceph-disk prepare --osd-uuid "$osd\_uuid" \\
     --fs-type xfs --cluster ceph -- \\
     /dev/sdc3 /dev/sda
WARNING:ceph-disk:OSD will not be hot-swappable if ...
Information: Moved requested sector from 34 to 2048 in
order to align on 2048-sector boundaries.
The operation has completed successfully.
meta-data=/dev/sdc3              isize=2048   agcount=4, agsize=61083136 blks
         =                       sectsz=512   attr=2, projid32bit=0
data     =                       bsize=4096   blocks=244332544, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0
log      =internal log           bsize=4096   blocks=119303, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0

The journal and data partitions should be associated with each other :

\# ceph-disk list
/dev/sda :
 **/dev/sda1 ceph journal, for /dev/sdc3**
/dev/sdb :
 /dev/sdb2 other, ext4, mounted on /
 /dev/sdb3 swap, swap
/dev/sdc :
 /dev/sdc1 other, primary
 /dev/sdc2 other, ext4, mounted on /mnt
 **/dev/sdc3 ceph data, prepared, cluster ceph, journal /dev/sda1**

The type of the partition can be changed so that [udev triggered scripts notice it and provision the osd](http://dachary.org/?p=2428).

\# ptype=[4fbd7e29-9d25-41b8-afd0-062c0ceff05d](https://github.com/ceph/ceph/blob/v0.67.4/src/ceph-disk#L63)
# sgdisk --typecode="${partition\_number}:${ptype}" /dev/sdc
# udevadm trigger --subsystem-match=block --action=add
# df | grep /var/lib/ceph
/dev/sdc3       932G 160M  931G   1% /var/lib/ceph/osd/ceph-9
