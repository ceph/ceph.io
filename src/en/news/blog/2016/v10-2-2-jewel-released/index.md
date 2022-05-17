---
title: "v10.2.2 Jewel released"
date: "2016-06-15"
author: "sage"
tags:
  - "release"
  - "jewel"
---

This point release fixes several important bugs in RBD mirroring, RGW multi-site, CephFS, and RADOS.

We recommend that all v10.2.x users upgrade.

For more detailed information, see [the complete changelog](http://GETTING CEPH  Git at git://github.com/ceph/ceph.git Tarball at http://ceph.com/download/ceph-10.2.1.tar.gz For packages, see http://ceph.com/docs/master/install/get-packages For ceph-deploy, see http://ceph.com/docs/master/install/install-ceph-deploy).

### NOTABLE CHANGES

- ceph: cli: exception when pool name has non-ascii characters ([issue#15913](http://tracker.ceph.com/issues/15913), [pr#9320](http://github.com/ceph/ceph/pull/9320), Ricardo Dias)
- ceph-disk: workaround gperftool hang ([issue#13522](http://tracker.ceph.com/issues/13522), [issue#16103](http://tracker.ceph.com/issues/16103), [pr#9427](http://github.com/ceph/ceph/pull/9427), Loic Dachary)
- cephfs: backports needed for Manila ([issue#15599](http://tracker.ceph.com/issues/15599), [issue#15417](http://tracker.ceph.com/issues/15417), [issue#15045](http://tracker.ceph.com/issues/15045), [pr#9430](http://github.com/ceph/ceph/pull/9430), John Spray, Ramana Raja, Xiaoxi Chen)
- ceph.spec.in: drop support for RHEL<7 and SUSE<1210 in jewel and above ([issue#15725](http://tracker.ceph.com/issues/15725), [issue#15627](http://tracker.ceph.com/issues/15627), [issue#13445](http://tracker.ceph.com/issues/13445), [issue#15822](http://tracker.ceph.com/issues/15822), [issue#15472](http://tracker.ceph.com/issues/15472), [issue#15987](http://tracker.ceph.com/issues/15987), [issue#15516](http://tracker.ceph.com/issues/15516), [issue#15549](http://tracker.ceph.com/issues/15549), [pr#8938](http://github.com/ceph/ceph/pull/8938), Boris Ranto, Sage Weil, Nathan Cutler, Lars Marowsky-Bree)
- ceph\_test\_librbd\_fsx crashes during journal replay shut down ([issue#16123](http://tracker.ceph.com/issues/16123), [pr#9556](http://github.com/ceph/ceph/pull/9556), Jason Dillaman)
- client: fix bugs accidentally disabling readahead ([issue#16024](http://tracker.ceph.com/issues/16024), [pr#9656](http://github.com/ceph/ceph/pull/9656), Patrick Donnelly, Greg Farnum)
- cls\_journal: initialize empty commit position upon client register ([issue#15757](http://tracker.ceph.com/issues/15757), [pr#9376](http://github.com/ceph/ceph/pull/9376), runsisi, Venky Shankar)
- cls::rbd: mirror\_image\_status\_list returned max 64 items ([pr#9069](http://github.com/ceph/ceph/pull/9069), Mykola Golub)
- cls\_rbd: mirror image status summary should read full directory ([issue#16178](http://tracker.ceph.com/issues/16178), [pr#9608](http://github.com/ceph/ceph/pull/9608), Jason Dillaman)
- common: BackoffThrottle spins unnecessarily with very small backoff while the throttle is full ([issue#15953](http://tracker.ceph.com/issues/15953), [pr#9579](http://github.com/ceph/ceph/pull/9579), Samuel Just)
- common: Do not link lttng into libglobal ([pr#9194](http://github.com/ceph/ceph/pull/9194), Karol Mroz)
- debian: install systemd target files ([issue#15573](http://tracker.ceph.com/issues/15573), [pr#8815](http://github.com/ceph/ceph/pull/8815), Kefu Chai, Sage Weil)
- doc: update mirroring guide to include pool/image status commands ([issue#15746](http://tracker.ceph.com/issues/15746), [pr#9180](http://github.com/ceph/ceph/pull/9180), Mykola Golub)
- librbd: Disabling journaling feature results in “Transport endpoint is not connected” error ([issue#15863](http://tracker.ceph.com/issues/15863), [pr#9548](http://github.com/ceph/ceph/pull/9548), Yuan Zhou)
- librbd: do not shut down exclusive lock while acquiring’ ([issue#16291](http://tracker.ceph.com/issues/16291), [issue#16260](http://tracker.ceph.com/issues/16260), [pr#9691](http://github.com/ceph/ceph/pull/9691), Jason Dillaman)
- librbd: Initial python APIs to support mirroring ([issue#15656](http://tracker.ceph.com/issues/15656), [pr#9550](http://github.com/ceph/ceph/pull/9550), Mykola Golub)
- librbd: journal IO error results in failed assertion in AioCompletion ([issue#16077](http://tracker.ceph.com/issues/16077), [issue#15034](http://tracker.ceph.com/issues/15034), [issue#15791](http://tracker.ceph.com/issues/15791), [pr#9611](http://github.com/ceph/ceph/pull/9611), Hector Martin, Jason Dillaman)
- librbd: journal: live replay might skip entries from previous object set ([issue#15864](http://tracker.ceph.com/issues/15864), [issue#15665](http://tracker.ceph.com/issues/15665), [pr#9217](http://github.com/ceph/ceph/pull/9217), Jason Dillaman)
- librbd: journal: support asynchronous shutdown ([issue#15949](http://tracker.ceph.com/issues/15949), [issue#14530](http://tracker.ceph.com/issues/14530), [issue#15993](http://tracker.ceph.com/issues/15993), [pr#9373](http://github.com/ceph/ceph/pull/9373), Jason Dillaman)
- librbd: Metadata config overrides are applied synchronously ([issue#15928](http://tracker.ceph.com/issues/15928), [pr#9318](http://github.com/ceph/ceph/pull/9318), Jason Dillaman)
- librbd: Object Map is showing as invalid, even when Object Map is disabled for that Image. ([issue#16076](http://tracker.ceph.com/issues/16076), [pr#9555](http://github.com/ceph/ceph/pull/9555), xinxin shu)
- librbd: prevent error messages when journal externally disabled ([issue#16114](http://tracker.ceph.com/issues/16114), [pr#9610](http://github.com/ceph/ceph/pull/9610), Zhiqiang Wang, Jason Dillaman)
- librbd: recursive lock possible when disabling journaling ([issue#16235](http://tracker.ceph.com/issues/16235), [pr#9654](http://github.com/ceph/ceph/pull/9654), Jason Dillaman)
- librbd: refresh image if needed in mirror functions ([issue#16096](http://tracker.ceph.com/issues/16096), [pr#9609](http://github.com/ceph/ceph/pull/9609), Jon Bernard)
- librbd: remove should ignore mirror errors from older OSDs ([issue#16268](http://tracker.ceph.com/issues/16268), [pr#9692](http://github.com/ceph/ceph/pull/9692), Jason Dillaman)
- librbd: reuse ImageCtx::finisher and SafeTimer for lots of images case ([issue#13938](http://tracker.ceph.com/issues/13938), [pr#9580](http://github.com/ceph/ceph/pull/9580), Haomai Wang)
- librbd: validate image metadata configuration overrides ([issue#15522](http://tracker.ceph.com/issues/15522), [pr#9554](http://github.com/ceph/ceph/pull/9554), zhuangzeqiang)
- mds: order directories by hash and fix simultaneous readdir races ([issue#15508](http://tracker.ceph.com/issues/15508), [pr#9655](http://github.com/ceph/ceph/pull/9655), Yan, Zheng, Greg Farnum)
- mon: Hammer (0.94.3) OSD does not delete old OSD Maps in a timely fashion (maybe at all?) ([issue#13990](http://tracker.ceph.com/issues/13990), [pr#9100](http://github.com/ceph/ceph/pull/9100), Kefu Chai)
- mon/Monitor: memory leak on Monitor::handle\_ping() ([issue#15793](http://tracker.ceph.com/issues/15793), [pr#9270](http://github.com/ceph/ceph/pull/9270), xie xingguo)
- osd: acting\_primary not updated on split ([issue#15523](http://tracker.ceph.com/issues/15523), [pr#8968](http://github.com/ceph/ceph/pull/8968), Sage Weil)
- osd: boot race with noup being set ([issue#15678](http://tracker.ceph.com/issues/15678), [pr#9101](http://github.com/ceph/ceph/pull/9101), Sage Weil)
- osd: deadlock in OSD::\_committed\_osd\_maps ([issue#15701](http://tracker.ceph.com/issues/15701), [pr#9103](http://github.com/ceph/ceph/pull/9103), Xinze Chi)
- osd: hobject\_t::get\_max() vs is\_max() discrepancy ([issue#16113](http://tracker.ceph.com/issues/16113), [pr#9614](http://github.com/ceph/ceph/pull/9614), Samuel Just)
- osd: LibRadosWatchNotifyPPTests/LibRadosWatchNotifyPP.WatchNotify2Timeout/1 segv ([issue#15760](http://tracker.ceph.com/issues/15760), [pr#9104](http://github.com/ceph/ceph/pull/9104), Sage Weil)
- osd: remove reliance on FLAG\_OMAP for reads ([pr#9638](http://github.com/ceph/ceph/pull/9638), Samuel Just)
- osd valgrind invalid reads/writes ([issue#15870](http://tracker.ceph.com/issues/15870), [pr#9237](http://github.com/ceph/ceph/pull/9237), Samuel Just)
- pybind: rbd API should default features parameter to None ([issue#15982](http://tracker.ceph.com/issues/15982), [pr#9553](http://github.com/ceph/ceph/pull/9553), Mykola Golub)
- qa: dynamic\_features.sh races with image deletion ([issue#15500](http://tracker.ceph.com/issues/15500), [pr#9552](http://github.com/ceph/ceph/pull/9552), Mykola Golub)
- qa/workunits: ensure replay has started before checking position ([issue#16248](http://tracker.ceph.com/issues/16248), [pr#9674](http://github.com/ceph/ceph/pull/9674), Jason Dillaman)
- qa/workunits/rbd: fixed rbd\_mirror teuthology runtime errors ([pr#9232](http://github.com/ceph/ceph/pull/9232), Jason Dillaman)
- radosgw-admin: fix ‘period push’ handling of –url ([issue#15926](http://tracker.ceph.com/issues/15926), [pr#9210](http://github.com/ceph/ceph/pull/9210), Casey Bodley)
- rbd-mirror: Delete local image mirror when remote image mirroring is disabled ([issue#15916](http://tracker.ceph.com/issues/15916), [issue#14421](http://tracker.ceph.com/issues/14421), [pr#9372](http://github.com/ceph/ceph/pull/9372), runsisi, Mykola Golub, Ricardo Dias)
- rbd-mirror: do not propagate deletions when pool unavailable ([issue#16229](http://tracker.ceph.com/issues/16229), [pr#9630](http://github.com/ceph/ceph/pull/9630), Jason Dillaman)
- rbd-mirror: do not re-use image id from mirror directory if creating image ([issue#16253](http://tracker.ceph.com/issues/16253), [pr#9673](http://github.com/ceph/ceph/pull/9673), Jason Dillaman)
- rbd-mirror: FAILED assert(!m\_status\_watcher) ([issue#16245](http://tracker.ceph.com/issues/16245), [issue#16290](http://tracker.ceph.com/issues/16290), [pr#9690](http://github.com/ceph/ceph/pull/9690), Mykola Golub)
- rbd-mirror: fix deletion propagation edge cases ([issue#16226](http://tracker.ceph.com/issues/16226), [pr#9629](http://github.com/ceph/ceph/pull/9629), Jason Dillaman)
- rbd-mirror: fix journal shut down ordering ([issue#16165](http://tracker.ceph.com/issues/16165), [pr#9628](http://github.com/ceph/ceph/pull/9628), Jason Dillaman)
- rbd-mirror: potential crash during image status update ([issue#15909](http://tracker.ceph.com/issues/15909), [pr#9226](http://github.com/ceph/ceph/pull/9226), Mykola Golub, Jason Dillaman)
- rbd-mirror: refresh image after creating sync point ([issue#16196](http://tracker.ceph.com/issues/16196), [pr#9627](http://github.com/ceph/ceph/pull/9627), Jason Dillaman)
- rbd-mirror: replicate cloned images ([issue#14937](http://tracker.ceph.com/issues/14937), [pr#9423](http://github.com/ceph/ceph/pull/9423), Jason Dillaman)
- rbd-mirror should disable the rbd cache for local images ([issue#15930](http://tracker.ceph.com/issues/15930), [pr#9317](http://github.com/ceph/ceph/pull/9317), Jason Dillaman)
- rbd-mirror: support bootstrap canceling ([issue#16201](http://tracker.ceph.com/issues/16201), [pr#9612](http://github.com/ceph/ceph/pull/9612), Mykola Golub)
- rbd-mirror: support multiple replicated pools ([issue#16045](http://tracker.ceph.com/issues/16045), [pr#9409](http://github.com/ceph/ceph/pull/9409), Jason Dillaman)
- rgw: fix manager selection when APIs customized ([issue#15974](http://tracker.ceph.com/issues/15974), [issue#15973](http://tracker.ceph.com/issues/15973), [pr#9245](http://github.com/ceph/ceph/pull/9245), Robin H. Johnson)
- rgw: keep track of written\_objs correctly ([issue#15886](http://tracker.ceph.com/issues/15886), [pr#9239](http://github.com/ceph/ceph/pull/9239), Yehuda Sadeh)
- rpm: ceph gid mismatch on upgrade from hammer with pre-existing ceph user (SUSE) ([issue#15869](http://tracker.ceph.com/issues/15869), [pr#9424](http://github.com/ceph/ceph/pull/9424), Nathan Cutler)
- systemd: ceph-{mds,mon,osd,radosgw} systemd unit files need wants=time-sync.target ([issue#15419](http://tracker.ceph.com/issues/15419), [pr#8802](http://github.com/ceph/ceph/pull/8802), Nathan Cutler)
- test: failure in journal.sh workunit test ([issue#16011](http://tracker.ceph.com/issues/16011), [pr#9377](http://github.com/ceph/ceph/pull/9377), Mykola Golub)
- tests: rm -fr /tmp/_virtualenv_ ([issue#16087](http://tracker.ceph.com/issues/16087), [pr#9403](http://github.com/ceph/ceph/pull/9403), Loic Dachary)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-10.2.2.tar.gz](http://ceph.com/download/ceph-10.2.2.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
