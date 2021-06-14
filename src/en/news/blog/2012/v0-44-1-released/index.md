---
title: "v0.44.1 released"
date: "2012-03-28"
author: "sage"
tags: 
  - "planet"
---

This point release has a few important fixes:

- osd: a few replay fixes for non-btrfs users
- librados: resend watch operations at appropriate times
- fix rpm builds
- fix libnss builds

It’s also worth mentioning (since several people have mentioned problems on the list) that you need to do

git submodule init
git submodule update

from the source tree before you build for the first time to get the correct version of leveldb.

You can get this release from the usual places:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.44.1.tar.gz](http://ceph.newdream.net/download/ceph-0.44.1.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/master/ops/install/mkcephfs/#installing-the-packages)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-44-1-released/&bvt=rss&p=wordpress)
