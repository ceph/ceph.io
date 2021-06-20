---
title: "v0.80 Firefly released"
date: "2014-05-07"
author: "sage"
---

We did it!  Firefly is built and pushed out to the ceph.com repositories.

This release will form the basis for our long-term supported release Firefly, v0.80.x. The big new features are support for erasure coding and cache tiering, although a broad range of other features, fixes, and improvements have been made across the code base. Highlights include:

- _Erasure coding_: support for a broad range of erasure codes for lower storage overhead and better data durability.
- _Cache tiering_: support for creating ‘cache pools’ that store hot, recently accessed objects with automatic demotion of colder data to a base tier. Typically the cache pool is backed by faster storage devices like SSDs.
- _Primary affinity_: Ceph now has the ability to skew selection of OSDs as the “primary” copy, which allows the read workload to be cheaply skewed away from parts of the cluster without migrating any data.
- _Key/value OSD backend_ (experimental): An alternative storage backend for Ceph OSD processes that puts all data in a key/value database like leveldb. This provides better performance for workloads dominated by key/value operations (like radosgw bucket indices).
- _Standalone radosgw_ (experimental): The radosgw process can now run in a standalone mode without an apache (or similar) web server or fastcgi. This simplifies deployment and can improve performance.

We expect to maintain a series of stable releases based on v0.80 Firefly for as much as a year. In the meantime, development of Ceph continues with the next release, Giant, which will feature work on the CephFS distributed file system, more alternative storage backends (like RocksDB and f2fs), RDMA support, support for pyramid erasure codes, and additional functionality in the block device (RBD) like copy-on-read and multisite mirroring.

This release is the culmination of a huge collective effort by about 100 differrent contributors.  Thank you to everyone who has helped to make this release possible!

### UPGRADE SEQUENCING

- If your existing cluster is running a version older than v0.67 Dumpling, please first upgrade to the latest Dumpling release before upgrading to v0.80 Firefly. Please refer to the_Dumpling upgrade_ documentation.
- We recommand adding the following to the \[mon\] section of your ceph.conf prior to upgrade:
    
    > mon warn on legacy crush tunables = false
    
    This will prevent health warnings due to the use of legacy CRUSH placement. Although it is possible to rebalance existing data across your cluster (see the upgrade notes below), we do not normally recommend it for production environments as a large amount of data will move and there is a significant performance impact from the rebalancing.
- Upgrade daemons in the following order:
    
    > 1. Monitors
    > 2. OSDs
    > 3. MDSs and/or radosgw
    
    If the ceph-mds daemon is restarted first, it will wait until all OSDs have been upgraded before finishing its startup sequence. If the ceph-mon daemons are not restarted prior to the ceph-osd daemons, they will not correctly register their new capabilities with the cluster and new features may not be usable until they are restarted a second time.
- Upgrade radosgw daemons together. There is a subtle change in behavior for multipart uploads that prevents a multipart request that was initiated with a new radosgw from being completed by an old radosgw.

**UPGRADING FROM V0.79**

- OSDMap’s json-formatted dump changed for keys ‘full’ and ‘nearfull’. What was previously being outputted as ‘true’ or ‘false’ strings are now being outputted ‘true’ and ‘false’ booleans according to json syntax.
- HEALTH\_WARN on ‘mon osd down out interval == 0’. Having this option set to zero on the leader acts much like having the ‘noout’ flag set. This warning will only be reported if the monitor getting the ‘health’ or ‘status’ request has this option set to zero.
- Monitor ‘auth’ commands now require the mon ‘x’ capability. This matches dumpling v0.67.x and earlier, but differs from emperor v0.72.x.
- A librados WATCH operation on a non-existent object now returns ENOENT; previously it did not.
- Librados interface change: As there are no partial writes, the rados\_write() and rados\_append() operations now return 0 on success like rados\_write\_full() always has. This includes the C++ interface equivalents and AIO return values for the aio variants.

### UPGRADING FROM V0.72 EMPEROR

