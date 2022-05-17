---
title: "v0.42.2 released"
date: "2012-02-24"
author: "sage"
tags: 
  - "release"
---

This release contains a few key fixes for v0.42:

- fixed osdmap encoding for older clients.  In particular, v0.41 versions of things like librbd won’t crash talking to v0.42 daemons.
- ceph-dencoder and man page are included in the rpm and deb
- ceph.spec file is fixed

If you are upgrading, upgrade to v0.42.2, not v0.42.  Ignore v0.42.1: I forgot to include the encoding fix and didn’t notice until after I’d pushed the tag.

You can get the latest from the usual locations:

- Git at git://github.com/NewDreamNetwork/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.42.2.tar.gz](http://ceph.newdream.net/download/ceph-0.42.2.tar.gz)
- For Debian/Ubuntu packages, see[http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-42-1-released/&bvt=rss&p=wordpress)
