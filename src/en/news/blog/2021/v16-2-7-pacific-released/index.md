---
title: "v16.2.7 Pacific released"
date: "2021-12-07"
author: "dgalloway"
tags:
  - "release"
  - "pacific"
---

This is the seventh backport release in the Pacific series. We recommend all users update to this release.

## Notable Changes

- Critical bug in OMAP format upgrade is fixed. This could cause data corruption (improperly formatted OMAP keys) after pre-Pacific cluster upgrade if bluestore-quick-fix-on-mount parameter is set to true or ceph-bluestore-tool's quick-fix/repair commands are invoked. Relevant tracker: https://tracker.ceph.com/issues/53062. ``bluestore-quick-fix-on-mount`` continues to be set to false, by default.

- MGR: The pg_autoscaler will use the 'scale-up' profile as the default profile. 16.2.6 changed the default profile to 'scale-down' but we ran into issues with the device_health_metrics pool consuming too many PGs, which is not ideal for performance. So we will continue to use the 'scale-up' profile by default,  until we implement a limit on the number of PGs default pools should consume, in combination with the 'scale-down' profile.

- Cephadm & Ceph Dashboard: NFS management has been completely reworked to ensure that NFS exports are managed consistently across the different Ceph components. Prior to this, there were 3 incompatible implementations for configuring the NFS exports: Ceph-Ansible/OpenStack Manila, Ceph Dashboard and 'mgr/nfs' module. With this release the 'mgr/nfs' way becomes the official interface, and the remaining components (Cephadm and Ceph Dashboard) adhere to it. While this might require manually migrating from the deprecated implementations, it will simplify the user experience for those heavily relying on NFS exports.

- Dashboard: "Cluster Expansion Wizard". After the 'cephadm bootstrap' step, users that log into the Ceph Dashboard will be presented with a welcome screen. If they choose to follow the installation wizard, they will be guided through a set of steps to help them configure their Ceph cluster: expanding the cluster by adding more hosts, detecting and defining their storage devices, and finally deploying and configuring the different Ceph services.

- OSD: When using mclock_scheduler for QoS, there is no longer a need to run any manual benchmark. The OSD now automatically sets an appropriate value for osd_mclock_max_capacity_iops by running a simple benchmark during initialization.

- MGR: The global recovery event in the progress module has been optimized and a sleep_interval of 5 seconds has been added between stats collection, to reduce the impact of the progress module on the MGR, especially in large clusters.

