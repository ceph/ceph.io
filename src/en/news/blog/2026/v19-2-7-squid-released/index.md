---
title: "v19.2.7 Squid released"
date: "2026-09-10"
author: "Yuri Weinstein"
tags:
  - "release"
  - "squid"
---

This is the seventh backport release in the Squid series.
We recommend all users update to this release.

## Notable Changes

CephFS
------

- Fixed a crash caused by an invalid iterator in `_readdir_cache_cb`.
- Fixed a deadlock in the client when the OSD is full.
- Fixed client I/O stalling due to a buffer list exceeding `INT_MAX`.
- Fixed client cache trimming removing dentries still attached to an open directory inode.
- Fixed `join_fscid` being incorrectly reset for an active MDS during filesystem removal.
- MDS no longer path-traverses a damaged dirfrag.
- Fixed rank 0 being marked damaged if stopping fails after log flush and trim.
- Fixed an incorrect snap check for directories with parent snaps.
- Added a `ceph.dir.subvolume` get vxattr.
- `mgr/snap_schedule` now handles volume deletion correctly.
- Fixed `fs status` JSON output.
- `mgr/vol` now handles a failed non-atomic operation correctly.

RADOS
-----

- Removed `pg_upmap_primary` mappings for PG merge targets.
- Added `pg-upmap-primary` support to `clean_pg_upmaps`.
- Fixed a Neorados `CephContext` leak.
- Fixed a BlueStore onode-cache issue causing stalls.
- Stretch mode: added a max bucket weight diff threshold.
- `mgr` now handles `SIGTERM`/`SIGINT` in standby to avoid a spurious `CEPHADM_FAILED_DAEMON`.

RBD (RADOS Block Device)
------------------------

- Fixed a use-after-free in trash purge on image open error.
- Fixed a use-after-free releasing object map locks during deep copy.
- Fixed memory leaks in PWL cache discard operations.
- Fixed a race between `dispatch_deferred_writes()` and `~AbstractWriteLog()` in the SSD PWL cache.
- `librbd/migration`'s native format now supports specifying `mon_host` and key via the migration spec.
- Fixed strict weak ordering in `rbd-mirror`'s `PeerSpec::operator<`.
- `rbd-mirror` now prunes obsolete primary mirror snapshots after relocation.
- Fixed `mgr/rbd_support` perf iostat pool-spec filtering by data pool.

RGW (RADOS Gateway)
-------------------

- Fixed conditional Delete, MultiDelete, and Put handling.
- `x-amz-content-sha256` is no longer required in signed headers when verifying client auth.
- The AWS v4 signer now always includes the `x-amz-content-sha256` header when signing.
- `rgw_gc_max_objs` is now startup-only.
- Added a warning against changing `rgw_lc_max_objs` once lifecycle is in use.
- `x-amz-expiration` is now reported only for the current object version.
- Multisite: bucket `obj_lock` settings are now synced.
- Fixed a race between bucket reshard and bucket index update.
- Fixed a crash on realm reload.
- Fixed a frontend crash in `abort_early()` on client disconnect.
- Fixed the lifecycle transition of encrypted multipart objects.
- Content-Type is no longer always required to be present in the signature.
- Fixed a shutdown hang caused by a race between the async processor and multisite sync threads.
- Fixed cloud-tier multipart resume starting at part number 0.
- `complete-multipart` now returns an ETag header on success.
- Fixed a crash when an admin tries to assume a nonexistent role.

ceph-volume
-----------

- Fixed raw activation when the device path is stale.
- Fixed OSD re-deployment issues with disk selection filters and DB devices.
- Detects rotational media under dm-crypt for workqueue bypass.
- Includes LVM mapper devices in `get_devices()`.
- Retries `lvs` after an empty result or a "devices file is missing" error.
- Skips virtual CD-ROM devices during inventory.

Dashboard
---------

- Fixed a pool profile issue.

## Changelog

