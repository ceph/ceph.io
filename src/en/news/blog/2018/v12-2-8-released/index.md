---
title: "v12.2.8 released"
date: "2018-09-04"
author: "TheAnalyst"
---

We're glad to announce the next point release in the Luminous v12.2.X stable release series. This release contains a range of bugfixes and stability improvements across all the components of ceph. We thank everyone for contributing towards this release.

## Upgrade notes from previous luminous releases

When upgrading from v12.2.5 or v12.2.6 please note that upgrade caveats from 12.2.5 will apply to any \_newer\_ luminous version including 12.2.8. Please read the [upgrade notes on 12.2.7](https://ceph.com/releases/12-2-7-luminous-released/#upgrading-from-v12-2-6)

For the cluster that installed the broken 12.2.6 release, 12.2.7 fixed the regression and introduced a workaround option \`_osd distrust data digest = true_\`, but 12.2.7 clusters still generated health warnings like ::

\[ERR\] 11.288 shard 207: soid
11:1155c332:::rbd\_data.207dce238e1f29.0000000000000527:head data\_digest 0xc8997a5b != data\_digest 0x2ca15853

 

12.2.8 improves the deep scrub code to automatically repair these inconsistencies. Once the entire cluster has been upgraded and then fully deep scrubbed, and all such inconsistencies are resolved; it will be safe to disable the _\`osd distrust data digest = true\`_ workaround option.

 

## **Changelog**

- bluestore: set correctly shard for existed Collection ([issue#24761](http://tracker.ceph.com/issues/24761), [pr#22860](https://github.com/ceph/ceph/pull/22860), Jianpeng Ma)
- build/ops: Boost system library is no longer required to compile and link example librados program ([issue#25054](http://tracker.ceph.com/issues/25054), [pr#23202](https://github.com/ceph/ceph/pull/23202), Nathan Cutler)
- build/ops: Bring back diff -y for non-FreeBSD ([issue#24396](http://tracker.ceph.com/issues/24396), [issue#21664](http://tracker.ceph.com/issues/21664), [pr#22848](https://github.com/ceph/ceph/pull/22848), Sage Weil, David Zafman)
- build/ops: install-deps.sh fails on newest openSUSE Leap ([issue#25064](http://tracker.ceph.com/issues/25064), [pr#23179](https://github.com/ceph/ceph/pull/23179), Kyr Shatskyy)
- build/ops: Mimic build fails with -DWITH\_RADOSGW=0 ([issue#24437](http://tracker.ceph.com/issues/24437), [pr#22864](https://github.com/ceph/ceph/pull/22864), Dan Mick)
- build/ops: order rbdmap.service before remote-fs-pre.target ([issue#24713](http://tracker.ceph.com/issues/24713), [pr#22844](https://github.com/ceph/ceph/pull/22844), Ilya Dryomov)
- build/ops: rpm: silence osd block chown ([issue#25152](http://tracker.ceph.com/issues/25152), [pr#23313](https://github.com/ceph/ceph/pull/23313), Dan van der Ster)
- cephfs-journal-tool: Fix purging when importing an zero-length journal ([issue#24239](http://tracker.ceph.com/issues/24239), [pr#22980](https://github.com/ceph/ceph/pull/22980), yupeng chen, zhongyan gu)
- cephfs: MDSMonitor: uncommitted state exposed to clients/mdss ([issue#23768](http://tracker.ceph.com/issues/23768), [pr#23013](https://github.com/ceph/ceph/pull/23013), Patrick Donnelly)
- ceph-fuse mount failed because no mds ([issue#22205](http://tracker.ceph.com/issues/22205), [pr#22895](https://github.com/ceph/ceph/pull/22895), liyan)
- ceph-volume add a \_\_release\_\_ string, to help version-conditional calls ([issue#25170](http://tracker.ceph.com/issues/25170), [pr#23331](https://github.com/ceph/ceph/pull/23331), Alfredo Deza)
- ceph-volume: adds test for ceph-volume lvm list /dev/sda ([issue#24784](http://tracker.ceph.com/issues/24784), [issue#24957](http://tracker.ceph.com/issues/24957), [pr#23350](https://github.com/ceph/ceph/pull/23350), Andrew Schoen)
- ceph-volume: do not use stdin in luminous ([issue#25173](http://tracker.ceph.com/issues/25173), [issue#23260](http://tracker.ceph.com/issues/23260), [pr#23367](https://github.com/ceph/ceph/pull/23367), Alfredo Deza)
- ceph-volume enable the ceph-osd during lvm activation ([issue#24152](http://tracker.ceph.com/issues/24152), [pr#23394](https://github.com/ceph/ceph/pull/23394), Dan van der Ster, Alfredo Deza)
- ceph-volume expand on the LVM API to create multiple LVs at different sizes ([issue#24020](http://tracker.ceph.com/issues/24020), [pr#23395](https://github.com/ceph/ceph/pull/23395), Alfredo Deza)
- ceph-volume lvm.activate conditional mon-config on prime-osd-dir ([issue#25216](http://tracker.ceph.com/issues/25216), [pr#23397](https://github.com/ceph/ceph/pull/23397), Alfredo Deza)
- ceph-volume lvm.batch remove non-existent sys\_api property ([issue#34310](http://tracker.ceph.com/issues/34310), [pr#23811](https://github.com/ceph/ceph/pull/23811), Alfredo Deza)
- ceph-volume lvm.listing only include devices if they exist ([issue#24952](http://tracker.ceph.com/issues/24952), [pr#23150](https://github.com/ceph/ceph/pull/23150), Alfredo Deza)
- ceph-volume: process.call with stdin in Python 3 fix ([issue#24993](http://tracker.ceph.com/issues/24993), [pr#23238](https://github.com/ceph/ceph/pull/23238), Alfredo Deza)
- ceph-volume: PVolumes.get() should return one PV when using name or uuid ([issue#24784](http://tracker.ceph.com/issues/24784), [pr#23329](https://github.com/ceph/ceph/pull/23329), Andrew Schoen)
- ceph-volume: refuse to zap mapper devices ([issue#24504](http://tracker.ceph.com/issues/24504), [pr#23374](https://github.com/ceph/ceph/pull/23374), Andrew Schoen)
- ceph-volume: tests.functional inherit SSH\_ARGS from ansible ([issue#34311](http://tracker.ceph.com/issues/34311), [pr#23813](https://github.com/ceph/ceph/pull/23813), Alfredo Deza)
- ceph-volume tests/functional run lvm list after OSD provisioning ([issue#24961](http://tracker.ceph.com/issues/24961), [pr#23147](https://github.com/ceph/ceph/pull/23147), Alfredo Deza)
- ceph-volume: unmount lvs correctly before zapping ([issue#24796](http://tracker.ceph.com/issues/24796), [pr#23128](https://github.com/ceph/ceph/pull/23128), Andrew Schoen)
- ceph-volume: update batch documentation to explain filestore strategies ([issue#34309](http://tracker.ceph.com/issues/34309), [pr#23825](https://github.com/ceph/ceph/pull/23825), Alfredo Deza)
- change default filestore\_merge\_threshold to -10 ([issue#24686](http://tracker.ceph.com/issues/24686), [pr#22814](https://github.com/ceph/ceph/pull/22814), Douglas Fuller)
- client: add inst to asok status output ([issue#24724](http://tracker.ceph.com/issues/24724), [pr#23107](https://github.com/ceph/ceph/pull/23107), Patrick Donnelly)
- client: fixup parallel calls to ceph\_ll\_lookup\_inode() in NFS FASL ([issue#22683](http://tracker.ceph.com/issues/22683), [pr#23012](https://github.com/ceph/ceph/pull/23012), huanwen ren)
- client: increase verbosity level for log messages in helper methods ([issue#21014](http://tracker.ceph.com/issues/21014), [pr#23014](https://github.com/ceph/ceph/pull/23014), Rishabh Dave)
- client: update inode fields according to issued caps ([issue#24269](http://tracker.ceph.com/issues/24269), [pr#22783](https://github.com/ceph/ceph/pull/22783), “Yan, Zheng”)
- common: Abort in OSDMap::decode() during qa/standalone/erasure-code/test-erasure-eio.sh ([issue#23492](http://tracker.ceph.com/issues/23492), [pr#23025](https://github.com/ceph/ceph/pull/23025), Sage Weil)
- common/DecayCounter: set last\_decay to current time when decoding decay counter ([issue#24440](http://tracker.ceph.com/issues/24440), [pr#22779](https://github.com/ceph/ceph/pull/22779), Zhi Zhang)
- doc: ceph-bluestore-tool manpage not getting rendered correctly ([issue#24800](http://tracker.ceph.com/issues/24800), [pr#23177](https://github.com/ceph/ceph/pull/23177), Nathan Cutler)
- filestore: add pgid in filestore pg dir split log message ([issue#24878](http://tracker.ceph.com/issues/24878), [pr#23454](https://github.com/ceph/ceph/pull/23454), Vikhyat Umrao)
- let “ceph status” use base 10 when printing numbers not sizes ([issue#22095](http://tracker.ceph.com/issues/22095), [pr#22680](https://github.com/ceph/ceph/pull/22680), Jan Fajerski, Kefu Chai)
- librados: fix buffer overflow for aio\_exec python binding ([issue#23964](http://tracker.ceph.com/issues/23964), [pr#22708](https://github.com/ceph/ceph/pull/22708), Aleksei Gutikov)
- librbd: force ‘invalid object map’ flag on-disk update ([issue#24434](http://tracker.ceph.com/issues/24434), [pr#22753](https://github.com/ceph/ceph/pull/22753), Mykola Golub)
- librbd: utilize the journal disabled policy when removing images ([issue#23512](http://tracker.ceph.com/issues/23512), [pr#23595](https://github.com/ceph/ceph/pull/23595), Jason Dillaman)
- mds: don’t report slow request for blocked filelock request ([issue#22428](http://tracker.ceph.com/issues/22428), [pr#22782](https://github.com/ceph/ceph/pull/22782), “Yan, Zheng”)
- mds: dump recent events on respawn ([issue#24853](http://tracker.ceph.com/issues/24853), [pr#23213](https://github.com/ceph/ceph/pull/23213), Patrick Donnelly)
- mds: handle discontinuous mdsmap ([issue#24856](http://tracker.ceph.com/issues/24856), [pr#23169](https://github.com/ceph/ceph/pull/23169), “Yan, Zheng”)
- mds: increase debug level for dropped client cap msg ([issue#24855](http://tracker.ceph.com/issues/24855), [pr#23214](https://github.com/ceph/ceph/pull/23214), Patrick Donnelly)
- mds: low wrlock efficiency due to dirfrags traversal ([issue#24467](http://tracker.ceph.com/issues/24467), [pr#22885](https://github.com/ceph/ceph/pull/22885), Xuehan Xu)
- mds: print mdsmap processed at low debug level ([issue#24852](http://tracker.ceph.com/issues/24852), [pr#23212](https://github.com/ceph/ceph/pull/23212), Patrick Donnelly)
- mds: scrub doesn’t always return JSON results ([issue#23958](http://tracker.ceph.com/issues/23958), [pr#23222](https://github.com/ceph/ceph/pull/23222), Venky Shankar)
- mds: unset deleted vars in shutdown\_pass ([issue#23766](http://tracker.ceph.com/issues/23766), [pr#23015](https://github.com/ceph/ceph/pull/23015), Patrick Donnelly)
- mgr: add units to performance counters ([issue#22747](http://tracker.ceph.com/issues/22747), [pr#23266](https://github.com/ceph/ceph/pull/23266), Ernesto Puerta, Rubab Syed)
- mgr: ceph osd safe-to-destroy crashes the mgr ([issue#23249](http://tracker.ceph.com/issues/23249), [pr#22806](https://github.com/ceph/ceph/pull/22806), Sage Weil)
- mgr/MgrClient: Protect daemon\_health\_metrics ([issue#23352](http://tracker.ceph.com/issues/23352), [pr#23459](https://github.com/ceph/ceph/pull/23459), Kjetil Joergensen, Brad Hubbard)
- mon: Add option to view IP addresses of clients in output of ‘ceph features’ ([issue#21315](http://tracker.ceph.com/issues/21315), [pr#22773](https://github.com/ceph/ceph/pull/22773), Paul Emmerich)
- mon/HealthMonitor: do not send MMonHealthChecks to pre-luminous mon ([issue#24481](http://tracker.ceph.com/issues/24481), [pr#22655](https://github.com/ceph/ceph/pull/22655), Sage Weil)
- os/bluestore: fix flush\_commit locking ([issue#21480](http://tracker.ceph.com/issues/21480), [pr#22904](https://github.com/ceph/ceph/pull/22904), Sage Weil)
- os/bluestore: fix incomplete faulty range marking when doing compression ([issue#21480](http://tracker.ceph.com/issues/21480), [pr#22909](https://github.com/ceph/ceph/pull/22909), Igor Fedotov)
- os/bluestore: fix races on SharedBlob::coll in ~SharedBlob ([issue#24859](http://tracker.ceph.com/issues/24859), [pr#23064](https://github.com/ceph/ceph/pull/23064), Radoslaw Zarzynski)
- osdc: Fix the wrong BufferHead offset ([issue#24484](http://tracker.ceph.com/issues/24484), [pr#22865](https://github.com/ceph/ceph/pull/22865), dongdong tao)
- osd: do\_sparse\_read(): Verify checksum earlier so we will try to repair and missed backport ([issue#24875](http://tracker.ceph.com/issues/24875), [pr#23379](https://github.com/ceph/ceph/pull/23379), xie xingguo, David Zafman)
- osd: eternal stuck PG in ‘unfound\_recovery’ ([issue#24373](http://tracker.ceph.com/issues/24373), [pr#22546](https://github.com/ceph/ceph/pull/22546), Sage Weil)
- osd: may get empty info at recovery ([issue#24588](http://tracker.ceph.com/issues/24588), [pr#22862](https://github.com/ceph/ceph/pull/22862), Sage Weil)
- osd/OSDMap: CRUSH\_TUNABLES5 added in jewel, not kraken ([issue#25057](http://tracker.ceph.com/issues/25057), [pr#23227](https://github.com/ceph/ceph/pull/23227), Sage Weil)
- osd/Session: fix invalid iterator dereference in Sessoin::have\_backoff() ([issue#24486](http://tracker.ceph.com/issues/24486), [pr#22729](https://github.com/ceph/ceph/pull/22729), Sage Weil)
- pjd: cd: too many arguments ([issue#24307](http://tracker.ceph.com/issues/24307), [pr#22883](https://github.com/ceph/ceph/pull/22883), Neha Ojha)
- PurgeQueue sometimes ignores Journaler errors ([issue#24533](http://tracker.ceph.com/issues/24533), [pr#22811](https://github.com/ceph/ceph/pull/22811), John Spray)
- pybind: pybind/mgr/mgr\_module: make rados handle available to all modules ([issue#24788](http://tracker.ceph.com/issues/24788), [issue#25102](http://tracker.ceph.com/issues/25102), [pr#23235](https://github.com/ceph/ceph/pull/23235), Ernesto Puerta, Sage Weil)
- pybind: Python bindings use iteritems method which is not Python 3 compatible ([issue#24779](http://tracker.ceph.com/issues/24779), [pr#22918](https://github.com/ceph/ceph/pull/22918), Nathan Cutler, Kefu Chai)
- pybind: rados.pyx: make all exceptions accept keyword arguments ([issue#24033](http://tracker.ceph.com/issues/24033), [pr#22979](https://github.com/ceph/ceph/pull/22979), Rishabh Dave)
- rbd: fix issues in IEC unit handling ([issue#26927](http://tracker.ceph.com/issues/26927), [issue#26928](http://tracker.ceph.com/issues/26928), [pr#23776](https://github.com/ceph/ceph/pull/23776), Jason Dillaman)
- repeated eviction of idle client until some IO happens ([issue#24052](http://tracker.ceph.com/issues/24052), [pr#22780](https://github.com/ceph/ceph/pull/22780), “Yan, Zheng”)
- rgw: add curl\_low\_speed\_limit and curl\_low\_speed\_time config to avoid the thread hangs in data sync ([issue#25019](http://tracker.ceph.com/issues/25019), [pr#23144](https://github.com/ceph/ceph/pull/23144), Mark Kogan, Zhang Shaowen)
- rgw: add unit test for cls bi list command ([issue#24483](http://tracker.ceph.com/issues/24483), [pr#22846](https://github.com/ceph/ceph/pull/22846), Orit Wasserman, Xinying Song)
- rgw: do not ignore EEXIST in RGWPutObj::execute ([issue#22790](http://tracker.ceph.com/issues/22790), [pr#23207](https://github.com/ceph/ceph/pull/23207), Matt Benjamin)
- rgw: fail to recover index from crash luminous backport ([issue#24640](http://tracker.ceph.com/issues/24640), [issue#24280](http://tracker.ceph.com/issues/24280), [pr#23130](https://github.com/ceph/ceph/pull/23130), Tianshan Qu)
- rgw: fix gc may cause a large number of read traffic ([issue#24767](http://tracker.ceph.com/issues/24767), [pr#22984](https://github.com/ceph/ceph/pull/22984), Xin Liao)
- rgw: fix the bug of radowgw-admin zonegroup set requires realm ([issue#21583](http://tracker.ceph.com/issues/21583), [pr#22767](https://github.com/ceph/ceph/pull/22767), lvshanchun)
- rgw: have a configurable authentication order ([issue#23089](http://tracker.ceph.com/issues/23089), [pr#23501](https://github.com/ceph/ceph/pull/23501), Abhishek Lekshmanan)
- rgw: index complete miss zones\_trace set ([issue#24590](http://tracker.ceph.com/issues/24590), [pr#22820](https://github.com/ceph/ceph/pull/22820), Tianshan Qu)
- rgw: Invalid Access-Control-Request-Request may bypass validate\_cors\_rule\_method ([issue#24223](http://tracker.ceph.com/issues/24223), [pr#22934](https://github.com/ceph/ceph/pull/22934), Jeegn Chen)
- rgw: meta and data notify thread miss stop cr manager ([issue#24589](http://tracker.ceph.com/issues/24589), [pr#22822](https://github.com/ceph/ceph/pull/22822), Tianshan Qu)
- rgw-multisite: endless loop in RGWBucketShardIncrementalSyncCR ([issue#24603](http://tracker.ceph.com/issues/24603), [pr#22817](https://github.com/ceph/ceph/pull/22817), cfanz)
- rgw performance regression for luminous 12.2.4 ([issue#23379](http://tracker.ceph.com/issues/23379), [pr#22930](https://github.com/ceph/ceph/pull/22930), Mark Kogan)
- rgw: radogw-admin reshard status command should print text for reshar… ([issue#23257](http://tracker.ceph.com/issues/23257), [pr#23019](https://github.com/ceph/ceph/pull/23019), Orit Wasserman)
- rgw: “radosgw-admin objects expire” always returns ok even if the pro… ([issue#24592](http://tracker.ceph.com/issues/24592), [pr#23000](https://github.com/ceph/ceph/pull/23000), Zhang Shaowen)
- rgw: require –yes-i-really-mean-it to run radosgw-admin orphans find ([issue#24146](http://tracker.ceph.com/issues/24146), [pr#22985](https://github.com/ceph/ceph/pull/22985), Matt Benjamin)
- rgw: REST admin metadata API paging failure bucket & bucket.instance: InvalidArgument ([issue#23099](http://tracker.ceph.com/issues/23099), [pr#22932](https://github.com/ceph/ceph/pull/22932), Matt Benjamin)
- rgw: set cr state if aio\_read err return in RGWCloneMetaLogCoroutine ([issue#24566](http://tracker.ceph.com/issues/24566), [pr#22942](https://github.com/ceph/ceph/pull/22942), Tianshan Qu)
- spdk: fix ceph-osd crash when activate SPDK ([issue#24371](http://tracker.ceph.com/issues/24371), [pr#22686](https://github.com/ceph/ceph/pull/22686), tone-zhang)
- tools/ceph-objectstore-tool: split filestore directories offline to target hash level ([issue#21366](http://tracker.ceph.com/issues/21366), [pr#23418](https://github.com/ceph/ceph/pull/23418), Zhi Zhang)
