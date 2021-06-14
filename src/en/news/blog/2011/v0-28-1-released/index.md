---
title: "v0.28.1 released"
date: "2011-05-24"
author: "sage"
tags: 
  - "planet"
---

I tagged and uploaded v0.28 a week ago but forgot to blog and email about it. That may be just as well, as there were a number of issues that got fixed last week. I’ll separate out the main items.

Changes for v0.28:

- osd: peering code refactor
- osd: long object name support
- osd: removed fragile class distribution mechanism (now left to admin to distribute .so’s)
- mds: many clustered mds fixes
- libceph: xattr operations, api update
- mon: ‘health’ command more robust
- obsync: many improvements (ACL translation, content-type, attrs, packages)
- rbd: map/unmap kernel devices via ‘rbd map’ and ‘rbd unmap’ commands
- crush: allow – and \_ in names, fixed whitespace during compile
- radosgw: many many fixes

Changes for v0.28.1:

- osd: heartbeat exchange fixes (for many ‘wrongly marked down’)
- osd: peering fixes
- daemons: reopen log file on SIGHUP fixed
- mds: fix journal expire crash (after mds restart)
- libceph/cfuse: fix sync write crash

The focus for v0.29 is mainly stability.  The only new features are for obsync (so it can sync directly to rados) and some usability improvements for programatically managing CRUSH maps for larger clusters.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.28.1.tar.gz](http://ceph.newdream.net/download/ceph-0.28.1.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-28-1-released/&bvt=rss&p=wordpress)
