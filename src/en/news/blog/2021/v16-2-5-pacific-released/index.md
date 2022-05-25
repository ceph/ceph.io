---
title: "v16.2.5 Pacific released"
date: "2021-07-08"
author: "dgalloway"
tags:
  - "release"
  - "pacific"
---

This is the fifth backport release in the Pacific series. We recommend all Pacific users update to this release.
  
## Notable Changes

* `ceph-mgr-modules-core` debian package does not recommend `ceph-mgr-rook`
  anymore. As the latter depends on `python3-numpy` which cannot be imported in
  different Python sub-interpreters multi-times if the version of
  `python3-numpy` is older than 1.19. Since `apt-get` installs the `Recommends`
  packages by default, `ceph-mgr-rook` was always installed along with
  `ceph-mgr` debian package as an indirect dependency. If your workflow depends
  on this behavior, you might want to install `ceph-mgr-rook` separately.

* mgr/nfs: `nfs` module is moved out of volumes plugin. Prior using the
  `ceph nfs` commands, `nfs` mgr module must be enabled.

* volumes/nfs: The `cephfs` cluster type has been removed from the
  `nfs cluster create` subcommand. Clusters deployed by cephadm can
  support an NFS export of both `rgw` and `cephfs` from a single
  NFS cluster instance.

* The `nfs cluster update` command has been removed.  You can modify
  the placement of an existing NFS service (and/or its associated
  ingress service) using `orch ls --export` and `orch apply -i
  ...`.

* The `orch apply nfs` command no longer requires a pool or
  namespace argument. We strongly encourage users to use the defaults
  so that the `nfs cluster ls` and related commands will work
  properly.

* The `nfs cluster delete` and `nfs export delete` commands are
  deprecated and will be removed in a future release.  Please use
  `nfs cluster rm` and `nfs export rm` instead.

* A long-standing bug that prevented 32-bit and 64-bit client/server
  interoperability under msgr v2 has been fixed.  In particular, mixing armv7l
  (armhf) and x86_64 or aarch64 servers in the same cluster now works.

## Changelog

