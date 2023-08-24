---
title: "v16.2.14 Pacific released"
date: "2023-08-30"
author: "Yuri Weinstein"
tags:
  - "release"
  - "pacific"
---

This is the fourteenth backport release in the Pacific series.

## Notable Changes

* CEPHFS: After recovering a Ceph File System post following the disaster
  recovery procedure, the recovered files under lost+found directory can now be deleted.

* ceph mgr dump command now displays the name of the mgr module that registered
  a RADOS client in the name field added to elements of the active_clients array.
  Previously, only the address of a module's RADOS client was shown in the active_clients array.

## Changelog

- backport PR #39607 ([pr#51344](https://github.com/ceph/ceph/pull/51344), Rishabh Dave)

- blk/kernel: Fix error code mapping in KernelDevice::read ([pr#49263](https://github.com/ceph/ceph/pull/49263), Joshua Baergen)

- blk/KernelDevice: Modify the rotational and discard check log message ([pr#50322](https://github.com/ceph/ceph/pull/50322), Vikhyat Umrao)

- build: Remove ceph-libboost\* packages in install-deps ([pr#52790](https://github.com/ceph/ceph/pull/52790), Nizamudeen A, Adam Emerson)

- ceph-volume: fix a bug in `get\_lvm\_fast\_allocs()` (batch) ([pr#52063](https://github.com/ceph/ceph/pull/52063), Guillaume Abrioux)

- ceph-volume: fix batch refactor issue ([pr#51207](https://github.com/ceph/ceph/pull/51207), Guillaume Abrioux)

- ceph-volume: fix drive-group issue that expects the batch\_args to be a string ([pr#51209](https://github.com/ceph/ceph/pull/51209), Mohan Sharma)

- ceph-volume: quick fix in zap<span></span>.py ([pr#51196](https://github.com/ceph/ceph/pull/51196), Guillaume Abrioux)

- ceph-volume: set lvm membership for mpath type devices ([pr#52080](https://github.com/ceph/ceph/pull/52080), Guillaume Abrioux)

- ceph\_test\_rados\_api\_watch\_notify: extend Watch3Timeout test ([pr#51261](https://github.com/ceph/ceph/pull/51261), Sage Weil)

- ceph\_volume: support encrypted volumes for lvm new-db/new-wal/migrate commands ([pr#52873](https://github.com/ceph/ceph/pull/52873), Igor Fedotov)

- cephadm: eliminate duplication of sections ([pr#51433](https://github.com/ceph/ceph/pull/51433), Rongqi Sun)

- cephadm: mount host /etc/hosts for daemon containers in podman deployments ([pr#51174](https://github.com/ceph/ceph/pull/51174), Adam King)

- cephadm: reschedule haproxy from an offline host ([pr#51214](https://github.com/ceph/ceph/pull/51214), Michael Fritch)

- cephadm: using ip instead of short hostname for prometheus urls ([pr#51212](https://github.com/ceph/ceph/pull/51212), Redouane Kachach)

- cephfs-top: check the minimum compatible python version ([pr#51353](https://github.com/ceph/ceph/pull/51353), Jos Collin)

- cephfs-top: dump values to stdout and -d [--delay] option fix ([pr#50715](https://github.com/ceph/ceph/pull/50715), Jos Collin, Neeraj Pratap Singh, wangxinyu, Rishabh Dave)

- cephfs-top: navigate to home screen when no fs ([pr#50737](https://github.com/ceph/ceph/pull/50737), Jos Collin)

- cephfs-top: Some fixes in `choose\_field()` for sorting ([pr#50596](https://github.com/ceph/ceph/pull/50596), Neeraj Pratap Singh)

- client: clear the suid/sgid in fallocate path ([pr#50988](https://github.com/ceph/ceph/pull/50988), Lucian Petrut, Xiubo Li, Sven Anderson)

- client: do not dump mds twice in Inode::dump() ([pr#51247](https://github.com/ceph/ceph/pull/51247), Xue Yantao)

- client: do not send metrics until the MDS rank is ready ([pr#52500](https://github.com/ceph/ceph/pull/52500), Xiubo Li)

- client: force sending cap revoke ack always ([pr#52506](https://github.com/ceph/ceph/pull/52506), Xiubo Li)

- client: only wait for write MDS OPs when unmounting ([pr#52304](https://github.com/ceph/ceph/pull/52304), Xiubo Li)

- client: trigger to flush the buffer when making snapshot ([pr#52499](https://github.com/ceph/ceph/pull/52499), Xiubo Li)

- client: use deep-copy when setting permission during make\_request ([pr#51487](https://github.com/ceph/ceph/pull/51487), Mer Xuanyi)

- client: wait rename to finish ([pr#52505](https://github.com/ceph/ceph/pull/52505), Xiubo Li)

- cls/queue: use larger read chunks in queue\_list\_entries ([pr#49903](https://github.com/ceph/ceph/pull/49903), Igor Fedotov)

- common/crc32c\_aarch64: fix crc32c unittest failed on aarch64 ([pr#51315](https://github.com/ceph/ceph/pull/51315), luo rixin)

- common/TrackedOp: fix osd reboot optracker coredump ([pr#51249](https://github.com/ceph/ceph/pull/51249), yaohui.zhou)

- common: notify all when max backlog reached in OutputDataSocket ([pr#47232](https://github.com/ceph/ceph/pull/47232), Shu Yu)

- common: Use double instead of long double to improve performance ([pr#51316](https://github.com/ceph/ceph/pull/51316), Chunsong Feng, luo rixin)

- Consider setting "bulk" autoscale pool flag when automatically creating a data pool for CephFS ([pr#52900](https://github.com/ceph/ceph/pull/52900), Leonid Usov)

- debian: install cephfs-mirror systemd unit files and man page ([pr#52075](https://github.com/ceph/ceph/pull/52075), Jos Collin)

- do not evict clients if OSDs are laggy ([pr#52270](https://github.com/ceph/ceph/pull/52270), Laura Flores, Dhairya Parmar)

- doc/cephadm: Revert "doc/cephadm: update about disabling logging to journald for quincy" ([pr#51882](https://github.com/ceph/ceph/pull/51882), Adam King)

- doc/cephfs: edit fs-volumes<span></span>.rst (1 of x) ([pr#51467](https://github.com/ceph/ceph/pull/51467), Zac Dover)

- doc/cephfs: explain cephfs data and metadata set ([pr#51237](https://github.com/ceph/ceph/pull/51237), Zac Dover)

- doc/cephfs: fix prompts in fs-volumes<span></span>.rst ([pr#51436](https://github.com/ceph/ceph/pull/51436), Zac Dover)

- doc/cephfs: line-edit "Mirroring Module" ([pr#51544](https://github.com/ceph/ceph/pull/51544), Zac Dover)

- doc/cephfs: rectify prompts in fs-volumes<span></span>.rst ([pr#51460](https://github.com/ceph/ceph/pull/51460), Zac Dover)

- doc/cephfs: repairing inaccessible FSes ([pr#51373](https://github.com/ceph/ceph/pull/51373), Zac Dover)

- doc/dev/encoding<span></span>.txt: update per std::optional ([pr#51399](https://github.com/ceph/ceph/pull/51399), Radoslaw Zarzynski)

- doc/glossary: update bluestore entry ([pr#51695](https://github.com/ceph/ceph/pull/51695), Zac Dover)

- doc/mgr: edit "leaderboard" in telemetry<span></span>.rst ([pr#51722](https://github.com/ceph/ceph/pull/51722), Zac Dover)

- doc/mgr: update prompts in prometheus<span></span>.rst ([pr#51311](https://github.com/ceph/ceph/pull/51311), Zac Dover)

- doc/rados/operations: Acting Set question ([pr#51741](https://github.com/ceph/ceph/pull/51741), Zac Dover)

- doc/rados/operations: Fix erasure-code-jerasure<span></span>.rst fix ([pr#51744](https://github.com/ceph/ceph/pull/51744), Anthony D'Atri)

- doc/rados/ops: edit user-management<span></span>.rst (3 of x) ([pr#51241](https://github.com/ceph/ceph/pull/51241), Zac Dover)

- doc/rados: edit balancer<span></span>.rst ([pr#51826](https://github.com/ceph/ceph/pull/51826), Zac Dover)

- doc/rados: edit bluestore-config-ref<span></span>.rst (1 of x) ([pr#51791](https://github.com/ceph/ceph/pull/51791), Zac Dover)

- doc/rados: edit bluestore-config-ref<span></span>.rst (2 of x) ([pr#51795](https://github.com/ceph/ceph/pull/51795), Zac Dover)

- doc/rados: edit data-placement<span></span>.rst ([pr#51597](https://github.com/ceph/ceph/pull/51597), Zac Dover)

- doc/rados: edit devices<span></span>.rst ([pr#51479](https://github.com/ceph/ceph/pull/51479), Zac Dover)

- doc/rados: edit filestore-config-ref<span></span>.rst ([pr#51753](https://github.com/ceph/ceph/pull/51753), Zac Dover)

- doc/rados: edit stretch-mode procedure ([pr#51291](https://github.com/ceph/ceph/pull/51291), Zac Dover)

- doc/rados: edit stretch-mode<span></span>.rst ([pr#51339](https://github.com/ceph/ceph/pull/51339), Zac Dover)

- doc/rados: edit stretch-mode<span></span>.rst ([pr#51304](https://github.com/ceph/ceph/pull/51304), Zac Dover)

- doc/rados: edit user-management (2 of x) ([pr#51157](https://github.com/ceph/ceph/pull/51157), Zac Dover)

- doc/rados: fix link in common<span></span>.rst ([pr#51757](https://github.com/ceph/ceph/pull/51757), Zac Dover)

- doc/rados: line-edit devices<span></span>.rst ([pr#51578](https://github.com/ceph/ceph/pull/51578), Zac Dover)

- doc/rados: m-config-ref: edit "background" ([pr#51274](https://github.com/ceph/ceph/pull/51274), Zac Dover)

- doc/rados: stretch-mode<span></span>.rst (other commands) ([pr#51391](https://github.com/ceph/ceph/pull/51391), Zac Dover)

- doc/rados: stretch-mode: stretch cluster issues ([pr#51379](https://github.com/ceph/ceph/pull/51379), Zac Dover)

- doc/radosgw: explain multisite dynamic sharding ([pr#51587](https://github.com/ceph/ceph/pull/51587), Zac Dover)

- doc/radosgw: rabbitmq - push-endpoint edit ([pr#51307](https://github.com/ceph/ceph/pull/51307), Zac Dover)

- doc/start/os-recommendations: drop 4<span></span>.14 kernel and reword guidance ([pr#51491](https://github.com/ceph/ceph/pull/51491), Ilya Dryomov)

- doc/start: edit first 150 lines of documenting-ceph ([pr#51183](https://github.com/ceph/ceph/pull/51183), Zac Dover)

- doc/start: fix "Planet Ceph" link ([pr#51421](https://github.com/ceph/ceph/pull/51421), Zac Dover)

- doc/start: KRBD feature flag support note ([pr#51504](https://github.com/ceph/ceph/pull/51504), Zac Dover)

- doc/start: rewrite intro paragraph ([pr#51222](https://github.com/ceph/ceph/pull/51222), Zac Dover)

- doc: add link to "documenting ceph" to index<span></span>.rst ([pr#51471](https://github.com/ceph/ceph/pull/51471), Zac Dover)

- doc: Add missing `ceph` command in documentation section `REPLACING A… ([pr#51621](https://github.com/ceph/ceph/pull/51621), Alexander Proschek)

- doc: deprecate the cache tiering ([pr#51654](https://github.com/ceph/ceph/pull/51654), Radosław Zarzyński)

- doc: document the relevance of mds\_namespace mount option ([pr#49688](https://github.com/ceph/ceph/pull/49688), Jos Collin)

- doc: explain cephfs mirroring `peer\_add` step in detail ([pr#51522](https://github.com/ceph/ceph/pull/51522), Venky Shankar)

- doc: Update jerasure<span></span>.org references ([pr#51727](https://github.com/ceph/ceph/pull/51727), Anthony D'Atri)

- doc: update multisite doc ([pr#51402](https://github.com/ceph/ceph/pull/51402), parth-gr)

- doc: Use `ceph osd crush tree` command to display weight set weights ([pr#51351](https://github.com/ceph/ceph/pull/51351), James Lakin)

- kv/RocksDBStore: Add CompactOnDeletion support ([pr#50894](https://github.com/ceph/ceph/pull/50894), Radoslaw Zarzynski, Mark Nelson)

- kv/RocksDBStore: cumulative backport for rm\_range\_keys and around ([pr#50637](https://github.com/ceph/ceph/pull/50637), Igor Fedotov)

- kv/RocksDBStore: don't use real wholespace iterator for prefixed access ([pr#50496](https://github.com/ceph/ceph/pull/50496), Igor Fedotov)

- librados: aio operate functions can set times ([pr#52117](https://github.com/ceph/ceph/pull/52117), Casey Bodley)

- librbd/managed\_lock/GetLockerRequest: Fix no valid lockers case ([pr#52287](https://github.com/ceph/ceph/pull/52287), Ilya Dryomov, Matan Breizman)

- librbd: avoid decrementing iterator before first element ([pr#51856](https://github.com/ceph/ceph/pull/51856), Lucian Petrut)

- librbd: avoid object map corruption in snapshots taken under I/O ([pr#52285](https://github.com/ceph/ceph/pull/52285), Ilya Dryomov)

- librbd: don't wait for a watch in send\_acquire\_lock() if client is blocklisted ([pr#50926](https://github.com/ceph/ceph/pull/50926), Ilya Dryomov, Christopher Hoffman)

- librbd: localize snap\_remove op for mirror snapshots ([pr#51431](https://github.com/ceph/ceph/pull/51431), Christopher Hoffman)

- librbd: remove previous incomplete primary snapshot after successfully creating a new one ([pr#51429](https://github.com/ceph/ceph/pull/51429), Ilya Dryomov, Prasanna Kumar Kalever)

- log: writes to stderr (pipe) may not be atomic ([pr#50778](https://github.com/ceph/ceph/pull/50778), Lucian Petrut, Patrick Donnelly)

- MDS imported\_inodes metric is not updated ([pr#51699](https://github.com/ceph/ceph/pull/51699), Yongseok Oh)

- mds: adjust cap acquisition throttles ([pr#52974](https://github.com/ceph/ceph/pull/52974), Patrick Donnelly)

- mds: allow unlink from lost+found directory ([issue#59569](http://tracker.ceph.com/issues/59569), [pr#51687](https://github.com/ceph/ceph/pull/51687), Venky Shankar)

- mds: display sane hex value (0x0) for empty feature bit ([pr#52125](https://github.com/ceph/ceph/pull/52125), Jos Collin)

- mds: do not send split\_realms for CEPH\_SNAP\_OP\_UPDATE msg ([pr#52848](https://github.com/ceph/ceph/pull/52848), Xiubo Li)

- mds: do not take the ino which has been used ([pr#51508](https://github.com/ceph/ceph/pull/51508), Xiubo Li)

- mds: fix cpu\_profiler asok crash ([pr#52979](https://github.com/ceph/ceph/pull/52979), liu shi)

- mds: fix stray evaluation using scrub and introduce new option ([pr#50814](https://github.com/ceph/ceph/pull/50814), Dhairya Parmar)

- mds: Fix the linkmerge assert check ([pr#52726](https://github.com/ceph/ceph/pull/52726), Kotresh HR)

- mds: force replay sessionmap version ([pr#50725](https://github.com/ceph/ceph/pull/50725), Xiubo Li)

- mds: make num\_fwd and num\_retry to \_\_u32 ([pr#50733](https://github.com/ceph/ceph/pull/50733), Xiubo Li)

- mds: MDLog::\_recovery\_thread: handle the errors gracefully ([pr#52513](https://github.com/ceph/ceph/pull/52513), Jos Collin)

- mds: rdlock\_path\_xlock\_dentry supports returning auth target inode ([pr#51609](https://github.com/ceph/ceph/pull/51609), Zhansong Gao)

- mds: record and dump last tid for trimming completed requests (or flushes) ([issue#57985](http://tracker.ceph.com/issues/57985), [pr#50811](https://github.com/ceph/ceph/pull/50811), Venky Shankar)

- mds: skip forwarding request if the session were removed ([pr#52844](https://github.com/ceph/ceph/pull/52844), Xiubo Li)

- mds: update mdlog perf counters during replay ([pr#52682](https://github.com/ceph/ceph/pull/52682), Patrick Donnelly)

- mds: wait for unlink operation to finish ([pr#50986](https://github.com/ceph/ceph/pull/50986), Xiubo Li)

- mds: wait reintegrate to finish when unlinking ([pr#51686](https://github.com/ceph/ceph/pull/51686), Xiubo Li)

- mgr/cephadm: Adding --storage<span></span>.tsdb<span></span>.retention<span></span>.size prometheus option ([pr#51647](https://github.com/ceph/ceph/pull/51647), Redouane Kachach)

- mgr/cephadm: don't try to write client/os tuning profiles to known offline hosts ([pr#51346](https://github.com/ceph/ceph/pull/51346), Adam King)

- mgr/cephadm: support for miscellaneous config files for daemons ([pr#51517](https://github.com/ceph/ceph/pull/51517), Adam King)

- mgr/dashboard: allow PUT in CORS ([pr#52704](https://github.com/ceph/ceph/pull/52704), Nizamudeen A)

- mgr/dashboard: API docs UI does not work with Angular dev server ([pr#51245](https://github.com/ceph/ceph/pull/51245), Volker Theile)

- mgr/dashboard: expose more grafana configs in service form ([pr#51113](https://github.com/ceph/ceph/pull/51113), Nizamudeen A)

- mgr/dashboard: Fix broken Fedora image URL ([pr#52477](https://github.com/ceph/ceph/pull/52477), Zack Cerza)

- mgr/dashboard: Fix rbd snapshot creation ([pr#51075](https://github.com/ceph/ceph/pull/51075), Aashish Sharma)

- mgr/dashboard: fix the rbd mirroring configure check ([pr#51324](https://github.com/ceph/ceph/pull/51324), Nizamudeen A)

- mgr/dashboard: move cephadm e2e cleanup to jenkins job config ([pr#52389](https://github.com/ceph/ceph/pull/52389), Nizamudeen A)

- mgr/dashboard: rbd-mirror force promotion ([pr#51056](https://github.com/ceph/ceph/pull/51056), Pedro Gonzalez Gomez)

- mgr/dashboard: skip Create OSDs step in Cluster expansion ([pr#51150](https://github.com/ceph/ceph/pull/51150), Nizamudeen A)

- mgr/dashboard: SSO error: AttributeError: 'str' object has no attribute 'decode' ([pr#51950](https://github.com/ceph/ceph/pull/51950), Volker Theile)

- mgr/nfs: disallow non-existent paths when creating export ([pr#50809](https://github.com/ceph/ceph/pull/50809), Dhairya Parmar)

- mgr/orchestrator: fix device size in `orch device ls` output ([pr#51211](https://github.com/ceph/ceph/pull/51211), Adam King)

- mgr/rbd\_support: fixes related to recover from rados client blocklisting ([pr#51464](https://github.com/ceph/ceph/pull/51464), Ramana Raja)

- mgr/snap\_schedule: add debug log for paths failing snapshot creation ([pr#51246](https://github.com/ceph/ceph/pull/51246), Milind Changire)

- mgr/snap\_schedule: catch all exceptions for cli ([pr#52753](https://github.com/ceph/ceph/pull/52753), Milind Changire)

- mgr/volumes: avoid returning -ESHUTDOWN back to cli ([issue#58651](http://tracker.ceph.com/issues/58651), [pr#51039](https://github.com/ceph/ceph/pull/51039), Venky Shankar)

- mgr: store names of modules that register RADOS clients in the MgrMap ([pr#52883](https://github.com/ceph/ceph/pull/52883), Ramana Raja)

- MgrMonitor: batch commit OSDMap and MgrMap mutations ([pr#50980](https://github.com/ceph/ceph/pull/50980), Patrick Donnelly, Kefu Chai, Radosław Zarzyński)

- mon/ConfigMonitor: update crush\_location from osd entity ([pr#52468](https://github.com/ceph/ceph/pull/52468), Didier Gazen)

- mon/MDSMonitor: batch last\_metadata update with pending ([pr#52230](https://github.com/ceph/ceph/pull/52230), Patrick Donnelly)

- mon/MDSMonitor: check fscid in pending exists in current ([pr#52233](https://github.com/ceph/ceph/pull/52233), Patrick Donnelly)

- mon/MDSMonitor: do not propose on error in prepare\_update ([pr#52240](https://github.com/ceph/ceph/pull/52240), Patrick Donnelly)

- mon/MDSMonitor: ignore extraneous up:boot messages ([pr#52244](https://github.com/ceph/ceph/pull/52244), Patrick Donnelly)

- mon/MonClient: before complete auth with error, reopen session ([pr#52133](https://github.com/ceph/ceph/pull/52133), Nitzan Mordechai)

- mon: avoid exception when setting require-osd-release more than 2 versions up ([pr#51382](https://github.com/ceph/ceph/pull/51382), Igor Fedotov)

- mon: block osd pool mksnap for fs pools ([pr#52397](https://github.com/ceph/ceph/pull/52397), Milind Changire)

- Monitor: forward report command to leader ([pr#51258](https://github.com/ceph/ceph/pull/51258), Dan van der Ster)

- orchestrator: add `--no-destroy` arg to `ceph orch osd rm` ([pr#51213](https://github.com/ceph/ceph/pull/51213), Guillaume Abrioux)

- os/bluestore: allocator's cumulative backport ([pr#50321](https://github.com/ceph/ceph/pull/50321), Igor Fedotov, Adam Kupczyk, Ronen Friedman)

- os/bluestore: allow 'fit\_to\_fast' selector for single-volume osd ([pr#51418](https://github.com/ceph/ceph/pull/51418), Igor Fedotov)

- os/bluestore: cumulative bluefs backport ([pr#52212](https://github.com/ceph/ceph/pull/52212), Igor Fedotov, Adam Kupczyk)

- os/bluestore: don't need separate variable to mark hits when lookup oid ([pr#52943](https://github.com/ceph/ceph/pull/52943), locallocal)

- os/bluestore: fix spillover alert ([pr#50932](https://github.com/ceph/ceph/pull/50932), Igor Fedotov)

- os/bluestore: proper override rocksdb::WritableFile::Allocate ([pr#51773](https://github.com/ceph/ceph/pull/51773), Igor Fedotov)

- os/bluestore: report min\_alloc\_size through "ceph osd metadata" ([pr#50506](https://github.com/ceph/ceph/pull/50506), Igor Fedotov)

- osd/OSDCap: allow rbd<span></span>.metadata\_list method under rbd-read-only profile ([pr#51876](https://github.com/ceph/ceph/pull/51876), Ilya Dryomov)

- OSD: Fix check\_past\_interval\_bounds() ([pr#51510](https://github.com/ceph/ceph/pull/51510), Matan Breizman, Samuel Just)

- pybind/argparse: blocklist ip validation ([pr#51812](https://github.com/ceph/ceph/pull/51812), Nitzan Mordechai)

- pybind/mgr/pg\_autoscaler: Reorderd if statement for the func: \_maybe\_adjust ([pr#50694](https://github.com/ceph/ceph/pull/50694), Kamoltat)

- pybind: drop GIL during library callouts ([pr#52323](https://github.com/ceph/ceph/pull/52323), Ilya Dryomov, Patrick Donnelly)

- python-common: drive\_selection: fix KeyError when osdspec\_affinity is not set ([pr#53157](https://github.com/ceph/ceph/pull/53157), Guillaume Abrioux)

- qa/rgw: add POOL\_APP\_NOT\_ENABLED to log-ignorelist ([pr#52048](https://github.com/ceph/ceph/pull/52048), Casey Bodley)

- qa/suites/rados: remove rook coverage from the rados suite ([pr#52017](https://github.com/ceph/ceph/pull/52017), Laura Flores)

- qa/suites/rbd: install qemu-utils in addition to qemu-block-extra on Ubuntu ([pr#51059](https://github.com/ceph/ceph/pull/51059), Ilya Dryomov)

- qa/suites/upgrade/octopus-x: skip TestClsRbd<span></span>.mirror\_snapshot test ([pr#53002](https://github.com/ceph/ceph/pull/53002), Ilya Dryomov)

- qa: check each fs for health ([pr#51232](https://github.com/ceph/ceph/pull/51232), Patrick Donnelly)

- qa: data-scan/journal-tool do not output debugging in upstream testing ([pr#50773](https://github.com/ceph/ceph/pull/50773), Patrick Donnelly)

- qa: fix cephfs-mirror unwinding and 'fs volume create/rm' order ([pr#52654](https://github.com/ceph/ceph/pull/52654), Jos Collin)

- qa: mirror tests should cleanup fs during unwind ([pr#50765](https://github.com/ceph/ceph/pull/50765), Patrick Donnelly)

- qa: run scrub post file system recovery ([issue#59527](http://tracker.ceph.com/issues/59527), [pr#51610](https://github.com/ceph/ceph/pull/51610), Venky Shankar)

- qa: test\_simple failure ([pr#50756](https://github.com/ceph/ceph/pull/50756), Patrick Donnelly)

- qa: use parallel gzip for compressing logs ([pr#52953](https://github.com/ceph/ceph/pull/52953), Patrick Donnelly)

- qa: wait for MDSMonitor tick to replace daemons ([pr#52237](https://github.com/ceph/ceph/pull/52237), Patrick Donnelly)

- radosgw-admin: try reshard even if bucket is resharding ([pr#51836](https://github.com/ceph/ceph/pull/51836), Casey Bodley)

- rbd-mirror: fix image replayer shut down description on force promote ([pr#52878](https://github.com/ceph/ceph/pull/52878), Prasanna Kumar Kalever)

- rbd-mirror: fix race preventing local image deletion ([pr#52625](https://github.com/ceph/ceph/pull/52625), N Balachandran)

- rgw/rados: check\_quota() uses real bucket owner ([pr#51330](https://github.com/ceph/ceph/pull/51330), Mykola Golub, Casey Bodley)

- rgw/s3: dump Message field in Error response even if empty ([pr#51200](https://github.com/ceph/ceph/pull/51200), Casey Bodley)

- rgw: avoid string\_view to temporary in RGWBulkUploadOp ([pr#52159](https://github.com/ceph/ceph/pull/52159), Casey Bodley)

- rgw: fix consistency bug with OLH objects ([pr#52552](https://github.com/ceph/ceph/pull/52552), Cory Snyder)

- rgw: LDAP fix resource leak with wrong credentials ([pr#50560](https://github.com/ceph/ceph/pull/50560), Johannes Liebl, Johannes)

- rgw: under fips & openssl 3<span></span>.x allow md5 usage in select rgw ops ([pr#51266](https://github.com/ceph/ceph/pull/51266), Mark Kogan)

- src/valgrind<span></span>.supp: Adding know leaks unrelated to ceph ([pr#49521](https://github.com/ceph/ceph/pull/49521), Nitzan Mordechai)

- src/valgrind<span></span>.supp: Adding know leaks unrelated to ceph ([pr#51341](https://github.com/ceph/ceph/pull/51341), Nitzan Mordechai)

- test: correct osd pool default size ([pr#51803](https://github.com/ceph/ceph/pull/51803), Nitzan Mordechai)

- test: monitor thrasher wait until quorum ([pr#51799](https://github.com/ceph/ceph/pull/51799), Nitzan Mordechai)

- tests: remove pubsub tests from multisite ([pr#48928](https://github.com/ceph/ceph/pull/48928), Yuval Lifshitz)

- tools/ceph-dencoder: Fix incorrect type define for trash\_watcher ([pr#51778](https://github.com/ceph/ceph/pull/51778), Chen Yuanrun)

- tools/ceph-kvstore-tool: fix segfaults when repair the rocksdb ([pr#51254](https://github.com/ceph/ceph/pull/51254), huangjun)

- tools/cephfs-data-scan: support for multi-datapool ([pr#50523](https://github.com/ceph/ceph/pull/50523), Mykola Golub)

- vstart: check mgr status after starting mgr ([pr#51604](https://github.com/ceph/ceph/pull/51604), Rongqi Sun)

- Wip nitzan fixing few rados/test<span></span>.sh ([pr#49943](https://github.com/ceph/ceph/pull/49943), Nitzan Mordechai

