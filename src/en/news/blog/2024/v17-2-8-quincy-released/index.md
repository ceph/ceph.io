---
title: "v17.2.8 Quincy released"
date: "2024-11-25"
author: "Yuri Weinstein"
tags:
  - "release"
  - "quincy"
---

This is the eighth, and expected to be last, backport release in the Quincy series.
We recommend all users update to this release.

v17.2.8 will have RPM/centos 9 packages instead of  RPM/centos 8 built.

v17.2.8 container images, now based on CentOS 9, may be incompatible on older kernels (e.g., Ubuntu 18.04) 
due to differences in thread creation methods. 
Users upgrading to v17.2.8 container images with older OS versions may encounter crashes during             `pthread_create`. 
However, we recommend upgrading your OS to avoid this unsupported combination.

Users should expect to see the el8 rpm subdirectory empty and the "dnf" commands are expected
to fail with 17.2.8.
They can choose to use 17.2.8 RPM packages for centos 8/el8 provided by CERN as a community
member or continue to stay at 17.2.7 following instructions
from https://docs.ceph.com/en/latest/install/get-packages/#rhel, the ceph.repo file should
point to https://download.ceph.com/rpm-17.2.7/el8 instead of https://download.ceph.com/rpm-quincy/el8

These CERN packages come with no warranty and have not been tested. The software in them has been
tested by Ceph according to [platforms](https://docs.ceph.com/en/latest/start/os-recommendations/           #platforms).
The repository for el8 builds is hosted by CERN on [Linux @ CERN](https://linuxsoft.cern.ch/repos/ceph-ext- quincy8el-stable/).
The public part of the GPG key used to sign the packages is available at
[RPM-GPG-KEY-Ceph-Community](https://linuxsoft.cern.ch/repos/RPM-GPG-KEY-Ceph-Community).

## Notable Changes

- RADOS: The `get_pool_is_selfmanaged_snaps_mode` C++ API has been deprecated
  due to being prone to false negative results. Its safer replacement is
  `pool_is_in_selfmanaged_snaps_mode`.
- RBD: When diffing against the beginning of time (`fromsnapname == NULL`) in
  fast-diff mode (`whole_object == true` with the `fast-diff` image feature
  enabled and valid), diff-iterate is now guaranteed to execute locally if
  an exclusive lock is available. This brings a dramatic performance
  improvement for QEMU live disk synchronization and backup use cases.
- RBD: The option `--image-id` has been added to the `rbd children` CLI
  command, so it can be run for images in the trash.
- RBD: The `RBD_IMAGE_OPTION_CLONE_FORMAT` option has been exposed in Python
  bindings via the `clone_format` optional parameter to the `clone`,
  `deep_copy` and `migration_prepare` methods.
- RBD: The `RBD_IMAGE_OPTION_FLATTEN` option has been exposed in Python bindings
  via the `flatten` optional parameter to the `deep_copy` and `migration_prepare`
  methods.

## Changelog

- <span></span>.github: sync the list of paths for rbd label, expand tests label to qa/\* ([pr#57726](https://github.com/ceph/ceph/pull/57726), Ilya Dryomov)

- [quincy] qa/multisite: stabilize multisite testing ([pr#60479](https://github.com/ceph/ceph/pull/60479), Shilpa Jagannath, Casey Bodley)

- [quincy] RGW backports ([pr#51806](https://github.com/ceph/ceph/pull/51806), Soumya Koduri, Casey Bodley)

- [rgw][lc][rgw\_lifecycle\_work\_time] adjust timing if the configured end time is less than the start time ([pr#54874](https://github.com/ceph/ceph/pull/54874), Oguzhan Ozmen)

- Add Containerfile and build<span></span>.sh to build it ([pr#60230](https://github.com/ceph/ceph/pull/60230), Dan Mick)

- admin/doc-requirements: bump Sphinx to 5<span></span>.0<span></span>.2 ([pr#55204](https://github.com/ceph/ceph/pull/55204), Nizamudeen A)

- batch backport of #50743, #55342, #48557 ([pr#55593](https://github.com/ceph/ceph/pull/55593), John Mulligan, Afreen, Laura Flores)

- blk/aio: fix long batch (64+K entries) submission ([pr#58674](https://github.com/ceph/ceph/pull/58674), Igor Fedotov, Adam Kupczyk, Robin Geuze)

- bluestore/bluestore_types: avoid heap-buffer-overflow in another way to keep code uniformity ([pr#58818](https://github.com/ceph/ceph/pull/58818), Rongqi Sun)

- bluestore/bluestore_types: check 'it' valid before using ([pr#56889](https://github.com/ceph/ceph/pull/56889), Rongqi Sun)

- build: Make boost_url a list ([pr#58316](https://github.com/ceph/ceph/pull/58316), Adam Emerson, Kefu Chai)

- centos 9 related backports for RBD ([pr#58565](https://github.com/ceph/ceph/pull/58565), Casey Bodley, Ilya Dryomov)

- ceph-menv:fix typo in README ([pr#55164](https://github.com/ceph/ceph/pull/55164), yu.wang)

- ceph-node-proxy not present, not part of container ([pr#60337](https://github.com/ceph/ceph/pull/60337), Dan Mick)

- ceph-volume: add missing import ([pr#56260](https://github.com/ceph/ceph/pull/56260), Guillaume Abrioux)

- ceph-volume: create LVs when using partitions ([pr#58221](https://github.com/ceph/ceph/pull/58221), Guillaume Abrioux)

- ceph-volume: fix a bug in \_check_generic_reject_reasons ([pr#54706](https://github.com/ceph/ceph/pull/54706), Kim Minjong)

- ceph-volume: fix a regression in `raw list` ([pr#54522](https://github.com/ceph/ceph/pull/54522), Guillaume Abrioux)

- ceph-volume: Fix migration from WAL to data with no DB ([pr#55496](https://github.com/ceph/ceph/pull/55496), Igor Fedotov)

- ceph-volume: Fix unbound var in disk<span></span>.get_devices() ([pr#59651](https://github.com/ceph/ceph/pull/59651), Zack Cerza)

- ceph-volume: fix zap_partitions() in devices<span></span>.lvm<span></span>.zap ([pr#55480](https://github.com/ceph/ceph/pull/55480), Guillaume Abrioux)

- ceph-volume: fixes fallback to stat in is_device and is_partition ([pr#54630](https://github.com/ceph/ceph/pull/54630), Teoman ONAY)

- ceph-volume: Revert "ceph-volume: fix raw list for lvm devices" ([pr#54430](https://github.com/ceph/ceph/pull/54430), Matthew Booth, Guillaume Abrioux)

- ceph-volume: use 'no workqueue' options with dmcrypt ([pr#55336](https://github.com/ceph/ceph/pull/55336), Guillaume Abrioux)

- ceph-volume: use importlib from stdlib on Python 3<span></span>.8 and up ([pr#58006](https://github.com/ceph/ceph/pull/58006), Guillaume Abrioux, Kefu Chai)

- ceph-volume: Use safe accessor to get TYPE info ([pr#56322](https://github.com/ceph/ceph/pull/56322), Dillon Amburgey)

- ceph<span></span>.spec<span></span>.in: add support for openEuler OS ([pr#56366](https://github.com/ceph/ceph/pull/56366), liuqinfei)

- ceph<span></span>.spec<span></span>.in: we need jsonnet for all distroes for make check ([pr#60074](https://github.com/ceph/ceph/pull/60074), Kyr Shatskyy)

- ceph_test_rados_api_misc: adjust LibRadosMiscConnectFailure<span></span>.ConnectTimeout timeout ([pr#58128](https://github.com/ceph/ceph/pull/58128), Lucian Petrut)

- cephadm: add a --dry-run option to cephadm shell ([pr#54221](https://github.com/ceph/ceph/pull/54221), John Mulligan)

- cephadm: add tcmu-runner to logrotate config ([pr#55966](https://github.com/ceph/ceph/pull/55966), Adam King)

- cephadm: add timemaster to timesync services list ([pr#56308](https://github.com/ceph/ceph/pull/56308), Florent Carli)

- cephadm: Adding support to configure public_network cfg section ([pr#55959](https://github.com/ceph/ceph/pull/55959), Redouane Kachach)

- cephadm: allow ports to be opened in firewall during adoption, reconfig, redeploy ([pr#55960](https://github.com/ceph/ceph/pull/55960), Adam King)

- cephadm: disable ms_bind_ipv4 if we will enable ms_bind_ipv6 ([pr#58760](https://github.com/ceph/ceph/pull/58760), Dan van der Ster, Joshua Blanch)

- cephadm: fix host-maintenance command always exiting with a failure ([pr#58755](https://github.com/ceph/ceph/pull/58755), John Mulligan)

- cephadm: make custom_configs work for tcmu-runner container ([pr#53425](https://github.com/ceph/ceph/pull/53425), Adam King)

- cephadm: pin pyfakefs version for tox tests ([pr#56763](https://github.com/ceph/ceph/pull/56763), Adam King)

- cephadm: remove restriction for crush device classes ([pr#56087](https://github.com/ceph/ceph/pull/56087), Seena Fallah)

- cephadm: run tcmu-runner through script to do restart on failure ([pr#55975](https://github.com/ceph/ceph/pull/55975), Adam King, Raimund Sacherer, Teoman ONAY, Ilya Dryomov)

- cephadm: support for CA signed keys ([pr#55965](https://github.com/ceph/ceph/pull/55965), Adam King)

- cephadm: turn off cgroups_split setting when bootstrapping with --no-cgroups-split ([pr#58761](https://github.com/ceph/ceph/pull/58761), Adam King)

- cephadm: use importlib<span></span>.metadata for querying ceph_iscsi's version ([pr#58637](https://github.com/ceph/ceph/pull/58637), Kefu Chai)

- cephfs-mirror: various fixes ([pr#56702](https://github.com/ceph/ceph/pull/56702), Jos Collin)

- cephfs: Fixed a bug in the readdir_cache_cb function that may have us… ([pr#58806](https://github.com/ceph/ceph/pull/58806), Tod Chen)

- cephfs: upgrade cephfs-shell's path wherever necessary ([pr#54186](https://github.com/ceph/ceph/pull/54186), Rishabh Dave)

- client, mds: update mtime and change attr for snapdir when snaps are created, deleted and renamed ([issue#54501](http://tracker.ceph.com/issues/54501), [pr#50730](https://github.com/ceph/ceph/pull/50730), Venky Shankar)

- client/fuse: handle case of renameat2 with non-zero flags ([pr#55010](https://github.com/ceph/ceph/pull/55010), Leonid Usov, Shachar Sharon)

- client: always refresh mds feature bits on session open ([issue#63188](http://tracker.ceph.com/issues/63188), [pr#54244](https://github.com/ceph/ceph/pull/54244), Venky Shankar)

- client: call \_getattr() for -ENODATA returned \_getvxattr() calls ([pr#54405](https://github.com/ceph/ceph/pull/54405), Jos Collin)

- client: disallow unprivileged users to escalate root privileges ([pr#60314](https://github.com/ceph/ceph/pull/60314), Xiubo Li, Venky Shankar)

- client: fix leak of file handles ([pr#56121](https://github.com/ceph/ceph/pull/56121), Xavi Hernandez)

- client: queue a delay cap flushing if there are ditry caps/snapcaps ([pr#54465](https://github.com/ceph/ceph/pull/54465), Xiubo Li)

- cloud sync: fix crash due to objs on cr stack ([pr#51136](https://github.com/ceph/ceph/pull/51136), Yehuda Sadeh)

- cls/cas/cls_cas_internal: Initialize 'hash' value before decoding ([pr#59236](https://github.com/ceph/ceph/pull/59236), Nitzan Mordechai)

- cmake/modules/BuildRocksDB<span></span>.cmake: inherit parent's CMAKE_CXX_FLAGS ([pr#55501](https://github.com/ceph/ceph/pull/55501), Kefu Chai)

- cmake/rgw: librgw tests depend on ALLOC_LIBS ([pr#54796](https://github.com/ceph/ceph/pull/54796), Casey Bodley)

- cmake: use or turn off liburing for rocksdb ([pr#54123](https://github.com/ceph/ceph/pull/54123), Casey Bodley, Patrick Donnelly)

- common/admin_socket: add a command to raise a signal ([pr#54356](https://github.com/ceph/ceph/pull/54356), Leonid Usov)

- common/dout: fix FTBFS on GCC 14 ([pr#59057](https://github.com/ceph/ceph/pull/59057), Radoslaw Zarzynski)

- common/Formatter: dump inf/nan as null ([pr#60064](https://github.com/ceph/ceph/pull/60064), Md Mahamudur Rahaman Sajib)

- common/StackStringStream: update pointer to newly allocated memory in overflow() ([pr#57363](https://github.com/ceph/ceph/pull/57363), Rongqi Sun)

- common/weighted_shuffle: don't feed std::discrete_distribution with all-zero weights ([pr#55154](https://github.com/ceph/ceph/pull/55154), Radosław Zarzyński)

- common: intrusive_lru destructor add ([pr#54557](https://github.com/ceph/ceph/pull/54557), Ali Maredia)

- common: fix compilation warnings in numa<span></span>.cc ([pr#58704](https://github.com/ceph/ceph/pull/58704), Radoslaw Zarzynski)

- common: resolve config proxy deadlock using refcounted pointers ([pr#54374](https://github.com/ceph/ceph/pull/54374), Patrick Donnelly)

- Do not duplicate query-string in ops-log ([pr#57132](https://github.com/ceph/ceph/pull/57132), Matt Benjamin)

- do not evict clients if OSDs are laggy ([pr#52271](https://github.com/ceph/ceph/pull/52271), Dhairya Parmar, Laura Flores)

- doc/architecture<span></span>.rst - fix typo ([pr#55385](https://github.com/ceph/ceph/pull/55385), Zac Dover)

- doc/architecture<span></span>.rst: improve rados definition ([pr#55344](https://github.com/ceph/ceph/pull/55344), Zac Dover)

- doc/architecture: correct typo ([pr#56013](https://github.com/ceph/ceph/pull/56013), Zac Dover)

- doc/architecture: improve some paragraphs ([pr#55400](https://github.com/ceph/ceph/pull/55400), Zac Dover)

- doc/architecture: remove pleonasm ([pr#55934](https://github.com/ceph/ceph/pull/55934), Zac Dover)

- doc/ceph-volume: add spillover fix procedure ([pr#59542](https://github.com/ceph/ceph/pull/59542), Zac Dover)

- doc/ceph-volume: explain idempotence ([pr#54234](https://github.com/ceph/ceph/pull/54234), Zac Dover)

- doc/ceph-volume: improve front matter ([pr#54236](https://github.com/ceph/ceph/pull/54236), Zac Dover)

- doc/cephadm - edit t11ing ([pr#55483](https://github.com/ceph/ceph/pull/55483), Zac Dover)

- doc/cephadm/services: remove excess rendered indentation in osd<span></span>.rst ([pr#54324](https://github.com/ceph/ceph/pull/54324), Ville Ojamo)

- doc/cephadm/upgrade: ceph-ci containers are hosted by quay<span></span>.ceph<span></span>.io ([pr#58682](https://github.com/ceph/ceph/pull/58682), Casey Bodley)

- doc/cephadm: add default monitor images ([pr#57210](https://github.com/ceph/ceph/pull/57210), Zac Dover)

- doc/cephadm: add malformed-JSON removal instructions ([pr#59665](https://github.com/ceph/ceph/pull/59665), Zac Dover)

- doc/cephadm: add note about ceph-exporter (Quincy) ([pr#55520](https://github.com/ceph/ceph/pull/55520), Zac Dover)

- doc/cephadm: correct nfs config pool name ([pr#55604](https://github.com/ceph/ceph/pull/55604), Zac Dover)

- doc/cephadm: edit "Using Custom Images" ([pr#58942](https://github.com/ceph/ceph/pull/58942), Zac Dover)

- doc/cephadm: edit troubleshooting<span></span>.rst (1 of x) ([pr#54284](https://github.com/ceph/ceph/pull/54284), Zac Dover)

- doc/cephadm: edit troubleshooting<span></span>.rst (2 of x) ([pr#54321](https://github.com/ceph/ceph/pull/54321), Zac Dover)

- doc/cephadm: explain different methods of cephadm delivery ([pr#56176](https://github.com/ceph/ceph/pull/56176), Zac Dover)

- doc/cephadm: fix typo in set ssh key command ([pr#54389](https://github.com/ceph/ceph/pull/54389), Piotr Parczewski)

- doc/cephadm: how to get exact size_spec from device ([pr#59432](https://github.com/ceph/ceph/pull/59432), Zac Dover)

- doc/cephadm: improve host-management<span></span>.rst ([pr#56112](https://github.com/ceph/ceph/pull/56112), Anthony D'Atri)

- doc/cephadm: Improve multiple files ([pr#56134](https://github.com/ceph/ceph/pull/56134), Anthony D'Atri)

- doc/cephadm: Quincy default images procedure ([pr#57239](https://github.com/ceph/ceph/pull/57239), Zac Dover)

- doc/cephadm: remove downgrade reference from upgrade docs ([pr#57087](https://github.com/ceph/ceph/pull/57087), Adam King)

- doc/cephfs/client-auth<span></span>.rst: correct ``fs authorize cephfs1 /dir1 clie… ([pr#55247](https://github.com/ceph/ceph/pull/55247), 叶海丰)

- doc/cephfs: add cache pressure information ([pr#59150](https://github.com/ceph/ceph/pull/59150), Zac Dover)

- doc/cephfs: add doc for disabling mgr/volumes plugin ([pr#60498](https://github.com/ceph/ceph/pull/60498), Rishabh Dave)

- doc/cephfs: disambiguate "Reporting Free Space" ([pr#56873](https://github.com/ceph/ceph/pull/56873), Zac Dover)

- doc/cephfs: disambiguate two sentences ([pr#57705](https://github.com/ceph/ceph/pull/57705), Zac Dover)

- doc/cephfs: edit "Cloning Snapshots" in fs-volumes<span></span>.rst ([pr#57667](https://github.com/ceph/ceph/pull/57667), Zac Dover)

- doc/cephfs: edit "is mount helper present" ([pr#58580](https://github.com/ceph/ceph/pull/58580), Zac Dover)

- doc/cephfs: edit "Layout Fields" text ([pr#59023](https://github.com/ceph/ceph/pull/59023), Zac Dover)

- doc/cephfs: edit "Pinning Subvolumes<span></span>.<span></span>.<span></span>." ([pr#57664](https://github.com/ceph/ceph/pull/57664), Zac Dover)

- doc/cephfs: edit add-remove-mds ([pr#55649](https://github.com/ceph/ceph/pull/55649), Zac Dover)

- doc/cephfs: edit front matter in client-auth<span></span>.rst ([pr#57123](https://github.com/ceph/ceph/pull/57123), Zac Dover)

- doc/cephfs: edit front matter in mantle<span></span>.rst ([pr#57793](https://github.com/ceph/ceph/pull/57793), Zac Dover)

- doc/cephfs: edit fs-volumes<span></span>.rst (1 of x) ([pr#57419](https://github.com/ceph/ceph/pull/57419), Zac Dover)

- doc/cephfs: edit fs-volumes<span></span>.rst (1 of x) followup ([pr#57428](https://github.com/ceph/ceph/pull/57428), Zac Dover)

- doc/cephfs: edit fs-volumes<span></span>.rst (2 of x) ([pr#57544](https://github.com/ceph/ceph/pull/57544), Zac Dover)

- doc/cephfs: edit mount-using-fuse<span></span>.rst ([pr#54354](https://github.com/ceph/ceph/pull/54354), Jaanus Torp)

- doc/cephfs: edit vstart warning text ([pr#57816](https://github.com/ceph/ceph/pull/57816), Zac Dover)

- doc/cephfs: fix "file layouts" link ([pr#58877](https://github.com/ceph/ceph/pull/58877), Zac Dover)

- doc/cephfs: fix "OSD capabilities" link ([pr#58894](https://github.com/ceph/ceph/pull/58894), Zac Dover)

- doc/cephfs: fix architecture link to correct relative path ([pr#56341](https://github.com/ceph/ceph/pull/56341), molpako)

- doc/cephfs: improve "layout fields" text ([pr#59252](https://github.com/ceph/ceph/pull/59252), Zac Dover)

- doc/cephfs: improve cache-configuration<span></span>.rst ([pr#59216](https://github.com/ceph/ceph/pull/59216), Zac Dover)

- doc/cephfs: improve ceph-fuse command ([pr#56969](https://github.com/ceph/ceph/pull/56969), Zac Dover)

- doc/cephfs: note regarding start time time zone ([pr#53577](https://github.com/ceph/ceph/pull/53577), Milind Changire)

- doc/cephfs: rearrange subvolume group information ([pr#60437](https://github.com/ceph/ceph/pull/60437), Indira Sawant)

- doc/cephfs: refine client-auth (1 of 3) ([pr#56781](https://github.com/ceph/ceph/pull/56781), Zac Dover)

- doc/cephfs: refine client-auth (2 of 3) ([pr#56843](https://github.com/ceph/ceph/pull/56843), Zac Dover)

- doc/cephfs: refine client-auth (3 of 3) ([pr#56852](https://github.com/ceph/ceph/pull/56852), Zac Dover)

- doc/cephfs: s/mountpoint/mount point/ ([pr#59296](https://github.com/ceph/ceph/pull/59296), Zac Dover)

- doc/cephfs: s/mountpoint/mount point/ ([pr#59288](https://github.com/ceph/ceph/pull/59288), Zac Dover)

- doc/cephfs: s/subvolumegroups/subvolume groups ([pr#57744](https://github.com/ceph/ceph/pull/57744), Zac Dover)

- doc/cephfs: separate commands into sections ([pr#57670](https://github.com/ceph/ceph/pull/57670), Zac Dover)

- doc/cephfs: streamline a paragraph ([pr#58776](https://github.com/ceph/ceph/pull/58776), Zac Dover)

- doc/cephfs: take Anthony's suggestion ([pr#58361](https://github.com/ceph/ceph/pull/58361), Zac Dover)

- doc/cephfs: update cephfs-shell link ([pr#58372](https://github.com/ceph/ceph/pull/58372), Zac Dover)

- doc/cephfs: Update disaster-recovery-experts<span></span>.rst to mention Slack ([pr#55045](https://github.com/ceph/ceph/pull/55045), Dhairya Parmar)

- doc/cephfs: use 'p' flag to set layouts or quotas ([pr#60484](https://github.com/ceph/ceph/pull/60484), TruongSinh Tran-Nguyen)

- doc/config: edit "ceph-conf<span></span>.rst" ([pr#54464](https://github.com/ceph/ceph/pull/54464), Zac Dover)

- doc/dev/peering: Change acting set num ([pr#59064](https://github.com/ceph/ceph/pull/59064), qn2060)

- doc/dev/release-process<span></span>.rst: note new 'project' arguments ([pr#57645](https://github.com/ceph/ceph/pull/57645), Dan Mick)

- doc/dev: add "activate latest release" RTD step ([pr#59656](https://github.com/ceph/ceph/pull/59656), Zac Dover)

- doc/dev: add formatting to basic workflow ([pr#58739](https://github.com/ceph/ceph/pull/58739), Zac Dover)

- doc/dev: edit "Principles for format change" ([pr#58577](https://github.com/ceph/ceph/pull/58577), Zac Dover)

- doc/dev: edit internals<span></span>.rst ([pr#55853](https://github.com/ceph/ceph/pull/55853), Zac Dover)

- doc/dev: fix spelling in crimson<span></span>.rst ([pr#55738](https://github.com/ceph/ceph/pull/55738), Zac Dover)

- doc/dev: Fix typos in encoding<span></span>.rst ([pr#58306](https://github.com/ceph/ceph/pull/58306), N Balachandran)

- doc/dev: improve basic-workflow<span></span>.rst ([pr#58939](https://github.com/ceph/ceph/pull/58939), Zac Dover)

- doc/dev: link to ceph<span></span>.io leads list ([pr#58107](https://github.com/ceph/ceph/pull/58107), Zac Dover)

- doc/dev: osd_internals/snaps<span></span>.rst: add clone_overlap doc ([pr#56524](https://github.com/ceph/ceph/pull/56524), Matan Breizman)

- doc/dev: refine "Concepts" ([pr#56661](https://github.com/ceph/ceph/pull/56661), Zac Dover)

- doc/dev: refine "Concepts" 2 of 3 ([pr#56726](https://github.com/ceph/ceph/pull/56726), Zac Dover)

- doc/dev: refine "Concepts" 3 of 3 ([pr#56730](https://github.com/ceph/ceph/pull/56730), Zac Dover)

- doc/dev: refine "Concepts" 4 of 3 ([pr#56741](https://github.com/ceph/ceph/pull/56741), Zac Dover)

- doc/dev: remove "Stable Releases and Backports" ([pr#60274](https://github.com/ceph/ceph/pull/60274), Zac Dover)

- doc/dev: repair broken image ([pr#57009](https://github.com/ceph/ceph/pull/57009), Zac Dover)

- doc/dev: s/to asses/to assess/ ([pr#57424](https://github.com/ceph/ceph/pull/57424), Zac Dover)

- doc/dev: update leads list ([pr#56604](https://github.com/ceph/ceph/pull/56604), Zac Dover)

- doc/dev: update leads list ([pr#56590](https://github.com/ceph/ceph/pull/56590), Zac Dover)

- doc/dev_guide: add needs-upgrade-testing label info ([pr#58731](https://github.com/ceph/ceph/pull/58731), Zac Dover)

- doc/developer_guide: update doc about installing teuthology ([pr#57751](https://github.com/ceph/ceph/pull/57751), Rishabh Dave)

- doc/glossary<span></span>.rst: add "Monitor Store" ([pr#54744](https://github.com/ceph/ceph/pull/54744), Zac Dover)

- doc/glossary<span></span>.rst: add "OpenStack Swift" and "Swift" ([pr#57943](https://github.com/ceph/ceph/pull/57943), Zac Dover)

- doc/glossary: add "ceph-ansible" ([pr#59009](https://github.com/ceph/ceph/pull/59009), Zac Dover)

- doc/glossary: add "ceph-fuse" entry ([pr#58945](https://github.com/ceph/ceph/pull/58945), Zac Dover)

- doc/glossary: add "Crimson" entry ([pr#56074](https://github.com/ceph/ceph/pull/56074), Zac Dover)

- doc/glossary: add "librados" entry ([pr#56236](https://github.com/ceph/ceph/pull/56236), Zac Dover)

- doc/glossary: add "object storage" ([pr#59426](https://github.com/ceph/ceph/pull/59426), Zac Dover)

- doc/glossary: Add "OMAP" to glossary ([pr#55750](https://github.com/ceph/ceph/pull/55750), Zac Dover)

- doc/glossary: add "PLP" to glossary ([pr#60505](https://github.com/ceph/ceph/pull/60505), Zac Dover)

- doc/glossary: add "Prometheus" ([pr#58979](https://github.com/ceph/ceph/pull/58979), Zac Dover)

- doc/glossary: add "Quorum" to glossary ([pr#54510](https://github.com/ceph/ceph/pull/54510), Zac Dover)

- doc/glossary: Add "S3" ([pr#57984](https://github.com/ceph/ceph/pull/57984), Zac Dover)

- doc/glossary: Add link to CRUSH paper ([pr#55558](https://github.com/ceph/ceph/pull/55558), Zac Dover)

- doc/glossary: improve "BlueStore" entry ([pr#54266](https://github.com/ceph/ceph/pull/54266), Zac Dover)

- doc/glossary: improve "MDS" entry ([pr#55850](https://github.com/ceph/ceph/pull/55850), Zac Dover)

- doc/glossary: improve OSD definitions ([pr#55614](https://github.com/ceph/ceph/pull/55614), Zac Dover)

- doc/governance: add Zac Dover's updated email ([pr#60136](https://github.com/ceph/ceph/pull/60136), Zac Dover)

- doc/install: add manual RADOSGW install procedure ([pr#55881](https://github.com/ceph/ceph/pull/55881), Zac Dover)

- doc/install: fix typos in openEuler-installation doc ([pr#56414](https://github.com/ceph/ceph/pull/56414), Rongqi Sun)

- doc/install: Keep the name field of the created user consistent with … ([pr#59758](https://github.com/ceph/ceph/pull/59758), hejindong)

- doc/install: update "update submodules" ([pr#54962](https://github.com/ceph/ceph/pull/54962), Zac Dover)

- doc/man/8/mount<span></span>.ceph<span></span>.rst: add more mount options ([pr#55755](https://github.com/ceph/ceph/pull/55755), Xiubo Li)

- doc/man/8/radosgw-admin: add get lifecycle command ([pr#57161](https://github.com/ceph/ceph/pull/57161), rkhudov)

- doc/man: add missing long option switches ([pr#57708](https://github.com/ceph/ceph/pull/57708), Patrick Donnelly)

- doc/man: edit "manipulating the omap key" ([pr#55636](https://github.com/ceph/ceph/pull/55636), Zac Dover)

- doc/man: edit ceph-bluestore-tool<span></span>.rst ([pr#59684](https://github.com/ceph/ceph/pull/59684), Zac Dover)

- doc/man: edit ceph-osd description ([pr#54552](https://github.com/ceph/ceph/pull/54552), Zac Dover)

- doc/man: supplant "wsync" with "nowsync" as the default ([pr#60201](https://github.com/ceph/ceph/pull/60201), Zac Dover)

- doc/mds: improve wording ([pr#59587](https://github.com/ceph/ceph/pull/59587), Piotr Parczewski)

- doc/mgr/dashboard: fix TLS typo ([pr#59033](https://github.com/ceph/ceph/pull/59033), Mindy Preston)

- doc/mgr: credit John Jasen for Zabbix 2 ([pr#56685](https://github.com/ceph/ceph/pull/56685), Zac Dover)

- doc/mgr: document lack of MSWin NFS 4<span></span>.x support ([pr#55033](https://github.com/ceph/ceph/pull/55033), Zac Dover)

- doc/mgr: edit "Overview" in dashboard<span></span>.rst ([pr#57337](https://github.com/ceph/ceph/pull/57337), Zac Dover)

- doc/mgr: edit "Resolve IP address to hostname before redirect" ([pr#57297](https://github.com/ceph/ceph/pull/57297), Zac Dover)

- doc/mgr: explain error message - dashboard<span></span>.rst ([pr#57110](https://github.com/ceph/ceph/pull/57110), Zac Dover)

- doc/mgr: remove ceph-exporter (Quincy) ([pr#55518](https://github.com/ceph/ceph/pull/55518), Zac Dover)

- doc/mgr: remove Zabbix 1 information ([pr#56799](https://github.com/ceph/ceph/pull/56799), Zac Dover)

- doc/mgr: update zabbix information ([pr#56632](https://github.com/ceph/ceph/pull/56632), Zac Dover)

- doc/rados/configuration/bluestore-config-ref: Fix lowcase typo ([pr#54695](https://github.com/ceph/ceph/pull/54695), Adam Kupczyk)

- doc/rados/configuration/osd-config-ref: fix typo ([pr#55679](https://github.com/ceph/ceph/pull/55679), Pierre Riteau)

- doc/rados/operations: add EC overhead table to erasure-code<span></span>.rst ([pr#55245](https://github.com/ceph/ceph/pull/55245), Anthony D'Atri)

- doc/rados/operations: document `ceph balancer status detail` ([pr#55264](https://github.com/ceph/ceph/pull/55264), Laura Flores)

- doc/rados/operations: Fix off-by-one errors in control<span></span>.rst ([pr#55232](https://github.com/ceph/ceph/pull/55232), tobydarling)

- doc/rados/operations: Improve crush_location docs ([pr#56595](https://github.com/ceph/ceph/pull/56595), Niklas Hambüchen)

- doc/rados/operations: Improve health-checks<span></span>.rst ([pr#59584](https://github.com/ceph/ceph/pull/59584), Anthony D'Atri)

- doc/rados/operations: remove vanity cluster name reference from crush… ([pr#58949](https://github.com/ceph/ceph/pull/58949), Anthony D'Atri)

- doc/rados/operations: rephrase OSDs peering ([pr#57158](https://github.com/ceph/ceph/pull/57158), Piotr Parczewski)

- doc/rados: add "change public network" procedure ([pr#55800](https://github.com/ceph/ceph/pull/55800), Zac Dover)

- doc/rados: add "pgs not deep scrubbed in time" info ([pr#59735](https://github.com/ceph/ceph/pull/59735), Zac Dover)

- doc/rados: add bucket rename command ([pr#57028](https://github.com/ceph/ceph/pull/57028), Zac Dover)

- doc/rados: add confval directives to health-checks ([pr#59873](https://github.com/ceph/ceph/pull/59873), Zac Dover)

- doc/rados: add link to messenger v2 info in mon-lookup-dns<span></span>.rst ([pr#59796](https://github.com/ceph/ceph/pull/59796), Zac Dover)

- doc/rados: add link to pg blog post ([pr#55612](https://github.com/ceph/ceph/pull/55612), Zac Dover)

- doc/rados: add options to network config ref ([pr#57917](https://github.com/ceph/ceph/pull/57917), Zac Dover)

- doc/rados: add osd_deep_scrub_interval setting operation ([pr#59804](https://github.com/ceph/ceph/pull/59804), Zac Dover)

- doc/rados: add PG definition ([pr#55631](https://github.com/ceph/ceph/pull/55631), Zac Dover)

- doc/rados: add pg-states and pg-concepts to tree ([pr#58051](https://github.com/ceph/ceph/pull/58051), Zac Dover)

- doc/rados: add stop monitor command ([pr#57852](https://github.com/ceph/ceph/pull/57852), Zac Dover)

- doc/rados: add stretch_rule workaround ([pr#58183](https://github.com/ceph/ceph/pull/58183), Zac Dover)

- doc/rados: credit Prashant for a procedure ([pr#58259](https://github.com/ceph/ceph/pull/58259), Zac Dover)

- doc/rados: document manually passing search domain ([pr#58433](https://github.com/ceph/ceph/pull/58433), Zac Dover)

- doc/rados: document unfound object cache-tiering scenario ([pr#59382](https://github.com/ceph/ceph/pull/59382), Zac Dover)

- doc/rados: edit "client can't connect<span></span>.<span></span>.<span></span>." ([pr#54655](https://github.com/ceph/ceph/pull/54655), Zac Dover)

- doc/rados: edit "Everything Failed! Now What?" ([pr#54666](https://github.com/ceph/ceph/pull/54666), Zac Dover)

- doc/rados: edit "monitor store failures" ([pr#54660](https://github.com/ceph/ceph/pull/54660), Zac Dover)

- doc/rados: edit "Placement Groups Never Get Clean" ([pr#60048](https://github.com/ceph/ceph/pull/60048), Zac Dover)

- doc/rados: edit "recovering broken monmap" ([pr#54602](https://github.com/ceph/ceph/pull/54602), Zac Dover)

- doc/rados: edit "troubleshooting-mon" ([pr#54503](https://github.com/ceph/ceph/pull/54503), Zac Dover)

- doc/rados: edit "understanding mon_status" ([pr#54580](https://github.com/ceph/ceph/pull/54580), Zac Dover)

- doc/rados: edit "Using the Monitor's Admin Socket" ([pr#54577](https://github.com/ceph/ceph/pull/54577), Zac Dover)

- doc/rados: edit t-mon "common issues" (1 of x) ([pr#54419](https://github.com/ceph/ceph/pull/54419), Zac Dover)

- doc/rados: edit t-mon "common issues" (2 of x) ([pr#54422](https://github.com/ceph/ceph/pull/54422), Zac Dover)

- doc/rados: edit t-mon "common issues" (3 of x) ([pr#54439](https://github.com/ceph/ceph/pull/54439), Zac Dover)

- doc/rados: edit t-mon "common issues" (4 of x) ([pr#54444](https://github.com/ceph/ceph/pull/54444), Zac Dover)

- doc/rados: edit t-mon "common issues" (5 of x) ([pr#54456](https://github.com/ceph/ceph/pull/54456), Zac Dover)

- doc/rados: edit t-mon<span></span>.rst text ([pr#54350](https://github.com/ceph/ceph/pull/54350), Zac Dover)

- doc/rados: edit t-shooting-mon<span></span>.rst ([pr#54428](https://github.com/ceph/ceph/pull/54428), Zac Dover)

- doc/rados: edit troubleshooting-osd<span></span>.rst ([pr#58273](https://github.com/ceph/ceph/pull/58273), Zac Dover)

- doc/rados: edit troubleshooting-pg<span></span>.rst ([pr#54229](https://github.com/ceph/ceph/pull/54229), Zac Dover)

- doc/rados: explain replaceable parts of command ([pr#58061](https://github.com/ceph/ceph/pull/58061), Zac Dover)

- doc/rados: fix broken links ([pr#55681](https://github.com/ceph/ceph/pull/55681), Zac Dover)

- doc/rados: fix outdated value for ms_bind_port_max ([pr#57049](https://github.com/ceph/ceph/pull/57049), Pierre Riteau)

- doc/rados: followup to PR#58057 ([pr#58163](https://github.com/ceph/ceph/pull/58163), Zac Dover)

- doc/rados: format "initial troubleshooting" ([pr#54478](https://github.com/ceph/ceph/pull/54478), Zac Dover)

- doc/rados: format Q&A list in t-mon<span></span>.rst ([pr#54346](https://github.com/ceph/ceph/pull/54346), Zac Dover)

- doc/rados: format Q&A list in tshooting-mon<span></span>.rst ([pr#54367](https://github.com/ceph/ceph/pull/54367), Zac Dover)

- doc/rados: format sections in tshooting-mon<span></span>.rst ([pr#54639](https://github.com/ceph/ceph/pull/54639), Zac Dover)

- doc/rados: improve "Ceph Subsystems" ([pr#54703](https://github.com/ceph/ceph/pull/54703), Zac Dover)

- doc/rados: improve "scrubbing" explanation ([pr#54271](https://github.com/ceph/ceph/pull/54271), Zac Dover)

- doc/rados: improve formatting of log-and-debug<span></span>.rst ([pr#54747](https://github.com/ceph/ceph/pull/54747), Zac Dover)

- doc/rados: improve leader/peon monitor explanation ([pr#57960](https://github.com/ceph/ceph/pull/57960), Zac Dover)

- doc/rados: link to pg setting commands ([pr#55937](https://github.com/ceph/ceph/pull/55937), Zac Dover)

- doc/rados: ops/pgs: s/power of 2/power of two ([pr#54701](https://github.com/ceph/ceph/pull/54701), Zac Dover)

- doc/rados: parallelize t-mon headings ([pr#54462](https://github.com/ceph/ceph/pull/54462), Zac Dover)

- doc/rados: PR#57022 unfinished business ([pr#57266](https://github.com/ceph/ceph/pull/57266), Zac Dover)

- doc/rados: remove dual-stack docs ([pr#57074](https://github.com/ceph/ceph/pull/57074), Zac Dover)

- doc/rados: remove PGcalc from docs ([pr#55902](https://github.com/ceph/ceph/pull/55902), Zac Dover)

- doc/rados: remove redundant pg repair commands ([pr#57041](https://github.com/ceph/ceph/pull/57041), Zac Dover)

- doc/rados: repair stretch-mode<span></span>.rst ([pr#54763](https://github.com/ceph/ceph/pull/54763), Zac Dover)

- doc/rados: restore PGcalc tool ([pr#56058](https://github.com/ceph/ceph/pull/56058), Zac Dover)

- doc/rados: revert "doc/rados/operations: document `ceph balancer status detail`" ([pr#55359](https://github.com/ceph/ceph/pull/55359), Laura Flores)

- doc/rados: s/cepgsqlite/cephsqlite/ ([pr#57248](https://github.com/ceph/ceph/pull/57248), Zac Dover)

- doc/rados: standardize markup of "clean" ([pr#60502](https://github.com/ceph/ceph/pull/60502), Zac Dover)

- doc/rados: update "stretch mode" ([pr#54757](https://github.com/ceph/ceph/pull/54757), Michael Collins)

- doc/rados: update common<span></span>.rst ([pr#56269](https://github.com/ceph/ceph/pull/56269), Zac Dover)

- doc/rados: update config for autoscaler ([pr#55439](https://github.com/ceph/ceph/pull/55439), Zac Dover)

- doc/rados: update how to install c++ header files ([pr#58309](https://github.com/ceph/ceph/pull/58309), Pere Diaz Bou)

- doc/rados: update PG guidance ([pr#55461](https://github.com/ceph/ceph/pull/55461), Zac Dover)

- doc/radosgw - edit admin<span></span>.rst "set user rate limit" ([pr#55151](https://github.com/ceph/ceph/pull/55151), Zac Dover)

- doc/radosgw/admin<span></span>.rst: use underscores in config var names ([pr#54934](https://github.com/ceph/ceph/pull/54934), Ville Ojamo)

- doc/radosgw/multisite: fix Configuring Secondary Zones -> Updating the Period ([pr#60334](https://github.com/ceph/ceph/pull/60334), Casey Bodley)

- doc/radosgw: add confval directives ([pr#55485](https://github.com/ceph/ceph/pull/55485), Zac Dover)

- doc/radosgw: add gateway starting command ([pr#54834](https://github.com/ceph/ceph/pull/54834), Zac Dover)

- doc/radosgw: admin<span></span>.rst - edit "Create a Subuser" ([pr#55021](https://github.com/ceph/ceph/pull/55021), Zac Dover)

- doc/radosgw: admin<span></span>.rst - edit "Create a User" ([pr#55005](https://github.com/ceph/ceph/pull/55005), Zac Dover)

- doc/radosgw: admin<span></span>.rst - edit sections ([pr#55018](https://github.com/ceph/ceph/pull/55018), Zac Dover)

- doc/radosgw: disambiguate version-added remarks ([pr#57142](https://github.com/ceph/ceph/pull/57142), Zac Dover)

- doc/radosgw: edit "Add/Remove a Key" ([pr#55056](https://github.com/ceph/ceph/pull/55056), Zac Dover)

- doc/radosgw: edit "Enable/Disable Bucket Rate Limit" ([pr#55261](https://github.com/ceph/ceph/pull/55261), Zac Dover)

- doc/radosgw: edit "read/write global rate limit" admin<span></span>.rst ([pr#55272](https://github.com/ceph/ceph/pull/55272), Zac Dover)

- doc/radosgw: edit "remove a subuser" ([pr#55035](https://github.com/ceph/ceph/pull/55035), Zac Dover)

- doc/radosgw: edit "Usage" admin<span></span>.rst ([pr#55322](https://github.com/ceph/ceph/pull/55322), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst "Get Bucket Rate Limit" ([pr#55254](https://github.com/ceph/ceph/pull/55254), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst "get user rate limit" ([pr#55158](https://github.com/ceph/ceph/pull/55158), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst "set bucket rate limit" ([pr#55243](https://github.com/ceph/ceph/pull/55243), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst - quota ([pr#55083](https://github.com/ceph/ceph/pull/55083), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst 1 of x ([pr#55001](https://github.com/ceph/ceph/pull/55001), Zac Dover)

- doc/radosgw: edit compression<span></span>.rst ([pr#54986](https://github.com/ceph/ceph/pull/54986), Zac Dover)

- doc/radosgw: edit front matter - role<span></span>.rst ([pr#54855](https://github.com/ceph/ceph/pull/54855), Zac Dover)

- doc/radosgw: edit multisite<span></span>.rst ([pr#55672](https://github.com/ceph/ceph/pull/55672), Zac Dover)

- doc/radosgw: edit sections ([pr#55028](https://github.com/ceph/ceph/pull/55028), Zac Dover)

- doc/radosgw: fix formatting ([pr#54754](https://github.com/ceph/ceph/pull/54754), Zac Dover)

- doc/radosgw: Fix JSON typo in Principal Tag example code snippet ([pr#54643](https://github.com/ceph/ceph/pull/54643), Daniel Parkes)

- doc/radosgw: fix verb disagreement - index<span></span>.html ([pr#55339](https://github.com/ceph/ceph/pull/55339), Zac Dover)

- doc/radosgw: format "Create a Role" ([pr#54887](https://github.com/ceph/ceph/pull/54887), Zac Dover)

- doc/radosgw: format commands in role<span></span>.rst ([pr#54906](https://github.com/ceph/ceph/pull/54906), Zac Dover)

- doc/radosgw: format POST statements ([pr#54850](https://github.com/ceph/ceph/pull/54850), Zac Dover)

- doc/radosgw: Improve dynamicresharding<span></span>.rst ([pr#54369](https://github.com/ceph/ceph/pull/54369), Anthony D'Atri)

- doc/radosgw: Revert "doc/rgw/lua: add info uploading a ([pr#55526](https://github.com/ceph/ceph/pull/55526), Zac Dover)

- doc/radosgw: update link in rgw-cache<span></span>.rst ([pr#54806](https://github.com/ceph/ceph/pull/54806), Zac Dover)

- doc/radosgw: update S3 action list ([pr#57366](https://github.com/ceph/ceph/pull/57366), Zac Dover)

- doc/radosgw: use 'confval' directive for reshard config options ([pr#57025](https://github.com/ceph/ceph/pull/57025), Casey Bodley)

- doc/radosrgw: edit admin<span></span>.rst ([pr#55074](https://github.com/ceph/ceph/pull/55074), Zac Dover)

- doc/rbd/rbd-exclusive-locks: mention incompatibility with advisory locks ([pr#58865](https://github.com/ceph/ceph/pull/58865), Ilya Dryomov)

- doc/rbd: "rbd flatten" doesn't take encryption options in quincy ([pr#56272](https://github.com/ceph/ceph/pull/56272), Ilya Dryomov)

- doc/rbd: add namespace information for mirror commands ([pr#60271](https://github.com/ceph/ceph/pull/60271), N Balachandran)

- doc/rbd: minor changes to the rbd man page ([pr#56257](https://github.com/ceph/ceph/pull/56257), N Balachandran)

- doc/README<span></span>.md - add ordered list ([pr#59800](https://github.com/ceph/ceph/pull/59800), Zac Dover)

- doc/README<span></span>.md: create selectable commands ([pr#59836](https://github.com/ceph/ceph/pull/59836), Zac Dover)

- doc/README<span></span>.md: edit "Build Prerequisites" ([pr#59639](https://github.com/ceph/ceph/pull/59639), Zac Dover)

- doc/README<span></span>.md: improve formatting ([pr#59702](https://github.com/ceph/ceph/pull/59702), Zac Dover)

- doc/rgw/d3n: pass cache dir volume to extra_container_args ([pr#59769](https://github.com/ceph/ceph/pull/59769), Mark Kogan)

- doc/rgw/notification: persistent notification queue full behavior ([pr#59235](https://github.com/ceph/ceph/pull/59235), Yuval Lifshitz)

- doc/rgw/notifications: specify which event types are enabled by default ([pr#54501](https://github.com/ceph/ceph/pull/54501), Yuval Lifshitz)

- doc/rgw: edit admin<span></span>.rst - rate limit management ([pr#55129](https://github.com/ceph/ceph/pull/55129), Zac Dover)

- doc/rgw: fix Attributes index in CreateTopic example ([pr#55433](https://github.com/ceph/ceph/pull/55433), Casey Bodley)

- doc/security: remove old GPG information ([pr#56915](https://github.com/ceph/ceph/pull/56915), Zac Dover)

- doc/security: update CVE list ([pr#57019](https://github.com/ceph/ceph/pull/57019), Zac Dover)

- doc/src: add inline literals (``) to variables ([pr#57938](https://github.com/ceph/ceph/pull/57938), Zac Dover)

- doc/src: invadvisable is not a word ([pr#58191](https://github.com/ceph/ceph/pull/58191), Doug Whitfield)

- doc/start: Add Beginner's Guide ([pr#57823](https://github.com/ceph/ceph/pull/57823), Zac Dover)

- doc/start: add links to Beginner's Guide ([pr#58204](https://github.com/ceph/ceph/pull/58204), Zac Dover)

- doc/start: add Slack invite link ([pr#56042](https://github.com/ceph/ceph/pull/56042), Zac Dover)

- doc/start: add vstart install guide ([pr#60463](https://github.com/ceph/ceph/pull/60463), Zac Dover)

- doc/start: Edit Beginner's Guide ([pr#57846](https://github.com/ceph/ceph/pull/57846), Zac Dover)

- doc/start: explain "OSD" ([pr#54560](https://github.com/ceph/ceph/pull/54560), Zac Dover)

- doc/start: fix typo in hardware-recommendations<span></span>.rst ([pr#54481](https://github.com/ceph/ceph/pull/54481), Anthony D'Atri)

- doc/start: fix wording & syntax ([pr#58365](https://github.com/ceph/ceph/pull/58365), Piotr Parczewski)

- doc/start: improve MDS explanation ([pr#56467](https://github.com/ceph/ceph/pull/56467), Zac Dover)

- doc/start: improve MDS explanation ([pr#56427](https://github.com/ceph/ceph/pull/56427), Zac Dover)

- doc/start: link to mon map command ([pr#56411](https://github.com/ceph/ceph/pull/56411), Zac Dover)

- doc/start: remove "intro<span></span>.rst" ([pr#57950](https://github.com/ceph/ceph/pull/57950), Zac Dover)

- doc/start: remove mention of Centos 8 support ([pr#58391](https://github.com/ceph/ceph/pull/58391), Zac Dover)

- doc/start: s/http/https/ in links ([pr#57872](https://github.com/ceph/ceph/pull/57872), Zac Dover)

- doc/start: s/intro<span></span>.rst/index<span></span>.rst/ ([pr#57904](https://github.com/ceph/ceph/pull/57904), Zac Dover)

- doc/start: update mailing list links ([pr#58685](https://github.com/ceph/ceph/pull/58685), Zac Dover)

- doc/start: update release names ([pr#54573](https://github.com/ceph/ceph/pull/54573), Zac Dover)

- doc: add description of metric fields for cephfs-top ([pr#55512](https://github.com/ceph/ceph/pull/55512), Neeraj Pratap Singh)

- doc: add supported file types in cephfs-mirroring<span></span>.rst ([pr#54823](https://github.com/ceph/ceph/pull/54823), Jos Collin)

- doc: Amend dev mailing list subscribe instructions ([pr#58698](https://github.com/ceph/ceph/pull/58698), Paulo E. Castro)

- doc: cephadm/services/osd: fix typo ([pr#56231](https://github.com/ceph/ceph/pull/56231), Lorenz Bausch)

- doc: clarify availability vs integrity ([pr#58132](https://github.com/ceph/ceph/pull/58132), Gregory O'Neill)

- doc: clarify superuser note for ceph-fuse ([pr#58616](https://github.com/ceph/ceph/pull/58616), Patrick Donnelly)

- doc: clarify use of location: in host spec ([pr#57648](https://github.com/ceph/ceph/pull/57648), Matthew Vernon)

- doc: Correct link to "Device management" ([pr#58490](https://github.com/ceph/ceph/pull/58490), Matthew Vernon)

- doc: Correct link to Prometheus docs ([pr#59561](https://github.com/ceph/ceph/pull/59561), Matthew Vernon)

- doc: correct typo ([pr#57885](https://github.com/ceph/ceph/pull/57885), Matthew Vernon)

- doc: discuss the standard multi-tenant CephFS security model ([pr#53559](https://github.com/ceph/ceph/pull/53559), Greg Farnum)

- doc: Document the Windows CI job ([pr#60035](https://github.com/ceph/ceph/pull/60035), Lucian Petrut)

- doc: documenting the feature that scrub clear the entries from damage… ([pr#59080](https://github.com/ceph/ceph/pull/59080), Neeraj Pratap Singh)

- doc: explain the consequence of enabling mirroring through monitor co… ([pr#60527](https://github.com/ceph/ceph/pull/60527), Jos Collin)

- doc: fix email ([pr#60235](https://github.com/ceph/ceph/pull/60235), Ernesto Puerta)

- doc: fix typo ([pr#59993](https://github.com/ceph/ceph/pull/59993), N Balachandran)

- doc: Fixes two typos and grammatical errors<span></span>. Signed-off-by: Sina Ahma… ([pr#54776](https://github.com/ceph/ceph/pull/54776), Sina Ahmadi)

- doc: Improve doc/radosgw/placement<span></span>.rst ([pr#58975](https://github.com/ceph/ceph/pull/58975), Anthony D'Atri)

- doc: specify correct fs type for mkfs ([pr#55283](https://github.com/ceph/ceph/pull/55283), Vladislav Glagolev)

- doc: SubmittingPatches-backports - remove backports team ([pr#60299](https://github.com/ceph/ceph/pull/60299), Zac Dover)

- doc: Update "Getting Started" to link to start not install ([pr#59909](https://github.com/ceph/ceph/pull/59909), Matthew Vernon)

- doc: Update dynamicresharding<span></span>.rst ([pr#54330](https://github.com/ceph/ceph/pull/54330), Aliaksei Makarau)

- doc: update rgw admin api req params for get user info ([pr#55072](https://github.com/ceph/ceph/pull/55072), Ali Maredia)

- doc: update tests-integration-testing-teuthology-workflow<span></span>.rst ([pr#59550](https://github.com/ceph/ceph/pull/59550), Vallari Agrawal)

- doc:start<span></span>.rst fix typo in hw-recs ([pr#55506](https://github.com/ceph/ceph/pull/55506), Eduardo Roldan)

- doc:update e-mail addresses governance ([pr#60086](https://github.com/ceph/ceph/pull/60086), Tobias Fischer)

- docs/rados/operations/stretch-mode: warn device class is not supported ([pr#59101](https://github.com/ceph/ceph/pull/59101), Kamoltat Sirivadhna)

- docs/rados: remove incorrect ceph command ([pr#56496](https://github.com/ceph/ceph/pull/56496), Taha Jahangir)

- docs/radosgw: edit admin<span></span>.rst "enable/disable user rate limit" ([pr#55195](https://github.com/ceph/ceph/pull/55195), Zac Dover)

- docs/rbd: fix typo in arg name ([pr#56263](https://github.com/ceph/ceph/pull/56263), N Balachandran)

- docs: Add information about OpenNebula integration ([pr#54939](https://github.com/ceph/ceph/pull/54939), Daniel Clavijo)

- docs: removed centos 8 and added squid to the build matrix ([pr#58903](https://github.com/ceph/ceph/pull/58903), Yuri Weinstein)

- global: Call getnam_r with a 64KiB buffer on the heap ([pr#60124](https://github.com/ceph/ceph/pull/60124), Adam Emerson)

- install-deps<span></span>.sh, do_cmake<span></span>.sh: almalinux is another el flavour ([pr#58523](https://github.com/ceph/ceph/pull/58523), Dan van der Ster)

- install-deps: save and restore user's XDG_CACHE_HOME ([pr#56991](https://github.com/ceph/ceph/pull/56991), luo rixin)

- kv/RocksDBStore: Configure compact-on-deletion for all CFs ([pr#57404](https://github.com/ceph/ceph/pull/57404), Joshua Baergen)

- librados: make querying pools for selfmanaged snaps reliable ([pr#55025](https://github.com/ceph/ceph/pull/55025), Ilya Dryomov)

- librados: use CEPH_OSD_FLAG_FULL_FORCE for IoCtxImpl::remove ([pr#59283](https://github.com/ceph/ceph/pull/59283), Chen Yuanrun)

- librbd/crypto: fix issue when live-migrating from encrypted export ([pr#59144](https://github.com/ceph/ceph/pull/59144), Ilya Dryomov)

- librbd/migration: prune snapshot extents in RawFormat::list_snaps() ([pr#59659](https://github.com/ceph/ceph/pull/59659), Ilya Dryomov)

- librbd: account for discards that truncate in ObjectListSnapsRequest ([pr#56212](https://github.com/ceph/ceph/pull/56212), Ilya Dryomov)

- librbd: Append one journal event per image request ([pr#54819](https://github.com/ceph/ceph/pull/54819), Ilya Dryomov, Joshua Baergen)

- librbd: create rbd_trash object during pool initialization and namespace creation ([pr#57604](https://github.com/ceph/ceph/pull/57604), Ramana Raja)

- librbd: diff-iterate shouldn't crash on an empty byte range ([pr#58210](https://github.com/ceph/ceph/pull/58210), Ilya Dryomov)

- librbd: disallow group snap rollback if memberships don't match ([pr#58208](https://github.com/ceph/ceph/pull/58208), Ilya Dryomov)

- librbd: don't crash on a zero-length read if buffer is NULL ([pr#57569](https://github.com/ceph/ceph/pull/57569), Ilya Dryomov)

- librbd: don't report HOLE_UPDATED when diffing against a hole ([pr#54950](https://github.com/ceph/ceph/pull/54950), Ilya Dryomov)

- librbd: fix regressions in ObjectListSnapsRequest ([pr#54861](https://github.com/ceph/ceph/pull/54861), Ilya Dryomov)

- librbd: fix split() for SparseExtent and SparseBufferlistExtent ([pr#55664](https://github.com/ceph/ceph/pull/55664), Ilya Dryomov)

- librbd: improve rbd_diff_iterate2() performance in fast-diff mode ([pr#55257](https://github.com/ceph/ceph/pull/55257), Ilya Dryomov)

- librbd: make diff-iterate in fast-diff mode aware of encryption ([pr#58342](https://github.com/ceph/ceph/pull/58342), Ilya Dryomov)

- librbd: make group and group snapshot IDs more random ([pr#57090](https://github.com/ceph/ceph/pull/57090), Ilya Dryomov)

- librbd: return ENOENT from Snapshot::get_timestamp for nonexistent snap_id ([pr#55473](https://github.com/ceph/ceph/pull/55473), John Agombar)

- librgw: teach librgw about rgw_backend_store ([pr#59315](https://github.com/ceph/ceph/pull/59315), Matt Benjamin)

- log: Make log_max_recent have an effect again ([pr#48310](https://github.com/ceph/ceph/pull/48310), Joshua Baergen)

- make-dist: don't use --continue option for wget ([pr#55092](https://github.com/ceph/ceph/pull/55092), Casey Bodley)

- MClientRequest: properly handle ceph_mds_request_head_legacy for ext_num_retry, ext_num_fwd, owner_uid, owner_gid ([pr#54411](https://github.com/ceph/ceph/pull/54411), Alexander Mikhalitsyn)

- mds,qa: some balancer debug messages (<=5) not printed when debug_mds is >=5 ([pr#53551](https://github.com/ceph/ceph/pull/53551), Patrick Donnelly)

- mds/MDBalancer: ignore queued callbacks if MDS is not active ([pr#54494](https://github.com/ceph/ceph/pull/54494), Leonid Usov)

- mds/MDSRank: Add set_history_slow_op_size_and_threshold for op_tracker ([pr#53358](https://github.com/ceph/ceph/pull/53358), Yite Gu)

- mds: add a command to dump directory information ([pr#55986](https://github.com/ceph/ceph/pull/55986), Jos Collin, Zhansong Gao)

- mds: add debug logs during setxattr ceph<span></span>.dir<span></span>.subvolume ([pr#56061](https://github.com/ceph/ceph/pull/56061), Milind Changire)

- mds: adjust pre_segments_size for MDLog when trimming segments for st… ([issue#59833](http://tracker.ceph.com/issues/59833), [pr#54034](https://github.com/ceph/ceph/pull/54034), Venky Shankar)

- mds: allow lock state to be LOCK_MIX_SYNC in replica for filelock ([pr#56050](https://github.com/ceph/ceph/pull/56050), Xiubo Li)

- mds: change priority of mds rss perf counter to useful ([pr#55058](https://github.com/ceph/ceph/pull/55058), sp98)

- mds: disable `defer_client_eviction_on_laggy_osds' by default ([issue#64685](http://tracker.ceph.com/issues/64685), [pr#56195](https://github.com/ceph/ceph/pull/56195), Venky Shankar)

- mds: do not simplify fragset ([pr#54892](https://github.com/ceph/ceph/pull/54892), Milind Changire)

- mds: do remove the cap when seqs equal or larger than last issue ([pr#58296](https://github.com/ceph/ceph/pull/58296), Xiubo Li)

- mds: dump locks when printing mutation ops ([pr#52976](https://github.com/ceph/ceph/pull/52976), Patrick Donnelly)

- mds: ensure next replay is queued on req drop ([pr#54315](https://github.com/ceph/ceph/pull/54315), Patrick Donnelly)

- mds: fix session/client evict command ([issue#68132](http://tracker.ceph.com/issues/68132), [pr#58724](https://github.com/ceph/ceph/pull/58724), Venky Shankar, Neeraj Pratap Singh)

- mds: log message when exiting due to asok command ([pr#53549](https://github.com/ceph/ceph/pull/53549), Patrick Donnelly)

- mds: prevent scrubbing for standby-replay MDS ([pr#58799](https://github.com/ceph/ceph/pull/58799), Neeraj Pratap Singh)

- mds: replacing bootstrap session only if handle client session message ([pr#53363](https://github.com/ceph/ceph/pull/53363), Mer Xuanyi)

- mds: revert standby-replay trimming changes ([pr#54717](https://github.com/ceph/ceph/pull/54717), Patrick Donnelly)

- mds: set the correct WRLOCK flag always in wrlock_force() ([pr#58773](https://github.com/ceph/ceph/pull/58773), Xiubo Li)

- mds: set the loner to true for LOCK_EXCL_XSYN ([pr#54910](https://github.com/ceph/ceph/pull/54910), Xiubo Li)

- mds: try to choose a new batch head in request_clientup() ([pr#58843](https://github.com/ceph/ceph/pull/58843), Xiubo Li)

- mds: use variable g_ceph_context directly in MDSAuthCaps ([pr#52820](https://github.com/ceph/ceph/pull/52820), Rishabh Dave)

- MDSAuthCaps: print better error message for perm flag in MDS caps ([pr#54946](https://github.com/ceph/ceph/pull/54946), Rishabh Dave)

- mgr/BaseMgrModule: Optimize CPython Call in Finish Function ([pr#57585](https://github.com/ceph/ceph/pull/57585), Nitzan Mordechai)

- mgr/cephadm: Add "networks" parameter to orch apply rgw ([pr#55318](https://github.com/ceph/ceph/pull/55318), Teoman ONAY)

- mgr/cephadm: add "original_weight" parameter to OSD class ([pr#59412](https://github.com/ceph/ceph/pull/59412), Adam King)

- mgr/cephadm: add ability for haproxy, prometheus, grafana to bind on specific ip ([pr#58753](https://github.com/ceph/ceph/pull/58753), Adam King)

- mgr/cephadm: add is_host\\\_<status> functions to HostCache ([pr#55964](https://github.com/ceph/ceph/pull/55964), Adam King)

- mgr/cephadm: Adding extra arguments support for RGW frontend ([pr#55963](https://github.com/ceph/ceph/pull/55963), Adam King, Redouane Kachach)

- mgr/cephadm: allow draining host without removing conf/keyring files ([pr#55973](https://github.com/ceph/ceph/pull/55973), Adam King)

- mgr/cephadm: catch CancelledError in asyncio timeout handler ([pr#56086](https://github.com/ceph/ceph/pull/56086), Adam King)

- mgr/cephadm: ceph orch add fails when ipv6 address is surrounded by square brackets ([pr#56079](https://github.com/ceph/ceph/pull/56079), Teoman ONAY)

- mgr/cephadm: cleanup iscsi keyring upon daemon removal ([pr#58757](https://github.com/ceph/ceph/pull/58757), Adam King)

- mgr/cephadm: don't use image tag in orch upgrade ls ([pr#55974](https://github.com/ceph/ceph/pull/55974), Adam King)

- mgr/cephadm: fix flake8 test failures ([pr#58077](https://github.com/ceph/ceph/pull/58077), Nizamudeen A)

- mgr/cephadm: fix placement with label and host pattern ([pr#56088](https://github.com/ceph/ceph/pull/56088), Adam King)

- mgr/cephadm: fix reweighting of OSD when OSD removal is stopped ([pr#56083](https://github.com/ceph/ceph/pull/56083), Adam King)

- mgr/cephadm: Fix unfound progress events ([pr#58758](https://github.com/ceph/ceph/pull/58758), Prashant D)

- mgr/cephadm: fixups for asyncio based timeout ([pr#55556](https://github.com/ceph/ceph/pull/55556), Adam King)

- mgr/cephadm: make client-keyring deploying ceph<span></span>.conf optional ([pr#58754](https://github.com/ceph/ceph/pull/58754), Adam King)

- mgr/cephadm: make setting --cgroups=split configurable for adopted daemons ([pr#58759](https://github.com/ceph/ceph/pull/58759), Gilad Sid)

- mgr/cephadm: pick correct IPs for ingress service based on VIP ([pr#55970](https://github.com/ceph/ceph/pull/55970), Redouane Kachach, Adam King)

- mgr/cephadm: refresh public_network for config checks before checking ([pr#56492](https://github.com/ceph/ceph/pull/56492), Adam King)

- mgr/cephadm: support for regex based host patterns ([pr#56222](https://github.com/ceph/ceph/pull/56222), Adam King)

- mgr/cephadm: support for removing host entry from crush map during host removal ([pr#56081](https://github.com/ceph/ceph/pull/56081), Adam King)

- mgr/cephadm: update timestamp on repeat daemon/service events ([pr#56080](https://github.com/ceph/ceph/pull/56080), Adam King)

- mgr/dashboard/frontend:Ceph dashboard supports multiple languages ([pr#56360](https://github.com/ceph/ceph/pull/56360), TomNewChao)

- mgr/dashboard: add Table Schema to grafonnet ([pr#56737](https://github.com/ceph/ceph/pull/56737), Aashish Sharma)

- mgr/dashboard: allow tls 1<span></span>.2 with a config option ([pr#53779](https://github.com/ceph/ceph/pull/53779), Nizamudeen A)

- mgr/dashboard: change deprecated grafana URL in daemon logs ([pr#55545](https://github.com/ceph/ceph/pull/55545), Nizamudeen A)

- mgr/dashboard: Consider null values as zero in grafana panels ([pr#54540](https://github.com/ceph/ceph/pull/54540), Aashish Sharma)

- mgr/dashboard: debugging make check failure ([pr#56128](https://github.com/ceph/ceph/pull/56128), Nizamudeen A)

- mgr/dashboard: disable dashboard v3 in quincy ([pr#54250](https://github.com/ceph/ceph/pull/54250), Nizamudeen A)

- mgr/dashboard: exclude cloned-deleted RBD snaps ([pr#57221](https://github.com/ceph/ceph/pull/57221), Ernesto Puerta)

- mgr/dashboard: fix duplicate grafana panels when on mgr failover ([pr#56930](https://github.com/ceph/ceph/pull/56930), Avan Thakkar)

- mgr/dashboard: fix duplicate grafana panels when on mgr failover ([pr#56270](https://github.com/ceph/ceph/pull/56270), Avan Thakkar)

- mgr/dashboard: fix e2e failure related to landing page ([pr#55123](https://github.com/ceph/ceph/pull/55123), Pedro Gonzalez Gomez)

- mgr/dashboard: fix error while accessing roles tab when policy attached ([pr#55516](https://github.com/ceph/ceph/pull/55516), Nizamudeen A, Afreen)

- mgr/dashboard: fix rgw port manipulation error in dashboard ([pr#54176](https://github.com/ceph/ceph/pull/54176), Nizamudeen A)

- mgr/dashboard: fix the jsonschema issue in install-deps ([pr#55543](https://github.com/ceph/ceph/pull/55543), Nizamudeen A)

- mgr/dashboard: get rgw port from ssl_endpoint ([pr#55248](https://github.com/ceph/ceph/pull/55248), Nizamudeen A)

- mgr/dashboard: make ceph logo redirect to dashboard ([pr#56558](https://github.com/ceph/ceph/pull/56558), Afreen)

- mgr/dashboard: rbd image hide usage bar when disk usage is not provided ([pr#53809](https://github.com/ceph/ceph/pull/53809), Pedro Gonzalez Gomez)

- mgr/dashboard: remove green tick on old password field ([pr#53385](https://github.com/ceph/ceph/pull/53385), Nizamudeen A)

- mgr/dashboard: remove unnecessary failing hosts e2e ([pr#53459](https://github.com/ceph/ceph/pull/53459), Pedro Gonzalez Gomez)

- mgr/dashboard: replace deprecated table panel in grafana with a newer table panel ([pr#56680](https://github.com/ceph/ceph/pull/56680), Aashish Sharma)

- mgr/dashboard: replace piechart plugin charts with native pie chart panel ([pr#56655](https://github.com/ceph/ceph/pull/56655), Aashish Sharma)

- mgr/dashboard: rm warning/error threshold for cpu usage ([pr#56441](https://github.com/ceph/ceph/pull/56441), Nizamudeen A)

- mgr/dashboard: sanitize dashboard user creation ([pr#56551](https://github.com/ceph/ceph/pull/56551), Pedro Gonzalez Gomez)

- mgr/dashboard: Show the OSDs Out and Down panels as red whenever an OSD is in Out or Down state in Ceph Cluster grafana dashboard ([pr#54539](https://github.com/ceph/ceph/pull/54539), Aashish Sharma)

- mgr/dashboard: upgrade from old 'graph' type panels to the new 'timeseries' panel ([pr#56653](https://github.com/ceph/ceph/pull/56653), Aashish Sharma)

- mgr/k8sevents: update V1Events to CoreV1Events ([pr#57995](https://github.com/ceph/ceph/pull/57995), Nizamudeen A)

- mgr/Mgr<span></span>.cc: clear daemon health metrics instead of removing down/out osd from daemon state ([pr#58512](https://github.com/ceph/ceph/pull/58512), Cory Snyder)

- mgr/nfs: Don't crash ceph-mgr if NFS clusters are unavailable ([pr#58284](https://github.com/ceph/ceph/pull/58284), Anoop C S, Ponnuvel Palaniyappan)

- mgr/pg_autoscaler: add check for norecover flag ([pr#57568](https://github.com/ceph/ceph/pull/57568), Aishwarya Mathuria)

- mgr/prometheus: s/pkg_resources<span></span>.packaging/packaging/ ([pr#58627](https://github.com/ceph/ceph/pull/58627), Adam King, Kefu Chai)

- mgr/rbd_support: fix recursive locking on CreateSnapshotRequests lock ([pr#54290](https://github.com/ceph/ceph/pull/54290), Ramana Raja)

- mgr/rest: Trim requests array and limit size ([pr#59370](https://github.com/ceph/ceph/pull/59370), Nitzan Mordechai)

- mgr/snap_schedule: add support for monthly snapshots ([pr#54894](https://github.com/ceph/ceph/pull/54894), Milind Changire)

- mgr/snap_schedule: make fs argument mandatory if more than one filesystem exists ([pr#54090](https://github.com/ceph/ceph/pull/54090), Milind Changire)

- mgr/snap_schedule: restore yearly spec to lowercase y ([pr#57445](https://github.com/ceph/ceph/pull/57445), Milind Changire)

- mgr/snap_schedule: support subvol and group arguments ([pr#55210](https://github.com/ceph/ceph/pull/55210), Milind Changire)

- mgr/stats: initialize mx_last_updated in FSPerfStats ([pr#57442](https://github.com/ceph/ceph/pull/57442), Jos Collin)

- mgr/vol: handle case where clone index entry goes missing ([pr#58558](https://github.com/ceph/ceph/pull/58558), Rishabh Dave)

- mgr/volumes: fix `subvolume group rm` error message ([pr#54206](https://github.com/ceph/ceph/pull/54206), neeraj pratap singh, Neeraj Pratap Singh)

- mgr: add throttle policy for DaemonServer ([pr#54012](https://github.com/ceph/ceph/pull/54012), ericqzhao)

- mgr: don't dump global config holding gil ([pr#50193](https://github.com/ceph/ceph/pull/50193), Mykola Golub)

- mgr: fix a race condition in DaemonServer::handle_report() ([pr#54555](https://github.com/ceph/ceph/pull/54555), Radoslaw Zarzynski)

- mgr: remove out&down osd from mgr daemons ([pr#54534](https://github.com/ceph/ceph/pull/54534), shimin)

- mon/ConfigMonitor: Show localized name in "config dump --format json" output ([pr#53886](https://github.com/ceph/ceph/pull/53886), Sridhar Seshasayee)

- mon/ConnectionTracker<span></span>.cc: disregard connection scores from mon_rank = -1 ([pr#55166](https://github.com/ceph/ceph/pull/55166), Kamoltat)

- mon/LogMonitor: Use generic cluster log level config ([pr#57521](https://github.com/ceph/ceph/pull/57521), Prashant D)

- mon/MonClient: handle ms_handle_fast_authentication return ([pr#59308](https://github.com/ceph/ceph/pull/59308), Patrick Donnelly)

- mon/Monitor: during shutdown don't accept new authentication and crea… ([pr#55597](https://github.com/ceph/ceph/pull/55597), Nitzan Mordechai)

- mon/OSDMonitor: Add force-remove-snap mon command ([pr#59403](https://github.com/ceph/ceph/pull/59403), Matan Breizman)

- mon/OSDMonitor: fix get_min_last_epoch_clean() ([pr#55868](https://github.com/ceph/ceph/pull/55868), Matan Breizman, Adam C. Emerson)

- mon/OSDMonitor: fix rmsnap command ([pr#56430](https://github.com/ceph/ceph/pull/56430), Matan Breizman)

- mon: add exception handling to ceph health mute ([pr#55117](https://github.com/ceph/ceph/pull/55117), Daniel Radjenovic)

- mon: add proxy to cache tier options ([pr#50551](https://github.com/ceph/ceph/pull/50551), tan changzhi)

- mon: fix health store size growing infinitely ([pr#55549](https://github.com/ceph/ceph/pull/55549), Wei Wang)

- mon: fix inconsistencies in class param ([pr#59278](https://github.com/ceph/ceph/pull/59278), Victoria Mackie)

- mon: fix mds metadata lost in one case ([pr#54317](https://github.com/ceph/ceph/pull/54317), shimin)

- mon: stuck peering since warning is misleading ([pr#57407](https://github.com/ceph/ceph/pull/57407), shreyanshjain7174)

- msg/async: Encode message once features are set ([pr#59442](https://github.com/ceph/ceph/pull/59442), Aishwarya Mathuria)

- msg/AsyncMessenger: re-evaluate the stop condition when woken up in 'wait()' ([pr#53718](https://github.com/ceph/ceph/pull/53718), Leonid Usov)

- msg: update MOSDOp() to use ceph_tid_t instead of long ([pr#55425](https://github.com/ceph/ceph/pull/55425), Lucian Petrut)

- nofail option in fstab not supported ([pr#52986](https://github.com/ceph/ceph/pull/52986), Leonid Usov)

- os/bluestore: allow use BtreeAllocator ([pr#59498](https://github.com/ceph/ceph/pull/59498), tan changzhi)

- os/bluestore: enable async manual compactions ([pr#58742](https://github.com/ceph/ceph/pull/58742), Igor Fedotov)

- os/bluestore: expand BlueFS log if available space is insufficient ([pr#57243](https://github.com/ceph/ceph/pull/57243), Pere Diaz Bou)

- os/bluestore: fix crash caused by dividing by 0 ([pr#57198](https://github.com/ceph/ceph/pull/57198), Jrchyang Yu)

- os/bluestore: fix free space update after bdev-expand in NCB mode ([pr#55776](https://github.com/ceph/ceph/pull/55776), Igor Fedotov)

- os/bluestore: fix the problem of l_bluefs_log_compactions double recording ([pr#57196](https://github.com/ceph/ceph/pull/57196), Wang Linke)

- os/bluestore: get rid off resulting lba alignment in allocators ([pr#54877](https://github.com/ceph/ceph/pull/54877), Igor Fedotov)

- os/bluestore: set rocksdb iterator bounds for Bluestore::\_collection_list() ([pr#57622](https://github.com/ceph/ceph/pull/57622), Cory Snyder)

- os/bluestore: Warning added for slow operations and stalled read ([pr#59468](https://github.com/ceph/ceph/pull/59468), Md Mahamudur Rahaman Sajib)

- os/store_test: Retune tests to current code ([pr#56138](https://github.com/ceph/ceph/pull/56138), Adam Kupczyk)

- os: introduce ObjectStore::refresh_perf_counters() method ([pr#55133](https://github.com/ceph/ceph/pull/55133), Igor Fedotov)

- osd/ECTransaction: Remove incorrect asserts in generate_transactions ([pr#59132](https://github.com/ceph/ceph/pull/59132), Mark Nelson)

- osd/OSD: introduce reset_purged_snaps_last ([pr#53973](https://github.com/ceph/ceph/pull/53973), Matan Breizman)

- osd/OSDMap: Check for uneven weights & != 2 buckets post stretch mode ([pr#52458](https://github.com/ceph/ceph/pull/52458), Kamoltat)

- osd/scrub: increasing max_osd_scrubs to 3 ([pr#55174](https://github.com/ceph/ceph/pull/55174), Ronen Friedman)

- osd/SnapMapper: fix \_lookup_purged_snap ([pr#56815](https://github.com/ceph/ceph/pull/56815), Matan Breizman)

- osd/TrackedOp: Fix TrackedOp event order ([pr#59109](https://github.com/ceph/ceph/pull/59109), YiteGu)

- osd: always send returnvec-on-errors for client's retry ([pr#59378](https://github.com/ceph/ceph/pull/59378), Radoslaw Zarzynski)

- osd: avoid watcher remains after "rados watch" is interrupted ([pr#58845](https://github.com/ceph/ceph/pull/58845), weixinwei)

- osd: bring the missed fmt::formatter for snapid_t to address FTBFS ([pr#54175](https://github.com/ceph/ceph/pull/54175), Radosław Zarzyński)

- osd: CEPH_OSD_OP_FLAG_BYPASS_CLEAN_CACHE flag is passed from ECBackend ([pr#57620](https://github.com/ceph/ceph/pull/57620), Md Mahamudur Rahaman Sajib)

- osd: do not assert on fast shutdown timeout ([pr#55134](https://github.com/ceph/ceph/pull/55134), Igor Fedotov)

- osd: don't require RWEXCL lock for stat+write ops ([pr#54594](https://github.com/ceph/ceph/pull/54594), Alice Zhao)

- osd: ensure async recovery does not drop a pg below min_size ([pr#54549](https://github.com/ceph/ceph/pull/54549), Samuel Just)

- osd: fix for segmentation fault on OSD fast shutdown ([pr#57614](https://github.com/ceph/ceph/pull/57614), Md Mahamudur Rahaman Sajib)

- osd: fix use-after-move in build_incremental_map_msg() ([pr#54269](https://github.com/ceph/ceph/pull/54269), Ronen Friedman)

- osd: improve OSD robustness ([pr#54785](https://github.com/ceph/ceph/pull/54785), Igor Fedotov)

- osd: log the number of extents for sparse read ([pr#54605](https://github.com/ceph/ceph/pull/54605), Xiubo Li)

- osd: make \_set_cache_sizes ratio aware of cache_kv_onode_ratio ([pr#55235](https://github.com/ceph/ceph/pull/55235), Raimund Sacherer)

- osd: Report health error if OSD public address is not within subnet ([pr#55698](https://github.com/ceph/ceph/pull/55698), Prashant D)

- override client features ([pr#58227](https://github.com/ceph/ceph/pull/58227), Patrick Donnelly)

- pybind/mgr/devicehealth: replace SMART data if exists for same DATETIME ([pr#54880](https://github.com/ceph/ceph/pull/54880), Patrick Donnelly)

- pybind/mgr/devicehealth: skip legacy objects that cannot be loaded ([pr#56480](https://github.com/ceph/ceph/pull/56480), Patrick Donnelly)

- pybind/mgr/mirroring: drop mon_host from peer_list ([pr#55238](https://github.com/ceph/ceph/pull/55238), Jos Collin)

- pybind/mgr/pg_autoscaler: Cut back osdmap<span></span>.get_pools calls ([pr#54904](https://github.com/ceph/ceph/pull/54904), Kamoltat)

- pybind/mgr/volumes: log mutex locks to help debug deadlocks ([pr#53917](https://github.com/ceph/ceph/pull/53917), Kotresh HR)

- pybind/mgr: disable sqlite3/python autocommit ([pr#57199](https://github.com/ceph/ceph/pull/57199), Patrick Donnelly)

- pybind/mgr: reopen database handle on blocklist ([pr#52461](https://github.com/ceph/ceph/pull/52461), Patrick Donnelly)

- pybind/rbd: don't produce info on errors in aio_mirror_image_get_info() ([pr#54054](https://github.com/ceph/ceph/pull/54054), Ilya Dryomov)

- pybind/rbd: expose CLONE_FORMAT and FLATTEN image options ([pr#57308](https://github.com/ceph/ceph/pull/57308), Ilya Dryomov)

- python-common/drive_group: handle fields outside of 'spec' even when 'spec' is provided ([pr#55962](https://github.com/ceph/ceph/pull/55962), Adam King)

- python-common/drive_selection: fix limit with existing devices ([pr#56085](https://github.com/ceph/ceph/pull/56085), Adam King)

- python-common/drive_selection: lower log level of limit policy message ([pr#55961](https://github.com/ceph/ceph/pull/55961), Adam King)

- python-common: fix osdspec_affinity check ([pr#56084](https://github.com/ceph/ceph/pull/56084), Guillaume Abrioux)

- python-common: handle "anonymous_access: false" in to_json of Grafana spec ([pr#58756](https://github.com/ceph/ceph/pull/58756), Adam King)

- qa/cephadm: testing for extra daemon/container features ([pr#55958](https://github.com/ceph/ceph/pull/55958), Adam King)

- qa/cephfs: add mgr debugging ([pr#56417](https://github.com/ceph/ceph/pull/56417), Patrick Donnelly)

- qa/cephfs: add probabilistic ignorelist for pg_health ([pr#56667](https://github.com/ceph/ceph/pull/56667), Patrick Donnelly)

- qa/cephfs: CephFSTestCase<span></span>.create_client() must keyring ([pr#56837](https://github.com/ceph/ceph/pull/56837), Rishabh Dave)

- qa/cephfs: fix build failure for mdtest project ([pr#53826](https://github.com/ceph/ceph/pull/53826), Rishabh Dave)

- qa/cephfs: fix ior project build failure ([pr#53824](https://github.com/ceph/ceph/pull/53824), Rishabh Dave)

- qa/cephfs: handle non-numeric values for json<span></span>.loads() ([pr#54187](https://github.com/ceph/ceph/pull/54187), Rishabh Dave)

- qa/cephfs: ignorelist clog of MDS_UP_LESS_THAN_MAX ([pr#56404](https://github.com/ceph/ceph/pull/56404), Patrick Donnelly)

- qa/cephfs: no reliance on centos ([pr#59037](https://github.com/ceph/ceph/pull/59037), Venky Shankar)

- qa/cephfs: switch to python3 for centos stream 9 ([pr#53626](https://github.com/ceph/ceph/pull/53626), Xiubo Li)

- qa/distros: backport update from rhel 8<span></span>.4 -> 8<span></span>.6 ([pr#54902](https://github.com/ceph/ceph/pull/54902), David Galloway)

- qa/distros: replace centos 8 references with centos 9 in the rados suite ([pr#58520](https://github.com/ceph/ceph/pull/58520), Laura Flores)

- qa/orch: drop centos 8 and rhel 8<span></span>.6 for orch suite tests ([pr#58769](https://github.com/ceph/ceph/pull/58769), Adam King, Laura Flores, Guillaume Abrioux, Casey Bodley)

- qa/rgw: adapt tests to centos 9 ([pr#58601](https://github.com/ceph/ceph/pull/58601), Mark Kogan, Casey Bodley, Ali Maredia, Yuval Lifshitz)

- qa/rgw: barbican uses branch stable/2023<span></span>.1 ([pr#56818](https://github.com/ceph/ceph/pull/56818), Casey Bodley)

- qa/suites/fs/nfs: use standard health ignorelist ([pr#56393](https://github.com/ceph/ceph/pull/56393), Patrick Donnelly)

- qa/suites/fs: skip check-counters for iogen workload ([pr#58278](https://github.com/ceph/ceph/pull/58278), Ramana Raja)

- qa/suites/krbd: drop pre-single-major and move "layering only" coverage ([pr#57463](https://github.com/ceph/ceph/pull/57463), Ilya Dryomov)

- qa/suites/krbd: stress test for recovering from watch errors for -o exclusive ([pr#58855](https://github.com/ceph/ceph/pull/58855), Ilya Dryomov)

- qa/suites/rados/singleton: add POOL_APP_NOT_ENABLED to ignorelist ([pr#57488](https://github.com/ceph/ceph/pull/57488), Laura Flores)

- qa/suites/rbd/iscsi: enable all supported container hosts ([pr#60087](https://github.com/ceph/ceph/pull/60087), Ilya Dryomov)

- qa/suites/rbd: add test to check rbd_support module recovery ([pr#54292](https://github.com/ceph/ceph/pull/54292), Ramana Raja)

- qa/suites/rbd: override extra_system_packages directly on install task ([pr#57764](https://github.com/ceph/ceph/pull/57764), Ilya Dryomov)

- qa/suites/upgrade/quincy-p2p: run librbd python API tests from quincy tip ([pr#55554](https://github.com/ceph/ceph/pull/55554), Yuri Weinstein)

- qa/suites: add "mon down" log variations to ignorelist ([pr#58762](https://github.com/ceph/ceph/pull/58762), Laura Flores)

- qa/suites: drop --show-reachable=yes from fs:valgrind tests ([pr#59067](https://github.com/ceph/ceph/pull/59067), Jos Collin)

- qa/tasks/ceph_manager<span></span>.py: Rewrite test_pool_min_size ([pr#55882](https://github.com/ceph/ceph/pull/55882), Kamoltat)

- qa/tasks/cephfs/test_misc: switch duration to timeout ([pr#55745](https://github.com/ceph/ceph/pull/55745), Xiubo Li)

- qa/tasks/qemu: Fix OS version comparison ([pr#58169](https://github.com/ceph/ceph/pull/58169), Zack Cerza)

- qa/test_nfs: fix test failure when cluster does not exist ([pr#56753](https://github.com/ceph/ceph/pull/56753), John Mulligan)

- qa/tests: added client-upgrade-quincy-squid tests ([pr#58445](https://github.com/ceph/ceph/pull/58445), Yuri Weinstein)

- qa/workunits/rados: enable crb and install generic package for c9 ([pr#59330](https://github.com/ceph/ceph/pull/59330), Laura Flores)

- qa/workunits/rbd/cli_generic<span></span>.sh: narrow race window when checking that rbd_support module command fails after blocklisting the module's client ([pr#54770](https://github.com/ceph/ceph/pull/54770), Ramana Raja)

- qa/workunits/rbd: avoid caching effects in luks-encryption<span></span>.sh ([pr#58852](https://github.com/ceph/ceph/pull/58852), Ilya Dryomov, Or Ozeri)

- qa/workunits: fix test_dashboard_e2e<span></span>.sh: no spec files found ([pr#53857](https://github.com/ceph/ceph/pull/53857), Nizamudeen A)

- qa: account for rbd_trash object in krbd_data_pool<span></span>.sh + related ceph{,adm} task fixes ([pr#58539](https://github.com/ceph/ceph/pull/58539), Ilya Dryomov)

- qa: add a YAML to ignore MGR_DOWN warning ([pr#57564](https://github.com/ceph/ceph/pull/57564), Dhairya Parmar)

- qa: add diff-continuous and compare-mirror-image tests to rbd and krbd suites respectively ([pr#55929](https://github.com/ceph/ceph/pull/55929), Ramana Raja)

- qa: Add tests to validate synced images on rbd-mirror ([pr#55763](https://github.com/ceph/ceph/pull/55763), Ilya Dryomov, Ramana Raja)

- qa: adjust expected io_opt in krbd_discard_granularity<span></span>.t ([pr#59230](https://github.com/ceph/ceph/pull/59230), Ilya Dryomov)

- qa: assign file system affinity for replaced MDS ([issue#61764](http://tracker.ceph.com/issues/61764), [pr#54038](https://github.com/ceph/ceph/pull/54038), Venky Shankar)

- qa: barbican: restrict python packages with upper-constraints ([pr#59325](https://github.com/ceph/ceph/pull/59325), Tobias Urdin)

- qa: bump up scrub status command timeout ([pr#55916](https://github.com/ceph/ceph/pull/55916), Milind Changire)

- qa: cleanup snapshots before subvolume delete ([pr#58333](https://github.com/ceph/ceph/pull/58333), Milind Changire)

- qa: correct usage of DEBUGFS_META_DIR in dedent ([pr#56166](https://github.com/ceph/ceph/pull/56166), Venky Shankar)

- qa: fix error reporting string in assert_cluster_log ([pr#55392](https://github.com/ceph/ceph/pull/55392), Dhairya Parmar)

- qa: Fix fs/full suite ([pr#55828](https://github.com/ceph/ceph/pull/55828), Kotresh HR)

- qa: fix krbd_msgr_segments and krbd_rxbounce failing on 8<span></span>.stream ([pr#57029](https://github.com/ceph/ceph/pull/57029), Ilya Dryomov)

- qa: fix rank_asok() to handle errors from asok commands ([pr#55301](https://github.com/ceph/ceph/pull/55301), Neeraj Pratap Singh)

- qa: ignore container checkpoint/restore related selinux denials for c… ([issue#67119](http://tracker.ceph.com/issues/67119), [issue#66640](http://tracker.ceph.com/issues/66640), [pr#58807](https://github.com/ceph/ceph/pull/58807), Venky Shankar)

- qa: increase the http postBuffer size and disable sslVerify ([pr#53629](https://github.com/ceph/ceph/pull/53629), Xiubo Li)

- qa: lengthen shutdown timeout for thrashed MDS ([pr#53554](https://github.com/ceph/ceph/pull/53554), Patrick Donnelly)

- qa: move nfs (mgr/nfs) related tests to fs suite ([pr#53907](https://github.com/ceph/ceph/pull/53907), Dhairya Parmar, Venky Shankar)

- qa: remove error string checks and check w/ return value ([pr#55944](https://github.com/ceph/ceph/pull/55944), Venky Shankar)

- qa: remove vstart runner from radosgw_admin task ([pr#55098](https://github.com/ceph/ceph/pull/55098), Ali Maredia)

- qa: run kernel_untar_build with newer tarball ([pr#54712](https://github.com/ceph/ceph/pull/54712), Milind Changire)

- qa: set mds config with `config set` for a particular test ([issue#57087](http://tracker.ceph.com/issues/57087), [pr#56168](https://github.com/ceph/ceph/pull/56168), Venky Shankar)

- qa: unmount clients before damaging the fs ([pr#57526](https://github.com/ceph/ceph/pull/57526), Patrick Donnelly)

- qa: Wait for purge to complete ([pr#53911](https://github.com/ceph/ceph/pull/53911), Kotresh HR)

- rados: Set snappy as default value in ms_osd_compression_algorithm ([pr#57406](https://github.com/ceph/ceph/pull/57406), shreyanshjain7174)

- RadosGW API: incorrect bucket quota in response to HEAD /{bucket}/?usage ([pr#53438](https://github.com/ceph/ceph/pull/53438), shreyanshjain7174)

- radosgw-admin: don't crash on --placement-id without --storage-class ([pr#53473](https://github.com/ceph/ceph/pull/53473), Casey Bodley)

- radosgw-admin: fix segfault on pipe modify without source/dest zone specified ([pr#51257](https://github.com/ceph/ceph/pull/51257), caisan)

- rbd-mirror: clean up stale pool replayers and callouts better ([pr#57305](https://github.com/ceph/ceph/pull/57305), Ilya Dryomov)

- rbd-mirror: use correct ioctx for namespace ([pr#59774](https://github.com/ceph/ceph/pull/59774), N Balachandran)

- rbd-nbd: fix resize of images mapped using netlink ([pr#55317](https://github.com/ceph/ceph/pull/55317), Ramana Raja)

- rbd-nbd: fix stuck with disable request ([pr#54255](https://github.com/ceph/ceph/pull/54255), Prasanna Kumar Kalever)

- rbd: "rbd bench" always writes the same byte ([pr#59500](https://github.com/ceph/ceph/pull/59500), Ilya Dryomov)

- rbd: amend "rbd {group,} rename" and "rbd mirror pool" command descriptions ([pr#59600](https://github.com/ceph/ceph/pull/59600), Ilya Dryomov)

- Revert "exporter: user only counter dump/schema commands for extacting counters" ([pr#54169](https://github.com/ceph/ceph/pull/54169), Casey Bodley)

- Revert "quincy: ceph_fs<span></span>.h: add separate owner\\\_{u,g}id fields" ([pr#54108](https://github.com/ceph/ceph/pull/54108), Venky Shankar)

- RGW - Get quota on OPs with a bucket ([pr#52935](https://github.com/ceph/ceph/pull/52935), Daniel Gryniewicz)

- rgw : fix add initialization for RGWGC::process() ([pr#59338](https://github.com/ceph/ceph/pull/59338), caolei)

- rgw/admin/notifications: support admin operations on topics with tenants ([pr#59322](https://github.com/ceph/ceph/pull/59322), Yuval Lifshitz)

- rgw/amqp: store CA location string in connection object ([pr#54170](https://github.com/ceph/ceph/pull/54170), Yuval Lifshitz)

- rgw/auth/s3: validate x-amz-content-sha256 for empty payloads ([pr#59359](https://github.com/ceph/ceph/pull/59359), Casey Bodley)

- rgw/auth: Add service token support for Keystone auth ([pr#54445](https://github.com/ceph/ceph/pull/54445), Tobias Urdin)

- rgw/auth: Fix the return code returned by AuthStrategy ([pr#54795](https://github.com/ceph/ceph/pull/54795), Pritha Srivastava)

- rgw/auth: ignoring signatures for HTTP OPTIONS calls ([pr#60458](https://github.com/ceph/ceph/pull/60458), Tobias Urdin)

- rgw/beast: Enable SSL session-id reuse speedup mechanism ([pr#56119](https://github.com/ceph/ceph/pull/56119), Mark Kogan)

- rgw/crypt: apply rgw_crypt_default_encryption_key by default ([pr#52795](https://github.com/ceph/ceph/pull/52795), Casey Bodley)

- rgw/iam: admin/system users ignore iam policy parsing errors ([pr#54842](https://github.com/ceph/ceph/pull/54842), Casey Bodley)

- rgw/kafka/amqp: fix race conditionn in async completion handlers ([pr#54737](https://github.com/ceph/ceph/pull/54737), Yuval Lifshitz)

- rgw/kafka: remove potential race condition between creation and deletion of endpoint ([pr#51797](https://github.com/ceph/ceph/pull/51797), Yuval Lifshitz)

- rgw/kafka: set message timeout to 5 seconds ([pr#56163](https://github.com/ceph/ceph/pull/56163), Yuval Lifshitz)

- rgw/keystone: EC2Engine uses reject() for ERR_SIGNATURE_NO_MATCH ([pr#53763](https://github.com/ceph/ceph/pull/53763), Casey Bodley)

- rgw/keystone: use secret key from EC2 for sigv4 streaming mode ([pr#57899](https://github.com/ceph/ceph/pull/57899), Casey Bodley)

- rgw/lua: add lib64 to the package search path ([pr#59342](https://github.com/ceph/ceph/pull/59342), Yuval Lifshitz)

- rgw/lua: fix CopyFrom crash ([pr#59336](https://github.com/ceph/ceph/pull/59336), Yuval Lifshitz)

- rgw/multisite: fix sync_error_trim command ([pr#59347](https://github.com/ceph/ceph/pull/59347), Shilpa Jagannath)

- rgw/notification: Kafka persistent notifications not retried and removed even when the broker is down ([pr#56145](https://github.com/ceph/ceph/pull/56145), kchheda3)

- rgw/notification: remove non x-amz-meta-\* attributes from bucket notifications ([pr#53374](https://github.com/ceph/ceph/pull/53374), Juan Zhu)

- rgw/notifications/test: fix rabbitmq and kafka issues in centos9 ([pr#58313](https://github.com/ceph/ceph/pull/58313), Yuval Lifshitz)

- rgw/notifications: cleanup all coroutines after sending the notification ([pr#59353](https://github.com/ceph/ceph/pull/59353), Yuval Lifshitz)

- rgw/putobj: RadosWriter uses part head object for multipart parts ([pr#55622](https://github.com/ceph/ceph/pull/55622), Casey Bodley)

- rgw/rest: fix url decode of post params for iam/sts/sns ([pr#55357](https://github.com/ceph/ceph/pull/55357), Casey Bodley)

- rgw/rgw-gap-list: refactoring and adding more error checking ([pr#59320](https://github.com/ceph/ceph/pull/59320), Michael J. Kidd)

- rgw/rgw-orphan-list: refactor and add more checks to the tool ([pr#59321](https://github.com/ceph/ceph/pull/59321), Michael J. Kidd)

- rgw/s3: DeleteObjects response uses correct delete_marker flag ([pr#54165](https://github.com/ceph/ceph/pull/54165), Casey Bodley)

- rgw/s3: ListObjectsV2 returns correct object owners ([pr#54162](https://github.com/ceph/ceph/pull/54162), Casey Bodley)

- rgw/sts: AssumeRole no longer writes to user metadata ([pr#52049](https://github.com/ceph/ceph/pull/52049), Casey Bodley)

- rgw/sts: changing identity to boost::none, when role policy ([pr#59345](https://github.com/ceph/ceph/pull/59345), Pritha Srivastava)

- rgw/sts: modify max_session_duration using update role REST API/ radosgw-admin command ([pr#48082](https://github.com/ceph/ceph/pull/48082), Pritha Srivastava)

- RGW/STS: when generating keys, take the trailing null character into account ([pr#54128](https://github.com/ceph/ceph/pull/54128), Oguzhan Ozmen)

- rgw/swift: preserve dashes/underscores in swift user metadata names ([pr#56616](https://github.com/ceph/ceph/pull/56616), Juan Zhu, Ali Maredia)

- rgw: 'bucket check' deletes index of multipart meta when its pending_map is nonempty ([pr#54017](https://github.com/ceph/ceph/pull/54017), Huber-ming)

- rgw: add crypt attrs for iam policy to PostObj and Init/CompleteMultipart ([pr#59344](https://github.com/ceph/ceph/pull/59344), Casey Bodley)

- rgw: add headers to guide cache update in 304 response ([pr#55095](https://github.com/ceph/ceph/pull/55095), Casey Bodley, Ilsoo Byun)

- rgw: Add missing empty checks to the split string in is_string_in_set() ([pr#56348](https://github.com/ceph/ceph/pull/56348), Matt Benjamin)

- rgw: add versioning info to radosgw-admin bucket stats output ([pr#54190](https://github.com/ceph/ceph/pull/54190), J. Eric Ivancich, Cory Snyder)

- rgw: address crash and race in RGWIndexCompletionManager ([pr#50538](https://github.com/ceph/ceph/pull/50538), J. Eric Ivancich)

- RGW: allow user disabling presigned urls in rgw configuration ([pr#56447](https://github.com/ceph/ceph/pull/56447), Marc Singer)

- rgw: avoid use-after-move in RGWDataSyncSingleEntryCR ctor ([pr#59319](https://github.com/ceph/ceph/pull/59319), Casey Bodley)

- rgw: beast frontend checks for local_endpoint() errors ([pr#54166](https://github.com/ceph/ceph/pull/54166), Casey Bodley)

- rgw: catches nobjects_begin() exceptions ([pr#59360](https://github.com/ceph/ceph/pull/59360), lichaochao)

- rgw: cmake configure error on fedora-37/rawhide ([pr#59313](https://github.com/ceph/ceph/pull/59313), Kaleb S. KEITHLEY)

- rgw: CopyObject works with x-amz-copy-source-if-\* headers ([pr#50519](https://github.com/ceph/ceph/pull/50519), Wang Hao)

- rgw: d3n: fix valgrind reported leak related to libaio worker threads ([pr#54851](https://github.com/ceph/ceph/pull/54851), Mark Kogan)

- rgw: disable RGWDataChangesLog::add_entry() when log_data is off ([pr#59314](https://github.com/ceph/ceph/pull/59314), Casey Bodley)

- rgw: do not copy olh attributes in versioning suspended bucket ([pr#55607](https://github.com/ceph/ceph/pull/55607), Juan Zhu)

- rgw: Drain async_processor request queue during shutdown ([pr#53471](https://github.com/ceph/ceph/pull/53471), Soumya Koduri)

- rgw: Erase old storage class attr when the object is rewrited using r… ([pr#50520](https://github.com/ceph/ceph/pull/50520), zhiming zhang)

- rgw: Fix Browser POST content-length-range min value ([pr#52937](https://github.com/ceph/ceph/pull/52937), Robin H. Johnson)

- rgw: fix issue with concurrent versioned deletes leaving behind olh entries ([pr#59357](https://github.com/ceph/ceph/pull/59357), Cory Snyder)

- rgw: fix ListOpenIDConnectProviders XML format ([pr#57131](https://github.com/ceph/ceph/pull/57131), caolei)

- rgw: fix multipart upload object leaks due to re-upload ([pr#51976](https://github.com/ceph/ceph/pull/51976), J. Eric Ivancich, Yixin Jin, Matt Benjamin, Daniel Gryniewicz)

- rgw: fix rgw cache invalidation after unregister_watch() error ([pr#54015](https://github.com/ceph/ceph/pull/54015), lichaochao)

- rgw: Get canonical storage class when storage class is empty in ([pr#59317](https://github.com/ceph/ceph/pull/59317), zhiming zhang)

- rgw: handle old clients with transfer-encoding: chunked ([pr#57133](https://github.com/ceph/ceph/pull/57133), Marcus Watts)

- rgw: invalidate and retry keystone admin token ([pr#59076](https://github.com/ceph/ceph/pull/59076), Tobias Urdin)

- rgw: make incomplete multipart upload part of bucket check efficient ([pr#57405](https://github.com/ceph/ceph/pull/57405), J. Eric Ivancich)

- rgw: modify string match_wildcards with fnmatch ([pr#57907](https://github.com/ceph/ceph/pull/57907), zhipeng li, Adam Emerson)

- rgw: multisite data log flag not used ([pr#52054](https://github.com/ceph/ceph/pull/52054), J. Eric Ivancich)

- rgw: object lock avoids 32-bit truncation of RetainUntilDate ([pr#54675](https://github.com/ceph/ceph/pull/54675), Casey Bodley)

- rgw: remove potentially conficting definition of dout_subsys ([pr#53462](https://github.com/ceph/ceph/pull/53462), J. Eric Ivancich)

- rgw: RGWSI_SysObj_Cache::remove() invalidates after successful delete ([pr#55718](https://github.com/ceph/ceph/pull/55718), Casey Bodley)

- rgw: s3 object lock avoids overflow in retention date ([pr#52606](https://github.com/ceph/ceph/pull/52606), Casey Bodley)

- rgw: set requestPayment in slave zone ([pr#57149](https://github.com/ceph/ceph/pull/57149), Huber-ming)

- rgw: SignatureDoesNotMatch for certain RGW Admin Ops endpoints w/v4 auth ([pr#54792](https://github.com/ceph/ceph/pull/54792), David.Hall)

- RGW: Solving the issue of not populating etag in Multipart upload result ([pr#51446](https://github.com/ceph/ceph/pull/51446), Ali Masarwa)

- rgw: swift: tempurl fixes for ceph ([pr#59355](https://github.com/ceph/ceph/pull/59355), Casey Bodley, Adam Emerson, Marcus Watts)

- rgw: Update "CEPH_RGW_DIR_SUGGEST_LOG_OP" for remove entries ([pr#50539](https://github.com/ceph/ceph/pull/50539), Soumya Koduri)

- rgw: update options yaml file so LDAP uri isn't an invalid example ([pr#56722](https://github.com/ceph/ceph/pull/56722), J. Eric Ivancich)

- rgw: Use STANDARD storage class in objects appending operation when the ([pr#59316](https://github.com/ceph/ceph/pull/59316), zhiming zhang)

- rgw: use unique_ptr for flat_map emplace in BucketTrimWatche ([pr#52995](https://github.com/ceph/ceph/pull/52995), Vedansh Bhartia)

- rgw: when there are a large number of multiparts, the unorder list result may miss objects ([pr#59337](https://github.com/ceph/ceph/pull/59337), J. Eric Ivancich)

- rgwfile: fix lock_guard decl ([pr#59350](https://github.com/ceph/ceph/pull/59350), Matt Benjamin)

- rgwlc: fix compat-decoding of cls_rgw_lc_get_entry_ret ([pr#59312](https://github.com/ceph/ceph/pull/59312), Matt Benjamin)

- rgwlc: permit lifecycle to reduce data conditionally in archive zone ([pr#54873](https://github.com/ceph/ceph/pull/54873), Matt Benjamin)

- run-make-check: use get_processors in run-make-check script ([pr#58871](https://github.com/ceph/ceph/pull/58871), John Mulligan)

- src/ceph-volume/ceph_volume/devices/lvm/listing<span></span>.py : lvm list filters with vg name ([pr#58999](https://github.com/ceph/ceph/pull/58999), Pierre Lemay)

- src/common/options: Correct typo in rgw<span></span>.yaml<span></span>.in ([pr#55446](https://github.com/ceph/ceph/pull/55446), Anthony D'Atri)

- src/mon/Monitor: Fix set_elector_disallowed_leaders ([pr#54004](https://github.com/ceph/ceph/pull/54004), Kamoltat)

- src/mount: kernel mount command returning misleading error message ([pr#55299](https://github.com/ceph/ceph/pull/55299), Neeraj Pratap Singh)

- test/cls_lock: expired lock before unlock and start check ([pr#59272](https://github.com/ceph/ceph/pull/59272), Nitzan Mordechai)

- test/lazy-omap-stats: Convert to boost::regex ([pr#59523](https://github.com/ceph/ceph/pull/59523), Brad Hubbard)

- test/librbd: clean up unused TEST_COOKIE variable ([pr#58548](https://github.com/ceph/ceph/pull/58548), Rongqi Sun)

- test/pybind: replace nose with pytest ([pr#55060](https://github.com/ceph/ceph/pull/55060), Casey Bodley)

- test/rgw/notifications: fix kafka consumer shutdown issue ([pr#59340](https://github.com/ceph/ceph/pull/59340), Yuval Lifshitz)

- test/rgw: increase timeouts in unittest_rgw_dmclock_scheduler ([pr#55789](https://github.com/ceph/ceph/pull/55789), Casey Bodley)

- test/store_test: enforce sync compactions for spillover tests ([pr#59532](https://github.com/ceph/ceph/pull/59532), Igor Fedotov)

- test/store_test: fix deferred writing test cases ([pr#55779](https://github.com/ceph/ceph/pull/55779), Igor Fedotov)

- test/store_test: fix DeferredWrite test when prefer_deferred_size=0 ([pr#56201](https://github.com/ceph/ceph/pull/56201), Igor Fedotov)

- test/store_test: get rid off assert_death ([pr#55775](https://github.com/ceph/ceph/pull/55775), Igor Fedotov)

- test/store_test: refactor spillover tests ([pr#55216](https://github.com/ceph/ceph/pull/55216), Igor Fedotov)

- test: Create ParallelPGMapper object before start threadpool ([pr#58921](https://github.com/ceph/ceph/pull/58921), Mohit Agrawal)

- Test: osd-recovery-space<span></span>.sh extends the wait time for "recovery toofull" ([pr#59042](https://github.com/ceph/ceph/pull/59042), Nitzan Mordechai)

- tools/ceph_objectstore_tool: action_on_all_objects_in_pg to skip pgmeta ([pr#54692](https://github.com/ceph/ceph/pull/54692), Matan Breizman)

- tools/ceph_objectstore_tool: Support get/set/superblock ([pr#55014](https://github.com/ceph/ceph/pull/55014), Matan Breizman)

- Tools/rados: Improve Error Messaging for Object Name Resolution ([pr#55598](https://github.com/ceph/ceph/pull/55598), Nitzan Mordechai)

- tools/rbd: make 'children' command support --image-id ([pr#55618](https://github.com/ceph/ceph/pull/55618), Mykola Golub)

- win32_deps_build<span></span>.sh: change Boost URL ([pr#55085](https://github.com/ceph/ceph/pull/55085), Lucian Petrut)
