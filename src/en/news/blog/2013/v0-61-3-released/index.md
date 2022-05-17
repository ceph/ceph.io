---
title: "v0.61.3 released"
date: "2013-06-06"
author: "sage"
tags: 
  - "release"
  - "cuttlefish"
---

This is a much-anticipated point release for the v0.61 Cuttlefish stable series.  It resolves a number of issues, primarily with monitor stability and leveldb trimming.  All v0.61.x uses are encouraged to upgrade.

Upgrading from bobtail:

- There is one known problem with mon upgrades from bobtail.  If the ceph-mon conversion on startup is aborted or fails for some reason, we do not correctly error out, but instead continue with (in certain cases) odd results.  Please be careful if you have to restart the mons during the upgrade.  A 0.61.4 release with a fix will be out shortly.
- In the meantime, for current cuttlefish users, 0.61.3 is safe to use.

Notable changes since v0.61.2:

- mon: paxos state trimming fix (resolves runaway disk usage)
- mon: finer-grained compaction on trim
- mon: discard messages from disconnected clients (lowers load)
- mon: leveldb compaction and other stats available via admin socket
- mon: async compaction (lower overhead)
- mon: fix bug incorrectly marking osds down with insufficient failure reports
- osd: fixed small bug in pg request map
- osd: avoid rewriting pg info on every osdmap
- osd: avoid internal heartbeta timeouts when scrubbing very large objects
- osd: fix narrow race with journal replay
- mon: fixed narrow pg split race
- rgw: fix leaked space when copying object
- rgw: fix iteration over large/untrimmed usage logs
- rgw: fix locking issue with ops log socket
- rgw: require matching version of librados
- librbd: make image creation defaults configurable (e.g., create format 2 images via qemu-img)
- fix units in ‘ceph df’ output
- debian: fix prerm/postinst hooks to start/stop daemons appropriately
- upstart: allow uppercase daemons names (and thus hostnames)
- sysvinit: fix enumeration of local daemons by type
- sysvinit: fix osd weight calcuation when using -a
- fix build on unsigned char platforms (e.g., arm)

See [the full release notes](http://ceph.com/docs/master/release-notes/#v0-61-3-cuttlefish) for more details.

You can get v0.61.3 from the usual places:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.61.3.tar.gz](http://ceph.com/download/ceph-0.61.3.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-3-released/&bvt=rss&p=wordpress)
