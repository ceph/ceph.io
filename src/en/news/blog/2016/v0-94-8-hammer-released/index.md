---
title: "v0.94.8 Hammer released"
date: "2016-08-26"
author: "sage"
---

This Hammer point release fixes several bugs.

We recommend that all hammer v0.94.x users upgrade.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.94.8.txt).

### NOTABLE CHANGES

 

- build/ops: Add -D\_LARGEFILE64\_SOURCE to Linux build. ([issue#16611](http://tracker.ceph.com/issues/16611), [pr#10182](http://github.com/ceph/ceph/pull/10182), Ira Cooper)
- build/ops: boost uuid makes valgrind complain ([issue#12736](http://tracker.ceph.com/issues/12736), [pr#9741](http://github.com/ceph/ceph/pull/9741), Sage Weil, Rohan Mars)
- build/ops: ceph-disk s/by-parttype-uuid/by-parttypeuuid/ ([issue#15867](http://tracker.ceph.com/issues/15867), [pr#9107](http://github.com/ceph/ceph/pull/9107), Nathan Cutler)
- common: add units to rados bench output and clean up formatting ([issue#12248](http://tracker.ceph.com/issues/12248), [pr#8960](http://github.com/ceph/ceph/pull/8960), Dmitry Yatsushkevich, Brad Hubbard, Gu Zhongyan)
- common: config set with negative value results in “error setting ‘filestore\_merge\_threshold’ to ‘-40’: (22) Invalid argument” ([issue#13829](http://tracker.ceph.com/issues/13829), [pr#10291](http://github.com/ceph/ceph/pull/10291), Brad Hubbard, Kefu Chai)
- common: linking to -lrbd causes process startup times to balloon ([issue#15225](http://tracker.ceph.com/issues/15225), [pr#8538](http://github.com/ceph/ceph/pull/8538), Richard W.M. Jones)
- doc: fix by-parttypeuuid in ceph-disk(8) nroff ([issue#15867](http://tracker.ceph.com/issues/15867), [pr#10699](http://github.com/ceph/ceph/pull/10699), Ken Dreyer)
- fs: double decreased the count to trim caps which will cause failing to respond to cache pressure ([issue#14319](http://tracker.ceph.com/issues/14319), [pr#8804](http://github.com/ceph/ceph/pull/8804), Zhi Zhang)
- log: do not repeat errors to stderr ([issue#14616](http://tracker.ceph.com/issues/14616), [pr#10227](http://github.com/ceph/ceph/pull/10227), Sage Weil)
- mds: failing file operations on kernel based cephfs mount point leaves unaccessible file behind on hammer 0.94.7 ([issue#16013](http://tracker.ceph.com/issues/16013), [pr#10198](http://github.com/ceph/ceph/pull/10198), Yan, Zheng)
- mds: fix stray purging in ‘stripe\_count > 1’ case ([issue#15050](http://tracker.ceph.com/issues/15050), [pr#8042](http://github.com/ceph/ceph/pull/8042), Yan, Zheng)
- mds: wrongly treat symlink inode as normal file/dir when symlink inode is stale on kcephfs ([issue#15702](http://tracker.ceph.com/issues/15702),[pr#9404](http://github.com/ceph/ceph/pull/9404), Zhi Zhang)
- mon: LibRadosMiscConnectFailure.ConnectFailure (not so intermittent) failure in upgrade/hammer-x ([issue#13992](http://tracker.ceph.com/issues/13992), [pr#8806](http://github.com/ceph/ceph/pull/8806), Sage Weil)
- mon: Monitor: validate prefix on handle\_command() ([issue#16297](http://tracker.ceph.com/issues/16297), [pr#10038](http://github.com/ceph/ceph/pull/10038), You Ji)
- mon: drop pg temps from not the current primary in OSDMonitor ([issue#16127](http://tracker.ceph.com/issues/16127), [pr#9893](http://github.com/ceph/ceph/pull/9893), Samuel Just)
- mon: fix calculation of %USED ([issue#15641](http://tracker.ceph.com/issues/15641), [pr#9125](http://github.com/ceph/ceph/pull/9125), Ruifeng Yang, David Zafman)
- mon: improve reweight\_by\_utilization() logic ([issue#15686](http://tracker.ceph.com/issues/15686), [pr#9416](http://github.com/ceph/ceph/pull/9416), xie xingguo)
- mon: pool quota alarm is not in effect ([issue#15478](http://tracker.ceph.com/issues/15478), [pr#8593](http://github.com/ceph/ceph/pull/8593), Danny Al-Gaaf)
- mon: wrong ceph get mdsmap assertion ([issue#14681](http://tracker.ceph.com/issues/14681), [pr#7542](http://github.com/ceph/ceph/pull/7542), Vicente Cheng)
- msgr: ceph-osd valgrind invalid reads/writes ([issue#15870](http://tracker.ceph.com/issues/15870), [pr#9238](http://github.com/ceph/ceph/pull/9238), Samuel Just)
- objecter: LibRadosWatchNotifyPPTests/LibRadosWatchNotifyPP.WatchNotify2Timeout/1 segv ([issue#15760](http://tracker.ceph.com/issues/15760), [pr#9400](http://github.com/ceph/ceph/pull/9400), Sage Weil)
- osd: OSD reporting ENOTEMPTY and crashing ([issue#14766](http://tracker.ceph.com/issues/14766), [pr#9277](http://github.com/ceph/ceph/pull/9277), Samuel Just)
- osd: When generating past intervals due to an import end at pg epoch and fix build\_past\_intervals\_parallel ([issue#12387](http://tracker.ceph.com/issues/12387), [issue#14438](http://tracker.ceph.com/issues/14438), [pr#8464](http://github.com/ceph/ceph/pull/8464), David Zafman)
- osd: acting\_primary not updated on split ([issue#15523](http://tracker.ceph.com/issues/15523), [pr#9001](http://github.com/ceph/ceph/pull/9001), Sage Weil)
- osd: assert(!actingbackfill.empty()): old watch timeout tries to queue repop on replica ([issue#15391](http://tracker.ceph.com/issues/15391),[pr#8665](http://github.com/ceph/ceph/pull/8665), Sage Weil)
- osd: assert(rollback\_info\_trimmed\_to == head) in PGLog ([issue#13965](http://tracker.ceph.com/issues/13965), [pr#8849](http://github.com/ceph/ceph/pull/8849), Samuel Just)
- osd: delete one of the repeated op->mark\_started in ReplicatedBackend::sub\_op\_modify\_impl ([issue#16572](http://tracker.ceph.com/issues/16572), [pr#9977](http://github.com/ceph/ceph/pull/9977), shun-s)
- osd: fix omap digest compare when scrub ([issue#16000](http://tracker.ceph.com/issues/16000), [pr#9271](http://github.com/ceph/ceph/pull/9271), Xinze Chi)
- osd: is\_split crash in handle\_pg\_create ([issue#15426](http://tracker.ceph.com/issues/15426), [pr#8805](http://github.com/ceph/ceph/pull/8805), Kefu Chai)
- osd: objects unfound after repair (fixed by repeering the pg) ([issue#15006](http://tracker.ceph.com/issues/15006), [pr#7961](http://github.com/ceph/ceph/pull/7961), Jianpeng Ma, Loic Dachary, Kefu Chai)
- osd: rados cppool omap to ec pool crashes osd ([issue#14695](http://tracker.ceph.com/issues/14695), [pr#8845](http://github.com/ceph/ceph/pull/8845), Jianpeng Ma)
- osd: remove all stale osdmaps in handle\_osd\_map() ([issue#13990](http://tracker.ceph.com/issues/13990), [pr#9090](http://github.com/ceph/ceph/pull/9090), Kefu Chai)
- osd: send write and read sub ops on behalf of client ops at normal priority in ECBackend ([issue#14313](http://tracker.ceph.com/issues/14313),[pr#8573](http://github.com/ceph/ceph/pull/8573), Samuel Just)
- rbd: snap rollback: restore the link to parent ([issue#14512](http://tracker.ceph.com/issues/14512), [pr#8535](http://github.com/ceph/ceph/pull/8535), Alexey Sheplyakov)
- rgw: S3: set EncodingType in ListBucketResult ([issue#15896](http://tracker.ceph.com/issues/15896), [pr#8987](http://github.com/ceph/ceph/pull/8987), Victor Makarov, Robin H. Johnson)
- rgw: backport rgwx-copy-if-newer for radosgw-agent ([issue#16262](http://tracker.ceph.com/issues/16262), [pr#9671](http://github.com/ceph/ceph/pull/9671), Yehuda Sadeh)
- rgw: bucket listing following object delete is partial ([issue#14826](http://tracker.ceph.com/issues/14826), [pr#10555](http://github.com/ceph/ceph/pull/10555), Orit Wasserman)
- rgw: convert plain object to versioned (with null version) when removing ([issue#15243](http://tracker.ceph.com/issues/15243), [pr#8755](http://github.com/ceph/ceph/pull/8755), Yehuda Sadeh)
- rgw: fix multi-delete query param parsing. ([issue#16618](http://tracker.ceph.com/issues/16618), [pr#10189](http://github.com/ceph/ceph/pull/10189), Robin H. Johnson)
- rgw: have a flavor of bucket deletion to bypass GC and to trigger ([issue#15557](http://tracker.ceph.com/issues/15557), [pr#10509](http://github.com/ceph/ceph/pull/10509), Pavan Rallabhandi)
- rgw: keep track of written\_objs correctly ([issue#15886](http://tracker.ceph.com/issues/15886), [pr#9240](http://github.com/ceph/ceph/pull/9240), Yehuda Sadeh)
- rgw: multipart ListPartsResult has missing quotes on ETag ([issue#15334](http://tracker.ceph.com/issues/15334), [pr#8475](http://github.com/ceph/ceph/pull/8475), xie xingguo, Robin H. Johnson)
- rgw: no Last-Modified, Content-Size and X-Object-Manifest headers if no segments in DLO manifest ([issue#15812](http://tracker.ceph.com/issues/15812), [pr#9402](http://github.com/ceph/ceph/pull/9402), Radoslaw Zarzynski)
- rgw: radosgw server abort when user passed bad parameters to set quota ([issue#14190](http://tracker.ceph.com/issues/14190), [issue#14191](http://tracker.ceph.com/issues/14191),[pr#8313](http://github.com/ceph/ceph/pull/8313), Dunrong Huang)
- rgw: radosgw-admin region-map set is not reporting the bucket quota correctly ([issue#16815](http://tracker.ceph.com/issues/16815), [pr#10554](http://github.com/ceph/ceph/pull/10554), Yehuda Sadeh, Orit Wasserman)
- rgw: refrain from sending Content-Type/Content-Length for 304 responses ([issue#16327](http://tracker.ceph.com/issues/16327), [issue#13582](http://tracker.ceph.com/issues/13582),[issue#15119](http://tracker.ceph.com/issues/15119), [issue#14005](http://tracker.ceph.com/issues/14005), [pr#8379](http://github.com/ceph/ceph/pull/8379), Yehuda Sadeh, Nathan Cutler, Wido den Hollander)
- rgw: remove bucket index objects when deleting the bucket ([issue#16412](http://tracker.ceph.com/issues/16412), [pr#10530](http://github.com/ceph/ceph/pull/10530), Orit Wasserman)
- rgw: set Access-Control-Allow-Origin to an asterisk if allowed in a rule ([issue#15348](http://tracker.ceph.com/issues/15348), [pr#8528](http://github.com/ceph/ceph/pull/8528), Wido den Hollander)
- rgw: subset of uploaded objects via radosgw are unretrievable when using EC pool ([issue#15745](http://tracker.ceph.com/issues/15745),[pr#9407](http://github.com/ceph/ceph/pull/9407), Yehuda Sadeh)
- rgw: subuser rm fails with status 125 ([issue#14375](http://tracker.ceph.com/issues/14375), [pr#9961](http://github.com/ceph/ceph/pull/9961), Orit Wasserman)
- rgw: the swift key remains after removing a subuser ([issue#12890](http://tracker.ceph.com/issues/12890), [issue#14375](http://tracker.ceph.com/issues/14375), [pr#10718](http://github.com/ceph/ceph/pull/10718), Orit Wasserman, Sangdi Xu)
- rgw: user quota may not adjust on bucket removal ([issue#14507](http://tracker.ceph.com/issues/14507), [pr#8113](http://github.com/ceph/ceph/pull/8113), Edward Yang)
- tests: be more generous with test timeout ([issue#15403](http://tracker.ceph.com/issues/15403), [pr#8470](http://github.com/ceph/ceph/pull/8470), Loic Dachary)
- tests: qa/workunits/rbd: respect RBD\_CREATE\_ARGS environment variable ([issue#16289](http://tracker.ceph.com/issues/16289), [pr#9722](http://github.com/ceph/ceph/pull/9722), Mykola Golub)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.94.8.tar.gz](http://ceph.com/download/ceph-0.94.8.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
