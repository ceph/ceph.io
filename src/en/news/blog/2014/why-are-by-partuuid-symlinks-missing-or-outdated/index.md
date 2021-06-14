---
title: "Why are by-partuuid symlinks missing or outdated ?"
date: "2014-12-13"
author: "loic"
tags: 
  - "ceph"
---

The [ceph-disk](http://workbench.dachary.org/ceph/ceph/blob/giant/src/ceph-disk) script manages [Ceph](http://ceph.com/) devices and rely on the content of the **/dev/disk/by-partuuid** directory which is updated by [udev](https://en.wikipedia.org/wiki/Udev) rules. For instance:

- a new partition is created with `/sbin/sgdisk --largest-new=1 --change-name=1:ceph data --partition-guid=1:83c14a9b-0493-4ccf-83ff-e3e07adae202 --typecode=1:89c57f98-2fe5-4dc0-89c1-f3ad0ceff2be -- /dev/loop4`
- the kernel is notified of the change with [partprobe](http://linux.die.net/man/8/partprobe) or [partx](http://linux.die.net/man/8/partx) and fires a **udev** event
- the udev daemon receives **UDEV \[249708.246769\] add /devices/virtual/block/loop4/loop4p1 (block)** and the **/lib/udev/rules.d/60-persistent-storage.rules** script creates the corresponding symlink.

Let say the partition table is removed later (with `sudo sgdisk --zap-all --clear --mbrtogpt -- /dev/loop4` for instance) and the kernel is not notified with **partprobe** or **partx**. If the first partition is created again and the kernel is notified as above, it will fail to notice any difference and will not send a udev event. As a result **/dev/disk/by-partuuid** will contain a symlink that is outdated.  
The problem can be fixed by manually removing the stale symlink from **/dev/disk/by-partuuid**, clearing the partition table and notifying the kernel again. The events sent to **udev** can be displayed with:

\# udevadm monitor
...
KERNEL\[250902.072077\] change   /devices/virtual/block/loop4 (block)
UDEV  \[250902.100779\] change   /devices/virtual/block/loop4 (block)
KERNEL\[250902.101235\] remove   /devices/virtual/block/loop4/loop4p1 (block)
UDEV  \[250902.101421\] remove   /devices/virtual/block/loop4/loop4p1 (block)
...

The environment and scripts used for a block device can be displayed with

\# udevadm test /block/sdb/sdb1
...
udev\_rules\_apply\_to\_event: IMPORT '/sbin/blkid -o udev -p /dev/sdb/sdb1' /lib/udev/rules.d/60-ceph-partuuid-workaround.rules:28
udev\_event\_spawn: starting '/sbin/blkid -o udev -p /dev/sdb1'
...
