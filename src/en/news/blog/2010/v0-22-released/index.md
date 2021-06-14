---
title: "v0.22 released"
date: "2010-10-15"
author: "sage"
tags: 
  - "planet"
---

It’s a bit late, but v0.22 is here.  The original goal for this release was to have a stable clustered MDS that we can encourage users to test.  Unfortunately, we did not quite make that mark: there are still a couple significant bugs we’re working on, and I don’t want to push this release back any farther.  In retrospect, having such an infrequent release schedule to begin with (>2 months since v0.21!) makes our life a bit harder because we are tracking bug fixes in both branches, and end up with a long delay between a new feature being merged and most users testing it.  For the next release (and the immediate future), we will be aiming for more frequent releases, and will stick as close as possible to the original timeline.

Notable changes in v0.22 include:

- mon: improved naming
- osd: support separate interface for cluster-internal traffic
- mds: many many snapshot, recursive accounting fixes
- mon: back off on clock drift errors/warnings
- mds: fix xattr bugs
- cfuse: readdir caching, readdir fixes
- mon: trim laggy standby mds’s from map
- osd: data integrity fixes
- osd: fix hang during mkfs/journal creation
- improved debug logging on crash
- cdebugpack: new debug information capture tool
- mon: improve osd failure logic
- mds/osd: use tcmalloc (faster, more memory efficient)
- mds: set file layout/striping policy on directory/subtree basis
- cfuse: mount subdir
- mds: respawn on failure

At a high level, the goals for v0.23 are a stable clustered MDS and directory fragmentation.  We are also continuing to work on hardening the OSD cluster recovery, particularly given the level of interest in RBD.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.22.tar.gz](http://ceph.newdream.net/download/ceph-0.22.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-22-released/&bvt=rss&p=wordpress)
