---
title: "v10.2.1 Jewel released"
date: "2016-05-16"
author: "sage"
tags:
  - "release"
  - "jewel"
---

This is the first bugfix release for Jewel. It contains several annoying packaging and init system fixes and a range of important bugfixes across RBD, RGW, and CephFS.

We recommend that all v10.2.x users upgrade.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v10.2.1.txt).

### NOTABLE CHANGES

- cephfs: CephFSVolumeClient should isolate volumes by RADOS namespace ([issue#15400](http://tracker.ceph.com/issues/15400), [pr#8787](http://github.com/ceph/ceph/pull/8787), Xiaoxi Chen)
- cephfs: handle standby-replay nodes properly in upgrades ([issue#15591](http://tracker.ceph.com/issues/15591), [pr#8971](http://github.com/ceph/ceph/pull/8971), John Spray)
- ceph-{mds,mon,osd} packages need scriptlets with systemd code ([issue#14941](http://tracker.ceph.com/issues/14941), [pr#8801](http://github.com/ceph/ceph/pull/8801), Boris Ranto, Nathan Cutler)
- ceph\_test\_keyvaluedb: fix ([issue#15435](http://tracker.ceph.com/issues/15435), [pr#9051](http://github.com/ceph/ceph/pull/9051), Allen Samuels, Sage Weil)
- cmake: add missing source file to rbd\_mirror/image\_replayer ([pr#9052](http://github.com/ceph/ceph/pull/9052), Casey Bodley)
- cmake: fix rbd compile errors ([pr#9076](http://github.com/ceph/ceph/pull/9076), runsisi, Jason Dillaman)
- journal: incorrectly computed object offset within set ([issue#15765](http://tracker.ceph.com/issues/15765), [pr#9038](http://github.com/ceph/ceph/pull/9038), Jason Dillaman)
- librbd: client-side handling for incompatible object map sizes ([issue#15642](http://tracker.ceph.com/issues/15642), [pr#9039](http://github.com/ceph/ceph/pull/9039), Jason Dillaman)
- librbd: constrain size of AioWriteEvent journal entries ([issue#15750](http://tracker.ceph.com/issues/15750), [pr#9048](http://github.com/ceph/ceph/pull/9048), Jason Dillaman)
- librbd: does not crash if image header is too short ([pr#9044](http://github.com/ceph/ceph/pull/9044), Kefu Chai)
- librbd: Errors encountered disabling object-map while flatten is in-progress ([issue#15572](http://tracker.ceph.com/issues/15572), [pr#8869](http://github.com/ceph/ceph/pull/8869), Jason Dillaman)
- librbd: fix get/list mirror image status API ([issue#15771](http://tracker.ceph.com/issues/15771), [pr#9036](http://github.com/ceph/ceph/pull/9036), Mykola Golub)
- librbd: Parent image is closed twice if error encountered while opening ([issue#15574](http://tracker.ceph.com/issues/15574), [pr#8867](http://github.com/ceph/ceph/pull/8867), Jason Dillaman)
- librbd: possible double-free of object map invalidation request upon error ([issue#15643](http://tracker.ceph.com/issues/15643), [pr#8865](http://github.com/ceph/ceph/pull/8865), runsisi)
- librbd: possible race condition leads to use-after-free ([issue#15690](http://tracker.ceph.com/issues/15690), [pr#9009](http://github.com/ceph/ceph/pull/9009), Jason Dillaman)
- librbd: potential concurrent event processing during journal replay ([issue#15755](http://tracker.ceph.com/issues/15755), [pr#9040](http://github.com/ceph/ceph/pull/9040), Jason Dillaman)
- librbd: Potential double free of SetSnapRequest instance ([issue#15571](http://tracker.ceph.com/issues/15571), [pr#8803](http://github.com/ceph/ceph/pull/8803), runsisi)
- librbd: put the validation of image snap context earlier ([pr#9046](http://github.com/ceph/ceph/pull/9046), runsisi)
- librbd: reduce log level for image format 1 warning ([issue#15577](http://tracker.ceph.com/issues/15577), [pr#9003](http://github.com/ceph/ceph/pull/9003), Jason Dillaman)
- mds/MDSAuthCap parse no longer fails on paths with hyphens ([issue#15465](http://tracker.ceph.com/issues/15465), [pr#8969](http://github.com/ceph/ceph/pull/8969), John Spray)
- mds: MDS incarnation no longer gets lost after remove filesystem ([issue#15399](http://tracker.ceph.com/issues/15399), [pr#8970](http://github.com/ceph/ceph/pull/8970), John Spray)
- mon/OSDMonitor: avoid underflow in reweight-by-utilization if max\_change=1 ([issue#15655](http://tracker.ceph.com/issues/15655), [pr#9006](http://github.com/ceph/ceph/pull/9006), Samuel Just)
- python: clone operation will fail if config overridden with “rbd default format = 1” ([issue#15685](http://tracker.ceph.com/issues/15685), [pr#8972](http://github.com/ceph/ceph/pull/8972), Jason Dillaman)
- radosgw-admin: add missing –zonegroup-id to usage ([issue#15650](http://tracker.ceph.com/issues/15650), [pr#9019](http://github.com/ceph/ceph/pull/9019), Casey Bodley)
- radosgw-admin: update usage for zone\[group\] modify ([issue#15651](http://tracker.ceph.com/issues/15651), [pr#9016](http://github.com/ceph/ceph/pull/9016), Casey Bodley)
- radosgw-admin: zonegroup remove command ([issue#15684](http://tracker.ceph.com/issues/15684), [pr#9015](http://github.com/ceph/ceph/pull/9015), Casey Bodley)
- rbd CLI to retrieve rbd mirror state for a pool / specific image ([issue#15144](http://tracker.ceph.com/issues/15144), [issue#14420](http://tracker.ceph.com/issues/14420), [pr#8868](http://github.com/ceph/ceph/pull/8868), Mykola Golub)
- rbd disk-usage CLI command should support calculating full image usage ([issue#14540](http://tracker.ceph.com/issues/14540), [pr#8870](http://github.com/ceph/ceph/pull/8870), Jason Dillaman)
- rbd: helpful error message on map failure ([issue#15721](http://tracker.ceph.com/issues/15721), [pr#9041](http://github.com/ceph/ceph/pull/9041), Venky Shankar)
- rbd: help message distinction between commands and aliases ([issue#15521](http://tracker.ceph.com/issues/15521), [pr#9004](http://github.com/ceph/ceph/pull/9004), Yongqiang He)
- rbd-mirror: admin socket commands to start/stop/restart mirroring ([issue#15718](http://tracker.ceph.com/issues/15718), [pr#9010](http://github.com/ceph/ceph/pull/9010), Mykola Golub, Josh Durgin)
- rbd-mirror can crash if start up is interrupted ([issue#15630](http://tracker.ceph.com/issues/15630), [pr#8866](http://github.com/ceph/ceph/pull/8866), Jason Dillaman)
- rbd-mirror: image sync needs to handle snapshot size and protection status ([issue#15110](http://tracker.ceph.com/issues/15110), [pr#9050](http://github.com/ceph/ceph/pull/9050), Jason Dillaman)
- rbd-mirror: lockdep error during bootstrap ([issue#15664](http://tracker.ceph.com/issues/15664), [pr#9008](http://github.com/ceph/ceph/pull/9008), Jason Dillaman)
- rbd-nbd: fix rbd-nbd aio callback error handling ([issue#15604](http://tracker.ceph.com/issues/15604), [pr#9005](http://github.com/ceph/ceph/pull/9005), Chang-Yi Lee)
- rgw: add AWS4 completion support for RGW\_OP\_SET\_BUCKET\_WEBSITE ([issue#15626](http://tracker.ceph.com/issues/15626), [pr#9018](http://github.com/ceph/ceph/pull/9018), Javier M. Mellid)
- rgw admin output ([issue#15747](http://tracker.ceph.com/issues/15747), [pr#9054](http://github.com/ceph/ceph/pull/9054), Casey Bodley)
- rgw: fix issue #15597 ([issue#15597](http://tracker.ceph.com/issues/15597), [pr#9020](http://github.com/ceph/ceph/pull/9020), Yehuda Sadeh)
- rgw: fix printing wrong X-Storage-Url in Swift’s TempAuth. ([issue#15667](http://tracker.ceph.com/issues/15667), [pr#9021](http://github.com/ceph/ceph/pull/9021), Radoslaw Zarzynski)
- rgw: handle stripe transition when flushing final pending\_data\_bl ([issue#15745](http://tracker.ceph.com/issues/15745), [pr#9053](http://github.com/ceph/ceph/pull/9053), Yehuda Sadeh)
- rgw: leak fixes ([issue#15792](http://tracker.ceph.com/issues/15792), [pr#9022](http://github.com/ceph/ceph/pull/9022), Yehuda Sadeh)
- rgw: multisite: Issues with Deleting Buckets ([issue#15540](http://tracker.ceph.com/issues/15540), [pr#8930](http://github.com/ceph/ceph/pull/8930), Abhishek Lekshmanan)
- rgw: period commit fix ([issue#15828](http://tracker.ceph.com/issues/15828), [pr#9081](http://github.com/ceph/ceph/pull/9081), Casey Bodley)
- rgw: period delete fixes ([issue#15469](http://tracker.ceph.com/issues/15469), [pr#9047](http://github.com/ceph/ceph/pull/9047), Casey Bodley)
- rgw: radosgw-admin zone set cuts pool names short if name starts with a period ([issue#15598](http://tracker.ceph.com/issues/15598), [pr#9029](http://github.com/ceph/ceph/pull/9029), Yehuda Sadeh)
- rgw: segfault at RGWAsyncGetSystemObj ([issue#15565](http://tracker.ceph.com/issues/15565), [issue#15625](http://tracker.ceph.com/issues/15625), [pr#9017](http://github.com/ceph/ceph/pull/9017), Yehuda Sadeh)
- several backports ([issue#15588](http://tracker.ceph.com/issues/15588), [issue#15655](http://tracker.ceph.com/issues/15655), [pr#8853](http://github.com/ceph/ceph/pull/8853), Alexandre Derumier, xie xingguo, Alfredo Deza)
- systemd: fix typo in preset file ([pr#8843](http://github.com/ceph/ceph/pull/8843), Nathan Cutler)
- tests: make check fails on ext4 ([issue#15837](http://tracker.ceph.com/issues/15837), [pr#9063](http://github.com/ceph/ceph/pull/9063), Loic Dachary, Sage Weil)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-10.2.1.tar.gz](http://ceph.com/download/ceph-10.2.1.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
