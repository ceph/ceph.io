---
title: "v0.31 released"
date: "2011-07-09"
author: "sage"
tags: 
---

We’ve released v0.31. Notable changes include:

- librados, libceph: can now access multiple clusters in same process
- osd: snapshot rollback fixes
- osd: scrub race
- mds: fixed lock starvation issue
- client: cache ref counting fixes
- client: snap writeback, umount hang, cache pressure, other fixes
- radosgw: atomic PUT

There is also the usual mix of bug fixes and code cleanup all over the tree. Much of the work has also been focused on teuthology, our Ceph test/QA framework.

For the current sprint (v0.32) we are working on:

- osd: prehashing of PG objects (to facilitate efficient PG splits/merges)
- instrumentation (simpler query-based interface, collectd plugins)
- Chef scripts
- mds: clustering fixes
- uclient: chasing down a few hard to hit bugs
- radosgw: coherent caching of bucket acls
- more qa (teuthology, tests)

v0.31 can be found in the usual places:

- Direct download at: [http://ceph.newdream.net/downloads/ceph-0.31.tar.gz](http://ceph.newdream.net/downloads/ceph-0.31.tar.gz)
- For Debian/Ubuntu packages see: [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

