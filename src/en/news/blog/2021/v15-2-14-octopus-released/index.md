---
title: "v15.2.14 Octopus released"
date: "2021-08-05"
author: "dgalloway"
---

This is the 14th backport release in the Octopus series. We recommend all users update to this release.

## Notable Changes


- RGW: It is possible to specify ssl options and ciphers for beast frontend now. The default ssl options setting is "no_sslv2:no_sslv3:no_tlsv1:no_tlsv1_1". If you want to return back the old behavior add 'ssl_options=' (empty) to rgw frontends configuration.

- CephFS: old clusters (pre-Jewel) that did not use CephFS have legacy data structures in the ceph-mon stores. These structures are not understood by Pacific monitors. With Octopus v15.2.14, the monitors have been taught to flush and trim these old structures out in preparation for an upgrade to Pacific or Quincy. For more information, see [Issue 51673](https://tracker.ceph.com/issues/51673).

- ceph-mgr-modules-core debian package does not recommend ceph-mgr-rook anymore. As the latter depends on python3-numpy which cannot be imported in different Python sub-interpreters multi-times if the version of python3-numpy is older than 1.19. Since apt-get installs the Recommends packages by default, ceph-mgr-rook was always installed along with ceph-mgr debian package as an indirect dependency. If your workflow depends on this behavior, you might want to install ceph-mgr-rook separately.

- Several bug fixes in BlueStore, including a fix for an unexpected ENOSPC bug in Avl/Hybrid allocators.

- Includes a fix for a bug that affects recovery below `min_size` for EC pools.


## Changelog

- bind on loopback address if no other addresses are available ([pr#42478](https://github.com/ceph/ceph/pull/42478), Kefu Chai, Matthew Oliver)

- bluestore: use string\_view and strip trailing slash for dir listing ([pr#41757](https://github.com/ceph/ceph/pull/41757), Jonas Jelten, Kefu Chai)

- ceph-volume/tests: update ansible environment variables in tox ([pr#42491](https://github.com/ceph/ceph/pull/42491), Dimitri Savineau)

- ceph-volume: Consider /dev/root as mounted ([pr#41584](https://github.com/ceph/ceph/pull/41584), David Caro)

- ceph-volume: implement bluefs volume migration ([pr#42377](https://github.com/ceph/ceph/pull/42377), Igor Fedotov, Kefu Chai)

- ceph: ignore BrokenPipeError when printing help ([pr#41586](https://github.com/ceph/ceph/pull/41586), Ernesto Puerta)

- cephadm: fix escaping/quoting of stderr-prefix arg for ceph daemons ([pr#40948](https://github.com/ceph/ceph/pull/40948), Michael Fritch, Sage Weil)

- cephadm: fix port\_in\_use when IPv6 is disabled ([pr#41602](https://github.com/ceph/ceph/pull/41602), Patrick Seidensal)

- cephfs: client: add ability to lookup snapped inodes by inode number ([pr#40768](https://github.com/ceph/ceph/pull/40768), Jeff Layton, Xiubo Li)

- cls/rgw: look for plain entries in non-ascii plain namespace too ([pr#41775](https://github.com/ceph/ceph/pull/41775), Mykola Golub)

- cmake: build static libs if they are internal ones ([pr#39904](https://github.com/ceph/ceph/pull/39904), Kefu Chai)

- crush/crush: ensure alignof(crush\_work\_bucket) is 1 ([pr#41622](https://github.com/ceph/ceph/pull/41622), Kefu Chai)

- debian/control: ceph-mgr-modules-core does not Recommend ceph-mgr-rook ([pr#41878](https://github.com/ceph/ceph/pull/41878), Kefu Chai)

- doc/rados/operations: s/max\_misplaced/target\_max\_misplaced\_ratio/ ([pr#41624](https://github.com/ceph/ceph/pull/41624), Kefu Chai)

- librbd: don't stop at the first unremovable image when purging ([pr#41663](https://github.com/ceph/ceph/pull/41663), Ilya Dryomov)

- librbd: global config overrides do not apply to in-use images ([pr#41763](https://github.com/ceph/ceph/pull/41763), Jason Dillaman)

- make-dist: refuse to run if script path contains a colon ([pr#41087](https://github.com/ceph/ceph/pull/41087), Nathan Cutler)

- mds: avoid journaling overhead for setxattr("ceph.dir.subvolume") for no-op case ([pr#41996](https://github.com/ceph/ceph/pull/41996), Patrick Donnelly)

- mds: completed\_requests -> num\_completed\_requests and dump num\_completed\_flushes ([pr#41625](https://github.com/ceph/ceph/pull/41625), Dan van der Ster)

- mds: fix cpu\_profiler asok crash ([pr#41767](https://github.com/ceph/ceph/pull/41767), liu shi)

- mds: place the journaler pointer under the mds\_lock ([pr#41626](https://github.com/ceph/ceph/pull/41626), Xiubo Li)

- mds: reject lookup ino requests for mds dirs ([pr#40782](https://github.com/ceph/ceph/pull/40782), Xiubo Li, Patrick Donnelly)

- MDSMonitor: monitor crash after upgrade from ceph 15.2.13 to 16.2.4 ([pr#42537](https://github.com/ceph/ceph/pull/42537), Patrick Donnelly)

- mgr/cephadm: fix prometheus alerts ([pr#41660](https://github.com/ceph/ceph/pull/41660), Paul Cuzner, Sage Weil, Patrick Seidensal)

- mgr/DaemonServer.cc: prevent mgr crashes caused by integer underflow that is triggered by large increases to pg\_num/pgp\_num ([pr#41764](https://github.com/ceph/ceph/pull/41764), Cory Snyder)

- mgr/DaemonServer: skip redundant update of pgp\_num\_actual ([pr#42420](https://github.com/ceph/ceph/pull/42420), Dan van der Ster)

- mgr/dashboard: Add configurable MOTD or wall notification ([pr#42412](https://github.com/ceph/ceph/pull/42412), Volker Theile)

- mgr/dashboard: cephadm-e2e job script: improvements ([pr#42586](https://github.com/ceph/ceph/pull/42586), Alfonso Martínez)

- mgr/dashboard: disable NFSv3 support in dashboard ([pr#41199](https://github.com/ceph/ceph/pull/41199), Volker Theile)

- mgr/dashboard: fix API docs link ([pr#41508](https://github.com/ceph/ceph/pull/41508), Avan Thakkar)

- mgr/dashboard: Fix bucket name input allowing space in the value ([pr#42241](https://github.com/ceph/ceph/pull/42241), Nizamudeen A)

- mgr/dashboard: fix bucket objects and size calculations ([pr#41647](https://github.com/ceph/ceph/pull/41647), Avan Thakkar)

- mgr/dashboard: fix for right sidebar nav icon not clickable ([pr#42015](https://github.com/ceph/ceph/pull/42015), Aaryan Porwal)

- mgr/dashboard: fix OSD out count ([pr#42154](https://github.com/ceph/ceph/pull/42154), 胡玮文)

- mgr/dashboard: fix OSDs Host details/overview grafana graphs ([issue#49769](http://tracker.ceph.com/issues/49769), [pr#41530](https://github.com/ceph/ceph/pull/41530), Alfonso Martínez, Michael Wodniok)

- mgr/Dashboard: Remove erroneous elements in hosts-overview Grafana dashboard ([pr#41649](https://github.com/ceph/ceph/pull/41649), Malcolm Holmes)

- mgr/dashboard: RGW buckets async validator performance enhancement and name constraints ([pr#42123](https://github.com/ceph/ceph/pull/42123), Nizamudeen A)

- mgr/dashboard: run cephadm-backend e2e tests with KCLI ([pr#42243](https://github.com/ceph/ceph/pull/42243), Alfonso Martínez)

- mgr/dashboard: show partially deleted RBDs ([pr#41887](https://github.com/ceph/ceph/pull/41887), Tatjana Dehler)

- mgr/dashboard: User database migration has been cut out ([pr#42142](https://github.com/ceph/ceph/pull/42142), Volker Theile)

- mgr/telemetry: pass leaderboard flag even w/o ident ([pr#41870](https://github.com/ceph/ceph/pull/41870), Sage Weil)

- mgr: do not load disabled modules ([pr#41617](https://github.com/ceph/ceph/pull/41617), Kefu Chai)

- mon/MonClient: tolerate a rotating key that is slightly out of date ([pr#41449](https://github.com/ceph/ceph/pull/41449), Ilya Dryomov)

- mon/OSDMonitor: drop stale failure\_info even if can\_mark\_down() ([pr#41618](https://github.com/ceph/ceph/pull/41618), Kefu Chai)

- mon: load stashed map before mkfs monmap ([pr#41621](https://github.com/ceph/ceph/pull/41621), Dan van der Ster)

- os/bluestore: compact db after bulk omap naming upgrade ([pr#42375](https://github.com/ceph/ceph/pull/42375), Igor Fedotov)

- os/bluestore: fix erroneous SharedBlob record removal during repair ([pr#42373](https://github.com/ceph/ceph/pull/42373), Igor Fedotov)

- os/bluestore: fix unexpected ENOSPC in Avl/Hybrid allocators ([pr#41658](https://github.com/ceph/ceph/pull/41658), Igor Fedotov)

- os/bluestore: introduce multithireading sync for bluestore's repairer ([pr#41613](https://github.com/ceph/ceph/pull/41613), Igor Fedotov)

- os/bluestore: Remove possibility of replay log and file inconsistency ([pr#42374](https://github.com/ceph/ceph/pull/42374), Adam Kupczyk)

- os/bluestore: tolerate zero length for allocators' init\\_[add/rm]\_free() ([pr#41612](https://github.com/ceph/ceph/pull/41612), Igor Fedotov)

- osd/osd\_type: use f->dump\_unsigned() when appropriate ([pr#42257](https://github.com/ceph/ceph/pull/42257), Kefu Chai)

- osd/PeeringState: fix acting\_set\_writeable min\_size check ([pr#41609](https://github.com/ceph/ceph/pull/41609), Samuel Just)

- osd/PG.cc: handle removal of pgmeta object ([pr#41623](https://github.com/ceph/ceph/pull/41623), Neha Ojha)

- osd: clear data digest when write\_trunc ([pr#41620](https://github.com/ceph/ceph/pull/41620), Zengran Zhang)

- osd: fix scrub reschedule bug ([pr#41972](https://github.com/ceph/ceph/pull/41972), wencong wan)

- osd: log snaptrim message to dout ([pr#42484](https://github.com/ceph/ceph/pull/42484), Arthur Outhenin-Chalandre)

- osd: move down peers out from peer\_purged ([pr#42239](https://github.com/ceph/ceph/pull/42239), Mykola Golub)

- pacific: pybind/ceph\_volume\_client: stat on empty string ([pr#42161](https://github.com/ceph/ceph/pull/42161), Patrick Donnelly)

- qa/\*/test\_envlibrados\_for\_rocksdb.sh: fix libarchive dependency ([pr#42618](https://github.com/ceph/ceph/pull/42618), Neha Ojha)

- qa/\*/test\_envlibrados\_for\_rocksdb.sh: install libarchive-3.3.3 ([pr#42421](https://github.com/ceph/ceph/pull/42421), Neha Ojha)

- qa/cephadm/upgrade: use v15.2.9 for cephadm tests ([pr#41568](https://github.com/ceph/ceph/pull/41568), Deepika Upadhyay)

- qa/config/rados: add dispatch delay testing params ([pr#42180](https://github.com/ceph/ceph/pull/42180), Deepika Upadhyay)

- qa/distros: move to latest version on supported distro's ([pr#41478](https://github.com/ceph/ceph/pull/41478), Josh Durgin, Yuri Weinstein, Deepika Upadhyay, Sage Weil, Kefu Chai, Patrick Donnelly, rakeshgm)

- qa/suites/rados/perf: pin to 18.04 ([pr#41922](https://github.com/ceph/ceph/pull/41922), Neha Ojha)

- qa/suites/rados: add simultaneous scrubs to the thrasher ([pr#42422](https://github.com/ceph/ceph/pull/42422), Ronen Friedman)

- qa/tasks/qemu: precise repos have been archived ([pr#41642](https://github.com/ceph/ceph/pull/41642), Ilya Dryomov)

- qa/upgrade: disable update\_features test\_notify with older client as lockowner ([pr#41511](https://github.com/ceph/ceph/pull/41511), Deepika Upadhyay)

- qa/upgrade: drop broken symlink, introduced in octopus only qa ([pr#42599](https://github.com/ceph/ceph/pull/42599), Deepika Upadhyay)

- qa/workunits/rbd: use bionic version of qemu-iotests for focal ([pr#42025](https://github.com/ceph/ceph/pull/42025), Ilya Dryomov)

- rbd-mirror: fix segfault in snapshot replayer shutdown ([pr#41502](https://github.com/ceph/ceph/pull/41502), Arthur Outhenin-Chalandre)

- rbd: retrieve global config overrides from the MONs ([pr#41836](https://github.com/ceph/ceph/pull/41836), Ilya Dryomov, Jason Dillaman)

- rgw : add check empty for sync url ([pr#41766](https://github.com/ceph/ceph/pull/41766), caolei)

- rgw/amqp/kafka: prevent concurrent shutdowns from happening ([pr#40381](https://github.com/ceph/ceph/pull/40381), Yuval Lifshitz)

- rgw/amqp/test: fix mock prototype for librabbitmq-0.11.0 ([pr#41418](https://github.com/ceph/ceph/pull/41418), Yuval Lifshitz)

- rgw/notifications: delete bucket notification object when empty ([pr#41412](https://github.com/ceph/ceph/pull/41412), Yuval Lifshitz)

- rgw/rgw\_file: Fix the return value of read() and readlink() ([pr#41416](https://github.com/ceph/ceph/pull/41416), Dai zhiwei, luo rixin)

- rgw/sts: read\_obj\_policy() consults iam\_user\_policies on ENOENT ([pr#41415](https://github.com/ceph/ceph/pull/41415), Casey Bodley)

- rgw: allow rgw-orphan-list to process multiple data pools ([pr#41417](https://github.com/ceph/ceph/pull/41417), J. Eric Ivancich)

- rgw: allow to set ssl options and ciphers for beast frontend ([pr#42368](https://github.com/ceph/ceph/pull/42368), Mykola Golub)

- rgw: Backport 51674 to Octopus ([pr#42347](https://github.com/ceph/ceph/pull/42347), Adam C. Emerson)

- rgw: check object locks in multi-object delete ([issue#47586](http://tracker.ceph.com/issues/47586), [pr#41031](https://github.com/ceph/ceph/pull/41031), Mark Houghton)

- rgw: fix bucket object listing when marker matches prefix ([pr#41413](https://github.com/ceph/ceph/pull/41413), J. Eric Ivancich)

- rgw: fix segfault related to explicit object manifest handling ([pr#41420](https://github.com/ceph/ceph/pull/41420), Mark Kogan)

- rgw: Improve error message on email id reuse ([pr#41784](https://github.com/ceph/ceph/pull/41784), Ponnuvel Palaniyappan)

- rgw: limit rgw\_gc\_max\_objs to RGW\_SHARDS\_PRIME\_1 ([pr#40383](https://github.com/ceph/ceph/pull/40383), Rafał Wądołowski)

- rgw: qa/tasks/barbican.py: fix year2021 problem ([pr#40385](https://github.com/ceph/ceph/pull/40385), Marcus Watts)

- rgw: radoslist incomplete multipart parts marker ([pr#40820](https://github.com/ceph/ceph/pull/40820), J. Eric Ivancich)

- rgw: require bucket name in bucket chown ([pr#41765](https://github.com/ceph/ceph/pull/41765), Zulai Wang)

- rgw: send headers of quota settings ([pr#41419](https://github.com/ceph/ceph/pull/41419), Or Friedmann)

- rpm: drop use of $FIRST\_ARG in ceph-immutable-object-cache ([pr#42509](https://github.com/ceph/ceph/pull/42509), Nathan Cutler)

- rpm: three spec file cleanups ([pr#42440](https://github.com/ceph/ceph/pull/42440), Nathan Cutler, Franck Bui)

- test: bump DecayCounter.steady acceptable error ([pr#41619](https://github.com/ceph/ceph/pull/41619), Patrick Donnelly)
