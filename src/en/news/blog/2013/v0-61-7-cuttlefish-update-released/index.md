---
title: "v0.61.7 Cuttlefish update released"
date: "2013-07-25"
author: "sage"
tags: 
  - "release"
  - "cuttlefish"
---

This release fixes another regression preventing monitors to start after undergoing certain upgrade sequences, as well as some corner cases with Paxos and unusual device names in ceph-disk/cephde-loy.

Notable changes:

- mon: fix regression in latest full osdmap retrieval
- mon: fix a long-standing bug with a paxos corner case
- ceph-disk: improved support for unusual device names (e.g., /dev/cciss/c0d0p1)

For more information see the [full release notes](http://ceph.com/docs/master/release-notes/#v0-61-7-cuttlefish).

You can get v0.61.7 from the usual places:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.61.7.tar.gz](http://ceph.com/download/ceph-0.61.7.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-7-cuttlefish-update-released/&bvt=rss&p=wordpress)
