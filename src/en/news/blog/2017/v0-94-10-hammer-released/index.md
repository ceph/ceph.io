---
title: "v0.94.10 Hammer released"
date: "2017-02-22"
author: "TheAnalyst"
---

This Hammer point release fixes several bugs and adds two new features.

We recommend that all hammer v0.94.x users upgrade.

Please note that Hammer will be retired when Luminous is released later during the spring of this year. Until then the focus would be primarily on bugs that would hinder upgrades to Jewel.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.94.10.txt).

# New Features

ceph-objectstore-tool and ceph-monstore-tool now enable user to rebuild the monitor database from OSDs. (This feature is especially useful when all monitors fail to boot due to leveldb corruption.)

In RADOS Gateway, it is now possible to reshard an existing bucket's index using an off-line tool.

Usage:

$ radosgw-admin bucket reshard --bucket=<bucket\_name> --num\_shards=<num\_shards>

This will create a new linked bucket instance that points to the newly created index objects. The old bucket instance still exists and currently it's up to the user to manually remove the old bucket index objects. (Note that bucket resharding currently requires that all IO (especially writes) to the specific bucket is quiesced.)

# Other Notable Changes

- build/ops: ceph-create-keys loops forever ([issue#17753](http://tracker.ceph.com/issues/17753), [pr#12805](http://github.com/ceph/ceph/pull/12805), Alfredo Deza)
    
- build/ops: improve ceph.in error message ([issue#11101](http://tracker.ceph.com/issues/11101), [pr#10905](http://github.com/ceph/ceph/pull/10905), Kefu Chai)
    
- build/ops: make stop.sh more portable ([issue#16918](http://tracker.ceph.com/issues/16918), [pr#10569](http://github.com/ceph/ceph/pull/10569), Mykola Golub)
    
- build/ops: remove SYSTEMD\_RUN from initscript ([issue#16440](http://tracker.ceph.com/issues/16440), [issue#7627](http://tracker.ceph.com/issues/7627), [pr#9873](http://github.com/ceph/ceph/pull/9873), Vladislav Odintsov)
    
- cephx: Fix multiple segfaults due to attempts to encrypt or decrypt ([issue#16266](http://tracker.ceph.com/issues/16266), [pr#11930](http://github.com/ceph/ceph/pull/11930), Brad Hubbard)
    
- common: SIGABRT in TrackedOp::dump() via dump\_ops\_in\_flight() ([issue#8885](http://tracker.ceph.com/issues/8885), [pr#12121](http://github.com/ceph/ceph/pull/12121), Jianpeng Ma, Zhiqiang Wang, David Zafman)
    
- common: os/ObjectStore: fix \_update\_op for split dest\_cid ([issue#15345](http://tracker.ceph.com/issues/15345), [pr#12071](http://github.com/ceph/ceph/pull/12071), Sage Weil)
    
- crush: reset bucket->h.items\[i\] when removing tree item ([issue#16525](http://tracker.ceph.com/issues/16525), [pr#10724](http://github.com/ceph/ceph/pull/10724), Kefu Chai)
    
- doc: add "Upgrading to Hammer" section ([issue#17386](http://tracker.ceph.com/issues/17386), [pr#11372](http://github.com/ceph/ceph/pull/11372), Kefu Chai)
    
- doc: add orphan options to radosgw-admin --help and man page ([issue#17281](http://tracker.ceph.com/issues/17281), [issue#17280](http://tracker.ceph.com/issues/17280), [pr#11140](http://github.com/ceph/ceph/pull/11140), Abhishek Lekshmanan, Casey Bodley, Ken Dreyer, Thomas Serlin)
    
- doc: clarify that RGW bucket object versioning is supported ([issue#16574](http://tracker.ceph.com/issues/16574), [pr#10437](http://github.com/ceph/ceph/pull/10437), Yuan Zhou, shawn chen)
    
- librados: bad flags can crash the osd ([issue#16012](http://tracker.ceph.com/issues/16012), [pr#11936](http://github.com/ceph/ceph/pull/11936), Jianpeng Ma, Sage Weil)
    
- librbd: ceph 10.2.2 rbd status on image format 2 returns "(2) No such file or directory" ([issue#16887](http://tracker.ceph.com/issues/16887), [pr#10987](http://github.com/ceph/ceph/pull/10987), Jason Dillaman)
    
- librbd: diffs to clone's first snapshot should include parent diffs ([issue#18068](http://tracker.ceph.com/issues/18068), [pr#12446](http://github.com/ceph/ceph/pull/12446), Jason Dillaman)
    
- librbd: image.stat() call in librbdpy fails sometimes ([issue#17310](http://tracker.ceph.com/issues/17310), [pr#11949](http://github.com/ceph/ceph/pull/11949), Jason Dillaman)
    
- librbd: request exclusive lock if current owner cannot execute op ([issue#16171](http://tracker.ceph.com/issues/16171), [pr#12018](http://github.com/ceph/ceph/pull/12018), Mykola Golub)
    
- mds: fix cephfs-java ftruncate unit test failure ([issue#11258](http://tracker.ceph.com/issues/11258), [pr#11939](http://github.com/ceph/ceph/pull/11939), Yan, Zheng)
    
- mon: %USED of ceph df is wrong ([issue#16933](http://tracker.ceph.com/issues/16933), [pr#11934](http://github.com/ceph/ceph/pull/11934), Kefu Chai)
    
- mon: MonmapMonitor should return success when MON will be removed ([issue#17725](http://tracker.ceph.com/issues/17725), [pr#12006](http://github.com/ceph/ceph/pull/12006), Joao Eduardo Luis)
    
- mon: OSDMonitor: Missing nearfull flag set ([issue#17390](http://tracker.ceph.com/issues/17390), [pr#11273](http://github.com/ceph/ceph/pull/11273), Igor Podoski)
    
- mon: OSDs marked OUT wrongly after monitor failover ([issue#17719](http://tracker.ceph.com/issues/17719), [pr#11946](http://github.com/ceph/ceph/pull/11946), Dong Wu)
    
- mon: fix memory leak in prepare\_beacon ([issue#17285](http://tracker.ceph.com/issues/17285), [pr#10238](http://github.com/ceph/ceph/pull/10238), Igor Podoski)
    
- mon: osd flag health message is misleading ([issue#18175](http://tracker.ceph.com/issues/18175), [pr#12687](http://github.com/ceph/ceph/pull/12687), Sage Weil)
    
- mon: prepare\_pgtemp needs to only update up\_thru if newer than the existing one ([issue#16185](http://tracker.ceph.com/issues/16185), [pr#11937](http://github.com/ceph/ceph/pull/11937), Samuel Just)
    
- mon: return size\_t from MonitorDBStore::Transaction::size() ([issue#14217](http://tracker.ceph.com/issues/14217), [pr#10904](http://github.com/ceph/ceph/pull/10904), Kefu Chai)
    
- mon: send updated monmap to its subscribers ([issue#17558](http://tracker.ceph.com/issues/17558), [pr#11457](http://github.com/ceph/ceph/pull/11457), Kefu Chai)
    
- msgr: OpTracker needs to release the message throttle in \_unregistered ([issue#14248](http://tracker.ceph.com/issues/14248), [pr#11938](http://github.com/ceph/ceph/pull/11938), Samuel Just)
    
- msgr: simple/Pipe: error decoding addr ([issue#18072](http://tracker.ceph.com/issues/18072), [pr#12266](http://github.com/ceph/ceph/pull/12266), Sage Weil)
    
- osd: PG::\_update\_calc\_stats wrong for CRUSH\_ITEM\_NONE up set items ([issue#16998](http://tracker.ceph.com/issues/16998), [pr#11933](http://github.com/ceph/ceph/pull/11933), Samuel Just)
    
- osd: PG::choose\_acting valgrind error or ./common/hobject.h: 182: FAILED assert(!max || ([\*](http://rst.ninjs.org/#id1)this == hobject\_t(hobject\_t::get\_max()))) ([issue#13967](http://tracker.ceph.com/issues/13967), [pr#11932](http://github.com/ceph/ceph/pull/11932), Tao Chang)
    
- osd: ReplicatedBackend::build\_push\_op: add a second config to limit omap entries/chunk independently of object data ([issue#16128](http://tracker.ceph.com/issues/16128), [pr#12417](http://github.com/ceph/ceph/pull/12417), Wanlong Gao)
    
- osd: crash on EIO during deep-scrubbing ([issue#16034](http://tracker.ceph.com/issues/16034), [pr#11935](http://github.com/ceph/ceph/pull/11935), Nathan Cutler)
    
- osd: filestore: FALLOC\_FL\_PUNCH\_HOLE must be used with FALLOC\_FL\_KEEP\_SIZE ([issue#18446](http://tracker.ceph.com/issues/18446), [pr#13041](http://github.com/ceph/ceph/pull/13041), xinxin shu)
    
- osd: fix cached\_removed\_snaps bug in PGPool::update after map gap ([issue#18628](http://tracker.ceph.com/issues/18628), [issue#15943](http://tracker.ceph.com/issues/15943), [pr#12906](http://github.com/ceph/ceph/pull/12906), Samuel Just)
    
- osd: fix collection\_list shadow return value ([issue#17713](http://tracker.ceph.com/issues/17713), [pr#11927](http://github.com/ceph/ceph/pull/11927), Haomai Wang)
    
- osd: fix fiemap issue in xfs when #extents > 1364 ([issue#17610](http://tracker.ceph.com/issues/17610), [pr#11615](http://github.com/ceph/ceph/pull/11615), Kefu Chai, Ning Yao)
    
- osd: update PGPool to detect map gaps and reset cached\_removed\_snaps ([issue#15943](http://tracker.ceph.com/issues/15943), [pr#11676](http://github.com/ceph/ceph/pull/11676), Samuel Just)
    
- rbd: export diff should open image as read-only ([issue#17671](http://tracker.ceph.com/issues/17671), [pr#11948](http://github.com/ceph/ceph/pull/11948), liyankun)
    
- rbd: fix parameter check ([issue#18237](http://tracker.ceph.com/issues/18237), [pr#12312](http://github.com/ceph/ceph/pull/12312), Yankun Li)
    
- rbd: fix possible rbd data corruption ([issue#16002](http://tracker.ceph.com/issues/16002), [pr#11618](http://github.com/ceph/ceph/pull/11618), Yan, Zheng, Greg Farnum)
    
- rgw: Anonymous user is able to read bucket with authenticated read ACL ([issue#13207](http://tracker.ceph.com/issues/13207), [pr#11045](http://github.com/ceph/ceph/pull/11045), [rahul.1aggarwal@gmail.com](mailto:rahul.1aggarwal@gmail.com))
    
- rgw: COPY broke multipart files uploaded under dumpling ([issue#16435](http://tracker.ceph.com/issues/16435), [pr#11950](http://github.com/ceph/ceph/pull/11950), Yehuda Sadeh)
    
- rgw: TempURL in radosgw behaves now like its Swift's counterpart. ([issue#18316](http://tracker.ceph.com/issues/18316), [pr#12619](http://github.com/ceph/ceph/pull/12619), Radoslaw Zarzynski)
    
- rgw: default quota fixes ([issue#16410](http://tracker.ceph.com/issues/16410), [pr#10839](http://github.com/ceph/ceph/pull/10839), Pavan Rallabhandi, Daniel Gryniewicz)
    
- rgw: do not abort when accept a CORS request with short origin ([issue#18187](http://tracker.ceph.com/issues/18187), [pr#12398](http://github.com/ceph/ceph/pull/12398), LiuYang)
    
- rgw: do not omap\_getvals with (u64)-1 max ([issue#17985](http://tracker.ceph.com/issues/17985), [pr#12418](http://github.com/ceph/ceph/pull/12418), Yehuda Sadeh, Sage Weil)
    
- rgw: fix crash when client posts object with null condition ([issue#17635](http://tracker.ceph.com/issues/17635), [pr#11809](http://github.com/ceph/ceph/pull/11809), Yehuda Sadeh)
    
- rgw: fix inconsistent uid/email handling in radosgw-admin ([issue#13598](http://tracker.ceph.com/issues/13598), [pr#11952](http://github.com/ceph/ceph/pull/11952), Matt Benjamin)
    
- rgw: implement offline resharding command ([issue#17745](http://tracker.ceph.com/issues/17745), [pr#12227](http://github.com/ceph/ceph/pull/12227), Yehuda Sadeh, Orit Wasserman, weiqiaomiao)
    
- rgw: swift: ranged request on a DLO provides wrong values in Content-Range HTTP header ([issue#13452](http://tracker.ceph.com/issues/13452), [pr#11951](http://github.com/ceph/ceph/pull/11951), Radoslaw Zarzynski)
    
- rgw: the value of total\_time is wrong in the result of 'radosgw-admin log show' opt ([issue#17598](http://tracker.ceph.com/issues/17598), [pr#11899](http://github.com/ceph/ceph/pull/11899), weiqiaomiao)
    
- tests: Cannot clone ceph/s3-tests.git (missing branch) ([issue#18384](http://tracker.ceph.com/issues/18384), [pr#12744](http://github.com/ceph/ceph/pull/12744), Orit Wasserman)
    
- tests: Cannot reserve CentOS 7.2 smithi machines ([issue#18401](http://tracker.ceph.com/issues/18401), [pr#12762](http://github.com/ceph/ceph/pull/12762), Nathan Cutler)
    
- tests: OSDs commit suicide in rbd suite when testing on btrfs ([issue#18397](http://tracker.ceph.com/issues/18397), [pr#12758](http://github.com/ceph/ceph/pull/12758), Nathan Cutler)
    
- tests: Workunits needlessly wget from git.ceph.com ([issue#18336](http://tracker.ceph.com/issues/18336), [issue#18271](http://tracker.ceph.com/issues/18271), [issue#18388](http://tracker.ceph.com/issues/18388), [pr#12685](http://github.com/ceph/ceph/pull/12685), Sage Weil, Nathan Cutler)
    
- tests: cephfs test failures (ceph.com/qa is broken, should be download.ceph.com/qa) ([issue#18574](http://tracker.ceph.com/issues/18574), [pr#13022](http://github.com/ceph/ceph/pull/13022), John Spray)
    
- tests: merge ceph-qa-suite ([pr#12455](http://github.com/ceph/ceph/pull/12455), Sage Weil)
    
- tests: objecter\_requests workunit fails on wip branches ([issue#18393](http://tracker.ceph.com/issues/18393), [pr#12759](http://github.com/ceph/ceph/pull/12759), Sage Weil)
    
- tests: populate mnt\_point in qa/tasks/ceph.py ([issue#18383](http://tracker.ceph.com/issues/18383), [pr#12743](http://github.com/ceph/ceph/pull/12743), Nathan Cutler)
    
- tests: qemu/tests/qemu-iotests/077 fails in dumpling, hammer, and jewel ([issue#10773](http://tracker.ceph.com/issues/10773), [pr#12423](http://github.com/ceph/ceph/pull/12423), Jason Dillaman)
    
- tests: run fs/thrash on xfs instead of btrfs ([issue#17151](http://tracker.ceph.com/issues/17151), [pr#13039](http://github.com/ceph/ceph/pull/13039), Nathan Cutler)
    
- tests: update Ubuntu image url after ceph.com refactor ([issue#18542](http://tracker.ceph.com/issues/18542), [pr#12957](http://github.com/ceph/ceph/pull/12957), Jason Dillaman)
    
- tests: update rbd/singleton/all/formatted-output.yaml to support ceph-ci \* ([issue#18440](http://tracker.ceph.com/issues/18440), [pr#12824 \*](http://github.com/ceph/ceph/pull/12824), Venky Shankar, Nathan Cutler)
    
- tools: add a tool to rebuild mon store from OSD ([issue#17179](http://tracker.ceph.com/issues/17179), [issue#17400](http://tracker.ceph.com/issues/17400), [pr#11125](http://github.com/ceph/ceph/pull/11125), Kefu Chai, xie xingguo)
    
- tools: ceph-objectstore-tool crashes if --journal-path <a-directory> ([issue#17307](http://tracker.ceph.com/issues/17307), [pr#11929](http://github.com/ceph/ceph/pull/11929), Kefu Chai)
    
- tools: ceph-objectstore-tool: add a way to split filestore directories offline ([issue#17220](http://tracker.ceph.com/issues/17220), [pr#11253](http://github.com/ceph/ceph/pull/11253), Josh Durgin)
    
- tools: crushtool --compile generates output despite missing item ([issue#17306](http://tracker.ceph.com/issues/17306), [pr#11931](http://github.com/ceph/ceph/pull/11931), Kefu Chai)
