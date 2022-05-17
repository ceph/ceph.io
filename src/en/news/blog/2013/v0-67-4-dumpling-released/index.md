---
title: "v0.67.4 Dumpling released"
date: "2013-10-04"
author: "sage"
tags: 
  - "release"
  - "dumpling"
---

This point release fixes an important performance issue with radosgw, keystone authentication token caching, and CORS. All users (especially those of rgw) are encouraged to upgrade.

Notable changes:

- crush: fix invalidation of cached names
- crushtool: do not crash on non-unique bucket ids
- mds: be more careful when decoding LogEvents
- mds: fix heap check debugging commands
- mon: avoid rebuilding old full osdmaps
- mon: fix ‘ceph crush move …’
- mon: fix ‘ceph osd crush reweight …’
- mon: fix writeout of full osdmaps during trim
- mon: limit size of transactions
- mon: prevent both unmanaged and pool snaps
- osd: disable xattr size limit (prevents upload of large rgw objects)
- osd: fix recovery op throttling
- osd: fix throttling of log messages for very slow requests
- rgw: drain pending requests before completing write
- rgw: fix CORS
- rgw: fix inefficient list::size() usage
- rgw: fix keystone token expiration
- rgw: fix minor memory leaks
- rgw: fix null termination of buffer

For more information, please see the [complete release notes](http://ceph.com/docs/master/release-notes/#v0-67-4-dumpling) and [changelog](http://ceph.com/docs/master/_downloads/v0.67.4.txt).

You can get v0.67.4 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.67.4.tar.gz](http://ceph.com/download/ceph-0.67.4.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-67-4-dumpling-released/&bvt=rss&p=wordpress)
