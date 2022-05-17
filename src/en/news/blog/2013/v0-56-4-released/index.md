---
title: "v0.56.4 released"
date: "2013-03-25"
author: "sage"
tags: 
  - "release"
  - "bobtail"
---

There have been several important fixes that we’ve backported to bobtail that users are hitting in the wild.  Most notably, there was a problem with pool names with – and \_ that OpenStack users were hitting, and memory usage by ceph-osd and other daemons due to the trimming of in-memory logs.  This and more is fixed in v0.56.4.  We recommend that all bobtail users upgrade.

Notable changes include:

- mon: fix bug in bringup with IPv6
- reduce default memory utilization by internal logging (all daemons)
- rgw: fix for bucket removal
- rgw: reopen logs after log rotation
- rgw: fix multipat upload listing
- rgw: don’t copy object when copied onto self
- osd: fix caps parsing for pools with – or \_
- osd: allow pg log trimming when degraded, scrubbing, recoverying (reducing memory consumption)
- osd: fix potential deadlock when ‘journal aio = true’
- osd: various fixes for collection creation/removal, rename, temp collections
- osd: various fixes for PG split
- osd: deep-scrub omap key/value data
- osd: fix rare bug in journal replay
- osd: misc fixes for snapshot tracking
- osd: fix leak in recovery reservations on pool deletion
- osd: fix bug in connection management
- osd: fix for op ordering when rebalancing
- ceph-fuse: report file system size with correct units
- mds: get and set directory layout policies via virtual xattrs
- mkcephfs, init-ceph: close potential security issues with predictable filenames

Upgrading:

- There is one minor change (fix) in the output to the ‘ceph osd tree –format=json’ command.
- The MDS disk format has changed from prior releases \*and\* from v0.57. In particular, upgrades to v0.56.4 are safe, but you cannot move from v0.56.4 to v0.57 if you are using the MDS for CephFS; you must upgrade directly to v0.58 (or later) instead.

Please see the full [release notes](http://ceph.com/docs/master/release-notes/#v0-56-4-bobtail).

You can get v0.56.4 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.56.4.tar.gz](http://ceph.com/download/ceph-0.56.4.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-56-4-released/&bvt=rss&p=wordpress)
