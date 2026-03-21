---
title: "v18.2.8 Reef released"
date: "2026-03-20"
author: "Yuri Weinstein"
tags:
  - "release"
  - "reef"
---
This is the eighth, and expected to be last, backport release in the Reef series. We recommend that all users update to this release.

Release Date
------------

March 20, 2026

Known Issues
------------

* During QA for v18.2.8, it was found that there was a bug for upgrades from
  Pacific to Reef. Pacific OSDs (and other Ceph daemons) were still using a
  deprecated connection feature bit that was adopted to indicate a Reef OSD.
  This can cause a OSD_UPGRADE_FINISHED warning before all OSDs are actually
  upgraded to Reef. There are no known issues associated with Pacific and Reef
  OSDs interoperating where Pacific OSDs are "advertising" Reef compatibility;
  however, out of an abundance of caution, we no longer recommend upgrading
  from Pacific to Reef directly.

Security Fixes
--------------

* CephFS Client: A fix was merged to prohibit unprivileged users from modifying
  the sgid or suid bits on a file. Previously, unprivileged users were
  inadvertently permitted to set these bits if they were the sole bits being
  modified.

* Mgr Alerts: The SMTP SSL context was enforced in the mgr/alerts module to
  resolve a security vulnerability (GHSA-xj9f-7g59-m4jx).


Notable Changes
---------------


* RGW (RADOS Gateway):
  - Fixed an issue where bucket rm --bypass-gc was mistakenly removing head objects instead of tail objects, potentially causing data inconsistencies.
  - Fixed rgw-restore-bucket-index to handle objects with leading hyphens and to process versioned buckets correctly.
  - Addressed an issue in the msg/async protocol that caused memory locks and hangs during connection shutdown.
  - RGW STS: Made JWKS URL verification configurable for AWS compliance via the rgw_enable_jwks_url_verification configuration.

* CephFS / MDS:
  - Prevented the MDS from stalling (up to 5 seconds) during rename/stat workloads by forcing the log to nudge for unstable locks after early replies.
  - Fixed cephfs-journal-tool so it no longer incorrectly resets the journal trim position during disaster recovery, which was causing stale journal objects to linger forever in the metadata pool.
  - Fixed a bug where ll_walk incorrectly processed absolute paths as relative paths.
  - Prevented the ceph fs volume create command from accidentally deleting user-created pools if the command aborted during cleanup.
  - MDS Batched Operations: Added a new mds_allow_batched_ops configuration option (default: true) to control whether the MDS can batch lookup or getattr RPCs.
  - CephFS Subvolumes: Added the ceph fs subvolume snapshot getpath command to allow users to retrieve the absolute path of a snapshot of a subvolume.

* BlueStore:
  - Fixed a bug where the bytes_written_slow performance counter incorrectly reported 0 when using aio_write.

## Changelog

