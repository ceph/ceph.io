---
title: "v0.47.3 released"
date: "2012-06-21"
author: "sage"
tags: 
  - "planet"
---

This is a bugfix release with one major fix and a few small ones:

- osd: disable use of the FIEMAP ioctl by default as its use was leading to corruption for RBD users
- a few minor compile/build/specfile fixes

I was going to wait for v0.48, but that is still several days away.  If you are using RBD in production, you should either add ‘filestore fiemap = false’ to your ceph.conf file or upgrade.

You can get this release from the usual places, with the exception of Debian sid and wheezy packages; the upstream repos were sufficiently broken to make pbuilder cranky so I left them out.

- Git at git://[github.com/ceph/ceph](http://github.com/ceph/ceph).git
- Tarball at [http://ceph.newdream.net/download/ceph-0.47.3.tar.gz](http://ceph.newdream.net/download/ceph-0.47.3.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/install/debian](http://ceph.newdream.net/docs/master/install/debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-47-3-released/&bvt=rss&p=wordpress)
