---
title: "v0.15 released"
date: "2009-09-22"
author: "sage"
tags: 
  - "planet"
---

We’ve released v0.15.  This is mostly cleanups for the kernel client and some work on the monitor interface.  Changes since v0.14 include:

- kclient: message api fixups (simpler, more robust)
- kclient: more message pools (avoiding ENOMEM)
- kclient: new ioctl to extract object name and location/address, given a file handle and offset
- kclient: fix with osd restart handling
- msgr: internal interface improvements (session tracking)
- monitor: interface/protocol cleanup, better session tracking
- monclient: lots of fixes, improvement
- debian: fixed permissions on headres in -dev packages; new radosgw package (S3 compatible REST interface to object store)

So nothing too groundbreaking feature wise, mostly just bug fixes and internal code cleanups.  And the radosgw package, which lets you point existing applications using the S3 storage service at a Ceph object store.

Here are the relevant URLs:

- Git tree at [git://ceph.newdream.net/ceph.git](git://ceph.newdream.net/ceph.git)
- Direct download at [http://ceph.newdream.net/download/ceph-0.15.tar.gz](http://ceph.newdream.net/download/ceph-0.15.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v015-released/&bvt=rss&p=wordpress)
