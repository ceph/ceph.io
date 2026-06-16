---
title: "v20.2.2 Tentacle released"
date: "2026-06-16"
author: "Yuri Weinstein, Patrick Donnelly"
tags:
  - "release"
  - "tentacle"
---
This is the second minor release in the Tentacle series. 
We recommend that all users update to this release.

Release Date
------------

June 16, 2026

## Notable Changes
---------------

- Rocky 10 package-based installs are now supported starting with v20.2.2. Please see the [supported platforms](https://docs.ceph.com/en/latest/start/os-recommendations/#platforms) for current and planned support in Ceph.


MDS (Metadata Server)
---------------------

- Segmentation fault fixed due to incorrect queueing of request retries.

OSD (Object Storage Daemon)
---------------------------

- PGLog Missed List: Fixed a bug to ensure the correct version is attached to the missing list when ignoring log entries.
- Data Integrity Asserts: Added assertions to explicitly catch potential corruption in the OSD missing list.

RGW (RADOS Gateway)
-------------------

- Lifecycle Management: Fixed lifecycle transition issues affecting encrypted multipart objects.
- REST & Query Handling: RESTArgs::get_string() now properly URL-decodes incoming query parameters.

RADOS / librados / neorados
---------------------------

- Linger Operations: Rewrote safety checks to eliminate use-after-free vulnerabilities and LingerOp memory leaks when an unwatch operation returns ENOTCONN. Replaced the flawed is_valid_watch() check with a safe linger_by_cookie() lookup which safely manages LingerOp references using intrusive_ptr. Ensured librados linger callbacks hold a persistent reference to LingerOp to protect against races with simultaneous linger_cancel() requests. Configured librados::IoCtxImpl::aio_unwatch() to asynchronously deliver ENOTCONN to AioCompletion instead of returning the error directly.
- Watch/Notify: Fixed neorados notification queue bounds enforcement so that an overflow marker is only appended on the first message exceeding capacity, rather than duplicating it on every subsequent message. Prevented double-cleanup triggers in watch/notify operations when incoming errors arrive after maybe_cleanup() runs. Fixed a bug where notify would lose original error values by ensuring it no longer attempts to decode empty responses. Enhanced io_context shutdown procedures to clear handlers and route cleanly through linger_cancel to avoid use-after-free states.
- Async Utilities: Fixed an issue regarding the improper removal of objects from the async service list.

Dashboard
---------

- NVMeoF Revamp: Complete UI overhaul with DHCHAP controller key support, namespace encryption, and secure listeners configuration.
- Pools & RGW: Added stretch cluster validation for pools, fixed RGW restart/stop issues, storage class restrictions, sync policy fixes, and MSR EC Profile support.
- NFS: Toggle visibility for CephFS snapshots, fixed export creation and path value consistency issues.

ceph-volume
-----------

- Inventory Scanning: Enhanced inventory discovery logic to automatically skip RAM disk devices (/dev/ram*).

External Block Device (extblkdev)
---------------------------------

- Plugin Stability: Fixed an assertion failure in the FCM plugin when encountering multivolume devices.

## Changelog

- (tentacle) ceph-volume: backport PRs 67047 and 67240 ([pr#67343](https://github.com/ceph/ceph/pull/67343), Guillaume Abrioux, Parfait Detchenou)

- [tentacle] bluestore, extblkdev: Now plugins can raise health warnings ([pr#68663](https://github.com/ceph/ceph/pull/68663), Adam Kupczyk, Igor Fedotov, Martin Ohmacht)

- Backporting PRs 67236 and 67419 ([pr#67533](https://github.com/ceph/ceph/pull/67533), Adam King)

- Beacon diff + Stretched cluster ([pr#68347](https://github.com/ceph/ceph/pull/68347), Leonid Chernin, Samuel Just)

- ceph-volume: include LVM mapper devices in get\_devices() ([pr#67989](https://github.com/ceph/ceph/pull/67989), Guillaume Abrioux)

- ceph-volume: skip /dev/ram\* devices in inventory ([pr#68552](https://github.com/ceph/ceph/pull/68552), Ujjawal Anand)

- ceph-volume: skip mkfs discard for LVM NVMe OSDs ([pr#68286](https://github.com/ceph/ceph/pull/68286), Ujjawal Anand)

- ceph-volume: skip redundant NVMe mkfs discards ([pr#67341](https://github.com/ceph/ceph/pull/67341), Ujjawal Anand)

- ceph-volume: skip virtual cdrom devices in inventory ([pr#68108](https://github.com/ceph/ceph/pull/68108), Ujjawal Anand)

- ceph<span></span>.spec<span></span>.in: replace golang github prometheus with promtool binary path ([pr#68420](https://github.com/ceph/ceph/pull/68420), Nizamudeen A)

- ceph\_mon: Fix shutdown order to destroy Monitor before closing mon store ([pr#68399](https://github.com/ceph/ceph/pull/68399), Prashant D)

- cephadm: wait for latest osd map after ceph-volume before OSD deploy ([pr#68379](https://github.com/ceph/ceph/pull/68379), Guillaume Abrioux)

- cephfs: MDCache request cleanup ([pr#66469](https://github.com/ceph/ceph/pull/66469), Abhishek Lekshmanan)

- Check if `HTTP\_X\_AMZ\_COPY\_SOURCE` header is empty ([pr#66027](https://github.com/ceph/ceph/pull/66027), Suyash Dongre)

- client: adjust `Fb` cap ref count check during synchronous fsync() ([issue#73624](http://tracker.ceph.com/issues/73624), [pr#65913](https://github.com/ceph/ceph/pull/65913), Venky Shankar)

- client: crash caused by invalid iterator in \_readdir\_cache\_cb ([pr#65957](https://github.com/ceph/ceph/pull/65957), Zhansong Gao)

- container/build<span></span>.sh: add 'rocky-10' suffix if necessary ([pr#67895](https://github.com/ceph/ceph/pull/67895), Dan Mick)

- container/build<span></span>.sh: FROM\_IMAGE=rockylinux-10 default for >=tentacle backports ([pr#67960](https://github.com/ceph/ceph/pull/67960), Matan Breizman, David Galloway, John Mulligan, Dan Mick)

- debian: package mgr/smb in ceph-mgr-modules-core ([pr#67510](https://github.com/ceph/ceph/pull/67510), Roland Sommer)

- debian: remove invoke-rc<span></span>.d calls from postrm scripts ([pr#67354](https://github.com/ceph/ceph/pull/67354), Kefu Chai)

- debian: remove stale distutils override from py3dist-overrides ([pr#68276](https://github.com/ceph/ceph/pull/68276), Thomas Lamprecht, Max R. Carrara, Kefu Chai)

- doc: Batch backport for start/hardware-recommendations<span></span>.rst ([pr#67907](https://github.com/ceph/ceph/pull/67907), Anthony D'Atri, Marc Methot, Pierre Riteau, Ville Ojamo)

- extblkdev: Fix FCM plugin asserting on multivolume devices ([pr#68877](https://github.com/ceph/ceph/pull/68877), Adam Kupczyk)

- found duplicate series for the match group {fs\_id="-1"} ([pr#68369](https://github.com/ceph/ceph/pull/68369), bst2002git)

- Implement Admin REST APIs for Setting Account Quota ([pr#66905](https://github.com/ceph/ceph/pull/66905), Nicholas Liu, Jiffin Tony Thottan)

- kv/RocksDB: Add instrumentation to BinnedLRUCache ([pr#67349](https://github.com/ceph/ceph/pull/67349), Adam Kupczyk)

- libcephsqlite: ensure atexit handlers are registered after openssl ([pr#68263](https://github.com/ceph/ceph/pull/68263), Patrick Donnelly)

- librbd/cache/pwl: WriteLogOperationSet::cell can be garbage ([pr#67705](https://github.com/ceph/ceph/pull/67705), Ilya Dryomov)

- librbd/migration/QCOWFormat: avoid use-after-free in execute\_request() ([pr#68188](https://github.com/ceph/ceph/pull/68188), Ilya Dryomov)

- librbd/mirror: detect trashed snapshots in UnlinkPeerRequest ([pr#67583](https://github.com/ceph/ceph/pull/67583), Ilya Dryomov)

- librbd: avoid losing sparseness in read\_parent() ([pr#68463](https://github.com/ceph/ceph/pull/68463), Ilya Dryomov)

- librbd: don't complete ImageUpdateWatchers::shut\_down() prematurely ([pr#67581](https://github.com/ceph/ceph/pull/67581), Ilya Dryomov)

- librbd: rbd\_aio\_write\_with\_crc32c ([pr#68038](https://github.com/ceph/ceph/pull/68038), Alexander Indenbaum)

- mds: add ref counting to LogSegment ([pr#68439](https://github.com/ceph/ceph/pull/68439), Milind Changire)

- mds: add retry request to MDSRank wait queue rather via finisher ([issue#76031](http://tracker.ceph.com/issues/76031), [pr#68905](https://github.com/ceph/ceph/pull/68905), Venky Shankar)

- mds: scrub pins more inodes than the mds\_cache\_memory\_limit ([pr#67808](https://github.com/ceph/ceph/pull/67808), Md Mahamudur Rahaman Sajib)

- mds: use SimpleLock::WAIT\_ALL for wait mask ([pr#68313](https://github.com/ceph/ceph/pull/68313), Patrick Donnelly)

- mgr/cephadm: Add KMIP server support for NVMeoF gateway ([pr#68086](https://github.com/ceph/ceph/pull/68086), Gil Bregman)

- mgr/cephadm: add rbd\_with\_crc32c parameter to nvmeof service spec ([pr#66933](https://github.com/ceph/ceph/pull/66933), Alexander Indenbaum)

- mgr/cephadm: fix mgmt-gateway startup on IPv6 VIP ([pr#68387](https://github.com/ceph/ceph/pull/68387), Kobi Ginon)

- mgr/cephadm: include cluster FSID in root CA Common Name (CN) ([pr#64692](https://github.com/ceph/ceph/pull/64692), Redouane Kachach, Kushal Deb)

- mgr/cephadm: serialize OSD class before returning for OSD rm status ([pr#69226](https://github.com/ceph/ceph/pull/69226), Adam King)

- mgr/DaemonServer: Implement ok-to-upgrade command ([pr#66948](https://github.com/ceph/ceph/pull/66948), Sridhar Seshasayee)

- mgr/DaemonServer: Limit search for OSDs to upgrade within the crush bucket ([pr#68350](https://github.com/ceph/ceph/pull/68350), Sridhar Seshasayee)

- mgr/dashboard : Add bottom padding for dashboard screens ([pr#68523](https://github.com/ceph/ceph/pull/68523), Abhishek Desai)

- mgr/dashboard : add stretch cluster validation for pools form ([pr#68476](https://github.com/ceph/ceph/pull/68476), Afreen Misbah, Abhishek Desai)

- mgr/dashboard : Fix RGW restart/stop issue ([pr#68554](https://github.com/ceph/ceph/pull/68554), Abhishek Desai)

- mgr/dashboard : fix-non-versioning-bucket-issue ([pr#68520](https://github.com/ceph/ceph/pull/68520), Abhishek Desai)

- mgr/dashboard : Fixes EC profile used pool empty ([pr#68730](https://github.com/ceph/ceph/pull/68730), Abhishek Desai)

- mgr/dashboard : Restrict create storage class with existing name ([pr#68475](https://github.com/ceph/ceph/pull/68475), Abhishek Desai)

- mgr/dashboard: [RGW-NFS]: User level export creation via UI fails with 500 - Internal Server Error ([pr#67013](https://github.com/ceph/ceph/pull/67013), Dnyaneshwari Talwekar)

- mgr/dashboard: [snap-visibility]Edit Client config option remains stuck in loading when nfs user is configured ([pr#68542](https://github.com/ceph/ceph/pull/68542), Dnyaneshwari Talwekar)

- mgr/dashboard: [storage-class]: Deleting local storage class from UI does not remove its entry from zone ([pr#67949](https://github.com/ceph/ceph/pull/67949), Dnyaneshwari Talwekar)

- mgr/dashboard: Add DHCHAP controller key to NVME host commands ([pr#67600](https://github.com/ceph/ceph/pull/67600), Gil Bregman)

- mgr/dashboard: add helper text to bucket form > policy and other spacing fixes ([pr#67871](https://github.com/ceph/ceph/pull/67871), Naman Munet)

- mgr/dashboard: Add location to gateway info command in NVMeoF CLI ([pr#68345](https://github.com/ceph/ceph/pull/68345), Gil Bregman)

- mgr/dashboard: Add namespace encryption support to NVMeoF CLI ([pr#68339](https://github.com/ceph/ceph/pull/68339), Gil Bregman)

- mgr/dashboard: Add nvmeof\_top\_cli service ([pr#67566](https://github.com/ceph/ceph/pull/67566), Vallari Agrawal)

- mgr/dashboard: Add option to edit zone with keys/ ([pr#68317](https://github.com/ceph/ceph/pull/68317), Aashish Sharma)

- mgr/dashboard: Add option to set motd via api ([pr#68678](https://github.com/ceph/ceph/pull/68678), Aashish Sharma)

- mgr/dashboard: Add overview page ([pr#67840](https://github.com/ceph/ceph/pull/67840), Afreen Misbah, Devika Babrekar, Aashish Sharma, Abhishek Desai, Naman Munet, Nizamudeen A)

- mgr/dashboard: Add port and secure-listeners to subsystem add NVMeoF CLI command ([pr#68370](https://github.com/ceph/ceph/pull/68370), Vallari Agrawal, Gil Bregman)

- mgr/dashboard: Add restore events in notification screen ([pr#67912](https://github.com/ceph/ceph/pull/67912), pujashahu, pujaoshahu)

- mgr/dashboard: Add secure and verify-host-name to "listener add" on NVMeoF CLI ([pr#67799](https://github.com/ceph/ceph/pull/67799), Gil Bregman)

- mgr/dashboard: Adding rados ns option into add\_ns\_req ([pr#67470](https://github.com/ceph/ceph/pull/67470), gadi-didi)

- mgr/dashboard: Allow empty port value when adding a listener in NVMEoF CLI ([pr#68766](https://github.com/ceph/ceph/pull/68766), Gil Bregman)

- mgr/dashboard: Batch backport nvmeof revamp ([pr#67839](https://github.com/ceph/ceph/pull/67839), Afreen Misbah, Nizamudeen A, Sagar Gopale, pujaoshahu, Puja Shahu, Ville Ojamo)

- mgr/dashboard: Bump lodash ([pr#68695](https://github.com/ceph/ceph/pull/68695), Afreen Misbah)

- mgr/dashboard: bump nvmeof submodule to 1<span></span>.6<span></span>.5 ([pr#67326](https://github.com/ceph/ceph/pull/67326), Vallari Agrawal, Tomer Haskalovitch)

- mgr/dashboard: carbonize-osd-flags-modal ([pr#68133](https://github.com/ceph/ceph/pull/68133), Afreen Misbah, Sagar Gopale)

- mgr/dashboard: Difference in "path" value observed when rgw user level export created via dashboard vs cli ([pr#68583](https://github.com/ceph/ceph/pull/68583), Dnyaneshwari Talwekar)

- mgr/dashboard: fix subvolume group corruption from smb share form ([pr#68103](https://github.com/ceph/ceph/pull/68103), Nizamudeen A)

- mgr/dashboard: Fix tags in subvolume list and subvolume groups list ([pr#68382](https://github.com/ceph/ceph/pull/68382), pujaoshahu)

- mgr/dashboard: Making 'ISA' as default plugin for EC profiles created through dashboard ([pr#68373](https://github.com/ceph/ceph/pull/68373), Devika Babrekar)

- mgr/dashboard: mgr/dashboard: Carbonize Realm Name and Token block in Multi-site Replication Wizard ([pr#68546](https://github.com/ceph/ceph/pull/68546), Sagar Gopale)

- mgr/dashboard: Misleading warning when no eligible devices are available for OSD creation ([pr#67637](https://github.com/ceph/ceph/pull/67637), Naman Munet)

- mgr/dashboard: nfs export creation fails with obj deserialization ([pr#67564](https://github.com/ceph/ceph/pull/67564), Nizamudeen A)

- mgr/dashboard: NFS: Toggle visibility of CephFS snapshots ([pr#67636](https://github.com/ceph/ceph/pull/67636), Afreen Misbah, Dnyaneshwari Talwekar)

- mgr/dashboard: Option to select archive option while Import Multi-site Token ([pr#68513](https://github.com/ceph/ceph/pull/68513), Aashish Sharma)

- mgr/dashboard: remove sync\_from entry when sync\_from\_all is true ([pr#68536](https://github.com/ceph/ceph/pull/68536), Aashish Sharma)

- mgr/dashboard: Rename Alert breadcrumb to Alert Rules ([pr#68238](https://github.com/ceph/ceph/pull/68238), Sagar Gopale)

- mgr/dashboard: sync policy created for a bucket in Object >> Multi-site >> Sync-policy, is not reflecting under bucket's replication ([pr#68512](https://github.com/ceph/ceph/pull/68512), Naman Munet)

- mgr/dashboard:Adding MSR EC Profile via dashboard ([pr#68349](https://github.com/ceph/ceph/pull/68349), Devika Babrekar)

- mgr/smb: fix error handling for fundamental resource parsing ([pr#65861](https://github.com/ceph/ceph/pull/65861), John Mulligan)

- mgr/test\_orchestrator: fixing daemon\_action method signature ([pr#69231](https://github.com/ceph/ceph/pull/69231), Redouane Kachach)

- mgr: add config to load modules in main interpreter instead of subinterpreter ([pr#67515](https://github.com/ceph/ceph/pull/67515), Nitzan Mordhai, Nitzan Mordechai, Samuel Just)

- mgr: ensure that all modules have started before advertising active mgr ([pr#67850](https://github.com/ceph/ceph/pull/67850), Laura Flores)

- mgr: fix continous smb MgrDBNotReady ([pr#68598](https://github.com/ceph/ceph/pull/68598), Pedro Gonzalez Gomez)

- mgr: fix PyObject\* refcounting in TTLCache and cleanup logic ([pr#66482](https://github.com/ceph/ceph/pull/66482), Nitzan Mordechai)

- mgr: guard close_section calls in get_perf_schema_python ([pr#69436](https://github.com/ceph/ceph/pull/69436), Lumir Sliva)

- mgr: isolated CherryPy to prevent global state sharing ([pr#67465](https://github.com/ceph/ceph/pull/67465), Nizamudeen A, Anmol Babu)

- mon [stretch-mode]: Allow a max bucket weight diff threshold ([pr#67790](https://github.com/ceph/ceph/pull/67790), Kamoltat Sirivadhna, Kamoltat (Junior) Sirivadhna)

- mon/AuthMonitor: add osd w cap for superuser client ([pr#68314](https://github.com/ceph/ceph/pull/68314), Venky Shankar, Patrick Donnelly)

- monitoring: Fix application overview to show Raw used ([pr#68794](https://github.com/ceph/ceph/pull/68794), Ankush Behl)

- mr/dashboard: remove rgw\_servers filter from radosgw-sync-overview grafana dashboard ([pr#68604](https://github.com/ceph/ceph/pull/68604), Aashish Sharma)

- neorados: Fix Neorados CephContext leak ([pr#67513](https://github.com/ceph/ceph/pull/67513), Adam C. Emerson)

- neorados: specify alignments for aligned\_storage ([pr#67512](https://github.com/ceph/ceph/pull/67512), Casey Bodley)

- neorados: Various Fixes to Watch/Notify ([pr#68776](https://github.com/ceph/ceph/pull/68776), Adam C. Emerson, Casey Bodley)

- node-proxy: major refactor and various fixes ([pr#67418](https://github.com/ceph/ceph/pull/67418), Guillaume Abrioux)

- nvmeof: Change the NVMEOF image version to 1<span></span>.6 ([pr#68415](https://github.com/ceph/ceph/pull/68415), Gil Bregman)

- nvmeofgw: fix issue of delete all gws from the pool/group ([pr#67942](https://github.com/ceph/ceph/pull/67942), Leonid Chernin)

- orch/cephadm: fix osd<span></span>.default creation ([pr#68121](https://github.com/ceph/ceph/pull/68121), Guillaume Abrioux)

- os/bluestore: track compression\\_\*blob\_size\* parameters for online update ([pr#67888](https://github.com/ceph/ceph/pull/67888), Igor Fedotov)

- os/bluestore:fix bluestore\_volume\_selection\_reserved\_factor usage ([pr#66837](https://github.com/ceph/ceph/pull/66837), Igor Fedotov)

- osd/scrub: support an operator-abort command ([pr#67031](https://github.com/ceph/ceph/pull/67031), Ronen Friedman)

- osd: add pg-upmap-primary to clean\_pg\_upmaps ([pr#67407](https://github.com/ceph/ceph/pull/67407), Laura Flores)

- osd: Allow multiple objects with same version in missing list ([pr#69450](https://github.com/ceph/ceph/pull/69450), Alex Ainscow)

- osd: Avoid assertion on empty object read when reading multiple objects ([pr#68714](https://github.com/ceph/ceph/pull/68714), Alex Ainscow)

- osd: Avoid pwlc spanning intervals ([pr#68708](https://github.com/ceph/ceph/pull/68708), Bill Scales)

- osd: Change rmissing map key from version\_t to eversion\_t ([pr#68716](https://github.com/ceph/ceph/pull/68716), Alex Ainscow)

- osd: Deleting PG should discard pwlc ([pr#68709](https://github.com/ceph/ceph/pull/68709), Bill Scales)

- osd: FastEC: always update pwlc epoch when activating ([pr#68710](https://github.com/ceph/ceph/pull/68710), Bill Scales)

- osd: Fix bug when calculating min\_peer\_features ([pr#69159](https://github.com/ceph/ceph/pull/69159), Bill Scales)

- osd: Fix incorrect rollback logic for partial write OI ([pr#68715](https://github.com/ceph/ceph/pull/68715), Alex Ainscow)

- osd: PGLog Attach correct version to missing list when ignoring log entries ([pr#68718](https://github.com/ceph/ceph/pull/68718), Alex Ainscow)

- osd: Twiddle should create a full sized vector for optimized EC ([pr#68717](https://github.com/ceph/ceph/pull/68717), Alex Ainscow)

- pybind/mgr: call new \_ceph\_exit for killpoints ([pr#68518](https://github.com/ceph/ceph/pull/68518), Patrick Donnelly)

- pybind/mgr: update modules to use independent CLICommand subtypes with distinct COMMAND attributes ([pr#67511](https://github.com/ceph/ceph/pull/67511), Kefu Chai, Samuel Just)

- qa/cephadm: derive container image from cephadm release ([pr#68328](https://github.com/ceph/ceph/pull/68328), Lumir Sliva)

- qa/cephfs: lua to respect missing kernel in yaml ([pr#67293](https://github.com/ceph/ceph/pull/67293), Kyr Shatskyy)

- qa/cephfs: treat "implicit declaration of function" for blogbench workunit for newer gcc version ([issue#75380](http://tracker.ceph.com/issues/75380), [pr#68820](https://github.com/ceph/ceph/pull/68820), Venky Shankar)

- qa/distros: add rocky 10<span></span>.0 as supported distro/container host ([pr#68569](https://github.com/ceph/ceph/pull/68569), Patrick Donnelly, Casey Bodley, Adam King, David Galloway)

- qa/radosgw\_admin: replace boto2 with boto3 ([pr#68739](https://github.com/ceph/ceph/pull/68739), Adam C. Emerson, Casey Bodley)

- qa/rgw/multisite: remove duplicate test\_suspended\_delete\_marker\_incremental\_sync ([pr#68846](https://github.com/ceph/ceph/pull/68846), Oguzhan Ozmen)

- qa/rgw/upgrade: symlinks are explicit about distro versions ([pr#68057](https://github.com/ceph/ceph/pull/68057), Casey Bodley)

- qa/rgw: Revive crypt kmip ([pr#68371](https://github.com/ceph/ceph/pull/68371), Kyr Shatskyy)

- qa/suites/fs: fix extraneous distro links ([pr#69251](https://github.com/ceph/ceph/pull/69251), Patrick Donnelly)

- qa/suites/upgrade: ignore osd in unknown state ([pr#69307](https://github.com/ceph/ceph/pull/69307), Patrick Donnelly)

- qa/suites/upgrade: ignore undersized PG during stress splits ([pr#69310](https://github.com/ceph/ceph/pull/69310), Patrick Donnelly)

- qa/suites/upgrade: update upgrade paths and exclude rocky10 from non-supported distros ([pr#68660](https://github.com/ceph/ceph/pull/68660), Yaarit Hatuka, Laura Flores)

- qa/suites: remove centos restriction from valgrind yaml ([issue#18126](http://tracker.ceph.com/issues/18126), [issue#20360](http://tracker.ceph.com/issues/20360), [pr#67519](https://github.com/ceph/ceph/pull/67519), Samuel Just)

- qa/suites: use tagged version of reef ([pr#68357](https://github.com/ceph/ceph/pull/68357), Laura Flores)

- qa/tasks/backfill\_toofull<span></span>.py: Fix assert failures with & without compression ([pr#68118](https://github.com/ceph/ceph/pull/68118), Sridhar Seshasayee)

- qa/tasks/keystone: upgrade keystone to 2025<span></span>.2 ([pr#67757](https://github.com/ceph/ceph/pull/67757), Kyr Shatskyy)

- qa/tasks/quiescer: remove racy assertion ([pr#68510](https://github.com/ceph/ceph/pull/68510), Patrick Donnelly)

- qa/tasks: capture CommandCrashedError when running nvme list cmd ([pr#69232](https://github.com/ceph/ceph/pull/69232), Redouane Kachach)

- qa/tasks: make rbd\_mirror\_thrash inherit from ThrasherGreenlet ([pr#67795](https://github.com/ceph/ceph/pull/67795), Ilya Dryomov)

- qa/tasks: update egrep to 'grep -E' ([pr#67518](https://github.com/ceph/ceph/pull/67518), Nitzan Mordechai, Samuel Just)

- qa/workunits/ceph-helpers-root: Add Rocky support for install packages ([pr#67507](https://github.com/ceph/ceph/pull/67507), Nitzan Mordechai)

- qa/workunits/rbd: drop racy assert in test\_tasks\_recovery() ([pr#68190](https://github.com/ceph/ceph/pull/68190), Ilya Dryomov)

- qa/workunits: Add updated kernel archive URL ([pr#68169](https://github.com/ceph/ceph/pull/68169), Brad Hubbard)

- qa: add 'refresh' config to cephadm<span></span>.wait\_for\_service ([pr#67038](https://github.com/ceph/ceph/pull/67038), Vallari Agrawal)

- qa: add MDS\_INSUFFICIENT\_STANDBY to ignorelist ([pr#69036](https://github.com/ceph/ceph/pull/69036), Patrick Donnelly)

- qa: Add nvmeof upgrade from v20<span></span>.2<span></span>.0 ([pr#68149](https://github.com/ceph/ceph/pull/68149), Vallari Agrawal)

- qa: allow multiple mgr sessions during eviction test ([pr#68316](https://github.com/ceph/ceph/pull/68316), Patrick Donnelly)

- qa: cephfs suite changes for rocky ([pr#68374](https://github.com/ceph/ceph/pull/68374), Patrick Donnelly)

- qa: Fix coredumps caused by udisks ([pr#67526](https://github.com/ceph/ceph/pull/67526), Vallari Agrawal)

- qa: Fix nvmeof 'errors during thrashing' ([pr#68148](https://github.com/ceph/ceph/pull/68148), Vallari Agrawal)

- qa: fix setting rbd\_sparse\_read\_threshold\_bytes in test\_migration\_clone() ([pr#68617](https://github.com/ceph/ceph/pull/68617), Ilya Dryomov)

- qa: fix TypeError in delay ([pr#67617](https://github.com/ceph/ceph/pull/67617), Jos Collin)

- qa: fixing cephadm mgmt-gateway test to remove openssl dependency ([pr#67820](https://github.com/ceph/ceph/pull/67820), Redouane Kachach)

- qa: ignore cephadm failed daemon warnings during thrashing ([pr#69309](https://github.com/ceph/ceph/pull/69309), Patrick Donnelly)

- qa: ignore POOL\_FULL for rbd tests exercising full pools ([pr#69304](https://github.com/ceph/ceph/pull/69304), Patrick Donnelly)

- qa: install nvme-cli only if distro remains rocky10 ([pr#69252](https://github.com/ceph/ceph/pull/69252), Patrick Donnelly)

- qa: krbd\_rxbounce<span></span>.sh: do more reads to generate more errors ([pr#67455](https://github.com/ceph/ceph/pull/67455), Ilya Dryomov)

- qa: Leak\_StillReachable RocksDB error\_handler ([pr#68524](https://github.com/ceph/ceph/pull/68524), Nitzan Mordechai)

- qa: rbd\_mirror\_fsx\_compare<span></span>.sh doesn't error out as expected ([pr#67797](https://github.com/ceph/ceph/pull/67797), Ilya Dryomov)

- qa: Remove cephadm e2e tests from teuthology ([pr#68818](https://github.com/ceph/ceph/pull/68818), Afreen Misbah)

- qa: resolve py3<span></span>.12 regression for random<span></span>.sample ([pr#68315](https://github.com/ceph/ceph/pull/68315), Patrick Donnelly)

- qa: suppress false positive delete map mismatch errors ([pr#68431](https://github.com/ceph/ceph/pull/68431), Casey Bodley, Nitzan Mordechai)

- qa: suppress MismatchedFree operator delete RocksDB ([pr#67508](https://github.com/ceph/ceph/pull/67508), Nitzan Mordechai)

- rgw/beast: use strand executor for timeout timer to prevent concurrent socket access ([pr#68506](https://github.com/ceph/ceph/pull/68506), Oguzhan Ozmen)

- rgw/lc: Do not delete DM if its at end of pagination list ([pr#67573](https://github.com/ceph/ceph/pull/67573), kchheda3)

- rgw/multisite: check the local bucket's versioning status when replicating deletion from remote ([pr#66168](https://github.com/ceph/ceph/pull/66168), Jane Zhu)

- RGW/multisite: fix bucket-full-sync infinite loop caused by stale bucket\_list\_result reuse ([pr#67923](https://github.com/ceph/ceph/pull/67923), Oguzhan Ozmen)

- RGW/Multisite: fix uninitialized LatencyMonitor causing spurious "OSD cluster is overloaded" warning ([pr#68803](https://github.com/ceph/ceph/pull/68803), Oguzhan Ozmen)

- rgw/s3: Always include x-amz-content-sha256 header in AWS v4 signatures ([pr#66358](https://github.com/ceph/ceph/pull/66358), Shilpa Jagannath, Matthew N. Heler)

- rgw/tests: add os-specific java 1<span></span>.7 install commands to keycloak task ([pr#67982](https://github.com/ceph/ceph/pull/67982), J. Eric Ivancich)

- rgw/website: preserve nameservers for future use in dnsmasq ([pr#67061](https://github.com/ceph/ceph/pull/67061), Kyr Shatskyy)

- rgw/zone: remove duplicated startup logic in RGWSI\_Zone ([pr#66300](https://github.com/ceph/ceph/pull/66300), Casey Bodley)

- rgw: bucket logging fixes ([pr#66769](https://github.com/ceph/ceph/pull/66769), Nithya Balachandran, N Balachandran, Yuval Lifshitz, Casey Bodley)

- RGW: Change prerequest hook to run after authorization process ([pr#68594](https://github.com/ceph/ceph/pull/68594), Emin Sunacoglu)

- rgw: discard olh\\_ attributes when copying object from a versioning-suspended bucket to a versioning-disabled bucket ([pr#65557](https://github.com/ceph/ceph/pull/65557), Jane Zhu)

- rgw: fix 'bucket stats' when bucket index doesn't exist ([pr#68505](https://github.com/ceph/ceph/pull/68505), Casey Bodley)

- rgw: fix lifecycle transition of encrypted multipart objects ([pr#68826](https://github.com/ceph/ceph/pull/68826), Marcus Watts)

- rgw: handle plain-text object tags in RGWObjTags::decode() ([pr#67927](https://github.com/ceph/ceph/pull/67927), Oguzhan Ozmen)

- rgw: java s3-tests change setting of JAVA\_HOME ([pr#68226](https://github.com/ceph/ceph/pull/68226), J. Eric Ivancich)

- rgw: read\_obj\_policy() consults s3:prefix when deciding between 403/404 ([pr#68651](https://github.com/ceph/ceph/pull/68651), Casey Bodley)

- RGW: remove custom copy constructor for RGWObjectCtx and enforce no copy/move ([pr#67440](https://github.com/ceph/ceph/pull/67440), Oguzhan Ozmen)

- src/ceph-volume: fast device unavailable as error ([pr#67916](https://github.com/ceph/ceph/pull/67916), Timothy Q Nguyen)

- test/rgw/kafka: fix kafka relase to more recent one ([pr#67993](https://github.com/ceph/ceph/pull/67993), Yuval Lifshitz)

- test/rgw/lua: ignore hours for zero mtime ([pr#67468](https://github.com/ceph/ceph/pull/67468), Kyr Shatskyy)

- test/rgw/notification: do not use netstat in the code ([pr#68142](https://github.com/ceph/ceph/pull/68142), Yuval Lifshitz)

- test/rgw/notification: fix the cloudevents package version ([pr#68704](https://github.com/ceph/ceph/pull/68704), Yuval Lifshitz, Adam C. Emerson)

- test/rgw: remove depracated boto dependency ([pr#68344](https://github.com/ceph/ceph/pull/68344), Yuval Lifshitz)

- test: use json\_extract instead of awkward json\_tree ([pr#67321](https://github.com/ceph/ceph/pull/67321), Patrick Donnelly)

- This change introduces the shared memory communication (SMC-D) for the cluster network ([pr#68254](https://github.com/ceph/ceph/pull/68254), Aliaksei Makarau)

- tools/ceph-kvstore-tool: fix crash on db close ([pr#68406](https://github.com/ceph/ceph/pull/68406), Igor Fedotov, Max Kellermann)

- upgrade suites update for Rocky10 and missing centos ([pr#68733](https://github.com/ceph/ceph/pull/68733), Nitzan Mordechai)
