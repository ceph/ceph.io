---
title: "v0.87.1 Giant released"
date: "2015-02-26"
author: "sage"
---

This is the first (and possibly final) point release for Giant. Our focus on stability fixes will be directed towards Hammer and Firefly.

We recommend that all v0.87 Giant users upgrade to this release.

### UPGRADING

- Due to a change in the Linux kernel version 3.18 and the limits of the FUSE interface, ceph-fuse needs be mounted as root on at least some systems. See issues #9997, #10277, and #10542 for details.

### NOTABLE CHANGES

- build: disable stack-execute bit on assembler objects (#10114 Dan Mick)
- build: support boost 1.57.0 (#10688 Ken Dreyer)
- ceph-disk: fix dmcrypt file permissions (#9785 Loic Dachary)
- ceph-disk: run partprobe after zap, behave with partx or partprobe (#9665 #9721 Loic Dachary)
- cephfs-journal-tool: fix import for aged journals (#9977 John Spray)
- cephfs-journal-tool: fix journal import (#10025 John Spray)
- ceph-fuse: use remount to trim kernel dcache (#10277 Yan, Zheng)
- common: add cctid meta variable (#6228 Adam Crume)
- common: fix dump of shard for ghobject\_t (#10063 Loic Dachary)
- crush: fix bucket weight underflow (#9998 Pawel Sadowski)
- erasure-code: enforce chunk size alignment (#10211 Loic Dachary)
- erasure-code: regression test suite (#9420 Loic Dachary)
- erasure-code: relax caucy w restrictions (#10325 Loic Dachary)
- libcephfs,ceph-fuse: allow xattr caps on inject\_release\_failure (#9800 John Spray)
- libcephfs,ceph-fuse: fix cap flush tid comparison (#9869 Greg Farnum)
- libcephfs,ceph-fuse: new flag to indicated sorted dcache (#9178 Yan, Zheng)
- libcephfs,ceph-fuse: prune cache before reconnecting to MDS (Yan, Zheng)
- librados: limit number of in-flight read requests (#9854 Jason Dillaman)
- libradospy: fix thread shutdown (#8797 Dan Mick)
- libradosstriper: fix locking issue in truncate (#10129 Sebastien Ponce)
- librbd: complete pending ops before closing mage (#10299 Jason Dillaman)
- librbd: fix error path on image open failure (#10030 Jason Dillaman)
- librbd: gracefully handle deleted/renamed pools (#10270 Jason Dillaman)
- librbd: handle errors when creating ioctx while listing children (#10123 Jason Dillaman)
- mds: fix compat version in MClientSession (#9945 John Spray)
- mds: fix journaler write error handling (#10011 John Spray)
- mds: fix locking for file size recovery (#10229 Yan, Zheng)
- mds: handle heartbeat\_reset during shutdown (#10382 John Spray)
- mds: store backtrace for straydir (Yan, Zheng)
- mon: allow tiers for FS pools (#10135 John Spray)
- mon: fix caching of last\_epoch\_clean, osdmap trimming (#9987 Sage Weil)
- mon: fix ‘fs ls’ on peons (#10288 John Spray)
- mon: fix MDS health status from peons (#10151 John Spray)
- mon: fix paxos off-by-one (#9301 Sage Weil)
- msgr: simple: do not block on takeover while holding global lock (#9921 Greg Farnum)
- osd: deep scrub must not abort if hinfo is missing (#10018 Loic Dachary)
- osd: fix misdirected op detection (#9835 Sage Weil)
- osd: fix past\_interval display for acting (#9752 Loic Dachary)
- osd: fix PG peering backoff when behind on osdmaps (#10431 Sage Weil)
- osd: handle no-op write with snapshot case (#10262 Ssage Weil)
- osd: use fast-dispatch (Sage Weil, Greg Farnum)
- rados: fix write to /dev/null (Loic Dachary)
- radosgw-admin: create subuser when needed (#10103 Yehuda Sadeh)
- rbd: avoid invalidating aio\_write buffer during image import (#10590 Jason Dillaman)
- rbd: fix export with images > 2GB (Vicente Cheng)
- rgw: change multipart upload id magic (#10271 Georgios Dimitrakakis, Yehuda Sadeh)
- rgw: check keystone auth for S3 POST (#10062 Abhishek Lekshmanan)
- rgw: check timestamp for S3 keystone auth (#10062 Abhishek Lekshmanan)
- rgw: fix partial GET with swift (#10553 Yehuda Sadeh)
- rgw: fix quota disable (#9907 Dong Lei)
- rgw: fix rare corruption of object metadata on put (#9576 Yehuda Sadeh)
- rgw: fix S3 object copy content-type (#9478 Yehuda Sadeh)
- rgw: headers end with rn (#9254 Benedikt Fraunhofer, Yehuda Sadeh)
- rgw: remove swift user manifest DLO hash calculation (#9973 Yehuda Sadeh)
- rgw: return correct len when len is 0 (#9877 Yehuda Sadeh)
- rgw: return X-Timestamp field (#8911 Yehuda Sadeh)
- rgw: run radosgw as apache with systemd (#10125)
- rgw: sent ETag on S3 object copy (#9479 Yehuda Sadeh)
- rgw: sent HTTP status reason explicitly in fastcgi (Yehuda Sadeh)
- rgw: set length for keystone token validation (#7796 Mark Kirkwood, Yehuda Sadeh)
- rgw: set ulimit -n on sysvinit before starting daemon (#9587 Sage Weil)
- rgw: update bucket index on set\_attrs (#5595 Yehuda Sadeh)
- rgw: update swift subuser permission masks when authenticating (#9918 Yehuda Sadeh)
- rgw: URL decode HTTP query params correction (#10271 Georgios Dimitrakakis, Yehuda Sadeh)
- rgw: use cached attrs while reading object attrs (#10307 Yehuda Sadeh)
- rgw: use strict\_strtoll for content length (#10701 Axel Dunkel, Yehuda Sadeh)

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.87.1.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.87.1.tar.gz](http://ceph.com/download/ceph-0.87.1.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
