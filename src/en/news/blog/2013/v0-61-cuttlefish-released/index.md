---
title: "v0.61 “Cuttlefish” released"
date: "2013-05-07"
author: "sage"
tags: 
  - "release"
  - "cuttlefish"
---

Spring has arrived (at least for some of us), and a new stable release of Ceph is ready.  Thank you to everyone who has contributed to this release!

Bigger ticket items since v0.56.x “Bobtail”:

- ceph-deploy: our new deployment tool to replace ‘mkcephfs’
- robust RHEL/CentOS support
- ceph-disk: many improvements to support hot-plugging devices via chef and ceph-deploy
- ceph-disk: dm-crypt support for OSD disks
- ceph-disk: ‘list’ command to see available (and used) disks
- rbd: incremental backups
- rbd-fuse: access RBD images via fuse
- librbd: autodetection of VM flush support to allow safe enablement of the writeback cache
- osd: improved small write, snap trimming, and overall performance
- osd: PG splitting
- osd: per-pool quotas (object and byte)
- osd: tool for importing, exporting, removing PGs from OSD data store
- osd: improved clean-shutdown behavior
- osd: noscrub, nodeepscrub options
- osd: more robust scrubbing, repair, ENOSPC handling
- osd: improved memory usage, log trimming
- osd: improved journal corruption detection
- ceph: new ‘df’ command
- mon: new storage backend (leveldb)
- mon: config-keys service
- mon, crush: new commands to manage CRUSH entirely via CLI
- mon: avoid marking entire subtrees (e.g., racks) out automatically
- rgw: REST API for user management
- rgw: CORS support
- rgw: misc API fixes
- rgw: ability to listen to fastcgi on a port
- sysvinit, upstart: improved support for standardized data locations
- mds: backpointers on all data and metadata objects
- mds: faster fail-over
- mds: many many bug fixes
- ceph-fuse: many stability improvements

Notable changes since v0.60:  

- rbd: incremental backups
- rbd: only set STRIPINGV2 feature if striping parameters are incompatible with old versions
- rbd: require –allow-shrink for resizing images down
- librbd: many bug fixes
- rgw: fix object corruption on COPY to self
- rgw: new sysvinit script for rpm-based systems
- rgw: allow buckets with ‘\_’
- rgw: CORS support
- mon: many fixes
- mon: improved trimming behavior
- mon: fix data conversion/upgrade problem (from bobtail)
- mon: ability to tune leveldb
- mon: config-keys service to store arbitrary data on monitor
- mon: ‘osd crush add|link|unlink|add-bucket …’ commands
- mon: trigger leveldb compaction on trim
- osd: per-rados pool quotas (objects, bytes)
- osd: tool to export, import, and delete PGs from an individual OSD data store
- osd: notify mon on clean shutdown to avoid IO stall
- osd: improved detection of corrupted journals
- osd: ability to tune leveldb
- osd: improve client request throttling
- osd, librados: fixes to the LIST\_SNAPS operation
- osd: improvements to scrub error repair
- osd: better prevention of wedging OSDs with ENOSPC
- osd: many small fixes
- mds: fix xattr handling on root inode
- mds: fixed bugs in journal replay
- mds: many fixes
- librados: clean up snapshot constant definitions
- libcephfs: calls to query CRUSH topology (used by Hadoop)
- ceph-fuse, libcephfs: misc fixes to mds session management
- ceph-fuse: disabled cache invalidation (again) due to potential deadlock with kernel
- sysvinit: try to start all daemons despite early failures
- ceph-disk: new ‘list’ command
- ceph-disk: hotplug fixes for RHEL/CentOS
- ceph-disk: fix creation of OSD data partitions on >2TB disks
- osd: fix udev rules for RHEL/CentOS systems
- fix daemon logging during initial startup

There are a few things to keep in mind when upgrading from Bobtail, specifically with the monitor daemons.  Please see the [upgrade guide](http://ceph.com/docs/master/install/upgrading-ceph/) and/or the [complete release notes](http://ceph.com/docs/master/release-notes/#v0-61-cuttlefish).  In short: upgrade all of your monitors (more or less) at once.

Cuttlefish is the first Ceph release on our new three-month stable release cycle.  We are very pleased to have pulled everything together on schedule (well, only a week later than planned).  The next stable release, which will be code-named Dumpling, is slated for three months from now (beginning of August).

You can download v0.61 Cuttlefish from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.61.tar.gz](http://ceph.com/download/ceph-0.61.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-cuttlefish-released/&bvt=rss&p=wordpress)
