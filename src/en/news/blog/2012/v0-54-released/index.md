---
title: "v0.54 released"
date: "2012-11-14"
author: "sage"
tags: 
---

The v0.54 development release is ready!  This will be the last development release before v0.55 “bobtail,” our next long-term stable release, is ready.  Notable changes this time around include:

- osd: use entire device if journal is a block device
- osd: new caps structure (see below)
- osd: backfill target reservations (improve performance during recovery)
- ceph-fuse: many fixes (including memory leaks, hangs)
- radosgw: REST API for managing usage stats
- radosgw: many small fixes, cleanups (coverity)
- mds: misc fixes for multi-mds clusters
- rbd: ls -l
- ceph-disk-prepare: support for external journals, default mount/mkfs options, etc.
- ceph-debugpack: misc improvements

There isn’t anything especially exciting here; most of the big stuff is landing in v0.55, which will become bobtail. Most of our effort over the next few weeks will be on make sure that v0.55 bobtail is rock solid and performs well.  
  
Note that the syntax for the OSD capabilities have changed slightly.  If you use non-default capabilities, please refer to the full [release notes](http://ceph.com/docs/master/release-notes/#v0-54).

You can get v0.54 from the usual locations:

- - Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
    - Tarball at [http://ceph.com/download/ceph-0.54.tar.gz](http://ceph.com/download/ceph-0.54.tar.gz)
    - For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
    - For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)
    

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-54-released/&bvt=rss&p=wordpress)
