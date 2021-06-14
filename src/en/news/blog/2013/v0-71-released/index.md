---
title: "v0.71 released"
date: "2013-10-18"
author: "sage"
tags: 
  - "planet"
---

This development release includes a significant amount of new code and refactoring, as well as a lot of preliminary functionality that will be needed for erasure coding and tiering support. There are also several significant patch sets improving this with the MDS.

Upgrading:

- The MDS now disallows snapshots by default as they are not considered stable. The command ‘ceph mds set allow\_snaps’ will enable them.
- For clusters that were created before v0.44 (pre-argonaut, Spring 2012) and store radosgw data, the auto-upgrade from TMAP to OMAP objects has been disabled. Before upgrading, make sure that any buckets created on pre-argonaut releases have been modified (e.g., by PUTing and then DELETEing an object from each bucket). Any cluster created with argonaut (v0.48) or a later release or not using radosgw never relied on the automatic conversion and is not affected by this change.
- Any direct users of the ‘tmap’ portion of the librados API should be aware that the automatic tmap -> omap conversion functionality has been removed.
- Most output that used K or KB (e.g., for kilobyte) now uses a lower-case k to match the official SI convention. Any scripts that parse output and check for an upper-case K will need to be modified.

Notable changes:

- build: Makefile refactor (Roald J. van Loon)
- ceph-disk: fix journal preallocation
- ceph-fuse: trim deleted inodes from cache (Yan, Zheng)
- ceph-fuse: use newer fuse api (Jianpeng Ma)
- ceph-kvstore-tool: new tool for working with leveldb (copy, crc) (Joao Luis)
- common: bloom\_filter improvements, cleanups
- common: correct SI is kB not KB (Dan Mick)
- common: misc portability fixes (Noah Watkins)
- hadoop: removed old version of shim to avoid confusing users (Noah Watkins)
- librados: fix installed header #includes (Dan Mick)
- librbd, ceph-fuse: avoid some sources of ceph-fuse, rbd cache stalls
- mds: fix LOOKUPSNAP bug
- mds: fix standby-replay when we fall behind (Yan, Zheng)
- mds: fix stray directory purging (Yan, Zheng)
- mon, osd: improve osdmap trimming logic (Samuel Just)
- mon: kv properties for pools to support EC (Loic Dachary)
- mon: some auth check cleanups (Joao Luis)
- mon: track per-pool stats (Joao Luis)
- mon: warn about pools with bad pg\_num
- osd: automatically detect proper xattr limits (David Zafman)
- osd: avoid extra copy in erasure coding reference implementation (Loic Dachary)
- osd: basic cache pool redirects (Greg Farnum)
- osd: basic whiteout, dirty flag support (not yet used)
- osd: clean up and generalize copy-from code (Greg Farnum)
- osd: erasure coding doc updates (Loic Dachary)
- osd: erasure coding plugin infrastructure, tests (Loic Dachary)
- osd: fix RWORDER flags
- osd: fix exponential backoff of slow request warnings (Loic Dachary)
- osd: generalized temp object infrastructure
- osd: ghobject\_t infrastructure for EC (David Zafman)
- osd: improvements for compatset support and storage (David Zafman)
- osd: misc copy-from improvements
- osd: opportunistic crc checking on stored data (off by default)
- osd: refactor recovery using PGBackend (Samuel Just)
- osd: remove old magical tmap->omap conversion
- pybind: fix blacklisting nonce (Loic Dachary)
- rgw: default log level is now more reasonable (Yehuda Sadeh)
- rgw: fix acl group check (Yehuda Sadeh)
- sysvinit: fix shutdown order (mons last) (Alfredo Deza)

We have now frozen the code for v0.72 Emperor, and the next sprint or two will be focused primarily on stability and testing (paritcularly the upgrade path).  There is also still a lot of ongoing development work in flight for the erasure coding and tiering that is coming in Firefly, but that code may sit outside of master for a bit longer while we harden things.

You can get v0.71 from the usual places:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.71.tar.gz](http://ceph.com/download/ceph-0.71.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-71-released/&bvt=rss&p=wordpress)
