---
title: "RBD: rados block driver"
date: "2010-03-19"
author: "sage"
tags: 
---

Christian Brunner sent an initial implementation of ‘rbd’, a librados-based block driver for qemu/KVM, to the ceph-devel list last week.   A few minor nits aside, it looks pretty good and works well.  The basic idea is to stripe a VM block device over (by default) 4MB objects stored in the Ceph distributed object store.  This gives you shared block storage to facilitate VM migration between hosts and fancy things like that.  The implementation is super simple: it’s just a few hundred lines wiring the qemu storage abstraction up to librados. (This is very similar to what the [Sheepdog](http://www.osrg.net/sheepdog/) folks are doing.)

We’re currently hacking together a proper rbd Linux block device for the kernel, as well, based on the osdblk device (which turns a SCSI T10 OSD object into a block device).  The goal is to make the two compatible.  At this stage you can create an rbd block device, format (mke2fs) and mount it, and it seems to work.

Both drivers will eventually get snapshot support.

Stay tuned!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/updates/rbd-rados-block-driver/&bvt=rss&p=wordpress)
