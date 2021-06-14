---
title: "v0.21.1 released"
date: "2010-08-16"
author: "sage"
tags: 
  - "planet"
---

We’ve made a bugfix release for v0.21 last week.  Changes include:

- debian and rpm packaging fixes
- mds: fixed crash on some mds->client messages
- mds: fix snaprealm behavior on readdir (occasional client misbehavior)
- monmaptool: man page typo
- rados: usage fix
- osd: fix heartbeat to/from osds (fixing osd up/down flapping)
- osd: fix replies to dup/committed requests (fixes client hangs)
- librados: .hpp fix
- cclass: fix .so loading
- cauthtool: fix man page example for fs clients
- fix log rotation

Relevant URLs:

- Direct download at [http://ceph.newdream.net/download/ceph-0.21.1.tar.gz](http://ceph.com/download/ceph-0.21.1.tar.gz)
- For Debian packages see [http://ceph.newdream.net/wiki/Debian](http://ceph.com/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/uncategorized/v0-21-1-released/&bvt=rss&p=wordpress)
