---
title: "v15.2.8 Octopus released"
date: "2020-12-17"
author: "dgalloway"
tags:
  - "release"
  - "octopus"
---

This is the 8th backport release in the Octopus series. This release fixes a security flaw in CephFS and includes a number of bug fixes. We recommend users to update to this release.

## Notable Changes

- CVE-2020-27781 : OpenStack Manila use of ceph\_volume\_client.py library allowed tenant access to any Ceph credential's secret. (Kotresh Hiremath Ravishankar, Ramana Raja)
    
- ceph-volume: The `lvm batch` subcommand received a major rewrite. This closed a number of bugs and improves usability in terms of size specification and calculation, as well as idempotency behaviour and disk replacement process. Please refer to [https://docs.ceph.com/en/latest/ceph-volume/lvm/batch/](https://docs.ceph.com/en/latest/ceph-volume/lvm/batch/) for more detailed information.
    
- MON: The cluster log now logs health detail every `mon_health_to_clog_interval`, which has been changed from 1hr to 10min. Logging of health detail will be skipped if there is no change in health summary since last known.
    
- The `ceph df` command now lists the number of pgs in each pool.
    
- The `bluefs_preextend_wal_files` option has been removed.
    
- It is now possible to specify the initial monitor to contact for Ceph tools and daemons using the `mon_host_override` config option or `--mon-host-override` command-line switch. This generally should only be used for debugging and only affects initial communication with Ceph's monitor cluster.
    

## Changelog

- pybind/cephvolumeclient: disallow authorize on existing auth ids (Kotresh Hiremath Ravishankar, Ramana Raja)

- Enable per-RBD image monitoring ([pr#37697](https://github.com/ceph/ceph/pull/37697), Patrick Seidensal)

- \[ceph-volume\]: remove unneeded call to getdevices() ([pr#37412](https://github.com/ceph/ceph/pull/37412), Marc Gariepy)

- bluestore: fix collectionlist ordering ([pr#37048](https://github.com/ceph/ceph/pull/37048), Mykola Golub)

- bluestore: mempool's finer granularity + adding missed structs ([pr#37264](https://github.com/ceph/ceph/pull/37264), Deepika Upadhyay, Igor Fedotov, Adam Kupczyk)

- bluestore: remove preextended WAL support ([pr#37373](https://github.com/ceph/ceph/pull/37373), Igor Fedotov)

- ceph-volume batch: reject partitions in argparser ([pr#38280](https://github.com/ceph/ceph/pull/38280), Jan Fajerski)

- ceph-volume inventory: make libstoragemgmt data retrieval optional ([pr#38299](https://github.com/ceph/ceph/pull/38299), Jan Fajerski)

- ceph-volume: add libstoragemgmt support ([pr#36852](https://github.com/ceph/ceph/pull/36852), Paul Cuzner, Satoru Takeuchi)

- ceph-volume: add no-systemd argument to zap ([pr#37722](https://github.com/ceph/ceph/pull/37722), wanghongxu)

- ceph-volume: avoid format strings for now ([pr#37345](https://github.com/ceph/ceph/pull/37345), Jan Fajerski)

- ceph-volume: consume mount opt in simple activate ([pr#38014](https://github.com/ceph/ceph/pull/38014), Dimitri Savineau)

- ceph-volume: fix filestore/dmcrypt activate ([pr#38199](https://github.com/ceph/ceph/pull/38199), Guillaume Abrioux)

- ceph-volume: fix journal size argument not work ([pr#37344](https://github.com/ceph/ceph/pull/37344), wanghongxu)

- ceph-volume: fix lvm batch auto with full SSDs ([pr#38045](https://github.com/ceph/ceph/pull/38045), Dimitri Savineau, Guillaume Abrioux)

- ceph-volume: fix simple activate when legacy osd ([pr#37194](https://github.com/ceph/ceph/pull/37194), Guillaume Abrioux)

- ceph-volume: implement the --log-level flag ([pr#38426](https://github.com/ceph/ceph/pull/38426), Andrew Schoen)

- ceph-volume: major batch refactor ([pr#37520](https://github.com/ceph/ceph/pull/37520), Jan Fajerski, Joshua Schmid)

- ceph-volume: prepare: use \\\*-slots arguments for implicit sizing ([pr#38205](https://github.com/ceph/ceph/pull/38205), Jan Fajerski)

- ceph-volume: remove mention of dmcache from docs and help text ([pr#38047](https://github.com/ceph/ceph/pull/38047), Dimitri Savineau, Andrew Schoen)

- ceph-volume: retry when acquiring lock fails ([pr#36925](https://github.com/ceph/ceph/pull/36925), Sébastien Han)

- ceph-volume: simple scan should ignore tmpfs ([pr#36953](https://github.com/ceph/ceph/pull/36953), Andrew Schoen)

- ceph-volume: support for mpath devices ([pr#36928](https://github.com/ceph/ceph/pull/36928), Jan Fajerski)

- ceph.in: ignore failures to flush stdout ([pr#37225](https://github.com/ceph/ceph/pull/37225), Dan van der Ster)

- ceph.spec, debian: add smartmontools, nvme-cli dependencies ([pr#37257](https://github.com/ceph/ceph/pull/37257), Yaarit Hatuka)

- cephadm batch backport November ([pr#38155](https://github.com/ceph/ceph/pull/38155), Ricardo Marques, Sebastian Wagner, Kyr Shatskyy, Dan Williams, Volker Theile, Varsha Rao, Tim Serong, Adam King, Dimitri Savineau, Patrick Seidensal, Dan Mick, Michael Fritch, Joshua Schmid)

- cephadm batch backport September (1) ([pr#36975](https://github.com/ceph/ceph/pull/36975), Stephan Müller, Matthew Oliver, Sebastian Wagner, Paul Cuzner, Adam King, Patrick Seidensal, Shraddha Agrawal, Michael Fritch, Dan Mick)

- cephadm batch backport September (2) ([pr#37436](https://github.com/ceph/ceph/pull/37436), Varsha Rao, Kiefer Chang, Patrick Donnelly, Sebastian Wagner, Kefu Chai, Guillaume Abrioux, Juan Miguel Olmo Martínez, Paul Cuzner, Volker Theile, Tim Serong, Zac Dover, Adam King, Michael Fritch, Joshua Schmid)

- cephfs-journal-tool: fix incorrect readoffset when finding missing objects ([pr#37854](https://github.com/ceph/ceph/pull/37854), Xue Yantao)

- cephfs: client: fix directory inode can not call release callback ([pr#37017](https://github.com/ceph/ceph/pull/37017), sepia-liu)

- cephfs: client: fix extra open ref decrease ([pr#37249](https://github.com/ceph/ceph/pull/37249), Xiubo Li)

- cephfs: client: fix inode llref reference count leak ([pr#37839](https://github.com/ceph/ceph/pull/37839), sepia-liu)

- cephfs: client: handle readdir reply without Fs cap ([pr#37370](https://github.com/ceph/ceph/pull/37370), "Yan, Zheng")

- cephfs: client: make Client::open() pass proper cap mask to pathwalk ([pr#37369](https://github.com/ceph/ceph/pull/37369), "Yan, Zheng")

- cephfs: client: use non-static dirent for thread-safety ([pr#37351](https://github.com/ceph/ceph/pull/37351), Patrick Donnelly)

- cephfs: libcephfs: ignore restoring the open files limit ([pr#37358](https://github.com/ceph/ceph/pull/37358), Xiubo Li)

- cephfs: osdc/Journaler: do not call onsafe-">complete() if onsafe is 0 ([pr#37368](https://github.com/ceph/ceph/pull/37368), Xiubo Li)

- common/adminsocket: always validate the parameters ([pr#37341](https://github.com/ceph/ceph/pull/37341), Kefu Chai)

- compressor: Add a config option to specify Zstd compression level ([pr#37253](https://github.com/ceph/ceph/pull/37253), Bryan Stillwell)

- core: include/encoding: Fix encode/decode of float types on big-endian systems ([pr#37032](https://github.com/ceph/ceph/pull/37032), Ulrich Weigand)

- debian: Add missing Python dependency for ceph-mgr ([pr#37422](https://github.com/ceph/ceph/pull/37422), Johannes M. Scheuermann)

- doc/PendingReleaseNotes: mention bluefspreextendwalfiles ([pr#37549](https://github.com/ceph/ceph/pull/37549), Nathan Cutler)

- doc/mgr/orchestrator: Add hints related to custom containers to the docs ([pr#37962](https://github.com/ceph/ceph/pull/37962), Volker Theile)

- doc: cephfs: improve documentation of "ceph nfs cluster create" and "ceph fs volume create" commands ([pr#37691](https://github.com/ceph/ceph/pull/37691), Nathan Cutler)

- doc: enable Read the Docs ([pr#37201](https://github.com/ceph/ceph/pull/37201), Kefu Chai)

- erasure-code: enable isa-l EC for aarch64 platform ([pr#37504](https://github.com/ceph/ceph/pull/37504), luo rixin, Hang Li)

- krbd: optionally skip waiting for udev events ([pr#37285](https://github.com/ceph/ceph/pull/37285), Ilya Dryomov)

- librbd: ensure that thread pool lock is held when processing throttled IOs ([pr#37116](https://github.com/ceph/ceph/pull/37116), Jason Dillaman)

- librbd: handle DNE from immutable-object-cache ([pr#36860](https://github.com/ceph/ceph/pull/36860), Feng Hualong, Mykola Golub, Yin Congmin, Jason Dillaman)

- librbd: using migration abort can result in the loss of data ([pr#37164](https://github.com/ceph/ceph/pull/37164), Jason Dillaman)

- mds/CInode: Optimize only pinned by subtrees check ([pr#37248](https://github.com/ceph/ceph/pull/37248), Mark Nelson)

- mds: account for closing sessions in hitsession ([pr#37856](https://github.com/ceph/ceph/pull/37856), Dan van der Ster)

- mds: add request to batchop before taking auth pins and locks ([pr#37022](https://github.com/ceph/ceph/pull/37022), "Yan, Zheng")

- mds: do not raise "client failing to respond to cap release" when client working set is reasonable ([pr#37353](https://github.com/ceph/ceph/pull/37353), Patrick Donnelly)

- mds: do not submit omaprmkeys if the dir is the basedir of merge ([pr#37034](https://github.com/ceph/ceph/pull/37034), "Yan, Zheng", Chencan)

- mds: don't recover files after normal session close ([pr#37334](https://github.com/ceph/ceph/pull/37334), "Yan, Zheng")

- mds: fix 'forward loop' when forwardallrequeststoauth is set ([pr#37360](https://github.com/ceph/ceph/pull/37360), "Yan, Zheng")

- mds: fix hang issue when accessing a file under a lost parent directory ([pr#37020](https://github.com/ceph/ceph/pull/37020), Zhi Zhang)

- mds: fix kcephfs parse dirfrag's ndist is always 0 ([pr#37357](https://github.com/ceph/ceph/pull/37357), Yanhu Cao)

- mds: fix mds forwarding request 'noavailableopfound' ([pr#37240](https://github.com/ceph/ceph/pull/37240), Yanhu Cao)

- mds: fix nullptr dereference in MDCache::finishrollback ([pr#37243](https://github.com/ceph/ceph/pull/37243), "Yan, Zheng")

- mds: fix purgequeue's calculateops is inaccurate ([pr#37372](https://github.com/ceph/ceph/pull/37372), Yanhu Cao)

- mds: make threshold for MDSTRIM configurable ([pr#36970](https://github.com/ceph/ceph/pull/36970), Paul Emmerich)

- mds: optimize random threshold lookup for dentry load ([pr#37247](https://github.com/ceph/ceph/pull/37247), Patrick Donnelly)

- mds: place MDSGatherBuilder on the stack ([pr#37354](https://github.com/ceph/ceph/pull/37354), Patrick Donnelly)

- mds: reduce memory usage of open file table prefetch #37382 ([pr#37383](https://github.com/ceph/ceph/pull/37383), "Yan, Zheng")

- mds: resolve SIGSEGV in waiting for uncommitted fragments ([pr#37355](https://github.com/ceph/ceph/pull/37355), Patrick Donnelly)

- mds: revert the decode version ([pr#37356](https://github.com/ceph/ceph/pull/37356), Jos Collin)

- mds: send scrub status to ceph-mgr only when scrub is running ([issue#45349](http://tracker.ceph.com/issues/45349), [pr#36047](https://github.com/ceph/ceph/pull/36047), Kefu Chai, Venky Shankar)

- mds: standy-replay mds remained in the "resolve" state after resta… ([pr#37363](https://github.com/ceph/ceph/pull/37363), Wei Qiaomiao)

- messages,mds: Fix decoding of enum types on big-endian systems ([pr#36813](https://github.com/ceph/ceph/pull/36813), Ulrich Weigand)

- mgr/dashboard/api: move/create OSD histogram in separate endpoint ([pr#37973](https://github.com/ceph/ceph/pull/37973), Aashish Sharma)

- mgr/dashboard: Add short descriptions to the telemetry report preview ([pr#37597](https://github.com/ceph/ceph/pull/37597), Nizamudeen A)

- mgr/dashboard: Allow editing iSCSI targets with initiators logged-in ([pr#37277](https://github.com/ceph/ceph/pull/37277), Tiago Melo)

- mgr/dashboard: Auto close table column dropdown on click outside ([pr#36862](https://github.com/ceph/ceph/pull/36862), Tiago Melo)

- mgr/dashboard: Copy to clipboard does not work in Firefox ([pr#37493](https://github.com/ceph/ceph/pull/37493), Volker Theile)

- mgr/dashboard: Datatable catches select events from other datatables ([pr#36899](https://github.com/ceph/ceph/pull/36899), Volker Theile, Tiago Melo)

- mgr/dashboard: Disable TLS 1.0 and 1.1 ([pr#38331](https://github.com/ceph/ceph/pull/38331), Volker Theile)

- mgr/dashboard: Disable autocomplete on user form ([pr#36901](https://github.com/ceph/ceph/pull/36901), Volker Theile)

- mgr/dashboard: Disable sso without python3-saml ([pr#38405](https://github.com/ceph/ceph/pull/38405), Kevin Meijer)

- mgr/dashboard: Disabling the form inputs for the readonly modals ([pr#37239](https://github.com/ceph/ceph/pull/37239), Nizamudeen)

- mgr/dashboard: Fix bugs in a unit test and i18n translation ([pr#36991](https://github.com/ceph/ceph/pull/36991), Volker Theile)

- mgr/dashboard: Fix for CrushMap viewer items getting compressed vertically ([pr#36871](https://github.com/ceph/ceph/pull/36871), Nizamudeen A)

- mgr/dashboard: Fix many-to-many issue in host-details Grafana dashboard ([pr#37299](https://github.com/ceph/ceph/pull/37299), Patrick Seidensal)

- mgr/dashboard: Fix npm package's vulnerabilities ([pr#36921](https://github.com/ceph/ceph/pull/36921), Tiago Melo)

- mgr/dashboard: Hide table action input field if limit=0 ([pr#36872](https://github.com/ceph/ceph/pull/36872), Volker Theile)

- mgr/dashboard: Host delete action should be disabled if not managed by Orchestrator ([pr#36874](https://github.com/ceph/ceph/pull/36874), Volker Theile)

- mgr/dashboard: Improve notification badge ([pr#37090](https://github.com/ceph/ceph/pull/37090), Aashish Sharma)

- mgr/dashboard: Landing Page improvements ([pr#37390](https://github.com/ceph/ceph/pull/37390), Tiago Melo, Alfonso Martínez)

- mgr/dashboard: Merge disable and disableDesc ([pr#37763](https://github.com/ceph/ceph/pull/37763), Tiago Melo)

- mgr/dashboard: Proper format iSCSI target portals ([pr#36870](https://github.com/ceph/ceph/pull/36870), Volker Theile)

- mgr/dashboard: REST API returns 500 when no Content-Type is specified ([pr#37308](https://github.com/ceph/ceph/pull/37308), Avan Thakkar)

- mgr/dashboard: Remove useless tab in monitoring/alerts datatable details ([pr#36875](https://github.com/ceph/ceph/pull/36875), Volker Theile)

- mgr/dashboard: Show warning when replicated size is 1 ([pr#37578](https://github.com/ceph/ceph/pull/37578), Sebastian Krah)

- mgr/dashboard: The performance 'Client Read/Write' widget shows incorrect write values ([pr#38189](https://github.com/ceph/ceph/pull/38189), Volker Theile)

- mgr/dashboard: Update datatable only when necessary ([pr#37331](https://github.com/ceph/ceph/pull/37331), Volker Theile)

- mgr/dashboard: Use pipe instead of calling function within template ([pr#38094](https://github.com/ceph/ceph/pull/38094), Volker Theile)

- mgr/dashboard: cluster > manager modules ([pr#37434](https://github.com/ceph/ceph/pull/37434), Avan Thakkar)

- mgr/dashboard: display devices' health information within a tabset ([pr#37784](https://github.com/ceph/ceph/pull/37784), Kiefer Chang)

- mgr/dashboard: fix error when typing existing paths in the Ganesha form ([pr#37688](https://github.com/ceph/ceph/pull/37688), Kiefer Chang)

- mgr/dashboard: fix perf. issue when listing large amounts of buckets ([pr#37405](https://github.com/ceph/ceph/pull/37405), Alfonso Martínez)

- mgr/dashboard: fix security scopes of some NFS-Ganesha endpoints ([pr#37450](https://github.com/ceph/ceph/pull/37450), Kiefer Chang)

- mgr/dashboard: fix the error when exporting CephFS path "/" in NFS exports ([pr#37686](https://github.com/ceph/ceph/pull/37686), Kiefer Chang)

- mgr/dashboard: get rgw daemon zonegroup name from mgr ([pr#37620](https://github.com/ceph/ceph/pull/37620), Alfonso Martinez)

- mgr/dashboard: increase Grafana iframe height to avoid scroll bar ([pr#37182](https://github.com/ceph/ceph/pull/37182), Ngwa Sedrick Meh)

- mgr/dashboard: log in non-admin users successfully if the telemetry notification is shown ([pr#37452](https://github.com/ceph/ceph/pull/37452), Tatjana Dehler)

- mgr/dashboard: support Orchestrator and user-defined Ganesha cluster ([pr#37885](https://github.com/ceph/ceph/pull/37885), Kiefer Chang)

- mgr/dashboard: table detail rows overflow ([pr#37332](https://github.com/ceph/ceph/pull/37332), Aashish Sharma)

- mgr/devicehealth: devicehealthmetrics pool gets created even without any OSDs in the cluster ([pr#37533](https://github.com/ceph/ceph/pull/37533), Sunny Kumar)

- mgr/insights: Test environment requires 'six' ([pr#38396](https://github.com/ceph/ceph/pull/38396), Brad Hubbard)

- mgr/prometheus: add pool compression stats ([pr#37562](https://github.com/ceph/ceph/pull/37562), Paul Cuzner)

- mgr/telemetry: fix device id splitting when anonymizing serial ([pr#37302](https://github.com/ceph/ceph/pull/37302), Yaarit Hatuka)

- mgr/volumes/nfs: Check if orchestrator spec serviceid is valid ([pr#37371](https://github.com/ceph/ceph/pull/37371), Varsha Rao)

- mgr/volumes/nfs: Fix wrong error message for pseudo path ([pr#37855](https://github.com/ceph/ceph/pull/37855), Varsha Rao)

- mgr/volumes: Make number of cloner threads configurable ([pr#37671](https://github.com/ceph/ceph/pull/37671), Kotresh HR)

- mgr/zabbix: indent the output of "zabbix config-show" ([pr#37128](https://github.com/ceph/ceph/pull/37128), Kefu Chai)

- mgr: PyModuleRegistry::unregisterclient() can run endlessly ([issue#47329](http://tracker.ceph.com/issues/47329), [pr#37217](https://github.com/ceph/ceph/pull/37217), Venky Shankar)

- mgr: don't update pending service map epoch on receiving map from mon ([pr#37180](https://github.com/ceph/ceph/pull/37180), Mykola Golub)

- mon scrub testing ([pr#38361](https://github.com/ceph/ceph/pull/38361), Brad Hubbard)

- mon/MDSMonitor do not ignore mds's down:dne request ([pr#37858](https://github.com/ceph/ceph/pull/37858), chencan)

- mon/MDSMonitor: divide mds identifier and mds real name with dot ([pr#37857](https://github.com/ceph/ceph/pull/37857), Zhi Zhang)

- mon/MonMap: fix unconditional failure for initwithhosts ([pr#37817](https://github.com/ceph/ceph/pull/37817), Nathan Cutler, Patrick Donnelly)

- mon/PGMap: add pg count for pools in the ceph df command ([pr#36945](https://github.com/ceph/ceph/pull/36945), Vikhyat Umrao)

- mon: Log "ceph health detail" periodically in cluster log ([pr#38345](https://github.com/ceph/ceph/pull/38345), Prashant Dhange)

- mon: deleting a CephFS and its pools causes MONs to crash ([pr#37256](https://github.com/ceph/ceph/pull/37256), Patrick Donnelly)

- mon: have 'mon stat' output json as well ([pr#37705](https://github.com/ceph/ceph/pull/37705), Joao Eduardo Luis)

- mon: mark pgtemp messages as noreply more consistenly in preprocess\\… ([pr#37347](https://github.com/ceph/ceph/pull/37347), Greg Farnum)

- mon: set sessiontimeout when adding to sessionmap ([pr#37553](https://github.com/ceph/ceph/pull/37553), Ilya Dryomov)

- mon: store mon updates in ceph context for future MonMap instantiation ([pr#36705](https://github.com/ceph/ceph/pull/36705), Patrick Donnelly, Shyamsundar Ranganathan)

- msg/async/ProtocolV2: allow rxbuf/txbuf get bigger in testing ([pr#37080](https://github.com/ceph/ceph/pull/37080), Ilya Dryomov)

- os/bluestore: enable more flexible bluefs space management by default ([pr#37092](https://github.com/ceph/ceph/pull/37092), Igor Fedotov)

- osd/osd-rep-recov-eio.sh: TESTradosrepairwarning: return 1 ([pr#37853](https://github.com/ceph/ceph/pull/37853), David Zafman)

- osd: Check for nosrub/nodeep-scrub in between chunks, to avoid races ([pr#38359](https://github.com/ceph/ceph/pull/38359), David Zafman)

- osdc/ObjectCacher: overwrite might cause stray read request callbacks ([pr#37674](https://github.com/ceph/ceph/pull/37674), Jason Dillaman)

- osdc: add timeout configs for mons/osds ([pr#37530](https://github.com/ceph/ceph/pull/37530), Patrick Donnelly)

- prometheus: Properly split the port off IPv6 addresses ([pr#36985](https://github.com/ceph/ceph/pull/36985), Matthew Oliver)

- pybind/cephfs: add special values for not reading conffile ([pr#37724](https://github.com/ceph/ceph/pull/37724), Kefu Chai)

- pybind/cephfs: fix custom exception raised by cephfs.pyx ([pr#37350](https://github.com/ceph/ceph/pull/37350), Ramana Raja)

- pybind/mgr/volumes: add global lock debug ([pr#37366](https://github.com/ceph/ceph/pull/37366), Patrick Donnelly)

- qa/\\\*/mon/mon-last-epoch-clean.sh: mark osd out instead of down ([pr#37349](https://github.com/ceph/ceph/pull/37349), Neha Ojha)

- qa/cephfs: add sessiontimeout option support ([pr#37841](https://github.com/ceph/ceph/pull/37841), Xiubo Li)

- qa/tasks/nfs: Test mounting of export created with nfs command ([pr#37365](https://github.com/ceph/ceph/pull/37365), Varsha Rao)

- qa/tasks/{ceph,cephmanager}: drop py2 support ([pr#37863](https://github.com/ceph/ceph/pull/37863), Kefu Chai)

- qa/tests: added rhel 8.2 ([pr#38287](https://github.com/ceph/ceph/pull/38287), Yuri Weinstein)

- qa/tests: use bionic only for old clients in rados/thrash-old-clients ([pr#36931](https://github.com/ceph/ceph/pull/36931), Yuri Weinstein)

- qa/workunits/mon: fixed excessively large pool PG count ([pr#37346](https://github.com/ceph/ceph/pull/37346), Jason Dillaman)

- qa: Enable debugclient for mgr tests ([pr#37270](https://github.com/ceph/ceph/pull/37270), Brad Hubbard)

- qa: Fix traceback during fs cleanup between tests ([pr#36713](https://github.com/ceph/ceph/pull/36713), Kotresh HR)

- qa: add debugging for volumes plugin use of libcephfs ([pr#37352](https://github.com/ceph/ceph/pull/37352), Patrick Donnelly)

- qa: drop hammer branch qa tests ([pr#37728](https://github.com/ceph/ceph/pull/37728), Neha Ojha, Deepika Upadhyay)

- qa: ignore expected mds failover message [](https://github.com/ceph/ceph/pull/37367)pr#37367, Patrick Donnelly)

- rbd-mirror: peer setup can still race and fail creation of peer ([pr#37342](https://github.com/ceph/ceph/pull/37342), Jason Dillaman)

- rbd: include RADOS namespace in krbd symlinks ([pr#37343](https://github.com/ceph/ceph/pull/37343), Ilya Dryomov)

- rbd: journal: possible race condition between flush and append callback ([pr#37850](https://github.com/ceph/ceph/pull/37850), Jason Dillaman)

- rbd: librbd: ignore -ENOENT error when disabling object-map ([pr#37852](https://github.com/ceph/ceph/pull/37852), Jason Dillaman)

- rbd: librbd: update AioCompletion return value before evaluating pending count ([pr#37851](https://github.com/ceph/ceph/pull/37851), Jason Dillaman)

- rbd: make common options override krbd-specific options ([pr#37408](https://github.com/ceph/ceph/pull/37408), Ilya Dryomov)

- rbd: rbd-nbd: don't ignore namespace when unmapping by image spec ([pr#37812](https://github.com/ceph/ceph/pull/37812), Mykola Golub)

- rgw/gc: fix for incrementing the perf counter 'gcretireobject' ([pr#37847](https://github.com/ceph/ceph/pull/37847), Pritha Srivastava)

- rgw/gc: fixing the condition when marker for a queue is ([pr#37846](https://github.com/ceph/ceph/pull/37846), Pritha Srivastava)

- rgw/rgwfile: Fix the incorrect lru object eviction ([pr#37672](https://github.com/ceph/ceph/pull/37672), luo rixin)

- rgw: Add bucket name to bucket stats error logging ([pr#37335](https://github.com/ceph/ceph/pull/37335), Seena Fallah)

- rgw: Add request timeout to beast ([pr#37809](https://github.com/ceph/ceph/pull/37809), Adam C. Emerson, Or Friedmann)

- rgw: RGWObjVersionTracker tracks version over increments ([pr#37337](https://github.com/ceph/ceph/pull/37337), Casey Bodley)

- rgw: Swift API anonymous access should 401 ([pr#37339](https://github.com/ceph/ceph/pull/37339), Matthew Oliver)

- rgw: adds code for creating and managing oidc provider entities in rgw and for offline validation of OpenID Connect Access and ID Token ([pr#37640](https://github.com/ceph/ceph/pull/37640), Pritha Srivastava, Casey Bodley)

- rgw: allow rgw-orphan-list to note when rados objects are in namespace ([pr#37800](https://github.com/ceph/ceph/pull/37800), J. Eric Ivancich)

- rgw: dump transitions in RGWLifecycleConfiguration::dump() ([pr#36812](https://github.com/ceph/ceph/pull/36812), Shengming Zhang)

- rgw: during GC defer, prevent new GC enqueue ([pr#38249](https://github.com/ceph/ceph/pull/38249), Casey Bodley, J. Eric Ivancich)

- rgw: fix expiration header returned even if there is only one tag in the object the same as the rule ([pr#37807](https://github.com/ceph/ceph/pull/37807), Or Friedmann)

- rgw: fix setting of namespace in ordered and unordered bucket listing ([pr#37673](https://github.com/ceph/ceph/pull/37673), J. Eric Ivancich)

- rgw: fix user stats iterative increment ([pr#37779](https://github.com/ceph/ceph/pull/37779), Mark Kogan)

- rgw: fix: S3 API KeyCount incorrect return ([pr#37849](https://github.com/ceph/ceph/pull/37849), 胡玮文)

- rgw: log resharding events at level 1 (formerly 20) ([pr#36840](https://github.com/ceph/ceph/pull/36840), Or Friedmann)

- rgw: radosgw-admin should paginate internally when listing bucket ([pr#37803](https://github.com/ceph/ceph/pull/37803), J. Eric Ivancich)

- rgw: radosgw-admin: period pull command is not always a rawstorageop ([pr#37336](https://github.com/ceph/ceph/pull/37336), Casey Bodley)

- rgw: replace '+' with "%20" in canonical query string for s3 v4 auth ([pr#37338](https://github.com/ceph/ceph/pull/37338), yuliyangyewu)

- rgw: rgwfile: avoid long-ish delay on shutdown ([pr#37551](https://github.com/ceph/ceph/pull/37551), Matt Benjamin)

- rgw: s3: mark bucket encryption as not implemented ([pr#36691](https://github.com/ceph/ceph/pull/36691), Abhishek Lekshmanan)

- rgw: urlencode bucket name when forwarding request ([pr#37340](https://github.com/ceph/ceph/pull/37340), caolei)

- rgw: use yum rather than dnf for teuthology testing of rgw-orphan-list ([pr#37845](https://github.com/ceph/ceph/pull/37845), J. Eric Ivancich)

- rpm,deb: drop /etc/sudoers.d/cephadm ([pr#37401](https://github.com/ceph/ceph/pull/37401), Nathan Cutler)

- run-make-check.sh: Don't run tests if build fails ([pr#38294](https://github.com/ceph/ceph/pull/38294), Brad Hubbard)

- systemd: Support Graceful Reboot for AIO Node ([pr#37300](https://github.com/ceph/ceph/pull/37300), Wong Hoi Sing Edison)

- test/librados: fix endian bugs in checksum test cases ([pr#37604](https://github.com/ceph/ceph/pull/37604), Ulrich Weigand)

- test/rbd-mirror: pool watcher registration error might result in race ([pr#37208](https://github.com/ceph/ceph/pull/37208), Jason Dillaman)

- test/storetest: use 'threadsafe' style for death tests ([pr#37819](https://github.com/ceph/ceph/pull/37819), Igor Fedotov)

- tools/osdmaptool.cc: add ability to cleantemps ([pr#37348](https://github.com/ceph/ceph/pull/37348), Neha Ojha)

- tools/rados: flush formatter periodically during json output of "rados ls" ([pr#37835](https://github.com/ceph/ceph/pull/37835), J. Eric Ivancich)

- vstart.sh: fix fs set maxmds bug ([pr#37837](https://github.com/ceph/ceph/pull/37837), Jinmyeong Lee)
