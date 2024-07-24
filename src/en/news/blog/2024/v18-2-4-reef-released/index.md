---
title: "v18.2.4 Reef released"
date: "2024-07-24"
author: "Yuri Weinstein"
tags:
  - "release"
  - "reef"
---

This is the third backport release in the Reef series. We recommend that all users update to this release.

An early build of this release was accidentally exposed and packaged as 18.2.3 by the Debian project in April.
That 18.2.3 release should not be used.
The official release was re-tagged as v18.2.4 to avoidfurther confusion.

v18.2.4 container images, now based on CentOS 9, may be incompatible on older kernels (e.g., Ubuntu 18.04) due
to differences in thread creation methods. Users upgrading to v18.2.4 container images on older OS versions
may encounter crashes during pthread_create. For workarounds, refer to the related tracker. However, we recommend
upgrading your OS to avoid this unsupported combination.
Related tracker: https://tracker.ceph.com/issues/66989

## Notable Changes

* RBD: When diffing against the beginning of time (`fromsnapname == NULL`) in
  fast-diff mode (`whole_object == true` with `fast-diff` image feature enabled
  and valid), diff-iterate is now guaranteed to execute locally if exclusive
  lock is available.  This brings a dramatic performance improvement for QEMU
  live disk synchronization and backup use cases.
* RADOS: `get_pool_is_selfmanaged_snaps_mode` C++ API has been deprecated
  due to being prone to false negative results.  Its safer replacement is
  `pool_is_in_selfmanaged_snaps_mode`.
* RBD: The option ``--image-id`` has been added to `rbd children` CLI command,
  so it can be run for images in the trash.

## Changelog

