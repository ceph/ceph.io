---
title: "12.2.7 Luminous released"
date: "2018-07-17"
author: "TheAnalyst"
tags:
  - "release"
  - "luminous"
---

This is the seventh bugfix release of Luminous v12.2.x long term stable release series. This release contains several fixes for regressions in the v12.2.6 and v12.2.5 releases. We recommend that all users upgrade to v12.2.7.

<table class="docutils field-list" frame="void" rules="none"><colgroup><col class="field-name"> <col class="field-body"> </colgroup><tbody valign="top"><tr class="field-odd field"><th class="field-name">note:</th><td class="field-body">The v12.2.6 release has serious known regressions. While 12.2.6 wasn't formally announced, if you've still installed this release, please see the upgrade procedure below.</td></tr><tr class="field-even field"><th class="field-name">note:</th><td class="field-body">The v12.2.5 release has a potential data corruption issue with erasure coded pools. If you ran v12.2.5 with erasure coding, please see below.</td></tr></tbody></table>

## Upgrading from v12.2.6

v12.2.6 included an incomplete backport of an optimization for BlueStore OSDs that avoids maintaining both the per-object checksum and the internal BlueStore checksum. Due to the accidental omission of a critical follow-on patch, v12.2.6 corrupts (fails to update) the stored per-object checksum value for some objects. This can result in an EIO error when trying to read those objects.

1. If your cluster uses FileStore only, no special action is required. This problem only affects clusters with BlueStore.
    
2. If your cluster has only BlueStore OSDs (no FileStore), then you should enable the following OSD option:
    
    osd skip data digest \= true
    
    This will avoid setting and start ignoring the full-object digests whenever the primary for a PG is BlueStore.
3. If you have a mix of BlueStore and FileStore OSDs, then you should enable the following OSD option:
    
    osd distrust data digest \= true
    
    This will avoid setting and start ignoring the full-object digests in all cases. This weakens the data integrity checks for FileStore (although those checks were always only opportunistic).

If your cluster includes BlueStore OSDs and was affected, deep scrubs will generate errors about mismatched CRCs for affected objects. Currently the repair operation does not know how to correct them (since all replicas do not match the expected checksum it does not know how to proceed). These warnings are harmless in the sense that IO is not affected and the replicas are all still in sync. The number of affected objects is likely to drop (possibly to zero) on their own over time as those objects are modified. We expect to include a scrub improvement in v12.2.8 to clean up any remaining objects.

Additionally, see the notes below, which apply to both v12.2.5 and v12.2.6.

## Upgrading from v12.2.5 or v12.2.6

If you used v12.2.5 or v12.2.6 in combination with erasure coded pools, there is a small risk of corruption under certain workloads. Specifically, when:

- An erasure coded pool is in use
- The pool is busy with successful writes
- The pool is also busy with updates that result in an error result to the librados user. RGW garbage collection is the most common example of this (it sends delete operations on objects that don’t always exist.)
- Some OSDs are reasonably busy. One known example of such load is FileStore splitting, although in principle any load on the cluster could also trigger the behavior.
- One or more OSDs restarts.

This combination can trigger an OSD crash and possibly leave PGs in a state where they fail to peer.

Notably, upgrading a cluster involves OSD restarts and as such may increase the risk of encountering this bug. For this reason, for clusters with erasure coded pools, we recommend the following upgrade procedure to minimize risk:

1. Install the v12.2.7 packages.
    
2. Temporarily quiesce IO to cluster:
    
    ceph osd pause
    
3. Restart all OSDs and wait for all PGs to become active.
    
4. Resume IO:
    
    ceph osd unpause
    

This will cause an availability outage for the duration of the OSD restarts. If this in unacceptable, an _more risky_ alternative is to disable RGW garbage collection (the primary known cause of these rados operations) for the duration of the upgrade:

