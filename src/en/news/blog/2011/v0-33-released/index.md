---
title: "v0.33 released"
date: "2011-08-17"
author: "sage"
tags: 
---

v0.33 is out. Notable changes this time around:

- osd: internal heartbeat mechanism to detect internal workqueue stalls
- osd: rewritten heartbeat code, much more reliable
- osd: collect/sum usage stats by user-specified object category (in addition to total)
- mds: fixed memory leak for standby-replay mode
- mds: many fixes with multimds subtree management vs rename
- radosgw: multi-threaded mode (more efficient than multiple radosgw processes
- collectd: perfcounter and mon stat plugins

For v0.34 we’re continuing to focus on expanding the qa suite coverage. Part of this is improving the API documentation for librados. We’re also finishing up a big change on the OSD that will facilitate efficient PG splits/merges (and, to some extent, other types on indices on objects).

You can download the latest from the usual locations:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.33.tar.gz](http://ceph.newdream.net/download/ceph-0.33.tar.gz)
- For Debian/Ubuntu packages see: [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

Note that I dropped the Ubuntu lucid deb because of a build problem I was too lazy to track down. Does anyone actually care? Currently I’m building sid, squeeze, lenny, maverick. Anything we’re not building that people want?

