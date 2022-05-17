---
title: "v16.2.6 Pacific released"
date: "2021-09-16"
author: "dgalloway"
tags:
  - "release"
  - "pacific"
---

This is the sixth backport release in the Pacific series. We recommend all users update to this release.

## Notable Changes

- MGR: The pg_autoscaler has a new default 'scale-down' profile which provides more performance from the start for new pools (for newly created clusters). Existing clusters will retain the old behavior, now called the 'scale-up' profile. For more details, see: https://docs.ceph.com/en/latest/rados/operations/placement-groups/

- CephFS: the upgrade procedure for CephFS is now simpler. It is no longer necessary to stop all MDS before upgrading the sole active MDS. After disabling standby-replay, reducing max_mds to 1, and waiting for the file systems to become stable (each fs with 1 active and 0 stopping daemons), a rolling upgrade of all MDS daemons can be performed.

- Dashboard: now allows users to set up and display a custom message (MOTD, warning, etc.) in a sticky banner at the top of the page. For more details, see: https://docs.ceph.com/en/pacific/mgr/dashboard/#message-of-the-day-motd

- Several fixes in BlueStore, including a fix for the deferred write regression, which led to excessive RocksDB flushes and compactions. Previously, when bluestore_prefer_deferred_size_hdd was equal to or more than bluestore_max_blob_size_hdd (both set to 64K), all the data was deferred, which led to increased consumption of the column family used to store deferred writes in RocksDB. Now, the bluestore_prefer_deferred_size parameter independently controls deferred writes, and only writes smaller than this size use the deferred write path.

- The default value of osd_client_message_cap has been set to 256, to provide better flow control by limiting maximum number of in-flight client requests.

- PGs no longer show a active+clean+scrubbing+deep+repair state when osd_scrub_auto_repair is set to true, for regular deep-scrubs with no repair required.

- ceph-mgr-modules-core debian package does not recommend ceph-mgr-rook anymore. As the latter depends on python3-numpy which cannot be imported in different Python sub-interpreters multi-times if the version of python3-numpy is older than 1.19. Since apt-get installs the Recommends packages by default, ceph-mgr-rook was always installed along with ceph-mgr debian package as an indirect dependency. If your workflow depends on this behavior, you might want to install ceph-mgr-rook separately.

- This is the first release built for Debian Bullseye.

## Changelog

