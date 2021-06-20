---
title: "v0.16 released"
date: "2009-10-05"
author: "sage"
tags: 
---

We’ve released v0.16.  The release primarily incorporates feedback on the Linux kernel client from LKML.  Changes since v0.15 include:

- kclient: corrected inline abuse, use of \_\_init, sockaddr\_storage (IPv6 groundwork), and other feedback
- kclient: xattr cleanups
- kclient: fix invalidate lockup bug
- kclient: fix msgr queue accounting lockup bug

Andrew Morton was nice enough to take some time to look at v0.15 and, “unless others emit convincing squeaks,” suggested I ask Stephen to include it in linux-next and send Linus a pull request for 2.6.33.  Yay!  With luck this will be the last version spammed to LKML in its entirety.

Meanwhile, Yehuda is continuing work on the security infrastructure to provide mutual trust between monitors, MDSs, OSDs, and clients, and Greg is working some odds and ends (monitor cluster expansion, libceph/fuse/Hadoop client improvements).

Here are the relevant URLs:

- Git tree at [git://ceph.newdream.net/ceph.git](git://ceph.newdream.net/ceph.git)
- Direct download at [http://ceph.newdream.net/download/ceph-0.16.tar.gz](http://ceph.newdream.net/download/ceph-0.16.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

P.S. I’d like to start building up to date RPMs as well.  If anyone wants to help get ceph.spec in sync with the debian packages, that would be great.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v016-released/&bvt=rss&p=wordpress)
