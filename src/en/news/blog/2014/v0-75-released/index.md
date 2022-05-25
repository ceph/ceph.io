---
title: "v0.75 released"
date: "2014-01-15"
author: "sage"
tags:
  - "release"
---

This is a big release, with lots of infrastructure going in for firefly. The big items include a prototype standalone frontend for radosgw (which does not require apache or fastcgi), tracking for read activity on the osds (to inform tiering decisions), preliminary cache pool support (no snapshots yet), and lots of bug fixes and other work across the tree to get ready for the next batch of erasure coding patches.

For comparison, here are the diff stats for the last few versions:

v0.75 291 files changed, 82713 insertions(+), 33495 deletions(-)
v0.74 192 files changed, 17980 insertions(+), 1062 deletions(-)
v0.73 148 files changed, 4464 insertions(+), 2129 deletions(-)

### UPGRADING

- The ‘osd pool create ...’ syntax has changed for erasure pools.
- The default CRUSH rules and layouts are now using the latest and greatest tunables and defaults. Clusters using the old values will now present with a health WARN state. This can be disabled by adding ‘mon warn on legacy crush tunables = false’ to ceph.conf.

### NOTABLE CHANGES

- common: bloom filter improvements (Sage Weil)
- common: fix config variable substitution (Loic Dachary)
- crush, osd: s/rep/replicated/ for less confusion (Loic Dachary)
- crush: refactor descend\_once behavior; support set\_choose\*\_tries for replicated rules (Sage Weil)
- librados: fix throttle leak (and eventual deadlock) (Josh Durgin)
- librados: read directly into user buffer (Rutger ter Borg)
- librbd: fix use-after-free aio completion bug #5426 (Josh Durgin)
- librbd: localize/distribute parent reads (Sage Weil)
- mds: fix Resetter locking (Alexandre Oliva)
- mds: fix cap migration behavior (Yan, Zheng)
- mds: fix client session flushing (Yan, Zheng)
- mds: fix many many multi-mds bugs (Yan, Zheng)
- misc portability work (Noah Watkins)
- mon, osd: create erasure style crush rules (Loic Dachary, Sage Weil)
- mon: ‘osd crush show-tunables’ (Sage Weil)
- mon: clean up initial crush rule creation (Loic Dachary)
- mon: improve (replicate or erasure) pool creation UX (Loic Dachary)
- mon: infrastructure to handle mixed-version mon cluster and cli/rest API (Greg Farnum)
- mon: mkfs now idempotent (Loic Dachary)
- mon: only seed new osdmaps to current OSDs (Sage Weil)
- mon: track osd features in OSDMap (Joao Luis, David Zafman)
- mon: warn if crush has non-optimal tunables (Sage Weil)
- mount.ceph: add -n for autofs support (Steve Stock)
- msgr: fix messenger restart race (Xihui He)
- osd, librados: fix full cluster handling (Josh Durgin)
- osd: add HitSet tracking for read ops (Sage Weil, Greg Farnum)
- osd: backfill to osds not in acting set (David Zafman)
- osd: enable new hashpspool layout by default (Sage Weil)
- osd: erasure plugin benchmarking tool (Loic Dachary)
- osd: fix XFS detection (Greg Farnum, Sushma Gurram)
- osd: fix copy-get omap bug (Sage Weil)
- osd: fix linux kernel version detection (Ilya Dryomov)
- osd: fix memstore segv (Haomai Wang)
- osd: fix several bugs with tier infrastructure
- osd: fix throttle thread (Haomai Wang)
- osd: preliminary cache pool support (no snaps) (Greg Farnum, Sage Weil)
- rados tool: fix listomapvals (Josh Durgin)
- rados: add ‘crush location’, smart replica selection/balancing (Sage Weil)
- rados: some performance optimizations (Yehuda Sadeh)
- rbd: add rbdmap support for upstart (Laurent Barbe)
- rbd: expose kernel rbd client options via ‘rbd map’ (Ilya Dryomov)
- rbd: fix bench-write command (Hoamai Wang)
- rbd: support for 4096 mapped devices, up from ~250 (Ilya Dryomov)
- rgw: allow multiple frontends (Yehuda Sadeh)
- rgw: convert bucket info to new format on demand (Yehuda Sadeh)
- rgw: fix misc CORS bugs (Robin H. Johnson)
- rgw: prototype mongoose frontend (Yehuda Sadeh)

You can get v0.75 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.75.tar.gz](http://ceph.com/download/ceph-0.75.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