- add missing <span></span>.qa link ([pr#70714](https://github.com/ceph/ceph/pull/70714), Patrick Donnelly)

- ceph-objectstore-tool: update `clear-snapset` command doc ([pr#71054](https://github.com/ceph/ceph/pull/71054), Ronen Friedman, Naveen Naidu)

- ceph-volume: detect rotational media under dm-crypt for workqueue bypass ([pr#69229](https://github.com/ceph/ceph/pull/69229), Guillaume Abrioux)

- ceph-volume: fix raw activate when device path is stale ([pr#69411](https://github.com/ceph/ceph/pull/69411), Guillaume Abrioux)

- ceph-volume: fix re-deployment of OSD issues with disk selection filters and DB Devices ([pr#69092](https://github.com/ceph/ceph/pull/69092), Raimund Sacherer)

- ceph-volume: include LVM mapper devices in get\_devices() ([pr#67990](https://github.com/ceph/ceph/pull/67990), Guillaume Abrioux)

- ceph-volume: retry lvs after empty result and "devices file is missing" stderr ([pr#69207](https://github.com/ceph/ceph/pull/69207), Guillaume Abrioux)

- ceph-volume: skip virtual cdrom devices in inventory ([pr#68588](https://github.com/ceph/ceph/pull/68588), Ujjawal Anand)

- client: crash caused by invalid iterator in \_readdir\_cache\_cb ([pr#65974](https://github.com/ceph/ceph/pull/65974), Zhansong Gao)

- client: Fix a deadlock when osd is full ([pr#65821](https://github.com/ceph/ceph/pull/65821), Kotresh HR)

- client: fix async/sync I/O stalling due to buffer list exceeding INT\_MAX ([pr#65287](https://github.com/ceph/ceph/pull/65287), Dhairya Parmar)

- client: fix dump\_mds\_requests to valid json format ([issue#73639](http://tracker.ceph.com/issues/73639), [pr#66157](https://github.com/ceph/ceph/pull/66157), haoyixing)

- common/Formatter: dump inf/nan as null ([pr#60063](https://github.com/ceph/ceph/pull/60063), Md Mahamudur Rahaman Sajib)

- common/options: mark client\_force\_lazyio as not runtime updatable ([pr#71281](https://github.com/ceph/ceph/pull/71281), Xiubo Li)

- Containerfile backports ([pr#69582](https://github.com/ceph/ceph/pull/69582), John Mulligan, David Galloway)

- doc/cephfs: Remove spaces from command ([pr#68296](https://github.com/ceph/ceph/pull/68296), Zac Dover)

- doc/man: document ceph-bluestore-tool set-label-key and rm-label-key ([pr#71244](https://github.com/ceph/ceph/pull/71244), Akshay Nazare)

- doc/rados/configuration: recommend wpq for EC clusters seeing slow ops ([pr#68945](https://github.com/ceph/ceph/pull/68945), Matthew N. Heler)

- doc/rados/operations: add kernel client procedure to read balancer documentation ([pr#65439](https://github.com/ceph/ceph/pull/65439), Laura Flores)

- doc/rados: cephx upgrade OSD key rotation step to update osd\_key bluestore label ([pr#71228](https://github.com/ceph/ceph/pull/71228), Adam King)

- doc/rbd: clarify mirror resync snapshot behavior ([pr#70082](https://github.com/ceph/ceph/pull/70082), Miki Patel)

- doc: correct inverted logic for health warning check ([pr#71230](https://github.com/ceph/ceph/pull/71230), Patrick Donnelly)

- fix make check / API / cli / qa breakage from the cephx (CVE-2025-30156) merge ([pr#71190](https://github.com/ceph/ceph/pull/71190), David Galloway)

- Integrate s3tests into Ceph repository ([pr#70632](https://github.com/ceph/ceph/pull/70632), Adam C. Emerson)

- journal/ObjectPlayer: don't acquire locks in destructor ([pr#70014](https://github.com/ceph/ceph/pull/70014), Kefu Chai)

- libcephfs client cache trimming might remove dentries attached to opened dir inode ([pr#62281](https://github.com/ceph/ceph/pull/62281), Kefu Chai, Dhairya Parmar, Igor Fedotov)

- libcephfs: convert ceph errno to host-based errno ([pr#65827](https://github.com/ceph/ceph/pull/65827), Rishabh Dave)

- libcephsqlite: ensure atexit handlers are registered after openssl ([pr#68264](https://github.com/ceph/ceph/pull/68264), Patrick Donnelly)

- librbd/cache/pwl/ssd: avoid dispatch\_deferred\_writes() vs ~AbstractWriteLog() race ([pr#71283](https://github.com/ceph/ceph/pull/71283), Ilya Dryomov)

- librbd/cache/pwl: cancel periodic\_stats timer before perf\_stop() ([pr#70424](https://github.com/ceph/ceph/pull/70424), Sun Yuechi)

- librbd/migration/NativeFormat: support specifying mon\_host and key via spec ([pr#70284](https://github.com/ceph/ceph/pull/70284), Ilya Dryomov, Leonid Chernin)

- librbd/pwl: fix memory leaks in discard operations ([pr#71273](https://github.com/ceph/ceph/pull/71273), Kefu Chai)

- librbd: fix use-after-free in trash purge on image open error ([pr#70427](https://github.com/ceph/ceph/pull/70427), Sun Yuechi)

- librbd: fix use-after-free releasing object map locks in deep copy ([pr#70012](https://github.com/ceph/ceph/pull/70012), Kefu Chai)

- mds/FSMap: fix join\_fscid being incorrectly reset for active MDS during filesystem removal ([pr#65822](https://github.com/ceph/ceph/pull/65822), ethanwu)

- mds: add ceph<span></span>.dir<span></span>.subvolume get vxattr ([pr#65820](https://github.com/ceph/ceph/pull/65820), Edwin Rodriguez)

- mds: do not path traverse a damaged dirfrag ([pr#61855](https://github.com/ceph/ceph/pull/61855), Patrick Donnelly)

- mds: fix rank 0 marked damaged if stopping fails after Elid flush and log trimmed ([pr#65823](https://github.com/ceph/ceph/pull/65823), ethanwu)

- mds: log meaningful error message when entering damaged state ([pr#63790](https://github.com/ceph/ceph/pull/63790), Mykola Golub)

- mds: persist session auth\_name in ESession journal event ([pr#69261](https://github.com/ceph/ceph/pull/69261), Dhairya Parmar)

- mds: wrong snap check for directory with parent snaps ([pr#65824](https://github.com/ceph/ceph/pull/65824), Patrick Donnelly)

- mgr, osd, mon: remove pg\_upmap\_primary mappings for PG merge targets ([pr#71051](https://github.com/ceph/ceph/pull/71051), Laura Flores)

- mgr/cephadm: renames ceph\_device to ceph\_device\_lvm ([pr#68752](https://github.com/ceph/ceph/pull/68752), Robert Sander)

- mgr/DaemonServer: auto-tune stats period when message queue gets backed up ([pr#69016](https://github.com/ceph/ceph/pull/69016), Nitzan Mordechai)

- mgr/DaemonServer: erase daemon\_connections ref on reset for all peer types ([pr#71035](https://github.com/ceph/ceph/pull/71035), Sunnatillo)

- mgr/dashboard : fix pool profile issue ([pr#68855](https://github.com/ceph/ceph/pull/68855), Abhishek Desai)

- mgr/rbd\_support: fix perf iostat pool-spec to filter by data pool ([pr#71298](https://github.com/ceph/ceph/pull/71298), Dongdong Tao)

- mgr/snap\_schedule: handle volume delete ([pr#65800](https://github.com/ceph/ceph/pull/65800), Milind Changire)

- mgr/status: Fix 'fs status' json output ([pr#60187](https://github.com/ceph/ceph/pull/60187), Kotresh HR)

- mgr/vol: handling the failed non-atomic operation ([pr#65799](https://github.com/ceph/ceph/pull/65799), Neeraj Pratap Singh)

- mgr: fix PyObject\* refcounting in TTLCache and cleanup logic ([pr#66483](https://github.com/ceph/ceph/pull/66483), Nitzan Mordechai)

- mgr: handle SIGTERM/SIGINT in standby mgr to avoid CEPHADM\_FAILED\_DAEMON ([pr#69782](https://github.com/ceph/ceph/pull/69782), Nitzan Mordechai)

- mon [stretch-mode]: Allow a max bucket weight diff threshold ([pr#67789](https://github.com/ceph/ceph/pull/67789), Kamoltat Sirivadhna, Kamoltat (Junior) Sirivadhna)

- mon/MonClient: check stopping for auth request handling ([pr#68509](https://github.com/ceph/ceph/pull/68509), Patrick Donnelly)

- mon: fix ConnectionTracker::notify\_rank\_removed ([pr#69721](https://github.com/ceph/ceph/pull/69721), Kamoltat (Junior) Sirivadhna)

- mr/dashboard: remove rgw\_servers filter from radosgw-sync-overview grafana dashboard ([pr#68605](https://github.com/ceph/ceph/pull/68605), Aashish Sharma)

- neorados: Fix Neorados CephContext leak and prevent future ones ([pr#69686](https://github.com/ceph/ceph/pull/69686), Adam C. Emerson, Casey Bodley)

- os/bluestore: Fix problem with onode cache causing stalls ([pr#70491](https://github.com/ceph/ceph/pull/70491), Adam Kupczyk)

- osd/scrub: take jobs\_lock when updating a scrub job schedule ([pr#70762](https://github.com/ceph/ceph/pull/70762), gmallet)

- osd: add pg-upmap-primary to clean\_pg\_upmaps ([pr#67408](https://github.com/ceph/ceph/pull/67408), Laura Flores)

- osdc: deliver neorados completions to associated executor ([pr#69744](https://github.com/ceph/ceph/pull/69744), Radoslaw Zarzynski, Casey Bodley)

- pybind/rbd: reset element count on iterator errors ([pr#71280](https://github.com/ceph/ceph/pull/71280), Ramana Raja)

- python-common: multi-line for yaml ([pr#68580](https://github.com/ceph/ceph/pull/68580), Timothy Q Nguyen)

- qa/multisite: fix test\_bucket\_remove false failure on bucket deletion check ([pr#70405](https://github.com/ceph/ceph/pull/70405), Shilpa Jagannath, Adam C. Emerson)

- qa/suite/rados/encoder: update release N-2 for ceph-dencoder tests ([pr#67178](https://github.com/ceph/ceph/pull/67178), Nitzan Mordechai)

- qa/suites/upgrade: ignore fs down variant ([pr#70404](https://github.com/ceph/ceph/pull/70404), Patrick Donnelly)

- qa/suites/upgrade: ignore osd in unknown state ([pr#69308](https://github.com/ceph/ceph/pull/69308), Patrick Donnelly)

- qa/tasks/cephadm: override container image tags ([pr#67491](https://github.com/ceph/ceph/pull/67491), Kyr Shatskyy)

- qa/tasks/quiescer: remove racy assertion ([pr#68516](https://github.com/ceph/ceph/pull/68516), Patrick Donnelly)

- qa/tests: Add client-upgrade-squid-umbrella test ([pr#69887](https://github.com/ceph/ceph/pull/69887), Yuri Weinstein)

- qa/tests: fix POOL\_FULL ignorelist pattern in upgrade tests ([pr#70509](https://github.com/ceph/ceph/pull/70509), Yuri Weinstein)

- qa: Add async io test to nfs ganesha using fio ([pr#65825](https://github.com/ceph/ceph/pull/65825), Dhairya Parmar, Kotresh HR)

- qa: fix misleading "in cluster log" failures during cluster log scan ([pr#68448](https://github.com/ceph/ceph/pull/68448), Redouane Kachach)

- qa: fix TypeError in delay ([pr#67618](https://github.com/ceph/ceph/pull/67618), Jos Collin)

- qa: Handle TypeError in test\_filelock ([pr#69107](https://github.com/ceph/ceph/pull/69107), Karthik U S)

- qa: ignore POOL\_FULL for rbd tests exercising full pools ([pr#69305](https://github.com/ceph/ceph/pull/69305), Patrick Donnelly)

- rbd-mirror: fix strict weak ordering in PeerSpec::operator< ([pr#71276](https://github.com/ceph/ceph/pull/71276), Sun Yuechi)

- rbd-mirror: prune obsolete primary mirror snapshots after relocation ([pr#69767](https://github.com/ceph/ceph/pull/69767), Miki Patel, Prasanna Kumar Kalever)

- rbd-mirror: return after finishing on unsupported mirror mode ([pr#71279](https://github.com/ceph/ceph/pull/71279), Sun Yuechi)

- rbd-mirror: take MirrorStatusUpdater lock by value in queue\_update\_task ([pr#71278](https://github.com/ceph/ceph/pull/71278), Sun Yuechi)

- remove github workflows ([pr#70720](https://github.com/ceph/ceph/pull/70720), Patrick Donnelly)

- RGW | fix conditional Delete, MultiDelete and Put ([pr#65932](https://github.com/ceph/ceph/pull/65932), Adam C. Emerson, Ali Masarwa, Casey Bodley)

- rgw/auth: don't require x-amz-content-sha256 in signed headers ([pr#71360](https://github.com/ceph/ceph/pull/71360), Casey Bodley, Adam C. Emerson)

- rgw/gc: mark rgw\_gc\_max\_objs as startup-only ([pr#68994](https://github.com/ceph/ceph/pull/68994), Matthew N. Heler)

- rgw/http: use a dedicated mutex for reqs\_change\_state ([pr#69936](https://github.com/ceph/ceph/pull/69936), Matthew N. Heler)

- rgw/lc: report x-amz-expiration only for the current version ([pr#70493](https://github.com/ceph/ceph/pull/70493), Lumir Sliva)

- rgw/lc: Warn against changing rgw\_lc\_max\_objs once lifecycle is in use ([pr#69788](https://github.com/ceph/ceph/pull/69788), Matthew N. Heler)

- rgw/multisite: sync bucket obj\_lock ([pr#70501](https://github.com/ceph/ceph/pull/70501), Shilpa Jagannath)

- rgw/reshard: bucket reshard may race with bucket index update ([pr#70498](https://github.com/ceph/ceph/pull/70498), Shilpa Jagannath)

- rgw/s3: Always include x-amz-content-sha256 header in AWS v4 signatures ([pr#69003](https://github.com/ceph/ceph/pull/69003), Shilpa Jagannath, Matthew N. Heler)

- rgw: copy\_obj\_data() record uncompressed size for a compressed source ([pr#70242](https://github.com/ceph/ceph/pull/70242), Oguzhan Ozmen)

- rgw: fix cloud tier multipart resume starting at part number 0 ([pr#68995](https://github.com/ceph/ceph/pull/68995), Matthew N. Heler)

- rgw: Fix crashes on realm reload ([pr#70295](https://github.com/ceph/ceph/pull/70295), Lumir Sliva, Adam C. Emerson, Oguzhan Ozmen)

- rgw: fix frontend crash in abort\_early() on client disconnect ([pr#68983](https://github.com/ceph/ceph/pull/68983), Shilpa Jagannath)

- rgw: fix lifecycle transition of encrypted multipart objects ([pr#68807](https://github.com/ceph/ceph/pull/68807), Marcus Watts)

- rgw: Fixed Content-Type always needing to be in the signature ([pr#71296](https://github.com/ceph/ceph/pull/71296), Elliot Courant, Adam C. Emerson)

- RGW: prevent shutdown hang by reconciling race between async processor and multisite sync threads ([pr#67439](https://github.com/ceph/ceph/pull/67439), Oguzhan Ozmen)

- rgw: return an etag header for all successful complete-multipart ([pr#70067](https://github.com/ceph/ceph/pull/70067), Matt Benjamin)

- rgw: RGWSI\_Notify drains the finisher before deleting RGWWatchers ([pr#66523](https://github.com/ceph/ceph/pull/66523), Casey Bodley)

- rgw: stop crashing when an admin tries to assume a nonexistent role ([pr#69002](https://github.com/ceph/ceph/pull/69002), Matthew N. Heler)

- rgw: use local error code in handle\_individual\_object() ([pr#69739](https://github.com/ceph/ceph/pull/69739), Casey Bodley)

- src/ceph-volume: fast device unavailable as error ([pr#67917](https://github.com/ceph/ceph/pull/67917), Timothy Q Nguyen)

- test/kafka: support archived kafka versions ([pr#70401](https://github.com/ceph/ceph/pull/70401), Yuval Lifshitz, Adam C. Emerson)

- test/mds: fix flaky RepeatedQuiesceAwait ([pr#69035](https://github.com/ceph/ceph/pull/69035), Kefu Chai)

- tools/ceph-kvstore-tool: fix crash on db close ([pr#68405](https://github.com/ceph/ceph/pull/68405), Igor Fedotov, Max Kellermann)

- tools/immutable\_object\_cache: don't leak in-flight replies on teardown ([pr#71275](https://github.com/ceph/ceph/pull/71275), Sun Yuechi)

- win32\_deps\_bild: bump openssl version ([pr#71203](https://github.com/ceph/ceph/pull/71203), Lucian Petrut)