- <span></span>.github: Fix RTD build retrigger ([pr#63616](https://github.com/ceph/ceph/pull/63616), David Galloway)

- <rgw> Ensure the ETag format is consistent with AWS S3 API ([pr#62608](https://github.com/ceph/ceph/pull/62608), Casey Bodley, liubingrun)

- [reef] os/bluestore: fix \_extend\_log seq advance ([pr#61653](https://github.com/ceph/ceph/pull/61653), Pere Diaz Bou)

- [reef] RGW backports ([pr#63031](https://github.com/ceph/ceph/pull/63031), Soumya Koduri)

- [reef] rgw/dbstore: Update bucket attrs as part of put\_info() ([pr#64488](https://github.com/ceph/ceph/pull/64488), Soumya Koduri)

- auth: msgr2 can return incorrect allowed\_modes through AuthBadMethodFrame ([pr#65334](https://github.com/ceph/ceph/pull/65334), Miki Patel)

- backport build-with-container patches from main ([pr#65188](https://github.com/ceph/ceph/pull/65188), John Mulligan, Dan Mick, Zack Cerza)

- Backport the hybrid\_btree2 allocator and prereqs ([pr#62539](https://github.com/ceph/ceph/pull/62539), Igor Fedotov, Jrchyang Yu)

- backports variants improvements and Dockerfile<span></span>.build changes ([pr#66012](https://github.com/ceph/ceph/pull/66012), John Mulligan, Zack Cerza)

- blk/kernel: improve DiscardThread life cycle ([pr#65216](https://github.com/ceph/ceph/pull/65216), Igor Fedotov)

- blk/KernelDevice: Introduce a cap on the number of pending discards ([pr#62220](https://github.com/ceph/ceph/pull/62220), Joshua Baergen)

- blk/kerneldevice: notify\_all only required when discard\_drain wait for condition ([pr#62152](https://github.com/ceph/ceph/pull/62152), Yite Gu)

- blk/kerneldevice: some fix for device discard ([pr#62481](https://github.com/ceph/ceph/pull/62481), Igor Fedotov, Yite Gu)

- bluestore/BlueFS: fix bytes\_written\_slow counter with aio\_write ([pr#66353](https://github.com/ceph/ceph/pull/66353), chungfengz)

- build backports ([pr#65066](https://github.com/ceph/ceph/pull/65066), John Mulligan, Zack Cerza)

- build-with-container: add argument groups to organize options ([pr#65630](https://github.com/ceph/ceph/pull/65630), John Mulligan)

- build-with-container: build image variants ([pr#65944](https://github.com/ceph/ceph/pull/65944), John Mulligan)

- build-with-container: two small fixes ([pr#62339](https://github.com/ceph/ceph/pull/62339), John Mulligan)

- ceph-fuse: Improve fuse mount usage message ([pr#61275](https://github.com/ceph/ceph/pull/61275), Kotresh HR)

- ceph-volume: allow zapping partitions on multipath devices ([pr#62178](https://github.com/ceph/ceph/pull/62178), Guillaume Abrioux)

- ceph-volume: do not convert LVs's symlink to real path ([pr#59989](https://github.com/ceph/ceph/pull/59989), Guillaume Abrioux)

- ceph-volume: fix regex usage in `set\_dmcrypt\_no\_workqueue` ([pr#62791](https://github.com/ceph/ceph/pull/62791), Guillaume Abrioux)

- ceph<span></span>.spec<span></span>.in: add man/rgw-gap-list ([pr#63999](https://github.com/ceph/ceph/pull/63999), Matan Breizman)

- ceph<span></span>.spec<span></span>.in: Remove rgw-restore-bucket-index<span></span>.8\* from packaging ([pr#64130](https://github.com/ceph/ceph/pull/64130), Kefu Chai)

- cephfs,mon: fs rename must require FS to be offline and refuse\_client\_session to be set ([issue#66088](http://tracker.ceph.com/issues/66088), [pr#61410](https://github.com/ceph/ceph/pull/61410), Rishabh Dave, Venky Shankar)

- cephfs-journal-tool: fix segfault during 'journal import' from invalid dump file ([pr#62114](https://github.com/ceph/ceph/pull/62114), Jos Collin)

- cephfs-journal-tool: Journal trimming issue ([pr#65603](https://github.com/ceph/ceph/pull/65603), Kotresh HR)

- cephfs-shell: add option to remove xattr ([pr#62409](https://github.com/ceph/ceph/pull/62409), Neeraj Pratap Singh)

- cephfs-top, qa: Remove unnecessary global statements in tests ([pr#62606](https://github.com/ceph/ceph/pull/62606), Kefu Chai)

- cephfs-top: exception when terminal size greater than PAD\_WIDTH ([pr#61773](https://github.com/ceph/ceph/pull/61773), Jos Collin)

- cephfs: session tracker accounts for killing sessions ([pr#65253](https://github.com/ceph/ceph/pull/65253), Abhishek Lekshmanan)

- client: fix d\_reclen for readdir ([pr#61519](https://github.com/ceph/ceph/pull/61519), Xavi Hernandez)

- client: fixed a bug that read operation hung ([pr#60695](https://github.com/ceph/ceph/pull/60695), Tod Chen)

- client: Handle empty pathnames for `ceph\_chownat()` and `ceph\_statxat()` ([pr#61165](https://github.com/ceph/ceph/pull/61165), Anoop C S)

- client: ll\_walk will process absolute paths as relative ([pr#62500](https://github.com/ceph/ceph/pull/62500), Patrick Donnelly)

- client: prohibit unprivileged users from setting sgid/suid bits ([pr#66040](https://github.com/ceph/ceph/pull/66040), Kefu Chai)

- client: return EOPNOTSUPP for fallocate with mode 0 ([pr#60657](https://github.com/ceph/ceph/pull/60657), Milind Changire)

- cls/rbd: write image mirror status if state is CREATING ([pr#63236](https://github.com/ceph/ceph/pull/63236), N Balachandran)

- cls/rgw: non-versioned listings skip past version suffix ([pr#62591](https://github.com/ceph/ceph/pull/62591), Casey Bodley)

- common/options: fix the description of osd\_max\_scrubs ([pr#62378](https://github.com/ceph/ceph/pull/62378), Satoru Takeuchi)

- common/options: fix typo in description ([pr#64218](https://github.com/ceph/ceph/pull/64218), Lorenz Bausch)

- common/pick\_address: Add IPv6 support to is\_addr\_in\_subnet ([pr#62814](https://github.com/ceph/ceph/pull/62814), Nitzan Mordechai)

- container: small container image improvements ([pr#62345](https://github.com/ceph/ceph/pull/62345), John Mulligan)

- crush: use std::vector instead of variable length arrays ([pr#62014](https://github.com/ceph/ceph/pull/62014), Kefu Chai)

- debian/control: add iproute2 to build dependencies ([pr#66738](https://github.com/ceph/ceph/pull/66738), Kefu Chai)

- debian: package mgr/rgw in ceph-mgr-modules-core ([pr#57874](https://github.com/ceph/ceph/pull/57874), Kefu Chai)

- doc/architecture: remove sentence ([pr#61615](https://github.com/ceph/ceph/pull/61615), Zac Dover)

- doc/cephadm/services: Add mention of --zap for OSD removal ([pr#62444](https://github.com/ceph/ceph/pull/62444), Anthony D'Atri)

- doc/cephadm/services: Correct indentation in osd<span></span>.rst ([pr#62428](https://github.com/ceph/ceph/pull/62428), Anthony D'Atri)

- doc/cephadm/services: Fix formatting in osd<span></span>.rst ([pr#62811](https://github.com/ceph/ceph/pull/62811), Anthony D'Atri)

- doc/cephadm/services: improve rgw<span></span>.rst and snmp-gateway<span></span>.rst ([pr#62695](https://github.com/ceph/ceph/pull/62695), Anthony D'Atri)

- doc/cephadm: Add admonition re restarting an OSD service ([pr#62797](https://github.com/ceph/ceph/pull/62797), Anthony D'Atri)

- doc/cephadm: Add PG autoscaler advice to upgrade<span></span>.rst ([pr#62380](https://github.com/ceph/ceph/pull/62380), Anthony D'Atri)

- doc/cephadm: clarify "Monitoring OSD State" ([pr#61665](https://github.com/ceph/ceph/pull/61665), Zac Dover)

- doc/cephadm: Correct formatting in upgrade<span></span>.rst ([pr#63148](https://github.com/ceph/ceph/pull/63148), Anthony D'Atri)

- doc/cephadm: correct markup in rgw<span></span>.rst ([pr#63074](https://github.com/ceph/ceph/pull/63074), Zac Dover)

- doc/cephadm: improve "Maintenance Mode" ([pr#63496](https://github.com/ceph/ceph/pull/63496), Zac Dover)

- doc/cephadm: s/confg/config/ ([pr#62645](https://github.com/ceph/ceph/pull/62645), Zac Dover)

- doc/cephfs: add a note about estimated replay completion time ([issue#71629](http://tracker.ceph.com/issues/71629), [pr#65058](https://github.com/ceph/ceph/pull/65058), Venky Shankar, Zac Dover)

- doc/cephfs: correct ill-formatted command ([pr#63502](https://github.com/ceph/ceph/pull/63502), Zac Dover)

- doc/cephfs: correct reference structure in fs-volumes<span></span>.rst ([pr#63545](https://github.com/ceph/ceph/pull/63545), Zac Dover)

- doc/cephfs: Cosmetic changes and small fixes in cephfs-mirroring<span></span>.rst ([pr#63468](https://github.com/ceph/ceph/pull/63468), Ville Ojamo)

- doc/cephfs: document first-damage<span></span>.py ([pr#63978](https://github.com/ceph/ceph/pull/63978), Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (1 of x) ([pr#64736](https://github.com/ceph/ceph/pull/64736), Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (2 of x) ([pr#64760](https://github.com/ceph/ceph/pull/64760), Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (3 of x) ([pr#64786](https://github.com/ceph/ceph/pull/64786), Zac Dover)

- doc/cephfs: edit disaster-recovery<span></span>.rst ([pr#64645](https://github.com/ceph/ceph/pull/64645), Zac Dover)

- doc/cephfs: edit disaster-recovery<span></span>.rst ([pr#64609](https://github.com/ceph/ceph/pull/64609), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65380](https://github.com/ceph/ceph/pull/65380), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65094](https://github.com/ceph/ceph/pull/65094), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65091](https://github.com/ceph/ceph/pull/65091), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65126](https://github.com/ceph/ceph/pull/65126), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65123](https://github.com/ceph/ceph/pull/65123), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65097](https://github.com/ceph/ceph/pull/65097), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65078](https://github.com/ceph/ceph/pull/65078), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65088](https://github.com/ceph/ceph/pull/65088), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65047](https://github.com/ceph/ceph/pull/65047), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65044](https://github.com/ceph/ceph/pull/65044), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65041](https://github.com/ceph/ceph/pull/65041), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65037](https://github.com/ceph/ceph/pull/65037), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65026](https://github.com/ceph/ceph/pull/65026), Zac Dover, Venky Shankar)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64904](https://github.com/ceph/ceph/pull/64904), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64901](https://github.com/ceph/ceph/pull/64901), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64879](https://github.com/ceph/ceph/pull/64879), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64872](https://github.com/ceph/ceph/pull/64872), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64853](https://github.com/ceph/ceph/pull/64853), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst (Slow MDS) ([pr#65201](https://github.com/ceph/ceph/pull/65201), Zac Dover)

- doc/cephfs: Improve mount-using-fuse<span></span>.rst ([pr#64473](https://github.com/ceph/ceph/pull/64473), Anthony D'Atri)

- doc/cephfs: link section for pausing async threads in section for ([pr#62875](https://github.com/ceph/ceph/pull/62875), Rishabh Dave)

- doc/cephfs: Update deprecation notice in experimental-features<span></span>.rst ([pr#63949](https://github.com/ceph/ceph/pull/63949), Ville Ojamo)

- doc/cephfs: Update quota<span></span>.rst ([pr#65083](https://github.com/ceph/ceph/pull/65083), Jannis Speer, Zac Dover)

- doc/dev/cephfs-mirroring: edit file 1 of x ([pr#63299](https://github.com/ceph/ceph/pull/63299), Zac Dover)

- doc/dev/cephfs-mirroring: edit file 2 of x ([pr#63274](https://github.com/ceph/ceph/pull/63274), Zac Dover)

- doc/dev/cephfs-mirroring: edit file 3 of x ([pr#63548](https://github.com/ceph/ceph/pull/63548), Zac Dover)

- doc/dev/cephfs-mirroring: edit file 4 of x ([pr#63661](https://github.com/ceph/ceph/pull/63661), Zac Dover)

- doc/dev/config: Document how to use :confval: directive for config op… ([pr#64167](https://github.com/ceph/ceph/pull/64167), Kefu Chai)

- doc/dev/release-process<span></span>.rst: document new Jenkins job for containers ([pr#62613](https://github.com/ceph/ceph/pull/62613), Dan Mick)

- doc/dev/release-process<span></span>.rst: release builds cannot build containers ([pr#61818](https://github.com/ceph/ceph/pull/61818), Dan Mick, Zac Dover)

- doc/dev: Debuggging with gdb ([pr#63994](https://github.com/ceph/ceph/pull/63994), Matan Breizman)

- doc/dev: update link to backporter manual ([pr#63991](https://github.com/ceph/ceph/pull/63991), Zac Dover)

- doc/dev:update blkin<span></span>.rst doc for lttng trace ([pr#65212](https://github.com/ceph/ceph/pull/65212), lizhipeng)

- doc/glossary: s/OMAP/omap/ ([pr#63738](https://github.com/ceph/ceph/pull/63738), Zac Dover)

- doc/man/8: Improve mount<span></span>.ceph<span></span>.rst ([pr#65184](https://github.com/ceph/ceph/pull/65184), Anthony D'Atri)

- doc/mgr/ceph\_api: edit index<span></span>.rst ([pr#63198](https://github.com/ceph/ceph/pull/63198), Zac Dover)

- doc/mgr/crash<span></span>.rst: remove outdated module enabling instructions ([pr#64285](https://github.com/ceph/ceph/pull/64285), Kefu Chai)

- doc/mgr/dashboard\_plugins: edit feature\_toggles<span></span>.inc<span></span>.rst ([pr#63705](https://github.com/ceph/ceph/pull/63705), Zac Dover)

- doc/mgr: edit administrator<span></span>.rst ([pr#63208](https://github.com/ceph/ceph/pull/63208), Zac Dover)

- doc/mgr: edit alerts<span></span>.rst ([pr#63201](https://github.com/ceph/ceph/pull/63201), Zac Dover)

- doc/mgr: edit cli\_api ([pr#63744](https://github.com/ceph/ceph/pull/63744), Zac Dover)

- doc/mgr: edit cli\_api<span></span>.rst ([pr#63690](https://github.com/ceph/ceph/pull/63690), Zac Dover)

- doc/mgr: edit crash<span></span>.rst ([pr#63539](https://github.com/ceph/ceph/pull/63539), Zac Dover)

- doc/mgr: edit dashboard<span></span>.rst ([pr#63316](https://github.com/ceph/ceph/pull/63316), Zac Dover)

- doc/mgr: edit debug<span></span>.inc<span></span>.rst ([pr#63394](https://github.com/ceph/ceph/pull/63394), Zac Dover)

- doc/mgr: edit diskpredictor<span></span>.rst ([pr#63424](https://github.com/ceph/ceph/pull/63424), Zac Dover)

- doc/mgr: edit feature\_toggles<span></span>.inc<span></span>.rst ([pr#63397](https://github.com/ceph/ceph/pull/63397), Zac Dover)

- doc/mgr: edit hello<span></span>.rst ([pr#63508](https://github.com/ceph/ceph/pull/63508), Zac Dover)

- doc/mgr: edit influx<span></span>.rst ([pr#63455](https://github.com/ceph/ceph/pull/63455), Zac Dover)

- doc/mgr: edit insights<span></span>.rst ([pr#63511](https://github.com/ceph/ceph/pull/63511), Zac Dover)

- doc/mgr: edit iostat<span></span>.rst ([pr#63681](https://github.com/ceph/ceph/pull/63681), Zac Dover)

- doc/mgr: edit iostat<span></span>.rst ([pr#63514](https://github.com/ceph/ceph/pull/63514), Zac Dover)

- doc/mgr: edit localpool<span></span>.rst ([pr#63670](https://github.com/ceph/ceph/pull/63670), Zac Dover)

- doc/mgr: edit localpool<span></span>.rst ([pr#63551](https://github.com/ceph/ceph/pull/63551), Zac Dover)

- doc/mgr: edit mds\_autoscaler<span></span>.rst ([pr#63493](https://github.com/ceph/ceph/pull/63493), Zac Dover)

- doc/mgr: edit modules<span></span>.rst ([pr#63667](https://github.com/ceph/ceph/pull/63667), Zac Dover)

- doc/mgr: edit modules<span></span>.rst ([pr#63578](https://github.com/ceph/ceph/pull/63578), Zac Dover)

- doc/mgr: edit motd<span></span>.inc<span></span>.rst ([pr#63403](https://github.com/ceph/ceph/pull/63403), Zac Dover)

- doc/mgr: edit nfs<span></span>.rst ([pr#63664](https://github.com/ceph/ceph/pull/63664), Zac Dover)

- doc/mgr: edit nfs<span></span>.rst ([pr#63581](https://github.com/ceph/ceph/pull/63581), Zac Dover)

- doc/mgr: edit orchestrator<span></span>.rst ([pr#63584](https://github.com/ceph/ceph/pull/63584), Zac Dover)

- doc/mgr: edit progress<span></span>.rst ([pr#63658](https://github.com/ceph/ceph/pull/63658), Zac Dover)

- doc/mgr: edit progress<span></span>.rst ([pr#63587](https://github.com/ceph/ceph/pull/63587), Zac Dover)

- doc/mgr: edit prometheus<span></span>.rst ([pr#63590](https://github.com/ceph/ceph/pull/63590), Zac Dover)

- doc/mgr: edit rgw<span></span>.rst ([pr#63593](https://github.com/ceph/ceph/pull/63593), Zac Dover)

- doc/mgr: edit telegraf<span></span>.rst ([pr#63612](https://github.com/ceph/ceph/pull/63612), Zac Dover)

- doc/mgr: edit telemetry (1 of x) ([pr#63769](https://github.com/ceph/ceph/pull/63769), Zac Dover)

- doc/mgr: edit telemetry (2 of x) ([pr#63772](https://github.com/ceph/ceph/pull/63772), Zac Dover)

- doc/mgr: edit telemetry (3 of x) ([pr#63775](https://github.com/ceph/ceph/pull/63775), Zac Dover)

- doc/mgr: edit telemetry (4 of x) ([pr#63778](https://github.com/ceph/ceph/pull/63778), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#64344](https://github.com/ceph/ceph/pull/64344), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63810](https://github.com/ceph/ceph/pull/63810), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63906](https://github.com/ceph/ceph/pull/63906), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63865](https://github.com/ceph/ceph/pull/63865), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63693](https://github.com/ceph/ceph/pull/63693), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst (lines 300-400) ([pr#63868](https://github.com/ceph/ceph/pull/63868), Zac Dover)

- doc/mgr: Improve prometheus<span></span>.rst ([pr#62931](https://github.com/ceph/ceph/pull/62931), Zac Dover, Anthony D'Atri)

- doc/mgr: Small improvements in rgw<span></span>.rst ([pr#63626](https://github.com/ceph/ceph/pull/63626), Ville Ojamo)

- doc/monitoring: correct list formatting ([pr#63542](https://github.com/ceph/ceph/pull/63542), Zac Dover)

- doc/rados/configuration/bluestore-config-ref: Fix lowcase typo ([pr#62261](https://github.com/ceph/ceph/pull/62261), Adam Kupczyk)

- doc/rados/configuration/bluestore-config-ref: Fix lowercase typos ([pr#62291](https://github.com/ceph/ceph/pull/62291), Dan van der Ster)

- doc/rados/configuration: Correct admonition in ceph-conf<span></span>.rst ([pr#62621](https://github.com/ceph/ceph/pull/62621), Anthony D'Atri)

- doc/rados/configuration: Improve ceph-conf<span></span>.rst ([pr#63943](https://github.com/ceph/ceph/pull/63943), Anthony D'Atri)

- doc/rados/configuration: Mention show-with-defaults and ceph-conf ([pr#65207](https://github.com/ceph/ceph/pull/65207), Niklas Hambüchen)

- doc/rados/configuration: Small improvements in ceph-conf<span></span>.rst ([pr#64288](https://github.com/ceph/ceph/pull/64288), Ville Ojamo)

- doc/rados/operations/stretch-mode: Improve doc ([pr#61654](https://github.com/ceph/ceph/pull/61654), Kamoltat Sirivadhna)

- doc/rados/operations: Actually mention `upmap\_max\_deviation` setting … ([pr#64119](https://github.com/ceph/ceph/pull/64119), Niklas Hambüchen)

- doc/rados/operations: add kernel client procedure to read balancer documentation ([pr#65440](https://github.com/ceph/ceph/pull/65440), Laura Flores)

- doc/rados/operations: Add settings advice to balancer<span></span>.rst ([pr#63536](https://github.com/ceph/ceph/pull/63536), Anthony D'Atri)

- doc/rados/operations: Additional improvements to placement-groups<span></span>.rst ([pr#63650](https://github.com/ceph/ceph/pull/63650), Anthony D'Atri)

- doc/rados/operations: Address suggestions for stretch-mode<span></span>.rst ([pr#63850](https://github.com/ceph/ceph/pull/63850), Zac Dover)

- doc/rados/operations: edit cache-tiering<span></span>.rst ([pr#63696](https://github.com/ceph/ceph/pull/63696), Zac Dover)

- doc/rados/operations: Improve erasure-code<span></span>.rst ([pr#62574](https://github.com/ceph/ceph/pull/62574), Anthony D'Atri)

- doc/rados/operations: Improve health-checks<span></span>.rst ([pr#65239](https://github.com/ceph/ceph/pull/65239), Anthony D'Atri)

- doc/rados/operations: Improve placement-groups<span></span>.rst ([pr#63647](https://github.com/ceph/ceph/pull/63647), Anthony D'Atri)

- doc/rados/operations: Improve stretch-mode<span></span>.rst ([pr#63816](https://github.com/ceph/ceph/pull/63816), Anthony D'Atri)

- doc/rados/ops: add caps restore command ([pr#64322](https://github.com/ceph/ceph/pull/64322), Zac Dover)

- doc/rados/ops: edit cache-tiering<span></span>.rst ([pr#64497](https://github.com/ceph/ceph/pull/64497), Zac Dover)

- doc/rados/ops: edit cache-tiering<span></span>.rst ([pr#63831](https://github.com/ceph/ceph/pull/63831), Zac Dover)

- doc/rados: document section absent in release < T ([pr#64868](https://github.com/ceph/ceph/pull/64868), Zac Dover)

- doc/rados: edit balancer<span></span>.rst ([pr#63684](https://github.com/ceph/ceph/pull/63684), Zac Dover)

- doc/rados: edit ops/user-management<span></span>.rst ([pr#63893](https://github.com/ceph/ceph/pull/63893), Zac Dover)

- doc/rados: enhance "pools<span></span>.rst" ([pr#63862](https://github.com/ceph/ceph/pull/63862), Zac Dover)

- doc/rados: improve markup in cache-tiering<span></span>.rst ([pr#63505](https://github.com/ceph/ceph/pull/63505), Zac Dover)

- doc/rados: remove clonedata command ([pr#64394](https://github.com/ceph/ceph/pull/64394), Zac Dover)

- doc/rados: repair short underline ([pr#65138](https://github.com/ceph/ceph/pull/65138), Zac Dover)

- doc/rados: s/enpty/empty/ in pgcalc doc ([pr#63499](https://github.com/ceph/ceph/pull/63499), Zac Dover)

- doc/rados: Update mClock doc on steps to override OSD IOPS capacity config ([pr#63072](https://github.com/ceph/ceph/pull/63072), Sridhar Seshasayee)

- doc/radosgw /notifications: fix topic details ([pr#62405](https://github.com/ceph/ceph/pull/62405), Laimis Juzeliunas)

- doc/radosgw/admin<span></span>.rst: explain bucket and uid flags for bucket quota ([pr#64022](https://github.com/ceph/ceph/pull/64022), Hyun Jin Kim)

- doc/radosgw/cloud-transition: fix details ([pr#62835](https://github.com/ceph/ceph/pull/62835), Laimis Juzeliunas)

- doc/radosgw/s3: Document delete-if-unmodified-since ([pr#64316](https://github.com/ceph/ceph/pull/64316), Anthony D'Atri)

- doc/radosgw: add "persistent\_topic\_size" ([pr#64140](https://github.com/ceph/ceph/pull/64140), Zac Dover)

- doc/radosgw: add rgw\_enable\_lc\_threads & rgw\_enable\_gc\_threads ([pr#64339](https://github.com/ceph/ceph/pull/64339), Zac Dover)

- doc/radosgw: Cosmetic and formatting improvements in vault<span></span>.rst ([pr#63230](https://github.com/ceph/ceph/pull/63230), Ville Ojamo)

- doc/radosgw: Cosmetic improvements in cloud-transition<span></span>.rst ([pr#63449](https://github.com/ceph/ceph/pull/63449), Ville Ojamo)

- doc/radosgw: Cosmetic improvements in dynamicresharding<span></span>.rst ([pr#64059](https://github.com/ceph/ceph/pull/64059), Ville Ojamo)

- doc/radosgw: edit "Lifecycle Settings" ([pr#64548](https://github.com/ceph/ceph/pull/64548), Zac Dover)

- doc/radosgw: edit cloud-transition (1 of x) ([pr#64025](https://github.com/ceph/ceph/pull/64025), Zac Dover)

- doc/radosgw: edit config-ref<span></span>.rst ([pr#64648](https://github.com/ceph/ceph/pull/64648), Zac Dover)

- doc/radosgw: edit metrics<span></span>.rst ([pr#63813](https://github.com/ceph/ceph/pull/63813), Zac Dover)

- doc/radosgw: edit sentence in metrics<span></span>.rst ([pr#63701](https://github.com/ceph/ceph/pull/63701), Zac Dover)

- doc/radosgw: Fix RST syntax rendeded as text in oidc<span></span>.rst ([pr#62990](https://github.com/ceph/ceph/pull/62990), Ville Ojamo)

- doc/radosgw: improve "pubsub\_push\_pending" info ([pr#64114](https://github.com/ceph/ceph/pull/64114), Zac Dover)

- doc/radosgw: Improve and more consistent formatting ([pr#62910](https://github.com/ceph/ceph/pull/62910), Ville Ojamo)

- doc/radosgw: Improve cloud-restore and cloud-transition ([pr#62667](https://github.com/ceph/ceph/pull/62667), Anthony D'Atri)

- doc/radosgw: Improve formatting in layout<span></span>.rst ([pr#63000](https://github.com/ceph/ceph/pull/63000), Anthony D'Atri)

- doc/radosgw: Improve layout<span></span>.rst ([pr#62450](https://github.com/ceph/ceph/pull/62450), Anthony D'Atri)

- doc/radosgw: Improve rgw-cache<span></span>.rst ([pr#64476](https://github.com/ceph/ceph/pull/64476), Ville Ojamo)

- doc/radosgw: Promptify CLI commands and fix formatting in layout<span></span>.rst ([pr#63916](https://github.com/ceph/ceph/pull/63916), Ville Ojamo)

- doc/radosgw: Promptify CLI, cosmetic fixes ([pr#62857](https://github.com/ceph/ceph/pull/62857), Ville Ojamo)

- doc/radosgw: remove "pubsub\_event\_lost" ([pr#64127](https://github.com/ceph/ceph/pull/64127), Zac Dover)

- doc/radosgw: remove "pubsub\_event\_triggered" ([pr#64156](https://github.com/ceph/ceph/pull/64156), Zac Dover)

- doc/radosgw: remove cloud-restore from reef ([pr#65638](https://github.com/ceph/ceph/pull/65638), Zac Dover)

- doc/radosgw: update aws specification link ([pr#64096](https://github.com/ceph/ceph/pull/64096), Zac Dover)

- doc/radosgw: Use ref for hyperlinking to multisite ([pr#63312](https://github.com/ceph/ceph/pull/63312), Ville Ojamo)

- doc/rbd/rbd-config-ref: add clone settings section ([pr#66173](https://github.com/ceph/ceph/pull/66173), Ilya Dryomov)

- doc/rbd: add mirroring troubleshooting info ([pr#63847](https://github.com/ceph/ceph/pull/63847), Zac Dover)

- doc/rgw: add man documentation for the rgw-gap-list tool ([pr#63997](https://github.com/ceph/ceph/pull/63997), J. Eric Ivancich)

- doc/rgw: clarify path-style vs virtual-hosted-style access ([pr#61987](https://github.com/ceph/ceph/pull/61987), Casey Bodley)

- doc/rgw: document Admin and System Users ([pr#62882](https://github.com/ceph/ceph/pull/62882), Casey Bodley)

- doc/rgw: remove metrics<span></span>.rst which did not apply to reef ([pr#66320](https://github.com/ceph/ceph/pull/66320), Casey Bodley)

- doc/rgw: use 'confval' directive to render sts config options ([pr#63442](https://github.com/ceph/ceph/pull/63442), Casey Bodley)

- doc/src/common/options: mgr<span></span>.yaml<span></span>.in edit ([pr#63765](https://github.com/ceph/ceph/pull/63765), Zac Dover)

- doc/src: edit osd<span></span>.yaml<span></span>.in (osd\_deep\_scrub\_interval\_cv) ([pr#63956](https://github.com/ceph/ceph/pull/63956), Zac Dover)

- doc/start: edit documenting-ceph<span></span>.rst ([pr#63653](https://github.com/ceph/ceph/pull/63653), Zac Dover)

- doc/start: edit documenting-ceph<span></span>.rst ([pr#63708](https://github.com/ceph/ceph/pull/63708), Zac Dover)

- doc: add note admonitions in two files ([pr#64493](https://github.com/ceph/ceph/pull/64493), Zac Dover)

- doc: Clarify the status of MS Windows client support ([pr#64482](https://github.com/ceph/ceph/pull/64482), Anthony D'Atri)

- doc: do not depend on typed-ast ([pr#64400](https://github.com/ceph/ceph/pull/64400), Kefu Chai)

- doc: Document ceph-mgr module configuration options ([pr#64397](https://github.com/ceph/ceph/pull/64397), Kefu Chai)

- doc: fix formatting in cephfs\_mirror dev doc ([pr#63251](https://github.com/ceph/ceph/pull/63251), Jos Collin)

- doc: Fix links to mClock config reference ([pr#64798](https://github.com/ceph/ceph/pull/64798), Pierre Riteau)

- doc: Fix missing blank line Sphinx warnings ([pr#63338](https://github.com/ceph/ceph/pull/63338), Ville Ojamo)

- doc: Fix unterminated inline literal in ceph-conf<span></span>.rst ([pr#64171](https://github.com/ceph/ceph/pull/64171), Kefu Chai)

- doc: Fixed a spelling error ([pr#64148](https://github.com/ceph/ceph/pull/64148), Instelligence.io)

- doc: Fixes a typo in balancer operations ([pr#65740](https://github.com/ceph/ceph/pull/65740), Tyler Brekke)

- doc: mgr/dashboard: add OAuth2 SSO documentation ([pr#64034](https://github.com/ceph/ceph/pull/64034), Pedro Gonzalez Gomez, Zac Dover)

- doc: Pin pip to <25<span></span>.3 for RTD as a workaround for pybind in admin/doc-read-the-docs<span></span>.txt ([pr#66118](https://github.com/ceph/ceph/pull/66118), Ville Ojamo)

- doc: Remove sphinxcontrib-seqdiag Python package from RTD builds ([pr#67528](https://github.com/ceph/ceph/pull/67528), Ville Ojamo)

- doc: Revert "doc/radosgw: add "persistent\_topic\_size"" ([pr#64179](https://github.com/ceph/ceph/pull/64179), Zac Dover)

- doc: Revert "doc: mgr/dashboard: add OAuth2 SSO documentation" ([pr#66796](https://github.com/ceph/ceph/pull/66796), Ville Ojamo)

- doc: Revert doc/cephadm: correct markup in rgw<span></span>.rst ([pr#66971](https://github.com/ceph/ceph/pull/66971), Ville Ojamo)

- doc: src/pybind/mgr/dashboard: edit HACKING<span></span>.rst ([pr#63697](https://github.com/ceph/ceph/pull/63697), Zac Dover)

- doc: update cephfs-journal-tool docs ([pr#63109](https://github.com/ceph/ceph/pull/63109), Jos Collin)

- doc: update mgr modules notify\_types ([pr#64531](https://github.com/ceph/ceph/pull/64531), Nitzan Mordechai)

- fix: the RGW crash caused by special characters ([pr#64052](https://github.com/ceph/ceph/pull/64052), mertsunacoglu, Emin)

- github: pin GH Actions to SHA-1 commit ([pr#65759](https://github.com/ceph/ceph/pull/65759), Ernesto Puerta)

- Handle failures in metric parsing ([pr#65595](https://github.com/ceph/ceph/pull/65595), Anmol Babu)

- install-deps<span></span>.sh: install proper compiler version on Debian/Ubuntu ([pr#66014](https://github.com/ceph/ceph/pull/66014), Dan Mick)

- install-deps: Replace apt-mirror ([pr#66669](https://github.com/ceph/ceph/pull/66669), David Galloway)

- librbd/cache/pwl: fix memory leak in SyncPoint persist context cleanup ([pr#64093](https://github.com/ceph/ceph/pull/64093), Kefu Chai)

- librbd/migration/QCOWFormat: don't complete read\_clusters() inline ([pr#64195](https://github.com/ceph/ceph/pull/64195), Ilya Dryomov)

- librbd: disallow "rbd trash mv" if image is in a group ([pr#62967](https://github.com/ceph/ceph/pull/62967), Ilya Dryomov)

- librbd: images aren't closed in group\_snap\\_\*\_by\_record() on error ([pr#64620](https://github.com/ceph/ceph/pull/64620), Miki Patel)

- librbd: respect rbd\_default\_snapshot\_quiesce\_mode in group\_snap\_create() ([pr#62962](https://github.com/ceph/ceph/pull/62962), Ilya Dryomov)

- LogMonitor: set no\_reply for forward MLog commands ([pr#62212](https://github.com/ceph/ceph/pull/62212), Nitzan Mordechai)

- mds/Beacon: wake up the thread in shutdown() ([pr#61513](https://github.com/ceph/ceph/pull/61513), Max Kellermann)

- mds: add an asok command to dump export states ([pr#61512](https://github.com/ceph/ceph/pull/61512), Zhansong Gao)

- mds: add more debug logs and log events ([pr#61518](https://github.com/ceph/ceph/pull/61518), Xiubo Li)

- mds: do not process client metrics message with fast dispatch ([issue#68865](http://tracker.ceph.com/issues/68865), [pr#61339](https://github.com/ceph/ceph/pull/61339), Venky Shankar)

- mds: drop client metrics during recovery ([pr#61299](https://github.com/ceph/ceph/pull/61299), Patrick Donnelly)

- mds: dump next\_snap when checking dentry corruption ([pr#61978](https://github.com/ceph/ceph/pull/61978), Milind Changire)

- mds: Fix invalid access of mdr->dn[0]<span></span>.back() ([pr#61516](https://github.com/ceph/ceph/pull/61516), Anoop C S)

- mds: Fix invalid access of mdr->dn[0]<span></span>.back() ([pr#61450](https://github.com/ceph/ceph/pull/61450), Anoop C S)

- mds: Fix readdir when osd is full ([pr#65348](https://github.com/ceph/ceph/pull/65348), Kotresh HR)

- mds: fix snapdiff result fragmentation ([pr#65364](https://github.com/ceph/ceph/pull/65364), Igor Fedotov, Md Mahamudur Rahaman Sajib)

- mds: nudge log for unstable locks after early reply ([pr#64540](https://github.com/ceph/ceph/pull/64540), Patrick Donnelly)

- mds: prevent duplicate wrlock acquisition for a single request ([pr#61839](https://github.com/ceph/ceph/pull/61839), Xiubo Li, Sunnatillo)

- mds: session in the importing state cannot be cleared if an export subtree task is interrupted while the state of importer is acking ([pr#61514](https://github.com/ceph/ceph/pull/61514), Zhansong Gao)

- mds: use SimpleLock::WAIT\_ALL for wait mask ([pr#67495](https://github.com/ceph/ceph/pull/67495), Patrick Donnelly)

- memory lock issues causing hangs during connection shutdown ([pr#65786](https://github.com/ceph/ceph/pull/65786), Nitzan Mordechai)

- mgr/alerts: enforce ssl context to SMTP\_SSL ([pr#66142](https://github.com/ceph/ceph/pull/66142), Nizamudeen A)

- mgr/cephadm: Fix unfound progress events ([pr#58450](https://github.com/ceph/ceph/pull/58450), Prashant D)

- mgr/DaemonState: Minimise time we hold the DaemonStateIndex lock ([pr#65463](https://github.com/ceph/ceph/pull/65463), Brad Hubbard)

- mgr/dashboard: adapt service creation form to support nvmeof creation ([pr#63304](https://github.com/ceph/ceph/pull/63304), Afreen Misbah)

- mgr/dashboard: add <span></span>.nvmrc so ci can pick the node version ([pr#64666](https://github.com/ceph/ceph/pull/64666), Nizamudeen A)

- mgr/dashboard: Add ceph\_daemon filter to rgw overview grafana panel queries ([pr#62268](https://github.com/ceph/ceph/pull/62268), Aashish Sharma)

- mgr/dashboard: add prometheus read permission to cluster\_mgr role ([pr#62651](https://github.com/ceph/ceph/pull/62651), Nizamudeen A)

- mgr/dashboard: Dashboard not showing Object/Overview correctly ([pr#62664](https://github.com/ceph/ceph/pull/62664), Aashish Sharma)

- mgr/dashboard: fix access control permissions for roles ([pr#62455](https://github.com/ceph/ceph/pull/62455), Nizamudeen A)

- mgr/dashboard: Fix empty ceph version in GET api/hosts ([pr#62730](https://github.com/ceph/ceph/pull/62730), Afreen Misbah)

- mgr/dashboard: Fix inline markup warning in API documentation ([pr#64270](https://github.com/ceph/ceph/pull/64270), Kefu Chai)

- mgr/dashboard: fix make check tests ([pr#63186](https://github.com/ceph/ceph/pull/63186), Afreen Misbah)

- mgr/dashboard: fix zone update API forcing STANDARD storage class ([pr#65621](https://github.com/ceph/ceph/pull/65621), Aashish Sharma)

- mgr/dashboard: show non default realm sync status in rgw overview page ([pr#65002](https://github.com/ceph/ceph/pull/65002), Aashish Sharma)

- mgr/dashboard: use system packages when running tox ([pr#64612](https://github.com/ceph/ceph/pull/64612), Nizamudeen A)

- mgr/nfs: validate path when modifying cephfs export ([pr#62278](https://github.com/ceph/ceph/pull/62278), Dhairya Parmar)

- mgr/rbd\_support: always parse interval and start\_time in Schedules::remove() ([pr#62964](https://github.com/ceph/ceph/pull/62964), Ilya Dryomov)

- mgr/snap\_schedule: fix typo in error message during retention add ([pr#65295](https://github.com/ceph/ceph/pull/65295), Milind Changire)

- mgr/snap\_schedule: handle volume delete ([pr#61187](https://github.com/ceph/ceph/pull/61187), Milind Changire)

- mgr/vol: add command to get snapshot path ([pr#62917](https://github.com/ceph/ceph/pull/62917), Rishabh Dave)

- mgr/vol: don't delete user-created pool in "volume create" command ([pr#63069](https://github.com/ceph/ceph/pull/63069), Rishabh Dave)

- mgr/vol: print proper message when subvolume metadata filename is too long ([pr#62050](https://github.com/ceph/ceph/pull/62050), Rishabh Dave)

- mgr/volumes: allow disabling async job threads ([pr#62436](https://github.com/ceph/ceph/pull/62436), Rishabh Dave)

- mgr/volumes: fix dangling symlink in clone index ([pr#62109](https://github.com/ceph/ceph/pull/62109), Neeraj Pratap Singh)

- mgr/volumes: Keep mon caps if auth key has remaining mds/osd caps ([pr#65297](https://github.com/ceph/ceph/pull/65297), Enrico Bocchi)

- mgr/volumes: periodically check for async work ([issue#61867](http://tracker.ceph.com/issues/61867), [pr#61230](https://github.com/ceph/ceph/pull/61230), Venky Shankar)

- mgr: add status command ([pr#62505](https://github.com/ceph/ceph/pull/62505), Patrick Donnelly)

- mgr: allow disabling always-on modules ([pr#60563](https://github.com/ceph/ceph/pull/60563), Rishabh Dave)

- mgr: process map before notifying clients ([pr#57065](https://github.com/ceph/ceph/pull/57065), Patrick Donnelly)

- mon [stretch mode]: support disable\_stretch\_mode & qa/workunits/mon: ensure election strategy is "connectivity" for stretch mode ([pr#60630](https://github.com/ceph/ceph/pull/60630), Laura Flores, Kamoltat Sirivadhna)

- mon/AuthMonitor: provide command to rotate the key for a user credential ([pr#58236](https://github.com/ceph/ceph/pull/58236), Patrick Donnelly)

- mon/test\_mon\_osdmap\_prune: Use first\_pinned instead of first\_committed ([pr#63343](https://github.com/ceph/ceph/pull/63343), Aishwarya Mathuria)

- mon: Track and process pending pings after election ([pr#62925](https://github.com/ceph/ceph/pull/62925), Kamoltat Sirivadhna)

- monitor: Enhance historic ops command output and error handling ([pr#64843](https://github.com/ceph/ceph/pull/64843), Nitzan Mordechai)

- monitoring: add user-agent headers to the urllib ([pr#65473](https://github.com/ceph/ceph/pull/65473), Nizamudeen A)

- monitoring: fix MTU Mismatch alert rule and expr ([pr#65710](https://github.com/ceph/ceph/pull/65710), Aashish Sharma)

- objclass: deprecate cls\_cxx\_gather ([pr#60195](https://github.com/ceph/ceph/pull/60195), Nitzan Mordechai)

- os/bluestore: Disable invoking unittest\_deferred ([pr#66359](https://github.com/ceph/ceph/pull/66359), Adam Kupczyk)

- os/bluestore: do cache locally compressor engines ever used ([pr#62145](https://github.com/ceph/ceph/pull/62145), Igor Fedotov, Adam Kupczyk)

- os/bluestore: fix bdev expansion and more ([pr#62216](https://github.com/ceph/ceph/pull/62216), Igor Fedotov)

- os/bluestore: Fix ExtentDecoderPartial::\_consume\_new\_blob ([pr#62054](https://github.com/ceph/ceph/pull/62054), Adam Kupczyk)

- os/bluestore: Fix race in BlueFS truncate / remove ([pr#62840](https://github.com/ceph/ceph/pull/62840), Adam Kupczyk)

- os/bluestore: In BlueFS::truncate accept wierd alloc\_unit ([pr#66056](https://github.com/ceph/ceph/pull/66056), Adam Kupczyk)

- os/bluestore: make BlueFS an exclusive selector for volume reserved ([pr#62721](https://github.com/ceph/ceph/pull/62721), Igor Fedotov)

- osd/scheduler/OpSchedulerItem: Fix calculation of recovery latency counters ([pr#62801](https://github.com/ceph/ceph/pull/62801), Sridhar Seshasayee)

- osd/scrub: allow longer waits for replicas to respond ([pr#63940](https://github.com/ceph/ceph/pull/63940), Ronen Friedman)

- osd/scrub: discard repair\_oinfo\_oid() ([pr#62569](https://github.com/ceph/ceph/pull/62569), Ronen Friedman)

- osd: add clear\_shards\_repaired command ([pr#60566](https://github.com/ceph/ceph/pull/60566), Daniel Radjenovic)

- osd: don't send stale hb msgr's addresses in MOSDBoot ([pr#56520](https://github.com/ceph/ceph/pull/56520), Radosław Zarzyński)

- osd: fix osd mclock queue item leak ([pr#62364](https://github.com/ceph/ceph/pull/62364), Samuel Just)

- OSD: Split osd\_recovery\_sleep into settings applied to degraded or clean PGs ([pr#62399](https://github.com/ceph/ceph/pull/62399), Md Mahamudur Rahaman Sajib)

- osd\_types: Restore new\_object marking for delete missing entries ([pr#63152](https://github.com/ceph/ceph/pull/63152), Nitzan Mordechai)

- OSDMonitor: exclude destroyed OSDs from "ceph node ls" output ([pr#62326](https://github.com/ceph/ceph/pull/62326), Nitzan Mordechai)

- OSDMonitor: Make sure pcm is initialised ([pr#63805](https://github.com/ceph/ceph/pull/63805), Brad Hubbard)

- PendingReleaseNotes; doc/rados/operations: document "rm-pg-upmap-primary-{all}" commands ([pr#62468](https://github.com/ceph/ceph/pull/62468), Laura Flores)

- PGMap: remove pool max\_avail scale factor ([pr#61320](https://github.com/ceph/ceph/pull/61320), Michael J. Kidd)

- pybind/mgr/dashboard: Use teuthology's actual requirements ([pr#65418](https://github.com/ceph/ceph/pull/65418), David Galloway)

- pybind/mgr: attempt to fix mypy importing from python-common ([pr#63313](https://github.com/ceph/ceph/pull/63313), John Mulligan)

- pybind/mgr: Fix missing empty lines in mgr\_module<span></span>.py ([pr#64267](https://github.com/ceph/ceph/pull/64267), Ville Ojamo)

- pybind/mgr: pin cheroot version in requirements-required<span></span>.txt ([pr#65637](https://github.com/ceph/ceph/pull/65637), Nizamudeen A, Adam King)

- qa/cephfs: ignore warning that pg is stuck peering for upgrade jobs ([pr#65448](https://github.com/ceph/ceph/pull/65448), Rishabh Dave)

- qa/cephfs: randomize configs in `fs:thrash:workloads` ([pr#61341](https://github.com/ceph/ceph/pull/61341), Venky Shankar)

- qa/cephfs: switch to ubuntu 22<span></span>.04 for stock kernel testing ([pr#62492](https://github.com/ceph/ceph/pull/62492), Venky Shankar)

- qa/cephfs: update ignorelist ([pr#61383](https://github.com/ceph/ceph/pull/61383), Rishabh Dave)

- qa/multisite: add extra checkpoints in datalog\_autotrim testcase ([pr#61508](https://github.com/ceph/ceph/pull/61508), Shilpa Jagannath)

- qa/rbd/iscsi: ignore MON\_DOWN warning in logs ([pr#64596](https://github.com/ceph/ceph/pull/64596), Adam King)

- qa/rgw: bump maven version in hadoop task to resolve 404 Not Found ([pr#63927](https://github.com/ceph/ceph/pull/63927), Casey Bodley)

- qa/rgw: fix perl tests missing Amazon::S3 module ([pr#64281](https://github.com/ceph/ceph/pull/64281), Mark Kogan)

- qa/rgw: remove hadoop-s3a subsuite ([pr#64669](https://github.com/ceph/ceph/pull/64669), Casey Bodley)

- qa/rgw: run verify tests with garbage collection disabled ([pr#62953](https://github.com/ceph/ceph/pull/62953), Casey Bodley)

- qa/suites/krbd: use a standard fixed-1 cluster in unmap subsuite ([pr#64918](https://github.com/ceph/ceph/pull/64918), Ilya Dryomov)

- qa/suites/orch/cephadm: add PG\_DEGRADED to ignorelist ([pr#63055](https://github.com/ceph/ceph/pull/63055), Shraddha Agrawal)

- qa/suites: wait longer before stopping OSDs with valgrind ([pr#63717](https://github.com/ceph/ceph/pull/63717), Nitzan Mordechai)

- qa/tasks/ceph\_manager: population must be a sequence ([pr#64748](https://github.com/ceph/ceph/pull/64748), Kyr Shatskyy)

- qa/tasks/cephfs/mount: use 'ip route' instead 'route' ([pr#63129](https://github.com/ceph/ceph/pull/63129), Kyr Shatskyy)

- qa/tasks/workunit: fix no module named 'pipes' ([pr#66252](https://github.com/ceph/ceph/pull/66252), Kyr Shatskyy)

- qa/tests: added initial test for `client-upgrade-reef-tentacle` ([pr#64761](https://github.com/ceph/ceph/pull/64761), Yuri Weinstein)

- qa/workunits/fs/misc: remove data pool cleanup ([pr#63017](https://github.com/ceph/ceph/pull/63017), Patrick Donnelly)

- qa: add missing <span></span>.qa links ([pr#67529](https://github.com/ceph/ceph/pull/67529), Patrick Donnelly)

- qa: Disable OSD benchmark from running for tests ([pr#67067](https://github.com/ceph/ceph/pull/67067), Sridhar Seshasayee)

- qa: enable debug mds/client for fs/nfs suite ([issue#63482](http://tracker.ceph.com/issues/63482), [pr#65251](https://github.com/ceph/ceph/pull/65251), Venky Shankar)

- qa: fix multi-fs tests in test\_mds\_metrics<span></span>.py ([pr#64340](https://github.com/ceph/ceph/pull/64340), Jos Collin)

- qa: fix test\_cephfs\_mirror\_stats failure ([pr#62116](https://github.com/ceph/ceph/pull/62116), Jos Collin)

- qa: ignore pg availability/degraded warnings ([pr#61297](https://github.com/ceph/ceph/pull/61297), Patrick Donnelly)

- qa: ignore variant of down fs ([pr#62092](https://github.com/ceph/ceph/pull/62092), Patrick Donnelly)

- qa: increase the http<span></span>.maxRequestBuffer to 100MB and enable the git debug logs ([pr#61279](https://github.com/ceph/ceph/pull/61279), Xiubo Li)

- qa: suppress OpenSSL valgrind leaks ([pr#65663](https://github.com/ceph/ceph/pull/65663), Laura Flores)

- qa: use a larger timeout for kernel\_untar\_build workunit ([issue#68855](http://tracker.ceph.com/issues/68855), [pr#61340](https://github.com/ceph/ceph/pull/61340), Venky Shankar)

- rados/test\_crash<span></span>.sh: add PG\_DEGRADED to ignorelist ([pr#62396](https://github.com/ceph/ceph/pull/62396), Shraddha Agrawal)

- rbd-mirror: add cluster fsid to remote meta cache key ([pr#66272](https://github.com/ceph/ceph/pull/66272), Mykola Golub)

- rbd-mirror: allow incomplete demote snapshot to sync after rbd-mirror daemon restart ([pr#66163](https://github.com/ceph/ceph/pull/66163), VinayBhaskar-V)

- rbd-mirror: prevent image deletion if remote image is not primary ([pr#64738](https://github.com/ceph/ceph/pull/64738), VinayBhaskar-V)

- rbd-mirror: release lock before calling m\_async\_op\_tracker<span></span>.finish\_op() ([pr#64091](https://github.com/ceph/ceph/pull/64091), VinayBhaskar-V)

- rbd: display mirror state creating ([pr#62939](https://github.com/ceph/ceph/pull/62939), N Balachandran)

- Recent pipeline backports ([pr#65250](https://github.com/ceph/ceph/pull/65250), Dan Mick)

- resolve pacific/quincy upgrade failures ([pr#67657](https://github.com/ceph/ceph/pull/67657), Patrick Donnelly)

- rgw/iam: add policy evaluation for Arn-based Conditions ([pr#62434](https://github.com/ceph/ceph/pull/62434), Casey Bodley)

- rgw/rados: enable object deletion at rados pool quota ([pr#62094](https://github.com/ceph/ceph/pull/62094), Casey Bodley, Samuel Just)

- rgw/sts: Implementation of validating JWT using modulus and exponent ([pr#63053](https://github.com/ceph/ceph/pull/63053), Pritha Srivastava)

- rgw:  Try  to handle unwatch errors sensibly ([pr#62403](https://github.com/ceph/ceph/pull/62403), Adam C. Emerson)

- rgw: add force option to `radosgw-admin object rm <span></span>.<span></span>.<span></span>.` ([pr#64311](https://github.com/ceph/ceph/pull/64311), J. Eric Ivancich)

- rgw: add missing last\_modified field to swift API ([pr#61553](https://github.com/ceph/ceph/pull/61553), Andrei Ivashchenko)

- rgw: allow bucket notification send message to kafka with multiple br… ([pr#61825](https://github.com/ceph/ceph/pull/61825), Hoai-Thu Vuong)

- rgw: bring rgw-restore-bucket-index up to current version ([pr#64514](https://github.com/ceph/ceph/pull/64514), J. Eric Ivancich, Michael J. Kidd)

- rgw: Changed discard buffer size ([pr#63711](https://github.com/ceph/ceph/pull/63711), Artem Vasilev)

- rgw: check all JWKS for STS ([pr#64937](https://github.com/ceph/ceph/pull/64937), Alex Wojno)

- rgw: correctly set worker thread names ([pr#63095](https://github.com/ceph/ceph/pull/63095), Milind Changire)

- rgw: don't use merge\_and\_store\_attrs() when recreating a bucket ([pr#64411](https://github.com/ceph/ceph/pull/64411), Casey Bodley)

- rgw: fix 'bucket rm --bypass-gc' for copied objects ([pr#66002](https://github.com/ceph/ceph/pull/66002), Casey Bodley)

- rgw: fix bug with rgw-gap-list ([pr#62723](https://github.com/ceph/ceph/pull/62723), J. Eric Ivancich, Michael J. Kidd)

- rgw: fix empty storage class on display of multipart uploads ([pr#64312](https://github.com/ceph/ceph/pull/64312), J. Eric Ivancich)

- rgw: fix to correctly store updated attrs in backend store after erasing an attr/attrs for delete ops on a bucket ([pr#61996](https://github.com/ceph/ceph/pull/61996), Pritha Srivastava, Wei Wang)

- rgw: Head/GetObject support partNumber ([pr#62544](https://github.com/ceph/ceph/pull/62544), Casey Bodley)

- rgw: keep the tails when copying object to itself ([pr#62656](https://github.com/ceph/ceph/pull/62656), Jane Zhu)

- rgw: make incomplete multipart upload part of bucket check efficient ([pr#64464](https://github.com/ceph/ceph/pull/64464), J. Eric Ivancich)

- rgw: make keystone work without admin token(service ac requirement) ([pr#64200](https://github.com/ceph/ceph/pull/64200), Deepika Upadhyay)

- rgw: make rgw-restore-bucket-index more robust ([pr#64622](https://github.com/ceph/ceph/pull/64622), J. Eric Ivancich)

- rgw: optimize bucket listing to skip past regions of namespaced entries ([pr#62234](https://github.com/ceph/ceph/pull/62234), J. Eric Ivancich)

- rgw: prevent crash in `radosgw-admin bucket object shard <span></span>.<span></span>.<span></span>.` ([pr#62885](https://github.com/ceph/ceph/pull/62885), J. Eric Ivancich)

- rgw: PutObjectLockConfiguration can enable object lock on existing buckets ([pr#62063](https://github.com/ceph/ceph/pull/62063), Casey Bodley)

- rgw: radoslist improvements primarily to better support gap list tool ([pr#62418](https://github.com/ceph/ceph/pull/62418), J. Eric Ivancich)

- rgw: trigger resharding of versioned buckets sooner ([pr#63598](https://github.com/ceph/ceph/pull/63598), J. Eric Ivancich)

- rgw: update keystone repo stable branch to 2024<span></span>.2 ([pr#66243](https://github.com/ceph/ceph/pull/66243), Kyr Shatskyy)

- Rocky 9/10 support backports ([pr#64658](https://github.com/ceph/ceph/pull/64658), Zack Cerza, John Mulligan, David Galloway, Alexander Indenbaum)

- run-make-check<span></span>.sh backports ([pr#65837](https://github.com/ceph/ceph/pull/65837), John Mulligan, luo rixin)

- run-make<span></span>.sh: Typo in argument addition ([pr#66690](https://github.com/ceph/ceph/pull/66690), David Galloway)

- scrub: use a generic interface for scheduling timer based events ([pr#63558](https://github.com/ceph/ceph/pull/63558), Samuel Just, Ronen Friedman)

- src/common/options: Clarify scope of scrub intervals in osd<span></span>.yaml<span></span>.in ([pr#63490](https://github.com/ceph/ceph/pull/63490), Anthony D'Atri)

- src/common: add guidance for deep-scrubbing ratio warning ([pr#62503](https://github.com/ceph/ceph/pull/62503), Zac Dover)

- src/common: add guidance for mon\_warn\_pg\_not\_scrubbed ([pr#62552](https://github.com/ceph/ceph/pull/62552), Zac Dover)

- src/mon/OSDMonitor<span></span>.cc: [Stretch Mode] WRN non-existent CRUSH location assigned to MON ([pr#62040](https://github.com/ceph/ceph/pull/62040), Kamoltat Sirivadhna)

- src: modernize sample<span></span>.ceph<span></span>.conf ([pr#61642](https://github.com/ceph/ceph/pull/61642), Anthony D'Atri)

- suites/rados: cache tier deprecated, no need to keep the tests for it ([pr#62210](https://github.com/ceph/ceph/pull/62210), Nitzan Mordechai)

- sync build-with-container patches from main ([pr#65845](https://github.com/ceph/ceph/pull/65845), John Mulligan, Dan Mick)

- tasks/cephfs/mount: use 192<span></span>.168<span></span>.144<span></span>.0<span></span>.0/20 for brxnet ([pr#63134](https://github.com/ceph/ceph/pull/63134), Kyr Shatskyy)

- test/common: unittest\_fault\_injector omits unit-main target ([pr#63979](https://github.com/ceph/ceph/pull/63979), Casey Bodley)

- test/librbd/test\_notify<span></span>.py: conditionally ignore some errors ([pr#62688](https://github.com/ceph/ceph/pull/62688), Ilya Dryomov)

- test/librbd/test\_notify<span></span>.py: force line-buffered output ([pr#62751](https://github.com/ceph/ceph/pull/62751), Ilya Dryomov)

- test/rbd: remove unit tests about cache tiering ([pr#64588](https://github.com/ceph/ceph/pull/64588), Laura Flores)

- TEST\_backfill\_grow fails after finding "num\_bytes mismatch" in osd log ([pr#60901](https://github.com/ceph/ceph/pull/60901), Mohit Agrawal)

- tools/ceph-objectstore-tool: tricks to tolerate disk errors for "pg export" command ([pr#62122](https://github.com/ceph/ceph/pull/62122), Igor Fedotov)

- Wip trackers 50371 67352 67489 69639 reef ([pr#62473](https://github.com/ceph/ceph/pull/62473), Brad Hubbard, Patrick Donnelly)
