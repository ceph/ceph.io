---
title: "v0.32 released"
date: "2011-08-01"
author: "sage"
tags: 
  - "release"
---

We’ve released v0.32. Notable in this release:

- common: perfcounter instrumentation now accessible via unix domain socket
- mon: dump cluster state in json format
- client: fix a few stalls, ref count links, clustered mds misbehaviors
- mds: many many clustering fixes, getting closer
- mds: fix for O\_APPEND behavior
- osd: bug fixes in clone overlap tracking, accounting
- osd: bug fixes in recovery code when clones/snapshots are present
- radosgw: multithreaded fastcgi mode
- radosgw: many small fixes
- radosgw: consistent cache of bucket objects (ACLs)
- CodingStyle document

For v0.33, we are working on more MDS clustering issues, collectd plugins (for per-daemon and cluster stats), better management of the internal directory structure on OSDs to facilitate PG splitting (scaling of object pools), the radosgw, and of course teuthology, our qa framework.

v0.32 can be found in the usual places:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.32.tar.gz](http://ceph.newdream.net/download/ceph-0.32.tar.gz)
- For Debian/Ubuntu packages see: [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/uncategorized/v0-32-released/&bvt=rss&p=wordpress)
