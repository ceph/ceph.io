---
title: "v0.48.1 ‘argonaut’ stable update released"
date: "2012-08-14"
author: "sage"
tags: 
---

We’ve built and pushed the first update to the argonaut stable release.  This branch has a range of small fixes for stability, compatibility, and performance, but no major changes in functionality.  The stability fixes are particularly important for large clusters with many OSDs, and for network environments where intermittent network failures are more common.

The highlights include:

- mkcephfs: use default ‘keyring’, ‘osd data’, ‘osd journal’ paths when not specified in conf
- msgr: various fixes to socket error handling
- osd: reduce scrub overhead
- osd: misc peering fixes (past\_interval sharing, pgs stuck in ‘peering’ states)
- osd: fail on EIO in read path (do not silently ignore read errors from failing disks)
- osd: avoid internal heartbeat errors by breaking some large transactions into pieces
- osd: fix osdmap catch-up during startup (catch up and then add daemon to osdmap)
- osd: fix spurious ‘misdirected op’ messages
- osd: report scrub status via ‘pg … query’
- rbd: fix race when watch registrations are resent
- rbd: fix rbd image id assignment scheme (new image data objects have slightly different names)
- rbd: fix perf stats for cache hit rate
- rbd tool: fix off-by-one in key name (crash when empty key specified)
- rbd: more robust udev rules
- rados tool: copy object, pool commands
- radosgw: fix in usage stats trimming
- radosgw: misc compatibility fixes (date strings, ETag quoting, swift headers, etc.)
- ceph-fuse: fix locking in read/write paths
- mon: fix rare race corrupting on-disk data
- config: fix admin socket ‘config set’ command
- log: fix in-memory log event gathering
- debian: remove crush headers, include librados-config
- rpm: add ceph-disk-{activate, prepare}

The fix for the radosgw usage trimming is incompatible with v0.48 (which was effectively broken).  You now need to use the v0.48.1 version of radosgw-admin to initiate usage stats trimming.

There are a range of smaller bug fixes as well.  For a complete list of what went into this release, please see [the release notes and changelog](http://ceph.com/docs/master/release-notes/).

You can get this stable update from the usual locations:

- Git at git://[github.com/ceph/ceph](http://github.com/ceph/ceph).git
- Tarball at [http://ceph.newdream.net/download/ceph-0.48.1.tar.gz](http://ceph.newdream.net/download/ceph-0.48.1.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/install/debian](http://ceph.newdream.net/docs/master/install/debian)

