---
title: "v0.61.2 released"
date: "2013-05-14"
author: "sage"
tags: 
  - "planet"
---

This release has only two changes: it disables a debug log by default that consumes disk space on the monitor, and fixes a bug with upgrading bobtail monitor stores with duplicated GV values. We urge all v0.61.1 users to upgrade to avoid filling the monitor data disks.

- mon: fix conversion of stores with duplicated GV values
- mon: disable ‘mon debug dump transactions’ by default

You can get v0.61.2 from the usual places:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.61.2.tar.gz](http://ceph.com/download/ceph-0.61.2.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-2-released/&bvt=rss&p=wordpress)
