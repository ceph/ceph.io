---
title: "v10.2.3 Jewel Released"
date: "2016-09-28"
author: "TheAnalyst"
tags:
  - "release"
  - "jewel"
---

This point release fixes several important bugs in RBD mirroring, RGW multi-site, CephFS, and RADOS.

We recommend that all v10.2.x users upgrade.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v10.2.3.txt).

### Notable Changes

- build/ops: 60-ceph-partuuid-workaround-rules still needed by debian jessie (udev 215-17) ([issue#16351](http://tracker.ceph.com/issues/16351), [pr#10653](http://github.com/ceph/ceph/pull/10653), runsisi, Loic Dachary)
- build/ops: ceph Resource Agent does not work with systemd ([issue#14828](http://tracker.ceph.com/issues/14828), [pr#9917](http://github.com/ceph/ceph/pull/9917), Nathan Cutler)
- build/ops: ceph-base requires parted ([issue#16095](http://tracker.ceph.com/issues/16095), [pr#10008](http://github.com/ceph/ceph/pull/10008), Ken Dreyer)
- build/ops: ceph-osd-prestart.sh contains Upstart-specific code ([issue#15984](http://tracker.ceph.com/issues/15984), [pr#10364](http://github.com/ceph/ceph/pull/10364), Nathan Cutler)
- build/ops: mount.ceph: move from ceph-base to ceph-common and add symlink in /sbin for SUSE ([issue#16598](http://tracker.ceph.com/issues/16598), [issue#16645](http://tracker.ceph.com/issues/16645), [pr#10357](http://github.com/ceph/ceph/pull/10357), Nathan Cutler, Dan Horák, Ricardo Dias, Kefu Chai)
- build/ops: need rocksdb commit 7ca731b12ce for ppc64le build ([issue#17092](http://tracker.ceph.com/issues/17092), [pr#10816](http://github.com/ceph/ceph/pull/10816), Nathan Cutler)
- build/ops: rpm: OBS needs ExclusiveArch ([issue#16936](http://tracker.ceph.com/issues/16936), [pr#10614](http://github.com/ceph/ceph/pull/10614), Michel Normand)
- cli: ceph command line tool chokes on ceph –w (the dash is unicode ‘en dash’ &ndash, copy-paste to reproduce) ([issue#12287](http://tracker.ceph.com/issues/12287), [pr#10420](http://github.com/ceph/ceph/pull/10420), Oleh Prypin, Kefu Chai)
- common: expose buffer const\_iterator symbols ([issue#16899](http://tracker.ceph.com/issues/16899), [pr#10552](http://github.com/ceph/ceph/pull/10552), Noah Watkins)
- common: global-init: fixup chown of the run directory along with log and asok files ([issue#15607](http://tracker.ceph.com/issues/15607), [pr#8754](http://github.com/ceph/ceph/pull/8754), Karol Mroz)
- fs: ceph-fuse: link to libtcmalloc or jemalloc ([issue#16655](http://tracker.ceph.com/issues/16655), [pr#10303](http://github.com/ceph/ceph/pull/10303), Yan, Zheng)
- fs: client: crash in unmount when fuse\_use\_invalidate\_cb is enabled ([issue#16137](http://tracker.ceph.com/issues/16137), [pr#10106](http://github.com/ceph/ceph/pull/10106), Yan, Zheng)
- fs: client: fstat cap release ([issue#15723](http://tracker.ceph.com/issues/15723), [pr#9562](http://github.com/ceph/ceph/pull/9562), Yan, Zheng, Noah Watkins)
- fs: essential backports for OpenStack Manila ([issue#15406](http://tracker.ceph.com/issues/15406), [issue#15614](http://tracker.ceph.com/issues/15614), [issue#15615](http://tracker.ceph.com/issues/15615), [pr#10453](http://github.com/ceph/ceph/pull/10453), John Spray, Ramana Raja, Xiaoxi Chen)
- fs: fix double-unlock on shutdown ([issue#17126](http://tracker.ceph.com/issues/17126), [pr#10847](http://github.com/ceph/ceph/pull/10847), Greg Farnum)
- fs: fix mdsmap print\_summary with standby replays ([issue#15705](http://tracker.ceph.com/issues/15705), [pr#9547](http://github.com/ceph/ceph/pull/9547), John Spray)
- fs: fuse mounted file systems fails SAMBA CTDB ping\_pong rw test with v9.0.2 ([issue#12653](http://tracker.ceph.com/issues/12653), [issue#15634](http://tracker.ceph.com/issues/15634), [pr#10108](http://github.com/ceph/ceph/pull/10108), Yan, Zheng)
- librados: Missing export for rados\_aio\_get\_version in src/include/rados/librados.h ([issue#15535](http://tracker.ceph.com/issues/15535), [pr#9574](http://github.com/ceph/ceph/pull/9574), Jim Wright)
- librados: osd: bad flags can crash the osd ([issue#16012](http://tracker.ceph.com/issues/16012), [pr#9997](http://github.com/ceph/ceph/pull/9997), Sage Weil)
- librbd: Close journal and object map before flagging exclusive lock as released ([issue#16450](http://tracker.ceph.com/issues/16450), [pr#10053](http://github.com/ceph/ceph/pull/10053), Jason Dillaman)
- librbd: Crash when utilizing advisory locking API functions ([issue#16364](http://tracker.ceph.com/issues/16364), [pr#10051](http://github.com/ceph/ceph/pull/10051), Jason Dillaman)
- librbd: ExclusiveLock object leaked when switching to snapshot ([issue#16446](http://tracker.ceph.com/issues/16446), [pr#10054](http://github.com/ceph/ceph/pull/10054), Jason Dillaman)
- librbd: FAILED assert(object\_no < m\_object\_map.size()) ([issue#16561](http://tracker.ceph.com/issues/16561), [pr#10647](http://github.com/ceph/ceph/pull/10647), Jason Dillaman)
- librbd: Image removal doesn’t necessarily clean up all rbd\_mirroring entries ([issue#16471](http://tracker.ceph.com/issues/16471), [pr#10009](http://github.com/ceph/ceph/pull/10009), Jason Dillaman)
- librbd: Object map/fast-diff invalidated if journal replays the same snap remove event ([issue#16350](http://tracker.ceph.com/issues/16350), [pr#10010](http://github.com/ceph/ceph/pull/10010), Jason Dillaman)
- librbd: Timeout sending mirroring notification shouldn’t result in failure ([issue#16470](http://tracker.ceph.com/issues/16470), [pr#10052](http://github.com/ceph/ceph/pull/10052), Jason Dillaman)
- librbd: Whitelist EBUSY error from snap unprotect for journal replay ([issue#16445](http://tracker.ceph.com/issues/16445), [pr#10055](http://github.com/ceph/ceph/pull/10055), Jason Dillaman)
- librbd: cancel all tasks should wait until finisher is done ([issue#16517](http://tracker.ceph.com/issues/16517), [pr#9752](http://github.com/ceph/ceph/pull/9752), Haomai Wang)
- librbd: delay acquiring lock if image watch has failed ([issue#16923](http://tracker.ceph.com/issues/16923), [pr#10827](http://github.com/ceph/ceph/pull/10827), Jason Dillaman)
- librbd: fix missing return statement if failed to get mirror image state ([issue#16600](http://tracker.ceph.com/issues/16600), [pr#10144](http://github.com/ceph/ceph/pull/10144), runsisi)
- librbd: flag image as updated after proxying maintenance op ([issue#16404](http://tracker.ceph.com/issues/16404), [pr#9883](http://github.com/ceph/ceph/pull/9883), Jason Dillaman)
- librbd: mkfs.xfs slow performance with discards and object map ([issue#16707](http://tracker.ceph.com/issues/16707), [issue#16689](http://tracker.ceph.com/issues/16689), [pr#10649](http://github.com/ceph/ceph/pull/10649), Jason Dillaman)
- librbd: potential use after free on refresh error ([issue#16519](http://tracker.ceph.com/issues/16519), [pr#9952](http://github.com/ceph/ceph/pull/9952), Mykola Golub)
- librbd: rbd-nbd does not properly handle resize notifications ([issue#15715](http://tracker.ceph.com/issues/15715), [pr#10679](http://github.com/ceph/ceph/pull/10679), Mykola Golub)
- librbd: the option ‘rbd\_cache\_writethrough\_until\_flush=true’ dosn’t work ([issue#16740](http://tracker.ceph.com/issues/16740), [issue#16386](http://tracker.ceph.com/issues/16386), [issue#16708](http://tracker.ceph.com/issues/16708), [issue#16654](http://tracker.ceph.com/issues/16654), [issue#16478](http://tracker.ceph.com/issues/16478), [pr#10797](http://github.com/ceph/ceph/pull/10797), Mykola Golub, xinxin shu, Xiaowei Chen, Jason Dillaman)
- mds: tell command blocks forever with async messenger (TestVolumeClient.test\_evict\_client failure) ([issue#16288](http://tracker.ceph.com/issues/16288), [pr#10501](http://github.com/ceph/ceph/pull/10501), Douglas Fuller)
- mds: Confusing MDS log message when shut down with stalled journaler reads ([issue#15689](http://tracker.ceph.com/issues/15689), [pr#9557](http://github.com/ceph/ceph/pull/9557), John Spray)
- mds: Deadlock on shutdown active rank while busy with metadata IO ([issue#16042](http://tracker.ceph.com/issues/16042), [pr#10502](http://github.com/ceph/ceph/pull/10502), Patrick Donnelly)
- mds: Failing file operations on kernel based cephfs mount point leaves unaccessible file behind on hammer 0.94.7 ([issue#16013](http://tracker.ceph.com/issues/16013), [pr#10199](http://github.com/ceph/ceph/pull/10199), Yan, Zheng)
- mds: Fix shutting down mds timed-out due to deadlock ([issue#16396](http://tracker.ceph.com/issues/16396), [pr#10500](http://github.com/ceph/ceph/pull/10500), Zhi Zhang)
- mds: MDSMonitor fixes ([issue#16136](http://tracker.ceph.com/issues/16136), [pr#9561](http://github.com/ceph/ceph/pull/9561), xie xingguo)
- mds: MDSMonitor::check\_subs() is very buggy ([issue#16022](http://tracker.ceph.com/issues/16022), [pr#10103](http://github.com/ceph/ceph/pull/10103), Yan, Zheng)
- mds: Session::check\_access() is buggy ([issue#16358](http://tracker.ceph.com/issues/16358), [pr#10105](http://github.com/ceph/ceph/pull/10105), Yan, Zheng)
- mds: StrayManager.cc: 520: FAILED assert(dnl->is\_primary()) ([issue#15920](http://tracker.ceph.com/issues/15920), [pr#9559](http://github.com/ceph/ceph/pull/9559), Yan, Zheng)
- mds: enforce a dirfrag limit on entries ([issue#16164](http://tracker.ceph.com/issues/16164), [pr#10104](http://github.com/ceph/ceph/pull/10104), Patrick Donnelly)
- mds: fix SnapRealm::have\_past\_parents\_open() ([issue#16299](http://tracker.ceph.com/issues/16299), [pr#10499](http://github.com/ceph/ceph/pull/10499), Yan, Zheng)
- mds: fix getattr starve setattr ([issue#16154](http://tracker.ceph.com/issues/16154), [pr#9560](http://github.com/ceph/ceph/pull/9560), Yan, Zheng)
- mds: wrongly treat symlink inode as normal file/dir when symlink inode is stale on kcephfs ([issue#15702](http://tracker.ceph.com/issues/15702), [pr#9405](http://github.com/ceph/ceph/pull/9405), Zhi Zhang)
- mon: “mon metadata” fails when only one monitor exists ([issue#15866](http://tracker.ceph.com/issues/15866), [pr#10654](http://github.com/ceph/ceph/pull/10654), John Spray, Kefu Chai)
- mon: Monitor: validate prefix on handle\_command() ([issue#16297](http://tracker.ceph.com/issues/16297), [pr#10036](http://github.com/ceph/ceph/pull/10036), You Ji)
- mon: OSDMonitor: drop pg temps from not the current primary ([issue#16127](http://tracker.ceph.com/issues/16127), [pr#9998](http://github.com/ceph/ceph/pull/9998), Samuel Just)
- mon: prepare\_pgtemp needs to only update up\_thru if newer than the existing one ([issue#16185](http://tracker.ceph.com/issues/16185), [pr#10001](http://github.com/ceph/ceph/pull/10001), Samuel Just)
- msgr: AsyncConnection::lockmsg/async lockdep cycle: AsyncMessenger::lock, MDSDaemon::mds\_lock, AsyncConnection::lock ([issue#16237](http://tracker.ceph.com/issues/16237), [pr#10004](http://github.com/ceph/ceph/pull/10004), Haomai Wang)
- msgr: async messenger mon crash ([issue#16378](http://tracker.ceph.com/issues/16378), [issue#16418](http://tracker.ceph.com/issues/16418), [pr#9996](http://github.com/ceph/ceph/pull/9996), Haomai Wang)
- msgr: backports of all asyncmsgr fixes to jewel ([issue#15503](http://tracker.ceph.com/issues/15503), [issue#15372](http://tracker.ceph.com/issues/15372), [pr#9633](http://github.com/ceph/ceph/pull/9633), Yan Jun, Haomai Wang, Piotr Dałek)
- msgr: msg/async: connection race hang ([issue#15849](http://tracker.ceph.com/issues/15849), [pr#10003](http://github.com/ceph/ceph/pull/10003), Haomai Wang)
- osd: FileStore: umount hang because sync thread doesn’t exit ([issue#15695](http://tracker.ceph.com/issues/15695), [pr#9105](http://github.com/ceph/ceph/pull/9105), Kefu Chai)
- osd: Fixes for list-inconsistent-\* ([issue#15766](http://tracker.ceph.com/issues/15766), [issue#16192](http://tracker.ceph.com/issues/16192), [issue#15719](http://tracker.ceph.com/issues/15719), [pr#9565](http://github.com/ceph/ceph/pull/9565), David Zafman)
- osd: New pools have bogus stuck inactive/unclean HEALTH\_ERR messages until they are first active and clean ([issue#14952](http://tracker.ceph.com/issues/14952), [pr#10007](http://github.com/ceph/ceph/pull/10007), Sage Weil)
- osd: OSD crash with Hammer to Jewel Upgrade: void FileStore::init\_temp\_collections() ([issue#16672](http://tracker.ceph.com/issues/16672), [pr#10561](http://github.com/ceph/ceph/pull/10561), David Zafman)
- osd: OSD failed to subscribe skipped osdmaps after ceph osd pause ([issue#17023](http://tracker.ceph.com/issues/17023), [pr#10804](http://github.com/ceph/ceph/pull/10804), Kefu Chai)
- osd: ObjectCacher split BufferHead read fix ([issue#16002](http://tracker.ceph.com/issues/16002), [pr#10074](http://github.com/ceph/ceph/pull/10074), Greg Farnum)
- osd: ReplicatedBackend doesn’t increment stats on pull, only push ([issue#16277](http://tracker.ceph.com/issues/16277), [pr#10421](http://github.com/ceph/ceph/pull/10421), Kefu Chai)
- osd: Scrub error: 0/1 pinned ([issue#15952](http://tracker.ceph.com/issues/15952), [pr#9576](http://github.com/ceph/ceph/pull/9576), Samuel Just)
- osd: crash adding snap to purged\_snaps in ReplicatedPG::WaitingOnReplicas ([issue#15943](http://tracker.ceph.com/issues/15943), [pr#9575](http://github.com/ceph/ceph/pull/9575), Samuel Just)
- osd: partprobe intermittent issues during ceph-disk prepare ([issue#15176](http://tracker.ceph.com/issues/15176), [pr#10497](http://github.com/ceph/ceph/pull/10497), Marius Vollmer, Loic Dachary)
- osd: saw valgrind issues in ReplicatedPG::new\_repop ([issue#16801](http://tracker.ceph.com/issues/16801), [pr#10760](http://github.com/ceph/ceph/pull/10760), Kefu Chai)
- osd: sparse\_read on ec pool should return extends with correct offset ([issue#16138](http://tracker.ceph.com/issues/16138), [pr#10006](http://github.com/ceph/ceph/pull/10006), kofiliu)
- osd:sched\_time not actually randomized ([issue#15890](http://tracker.ceph.com/issues/15890), [pr#9578](http://github.com/ceph/ceph/pull/9578), xie xingguo)
- rbd: ImageReplayer::is\_replaying does not include flush state ([issue#16970](http://tracker.ceph.com/issues/16970), [pr#10790](http://github.com/ceph/ceph/pull/10790), Jason Dillaman)
- rbd: Journal duplicate op detection can cause lockdep error ([issue#16363](http://tracker.ceph.com/issues/16363), [pr#10044](http://github.com/ceph/ceph/pull/10044), Jason Dillaman)
- rbd: Journal needs to handle duplicate maintenance op tids ([issue#16362](http://tracker.ceph.com/issues/16362), [pr#10045](http://github.com/ceph/ceph/pull/10045), Jason Dillaman)
- rbd: Unable to disable journaling feature if in unexpected mirror state ([issue#16348](http://tracker.ceph.com/issues/16348), [pr#10042](http://github.com/ceph/ceph/pull/10042), Jason Dillaman)
- rbd: bashism in src/rbdmap ([issue#16608](http://tracker.ceph.com/issues/16608), [pr#10786](http://github.com/ceph/ceph/pull/10786), Jason Dillaman)
- rbd: doc: format 2 now is the default image format ([issue#17026](http://tracker.ceph.com/issues/17026), [pr#10732](http://github.com/ceph/ceph/pull/10732), Chengwei Yang)
- rbd: hen journaling is enabled, a flush request shouldn’t flush the cache ([issue#15761](http://tracker.ceph.com/issues/15761), [pr#10041](http://github.com/ceph/ceph/pull/10041), Yuan Zhou)
- rbd: possible race condition during journal transition from replay to ready ([issue#16198](http://tracker.ceph.com/issues/16198), [pr#10047](http://github.com/ceph/ceph/pull/10047), Jason Dillaman)
- rbd: qa/workunits/rbd: respect RBD\_CREATE\_ARGS environment variable ([issue#16289](http://tracker.ceph.com/issues/16289), [pr#9721](http://github.com/ceph/ceph/pull/9721), Mykola Golub)
- rbd: rbd-mirror should disable proxied maintenance ops for non-primary image ([issue#16411](http://tracker.ceph.com/issues/16411), [pr#10050](http://github.com/ceph/ceph/pull/10050), Jason Dillaman)
- rbd: rbd-mirror: FAILED assert(m\_local\_image\_ctx->object\_map != nullptr) ([issue#16558](http://tracker.ceph.com/issues/16558), [pr#10646](http://github.com/ceph/ceph/pull/10646), Jason Dillaman)
- rbd: rbd-mirror: FAILED assert(m\_on\_update\_status\_finish == nullptr) ([issue#16956](http://tracker.ceph.com/issues/16956), [pr#10792](http://github.com/ceph/ceph/pull/10792), Jason Dillaman)
- rbd: rbd-mirror: FAILED assert(m\_state == STATE\_STOPPING) ([issue#16980](http://tracker.ceph.com/issues/16980), [pr#10791](http://github.com/ceph/ceph/pull/10791), Jason Dillaman)
- rbd: rbd-mirror: ensure replay status formatter has completed before stopping replay ([issue#16352](http://tracker.ceph.com/issues/16352), [pr#10043](http://github.com/ceph/ceph/pull/10043), Jason Dillaman)
- rbd: rbd-mirror: include local pool id in resync throttle unique key ([issue#16536](http://tracker.ceph.com/issues/16536), [issue#15239](http://tracker.ceph.com/issues/15239), [issue#16488](http://tracker.ceph.com/issues/16488), [issue#16491](http://tracker.ceph.com/issues/16491), [issue#16329](http://tracker.ceph.com/issues/16329), [issue#15108](http://tracker.ceph.com/issues/15108), [issue#15670](http://tracker.ceph.com/issues/15670), [pr#10678](http://github.com/ceph/ceph/pull/10678), Ricardo Dias, Jason Dillaman)
- rbd: rbd-mirror: potential race condition accessing local image journal ([issue#16230](http://tracker.ceph.com/issues/16230), [pr#10046](http://github.com/ceph/ceph/pull/10046), Jason Dillaman)
- rbd: rbd-mirror: reduce memory footprint during journal replay ([issue#16321](http://tracker.ceph.com/issues/16321), [issue#16489](http://tracker.ceph.com/issues/16489), [issue#16622](http://tracker.ceph.com/issues/16622), [issue#16539](http://tracker.ceph.com/issues/16539), [issue#16223](http://tracker.ceph.com/issues/16223), [issue#16349](http://tracker.ceph.com/issues/16349), [pr#10684](http://github.com/ceph/ceph/pull/10684), Mykola Golub, Jason Dillaman)
- rgw: A query on a static large object fails with 404 error ([issue#16015](http://tracker.ceph.com/issues/16015), [pr#9544](http://github.com/ceph/ceph/pull/9544), Radoslaw Zarzynski)
- rgw: Add zone rename to radosgw\_admin ([issue#16934](http://tracker.ceph.com/issues/16934), [pr#10663](http://github.com/ceph/ceph/pull/10663), Shilpa Jagannath)
- rgw: Bucket index shards orphaned after bucket delete ([issue#16412](http://tracker.ceph.com/issues/16412), [pr#10525](http://github.com/ceph/ceph/pull/10525), Orit Wasserman)
- rgw: Bug when using port 443s in rgw. ([issue#16548](http://tracker.ceph.com/issues/16548), [pr#10664](http://github.com/ceph/ceph/pull/10664), Pritha Srivastava)
- rgw: Fallback to Host header for bucket name. ([issue#15975](http://tracker.ceph.com/issues/15975), [pr#10693](http://github.com/ceph/ceph/pull/10693), Robin H. Johnson)
- rgw: Fix civetweb IPv6 ([issue#16928](http://tracker.ceph.com/issues/16928), [pr#10580](http://github.com/ceph/ceph/pull/10580), Robin H. Johnson)
- rgw: Increase log level for messages occuring while running rgw admin command ([issue#16935](http://tracker.ceph.com/issues/16935), [pr#10765](http://github.com/ceph/ceph/pull/10765), Shilpa Jagannath)
- rgw: No Last-Modified, Content-Size and X-Object-Manifest headers if no segments in DLO manifest ([issue#15812](http://tracker.ceph.com/issues/15812), [pr#9265](http://github.com/ceph/ceph/pull/9265), Radoslaw Zarzynski)
- rgw: RGWPeriodPuller tries to pull from itself ([issue#16939](http://tracker.ceph.com/issues/16939), [pr#10764](http://github.com/ceph/ceph/pull/10764), Casey Bodley)
- rgw: Set Access-Control-Allow-Origin to a Asterisk if allowed in a rule ([issue#15348](http://tracker.ceph.com/issues/15348), [pr#9453](http://github.com/ceph/ceph/pull/9453), Wido den Hollander)
- rgw: Swift API returns double space usage and objects of account metadata ([issue#16188](http://tracker.ceph.com/issues/16188), [pr#10148](http://github.com/ceph/ceph/pull/10148), Albert Tu)
- rgw: account/container metadata not actually present in a request are deleted during POST through Swift API ([issue#15977](http://tracker.ceph.com/issues/15977), [issue#15779](http://tracker.ceph.com/issues/15779), [pr#9542](http://github.com/ceph/ceph/pull/9542), Radoslaw Zarzynski)
- rgw: add socket backlog setting for via ceph.conf ([issue#16406](http://tracker.ceph.com/issues/16406), [pr#10216](http://github.com/ceph/ceph/pull/10216), Feng Guo)
- rgw: add tenant support to multisite sync ([issue#16469](http://tracker.ceph.com/issues/16469), [issue#16121](http://tracker.ceph.com/issues/16121), [issue#16665](http://tracker.ceph.com/issues/16665), [pr#10845](http://github.com/ceph/ceph/pull/10845), Yehuda Sadeh, Josh Durgin, Casey Bodley, Pritha Srivastava)
- rgw: add\_zone only clears master\_zone if –master=false ([issue#15901](http://tracker.ceph.com/issues/15901), [pr#9327](http://github.com/ceph/ceph/pull/9327), Casey Bodley)
- rgw: aws4 parsing issue ([issue#15940](http://tracker.ceph.com/issues/15940), [issue#15939](http://tracker.ceph.com/issues/15939), [pr#9545](http://github.com/ceph/ceph/pull/9545), Yehuda Sadeh)
- rgw: aws4: add STREAMING-AWS4-HMAC-SHA256-PAYLOAD support ([issue#16146](http://tracker.ceph.com/issues/16146), [pr#10167](http://github.com/ceph/ceph/pull/10167), Radoslaw Zarzynski, Javier M. Mellid)
- rgw: backport merge of static sites fixes ([issue#15555](http://tracker.ceph.com/issues/15555), [issue#15532](http://tracker.ceph.com/issues/15532), [issue#15531](http://tracker.ceph.com/issues/15531), [pr#9568](http://github.com/ceph/ceph/pull/9568), Robin H. Johnson)
- rgw: can set negative max\_buckets on RGWUserInfo ([issue#14534](http://tracker.ceph.com/issues/14534), [pr#10655](http://github.com/ceph/ceph/pull/10655), Yehuda Sadeh)
- rgw: cleanup radosgw-admin temp command as it was deprecated ([issue#16023](http://tracker.ceph.com/issues/16023), [pr#9390](http://github.com/ceph/ceph/pull/9390), Vikhyat Umrao)
- rgw: comparing return code to ERR\_NOT\_MODIFIED in rgw\_rest\_s3.cc (needs minus sign) ([issue#16327](http://tracker.ceph.com/issues/16327), [pr#9790](http://github.com/ceph/ceph/pull/9790), Nathan Cutler)
- rgw: custom metadata aren’t camelcased in Swift’s responses ([issue#15902](http://tracker.ceph.com/issues/15902), [pr#9267](http://github.com/ceph/ceph/pull/9267), Radoslaw Zarzynski)
- rgw: data sync stops after getting error in all data log sync shards ([issue#16530](http://tracker.ceph.com/issues/16530), [pr#10073](http://github.com/ceph/ceph/pull/10073), Yehuda Sadeh)
- rgw: default zone and zonegroup cannot be added to a realm ([issue#16839](http://tracker.ceph.com/issues/16839), [pr#10658](http://github.com/ceph/ceph/pull/10658), Casey Bodley)
- rgw: document multi tenancy ([issue#16635](http://tracker.ceph.com/issues/16635), [pr#10217](http://github.com/ceph/ceph/pull/10217), Pete Zaitcev)
- rgw: don’t unregister request if request is not connected to manager ([issue#15911](http://tracker.ceph.com/issues/15911), [pr#9242](http://github.com/ceph/ceph/pull/9242), Yehuda Sadeh)
- rgw: failed to create bucket after upgrade from hammer to jewel ([issue#16627](http://tracker.ceph.com/issues/16627), [pr#10524](http://github.com/ceph/ceph/pull/10524), Orit Wasserman)
- rgw: fix ldap bindpw parsing ([issue#16286](http://tracker.ceph.com/issues/16286), [pr#10518](http://github.com/ceph/ceph/pull/10518), Matt Benjamin)
- rgw: fix multi-delete query param parsing. ([issue#16618](http://tracker.ceph.com/issues/16618), [pr#10188](http://github.com/ceph/ceph/pull/10188), Robin H. Johnson)
- rgw: improve support for Swift’s object versioning. ([issue#15925](http://tracker.ceph.com/issues/15925), [pr#10710](http://github.com/ceph/ceph/pull/10710), Radoslaw Zarzynski)
- rgw: initial slashes are not properly handled in Swift’s BulkDelete ([issue#15948](http://tracker.ceph.com/issues/15948), [pr#9316](http://github.com/ceph/ceph/pull/9316), Radoslaw Zarzynski)
- rgw: master: build failures with boost > 1.58 ([issue#16392](http://tracker.ceph.com/issues/16392), [issue#16391](http://tracker.ceph.com/issues/16391), [pr#10026](http://github.com/ceph/ceph/pull/10026), Abhishek Lekshmanan)
- rgw: multisite segfault on ~RGWRealmWatcher if realm was deleted ([issue#16817](http://tracker.ceph.com/issues/16817), [pr#10660](http://github.com/ceph/ceph/pull/10660), Casey Bodley)
- rgw: multisite sync races with deletes ([issue#16222](http://tracker.ceph.com/issues/16222), [issue#16464](http://tracker.ceph.com/issues/16464), [issue#16220](http://tracker.ceph.com/issues/16220), [issue#16143](http://tracker.ceph.com/issues/16143), [pr#10293](http://github.com/ceph/ceph/pull/10293), Yehuda Sadeh, Casey Bodley)
- rgw: multisite: preserve zone’s extra pool ([issue#16712](http://tracker.ceph.com/issues/16712), [pr#10537](http://github.com/ceph/ceph/pull/10537), Abhishek Lekshmanan)
- rgw: object expirer’s hints might be trimmed without processing in some circumstances ([issue#16705](http://tracker.ceph.com/issues/16705), [issue#16684](http://tracker.ceph.com/issues/16684), [pr#10763](http://github.com/ceph/ceph/pull/10763), Radoslaw Zarzynski)
- rgw: radosgw-admin failure for user create after upgrade from hammer to jewel ([issue#15937](http://tracker.ceph.com/issues/15937), [pr#9294](http://github.com/ceph/ceph/pull/9294), Orit Wasserman, Abhishek Lekshmanan)
- rgw: radosgw-admin: EEXIST messages for create operations ([issue#15720](http://tracker.ceph.com/issues/15720), [pr#9268](http://github.com/ceph/ceph/pull/9268), Abhishek Lekshmanan)
- rgw: radosgw-admin: inconsistency in uid/email handling ([issue#13598](http://tracker.ceph.com/issues/13598), [pr#10520](http://github.com/ceph/ceph/pull/10520), Matt Benjamin)
- rgw: realm pull fails when using apache frontend ([issue#15846](http://tracker.ceph.com/issues/15846), [pr#9266](http://github.com/ceph/ceph/pull/9266), Orit Wasserman)
- rgw: retry on bucket sync errors ([issue#16108](http://tracker.ceph.com/issues/16108), [pr#9425](http://github.com/ceph/ceph/pull/9425), Yehuda Sadeh)
- rgw: s3website: x-amz-website-redirect-location header returns malformed HTTP response ([issue#15531](http://tracker.ceph.com/issues/15531), [pr#9099](http://github.com/ceph/ceph/pull/9099), Robin H. Johnson)
- rgw: segfault in RGWOp\_MDLog\_Notify ([issue#16666](http://tracker.ceph.com/issues/16666), [pr#10662](http://github.com/ceph/ceph/pull/10662), Casey Bodley)
- rgw: segmentation fault on error\_repo in data sync ([issue#16603](http://tracker.ceph.com/issues/16603), [pr#10523](http://github.com/ceph/ceph/pull/10523), Casey Bodley)
- rgw: selinux denials in RGW ([issue#16126](http://tracker.ceph.com/issues/16126), [pr#10519](http://github.com/ceph/ceph/pull/10519), Boris Ranto)
- rgw: support size suffixes for –max-size in radosgw-admin command ([issue#16004](http://tracker.ceph.com/issues/16004), [pr#9743](http://github.com/ceph/ceph/pull/9743), Vikhyat Umrao)
- rgw: updating CORS/ACLs might not work in some circumstances ([issue#15976](http://tracker.ceph.com/issues/15976), [pr#9543](http://github.com/ceph/ceph/pull/9543), Radoslaw Zarzynski)
- rgw: use zone endpoints instead of zonegroup endpoints ([issue#16834](http://tracker.ceph.com/issues/16834), [pr#10659](http://github.com/ceph/ceph/pull/10659), Casey Bodley)
- tests: improve rbd-mirror test case coverage ([issue#16197](http://tracker.ceph.com/issues/16197), [pr#9631](http://github.com/ceph/ceph/pull/9631), Mykola Golub, Jason Dillaman)
- tests: rados/test.sh workunit timesout on OpenStack ([issue#15403](http://tracker.ceph.com/issues/15403), [pr#8904](http://github.com/ceph/ceph/pull/8904), Loic Dachary)
- tools: ceph-disk: Accept bcache devices as data disks ([issue#13278](http://tracker.ceph.com/issues/13278), [pr#8497](http://github.com/ceph/ceph/pull/8497), Peter Sabaini)
- tools: rados: Add cleanup message with time to rados bench output ([issue#15704](http://tracker.ceph.com/issues/15704), [pr#9740](http://github.com/ceph/ceph/pull/9740), Vikhyat Umrao)
- tools: src/script/subman fails with KeyError: ‘nband’ ([issue#16961](http://tracker.ceph.com/issues/16961), [pr#10625](http://github.com/ceph/ceph/pull/10625), Loic Dachary, Ali Maredia)
