---
title: "v9.2.1 Infernalis released"
date: "2016-02-26"
author: "sage"
---

This Infernalis point release fixes several packagins and init script issues, enables the librbd objectmap feature by default, a few librbd bugs, and a range of miscellaneous bug fixes across the system.

We recommend that all infernalis v9.2.0 users upgrade.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v9.2.1.txt).

### NOTABLE CHANGES

- build/ops: Ceph daemon failed to start, because the service name was already used. ([issue#13474](http://tracker.ceph.com/issues/13474), [pr#6833](http://github.com/ceph/ceph/pull/6833), Chuanhong Wang)
- build/ops: ceph upstart script rbdmap.conf incorrectly processes parameters ([issue#13214](http://tracker.ceph.com/issues/13214), [pr#6396](http://github.com/ceph/ceph/pull/6396), Sage Weil)
- build/ops: libunwind package missing on CentOS 7 ([issue#13997](http://tracker.ceph.com/issues/13997), [pr#6845](http://github.com/ceph/ceph/pull/6845), Loic Dachary)
- build/ops: rbd-replay-\* moved from ceph-test-dbg to ceph-common-dbg as well ([issue#13785](http://tracker.ceph.com/issues/13785), [pr#6628](http://github.com/ceph/ceph/pull/6628), Loic Dachary)
- build/ops: systemd/ceph-disk@.service assumes /bin/flock ([issue#13975](http://tracker.ceph.com/issues/13975), [pr#6852](http://github.com/ceph/ceph/pull/6852), Loic Dachary)
- build/ops: systemd: no rbdmap systemd unit file ([issue#13374](http://tracker.ceph.com/issues/13374), [pr#6500](http://github.com/ceph/ceph/pull/6500), Boris Ranto)
- common: auth/cephx: large amounts of log are produced by osd ([issue#13610](http://tracker.ceph.com/issues/13610), [pr#6836](http://github.com/ceph/ceph/pull/6836), Qiankun Zheng)
- common: log: Log.cc: Assign LOG\_DEBUG priority to syslog calls ([issue#13993](http://tracker.ceph.com/issues/13993), [pr#6993](http://github.com/ceph/ceph/pull/6993), Brad Hubbard)
- crush: crash if we see CRUSH\_ITEM\_NONE in early rule step ([issue#13477](http://tracker.ceph.com/issues/13477), [pr#6626](http://github.com/ceph/ceph/pull/6626), Sage Weil)
- fs: Ceph file system is not freeing space ([issue#13777](http://tracker.ceph.com/issues/13777), [pr#7431](http://github.com/ceph/ceph/pull/7431), Yan, Zheng, John Spray)
- fs: Ceph-fuse won’t start correctly when the option log\_max\_new in ceph.conf set to zero ([issue#13443](http://tracker.ceph.com/issues/13443), [pr#6395](http://github.com/ceph/ceph/pull/6395), Wenjun Huang)
- fs: Segmentation fault accessing file using fuse mount ([issue#13714](http://tracker.ceph.com/issues/13714), [pr#6853](http://github.com/ceph/ceph/pull/6853), Yan, Zheng)
- librbd: Avoid re-writing old-format image header on resize ([issue#13674](http://tracker.ceph.com/issues/13674), [pr#6630](http://github.com/ceph/ceph/pull/6630), Jason Dillaman)
- librbd: ImageWatcher shouldn’t block the notification thread ([issue#14373](http://tracker.ceph.com/issues/14373), [pr#7406](http://github.com/ceph/ceph/pull/7406), Jason Dillaman)
- librbd: QEMU hangs after creating snapshot and stopping VM ([issue#13726](http://tracker.ceph.com/issues/13726), [pr#6632](http://github.com/ceph/ceph/pull/6632), Jason Dillaman)
- librbd: Verify self-managed snapshot functionality on image create ([issue#13633](http://tracker.ceph.com/issues/13633), [pr#7080](http://github.com/ceph/ceph/pull/7080), Jason Dillaman)
- librbd: \[ FAILED \] TestLibRBD.SnapRemoveViaLockOwner ([issue#14164](http://tracker.ceph.com/issues/14164), [pr#7079](http://github.com/ceph/ceph/pull/7079), Jason Dillaman)
- librbd: enable feature objectmap ([issue#13558](http://tracker.ceph.com/issues/13558), [pr#6477](http://github.com/ceph/ceph/pull/6477), xinxin shu)
- librbd: fix merge-diff for >2GB diff-files ([issue#14030](http://tracker.ceph.com/issues/14030), [pr#6981](http://github.com/ceph/ceph/pull/6981), Jason Dillaman)
- librbd: flattening an rbd image with active IO can lead to hang ([issue#14092](http://tracker.ceph.com/issues/14092), [issue#14483](http://tracker.ceph.com/issues/14483), [pr#7484](http://github.com/ceph/ceph/pull/7484), Jason Dillaman)
- mds: fix client capabilities during reconnect (client.XXXX isn’t responding to mclientcaps warning) ([issue#11482](http://tracker.ceph.com/issues/11482), [pr#6752](http://github.com/ceph/ceph/pull/6752), Yan, Zheng)
- mon: Ceph Pools’ MAX AVAIL is 0 if some OSDs’ weight is 0 ([issue#13840](http://tracker.ceph.com/issues/13840), [pr#6907](http://github.com/ceph/ceph/pull/6907), Chengyuan Li)
- mon: should not set isvalid = true when cephx\_verify\_authorizer retur... ([issue#13525](http://tracker.ceph.com/issues/13525), [pr#6392](http://github.com/ceph/ceph/pull/6392), Ruifeng Yang)
- objecter: pool op callback may hang forever. ([issue#13642](http://tracker.ceph.com/issues/13642), [pr#6627](http://github.com/ceph/ceph/pull/6627), xie xingguo)
- objecter: potential null pointer access when do pool\_snap\_list. ([issue#13639](http://tracker.ceph.com/issues/13639), [pr#6840](http://github.com/ceph/ceph/pull/6840), xie xingguo)
- osd: FileStore: potential memory leak if getattrs fails. ([issue#13597](http://tracker.ceph.com/issues/13597), [pr#6846](http://github.com/ceph/ceph/pull/6846), xie xingguo)
- osd: OSD::build\_past\_intervals\_parallel() shall reset primary and up\_primary when begin a new past\_interval. ([issue#13471](http://tracker.ceph.com/issues/13471), [pr#6397](http://github.com/ceph/ceph/pull/6397), xiexingguo)
- osd: call on\_new\_interval on newly split child PG ([issue#13962](http://tracker.ceph.com/issues/13962), [pr#6849](http://github.com/ceph/ceph/pull/6849), Sage Weil)
- osd: ceph-disk list fails on /dev/cciss!c0d0 ([issue#13970](http://tracker.ceph.com/issues/13970), [issue#14230](http://tracker.ceph.com/issues/14230), [pr#6880](http://github.com/ceph/ceph/pull/6880), Loic Dachary)
- osd: ceph-disk: use blkid instead of sgdisk -i ([issue#14080](http://tracker.ceph.com/issues/14080), [pr#7001](http://github.com/ceph/ceph/pull/7001), Loic Dachary, Ilya Dryomov)
- osd: fix race condition during send\_failures ([issue#13821](http://tracker.ceph.com/issues/13821), [pr#6694](http://github.com/ceph/ceph/pull/6694), Sage Weil)
- osd: osd/PG.cc: 288: FAILED assert(info.last\_epoch\_started >= info.history.last\_epoch\_started) ([issue#14015](http://tracker.ceph.com/issues/14015), [pr#6851](http://github.com/ceph/ceph/pull/6851), David Zafman)
- osd: pgs stuck inconsistent after infernalis upgrade ([issue#13862](http://tracker.ceph.com/issues/13862), [pr#7421](http://github.com/ceph/ceph/pull/7421), David Zafman)
- rbd: TaskFinisher::cancel should remove event from SafeTimer ([issue#14476](http://tracker.ceph.com/issues/14476), [pr#7426](http://github.com/ceph/ceph/pull/7426), Douglas Fuller)
- rbd: cls\_rbd: object\_map\_save should enable checksums ([issue#14280](http://tracker.ceph.com/issues/14280), [pr#7428](http://github.com/ceph/ceph/pull/7428), Douglas Fuller)
- rbd: misdirected op in rbd balance-reads test ([issue#13491](http://tracker.ceph.com/issues/13491), [pr#6629](http://github.com/ceph/ceph/pull/6629), Jason Dillaman)
- rbd: pure virtual method called ([issue#13636](http://tracker.ceph.com/issues/13636), [pr#6633](http://github.com/ceph/ceph/pull/6633), Jason Dillaman)
- rbd: rbd clone issue ([issue#13553](http://tracker.ceph.com/issues/13553), [pr#6474](http://github.com/ceph/ceph/pull/6474), xinxin shu)
- rbd: rbd-replay does not check for EOF and goes to endless loop ([issue#14452](http://tracker.ceph.com/issues/14452), [pr#7427](http://github.com/ceph/ceph/pull/7427), Mykola Golub)
- rbd: unknown argument –quiet in udevadm settle ([issue#13560](http://tracker.ceph.com/issues/13560), [pr#6634](http://github.com/ceph/ceph/pull/6634), Jason Dillaman)
- rgw: init script reload doesn’t work on EL7 ([issue#13709](http://tracker.ceph.com/issues/13709), [pr#6650](http://github.com/ceph/ceph/pull/6650), Hervé Rousseau)
- rgw: radosgw-admin –help doesn’t show the orphans find command ([issue#14516](http://tracker.ceph.com/issues/14516), [pr#7543](http://github.com/ceph/ceph/pull/7543), Yehuda Sadeh)
- tests: ceph-disk workunit uses configobj ([issue#14004](http://tracker.ceph.com/issues/14004), [pr#6828](http://github.com/ceph/ceph/pull/6828), Loic Dachary)
- tests: fsx failed to compile ([issue#14384](http://tracker.ceph.com/issues/14384), [pr#7429](http://github.com/ceph/ceph/pull/7429), Greg Farnum)
- tests: notification slave needs to wait for master ([issue#13810](http://tracker.ceph.com/issues/13810), [pr#7225](http://github.com/ceph/ceph/pull/7225), Jason Dillaman)
- tests: rebuild exclusive lock test should acquire exclusive lock ([issue#14121](http://tracker.ceph.com/issues/14121), [pr#7038](http://github.com/ceph/ceph/pull/7038), Jason Dillaman)
- tests: testprofile must be removed before it is re-created ([issue#13664](http://tracker.ceph.com/issues/13664), [pr#6449](http://github.com/ceph/ceph/pull/6449), Loic Dachary)
- tests: verify it is possible to reuse an OSD id ([issue#13988](http://tracker.ceph.com/issues/13988), [pr#6882](http://github.com/ceph/ceph/pull/6882), Loic Dachary)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-9.2.1.tar.gz](http://ceph.com/download/ceph-9.2.1.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