- See notes above.
- The ‘ceph -s’ or ‘ceph status’ command’s ‘num\_in\_osds’ field in the JSON and XML output has been changed from a string to an int.
- The recently added ‘ceph mds set allow\_new\_snaps’ command’s syntax has changed slightly; it is now ‘ceph mds set allow\_new\_snaps true’. The ‘unset’ command has been removed; instead, set the value to ‘false’.
- The syntax for allowing snapshots is now ‘mds set allow\_new\_snaps <true|false>’ instead of ‘mds <set,unset> allow\_new\_snaps’.
- ‘rbd ls’ on a pool which never held rbd images now exits with code 0. It outputs nothing in plain format, or an empty list in non-plain format. This is consistent with the behavior for a pool which used to hold images, but contains none. Scripts relying on this behavior should be updated.
- The MDS requires a new OSD operation TMAP2OMAP, added in this release. When upgrading, be sure to upgrade and restart the ceph-osd daemons before the ceph-mds daemon. The MDS will refuse to start if any up OSDs do not support the new feature.
- The ‘ceph mds set\_max\_mds N’ command is now deprecated in favor of ‘ceph mds set max\_mds N’.
- The ‘osd pool create ...’ syntax has changed for erasure pools.
- The default CRUSH rules and layouts are now using the latest and greatest tunables and defaults. Clusters using the old values will now present with a health WARN state. This can be disabled by adding ‘mon warn on legacy crush tunables = false’ to ceph.conf.
- We now default to the ‘bobtail’ CRUSH tunable values that are first supported by Ceph clients in bobtail (v0.56) and Linux kernel version v3.9. If you plan to access a newly created Ceph cluster with an older kernel client, you should use ‘ceph osd crush tunables legacy’ to switch back to the legacy behavior. Note that making that change will likely result in some data movement in the system, so adjust the setting before populating the new cluster with data.
- We now set the HASHPSPOOL flag on newly created pools (and new clusters) by default. Support for this flag first appeared in v0.64; v0.67 Dumpling is the first major release that supports it. It is first supported by the Linux kernel version v3.9. If you plan to access a newly created Ceph cluster with an older kernel or clients (e.g, librados, librbd) from a pre-dumpling Ceph release, you should add ‘osd pool default flag hashpspool = false’ to the ‘\[global\]’ section of your ‘ceph.conf’ prior to creating your monitors (e.g., after ‘ceph-deploy new’ but before ‘ceph-deploy mon create ...’).
- The configuration option ‘osd pool default crush rule’ is deprecated and replaced with ‘osd pool default crush replicated ruleset’. ‘osd pool default crush rule’ takes precedence for backward compatibility and a deprecation warning is displayed when it is used.
- As part of fix for #6796, ‘ceph osd pool set <pool> <var> <arg>’ now receives <arg> as an integer instead of a string. This affects how ‘hashpspool’ flag is set/unset: instead of ‘true’ or ‘false’, it now must be ‘0’ or ‘1’.
- The behavior of the CRUSH ‘indep’ choose mode has been changed. No ceph cluster should have been using this behavior unless someone has manually extracted a crush map, modified a CRUSH rule to replace ‘firstn’ with ‘indep’, recompiled, and reinjected the new map into the cluster. If the ‘indep’ mode is currently in use on a cluster, the rule should be modified to use ‘firstn’ instead, and the administrator should wait until any data movement completes before upgrading.
- The ‘osd dump’ command now dumps pool snaps as an array instead of an object.

### UPGRADING FROM V0.67 DUMPLING