- .github/labeler: add api-change label ([pr#41818](https://github.com/ceph/ceph/pull/41818), Ernesto Puerta)

- Improve mon location handling for stretch clusters ([pr#40484](https://github.com/ceph/ceph/pull/40484), Greg Farnum)

- MDS heartbeat timed out between during executing MDCache::start_files_to_recover() ([pr#42061](https://github.com/ceph/ceph/pull/42061), Yongseok Oh)

- MDS slow request lookupino #0x100 on rank 1 block forever on dispatched ([pr#40856](https://github.com/ceph/ceph/pull/40856), Xiubo Li, Patrick Donnelly)

- MDSMonitor: crash when attempting to mount cephfs ([pr#42068](https://github.com/ceph/ceph/pull/42068), Patrick Donnelly)

- Pacific stretch mon state [Merge after 40484] ([pr#41130](https://github.com/ceph/ceph/pull/41130), Greg Farnum)

- Pacific: Add DoutPrefixProvider for RGW Log Messages in Pacfic ([pr#40054](https://github.com/ceph/ceph/pull/40054), Ali Maredia, Kalpesh Pandya, Casey Bodley)

- Pacific: Direct MMonJoin messages to leader, not first rank [Merge after 41130] ([pr#41131](https://github.com/ceph/ceph/pull/41131), Greg Farnum)

- Revert "pacific: mgr/dashboard: Generate NPM dependencies manifest" ([pr#41549](https://github.com/ceph/ceph/pull/41549), Nizamudeen A)

- Update boost url, fixing windows build ([pr#41259](https://github.com/ceph/ceph/pull/41259), Lucian Petrut)

- bluestore: use string_view and strip trailing slash for dir listing ([pr#41755](https://github.com/ceph/ceph/pull/41755), Jonas Jelten, Kefu Chai)

- build(deps): bump node-notifier from 8.0.0 to 8.0.1 in /src/pybind/mgr/dashboard/frontend ([pr#40813](https://github.com/ceph/ceph/pull/40813), Ernesto Puerta, dependabot[bot])

- ceph-volume: fix batch report and respect ceph.conf config values ([pr#41714](https://github.com/ceph/ceph/pull/41714), Andrew Schoen)

- ceph_test_rados_api_service: more retries for servicemkap ([pr#41182](https://github.com/ceph/ceph/pull/41182), Sage Weil)

- cephadm june final batch ([pr#42117](https://github.com/ceph/ceph/pull/42117), Kefu Chai, Sage Weil, Zac Dover, Sebastian Wagner, Varsha Rao, Sandro Bonazzola, Juan Miguel Olmo Martínez)

- cephadm: batch backport for May (2) ([pr#41219](https://github.com/ceph/ceph/pull/41219), Adam King, Sage Weil, Zac Dover, Dennis Körner, jianglong01, Avan Thakkar, Juan Miguel Olmo Martínez)

- cephadm: june batch 1 ([pr#41684](https://github.com/ceph/ceph/pull/41684), Sage Weil, Paul Cuzner, Juan Miguel Olmo Martínez, VasishtaShastry, Zac Dover, Sebastian Wagner, Adam King, Michael Fritch, Daniel Pivonka, sunilkumarn417)

- cephadm: june batch 2 ([pr#41815](https://github.com/ceph/ceph/pull/41815), Sebastian Wagner, Daniel Pivonka, Zac Dover, Michael Fritch)

- cephadm: june batch 3 ([pr#41913](https://github.com/ceph/ceph/pull/41913), Zac Dover, Adam King, Michael Fritch, Patrick Donnelly, Sage Weil, Juan Miguel Olmo Martínez, jianglong01)

- cephadm: may batch 1 ([pr#41151](https://github.com/ceph/ceph/pull/41151), Juan Miguel Olmo Martínez, Sage Weil, Zac Dover, Daniel Pivonka, Adam King, Stanislav Datskevych, jianglong01, Kefu Chai, Deepika Upadhyay, Joao Eduardo Luis)

- cephadm: may batch 3 ([pr#41463](https://github.com/ceph/ceph/pull/41463), Sage Weil, Michael Fritch, Adam King, Patrick Seidensal, Juan Miguel Olmo Martínez, Dimitri Savineau, Zac Dover, Sebastian Wagner)

- cephfs-mirror backports ([issue#50442](http://tracker.ceph.com/issues/50442), [issue#49939](http://tracker.ceph.com/issues/49939), [issue#50224](http://tracker.ceph.com/issues/50224), [issue#50035](http://tracker.ceph.com/issues/50035), [issue#50298](http://tracker.ceph.com/issues/50298), [issue#50581](http://tracker.ceph.com/issues/50581), [issue#50523](http://tracker.ceph.com/issues/50523), [issue#50266](http://tracker.ceph.com/issues/50266), [issue#50229](http://tracker.ceph.com/issues/50229), [pr#41475](https://github.com/ceph/ceph/pull/41475), Venky Shankar, Lucian Petrut)

- cephfs-mirror: backports ([issue#50447](http://tracker.ceph.com/issues/50447), [issue#51204](http://tracker.ceph.com/issues/51204), [issue#50867](http://tracker.ceph.com/issues/50867), [pr#41947](https://github.com/ceph/ceph/pull/41947), Venky Shankar)

- cephfs-mirror: reopen logs on SIGHUP ([issue#51318](http://tracker.ceph.com/issues/51318), [issue#51413](http://tracker.ceph.com/issues/51413), [pr#42097](https://github.com/ceph/ceph/pull/42097), Venky Shankar)

- cephfs-top: self-adapt the display according the window size ([pr#41053](https://github.com/ceph/ceph/pull/41053), Xiubo Li)

- client: Fix executeable access check for the root user ([pr#41294](https://github.com/ceph/ceph/pull/41294), Kotresh HR)

- client: fix the opened inodes counter increasing ([pr#40685](https://github.com/ceph/ceph/pull/40685), Xiubo Li)

- client: make Inode to inherit from RefCountedObject ([pr#41052](https://github.com/ceph/ceph/pull/41052), Xiubo Li)

- cls/rgw: look for plain entries in non-ascii plain namespace too ([pr#41774](https://github.com/ceph/ceph/pull/41774), Mykola Golub)

- common/buffer: adjust align before calling posix_memalign() ([pr#41249](https://github.com/ceph/ceph/pull/41249), Ilya Dryomov)

- common/mempool: only fail tests if sharding is very bad ([pr#40566](https://github.com/ceph/ceph/pull/40566), singuliere)

- common/options/global.yaml.in: increase default value of bluestore_cache_trim_max_skip_pinned ([pr#40918](https://github.com/ceph/ceph/pull/40918), Neha Ojha)

- crush/crush: ensure alignof(crush_work_bucket) is 1 ([pr#41983](https://github.com/ceph/ceph/pull/41983), Kefu Chai)

- debian,cmake,cephsqlite: hide non-public symbols ([pr#40689](https://github.com/ceph/ceph/pull/40689), Kefu Chai)

- debian/control: ceph-mgr-modules-core does not Recommend ceph-mgr-rook ([pr#41877](https://github.com/ceph/ceph/pull/41877), Kefu Chai)

- doc: pacific updates ([pr#42066](https://github.com/ceph/ceph/pull/42066), Patrick Donnelly)

- librbd/cache/pwl: fix parsing of cache_type in create_image_cache_state() ([pr#41244](https://github.com/ceph/ceph/pull/41244), Ilya Dryomov)

- librbd/mirror/snapshot: avoid UnlinkPeerRequest with a unlinked peer ([pr#41304](https://github.com/ceph/ceph/pull/41304), Arthur Outhenin-Chalandre)

- librbd: don't stop at the first unremovable image when purging ([pr#41664](https://github.com/ceph/ceph/pull/41664), Ilya Dryomov)

- make-dist: refuse to run if script path contains a colon ([pr#41086](https://github.com/ceph/ceph/pull/41086), Nathan Cutler)

- mds: "FAILED ceph_assert(r == 0 || r == -2)" ([pr#42072](https://github.com/ceph/ceph/pull/42072), Xiubo Li)

- mds: "cluster [ERR]   Error recovering journal 0x203: (2) No such file or directory" in cluster log" ([pr#42059](https://github.com/ceph/ceph/pull/42059), Xiubo Li)

- mds: Add full caps to avoid osd full check ([pr#41691](https://github.com/ceph/ceph/pull/41691), Patrick Donnelly, Kotresh HR)

- mds: CephFS kclient gets stuck when getattr() on a certain file ([pr#42062](https://github.com/ceph/ceph/pull/42062), "Yan, Zheng", Xiubo Li)

- mds: Error ENOSYS: mds.a started profiler ([pr#42056](https://github.com/ceph/ceph/pull/42056), Xiubo Li)

- mds: MDSLog::journaler pointer maybe crash with use-after-free ([pr#42060](https://github.com/ceph/ceph/pull/42060), Xiubo Li)

- mds: avoid journaling overhead for setxattr("ceph.dir.subvolume") for no-op case ([pr#41995](https://github.com/ceph/ceph/pull/41995), Patrick Donnelly)

- mds: do not assert when receiving a unknow metric type ([pr#41596](https://github.com/ceph/ceph/pull/41596), Patrick Donnelly, Xiubo Li)

- mds: journal recovery thread is possibly asserting with mds_lock not locked ([pr#42058](https://github.com/ceph/ceph/pull/42058), Xiubo Li)

- mds: mkdir on ephemerally pinned directory sometimes blocked on journal flush ([pr#42071](https://github.com/ceph/ceph/pull/42071), Xiubo Li)

- mds: scrub error on inode 0x1 ([pr#41685](https://github.com/ceph/ceph/pull/41685), Milind Changire)

- mds: standby-replay only trims cache when it reaches the end of the replay log ([pr#40855](https://github.com/ceph/ceph/pull/40855), Xiubo Li, Patrick Donnelly)

- mgr/DaemonServer.cc: prevent mgr crashes caused by integer underflow that is triggered by large increases to pg_num/pgp_num ([pr#41862](https://github.com/ceph/ceph/pull/41862), Cory Snyder)

- mgr/Dashboard: Remove erroneous elements in hosts-overview Grafana dashboard ([pr#40982](https://github.com/ceph/ceph/pull/40982), Malcolm Holmes)

- mgr/dashboard: API Version changes do not apply to pre-defined methods (list, create etc.) ([pr#41675](https://github.com/ceph/ceph/pull/41675), Aashish Sharma)

- mgr/dashboard: Alertmanager fails to POST alerts ([pr#41987](https://github.com/ceph/ceph/pull/41987), Avan Thakkar)

- mgr/dashboard: Fix 500 error while exiting out of maintenance ([pr#41915](https://github.com/ceph/ceph/pull/41915), Nizamudeen A)

- mgr/dashboard: Fix bucket name input allowing space in the value ([pr#42119](https://github.com/ceph/ceph/pull/42119), Nizamudeen A)

- mgr/dashboard: Fix for query params resetting on change-password ([pr#41440](https://github.com/ceph/ceph/pull/41440), Nizamudeen A)

- mgr/dashboard: Generate NPM dependencies manifest ([pr#41204](https://github.com/ceph/ceph/pull/41204), Nizamudeen A)

- mgr/dashboard: Host Maintenance Follow ups ([pr#41056](https://github.com/ceph/ceph/pull/41056), Nizamudeen A)

- mgr/dashboard: Include Network address and labels on Host Creation form ([pr#42027](https://github.com/ceph/ceph/pull/42027), Nizamudeen A)

- mgr/dashboard: OSDs placement text is unreadable ([pr#41096](https://github.com/ceph/ceph/pull/41096), Aashish Sharma)

- mgr/dashboard: RGW buckets async validator performance enhancement and name constraints ([pr#41296](https://github.com/ceph/ceph/pull/41296), Nizamudeen A)

- mgr/dashboard: User database migration has been cut out ([pr#42140](https://github.com/ceph/ceph/pull/42140), Volker Theile)

- mgr/dashboard: avoid data processing in crush-map component ([pr#41203](https://github.com/ceph/ceph/pull/41203), Avan Thakkar)

- mgr/dashboard: bucket details: show lock retention period only in days ([pr#41948](https://github.com/ceph/ceph/pull/41948), Alfonso Martínez)

- mgr/dashboard: crushmap tree doesn't display crush type other than root ([pr#42007](https://github.com/ceph/ceph/pull/42007), Kefu Chai, Avan Thakkar)

- mgr/dashboard: disable NFSv3 support in dashboard ([pr#41200](https://github.com/ceph/ceph/pull/41200), Volker Theile)

- mgr/dashboard: drop container image name and id from services list ([pr#41505](https://github.com/ceph/ceph/pull/41505), Avan Thakkar)

- mgr/dashboard: fix API docs link ([pr#41507](https://github.com/ceph/ceph/pull/41507), Avan Thakkar)

- mgr/dashboard: fix ESOCKETTIMEDOUT E2E failure ([pr#41427](https://github.com/ceph/ceph/pull/41427), Avan Thakkar)

- mgr/dashboard: fix HAProxy (now called ingress) ([pr#41298](https://github.com/ceph/ceph/pull/41298), Avan Thakkar)

- mgr/dashboard: fix OSD out count ([pr#42153](https://github.com/ceph/ceph/pull/42153), 胡玮文)

- mgr/dashboard: fix OSDs Host details/overview grafana graphs ([issue#49769](http://tracker.ceph.com/issues/49769), [pr#41324](https://github.com/ceph/ceph/pull/41324), Alfonso Martínez, Michael Wodniok)

- mgr/dashboard: fix base-href ([pr#41634](https://github.com/ceph/ceph/pull/41634), Avan Thakkar)

- mgr/dashboard: fix base-href: revert it to previous approach ([pr#41251](https://github.com/ceph/ceph/pull/41251), Avan Thakkar)

- mgr/dashboard: fix bucket objects and size calculations ([pr#41646](https://github.com/ceph/ceph/pull/41646), Avan Thakkar)

- mgr/dashboard: fix bucket versioning when locking is enabled ([pr#41197](https://github.com/ceph/ceph/pull/41197), Avan Thakkar)

- mgr/dashboard: fix for right sidebar nav icon not clickable ([pr#42008](https://github.com/ceph/ceph/pull/42008), Aaryan Porwal)

- mgr/dashboard: fix set-ssl-certificate{,-key} commands ([pr#41170](https://github.com/ceph/ceph/pull/41170), Alfonso Martínez)

- mgr/dashboard: fix typo: Filesystems to File Systems ([pr#42016](https://github.com/ceph/ceph/pull/42016), Navin Barnwal)

- mgr/dashboard: ingress service creation follow-up ([pr#41428](https://github.com/ceph/ceph/pull/41428), Avan Thakkar)

- mgr/dashboard: pass Grafana datasource in URL ([pr#41633](https://github.com/ceph/ceph/pull/41633), Ernesto Puerta)

- mgr/dashboard: provide the service events when showing a service in the UI ([pr#41494](https://github.com/ceph/ceph/pull/41494), Aashish Sharma)

- mgr/dashboard: run cephadm-backend e2e tests with KCLI ([pr#42156](https://github.com/ceph/ceph/pull/42156), Alfonso Martínez)

- mgr/dashboard: set required env. variables in run-backend-api-tests.sh ([pr#41069](https://github.com/ceph/ceph/pull/41069), Alfonso Martínez)

- mgr/dashboard: show RGW tenant user id correctly in 'NFS create export' form ([pr#41528](https://github.com/ceph/ceph/pull/41528), Alfonso Martínez)

- mgr/dashboard: show partially deleted RBDs ([pr#41891](https://github.com/ceph/ceph/pull/41891), Tatjana Dehler)

- mgr/dashboard: simplify object locking fields in 'Bucket Creation' form ([pr#41777](https://github.com/ceph/ceph/pull/41777), Alfonso Martínez)

- mgr/dashboard: update frontend deps due to security vulnerabilities ([pr#41402](https://github.com/ceph/ceph/pull/41402), Alfonso Martínez)

- mgr/dashboard:include compression stats on pool dashboard ([pr#41577](https://github.com/ceph/ceph/pull/41577), Ernesto Puerta, Paul Cuzner)

- mgr/nfs: do not depend on cephadm.utils ([pr#41842](https://github.com/ceph/ceph/pull/41842), Sage Weil)

- mgr/progress: ensure progress stays between [0,1] ([pr#41312](https://github.com/ceph/ceph/pull/41312), Dan van der Ster)

- mgr/prometheus:Improve the pool metadata ([pr#40804](https://github.com/ceph/ceph/pull/40804), Paul Cuzner)

- mgr/pybind/snap_schedule: do not fail when no fs snapshots are available ([pr#41044](https://github.com/ceph/ceph/pull/41044), Sébastien Han)

- mgr/volumes/nfs: drop type param during cluster create ([pr#41005](https://github.com/ceph/ceph/pull/41005), Michael Fritch)

- mon,doc: deprecate min_compat_client ([pr#41468](https://github.com/ceph/ceph/pull/41468), Patrick Donnelly)

- mon/MonClient: reset authenticate_err in _reopen_session() ([pr#41019](https://github.com/ceph/ceph/pull/41019), Ilya Dryomov)

- mon/MonClient: tolerate a rotating key that is slightly out of date ([pr#41450](https://github.com/ceph/ceph/pull/41450), Ilya Dryomov)

- mon/OSDMonitor: drop stale failure_info after a grace period ([pr#41090](https://github.com/ceph/ceph/pull/41090), Kefu Chai)

- mon/OSDMonitor: drop stale failure_info even if can_mark_down() ([pr#41982](https://github.com/ceph/ceph/pull/41982), Kefu Chai)

- mon: load stashed map before mkfs monmap ([pr#41768](https://github.com/ceph/ceph/pull/41768), Dan van der Ster)

- nfs backport May ([pr#41389](https://github.com/ceph/ceph/pull/41389), Varsha Rao)

- os/FileStore: fix to handle readdir error correctly ([pr#41236](https://github.com/ceph/ceph/pull/41236), Misono Tomohiro)

- os/bluestore: fix unexpected ENOSPC in Avl/Hybrid allocators ([pr#41655](https://github.com/ceph/ceph/pull/41655), Igor Fedotov, Neha Ojha)

- os/bluestore: introduce multithreading sync for bluestore's repairer ([pr#41752](https://github.com/ceph/ceph/pull/41752), Igor Fedotov)

- os/bluestore: tolerate zero length for allocators' init\_[add/rm]_free() ([pr#41753](https://github.com/ceph/ceph/pull/41753), Igor Fedotov)

- osd/PG.cc: handle removal of pgmeta object ([pr#41680](https://github.com/ceph/ceph/pull/41680), Neha Ojha)

- osd/osd_type: use f->dump_unsigned() when appropriate ([pr#42045](https://github.com/ceph/ceph/pull/42045), Kefu Chai)

- osd/scrub: replace a ceph_assert() with a test ([pr#41944](https://github.com/ceph/ceph/pull/41944), Ronen Friedman)

- osd: Override recovery, backfill and sleep related config options during OSD and mclock scheduler initialization ([pr#41125](https://github.com/ceph/ceph/pull/41125), Sridhar Seshasayee, Zac Dover)

- osd: clear data digest when write_trunc ([pr#42019](https://github.com/ceph/ceph/pull/42019), Zengran Zhang)

- osd: compute OSD's space usage ratio via raw space utilization ([pr#41113](https://github.com/ceph/ceph/pull/41113), Igor Fedotov)

- osd: don't assert in-flight backfill is always in recovery list ([pr#41320](https://github.com/ceph/ceph/pull/41320), Mykola Golub)

- osd: fix scrub reschedule bug ([pr#41971](https://github.com/ceph/ceph/pull/41971), wencong wan)

- pacific: client: abort after MDS blocklist ([issue#50530](http://tracker.ceph.com/issues/50530), [pr#42070](https://github.com/ceph/ceph/pull/42070), Venky Shankar)

- pybind/ceph_volume_client: use cephfs mkdirs api ([pr#42159](https://github.com/ceph/ceph/pull/42159), Patrick Donnelly)

- pybind/mgr/devicehealth: scrape-health-metrics command accidentally renamed to scrape-daemon-health-metrics ([pr#41089](https://github.com/ceph/ceph/pull/41089), Patrick Donnelly)

- pybind/mgr/progress: Disregard unreported pgs ([pr#41872](https://github.com/ceph/ceph/pull/41872), Kamoltat)

- pybind/mgr/snap_schedule: Invalid command: Unexpected argument 'fs=cephfs' ([pr#42064](https://github.com/ceph/ceph/pull/42064), Patrick Donnelly)

- qa/config/rados: add dispatch delay testing params ([pr#41136](https://github.com/ceph/ceph/pull/41136), Deepika Upadhyay)

- qa/distros/podman: preserve registries.conf ([pr#40729](https://github.com/ceph/ceph/pull/40729), Sage Weil)

- qa/suites/rados/standalone: remove mon_election symlink ([pr#41212](https://github.com/ceph/ceph/pull/41212), Neha Ojha)

- qa/suites/rados: add simultaneous scrubs to the thrasher ([pr#42120](https://github.com/ceph/ceph/pull/42120), Ronen Friedman)

- qa/tasks/qemu: precise repos have been archived ([pr#41643](https://github.com/ceph/ceph/pull/41643), Ilya Dryomov)

- qa/tests: corrected point versions to reflect latest releases ([pr#41313](https://github.com/ceph/ceph/pull/41313), Yuri Weinstein)

- qa/tests: initial checkin for pacific-p2p suite (2) ([pr#41208](https://github.com/ceph/ceph/pull/41208), Yuri Weinstein)

- qa/tests: replaced ubuntu_latest.yaml with ubuntu 20.04 ([pr#41460](https://github.com/ceph/ceph/pull/41460), Patrick Donnelly, Kefu Chai)

- qa/upgrade: conditionally disable update_features tests ([pr#41629](https://github.com/ceph/ceph/pull/41629), Deepika)

- qa/workunits/rbd: use bionic version of qemu-iotests for focal ([pr#41195](https://github.com/ceph/ceph/pull/41195), Ilya Dryomov)

- qa: AttributeError: 'RemoteProcess' object has no attribute 'split' ([pr#41811](https://github.com/ceph/ceph/pull/41811), Patrick Donnelly)

- qa: add async dirops testing ([pr#41823](https://github.com/ceph/ceph/pull/41823), Patrick Donnelly)

- qa: check mounts attribute in ctx ([pr#40634](https://github.com/ceph/ceph/pull/40634), Jos Collin)

- qa: convert some legacy Filesystem.rados calls ([pr#40996](https://github.com/ceph/ceph/pull/40996), Patrick Donnelly)

- qa: drop the distro~HEAD directory from the fs suite ([pr#41169](https://github.com/ceph/ceph/pull/41169), Radoslaw Zarzynski)

- qa: fs:bugs does not specify distro ([pr#42063](https://github.com/ceph/ceph/pull/42063), Patrick Donnelly)

- qa: fs:upgrade uses teuthology default distro ([pr#42067](https://github.com/ceph/ceph/pull/42067), Patrick Donnelly)

- qa: scrub code does not join scrubopts with comma ([pr#42065](https://github.com/ceph/ceph/pull/42065), Kefu Chai, Patrick Donnelly)

- qa: test_data_scan.TestDataScan.test_pg_files AssertionError: Items in the second set but not the first ([pr#42069](https://github.com/ceph/ceph/pull/42069), Xiubo Li)

- qa: test_ephemeral_pin_distribution failure ([pr#41659](https://github.com/ceph/ceph/pull/41659), Patrick Donnelly)

- qa: update RHEL to 8.4 ([pr#41822](https://github.com/ceph/ceph/pull/41822), Patrick Donnelly)

- rbd-mirror: fix segfault in snapshot replayer shutdown ([pr#41503](https://github.com/ceph/ceph/pull/41503), Arthur Outhenin-Chalandre)

- rbd: --source-spec-file should be --source-spec-path ([pr#41122](https://github.com/ceph/ceph/pull/41122), Ilya Dryomov)

- rbd: don't attempt to interpret image cache state json ([pr#41281](https://github.com/ceph/ceph/pull/41281), Ilya Dryomov)

- rgw: Simplify log shard probing and err on the side of omap ([pr#41576](https://github.com/ceph/ceph/pull/41576), Adam C. Emerson)

- rgw: completion of multipart upload leaves delete marker ([pr#41769](https://github.com/ceph/ceph/pull/41769), J. Eric Ivancich)

- rgw: crash on multipart upload to bucket with policy ([pr#41893](https://github.com/ceph/ceph/pull/41893), Or Friedmann)

- rgw: radosgw_admin remove bucket not purging past 1,000 objects ([pr#41863](https://github.com/ceph/ceph/pull/41863), J. Eric Ivancich)

- rgw: radoslist incomplete multipart parts marker ([pr#40819](https://github.com/ceph/ceph/pull/40819), J. Eric Ivancich)

- rocksdb: pickup fix to detect PMULL instruction ([pr#41079](https://github.com/ceph/ceph/pull/41079), Kefu Chai)

- session dump includes completed_requests twice, once as an integer and once as a list ([pr#42057](https://github.com/ceph/ceph/pull/42057), Dan van der Ster)

- systemd: remove `ProtectClock=true` for `ceph-osd@.service` ([pr#41232](https://github.com/ceph/ceph/pull/41232), Wong Hoi Sing Edison)

- test/librbd: use really invalid domain ([pr#42010](https://github.com/ceph/ceph/pull/42010), Mykola Golub)

- win32\*.sh: disable libcephsqlite when targeting Windows ([pr#40557](https://github.com/ceph/ceph/pull/40557), Lucian Petrut)
