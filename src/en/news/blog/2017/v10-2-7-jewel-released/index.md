---
title: "v10.2.7 Jewel Released"
date: "2017-04-11"
author: "TheAnalyst"
tags:
  - "release"
  - "jewel"
---

This point release fixes several important bugs in RBD mirroring, librbd & RGW.

We recommend that all v10.2.x users upgrade.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v10.2.7.txt).

### Notable Changes

- librbd: possible race in ExclusiveLock handle\_peer\_notification ([issue#19368](http://tracker.ceph.com/issues/19368), [pr#14233](https://github.com/ceph/ceph/pull/14233), Mykola Golub)
- osd: Increase priority for inactive PGs backfill ([issue#18350](http://tracker.ceph.com/issues/18350), [pr#13232](https://github.com/ceph/ceph/pull/13232), Bartłomiej Święcki)
- osd: Scrub improvements and other fixes ([issue#17857](http://tracker.ceph.com/issues/17857), [issue#18114](http://tracker.ceph.com/issues/18114), [issue#13937](http://tracker.ceph.com/issues/13937), [issue#18113](http://tracker.ceph.com/issues/18113), [pr#13146](https://github.com/ceph/ceph/pull/13146), Kefu Chai, David Zafman)
- osd: fix OSD network address in OSD heartbeat\_check log message ([issue#18657](http://tracker.ceph.com/issues/18657), [pr#13108](https://github.com/ceph/ceph/pull/13108), Vikhyat Umrao)
- rbd-mirror: deleting a snapshot during sync can result in read errors ([issue#18990](http://tracker.ceph.com/issues/18990), [pr#13596](https://github.com/ceph/ceph/pull/13596), Jason Dillaman)
- rgw: ‘period update’ does not remove short\_zone\_ids of deleted zones ([issue#15618](http://tracker.ceph.com/issues/15618), [pr#14140](https://github.com/ceph/ceph/pull/14140), Casey Bodley)
- rgw: DUMPABLE flag is cleared by setuid preventing coredumps ([issue#19089](http://tracker.ceph.com/issues/19089), [pr#13844](https://github.com/ceph/ceph/pull/13844), Brad Hubbard)
- rgw: clear data\_sync\_cr if RGWDataSyncControlCR fails ([issue#17569](http://tracker.ceph.com/issues/17569), [pr#13886](https://github.com/ceph/ceph/pull/13886), Casey Bodley)
- rgw: fix openssl ([issue#11239](http://tracker.ceph.com/issues/11239), [issue#19098](http://tracker.ceph.com/issues/19098), [issue#16535](http://tracker.ceph.com/issues/16535), [pr#14215](https://github.com/ceph/ceph/pull/14215), Marcus Watts)
- rgw: fix swift cannot disable object versioning with empty X-Versions-Location ([issue#18852](http://tracker.ceph.com/issues/18852), [pr#13823](https://github.com/ceph/ceph/pull/13823), Jing Wenjun)
- rgw: librgw: RGWLibFS::setattr fails on directories ([issue#18808](http://tracker.ceph.com/issues/18808), [pr#13778](https://github.com/ceph/ceph/pull/13778), Matt Benjamin)
- rgw: make sending Content-Length in 204 and 304 controllable ([issue#16602](http://tracker.ceph.com/issues/16602), [pr#13503](https://github.com/ceph/ceph/pull/13503), Radoslaw Zarzynski, Matt Benjamin)
- rgw: multipart uploads copy part support ([issue#12790](http://tracker.ceph.com/issues/12790), [pr#13219](https://github.com/ceph/ceph/pull/13219), Yehuda Sadeh, Javier M. Mellid, Matt Benjamin)
- rgw: multisite: RGWMetaSyncShardControlCR gives up on EIO ([issue#19019](http://tracker.ceph.com/issues/19019), [pr#13867](https://github.com/ceph/ceph/pull/13867), Casey Bodley)
- rgw: radosgw/swift: clean up flush / newline behavior ([issue#18473](http://tracker.ceph.com/issues/18473), [pr#14100](https://github.com/ceph/ceph/pull/14100), Nathan Cutler, Marcus Watts, Matt Benjamin)
- rgw: radosgw/swift: clean up flush / newline behavior. ([issue#18473](http://tracker.ceph.com/issues/18473), [pr#13143](https://github.com/ceph/ceph/pull/13143), Marcus Watts, Matt Benjamin)
- rgw: rgw\_fh: RGWFileHandle dtor must also cond-unlink from FHCache ([issue#19112](http://tracker.ceph.com/issues/19112), [pr#14231](https://github.com/ceph/ceph/pull/14231), Matt Benjamin)
- rgw: rgw\_file: avoid interning .. in FHCache table and don’t ref for them ([issue#19036](http://tracker.ceph.com/issues/19036), [pr#13848](https://github.com/ceph/ceph/pull/13848), Matt Benjamin)
- rgw: rgw\_file: interned RGWFileHandle objects need parent refs ([issue#18650](http://tracker.ceph.com/issues/18650), [pr#13583](https://github.com/ceph/ceph/pull/13583), Matt Benjamin)
- rgw: rgw\_file: restore (corrected) fix for dir partial match (return of FLAG\_EXACT\_MATCH) ([issue#19060](http://tracker.ceph.com/issues/19060), [issue#18992](http://tracker.ceph.com/issues/18992), [issue#19059](http://tracker.ceph.com/issues/19059), [pr#13858](https://github.com/ceph/ceph/pull/13858), Matt Benjamin)
- rgw: rgw\_file: FHCache residence check should be exhaustive ([issue#19111](http://tracker.ceph.com/issues/19111), [pr#14169](https://github.com/ceph/ceph/pull/14169), Matt Benjamin)
- rgw: rgw\_file: ensure valid\_s3\_object\_name for directories, too ([issue#19066](http://tracker.ceph.com/issues/19066), [pr#13717](https://github.com/ceph/ceph/pull/13717), Matt Benjamin)
- rgw: rgw\_file: fix marker computation ([issue#19018](http://tracker.ceph.com/issues/19018), [issue#18989](http://tracker.ceph.com/issues/18989), [issue#18992](http://tracker.ceph.com/issues/18992), [issue#18991](http://tracker.ceph.com/issues/18991), [pr#13869](https://github.com/ceph/ceph/pull/13869), Matt Benjamin)
- rgw: rgw\_file: wip dir orphan ([issue#18992](http://tracker.ceph.com/issues/18992), [issue#18989](http://tracker.ceph.com/issues/18989), [issue#19018](http://tracker.ceph.com/issues/19018), [issue#18991](http://tracker.ceph.com/issues/18991), [pr#14205](https://github.com/ceph/ceph/pull/14205), Gui Hecheng, Matt Benjamin)
- rgw: rgw\_file: various fixes ([pr#14206](https://github.com/ceph/ceph/pull/14206), Matt Benjamin)
- rgw: rgw\_file: expand argv ([pr#14230](https://github.com/ceph/ceph/pull/14230), Matt Benjamin)
