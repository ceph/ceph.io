---
title: "v19.2.3 Squid released"
date: "2025-07-28"
author: "Yuri Weinstein"
tags:
  - "release"
  - "squid"
---

This is the third backport release in the Squid series.
We recommend all users update to this release.

## Notable Changes

- RGW: PutObjectLockConfiguration can now be used to enable S3 Object Lock on an
  existing versioning-enabled bucket that was not created with Object Lock enabled.
- RADOS: A new command, `ceph osd rm-pg-upmap-primary-all`, has been added that allows
  users to clear all pg-upmap-primary mappings in the osdmap when desired.
  Related trackers:
   - https://tracker.ceph.com/issues/67179
   - https://tracker.ceph.com/issues/66867
- RBD: Moving an image that is a member of a group to trash is no longer
  allowed.  `rbd trash mv` command now behaves the same way as `rbd rm` in this
  scenario.
- MGR: MGR's always-on modulues/plugins can now be force-disabled. This can be
  necessary in cases where MGR(s) needs to be prevented from being flooded by
  the module commands when coresponding Ceph service is down/degraded.
- RGW: An authentication bypass vulnerability in STS
  [CVE-2023-43040] has been fixed.
- RGW: S3 policy now enforces ARN-based conditionals.
- RGW: Copying an object to itself no longer causes data
  loss. Potential corruption on ETIMEDOUT (not enabled by default),
  was also fixed.

## Changelog

