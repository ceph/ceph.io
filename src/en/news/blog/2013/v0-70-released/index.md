---
title: "v0.70 released"
date: "2013-10-06"
author: "sage"
tags: 
---

Another development release is out.  Our timing on these has been slightly erratic.  As a result, this one has a bit less stuff than 0.69 did or 0.71 will.  The highlights are some rgw and mon fixes, and the architecture detection for enabling the optimized Intel CRC32c code is now working (which is nice: it’s about 8x faster than the generic code!).  This is one minor librados API fix; librados users should check the [release notes](http://ceph.com/docs/master/release-notes/#v0-70).

Notable changes include:

- mon: a few ‘ceph mon add’ races fixed (command is now idempotent) (Joao Luis)
- crush: fix name caching
- rgw: fix a few minor memory leaks (Yehuda Sadeh)
- ceph: improve parsing of CEPH\_ARGS (Benoit Knecht)
- mon: avoid rewriting full osdmaps on restart (Joao Luis)
- crc32c: fix optimized crc32c code (it now detects arch support properly)
- mon: fix ‘ceph osd crush reweight …’ (Joao Luis)
- osd: revert xattr size limit (fixes large rgw uploads)
- mds: fix heap profiler commands (Joao Luis)
- rgw: fix inefficient use of std::list::size() (Yehuda Sadeh)

For more information, please see the [complete release notes](http://ceph.com/docs/master/release-notes/#v0-70).

You can get v0.70 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.70.tar.gz](http://ceph.com/download/ceph-0.70.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-70-released/&bvt=rss&p=wordpress)