- bind on loopback address if no other addresses are available ([pr#42477](https://github.com/ceph/ceph/pull/42477), Kefu Chai)

- ceph-monstore-tool: use a large enough paxos/{first,last}\_committed ([issue#38219](http://tracker.ceph.com/issues/38219), [pr#42411](https://github.com/ceph/ceph/pull/42411), Kefu Chai)

- ceph-volume/tests: retry when destroying osd ([pr#42546](https://github.com/ceph/ceph/pull/42546), Guillaume Abrioux)

- ceph-volume/tests: update ansible environment variables in tox ([pr#42490](https://github.com/ceph/ceph/pull/42490), Dimitri Savineau)

- ceph-volume: Consider /dev/root as mounted ([pr#42755](https://github.com/ceph/ceph/pull/42755), David Caro)

- ceph-volume: fix lvm activate arguments ([pr#43116](https://github.com/ceph/ceph/pull/43116), Dimitri Savineau)

- ceph-volume: fix lvm migrate without args ([pr#43110](https://github.com/ceph/ceph/pull/43110), Dimitri Savineau)

- ceph-volume: fix raw list with logical partition ([pr#43087](https://github.com/ceph/ceph/pull/43087), Guillaume Abrioux, Dimitri Savineau)

- ceph-volume: implement bluefs volume migration ([pr#42219](https://github.com/ceph/ceph/pull/42219), Kefu Chai, Igor Fedotov)

- ceph-volume: lvm batch: fast\_allocations(): avoid ZeroDivisionError ([pr#42493](https://github.com/ceph/ceph/pull/42493), Jonas Zeiger)

- ceph-volume: pvs --noheadings replace pvs --no-heading ([pr#43076](https://github.com/ceph/ceph/pull/43076), FengJiankui)

- ceph-volume: remove --all ref from deactivate help ([pr#43098](https://github.com/ceph/ceph/pull/43098), Dimitri Savineau)

- ceph-volume: support no\_systemd with lvm migrate ([pr#43091](https://github.com/ceph/ceph/pull/43091), Dimitri Savineau)

- ceph-volume: work around phantom atari partitions ([pr#42753](https://github.com/ceph/ceph/pull/42753), Blaine Gardner)

- ceph.spec<span></span>.in: drop gdbm from build deps ([pr#43000](https://github.com/ceph/ceph/pull/43000), Kefu Chai)

- cephadm: August batch 1 ([pr#42736](https://github.com/ceph/ceph/pull/42736), Sage Weil, Dimitri Savineau, Guillaume Abrioux, Sebastian Wagner, Varsha Rao, Zac Dover, Adam King, Cory Snyder, Michael Fritch, Asbjørn Sannes, "Wang,Fei", Javier Cacheiro, 胡玮文, Daniel Pivonka)

- cephadm: September batch 1 ([issue#52038](http://tracker.ceph.com/issues/52038), [pr#43029](https://github.com/ceph/ceph/pull/43029), Sebastian Wagner, Dimitri Savineau, Paul Cuzner, Oleander Reis, Adam King, Yuxiang Zhu, Zac Dover, Alfonso Martínez, Sage Weil, Daniel Pivonka)

- cephadm: use quay, not docker ([pr#42534](https://github.com/ceph/ceph/pull/42534), Sage Weil)

- cephfs-mirror: record directory path cancel in DirRegistry ([issue#51666](http://tracker.ceph.com/issues/51666), [pr#42458](https://github.com/ceph/ceph/pull/42458), Venky Shankar)

- client: flush the mdlog in unsafe requests' relevant and auth MDSes only ([pr#42925](https://github.com/ceph/ceph/pull/42925), Xiubo Li)

- client: make sure only to update dir dist from auth mds ([pr#42937](https://github.com/ceph/ceph/pull/42937), Xue Yantao)

- cls/cmpomap: empty values are 0 in U64 comparisons ([pr#42908](https://github.com/ceph/ceph/pull/42908), Casey Bodley)

- cmake, ceph.spec<span></span>.in: build with header only fmt on RHEL ([pr#42472](https://github.com/ceph/ceph/pull/42472), Kefu Chai)

- cmake: build static libs if they are internal ones ([pr#39902](https://github.com/ceph/ceph/pull/39902), Kefu Chai)

- cmake: exclude "grafonnet-lib" target from "all" ([pr#42898](https://github.com/ceph/ceph/pull/42898), Kefu Chai)

- cmake: link bundled fmt statically ([pr#42692](https://github.com/ceph/ceph/pull/42692), Kefu Chai)

- cmake: Replace boost download url ([pr#42693](https://github.com/ceph/ceph/pull/42693), Rafał Wądołowski)

- common/buffer: fix SIGABRT in  rebuild\_aligned\_size\_and\_memory ([pr#42976](https://github.com/ceph/ceph/pull/42976), Yin Congmin)

- common/Formatter: include used header ([pr#42233](https://github.com/ceph/ceph/pull/42233), Kefu Chai)

- common/options: Set osd\_client\_message\_cap to 256 ([pr#42615](https://github.com/ceph/ceph/pull/42615), Mark Nelson)

- compression/snappy: use uint32\_t to be compatible with 1.1.9 ([pr#42542](https://github.com/ceph/ceph/pull/42542), Kefu Chai, Nathan Cutler)

- debian/control: ceph-mgr-modules-core does not Recommend ceph-mgr-roo… ([pr#42300](https://github.com/ceph/ceph/pull/42300), Kefu Chai)

- debian/control: dh-systemd is part of debhelper now ([pr#43151](https://github.com/ceph/ceph/pull/43151), David Galloway)

- debian/control: remove cython from Build-Depends ([pr#43131](https://github.com/ceph/ceph/pull/43131), Kefu Chai)

- doc/ceph-volume: add lvm migrate/new-db/new-wal ([pr#43089](https://github.com/ceph/ceph/pull/43089), Dimitri Savineau)

- doc/rados/operations: s/max\_misplaced/target\_max\_misplaced\_ratio/ ([pr#42250](https://github.com/ceph/ceph/pull/42250), Paul Reece, Kefu Chai)

- doc/releases/pacific.rst: remove notes about autoscaler ([pr#42265](https://github.com/ceph/ceph/pull/42265), Neha Ojha)

- Don't persist report data ([pr#42888](https://github.com/ceph/ceph/pull/42888), Brad Hubbard)

- krbd: escape udev\_enumerate\_add\_match\_sysattr values ([pr#42969](https://github.com/ceph/ceph/pull/42969), Ilya Dryomov)

- kv/RocksDBStore: Add handling of block\_cache option for resharding ([pr#42844](https://github.com/ceph/ceph/pull/42844), Adam Kupczyk)

- kv/RocksDBStore: enrich debug message ([pr#42544](https://github.com/ceph/ceph/pull/42544), Toshikuni Fukaya, Satoru Takeuchi)

- librgw/notifications: initialize kafka and amqp ([pr#42648](https://github.com/ceph/ceph/pull/42648), Yuval Lifshitz)

- mds: add debugging when rejecting mksnap with EPERM ([pr#42935](https://github.com/ceph/ceph/pull/42935), Patrick Donnelly)

- mds: create file system with specific ID ([pr#42900](https://github.com/ceph/ceph/pull/42900), Ramana Raja)

- mds: MDCache<span></span>.cc:5319 FAILED ceph\_assert(rejoin\_ack\_gather.count(mds->get\_nodeid())) ([pr#42938](https://github.com/ceph/ceph/pull/42938), chencan)

- mds: META\_POP\_READDIR, META\_POP\_FETCH, META\_POP\_STORE, and cache\_hit\_rate are not updated ([pr#42939](https://github.com/ceph/ceph/pull/42939), Yongseok Oh)

- mds: to print the unknow type value ([pr#42088](https://github.com/ceph/ceph/pull/42088), Xiubo Li, Jos Collin)

- MDSMonitor: monitor crash after upgrade from ceph 15.2.13 to 16.2.4 ([pr#42536](https://github.com/ceph/ceph/pull/42536), Patrick Donnelly)

- mgr/DaemonServer: skip redundant update of pgp\_num\_actual ([pr#42223](https://github.com/ceph/ceph/pull/42223), Dan van der Ster)

- mgr/dashboard/api: set a UTF-8 locale when running pip ([pr#42829](https://github.com/ceph/ceph/pull/42829), Kefu Chai)

- mgr/dashboard: Add configurable MOTD or wall notification ([pr#42414](https://github.com/ceph/ceph/pull/42414), Volker Theile)

- mgr/dashboard: cephadm e2e start script: add --expanded option ([pr#42789](https://github.com/ceph/ceph/pull/42789), Alfonso Martínez)

- mgr/dashboard: cephadm-e2e job script: improvements ([pr#42585](https://github.com/ceph/ceph/pull/42585), Alfonso Martínez)

- mgr/dashboard: disable create snapshot with subvolumes ([pr#42819](https://github.com/ceph/ceph/pull/42819), Pere Diaz Bou)

- mgr/dashboard: don't notify for suppressed alerts ([pr#42974](https://github.com/ceph/ceph/pull/42974), Tatjana Dehler)

- mgr/dashboard: fix Accept-Language header parsing ([pr#42297](https://github.com/ceph/ceph/pull/42297), 胡玮文)

- mgr/dashboard: fix rename inventory to disks ([pr#42810](https://github.com/ceph/ceph/pull/42810), Navin Barnwal)

- mgr/dashboard: fix ssl cert validation for rgw service creation ([pr#42628](https://github.com/ceph/ceph/pull/42628), Avan Thakkar)

- mgr/dashboard: Fix test\_error force maintenance dashboard check ([pr#42354](https://github.com/ceph/ceph/pull/42354), Nizamudeen A)

- mgr/dashboard: monitoring: replace Grafana JSON with Grafonnet based code ([pr#42812](https://github.com/ceph/ceph/pull/42812), Aashish Sharma)

- mgr/dashboard: Refresh button on the iscsi targets page ([pr#42817](https://github.com/ceph/ceph/pull/42817), Nizamudeen A)

- mgr/dashboard: remove usage of 'rgw\_frontend\_ssl\_key' ([pr#42316](https://github.com/ceph/ceph/pull/42316), Avan Thakkar)

- mgr/dashboard: show perf. counters for rgw svc. on Cluster > Hosts ([pr#42629](https://github.com/ceph/ceph/pull/42629), Alfonso Martínez)

- mgr/dashboard: stats=false not working when listing buckets ([pr#42889](https://github.com/ceph/ceph/pull/42889), Avan Thakkar)

- mgr/dashboard: tox.ini: delete useless env. 'apidocs' ([pr#42788](https://github.com/ceph/ceph/pull/42788), Alfonso Martínez)

- mgr/dashboard: update translations for pacific ([pr#42606](https://github.com/ceph/ceph/pull/42606), Tatjana Dehler)

- mgr/mgr\_util: switch using unshared cephfs connections whenever possible ([issue#51256](http://tracker.ceph.com/issues/51256), [pr#42083](https://github.com/ceph/ceph/pull/42083), Venky Shankar)

- mgr/pg\_autoscaler: Introduce autoscaler scale-down feature ([pr#42428](https://github.com/ceph/ceph/pull/42428), Kamoltat, Kefu Chai)

- mgr/rook: Add timezone info ([pr#39834](https://github.com/ceph/ceph/pull/39834), Varsha Rao, Sebastian Wagner)

- mgr/telemetry: pass leaderboard flag even w/o ident ([pr#42228](https://github.com/ceph/ceph/pull/42228), Sage Weil)

- mgr/volumes: Add config to insert delay at the beginning of the clone ([pr#42086](https://github.com/ceph/ceph/pull/42086), Kotresh HR)

- mgr/volumes: use dedicated libcephfs handles for subvolume calls and … ([issue#51271](http://tracker.ceph.com/issues/51271), [pr#42914](https://github.com/ceph/ceph/pull/42914), Venky Shankar)

- mgr: set debug\_mgr=2/5 (so INFO goes to mgr log by default) ([pr#42225](https://github.com/ceph/ceph/pull/42225), Sage Weil)

- mon/MDSMonitor: do not pointlessly kill standbys that are incompatible with current CompatSet ([pr#42578](https://github.com/ceph/ceph/pull/42578), Patrick Donnelly, Zhi Zhang)

- mon/OSDMonitor: resize oversized Lec::epoch\_by\_pg, after PG merging, preventing osdmap trimming ([pr#42224](https://github.com/ceph/ceph/pull/42224), Dan van der Ster)

- mon/PGMap: remove DIRTY field in ceph df detail when cache tiering is not in use ([pr#42860](https://github.com/ceph/ceph/pull/42860), Deepika Upadhyay)

- mon: return -EINVAL when handling unknown option in 'ceph osd pool get' ([pr#42229](https://github.com/ceph/ceph/pull/42229), Zhao Cuicui)

- mon: Sanely set the default CRUSH rule when creating pools in stretch… ([pr#42909](https://github.com/ceph/ceph/pull/42909), Greg Farnum)

- monitoring/grafana/build/Makefile: revamp for arm64 builds, pushes to docker and quay, jenkins ([pr#42211](https://github.com/ceph/ceph/pull/42211), Dan Mick)

- monitoring/grafana/cluster: use per-unit max and limit values ([pr#42679](https://github.com/ceph/ceph/pull/42679), David Caro)

- monitoring: Clean up Grafana dashboards ([pr#42299](https://github.com/ceph/ceph/pull/42299), Patrick Seidensal)

- monitoring: fix Physical Device Latency unit ([pr#42298](https://github.com/ceph/ceph/pull/42298), Seena Fallah)

- msg: active\_connections regression ([pr#42936](https://github.com/ceph/ceph/pull/42936), Sage Weil)

- nfs backport June ([pr#42096](https://github.com/ceph/ceph/pull/42096), Varsha Rao)

- os/bluestore: accept undecodable multi-block bluefs transactions on log ([pr#43023](https://github.com/ceph/ceph/pull/43023), Igor Fedotov)

- os/bluestore: cap omap naming scheme upgrade transaction ([pr#42956](https://github.com/ceph/ceph/pull/42956), Igor Fedotov)

- os/bluestore: compact db after bulk omap naming upgrade ([pr#42426](https://github.com/ceph/ceph/pull/42426), Igor Fedotov)

- os/bluestore: fix bluefs migrate command ([pr#43100](https://github.com/ceph/ceph/pull/43100), Igor Fedotov)

- os/bluestore: fix erroneous SharedBlob record removal during repair ([pr#42423](https://github.com/ceph/ceph/pull/42423), Igor Fedotov)

- os/bluestore: fix using incomplete bluefs log when dumping it ([pr#43007](https://github.com/ceph/ceph/pull/43007), Igor Fedotov)

- os/bluestore: make deferred writes less aggressive for large writes ([pr#42773](https://github.com/ceph/ceph/pull/42773), Igor Fedotov, Adam Kupczyk)

- os/bluestore: Remove possibility of replay log and file inconsistency ([pr#42424](https://github.com/ceph/ceph/pull/42424), Adam Kupczyk)

- os/bluestore: respect bluestore\_warn\_on\_spurious\_read\_errors setting ([pr#42897](https://github.com/ceph/ceph/pull/42897), Igor Fedotov)

- osd/scrub: separate between PG state flags and internal scrubber operation ([pr#42398](https://github.com/ceph/ceph/pull/42398), Ronen Friedman)

- osd: log snaptrim message to dout ([pr#42482](https://github.com/ceph/ceph/pull/42482), Arthur Outhenin-Chalandre)

- osd: move down peers out from peer\_purged ([pr#42238](https://github.com/ceph/ceph/pull/42238), Mykola Golub)

- pybind/mgr/stats: validate cmdtag ([pr#42702](https://github.com/ceph/ceph/pull/42702), Jos Collin)

- pybind/mgr: Fix IPv6 url generation ([pr#42990](https://github.com/ceph/ceph/pull/42990), Sebastian Wagner)

- pybind/rbd: fix mirror\_image\_get\_status ([pr#42972](https://github.com/ceph/ceph/pull/42972), Ilya Dryomov, Will Smith)

- qa/\*/test\_envlibrados\_for\_rocksdb.sh: install libarchive-3.3.3 ([pr#42344](https://github.com/ceph/ceph/pull/42344), Neha Ojha)

- qa/cephadm: centos\_8.x\_container\_tools\_3.0.yaml ([pr#42868](https://github.com/ceph/ceph/pull/42868), Sebastian Wagner)

- qa/rgw: move ignore-pg-availability.yaml out of suites/rgw ([pr#40694](https://github.com/ceph/ceph/pull/40694), Casey Bodley)

- qa/standalone: Add missing cleanups after completion of a subset of osd and scrub tests ([pr#42258](https://github.com/ceph/ceph/pull/42258), Sridhar Seshasayee)

- qa/tests: advanced pacific version to reflect the latest 16.2.5 point ([pr#42264](https://github.com/ceph/ceph/pull/42264), Yuri Weinstein)

- qa/workunits/mon/test\_mon\_config\_key: use subprocess.run() instead of proc.communicate() ([pr#42221](https://github.com/ceph/ceph/pull/42221), Kefu Chai)

- qa: FileNotFoundError: [Errno 2] No such file or directory: '/sys/kernel/debug/ceph/3fab6bea-f243-47a4-a956-8c03a62b61b5.client4721/mds\_sessions' ([pr#42165](https://github.com/ceph/ceph/pull/42165), Patrick Donnelly)

- qa: increase the pg\_num for cephfs\_data/metadata pools ([pr#42923](https://github.com/ceph/ceph/pull/42923), Xiubo Li)

- qa: test\_ls\_H\_prints\_human\_readable\_file\_size failure ([pr#42166](https://github.com/ceph/ceph/pull/42166), Patrick Donnelly)

- radosgw-admin: skip GC init on read-only admin ops ([pr#42655](https://github.com/ceph/ceph/pull/42655), Mark Kogan)

- radosgw: include realm\\_{id,name} in service map ([pr#42213](https://github.com/ceph/ceph/pull/42213), Sage Weil)

- rbd-mirror: add perf counters to snapshot replayer ([pr#42987](https://github.com/ceph/ceph/pull/42987), Arthur Outhenin-Chalandre)

- rbd-mirror: fix potential async op tracker leak in start\_image\_replayers ([pr#42979](https://github.com/ceph/ceph/pull/42979), Mykola Golub)

- rbd: fix default pool handling for nbd map/unmap ([pr#42980](https://github.com/ceph/ceph/pull/42980), Sunny Kumar)

- Remove dependency on lsb\_release ([pr#43001](https://github.com/ceph/ceph/pull/43001), Ken Dreyer)

- RGW - Bucket Remove Op: Pass in user ([pr#42135](https://github.com/ceph/ceph/pull/42135), Daniel Gryniewicz)

- RGW - Don't move attrs before setting them ([pr#42320](https://github.com/ceph/ceph/pull/42320), Daniel Gryniewicz)

- rgw : add check empty for sync url ([pr#42653](https://github.com/ceph/ceph/pull/42653), caolei)

- rgw : add check for tenant provided in RGWCreateRole ([pr#42637](https://github.com/ceph/ceph/pull/42637), caolei)

- rgw : modfiy error XML for deleterole ([pr#42639](https://github.com/ceph/ceph/pull/42639), caolei)

- rgw multisite: metadata sync treats all errors as 'transient' for retry ([pr#42656](https://github.com/ceph/ceph/pull/42656), Casey Bodley)

- RGW Zipper - Make sure bucket list progresses ([pr#42625](https://github.com/ceph/ceph/pull/42625), Daniel Gryniewicz)

- rgw/amqp/test: fix mock prototype for librabbitmq-0.11.0 ([pr#42649](https://github.com/ceph/ceph/pull/42649), Yuval Lifshitz)

- rgw/http/notifications: support content type in HTTP POST messages ([pr#42644](https://github.com/ceph/ceph/pull/42644), Yuval Lifshitz)

- rgw/multisite: return correct error code when op fails ([pr#42646](https://github.com/ceph/ceph/pull/42646), Yuval Lifshitz)

- rgw/notification: add exception handling for persistent notification thread ([pr#42647](https://github.com/ceph/ceph/pull/42647), Yuval Lifshitz)

- rgw/notification: fix persistent notification hang when ack-levl=none ([pr#40696](https://github.com/ceph/ceph/pull/40696), Yuval Lifshitz)

- rgw/notification: fixing the "persistent=false" flag ([pr#40695](https://github.com/ceph/ceph/pull/40695), Yuval Lifshitz)

- rgw/notifications: delete bucket notification object when empty ([pr#42631](https://github.com/ceph/ceph/pull/42631), Yuval Lifshitz)

- rgw/notifications: support metadata filter in CompleteMultipartUpload and Copy events ([pr#42321](https://github.com/ceph/ceph/pull/42321), Yuval Lifshitz)

- rgw/notifications: support metadata filter in CompleteMultipartUploa… ([pr#42566](https://github.com/ceph/ceph/pull/42566), Yuval Lifshitz)

- rgw/rgw\_file: Fix the return value of read() and readlink() ([pr#42654](https://github.com/ceph/ceph/pull/42654), Dai zhiwei, luo rixin)

- rgw/sts: correcting the evaluation of session policies ([pr#42632](https://github.com/ceph/ceph/pull/42632), Pritha Srivastava)

- rgw/sts: read\_obj\_policy() consults iam\_user\_policies on ENOENT ([pr#42650](https://github.com/ceph/ceph/pull/42650), Casey Bodley)

- rgw: allow rgw-orphan-list to process multiple data pools ([pr#42635](https://github.com/ceph/ceph/pull/42635), J. Eric Ivancich)

- rgw: allow to set ssl options and ciphers for beast frontend ([pr#42363](https://github.com/ceph/ceph/pull/42363), Mykola Golub)

- rgw: avoid infinite loop when deleting a bucket ([issue#49206](http://tracker.ceph.com/issues/49206), [pr#42230](https://github.com/ceph/ceph/pull/42230), Jeegn Chen)

- rgw: avoid occuring radosgw daemon crash when access a conditionally … ([pr#42626](https://github.com/ceph/ceph/pull/42626), xiangrui meng, yupeng chen)

- rgw: Backport of 51674 to Pacific ([pr#42346](https://github.com/ceph/ceph/pull/42346), Adam C. Emerson)

- rgw: deprecate the civetweb frontend ([pr#41367](https://github.com/ceph/ceph/pull/41367), Casey Bodley)

- rgw: Don't segfault on datalog trim ([pr#42336](https://github.com/ceph/ceph/pull/42336), Adam C. Emerson)

- rgw: during reshard lock contention, adjust logging ([pr#42641](https://github.com/ceph/ceph/pull/42641), J. Eric Ivancich)

- rgw: extending existing ssl support for vault KMS ([pr#42093](https://github.com/ceph/ceph/pull/42093), Jiffin Tony Thottan)

- rgw: fail as expected when set/delete-bucket-website attempted on a non-exis… ([pr#42642](https://github.com/ceph/ceph/pull/42642), xiangrui meng)

- rgw: fix bucket object listing when marker matches prefix ([pr#42638](https://github.com/ceph/ceph/pull/42638), J. Eric Ivancich)

- rgw: fix for mfa resync crash when supplied with only one totp\_pin ([pr#42652](https://github.com/ceph/ceph/pull/42652), Pritha Srivastava)

- rgw: fix segfault related to explicit object manifest handling ([pr#42633](https://github.com/ceph/ceph/pull/42633), Mark Kogan)

- rgw: Improve error message on email id reuse ([pr#41783](https://github.com/ceph/ceph/pull/41783), Ponnuvel Palaniyappan)

- rgw: objectlock: improve client error messages ([pr#40693](https://github.com/ceph/ceph/pull/40693), Matt Benjamin)

- rgw: parse tenant name out of rgwx-bucket-instance ([pr#42231](https://github.com/ceph/ceph/pull/42231), Casey Bodley)

- rgw: radosgw-admin errors if marker not specified on data/mdlog trim ([pr#42640](https://github.com/ceph/ceph/pull/42640), Adam C. Emerson)

- rgw: remove quota soft threshold ([pr#42634](https://github.com/ceph/ceph/pull/42634), Zulai Wang)

- rgw: require bucket name in bucket chown ([pr#42323](https://github.com/ceph/ceph/pull/42323), Zulai Wang)

- rgw: when deleted obj removed in versioned bucket, extra del-marker added ([pr#42645](https://github.com/ceph/ceph/pull/42645), J. Eric Ivancich)

- rpm/luarocks: simplify conditional and support Leap 15.3 ([pr#42561](https://github.com/ceph/ceph/pull/42561), Nathan Cutler)

- rpm: drop use of $FIRST\_ARG in ceph-immutable-object-cache ([pr#42480](https://github.com/ceph/ceph/pull/42480), Nathan Cutler)

- run-make-check<span></span>.sh: Increase failure output log size ([pr#42850](https://github.com/ceph/ceph/pull/42850), David Galloway)

- SimpleRADOSStriper: use debug\_cephsqlite ([pr#42659](https://github.com/ceph/ceph/pull/42659), Patrick Donnelly)

- src/pybind/mgr/mirroring/fs/snapshot\_mirror.py: do not assume a cephf… ([pr#42226](https://github.com/ceph/ceph/pull/42226), Sébastien Han)

- test/rgw: fix use of poll() with timers in unittest\_rgw\_dmclock\_scheduler ([pr#42651](https://github.com/ceph/ceph/pull/42651), Casey Bodley)

- Warning Cleanup and Clang Compile Fix ([pr#40692](https://github.com/ceph/ceph/pull/40692), Adam C. Emerson)

- workunits/rgw: semicolon terminates perl statements ([pr#43168](https://github.com/ceph/ceph/pull/43168), Matt Benjamin)