- See notes above.
- ceph-fuse and radosgw now use the same default values for the admin socket and log file paths that the other daemons (ceph-osd, ceph-mon, etc.) do. If you run these daemons as non-root, you may need to adjust your ceph.conf to disable these options or to adjust the permissions on /var/run/ceph and /var/log/ceph.
- The MDS now disallows snapshots by default as they are not considered stable. The command ‘ceph mds set allow\_snaps’ will enable them.
- For clusters that were created before v0.44 (pre-argonaut, Spring 2012) and store radosgw data, the auto-upgrade from TMAP to OMAP objects has been disabled. Before upgrading, make sure that any buckets created on pre-argonaut releases have been modified (e.g., by PUTing and then DELETEing an object from each bucket). Any cluster created with argonaut (v0.48) or a later release or not using radosgw never relied on the automatic conversion and is not affected by this change.
- Any direct users of the ‘tmap’ portion of the librados API should be aware that the automatic tmap -> omap conversion functionality has been removed.
- Most output that used K or KB (e.g., for kilobyte) now uses a lower-case k to match the official SI convention. Any scripts that parse output and check for an upper-case K will need to be modified.
- librados::Rados::pool\_create\_async() and librados::Rados::pool\_delete\_async() don’t drop a reference to the completion object on error, caller needs to take care of that. This has never really worked correctly and we were leaking an object
- ‘ceph osd crush set <id> <weight> <loc..>’ no longer adds the osd to the specified location, as that’s a job for ‘ceph osd crush add’. It will however continue to work just the same as long as the osd already exists in the crush map.
- The OSD now enforces that class write methods cannot both mutate an object and return data. The rbd.assign\_bid method, the lone offender, has been removed. This breaks compatibility with pre-bobtail librbd clients by preventing them from creating new images.
- librados now returns on commit instead of ack for synchronous calls. This is a bit safer in the case where both OSDs and the client crash, and is probably how it should have been acting from the beginning. Users are unlikely to notice but it could result in lower performance in some circumstances. Those who care should switch to using the async interfaces, which let you specify safety semantics precisely.
- The C++ librados AioComplete::get\_version() method was incorrectly returning an int (usually 32-bits). To avoid breaking library compatibility, a get\_version64() method is added that returns the full-width value. The old method is deprecated and will be removed in a future release. Users of the C++ librados API that make use of the get\_version() method should modify their code to avoid getting a value that is truncated from 64 to to 32 bits.

### NOTABLE CHANGES SINCE V0.79

- ceph-fuse, libcephfs: fix several caching bugs (Yan, Zheng)
- ceph-fuse: trim inodes in response to mds memory pressure (Yan, Zheng)
- librados: fix inconsistencies in API error values (David Zafman)
- librados: fix watch operations with cache pools (Sage Weil)
- librados: new snap rollback operation (David Zafman)
- mds: fix respawn (John Spray)
- mds: misc bugs (Yan, Zheng)
- mds: misc multi-mds fixes (Yan, Zheng)
- mds: use shared\_ptr for requests (Greg Farnum)
- mon: fix peer feature checks (Sage Weil)
- mon: require ‘x’ mon caps for auth operations (Joao Luis)
- mon: shutdown when removed from mon cluster (Joao Luis)
- msgr: fix locking bug in authentication (Josh Durgin)
- osd: fix bug in journal replay/restart (Sage Weil)
- osd: many many many bug fixes with cache tiering (Samuel Just)
- osd: track omap and hit\_set objects in pg stats (Samuel Just)
- osd: warn if agent cannot enable due to invalid (post-split) stats (Sage Weil)
- rados bench: track metadata for multiple runs separately (Guang Yang)
- rgw: fixed subuser modify (Yehuda Sadeh)
- rpm: fix redhat-lsb dependency (Sage Weil, Alfredo Deza)

### NOTABLE CHANGES SINCE V0.72 EMPEROR

