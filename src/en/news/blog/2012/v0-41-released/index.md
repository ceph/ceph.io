---
title: "v0.41 released"
date: "2012-01-28"
author: "sage"
tags: 
  - "planet"
---

v0.41 is ready!  There are a few key things in this release:

- osd: new ‘backfill’ recovery code (less memory, faster)
- osd: misc bug fixes (scrub, out of order replies)
- radosgw: better logging
- librados: improved api for compound operations

For v0.42 we’re working on improved journal performance for the OSD, better encoding for data structures (to ease upgrades and downgrades), rgw performance improvements, and an efficient key/value object interface.

You can download v0.41 from the usual places:

- Git at git://github.com/NewDreamNetwork/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.41.tar.gz](http://ceph.newdream.net/download/ceph-0.41.tar.gz)
- For Debian/Ubuntu packages, see[http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages)

