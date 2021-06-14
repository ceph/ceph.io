---
title: "v0.65 released"
date: "2013-06-25"
author: "sage"
tags: 
  - "planet"
---

Our next development release v0.65 is out, with a few big changes.  First and foremost, this release includes a complete revamp of the architecture for the command line interface in order to lay the groundwork for our ongoing REST management API work.  The ‘ceph’ command line tool is now a thin python wrapper around librados.  Note that this set of changes includes several small incompatible changes in the interface that tools or scripts utilizing the CLI should be aware of; these are detailed in [the complete release notes](http://ceph.com/docs/master/release-notes/#v0-65).

Other notable changes:

- mon, ceph: huge revamp of CLI and internal admin API. (Dan Mick)
- mon: new capability syntax
- osd: do not use fadvise(DONTNEED) on XFS (data corruption on power cycle)
- osd: recovery and peering performance improvements
- osd: new writeback throttling (for less bursty write performance) (Sam Just)
- osd: ping/heartbeat on public and private interfaces
- osd: avoid osd flapping from asymmetric network failure
- osd: re-use partially deleted PG contents when present (Sam Just)
- osd: break blacklisted client watches (David Zafman)
- mon: many stability fixes (Joao Luis)
- mon, osd: many memory leaks fixed
- mds: misc stability fixes (Yan, Zheng, Greg Farnum)
- mds: many backpointer improvements (Yan, Zheng)
- mds: new robust open-by-ino support (Yan, Zheng)
- ceph-fuse, libcephfs: fix a few caps revocation bugs
- librados: new calls to administer the cluster
- librbd: locking tests (Josh Durgin)
- ceph-disk: improved handling of odd device names
- ceph-disk: many fixes for RHEL/CentOS, Fedora, wheezy
- many many fixes from static code analysis (Danny Al-Gaaf)
- daemons: create /var/run/ceph as needed

We have one more sprint to go before the Dumpling feature freeze.  Big items include monitor performance and stability improvements and multi-site and disaster recovery features for radosgw.  Lots of radosgw has already appeard in rgw-next but these changes will not land until v0.67.

 You can get v0.65 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.65.tar.gz](http://ceph.com/download/ceph-0.65.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-65-released/&bvt=rss&p=wordpress)
