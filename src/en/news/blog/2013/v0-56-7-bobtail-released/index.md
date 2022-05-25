---
title: "v0.56.7 Bobtail released"
date: "2013-08-28"
author: "sage"
tags: 
  - "release"
  - "bobtail"
---

We have another bugfix update for bobtail. Most of these fixes have been sitting in the bobtail branch (and were run by various users) for some time now. The newest patches fix a problem with multi-delete on rgw. We recommend that production bobtail clusters upgrade, especially if they are using the radosgw.

Notable changes:

- ceph-fuse: create finisher flags after fork()
- debian: fix prerm/postinst hooks; do not restart daemons on upgrade
- librados: fix async aio completion wakeup (manifests as rbd hang)
- librados: fix hang when osd becomes full and then not full
- librados: fix locking for aio completion refcounting
- librbd python bindings: fix stripe\_unit, stripe\_count
- librbd: make image creation default configurable
- mon: fix validation of mds ids in mon commands
- osd: avoid excessive disk updates during peering
- osd: avoid excessive memory usage on scrub
- osd: avoid heartbeat failure/suicide when scrubbing
- osd: misc minor bug fixes
- osd: use fdatasync instead of sync\_file\_range (may avoid xfs power-loss corruption)
- rgw: escape prefix correctly when listing objects
- rgw: fix copy attrs
- rgw: fix crash on multi delete
- rgw: fix locking/crash when using ops log socket
- rgw: fix usage logging
- rgw: handle deep uri resources

For more detailed information, see [the release notes](http://ceph.com/docs/master/release-notes/#v0-56-7-bobtail) or [the complete changelog](http://ceph.com/docs/master/_downloads/v0.56.7.txt).

You can get v0.56.7 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.56.7.tar.gz](http://ceph.com/download/ceph-0.57.7.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-56-7-bobtail-released/&bvt=rss&p=wordpress)
