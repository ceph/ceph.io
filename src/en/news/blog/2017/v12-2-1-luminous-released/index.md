---
title: "v12.2.1 Luminous released"
date: "2017-09-28"
author: "TheAnalyst"
tags:
  - "release"
  - "luminous"
---

This is the first bugfix release of Luminous v12.2.x long term stable release series. It contains a range of bug fixes and a few features across CephFS, RBD & RGW. We recommend all the users of 12.2.x series update.

### Notable Changes

- Dynamic resharding is now enabled by default for RGW, RGW will now automatically reshard there bucket index once the index grows beyond rgw\_max\_objs\_per\_shard
- Limiting MDS cache via a memory limit is now supported using the new mds\_cache\_memory\_limit config option (1GB by default). A cache reservation can also be specified using mds\_cache\_reservation as a percentage of the limit (5% by default). Limits by inode count are still supported using mds\_cache\_size. Setting mds\_cache\_size to 0 (the default) disables the inode limit.
- The maximum number of PGs per OSD before the monitor issues a warning has been reduced from 300 to 200 PGs. 200 is still twice the generally recommended target of 100 PGs per OSD. This limit can be adjusted via the `mon_max_pg_per_osd` option on the monitors. The older `mon_pg_warn_max_per_osd` option has been removed.
- Creating pools or adjusting pg\_num will now fail if the change would make the number of PGs per OSD exceed the configured `mon_max_pg_per_osd` limit. The option can be adjusted if it is really necessary to create a pool with more PGs.
- There was a bug in the PG mapping behavior of the new _upmap_ feature. If you made use of this feature (e.g., via the ceph osd pg-upmap-items command), we recommend that all mappings be removed (via the ceph osd rm-pg-upmap-items command) before upgrading to this point release.
- A stall in BlueStore IO submission that was affecting many users has been resolved.

### Other Notable Changes

