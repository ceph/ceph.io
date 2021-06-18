---
title: "v0.61.8 Cuttlefish released"
date: "2013-08-19"
author: "sage"
tags: 
---

We’ve made another point release for Cuttlefish.  This release contains a number of fixes that are generally not individually critical, but do trip up users from time to time, are non-intrusive, and have held up under testing.

Notable changes include:

- librados: fix async aio completion wakeup
- librados: fix aio completion locking
- librados: fix rare deadlock during shutdown
- osd: fix race when queueing recovery operations
- osd: fix possible race during recovery
- osd: optionally preload rados classes on startup (disabled by default)
- osd: fix journal replay corner condition
- osd: limit size of peering work queue batch (to speed up peering)
- mon: fix paxos recovery corner case
- mon: fix rare hang when monmap updates during an election
- mon: make ‘osd pool mksnap …’ avoid exposing uncommitted state
- mon: make ‘osd pool rmsnap …’ not racy, avoid exposing uncommitted state
- mon: fix bug during mon cluster expansion
- rgw: fix crash during multi delete operation
- msgr: fix race conditions during osd network reinitialization
- ceph-disk: apply mount options when remounting

For more detailed information, please see the [detailed release notes](http://ceph.com/docs/master/release-notes/#v0-61-8-cuttlefish) and [complete changelog](http://ceph.com/docs/master/_downloads/v0.61.8.txt).

You can get v0.61.8 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.61.8.tar.gz](http://ceph.com/download/ceph-0.61.8.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-8-cuttlefish-released/&bvt=rss&p=wordpress)
