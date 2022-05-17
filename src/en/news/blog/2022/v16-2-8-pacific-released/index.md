---
title: "v16.2.8 Pacific released"
date: "2022-05-16"
author: "dgalloway"
tags:
  - "release"
  - "pacific"
---

This is the eighth backport release in the Pacific series. We recommend all users update to this release.

## Notable Changes

- MON/MGR: Pools can now be created with `--bulk` flag. Any pools created with `bulk` will use a profile of the `pg_autoscaler` that provides more performance from the start. However, any pools created without the `--bulk` flag will remain using it's old behavior by default. For more details, see: https://docs.ceph.com/en/latest/rados/operations/placement-groups/

- MGR: The pg_autoscaler can now be turned `on` and `off` globally with the `noautoscale` flag. By default this flag is unset and the default pg_autoscale mode remains the same. For more details, see: https://docs.ceph.com/en/latest/rados/operations/placement-groups/

- A health warning will now be reported if the `require-osd-release` flag is not set to the appropriate release after a cluster upgrade.

- CephFS: Upgrading Ceph Metadata Servers when using multiple active MDSs requires ensuring no pending stray entries which are directories are present for active ranks except rank 0. See https://docs.ceph.com/en/latest/releases/pacific/#upgrading-from-octopus-or-nautilus.

