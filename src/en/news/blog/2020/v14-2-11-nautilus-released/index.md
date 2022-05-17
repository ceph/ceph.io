---
title: "v14.2.11 Nautilus released"
date: "2020-08-11"
author: "TheAnalyst"
tags:
  - "release"
  - "nautilus"
---

This is the eleventh release in the Nautilus series. This release brings a number of bugfixes across all major components of Ceph. We recommend that all Nautilus users upgrade to this release.

## Notable Changes

- RGW: The `radosgw-admin` sub-commands dealing with orphans – `radosgw-admin orphans find`, `radosgw-admin orphans finish`, `radosgw-admin orphans list-jobs` – have been deprecated. They have not been actively maintained and they store intermediate results on the cluster, which could fill a nearly-full cluster. They have been replaced by a tool, currently considered experimental, `rgw-orphan-list`.
    
- Now when noscrub and/or nodeep-scrub flags are set globally or per pool, scheduled scrubs of the type disabled will be aborted. All user initiated scrubs are NOT interrupted.
    
- Fixed a ceph-osd crash in committed osd maps when there is a failure to encode the first incremental map. [issue#46443](https://tracker.ceph.com/issues/46443)
    

## Changelog

- bluestore: core: os/bluestore: fix large (>2GB) writes when bluefs\_buffered\_io = true ([pr#35404](https://github.com/ceph/ceph/pull/35404), Igor Fedotov)
    
- bluestore: os/bluestore: implement Hybrid allocator ([pr#35500](https://github.com/ceph/ceph/pull/35500), Adam Kupczyk, Kefu Chai, Igor Fedotov, xie xingguo)
    
- build/ops: build/ops: selinux: allow ceph\_t amqp\_port\_t:tcp\_socket ([pr#36190](https://github.com/ceph/ceph/pull/36190), Kaleb S. KEITHLEY, Thomas Serlin)
    
- ceph-volume: add dmcrypt support in raw mode ([pr#35831](https://github.com/ceph/ceph/pull/35831), Guillaume Abrioux)
    
- cephfs,pybind: pybind/cephfs: fix custom exception raised by cephfs.pyx ([pr#36180](https://github.com/ceph/ceph/pull/36180), Ramana Raja)
    
- cephfs: ceph\_fuse: add the ‘-d’ option back for libfuse ([pr#35398](https://github.com/ceph/ceph/pull/35398), Xiubo Li)
    
- cephfs: client: fix directory inode can not call release callback ([pr#36177](https://github.com/ceph/ceph/pull/36177), sepia-liu)
    
- cephfs: client: fix setxattr for 0 size value (NULL value) ([pr#36173](https://github.com/ceph/ceph/pull/36173), Sidharth Anupkrishnan)
    
- cephfs: client: fix snap directory atime ([pr#36169](https://github.com/ceph/ceph/pull/36169), Luis Henriques)
    
- cephfs: client: introduce timeout for client shutdown ([issue#44276](http://tracker.ceph.com/issues/44276), [pr#36215](https://github.com/ceph/ceph/pull/36215), Venky Shankar)
    
- cephfs: client: release the client\_lock before copying data in read ([pr#36294](https://github.com/ceph/ceph/pull/36294), Chencan)
    
- cephfs: client: static dirent for readdir is not thread-safe ([pr#36511](https://github.com/ceph/ceph/pull/36511), Patrick Donnelly)
    
- cephfs: mds: add config to require forward to auth MDS ([pr#35377](https://github.com/ceph/ceph/pull/35377), simon gao)
    
- cephfs: mds: cleanup uncommitted fragments before mds goes to active ([pr#35397](https://github.com/ceph/ceph/pull/35397), “Yan, Zheng”)
    
- cephfs: mds: do not raise “client failing to respond to cap release” when client working set is reasonable ([pr#36513](https://github.com/ceph/ceph/pull/36513), Patrick Donnelly)
    
- cephfs: mds: do not submit omap\_rm\_keys if the dir is the basedir of merge ([pr#36178](https://github.com/ceph/ceph/pull/36178), Chencan)
    
- cephfs: mds: fix filelock state when Fc is issued ([pr#35841](https://github.com/ceph/ceph/pull/35841), Xiubo Li)
    
- cephfs: mds: fix hang issue when accessing a file under a lost parent directory ([pr#36179](https://github.com/ceph/ceph/pull/36179), Zhi Zhang)
    
- cephfs: mds: fix nullptr dereference in MDCache::finish\_rollback ([pr#36439](https://github.com/ceph/ceph/pull/36439), “Yan, Zheng”)
    
- cephfs: mds: flag backtrace scrub failures for new files as okay ([pr#35400](https://github.com/ceph/ceph/pull/35400), Milind Changire)
    
- cephfs: mds: initialize MDSlaveUpdate::waiter ([pr#36462](https://github.com/ceph/ceph/pull/36462), “Yan, Zheng”)
    
- cephfs: mds: make threshold for MDS\_TRIM configurable ([pr#36175](https://github.com/ceph/ceph/pull/36175), Paul Emmerich)
    
- cephfs: mds: preserve ESlaveUpdate logevent until receiving OP\_FINISH ([pr#35394](https://github.com/ceph/ceph/pull/35394), Varsha Rao, songxinying)
    
- cephfs: mds: reset heartbeat in EMetaBlob replay ([pr#36170](https://github.com/ceph/ceph/pull/36170), Yanhu Cao)
    
- cephfs: mgr/fs/volumes misc fixes ([pr#36167](https://github.com/ceph/ceph/pull/36167), Patrick Donnelly, Kotresh HR, Ramana Raja)
    
- cephfs: mgr/volumes: Add snapshot info command ([pr#35672](https://github.com/ceph/ceph/pull/35672), Kotresh HR)
    
- cephfs: mgr/volumes: Deprecate protect/unprotect CLI calls for subvolume snapshots ([pr#36166](https://github.com/ceph/ceph/pull/36166), Shyamsundar Ranganathan)
    
- cephfs: qa: add debugging for volumes plugin use of libcephfs ([pr#36512](https://github.com/ceph/ceph/pull/36512), Patrick Donnelly)
    
- cephfs: qa: skip cache\_size check ([pr#36526](https://github.com/ceph/ceph/pull/36526), Patrick Donnelly)
    
- cephfs: tools/cephfs: don’t bind to public\_addr ([pr#35401](https://github.com/ceph/ceph/pull/35401), “Yan, Zheng”)
    
- cephfs: vstart\_runner: set mounted to True at the end of mount() ([pr#35396](https://github.com/ceph/ceph/pull/35396), Rishabh Dave)
    
- core,mon: mon/OSDMonitor: Reset grace period if failure interval exceeds a threshold ([pr#35798](https://github.com/ceph/ceph/pull/35798), Sridhar Seshasayee)
    
- core: mgr/DaemonServer.cc: make ‘config show’ on fsid work ([pr#36074](https://github.com/ceph/ceph/pull/36074), Neha Ojha)
    
- core: mgr/alert: can’t set inventory\_cache\_timeout/service\_cache\_timeout from CLI ([pr#36104](https://github.com/ceph/ceph/pull/36104), Kiefer Chang)
    
- core: osd/PG: fix history.same\_interval\_since of merge target again ([pr#36161](https://github.com/ceph/ceph/pull/36161), xie xingguo)
    
- core: osd/PeeringState.h: Fix pg stuck in WaitActingChange ([pr#35389](https://github.com/ceph/ceph/pull/35389), chen qiuzhang)
    
- core: osd: Cancel in-progress scrubs (not user requested) ([pr#36292](https://github.com/ceph/ceph/pull/36292), David Zafman)
    
- core: osd: fix crash in \_committed\_osd\_maps if incremental osdmap crc fails ([pr#36339](https://github.com/ceph/ceph/pull/36339), Neha Ojha, Dan van der Ster)
    
- core: osd: make “missing incremental map” a debug log message ([pr#35386](https://github.com/ceph/ceph/pull/35386), Nathan Cutler)
    
- core: osd: make message cap option usable again ([pr#35738](https://github.com/ceph/ceph/pull/35738), Neha Ojha, Josh Durgin)
    
- mgr/dashboard: Allow to edit iSCSI target with active session ([pr#35998](https://github.com/ceph/ceph/pull/35998), Ricardo Marques)
    
- mgr/dashboard: Prevent dashboard breakdown on bad pool selection ([pr#35367](https://github.com/ceph/ceph/pull/35367), Stephan Müller)
    
- mgr/dashboard: Prometheus query error in the metrics of Pools, OSDs and RBD images ([pr#35884](https://github.com/ceph/ceph/pull/35884), Avan Thakkar)
    
- mgr/dashboard: add popover list of Stand-by Managers & Metadata Servers (MDS) in landing page ([pr#34095](https://github.com/ceph/ceph/pull/34095), Kiefer Chang, Avan Thakkar)
    
- mgr/dashboard: fix Source column i18n issue in RBD configuration tables ([pr#35822](https://github.com/ceph/ceph/pull/35822), Kiefer Chang)
    
- mgr/k8sevents: sanitise kubernetes events ([pr#35563](https://github.com/ceph/ceph/pull/35563), Paul Cuzner)
    
- mgr/prometheus: improve Prometheus module cache ([pr#35918](https://github.com/ceph/ceph/pull/35918), Patrick Seidensal)
    
- mgr: mgr/progress: Skip pg\_summary update if \_events dict is empty ([pr#36075](https://github.com/ceph/ceph/pull/36075), Manuel Lausch)
    
- mgr: mgr/telemetry: force –license when sending while opted-out ([pr#35390](https://github.com/ceph/ceph/pull/35390), Yaarit Hatuka)
    
- mgr: mon/PGMap: do not consider changing pg stuck ([pr#35959](https://github.com/ceph/ceph/pull/35959), Kefu Chai)
    
- monitoring: fixing some issues in RBD detail dashboard ([pr#35464](https://github.com/ceph/ceph/pull/35464), Kiefer Chang)
    
- msgr: New msgr2 crc and secure modes (msgr2.1) ([pr#35733](https://github.com/ceph/ceph/pull/35733), Jianpeng Ma, Ilya Dryomov)
    
- rbd: librbd: new ‘write\_zeroes’ API methods to suppliment the discard APIs ([pr#36250](https://github.com/ceph/ceph/pull/36250), Jason Dillaman)
    
- rbd: mgr/dashboard: work with v1 RBD images ([pr#35712](https://github.com/ceph/ceph/pull/35712), Ernesto Puerta)
    
- rbd: rbd: librbd: Watcher should not attempt to re-watch after detecting blacklisting ([pr#35385](https://github.com/ceph/ceph/pull/35385), Jason Dillaman)
    
- rgw,tests: test/rgw: update hadoop versions ([pr#35778](https://github.com/ceph/ceph/pull/35778), Casey Bodley, Vasu Kulkarni)
    
- rgw: Add subuser to OPA request ([pr#36187](https://github.com/ceph/ceph/pull/36187), Seena Fallah)
    
- rgw: Add support wildcard subuser for bucket policy ([pr#36186](https://github.com/ceph/ceph/pull/36186), Seena Fallah)
    
- rgw: add “rgw-orphan-list” tool and “radosgw-admin bucket radoslist …” ([pr#34127](https://github.com/ceph/ceph/pull/34127), J. Eric Ivancich)
    
- rgw: add check for index entry’s existing when adding bucket stats during bucket reshard ([pr#36189](https://github.com/ceph/ceph/pull/36189), zhang Shaowen)
    
- rgw: add quota enforcement to CopyObj ([pr#36184](https://github.com/ceph/ceph/pull/36184), Casey Bodley)
    
- rgw: bucket list/stats truncates for user w/ >1000 buckets ([pr#36165](https://github.com/ceph/ceph/pull/36165), J. Eric Ivancich)
    
- rgw: cls\_bucket\_list\_(un)ordered should clear results collection ([pr#36163](https://github.com/ceph/ceph/pull/36163), J. Eric Ivancich)
    
- rgw: fix loop problem with swift stat on account ([pr#36185](https://github.com/ceph/ceph/pull/36185), Marcus Watts)
    
- rgw: lc: fix Segmentation Fault when the tag of the object was not found ([pr#36086](https://github.com/ceph/ceph/pull/36086), yupeng chen, zhuo li)
    
- rgw: ordered listing lcv not managed correctly ([pr#35882](https://github.com/ceph/ceph/pull/35882), J. Eric Ivancich)
    
- rgw: radoslist incomplete multipart uploads fix marker progression ([pr#36191](https://github.com/ceph/ceph/pull/36191), J. Eric Ivancich)
    
- rgw: rgw/iam: correcting the result of get role policy ([pr#36193](https://github.com/ceph/ceph/pull/36193), Pritha Srivastava)
    
- rgw: rgw/url: fix amqp urls with vhosts ([pr#35384](https://github.com/ceph/ceph/pull/35384), Yuval Lifshitz)
    
- rgw: stop realm reloader before store shutdown ([pr#36192](https://github.com/ceph/ceph/pull/36192), Casey Bodley)
    
- tools: Add statfs operation to ceph-objecstore-tool ([pr#35713](https://github.com/ceph/ceph/pull/35713), David Zafman)
