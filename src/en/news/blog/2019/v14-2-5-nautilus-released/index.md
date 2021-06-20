---
title: "v14.2.5 Nautilus released"
date: "2019-12-09"
author: "TheAnalyst"
---

This is the fifth release of the Ceph Nautilus release series. Among the many notable changes, this release fixes a critical BlueStore bug that was introduced in 14.2.3. All Nautilus users are advised to upgrade to this release.

## Notable Changes

Critical fix:

- This release fixes a [critical BlueStore bug](https://tracker.ceph.com/issues/42223) introduced in 14.2.3 (and also present in 14.2.4) that can lead to data corruption when a separate “WAL” device is used.

New health warnings:

- Ceph will now issue health warnings if daemons have recently crashed. Ceph has been collecting crash reports since the initial Nautilus release, but the health alerts are new. To view new crashes (or all crashes, if you’ve just upgraded):
    
    ceph crash ls\-new
    
    To acknowledge a particular crash (or all crashes) and silence the health warning:
    
    ceph crash archive <crash\-id\>
    ceph crash archive\-all
    
- Ceph will now issue a health warning if a RADOS pool has a `pg_num` value that is not a power of two. This can be fixed by adjusting the pool to a nearby power of two:
    
    ceph osd pool set <pool\-name\> pg\_num <new\-pg\-num\>
    
    Alternatively, the warning can be silenced with:
    
    ceph config set global mon\_warn\_on\_pool\_pg\_num\_not\_power\_of\_two false
    
- Ceph will issue a health warning if a RADOS pool’s `size` is set to 1 or, in other words, if the pool is configured with no redundancy. Ceph will stop issuing the warning if the pool size is set to the minimum recommended value:
    
    ceph osd pool set <pool\-name\> size <num\-replicas\>
    
    The warning can be silenced with:
    
    ceph config set global mon\_warn\_on\_pool\_no\_redundancy false
    
- A health warning is now generated if the average osd heartbeat ping time exceeds a configurable threshold for any of the intervals computed. The OSD computes 1 minute, 5 minute and 15 minute intervals with average, minimum and maximum values. New configuration option mon\_warn\_on\_slow\_ping\_ratio specifies a percentage of osd\_heartbeat\_grace to determine the threshold. A value of zero disables the warning. New configuration option mon\_warn\_on\_slow\_ping\_time specified in milliseconds over-rides the computed value, causes a warning when OSD heartbeat pings take longer than the specified amount. A new admin command, ceph daemon mgr.# dump\_osd\_network \[threshold\], will list all connections with a ping time longer than the specified threshold or value determined by the config options, for the average for any of the 3 intervals. Another new admin command, ceph daemon osd.# dump\_osd\_network \[threshold\], will do the same but only including heartbeats initiated by the specified OSD.

Changes in the telemetry module:

- The telemetry module now has a ‘device’ channel, enabled by default, that will report anonymized hard disk and SSD health metrics to telemetry.ceph.com in order to build and improve device failure prediction algorithms. Because the content of telemetry reports has changed, you will need to re-opt-in with:
    
    ceph telemetry on
    
    You can view exactly what information will be reported first with:
    
    ceph telemetry show
    ceph telemetry show device   \# specifically show the device channel
    
    If you are not comfortable sharing device metrics, you can disable that channel first before re-opting-in:
    
    > ceph config set mgr mgr/telemetry/channel\_device false
    > ceph telemetry on
    
- The telemetry module now reports more information about CephFS file systems, including:
    
    > - how many MDS daemons (in total and per file system)
    > - which features are (or have been) enabled
    > - how many data pools
    > - approximate file system age (year + month of creation)
    > - how many files, bytes, and snapshots
    > - how much metadata is being cached
    
    We have also added:
    
    > - which Ceph release the monitors are running
    > - whether msgr v1 or v2 addresses are used for the monitors
    > - whether IPv4 or IPv6 addresses are used for the monitors
    > - whether RADOS cache tiering is enabled (and which mode)
    > - whether pools are replicated or erasure coded, and which erasure code profile plugin and parameters are in use
    > - how many hosts are in the cluster, and how many hosts have each type of daemon
    > - whether a separate OSD cluster network is being used
    > - how many RBD pools and images are in the cluster, and how many pools have RBD mirroring enabled
    > - how many RGW daemons, zones, and zonegroups are present; which RGW frontends are in use
    > - aggregate stats about the CRUSH map, like which algorithms are used, how big buckets are, how many rules are defined, and what tunables are in use
    
    If you had telemetry enabled, you will need to re-opt-in with:
    
    ceph telemetry on
    
    You can view exactly what information will be reported first with:
    
    ceph telemetry show        \# see everything
    ceph telemetry show basic  \# basic cluster info (including all of the new info)
    

OSD:

- A new OSD daemon command, ‘dump\_recovery\_reservations’, reveals the recovery locks held (in\_progress) and waiting in priority queues.
- Another new OSD daemon command, ‘dump\_scrub\_reservations’, reveals the scrub reservations that are held for local (primary) and remote (replica) PGs.

RGW:

- RGW now supports S3 Object Lock set of APIs allowing for a WORM model for storing objects. 6 new APIs have been added put/get bucket object lock, put/get object retention, put/get object legal hold.
- RGW now supports List Objects V2

## Changelog

- bluestore/KernelDevice: fix RW\_IO\_MAX constant ([pr#31397](https://github.com/ceph/ceph/pull/31397), Sage Weil)
- bluestore: Don’t forget sub kv\_submitted\_waiters ([pr#30048](https://github.com/ceph/ceph/pull/30048), Jianpeng Ma)
- bluestore: apply garbage collection against excessive blob count growth ([pr#30144](https://github.com/ceph/ceph/pull/30144), Igor Fedotov)
- bluestore: apply shared\_alloc\_size to shared device with log level change ([pr#30229](https://github.com/ceph/ceph/pull/30229), Vikhyat Umrao, Sage Weil, Igor Fedotov, Neha Ojha)
- bluestore: consolidate extents from the same device only ([pr#31644](https://github.com/ceph/ceph/pull/31644), Igor Fedotov)
- bluestore: fix improper setting of STATE\_KV\_SUBMITTED ([pr#30755](https://github.com/ceph/ceph/pull/30755), Igor Fedotov)
- bluestore: shallow fsck mode and legacy statfs auto repair ([pr#30685](https://github.com/ceph/ceph/pull/30685), Sage Weil, Igor Fedotov)
- bluestore: tool to check fragmentation ([pr#29949](https://github.com/ceph/ceph/pull/29949), Adam Kupczyk)
- build/ops: admin/build-doc: use python3 ([pr#30664](https://github.com/ceph/ceph/pull/30664), Kefu Chai)
- build/ops: backport endian fixes ([issue#40114](http://tracker.ceph.com/issues/40114), [pr#30697](https://github.com/ceph/ceph/pull/30697), Ulrich Weigand, Jeff Layton)
- build/ops: cmake,rgw: IBM Z build fixes ([pr#30696](https://github.com/ceph/ceph/pull/30696), Ulrich Weigand)
- build/ops: cmake/BuildDPDK: ignore gcc8/9 warnings ([pr#30360](https://github.com/ceph/ceph/pull/30360), Yuval Lifshitz)
- build/ops: cmake: Allow cephfs and ceph-mds to be build when building on FreeBSD ([pr#31011](https://github.com/ceph/ceph/pull/31011), Willem Jan Withagen)
- build/ops: cmake: enforce C++17 instead of relying on cmake-compile-features ([pr#30283](https://github.com/ceph/ceph/pull/30283), Kefu Chai)
- build/ops: fix build fail related to PYTHON\_EXECUTABLE variable ([pr#30261](https://github.com/ceph/ceph/pull/30261), Ilsoo Byun)
- build/ops: hidden corei7 requirement in binary packages ([pr#29772](https://github.com/ceph/ceph/pull/29772), Kefu Chai)
- build/ops: install-deps.sh: add EPEL repo for non-x86\_64 archs as well ([pr#30601](https://github.com/ceph/ceph/pull/30601), Kefu Chai, Nathan Cutler)
- build/ops: install-deps.sh: install python\*-devel for python\*rpm-macros ([pr#30322](https://github.com/ceph/ceph/pull/30322), Kefu Chai)
- build/ops: install-deps: do not install if rpm already installed and ceph.spec.in: s/pkgversion/version\_nodots/ ([pr#30708](https://github.com/ceph/ceph/pull/30708), Jeff Layton, Kefu Chai)
- build/ops: make patch build dependency explicit ([issue#40175](http://tracker.ceph.com/issues/40175), [pr#30046](https://github.com/ceph/ceph/pull/30046), Nathan Cutler)
- build/ops: python3-cephfs should provide python36-cephfs ([pr#30983](https://github.com/ceph/ceph/pull/30983), Kefu Chai)
- build/ops: rpm: always build ceph-test package ([pr#30049](https://github.com/ceph/ceph/pull/30049), Nathan Cutler)
- build/ops: rpm: fdupes in SUSE builds to conform with packaging guidelines ([issue#40973](http://tracker.ceph.com/issues/40973), [pr#29784](https://github.com/ceph/ceph/pull/29784), Nathan Cutler)
- build/ops: rpm: make librados2, libcephfs2 own (create) /etc/ceph ([pr#31125](https://github.com/ceph/ceph/pull/31125), Nathan Cutler)
- build/ops: rpm: put librgw lttng SOs in the librgw-devel package ([issue#40975](http://tracker.ceph.com/issues/40975), [pr#29785](https://github.com/ceph/ceph/pull/29785), Nathan Cutler)
- build/ops: seastar,dmclock: use CXX\_FLAGS from parent project ([pr#30114](https://github.com/ceph/ceph/pull/30114), Kefu Chai)
- build/ops: use gcc-8 ([issue#38892](http://tracker.ceph.com/issues/38892), [pr#30089](https://github.com/ceph/ceph/pull/30089), Kefu Chai)
- tools: ceph-objectstore-tool: update-mon-db: do not fail if incmap is missing ([pr#30740](https://github.com/ceph/ceph/pull/30740), Kefu Chai)
- ceph-volume: PVolumes.filter shouldn’t purge itself ([pr#30805](https://github.com/ceph/ceph/pull/30805), Rishabh Dave)
- ceph-volume: VolumeGroups.filter shouldn’t purge itself ([pr#30807](https://github.com/ceph/ceph/pull/30807), Rishabh Dave)
- ceph-volume: add Ceph’s device id to inventory ([pr#31210](https://github.com/ceph/ceph/pull/31210), Sebastian Wagner)
- ceph-volume: allow to skip restorecon calls ([pr#31555](https://github.com/ceph/ceph/pull/31555), Alfredo Deza)
- ceph-volume: api/lvm: check if list of LVs is empty ([pr#31228](https://github.com/ceph/ceph/pull/31228), Rishabh Dave)
- ceph-volume: check if we run in an selinux environment ([pr#31812](https://github.com/ceph/ceph/pull/31812), Jan Fajerski)
- ceph-volume: do not fail when trying to remove crypt mapper ([pr#30554](https://github.com/ceph/ceph/pull/30554), Guillaume Abrioux)
- ceph-volume: fix stderr failure to decode/encode when redirected ([pr#30300](https://github.com/ceph/ceph/pull/30300), Alfredo Deza)
- ceph-volume: fix warnings raised by pytest ([pr#30676](https://github.com/ceph/ceph/pull/30676), Rishabh Dave)
- ceph-volume: lvm list is O(n^2) ([pr#30093](https://github.com/ceph/ceph/pull/30093), Rishabh Dave)
- ceph-volume: lvm.zap fix cleanup for db partitions ([issue#40664](http://tracker.ceph.com/issues/40664), [pr#30304](https://github.com/ceph/ceph/pull/30304), Dominik Csapak)
- ceph-volume: mokeypatch calls to lvm related binaries ([pr#31405](https://github.com/ceph/ceph/pull/31405), Jan Fajerski)
- ceph-volume: pre-install python-apt and its variants before test runs ([pr#30294](https://github.com/ceph/ceph/pull/30294), Alfredo Deza)
- ceph-volume: rearrange api/lvm.py ([pr#31408](https://github.com/ceph/ceph/pull/31408), Rishabh Dave)
- ceph-volume: systemd fix typo in log message ([pr#30520](https://github.com/ceph/ceph/pull/30520), Manu Zurmühl)
- ceph-volume: use the OSD identifier when reporting success ([pr#29769](https://github.com/ceph/ceph/pull/29769), Alfredo Deza)
- ceph-volume: zap always skips block.db, leaves them around ([issue#40664](http://tracker.ceph.com/issues/40664), [pr#30307](https://github.com/ceph/ceph/pull/30307), Alfredo Deza)
- tools: ceph.in: do not preload ASan unless necessary ([pr#31676](https://github.com/ceph/ceph/pull/31676), Kefu Chai)
- - build/ops: ceph.spec.in: reserve 2500MB per build job ([pr#30370](https://github.com/ceph/ceph/pull/30370), Dan van der Ster)
- tools: ceph\_volume\_client: convert string to bytes object ([issue#39405](http://tracker.ceph.com/issues/39405), [issue#40369](http://tracker.ceph.com/issues/40369), [issue#39510](http://tracker.ceph.com/issues/39510), [issue#40800](http://tracker.ceph.com/issues/40800), [issue#40460](http://tracker.ceph.com/issues/40460), [pr#30030](https://github.com/ceph/ceph/pull/30030), Rishabh Dave)
- cephfs-shell: Convert paths type from string to bytes ([pr#30057](https://github.com/ceph/ceph/pull/30057), Varsha Rao)
- cephfs: Allow mount.ceph to get mount info from ceph configs and keyrings ([pr#30521](https://github.com/ceph/ceph/pull/30521), Jeff Layton)
- cephfs: avoid map been inserted by mistake ([pr#29878](https://github.com/ceph/ceph/pull/29878), XiaoGuoDong2019)
- cephfs: client: more precise CEPH\_CLIENT\_CAPS\_PENDING\_CAPSNAP ([pr#30032](https://github.com/ceph/ceph/pull/30032), “Yan, Zheng”)
- cephfs: client: nfs-ganesha with cephfs client, removing dir reports not empty ([issue#40746](http://tracker.ceph.com/issues/40746), [pr#30442](https://github.com/ceph/ceph/pull/30442), Peng Xie)
- cephfs: client: return -eio when sync file which unsafe reqs have been dropped ([issue#40877](http://tracker.ceph.com/issues/40877), [pr#30043](https://github.com/ceph/ceph/pull/30043), simon gao)
- cephfs: fix a memory leak ([pr#29879](https://github.com/ceph/ceph/pull/29879), XiaoGuoDong2019)
- cephfs: mds: Fix duplicate client entries in eviction list ([pr#30951](https://github.com/ceph/ceph/pull/30951), Sidharth Anupkrishnan)
- cephfs: mds: cleanup truncating inodes when standby replay mds trim log segments ([pr#29591](https://github.com/ceph/ceph/pull/29591), “Yan, Zheng”)
- cephfs: mds: delay exporting directory whose pin value exceeds max rank id ([issue#40603](http://tracker.ceph.com/issues/40603), [pr#29938](https://github.com/ceph/ceph/pull/29938), Zhi Zhang)
- cephfs: mds: evict an unresponsive client only when another client wants its caps ([pr#30031](https://github.com/ceph/ceph/pull/30031), Rishabh Dave)
- cephfs: mds: fix InoTable::force\_consume\_to() ([pr#30041](https://github.com/ceph/ceph/pull/30041), “Yan, Zheng”)
- cephfs: mds: fix infinite loop in Locker::file\_update\_finish ([pr#31079](https://github.com/ceph/ceph/pull/31079), “Yan, Zheng”)
- cephfs: mds: make MDSIOContextBase delete itself when shutting down ([pr#30418](https://github.com/ceph/ceph/pull/30418), Xuehan Xu)
- cephfs: mds: trim cache on regular schedule ([pr#30040](https://github.com/ceph/ceph/pull/30040), Patrick Donnelly)
- cephfs: mds: wake up lock waiters after forcibly changing lock state ([issue#39987](http://tracker.ceph.com/issues/39987), [pr#30508](https://github.com/ceph/ceph/pull/30508), “Yan, Zheng”)
- cephfs: mount.ceph: properly handle -o strictatime ([pr#30039](https://github.com/ceph/ceph/pull/30039), Jeff Layton)
- cephfs: qa: ignore expected MDS\_CLIENT\_LATE\_RELEASE warning ([issue#40968](http://tracker.ceph.com/issues/40968), [pr#29811](https://github.com/ceph/ceph/pull/29811), Patrick Donnelly)
- cephfs: qa: wait for MDS to come back after removing it ([issue#40967](http://tracker.ceph.com/issues/40967), [pr#29832](https://github.com/ceph/ceph/pull/29832), Patrick Donnelly)
- cephfs: tests: power off still resulted in client sending session close ([issue#37681](http://tracker.ceph.com/issues/37681), [pr#29983](https://github.com/ceph/ceph/pull/29983), Patrick Donnelly)
- common/ceph\_context: avoid unnecessary wait during service thread shutdown ([pr#31097](https://github.com/ceph/ceph/pull/31097), Jason Dillaman)
- common/config\_proxy: hold lock while accessing mutable container ([pr#30661](https://github.com/ceph/ceph/pull/30661), Jason Dillaman)
- common: fix typo in rgw\_user\_max\_buckets option long description ([pr#31605](https://github.com/ceph/ceph/pull/31605), Alfonso Martínez)
- core/osd: do not trust partially simplified pg\_upmap\_item ([issue#42052](http://tracker.ceph.com/issues/42052), [pr#30899](https://github.com/ceph/ceph/pull/30899), xie xingguo)
- core: Health warnings on long network ping times ([issue#40640](http://tracker.ceph.com/issues/40640), [pr#30195](https://github.com/ceph/ceph/pull/30195), David Zafman)
- core: If the nodeep-scrub/noscrub flags are set in pools instead of global cluster. List the pool names in the ceph status ([issue#38029](http://tracker.ceph.com/issues/38029), [pr#29991](https://github.com/ceph/ceph/pull/29991), Mohamad Gebai)
- core: Improve health status for backfill\_toofull and recovery\_toofull and fix backfill\_toofull seen on cluster where the most full OSD is at 1% ([pr#29999](https://github.com/ceph/ceph/pull/29999), David Zafman)
- core: Make dumping of reservation info congruent between scrub and recovery ([pr#31444](https://github.com/ceph/ceph/pull/31444), David Zafman)
- core: Revert “rocksdb: enable rocksdb\_rmrange=true by default” ([pr#31612](https://github.com/ceph/ceph/pull/31612), Neha Ojha)
- core: filestore pre-split may not split enough directories ([issue#39390](http://tracker.ceph.com/issues/39390), [pr#29988](https://github.com/ceph/ceph/pull/29988), Jeegn Chen)
- core: kv/RocksDBStore: tell rocksdb to set mode to 0600, not 0644 ([pr#31031](https://github.com/ceph/ceph/pull/31031), Sage Weil)
- core: mon/MonClient: ENXIO when sending command to down mon ([pr#31037](https://github.com/ceph/ceph/pull/31037), Sage Weil, Greg Farnum)
- core: mon/MonCommands: “smart” only needs read permission ([pr#31111](https://github.com/ceph/ceph/pull/31111), Kefu Chai)
- core: mon/MonMap: encode (more) valid compat monmap when we have v2-only addrs ([pr#31658](https://github.com/ceph/ceph/pull/31658), Sage Weil)
- core: mon/Monitor.cc: fix condition that checks for unrecognized auth mode ([pr#31038](https://github.com/ceph/ceph/pull/31038), Neha Ojha)
- core: mon/OSDMonitor: Use generic priority cache tuner for mon caches ([pr#30419](https://github.com/ceph/ceph/pull/30419), Sridhar Seshasayee, Kefu Chai, Mykola Golub, Mark Nelson)
- core: mon/OSDMonitor: add check for crush rule size in pool set size command ([pr#30941](https://github.com/ceph/ceph/pull/30941), Vikhyat Umrao)
- core: mon/OSDMonitor: trim not-longer-exist failure reporters ([pr#30904](https://github.com/ceph/ceph/pull/30904), NancySu05)
- core: mon/PGMap: fix incorrect pg\_pool\_sum when delete pool ([pr#31704](https://github.com/ceph/ceph/pull/31704), luo rixin)
- core: mon: C\_AckMarkedDown has not handled the Callback Arguments ([pr#29997](https://github.com/ceph/ceph/pull/29997), NancySu05)
- core: mon: ensure prepare\_failure() marks no\_reply on op ([pr#30480](https://github.com/ceph/ceph/pull/30480), Joao Eduardo Luis)
- core: mon: show pool id in pool ls command ([issue#40287](http://tracker.ceph.com/issues/40287), [pr#30486](https://github.com/ceph/ceph/pull/30486), Chang Liu)
- core: msg,mon/MonClient: fix auth for clients without CEPHX\_V2 feature ([pr#30524](https://github.com/ceph/ceph/pull/30524), Sage Weil)
- core: msg/auth: handle decode errors instead of throwing exceptions ([pr#31099](https://github.com/ceph/ceph/pull/31099), Sage Weil)
- core: msg/simple: reset in\_seq\_acked to zero when session is reset ([pr#29592](https://github.com/ceph/ceph/pull/29592), Xiangyang Yu)
- core: os/bluestore: fix objectstore\_blackhole read-after-write ([pr#31019](https://github.com/ceph/ceph/pull/31019), Sage Weil)
- core: osd/OSDCap: Check for empty namespace ([issue#40835](http://tracker.ceph.com/issues/40835), [pr#29998](https://github.com/ceph/ceph/pull/29998), Brad Hubbard)
- core: mon/OSDMonitor: make memory autotune disable itself if no rocksdb ([pr#32045](https://github.com/ceph/ceph/pull/32045), Sage Weil)
- core: osd/PG: Add PG to large omap log message ([pr#30923](https://github.com/ceph/ceph/pull/30923), Brad Hubbard)
- core: osd/PGLog: persist num\_objects\_missing for replicas when peering is done ([pr#31077](https://github.com/ceph/ceph/pull/31077), xie xingguo)
- core: osd/PeeringState: do not complain about past\_intervals constrained by oldest epoch ([pr#30000](https://github.com/ceph/ceph/pull/30000), Sage Weil)
- core: osd/PeeringState: fix wrong history of merge target ([pr#30280](https://github.com/ceph/ceph/pull/30280), xie xingguo)
- core: osd/PeeringState: recover\_got - add special handler for empty log and improvements to standalone tests ([pr#30528](https://github.com/ceph/ceph/pull/30528), Sage Weil, David Zafman, xie xingguo)
- core: osd/PrimaryLogPG: Avoid accessing destroyed references in finish\_degr… ([pr#29994](https://github.com/ceph/ceph/pull/29994), Tao Ning)
- core: osd/PrimaryLogPG: update oi.size on write op implicitly truncating ob… ([pr#30278](https://github.com/ceph/ceph/pull/30278), xie xingguo)
- core: osd/ReplicatedBackend: check against empty data\_included before enabling crc ([pr#29716](https://github.com/ceph/ceph/pull/29716), xie xingguo)
- core: osd/osd\_types: fix {omap,hitset\_bytes}\_stats\_invalid handling on spli… ([pr#30643](https://github.com/ceph/ceph/pull/30643), Sage Weil)
- core: osd: Better error message when OSD count is less than osd\_pool\_default\_size ([issue#38617](http://tracker.ceph.com/issues/38617), [pr#29992](https://github.com/ceph/ceph/pull/29992), Kefu Chai, Sage Weil, zjh)
- core: osd: Remove unused osdmap flags full, nearfull from output ([pr#30900](https://github.com/ceph/ceph/pull/30900), David Zafman)
- core: osd: add log information to record the cause of do\_osd\_ops failure ([pr#30546](https://github.com/ceph/ceph/pull/30546), NancySu05)
- core: osd: clear PG\_STATE\_CLEAN when repair object ([pr#30050](https://github.com/ceph/ceph/pull/30050), Zengran Zhang)
- core: osd: fix possible crash on sending dynamic perf stats report ([pr#30648](https://github.com/ceph/ceph/pull/30648), Mykola Golub)
- core: osd: merge replica log on primary need according to replica log’s crt ([pr#30051](https://github.com/ceph/ceph/pull/30051), Zengran Zhang)
- core: osd: prime splits/merges for any potential fabricated split/merge par… ([issue#38483](http://tracker.ceph.com/issues/38483), [pr#30371](https://github.com/ceph/ceph/pull/30371), xie xingguo)
- core: osd: release backoffs during merge ([pr#31822](https://github.com/ceph/ceph/pull/31822), Sage Weil)
- core: osd: rollforward may need to mark pglog dirty ([issue#40403](http://tracker.ceph.com/issues/40403), [pr#31034](https://github.com/ceph/ceph/pull/31034), Zengran Zhang)
- core: osd: scrub error on big objects; make bluestore refuse to start on big objects ([pr#30783](https://github.com/ceph/ceph/pull/30783), David Zafman, Sage Weil)
- core: osd: support osd\_repair\_during\_recovery ([issue#40620](http://tracker.ceph.com/issues/40620), [pr#29748](https://github.com/ceph/ceph/pull/29748), Jeegn Chen)
- core: pool\_stat.dump() - value of num\_store\_stats is wrong ([issue#39340](http://tracker.ceph.com/issues/39340), [pr#29946](https://github.com/ceph/ceph/pull/29946), xie xingguo)
- doc/ceph-kvstore-tool: add description for ‘stats’ command ([pr#30245](https://github.com/ceph/ceph/pull/30245), Josh Durgin, Adam Kupczyk)
- doc/mgr/telemetry: update default interval ([pr#31009](https://github.com/ceph/ceph/pull/31009), Tim Serong)
- doc/rbd: s/guess/xml/ for codeblock lexer ([pr#31074](https://github.com/ceph/ceph/pull/31074), Kefu Chai)
- doc: Fix rbd namespace documentation ([pr#29731](https://github.com/ceph/ceph/pull/29731), Ricardo Marques)
- doc: cephfs: add section on fsync error reporting to posix.rst ([issue#24641](http://tracker.ceph.com/issues/24641), [pr#30025](https://github.com/ceph/ceph/pull/30025), Jeff Layton)
- doc: default values for mon\_health\_to\_clog\_\* were flipped ([pr#30003](https://github.com/ceph/ceph/pull/30003), James McClune)
- doc: fix urls in posix.rst ([pr#30686](https://github.com/ceph/ceph/pull/30686), Jos Collin)
- doc: max\_misplaced option was renamed in Nautilus ([pr#30649](https://github.com/ceph/ceph/pull/30649), Nathan Fish)
- doc: pg\_num should always be a power of two ([pr#30004](https://github.com/ceph/ceph/pull/30004), Lars Marowsky-Bree, Kai Wagner)
- doc: update bluestore cache settings and clarify data fraction ([issue#39522](http://tracker.ceph.com/issues/39522), [pr#31259](https://github.com/ceph/ceph/pull/31259), Jan Fajerski)
- mgr/ActivePyModules: behave if a module queries a devid that does not exist ([pr#31411](https://github.com/ceph/ceph/pull/31411), Sage Weil)
- mgr/BaseMgrStandbyModule: drop GIL in ceph\_get\_module\_option() ([pr#30773](https://github.com/ceph/ceph/pull/30773), Kefu Chai)
- mgr/balancer: python3 compatibility issue ([pr#31012](https://github.com/ceph/ceph/pull/31012), Mykola Golub)
- mgr/crash: backport archive feature, health alerts ([pr#30851](https://github.com/ceph/ceph/pull/30851), Sage Weil)
- mgr/crash: try client.crash\[.host\] before client.admin; add mon profile ([issue#40781](http://tracker.ceph.com/issues/40781), [pr#30844](https://github.com/ceph/ceph/pull/30844), Sage Weil, Dan Mick)
- mgr/dashboard: Add transifex-i18ntool ([pr#31160](https://github.com/ceph/ceph/pull/31160), Sebastian Krah)
- mgr/dashboard: Allow disabling redirection on standby dashboards ([issue#41813](https://tracker.ceph.com/issues/41813), [pr#30382](https://github.com/ceph/ceph/pull/30382), Volker Theile)
- mgr/dashboard: Configuring an URL prefix does not work as expected ([pr#31375](https://github.com/ceph/ceph/pull/31375), Volker Theile)
- mgr/dashbaord: Fix calculation of PG status percentage ([issue#41809](https://tracker.ceph.com/issues/41089), [pr#30394](https://github.com/ceph/ceph/pull/30394), Tiago Melo)
- mgr/dashboard: Fix CephFS chart ([pr#30691](https://github.com/ceph/ceph/pull/30691), Stephan Müller)
- mgr/dashboard: Fix grafana dashboards ([pr#31733](https://github.com/ceph/ceph/pull/31733), Radu Toader)
- mgr/dashboard: Improve position of MDS chart tooltip ([pr#31565](https://github.com/ceph/ceph/pull/31565), Tiago Melo)
- mgr/dashboard: Provide the name of the object being deleted ([pr#31263](https://github.com/ceph/ceph/pull/31263), Ricardo Marques)
- mgr/dashboard: RBD tests must use pools with power-of-two pg\_num ([pr#31522](https://github.com/ceph/ceph/pull/31522), Ricardo Marques)
- mgr/dashboard: Set RO as the default access\_type for RGW NFS exports ([pr#30516](https://github.com/ceph/ceph/pull/30516), Tiago Melo)
- mgr/dashboard: Wait for breadcrumb text is present in e2e tests ([pr#31576](https://github.com/ceph/ceph/pull/31576), Volker Theile)
- mgr/dashboard: access\_control: add grafana scope read access to \*-manager roles ([pr#30259](https://github.com/ceph/ceph/pull/30259), Ricardo Dias)
- mgr/dashboard: do not log tokens ([pr#31413](https://github.com/ceph/ceph/pull/31413), Kefu Chai)
- mgr/dashboard: do not show non-pool data in pool details ([pr#31516](https://github.com/ceph/ceph/pull/31516), Alfonso Martínez)
- mgr/dashboard: edit/clone/copy rbd image after its data is received ([pr#31349](https://github.com/ceph/ceph/pull/31349), Alfonso Martínez)
- mgr/dashboard: internationalization support with AOT enabled ([pr#30910](https://github.com/ceph/ceph/pull/30910), Ricardo Dias, Tiago Melo)
- mgr/dashboard: run-backend-api-tests.sh improvements ([pr#29487](https://github.com/ceph/ceph/pull/29487), Alfonso Martínez, Kefu Chai)
- mgr/dashboard: tasks: only unblock controller thread after TaskManager thread ([pr#31526](https://github.com/ceph/ceph/pull/31526), Ricardo Dias)
- mgr/devicehealth: do not scrape mon devices ([pr#31446](https://github.com/ceph/ceph/pull/31446), Sage Weil)
- mgr/devicehealth: import \_strptime directly ([pr#32082](https://github.com/ceph/ceph/pull/32082), Sage Weil)
- mgr/k8sevents: Initial ceph -> k8s events integration ([pr#30215](https://github.com/ceph/ceph/pull/30215), Paul Cuzner, Sebastian Wagner)
- mgr/pg\_autoscaler: fix pool\_logical\_used ([pr#31100](https://github.com/ceph/ceph/pull/31100), Ansgar Jazdzewski)
- mgr/pg\_autoscaler: fix race with pool deletion ([pr#30008](https://github.com/ceph/ceph/pull/30008), Sage Weil)
- mgr/prometheus: Cast collect\_timeout (scrape\_interval) to float ([pr#30007](https://github.com/ceph/ceph/pull/30007), Ben Meekhof)
- mgr/prometheus: Fix KeyError in get\_mgr\_status ([pr#30774](https://github.com/ceph/ceph/pull/30774), Sebastian Wagner)
- mgr/rbd\_support: module.py:1088: error: Name ‘image\_spec’ is not defined ([pr#29978](https://github.com/ceph/ceph/pull/29978), Jason Dillaman)
- mgr/restful: requests api adds support multiple commands ([pr#31334](https://github.com/ceph/ceph/pull/31334), Duncan Chiang)
- mgr/telemetry: backport a ton of stuff ([pr#30849](https://github.com/ceph/ceph/pull/30849), alfonsomthd, Kefu Chai, Sage Weil, Dan Mick)
- mgr/volumes: fix incorrect snapshot path creation ([pr#31076](https://github.com/ceph/ceph/pull/31076), Ramana Raja)
- mgr/volumes: handle exceptions in purge thread with retry ([issue#41218](http://tracker.ceph.com/issues/41218), [pr#30455](https://github.com/ceph/ceph/pull/30455), Venky Shankar)
- mgr/volumes: list FS subvolumes, subvolume groups, and their snapshots ([pr#30827](https://github.com/ceph/ceph/pull/30827), Jos Collin)
- mgr/volumes: minor fixes ([pr#29926](https://github.com/ceph/ceph/pull/29926), Venky Shankar, Jos Collin, Ramana Raja)
- mgr/volumes: protection for “fs volume rm” command ([pr#30768](https://github.com/ceph/ceph/pull/30768), Jos Collin, Ramana Raja)
- mgr/zabbix: Fix typo in key name for PGs in backfill\_wait state ([issue#39666](http://tracker.ceph.com/issues/39666), [pr#30006](https://github.com/ceph/ceph/pull/30006), Wido den Hollander)
- mgr/zabbix: encode string for Python 3 compatibility ([pr#30016](https://github.com/ceph/ceph/pull/30016), Nathan Cutler)
- mgr/{dashboard,prometheus}: return FQDN instead of ‘0.0.0.0’ ([pr#31482](https://github.com/ceph/ceph/pull/31482), Patrick Seidensal)
- mgr: Release GIL before calling OSDMap::calc\_pg\_upmaps() ([pr#31682](https://github.com/ceph/ceph/pull/31682), David Zafman, Shyukri Shyukriev)
- mgr: Unable to reset / unset module options ([issue#40779](http://tracker.ceph.com/issues/40779), [pr#29550](https://github.com/ceph/ceph/pull/29550), Sebastian Wagner)
- mgr: do not reset reported if a new metric is not collected ([pr#30390](https://github.com/ceph/ceph/pull/30390), Ilsoo Byun)
- mgr: fix weird health-alert daemon key ([pr#31039](https://github.com/ceph/ceph/pull/31039), xie xingguo)
- mgr: set hostname in DeviceState::set\_metadata() ([pr#30624](https://github.com/ceph/ceph/pull/30624), Kefu Chai)
- pybind/cephfs: Modification to error message ([pr#30026](https://github.com/ceph/ceph/pull/30026), Varsha Rao)
- pybind/rados: fix set\_omap() crash on py3 ([pr#30622](https://github.com/ceph/ceph/pull/30622), Sage Weil)
- pybind/rbd: deprecate parent\_info ([pr#30818](https://github.com/ceph/ceph/pull/30818), Ricardo Marques)
- rbd: rbd-mirror: cannot restore deferred deletion mirrored images ([pr#30825](https://github.com/ceph/ceph/pull/30825), Jason Dillaman, Mykola Golub)
- rbd: rbd-mirror: don’t overwrite status error returned by replay ([pr#29870](https://github.com/ceph/ceph/pull/29870), Mykola Golub)
- rbd: rbd-mirror: ignore errors relating to parsing the cluster config file ([pr#30116](https://github.com/ceph/ceph/pull/30116), Jason Dillaman)
- rbd: rbd-mirror: simplify peer bootstrapping ([pr#30821](https://github.com/ceph/ceph/pull/30821), Jason Dillaman)
- rbd: rbd-nbd: add netlink support and nl resize ([pr#30532](https://github.com/ceph/ceph/pull/30532), Mike Christie)
- rbd: cls/rbd: sanitize entity instance messenger version type ([pr#30822](https://github.com/ceph/ceph/pull/30822), Jason Dillaman)
- rbd: cls/rbd: sanitize the mirror image status peer address after reading from disk ([pr#31833](https://github.com/ceph/ceph/pull/31833), Jason Dillaman)
- rbd: krbd: avoid udev netlink socket overrun and retry on transient errors from udev\_enumerate\_scan\_devices() ([pr#31075](https://github.com/ceph/ceph/pull/31075), Ilya Dryomov, Adam C. Emerson)
- rbd: librbd: always try to acquire exclusive lock when removing image ([pr#29869](https://github.com/ceph/ceph/pull/29869), Mykola Golub)
- rbd: librbd: behave more gracefully when data pool removed ([pr#30824](https://github.com/ceph/ceph/pull/30824), Mykola Golub)
- rbd: librbd: v1 clones are restricted to the same namespace ([pr#30823](https://github.com/ceph/ceph/pull/30823), Jason Dillaman)
- mgr/restful: Query nodes\_by\_id for items ([pr#31261](https://github.com/ceph/ceph/pull/31261), Boris Ranto)
- rgw/amqp: fix race condition in AMQP unit test ([pr#30889](https://github.com/ceph/ceph/pull/30889), Yuval Lifshitz)
- rgw/amqp: remove flaky amqp test ([pr#31628](https://github.com/ceph/ceph/pull/31628), Yuval Lifshitz)
- rgw/pubsub: backport notifications and pubsub ([pr#30579](https://github.com/ceph/ceph/pull/30579), Yuval Lifshitz)
- rgw/rgw\_op: Remove get\_val from hotpath via legacy options ([pr#30160](https://github.com/ceph/ceph/pull/30160), Mark Nelson)
- rgw: Potential crash in putbj ([pr#29898](https://github.com/ceph/ceph/pull/29898), Adam C. Emerson)
- rgw: Put User Policy is sensitive to whitespace ([pr#29970](https://github.com/ceph/ceph/pull/29970), Abhishek Lekshmanan)
- rgw: RGWCoroutine::call(nullptr) sets retcode=0 ([pr#30248](https://github.com/ceph/ceph/pull/30248), Casey Bodley)
- rgw: Swift metadata dropped after S3 bucket versioning enabled ([pr#29961](https://github.com/ceph/ceph/pull/29961), Marcus Watts)
- rgw: add S3 object lock feature to support object worm ([pr#29905](https://github.com/ceph/ceph/pull/29905), Chang Liu, Casey Bodley, zhang Shaowen)
- rgw: add minssing admin property when sync user info ([pr#30680](https://github.com/ceph/ceph/pull/30680), zhang Shaowen)
- rgw: beast frontend throws an exception when running out of FDs ([pr#29963](https://github.com/ceph/ceph/pull/29963), Yuval Lifshitz)
- rgw: data/bilogs are trimmed when no peers are reading them ([issue#39487](http://tracker.ceph.com/issues/39487), [pr#30999](https://github.com/ceph/ceph/pull/30999), Casey Bodley)
- rgw: datalog/mdlog trim commands loop until done ([pr#30869](https://github.com/ceph/ceph/pull/30869), Casey Bodley)
- rgw: dns name is not case sensitive ([issue#40995](http://tracker.ceph.com/issues/40995), [pr#29971](https://github.com/ceph/ceph/pull/29971), Casey Bodley, Abhishek Lekshmanan)
- rgw: fix a bug that lifecycle expiraton generates delete marker continuously ([issue#40393](http://tracker.ceph.com/issues/40393), [pr#30037](https://github.com/ceph/ceph/pull/30037), zhang Shaowen)
- rgw: fix cls\_bucket\_list\_unordered() partial results ([pr#30252](https://github.com/ceph/ceph/pull/30252), Mark Kogan)
- rgw: fix data sync start delay if remote haven’t init data\_log ([pr#30509](https://github.com/ceph/ceph/pull/30509), Tianshan Qu)
- rgw: fix default storage class for get\_compression\_type ([pr#31026](https://github.com/ceph/ceph/pull/31026), Casey Bodley)
- rgw: fix drain handles error when deleting bucket with bypass-gc option ([pr#29956](https://github.com/ceph/ceph/pull/29956), dongdong tao)
- rgw: fix list bucket with delimiter wrongly skip some special keys ([issue#40905](http://tracker.ceph.com/issues/40905), [pr#30068](https://github.com/ceph/ceph/pull/30068), Tianshan Qu)
- rgw: fix memory growth while deleteing objects with ([pr#30472](https://github.com/ceph/ceph/pull/30472), Mark Kogan)
- rgw: fix the bug of rgw not doing necessary checking to website configuration ([issue#40678](http://tracker.ceph.com/issues/40678), [pr#30325](https://github.com/ceph/ceph/pull/30325), Enming Zhang)
- rgw: fixed “unrecognized arg” error when using “radosgw-admin zone rm” ([pr#30247](https://github.com/ceph/ceph/pull/30247), Hongang Chen)
- rgw: housekeeping reset stats ([pr#29803](https://github.com/ceph/ceph/pull/29803), J. Eric Ivancich)
- rgw: increase beast parse buffer size to 64k ([pr#30437](https://github.com/ceph/ceph/pull/30437), Casey Bodley)
- rgw: ldap auth: S3 auth failure should return InvalidAccessKeyId ([pr#30651](https://github.com/ceph/ceph/pull/30651), Matt Benjamin)
- rgw: lifecycle days may be 0 ([pr#31073](https://github.com/ceph/ceph/pull/31073), Matt Benjamin)
- rgw: lifecycle transitions on non existent placement targets ([pr#29955](https://github.com/ceph/ceph/pull/29955), Abhishek Lekshmanan)
- rgw: list objects version 2 ([pr#29849](https://github.com/ceph/ceph/pull/29849), Albin Antony, zhang Shaowen)
- rgw: multisite: radosgw-admin bucket sync status incorrectly reports “caught up” during full sync ([issue#40806](http://tracker.ceph.com/issues/40806), [pr#29974](https://github.com/ceph/ceph/pull/29974), Casey Bodley)
- rgw: potential realm watch lost ([issue#40991](http://tracker.ceph.com/issues/40991), [pr#29972](https://github.com/ceph/ceph/pull/29972), Tianshan Qu)
- rgw: protect AioResultList by a lock to avoid race condition ([pr#30746](https://github.com/ceph/ceph/pull/30746), Ilsoo Byun)
- rgw: radosgw-admin: add –uid check in bucket list command ([pr#30604](https://github.com/ceph/ceph/pull/30604), Vikhyat Umrao)
- rgw: returns one byte more data than the requested range from the SLO object ([pr#29960](https://github.com/ceph/ceph/pull/29960), Andrey Groshev)
- rgw: rgw-admin: search for user by access key ([pr#29959](https://github.com/ceph/ceph/pull/29959), Matt Benjamin)
- rgw: rgw-log issues the wrong message when decompression fails ([pr#29965](https://github.com/ceph/ceph/pull/29965), Han Fengzhe)
- rgw: rgw\_file: directory enumeration can be accelerated 1-2 orders of magnitude taking stats from bucket index Part I (stats from S3/Swift only) ([issue#40456](http://tracker.ceph.com/issues/40456), [pr#29954](https://github.com/ceph/ceph/pull/29954), Matt Benjamin)
- rgw: rgw\_file: readdir: do not construct markers w/leading ‘/’ ([pr#29969](https://github.com/ceph/ceph/pull/29969), Matt Benjamin)
- rgw: silence warning “control reaches end of non-void function” ([issue#40747](http://tracker.ceph.com/issues/40747), [pr#31742](https://github.com/ceph/ceph/pull/31742), Jos Collin)
- rgw: sync with elastic search v7 ([pr#31027](https://github.com/ceph/ceph/pull/31027), Chang Liu)
- rgw: use explicit to\_string() overload for boost::string\_ref ([issue#39611](http://tracker.ceph.com/issues/39611), [pr#31650](https://github.com/ceph/ceph/pull/31650), Casey Bodley, Ulrich Weigand)
- rgw: when using radosgw-admin to list bucket, can set –max-entries excessively high ([pr#29777](https://github.com/ceph/ceph/pull/29777), J. Eric Ivancich)
- tests: “CMake Error” in test\_envlibrados\_for\_rocksdb.sh ([pr#29979](https://github.com/ceph/ceph/pull/29979), Kefu Chai)
- tests: Get libcephfs and cephfs to compile with FreeBSD ([pr#31136](https://github.com/ceph/ceph/pull/31136), Willem Jan Withagen)
- tests: add debugging failed osd-release setting ([pr#31040](https://github.com/ceph/ceph/pull/31040), Patrick Donnelly)
- tests: cephfs: fix malformed qa suite config ([pr#30038](https://github.com/ceph/ceph/pull/30038), Patrick Donnelly)
- tests: cls\_rbd/test\_cls\_rbd: update TestClsRbd.sparsify ([pr#30354](https://github.com/ceph/ceph/pull/30354), Kefu Chai)
- tests: cls\_rbd: removed mirror peer pool test cases ([pr#30948](https://github.com/ceph/ceph/pull/30948), Jason Dillaman)
- tests: enable dashboard tests to be run with “–suite rados/dashboard” ([pr#31248](https://github.com/ceph/ceph/pull/31248), Nathan Cutler)
- tests: librbd: set nbd timeout due to newer kernels defaulting it on ([pr#30423](https://github.com/ceph/ceph/pull/30423), Jason Dillaman)
- tests: qa/suites/krbd: run unmap subsuite with msgr1 only ([pr#31290](https://github.com/ceph/ceph/pull/31290), Ilya Dryomov)
- tests: qa/tasks/cbt: run stop-all.sh while shutting down ([pr#31304](https://github.com/ceph/ceph/pull/31304), Sage Weil)
- tests: qa/tasks/ceph.conf.template: increase mon tell retries ([pr#31641](https://github.com/ceph/ceph/pull/31641), Sage Weil)
- tests: qa/workunits/rbd: stress test rbd mirror pool status –verbose ([pr#29871](https://github.com/ceph/ceph/pull/29871), Mykola Golub)
- tests: qa: avoid page cache for krbd discard round off tests ([pr#30464](https://github.com/ceph/ceph/pull/30464), Ilya Dryomov)
- tests: qa: sleep briefly after resetting kclient ([pr#29750](https://github.com/ceph/ceph/pull/29750), Patrick Donnelly)
- tests: rados/mgr/tasks/module\_selftest: whitelist mgr client getting blacklisted ([issue#40867](http://tracker.ceph.com/issues/40867), [pr#29649](https://github.com/ceph/ceph/pull/29649), Sage Weil)
- tests: test\_librados\_build.sh: grab from nautilus branch in nautilus ([pr#31604](https://github.com/ceph/ceph/pull/31604), Nathan Cutler)
- tests: valgrind: UninitCondition in ceph::crypto::onwire::AES128GCM\_OnWireRxHandler::authenticated\_decrypt\_update\_final() ([issue#38827](http://tracker.ceph.com/issues/38827), [pr#29928](https://github.com/ceph/ceph/pull/29928), Radoslaw Zarzynski)
- tools/rados: add –pgid in help ([pr#30607](https://github.com/ceph/ceph/pull/30607), Vikhyat Umrao)
- tools/rados: call pool\_lookup() after rados is connected ([pr#30605](https://github.com/ceph/ceph/pull/30605), Vikhyat Umrao)
- tools/rbd-ggate: close log before running postfork ([pr#30120](https://github.com/ceph/ceph/pull/30120), Willem Jan Withagen)
- tools: ceph-backport.sh: add deprecation warning ([pr#30748](https://github.com/ceph/ceph/pull/30748), Nathan Cutler)
- tools: ceph-objectstore-tool can’t remove head with bad snapset ([pr#30080](https://github.com/ceph/ceph/pull/30080), David Zafman)
