---
title: "v0.55.1 released"
date: "2012-12-13"
author: "sage"
tags: 
  - "release"
---

There were some packaging and init script issues with v0.55, so a small point release is out. It fixes a few odds and ends:

- init-ceph: typo (new ‘fs type’ stuff was broken)
- debian: fixed conflicting upstart and sysvinit scripts
- auth: fixed default auth settings
- osd: dropped some broken asserts
- librbd: fix locking bug, race with ‘flatten’

You can get this release from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.55.1.tar.gz](http://ceph.com/download/ceph-0.55.1.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-55-1-released/&bvt=rss&p=wordpress)