For more details refer to [the complete changelog](https://github.com/ceph/ceph/blob/master/doc/changelog/v12.2.1.txt)

- bluestore: asyn cdeferred\_try\_submit deadlock ([issue#21207](http://tracker.ceph.com/issues/21207), [pr#17494](https://github.com/ceph/ceph/pull/17494), Sage Weil)
- bluestore: fix deferred write deadlock, aio short return handling ([issue#21171](http://tracker.ceph.com/issues/21171), [pr#17601](https://github.com/ceph/ceph/pull/17601), Sage Weil)
- bluestore: osd crash when change option bluestore\_csum\_type from none to CRC32 ([issue#21175](http://tracker.ceph.com/issues/21175), [pr#17497](https://github.com/ceph/ceph/pull/17497), xie xingguo)
- bluestore: os/bluestore/BlueFS.cc: 1255: FAILED assert(!log\_file->fnode.extents.empty()) ([issue#21250](http://tracker.ceph.com/issues/21250), [pr#17562](https://github.com/ceph/ceph/pull/17562), Sage Weil)
- build/ops: ceph-fuse RPM should require fusermount ([issue#21057](http://tracker.ceph.com/issues/21057), [pr#17470](https://github.com/ceph/ceph/pull/17470), Ken Dreyer)
- build/ops: RHEL 7.3 Selinux denials at OSD start ([issue#19200](http://tracker.ceph.com/issues/19200), [pr#17468](https://github.com/ceph/ceph/pull/17468), Boris Ranto)
- build/ops: rocksdb,cmake: build portable binaries ([issue#20529](http://tracker.ceph.com/issues/20529), [pr#17745](https://github.com/ceph/ceph/pull/17745), Kefu Chai)
- cephfs: client/mds has wrong check to clear S\_ISGID on chown ([issue#21004](http://tracker.ceph.com/issues/21004), [pr#17471](https://github.com/ceph/ceph/pull/17471), Patrick Donnelly)
- cephfs: get\_quota\_root sends lookupname op for every buffered write ([issue#20945](http://tracker.ceph.com/issues/20945), [pr#17473](https://github.com/ceph/ceph/pull/17473), Dan van der Ster)
- cephfs: MDCache::try\_subtree\_merge() may print N^2 lines of debug message ([issue#21221](http://tracker.ceph.com/issues/21221), [pr#17712](https://github.com/ceph/ceph/pull/17712), Patrick Donnelly)
- cephfs: MDS rank add/remove log messages say wrong number of ranks ([issue#21421](http://tracker.ceph.com/issues/21421), [pr#17887](https://github.com/ceph/ceph/pull/17887), John Spray)
- cephfs: MDS: standby-replay mds should avoid initiating subtree export ([issue#21378](http://tracker.ceph.com/issues/21378), [issue#21222](http://tracker.ceph.com/issues/21222), [pr#17714](https://github.com/ceph/ceph/pull/17714), “Yan, Zheng”, Jianyu Li)
- cephfs: the standbys are not updated via ceph tell mds.\* command ([issue#21230](http://tracker.ceph.com/issues/21230), [pr#17565](https://github.com/ceph/ceph/pull/17565), Kefu Chai)
- common: adding line break at end of some cli results ([issue#21019](http://tracker.ceph.com/issues/21019), [pr#17467](https://github.com/ceph/ceph/pull/17467), songweibin)
- core: \[cls\] metadata\_list API function does not honor max\_return parameter ([issue#21247](http://tracker.ceph.com/issues/21247), [pr#17558](https://github.com/ceph/ceph/pull/17558), Jason Dillaman)
- core: incorrect erasure-code space in command ceph df ([issue#21243](http://tracker.ceph.com/issues/21243), [pr#17724](https://github.com/ceph/ceph/pull/17724), liuchang0812)
- core: interval\_set: optimize intersect\_of insert operations ([issue#21229](http://tracker.ceph.com/issues/21229), [pr#17487](https://github.com/ceph/ceph/pull/17487), Zac Medico)
- core: osd crush rule rename not idempotent ([issue#21162](http://tracker.ceph.com/issues/21162), [pr#17481](https://github.com/ceph/ceph/pull/17481), xie xingguo)
- core: osd/PGLog: write only changed dup entries ([issue#21026](http://tracker.ceph.com/issues/21026), [pr#17378](https://github.com/ceph/ceph/pull/17378), Josh Durgin)
- doc: doc/rbd: iSCSI Gateway Documentation ([issue#20437](http://tracker.ceph.com/issues/20437), [pr#17381](https://github.com/ceph/ceph/pull/17381), Aron Gunn, Jason Dillaman)
- mds: fix ‘dirfrag end’ check in Server::handle\_client\_readdir ([issue#21070](http://tracker.ceph.com/issues/21070), [pr#17686](https://github.com/ceph/ceph/pull/17686), “Yan, Zheng”)
- mds: support limiting cache by memory ([issue#20594](http://tracker.ceph.com/issues/20594), [pr#17711](https://github.com/ceph/ceph/pull/17711), “Yan, Zheng”, Patrick Donnelly)
- mgr: 500 error when attempting to view filesystem data ([issue#20692](http://tracker.ceph.com/issues/20692), [pr#17477](https://github.com/ceph/ceph/pull/17477), John Spray)
- mgr: ceph mgr versions shows active mgr as Unknown ([issue#21260](http://tracker.ceph.com/issues/21260), [pr#17635](https://github.com/ceph/ceph/pull/17635), John Spray)
- mgr: Crash in MonCommandCompletion ([issue#21157](http://tracker.ceph.com/issues/21157), [pr#17483](https://github.com/ceph/ceph/pull/17483), John Spray)
- mon: mon/OSDMonitor: deleting pool while pgs are being created leads to assert(p != pools.end) in update\_creating\_pgs() ([issue#21309](http://tracker.ceph.com/issues/21309), [pr#17634](https://github.com/ceph/ceph/pull/17634), Joao Eduardo Luis)
- mon: OSDMonitor: osd pool application get support ([issue#20976](http://tracker.ceph.com/issues/20976), [pr#17472](https://github.com/ceph/ceph/pull/17472), xie xingguo)
- mon: rate limit on health check update logging ([issue#20888](http://tracker.ceph.com/issues/20888), [pr#17500](https://github.com/ceph/ceph/pull/17500), John Spray)
- osd: build\_initial\_pg\_history doesn’t update up/acting/etc ([issue#21203](http://tracker.ceph.com/issues/21203), [pr#17496](https://github.com/ceph/ceph/pull/17496), w11979, Sage Weil)
- osd: osd/PG: discard msgs from down peers ([issue#19605](http://tracker.ceph.com/issues/19605), [pr#17501](https://github.com/ceph/ceph/pull/17501), Kefu Chai)
- osd/PrimaryLogPG: request osdmap update in the right block ([issue#21428](http://tracker.ceph.com/issues/21428), [pr#17829](https://github.com/ceph/ceph/pull/17829), Josh Durgin)
- osd: PrimaryLogPG: sparse read won’t trigger repair correctly ([issue#21123](http://tracker.ceph.com/issues/21123), [pr#17475](https://github.com/ceph/ceph/pull/17475), xie xingguo)
- osd: request new map from PG when needed ([issue#21428](http://tracker.ceph.com/issues/21428), [pr#17796](https://github.com/ceph/ceph/pull/17796), Josh Durgin)
- osd: Revert “osd/OSDMap: allow bidirectional swap of pg-upmap-items” ([issue#21410](http://tracker.ceph.com/issues/21410), [pr#17812](https://github.com/ceph/ceph/pull/17812), Sage Weil)
- osd: subscribe to new osdmap while waiting\_for\_healthy ([issue#21121](http://tracker.ceph.com/issues/21121), [pr#17498](https://github.com/ceph/ceph/pull/17498), Sage Weil)
- osd: update info only if new\_interval ([issue#21203](http://tracker.ceph.com/issues/21203), [pr#17622](https://github.com/ceph/ceph/pull/17622), Kefu Chai)
- pybind: dashboard usage graph getting bigger and bigger ([issue#20746](http://tracker.ceph.com/issues/20746), [pr#17486](https://github.com/ceph/ceph/pull/17486), Yixing Yan)
- rbd: image-meta list does not return all entries ([issue#21179](http://tracker.ceph.com/issues/21179), [pr#17561](https://github.com/ceph/ceph/pull/17561), Jason Dillaman)
- rbd: some generic options can not be passed by rbd-nbd ([issue#20426](http://tracker.ceph.com/issues/20426), [pr#17557](https://github.com/ceph/ceph/pull/17557), Pan Liu)
- rbd: switch to new config option getter methods ([issue#20737](http://tracker.ceph.com/issues/20737), [pr#17464](https://github.com/ceph/ceph/pull/17464), Jason Dillaman)
- rbd: TestMirroringWatcher.ModeUpdated: periodic failure due to injected message failures ([issue#21029](http://tracker.ceph.com/issues/21029), [pr#17465](https://github.com/ceph/ceph/pull/17465), Jason Dillaman)
- rgw: bucket index sporadically reshards to 65521 shards ([issue#20934](http://tracker.ceph.com/issues/20934), [pr#17476](https://github.com/ceph/ceph/pull/17476), Aleksei Gutikov)
- rgw: bytes\_send and bytes\_recv in the msg of usage show returning is 0 in master branch ([issue#19870](http://tracker.ceph.com/issues/19870), [pr#17444](https://github.com/ceph/ceph/pull/17444), Marcus Watts)
- rgw: data encryption sometimes fails to follow AWS settings ([issue#21349](http://tracker.ceph.com/issues/21349), [pr#17642](https://github.com/ceph/ceph/pull/17642), hechuang)
- rgw: memory leak in MetadataHandlers ([issue#21214](http://tracker.ceph.com/issues/21214), [pr#17570](https://github.com/ceph/ceph/pull/17570), Luo Kexue, Jos Collin)
- rgw: multisite: objects encrypted with SSE-KMS are stored unencrypted in target zone ([issue#20668](http://tracker.ceph.com/issues/20668), [issue#20671](http://tracker.ceph.com/issues/20671), [pr#17446](https://github.com/ceph/ceph/pull/17446), Casey Bodley)
- rgw: need to stream metadata full sync init ([issue#18079](http://tracker.ceph.com/issues/18079), [pr#17448](https://github.com/ceph/ceph/pull/17448), Yehuda Sadeh)
- rgw: object copied from remote src acl permission become full-control issue ([issue#20658](http://tracker.ceph.com/issues/20658), [pr#17478](https://github.com/ceph/ceph/pull/17478), Enming Zhang)
- rgw: put lifecycle configuration fails if Prefix is not set ([issue#19587](http://tracker.ceph.com/issues/19587), [issue#20872](http://tracker.ceph.com/issues/20872), [pr#17479](https://github.com/ceph/ceph/pull/17479), Shasha Lu, Abhishek Lekshmanan)
- rgw: rgw\_file: incorrect lane lock behavior in evict\_block() ([issue#21141](http://tracker.ceph.com/issues/21141), [pr#17485](https://github.com/ceph/ceph/pull/17485), Matt Benjamin)
- rgw: send data-log list infinitely ([issue#20951](http://tracker.ceph.com/issues/20951), [pr#17445](https://github.com/ceph/ceph/pull/17445), fang.yuxiang)
- rgw: shadow objects are sometimes not removed ([issue#20234](http://tracker.ceph.com/issues/20234), [pr#17555](https://github.com/ceph/ceph/pull/17555), Yehuda Sadeh)
- rgw: usage of –inconsistent-index should require user confirmation and print a warning ([issue#20777](http://tracker.ceph.com/issues/20777), [pr#17488](https://github.com/ceph/ceph/pull/17488), Orit Wasserman)
- tools: \[cli\] rename of non-existent image results in seg fault ([issue#21248](http://tracker.ceph.com/issues/21248), [pr#17556](https://github.com/ceph/ceph/pull/17556), Jason Dillaman)
