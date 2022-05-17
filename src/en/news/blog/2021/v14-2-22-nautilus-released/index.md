---
title: "v14.2.22 Nautilus released"
date: "2021-06-30"
author: "dgalloway"
tags:
  - "release"
  - "nautilus"
---

This is the 22nd and likely the last backport release in the Nautilus series. Ultimately, we recommend all users upgrade to newer Ceph releases.

## Notable Changes

- This release sets `bluefs_buffered_io` to true by default to improve performance
  for metadata heavy workloads. Enabling this option has been reported to
  occasionally cause excessive kernel swapping under certain workloads.
  Currently, the most consistent performing combination is to enable
  bluefs_buffered_io and disable system level swap.

- The default value of `bluestore_cache_trim_max_skip_pinned` has been
  increased to 1000 to control memory growth due to onodes.

- Several other bug fixes in BlueStore, including a fix for an unexpected
  ENOSPC bug in Avl/Hybrid allocators.

- The trimming logic in the monitor has been made dynamic, with the
  introduction of `paxos_service_trim_max_multiplier`, a factor by which
  `paxos_service_trim_max` is multiplied to make trimming faster,
  when required. Setting it to 0 disables the upper bound check for trimming
  and makes the monitors trim at the maximum rate.

- A `--max <n>` option is available with the `osd ok-to-stop` command to
  provide up to N OSDs that can be stopped together without making PGs
  unavailable.

- OSD: the option `osd_fast_shutdown_notify_mon` has been introduced to allow
  the OSD to notify the monitor it is shutting down even if `osd_fast_shutdown`
  is enabled. This helps with the monitor logs on larger clusters, that may get
  many 'osd.X reported immediately failed by osd.Y' messages, and confuse tools.

- A long-standing bug that prevented 32-bit and 64-bit client/server
  interoperability under msgr v2 has been fixed. In particular, mixing armv7l
  (armhf) and x86_64 or aarch64 servers in the same cluster now works.

## Changelog

