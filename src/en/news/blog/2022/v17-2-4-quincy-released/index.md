---
title: "v17.2.4 Quincy released"
date: "2022-09-30"
author: "yuriw"
tags:
  - "release"
  - "quincy"
---

This is the fourth backport release in the Quincy series. We recommend
that all users update to this release.

## Notable Changes

- Cephfs: The ``AT_NO_ATTR_SYNC`` macro is deprecated, please use the standard
  ``AT_STATX_DONT_SYNC`` macro. The ``AT_NO_ATTR_SYNC`` macro will be removed in
  the future.

- OSD: The issue of high CPU utilization during recovery/backfill operations
  has been fixed. For more details see: https://tracker.ceph.com/issues/56530.

- Trimming of PGLog dups is now controlled by size instead of the version.
  This fixes the PGLog inflation issue that was happening when online
  (in OSD) trimming jammed after a PG split operation. Also, a new offline
  mechanism has been added: ``ceph-objectstore-tool`` now has a ``trim-pg-log-dups`` op
  that targets situations where an OSD is unable to boot due to those inflated dups.
  If that is the case, in OSD logs the "You can be hit by THE DUPS BUG" warning
  will be visible.
  Relevant tracker: https://tracker.ceph.com/issues/53729

- OSD: Octopus modified the SnapMapper key format from
  ``<LEGACY_MAPPING_PREFIX><snapid>_<shardid>_<hobject_t::to_str()>``
  to
  ``<MAPPING_PREFIX><pool>_<snapid>_<shardid>_<hobject_t::to_str()>``.
  When this change was introduced, [94ebe0](https://github.com/ceph/ceph/commit/94ebe0eab968068c29fdffa1bfe68c72122db633>)
  also introduced a conversion with a crucial bug which essentially
  destroyed legacy keys by mapping them to
  ``<MAPPING_PREFIX><poolid>_<snapid>_``
  without the object-unique suffix. The conversion is fixed in this release.
  Relevant tracker: https://tracker.ceph.com/issues/56147

## Changelog

- <span></span>.readthedocs<span></span>.yml: Always build latest doc/releases pages ([pr#47442](https://github.com/ceph/ceph/pull/47442), David Galloway)

- Add mapping for ernno:13 and adding path in error msg in opendir()/cephfs<span></span>.pyx ([pr#46647](https://github.com/ceph/ceph/pull/46647), Sarthak0702)

- admin: Fix check if PR or release branch docs build ([pr#47739](https://github.com/ceph/ceph/pull/47739), David Galloway)

- bdev: fix FTBFS on FreeBSD, keep the huge paged read buffers ([pr#44641](https://github.com/ceph/ceph/pull/44641), Radoslaw Zarzynski)

- build: Silence deprecation warnings from OpenSSL 3 ([pr#47585](https://github.com/ceph/ceph/pull/47585), Kefu Chai, Adam C. Emerson)

- Catch exception if thrown by \_\_generate\_command\_map() ([pr#45892](https://github.com/ceph/ceph/pull/45892), Nikhil Kshirsagar)

- ceph-fuse: add dedicated snap stag map for each directory ([pr#46948](https://github.com/ceph/ceph/pull/46948), Xiubo Li)

- ceph-mixin: backport of recent cleanups ([pr#46548](https://github.com/ceph/ceph/pull/46548), Arthur Outhenin-Chalandre)

- ceph-volume: avoid unnecessary subprocess calls ([pr#46968](https://github.com/ceph/ceph/pull/46968), Guillaume Abrioux)

- ceph-volume: decrease number of `pvs` calls in `lvm list` ([pr#46966](https://github.com/ceph/ceph/pull/46966), Guillaume Abrioux)

- ceph-volume: do not call get\_device\_vgs() per devices ([pr#47348](https://github.com/ceph/ceph/pull/47348), Guillaume Abrioux)

- ceph-volume: do not log sensitive details ([pr#46728](https://github.com/ceph/ceph/pull/46728), Guillaume Abrioux)

- ceph-volume: fix `simple scan` ([pr#47149](https://github.com/ceph/ceph/pull/47149), Guillaume Abrioux)

- ceph-volume: fix fast device alloc size on mulitple device ([pr#47293](https://github.com/ceph/ceph/pull/47293), Arthur Outhenin-Chalandre)

- ceph-volume: fix regression in activate ([pr#48201](https://github.com/ceph/ceph/pull/48201), Guillaume Abrioux)

- ceph-volume: make is\_valid() optional ([pr#46730](https://github.com/ceph/ceph/pull/46730), Guillaume Abrioux)

- ceph-volume: only warn when config file isn't found ([pr#46070](https://github.com/ceph/ceph/pull/46070), Guillaume Abrioux)

- ceph-volume: Quincy backports ([pr#47406](https://github.com/ceph/ceph/pull/47406), Guillaume Abrioux, Zack Cerza, Michael Fritch)

- ceph-volume: system<span></span>.get\_mounts() refactor ([pr#47536](https://github.com/ceph/ceph/pull/47536), Guillaume Abrioux)

- ceph-volume/tests: fix test_exception_returns_default ([pr#47435](https://github.com/ceph/ceph/pull/47435), Guillaume Abrioux)

- ceph<span></span>.spec<span></span>.in backports ([pr#47549](https://github.com/ceph/ceph/pull/47549), David Galloway, Kefu Chai, Tim Serong, Casey Bodley, Radoslaw Zarzynski, Radosław Zarzyński)

- ceph<span></span>.spec<span></span>.in: disable system\_pmdk on s390x ([pr#47251](https://github.com/ceph/ceph/pull/47251), Ken Dreyer)

- ceph<span></span>.spec<span></span>.in: openSUSE: require gcc11-c++, disable parquet ([pr#46155](https://github.com/ceph/ceph/pull/46155), Tim Serong)

- ceph<span></span>.spec: fixing cephadm build deps ([pr#47069](https://github.com/ceph/ceph/pull/47069), Redouane Kachach)

- cephadm/ceph-volume: fix rm-cluster --zap ([pr#47626](https://github.com/ceph/ceph/pull/47626), Guillaume Abrioux)

- cephadm/mgr: adding logic to handle --no-overwrite for tuned profiles ([pr#47944](https://github.com/ceph/ceph/pull/47944), Redouane Kachach)

- cephadm: add "su root root" to cephadm<span></span>.log logrotate config ([pr#47314](https://github.com/ceph/ceph/pull/47314), Adam King)

- cephadm: add 'is\_paused' field in orch status output ([pr#46569](https://github.com/ceph/ceph/pull/46569), Guillaume Abrioux)

- Cephadm: Allow multiple virtual IP addresses for keepalived and haproxy ([pr#47610](https://github.com/ceph/ceph/pull/47610), Luis Domingues)

- cephadm: change default keepalived/haproxy container images ([pr#46714](https://github.com/ceph/ceph/pull/46714), Guillaume Abrioux)

- cephadm: fix incorrect warning ([pr#47608](https://github.com/ceph/ceph/pull/47608), Guillaume Abrioux)

- cephadm: fix osd adoption with custom cluster name ([pr#46551](https://github.com/ceph/ceph/pull/46551), Adam King)

- cephadm: Fix repo\_gpgkey should return 2 vars ([pr#47374](https://github.com/ceph/ceph/pull/47374), Laurent Barbe)

- cephadm: improve message when removing osd ([pr#47071](https://github.com/ceph/ceph/pull/47071), Guillaume Abrioux)

- cephadm: preserve cephadm user during RPM upgrade ([pr#46790](https://github.com/ceph/ceph/pull/46790), Scott Shambarger)

- cephadm: reduce spam to cephadm<span></span>.log ([pr#47313](https://github.com/ceph/ceph/pull/47313), Adam King)

- cephadm: Remove duplicated process args in promtail and loki ([pr#47654](https://github.com/ceph/ceph/pull/47654), jinhong.kim)

- cephadm: return nonzero exit code when applying spec fails in bootstrap ([pr#47952](https://github.com/ceph/ceph/pull/47952), Adam King)

- cephadm: support for Oracle Linux 8 ([pr#47656](https://github.com/ceph/ceph/pull/47656), Adam King)

- cephfs-shell: move source to separate subdirectory ([pr#47400](https://github.com/ceph/ceph/pull/47400), Tim Serong)

- cephfs-top: display average read/write/metadata latency ([issue#48619](http://tracker.ceph.com/issues/48619), [pr#47977](https://github.com/ceph/ceph/pull/47977), Venky Shankar)

- cephfs-top: fix the rsp/wsp display ([pr#47648](https://github.com/ceph/ceph/pull/47648), Jos Collin)

- client/fuse: Fix directory DACs overriding for root ([pr#46595](https://github.com/ceph/ceph/pull/46595), Kotresh HR)

- client: allow overwrites to file with size greater than the max\_file\_size ([pr#47971](https://github.com/ceph/ceph/pull/47971), Tamar Shacked)

- client: always return ESTALE directly in handle_reply ([pr#46558](https://github.com/ceph/ceph/pull/46558), Xiubo Li)

- client: choose auth MDS for getxattr with the Xs caps ([pr#46800](https://github.com/ceph/ceph/pull/46800), Xiubo Li)

- client: do not release the global snaprealm until unmounting ([pr#46495](https://github.com/ceph/ceph/pull/46495), Xiubo Li)

- client: Inode::hold\_caps\_until is time from monotonic clock now ([pr#46563](https://github.com/ceph/ceph/pull/46563), Laura Flores, Neeraj Pratap Singh)

- client: switch AT_NO_ATTR_SYNC to AT_STATX_DONT_SYNC ([pr#46680](https://github.com/ceph/ceph/pull/46680), Xiubo Li)

- cmake: disable LTO when building pmdk ([pr#47619](https://github.com/ceph/ceph/pull/47619), Kefu Chai)

- cmake: pass -Wno-error when building PMDK ([pr#46623](https://github.com/ceph/ceph/pull/46623), Ilya Dryomov)

- cmake: remove spaces in macro used for compiling cython code ([pr#47483](https://github.com/ceph/ceph/pull/47483), Kefu Chai)

- cmake: set $PATH for tests using jsonnet tools ([pr#47625](https://github.com/ceph/ceph/pull/47625), Kefu Chai)

- common/bl: fix FTBFS on C++11 due to C++17's if-with-initializer ([pr#46005](https://github.com/ceph/ceph/pull/46005), Radosław Zarzyński)

- common/win32,dokan: include bcrypt<span></span>.h for NTSTATUS ([pr#48016](https://github.com/ceph/ceph/pull/48016), Lucian Petrut, Kefu Chai)

- common: fix FTBFS due to dout & need\_dynamic on GCC-12 ([pr#46214](https://github.com/ceph/ceph/pull/46214), Radoslaw Zarzynski)

- common: use boost::shared\_mutex on Windows ([pr#47493](https://github.com/ceph/ceph/pull/47493), Lucian Petrut)

- crash: pthread\_mutex\_lock() ([pr#47683](https://github.com/ceph/ceph/pull/47683), Patrick Donnelly)

- crimson: fixes for compiling with fmtlib v8 ([pr#47603](https://github.com/ceph/ceph/pull/47603), Adam C. Emerson, Kefu Chai)

- doc, crimson: document installing crimson with cephadm ([pr#47283](https://github.com/ceph/ceph/pull/47283), Radoslaw Zarzynski)

- doc/cephadm/services: fix example for specifying rgw placement ([pr#47947](https://github.com/ceph/ceph/pull/47947), Redouane Kachach)

- doc/cephadm/services: the config section of service specs ([pr#47068](https://github.com/ceph/ceph/pull/47068), Redouane Kachach)

- doc/cephadm: add note about OSDs being recreated to OSD removal section ([pr#47102](https://github.com/ceph/ceph/pull/47102), Adam King)

- doc/cephadm: Add post-upgrade section ([pr#47077](https://github.com/ceph/ceph/pull/47077), Redouane Kachach)

- doc/cephadm: document the new per-fsid cephadm conf location ([pr#47076](https://github.com/ceph/ceph/pull/47076), Redouane Kachach)

- doc/cephadm: enhancing daemon operations documentation ([pr#47074](https://github.com/ceph/ceph/pull/47074), Redouane Kachach)

- doc/cephadm: fix example for specifying networks for rgw ([pr#47806](https://github.com/ceph/ceph/pull/47806), Adam King)

- doc/dev: add context note to dev guide config ([pr#46818](https://github.com/ceph/ceph/pull/46818), Zac Dover)

- doc/dev: add Dependabot section to essentials<span></span>.rst ([pr#47042](https://github.com/ceph/ceph/pull/47042), Zac Dover)

- doc/dev: add IRC registration instructions ([pr#46940](https://github.com/ceph/ceph/pull/46940), Zac Dover)

- doc/dev: edit delayed-delete<span></span>.rst ([pr#47051](https://github.com/ceph/ceph/pull/47051), Zac Dover)

- doc/dev: Elaborate on boost <span></span>.deb creation ([pr#47415](https://github.com/ceph/ceph/pull/47415), David Galloway)

- doc/dev: s/github/GitHub/ in essentials<span></span>.rst ([pr#47048](https://github.com/ceph/ceph/pull/47048), Zac Dover)

- doc/dev: s/master/main/ essentials<span></span>.rst dev guide ([pr#46661](https://github.com/ceph/ceph/pull/46661), Zac Dover)

- doc/dev: s/master/main/ in basic workflow ([pr#46703](https://github.com/ceph/ceph/pull/46703), Zac Dover)

- doc/dev: s/master/main/ in title ([pr#46721](https://github.com/ceph/ceph/pull/46721), Zac Dover)

- doc/dev: s/the the/the/ in basic-workflow<span></span>.rst ([pr#46935](https://github.com/ceph/ceph/pull/46935), Zac Dover)

- doc/dev\_guide: s/master/main in merging<span></span>.rst ([pr#46709](https://github.com/ceph/ceph/pull/46709), Zac Dover)

- doc/index<span></span>.rst: add link to Dev Guide basic workfl ([pr#46904](https://github.com/ceph/ceph/pull/46904), Zac Dover)

- doc/man/rbd: Mention changed `bluestore\_min\_alloc\_size` ([pr#47579](https://github.com/ceph/ceph/pull/47579), Niklas Hambüchen)

- doc/mgr: add prompt directives to dashboard<span></span>.rst ([pr#47822](https://github.com/ceph/ceph/pull/47822), Zac Dover)

- doc/mgr: edit orchestrator<span></span>.rst ([pr#47780](https://github.com/ceph/ceph/pull/47780), Zac Dover)

- doc/mgr: update prompts in dboard<span></span>.rst includes ([pr#47869](https://github.com/ceph/ceph/pull/47869), Zac Dover)

- doc/rados/operations: add prompts to operating<span></span>.rst ([pr#47586](https://github.com/ceph/ceph/pull/47586), Zac Dover)

- doc/radosgw: Uppercase s3 ([pr#47359](https://github.com/ceph/ceph/pull/47359), Anthony D'Atri)

- doc/start: alphabetize hardware-recs links ([pr#46339](https://github.com/ceph/ceph/pull/46339), Zac Dover)

- doc/start: make OSD and MDS structures parallel ([pr#46655](https://github.com/ceph/ceph/pull/46655), Zac Dover)

- doc/start: Polish network section of hardware-recommendations<span></span>.rst ([pr#46665](https://github.com/ceph/ceph/pull/46665), Anthony D'Atri)

- doc/start: rewrite CRUSH para ([pr#46658](https://github.com/ceph/ceph/pull/46658), Zac Dover)

- doc/start: rewrite hardware-recs networks section ([pr#46652](https://github.com/ceph/ceph/pull/46652), Zac Dover)

- doc/start: update documenting-ceph branch names ([pr#47955](https://github.com/ceph/ceph/pull/47955), Zac Dover)

- doc/start: update hardware recs ([pr#47123](https://github.com/ceph/ceph/pull/47123), Zac Dover)

- doc: update docs for centralized logging ([pr#46946](https://github.com/ceph/ceph/pull/46946), Aashish Sharma)

- doc: Update release process doc to accurately reflect current process ([pr#47837](https://github.com/ceph/ceph/pull/47837), David Galloway)

- docs: fix doc link pointing to master in dashboard<span></span>.rst ([pr#47789](https://github.com/ceph/ceph/pull/47789), Nizamudeen A)

- exporter: per node metric exporter ([pr#47629](https://github.com/ceph/ceph/pull/47629), Pere Diaz Bou, Avan Thakkar)

- include/buffer: include <memory> ([pr#47694](https://github.com/ceph/ceph/pull/47694), Kefu Chai)

- install-deps<span></span>.sh: do not install libpmem from chacra ([pr#46900](https://github.com/ceph/ceph/pull/46900), Kefu Chai)

- install-deps: script exit on /ValueError: in centos\_stream8 ([pr#47892](https://github.com/ceph/ceph/pull/47892), Nizamudeen A)

- libcephfs: define AT\_NO\_ATTR\_SYNC back for backward compatibility ([pr#47861](https://github.com/ceph/ceph/pull/47861), Xiubo Li)

- libcephsqlite: ceph-mgr crashes when compiled with gcc12 ([pr#47270](https://github.com/ceph/ceph/pull/47270), Ganesh Maharaj Mahalingam)

- librados: rados\_ioctx\_destroy check for initialized ioctx ([pr#47452](https://github.com/ceph/ceph/pull/47452), Nitzan Mordechai)

- librbd/cache/pwl: narrow the scope of m\_lock in write\_image\_cache\_state() ([pr#47940](https://github.com/ceph/ceph/pull/47940), Ilya Dryomov, Yin Congmin)

- librbd: bail from schedule\_request\_lock() if already lock owner ([pr#47162](https://github.com/ceph/ceph/pull/47162), Christopher Hoffman)

- librbd: retry ENOENT in V2\_REFRESH\_PARENT as well ([pr#47996](https://github.com/ceph/ceph/pull/47996), Ilya Dryomov)

- librbd: tweak misleading "image is still primary" error message ([pr#47248](https://github.com/ceph/ceph/pull/47248), Ilya Dryomov)

- librbd: unlink newest mirror snapshot when at capacity, bump capacity ([pr#46594](https://github.com/ceph/ceph/pull/46594), Ilya Dryomov)

- librbd: update progress for non-existent objects on deep-copy ([pr#46910](https://github.com/ceph/ceph/pull/46910), Ilya Dryomov)

- librbd: use actual monitor addresses when creating a peer bootstrap token ([pr#47912](https://github.com/ceph/ceph/pull/47912), Ilya Dryomov)

- mds: clear MDCache::rejoin_\*\_q queues before recovering file inodes ([pr#46681](https://github.com/ceph/ceph/pull/46681), Xiubo Li)

- mds: do not assert early on when issuing client leases ([issue#54701](http://tracker.ceph.com/issues/54701), [pr#46566](https://github.com/ceph/ceph/pull/46566), Venky Shankar)

- mds: Don't blocklist clients in any replay state ([pr#47110](https://github.com/ceph/ceph/pull/47110), Kotresh HR)

- mds: fix crash when exporting unlinked dir ([pr#47181](https://github.com/ceph/ceph/pull/47181), 胡玮文)

- mds: flush mdlog if locked and still has wanted caps not satisfied ([pr#46494](https://github.com/ceph/ceph/pull/46494), Xiubo Li)

- mds: notify the xattr\_version to replica MDSes ([pr#47057](https://github.com/ceph/ceph/pull/47057), Xiubo Li)

- mds: skip fetching the dirfrags if not a directory ([pr#47432](https://github.com/ceph/ceph/pull/47432), Xiubo Li)

- mds: standby-replay daemon always removed in MDSMonitor::prepare\_beacon ([pr#47281](https://github.com/ceph/ceph/pull/47281), Patrick Donnelly)

- mds: switch to use projected inode instead ([pr#47058](https://github.com/ceph/ceph/pull/47058), Xiubo Li)

- mgr, mon: Keep upto date metadata with mgr for MONs ([pr#46559](https://github.com/ceph/ceph/pull/46559), Laura Flores, Prashant D)

- mgr/cephadm: Add disk rescan feature to the orchestrator ([pr#47311](https://github.com/ceph/ceph/pull/47311), Adam King, Paul Cuzner)

- mgr/cephadm: add parsing for config on osd specs ([pr#47268](https://github.com/ceph/ceph/pull/47268), Luis Domingues)

- mgr/cephadm: Adding logic to store grafana cert/key per node ([pr#47950](https://github.com/ceph/ceph/pull/47950), Redouane Kachach)

- mgr/cephadm: allow binding to loopback for rgw daemons ([pr#47951](https://github.com/ceph/ceph/pull/47951), Redouane Kachach)

- mgr/cephadm: capture exception when not able to list upgrade tags ([pr#46783](https://github.com/ceph/ceph/pull/46783), Redouane Kachach)

- mgr/cephadm: check for events key before accessing it ([pr#47317](https://github.com/ceph/ceph/pull/47317), Redouane Kachach)

- mgr/cephadm: check if a service exists before trying to restart it ([pr#46789](https://github.com/ceph/ceph/pull/46789), Redouane Kachach)

- mgr/cephadm: clear error message when resuming upgrade ([pr#47373](https://github.com/ceph/ceph/pull/47373), Adam King)

- mgr/cephadm: don't try to write client/os tuning profiles to known offline hosts ([pr#47953](https://github.com/ceph/ceph/pull/47953), Adam King)

- mgr/cephadm: fix handling of draining hosts with explicit placement specs ([pr#47657](https://github.com/ceph/ceph/pull/47657), Adam King)

- mgr/cephadm: Fix how we check if a host belongs to public network ([pr#47946](https://github.com/ceph/ceph/pull/47946), Redouane Kachach)

- mgr/cephadm: fix the loki address in grafana, promtail configuration files ([pr#47171](https://github.com/ceph/ceph/pull/47171), jinhong.kim)

- mgr/cephadm: fixing scheduler consistent hashing ([pr#47073](https://github.com/ceph/ceph/pull/47073), Redouane Kachach)

- mgr/cephadm: limiting ingress/keepalived pass to 8 chars ([pr#47070](https://github.com/ceph/ceph/pull/47070), Redouane Kachach)

- mgr/cephadm: recreate osd config when redeploy/reconfiguring ([pr#47659](https://github.com/ceph/ceph/pull/47659), Adam King)

- mgr/cephadm: set dashboard grafana-api-password when user provides one ([pr#47658](https://github.com/ceph/ceph/pull/47658), Adam King)

- mgr/cephadm: store device info separately from rest of host cache ([pr#46791](https://github.com/ceph/ceph/pull/46791), Adam King)

- mgr/cephadm: support for miscellaneous config files for daemons ([pr#47312](https://github.com/ceph/ceph/pull/47312), Adam King)

- mgr/cephadm: support for os tuning profiles ([pr#47316](https://github.com/ceph/ceph/pull/47316), Adam King)

- mgr/cephadm: try to get FQDN for active instance ([pr#46793](https://github.com/ceph/ceph/pull/46793), Tatjana Dehler)

- mgr/cephadm: use host shortname for osd memory autotuning ([pr#47075](https://github.com/ceph/ceph/pull/47075), Adam King)

- mgr/dashboard: Add daemon logs tab to Logs component ([pr#46807](https://github.com/ceph/ceph/pull/46807), Aashish Sharma)

- mgr/dashboard: add flag to automatically deploy loki/promtail service at bootstrap ([pr#47623](https://github.com/ceph/ceph/pull/47623), Aashish Sharma)

- mgr/dashboard: add required validation for frontend and monitor port ([pr#47356](https://github.com/ceph/ceph/pull/47356), Avan Thakkar)

- mgr/dashboard: added pattern validaton for form input ([pr#47329](https://github.com/ceph/ceph/pull/47329), Pedro Gonzalez Gomez)

- mgr/dashboard: BDD approach for the dashboard cephadm e2e ([pr#46528](https://github.com/ceph/ceph/pull/46528), Nizamudeen A)

- mgr/dashboard: bump moment from 2<span></span>.29<span></span>.1 to 2<span></span>.29<span></span>.3 in /src/pybind/mgr/dashboard/frontend ([pr#46718](https://github.com/ceph/ceph/pull/46718), dependabot[bot])

- mgr/dashboard: bump up teuthology ([pr#47498](https://github.com/ceph/ceph/pull/47498), Kefu Chai)

- mgr/dashboard: dashboard help command showing wrong syntax for login-banner ([pr#46809](https://github.com/ceph/ceph/pull/46809), Sarthak0702)

- mgr/dashboard: display helpfull message when the iframe-embedded Grafana dashboard failed to load ([pr#47007](https://github.com/ceph/ceph/pull/47007), Ngwa Sedrick Meh)

- mgr/dashboard: do not recommend throughput for ssd's only cluster ([pr#47156](https://github.com/ceph/ceph/pull/47156), Nizamudeen A)

- mgr/dashboard: don't log tracebacks on 404s ([pr#47094](https://github.com/ceph/ceph/pull/47094), Ernesto Puerta)

- mgr/dashboard: enable addition of custom Prometheus alerts ([pr#47942](https://github.com/ceph/ceph/pull/47942), Patrick Seidensal)

- mgr/dashboard: ensure limit 0 returns 0 images ([pr#47887](https://github.com/ceph/ceph/pull/47887), Pere Diaz Bou)

- mgr/dashboard: Feature 54330 osd creation workflow ([pr#46686](https://github.com/ceph/ceph/pull/46686), Pere Diaz Bou, Nizamudeen A, Sarthak0702)

- mgr/dashboard: fix \_rbd\_image\_refs caching ([pr#47635](https://github.com/ceph/ceph/pull/47635), Pere Diaz Bou)

- mgr/dashboard: fix nfs exports form issues with squash field ([pr#47961](https://github.com/ceph/ceph/pull/47961), Nizamudeen A)

- mgr/dashboard: fix unmanaged service creation ([pr#48025](https://github.com/ceph/ceph/pull/48025), Nizamudeen A)

- mgr/dashboard: grafana frontend e2e testing and update cypress ([pr#47703](https://github.com/ceph/ceph/pull/47703), Nizamudeen A)

- mgr/dashboard: Hide maintenance option on expand cluster ([pr#47724](https://github.com/ceph/ceph/pull/47724), Nizamudeen A)

- mgr/dashboard: host list tables doesn't show all services deployed ([pr#47453](https://github.com/ceph/ceph/pull/47453), Avan Thakkar)

- mgr/dashboard: Improve monitoring tabs content ([pr#46990](https://github.com/ceph/ceph/pull/46990), Aashish Sharma)

- mgr/dashboard: ingress backend service should list all supported services ([pr#47085](https://github.com/ceph/ceph/pull/47085), Avan Thakkar)

- mgr/dashboard: iops optimized option enabled ([pr#46819](https://github.com/ceph/ceph/pull/46819), Pere Diaz Bou)

- mgr/dashboard: iterate through copy of items ([pr#46871](https://github.com/ceph/ceph/pull/46871), Pedro Gonzalez Gomez)

- mgr/dashboard: prevent alert redirect ([pr#47146](https://github.com/ceph/ceph/pull/47146), Tatjana Dehler)

- mgr/dashboard: rbd image pagination ([pr#47104](https://github.com/ceph/ceph/pull/47104), Pere Diaz Bou, Nizamudeen A)

- mgr/dashboard: rbd striping setting pre-population and pop-over ([pr#47409](https://github.com/ceph/ceph/pull/47409), Vrushal Chaudhari)

- mgr/dashboard: rbd-mirror batch backport ([pr#46532](https://github.com/ceph/ceph/pull/46532), Pedro Gonzalez Gomez, Pere Diaz Bou, Nizamudeen A, Melissa Li, Sarthak0702, Avan Thakkar, Aashish Sharma)

- mgr/dashboard: remove token logging ([pr#47430](https://github.com/ceph/ceph/pull/47430), Pere Diaz Bou)

- mgr/dashboard: Show error on creating service with duplicate service id ([pr#47403](https://github.com/ceph/ceph/pull/47403), Aashish Sharma)

- mgr/dashboard: stop polling when page is not visible ([pr#46672](https://github.com/ceph/ceph/pull/46672), Sarthak0702)

- mgr/dashboard:Get different storage class metrics in Prometheus dashboard ([pr#47201](https://github.com/ceph/ceph/pull/47201), Aashish Sharma)

- mgr/nfs: validate virtual\_ip parameter ([pr#46794](https://github.com/ceph/ceph/pull/46794), Redouane Kachach)

- mgr/orchestrator/tests: don't match exact whitespace in table output ([pr#47858](https://github.com/ceph/ceph/pull/47858), Adam King)

- mgr/rook: fix error when trying to get the list of nfs services ([pr#48199](https://github.com/ceph/ceph/pull/48199), Juan Miguel Olmo)

- mgr/snap\_schedule: replace <span></span>.snap with the client configured snap dir name ([pr#47734](https://github.com/ceph/ceph/pull/47734), Milind Changire, Venky Shankar, Neeraj Pratap Singh)

- mgr/snap\_schedule: Use rados<span></span>.Ioctx<span></span>.remove\_object() instead of remove() ([pr#48013](https://github.com/ceph/ceph/pull/48013), Andreas Teuchert)

- mgr/telemetry: add `perf\_memory\_metrics` collection to telemetry ([pr#47826](https://github.com/ceph/ceph/pull/47826), Laura Flores)

- mgr/telemetry: handle daemons with complex ids ([pr#48283](https://github.com/ceph/ceph/pull/48283), Laura Flores)

- mgr/telemetry: reset health warning after re-opting-in ([pr#47289](https://github.com/ceph/ceph/pull/47289), Yaarit Hatuka)

- mgr/volumes: add interface to check the presence of subvolumegroups/subvolumes ([pr#47474](https://github.com/ceph/ceph/pull/47474), Neeraj Pratap Singh)

- mgr/volumes: Add volume info command ([pr#47768](https://github.com/ceph/ceph/pull/47768), Neeraj Pratap Singh)

- mgr/volumes: Few mgr volumes backports ([pr#47894](https://github.com/ceph/ceph/pull/47894), Rishabh Dave, Kotresh HR, Nikhilkumar Shelke)

- mgr/volumes: filter internal directories in 'subvolumegroup ls' command ([pr#47511](https://github.com/ceph/ceph/pull/47511), Nikhilkumar Shelke)

- mgr/volumes: Fix subvolume creation in FIPS enabled system ([pr#47368](https://github.com/ceph/ceph/pull/47368), Kotresh HR)

- mgr/volumes: prevent intermittent ParsingError failure in "clone cancel" ([pr#47747](https://github.com/ceph/ceph/pull/47747), John Mulligan)

- mgr/volumes: remove incorrect 'size' from output of 'snapshot info' ([pr#46804](https://github.com/ceph/ceph/pull/46804), Nikhilkumar Shelke)

- mgr/volumes: subvolume ls command crashes if groupname as '\_nogroup' ([pr#46805](https://github.com/ceph/ceph/pull/46805), Nikhilkumar Shelke)

- mgr/volumes: subvolumegroup quotas ([pr#46667](https://github.com/ceph/ceph/pull/46667), Kotresh HR)

- mgr: Define PY\_SSIZE\_T\_CLEAN ahead of every Python<span></span>.h ([pr#47616](https://github.com/ceph/ceph/pull/47616), Pete Zaitcev, Kefu Chai)

- mgr: relax "pending\_service\_map<span></span>.epoch > service\_map<span></span>.epoch" assert ([pr#46738](https://github.com/ceph/ceph/pull/46738), Mykola Golub)

- mirror snapshot schedule and trash purge schedule fixes ([pr#46781](https://github.com/ceph/ceph/pull/46781), Ilya Dryomov)

- mon/ConfigMonitor: fix config get key with whitespace ([pr#47381](https://github.com/ceph/ceph/pull/47381), Nitzan Mordechai)

- mon/Elector: notify\_rank\_removed erase rank from both live\_pinging and dead\_pinging sets for highest ranked MON ([pr#47086](https://github.com/ceph/ceph/pull/47086), Kamoltat)

- mon/MDSMonitor: fix standby-replay mds being removed from MDSMap unexpectedly ([pr#47902](https://github.com/ceph/ceph/pull/47902), 胡玮文)

- mon/OSDMonitor: Ensure kvmon() is writeable before handling "osd new" cmd ([pr#46689](https://github.com/ceph/ceph/pull/46689), Sridhar Seshasayee)

- monitoring/ceph-mixin: OSD overview typo fix ([pr#47387](https://github.com/ceph/ceph/pull/47387), Tatjana Dehler)

- monitoring: ceph mixin backports ([pr#47867](https://github.com/ceph/ceph/pull/47867), Aswin Toni, Arthur Outhenin-Chalandre, Anthony D'Atri, Tatjana Dehler)

- msg: fix deadlock when handling existing but closed v2 connection ([pr#47930](https://github.com/ceph/ceph/pull/47930), Radosław Zarzyński)

- msg: Fix Windows IPv6 support ([pr#47302](https://github.com/ceph/ceph/pull/47302), Lucian Petrut)

- msg: Log at higher level when Throttle::get\_or\_fail() fails ([pr#47765](https://github.com/ceph/ceph/pull/47765), Brad Hubbard)

- msg: reset ProtocolV2's frame assembler in appropriate thread ([pr#47931](https://github.com/ceph/ceph/pull/47931), Radoslaw Zarzynski)

- os/bluestore: fix AU accounting in bluestore\_cache\_other mempool ([pr#47339](https://github.com/ceph/ceph/pull/47339), Igor Fedotov)

- os/bluestore: Fix collision between BlueFS and BlueStore deferred writes ([pr#47297](https://github.com/ceph/ceph/pull/47297), Adam Kupczyk)

- osd, mds: fix the "heap" admin cmd printing always to error stream ([pr#47825](https://github.com/ceph/ceph/pull/47825), Radoslaw Zarzynski)

- osd, tools, kv: non-aggressive, on-line trimming of accumulated dups ([pr#47688](https://github.com/ceph/ceph/pull/47688), Radoslaw Zarzynski, Nitzan Mordechai)

- osd/scrub: do not start scrubbing if the PG is snap-trimming ([pr#46498](https://github.com/ceph/ceph/pull/46498), Ronen Friedman)

- osd/scrub: late-arriving reservation grants are not an error ([pr#46872](https://github.com/ceph/ceph/pull/46872), Ronen Friedman)

- osd/scrub: Reintroduce scrub starts message ([pr#47621](https://github.com/ceph/ceph/pull/47621), Prashant D)

- osd/scrubber/pg\_scrubber.cc: fix bug where scrub machine gets stuck ([pr#46844](https://github.com/ceph/ceph/pull/46844), Cory Snyder)

- osd/SnapMapper: fix legacy key conversion in snapmapper class ([pr#47133](https://github.com/ceph/ceph/pull/47133), Manuel Lausch, Matan Breizman)

- osd: Handle oncommits and wait for future work items from mClock queue ([pr#47490](https://github.com/ceph/ceph/pull/47490), Sridhar Seshasayee)

- osd: return ENOENT if pool information is invalid during tier-flush ([pr#47929](https://github.com/ceph/ceph/pull/47929), Myoungwon Oh)

- osd: Set initial mClock QoS params at CONF\_DEFAULT level ([pr#47020](https://github.com/ceph/ceph/pull/47020), Sridhar Seshasayee)

- PendingReleaseNotes: Note the fix for high CPU utilization during recovery ([pr#48004](https://github.com/ceph/ceph/pull/48004), Sridhar Seshasayee)

- pybind/mgr/cephadm/serve: don't remove ceph<span></span>.conf which leads to qa failure ([pr#47072](https://github.com/ceph/ceph/pull/47072), Dhairya Parmar)

- pybind/mgr/dashboard: do not use distutils<span></span>.version<span></span>.StrictVersion ([pr#47602](https://github.com/ceph/ceph/pull/47602), Kefu Chai)

- pybind/mgr/pg\_autoscaler: change overlapping roots to warning ([pr#47519](https://github.com/ceph/ceph/pull/47519), Kamoltat)

- pybind/mgr: ceph osd status crash with ZeroDivisionError ([pr#46697](https://github.com/ceph/ceph/pull/46697), Nitzan Mordechai)

- pybind/mgr: fix flake8 ([pr#47391](https://github.com/ceph/ceph/pull/47391), Avan Thakkar)

- python-common: allow crush device class to be set from osd service spec ([pr#46792](https://github.com/ceph/ceph/pull/46792), Cory Snyder)

- qa/cephadm: specify using container host distros for workunits ([pr#47910](https://github.com/ceph/ceph/pull/47910), Adam King)

- qa/cephfs: fallback to older way of get\_op\_read\_count ([pr#46899](https://github.com/ceph/ceph/pull/46899), Dhairya Parmar)

- qa/suites/rbd/pwl-cache: ensure recovery is actually tested ([pr#47129](https://github.com/ceph/ceph/pull/47129), Ilya Dryomov, Yin Congmin)

- qa/suites/rbd: disable workunit timeout for dynamic\_features\_no\_cache ([pr#47159](https://github.com/ceph/ceph/pull/47159), Ilya Dryomov)

- qa/suites/rbd: place cache file on tmpfs for xfstests ([pr#46598](https://github.com/ceph/ceph/pull/46598), Ilya Dryomov)

- qa/tasks/ceph\_manager<span></span>.py: increase test\_pool\_min\_size timeout ([pr#47445](https://github.com/ceph/ceph/pull/47445), Kamoltat)

- qa/workunits/cephadm: update test\_repos master -> main ([pr#47315](https://github.com/ceph/ceph/pull/47315), Adam King)

- qa: wait rank 0 to become up:active state before mounting fuse client ([pr#46801](https://github.com/ceph/ceph/pull/46801), Xiubo Li)

- quincy -- sse s3 changes ([pr#46467](https://github.com/ceph/ceph/pull/46467), Casey Bodley, Marcus Watts, Priya Sehgal)

- rbd-fuse: librados will filter out -r option from command-line ([pr#46954](https://github.com/ceph/ceph/pull/46954), wanwencong)

- rbd-mirror: don't prune non-primary snapshot when restarting delta sync ([pr#46591](https://github.com/ceph/ceph/pull/46591), Ilya Dryomov)

- rbd-mirror: generally skip replay/resync if remote image is not primary ([pr#46814](https://github.com/ceph/ceph/pull/46814), Ilya Dryomov)

- rbd-mirror: remove bogus completed\_non\_primary\_snapshots\_exist check ([pr#47126](https://github.com/ceph/ceph/pull/47126), Ilya Dryomov)

- rbd-mirror: resume pending shutdown on error in snapshot replayer ([pr#47914](https://github.com/ceph/ceph/pull/47914), Ilya Dryomov)

- rbd: don't default empty pool name unless namespace is specified ([pr#47144](https://github.com/ceph/ceph/pull/47144), Ilya Dryomov)

- rbd: find\_action() should sort actions first ([pr#47584](https://github.com/ceph/ceph/pull/47584), Ilya Dryomov)

- RGW - Swift retarget needs bucket set on object ([pr#46719](https://github.com/ceph/ceph/pull/46719), Daniel Gryniewicz)

- rgw/backport/quincy: Fix crashes with Sync policy APIs ([pr#47993](https://github.com/ceph/ceph/pull/47993), Soumya Koduri)

- rgw/dbstore: Fix build errors on centos9 ([pr#46915](https://github.com/ceph/ceph/pull/46915), Soumya Koduri)

- rgw: Avoid segfault when OPA authz is enabled ([pr#46107](https://github.com/ceph/ceph/pull/46107), Benoît Knecht)

- rgw: better tenant id from the uri on anonymous access ([pr#47342](https://github.com/ceph/ceph/pull/47342), Rafał Wądołowski, Marcus Watts)

- rgw: check object storage\_class when check\_disk\_state ([pr#46580](https://github.com/ceph/ceph/pull/46580), Huber-ming)

- rgw: data sync uses yield\_spawn\_window() ([pr#45714](https://github.com/ceph/ceph/pull/45714), Casey Bodley)

- rgw: Fix data race in ChangeStatus ([pr#47195](https://github.com/ceph/ceph/pull/47195), Adam C. Emerson)

- rgw: Guard against malformed bucket URLs ([pr#47191](https://github.com/ceph/ceph/pull/47191), Adam C. Emerson)

- rgw: log access key id in ops logs ([pr#46624](https://github.com/ceph/ceph/pull/46624), Cory Snyder)

- rgw: reopen ops log file on sighup ([pr#46625](https://github.com/ceph/ceph/pull/46625), Cory Snyder)

- rgw\_rest\_user\_policy: Fix GetUserPolicy & ListUserPolicies responses ([pr#47235](https://github.com/ceph/ceph/pull/47235), Sumedh A. Kulkarni)

- rgwlc: fix segfault resharding during lc ([pr#46742](https://github.com/ceph/ceph/pull/46742), Mark Kogan)

- script/build-integration-branch: add quincy to the list of releases ([pr#46361](https://github.com/ceph/ceph/pull/46361), Yuri Weinstein)

- SimpleRADOSStriper: Avoid moving bufferlists by using deque in read() ([pr#47909](https://github.com/ceph/ceph/pull/47909), Matan Breizman)

- src/mgr/DaemonServer<span></span>.cc: fix typo in output gap >= max\_pg\_num\_change ([pr#47210](https://github.com/ceph/ceph/pull/47210), Kamoltat)

- test/lazy-omap-stats: Various enhancements ([pr#47932](https://github.com/ceph/ceph/pull/47932), Brad Hubbard)

- test/{librbd, rgw}: increase delay between and number of bind attempts ([pr#48023](https://github.com/ceph/ceph/pull/48023), Ilya Dryomov)

- test/{librbd, rgw}: retry when bind fail with port 0 ([pr#47980](https://github.com/ceph/ceph/pull/47980), Kefu Chai)

- tooling: Change mrun to use bash ([pr#46076](https://github.com/ceph/ceph/pull/46076), Adam C. Emerson)

- tools: ceph-objectstore-tool is able to trim pg log dups' entries ([pr#46706](https://github.com/ceph/ceph/pull/46706), Radosław Zarzyński)

- win32\_deps\_build<span></span>.sh: master -> main for wnbd ([pr#46763](https://github.com/ceph/ceph/pull/46763), Ilya Dryomov)
