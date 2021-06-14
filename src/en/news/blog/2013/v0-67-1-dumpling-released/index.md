---
title: "v0.67.1 Dumpling released"
date: "2013-08-17"
author: "sage"
tags: 
  - "planet"
---

This is a bug fix release for Dumpling that resolves a problem with the librbd python bindings (triggered by OpenStack) and a hang in librbd when caching is disabled.

Notable changes:

- librados, librbd: fix constructor for python bindings with certain usages (in particular, that used by OpenStack)
- librados, librbd: fix aio\_flush wakeup when cache is disabled
- librados: fix locking for aio completion refcounting
- fixes ‘ceph –admin-daemon …’ command error code on error
- fixes ‘ceph daemon … config set …’ command for boolean config options.

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.67.1.txt).

You can download v0.67.1 Dumpling from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.67.1.tar.gz](http://ceph.com/download/ceph-0.67.1.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-67-1-dumpling-released/&bvt=rss&p=wordpress)