- buffer: some zero-copy groundwork (Josh Durgin)
- build: misc improvements (Ken Dreyer)
- ceph-conf: stop creating bogus log files (Josh Durgin, Sage Weil)
- ceph-crush-location: new hook for setting CRUSH location of osd daemons on start)
- ceph-disk: avoid fd0 (Loic Dachary)
- ceph-disk: generalize path names, add tests (Loic Dachary)
- ceph-disk: misc improvements for puppet (Loic Dachary)
- ceph-disk: several bug fixes (Loic Dachary)
- ceph-fuse: fix race for sync reads (Sage Weil)
- ceph-fuse, libcephfs: fix several caching bugs (Yan, Zheng)
- ceph-fuse: trim inodes in response to mds memory pressure (Yan, Zheng)
- ceph-kvstore-tool: expanded command set and capabilities (Joao Eduardo Luis)
- ceph.spec: fix build dependency (Loic Dachary)
- common: bloom filter improvements (Sage Weil)
- common: check preexisting admin socket for active daemon before removing (Loic Dachary)
- common: fix aligned buffer allocation (Loic Dachary)
- common: fix authentication on big-endian architectures (Dan Mick)
- common: fix config variable substitution (Loic Dachary)
- common: portability changes to support libc++ (Noah Watkins)
- common: switch to unordered\_map from hash\_map (Noah Watkins)
- config: recursive metavariable expansion (Loic Dachary)
- crush: default to bobtail tunables (Sage Weil)
- crush: fix off-by-one error in recent refactor (Sage Weil)
- crush: many additional tests (Loic Dachary)
- crush: misc fixes, cleanups (Loic Dachary)
- crush: new rule steps to adjust retry attempts (Sage Weil)
- crush, osd: s/rep/replicated/ for less confusion (Loic Dachary)
- crush: refactor descend\_once behavior; support set\_choose\*\_tries for replicated rules (Sage Weil)
- crush: usability and test improvements (Loic Dachary)
- debian: change directory ownership between ceph and ceph-common (Sage Weil)
- debian: integrate misc fixes from downstream packaging (James Page)
- doc: big update to install docs (John Wilkins)
- doc: many many install doc improvements (John Wilkins)
- doc: many many updates (John Wilkins)
- doc: misc fixes (David Moreau Simard, Kun Huang)
- erasure-code: improve buffer alignment (Loic Dachary)
- erasure-code: rewrite region-xor using vector operations (Andreas Peters)
- init: fix startup ordering/timeout problem with OSDs (Dmitry Smirnov)
- libcephfs: fix resource leak (Zheng Yan)
- librados: add C API coverage for atomic write operations (Christian Marie)
- librados: fix inconsistencies in API error values (David Zafman)
- librados: fix throttle leak (and eventual deadlock) (Josh Durgin)
- librados: fix watch operations with cache pools (Sage Weil)
- librados: new snap rollback operation (David Zafman)
- librados, osd: new TMAP2OMAP operation (Yan, Zheng)
- librados: read directly into user buffer (Rutger ter Borg)
- librbd: fix use-after-free aio completion bug #5426 (Josh Durgin)
- librbd: localize/distribute parent reads (Sage Weil)
- librbd: skip zeroes/holes when copying sparse images (Josh Durgin)
- mailmap: affiliation updates (Loic Dachary)
- mailmap updates (Loic Dachary)
- many portability improvements (Noah Watkins)
- many unit test improvements (Loic Dachary)
- mds: always store backtrace in default pool (Yan, Zheng)
- mds: cope with MDS failure during creation (John Spray)
- mds: fix cap migration behavior (Yan, Zheng)
- mds: fix client session flushing (Yan, Zheng)
- mds: fix crash from client sleep/resume (Zheng Yan)
- mds: fix many many multi-mds bugs (Yan, Zheng)
- mds: fix readdir end check (Zheng Yan)
- mds: fix Resetter locking (Alexandre Oliva)
- mds: fix respawn (John Spray)
- mds: inline data support (Li Wang, Yunchuan Wen)
- mds: misc bugs (Yan, Zheng)
- mds: misc fixes for directory fragments (Zheng Yan)
- mds: misc fixes for larger directories (Zheng Yan)
- mds: misc fixes for multiple MDSs (Zheng Yan)
- mds: misc multi-mds fixes (Yan, Zheng)
- mds: remove .ceph directory (John Spray)
- mds: store directories in omap instead of tmap (Yan, Zheng)
- mds: update old-format backtraces opportunistically (Zheng Yan)
- mds: use shared\_ptr for requests (Greg Farnum)
- misc cleanups from coverity (Xing Lin)
- misc coverity fixes, cleanups (Danny Al-Gaaf)
- misc coverity fixes (Xing Lin, Li Wang, Danny Al-Gaaf)
- misc portability fixes (Noah Watkins, Alan Somers)
- misc portability fixes (Noah Watkins, Christophe Courtaut, Alan Somers, huanjun)
- misc portability work (Noah Watkins)
- mon: add erasure profiles and improve erasure pool creation (Loic Dachary)
- mon: add ‘mon getmap EPOCH’ (Joao Eduardo Luis)
- mon: allow adjustment of cephfs max file size via ‘ceph mds set max\_file\_size’ (Sage Weil)
- mon: allow debug quorum\_{enter,exit} commands via admin socket
- mon: ‘ceph osd pg-temp ...’ and primary-temp commands (Ilya Dryomov)
- mon: change mds allow\_new\_snaps syntax to be more consistent (Sage Weil)
- mon: clean up initial crush rule creation (Loic Dachary)
- mon: collect misc metadata about osd (os, kernel, etc.), new ‘osd metadata’ command (Sage Weil)
- mon: do not create erasure rules by default (Sage Weil)
- mon: do not generate spurious MDSMaps in certain cases (Sage Weil)
- mon: do not use keyring if auth = none (Loic Dachary)
- mon: fix peer feature checks (Sage Weil)
- mon: fix pg\_temp leaks (Joao Eduardo Luis)
- mon: fix pool count in ‘ceph -s’ output (Sage Weil)
- mon: handle more whitespace (newline, tab) in mon capabilities (Sage Weil)
- mon: improve (replicate or erasure) pool creation UX (Loic Dachary)
- mon: infrastructure to handle mixed-version mon cluster and cli/rest API (Greg Farnum)
- mon: MForward tests (Loic Dachary)
- mon: mkfs now idempotent (Loic Dachary)
- mon: only seed new osdmaps to current OSDs (Sage Weil)
- mon, osd: create erasure style crush rules (Loic Dachary, Sage Weil)
- mon: ‘osd crush show-tunables’ (Sage Weil)
- mon: ‘osd dump’ dumps pool snaps as array, not object (Dan Mick)
- mon, osd: new ‘erasure’ pool type (still not fully supported)
- mon: persist quorum features to disk (Greg Farnum)
- mon: prevent extreme changes in pool pg\_num (Greg Farnum)
- mon: require ‘x’ mon caps for auth operations (Joao Luis)
- mon: shutdown when removed from mon cluster (Joao Luis)
- mon: take ‘osd pool set ...’ value as an int, not string (Joao Eduardo Luis)
- mon: track osd features in OSDMap (Joao Luis, David Zafman)
- mon: trim MDSMaps (Joao Eduardo Luis)
- mon: warn if crush has non-optimal tunables (Sage Weil)
- mount.ceph: add -n for autofs support (Steve Stock)
- msgr: fix locking bug in authentication (Josh Durgin)
- msgr: fix messenger restart race (Xihui He)
- msgr: improve connection error detection between clients and monitors (Greg Farnum, Sage Weil)
- osd: add/fix CPU feature detection for jerasure (Loic Dachary)
- osd: add HitSet tracking for read ops (Sage Weil, Greg Farnum)
- osd: avoid touching leveldb for some xattrs (Haomai Wang, Sage Weil)
- osd: backfill to multiple targets (David Zafman)
- osd: backfill to osds not in acting set (David Zafman)
- osd: cache pool support for snapshots (Sage Weil)
- osd: client IO path changes for EC (Samuel Just)
- osd: default to 3x replication
- osd: do not include backfill targets in acting set (David Zafman)
- osd: enable new hashpspool layout by default (Sage Weil)
- osd: erasure plugin benchmarking tool (Loic Dachary)
- osd: fix and cleanup misc backfill issues (David Zafman)
- osd: fix bug in journal replay/restart (Sage Weil)
- osd: fix copy-get omap bug (Sage Weil)
- osd: fix linux kernel version detection (Ilya Dryomov)
- osd: fix memstore segv (Haomai Wang)
- osd: fix object\_info\_t encoding bug from emperor (Sam Just)
- osd: fix omap\_clear operation to not zap xattrs (Sam Just, Yan, Zheng)
- osd: fix several bugs with tier infrastructure
- osd: fix throttle thread (Haomai Wang)
- osd: fix XFS detection (Greg Farnum, Sushma Gurram)
- osd: generalize scrubbing infrastructure to allow EC (David Zafman)
- osd: handle more whitespace (newline, tab) in osd capabilities (Sage Weil)
- osd: ignore num\_objects\_dirty on scrub for old pools (Sage Weil)
- osd: improved scrub checks on clones (Sage Weil, Sam Just)
- osd: improve locking in fd lookup cache (Samuel Just, Greg Farnum)
- osd: include more info in pg query result (Sage Weil)
- osd, librados: fix full cluster handling (Josh Durgin)
- osd: many erasure fixes (Sam Just)
- osd: many many many bug fixes with cache tiering (Samuel Just)
- osd: move to jerasure2 library (Loic Dachary)
- osd: new ‘chassis’ type in default crush hierarchy (Sage Weil)
- osd: new keyvaluestore-dev backend based on leveldb (Haomai Wang)
- osd: new OSDMap encoding (Greg Farnum)
- osd: new tests for erasure pools (David Zafman)
- osd: preliminary cache pool support (no snaps) (Greg Farnum, Sage Weil)
- osd: reduce scrub lock contention (Guang Yang)
- osd: requery unfound on stray notify (#6909) (Samuel Just)
- osd: some PGBackend infrastructure (Samuel Just)
- osd: support for new ‘memstore’ (memory-backed) backend (Sage Weil)
- osd: track erasure compatibility (David Zafman)
- osd: track omap and hit\_set objects in pg stats (Samuel Just)
- osd: warn if agent cannot enable due to invalid (post-split) stats (Sage Weil)
- rados: add ‘crush location’, smart replica selection/balancing (Sage Weil)
- rados bench: track metadata for multiple runs separately (Guang Yang)
- rados: some performance optimizations (Yehuda Sadeh)
- rados tool: fix listomapvals (Josh Durgin)
- rbd: add ‘rbdmap’ init script for mapping rbd images on book (Adam Twardowski)
- rbd: add rbdmap support for upstart (Laurent Barbe)
- rbd: expose kernel rbd client options via ‘rbd map’ (Ilya Dryomov)
- rbd: fix bench-write command (Hoamai Wang)
- rbd: make ‘rbd list’ return empty list and success on empty pool (Josh Durgin)
- rbd: prevent deletion of images with watchers (Ilya Dryomov)
- rbd: support for 4096 mapped devices, up from ~250 (Ilya Dryomov)
- rest-api: do not fail when no OSDs yet exist (Dan Mick)
- rgw: add ‘status’ command to sysvinit script (David Moreau Simard)
- rgw: allow multiple frontends (Yehuda Sadeh)
- rgw: allow use of an erasure data pool (Yehuda Sadeh)
- rgw: convert bucket info to new format on demand (Yehuda Sadeh)
- rgw: fixed subuser modify (Yehuda Sadeh)
- rgw: fix error setting empty owner on ACLs (Yehuda Sadeh)
- rgw: fix fastcgi deadlock (do not return data from librados callback) (Yehuda Sadeh)
- rgw: fix many-part multipart uploads (Yehuda Sadeh)
- rgw: fix misc CORS bugs (Robin H. Johnson)
- rgw: fix object placement read op (Yehuda Sadeh)
- rgw: fix reading bucket policy (#6940)
- rgw: fix read\_user\_buckets ‘max’ behavior (Yehuda Sadeh)
- rgw: fix several CORS bugs (Robin H. Johnson)
- rgw: fix use-after-free when releasing completion handle (Yehuda Sadeh)
- rgw: improve swift temp URL support (Yehuda Sadeh)
- rgw: make multi-object delete idempotent (Yehuda Sadeh)
- rgw: optionally defer to bucket ACLs instead of object ACLs (Liam Monahan)
- rgw: prototype mongoose frontend (Yehuda Sadeh)
- rgw: several doc fixes (Alexandre Marangone)
- rgw: support for password (instead of admin token) for keystone authentication (Christophe Courtaut)
- rgw: switch from mongoose to civetweb (Yehuda Sadeh)
- rgw: user quotas (Yehuda Sadeh)
- rpm: fix redhat-lsb dependency (Sage Weil, Alfredo Deza)
- specfile: fix RPM build on RHEL6 (Ken Dreyer, Derek Yarnell)
- specfile: ship libdir/ceph (Key Dreyer)
- sysvinit, upstart: prevent both init systems from starting the same daemons (Josh Durgin)

### NOTABLE CHANGES SINCE V0.67 DUMPLING

- build cleanly under clang (Christophe Courtaut)
- build: Makefile refactor (Roald J. van Loon)
- build: fix \[/usr\]/sbin locations (Alan Somers)
- ceph-disk: fix journal preallocation
- ceph-fuse, radosgw: enable admin socket and logging by default
- ceph-fuse: fix problem with readahead vs truncate race (Yan, Zheng)
- ceph-fuse: trim deleted inodes from cache (Yan, Zheng)
- ceph-fuse: use newer fuse api (Jianpeng Ma)
- ceph-kvstore-tool: new tool for working with leveldb (copy, crc) (Joao Luis)
- ceph-post-file: new command to easily share logs or other files with ceph devs
- ceph: improve parsing of CEPH\_ARGS (Benoit Knecht)
- ceph: make -h behave when monitors are down
- ceph: parse CEPH\_ARGS env variable
- common: bloom\_filter improvements, cleanups
- common: cache crc32c values where possible
- common: correct SI is kB not KB (Dan Mick)
- common: fix looping on BSD (Alan Somers)
- common: migrate SharedPtrRegistry to use boost::shared\_ptr<> (Loic Dachary)
- common: misc portability fixes (Noah Watkins)
- crc32c: fix optimized crc32c code (it now detects arch support properly)
- crc32c: improved intel-optimized crc32c support (~8x faster on my laptop!)
- crush: fix name caching
- doc: erasure coding design notes (Loic Dachary)
- hadoop: removed old version of shim to avoid confusing users (Noah Watkins)
- librados, mon: ability to query/ping out-of-quorum monitor status (Joao Luis)
- librados: fix async aio completion wakeup
- librados: fix installed header #includes (Dan Mick)
- librados: get\_version64() method for C++ API
- librados: hello\_world example (Greg Farnum)
- librados: sync calls now return on commit (instead of ack) (Greg Farnum)
- librbd python bindings: fix parent image name limit (Josh Durgin)
- librbd, ceph-fuse: avoid some sources of ceph-fuse, rbd cache stalls
- mds: avoid leaking objects when deleting truncated files (Yan, Zheng)
- mds: fix F\_GETLK (Yan, Zheng)
- mds: fix LOOKUPSNAP bug
- mds: fix heap profiler commands (Joao Luis)
- mds: fix locking deadlock (David Disseldorp)
- mds: fix many bugs with stray (unlinked) inodes (Yan, Zheng)
- mds: fix many directory fragmentation bugs (Yan, Zheng)
- mds: fix mds rejoin with legacy parent backpointer xattrs (Alexandre Oliva)
- mds: fix rare restart/failure race during fs creation
- mds: fix standby-replay when we fall behind (Yan, Zheng)
- mds: fix stray directory purging (Yan, Zheng)
- mds: notify clients about deleted files (so they can release from their cache) (Yan, Zheng)
- mds: several bug fixes with clustered mds (Yan, Zheng)
- mon, osd: improve osdmap trimming logic (Samuel Just)
- mon, osd: initial CLI for configuring tiering
- mon: a few ‘ceph mon add’ races fixed (command is now idempotent) (Joao Luis)
- mon: allow (un)setting HASHPSPOOL flag on existing pools (Joao Luis)
- mon: allow cap strings with . to be unquoted
- mon: allow logging level of cluster log (/var/log/ceph/ceph.log) to be adjusted
- mon: avoid rewriting full osdmaps on restart (Joao Luis)
- mon: continue to discover peer addr info during election phase
- mon: disallow CephFS snapshots until ‘ceph mds set allow\_new\_snaps’ (Greg Farnum)
- mon: do not expose uncommitted state from ‘osd crush {add,set} ...’ (Joao Luis)
- mon: fix ‘ceph osd crush reweight ...’ (Joao Luis)
- mon: fix ‘osd crush move ...’ command for buckets (Joao Luis)
- mon: fix byte counts (off by factor of 4) (Dan Mick, Joao Luis)
- mon: fix paxos corner case
- mon: kv properties for pools to support EC (Loic Dachary)
- mon: make ‘osd pool rename’ idempotent (Joao Luis)
- mon: modify ‘auth add’ semantics to make a bit more sense (Joao Luis)
- mon: new ‘osd perf’ command to dump recent performance information (Samuel Just)
- mon: new and improved ‘ceph -s’ or ‘ceph status’ command (more info, easier to read)
- mon: some auth check cleanups (Joao Luis)
- mon: track per-pool stats (Joao Luis)
- mon: warn about pools with bad pg\_num
- mon: warn when mon data stores grow very large (Joao Luis)
- monc: fix small memory leak
- new wireshark patches pulled into the tree (Kevin Jones)
- objecter, librados: redirect requests based on cache tier config
- objecter: fix possible hang when cluster is unpaused (Josh Durgin)
- osd, librados: add new COPY\_FROM rados operation
- osd, librados: add new COPY\_GET rados operations (used by COPY\_FROM)
- osd: ‘osd recover clone overlap limit’ option to limit cloning during recovery (Samuel Just)
- osd: COPY\_GET on-wire encoding improvements (Greg Farnum)
- osd: add ‘osd heartbeat min healthy ratio’ configurable (was hard-coded at 33%)
- osd: add option to disable pg log debug code (which burns CPU)
- osd: allow cap strings with . to be unquoted
- osd: automatically detect proper xattr limits (David Zafman)
- osd: avoid extra copy in erasure coding reference implementation (Loic Dachary)
- osd: basic cache pool redirects (Greg Farnum)
- osd: basic whiteout, dirty flag support (not yet used)
- osd: bloom\_filter encodability, fixes, cleanups (Loic Dachary, Sage Weil)
- osd: clean up and generalize copy-from code (Greg Farnum)
- osd: cls\_hello OSD class example
- osd: erasure coding doc updates (Loic Dachary)
- osd: erasure coding plugin infrastructure, tests (Loic Dachary)
- osd: experiemental support for ZFS (zfsonlinux.org) (Yan, Zheng)
- osd: fix RWORDER flags
- osd: fix exponential backoff of slow request warnings (Loic Dachary)
- osd: fix handling of racing read vs write (Samuel Just)
- osd: fix version value returned by various operations (Greg Farnum)
- osd: generalized temp object infrastructure
- osd: ghobject\_t infrastructure for EC (David Zafman)
- osd: improvements for compatset support and storage (David Zafman)
- osd: infrastructure to copy objects from other OSDs
- osd: instrument peering states (David Zafman)
- osd: misc copy-from improvements
- osd: opportunistic crc checking on stored data (off by default)
- osd: properly enforce RD/WR flags for rados classes
- osd: reduce blocking on backing fs (Samuel Just)
- osd: refactor recovery using PGBackend (Samuel Just)
- osd: remove old magical tmap->omap conversion
- osd: remove old pg log on upgrade (Samuel Just)
- osd: revert xattr size limit (fixes large rgw uploads)
- osd: use fdatasync(2) instead of fsync(2) to improve performance (Sam Just)
- pybind: fix blacklisting nonce (Loic Dachary)
- radosgw-agent: multi-region replication/DR
- rgw: complete in-progress requests before shutting down
- rgw: default log level is now more reasonable (Yehuda Sadeh)
- rgw: fix S3 auth with response-\* query string params (Sylvain Munaut, Yehuda Sadeh)
- rgw: fix a few minor memory leaks (Yehuda Sadeh)
- rgw: fix acl group check (Yehuda Sadeh)
- rgw: fix inefficient use of std::list::size() (Yehuda Sadeh)
- rgw: fix major CPU utilization bug with internal caching (Yehuda Sadeh, Mark Nelson)
- rgw: fix ordering of write operations (preventing data loss on crash) (Yehuda Sadeh)
- rgw: fix ordering of writes for mulitpart upload (Yehuda Sadeh)
- rgw: fix various CORS bugs (Yehuda Sadeh)
- rgw: fix/improve swift COPY support (Yehuda Sadeh)
- rgw: improve help output (Christophe Courtaut)
- rgw: misc fixes to support DR (Josh Durgin, Yehuda Sadeh)
- rgw: per-bucket quota (Yehuda Sadeh)
- rgw: validate S3 tokens against keystone (Roald J. van Loon)
- rgw: wildcard support for keystone roles (Christophe Courtaut)
- rpm: fix junit dependencies (Alan Grosskurth)
- sysvinit radosgw: fix status return code (Danny Al-Gaaf)
- sysvinit rbdmap: fix error ‘service rbdmap stop’ (Laurent Barbe)
- sysvinit: add condrestart command (Dan van der Ster)
- sysvinit: fix shutdown order (mons last) (Alfredo Deza)
