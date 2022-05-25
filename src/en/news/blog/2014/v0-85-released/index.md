---
title: "v0.85 released"
date: "2014-09-08"
author: "sage"
tags:
  - "release"
---

This is the second-to-last development release before Giant that contains new functionality. The big items to land during this cycle are the messenger refactoring from Matt Benjmain that lays some groundwork for RDMA support, a performance improvement series from SanDisk that improves performance on SSDs, lots of improvements to our new standalone civetweb-based RGW frontend, and a new ‘osd blocked-by’ mon command that allows admins to easily identify which OSDs are blocking peering progress. The other big change is that the OSDs and Monitors now distinguish between “misplaced” and “degraded” objects: the latter means there are fewer copies than we’d like, while the former simply means the are not stored in the locations where we want them to be.

Also of note is a change to librbd that enables client-side caching by default. This is coupled with another option that makes the cache write-through until a “flush” operations is observed: this implies that the librbd user (usually a VM guest OS) supports barriers and flush and that it is safe for the cache to switch into writeback mode without compromising data safety or integrity. It has long been recommended practice that these options be enabled (e.g., in OpenStack environments) but until now it has not been the default.

We have frozen the tree for the looming Giant release, and the next development release will be a release candidate with a final batch of new functionality.

### UPGRADING

- The client-side caching for librbd is now enabled by default (rbd cache = true). A safety option (rbd cache writethrough until flush = true) is also enabled so that writeback caching is not used until the library observes a ‘flush’ command, indicating that the librbd users is passing that operation through from the guest VM. This avoids potential data loss when used with older versions of qemu that do not support flush.
    
    > leveldb\_write\_buffer\_size = 32\*1024\*1024 = 33554432 // 32MB leveldb\_cache\_size = 512\*1024\*1204 = 536870912 // 512MB leveldb\_block\_size = 64\*1024 = 65536 // 64KB leveldb\_compression = false leveldb\_log = “”
    
    OSDs will still maintain the following osd-specific defaults:
    
    > leveldb\_log = “”
    
- The ‘rados getxattr ...’ command used to add a gratuitous newline to the attr value; it now does not.

### NOTABLE CHANGES

- ceph-disk: do not inadvertantly create directories (Owne Synge)
- ceph-disk: fix dmcrypt support (Sage Weil)
- ceph-disk: linter cleanup, logging improvements (Alfredo Deza)
- ceph-disk: show information about dmcrypt in ‘ceph-disk list’ output (Sage Weil)
- ceph-disk: use partition type UUIDs and blkid (Sage Weil)
- ceph: fix for non-default cluster names (#8944, Dan Mick)
- doc: document new upstream wireshark dissector (Kevin Cox)
- doc: many install doc updates (John Wilkins)
- librados: fix lock leaks in error paths (#9022, Paval Rallabhandi)
- librados: fix pool existence check (#8835, Pavan Rallabhandi)
- librbd: enable caching by default (Sage Weil)
- librbd: fix crash using clone of flattened image (#8845, Josh Durgin)
- librbd: store and retrieve snapshot metadata based on id (Josh Durgin)
- mailmap: many updates (Loic Dachary)
- mds: add min/max UID for snapshot creation/deletion (#9029, Wido den Hollander)
- misc build errors/warnings for Fedora 20 (Boris Ranto)
- mon: add ‘osd blocked-by’ command to easily see which OSDs are blocking peering progress (Sage Weil)
- mon: add perfcounters for paxos operations (Sage Weil)
- mon: create default EC profile if needed (Loic Dachary)
- mon: fix crash on loopback messages and paxos timeouts (#9062, Sage Weil)
- mon: fix divide by zero when pg\_num is adjusted before OSDs are added (#9101, Sage Weil)
- mon: fix occasional memory leak after session reset (#9176, Sage Weil)
- mon: fix ruleset/ruleid bugs (#9044, Loic Dachary)
- mon: make usage dumps in terms of bytes, not kB (Sage Weil)
- mon: prevent implicit destruction of OSDs with ‘osd setmaxosd ...’ (#8865, Anand Bhat)
- mon: verify all quorum members are contiguous at end of Paxos round (#9053, Sage Weil)
- msgr: refactor to cleanly separate SimpleMessenger implemenetation, move toward Connection-based calls (Matt Benjamin, Sage Wei)
- objectstore: clean up KeyValueDB interface for key/value backends (Sage Weil)
- osd: add local\_mtime for use by cache agent (Zhiqiang Wang)
- osd: add superblock for KeyValueStore backend (Haomai Wang)
- osd: add support for Intel ISA-L erasure code library (Andreas-Joachim Peters)
- osd: do not skip promote for write-ordered reads (#9064, Samuel Just)
- osd: fix ambigous encoding order for blacklisted clients (#9211, Sage Weil)
- osd: fix cache flush corner case for snapshotted objects (#9054, Samuel Just)
- osd: fix discard of old/obsolete subop replies (#9259, Samuel Just)
- osd: fix discard of peer messages from previous intervals (Greg Farnum)
- osd: fix dump of open fds on EMFILE (Sage Weil)
- osd: fix journal dump (Ma Jianpeng)
- osd: fix mon feature bit requirements bug and resulting log spam (Sage Weil)
- osd: fix recovery chunk size usage during EC recovery (Ma Jianpeng)
- osd: fix recovery reservation deadlock for EC pools (Samuel Just)
- osd: fix removal of old xattrs when overwriting chained xattrs (Ma Jianpeng)
- osd: fix requesting queueing on PG split (Samuel Just)
- osd: force new xattrs into leveldb if fs returns E2BIG (#7779, Sage Weil)
- osd: implement alignment on chunk sizes (Loic Dachary)
- osd: improve prioritization of recovery of degraded over misplaced objects (Sage Weil)
- osd: locking, sharding, caching improvements in FileStore’s FDCache (Somnath Roy, Greg Farnum)
- osd: many important bug fixes (Samuel Just)
- osd, mon: add rocksdb support (Xinxin Shu, Sage Weil)
- osd, mon: distinguish between “misplaced” and “degraded” objects in cluster health and PG state reporting (Sage Weil)
- osd: refactor some ErasureCode functionality into command parent class (Loic Dachary)
- osd: set rollback\_info\_completed on create (#8625, Samuel Just)
- rados: allow setxattr value to be read from stdin (Sage Weil)
- rados: drop gratuitous n from getxattr command (Sage Weil)
- rgw: add –min-rewrite-stripe-size for object restriper (Yehuda Sadeh)
- rgw: add powerdns hook for dynamic DNS for global clusters (Wido den Hollander)
- rgw: copy object data is target bucket is in a different pool (#9039, Yehuda Sadeh)
- rgw: do not try to authenticate CORS preflight requests (#8718, Robert Hubbard, Yehuda Sadeh)
- rgw: fix civetweb URL decoding (#8621, Yehuda Sadeh)
- rgw: fix removal of objects during object creation (Patrycja Szablowska, Yehuda Sadeh)
- rgw: fix striping for copied objects (#9089, Yehuda Sadeh)
- rgw: fix test for identify whether an object has a tail (#9226, Yehuda Sadeh)
- rgw: fix when stripe size is not a multiple of chunk size (#8937, Yehuda Sadeh)
- rgw: improve civetweb logging (Yehuda Sadeh)
- rgw: misc civetweb frontend fixes (Yehuda Sadeh)
- sysvinit: add support for non-default cluster names (Alfredo Deza)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.85.tar.gz](http://ceph.com/download/ceph-0.85.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
