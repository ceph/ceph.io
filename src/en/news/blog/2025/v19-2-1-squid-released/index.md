---
title: "v19.2.1 Squid released"
date: "2025-02-06"
author: "Yuri Weinstein"
tags:
  - "release"
  - "squid"
---

This is the first backport release in the Squid series.
We recommend all users update to this release.

## Notable Changes

- CephFS: The command `fs subvolume create` now allows tagging subvolumes by supplying the option
  `--earmark` with a unique identifier needed for NFS or SMB services. The earmark
  string for a subvolume is empty by default. To remove an already present earmark,
  an empty string can be assigned to it. Additionally, the commands
  `ceph fs subvolume earmark set`, `ceph fs subvolume earmark get`, and
  `ceph fs subvolume earmark rm` have been added to set, get and remove earmark from a given subvolume.

- CephFS: Expanded removexattr support for CephFS virtual extended attributes.
  Previously one had to use setxattr to restore the default in order to "remove".
  You may now properly use removexattr to remove. You can also now remove layout
  on the root inode, which then will restore the layout to the default.

- RADOS: A performance bottleneck in the balancer mgr module has been fixed.

  Related Tracker: https://tracker.ceph.com/issues/68657

- RADOS: Based on tests performed at scale on an HDD-based Ceph cluster, it was found
  that scheduling with mClock was not optimal with multiple OSD shards. For
  example, in the test cluster with multiple OSD node failures, the client
  throughput was found to be inconsistent across test runs coupled with multiple
  reported slow requests. However, the same test with a single OSD shard and
  with multiple worker threads yielded significantly better results in terms of
  consistency of client and recovery throughput across multiple test runs.
  Therefore, as an interim measure until the issue with multiple OSD shards
  (or multiple mClock queues per OSD) is investigated and fixed, the following
  change to the default HDD OSD shard configuration is made:

    - `osd_op_num_shards_hdd = 1` (was 5)  
    - `osd_op_num_threads_per_shard_hdd = 5` (was 1)

  For more details, see https://tracker.ceph.com/issues/66289.

- mgr/REST: The REST manager module will trim requests based on the 'max_requests' option.
  Without this feature, and in the absence of manual deletion of old requests,
  the accumulation of requests in the array can lead to Out Of Memory (OOM) issues,
  resulting in the Manager crashing.

## Changelog

