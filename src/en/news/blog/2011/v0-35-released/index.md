---
title: "v0.35 released"
date: "2011-09-21"
author: "sage"
tags: 
  - "planet"
---

**WARNING: There is a disk format change in this release that requires a bit of extra care to upgrade safely.  Please see below.**

Notable changes since v0.34 include:

- osd: large collections of objects are pre-hashed into directories
- radosgw: pools are preallocated
- librbd: asynchronous api for many operations
- rbd: show progress for long-running operations
- rados export: parallelized, much faster
- collectd: track historical health
- teuthology: valgrind support
- teuthology: improved osd thrashing

The big change this time around is the way the OSD is storing objects on the local machine.  When directories of objects get large, they are “pre-hashed” into subdirectories.  This is necessary groundwork that will facilitate splitting and merging of PGs when pools grow or shrink dramatically in size.  There is an “on disk” format change to do this, so a bit of care is needed to upgrade.

Please follow this basic procedure:

1. Make sure all PGs are healthy (‘ceph pg stat’ should show everything ‘active+clean’).
2. Upgrade the monitors to the new version.
3. Upgrade everything else (OSDs, MDSs, etc.).  Please note that when cosd starts for the first time it will convert the existing data, so it may take longer than you’re used to.

We’ve done a lot of testing to make sure this works properly, but there are some awkward changes that make it difficult to test every scenario.  **If you have important data in your cluster, make a backup before upgrading**.

Where to get v0.35:

- Git at git://github.com/NewDreamNetwork/ceph.git
- Tarball at [http://ceph.newdream.net/downloads/ceph-0.35.tar.gz](http://ceph.newdream.net/downloads/ceph-0.35.tar.gz)
- For Debian/Ubuntu packages see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

