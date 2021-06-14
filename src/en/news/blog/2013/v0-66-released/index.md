---
title: "v0.66 released"
date: "2013-07-09"
author: "sage"
tags: 
---

Our last development release before dumpling is here! The main improvements here are with monitor performance and OSD pg log rewrites to speed up peeering.

In other news, the dumpling feature freeze is upon us. The next month we will be focusing entirely on stabilization and testing. There will be a release candidate out in a week or two.

Notable changes include:

- osd: pg log (re)writes are now vastly more efficient (faster peering) (Sam Just)
- osd: fixed problem with front-side heartbeats and mixed clusters (David Zafman)
- mon: tuning, performance improvements
- mon: simplify PaxosService vs Paxos interaction, fix readable/writeable checks
- rgw: fix radosgw-admin buckets list (Yehuda Sadeh)
- mds: support robust lookup by ino number (good for NFS) (Yan, Zheng)
- mds: fix several bugs (Yan, Zheng)
- ceph-fuse, libcephfs: fix truncatation bug on >4MB files (Yan, Zheng)
- ceph/librados: fix resending of commands on mon reconnect
- librados python: fix xattrs > 4KB (Josh Durgin)
- librados: configurable max object size (default 100 GB)
- msgr: fix various memory leaks
- ceph-fuse: fixed long-standing O\_NOATIME vs O\_LAZY bug
- ceph-fuse, libcephfs: fix request refcounting bug (hang on shutdown)
- ceph-fuse, libcephfs: fix read zeroing at EOF
- ceph-conf: –show-config-value now reflects daemon defaults
- ceph-disk: simpler, more robust locking
- ceph-disk: avoid mounting over an existing osd in /var/lib/ceph/osd/\*
- sysvinit: handle symlinks in /var/lib/ceph/osd/\*

For a grand total of

> 152 files changed, 3481 insertions(+), 1636 deletions(-)

from 14 authors.

You can get v0.66 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.66.tar.gz](http://ceph.com/download/ceph-0.66.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-66-released/&bvt=rss&p=wordpress)
