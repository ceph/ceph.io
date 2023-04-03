---
title: "v17.2.6 Quincy released"
date: "2023-04-07"
author: "yuriw"
tags:
  - "release"
  - "quincy"
---

This is the sixth backport release in the Quincy series. We recommend all users update to this release.

## Notable Changes

- `ceph mgr dump` command now outputs `last_failure_osd_epoch` and
  `active_clients` fields at the top level.  Previously, these fields were
  output under `always_on_modules` field.

- telemetry: Added new metrics to the 'basic' channel to report per-pool bluestore
  compression metrics. See a sample report with `ceph telemetry preview`.
  Opt-in with `ceph telemetry on`.

## Changelog

- msg/async: don't abort when public addrs mismatch bind addrs ([pr#50575](https://github.com/ceph/ceph/pull/50575),         Radoslaw Zarzynski)

- rgw: rgw_parse_url_bucket() rejects empty bucket names after 'tenant:' ([pr#50625](https://github.com/ceph/ceph/pull/        50625), Casey Bodley)

- os/bluestore: Improve deferred write decision ([pr#49333](https://github.com/ceph/ceph/pull/49333), Adam Kupczyk, Igor Fedotov)

- rgw/cloud-transition: Fix issues with MCG endpoint ([pr#49061](https://github.com/ceph/ceph/pull/49061), Soumya Koduri)

- Add per OSD crush\_device\_class definition ([pr#50444](https://github.com/ceph/ceph/pull/50444), Francesco Pantano)

- ceph-crash: drop privleges to run as "ceph" user, rather than root (CVE-2022-3650) ([pr#48805](https://github.com/ceph/ceph/pull/48805), Tim Serong, Guillaume Abrioux)

- ceph-dencoder: Add erasure\_code to denc-mod-osd's target\_link\_libraries ([pr#48028](https://github.com/ceph/ceph/pull/48028), Tim Serong)

- ceph-exporter: cephadm changes ([pr#49771](https://github.com/ceph/ceph/pull/49771), Avan Thakkar)

- ceph-mixing: fix ceph\_hosts variable ([pr#48934](https://github.com/ceph/ceph/pull/48934), Tatjana Dehler)

- ceph-volume/tests: add allowlist\_externals to tox<span></span>.ini ([pr#49788](https://github.com/ceph/ceph/pull/49788), Guillaume Abrioux)

- ceph-volume/tests: fix lvm centos8-filestore-create job ([pr#48122](https://github.com/ceph/ceph/pull/48122), Guillaume Abrioux)

- ceph-volume: add a retry in util<span></span>.disk<span></span>.remove\_partition ([pr#47989](https://github.com/ceph/ceph/pull/47989), Guillaume Abrioux)

- ceph-volume: do not raise RuntimeError in util<span></span>.lsblk ([pr#50144](https://github.com/ceph/ceph/pull/50144), Guillaume Abrioux)

- ceph-volume: fix a bug in get\_all\_devices\_vgs() ([pr#49453](https://github.com/ceph/ceph/pull/49453), Guillaume Abrioux)

- ceph-volume: fix a bug in lsblk\_all() ([pr#49868](https://github.com/ceph/ceph/pull/49868), Guillaume Abrioux)

- ceph-volume: legacy\_encrypted() shouldn't call lsblk() when device is 'tmpfs' ([pr#50161](https://github.com/ceph/ceph/pull/50161), Guillaume Abrioux)

- ceph<span></span>.spec<span></span>.in: disable system\_pmdk on s390x for SUSE distros ([pr#48522](https://github.com/ceph/ceph/pull/48522), Tim Serong)

- ceph<span></span>.spec<span></span>.in: Replace %usrmerged macro with regular version check ([pr#49831](https://github.com/ceph/ceph/pull/49831), Tim Serong)

- ceph<span></span>.spec<span></span>.in: Use gcc11-c++ on openSUSE Leap 15<span></span>.x ([pr#48058](https://github.com/ceph/ceph/pull/48058), Tim Serong)

- ceph\_fuse: retry the test\_dentry\_handling if fails ([pr#49942](https://github.com/ceph/ceph/pull/49942), Xiubo Li)

- cephadm: add `ip\_nonlocal\_bind` to haproxy deployment ([pr#48211](https://github.com/ceph/ceph/pull/48211), Michael Fritch)

- cephadm: Adding poststop actions and setting TimeoutStartSec to 200s ([pr#50447](https://github.com/ceph/ceph/pull/50447), Redouane Kachach)

- cephadm: consider stdout to get container version ([pr#48208](https://github.com/ceph/ceph/pull/48208), Tatjana Dehler)

- cephadm: don't overwrite cluster logrotate file ([pr#49849](https://github.com/ceph/ceph/pull/49849), Adam King)

- cephadm: Fix disk size calculation ([pr#47945](https://github.com/ceph/ceph/pull/47945), Paul Cuzner)

- cephadm: only pull host info from applied spec, don't try to parse yaml ([pr#49854](https://github.com/ceph/ceph/pull/49854), Adam King)

- cephadm: pin flake8 to 5<span></span>.0<span></span>.4 ([pr#49059](https://github.com/ceph/ceph/pull/49059), Kefu Chai)

- cephadm: run tests as root ([pr#48434](https://github.com/ceph/ceph/pull/48434), Kefu Chai)

- cephadm: set pids-limit unlimited for all ceph daemons ([pr#50448](https://github.com/ceph/ceph/pull/50448), Adam King, Teoman ONAY)

- cephadm: support quotes around public/cluster network in config passed to bootstrap ([pr#47660](https://github.com/ceph/ceph/pull/47660), Adam King)

- cephadm: using short hostname to create the initial mon and mgr ([pr#50445](https://github.com/ceph/ceph/pull/50445), Redouane Kachach)

- cephfs-data-scan: make scan\_links more verbose ([pr#48442](https://github.com/ceph/ceph/pull/48442), Mykola Golub)

- cephfs-top, mgr/stats: multiple file system support with UI ([pr#47820](https://github.com/ceph/ceph/pull/47820), Neeraj Pratap Singh)

- cephfs-top: addition of sort feature and limit option ([pr#50151](https://github.com/ceph/ceph/pull/50151), Neeraj Pratap Singh, Jos Collin)

- cephfs-top: make cephfs-top display scrollable ([pr#48677](https://github.com/ceph/ceph/pull/48677), Jos Collin)

- client: abort the client if we couldn't invalidate dentry caches ([pr#48110](https://github.com/ceph/ceph/pull/48110), Xiubo Li)

- client: do not uninline data for read ([pr#48132](https://github.com/ceph/ceph/pull/48132), Xiubo Li)

- client: fix incorrectly showing the <span></span>.snap size for stat ([pr#48414](https://github.com/ceph/ceph/pull/48414), Xiubo Li)

- client: stop the remount\_finisher thread in the Client::unmount() ([pr#48107](https://github.com/ceph/ceph/pull/48107), Xiubo Li)

- client: use parent directory POSIX ACLs for snapshot dir ([issue#57084](http://tracker.ceph.com/issues/57084), [pr#48563](https://github.com/ceph/ceph/pull/48563), Venky Shankar)

- cls/queue: use larger read chunks in queue\_list\_entries ([pr#49902](https://github.com/ceph/ceph/pull/49902), Igor Fedotov)

- cls/rbd: update last\_read in group::snap\_list ([pr#49196](https://github.com/ceph/ceph/pull/49196), Ilya Dryomov, Prasanna Kumar Kalever)

- cls/rgw: remove index entry after cancelling last racing delete op ([pr#50241](https://github.com/ceph/ceph/pull/50241), Casey Bodley)

- cmake: bump node version to 14 ([pr#50231](https://github.com/ceph/ceph/pull/50231), Nizamudeen A)

- cmake: re-enable TCMalloc and allocator related cleanups ([pr#47927](https://github.com/ceph/ceph/pull/47927), Kefu Chai)

- CODEOWNERS: assign qa/workunits/windows to RBD ([pr#50304](https://github.com/ceph/ceph/pull/50304), Ilya Dryomov)

- common/ceph\_context: leak some memory fail to show in valgrind ([pr#47933](https://github.com/ceph/ceph/pull/47933), Nitzan Mordechai)

- common: fix build with GCC 13 (missing <cstdint> include) ([pr#48719](https://github.com/ceph/ceph/pull/48719), Sam James)

- common: notify all when max backlog reached in OutputDataSocket ([pr#47233](https://github.com/ceph/ceph/pull/47233), Shu Yu)

- compressor: fix rpmbuild on RHEL-8 ([pr#48314](https://github.com/ceph/ceph/pull/48314), Andriy Tkachuk)

- doc/\_static: add scroll-margin-top to custom<span></span>.css ([pr#49644](https://github.com/ceph/ceph/pull/49644), Zac Dover)

- doc/architecture: correct PDF link ([pr#48795](https://github.com/ceph/ceph/pull/48795), Zac Dover)

- doc/ceph-volume: add A<span></span>. D'Atri's suggestions ([pr#48645](https://github.com/ceph/ceph/pull/48645), Zac Dover)

- doc/ceph-volume: fix cephadm references ([pr#50115](https://github.com/ceph/ceph/pull/50115), Piotr Parczewski)

- doc/ceph-volume: improve prepare<span></span>.rst ([pr#48668](https://github.com/ceph/ceph/pull/48668), Zac Dover)

- doc/ceph-volume: refine "bluestore" section ([pr#48634](https://github.com/ceph/ceph/pull/48634), Zac Dover)

- doc/ceph-volume: refine "filestore" section ([pr#48636](https://github.com/ceph/ceph/pull/48636), Zac Dover)

- doc/ceph-volume: refine "prepare" top matter ([pr#48651](https://github.com/ceph/ceph/pull/48651), Zac Dover)

- doc/ceph-volume: refine encryption<span></span>.rst ([pr#49792](https://github.com/ceph/ceph/pull/49792), Zac Dover)

- doc/ceph-volume: refine Filestore docs ([pr#48670](https://github.com/ceph/ceph/pull/48670), Zac Dover)

- doc/ceph-volume: update LUKS docs ([pr#49757](https://github.com/ceph/ceph/pull/49757), Zac Dover)

- doc/cephadm - remove "danger" admonition ([pr#49169](https://github.com/ceph/ceph/pull/49169), Zac Dover)

- doc/cephadm/host-management: add service spec link ([pr#50254](https://github.com/ceph/ceph/pull/50254), thomas)

- doc/cephadm/troubleshooting: remove word repeat ([pr#50222](https://github.com/ceph/ceph/pull/50222), thomas)

- doc/cephadm: add airgapped install procedure ([pr#49145](https://github.com/ceph/ceph/pull/49145), Zac Dover)

- doc/cephadm: add info about --no-overwrite to note about tuned-profiles ([pr#47954](https://github.com/ceph/ceph/pull/47954), Adam King)

- doc/cephadm: add prompts to host-management<span></span>.rst ([pr#48589](https://github.com/ceph/ceph/pull/48589), Zac Dover)

- doc/cephadm: alphabetize external tools list ([pr#48725](https://github.com/ceph/ceph/pull/48725), Zac Dover)

- doc/cephadm: arrange "listing hosts" section ([pr#48723](https://github.com/ceph/ceph/pull/48723), Zac Dover)

- doc/cephadm: clean colons in host-management<span></span>.rst ([pr#48603](https://github.com/ceph/ceph/pull/48603), Zac Dover)

- doc/cephadm: correct version staggered upgrade got in pacific ([pr#48055](https://github.com/ceph/ceph/pull/48055), Adam King)

- doc/cephadm: document recommended syntax for mounting files with ECA ([pr#48068](https://github.com/ceph/ceph/pull/48068), Adam King)

- doc/cephadm: fix grammar in compatibility<span></span>.rst ([pr#48714](https://github.com/ceph/ceph/pull/48714), Zac Dover)

- doc/cephadm: fix tuned-profile add/rm-setting syntax example ([pr#48094](https://github.com/ceph/ceph/pull/48094), Adam King)

- doc/cephadm: format airgap install procedure ([pr#49148](https://github.com/ceph/ceph/pull/49148), Zac Dover)

- doc/cephadm: grammar / syntax in install<span></span>.rst ([pr#49948](https://github.com/ceph/ceph/pull/49948), Piotr Parczewski)

- doc/cephadm: improve airgapping procedure grammar ([pr#49157](https://github.com/ceph/ceph/pull/49157), Zac Dover)

- doc/cephadm: improve front matter ([pr#48606](https://github.com/ceph/ceph/pull/48606), Zac Dover)

- doc/cephadm: improve grammar in "listing hosts" ([pr#49164](https://github.com/ceph/ceph/pull/49164), Zac Dover)

- doc/cephadm: improve lone sentence ([pr#48737](https://github.com/ceph/ceph/pull/48737), Zac Dover)

- doc/cephadm: Redd up compatibility<span></span>.rst ([pr#50367](https://github.com/ceph/ceph/pull/50367), Anthony D'Atri)

- doc/cephadm: refine "os tuning" in h<span></span>. management ([pr#48573](https://github.com/ceph/ceph/pull/48573), Zac Dover)

- doc/cephadm: refine "Removing Hosts" ([pr#49706](https://github.com/ceph/ceph/pull/49706), Zac Dover)

- doc/cephadm: s/osd/OSD/ where appropriate ([pr#49717](https://github.com/ceph/ceph/pull/49717), Zac Dover)

- doc/cephadm: s/ssh/SSH/ in doc/cephadm (complete) ([pr#48611](https://github.com/ceph/ceph/pull/48611), Zac Dover)

- doc/cephadm: s/ssh/SSH/ in troubleshooting<span></span>.rst ([pr#48601](https://github.com/ceph/ceph/pull/48601), Zac Dover)

- doc/cephadm: update cephadm compatability and stability page ([pr#50336](https://github.com/ceph/ceph/pull/50336), Adam King)

- doc/cephadm: update install<span></span>.rst ([pr#48594](https://github.com/ceph/ceph/pull/48594), Zac Dover)

- doc/cephfs - s/yet to here/yet to hear/ posix<span></span>.rst ([pr#49448](https://github.com/ceph/ceph/pull/49448), Zac Dover)

- doc/cephfs: add note about CephFS extended attributes and getfattr ([pr#50068](https://github.com/ceph/ceph/pull/50068), Zac Dover)

- doc/cephfs: describe conf opt "client quota df" in quota doc ([pr#50252](https://github.com/ceph/ceph/pull/50252), Rishabh Dave)

- doc/cephfs: fix "e<span></span>.g<span></span>." in posix<span></span>.rst ([pr#49450](https://github.com/ceph/ceph/pull/49450), Zac Dover)

- doc/cephfs: s/all of there are/all of these are/ ([pr#49446](https://github.com/ceph/ceph/pull/49446), Zac Dover)

- doc/css: add "span" padding to custom<span></span>.css ([pr#49693](https://github.com/ceph/ceph/pull/49693), Zac Dover)

- doc/css: add scroll-margin-top to dt elements ([pr#49639](https://github.com/ceph/ceph/pull/49639), Zac Dover)

- doc/css: Add scroll-margin-top to h2 html element ([pr#49661](https://github.com/ceph/ceph/pull/49661), Zac Dover)

- doc/css: add top-bar padding for h3 html element ([pr#49701](https://github.com/ceph/ceph/pull/49701), Zac Dover)

- doc/dev/cephadm: fix host maintenance enter/exit syntax ([pr#49646](https://github.com/ceph/ceph/pull/49646), Ranjini Mandyam Narasiodeyar)

- doc/dev/developer\_guide/testing\_integration\_tests: Add Upgrade Testin… ([pr#49909](https://github.com/ceph/ceph/pull/49909), Matan Breizman)

- doc/dev/developer\_guide/tests-unit-tests: Add unit test caveat ([pr#49012](https://github.com/ceph/ceph/pull/49012), Matan Breizman)

- doc/dev: add explanation of how to use deduplication ([pr#48567](https://github.com/ceph/ceph/pull/48567), Myoungwon Oh)

- doc/dev: add full stop to sentence in basic-wo ([pr#50400](https://github.com/ceph/ceph/pull/50400), Zac Dover)

- doc/dev: add git branch management commands ([pr#49738](https://github.com/ceph/ceph/pull/49738), Zac Dover)

- doc/dev: add Slack to Dev Guide essentials ([pr#49874](https://github.com/ceph/ceph/pull/49874), Zac Dover)

- doc/dev: add submodule-update link to dev guide ([pr#48479](https://github.com/ceph/ceph/pull/48479), Zac Dover)

- doc/dev: alphabetize EC glossary ([pr#48685](https://github.com/ceph/ceph/pull/48685), Zac Dover)

- doc/dev: fix graphviz diagram ([pr#48922](https://github.com/ceph/ceph/pull/48922), Zac Dover)

- doc/dev: improve Basic Workflow wording ([pr#49077](https://github.com/ceph/ceph/pull/49077), Zac Dover)

- doc/dev: improve EC glossary ([pr#48675](https://github.com/ceph/ceph/pull/48675), Zac Dover)

- doc/dev: improve lone sentence ([pr#48740](https://github.com/ceph/ceph/pull/48740), Zac Dover)

- doc/dev: improve presentation of note (git remote) ([pr#48237](https://github.com/ceph/ceph/pull/48237), Zac Dover)

- doc/dev: link to Dot User's Manual ([pr#48925](https://github.com/ceph/ceph/pull/48925), Zac Dover)

- doc/dev: refine erasure\_coding<span></span>.rst ([pr#48700](https://github.com/ceph/ceph/pull/48700), Zac Dover)

- doc/dev: remove deduplication<span></span>.rst from quincy ([pr#48570](https://github.com/ceph/ceph/pull/48570), Zac Dover)

- doc/dev: use underscores in config vars ([pr#49892](https://github.com/ceph/ceph/pull/49892), Ville Ojamo)

- doc/glosary<span></span>.rst: add "Ceph Block Device" term ([pr#48746](https://github.com/ceph/ceph/pull/48746), Zac Dover)

- doc/glossary - add "secrets" ([pr#49397](https://github.com/ceph/ceph/pull/49397), Zac Dover)

- doc/glossary<span></span>.rst: add "Ceph Dashboard" term ([pr#48748](https://github.com/ceph/ceph/pull/48748), Zac Dover)

- doc/glossary<span></span>.rst: alphabetize glossary terms ([pr#48338](https://github.com/ceph/ceph/pull/48338), Zac Dover)

- doc/glossary<span></span>.rst: define "Ceph Manager" ([pr#48764](https://github.com/ceph/ceph/pull/48764), Zac Dover)

- doc/glossary<span></span>.rst: remove duplicates ([pr#48357](https://github.com/ceph/ceph/pull/48357), Zac Dover)

- doc/glossary<span></span>.rst: remove old front matter ([pr#48754](https://github.com/ceph/ceph/pull/48754), Zac Dover)

- doc/glossary: add "application" to the glossary ([pr#50258](https://github.com/ceph/ceph/pull/50258), Zac Dover)

- doc/glossary: add "BlueStore" ([pr#48777](https://github.com/ceph/ceph/pull/48777), Zac Dover)

- doc/glossary: add "Bucket" ([pr#50224](https://github.com/ceph/ceph/pull/50224), Zac Dover)

- doc/glossary: add "ceph monitor" entry ([pr#48447](https://github.com/ceph/ceph/pull/48447), Zac Dover)

- doc/glossary: add "Ceph Object Store" ([pr#49030](https://github.com/ceph/ceph/pull/49030), Zac Dover)

- doc/glossary: add "client" to glossary ([pr#50262](https://github.com/ceph/ceph/pull/50262), Zac Dover)

- doc/glossary: add "Dashboard Module" ([pr#49137](https://github.com/ceph/ceph/pull/49137), Zac Dover)

- doc/glossary: add "FQDN" entry ([pr#49424](https://github.com/ceph/ceph/pull/49424), Zac Dover)

- doc/glossary: add "mds" term ([pr#48871](https://github.com/ceph/ceph/pull/48871), Zac Dover)

- doc/glossary: add "Period" to glossary ([pr#50155](https://github.com/ceph/ceph/pull/50155), Zac Dover)

- doc/glossary: add "RADOS Cluster" ([pr#49134](https://github.com/ceph/ceph/pull/49134), Zac Dover)

- doc/glossary: add "RADOS" definition ([pr#48950](https://github.com/ceph/ceph/pull/48950), Zac Dover)

- doc/glossary: add "realm" to glossary ([pr#50134](https://github.com/ceph/ceph/pull/50134), Zac Dover)

- doc/glossary: Add "zone" to glossary<span></span>.rst ([pr#50271](https://github.com/ceph/ceph/pull/50271), Zac Dover)

- doc/glossary: add AWS/OpenStack bucket info ([pr#50247](https://github.com/ceph/ceph/pull/50247), Zac Dover)

- doc/glossary: add DAS ([pr#49254](https://github.com/ceph/ceph/pull/49254), Zac Dover)

- doc/glossary: add matter to "RBD" ([pr#49265](https://github.com/ceph/ceph/pull/49265), Zac Dover)

- doc/glossary: add oxford comma to "Cluster Map" ([pr#48992](https://github.com/ceph/ceph/pull/48992), Zac Dover)

- doc/glossary: beef up "Ceph Block Storage" ([pr#48964](https://github.com/ceph/ceph/pull/48964), Zac Dover)

- doc/glossary: capitalize "DAS" correctly ([pr#49603](https://github.com/ceph/ceph/pull/49603), Zac Dover)

- doc/glossary: clean OSD id-related entries ([pr#49589](https://github.com/ceph/ceph/pull/49589), Zac Dover)

- doc/glossary: Clean up "Ceph Object Storage" ([pr#49667](https://github.com/ceph/ceph/pull/49667), Zac Dover)

- doc/glossary: collate "releases" entries ([pr#49600](https://github.com/ceph/ceph/pull/49600), Zac Dover)

- doc/glossary: Define "Ceph Node" ([pr#48994](https://github.com/ceph/ceph/pull/48994), Zac Dover)

- doc/glossary: define "Ceph Object Gateway" ([pr#48901](https://github.com/ceph/ceph/pull/48901), Zac Dover)

- doc/glossary: define "Ceph OSD" ([pr#48770](https://github.com/ceph/ceph/pull/48770), Zac Dover)

- doc/glossary: define "Ceph Storage Cluster" ([pr#49002](https://github.com/ceph/ceph/pull/49002), Zac Dover)

- doc/glossary: define "OSD" ([pr#48759](https://github.com/ceph/ceph/pull/48759), Zac Dover)

- doc/glossary: define "RGW" ([pr#48960](https://github.com/ceph/ceph/pull/48960), Zac Dover)

- doc/glossary: disambiguate "OSD" ([pr#48790](https://github.com/ceph/ceph/pull/48790), Zac Dover)

- doc/glossary: disambiguate clauses ([pr#49574](https://github.com/ceph/ceph/pull/49574), Zac Dover)

- doc/glossary: fix "Ceph Client" ([pr#49032](https://github.com/ceph/ceph/pull/49032), Zac Dover)

- doc/glossary: improve "Ceph Manager Dashboard" ([pr#48824](https://github.com/ceph/ceph/pull/48824), Zac Dover)

- doc/glossary: improve "Ceph Manager" term ([pr#48811](https://github.com/ceph/ceph/pull/48811), Zac Dover)

- doc/glossary: improve "Ceph Point Release" entry ([pr#48890](https://github.com/ceph/ceph/pull/48890), Zac Dover)

- doc/glossary: improve "ceph" term ([pr#48820](https://github.com/ceph/ceph/pull/48820), Zac Dover)

- doc/glossary: improve wording ([pr#48751](https://github.com/ceph/ceph/pull/48751), Zac Dover)

- doc/glossary: link to "Ceph Manager" ([pr#49063](https://github.com/ceph/ceph/pull/49063), Zac Dover)

- doc/glossary: link to OSD material ([pr#48779](https://github.com/ceph/ceph/pull/48779), zdover23, Zac Dover)

- doc/glossary: redirect entries to "Ceph OSD" ([pr#48833](https://github.com/ceph/ceph/pull/48833), Zac Dover)

- doc/glossary: remove "Ceph System" ([pr#49072](https://github.com/ceph/ceph/pull/49072), Zac Dover)

- doc/glossary: remove "Ceph Test Framework" ([pr#48841](https://github.com/ceph/ceph/pull/48841), Zac Dover)

- doc/glossary: rewrite "Ceph File System" ([pr#48917](https://github.com/ceph/ceph/pull/48917), Zac Dover)

- doc/glossary: s/an/each/ where it's needed ([pr#49595](https://github.com/ceph/ceph/pull/49595), Zac Dover)

- doc/glossary: s/Ceph System/Ceph Cluster/ ([pr#49080](https://github.com/ceph/ceph/pull/49080), Zac Dover)

- doc/glossary: s/comprising/consisting of/ ([pr#49018](https://github.com/ceph/ceph/pull/49018), Zac Dover)

- doc/glossary: update "Cluster Map" ([pr#48797](https://github.com/ceph/ceph/pull/48797), Zac Dover)

- doc/glossary: update "pool/pools" ([pr#48857](https://github.com/ceph/ceph/pull/48857), Zac Dover)

- doc/index: remove "uniquely" from landing page ([pr#50477](https://github.com/ceph/ceph/pull/50477), Zac Dover)

- doc/install: clone-source<span></span>.rst s/master/main ([pr#48380](https://github.com/ceph/ceph/pull/48380), Zac Dover)

- doc/install: improve updating submodules procedure ([pr#48464](https://github.com/ceph/ceph/pull/48464), Zac Dover)

- doc/install: link to "cephadm installing ceph" ([pr#49781](https://github.com/ceph/ceph/pull/49781), Zac Dover)

- doc/install: refine index<span></span>.rst ([pr#50435](https://github.com/ceph/ceph/pull/50435), Zac Dover)

- doc/install: update "Official Releases" sources ([pr#49038](https://github.com/ceph/ceph/pull/49038), Zac Dover)

- doc/install: update clone-source<span></span>.rst ([pr#49377](https://github.com/ceph/ceph/pull/49377), Zac Dover)

- doc/install: update index<span></span>.rst ([pr#50432](https://github.com/ceph/ceph/pull/50432), Zac Dover)

- doc/man/ceph-rbdnamer: remove obsolete udev rule ([pr#49697](https://github.com/ceph/ceph/pull/49697), Ilya Dryomov)

- doc/man: define --num-rep, --min-rep and --max-rep ([pr#49659](https://github.com/ceph/ceph/pull/49659), Zac Dover)

- doc/man: disambiguate "user" in a command ([pr#48954](https://github.com/ceph/ceph/pull/48954), Zac Dover)

- doc/mgr: name data source in "Man Install & Config" ([pr#48370](https://github.com/ceph/ceph/pull/48370), Zac Dover)

- doc/monitoring: add min vers of apps in mon stack ([pr#48063](https://github.com/ceph/ceph/pull/48063), Zac Dover, Himadri Maheshwari)

- doc/osd: Fixes the introduction for writeback mode of cache tier ([pr#48882](https://github.com/ceph/ceph/pull/48882), Mingyuan Liang)

- doc/rados/operations: Fix double prompt ([pr#49898](https://github.com/ceph/ceph/pull/49898), Ville Ojamo)

- doc/rados/operations: Fix indentation ([pr#49895](https://github.com/ceph/ceph/pull/49895), Ville Ojamo)

- doc/rados/operations: Improve wording, capitalization, formatting ([pr#50453](https://github.com/ceph/ceph/pull/50453), Anthony D'Atri)

- doc/rados: add prompts to add-or-remove-osds ([pr#49070](https://github.com/ceph/ceph/pull/49070), Zac Dover)

- doc/rados: add prompts to add-or-rm-prompts<span></span>.rst ([pr#48985](https://github.com/ceph/ceph/pull/48985), Zac Dover)

- doc/rados: add prompts to add-or-rm-prompts<span></span>.rst ([pr#48979](https://github.com/ceph/ceph/pull/48979), Zac Dover)

- doc/rados: add prompts to auth-config-ref<span></span>.rst ([pr#49515](https://github.com/ceph/ceph/pull/49515), Zac Dover)

- doc/rados: add prompts to balancer<span></span>.rst ([pr#49111](https://github.com/ceph/ceph/pull/49111), Zac Dover)

- doc/rados: add prompts to bluestore-config-ref<span></span>.rst ([pr#49535](https://github.com/ceph/ceph/pull/49535), Zac Dover)

- doc/rados: add prompts to bluestore-migration<span></span>.rst ([pr#49122](https://github.com/ceph/ceph/pull/49122), Zac Dover)

- doc/rados: add prompts to cache-tiering<span></span>.rst ([pr#49124](https://github.com/ceph/ceph/pull/49124), Zac Dover)

- doc/rados: add prompts to ceph-conf<span></span>.rst ([pr#49492](https://github.com/ceph/ceph/pull/49492), Zac Dover)

- doc/rados: add prompts to change-mon-elections<span></span>.rst ([pr#49129](https://github.com/ceph/ceph/pull/49129), Zac Dover)

- doc/rados: add prompts to control<span></span>.rst ([pr#49126](https://github.com/ceph/ceph/pull/49126), Zac Dover)

- doc/rados: add prompts to crush-map<span></span>.rst ([pr#49183](https://github.com/ceph/ceph/pull/49183), Zac Dover)

- doc/rados: add prompts to devices<span></span>.rst ([pr#49187](https://github.com/ceph/ceph/pull/49187), Zac Dover)

- doc/rados: add prompts to erasure-code-clay<span></span>.rst ([pr#49205](https://github.com/ceph/ceph/pull/49205), Zac Dover)

- doc/rados: add prompts to erasure-code-isa ([pr#49207](https://github.com/ceph/ceph/pull/49207), Zac Dover)

- doc/rados: add prompts to erasure-code-jerasure<span></span>.rst ([pr#49209](https://github.com/ceph/ceph/pull/49209), Zac Dover)

- doc/rados: add prompts to erasure-code-lrc<span></span>.rst ([pr#49218](https://github.com/ceph/ceph/pull/49218), Zac Dover)

- doc/rados: add prompts to erasure-code-shec<span></span>.rst ([pr#49220](https://github.com/ceph/ceph/pull/49220), Zac Dover)

- doc/rados: add prompts to health-checks (1 of 5) ([pr#49222](https://github.com/ceph/ceph/pull/49222), Zac Dover)

- doc/rados: add prompts to health-checks (2 of 5) ([pr#49224](https://github.com/ceph/ceph/pull/49224), Zac Dover)

- doc/rados: add prompts to health-checks (3 of 5) ([pr#49226](https://github.com/ceph/ceph/pull/49226), Zac Dover)

- doc/rados: add prompts to health-checks (4 of 5) ([pr#49228](https://github.com/ceph/ceph/pull/49228), Zac Dover)

- doc/rados: add prompts to health-checks (5 of 5) ([pr#49230](https://github.com/ceph/ceph/pull/49230), Zac Dover)

- doc/rados: add prompts to librados-intro<span></span>.rst ([pr#49551](https://github.com/ceph/ceph/pull/49551), Zac Dover)

- doc/rados: add prompts to monitoring-osd-pg<span></span>.rst ([pr#49239](https://github.com/ceph/ceph/pull/49239), Zac Dover)

- doc/rados: add prompts to monitoring<span></span>.rst ([pr#49244](https://github.com/ceph/ceph/pull/49244), Zac Dover)

- doc/rados: add prompts to msgr2<span></span>.rst ([pr#49511](https://github.com/ceph/ceph/pull/49511), Zac Dover)

- doc/rados: add prompts to pg-repair<span></span>.rst ([pr#49246](https://github.com/ceph/ceph/pull/49246), Zac Dover)

- doc/rados: add prompts to placement-groups<span></span>.rst ([pr#49273](https://github.com/ceph/ceph/pull/49273), Zac Dover)

- doc/rados: add prompts to placement-groups<span></span>.rst ([pr#49271](https://github.com/ceph/ceph/pull/49271), Zac Dover)

- doc/rados: add prompts to placement-groups<span></span>.rst (3) ([pr#49275](https://github.com/ceph/ceph/pull/49275), Zac Dover)

- doc/rados: add prompts to pools<span></span>.rst ([pr#48061](https://github.com/ceph/ceph/pull/48061), Zac Dover)

- doc/rados: add prompts to stretch-mode<span></span>.rst ([pr#49369](https://github.com/ceph/ceph/pull/49369), Zac Dover)

- doc/rados: add prompts to upmap<span></span>.rst ([pr#49371](https://github.com/ceph/ceph/pull/49371), Zac Dover)

- doc/rados: add prompts to user-management<span></span>.rst ([pr#49384](https://github.com/ceph/ceph/pull/49384), Zac Dover)

- doc/rados: clarify default EC pool from simplest ([pr#49468](https://github.com/ceph/ceph/pull/49468), Zac Dover)

- doc/rados: cleanup "erasure code profiles" ([pr#49050](https://github.com/ceph/ceph/pull/49050), Zac Dover)

- doc/rados: correct typo in python<span></span>.rst ([pr#49559](https://github.com/ceph/ceph/pull/49559), Zac Dover)

- doc/rados: fix grammar in configuration/index<span></span>.rst ([pr#48884](https://github.com/ceph/ceph/pull/48884), Zac Dover)

- doc/rados: fix prompts in erasure-code<span></span>.rst ([pr#48334](https://github.com/ceph/ceph/pull/48334), Zac Dover)

- doc/rados: improve pools<span></span>.rst ([pr#48867](https://github.com/ceph/ceph/pull/48867), Zac Dover)

- doc/rados: link to cephadm replacing osd section ([pr#49680](https://github.com/ceph/ceph/pull/49680), Zac Dover)

- doc/rados: move colon ([pr#49704](https://github.com/ceph/ceph/pull/49704), Zac Dover)

- doc/rados: refine ceph-conf<span></span>.rst ([pr#49832](https://github.com/ceph/ceph/pull/49832), Zac Dover)

- doc/rados: refine English in crush-map-edits<span></span>.rst ([pr#48365](https://github.com/ceph/ceph/pull/48365), Zac Dover)

- doc/rados: refine pool-pg-config-ref<span></span>.rst ([pr#49821](https://github.com/ceph/ceph/pull/49821), Zac Dover)

- doc/rados: remove prompt from php<span></span>.ini line ([pr#49561](https://github.com/ceph/ceph/pull/49561), Zac Dover)

- doc/rados: reword part of cache-tiering<span></span>.rst ([pr#48887](https://github.com/ceph/ceph/pull/48887), Zac Dover)

- doc/rados: rewrite EC intro ([pr#48323](https://github.com/ceph/ceph/pull/48323), Zac Dover)

- doc/rados: s/backend/back end/ ([pr#48781](https://github.com/ceph/ceph/pull/48781), Zac Dover)

- doc/rados: update "Pools" material ([pr#48855](https://github.com/ceph/ceph/pull/48855), Zac Dover)

- doc/rados: update OSD\_BACKFILLFULL description ([pr#50218](https://github.com/ceph/ceph/pull/50218), Ponnuvel Palaniyappan)

- doc/rados: update prompts in crush-map-edits<span></span>.rst ([pr#48363](https://github.com/ceph/ceph/pull/48363), Zac Dover)

- doc/rados: update prompts in network-config-ref ([pr#48159](https://github.com/ceph/ceph/pull/48159), Zac Dover)

- doc/radosgw/STS: sts\_key and user capabilities ([pr#47324](https://github.com/ceph/ceph/pull/47324), Tobias Bossert)

- doc/radosgw: add prompts to multisite<span></span>.rst ([pr#48659](https://github.com/ceph/ceph/pull/48659), Zac Dover)

- doc/radosgw: add push\_endpoint for rabbitmq ([pr#48487](https://github.com/ceph/ceph/pull/48487), Zac Dover)

- doc/radosgw: format admonitions ([pr#50356](https://github.com/ceph/ceph/pull/50356), Zac Dover)

- doc/radosgw: improve "Ceph Object Gateway" text ([pr#48863](https://github.com/ceph/ceph/pull/48863), Zac Dover)

- doc/radosgw: improve grammar - notifications<span></span>.rst ([pr#48494](https://github.com/ceph/ceph/pull/48494), Zac Dover)

- doc/radosgw: multisite - edit "functional changes" ([pr#50277](https://github.com/ceph/ceph/pull/50277), Zac Dover)

- doc/radosgw: refine "bucket notifications" ([pr#48560](https://github.com/ceph/ceph/pull/48560), Zac Dover)

- doc/radosgw: refine "Maintenance" in multisite<span></span>.rst ([pr#50025](https://github.com/ceph/ceph/pull/50025), Zac Dover)

- doc/radosgw: refine "notification reliability" ([pr#48529](https://github.com/ceph/ceph/pull/48529), Zac Dover)

- doc/radosgw: refine "notifications" and "events" ([pr#48579](https://github.com/ceph/ceph/pull/48579), Zac Dover)

- doc/radosgw: refine notifications<span></span>.rst - top part ([pr#48502](https://github.com/ceph/ceph/pull/48502), Zac Dover)

- doc/radosgw: s/execute/run/ in multisite<span></span>.rst ([pr#50173](https://github.com/ceph/ceph/pull/50173), Zac Dover)

- doc/radosgw: s/zone group/zonegroup/g et alia ([pr#50297](https://github.com/ceph/ceph/pull/50297), Zac Dover)

- doc/radosgw: update notifications<span></span>.rst - grammar ([pr#48499](https://github.com/ceph/ceph/pull/48499), Zac Dover)

- doc/radosw: improve radosgw text ([pr#48966](https://github.com/ceph/ceph/pull/48966), Zac Dover)

- doc/radowsgw: add prompts to notifications<span></span>.rst ([pr#48535](https://github.com/ceph/ceph/pull/48535), Zac Dover)

- doc/rbd/rbd-exclusive-locks: warn about automatic lock transitions ([pr#49806](https://github.com/ceph/ceph/pull/49806), Ilya Dryomov)

- doc/rbd: format iscsi-initiator-linux<span></span>.rbd better ([pr#49749](https://github.com/ceph/ceph/pull/49749), Zac Dover)

- doc/rbd: improve grammar in "immutable object<span></span>.<span></span>.<span></span>." ([pr#48969](https://github.com/ceph/ceph/pull/48969), Zac Dover)

- doc/rbd: refine "Create a Block Device Pool" ([pr#49307](https://github.com/ceph/ceph/pull/49307), Zac Dover)

- doc/rbd: refine "Create a Block Device User" ([pr#49318](https://github.com/ceph/ceph/pull/49318), Zac Dover)

- doc/rbd: refine "Create a Block Device User" ([pr#49300](https://github.com/ceph/ceph/pull/49300), Zac Dover)

- doc/rbd: refine "Creating a Block Device Image" ([pr#49346](https://github.com/ceph/ceph/pull/49346), Zac Dover)

- doc/rbd: refine "Listing Block Device Images" ([pr#49348](https://github.com/ceph/ceph/pull/49348), Zac Dover)

- doc/rbd: refine "Removing a Block Device Image" ([pr#49356](https://github.com/ceph/ceph/pull/49356), Zac Dover)

- doc/rbd: refine "Resizing a Block Device Image" ([pr#49352](https://github.com/ceph/ceph/pull/49352), Zac Dover)

- doc/rbd: refine "Restoring a Block Device Image" ([pr#49354](https://github.com/ceph/ceph/pull/49354), Zac Dover)

- doc/rbd: refine "Retrieving Image Information" ([pr#49350](https://github.com/ceph/ceph/pull/49350), Zac Dover)

- doc/rbd: refine rbd-exclusive-locks<span></span>.rst ([pr#49597](https://github.com/ceph/ceph/pull/49597), Zac Dover)

- doc/rbd: refine rbd-snapshot<span></span>.rst ([pr#49484](https://github.com/ceph/ceph/pull/49484), Zac Dover)

- doc/rbd: remove typo and ill-formed command ([pr#49365](https://github.com/ceph/ceph/pull/49365), Zac Dover)

- doc/rbd: s/wuold/would/ in rados-rbd-cmds<span></span>.rst ([pr#49591](https://github.com/ceph/ceph/pull/49591), Zac Dover)

- doc/rbd: update iSCSI gateway info ([pr#49068](https://github.com/ceph/ceph/pull/49068), Zac Dover)

- doc/releases: improve grammar in pacific<span></span>.rst ([pr#48424](https://github.com/ceph/ceph/pull/48424), Zac Dover)

- doc/rgw - fix grammar in table in s3<span></span>.rst ([pr#50388](https://github.com/ceph/ceph/pull/50388), Zac Dover)

- doc/rgw: "Migrating Single Site to Multi-Site" ([pr#50093](https://github.com/ceph/ceph/pull/50093), Zac Dover)

- doc/rgw: caption a diagram ([pr#50293](https://github.com/ceph/ceph/pull/50293), Zac Dover)

- doc/rgw: clarify multisite<span></span>.rst top matter ([pr#50204](https://github.com/ceph/ceph/pull/50204), Zac Dover)

- doc/rgw: clean zone-sync<span></span>.svg ([pr#50362](https://github.com/ceph/ceph/pull/50362), Zac Dover)

- doc/rgw: fix caption ([pr#50395](https://github.com/ceph/ceph/pull/50395), Zac Dover)

- doc/rgw: improve diagram caption ([pr#50331](https://github.com/ceph/ceph/pull/50331), Zac Dover)

- doc/rgw: multisite ref<span></span>. top matter cleanup ([pr#50189](https://github.com/ceph/ceph/pull/50189), Zac Dover)

- doc/rgw: refine "Configuring Secondary Zones" ([pr#50074](https://github.com/ceph/ceph/pull/50074), Zac Dover)

- doc/rgw: refine "Failover and Disaster Recovery" ([pr#50078](https://github.com/ceph/ceph/pull/50078), Zac Dover)

- doc/rgw: refine "Multi-site Config Ref" (1 of x) ([pr#50117](https://github.com/ceph/ceph/pull/50117), Zac Dover)

- doc/rgw: refine "Realms" section ([pr#50139](https://github.com/ceph/ceph/pull/50139), Zac Dover)

- doc/rgw: refine "Zones" in multisite<span></span>.rst ([pr#49982](https://github.com/ceph/ceph/pull/49982), Zac Dover)

- doc/rgw: refine 1-50 of multisite<span></span>.rst ([pr#49995](https://github.com/ceph/ceph/pull/49995), Zac Dover)

- doc/rgw: refine keycloak<span></span>.rst ([pr#50378](https://github.com/ceph/ceph/pull/50378), Zac Dover)

- doc/rgw: refine multisite to "config 2ndary zones" ([pr#50031](https://github.com/ceph/ceph/pull/50031), Zac Dover)

- doc/rgw: refine ~50-~140 of multisite<span></span>.rst ([pr#50008](https://github.com/ceph/ceph/pull/50008), Zac Dover)

- doc/rgw: remove "tertiary", link to procedure ([pr#50287](https://github.com/ceph/ceph/pull/50287), Zac Dover)

- doc/rgw: s/[Zz]one [Gg]roup/zonegroup/g ([pr#50136](https://github.com/ceph/ceph/pull/50136), Zac Dover)

- doc/rgw: session-tags<span></span>.rst - fix link to keycloak ([pr#50187](https://github.com/ceph/ceph/pull/50187), Zac Dover)

- doc/security: improve grammar in CVE-2022-0670<span></span>.rst ([pr#48430](https://github.com/ceph/ceph/pull/48430), Zac Dover)

- doc/start: add Anthony D'Atri's suggestions ([pr#49615](https://github.com/ceph/ceph/pull/49615), Zac Dover)

- doc/start: add link-related metadocumentation ([pr#49608](https://github.com/ceph/ceph/pull/49608), Zac Dover)

- doc/start: add RST escape character rules for bold ([pr#49751](https://github.com/ceph/ceph/pull/49751), Zac Dover)

- doc/start: improve documenting-ceph<span></span>.rst ([pr#49565](https://github.com/ceph/ceph/pull/49565), Zac Dover)

- doc/start: refine "Quirks of RST" ([pr#49610](https://github.com/ceph/ceph/pull/49610), Zac Dover)

- doc/start: update documenting-ceph<span></span>.rst ([pr#49570](https://github.com/ceph/ceph/pull/49570), Zac Dover)

- doc/various: update link to CRUSH pdf ([pr#48402](https://github.com/ceph/ceph/pull/48402), Zac Dover)

- doc: add releases links to toc ([pr#48945](https://github.com/ceph/ceph/pull/48945), Patrick Donnelly)

- doc: add the damage types that scrub can repair ([pr#49932](https://github.com/ceph/ceph/pull/49932), Neeraj Pratap Singh)

- doc: Change 'ReST' to 'REST' in doc/radosgw/layout<span></span>.rst ([pr#48653](https://github.com/ceph/ceph/pull/48653), wangyingbin)

- doc: document debugging for libcephsqlite ([pr#50035](https://github.com/ceph/ceph/pull/50035), Patrick Donnelly)

- doc: document the relevance of mds\_namespace mount option ([pr#49689](https://github.com/ceph/ceph/pull/49689), Jos Collin)

- doc: fix a couple grammatical things ([pr#49621](https://github.com/ceph/ceph/pull/49621), Brad Fitzpatrick)

- doc: fix a typo ([pr#49683](https://github.com/ceph/ceph/pull/49683), Brad Fitzpatrick)

- doc: Fix disaster recovery doc ([pr#48343](https://github.com/ceph/ceph/pull/48343), Kotresh HR)

- doc: Install graphviz ([pr#48904](https://github.com/ceph/ceph/pull/48904), David Galloway)

- doc: point to main branch for release info ([pr#48800](https://github.com/ceph/ceph/pull/48800), Patrick Donnelly)

- doc: preen cephadm/troubleshooting<span></span>.rst and radosgw/placement<span></span>.rst ([pr#50228](https://github.com/ceph/ceph/pull/50228), Anthony D'Atri)

- docs: correct add system user to the master zone command ([pr#48655](https://github.com/ceph/ceph/pull/48655), Salar Nosrati-Ershad)

- drive\_group: fix limit filter in drive\_selection<span></span>.selector ([pr#50370](https://github.com/ceph/ceph/pull/50370), Guillaume Abrioux)

- exporter: avoid stoi for empty pid\_str ([pr#48206](https://github.com/ceph/ceph/pull/48206), Avan Thakkar)

- exporter: don't skip loop if pid path is empty ([pr#48225](https://github.com/ceph/ceph/pull/48225), Avan Thakkar)

- Fix chown to unlink ([pr#49794](https://github.com/ceph/ceph/pull/49794), Daniel Gryniewicz)

- fsmap: switch to using iterator based loop ([pr#48268](https://github.com/ceph/ceph/pull/48268), Aliaksei Makarau)

- librbd/cache/pwl: fix clean vs bytes\_dirty cache state inconsistency ([pr#49055](https://github.com/ceph/ceph/pull/49055), Yin Congmin)

- librbd: avoid EUCLEAN error after "rbd rm" is interrupted ([pr#50130](https://github.com/ceph/ceph/pull/50130), weixinwei)

- librbd: call apply\_changes() after setting librados\_thread\_count ([pr#50292](https://github.com/ceph/ceph/pull/50292), Ilya Dryomov)

- librbd: compare-and-write fixes and vector C API ([pr#48474](https://github.com/ceph/ceph/pull/48474), Ilya Dryomov, Jonas Pfefferle)

- librbd: Fix local rbd mirror journals growing forever ([pr#50159](https://github.com/ceph/ceph/pull/50159), Ilya Dryomov, Josef Johansson)

- make-dist: don't set Release tag in ceph<span></span>.spec for SUSE distros ([pr#48613](https://github.com/ceph/ceph/pull/48613), Tim Serong, Nathan Cutler)

- mds/client: fail the request if the peer MDS doesn't support getvxattr op ([pr#47890](https://github.com/ceph/ceph/pull/47890), Zack Cerza, Xiubo Li)

- mds/PurgeQueue: don't consider filer\_max\_purge\_ops when \_calculate\_ops ([pr#49655](https://github.com/ceph/ceph/pull/49655), haoyixing)

- mds/Server: Do not abort MDS on unknown messages ([pr#48252](https://github.com/ceph/ceph/pull/48252), Dhairya Parmar, Dhairy Parmar)

- mds: account for snapshot items when deciding to split or merge a directory ([issue#55215](http://tracker.ceph.com/issues/55215), [pr#49673](https://github.com/ceph/ceph/pull/49673), Venky Shankar)

- mds: avoid ~mdsdir's scrubbing and reporting damage health status ([pr#49473](https://github.com/ceph/ceph/pull/49473), Neeraj Pratap Singh)

- mds: damage table only stores one dentry per dirfrag ([pr#48261](https://github.com/ceph/ceph/pull/48261), Patrick Donnelly)

- mds: do not acquire xlock in xlockdone state ([pr#49539](https://github.com/ceph/ceph/pull/49539), Igor Fedotov)

- mds: fix and skip submitting invalid osd request ([pr#49939](https://github.com/ceph/ceph/pull/49939), Xiubo Li)

- mds: fix scan\_stray\_dir not reset next<span></span>.frag on each run of stray inode ([pr#49670](https://github.com/ceph/ceph/pull/49670), ethanwu)

- mds: md\_log\_replay thread blocks waiting to be woken up ([pr#49672](https://github.com/ceph/ceph/pull/49672), zhikuodu)

- mds: switch submit\_mutex to fair mutex for MDLog ([pr#49633](https://github.com/ceph/ceph/pull/49633), Xiubo Li)

- mds: wait unlink to finish to avoid conflict when creating same entries ([pr#48452](https://github.com/ceph/ceph/pull/48452), Xiubo Li)

- mgr/cephadm: add ingress support for ssl rgw service ([pr#49865](https://github.com/ceph/ceph/pull/49865), Frank Ederveen)

- mgr/cephadm: allow setting prometheus retention time ([pr#47943](https://github.com/ceph/ceph/pull/47943), Redouane Kachach, Adam King)

- mgr/cephadm: call iscsi post\_remove from serve loop ([pr#49847](https://github.com/ceph/ceph/pull/49847), Adam King)

- mgr/cephadm: don't say migration in progress if migration current > migration last ([pr#49861](https://github.com/ceph/ceph/pull/49861), Adam King)

- mgr/cephadm: don't use "sudo" in commands if user is root ([pr#48079](https://github.com/ceph/ceph/pull/48079), Adam King)

- mgr/cephadm: fix backends service in haproxy config with multiple nfs of same rank ([pr#50446](https://github.com/ceph/ceph/pull/50446), Adam King)

- mgr/cephadm: fix check for if devices have changed ([pr#49864](https://github.com/ceph/ceph/pull/49864), Adam King)

- mgr/cephadm: fix handling of mgr upgrades with 3 or more mgrs ([pr#49859](https://github.com/ceph/ceph/pull/49859), Adam King)

- mgr/cephadm: fix removing offline hosts with ingress daemons ([pr#49850](https://github.com/ceph/ceph/pull/49850), Adam King)

- mgr/cephadm: fix tuned profiles getting removed if name has dashes ([pr#48077](https://github.com/ceph/ceph/pull/48077), Adam King)

- mgr/cephadm: improve offline host handling, mostly around upgrade ([pr#49856](https://github.com/ceph/ceph/pull/49856), Adam King)

- mgr/cephadm: increase ingress timeout values ([pr#49853](https://github.com/ceph/ceph/pull/49853), Frank Ederveen)

- mgr/cephadm: iscsi username and password defaults to admin ([pr#49309](https://github.com/ceph/ceph/pull/49309), Nizamudeen A)

- mgr/cephadm: make logging refresh metadata to debug logs configurable ([pr#49857](https://github.com/ceph/ceph/pull/49857), Adam King)

- mgr/cephadm: make setting --cgroups=split configurable ([pr#48075](https://github.com/ceph/ceph/pull/48075), Adam King)

- mgr/cephadm: reconfig iscsi daemons if trusted\_ip\_list changes ([pr#48076](https://github.com/ceph/ceph/pull/48076), Adam King)

- mgr/cephadm: save host cache data after scheduling daemon action ([pr#49863](https://github.com/ceph/ceph/pull/49863), Adam King)

- mgr/cephadm: some master -> main cleanup ([pr#49284](https://github.com/ceph/ceph/pull/49284), Adam King)

- mgr/cephadm: specify ports for iscsi ([pr#49862](https://github.com/ceph/ceph/pull/49862), Adam King)

- mgr/cephadm: support for extra entrypoint args ([pr#49851](https://github.com/ceph/ceph/pull/49851), Adam King)

- mgr/cephadm: try to avoid pull when getting container image info ([pr#50170](https://github.com/ceph/ceph/pull/50170), Mykola Golub, Adam King)

- mgr/cephadm: validating tuned profile specification ([pr#48078](https://github.com/ceph/ceph/pull/48078), Redouane Kachach)

- mgr/cephadm: write client files after applying services ([pr#49860](https://github.com/ceph/ceph/pull/49860), Adam King)

- mgr/dashboard: Add a Silence button shortcut to alert notifications ([pr#48065](https://github.com/ceph/ceph/pull/48065), Nizamudeen A, Aashish Sharma)

- mgr/dashboard: Add details to the modal which displays the `safe-to-d… ([pr#48177](https://github.com/ceph/ceph/pull/48177), Francesco Torchia)

- mgr/dashboard: Add metric relative to osd blocklist ([pr#49501](https://github.com/ceph/ceph/pull/49501), Aashish Sharma)

- mgr/dashboard: add option to resolve ip addr ([pr#48219](https://github.com/ceph/ceph/pull/48219), Tatjana Dehler)

- mgr/dashboard: add server side encryption to rgw/s3 ([pr#48441](https://github.com/ceph/ceph/pull/48441), Aashish Sharma)

- mgr/dashboard: Add text to empty life expectancy column ([pr#48271](https://github.com/ceph/ceph/pull/48271), Francesco Torchia)

- mgr/dashboard: add tooltip mirroring pools table ([pr#49504](https://github.com/ceph/ceph/pull/49504), Pedro Gonzalez Gomez)

- mgr/dashboard: allow cross origin when the url is set ([pr#49150](https://github.com/ceph/ceph/pull/49150), Avan Thakkar, Nizamudeen A)

- mgr/dashboard: backport of all accessibility changes ([pr#49727](https://github.com/ceph/ceph/pull/49727), nsedrickm)

- mgr/dashboard: bug fixes for rbd mirroring edit and promotion/demotion ([pr#48807](https://github.com/ceph/ceph/pull/48807), Pedro Gonzalez Gomez)

- mgr/dashboard: cephadm dashboard e2e fixes ([pr#50450](https://github.com/ceph/ceph/pull/50450), Nizamudeen A)

- mgr/dashboard: custom image for kcli bootstrap script ([pr#50459](https://github.com/ceph/ceph/pull/50459), Nizamudeen A)

- mgr/dashboard: display real health in rbd mirroring pools ([pr#49518](https://github.com/ceph/ceph/pull/49518), Pere Diaz Bou)

- mgr/dashboard: fix "can't read <span></span>.ssh/known\_hosts: No such file or directory ([pr#47957](https://github.com/ceph/ceph/pull/47957), Nizamudeen A)

- mgr/dashboard: Fix broken Fedora image URL ([pr#48340](https://github.com/ceph/ceph/pull/48340), Zack Cerza, Nizamudeen A)

- mgr/dashboard: fix bucket encryption checkbox ([pr#49776](https://github.com/ceph/ceph/pull/49776), Aashish Sharma)

- mgr/dashboard: fix CephPGImbalance alert ([pr#49476](https://github.com/ceph/ceph/pull/49476), Aashish Sharma)

- mgr/dashboard: Fix CephPoolGrowthWarning alert ([pr#49475](https://github.com/ceph/ceph/pull/49475), Aashish Sharma)

- mgr/dashboard: fix constraints<span></span>.txt ([pr#50234](https://github.com/ceph/ceph/pull/50234), Ernesto Puerta)

- mgr/dashboard: fix Expected to find element: `cd-modal <span></span>.badge but never found it ([pr#48141](https://github.com/ceph/ceph/pull/48141), Nizamudeen A)

- mgr/dashboard: fix openapi-check ([pr#48046](https://github.com/ceph/ceph/pull/48046), Pere Diaz Bou)

- mgr/dashboard: fix rbd mirroring daemon health status ([pr#50125](https://github.com/ceph/ceph/pull/50125), Nizamudeen A)

- mgr/dashboard: fix rgw connect when using ssl ([issue#56970](http://tracker.ceph.com/issues/56970), [pr#48188](https://github.com/ceph/ceph/pull/48188), Henry Hirsch)

- mgr/dashboard: fix server side encryption config error ([pr#49481](https://github.com/ceph/ceph/pull/49481), Aashish Sharma)

- mgr/dashboard: fix snapshot creation with duplicate name ([pr#48047](https://github.com/ceph/ceph/pull/48047), Aashish Sharma)

- mgr/dashboard: fix weird data in osd details ([pr#48433](https://github.com/ceph/ceph/pull/48433), Pedro Gonzalez Gomez, Nizamudeen A)

- mgr/dashboard: handle the cephfs permission issue in nfs exports ([pr#48315](https://github.com/ceph/ceph/pull/48315), Nizamudeen A)

- mgr/dashboard: move service\_instances logic to backend ([pr#50451](https://github.com/ceph/ceph/pull/50451), Nizamudeen A)

- mgr/dashboard: osd form preselect db/wal device filters ([pr#48115](https://github.com/ceph/ceph/pull/48115), Nizamudeen A)

- mgr/dashboard: paginate services ([pr#48788](https://github.com/ceph/ceph/pull/48788), Melissa Li, Pere Diaz Bou)

- mgr/dashboard: rbd-mirror improvements ([pr#49499](https://github.com/ceph/ceph/pull/49499), Aashish Sharma)

- mgr/dashboard: refactor dashboard cephadm e2e tests ([pr#48432](https://github.com/ceph/ceph/pull/48432), Nizamudeen A)

- mgr/dashboard: Replace vonage-status-panel with native grafana stat panel ([pr#50043](https://github.com/ceph/ceph/pull/50043), Aashish Sharma)

- mgr/dashboard: rgw server side encryption config values set to wrong daemon ([pr#49724](https://github.com/ceph/ceph/pull/49724), Aashish Sharma)

- mgr/dashboard: Unable to change rgw subuser permission ([pr#48440](https://github.com/ceph/ceph/pull/48440), Aashish Sharma)

- mgr/dashboard: upgrade to angular 13, bootstrap 5 and jest 28 ([pr#50124](https://github.com/ceph/ceph/pull/50124), Nizamudeen A, Bryan Montalvan)

- mgr/nfs: add sectype option ([pr#48531](https://github.com/ceph/ceph/pull/48531), John Mulligan)

- mgr/nfs: handle bad cluster name during info command ([pr#49654](https://github.com/ceph/ceph/pull/49654), Dhairya Parmar)

- mgr/orchestrator: fix upgrade status help message ([pr#49855](https://github.com/ceph/ceph/pull/49855), Adam King)

- mgr/prometheus: change pg\_repaired\_objects name to pool\_repaired\_objects ([pr#48438](https://github.com/ceph/ceph/pull/48438), Pere Diaz Bou)

- mgr/prometheus: export zero valued pg state metrics ([pr#49787](https://github.com/ceph/ceph/pull/49787), Avan Thakkar)

- mgr/prometheus: expose daemon health metrics ([pr#49519](https://github.com/ceph/ceph/pull/49519), Pere Diaz Bou)

- mgr/prometheus: expose repaired pgs metrics ([pr#48204](https://github.com/ceph/ceph/pull/48204), Pere Diaz Bou)

- mgr/prometheus: fix module crash when trying to collect OSDs metrics ([pr#49930](https://github.com/ceph/ceph/pull/49930), Redouane Kachach)

- mgr/prometheus: use vendored "packaging" instead ([pr#49698](https://github.com/ceph/ceph/pull/49698), Kefu Chai, Matan Breizman)

- mgr/rbd\_support: avoid wedging the task queue if pool is removed ([pr#49057](https://github.com/ceph/ceph/pull/49057), Ilya Dryomov)

- mgr/rbd\_support: remove localized schedule option during module startup ([pr#49649](https://github.com/ceph/ceph/pull/49649), Ramana Raja)

- mgr/rook: Device inventory ([pr#49877](https://github.com/ceph/ceph/pull/49877), Juan Miguel Olmo Martínez)

- mgr/rook:NFSRados constructor expects type of rados as a parameter instead of MgrModule ([pr#48830](https://github.com/ceph/ceph/pull/48830), Ben Gao)

- mgr/snap\_schedule: remove subvol interface ([pr#48222](https://github.com/ceph/ceph/pull/48222), Milind Changire)

- mgr/telemetry: add `basic\_pool\_options\_bluestore` collection ([pr#49414](https://github.com/ceph/ceph/pull/49414), Laura Flores)

- mgr/volumes: Add human-readable flag to volume info command ([pr#48466](https://github.com/ceph/ceph/pull/48466), Neeraj Pratap Singh)

- mgr: Fix prettytable pinning to restore python3<span></span>.6 ([pr#48297](https://github.com/ceph/ceph/pull/48297), Zack Cerza)

- mon, osd: rework the public\_bind\_addr support<span></span>. Bring it to OSD ([pr#50153](https://github.com/ceph/ceph/pull/50153), Radosław Zarzyński, Radoslaw Zarzynski)

- mon,auth,cephadm: support auth key rotation ([pr#48093](https://github.com/ceph/ceph/pull/48093), Adam King, Radoslaw Zarzynski, Sage Weil)

- mon/Elector<span></span>.cc: Compress peer >= rank\_size sanity check into send\_peer\_ping ([pr#49433](https://github.com/ceph/ceph/pull/49433), Kamoltat)

- mon/Elector: Added sanity check when pinging a peer monitor ([pr#48321](https://github.com/ceph/ceph/pull/48321), Kamoltat)

- mon/Elector: Change how we handle removed\_ranks and notify\_rank\_removed() ([pr#49311](https://github.com/ceph/ceph/pull/49311), Kamoltat)

- mon/LogMonitor: Fix log last ([pr#50407](https://github.com/ceph/ceph/pull/50407), Prashant D)

- mon/MgrMap: dump last\_failure\_osd\_epoch and active\_clients at top level ([pr#50306](https://github.com/ceph/ceph/pull/50306), Ilya Dryomov)

- mon/MonCommands: Support dump\_historic\_slow\_ops ([pr#49232](https://github.com/ceph/ceph/pull/49232), Matan Breizman)

- mon/OSDMointor: Simplify check\_pg\_num() ([pr#50327](https://github.com/ceph/ceph/pull/50327), Matan Breizman, Anthony D'Atri, Tongliang Deng, Jerry Luo)

- mon: bail from handle\_command() if \_generate\_command\_map() fails ([pr#48845](https://github.com/ceph/ceph/pull/48845), Nikhil Kshirsagar)

- mon: disable snap id allocation for fsmap pools ([pr#50090](https://github.com/ceph/ceph/pull/50090), Milind Changire)

- mon: Fix condition to check for ceph version mismatch ([pr#49989](https://github.com/ceph/ceph/pull/49989), Prashant D)

- Monitor: forward report command to leader ([pr#47928](https://github.com/ceph/ceph/pull/47928), Dan van der Ster)

- monitoring/ceph-mixin: add RGW host to label info ([pr#48034](https://github.com/ceph/ceph/pull/48034), Tatjana Dehler)

- mount: fix mount failure with old kernels ([pr#49404](https://github.com/ceph/ceph/pull/49404), Xiubo Li)

- os/bluesore: cumulative backport for Onode stuff and more ([pr#50048](https://github.com/ceph/ceph/pull/50048), Igor Fedotov, Adam Kupczyk)

- os/bluestore: BlueFS: harmonize log read and writes modes ([pr#50474](https://github.com/ceph/ceph/pull/50474), Adam Kupczyk)

- os/bluestore: enable 4K allocation unit for BlueFS ([pr#49884](https://github.com/ceph/ceph/pull/49884), Igor Fedotov)

- os/memstore: Fix memory leak ([pr#50091](https://github.com/ceph/ceph/pull/50091), Adam Kupczyk)

- osd: add created\_at meta ([pr#49159](https://github.com/ceph/ceph/pull/49159), Alex Marangone)

- osd: add scrub duration for scrubs after recovery ([pr#47926](https://github.com/ceph/ceph/pull/47926), Aishwarya Mathuria)

- osd: Implement Context based completion for mon cmd to set a config option ([pr#47983](https://github.com/ceph/ceph/pull/47983), Sridhar Seshasayee)

- osd: mds: suggest clock skew when failing to obtain rotating service keys ([pr#50405](https://github.com/ceph/ceph/pull/50405), Greg Farnum)

- osd: Randomize osd bench buffer data before submitting to objectstore ([pr#49323](https://github.com/ceph/ceph/pull/49323), Sridhar Seshasayee)

- osd: Reduce backfill/recovery default limits for mClock and other optimizations ([pr#49437](https://github.com/ceph/ceph/pull/49437), Sridhar Seshasayee)

- osd: remove invalid put on message ([pr#48039](https://github.com/ceph/ceph/pull/48039), Nitzan Mordechai)

- osd: Reset mClock's OSD capacity config option for inactive device type ([pr#49281](https://github.com/ceph/ceph/pull/49281), Sridhar Seshasayee)

- osd: Restore defaults of mClock built-in profiles upon modification ([pr#50097](https://github.com/ceph/ceph/pull/50097), Sridhar Seshasayee)

- osd: shut down the MgrClient before osd\_fast\_shutdown ([pr#49881](https://github.com/ceph/ceph/pull/49881), Laura Flores, Brad Hubbard)

- PendingReleaseNotes: document online and offline trimming of PG Log's… ([pr#48019](https://github.com/ceph/ceph/pull/48019), Radoslaw Zarzynski)

- pybind/mgr/autoscaler: Donot show NEW PG\_NUM value if autoscaler is not on ([pr#47925](https://github.com/ceph/ceph/pull/47925), Prashant D)

- pybind/mgr: check for empty metadata mgr\_module:get\_metadata() ([issue#57072](http://tracker.ceph.com/issues/57072), [pr#49967](https://github.com/ceph/ceph/pull/49967), Venky Shankar)

- pybind/mgr: fix tox autopep8 args flake8 ([pr#49505](https://github.com/ceph/ceph/pull/49505), Aashish Sharma)

- pybind/mgr: fixup after upgrading tox versions ([pr#49361](https://github.com/ceph/ceph/pull/49361), Kefu Chai, Adam King)

- pybind/mgr: object\_format<span></span>.py decorator updates & docs ([pr#47979](https://github.com/ceph/ceph/pull/47979), John Mulligan)

- pybind/mgr: tox and test fixes ([pr#49508](https://github.com/ceph/ceph/pull/49508), Kefu Chai)

- pybind/mgr: use memory temp\_store for sqlite3 db ([pr#50286](https://github.com/ceph/ceph/pull/50286), Patrick Donnelly)

- pybind/rados: notify callback reconnect ([pr#48113](https://github.com/ceph/ceph/pull/48113), Nitzan Mordechai)

- python-common: Add 'KB' to supported suffixes in SizeMatcher ([pr#48242](https://github.com/ceph/ceph/pull/48242), Tim Serong)

- qa/cephadm: remove fsid dir before bootstrap in test\_cephadm<span></span>.sh ([pr#47949](https://github.com/ceph/ceph/pull/47949), Adam King)

- qa/fs/mixed-clients: specify distros for tests ([pr#49957](https://github.com/ceph/ceph/pull/49957), Dhairya Parmar)

- qa/suites/rbd: fix sporadic "rx-only direction" test failures ([pr#50113](https://github.com/ceph/ceph/pull/50113), Ilya Dryomov)

- qa/suites/rgw: fix and update tempest and barbican tests ([pr#50002](https://github.com/ceph/ceph/pull/50002), Tobias Urdin)

- qa/tasks/cephadm<span></span>.py: fix pulling cephadm from git<span></span>.ceph<span></span>.com ([pr#49858](https://github.com/ceph/ceph/pull/49858), Adam King)

- qa/tasks/kubeadm: set up tigera resources via kubectl create ([pr#48080](https://github.com/ceph/ceph/pull/48080), John Mulligan)

- qa/tasks/rbd\_fio: bump default to fio 3<span></span>.32 ([pr#48386](https://github.com/ceph/ceph/pull/48386), Ilya Dryomov)

- qa/tests: added quincy client upgrade => reef ([pr#50353](https://github.com/ceph/ceph/pull/50353), Yuri Weinstein)

- qa/tests: initial draft for quincy p2p tests ([pr#46896](https://github.com/ceph/ceph/pull/46896), Yuri Weinstein, Laura Flores)

- qa/workunits/rados: specify redirect in curl command ([pr#49140](https://github.com/ceph/ceph/pull/49140), Laura Flores)

- qa/workunits/windows: backport rbd-wnbd tests ([pr#49883](https://github.com/ceph/ceph/pull/49883), Lucian Petrut)

- qa: Fix test\_subvolume\_group\_ls\_filter\_internal\_directories ([pr#48327](https://github.com/ceph/ceph/pull/48327), Kotresh HR)

- qa: Fix test\_subvolume\_snapshot\_info\_if\_orphan\_clone ([pr#48325](https://github.com/ceph/ceph/pull/48325), Kotresh HR)

- qa: ignore disk quota exceeded failure in test ([pr#48164](https://github.com/ceph/ceph/pull/48164), Nikhilkumar Shelke)

- qa: switch back to git protocol for qemu-xfstests ([pr#49544](https://github.com/ceph/ceph/pull/49544), Ilya Dryomov)

- qa: switch to https protocol for repos' server ([pr#49471](https://github.com/ceph/ceph/pull/49471), Xiubo Li)

- qa: wait for scrub to finish ([pr#49459](https://github.com/ceph/ceph/pull/49459), Milind Changire)

- Quincy: osd/scrub: use the actual active set when requesting replicas… ([pr#48543](https://github.com/ceph/ceph/pull/48543), Ronen Friedman)

- rbd-mirror: add information about the last snapshot sync to image status ([pr#50266](https://github.com/ceph/ceph/pull/50266), Divyansh Kamboj)

- rbd-mirror: fix syncing\_percent calculation logic in get\_replay\_status() ([pr#50180](https://github.com/ceph/ceph/pull/50180), N Balachandran)

- rbd: add --snap-id option to "rbd device map" to allow mapping arbitrary snapshots ([pr#49197](https://github.com/ceph/ceph/pull/49197), Ilya Dryomov, Prasanna Kumar Kalever)

- rbd: device map/unmap --namespace handling fixes ([pr#48458](https://github.com/ceph/ceph/pull/48458), Ilya Dryomov, Stefan Chivu)

- RGW - Make sure PostObj set bucket on s->object ([pr#49641](https://github.com/ceph/ceph/pull/49641), Daniel Gryniewicz)

- rgw multisite: replicate metadata for iam roles ([pr#48030](https://github.com/ceph/ceph/pull/48030), Pritha Srivastava, Abhishek Lekshmanan)

- rgw/beast: fix interaction between keepalive and 100-continue ([pr#49840](https://github.com/ceph/ceph/pull/49840), Casey Bodley)

- rgw/beast: StreamIO remembers connection errors for graceful shutdown ([pr#50239](https://github.com/ceph/ceph/pull/50239), Casey Bodley)

- rgw/coroutine: check for null stack on wakeup ([pr#49096](https://github.com/ceph/ceph/pull/49096), Casey Bodley)

- rgw: "reshard cancel" errors with "invalid argument" ([pr#49090](https://github.com/ceph/ceph/pull/49090), J. Eric Ivancich)

- rgw: add 'inline\_data' zone placement info option ([pr#50209](https://github.com/ceph/ceph/pull/50209), Cory Snyder)

- rgw: adding BUCKET\_REWRITE and OBJECT\_REWRITE OPS to ([pr#49094](https://github.com/ceph/ceph/pull/49094), Pritha Srivastava)

- rgw: address bug where object puts could write to decommissioned shard ([pr#49795](https://github.com/ceph/ceph/pull/49795), J. Eric Ivancich)

- rgw: Backport of issue 57562 to Quincy ([pr#49679](https://github.com/ceph/ceph/pull/49679), Adam C. Emerson)

- rgw: bucket list operation slow down in special scenario ([pr#49085](https://github.com/ceph/ceph/pull/49085), zealot)

- rgw: default-initialize delete\_multi\_obj\_op\_meta ([pr#50184](https://github.com/ceph/ceph/pull/50184), Casey Bodley)

- rgw: fix bool/int logic error when calling get\_obj\_head\_ioctx ([pr#48231](https://github.com/ceph/ceph/pull/48231), J. Eric Ivancich)

- rgw: fix bug where variable referenced after data moved out ([pr#48228](https://github.com/ceph/ceph/pull/48228), J. Eric Ivancich)

- rgw: fix data corruption due to network jitter ([pr#48273](https://github.com/ceph/ceph/pull/48273), Shasha Lu)

- rgw: Fix segfault due to concurrent socket use at timeout ([pr#50240](https://github.com/ceph/ceph/pull/50240), Yixin Jin)

- rgw: fix segfault in UserAsyncRefreshHandler::init\_fetch ([pr#49083](https://github.com/ceph/ceph/pull/49083), Cory Snyder)

- rgw: fix the problem of duplicate idx when bi list ([pr#49828](https://github.com/ceph/ceph/pull/49828), wangtengfei)

- rgw: Fix truncated ListBuckets response ([pr#49525](https://github.com/ceph/ceph/pull/49525), Joshua Baergen)

- rgw: log deletion status of individual objects in multi object delete request ([pr#49084](https://github.com/ceph/ceph/pull/49084), Cory Snyder)

- rgw: prevent spurious/lost notifications in the index completion thread ([pr#49092](https://github.com/ceph/ceph/pull/49092), Casey Bodley, Yuval Lifshitz)

- rgw: remove guard\_reshard in bucket\_index\_read\_olh\_log ([pr#49775](https://github.com/ceph/ceph/pull/49775), Mingyuan Liang)

- rgw: RGWPutLC does not require Content-MD5 ([pr#49088](https://github.com/ceph/ceph/pull/49088), Casey Bodley)

- rgw: splitting gc chains into smaller parts to prevent ([pr#48239](https://github.com/ceph/ceph/pull/48239), Pritha Srivastava)

- rgw: x-amz-date change breaks certain cases of aws sig v4 ([pr#48312](https://github.com/ceph/ceph/pull/48312), Marcus Watts)

- src/crush: extra logging to debug CPU burn in test\_with\_fork() ([pr#50406](https://github.com/ceph/ceph/pull/50406), Deepika Upadhyay)

- src/mds: increment directory inode's change attr by one ([pr#48520](https://github.com/ceph/ceph/pull/48520), Ramana Raja)

- src/pybind/cephfs: fix grammar ([pr#48981](https://github.com/ceph/ceph/pull/48981), Zac Dover)

- src/pybind: fix typo in cephfs<span></span>.pyx ([pr#48952](https://github.com/ceph/ceph/pull/48952), Zac Dover)

- src/valgrind<span></span>.supp: Adding know leaks unrelated to ceph ([pr#49522](https://github.com/ceph/ceph/pull/49522), Nitzan Mordechai)

- tests: remove pubsub tests from multisite ([pr#48914](https://github.com/ceph/ceph/pull/48914), Yuval Lifshitz)

- v17<span></span>.2<span></span>.5 ([pr#48519](https://github.com/ceph/ceph/pull/48519), Ceph Release Team, Laura Flores, Guillaume Abrioux, Juan Miguel Olmo Martínez)

- Wip doc 2022 11 21 backport 48975 to quincy ([pr#48976](https://github.com/ceph/ceph/pull/48976), Zac Dover)


