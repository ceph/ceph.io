---
title: "v0.94.7 Hammer released"
date: "2016-05-13"
author: "sage"
---

This Hammer point release fixes several minor bugs. It also includes a backport of an improved ‘ceph osd reweight-by-utilization’ command for handling OSDs with higher-than-average utilizations.

We recommend that all hammer v0.94.x users upgrade.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.94.6.txt).

### NOTABLE CHANGES

- auth: keyring permisions for mon deamon ([issue#14950](http://tracker.ceph.com/issues/14950), [pr#8049](http://github.com/ceph/ceph/pull/8049), Owen Synge)
- auth: PK11\_DestroyContext() is called twice if PK11\_DigestFinal() fails ([issue#14958](http://tracker.ceph.com/issues/14958), [pr#7922](http://github.com/ceph/ceph/pull/7922), Brad Hubbard, Dunrong Huang)
- auth: use libnss more safely ([issue#14620](http://tracker.ceph.com/issues/14620), [pr#7488](http://github.com/ceph/ceph/pull/7488), Sage Weil)
- ceph-disk: use blkid instead of sgdisk -i ([issue#14080](http://tracker.ceph.com/issues/14080), [issue#14094](http://tracker.ceph.com/issues/14094), [pr#7475](http://github.com/ceph/ceph/pull/7475), Ilya Dryomov, Loic Dachary)
- ceph-fuse: fix ceph-fuse writing to stale log file after log rotation ([issue#12350](http://tracker.ceph.com/issues/12350), [pr#7110](http://github.com/ceph/ceph/pull/7110), Zhi Zhang)
- ceph init script unconditionally sources /lib/lsb/init-functions ([issue#14402](http://tracker.ceph.com/issues/14402), [pr#7797](http://github.com/ceph/ceph/pull/7797), Yan, Zheng)
- ceph.in: Notify user that ‘tell’ can’t be used in interactive mode ([issue#14773](http://tracker.ceph.com/issues/14773), [pr#7656](http://github.com/ceph/ceph/pull/7656), David Zafman)
- ceph-objectstore-tool, osd: Fix import handling ([issue#10794](http://tracker.ceph.com/issues/10794), [issue#13382](http://tracker.ceph.com/issues/13382), [pr#7917](http://github.com/ceph/ceph/pull/7917), Sage Weil, David Zafman)
- client: added permission check based on getgrouplist ([issue#13268](http://tracker.ceph.com/issues/13268), [pr#6604](http://github.com/ceph/ceph/pull/6604), Yan, Zheng, Danny Al-Gaaf)
- client: inoderef ([issue#13729](http://tracker.ceph.com/issues/13729), [pr#6551](http://github.com/ceph/ceph/pull/6551), Yan, Zheng)
- common: clock skew report is incorrect by ceph health detail command ([issue#14175](http://tracker.ceph.com/issues/14175), [pr#8051](http://github.com/ceph/ceph/pull/8051), Joao Eduardo Luis)
- global/pidfile: do not start two daemons with a single pid-file ([issue#13422](http://tracker.ceph.com/issues/13422), [pr#7671](http://github.com/ceph/ceph/pull/7671), Loic Dachary, shun song)
- librados: segfault in Objecter::handle\_watch\_notify ([issue#13805](http://tracker.ceph.com/issues/13805), [pr#7992](http://github.com/ceph/ceph/pull/7992), Sage Weil)
- librbd: flattening an rbd image with active IO can lead to hang ([issue#14092](http://tracker.ceph.com/issues/14092), [issue#14483](http://tracker.ceph.com/issues/14483), [pr#7485](http://github.com/ceph/ceph/pull/7485), Jason Dillaman)
- librbd: possible QEMU deadlock after creating image snapshots ([issue#14988](http://tracker.ceph.com/issues/14988), [pr#8011](http://github.com/ceph/ceph/pull/8011), Jason Dillaman)
- mon: Bucket owner isn’t changed after unlink/link ([issue#11076](http://tracker.ceph.com/issues/11076), [pr#8583](http://github.com/ceph/ceph/pull/8583), Zengran Zhang)
- monclient: avoid key renew storm on clock skew ([issue#12065](http://tracker.ceph.com/issues/12065), [pr#8398](http://github.com/ceph/ceph/pull/8398), Alexey Sheplyakov)
- mon: implement reweight-by-utilization feature ([issue#15054](http://tracker.ceph.com/issues/15054), [pr#8026](http://github.com/ceph/ceph/pull/8026), Kefu Chai, Dan van der Ster, Sage Weil)
- mon/LogMonitor: use the configured facility if log to syslog ([issue#13748](http://tracker.ceph.com/issues/13748), [pr#7648](http://github.com/ceph/ceph/pull/7648), Kefu Chai)
- mon: mon sync does not copy config-key ([issue#14577](http://tracker.ceph.com/issues/14577), [pr#7576](http://github.com/ceph/ceph/pull/7576), Xiaowei Chen)
- mon/OSDMonitor: avoid underflow in reweight-by-utilization if max\_change=1 ([issue#15655](http://tracker.ceph.com/issues/15655), [pr#8979](http://github.com/ceph/ceph/pull/8979), Samuel Just)
- osd: consume\_maps clearing of waiting\_for\_pg needs to check the spg\_t shard for acting set membership ([issue#14278](http://tracker.ceph.com/issues/14278), [pr#7577](http://github.com/ceph/ceph/pull/7577), Samuel Just)
- osd: log inconsistent shard sizes ([issue#14009](http://tracker.ceph.com/issues/14009), [pr#6946](http://github.com/ceph/ceph/pull/6946), Loic Dachary)
- osd: OSD coredumps with leveldb compact on mount = true ([issue#14748](http://tracker.ceph.com/issues/14748), [pr#7645](http://github.com/ceph/ceph/pull/7645), Xiaoxi Chen)
- osd/OSDMap: reset osd\_primary\_affinity shared\_ptr when deepish\_copy\_from ([issue#14686](http://tracker.ceph.com/issues/14686), [pr#7590](http://github.com/ceph/ceph/pull/7590), Xinze Chi)
- osd: Protect against excessively large object map sizes ([issue#15121](http://tracker.ceph.com/issues/15121), [pr#8401](http://github.com/ceph/ceph/pull/8401), Jason Dillaman)
- osd/ReplicatedPG: do not proxy read _and_ process op locally ([issue#15171](http://tracker.ceph.com/issues/15171), [pr#8187](http://github.com/ceph/ceph/pull/8187), Sage Weil)
- osd: scrub bogus results when missing a clone ([issue#14875](http://tracker.ceph.com/issues/14875), [issue#14874](http://tracker.ceph.com/issues/14874), [issue#14877](http://tracker.ceph.com/issues/14877), [issue#10098](http://tracker.ceph.com/issues/10098), [issue#14878](http://tracker.ceph.com/issues/14878), [issue#14881](http://tracker.ceph.com/issues/14881), [issue#14882](http://tracker.ceph.com/issues/14882), [issue#14883](http://tracker.ceph.com/issues/14883), [issue#14879](http://tracker.ceph.com/issues/14879), [issue#10290](http://tracker.ceph.com/issues/10290), [issue#12740](http://tracker.ceph.com/issues/12740), [issue#12738](http://tracker.ceph.com/issues/12738), [issue#14880](http://tracker.ceph.com/issues/14880),[issue#11135](http://tracker.ceph.com/issues/11135), [issue#14876](http://tracker.ceph.com/issues/14876), [issue#10809](http://tracker.ceph.com/issues/10809), [issue#12193](http://tracker.ceph.com/issues/12193), [issue#11237](http://tracker.ceph.com/issues/11237), [pr#7702](http://github.com/ceph/ceph/pull/7702), Xinze Chi, Sage Weil, John Spray, Kefu Chai, Mykola Golub, David Zafman)
- osd: Unable to bring up OSD’s after dealing with FULL cluster (OSD assert with /include/interval\_set.h: 386: FAILED assert(\_size >= 0)) ([issue#14428](http://tracker.ceph.com/issues/14428), [pr#7415](http://github.com/ceph/ceph/pull/7415), Alexey Sheplyakov)
- osd: use GMT time for the object name of hitsets ([issue#13192](http://tracker.ceph.com/issues/13192), [issue#9732](http://tracker.ceph.com/issues/9732), [issue#12968](http://tracker.ceph.com/issues/12968), [pr#7883](http://github.com/ceph/ceph/pull/7883), Kefu Chai, David Zafman)
- qa/workunits/post-file.sh: sudo ([issue#14586](http://tracker.ceph.com/issues/14586), [pr#7456](http://github.com/ceph/ceph/pull/7456), Sage Weil)
- qa/workunits: remove ‘mds setmap’ from workunits ([pr#8123](http://github.com/ceph/ceph/pull/8123), Sage Weil)
- rgw: default quota params ([issue#12997](http://tracker.ceph.com/issues/12997), [pr#7188](http://github.com/ceph/ceph/pull/7188), Daniel Gryniewicz)
- rgw: make rgw\_fronends more forgiving of whitespace ([issue#12038](http://tracker.ceph.com/issues/12038), [pr#7414](http://github.com/ceph/ceph/pull/7414), Matt Benjamin)
- rgw: radosgw-admin bucket check –fix not work ([issue#14215](http://tracker.ceph.com/issues/14215), [pr#7185](http://github.com/ceph/ceph/pull/7185), Weijun Duan)
- rpm package building fails if the build machine has lttng and babeltrace development packages installed locally ([issue#14844](http://tracker.ceph.com/issues/14844), [pr#8440](http://github.com/ceph/ceph/pull/8440), Kefu Chai)
- rpm: redhat-lsb-core dependency was dropped, but is still needed ([issue#14906](http://tracker.ceph.com/issues/14906), [pr#7876](http://github.com/ceph/ceph/pull/7876), Nathan Cutler)
- test\_bit\_vector.cc uses magic numbers against #defines that vary ([issue#14747](http://tracker.ceph.com/issues/14747), [pr#7672](http://github.com/ceph/ceph/pull/7672), Jason Dillaman)
- test/librados/tier.cc doesn’t completely clean up EC pools ([issue#13878](http://tracker.ceph.com/issues/13878), [pr#8052](http://github.com/ceph/ceph/pull/8052), Loic Dachary, Dan Mick)
- tests: bufferlist: do not expect !is\_page\_aligned() after unaligned rebuild ([issue#15305](http://tracker.ceph.com/issues/15305), [pr#8272](http://github.com/ceph/ceph/pull/8272), Kefu Chai)
- tools: fix race condition in seq/rand bench (part 1) ([issue#14968](http://tracker.ceph.com/issues/14968), [issue#14873](http://tracker.ceph.com/issues/14873), [pr#7896](http://github.com/ceph/ceph/pull/7896), Alexey Sheplyakov, Piotr Dałek)
- tools: fix race condition in seq/rand bench (part 2) ([issue#14873](http://tracker.ceph.com/issues/14873), [pr#7817](http://github.com/ceph/ceph/pull/7817), Alexey Sheplyakov)
- tools/rados: add bench smoke tests ([issue#14971](http://tracker.ceph.com/issues/14971), [pr#7903](http://github.com/ceph/ceph/pull/7903), Piotr Dałek)
- tools, test: Add ceph-objectstore-tool to operate on the meta collection ([issue#14977](http://tracker.ceph.com/issues/14977), [pr#7911](http://github.com/ceph/ceph/pull/7911), David Zafman)
- unittest\_crypto: benchmark 100,000 CryptoKey::encrypt() calls ([issue#14863](http://tracker.ceph.com/issues/14863), [pr#7801](http://github.com/ceph/ceph/pull/7801), Sage Weil)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.94.7.tar.gz](http://ceph.com/download/ceph-0.94.7.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