- [CVE-2024-48916] rgw/sts: fix to disallow unsupported JWT algorithms ([pr#62137](https://github.com/ceph/ceph/pull/62137), Pritha Srivastava, Adam Emerson)

- [squid] RGW backports ([pr#63030](https://github.com/ceph/ceph/pull/63030), Soumya Koduri)

- ceph-volume: fix Zap<span></span>.ensure\_associated\_raw() ([pr#61260](https://github.com/ceph/ceph/pull/61260), Guillaume Abrioux)

- doc/rados: edit ops/user-management<span></span>.rst ([pr#63828](https://github.com/ceph/ceph/pull/63828), Zac Dover)

- doc: Fixes a typo in controllers section of hardware recommendations ([pr#61178](https://github.com/ceph/ceph/pull/61178), Kevin Niederwanger)

- exporter: repair Squid ceph\_exporter<span></span>.cc ([pr#61448](https://github.com/ceph/ceph/pull/61448), Zac Dover)

- Links to Jenkins jobs in PR comment commands / Remove deprecated commands ([pr#62035](https://github.com/ceph/ceph/pull/62035), David Galloway)

- mds: do not process client metrics message with fast dispatch ([issue#68865](http://tracker.ceph.com/issues/68865), [pr#62058](https://github.com/ceph/ceph/pull/62058), Venky Shankar)

- qa/tests: added squid-p2p suite ([pr#61809](https://github.com/ceph/ceph/pull/61809), Yuri Weinstein)

- qa/tests: changed ubuntu 20<span></span>.04 to 22<span></span>.04 ([pr#64309](https://github.com/ceph/ceph/pull/64309), yuriw)

- squid : os/bluestore : Assigning a named variable to ceph::time\_guard to prevent immediate destruction ([pr#61971](https://github.com/ceph/ceph/pull/61971), Jaya Prakash)

- squid: <span></span>.github: Fix RTD build retrigger ([pr#63211](https://github.com/ceph/ceph/pull/63211), David Galloway)

- squid: <common> fix formatter buffer out-of-bounds ([pr#61104](https://github.com/ceph/ceph/pull/61104), liubingrun)

- squid: <rgw> Ensure the ETag format is consistent with AWS S3 API ([pr#62607](https://github.com/ceph/ceph/pull/62607), Casey Bodley, liubingrun)

- squid: AsyncMessenger<span></span>.cc : improve error messages ([pr#61401](https://github.com/ceph/ceph/pull/61401), Anthony D'Atri)

- squid: Backport the hybrid\_btree2 allocator and prereqs ([pr#62540](https://github.com/ceph/ceph/pull/62540), Igor Fedotov, Jrchyang Yu)

- squid: Backport two commits to the Squid branch ([pr#61629](https://github.com/ceph/ceph/pull/61629), Kamoltat Sirivadhna)

- squid: blk/kernel: bring "bdev\_async\_discard" config parameter back ([pr#62254](https://github.com/ceph/ceph/pull/62254), Igor Fedotov, Yite Gu)

- squid: blk/kerneldevice: fix invalid iterator usage after erase in discard\_q… ([pr#62576](https://github.com/ceph/ceph/pull/62576), Yite Gu)

- squid: blk/KernelDevice: Introduce a cap on the number of pending discards ([pr#62221](https://github.com/ceph/ceph/pull/62221), Joshua Baergen)

- squid: blk/kerneldevice: notify\_all only required when discard\_drain wait for condition ([pr#62151](https://github.com/ceph/ceph/pull/62151), Yite Gu)

- squid: build-with-container fixes exec bit, dnf cache dir option ([pr#61912](https://github.com/ceph/ceph/pull/61912), John Mulligan)

- squid: build-with-container: fixes and enhancements ([pr#62161](https://github.com/ceph/ceph/pull/62161), John Mulligan)

- squid: build-with-container: two small fixes ([pr#62340](https://github.com/ceph/ceph/pull/62340), John Mulligan)

- squid: build: Fix opentelemetry-cpp build failure on Noble ([pr#64012](https://github.com/ceph/ceph/pull/64012), Adam C. Emerson)

- squid: ceph-volume: allow zapping partitions on multipath devices ([pr#62177](https://github.com/ceph/ceph/pull/62177), Guillaume Abrioux)

- squid: ceph-volume: fix loop devices support ([pr#61420](https://github.com/ceph/ceph/pull/61420), Guillaume Abrioux)

- squid: ceph-volume: Fix splitting with too many parts ([pr#63012](https://github.com/ceph/ceph/pull/63012), Janne Heß)

- squid: ceph-volume: support splitting db even on collocated scenario ([pr#61975](https://github.com/ceph/ceph/pull/61975), Guillaume Abrioux)

- squid: ceph-volume: support zapping by osd-id for RAW OSDs ([pr#60487](https://github.com/ceph/ceph/pull/60487), Guillaume Abrioux)

- squid: ceph<span></span>.spec<span></span>.in: add man/rgw-gap-list ([pr#63998](https://github.com/ceph/ceph/pull/63998), Matan Breizman)

- squid: cephadm: check "ceph\_device\_lvm" field instead of "ceph\_device" during zap ([pr#62905](https://github.com/ceph/ceph/pull/62905), Adam King)

- squid: cephfs-shell: fixing cephfs-shell test failures ([pr#60443](https://github.com/ceph/ceph/pull/60443), Neeraj Pratap Singh)

- squid: cephfs-top, qa: Remove unnecessary global statements in tests ([pr#62605](https://github.com/ceph/ceph/pull/62605), Kefu Chai)

- squid: cephfs-top: fix exceptions on small/large sized windows ([pr#59899](https://github.com/ceph/ceph/pull/59899), Jos Collin)

- squid: client,mds: case-insensitive directory trees ([pr#62095](https://github.com/ceph/ceph/pull/62095), Patrick Donnelly, Casey Bodley, Lucian Petrut, John Mulligan)

- squid: client: contiguous read fails for non-contiguous write (in async I/O api) ([pr#60218](https://github.com/ceph/ceph/pull/60218), Dhairya Parmar)

- squid: client: disallow unprivileged users to escalate root privileges ([pr#63458](https://github.com/ceph/ceph/pull/63458), Xiubo Li, Venky Shankar)

- squid: client: Fix opening and reading of symlinks ([pr#60372](https://github.com/ceph/ceph/pull/60372), Anoop C S)

- squid: client: fixed a bug that read operation hung ([pr#60694](https://github.com/ceph/ceph/pull/60694), Tod Chen)

- squid: client: flush the caps release in filesystem sync ([pr#59395](https://github.com/ceph/ceph/pull/59395), Xiubo Li)

- squid: client: Prevent race condition when printing Inode in ll\_sync\_inode ([pr#59621](https://github.com/ceph/ceph/pull/59621), Chengen Du)

- squid: client: return EOPNOTSUPP for fallocate with mode 0 ([pr#60656](https://github.com/ceph/ceph/pull/60656), Milind Changire)

- squid: cls/rbd: write image mirror status if state is CREATING ([pr#63234](https://github.com/ceph/ceph/pull/63234), N Balachandran)

- squid: cls/rgw: non-versioned listings skip past version suffix ([pr#62590](https://github.com/ceph/ceph/pull/62590), Casey Bodley)

- squid: common,ceph: add output file switch to dump json to ([pr#57675](https://github.com/ceph/ceph/pull/57675), Patrick Donnelly)

- squid: common/options: fix the description of osd\_max\_scrubs ([pr#62377](https://github.com/ceph/ceph/pull/62377), Satoru Takeuchi)

- squid: common/pick\_address: Add IPv6 support to is\_addr\_in\_subnet ([pr#61323](https://github.com/ceph/ceph/pull/61323), Nitzan Mordechai)

- squid: common/StackStringStream: update pointer to newly allocated memory in overflow() ([pr#57361](https://github.com/ceph/ceph/pull/57361), Rongqi Sun)

- squid: common: CephContext::\_refresh\_perf\_values() checks for null \_mempool\_perf ([pr#62852](https://github.com/ceph/ceph/pull/62852), Casey Bodley)

- squid: common: fix md\_config\_cacher\_t ([pr#61398](https://github.com/ceph/ceph/pull/61398), Ronen Friedman)

- squid: common: Leverage a better CRC32C implementation ([pr#59389](https://github.com/ceph/ceph/pull/59389), Tyler Stachecki)

- squid: common: use close\_range on Linux ([pr#61639](https://github.com/ceph/ceph/pull/61639), edef)

- squid: container/build<span></span>.sh: don't require repo creds on NO\_PUSH ([pr#61585](https://github.com/ceph/ceph/pull/61585), Dan Mick)

- squid: container/build<span></span>.sh: fix up org vs<span></span>. repo naming ([pr#61584](https://github.com/ceph/ceph/pull/61584), Dan Mick)

- squid: container/build<span></span>.sh: remove local container images ([pr#62066](https://github.com/ceph/ceph/pull/62066), Dan Mick)

- squid: container/Containerfile: replace CEPH\_VERSION label for backward compact ([pr#61583](https://github.com/ceph/ceph/pull/61583), Dan Mick)

- squid: container: add label ceph=True back ([pr#61611](https://github.com/ceph/ceph/pull/61611), John Mulligan)

- squid: container: small container image improvements ([pr#62346](https://github.com/ceph/ceph/pull/62346), John Mulligan)

- squid: containerized build tools [V2] ([pr#61681](https://github.com/ceph/ceph/pull/61681), John Mulligan)

- squid: crush: use std::vector instead of variable length arrays ([pr#61956](https://github.com/ceph/ceph/pull/61956), Kefu Chai)

- squid: debian: add ceph-exporter package ([pr#62270](https://github.com/ceph/ceph/pull/62270), Shinya Hayashi)

- squid: dencoder tests fix type backwards incompatible checks ([pr#62198](https://github.com/ceph/ceph/pull/62198), Nitzan Mordechai)

- squid: doc/architecture: remove sentence ([pr#61614](https://github.com/ceph/ceph/pull/61614), Zac Dover)

- squid: doc/cephadm/services: Add mention of --zap for OSD removal ([pr#62443](https://github.com/ceph/ceph/pull/62443), Anthony D'Atri)

- squid: doc/cephadm/services: Correct indentation in osd<span></span>.rst ([pr#62427](https://github.com/ceph/ceph/pull/62427), Anthony D'Atri)

- squid: doc/cephadm/services: Fix formatting in osd<span></span>.rst ([pr#62810](https://github.com/ceph/ceph/pull/62810), Anthony D'Atri)

- squid: doc/cephadm/services: improve rgw<span></span>.rst and snmp-gateway<span></span>.rst ([pr#62694](https://github.com/ceph/ceph/pull/62694), Anthony D'Atri)

- squid: doc/cephadm/services: Re-improve osd<span></span>.rst ([pr#61952](https://github.com/ceph/ceph/pull/61952), Anthony D'Atri)

- squid: doc/cephadm: Add admonition re restarting an OSD service ([pr#62796](https://github.com/ceph/ceph/pull/62796), Anthony D'Atri)

- squid: doc/cephadm: Add PG autoscaler advice to upgrade<span></span>.rst ([pr#62379](https://github.com/ceph/ceph/pull/62379), Anthony D'Atri)

- squid: doc/cephadm: clarify "Monitoring OSD State" ([pr#61664](https://github.com/ceph/ceph/pull/61664), Zac Dover)

- squid: doc/cephadm: Correct formatting in upgrade<span></span>.rst ([pr#63147](https://github.com/ceph/ceph/pull/63147), Anthony D'Atri)

- squid: doc/cephadm: correct markup in rgw<span></span>.rst ([pr#63073](https://github.com/ceph/ceph/pull/63073), Zac Dover)

- squid: doc/cephadm: correct note ([pr#61528](https://github.com/ceph/ceph/pull/61528), Zac Dover)

- squid: doc/cephadm: improve "Activate Existing OSDs" ([pr#61747](https://github.com/ceph/ceph/pull/61747), Zac Dover)

- squid: doc/cephadm: improve "Activate Existing OSDs" ([pr#61725](https://github.com/ceph/ceph/pull/61725), Zac Dover)

- squid: doc/cephadm: improve "Maintenance Mode" ([pr#63495](https://github.com/ceph/ceph/pull/63495), Zac Dover)

- squid: doc/cephadm: s/confg/config/ ([pr#62644](https://github.com/ceph/ceph/pull/62644), Zac Dover)

- squid: doc/cephadm: simplify confusing math proposition ([pr#61574](https://github.com/ceph/ceph/pull/61574), Zac Dover)

- squid: doc/cephfs: correct ill-formatted command ([pr#63501](https://github.com/ceph/ceph/pull/63501), Zac Dover)

- squid: doc/cephfs: correct reference structure in fs-volumes<span></span>.rst ([pr#63544](https://github.com/ceph/ceph/pull/63544), Zac Dover)

- squid: doc/cephfs: Cosmetic changes and small fixes in cephfs-mirroring<span></span>.rst ([pr#63467](https://github.com/ceph/ceph/pull/63467), Ville Ojamo)

- squid: doc/cephfs: disaster-recovery-experts cleanup ([pr#61446](https://github.com/ceph/ceph/pull/61446), Zac Dover)

- squid: doc/cephfs: document first-damage<span></span>.py ([pr#63977](https://github.com/ceph/ceph/pull/63977), Zac Dover)

- squid: doc/cephfs: document purge queue and its perf counters ([pr#61193](https://github.com/ceph/ceph/pull/61193), Dhairya Parmar)

- squid: doc/cephfs: edit 2nd 3rd of mount-using-kernel-driver ([pr#61058](https://github.com/ceph/ceph/pull/61058), Zac Dover)

- squid: doc/cephfs: edit disaster-recovery-experts ([pr#61423](https://github.com/ceph/ceph/pull/61423), Zac Dover)

- squid: doc/cephfs: edit disaster-recovery-experts (2 of x) ([pr#61443](https://github.com/ceph/ceph/pull/61443), Zac Dover)

- squid: doc/cephfs: edit disaster-recovery-experts (3 of x) ([pr#61453](https://github.com/ceph/ceph/pull/61453), Zac Dover)

- squid: doc/cephfs: edit disaster-recovery-experts (4 of x) ([pr#61479](https://github.com/ceph/ceph/pull/61479), Zac Dover)

- squid: doc/cephfs: edit disaster-recovery-experts (5 of x) ([pr#61499](https://github.com/ceph/ceph/pull/61499), Zac Dover)

- squid: doc/cephfs: edit disaster-recovery-experts (6 of x) ([pr#61521](https://github.com/ceph/ceph/pull/61521), Zac Dover)

- squid: doc/cephfs: edit first 3rd of mount-using-kernel-driver ([pr#61056](https://github.com/ceph/ceph/pull/61056), Zac Dover)

- squid: doc/cephfs: edit grammar in snapshots<span></span>.rst ([pr#61459](https://github.com/ceph/ceph/pull/61459), Zac Dover)

- squid: doc/cephfs: link section for pausing async threads in section for ([pr#62874](https://github.com/ceph/ceph/pull/62874), Rishabh Dave)

- squid: doc/cephfs: Update deprecation notice in experimental-features<span></span>.rst ([pr#63948](https://github.com/ceph/ceph/pull/63948), Ville Ojamo)

- squid: doc/dev/cephfs-mirroring: edit file 1 of x ([pr#63298](https://github.com/ceph/ceph/pull/63298), Zac Dover)

- squid: doc/dev/cephfs-mirroring: edit file 2 of x ([pr#63273](https://github.com/ceph/ceph/pull/63273), Zac Dover)

- squid: doc/dev/cephfs-mirroring: edit file 3 of x ([pr#63547](https://github.com/ceph/ceph/pull/63547), Zac Dover)

- squid: doc/dev/cephfs-mirroring: edit file 4 of x ([pr#63660](https://github.com/ceph/ceph/pull/63660), Zac Dover)

- squid: doc/dev/developer\_guide/essentials: update mailing lists ([pr#62375](https://github.com/ceph/ceph/pull/62375), Laimis Juzeliunas)

- squid: doc/dev/release-process<span></span>.rst: release builds cannot build containers ([pr#61817](https://github.com/ceph/ceph/pull/61817), Dan Mick, Zac Dover)

- squid: doc/dev: Debuggging with gdb ([pr#63993](https://github.com/ceph/ceph/pull/63993), Matan Breizman)

- squid: doc/dev: update link to backporter manual ([pr#63990](https://github.com/ceph/ceph/pull/63990), Zac Dover)

- squid: doc/glossary: s/OMAP/omap/ ([pr#63737](https://github.com/ceph/ceph/pull/63737), Zac Dover)

- squid: doc/man: supplant "wsync" with "nowsync" as the default ([pr#60199](https://github.com/ceph/ceph/pull/60199), Zac Dover)

- squid: doc/mgr/ceph\_api: edit index<span></span>.rst ([pr#63197](https://github.com/ceph/ceph/pull/63197), Zac Dover)

- squid: doc/mgr/dashboard\_plugins: edit feature\_toggles<span></span>.inc<span></span>.rst ([pr#63704](https://github.com/ceph/ceph/pull/63704), Zac Dover)

- squid: doc/mgr: Add root CA cert instructions to rgw<span></span>.rst ([pr#61884](https://github.com/ceph/ceph/pull/61884), Anuradha Gadge, Zac Dover)

- squid: doc/mgr: edit administrator<span></span>.rst ([pr#63207](https://github.com/ceph/ceph/pull/63207), Zac Dover)

- squid: doc/mgr: edit alerts<span></span>.rst ([pr#63200](https://github.com/ceph/ceph/pull/63200), Zac Dover)

- squid: doc/mgr: edit cli\_api ([pr#63743](https://github.com/ceph/ceph/pull/63743), Zac Dover)

- squid: doc/mgr: edit cli\_api<span></span>.rst ([pr#63689](https://github.com/ceph/ceph/pull/63689), Zac Dover)

- squid: doc/mgr: edit crash<span></span>.rst ([pr#63538](https://github.com/ceph/ceph/pull/63538), Zac Dover)

- squid: doc/mgr: edit dashboard<span></span>.rst ([pr#63315](https://github.com/ceph/ceph/pull/63315), Zac Dover)

- squid: doc/mgr: edit debug<span></span>.inc<span></span>.rst ([pr#63393](https://github.com/ceph/ceph/pull/63393), Zac Dover)

- squid: doc/mgr: edit diskpredictor<span></span>.rst ([pr#63423](https://github.com/ceph/ceph/pull/63423), Zac Dover)

- squid: doc/mgr: edit feature\_toggles<span></span>.inc<span></span>.rst ([pr#63396](https://github.com/ceph/ceph/pull/63396), Zac Dover)

- squid: doc/mgr: edit hello<span></span>.rst ([pr#63507](https://github.com/ceph/ceph/pull/63507), Zac Dover)

- squid: doc/mgr: edit influx<span></span>.rst ([pr#63454](https://github.com/ceph/ceph/pull/63454), Zac Dover)

- squid: doc/mgr: edit insights<span></span>.rst ([pr#63510](https://github.com/ceph/ceph/pull/63510), Zac Dover)

- squid: doc/mgr: edit iostat<span></span>.rst ([pr#63680](https://github.com/ceph/ceph/pull/63680), Zac Dover)

- squid: doc/mgr: edit iostat<span></span>.rst ([pr#63513](https://github.com/ceph/ceph/pull/63513), Zac Dover)

- squid: doc/mgr: edit localpool<span></span>.rst ([pr#63669](https://github.com/ceph/ceph/pull/63669), Zac Dover)

- squid: doc/mgr: edit localpool<span></span>.rst ([pr#63550](https://github.com/ceph/ceph/pull/63550), Zac Dover)

- squid: doc/mgr: edit mds\_autoscaler<span></span>.rst ([pr#63492](https://github.com/ceph/ceph/pull/63492), Zac Dover)

- squid: doc/mgr: edit modules<span></span>.rst ([pr#63666](https://github.com/ceph/ceph/pull/63666), Zac Dover)

- squid: doc/mgr: edit modules<span></span>.rst ([pr#63577](https://github.com/ceph/ceph/pull/63577), Zac Dover)

- squid: doc/mgr: edit motd<span></span>.inc<span></span>.rst ([pr#63402](https://github.com/ceph/ceph/pull/63402), Zac Dover)

- squid: doc/mgr: edit nfs<span></span>.rst ([pr#63663](https://github.com/ceph/ceph/pull/63663), Zac Dover)

- squid: doc/mgr: edit nfs<span></span>.rst ([pr#63580](https://github.com/ceph/ceph/pull/63580), Zac Dover)

- squid: doc/mgr: edit orchestrator<span></span>.rst ([pr#63583](https://github.com/ceph/ceph/pull/63583), Zac Dover)

- squid: doc/mgr: edit progress<span></span>.rst ([pr#63657](https://github.com/ceph/ceph/pull/63657), Zac Dover)

- squid: doc/mgr: edit progress<span></span>.rst ([pr#63586](https://github.com/ceph/ceph/pull/63586), Zac Dover)

- squid: doc/mgr: edit prometheus<span></span>.rst ([pr#63589](https://github.com/ceph/ceph/pull/63589), Zac Dover)

- squid: doc/mgr: edit rgw<span></span>.rst ([pr#63592](https://github.com/ceph/ceph/pull/63592), Zac Dover)

- squid: doc/mgr: edit telegraf<span></span>.rst ([pr#63611](https://github.com/ceph/ceph/pull/63611), Zac Dover)

- squid: doc/mgr: edit telemetry (1 of x) ([pr#63768](https://github.com/ceph/ceph/pull/63768), Zac Dover)

- squid: doc/mgr: edit telemetry (2 of x) ([pr#63771](https://github.com/ceph/ceph/pull/63771), Zac Dover)

- squid: doc/mgr: edit telemetry (3 of x) ([pr#63774](https://github.com/ceph/ceph/pull/63774), Zac Dover)

- squid: doc/mgr: edit telemetry (4 of x) ([pr#63777](https://github.com/ceph/ceph/pull/63777), Zac Dover)

- squid: doc/mgr: edit telemetry<span></span>.rst ([pr#63905](https://github.com/ceph/ceph/pull/63905), Zac Dover)

- squid: doc/mgr: edit telemetry<span></span>.rst ([pr#63864](https://github.com/ceph/ceph/pull/63864), Zac Dover)

- squid: doc/mgr: edit telemetry<span></span>.rst ([pr#63692](https://github.com/ceph/ceph/pull/63692), Zac Dover)

- squid: doc/mgr: edit telemetry<span></span>.rst (lines 300-400) ([pr#63867](https://github.com/ceph/ceph/pull/63867), Zac Dover)

- squid: doc/mgr: Improve prometheus<span></span>.rst ([pr#62930](https://github.com/ceph/ceph/pull/62930), Anthony D'Atri)

- squid: doc/mgr: Small improvements in rgw<span></span>.rst ([pr#63625](https://github.com/ceph/ceph/pull/63625), Ville Ojamo)

- squid: doc/monitoring: correct list formatting ([pr#63541](https://github.com/ceph/ceph/pull/63541), Zac Dover)

- squid: doc/monitoring: Improve index<span></span>.rst ([pr#62265](https://github.com/ceph/ceph/pull/62265), Anthony D'Atri)

- squid: doc/rados/configuration/bluestore-config-ref: Fix lowercase typos ([pr#62290](https://github.com/ceph/ceph/pull/62290), Dan van der Ster)

- squid: doc/rados/configuration: Correct admonition in ceph-conf<span></span>.rst ([pr#62620](https://github.com/ceph/ceph/pull/62620), Anthony D'Atri)

- squid: doc/rados/configuration: Improve ceph-conf<span></span>.rst ([pr#63942](https://github.com/ceph/ceph/pull/63942), Anthony D'Atri)

- squid: doc/rados/operations/stretch-mode<span></span>.rst: Added Limitations to stretch pool configurations ([pr#61006](https://github.com/ceph/ceph/pull/61006), Kamoltat Sirivadhna)

- squid: doc/rados/operations: Actually mention `upmap\_max\_deviation` setting … ([pr#64118](https://github.com/ceph/ceph/pull/64118), Niklas Hambüchen)

- squid: doc/rados/operations: Add settings advice to balancer<span></span>.rst ([pr#63535](https://github.com/ceph/ceph/pull/63535), Anthony D'Atri)

- squid: doc/rados/operations: Additional improvements to placement-groups<span></span>.rst ([pr#63649](https://github.com/ceph/ceph/pull/63649), Anthony D'Atri)

- squid: doc/rados/operations: Address suggestions for stretch-mode<span></span>.rst ([pr#63849](https://github.com/ceph/ceph/pull/63849), Anthony D'Atri, Zac Dover)

- squid: doc/rados/operations: Clarify stretch mode vs device class ([pr#62077](https://github.com/ceph/ceph/pull/62077), Anthony D'Atri)

- squid: doc/rados/operations: Fix unordered list in health-checks<span></span>.rst ([pr#63958](https://github.com/ceph/ceph/pull/63958), Ville Ojamo)

- squid: doc/rados/operations: improve crush-map-edits<span></span>.rst ([pr#62317](https://github.com/ceph/ceph/pull/62317), Anthony D'Atri)

- squid: doc/rados/operations: Improve erasure-code<span></span>.rst ([pr#62573](https://github.com/ceph/ceph/pull/62573), Anthony D'Atri)

- squid: doc/rados/operations: Improve placement-groups<span></span>.rst ([pr#63646](https://github.com/ceph/ceph/pull/63646), Anthony D'Atri)

- squid: doc/rados/operations: Improve pools<span></span>.rst ([pr#61728](https://github.com/ceph/ceph/pull/61728), Anthony D'Atri)

- squid: doc/rados/operations: Improve stretch-mode<span></span>.rst ([pr#63815](https://github.com/ceph/ceph/pull/63815), Anthony D'Atri)

- squid: doc/rados/ops: edit cache-tiering<span></span>.rst ([pr#63830](https://github.com/ceph/ceph/pull/63830), Zac Dover)

- squid: doc/rados/troubleshooting: Improve troubleshooting-pg<span></span>.rst ([pr#62320](https://github.com/ceph/ceph/pull/62320), Anthony D'Atri)

- squid: doc/rados: edit balancer<span></span>.rst ([pr#63683](https://github.com/ceph/ceph/pull/63683), Zac Dover)

- squid: doc/rados: enhance "pools<span></span>.rst" ([pr#63861](https://github.com/ceph/ceph/pull/63861), Zac Dover)

- squid: doc/rados: improve markup in cache-tiering<span></span>.rst ([pr#63504](https://github.com/ceph/ceph/pull/63504), Zac Dover)

- squid: doc/rados: improve pg\_num/pgp\_num info ([pr#62056](https://github.com/ceph/ceph/pull/62056), Zac Dover)

- squid: doc/rados: pool and namespace are independent osdcap restrictions ([pr#61523](https://github.com/ceph/ceph/pull/61523), Ilya Dryomov)

- squid: doc/rados: s/enpty/empty/ in pgcalc doc ([pr#63498](https://github.com/ceph/ceph/pull/63498), Zac Dover)

- squid: doc/rados: Update mClock doc on steps to override OSD IOPS capacity config ([pr#63071](https://github.com/ceph/ceph/pull/63071), Sridhar Seshasayee)

- squid: doc/radosgw /notifications: fix topic details ([pr#62404](https://github.com/ceph/ceph/pull/62404), Laimis Juzeliunas)

- squid: doc/radosgw/admin<span></span>.rst: explain bucket and uid flags for bucket quota ([pr#64021](https://github.com/ceph/ceph/pull/64021), Hyun Jin Kim)

- squid: doc/radosgw/cloud-transition: fix details ([pr#62834](https://github.com/ceph/ceph/pull/62834), Laimis Juzeliunas)

- squid: doc/radosgw/config-ref: fix lc worker thread tuning ([pr#61437](https://github.com/ceph/ceph/pull/61437), Laimis Juzeliunas)

- squid: doc/radosgw/s3: correct eTag op match tables ([pr#61308](https://github.com/ceph/ceph/pull/61308), Anthony D'Atri)

- squid: doc/radosgw: add "persistent\_topic\_size" ([pr#64139](https://github.com/ceph/ceph/pull/64139), Zac Dover)

- squid: doc/radosgw: Cosmetic and formatting improvements in vault<span></span>.rst ([pr#63229](https://github.com/ceph/ceph/pull/63229), Ville Ojamo)

- squid: doc/radosgw: Cosmetic improvements in cloud-transition<span></span>.rst ([pr#63448](https://github.com/ceph/ceph/pull/63448), Ville Ojamo)

- squid: doc/radosgw: Cosmetic improvements in dynamicresharding<span></span>.rst ([pr#64058](https://github.com/ceph/ceph/pull/64058), Ville Ojamo)

- squid: doc/radosgw: edit cloud-transition (1 of x) ([pr#64024](https://github.com/ceph/ceph/pull/64024), Zac Dover)

- squid: doc/radosgw: edit sentence in metrics<span></span>.rst ([pr#63700](https://github.com/ceph/ceph/pull/63700), Zac Dover)

- squid: doc/radosgw: Fix RST syntax rendeded as text in oidc<span></span>.rst ([pr#62989](https://github.com/ceph/ceph/pull/62989), Ville Ojamo)

- squid: doc/radosgw: improve "pubsub\_push\_pending" info ([pr#64113](https://github.com/ceph/ceph/pull/64113), Zac Dover)

- squid: doc/radosgw: Improve and more consistent formatting ([pr#62909](https://github.com/ceph/ceph/pull/62909), Ville Ojamo)

- squid: doc/radosgw: Improve cloud-restore and cloud-transition ([pr#62666](https://github.com/ceph/ceph/pull/62666), Anthony D'Atri)

- squid: doc/radosgw: Improve formatting in layout<span></span>.rst ([pr#62999](https://github.com/ceph/ceph/pull/62999), Anthony D'Atri)

- squid: doc/radosgw: Improve layout<span></span>.rst ([pr#62449](https://github.com/ceph/ceph/pull/62449), Anthony D'Atri)

- squid: doc/radosgw: Promptify CLI commands and fix formatting in layout<span></span>.rst ([pr#63915](https://github.com/ceph/ceph/pull/63915), Ville Ojamo)

- squid: doc/radosgw: Promptify CLI, cosmetic fixes ([pr#62856](https://github.com/ceph/ceph/pull/62856), Ville Ojamo)

- squid: doc/radosgw: remove "pubsub\_event\_lost" ([pr#64126](https://github.com/ceph/ceph/pull/64126), Zac Dover)

- squid: doc/radosgw: remove "pubsub\_event\_triggered" ([pr#64155](https://github.com/ceph/ceph/pull/64155), Zac Dover)

- squid: doc/radosgw: s/zonegroup/pools/ ([pr#61556](https://github.com/ceph/ceph/pull/61556), Zac Dover)

- squid: doc/radosgw: update aws specification link ([pr#64095](https://github.com/ceph/ceph/pull/64095), Zac Dover)

- squid: doc/radosgw: Use ref for hyperlinking to multisite ([pr#63311](https://github.com/ceph/ceph/pull/63311), Ville Ojamo)

- squid: doc/rbd: add mirroring troubleshooting info ([pr#63846](https://github.com/ceph/ceph/pull/63846), Zac Dover)

- squid: doc/rbd: use https links in live import examples ([pr#61605](https://github.com/ceph/ceph/pull/61605), Ilya Dryomov)

- squid: doc/releases: add actual\_eol for quincy ([pr#61359](https://github.com/ceph/ceph/pull/61359), Zac Dover)

- squid: doc/releases: Add ordering comment to releases<span></span>.yml ([pr#62192](https://github.com/ceph/ceph/pull/62192), Anthony D'Atri)

- squid: doc/releases: correct squid release order ([pr#61988](https://github.com/ceph/ceph/pull/61988), Zac Dover)

- squid: doc/rgw: add man documentation for the rgw-gap-list tool ([pr#63996](https://github.com/ceph/ceph/pull/63996), J. Eric Ivancich)

- squid: doc/rgw: add man documentation for the rgw-gap-list tool ([pr#63728](https://github.com/ceph/ceph/pull/63728), Matan Breizman, J. Eric Ivancich)

- squid: doc/rgw: clarify path-style vs virtual-hosted-style access ([pr#61986](https://github.com/ceph/ceph/pull/61986), Casey Bodley)

- squid: doc/rgw: document Admin and System Users ([pr#62881](https://github.com/ceph/ceph/pull/62881), Casey Bodley)

- squid: doc/rgw: document UserName requirements for account migration ([pr#61333](https://github.com/ceph/ceph/pull/61333), Casey Bodley)

- squid: doc/rgw: use 'confval' directive to render sts config options ([pr#63441](https://github.com/ceph/ceph/pull/63441), Casey Bodley)

- squid: doc/src: edit osd<span></span>.yaml<span></span>.in (osd\_deep\_scrub\_interval\_cv) ([pr#63955](https://github.com/ceph/ceph/pull/63955), Zac Dover)

- squid: doc/start: edit documenting-ceph<span></span>.rst ([pr#63652](https://github.com/ceph/ceph/pull/63652), Zac Dover)

- squid: doc/start: edit documenting-ceph<span></span>.rst ([pr#63707](https://github.com/ceph/ceph/pull/63707), Zac Dover)

- squid: doc/start: Mention RGW in Intro to Ceph ([pr#61926](https://github.com/ceph/ceph/pull/61926), Anthony D'Atri)

- squid: doc: add snapshots in docs under Cephfs concepts ([pr#61246](https://github.com/ceph/ceph/pull/61246), Neeraj Pratap Singh)

- squid: doc: Clarify that there are no tertiary OSDs ([pr#61730](https://github.com/ceph/ceph/pull/61730), Anthony D'Atri)

- squid: doc: fix formatting in cephfs\_mirror dev doc ([pr#63250](https://github.com/ceph/ceph/pull/63250), Jos Collin)

- squid: doc: fix incorrect radosgw-admin subcommand ([pr#62004](https://github.com/ceph/ceph/pull/62004), Toshikuni Fukaya)

- squid: doc: Fix missing blank line Sphinx warnings ([pr#63337](https://github.com/ceph/ceph/pull/63337), Ville Ojamo)

- squid: doc: fixup #58689 - document SSE-C iam condition key ([pr#62297](https://github.com/ceph/ceph/pull/62297), dawg)

- squid: doc: improve tests-integration-testing-teuthology-workflow<span></span>.rst ([pr#61342](https://github.com/ceph/ceph/pull/61342), Vallari Agrawal)

- squid: doc: mgr/dashboard: add OAuth2 SSO documentation ([pr#64033](https://github.com/ceph/ceph/pull/64033), Pedro Gonzalez Gomez, Zac Dover)

- squid: doc: src: modernize sample<span></span>.ceph<span></span>.conf ([pr#61641](https://github.com/ceph/ceph/pull/61641), Anthony D'Atri)

- squid: doc: update cephfs-journal-tool docs ([pr#63108](https://github.com/ceph/ceph/pull/63108), Jos Collin)

- squid: doc: Upgrade and unpin some python versions ([pr#61931](https://github.com/ceph/ceph/pull/61931), David Galloway)

- squid: fix: the RGW crash caused by special characters ([pr#64049](https://github.com/ceph/ceph/pull/64049), mertsunacoglu, Emin)

- squid: integrate blockdiff with cephfs-mirror daemon ([issue#70225](http://tracker.ceph.com/issues/70225), [issue#70287](http://tracker.ceph.com/issues/70287), [issue#69791](http://tracker.ceph.com/issues/69791), [issue#70584](http://tracker.ceph.com/issues/70584), [pr#63241](https://github.com/ceph/ceph/pull/63241), Venky Shankar, Jos Collin)

- squid: librbd/cache/pwl: fix memory leak in SyncPoint persist context cleanup ([pr#64097](https://github.com/ceph/ceph/pull/64097), Kefu Chai)

- squid: librbd/migration/QCOWFormat: don't complete read\_clusters() inline ([pr#64196](https://github.com/ceph/ceph/pull/64196), Ilya Dryomov)

- squid: librbd/migration: add external clusters support + NBD stream ([pr#63406](https://github.com/ceph/ceph/pull/63406), Ilya Dryomov, Effi Ofer, Or Ozeri)

- squid: librbd: add rbd\_diff\_iterate3() API to take source snapshot by ID ([pr#62130](https://github.com/ceph/ceph/pull/62130), Ilya Dryomov, Vinay Bhaskar Varada)

- squid: librbd: clear ctx before initiating close in Image::{aio\\_,}close() ([pr#61527](https://github.com/ceph/ceph/pull/61527), Ilya Dryomov)

- squid: librbd: disallow "rbd trash mv" if image is in a group ([pr#62968](https://github.com/ceph/ceph/pull/62968), Ilya Dryomov)

- squid: librbd: fix a crash in get\_rollback\_snap\_id ([pr#62044](https://github.com/ceph/ceph/pull/62044), Ilya Dryomov, N Balachandran)

- squid: librbd: fix a deadlock on image\_lock caused by Mirror::image\_disable() ([pr#62128](https://github.com/ceph/ceph/pull/62128), Ilya Dryomov)

- squid: librbd: fix mirror image status summary in a namespace ([pr#61832](https://github.com/ceph/ceph/pull/61832), Ilya Dryomov)

- squid: librbd: respect rbd\_default\_snapshot\_quiesce\_mode in group\_snap\_create() ([pr#62963](https://github.com/ceph/ceph/pull/62963), Ilya Dryomov)

- squid: librbd: stop filtering async request error codes ([pr#61645](https://github.com/ceph/ceph/pull/61645), Ilya Dryomov)

- squid: log: concatenate thread names and print once per thread ([pr#61287](https://github.com/ceph/ceph/pull/61287), Patrick Donnelly)

- squid: LogMonitor: set no\_reply for forward MLog commands ([pr#62213](https://github.com/ceph/ceph/pull/62213), Nitzan Mordechai)

- squid: mds/Beacon: wake up the thread in shutdown() ([pr#60837](https://github.com/ceph/ceph/pull/60837), Max Kellermann)

- squid: mds: add an asok command to dump export states ([pr#60836](https://github.com/ceph/ceph/pull/60836), Zhansong Gao)

- squid: mds: batch backtrace updates by pool-id when expiring a log segment ([issue#63259](http://tracker.ceph.com/issues/63259), [pr#60688](https://github.com/ceph/ceph/pull/60688), Venky Shankar)

- squid: mds: cephx path restriction incorrectly rejects snapshots of deleted directory ([pr#59518](https://github.com/ceph/ceph/pull/59518), Patrick Donnelly)

- squid: mds: drop client metrics during recovery ([pr#59866](https://github.com/ceph/ceph/pull/59866), Patrick Donnelly)

- squid: mds: enforce usage of host error in cephfs, use errorcode32\_t in MClientReply message ([pr#61994](https://github.com/ceph/ceph/pull/61994), Igor Golikov)

- squid: mds: getattr just waits the xlock to be released by the previous client ([pr#60691](https://github.com/ceph/ceph/pull/60691), Xiubo Li)

- squid: mds: Implement remove for ceph vxattrs ([pr#60752](https://github.com/ceph/ceph/pull/60752), Christopher Hoffman)

- squid: mds: invalid id for client eviction is to be treated as success ([issue#68132](http://tracker.ceph.com/issues/68132), [pr#60059](https://github.com/ceph/ceph/pull/60059), Venky Shankar)

- squid: mds: move fscrypt inode\_t metadata to mds\_co mempool ([pr#59616](https://github.com/ceph/ceph/pull/59616), Patrick Donnelly)

- squid: mds: prevent duplicate wrlock acquisition for a single request ([pr#61840](https://github.com/ceph/ceph/pull/61840), Xiubo Li, Sunnatillo)

- squid: mds: trim mdlog when segments exceed threshold and trim was idle ([pr#60838](https://github.com/ceph/ceph/pull/60838), Venky Shankar)

- squid: mgr/cephadm: fixing logic in cert-store save\_cert method ([pr#63853](https://github.com/ceph/ceph/pull/63853), Redouane Kachach)

- squid: mgr/dashboard: (refactor)fix image size in nvmeof namespace create/update api ([pr#61969](https://github.com/ceph/ceph/pull/61969), Afreen Misbah)

- squid: mgr/dashboard: accept dot(<span></span>.) in user\_id & restrict tenant validation in user form ([pr#63477](https://github.com/ceph/ceph/pull/63477), Naman Munet)

- squid: mgr/dashboard: Add --force flag for listeners ([pr#64132](https://github.com/ceph/ceph/pull/64132), Afreen Misbah)

- squid: mgr/dashboard: add a custom warning message when enabling feature ([pr#61039](https://github.com/ceph/ceph/pull/61039), Nizamudeen A)

- squid: mgr/dashboard: Add additional NVME API endpoints ([pr#61998](https://github.com/ceph/ceph/pull/61998), Tomer Haskalovitch)

- squid: mgr/dashboard: Add ceph\_daemon filter to rgw overview grafana panel queries ([pr#62267](https://github.com/ceph/ceph/pull/62267), Aashish Sharma)

- squid: mgr/dashboard: add prometheus read permission to cluster\_mgr role ([pr#62650](https://github.com/ceph/ceph/pull/62650), Nizamudeen A)

- squid: mgr/dashboard: add xlmtodict import and fix lifecycle get request ([pr#62393](https://github.com/ceph/ceph/pull/62393), Pedro Gonzalez Gomez)

- Squid: mgr/dashboard: Administration > Configuration > Some of the config options are not updatable at runtime ([pr#61181](https://github.com/ceph/ceph/pull/61181), Naman Munet)

- squid: mgr/dashboard: Changing SimpleGraphPanel to TimeSeries Panel in cephfs<span></span>.libsonnet to fix inconsistency in Line Graphs ([pr#62381](https://github.com/ceph/ceph/pull/62381), Piyush Agarwal)

- squid: mgr/dashboard: Changing SimpleGraphPanel to TimeSeries Panel in host<span></span>.libsonnet to fix inconsistency in Line Graphs ([pr#62382](https://github.com/ceph/ceph/pull/62382), Piyush Agarwal)

- squid: mgr/dashboard: Changing SimpleGraphPanel to TimeSeries Panel in osd<span></span>.libsonnet to fix inconsistency in Line Graphs ([pr#62383](https://github.com/ceph/ceph/pull/62383), Piyush Agarwal)

- squid: mgr/dashboard: Changing SimpleGraphPanel to TimeSeries Panel in pool<span></span>.libsonnet to fix inconsistency in Line Graphs ([pr#62384](https://github.com/ceph/ceph/pull/62384), Piyush Agarwal)

- squid: mgr/dashboard: critical confirmation modal changes ([pr#61961](https://github.com/ceph/ceph/pull/61961), Naman Munet)

- squid: mgr/dashboard: deprecate transifex-i18ntool and support transifex cli ([pr#63287](https://github.com/ceph/ceph/pull/63287), John Mulligan, Afreen Misbah)

- squid: mgr/dashboard: disable deleting bucket with objects ([pr#61972](https://github.com/ceph/ceph/pull/61972), Naman Munet)

- squid: mgr/dashboard: enable ha by default on subsystem POST API ([pr#62623](https://github.com/ceph/ceph/pull/62623), Nizamudeen A)

- squid: mgr/dashboard: Fix empty ceph version in GET api/hosts ([pr#62731](https://github.com/ceph/ceph/pull/62731), Afreen Misbah)

- squid: mgr/dashboard: fix image filter's query on rbd-details grafana panel ([pr#62531](https://github.com/ceph/ceph/pull/62531), Aashish Sharma)

- squid: mgr/dashboard: Fix Latency chart data units in rgw overview page ([pr#61238](https://github.com/ceph/ceph/pull/61238), Aashish Sharma)

- squid: mgr/dashboard: fix make check tests ([pr#63187](https://github.com/ceph/ceph/pull/63187), John Mulligan, Afreen Misbah)

- Squid: mgr/dashboard: fix multisite e2e failures ([pr#61189](https://github.com/ceph/ceph/pull/61189), Naman Munet)

- squid: mgr/dashboard: fix total objects/Avg object size in RGW Overview Page ([pr#61457](https://github.com/ceph/ceph/pull/61457), Aashish Sharma)

- squid: mgr/dashboard: Fix variable capitalization in embedded rbd-details panel ([pr#62208](https://github.com/ceph/ceph/pull/62208), Juan Ferrer Toribio)

- squid: mgr/dashboard: namespace update route robustness ([pr#61999](https://github.com/ceph/ceph/pull/61999), Tomer Haskalovitch)

- squid: mgr/dashboard: pin lxml to fix run-dashboard-tox-make-check failure ([pr#62257](https://github.com/ceph/ceph/pull/62257), Nizamudeen A)

- squid: mgr/dashboard: Update and correct zonegroup delete notification ([pr#61235](https://github.com/ceph/ceph/pull/61235), Aashish Sharma)

- squid: mgr/dashboard: upgrading nvmeof doesn't update configuration ([pr#62628](https://github.com/ceph/ceph/pull/62628), Nizamudeen A)

- squid: mgr/dashboard: When configuring the RGW Multisite endpoints from the UI allow FQDN(Not only IP) ([pr#62353](https://github.com/ceph/ceph/pull/62353), Aashish Sharma)

- squid: mgr/nfs: Don't crash ceph-mgr if NFS clusters are unavailable ([pr#58285](https://github.com/ceph/ceph/pull/58285), Anoop C S, Ponnuvel Palaniyappan)

- squid: mgr/rbd\_support: always parse interval and start\_time in Schedules::remove() ([pr#62965](https://github.com/ceph/ceph/pull/62965), Ilya Dryomov)

- squid: mgr/vol : shortening the name of helper method ([pr#60396](https://github.com/ceph/ceph/pull/60396), Neeraj Pratap Singh)

- squid: mgr: add status command ([pr#62504](https://github.com/ceph/ceph/pull/62504), Patrick Donnelly)

- squid: mgr: allow disabling always-on modules ([pr#60562](https://github.com/ceph/ceph/pull/60562), Rishabh Dave)

- squid: mgr: fix subuser creation via dashboard ([pr#62086](https://github.com/ceph/ceph/pull/62086), Hannes Baum)

- squid: mgr: process map before notifying clients ([pr#57064](https://github.com/ceph/ceph/pull/57064), Patrick Donnelly)

- squid: mon [stretch mode]: support disable\_stretch\_mode ([pr#60629](https://github.com/ceph/ceph/pull/60629), Kamoltat Sirivadhna)

- squid: mon, osd: add command to remove invalid pg-upmap-primary entries ([pr#62421](https://github.com/ceph/ceph/pull/62421), Laura Flores)

- squid: mon/AuthMonitor: provide command to rotate the key for a user credential ([pr#58235](https://github.com/ceph/ceph/pull/58235), Patrick Donnelly)

- squid: mon/LogMonitor: Use generic cluster log level config ([pr#61069](https://github.com/ceph/ceph/pull/61069), Prashant D)

- squid: mon/OSDMonitor: relax cap enforcement for unmanaged snapshots ([pr#61603](https://github.com/ceph/ceph/pull/61603), Ilya Dryomov)

- squid: mon/scrub: log error details of store access failures ([pr#61346](https://github.com/ceph/ceph/pull/61346), Yite Gu)

- squid: mon/test\_mon\_osdmap\_prune: Use first\_pinned instead of first\_committed ([pr#63341](https://github.com/ceph/ceph/pull/63341), Aishwarya Mathuria)

- squid: mon: fix `fs set down` to adjust max\_mds only when cluster is not down ([pr#59704](https://github.com/ceph/ceph/pull/59704), chungfengz)

- squid: monitoring: Fix OSDs panel in host-details grafana dashboard ([pr#62625](https://github.com/ceph/ceph/pull/62625), Aashish Sharnma)

- squid: node-proxy: address `ceph orch hardware status` cmd ([pr#63787](https://github.com/ceph/ceph/pull/63787), Guillaume Abrioux)

- squid: os, osd: bring the lightweight OMAP iteration ([pr#61363](https://github.com/ceph/ceph/pull/61363), Radoslaw Zarzynski)

- squid: os/bluestore/ceph-bluestore-tool: Modify show-label for many devs ([pr#60543](https://github.com/ceph/ceph/pull/60543), Adam Kupczyk)

- squid: os/bluestore: Add health warning for bluestore fragmentation ([pr#61910](https://github.com/ceph/ceph/pull/61910), Adam Kupczyk)

- squid: os/bluestore: allow use BtreeAllocator ([pr#59497](https://github.com/ceph/ceph/pull/59497), tan changzhi)

- squid: os/bluestore: Create additional bdev labels when expanding block device ([pr#61671](https://github.com/ceph/ceph/pull/61671), Adam Kupczyk)

- squid: os/bluestore: do cache locally compressor engines ever used ([pr#62143](https://github.com/ceph/ceph/pull/62143), Igor Fedotov, Adam Kupczyk)

- squid: os/bluestore: fix bdev expansion and more ([pr#62202](https://github.com/ceph/ceph/pull/62202), Igor Fedotov)

- squid: os/bluestore: Fix BlueRocksEnv attempts to use POSIX ([pr#61111](https://github.com/ceph/ceph/pull/61111), Adam Kupczyk)

- squid: os/bluestore: Fix ExtentDecoderPartial::\_consume\_new\_blob ([pr#62053](https://github.com/ceph/ceph/pull/62053), Adam Kupczyk)

- squid: os/bluestore: Fix race in BlueFS truncate / remove ([pr#62839](https://github.com/ceph/ceph/pull/62839), Adam Kupczyk)

- squid: os/bluestore: fix the problem that \_estimate\_log\_size\_N calculates the log size incorrectly ([pr#61891](https://github.com/ceph/ceph/pull/61891), Wang Linke)

- squid: os/bluestore: Make truncate() drop unused allocations ([pr#60240](https://github.com/ceph/ceph/pull/60240), Adam Kupczyk, Igor Fedotov)

- squid: os/bluestore: use block size (4K) as minimal allocation unit for dedicated DB/WAL volumes ([pr#62514](https://github.com/ceph/ceph/pull/62514), Igor Fedotov)

- squid: os: remove unused btrfs\_ioctl<span></span>.h and tests ([pr#60613](https://github.com/ceph/ceph/pull/60613), Casey Bodley)

- squid: osd/scheduler/OpSchedulerItem: Fix calculation of recovery latency counters ([pr#62802](https://github.com/ceph/ceph/pull/62802), Sridhar Seshasayee)

- squid: osd/scrub: additional configuration parameters to trigger scrub reschedule ([pr#62956](https://github.com/ceph/ceph/pull/62956), Ronen Friedman)

- squid: osd/scrub: always round up reported scrub duration ([pr#62995](https://github.com/ceph/ceph/pull/62995), Ronen Friedman)

- squid: osd/scrub: clarify that osd\_scrub\_auto\_repair\_num\_errors counts objects ([pr#64073](https://github.com/ceph/ceph/pull/64073), Ronen Friedman)

- squid: osd/scrub: discard repair\_oinfo\_oid() ([pr#61935](https://github.com/ceph/ceph/pull/61935), Ronen Friedman)

- squid: osd/scrub: register for 'osd\_max\_scrubs' config changes ([pr#61185](https://github.com/ceph/ceph/pull/61185), Ronen Friedman)

- squid: osd: fix for segmentation fault on OSD fast shutdown ([pr#57613](https://github.com/ceph/ceph/pull/57613), Md Mahamudur Rahaman Sajib)

- squid: osd: fix osd mclock queue item leak ([pr#62363](https://github.com/ceph/ceph/pull/62363), Samuel Just)

- squid: osd: full-object read CRC mismatch due to 'truncate' modifying oi<span></span>.size w/o clearing 'data\_digest' ([pr#57586](https://github.com/ceph/ceph/pull/57586), Samuel Just, Nitzan Mordechai, Matan Breizman, jiawd)

- squid: osd: optimize extent comparison in PrimaryLogPG ([pr#61337](https://github.com/ceph/ceph/pull/61337), Dongdong Tao)

- squid: OSD: Split osd\_recovery\_sleep into settings applied to degraded or clean PGs ([pr#62400](https://github.com/ceph/ceph/pull/62400), Md Mahamudur Rahaman Sajib)

- squid: osd\_types: Restore new\_object marking for delete missing entries ([pr#63154](https://github.com/ceph/ceph/pull/63154), Nitzan Mordechai)

- squid: OSDMonitor: exclude destroyed OSDs from "ceph node ls" output ([pr#62327](https://github.com/ceph/ceph/pull/62327), Nitzan Mordechai)

- squid: PendingReleaseNotes; doc/rados/operations: document "rm-pg-upmap-primary-{all}" commands ([pr#62467](https://github.com/ceph/ceph/pull/62467), Laura Flores)

- squid: PGMap: remove pool max\_avail scale factor ([pr#62437](https://github.com/ceph/ceph/pull/62437), Michael J. Kidd)

- squid: pybind/ceph\_argparse: Fix error message for ceph tell command ([pr#59005](https://github.com/ceph/ceph/pull/59005), Neeraj Pratap Singh)

- squid: pybind/mgr/mgr\_module: turn off all automatic transactions ([pr#61854](https://github.com/ceph/ceph/pull/61854), Patrick Donnelly)

- squid: pybind/mgr: disable sqlite3/python autocommit ([pr#57189](https://github.com/ceph/ceph/pull/57189), Patrick Donnelly)

- squid: python-common: fix mypy errors in earmarking<span></span>.py ([pr#63911](https://github.com/ceph/ceph/pull/63911), John Mulligan, Avan Thakkar)

- squid: qa/mgr/dashboard: fix test race condition ([pr#59698](https://github.com/ceph/ceph/pull/59698), Nizamudeen A, Ernesto Puerta)

- squid: qa/multisite: add extra checkpoints in datalog\_autotrim testcase ([pr#62306](https://github.com/ceph/ceph/pull/62306), Shilpa Jagannath, Adam C. Emerson)

- squid: qa/rados/dashboard: Add PG\_DEGRADED to ignorelist ([pr#61281](https://github.com/ceph/ceph/pull/61281), Aishwarya Mathuria)

- squid: qa/rgw: bump keystone/barbican from 2023<span></span>.1 to 2024<span></span>.1 ([pr#61023](https://github.com/ceph/ceph/pull/61023), Casey Bodley)

- squid: qa/rgw: bump maven version in hadoop task to resolve 404 Not Found ([pr#63928](https://github.com/ceph/ceph/pull/63928), Casey Bodley)

- squid: qa/rgw: configure 'iam root' accounts outside of rgw/verify ([pr#62033](https://github.com/ceph/ceph/pull/62033), Casey Bodley)

- squid: qa/rgw: fix perl tests missing Amazon::S3 module ([pr#64227](https://github.com/ceph/ceph/pull/64227), Mark Kogan, Adam C. Emerson)

- squid: qa/rgw: fix user cleanup in s3tests task ([pr#62365](https://github.com/ceph/ceph/pull/62365), Casey Bodley)

- squid: qa/rgw: run verify tests with garbage collection disabled ([pr#62954](https://github.com/ceph/ceph/pull/62954), Casey Bodley)

- squid: qa/standalone/mon/mon\_cluster\_log<span></span>.sh: retry check for log line ([pr#61475](https://github.com/ceph/ceph/pull/61475), Shraddha Agrawal, Naveen Naidu)

- squid: qa/standalone/scrub: fix osd-scrub-test<span></span>.sh ([pr#62974](https://github.com/ceph/ceph/pull/62974), Ronen Friedman)

- squid: qa/standalone/scrub: fix TEST\_periodic\_scrub\_replicated ([pr#61118](https://github.com/ceph/ceph/pull/61118), Ronen Friedman)

- squid: qa/suites/orch/cephadm: add PG\_DEGRADED to ignorelist ([pr#63054](https://github.com/ceph/ceph/pull/63054), Shraddha Agrawal)

- squid: qa/suites/rados/verify/validater/valgrind: increase op thread timeout ([pr#60912](https://github.com/ceph/ceph/pull/60912), Matan Breizman, Laura Flores)

- squid: qa/suites/upgrade/reef-x: sync log-ignorelist with quincy-x ([pr#61335](https://github.com/ceph/ceph/pull/61335), Ilya Dryomov, Pere Diaz Bou)

- squid: qa/suites/upgrade/{quincy|reef}-x skip TestClsRbd<span></span>.mirror\_snapshot test ([pr#60375](https://github.com/ceph/ceph/pull/60375), Mohit Agrawal)

- squid: qa/suites/upgrade: ignore PG\_AVAILABILITY and MON\_DOWN for quincy-x and reef-x upgrade suites ([pr#59245](https://github.com/ceph/ceph/pull/59245), Laura Flores)

- squid: qa/suites: wait longer before stopping OSDs with valgrind ([pr#63718](https://github.com/ceph/ceph/pull/63718), Nitzan Mordechai)

- squid: qa/tasks/fwd\_scrub: remove unnecessary traceback ([pr#60651](https://github.com/ceph/ceph/pull/60651), Neeraj Pratap Singh)

- squid: qa/tasks: improve ignorelist for thrashing OSDs ([pr#61864](https://github.com/ceph/ceph/pull/61864), Laura Flores)

- squid: qa/tasks: Include stderr on tasks badness check ([pr#61435](https://github.com/ceph/ceph/pull/61435), Christopher Hoffman, Ilya Dryomov)

- squid: qa/tasks: watchdog should terminate thrasher ([pr#59191](https://github.com/ceph/ceph/pull/59191), Nitzan Mordechai)

- squid: qa/workunits/mon: ensure election strategy is "connectivity" for stretch mode ([pr#61496](https://github.com/ceph/ceph/pull/61496), Laura Flores)

- squid: qa/workunits/rbd: wait for resize to be applied in rbd-nbd ([pr#62219](https://github.com/ceph/ceph/pull/62219), Ilya Dryomov)

- squid: qa: Add ignorelist entries for reef-x tests ([pr#60618](https://github.com/ceph/ceph/pull/60618), Brad Hubbard)

- squid: qa: barbican: restrict python packages with upper-constraints ([pr#59327](https://github.com/ceph/ceph/pull/59327), Tobias Urdin)

- squid: qa: failfast mount for better performance and unblock `fs volume ls` ([pr#59919](https://github.com/ceph/ceph/pull/59919), Milind Changire)

- squid: qa: fix test failure test\_cephfs\_mirror\_cancel\_mirroring\_and\_readd ([pr#60181](https://github.com/ceph/ceph/pull/60181), Jos Collin)

- squid: qa: increase the http<span></span>.maxRequestBuffer to 100MB and enable the git debug logs ([pr#60835](https://github.com/ceph/ceph/pull/60835), Xiubo Li)

- squid: qa: restrict 'perf dump' on active mds only ([pr#60975](https://github.com/ceph/ceph/pull/60975), Jos Collin)

- squid: qa: wait for file creation before changing mode ([issue#67408](http://tracker.ceph.com/issues/67408), [pr#59685](https://github.com/ceph/ceph/pull/59685), Venky Shankar)

- squid: rados/test\_crash<span></span>.sh: add PG\_DEGRADED to ignorelist ([pr#62395](https://github.com/ceph/ceph/pull/62395), Shraddha Agrawal)

- squid: radosgw-admin: 'user create' rejects uids matching the account id format ([pr#60980](https://github.com/ceph/ceph/pull/60980), Casey Bodley)

- squid: radosgw-admin: allow 'sync group pipe modify' with existing user ([pr#60979](https://github.com/ceph/ceph/pull/60979), Casey Bodley)

- squid: radosgw-admin: bucket link/unlink support accounts ([pr#60982](https://github.com/ceph/ceph/pull/60982), Casey Bodley)

- squid: radosgw-admin: lower default thread pool size ([pr#62155](https://github.com/ceph/ceph/pull/62155), Casey Bodley)

- squid: rbd-mirror: fix possible recursive lock of ImageReplayer::m\_lock ([pr#62042](https://github.com/ceph/ceph/pull/62042), N Balachandran)

- squid: rbd-mirror: release lock before calling m\_async\_op\_tracker<span></span>.finish\_op() ([pr#64092](https://github.com/ceph/ceph/pull/64092), VinayBhaskar-V)

- squid: rbd: display mirror state creating ([pr#62940](https://github.com/ceph/ceph/pull/62940), N Balachandran)

- squid: rbd: open images in read-only mode for "rbd mirror pool status --verbose" ([pr#61170](https://github.com/ceph/ceph/pull/61170), Ilya Dryomov)

- squid: Revert "rgw/auth: Fix the return code returned by AuthStrategy," ([pr#61162](https://github.com/ceph/ceph/pull/61162), Casey Bodley, Pritha Srivastava)

- squid: rgw-admin: report correct error code for non-existent bucket on deletion ([pr#63405](https://github.com/ceph/ceph/pull/63405), Seena Fallah)

- squid: rgw/abortmp: Race condition on AbortMultipartUpload ([pr#61134](https://github.com/ceph/ceph/pull/61134), Casey Bodley, Artem Vasilev)

- squid: rgw/async/notifications: use common async waiter in pubsub push ([pr#62337](https://github.com/ceph/ceph/pull/62337), Yuval Lifshitz, Casey Bodley)

- squid: rgw/d3n: fix valgrind invalid read during exit ([pr#63438](https://github.com/ceph/ceph/pull/63438), Mark Kogan)

- squid: rgw/iam: add policy evaluation for Arn-based Conditions ([pr#62435](https://github.com/ceph/ceph/pull/62435), Casey Bodley)

- squid: rgw/iam: correcting the caps for OIDC Provider for a user ([pr#62892](https://github.com/ceph/ceph/pull/62892), Pritha Srivastava)

- squid: rgw/lc: delete expired delete-marker when processing Expiration lc action with Days specified ([pr#60783](https://github.com/ceph/ceph/pull/60783), Juan Zhu)

- squid: rgw/lc: make lc worker thread name shorter ([pr#61484](https://github.com/ceph/ceph/pull/61484), lightmelodies)

- squid: rgw/log: Fix crash during shutdown with ops-log enable ([pr#62134](https://github.com/ceph/ceph/pull/62134), kchheda3)

- squid: rgw/multisite: fix forwarded requests for tenanted buckets ([pr#62310](https://github.com/ceph/ceph/pull/62310), Shilpa Jagannath, Adam C. Emerson)

- squid: rgw/multisite: Fix use-after-move in retry logic in logbacking ([pr#61330](https://github.com/ceph/ceph/pull/61330), Adam Emerson)

- squid: rgw/multisite: handle errors properly in RGWDataFullSyncSingleEntryCR() ([pr#62307](https://github.com/ceph/ceph/pull/62307), Shilpa Jagannath, Adam C. Emerson)

- squid: rgw/notification: add rgw notification specific debug log subsystem ([pr#60784](https://github.com/ceph/ceph/pull/60784), Yuval Lifshitz, kchheda3)

- squid: rgw/notification: For kafka include user-id & password as part of the key along with endpoint for connection pooling ([pr#62495](https://github.com/ceph/ceph/pull/62495), kchheda3)

- squid: rgw/notification: Forward Topic & Notification creation request to master when notification\_v2 enabled ([pr#61242](https://github.com/ceph/ceph/pull/61242), kchheda3)

- squid: rgw/posix: std::ignore return value of write() ([pr#61147](https://github.com/ceph/ceph/pull/61147), Casey Bodley)

- squid: rgw/rados: enable object deletion at rados pool quota ([pr#62093](https://github.com/ceph/ceph/pull/62093), Casey Bodley, Samuel Just)

- squid: rgw/rgw\_rest: determine the domain uri prefix by rgw\_transport\_is\_secure ([pr#63363](https://github.com/ceph/ceph/pull/63363), Xuehan Xu)

- squid: rgw/s3-notifications: use user-name/password topic attributes for SASL authentication ([pr#60952](https://github.com/ceph/ceph/pull/60952), Igor Gomon)

- squid: rgw/s3: remove local variable 'uri' that shadows member variable ([pr#62526](https://github.com/ceph/ceph/pull/62526), Casey Bodley)

- squid: rgw/s3select ([pr#62959](https://github.com/ceph/ceph/pull/62959), Gal Salomon, Seena Fallah, J. Eric Ivancich, galsalomon66)

- squid: rgw/sts: correcting authentication in case s3 ops are directed to a primary from secondary after  assumerole ([pr#63065](https://github.com/ceph/ceph/pull/63065), Pritha Srivastava)

- squid: rgw/sts: Implementation of validating JWT using modulus and exponent ([pr#63052](https://github.com/ceph/ceph/pull/63052), Pritha Srivastava)

- squid: rgw/sts: replacing load\_stats with list\_buckets ([pr#62386](https://github.com/ceph/ceph/pull/62386), Pritha Srivastava)

- squid: rgw: /admin/account APIs accept negative values ([pr#62131](https://github.com/ceph/ceph/pull/62131), Casey Bodley)

- squid: rgw: /admin/user api dumps account-related user info ([pr#61430](https://github.com/ceph/ceph/pull/61430), Casey Bodley)

- squid: rgw: add force option to radosgw-admin object rm ([pr#62748](https://github.com/ceph/ceph/pull/62748), J. Eric Ivancich)

- squid: rgw: add missing last\_modified field to swift API ([pr#61546](https://github.com/ceph/ceph/pull/61546), Andrei Ivashchenko)

- squid: rgw: allow management of `accounts` user caps ([pr#61782](https://github.com/ceph/ceph/pull/61782), Richard Poole)

- squid: rgw: allow send bucket notification to multiple brokers of kafka cluster ([pr#61764](https://github.com/ceph/ceph/pull/61764), Hoai-Thu Vuong)

- squid: rgw: append query string to redirect URL if present ([pr#61159](https://github.com/ceph/ceph/pull/61159), Seena Fallah)

- squid: rgw: bucket creation fixes for multi-zonegroup scenario ([pr#62420](https://github.com/ceph/ceph/pull/62420), Seena Fallah, Shilpa Jagannath)

- squid: rgw: Changed discard buffer size ([pr#63710](https://github.com/ceph/ceph/pull/63710), Artem Vasilev)

- squid: rgw: cleanup orphaned bucket entry in <user><span></span>.buckets OMAP ([pr#62741](https://github.com/ceph/ceph/pull/62741), Jane Zhu)

- squid: rgw: Delete stale entries in bucket indexes while deleting obj ([pr#61062](https://github.com/ceph/ceph/pull/61062), Shasha Lu)

- squid: rgw: Deleting an object with null version fix ([pr#62309](https://github.com/ceph/ceph/pull/62309), Shilpa Jagannath, Adam C. Emerson, Kalpesh Pandya)

- squid: rgw: Don't crash on exceptions from pool listing ([pr#61306](https://github.com/ceph/ceph/pull/61306), Adam Emerson)

- squid: rgw: don't use merge\_and\_store\_attrs() when recreating a bucket ([pr#64387](https://github.com/ceph/ceph/pull/64387), Casey Bodley)

- squid: rgw: exclude logging of request payer for 403 requests ([pr#62305](https://github.com/ceph/ceph/pull/62305), Seena Fallah, Adam C. Emerson)

- squid: rgw: Fix a bug in LCOpAction\_Transition::check() ([pr#61532](https://github.com/ceph/ceph/pull/61532), Soumya Koduri)

- squid: rgw: fix bucket link operation ([pr#61051](https://github.com/ceph/ceph/pull/61051), Yehuda Sadeh)

- squid: rgw: fix bug with rgw-gap-list ([pr#62722](https://github.com/ceph/ceph/pull/62722), J. Eric Ivancich, Michael J. Kidd)

- squid: rgw: fix data corruption when rados op return ETIMEDOUT ([pr#61092](https://github.com/ceph/ceph/pull/61092), Shasha Lu)

- squid: rgw: fix to correctly store updated attrs in backend store after erasing an attr/attrs for delete ops on a bucket ([pr#61995](https://github.com/ceph/ceph/pull/61995), Soumya Koduri, Pritha Srivastava, Wei Wang)

- squid: rgw: fixing tempest ObjectTestACLs and ObjectACLsNegativeTest cases ([pr#62586](https://github.com/ceph/ceph/pull/62586), Alexey Odinokov)

- squid: rgw: implement x-amz-replication-status for PENDING & COMPLETED ([pr#60785](https://github.com/ceph/ceph/pull/60785), Alex Wojno, Casey Bodley)

- squid: rgw: keep the tails when copying object to itself ([pr#62711](https://github.com/ceph/ceph/pull/62711), Jane Zhu)

- squid: rgw: prefetch data from versioned object instance head ([pr#63193](https://github.com/ceph/ceph/pull/63193), Jane Zhu)

- squid: rgw: prevent crash in `radosgw-admin bucket object shard <span></span>.<span></span>.<span></span>.` ([pr#62884](https://github.com/ceph/ceph/pull/62884), J. Eric Ivancich)

- squid: rgw: PutObjectLockConfiguration can enable object lock on existing buckets ([pr#62064](https://github.com/ceph/ceph/pull/62064), Casey Bodley)

- squid: rgw: radoslist improvements primarily to better support gap list tool ([pr#62417](https://github.com/ceph/ceph/pull/62417), J. Eric Ivancich)

- squid: rgw: relax RGWPutACLs\_ObjStore::get\_params read data log ([pr#61161](https://github.com/ceph/ceph/pull/61161), Seena Fallah)

- squid: rgw: revert PR #41897 to allow multiple delete markers to be created ([pr#62740](https://github.com/ceph/ceph/pull/62740), Jane Zhu, Juan Zhu)

- squid: rgw: rgw\_init\_ioctx() adds set\_pool\_full\_try() ([pr#62559](https://github.com/ceph/ceph/pull/62559), Casey Bodley)

- squid: rgw: S3 Delete Bucket Policy should return 204 on success ([pr#61431](https://github.com/ceph/ceph/pull/61431), Simon Jürgensmeyer)

- squid: rgw: skip empty check on non-owned buckets by zonegroup ([pr#62994](https://github.com/ceph/ceph/pull/62994), Seena Fallah)

- squid: rgw: sync fairness watcher reconnects on any error ([pr#62356](https://github.com/ceph/ceph/pull/62356), Oguzhan Ozmen, Casey Bodley)

- squid: rgw: Try to handle unwatch errors sensibly ([pr#62402](https://github.com/ceph/ceph/pull/62402), Adam C. Emerson)

- squid: rgw: use object ARN for InitMultipart permissions ([pr#62154](https://github.com/ceph/ceph/pull/62154), Casey Bodley)

- squid: rgw:lua: Skip the healthchecks and system requests from going to backend storage ([pr#62034](https://github.com/ceph/ceph/pull/62034), kchheda3)

- squid: RGW|Bucket Notification: fix for v2 topics rgw-admin list operation ([pr#62534](https://github.com/ceph/ceph/pull/62534), Casey Bodley, Ali Masarwa)

- squid: script/lib-build: Use clang 14 ([pr#61869](https://github.com/ceph/ceph/pull/61869), Matan Breizman)

- squid: src/common : proper handling of units in `strict\_iec\_cast` ([pr#60581](https://github.com/ceph/ceph/pull/60581), Neeraj Pratap Singh)

- squid: src/common: add guidance for deep-scrubbing ratio warning ([pr#62502](https://github.com/ceph/ceph/pull/62502), Zac Dover)

- squid: src/exporter: improve usage message ([pr#61331](https://github.com/ceph/ceph/pull/61331), Anthony D'Atri)

- squid: src/exporter: revert incorrect lines ([pr#61419](https://github.com/ceph/ceph/pull/61419), Zac Dover)

- squid: src/mon/OSDMonitor<span></span>.cc: [Stretch Mode] WRN non-existent CRUSH location assigned to MON ([pr#62039](https://github.com/ceph/ceph/pull/62039), Kamoltat Sirivadhna)

- squid: suites/rados: cache tier deprecated, no need to keep the tests for it ([pr#62211](https://github.com/ceph/ceph/pull/62211), Nitzan Mordechai)

- squid: test/cls\_2pc\_queue: fix multi-threaded access to non-atomic variables ([pr#62311](https://github.com/ceph/ceph/pull/62311), Yuval Lifshitz, Adam C. Emerson)

- squid: test/libcephfs: copy DT\_NEEDED entries from input libraries ([pr#63720](https://github.com/ceph/ceph/pull/63720), batrick)

- squid: test/librbd/test\_notify<span></span>.py: force line-buffered output ([pr#62752](https://github.com/ceph/ceph/pull/62752), Ilya Dryomov)

- squid: test/neorados: timeout test won't reconnect at timeout ([pr#61110](https://github.com/ceph/ceph/pull/61110), Nitzan Mordechai)

- squid: test/pybind: Clean whitespace<span></span>. (Doc and test fixes) ([pr#61377](https://github.com/ceph/ceph/pull/61377), Paulo E. Castro)

- squid: test/rbd\_mirror: clear Namespace::s\_instance at the end of a test ([pr#61960](https://github.com/ceph/ceph/pull/61960), Ilya Dryomov)

- squid: test/rbd\_mirror: flush watch/notify callbacks in TestImageReplayer ([pr#61958](https://github.com/ceph/ceph/pull/61958), Ilya Dryomov)

- squid: test/rgw/multisite: add meta checkpoint after bucket creation ([pr#60978](https://github.com/ceph/ceph/pull/60978), Casey Bodley)

- squid: test/scrub: only instruct clean PGs to scrub ([pr#61088](https://github.com/ceph/ceph/pull/61088), Ronen Friedman)

- squid: test: ceph daemon command with asok path ([pr#61482](https://github.com/ceph/ceph/pull/61482), Nitzan Mordechai)

- squid: test: Create ParallelPGMapper object before start threadpool ([pr#58919](https://github.com/ceph/ceph/pull/58919), Mohit Agrawal)

- squid: test: test\_rados\_tools compare output without trimming newline ([pr#59625](https://github.com/ceph/ceph/pull/59625), Nitzan Mordechai)

- squid: TEST\_backfill\_grow fails after finding "num\_bytes mismatch" in osd log ([pr#60902](https://github.com/ceph/ceph/pull/60902), Mohit Agrawal)

- squid: tool/ceph-bluestore-tool: fix wrong keyword for 'free-fragmentation' command ([pr#62125](https://github.com/ceph/ceph/pull/62125), Igor Fedotov)

- squid: tools/ceph-objectstore-tool: tricks to tolerate disk errors for "pg export" command ([pr#62123](https://github.com/ceph/ceph/pull/62123), Igor Fedotov)

- squid: tools/cephfs-mirror: eliminate redundant ceph\_close() call ([pr#61100](https://github.com/ceph/ceph/pull/61100), Igor Fedotov)

- squid: tools/objectstore: check for wrong coll open\_collection ([pr#60861](https://github.com/ceph/ceph/pull/60861), Pere Diaz Bou)

- squid: tools/objectstore: check for wrong coll open\_collection #58353 ([pr#58732](https://github.com/ceph/ceph/pull/58732), Pere Diaz Bou)

- squid: tools/rados: Fix extra NL in getxattr ([pr#60687](https://github.com/ceph/ceph/pull/60687), Adam Kupczyk)

- squid: win32\_deps\_build<span></span>.sh: pin zlib tag ([pr#61631](https://github.com/ceph/ceph/pull/61631), Lucian Petrut)

- squid: workunit/dencoder: dencoder test forward incompat fix ([pr#61011](https://github.com/ceph/ceph/pull/61011), NitzanMordhai)
