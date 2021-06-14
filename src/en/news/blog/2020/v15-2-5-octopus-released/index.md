---
title: "v15.2.5 Octopus released"
date: "2020-09-16"
author: "TheAnalyst"
---

This is the fifth release of the Ceph Octopus stable release series. This release brings a range of fixes across all components. We recommend that all Octopus users upgrade to this release.

## Notable Changes[¶](#notable-changes "Permalink to this headline")

- CephFS: Automatic static subtree partitioning policies may now be configured using the new distributed and random ephemeral pinning extended attributes on directories. See the documentation for more information: [https://docs.ceph.com/docs/master/cephfs/multimds/](https://docs.ceph.com/docs/master/cephfs/multimds/)
    
- Monitors now have a config option `mon_osd_warn_num_repaired`, 10 by default. If any OSD has repaired more than this many I/O errors in stored data a `OSD_TOO_MANY_REPAIRS` health warning is generated.
    
- Now when noscrub and/or no deep-scrub flags are set globally or per pool, scheduled scrubs of the type disabled will be aborted. All user initiated scrubs are NOT interrupted.
    
- Fix an issue with osdmaps not being trimmed in a healthy cluster ( [issue#47297](https://tracker.ceph.com/issues/47297), [pr#36981](https://github.com/ceph/ceph/pull/36981))
    

## Changelog[¶](#changelog "Permalink to this headline")

- bluestore,core: bluestore: blk:BlockDevice.cc: use pending\_aios instead of iovec size as ios num ([pr#36668](https://github.com/ceph/ceph/pull/36668), weixinwei)
    
- bluestore,tests: test/store\_test: refactor bluestore spillover test ([pr#34943](https://github.com/ceph/ceph/pull/34943), Igor Fedotov)
    
- bluestore,tests: tests: objectstore/store\_test: kill ExcessiveFragmentation test case ([pr#36049](https://github.com/ceph/ceph/pull/36049), Igor Fedotov)
    
- bluestore: bluestore: Rescue procedure for extremely large bluefs log ([pr#36123](https://github.com/ceph/ceph/pull/36123), Adam Kupczyk)
    
- bluestore: octopus:os/bluestore: improve/fix bluefs stats reporting ([pr#35748](https://github.com/ceph/ceph/pull/35748), Igor Fedotov)
    
- bluestore: os/bluestore: fix bluefs log growth ([pr#36621](https://github.com/ceph/ceph/pull/36621), Adam Kupczyk, Jianpeng Ma)
    
- bluestore: os/bluestore: simplify Onode pin/unpin logic ([pr#36795](https://github.com/ceph/ceph/pull/36795), Igor Fedotov)
    
- build/ops: Revert “mgr/osd\_support: remove module and all traces” ([pr#36973](https://github.com/ceph/ceph/pull/36973), Sebastian Wagner)
    
- build/ops: ceph-iscsi: selinux fixes ([pr#36302](https://github.com/ceph/ceph/pull/36302), Mike Christie)
    
- build/ops: mgr/dashboard/api: reduce amount of daemon logs ([pr#36693](https://github.com/ceph/ceph/pull/36693), Ernesto Puerta)
    
- ceph-volume: add dmcrypt support in raw mode ([pr#35830](https://github.com/ceph/ceph/pull/35830), Guillaume Abrioux)
    
- ceph-volume: add drive-group subcommand ([pr#36558](https://github.com/ceph/ceph/pull/36558), Jan Fajerski, Sebastian Wagner)
    
- ceph-volume: add tests for new functions that run LVM commands ([pr#36614](https://github.com/ceph/ceph/pull/36614), Rishabh Dave)
    
- ceph-volume: don’t use container classes in api/lvm.py ([pr#35879](https://github.com/ceph/ceph/pull/35879), Rishabh Dave, Guillaume Abrioux)
    
- ceph-volume: fix lvm functional tests ([pr#36409](https://github.com/ceph/ceph/pull/36409), Jan Fajerski)
    
- ceph-volume: handle idempotency with batch and explicit scenarios ([pr#35880](https://github.com/ceph/ceph/pull/35880), Andrew Schoen)
    
- ceph-volume: remove container classes from api/lvm.py ([pr#36608](https://github.com/ceph/ceph/pull/36608), Rishabh Dave)
    
- ceph-volume: report correct rejected reason in inventory if device type is invalid ([pr#36410](https://github.com/ceph/ceph/pull/36410), Satoru Takeuchi)
    
- ceph-volume: run flake8 in python3 ([pr#36588](https://github.com/ceph/ceph/pull/36588), Jan Fajerski)
    
- cephfs,common: common: ignore SIGHUP prior to fork ([issue#46269](http://tracker.ceph.com/issues/46269), [pr#36195](https://github.com/ceph/ceph/pull/36195), Willem Jan Withagen, hzwuhongsong)
    
- cephfs,core,mgr: mgr/status: metadata is fetched async ([pr#36630](https://github.com/ceph/ceph/pull/36630), Michael Fritch)
    
- cephfs,core,rbd,rgw: librados: add LIBRADOS\_SUPPORTS\_GETADDRS support ([pr#36643](https://github.com/ceph/ceph/pull/36643), Xiubo Li)
    
- cephfs,mgr: mgr/volumes/nfs: Add interface for adding user defined configuration ([pr#36635](https://github.com/ceph/ceph/pull/36635), Varsha Rao)
    
- cephfs,mon: mon/MDSMonitor: copy MDS info which may be removed ([pr#36035](https://github.com/ceph/ceph/pull/36035), Patrick Donnelly)
    
- cephfs,pybind: pybind/ceph\_volume\_client: Fix PEP-8 SyntaxWarning ([pr#36100](https://github.com/ceph/ceph/pull/36100), Đặng Minh Dũng)
    
- cephfs,tests: mgr/fs/volumes: misc fixes ([pr#36327](https://github.com/ceph/ceph/pull/36327), Patrick Donnelly, Kotresh HR)
    
- cephfs,tests: tests: Revert “Revert “qa/suites/rados/mgr/tasks/module\_selftest: whitelist … ([issue#43943](http://tracker.ceph.com/issues/43943), [pr#36042](https://github.com/ceph/ceph/pull/36042), Venky Shankar)
    
- cephfs,tests: tests: qa/tasks/cephfs/cephfs\_test\_case.py: skip cleaning the core dumps when in program case ([pr#36043](https://github.com/ceph/ceph/pull/36043), Xiubo Li)
    
- cephfs,tests: tests: qa/tasks: make sh() in vstart\_runner.py identical with teuthology.orchestra.remote.sh ([pr#36044](https://github.com/ceph/ceph/pull/36044), Jos Collin)
    
- cephfs: Update nfs-ganesha package requirements doc backport ([pr#36063](https://github.com/ceph/ceph/pull/36063), Varsha Rao)
    
- cephfs: cephfs: client: fix setxattr for 0 size value (NULL value) ([pr#36045](https://github.com/ceph/ceph/pull/36045), Sidharth Anupkrishnan)
    
- cephfs: cephfs: client: fix snap directory atime ([pr#36039](https://github.com/ceph/ceph/pull/36039), Luis Henriques)
    
- cephfs: cephfs: client: release the client\_lock before copying data in read ([pr#36046](https://github.com/ceph/ceph/pull/36046), Chencan)
    
- cephfs: client: expose ceph.quota.max\_bytes xattr within snapshots ([pr#36403](https://github.com/ceph/ceph/pull/36403), Shyamsundar Ranganathan)
    
- cephfs: client: introduce timeout for client shutdown ([issue#44276](http://tracker.ceph.com/issues/44276), [pr#35962](https://github.com/ceph/ceph/pull/35962), “Yan, Zheng”, Venky Shankar)
    
- cephfs: mds/MDSRank: fix typo in “unrecognized” ([pr#36197](https://github.com/ceph/ceph/pull/36197), Nathan Cutler)
    
- cephfs: mds: add ephemeral random and distributed export pins ([pr#35759](https://github.com/ceph/ceph/pull/35759), Patrick Donnelly, Sidharth Anupkrishnan)
    
- cephfs: mds: fix filelock state when Fc is issued ([pr#35842](https://github.com/ceph/ceph/pull/35842), Xiubo Li)
    
- cephfs: mds: reset heartbeat in EMetaBlob replay ([pr#36040](https://github.com/ceph/ceph/pull/36040), Yanhu Cao)
    
- cephfs: mgr/nfs: Check if pseudo path is absolute path ([pr#36299](https://github.com/ceph/ceph/pull/36299), Varsha Rao)
    
- cephfs: mgr/nfs: Update MDCACHE block in ganesha config and doc about nfs-cephadm in vstart ([pr#36224](https://github.com/ceph/ceph/pull/36224), Varsha Rao)
    
- cephfs: mgr/volumes: Deprecate protect/unprotect CLI calls for subvolume snapshots ([pr#36126](https://github.com/ceph/ceph/pull/36126), Shyamsundar Ranganathan)
    
- cephfs: mgr/volumes: fix “ceph nfs export” help messages ([pr#36220](https://github.com/ceph/ceph/pull/36220), Nathan Cutler)
    
- cephfs: nfs backport ([pr#35499](https://github.com/ceph/ceph/pull/35499), Jeff Layton, Varsha Rao, Ramana Raja, Kefu Chai)
    
- common,core: common, osd: add sanity checks around osd\_scrub\_max\_preemptions ([pr#36034](https://github.com/ceph/ceph/pull/36034), xie xingguo)
    
- common,rbd,tools: rbd: immutable-object-cache: fixed crashes on start up ([pr#36660](https://github.com/ceph/ceph/pull/36660), Jason Dillaman)
    
- common,rbd: crush/CrushWrapper: rebuild reverse maps after rebuilding crush map ([pr#36662](https://github.com/ceph/ceph/pull/36662), Jason Dillaman)
    
- common: common: log: fix timestap precision of log can’t set to millisecond ([pr#36048](https://github.com/ceph/ceph/pull/36048), Guan yunfei)
    
- core,mgr: mgr: decrease pool stats if pg was removed ([pr#36667](https://github.com/ceph/ceph/pull/36667), Aleksei Gutikov)
    
- core,rbd: osd/OSDCap: rbd profile permits use of “rbd\_info” ([pr#36414](https://github.com/ceph/ceph/pull/36414), Florian Florensa)
    
- core,tools: tools/rados: Set locator key when exporting or importing a pool ([pr#36666](https://github.com/ceph/ceph/pull/36666), Iain Buclaw)
    
- core: mon/OSDMonitor: Reset grace period if failure interval exceeds a threshold ([pr#35799](https://github.com/ceph/ceph/pull/35799), Sridhar Seshasayee)
    
- core: mon/OSDMonitor: only take in osd into consideration when trimming osd… ([pr#36981](https://github.com/ceph/ceph/pull/36981), Kefu Chai)
    
- core: mon: fix the ‘Error ERANGE’ message when conf “osd\_objectstore” is filestore ([pr#36665](https://github.com/ceph/ceph/pull/36665), wangyunqing)
    
- core: monclient: schedule first tick using mon\_client\_hunt\_interval ([pr#36633](https://github.com/ceph/ceph/pull/36633), Mykola Golub)
    
- core: osd/OSD.cc: remove osd\_lock for bench ([pr#36664](https://github.com/ceph/ceph/pull/36664), Neha Ojha, Adam Kupczyk)
    
- core: osd/PG: fix history.same\_interval\_since of merge target again ([pr#36033](https://github.com/ceph/ceph/pull/36033), xie xingguo)
    
- core: osd/PeeringState: prevent peer’s num\_objects going negative ([pr#36663](https://github.com/ceph/ceph/pull/36663), xie xingguo)
    
- core: osd/PrimaryLogPG: don’t populate watchers if replica ([pr#36029](https://github.com/ceph/ceph/pull/36029), Ilya Dryomov)
    
- core: osd: Cancel in-progress scrubs (not user requested) ([pr#36291](https://github.com/ceph/ceph/pull/36291), David Zafman)
    
- core: osd: expose osdspec\_affinity to osd\_metadata ([pr#35957](https://github.com/ceph/ceph/pull/35957), Joshua Schmid)
    
- core: osd: fix crash in \_committed\_osd\_maps if incremental osdmap crc fails ([pr#36340](https://github.com/ceph/ceph/pull/36340), Neha Ojha, Dan van der Ster)
    
- core: osd: make message cap option usable again ([pr#35737](https://github.com/ceph/ceph/pull/35737), Neha Ojha, Josh Durgin)
    
- core: osd: wakeup all threads of shard rather than one thread ([pr#36032](https://github.com/ceph/ceph/pull/36032), Jianpeng Ma)
    
- core: test: osd-backfill-stats.sh use nobackfill to avoid races in remainin… ([pr#36030](https://github.com/ceph/ceph/pull/36030), David Zafman)
    
- doc: cephadm batch backport ([pr#36450](https://github.com/ceph/ceph/pull/36450), Varsha Rao, Ricardo Marques, Kiefer Chang, Matthew Oliver, Paul Cuzner, Kefu Chai, Daniel-Pivonka, Sebastian Wagner, Volker Theile, Adam King, Michael Fritch, Joshua Schmid)
    
- doc: doc/mgr/crash: Add missing command in rm example ([pr#36690](https://github.com/ceph/ceph/pull/36690), Daniël Vos)
    
- doc: doc/rados: Fix osd\_scrub\_during\_recovery default value ([pr#36661](https://github.com/ceph/ceph/pull/36661), Benoît Knecht)
    
- doc: doc/rbd: add rbd-target-gw enable and start ([pr#36416](https://github.com/ceph/ceph/pull/36416), Zac Dover)
    
- doc: doc: PendingReleaseNotes: clean slate for 15.2.5 ([pr#35753](https://github.com/ceph/ceph/pull/35753), Nathan Cutler)
    
- mgr,pybind: pybind/mgr/balancer: use “==” and “!=” for comparing str ([pr#36036](https://github.com/ceph/ceph/pull/36036), Kefu Chai)
    
- mgr,pybind: pybind/mgr/pg\_autoscaler/module.py: do not update event if ev.pg\_num== ev.pg\_num\_target ([pr#36037](https://github.com/ceph/ceph/pull/36037), Neha Ojha)
    
- mgr,rbd: mgr/prometheus: automatically discover RBD pools for stats gathering ([pr#36411](https://github.com/ceph/ceph/pull/36411), Jason Dillaman)
    
- mgr/dashboard/api: increase API health timeout ([pr#36562](https://github.com/ceph/ceph/pull/36562), Ernesto Puerta)
    
- mgr/dashboard: Add button to copy the bootstrap token into the clipboard ([pr#35796](https://github.com/ceph/ceph/pull/35796), Ishan Rai)
    
- mgr/dashboard: Add host labels in UI ([pr#35893](https://github.com/ceph/ceph/pull/35893), Volker Theile)
    
- mgr/dashboard: Add hosts page unit tests ([pr#36350](https://github.com/ceph/ceph/pull/36350), Volker Theile)
    
- mgr/dashboard: Allow to edit iSCSI target with active session ([pr#35997](https://github.com/ceph/ceph/pull/35997), Ricardo Marques)
    
- mgr/dashboard: Always use fast angular unit tests ([pr#36267](https://github.com/ceph/ceph/pull/36267), Stephan Müller)
    
- mgr/dashboard: Configure overflow of popover in health page ([pr#36460](https://github.com/ceph/ceph/pull/36460), Tiago Melo)
    
- mgr/dashboard: Display check icon instead of true|false in various datatables ([pr#35892](https://github.com/ceph/ceph/pull/35892), Volker Theile)
    
- mgr/dashboard: Display users current bucket quota usage ([pr#35926](https://github.com/ceph/ceph/pull/35926), Ernesto Puerta, Avan Thakkar)
    
- mgr/dashboard: Extract documentation link to a component ([pr#36587](https://github.com/ceph/ceph/pull/36587), Tiago Melo)
    
- mgr/dashboard: Fix host attributes like labels are not returned ([pr#36678](https://github.com/ceph/ceph/pull/36678), Kiefer Chang)
    
- mgr/dashboard: Hide password notification when expiration date is far ([pr#35975](https://github.com/ceph/ceph/pull/35975), Tiago Melo)
    
- mgr/dashboard: Improve Summary’s subscribe methods ([pr#35705](https://github.com/ceph/ceph/pull/35705), Tiago Melo)
    
- mgr/dashboard: Prometheus query error in the metrics of Pools, OSDs and RBD images ([pr#35885](https://github.com/ceph/ceph/pull/35885), Avan Thakkar)
    
- mgr/dashboard: Re-enable OSD’s table autoReload ([pr#36226](https://github.com/ceph/ceph/pull/36226), Kiefer Chang, Tiago Melo)
    
- mgr/dashboard: Strange iSCSI discovery auth behavior ([pr#36782](https://github.com/ceph/ceph/pull/36782), Volker Theile)
    
- mgr/dashboard: The max. buckets field in RGW user form should be pre-filled ([pr#35795](https://github.com/ceph/ceph/pull/35795), Volker Theile)
    
- mgr/dashboard: Unable to edit iSCSI logged-in client ([pr#36611](https://github.com/ceph/ceph/pull/36611), Ricardo Marques)
    
- mgr/dashboard: Use right size in pool form ([pr#35925](https://github.com/ceph/ceph/pull/35925), Stephan Müller)
    
- mgr/dashboard: Use same required field message accross the UI ([pr#36277](https://github.com/ceph/ceph/pull/36277), Volker Theile)
    
- mgr/dashboard: add API team to CODEOWNERS ([pr#36143](https://github.com/ceph/ceph/pull/36143), Ernesto Puerta)
    
- mgr/dashboard: allow preserving OSD IDs when deleting OSDs ([pr#35766](https://github.com/ceph/ceph/pull/35766), Kiefer Chang)
    
- mgr/dashboard: cpu stats incorrectly displayed ([pr#36322](https://github.com/ceph/ceph/pull/36322), Avan Thakkar)
    
- mgr/dashboard: cropped actions menu in nested details ([pr#35620](https://github.com/ceph/ceph/pull/35620), Avan Thakkar)
    
- mgr/dashboard: fix Source column i18n issue in RBD configuration tables ([pr#35819](https://github.com/ceph/ceph/pull/35819), Kiefer Chang)
    
- mgr/dashboard: fix backporting issue #35926 ([pr#36073](https://github.com/ceph/ceph/pull/36073), Ernesto Puerta)
    
- mgr/dashboard: fix pool usage calculation ([pr#36137](https://github.com/ceph/ceph/pull/36137), Ernesto Puerta)
    
- mgr/dashboard: fix rbdmirroring dropdown menu ([pr#36382](https://github.com/ceph/ceph/pull/36382), Avan Thakkar)
    
- mgr/dashboard: fix regression in delete OSD modal ([pr#36419](https://github.com/ceph/ceph/pull/36419), Kiefer Chang)
    
- mgr/dashboard: fix tasks.mgr.dashboard.test\_rbd.RbdTest.test\_move\_image\_to\_trash error ([pr#36563](https://github.com/ceph/ceph/pull/36563), Kiefer Chang)
    
- mgr/dashboard: fix ui api endpoints ([pr#36160](https://github.com/ceph/ceph/pull/36160), Fabrizio D’Angelo)
    
- mgr/dashboard: fix wal/db slots controls in the OSD form ([pr#35883](https://github.com/ceph/ceph/pull/35883), Kiefer Chang)
    
- mgr/dashboard: increase API test coverage in API controllers ([pr#36260](https://github.com/ceph/ceph/pull/36260), Kefu Chai, Aashish Sharma)
    
- mgr/dashboard: redirect to original URL after successful login ([pr#36831](https://github.com/ceph/ceph/pull/36831), Avan Thakkar)
    
- mgr/dashboard: remove “This week/month/year” and “Today” time stamps ([pr#36789](https://github.com/ceph/ceph/pull/36789), Avan Thakkar)
    
- mgr/dashboard: remove cdCopy2ClipboardButton formatted attribute ([pr#35889](https://github.com/ceph/ceph/pull/35889), Tatjana Dehler)
    
- mgr/dashboard: remove password field if login is using SSO and fix error message in confirm password ([pr#36689](https://github.com/ceph/ceph/pull/36689), Ishan Rai)
    
- mgr/dashboard: right-align dropdown menu of column filters ([pr#36369](https://github.com/ceph/ceph/pull/36369), Kiefer Chang)
    
- mgr/dashboard: telemetry activation notification ([pr#35772](https://github.com/ceph/ceph/pull/35772), Tatjana Dehler)
    
- mgr/dashboard: wait longer for health status to be cleared ([pr#36346](https://github.com/ceph/ceph/pull/36346), Tatjana Dehler)
    
- mgr/k8sevents: sanitise kubernetes events ([pr#35684](https://github.com/ceph/ceph/pull/35684), Paul Cuzner)
    
- mgr/prometheus: improve cache ([pr#35847](https://github.com/ceph/ceph/pull/35847), Patrick Seidensal)
    
- mgr: avoid false alarm of MGR\_MODULE\_ERROR ([pr#35995](https://github.com/ceph/ceph/pull/35995), Kefu Chai)
    
- mgr: mgr/DaemonServer.cc: make ‘config show’ on fsid work ([pr#35793](https://github.com/ceph/ceph/pull/35793), Neha Ojha)
    
- mgr: mgr/cephadm: Adapt Vagrantfile to use octopus instead of master repo on shaman ([pr#35988](https://github.com/ceph/ceph/pull/35988), Volker Theile)
    
- mgr: mgr/diskprediction\_local: Fix array size error ([pr#36577](https://github.com/ceph/ceph/pull/36577), Benoît Knecht)
    
- mgr: mgr/progress: Skip pg\_summary update if \_events dict is empty ([pr#36076](https://github.com/ceph/ceph/pull/36076), Manuel Lausch)
    
- mgr: mgr/prometheus: log time it takes to collect metrics ([pr#36581](https://github.com/ceph/ceph/pull/36581), Patrick Seidensal)
    
- mgr: mgr: Add missing states to PG\_STATES in mgr\_module.py ([pr#36786](https://github.com/ceph/ceph/pull/36786), Harley Gorrell)
    
- mgr: mgr: fix race between module load and notify ([pr#35794](https://github.com/ceph/ceph/pull/35794), Mykola Golub)
    
- mgr: mon/PGMap: do not consider changing pg stuck ([pr#35958](https://github.com/ceph/ceph/pull/35958), Kefu Chai)
    
- monitoring: alert for pool fill up broken ([pr#35136](https://github.com/ceph/ceph/pull/35136), Volker Theile)
    
- msgr: New msgr2 crc and secure modes (msgr2.1) ([pr#35720](https://github.com/ceph/ceph/pull/35720), Ilya Dryomov)
    
- rbd,tests: tests/rbd\_mirror: fix race on test shut down ([pr#36657](https://github.com/ceph/ceph/pull/36657), Mykola Golub)
    
- rbd: librbd: global and pool-level config overrides require image refresh to apply ([pr#36638](https://github.com/ceph/ceph/pull/36638), Jason Dillaman)
    
- rbd: librbd: new ‘write\_zeroes’ API methods to suppliment the discard APIs ([pr#36247](https://github.com/ceph/ceph/pull/36247), Jason Dillaman)
    
- rbd: librbd: potential race conditions handling API IO completions ([pr#36331](https://github.com/ceph/ceph/pull/36331), Jason Dillaman)
    
- rbd: mgr/dashboard: work with v1 RBD images ([pr#35711](https://github.com/ceph/ceph/pull/35711), Ernesto Puerta)
    
- rbd: rbd: librbd: Align rbd\_write\_zeroes declarations ([pr#36717](https://github.com/ceph/ceph/pull/36717), Corey Bryant)
    
- rbd: rbd: librbd: don’t resend async\_complete if watcher is unregistered ([pr#36659](https://github.com/ceph/ceph/pull/36659), Mykola Golub)
    
- rbd: rbd: librbd: flush all queued object IO from simple scheduler ([pr#36658](https://github.com/ceph/ceph/pull/36658), Jason Dillaman)
    
- rbd: rbd: librbd: race when disabling object map with overlapping in-flight writes ([pr#36656](https://github.com/ceph/ceph/pull/36656), Jason Dillaman)
    
- rbd: rbd: recognize crush\_location, read\_from\_replica and compression\_hint map options ([pr#36061](https://github.com/ceph/ceph/pull/36061), Ilya Dryomov)
    
- rgw,tests: qa/tasks/ragweed: always set ragweed\_repo ([pr#36651](https://github.com/ceph/ceph/pull/36651), Kefu Chai)
    
- rgw: rgw: lc: fix Segmentation Fault when the tag of the object was not found ([pr#36085](https://github.com/ceph/ceph/pull/36085), yupeng chen, zhuo li)
    
- rgw: Add subuser to OPA request ([pr#36023](https://github.com/ceph/ceph/pull/36023), Seena Fallah)
    
- rgw: Add support wildcard subuser for bucket policy ([pr#36022](https://github.com/ceph/ceph/pull/36022), Seena Fallah)
    
- rgw: Adding data cache and CDN capabilities ([pr#36646](https://github.com/ceph/ceph/pull/36646), Mark Kogan, Or Friedmann)
    
- rgw: Empty reqs\_change\_state queue before unregistered\_reqs ([pr#36650](https://github.com/ceph/ceph/pull/36650), Soumya Koduri)
    
- rgw: add abort multipart date and rule-id header to init multipart upload response ([pr#36649](https://github.com/ceph/ceph/pull/36649), zhang Shaowen, zhangshaowen)
    
- rgw: add access log to the beast frontend ([pr#36024](https://github.com/ceph/ceph/pull/36024), Mark Kogan)
    
- rgw: add check for index entry’s existing when adding bucket stats during bucket reshard ([pr#36025](https://github.com/ceph/ceph/pull/36025), zhang Shaowen)
    
- rgw: add negative cache to the system object ([pr#36648](https://github.com/ceph/ceph/pull/36648), Or Friedmann)
    
- rgw: add quota enforcement to CopyObj ([pr#36020](https://github.com/ceph/ceph/pull/36020), Casey Bodley)
    
- rgw: append obj: prevent tail from being GC’ed ([pr#36389](https://github.com/ceph/ceph/pull/36389), Abhishek Lekshmanan)
    
- rgw: bucket list/stats truncates for user w/ >1000 buckets ([pr#36019](https://github.com/ceph/ceph/pull/36019), J. Eric Ivancich)
    
- rgw: cls/rgw: preserve olh entry’s name on last unlink ([pr#36652](https://github.com/ceph/ceph/pull/36652), Casey Bodley)
    
- rgw: cls/rgw\_gc: Fixing the iterator used to access urgent data map ([pr#36017](https://github.com/ceph/ceph/pull/36017), Pritha Srivastava)
    
- rgw: fix boost::asio::async\_write() does not return error ([pr#36647](https://github.com/ceph/ceph/pull/36647), Mark Kogan)
    
- rgw: fix bug where ordered bucket listing gets stuck ([pr#35877](https://github.com/ceph/ceph/pull/35877), J. Eric Ivancich)
    
- rgw: fix double slash (//) killing the gateway ([pr#36654](https://github.com/ceph/ceph/pull/36654), Theofilos Mouratidis)
    
- rgw: fix loop problem with swift stat on account ([pr#36021](https://github.com/ceph/ceph/pull/36021), Marcus Watts)
    
- rgw: fix shutdown crash in RGWAsyncReadMDLogEntries ([pr#36653](https://github.com/ceph/ceph/pull/36653), Casey Bodley)
    
- rgw: introduce safe user-reset-stats ([pr#36655](https://github.com/ceph/ceph/pull/36655), Yuval Lifshitz, Matt Benjamin)
    
- rgw: lc: add lifecycle perf counters ([pr#36018](https://github.com/ceph/ceph/pull/36018), Mark Kogan, Matt Benjamin)
    
- rgw: orphan list teuthology test & fully-qualified domain issue ([pr#36027](https://github.com/ceph/ceph/pull/36027), J. Eric Ivancich)
    
- rgw: orphan-list timestamp fix ([pr#35929](https://github.com/ceph/ceph/pull/35929), J. Eric Ivancich)
    
- rgw: policy: reuse eval\_principal to evaluate the policy principal ([pr#36636](https://github.com/ceph/ceph/pull/36636), Abhishek Lekshmanan)
    
- rgw: radoslist incomplete multipart uploads fix marker progression ([pr#36028](https://github.com/ceph/ceph/pull/36028), J. Eric Ivancich)
    
- rgw: rgw/iam: correcting the result of get role policy ([pr#36645](https://github.com/ceph/ceph/pull/36645), Pritha Srivastava)
    
- rgw: selinux: allow ceph\_t amqp\_port\_t:tcp\_socket ([pr#36026](https://github.com/ceph/ceph/pull/36026), Kaleb S. KEITHLEY, Thomas Serlin)
    
- rgw: stop realm reloader before store shutdown ([pr#36644](https://github.com/ceph/ceph/pull/36644), Kefu Chai, Casey Bodley)
    
- tools: tools: Add statfs operation to ceph-objecstore-tool ([pr#35715](https://github.com/ceph/ceph/pull/35715), David Zafman)