## Changelog
- [Revert] bluestore: set upper and lower bounds on rocksdb omap iterators ([pr#46092](https://github.com/ceph/ceph/pull/46092), Neha Ojha)

- admin/doc-requirements: bump sphinx to 4<span></span>.4<span></span>.0 ([pr#45876](https://github.com/ceph/ceph/pull/45876), Kefu Chai)

- auth,mon: don't log "unable to find a keyring" error when key is given ([pr#43313](https://github.com/ceph/ceph/pull/43313), Ilya Dryomov)

- backport nbd cookie support ([pr#45582](https://github.com/ceph/ceph/pull/45582), Prasanna Kumar Kalever)

- backport of monitoring related PRs ([pr#45980](https://github.com/ceph/ceph/pull/45980), Pere Diaz Bou, Travis Nielsen, Aashish Sharma, Nizamudeen A, Arthur Outhenin-Chalandre)

- bluestore: set upper and lower bounds on rocksdb omap iterators ([pr#45963](https://github.com/ceph/ceph/pull/45963), Cory Snyder)

- build: Add some debugging messages ([pr#45753](https://github.com/ceph/ceph/pull/45753), David Galloway)

- build: install-deps failing in docker build ([pr#45849](https://github.com/ceph/ceph/pull/45849), Nizamudeen A, Ernesto Puerta)

- ceph-fuse: perform cleanup if test\_dentry\_handling failed ([pr#45351](https://github.com/ceph/ceph/pull/45351), Nikhilkumar Shelke)

- ceph-volume: abort when passed devices have partitions ([pr#45146](https://github.com/ceph/ceph/pull/45146), Guillaume Abrioux)

- ceph-volume: don't use MultiLogger in find\_executable\_on\_host() ([pr#44701](https://github.com/ceph/ceph/pull/44701), Guillaume Abrioux)

- ceph-volume: fix error 'KeyError' with inventory ([pr#44884](https://github.com/ceph/ceph/pull/44884), Guillaume Abrioux)

- ceph-volume: fix regression introcuded via #43536 ([pr#44644](https://github.com/ceph/ceph/pull/44644), Guillaume Abrioux)

- ceph-volume: fix tags dict output in `lvm list` ([pr#44767](https://github.com/ceph/ceph/pull/44767), Guillaume Abrioux)

- ceph-volume: honour osd\_dmcrypt\_key\_size option ([pr#44973](https://github.com/ceph/ceph/pull/44973), Guillaume Abrioux)

- ceph-volume: human\_readable\_size() refactor ([pr#44209](https://github.com/ceph/ceph/pull/44209), Guillaume Abrioux)

- ceph-volume: improve mpath devices support ([pr#44789](https://github.com/ceph/ceph/pull/44789), Guillaume Abrioux)

- ceph-volume: make it possible to skip needs\_root() ([pr#44319](https://github.com/ceph/ceph/pull/44319), Guillaume Abrioux)

- ceph-volume: show RBD devices as not available ([pr#44708](https://github.com/ceph/ceph/pull/44708), Michael Fritch)

- ceph/admin: s/master/main ([pr#45596](https://github.com/ceph/ceph/pull/45596), Zac Dover)

- Cephadm Pacific Batch Backport April ([pr#45919](https://github.com/ceph/ceph/pull/45919), Adam King, Teoman ONAY, Redouane Kachach, Lukas Mayer, Melissa Li)

- Cephadm Pacific Batch Backport March ([pr#45716](https://github.com/ceph/ceph/pull/45716), Adam King, Redouane Kachach, Matan Breizman, wangyunqing)

- cephadm/ceph-volume: do not use lvm binary in containers ([pr#43954](https://github.com/ceph/ceph/pull/43954), Guillaume Abrioux, Sage Weil)

- cephadm: \_parse\_ipv6\_route: Fix parsing ifs w/o route ([pr#44877](https://github.com/ceph/ceph/pull/44877), Sebastian Wagner)

- cephadm: add shared\_ceph\_folder opt to ceph-volume subcommand ([pr#44880](https://github.com/ceph/ceph/pull/44880), Guillaume Abrioux)

- cephadm: check if cephadm is root after cli is parsed ([pr#44634](https://github.com/ceph/ceph/pull/44634), John Mulligan)

- cephadm: chown the prometheus data dir during redeploy ([pr#45046](https://github.com/ceph/ceph/pull/45046), Michael Fritch)

- cephadm: deal with ambiguity within normalize\_image\_digest ([pr#44632](https://github.com/ceph/ceph/pull/44632), Sebastian Wagner)

- cephadm: fix broken telemetry documentation link ([pr#45803](https://github.com/ceph/ceph/pull/45803), Laura Flores)

- cephadm: infer the default container image during pull ([pr#45569](https://github.com/ceph/ceph/pull/45569), Michael Fritch)

- cephadm: make extract\_uid\_gid errors more readable ([pr#44528](https://github.com/ceph/ceph/pull/44528), Sebastian Wagner)

- cephadm: November batch 2 ([pr#44446](https://github.com/ceph/ceph/pull/44446), Sage Weil, Adam King, Sebastian Wagner, Melissa Li, Michael Fritch, Guillaume Abrioux)

- cephadm: pass `CEPH\_VOLUME\_SKIP\_RESTORECON=yes` (backport) ([pr#44248](https://github.com/ceph/ceph/pull/44248), Guillaume Abrioux)

- cephadm: preserve `authorized\_keys` file during upgrade ([pr#45355](https://github.com/ceph/ceph/pull/45355), Michael Fritch)

- cephadm: Remove containers pids-limit ([pr#45580](https://github.com/ceph/ceph/pull/45580), Ilya Dryomov, Teoman ONAY)

- cephadm: revert pids limit ([pr#45936](https://github.com/ceph/ceph/pull/45936), Adam King)

- cephadm: validate that the constructed YumDnf baseurl is usable ([pr#44882](https://github.com/ceph/ceph/pull/44882), John Mulligan)

- cls/journal: skip disconnected clients when calculating min\_commit\_position ([pr#44690](https://github.com/ceph/ceph/pull/44690), Mykola Golub)

- cls/rbd: GroupSnapshotNamespace comparator violates ordering rules ([pr#45075](https://github.com/ceph/ceph/pull/45075), Ilya Dryomov)

- cmake/modules: always use the python3 specified in command line ([pr#45967](https://github.com/ceph/ceph/pull/45967), Kefu Chai)

- cmake: pass RTE\_DEVEL\_BUILD=n when building dpdk ([pr#45262](https://github.com/ceph/ceph/pull/45262), Kefu Chai)

- common/PriorityCache: low perf counters priorities for submodules ([pr#44175](https://github.com/ceph/ceph/pull/44175), Igor Fedotov)

- common: avoid pthread\_mutex\_unlock twice ([pr#45464](https://github.com/ceph/ceph/pull/45464), Dai Zhiwei)

- common: fix FTBFS due to dout & need\_dynamic on GCC-12 ([pr#45373](https://github.com/ceph/ceph/pull/45373), Radoslaw Zarzynski)

- common: fix missing name in PriorityCache perf counters ([pr#45588](https://github.com/ceph/ceph/pull/45588), Laura Flores)

- common: replace BitVector::NoInitAllocator with wrapper struct ([pr#45179](https://github.com/ceph/ceph/pull/45179), Casey Bodley)

- crush: Fix segfault in update\_from\_hook ([pr#44897](https://github.com/ceph/ceph/pull/44897), Adam Kupczyk)

- doc/cephadm: Add CentOS Stream install instructions ([pr#44996](https://github.com/ceph/ceph/pull/44996), Patrick C. F. Ernzer)

- doc/cephadm: Co-location of daemons ([pr#44879](https://github.com/ceph/ceph/pull/44879), Sebastian Wagner)

- doc/cephadm: Doc backport ([pr#44525](https://github.com/ceph/ceph/pull/44525), Foad Lind, Sebastian Wagner)

- doc/cephadm: improve the development doc a bit ([pr#44636](https://github.com/ceph/ceph/pull/44636), Radoslaw Zarzynski)

- doc/cephadm: remove duplicate deployment scenario section ([pr#44660](https://github.com/ceph/ceph/pull/44660), Melissa Li)

- doc/dev: s/repostory/repository/ (really) ([pr#45789](https://github.com/ceph/ceph/pull/45789), Zac Dover)

- doc/start: add testing support information ([pr#45989](https://github.com/ceph/ceph/pull/45989), Zac Dover)

- doc/start: include A<span></span>. D'Atri's hardware-recs recs ([pr#45298](https://github.com/ceph/ceph/pull/45298), Zac Dover)

- doc/start: remove journal info from hardware recs ([pr#45123](https://github.com/ceph/ceph/pull/45123), Zac Dover)

- doc/start: remove osd stub from hardware recs ([pr#45316](https://github.com/ceph/ceph/pull/45316), Zac Dover)

- doc: prerequisites fix for cephFS mount ([pr#44272](https://github.com/ceph/ceph/pull/44272), Nikhilkumar Shelke)

- doc: Use older mistune ([pr#44226](https://github.com/ceph/ceph/pull/44226), David Galloway)

- Enable autotune for osd\_memory\_target on bootstrap ([pr#44633](https://github.com/ceph/ceph/pull/44633), Melissa Li)

- krbd: return error when no initial monitor address found ([pr#45003](https://github.com/ceph/ceph/pull/45003), Burt Holzman)

- librados: check latest osdmap on ENOENT in pool\_reverse\_lookup() ([pr#45586](https://github.com/ceph/ceph/pull/45586), Ilya Dryomov)

- librbd/cache/pwl: misc backports ([pr#44199](https://github.com/ceph/ceph/pull/44199), Jianpeng Ma, Jason Dillaman)

- librbd: diff-iterate reports incorrect offsets in fast-diff mode ([pr#44547](https://github.com/ceph/ceph/pull/44547), Ilya Dryomov)

- librbd: fix use-after-free on ictx in list\_descendants() ([pr#44999](https://github.com/ceph/ceph/pull/44999), Ilya Dryomov, Wang ShuaiChao)

- librbd: fix various memory leaks ([pr#44998](https://github.com/ceph/ceph/pull/44998), Or Ozeri)

- librbd: make diff-iterate in fast-diff mode sort and merge reported extents ([pr#45638](https://github.com/ceph/ceph/pull/45638), Ilya Dryomov)

- librbd: readv/writev fix iovecs length computation overflow ([pr#45561](https://github.com/ceph/ceph/pull/45561), Jonas Pfefferle)

- librbd: restore diff-iterate include\_parent functionality in fast-diff mode ([pr#44594](https://github.com/ceph/ceph/pull/44594), Ilya Dryomov)

- librgw: make rgw file handle versioned ([pr#45495](https://github.com/ceph/ceph/pull/45495), Xuehan Xu)

- librgw: treat empty root path as "/" on mount ([pr#43968](https://github.com/ceph/ceph/pull/43968), Matt Benjamin)

- mds,client: add new getvxattr op ([pr#45487](https://github.com/ceph/ceph/pull/45487), Milind Changire)

- mds: add mds\_dir\_max\_entries config option ([pr#44512](https://github.com/ceph/ceph/pull/44512), Yongseok Oh)

- mds: directly return just after responding the link request ([pr#44620](https://github.com/ceph/ceph/pull/44620), Xiubo Li)

- mds: dump tree '/' when the path is empty ([pr#44622](https://github.com/ceph/ceph/pull/44622), Xiubo Li)

- mds: ensure that we send the btime in cap messages ([pr#45163](https://github.com/ceph/ceph/pull/45163), Jeff Layton)

- mds: fails to reintegrate strays if destdn's directory is full (ENOSPC) ([pr#44513](https://github.com/ceph/ceph/pull/44513), Patrick Donnelly)

- mds: fix seg fault in expire\_recursive ([pr#45099](https://github.com/ceph/ceph/pull/45099), 胡玮文)

- mds: ignore unknown client op when tracking op latency ([pr#44975](https://github.com/ceph/ceph/pull/44975), Venky Shankar)

- mds: kill session when mds do ms\_handle\_remote\_reset ([issue#53911](http://tracker.ceph.com/issues/53911), [pr#45100](https://github.com/ceph/ceph/pull/45100), YunfeiGuan)

- mds: mds\_oft\_prefetch\_dirfrags default to false ([pr#45016](https://github.com/ceph/ceph/pull/45016), Dan van der Ster)

- mds: opening connection to up:replay/up:creating daemon causes message drop ([pr#44296](https://github.com/ceph/ceph/pull/44296), Patrick Donnelly)

- mds: PurgeQueue<span></span>.cc fix for 32bit compilation ([pr#44168](https://github.com/ceph/ceph/pull/44168), Duncan Bellamy)

- mds: recursive scrub does not trigger stray reintegration ([pr#44514](https://github.com/ceph/ceph/pull/44514), Patrick Donnelly)

- mds: remove the duplicated or incorrect respond ([pr#44623](https://github.com/ceph/ceph/pull/44623), Xiubo Li)

- mds: reset heartbeat in each MDSContext complete() ([pr#44551](https://github.com/ceph/ceph/pull/44551), Xiubo Li)

- mgr/autoscaler: Introduce noautoscale flag ([pr#44540](https://github.com/ceph/ceph/pull/44540), Kamoltat)

- mgr/cephadm/iscsi: use `mon\_command` in `post\_remove` instead of `check\_mon\_command` ([pr#44830](https://github.com/ceph/ceph/pull/44830), Melissa Li)

- mgr/cephadm: Add client<span></span>.admin keyring when upgrading from older version ([pr#44625](https://github.com/ceph/ceph/pull/44625), Sebastian Wagner)

- mgr/cephadm: add keep-alive requests to ssh connections ([pr#45632](https://github.com/ceph/ceph/pull/45632), Adam King)

- mgr/cephadm: Add snmp-gateway service support ([pr#44529](https://github.com/ceph/ceph/pull/44529), Sebastian Wagner, Paul Cuzner)

- mgr/cephadm: allow miscellaneous container args at service level ([pr#44829](https://github.com/ceph/ceph/pull/44829), Adam King)

- mgr/cephadm: auto-enable mirroring module when deploying service ([pr#44661](https://github.com/ceph/ceph/pull/44661), John Mulligan)

- mgr/cephadm: avoid repeated calls to get\_module\_option ([pr#44535](https://github.com/ceph/ceph/pull/44535), Sage Weil)

- mgr/cephadm: block draining last \_admin host ([pr#45229](https://github.com/ceph/ceph/pull/45229), Adam King)

- mgr/cephadm: block removing last instance of \_admin label ([pr#45231](https://github.com/ceph/ceph/pull/45231), Adam King)

- mgr/cephadm: Delete ceph<span></span>.target if last cluster ([pr#45228](https://github.com/ceph/ceph/pull/45228), Redouane Kachach)

- mgr/cephadm: extend extra\_container\_args to other service types ([pr#45234](https://github.com/ceph/ceph/pull/45234), Adam King)

- mgr/cephadm: fix 'cephadm osd activate' on existing osd devices ([pr#44627](https://github.com/ceph/ceph/pull/44627), Sage Weil)

- mgr/cephadm: fix 'mgr/cephadm: spec<span></span>.virtual\_ip  param should be used by the ingress daemon ([pr#44628](https://github.com/ceph/ceph/pull/44628), Guillaume Abrioux, Francesco Pantano, Sebastian Wagner)

- mgr/cephadm: Fix count for OSDs with OSD specs ([pr#44629](https://github.com/ceph/ceph/pull/44629), Sebastian Wagner)

- mgr/cephadm: fix minor grammar nit in Dry-Runs message ([pr#44637](https://github.com/ceph/ceph/pull/44637), James McClune)

- mgr/cephadm: fix tcmu-runner cephadm\_stray\_daemon ([pr#44630](https://github.com/ceph/ceph/pull/44630), Melissa Li)

- mgr/cephadm: Fix test\_facts ([pr#44530](https://github.com/ceph/ceph/pull/44530), Sebastian Wagner)

- mgr/cephadm: less log noise when config checks fail ([pr#44526](https://github.com/ceph/ceph/pull/44526), Sage Weil)

- mgr/cephadm: nfs migration: avoid port conflicts ([pr#44631](https://github.com/ceph/ceph/pull/44631), Sebastian Wagner)

- mgr/cephadm: Show an error when invalid format ([pr#45226](https://github.com/ceph/ceph/pull/45226), Redouane Kachach)

- mgr/cephadm: store contianer registry credentials in config-key ([pr#44658](https://github.com/ceph/ceph/pull/44658), Daniel Pivonka)

- mgr/cephadm: try to get FQDN for configuration files ([pr#45620](https://github.com/ceph/ceph/pull/45620), Tatjana Dehler)

- mgr/cephadm: update monitoring stack versions ([pr#45940](https://github.com/ceph/ceph/pull/45940), Aashish Sharma, Ernesto Puerta)

- mgr/cephadm: validating service\_id for MDS ([pr#45227](https://github.com/ceph/ceph/pull/45227), Redouane Kachach)

- mgr/dashboard: "Please expand your cluster first" shouldn't be shown if cluster is already meaningfully running ([pr#45044](https://github.com/ceph/ceph/pull/45044), Volker Theile)

- mgr/dashboard: add test coverage for API docs (SwaggerUI) ([pr#44533](https://github.com/ceph/ceph/pull/44533), Alfonso Martínez)

- mgr/dashboard: avoid tooltip if disk\_usage=null and fast-diff enabled ([pr#44149](https://github.com/ceph/ceph/pull/44149), Avan Thakkar)

- mgr/dashboard: cephadm e2e job improvements ([pr#44938](https://github.com/ceph/ceph/pull/44938), Nizamudeen A, Alfonso Martínez)

- mgr/dashboard: cephadm e2e job: improvements ([pr#44382](https://github.com/ceph/ceph/pull/44382), Alfonso Martínez)

- mgr/dashboard: change privacy protocol field from required to optional ([pr#45052](https://github.com/ceph/ceph/pull/45052), Avan Thakkar)

- mgr/dashboard: Cluster Expansion - Review Section: fixes and improvements ([pr#44389](https://github.com/ceph/ceph/pull/44389), Aashish Sharma)

- mgr/dashboard: Compare values of MTU alert by device ([pr#45813](https://github.com/ceph/ceph/pull/45813), Aashish Sharma, Patrick Seidensal)

- mgr/dashboard: dashboard does not show degraded objects if they are less than 0<span></span>.5% under "Dashboard->Capacity->Objects block ([pr#44091](https://github.com/ceph/ceph/pull/44091), Aashish Sharma)

- mgr/dashboard: dashboard turns telemetry off when configuring report ([pr#45111](https://github.com/ceph/ceph/pull/45111), Sarthak0702, Aaryan Porwal)

- mgr/dashboard: datatable in Cluster Host page hides wrong column on selection ([pr#45861](https://github.com/ceph/ceph/pull/45861), Sarthak0702)

- mgr/dashboard: Directories Menu Can't Use on Ceph File System Dashboard ([pr#45028](https://github.com/ceph/ceph/pull/45028), Sarthak0702)

- mgr/dashboard: extend daemon actions to host details ([pr#45721](https://github.com/ceph/ceph/pull/45721), Nizamudeen A)

- mgr/dashboard: fix api test issue with pip ([pr#45880](https://github.com/ceph/ceph/pull/45880), Ernesto Puerta)

- mgr/dashboard: fix frontend deps' vulnerabilities ([pr#44297](https://github.com/ceph/ceph/pull/44297), Alfonso Martínez)

- mgr/dashboard: fix Grafana OSD/host panels ([pr#44775](https://github.com/ceph/ceph/pull/44775), Patrick Seidensal)

- mgr/dashboard: fix orchestrator/02-hosts-inventory<span></span>.e2e failure ([pr#44467](https://github.com/ceph/ceph/pull/44467), Nizamudeen A)

- mgr/dashboard: fix timeout error in dashboard cephadm e2e job ([pr#44468](https://github.com/ceph/ceph/pull/44468), Nizamudeen A)

- mgr/dashboard: fix white screen on Safari ([pr#45301](https://github.com/ceph/ceph/pull/45301), 胡玮文)

- mgr/dashboard: fix: get SMART data from single-daemon device ([pr#44597](https://github.com/ceph/ceph/pull/44597), Alfonso Martínez)

- mgr/dashboard: highlight the search text in cluster logs ([pr#45678](https://github.com/ceph/ceph/pull/45678), Sarthak0702)

- mgr/dashboard: Implement drain host functionality in dashboard ([pr#44376](https://github.com/ceph/ceph/pull/44376), Nizamudeen A)

- mgr/dashboard: Improve notifications for osd nearfull, full ([pr#44876](https://github.com/ceph/ceph/pull/44876), Aashish Sharma)

- mgr/dashboard: Imrove error message of '/api/grafana/validation' API endpoint ([pr#45956](https://github.com/ceph/ceph/pull/45956), Volker Theile)

- mgr/dashboard: introduce HAProxy metrics for RGW ([pr#44273](https://github.com/ceph/ceph/pull/44273), Avan Thakkar)

- mgr/dashboard: introduce separate front-end component for API docs ([pr#44400](https://github.com/ceph/ceph/pull/44400), Aashish Sharma)

- mgr/dashboard: Language dropdown box is partly hidden on login page ([pr#45618](https://github.com/ceph/ceph/pull/45618), Volker Theile)

- mgr/dashboard: monitoring:Implement BlueStore onode hit/miss counters into the dashboard ([pr#44650](https://github.com/ceph/ceph/pull/44650), Aashish Sharma)

- mgr/dashboard: NFS non-existent files cleanup ([pr#44046](https://github.com/ceph/ceph/pull/44046), Alfonso Martínez)

- mgr/dashboard: NFS pages shows 'Page not found' ([pr#45723](https://github.com/ceph/ceph/pull/45723), Volker Theile)

- mgr/dashboard: Notification banners at the top of the UI have fixed height ([pr#44756](https://github.com/ceph/ceph/pull/44756), Nizamudeen A, Waad AlKhoury)

- mgr/dashboard: perform daemon actions ([pr#45203](https://github.com/ceph/ceph/pull/45203), Pere Diaz Bou)

- mgr/dashboard: Pull latest translations from Transifex ([pr#45418](https://github.com/ceph/ceph/pull/45418), Volker Theile)

- mgr/dashboard: Refactoring dashboard cephadm checks ([pr#44652](https://github.com/ceph/ceph/pull/44652), Nizamudeen A)

- mgr/dashboard: RGW users and buckets tables are empty if the selected gateway is down ([pr#45868](https://github.com/ceph/ceph/pull/45868), Volker Theile)

- mgr/dashboard: run-backend-api-tests<span></span>.sh: Older setuptools ([pr#44377](https://github.com/ceph/ceph/pull/44377), David Galloway)

- mgr/dashboard: set appropriate baseline branch for applitools ([pr#44935](https://github.com/ceph/ceph/pull/44935), Nizamudeen A)

- mgr/dashboard: support snmp-gateway service creation from UI ([pr#44977](https://github.com/ceph/ceph/pull/44977), Avan Thakkar)

- mgr/dashboard: Table columns hiding fix ([issue#51119](http://tracker.ceph.com/issues/51119), [pr#45725](https://github.com/ceph/ceph/pull/45725), Daniel Persson)

- mgr/dashboard: Update Angular version to 12 ([pr#44534](https://github.com/ceph/ceph/pull/44534), Ernesto Puerta, Nizamudeen A)

- mgr/dashboard: upgrade Cypress to the latest stable version ([pr#44086](https://github.com/ceph/ceph/pull/44086), Sage Weil, Alfonso Martínez)

- mgr/dashboard: use -f for npm ci to skip fsevents error ([pr#44105](https://github.com/ceph/ceph/pull/44105), Duncan Bellamy)

- mgr/devicehealth: fix missing timezone from time delta calculation ([pr#44325](https://github.com/ceph/ceph/pull/44325), Yaarit Hatuka)

- mgr/devicehealth: skip null pages when extracting wear level ([pr#45151](https://github.com/ceph/ceph/pull/45151), Yaarit Hatuka)

- mgr/nfs: allow dynamic update of cephfs nfs export ([pr#45543](https://github.com/ceph/ceph/pull/45543), Ramana Raja)

- mgr/nfs: support managing exports without orchestration enabled ([pr#45508](https://github.com/ceph/ceph/pull/45508), John Mulligan)

- mgr/orchestrator: add filtering and count option for orch host ls ([pr#44531](https://github.com/ceph/ceph/pull/44531), Adam King)

- mgr/prometheus: Added `avail\_raw` field for Pools DF Prometheus mgr module ([pr#45236](https://github.com/ceph/ceph/pull/45236), Konstantin Shalygin)

- mgr/prometheus: define module options for standby ([pr#44205](https://github.com/ceph/ceph/pull/44205), Sage Weil)

- mgr/prometheus: expose ceph healthchecks as metrics ([pr#44480](https://github.com/ceph/ceph/pull/44480), Paul Cuzner, Sebastian Wagner)

- mgr/prometheus: Fix metric types from gauge to counter ([pr#43187](https://github.com/ceph/ceph/pull/43187), Patrick Seidensal)

- mgr/prometheus: Fix the per method stats exported ([pr#44146](https://github.com/ceph/ceph/pull/44146), Paul Cuzner)

- mgr/prometheus: Make prometheus standby behaviour configurable ([pr#43897](https://github.com/ceph/ceph/pull/43897), Roland Sommer)

- mgr/rbd\_support: cast pool\_id from int to str when collecting LevelSpec ([pr#45532](https://github.com/ceph/ceph/pull/45532), Ilya Dryomov)

- mgr/rbd\_support: fix schedule remove ([pr#45005](https://github.com/ceph/ceph/pull/45005), Sunny Kumar)

- mgr/snap\_schedule: backports ([pr#45906](https://github.com/ceph/ceph/pull/45906), Venky Shankar, Milind Changire)

- mgr/stats: exception handling for ceph fs perf stats command ([pr#44516](https://github.com/ceph/ceph/pull/44516), Nikhilkumar Shelke)

- mgr/telemetry: fix waiting for mgr to warm up ([pr#45773](https://github.com/ceph/ceph/pull/45773), Yaarit Hatuka)

- mgr/volumes: A few mgr volumes pacific backports ([pr#45205](https://github.com/ceph/ceph/pull/45205), Kotresh HR)

- mgr/volumes: Subvolume removal and clone failure fixes ([pr#42932](https://github.com/ceph/ceph/pull/42932), Kotresh HR)

- mgr/volumes: the 'mode' should honor idempotent subvolume creation ([pr#45474](https://github.com/ceph/ceph/pull/45474), Nikhilkumar Shelke)

- mgr: Fix ceph\_daemon label in ceph\_rgw\\_\* metrics ([pr#44885](https://github.com/ceph/ceph/pull/44885), Benoît Knecht)

- mgr: fix locking for MetadataUpdate::finish ([pr#44212](https://github.com/ceph/ceph/pull/44212), Sage Weil)

- mgr: TTL Cache in mgr module ([pr#44750](https://github.com/ceph/ceph/pull/44750), Waad AlKhoury, Pere Diaz Bou)

- mgr: various fixes for mgr scalability ([pr#44869](https://github.com/ceph/ceph/pull/44869), Neha Ojha, Sage Weil)

- mon/MDSMonitor: sanity assert when inline data turned on in MDSMap from v16<span></span>.2<span></span>.4 -> v16<span></span>.2<span></span>.[567] ([pr#44910](https://github.com/ceph/ceph/pull/44910), Patrick Donnelly)

- mon/MgrStatMonitor: do not spam subscribers (mgr) with service\_map ([pr#44721](https://github.com/ceph/ceph/pull/44721), Sage Weil)

- mon/MonCommands<span></span>.h: fix target\_size\_ratio range ([pr#45397](https://github.com/ceph/ceph/pull/45397), Kamoltat)

- mon/OSDMonitor: avoid null dereference if stats are not available ([pr#44698](https://github.com/ceph/ceph/pull/44698), Josh Durgin)

- mon: Abort device health when device not found ([pr#44959](https://github.com/ceph/ceph/pull/44959), Benoît Knecht)

- mon: do not quickly mark mds laggy when MON\_DOWN ([pr#43698](https://github.com/ceph/ceph/pull/43698), Sage Weil, Patrick Donnelly)

- mon: Omit MANY\_OBJECTS\_PER\_PG warning when autoscaler is on ([pr#45152](https://github.com/ceph/ceph/pull/45152), Christopher Hoffman)

- mon: osd pool create <pool-name> with --bulk flag ([pr#44847](https://github.com/ceph/ceph/pull/44847), Kamoltat)

- mon: prevent new sessions during shutdown ([pr#44543](https://github.com/ceph/ceph/pull/44543), Sage Weil)

- monitoring/grafana: Grafana query tester ([pr#44316](https://github.com/ceph/ceph/pull/44316), Ernesto Puerta, Pere Diaz Bou)

- monitoring: mention PyYAML only once in requirements ([pr#44944](https://github.com/ceph/ceph/pull/44944), Rishabh Dave)

- os/bluestore/AvlAllocator: introduce bluestore\_avl\_alloc\_ff\_max\\_\* options ([pr#43745](https://github.com/ceph/ceph/pull/43745), Kefu Chai, Mauricio Faria de Oliveira, Adam Kupczyk)

- os/bluestore: avoid premature onode release ([pr#44723](https://github.com/ceph/ceph/pull/44723), Igor Fedotov)

- os/bluestore: make shared blob fsck much less RAM-greedy ([pr#44613](https://github.com/ceph/ceph/pull/44613), Igor Fedotov)

- os/bluestore: use proper prefix when removing undecodable Share Blob ([pr#43882](https://github.com/ceph/ceph/pull/43882), Igor Fedotov)

- osd/OSD: Log aggregated slow ops detail to cluster logs ([pr#44771](https://github.com/ceph/ceph/pull/44771), Prashant D)

- osd/OSDMap<span></span>.cc: clean up pg\_temp for nonexistent pgs ([pr#44096](https://github.com/ceph/ceph/pull/44096), Cory Snyder)

- osd/OSDMap: Add health warning if 'require-osd-release' != current release ([pr#44259](https://github.com/ceph/ceph/pull/44259), Sridhar Seshasayee, Patrick Donnelly, Neha Ojha)

- osd/OSDMapMapping: fix spurious threadpool timeout errors ([pr#44545](https://github.com/ceph/ceph/pull/44545), Sage Weil)

- osd/PeeringState: separate history's pruub from pg's ([pr#44584](https://github.com/ceph/ceph/pull/44584), Sage Weil)

- osd/PrimaryLogPG<span></span>.cc: CEPH\_OSD\_OP\_OMAPRMKEYRANGE should mark omap dirty ([pr#45591](https://github.com/ceph/ceph/pull/45591), Neha Ojha)

- osd/scrub: destruct the scrubber shortly before the PG is destructed ([pr#45731](https://github.com/ceph/ceph/pull/45731), Ronen Friedman)

- osd/scrub: only telling the scrubber of awaited-for 'updates' events ([pr#45365](https://github.com/ceph/ceph/pull/45365), Ronen Friedman)

- osd/scrub: remove reliance of Scrubber objects' logging on the PG ([pr#45729](https://github.com/ceph/ceph/pull/45729), Ronen Friedman)

- osd/scrub: restart snap trimming only after scrubbing is done ([pr#45785](https://github.com/ceph/ceph/pull/45785), Ronen Friedman)

- osd/scrub: stop sending bogus digest-update events ([issue#54423](http://tracker.ceph.com/issues/54423), [pr#45194](https://github.com/ceph/ceph/pull/45194), Ronen Friedman)

- osd/scrub: tag replica scrub messages to identify stale events ([pr#45374](https://github.com/ceph/ceph/pull/45374), Ronen Friedman)

- osd: add pg\_num\_max value & pg\_num\_max reordering ([pr#45173](https://github.com/ceph/ceph/pull/45173), Kamoltat, Sage Weil)

- osd: fix 'ceph osd stop <osd<span></span>.nnn>' doesn't take effect ([pr#43955](https://github.com/ceph/ceph/pull/43955), tan changzhi)

- osd: fix the truncation of an int by int division ([pr#45376](https://github.com/ceph/ceph/pull/45376), Ronen Friedman)

- osd: PeeringState: fix selection order in calc\_replicated\_acting\_stretch ([pr#44664](https://github.com/ceph/ceph/pull/44664), Greg Farnum)

- osd: recover unreadable snapshot before reading ref<span></span>. count info ([pr#44181](https://github.com/ceph/ceph/pull/44181), Myoungwon Oh)

- osd: require osd\_pg\_max\_concurrent\_snap\_trims > 0 ([pr#45323](https://github.com/ceph/ceph/pull/45323), Dan van der Ster)

- osd: set r only if succeed in FillInVerifyExtent ([pr#44173](https://github.com/ceph/ceph/pull/44173), yanqiang-ux)

- osdc: add set\_error in BufferHead, when split set\_error to right ([pr#44725](https://github.com/ceph/ceph/pull/44725), jiawd)

- pacfic: doc/rados/operations/placement-groups: fix --bulk docs ([pr#45328](https://github.com/ceph/ceph/pull/45328), Kamoltat)

- Pacific fast shutdown backports ([pr#45654](https://github.com/ceph/ceph/pull/45654), Sridhar Seshasayee, Nitzan Mordechai, Satoru Takeuchi)

- pybind/mgr/balancer: define Plan<span></span>.{dump,show}() ([pr#43964](https://github.com/ceph/ceph/pull/43964), Kefu Chai)

- pybind/mgr/progress: enforced try and except on accessing event dictionary ([pr#44672](https://github.com/ceph/ceph/pull/44672), Kamoltat)

- python-common: add int value validation for count and count\_per\_host ([pr#44527](https://github.com/ceph/ceph/pull/44527), John Mulligan)

- python-common: improve OSD spec error messages ([pr#44626](https://github.com/ceph/ceph/pull/44626), Sebastian Wagner)

- qa/distros/podman: remove centos\_8<span></span>.2 and centos\_8<span></span>.3 ([pr#44903](https://github.com/ceph/ceph/pull/44903), Neha Ojha)

- qa/rgw: add failing tempest test to blocklist ([pr#45436](https://github.com/ceph/ceph/pull/45436), Casey Bodley)

- qa/rgw: barbican and pykmip tasks upgrade pip before installing pytz ([pr#45444](https://github.com/ceph/ceph/pull/45444), Casey Bodley)

- qa/rgw: bump tempest version to resolve dependency issue ([pr#43966](https://github.com/ceph/ceph/pull/43966), Casey Bodley)

- qa/rgw: Fix vault token file access ([issue#51539](http://tracker.ceph.com/issues/51539), [pr#43951](https://github.com/ceph/ceph/pull/43951), Marcus Watts)

- qa/rgw: update apache-maven mirror for rgw/hadoop-s3a ([pr#45445](https://github.com/ceph/ceph/pull/45445), Casey Bodley)

- qa/rgw: use symlinks for rgw/sts suite, target supported-random-distro$ ([pr#45245](https://github.com/ceph/ceph/pull/45245), Casey Bodley)

- qa/run-tox-mgr-dashboard: Do not write to /tmp/test\_sanitize\_password… ([pr#44727](https://github.com/ceph/ceph/pull/44727), Kevin Zhao)

- qa/run\_xfstests\_qemu<span></span>.sh: stop reporting success without actually running any tests ([pr#44596](https://github.com/ceph/ceph/pull/44596), Ilya Dryomov)

- qa/suites/fs: add prefetch\_dirfrags false to thrasher suite ([pr#44504](https://github.com/ceph/ceph/pull/44504), Arthur Outhenin-Chalandre)

- qa/suites/orch/cephadm: Also run the rbd/iscsi suite ([pr#44635](https://github.com/ceph/ceph/pull/44635), Sebastian Wagner)

- qa/tasks/qemu: make sure block-rbd<span></span>.so is installed ([pr#45072](https://github.com/ceph/ceph/pull/45072), Ilya Dryomov)

- qa/tasks: improve backfill\_toofull test ([pr#44387](https://github.com/ceph/ceph/pull/44387), Mykola Golub)

- qa/tests: added upgrade-clients/client-upgrade-pacific-quincy test ([pr#45326](https://github.com/ceph/ceph/pull/45326), Yuri Weinstein)

- qa/tests: replaced 16<span></span>.2<span></span>.6 with 16<span></span>.2<span></span>.7 version ([pr#44369](https://github.com/ceph/ceph/pull/44369), Yuri Weinstein)

- qa: adjust for MDSs to get deployed before verifying their availability ([issue#53857](http://tracker.ceph.com/issues/53857), [pr#44639](https://github.com/ceph/ceph/pull/44639), Venky Shankar)

- qa: Default to CentOS 8 Stream ([pr#44889](https://github.com/ceph/ceph/pull/44889), David Galloway)

- qa: do not use any time related suffix for \*\_op\_timeouts ([pr#44621](https://github.com/ceph/ceph/pull/44621), Xiubo Li)

- qa: fsync dir for asynchronous creat on stray tests ([pr#45565](https://github.com/ceph/ceph/pull/45565), Patrick Donnelly, Ramana Raja)

- qa: ignore expected metadata cluster log error ([pr#45564](https://github.com/ceph/ceph/pull/45564), Patrick Donnelly)

- qa: increase the timeout value to wait a litte longer ([pr#43979](https://github.com/ceph/ceph/pull/43979), Xiubo Li)

- qa: move certificates for kmip task into /etc/ceph ([pr#45413](https://github.com/ceph/ceph/pull/45413), Ali Maredia)

- qa: remove centos8 from supported distros ([pr#44865](https://github.com/ceph/ceph/pull/44865), Casey Bodley, Sage Weil)

- qa: skip sanity check during upgrade ([pr#44840](https://github.com/ceph/ceph/pull/44840), Milind Changire)

- qa: split distro for rados/cephadm/smoke tests ([pr#44681](https://github.com/ceph/ceph/pull/44681), Guillaume Abrioux)

- qa: wait for purge queue operations to finish ([issue#52487](http://tracker.ceph.com/issues/52487), [pr#44642](https://github.com/ceph/ceph/pull/44642), Venky Shankar)

- radosgw-admin: 'sync status' is not behind if there are no mdlog entries ([pr#45442](https://github.com/ceph/ceph/pull/45442), Casey Bodley)

- rbd persistent cache UX improvements (status report, metrics, flush command) ([pr#45895](https://github.com/ceph/ceph/pull/45895), Ilya Dryomov, Yin Congmin)

- rbd-mirror: fix races in snapshot-based mirroring deletion propagation ([pr#44754](https://github.com/ceph/ceph/pull/44754), Ilya Dryomov)

- rbd-mirror: make mirror properly detect pool replayer needs restart ([pr#45170](https://github.com/ceph/ceph/pull/45170), Mykola Golub)

- rbd-mirror: make RemoveImmediateUpdate test synchronous ([pr#44094](https://github.com/ceph/ceph/pull/44094), Arthur Outhenin-Chalandre)

- rbd-mirror: synchronize with in-flight stop in ImageReplayer::stop() ([pr#45184](https://github.com/ceph/ceph/pull/45184), Ilya Dryomov)

- rbd: add missing switch arguments for recognition by get\_command\_spec() ([pr#44742](https://github.com/ceph/ceph/pull/44742), Ilya Dryomov)

- rbd: mark optional positional arguments as such in help output ([pr#45008](https://github.com/ceph/ceph/pull/45008), Ilya Dryomov)

- rbd: recognize rxbounce map option ([pr#45002](https://github.com/ceph/ceph/pull/45002), Ilya Dryomov)

- Revert "mds: kill session when mds do ms\_handle\_remote\_reset" ([pr#45557](https://github.com/ceph/ceph/pull/45557), Venky Shankar)

- revert bootstrap network handling changes ([pr#46085](https://github.com/ceph/ceph/pull/46085), Adam King)

- revival and backport of fix for RocksDB optimized iterators ([pr#46096](https://github.com/ceph/ceph/pull/46096), Adam Kupczyk, Cory Snyder)

- RGW - Zipper - Make default args match in get\_obj\_state ([pr#45438](https://github.com/ceph/ceph/pull/45438), Daniel Gryniewicz)

- RGW - Zipper - Make sure PostObj has bucket set ([pr#45060](https://github.com/ceph/ceph/pull/45060), Daniel Gryniewicz)

- rgw/admin: fix radosgw-admin datalog list max-entries issue ([pr#45500](https://github.com/ceph/ceph/pull/45500), Yuval Lifshitz)

- rgw/amqp: add default case to silence compiler warning ([pr#45478](https://github.com/ceph/ceph/pull/45478), Casey Bodley)

- rgw/amqp: remove the explicit "disconnect()" interface ([pr#45427](https://github.com/ceph/ceph/pull/45427), Yuval Lifshitz)

- rgw/beast: optimizations for request timeout ([pr#43946](https://github.com/ceph/ceph/pull/43946), Mark Kogan, Casey Bodley)

- rgw/notification: send correct size in COPY events ([pr#45426](https://github.com/ceph/ceph/pull/45426), Yuval Lifshitz)

- rgw/sts: adding role name and role session to ops log ([pr#43956](https://github.com/ceph/ceph/pull/43956), Pritha Srivastava)

- rgw: add object null point judging when listing pubsub  topics ([pr#45476](https://github.com/ceph/ceph/pull/45476), zhipeng li)

- rgw: add OPT\_BUCKET\_SYNC\_RUN to gc\_ops\_list, so that ([pr#45421](https://github.com/ceph/ceph/pull/45421), Pritha Srivastava)

- rgw: add the condition of lock mode conversion to PutObjRentention ([pr#45440](https://github.com/ceph/ceph/pull/45440), wangzhong)

- rgw: bucket chown bad memory usage ([pr#45491](https://github.com/ceph/ceph/pull/45491), Mohammad Fatemipour)

- rgw: change order of xml elements in ListRoles response ([pr#45448](https://github.com/ceph/ceph/pull/45448), Casey Bodley)

- rgw: clean-up logging of function entering to make thorough and consistent ([pr#45450](https://github.com/ceph/ceph/pull/45450), J. Eric Ivancich)

- rgw: cls\_bucket\_list\_unordered() might return one redundent entry every time is\_truncated is true ([pr#45457](https://github.com/ceph/ceph/pull/45457), Peng Zhang)

- rgw: default ms\_mon\_client\_mode = secure ([pr#45439](https://github.com/ceph/ceph/pull/45439), Sage Weil)

- rgw: document rgw\_lc\_debug\_interval configuration option ([pr#45453](https://github.com/ceph/ceph/pull/45453), J. Eric Ivancich)

- rgw: document S3 bucket replication support ([pr#45484](https://github.com/ceph/ceph/pull/45484), Matt Benjamin)

- rgw: Dump Object Lock Retain Date as ISO 8601 ([pr#44697](https://github.com/ceph/ceph/pull/44697), Danny Abukalam)

- rgw: fix `bi put` not using right bucket index shard ([pr#44166](https://github.com/ceph/ceph/pull/44166), J. Eric Ivancich)

- rgw: fix lock scope in ObjectCache::get() ([pr#44747](https://github.com/ceph/ceph/pull/44747), Casey Bodley)

- rgw: fix md5 not match for RGWBulkUploadOp upload when enable rgw com… ([pr#45432](https://github.com/ceph/ceph/pull/45432), yuliyang_yewu)

- rgw: fix rgw<span></span>.none statistics ([pr#45463](https://github.com/ceph/ceph/pull/45463), J. Eric Ivancich)

- rgw: fix segfault in UserAsyncRefreshHandler::init\_fetch ([pr#45411](https://github.com/ceph/ceph/pull/45411), Cory Snyder)

- rgw: forward request in multisite for RGWDeleteBucketPolicy and RGWDeleteBucketPublicAccessBlock ([pr#45434](https://github.com/ceph/ceph/pull/45434), yuliyang_yewu)

- rgw: have "bucket check --fix" fix pool ids correctly ([pr#45455](https://github.com/ceph/ceph/pull/45455), J. Eric Ivancich)

- rgw: in bucket reshard list, clarify new num shards is tentative ([pr#45509](https://github.com/ceph/ceph/pull/45509), J. Eric Ivancich)

- rgw: init bucket index only if putting bucket instance info succeeds ([pr#45480](https://github.com/ceph/ceph/pull/45480), Huber-ming)

- rgw: RadosBucket::get\_bucket\_info() updates RGWBucketEnt ([pr#45483](https://github.com/ceph/ceph/pull/45483), Casey Bodley)

- rgw: remove bucket API returns NoSuchKey than NoSuchBucket ([pr#45489](https://github.com/ceph/ceph/pull/45489), Satoru Takeuchi)

- rgw: resolve empty ordered bucket listing results w/ CLS filtering \*and\* bucket index list produces incorrect result when non-ascii entries ([pr#45087](https://github.com/ceph/ceph/pull/45087), J. Eric Ivancich)

- rgw: RGWPostObj::execute() may lost data ([pr#45502](https://github.com/ceph/ceph/pull/45502), Lei Zhang)

- rgw: under fips, set flag to allow md5 in select rgw ops ([pr#44778](https://github.com/ceph/ceph/pull/44778), Mark Kogan)

- rgw: url\_decode before parsing copysource in copyobject ([issue#43259](http://tracker.ceph.com/issues/43259), [pr#45430](https://github.com/ceph/ceph/pull/45430), Paul Reece)

- rgw: user stats showing 0 value for "size\_utilized" and "size\_kb\_utilized" fields ([pr#44171](https://github.com/ceph/ceph/pull/44171), J. Eric Ivancich)

- rgw: write meta of a MP part to a correct pool ([issue#49128](http://tracker.ceph.com/issues/49128), [pr#45428](https://github.com/ceph/ceph/pull/45428), Jeegn Chen)

- rgw:When KMS encryption is used and the key does not exist, we should… ([pr#45461](https://github.com/ceph/ceph/pull/45461), wangyingbin)

- rgwlc:  remove lc entry on bucket delete ([pr#44729](https://github.com/ceph/ceph/pull/44729), Matt Benjamin)

- rgwlc:  warn on missing RGW\_ATTR\_LC ([pr#45497](https://github.com/ceph/ceph/pull/45497), Matt Benjamin)

- src/ceph-crash<span></span>.in: various enhancements and fixes ([pr#45381](https://github.com/ceph/ceph/pull/45381), Sébastien Han)

- src/rgw: Fix for malformed url ([pr#45459](https://github.com/ceph/ceph/pull/45459), Kalpesh Pandya)

- test/librbd/test\_notify<span></span>.py: effect post object map rebuild assert ([pr#45311](https://github.com/ceph/ceph/pull/45311), Ilya Dryomov)

- test/librbd: add test to verify diff\_iterate size ([pr#45555](https://github.com/ceph/ceph/pull/45555), Christopher Hoffman)

- test/librbd: harden RemoveFullTry tests ([pr#43649](https://github.com/ceph/ceph/pull/43649), Ilya Dryomov)

- test/rgw: disable cls\_rgw\_gc test cases with defer\_gc() ([pr#45477](https://github.com/ceph/ceph/pull/45477), Casey Bodley)

- test: fix wrong alarm (HitSetWrite) ([pr#45319](https://github.com/ceph/ceph/pull/45319), Myoungwon Oh)

- test: increase retry duration when calculating manifest ref<span></span>. count ([pr#44202](https://github.com/ceph/ceph/pull/44202), Myoungwon Oh)

- tools/rbd: expand where option rbd\_default\_map\_options can be set ([pr#45181](https://github.com/ceph/ceph/pull/45181), Christopher Hoffman, Ilya Dryomov)
