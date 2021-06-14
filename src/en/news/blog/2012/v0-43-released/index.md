---
title: "v0.43 released"
date: "2012-03-02"
author: "sage"
tags: 
  - "planet"
---

V0.43 is ready, and includes:

- improved signal handlers (cleaner shutdown)
- osd: refactored/improved push/pull code (recovery)
- osd: ability query osd pg state
- osd: ability to query missing/unfound objects
- osd: dump in-progress operations via admin socket
- osd: clearer pg states; added ‘remapped’ and ‘recovering’
- mon: track time since pg states have changed; issue health warning when “stuck” in peering, recovery
- mon: validate new crush map before accepting it
- mon: paxos recovery bug fixes
- crushtool: improved testing
- crush: fix weight adjustment for tree, list buckets; unit tests

This is of course in addition to the usual helping of bug fixes, mostly in the OSD code.  Nothing too drastic this time around.

For v0.44 we plan to complete:

- osd: key/value objects with leveldb
- radosgw: faster/simpler GET and PUT (especially for non-btrfs users)
- radosgw: basic swift/s3 acl interoperability
- librados: caching
- librbd: caching

In the meantime, you can get v0.43 from the following locations (note that our github url has changed):

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.43.tar.gz](http://ceph.newdream.net/download/ceph-0.43.tar.gz)
- For Debian/Ubuntu packages, see[http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-43-released/&bvt=rss&p=wordpress)