## Changelog
- \*: s/virtualenv/python -m venv/ ([pr#43002](https://github.com/ceph/ceph/pull/43002), Kefu Chai, Ken Dreyer)

- admin/doc-requirements<span></span>.txt: pin Sphinx at 3<span></span>.5<span></span>.4 ([pr#43748](https://github.com/ceph/ceph/pull/43748), Kefu Chai)

- backport mgr/nfs bits ([pr#43811](https://github.com/ceph/ceph/pull/43811), Sage Weil, Michael Fritch)

- ceph-volume: `get\_first\_lv()` refactor ([pr#43960](https://github.com/ceph/ceph/pull/43960), Guillaume Abrioux)

- ceph-volume: fix a typo causing AttributeError ([pr#43949](https://github.com/ceph/ceph/pull/43949), Taha Jahangir)

- ceph-volume: fix bug with miscalculation of required db/wal slot size for VGs with multiple PVs ([pr#43948](https://github.com/ceph/ceph/pull/43948), Guillaume Abrioux, Cory Snyder)

- ceph-volume: fix lvm activate --all --no-systemd ([pr#43267](https://github.com/ceph/ceph/pull/43267), Dimitri Savineau)

- ceph-volume: util/prepare fix osd\_id\_available() ([pr#43708](https://github.com/ceph/ceph/pull/43708), Guillaume Abrioux)

- ceph<span></span>.spec: selinux scripts respect CEPH\_AUTO\_RESTART\_ON\_UPGRADE ([pr#43235](https://github.com/ceph/ceph/pull/43235), Dan van der Ster)

- cephadm: November batch ([pr#43906](https://github.com/ceph/ceph/pull/43906), Sebastian Wagner, Sage Weil, Daniel Pivonka, Andrew Sharapov, Paul Cuzner, Adam King, Melissa Li)

- cephadm: October batch ([pr#43728](https://github.com/ceph/ceph/pull/43728), Patrick Donnelly, Sage Weil, Cory Snyder, Sebastian Wagner, Paul Cuzner, Joao Eduardo Luis, Zac Dover, Dmitry Kvashnin, Daniel Pivonka, Adam King, jianglong01, Guillaume Abrioux, Melissa Li, Roaa Sakr, Kefu Chai, Brad Hubbard, Michael Fritch, Javier Cacheiro)

- cephfs-mirror, test: add thrasher for cephfs mirror daemon, HA test yamls ([issue#50372](http://tracker.ceph.com/issues/50372), [pr#43924](https://github.com/ceph/ceph/pull/43924), Venky Shankar)

- cephfs-mirror: shutdown ClusterWatcher on termination ([pr#43198](https://github.com/ceph/ceph/pull/43198), Willem Jan Withagen, Venky Shankar)

- cmake: link Threads::Threads instead of CMAKE\_THREAD\_LIBS\_INIT ([pr#43167](https://github.com/ceph/ceph/pull/43167), Ken Dreyer)

- cmake: s/Python\_EXECUTABLE/Python3\_EXECUTABLE/ ([pr#43264](https://github.com/ceph/ceph/pull/43264), Michael Fritch)

- crush: cancel upmaps with up set size != pool size ([pr#43415](https://github.com/ceph/ceph/pull/43415), huangjun)

- doc/radosgw/nfs: add note about NFSv3 deprecation ([pr#43941](https://github.com/ceph/ceph/pull/43941), Michael Fritch)

- doc: document subvolume (group) pins ([pr#43925](https://github.com/ceph/ceph/pull/43925), Patrick Donnelly)

- github: add dashboard PRs to Dashboard project ([pr#43610](https://github.com/ceph/ceph/pull/43610), Ernesto Puerta)

- librbd/cache/pwl: persistant cache backports ([pr#43772](https://github.com/ceph/ceph/pull/43772), Kefu Chai, Yingxin Cheng, Yin Congmin, Feng Hualong, Jianpeng Ma, Ilya Dryomov, Hualong Feng)

- librbd/cache/pwl: SSD caching backports ([pr#43918](https://github.com/ceph/ceph/pull/43918), Yin Congmin, Jianpeng Ma)

- librbd/object\_map: rbd diff between two snapshots lists entire image content ([pr#43805](https://github.com/ceph/ceph/pull/43805), Sunny Kumar)

- librbd: fix pool validation lockup ([pr#43113](https://github.com/ceph/ceph/pull/43113), Ilya Dryomov)

- mds/FSMap: do not assert allow\_standby\_replay on old FSMaps ([pr#43614](https://github.com/ceph/ceph/pull/43614), Patrick Donnelly)

- mds: Add new flag to MClientSession ([pr#43251](https://github.com/ceph/ceph/pull/43251), Kotresh HR)

- mds: do not trim stray dentries during opening the root ([pr#43815](https://github.com/ceph/ceph/pull/43815), Xiubo Li)

- mds: skip journaling blocklisted clients when in `replay` state ([pr#43841](https://github.com/ceph/ceph/pull/43841), Venky Shankar)

- mds: switch mds\_lock to fair mutex to fix the slow performance issue ([pr#43148](https://github.com/ceph/ceph/pull/43148), Xiubo Li, Kefu Chai)

- MDSMonitor: assertion during upgrade to v16<span></span>.2<span></span>.5+ ([pr#43890](https://github.com/ceph/ceph/pull/43890), Patrick Donnelly)

- MDSMonitor: handle damaged state from standby-replay ([pr#43200](https://github.com/ceph/ceph/pull/43200), Patrick Donnelly)

- MDSMonitor: no active MDS after cluster deployment ([pr#43891](https://github.com/ceph/ceph/pull/43891), Patrick Donnelly)

- mgr/dashboard,prometheus: fix handling of server\_addr ([issue#52002](http://tracker.ceph.com/issues/52002), [pr#43631](https://github.com/ceph/ceph/pull/43631), Scott Shambarger)

- mgr/dashboard: all pyfakefs must be pinned on same version ([pr#43930](https://github.com/ceph/ceph/pull/43930), Rishabh Dave)

- mgr/dashboard: BATCH incl<span></span>.: NFS integration, Cluster Expansion Workflow, and Angular 11 upgrade ([pr#43682](https://github.com/ceph/ceph/pull/43682), Alfonso Martínez, Avan Thakkar, Aashish Sharma, Nizamudeen A, Pere Diaz Bou, Varsha Rao, Ramana Raja, Sage Weil, Kefu Chai)

- mgr/dashboard: cephfs MDS Workload to use rate for counter type metric ([pr#43190](https://github.com/ceph/ceph/pull/43190), Jan Horacek)

- mgr/dashboard: clean-up controllers and API backward versioning compatibility ([pr#43543](https://github.com/ceph/ceph/pull/43543), Ernesto Puerta, Avan Thakkar)

- mgr/dashboard: Daemon Events listing using bootstrap class ([pr#44057](https://github.com/ceph/ceph/pull/44057), Nizamudeen A)

- mgr/dashboard: deprecated variable usage in Grafana dashboards ([pr#43188](https://github.com/ceph/ceph/pull/43188), Patrick Seidensal)

- mgr/dashboard: Device health status is not getting listed under hosts section ([pr#44053](https://github.com/ceph/ceph/pull/44053), Aashish Sharma)

- mgr/dashboard: Edit a service feature ([pr#43939](https://github.com/ceph/ceph/pull/43939), Nizamudeen A)

- mgr/dashboard: Fix failing config dashboard e2e check ([pr#43238](https://github.com/ceph/ceph/pull/43238), Nizamudeen A)

- mgr/dashboard: fix flaky inventory e2e test ([pr#44056](https://github.com/ceph/ceph/pull/44056), Nizamudeen A)

- mgr/dashboard: fix missing alert rule details ([pr#43812](https://github.com/ceph/ceph/pull/43812), Ernesto Puerta)

- mgr/dashboard: Fix orchestrator/01-hosts<span></span>.e2e-spec<span></span>.ts failure ([pr#43541](https://github.com/ceph/ceph/pull/43541), Nizamudeen A)

- mgr/dashboard: include mfa\_ids in rgw user-details section ([pr#43893](https://github.com/ceph/ceph/pull/43893), Avan Thakkar)

- mgr/dashboard: Incorrect MTU mismatch warning ([pr#43185](https://github.com/ceph/ceph/pull/43185), Aashish Sharma)

- mgr/dashboard: monitoring: grafonnet refactoring for radosgw dashboards ([pr#43644](https://github.com/ceph/ceph/pull/43644), Aashish Sharma)

- mgr/dashboard: Move force maintenance test to the workflow test suite ([pr#43347](https://github.com/ceph/ceph/pull/43347), Nizamudeen A)

- mgr/dashboard: pin a version for autopep8 and pyfakefs ([pr#43646](https://github.com/ceph/ceph/pull/43646), Nizamudeen A)

- mgr/dashboard: Predefine labels in create host form ([pr#44077](https://github.com/ceph/ceph/pull/44077), Nizamudeen A)

- mgr/dashboard: provisioned values is misleading in RBD image table ([pr#44051](https://github.com/ceph/ceph/pull/44051), Avan Thakkar)

- mgr/dashboard: replace "Ceph-cluster" Client connections with active-standby MGRs ([pr#43523](https://github.com/ceph/ceph/pull/43523), Avan Thakkar)

- mgr/dashboard: rgw daemon list: add realm column ([pr#44047](https://github.com/ceph/ceph/pull/44047), Alfonso Martínez)

- mgr/dashboard: Spelling mistake in host-form Network address field ([pr#43973](https://github.com/ceph/ceph/pull/43973), Avan Thakkar)

- mgr/dashboard: Visual regression tests for ceph dashboard ([pr#42678](https://github.com/ceph/ceph/pull/42678), Aaryan Porwal)

- mgr/dashboard: visual tests: Add more ignore regions for dashboard component ([pr#43240](https://github.com/ceph/ceph/pull/43240), Aaryan Porwal)

- mgr/influx: use "N/A" for unknown hostname ([pr#43368](https://github.com/ceph/ceph/pull/43368), Kefu Chai)

- mgr/mirroring: remove unnecessary fs\_name arg from daemon status command ([issue#51989](http://tracker.ceph.com/issues/51989), [pr#43199](https://github.com/ceph/ceph/pull/43199), Venky Shankar)

- mgr/nfs: nfs-rgw batch backport ([pr#43075](https://github.com/ceph/ceph/pull/43075), Sebastian Wagner, Sage Weil, Varsha Rao, Ramana Raja)

- mgr/progress: optimize global recovery && introduce 5 seconds interval ([pr#43353](https://github.com/ceph/ceph/pull/43353), Kamoltat, Neha Ojha)

- mgr/prometheus: offer ability to disable cache ([pr#43931](https://github.com/ceph/ceph/pull/43931), Patrick Seidensal)

- mgr/volumes: Fix permission during subvol creation with mode ([pr#43223](https://github.com/ceph/ceph/pull/43223), Kotresh HR)

- mgr: Add check to prevent mgr from crashing ([pr#43445](https://github.com/ceph/ceph/pull/43445), Aswin Toni)

- mon,auth: fix proposal (and mon db rebuild) of rotating secrets ([pr#43697](https://github.com/ceph/ceph/pull/43697), Sage Weil)

- mon/MDSMonitor: avoid crash when decoding old FSMap epochs ([pr#43615](https://github.com/ceph/ceph/pull/43615), Patrick Donnelly)

- mon: Allow specifying new tiebreaker monitors ([pr#43457](https://github.com/ceph/ceph/pull/43457), Greg Farnum)

- mon: MonMap: display disallowed\_leaders whenever they're set ([pr#43972](https://github.com/ceph/ceph/pull/43972), Greg Farnum)

- mon: MonMap: do not increase mon\_info\_t's compatv in stretch mode, really ([pr#43971](https://github.com/ceph/ceph/pull/43971), Greg Farnum)

- monitoring: ethernet bonding filter in Network Load ([pr#43694](https://github.com/ceph/ceph/pull/43694), Pere Diaz Bou)

- msg/async/ProtocolV2: Set the recv\_stamp at the beginning of receiving a message ([pr#43511](https://github.com/ceph/ceph/pull/43511), dongdong tao)

- msgr/async: fix unsafe access in unregister\_conn() ([pr#43548](https://github.com/ceph/ceph/pull/43548), Sage Weil, Radoslaw Zarzynski)

- os/bluestore: \_do\_write\_small fix head\_pad ([pr#43756](https://github.com/ceph/ceph/pull/43756), dheart)

- os/bluestore: do not select absent device in volume selector ([pr#43970](https://github.com/ceph/ceph/pull/43970), Igor Fedotov)

- os/bluestore: fix invalid omap name conversion when upgrading to per-pg ([pr#43793](https://github.com/ceph/ceph/pull/43793), Igor Fedotov)

- os/bluestore: list obj which equals to pend ([pr#43512](https://github.com/ceph/ceph/pull/43512), Mykola Golub, Kefu Chai)

- os/bluestore: multiple repair fixes ([pr#43731](https://github.com/ceph/ceph/pull/43731), Igor Fedotov)

- osd/OSD: mkfs need wait for transcation completely finish ([pr#43417](https://github.com/ceph/ceph/pull/43417), Chen Fan)

- osd: fix partial recovery become whole object recovery after restart osd ([pr#43513](https://github.com/ceph/ceph/pull/43513), Jianwei Zhang)

- osd: fix to allow inc manifest leaked ([pr#43306](https://github.com/ceph/ceph/pull/43306), Myoungwon Oh)

- osd: fix to recover adjacent clone when set\_chunk is called ([pr#43099](https://github.com/ceph/ceph/pull/43099), Myoungwon Oh)

- osd: handle inconsistent hash info during backfill and deep scrub gracefully ([pr#43544](https://github.com/ceph/ceph/pull/43544), Ronen Friedman, Mykola Golub)

- osd: re-cache peer\_bytes on every peering state activate ([pr#43437](https://github.com/ceph/ceph/pull/43437), Mykola Golub)

- osd: Run osd bench test to override default max osd capacity for mclock ([pr#41731](https://github.com/ceph/ceph/pull/41731), Sridhar Seshasayee)

- Pacific: BlueStore: Omap upgrade to per-pg fix fix ([pr#43922](https://github.com/ceph/ceph/pull/43922), Adam Kupczyk)

- Pacific: client: do not defer releasing caps when revoking ([pr#43782](https://github.com/ceph/ceph/pull/43782), Xiubo Li)

- Pacific: mds: add read/write io size metrics support ([pr#43784](https://github.com/ceph/ceph/pull/43784), Xiubo Li)

- Pacific: test/libcephfs: put inodes after lookup ([pr#43562](https://github.com/ceph/ceph/pull/43562), Patrick Donnelly)

- pybind/mgr/cephadm: set allow\_standby\_replay during CephFS upgrade ([pr#43559](https://github.com/ceph/ceph/pull/43559), Patrick Donnelly)

- pybind/mgr/CMakeLists<span></span>.txt: exclude files not used at runtime ([pr#43787](https://github.com/ceph/ceph/pull/43787), Duncan Bellamy)

- pybind/mgr/pg\_autoscale: revert to default profile scale-up ([pr#44032](https://github.com/ceph/ceph/pull/44032), Kamoltat)

- qa/mgr/dashboard/test\_pool: don't check HEALTH\_OK ([pr#43440](https://github.com/ceph/ceph/pull/43440), Ernesto Puerta)

- qa/mgr/dashboard: add extra wait to test ([pr#43351](https://github.com/ceph/ceph/pull/43351), Ernesto Puerta)

- qa/rgw: pacific branch targets ceph-pacific branch of java\_s3tests ([pr#43809](https://github.com/ceph/ceph/pull/43809), Casey Bodley)

- qa/suites/orch/cephadm: mgr-nfs-upgrade: add missing 0-distro dir ([pr#44201](https://github.com/ceph/ceph/pull/44201), Sebastian Wagner)

- qa/tasks/kubeadm: force docker cgroup engine to systemd ([pr#43937](https://github.com/ceph/ceph/pull/43937), Sage Weil)

- qa/tasks/mgr: skip test\_diskprediction\_local on python>=3<span></span>.8 ([pr#43421](https://github.com/ceph/ceph/pull/43421), Kefu Chai)

- qa/tests: advanced version to reflect the latest 16<span></span>.2<span></span>.6 release ([pr#43242](https://github.com/ceph/ceph/pull/43242), Yuri Weinstein)

- qa: disable metrics on kernel client during upgrade ([pr#44034](https://github.com/ceph/ceph/pull/44034), Patrick Donnelly)

- qa: lengthen grace for fs map showing dead MDS ([pr#43702](https://github.com/ceph/ceph/pull/43702), Patrick Donnelly)

- qa: miscellaneous perf suite fixes ([pr#44154](https://github.com/ceph/ceph/pull/44154), Neha Ojha)

- qa: reduce frag split confs for dir\_split counter test ([pr#43828](https://github.com/ceph/ceph/pull/43828), Patrick Donnelly)

- rbd-mirror: fix mirror image removal ([pr#43662](https://github.com/ceph/ceph/pull/43662), Arthur Outhenin-Chalandre)

- rbd-mirror: unbreak one-way snapshot-based mirroring ([pr#43315](https://github.com/ceph/ceph/pull/43315), Ilya Dryomov)

- rgw/notification: make notifications agnostic of bucket reshard ([pr#42946](https://github.com/ceph/ceph/pull/42946), Yuval Lifshitz)

- rgw/notifications: cache object size to avoid accessing invalid memory ([pr#42949](https://github.com/ceph/ceph/pull/42949), Yuval Lifshitz)

- rgw/notifications: send correct size in case of delete marker creation ([pr#42643](https://github.com/ceph/ceph/pull/42643), Yuval Lifshitz)

- rgw/notifications: support v4 auth for topics and notifications ([pr#42947](https://github.com/ceph/ceph/pull/42947), Yuval Lifshitz)

- rgw/rgw\_rados: make RGW request IDs non-deterministic ([pr#43695](https://github.com/ceph/ceph/pull/43695), Cory Snyder)

- rgw/sts: fix for copy object operation using sts ([pr#43703](https://github.com/ceph/ceph/pull/43703), Pritha Srivastava)

- rgw/tracing: unify SO version numbers within librgw2 package ([pr#43619](https://github.com/ceph/ceph/pull/43619), Nathan Cutler)

- rgw: add abstraction for ops log destination and add file logger ([pr#43740](https://github.com/ceph/ceph/pull/43740), Casey Bodley, Cory Snyder)

- rgw: Ensure buckets too old to decode a layout have layout logs ([pr#43823](https://github.com/ceph/ceph/pull/43823), Adam C. Emerson)

- rgw: fix bucket purge incomplete multipart uploads ([pr#43862](https://github.com/ceph/ceph/pull/43862), J. Eric Ivancich)

- rgw: fix spelling of eTag in S3 message structure ([pr#42945](https://github.com/ceph/ceph/pull/42945), Tom Schoonjans)

- rgw: fix sts memory leak ([pr#43348](https://github.com/ceph/ceph/pull/43348), yuliyang_yewu)

- rgw: remove prefix & delim params for bucket removal & mp upload abort ([pr#43975](https://github.com/ceph/ceph/pull/43975), J. Eric Ivancich)

- rgw: use existing s->bucket in s3 website retarget() ([pr#43777](https://github.com/ceph/ceph/pull/43777), Casey Bodley)

- rpm, debian: move smartmontools and nvme-cli to ceph-base ([pr#44164](https://github.com/ceph/ceph/pull/44164), Yaarit Hatuka)

- snap-schedule: count retained snapshots per retention policy ([pr#43434](https://github.com/ceph/ceph/pull/43434), Jan Fajerski)

- test: shutdown the mounter after test finishes ([pr#43475](https://github.com/ceph/ceph/pull/43475), Xiubo Li)
