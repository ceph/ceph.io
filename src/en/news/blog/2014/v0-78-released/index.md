---
title: "v0.78 released"
date: "2014-03-22"
author: "sage"
---

This development release includes two key features: erasure coding and cache tiering. A huge amount of code was merged for this release and several additional weeks were spent stabilizing the code base, and it is now in a state where it is ready to be tested by a broader user base.

This is _not_ the firefly release. Firefly will be delayed for at least another sprint so that we can get some operational experience with the new code and do some additional testing before committing to long term support.

Please note that while it is possible to create and test erasure coded pools in this release, the pools will not be usable when you upgrade to v0.79 as the OSDMap encoding will subtlely change. Please do not populate your test pools with important data that can’t be reloaded.

### UPGRADING

- Upgrade daemons in the following order:
    
    > 1. Monitors
    > 2. OSDs
    > 3. MDSs and/or radosgw
    
    If the ceph-mds daemon is restarted first, it will wait until all OSDs have been upgraded before finishing its startup sequence. If the ceph-mon daemons are not restarted prior to the ceph-osd daemons, they will not correctly register their new capabilities with the cluster and new features may not be usable until they are restarted a second time.
- Upgrade radosgw daemons together. There is a subtle change in behavior for multipart uploads that prevents a multipart request that was initiated with a new radosgw from being completed by an old radosgw.
- CephFS recently added support for a new ‘backtrace’ attribute on file data objects that is used for lookup by inode number (i.e., NFS reexport and hard links), and will later be used by fsck repair. This replaces the existing anchor table mechanism that is used for hard link resolution. In order to completely phase that out, any inode that has an outdated backtrace attribute will get updated when the inode itself is modified. This will result in some extra workload after a legacy CephFS file system is upgraded.
- The per-op return code in librados’ ObjectWriteOperation interface is now filled in.
- The librados cmpxattr operation now handles xattrs containing null bytes as data rather than null-terminated strings.
- Compound operations in librados that create and then delete the same object are now explicitly disallowed (they fail with -EINVAL).

### NOTABLE CHANGES

- ceph-brag: new client and server tools (Sebastien Han, Babu Shanmugam)
- ceph-disk: use partx on RHEL or CentOS instead of partprobe (Alfredo Deza)
- ceph: fix combination of ‘tell’ and interactive mode (Joao Eduardo Luis)
- ceph-fuse: fix bugs with inline data and multiple MDSs (Zheng Yan)
- client: fix getcwd() to use new LOOKUPPARENT operation (Zheng Yan)
- common: fall back to json-pretty for admin socket (Loic Dachary)
- common: fix ‘config dump’ debug prefix (Danny Al-Gaaf)
- common: misc coverity fixes (Danny Al-Gaaf)
- common: throtller, shared\_cache performance improvements, TrackedOp (Greg Farnum, Samuel Just)
- crush: fix JSON schema for dump (John Spray)
- crush: misc cleanups, tests (Loic Dachary)
- crush: new vary\_r tunable (Sage Weil)
- crush: prevent invalid buckets of type 0 (Sage Weil)
- keyvaluestore: add perfcounters, misc bug fixes (Haomai Wang)
- keyvaluestore: portability improvements (Noah Watkins)
- libcephfs: API changes to better support NFS reexport via Ganesha (Matt Benjamin, Adam Emerson, Andrey Kuznetsov, Casey Bodley, David Zafman)
- librados: API documentation improvements (John Wilkins, Josh Durgin)
- librados: fix object enumeration bugs; allow iterator assignment (Josh Durgin)
- librados: streamline tests (Josh Durgin)
- librados: support for atomic read and omap operations for C API (Josh Durgin)
- librados: support for osd and mon command timeouts (Josh Durgin)
- librbd: pass allocation hints to OSD (Ilya Dryomov)
- logrotate: fix bug that prevented rotation for some daemons (Loic Dachary)
- mds: avoid duplicated discovers during recovery (Zheng Yan)
- mds: fix file lock owner checks (Zheng Yan)
- mds: fix LOOKUPPARENT, new LOOKUPNAME ops for reliable NFS reexport (Zheng Yan)
- mds: fix xattr handling on setxattr (Zheng Yan)
- mds: fix xattrs in getattr replies (Sage Weil)
- mds: force backtrace updates for old inodes on update (Zheng Yan)
- mds: several multi-mds and dirfrag bug fixes (Zheng Yan)
- mon: encode erasure stripe width in pool metadata (Loic Dachary)
- mon: erasure code crush rule creation (Loic Dachary)
- mon: erasure code plugin support (Loic Dachary)
- mon: fix bugs in initial post-mkfs quorum creation (Sage Weil)
- mon: fix error output to terminal during startup (Joao Eduardo Luis)
- mon: fix legacy CRUSH tunables warning (Sage Weil)
- mon: fix osd\_epochs lower bound tracking for map trimming (Sage Weil)
- mon: fix OSDMap encoding features (Sage Weil, Aaron Ten Clay)
- mon: fix ‘pg dump’ JSON output (John Spray)
- mon: include dirty stats in ‘ceph df detail’ (Sage Weil)
- mon: list quorum member names in quorum order (Sage Weil)
- mon: prevent addition of non-empty cache tier (Sage Weil)
- mon: prevent deletion of CephFS pools (John Spray)
- mon: warn when cache tier approaches ‘full’ (Sage Weil)
- osd: allocation hint, with XFS support (Ilya Dryomov)
- osd: erasure coded pool support (Samuel Just)
- osd: fix bug causing slow/stalled recovery (#7706) (Samuel Just)
- osd: fix bugs in log merging (Samuel Just)
- osd: fix/clarify end-of-object handling on read (Loic Dachary)
- osd: fix impolite mon session backoff, reconnect behavior (Greg Farnum)
- osd: fix SnapContext cache id bug (Samuel Just)
- osd: increase default leveldb cache size and write buffer (Sage Weil, Dmitry Smirnov)
- osd: limit size of ‘osd bench ...’ arguments (Joao Eduardo Luis)
- osdmaptool: new –test-map-pgs mode (Sage Weil, Ilya Dryomov)
- osd, mon: add primary-affinity to adjust selection of primaries (Sage Weil)
- osd: new ‘status’ admin socket command (Sage Weil)
- osd: simple tiering agent (Sage Weil)
- osd: store checksums for erasure coded object stripes (Samuel Just)
- osd: tests for objectstore backends (Haomai Wang)
- osd: various refactoring and bug fixes (Samuel Just, David Zafman)
- rados: add ‘set-alloc-hint’ command (Ilya Dryomov)
- rbd-fuse: fix enumerate\_images overflow, memory leak (Ilya Dryomov)
- rbdmap: fix upstart script (Stephan Renatus)
- rgw: avoid logging system events to usage log (Yehuda Sadeh)
- rgw: fix Swift range reponse (Yehuda Sadeh)
- rgw: improve scalability for manifest objects (Yehuda Sadeh)
- rgw: misc fixes for multipart objects, policies (Yehuda Sadeh)
- rgw: support non-standard MultipartUpload command (Yehuda Sadeh)

You can get v0.78 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.78.tar.gz](http://ceph.com/download/ceph-0.78.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
