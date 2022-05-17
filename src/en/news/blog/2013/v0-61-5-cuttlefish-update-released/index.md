---
title: "v0.61.5 Cuttlefish update released"
date: "2013-07-18"
author: "sage"
tags: 
  - "release"
  - "cuttlefish"
---

We’ve prepared another update for the Cuttlefish v0.61.x series. This release primarily contains monitor stability improvements, although there are also some important fixes for ceph-osd for large clusters and a few important CephFS fixes. We recommend that all v0.61.x users upgrade.

- mon: misc sync improvements (faster, more reliable, better tuning)
- mon: enable leveldb cache by default (big performance improvement)
- mon: new scrub feature (primarily for diagnostic, testing purposes)
- mon: fix occasional leveldb assertion on startup
- mon: prevent reads until initial state is committed
- mon: improved logic for trimming old osdmaps
- mon: fix pick\_addresses bug when expanding mon cluster
- mon: several small paxos fixes, improvements
- mon: fix bug osdmap trim behavior
- osd: fix several bugs with PG stat reporting
- osd: limit number of maps shared with peers (which could cause domino failures)
- rgw: fix radosgw-admin buckets list (for all buckets)
- mds: fix occasional client failure to reconnect
- mds: fix bad list traversal after unlink
- mds: fix underwater dentry cleanup (occasional crash after mds restart)
- libcephfs, ceph-fuse: fix occasional hangs on umount
- libcephfs, ceph-fuse: fix old bug with O\_LAZY vs O\_NOATIME confusion
- ceph-disk: more robust journal device detection on RHEL/CentOS
- ceph-disk: better, simpler locking
- ceph-disk: do not inadvertantely mount over existing osd mounts
- ceph-disk: better handling for unusual device names
- sysvinit, upstart: handle symlinks in /var/lib/ceph/\*

Please also refer to the [complete release notes](http://ceph.com/docs/master/release-notes/#v0-61-5-cuttlefish).

You can get v0.61.5 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.61.5.tar.gz](http://ceph.com/download/ceph-0.61.5.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-5-cuttlefish-update-released/&bvt=rss&p=wordpress)
