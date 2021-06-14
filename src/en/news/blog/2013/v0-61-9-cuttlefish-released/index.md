---
title: "v0.61.9 Cuttlefish released"
date: "2013-10-17"
author: "sage"
tags: 
  - "planet"
---

This point release resolves several low to medium-impact bugs across the code base, and fixes a performance problem (CPU utilization) with radosgw. We recommend that all production cuttlefish users upgrade.

Notable changes:

- ceph, ceph-authtool: fix help (Danny Al-Gaaf)
- ceph-disk: partprobe after creating journal partition
- ceph-disk: specific fs type when mounting (Alfredo Deza)
- ceph-fuse: fix bug when compiled against old versions
- ceph-fuse: fix use-after-free in caching code (Yan, Zheng)
- ceph-fuse: misc caching bugs
- ceph.spec: remove incorrect mod\_fcgi dependency (Gary Lowell)
- crush: fix name caching
- librbd: fix bug when unpausing cluster (Josh Durgin)
- mds: fix LAZYIO lock hang
- mds: fix bug in file size recovery (after client crash)
- mon: fix paxos recovery corner case
- osd: fix exponential backoff for slow request warnings (Loic Dachary)
- osd: fix readdir\_r usage
- osd: fix startup for long-stopped OSDs
- rgw: avoid std::list::size() to avoid wasting CPU cycles (Yehuda Sadeh)
- rgw: drain pending requests during write (fixes data safety issue) (Yehuda Sadeh)
- rgw: fix authenticated users group ACL check (Yehuda Sadeh)
- rgw: fix bug in POST (Yehuda Sadeh)
- rgw: fix sysvinit script ‘status’ command, return value (Danny Al-Gaaf)
- rgw: reduce default log level (Yehuda Sadeh)

For more detailed information, see the [release notes](http://ceph.com/docs/master/release-notes/#v0-61-9-cuttlefish) or [complete changelog](http://ceph.com/docs/master/_downloads/v0.61.9.txt).

You can get v0.61.9 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.61.9.tar.gz](http://ceph.com/download/ceph-0.61.9.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-9-cuttlefish-released/&bvt=rss&p=wordpress)
