---
title: "v0.80.10 Firefly released"
date: "2015-07-21"
author: "sage"
---

This is a bugfix release for Firefly.

We recommend that all Firefly users upgrade.

For more detailed information, see the complete changelog.

### NOTABLE CHANGES

- build/ops: ceph.spec.in: package mkcephfs on EL6 ([issue#11955](http://tracker.ceph.com/issues/11955), [pr#4924](http://github.com/ceph/ceph/pull/4924), Ken Dreyer)
- build/ops: debian: ceph-test and rest-bench debug packages should require their respective binary packages ([issue#11673](http://tracker.ceph.com/issues/11673), [pr#4766](http://github.com/ceph/ceph/pull/4766), Ken Dreyer)
- build/ops: run RGW as root ([issue#11453](http://tracker.ceph.com/issues/11453), [pr#4638](http://github.com/ceph/ceph/pull/4638), Ken Dreyer)
- common: messages/MWatchNotify: include an error code in the message ([issue#9193](http://tracker.ceph.com/issues/9193), [pr#3944](http://github.com/ceph/ceph/pull/3944), Sage Weil)
- common: Rados.shutdown() dies with Illegal instruction (core dumped) ([issue#10153](http://tracker.ceph.com/issues/10153), [pr#3963](http://github.com/ceph/ceph/pull/3963), Federico Simoncelli)
- common: SimpleMessenger: allow RESETSESSION whenever we forget an endpoint ([issue#10080](http://tracker.ceph.com/issues/10080), [pr#3915](http://github.com/ceph/ceph/pull/3915), Greg Farnum)
- common: WorkQueue: make wait timeout on empty queue configurable ([issue#10817](http://tracker.ceph.com/issues/10817), [pr#3941](http://github.com/ceph/ceph/pull/3941), Samuel Just)
- crush: set\_choose\_tries = 100 for erasure code rulesets ([issue#10353](http://tracker.ceph.com/issues/10353), [pr#3824](http://github.com/ceph/ceph/pull/3824), Loic Dachary)
- doc: backport ceph-disk man page to Firefly ([issue#10724](http://tracker.ceph.com/issues/10724), [pr#3936](http://github.com/ceph/ceph/pull/3936), Nilamdyuti Goswami)
- doc: Fix ceph command manpage to match ceph -h ([issue#10676](http://tracker.ceph.com/issues/10676), [pr#3996](http://github.com/ceph/ceph/pull/3996), David Zafman)
- fs: mount.ceph: avoid spurious error message ([issue#10351](http://tracker.ceph.com/issues/10351), [pr#3927](http://github.com/ceph/ceph/pull/3927), Yan, Zheng)
- librados: Fix memory leak in python rados bindings ([issue#10723](http://tracker.ceph.com/issues/10723), [pr#3935](http://github.com/ceph/ceph/pull/3935), Josh Durgin)
- librados: fix resources leakage in RadosClient::connect() ([issue#10425](http://tracker.ceph.com/issues/10425), [pr#3828](http://github.com/ceph/ceph/pull/3828), Radoslaw Zarzynski)
- librados: Translate operation flags from C APIs ([issue#10497](http://tracker.ceph.com/issues/10497), [pr#3930](http://github.com/ceph/ceph/pull/3930), Matt Richards)
- librbd: acquire cache\_lock before refreshing parent ([issue#5488](http://tracker.ceph.com/issues/5488), [pr#4206](http://github.com/ceph/ceph/pull/4206), Jason Dillaman)
- librbd: snap\_remove should ignore -ENOENT errors ([issue#11113](http://tracker.ceph.com/issues/11113), [pr#4245](http://github.com/ceph/ceph/pull/4245), Jason Dillaman)
- mds: fix assertion caused by system clock backwards ([issue#11053](http://tracker.ceph.com/issues/11053), [pr#3970](http://github.com/ceph/ceph/pull/3970), Yan, Zheng)
- mon: ignore osd failures from before up\_from ([issue#10762](http://tracker.ceph.com/issues/10762), [pr#3937](http://github.com/ceph/ceph/pull/3937), Sage Weil)
- mon: MonCap: take EntityName instead when expanding profiles ([issue#10844](http://tracker.ceph.com/issues/10844), [pr#3942](http://github.com/ceph/ceph/pull/3942), Joao Eduardo Luis)
- mon: Monitor: fix timecheck rounds period ([issue#10546](http://tracker.ceph.com/issues/10546), [pr#3932](http://github.com/ceph/ceph/pull/3932), Joao Eduardo Luis)
- mon: OSDMonitor: do not trust small values in osd epoch cache ([issue#10787](http://tracker.ceph.com/issues/10787), [pr#3823](http://github.com/ceph/ceph/pull/3823), Sage Weil)
- mon: OSDMonitor: fallback to json-pretty in case of invalid formatter ([issue#9538](http://tracker.ceph.com/issues/9538), [pr#4475](http://github.com/ceph/ceph/pull/4475), Loic Dachary)
- mon: PGMonitor: several stats output error fixes ([issue#10257](http://tracker.ceph.com/issues/10257), [pr#3826](http://github.com/ceph/ceph/pull/3826), Joao Eduardo Luis)
- objecter: fix map skipping ([issue#9986](http://tracker.ceph.com/issues/9986), [pr#3952](http://github.com/ceph/ceph/pull/3952), Ding Dinghua)
- osd: cache tiering: fix the atime logic of the eviction ([issue#9915](http://tracker.ceph.com/issues/9915), [pr#3949](http://github.com/ceph/ceph/pull/3949), Zhiqiang Wang)
- osd: cancel\_pull: requeue waiters ([issue#11244](http://tracker.ceph.com/issues/11244), [pr#4415](http://github.com/ceph/ceph/pull/4415), Samuel Just)
- osd: check that source OSD is valid for MOSDRepScrub ([issue#9555](http://tracker.ceph.com/issues/9555), [pr#3947](http://github.com/ceph/ceph/pull/3947), Sage Weil)
- osd: DBObjectMap: lock header\_lock on sync() ([issue#9891](http://tracker.ceph.com/issues/9891), [pr#3948](http://github.com/ceph/ceph/pull/3948), Samuel Just)
- osd: do not ignore deleted pgs on startup ([issue#10617](http://tracker.ceph.com/issues/10617), [pr#3933](http://github.com/ceph/ceph/pull/3933), Sage Weil)
- osd: ENOENT on clone ([issue#11199](http://tracker.ceph.com/issues/11199), [pr#4385](http://github.com/ceph/ceph/pull/4385), Samuel Just)
- osd: erasure-code-profile set races with erasure-code-profile rm ([issue#11144](http://tracker.ceph.com/issues/11144), [pr#4383](http://github.com/ceph/ceph/pull/4383), Loic Dachary)
- osd: FAILED assert(soid < scrubber.start || soid >= scrubber.end) ([issue#11156](http://tracker.ceph.com/issues/11156), [pr#4185](http://github.com/ceph/ceph/pull/4185), Samuel Just)
- osd: FileJournal: fix journalq population in do\_read\_entry() ([issue#6003](http://tracker.ceph.com/issues/6003), [pr#3960](http://github.com/ceph/ceph/pull/3960), Samuel Just)
- osd: fix negative degraded objects during backfilling ([issue#7737](http://tracker.ceph.com/issues/7737), [pr#4021](http://github.com/ceph/ceph/pull/4021), Guang Yang)
- osd: get the currently atime of the object in cache pool for eviction ([issue#9985](http://tracker.ceph.com/issues/9985), [pr#3950](http://github.com/ceph/ceph/pull/3950), Sage Weil)
- osd: load\_pgs: we need to handle the case where an upgrade from earlier versions which ignored non-existent pgs resurrects a pg with a prehistoric osdmap ([issue#11429](http://tracker.ceph.com/issues/11429), [pr#4556](http://github.com/ceph/ceph/pull/4556), Samuel Just)
- osd: ObjectStore: Don’t use largest\_data\_off to calc data\_align. ([issue#10014](http://tracker.ceph.com/issues/10014), [pr#3954](http://github.com/ceph/ceph/pull/3954), Jianpeng Ma)
- osd: osd\_types: op\_queue\_age\_hist and fs\_perf\_stat should be in osd\_stat\_t::o... ([issue#10259](http://tracker.ceph.com/issues/10259), [pr#3827](http://github.com/ceph/ceph/pull/3827), Samuel Just)
- osd: PG::actingset should be used when checking the number of acting OSDs for... ([issue#11454](http://tracker.ceph.com/issues/11454), [pr#4453](http://github.com/ceph/ceph/pull/4453), Guang Yang)
- osd: PG::all\_unfound\_are\_queried\_or\_lost for non-existent osds ([issue#10976](http://tracker.ceph.com/issues/10976), [pr#4416](http://github.com/ceph/ceph/pull/4416), Mykola Golub)
- osd: PG: always clear\_primary\_state ([issue#10059](http://tracker.ceph.com/issues/10059), [pr#3955](http://github.com/ceph/ceph/pull/3955), Samuel Just)
- osd: PGLog.h: 279: FAILED assert(log.log.size() == log\_keys\_debug.size()) ([issue#10718](http://tracker.ceph.com/issues/10718), [pr#4382](http://github.com/ceph/ceph/pull/4382), Samuel Just)
- osd: PGLog: include rollback\_info\_trimmed\_to in (read|write)\_log ([issue#10157](http://tracker.ceph.com/issues/10157), [pr#3964](http://github.com/ceph/ceph/pull/3964), Samuel Just)
- osd: pg stuck stale after create with activation delay ([issue#11197](http://tracker.ceph.com/issues/11197), [pr#4384](http://github.com/ceph/ceph/pull/4384), Samuel Just)
- osd: ReplicatedPG: fail a non-blocking flush if the object is being scrubbed ([issue#8011](http://tracker.ceph.com/issues/8011), [pr#3943](http://github.com/ceph/ceph/pull/3943), Samuel Just)
- osd: ReplicatedPG::on\_change: clean up callbacks\_for\_degraded\_object ([issue#8753](http://tracker.ceph.com/issues/8753), [pr#3940](http://github.com/ceph/ceph/pull/3940), Samuel Just)
- osd: ReplicatedPG::scan\_range: an object can disappear between the list and t... ([issue#10150](http://tracker.ceph.com/issues/10150), [pr#3962](http://github.com/ceph/ceph/pull/3962), Samuel Just)
- osd: requeue blocked op before flush it was blocked on ([issue#10512](http://tracker.ceph.com/issues/10512), [pr#3931](http://github.com/ceph/ceph/pull/3931), Sage Weil)
- rgw: check for timestamp for s3 keystone auth ([issue#10062](http://tracker.ceph.com/issues/10062), [pr#3958](http://github.com/ceph/ceph/pull/3958), Abhishek Lekshmanan)
- rgw: civetweb should use unique request id ([issue#11720](http://tracker.ceph.com/issues/11720), [pr#4780](http://github.com/ceph/ceph/pull/4780), Orit Wasserman)
- rgw: don’t allow negative / invalid content length ([issue#11890](http://tracker.ceph.com/issues/11890), [pr#4829](http://github.com/ceph/ceph/pull/4829), Yehuda Sadeh)
- rgw: fail s3 POST auth if keystone not configured ([issue#10698](http://tracker.ceph.com/issues/10698), [pr#3966](http://github.com/ceph/ceph/pull/3966), Yehuda Sadeh)
- rgw: flush xml header on get acl request ([issue#10106](http://tracker.ceph.com/issues/10106), [pr#3961](http://github.com/ceph/ceph/pull/3961), Yehuda Sadeh)
- rgw: generate new tag for object when setting object attrs ([issue#11256](http://tracker.ceph.com/issues/11256), [pr#4571](http://github.com/ceph/ceph/pull/4571), Yehuda Sadeh)
- rgw: generate the “Date” HTTP header for civetweb. ([issue#11871,11891](http://tracker.ceph.com/issues/11871,11891), [pr#4851](http://github.com/ceph/ceph/pull/4851), Radoslaw Zarzynski)
- rgw: keystone token cache does not work correctly ([issue#11125](http://tracker.ceph.com/issues/11125), [pr#4414](http://github.com/ceph/ceph/pull/4414), Yehuda Sadeh)
- rgw: merge manifests correctly when there’s prefix override ([issue#11622](http://tracker.ceph.com/issues/11622), [pr#4697](http://github.com/ceph/ceph/pull/4697), Yehuda Sadeh)
- rgw: send appropriate op to cancel bucket index pending operation ([issue#10770](http://tracker.ceph.com/issues/10770), [pr#3938](http://github.com/ceph/ceph/pull/3938), Yehuda Sadeh)
- rgw: shouldn’t need to disable rgw\_socket\_path if frontend is configured ([issue#11160](http://tracker.ceph.com/issues/11160), [pr#4275](http://github.com/ceph/ceph/pull/4275), Yehuda Sadeh)
- rgw: Swift API. Dump container’s custom metadata. ([issue#10665](http://tracker.ceph.com/issues/10665), [pr#3934](http://github.com/ceph/ceph/pull/3934), Dmytro Iurchenko)
- rgw: Swift API. Support for X-Remove-Container-Meta-{key} header. ([issue#10475](http://tracker.ceph.com/issues/10475), [pr#3929](http://github.com/ceph/ceph/pull/3929), Dmytro Iurchenko)
- rgw: use correct objv\_tracker for bucket instance ([issue#11416](http://tracker.ceph.com/issues/11416), [pr#4379](http://github.com/ceph/ceph/pull/4379), Yehuda Sadeh)
- tests: force checkout of submodules ([issue#11157](http://tracker.ceph.com/issues/11157), [pr#4079](http://github.com/ceph/ceph/pull/4079), Loic Dachary)
- tools: Backport ceph-objectstore-tool changes to firefly ([issue#12327](http://tracker.ceph.com/issues/12327), [pr#3866](http://github.com/ceph/ceph/pull/3866), David Zafman)
- tools: ceph-objectstore-tool: Output only unsupported features when incomatible ([issue#11176](http://tracker.ceph.com/issues/11176), [pr#4126](http://github.com/ceph/ceph/pull/4126), David Zafman)
- tools: ceph-objectstore-tool: Use exit status 11 for incompatible import attemp... ([issue#11139](http://tracker.ceph.com/issues/11139), [pr#4129](http://github.com/ceph/ceph/pull/4129), David Zafman)
- tools: Fix do\_autogen.sh so that -L is allowed ([issue#11303](http://tracker.ceph.com/issues/11303), [pr#4247](http://github.com/ceph/ceph/pull/4247), Alfredo Deza)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.80.10.tar.gz](http://ceph.com/download/ceph-0.80.10.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
