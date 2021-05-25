---
title: "v0.29 released"
date: "2011-06-08"
author: "sage"
tags: 
  - "planet"
---

Ceph v0.29 is ready.  Notable changes since v0.28.2 include

- mds: some fixes for multiple clients accessing the same directory
- obsync: supports rados/rgw backend
- osd: fix bug causing recovering objects to be excluded from object listing
- rados: import/export support for xattrs, incremental updates
- radosgw: misc fixes
- libceph: readdir bug fixes
- osd: fix for various heartbeat failures

Mainly we saw continued stabilization of the OSD peering code, which is now working quite well for us.  For v0.30 we’re continuing to clean up a few OSD corner cases and working on clustered MDS problems.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/downloads/ceph-0.29.tar.gz](http://ceph.newdream.net/downloads/ceph-0.29.tar.gz)
- Debian and Ubuntu packages: [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