1\. Set \`\`rgw\_enable\_gc\_threads = false\`\` in ceph.conf

2\. Restart all radosgw daemons

3\. Upgrade and restart all OSDs

4\. Remove \`\`rgw\_enable\_gc\_threads = false\`\` from ceph.conf

5\. Restart all radosgw daemons

## Upgrading from other versions

If your cluster did not run v12.2.5 or v12.2.6 then none of the above issues apply to you and you should upgrade normally.

## v12.2.7 Changelog

- mon/AuthMonitor: improve error message ([issue#21765](http://tracker.ceph.com/issues/21765), [pr#22963](https://github.com/ceph/ceph/pull/22963), Douglas Fuller)
- osd/PG: do not blindly roll forward to log.head ([issue#24597](http://tracker.ceph.com/issues/24597), [pr#22976](https://github.com/ceph/ceph/pull/22976), Sage Weil)
- osd/PrimaryLogPG: rebuild attrs from clients ([issue#24768](http://tracker.ceph.com/issues/24768), [pr#22962](https://github.com/ceph/ceph/pull/22962), Sage Weil)
- osd: work around data digest problems in 12.2.6 (version 2) ([issue#24922](http://tracker.ceph.com/issues/24922), [pr#23055](https://github.com/ceph/ceph/pull/23055), Sage Weil)
- rgw: objects in cache never refresh after rgw\_cache\_expiry\_interval ([issue#24346](http://tracker.ceph.com/issues/24346), [pr#22369](https://github.com/ceph/ceph/pull/22369), Casey Bodley, Matt Benjamin)

## Notable Changes in v12.2.6

<table class="docutils field-list" frame="void" rules="none"><colgroup><col class="field-name"> <col class="field-body"> </colgroup><tbody valign="top"><tr class="field-odd field"><th class="field-name">note:</th><td class="field-body">This is a broken release with serious known regressions. Do not install it. The release notes below are to track the fixes that were a part of 12.2.6 (and hence 12.2.7)</td></tr></tbody></table>

- _Auth_:
    - In 12.2.4 and earlier releases, keyring caps were not checked for validity, so the caps string could be anything. As of 12.2.6, caps strings are validated and providing a keyring with an invalid caps string to, e.g., “ceph auth add” will result in an error.
    - CVE 2018-1128: auth: cephx authorizer subject to replay attack ([issue#24836](http://tracker.ceph.com/issues/24836), Sage Weil)
    - CVE 2018-1129: auth: cephx signature check is weak ([issue#24837](http://tracker.ceph.com/issues/24837), Sage Weil)
    - CVE 2018-10861: mon: auth checks not correct for pool ops ([issue#24838](http://tracker.ceph.com/issues/24838), Jason Dillaman)

- The config-key interface can store arbitrary binary blobs but JSON can only express printable strings. If binary blobs are present, the ‘ceph config-key dump’ command will show them as something like `<<< binary blob of length N >>>`.

## v12.2.6 Changelog

- build/ops: build-integration-branch script ([issue#24003](http://tracker.ceph.com/issues/24003), [pr#21919](https://github.com/ceph/ceph/pull/21919), Nathan Cutler, Kefu Chai, Sage Weil)
- cephfs-journal-tool: wait prezero ops before destroying journal ([issue#20549](http://tracker.ceph.com/issues/20549), [pr#21874](https://github.com/ceph/ceph/pull/21874), “Yan, Zheng”)
- cephfs: MDSMonitor: cleanup and protect fsmap access ([issue#23762](http://tracker.ceph.com/issues/23762), [pr#21732](https://github.com/ceph/ceph/pull/21732), Patrick Donnelly)
- cephfs: MDSMonitor: crash after assigning standby-replay daemon in multifs setup ([issue#23762](http://tracker.ceph.com/issues/23762), [issue#23658](http://tracker.ceph.com/issues/23658), [pr#22603](https://github.com/ceph/ceph/pull/22603), “Yan, Zheng”)
- cephfs: MDSMonitor: fix mds health printed in bad format ([issue#23582](http://tracker.ceph.com/issues/23582), [pr#21447](https://github.com/ceph/ceph/pull/21447), Patrick Donnelly)
- cephfs: MDSMonitor: initialize new Filesystem epoch from pending ([issue#23764](http://tracker.ceph.com/issues/23764), [pr#21512](https://github.com/ceph/ceph/pull/21512), Patrick Donnelly)
- ceph-fuse: missing dentries in readdir result ([issue#23894](http://tracker.ceph.com/issues/23894), [pr#22119](https://github.com/ceph/ceph/pull/22119), “Yan, Zheng”)
- ceph-fuse: return proper exit code ([issue#23665](http://tracker.ceph.com/issues/23665), [pr#21495](https://github.com/ceph/ceph/pull/21495), Patrick Donnelly)
- ceph-fuse: trim ceph-fuse -V output ([issue#23248](http://tracker.ceph.com/issues/23248), [pr#21600](https://github.com/ceph/ceph/pull/21600), Jos Collin)
- ceph\_test\_rados\_api\_aio: fix race with full pool and osdmap ([issue#23917](http://tracker.ceph.com/issues/23917), [issue#23876](http://tracker.ceph.com/issues/23876), [pr#21778](https://github.com/ceph/ceph/pull/21778), Sage Weil)
- ceph-volume: error on commands that need ceph.conf to operate ([issue#23941](http://tracker.ceph.com/issues/23941), [pr#22746](https://github.com/ceph/ceph/pull/22746), Andrew Schoen)
- ceph-volume: failed ceph-osd –mkfs command doesn’t halt the OSD creation process ([issue#23874](http://tracker.ceph.com/issues/23874), [pr#21746](https://github.com/ceph/ceph/pull/21746), Alfredo Deza)
- client: add ceph\_ll\_sync\_inode ([issue#23291](http://tracker.ceph.com/issues/23291), [pr#21109](https://github.com/ceph/ceph/pull/21109), Jeff Layton)
- client: add client option descriptions ([issue#22933](http://tracker.ceph.com/issues/22933), [pr#21589](https://github.com/ceph/ceph/pull/21589), Patrick Donnelly)
- client: anchor dentries for trimming to make cap traversal safe ([issue#24137](http://tracker.ceph.com/issues/24137), [pr#22201](https://github.com/ceph/ceph/pull/22201), Patrick Donnelly)
- client: avoid freeing inode when it contains TX buffer head ([issue#23837](http://tracker.ceph.com/issues/23837), [pr#22168](https://github.com/ceph/ceph/pull/22168), Guan yunfei, “Yan, Zheng”, Jason Dillaman)
- client: dirty caps may never get the chance to flush ([issue#22546](http://tracker.ceph.com/issues/22546), [pr#21278](https://github.com/ceph/ceph/pull/21278), dongdong tao)
- client: fix issue of revoking non-auth caps ([issue#24172](http://tracker.ceph.com/issues/24172), [pr#22221](https://github.com/ceph/ceph/pull/22221), “Yan, Zheng”)
- client: fix request send\_to\_auth was never really used ([issue#23541](http://tracker.ceph.com/issues/23541), [pr#21354](https://github.com/ceph/ceph/pull/21354), Zhi Zhang)
- client: Fix the gid\_count check ([issue#23652](http://tracker.ceph.com/issues/23652), [pr#21596](https://github.com/ceph/ceph/pull/21596), Jos Collin)
- client: flush the mdlog in \_fsync before waiting on unstable reqs ([issue#23714](http://tracker.ceph.com/issues/23714), [pr#21542](https://github.com/ceph/ceph/pull/21542), Jeff Layton)
- client: hangs on umount if it had an MDS session evicted ([issue#10915](http://tracker.ceph.com/issues/10915), [pr#22018](https://github.com/ceph/ceph/pull/22018), Rishabh Dave)
- client: void sending mds request while holding cap reference ([issue#24369](http://tracker.ceph.com/issues/24369), [pr#22354](https://github.com/ceph/ceph/pull/22354), “Yan, Zheng”)
- cmake: fix the cepfs java binding build on Bionic ([issue#23458](http://tracker.ceph.com/issues/23458), [issue#24012](http://tracker.ceph.com/issues/24012), [pr#21872](https://github.com/ceph/ceph/pull/21872), Kefu Chai, Shengjing Zhu)
- cmake/modules/BuildRocksDB.cmake: enable compressions for rocksdb ([issue#24025](http://tracker.ceph.com/issues/24025), [pr#22215](https://github.com/ceph/ceph/pull/22215), Kefu Chai)
- common: ARMv8 feature detection broken, leading to illegal instruction crashes ([issue#23464](http://tracker.ceph.com/issues/23464), [pr#22567](https://github.com/ceph/ceph/pull/22567), Adam Kupczyk)
- common: fix BoundedKeyCounter const\_pointer\_iterator ([issue#22139](http://tracker.ceph.com/issues/22139), [pr#21083](https://github.com/ceph/ceph/pull/21083), Casey Bodley)
- common: fix typo in rados bench write JSON output ([issue#24199](http://tracker.ceph.com/issues/24199), [pr#22391](https://github.com/ceph/ceph/pull/22391), Sandor Zeestraten)
- common: partially revert 95fc248 to make get\_process\_name work ([issue#24123](http://tracker.ceph.com/issues/24123), [pr#22290](https://github.com/ceph/ceph/pull/22290), Mykola Golub)
- core: Deleting a pool with active notify linger ops can result in seg fault ([issue#23966](http://tracker.ceph.com/issues/23966), [pr#22143](https://github.com/ceph/ceph/pull/22143), Kefu Chai, Jason Dillaman)
- core: mon/MgrMonitor: change ‘unresponsive’ message to info level ([issue#24222](http://tracker.ceph.com/issues/24222), [pr#22331](https://github.com/ceph/ceph/pull/22331), Sage Weil)
- core: Wip scrub omap ([issue#24366](http://tracker.ceph.com/issues/24366), [pr#22375](https://github.com/ceph/ceph/pull/22375), xie xingguo, David Zafman)
- crush: fix device\_class\_clone for unpopulated/empty weight-sets ([issue#23386](http://tracker.ceph.com/issues/23386), [pr#22381](https://github.com/ceph/ceph/pull/22381), Sage Weil)
- crush, osd: handle multiple parents properly when applying pg upmaps ([issue#23921](http://tracker.ceph.com/issues/23921), [pr#22115](https://github.com/ceph/ceph/pull/22115), xiexingguo)
- doc: Fix -d description in ceph-fuse ([issue#23214](http://tracker.ceph.com/issues/23214), [pr#21616](https://github.com/ceph/ceph/pull/21616), Jos Collin)
- doc:Update ceph-fuse doc ([issue#23084](http://tracker.ceph.com/issues/23084), [pr#21603](https://github.com/ceph/ceph/pull/21603), Jos Collin)
- fuse: wire up fuse\_ll\_access ([issue#23509](http://tracker.ceph.com/issues/23509), [pr#21475](https://github.com/ceph/ceph/pull/21475), Jeff Layton)
- kceph: umount on evicted client blocks forever ([issue#24053](http://tracker.ceph.com/issues/24053), [issue#24054](http://tracker.ceph.com/issues/24054), [pr#22208](https://github.com/ceph/ceph/pull/22208), Yan, Zheng, “Yan, Zheng”)
- librbd: commit IO as safe when complete if writeback cache is disabled ([issue#23516](http://tracker.ceph.com/issues/23516), [pr#22370](https://github.com/ceph/ceph/pull/22370), Jason Dillaman)
- librbd: prevent watcher from unregistering with in-flight actions ([issue#23955](http://tracker.ceph.com/issues/23955), [pr#21938](https://github.com/ceph/ceph/pull/21938), Jason Dillaman)
- lvm: when osd creation fails log the exception ([issue#24456](http://tracker.ceph.com/issues/24456), [pr#22641](https://github.com/ceph/ceph/pull/22641), Andrew Schoen)
- mds: avoid calling rejoin\_gather\_finish() two times successively ([issue#24047](http://tracker.ceph.com/issues/24047), [pr#22171](https://github.com/ceph/ceph/pull/22171), “Yan, Zheng”)
- mds: broadcast quota to relevant clients when quota is explicitly set ([issue#24133](http://tracker.ceph.com/issues/24133), [pr#22271](https://github.com/ceph/ceph/pull/22271), Zhi Zhang)
- mds: crash when failover ([issue#23518](http://tracker.ceph.com/issues/23518), [pr#21900](https://github.com/ceph/ceph/pull/21900), “Yan, Zheng”)
- mds: don’t discover inode/dirfrag when mds is in ‘starting’ state ([issue#23812](http://tracker.ceph.com/issues/23812), [pr#21990](https://github.com/ceph/ceph/pull/21990), “Yan, Zheng”)
- mds: fix occasional dir rstat inconsistency between multi-MDSes ([issue#23538](http://tracker.ceph.com/issues/23538), [pr#21617](https://github.com/ceph/ceph/pull/21617), “Yan, Zheng”, Zhi Zhang)
- mds: fix some memory leak ([issue#24289](http://tracker.ceph.com/issues/24289), [pr#22310](https://github.com/ceph/ceph/pull/22310), “Yan, Zheng”)
- mds: fix unhealth heartbeat during rejoin ([issue#23530](http://tracker.ceph.com/issues/23530), [pr#21366](https://github.com/ceph/ceph/pull/21366), dongdong tao)
- mds: handle imported session race ([issue#24072](http://tracker.ceph.com/issues/24072), [issue#24087](http://tracker.ceph.com/issues/24087), [pr#21989](https://github.com/ceph/ceph/pull/21989), Patrick Donnelly)
- mds: include nfiles/nsubdirs of directory inode in MClientCaps ([issue#23855](http://tracker.ceph.com/issues/23855), [pr#22118](https://github.com/ceph/ceph/pull/22118), “Yan, Zheng”)
- mds: kick rdlock if waiting for dirfragtreelock ([issue#23919](http://tracker.ceph.com/issues/23919), [pr#21901](https://github.com/ceph/ceph/pull/21901), Patrick Donnelly)
- mds: make rstat.rctime follow inodes’ ctime ([issue#23380](http://tracker.ceph.com/issues/23380), [pr#21448](https://github.com/ceph/ceph/pull/21448), “Yan, Zheng”)
- mds: mark damaged if sessions’ preallocated inos don’t match inotable ([issue#23452](http://tracker.ceph.com/issues/23452), [pr#21372](https://github.com/ceph/ceph/pull/21372), “Yan, Zheng”)
- mds: mark new root inode dirty ([issue#23960](http://tracker.ceph.com/issues/23960), [pr#21922](https://github.com/ceph/ceph/pull/21922), Patrick Donnelly)
- mds: mds shutdown fixes and optimization ([issue#23602](http://tracker.ceph.com/issues/23602), [pr#21346](https://github.com/ceph/ceph/pull/21346), “Yan, Zheng”)
- mds: misc load balancer fixes ([issue#21745](http://tracker.ceph.com/issues/21745), [pr#21412](https://github.com/ceph/ceph/pull/21412), “Yan, Zheng”, Jianyu Li)
- mds: properly check auth subtree count in MDCache::shutdown\_pass() ([issue#23813](http://tracker.ceph.com/issues/23813), [pr#21844](https://github.com/ceph/ceph/pull/21844), “Yan, Zheng”)
- mds: properly dirty sessions opened by journal replay ([issue#23625](http://tracker.ceph.com/issues/23625), [pr#21441](https://github.com/ceph/ceph/pull/21441), “Yan, Zheng”)
- mds: properly trim log segments after scrub repairs something ([issue#23880](http://tracker.ceph.com/issues/23880), [pr#21840](https://github.com/ceph/ceph/pull/21840), “Yan, Zheng”)
- mds: set could\_consume to false when no purge queue item actually exe… ([issue#24073](http://tracker.ceph.com/issues/24073), [pr#22176](https://github.com/ceph/ceph/pull/22176), Xuehan Xu)
- mds: trim log during shutdown to clean metadata ([issue#23923](http://tracker.ceph.com/issues/23923), [pr#21899](https://github.com/ceph/ceph/pull/21899), Patrick Donnelly)
- mds: underwater dentry check in CDir::\_omap\_fetched is racy ([issue#23032](http://tracker.ceph.com/issues/23032), [pr#21187](https://github.com/ceph/ceph/pull/21187), Yan, Zheng)
- mg\_read() call has wrong arguments ([issue#23596](http://tracker.ceph.com/issues/23596), [pr#21382](https://github.com/ceph/ceph/pull/21382), Nathan Cutler)
- mgr/influx: Only split string on first occurence of dot (.) ([issue#23996](http://tracker.ceph.com/issues/23996), [pr#21965](https://github.com/ceph/ceph/pull/21965), Wido den Hollander)
- mgr: Module ‘balancer’ has failed: could not find bucket -14 ([issue#24167](http://tracker.ceph.com/issues/24167), [pr#22308](https://github.com/ceph/ceph/pull/22308), Sage Weil)
- mon: add ‘ceph osd pool get erasure allow\_ec\_overwrites’ command ([issue#23487](http://tracker.ceph.com/issues/23487), [pr#21378](https://github.com/ceph/ceph/pull/21378), Mykola Golub)
- mon: enable level\_compaction\_dynamic\_level\_bytes for rocksdb ([issue#24361](http://tracker.ceph.com/issues/24361), [pr#22360](https://github.com/ceph/ceph/pull/22360), Kefu Chai)
- mon: handle bad snapshot removal reqs gracefully ([issue#18746](http://tracker.ceph.com/issues/18746), [pr#21717](https://github.com/ceph/ceph/pull/21717), Paul Emmerich)
- mon: High MON cpu usage when cluster is changing ([issue#23713](http://tracker.ceph.com/issues/23713), [pr#21968](https://github.com/ceph/ceph/pull/21968), Sage Weil, Xiaoxi CHEN)
- mon/MDSMonitor: do not send redundant MDS health messages to cluster log ([issue#24308](http://tracker.ceph.com/issues/24308), [pr#22558](https://github.com/ceph/ceph/pull/22558), Sage Weil)
- msg/async/AsyncConnection: Fix FPE in process\_connection ([issue#23618](http://tracker.ceph.com/issues/23618), [pr#21376](https://github.com/ceph/ceph/pull/21376), Brad Hubbard)
- os/bluestore: alter the allow\_eio policy regarding kernel’s error list ([issue#23333](http://tracker.ceph.com/issues/23333), [pr#21405](https://github.com/ceph/ceph/pull/21405), Radoslaw Zarzynski)
- os/bluestore/bluefs\_types: make block\_mask 64-bit ([issue#23840](http://tracker.ceph.com/issues/23840), [pr#21740](https://github.com/ceph/ceph/pull/21740), Sage Weil)
- os/bluestore: fix exceeding the max IO queue depth in KernelDevice ([issue#23246](http://tracker.ceph.com/issues/23246), [pr#21407](https://github.com/ceph/ceph/pull/21407), Radoslaw Zarzynski)
- os/bluestore: fix SharedBlobSet refcounting race ([issue#24319](http://tracker.ceph.com/issues/24319), [pr#22650](https://github.com/ceph/ceph/pull/22650), Sage Weil)
- os/bluestore: simplify and fix SharedBlob::put() ([issue#24211](http://tracker.ceph.com/issues/24211), [pr#22351](https://github.com/ceph/ceph/pull/22351), Sage Weil)
- osdc/Objecter: fix recursive locking in \_finish\_command ([issue#23940](http://tracker.ceph.com/issues/23940), [pr#21939](https://github.com/ceph/ceph/pull/21939), Sage Weil)
- osdc/Objecter: prevent double-invocation of linger op callback ([issue#23872](http://tracker.ceph.com/issues/23872), [pr#21752](https://github.com/ceph/ceph/pull/21752), Jason Dillaman)
- osd: do not crash on empty snapset ([issue#23851](http://tracker.ceph.com/issues/23851), [pr#21638](https://github.com/ceph/ceph/pull/21638), Mykola Golub, Igor Fedotov)
- osd: Don’t evict even when preemption has restarted with smaller chunk ([issue#22881](http://tracker.ceph.com/issues/22881), [issue#23909](http://tracker.ceph.com/issues/23909), [issue#23646](http://tracker.ceph.com/issues/23646), [pr#22044](https://github.com/ceph/ceph/pull/22044), Sage Weil, fang yuxiang, Jianpeng Ma, kungf, xie xingguo, David Zafman)
- osd/ECBackend: only check required shards when finishing recovery reads ([issue#23195](http://tracker.ceph.com/issues/23195), [pr#21911](https://github.com/ceph/ceph/pull/21911), Josh Durgin, Kefu Chai)
- osd: increase default hard pg limit ([issue#24243](http://tracker.ceph.com/issues/24243), [pr#22592](https://github.com/ceph/ceph/pull/22592), Josh Durgin)
- osd/OSDMap: check against cluster topology changing before applying pg upmaps ([issue#23878](http://tracker.ceph.com/issues/23878), [pr#21818](https://github.com/ceph/ceph/pull/21818), xiexingguo)
- osd/PG: fix DeferRecovery vs AllReplicasRecovered race ([issue#23860](http://tracker.ceph.com/issues/23860), [pr#21964](https://github.com/ceph/ceph/pull/21964), Sage Weil)
- osd/PG: fix uninit read in Incomplete::react(AdvMap&) ([issue#23980](http://tracker.ceph.com/issues/23980), [pr#21993](https://github.com/ceph/ceph/pull/21993), Sage Weil)
- osd/PrimaryLogPG: avoid infinite loop when flush collides with write … ([issue#23664](http://tracker.ceph.com/issues/23664), [pr#21764](https://github.com/ceph/ceph/pull/21764), Sage Weil)
- osd: publish osdmap to OSDService before starting wq threads ([issue#21977](http://tracker.ceph.com/issues/21977), [pr#21737](https://github.com/ceph/ceph/pull/21737), Sage Weil)
- osd: Warn about objects with too many omap entries ([issue#23784](http://tracker.ceph.com/issues/23784), [pr#21518](https://github.com/ceph/ceph/pull/21518), Brad Hubbard)
- qa: disable -Werror when compiling env\_librados\_test ([issue#23786](http://tracker.ceph.com/issues/23786), [pr#21655](https://github.com/ceph/ceph/pull/21655), Kefu Chai)
- qa: fix blacklisted check for test\_lifecycle ([issue#23975](http://tracker.ceph.com/issues/23975), [pr#21921](https://github.com/ceph/ceph/pull/21921), Patrick Donnelly)
- qa: remove racy/buggy test\_purge\_queue\_op\_rate ([issue#23829](http://tracker.ceph.com/issues/23829), [pr#21841](https://github.com/ceph/ceph/pull/21841), Patrick Donnelly)
- qa/suites/rbd/basic/msgr-failures: remove many.yaml ([issue#23789](http://tracker.ceph.com/issues/23789), [pr#22128](https://github.com/ceph/ceph/pull/22128), Sage Weil)
- qa: wait longer for osd to flush pg stats ([issue#24321](http://tracker.ceph.com/issues/24321), [pr#22296](https://github.com/ceph/ceph/pull/22296), Kefu Chai)
- qa/workunits/mon/test\_mon\_config\_key.py fails on master ([issue#23622](http://tracker.ceph.com/issues/23622), [pr#21368](https://github.com/ceph/ceph/pull/21368), Sage Weil)
- qa/workunits/rbd: adapt import\_export test to handle multiple units ([issue#24733](http://tracker.ceph.com/issues/24733), [pr#22911](https://github.com/ceph/ceph/pull/22911), Jason Dillaman)
- qa/workunits/rbd: potential race in mirror disconnect test ([issue#23938](http://tracker.ceph.com/issues/23938), [pr#21869](https://github.com/ceph/ceph/pull/21869), Mykola Golub)
- radosgw-admin sync status improvements ([issue#20473](http://tracker.ceph.com/issues/20473), [pr#21908](https://github.com/ceph/ceph/pull/21908), lvshanchun, Casey Bodley)
- rbd: improve ‘import-diff’ corrupt input error messages ([issue#18844](http://tracker.ceph.com/issues/18844), [issue#23038](http://tracker.ceph.com/issues/23038), [pr#21316](https://github.com/ceph/ceph/pull/21316), PCzhangPC, songweibin, Jason Dillaman)
- rbd-mirror: ensure remote demotion is replayed locally ([issue#24009](http://tracker.ceph.com/issues/24009), [pr#22142](https://github.com/ceph/ceph/pull/22142), Jason Dillaman)
- rbd-nbd can deadlock in logging thread ([issue#23143](http://tracker.ceph.com/issues/23143), [pr#21705](https://github.com/ceph/ceph/pull/21705), Sage Weil)
- rbd: python bindings fixes and improvements ([issue#23609](http://tracker.ceph.com/issues/23609), [pr#21725](https://github.com/ceph/ceph/pull/21725), Ricardo Dias)
- rbd: \[rbd-mirror\] asok hook for image replayer not re-registered after bootstrap ([issue#23888](http://tracker.ceph.com/issues/23888), [pr#21726](https://github.com/ceph/ceph/pull/21726), Jason Dillaman)
- rbd: \[rbd-mirror\] local tag predecessor mirror uuid is incorrectly replaced with remote ([issue#23876](http://tracker.ceph.com/issues/23876), [pr#21741](https://github.com/ceph/ceph/pull/21741), Jason Dillaman)
- rbd: \[rbd-mirror\] potential deadlock when running asok ‘flush’ command ([issue#24141](http://tracker.ceph.com/issues/24141), [pr#22180](https://github.com/ceph/ceph/pull/22180), Mykola Golub)
- rbd: \[rbd-mirror\] potential races during PoolReplayer shut-down ([issue#24008](http://tracker.ceph.com/issues/24008), [pr#22172](https://github.com/ceph/ceph/pull/22172), Jason Dillaman)
- rgw: add buffering filter to compression for fetch\_remote\_obj ([issue#23547](http://tracker.ceph.com/issues/23547), [pr#21758](https://github.com/ceph/ceph/pull/21758), Casey Bodley)
- rgw: add configurable AWS-compat invalid range get behavior ([issue#24317](http://tracker.ceph.com/issues/24317), [pr#22302](https://github.com/ceph/ceph/pull/22302), Matt Benjamin)
- rgw: admin rest api shouldn’t return error when getting user’s stats if ([issue#23821](http://tracker.ceph.com/issues/23821), [pr#21661](https://github.com/ceph/ceph/pull/21661), Zhang Shaowen)
- rgw: Allow swift acls to be deleted ([issue#22897](http://tracker.ceph.com/issues/22897), [pr#22465](https://github.com/ceph/ceph/pull/22465), Marcus Watts)
- rgw: aws4 auth supports PutBucketRequestPayment ([issue#23803](http://tracker.ceph.com/issues/23803), [pr#21660](https://github.com/ceph/ceph/pull/21660), Casey Bodley)
- rgw: beast frontend can listen on multiple endpoints ([issue#22779](http://tracker.ceph.com/issues/22779), [pr#21568](https://github.com/ceph/ceph/pull/21568), Casey Bodley)
- rgw: Bucket lifecycles stick around after buckets are deleted ([issue#19632](http://tracker.ceph.com/issues/19632), [pr#22551](https://github.com/ceph/ceph/pull/22551), Wei Qiaomiao)
- rgw: Do not modify email if argument is not set ([issue#24142](http://tracker.ceph.com/issues/24142), [pr#22352](https://github.com/ceph/ceph/pull/22352), Volker Theile)
- rgw: do not reflect period if not current ([issue#22844](http://tracker.ceph.com/issues/22844), [pr#21735](https://github.com/ceph/ceph/pull/21735), Tianshan Qu)
- rgw: es module: set compression type correctly ([issue#22758](http://tracker.ceph.com/issues/22758), [pr#21736](https://github.com/ceph/ceph/pull/21736), Abhishek Lekshmanan)
- rgw\_file: conditionally unlink handles when direct deleted ([issue#23299](http://tracker.ceph.com/issues/23299), [pr#21438](https://github.com/ceph/ceph/pull/21438), Matt Benjamin)
- rgw: fix bi\_list to reset is\_truncated flag if it skips entires ([issue#22721](http://tracker.ceph.com/issues/22721), [pr#21669](https://github.com/ceph/ceph/pull/21669), Orit Wasserman)
- rgw: fix ‘copy part’ without ‘x-amz-copy-source-range’ when compressi… ([issue#23196](http://tracker.ceph.com/issues/23196), [pr#22438](https://github.com/ceph/ceph/pull/22438), fang yuxiang)
- rgw: fix error handling for GET with ?torrent ([issue#23506](http://tracker.ceph.com/issues/23506), [pr#21674](https://github.com/ceph/ceph/pull/21674), Casey Bodley)
- rgw: fix use of libcurl with empty header values ([issue#23663](http://tracker.ceph.com/issues/23663), [pr#21738](https://github.com/ceph/ceph/pull/21738), Casey Bodley)
- rgw:lc: RGWPutLC return ERR\_MALFORMED\_XML when missing <Rule> tag in… ([issue#21377](http://tracker.ceph.com/issues/21377), [pr#19884](https://github.com/ceph/ceph/pull/19884), Shasha Lu)
- rgw: making implicit\_tenants backwards compatible ([issue#24348](http://tracker.ceph.com/issues/24348), [pr#22363](https://github.com/ceph/ceph/pull/22363), Marcus Watts)
- rgw: Misnamed S3 operation ([issue#24061](http://tracker.ceph.com/issues/24061), [pr#21917](https://github.com/ceph/ceph/pull/21917), xiangxiang)
- rgw: move all pool creation into rgw\_init\_ioctx ([issue#23480](http://tracker.ceph.com/issues/23480), [pr#21675](https://github.com/ceph/ceph/pull/21675), Casey Bodley)
- rgw: radosgw-admin should not use metadata cache for readonly commands ([issue#23468](http://tracker.ceph.com/issues/23468), [pr#21437](https://github.com/ceph/ceph/pull/21437), Orit Wasserman)
- rgw: raise log level on coroutine shutdown errors ([issue#23974](http://tracker.ceph.com/issues/23974), [pr#21792](https://github.com/ceph/ceph/pull/21792), Casey Bodley)
- rgw: return EINVAL if max\_keys can not convert correctly ([issue#23586](http://tracker.ceph.com/issues/23586), [pr#21435](https://github.com/ceph/ceph/pull/21435), yuliyang)
- rgw: rgw\_statfs should report the correct stats ([issue#22202](http://tracker.ceph.com/issues/22202), [pr#21724](https://github.com/ceph/ceph/pull/21724), Supriti Singh)
- rgw: trim all spaces inside a metadata value ([issue#23301](http://tracker.ceph.com/issues/23301), [pr#22177](https://github.com/ceph/ceph/pull/22177), Orit Wasserman)
- slow mon ops from osd\_failure ([issue#24322](http://tracker.ceph.com/issues/24322), [pr#22568](https://github.com/ceph/ceph/pull/22568), Sage Weil)
- table of contents doesn’t render for luminous/jewel docs ([issue#23780](http://tracker.ceph.com/issues/23780), [pr#21502](https://github.com/ceph/ceph/pull/21502), Alfredo Deza)
- test/librados: increase pgp\_num along with pg\_num ([issue#23763](http://tracker.ceph.com/issues/23763), [pr#21556](https://github.com/ceph/ceph/pull/21556), Kefu Chai)
- test/rgw: fix for bucket checkpoints ([issue#24212](http://tracker.ceph.com/issues/24212), [pr#22541](https://github.com/ceph/ceph/pull/22541), Casey Bodley)
- tests: filestore journal replay does not guard omap operations ([issue#22920](http://tracker.ceph.com/issues/22920), [pr#21547](https://github.com/ceph/ceph/pull/21547), Sage Weil)
- tools: ceph-disk: write log to /var/log/ceph not to /var/run/ceph ([issue#24041](http://tracker.ceph.com/issues/24041), [pr#21870](https://github.com/ceph/ceph/pull/21870), Kefu Chai)
- tools: ceph-fuse: getgroups failure causes exception ([issue#23446](http://tracker.ceph.com/issues/23446), [pr#21687](https://github.com/ceph/ceph/pull/21687), Jeff Layton)
