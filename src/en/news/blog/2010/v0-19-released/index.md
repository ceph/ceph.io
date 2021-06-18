---
title: "v0.19 released"
date: "2010-02-17"
author: "sage"
tags: 
---

The v0.19 release is finally here.  The focus this past cycle was on stability and the disk format, and things have improved greatly in that area.  Our plan is to make any future disk format changes roll forward, so that users won’t need to rebuild their file systems.  The protocol has also grown feature bits that so it is at least possible to make protocol changes transparent; whether we do so or not will depend on the severity of the change and cost of maintaining compatibility.

Overall, things are looking good.  If you’ve been standing on the sidelines waiting for something more stable to test, now is a good time to try things out.  There are some lingering OSD performance problems (see below), and we are still a long ways off from something we would recommend for use in a production environment, but otherwise this release is looking pretty good for evaluation purposes.

Changes since v0.18 include:

- Stabilized disk format, with feature bits
- Wire protocol feature bits
- structure encoding versioning throughout
- msgr: code simplification, cleanup, bug fixes
- truncation fixes
- debian: packaging improvements
- rados: pool deletion, misc fixes
- osd: recovery fixes, journaling fixes
- lots of bug fixes (osd, mds, client)

On the kernel client side of things,

- Support for Kerberos-like ‘cephx’ authentication
- sync/directio read/write bug fixes (multiple client access to a single file)
- writeback congestion control
- mds ops interruptible (with control-c)
- Lots of code cleanup
- Lots of bug fixes

Notably, there are major revisions underway with the way the storage daemon cosd interacts with btrfs, and these are sufficiently intrusive and untested that they did not make it into this release.  They should be in v0.20.  That means that OSD performance is still not great in v0.19.  (So far performance with the new code is much much better.)

The primary focus areas for v0.20 will be

- OSD performance and btrfs interface changes
- Clustered MDS

Relevant URLs:

- Direct download at [http://ceph.newdream.net/download/ceph-0.19.tar.gz](http://ceph.newdream.net/download/ceph-0.19.tar.gz)
- For Debian packages see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

Enjoy!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-19-released/&bvt=rss&p=wordpress)
