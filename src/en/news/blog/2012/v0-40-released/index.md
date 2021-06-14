---
title: "v0.40 released"
date: "2012-01-14"
author: "sage"
tags: 
---

It’s been several weeks, but v0.40 is ready.  This has mostly been a stabilization release, so there isn’t too much new here.  Some notable additions include:

- new and improved specfile, for RH and SuSE based distributions.
- mon: expose cluster stats via admin socket (accessible via collectd plugin)
- simpler/generalized admin socket interface (ceph –admin-socket /path/to/sock command)
- rados: ability to specify object locators on command line
- osd: improved pool ‘ls’ protocol (includes locators)

There’s a much longer list of bugs fixed, but I’m not sure it’s worth listing here.  Lots of stuff in the OSD, for the most part.  Notably, there is only one high priority OSD bug in the tracker right now, and it is just awaiting confirmation from the nightly QA run that the fix is correct.

The main thing that didn’t make the cut is the “backfill” work, that is about to be merged into master for v0.41.  This revamps the way OSDs handle recovery when the entire PG has to be replicated to a new location, and significantly reduces memory requirements and improves the recovery speed.  For v0.41, we’re also working on mechanisms to improve visibility into the health of the cluster and addressing some performance issues.

To download v0.40:

- Git at git://github.com/NewDreamNetwork/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.40.tar.gz](http://ceph.newdream.net/download/ceph-0.40.tar.gz)
- For Debian/Ubuntu packages, see[http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-40-released/&bvt=rss&p=wordpress)
