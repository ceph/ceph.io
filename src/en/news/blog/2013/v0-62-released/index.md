---
title: "v0.62 released"
date: "2013-05-14"
author: "sage"
tags: 
---

This is the first release after cuttlefish. Since most of this window was spent on stabilization, there isn’t a lot of new stuff here aside from cleanups and fixes (most of which are backported to v0.61). v0.63 is due out in 2 weeks and will have more goodness.

- mon: fix validation of mds ids from CLI commands
- osd: fix for an op ordering bug
- osd, mon: optionally dump leveldb transactions to a log
- osd: fix handling for split after upgrade from bobtail
- debian, specfile: packaging cleanups
- radosgw-admin: create keys for new users by default
- librados python binding cleanups
- misc code cleanups

You can get v0.62 from the usual places:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.62.tar.gz](http://ceph.com/download/ceph-0.62.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-62-released/&bvt=rss&p=wordpress)
