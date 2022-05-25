---
title: "v0.61.6 Cuttlefish update released"
date: "2013-07-24"
author: "sage"
tags: 
  - "release"
  - "cuttlefish"
---

There was a problem with the monitor daemons in v0.61.5 that would prevent them from restarting after some period of time.  This release fixes the bug and works around the issue to allow affected monitors to restart.  All v0.61.5 users are strongly recommended to upgrade.

Notable changes:

- mon: record latest full osdmap
- mon: work around previous bug in which latest full osdmap was not recorded
- mon: avoid scrub while paxos is updating

For more information please see [the complete release notes](http://ceph.com/docs/master/release-notes/#v0-61-6-cuttlefish).

You can get v0.61.6 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.61.6.tar.gz](http://ceph.com/download/ceph-0.61.6.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-6-cuttlefish-update-released/&bvt=rss&p=wordpress)