- (reef) node-proxy: improve http error handling in fetch\_oob\_details ([pr#55538](https://github.com/ceph/ceph/pull/55538), Guillaume Abrioux)

- [rgw][lc][rgw\_lifecycle\_work\_time] adjust timing if the configured end time is less than the start time ([pr#54866](https://github.com/ceph/ceph/pull/54866), Oguzhan Ozmen)

- add checking for rgw frontend init ([pr#54844](https://github.com/ceph/ceph/pull/54844), zhipeng li)

- admin/doc-requirements: bump Sphinx to 5<span></span>.0<span></span>.2 ([pr#55191](https://github.com/ceph/ceph/pull/55191), Nizamudeen A)

- backport of fixes for 63678 and 63694 ([pr#55104](https://github.com/ceph/ceph/pull/55104), Redouane Kachach)

- backport rook/mgr recent changes ([pr#55706](https://github.com/ceph/ceph/pull/55706), Redouane Kachach)

- ceph-menv:fix typo in README ([pr#55163](https://github.com/ceph/ceph/pull/55163), yu.wang)

- ceph-volume: add missing import ([pr#56259](https://github.com/ceph/ceph/pull/56259), Guillaume Abrioux)

- ceph-volume: fix a bug in \_check\_generic\_reject\_reasons ([pr#54705](https://github.com/ceph/ceph/pull/54705), Kim Minjong)

- ceph-volume: Fix migration from WAL to data with no DB ([pr#55497](https://github.com/ceph/ceph/pull/55497), Igor Fedotov)

- ceph-volume: fix mpath device support ([pr#53539](https://github.com/ceph/ceph/pull/53539), Guillaume Abrioux)

- ceph-volume: fix zap\_partitions() in devices<span></span>.lvm<span></span>.zap ([pr#55477](https://github.com/ceph/ceph/pull/55477), Guillaume Abrioux)

- ceph-volume: fixes fallback to stat in is\_device and is\_partition ([pr#54629](https://github.com/ceph/ceph/pull/54629), Teoman ONAY)

- ceph-volume: update functional testing ([pr#56857](https://github.com/ceph/ceph/pull/56857), Guillaume Abrioux)

- ceph-volume: use 'no workqueue' options with dmcrypt ([pr#55335](https://github.com/ceph/ceph/pull/55335), Guillaume Abrioux)

- ceph-volume: Use safe accessor to get TYPE info ([pr#56323](https://github.com/ceph/ceph/pull/56323), Dillon Amburgey)

- ceph<span></span>.spec<span></span>.in: add support for openEuler OS ([pr#56361](https://github.com/ceph/ceph/pull/56361), liuqinfei)

- ceph<span></span>.spec<span></span>.in: remove command-with-macro line ([pr#57357](https://github.com/ceph/ceph/pull/57357), John Mulligan)

- cephadm/nvmeof: scrape nvmeof prometheus endpoint ([pr#56108](https://github.com/ceph/ceph/pull/56108), Avan Thakkar)

- cephadm: Add mount for nvmeof log location ([pr#55819](https://github.com/ceph/ceph/pull/55819), Roy Sahar)

- cephadm: Add nvmeof to autotuner calculation ([pr#56100](https://github.com/ceph/ceph/pull/56100), Paul Cuzner)

- cephadm: add timemaster to timesync services list ([pr#56307](https://github.com/ceph/ceph/pull/56307), Florent Carli)

- cephadm: adjust the ingress ha proxy health check interval ([pr#56286](https://github.com/ceph/ceph/pull/56286), Jiffin Tony Thottan)

- cephadm: create ceph-exporter sock dir if it's not present ([pr#56102](https://github.com/ceph/ceph/pull/56102), Adam King)

- cephadm: fix get\_version for nvmeof ([pr#56099](https://github.com/ceph/ceph/pull/56099), Adam King)

- cephadm: improve cephadm pull usage message ([pr#56292](https://github.com/ceph/ceph/pull/56292), Adam King)

- cephadm: remove restriction for crush device classes ([pr#56106](https://github.com/ceph/ceph/pull/56106), Seena Fallah)

- cephadm: rm podman-auth<span></span>.json if removing last cluster ([pr#56105](https://github.com/ceph/ceph/pull/56105), Adam King)

- cephfs-shell: remove distutils Version classes because they're deprecated ([pr#54119](https://github.com/ceph/ceph/pull/54119), Venky Shankar, Jos Collin)

- cephfs-top: include the missing fields in --dump output ([pr#54520](https://github.com/ceph/ceph/pull/54520), Jos Collin)

- client/fuse: handle case of renameat2 with non-zero flags ([pr#55002](https://github.com/ceph/ceph/pull/55002), Leonid Usov, Shachar Sharon)

- client: append to buffer list to save all result from wildcard command ([pr#53893](https://github.com/ceph/ceph/pull/53893), Rishabh Dave, Jinmyeong Lee, Jimyeong Lee)

- client: call \_getattr() for -ENODATA returned \_getvxattr() calls ([pr#54404](https://github.com/ceph/ceph/pull/54404), Jos Collin)

- client: fix leak of file handles ([pr#56122](https://github.com/ceph/ceph/pull/56122), Xavi Hernandez)

- client: Fix return in removexattr for xattrs from `system<span></span>.` namespace ([pr#55803](https://github.com/ceph/ceph/pull/55803), Anoop C S)

- client: queue a delay cap flushing if there are ditry caps/snapcaps ([pr#54466](https://github.com/ceph/ceph/pull/54466), Xiubo Li)

- client: readdir\_r\_cb: get rstat for dir only if using rbytes for size ([pr#53359](https://github.com/ceph/ceph/pull/53359), Pinghao Wu)

- cmake/arrow: don't treat warnings as errors ([pr#57375](https://github.com/ceph/ceph/pull/57375), Casey Bodley)

- cmake/modules/BuildRocksDB<span></span>.cmake: inherit parent's CMAKE\_CXX\_FLAGS ([pr#55502](https://github.com/ceph/ceph/pull/55502), Kefu Chai)

- cmake: use or turn off liburing for rocksdb ([pr#54122](https://github.com/ceph/ceph/pull/54122), Casey Bodley, Patrick Donnelly)

- common/options: Set LZ4 compression for bluestore RocksDB ([pr#55197](https://github.com/ceph/ceph/pull/55197), Mark Nelson)

- common/weighted\_shuffle: don't feed std::discrete\_distribution with all-zero weights ([pr#55153](https://github.com/ceph/ceph/pull/55153), Radosław Zarzyński)

- common: resolve config proxy deadlock using refcounted pointers ([pr#54373](https://github.com/ceph/ceph/pull/54373), Patrick Donnelly)

- DaemonServer<span></span>.cc: fix config show command for RGW daemons ([pr#55077](https://github.com/ceph/ceph/pull/55077), Aishwarya Mathuria)

- debian: add ceph-exporter package ([pr#56541](https://github.com/ceph/ceph/pull/56541), Shinya Hayashi)

- debian: add missing bcrypt to ceph-mgr <span></span>.requires to fix resulting package dependencies ([pr#54662](https://github.com/ceph/ceph/pull/54662), Thomas Lamprecht)

- doc/architecture<span></span>.rst - fix typo ([pr#55384](https://github.com/ceph/ceph/pull/55384), Zac Dover)

- doc/architecture<span></span>.rst: improve rados definition ([pr#55343](https://github.com/ceph/ceph/pull/55343), Zac Dover)

- doc/architecture: correct typo ([pr#56012](https://github.com/ceph/ceph/pull/56012), Zac Dover)

- doc/architecture: improve some paragraphs ([pr#55399](https://github.com/ceph/ceph/pull/55399), Zac Dover)

- doc/architecture: remove pleonasm ([pr#55933](https://github.com/ceph/ceph/pull/55933), Zac Dover)

- doc/cephadm - edit t11ing ([pr#55482](https://github.com/ceph/ceph/pull/55482), Zac Dover)

- doc/cephadm/services: Improve monitoring<span></span>.rst ([pr#56290](https://github.com/ceph/ceph/pull/56290), Anthony D'Atri)

- doc/cephadm: correct nfs config pool name ([pr#55603](https://github.com/ceph/ceph/pull/55603), Zac Dover)

- doc/cephadm: improve host-management<span></span>.rst ([pr#56111](https://github.com/ceph/ceph/pull/56111), Anthony D'Atri)

- doc/cephadm: Improve multiple files ([pr#56130](https://github.com/ceph/ceph/pull/56130), Anthony D'Atri)

- doc/cephfs/client-auth<span></span>.rst: correct ``fs authorize cephfs1 /dir1 clie… ([pr#55246](https://github.com/ceph/ceph/pull/55246), 叶海丰)

- doc/cephfs: edit add-remove-mds ([pr#55648](https://github.com/ceph/ceph/pull/55648), Zac Dover)

- doc/cephfs: fix architecture link to correct relative path ([pr#56340](https://github.com/ceph/ceph/pull/56340), molpako)

- doc/cephfs: Update disaster-recovery-experts<span></span>.rst to mention Slack ([pr#55044](https://github.com/ceph/ceph/pull/55044), Dhairya Parmar)

- doc/crimson: cleanup duplicate seastore description ([pr#55730](https://github.com/ceph/ceph/pull/55730), Rongqi Sun)

- doc/dev: backport zipapp docs to reef ([pr#56161](https://github.com/ceph/ceph/pull/56161), Zac Dover)

- doc/dev: edit internals<span></span>.rst ([pr#55852](https://github.com/ceph/ceph/pull/55852), Zac Dover)

- doc/dev: edit teuthology workflow ([pr#56002](https://github.com/ceph/ceph/pull/56002), Zac Dover)

- doc/dev: fix spelling in crimson<span></span>.rst ([pr#55737](https://github.com/ceph/ceph/pull/55737), Zac Dover)

- doc/dev: osd\_internals/snaps<span></span>.rst: add clone\_overlap doc ([pr#56523](https://github.com/ceph/ceph/pull/56523), Matan Breizman)

- doc/dev: refine "Concepts" ([pr#56660](https://github.com/ceph/ceph/pull/56660), Zac Dover)

- doc/dev: refine "Concepts" 2 of 3 ([pr#56725](https://github.com/ceph/ceph/pull/56725), Zac Dover)

- doc/dev: refine "Concepts" 3 of 3 ([pr#56729](https://github.com/ceph/ceph/pull/56729), Zac Dover)

- doc/dev: refine "Concepts" 4 of 3 ([pr#56740](https://github.com/ceph/ceph/pull/56740), Zac Dover)

- doc/dev: update leads list ([pr#56603](https://github.com/ceph/ceph/pull/56603), Zac Dover)

- doc/dev: update leads list ([pr#56589](https://github.com/ceph/ceph/pull/56589), Zac Dover)

- doc/glossary<span></span>.rst: add "Monitor Store" ([pr#54743](https://github.com/ceph/ceph/pull/54743), Zac Dover)

- doc/glossary: add "Crimson" entry ([pr#56073](https://github.com/ceph/ceph/pull/56073), Zac Dover)

- doc/glossary: add "librados" entry ([pr#56235](https://github.com/ceph/ceph/pull/56235), Zac Dover)

- doc/glossary: Add "OMAP" to glossary ([pr#55749](https://github.com/ceph/ceph/pull/55749), Zac Dover)

- doc/glossary: Add link to CRUSH paper ([pr#55557](https://github.com/ceph/ceph/pull/55557), Zac Dover)

- doc/glossary: improve "MDS" entry ([pr#55849](https://github.com/ceph/ceph/pull/55849), Zac Dover)

- doc/glossary: improve OSD definitions ([pr#55613](https://github.com/ceph/ceph/pull/55613), Zac Dover)

- doc/install: add manual RADOSGW install procedure ([pr#55880](https://github.com/ceph/ceph/pull/55880), Zac Dover)

- doc/install: update "update submodules" ([pr#54961](https://github.com/ceph/ceph/pull/54961), Zac Dover)

- doc/man/8/mount<span></span>.ceph<span></span>.rst: add more mount options ([pr#55754](https://github.com/ceph/ceph/pull/55754), Xiubo Li)

- doc/man: edit "manipulating the omap key" ([pr#55635](https://github.com/ceph/ceph/pull/55635), Zac Dover)

- doc/man: edit ceph-osd description ([pr#54551](https://github.com/ceph/ceph/pull/54551), Zac Dover)

- doc/mgr: credit John Jasen for Zabbix 2 ([pr#56684](https://github.com/ceph/ceph/pull/56684), Zac Dover)

- doc/mgr: document lack of MSWin NFS 4<span></span>.x support ([pr#55032](https://github.com/ceph/ceph/pull/55032), Zac Dover)

- doc/mgr: update zabbix information ([pr#56631](https://github.com/ceph/ceph/pull/56631), Zac Dover)

- doc/rados/configuration/bluestore-config-ref: Fix lowcase typo ([pr#54694](https://github.com/ceph/ceph/pull/54694), Adam Kupczyk)

- doc/rados/configuration/osd-config-ref: fix typo ([pr#55678](https://github.com/ceph/ceph/pull/55678), Pierre Riteau)

- doc/rados/operations: add EC overhead table to erasure-code<span></span>.rst ([pr#55244](https://github.com/ceph/ceph/pull/55244), Anthony D'Atri)

- doc/rados/operations: Fix off-by-one errors in control<span></span>.rst ([pr#55231](https://github.com/ceph/ceph/pull/55231), tobydarling)

- doc/rados/operations: Improve crush\_location docs ([pr#56594](https://github.com/ceph/ceph/pull/56594), Niklas Hambüchen)

- doc/rados: add "change public network" procedure ([pr#55799](https://github.com/ceph/ceph/pull/55799), Zac Dover)

- doc/rados: add link to pg blog post ([pr#55611](https://github.com/ceph/ceph/pull/55611), Zac Dover)

- doc/rados: add PG definition ([pr#55630](https://github.com/ceph/ceph/pull/55630), Zac Dover)

- doc/rados: edit "client can't connect<span></span>.<span></span>.<span></span>." ([pr#54654](https://github.com/ceph/ceph/pull/54654), Zac Dover)

- doc/rados: edit "Everything Failed! Now What?" ([pr#54665](https://github.com/ceph/ceph/pull/54665), Zac Dover)

- doc/rados: edit "monitor store failures" ([pr#54659](https://github.com/ceph/ceph/pull/54659), Zac Dover)

- doc/rados: edit "recovering broken monmap" ([pr#54601](https://github.com/ceph/ceph/pull/54601), Zac Dover)

- doc/rados: edit "understanding mon\_status" ([pr#54579](https://github.com/ceph/ceph/pull/54579), Zac Dover)

- doc/rados: edit "Using the Monitor's Admin Socket" ([pr#54576](https://github.com/ceph/ceph/pull/54576), Zac Dover)

- doc/rados: fix broken links ([pr#55680](https://github.com/ceph/ceph/pull/55680), Zac Dover)

- doc/rados: format sections in tshooting-mon<span></span>.rst ([pr#54638](https://github.com/ceph/ceph/pull/54638), Zac Dover)

- doc/rados: improve "Ceph Subsystems" ([pr#54702](https://github.com/ceph/ceph/pull/54702), Zac Dover)

- doc/rados: improve formatting of log-and-debug<span></span>.rst ([pr#54746](https://github.com/ceph/ceph/pull/54746), Zac Dover)

- doc/rados: link to pg setting commands ([pr#55936](https://github.com/ceph/ceph/pull/55936), Zac Dover)

- doc/rados: ops/pgs: s/power of 2/power of two ([pr#54700](https://github.com/ceph/ceph/pull/54700), Zac Dover)

- doc/rados: remove PGcalc from docs ([pr#55901](https://github.com/ceph/ceph/pull/55901), Zac Dover)

- doc/rados: repair stretch-mode<span></span>.rst ([pr#54762](https://github.com/ceph/ceph/pull/54762), Zac Dover)

- doc/rados: restore PGcalc tool ([pr#56057](https://github.com/ceph/ceph/pull/56057), Zac Dover)

- doc/rados: update "stretch mode" ([pr#54756](https://github.com/ceph/ceph/pull/54756), Michael Collins)

- doc/rados: update common<span></span>.rst ([pr#56268](https://github.com/ceph/ceph/pull/56268), Zac Dover)

- doc/rados: update config for autoscaler ([pr#55438](https://github.com/ceph/ceph/pull/55438), Zac Dover)

- doc/rados: update PG guidance ([pr#55460](https://github.com/ceph/ceph/pull/55460), Zac Dover)

- doc/radosgw - edit admin<span></span>.rst "set user rate limit" ([pr#55150](https://github.com/ceph/ceph/pull/55150), Zac Dover)

- doc/radosgw/admin<span></span>.rst: use underscores in config var names ([pr#54933](https://github.com/ceph/ceph/pull/54933), Ville Ojamo)

- doc/radosgw: add confval directives ([pr#55484](https://github.com/ceph/ceph/pull/55484), Zac Dover)

- doc/radosgw: add gateway starting command ([pr#54833](https://github.com/ceph/ceph/pull/54833), Zac Dover)

- doc/radosgw: admin<span></span>.rst - edit "Create a Subuser" ([pr#55020](https://github.com/ceph/ceph/pull/55020), Zac Dover)

- doc/radosgw: admin<span></span>.rst - edit "Create a User" ([pr#55004](https://github.com/ceph/ceph/pull/55004), Zac Dover)

- doc/radosgw: admin<span></span>.rst - edit sections ([pr#55017](https://github.com/ceph/ceph/pull/55017), Zac Dover)

- doc/radosgw: edit "Add/Remove a Key" ([pr#55055](https://github.com/ceph/ceph/pull/55055), Zac Dover)

- doc/radosgw: edit "Enable/Disable Bucket Rate Limit" ([pr#55260](https://github.com/ceph/ceph/pull/55260), Zac Dover)

- doc/radosgw: edit "read/write global rate limit" admin<span></span>.rst ([pr#55271](https://github.com/ceph/ceph/pull/55271), Zac Dover)

- doc/radosgw: edit "remove a subuser" ([pr#55034](https://github.com/ceph/ceph/pull/55034), Zac Dover)

- doc/radosgw: edit "Usage" admin<span></span>.rst ([pr#55321](https://github.com/ceph/ceph/pull/55321), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst "Get Bucket Rate Limit" ([pr#55253](https://github.com/ceph/ceph/pull/55253), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst "get user rate limit" ([pr#55157](https://github.com/ceph/ceph/pull/55157), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst "set bucket rate limit" ([pr#55242](https://github.com/ceph/ceph/pull/55242), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst - quota ([pr#55082](https://github.com/ceph/ceph/pull/55082), Zac Dover)

- doc/radosgw: edit admin<span></span>.rst 1 of x ([pr#55000](https://github.com/ceph/ceph/pull/55000), Zac Dover)

- doc/radosgw: edit compression<span></span>.rst ([pr#54985](https://github.com/ceph/ceph/pull/54985), Zac Dover)

- doc/radosgw: edit front matter - role<span></span>.rst ([pr#54854](https://github.com/ceph/ceph/pull/54854), Zac Dover)

- doc/radosgw: edit multisite<span></span>.rst ([pr#55671](https://github.com/ceph/ceph/pull/55671), Zac Dover)

- doc/radosgw: edit sections ([pr#55027](https://github.com/ceph/ceph/pull/55027), Zac Dover)

- doc/radosgw: fix formatting ([pr#54753](https://github.com/ceph/ceph/pull/54753), Zac Dover)

- doc/radosgw: Fix JSON typo in Principal Tag example code snippet ([pr#54642](https://github.com/ceph/ceph/pull/54642), Daniel Parkes)

- doc/radosgw: fix verb disagreement - index<span></span>.html ([pr#55338](https://github.com/ceph/ceph/pull/55338), Zac Dover)

- doc/radosgw: format "Create a Role" ([pr#54886](https://github.com/ceph/ceph/pull/54886), Zac Dover)

- doc/radosgw: format commands in role<span></span>.rst ([pr#54905](https://github.com/ceph/ceph/pull/54905), Zac Dover)

- doc/radosgw: format POST statements ([pr#54849](https://github.com/ceph/ceph/pull/54849), Zac Dover)

- doc/radosgw: list supported plugins-compression<span></span>.rst ([pr#54995](https://github.com/ceph/ceph/pull/54995), Zac Dover)

- doc/radosgw: update link in rgw-cache<span></span>.rst ([pr#54805](https://github.com/ceph/ceph/pull/54805), Zac Dover)

- doc/radosrgw: edit admin<span></span>.rst ([pr#55073](https://github.com/ceph/ceph/pull/55073), Zac Dover)

- doc/rbd: add clone mapping command ([pr#56208](https://github.com/ceph/ceph/pull/56208), Zac Dover)

- doc/rbd: add map information for clone images to rbd-encryption<span></span>.rst ([pr#56186](https://github.com/ceph/ceph/pull/56186), N Balachandran)

- doc/rbd: minor changes to the rbd man page ([pr#56256](https://github.com/ceph/ceph/pull/56256), N Balachandran)

- doc/rbd: repair ordered list ([pr#55732](https://github.com/ceph/ceph/pull/55732), Zac Dover)

- doc/releases: edit reef<span></span>.rst ([pr#55064](https://github.com/ceph/ceph/pull/55064), Zac Dover)

- doc/releases: specify dashboard improvements ([pr#55049](https://github.com/ceph/ceph/pull/55049), Laura Flores, Zac Dover)

- doc/rgw: edit admin<span></span>.rst - rate limit management ([pr#55128](https://github.com/ceph/ceph/pull/55128), Zac Dover)

- doc/rgw: fix Attributes index in CreateTopic example ([pr#55432](https://github.com/ceph/ceph/pull/55432), Casey Bodley)

- doc/start: add Slack invite link ([pr#56041](https://github.com/ceph/ceph/pull/56041), Zac Dover)

- doc/start: explain "OSD" ([pr#54559](https://github.com/ceph/ceph/pull/54559), Zac Dover)

- doc/start: improve MDS explanation ([pr#56466](https://github.com/ceph/ceph/pull/56466), Zac Dover)

- doc/start: improve MDS explanation ([pr#56426](https://github.com/ceph/ceph/pull/56426), Zac Dover)

- doc/start: link to mon map command ([pr#56410](https://github.com/ceph/ceph/pull/56410), Zac Dover)

- doc/start: update release names ([pr#54572](https://github.com/ceph/ceph/pull/54572), Zac Dover)

- doc: add description of metric fields for cephfs-top ([pr#55511](https://github.com/ceph/ceph/pull/55511), Neeraj Pratap Singh)

- doc: Add NVMe-oF gateway documentation ([pr#55724](https://github.com/ceph/ceph/pull/55724), Orit Wasserman)

- doc: add supported file types in cephfs-mirroring<span></span>.rst ([pr#54822](https://github.com/ceph/ceph/pull/54822), Jos Collin)

- doc: adding documentation for secure monitoring stack configuration ([pr#56104](https://github.com/ceph/ceph/pull/56104), Redouane Kachach)

- doc: cephadm/services/osd: fix typo ([pr#56230](https://github.com/ceph/ceph/pull/56230), Lorenz Bausch)

- doc: Fixes two typos and grammatical errors<span></span>. Signed-off-by: Sina Ahma… ([pr#54775](https://github.com/ceph/ceph/pull/54775), Sina Ahmadi)

- doc: fixing doc/cephfs/fs-volumes ([pr#56648](https://github.com/ceph/ceph/pull/56648), Neeraj Pratap Singh)

- doc: remove releases docs ([pr#56567](https://github.com/ceph/ceph/pull/56567), Patrick Donnelly)

- doc: specify correct fs type for mkfs ([pr#55282](https://github.com/ceph/ceph/pull/55282), Vladislav Glagolev)

- doc: update rgw admin api req params for get user info ([pr#55071](https://github.com/ceph/ceph/pull/55071), Ali Maredia)

- doc:start<span></span>.rst fix typo in hw-recs ([pr#55505](https://github.com/ceph/ceph/pull/55505), Eduardo Roldan)

- docs/rados: remove incorrect ceph command ([pr#56495](https://github.com/ceph/ceph/pull/56495), Taha Jahangir)

- docs/radosgw: edit admin<span></span>.rst "enable/disable user rate limit" ([pr#55194](https://github.com/ceph/ceph/pull/55194), Zac Dover)

- docs/rbd: fix typo in arg name ([pr#56262](https://github.com/ceph/ceph/pull/56262), N Balachandran)

- docs: Add information about OpenNebula integration ([pr#54938](https://github.com/ceph/ceph/pull/54938), Daniel Clavijo)

- librados: make querying pools for selfmanaged snaps reliable ([pr#55026](https://github.com/ceph/ceph/pull/55026), Ilya Dryomov)

- librbd: account for discards that truncate in ObjectListSnapsRequest ([pr#56213](https://github.com/ceph/ceph/pull/56213), Ilya Dryomov)

- librbd: Append one journal event per image request ([pr#54818](https://github.com/ceph/ceph/pull/54818), Ilya Dryomov, Joshua Baergen)

- librbd: don't report HOLE\_UPDATED when diffing against a hole ([pr#54951](https://github.com/ceph/ceph/pull/54951), Ilya Dryomov)

- librbd: fix regressions in ObjectListSnapsRequest ([pr#54862](https://github.com/ceph/ceph/pull/54862), Ilya Dryomov)

- librbd: fix split() for SparseExtent and SparseBufferlistExtent ([pr#55665](https://github.com/ceph/ceph/pull/55665), Ilya Dryomov)

- librbd: improve rbd\_diff\_iterate2() performance in fast-diff mode ([pr#55427](https://github.com/ceph/ceph/pull/55427), Ilya Dryomov)

- librbd: return ENOENT from Snapshot::get\_timestamp for nonexistent snap\_id ([pr#55474](https://github.com/ceph/ceph/pull/55474), John Agombar)

- make-dist: don't use --continue option for wget ([pr#55091](https://github.com/ceph/ceph/pull/55091), Casey Bodley)

- MClientRequest: properly handle ceph\_mds\_request\_head\_legacy for ext\_num\_retry, ext\_num\_fwd, owner\_uid, owner\_gid ([pr#54407](https://github.com/ceph/ceph/pull/54407), Alexander Mikhalitsyn)

- mds,cephfs\_mirror: add labelled per-client and replication metrics ([issue#63945](http://tracker.ceph.com/issues/63945), [pr#55640](https://github.com/ceph/ceph/pull/55640), Venky Shankar, Jos Collin)

- mds/client: check the cephx mds auth access in client side ([pr#54468](https://github.com/ceph/ceph/pull/54468), Xiubo Li, Ramana Raja)

- mds/MDBalancer: ignore queued callbacks if MDS is not active ([pr#54493](https://github.com/ceph/ceph/pull/54493), Leonid Usov)

- mds/MDSRank: Add set\_history\_slow\_op\_size\_and\_threshold for op\_tracker ([pr#53357](https://github.com/ceph/ceph/pull/53357), Yite Gu)

- mds: accept human readable values for quotas ([issue#55940](http://tracker.ceph.com/issues/55940), [pr#53333](https://github.com/ceph/ceph/pull/53333), Venky Shankar, Dhairya Parmar, dparmar18)

- mds: add a command to dump directory information ([pr#55987](https://github.com/ceph/ceph/pull/55987), Jos Collin, Zhansong Gao)

- mds: add balance\_automate fs setting ([pr#54952](https://github.com/ceph/ceph/pull/54952), Patrick Donnelly)

- mds: add debug logs during setxattr ceph<span></span>.dir<span></span>.subvolume ([pr#56062](https://github.com/ceph/ceph/pull/56062), Milind Changire)

- mds: allow all types of mds caps ([pr#52581](https://github.com/ceph/ceph/pull/52581), Rishabh Dave)

- mds: allow lock state to be LOCK\_MIX\_SYNC in replica for filelock ([pr#56049](https://github.com/ceph/ceph/pull/56049), Xiubo Li)

- mds: change priority of mds rss perf counter to useful ([pr#55057](https://github.com/ceph/ceph/pull/55057), sp98)

- mds: check file layout in mknod ([pr#56031](https://github.com/ceph/ceph/pull/56031), Xue Yantao)

- mds: check relevant caps for fs include root\_squash ([pr#57343](https://github.com/ceph/ceph/pull/57343), Patrick Donnelly)

- mds: disable `defer\_client\_eviction\_on\_laggy\_osds' by default ([issue#64685](http://tracker.ceph.com/issues/64685), [pr#56196](https://github.com/ceph/ceph/pull/56196), Venky Shankar)

- mds: do not evict clients if OSDs are laggy ([pr#52268](https://github.com/ceph/ceph/pull/52268), Dhairya Parmar, Laura Flores)

- mds: do not simplify fragset ([pr#54895](https://github.com/ceph/ceph/pull/54895), Milind Changire)

- mds: ensure next replay is queued on req drop ([pr#54313](https://github.com/ceph/ceph/pull/54313), Patrick Donnelly)

- mds: ensure snapclient is synced before corruption check ([pr#56398](https://github.com/ceph/ceph/pull/56398), Patrick Donnelly)

- mds: fix issuing redundant reintegrate/migrate\_stray requests ([pr#54467](https://github.com/ceph/ceph/pull/54467), Xiubo Li)

- mds: just wait the client flushes the snap and dirty buffer ([pr#55743](https://github.com/ceph/ceph/pull/55743), Xiubo Li)

- mds: optionally forbid to use standby for another fs as last resort ([pr#53340](https://github.com/ceph/ceph/pull/53340), Venky Shankar, Mykola Golub, Luís Henriques)

- mds: relax certain asserts in mdlog replay thread ([issue#57048](http://tracker.ceph.com/issues/57048), [pr#56016](https://github.com/ceph/ceph/pull/56016), Venky Shankar)

- mds: reverse MDSMap encoding of max\_xattr\_size/bal\_rank\_mask ([pr#55669](https://github.com/ceph/ceph/pull/55669), Patrick Donnelly)

- mds: revert standby-replay trimming changes ([pr#54716](https://github.com/ceph/ceph/pull/54716), Patrick Donnelly)

- mds: scrub repair does not clear earlier damage health status ([pr#54899](https://github.com/ceph/ceph/pull/54899), Neeraj Pratap Singh)

- mds: set the loner to true for LOCK\_EXCL\_XSYN ([pr#54911](https://github.com/ceph/ceph/pull/54911), Xiubo Li)

- mds: skip sr moves when target is an unlinked dir ([pr#56672](https://github.com/ceph/ceph/pull/56672), Patrick Donnelly, Dan van der Ster)

- mds: use explicitly sized types for network and disk encoding ([pr#55742](https://github.com/ceph/ceph/pull/55742), Xiubo Li)

- MDSAuthCaps: minor improvements ([pr#54185](https://github.com/ceph/ceph/pull/54185), Rishabh Dave)

- MDSAuthCaps: print better error message for perm flag in MDS caps ([pr#54945](https://github.com/ceph/ceph/pull/54945), Rishabh Dave)

- mgr/(object\_format && nfs/export): enhance nfs export update failure response ([pr#55395](https://github.com/ceph/ceph/pull/55395), Dhairya Parmar, John Mulligan)

- mgr/<span></span>.dashboard: batch backport of cephfs snapshot schedule management ([pr#55581](https://github.com/ceph/ceph/pull/55581), Ivo Almeida)

- mgr/cephadm is not defining haproxy tcp healthchecks for Ganesha ([pr#56101](https://github.com/ceph/ceph/pull/56101), avanthakkar)

- mgr/cephadm: allow grafana and prometheus to only bind to specific network ([pr#56302](https://github.com/ceph/ceph/pull/56302), Adam King)

- mgr/cephadm: Allow idmap overrides in nfs-ganesha configuration ([pr#56029](https://github.com/ceph/ceph/pull/56029), Teoman ONAY)

- mgr/cephadm: catch CancelledError in asyncio timeout handler ([pr#56103](https://github.com/ceph/ceph/pull/56103), Adam King)

- mgr/cephadm: discovery service (port 8765) fails on ipv6 only clusters ([pr#56093](https://github.com/ceph/ceph/pull/56093), Theofilos Mouratidis)

- mgr/cephadm: fix placement with label and host pattern ([pr#56107](https://github.com/ceph/ceph/pull/56107), Adam King)

- mgr/cephadm: fix reweighting of OSD when OSD removal is stopped ([pr#56094](https://github.com/ceph/ceph/pull/56094), Adam King)

- mgr/cephadm: fixups for asyncio based timeout ([pr#55555](https://github.com/ceph/ceph/pull/55555), Adam King)

- mgr/cephadm: make jaeger-collector a dep for jaeger-agent ([pr#56089](https://github.com/ceph/ceph/pull/56089), Adam King)

- mgr/cephadm: refresh public\_network for config checks before checking ([pr#56325](https://github.com/ceph/ceph/pull/56325), Adam King)

- mgr/cephadm: support for regex based host patterns ([pr#56221](https://github.com/ceph/ceph/pull/56221), Adam King)

- mgr/cephadm: support for removing host entry from crush map during host removal ([pr#56092](https://github.com/ceph/ceph/pull/56092), Adam King)

- mgr/cephadm: update timestamp on repeat daemon/service events ([pr#56090](https://github.com/ceph/ceph/pull/56090), Adam King)

- mgr/dashboard/frontend:Ceph dashboard supports multiple languages ([pr#56359](https://github.com/ceph/ceph/pull/56359), TomNewChao)

- mgr/dashboard: Add advanced fieldset component ([pr#56692](https://github.com/ceph/ceph/pull/56692), Afreen)

- mgr/dashboard: add frontend unit tests for rgw multisite sync status card ([pr#55222](https://github.com/ceph/ceph/pull/55222), Aashish Sharma)

- mgr/dashboard: add snap schedule M, Y frequencies ([pr#56059](https://github.com/ceph/ceph/pull/56059), Ivo Almeida)

- mgr/dashboard: add support for editing and deleting rgw roles ([pr#55541](https://github.com/ceph/ceph/pull/55541), Nizamudeen A)

- mgr/dashboard: add system users to rgw user form ([pr#56471](https://github.com/ceph/ceph/pull/56471), Pedro Gonzalez Gomez)

- mgr/dashboard: add Table Schema to grafonnet ([pr#56736](https://github.com/ceph/ceph/pull/56736), Aashish Sharma)

- mgr/dashboard: Allow the user to add the access/secret key on zone edit and not on zone creation ([pr#56472](https://github.com/ceph/ceph/pull/56472), Aashish Sharma)

- mgr/dashboard: ceph authenticate user from fs ([pr#56254](https://github.com/ceph/ceph/pull/56254), Pedro Gonzalez Gomez)

- mgr/dashboard: change deprecated grafana URL in daemon logs ([pr#55544](https://github.com/ceph/ceph/pull/55544), Nizamudeen A)

- mgr/dashboard: chartjs and ng2-charts version upgrade ([pr#55224](https://github.com/ceph/ceph/pull/55224), Pedro Gonzalez Gomez)

- mgr/dashboard: Consider null values as zero in grafana panels ([pr#54541](https://github.com/ceph/ceph/pull/54541), Aashish Sharma)

- mgr/dashboard: create cephfs snapshot clone ([pr#55489](https://github.com/ceph/ceph/pull/55489), Nizamudeen A)

- mgr/dashboard: Create realm sets to default ([pr#55221](https://github.com/ceph/ceph/pull/55221), Aashish Sharma)

- mgr/dashboard: Create subvol of same name in different group ([pr#55369](https://github.com/ceph/ceph/pull/55369), Afreen)

- mgr/dashboard: dashboard area chart unit test ([pr#55517](https://github.com/ceph/ceph/pull/55517), Pedro Gonzalez Gomez)

- mgr/dashboard: debugging make check failure ([pr#56127](https://github.com/ceph/ceph/pull/56127), Nizamudeen A)

- mgr/dashboard: disable applitools e2e ([pr#56215](https://github.com/ceph/ceph/pull/56215), Nizamudeen A)

- mgr/dashboard: fix cephfs name validation ([pr#56501](https://github.com/ceph/ceph/pull/56501), Nizamudeen A)

- mgr/dashboard: fix clone unique validator for name validation ([pr#56550](https://github.com/ceph/ceph/pull/56550), Nizamudeen A)

- mgr/dashboard: fix e2e failure related to landing page ([pr#55124](https://github.com/ceph/ceph/pull/55124), Pedro Gonzalez Gomez)

- mgr/dashboard: fix empty tags ([pr#56439](https://github.com/ceph/ceph/pull/56439), Pedro Gonzalez Gomez)

- mgr/dashboard: fix error while accessing roles tab when policy attached ([pr#55515](https://github.com/ceph/ceph/pull/55515), Afreen)

- mgr/dashboard: Fix inconsistency in capitalisation of "Multi-site" ([pr#55311](https://github.com/ceph/ceph/pull/55311), Afreen)

- mgr/dashboard: fix M retention frequency display ([pr#56363](https://github.com/ceph/ceph/pull/56363), Ivo Almeida)

- mgr/dashboard: fix retention add for subvolume ([pr#56370](https://github.com/ceph/ceph/pull/56370), Ivo Almeida)

- mgr/dashboard: fix rgw display name validation ([pr#56548](https://github.com/ceph/ceph/pull/56548), Nizamudeen A)

- mgr/dashboard: fix roles page for roles without policies ([pr#55827](https://github.com/ceph/ceph/pull/55827), Nizamudeen A)

- mgr/dashboard: fix snap schedule date format ([pr#55815](https://github.com/ceph/ceph/pull/55815), Ivo Almeida)

- mgr/dashboard: fix snap schedule list toggle cols ([pr#56115](https://github.com/ceph/ceph/pull/56115), Ivo Almeida)

- mgr/dashboard: fix snap schedule time format ([pr#56154](https://github.com/ceph/ceph/pull/56154), Ivo Almeida)

- mgr/dashboard: fix subvolume group edit ([pr#55811](https://github.com/ceph/ceph/pull/55811), Ivo Almeida)

- mgr/dashboard: fix subvolume group edit size ([pr#56385](https://github.com/ceph/ceph/pull/56385), Ivo Almeida)

- mgr/dashboard: fix the jsonschema issue in install-deps ([pr#55542](https://github.com/ceph/ceph/pull/55542), Nizamudeen A)

- mgr/dashboard: fix volume creation with multiple hosts ([pr#55786](https://github.com/ceph/ceph/pull/55786), Pedro Gonzalez Gomez)

- mgr/dashboard: fixed cephfs mount command ([pr#55993](https://github.com/ceph/ceph/pull/55993), Ivo Almeida)

- mgr/dashboard: fixed nfs attach command ([pr#56387](https://github.com/ceph/ceph/pull/56387), Ivo Almeida)

- mgr/dashboard: Fixes multisite topology page breadcrumb ([pr#55212](https://github.com/ceph/ceph/pull/55212), Afreen Misbah)

- mgr/dashboard: get object bucket policies for a bucket ([pr#55361](https://github.com/ceph/ceph/pull/55361), Nizamudeen A)

- mgr/dashboard: get rgw port from ssl\_endpoint ([pr#54764](https://github.com/ceph/ceph/pull/54764), Nizamudeen A)

- mgr/dashboard: Handle errors for /api/osd/settings ([pr#55704](https://github.com/ceph/ceph/pull/55704), Afreen)

- mgr/dashboard: increase the number of plottable graphs in charts ([pr#55571](https://github.com/ceph/ceph/pull/55571), Afreen, Aashish Sharma)

- mgr/dashboard: Locking improvements in bucket create form ([pr#56560](https://github.com/ceph/ceph/pull/56560), Afreen)

- mgr/dashboard: make ceph logo redirect to dashboard ([pr#56557](https://github.com/ceph/ceph/pull/56557), Afreen)

- mgr/dashboard: Mark placement targets as non-required ([pr#56621](https://github.com/ceph/ceph/pull/56621), Afreen)

- mgr/dashboard: replace deprecated table panel in grafana with a newer table panel ([pr#56682](https://github.com/ceph/ceph/pull/56682), Aashish Sharma)

- mgr/dashboard: replace piechart plugin charts with native pie chart panel ([pr#56654](https://github.com/ceph/ceph/pull/56654), Aashish Sharma)

- mgr/dashboard: rgw bucket features ([pr#55575](https://github.com/ceph/ceph/pull/55575), Pedro Gonzalez Gomez)

- mgr/dashboard: rm warning/error threshold for cpu usage ([pr#56443](https://github.com/ceph/ceph/pull/56443), Nizamudeen A)

- mgr/dashboard: s/active\_mds/active\_nfs in fs attach form ([pr#56546](https://github.com/ceph/ceph/pull/56546), Nizamudeen A)

- mgr/dashboard: sanitize dashboard user creation ([pr#56452](https://github.com/ceph/ceph/pull/56452), Pedro Gonzalez Gomez)

- mgr/dashboard: Show the OSDs Out and Down panels as red whenever an OSD is in Out or Down state in Ceph Cluster grafana dashboard ([pr#54538](https://github.com/ceph/ceph/pull/54538), Aashish Sharma)

- mgr/dashboard: Simplify authentication protocol ([pr#55689](https://github.com/ceph/ceph/pull/55689), Daniel Persson)

- mgr/dashboard: subvolume snapshot management ([pr#55186](https://github.com/ceph/ceph/pull/55186), Nizamudeen A)

- mgr/dashboard: update fedora link for dashboard-cephadm-e2e test ([pr#54718](https://github.com/ceph/ceph/pull/54718), Adam King)

- mgr/dashboard: upgrade from old 'graph' type panels to the new 'timeseries' panel ([pr#56652](https://github.com/ceph/ceph/pull/56652), Aashish Sharma)

- mgr/dashboard:Update encryption and tags in bucket form ([pr#56707](https://github.com/ceph/ceph/pull/56707), Afreen)

- mgr/dashboard:Use advanced fieldset for rbd image ([pr#56710](https://github.com/ceph/ceph/pull/56710), Afreen)

- mgr/nfs: include pseudo in JSON output when nfs export apply -i fails ([pr#55394](https://github.com/ceph/ceph/pull/55394), Dhairya Parmar)

- mgr/node-proxy: handle 'None' statuses returned by RedFish ([pr#55999](https://github.com/ceph/ceph/pull/55999), Guillaume Abrioux)

- mgr/pg\_autoscaler: add check for norecover flag ([pr#55078](https://github.com/ceph/ceph/pull/55078), Aishwarya Mathuria)

- mgr/snap\_schedule: add support for monthly snapshots ([pr#55208](https://github.com/ceph/ceph/pull/55208), Milind Changire)

- mgr/snap\_schedule: exceptions management and subvol support ([pr#52751](https://github.com/ceph/ceph/pull/52751), Milind Changire)

- mgr/volumes: fix `subvolume group rm` error message ([pr#54207](https://github.com/ceph/ceph/pull/54207), neeraj pratap singh, Neeraj Pratap Singh)

- mgr/volumes: support to reject CephFS clones if cloner threads are not available ([pr#55692](https://github.com/ceph/ceph/pull/55692), Rishabh Dave, Venky Shankar, Neeraj Pratap Singh)

- mgr: pin pytest to version 7<span></span>.4<span></span>.4 ([pr#55362](https://github.com/ceph/ceph/pull/55362), Laura Flores)

- mon, doc: overriding ec profile requires --yes-i-really-mean-it ([pr#56435](https://github.com/ceph/ceph/pull/56435), Radoslaw Zarzynski)

- mon, osd, \*: expose upmap-primary in OSDMap::get\_features() ([pr#57794](https://github.com/ceph/ceph/pull/57794), rzarzynski)

- mon/ConfigMonitor: Show localized name in "config dump --format json" output ([pr#53888](https://github.com/ceph/ceph/pull/53888), Sridhar Seshasayee)

- mon/ConnectionTracker<span></span>.cc: disregard connection scores from mon\_rank = -1 ([pr#55167](https://github.com/ceph/ceph/pull/55167), Kamoltat)

- mon/OSDMonitor: fix get\_min\_last\_epoch\_clean() ([pr#55867](https://github.com/ceph/ceph/pull/55867), Matan Breizman)

- mon: fix health store size growing infinitely ([pr#55548](https://github.com/ceph/ceph/pull/55548), Wei Wang)

- mon: fix mds metadata lost in one case ([pr#54316](https://github.com/ceph/ceph/pull/54316), shimin)

- msg: update MOSDOp() to use ceph\_tid\_t instead of long ([pr#55424](https://github.com/ceph/ceph/pull/55424), Lucian Petrut)

- node-proxy: fix RedFishClient<span></span>.logout() method ([pr#56252](https://github.com/ceph/ceph/pull/56252), Guillaume Abrioux)

- node-proxy: refactor entrypoint (backport) ([pr#55454](https://github.com/ceph/ceph/pull/55454), Guillaume Abrioux)

- orch: implement hardware monitoring ([pr#55405](https://github.com/ceph/ceph/pull/55405), Guillaume Abrioux, Adam King, Redouane Kachach)

- orchestrator: Add summary line to orch device ls output ([pr#56098](https://github.com/ceph/ceph/pull/56098), Paul Cuzner)

- orchestrator: Fix representation of CPU threads in host ls --detail command ([pr#56097](https://github.com/ceph/ceph/pull/56097), Paul Cuzner)

- os/bluestore: add bluestore fragmentation micros to prometheus ([pr#54258](https://github.com/ceph/ceph/pull/54258), Yite Gu)

- os/bluestore: fix free space update after bdev-expand in NCB mode ([pr#55777](https://github.com/ceph/ceph/pull/55777), Igor Fedotov)

- os/bluestore: get rid off resulting lba alignment in allocators ([pr#54772](https://github.com/ceph/ceph/pull/54772), Igor Fedotov)

- os/kv\_test: Fix estimate functions ([pr#56197](https://github.com/ceph/ceph/pull/56197), Adam Kupczyk)

- osd/OSD: introduce reset\_purged\_snaps\_last ([pr#53972](https://github.com/ceph/ceph/pull/53972), Matan Breizman)

- osd/scrub: increasing max\_osd\_scrubs to 3 ([pr#55173](https://github.com/ceph/ceph/pull/55173), Ronen Friedman)

- osd: Apply randomly selected scheduler type across all OSD shards ([pr#54981](https://github.com/ceph/ceph/pull/54981), Sridhar Seshasayee)

- osd: don't require RWEXCL lock for stat+write ops ([pr#54595](https://github.com/ceph/ceph/pull/54595), Alice Zhao)

- osd: fix Incremental decode for new/old\_pg\_upmap\_primary ([pr#55046](https://github.com/ceph/ceph/pull/55046), Laura Flores)

- osd: improve OSD robustness ([pr#54783](https://github.com/ceph/ceph/pull/54783), Igor Fedotov)

- osd: log the number of extents for sparse read ([pr#54606](https://github.com/ceph/ceph/pull/54606), Xiubo Li)

- osd: Tune snap trim item cost to reflect a PGs' average object size for mClock scheduler ([pr#55040](https://github.com/ceph/ceph/pull/55040), Sridhar Seshasayee)

- pybind/mgr/devicehealth: replace SMART data if exists for same DATETIME ([pr#54879](https://github.com/ceph/ceph/pull/54879), Patrick Donnelly)

- pybind/mgr/devicehealth: skip legacy objects that cannot be loaded ([pr#56479](https://github.com/ceph/ceph/pull/56479), Patrick Donnelly)

- pybind/mgr/mirroring: drop mon\_host from peer\_list ([pr#55237](https://github.com/ceph/ceph/pull/55237), Jos Collin)

- pybind/rbd: fix compilation with cython3 ([pr#54807](https://github.com/ceph/ceph/pull/54807), Mykola Golub)

- python-common/drive\_selection: fix limit with existing devices ([pr#56096](https://github.com/ceph/ceph/pull/56096), Adam King)

- python-common: fix osdspec\_affinity check ([pr#56095](https://github.com/ceph/ceph/pull/56095), Guillaume Abrioux)

- qa/cephadm: testing for extra daemon/container features ([pr#55957](https://github.com/ceph/ceph/pull/55957), Adam King)

- qa/cephfs: improvements for name generators in test\_volumes<span></span>.py ([pr#54729](https://github.com/ceph/ceph/pull/54729), Rishabh Dave)

- qa/distros: remove centos 8 from supported distros ([pr#57932](https://github.com/ceph/ceph/pull/57932), Guillaume Abrioux, Casey Bodley, Adam King, Laura Flores)

- qa/suites/fs/nfs: use standard health ignorelist ([pr#56392](https://github.com/ceph/ceph/pull/56392), Patrick Donnelly)

- qa/suites/fs/workload: enable snap\_schedule early ([pr#56424](https://github.com/ceph/ceph/pull/56424), Patrick Donnelly)

- qa/tasks/cephfs/test\_misc: switch duration to timeout ([pr#55746](https://github.com/ceph/ceph/pull/55746), Xiubo Li)

- qa/tests: added the initial reef-p2p suite ([pr#55714](https://github.com/ceph/ceph/pull/55714), Yuri Weinstein)

- qa/workunits/rbd/cli\_generic<span></span>.sh: narrow race window when checking that rbd\_support module command fails after blocklisting the module's client ([pr#54769](https://github.com/ceph/ceph/pull/54769), Ramana Raja)

- qa: `fs volume rename` requires `fs fail` and `refuse\_client\_session` set ([issue#64174](http://tracker.ceph.com/issues/64174), [pr#56171](https://github.com/ceph/ceph/pull/56171), Venky Shankar)

- qa: Add benign cluster warning from ec-inconsistent-hinfo test to ignorelist ([pr#56151](https://github.com/ceph/ceph/pull/56151), Sridhar Seshasayee)

- qa: add centos\_latest (9<span></span>.stream) and ubuntu\_20<span></span>.04 yamls to supported-all-distro ([pr#54677](https://github.com/ceph/ceph/pull/54677), Venky Shankar)

- qa: add diff-continuous and compare-mirror-image tests to rbd and krbd suites respectively ([pr#55928](https://github.com/ceph/ceph/pull/55928), Ramana Raja)

- qa: Add tests to validate synced images on rbd-mirror ([pr#55762](https://github.com/ceph/ceph/pull/55762), Ilya Dryomov, Ramana Raja)

- qa: bump up scrub status command timeout ([pr#55915](https://github.com/ceph/ceph/pull/55915), Milind Changire)

- qa: change log-whitelist to log-ignorelist ([pr#56396](https://github.com/ceph/ceph/pull/56396), Patrick Donnelly)

- qa: correct usage of DEBUGFS\_META\_DIR in dedent ([pr#56167](https://github.com/ceph/ceph/pull/56167), Venky Shankar)

- qa: do upgrades from quincy and older reef minor releases ([pr#55590](https://github.com/ceph/ceph/pull/55590), Patrick Donnelly)

- qa: enhance labeled perf counters test for cephfs-mirror ([pr#56211](https://github.com/ceph/ceph/pull/56211), Jos Collin)

- qa: Fix fs/full suite ([pr#55829](https://github.com/ceph/ceph/pull/55829), Kotresh HR)

- qa: fix incorrectly using the wait\_for\_health() helper ([issue#57985](http://tracker.ceph.com/issues/57985), [pr#54237](https://github.com/ceph/ceph/pull/54237), Venky Shankar)

- qa: fix rank\_asok() to handle errors from asok commands ([pr#55302](https://github.com/ceph/ceph/pull/55302), Neeraj Pratap Singh)

- qa: ignore container checkpoint/restore related selinux denials for centos9 ([issue#64616](http://tracker.ceph.com/issues/64616), [pr#56019](https://github.com/ceph/ceph/pull/56019), Venky Shankar)

- qa: remove error string checks and check w/ return value ([pr#55943](https://github.com/ceph/ceph/pull/55943), Venky Shankar)

- qa: remove vstart runner from radosgw\_admin task ([pr#55097](https://github.com/ceph/ceph/pull/55097), Ali Maredia)

- qa: run kernel\_untar\_build with newer tarball ([pr#54711](https://github.com/ceph/ceph/pull/54711), Milind Changire)

- qa: set mds config with `config set` for a particular test ([issue#57087](http://tracker.ceph.com/issues/57087), [pr#56169](https://github.com/ceph/ceph/pull/56169), Venky Shankar)

- qa: use correct imports to resolve fuse\_mount and kernel\_mount ([pr#54714](https://github.com/ceph/ceph/pull/54714), Milind Changire)

- qa: use exisitng ignorelist override list for fs:mirror[-ha] ([issue#62482](http://tracker.ceph.com/issues/62482), [pr#54766](https://github.com/ceph/ceph/pull/54766), Venky Shankar)

- radosgw-admin: 'zone set' won't overwrite existing default-placement ([pr#55061](https://github.com/ceph/ceph/pull/55061), Casey Bodley)

- rbd-nbd: fix resize of images mapped using netlink ([pr#55316](https://github.com/ceph/ceph/pull/55316), Ramana Raja)

- reef backport: rook e2e testing related PRs ([pr#55375](https://github.com/ceph/ceph/pull/55375), Redouane Kachach)

- RGW - Swift retarget needs bucket set on object ([pr#56004](https://github.com/ceph/ceph/pull/56004), Daniel Gryniewicz)

- rgw/auth: Fix the return code returned by AuthStrategy ([pr#54794](https://github.com/ceph/ceph/pull/54794), Pritha Srivastava)

- rgw/beast: Enable SSL session-id reuse speedup mechanism ([pr#56120](https://github.com/ceph/ceph/pull/56120), Mark Kogan)

- rgw/datalog: RGWDataChangesLog::add\_entry() uses null\_yield ([pr#55655](https://github.com/ceph/ceph/pull/55655), Casey Bodley)

- rgw/iam: admin/system users ignore iam policy parsing errors ([pr#54843](https://github.com/ceph/ceph/pull/54843), Casey Bodley)

- rgw/kafka/amqp: fix race conditionn in async completion handlers ([pr#54736](https://github.com/ceph/ceph/pull/54736), Yuval Lifshitz)

- rgw/lc: do not add datalog/bilog for some lc actions ([pr#55289](https://github.com/ceph/ceph/pull/55289), Juan Zhu)

- rgw/lua: fix CopyFrom crash ([pr#54296](https://github.com/ceph/ceph/pull/54296), Yuval Lifshitz)

- rgw/notification: Kafka persistent notifications not retried and removed even when the broker is down ([pr#56140](https://github.com/ceph/ceph/pull/56140), kchheda3)

- rgw/putobj: RadosWriter uses part head object for multipart parts ([pr#55621](https://github.com/ceph/ceph/pull/55621), Casey Bodley)

- rgw/rest: fix url decode of post params for iam/sts/sns ([pr#55356](https://github.com/ceph/ceph/pull/55356), Casey Bodley)

- rgw/S3select: remove assert from csv-parser, adding updates ([pr#55969](https://github.com/ceph/ceph/pull/55969), Gal Salomon)

- RGW/STS: when generating keys, take the trailing null character into account ([pr#54127](https://github.com/ceph/ceph/pull/54127), Oguzhan Ozmen)

- rgw: add headers to guide cache update in 304 response ([pr#55094](https://github.com/ceph/ceph/pull/55094), Casey Bodley, Ilsoo Byun)

- rgw: Add missing empty checks to the split string in is\_string\_in\_set() ([pr#56347](https://github.com/ceph/ceph/pull/56347), Matt Benjamin)

- rgw: d3n: fix valgrind reported leak related to libaio worker threads ([pr#54852](https://github.com/ceph/ceph/pull/54852), Mark Kogan)

- rgw: do not copy olh attributes in versioning suspended bucket ([pr#55606](https://github.com/ceph/ceph/pull/55606), Juan Zhu)

- rgw: fix cloud-sync multi-tenancy scenario ([pr#54328](https://github.com/ceph/ceph/pull/54328), Ionut Balutoiu)

- rgw: object lock avoids 32-bit truncation of RetainUntilDate ([pr#54674](https://github.com/ceph/ceph/pull/54674), Casey Bodley)

- rgw: only buckets with reshardable layouts need to be considered for resharding ([pr#54129](https://github.com/ceph/ceph/pull/54129), J. Eric Ivancich)

- RGW: pubsub publish commit with etag populated ([pr#56453](https://github.com/ceph/ceph/pull/56453), Ali Masarwa)

- rgw: RGWSI\_SysObj\_Cache::remove() invalidates after successful delete ([pr#55716](https://github.com/ceph/ceph/pull/55716), Casey Bodley)

- rgw: SignatureDoesNotMatch for certain RGW Admin Ops endpoints w/v4 auth ([pr#54791](https://github.com/ceph/ceph/pull/54791), David.Hall)

- Snapshot schedule show subvolume path ([pr#56419](https://github.com/ceph/ceph/pull/56419), Ivo Almeida)

- src/common/options: Correct typo in rgw<span></span>.yaml<span></span>.in ([pr#55445](https://github.com/ceph/ceph/pull/55445), Anthony D'Atri)

- src/mount: kernel mount command returning misleading error message ([pr#55300](https://github.com/ceph/ceph/pull/55300), Neeraj Pratap Singh)

- test/libcephfs: skip flaky timestamp assertion on Windows ([pr#54614](https://github.com/ceph/ceph/pull/54614), Lucian Petrut)

- test/rgw: increase timeouts in unittest\_rgw\_dmclock\_scheduler ([pr#55790](https://github.com/ceph/ceph/pull/55790), Casey Bodley)

- test: explicitly link to ceph-common for some libcephfs tests ([issue#57206](http://tracker.ceph.com/issues/57206), [pr#53635](https://github.com/ceph/ceph/pull/53635), Venky Shankar)

- tools/ceph\_objectstore\_tool: action\_on\_all\_objects\_in\_pg to skip pgmeta ([pr#54693](https://github.com/ceph/ceph/pull/54693), Matan Breizman)

- Tools/rados: Improve Error Messaging for Object Name Resolution ([pr#55112](https://github.com/ceph/ceph/pull/55112), Nitzan Mordechai)

- tools/rbd: make 'children' command support --image-id ([pr#55617](https://github.com/ceph/ceph/pull/55617), Mykola Golub)

- use raw\_cluster\_cmd instead of run\_ceph\_cmd ([pr#55836](https://github.com/ceph/ceph/pull/55836), Venky Shankar)

- win32\_deps\_build<span></span>.sh: change Boost URL ([pr#55084](https://github.com/ceph/ceph/pull/55084), Lucian Petrut)


