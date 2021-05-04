---
title: "The Kernel 4.1 Is Out"
date: "2015-06-22"
author: "laurentbarbe"
tags: 
  - "planet"
---

This kernel version support all features for Hammer, in particular straw v2.

[https://www.kernel.org/](https://www.kernel.org/)

The main changes in this version:

```
rbd: rbd_wq comment is obsolete
libceph: announce support for straw2 buckets
crush: straw2 bucket type with an efficient 64-bit crush_ln()
crush: ensuring at most num-rep osds are selected
crush: drop unnecessary include from mapper.c
ceph: fix uninline data function
ceph: rename snapshot support
ceph: fix null pointer dereference in send_mds_reconnect()
ceph: hold on to exclusive caps on complete directories
libceph: simplify our debugfs attr macro
ceph: show non-default options only
libceph: expose client options through debugfs
libceph, ceph: split ceph_show_options()
rbd: mark block queue as non-rotational
libceph: don't overwrite specific con error msgs
ceph: cleanup unsafe requests when reconnecting is denied
ceph: don't zero i_wrbuffer_ref when reconnecting is denied
ceph: don't mark dirty caps when there is no auth cap
ceph: keep i_snap_realm while there are writers
libceph: osdmap.h: Add missing format newlines
```

[https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=1204c464458e9837320a326a9fce550e3c5ef5de](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=1204c464458e9837320a326a9fce550e3c5ef5de)

[http://cephnotes.ksperis.com/blog/2014/01/21/feature-set-mismatch-error-on-ceph-kernel-client](http://cephnotes.ksperis.com/blog/2014/01/21/feature-set-mismatch-error-on-ceph-kernel-client)
