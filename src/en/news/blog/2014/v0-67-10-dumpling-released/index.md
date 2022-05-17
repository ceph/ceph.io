---
title: "v0.67.10 Dumpling released"
date: "2014-08-12"
author: "sage"
tags:
  - "release"
  - "dumpling"
---

This stable update release for Dumpling includes primarily fixes for RGW, including several issues with bucket listings and a potential data corruption problem when multiple multi-part uploads race. There is also some throttling capability added in the OSD for scrub that can mitigate the performance impact on production clusters.

We recommend that all Dumpling users upgrade at their convenience.

### NOTABLE CHANGES

- ceph-disk: partprobe befoere settle, fixing dm-crypt (#6966, Eric Eastman)
- librbd: add invalidate cache interface (Josh Durgin)
- librbd: close image if remove\_child fails (Ilya Dryomov)
- librbd: fix potential null pointer dereference (Danny Al-Gaaf)
- librbd: improve writeback checks, performance (Haomai Wang)
- librbd: skip zeroes when copying image (#6257, Josh Durgin)
- mon: fix rule(set) check on ‘ceph pool set ... crush\_ruleset ...’ (#8599, John Spray)
- mon: shut down if mon is removed from cluster (#6789, Joao Eduardo Luis)
- osd: fix filestore perf reports to mon (Sage Weil)
- osd: force any new or updated xattr into leveldb if E2BIG from XFS (#7779, Sage Weil)
- osd: lock snapdir object during write to fix race with backfill (Samuel Just)
- osd: option sleep during scrub (Sage Weil)
- osd: set io priority on scrub and snap trim threads (Sage Weil)
- osd: ‘status’ admin socket command (Sage Weil)
- rbd: tolerate missing NULL terminator on block\_name\_prefix (#7577, Dan Mick)
- rgw: calculate user manifest (#8169, Yehuda Sadeh)
- rgw: fix abort on chunk read error, avoid using extra memory (#8289, Yehuda Sadeh)
- rgw: fix buffer overflow on bucket instance id (#8608, Yehuda Sadeh)
- rgw: fix crash in swift CORS preflight request (#8586, Yehuda Sadeh)
- rgw: fix implicit removal of old objects on object creation (#8972, Patrycja Szablowska, Yehuda Sadeh)
- rgw: fix MaxKeys in bucket listing (Yehuda Sadeh)
- rgw: fix race with multiple updates to a single multipart object (#8269, Yehuda Sadeh)
- rgw: improve bucket listing with delimiter (Yehuda Sadeh)
- rgw: include NextMarker in bucket listing (#8858, Yehuda Sadeh)
- rgw: return error early on non-existent bucket (#7064, Yehuda Sadeh)
- rgw: set truncation flag correctly in bucket listing (Yehuda Sadeh)
- sysvinit: continue starting daemons after pre-mount error (#8554, Sage Weil)

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.67.10.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.67.10.tar.gz](http://ceph.com/download/ceph-0.67.10.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
