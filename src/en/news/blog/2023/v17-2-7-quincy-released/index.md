---
title: "v17.2.7 Quincy released"
date: "2023-10-30"
author: "Yuri Weinstein"
tags:
  - "release"
  - "quincy"
---

This is the seventh backport release in the Quincy series. We recommend all users update to this release.

## Notable Changes

- `ceph mgr dump` command now displays the name of the mgr module that
  registered a RADOS client in the `name` field added to elements of the
  `active_clients` array. Previously, only the address of a module's RADOS
  client was shown in the `active_clients` array.

- mClock Scheduler: The mClock scheduler (default scheduler in Quincy) has
  undergone significant usability and design improvements to address the slow
  backfill issue. Some important changes are:
  - The 'balanced' profile is set as the default mClock profile because it
    represents a compromise between prioritizing client IO or recovery IO. Users
    can then choose either the 'high_client_ops' profile to prioritize client IO
    or the 'high_recovery_ops' profile to prioritize recovery IO.
  - QoS parameters like reservation and limit are now specified in terms of a
    fraction (range: 0.0 to 1.0) of the OSD's IOPS capacity.
  - The cost parameters (osd_mclock_cost_per_io_usec_* and
    osd_mclock_cost_per_byte_usec_*) have been removed. The cost of an operation
    is now determined using the random IOPS and maximum sequential bandwidth
    capability of the OSD's underlying device.
  - Degraded object recovery is given higher priority when compared to misplaced
    object recovery because degraded objects present a data safety issue not
    present with objects that are merely misplaced. Therefore, backfilling
    operations with the 'balanced' and 'high_client_ops' mClock profiles may
    progress slower than what was seen with the 'WeightedPriorityQueue' (WPQ)
    scheduler.
  - The QoS allocations in all the mClock profiles are optimized based on the above
    fixes and enhancements.
  - For more detailed information see:
    https://docs.ceph.com/en/quincy/rados/configuration/mclock-config-ref/

- RGW: S3 multipart uploads using Server-Side Encryption now replicate correctly in
  multi-site. Previously, the replicas of such objects were corrupted on decryption.
  A new tool, ``radosgw-admin bucket resync encrypted multipart``, can be used to
  identify these original multipart uploads. The ``LastModified`` timestamp of any
  identified object is incremented by 1ns to cause peer zones to replicate it again.
  For multi-site deployments that make any use of Server-Side Encryption, we
  recommended running this command against every bucket in every zone after all
  zones have upgraded.

- CEPHFS: MDS evicts clients which are not advancing their request tids which causes
  a large buildup of session metadata resulting in the MDS going read-only due to
  the RADOS operation exceeding the size threshold. `mds_session_metadata_threshold`
  config controls the maximum size that a (encoded) session metadata can grow.

- CEPHFS: After recovering a Ceph File System post following the disaster recovery
  procedure, the recovered files under `lost+found` directory can now be deleted.

## Changelog


