---
title: "v0.26 released"
date: "2011-04-05"
author: "sage"
tags: 
---

We tagged v0.26 a few days ago.  Changes since the last release include:

- misc build, configure, rpm build fixes
- crypto: support for libnss (which exists in RHEL environments)
- osd: improved throttling
- osd: scrub no longer blocks requests
- osd: vastly improved map update performance
- osd: recovery fixes
- librados, osd: support for object locator strings
- librados: API fixes, extensions
- mds: recovery fix for large directories
- mds: journaling fixes
- mds: rstats fixes
- radosgw: Swift API support.  many fixes

For v0.27 we’re continuing to focus on stabilizing the OSD and radosgw.  There have also been a flurry of bugs found (and fixed!) in the MDS with fsstress from [LTP](http://ltp.sourceforge.net/) (which, BTW, is a pretty great tool).  As part of this we’re chipping away at the clustered MDS problems as well.  See [the current roadmap](http://tracker.newdream.net/projects/ceph/roadmap) for the next few intermediate releases and current set of desired 1.0 features.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.26.tar.gz](http://ceph.newdream.net/download/ceph-0.26.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

