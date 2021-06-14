---
title: "v0.67.3 Dumpling released"
date: "2013-09-10"
author: "sage"
tags: 
  - "planet"
---

This point release fixes a few important performance regressions with the OSD (both with CPU and disk utilization), as well as several other important but less common problems. We recommend that all production users upgrade.

Notable changes since v0.67.2 include:

- ceph-disk: partprobe after creation journal partition
- ceph-disk: specify fs type when mounting
- ceph-post-file: new utility to help share logs and other files with ceph developers
- libcephfs: fix truncate vs readahead race (crash)
- mds: fix flock/fcntl lock deadlock
- mds: fix rejoin loop when encountering pre-dumpling backpointers
- mon: allow name and addr discovery during election stage
- mon: always refresh after Paxos store\_state (fixes recovery corner case)
- mon: fix off-by-4x bug with osd byte counts
- osd: add and disable ‘pg log keys debug’ by default
- osd: add option to disable throttling
- osd: avoid leveldb iterators for pg log append and trim
- osd: fix readdir\_r invocations
- osd: use fdatasync instead of sync
- radosgw: fix sysvinit script return status
- rbd cli utility: relicense as LGPL2
- rgw: flush pending data on multipart upload
- rgw: recheck object name during S3 POST
- rgw: reorder init/startup
- rpm: fix debuginfo package build

Please see [the complete release notes](http://ceph.com/docs/master/release-notes/#v0-67-3-dumpling) or [changelog](http://ceph.com/docs/master/_downloads/v0.67.3.txt) for more information.

You can get v0.67.3 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.67.3.tar.gz](http://ceph.com/download/ceph-0.67.3.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-67-3-dumpling-released/&bvt=rss&p=wordpress)