- PendingReleaseNotes: note about 14.2.18 mgr fixes ([pr#40121](https://github.com/ceph/ceph/pull/40121), Josh Durgin)

- bind on loopback address if no other addresses are available ([pr#41137](https://github.com/ceph/ceph/pull/41137), Kefu Chai, Matthew Oliver)

- build python extensions using distutils ([pr#41167](https://github.com/ceph/ceph/pull/41167), Kefu Chai)

- ceph-monstore-tool: use a large enough paxos/{first,last}\_committed ([issue#38219](http://tracker.ceph.com/issues/38219), [pr#41874](https://github.com/ceph/ceph/pull/41874), Kefu Chai)

- ceph-volume: disable cache for blkid calls ([pr#41114](https://github.com/ceph/ceph/pull/41114), Rafał Wądołowski)

- ceph-volume: fix batch report and respect ceph.conf config values ([pr#41716](https://github.com/ceph/ceph/pull/41716), Andrew Schoen)

- ceph-volume: fix batch report and respect ceph.conf config values ([pr#41713](https://github.com/ceph/ceph/pull/41713), Andrew Schoen)

- ceph-volume: implement bluefs volume migration ([pr#41676](https://github.com/ceph/ceph/pull/41676), Kefu Chai, Igor Fedotov)

- ceph<!-- breaklink -->.spec<!-- breaklink -->.in: Enable tcmalloc on IBM Power and Z ([pr#40283](https://github.com/ceph/ceph/pull/40283), Nathan Cutler, Yaakov Selkowitz)

- cephfs: client: add ability to lookup snapped inodes by inode number ([pr#40769](https://github.com/ceph/ceph/pull/40769), Jeff Layton, Xiubo Li)

- cephfs: client: only check pool permissions for regular files ([pr#40730](https://github.com/ceph/ceph/pull/40730), Xiubo Li)

- cephfs: client: wake up the front pos waiter ([pr#40865](https://github.com/ceph/ceph/pull/40865), Xiubo Li)

- client: Fix executeable access check for the root user ([pr#41297](https://github.com/ceph/ceph/pull/41297), Kotresh HR)

- client: fire the finish_cap_snap() after buffer being flushed ([pr#40722](https://github.com/ceph/ceph/pull/40722), Xiubo Li)

- cls/rgw: look for plain entries in non-ascii plain namespace too ([pr#41776](https://github.com/ceph/ceph/pull/41776), Mykola Golub)

- cmake,zstd,debian: allow use libzstd in system ([pr#40516](https://github.com/ceph/ceph/pull/40516), Kefu Chai, Bryan Stillwell, Dan van der Ster)

- cmake: build static libs if they are internal ones ([pr#39903](https://github.com/ceph/ceph/pull/39903), Kefu Chai)

- cmake: detect gettid() presense ([pr#40333](https://github.com/ceph/ceph/pull/40333), Igor Fedotov)

- cmake: set empty RPATH for some test executables ([pr#40619](https://github.com/ceph/ceph/pull/40619), Nathan Cutler, Kefu Chai)

- common/buffer: adjust align before calling posix_memalign() ([pr#41246](https://github.com/ceph/ceph/pull/41246), Ilya Dryomov)

- common/ipaddr: skip loopback interfaces named 'lo' and test it ([pr#40423](https://github.com/ceph/ceph/pull/40423), Dan van der Ster)

- common/mempool: only fail tests if sharding is very bad ([pr#40567](https://github.com/ceph/ceph/pull/40567), singuliere)

- common/options/global.yaml.in: increase default value of bluestore_cache_trim_max_skip_pinned ([pr#40920](https://github.com/ceph/ceph/pull/40920), Neha Ojha)

- common/options: bluefs_buffered_io=true by default ([pr#40393](https://github.com/ceph/ceph/pull/40393), Dan van der Ster)

- common: Fix assertion when disabling and re-enabling clog_to_monitors ([pr#39912](https://github.com/ceph/ceph/pull/39912), Gerald Yang)

- common: remove log_early configuration option ([pr#40549](https://github.com/ceph/ceph/pull/40549), Changcheng Liu)

- crush/CrushLocation: do not print logging message in constructor ([pr#40750](https://github.com/ceph/ceph/pull/40750), Alex Wu)

- crush/CrushWrapper: update shadow trees on update_item() ([pr#39920](https://github.com/ceph/ceph/pull/39920), Sage Weil)

- debian/ceph-common.postinst: do not chown cephadm log dirs ([pr#40698](https://github.com/ceph/ceph/pull/40698), Sage Weil)

- debian/control: add missing commas, use python3 packages for "make check" on focal ([pr#40485](https://github.com/ceph/ceph/pull/40485), Kefu Chai, Alfredo Deza)

- install-deps<!-- breaklink -->.sh: remove existing ceph-libboost of different version ([pr#40287](https://github.com/ceph/ceph/pull/40287), Kefu Chai)

- libcephfs: ignore restoring the open files limit ([pr#41593](https://github.com/ceph/ceph/pull/41593), Xiubo Li)

- librbd: allow interrupted trash move request to be restarted ([pr#40675](https://github.com/ceph/ceph/pull/40675), Jason Dillaman)

- librbd: don't stop at the first unremovable image when purging ([pr#41662](https://github.com/ceph/ceph/pull/41662), Ilya Dryomov)

- librbd: fix sporadic failures in TestMigration.StressLive ([pr#41788](https://github.com/ceph/ceph/pull/41788), Jason Dillaman)

- librbd: race when disabling object map with overlapping in-flight writes ([pr#41787](https://github.com/ceph/ceph/pull/41787), Jason Dillaman)

- make-dist: refuse to run if script path contains a colon ([pr#41088](https://github.com/ceph/ceph/pull/41088), Nathan Cutler)

- mds: do not trim the inodes from the lru list in standby_replay ([pr#41144](https://github.com/ceph/ceph/pull/41144), Xiubo Li)

- mds: fix race of fetching large dirfrag ([pr#40720](https://github.com/ceph/ceph/pull/40720), Erqi Chen)

- mds: send scrub status to ceph-mgr only when scrub is running ([issue#45349](http://tracker.ceph.com/issues/45349), [pr#36183](https://github.com/ceph/ceph/pull/36183), Kefu Chai, Venky Shankar)

- mds: trim cache regularly for standby-replay ([pr#40744](https://github.com/ceph/ceph/pull/40744), Patrick Donnelly)

- mgr/ActivePyModules.cc: always release GIL before attempting to acquire a lock ([pr#40047](https://github.com/ceph/ceph/pull/40047), Kefu Chai)

- mgr/Dashboard: Remove erroneous elements in hosts-overview Grafana dashboard ([pr#41650](https://github.com/ceph/ceph/pull/41650), Malcolm Holmes)

- mgr/PyModule: put mgr_module_path before Py_GetPath() ([pr#40753](https://github.com/ceph/ceph/pull/40753), Kefu Chai)

- mgr/dashboard: Fix for alert notification message being undefined ([pr#40590](https://github.com/ceph/ceph/pull/40590), Nizamudeen A)

- mgr/dashboard: Fix missing root path of each session for CephFS ([pr#39869](https://github.com/ceph/ceph/pull/39869), Yongseok Oh)

- mgr/dashboard: Monitoring alert badge includes suppressed alerts ([pr#39511](https://github.com/ceph/ceph/pull/39511), Aashish Sharma)

- mgr/dashboard: Remove username, password fields from Manager Modules/dashboard,influx ([pr#40490](https://github.com/ceph/ceph/pull/40490), Aashish Sharma)

- mgr/dashboard: Revoke read-only user's access to Manager modules ([pr#40650](https://github.com/ceph/ceph/pull/40650), Nizamudeen A)

- mgr/dashboard: debug nodeenv hangs ([pr#40818](https://github.com/ceph/ceph/pull/40818), Ernesto Puerta)

- mgr/dashboard: decouple unit tests from build artifacts ([pr#40547](https://github.com/ceph/ceph/pull/40547), Alfonso Martínez)

- mgr/dashboard: encode non-ascii string before passing it to exec_cmd() ([pr#40522](https://github.com/ceph/ceph/pull/40522), Kefu Chai)

- mgr/dashboard: filesystem pool size should use stored stat ([pr#41021](https://github.com/ceph/ceph/pull/41021), Avan Thakkar)

- mgr/dashboard: fix API docs link ([pr#41521](https://github.com/ceph/ceph/pull/41521), Avan Thakkar)

- mgr/dashboard: fix OSDs Host details/overview grafana graphs ([issue#49769](http://tracker.ceph.com/issues/49769), [pr#41531](https://github.com/ceph/ceph/pull/41531), Alfonso Martínez, Michael Wodniok)

- mgr/dashboard: fix base-href: revert it to previous approach ([pr#41253](https://github.com/ceph/ceph/pull/41253), Avan Thakkar)

- mgr/dashboard: fix bucket objects and size calculations ([pr#41648](https://github.com/ceph/ceph/pull/41648), Avan Thakkar)

- mgr/dashboard: fix dashboard instance ssl certificate functionality ([pr#40003](https://github.com/ceph/ceph/pull/40003), Avan Thakkar)

- mgr/dashboard: grafana panels for rgw multisite sync performance ([pr#41386](https://github.com/ceph/ceph/pull/41386), Alfonso Martínez)

- mgr/dashboard: python 2: fix error when non-ASCII password ([pr#40610](https://github.com/ceph/ceph/pull/40610), Alfonso Martínez)

- mgr/dashboard: report mgr fsid ([pr#39853](https://github.com/ceph/ceph/pull/39853), Ernesto Puerta)

- mgr/dashboard: show partially deleted RBDs ([pr#41738](https://github.com/ceph/ceph/pull/41738), Tatjana Dehler)

- mgr/dashboard: test prometheus rules through promtool ([pr#39984](https://github.com/ceph/ceph/pull/39984), Aashish Sharma, Kefu Chai)

- mgr/progress: ensure progress stays between [0,1] ([pr#41310](https://github.com/ceph/ceph/pull/41310), Dan van der Ster)

- mgr/telemetry: check if 'ident' channel is active ([pr#39923](https://github.com/ceph/ceph/pull/39923), Yaarit Hatuka)

- mgr/telemetry: pass leaderboard flag even w/o ident ([pr#41839](https://github.com/ceph/ceph/pull/41839), Sage Weil)

- mgr/volumes: Retain suid guid bits in clone ([pr#40270](https://github.com/ceph/ceph/pull/40270), Kotresh HR)

- mgr: add --max <n> to 'osd ok-to-stop' command ([pr#40676](https://github.com/ceph/ceph/pull/40676), Sage Weil, Xuehan Xu)

- mgr: add mon metada using type of "mon" ([pr#40359](https://github.com/ceph/ceph/pull/40359), Kefu Chai)

- mon/ConfigMap: fix stray option leak ([pr#40299](https://github.com/ceph/ceph/pull/40299), Sage Weil)

- mon/MonClient: reset authenticate_err in \_reopen_session() ([pr#41016](https://github.com/ceph/ceph/pull/41016), Ilya Dryomov)

- mon/MonClient: tolerate a rotating key that is slightly out of date ([pr#41448](https://github.com/ceph/ceph/pull/41448), Ilya Dryomov)

- mon/OSDMonitor: drop stale failure_info after a grace period ([pr#41213](https://github.com/ceph/ceph/pull/41213), Kefu Chai)

- mon/OSDMonitor: drop stale failure_info even if can_mark_down() ([pr#41519](https://github.com/ceph/ceph/pull/41519), Kefu Chai)

- mon: Modifying trim logic to change paxos_service_trim_max dynamically ([pr#41099](https://github.com/ceph/ceph/pull/41099), Aishwarya Mathuria)

- mon: ensure progress is [0,1] before printing ([pr#41098](https://github.com/ceph/ceph/pull/41098), Dan van der Ster)

- mon: load stashed map before mkfs monmap ([pr#41762](https://github.com/ceph/ceph/pull/41762), Dan van der Ster)

- monmaptool: Don't call set_port on an invalid address ([pr#40700](https://github.com/ceph/ceph/pull/40700), Brad Hubbard, Kefu Chai)

- os/FileStore: don't propagate split/merge error to "create"/"remove" ([pr#40987](https://github.com/ceph/ceph/pull/40987), Mykola Golub)

- os/FileStore: fix to handle readdir error correctly ([pr#41238](https://github.com/ceph/ceph/pull/41238), Misono Tomohiro)

- os/bluestore/BlueFS: do not \_flush_range deleted files ([pr#40752](https://github.com/ceph/ceph/pull/40752), weixinwei)

- os/bluestore/BlueFS: use iterator_impl::copy instead of bufferlist::c_str() to avoid bufferlist rebuild ([pr#39883](https://github.com/ceph/ceph/pull/39883), weixinwei)

- os/bluestore: be more verbose in \_open_super_meta by default ([pr#41060](https://github.com/ceph/ceph/pull/41060), Igor Fedotov)

- os/bluestore: do not count pinned entries as trimmed ones ([pr#41173](https://github.com/ceph/ceph/pull/41173), Igor Fedotov)

- os/bluestore: fix unexpected ENOSPC in Avl/Hybrid allocators ([pr#41673](https://github.com/ceph/ceph/pull/41673), Igor Fedotov)

- os/bluestore: introduce multithireading sync for bluestore's repairer ([pr#41749](https://github.com/ceph/ceph/pull/41749), Igor Fedotov)

- os/bluestore: tolerate zero length for allocators' init\_[add/rm]\_free() ([pr#41750](https://github.com/ceph/ceph/pull/41750), Igor Fedotov)

- osd/PG.cc: handle removal of pgmeta object ([pr#41682](https://github.com/ceph/ceph/pull/41682), Neha Ojha)

- osd/PeeringState: fix acting_set_writeable min_size check ([pr#41611](https://github.com/ceph/ceph/pull/41611), Dan van der Ster)

- osd: add osd_fast_shutdown_notify_mon option (default false) ([issue#46978](http://tracker.ceph.com/issues/46978), [pr#40014](https://github.com/ceph/ceph/pull/40014), Mauricio Faria de Oliveira)

- osd: compute OSD's space usage ratio via raw space utilization ([pr#41111](https://github.com/ceph/ceph/pull/41111), Igor Fedotov)

- osd: do not dump an osd multiple times ([pr#40747](https://github.com/ceph/ceph/pull/40747), Xue Yantao)

- pybind/ceph_daemon: do not fail if prettytable is not available ([pr#40335](https://github.com/ceph/ceph/pull/40335), Kefu Chai)

- pybind/cephfs: DT_REG and DT_LNK values are wrong ([pr#40704](https://github.com/ceph/ceph/pull/40704), Varsha Rao)

- pybind/mgr/balancer/module.py: assign weight-sets to all buckets before balancing ([pr#40128](https://github.com/ceph/ceph/pull/40128), Neha Ojha)

- pybind/mgr/volumes: deadlock on async job hangs finisher thread ([pr#41394](https://github.com/ceph/ceph/pull/41394), Patrick Donnelly)

- pybind/rados: should pass "name" to cstr() ([pr#41318](https://github.com/ceph/ceph/pull/41318), Kefu Chai)

- pybind: volume_client handle purge of directory names encoded in utf-8 ([pr#36679](https://github.com/ceph/ceph/pull/36679), Jose Castro Leon)

- qa/tasks/mgr/test_progress: fix wait_until_equal ([pr#39397](https://github.com/ceph/ceph/pull/39397), Kamoltat, Ricardo Dias)

- qa/tasks/qemu: precise repos have been archived ([pr#41641](https://github.com/ceph/ceph/pull/41641), Ilya Dryomov)

- qa/tasks/vstart_runner.py: start max required mgrs ([pr#40751](https://github.com/ceph/ceph/pull/40751), Alfonso Martínez)

- qa/tests: added client-upgrade-nautilus-pacific tests ([pr#39818](https://github.com/ceph/ceph/pull/39818), Yuri Weinstein)

- qa/tests: advanced nautilus initial version to 14.2.20 ([pr#41227](https://github.com/ceph/ceph/pull/41227), Yuri Weinstein)

- qa/upgrade: disable update_features test_notify with older client as lockowner ([pr#41513](https://github.com/ceph/ceph/pull/41513), Deepika Upadhyay)

- qa: add sleep for blocklisting to take effect ([pr#40714](https://github.com/ceph/ceph/pull/40714), Patrick Donnelly)

- qa: bump osd heartbeat grace for ffsb workload ([pr#40713](https://github.com/ceph/ceph/pull/40713), Nathan Cutler)

- qa: delete all fs during tearDown ([pr#40709](https://github.com/ceph/ceph/pull/40709), Patrick Donnelly)

- qa: krbd_blkroset.t: update for separate hw and user read-only flags ([pr#40212](https://github.com/ceph/ceph/pull/40212), Ilya Dryomov)

- qa: vstart_runner: TypeError: lstat: path should be string, bytes or os.PathLike, not NoneType ([pr#41485](https://github.com/ceph/ceph/pull/41485), Patrick Donnelly)

- rbd-mirror: image replayer stop might race with instance replayer shut down ([pr#41792](https://github.com/ceph/ceph/pull/41792), Mykola Golub, Jason Dillaman)

- rgw : catch non int exception ([pr#40356](https://github.com/ceph/ceph/pull/40356), caolei)

- rgw/http: add timeout to http client ([pr#40667](https://github.com/ceph/ceph/pull/40667), Yuval Lifshitz)

- rgw: Added caching for S3 credentials retrieved from keystone ([pr#41158](https://github.com/ceph/ceph/pull/41158), James Weaver)

- rgw: Use correct bucket info when put or get large object with swift ([pr#40106](https://github.com/ceph/ceph/pull/40106), zhiming zhang, yupeng chen)

- rgw: allow rgw-orphan-list to handle intermediate files w/ binary data ([pr#39767](https://github.com/ceph/ceph/pull/39767), J. Eric Ivancich)

- rgw: beast frontend uses 512k mprotected coroutine stacks ([pr#39947](https://github.com/ceph/ceph/pull/39947), Yaakov Selkowitz, Mauricio Faria de Oliveira, Daniel Gryniewicz, Casey Bodley)

- rgw: check object locks in multi-object delete ([issue#47586](http://tracker.ceph.com/issues/47586), [pr#41164](https://github.com/ceph/ceph/pull/41164), Mark Houghton, Matt Benjamin)

- rgw: during reshard lock contention, adjust logging ([pr#41156](https://github.com/ceph/ceph/pull/41156), J. Eric Ivancich)

- rgw: limit rgw_gc_max_objs to RGW_SHARDS_PRIME_1 ([pr#40670](https://github.com/ceph/ceph/pull/40670), Rafał Wądołowski)

- rgw: radoslist incomplete multipart parts marker ([pr#40827](https://github.com/ceph/ceph/pull/40827), J. Eric Ivancich)

- rgw: return ERR_NO_SUCH_BUCKET early while evaluating bucket policy ([issue#38420](http://tracker.ceph.com/issues/38420), [pr#40668](https://github.com/ceph/ceph/pull/40668), Abhishek Lekshmanan)

- rgw: return error when trying to copy encrypted object without key ([pr#40671](https://github.com/ceph/ceph/pull/40671), Ilsoo Byun)

- rgw: tooling to locate rgw objects with missing rados components ([pr#39771](https://github.com/ceph/ceph/pull/39771), Michael Kidd, J. Eric Ivancich)

- run-make-check<!-- breaklink -->.sh: let ctest generate XML output ([pr#40407](https://github.com/ceph/ceph/pull/40407), Kefu Chai)

- src/global/signal_handler.h: fix preprocessor logic for alpine ([pr#39942](https://github.com/ceph/ceph/pull/39942), Duncan Bellamy)

- test/TestOSDScrub: fix mktime() error ([pr#40621](https://github.com/ceph/ceph/pull/40621), luo rixin)

- test/pybind: s/nosetests/python3/ ([pr#40536](https://github.com/ceph/ceph/pull/40536), Kefu Chai)

- test/rgw: test_datalog_autotrim filters out new entries ([pr#40674](https://github.com/ceph/ceph/pull/40674), Casey Bodley)

- test: use std::atomic<bool> instead of volatile for cb_done var ([pr#40701](https://github.com/ceph/ceph/pull/40701), Jeff Layton)

- tests: ceph_test_rados_api_watch_notify: Allow for reconnect ([pr#40697](https://github.com/ceph/ceph/pull/40697), Brad Hubbard)

- vstart<!-- breaklink -->.sh: disable "auth_allow_insecure_global_id_reclaim" ([pr#40959](https://github.com/ceph/ceph/pull/40959), Kefu Chai)