- doc/rgw/notification: add missing admin commands ([pr#60609](https://github.com/ceph/ceph/pull/60609), Yuval Lifshitz)

- squid: [RGW] Fix the handling of HEAD requests that do not comply with RFC standards ([pr#59123](https://github.com/ceph/ceph/pull/59123), liubingrun)

- squid: a series of optimizations for kerneldevice discard ([pr#59065](https://github.com/ceph/ceph/pull/59065), Adam Kupczyk, Joshua Baergen, Gabriel BenHanokh, Matt Vandermeulen)

- squid: Add Containerfile and build<span></span>.sh to build it ([pr#60229](https://github.com/ceph/ceph/pull/60229), Dan Mick)

- squid: AsyncMessenger: Don't decrease l\_msgr\_active\_connections if it is negative ([pr#60447](https://github.com/ceph/ceph/pull/60447), Mohit Agrawal)

- squid: blk/aio: fix long batch (64+K entries) submission ([pr#58676](https://github.com/ceph/ceph/pull/58676), Yingxin Cheng, Igor Fedotov, Adam Kupczyk, Robin Geuze)

- squid: blk/KernelDevice: using join() to wait thread end is more safe ([pr#60616](https://github.com/ceph/ceph/pull/60616), Yite Gu)

- squid: bluestore/bluestore\_types: avoid heap-buffer-overflow in another way to keep code uniformity ([pr#58816](https://github.com/ceph/ceph/pull/58816), Rongqi Sun)

- squid: ceph-bluestore-tool: Fixes for multilple bdev label ([pr#59967](https://github.com/ceph/ceph/pull/59967), Adam Kupczyk, Igor Fedotov)

- squid: ceph-volume: add call to `ceph-bluestore-tool zap-device` ([pr#59968](https://github.com/ceph/ceph/pull/59968), Guillaume Abrioux)

- squid: ceph-volume: add new class UdevData ([pr#60091](https://github.com/ceph/ceph/pull/60091), Guillaume Abrioux)

- squid: ceph-volume: add TPM2 token enrollment support for encrypted OSDs ([pr#59196](https://github.com/ceph/ceph/pull/59196), Guillaume Abrioux)

- squid: ceph-volume: do not convert LVs's symlink to real path ([pr#58954](https://github.com/ceph/ceph/pull/58954), Guillaume Abrioux)

- squid: ceph-volume: do source devices zapping if they're detached ([pr#58964](https://github.com/ceph/ceph/pull/58964), Guillaume Abrioux, Igor Fedotov)

- squid: ceph-volume: drop unnecessary call to `get\_single\_lv()` ([pr#60353](https://github.com/ceph/ceph/pull/60353), Guillaume Abrioux)

- squid: ceph-volume: fix dmcrypt activation regression ([pr#60734](https://github.com/ceph/ceph/pull/60734), Guillaume Abrioux)

- squid: ceph-volume: fix generic activation with raw osds ([pr#59598](https://github.com/ceph/ceph/pull/59598), Guillaume Abrioux)

- squid: ceph-volume: fix OSD lvm/tpm2 activation ([pr#59953](https://github.com/ceph/ceph/pull/59953), Guillaume Abrioux)

- squid: ceph-volume: pass self<span></span>.osd\_id to create\_id() call ([pr#59622](https://github.com/ceph/ceph/pull/59622), Guillaume Abrioux)

- squid: ceph-volume: switch over to new disk sorting behavior ([pr#59623](https://github.com/ceph/ceph/pull/59623), Guillaume Abrioux)

- squid: ceph<span></span>.spec<span></span>.in: we need jsonnet for all distroes for make check ([pr#60075](https://github.com/ceph/ceph/pull/60075), Kyr Shatskyy)

- squid: cephadm/services/ingress: fixed keepalived config bug ([pr#58381](https://github.com/ceph/ceph/pull/58381), Bernard Landon)

- Squid: cephadm: bootstrap should not have "This is a development version of cephadm" message ([pr#60880](https://github.com/ceph/ceph/pull/60880), Shweta Bhosale)

- squid: cephadm: emit warning if daemon's image is not to be used ([pr#59929](https://github.com/ceph/ceph/pull/59929), Matthew Vernon)

- squid: cephadm: fix apparmor profiles with spaces in the names ([pr#58542](https://github.com/ceph/ceph/pull/58542), John Mulligan)

- squid: cephadm: pull container images from quay<span></span>.io ([pr#60354](https://github.com/ceph/ceph/pull/60354), Guillaume Abrioux)

- squid: cephadm: Support Docker Live Restore ([pr#59933](https://github.com/ceph/ceph/pull/59933), Michal Nasiadka)

- squid: cephadm: update default image and latest stable release ([pr#59827](https://github.com/ceph/ceph/pull/59827), Adam King)

- squid: cephfs,mon: fix bugs related to updating MDS caps ([pr#59672](https://github.com/ceph/ceph/pull/59672), Rishabh Dave)

- squid: cephfs-shell: excute cmd 'rmdir\_helper' reported error ([pr#58810](https://github.com/ceph/ceph/pull/58810), teng jie)

- squid: cephfs: Fixed a bug in the readdir\_cache\_cb function that may have us… ([pr#58804](https://github.com/ceph/ceph/pull/58804), Tod Chen)

- squid: cephfs\_mirror: provide metrics for last successful snapshot sync ([pr#59070](https://github.com/ceph/ceph/pull/59070), Jos Collin)

- squid: cephfs\_mirror: update peer status for invalid metadata in remote snapshot ([pr#59406](https://github.com/ceph/ceph/pull/59406), Jos Collin)

- squid: cephfs\_mirror: use snapdiff api for incremental syncing ([pr#58984](https://github.com/ceph/ceph/pull/58984), Jos Collin)

- squid: client: calls to \_ll\_fh\_exists() should hold client\_lock ([pr#59487](https://github.com/ceph/ceph/pull/59487), Venky Shankar)

- squid: client: check mds down status before getting mds\_gid\_t from mdsmap ([pr#58587](https://github.com/ceph/ceph/pull/58587), Yite Gu, Dhairya Parmar)

- squid: cls/user: reset stats only returns marker when truncated ([pr#60164](https://github.com/ceph/ceph/pull/60164), Casey Bodley)

- squid: cmake: use ExternalProjects to build isa-l and isa-l\_crypto libraries ([pr#60107](https://github.com/ceph/ceph/pull/60107), Casey Bodley)

- squid: common,osd: Use last valid OSD IOPS value if measured IOPS is unrealistic ([pr#60660](https://github.com/ceph/ceph/pull/60660), Sridhar Seshasayee)

- squid: common/dout: fix FTBFS on GCC 14 ([pr#59055](https://github.com/ceph/ceph/pull/59055), Radoslaw Zarzynski)

- squid: common/options: Change HDD OSD shard configuration defaults for mClock ([pr#59973](https://github.com/ceph/ceph/pull/59973), Sridhar Seshasayee)

- squid: corpus: update submodule with mark cls\_rgw\_reshard\_entry forward\_inco… ([pr#58923](https://github.com/ceph/ceph/pull/58923), NitzanMordhai)

- squid: crimson/os/seastore/cached\_extent: add the "refresh" ability to lba mappings ([pr#58957](https://github.com/ceph/ceph/pull/58957), Xuehan Xu)

- squid: crimson/os/seastore/lba\_manager: do batch mapping allocs when remapping multiple mappings ([pr#58820](https://github.com/ceph/ceph/pull/58820), Xuehan Xu)

- squid: crimson/os/seastore/onode: add hobject\_t into Onode ([pr#58830](https://github.com/ceph/ceph/pull/58830), Xuehan Xu)

- squid: crimson/os/seastore/transaction\_manager: consider inconsistency between backrefs and lbas acceptable when cleaning segments ([pr#58837](https://github.com/ceph/ceph/pull/58837), Xuehan Xu)

- squid: crimson/os/seastore: add checksum offload to RBM ([pr#59298](https://github.com/ceph/ceph/pull/59298), Myoungwon Oh)

- squid: crimson/os/seastore: add writer level stats to RBM ([pr#58828](https://github.com/ceph/ceph/pull/58828), Myoungwon Oh)

- squid: crimson/os/seastore: track transactions/conflicts/outstanding periodically ([pr#58835](https://github.com/ceph/ceph/pull/58835), Yingxin Cheng)

- squid: crimson/osd/pg\_recovery: push the iteration forward after finding unfound objects when starting primary recoveries ([pr#58958](https://github.com/ceph/ceph/pull/58958), Xuehan Xu)

- squid: crimson: access coll\_map under alien tp with a lock ([pr#58841](https://github.com/ceph/ceph/pull/58841), Samuel Just)

- squid: crimson: audit and correct epoch captured by IOInterruptCondition ([pr#58839](https://github.com/ceph/ceph/pull/58839), Samuel Just)

- squid: crimson: simplify obc loading by locking excl for load and demoting to needed lock ([pr#58905](https://github.com/ceph/ceph/pull/58905), Matan Breizman, Samuel Just)

- squid: debian pkg: record python3-packaging dependency for ceph-volume ([pr#59202](https://github.com/ceph/ceph/pull/59202), Kefu Chai, Thomas Lamprecht)

- squid: doc,mailmap: update my email / association to ibm ([pr#60338](https://github.com/ceph/ceph/pull/60338), Patrick Donnelly)

- squid: doc/ceph-volume: add spillover fix procedure ([pr#59540](https://github.com/ceph/ceph/pull/59540), Zac Dover)

- squid: doc/cephadm: add malformed-JSON removal instructions ([pr#59663](https://github.com/ceph/ceph/pull/59663), Zac Dover)

- squid: doc/cephadm: Clarify "Deploying a new Cluster" ([pr#60809](https://github.com/ceph/ceph/pull/60809), Zac Dover)

- squid: doc/cephadm: clean "Adv<span></span>. OSD Service Specs" ([pr#60679](https://github.com/ceph/ceph/pull/60679), Zac Dover)

- squid: doc/cephadm: correct "ceph orch apply" command ([pr#60432](https://github.com/ceph/ceph/pull/60432), Zac Dover)

- squid: doc/cephadm: how to get exact size\_spec from device ([pr#59430](https://github.com/ceph/ceph/pull/59430), Zac Dover)

- squid: doc/cephadm: link to "host pattern" matching sect ([pr#60644](https://github.com/ceph/ceph/pull/60644), Zac Dover)

- squid: doc/cephadm: Update operations<span></span>.rst ([pr#60637](https://github.com/ceph/ceph/pull/60637), rhkelson)

- squid: doc/cephfs: add cache pressure information ([pr#59148](https://github.com/ceph/ceph/pull/59148), Zac Dover)

- squid: doc/cephfs: add doc for disabling mgr/volumes plugin ([pr#60496](https://github.com/ceph/ceph/pull/60496), Rishabh Dave)

- squid: doc/cephfs: edit "Disabling Volumes Plugin" ([pr#60467](https://github.com/ceph/ceph/pull/60467), Zac Dover)

- squid: doc/cephfs: edit "Layout Fields" text ([pr#59021](https://github.com/ceph/ceph/pull/59021), Zac Dover)

- squid: doc/cephfs: edit 3rd 3rd of mount-using-kernel-driver ([pr#61080](https://github.com/ceph/ceph/pull/61080), Zac Dover)

- squid: doc/cephfs: improve "layout fields" text ([pr#59250](https://github.com/ceph/ceph/pull/59250), Zac Dover)

- squid: doc/cephfs: improve cache-configuration<span></span>.rst ([pr#59214](https://github.com/ceph/ceph/pull/59214), Zac Dover)

- squid: doc/cephfs: rearrange subvolume group information ([pr#60435](https://github.com/ceph/ceph/pull/60435), Indira Sawant)

- squid: doc/cephfs: s/mountpoint/mount point/ ([pr#59294](https://github.com/ceph/ceph/pull/59294), Zac Dover)

- squid: doc/cephfs: s/mountpoint/mount point/ ([pr#59289](https://github.com/ceph/ceph/pull/59289), Zac Dover)

- squid: doc/cephfs: use 'p' flag to set layouts or quotas ([pr#60482](https://github.com/ceph/ceph/pull/60482), TruongSinh Tran-Nguyen)

- squid: doc/dev/peering: Change acting set num ([pr#59062](https://github.com/ceph/ceph/pull/59062), qn2060)

- squid: doc/dev/release-checklist: check telemetry validation ([pr#59813](https://github.com/ceph/ceph/pull/59813), Yaarit Hatuka)

- squid: doc/dev/release-checklists<span></span>.rst: enable rtd for squid ([pr#59812](https://github.com/ceph/ceph/pull/59812), Neha Ojha)

- squid: doc/dev/release-process<span></span>.rst: New container build/release process ([pr#60971](https://github.com/ceph/ceph/pull/60971), Dan Mick)

- squid: doc/dev: add "activate latest release" RTD step ([pr#59654](https://github.com/ceph/ceph/pull/59654), Zac Dover)

- squid: doc/dev: instruct devs to backport ([pr#61063](https://github.com/ceph/ceph/pull/61063), Zac Dover)

- squid: doc/dev: remove "Stable Releases and Backports" ([pr#60272](https://github.com/ceph/ceph/pull/60272), Zac Dover)

- squid: doc/glossary<span></span>.rst: add "Dashboard Plugin" ([pr#60896](https://github.com/ceph/ceph/pull/60896), Zac Dover)

- squid: doc/glossary: add "ceph-ansible" ([pr#59007](https://github.com/ceph/ceph/pull/59007), Zac Dover)

- squid: doc/glossary: add "flapping OSD" ([pr#60864](https://github.com/ceph/ceph/pull/60864), Zac Dover)

- squid: doc/glossary: add "object storage" ([pr#59424](https://github.com/ceph/ceph/pull/59424), Zac Dover)

- squid: doc/glossary: add "PLP" to glossary ([pr#60503](https://github.com/ceph/ceph/pull/60503), Zac Dover)

- squid: doc/governance: add exec council responsibilites ([pr#60139](https://github.com/ceph/ceph/pull/60139), Zac Dover)

- squid: doc/governance: add Zac Dover's updated email ([pr#60134](https://github.com/ceph/ceph/pull/60134), Zac Dover)

- squid: doc/install: Keep the name field of the created user consistent with … ([pr#59756](https://github.com/ceph/ceph/pull/59756), hejindong)

- squid: doc/man: edit ceph-bluestore-tool<span></span>.rst ([pr#59682](https://github.com/ceph/ceph/pull/59682), Zac Dover)

- squid: doc/mds: improve wording ([pr#59585](https://github.com/ceph/ceph/pull/59585), Piotr Parczewski)

- squid: doc/mgr/dashboard: fix TLS typo ([pr#59031](https://github.com/ceph/ceph/pull/59031), Mindy Preston)

- squid: doc/rados/operations: Improve health-checks<span></span>.rst ([pr#59582](https://github.com/ceph/ceph/pull/59582), Anthony D'Atri)

- squid: doc/rados/troubleshooting: Improve log-and-debug<span></span>.rst ([pr#60824](https://github.com/ceph/ceph/pull/60824), Anthony D'Atri)

- squid: doc/rados: add "pgs not deep scrubbed in time" info ([pr#59733](https://github.com/ceph/ceph/pull/59733), Zac Dover)

- squid: doc/rados: add blaum\_roth coding guidance ([pr#60537](https://github.com/ceph/ceph/pull/60537), Zac Dover)

- squid: doc/rados: add confval directives to health-checks ([pr#59871](https://github.com/ceph/ceph/pull/59871), Zac Dover)

- squid: doc/rados: add link to messenger v2 info in mon-lookup-dns<span></span>.rst ([pr#59794](https://github.com/ceph/ceph/pull/59794), Zac Dover)

- squid: doc/rados: add osd\_deep\_scrub\_interval setting operation ([pr#59802](https://github.com/ceph/ceph/pull/59802), Zac Dover)

- squid: doc/rados: correct "full ratio" note ([pr#60737](https://github.com/ceph/ceph/pull/60737), Zac Dover)

- squid: doc/rados: document unfound object cache-tiering scenario ([pr#59380](https://github.com/ceph/ceph/pull/59380), Zac Dover)

- squid: doc/rados: edit "Placement Groups Never Get Clean" ([pr#60046](https://github.com/ceph/ceph/pull/60046), Zac Dover)

- squid: doc/rados: fix sentences in health-checks (2 of x) ([pr#60931](https://github.com/ceph/ceph/pull/60931), Zac Dover)

- squid: doc/rados: fix sentences in health-checks (3 of x) ([pr#60949](https://github.com/ceph/ceph/pull/60949), Zac Dover)

- squid: doc/rados: make sentences agree in health-checks<span></span>.rst ([pr#60920](https://github.com/ceph/ceph/pull/60920), Zac Dover)

- squid: doc/rados: standardize markup of "clean" ([pr#60500](https://github.com/ceph/ceph/pull/60500), Zac Dover)

- squid: doc/radosgw/multisite: fix Configuring Secondary Zones -> Updating the Period ([pr#60332](https://github.com/ceph/ceph/pull/60332), Casey Bodley)

- squid: doc/radosgw/qat-accel: Update and Add QATlib information ([pr#58874](https://github.com/ceph/ceph/pull/58874), Feng, Hualong)

- squid: doc/radosgw: Improve archive-sync-module<span></span>.rst ([pr#60852](https://github.com/ceph/ceph/pull/60852), Anthony D'Atri)

- squid: doc/radosgw: Improve archive-sync-module<span></span>.rst more ([pr#60867](https://github.com/ceph/ceph/pull/60867), Anthony D'Atri)

- squid: doc/radosgw: Improve config-ref<span></span>.rst ([pr#59578](https://github.com/ceph/ceph/pull/59578), Anthony D'Atri)

- squid: doc/radosgw: improve qat-accel<span></span>.rst ([pr#59179](https://github.com/ceph/ceph/pull/59179), Anthony D'Atri)

- squid: doc/radosgw: s/Poliicy/Policy/ ([pr#60707](https://github.com/ceph/ceph/pull/60707), Zac Dover)

- squid: doc/radosgw: update rgw\_dns\_name doc ([pr#60885](https://github.com/ceph/ceph/pull/60885), Zac Dover)

- squid: doc/rbd: add namespace information for mirror commands ([pr#60269](https://github.com/ceph/ceph/pull/60269), N Balachandran)

- squid: doc/README<span></span>.md - add ordered list ([pr#59798](https://github.com/ceph/ceph/pull/59798), Zac Dover)

- squid: doc/README<span></span>.md: create selectable commands ([pr#59834](https://github.com/ceph/ceph/pull/59834), Zac Dover)

- squid: doc/README<span></span>.md: edit "Build Prerequisites" ([pr#59637](https://github.com/ceph/ceph/pull/59637), Zac Dover)

- squid: doc/README<span></span>.md: improve formatting ([pr#59785](https://github.com/ceph/ceph/pull/59785), Zac Dover)

- squid: doc/README<span></span>.md: improve formatting ([pr#59700](https://github.com/ceph/ceph/pull/59700), Zac Dover)

- squid: doc/rgw/account: Handling notification topics when migrating an existing user into an account ([pr#59491](https://github.com/ceph/ceph/pull/59491), Oguzhan Ozmen)

- squid: doc/rgw/d3n: pass cache dir volume to extra\_container\_args ([pr#59767](https://github.com/ceph/ceph/pull/59767), Mark Kogan)

- squid: doc/rgw/notification: clarified the notification\_v2 behavior upon upg… ([pr#60662](https://github.com/ceph/ceph/pull/60662), Yuval Lifshitz)

- squid: doc/rgw/notification: persistent notification queue full behavior ([pr#59233](https://github.com/ceph/ceph/pull/59233), Yuval Lifshitz)

- squid: doc/start: add supported Squid distros ([pr#60557](https://github.com/ceph/ceph/pull/60557), Zac Dover)

- squid: doc/start: add vstart install guide ([pr#60461](https://github.com/ceph/ceph/pull/60461), Zac Dover)

- squid: doc/start: fix "are are" typo ([pr#60708](https://github.com/ceph/ceph/pull/60708), Zac Dover)

- squid: doc/start: separate package chart from container chart ([pr#60698](https://github.com/ceph/ceph/pull/60698), Zac Dover)

- squid: doc/start: update os-recommendations<span></span>.rst ([pr#60766](https://github.com/ceph/ceph/pull/60766), Zac Dover)

- squid: doc: Correct link to Prometheus docs ([pr#59559](https://github.com/ceph/ceph/pull/59559), Matthew Vernon)

- squid: doc: Document the Windows CI job ([pr#60033](https://github.com/ceph/ceph/pull/60033), Lucian Petrut)

- squid: doc: Document which options are disabled by mClock ([pr#60671](https://github.com/ceph/ceph/pull/60671), Niklas Hambüchen)

- squid: doc: documenting the feature that scrub clear the entries from damage… ([pr#59078](https://github.com/ceph/ceph/pull/59078), Neeraj Pratap Singh)

- squid: doc: explain the consequence of enabling mirroring through monitor co… ([pr#60525](https://github.com/ceph/ceph/pull/60525), Jos Collin)

- squid: doc: fix email ([pr#60233](https://github.com/ceph/ceph/pull/60233), Ernesto Puerta)

- squid: doc: fix typo ([pr#59991](https://github.com/ceph/ceph/pull/59991), N Balachandran)

- squid: doc: Harmonize 'mountpoint' ([pr#59291](https://github.com/ceph/ceph/pull/59291), Anthony D'Atri)

- squid: doc: s/Whereas,/Although/ ([pr#60593](https://github.com/ceph/ceph/pull/60593), Zac Dover)

- squid: doc: SubmittingPatches-backports - remove backports team ([pr#60297](https://github.com/ceph/ceph/pull/60297), Zac Dover)

- squid: doc: Update "Getting Started" to link to start not install ([pr#59907](https://github.com/ceph/ceph/pull/59907), Matthew Vernon)

- squid: doc: update Key Idea in cephfs-mirroring<span></span>.rst ([pr#60343](https://github.com/ceph/ceph/pull/60343), Jos Collin)

- squid: doc: update nfs doc for Kerberos setup of ganesha in Ceph ([pr#59939](https://github.com/ceph/ceph/pull/59939), Avan Thakkar)

- squid: doc: update tests-integration-testing-teuthology-workflow<span></span>.rst ([pr#59548](https://github.com/ceph/ceph/pull/59548), Vallari Agrawal)

- squid: doc:update e-mail addresses governance ([pr#60084](https://github.com/ceph/ceph/pull/60084), Tobias Fischer)

- squid: docs/rados/operations/stretch-mode: warn device class is not supported ([pr#59099](https://github.com/ceph/ceph/pull/59099), Kamoltat Sirivadhna)

- squid: global: Call getnam\_r with a 64KiB buffer on the heap ([pr#60127](https://github.com/ceph/ceph/pull/60127), Adam Emerson)

- squid: librados: use CEPH\_OSD\_FLAG\_FULL\_FORCE for IoCtxImpl::remove ([pr#59284](https://github.com/ceph/ceph/pull/59284), Chen Yuanrun)

- squid: librbd/crypto/LoadRequest: clone format for migration source image ([pr#60171](https://github.com/ceph/ceph/pull/60171), Ilya Dryomov)

- squid: librbd/crypto: fix issue when live-migrating from encrypted export ([pr#59145](https://github.com/ceph/ceph/pull/59145), Ilya Dryomov)

- squid: librbd/migration/HttpClient: avoid reusing ssl\_stream after shut down ([pr#61095](https://github.com/ceph/ceph/pull/61095), Ilya Dryomov)

- squid: librbd/migration: prune snapshot extents in RawFormat::list\_snaps() ([pr#59661](https://github.com/ceph/ceph/pull/59661), Ilya Dryomov)

- squid: librbd: avoid data corruption on flatten when object map is inconsistent ([pr#61168](https://github.com/ceph/ceph/pull/61168), Ilya Dryomov)

- squid: log: save/fetch thread name infra ([pr#60279](https://github.com/ceph/ceph/pull/60279), Milind Changire)

- squid: Make mon addrs consistent with mon info ([pr#60751](https://github.com/ceph/ceph/pull/60751), shenjiatong)

- squid: mds/QuiesceDbManager: get requested state of members before iterating… ([pr#58912](https://github.com/ceph/ceph/pull/58912), junxiang Mu)

- squid: mds: CInode::item\_caps used in two different lists ([pr#56887](https://github.com/ceph/ceph/pull/56887), Dhairya Parmar)

- squid: mds: encode quiesce payload on demand ([pr#59517](https://github.com/ceph/ceph/pull/59517), Patrick Donnelly)

- squid: mds: find a new head for the batch ops when the head is dead ([pr#57494](https://github.com/ceph/ceph/pull/57494), Xiubo Li)

- squid: mds: fix session/client evict command ([pr#58727](https://github.com/ceph/ceph/pull/58727), Neeraj Pratap Singh)

- squid: mds: only authpin on wrlock when not a locallock ([pr#59097](https://github.com/ceph/ceph/pull/59097), Patrick Donnelly)

- squid: mgr/balancer: optimize 'balancer status detail' ([pr#60718](https://github.com/ceph/ceph/pull/60718), Laura Flores)

- squid: mgr/cephadm/services/ingress Fix HAProxy to listen on IPv4 and IPv6 ([pr#58515](https://github.com/ceph/ceph/pull/58515), Bernard Landon)

- squid: mgr/cephadm: add "original\_weight" parameter to OSD class ([pr#59410](https://github.com/ceph/ceph/pull/59410), Adam King)

- squid: mgr/cephadm: add --no-exception-when-missing flag to cert-store cert/key get ([pr#59935](https://github.com/ceph/ceph/pull/59935), Adam King)

- squid: mgr/cephadm: add command to expose systemd units of all daemons ([pr#59931](https://github.com/ceph/ceph/pull/59931), Adam King)

- squid: mgr/cephadm: bump monitoring stacks version ([pr#58711](https://github.com/ceph/ceph/pull/58711), Nizamudeen A)

- squid: mgr/cephadm: make ssh keepalive settings configurable ([pr#59710](https://github.com/ceph/ceph/pull/59710), Adam King)

- squid: mgr/cephadm: redeploy when some dependency daemon is add/removed ([pr#58383](https://github.com/ceph/ceph/pull/58383), Redouane Kachach)

- squid: mgr/cephadm: Update multi-site configs before deploying  daemons on rgw service create ([pr#60321](https://github.com/ceph/ceph/pull/60321), Aashish Sharma)

- squid: mgr/cephadm: use host address while updating rgw zone endpoints ([pr#59948](https://github.com/ceph/ceph/pull/59948), Aashish Sharma)

- squid: mgr/client: validate connection before sending ([pr#58887](https://github.com/ceph/ceph/pull/58887), NitzanMordhai)

- squid: mgr/dashboard: add cephfs rename REST API ([pr#60620](https://github.com/ceph/ceph/pull/60620), Yite Gu)

- squid: mgr/dashboard: Add group field in nvmeof service form ([pr#59446](https://github.com/ceph/ceph/pull/59446), Afreen Misbah)

- squid: mgr/dashboard: add gw\_groups support to nvmeof api ([pr#59751](https://github.com/ceph/ceph/pull/59751), Nizamudeen A)

- squid: mgr/dashboard: add gw\_groups to all nvmeof endpoints ([pr#60310](https://github.com/ceph/ceph/pull/60310), Nizamudeen A)

- squid: mgr/dashboard: add restful api for creating crush rule with type of 'erasure' ([pr#59139](https://github.com/ceph/ceph/pull/59139), sunlan)

- squid: mgr/dashboard: Changes for Sign out text to Login out ([pr#58988](https://github.com/ceph/ceph/pull/58988), Prachi Goel)

- Squid: mgr/dashboard: Cloning subvolume not listing \_nogroup if no subvolume ([pr#59951](https://github.com/ceph/ceph/pull/59951), Dnyaneshwari talwekar)

- squid: mgr/dashboard: custom image for kcli bootstrap script ([pr#59879](https://github.com/ceph/ceph/pull/59879), Pedro Gonzalez Gomez)

- squid: mgr/dashboard: Dashboard not showing Object/Overview correctly ([pr#59038](https://github.com/ceph/ceph/pull/59038), Aashish Sharma)

- squid: mgr/dashboard: Fix adding listener and null issue for groups ([pr#60078](https://github.com/ceph/ceph/pull/60078), Afreen Misbah)

- squid: mgr/dashboard: fix bucket get for s3 account owned bucket ([pr#60466](https://github.com/ceph/ceph/pull/60466), Nizamudeen A)

- squid: mgr/dashboard: fix ceph-users api doc ([pr#59140](https://github.com/ceph/ceph/pull/59140), Nizamudeen A)

- squid: mgr/dashboard: fix doc links in rgw-multisite ([pr#60154](https://github.com/ceph/ceph/pull/60154), Pedro Gonzalez Gomez)

- squid: mgr/dashboard: fix gateways section error:”404 - Not Found RGW Daemon not found: None” ([pr#60231](https://github.com/ceph/ceph/pull/60231), Aashish Sharma)

- squid: mgr/dashboard: fix group name bugs in the nvmeof API ([pr#60348](https://github.com/ceph/ceph/pull/60348), Nizamudeen A)

- squid: mgr/dashboard: fix handling NaN values in dashboard charts ([pr#59961](https://github.com/ceph/ceph/pull/59961), Aashish Sharma)

- squid: mgr/dashboard: fix lifecycle issues ([pr#60378](https://github.com/ceph/ceph/pull/60378), Pedro Gonzalez Gomez)

- squid: mgr/dashboard: Fix listener deletion ([pr#60292](https://github.com/ceph/ceph/pull/60292), Afreen Misbah)

- squid: mgr/dashboard: fix setting compression type while editing rgw zone ([pr#59970](https://github.com/ceph/ceph/pull/59970), Aashish Sharma)

- Squid: mgr/dashboard: Forbid snapshot name "<span></span>." and any containing "/" ([pr#59995](https://github.com/ceph/ceph/pull/59995), Dnyaneshwari Talwekar)

- squid: mgr/dashboard: handle infinite values for pools ([pr#61096](https://github.com/ceph/ceph/pull/61096), Afreen)

- squid: mgr/dashboard: ignore exceptions raised when no cert/key found ([pr#60311](https://github.com/ceph/ceph/pull/60311), Nizamudeen A)

- squid: mgr/dashboard: Increase maximum namespace count to 1024 ([pr#59717](https://github.com/ceph/ceph/pull/59717), Afreen Misbah)

- squid: mgr/dashboard: introduce server side pagination for osds ([pr#60294](https://github.com/ceph/ceph/pull/60294), Nizamudeen A)

- squid: mgr/dashboard: mgr/dashboard: Select no device by default in EC profile ([pr#59811](https://github.com/ceph/ceph/pull/59811), Afreen Misbah)

- Squid: mgr/dashboard: multisite sync policy improvements ([pr#59965](https://github.com/ceph/ceph/pull/59965), Naman Munet)

- Squid: mgr/dashboard: NFS Export form fixes ([pr#59900](https://github.com/ceph/ceph/pull/59900), Dnyaneshwari Talwekar)

- squid: mgr/dashboard: Nvme mTLS support and service name changes ([pr#59819](https://github.com/ceph/ceph/pull/59819), Afreen Misbah)

- squid: mgr/dashboard: provide option to enable pool based mirroring mode while creating a pool ([pr#58638](https://github.com/ceph/ceph/pull/58638), Aashish Sharma)

- squid: mgr/dashboard: remove cherrypy\_backports<span></span>.py ([pr#60632](https://github.com/ceph/ceph/pull/60632), Nizamudeen A)

- Squid: mgr/dashboard: remove orch required decorator from host UI router (list) ([pr#59851](https://github.com/ceph/ceph/pull/59851), Naman Munet)

- squid: mgr/dashboard: Rephrase dedicated pool helper in rbd create form ([pr#59721](https://github.com/ceph/ceph/pull/59721), Aashish Sharma)

- Squid: mgr/dashboard: RGW multisite sync remove zones fix ([pr#59825](https://github.com/ceph/ceph/pull/59825), Naman Munet)

- squid: mgr/dashboard: rm nvmeof conf based on its daemon name ([pr#60604](https://github.com/ceph/ceph/pull/60604), Nizamudeen A)

- Squid: mgr/dashboard: service form hosts selection only show up to 10 entries ([pr#59760](https://github.com/ceph/ceph/pull/59760), Naman Munet)

- squid: mgr/dashboard: show non default realm sync status in rgw overview page ([pr#60232](https://github.com/ceph/ceph/pull/60232), Aashish Sharma)

- squid: mgr/dashboard: Show which daemons failed in CEPHADM\_FAILED\_DAEMON healthcheck ([pr#59597](https://github.com/ceph/ceph/pull/59597), Aashish Sharma)

- Squid: mgr/dashboard: sync policy's in Object >> Multi-site >> Sync-policy, does not show the zonegroup to which policy belongs to ([pr#60346](https://github.com/ceph/ceph/pull/60346), Naman Munet)

- Squid: mgr/dashboard: The subvolumes are missing from the dropdown menu on the "Create NFS export" page ([pr#60356](https://github.com/ceph/ceph/pull/60356), Dnyaneshwari Talwekar)

- Squid: mgr/dashboard: unable to edit pipe config for bucket level policy of bucket ([pr#60293](https://github.com/ceph/ceph/pull/60293), Naman Munet)

- squid: mgr/dashboard: Update nvmeof microcopies ([pr#59718](https://github.com/ceph/ceph/pull/59718), Afreen Misbah)

- squid: mgr/dashboard: update period after migrating to multi-site ([pr#59964](https://github.com/ceph/ceph/pull/59964), Aashish Sharma)

- squid: mgr/dashboard: update translations for squid ([pr#60367](https://github.com/ceph/ceph/pull/60367), Nizamudeen A)

- squid: mgr/dashboard: use grafana server instead of grafana-server in grafana 10<span></span>.4<span></span>.0 ([pr#59722](https://github.com/ceph/ceph/pull/59722), Aashish Sharma)

- Squid: mgr/dashboard: Wrong(half) uid is observed in dashboard when user created via cli contains $ in its name ([pr#59693](https://github.com/ceph/ceph/pull/59693), Dnyaneshwari Talwekar)

- squid: mgr/dashboard: Zone details showing incorrect data for data pool values and compression info for Storage Classes ([pr#59596](https://github.com/ceph/ceph/pull/59596), Aashish Sharma)

- Squid: mgr/dashboard: zonegroup level policy created at master zone did not sync to non-master zone ([pr#59892](https://github.com/ceph/ceph/pull/59892), Naman Munet)

- squid: mgr/nfs: generate user\_id & access\_key for apply\_export(CephFS) ([pr#59896](https://github.com/ceph/ceph/pull/59896), Avan Thakkar, avanthakkar, John Mulligan)

- squid: mgr/orchestrator: fix encrypted flag handling in orch daemon add osd ([pr#59473](https://github.com/ceph/ceph/pull/59473), Yonatan Zaken)

- squid: mgr/rest: Trim  requests array and limit size ([pr#59372](https://github.com/ceph/ceph/pull/59372), Nitzan Mordechai)

- squid: mgr/rgw: Adding a retry config while calling zone\_create() ([pr#59138](https://github.com/ceph/ceph/pull/59138), Kritik Sachdeva)

- squid: mgr/rgwam: use realm/zonegroup/zone method arguments for period update ([pr#59945](https://github.com/ceph/ceph/pull/59945), Aashish Sharma)

- squid: mgr/volumes: add earmarking for subvol ([pr#59894](https://github.com/ceph/ceph/pull/59894), Avan Thakkar)

- squid: Modify container/ software to support release containers and the promotion of prerelease containers ([pr#60962](https://github.com/ceph/ceph/pull/60962), Dan Mick)

- squid: mon/ElectionLogic: tie-breaker mon ignore proposal from marked down mon ([pr#58669](https://github.com/ceph/ceph/pull/58669), Kamoltat)

- squid: mon/MonClient: handle ms\_handle\_fast\_authentication return ([pr#59306](https://github.com/ceph/ceph/pull/59306), Patrick Donnelly)

- squid: mon/OSDMonitor: Add force-remove-snap mon command ([pr#59402](https://github.com/ceph/ceph/pull/59402), Matan Breizman)

- squid: mon/OSDMonitor: fix get\_min\_last\_epoch\_clean() ([pr#55865](https://github.com/ceph/ceph/pull/55865), Matan Breizman)

- squid: mon: Remove any pg\_upmap\_primary mapping during remove a pool ([pr#58914](https://github.com/ceph/ceph/pull/58914), Mohit Agrawal)

- squid: msg: insert PriorityDispatchers in sorted position ([pr#58991](https://github.com/ceph/ceph/pull/58991), Casey Bodley)

- squid: node-proxy: fix a regression when processing the RedFish API ([pr#59997](https://github.com/ceph/ceph/pull/59997), Guillaume Abrioux)

- squid: node-proxy: make the daemon discover endpoints ([pr#58482](https://github.com/ceph/ceph/pull/58482), Guillaume Abrioux)

- squid: objclass: deprecate cls\_cxx\_gather ([pr#57819](https://github.com/ceph/ceph/pull/57819), Nitzan Mordechai)

- squid: orch: disk replacement enhancement ([pr#60486](https://github.com/ceph/ceph/pull/60486), Guillaume Abrioux)

- squid: orch: refactor boolean handling in drive group spec ([pr#59863](https://github.com/ceph/ceph/pull/59863), Guillaume Abrioux)

- squid: os/bluestore: enable async manual compactions ([pr#58740](https://github.com/ceph/ceph/pull/58740), Igor Fedotov)

- squid: os/bluestore: Fix BlueFS allocating bdev label reserved location ([pr#59969](https://github.com/ceph/ceph/pull/59969), Adam Kupczyk)

- squid: os/bluestore: Fix ceph-bluestore-tool allocmap command ([pr#60335](https://github.com/ceph/ceph/pull/60335), Adam Kupczyk)

- squid: os/bluestore: Fix repair of multilabel when collides with BlueFS ([pr#60336](https://github.com/ceph/ceph/pull/60336), Adam Kupczyk)

- squid: os/bluestore: Improve documentation introduced by #57722 ([pr#60893](https://github.com/ceph/ceph/pull/60893), Anthony D'Atri)

- squid: os/bluestore: Multiple bdev labels on main block device ([pr#59106](https://github.com/ceph/ceph/pull/59106), Adam Kupczyk)

- squid: os/bluestore: Mute warnings ([pr#59217](https://github.com/ceph/ceph/pull/59217), Adam Kupczyk)

- squid: os/bluestore: Warning added for slow operations and stalled read ([pr#59464](https://github.com/ceph/ceph/pull/59464), Md Mahamudur Rahaman Sajib)

- squid: osd/scheduler: add mclock queue length perfcounter ([pr#59035](https://github.com/ceph/ceph/pull/59035), zhangjianwei2)

- squid: osd/scrub: decrease default deep scrub chunk size ([pr#59791](https://github.com/ceph/ceph/pull/59791), Ronen Friedman)

- squid: osd/scrub: exempt only operator scrubs from max\_scrubs limit ([pr#59020](https://github.com/ceph/ceph/pull/59020), Ronen Friedman)

- squid: osd/scrub: reduce osd\_requested\_scrub\_priority default value ([pr#59885](https://github.com/ceph/ceph/pull/59885), Ronen Friedman)

- squid: osd: fix require\_min\_compat\_client handling for msr rules ([pr#59492](https://github.com/ceph/ceph/pull/59492), Samuel Just, Radoslaw Zarzynski)

- squid: PeeringState<span></span>.cc: Only populate want\_acting when num\_osds < bucket\_max ([pr#59083](https://github.com/ceph/ceph/pull/59083), Kamoltat)

- squid: qa/cephadm: extend iscsi teuth test ([pr#59934](https://github.com/ceph/ceph/pull/59934), Adam King)

- squid: qa/cephfs: fix TestRenameCommand and unmount the clinet before failin… ([pr#59398](https://github.com/ceph/ceph/pull/59398), Xiubo Li)

- squid: qa/cephfs: ignore variant of MDS\_UP\_LESS\_THAN\_MAX ([pr#58788](https://github.com/ceph/ceph/pull/58788), Patrick Donnelly)

- squid: qa/distros: reinstall nvme-cli on centos 9 nodes ([pr#59471](https://github.com/ceph/ceph/pull/59471), Adam King)

- squid: qa/rgw/multisite: specify realm/zonegroup/zone args for 'account create' ([pr#59603](https://github.com/ceph/ceph/pull/59603), Casey Bodley)

- squid: qa/rgw: bump keystone/barbican from 2023<span></span>.1 to 2024<span></span>.1 ([pr#61023](https://github.com/ceph/ceph/pull/61023), Casey Bodley)

- squid: qa/rgw: fix s3 java tests by forcing gradle to run on Java 8 ([pr#61053](https://github.com/ceph/ceph/pull/61053), J. Eric Ivancich)

- squid: qa/rgw: force Hadoop to run under Java 1<span></span>.8 ([pr#61120](https://github.com/ceph/ceph/pull/61120), J. Eric Ivancich)

- squid: qa/rgw: pull Apache artifacts from mirror instead of archive<span></span>.apache<span></span>.org ([pr#61101](https://github.com/ceph/ceph/pull/61101), J. Eric Ivancich)

- squid: qa/standalone/scrub: fix the searched-for text for snaps decode errors ([pr#58967](https://github.com/ceph/ceph/pull/58967), Ronen Friedman)

- squid: qa/standalone/scrub: increase status updates frequency ([pr#59974](https://github.com/ceph/ceph/pull/59974), Ronen Friedman)

- squid: qa/standalone/scrub: remove TEST\_recovery\_scrub\_2 ([pr#60287](https://github.com/ceph/ceph/pull/60287), Ronen Friedman)

- squid: qa/suites/crimson-rados/perf: add ssh keys ([pr#61109](https://github.com/ceph/ceph/pull/61109), Nitzan Mordechai)

- squid: qa/suites/rados/thrash-old-clients: Add noscrub, nodeep-scrub to ignorelist ([pr#58629](https://github.com/ceph/ceph/pull/58629), Kamoltat)

- squid: qa/suites/rados/thrash-old-clients: test with N-2 releases on centos 9 ([pr#58607](https://github.com/ceph/ceph/pull/58607), Laura Flores)

- squid: qa/suites/rados/verify/validater: increase heartbeat grace timeout ([pr#58785](https://github.com/ceph/ceph/pull/58785), Sridhar Seshasayee)

- squid: qa/suites/rados: Cancel injectfull to allow cleanup ([pr#59156](https://github.com/ceph/ceph/pull/59156), Brad Hubbard)

- squid: qa/suites/rbd/iscsi: enable all supported container hosts ([pr#60089](https://github.com/ceph/ceph/pull/60089), Ilya Dryomov)

- squid: qa/suites: drop --show-reachable=yes from fs:valgrind tests ([pr#59068](https://github.com/ceph/ceph/pull/59068), Jos Collin)

- squid: qa/task: update alertmanager endpoints version ([pr#59930](https://github.com/ceph/ceph/pull/59930), Nizamudeen A)

- squid: qa/tasks/mgr/test\_progress<span></span>.py: deal with pre-exisiting pool ([pr#58263](https://github.com/ceph/ceph/pull/58263), Kamoltat)

- squid: qa/tasks/nvme\_loop: update task to work with new nvme list format ([pr#61026](https://github.com/ceph/ceph/pull/61026), Adam King)

- squid: qa/upgrade: fix checks to make sure upgrade is still in progress ([pr#59472](https://github.com/ceph/ceph/pull/59472), Adam King)

- squid: qa: adjust expected io\_opt in krbd\_discard\_granularity<span></span>.t ([pr#59232](https://github.com/ceph/ceph/pull/59232), Ilya Dryomov)

- squid: qa: ignore container checkpoint/restore related selinux denials for c… ([issue#67117](http://tracker.ceph.com/issues/67117), [issue#66640](http://tracker.ceph.com/issues/66640), [pr#58808](https://github.com/ceph/ceph/pull/58808), Venky Shankar)

- squid: qa: load all dirfrags before testing altname recovery ([pr#59521](https://github.com/ceph/ceph/pull/59521), Patrick Donnelly)

- squid: qa: remove all bluestore signatures on devices ([pr#60021](https://github.com/ceph/ceph/pull/60021), Guillaume Abrioux)

- squid: qa: suppress \_\_trans\_list\_add valgrind warning ([pr#58790](https://github.com/ceph/ceph/pull/58790), Patrick Donnelly)

- squid: RADOS: Generalize stretch mode pg temp handling to be usable without stretch mode ([pr#59084](https://github.com/ceph/ceph/pull/59084), Kamoltat)

- squid: rbd-mirror: use correct ioctx for namespace ([pr#59771](https://github.com/ceph/ceph/pull/59771), N Balachandran)

- squid: rbd: "rbd bench" always writes the same byte ([pr#59502](https://github.com/ceph/ceph/pull/59502), Ilya Dryomov)

- squid: rbd: amend "rbd {group,} rename" and "rbd mirror pool" command descriptions ([pr#59602](https://github.com/ceph/ceph/pull/59602), Ilya Dryomov)

- squid: rbd: handle --{group,image}-namespace in "rbd group image {add,rm}" ([pr#61172](https://github.com/ceph/ceph/pull/61172), Ilya Dryomov)

- squid: rgw/beast: optimize for accept when meeting error in listenning ([pr#60244](https://github.com/ceph/ceph/pull/60244), Mingyuan Liang, Casey Bodley)

- squid: rgw/http: finish\_request() after logging errors ([pr#59439](https://github.com/ceph/ceph/pull/59439), Casey Bodley)

- squid: rgw/kafka: refactor topic creation to avoid rd\_kafka\_topic\_name() ([pr#59754](https://github.com/ceph/ceph/pull/59754), Yuval Lifshitz)

- squid: rgw/lc: Fix lifecycle not working while bucket versioning is suspended ([pr#61138](https://github.com/ceph/ceph/pull/61138), Trang Tran)

- squid: rgw/multipart: use cls\_version to avoid racing between part upload and multipart complete ([pr#59678](https://github.com/ceph/ceph/pull/59678), Jane Zhu)

- squid: rgw/multisite: metadata polling event based on unmodified mdlog\_marker ([pr#60792](https://github.com/ceph/ceph/pull/60792), Shilpa Jagannath)

- squid: rgw/notifications: fixing radosgw-admin notification json ([pr#59302](https://github.com/ceph/ceph/pull/59302), Yuval Lifshitz)

- squid: rgw/notifications: free completion pointer using unique\_ptr ([pr#59671](https://github.com/ceph/ceph/pull/59671), Yuval Lifshitz)

- squid: rgw/notify: visit() returns copy of owner string ([pr#59226](https://github.com/ceph/ceph/pull/59226), Casey Bodley)

- squid: rgw/rados: don't rely on IoCtx::get\_last\_version() for async ops ([pr#60065](https://github.com/ceph/ceph/pull/60065), Casey Bodley)

- squid: rgw: add s3select usage to log usage ([pr#59120](https://github.com/ceph/ceph/pull/59120), Seena Fallah)

- squid: rgw: decrement qlen/qactive perf counters on error ([pr#59670](https://github.com/ceph/ceph/pull/59670), Mark Kogan)

- squid: rgw: decrypt multipart get part when encrypted ([pr#60130](https://github.com/ceph/ceph/pull/60130), sungjoon-koh)

- squid: rgw: ignore zoneless default realm when not configured ([pr#59445](https://github.com/ceph/ceph/pull/59445), Casey Bodley)

- squid: rgw: load copy source bucket attrs in putobj ([pr#59413](https://github.com/ceph/ceph/pull/59413), Seena Fallah)

- squid: rgw: optimize bucket listing to skip past regions of namespaced entries ([pr#61070](https://github.com/ceph/ceph/pull/61070), J. Eric Ivancich)

- squid: rgw: revert account-related changes to get\_iam\_policy\_from\_attr() ([pr#59221](https://github.com/ceph/ceph/pull/59221), Casey Bodley)

- squid: rgw: RGWAccessKey::decode\_json() preserves default value of 'active' ([pr#60823](https://github.com/ceph/ceph/pull/60823), Casey Bodley)

- squid: rgw: switch back to boost::asio for spawn() and yield\_context ([pr#60133](https://github.com/ceph/ceph/pull/60133), Casey Bodley)

- squid: rgwlc: fix typo in getlc (ObjectSizeGreaterThan) ([pr#59223](https://github.com/ceph/ceph/pull/59223), Matt Benjamin)

- squid: RGW|BN: fix lifecycle test issue ([pr#59010](https://github.com/ceph/ceph/pull/59010), Ali Masarwa)

- squid: RGW|Bucket notification: fix for v2 topics rgw-admin list operation ([pr#60774](https://github.com/ceph/ceph/pull/60774), Oshrey Avraham, Ali Masarwa)

- squid: seastar: update submodule ([pr#58955](https://github.com/ceph/ceph/pull/58955), Matan Breizman)

- squid: src/ceph\_release, doc: mark squid stable ([pr#59537](https://github.com/ceph/ceph/pull/59537), Neha Ojha)

- squid: src/crimson/osd/scrub: fix the null pointer error ([pr#58885](https://github.com/ceph/ceph/pull/58885), junxiang Mu)

- squid: src/mon/ConnectionTracker<span></span>.cc: Fix dump function ([pr#60003](https://github.com/ceph/ceph/pull/60003), Kamoltat)

- squid: suites/upgrade/quincy-x: update the ignore list ([pr#59624](https://github.com/ceph/ceph/pull/59624), Nitzan Mordechai)

- squid: suites: adding ignore list for stray daemon ([pr#58267](https://github.com/ceph/ceph/pull/58267), Nitzan Mordechai)

- squid: suites: test should ignore osd\_down warnings ([pr#59147](https://github.com/ceph/ceph/pull/59147), Nitzan Mordechai)

- squid: test/neorados: remove depreciated RemoteReads cls test ([pr#58144](https://github.com/ceph/ceph/pull/58144), Laura Flores)

- squid: test/rgw/notification: fixing backport issues in the tests ([pr#60545](https://github.com/ceph/ceph/pull/60545), Yuval Lifshitz)

- squid: test/rgw/notification: use real ip address instead of localhost ([pr#59303](https://github.com/ceph/ceph/pull/59303), Yuval Lifshitz)

- squid: test/rgw/notifications: don't check for full queue if topics expired ([pr#59917](https://github.com/ceph/ceph/pull/59917), Yuval Lifshitz)

- squid: test/rgw/notifications: fix test regression ([pr#61119](https://github.com/ceph/ceph/pull/61119), Yuval Lifshitz)

- squid: Test: osd-recovery-space<span></span>.sh extends the wait time for "recovery toofull" ([pr#59041](https://github.com/ceph/ceph/pull/59041), Nitzan Mordechai)

- upgrade/cephfs/mds\_upgrade\_sequence: ignore osds down ([pr#59865](https://github.com/ceph/ceph/pull/59865), Kamoltat Sirivadhna)

- squid: rgw: Don't crash on exceptions from pool listing ([pr#61306](https://github.com/ceph/ceph/pull/61306), Adam Emerson)

- squid: container/Containerfile: replace CEPH\_VERSION label for backward compact ([pr#61583](https://github.com/ceph/ceph/pull/61583), Dan Mick)

- squid: container/build<span></span>.sh: fix up org vs<span></span>. repo naming ([pr#61584](https://github.com/ceph/ceph/pull/61584), Dan Mick)

- squid: container/build<span></span>.sh: don't require repo creds on NO\_PUSH ([pr#61585](https://github.com/ceph/ceph/pull/61585), Dan Mick)





