---
title: "v15.2.17 Octopus released"
date: "2022-08-09"
author: "dgalloway"
tags:
  - "release"
  - "octopus"
---

This is the 17th and finalbackport release in the Octopus series. We recommend all users update to this release.

Notable Changes
---------------

* Octopus modified the SnapMapper key format from

  `<LEGACY_MAPPING_PREFIX><snapid>_<shardid>_<hobject_t::to_str()>`

  to

  `<MAPPING_PREFIX><pool>_<snapid>_<shardid>_<hobject_t::to_str()>`

  When this change was introduced, 94ebe0e also introduced a conversion
  with a crucial bug which essentially destroyed legacy keys by mapping them
  to
  <MAPPING_PREFIX><poolid>_<snapid>_
  without the object-unique suffix. The conversion is fixed in this release.
  Relevant tracker: https://tracker.ceph.com/issues/5614

* The ability to blend all RBD pools together into a single view by invoking
  "rbd perf image iostat" or "rbd perf image iotop" commands without any options
  or positional arguments is resurrected.  Such invocations accidentally became
  limited to just the default pool (``rbd_default_pool``) in v15.2.14.

Changelog
---------

- admin/doc-requirements: bump sphinx to 4<span></span>.4<span></span>.0 ([pr#45972](https://github.com/ceph/ceph/pull/45972), Kefu Chai)

- backport qemu-iotests fixup for centos stream 8 ([pr#45206](https://github.com/ceph/ceph/pull/45206), Ken Dreyer, Ilya Dryomov)

- Catch exception if thrown by \_\_generate\_command\_map() ([pr#45891](https://github.com/ceph/ceph/pull/45891), Nikhil Kshirsagar)

- ceph-volume: abort when passed devices have partitions ([pr#45147](https://github.com/ceph/ceph/pull/45147), Guillaume Abrioux)

- ceph-volume: fix error 'KeyError' with inventory ([pr#44883](https://github.com/ceph/ceph/pull/44883), Guillaume Abrioux)

- ceph-volume: fix tags dict output in `lvm list` ([pr#44768](https://github.com/ceph/ceph/pull/44768), Guillaume Abrioux)

- ceph-volume: zap osds in rollback\_osd() ([pr#44770](https://github.com/ceph/ceph/pull/44770), Guillaume Abrioux)

- ceph/admin: s/master/main ([pr#46219](https://github.com/ceph/ceph/pull/46219), Zac Dover)

- cephadm: infer the default container image during pull ([pr#45570](https://github.com/ceph/ceph/pull/45570), Michael Fritch)

- cephadm: preserve `authorized\_keys` file during upgrade ([pr#45356](https://github.com/ceph/ceph/pull/45356), Michael Fritch)

- client: do not dump mds twice in Inode::dump() ([pr#45162](https://github.com/ceph/ceph/pull/45162), Xue Yantao)

- cls/rbd: GroupSnapshotNamespace comparator violates ordering rules ([pr#45076](https://github.com/ceph/ceph/pull/45076), Ilya Dryomov)

- cls/rgw: rgw\_dir\_suggest\_changes detects race with completion ([pr#45902](https://github.com/ceph/ceph/pull/45902), Casey Bodley)

- cmake: pass RTE\_DEVEL\_BUILD=n when building dpdk ([pr#45261](https://github.com/ceph/ceph/pull/45261), Kefu Chai)

- common: avoid pthread\_mutex\_unlock twice ([pr#45465](https://github.com/ceph/ceph/pull/45465), Dai Zhiwei)

- common: replace BitVector::NoInitAllocator with wrapper struct ([pr#45180](https://github.com/ceph/ceph/pull/45180), Casey Bodley)

- crush: cancel upmaps with up set size != pool size ([pr#43416](https://github.com/ceph/ceph/pull/43416), huangjun)

- doc/dev: update basic-workflow<span></span>.rst ([pr#46308](https://github.com/ceph/ceph/pull/46308), Zac Dover)

- doc/start: s/3/three/ in intro<span></span>.rst ([pr#46328](https://github.com/ceph/ceph/pull/46328), Zac Dover)

- doc/start: update "memory" in hardware-recs<span></span>.rst ([pr#46451](https://github.com/ceph/ceph/pull/46451), Zac Dover)

- Fixes for make check ([pr#46230](https://github.com/ceph/ceph/pull/46230), Kefu Chai, Adam C. Emerson)

- krbd: return error when no initial monitor address found ([pr#45004](https://github.com/ceph/ceph/pull/45004), Burt Holzman)

- librados: check latest osdmap on ENOENT in pool\_reverse\_lookup() ([pr#45587](https://github.com/ceph/ceph/pull/45587), Ilya Dryomov)

- librbd: bail from schedule\_request\_lock() if already lock owner ([pr#47160](https://github.com/ceph/ceph/pull/47160), Christopher Hoffman)

- librbd: fix use-after-free on ictx in list\_descendants() ([pr#45000](https://github.com/ceph/ceph/pull/45000), Ilya Dryomov, Wang ShuaiChao)

- librbd: honor FUA op flag for write\_same() in write-around cache ([pr#44992](https://github.com/ceph/ceph/pull/44992), Ilya Dryomov)

- librbd: readv/writev fix iovecs length computation overflow ([pr#45560](https://github.com/ceph/ceph/pull/45560), Jonas Pfefferle)

- librbd: track complete async operation requests ([pr#45019](https://github.com/ceph/ceph/pull/45019), Mykola Golub)

- librbd: unlink newest mirror snapshot when at capacity, bump capacity ([pr#46592](https://github.com/ceph/ceph/pull/46592), Ilya Dryomov)

- librbd: update progress for non-existent objects on deep-copy ([pr#46912](https://github.com/ceph/ceph/pull/46912), Ilya Dryomov)

- librgw: make rgw file handle versioned ([pr#45496](https://github.com/ceph/ceph/pull/45496), Xuehan Xu)

- mds: add heartbeat\_reset() in start\_files\_to\_reover() ([pr#45157](https://github.com/ceph/ceph/pull/45157), Yongseok Oh)

- mds: check rejoin\_ack\_gather before enter rejoin\_gather\_finish ([pr#45161](https://github.com/ceph/ceph/pull/45161), chencan)

- mds: directly return just after responding the link request ([pr#44624](https://github.com/ceph/ceph/pull/44624), Xiubo Li)

- mds: ensure that we send the btime in cap messages ([pr#45164](https://github.com/ceph/ceph/pull/45164), Jeff Layton)

- mds: fix possible mds\_lock not locked assert ([pr#45156](https://github.com/ceph/ceph/pull/45156), Xiubo Li)

- mds: fix seg fault in expire\_recursive ([pr#45055](https://github.com/ceph/ceph/pull/45055), 胡玮文)

- mds: ignore unknown client op when tracking op latency ([pr#44976](https://github.com/ceph/ceph/pull/44976), Venky Shankar)

- mds: mds\_oft\_prefetch\_dirfrags default to false ([pr#45015](https://github.com/ceph/ceph/pull/45015), Dan van der Ster)

- mds: progress the recover queue immediately after the inode is enqueued ([pr#45158](https://github.com/ceph/ceph/pull/45158), "Yan, Zheng", Xiubo Li)

- mds: reset the return value for heap command ([pr#45155](https://github.com/ceph/ceph/pull/45155), Xiubo Li)

- mds: skip directory size checks for reintegration ([pr#44668](https://github.com/ceph/ceph/pull/44668), Patrick Donnelly)

- mgr/cephadm: fix and improve osd draining ([pr#46645](https://github.com/ceph/ceph/pull/46645), Sage Weil)

- mgr/cephadm: try to get FQDN for active instance ([pr#46787](https://github.com/ceph/ceph/pull/46787), Tatjana Dehler)

- mgr/cephadm: try to get FQDN for configuration files ([pr#45621](https://github.com/ceph/ceph/pull/45621), Tatjana Dehler)

- mgr/dashboard: dashboard turns telemetry off when configuring report ([pr#45110](https://github.com/ceph/ceph/pull/45110), Sarthak0702, Aaryan Porwal)

- mgr/dashboard: fix "NullInjectorError: No provider for I18n ([pr#45613](https://github.com/ceph/ceph/pull/45613), Nizamudeen A)

- mgr/dashboard: fix Grafana OSD/host panels ([pr#44924](https://github.com/ceph/ceph/pull/44924), Patrick Seidensal)

- mgr/dashboard: Notification banners at the top of the UI have fixed height ([pr#44763](https://github.com/ceph/ceph/pull/44763), Waad AlKhoury)

- mgr/dashboard: Table columns hiding fix ([issue#51119](http://tracker.ceph.com/issues/51119), [pr#45726](https://github.com/ceph/ceph/pull/45726), Daniel Persson)

- mgr/devicehealth: fix missing timezone from time delta calculation ([pr#45287](https://github.com/ceph/ceph/pull/45287), Yaarit Hatuka)

- mgr/prometheus: Added `avail\_raw` field for Pools DF Prometheus mgr module ([pr#45238](https://github.com/ceph/ceph/pull/45238), Konstantin Shalygin)

- mgr/rbd\_support: cast pool\_id from int to str when collecting LevelSpec ([pr#45530](https://github.com/ceph/ceph/pull/45530), Ilya Dryomov)

- mgr/rbd\_support: fix schedule remove ([pr#45006](https://github.com/ceph/ceph/pull/45006), Sunny Kumar)

- mgr/telemetry: fix waiting for mgr to warm up ([pr#45772](https://github.com/ceph/ceph/pull/45772), Yaarit Hatuka)

- mgr/volumes: A few volumes plugin backport ([issue#51271](http://tracker.ceph.com/issues/51271), [pr#44800](https://github.com/ceph/ceph/pull/44800), Kotresh HR, Venky Shankar, Jan Fajerski)

- mgr/volumes: Fix permission during subvol creation with mode ([pr#43224](https://github.com/ceph/ceph/pull/43224), Kotresh HR)

- mgr/volumes: Fix subvolume discover during upgrade ([pr#47236](https://github.com/ceph/ceph/pull/47236), Kotresh HR)

- mgr: limit changes to pg\_num ([pr#44541](https://github.com/ceph/ceph/pull/44541), Sage Weil)

- mirror snapshot schedule and trash purge schedule fixes ([pr#46777](https://github.com/ceph/ceph/pull/46777), Ilya Dryomov)

- mon/MonCommands<span></span>.h: fix target\_size\_ratio range ([pr#45398](https://github.com/ceph/ceph/pull/45398), Kamoltat)

- mon: Abort device health when device not found ([pr#44960](https://github.com/ceph/ceph/pull/44960), Benoît Knecht)

- octopus rgw: on FIPS enabled, fix segfault performing s3 multipart PUT ([pr#46701](https://github.com/ceph/ceph/pull/46701), Mark Kogan)

- octopus rgw: under fips, set flag to allow md5 in select rgw ops ([pr#44806](https://github.com/ceph/ceph/pull/44806), Mark Kogan)

- os/bluestore: Always update the cursor position in AVL near-fit search ([pr#46687](https://github.com/ceph/ceph/pull/46687), Mark Nelson)

- osd/OSD: Log aggregated slow ops detail to cluster logs ([pr#45154](https://github.com/ceph/ceph/pull/45154), Prashant D)

- osd/OSD: osd\_fast\_shutdown\_notify\_mon not quite right ([pr#45655](https://github.com/ceph/ceph/pull/45655), Nitzan Mordechai, Satoru Takeuchi)

- osd/OSDMap: Add health warning if 'require-osd-release' != current release ([pr#44260](https://github.com/ceph/ceph/pull/44260), Sridhar Seshasayee)

- osd/OSDMapMapping: fix spurious threadpool timeout errors ([pr#44546](https://github.com/ceph/ceph/pull/44546), Sage Weil)

- osd/PGLog<span></span>.cc: Trim duplicates by number of entries ([pr#46253](https://github.com/ceph/ceph/pull/46253), Nitzan Mordechai)

- osd/PrimaryLogPG<span></span>.cc: CEPH\_OSD\_OP\_OMAPRMKEYRANGE should mark omap dirty ([pr#45593](https://github.com/ceph/ceph/pull/45593), Neha Ojha)

- osd/SnapMapper: fix pacific legacy key conversion and introduce test ([pr#47108](https://github.com/ceph/ceph/pull/47108), Manuel Lausch, Matan Breizman)

- osd: log the number of 'dups' entries in a PG Log ([pr#46609](https://github.com/ceph/ceph/pull/46609), Radoslaw Zarzynski)

- osd: require osd\_pg\_max\_concurrent\_snap\_trims > 0 ([pr#45324](https://github.com/ceph/ceph/pull/45324), Dan van der Ster)

- qa/rgw: add failing tempest test to blocklist ([pr#45437](https://github.com/ceph/ceph/pull/45437), Casey Bodley)

- qa/rgw: update apache-maven mirror for rgw/hadoop-s3a ([pr#45446](https://github.com/ceph/ceph/pull/45446), Casey Bodley)

- qa/suites/rados/thrash-erasure-code-big/thrashers: add `osd max backfills` setting to mapgap and pggrow ([pr#46392](https://github.com/ceph/ceph/pull/46392), Laura Flores)

- qa/suites: clean up client-upgrade-octopus-pacific test ([pr#45334](https://github.com/ceph/ceph/pull/45334), Ilya Dryomov)

- qa/tasks/qemu: make sure block-rbd<span></span>.so is installed ([pr#45071](https://github.com/ceph/ceph/pull/45071), Ilya Dryomov)

- qa/tasks: teuthology octopus backport ([pr#46149](https://github.com/ceph/ceph/pull/46149), Kefu Chai, Shraddha Agrawal)

- qa/tests: added upgrade-clients/client-upgrade-octopus-quincy tests ([pr#45282](https://github.com/ceph/ceph/pull/45282), Yuri Weinstein)

- qa: always format the pgid in hex ([pr#45159](https://github.com/ceph/ceph/pull/45159), Xiubo Li)

- qa: check mounts attribute in ctx ([pr#45633](https://github.com/ceph/ceph/pull/45633), Jos Collin)

- qa: remove <span></span>.teuthology\_branch file ([pr#46489](https://github.com/ceph/ceph/pull/46489), Jeff Layton)

- radosgw-admin: 'reshard list' doesn't log ENOENT errors ([pr#45452](https://github.com/ceph/ceph/pull/45452), Casey Bodley)

- radosgw-admin: 'sync status' is not behind if there are no mdlog entries ([pr#45443](https://github.com/ceph/ceph/pull/45443), Casey Bodley)

- radosgw-admin: skip GC init on read-only admin ops ([pr#45423](https://github.com/ceph/ceph/pull/45423), Mark Kogan)

- rbd-fuse: librados will filter out -r option from command-line ([pr#46952](https://github.com/ceph/ceph/pull/46952), wanwencong)

- rbd-mirror: don't prune non-primary snapshot when restarting delta sync ([pr#46589](https://github.com/ceph/ceph/pull/46589), Ilya Dryomov)

- rbd-mirror: generally skip replay/resync if remote image is not primary ([pr#46812](https://github.com/ceph/ceph/pull/46812), Ilya Dryomov)

- rbd-mirror: make mirror properly detect pool replayer needs restart ([pr#45169](https://github.com/ceph/ceph/pull/45169), Mykola Golub)

- rbd-mirror: remove bogus completed\_non\_primary\_snapshots\_exist check ([pr#47117](https://github.com/ceph/ceph/pull/47117), Ilya Dryomov)

- rbd-mirror: synchronize with in-flight stop in ImageReplayer::stop() ([pr#45177](https://github.com/ceph/ceph/pull/45177), Ilya Dryomov)

- rbd: don't default empty pool name unless namespace is specified ([pr#47142](https://github.com/ceph/ceph/pull/47142), Ilya Dryomov)

- rbd: mark optional positional arguments as such in help output ([pr#45009](https://github.com/ceph/ceph/pull/45009), Ilya Dryomov, Jason Dillaman)

- rbd: recognize rxbounce map option ([pr#45001](https://github.com/ceph/ceph/pull/45001), Ilya Dryomov)

- Revert "rocksdb: do not use non-zero recycle\_log\_file\_num setting" ([pr#47053](https://github.com/ceph/ceph/pull/47053), Laura Flores)

- revert of #46253, add tools: ceph-objectstore-tool is able to trim solely pg log dups' entries ([pr#46611](https://github.com/ceph/ceph/pull/46611), Radosław Zarzyński, Radoslaw Zarzynski)

- rgw/amqp: add default case to silence compiler warning ([pr#45479](https://github.com/ceph/ceph/pull/45479), Casey Bodley)

- rgw: add the condition of lock mode conversion to PutObjRentention ([pr#45441](https://github.com/ceph/ceph/pull/45441), wangzhong)

- rgw: bucket chown bad memory usage ([pr#45492](https://github.com/ceph/ceph/pull/45492), Mohammad Fatemipour)

- rgw: change order of xml elements in ListRoles response ([pr#45449](https://github.com/ceph/ceph/pull/45449), Casey Bodley)

- rgw: cls\_bucket\_list\_unordered() might return one redundent entry every time is\_truncated is true ([pr#45458](https://github.com/ceph/ceph/pull/45458), Peng Zhang)

- rgw: document rgw\_lc\_debug\_interval configuration option ([pr#45454](https://github.com/ceph/ceph/pull/45454), J. Eric Ivancich)

- rgw: document S3 bucket replication support ([pr#45485](https://github.com/ceph/ceph/pull/45485), Matt Benjamin)

- rgw: Dump Object Lock Retain Date as ISO 8601 ([pr#43656](https://github.com/ceph/ceph/pull/43656), Preben Berg)

- rgw: fix leak of RGWBucketList memory (octopus only) ([pr#45283](https://github.com/ceph/ceph/pull/45283), Casey Bodley)

- rgw: fix md5 not match for RGWBulkUploadOp upload when enable rgw com… ([pr#45433](https://github.com/ceph/ceph/pull/45433), yuliyang_yewu)

- rgw: fix segfault in UserAsyncRefreshHandler::init\_fetch ([pr#45412](https://github.com/ceph/ceph/pull/45412), Cory Snyder)

- rgw: have "bucket check --fix" fix pool ids correctly ([pr#45456](https://github.com/ceph/ceph/pull/45456), J. Eric Ivancich)

- rgw: init bucket index only if putting bucket instance info succeeds ([pr#45481](https://github.com/ceph/ceph/pull/45481), Huber-ming)

- rgw: parse tenant name out of rgwx-bucket-instance ([pr#45523](https://github.com/ceph/ceph/pull/45523), Casey Bodley)

- rgw: resolve empty ordered bucket listing results w/ CLS filtering \*and\* bucket index list produces incorrect result when non-ascii entries ([pr#45088](https://github.com/ceph/ceph/pull/45088), J. Eric Ivancich)

- rgw: return OK on consecutive complete-multipart reqs ([pr#45488](https://github.com/ceph/ceph/pull/45488), Mark Kogan)

- rgw: RGWCoroutine::set\_sleeping() checks for null stack ([pr#46042](https://github.com/ceph/ceph/pull/46042), Or Friedmann, Casey Bodley)

- rgw: RGWPostObj::execute() may lost data ([pr#45503](https://github.com/ceph/ceph/pull/45503), Lei Zhang)

- rgw: url\_decode before parsing copysource in copyobject ([issue#43259](http://tracker.ceph.com/issues/43259), [pr#45431](https://github.com/ceph/ceph/pull/45431), Paul Reece)

- rgw:When KMS encryption is used and the key does not exist, we should… ([pr#45462](https://github.com/ceph/ceph/pull/45462), wangyingbin)

- rgwlc: fix segfault resharding during lc ([pr#46745](https://github.com/ceph/ceph/pull/46745), Mark Kogan)

- rocksdb: do not use non-zero recycle\_log\_file\_num setting ([pr#45040](https://github.com/ceph/ceph/pull/45040), Igor Fedotov)

- src/rgw: Fix for malformed url ([pr#45460](https://github.com/ceph/ceph/pull/45460), Kalpesh Pandya)

- test/bufferlist: ensure rebuild\_aligned\_size\_and\_memory() always rebuilds ([pr#46216](https://github.com/ceph/ceph/pull/46216), Radoslaw Zarzynski)

- test/librbd: add test to verify diff\_iterate size ([pr#45554](https://github.com/ceph/ceph/pull/45554), Christopher Hoffman)

- test: fix wrong alarm (HitSetWrite) ([pr#45320](https://github.com/ceph/ceph/pull/45320), Myoungwon Oh)

- tools/rbd: expand where option rbd\_default\_map\_options can be set ([pr#45182](https://github.com/ceph/ceph/pull/45182), Christopher Hoffman, Ilya Dryomov)
