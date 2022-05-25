---
title: "v0.17 released"
date: "2009-10-19"
author: "sage"
tags: 
  - "release"
---

We’ve released v0.17.  This is mainly bug fixes and some monitor improvements.  Changes since v0.16 include:

- kclient: fix >1 mds mdsmap decoding
- kclient: fix mon subscription renewal
- osdmap: fix encoding bug (and resulting kclient crash)
- msgr: simplified policy, failure model, code
- mon: less push, more pull
- mon: clients maintain single monitor session, requests and replies are routed by the cluster
- mon cluster expansion works (see [Monitor cluster expansion](http://ceph.newdream.net/wiki/Monitor_cluster_expansion))
- osd: fix pgid parsing bug (broke restarts on clusters with 10 osds or more)

The other change with this release is that the kernel code is no longer bundled with the server code; it lives in a separate git tree.

- Direct download at [http://ceph.newdream.net/download/ceph-0.17.tar.gz](http://ceph.newdream.net/download/ceph-0.17.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v017-released/&bvt=rss&p=wordpress)
