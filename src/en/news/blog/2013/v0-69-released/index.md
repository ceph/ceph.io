---
title: "v0.69 released"
date: "2013-09-18"
author: "sage"
tags: 
  - "release"
---

Our v0.69 development release of Ceph is ready!  The most notable user-facing new feature is probably improved support for CORS in the radosgw.  There has also been a lot of new work going into the tree behind the scenes on the OSD that is laying the groundwork for tiering and cache pools.  As part of this, some of the librados API semantics have been tightened up.

Notable changes:

- build cleanly under clang (Christophe Courtaut)
- common: migrate SharedPtrRegistry to use boost::shared\_ptr<> (Loic Dachary)
- doc: erasure coding design notes (Loic Dachary)
- improved intel-optimized crc32c support (~8x faster on my laptop!)
- librados: get\_version64() method for C++ API
- mds: fix locking deadlock (David Disseldorp)
- mon, osd: initial CLI for configuring tiering
- mon: allow cap strings with . to be unquoted
- mon: continue to discover peer addr info during election phase
- mon: fix ‘osd crush move …’ command for buckets (Joao Luis)
- mon: warn when mon data stores grow very large (Joao Luis)
- objecter, librados: redirect requests based on cache tier config
- osd, librados: add new COPY\_FROM rados operation
- osd, librados: add new COPY\_GET rados operations (used by COPY\_FROM)
- osd: add ‘osd heartbeat min healthy ratio’ configurable (was hard-coded at 33%)
- osd: add option to disable pg log debug code (which burns CPU)
- osd: allow cap strings with . to be unquoted
- osd: fix version value returned by various operations (Greg Farnum)
- osd: infrastructure to copy objects from other OSDs
- osd: use fdatasync(2) instead of fsync(2) to improve performance (Sam Just)
- rgw: fix major CPU utilization bug with internal caching (Yehuda Sadeh, Mark Nelson)
- rgw: fix ordering of write operations (preventing data loss on crash) (Yehuda Sadeh)
- rgw: fix ordering of writes for mulitpart upload (Yehuda Sadeh)
- rgw: fix various CORS bugs (Yehuda Sadeh)
- rgw: improve help output (Christophe Courtaut)
- rgw: validate S3 tokens against keystone (Roald J. van Loon)
- rgw: wildcard support for keystone roles (Christophe Courtaut)
- sysvinit radosgw: fix status return code (Danny Al-Gaaf)
- sysvinit rbdmap: fix error ‘service rbdmap stop’ (Laurent Barbe)

Work on tiering and erasure coding (and related refactoring) continues in ernest.

You can get v0.69 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.69.tar.gz](http://ceph.com/download/ceph-0.69.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-69-released/&bvt=rss&p=wordpress)
