---
title: "rbd (rados block device) status"
date: "2010-08-30"
author: "sage"
tags: 
---

The [rados block device (rbd)](http://ceph.newdream.net/wiki/Rbd) is looking pretty good at this point.  The basic feature set:

- network block device backed by objects in the Ceph distributed object store (rados)
- thinly provisioned
- image resizing
- image export/import/copy/rename
- read-only snapshots
- revert to snapshot
- Linux and qemu/kvm clients

Main items on the the to-do list:

- TRIM
- image layering/copy-on-write
- locking

The server side components are in place in both the v0.21 releases and the unstable branch.  On the client side, there are two options.

First, qemu/kvm can be patched to map an rbd image as a block device.  The code is available in git from

- [git://ceph.newdream.net/git/qemu-kvm.git](http://ceph.newdream.net/git/?p=qemu-kvm.git;a=shortlog;h=refs/heads/rbd) (branch rbd)

Alternatively, Wido has built some patched Ubuntu 10.4 packages for both qemu and libvirt, available from

- deb http://pcx.apt-get.eu/ubuntu lucid unofficial

The qemu/kvm patches will likely be included in the next major qemu release.

The native Linux kernel rbd kernel driver is also quite stable, but did not make it upstream for the 2.6.36 release cycle.  We hope to have it in 2.6.37.  The code for that is available at

- [git://ceph.newdream.net/git/ceph-client.git](http://ceph.newdream.net/git/?p=ceph-client.git;a=shortlog;h=refs/heads/rbd) (branch rbd)

The main hold up there is that the addition of rbd involves refactoring a lot of the common Ceph file system client code into a libceph module that is shared by both rbd and the file system client.  This makes rebasing more difficult, so that branch may not have the most recent fixes in the master branch or the current -rc kernels.  Also, the code reorganization completely breaks my semi-automated ceph-client-standalone.git updates, so for now you can’t clone and build it as a standalone module.

For more information, see the [rbd](http://ceph.newdream.net/wiki/Rbd) and [kvm-rbd](http://ceph.newdream.net/wiki/Kvm-rbd) wiki pages.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/rados/rbd-rados-block-device-status/&bvt=rss&p=wordpress)
