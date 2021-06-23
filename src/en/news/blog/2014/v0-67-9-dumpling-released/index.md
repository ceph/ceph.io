---
title: "v0.67.9 Dumpling released"
date: "2014-05-21"
author: "sage"
---

This Dumpling point release fixes several minor bugs. The most prevalent in the field is one that occasionally prevents OSDs from starting on recently created clusters.

We recommand that all Dumpling users upgrade at their convenience.

### NOTABLE CHANGES

- ceph-fuse, libcephfs: client admin socket command to kick and inspect MDS sessions (#8021, Zheng Yan)
- monclient: fix failure detection during mon handshake (#8278, Sage Weil)
- mon: set tid on no-op PGStatsAck messages (#8280, Sage Weil)
- msgr: fix a rare bug with connection negotiation between OSDs (Guang Yang)
- osd: allow snap trim throttling with simple delay (#6278, Sage Weil)
- osd: check for splitting when processing recover/backfill reservations (#6565, Samuel Just)
- osd: fix backfill position tracking (#8162, Samuel Just)
- osd: fix bug in backfill stats (Samuel Just)
- osd: fix bug preventing OSD startup for infant clusters (#8162, Greg Farnum)
- osd: fix rare PG resurrection race causing an incomplete PG (#7740, Samuel Just)
- osd: only complete replicas count toward min\_size (#7805, Samuel Just)
- rgw: allow setting ACLs with empty owner (#6892, Yehuda Sadeh)
- rgw: send user manifest header field (#8170, Yehuda Sadeh)

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.67.9.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.67.9.tar.gz](http://ceph.com/download/ceph-0.67.9.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
