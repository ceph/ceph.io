---
title: "v0.24.3 released"
date: "2011-02-11"
author: "sage"
tags: 
  - "planet"
---

We’ve released v0.24.3 with more bug fixes, including one that loses data in certain cases when OSDs restart during recovery. It’s pretty much all OSD stuff, which is where we’re focusing our testing efforts currently.

- osd: misc crashes, slowness
- osd: fix bug that loses backlog (and potentially data)
- osd: scrub fixes
- osd: snap\_trimmer fixes
- mds: fix bug with multi-client interaction/slowness

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.24.3.tar.gz](http://ceph.newdream.net/download/ceph-0.24.3.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

