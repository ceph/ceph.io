---
title: "v0.92 released"
date: "2015-02-03"
author: "sage"
tags:
  - "release"
---

This is the second-to-last chunk of new stuff before Hammer. Big items include additional checksums on OSD objects, proxied reads in the cache tier, image locking in RBD, optimized OSD Transaction and replication messages, and a big pile of RGW and MDS bug fixes.

### UPGRADING

- The experimental ‘keyvaluestore-dev’ OSD backend has been renamed ‘keyvaluestore’ (for simplicity) and marked as experimental. To enable this untested feature and acknowledge that you understand that it is untested and may destroy data, you need to add the following to your ceph.conf:
    
    enable experimental unrecoverable data corrupting features = keyvaluestore
    
- The following librados C API function calls take a ‘flags’ argument whose value is now correctly interpreted:
    
    > rados\_write\_op\_operate() rados\_aio\_write\_op\_operate() rados\_read\_op\_operate() rados\_aio\_read\_op\_operate()
    
    The flags were not correctly being translated from the librados constants to the internal values. Now they are. Any code that is passing flags to these methods should be audited to ensure that they are using the correct LIBRADOS\_OP\_FLAG\_\* constants.
- The ‘rados’ CLI ‘copy’ and ‘cppool’ commands now use the copy-from operation, which means the latest CLI cannot run these commands against pre-firefly OSDs.
- The librados watch/notify API now includes a watch\_flush() operation to flush the async queue of notify operations. This should be called by any watch/notify user prior to rados\_shutdown().

### NOTABLE CHANGES

- add experimental features option (Sage Weil)
- build: fix ‘make check’ races (#10384 Loic Dachary)
- build: fix pkg names when libkeyutils is missing (Pankag Garg, Ken Dreyer)
- ceph: make ‘ceph -s’ show PG state counts in sorted order (Sage Weil)
- ceph: make ‘ceph tell mon.\* version’ work (Mykola Golub)
- ceph-monstore-tool: fix/improve CLI (Joao Eduardo Luis)
- ceph: show primary-affinity in ‘ceph osd tree’ (Mykola Golub)
- common: add TableFormatter (Andreas Peters)
- common: check syncfs() return code (Jianpeng Ma)
- doc: do not suggest dangerous XFS nobarrier option (Dan van der Ster)
- doc: misc updates (Nilamdyuti Goswami, John Wilkins)
- install-deps.sh: do not require sudo when root (Loic Dachary)
- libcephfs: fix dirfrag trimming (#10387 Yan, Zheng)
- libcephfs: fix mount timeout (#10041 Yan, Zheng)
- libcephfs: fix test (#10415 Yan, Zheng)
- libcephfs: fix use-afer-free on umount (#10412 Yan, Zheng)
- libcephfs: include ceph and git version in client metadata (Sage Weil)
- librados: add watch\_flush() operation (Sage Weil, Haomai Wang)
- librados: avoid memcpy on getxattr, read (Jianpeng Ma)
- librados: create ioctx by pool id (Jason Dillaman)
- librados: do notify completion in fast-dispatch (Sage Weil)
- librados: remove shadowed variable (Kefu Chain)
- librados: translate op flags from C APIs (Matthew Richards)
- librbd: differentiate between R/O vs R/W features (Jason Dillaman)
- librbd: exclusive image locking (Jason Dillaman)
- librbd: fix write vs import race (#10590 Jason Dillaman)
- librbd: gracefully handle deleted/renamed pools (#10270 Jason Dillaman)
- mds: asok command for fetching subtree map (John Spray)
- mds: constify MDSCacheObjects (John Spray)
- misc: various valgrind fixes and cleanups (Danny Al-Gaaf)
- mon: fix ‘mds fail’ for standby MDSs (John Spray)
- mon: fix stashed monmap encoding (#5203 Xie Rui)
- mon: implement ‘fs reset’ command (John Spray)
- mon: respect down flag when promoting standbys (John Spray)
- mount.ceph: fix suprious error message (#10351 Yan, Zheng)
- msgr: async: many fixes, unit tests (Haomai Wang)
- msgr: simple: retry binding to port on failure (#10029 Wido den Hollander)
- osd: add fadvise flags to ObjectStore API (Jianpeng Ma)
- osd: add get\_latest\_osdmap asok command (#9483 #9484 Mykola Golub)
- osd: EIO on whole-object reads when checksum is wrong (Sage Weil)
- osd: filejournal: don’t cache journal when not using direct IO (Jianpeng Ma)
- osd: fix ioprio option (Mykola Golub)
- osd: fix scrub delay bug (#10693 Samuel Just)
- osd: fix watch reconnect race (#10441 Sage Weil)
- osd: handle no-op write with snapshot (#10262 Sage Weil)
- osd: journal: fix journal zeroing when direct IO is enabled (Xie Rui)
- osd: keyvaluestore: cleanup dead code (Ning Yao)
- osd, mds: ‘ops’ as shorthand for ‘dump\_ops\_in\_flight’ on asok (Sage Weil)
- osd: memstore: fix size limit (Xiaoxi Chen)
- osd: misc scrub fixes (#10017 Loic Dachary)
- osd: new optimized encoding for ObjectStore::Transaction (Dong Yuan)
- osd: optimize filter\_snapc (Ning Yao)
- osd: optimize WBThrottle map with unordered\_map (Ning Yao)
- osd: proxy reads during cache promote (Zhiqiang Wang)
- osd: proxy read support (Zhiqiang Wang)
- osd: remove legacy classic scrub code (Sage Weil)
- osd: remove unused fields in MOSDSubOp (Xiaoxi Chen)
- osd: replace MOSDSubOp messages with simpler, optimized MOSDRepOp (Xiaoxi Chen)
- osd: store whole-object checksums on scrub, write\_full (Sage Weil)
- osd: verify kernel is new enough before using XFS extsize ioctl, enable by default (#9956 Sage Weil)
- rados: use copy-from operation for copy, cppool (Sage Weil)
- rgw: change multipart upload id magic (#10271 Yehuda Sadeh)
- rgw: decode http query params correction (#10271 Yehuda Sadeh)
- rgw: fix content length check (#10701 Axel Dunkel, Yehuda Sadeh)
- rgw: fix partial GET in swift (#10553 Yehuda Sadeh)
- rgw: fix shutdown (#10472 Yehuda Sadeh)
- rgw: include XML ns on get ACL request (#10106 Yehuda Sadeh)
- rgw: misc fixes (#10307 Yehuda Sadeh)
- rgw: only track cleanup for objects we write (#10311 Yehuda Sadeh)
- rgw: tweak error codes (#10329 #10334 Yehuda Sadeh)
- rgw: use gc for multipart abort (#10445 Aaron Bassett, Yehuda Sadeh)
- sysvinit: fix race in ‘stop’ (#10389 Loic Dachary)
- test: fix bufferlist tests (Jianpeng Ma)
- tests: improve docker-based tests (Loic Dachary)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.92.tar.gz](http://ceph.com/download/ceph-0.92.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
