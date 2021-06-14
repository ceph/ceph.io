---
title: "v0.50 released"
date: "2012-08-13"
author: "sage"
tags: 
  - "planet"
---

The next development release v0.50 is ready, and includes:

- osd: major refactor of PG peering and threading
- osd: more/better dump info about in-progress operations
- osd: better tracking of recent slow operations
- osd: misc fixes
- librados: watch/notify fixes, misc memory leaks
- mon: misc fixes
- mon: less-destructive ceph-mon –mkfs behavior
- rados: copy rados pools
- radosgw: various compatibility fixes

Right now the main development going on is with the RBD layering, which will hit master shortly, and OSD performance, various bits of which are being integrated.  There was also a large pile of messenger cleanups and races fixes that will be on v0.52.

You can get v0.50 from the usual locations:

- Git at git://[github.com/ceph/ceph](http://github.com/ceph/ceph).git
- Tarball at [http://ceph.com/download/ceph-0.50.tar.gz](http://ceph.newdream.net/download/ceph-0.50.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/install/debian](http://ceph.newdream.net/docs/master/install/debian)

One note: there was a build issue with the latest gcc that affected the Debian squeeze and wheezy builds; those packages were not built for this release.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-50-released/&bvt=rss&p=wordpress)
