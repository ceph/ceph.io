---
title: "Released v0.45"
date: "2012-04-11"
author: "sage"
tags: 
  - "planet"
---

v0.45 is ready!  Notable changes include:

- osd: large xattrs stored in leveldb, allowing XFS and ext4 to be used with radosgw
- osd: new heartbeat code (simpler, more robust)
- osd: fixed some glaring journal performance problems
- fixed encoding performance regression
- ceph: less noisy output by default
- msgr: code cleanups
- doc: misc cleanups
- qa: improved testing coverage

In short, some performance and bug fixes but no huge functionality.  v0.46 will be a bit more exciting on that front.

You can get packages from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.45.tar.gz](http://ceph.newdream.net/download/ceph-0.45.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/master/ops/install/mkcephfs/#installing-the-packages)

