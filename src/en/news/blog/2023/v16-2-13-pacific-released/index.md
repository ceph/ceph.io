---
title: "v16.2.13 Pacific released"
date: "2023-05-09"
author: "yuriw"
tags:
  - "release"
  - "pacific"
---

This is the thirteenth backport release in the Pacific series.

## Notable Changes

* CEPHFS: Rename the `mds_max_retries_on_remount_failure` option to
  `client_max_retries_on_remount_failure` and move it from mds.yaml.in to
  mds-client.yaml.in because this option was only used by MDS client from its
  birth.

* `ceph mgr dump` command now outputs `last_failure_osd_epoch` and
  `active_clients` fields at the top level.  Previously, these fields were
  output under `always_on_modules` field.

## Changelog

- backport PR #39607 ([pr#51344](https://github.com/ceph/ceph/pull/51344), Rishabh Dave)

- ceph-crash: drop privleges to run as "ceph" user, rather than root (CVE-2022-3650) ([pr#48804](https://github.com/ceph/ceph/pull/48804), Tim Serong, Guillaume Abrioux)

- ceph-mixing: fix ceph\_hosts variable ([pr#48933](https://github.com/ceph/ceph/pull/48933), Tatjana Dehler)

- ceph-volume/tests: add allowlist\_externals to tox<span></span>.ini ([pr#49789](https://github.com/ceph/ceph/pull/49789), Guillaume Abrioux)

- ceph-volume: do not raise RuntimeError in util<span></span>.lsblk ([pr#50145](https://github.com/ceph/ceph/pull/50145), Guillaume Abrioux)

- ceph-volume: fix a bug in get\_all\_devices\_vgs() ([pr#49454](https://github.com/ceph/ceph/pull/49454), Guillaume Abrioux)

- ceph-volume: fix a bug in lsblk\_all() ([pr#49869](https://github.com/ceph/ceph/pull/49869), Guillaume Abrioux)

- ceph-volume: fix issue with fast device allocs when there are multiple PVs per VG ([pr#50878](https://github.com/ceph/ceph/pull/50878), Cory Snyder)

- ceph-volume: fix regression in activate ([pr#49972](https://github.com/ceph/ceph/pull/49972), Guillaume Abrioux)

- ceph-volume: legacy\_encrypted() shouldn't call lsblk() when device is 'tmpfs' ([pr#50162](https://github.com/ceph/ceph/pull/50162), Guillaume Abrioux)

- ceph-volume: update the OS before deploying Ceph (pacific) ([pr#50996](https://github.com/ceph/ceph/pull/50996), Guillaume Abrioux)

- ceph<span></span>.spec<span></span>.in: Replace %usrmerged macro with regular version check ([pr#49830](https://github.com/ceph/ceph/pull/49830), Tim Serong)

- ceph\_fuse: retry the test\_dentry\_handling if fails ([pr#49944](https://github.com/ceph/ceph/pull/49944), Xiubo Li)

- cephadm: Adding poststop actions and setting TimeoutStartSec to 200s ([pr#50514](https://github.com/ceph/ceph/pull/50514), Redouane Kachach)

- cephadm: don't overwrite cluster logrotate file ([pr#49927](https://github.com/ceph/ceph/pull/49927), Adam King)

- cephadm: set pids-limit unlimited for all ceph daemons ([pr#50512](https://github.com/ceph/ceph/pull/50512), Adam King, Teoman ONAY)

- cephfs-top: addition of sort feature and limit option ([pr#49303](https://github.com/ceph/ceph/pull/49303), Neeraj Pratap Singh, Jos Collin)

- cephfs-top: drop curses<span></span>.A\_ITALIC ([pr#50029](https://github.com/ceph/ceph/pull/50029), Jos Collin)

- cephfs-top: Handle `METRIC\_TYPE\_NONE` fields for sorting ([pr#50597](https://github.com/ceph/ceph/pull/50597), Neeraj Pratap Singh)

- cls/rgw: remove index entry after cancelling last racing delete op ([pr#50243](https://github.com/ceph/ceph/pull/50243), Casey Bodley)

- doc/ceph-volume: fix cephadm references ([pr#50116](https://github.com/ceph/ceph/pull/50116), Piotr Parczewski)

- doc/ceph-volume: refine encryption<span></span>.rst ([pr#49793](https://github.com/ceph/ceph/pull/49793), Zac Dover)

- doc/ceph-volume: update LUKS docs ([pr#49758](https://github.com/ceph/ceph/pull/49758), Zac Dover)

- doc/cephadm/host-management: add service spec link ([pr#50255](https://github.com/ceph/ceph/pull/50255), thomas)

- doc/cephadm/troubleshooting: remove word repeat ([pr#50223](https://github.com/ceph/ceph/pull/50223), thomas)

- doc/cephadm: grammar / syntax in install<span></span>.rst ([pr#49949](https://github.com/ceph/ceph/pull/49949), Piotr Parczewski)

- doc/cephadm: Redd up compatibility<span></span>.rst ([pr#50368](https://github.com/ceph/ceph/pull/50368), Anthony D'Atri)

- doc/cephadm: update cephadm compatability and stability page ([pr#50337](https://github.com/ceph/ceph/pull/50337), Adam King)

- doc/cephfs: add note about CephFS extended attributes and getfattr ([pr#50069](https://github.com/ceph/ceph/pull/50069), Zac Dover)

- doc/cephfs: describe conf opt "client quota df" in quota doc ([pr#50253](https://github.com/ceph/ceph/pull/50253), Rishabh Dave)

- doc/cephfs: Improve fs-volumes<span></span>.rst ([pr#50832](https://github.com/ceph/ceph/pull/50832), Anthony D'Atri)

- doc/dev: add full stop to sentence in basic-wo ([pr#50401](https://github.com/ceph/ceph/pull/50401), Zac Dover)

- doc/dev: add git branch management commands ([pr#49739](https://github.com/ceph/ceph/pull/49739), Zac Dover)

- doc/dev: add Slack to Dev Guide essentials ([pr#49875](https://github.com/ceph/ceph/pull/49875), Zac Dover)

- doc/dev: backport 49908 to P (Upgrade Testing Docs) ([pr#49911](https://github.com/ceph/ceph/pull/49911), Zac Dover)

- doc/dev: format command in cephfs-mirroring ([pr#51109](https://github.com/ceph/ceph/pull/51109), Zac Dover)

- doc/dev: use underscores in config vars ([pr#49893](https://github.com/ceph/ceph/pull/49893), Ville Ojamo)

- doc/glossary: add "application" to the glossary ([pr#50259](https://github.com/ceph/ceph/pull/50259), Zac Dover)

- doc/glossary: add "Bucket" ([pr#50225](https://github.com/ceph/ceph/pull/50225), Zac Dover)

- doc/glossary: add "client" to glossary ([pr#50263](https://github.com/ceph/ceph/pull/50263), Zac Dover)

- doc/glossary: add "Hybrid Storage" ([pr#51098](https://github.com/ceph/ceph/pull/51098), Zac Dover)

- doc/glossary: add "Period" to glossary ([pr#50156](https://github.com/ceph/ceph/pull/50156), Zac Dover)

- doc/glossary: add "Placement Groups" definition ([pr#51186](https://github.com/ceph/ceph/pull/51186), Zac Dover)

- doc/glossary: add "realm" to glossary ([pr#50135](https://github.com/ceph/ceph/pull/50135), Zac Dover)

- doc/glossary: add "Scrubbing" ([pr#50703](https://github.com/ceph/ceph/pull/50703), Zac Dover)

- doc/glossary: add "User" ([pr#50673](https://github.com/ceph/ceph/pull/50673), Zac Dover)

- doc/glossary: Add "zone" to glossary<span></span>.rst ([pr#50272](https://github.com/ceph/ceph/pull/50272), Zac Dover)

- doc/glossary: add AWS/OpenStack bucket info ([pr#50248](https://github.com/ceph/ceph/pull/50248), Zac Dover)

- doc/glossary: improve "CephX" entry ([pr#51065](https://github.com/ceph/ceph/pull/51065), Zac Dover)

- doc/glossary: link to CephX Config ref ([pr#50709](https://github.com/ceph/ceph/pull/50709), Zac Dover)

- doc/index: remove "uniquely" from landing page ([pr#50478](https://github.com/ceph/ceph/pull/50478), Zac Dover)

- doc/install: link to "cephadm installing ceph" ([pr#49782](https://github.com/ceph/ceph/pull/49782), Zac Dover)

- doc/install: refine index<span></span>.rst ([pr#50436](https://github.com/ceph/ceph/pull/50436), Zac Dover)

- doc/install: update index<span></span>.rst ([pr#50433](https://github.com/ceph/ceph/pull/50433), Zac Dover)

- doc/mgr/prometheus: fix confval reference ([pr#51094](https://github.com/ceph/ceph/pull/51094), Piotr Parczewski)

- doc/msgr2: update dual stack status ([pr#50801](https://github.com/ceph/ceph/pull/50801), Dan van der Ster)

- doc/operations: fix prompt in bluestore-migration ([pr#50663](https://github.com/ceph/ceph/pull/50663), Zac Dover)

- doc/rados/config: edit auth-config-ref ([pr#50951](https://github.com/ceph/ceph/pull/50951), Zac Dover)

- doc/rados/operations: edit monitoring<span></span>.rst ([pr#51037](https://github.com/ceph/ceph/pull/51037), Zac Dover)

- doc/rados/operations: Fix double prompt ([pr#49899](https://github.com/ceph/ceph/pull/49899), Ville Ojamo)

- doc/rados/operations: Fix indentation ([pr#49896](https://github.com/ceph/ceph/pull/49896), Ville Ojamo)

- doc/rados/operations: Fix typo in erasure-code<span></span>.rst ([pr#50753](https://github.com/ceph/ceph/pull/50753), Sainithin Artham)

- doc/rados/operations: Improve wording, capitalization, formatting ([pr#50454](https://github.com/ceph/ceph/pull/50454), Anthony D'Atri)

- doc/rados/ops: add ceph-medic documentation ([pr#50854](https://github.com/ceph/ceph/pull/50854), Zac Dover)

- doc/rados/ops: add hyphen to mon-osd-pg<span></span>.rst ([pr#50961](https://github.com/ceph/ceph/pull/50961), Zac Dover)

- doc/rados/ops: edit health checks<span></span>.rst (5 of x) ([pr#50968](https://github.com/ceph/ceph/pull/50968), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (1 of x) ([pr#50798](https://github.com/ceph/ceph/pull/50798), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (2 of x) ([pr#50913](https://github.com/ceph/ceph/pull/50913), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (3 of x) ([pr#50954](https://github.com/ceph/ceph/pull/50954), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (4 of x) ([pr#50957](https://github.com/ceph/ceph/pull/50957), Zac Dover)

- doc/rados/ops: edit health-checks<span></span>.rst (6 of x) ([pr#50971](https://github.com/ceph/ceph/pull/50971), Zac Dover)

- doc/rados/ops: edit monitoring-osd-pg<span></span>.rst (1 of x) ([pr#50866](https://github.com/ceph/ceph/pull/50866), Zac Dover)

- doc/rados/ops: edit monitoring-osd-pg<span></span>.rst (2 of x) ([pr#50947](https://github.com/ceph/ceph/pull/50947), Zac Dover)

- doc/rados/ops: line-edit operating<span></span>.rst ([pr#50935](https://github.com/ceph/ceph/pull/50935), Zac Dover)

- doc/rados/ops: remove ceph-medic from monitoring ([pr#51089](https://github.com/ceph/ceph/pull/51089), Zac Dover)

- doc/rados: add link to ops/health-checks<span></span>.rst ([pr#50763](https://github.com/ceph/ceph/pull/50763), Zac Dover)

- doc/rados: clean up ops/bluestore-migration<span></span>.rst ([pr#50679](https://github.com/ceph/ceph/pull/50679), Zac Dover)

- doc/rados: edit operations/bs-migration (1 of x) ([pr#50588](https://github.com/ceph/ceph/pull/50588), Zac Dover)

- doc/rados: edit operations/bs-migration (2 of x) ([pr#50591](https://github.com/ceph/ceph/pull/50591), Zac Dover)

- doc/rados: edit ops/monitoring<span></span>.rst (1 of 3) ([pr#50824](https://github.com/ceph/ceph/pull/50824), Zac Dover)

- doc/rados: edit ops/monitoring<span></span>.rst (2 of 3) ([pr#50850](https://github.com/ceph/ceph/pull/50850), Zac Dover)

- doc/rados: edit user-management<span></span>.rst (1 of x) ([pr#50642](https://github.com/ceph/ceph/pull/50642), Zac Dover)

- doc/rados: line edit mon-lookup-dns top matter ([pr#50583](https://github.com/ceph/ceph/pull/50583), Zac Dover)

- doc/rados: line-edit common<span></span>.rst ([pr#50944](https://github.com/ceph/ceph/pull/50944), Zac Dover)

- doc/rados: line-edit erasure-code<span></span>.rst ([pr#50620](https://github.com/ceph/ceph/pull/50620), Zac Dover)

- doc/rados: line-edit pg-repair<span></span>.rst ([pr#50804](https://github.com/ceph/ceph/pull/50804), Zac Dover)

- doc/rados: line-edit upmap<span></span>.rst ([pr#50567](https://github.com/ceph/ceph/pull/50567), Zac Dover)

- doc/rados: refine ceph-conf<span></span>.rst ([pr#49833](https://github.com/ceph/ceph/pull/49833), Zac Dover)

- doc/rados: refine pool-pg-config-ref<span></span>.rst ([pr#49822](https://github.com/ceph/ceph/pull/49822), Zac Dover)

- doc/rados: update OSD\_BACKFILLFULL description ([pr#50219](https://github.com/ceph/ceph/pull/50219), Ponnuvel Palaniyappan)

- doc/radosgw: format admonitions ([pr#50357](https://github.com/ceph/ceph/pull/50357), Zac Dover)

- doc/radosgw: format part of s3select ([pr#51118](https://github.com/ceph/ceph/pull/51118), Cole Mitchell)

- doc/radosgw: format part of s3select ([pr#51106](https://github.com/ceph/ceph/pull/51106), Cole Mitchell)

- doc/radosgw: multisite - edit "functional changes" ([pr#50278](https://github.com/ceph/ceph/pull/50278), Zac Dover)

- doc/radosgw: refine "Maintenance" in multisite<span></span>.rst ([pr#50026](https://github.com/ceph/ceph/pull/50026), Zac Dover)

- doc/radosgw: s/execute/run/ in multisite<span></span>.rst ([pr#50174](https://github.com/ceph/ceph/pull/50174), Zac Dover)

- doc/radosgw: s/zone group/zonegroup/g et alia ([pr#50298](https://github.com/ceph/ceph/pull/50298), Zac Dover)

- doc/rbd/rbd-exclusive-locks: warn about automatic lock transitions ([pr#49805](https://github.com/ceph/ceph/pull/49805), Ilya Dryomov)

- doc/rbd: format iscsi-initiator-linux<span></span>.rbd better ([pr#49750](https://github.com/ceph/ceph/pull/49750), Zac Dover)

- doc/rgw - fix grammar in table in s3<span></span>.rst ([pr#50389](https://github.com/ceph/ceph/pull/50389), Zac Dover)

- doc/rgw: "Migrating Single Site to Multi-Site" ([pr#50094](https://github.com/ceph/ceph/pull/50094), Zac Dover)

- doc/rgw: caption a diagram ([pr#50294](https://github.com/ceph/ceph/pull/50294), Zac Dover)

- doc/rgw: clarify multisite<span></span>.rst top matter ([pr#50205](https://github.com/ceph/ceph/pull/50205), Zac Dover)

- doc/rgw: clean zone-sync<span></span>.svg ([pr#50363](https://github.com/ceph/ceph/pull/50363), Zac Dover)

- doc/rgw: fix caption ([pr#50396](https://github.com/ceph/ceph/pull/50396), Zac Dover)

- doc/rgw: improve diagram caption ([pr#50332](https://github.com/ceph/ceph/pull/50332), Zac Dover)

- doc/rgw: multisite ref<span></span>. top matter cleanup ([pr#50190](https://github.com/ceph/ceph/pull/50190), Zac Dover)

- doc/rgw: refine "Configuring Secondary Zones" ([pr#50075](https://github.com/ceph/ceph/pull/50075), Zac Dover)

- doc/rgw: refine "Failover and Disaster Recovery" ([pr#50079](https://github.com/ceph/ceph/pull/50079), Zac Dover)

- doc/rgw: refine "Multi-site Config Ref" (1 of x) ([pr#50118](https://github.com/ceph/ceph/pull/50118), Zac Dover)

- doc/rgw: refine "Realms" section ([pr#50140](https://github.com/ceph/ceph/pull/50140), Zac Dover)

- doc/rgw: refine "Setting a Zonegroup" ([pr#51073](https://github.com/ceph/ceph/pull/51073), Zac Dover)

- doc/rgw: refine "Zones" in multisite<span></span>.rst ([pr#49983](https://github.com/ceph/ceph/pull/49983), Zac Dover)

- doc/rgw: refine 1-50 of multisite<span></span>.rst ([pr#49996](https://github.com/ceph/ceph/pull/49996), Zac Dover)

- doc/rgw: refine keycloak<span></span>.rst ([pr#50379](https://github.com/ceph/ceph/pull/50379), Zac Dover)

- doc/rgw: refine multisite to "config 2ndary zones" ([pr#50032](https://github.com/ceph/ceph/pull/50032), Zac Dover)

- doc/rgw: refine ~50-~140 of multisite<span></span>.rst ([pr#50009](https://github.com/ceph/ceph/pull/50009), Zac Dover)

- doc/rgw: remove "tertiary", link to procedure ([pr#50288](https://github.com/ceph/ceph/pull/50288), Zac Dover)

- doc/rgw: s/[Zz]one [Gg]roup/zonegroup/g ([pr#50137](https://github.com/ceph/ceph/pull/50137), Zac Dover)

- doc/rgw: session-tags<span></span>.rst - fix link to keycloak ([pr#50188](https://github.com/ceph/ceph/pull/50188), Zac Dover)

- doc/start: add RST escape character rules for bold ([pr#49752](https://github.com/ceph/ceph/pull/49752), Zac Dover)

- doc/start: documenting-ceph - add squash procedure ([pr#50741](https://github.com/ceph/ceph/pull/50741), Zac Dover)

- doc/start: edit first 150 lines of documenting-ceph ([pr#51183](https://github.com/ceph/ceph/pull/51183), Zac Dover)

- doc/start: format procedure in documenting-ceph ([pr#50789](https://github.com/ceph/ceph/pull/50789), Zac Dover)

- doc/start: update "notify us" section ([pr#50771](https://github.com/ceph/ceph/pull/50771), Zac Dover)

- doc: add the damage types that scrub can repair ([pr#49933](https://github.com/ceph/ceph/pull/49933), Neeraj Pratap Singh)

- doc: document debugging for libcephsqlite ([pr#50034](https://github.com/ceph/ceph/pull/50034), Patrick Donnelly)

- doc: preen cephadm/troubleshooting<span></span>.rst and radosgw/placement<span></span>.rst ([pr#50229](https://github.com/ceph/ceph/pull/50229), Anthony D'Atri)

- drive\_group: fix limit filter in drive\_selection<span></span>.selector ([pr#50371](https://github.com/ceph/ceph/pull/50371), Guillaume Abrioux)

- kv/RocksDBStore: Add CompactOnDeletion support ([pr#50894](https://github.com/ceph/ceph/pull/50894), Radoslaw Zarzynski, Mark Nelson)

- libcephsqlite: CheckReservedLock the result will always be zero ([pr#50036](https://github.com/ceph/ceph/pull/50036), Shuai Wang)

- librbd/crypto: fix bad return checks from libcryptsetup ([pr#49413](https://github.com/ceph/ceph/pull/49413), Or Ozeri)

- librbd: avoid EUCLEAN error after "rbd rm" is interrupted ([pr#50129](https://github.com/ceph/ceph/pull/50129), weixinwei)

- librbd: call apply\_changes() after setting librados\_thread\_count ([pr#50289](https://github.com/ceph/ceph/pull/50289), Ilya Dryomov)

- librbd: Fix local rbd mirror journals growing forever ([pr#50158](https://github.com/ceph/ceph/pull/50158), Ilya Dryomov, Josef Johansson)

- librbd: fix wrong attribute for rbd\_quiesce\_complete API ([pr#50872](https://github.com/ceph/ceph/pull/50872), Dongsheng Yang)

- librbd: report better errors when failing to enable mirroring on an image ([pr#50836](https://github.com/ceph/ceph/pull/50836), Prasanna Kumar Kalever)

- mds/PurgeQueue: don't consider filer\_max\_purge\_ops when \_calculate\_ops ([pr#49656](https://github.com/ceph/ceph/pull/49656), haoyixing)

- mds/Server: do not allow -ve reclaim flags to cause client eviction ([pr#49956](https://github.com/ceph/ceph/pull/49956), Dhairya Parmar)

- mds: account for snapshot items when deciding to split or merge a directory ([issue#55215](http://tracker.ceph.com/issues/55215), [pr#49867](https://github.com/ceph/ceph/pull/49867), Venky Shankar)

- mds: avoid ~mdsdir's scrubbing and reporting damage health status ([pr#49440](https://github.com/ceph/ceph/pull/49440), Neeraj Pratap Singh)

- mds: catch damage to CDentry's first member before persisting ([issue#58482](http://tracker.ceph.com/issues/58482), [pr#50781](https://github.com/ceph/ceph/pull/50781), Patrick Donnelly)

- mds: do not acquire xlock in xlockdone state ([pr#49538](https://github.com/ceph/ceph/pull/49538), Igor Fedotov)

- mds: fix and skip submitting invalid osd request ([pr#49941](https://github.com/ceph/ceph/pull/49941), Xiubo Li)

- mds: fix scan\_stray\_dir not reset next<span></span>.frag on each run of stray inode ([pr#49669](https://github.com/ceph/ceph/pull/49669), ethanwu)

- mds: md\_log\_replay thread blocks waiting to be woken up ([pr#49671](https://github.com/ceph/ceph/pull/49671), zhikuodu)

- mds: switch submit\_mutex to fair mutex for MDLog ([pr#49632](https://github.com/ceph/ceph/pull/49632), Xiubo Li)

- mgr/cephadm: add ingress support for ssl rgw service ([pr#49917](https://github.com/ceph/ceph/pull/49917), Frank Ederveen)

- mgr/cephadm: be aware of host's shortname and FQDN ([pr#50516](https://github.com/ceph/ceph/pull/50516), Adam King)

- mgr/cephadm: call iscsi post\_remove from serve loop ([pr#49928](https://github.com/ceph/ceph/pull/49928), Adam King)

- mgr/cephadm: don't add mgr into iscsi trusted\_ip\_list if it's already there ([pr#50515](https://github.com/ceph/ceph/pull/50515), Mykola Golub)

- mgr/cephadm: don't say migration in progress if migration current > migration last ([pr#49919](https://github.com/ceph/ceph/pull/49919), Adam King)

- mgr/cephadm: fix backends service in haproxy config with multiple nfs of same rank ([pr#50511](https://github.com/ceph/ceph/pull/50511), Adam King)

- mgr/cephadm: fix check for if devices have changed ([pr#49916](https://github.com/ceph/ceph/pull/49916), Adam King)

- mgr/cephadm: fix handling of mgr upgrades with 3 or more mgrs ([pr#49921](https://github.com/ceph/ceph/pull/49921), Adam King)

- mgr/cephadm: Fix how we check if a host belongs to public network ([pr#50007](https://github.com/ceph/ceph/pull/50007), Redouane Kachach)

- mgr/cephadm: fix removing offline hosts with ingress daemons ([pr#49926](https://github.com/ceph/ceph/pull/49926), Adam King)

- mgr/cephadm: increase ingress timeout values ([pr#49923](https://github.com/ceph/ceph/pull/49923), Frank Ederveen)

- mgr/cephadm: iscsi username and password defaults to admin ([pr#49310](https://github.com/ceph/ceph/pull/49310), Nizamudeen A)

- mgr/cephadm: some master -> main cleanup ([pr#49285](https://github.com/ceph/ceph/pull/49285), Adam King)

- mgr/cephadm: specify ports for iscsi ([pr#49918](https://github.com/ceph/ceph/pull/49918), Adam King)

- mgr/cephadm: support for extra entrypoint args ([pr#49925](https://github.com/ceph/ceph/pull/49925), Adam King)

- mgr/cephadm: try to avoid pull when getting container image info ([pr#50513](https://github.com/ceph/ceph/pull/50513), Mykola Golub, Adam King)

- mgr/cephadm: write client files after applying services ([pr#49920](https://github.com/ceph/ceph/pull/49920), Adam King)

- mgr/dashboard: add tooltip mirroring pools table ([pr#49503](https://github.com/ceph/ceph/pull/49503), Pedro Gonzalez Gomez)

- mgr/dashboard: added pattern validaton for form input ([pr#47330](https://github.com/ceph/ceph/pull/47330), Pedro Gonzalez Gomez)

- mgr/dashboard: custom image for kcli bootstrap script ([pr#50917](https://github.com/ceph/ceph/pull/50917), Nizamudeen A)

- mgr/dashboard: fix "can't read <span></span>.ssh/known\_hosts: No such file or directory ([pr#50123](https://github.com/ceph/ceph/pull/50123), Nizamudeen A)

- mgr/dashboard: fix cephadm e2e expression changed error ([pr#51081](https://github.com/ceph/ceph/pull/51081), Nizamudeen A)

- mgr/dashboard: fix create osd default selected as recommended not working ([pr#51038](https://github.com/ceph/ceph/pull/51038), Nizamudeen A)

- mgr/dashboard: fix displaying mirror image progress ([pr#50870](https://github.com/ceph/ceph/pull/50870), Pere Diaz Bou)

- mgr/dashboard: fix eviction of all FS clients ([pr#51009](https://github.com/ceph/ceph/pull/51009), Pere Diaz Bou)

- mgr/dashboard: fix weird data in osd details ([pr#50121](https://github.com/ceph/ceph/pull/50121), Pedro Gonzalez Gomez, Nizamudeen A)

- mgr/dashboard: force TLS 1<span></span>.3 ([pr#50527](https://github.com/ceph/ceph/pull/50527), Ernesto Puerta)

- mgr/dashboard: Hide maintenance option on expand cluster ([pr#47725](https://github.com/ceph/ceph/pull/47725), Nizamudeen A)

- mgr/dashboard: ignore the rules 400 error in dashboard kcli e2e ([pr#50914](https://github.com/ceph/ceph/pull/50914), Nizamudeen A)

- mgr/dashboard: osd form preselect db/wal device filters ([pr#50122](https://github.com/ceph/ceph/pull/50122), Nizamudeen A)

- mgr/dashboard: Replace vonage-status-panel with native grafana stat panel ([pr#50044](https://github.com/ceph/ceph/pull/50044), Aashish Sharma)

- mgr/nfs: add sectype option ([pr#49929](https://github.com/ceph/ceph/pull/49929), John Mulligan)

- mgr/orchestrator: fix upgrade status help message ([pr#49922](https://github.com/ceph/ceph/pull/49922), Adam King)

- mgr/prometheus: export zero valued pg state metrics ([pr#49786](https://github.com/ceph/ceph/pull/49786), Avan Thakkar)

- mgr/prometheus: expose daemon health metrics ([pr#49520](https://github.com/ceph/ceph/pull/49520), Pere Diaz Bou)

- mgr/prometheus: fix module crash when trying to collect OSDs metrics ([pr#49931](https://github.com/ceph/ceph/pull/49931), Redouane Kachach)

- mgr/rbd\_support: remove localized schedule option during module startup ([pr#49650](https://github.com/ceph/ceph/pull/49650), Ramana Raja)

- mgr/snap\_schedule: replace <span></span>.snap with the client configured snap dir name ([pr#47726](https://github.com/ceph/ceph/pull/47726), Neeraj Pratap Singh)

- mon/MgrMap: dump last\_failure\_osd\_epoch and active\_clients at top level ([pr#50305](https://github.com/ceph/ceph/pull/50305), Ilya Dryomov)

- mon/MonCommands: Support dump\_historic\_slow\_ops ([pr#49233](https://github.com/ceph/ceph/pull/49233), Matan Breizman)

- mon: bail from handle\_command() if \_generate\_command\_map() fails ([pr#48846](https://github.com/ceph/ceph/pull/48846), Nikhil Kshirsagar)

- mon: disable snap id allocation for fsmap pools ([pr#50050](https://github.com/ceph/ceph/pull/50050), Milind Changire)

- mon: Fix condition to check for ceph version mismatch ([pr#49988](https://github.com/ceph/ceph/pull/49988), Prashant D)

- os/bluestore: fix onode ref counting ([pr#50072](https://github.com/ceph/ceph/pull/50072), Igor Fedotov)

- os/memstore: Fix memory leak ([pr#50092](https://github.com/ceph/ceph/pull/50092), Adam Kupczyk)

- pybind/mgr: check for empty metadata mgr\_module:get\_metadata() ([issue#57072](http://tracker.ceph.com/issues/57072), [pr#49966](https://github.com/ceph/ceph/pull/49966), Venky Shankar)

- qa/rgw: use symlinks to specify distro ([pr#50940](https://github.com/ceph/ceph/pull/50940), Casey Bodley)

- qa/suites/rbd: fix sporadic "rx-only direction" test failures ([pr#50112](https://github.com/ceph/ceph/pull/50112), Ilya Dryomov)

- qa/suites/rgw: fix and update tempest and barbican tests ([pr#50000](https://github.com/ceph/ceph/pull/50000), Tobias Urdin)

- qa/tasks/cephadm<span></span>.py: fix pulling cephadm from git<span></span>.ceph<span></span>.com ([pr#49915](https://github.com/ceph/ceph/pull/49915), Adam King)

- qa/tests: added pacific client upgrade => reef ([pr#50352](https://github.com/ceph/ceph/pull/50352), Yuri Weinstein)

- qa: check each fs for health ([pr#51232](https://github.com/ceph/ceph/pull/51232), Patrick Donnelly)

- qa: ignore expected scrub error ([pr#50775](https://github.com/ceph/ceph/pull/50775), Patrick Donnelly)

- qa: ignore MDS\_TRIM warnings when osd thrashing ([pr#50757](https://github.com/ceph/ceph/pull/50757), Patrick Donnelly)

- qa: lengthen health warning wait ([pr#50760](https://github.com/ceph/ceph/pull/50760), Patrick Donnelly)

- qa: load file system info if not created ([pr#50923](https://github.com/ceph/ceph/pull/50923), Patrick Donnelly)

- qa: test the "ms\_mode" options in kclient workflows ([pr#50712](https://github.com/ceph/ceph/pull/50712), Jeff Layton)

- qa: test\_recovery\_pool uses wrong recovery procedure ([pr#50860](https://github.com/ceph/ceph/pull/50860), Patrick Donnelly)

- qa: wait for scrub to finish ([pr#49458](https://github.com/ceph/ceph/pull/49458), Milind Changire)

- rbd-mirror: add information about the last snapshot sync to image status ([pr#50265](https://github.com/ceph/ceph/pull/50265), Divyansh Kamboj)

- rbd-mirror: fix syncing\_percent calculation logic in get\_replay\_status() ([pr#50181](https://github.com/ceph/ceph/pull/50181), N Balachandran)

- rgw/beast: fix interaction between keepalive and 100-continue ([pr#49841](https://github.com/ceph/ceph/pull/49841), Casey Bodley, Yixin Jin)

- rgw/coroutine: check for null stack on wakeup ([pr#49097](https://github.com/ceph/ceph/pull/49097), Casey Bodley)

- rgw/s3: dump Message field in Error response even if empty ([pr#51200](https://github.com/ceph/ceph/pull/51200), Casey Bodley)

- rgw: "reshard cancel" errors with "invalid argument" ([pr#49091](https://github.com/ceph/ceph/pull/49091), J. Eric Ivancich)

- rgw: adding BUCKET\_REWRITE and OBJECT\_REWRITE OPS to ([pr#49095](https://github.com/ceph/ceph/pull/49095), Pritha Srivastava)

- rgw: an empty tagset is allowed by S3 ([pr#49809](https://github.com/ceph/ceph/pull/49809), Volker Theile, Liu Lan)

- rgw: Backport of issue 57562 to Pacific ([pr#49682](https://github.com/ceph/ceph/pull/49682), Adam C. Emerson)

- rgw: bucket list operation slow down in special scenario ([pr#49086](https://github.com/ceph/ceph/pull/49086), zealot)

- rgw: concurrency for multi object deletes ([pr#49327](https://github.com/ceph/ceph/pull/49327), Casey Bodley, Cory Snyder)

- rgw: fix the problem of duplicate idx when bi list ([pr#49829](https://github.com/ceph/ceph/pull/49829), wangtengfei)

- rgw: optimizations for handling ECANCELED errors from within get\_obj\_state ([pr#50886](https://github.com/ceph/ceph/pull/50886), Cory Snyder)

- rgw: rgw\_parse\_url\_bucket() rejects empty bucket names after 'tenant:' ([pr#50624](https://github.com/ceph/ceph/pull/50624), Casey Bodley)

- rgw: RGWPutLC does not require Content-MD5 ([pr#49089](https://github.com/ceph/ceph/pull/49089), Casey Bodley)

- tools/cephfs: include lost+found in scan\_links ([pr#50784](https://github.com/ceph/ceph/pull/50784), Patrick Donnelly)

- Wip nitzan pglog ec getattr error ([pr#49937](https://github.com/ceph/ceph/pull/49937), Nitzan Mordechai)

