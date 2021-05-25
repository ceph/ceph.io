---
title: "v0.23 released"
date: "2010-11-12"
author: "sage"
tags: 
  - "planet"
---

Another month, and v0.23 is out.  The main milestone here is that clustered MDS is pretty stable.  Stable enough that, if you’re interested and willing, we’d like you to try it and let us know what problems you have.  Notably, clustered recovery is _not_ yet well tested (that’s v0.24), so don’t do this unless you’re feeling adventurous.  Directory fragmentation (splitting and merging) is also working, although still off by default.  If you’d like to try that too, add ‘mds bal frag = true’ to your \[mds\] section.

Other notable changes this time around:

- osd: use new btrfs snapshot ioctls (2.6.37), parallel journaling
- mds: clustering, replay fixes
- mon: better commit batches, lower latency updates
- objecter: bug fixes
- osd: spread data across multiple xattrs; assert on io/enospc errors
- osd: start up despite corrupt pg logs
- ceph: new gui (ceph -g)

The general focus for v0.24 will be continuing OSD stability and clustered MDS recovery.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.23.tar.gz](http://ceph.newdream.net/download/ceph-0.23.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

