---
title: "Rados Block Device merged for 2.6.37"
date: "2010-10-29"
author: "sage"
tags: 
  - "planet"
---

The Linux kernel merge window is open for v2.6.37, and RBD (rados block device) has finally been merged.  RBD lets you create a block device in Linux that is striped over objects stored in a Ceph distributed object store.  This basic approach gives you some nice features:

- “thin provisioning” — space isn’t used in the cluster until you write to it
- reliable — data objects are replicated by Ceph, so no single node failure (besides the mounting host) will take out the device
- scalable — the device can be arbitrarily sized (and resized)
- snapshots — RBD supports read-only named snapshots (and rollback)

One of the nice things about the kernel implementation is that there is relatively little new code; mostly it just reuses the infrastructure already in place for the Ceph file system.  The biggest change is a code refactor that moves much of the old _ceph_ module (fs/ceph) into _libceph_, which includes the networking layer and interaction with the cluster monitor and OSDs (now in net/ceph).  The new _rbd_ module (drivers/block/rbd.c) uses only _libceph_.  One consequence of this refactor is that the [ceph-client-standalone.git](http://ceph.newdream.net/git/?p=ceph-client-standalone.git;a=summary) repository (which includes just the backported module source, allowing you to build ceph and rbd against older kernels) has been reorganized to contain three separate modules.  The new RBD code is currently found in the _unstable_ and _unstable-backport_ branches of [ceph-client-standalone.git](http://ceph.newdream.net/git/?p=ceph-client-standalone.git;a=summary), and the _unstable_ branch of [ceph-client.git](http://ceph.newdream.net/git/?p=ceph-client.git;a=summary).

There is also a new(ish) command line tool _rbd_ that is used for creating and manipulating images (block devices) within the cluster.

For more information about using RBD, see [http://ceph.newdream.net/wiki/Rbd](http://ceph.newdream.net/wiki/Rbd).

