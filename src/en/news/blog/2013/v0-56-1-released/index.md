---
title: "v0.56.1 released"
date: "2013-01-08"
author: "sage"
tags: 
  - "planet"
---

We found a few critical problems with v0.56, and fixed a few outstanding problems.  v0.56.1 is ready, and we’re pretty pleased with it!

There are two critical fixes in this update: a fix for possible data loss or corruption if power is lost, and a protocol compatibility problem that was introduced in v0.56 (between v0.56 and any other version of ceph).

- osd: fix commit sequence for XFS, ext4 (or any other non-btrfs) to prevent data loss on power cycle or kernel panic
- osd: fix compatibility for CALL operation
- osd: process old osdmaps prior to joining cluster (fixes slow startup)
- osd: fix a couple of recovery-related crashes
- osd: fix large io requests when journal is in (non-default) aio mode
- log: fix possible deadlock in logging code

This release will kick off the bobtail backport series, and will get a shiny new URL for it’s home.

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.56.1.tar.gz](http://ceph.com/download/ceph-0.56.1.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-56-1-released/&bvt=rss&p=wordpress)