- <span></span>.github: Clarify checklist details ([pr#54131](https://github.com/ceph/ceph/pull/54131), Anthony D'Atri)

- <span></span>.github: Give folks 30 seconds to fill out the checklist ([pr#51944](https://github.com/ceph/ceph/pull/51944), David Galloway)

- [CVE-2023-43040] rgw: Fix bucket validation against POST policies ([pr#53757](https://github.com/ceph/ceph/pull/53757), Joshua Baergen)

- backport commit 70425c7 -- client/fuse: set max\_idle\_threads to the correct value (critical, ceph-fuse with libfuse3 is nearly useless without it) ([pr#50668](https://github.com/ceph/ceph/pull/50668), Zhansong Gao)

- blk/kernel: Add O\_EXCL for block devices ([pr#53566](https://github.com/ceph/ceph/pull/53566), Adam Kupczyk)

- blk/kernel: Fix error code mapping in KernelDevice::read ([pr#49984](https://github.com/ceph/ceph/pull/49984), Joshua Baergen)

- blk/KernelDevice: Modify the rotational and discard check log message ([pr#50323](https://github.com/ceph/ceph/pull/50323), Vikhyat Umrao)

- Bluestore: fix bluestore collection\_list latency perf counter ([pr#52951](https://github.com/ceph/ceph/pull/52951), Wangwenjuan)

- build: make it possible to build w/o ceph-mgr ([pr#54132](https://github.com/ceph/ceph/pull/54132), J. Eric Ivancich)

- build: Remove ceph-libboost\* packages in install-deps ([pr#52564](https://github.com/ceph/ceph/pull/52564), Nizamudeen A, Adam Emerson)

- ceph-volume/cephadm: support lv devices in inventory ([pr#53287](https://github.com/ceph/ceph/pull/53287), Guillaume Abrioux)

- ceph-volume: add --osd-id option to raw prepare ([pr#52929](https://github.com/ceph/ceph/pull/52929), Guillaume Abrioux)

- ceph-volume: fix a bug in `get\_lvm\_fast\_allocs()` (batch) ([pr#52062](https://github.com/ceph/ceph/pull/52062), Guillaume Abrioux)

- ceph-volume: fix batch refactor issue ([pr#51206](https://github.com/ceph/ceph/pull/51206), Guillaume Abrioux)

- ceph-volume: fix drive-group issue that expects the batch\_args to be a string ([pr#51210](https://github.com/ceph/ceph/pull/51210), Mohan Sharma)

- ceph-volume: fix inventory with device arg ([pr#48125](https://github.com/ceph/ceph/pull/48125), Guillaume Abrioux)

- ceph-volume: fix issue with fast device allocs when there are multiple PVs per VG ([pr#50879](https://github.com/ceph/ceph/pull/50879), Cory Snyder)

- ceph-volume: fix mpath device support ([pr#53540](https://github.com/ceph/ceph/pull/53540), Guillaume Abrioux)

- ceph-volume: fix raw list for lvm devices ([pr#52620](https://github.com/ceph/ceph/pull/52620), Guillaume Abrioux)

- ceph-volume: quick fix in zap<span></span>.py ([pr#51195](https://github.com/ceph/ceph/pull/51195), Guillaume Abrioux)

- ceph-volume: set lvm membership for mpath type devices ([pr#52079](https://github.com/ceph/ceph/pull/52079), Guillaume Abrioux)

- ceph-volume: update the OS before deploying Ceph (quincy) ([pr#50995](https://github.com/ceph/ceph/pull/50995), Guillaume Abrioux)

- ceph: allow xlock state to be LOCK\_PREXLOCK when putting it ([pr#53663](https://github.com/ceph/ceph/pull/53663), Xiubo Li)

- ceph\_volume: support encrypted volumes for lvm new-db/new-wal/migrate commands ([pr#52874](https://github.com/ceph/ceph/pull/52874), Igor Fedotov)

- cephadm: eliminate duplication of sections ([pr#51432](https://github.com/ceph/ceph/pull/51432), Rongqi Sun)

- cephadm: fix call timeout argument ([pr#52909](https://github.com/ceph/ceph/pull/52909), John Mulligan)

- cephadm: handle exceptions applying extra services during bootstrap ([pr#50904](https://github.com/ceph/ceph/pull/50904), Adam King)

- cephadm: mount host /etc/hosts for daemon containers in podman deployments ([pr#50902](https://github.com/ceph/ceph/pull/50902), Adam King, Ilya Dryomov)

- cephadm: reschedule haproxy from an offline host ([pr#51216](https://github.com/ceph/ceph/pull/51216), Michael Fritch)

- cephadm: set --ulimit nofiles with Docker ([pr#50890](https://github.com/ceph/ceph/pull/50890), Michal Nasiadka)

- cephadm: Split multicast interface and unicast\_ip in keepalived<span></span>.conf ([pr#53098](https://github.com/ceph/ceph/pull/53098), Luis Domingues)

- cephadm: using ip instead of short hostname for prometheus urls ([pr#50905](https://github.com/ceph/ceph/pull/50905), Redouane Kachach)

- cephfs-journal-tool: disambiguate usage of all keyword (in tool help) ([pr#53285](https://github.com/ceph/ceph/pull/53285), Manish M Yathnalli)

- cephfs-mirror: do not run concurrent C\_RestartMirroring context ([issue#62072](http://tracker.ceph.com/issues/62072), [pr#53639](https://github.com/ceph/ceph/pull/53639), Venky Shankar)

- cephfs-top: check the minimum compatible python version ([pr#51354](https://github.com/ceph/ceph/pull/51354), Jos Collin)

- cephfs-top: dump values to stdout and -d [--delay] option fix ([pr#50717](https://github.com/ceph/ceph/pull/50717), Jos Collin, Neeraj Pratap Singh, wangxinyu, Rishabh Dave)

- cephfs-top: Handle `METRIC\_TYPE\_NONE` fields for sorting ([pr#50595](https://github.com/ceph/ceph/pull/50595), Neeraj Pratap Singh)

- cephfs-top: include the missing fields in --dump output ([pr#53454](https://github.com/ceph/ceph/pull/53454), Jos Collin)

- cephfs-top: navigate to home screen when no fs ([pr#50731](https://github.com/ceph/ceph/pull/50731), Jos Collin)

- cephfs-top: Some fixes in `choose\_field()` for sorting ([pr#50365](https://github.com/ceph/ceph/pull/50365), Neeraj Pratap Singh)

- cephfs\_mirror: correctly set top level dir permissions ([pr#50528](https://github.com/ceph/ceph/pull/50528), Milind Changire)

- client: clear the suid/sgid in fallocate path ([pr#50989](https://github.com/ceph/ceph/pull/50989), Lucian Petrut, Xiubo Li)

- client: do not send metrics until the MDS rank is ready ([pr#52502](https://github.com/ceph/ceph/pull/52502), Xiubo Li)

- client: force sending cap revoke ack always ([pr#52508](https://github.com/ceph/ceph/pull/52508), Xiubo Li)

- client: issue a cap release immediately if no cap exists ([pr#52851](https://github.com/ceph/ceph/pull/52851), Xiubo Li)

- client: move the Inode to new auth mds session when changing auth cap ([pr#53664](https://github.com/ceph/ceph/pull/53664), Xiubo Li)

- client: only wait for write MDS OPs when unmounting ([pr#52303](https://github.com/ceph/ceph/pull/52303), Xiubo Li)

- client: trigger to flush the buffer when making snapshot ([pr#52498](https://github.com/ceph/ceph/pull/52498), Xiubo Li)

- client: use deep-copy when setting permission during make\_request ([pr#51486](https://github.com/ceph/ceph/pull/51486), Mer Xuanyi)

- client: wait rename to finish ([pr#52503](https://github.com/ceph/ceph/pull/52503), Xiubo Li)

- common: avoid redefining clock type on Windows ([pr#50573](https://github.com/ceph/ceph/pull/50573), Lucian Petrut)

- Consider setting "bulk" autoscale pool flag when automatically creating a data pool for CephFS ([pr#52902](https://github.com/ceph/ceph/pull/52902), Leonid Usov)

- debian: install cephfs-mirror systemd unit files and man page ([pr#52074](https://github.com/ceph/ceph/pull/52074), Jos Collin)

- doc,test: clean up crush rule min/max\_size leftovers ([pr#52169](https://github.com/ceph/ceph/pull/52169), Ilya Dryomov)

- doc/architecture<span></span>.rst - edit a sentence ([pr#53373](https://github.com/ceph/ceph/pull/53373), Zac Dover)

- doc/architecture<span></span>.rst - edit up to "Cluster Map" ([pr#53367](https://github.com/ceph/ceph/pull/53367), Zac Dover)

- doc/architecture: "Edit HA Auth" ([pr#53620](https://github.com/ceph/ceph/pull/53620), Zac Dover)

- doc/architecture: "Edit HA Auth" (one of several) ([pr#53586](https://github.com/ceph/ceph/pull/53586), Zac Dover)

- doc/architecture: "Edit HA Auth" (one of several) ([pr#53492](https://github.com/ceph/ceph/pull/53492), Zac Dover)

- doc/architecture: edit "Calculating PG IDs" ([pr#53749](https://github.com/ceph/ceph/pull/53749), Zac Dover)

- doc/architecture: edit "Cluster Map" ([pr#53435](https://github.com/ceph/ceph/pull/53435), Zac Dover)

- doc/architecture: edit "Data Scrubbing" ([pr#53731](https://github.com/ceph/ceph/pull/53731), Zac Dover)

- doc/architecture: Edit "HA Auth" ([pr#53489](https://github.com/ceph/ceph/pull/53489), Zac Dover)

- doc/architecture: edit "HA Authentication" ([pr#53633](https://github.com/ceph/ceph/pull/53633), Zac Dover)

- doc/architecture: edit "High Avail<span></span>. Monitors" ([pr#53452](https://github.com/ceph/ceph/pull/53452), Zac Dover)

- doc/architecture: edit "OSD Membership and Status" ([pr#53728](https://github.com/ceph/ceph/pull/53728), Zac Dover)

- doc/architecture: edit "OSDs service clients directly" ([pr#53687](https://github.com/ceph/ceph/pull/53687), Zac Dover)

- doc/architecture: edit "Peering and Sets" ([pr#53872](https://github.com/ceph/ceph/pull/53872), Zac Dover)

- doc/architecture: edit "Replication" ([pr#53739](https://github.com/ceph/ceph/pull/53739), Zac Dover)

- doc/architecture: edit "SDEH" ([pr#53660](https://github.com/ceph/ceph/pull/53660), Zac Dover)

- doc/architecture: edit several sections ([pr#53743](https://github.com/ceph/ceph/pull/53743), Zac Dover)

- doc/architecture: repair RBD sentence ([pr#53878](https://github.com/ceph/ceph/pull/53878), Zac Dover)

- doc/cephadm: add ssh note to install<span></span>.rst ([pr#53200](https://github.com/ceph/ceph/pull/53200), Zac Dover)

- doc/cephadm: edit "Adding Hosts" in install<span></span>.rst ([pr#53226](https://github.com/ceph/ceph/pull/53226), Zac Dover)

- doc/cephadm: edit sentence in mgr<span></span>.rst ([pr#53165](https://github.com/ceph/ceph/pull/53165), Zac Dover)

- doc/cephadm: fix typo in cephadm initial crush location section ([pr#52888](https://github.com/ceph/ceph/pull/52888), John Mulligan)

- doc/cephfs: add note to isolate metadata pool osds ([pr#52464](https://github.com/ceph/ceph/pull/52464), Patrick Donnelly)

- doc/cephfs: edit fs-volumes<span></span>.rst (1 of x) ([pr#51466](https://github.com/ceph/ceph/pull/51466), Zac Dover)

- doc/cephfs: explain cephfs data and metadata set ([pr#51236](https://github.com/ceph/ceph/pull/51236), Zac Dover)

- doc/cephfs: fix prompts in fs-volumes<span></span>.rst ([pr#51435](https://github.com/ceph/ceph/pull/51435), Zac Dover)

- doc/cephfs: Improve fs-volumes<span></span>.rst ([pr#50831](https://github.com/ceph/ceph/pull/50831), Anthony D'Atri)

- doc/cephfs: line-edit "Mirroring Module" ([pr#51543](https://github.com/ceph/ceph/pull/51543), Zac Dover)

- doc/cephfs: rectify prompts in fs-volumes<span></span>.rst ([pr#51459](https://github.com/ceph/ceph/pull/51459), Zac Dover)

- doc/cephfs: repairing inaccessible FSes ([pr#51372](https://github.com/ceph/ceph/pull/51372), Zac Dover)

- doc/cephfs: write cephfs commands fully in docs ([pr#53401](https://github.com/ceph/ceph/pull/53401), Rishabh Dave)

- doc/configuration: edit "bg" in mon-config-ref<span></span>.rst ([pr#53348](https://github.com/ceph/ceph/pull/53348), Zac Dover)

- doc/dev/encoding<span></span>.txt: update per std::optional ([pr#51398](https://github.com/ceph/ceph/pull/51398), Radoslaw Zarzynski)

- doc/dev: backport deduplication<span></span>.rst to Quincy ([pr#53533](https://github.com/ceph/ceph/pull/53533), Zac Dover)

- doc/dev: fix "deploying dev cluster" link ([pr#52035](https://github.com/ceph/ceph/pull/52035), Zac Dover)

- doc/dev: Fix typos in files cephfs-mirroring<span></span>.rst and deduplication<span></span>.rst ([pr#53541](https://github.com/ceph/ceph/pull/53541), Daniel Parkes)

- doc/dev: format command in cephfs-mirroring ([pr#51108](https://github.com/ceph/ceph/pull/51108), Zac Dover)

- doc/dev: remove seqdiag assets ([pr#52310](https://github.com/ceph/ceph/pull/52310), Zac Dover)

- doc/foundation: Updating foundation members for July 2023 ([pr#54064](https://github.com/ceph/ceph/pull/54064), Mike Perez)

- doc/glossary: add "Hybrid Storage" ([pr#51097](https://github.com/ceph/ceph/pull/51097), Zac Dover)

- doc/glossary: add "primary affinity" to glossary ([pr#53428](https://github.com/ceph/ceph/pull/53428), Zac Dover)

- doc/glossary: add "Scrubbing" ([pr#50702](https://github.com/ceph/ceph/pull/50702), Zac Dover)

- doc/glossary: add "User" ([pr#50672](https://github.com/ceph/ceph/pull/50672), Zac Dover)

- doc/glossary: improve "CephX" entry ([pr#51064](https://github.com/ceph/ceph/pull/51064), Zac Dover)

- doc/glossary: link to CephX Config ref ([pr#50708](https://github.com/ceph/ceph/pull/50708), Zac Dover)

- doc/glossary: update bluestore entry ([pr#51694](https://github.com/ceph/ceph/pull/51694), Zac Dover)

- doc/man/8: improve radosgw-admin<span></span>.rst ([pr#53268](https://github.com/ceph/ceph/pull/53268), Anthony D'Atri)

- doc/man: radosgw-admin<span></span>.rst typo ([pr#53316](https://github.com/ceph/ceph/pull/53316), Zac Dover)

- doc/man: remove docs about support for unix domain sockets ([pr#53313](https://github.com/ceph/ceph/pull/53313), Zac Dover)

- doc/mgr/ceph\_api: Promptify example commands in index<span></span>.rst ([pr#52696](https://github.com/ceph/ceph/pull/52696), Ville Ojamo)

- doc/mgr/dashboard: fix a typo ([pr#52142](https://github.com/ceph/ceph/pull/52142), Guido Santella)

- doc/mgr/prometheus: fix confval reference ([pr#51093](https://github.com/ceph/ceph/pull/51093), Piotr Parczewski)

- doc/mgr/rgw<span></span>.rst: add missing "ceph" command in cli specification ([pr#52487](https://github.com/ceph/ceph/pull/52487), Ville Ojamo)

- doc/mgr/rgw<span></span>.rst: multisite typed wrong ([pr#52479](https://github.com/ceph/ceph/pull/52479), Ville Ojamo)

- doc/mgr: edit "leaderboard" in telemetry<span></span>.rst ([pr#51721](https://github.com/ceph/ceph/pull/51721), Zac Dover)

- doc/mgr: update prompts in prometheus<span></span>.rst ([pr#51310](https://github.com/ceph/ceph/pull/51310), Zac Dover)

- doc/msgr2: update dual stack status ([pr#50800](https://github.com/ceph/ceph/pull/50800), Dan van der Ster)

- doc/operations: fix prompt in bluestore-migration ([pr#50662](https://github.com/ceph/ceph/pull/50662), Zac Dover)

- doc/rados/config: edit auth-config-ref ([pr#50950](https://github.com/ceph/ceph/pull/50950), Zac Dover)

- doc/rados/configuration: add links to MON DNS ([pr#52613](https://github.com/ceph/ceph/pull/52613), Ville Ojamo)

- doc/rados/configuration: Avoid repeating "support" in msgr2<span></span>.rst ([pr#52999](https://github.com/ceph/ceph/pull/52999), Ville Ojamo)

- doc/rados/operations: Acting Set question ([pr#51740](https://github.com/ceph/ceph/pull/51740), Zac Dover)

- doc/rados/operations: edit monitoring<span></span>.rst ([pr#51036](https://github.com/ceph/ceph/pull/51036), Zac Dover)

- doc/rados/operations: Fix erasure-code-jerasure<span></span>.rst fix ([pr#51743](https://github.com/ceph/ceph/pull/51743), Anthony D'Atri)

- doc/rados/operations: fix typo in balancer<span></span>.rst ([pr#51938](https://github.com/ceph/ceph/pull/51938), Pierre Riteau)

- doc/rados/operations: Fix typo in erasure-code<span></span>.rst ([pr#50752](https://github.com/ceph/ceph/pull/50752), Sainithin Artham)

- doc/rados/operations: Improve formatting in crush-map<span></span>.rst ([pr#52140](https://github.com/ceph/ceph/pull/52140), Anthony D'Atri)

- doc/rados/ops: add ceph-medic documentation ([pr#50853](https://github.com/ceph/ceph/pull/50853), Zac Dover)

- doc/rados/ops: add hyphen to mon-osd-pg<span></span>.rst ([pr#50960](https://github.com/ceph/ceph/pull/50960), Zac Dover)

- doc/rados/ops: edit health checks<span></span>.rst (5 of x) ([pr#50967](https://github.com/ceph/ceph/pull/50967), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (1 of x) ([pr#50797](https://github.com/ceph/ceph/pull/50797), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (2 of x) ([pr#50912](https://github.com/ceph/ceph/pull/50912), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (3 of x) ([pr#50953](https://github.com/ceph/ceph/pull/50953), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (4 of x) ([pr#50956](https://github.com/ceph/ceph/pull/50956), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (6 of x) ([pr#50970](https://github.com/ceph/ceph/pull/50970), Zac Dover)

- doc/rados/ops: edit monitoring-osd-pg<span></span>.rst (1 of x) ([pr#50865](https://github.com/ceph/ceph/pull/50865), Zac Dover)

- doc/rados/ops: edit monitoring-osd-pg<span></span>.rst (2 of x) ([pr#50946](https://github.com/ceph/ceph/pull/50946), Zac Dover)

- doc/rados/ops: edit user-management<span></span>.rst (3 of x) ([pr#51240](https://github.com/ceph/ceph/pull/51240), Zac Dover)

- doc/rados/ops: line-edit operating<span></span>.rst ([pr#50934](https://github.com/ceph/ceph/pull/50934), Zac Dover)

- doc/rados/ops: remove ceph-medic from monitoring ([pr#51088](https://github.com/ceph/ceph/pull/51088), Zac Dover)

- doc/rados: add bulk flag to pools<span></span>.rst ([pr#53318](https://github.com/ceph/ceph/pull/53318), Zac Dover)

- doc/rados: add link to ops/health-checks<span></span>.rst ([pr#50762](https://github.com/ceph/ceph/pull/50762), Zac Dover)

- doc/rados: add math markup to placement-groups<span></span>.rst ([pr#52038](https://github.com/ceph/ceph/pull/52038), Zac Dover)

- doc/rados: clean up ops/bluestore-migration<span></span>.rst ([pr#50678](https://github.com/ceph/ceph/pull/50678), Zac Dover)

- doc/rados: edit add-or-rm-osds (1 of x) ([pr#52384](https://github.com/ceph/ceph/pull/52384), Zac Dover)

- doc/rados: edit add-or-rm-osds (2 of x) ([pr#52451](https://github.com/ceph/ceph/pull/52451), Zac Dover)

- doc/rados: edit balancer<span></span>.rst ([pr#51825](https://github.com/ceph/ceph/pull/51825), Zac Dover)

- doc/rados: edit bluestore-config-ref<span></span>.rst (1 of x) ([pr#51790](https://github.com/ceph/ceph/pull/51790), Zac Dover)

- doc/rados: edit bluestore-config-ref<span></span>.rst (2 of x) ([pr#51793](https://github.com/ceph/ceph/pull/51793), Zac Dover)

- doc/rados: edit ceph-conf<span></span>.rst ([pr#52449](https://github.com/ceph/ceph/pull/52449), Zac Dover)

- doc/rados: edit ceph-conf<span></span>.rst (2 of x) ([pr#52471](https://github.com/ceph/ceph/pull/52471), Zac Dover)

- doc/rados: edit ceph-conf<span></span>.rst (3 of x) ([pr#52589](https://github.com/ceph/ceph/pull/52589), Zac Dover)

- doc/rados: edit ceph-conf<span></span>.rst (4 of x) ([pr#52594](https://github.com/ceph/ceph/pull/52594), Zac Dover)

- doc/rados: edit change-mon-elections ([pr#51999](https://github.com/ceph/ceph/pull/51999), Zac Dover)

- doc/rados: edit control<span></span>.rst (1 of x) ([pr#52153](https://github.com/ceph/ceph/pull/52153), Zac Dover)

- doc/rados: edit crush-map-edits (2 of x) ([pr#52312](https://github.com/ceph/ceph/pull/52312), Zac Dover)

- doc/rados: edit crush-map-edits<span></span>.rst (1 of x) ([pr#52180](https://github.com/ceph/ceph/pull/52180), Zac Dover)

- doc/rados: edit crush-map<span></span>.rst (1 of x) ([pr#52031](https://github.com/ceph/ceph/pull/52031), Zac Dover)

- doc/rados: edit crush-map<span></span>.rst (2 of x) ([pr#52070](https://github.com/ceph/ceph/pull/52070), Zac Dover)

- doc/rados: edit crush-map<span></span>.rst (3 of x) ([pr#52094](https://github.com/ceph/ceph/pull/52094), Zac Dover)

- doc/rados: edit crush-map<span></span>.rst (4 of x) ([pr#52099](https://github.com/ceph/ceph/pull/52099), Zac Dover)

- doc/rados: edit data-placement<span></span>.rst ([pr#51596](https://github.com/ceph/ceph/pull/51596), Zac Dover)

- doc/rados: edit devices<span></span>.rst ([pr#51478](https://github.com/ceph/ceph/pull/51478), Zac Dover)

- doc/rados: edit filestore-config-ref<span></span>.rst ([pr#51752](https://github.com/ceph/ceph/pull/51752), Zac Dover)

- doc/rados: edit firefly tunables section ([pr#52103](https://github.com/ceph/ceph/pull/52103), Zac Dover)

- doc/rados: edit log-and-debug<span></span>.rst (1 of x) ([pr#51903](https://github.com/ceph/ceph/pull/51903), Zac Dover)

- doc/rados: edit log-and-debug<span></span>.rst (2 of x) ([pr#51907](https://github.com/ceph/ceph/pull/51907), Zac Dover)

- doc/rados: edit memory-profiling<span></span>.rst ([pr#53933](https://github.com/ceph/ceph/pull/53933), Zac Dover)

- doc/rados: edit operations/add-or-rm-mons (1 of x) ([pr#52890](https://github.com/ceph/ceph/pull/52890), Zac Dover)

- doc/rados: edit operations/add-or-rm-mons (2 of x) ([pr#52826](https://github.com/ceph/ceph/pull/52826), Zac Dover)

- doc/rados: edit operations/bs-migration (1 of x) ([pr#50587](https://github.com/ceph/ceph/pull/50587), Zac Dover)

- doc/rados: edit operations/bs-migration (2 of x) ([pr#50590](https://github.com/ceph/ceph/pull/50590), Zac Dover)

- doc/rados: edit ops/control<span></span>.rst (1 of x) ([pr#53812](https://github.com/ceph/ceph/pull/53812), zdover23, Zac Dover)

- doc/rados: edit ops/control<span></span>.rst (2 of x) ([pr#53816](https://github.com/ceph/ceph/pull/53816), Zac Dover)

- doc/rados: edit ops/monitoring<span></span>.rst (1 of 3) ([pr#50823](https://github.com/ceph/ceph/pull/50823), Zac Dover)

- doc/rados: edit ops/monitoring<span></span>.rst (2 of 3) ([pr#50849](https://github.com/ceph/ceph/pull/50849), Zac Dover)

- doc/rados: edit placement-groups<span></span>.rst (1 of x) ([pr#51985](https://github.com/ceph/ceph/pull/51985), Zac Dover)

- doc/rados: edit placement-groups<span></span>.rst (2 of x) ([pr#51997](https://github.com/ceph/ceph/pull/51997), Zac Dover)

- doc/rados: edit placement-groups<span></span>.rst (3 of x) ([pr#52002](https://github.com/ceph/ceph/pull/52002), Zac Dover)

- doc/rados: edit pools<span></span>.rst (1 of x) ([pr#51913](https://github.com/ceph/ceph/pull/51913), Zac Dover)

- doc/rados: edit pools<span></span>.rst (2 of x) ([pr#51940](https://github.com/ceph/ceph/pull/51940), Zac Dover)

- doc/rados: edit pools<span></span>.rst (3 of x) ([pr#51957](https://github.com/ceph/ceph/pull/51957), Zac Dover)

- doc/rados: edit pools<span></span>.rst (4 of x) ([pr#51971](https://github.com/ceph/ceph/pull/51971), Zac Dover)

- doc/rados: edit stretch-mode procedure ([pr#51290](https://github.com/ceph/ceph/pull/51290), Zac Dover)

- doc/rados: edit stretch-mode<span></span>.rst ([pr#51338](https://github.com/ceph/ceph/pull/51338), Zac Dover)

- doc/rados: edit stretch-mode<span></span>.rst ([pr#51303](https://github.com/ceph/ceph/pull/51303), Zac Dover)

- doc/rados: edit troubleshooting-mon<span></span>.rst (1 of x) ([pr#51905](https://github.com/ceph/ceph/pull/51905), Zac Dover)

- doc/rados: edit troubleshooting-mon<span></span>.rst (2 of x) ([pr#52840](https://github.com/ceph/ceph/pull/52840), Zac Dover)

- doc/rados: edit troubleshooting-mon<span></span>.rst (3 of x) ([pr#53880](https://github.com/ceph/ceph/pull/53880), Zac Dover)

- doc/rados: edit troubleshooting-mon<span></span>.rst (4 of x) ([pr#53898](https://github.com/ceph/ceph/pull/53898), Zac Dover)

- doc/rados: edit troubleshooting-osd (1 of x) ([pr#53983](https://github.com/ceph/ceph/pull/53983), Zac Dover)

- doc/rados: Edit troubleshooting-osd (2 of x) ([pr#54001](https://github.com/ceph/ceph/pull/54001), Zac Dover)

- doc/rados: Edit troubleshooting-osd (3 of x) ([pr#54027](https://github.com/ceph/ceph/pull/54027), Zac Dover)

- doc/rados: edit troubleshooting-pg (2 of x) ([pr#54115](https://github.com/ceph/ceph/pull/54115), Zac Dover)

- doc/rados: edit troubleshooting-pg<span></span>.rst (1 of x) ([pr#54074](https://github.com/ceph/ceph/pull/54074), Zac Dover)

- doc/rados: edit troubleshooting<span></span>.rst ([pr#53838](https://github.com/ceph/ceph/pull/53838), Zac Dover)

- doc/rados: edit troubleshooting/community<span></span>.rst ([pr#53882](https://github.com/ceph/ceph/pull/53882), Zac Dover)

- doc/rados: edit user-management (2 of x) ([pr#51156](https://github.com/ceph/ceph/pull/51156), Zac Dover)

- doc/rados: edit user-management<span></span>.rst (1 of x) ([pr#50641](https://github.com/ceph/ceph/pull/50641), Zac Dover)

- doc/rados: fix link in common<span></span>.rst ([pr#51756](https://github.com/ceph/ceph/pull/51756), Zac Dover)

- doc/rados: fix list in crush-map<span></span>.rst ([pr#52066](https://github.com/ceph/ceph/pull/52066), Zac Dover)

- doc/rados: fix typos in pg-repair<span></span>.rst ([pr#51898](https://github.com/ceph/ceph/pull/51898), Zac Dover)

- doc/rados: introduce emdash ([pr#52382](https://github.com/ceph/ceph/pull/52382), Zac Dover)

- doc/rados: line edit mon-lookup-dns top matter ([pr#50582](https://github.com/ceph/ceph/pull/50582), Zac Dover)

- doc/rados: line-edit common<span></span>.rst ([pr#50943](https://github.com/ceph/ceph/pull/50943), Zac Dover)

- doc/rados: line-edit devices<span></span>.rst ([pr#51577](https://github.com/ceph/ceph/pull/51577), Zac Dover)

- doc/rados: line-edit erasure-code<span></span>.rst ([pr#50619](https://github.com/ceph/ceph/pull/50619), Zac Dover)

- doc/rados: line-edit pg-repair<span></span>.rst ([pr#50803](https://github.com/ceph/ceph/pull/50803), Zac Dover)

- doc/rados: line-edit upmap<span></span>.rst ([pr#50566](https://github.com/ceph/ceph/pull/50566), Zac Dover)

- doc/rados: m-config-ref: edit "background" ([pr#51273](https://github.com/ceph/ceph/pull/51273), Zac Dover)

- doc/rados: pools<span></span>.rst: "decreaesed" ([pr#51920](https://github.com/ceph/ceph/pull/51920), Zac Dover)

- doc/rados: remove git tag in placement-groups in q ([pr#51990](https://github.com/ceph/ceph/pull/51990), Zac Dover)

- doc/rados: stretch-mode<span></span>.rst (other commands) ([pr#51390](https://github.com/ceph/ceph/pull/51390), Zac Dover)

- doc/rados: stretch-mode: stretch cluster issues ([pr#51378](https://github.com/ceph/ceph/pull/51378), Zac Dover)

- doc/rados: update monitoring-osd-pg<span></span>.rst ([pr#52959](https://github.com/ceph/ceph/pull/52959), Zac Dover)

- doc/radosgw: Add missing space to date option spec in admin<span></span>.rst ([pr#52694](https://github.com/ceph/ceph/pull/52694), Ville Ojamo)

- doc/radosgw: add Zonegroup policy explanation ([pr#52362](https://github.com/ceph/ceph/pull/52362), Zac Dover)

- doc/radosgw: add Zonegroup purpose ([pr#52349](https://github.com/ceph/ceph/pull/52349), Zac Dover)

- doc/radosgw: correct emphasis in rate limit section ([pr#52713](https://github.com/ceph/ceph/pull/52713), Piotr Parczewski)

- doc/radosgw: edit "Basic Workflow" in s3select<span></span>.rst ([pr#52263](https://github.com/ceph/ceph/pull/52263), Zac Dover)

- doc/radosgw: edit "Overview" in s3select<span></span>.rst ([pr#52220](https://github.com/ceph/ceph/pull/52220), Zac Dover)

- doc/radosgw: explain multisite dynamic sharding ([pr#51586](https://github.com/ceph/ceph/pull/51586), Zac Dover)

- doc/radosgw: fix command error blank ([pr#53656](https://github.com/ceph/ceph/pull/53656), stevenhua)

- doc/radosgw: format part of s3select ([pr#51117](https://github.com/ceph/ceph/pull/51117), Cole Mitchell)

- doc/radosgw: format part of s3select ([pr#51105](https://github.com/ceph/ceph/pull/51105), Cole Mitchell)

- doc/radosgw: Improve language and formatting in config-ref<span></span>.rst ([pr#52836](https://github.com/ceph/ceph/pull/52836), Ville Ojamo)

- doc/radosgw: multisite - edit "migrating a single-site" ([pr#53262](https://github.com/ceph/ceph/pull/53262), Qi Tao)

- doc/radosgw: rabbitmq - push-endpoint edit ([pr#51306](https://github.com/ceph/ceph/pull/51306), Zac Dover)

- doc/radosgw: refine "Zones" in multisite<span></span>.rst ([pr#52282](https://github.com/ceph/ceph/pull/52282), Zac Dover)

- doc/radosgw: remove pipes from s3select<span></span>.rst ([pr#52188](https://github.com/ceph/ceph/pull/52188), Zac Dover)

- doc/radosgw: remove pipes from s3select<span></span>.rst ([pr#52184](https://github.com/ceph/ceph/pull/52184), Zac Dover)

- doc/radosgw: s/s3select/S3 Select/ ([pr#52279](https://github.com/ceph/ceph/pull/52279), Zac Dover)

- doc/radosgw: update rate limit management ([pr#52911](https://github.com/ceph/ceph/pull/52911), Zac Dover)

- doc/README<span></span>.md - edit "Building Ceph" ([pr#53058](https://github.com/ceph/ceph/pull/53058), Zac Dover)

- doc/README<span></span>.md - improve "Running a test cluster" ([pr#53259](https://github.com/ceph/ceph/pull/53259), Zac Dover)

- doc/rgw/lua: add info uploading a script in cephadm deployment ([pr#52299](https://github.com/ceph/ceph/pull/52299), Yuval Lifshitz)

- doc/rgw: refine "Setting a Zonegroup" ([pr#51072](https://github.com/ceph/ceph/pull/51072), Zac Dover)

- doc/rgw: several response headers are supported ([pr#52804](https://github.com/ceph/ceph/pull/52804), Casey Bodley)

- doc/start/os-recommendations: drop 4<span></span>.14 kernel and reword guidance ([pr#51490](https://github.com/ceph/ceph/pull/51490), Ilya Dryomov)

- doc/start: documenting-ceph - add squash procedure ([pr#50740](https://github.com/ceph/ceph/pull/50740), Zac Dover)

- doc/start: edit first 150 lines of documenting-ceph ([pr#51182](https://github.com/ceph/ceph/pull/51182), Zac Dover)

- doc/start: edit os-recommendations<span></span>.rst ([pr#53180](https://github.com/ceph/ceph/pull/53180), Zac Dover)

- doc/start: fix "Planet Ceph" link ([pr#51420](https://github.com/ceph/ceph/pull/51420), Zac Dover)

- doc/start: format procedure in documenting-ceph ([pr#50788](https://github.com/ceph/ceph/pull/50788), Zac Dover)

- doc/start: KRBD feature flag support note ([pr#51503](https://github.com/ceph/ceph/pull/51503), Zac Dover)

- doc/start: Modernize and clarify hardware-recommendations<span></span>.rst ([pr#54072](https://github.com/ceph/ceph/pull/54072), Anthony D'Atri)

- doc/start: rewrite intro paragraph ([pr#51221](https://github.com/ceph/ceph/pull/51221), Zac Dover)

- doc/start: update "notify us" section ([pr#50770](https://github.com/ceph/ceph/pull/50770), Zac Dover)

- doc/start: update linking conventions ([pr#52913](https://github.com/ceph/ceph/pull/52913), Zac Dover)

- doc/start: update linking conventions ([pr#52842](https://github.com/ceph/ceph/pull/52842), Zac Dover)

- doc/troubleshooting: edit cpu-profiling<span></span>.rst ([pr#53060](https://github.com/ceph/ceph/pull/53060), Zac Dover)

- doc: Add a note on possible deadlock on volume deletion ([pr#52947](https://github.com/ceph/ceph/pull/52947), Kotresh HR)

- doc: add information on expediting MDS recovery ([pr#52368](https://github.com/ceph/ceph/pull/52368), Patrick Donnelly)

- doc: add link to "documenting ceph" to index<span></span>.rst ([pr#51470](https://github.com/ceph/ceph/pull/51470), Zac Dover)

- doc: Add missing `ceph` command in documentation section `REPLACING A… ([pr#51620](https://github.com/ceph/ceph/pull/51620), Alexander Proschek)

- doc: add note for removing (automatic) partitioning policy ([pr#53570](https://github.com/ceph/ceph/pull/53570), Venky Shankar)

- doc: Add warning on manual CRUSH rule removal ([pr#53421](https://github.com/ceph/ceph/pull/53421), Alvin Owyong)

- doc: deprecate the cache tiering ([pr#51653](https://github.com/ceph/ceph/pull/51653), Radosław Zarzyński)

- doc: Documentation about main Ceph metrics ([pr#54112](https://github.com/ceph/ceph/pull/54112), Juan Miguel Olmo Martínez)

- doc: edit README<span></span>.md - contributing code ([pr#53050](https://github.com/ceph/ceph/pull/53050), Zac Dover)

- doc: expand and consolidate mds placement ([pr#53147](https://github.com/ceph/ceph/pull/53147), Patrick Donnelly)

- doc: explain cephfs mirroring `peer\_add` step in detail ([pr#51521](https://github.com/ceph/ceph/pull/51521), Venky Shankar)

- doc: Fix doc for mds cap acquisition throttle ([pr#53025](https://github.com/ceph/ceph/pull/53025), Kotresh HR)

- doc: for EC we recommend K+1 ([pr#52780](https://github.com/ceph/ceph/pull/52780), Dan van der Ster)

- doc: governance<span></span>.rst - update D Orman ([pr#52573](https://github.com/ceph/ceph/pull/52573), Zac Dover)

- doc: improve doc/dev/encoding<span></span>.rst ([pr#52759](https://github.com/ceph/ceph/pull/52759), Radosław Zarzyński)

- doc: improve submodule update command - README<span></span>.md ([pr#53001](https://github.com/ceph/ceph/pull/53001), Zac Dover)

- doc: remove egg fragment from dev/developer\_guide/running-tests-locally ([pr#53854](https://github.com/ceph/ceph/pull/53854), Dhairya Parmar)

- doc: Update jerasure<span></span>.org references ([pr#51726](https://github.com/ceph/ceph/pull/51726), Anthony D'Atri)

- doc: Update mClock QOS documentation to discard osd\_mclock\_cost\_per\\_\* ([pr#54080](https://github.com/ceph/ceph/pull/54080), tanchangzhi)

- doc: update multisite doc ([pr#51401](https://github.com/ceph/ceph/pull/51401), parth-gr)

- doc: update rados<span></span>.cc ([pr#52968](https://github.com/ceph/ceph/pull/52968), Zac Dover)

- doc: update README<span></span>.md ([pr#52642](https://github.com/ceph/ceph/pull/52642), Zac Dover)

- doc: update README<span></span>.md install procedure ([pr#52680](https://github.com/ceph/ceph/pull/52680), Zac Dover)

- doc: update test cluster commands in README<span></span>.md ([pr#53350](https://github.com/ceph/ceph/pull/53350), Zac Dover)

- doc: Use `ceph osd crush tree` command to display weight set weights ([pr#51350](https://github.com/ceph/ceph/pull/51350), James Lakin)

- docs: fix nfs cluster create syntax ([pr#52424](https://github.com/ceph/ceph/pull/52424), Paul Cuzner)

- docs: Update the Prometheus endpoint info ([pr#51287](https://github.com/ceph/ceph/pull/51287), Paul Cuzner)

- Fix FTBFS on gcc 13 ([pr#52120](https://github.com/ceph/ceph/pull/52120), Tim Serong)

- install-deps: remove the legacy resolver flags ([pr#53706](https://github.com/ceph/ceph/pull/53706), Nizamudeen A)

- kv/RocksDBStore: Add CompactOnDeletion support ([pr#50893](https://github.com/ceph/ceph/pull/50893), Mark Nelson)

- kv/RocksDBStore: cumulative backport for rm\_range\_keys and around ([pr#50636](https://github.com/ceph/ceph/pull/50636), Igor Fedotov)

- kv/RocksDBStore: don't use real wholespace iterator for prefixed access ([pr#50495](https://github.com/ceph/ceph/pull/50495), Igor Fedotov)

- libcephsqlite: fill 0s in unread portion of buffer ([pr#53102](https://github.com/ceph/ceph/pull/53102), Patrick Donnelly)

- librados: aio operate functions can set times ([pr#52118](https://github.com/ceph/ceph/pull/52118), Casey Bodley)

- librbd/managed\_lock/GetLockerRequest: Fix no valid lockers case ([pr#52288](https://github.com/ceph/ceph/pull/52288), Ilya Dryomov, Matan Breizman)

- librbd: avoid decrementing iterator before first element ([pr#51854](https://github.com/ceph/ceph/pull/51854), Lucian Petrut)

- librbd: avoid object map corruption in snapshots taken under I/O ([pr#52286](https://github.com/ceph/ceph/pull/52286), Ilya Dryomov)

- librbd: don't wait for a watch in send\_acquire\_lock() if client is blocklisted ([pr#50920](https://github.com/ceph/ceph/pull/50920), Ilya Dryomov, Christopher Hoffman)

- librbd: fix wrong attribute for rbd\_quiesce\_complete api ([pr#50873](https://github.com/ceph/ceph/pull/50873), Dongsheng Yang)

- librbd: kick ExclusiveLock state machine on client being blocklisted when waiting for lock ([pr#53294](https://github.com/ceph/ceph/pull/53294), Ramana Raja)

- librbd: kick ExclusiveLock state machine stalled waiting for lock from reacquire\_lock() ([pr#53920](https://github.com/ceph/ceph/pull/53920), Ramana Raja)

- librbd: localize snap\_remove op for mirror snapshots ([pr#51428](https://github.com/ceph/ceph/pull/51428), Christopher Hoffman)

- librbd: make CreatePrimaryRequest remove any unlinked mirror snapshots ([pr#53275](https://github.com/ceph/ceph/pull/53275), Ilya Dryomov)

- librbd: remove previous incomplete primary snapshot after successfully creating a new one ([pr#51173](https://github.com/ceph/ceph/pull/51173), Ilya Dryomov, Prasanna Kumar Kalever)

- librbd: report better errors when failing to enable mirroring on an image ([pr#50837](https://github.com/ceph/ceph/pull/50837), Prasanna Kumar Kalever)

- log: writes to stderr (pipe) may not be atomic ([pr#50777](https://github.com/ceph/ceph/pull/50777), Lucian Petrut, Patrick Donnelly)

- MDS imported\_inodes metric is not updated ([pr#51697](https://github.com/ceph/ceph/pull/51697), Yongseok Oh)

- mds/FSMap: allow upgrades if no up mds ([pr#53852](https://github.com/ceph/ceph/pull/53852), Patrick Donnelly)

- mds/Server: mark a cap acquisition throttle event in the request ([pr#53167](https://github.com/ceph/ceph/pull/53167), Leonid Usov)

- mds: acquire inode snaplock in open ([pr#53184](https://github.com/ceph/ceph/pull/53184), Patrick Donnelly)

- mds: add event for batching getattr/lookup ([pr#53557](https://github.com/ceph/ceph/pull/53557), Patrick Donnelly)

- mds: allow unlink from lost+found directory ([issue#59569](http://tracker.ceph.com/issues/59569), [pr#51689](https://github.com/ceph/ceph/pull/51689), Venky Shankar)

- mds: blocklist clients with "bloated" session metadata ([issue#61947](http://tracker.ceph.com/issues/61947), [issue#62873](http://tracker.ceph.com/issues/62873), [pr#53330](https://github.com/ceph/ceph/pull/53330), Venky Shankar)

- mds: catch damage to CDentry's first member before persisting ([issue#58482](http://tracker.ceph.com/issues/58482), [pr#50779](https://github.com/ceph/ceph/pull/50779), Patrick Donnelly)

- mds: display sane hex value (0x0) for empty feature bit ([pr#52127](https://github.com/ceph/ceph/pull/52127), Jos Collin)

- mds: do not send split\_realms for CEPH\_SNAP\_OP\_UPDATE msg ([pr#52849](https://github.com/ceph/ceph/pull/52849), Xiubo Li)

- mds: do not take the ino which has been used ([pr#51507](https://github.com/ceph/ceph/pull/51507), Xiubo Li)

- mds: drop locks and retry when lock set changes ([pr#53242](https://github.com/ceph/ceph/pull/53242), Patrick Donnelly)

- mds: fix stray evaluation using scrub and introduce new option ([pr#50815](https://github.com/ceph/ceph/pull/50815), Dhairya Parmar)

- mds: Fix the linkmerge assert check ([pr#52725](https://github.com/ceph/ceph/pull/52725), Kotresh HR)

- mds: force replay sessionmap version ([pr#50724](https://github.com/ceph/ceph/pull/50724), Xiubo Li)

- mds: make num\_fwd and num\_retry to \_\_u32 ([pr#50732](https://github.com/ceph/ceph/pull/50732), Xiubo Li)

- mds: MDLog::\_recovery\_thread: handle the errors gracefully ([pr#52514](https://github.com/ceph/ceph/pull/52514), Jos Collin)

- mds: rdlock\_path\_xlock\_dentry supports returning auth target inode ([pr#51688](https://github.com/ceph/ceph/pull/51688), Zhansong Gao)

- mds: record and dump last tid for trimming completed requests (or flushes) ([issue#57985](http://tracker.ceph.com/issues/57985), [pr#50785](https://github.com/ceph/ceph/pull/50785), Venky Shankar)

- mds: session ls command appears twice in command listing ([pr#52516](https://github.com/ceph/ceph/pull/52516), Neeraj Pratap Singh)

- mds: skip forwarding request if the session were removed ([pr#52845](https://github.com/ceph/ceph/pull/52845), Xiubo Li)

- mds: update mdlog perf counters during replay ([pr#52683](https://github.com/ceph/ceph/pull/52683), Patrick Donnelly)

- mds: wait for unlink operation to finish ([pr#50985](https://github.com/ceph/ceph/pull/50985), Xiubo Li)

- mds: wait reintegrate to finish when unlinking ([pr#51685](https://github.com/ceph/ceph/pull/51685), Xiubo Li)

- mgr/cephadm: add commands to set services to managed/unmanaged ([pr#50897](https://github.com/ceph/ceph/pull/50897), Adam King)

- mgr/cephadm: add more aggressive force flag for host maintenance enter ([pr#50901](https://github.com/ceph/ceph/pull/50901), Adam King)

- mgr/cephadm: allow configuring anonymous access for grafana ([pr#51617](https://github.com/ceph/ceph/pull/51617), Adam King)

- mgr/cephadm: allow setting mon crush locations through mon service spec ([pr#51217](https://github.com/ceph/ceph/pull/51217), Adam King)

- mgr/cephadm: also don't write client files/tuned profiles to maintenance hosts ([pr#53705](https://github.com/ceph/ceph/pull/53705), Adam King)

- mgr/cephadm: asyncio based universal timeout for ssh/cephadm commands ([pr#51218](https://github.com/ceph/ceph/pull/51218), Adam King)

- mgr/cephadm: be aware of host's shortname and FQDN ([pr#50888](https://github.com/ceph/ceph/pull/50888), Adam King)

- mgr/cephadm: don't add mgr into iscsi trusted\_ip\_list if it's already there ([pr#50521](https://github.com/ceph/ceph/pull/50521), Mykola Golub)

- mgr/cephadm: handle HostConnectionError when checking for valid addr ([pr#50900](https://github.com/ceph/ceph/pull/50900), Adam King)

- mgr/cephadm: increasing container stop timeout for OSDs ([pr#50903](https://github.com/ceph/ceph/pull/50903), Redouane Kachach)

- mgr/cephadm: make upgrade respect use\_repo\_digest ([pr#50898](https://github.com/ceph/ceph/pull/50898), Adam King)

- mgr/cephadm: support for nfs backed by VIP ([pr#51616](https://github.com/ceph/ceph/pull/51616), Adam King)

- mgr/cephadm: update monitoring stack versions ([pr#51356](https://github.com/ceph/ceph/pull/51356), Nizamudeen A)

- mgr/cephadm: use a dedicated cephadm tmp dir to copy remote files ([pr#50906](https://github.com/ceph/ceph/pull/50906), Redouane Kachach)

- mgr/dashboard CRUD component backport ([pr#51367](https://github.com/ceph/ceph/pull/51367), Pedro Gonzalez Gomez, Pere Diaz Bou, Nizamudeen A, Ernesto Puerta)

- mgr/dashboard: Add more decimals in latency graph ([pr#52728](https://github.com/ceph/ceph/pull/52728), Pedro Gonzalez Gomez)

- mgr/dashboard: add popover to cluster status card ([pr#52027](https://github.com/ceph/ceph/pull/52027), Nizamudeen A)

- mgr/dashboard: align charts of landing page ([pr#53544](https://github.com/ceph/ceph/pull/53544), Pedro Gonzalez Gomez)

- mgr/dashboard: allow PUT in CORS ([pr#52706](https://github.com/ceph/ceph/pull/52706), Nizamudeen A)

- mgr/dashboard: batch backport hackathon prs ([pr#51768](https://github.com/ceph/ceph/pull/51768), Nizamudeen A, Pedro Gonzalez Gomez, Ankush Behl, Pere Diaz Bou, Aashish Sharma, avanthakkar)

- mgr/dashboard: bump moment from 2<span></span>.29<span></span>.3 to 2<span></span>.29<span></span>.4 in /src/pybind/mgr/dashboard/frontend ([pr#51358](https://github.com/ceph/ceph/pull/51358), dependabot[bot])

- mgr/dashboard: disable promote on mirroring not enabled ([pr#52537](https://github.com/ceph/ceph/pull/52537), Pedro Gonzalez Gomez)

- mgr/dashboard: disable protect if layering is not enabled on the image ([pr#53174](https://github.com/ceph/ceph/pull/53174), avanthakkar)

- mgr/dashboard: enable protect option if layering enabled ([pr#53796](https://github.com/ceph/ceph/pull/53796), avanthakkar)

- mgr/dashboard: expose more grafana configs in service form ([pr#51112](https://github.com/ceph/ceph/pull/51112), Nizamudeen A)

- mgr/dashboard: fix a bug where data would plot wrongly ([pr#52332](https://github.com/ceph/ceph/pull/52332), Pedro Gonzalez Gomez)

- mgr/dashboard: fix cephadm e2e expression changed error ([pr#51079](https://github.com/ceph/ceph/pull/51079), Nizamudeen A)

- mgr/dashboard: fix CephPGImbalance alert ([pr#51252](https://github.com/ceph/ceph/pull/51252), Aashish Sharma)

- mgr/dashboard: fix create osd default selected as recommended not working ([pr#51007](https://github.com/ceph/ceph/pull/51007), Nizamudeen A)

- mgr/dashboard: fix displaying mirror image progress ([pr#50871](https://github.com/ceph/ceph/pull/50871), Pere Diaz Bou)

- mgr/dashboard: fix eviction of all FS clients ([pr#51011](https://github.com/ceph/ceph/pull/51011), Pere Diaz Bou)

- mgr/dashboard: fix image columns naming ([pr#53253](https://github.com/ceph/ceph/pull/53253), Pedro Gonzalez Gomez)

- mgr/dashboard: fix issues with read-only user on landing page ([pr#51809](https://github.com/ceph/ceph/pull/51809), Pedro Gonzalez Gomez, Nizamudeen A)

- mgr/dashboard: Fix rbd snapshot creation ([pr#51076](https://github.com/ceph/ceph/pull/51076), Aashish Sharma)

- mgr/dashboard: fix regression caused by cephPgImabalance alert ([pr#51525](https://github.com/ceph/ceph/pull/51525), Aashish Sharma)

- mgr/dashboard: fix rgw page issues when hostname not resolvable ([pr#53216](https://github.com/ceph/ceph/pull/53216), Nizamudeen A)

- mgr/dashboard: fix test\_dashboard\_e2e<span></span>.sh failure ([pr#51866](https://github.com/ceph/ceph/pull/51866), Nizamudeen A)

- mgr/dashboard: fix the rbd mirroring configure check ([pr#51325](https://github.com/ceph/ceph/pull/51325), Nizamudeen A)

- mgr/dashboard: fix the rgw roles page ([pr#51867](https://github.com/ceph/ceph/pull/51867), Nizamudeen A)

- mgr/dashboard: force TLS 1<span></span>.3 ([pr#50526](https://github.com/ceph/ceph/pull/50526), Ernesto Puerta)

- mgr/dashboard: hide notification on force promote ([pr#51164](https://github.com/ceph/ceph/pull/51164), Pedro Gonzalez Gomez)

- mgr/dashboard: images -> edit -> disable checkboxes for layering and deef-flatten ([pr#53387](https://github.com/ceph/ceph/pull/53387), avanthakkar)

- mgr/dashboard: Landing page v3 ([pr#50608](https://github.com/ceph/ceph/pull/50608), Pedro Gonzalez Gomez, Nizamudeen A, bryanmontalvan)

- mgr/dashboard: move cephadm e2e cleanup to jenkins job config ([pr#52388](https://github.com/ceph/ceph/pull/52388), Nizamudeen A)

- mgr/dashboard: n/a entries behind primary snapshot mode ([pr#53225](https://github.com/ceph/ceph/pull/53225), Pere Diaz Bou)

- mgr/dashboard: paginate hosts ([pr#52917](https://github.com/ceph/ceph/pull/52917), Pere Diaz Bou)

- mgr/dashboard: rbd-mirror force promotion ([pr#51057](https://github.com/ceph/ceph/pull/51057), Pedro Gonzalez Gomez)

- mgr/dashboard: remove unncessary hyperlink in landing page ([pr#51119](https://github.com/ceph/ceph/pull/51119), Nizamudeen A)

- mgr/dashboard: remove used and total used columns in favor of usage bar ([pr#53303](https://github.com/ceph/ceph/pull/53303), Pedro Gonzalez Gomez)

- mgr/dashboard: set CORS header for unauthorized access ([pr#53203](https://github.com/ceph/ceph/pull/53203), Nizamudeen A)

- mgr/dashboard: skip Create OSDs step in Cluster expansion ([pr#51149](https://github.com/ceph/ceph/pull/51149), Nizamudeen A)

- mgr/dashboard: SSO error: AttributeError: 'str' object has no attribute 'decode' ([pr#51952](https://github.com/ceph/ceph/pull/51952), Volker Theile)

- mgr/nfs: disallow non-existent paths when creating export ([pr#50807](https://github.com/ceph/ceph/pull/50807), Dhairya Parmar)

- mgr/orchestrator: allow deploying raw mode OSDs with --all-available-devices ([pr#50891](https://github.com/ceph/ceph/pull/50891), Adam King)

- mgr/orchestrator: fix device size in `orch device ls` output ([pr#50899](https://github.com/ceph/ceph/pull/50899), Adam King)

- mgr/prometheus: avoid duplicates and deleted entries for rbd\_stats\_pools ([pr#48523](https://github.com/ceph/ceph/pull/48523), Avan Thakkar)

- mgr/prometheus: fix pool\_objects\_repaired and daemon\_health\_metrics format ([pr#51671](https://github.com/ceph/ceph/pull/51671), banuchka)

- mgr/rbd\_support: add user-friendly stderr message when module is not ready ([pr#52189](https://github.com/ceph/ceph/pull/52189), Ramana Raja)

- mgr/rbd\_support: recover from "double blocklisting" ([pr#51758](https://github.com/ceph/ceph/pull/51758), Ramana Raja)

- mgr/rbd\_support: recover from rados client blocklisting ([pr#51455](https://github.com/ceph/ceph/pull/51455), Ramana Raja)

- mgr/rgw: initial multisite deployment work ([pr#50887](https://github.com/ceph/ceph/pull/50887), Redouane Kachach)

- mgr/snap\_schedule: add debug log for paths failing snapshot creation ([pr#50780](https://github.com/ceph/ceph/pull/50780), Milind Changire)

- mgr/snap\_schedule: allow retention spec 'n' to be user defined ([pr#52749](https://github.com/ceph/ceph/pull/52749), Milind Changire, Jakob Haufe)

- mgr/snap\_schedule: catch all exceptions for cli ([pr#52752](https://github.com/ceph/ceph/pull/52752), Milind Changire)

- mgr/telemetry: compile all channels and collections in selftest ([pr#51761](https://github.com/ceph/ceph/pull/51761), Laura Flores)

- mgr/telemetry: fixed log exceptions as "exception" instead of "error" ([pr#51244](https://github.com/ceph/ceph/pull/51244), Vonesha Frost)

- mgr/telemetry: make sure histograms are formatted in `all` commands ([pr#50480](https://github.com/ceph/ceph/pull/50480), Laura Flores)

- mgr/volumes: avoid returning -ESHUTDOWN back to cli ([issue#58651](http://tracker.ceph.com/issues/58651), [pr#50786](https://github.com/ceph/ceph/pull/50786), Venky Shankar)

- mgr/volumes: Fix pending\_subvolume\_deletions in volume info ([pr#53573](https://github.com/ceph/ceph/pull/53573), Kotresh HR)

- mgr: Add one finisher thread per module ([pr#51044](https://github.com/ceph/ceph/pull/51044), Kotresh HR, Patrick Donnelly)

- mgr: add urllib3==1<span></span>.26<span></span>.15 to mgr/requirements<span></span>.txt ([pr#51335](https://github.com/ceph/ceph/pull/51335), Laura Flores)

- mgr: register OSDs in ms\_handle\_accept ([pr#53188](https://github.com/ceph/ceph/pull/53188), Patrick Donnelly)

- mgr: store names of modules that register RADOS clients in the MgrMap ([pr#50964](https://github.com/ceph/ceph/pull/50964), Ramana Raja)

- MgrMonitor: batch commit OSDMap and MgrMap mutations ([pr#50979](https://github.com/ceph/ceph/pull/50979), Patrick Donnelly, Kefu Chai, Radosław Zarzyński)

- mon, qa: issue pool application warning even if pool is empty ([pr#53042](https://github.com/ceph/ceph/pull/53042), Prashant D)

- mon/ConfigMonitor: update crush\_location from osd entity ([pr#52467](https://github.com/ceph/ceph/pull/52467), Didier Gazen)

- mon/MDSMonitor: batch last\_metadata update with pending ([pr#52228](https://github.com/ceph/ceph/pull/52228), Patrick Donnelly)

- mon/MDSMonitor: check fscid in pending exists in current ([pr#52234](https://github.com/ceph/ceph/pull/52234), Patrick Donnelly)

- mon/MDSMonitor: do not propose on error in prepare\_update ([pr#52239](https://github.com/ceph/ceph/pull/52239), Patrick Donnelly)

- mon/MDSMonitor: ignore extraneous up:boot messages ([pr#52243](https://github.com/ceph/ceph/pull/52243), Patrick Donnelly)

- mon/MDSMonitor: plug paxos when maybe manipulating osdmap ([pr#52983](https://github.com/ceph/ceph/pull/52983), Patrick Donnelly)

- mon/MonClient: before complete auth with error, reopen session ([pr#52134](https://github.com/ceph/ceph/pull/52134), Nitzan Mordechai)

- mon/MonClient: resurrect original client\_mount\_timeout handling ([pr#52534](https://github.com/ceph/ceph/pull/52534), Ilya Dryomov)

- mon/Monitor<span></span>.cc: exit function if !osdmon()->is\_writeable() && mon/OSDMonitor: Added extra check before mon<span></span>.go\_recovery\_stretch\_mode() ([pr#51413](https://github.com/ceph/ceph/pull/51413), Kamoltat)

- mon: avoid exception when setting require-osd-release more than 2 ([pr#51102](https://github.com/ceph/ceph/pull/51102), Igor Fedotov)

- mon: block osd pool mksnap for fs pools ([pr#52398](https://github.com/ceph/ceph/pull/52398), Milind Changire)

- mon: Fix ceph versions command ([pr#52161](https://github.com/ceph/ceph/pull/52161), Prashant D)

- mon: fix iterator mishandling in PGMap::apply\_incremental ([pr#52553](https://github.com/ceph/ceph/pull/52553), Oliver Schmidt)

- msg/async: don't abort when public addrs mismatch bind addrs ([pr#50575](https://github.com/ceph/ceph/pull/50575), Radosław Zarzyński)

- orchestrator: add `--no-destroy` arg to `ceph orch osd rm` ([pr#51215](https://github.com/ceph/ceph/pull/51215), Guillaume Abrioux)

- orchestrator: improvements to the orch host ls command ([pr#50889](https://github.com/ceph/ceph/pull/50889), Paul Cuzner)

- os/bluestore/bluefs: fix dir\_link might add link that already exists in compact log ([pr#51002](https://github.com/ceph/ceph/pull/51002), ethanwu, Adam Kupczyk)

- os/bluestore: Add bluefs write op count metrics ([pr#51777](https://github.com/ceph/ceph/pull/51777), Joshua Baergen)

- os/bluestore: allow 'fit\_to\_fast' selector for single-volume osd ([pr#51412](https://github.com/ceph/ceph/pull/51412), Igor Fedotov)

- os/bluestore: do not signal deleted dirty file to bluefs log ([pr#48171](https://github.com/ceph/ceph/pull/48171), Igor Fedotov)

- os/bluestore: don't require bluestore\_db\_block\_size when attaching new ([pr#52941](https://github.com/ceph/ceph/pull/52941), Igor Fedotov)

- os/bluestore: fix no metadata update on truncate+fsync ([pr#48169](https://github.com/ceph/ceph/pull/48169), Igor Fedotov)

- os/bluestore: fix spillover alert ([pr#50931](https://github.com/ceph/ceph/pull/50931), Igor Fedotov)

- os/bluestore: log before assert in AvlAllocator ([pr#50319](https://github.com/ceph/ceph/pull/50319), Igor Fedotov)

- os/bluestore: proper locking for Allocators' dump methods ([pr#48170](https://github.com/ceph/ceph/pull/48170), Igor Fedotov)

- os/bluestore: proper override rocksdb::WritableFile::Allocate ([pr#51774](https://github.com/ceph/ceph/pull/51774), Igor Fedotov)

- os/bluestore: report min\_alloc\_size through "ceph osd metadata" ([pr#50505](https://github.com/ceph/ceph/pull/50505), Igor Fedotov)

- os/bluestore: use direct write in BlueStore::\_write\_bdev\_label ([pr#48279](https://github.com/ceph/ceph/pull/48279), luo rixin)

- osd, mon: add pglog dups length ([pr#47840](https://github.com/ceph/ceph/pull/47840), Nitzan Mordechai)

- osd/OpRequest: Add detailed description for delayed op in osd log file ([pr#53690](https://github.com/ceph/ceph/pull/53690), Yite Gu)

- osd/OSDCap: allow rbd<span></span>.metadata\_list method under rbd-read-only profile ([pr#51877](https://github.com/ceph/ceph/pull/51877), Ilya Dryomov)

- osd/PeeringState: fix missed `recheck\_readable` from laggy ([pr#49304](https://github.com/ceph/ceph/pull/49304), 胡玮文)

- osd/scheduler/mClockScheduler: Use same profile and client ids for all clients to ensure allocated QoS limit consumption ([pr#53092](https://github.com/ceph/ceph/pull/53092), Sridhar Seshasayee)

- osd/scheduler: Reset ephemeral changes to mClock built-in profile ([pr#51664](https://github.com/ceph/ceph/pull/51664), Sridhar Seshasayee)

- osd/scrub: verify SnapMapper consistency ([pr#52256](https://github.com/ceph/ceph/pull/52256), Ronen Friedman, Tim Serong, Kefu Chai, Adam C. Emerson)

- osd: bring the missed fmt::formatter for snapid\_t to address FTBFS ([pr#54175](https://github.com/ceph/ceph/pull/54175), Radosław Zarzyński)

- osd: Change scrub cost in case of mClock scheduler ([pr#51728](https://github.com/ceph/ceph/pull/51728), Aishwarya Mathuria)

- OSD: during test start, not all osds started due to consum map hang ([pr#51807](https://github.com/ceph/ceph/pull/51807), Nitzan Mordechai)

- OSD: Fix check\_past\_interval\_bounds() ([pr#51512](https://github.com/ceph/ceph/pull/51512), Matan Breizman, Samuel Just)

- osd: fix: slow scheduling when item\_cost is large ([pr#53860](https://github.com/ceph/ceph/pull/53860), Jrchyang Yu)

- osd: mClock recovery/backfill cost fixes ([pr#49973](https://github.com/ceph/ceph/pull/49973), Sridhar Seshasayee, Samuel Just)

- osd: set per\_pool\_stats true when OSD has no PG ([pr#48249](https://github.com/ceph/ceph/pull/48249), jindengke, lmgdlmgd)

- PendingReleaseNotes: Document mClock scheduler fixes and enhancements ([pr#51978](https://github.com/ceph/ceph/pull/51978), Sridhar Seshasayee)

- pybind/argparse: blocklist ip validation ([pr#51811](https://github.com/ceph/ceph/pull/51811), Nitzan Mordechai)

- pybind/mgr/devicehealth: do not crash if db not ready ([pr#52215](https://github.com/ceph/ceph/pull/52215), Patrick Donnelly)

- pybind/mgr/pg\_autoscaler: fix warn when not too few pgs ([pr#53675](https://github.com/ceph/ceph/pull/53675), Kamoltat)

- pybind/mgr/pg\_autoscaler: noautoscale flag retains individual pool configs ([pr#53677](https://github.com/ceph/ceph/pull/53677), Kamoltat)

- pybind/mgr/pg\_autoscaler: Reorderd if statement for the func: \_maybe\_adjust ([pr#50693](https://github.com/ceph/ceph/pull/50693), Kamoltat)

- pybind/mgr/pg\_autoscaler: Use bytes\_used for actual\_raw\_used ([pr#53725](https://github.com/ceph/ceph/pull/53725), Kamoltat)

- pybind: drop GIL during library callouts ([pr#52322](https://github.com/ceph/ceph/pull/52322), Ilya Dryomov, Patrick Donnelly)

- python-common: drive\_selection: fix KeyError when osdspec\_affinity is not set ([pr#53158](https://github.com/ceph/ceph/pull/53158), Guillaume Abrioux)

- qa/cephfs: add 'rhel' to family of RH OS in xfstest\_dev<span></span>.py ([pr#52585](https://github.com/ceph/ceph/pull/52585), Rishabh Dave)

- qa/rgw: add new POOL\_APP\_NOT\_ENABLED failures to log-ignorelist ([pr#53895](https://github.com/ceph/ceph/pull/53895), Casey Bodley)

- qa/smoke,rados,perf-basic: add POOL\_APP\_NOT\_ENABLED to ignorelist ([pr#54065](https://github.com/ceph/ceph/pull/54065), Prashant D)

- qa/standalone/osd/divergent-prior<span></span>.sh: Divergent test 3 with pg\_autoscale\_mode on pick divergent osd ([pr#52722](https://github.com/ceph/ceph/pull/52722), Nitzan Mordechai)

- qa/suites/krbd: stress test for recovering from watch errors ([pr#53785](https://github.com/ceph/ceph/pull/53785), Ilya Dryomov)

- qa/suites/rados: remove rook coverage from the rados suite ([pr#52016](https://github.com/ceph/ceph/pull/52016), Laura Flores)

- qa/suites/rados: whitelist POOL\_APP\_NOT\_ENABLED for cls tests ([pr#52137](https://github.com/ceph/ceph/pull/52137), Laura Flores)

- qa/suites/rbd: install qemu-utils in addition to qemu-block-extra on Ubuntu ([pr#51060](https://github.com/ceph/ceph/pull/51060), Ilya Dryomov)

- qa/suites/upgrade/octopus-x: skip TestClsRbd<span></span>.mirror\_snapshot test ([pr#52992](https://github.com/ceph/ceph/pull/52992), Ilya Dryomov)

- qa/suites/upgrade/quincy-p2p: skip TestClsRbd<span></span>.mirror\_snapshot test ([pr#53338](https://github.com/ceph/ceph/pull/53338), Ilya Dryomov)

- qa/suites/{rbd,krbd}: disable POOL\_APP\_NOT\_ENABLED health check ([pr#53598](https://github.com/ceph/ceph/pull/53598), Ilya Dryomov)

- qa/tasks: Changing default mClock profile to high\_recovery\_ops ([pr#51568](https://github.com/ceph/ceph/pull/51568), Aishwarya Mathuria)

- qa/upgrade/quincy-p2p: remove s3tests ([pr#54078](https://github.com/ceph/ceph/pull/54078), Casey Bodley)

- qa/upgrade: consistently use the tip of the branch as the start version ([pr#50747](https://github.com/ceph/ceph/pull/50747), Yuri Weinstein)

- qa/workunits/rados/test\_dedup\_tool<span></span>.sh: reset dedup tier during tests ([pr#51780](https://github.com/ceph/ceph/pull/51780), Myoungwon Oh)

- qa: add `POOL\_APP\_NOT\_ENABLED` to ignorelist for cephfs tests ([issue#62508](http://tracker.ceph.com/issues/62508), [issue#62482](http://tracker.ceph.com/issues/62482), [pr#53863](https://github.com/ceph/ceph/pull/53863), Venky Shankar, Patrick Donnelly)

- qa: check each fs for health ([pr#52241](https://github.com/ceph/ceph/pull/52241), Patrick Donnelly)

- qa: cleanup volumes on unwind ([pr#50766](https://github.com/ceph/ceph/pull/50766), Patrick Donnelly)

- qa: enable kclient test for newop test ([pr#50991](https://github.com/ceph/ceph/pull/50991), Xiubo Li, Dhairya Parmar)

- qa: fix cephfs-mirror unwinding and 'fs volume create/rm' order ([pr#52653](https://github.com/ceph/ceph/pull/52653), Jos Collin)

- qa: ignore expected cluster warning from damage tests ([pr#53485](https://github.com/ceph/ceph/pull/53485), Patrick Donnelly)

- qa: ignore expected scrub error ([pr#50774](https://github.com/ceph/ceph/pull/50774), Patrick Donnelly)

- qa: ignore MDS\_TRIM warnings when osd thrashing ([pr#50768](https://github.com/ceph/ceph/pull/50768), Patrick Donnelly)

- qa: output higher debugging for cephfs-journal-tool/cephfs-data-scan ([pr#50772](https://github.com/ceph/ceph/pull/50772), Patrick Donnelly)

- qa: run scrub post file system recovery ([issue#59527](http://tracker.ceph.com/issues/59527), [pr#51690](https://github.com/ceph/ceph/pull/51690), Venky Shankar)

- qa: test\_rebuild\_simple checks status on wrong file system ([pr#50922](https://github.com/ceph/ceph/pull/50922), Patrick Donnelly)

- qa: test\_recovery\_pool uses wrong recovery procedure ([pr#50767](https://github.com/ceph/ceph/pull/50767), Patrick Donnelly)

- qa: use parallel gzip for compressing logs ([pr#52952](https://github.com/ceph/ceph/pull/52952), Patrick Donnelly)

- qa: wait for file to have correct size ([pr#52743](https://github.com/ceph/ceph/pull/52743), Patrick Donnelly)

- qa: wait for MDSMonitor tick to replace daemons ([pr#52236](https://github.com/ceph/ceph/pull/52236), Patrick Donnelly)

- radosgw-admin: try reshard even if bucket is resharding ([pr#51835](https://github.com/ceph/ceph/pull/51835), Casey Bodley)

- rbd-mirror: fix image replayer shut down description on force promote ([pr#52879](https://github.com/ceph/ceph/pull/52879), Prasanna Kumar Kalever)

- rbd-mirror: fix race preventing local image deletion ([pr#52626](https://github.com/ceph/ceph/pull/52626), N Balachandran)

- rbd-wnbd: improve image map error message ([pr#52289](https://github.com/ceph/ceph/pull/52289), Lucian Petrut)

- RGW - Fix NoSuchTagSet error ([pr#50103](https://github.com/ceph/ceph/pull/50103), Daniel Gryniewicz)

- RGW - Use correct multipart upload time ([pr#51834](https://github.com/ceph/ceph/pull/51834), Daniel Gryniewicz)

- rgw multisite: complete fix for metadata sync issue ([pr#51496](https://github.com/ceph/ceph/pull/51496), Shilpa Jagannath, gengjichao)

- rgw/admin: 'bucket stats' displays non-empty time ([pr#50485](https://github.com/ceph/ceph/pull/50485), Casey Bodley)

- rgw/lua: allow bucket name override in pre request ([pr#51300](https://github.com/ceph/ceph/pull/51300), Yuval Lifshitz)

- rgw/notifications: send mtime in complete multipart upload event ([pr#50962](https://github.com/ceph/ceph/pull/50962), yuval Lifshitz)

- rgw/notifications: sending metadata in COPY and CompleteMultipartUpload ([pr#49808](https://github.com/ceph/ceph/pull/49808), yuval Lifshitz)

- rgw/rados: check\_quota() uses real bucket owner ([pr#51329](https://github.com/ceph/ceph/pull/51329), Mykola Golub, Casey Bodley)

- rgw/swift: check position of first slash in slo manifest files ([pr#51598](https://github.com/ceph/ceph/pull/51598), Marcio Roberto Starke)

- rgw/sync-policy: Correct "sync status" & "sync group" commands ([pr#53396](https://github.com/ceph/ceph/pull/53396), Soumya Koduri)

- rgw: add radosgw-admin bucket check olh/unlinked commands ([pr#53821](https://github.com/ceph/ceph/pull/53821), Cory Snyder)

- rgw: avoid string\_view to temporary in RGWBulkUploadOp ([pr#52158](https://github.com/ceph/ceph/pull/52158), Casey Bodley)

- rgw: concurrency for multi object deletes ([pr#50208](https://github.com/ceph/ceph/pull/50208), Casey Bodley, Cory Snyder)

- rgw: D3N cache objects which oid contains slash ([pr#52320](https://github.com/ceph/ceph/pull/52320), Mark Kogan)

- rgw: fetch\_remote\_obj() preserves original part lengths for BlockDecrypt ([pr#52818](https://github.com/ceph/ceph/pull/52818), Casey Bodley)

- rgw: fix 2 null versionID after convert\_plain\_entry\_to\_versioned ([pr#53399](https://github.com/ceph/ceph/pull/53399), rui ma, zhuo li)

- rgw: fix consistency bug with OLH objects ([pr#52538](https://github.com/ceph/ceph/pull/52538), Cory Snyder)

- rgw: fix FP error when calculating enteries per bi shard ([pr#53592](https://github.com/ceph/ceph/pull/53592), J. Eric Ivancich)

- rgw: fix rgw rate limiting RGWRateLimitInfo class decode\_json max\_rea… ([pr#53766](https://github.com/ceph/ceph/pull/53766), xiangrui meng)

- rgw: fix SignatureDoesNotMatch when extra headers start with 'x-amz' ([pr#53771](https://github.com/ceph/ceph/pull/53771), rui ma)

- rgw: fix unwatch crash at radosgw startup ([pr#53761](https://github.com/ceph/ceph/pull/53761), lichaochao)

- rgw: handle http options CORS with v4 auth ([pr#53414](https://github.com/ceph/ceph/pull/53414), Tobias Urdin)

- rgw: improve buffer list utilization in the chunkupload scenario ([pr#53774](https://github.com/ceph/ceph/pull/53774), liubingrun)

- rgw: LDAP fix resource leak with wrong credentials ([pr#50562](https://github.com/ceph/ceph/pull/50562), Johannes Liebl, Johannes)

- rgw: optimizations for handling ECANCELED errors from within get\_obj\_state ([pr#50892](https://github.com/ceph/ceph/pull/50892), Cory Snyder)

- rgw: pick http\_date in case of http\_x\_amz\_date absence ([pr#53441](https://github.com/ceph/ceph/pull/53441), Seena Fallah, Mohamed Awnallah)

- rgw: retry metadata cache notifications with INVALIDATE\_OBJ ([pr#52799](https://github.com/ceph/ceph/pull/52799), Casey Bodley)

- rgw: rgw\_parse\_url\_bucket() rejects empty bucket names after 'tenant:' ([pr#50625](https://github.com/ceph/ceph/pull/50625), Casey Bodley)

- rgw: s3website doesn't prefetch for web\_dir() check ([pr#53768](https://github.com/ceph/ceph/pull/53768), Casey Bodley)

- rgw: set keys from from master zone on admin api user create ([pr#51601](https://github.com/ceph/ceph/pull/51601), Ali Maredia)

- rgw: swift : check for valid key in POST forms ([pr#52739](https://github.com/ceph/ceph/pull/52739), Abhishek Lekshmanan)

- rgw: under fips & openssl 3<span></span>.x allow md5 usage in select rgw ops ([pr#51269](https://github.com/ceph/ceph/pull/51269), Mark Kogan)

- rgwlc: prevent lc for one bucket from exceeding time budget ([pr#53561](https://github.com/ceph/ceph/pull/53561), Matt Benjamin)

- test/cli-integration/rbd: iSCSI REST API responses aren't pretty-printed anymore ([pr#52283](https://github.com/ceph/ceph/pull/52283), Ilya Dryomov)

- test: correct osd pool default size ([pr#51804](https://github.com/ceph/ceph/pull/51804), Nitzan Mordechai)

- test: monitor thrasher wait until quorum ([pr#51801](https://github.com/ceph/ceph/pull/51801), Nitzan Mordechai)

- tools/ceph-dencoder: Fix incorrect type define for trash\_watcher ([pr#51779](https://github.com/ceph/ceph/pull/51779), Chen Yuanrun)

- tools/cephfs-data-scan: support for multi-datapool ([pr#50522](https://github.com/ceph/ceph/pull/50522), Mykola Golub)

- tools/cephfs: add basic detection/cleanup tool for dentry first damage ([pr#52245](https://github.com/ceph/ceph/pull/52245), Patrick Donnelly)

- tools/cephfs: include lost+found in scan\_links ([pr#50783](https://github.com/ceph/ceph/pull/50783), Patrick Donnelly)

- vstart: check mgr status after starting mgr ([pr#51603](https://github.com/ceph/ceph/pull/51603), Rongqi Sun)

- vstart: fix text format ([pr#51124](https://github.com/ceph/ceph/pull/51124), Rongqi Sun)

- win32\_deps\_build: avoid pip ([pr#51129](https://github.com/ceph/ceph/pull/51129), Lucian Petrut, Ken Dreyer)

- Wip doc 2023 04 23 backport 51178 to quincy ([pr#51185](https://github.com/ceph/ceph/pull/51185), Zac Dover)

- Wip nitzan fixing few rados/test<span></span>.sh ([pr#49938](https://github.com/ceph/ceph/pull/49938), Nitzan Mordechai)

- Wip nitzan pglog ec getattr error ([pr#49936](https://github.com/ceph/ceph/pull/49936), Nitzan Mordechai)


