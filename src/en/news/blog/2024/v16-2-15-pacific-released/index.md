---
title: "v16.2.15 Pacific released"
date: "2024-03-04"
author: "Yuri Weinstein"
tags:
  - "release"
  - "pacific"
---

This is the fifteenth, and expected to be last, backport release in the Pacific series.

## Notable Changes

* `ceph config dump --format <json|xml>` output will display the localized
  option names instead of their normalized version. For example,
  "mgr/prometheus/x/server\_port" will be displayed instead of
  "mgr/prometheus/server\_port". This matches the output of the non pretty-print
  formatted version of the command.

* CephFS: MDS evicts clients who are not advancing their request tids, which causes
  a large buildup of session metadata, resulting in the MDS going read-only due to
  the RADOS operation exceeding the size threshold. The `mds_session_metadata_threshold`
  config controls the maximum size that an (encoded) session metadata can grow.

* RADOS: The `get_pool_is_selfmanaged_snaps_mode` C++ API has been deprecated
  due to its susceptibility to false negative results.  Its safer replacement is
  `pool_is_in_selfmanaged_snaps_mode`.

* RBD: When diffing against the beginning of time (`fromsnapname == NULL`) in
  fast-diff mode (`whole_object == true` with `fast-diff` image feature enabled
  and valid), diff-iterate is now guaranteed to execute locally if exclusive
  lock is available.  This brings a dramatic performance improvement for QEMU
  live disk synchronization and backup use cases.

## Changelog


