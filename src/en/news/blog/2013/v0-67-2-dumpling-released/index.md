---
title: "v0.67.2 Dumpling released"
date: "2013-08-23"
author: "sage"
tags: 
  - "planet"
---

This is an imporant point release for Dumpling. Most notably, it fixes a problem when upgrading directly from v0.56.x Bobtail to v0.67.x Dumpling (without stopping at v0.61.x Cuttlefish along the way). It also fixes a problem with the CLI parsing of the CEPH\_ARGS environment variable (which causes problems with older releases of OpenStack), high CPU utilization by the ceph-osd daemons, and cleans up the radosgw shutdown sequence.

Notable changes:

- objecter: resend linger requests when cluster goes from full to non-full
- ceph: parse CEPH\_ARGS environment variable
- librados: fix small memory leak
- osd: remove old log objects on upgrade (fixes bobtail -> dumpling jump)
- osd: disable PGLog::check() via config option (fixes CPU burn)
- rgw: drain requests on shutdown
- rgw: misc memory leaks on shutdown

For more information please see the [release notes](http://ceph.com/docs/master/release-notes/#v0-67-2-dumpling) and [complete changelog](http://ceph.com/docs/master/_downloads/v0.67.2.txt).

You can get v0.67.2 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.67.2.tar.gz](http://ceph.com/download/ceph-0.67.2.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-67-2-dumpling-released/&bvt=rss&p=wordpress)