- [CVE-2023-43040] rgw: Fix bucket validation against POST policies ([pr#53758](https://github.com/ceph/ceph/pull/53758), Joshua Baergen)

- admin/doc-requirements: bump Sphinx to 5<span></span>.0<span></span>.2 ([pr#55258](https://github.com/ceph/ceph/pull/55258), Nizamudeen A)

- blk/kernel: Add O\_EXCL for block devices ([pr#53567](https://github.com/ceph/ceph/pull/53567), Adam Kupczyk)

- Bluestore: fix bluestore collection\_list latency perf counter ([pr#52949](https://github.com/ceph/ceph/pull/52949), Wangwenjuan)

- bluestore: Fix problem with volume selector ([pr#53587](https://github.com/ceph/ceph/pull/53587), Adam Kupczyk)

- ceph-volume,python-common: Data allocate fraction ([pr#53581](https://github.com/ceph/ceph/pull/53581), Jonas Pfefferle)

- ceph-volume: add --osd-id option to raw prepare ([pr#52928](https://github.com/ceph/ceph/pull/52928), Guillaume Abrioux)

- ceph-volume: fix a bug in \_check\_generic\_reject\_reasons ([pr#54707](https://github.com/ceph/ceph/pull/54707), Kim Minjong, Guillaume Abrioux, Michael English)

- ceph-volume: fix raw list for lvm devices ([pr#52981](https://github.com/ceph/ceph/pull/52981), Guillaume Abrioux)

- ceph-volume: fix zap\_partitions() in devices<span></span>.lvm<span></span>.zap ([pr#55658](https://github.com/ceph/ceph/pull/55658), Guillaume Abrioux)

- ceph-volume: fix zap\_partitions() in devices<span></span>.lvm<span></span>.zap ([pr#55481](https://github.com/ceph/ceph/pull/55481), Guillaume Abrioux)

- ceph-volume: fixes fallback to stat in is\_device and is\_partition ([pr#54709](https://github.com/ceph/ceph/pull/54709), Guillaume Abrioux, Teoman ONAY)

- ceph: allow xlock state to be LOCK\_PREXLOCK when putting it ([pr#53662](https://github.com/ceph/ceph/pull/53662), Xiubo Li)

- cephadm: add tcmu-runner to logrotate config ([pr#53975](https://github.com/ceph/ceph/pull/53975), Adam King)

- cephadm: Adding support to configure public\_network cfg section ([pr#52411](https://github.com/ceph/ceph/pull/52411), Redouane Kachach)

- cephadm: allow ports to be opened in firewall during adoption, reconfig, redeploy ([pr#52083](https://github.com/ceph/ceph/pull/52083), Adam King)

- cephadm: make custom\_configs work for tcmu-runner container ([pr#53469](https://github.com/ceph/ceph/pull/53469), Adam King)

- cephadm: run tcmu-runner through script to do restart on failure ([pr#53977](https://github.com/ceph/ceph/pull/53977), Adam King, Raimund Sacherer)

- cephfs-journal-tool: disambiguate usage of all keyword (in tool help) ([pr#53645](https://github.com/ceph/ceph/pull/53645), Manish M Yathnalli)

- cephfs-mirror: do not run concurrent C\_RestartMirroring context ([issue#62072](http://tracker.ceph.com/issues/62072), [pr#53640](https://github.com/ceph/ceph/pull/53640), Venky Shankar)

- cephfs-top: include the missing fields in --dump output ([pr#53453](https://github.com/ceph/ceph/pull/53453), Jos Collin)

- cephfs: upgrade cephfs-shell's path wherever necessary ([pr#54144](https://github.com/ceph/ceph/pull/54144), Rishabh Dave)

- cephfs\_mirror: correctly set top level dir permissions ([pr#53270](https://github.com/ceph/ceph/pull/53270), Milind Changire)

- client: always refresh mds feature bits on session open ([issue#63188](http://tracker.ceph.com/issues/63188), [pr#54245](https://github.com/ceph/ceph/pull/54245), Venky Shankar)

- client: fix sync fs to force flush mdlog for all sessions ([pr#53981](https://github.com/ceph/ceph/pull/53981), Xiubo Li)

- client: issue a cap release immediately if no cap exists ([pr#52852](https://github.com/ceph/ceph/pull/52852), Xiubo Li)

- client: queue a delay cap flushing if there are ditry caps/snapcaps ([pr#54472](https://github.com/ceph/ceph/pull/54472), Xiubo Li)

- cmake/modules/BuildRocksDB<span></span>.cmake: inherit parent's CMAKE\_CXX\_FLAGS ([pr#55500](https://github.com/ceph/ceph/pull/55500), Kefu Chai)

- common/weighted\_shuffle: don't feed std::discrete\_distribution with all-zero weights ([pr#55155](https://github.com/ceph/ceph/pull/55155), Radosław Zarzyński)

- common:  intrusive\_lru destructor add ([pr#54558](https://github.com/ceph/ceph/pull/54558), Ali Maredia)

- doc/cephfs: note regarding start time time zone ([pr#53576](https://github.com/ceph/ceph/pull/53576), Milind Changire)

- doc/cephfs: write cephfs commands fully in docs ([pr#53403](https://github.com/ceph/ceph/pull/53403), Rishabh Dave)

- doc/rados/configuration/bluestore-config-ref: Fix lowcase typo ([pr#54696](https://github.com/ceph/ceph/pull/54696), Adam Kupczyk)

- doc/rados: update config for autoscaler ([pr#55440](https://github.com/ceph/ceph/pull/55440), Zac Dover)

- doc: clarify use of `rados rm` command ([pr#51260](https://github.com/ceph/ceph/pull/51260), J. Eric Ivancich)

- doc: discuss the standard multi-tenant CephFS security model ([pr#53560](https://github.com/ceph/ceph/pull/53560), Greg Farnum)

- Fixing example of BlueStore resharding ([pr#54474](https://github.com/ceph/ceph/pull/54474), Adam Kupczyk)

- isa-l: incorporate fix for aarch64 text relocation ([pr#51314](https://github.com/ceph/ceph/pull/51314), luo rixin)

- libcephsqlite: fill 0s in unread portion of buffer ([pr#53103](https://github.com/ceph/ceph/pull/53103), Patrick Donnelly)

- librados: make querying pools for selfmanaged snaps reliable ([pr#55024](https://github.com/ceph/ceph/pull/55024), Ilya Dryomov)

- librbd: Append one journal event per image request ([pr#54820](https://github.com/ceph/ceph/pull/54820), Joshua Baergen)

- librbd: don't report HOLE\_UPDATED when diffing against a hole ([pr#54949](https://github.com/ceph/ceph/pull/54949), Ilya Dryomov)

- librbd: fix regressions in ObjectListSnapsRequest ([pr#54860](https://github.com/ceph/ceph/pull/54860), Ilya Dryomov)

- librbd: improve rbd\_diff\_iterate2() performance in fast-diff mode ([pr#55256](https://github.com/ceph/ceph/pull/55256), Ilya Dryomov)

- librbd: kick ExclusiveLock state machine on client being blocklisted when waiting for lock ([pr#53295](https://github.com/ceph/ceph/pull/53295), Ramana Raja)

- librbd: make CreatePrimaryRequest remove any unlinked mirror snapshots ([pr#53274](https://github.com/ceph/ceph/pull/53274), Ilya Dryomov)

- log: fix the formatting when dumping thread IDs ([pr#53465](https://github.com/ceph/ceph/pull/53465), Radoslaw Zarzynski)

- log: Make log\_max\_recent have an effect again ([pr#48311](https://github.com/ceph/ceph/pull/48311), Joshua Baergen)

- make-dist: don't use --continue option for wget ([pr#55090](https://github.com/ceph/ceph/pull/55090), Casey Bodley)

- make-dist: download liburing from kernel<span></span>.io instead of github ([pr#53197](https://github.com/ceph/ceph/pull/53197), Laura Flores)

- MClientRequest: properly handle ceph\_mds\_request\_head\_legacy for ext\_num\_retry, ext\_num\_fwd, owner\_uid, owner\_gid ([pr#54410](https://github.com/ceph/ceph/pull/54410), Alexander Mikhalitsyn)

- mds,qa: some balancer debug messages (<=5) not printed when debug\_mds is >=5 ([pr#53552](https://github.com/ceph/ceph/pull/53552), Patrick Donnelly)

- mds/Server: mark a cap acquisition throttle event in the request ([pr#53169](https://github.com/ceph/ceph/pull/53169), Leonid Usov)

- mds: acquire inode snaplock in open ([pr#53185](https://github.com/ceph/ceph/pull/53185), Patrick Donnelly)

- mds: add event for batching getattr/lookup ([pr#53556](https://github.com/ceph/ceph/pull/53556), Patrick Donnelly)

- mds: adjust pre\_segments\_size for MDLog when trimming segments for st… ([issue#59833](http://tracker.ceph.com/issues/59833), [pr#54033](https://github.com/ceph/ceph/pull/54033), Venky Shankar)

- mds: blocklist clients with "bloated" session metadata ([issue#61947](http://tracker.ceph.com/issues/61947), [issue#62873](http://tracker.ceph.com/issues/62873), [pr#53634](https://github.com/ceph/ceph/pull/53634), Venky Shankar)

- mds: drop locks and retry when lock set changes ([pr#53243](https://github.com/ceph/ceph/pull/53243), Patrick Donnelly)

- mds: ensure next replay is queued on req drop ([pr#54314](https://github.com/ceph/ceph/pull/54314), Patrick Donnelly)

- mds: fix deadlock between unlinking and linkmerge ([pr#53495](https://github.com/ceph/ceph/pull/53495), Xiubo Li)

- mds: fix issuing redundant reintegrate/migrate\_stray requests ([pr#54517](https://github.com/ceph/ceph/pull/54517), Xiubo Li)

- mds: log message when exiting due to asok command ([pr#53550](https://github.com/ceph/ceph/pull/53550), Patrick Donnelly)

- mds: replacing bootstrap session only if handle client session message ([pr#53362](https://github.com/ceph/ceph/pull/53362), Mer Xuanyi)

- mds: report clients laggy due laggy OSDs only after checking any OSD is laggy ([pr#54120](https://github.com/ceph/ceph/pull/54120), Dhairya Parmar)

- mds: set the loner to true for LOCK\_EXCL\_XSYN ([pr#54912](https://github.com/ceph/ceph/pull/54912), Xiubo Li)

- mds: use variable g\_ceph\_context directly in MDSAuthCaps ([pr#52821](https://github.com/ceph/ceph/pull/52821), Rishabh Dave)

- mgr/BaseMgrModule: Optimize CPython Call in Finish Function ([pr#55109](https://github.com/ceph/ceph/pull/55109), Nitzan Mordechai)

- mgr/cephadm: Add "networks" parameter to orch apply rgw ([pr#53974](https://github.com/ceph/ceph/pull/53974), Teoman ONAY)

- mgr/cephadm: ceph orch add fails when ipv6 address is surrounded by square brackets ([pr#53978](https://github.com/ceph/ceph/pull/53978), Teoman ONAY)

- mgr/dashboard: add 'omit\_usage' query param to dashboard api 'get rbd' endpoint ([pr#54192](https://github.com/ceph/ceph/pull/54192), Cory Snyder)

- mgr/dashboard: allow tls 1<span></span>.2 with a config option ([pr#53781](https://github.com/ceph/ceph/pull/53781), Nizamudeen A)

- mgr/dashboard: Consider null values as zero in grafana panels ([pr#54542](https://github.com/ceph/ceph/pull/54542), Aashish Sharma)

- mgr/dashboard: fix CephPGImbalance alert ([pr#49478](https://github.com/ceph/ceph/pull/49478), Aashish Sharma)

- mgr/dashboard: Fix CephPoolGrowthWarning alert ([pr#49477](https://github.com/ceph/ceph/pull/49477), Aashish Sharma)

- mgr/dashboard: fix constraints<span></span>.txt ([pr#54652](https://github.com/ceph/ceph/pull/54652), Ernesto Puerta)

- mgr/dashboard: fix rgw page issues when hostname not resolvable ([pr#53215](https://github.com/ceph/ceph/pull/53215), Nizamudeen A)

- mgr/dashboard: set CORS header for unauthorized access ([pr#53202](https://github.com/ceph/ceph/pull/53202), Nizamudeen A)

- mgr/prometheus: avoid duplicates and deleted entries for rbd\_stats\_pools ([pr#48524](https://github.com/ceph/ceph/pull/48524), Avan Thakkar)

- mgr/prometheus: change pg\_repaired\_objects name to pool\_repaired\_objects ([pr#48439](https://github.com/ceph/ceph/pull/48439), Pere Diaz Bou)

- mgr/prometheus: fix pool\_objects\_repaired and daemon\_health\_metrics format ([pr#51692](https://github.com/ceph/ceph/pull/51692), banuchka)

- mgr/rbd\_support: fix recursive locking on CreateSnapshotRequests lock ([pr#54293](https://github.com/ceph/ceph/pull/54293), Ramana Raja)

- mgr/snap-schedule: use the right way to check the result returned by… ([pr#53355](https://github.com/ceph/ceph/pull/53355), Mer Xuanyi)

- mgr/snap\_schedule: allow retention spec 'n' to be user defined ([pr#52750](https://github.com/ceph/ceph/pull/52750), Milind Changire, Jakob Haufe)

- mgr/volumes: Fix pending\_subvolume\_deletions in volume info ([pr#53574](https://github.com/ceph/ceph/pull/53574), Kotresh HR)

- mgr: Add one finisher thread per module ([pr#51045](https://github.com/ceph/ceph/pull/51045), Kotresh HR, Patrick Donnelly)

- mgr: add throttle policy for DaemonServer ([pr#54013](https://github.com/ceph/ceph/pull/54013), ericqzhao)

- mgr: don't dump global config holding gil ([pr#50194](https://github.com/ceph/ceph/pull/50194), Mykola Golub)

- mgr: fix a race condition in DaemonServer::handle\_report() ([pr#52993](https://github.com/ceph/ceph/pull/52993), Radoslaw Zarzynski)

- mgr: register OSDs in ms\_handle\_accept ([pr#53189](https://github.com/ceph/ceph/pull/53189), Patrick Donnelly)

- mgr: remove out&down osd from mgr daemons ([pr#54553](https://github.com/ceph/ceph/pull/54553), shimin)

- mon/ConfigMonitor: Show localized name in "config dump --format json" output ([pr#53984](https://github.com/ceph/ceph/pull/53984), Sridhar Seshasayee)

- mon/MonClient: resurrect original client\_mount\_timeout handling ([pr#52533](https://github.com/ceph/ceph/pull/52533), Ilya Dryomov)

- mon/Monitor<span></span>.cc: exit function if !osdmon()->is\_writeable() && mon/OSDMonitor: Added extra check before mon<span></span>.go\_recovery\_stretch\_mode() ([pr#51414](https://github.com/ceph/ceph/pull/51414), Kamoltat)

- mon/Monitor: during shutdown don't accept new authentication and crea… ([pr#55113](https://github.com/ceph/ceph/pull/55113), Nitzan Mordechai)

- mon: add exception handling to ceph health mute ([pr#55118](https://github.com/ceph/ceph/pull/55118), Daniel Radjenovic)

- mon: add proxy to cache tier options ([pr#50552](https://github.com/ceph/ceph/pull/50552), tan changzhi)

- mon: fix health store size growing infinitely ([pr#55472](https://github.com/ceph/ceph/pull/55472), Wei Wang)

- mon: fix iterator mishandling in PGMap::apply\_incremental ([pr#52555](https://github.com/ceph/ceph/pull/52555), Oliver Schmidt)

- mon: fix mds metadata lost in one case ([pr#54318](https://github.com/ceph/ceph/pull/54318), shimin)

- msg/async: initialize worker in RDMAStack::create\_worker() and drop Stack::num\_workers ([pr#55443](https://github.com/ceph/ceph/pull/55443), Kefu Chai)

- msg/AsyncMessenger: re-evaluate the stop condition when woken up in 'wait()' ([pr#53716](https://github.com/ceph/ceph/pull/53716), Leonid Usov)

- nofail option in fstab not supported ([pr#52987](https://github.com/ceph/ceph/pull/52987), Leonid Usov)

- os/bluestore: don't require bluestore\_db\_block\_size when attaching new ([pr#52948](https://github.com/ceph/ceph/pull/52948), Igor Fedotov)

- os/bluestore: get rid off resulting lba alignment in allocators ([pr#54434](https://github.com/ceph/ceph/pull/54434), Igor Fedotov)

- osd,bluestore: gracefully handle a failure during meta collection load ([pr#53135](https://github.com/ceph/ceph/pull/53135), Igor Fedotov)

- osd/OpRequest: Add detail description for delayed op in osd log file ([pr#53693](https://github.com/ceph/ceph/pull/53693), Yite Gu)

- osd/OSD: introduce reset\_purged\_snaps\_last ([pr#53970](https://github.com/ceph/ceph/pull/53970), Matan Breizman)

- osd/OSDMap: Check for uneven weights & != 2 buckets post stretch mode ([pr#52459](https://github.com/ceph/ceph/pull/52459), Kamoltat)

- osd/scrub: Fix scrub starts messages spamming the cluster log ([pr#53430](https://github.com/ceph/ceph/pull/53430), Prashant D)

- osd: don't require RWEXCL lock for stat+write ops ([pr#54593](https://github.com/ceph/ceph/pull/54593), Alice Zhao)

- osd: ensure async recovery does not drop a pg below min\_size ([pr#54548](https://github.com/ceph/ceph/pull/54548), Samuel Just)

- osd: fix shard-threads cannot wakeup bug ([pr#51262](https://github.com/ceph/ceph/pull/51262), Jianwei Zhang)

- osd: fix use-after-move in build\_incremental\_map\_msg() ([pr#54268](https://github.com/ceph/ceph/pull/54268), Ronen Friedman)

- osd: log the number of extents for sparse read ([pr#54604](https://github.com/ceph/ceph/pull/54604), Xiubo Li)

- pacifc: Revert "mgr/dashboard: unselect rows in datatables" ([pr#55415](https://github.com/ceph/ceph/pull/55415), Nizamudeen A)

- pybind/mgr/autoscaler: Donot show NEW PG\_NUM value if autoscaler is not on ([pr#53464](https://github.com/ceph/ceph/pull/53464), Prashant D)

- pybind/mgr/mgr\_util: fix to\_pretty\_timedelta() ([pr#51243](https://github.com/ceph/ceph/pull/51243), Sage Weil)

- pybind/mgr/volumes: log mutex locks to help debug deadlocks ([pr#53916](https://github.com/ceph/ceph/pull/53916), Kotresh HR)

- pybind/mgr: ceph osd status crash with ZeroDivisionError ([pr#46696](https://github.com/ceph/ceph/pull/46696), Nitzan Mordechai, Kefu Chai)

- pybind/rados: don't close watch in dealloc if already closed ([pr#51259](https://github.com/ceph/ceph/pull/51259), Tim Serong)

- pybind/rados: fix missed changes for PEP484 style type annotations ([pr#54361](https://github.com/ceph/ceph/pull/54361), Igor Fedotov)

- pybind/rbd: don't produce info on errors in aio\_mirror\_image\_get\_info() ([pr#54053](https://github.com/ceph/ceph/pull/54053), Ilya Dryomov)

- python-common/drive\_group: handle fields outside of 'spec' even when 'spec' is provided ([pr#52413](https://github.com/ceph/ceph/pull/52413), Adam King)

- python-common/drive\_selection: lower log level of limit policy message ([pr#52412](https://github.com/ceph/ceph/pull/52412), Adam King)

- qa/distros: backport update from rhel 8<span></span>.4 -> 8<span></span>.6 ([pr#54901](https://github.com/ceph/ceph/pull/54901), Casey Bodley, David Galloway)

- qa/suites/krbd: stress test for recovering from watch errors ([pr#53784](https://github.com/ceph/ceph/pull/53784), Ilya Dryomov)

- qa/suites/orch: whitelist warnings that are expected in test environments ([pr#55523](https://github.com/ceph/ceph/pull/55523), Laura Flores)

- qa/suites/rbd: add test to check rbd\_support module recovery ([pr#54294](https://github.com/ceph/ceph/pull/54294), Ramana Raja)

- qa/suites/upgrade/pacific-p2p: run librbd python API tests from pacific tip ([pr#55418](https://github.com/ceph/ceph/pull/55418), Yuri Weinstein)

- qa/suites/upgrade/pacific-p2p: skip TestClsRbd<span></span>.mirror\_snapshot test ([pr#53204](https://github.com/ceph/ceph/pull/53204), Ilya Dryomov)

- qa/suites: added more whitelisting + fix typo ([pr#55717](https://github.com/ceph/ceph/pull/55717), Kamoltat)

- qa/tasks/cephadm: enable mon\_cluster\_log\_to\_file ([pr#55429](https://github.com/ceph/ceph/pull/55429), Dan van der Ster)

- qa/upgrade: disable a failing ceph\_test\_cls\_cmpomap test case ([pr#55519](https://github.com/ceph/ceph/pull/55519), Casey Bodley)

- qa/upgrade: use ragweed branch for starting ceph release ([pr#55382](https://github.com/ceph/ceph/pull/55382), Casey Bodley)

- qa/workunits/rbd/cli\_generic<span></span>.sh: narrow race window when checking that rbd\_support module command fails after blocklisting the module's client ([pr#54771](https://github.com/ceph/ceph/pull/54771), Ramana Raja)

- qa: assign file system affinity for replaced MDS ([issue#61764](http://tracker.ceph.com/issues/61764), [pr#54039](https://github.com/ceph/ceph/pull/54039), Venky Shankar)

- qa: ignore expected cluster warning from damage tests ([pr#53486](https://github.com/ceph/ceph/pull/53486), Patrick Donnelly)

- qa: lengthen shutdown timeout for thrashed MDS ([pr#53555](https://github.com/ceph/ceph/pull/53555), Patrick Donnelly)

- qa: pass arg as list to fix test case failure ([pr#52763](https://github.com/ceph/ceph/pull/52763), Dhairya Parmar)

- qa: remove duplicate import ([pr#53447](https://github.com/ceph/ceph/pull/53447), Patrick Donnelly)

- qa: run kernel\_untar\_build with newer tarball ([pr#54713](https://github.com/ceph/ceph/pull/54713), Milind Changire)

- qa: wait for file to have correct size ([pr#52744](https://github.com/ceph/ceph/pull/52744), Patrick Donnelly)

- rados: build minimally when "WITH\_MGR" is off ([pr#51250](https://github.com/ceph/ceph/pull/51250), J. Eric Ivancich)

- rados: increase osd\_max\_write\_op\_reply\_len default to 64 bytes ([pr#53470](https://github.com/ceph/ceph/pull/53470), Matt Benjamin)

- RadosGW API: incorrect bucket quota in response to HEAD /{bucket}/?usage ([pr#53439](https://github.com/ceph/ceph/pull/53439), shreyanshjain7174)

- radosgw-admin: allow 'bi purge' to delete index if entrypoint doesn't exist ([pr#54010](https://github.com/ceph/ceph/pull/54010), Casey Bodley)

- radosgw-admin: don't crash on --placement-id without --storage-class ([pr#53474](https://github.com/ceph/ceph/pull/53474), Casey Bodley)

- radosgw-admin: fix segfault on pipe modify without source/dest zone specified ([pr#51256](https://github.com/ceph/ceph/pull/51256), caisan)

- rbd-nbd: fix stuck with disable request ([pr#54256](https://github.com/ceph/ceph/pull/54256), Prasanna Kumar Kalever)

- rgw - Fix NoSuchTagSet error ([pr#50533](https://github.com/ceph/ceph/pull/50533), Daniel Gryniewicz)

- rgw/auth: ignoring signatures for HTTP OPTIONS calls ([pr#55550](https://github.com/ceph/ceph/pull/55550), Tobias Urdin)

- rgw/beast: add max\_header\_size option with 16k default, up from 4k ([pr#52113](https://github.com/ceph/ceph/pull/52113), Casey Bodley)

- rgw/keystone: EC2Engine uses reject() for ERR\_SIGNATURE\_NO\_MATCH ([pr#53764](https://github.com/ceph/ceph/pull/53764), Casey Bodley)

- rgw/notification: remove non x-amz-meta-\* attributes from bucket notifications ([pr#53376](https://github.com/ceph/ceph/pull/53376), Juan Zhu)

- rgw/putobj: RadosWriter uses part head object for multipart parts ([pr#55586](https://github.com/ceph/ceph/pull/55586), Casey Bodley)

- rgw/s3: ListObjectsV2 returns correct object owners ([pr#54160](https://github.com/ceph/ceph/pull/54160), Casey Bodley)

- rgw/sts: AssumeRole no longer writes to user metadata ([pr#52051](https://github.com/ceph/ceph/pull/52051), Casey Bodley)

- rgw/sts: code for returning an error when an IAM policy ([pr#44462](https://github.com/ceph/ceph/pull/44462), Pritha Srivastava)

- rgw/sts: code to fetch certs using <span></span>.well-known/openid-configuration URL ([pr#44464](https://github.com/ceph/ceph/pull/44464), Pritha Srivastava)

- rgw/sts: createbucket op should take session\_policies into account ([pr#44476](https://github.com/ceph/ceph/pull/44476), Pritha Srivastava)

- rgw/sts: fix read\_obj\_policy permission evaluation ([pr#44471](https://github.com/ceph/ceph/pull/44471), Pritha Srivastava)

- rgw/sts: fixes getsessiontoken authenticated with LDAP ([pr#44463](https://github.com/ceph/ceph/pull/44463), Pritha Srivastava)

- rgw/swift: check position of first slash in slo manifest files ([pr#51600](https://github.com/ceph/ceph/pull/51600), Marcio Roberto Starke)

- rgw/sync-policy: Correct "sync status" & "sync group" commands ([pr#53410](https://github.com/ceph/ceph/pull/53410), Soumya Koduri)

- rgw: 'bucket check' deletes index of multipart meta when its pending\_map is nonempty ([pr#54016](https://github.com/ceph/ceph/pull/54016), Huber-ming)

- rgw: add radosgw-admin bucket check olh/unlinked commands ([pr#53808](https://github.com/ceph/ceph/pull/53808), Cory Snyder)

- rgw: Avoid segfault when OPA authz is enabled ([pr#46106](https://github.com/ceph/ceph/pull/46106), Benoît Knecht)

- rgw: beast frontend checks for local\_endpoint() errors ([pr#54167](https://github.com/ceph/ceph/pull/54167), Casey Bodley)

- rgw: Drain async\_processor request queue during shutdown ([pr#53472](https://github.com/ceph/ceph/pull/53472), Soumya Koduri)

- rgw: fix 2 null versionID after convert\_plain\_entry\_to\_versioned ([pr#53400](https://github.com/ceph/ceph/pull/53400), rui ma, zhuo li)

- rgw: Fix Browser POST content-length-range min value ([pr#52936](https://github.com/ceph/ceph/pull/52936), Robin H. Johnson)

- rgw: fix FP error when calculating enteries per bi shard ([pr#53593](https://github.com/ceph/ceph/pull/53593), J. Eric Ivancich)

- rgw: fix rgw cache invalidation after unregister\_watch() error ([pr#54014](https://github.com/ceph/ceph/pull/54014), lichaochao)

- rgw: fix SignatureDoesNotMatch when extra headers start with 'x-amz' ([pr#53772](https://github.com/ceph/ceph/pull/53772), rui ma)

- rgw: Fix truncated ListBuckets response ([pr#49526](https://github.com/ceph/ceph/pull/49526), Joshua Baergen)

- rgw: fix unwatch crash at radosgw startup ([pr#53759](https://github.com/ceph/ceph/pull/53759), lichaochao)

- rgw: fix UploadPartCopy error code when src object not exist and src bucket not exist ([pr#53356](https://github.com/ceph/ceph/pull/53356), yuliyang)

- rgw: handle http options CORS with v4 auth ([pr#53416](https://github.com/ceph/ceph/pull/53416), Tobias Urdin)

- rgw: improve buffer list utilization in the chunkupload scenario ([pr#53775](https://github.com/ceph/ceph/pull/53775), liubingrun)

- rgw: multisite data log flag not used ([pr#52055](https://github.com/ceph/ceph/pull/52055), J. Eric Ivancich)

- rgw: pick http\_date in case of http\_x\_amz\_date absence ([pr#53443](https://github.com/ceph/ceph/pull/53443), Seena Fallah, Mohamed Awnallah)

- rgw: prevent spurious/lost notifications in the index completion thread ([pr#49093](https://github.com/ceph/ceph/pull/49093), Casey Bodley, Yuval Lifshitz)

- rgw: retry metadata cache notifications with INVALIDATE\_OBJ ([pr#52797](https://github.com/ceph/ceph/pull/52797), Casey Bodley)

- rgw: s3 object lock avoids overflow in retention date ([pr#52605](https://github.com/ceph/ceph/pull/52605), Casey Bodley)

- rgw: s3website doesn't prefetch for web\_dir() check ([pr#53769](https://github.com/ceph/ceph/pull/53769), Casey Bodley)

- rgw: set keys from from master zone on admin api user create ([pr#51602](https://github.com/ceph/ceph/pull/51602), Ali Maredia)

- rgw: Solving the issue of not populating etag in Multipart upload result ([pr#51445](https://github.com/ceph/ceph/pull/51445), Ali Masarwa)

- rgw: swift : check for valid key in POST forms ([pr#52729](https://github.com/ceph/ceph/pull/52729), Abhishek Lekshmanan)

- rgw: Update "CEPH\_RGW\_DIR\_SUGGEST\_LOG\_OP" for remove entries ([pr#50540](https://github.com/ceph/ceph/pull/50540), Soumya Koduri)

- rgw: use unique\_ptr for flat\_map emplace in BucketTrimWatche ([pr#52996](https://github.com/ceph/ceph/pull/52996), Vedansh Bhartia)

- rgwlc: prevent lc for one bucket from exceeding time budget ([pr#53562](https://github.com/ceph/ceph/pull/53562), Matt Benjamin)

- test/lazy-omap-stats: Various enhancements ([pr#50518](https://github.com/ceph/ceph/pull/50518), Brad Hubbard)

- test/librbd: avoid config-related crashes in DiscardWithPruneWriteOverlap ([pr#54859](https://github.com/ceph/ceph/pull/54859), Ilya Dryomov)

- test/store\_test: adjust physical extents to inject error against ([pr#54782](https://github.com/ceph/ceph/pull/54782), Igor Fedotov)

- tools/ceph\_objectstore\_tool: action\_on\_all\_objects\_in\_pg to skip pgmeta ([pr#54691](https://github.com/ceph/ceph/pull/54691), Matan Breizman)

- tools/ceph\_objectstore\_tool: Support get/set/superblock ([pr#55013](https://github.com/ceph/ceph/pull/55013), Matan Breizman)

- tools/osdmaptool: fix possible segfaults when there are down osds ([pr#52203](https://github.com/ceph/ceph/pull/52203), Mykola Golub)

- Tools/rados: Improve Error Messaging for Object Name Resolution ([pr#55111](https://github.com/ceph/ceph/pull/55111), Nitzan Mordechai)

- vstart\_runner: maintain log level when --debug is passed ([pr#52977](https://github.com/ceph/ceph/pull/52977), Rishabh Dave)

- vstart\_runner: use FileNotFoundError when os<span></span>.stat() fails ([pr#52978](https://github.com/ceph/ceph/pull/52978), Rishabh Dave)

- win32\_deps\_build<span></span>.sh: change Boost URL ([pr#55086](https://github.com/ceph/ceph/pull/55086), Lucian Petrut)
