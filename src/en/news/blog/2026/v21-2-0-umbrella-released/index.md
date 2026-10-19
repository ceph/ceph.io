---
title: "v21.2.0 Umbrella released"
date: "2026-10-26"
author: "Yuri Weinstein"
tags:
  - "release"
  - "umbrella"
---
Umbrella is the 21st stable release of Ceph.

This is the first stable release of Ceph Umbrella.
We recommend all users update to this release.

> **Warning:** Umbrella container images are based on Rocky Linux 10 (el10), which requires a CPU supporting the `x86-64-v3` microarchitecture level. Deployments on hosts with older CPUs will not be able to run the containerized daemons.

> **Warning:** Python 3.9 or newer is required on all hosts for `cephadm` support.

Release Date
------------

October 26, 2026

## Notable Changes
---------------

RADOS / OSD / Erasure Coding
-----------------------------

- Optimized ("Fast") Erasure Coding: a substantial new EC I/O path.

  - EC Direct Reads
  - CLS support for EC reads
  - EC OMAP support
  - Add Fast EC CRC-checking for data and first parity
  - Numerous correctness fixes to the new path (truncate+write planning,
    PDW vs RMW selection, snapshot scrub handling, peering/recovery
    corner cases)

  Ships with health warnings for deprecated EC plugins/techniques and for
  Blaum-Roth EC profiles whose `w+1` isn't prime; non-4k-aligned chunk
  sizes are now rejected for optimized EC.
- **Security**: CephX authentication hardening -- new `AES256KRB5` cipher
  (replacing weaker legacy key types as the default), online key rotation
  for mon/OSD/MDS daemons during upgrades, and fixes for CVE-2025-30156
  (AES-CBC misuse enabling authentication bypass), CVE-2026-39944,
  CVE-2026-50152, and CVE-2026-54330
  ([pr#71172](https://github.com/ceph/ceph/pull/71172)).
- Monitor: new optional RocksDB backup/restore mechanism
  (`mon_backup_interval`, `ceph tell mon.* backup`, offline restore
  via `ceph-mon --restore-backup`).
- New availability score feature for Monitor/OSD (tracking + health warnings
  + config toggle), off by default.
- Stretch clusters: tiebreaker mon can now be optional, added a max
  bucket-weight-diff threshold, a health warning for colocated monitors,
  and a restriction on changing the election strategy after stretch mode
  is enabled.
- `mgr/DaemonServer`: `ok-to-upgrade` now aggregates and globally
  sorts OSDs across CRUSH child buckets (fixing inaccurate
  per-chassis/rack ordering), and upgrades can now be scoped to a CRUSH
  bucket.
- `pg-upmap-primary` support and improved pg-upmap computing speed.
- PG autoscaler: default `mon_target_pg_per_osd` increased 100 -> 200 and
  `mon_max_pg_per_osd` increased 250 -> 500, letting the autoscaler compute
  more parallelism-friendly `pg_num` values and improving the balancer's
  ability to reach uniform OSD utilization. Existing pools may autoscale to
  more PGs after upgrading as a result; `pg_autoscale_during_upgrade`
  ([pr#67694](https://github.com/ceph/ceph/pull/67694)) paces that
  splitting so it doesn't disrupt the upgrade itself. Clusters with a
  smaller-than-4GiB effective `bluestore_osd_memory_target`, or SSDs
  split into more than two OSDs, may want to pin the old values before
  upgrading ([pr#69452](https://github.com/ceph/ceph/pull/69452)).
- BlueStore: BlueFS Spillover Cleaner evolution, faster allocation
  recovery, static/runtime object-fragmentation tracking, full-device
  discard on mkfs now default, several spanning-blob/onode-cache-stall/
  reallocation-corruption fixes, and device-type-specific allocation
  policy.
- mClock scheduler refactor. Default HDD OSD shard config changed as an
  interim fix for inconsistent client/recovery throughput with multiple
  shards: `osd_op_num_shards_hdd` 5 -> 1, `osd_op_num_threads_per_shard_hdd`
  1 -> 5 ([issue#66289](https://tracker.ceph.com/issues/66289)).
- Crimson/Seastore: continued heavy investment -- erasure coding support
  landed in Crimson (including recovery), PG splitting, a new 2Q cache
  replacement algorithm, broad coroutine conversions, and a long tail of
  correctness/perf fixes across the object-data, LBA/omap-btree, and
  cleaner subsystems.

RGW (RADOS Gateway)
--------------------

- Full object dedup -- tech preview.
- Bucket logging -- new feature: journal-mode logging, EC-pool support,
  admin commands, and new per-bucket lifecycle/logging performance
  monitoring that closes a long-standing observability gap around
  lifecycle processing.
- Cloud transition / cloud restore: restore from Glacier/tape, admin CLI
  for restore list/status, restore-event notifications, persistent
  restore state, per-bucket target options; lifecycle, cloud-restore, and
  cloud-transition processing converted to coroutines for a significant
  performance improvement.
- Encryption: added AES-256-GCM SSE support; CopyObject now supported for
  encrypted objects.
- IAM/Account: `GetAccountSummary`, account-wide `PublicAccessBlock`,
  Admin REST APIs for account quota, S3 Object Ownership (disable ACLs),
  legacy Keystone admin-token requirement removed, Keystone roles
  injected into IAM policy.
- STS/OIDC: `GetCallerIdentity`, JWT/JWKS signature validation, OIDC
  multisite support.
- SigV4: fixed a regression (present in 19.2.6/20.2.4) that rejected
  requests with an unsigned `Content-Type`, breaking presigned PUT
  uploads; `x-amz-content-sha256` is no longer required in
  `SignedHeaders` for S3 requests
  ([pr#71363](https://github.com/ceph/ceph/pull/71363)).
- Multisite: numerous sync-correctness fixes (full-sync infinite loop,
  segfault during startup, forwarded awsv4/UNSIGNED-PAYLOAD requests,
  bucket-sync full-sync locking, zonegroup rename handling).
- D4N (Redis-backed) cache: continued build-out (bucket check_empty,
  connection pooling/pipelining, dirty-entry handling, crash fixes).
- s3-tests vendored directly into the repo (`src/test/rgw/s3-tests`);
  QA suites run them from there instead of an external branch reference.
- Timestamp-based epochs for versioned objects; global CORS rule
  support; rate-limit response with `Retry-After`; standalone RGW
  build (without RadosStore) via a new config-store abstraction -- a
  significant architectural refactor of `rgw_zone`/realm-watching
  code.
- Lua scripting: new postAuth hook, fresh VM per background script
  execution, package-management fixes.

Dashboard
---------

- Large-scale UI migration to the IBM Carbon design system across most
  pages (RGW, pools, OSD flags, multisite, zone/zonegroup, services,
  upgrade page, and more).
- NVMe/TCP (NVMeoF) management significantly expanded: multi-step
  subsystem/gateway/namespace creation wizards, TLS/mTLS, DHCHAP auth,
  KMIP support, consistency-group CRUD APIs, and many CLI/UI alignment
  fixes.
- SMB cluster management support added.
- RGW role management realigned with Carbon + API routing fixes; global
  RGW tenant "Roles" tab removed in favor of per-account roles.
- CephFS mirroring wizard/entity management UI.
- OAuth2 SSO support (config UI + backend prerequisites).
- Angular upgraded to v19.

cephadm / Orchestrator
-----------------------

- **Extended certificate management:** cephadm now provides comprehensive
  `certmgr` integration across managed services including mgmt-gateway,
  monitoring stack, NFS, and RGW. Services support auto-generated and
  renewed cephadm-signed certificates, user-provided certificates, and
  certificate-store references. TLS PEM handling is now standardized with
  support for full certificate chains and automatic separation of
  certificates and private keys, simplifying certificate management across
  services.
- SMB/Samba cluster support (the managed service type itself shipped in
  Tentacle): new remote-control client tool, per-share QoS/bandwidth rate
  limiting, custom ports, keybridge/FSCrypt-based share configuration,
  and support for CephFS shares served from an external Ceph cluster.
- NVMe-oF gateway spec gained many fields (TLS, KMIP, Prometheus
  frequency, namespace limits, group assignment).
- NFS-Ganesha: QoS support, active-active/keepalived-only ingress mode,
  TLS configuration support, RDMA handling during upgrades.
- Crimson/seastore OSD deployment support added to cephadm and
  ceph-volume.

CephFS / MDS
------------

- FSCrypt (client-side encryption) userspace implementation.
- Multi-threaded cephfs-mirror, plus a blockdiff-based sync mechanism
  for regular-file transfers.
- cephfs-mirror: new mirroring checkpoints (CLI + cluster-wide status
  tracking), mutable CephFS snapshot metadata (new `libcephfs`/pybind
  API), and substantially expanded per-directory/per-peer sync metrics.
- New pybind/cephfs bindings: `utimensat`, `chownat`, `symlinkat`,
  `readlinkat`, `statxat`, `mkdirat`; non-recursive
  `rmtree()`/`cptree()`.
- Subvolume group name-mangling support; new subvolume performance/
  utilization metrics; clone-source info retained in `subvolume info`.
- Root-directory fragmentation disallowed; session-reclaim blocklisting
  fix; several shutdown-hang and scrub-pinning fixes.

ceph-volume
-----------

- Migrated internal config/sysinfo representation to dataclasses;
  device detection switched to udev data instead of shelling out to
  LVM/udevadm in several code paths (perf and reliability win).
- Added seastore OSD support; fixed inventory failures on hosts with
  RAID-mirrored system volumes, cdrom devices, and missing
  `/dev/vg/lv` paths.

Build / Packaging / QA Infrastructure
---------------------------------------

- Ubuntu 24.04 (Noble) and Rocky Linux 10 added as supported distros
  across build and QA; CMake bumped to require 3.22.1 and gained
  CMake-4 support; C++ standard raised to C++23.
- The Ceph container's base OS image has changed to `rockylinux:10`.

## Changelog

- (DRAFT) rgw/d4n: Add cache\_request for cache API ([pr#65314](https://github.com/ceph/ceph/pull/65314), Samarah Uriarte)

- <span></span>.github/milestone: add umbrella ([pr#69407](https://github.com/ceph/ceph/pull/69407), Patrick Donnelly)

- 21<span></span>.1<span></span>.1 ([pr#71756](https://github.com/ceph/ceph/pull/71756), Ceph Release Team)

- 21<span></span>.1<span></span>.2 ([pr#72542](https://github.com/ceph/ceph/pull/72542), Ceph Release Team)

- [DNM] ProtocolV2: make handle\_existing\_connection check for cookie mismatch first ([pr#63413](https://github.com/ceph/ceph/pull/63413), Kamoltat Sirivadhna)

- [Docs]: Corrected spelling mistake ([pr#64088](https://github.com/ceph/ceph/pull/64088), Instelligence.io)

- [mgr/dashboard]: Mismatch in the object size observed in Advance section in Tiering ([pr#65170](https://github.com/ceph/ceph/pull/65170), Dnyaneshwari Talwekar)

- [Packaging]: Use system-defined location for home directories ([pr#62507](https://github.com/ceph/ceph/pull/62507), Shawn Edwards)

- [run-make] Added flag for Dashboard and WError ([pr#66181](https://github.com/ceph/ceph/pull/66181), Anshuman)

- mgr/vol: handling the failed non-atomic operation ([pr#59676](https://github.com/ceph/ceph/pull/59676), Neeraj Pratap Singh)

- mds/MDSDaemon: unlock `mds\_lock` while shutting down Beacon and others ([pr#60326](https://github.com/ceph/ceph/pull/60326), Max Kellermann)

- libcephfs: New feature - add ceph\_setlk and ceph\_getlk functions ([pr#61116](https://github.com/ceph/ceph/pull/61116), Giorgos Kappes)

- mds: for an irreparable hard link scrub is not able to identify the damage ([pr#61173](https://github.com/ceph/ceph/pull/61173), Md Mahamudur Rahaman Sajib)

- mds: add a proper check to evict clients with id 0 ([pr#61981](https://github.com/ceph/ceph/pull/61981), neeraj pratap singh, Neeraj Pratap Singh)

- mds: add ref counting to LogSegment ([pr#62554](https://github.com/ceph/ceph/pull/62554), Milind Changire)

- mds: Don't use global snaprealm's seq number for subvolume snapshots ([pr#62682](https://github.com/ceph/ceph/pull/62682), Kotresh HR)

- test/libcephfs: validate asynchronous write and fsync executing concurrently ([issue#71515](http://tracker.ceph.com/issues/71515), [pr#63636](https://github.com/ceph/ceph/pull/63636), Venky Shankar)

- qa: Fix test\_with\_health\_warn\_with\_2\_active\_MDSs ([pr#64297](https://github.com/ceph/ceph/pull/64297), Kotresh HR)

- mds: include auth credential in session dump ([pr#64308](https://github.com/ceph/ceph/pull/64308), Patrick Donnelly)

- client,mds,mgr: add subvolume level perf counters ([pr#64434](https://github.com/ceph/ceph/pull/64434), Igor Golikov, Venky Shankar)

- qa/suites/upgrade: add "Replacing daemon mds" to ignorelist ([issue#50279](http://tracker.ceph.com/issues/50279), [pr#64523](https://github.com/ceph/ceph/pull/64523), Venky Shankar)

- client: crash caused by invalid iterator in \_readdir\_cache\_cb ([pr#64627](https://github.com/ceph/ceph/pull/64627), Zhansong Gao)

- mds: Fix readdir when osd is full<span></span>. ([pr#64663](https://github.com/ceph/ceph/pull/64663), Kotresh HR)

- mds: fix ineffective 'false' parameter due to virtual inheritance ([pr#64702](https://github.com/ceph/ceph/pull/64702), izxl007)

- Optimize the libcephfs proxy to reduce the overhead ([pr#64716](https://github.com/ceph/ceph/pull/64716), Xavi Hernandez)

- libcephfs\_proxy: implement support for fscrypt ([pr#64743](https://github.com/ceph/ceph/pull/64743), Xavi Hernandez)

- mds: skip charmap handler check for MDS requests ([pr#64822](https://github.com/ceph/ceph/pull/64822), Patrick Donnelly)

- mds/MDSDaemon: Init lockup command millisecond timeout ([pr#64958](https://github.com/ceph/ceph/pull/64958), Edwin Rodriguez)

- mds/MDSMap: Enhance set\_min\_compat\_client to validate iterator range ([pr#64967](https://github.com/ceph/ceph/pull/64967), Edwin Rodriguez)

- src/mds: Improve messages in MDCache<span></span>.cc ([pr#65232](https://github.com/ceph/ceph/pull/65232), Anthony D'Atri)

- libcephfs\_proxy: fix backward compatibility issue ([pr#65320](https://github.com/ceph/ceph/pull/65320), Xavi Hernandez)

- mds: uninline methods to reduce header dependencies and compile times ([pr#65392](https://github.com/ceph/ceph/pull/65392), Max Kellermann)

- mgr/volumes: fix bugs related missing UUID dir from a subvol ([pr#65467](https://github.com/ceph/ceph/pull/65467), Rishabh Dave)

- mds: fix rank 0 marked damaged if stopping fails after Elid flush<span></span>. ([pr#65483](https://github.com/ceph/ceph/pull/65483), ethanwu)

- tools/cephfs: provide an estimate completion time for offline tools ([pr#65495](https://github.com/ceph/ceph/pull/65495), Edwin Rodriguez)

- libcephfs\_proxy: add support for nonblocking fsync request ([pr#65538](https://github.com/ceph/ceph/pull/65538), Xavi Hernandez)

- cephfs-journal-tool: Journal trimming issue ([pr#65577](https://github.com/ceph/ceph/pull/65577), Kotresh HR)

- client: adjust `Fb` cap ref count check during synchronous fsync() ([pr#65713](https://github.com/ceph/ceph/pull/65713), Venky Shankar)

- mds: operator=() should return 'CDentry&' ([pr#65876](https://github.com/ceph/ceph/pull/65876), Edwin Rodriguez)

- mds: Simplify logging messages in quiesce\_cluster\_update ([pr#65882](https://github.com/ceph/ceph/pull/65882), Edwin Rodriguez)

- mds: Remove unnecessary std::move in MetricsHandler ([pr#65884](https://github.com/ceph/ceph/pull/65884), Edwin Rodriguez)

- mds: use after move ack error in QuiesceAgent::agent\_thread\_main ([pr#65886](https://github.com/ceph/ceph/pull/65886), Edwin Rodriguez)

- client: fix dump\_mds\_requests to valid json format ([issue#73639](http://tracker.ceph.com/issues/73639), [pr#66025](https://github.com/ceph/ceph/pull/66025), haoyixing)

- test/libcephfs: Fixed path buffer overflow ([pr#66030](https://github.com/ceph/ceph/pull/66030), Edwin Rodriguez)

- client: signal waitfor\_commit waiters for write delegation enabled inode ([issue#73624](http://tracker.ceph.com/issues/73624), [pr#66036](https://github.com/ceph/ceph/pull/66036), Venky Shankar)

- mgr/volumes: remove unnecessary log error lines from earmark handling ([pr#66093](https://github.com/ceph/ceph/pull/66093), Avan Thakkar)

- libcephfs\_proxy: implement batched readdir ([pr#66183](https://github.com/ceph/ceph/pull/66183), Xavi Hernandez)

- qa/cephfs: add ceph-osd-{classic,crimson} to exclude list of LTS releases ([issue#74026](http://tracker.ceph.com/issues/74026), [pr#66475](https://github.com/ceph/ceph/pull/66475), Venky Shankar)

- libcephfs\_proxy: Improvements to proxy configuration ([pr#66907](https://github.com/ceph/ceph/pull/66907), Xavi Hernandez)

- pybind/cephfs: invoke fcopyfile() libcephfs API without holding GIL ([issue#74397](http://tracker.ceph.com/issues/74397), [pr#66927](https://github.com/ceph/ceph/pull/66927), Venky Shankar)

- qa: fix TypeError in delay ([pr#67476](https://github.com/ceph/ceph/pull/67476), Jos Collin)

- Add <span></span>.clang-format configuration file ([pr#65049](https://github.com/ceph/ceph/pull/65049), Edwin Rodriguez)

- Add /health/snapshot api ([pr#65019](https://github.com/ceph/ceph/pull/65019), Afreen Misbah)

- Add Abhishek Desai into githubmap, organizationmap, mailmap ([pr#66083](https://github.com/ceph/ceph/pull/66083), Abhishek Desai)

- Add cephadm-signed certificate support for all services ([pr#62106](https://github.com/ceph/ceph/pull/62106), Redouane Kachach)

- add cephx update ([pr#71172](https://github.com/ceph/ceph/pull/71172), Patrick Donnelly, Adam King, David Galloway, Sage McTaggart, Marcus Watts, Pritha Srivastava, Yehuda Sadeh, Matan Breizman)

- Add Devika Babrekar into githubmap, organizationmap, mailmap ([pr#66253](https://github.com/ceph/ceph/pull/66253), Devika Babrekar)

- Add documentation for ceph\_test\_rados ([pr#68437](https://github.com/ceph/ceph/pull/68437), Alex Ainscow)

- Add health warning for deprecated EC plugins and techniques ([pr#69026](https://github.com/ceph/ceph/pull/69026), Jamie Pryde)

- Add missing includes to many subsystems ([pr#64977](https://github.com/ceph/ceph/pull/64977), Max Kellermann)

- Add normalization and casesensitive options to the subvolume group creation command ([pr#64324](https://github.com/ceph/ceph/pull/64324), Venky Shankar, Xavi Hernandez)

- Add NVMe preformat support to skip redundant mkfs discard ([pr#66646](https://github.com/ceph/ceph/pull/66646), Ujjawal Anand)

- Add PRE\_BUILD to breakpad command (fix for CMake > 3<span></span>.30) ([pr#63643](https://github.com/ceph/ceph/pull/63643), Jesse F. Williamson)

- add Sagar Gopale to githubmap mailmap organizationmap ([pr#66436](https://github.com/ceph/ceph/pull/66436), Sagar Gopale)

- Add Support for Catch2 unit tests ([pr#62873](https://github.com/ceph/ceph/pull/62873), Jesse F. Williamson)

- added code to fix failure on Haproxy error for rgw service with ipv6 ([pr#67493](https://github.com/ceph/ceph/pull/67493), Kobi Ginon)

- aio\_cxx: Fix mutual deadlock and resolve test unreliability ([pr#66430](https://github.com/ceph/ceph/pull/66430), Nitzan Mordechai)

- Assorted build-with-container improvements ([pr#63887](https://github.com/ceph/ceph/pull/63887), John Mulligan)

- auth/cephx: harden service ticket verification ([pr#72126](https://github.com/ceph/ceph/pull/72126), Dan van der Ster, Matthew Heler)

- auth: add missing includes ([pr#62844](https://github.com/ceph/ceph/pull/62844), Max Kellermann)

- auth: msgr2 can return incorrect allowed\_modes through AuthBadMethodFrame ([pr#64717](https://github.com/ceph/ceph/pull/64717), Miki Patel)

- auth: reduce header dependencies ([pr#65541](https://github.com/ceph/ceph/pull/65541), Max Kellermann)

- auth: remove unused AuthTicket::renew\_after member variable ([pr#64591](https://github.com/ceph/ceph/pull/64591), Kefu Chai)

- Avoid calling zonegroup modify if realm/zonegroup/zone are not present ([pr#67598](https://github.com/ceph/ceph/pull/67598), Kushal Deb)

- backport nvmeof CNC and CLI teuthology tests ([pr#72398](https://github.com/ceph/ceph/pull/72398), barakda, Vallari Agrawal)

- Beacon diff ([pr#65563](https://github.com/ceph/ceph/pull/65563), Leonid Chernin, Samuel Just)

- blk,os/bluestore: do not call extblkdev::detect\_device on every ([pr#68177](https://github.com/ceph/ceph/pull/68177), Igor Fedotov)

- blk/kernel : skip AIO thread for devices with size < block\_size ([pr#70380](https://github.com/ceph/ceph/pull/70380), Jaya Prakash)

- blk/kernel: bring "bdev\_async\_discard" config parameter back ([pr#65608](https://github.com/ceph/ceph/pull/65608), Igor Fedotov)

- blk/kernel: improve DiscardThread life cycle ([pr#64351](https://github.com/ceph/ceph/pull/64351), Igor Fedotov)

- blk:Warning added for discard queue overflow ([pr#61286](https://github.com/ceph/ceph/pull/61286), Jaya Prakash)

- BlueFS: \_flush\_and\_sync\_log\_jump\_D should validate that jump\_to >= log<span></span>.writer->pos ([pr#68043](https://github.com/ceph/ceph/pull/68043), dheart)

- bluestore, extblkdev: Now plugins can raise health warnings ([pr#68416](https://github.com/ceph/ceph/pull/68416), Adam Kupczyk)

- bluestore/bluefs: FileWriter simpler flush ([pr#66439](https://github.com/ceph/ceph/pull/66439), Igor Fedotov, Adam Kupczyk)

- bluestore/BlueFS: fix bytes\_written\_slow counter with aio\_write ([pr#66147](https://github.com/ceph/ceph/pull/66147), chungfengz)

- bluestore: Faster allocation recovery - evolution ([pr#64369](https://github.com/ceph/ceph/pull/64369), Adam Kupczyk)

- bluestore: Fix \_setattr() with rare memory alignments ([pr#63839](https://github.com/ceph/ceph/pull/63839), Adam Kupczyk, Alex Ainscow)

- bluestore: Fix BlueFS WAL envelope mode rendering write buffer misalignment ([pr#66438](https://github.com/ceph/ceph/pull/66438), Adam Kupczyk, Igor Fedotov)

- bluestore: Fix unsharing blobs on remove ([pr#70468](https://github.com/ceph/ceph/pull/70468), Adam Kupczyk)

- Breakpad Crash Handler ([pr#61264](https://github.com/ceph/ceph/pull/61264), Marcel Lauhoff)

- btree: Safeguard delete\_leaf\_node to prevent dereferencing null nodes ([pr#64961](https://github.com/ceph/ceph/pull/64961), Edwin Rodriguez)

- build(deps): bump vite from 5<span></span>.4<span></span>.19 to 5<span></span>.4<span></span>.20 in /src/pybind/mgr/dashboard/frontend ([pr#65571](https://github.com/ceph/ceph/pull/65571), dependabot[bot])

- build-with-container:  improve source rpm detection ([pr#65156](https://github.com/ceph/ceph/pull/65156), John Mulligan)

- build-with-container: add argument groups to organize options ([pr#65514](https://github.com/ceph/ceph/pull/65514), John Mulligan)

- build-with-container: build image variants ([pr#65919](https://github.com/ceph/ceph/pull/65919), John Mulligan)

- build-with-container: ensure npm dir is set up before configure ([pr#65376](https://github.com/ceph/ceph/pull/65376), John Mulligan)

- build-with-container: naming cleanup ([pr#65835](https://github.com/ceph/ceph/pull/65835), John Mulligan)

- build: Fix opentelemetry-cpp build failure on Noble ([pr#62616](https://github.com/ceph/ceph/pull/62616), Adam C. Emerson)

- build: Modify rocksdb submodule ([pr#63190](https://github.com/ceph/ceph/pull/63190), Adam C. Emerson)

- build: Rocky 9 support ([pr#64657](https://github.com/ceph/ceph/pull/64657), David Galloway)

- build: Update python packaging for src/python-common ([pr#68401](https://github.com/ceph/ceph/pull/68401), John Mulligan)

- Bump NFS Version in Ceph ([pr#67906](https://github.com/ceph/ceph/pull/67906), Shweta Bhosale)

- Carbonize upgrade page ([pr#68971](https://github.com/ceph/ceph/pull/68971), Afreen Misbah)

- ceph-backport<span></span>.sh: clean function argument use and update GitHub help link ([pr#67059](https://github.com/ceph/ceph/pull/67059), Ville Ojamo)

- ceph-backport<span></span>.sh: update known milestones ([pr#63570](https://github.com/ceph/ceph/pull/63570), Jos Collin)

- ceph-crash: reduce log noise from auth fallback in post\_crash() ([pr#68283](https://github.com/ceph/ceph/pull/68283), Kefu Chai)

- ceph-exporter: fix systemd unit ([pr#64561](https://github.com/ceph/ceph/pull/64561), Henry Hirsch)

- ceph-mixin: Update monitoring mixin ([pr#64755](https://github.com/ceph/ceph/pull/64755), Aashish Sharma, SuperQ, Ankush Behl)

- ceph-mon: Improve efficiency of upmap cleanup in osdmaps for large clusters ([pr#66204](https://github.com/ceph/ceph/pull/66204), Andras Pataki)

- ceph-object-corpus: pick up 20<span></span>.2<span></span>.0-380-gdbcbbd3f281 ([pr#66591](https://github.com/ceph/ceph/pull/66591), Nitzan Mordechai)

- ceph-object-corpus: update submodule ([pr#64007](https://github.com/ceph/ceph/pull/64007), Kefu Chai)

- ceph-objectstore-tool: update `clear-snapset` command doc ([pr#65099](https://github.com/ceph/ceph/pull/65099), Naveen Naidu)

- ceph-volume: add --osd-fsid support to raw mode prepare ([pr#68338](https://github.com/ceph/ceph/pull/68338), Guillaume Abrioux, Duanming Zhou)

- ceph-volume: add seastore OSDs support ([pr#64323](https://github.com/ceph/ceph/pull/64323), Guillaume Abrioux)

- ceph-volume: avoid Device() instantiation in lvm OSD filtering ([pr#67047](https://github.com/ceph/ceph/pull/67047), Guillaume Abrioux)

- ceph-volume: avoid RuntimeError on ceph-volume raw list with non-existent loop devices ([pr#64833](https://github.com/ceph/ceph/pull/64833), Parfait Detchenou)

- ceph-volume: detect rotational media under dm-crypt for workqueue bypass ([pr#69105](https://github.com/ceph/ceph/pull/69105), Guillaume Abrioux)

- ceph-volume: drop udevadm subprocess calls ([pr#65029](https://github.com/ceph/ceph/pull/65029), Guillaume Abrioux)

- ceph-volume: fallback to default for empty get\_file\_contents values ([pr#68765](https://github.com/ceph/ceph/pull/68765), Guillaume Abrioux)

- ceph-volume: fix argparse dmcrypt opts: use str type ([pr#68769](https://github.com/ceph/ceph/pull/68769), Guillaume Abrioux)

- ceph-volume: fix build on RHEL 10/python 3<span></span>.12 ([pr#66929](https://github.com/ceph/ceph/pull/66929), Mark Kogan)

- ceph-volume: fix inventory without /dev/vg/lv (slashed paths) ([pr#67891](https://github.com/ceph/ceph/pull/67891), Guillaume Abrioux)

- ceph-volume: fix nvme preformat wiping VG on osds-per-device > 1 ([pr#70650](https://github.com/ceph/ceph/pull/70650), Guillaume Abrioux)

- ceph-volume: fix re-deployment of OSD issues with disk selection filters and DB Devices ([pr#68858](https://github.com/ceph/ceph/pull/68858), Raimund Sacherer)

- ceph-volume: Fix splitting with too many parts ([pr#63004](https://github.com/ceph/ceph/pull/63004), Janne Heß)

- ceph-volume: fix UdevData initialisation from empty /run/udev/data/\* file ([pr#65554](https://github.com/ceph/ceph/pull/65554), Matteo Paramatti)

- ceph-volume: fix vendor detection for nvme devices ([pr#67996](https://github.com/ceph/ceph/pull/67996), Guillaume Abrioux)

- ceph-volume: has\_bluestore\_label checks all bluestore label replica o… ([pr#68414](https://github.com/ceph/ceph/pull/68414), Guillaume Abrioux)

- ceph-volume: include LVM mapper devices in get\_devices() ([pr#67231](https://github.com/ceph/ceph/pull/67231), Guillaume Abrioux)

- ceph-volume: lvm<span></span>.Lvm<span></span>.setup\_metadata\_devices refactor ([pr#65851](https://github.com/ceph/ceph/pull/65851), Guillaume Abrioux)

- ceph-volume: make TPM2 PCR policy configurable (default to PCR 7) ([pr#68670](https://github.com/ceph/ceph/pull/68670), Guillaume Abrioux)

- ceph-volume: migrate namedtuple based config and sysInfo to dataclasses ([pr#66219](https://github.com/ceph/ceph/pull/66219), Guillaume Abrioux)

- ceph-volume: OSD mapper lifecycle (LVM + raw) for activate ([pr#68894](https://github.com/ceph/ceph/pull/68894), Guillaume Abrioux)

- ceph-volume: pass --set-keepcaps for FCM crush device class on mkfs ([pr#68595](https://github.com/ceph/ceph/pull/68595), Guillaume Abrioux)

- ceph-volume: pass osd\_type value to ceph-volume ([pr#67264](https://github.com/ceph/ceph/pull/67264), Guillaume Abrioux)

- ceph-volume: raw activate should ignore lvm backed OSD devices ([pr#68657](https://github.com/ceph/ceph/pull/68657), Guillaume Abrioux)

- ceph-volume: refactor LvmBlueStore<span></span>.setup\_device() ([pr#62648](https://github.com/ceph/ceph/pull/62648), Guillaume Abrioux)

- ceph-volume: retry lvs after empty result and "devices file is missing" stderr ([pr#69143](https://github.com/ceph/ceph/pull/69143), Guillaume Abrioux)

- ceph-volume: single lvs call to speed up exclude\_lvm\_osd\_devices ([pr#67240](https://github.com/ceph/ceph/pull/67240), Guillaume Abrioux)

- ceph-volume: skip /dev/ram\* devices in inventory ([pr#68467](https://github.com/ceph/ceph/pull/68467), Ujjawal Anand)

- ceph-volume: skip cdrom devices in inverntory ([pr#67624](https://github.com/ceph/ceph/pull/67624), Ujjawal Anand)

- ceph-volume: skip internal raid mirror LVs in inventory ([pr#69700](https://github.com/ceph/ceph/pull/69700), Guillaume Abrioux)

- ceph-volume: skip mkfs discard for LVM NVMe OSDs ([pr#68220](https://github.com/ceph/ceph/pull/68220), Ujjawal Anand)

- ceph-volume: support additional dmcrypt params ([pr#65321](https://github.com/ceph/ceph/pull/65321), Guillaume Abrioux)

- ceph-volume: use udev data instead of LVM subprocess in get\_devices() ([pr#65745](https://github.com/ceph/ceph/pull/65745), Guillaume Abrioux)

- ceph<span></span>.spec<span></span>.in: add update-alternatives as runtime dep and correct macro call ([pr#69852](https://github.com/ceph/ceph/pull/69852), Kefu Chai)

- ceph<span></span>.spec<span></span>.in: build with fuse 3 ([pr#63169](https://github.com/ceph/ceph/pull/63169), Andreas Stieger)

- ceph<span></span>.spec<span></span>.in: disable -P in python shebang for cephadm binary ([pr#69990](https://github.com/ceph/ceph/pull/69990), Shweta Bhosale)

- ceph<span></span>.spec<span></span>.in: don't rm ceph conf and logs in ceph-common postun ([pr#62790](https://github.com/ceph/ceph/pull/62790), Justin Caratzas)

- ceph<span></span>.spec<span></span>.in: Include Crimson by default ([pr#66229](https://github.com/ceph/ceph/pull/66229), Matan Breizman)

- ceph<span></span>.spec<span></span>.in: only require c-ares >= 1<span></span>.28 on el10+ ([pr#69295](https://github.com/ceph/ceph/pull/69295), Kefu Chai)

- ceph<span></span>.spec<span></span>.in: replace golang github prometheus with promtool binary path ([pr#68336](https://github.com/ceph/ceph/pull/68336), Nizamudeen A)

- ceph<span></span>.spec<span></span>.in: require c-ares >= 1<span></span>.28 for ceph-osd-crimson ([pr#69259](https://github.com/ceph/ceph/pull/69259), Kautilya Tripathi)

- ceph<span></span>.spec<span></span>.in: use rpm macro for python shebang pathfix ([pr#64123](https://github.com/ceph/ceph/pull/64123), John Mulligan)

- ceph<span></span>.spec: declare PyYAML and Jinja2 Requires for cephadm RPM ([pr#68368](https://github.com/ceph/ceph/pull/68368), Kobi Ginon)

- ceph: fix a small error in the ceph command help ([pr#66666](https://github.com/ceph/ceph/pull/66666), John Mulligan)

- ceph\_mon: Fix shutdown order to destroy Monitor before closing mon store ([pr#68166](https://github.com/ceph/ceph/pull/68166), Prashant D)

- cephadm, ceph-volume: add tests for crimson OSD support ([pr#67290](https://github.com/ceph/ceph/pull/67290), Shraddha Agrawal)

- cephadm, ceph-volume: deploy crimson OSDs using cephadm ([pr#66811](https://github.com/ceph/ceph/pull/66811), Shraddha Agrawal)

- cephadm, debian/rules: Use system packages for cephadm bundled dependencies ([pr#65936](https://github.com/ceph/ceph/pull/65936), Kefu Chai)

- cephadm/build: Fix \_has\_python\_pip() function check ([pr#65934](https://github.com/ceph/ceph/pull/65934), Kefu Chai)

- cephadm/cephadmlib: Eliminate false warnings about old sysctl conf files ([pr#65147](https://github.com/ceph/ceph/pull/65147), Gil Bregman)

- cephadm/images: Update tags for samba and smbmetrics containers ([pr#68259](https://github.com/ceph/ceph/pull/68259), Anoop C S)

- cephadm/images: Use ceph21 tagged Samba container images ([pr#70630](https://github.com/ceph/ceph/pull/70630), Anoop C S)

- cephadm/nvmeof: enable rbd\_with\_crc32c by default ([pr#66569](https://github.com/ceph/ceph/pull/66569), Alexander Indenbaum)

- cephadm/samples: don't specify localhost as grafana addr ([pr#67393](https://github.com/ceph/ceph/pull/67393), Adam King)

- cephadm/smb: Bind mount /run with 0755 ([pr#69512](https://github.com/ceph/ceph/pull/69512), Anoop C S)

- cephadm/tests: pre-import tracemalloc to avoid pyfakefs setup race ([pr#72001](https://github.com/ceph/ceph/pull/72001), David Galloway)

- cephadm: add command to send signals to daemons ([pr#63962](https://github.com/ceph/ceph/pull/63962), Adam King)

- cephadm: add get\_dependencies to smb service class ([pr#68164](https://github.com/ceph/ceph/pull/68164), John Mulligan)

- cephadm: add optional build flag ([pr#63412](https://github.com/ceph/ceph/pull/63412), Alex Wojno)

- cephadm: add support for seastore ([pr#67274](https://github.com/ceph/ceph/pull/67274), Shraddha Agrawal)

- cephadm: Automates the procedure to shutdown and bring up an entire Ceph cluster ([pr#67388](https://github.com/ceph/ceph/pull/67388), Teoman ONAY)

- cephadm: avoid double counting NVMe devices in host facts ([pr#67669](https://github.com/ceph/ceph/pull/67669), Ujjawal Anand)

- cephadm: Bind mount /var/lib/samba with 0755 ([pr#64454](https://github.com/ceph/ceph/pull/64454), Anoop C S)

- cephadm: ceph mgr fail or active ceph mgr restart causes unnecessary … ([pr#68553](https://github.com/ceph/ceph/pull/68553), Yael Azulay)

- cephadm: cephadm: omit --osd-type classic for older ceph-volume ([pr#69168](https://github.com/ceph/ceph/pull/69168), Guillaume Abrioux)

- cephadm: disable UDP in samples/nfs<span></span>.json for test\_cephadm Ganesha ([pr#68976](https://github.com/ceph/ceph/pull/68976), Kobi Ginon)

- cephadm: disable/enable NVMe-oF gateways during host maintenance ([pr#70415](https://github.com/ceph/ceph/pull/70415), Alexander Indenbaum)

- cephadm: don't collect image ids for daemons with no container info ([pr#62935](https://github.com/ceph/ceph/pull/62935), Adam King)

- cephadm: During the upgrade, when inspecting the new ceph image for t… ([pr#68538](https://github.com/ceph/ceph/pull/68538), Yael Azulay)

- cephadm: fail the script if byte-compile step fails ([pr#65373](https://github.com/ceph/ceph/pull/65373), John Mulligan)

- cephadm: fix building rpm-sourced cephadm zippapp on el10 ([pr#65176](https://github.com/ceph/ceph/pull/65176), John Mulligan)

- cephadm: fix EndPoint to handle bracketed IPv6 addresses ([pr#67530](https://github.com/ceph/ceph/pull/67530), Redouane Kachach)

- cephadm: fix rm-cluster when /etc/ceph/ceph<span></span>.conf is a directory ([pr#67621](https://github.com/ceph/ceph/pull/67621), Kefu Chai)

- cephadm: fix staggered upgrade ([pr#69724](https://github.com/ceph/ceph/pull/69724), Guillaume Abrioux)

- cephadm: Get ceph cluster count missing data dir ([pr#63952](https://github.com/ceph/ceph/pull/63952), James Oakley)

- cephadm: improve hw qat experience with cephadm ([pr#63895](https://github.com/ceph/ceph/pull/63895), Kushal Deb)

- cephadm: improve oauth2-proxy validation error messaging ([pr#68699](https://github.com/ceph/ceph/pull/68699), Shubha Jain)

- cephadm: minor ergonomic improvements for hackers ([pr#63247](https://github.com/ceph/ceph/pull/63247), John Mulligan)

- cephadm: pass wal/db slot count to ceph-volume ([pr#64893](https://github.com/ceph/ceph/pull/64893), Ksawery Dziekoński)

- cephadm: reapply hugepages for nvmeof at service start ([pr#67365](https://github.com/ceph/ceph/pull/67365), Kushal Deb)

- cephadm: Refactor \_check\_daemons to allow service subclasses to choose the next action ([pr#67737](https://github.com/ceph/ceph/pull/67737), John Mulligan)

- cephadm: retry cleaning old cgroups when it fails ([pr#67049](https://github.com/ceph/ceph/pull/67049), Adam King)

- cephadm: support custom distros by falling back to `ID\_LIKE` ([pr#65599](https://github.com/ceph/ceph/pull/65599), bachmanity1)

- cephadm: Use specified method for osd<span></span>.default ([pr#65050](https://github.com/ceph/ceph/pull/65050), Zack Cerza)

- cephadm: wait for latest osd map after ceph-volume before OSD deploy ([pr#68367](https://github.com/ceph/ceph/pull/68367), Guillaume Abrioux)

- cephadm: zap raw OSD devices on rm-cluster ([pr#71730](https://github.com/ceph/ceph/pull/71730), Guillaume Abrioux)

- cephdm: add support for raw bluestore + crimson OSD deployment ([pr#67374](https://github.com/ceph/ceph/pull/67374), Shraddha Agrawal)

- cephfs, tools/cephfs\_mirror: migrate from boost::variant to std::variant ([pr#63178](https://github.com/ceph/ceph/pull/63178), Kefu Chai)

- cephfs-mirror: integrate blockdiff with mirror daemon ([issue#70225](http://tracker.ceph.com/issues/70225), [pr#62250](https://github.com/ceph/ceph/pull/62250), Venky Shankar, Jos Collin)

- cephfs<span></span>.pyx: handle when UID/GID passed to chown() is -1 ([pr#64999](https://github.com/ceph/ceph/pull/64999), Rishabh Dave)

- cephfs: fix monclient not subscribed monmap/config ([pr#64909](https://github.com/ceph/ceph/pull/64909), Shaohui Wang)

- cephfs: include cleanup ([pr#62948](https://github.com/ceph/ceph/pull/62948), Venky Shankar, Max Kellermann)

- cephfs: MDCache request cleanup ([pr#62630](https://github.com/ceph/ceph/pull/62630), Abhishek Lekshmanan)

- cephfs: session tracker accounts for killing sessions ([pr#62631](https://github.com/ceph/ceph/pull/62631), Abhishek Lekshmanan)

- cephfs\_mirror/mds/mgr: Mirroring metrics, Mutable snapshot metadata, checkpoint ([pr#70029](https://github.com/ceph/ceph/pull/70029), Karthik U S, Rishabh Dave, Kotresh HR)

- cephfs\_mirror: A few bug fix back ports ([pr#70957](https://github.com/ceph/ceph/pull/70957), Kotresh HR)

- cephfs\_mirror: deprecate peer\_add command ([pr#65309](https://github.com/ceph/ceph/pull/65309), Jos Collin)

- certmgr adding support for fullchain PEM ([pr#71513](https://github.com/ceph/ceph/pull/71513), Kefu Chai, Redouane Kachach)

- ci: Fixes for ceph-rook-e2e job ([pr#68029](https://github.com/ceph/ceph/pull/68029), David Galloway)

- client: account for mixed quotas in statfs ([pr#65918](https://github.com/ceph/ceph/pull/65918), Christopher Hoffman)

- client: asynchronous fsync can decrement request ref twice ([issue#71510](http://tracker.ceph.com/issues/71510), [pr#63619](https://github.com/ceph/ceph/pull/63619), Venky Shankar)

- client: disallow unprivileged users to escalate root privileges ([pr#62025](https://github.com/ceph/ceph/pull/62025), Xiubo Li, Venky Shankar)

- client: do not allow zero‑length reads ([pr#65656](https://github.com/ceph/ceph/pull/65656), Dhairya Parmar)

- client: do not check file size when inode does not have Fc caps ([issue#70726](http://tracker.ceph.com/issues/70726), [pr#63383](https://github.com/ceph/ceph/pull/63383), Venky Shankar)

- client: During encryption of short case-insensitive file names, store raw ciphertext ([pr#67377](https://github.com/ceph/ceph/pull/67377), Christopher Hoffman)

- client: fix async/sync I/O stalling due to buffer list exceeding INT\_MAX ([pr#58564](https://github.com/ceph/ceph/pull/58564), Dhairya Parmar)

- client: fix memory leak in Client::CRF\_iofinish::complete ([pr#60507](https://github.com/ceph/ceph/pull/60507), Shachar Sharon)

- client: fix unmount hang after lookups ([pr#62488](https://github.com/ceph/ceph/pull/62488), Dhairya Parmar)

- client: keep dentry alive while unlinking trimmed cache entries ([pr#70170](https://github.com/ceph/ceph/pull/70170), Igor Golikov)

- client: Only use known fields when comparing policies ([pr#66288](https://github.com/ceph/ceph/pull/66288), Christopher Hoffman)

- client: prohibit unprivileged users from setting sgid/suid bits ([pr#64356](https://github.com/ceph/ceph/pull/64356), Kefu Chai)

- client: some improvements for Client<span></span>.cc ([pr#65432](https://github.com/ceph/ceph/pull/65432), Rishabh Dave)

- client: Use correct size for fscrypt dummy key ([pr#68141](https://github.com/ceph/ceph/pull/68141), Christopher Hoffman)

- client: use path supplied in statfs ([pr#64864](https://github.com/ceph/ceph/pull/64864), Christopher Hoffman)

- cloud restore : add None type for cloud-s3-glacier ([pr#64128](https://github.com/ceph/ceph/pull/64128), Jiffin Tony Thottan)

- cls/CMakeLists<span></span>.txt: find\_package Lua for cls\_lua ([pr#63620](https://github.com/ceph/ceph/pull/63620), Samuel Just)

- cls/hello: debug\_cls -> debug\_objclass in the comment ([pr#65980](https://github.com/ceph/ceph/pull/65980), Ilya Dryomov)

- cls/rbd: remove unused includes ([pr#64432](https://github.com/ceph/ceph/pull/64432), Kefu Chai)

- cls/rbd: use default values for non-decoded fields in test instances ([pr#63933](https://github.com/ceph/ceph/pull/63933), Kefu Chai)

- cls/rbd: write image mirror status if state is CREATING ([pr#63050](https://github.com/ceph/ceph/pull/63050), N Balachandran)

- cls/rgw: remove unused class BucketIndexAioManager ([pr#63930](https://github.com/ceph/ceph/pull/63930), Casey Bodley)

- cls/rgw\_gc: read config via cls\_get\_config ([pr#67284](https://github.com/ceph/ceph/pull/67284), Kautilya Tripathi)

- cls/test: Stop the cls\_fifo<span></span>.get\_info test from Segmentation Faulting ([pr#67422](https://github.com/ceph/ceph/pull/67422), Matty Williams)

- cls: remove unused variable ([pr#69054](https://github.com/ceph/ceph/pull/69054), Kefu Chai)

- cls: return EIO instead of ceph::from\_error\_code() ([pr#68359](https://github.com/ceph/ceph/pull/68359), Ronen Friedman)

- cmake,blk/spdk: support WITH\_SYSTEM\_SPDK ([pr#69185](https://github.com/ceph/ceph/pull/69185), Sun Yuechi)

- cmake,debian: enable ceph-mon-client-nvmeof on Debian derivatives ([pr#68817](https://github.com/ceph/ceph/pull/68817), Kefu Chai)

- cmake/AddCephTest: use namespaced Catch2 imported targets ([pr#69165](https://github.com/ceph/ceph/pull/69165), Sun Yuechi)

- cmake/BuildISAL: build and install library targets only ([pr#68758](https://github.com/ceph/ceph/pull/68758), Kefu Chai)

- cmake/isal-l: explicitly configure libdir to avoid wrong libisal<span></span>.a ([pr#68404](https://github.com/ceph/ceph/pull/68404), Igor Fedotov)

- cmake/modules/FindBoost: add support for Boost 1<span></span>.88<span></span>.0 ([pr#64250](https://github.com/ceph/ceph/pull/64250), Kefu Chai)

- cmake/rgw: WITH\_RADOSGW\_POSIX depends on WITH\_RADOSGW\_DBSTORE ([pr#65795](https://github.com/ceph/ceph/pull/65795), Casey Bodley)

- cmake: add cmake 4 support ([pr#65916](https://github.com/ceph/ceph/pull/65916), Edwin Rodriguez)

- cmake: build static seastar for release builds ([pr#66682](https://github.com/ceph/ceph/pull/66682), Kefu Chai)

- cmake: BuildArrow<span></span>.cmake uses bundled thrift if system version < 0<span></span>.17 ([pr#65970](https://github.com/ceph/ceph/pull/65970), Casey Bodley)

- cmake: bump minimum required CMake version to 3<span></span>.22<span></span>.1 ([pr#63795](https://github.com/ceph/ceph/pull/63795), Kefu Chai)

- cmake: clarify WITH\_CRIMSON help text ([pr#66718](https://github.com/ceph/ceph/pull/66718), Kefu Chai)

- cmake: convert erasure\_code and json\_spirit to OBJECT libraries ([pr#65729](https://github.com/ceph/ceph/pull/65729), Kefu Chai)

- cmake: Define BITS\_PER\_LONG for ppc64le target ([pr#66599](https://github.com/ceph/ceph/pull/66599), T K Chandra Hasan)

- cmake: disable Catch2 tests when Catch2 is unavailable ([pr#69374](https://github.com/ceph/ceph/pull/69374), Sun Yuechi)

- cmake: disable LeakSanitizer suppression output to fix CLI tests ([pr#65192](https://github.com/ceph/ceph/pull/65192), Kefu Chai)

- cmake: disable WITH\_BREAKPAD on power arch ([pr#66166](https://github.com/ceph/ceph/pull/66166), Casey Bodley)

- cmake: enable out-of-source build of breakpad ([pr#63655](https://github.com/ceph/ceph/pull/63655), Kefu Chai)

- cmake: fix checks for WITH\_SYSTEM\_QATLIB ([pr#66097](https://github.com/ceph/ceph/pull/66097), Casey Bodley)

- cmake: fix for -DWITH\_BREAKPAD=OFF ([pr#66462](https://github.com/ceph/ceph/pull/66462), Casey Bodley)

- cmake: Fix ISA-L build on arm ([pr#68711](https://github.com/ceph/ceph/pull/68711), Jamie Pryde)

- cmake: fix liburing path passed to rocksdb ([pr#66786](https://github.com/ceph/ceph/pull/66786), sungjoon_koh)

- cmake: fix undefined PY\_LDFLAGS in distutils\_install\_cython\_module ([pr#67037](https://github.com/ceph/ceph/pull/67037), Kefu Chai)

- cmake: guard unittest\_global\_doublefree with WITH\_LIBCEPHFS ([pr#66848](https://github.com/ceph/ceph/pull/66848), Kefu Chai)

- cmake: link legacy-option-headers from targets that use legacy options ([pr#69215](https://github.com/ceph/ceph/pull/69215), Sun Yuechi)

- cmake: link uring::uring to Boost::boost and fix cephfs tools linkage ([pr#67619](https://github.com/ceph/ceph/pull/67619), Kefu Chai)

- cmake: migrate Python module installation from setup<span></span>.py to pip ([pr#67045](https://github.com/ceph/ceph/pull/67045), Kefu Chai)

- cmake: remove \_FORTIFY\_SOURCE define ([pr#65371](https://github.com/ceph/ceph/pull/65371), Casey Bodley)

- cmake: remove Boost::system linkage for boost 1<span></span>.89+ ([pr#66801](https://github.com/ceph/ceph/pull/66801), Kefu Chai)

- cmake: remove error\_code<span></span>.cc from osdc to fix ODR violation ([pr#64259](https://github.com/ceph/ceph/pull/64259), Kefu Chai)

- cmake: Remove unused cls\_lock\_client linkage ([pr#64261](https://github.com/ceph/ceph/pull/64261), Kefu Chai)

- cmake: replace WITH\_SEASTAR with WITH\_CRIMSON ([pr#64246](https://github.com/ceph/ceph/pull/64246), Kefu Chai)

- cmake: skip boost dependency on ALIAS executable targets ([pr#55638](https://github.com/ceph/ceph/pull/55638), Seena Fallah)

- cmake: support building with system jerasure and gf-complete ([pr#68258](https://github.com/ceph/ceph/pull/68258), Kefu Chai)

- cmake: suppress -Wmaybe-uninitialized warning in memstore PageSet ([pr#63796](https://github.com/ceph/ceph/pull/63796), Kefu Chai)

- cmake: update C standard from C99 to C11 ([pr#66079](https://github.com/ceph/ceph/pull/66079), Edwin Rodriguez)

- cmake: upgrade CMAKE\_CXX\_STANDARD from 20 to 23 ([pr#64426](https://github.com/ceph/ceph/pull/64426), Kefu Chai)

- cmake: use find\_program(REQUIRED) to fail early on missing programs ([pr#63975](https://github.com/ceph/ceph/pull/63975), Kefu Chai)

- CMakeLists: Fallback to RelWithDebInfo ([pr#61637](https://github.com/ceph/ceph/pull/61637), Matan Breizman)

- CODEOWNERS: add a build-sig group for various build / test files ([pr#68403](https://github.com/ceph/ceph/pull/68403), John Mulligan)

- CODEOWNERS: add an smb group for various smb related files ([pr#68578](https://github.com/ceph/ceph/pull/68578), John Mulligan)

- common/admin\_socket: use POSIX timer for delayed signal delivery ([pr#68816](https://github.com/ceph/ceph/pull/68816), Kefu Chai)

- common/async: fix stack-use-after-scope in co\_waiter ([pr#67568](https://github.com/ceph/ceph/pull/67568), Kefu Chai)

- common/async: improved `redirect\_error`, `run\_coro`, and tests ([pr#65062](https://github.com/ceph/ceph/pull/65062), Adam C. Emerson)

- common/async: remove null\_yield support for spawn\_throttle ([pr#64624](https://github.com/ceph/ceph/pull/64624), Casey Bodley)

- common/async:: Update delete operator in CompletionImpl ([pr#64969](https://github.com/ceph/ceph/pull/64969), Edwin Rodriguez)

- common/ceph\_context<span></span>.h: reserve space for breakpad in CephContext ([pr#64829](https://github.com/ceph/ceph/pull/64829), Adam Kupczyk)

- common/compat: resolve compiler warnings on win32 ([pr#65715](https://github.com/ceph/ceph/pull/65715), Patrick Donnelly)

- common/Cycles: Add high-precision counter support for riscv64 ([pr#65120](https://github.com/ceph/ceph/pull/65120), WenLei)

- common/Formatter: move {JSON,Table,XML}Formatter to separate files ([pr#65403](https://github.com/ceph/ceph/pull/65403), Max Kellermann)

- common/frag: properly convert frag\_t to net/store endianness ([pr#66199](https://github.com/ceph/ceph/pull/66199), Patrick Donnelly)

- common/io\_exerciser: Add consistency checking functionality to IO exerciser ([pr#62985](https://github.com/ceph/ceph/pull/62985), Connor Fawcett)

- common/io\_exerciser: fix buffer overread in DataGenerator ([pr#64036](https://github.com/ceph/ceph/pull/64036), Kefu Chai)

- common/io\_exerciser: Fixes for sequencing options ([pr#62973](https://github.com/ceph/ceph/pull/62973), Connor Fawcett)

- common/mutex\_debug: fix arm64 SIGBUS/segfault due to data race ([pr#64273](https://github.com/ceph/ceph/pull/64273), Kefu Chai)

- common/not\_before\_queue: Fix signed comparison warning ([pr#62670](https://github.com/ceph/ceph/pull/62670), Adam Emerson)

- common/options/crimson: introduce crimson\_poll\_mode ([pr#63333](https://github.com/ceph/ceph/pull/63333), Matan Breizman)

- common/options: document log\_to\_stderr's conditional default value ([pr#66766](https://github.com/ceph/ceph/pull/66766), Kefu Chai)

- common/options: fix heap-use-after-free by using never-destroyed static ([pr#66895](https://github.com/ceph/ceph/pull/66895), Kefu Chai)

- common/options: fix typo in option description ([pr#62944](https://github.com/ceph/ceph/pull/62944), Lorenz Bausch)

- common/options: improve rgw\_dns\_name and clarify separator ([pr#68972](https://github.com/ceph/ceph/pull/68972), Ville Ojamo)

- common/perf\_counters: don't use magics for add\_u64\_counter{,\_histogram} ([pr#66134](https://github.com/ceph/ceph/pull/66134), Radoslaw Zarzynski)

- common/perf\_counters: improve add() performance ([pr#68150](https://github.com/ceph/ceph/pull/68150), Ronen Friedman)

- common/perf\_counters: track maximum increment value for LONGRUNAVG perf ([pr#63594](https://github.com/ceph/ceph/pull/63594), Igor Fedotov)

- common/plugin: fix spacing in plugin load error message ([pr#64222](https://github.com/ceph/ceph/pull/64222), Kefu Chai)

- common/static\_ptr: avoid using std::aligned\_storage\_t ([pr#64040](https://github.com/ceph/ceph/pull/64040), Kefu Chai)

- common/static\_ptr: pass an integer to alignas to fix GCC-11 build fai… ([pr#64071](https://github.com/ceph/ceph/pull/64071), Kefu Chai)

- common/util: silent "warning: ‘cgroup\_limit’ may be used uninitialized" ([pr#68179](https://github.com/ceph/ceph/pull/68179), Igor Fedotov)

- common/version: strip trailing newline from vendor release file ([pr#68111](https://github.com/ceph/ceph/pull/68111), Naveen Naidu)

- common: Add cputrace tool for scope-based CPU performance tracing ([pr#64331](https://github.com/ceph/ceph/pull/64331), Jaya Prakash, Adam Kupczyk)

- common: Allow PerfCounters to return a provided service ID ([pr#65350](https://github.com/ceph/ceph/pull/65350), Adam C. Emerson)

- common: avoid using std::aligned\_storage\_t ([pr#62991](https://github.com/ceph/ceph/pull/62991), Kefu Chai)

- common: enable AVX512+VPCLMULQDQ for crc32c performance on x86 ([pr#66150](https://github.com/ceph/ceph/pull/66150), Maodi Ma)

- common: fix backtrace leak in \_\_ceph\_abort and friends ([pr#63300](https://github.com/ceph/ceph/pull/63300), Kefu Chai)

- common: fix the ms\_async\_op\_threads not applied successfully for daemons running in foreground mode ([pr#63390](https://github.com/ceph/ceph/pull/63390), dongdong tao)

- common: fix TrackedOp intrusive\_ptr compatibility with boost 1<span></span>.89+ ([pr#66728](https://github.com/ceph/ceph/pull/66728), Kefu Chai)

- common: fix uninitialized nref in crimson CephContext ([pr#67453](https://github.com/ceph/ceph/pull/67453), Alexander Indenbaum)

- common: include cleanup ([pr#62915](https://github.com/ceph/ceph/pull/62915), Max Kellermann)

- common: Log when we leak and disallow inlining ([pr#69977](https://github.com/ceph/ceph/pull/69977), Brad Hubbard)

- common: ModeCollector: locating the value of the mode ([pr#65716](https://github.com/ceph/ceph/pull/65716), Ronen Friedman)

- common: ModeCollector: missing bits ([pr#66192](https://github.com/ceph/ceph/pull/66192), Ronen Friedman)

- common: remove unused arch<span></span>.h ([pr#68099](https://github.com/ceph/ceph/pull/68099), Sun Yuechi)

- common: remove unused attribute ([pr#65516](https://github.com/ceph/ceph/pull/65516), Patrick Donnelly)

- compressor/zstd: compressor correct buffer end detection using get\_remaining() ([pr#64682](https://github.com/ceph/ceph/pull/64682), Igor Fedotov)

- compressor/zstd: include <zstd<span></span>.h> instead of the bundled path ([pr#69188](https://github.com/ceph/ceph/pull/69188), Sun Yuechi)

- compressor: compressor\_zlib\_isal did not take effect in compression ([pr#59206](https://github.com/ceph/ceph/pull/59206), Yao guotao)

- container/build<span></span>.sh: add 'rocky-10' suffix if necessary ([pr#66046](https://github.com/ceph/ceph/pull/66046), Dan Mick)

- container/build<span></span>.sh: fix debug tag overwrite ([pr#68303](https://github.com/ceph/ceph/pull/68303), Shraddha Agrawal)

- container/build<span></span>.sh: FROM\_IMAGE=rockylinux-10 default for >=tentacle ([pr#67959](https://github.com/ceph/ceph/pull/67959), David Galloway)

- container/build<span></span>.sh: Use dedicated debug tags ([pr#67041](https://github.com/ceph/ceph/pull/67041), Matan Breizman)

- container/Containerfile: fix crimson package naming ([pr#66265](https://github.com/ceph/ceph/pull/66265), Matan Breizman)

- container/make-manifest-list<span></span>.py: add version parameter ([pr#67830](https://github.com/ceph/ceph/pull/67830), Dan Mick)

- container: default FROM\_IMAGE to Rocky Linux 10 ([pr#70297](https://github.com/ceph/ceph/pull/70297), David Galloway)

- container: support building a container image with custom packages ([pr#64976](https://github.com/ceph/ceph/pull/64976), John Mulligan)

- Containerfile: Support pulp repo URLs ([pr#69580](https://github.com/ceph/ceph/pull/69580), David Galloway)

- Containerfile: Support Rocky 10 as base image ([pr#66069](https://github.com/ceph/ceph/pull/66069), David Galloway)

- CONTRIBUTING: link to Governance doc ([pr#66262](https://github.com/ceph/ceph/pull/66262), Dan van der Ster, Josh Durgin, Neha Ojha)

- Control PG autoscaler during upgrades with pg\_autoscale\_during\_upgrade ([pr#67694](https://github.com/ceph/ceph/pull/67694), Ashwin M. Joshi)

- Correct: ceph orch daemon incorrectly setting container image to force ([pr#68484](https://github.com/ceph/ceph/pull/68484), Kobi Ginon)

- cpp-btree: fix array bounds warning in btree\_node::swap() ([pr#65450](https://github.com/ceph/ceph/pull/65450), Kefu Chai)

- crimsn/os/seastore: separate reset accounting from transaction creation ([pr#69211](https://github.com/ceph/ceph/pull/69211), Matan Breizman)

- Crimson PG Splitting ([pr#60428](https://github.com/ceph/ceph/pull/60428), Aishwarya Mathuria)

- crimson+classic/osd/scrub: limit scrubbing under snap-trimming overload ([pr#68737](https://github.com/ceph/ceph/pull/68737), Ronen Friedman)

- crimson-store-bench: add utility for measuring IO patterns against crimson FuturizedStore ([pr#64614](https://github.com/ceph/ceph/pull/64614), Samuel Just, Shreya Subramanian)

- crimson/<span></span>.<span></span>.<span></span>./circular\_journal\_space: fix boundary check ([pr#65154](https://github.com/ceph/ceph/pull/65154), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./ephemeral: faster seastore eph dev ([pr#64926](https://github.com/ceph/ceph/pull/64926), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./fixed\_kv\_node: don't call copy\_out if delta\_buffer is empty ([pr#65017](https://github.com/ceph/ceph/pull/65017), Samuel Just)

- crimson/<span></span>.<span></span>.<span></span>./linked\_tree\_node: fix incorrect end offset calculation ([pr#64625](https://github.com/ceph/ceph/pull/64625), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./linked\_tree\_node: fix pivot\_idx assertion in balancing ([pr#64714](https://github.com/ceph/ceph/pull/64714), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./omap\_btree\_node\_impl: fix complete flag for depth 2 omap scan ([pr#64466](https://github.com/ceph/ceph/pull/64466), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./omap\_btree\_node\_impl: fix inner node iterate ([pr#64593](https://github.com/ceph/ceph/pull/64593), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./omap\_btree\_node\_impl: pass pivot\_idx for balancing ([pr#64675](https://github.com/ceph/ceph/pull/64675), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./rbm\_device: remove unnecessary zero fill in anonymous mmap ([pr#65070](https://github.com/ceph/ceph/pull/65070), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./store-bench: fix coll\_refs index error ([pr#65527](https://github.com/ceph/ceph/pull/65527), Chanyoung Park)

- crimson/<span></span>.<span></span>.<span></span>./string\_kv\_node\_layout: switch linear to binary search ([pr#64938](https://github.com/ceph/ceph/pull/64938), Chanyoung Park)

- crimson/admin/osd\_admin: introduce reactor\_backend command ([pr#67457](https://github.com/ceph/ceph/pull/67457), Matan Breizman)

- crimson/common/fatal\_signal: Rework signals ([pr#63673](https://github.com/ceph/ceph/pull/63673), Matan Breizman)

- crimson/common/interruptible\_future: fix interruption leakage in green\_get/get/yield/maybe\_yield ([pr#67740](https://github.com/ceph/ceph/pull/67740), Xuehan Xu)

- crimson/common/smp\_helpers: fix missing include ([pr#64203](https://github.com/ceph/ceph/pull/64203), Matan Breizman)

- crimson/common: replace deprecated fmt::localtime() with localtime\_r() ([pr#64465](https://github.com/ceph/ceph/pull/64465), Kefu Chai)

- crimson/doc/seastore: document device super-block structure ([pr#68677](https://github.com/ceph/ceph/pull/68677), Ronen Friedman)

- crimson/mgr: prevent pg stats report pile-up in overloaded store ([pr#70658](https://github.com/ceph/ceph/pull/70658), Ronen Friedman)

- crimson/os,tools,qa: fix crimson-objectstore-tool tests ([pr#68474](https://github.com/ceph/ceph/pull/68474), Ronen Friedman)

- crimson/os/alienstore: make CnLog::\_flush non-blocking ([pr#70342](https://github.com/ceph/ceph/pull/70342), Ronen Friedman)

- crimson/os/seastore/2Q: don't add empty extents to the warm out queue ([pr#64979](https://github.com/ceph/ceph/pull/64979), Zhang Song)

- crimson/os/seastore/async\_cleaner: measure io block time ([pr#64498](https://github.com/ceph/ceph/pull/64498), Xuehan Xu)

- crimson/os/seastore/async\_cleaner: set different threshold for starting and stopping trimming dirty ([pr#63515](https://github.com/ceph/ceph/pull/63515), Yingxin Cheng, Xuehan Xu)

- crimson/os/seastore/btree: bottom-up search capability ([pr#64252](https://github.com/ceph/ceph/pull/64252), Xuehan Xu, Zhang Song)

- crimson/os/seastore/cache/LRU: account the empty extent when adding it to LRU ([pr#62969](https://github.com/ceph/ceph/pull/62969), Zhang Song)

- crimson/os/seastore/cache: clear extents\_index when the booting is done ([pr#65198](https://github.com/ceph/ceph/pull/65198), Xuehan Xu)

- crimson/os/seastore/cache: conconrrent read of EXIST\_CLEAN extents can ([pr#68534](https://github.com/ceph/ceph/pull/68534), Xuehan Xu)

- crimson/os/seastore/cache: extend extent lifecycle after wait-io ([pr#64401](https://github.com/ceph/ceph/pull/64401), Yingxin Cheng)

- crimson/os/seastore/cache: fix inappropriate lambda by-reference captures in get\_extent\_viewable\_by\_trans() ([pr#64002](https://github.com/ceph/ceph/pull/64002), Xuehan Xu)

- crimson/os/seastore/cache: fix possible extent chksum error ([pr#67157](https://github.com/ceph/ceph/pull/67157), Xuehan Xu)

- crimson/os/seastore/cache: TRIM\_DIRTY/CLEANER\\_\* transactions won't invalidate other transactions anymore ([pr#67589](https://github.com/ceph/ceph/pull/67589), Xuehan Xu)

- crimson/os/seastore/cache: TRIM\_DIRTY/CLEANER\\_\* transactions won't invalidate other transactions anymore ([pr#66488](https://github.com/ceph/ceph/pull/66488), Xuehan Xu)

- crimson/os/seastore/cache: Verify crc prior to complete\_io ([pr#66506](https://github.com/ceph/ceph/pull/66506), Matan Breizman, Zhang Song, Xuehan Xu)

- crimson/os/seastore/CBJournal: correct needs\_roll condition ([pr#65108](https://github.com/ceph/ceph/pull/65108), Zhang Song)

- crimson/os/seastore/epm: avoid unnecessary container copies ([pr#66158](https://github.com/ceph/ceph/pull/66158), Xuehan Xu)

- crimson/os/seastore/epm: make max\_generation and gc\_formula configurable ([pr#64452](https://github.com/ceph/ceph/pull/64452), Xuehan Xu)

- crimson/os/seastore/epm: Verify available segments on mkfs/mount ([pr#65578](https://github.com/ceph/ceph/pull/65578), Matan Breizman)

- crimson/os/seastore/journal: dispatch records greedily while io slots are free ([pr#70790](https://github.com/ceph/ceph/pull/70790), Kefu Chai)

- crimson/os/seastore/journal: switch CircularJournalSpace to coroutines ([pr#68544](https://github.com/ceph/ceph/pull/68544), Myoungwon Oh)

- crimson/os/seastore/lba/btree\_lba\_manager: never downcast reserved ptrs ([pr#64109](https://github.com/ceph/ceph/pull/64109), Xuehan Xu)

- crimson/os/seastore/lba: fix wrong asserts and "if" conditions ([pr#69067](https://github.com/ceph/ceph/pull/69067), Xuehan Xu)

- crimson/os/seastore/linked\_tree\_node: correct balance pivots calculation for both fixed-kv tree and omap tree ([pr#63219](https://github.com/ceph/ceph/pull/63219), Xuehan Xu, Yingxin Cheng)

- crimson/os/seastore/linked\_tree\_node: get\_child\_sync should also get transactional views of the extent ([pr#69248](https://github.com/ceph/ceph/pull/69248), Xuehan Xu)

- crimson/os/seastore/logical\_child\_node: LogicalChildNode should respond to the invalidation event ([pr#64617](https://github.com/ceph/ceph/pull/64617), Xuehan Xu)

- crimson/os/seastore/object\_data\_handler: avoid reserving zero-length regions ([pr#67567](https://github.com/ceph/ceph/pull/67567), Xuehan Xu)

- crimson/os/seastore/object\_data\_handler: make sure continuous object data blocks are loaded with a single io request ([pr#65425](https://github.com/ceph/ceph/pull/65425), Xuehan Xu)

- crimson/os/seastore/object\_data\_handler: remove redundant indirect mappings at the end of ObjectDataHandler::clone() ([pr#64993](https://github.com/ceph/ceph/pull/64993), Xuehan Xu)

- crimson/os/seastore/omap\_manager: fix OMapLeafNode rewrite type error ([pr#64318](https://github.com/ceph/ceph/pull/64318), Xuehan Xu)

- crimson/os/seastore/omap\_manager: handle the cases in which omap nodes are rewritten before seen by users ([pr#63376](https://github.com/ceph/ceph/pull/63376), Xuehan Xu)

- crimson/os/seastore/omap\_manager: only mutate the parent when merge/balance can proceed ([pr#63520](https://github.com/ceph/ceph/pull/63520), Xuehan Xu)

- crimson/os/seastore/onode\_manager: avoid debug related info from occupying too much cpu time ([pr#69095](https://github.com/ceph/ceph/pull/69095), Xuehan Xu)

- crimson/os/seastore/rbm: fix incorrect reporting block size ([pr#64807](https://github.com/ceph/ceph/pull/64807), Myoungwon Oh)

- crimson/os/seastore/rbm: handle no-space case properly ([pr#65197](https://github.com/ceph/ceph/pull/65197), Myoungwon Oh, Chanyoung Park)

- crimson/os/seastore/rbm: improve large sequential write by issuing writes in parallel ([pr#64585](https://github.com/ceph/ceph/pull/64585), Myoungwon Oh)

- crimson/os/seastore/rbm: prevent incorrect space calculation at maximum capacity ([pr#63428](https://github.com/ceph/ceph/pull/63428), Myoungwon Oh)

- crimson/os/seastore/rbm: switch rbm to coroutine ([pr#65367](https://github.com/ceph/ceph/pull/65367), Myoungwon Oh)

- crimson/os/seastore/rbm: switch to coroutine in state\_device ([pr#65243](https://github.com/ceph/ceph/pull/65243), Matan Breizman, Myoungwon Oh)

- crimson/os/seastore/segment\_manager: Check segments prior to mkfs ([pr#64771](https://github.com/ceph/ceph/pull/64771), Matan Breizman)

- crimson/os/seastore/transaction\_manager: Cache::retire\_absent\_extent\_addr should be called immediately after TransactionManager::get\_extent\_if\_linked if necessary ([pr#63218](https://github.com/ceph/ceph/pull/63218), Xuehan Xu, Yingxin Cheng)

- crimson/os/seastore/transaction\_manager: read\_pin\_by\_type read the whole extent if it's not fully loaded ([pr#65424](https://github.com/ceph/ceph/pull/65424), Xuehan Xu)

- crimson/os/seastore: adaptive cleaner thresholds from observed workload ([pr#69083](https://github.com/ceph/ceph/pull/69083), Shai Fultheim)

- crimson/os/seastore: Add progress logging to transaction processing ([pr#67024](https://github.com/ceph/ceph/pull/67024), Aishwarya Mathuria)

- crimson/os/seastore: add retire alloc remarks for backref extents to skip replay invalid deltas ([pr#65061](https://github.com/ceph/ceph/pull/65061), Zhang Song)

- crimson/os/seastore: add support for OP\_SPLIT\_COLLECTION2 ([pr#64626](https://github.com/ceph/ceph/pull/64626), Xuehan Xu)

- crimson/os/seastore: auto-tune cleaner gc segment pick under random-write ([pr#68964](https://github.com/ceph/ceph/pull/68964), Shai Fultheim)

- crimson/os/seastore: cleanup CachedExtent::extent\_state\_t and related logic ([pr#63389](https://github.com/ceph/ceph/pull/63389), Yingxin Cheng)

- crimson/os/seastore: correct possible mergeable size for ool extents ([pr#65166](https://github.com/ceph/ceph/pull/65166), Myoungwon Oh)

- crimson/os/seastore: destroy Transaction only when no other reference exists ([pr#68630](https://github.com/ceph/ceph/pull/68630), Xuehan Xu)

- crimson/os/seastore: do not treat non-ZNS devices as errors ([pr#68358](https://github.com/ceph/ceph/pull/68358), Ronen Friedman)

- crimson/os/seastore: drop backrefs in cases of pure rbm seastores ([pr#66740](https://github.com/ceph/ceph/pull/66740), Xuehan Xu)

- crimson/os/seastore: enforce capacity in RBMCleaner::try\_reserve\_projected\_usage ([pr#69153](https://github.com/ceph/ceph/pull/69153), Shai Fultheim)

- crimson/os/seastore: fix cleaner space leak from shadowed result list ([pr#68949](https://github.com/ceph/ceph/pull/68949), Shai Fultheim)

- crimson/os/seastore: fix cleaner stall under IO-block pressure ([pr#68961](https://github.com/ceph/ceph/pull/68961), Shai Fultheim)

- crimson/os/seastore: fix do\_transaction\_no\_callbacks logs ([pr#66406](https://github.com/ceph/ceph/pull/66406), Matan Breizman)

- crimson/os/seastore: fix incorrect total space reporting when using multiple shards in RBM ([pr#64703](https://github.com/ceph/ceph/pull/64703), Myoungwon Oh)

- crimson/os/seastore: fix laddr\_t formatter and its use ([pr#70340](https://github.com/ceph/ceph/pull/70340), Ronen Friedman)

- crimson/os/seastore: fix WITH\_ZNS builds ([pr#68270](https://github.com/ceph/ceph/pull/68270), Ronen Friedman)

- crimson/os/seastore: force rewrite transactions to conflict with others if it involve insertions on the lba tree ([pr#69044](https://github.com/ceph/ceph/pull/69044), Xuehan Xu)

- crimson/os/seastore: handle enoent in SeaStore::Shard::stat ([pr#68333](https://github.com/ceph/ceph/pull/68333), Lumir Sliva)

- crimson/os/seastore: increase OI\_MAX\_LENGTH to avoid storing OI data in the omap tree ([pr#63459](https://github.com/ceph/ceph/pull/63459), Myoungwon Oh)

- crimson/os/seastore: introduce 2Q cache replacement algorithm ([pr#64060](https://github.com/ceph/ceph/pull/64060), Zhang Song)

- crimson/os/seastore: introduce BtreeCursor to simplify the implementation of LBAMapping/BackrefMapping ([pr#62071](https://github.com/ceph/ceph/pull/62071), Zhang Song, Xuehan Xu)

- crimson/os/seastore: Introduce LogStoreManager ([pr#64439](https://github.com/ceph/ceph/pull/64439), Myoungwon Oh)

- crimson/os/seastore: introduce static layout of laddr\_t ([pr#59476](https://github.com/ceph/ceph/pull/59476), Xuehan Xu, Zhang Song)

- crimson/os/seastore: introduce with\_repeat\_trans\_intr ([pr#64812](https://github.com/ceph/ceph/pull/64812), Matan Breizman)

- crimson/os/seastore: LBACursor based LBAManager/TM interfaces and the related ObjectDataHandler refactor ([pr#62513](https://github.com/ceph/ceph/pull/62513), Xuehan Xu)

- crimson/os/seastore: link RetiredExtentPlaceholder up to lba leaf nodes ([pr#64828](https://github.com/ceph/ceph/pull/64828), Xuehan Xu)

- crimson/os/seastore: make the common write case the fast path in logmanager ([pr#68132](https://github.com/ceph/ceph/pull/68132), Myoungwon Oh)

- crimson/os/seastore: OP\_CLONERANGE2 support ---- another approach ([pr#65134](https://github.com/ceph/ceph/pull/65134), Xuehan Xu)

- crimson/os/seastore: optimize omap\_rm\_key\_range ([pr#65157](https://github.com/ceph/ceph/pull/65157), chunmei liu, Chunmei Liu)

- crimson/os/seastore: Prepare no invalidation to LBA user txns ([pr#68127](https://github.com/ceph/ceph/pull/68127), Matan Breizman)

- crimson/os/seastore: remove an extra continuation in delta-overwrite path ([pr#68340](https://github.com/ceph/ceph/pull/68340), Myoungwon Oh)

- crimson/os/seastore: remove RetiredExtentPlaceholder ([pr#69045](https://github.com/ceph/ceph/pull/69045), Xuehan Xu)

- crimson/os/seastore: SegmentManager::get\_segment\_manager() cleanups ([pr#68839](https://github.com/ceph/ceph/pull/68839), Kefu Chai)

- crimson/os/seastore: update extent states from pending to stable upon prepare\_record() ([pr#63972](https://github.com/ceph/ceph/pull/63972), Yingxin Cheng)

- crimson/os/seastore: write "seastore block device" signature in write\_superblock ([pr#64333](https://github.com/ceph/ceph/pull/64333), Mohit Agrawal)

- crimson/os/seastrore/omap\_manager: initialize rewritten omap nodes when ([pr#64355](https://github.com/ceph/ceph/pull/64355), Xuehan Xu)

- crimson/os: fix multiple compile-time warnings on unused variables ([pr#67088](https://github.com/ceph/ceph/pull/67088), Radoslaw Zarzynski)

- crimson/os: implement OP\_MERGE\_COLLECTION ([pr#68750](https://github.com/ceph/ceph/pull/68750), Kefu Chai)

- crimson/osd,qa: support and test the 'assert' ASOK command ([pr#68880](https://github.com/ceph/ceph/pull/68880), Ronen Friedman)

- crimson/osd,qa: support OSD memory size in the OSD and in QA suites ([pr#68725](https://github.com/ceph/ceph/pull/68725), Ronen Friedman)

- crimson/osd/<span></span>.<span></span>./client\_request: fix is\_misdirected ([pr#64503](https://github.com/ceph/ceph/pull/64503), Matan Breizman)

- crimson/osd/osd<span></span>.cc: add osd\_objectstore to OSD metadata ([pr#67817](https://github.com/ceph/ceph/pull/67817), Shraddha Agrawal)

- crimson/osd/osd\_operations/client\_request: rely on the checks in PG::do\_recover\_missing() to determine whether to recover clone objects ([pr#65283](https://github.com/ceph/ceph/pull/65283), Xuehan Xu)

- crimson/osd/pg: create "submit\_lock" unlocker before locking it ([pr#65616](https://github.com/ceph/ceph/pull/65616), Xuehan Xu)

- crimson/osd/pg: drop inappropriate assertions ([pr#67697](https://github.com/ceph/ceph/pull/67697), Xuehan Xu)

- crimson/osd/pg: set log\_entry\_update\_waiting\_on prior to sending requests ([pr#63233](https://github.com/ceph/ceph/pull/63233), Matan Breizman)

- crimson/osd/pg: skip replicas that's still missing the object being ([pr#68533](https://github.com/ceph/ceph/pull/68533), Xuehan Xu)

- crimson/osd/pg: tolerate NULL PG::pglog\_based\_recovery\_op when cancelling pglog based recovery ([pr#65353](https://github.com/ceph/ceph/pull/65353), Xuehan Xu)

- crimson/osd/pg\_backend: needn't check if os<span></span>.exist ([pr#63144](https://github.com/ceph/ceph/pull/63144), Chunmei Liu)

- crimson/osd/pg\_backend: tolerate enoent for both head and clone when doing rollback ([pr#65317](https://github.com/ceph/ceph/pull/65317), Xuehan Xu)

- crimson/osd/pg\_recovery: call MOSDPGRecoveryDelete instead of MOSDPGBackfillRemove ([pr#67925](https://github.com/ceph/ceph/pull/67925), Shraddha Agrawal)

- crimson/osd/pg\_recovery: call on\_global\_recover on the "recover deleted" object when it's not missing on the primary too ([pr#67866](https://github.com/ceph/ceph/pull/67866), Xuehan Xu)

- crimson/osd/pg\_recovery: only reset\_pglog\_based\_recovery\_op if complete ([pr#63215](https://github.com/ceph/ceph/pull/63215), Samuel Just)

- crimson/osd/pg\_recovery: rework start\_recovery\_ops ([pr#62847](https://github.com/ceph/ceph/pull/62847), Matan Breizman)

- crimson/osd/recovery\_backend: interrupt all recovery\_waiter unconditionally when cleaning up the recovery backend ([pr#65234](https://github.com/ceph/ceph/pull/65234), Xuehan Xu)

- crimson/osd/recovery\_backend: scan\_for\_backfill\_primary correctly handle missing object ([pr#63035](https://github.com/ceph/ceph/pull/63035), Matan Breizman)

- Crimson/osd/snap-mapper: flush pending writes on pg interval change ([pr#68796](https://github.com/ceph/ceph/pull/68796), Ronen Friedman)

- crimson/osd: acquire throttle when scanning replica/primary for backfill ([pr#68386](https://github.com/ceph/ceph/pull/68386), Kefu Chai)

- crimson/osd: add debug logs for snaptrim and scrub background\_process\_lock ([pr#69240](https://github.com/ceph/ceph/pull/69240), Aishwarya Mathuria)

- crimson/osd: add verbose DEBUG logs for OSD startup ([pr#67090](https://github.com/ceph/ceph/pull/67090), Shraddha Agrawal)

- crimson/osd: add warning log for stray pgmeta-like objects ([pr#67929](https://github.com/ceph/ceph/pull/67929), Myoungwon Oh)

- crimson/osd: Admin Socket fixes ([pr#63523](https://github.com/ceph/ceph/pull/63523), Matan Breizman)

- crimson/osd: always ask for the newest osdmap ([pr#65726](https://github.com/ceph/ceph/pull/65726), Xuehan Xu)

- crimson/osd: avoid calling get\_sharded\_store() for obj size ([pr#69256](https://github.com/ceph/ceph/pull/69256), Ronen Friedman)

- crimson/osd: bring support for EC, including recovery ([pr#57395](https://github.com/ceph/ceph/pull/57395), Radoslaw Zarzynski, Radosław Zarzyński)

- crimson/osd: committed/handle\_osd\_maps into coroutines ([pr#63555](https://github.com/ceph/ceph/pull/63555), Matan Breizman)

- crimson/osd: decouple snap trim initiation from scrub completion ([pr#68948](https://github.com/ceph/ceph/pull/68948), Ronen Friedman)

- crimson/osd: defer snap trimming while scrubbing ([pr#68735](https://github.com/ceph/ceph/pull/68735), Ronen Friedman)

- crimson/osd: drop redundant trailing co\_return in pg\_advance\_map ([pr#68876](https://github.com/ceph/ceph/pull/68876), Kefu Chai)

- crimson/osd: fix assertion fail in prepare\_clone ([pr#65465](https://github.com/ceph/ceph/pull/65465), Kautilya Tripathi)

- crimson/osd: fix backfill deadlock when only drop operations remain ([pr#70343](https://github.com/ceph/ceph/pull/70343), Ronen Friedman)

- crimson/osd: fix incorrect format error in log message ([pr#63460](https://github.com/ceph/ceph/pull/63460), Myoungwon Oh)

- crimson/osd: fix mark-down crash for removed OSDs ([pr#68884](https://github.com/ceph/ceph/pull/68884), Kefu Chai)

- crimson/osd: fix PG splitting logic during map gaps ([pr#67225](https://github.com/ceph/ceph/pull/67225), Aishwarya Mathuria)

- crimson/osd: fix PGBackend::remove() to return ENOENT on no-op deletes ([pr#69539](https://github.com/ceph/ceph/pull/69539), Ronen Friedman)

- crimson/osd: fix race between AllReplicasRecovered and DeferRecovery ([pr#68383](https://github.com/ceph/ceph/pull/68383), Aishwarya Mathuria)

- crimson/osd: fix wrong log arguments in get\_option\_value and \_get\_early\_config ([pr#68090](https://github.com/ceph/ceph/pull/68090), Kefu Chai)

- crimson/osd: give each split child its own PeeringCtx ([pr#69120](https://github.com/ceph/ceph/pull/69120), Kefu Chai)

- crimson/osd: guard recovery clone overlap with try\_lock\_for\_read ([pr#70197](https://github.com/ceph/ceph/pull/70197), Kautilya Tripathi)

- crimson/osd: inline log file stream setup to fix dangling pointer ([pr#68861](https://github.com/ceph/ceph/pull/68861), Matan Breizman, Kefu Chai)

- crimson/osd: make load\_obc(obc, md\_ref) return void ([pr#68200](https://github.com/ceph/ceph/pull/68200), Kefu Chai)

- crimson/osd: make PGAdvanceMap idempotent ([pr#68823](https://github.com/ceph/ceph/pull/68823), Kefu Chai)

- crimson/osd: move to a unified on-device super-block structure ([pr#68341](https://github.com/ceph/ceph/pull/68341), Ronen Friedman)

- crimson/osd: only unblock wait\_for\_active\_blocker on replica when ACTIVE ([pr#69020](https://github.com/ceph/ceph/pull/69020), Kefu Chai)

- crimson/osd: pg splitting fixes ([pr#65165](https://github.com/ceph/ceph/pull/65165), Aishwarya Mathuria)

- crimson/osd: put PGBackend/RecoveryBackend/PGRecovery and other related classes into the crimson::osd  namespace ([pr#64275](https://github.com/ceph/ceph/pull/64275), Xuehan Xu)

- crimson/osd: skip PGAdvanceMap on a deleted PG ([pr#68814](https://github.com/ceph/ceph/pull/68814), Aishwarya Mathuria)

- crimson/osd: use O\_CLOEXEC with pipe2() in get\_early\_config ([pr#68223](https://github.com/ceph/ceph/pull/68223), Kefu Chai)

- crimson/osd: wake pgs\_creating waiters in PGMap::pg\_loaded() ([pr#69019](https://github.com/ceph/ceph/pull/69019), Kefu Chai)

- crimson/rgw: Fix clang compiler warnings ([pr#65791](https://github.com/ceph/ceph/pull/65791), Alex Ainscow)

- crimson/scrub: fix assert in PGScrubber::release\_range() on interval change ([pr#69064](https://github.com/ceph/ceph/pull/69064), Kefu Chai)

- crimson/seastore: avoid using 'final' to mean 'override' ([pr#68201](https://github.com/ceph/ceph/pull/68201), Ronen Friedman)

- crimson/seastore: batch same-collection transactions ([pr#70792](https://github.com/ceph/ceph/pull/70792), Matan Breizman)

- crimson/seastore: clamp block\_size to laddr\_t::UNIT\_SIZE on small-LBA devices ([pr#69006](https://github.com/ceph/ceph/pull/69006), Kefu Chai)

- crimson/seastore: fixing some 'unused' warnings ([pr#67484](https://github.com/ceph/ceph/pull/67484), Ronen Friedman)

- crimson/seastore: make RecordSubmitter::wait\_available() idempotent ([pr#69121](https://github.com/ceph/ceph/pull/69121), Kefu Chai)

- crimson/seastore: reject oversized writes and zeros instead of aborting ([pr#69018](https://github.com/ceph/ceph/pull/69018), Kefu Chai)

- crimson/seastore: segment\_manager: fix -Wunused warnings ([pr#69122](https://github.com/ceph/ceph/pull/69122), Kefu Chai)

- crimson/seastore: use DMA alignment for block size instead of stat ([pr#65869](https://github.com/ceph/ceph/pull/65869), Kefu Chai)

- crimson/seatore: rework lba\_manager to use LBACursor rather than LBAMapping ([pr#66245](https://github.com/ceph/ceph/pull/66245), Samuel Just)

- crimson/test: chain invoke\_on\_all() future instead of calling get() ([pr#69288](https://github.com/ceph/ceph/pull/69288), Ronen Friedman)

- crimson/test: rm 'assert's in test\_object\_data\_handlers<span></span>.cc ([pr#68212](https://github.com/ceph/ceph/pull/68212), Ronen Friedman)

- crimson/tests: emit success message in unittest-seastar-alienstore-thread-pool ([pr#69268](https://github.com/ceph/ceph/pull/69268), Ronen Friedman)

- crimson/tests: fix test\_remap\_pin\_concurrent ([pr#68489](https://github.com/ceph/ceph/pull/68489), Ronen Friedman)

- crimson/tool/crimson-store-bench: rework command line parsing, other fixes ([pr#65018](https://github.com/ceph/ceph/pull/65018), Samuel Just, Matan Breizman)

- crimson: add missing includes ([pr#68790](https://github.com/ceph/ceph/pull/68790), Max Kellermann)

- crimson: Add objectstore tool with partial functionality ([pr#63604](https://github.com/ceph/ceph/pull/63604), Matan Breizman, junxiang Mu)

- crimson: add pg subcommands support in CLI ([pr#66993](https://github.com/ceph/ceph/pull/66993), Kautilya Tripathi)

- crimson: admin: fix FTBFS with gcc 15 ([pr#65707](https://github.com/ceph/ceph/pull/65707), Duncan Bellamy)

- crimson: bump defaults to be more appropriate ([pr#63138](https://github.com/ceph/ceph/pull/63138), Samuel Just)

- crimson: clean ups in main\_config\_bootstrap\_helpers<span></span>.cc ([pr#68130](https://github.com/ceph/ceph/pull/68130), Kefu Chai)

- crimson: fix building without systemd ([pr#65700](https://github.com/ceph/ceph/pull/65700), Duncan Bellamy)

- crimson: fix dump\_metrics skipping metrics argument ([pr#67186](https://github.com/ceph/ceph/pull/67186), Jose J Palacios-Perez)

- crimson: fix unused variable warnings due to assert() and NDEBUG builds ([pr#62894](https://github.com/ceph/ceph/pull/62894), Radoslaw Zarzynski)

- crimson: further improvements to store-bench ([pr#65215](https://github.com/ceph/ceph/pull/65215), Samuel Just)

- crimson: Implement a  lock\_excl\_wait wrapper ([pr#65849](https://github.com/ceph/ceph/pull/65849), Mohit Agrawal)

- crimson: implement crimson Omap iterate interface ([pr#62530](https://github.com/ceph/ceph/pull/62530), chunmei liu, Chunmei Liu)

- crimson: osd\_operation cleanups and fix for MOSDRepOpReply ordering ([pr#62836](https://github.com/ceph/ceph/pull/62836), Samuel Just)

- crimson: PG backfill is not showing any progress ([pr#62760](https://github.com/ceph/ceph/pull/62760), Radoslaw Zarzynski, Mohit Agrawal)

- crimson: remove redundant comments and improve comment so it's more accurate ([pr#68093](https://github.com/ceph/ceph/pull/68093), Kefu Chai)

- crimson: replace assert\_all class with a format-safe function template ([pr#69137](https://github.com/ceph/ceph/pull/69137), Kefu Chai)

- crimson: Simplify first time deployments ([pr#65007](https://github.com/ceph/ceph/pull/65007), Matan Breizman, Neha Ojha)

- crimson: simplify vstart crimson-osd reactor pinning ([pr#63137](https://github.com/ceph/ceph/pull/63137), Samuel Just)

- crimson: Support mclock for crimson ([pr#62002](https://github.com/ceph/ceph/pull/62002), Mohit Agrawal)

- crimson: switch to ceph\_abort\_msg ([pr#64262](https://github.com/ceph/ceph/pull/64262), Matan Breizman)

- crimson: Use osd\_objectstore instead of using crimson\_osd\_objectstore ([pr#63817](https://github.com/ceph/ceph/pull/63817), Mohit Agrawal)

- crush/mapper: Mark pushed variable as maybe unused ([pr#64970](https://github.com/ceph/ceph/pull/64970), Edwin Rodriguez)

- crushtool: init with CINIT\_FLAG\_NO\_DAEMON\_ACTIONS ([pr#63092](https://github.com/ceph/ceph/pull/63092), Bill Scales)

- d4n: Update suite and test programs ([pr#66070](https://github.com/ceph/ceph/pull/66070), Samarah, Samarah Uriarte)

- dashboard: add location field to NVMeoF namespace and gateway group APIs ([pr#67400](https://github.com/ceph/ceph/pull/67400), Victoria Mackie)

- dashboard: align 'no notifications available' icon in notifications page ([pr#67744](https://github.com/ceph/ceph/pull/67744), Shashiranjan Singh, Shashiranjan singh)

- dashboard: align notifications footer to bottom when body has fewer items ([pr#67787](https://github.com/ceph/ceph/pull/67787), Shashiranjan singh)

- dashboard: ensure nodeenv downloaded content is owned by current user ([pr#63099](https://github.com/ceph/ceph/pull/63099), John Mulligan)

- dashboard: fix notification icon alignment with timestamp in notification panel ([pr#67679](https://github.com/ceph/ceph/pull/67679), Shashiranjan Singh)

- dashboard: fix the workaround for unpacking node sources ([pr#63435](https://github.com/ceph/ceph/pull/63435), John Mulligan)

- dashboard: use metadata = event<span></span>.get('refs', {}) instead of dict(event… ([pr#67901](https://github.com/ceph/ceph/pull/67901), Aarti Dhikale)

- deb/cephadm: add explicit --home for cephadm user ([pr#64459](https://github.com/ceph/ceph/pull/64459), Casey Bodley)

- deb/cephadm: Don't assume a home directory is configured ([pr#66394](https://github.com/ceph/ceph/pull/66394), Elliot Courant)

- deb/mgr: remove deprecated distutils from ceph-mgr<span></span>.requires ([pr#64386](https://github.com/ceph/ceph/pull/64386), Casey Bodley)

- deb: use glob match to support systemd unit dir changes ([pr#64001](https://github.com/ceph/ceph/pull/64001), Kefu Chai)

- debian,ceph<span></span>.spec: fix ceph-osd upgrade conflicts ([pr#66568](https://github.com/ceph/ceph/pull/66568), Matan Breizman)

- debian,ceph<span></span>.spec: split ceph-osd into shared base and implementation packages ([pr#65782](https://github.com/ceph/ceph/pull/65782), Matan Breizman, Kefu Chai)

- debian,rpm: split ceph-mgr-modules-core into per-module packages ([pr#68989](https://github.com/ceph/ceph/pull/68989), Kefu Chai)

- debian/control: add iproute2 to build dependencies ([pr#66732](https://github.com/ceph/ceph/pull/66732), Kefu Chai)

- debian/control: Add libxsimd-dev build dependency for vendored Arrow ([pr#65935](https://github.com/ceph/ceph/pull/65935), Kefu Chai)

- debian/control: install libnuma-dev unconditionally ([pr#65103](https://github.com/ceph/ceph/pull/65103), Dan Mick)

- debian/control: record python3-packaging dependency for ceph-volume ([pr#66528](https://github.com/ceph/ceph/pull/66528), Thomas Lamprecht, Max R. Carrara)

- debian/rules: Also exclude librgw and radosgw from dwz ([pr#70265](https://github.com/ceph/ceph/pull/70265), David Galloway)

- debian/rules: exclude ceph-osd-crimson from dwz compression ([pr#70261](https://github.com/ceph/ceph/pull/70261), Kefu Chai)

- debian/rules: strip ceph-osd-classic and ceph-osd-crimson ([pr#68997](https://github.com/ceph/ceph/pull/68997), Kefu Chai)

- debian: drop explicit libprotobuf dependency from ceph-osd-crimson ([pr#68857](https://github.com/ceph/ceph/pull/68857), Kefu Chai)

- debian: enable crimson packages ([pr#69212](https://github.com/ceph/ceph/pull/69212), Shraddha Agrawal)

- debian: include rgw-gap-list manpage and rgw-policy-check in ceph-common ([pr#65739](https://github.com/ceph/ceph/pull/65739), Kefu Chai)

- debian: package manpage for cephfs-top ([pr#68799](https://github.com/ceph/ceph/pull/68799), Kefu Chai)

- debian: package mgr/smb in ceph-mgr-modules-core ([pr#67133](https://github.com/ceph/ceph/pull/67133), Roland Sommer)

- debian: radosgw: add media-types packages as alternative for mime-support ([pr#63702](https://github.com/ceph/ceph/pull/63702), Thomas Lamprecht)

- debian: remove invoke-rc<span></span>.d calls from postrm scripts ([pr#66352](https://github.com/ceph/ceph/pull/66352), Kefu Chai)

- debian: remove stale distutils override from py3dist-overrides ([pr#68255](https://github.com/ceph/ceph/pull/68255), Thomas Lamprecht, Max R. Carrara, Kefu Chai)

- dependabot: stop dashboard npm upgrade PRs ([pr#64811](https://github.com/ceph/ceph/pull/64811), Ernesto Puerta)

- developer: Add name to maps ([pr#66657](https://github.com/ceph/ceph/pull/66657), Ashwin M. Joshi)

- do\_cmake<span></span>.sh: remove --progress, it's just noise ([pr#63171](https://github.com/ceph/ceph/pull/63171), Dan Mick)

- doc,qa: remove references to ceph-deploy ([pr#67822](https://github.com/ceph/ceph/pull/67822), Patrick Donnelly)

- doc/\_ext: cleanups ([pr#64158](https://github.com/ceph/ceph/pull/64158), Kefu Chai)

- doc/\_ext: fix ceph\_commands<span></span>.py for new decorator-based command system ([pr#67254](https://github.com/ceph/ceph/pull/67254), Kefu Chai)

- doc/\_ext: unbreak releases timeline if other than 3 active releases ([pr#66903](https://github.com/ceph/ceph/pull/66903), Ville Ojamo)

- doc/ceph-volume: Fix spelling etc errors ([pr#68115](https://github.com/ceph/ceph/pull/68115), Ville Ojamo)

- doc/ceph<span></span>.rst: scrub-related 'tell pgid' commands ([pr#66626](https://github.com/ceph/ceph/pull/66626), Ronen Friedman)

- doc/cephadm/services: Clarify service discovery auth in monitoring<span></span>.rst ([pr#66060](https://github.com/ceph/ceph/pull/66060), Dudy)

- doc/cephadm/services: Improve formatting and small fixes in index<span></span>.rst ([pr#64744](https://github.com/ceph/ceph/pull/64744), Ville Ojamo)

- doc/cephadm: Correct formatting in upgrade<span></span>.rst ([pr#63139](https://github.com/ceph/ceph/pull/63139), Anthony D'Atri)

- doc/cephadm: correct markup in rgw<span></span>.rst ([pr#63060](https://github.com/ceph/ceph/pull/63060), Zac Dover)

- doc/cephadm: edit host-management<span></span>.rst ([pr#63613](https://github.com/ceph/ceph/pull/63613), Zac Dover)

- doc/cephadm: Fix automodule generation in certmgr<span></span>.rst ([pr#63328](https://github.com/ceph/ceph/pull/63328), Ville Ojamo)

- doc/cephadm: Fix command plus improvements in services/mgmt-gateway<span></span>.rst ([pr#66382](https://github.com/ceph/ceph/pull/66382), Ville Ojamo)

- doc/cephadm: Fix errors and improvements in services/monitoring<span></span>.rst ([pr#65536](https://github.com/ceph/ceph/pull/65536), Ville Ojamo)

- doc/cephadm: Fix formatting errors and improvements in osd<span></span>.rst ([pr#66677](https://github.com/ceph/ceph/pull/66677), Ville Ojamo)

- doc/cephadm: Fix more spelling errors ([pr#67812](https://github.com/ceph/ceph/pull/67812), Ville Ojamo)

- doc/cephadm: Fix spelling errors ([pr#67770](https://github.com/ceph/ceph/pull/67770), Ville Ojamo)

- doc/cephadm: fix typo and missing quote in activate-existing-osds ([pr#69246](https://github.com/ceph/ceph/pull/69246), Emmanuel Ameh)

- doc/cephadm: fix upgrade ordering ([pr#63433](https://github.com/ceph/ceph/pull/63433), Pierre Riteau)

- doc/cephadm: improve "Maintenance Mode" ([pr#62600](https://github.com/ceph/ceph/pull/62600), Zac Dover)

- doc/cephadm: more improvements to install<span></span>.rst ([pr#66899](https://github.com/ceph/ceph/pull/66899), Ville Ojamo)

- doc/cephadm: small improvements ([pr#66830](https://github.com/ceph/ceph/pull/66830), Ville Ojamo)

- doc/cephadm: small improvements continued ([pr#66862](https://github.com/ceph/ceph/pull/66862), Ville Ojamo)

- doc/cephadm: Small improvements in services/tracing<span></span>.rst ([pr#64808](https://github.com/ceph/ceph/pull/64808), Ville Ojamo)

- doc/cephadm: small improvements to host-management<span></span>.rst ([pr#66835](https://github.com/ceph/ceph/pull/66835), Ville Ojamo)

- doc/cephadm: small improvements to install<span></span>.rst ([pr#66836](https://github.com/ceph/ceph/pull/66836), Ville Ojamo)

- doc/cephadm: small improvements to operations<span></span>.rst ([pr#66841](https://github.com/ceph/ceph/pull/66841), Ville Ojamo)

- doc/cephadm: small improvements to services/index<span></span>.rst ([pr#66833](https://github.com/ceph/ceph/pull/66833), Ville Ojamo)

- doc/cephadm: small improvements to troubleshooting<span></span>.rst ([pr#66858](https://github.com/ceph/ceph/pull/66858), Ville Ojamo)

- doc/cephadm: small improvements to upgrade<span></span>.rst ([pr#66859](https://github.com/ceph/ceph/pull/66859), Ville Ojamo)

- doc/cephfs/createfs: Recommend default data pool on SSDs for non-EC ([pr#65920](https://github.com/ceph/ceph/pull/65920), Niklas Hambüchen)

- doc/cephfs/fs-volumes<span></span>.rst: Correct volume creation with pre-existing pools ([pr#68211](https://github.com/ceph/ceph/pull/68211), adatri)

- doc/cephfs: add fscrypt to index<span></span>.rst ([pr#66712](https://github.com/ceph/ceph/pull/66712), Zac Dover)

- doc/cephfs: Add missing labels in cache-configuration<span></span>.rst ([pr#65811](https://github.com/ceph/ceph/pull/65811), Ville Ojamo)

- doc/cephfs: add snapshot name note ([pr#63083](https://github.com/ceph/ceph/pull/63083), Patrick Donnelly)

- doc/cephfs: correct ill-formatted command ([pr#63464](https://github.com/ceph/ceph/pull/63464), Zac Dover)

- doc/cephfs: correct reference structure in fs-volumes<span></span>.rst ([pr#63254](https://github.com/ceph/ceph/pull/63254), Zac Dover)

- doc/cephfs: Cosmetic changes and small fixes in cephfs-mirroring<span></span>.rst ([pr#63371](https://github.com/ceph/ceph/pull/63371), Ville Ojamo)

- doc/cephfs: document first-damage<span></span>.py ([pr#63951](https://github.com/ceph/ceph/pull/63951), Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (1 of x) ([pr#64690](https://github.com/ceph/ceph/pull/64690), Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (2 of x) ([pr#64737](https://github.com/ceph/ceph/pull/64737), Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (3 of x) ([pr#64766](https://github.com/ceph/ceph/pull/64766), Zac Dover)

- doc/cephfs: edit disaster-recovery<span></span>.rst ([pr#64640](https://github.com/ceph/ceph/pull/64640), Zac Dover)

- doc/cephfs: edit disaster-recovery<span></span>.rst ([pr#64604](https://github.com/ceph/ceph/pull/64604), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65325](https://github.com/ceph/ceph/pull/65325), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64929](https://github.com/ceph/ceph/pull/64929), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65021](https://github.com/ceph/ceph/pull/65021), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64940](https://github.com/ceph/ceph/pull/64940), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64931](https://github.com/ceph/ceph/pull/64931), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64928](https://github.com/ceph/ceph/pull/64928), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64921](https://github.com/ceph/ceph/pull/64921), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64939](https://github.com/ceph/ceph/pull/64939), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64981](https://github.com/ceph/ceph/pull/64981), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64930](https://github.com/ceph/ceph/pull/64930), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64923](https://github.com/ceph/ceph/pull/64923), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64922](https://github.com/ceph/ceph/pull/64922), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64982](https://github.com/ceph/ceph/pull/64982), Zac Dover, Venky Shankar)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64876](https://github.com/ceph/ceph/pull/64876), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64881](https://github.com/ceph/ceph/pull/64881), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64869](https://github.com/ceph/ceph/pull/64869), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64854](https://github.com/ceph/ceph/pull/64854), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64832](https://github.com/ceph/ceph/pull/64832), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst (Slow MDS) ([pr#65185](https://github.com/ceph/ceph/pull/65185), Zac Dover)

- doc/cephfs: fix docs for pause\_purging and pause\_cloning ([pr#66213](https://github.com/ceph/ceph/pull/66213), Rishabh Dave)

- doc/cephfs: Fix spelling etc errors ([pr#67853](https://github.com/ceph/ceph/pull/67853), Ville Ojamo)

- doc/cephfs: Fix Sphinx warnings and other minor improvements ([pr#65909](https://github.com/ceph/ceph/pull/65909), Ville Ojamo)

- doc/cephfs: Improve formatting in mantle<span></span>.rst ([pr#63919](https://github.com/ceph/ceph/pull/63919), Ville Ojamo)

- doc/cephfs: Improve mount-using-fuse<span></span>.rst ([pr#64462](https://github.com/ceph/ceph/pull/64462), Anthony D'Atri)

- doc/cephfs: Remove spaces from command ([pr#68271](https://github.com/ceph/ceph/pull/68271), Zac Dover)

- doc/cephfs: Small improvements in fscrypt<span></span>.rst ([pr#66416](https://github.com/ceph/ceph/pull/66416), Ville Ojamo)

- doc/cephfs: specify mount path in example command ([pr#63309](https://github.com/ceph/ceph/pull/63309), Joshua Blanch)

- doc/cephfs: Typos and small improvements in scrub<span></span>.rst ([pr#65809](https://github.com/ceph/ceph/pull/65809), Ville Ojamo)

- doc/cephfs: update cephfs disaster recovery documentation ([issue#71629](http://tracker.ceph.com/issues/71629), [pr#64787](https://github.com/ceph/ceph/pull/64787), Venky Shankar, Zac Dover)

- doc/cephfs: Update deprecation notice in experimental-features<span></span>.rst ([pr#63918](https://github.com/ceph/ceph/pull/63918), Ville Ojamo)

- doc/cephfs: Update quota<span></span>.rst ([pr#65051](https://github.com/ceph/ceph/pull/65051), Jannis Speer, Zac Dover)

- doc/dev/cephfs-mirroring: edit file 1 of x ([pr#63256](https://github.com/ceph/ceph/pull/63256), Zac Dover)

- doc/dev/cephfs-mirroring: edit file 2 of x ([pr#63259](https://github.com/ceph/ceph/pull/63259), Zac Dover)

- doc/dev/cephfs-mirroring: edit file 3 of x ([pr#63275](https://github.com/ceph/ceph/pull/63275), Zac Dover)

- doc/dev/cephfs-mirroring: edit file 4 of x ([pr#63632](https://github.com/ceph/ceph/pull/63632), Zac Dover)

- doc/dev/config: Document how to use :confval: directive for config options ([pr#64160](https://github.com/ceph/ceph/pull/64160), Kefu Chai)

- doc/dev/crimson: Update Seastore docs ([pr#66798](https://github.com/ceph/ceph/pull/66798), Matan Breizman)

- doc/dev/internals: Improve Ceph Internals TOC ([pr#68991](https://github.com/ceph/ceph/pull/68991), Bill Scales)

- doc/dev/release-checklist: check v21<span></span>.0<span></span>.0 tag ([pr#68023](https://github.com/ceph/ceph/pull/68023), Radoslaw Zarzynski)

- doc/dev: add sequence diagrams back to health-reports<span></span>.rst ([pr#67130](https://github.com/ceph/ceph/pull/67130), Ville Ojamo)

- doc/dev: document exact CRC parameters for crc32c used in msgr2 ([pr#66641](https://github.com/ceph/ceph/pull/66641), Johannes Cornelis Draaijer)

- doc/dev: fix release cycle diagram and missing text ([pr#68931](https://github.com/ceph/ceph/pull/68931), Ville Ojamo)

- doc/dev: Fix Sphinx complaints in msgr2<span></span>.rst ([pr#66784](https://github.com/ceph/ceph/pull/66784), Ville Ojamo)

- doc/dev: fix suite sample layout example ([pr#66005](https://github.com/ceph/ceph/pull/66005), Kyr Shatskyy)

- doc/dev: fix typo in basic-workflow<span></span>.rst ([pr#68080](https://github.com/ceph/ceph/pull/68080), Lumir Sliva)

- doc/dev: Fix typo in release-process<span></span>.rst ([pr#65819](https://github.com/ceph/ceph/pull/65819), Yuri Weinstein)

- doc/dev: fix typos in running-tests-locally<span></span>.rst ([pr#68081](https://github.com/ceph/ceph/pull/68081), Lumir Sliva)

- doc/dev: improve formatting and clarify documentation ([pr#66747](https://github.com/ceph/ceph/pull/66747), Johannes Cornelis Draaijer)

- doc/dev: Improvements to health-reports<span></span>.rst (1 of 2) ([pr#66806](https://github.com/ceph/ceph/pull/66806), Ville Ojamo)

- doc/dev: refresh vstart<span></span>.sh options in dev\_cluster\_deployment ([pr#68946](https://github.com/ceph/ceph/pull/68946), Kefu Chai)

- doc/dev:update blkin<span></span>.rst doc for lttng trace ([pr#65180](https://github.com/ceph/ceph/pull/65180), lizhipeng)

- doc/foundation: Update associate member representative ([pr#66087](https://github.com/ceph/ceph/pull/66087), Enrico Bocchi)

- doc/glossary: Add "CRC" to glossary ([pr#66705](https://github.com/ceph/ceph/pull/66705), Zac Dover)

- doc/glossary: s/OMAP/omap/ ([pr#63733](https://github.com/ceph/ceph/pull/63733), Zac Dover)

- doc/governance: remove Ken and Jeff from CSC ([pr#68780](https://github.com/ceph/ceph/pull/68780), Patrick Donnelly)

- doc/governance: remove Sam from CSC ([pr#68781](https://github.com/ceph/ceph/pull/68781), Patrick Donnelly)

- doc/governance: update Ceph Executive Council List ([pr#68779](https://github.com/ceph/ceph/pull/68779), Patrick Donnelly)

- doc/governance: Update governance<span></span>.rst to change the email id ([pr#68146](https://github.com/ceph/ceph/pull/68146), Vikhyat Umrao)

- doc/hardware-monitoring: improve index<span></span>.rst ([pr#68120](https://github.com/ceph/ceph/pull/68120), Ville Ojamo)

- doc/install: Linkify mention of ceph<span></span>.conf and use ref for links ([pr#64848](https://github.com/ceph/ceph/pull/64848), Ville Ojamo)

- doc/install: Small improvements in manual-freebsd-deployment<span></span>.rst ([pr#64874](https://github.com/ceph/ceph/pull/64874), Ville Ojamo)

- doc/man/8: Fix link in ceph-objectstore-tool<span></span>.rst ([pr#64792](https://github.com/ceph/ceph/pull/64792), Ville Ojamo)

- doc/man/8: Fix links in rgw-policy-check<span></span>.rst ([pr#64789](https://github.com/ceph/ceph/pull/64789), Ville Ojamo)

- doc/man/8: Fix small errors and small improvements in mount<span></span>.ceph<span></span>.rst ([pr#64727](https://github.com/ceph/ceph/pull/64727), Ville Ojamo)

- doc/man/8: Improve mount<span></span>.ceph<span></span>.rst ([pr#64726](https://github.com/ceph/ceph/pull/64726), Anthony D'Atri)

- doc/man/cephadm: update `--orphan-initial-daemons` argument description ([pr#65013](https://github.com/ceph/ceph/pull/65013), Naveen Naidu)

- doc/man: document ceph-bluestore-tool set-label-key and rm-label-key ([pr#71246](https://github.com/ceph/ceph/pull/71246), Akshay Nazare)

- doc/man: fix broken markup in cephadm<span></span>.rst ([pr#69014](https://github.com/ceph/ceph/pull/69014), Ville Ojamo)

- doc/man: Fix inline formatting in ceph-bluestore-tool<span></span>.rst ([pr#63330](https://github.com/ceph/ceph/pull/63330), Ville Ojamo)

- doc/man: fix invalid directive missing a second colon ([pr#66815](https://github.com/ceph/ceph/pull/66815), Ville Ojamo)

- doc/man: fix spelling etc errors (1 of 2) ([pr#68156](https://github.com/ceph/ceph/pull/68156), Ville Ojamo)

- doc/man: improve ceph<span></span>.rst ([pr#68151](https://github.com/ceph/ceph/pull/68151), Ville Ojamo)

- doc/man: Remove stale EOL release names from deprecation notices ([pr#69364](https://github.com/ceph/ceph/pull/69364), Emmanuel Ameh)

- doc/mgr/ceph\_api: edit index<span></span>.rst ([pr#63172](https://github.com/ceph/ceph/pull/63172), Zac Dover)

- doc/mgr/crash<span></span>.rst: remove outdated module enabling instructions ([pr#64239](https://github.com/ceph/ceph/pull/64239), Kefu Chai)

- doc/mgr/dashboard: add note that only RSA keys are supported for TLS ([pr#65731](https://github.com/ceph/ceph/pull/65731), Martin Koch)

- doc/mgr/dashboard: s/promt/prompt/ in dashboard<span></span>.rst ([pr#63252](https://github.com/ceph/ceph/pull/63252), Zac Dover)

- doc/mgr/dashboard\_plugins: edit feature\_toggles<span></span>.inc<span></span>.rst ([pr#63622](https://github.com/ceph/ceph/pull/63622), Zac Dover)

- doc/mgr/smb: document the 'provider' option for smb share ([pr#63088](https://github.com/ceph/ceph/pull/63088), Sachin Prabhu)

- doc/mgr/telemetry: add doc for telemetry upgrade tests ([pr#61543](https://github.com/ceph/ceph/pull/61543), Naveen Naidu)

- doc/mgr: edit administrator<span></span>.rst ([pr#63084](https://github.com/ceph/ceph/pull/63084), Zac Dover)

- doc/mgr: edit alerts<span></span>.rst ([pr#63173](https://github.com/ceph/ceph/pull/63173), Zac Dover)

- doc/mgr: edit cli\_api ([pr#63734](https://github.com/ceph/ceph/pull/63734), Zac Dover)

- doc/mgr: edit cli\_api<span></span>.rst ([pr#63195](https://github.com/ceph/ceph/pull/63195), Zac Dover)

- doc/mgr: edit crash<span></span>.rst ([pr#63255](https://github.com/ceph/ceph/pull/63255), Zac Dover)

- doc/mgr: edit dashboard<span></span>.rst ([pr#63301](https://github.com/ceph/ceph/pull/63301), Zac Dover)

- doc/mgr: edit debug<span></span>.inc<span></span>.rst ([pr#63365](https://github.com/ceph/ceph/pull/63365), Zac Dover)

- doc/mgr: edit diskpredictor<span></span>.rst ([pr#63369](https://github.com/ceph/ceph/pull/63369), Zac Dover)

- doc/mgr: edit feature\_toggles<span></span>.inc<span></span>.rst ([pr#63367](https://github.com/ceph/ceph/pull/63367), Zac Dover)

- doc/mgr: edit hello<span></span>.rst ([pr#63370](https://github.com/ceph/ceph/pull/63370), Zac Dover)

- doc/mgr: edit influx<span></span>.rst ([pr#63415](https://github.com/ceph/ceph/pull/63415), Zac Dover)

- doc/mgr: edit insights<span></span>.rst ([pr#63417](https://github.com/ceph/ceph/pull/63417), Zac Dover)

- doc/mgr: edit iostat<span></span>.rst ([pr#63623](https://github.com/ceph/ceph/pull/63623), Zac Dover)

- doc/mgr: edit iostat<span></span>.rst ([pr#63418](https://github.com/ceph/ceph/pull/63418), Zac Dover)

- doc/mgr: edit localpool<span></span>.rst ([pr#63629](https://github.com/ceph/ceph/pull/63629), Zac Dover)

- doc/mgr: edit localpool<span></span>.rst ([pr#63419](https://github.com/ceph/ceph/pull/63419), Zac Dover)

- doc/mgr: edit mds\_autoscaler<span></span>.rst ([pr#63420](https://github.com/ceph/ceph/pull/63420), Zac Dover)

- doc/mgr: edit modules<span></span>.rst ([pr#63630](https://github.com/ceph/ceph/pull/63630), Zac Dover)

- doc/mgr: edit modules<span></span>.rst ([pr#63451](https://github.com/ceph/ceph/pull/63451), Zac Dover)

- doc/mgr: edit motd<span></span>.inc<span></span>.rst ([pr#63368](https://github.com/ceph/ceph/pull/63368), Zac Dover)

- doc/mgr: edit nfs<span></span>.rst ([pr#63631](https://github.com/ceph/ceph/pull/63631), Zac Dover)

- doc/mgr: edit nfs<span></span>.rst ([pr#63452](https://github.com/ceph/ceph/pull/63452), Zac Dover)

- doc/mgr: edit orchestrator<span></span>.rst ([pr#63469](https://github.com/ceph/ceph/pull/63469), Zac Dover)

- doc/mgr: edit progress<span></span>.rst ([pr#63633](https://github.com/ceph/ceph/pull/63633), Zac Dover)

- doc/mgr: edit progress<span></span>.rst ([pr#63470](https://github.com/ceph/ceph/pull/63470), Zac Dover)

- doc/mgr: edit prometheus<span></span>.rst ([pr#63471](https://github.com/ceph/ceph/pull/63471), Zac Dover)

- doc/mgr: edit rgw<span></span>.rst ([pr#63472](https://github.com/ceph/ceph/pull/63472), Zac Dover)

- doc/mgr: edit smb<span></span>.rst ([pr#63474](https://github.com/ceph/ceph/pull/63474), Zac Dover)

- doc/mgr: edit telegraf<span></span>.rst ([pr#63475](https://github.com/ceph/ceph/pull/63475), Zac Dover)

- doc/mgr: edit telemetry (1 of x) ([pr#63735](https://github.com/ceph/ceph/pull/63735), Zac Dover)

- doc/mgr: edit telemetry (2 of x) ([pr#63739](https://github.com/ceph/ceph/pull/63739), Zac Dover)

- doc/mgr: edit telemetry (3 of x) ([pr#63740](https://github.com/ceph/ceph/pull/63740), Zac Dover)

- doc/mgr: edit telemetry (4 of x) ([pr#63741](https://github.com/ceph/ceph/pull/63741), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63780](https://github.com/ceph/ceph/pull/63780), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63779](https://github.com/ceph/ceph/pull/63779), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63875](https://github.com/ceph/ceph/pull/63875), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63826](https://github.com/ceph/ceph/pull/63826), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63781](https://github.com/ceph/ceph/pull/63781), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63476](https://github.com/ceph/ceph/pull/63476), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst (lines 300-400) ([pr#63827](https://github.com/ceph/ceph/pull/63827), Zac Dover)

- doc/mgr: Fix a copy-paste error in smb<span></span>.rst ([pr#65910](https://github.com/ceph/ceph/pull/65910), Anoop C S)

- doc/mgr: Fix collection desc in telemetry<span></span>.rst ([pr#66643](https://github.com/ceph/ceph/pull/66643), Ville Ojamo)

- doc/mgr: Small improvements in rgw<span></span>.rst ([pr#63481](https://github.com/ceph/ceph/pull/63481), Ville Ojamo)

- doc/monitoring: correct list formatting ([pr#63253](https://github.com/ceph/ceph/pull/63253), Zac Dover)

- doc/monitoring: fix typo s/Orometheus/Prometheus/ ([pr#66629](https://github.com/ceph/ceph/pull/66629), Tokuhiro Matsuno)

- doc/monitoring: Improve index<span></span>.rst ([pr#67918](https://github.com/ceph/ceph/pull/67918), Ville Ojamo)

- doc/PendingReleaseNotes: document osd\_scrub\_queued\_snaptrims\_limit ([pr#69082](https://github.com/ceph/ceph/pull/69082), Ronen Friedman)

- doc/qa: drop mentioning 'manual' in remote snapshotting ([pr#64035](https://github.com/ceph/ceph/pull/64035), Jos Collin)

- doc/rados/bluestore: Add documentation for the BlueFS spillover cleaner ([pr#69221](https://github.com/ceph/ceph/pull/69221), Jaya Prakash)

- doc/rados/bluestore: RockDB cache shards, perf counters ([pr#68774](https://github.com/ceph/ceph/pull/68774), Adam Kupczyk)

- doc/rados/configuration: Fix invalid hyperlinks in mclock-config-ref<span></span>.rst ([pr#63317](https://github.com/ceph/ceph/pull/63317), Ville Ojamo)

- doc/rados/configuration: Improve ceph-conf<span></span>.rst ([pr#63934](https://github.com/ceph/ceph/pull/63934), Anthony D'Atri)

- doc/rados/configuration: Mention show-with-defaults and ceph-conf ([pr#64074](https://github.com/ceph/ceph/pull/64074), Niklas Hambüchen)

- doc/rados/configuration: recommend wpq for EC clusters seeing slow ops ([pr#68932](https://github.com/ceph/ceph/pull/68932), Matthew N. Heler)

- doc/rados/configuration: Small improvements in ceph-conf<span></span>.rst ([pr#64255](https://github.com/ceph/ceph/pull/64255), Ville Ojamo)

- doc/rados/configuration: Update bluestore-config-ref<span></span>.rst WAL+DB sizing ([pr#68322](https://github.com/ceph/ceph/pull/68322), Anthony D'Atri)

- doc/rados/operations: Actually mention `upmap\_max\_deviation` setting name ([pr#64075](https://github.com/ceph/ceph/pull/64075), Niklas Hambüchen)

- doc/rados/operations: add kernel client procedure to read balancer documentation ([pr#65419](https://github.com/ceph/ceph/pull/65419), Laura Flores)

- doc/rados/operations: Add settings advice to balancer<span></span>.rst ([pr#63530](https://github.com/ceph/ceph/pull/63530), Anthony D'Atri)

- doc/rados/operations: Additional improvements to placement-groups<span></span>.rst ([pr#63644](https://github.com/ceph/ceph/pull/63644), Anthony D'Atri)

- doc/rados/operations: Address suggestions for stretch-mode<span></span>.rst ([pr#63836](https://github.com/ceph/ceph/pull/63836), Anthony D'Atri, Zac Dover)

- doc/rados/operations: Clarify exiting in stretch-mode<span></span>.rst ([pr#66597](https://github.com/ceph/ceph/pull/66597), Anthony D'Atri)

- doc/rados/operations: Clarify overwrites in erasure-code<span></span>.rst ([pr#65410](https://github.com/ceph/ceph/pull/65410), Anthony D'Atri)

- doc/rados/operations: edit cache-tiering<span></span>.rst ([pr#63614](https://github.com/ceph/ceph/pull/63614), Zac Dover)

- doc/rados/operations: Fix invalid hyperlink in crush-map-edits<span></span>.rst ([pr#63318](https://github.com/ceph/ceph/pull/63318), Ville Ojamo)

- doc/rados/operations: Fix unordered list in health-checks<span></span>.rst ([pr#63320](https://github.com/ceph/ceph/pull/63320), Ville Ojamo)

- doc/rados/operations: Improve formatting in crush-map<span></span>.rst ([pr#67332](https://github.com/ceph/ceph/pull/67332), adatri)

- doc/rados/operations: Improve health-checks<span></span>.rst ([pr#65230](https://github.com/ceph/ceph/pull/65230), Anthony D'Atri)

- doc/rados/operations: Improve placement-groups<span></span>.rst ([pr#63618](https://github.com/ceph/ceph/pull/63618), Anthony D'Atri)

- doc/rados/operations: Improve stretch-mode<span></span>.rst ([pr#62714](https://github.com/ceph/ceph/pull/62714), Anthony D'Atri)

- doc/rados/operations: remove duplicate word ([pr#65954](https://github.com/ceph/ceph/pull/65954), positiveEV)

- doc/rados/ops: add caps restore command ([pr#64306](https://github.com/ceph/ceph/pull/64306), Zac Dover)

- doc/rados/ops: edit cache-tiering<span></span>.rst ([pr#63877](https://github.com/ceph/ceph/pull/63877), Zac Dover)

- doc/rados/ops: edit cache-tiering<span></span>.rst ([pr#63745](https://github.com/ceph/ceph/pull/63745), Zac Dover)

- doc/rados: add kernel client notes to require\_min\_compat\_client ([pr#68810](https://github.com/ceph/ceph/pull/68810), Kefu Chai)

- doc/rados: clarify "upmap\_max\_deviation" ([pr#64111](https://github.com/ceph/ceph/pull/64111), Zac Dover)

- doc/rados: document require\_osd\_release and require\_min\_compat\_client ([pr#68608](https://github.com/ceph/ceph/pull/68608), Kefu Chai)

- doc/rados: edit balancer<span></span>.rst ([pr#63628](https://github.com/ceph/ceph/pull/63628), Zac Dover)

- doc/rados: enhance "pools<span></span>.rst" ([pr#63842](https://github.com/ceph/ceph/pull/63842), Zac Dover)

- doc/rados: Fix and improve formatting in operations/monitoring<span></span>.rst ([pr#65991](https://github.com/ceph/ceph/pull/65991), Ville Ojamo)

- doc/rados: Fix broken links ([pr#64856](https://github.com/ceph/ceph/pull/64856), Zac Dover)

- doc/rados: fix command syntax in add-or-rm-mons<span></span>.rst ([pr#68234](https://github.com/ceph/ceph/pull/68234), Ville Ojamo)

- doc/rados: Fix link to Intel ISA-L in erasure-code-isa<span></span>.rst ([pr#66808](https://github.com/ceph/ceph/pull/66808), Ville Ojamo)

- doc/rados: fix links in operations/cache-tiering<span></span>.rst ([pr#66982](https://github.com/ceph/ceph/pull/66982), Ville Ojamo)

- doc/rados: fix markup in troubleshooting-mon<span></span>.rst ([pr#68535](https://github.com/ceph/ceph/pull/68535), Ville Ojamo)

- doc/rados: Fix minor issues and improvements in health-checks<span></span>.rst ([pr#66662](https://github.com/ceph/ceph/pull/66662), Ville Ojamo)

- doc/rados: Fix minor issues and improvements in health-checks<span></span>.rst (2 of x) ([pr#66675](https://github.com/ceph/ceph/pull/66675), Ville Ojamo)

- doc/rados: Fix minor issues, improvements in health-checks<span></span>.rst (3 of x) ([pr#66681](https://github.com/ceph/ceph/pull/66681), Ville Ojamo)

- doc/rados: Fix minor issues, improvements in health-checks<span></span>.rst (4 of x) ([pr#66695](https://github.com/ceph/ceph/pull/66695), Ville Ojamo)

- doc/rados: Fix minor issues, improvements in health-checks<span></span>.rst (5 of x) ([pr#66697](https://github.com/ceph/ceph/pull/66697), Ville Ojamo)

- doc/rados: Fix more mClock links in ops/monitoring-osd-pg<span></span>.rst ([pr#64790](https://github.com/ceph/ceph/pull/64790), Ville Ojamo)

- doc/rados: Fix spelling errors (1 of 3) ([pr#67813](https://github.com/ceph/ceph/pull/67813), Ville Ojamo)

- doc/rados: Fix spelling errors (2 of 3) ([pr#67824](https://github.com/ceph/ceph/pull/67824), Ville Ojamo)

- doc/rados: Fix spelling errors (3 of 3) ([pr#67825](https://github.com/ceph/ceph/pull/67825), Ville Ojamo)

- doc/rados: Fix Sphinx warnings in troubleshooting/log-and-debug<span></span>.rst ([pr#66785](https://github.com/ceph/ceph/pull/66785), Ville Ojamo)

- doc/rados: fix unbalanced double backticks markup ([pr#66980](https://github.com/ceph/ceph/pull/66980), Ville Ojamo)

- doc/rados: improve markup in cache-tiering<span></span>.rst ([pr#63465](https://github.com/ceph/ceph/pull/63465), Zac Dover)

- doc/rados: improve operations/erasure-code-lrc<span></span>.rst ([pr#68237](https://github.com/ceph/ceph/pull/68237), Ville Ojamo)

- doc/rados: improve troubleshooting-mon<span></span>.rst ([pr#68561](https://github.com/ceph/ceph/pull/68561), Ville Ojamo)

- doc/rados: improve troubleshooting-pg<span></span>.rst ([pr#66932](https://github.com/ceph/ceph/pull/66932), Ville Ojamo)

- doc/rados: move label to right place in pools<span></span>.rst ([pr#69013](https://github.com/ceph/ceph/pull/69013), Ville Ojamo)

- doc/rados: remove clonedata command ([pr#64334](https://github.com/ceph/ceph/pull/64334), Zac Dover)

- doc/rados: Remove obsolete fs-recommendations links ([pr#64840](https://github.com/ceph/ceph/pull/64840), Ville Ojamo)

- doc/rados: repair short underline ([pr#65128](https://github.com/ceph/ceph/pull/65128), Zac Dover)

- doc/rados: s/enpty/empty/ in pgcalc doc ([pr#63463](https://github.com/ceph/ceph/pull/63463), Zac Dover)

- doc/rados: Update mClock doc on steps to override OSD IOPS capacity config ([pr#62826](https://github.com/ceph/ceph/pull/62826), Sridhar Seshasayee)

- doc/rados: use ref for links and improve links in operations ([pr#66943](https://github.com/ceph/ceph/pull/66943), Ville Ojamo)

- doc/rados: Use ref instead of relative external links ([pr#64838](https://github.com/ceph/ceph/pull/64838), Ville Ojamo)

- doc/rados: warn against lowering require\_min\_compat\_client in read-balancer ([pr#68812](https://github.com/ceph/ceph/pull/68812), Kefu Chai)

- doc/radosgw/admin<span></span>.rst: explain bucket and uid flags for bucket quota ([pr#63983](https://github.com/ceph/ceph/pull/63983), Hyun Jin Kim)

- doc/radosgw/compression: separate RGW and RADOS pool level compression ([pr#62972](https://github.com/ceph/ceph/pull/62972), Laimis Juzeliūnas, Laimis Juzeliunas)

- doc/radosgw/s3: Document delete-if-unmodified-since ([pr#63359](https://github.com/ceph/ceph/pull/63359), Anthony D'Atri)

- doc/radosgw/s3select: added SQL LIMIT operator examples ([pr#67182](https://github.com/ceph/ceph/pull/67182), Khushhal)

- doc/radosgw: add "persistent\_topic\_len" ([pr#64105](https://github.com/ceph/ceph/pull/64105), Zac Dover)

- doc/radosgw: add "persistent\_topic\_size" ([pr#64106](https://github.com/ceph/ceph/pull/64106), Zac Dover)

- doc/radosgw: add rgw\_enable\_lc\_threads & rgw\_enable\_gc\_threads ([pr#64319](https://github.com/ceph/ceph/pull/64319), Zac Dover)

- doc/radosgw: change all intra-docs links to use ref (1 of 6) ([pr#66944](https://github.com/ceph/ceph/pull/66944), Ville Ojamo)

- doc/radosgw: change all intra-docs links to use ref (2 of 6) ([pr#67006](https://github.com/ceph/ceph/pull/67006), Ville Ojamo)

- doc/radosgw: change all intra-docs links to use ref (4 of 6) ([pr#67008](https://github.com/ceph/ceph/pull/67008), Ville Ojamo)

- doc/radosgw: change all intra-docs links to use ref (6 of 6) ([pr#67010](https://github.com/ceph/ceph/pull/67010), Ville Ojamo)

- doc/radosgw: Cosmetic and formatting improvements in frontends<span></span>.rst ([pr#63156](https://github.com/ceph/ceph/pull/63156), Ville Ojamo)

- doc/radosgw: Cosmetic and formatting improvements in vault<span></span>.rst ([pr#63209](https://github.com/ceph/ceph/pull/63209), Ville Ojamo)

- doc/radosgw: Cosmetic improvements and ref links in account<span></span>.rst ([pr#63426](https://github.com/ceph/ceph/pull/63426), Ville Ojamo)

- doc/radosgw: Cosmetic improvements in cloud-transition<span></span>.rst ([pr#63446](https://github.com/ceph/ceph/pull/63446), Ville Ojamo)

- doc/radosgw: Cosmetic improvements in dynamicresharding<span></span>.rst ([pr#63163](https://github.com/ceph/ceph/pull/63163), Ville Ojamo)

- doc/radosgw: deprecate STS Lite for tentacle ([pr#66053](https://github.com/ceph/ceph/pull/66053), Casey Bodley)

- doc/radosgw: document account-root for PUT and POST /admin/user ([pr#67397](https://github.com/ceph/ceph/pull/67397), Casey Bodley)

- doc/radosgw: edit "Lifecycle Settings" ([pr#64532](https://github.com/ceph/ceph/pull/64532), Zac Dover)

- doc/radosgw: edit cloud-transition (1 of x) ([pr#63907](https://github.com/ceph/ceph/pull/63907), Zac Dover)

- doc/radosgw: edit cloud-transition<span></span>.rst ([pr#63876](https://github.com/ceph/ceph/pull/63876), Zac Dover)

- doc/radosgw: edit config-ref<span></span>.rst ([pr#64639](https://github.com/ceph/ceph/pull/64639), Zac Dover)

- doc/radosgw: edit metrics<span></span>.rst ([pr#63782](https://github.com/ceph/ceph/pull/63782), Zac Dover)

- doc/radosgw: edit sentence in metrics<span></span>.rst ([pr#62893](https://github.com/ceph/ceph/pull/62893), Zac Dover)

- doc/radosgw: expose rgw\_multi\_obj\_max\_aio info ([pr#66826](https://github.com/ceph/ceph/pull/66826), Zac Dover)

- doc/radosgw: Fix capitalization, tab use, punctuation in two files ([pr#63450](https://github.com/ceph/ceph/pull/63450), Ville Ojamo)

- doc/radosgw: Fix frontends<span></span>.rst typo ([pr#66112](https://github.com/ceph/ceph/pull/66112), Anthony D'Atri)

- doc/radosgw: Fix indentation in cloud-transition<span></span>.rst ([pr#63321](https://github.com/ceph/ceph/pull/63321), Ville Ojamo)

- doc/radosgw: Fix length of section header underlines in oidc<span></span>.rst ([pr#62986](https://github.com/ceph/ceph/pull/62986), Ville Ojamo)

- doc/radosgw: Fix link to Intel QAT in qat-accel<span></span>.rst ([pr#66809](https://github.com/ceph/ceph/pull/66809), Ville Ojamo)

- doc/radosgw: Fix markup in adminops<span></span>.rst ([pr#67602](https://github.com/ceph/ceph/pull/67602), Ville Ojamo)

- doc/radosgw: Fix RST syntax rendered as text in oidc<span></span>.rst ([pr#62988](https://github.com/ceph/ceph/pull/62988), Ville Ojamo)

- doc/radosgw: Fix section header level in config-ref<span></span>.rst ([pr#62970](https://github.com/ceph/ceph/pull/62970), Ville Ojamo)

- doc/radosgw: Fix spelling errors ([pr#67776](https://github.com/ceph/ceph/pull/67776), Ville Ojamo)

- doc/radosgw: get caller identity docs ([pr#64592](https://github.com/ceph/ceph/pull/64592), Raja Sharma)

- doc/radosgw: improve "pubsub\_push\_pending" info ([pr#64103](https://github.com/ceph/ceph/pull/64103), Zac Dover)

- doc/radosgw: improve DNS host name config in s3/commons<span></span>.rst ([pr#66883](https://github.com/ceph/ceph/pull/66883), Ville Ojamo)

- doc/radosgw: Improve formatting consistency and language in bucket\_logging<span></span>.rst ([pr#64537](https://github.com/ceph/ceph/pull/64537), Ville Ojamo)

- doc/radosgw: Improve formatting in bucketpolicy<span></span>.rst ([pr#63006](https://github.com/ceph/ceph/pull/63006), Ville Ojamo)

- doc/radosgw: Improve formatting in d3n\_datacache<span></span>.rst ([pr#63028](https://github.com/ceph/ceph/pull/63028), Ville Ojamo)

- doc/radosgw: Improve formatting in layout<span></span>.rst ([pr#62979](https://github.com/ceph/ceph/pull/62979), Anthony D'Atri)

- doc/radosgw: Improve language, capitalization and use config database ([pr#63057](https://github.com/ceph/ceph/pull/63057), Ville Ojamo)

- doc/radosgw: Improve language, formatting in s3\_objects\_dedup<span></span>.rst ([pr#66639](https://github.com/ceph/ceph/pull/66639), Ville Ojamo)

- doc/radosgw: Improve rgw-cache<span></span>.rst ([pr#63080](https://github.com/ceph/ceph/pull/63080), Ville Ojamo)

- doc/radosgw: Internal link and single-keystroke improvements ([pr#64536](https://github.com/ceph/ceph/pull/64536), Ville Ojamo)

- doc/radosgw: line edit bucket\_logging<span></span>.rst ([pr#64172](https://github.com/ceph/ceph/pull/64172), Zac Dover)

- doc/radosgw: Promptify CLI commands and fix formatting in layout<span></span>.rst ([pr#63005](https://github.com/ceph/ceph/pull/63005), Ville Ojamo)

- doc/radosgw: Promptify CLI commands in compression<span></span>.rst ([pr#63008](https://github.com/ceph/ceph/pull/63008), Ville Ojamo)

- doc/radosgw: Promptify cmds and improve formatting in placement<span></span>.rst ([pr#63033](https://github.com/ceph/ceph/pull/63033), Ville Ojamo)

- doc/radosgw: Promptify commands and improve formatting in keystone<span></span>.rst ([pr#63007](https://github.com/ceph/ceph/pull/63007), Ville Ojamo)

- doc/radosgw: remove "pubsub\_event\_lost" ([pr#64104](https://github.com/ceph/ceph/pull/64104), Zac Dover)

- doc/radosgw: remove "pubsub\_event\_triggered" ([pr#64107](https://github.com/ceph/ceph/pull/64107), Zac Dover)

- doc/radosgw: Remove stray full stop mid-sentence in compression<span></span>.rst ([pr#63032](https://github.com/ceph/ceph/pull/63032), Ville Ojamo)

- doc/radosgw: rgw\_lua\_max\_memory\_per\_state defaults to 128K (not 500K) ([pr#67110](https://github.com/ceph/ceph/pull/67110), Frédéric Nass)

- doc/radosgw: Simple fixes and improvements, links improvements ([pr#64750](https://github.com/ceph/ceph/pull/64750), Ville Ojamo)

- doc/radosgw: Small fixes and improvements in notifications<span></span>.rst, part 1 ([pr#64767](https://github.com/ceph/ceph/pull/64767), Ville Ojamo)

- doc/radosgw: Small fixes and improvements in notifications<span></span>.rst, part 2 ([pr#64768](https://github.com/ceph/ceph/pull/64768), Ville Ojamo)

- doc/radosgw: Small fixes in config-ref<span></span>.rst ([pr#65982](https://github.com/ceph/ceph/pull/65982), Ville Ojamo)

- doc/radosgw: Small improvements in cloud-restore<span></span>.rst ([pr#63480](https://github.com/ceph/ceph/pull/63480), Ville Ojamo)

- doc/radosgw: Small improvements in kmip<span></span>.rst ([pr#64824](https://github.com/ceph/ceph/pull/64824), Ville Ojamo)

- doc/radosgw: Small improvements in s3-notification-compatibility<span></span>.rst ([pr#64823](https://github.com/ceph/ceph/pull/64823), Ville Ojamo)

- doc/radosgw: Small improvements in s3\_objects\_dedup<span></span>.rst ([pr#64526](https://github.com/ceph/ceph/pull/64526), Ville Ojamo)

- doc/radosgw: update aws specification link ([pr#64026](https://github.com/ceph/ceph/pull/64026), Zac Dover)

- doc/radosgw: Update formatting in notifications<span></span>.rst ([pr#66620](https://github.com/ceph/ceph/pull/66620), Ville Ojamo)

- doc/radosgw: Use Ceph Object Gateway as term in metrics<span></span>.rst ([pr#63062](https://github.com/ceph/ceph/pull/63062), Ville Ojamo)

- doc/radosgw: Use inline code for label syntax in metrics<span></span>.rst ([pr#63064](https://github.com/ceph/ceph/pull/63064), Ville Ojamo)

- doc/radosgw: Use macro for release info in bucketpolicy<span></span>.rst ([pr#63009](https://github.com/ceph/ceph/pull/63009), Ville Ojamo)

- doc/radosgw: Use privileged prompt for CLI commands in admin<span></span>.rst ([pr#63029](https://github.com/ceph/ceph/pull/63029), Ville Ojamo)

- doc/radosgw: Use ref for hyperlink in archive-sync-module<span></span>.rst ([pr#63203](https://github.com/ceph/ceph/pull/63203), Ville Ojamo)

- doc/radosgw: Use ref for hyperlinking to multisite ([pr#63293](https://github.com/ceph/ceph/pull/63293), Ville Ojamo)

- doc/radosgw: Use ref for hyperlinks, 1st batch ([pr#63205](https://github.com/ceph/ceph/pull/63205), Ville Ojamo)

- doc/radosgw: Use ref for hyperlinks, 2nd batch ([pr#63227](https://github.com/ceph/ceph/pull/63227), Ville Ojamo)

- doc/radosgw: Use Title Case consistently in index<span></span>.rst ([pr#63157](https://github.com/ceph/ceph/pull/63157), Ville Ojamo)

- doc/rbd/rbd-config-ref: add clone settings section ([pr#66172](https://github.com/ceph/ceph/pull/66172), Ilya Dryomov)

- doc/rbd: add mirroring troubleshooting info ([pr#63841](https://github.com/ceph/ceph/pull/63841), Zac Dover)

- doc/rbd: clarify mirror resync snapshot behavior ([pr#70081](https://github.com/ceph/ceph/pull/70081), Miki Patel)

- doc/rbd: clarify Rocky iSCSI gateway requirements ([pr#69201](https://github.com/ceph/ceph/pull/69201), Kobi Ginon)

- doc/rbd: Update NVMe-oF deployment instructions with group name ([pr#68423](https://github.com/ceph/ceph/pull/68423), Aviv Caro)

- doc/releases: Fix Sphinx warning in tentacle<span></span>.rst ([pr#66421](https://github.com/ceph/ceph/pull/66421), Ville Ojamo)

- doc/releases: fix Tentacle data in releases<span></span>.yml ([pr#68466](https://github.com/ceph/ceph/pull/68466), Ville Ojamo)

- doc/releases: remove RST-breaking indentation ([pr#65139](https://github.com/ceph/ceph/pull/65139), Zac Dover)

- doc/rgw/logging: fix journal record format ([pr#64328](https://github.com/ceph/ceph/pull/64328), Yuval Lifshitz)

- doc/rgw/lua: add info on luarocks package ([pr#63164](https://github.com/ceph/ceph/pull/63164), Yuval Lifshitz)

- doc/rgw: add notes about 'rgw sts key' ([pr#63360](https://github.com/ceph/ceph/pull/63360), Casey Bodley)

- doc/rgw: correct typo in rgw\_usage\_log\_key\_transition ([pr#66827](https://github.com/ceph/ceph/pull/66827), Zac Dover)

- doc/rgw: describe more details of bucket index shards and resharding ([pr#67113](https://github.com/ceph/ceph/pull/67113), J. Eric Ivancich)

- doc/rgw: document s3control apis for PublicAccessBlock ([pr#69111](https://github.com/ceph/ceph/pull/69111), Casey Bodley)

- doc/rgw: fix the description error of --max-read-ops ([pr#65996](https://github.com/ceph/ceph/pull/65996), Yite Gu)

- doc/rgw: POST /admin/account doesn't require id/name ([pr#66687](https://github.com/ceph/ceph/pull/66687), Casey Bodley)

- doc/rgw: use --bucket instead of --uid ([pr#65997](https://github.com/ceph/ceph/pull/65997), YiteGu)

- doc/rgw: warn about rgw\_usage\_max\_shards consistency ([pr#68866](https://github.com/ceph/ceph/pull/68866), Olivier Chaze)

- doc/script/gen\_state\_diagram<span></span>.py: adapt for crimson BackfillMachine ([pr#63103](https://github.com/ceph/ceph/pull/63103), Josh Durgin)

- doc/scripts: use raw string for regex in gen\_state\_diagram<span></span>.py ([pr#68606](https://github.com/ceph/ceph/pull/68606), Kefu Chai)

- doc/src/common/options: mgr<span></span>.yaml<span></span>.in edit ([pr#63085](https://github.com/ceph/ceph/pull/63085), Zac Dover)

- doc/src: edit osd<span></span>.yaml<span></span>.in (osd\_deep\_scrub\_interval\_cv) ([pr#63821](https://github.com/ceph/ceph/pull/63821), Zac Dover)

- doc/start/os-recommendations: update for Umbrella and future releases ([pr#68665](https://github.com/ceph/ceph/pull/68665), Patrick Donnelly)

- doc/start: Add ARM support note to hardware-recommendations<span></span>.rst ([pr#66560](https://github.com/ceph/ceph/pull/66560), Anthony D'Atri)

- doc/start: Clarify doc building and begin list of conventions ([pr#68966](https://github.com/ceph/ceph/pull/68966), Anthony D'Atri)

- doc/start: edit documenting-ceph<span></span>.rst ([pr#63686](https://github.com/ceph/ceph/pull/63686), Zac Dover)

- doc/start: edit documenting-ceph<span></span>.rst ([pr#63634](https://github.com/ceph/ceph/pull/63634), Zac Dover)

- doc/start: Fix stray RST syntax in documenting-ceph<span></span>.rst ([pr#66621](https://github.com/ceph/ceph/pull/66621), Ville Ojamo)

- doc/start: fix wording in swap tip ([pr#65168](https://github.com/ceph/ceph/pull/65168), Pierre Riteau)

- doc/start: Improve beginners-guide<span></span>.rst ([pr#67671](https://github.com/ceph/ceph/pull/67671), Ville Ojamo)

- doc/start: Improve hardware-recommendations<span></span>.rst ([pr#66044](https://github.com/ceph/ceph/pull/66044), Anthony D'Atri)

- doc/start: Update and fix get-involved<span></span>.rst ([pr#67599](https://github.com/ceph/ceph/pull/67599), Ville Ojamo)

- doc/start: Update Slack invite link in doc/start/get-involved<span></span>.rst ([pr#67243](https://github.com/ceph/ceph/pull/67243), Anthony D'Atri)

- doc/start: Update Slack invite URL in get-involved<span></span>.rst ([pr#66755](https://github.com/ceph/ceph/pull/66755), Anthony D'Atri)

- doc: add 20<span></span>.2<span></span>.1 Release Notes ([pr#68004](https://github.com/ceph/ceph/pull/68004), Patrick Donnelly, Yuri Weinstein)

- doc: Add branch protection step to new release checklist ([pr#63102](https://github.com/ceph/ceph/pull/63102), David Galloway)

- doc: Add bucket logging admin commands documentation ([pr#67103](https://github.com/ceph/ceph/pull/67103), Shree Jejurikar)

- doc: add ceph<span></span>.conf in osd creation ([pr#66562](https://github.com/ceph/ceph/pull/66562), Germano Massullo (Thetra))

- doc: add Dashboard and Monitoring release notes for Umbrella ([pr#69276](https://github.com/ceph/ceph/pull/69276), Afreen Misbah)

- doc: add instructions for deploying crimson with cephadm ([pr#67220](https://github.com/ceph/ceph/pull/67220), Shraddha Agrawal)

- doc: add note admonitions in two files ([pr#64483](https://github.com/ceph/ceph/pull/64483), Zac Dover)

- doc: add RBD\_LOCK\_MODE\_EXCLUSIVE\_TRANSIENT release note ([pr#68205](https://github.com/ceph/ceph/pull/68205), Ilya Dryomov)

- doc: add Tentacle to os recommendations ([pr#66431](https://github.com/ceph/ceph/pull/66431), Casey Bodley)

- doc: add Tentacle v20<span></span>.2<span></span>.0 release notes ([pr#65971](https://github.com/ceph/ceph/pull/65971), Laura Flores, Casey Bodley, Matan Breizman, Ilya Dryomov, Ville Ojamo)

- doc: add the Ceph Technical Charter ([pr#67500](https://github.com/ceph/ceph/pull/67500), Patrick Donnelly)

- doc: Added release dates to 18<span></span>.2<span></span>.5 to 18<span></span>.2<span></span>.7 and 19<span></span>.2<span></span>.0 to 19<span></span>.2<span></span>.3 ([pr#66299](https://github.com/ceph/ceph/pull/66299), Joel Davidow)

- doc: changed the jenkins job URL for build ([pr#65736](https://github.com/ceph/ceph/pull/65736), Yuri Weinstein)

- doc: Clarification of text in ec stretch cluster design ([pr#68797](https://github.com/ceph/ceph/pull/68797), Jon Bailey)

- doc: Clarify the status of MS Windows client support ([pr#64374](https://github.com/ceph/ceph/pull/64374), Anthony D'Atri)

- doc: correct spelling ([pr#67309](https://github.com/ceph/ceph/pull/67309), Amnay)

- doc: crimson/dev - add a vstart<span></span>.sh example using SeaStore options, minor formatting fixes ([pr#68685](https://github.com/ceph/ceph/pull/68685), Jose J Palacios-Perez)

- doc: detailed explanation of set\_choose\_tries ([pr#66073](https://github.com/ceph/ceph/pull/66073), benaryorg)

- doc: do not depend on typed-ast ([pr#64162](https://github.com/ceph/ceph/pull/64162), Kefu Chai)

- doc: document ceph nvmeof CLI subcommands for target configuration ([pr#68618](https://github.com/ceph/ceph/pull/68618), Emmanuel Ameh, oduameh)

- doc: Document ceph-mgr module configuration options ([pr#64161](https://github.com/ceph/ceph/pull/64161), Kefu Chai)

- doc: Document erasure-coded pool direct reads for balance flag ([pr#69263](https://github.com/ceph/ceph/pull/69263), Jon Bailey)

- doc: Document that client\_dirsize\_rbytes confuses rsync ([pr#66748](https://github.com/ceph/ceph/pull/66748), Niklas Hambüchen)

- doc: Enhance the ceph df and ceph osd commands ([pr#65501](https://github.com/ceph/ceph/pull/65501), Anthony D'Atri)

- doc: Erasure Code: Document set CRUSH rule precedence vs EC profile ([pr#64806](https://github.com/ceph/ceph/pull/64806), Niklas Hambüchen)

- Doc: Erasure Coding enhancements for tentacle ([pr#64809](https://github.com/ceph/ceph/pull/64809), Bill Scales)

- doc: fetch releases from main branch ([pr#66937](https://github.com/ceph/ceph/pull/66937), Patrick Donnelly)

- doc: fix formatting in cephfs\_mirror dev doc ([pr#63237](https://github.com/ceph/ceph/pull/63237), Jos Collin)

- doc: fix formatting, typos in mon elections and stretch mode ([pr#64797](https://github.com/ceph/ceph/pull/64797), Joao Eduardo Luis)

- doc: Fix link and improve Crimson doc ([pr#67668](https://github.com/ceph/ceph/pull/67668), Ville Ojamo)

- doc: Fix links to mClock config reference ([pr#64733](https://github.com/ceph/ceph/pull/64733), Pierre Riteau)

- doc: Fix minor formatting, typo etc issues ([pr#66632](https://github.com/ceph/ceph/pull/66632), Ville Ojamo)

- doc: Fix missing blank line Sphinx warnings ([pr#63329](https://github.com/ceph/ceph/pull/63329), Ville Ojamo)

- doc: fix most invalid directives missing a second colon ([pr#66814](https://github.com/ceph/ceph/pull/66814), Ville Ojamo)

- doc: fix osd min size ([pr#65613](https://github.com/ceph/ceph/pull/65613), Satoru Takeuchi)

- doc: fix period and zone command names in radosgw-admin man page ([pr#68228](https://github.com/ceph/ceph/pull/68228), Farzan)

- doc: fix release date of v18<span></span>.2<span></span>.8 ([pr#67928](https://github.com/ceph/ceph/pull/67928), Patrick Donnelly)

- doc: fix Sphinx complaints ([pr#68562](https://github.com/ceph/ceph/pull/68562), Ville Ojamo)

- doc: Fix Sphinx warning about theme option ([pr#66423](https://github.com/ceph/ceph/pull/66423), Ville Ojamo)

- doc: Fix Sphinx warnings ([pr#68100](https://github.com/ceph/ceph/pull/68100), Ville Ojamo)

- doc: Fix Sphinx warnings ([pr#67591](https://github.com/ceph/ceph/pull/67591), Ville Ojamo)

- doc: Fix Sphinx warnings ([pr#66420](https://github.com/ceph/ceph/pull/66420), Ville Ojamo)

- doc: Fix sphinx warnings and one error ([pr#63920](https://github.com/ceph/ceph/pull/63920), Ville Ojamo)

- doc: Fix Sphinx warnings&errors and use labels in 4 files for links ([pr#64729](https://github.com/ceph/ceph/pull/64729), Ville Ojamo)

- doc: fix syntax for removing zone from zonegroup ([pr#65862](https://github.com/ceph/ceph/pull/65862), Sascha Lucas)

- doc: Fix typo in src/common/options/global<span></span>.yaml<span></span>.in ([pr#65733](https://github.com/ceph/ceph/pull/65733), Anthony D'Atri)

- doc: fix typos and outdated refs across developer guide ([pr#68082](https://github.com/ceph/ceph/pull/68082), Lumir Sliva)

- doc: Fix unterminated inline literal in ceph-conf<span></span>.rst ([pr#64163](https://github.com/ceph/ceph/pull/64163), Kefu Chai)

- doc: Fixes a spelling error on the RATIO for PG scaling recommendation ([pr#67078](https://github.com/ceph/ceph/pull/67078), Kevin Niederwanger)

- doc: Fixes a typo in balancer operations ([pr#64157](https://github.com/ceph/ceph/pull/64157), Tyler Brekke)

- doc: fixing starting release of mgmt-gateway/oauth2-proxy services ([pr#65530](https://github.com/ceph/ceph/pull/65530), Redouane Kachach)

- doc: governance/csc: update email address ([pr#69337](https://github.com/ceph/ceph/pull/69337), Yehuda Sadeh Weinraub)

- doc: Harmonize hyphens to underscores in rados/troubleshooting/troubleshooting-mon<span></span>.rst ([pr#66325](https://github.com/ceph/ceph/pull/66325), Joel Davidow)

- doc: Improve central config log documentation ([pr#64053](https://github.com/ceph/ceph/pull/64053), Anthony D'Atri)

- doc: improve crimson docs ([pr#67523](https://github.com/ceph/ceph/pull/67523), Shraddha Agrawal)

- doc: Improve docs in start ([pr#67852](https://github.com/ceph/ceph/pull/67852), Ville Ojamo)

- doc: Improve PendingReleaseNotes ([pr#65052](https://github.com/ceph/ceph/pull/65052), Anthony D'Atri)

- doc: Improve start/hardware-recommendations<span></span>.rst ([pr#66293](https://github.com/ceph/ceph/pull/66293), Anthony D'Atri)

- doc: Improve start/quick-rbd<span></span>.rst ([pr#67672](https://github.com/ceph/ceph/pull/67672), Ville Ojamo)

- doc: Introduce Crimson User Guide ([pr#65899](https://github.com/ceph/ceph/pull/65899), Matan Breizman)

- doc: mgr/dashboard: add OAuth2 SSO documentation ([pr#60440](https://github.com/ceph/ceph/pull/60440), Zac Dover, Pedro Gonzalez Gomez)

- doc: mgr/nfs: Documentation for NFS ratelimiting commands ([pr#70808](https://github.com/ceph/ceph/pull/70808), Shweta Bhosale)

- doc: Pin pip to <25<span></span>.3 for RTD as a workaround for pybind in admin/doc-read-the-docs<span></span>.txt ([pr#66059](https://github.com/ceph/ceph/pull/66059), Ville Ojamo)

- doc: quincy 17<span></span>.2<span></span>.9 release notes ([pr#63267](https://github.com/ceph/ceph/pull/63267), Laura Flores, Yuri Weinstein, Enrico Bocchi)

- doc: reef 18<span></span>.2<span></span>.7 release notes ([pr#63090](https://github.com/ceph/ceph/pull/63090), Laura Flores, Yuri Weinstein)

- doc: reef 18<span></span>.2<span></span>.8 release notes ([pr#67746](https://github.com/ceph/ceph/pull/67746), Patrick Donnelly, Yuri Weinstein)

- doc: Remove markup from CLI example commands ([pr#67595](https://github.com/ceph/ceph/pull/67595), Ville Ojamo)

- doc: Remove sphinxcontrib-seqdiag Python package from RTD builds ([pr#66787](https://github.com/ceph/ceph/pull/66787), Ville Ojamo)

- doc: Revert "Merge pull request #63351 from anthonyeleven/document\_HTTP\_X\\_… ([pr#63357](https://github.com/ceph/ceph/pull/63357), Zac Dover)

- doc: show runtime-updatable config metadata ([pr#67865](https://github.com/ceph/ceph/pull/67865), Kefu Chai)

- doc: some small smb mgr module doc improvements ([pr#66579](https://github.com/ceph/ceph/pull/66579), John Mulligan)

- doc: squid 19<span></span>.2<span></span>.3 release notes ([pr#64583](https://github.com/ceph/ceph/pull/64583), Adam C. Emerson, Yuri Weinstein)

- doc: squid 19<span></span>.2<span></span>.4 release notes ([pr#68362](https://github.com/ceph/ceph/pull/68362), Yuri Weinstein)

- doc: unpin pip in admin/doc-read-the-docs<span></span>.txt ([pr#67175](https://github.com/ceph/ceph/pull/67175), Ville Ojamo)

- doc: update broken reference ([pr#67379](https://github.com/ceph/ceph/pull/67379), Zac Dover)

- doc: update cephfs-journal-tool docs ([pr#62860](https://github.com/ceph/ceph/pull/62860), Jos Collin)

- doc: update cephfs-mirror replication ([pr#64988](https://github.com/ceph/ceph/pull/64988), Jos Collin)

- doc: update data availability release notes ([pr#65521](https://github.com/ceph/ceph/pull/65521), Shraddha Agrawal)

- doc: update default availbility score status ([pr#67375](https://github.com/ceph/ceph/pull/67375), Shraddha Agrawal)

- doc: update governance<span></span>.rst to change email address ([pr#68543](https://github.com/ceph/ceph/pull/68543), Myoungwon Oh)

- doc: Update governance<span></span>.rst to have member names sorted ([pr#65967](https://github.com/ceph/ceph/pull/65967), Joseph Mundackal)

- doc: update Grafana certificate configuration to use certmgr ([pr#65406](https://github.com/ceph/ceph/pull/65406), Redouane Kachach)

- doc: update mgr module command documentation for per-module registries ([pr#67257](https://github.com/ceph/ceph/pull/67257), Kefu Chai)

- doc: update mgr modules notify\_types ([pr#64433](https://github.com/ceph/ceph/pull/64433), Nitzan Mordechai)

- doc: Update os-recommendations<span></span>.rst to remove empty rows ([pr#65865](https://github.com/ceph/ceph/pull/65865), Joseph Mundackal)

- doc: update RGW HTTPS configuration to use certmgr and new fields ([pr#65428](https://github.com/ceph/ceph/pull/65428), Redouane Kachach)

- doc: Update the old ceph<span></span>.com/community/ links to ceph<span></span>.io/en/news/blog/ ([pr#66101](https://github.com/ceph/ceph/pull/66101), Marc Methot)

- doc: Use existing labels and ref for hyperlinks in architecture<span></span>.rst ([pr#63294](https://github.com/ceph/ceph/pull/63294), Ville Ojamo)

- doc: Use ref instead of full URLs for intra-docs links ([pr#64803](https://github.com/ceph/ceph/pull/64803), Ville Ojamo)

- doc: Use validated links with ref instead of external links ([pr#66020](https://github.com/ceph/ceph/pull/66020), Ville Ojamo)

- doc: warn against default cephadm shell for ceph-volume ([pr#68748](https://github.com/ceph/ceph/pull/68748), Guillaume Abrioux)

- Dockerfile<span></span>.build: bump sccache and fetch it on riscv64 ([pr#69315](https://github.com/ceph/ceph/pull/69315), Sun Yuechi)

- Dockerfile<span></span>.build: improve docker compatibility ([pr#65760](https://github.com/ceph/ceph/pull/65760), John Mulligan)

- Dockerfile<span></span>.build: Make sccache repo configurable ([pr#65803](https://github.com/ceph/ceph/pull/65803), Zack Cerza)

- docs/dev: Add design document with information on proposed design for pool migration ([pr#65703](https://github.com/ceph/ceph/pull/65703), Connor Fawcett)

- docs/security: added workinggroup<span></span>.rst and securitylead<span></span>.rst ([pr#68847](https://github.com/ceph/ceph/pull/68847), Sage McTaggart)

- docs: add package on macos to run ceph-backport<span></span>.sh ([pr#65893](https://github.com/ceph/ceph/pull/65893), Hoai-Thu Vuong)

- docs: add release notes and docs for availability score feature ([pr#63181](https://github.com/ceph/ceph/pull/63181), Shraddha Agrawal)

- docs: First pass at EC stretch cluster design ([pr#67443](https://github.com/ceph/ceph/pull/67443), Alex Ainscow)

- docs: monitoring: Fix typo thughtput -> throughput ([pr#67120](https://github.com/ceph/ceph/pull/67120), Vova Artsiukhou)

- docs: Split Reads design (EC Direct Reads and Replica splits) ([pr#65662](https://github.com/ceph/ceph/pull/65662), Alex Ainscow)

- Drop support for older version of dashboard ([pr#65246](https://github.com/ceph/ceph/pull/65246), Afreen Misbah)

- EC Direct Reads ([pr#66459](https://github.com/ceph/ceph/pull/66459), Jon Bailey, Callum James, Alex Ainscow, Matty Williams)

- EC Direct Reads: First PR, background work ([pr#65771](https://github.com/ceph/ceph/pull/65771), Alex Ainscow)

- EC fixpack 3 ([pr#64917](https://github.com/ceph/ceph/pull/64917), Jon Bailey, Bill Scales, Alex Ainscow)

- ec: validate tcache retrievals in ErasureCodeIsaDefault::prepare() ([pr#68131](https://github.com/ceph/ceph/pull/68131), Radoslaw Zarzynski)

- encode: Fix bad use of DENC\_DUMP\_PRE ([pr#66410](https://github.com/ceph/ceph/pull/66410), Adam Kupczyk)

- Enhance mgr cache - from cache based on ttl to cache based on changes ([pr#64805](https://github.com/ceph/ceph/pull/64805), Nitzan Mordechai)

- erasure-code/clay: decode sub-chunks in place ([pr#72401](https://github.com/ceph/ceph/pull/72401), Lumir Sliva)

- erasure-code/clay: minor cleanups ([pr#64223](https://github.com/ceph/ceph/pull/64223), Kefu Chai)

- erasure-code/consistency: Fixed signed-compare warning in Consistency Checker ([pr#65174](https://github.com/ceph/ceph/pull/65174), Jon Bailey)

- erasure-code/isa: eliminate redundant map lookups ([pr#67202](https://github.com/ceph/ceph/pull/67202), Kefu Chai)

- erasure-code/isa: fix cache collision causing buffer overflow ([pr#66894](https://github.com/ceph/ceph/pull/66894), Kefu Chai)

- erasure-code/jerasure: fix memory leak in Galois field operations ([pr#64226](https://github.com/ceph/ceph/pull/64226), Kefu Chai)

- erasure-code/jerasure: Fix thread safety in plugin init ([pr#67498](https://github.com/ceph/ceph/pull/67498), Jamie Pryde)

- erasure-code: Add a new utility which checks the consistency of objects within an EC pool ([pr#62170](https://github.com/ceph/ceph/pull/62170), Connor Fawcett)

- erasure-code: Add ceph\_ec\_consistency\_checker into ceph\_test\_package ([pr#64378](https://github.com/ceph/ceph/pull/64378), Connor Fawcett)

- erasure-code: Enable isa for ppc64le target ([pr#66602](https://github.com/ceph/ceph/pull/66602), T K Chandra Hasan)

- erasure-code: Handle review comments from #61804 to tidy up EC plugin changes ([pr#62657](https://github.com/ceph/ceph/pull/62657), Jamie Pryde)

- erasure-code: make bufferlist contiguous in ErasureCode::encode\_prepare ([pr#65204](https://github.com/ceph/ceph/pull/65204), Igor Fedotov)

- erasure-code: Use ISA-L cauchy if reed\_sol\_van does not support the specified K and M values ([pr#65016](https://github.com/ceph/ceph/pull/65016), Jamie Pryde)

- examples/librados: fix memory pointed to by 'rs' is freed twice ([pr#64248](https://github.com/ceph/ceph/pull/64248), Zhu Wei)

- execute post-branch tasks ([pr#69405](https://github.com/ceph/ceph/pull/69405), Patrick Donnelly)

- extblkdev/fcm: do not abort on multi-device volume before we discover… ([pr#68391](https://github.com/ceph/ceph/pull/68391), Igor Fedotov)

- Fast failover ([pr#66545](https://github.com/ceph/ceph/pull/66545), Leonid Chernin)

- FCM plugin for block device ([pr#66318](https://github.com/ceph/ceph/pull/66318), Adam Kupczyk, Martin Ohmacht)

- Fix Breakpad Builds on Newer Distros ([pr#63676](https://github.com/ceph/ceph/pull/63676), Marcel Lauhoff)

- Fix ceph\_monstore\_tool linker error ([pr#64441](https://github.com/ceph/ceph/pull/64441), Alex Ainscow)

- Fix cypress tests ([pr#64754](https://github.com/ceph/ceph/pull/64754), Aashish Sharma)

- fix duplicated entity addr in the map during reboot of several GWs ([pr#63003](https://github.com/ceph/ceph/pull/63003), Leonid Chernin)

- Fix multifs auth caps check ([pr#64550](https://github.com/ceph/ceph/pull/64550), Kotresh HR)

- Fix teuthology timeout issues with bluestore software compression and improve thread heartbeat timeout code ([pr#66384](https://github.com/ceph/ceph/pull/66384), Bill Scales)

- Fix the prometheus module crash ([pr#66605](https://github.com/ceph/ceph/pull/66605), Anmol Babu)

- Fix uadk build (arm64 only) on debian (conflict with DESTDIR) ([pr#65316](https://github.com/ceph/ceph/pull/65316), Dan Mick)

- fix: Swift API conditional write if\_match, if\_none\_match ([pr#64341](https://github.com/ceph/ceph/pull/64341), mertsunacoglu)

- fix: the RGW crash caused by special characters ([pr#63521](https://github.com/ceph/ceph/pull/63521), mertsunacoglu, Emin)

- fixes #75404 from trackers:mgr/dashboard: use border-subtle utility class in overview and tearsheet ([issue#75404](http://tracker.ceph.com/issues/75404), [pr#67803](https://github.com/ceph/ceph/pull/67803), Annmool)

- Fixes for GCC 16 and Clang 21 ([pr#67081](https://github.com/ceph/ceph/pull/67081), Adam C. Emerson)

- Fixes for subvolume overview in grafana ([pr#68181](https://github.com/ceph/ceph/pull/68181), Ankush Behl)

- Fixing issue of service mgmt-gateway not coming up when configured to… ([issue#75267](http://tracker.ceph.com/issues/75267), [pr#67610](https://github.com/ceph/ceph/pull/67610), Kobi Ginon)

- fmt: bump up version to 11<span></span>.1<span></span>.4 ([pr#62568](https://github.com/ceph/ceph/pull/62568), Matan Breizman)

- fuse: improve error handling in fuse\_ll\_getattr ([pr#64701](https://github.com/ceph/ceph/pull/64701), izxl007)

- Generalize error handling for angular forms ([pr#66378](https://github.com/ceph/ceph/pull/66378), Afreen Misbah)

- github/workflow/diff-ceph-config<span></span>.yml: only detect the configuration changes that were made in the PR ([pr#63714](https://github.com/ceph/ceph/pull/63714), Naveen Naidu)

- github/workflow: Disable cron based github actions on forks ([pr#66130](https://github.com/ceph/ceph/pull/66130), Joseph Mundackal)

- github/workflows/config-diff-post-comments<span></span>.js: introduce "/config check ok" command ([pr#64015](https://github.com/ceph/ceph/pull/64015), Naveen Naidu)

- github/workflows/pr-checklist<span></span>.yml: Update ([pr#65646](https://github.com/ceph/ceph/pull/65646), Zack Cerza)

- github/workflows/pr-checklist<span></span>.yml: Update ([pr#65553](https://github.com/ceph/ceph/pull/65553), Zack Cerza)

- github/workflows/redmine-upkeep: remove concurrency limit ([pr#65547](https://github.com/ceph/ceph/pull/65547), Patrick Donnelly)

- github/workflows/redmine-upkeep: run for release branches ([pr#67316](https://github.com/ceph/ceph/pull/67316), Patrick Donnelly)

- github/workflows/redmine-upkeep: use pull\_request\_target ([pr#64461](https://github.com/ceph/ceph/pull/64461), Patrick Donnelly)

- github/workflows/releng-audit: handle missing case of skipping audit on override ([pr#68921](https://github.com/ceph/ceph/pull/68921), Patrick Donnelly)

- github/workflows/releng-audit: handle simultaneous override and fail… ([pr#68913](https://github.com/ceph/ceph/pull/68913), Patrick Donnelly)

- github/workflows/releng-audit: remove override on reopen ([pr#68937](https://github.com/ceph/ceph/pull/68937), Patrick Donnelly)

- github/workflows/releng-audit: update workflows ([pr#68998](https://github.com/ceph/ceph/pull/68998), Patrick Donnelly)

- github/workflows/scripts/config-diff-post-comment<span></span>.js: fix config check ok logic ([pr#64296](https://github.com/ceph/ceph/pull/64296), Naveen Naidu)

- github/workflows: Fix GHSA-p433-fp4g-pc2c ([pr#66674](https://github.com/ceph/ceph/pull/66674), David Galloway)

- github/workflows: run redmine-upkeep for release branches ([pr#65276](https://github.com/ceph/ceph/pull/65276), Patrick Donnelly)

- github/workflows: update qa-symlink to use pull\_request\_target ([pr#65892](https://github.com/ceph/ceph/pull/65892), Patrick Donnelly)

- github/workflows: use main branch for config diff ([pr#67320](https://github.com/ceph/ceph/pull/67320), Patrick Donnelly)

- github: add a note reminding to use one command per comment ([pr#65532](https://github.com/ceph/ceph/pull/65532), John Mulligan)

- github: add rgw label for changes in doc/radosgw ([pr#63361](https://github.com/ceph/ceph/pull/63361), Casey Bodley)

- github: add tentacle milestone ([pr#63596](https://github.com/ceph/ceph/pull/63596), Casey Bodley)

- github: define contribution workflows for regular and backport PRs ([pr#67119](https://github.com/ceph/ceph/pull/67119), Ernesto Puerta)

- github: Fix RTD build retrigger ([pr#63143](https://github.com/ceph/ceph/pull/63143), David Galloway)

- github: fix workflow format error ([pr#64417](https://github.com/ceph/ceph/pull/64417), Patrick Donnelly)

- github: Harden workflow against arbritrary code injection ([pr#66539](https://github.com/ceph/ceph/pull/66539), David Galloway)

- github: limit what CI checks run for only doc/qa changes ([pr#67630](https://github.com/ceph/ceph/pull/67630), Shraddha Agrawal)

- github: mitigate possible "hackerbot-claw" exploit ([pr#67658](https://github.com/ceph/ceph/pull/67658), Patrick Donnelly)

- github: pin GH Actions to SHA-1 commit ([pr#65720](https://github.com/ceph/ceph/pull/65720), Ernesto Puerta)

- github: run verify-qa when PR HEAD is updated ([pr#63011](https://github.com/ceph/ceph/pull/63011), Patrick Donnelly)

- gitmodules: remove shallow=true config from nvmeof/gateway ([pr#63729](https://github.com/ceph/ceph/pull/63729), Samuel Just)

- Handle failures in metric parsing ([pr#64335](https://github.com/ceph/ceph/pull/64335), Anmol Babu)

- haproxy service should not be restart on nfs updates ([pr#69986](https://github.com/ceph/ceph/pull/69986), Shweta Bhosale)

- imgr/cephadm/nvmeof: Add "force TLS" flag to NVMeOF spec file ([pr#64560](https://github.com/ceph/ceph/pull/64560), Gil Bregman)

- Include s3-tests in Ceph repo ([pr#69716](https://github.com/ceph/ceph/pull/69716), Adam C. Emerson)

- include/any<span></span>.h: avoid using std::aligned\_storage\_t ([pr#63027](https://github.com/ceph/ceph/pull/63027), Kefu Chai)

- include/buffer\_raw: avoid using std::aligned\_storage\_t ([pr#64041](https://github.com/ceph/ceph/pull/64041), Kefu Chai)

- include/ceph\_features: note more kernel versions ([pr#67754](https://github.com/ceph/ceph/pull/67754), Ilya Dryomov)

- include/cpp-btree: fix array bounds warning in child() accessors ([pr#66549](https://github.com/ceph/ceph/pull/66549), Kefu Chai)

- include/cpp-btree: fix false -Warray-bounds in child accessors ([pr#68811](https://github.com/ceph/ceph/pull/68811), Kefu Chai)

- include/function2<span></span>.hpp: avoid using std::aligned\_storage\_t ([pr#64524](https://github.com/ceph/ceph/pull/64524), Kefu Chai)

- include/rados/librados<span></span>.h: fix documented rados\_cluster\_fsid return value ([pr#66207](https://github.com/ceph/ceph/pull/66207), Lukas Stockner)

- include/utime\_fmt<span></span>.h: replace deprecated fmt::localtime() with localti… ([pr#63800](https://github.com/ceph/ceph/pull/63800), Kefu Chai)

- inline\_memory: optimize mem\_is\_zero for riscv using RISC-V Vector (RVV) intrinsics ([pr#65354](https://github.com/ceph/ceph/pull/65354), Sun Yuechi)

- install-deps<span></span>.sh: build without crimson when it is disabled ([pr#66441](https://github.com/ceph/ceph/pull/66441), T K Chandra Hasan)

- install-deps<span></span>.sh: enable lab extras on el10 builders ([pr#64228](https://github.com/ceph/ceph/pull/64228), John Mulligan)

- install-deps<span></span>.sh: install proper compiler version on Debian/Ubuntu ([pr#65990](https://github.com/ceph/ceph/pull/65990), Dan Mick)

- install-deps<span></span>.sh: refresh package index before installing dependencies ([pr#63834](https://github.com/ceph/ceph/pull/63834), Kefu Chai)

- install-deps: Replace apt-mirror ([pr#66656](https://github.com/ceph/ceph/pull/66656), David Galloway)

- install-deps: warn about gcc older than 13 for el9 and later ([pr#66122](https://github.com/ceph/ceph/pull/66122), Casey Bodley)

- interval\_map: Add non-const iterators ([pr#63844](https://github.com/ceph/ceph/pull/63844), Alex Ainscow)

- introduce nvme module again ([pr#67641](https://github.com/ceph/ceph/pull/67641), Vallari Agrawal, Avan Thakkar, Tomer Haskalovitch)

- IO Generator: Add debug to DataGeneration validation failure output ([pr#65939](https://github.com/ceph/ceph/pull/65939), Matty Williams)

- IO Generator: Change random number generator to be compiler independent ([pr#65987](https://github.com/ceph/ceph/pull/65987), Matty Williams)

- isa-l: enable on RISC-V ([pr#68098](https://github.com/ceph/ceph/pull/68098), Sun Yuechi)

- isa: Update ISA-L from 2<span></span>.30<span></span>.0 to 2<span></span>.32<span></span>.0 ([pr#67749](https://github.com/ceph/ceph/pull/67749), Jamie Pryde)

- Issue 76185 enable mgmt gateway on a fips cluster failed ([pr#68638](https://github.com/ceph/ceph/pull/68638), Kobi Ginon)

- Issues 74393 dashboard fail to access object when rgw use cephadm certificate ([pr#67857](https://github.com/ceph/ceph/pull/67857), Yael Azulay)

- journal/ObjectPlayer: don't acquire locks in destructor ([pr#70013](https://github.com/ceph/ceph/pull/70013), Kefu Chai)

- json\_spirit: Enhance string processing to handle short strings ([pr#64966](https://github.com/ceph/ceph/pull/64966), Edwin Rodriguez)

- krbd: "rbd device map" command should use msgr2 by default ([pr#64635](https://github.com/ceph/ceph/pull/64635), Miki Patel)

- kv/KeyValueDB: New utility function util\_divide\_key\_range ([pr#68981](https://github.com/ceph/ceph/pull/68981), Adam Kupczyk)

- kv/RocksDB: Add instrumentation to BinnedLRUCache ([pr#64819](https://github.com/ceph/ceph/pull/64819), Adam Kupczyk)

- kv/rocksdb: Fix priority of rocksdb cache perf counters ([pr#68376](https://github.com/ceph/ceph/pull/68376), Adam Kupczyk)

- kv/rocksdb: raise rocksdb get latency perf counter ([pr#63063](https://github.com/ceph/ceph/pull/63063), Fei Li)

- libcephfs / pybind: use uid\_t and gid\_t instead of int ([pr#62934](https://github.com/ceph/ceph/pull/62934), Cecilia Lau)

- libcephfs: Bump API major version ([pr#63713](https://github.com/ceph/ceph/pull/63713), Anoop C S)

- libcephfs: convert ceph errno to host-based errno ([pr#65135](https://github.com/ceph/ceph/pull/65135), Rishabh Dave)

- libcephfs: FSCrypt userspace implementation ([pr#61137](https://github.com/ceph/ceph/pull/61137), Christopher Hoffman, Marcus Watts, Rishabh Dave, Igor Golikov, Venky Shankar, Patrick Donnelly, Yehuda Sadeh)

- libcephfs: Implement `ceph\_ll\_get()` API ([pr#62549](https://github.com/ceph/ceph/pull/62549), Anoop C S)

- libcephfs\_proxy: fix passed buffers for fscrypt functions ([pr#68280](https://github.com/ceph/ceph/pull/68280), Xavi Hernandez)

- libcephfs\_proxy: remove arithmetic on void\* ([pr#62975](https://github.com/ceph/ceph/pull/62975), Kefu Chai)

- libcephsqlite: ensure atexit handlers are registered after openssl ([pr#68125](https://github.com/ceph/ceph/pull/68125), Patrick Donnelly)

- librados/asio: clear cancellation slot in associated executor ([pr#68873](https://github.com/ceph/ceph/pull/68873), Casey Bodley)

- librados: Add omap\_rm\_range function to ObjectWriteOperation ([pr#66460](https://github.com/ceph/ceph/pull/66460), Matty Williams)

- librados: aio\_unwatch() delivers ENOTCONN to AioCompletion ([pr#66610](https://github.com/ceph/ceph/pull/66610), Casey Bodley)

- librados: remove unused includes in librados\_c<span></span>.cc ([pr#64520](https://github.com/ceph/ceph/pull/64520), Kefu Chai)

- librbd, tools: migrate from boost::variant to std::variant ([pr#63001](https://github.com/ceph/ceph/pull/63001), Kefu Chai)

- librbd/api/Mirror: return EINVAL from image\_get\_mode() when the image is disabled for mirroring ([pr#63149](https://github.com/ceph/ceph/pull/63149), Ramana Raja)

- librbd/cache/pwl: cancel periodic\_stats timer before perf\_stop() ([pr#70426](https://github.com/ceph/ceph/pull/70426), Sun Yuechi)

- librbd/cache/pwl: fix memory leak in SyncPoint persist context cleanup ([pr#63295](https://github.com/ceph/ceph/pull/63295), Kefu Chai)

- librbd/cache/pwl: WriteLogOperationSet::cell can be garbage ([pr#67368](https://github.com/ceph/ceph/pull/67368), Ilya Dryomov)

- librbd/migration/NativeFormat: support specifying mon\_host and key via spec ([pr#70287](https://github.com/ceph/ceph/pull/70287), Ilya Dryomov, Leonid Chernin)

- librbd/migration/QCOWFormat: avoid use-after-free in execute\_request() ([pr#67919](https://github.com/ceph/ceph/pull/67919), Ilya Dryomov)

- librbd/migration/QCOWFormat: don't complete read\_clusters() inline ([pr#64174](https://github.com/ceph/ceph/pull/64174), Ilya Dryomov)

- librbd/mirror: cleanup EnableRequest::handle\_get\_mirror\_image() ([pr#64545](https://github.com/ceph/ceph/pull/64545), Ramana Raja)

- librbd/mirror: detect trashed snapshots in UnlinkPeerRequest ([pr#67482](https://github.com/ceph/ceph/pull/67482), Ilya Dryomov)

- librbd/pwl: fix memory leaks in discard operations ([pr#66876](https://github.com/ceph/ceph/pull/66876), Kefu Chai)

- librbd: add missing includes ([pr#68761](https://github.com/ceph/ceph/pull/68761), Max Kellermann)

- librbd: add rbd\_aio\_write\_with\_crc32c API for precomputed checksums ([pr#65901](https://github.com/ceph/ceph/pull/65901), Alexander Indenbaum)

- librbd: avoid losing sparseness in read\_parent() ([pr#68202](https://github.com/ceph/ceph/pull/68202), Ilya Dryomov)

- librbd: don't complete ImageUpdateWatchers::shut\_down() prematurely ([pr#67524](https://github.com/ceph/ceph/pull/67524), Ilya Dryomov)

- librbd: fix ExclusiveLock::accept\_request() when !is\_state\_locked() ([pr#66581](https://github.com/ceph/ceph/pull/66581), Ilya Dryomov)

- librbd: fix use-after-free in trash purge on image open error ([pr#70429](https://github.com/ceph/ceph/pull/70429), Sun Yuechi)

- librbd: fix use-after-free releasing object map locks in deep copy ([pr#69873](https://github.com/ceph/ceph/pull/69873), Kefu Chai)

- librbd: images aren't closed in group\_snap\\_\*\_by\_record() on error ([pr#64505](https://github.com/ceph/ceph/pull/64505), Miki Patel)

- librbd: introduce RBD\_LOCK\_MODE\_EXCLUSIVE\_TRANSIENT ([pr#66979](https://github.com/ceph/ceph/pull/66979), Ilya Dryomov)

- librbd: propagate ENOENT for non-existent groups and images ([pr#70743](https://github.com/ceph/ceph/pull/70743), VinayBhaskar-V)

- librbd: rbd\_aio\_write\_with\_crc32c store CRC32C with initial value -1 to match msgr2 validation ([pr#66377](https://github.com/ceph/ceph/pull/66377), Alexander Indenbaum)

- librbd: retry list\_snap\_orders() once instead of failing sort\_snaps() ([pr#63302](https://github.com/ceph/ceph/pull/63302), VinayBhaskar-V)

- librbd: use try\_lexical\_convert instead of throwing lexical\_cast ([pr#67585](https://github.com/ceph/ceph/pull/67585), Kefu Chai)

- log: add missing includes ([pr#65507](https://github.com/ceph/ceph/pull/65507), Max Kellermann)

- logrotate: send SIGHUP to ceph-exporter on log rotation ([pr#67371](https://github.com/ceph/ceph/pull/67371), an.groshev)

- mailmap, githubmap, organisationmap: Add Steven Zuraski ([pr#64699](https://github.com/ceph/ceph/pull/64699), szuraski898)

- mailmap, githubmap, organizationmap: Add Kautilya ([pr#64468](https://github.com/ceph/ceph/pull/64468), Kautilya Tripathi)

- mailmap: Add Karthik U S ([pr#68025](https://github.com/ceph/ceph/pull/68025), Karthik U S)

- mailmap: update affiliation for Kefu Chai ([pr#65730](https://github.com/ceph/ceph/pull/65730), Kefu Chai)

- mailmap: update affiliation for Xinying Song ([pr#66454](https://github.com/ceph/ceph/pull/66454), Xinying Song)

- mailmap: update email address for Ville Ojamo ([pr#67445](https://github.com/ceph/ceph/pull/67445), Casey Bodley)

- make adding Catch2 tests straightforward ([pr#63529](https://github.com/ceph/ceph/pull/63529), Jesse F. Williamson)

- make-debs<span></span>.sh: Avoid OOM errors during build ([pr#65313](https://github.com/ceph/ceph/pull/65313), Zack Cerza)

- make-debs<span></span>.sh: invoke tar with --no-same-owner ([pr#65190](https://github.com/ceph/ceph/pull/65190), Dan Mick)

- make-debs<span></span>.sh: make "skip debug packages" conditional ([pr#65178](https://github.com/ceph/ceph/pull/65178), Dan Mick)

- make-debs<span></span>.sh: Optionally rm version from build dir ([pr#63411](https://github.com/ceph/ceph/pull/63411), Zack Cerza)

- Mark s390x CRC assembly code as not requiring ELF execstack ([pr#67217](https://github.com/ceph/ceph/pull/67217), Aliaksei Makarau)

- mclock : Refactor the mClock scheduler source code ([pr#63516](https://github.com/ceph/ceph/pull/63516), Mohit Agrawal)

- mclock: avoid using config keys for profiles, remove MonClient from MclockConfig ([pr#64978](https://github.com/ceph/ceph/pull/64978), Samuel Just)

- mclock\_common, mClockScheduler: Bound high\_priority drain to prevent starvation ([pr#72179](https://github.com/ceph/ceph/pull/72179), Sridhar Seshasayee)

- mds, client, mgr/volumes: toggle snapshot visibility for subvolume based paths ([pr#64345](https://github.com/ceph/ceph/pull/64345), Venky Shankar, Dhairya Parmar)

- mds/flock: exclude non-persisted fields from ceph\_lock\_state\_t::dump() ([pr#63936](https://github.com/ceph/ceph/pull/63936), Kefu Chai)

- mds/FSMap: fix join\_fscid being incorrectly reset for active MDS during filesystem removal ([pr#65640](https://github.com/ceph/ceph/pull/65640), ethanwu)

- mds/ScrubStack: set added\_children to true for dirfrags too ([pr#68686](https://github.com/ceph/ceph/pull/68686), Rishabh Dave)

- mds: add new performance and subvolume utilization metrics ([pr#66551](https://github.com/ceph/ceph/pull/66551), Venky Shankar, Igor Golikov)

- mds: add retry request to MDSRank wait queue rather via finisher ([issue#76031](http://tracker.ceph.com/issues/76031), [pr#68446](https://github.com/ceph/ceph/pull/68446), Venky Shankar)

- mds: add some perf counters about cache trimming ([pr#62698](https://github.com/ceph/ceph/pull/62698), haoyixing)

- mds: Avoid use of moved 'fs' in FSMap ([pr#65877](https://github.com/ceph/ceph/pull/65877), Edwin Rodriguez)

- mds: compare all fields of inode\_t ([pr#65324](https://github.com/ceph/ceph/pull/65324), Rishabh Dave)

- mds: comply with the valid range for `mds\_log\_max\_segments` ([pr#56634](https://github.com/ceph/ceph/pull/56634), Neeraj Pratap Singh)

- MDS: disallow root directory fragmentation ([pr#64409](https://github.com/ceph/ceph/pull/64409), Andrea Bolzonella)

- mds: drop checking CEPH\_MDS\_OP\_SETLAYOUT two times ([pr#66489](https://github.com/ceph/ceph/pull/66489), Jos Collin)

- mds: enable osdc op throttles ([pr#66578](https://github.com/ceph/ceph/pull/66578), Dan van der Ster)

- mds: fix crash and shutdown hang when ephemeral pins active and max\_mds is 0 ([pr#68413](https://github.com/ceph/ceph/pull/68413), chungfengz)

- mds: fix data race on subvolume\_metrics\_map in MetricsHandler ([pr#67878](https://github.com/ceph/ceph/pull/67878), Igor Golikov)

- mds: fix snapdiff result fragmentation ([pr#64995](https://github.com/ceph/ceph/pull/64995), Igor Fedotov, Md Mahamudur Rahaman Sajib)

- mds: generate symlink inode with correct mode ([pr#63937](https://github.com/ceph/ceph/pull/63937), Kefu Chai)

- mds: improve debugging for snaprealms marked subvolume ([pr#67124](https://github.com/ceph/ceph/pull/67124), Patrick Donnelly)

- mds: introduce BLOCKDIFF feature bit ([issue#70584](http://tracker.ceph.com/issues/70584), [pr#62414](https://github.com/ceph/ceph/pull/62414), Venky Shankar)

- mds: log meaningful error message when entering damaged state ([pr#63220](https://github.com/ceph/ceph/pull/63220), Mykola Golub)

- mds: Mark the scrub passed if dirfrag is dirty ([pr#57953](https://github.com/ceph/ceph/pull/57953), Kotresh HR)

- mds: MDSCap Use default impl for copy and assign op ([pr#65879](https://github.com/ceph/ceph/pull/65879), Edwin Rodriguez)

- mds: nudge log for unstable locks after early reply ([pr#64229](https://github.com/ceph/ceph/pull/64229), Patrick Donnelly)

- mds: persist session auth\_name in ESession journal event ([pr#69037](https://github.com/ceph/ceph/pull/69037), Dhairya Parmar)

- mds: prevent CDir omap commit with empty updates/removals/header ([issue#76455](http://tracker.ceph.com/issues/76455), [pr#68793](https://github.com/ceph/ceph/pull/68793), Venky Shankar)

- mds: Refactor cache dump path formatting ([pr#65878](https://github.com/ceph/ceph/pull/65878), Edwin Rodriguez)

- mds: Refactor Mantle::balance to use std::string ([pr#65883](https://github.com/ceph/ceph/pull/65883), Edwin Rodriguez)

- mds: Remove unnecessary std::move in MDSRank ([pr#65881](https://github.com/ceph/ceph/pull/65881), Edwin Rodriguez)

- mds: Remove unnecessary std::move on trivially-copyable LockOp ([pr#65885](https://github.com/ceph/ceph/pull/65885), Edwin Rodriguez)

- mds: remove unused enum values for subvolume metrics ([pr#65565](https://github.com/ceph/ceph/pull/65565), Igor Golikov)

- mds: Return ceph<span></span>.dir<span></span>.subvolume vxattr ([pr#65104](https://github.com/ceph/ceph/pull/65104), Edwin Rodriguez)

- mds: revert referent inode work ([pr#62351](https://github.com/ceph/ceph/pull/62351), Venky Shankar)

- mds: scrub pins more inodes than the mds\_cache\_memory\_limit ([pr#65858](https://github.com/ceph/ceph/pull/65858), Md Mahamudur Rahaman Sajib)

- mds: session reclaim could miss blocklisting an old session ([pr#66180](https://github.com/ceph/ceph/pull/66180), Venky Shankar)

- mds: update older versioned sr\_t struct(s) to incorporate snapshot visibility flag ([pr#65960](https://github.com/ceph/ceph/pull/65960), Dhairya Parmar)

- mds: use available CInode\* for uninline data ([pr#62684](https://github.com/ceph/ceph/pull/62684), Milind Changire)

- mds: use SimpleLock::WAIT\_ALL for wait mask ([pr#67496](https://github.com/ceph/ceph/pull/67496), Patrick Donnelly)

- mds: wrong snap check for directory with parent snaps ([pr#63524](https://github.com/ceph/ceph/pull/63524), Patrick Donnelly)

- mdstypes: Dump export\_ephemeral\_random\_pin as double ([pr#64325](https://github.com/ceph/ceph/pull/64325), Enrico Bocchi)

- Merge rgw-standalone ([pr#69174](https://github.com/ceph/ceph/pull/69174), Nithya Balachandran, Ali Masarwa, Samarah Uriarte, Daniel Gryniewicz, Matt Benjamin)

- messages: MOSDOpReply encode and decode errorcode32\_t with PGID64 fea… ([pr#65962](https://github.com/ceph/ceph/pull/65962), Nitzan Mordechai)

- mgr daemon ports list grows unbounded across redeploys ([pr#68915](https://github.com/ceph/ceph/pull/68915), Kobi Ginon, Raimund Sacherer)

- mgr, mon, osdc: pass complex parameters by rvalue reference ([pr#65014](https://github.com/ceph/ceph/pull/65014), Max Kellermann)

- mgr, osd, mon: remove pg\_upmap\_primary mappings for PG merge targets ([pr#71050](https://github.com/ceph/ceph/pull/71050), Laura Flores)

- mgr/ActivePyModules: fix dangling string\_view in get\_perf\_schema\_python ([pr#66824](https://github.com/ceph/ceph/pull/66824), Nitzan Mordechai)

- mgr/ActivePyModules: refactor perf schema section management to use RAII ([pr#70504](https://github.com/ceph/ceph/pull/70504), stzuraski898)

- mgr/alerts: enforce ssl context to SMTP\_SSL ([pr#66089](https://github.com/ceph/ceph/pull/66089), Nizamudeen A)

- mgr/balancer: reduce info-level logs ([pr#66068](https://github.com/ceph/ceph/pull/66068), Timothy Q Nguyen)

- mgr/cepahdm: fixing nvmeof scraping Prometheus config generation ([pr#65150](https://github.com/ceph/ceph/pull/65150), Redouane Kachach)

- mgr/cephadm/module<span></span>.py: Run ok\_to\_stop logic for stop ([pr#62745](https://github.com/ceph/ceph/pull/62745), Vallari Agrawal)

- mgr/cephadm/nvmeof: Add fields for prometheus frequency to NVMEOF spec file ([pr#65436](https://github.com/ceph/ceph/pull/65436), Gil Bregman)

- mgr/cephadm/nvmeof: Add Prometheus fields to NVMeOF spec file ([pr#64513](https://github.com/ceph/ceph/pull/64513), Gil Bregman)

- mgr/cephadm/nvmeof: Add susbsystem cache expiration field to NVMeOF spec file ([pr#64382](https://github.com/ceph/ceph/pull/64382), Gil Bregman)

- mgr/cephadm/nvmeof: Allow setting NVMEoF gateway notifications interval in the spec file ([pr#64006](https://github.com/ceph/ceph/pull/64006), Gil Bregman)

- mgr/cephadm/nvmeof: idxd/dsa ([pr#63974](https://github.com/ceph/ceph/pull/63974), Alexander Indenbaum)

- mgr/cephadm/nvmeof: Increase the default limit of max\_namespaces ([pr#64477](https://github.com/ceph/ceph/pull/64477), Gil Bregman)

- mgr/cephadm/smb: Add feature-based REDEPLOY logic for SMB services ([pr#70183](https://github.com/ceph/ceph/pull/70183), Shweta Sodani)

- mgr/cephadm: add \_\_getstate\_\_ so OSD class can be pickled ([pr#67236](https://github.com/ceph/ceph/pull/67236), Adam King)

- mgr/cephadm: Add a new cephadm's API to get nvmeof TLS bundle ([pr#66908](https://github.com/ceph/ceph/pull/66908), Redouane Kachach)

- mgr/cephadm: add certificate support and service spec for node-proxy ([pr#67093](https://github.com/ceph/ceph/pull/67093), Guillaume Abrioux)

- mgr/cephadm: Add check for virtual\_interface\_networks ([pr#65548](https://github.com/ceph/ceph/pull/65548), Bradley Bishop)

- mgr/cephadm: Add CNC fields to NVMEoF spec file ([pr#70607](https://github.com/ceph/ceph/pull/70607), Gil Bregman)

- mgr/cephadm: Add command to stop host drain ([pr#62848](https://github.com/ceph/ceph/pull/62848), Shweta Bhosale)

- mgr/cephadm: Add degraded namespace flag to NVMEoF spec file ([pr#70329](https://github.com/ceph/ceph/pull/70329), Gil Bregman)

- mgr/cephadm: Add IO statistics enable field to the cephadm NVMEoF spe… ([pr#67206](https://github.com/ceph/ceph/pull/67206), Gil Bregman)

- mgr/cephadm: Add KMIP server support for NVMeoF gateway ([pr#68030](https://github.com/ceph/ceph/pull/68030), Gil Bregman)

- mgr/cephadm: add logic to handle certmgr errors and warnings ([pr#66992](https://github.com/ceph/ceph/pull/66992), Redouane Kachach)

- mgr/cephadm: add rbd\_with\_crc32c parameter to nvmeof service spec ([pr#66425](https://github.com/ceph/ceph/pull/66425), Alexander Indenbaum)

- mgr/cephadm: add smb to upgrade order ([pr#62755](https://github.com/ceph/ceph/pull/62755), Adam King)

- mgr/cephadm: Add some new fields to the cephadm NVMEoF spec file ([pr#66968](https://github.com/ceph/ceph/pull/66968), Gil Bregman)

- mgr/cephadm: Add stick table and haproxy peers in haproxy<span></span>.cfg for NFS to support nfs active-active cluster ([pr#65531](https://github.com/ceph/ceph/pull/65531), Shweta Bhosale, Adam King)

- mgr/cephadm: add the VIP to the internal mgmt-gateway cert SAN list ([pr#65806](https://github.com/ceph/ceph/pull/65806), Redouane Kachach)

- mgr/cephadm: add tombstones to persist certs info after mgr failover ([pr#66041](https://github.com/ceph/ceph/pull/66041), Redouane Kachach)

- mgr/cephadm: Added retry logic for execute command if command fails with connection error ([pr#66586](https://github.com/ceph/ceph/pull/66586), Shweta Bhosale)

- mgr/cephadm: After reapplying the osd spec, the OSD services are continuously applied in each serve loop iteration ([pr#65291](https://github.com/ceph/ceph/pull/65291), Shweta Bhosale)

- mgr/cephadm: align nodeid and add register\_service for NFS Ganesha service visibility ([pr#67999](https://github.com/ceph/ceph/pull/67999), Shubha Jain)

- mgr/cephadm: Allow colocation of NFS daemon to support active-active mode ([pr#67087](https://github.com/ceph/ceph/pull/67087), Shweta Bhosale)

- mgr/cephadm: Allow Ingress service to expose the metrics via HTTPS ([pr#64194](https://github.com/ceph/ceph/pull/64194), Shweta Bhosale)

- mgr/cephadm: Allow NFS monitoring port through firewall ([pr#66313](https://github.com/ceph/ceph/pull/66313), Shweta Bhosale)

- mgr/cephadm: allow nvmeof group assignment for NVMe-oF services ([pr#68747](https://github.com/ceph/ceph/pull/68747), Kushal Deb)

- mgr/cephadm: Allow registry credentials to define multiple container registries ([pr#64642](https://github.com/ceph/ceph/pull/64642), Shweta Bhosale)

- mgr/cephadm: allow removing OSDs stuck in error state ([pr#71729](https://github.com/ceph/ceph/pull/71729), Guillaume Abrioux)

- mgr/cephadm: block deploying nvmeof daemons on the same host ([pr#62585](https://github.com/ceph/ceph/pull/62585), Adam King)

- mgr/cephadm: block upgrades onto hosts whose CPU cannot run the target release ([pr#72512](https://github.com/ceph/ceph/pull/72512), David Galloway)

- mgr/cephadm: bump monitoring stack versions ([pr#65855](https://github.com/ceph/ceph/pull/65855), Nizamudeen A)

- mgr/cephadm: Ceph orch apply command does not give error if 'placement' is passed as both positional and keyword argument ([pr#61017](https://github.com/ceph/ceph/pull/61017), Shweta Bhosale)

- mgr/cephadm: Cephadm support for NFS-Ganesha TLS configuration ([pr#65644](https://github.com/ceph/ceph/pull/65644), Shweta Bhosale)

- mgr/cephadm: Change the default of max hosts per namespace in NVMEoF to 16 ([pr#66781](https://github.com/ceph/ceph/pull/66781), Gil Bregman)

- mgr/cephadm: Change the default value of omap\_file\_lock\_duration in  NVMEoF spec file ([pr#67266](https://github.com/ceph/ceph/pull/67266), Gil Bregman)

- mgr/cephadm: cleaning up old migration logic and improving upgrade handling with certmgr ([pr#65567](https://github.com/ceph/ceph/pull/65567), Redouane Kachach)

- mgr/cephadm: clear daemon\_config\_deps entry for removed daemons ([pr#69993](https://github.com/ceph/ceph/pull/69993), Adam King)

- mgr/cephadm: Config parameter to set the max number of OSDs to upgrade in single iteration ([pr#65149](https://github.com/ceph/ceph/pull/65149), Shweta Bhosale)

- mgr/cephadm: configurable per-service stop timeout ([pr#65468](https://github.com/ceph/ceph/pull/65468), Kushal Deb)

- mgr/cephadm: Control cephadm files logging based on a mgr flag ([pr#69735](https://github.com/ceph/ceph/pull/69735), Ashwin M. Joshi)

- mgr/cephadm: create default pool for nvmeof ([pr#68239](https://github.com/ceph/ceph/pull/68239), Kushal Deb)

- mgr/cephadm: deduplicate HAProxy\_Hosts in NFS ganesha<span></span>.conf ([pr#70813](https://github.com/ceph/ceph/pull/70813), Shweta Bhosale)

- mgr/cephadm: disallow changing OSD service type to non-OSD types ([pr#62984](https://github.com/ceph/ceph/pull/62984), Joshua Blanch)

- mgr/cephadm: don't mark nvmeof daemons without pool and group in name as stray ([pr#63170](https://github.com/ceph/ceph/pull/63170), Adam King)

- mgr/cephadm: don't remove and deploy new daemon if ports change during upgrade ([pr#63563](https://github.com/ceph/ceph/pull/63563), Adam King)

- mgr/cephadm: don't remove TLS certs if svc still has daemons on host ([pr#66255](https://github.com/ceph/ceph/pull/66255), Redouane Kachach)

- mgr/cephadm: don't try to map /etc/kmip if it doesn't exist ([pr#68153](https://github.com/ceph/ceph/pull/68153), Gil Bregman)

- mgr/cephadm: During upgrade if NFS cluster is using old nodeids, keep using it ([pr#70809](https://github.com/ceph/ceph/pull/70809), Shweta Bhosale)

- mgr/cephadm: Fix alertmanager TLS and global security handling ([pr#65641](https://github.com/ceph/ceph/pull/65641), Redouane Kachach)

- mgr/cephadm: fix custom alertmanager webhooks ([pr#59889](https://github.com/ceph/ceph/pull/59889), Adam King)

- mgr/cephadm: fix KeyError when host is removed during serve loop ([pr#67735](https://github.com/ceph/ceph/pull/67735), bachmanity1)

- mgr/cephadm: Fix mgmt-gateway default port in get\_port\_start() ([pr#66450](https://github.com/ceph/ceph/pull/66450), Redouane Kachach)

- mgr/cephadm: fix migrations logging ([pr#65551](https://github.com/ceph/ceph/pull/65551), Adam King)

- mgr/cephadm: Fix NFS to work properly in keepalived-only ingress mode ([pr#66381](https://github.com/ceph/ceph/pull/66381), Shweta Bhosale)

- mgr/cephadm: fix nvmeof reconfig loop by preserving daemon deps ([pr#68292](https://github.com/ceph/ceph/pull/68292), Kushal Deb)

- mgr/cephadm: fix nvmeof TLS handling and add coverage for ssl/mTLS ([pr#66495](https://github.com/ceph/ceph/pull/66495), Redouane Kachach)

- mgr/cephadm: Fix RGW zone endpoint auto-update logic in \_update\_rgw\_endpoints method ([pr#66215](https://github.com/ceph/ceph/pull/66215), Aashish Sharma)

- mgr/cephadm: fix typo in schedule<span></span>.py comment (specified) ([pr#68485](https://github.com/ceph/ceph/pull/68485), Kobi Ginon)

- mgr/cephadm: Fix upgrade order validation when using daemon\_types with hosts ([pr#67707](https://github.com/ceph/ceph/pull/67707), Shubha Jain)

- mgr/cephadm: Fixed test\_scheduling<span></span>.py ([pr#68438](https://github.com/ceph/ceph/pull/68438), Shweta Bhosale)

- mgr/cephadm: Fixes infinite loop when OSD zap fails during removal ([pr#68061](https://github.com/ceph/ceph/pull/68061), Joshua Blanch)

- mgr/cephadm: fixing SMB service discovery UT ([pr#64518](https://github.com/ceph/ceph/pull/64518), Redouane Kachach)

- mgr/cephadm: Handle ganesha-rados-grace tool failure ([pr#66257](https://github.com/ceph/ceph/pull/66257), Shweta Bhosale)

- mgr/cephadm: handle possibly undefined template variable in haproxy<span></span>.cfg<span></span>.j2 ([pr#63825](https://github.com/ceph/ceph/pull/63825), Leo Mylonas)

- mgr/cephadm: Handle whitespace in upgrade daemon types ([pr#66331](https://github.com/ceph/ceph/pull/66331), Ujjawal Anand)

- mgr/cephadm: Implement D3N L1 persistent datacache support for RGW ([pr#66778](https://github.com/ceph/ceph/pull/66778), Kushal Deb)

- mgr/cephadm: include cluster FSID in root CA Common Name (CN) ([pr#63162](https://github.com/ceph/ceph/pull/63162), Redouane Kachach, Kushal Deb)

- mgr/cephadm: increase default backend health check interval for NFS ([pr#66121](https://github.com/ceph/ceph/pull/66121), Shweta Bhosale)

- mgr/cephadm: Increase the default expiration time for NVMEoF subsyste… ([pr#65955](https://github.com/ceph/ceph/pull/65955), Gil Bregman)

- mgr/cephadm: limit calls to list\_servers ([pr#64763](https://github.com/ceph/ceph/pull/64763), Adam King)

- mgr/cephadm: Limit the value of max-namespaces-per-subsystem ([pr#65898](https://github.com/ceph/ceph/pull/65898), Gil Bregman)

- mgr/cephadm: mgmt-gateway bind to virtual\_ip ([pr#67344](https://github.com/ceph/ceph/pull/67344), Malik Mann)

- mgr/cephadm: mon public network updating ([pr#66189](https://github.com/ceph/ceph/pull/66189), Timothy Q Nguyen)

- mgr/cephadm: nfs rdma support ([pr#67651](https://github.com/ceph/ceph/pull/67651), Shweta Bhosale)

- mgr/cephadm: prometheus\_sd\_config() returns hostnames instead of IP addresses ([issue#74658](http://tracker.ceph.com/issues/74658), [pr#67339](https://github.com/ceph/ceph/pull/67339), Kobi Ginon)

- mgr/cephadm: Provide appropriate exit codes for orch operations ([pr#62886](https://github.com/ceph/ceph/pull/62886), Kushal Deb)

- mgr/cephadm: Provide option to configure custom haproxy peer communication port ([pr#68152](https://github.com/ceph/ceph/pull/68152), Shweta Bhosale)

- mgr/cephadm: redirect browser to correct port by identity provider ([pr#68712](https://github.com/ceph/ceph/pull/68712), Yonatan Zaken)

- mgr/cephadm: remove SSH error logs from health detail when host is unreachable ([pr#67070](https://github.com/ceph/ceph/pull/67070), Joshua Blanch)

- mgr/cephadm: renames ceph\_device to ceph\_device\_lvm ([pr#65986](https://github.com/ceph/ceph/pull/65986), Robert Sander)

- mgr/cephadm: rotate OSD/MDS keyrings at upgrade time and based off health warnings ([pr#72240](https://github.com/ceph/ceph/pull/72240), Adam King)

- mgr/cephadm: serialize OSD class before returning for OSD rm status ([pr#67858](https://github.com/ceph/ceph/pull/67858), Adam King)

- mgr/cephadm: set health warning for host SSH timeout ([pr#65322](https://github.com/ceph/ceph/pull/65322), Shweta Bhosale)

- mgr/cephadm: set mgr cap for NVMeoF to allow cmd "service dump" ([pr#70609](https://github.com/ceph/ceph/pull/70609), Vallari Agrawal)

- mgr/cephadm: show NO DATA when a host is missing a hardware category ([pr#71725](https://github.com/ceph/ceph/pull/71725), Guillaume Abrioux)

- mgr/cephadm: Skip RDMA device check for NFS during upgrade ([pr#68646](https://github.com/ceph/ceph/pull/68646), Shweta Bhosale)

- mgr/cephadm: splitting services big UT file into smaller per-service files ([pr#67554](https://github.com/ceph/ceph/pull/67554), Redouane Kachach)

- mgr/cephadm: Stop NFS service/daemon from starting automatically after reboot, cephadm to manage startup ([pr#70742](https://github.com/ceph/ceph/pull/70742), Shweta Bhosale)

- mgr/cephadm: support no pool value in spec for nvmeof gateway ([pr#68009](https://github.com/ceph/ceph/pull/68009), Tomer Haskalovitch)

- mgr/cephadm: suppress CEPHADM\_FAILED\_DAEMON for services being removed ([pr#70118](https://github.com/ceph/ceph/pull/70118), Avan Thakkar)

- mgr/cephadm: track TLS spec changes in deps and cleanup stale certmgr entries on cert source transitions ([pr#67308](https://github.com/ceph/ceph/pull/67308), Redouane Kachach)

- mgr/cephadm: update grafana conf for disconnected environment ([pr#65981](https://github.com/ceph/ceph/pull/65981), Nizamudeen A)

- mgr/cephadm: Update haproxy<span></span>.cfg template to support nfs active active deployment ([pr#67720](https://github.com/ceph/ceph/pull/67720), Shweta Bhosale)

- mgr/cephadm: update osdspec\_affinity bdev label on set-spec-affinity ([pr#71731](https://github.com/ceph/ceph/pull/71731), Guillaume Abrioux)

- mgr/cephadm: Updated NFS default protocol to v4 and v3 is enabled only when enable\_nfsv3 is set in the spec ([pr#70075](https://github.com/ceph/ceph/pull/70075), Shweta Bhosale)

- mgr/cephadm: updating maintenance health status in the serve loop ([pr#64402](https://github.com/ceph/ceph/pull/64402), Sam Goyal)

- mgr/cephadm: Use a persistent volume to store Loki DB ([pr#60815](https://github.com/ceph/ceph/pull/60815), Aashish Sharma)

- mgr/cephadm: use same tag for all samba images ([pr#64565](https://github.com/ceph/ceph/pull/64565), Shachar Sharon)

- mgr/cephadm: verify spec service\_id before applying ([pr#67315](https://github.com/ceph/ceph/pull/67315), Timothy Q Nguyen)

- mgr/crash, mgr/status: return negative errno to fix CLI exit code ([pr#68282](https://github.com/ceph/ceph/pull/68282), Kefu Chai)

- mgr/DaemonServer: Aggregate and globally sort OSDs for ok-to-upgrade ([pr#69549](https://github.com/ceph/ceph/pull/69549), Sridhar Seshasayee)

- mgr/DaemonServer: auto-tune stats period when message queue gets backed up ([pr#65611](https://github.com/ceph/ceph/pull/65611), Nitzan Mordechai)

- mgr/DaemonServer: clarify ok-to-upgrade error message for CRUSH buckets ([pr#69270](https://github.com/ceph/ceph/pull/69270), Sridhar Seshasayee)

- mgr/DaemonServer: erase daemon\_connections ref on reset for all peer types ([pr#71037](https://github.com/ceph/ceph/pull/71037), Sunnatillo)

- mgr/DaemonServer: fixed mistype for mgr\_osd\_messages ([pr#60963](https://github.com/ceph/ceph/pull/60963), Konstantin Shalygin)

- mgr/DaemonServer: Implement ok-to-upgrade command ([pr#66108](https://github.com/ceph/ceph/pull/66108), Sridhar Seshasayee)

- mgr/DaemonServer: Limit search for OSDs to upgrade within the crush bucket ([pr#68048](https://github.com/ceph/ceph/pull/68048), Sridhar Seshasayee)

- mgr/DaemonServer: Make an ok-to-upgrade error message more generic ([pr#70390](https://github.com/ceph/ceph/pull/70390), Sridhar Seshasayee)

- mgr/DaemonState: Minimise time we hold the DaemonStateIndex lock ([pr#64764](https://github.com/ceph/ceph/pull/64764), Brad Hubbard)

- mgr/dasboard : Carbonize pools form ([pr#66100](https://github.com/ceph/ceph/pull/66100), Abhishek Desai)

- mgr/dasboard : Fixes navigation e2e test ([pr#66321](https://github.com/ceph/ceph/pull/66321), Abhishek Desai)

- mgr/dasboard : Injest certificate mgmt API into services API ([pr#66465](https://github.com/ceph/ceph/pull/66465), Abhishek Desai)

- mgr/dasboard: Carbonised Toast Notification ([pr#64190](https://github.com/ceph/ceph/pull/64190), Anikait Sehwag)

- mgr/dashbaord: Enable overview landing page ([pr#68052](https://github.com/ceph/ceph/pull/68052), Afreen Misbah)

- mgr/dashboard (test) : refactored tests and resolved TODOs ([pr#68072](https://github.com/ceph/ceph/pull/68072), Syed Ali Ul Hasan)

- mgr/dashboard :  Add certmgr alerts and warings to Prometheus and dashboard ([pr#66090](https://github.com/ceph/ceph/pull/66090), Abhishek Desai)

- mgr/dashboard :  Fixed labels issue ([pr#66516](https://github.com/ceph/ceph/pull/66516), Abhishek Desai)

- mgr/dashboard : 72522 - Remove service instances column to imporve API perf ([pr#64951](https://github.com/ceph/ceph/pull/64951), Abhishek Desai)

- mgr/Dashboard : [Dashboard] Not able to open "About" window ([pr#67997](https://github.com/ceph/ceph/pull/67997), pujaoshahu)

- mgr/dashboard : Add bottom padding for dashboard screens ([pr#67836](https://github.com/ceph/ceph/pull/67836), Abhishek Desai)

- mgr/dashboard : Add cephadm config params to dashboard ([pr#67414](https://github.com/ceph/ceph/pull/67414), Abhishek Desai)

- mgr/dashboard : Add Cert Status column to services page ([pr#66949](https://github.com/ceph/ceph/pull/66949), Abhishek Desai)

- mgr/dashboard : Add Certificate tab under service details ([pr#66962](https://github.com/ceph/ceph/pull/66962), Abhishek Desai)

- mgr/dashboard : add stretch cluster validation for pools form ([pr#67952](https://github.com/ceph/ceph/pull/67952), Abhishek Desai)

- mgr/dashboard : Carbonize -> Report an issue modal ([pr#65894](https://github.com/ceph/ceph/pull/65894), Abhishek Desai)

- mgr/dashboard : Carbonize configuration form ([pr#70527](https://github.com/ceph/ceph/pull/70527), Naman Munet, Abhishek Desai)

- mgr/dashboard : Cephfs Mirroring Entity Deselect fix ([pr#67487](https://github.com/ceph/ceph/pull/67487), Dnyaneshwari Talwekar)

- mgr/dashboard : Favicon issue ([pr#70647](https://github.com/ceph/ceph/pull/70647), Abhishek Desai)

- mgr/dashboard : fix - about model tooltip issue ([pr#66159](https://github.com/ceph/ceph/pull/66159), Devika Babrekar)

- mgr/dashboard : fix - CephFS Authorize Modal Update issue ([pr#66332](https://github.com/ceph/ceph/pull/66332), Devika Babrekar)

- mgr/dashboard : Fix application names in pools form ([pr#67841](https://github.com/ceph/ceph/pull/67841), Abhishek Desai)

- mgr/dashboard : fix css for carbon input fields ([pr#65115](https://github.com/ceph/ceph/pull/65115), Abhishek Desai)

- mgr/dashboard : Fix feedback module enablement ([pr#70474](https://github.com/ceph/ceph/pull/70474), Abhishek Desai)

- mgr/dashboard : Fix secure-monitoring-stack creds issue ([pr#65829](https://github.com/ceph/ceph/pull/65829), Abhishek Desai)

- mgr/dashboard : Fix services restart/stop issue ([pr#68493](https://github.com/ceph/ceph/pull/68493), Abhishek Desai)

- mgr/dashboard : fix-non-versioning-bucket-issue ([pr#68465](https://github.com/ceph/ceph/pull/68465), Abhishek Desai)

- mgr/dashboard : Fixed mirrored image usage info bar ([pr#64855](https://github.com/ceph/ceph/pull/64855), Abhishek Desai)

- mgr/dashboard : Fixed usage bar for secondary site in rbd mirroing ([pr#65852](https://github.com/ceph/ceph/pull/65852), Abhishek Desai)

- mgr/dashboard : Fixed warning icon colour issue with carbon colour ([pr#66182](https://github.com/ceph/ceph/pull/66182), Abhishek Desai)

- mgr/dashboard : Fixes EC profile used pool empty ([pr#68648](https://github.com/ceph/ceph/pull/68648), Abhishek Desai)

- mgr/dashboard : Hide suppressed  alert on landing page ([pr#65459](https://github.com/ceph/ceph/pull/65459), Abhishek Desai)

- mgr/dashboard : Optimized /host API to minimum resp ([pr#65102](https://github.com/ceph/ceph/pull/65102), Abhishek Desai)

- mgr/dashboard : Remove subalerts details for multiple subalerts ([pr#66179](https://github.com/ceph/ceph/pull/66179), Abhishek Desai)

- mgr/dashboard : Restrict create storage class with existing name ([pr#67843](https://github.com/ceph/ceph/pull/67843), Abhishek Desai)

- mgr/dashboard : Skip calls until secure\_monitoring\_stack is enabled ([pr#65119](https://github.com/ceph/ceph/pull/65119), Abhishek Desai)

- mgr/dashboard : Support wildcard sans and zonegroup hostnames ([pr#69678](https://github.com/ceph/ceph/pull/69678), Abhishek Desai)

- mgr/dashboard : Unable to remove gateway node from gateway group ([pr#68302](https://github.com/ceph/ceph/pull/68302), pujaoshahu)

- mgr/dashboard : Update create/edit service modal to support certmg ([pr#67276](https://github.com/ceph/ceph/pull/67276), Abhishek Desai)

- mgr/dashboard : update telemetry notification for simple mode ([pr#67522](https://github.com/ceph/ceph/pull/67522), Abhishek Desai)

- mgr/dashboard update ceph nvmeof proto files ([pr#63564](https://github.com/ceph/ceph/pull/63564), Tomer Haskalovitch)

- mgr/dashboard: "Access Denied" being shown on overview page for read-only user ([pr#68653](https://github.com/ceph/ceph/pull/68653), Devika Babrekar)

- mgr/dashboard: --no-group-append default value to False, aligned with old cli ([pr#65504](https://github.com/ceph/ceph/pull/65504), Tomer Haskalovitch)

- mgr/dashboard: 72409 : Fixed parsing error in grafana for host overall performance iframe ([pr#64825](https://github.com/ceph/ceph/pull/64825), Abhishek Desai)

- mgr/dashboard: 75312 Making EC profile default plugin value to ISA ([pr#67645](https://github.com/ceph/ceph/pull/67645), Devika Babrekar)

- mgr/dashboard: 75872 fixing iops values as whole numbers ([pr#68219](https://github.com/ceph/ceph/pull/68219), Devika Babrekar)

- mgr/dashboard: [RGW-NFS]: User level export creation via UI fails with 500 - Internal Server Error ([pr#66901](https://github.com/ceph/ceph/pull/66901), Dnyaneshwari Talwekar)

- mgr/dashboard: [RGW] - Target Storage Class in s3 tiering Config ([pr#65020](https://github.com/ceph/ceph/pull/65020), Dnyaneshwari Talwekar)

- mgr/dashboard: [snap-visibility]Edit Client config option remains stuck in loading when nfs user is configured ([pr#68537](https://github.com/ceph/ceph/pull/68537), Dnyaneshwari Talwekar)

- mgr/dashboard: [storage-class]: Deleting local storage class from UI does not remove its entry from zone ([pr#67833](https://github.com/ceph/ceph/pull/67833), Dnyaneshwari Talwekar)

- mgr/dashboard: About panel showing other icons in background while open ([pr#64955](https://github.com/ceph/ceph/pull/64955), pujashahu)

- mgr/dashboard: accept dot(<span></span>.) in user\_id & restrict tenant validation in user form ([pr#63319](https://github.com/ceph/ceph/pull/63319), Naman Munet)

- mgr/dashboard: Add "connection get\_io\_statistics" to NVMeoF CLI ([pr#67810](https://github.com/ceph/ceph/pull/67810), Gil Bregman)

- mgr/dashboard: Add 'network\_mask' to nvmeof cli ([pr#67766](https://github.com/ceph/ceph/pull/67766), Vallari Agrawal)

- mgr/dashboard: Add --force flag for listeners ([pr#63961](https://github.com/ceph/ceph/pull/63961), Afreen Misbah)

- mgr/dashboard: add account name duplicate check ([pr#70064](https://github.com/ceph/ceph/pull/70064), Naman Munet)

- mgr/dashboard: Add alerts card ([pr#67460](https://github.com/ceph/ceph/pull/67460), Afreen Misbah)

- mgr/dashboard: add API endpoint for consistency group name update ([pr#66533](https://github.com/ceph/ceph/pull/66533), Imran Imtiaz)

- mgr/dashboard: add API endpoint to add images to consistency groups ([pr#66228](https://github.com/ceph/ceph/pull/66228), Imran Imtiaz)

- mgr/dashboard: add API endpoint to create consistency groups ([pr#66218](https://github.com/ceph/ceph/pull/66218), Imran Imtiaz)

- mgr/dashboard: add API endpoint to delete consistency group ([pr#66617](https://github.com/ceph/ceph/pull/66617), Imran Imtiaz)

- mgr/dashboard: add API endpoint to delete images from consistency groups ([pr#66461](https://github.com/ceph/ceph/pull/66461), Imran Imtiaz)

- mgr/dashboard: add API endpoint to list consistency groups ([pr#66184](https://github.com/ceph/ceph/pull/66184), Imran Imtiaz)

- mgr/dashboard: Add apis for add/del hosts on namespaces ([pr#67277](https://github.com/ceph/ceph/pull/67277), Afreen Misbah)

- mgr/dashboard: Add application overview page to grafana ([pr#62841](https://github.com/ceph/ceph/pull/62841), Ankush Behl)

- mgr/dashboard: Add application/json content type to api doc respones ([pr#66644](https://github.com/ceph/ceph/pull/66644), Pedro Gonzalez Gomez)

- mgr/dashboard: Add Archive zone configuration to the Dashboard ([pr#67060](https://github.com/ceph/ceph/pull/67060), Aashish Sharma)

- mgr/dashboard: add CephFS mirror endpoints ([pr#66846](https://github.com/ceph/ceph/pull/66846), Pedro Gonzalez Gomez)

- mgr/dashboard: add CephFS Mirroring enablement page ([pr#67112](https://github.com/ceph/ceph/pull/67112), Pedro Gonzalez Gomez)

- mgr/dashboard: add CRUD API endpoints for consistency group snapshots 1/2 ([pr#66686](https://github.com/ceph/ceph/pull/66686), Imran Imtiaz)

- mgr/dashboard: add customizations to table-actions ([pr#65285](https://github.com/ceph/ceph/pull/65285), Naman Munet)

- mgr/dashboard: Add default state when gateway groups are empty ([pr#63174](https://github.com/ceph/ceph/pull/63174), Afreen Misbah)

- mgr/dashboard: Add DHCHAP controller key to NVME host commands ([pr#67569](https://github.com/ceph/ceph/pull/67569), Gil Bregman)

- mgr/dashboard: Add EC pools support to NVMEoF CLI ([pr#69126](https://github.com/ceph/ceph/pull/69126), Gil Bregman)

- mgr/dashboard: add footer to side-panel ([pr#66259](https://github.com/ceph/ceph/pull/66259), Naman Munet)

- mgr/dashboard: Add full page tearsheet component ([pr#66810](https://github.com/ceph/ceph/pull/66810), Afreen Misbah)

- mgr/dashboard: Add generic component for icons ([pr#64329](https://github.com/ceph/ceph/pull/64329), Afreen Misbah)

- mgr/dashboard: Add generic wizard component ([pr#66752](https://github.com/ceph/ceph/pull/66752), Afreen Misbah)

- mgr/dashboard: add GET API endpoint for consistency groups ([pr#66340](https://github.com/ceph/ceph/pull/66340), Imran Imtiaz)

- mgr/dashboard: add GET endpoints for CephFS mirror peers ([pr#66339](https://github.com/ceph/ceph/pull/66339), Pedro Gonzalez Gomez)

- mgr/dashboard: add get\_subsystem nvme command ([pr#66715](https://github.com/ceph/ceph/pull/66715), Tomer Haskalovitch)

- mgr/dashboard: Add health check panel ([pr#67386](https://github.com/ceph/ceph/pull/67386), Afreen Misbah)

- mgr/dashboard: add help for nvmeof cli ([pr#64517](https://github.com/ceph/ceph/pull/64517), Tomer Haskalovitch)

- mgr/dashboard: add helper text to bucket form > policy and other spacing fixes ([pr#67815](https://github.com/ceph/ceph/pull/67815), Naman Munet)

- mgr/dashboard: Add Hosts via CSV Upload ([pr#67935](https://github.com/ceph/ceph/pull/67935), Sagar Gopale)

- mgr/dashboard: add indentation to the json output of nvmeof cli commands ([pr#66783](https://github.com/ceph/ceph/pull/66783), Tomer Haskalovitch)

- mgr/dashboard: Add location to gateway info command in NVMeoF CLI ([pr#68343](https://github.com/ceph/ceph/pull/68343), Gil Bregman)

- mgr/dashboard: add missing commands for subsystem: change\_key and del… ([pr#64390](https://github.com/ceph/ceph/pull/64390), Tomer Haskalovitch)

- mgr/dashboard: Add missing fields to subsytem list API/CLI ([pr#63308](https://github.com/ceph/ceph/pull/63308), Tomer Haskalovitch)

- mgr/dashboard: add missing namespace CLI commands ([pr#63988](https://github.com/ceph/ceph/pull/63988), Tomer Haskalovitch)

- mgr/dashboard: add multiple ceph users deletion ([pr#65268](https://github.com/ceph/ceph/pull/65268), Pedro Gonzalez Gomez)

- mgr/dashboard: Add namespace encryption support to NVMeoF CLI ([pr#68230](https://github.com/ceph/ceph/pull/68230), Gil Bregman)

- mgr/dashboard: Add new landing page component ([pr#66910](https://github.com/ceph/ceph/pull/66910), Afreen Misbah)

- mgr/dashboard: add nsid param to ns add command ([pr#65503](https://github.com/ceph/ceph/pull/65503), Tomer Haskalovitch)

- mgr/dashboard: add nsid param to ns list command ([pr#65610](https://github.com/ceph/ceph/pull/65610), Tomer Haskalovitch)

- mgr/dashboard: Add nvmeof edit host key in subsystem resources page ([pr#67340](https://github.com/ceph/ceph/pull/67340), pujaoshahu)

- mgr/dashboard: Add nvmeof namespace list and delete modal ([pr#66981](https://github.com/ceph/ceph/pull/66981), pujaoshahu)

- mgr/dashboard: Add nvmeof\_top\_cli service ([pr#64718](https://github.com/ceph/ceph/pull/64718), Vallari Agrawal)

- mgr/dashboard: add oauth2 sso prerequisites and fixes missing claims and expired token ([pr#68806](https://github.com/ceph/ceph/pull/68806), Pedro Gonzalez Gomez)

- mgr/dashboard: Add option to edit zone with keys/argument like"sync\_from" and "sync\_from\_all" ([pr#68114](https://github.com/ceph/ceph/pull/68114), Aashish Sharma)

- mgr/dashboard: Add option to set motd via api ([pr#68183](https://github.com/ceph/ceph/pull/68183), Aashish Sharma)

- mgr/dashboard: add page header component ([pr#67104](https://github.com/ceph/ceph/pull/67104), Pedro Gonzalez Gomez)

- mgr/dashboard: Add port and secure-listeners to subsystem add NVMeoF CLI command ([pr#68363](https://github.com/ceph/ceph/pull/68363), Gil Bregman)

- mgr/dashboard: Add productive card component ([pr#66914](https://github.com/ceph/ceph/pull/66914), Afreen Misbah)

- mgr/dashboard: add remote write section to prometheus configuration ([pr#68667](https://github.com/ceph/ceph/pull/68667), Nizamudeen A, Aashish Sharma)

- mgr/dashboard: Add remove host in subsystem resource page ([pr#67347](https://github.com/ceph/ceph/pull/67347), pujaoshahu)

- mgr/dashboard: Add resiliency card ([pr#67541](https://github.com/ceph/ceph/pull/67541), Afreen Misbah)

- mgr/dashboard: Add restore events in notification screen ([pr#65405](https://github.com/ceph/ceph/pull/65405), pujashahu, pujaoshahu)

- mgr/dashboard: add reusable carbon popover ([pr#64388](https://github.com/ceph/ceph/pull/64388), Naman Munet)

- mgr/dashboard: Add RGW bucket notification listing in dashboard ([pr#62767](https://github.com/ceph/ceph/pull/62767), pujaoshahu, pujashahu)

- mgr/dashboard: Add RGW CRUD topic in dashboard ([pr#61989](https://github.com/ceph/ceph/pull/61989), pujaoshahu)

- mgr/dashboard: add rollback/update API endpoints for consistency group snapshots ([pr#66734](https://github.com/ceph/ceph/pull/66734), Imran Imtiaz)

- mgr/dashboard: add schedule\_level to image API for pool/cluster snapshot schedule ([pr#67442](https://github.com/ceph/ceph/pull/67442), Imran Imtiaz)

- mgr/dashboard: Add secure and verify-host-name to "listener add" on NVMeoF CLI ([pr#67760](https://github.com/ceph/ceph/pull/67760), Gil Bregman)

- mgr/dashboard: add SMB share QoS rate limiting ([pr#67291](https://github.com/ceph/ceph/pull/67291), Pedro Gonzalez Gomez)

- mgr/dashboard: Add step 1 for subsystem form ([pr#67106](https://github.com/ceph/ceph/pull/67106), Afreen Misbah)

- mgr/dashboard: Add storage carbonization umbrella ([pr#70176](https://github.com/ceph/ceph/pull/70176), Devika Babrekar, Afreen Misbah, Syed Ali Ul Hasan)

- mgr/dashboard: Add storage card to overview page ([pr#67256](https://github.com/ceph/ceph/pull/67256), Afreen Misbah)

- mgr/dashboard: add storage consumption card ([pr#67517](https://github.com/ceph/ceph/pull/67517), Aashish Sharma)

- mgr/dashboard: add support for inline-tip notification ([pr#64225](https://github.com/ceph/ceph/pull/64225), Naman Munet)

- mgr/dashboard: Add Sync from/sync from all options on master zone edit ([pr#69167](https://github.com/ceph/ceph/pull/69167), Aashish Sharma)

- mgr/dashboard: add tab structure to File Systems page and embed Ceph-Filesystem Overview dashboard ([pr#64405](https://github.com/ceph/ceph/pull/64405), Abhishek Desai)

- mgr/dashboard: add telemetry status to overview-health-card ([pr#67950](https://github.com/ceph/ceph/pull/67950), Pedro Gonzalez Gomez)

- mgr/dashboard: add text-label-list component ([pr#65735](https://github.com/ceph/ceph/pull/65735), Pedro Gonzalez Gomez)

- mgr/dashboard: add text/javascript to gzip mime types ([pr#70925](https://github.com/ceph/ceph/pull/70925), Afreen Misbah)

- mgr/dashboard: Added application label to pool\_metadata query ([pr#62743](https://github.com/ceph/ceph/pull/62743), Ankush Behl)

- mgr/dashboard: added node-exporter dashboard ([pr#62360](https://github.com/ceph/ceph/pull/62360), Ankush Behl)

- mgr/dashboard: Adding QAT Compression dropdown on RGW Service form ([pr#66507](https://github.com/ceph/ceph/pull/66507), Devika Babrekar)

- mgr/dashboard: Adding RADOS namespace option into add\_ns\_req ([pr#67330](https://github.com/ceph/ceph/pull/67330), gadi-didi)

- mgr/dashboard: Adding RGW Bucket Notification Dashboard for Grafana ([pr#63641](https://github.com/ceph/ceph/pull/63641), Anushruti Sharma)

- mgr/dashboard: alert panel enhancements ([pr#64638](https://github.com/ceph/ceph/pull/64638), Naman Munet)

- mgr/dashboard: align cli commands listener list, ns list, host list ([pr#63366](https://github.com/ceph/ceph/pull/63366), Tomer Haskalovitch)

- mgr/dashboard: align gw info, gw version, spdk\_log\_level get with old cli ([pr#63335](https://github.com/ceph/ceph/pull/63335), Tomer Haskalovitch)

- mgr/dashboard: align response of subsystem add and ns add with old cli ([pr#63410](https://github.com/ceph/ceph/pull/63410), Tomer Haskalovitch)

- mgr/dashboard: Align RGW Account Role forms with updated UX design ([pr#70113](https://github.com/ceph/ceph/pull/70113), Sagar Gopale)

- mgr/dashboard: align RGW role management with Carbon and fix API routing ([pr#69698](https://github.com/ceph/ceph/pull/69698), Sagar Gopale)

- mgr/dashboard: Allow adding authentication to subsystem flow ([pr#67480](https://github.com/ceph/ceph/pull/67480), Afreen Misbah)

- mgr/dashboard: Allow creating nvmeof gateway group via new flow ([pr#67991](https://github.com/ceph/ceph/pull/67991), Afreen Misbah)

- mgr/dashboard: allow deletion of non-default zone and zonegroup ([pr#66119](https://github.com/ceph/ceph/pull/66119), Aashish Sharma)

- mgr/dashboard: Allow empty port value when adding a listener in NVMEoF CLI ([pr#68749](https://github.com/ceph/ceph/pull/68749), Gil Bregman)

- mgr/dashboard: Allow FQDN in Connect Cluster form -> Cluster API URL ([pr#65566](https://github.com/ceph/ceph/pull/65566), Aashish Sharma)

- mgr/dashboard: Allow host with labels in listener form ([pr#63963](https://github.com/ceph/ceph/pull/63963), Afreen Misbah)

- mgr/dashboard: Allow moving to next when Bidirectional mode is chosen ([pr#68529](https://github.com/ceph/ceph/pull/68529), Afreen Misbah)

- mgr/dashboard: Allow quick bootstrap script to use custom images ([pr#68801](https://github.com/ceph/ceph/pull/68801), Afreen Misbah)

- mgr/dashboard: Allow the user to re-use existing realm/zg/zone and setup replication ([pr#62906](https://github.com/ceph/ceph/pull/62906), Aashish Sharma)

- mgr/dashboard: Allow upper case encryption algorithm values in NVMeoF CLI ([pr#68456](https://github.com/ceph/ceph/pull/68456), Gil Bregman)

- mgr/dashboard: angular 20, and html linter fixes [batch] ([pr#70871](https://github.com/ceph/ceph/pull/70871), Nizamudeen A, Afreen Misbah, Kefu Chai, Pedro Gonzalez Gomez)

- mgr/dashboard: Backport hardware ([pr#70585](https://github.com/ceph/ceph/pull/70585), Afreen Misbah)

- mgr/dashboard: Blank entry for Storage Capacity in dashboard under Cluster > Expand Cluster > Review ([pr#65652](https://github.com/ceph/ceph/pull/65652), Naman Munet)

- mgr/dashboard: Breadcrumb should allow going back to subsystem tab ([pr#67643](https://github.com/ceph/ceph/pull/67643), pujaoshahu)

- mgr/dashboard: bump angular to 19<span></span>.2<span></span>.25 ([pr#70070](https://github.com/ceph/ceph/pull/70070), Nizamudeen A)

- mgr/dashboard: Bump grafana version to 11<span></span>.6<span></span>.0 ([pr#62827](https://github.com/ceph/ceph/pull/62827), Afreen Misbah)

- mgr/dashboard: Bump lodash ([pr#68694](https://github.com/ceph/ceph/pull/68694), Afreen Misbah)

- mgr/dashboard: bump nvmeof submodule to 1<span></span>.6<span></span>.5 ([pr#67044](https://github.com/ceph/ceph/pull/67044), Tomer Haskalovitch)

- mgr/dashboard: bump nvmeof submodule to 1<span></span>.6<span></span>.7 ([pr#67410](https://github.com/ceph/ceph/pull/67410), Vallari Agrawal)

- mgr/dashboard: bump nvmeof submodule to 1<span></span>.7<span></span>.2 ([pr#67992](https://github.com/ceph/ceph/pull/67992), Vallari Agrawal)

- mgr/dashboard: bump tar-fs from 2<span></span>.1<span></span>.2 to 2<span></span>.1<span></span>.3 in /src/pybind/mgr/dashboard/frontend ([pr#63671](https://github.com/ceph/ceph/pull/63671), dependabot[bot])

- mgr/dashboard: bump validator package to address vulnerability ([pr#66082](https://github.com/ceph/ceph/pull/66082), Naman Munet)

- mgr/dashboard: bump validator<span></span>.js to 13<span></span>.15<span></span>.23 ([pr#66631](https://github.com/ceph/ceph/pull/66631), Nizamudeen A)

- mgr/dashboard: bump vite and @angular-devkit/build-angular in /src/pybind/mgr/dashboard/frontend ([pr#63891](https://github.com/ceph/ceph/pull/63891), dependabot[bot])

- mgr/dashboard: carbonise multi-cluster forms ([pr#66583](https://github.com/ceph/ceph/pull/66583), Aashish Sharma)

- mgr/dashboard: Carbonised Notification area component ([pr#64587](https://github.com/ceph/ceph/pull/64587), Afreen Misbah, Anikait Sehwag)

- mgr/dashboard: Carbonised Notification Header ([pr#64375](https://github.com/ceph/ceph/pull/64375), Anikait Sehwag)

- mgr/dashboard: Carbonize Administration module > Create Realm/Zone group/zone ([pr#65972](https://github.com/ceph/ceph/pull/65972), Dnyaneshwari Talwekar)

- mgr/dashboard: Carbonize Block Module > NVme-Listing Gateway group ([pr#66281](https://github.com/ceph/ceph/pull/66281), pujaoshahu)

- mgr/dashboard: Carbonize cluster-wide OSD flags modal ([pr#68891](https://github.com/ceph/ceph/pull/68891), Sagar Gopale)

- mgr/dashboard: Carbonize Icons for Modules (Block, Object, File, Observability, Administration) ([pr#60797](https://github.com/ceph/ceph/pull/60797), Prachi)

- mgr/dashboard: Carbonize multisite sync policy forms ([pr#66105](https://github.com/ceph/ceph/pull/66105), Naman Munet)

- mgr/dashboard: carbonize RGW overview dashboard ([pr#68986](https://github.com/ceph/ceph/pull/68986), Afreen Misbah)

- mgr/dashboard: carbonize service form ([pr#65751](https://github.com/ceph/ceph/pull/65751), Pedro Gonzalez Gomez)

- mgr/dashboard: carbonize table filters ([pr#68990](https://github.com/ceph/ceph/pull/68990), Nizamudeen A)

- mgr/dashboard: Carbonize the Change Password Form ([pr#66006](https://github.com/ceph/ceph/pull/66006), Afreen Misbah)

- mgr/dashboard: carbonize-delete-zone-modal ([pr#66761](https://github.com/ceph/ceph/pull/66761), Sagar Gopale)

- mgr/dashboard: carbonize-delete-zonegroup-modal ([pr#66731](https://github.com/ceph/ceph/pull/66731), Sagar Gopale)

- mgr/dashboard: carbonize-osd-flags-modal ([pr#66776](https://github.com/ceph/ceph/pull/66776), Sagar Gopale)

- mgr/dashboard: Carbonized - Multisite Zone (Create and Edit) ([pr#66116](https://github.com/ceph/ceph/pull/66116), Dnyaneshwari Talwekar)

- mgr/dashboard: carbonized-multisite-export-realm-token-modal ([pr#66576](https://github.com/ceph/ceph/pull/66576), Sagar Gopale)

- mgr/dashboard: catch broader exception to show relevant cli output ([pr#65028](https://github.com/ceph/ceph/pull/65028), Tomer Haskalovitch)

- mgr/dashboard: Cephfs Mirroring - Entity ([pr#66857](https://github.com/ceph/ceph/pull/66857), Dnyaneshwari Talwekar)

- mgr/dashboard: Cephfs mirroring Filesystem Selection ([pr#66821](https://github.com/ceph/ceph/pull/66821), Dnyaneshwari Talwekar)

- mgr/dashboard: Cephfs Mirroring Listing ([pr#66195](https://github.com/ceph/ceph/pull/66195), Dnyaneshwari Talwekar)

- mgr/dashboard: Cephfs Mirroring Wizard ([pr#66616](https://github.com/ceph/ceph/pull/66616), Dnyaneshwari Talwekar)

- mgr/dashboard: change the default max namespace from 4096 to None in subsystem add command ([pr#65848](https://github.com/ceph/ceph/pull/65848), Tomer Haskalovitch)

- mgr/dashboard: close token status subscription properly ([pr#64980](https://github.com/ceph/ceph/pull/64980), Nizamudeen A)

- mgr/dashboard: Combining Quorum tables data on Monitors page ([pr#69040](https://github.com/ceph/ceph/pull/69040), Devika Babrekar)

- mgr/dashboard: Converting add storage wizard into tearsheet ([pr#68977](https://github.com/ceph/ceph/pull/68977), Devika Babrekar)

- mgr/dashboard: Create and delete and update s3 notification in dashboard ([pr#62992](https://github.com/ceph/ceph/pull/62992), pujaoshahu)

- mgr/dashboard: Create-namespace-form ([pr#67242](https://github.com/ceph/ceph/pull/67242), Sagar Gopale)

- mgr/dashboard: Creating CephFS dashboard for Grafana ([pr#62164](https://github.com/ceph/ceph/pull/62164), Piyush Agarwal)

- mgr/dashboard: cypress tests do not fail on failures ([pr#64680](https://github.com/ceph/ceph/pull/64680), Afreen Misbah)

- mgr/dashboard: Dashboard nfs export editor rejects ipv6 addresses ([pr#65169](https://github.com/ceph/ceph/pull/65169), Afreen Misbah)

- mgr/dashboard: delete-gateway-nodes ([pr#67132](https://github.com/ceph/ceph/pull/67132), Sagar Gopale)

- mgr/dashboard: deprecate `transifex-i18ntool` and support transifex cli ([pr#63039](https://github.com/ceph/ceph/pull/63039), Afreen Misbah)

- mgr/dashboard: Difference in "path" value observed when rgw user level export created via dashboard vs cli ([pr#68541](https://github.com/ceph/ceph/pull/68541), Dnyaneshwari Talwekar)

- mgr/dashboard: differentiate account users from rgw users in bucket form ([pr#64362](https://github.com/ceph/ceph/pull/64362), Naman Munet)

- mgr/dashboard: disable ibm telemetry on CI env ([pr#70477](https://github.com/ceph/ceph/pull/70477), Nizamudeen A)

- mgr/dashboard: don't mutate the cached osd\_map in CephService ([pr#69317](https://github.com/ceph/ceph/pull/69317), Kefu Chai)

- mgr/dashboard: edit realm modal not working ([pr#66330](https://github.com/ceph/ceph/pull/66330), Naman Munet)

- mgr/dashboard: Edit user via UI throwing multiple server errors ([pr#66047](https://github.com/ceph/ceph/pull/66047), Naman Munet)

- mgr/dashboard: emit success and error on copy2cliboard ([pr#66630](https://github.com/ceph/ceph/pull/66630), Nizamudeen A)

- mgr/dashboard: empty-data-message ([pr#66803](https://github.com/ceph/ceph/pull/66803), Sagar Gopale)

- mgr/dashboard: Enable gray 10 theme as per carbon standards ([pr#68026](https://github.com/ceph/ceph/pull/68026), Afreen Misbah)

- mgr/dashboard: Enable rgw module automatically in the primary and secondary cluster if not enabled during multi-site automation ([pr#62929](https://github.com/ceph/ceph/pull/62929), Aashish Sharma)

- mgr/dashboard: Encryption key not being passed in gateway group form ([pr#68547](https://github.com/ceph/ceph/pull/68547), Afreen Misbah)

- mgr/dashboard: expose image summary API ([pr#65079](https://github.com/ceph/ceph/pull/65079), Nizamudeen A)

- mgr/dashboard: fetch all namespaces in a gateway group ([pr#67101](https://github.com/ceph/ceph/pull/67101), Afreen Misbah)

- mgr/dashboard: file/smb: Create SMB share dialog is missing a share name input ([pr#65907](https://github.com/ceph/ceph/pull/65907), Dnyaneshwari Talwekar)

- mgr/dashboard: Final merged branch for subsystem complete flow ([pr#67535](https://github.com/ceph/ceph/pull/67535), pujaoshahu, Sagar Gopale)

- mgr/dashboard: fix add host API path for namespace mapping in NVMe/TCP ([pr#67716](https://github.com/ceph/ceph/pull/67716), Sagar Gopale)

- mgr/dashboard: fix alignment of log action buttons ([pr#63784](https://github.com/ceph/ceph/pull/63784), prik73)

- mgr/dashboard: Fix applicatin pool table for filtered pools ([pr#63347](https://github.com/ceph/ceph/pull/63347), Ankush Behl)

- mgr/dashboard: fix bind address regression from CherryPy isolation ([pr#69714](https://github.com/ceph/ceph/pull/69714), Afreen Misbah)

- mgr/dashboard: Fix breaking overview page ([pr#67714](https://github.com/ceph/ceph/pull/67714), Afreen Misbah)

- mgr/dashboard: fix bucket replication disable ([pr#64708](https://github.com/ceph/ceph/pull/64708), Naman Munet)

- mgr/dashboard: Fix capitalization in SMB ([pr#63675](https://github.com/ceph/ceph/pull/63675), Afreen Misbah)

- mgr/dashboard: fix cephadm e2e dependency graph failure ([pr#66088](https://github.com/ceph/ceph/pull/66088), Nizamudeen A)

- mgr/dashboard: fix cephadm e2e failure ([pr#66103](https://github.com/ceph/ceph/pull/66103), Nizamudeen A)

- mgr/dashboard: fix command alias help message ([pr#65612](https://github.com/ceph/ceph/pull/65612), Tomer Haskalovitch)

- mgr/dashboard: fix consumption chart units ([pr#67667](https://github.com/ceph/ceph/pull/67667), Aashish Sharma)

- mgr/dashboard: fix daemon e2e ([pr#69731](https://github.com/ceph/ceph/pull/69731), Naman Munet)

- mgr/dashboard: Fix daemon\_name for NVMeoFClient ([pr#69960](https://github.com/ceph/ceph/pull/69960), Vallari Agrawal)

- mgr/dashboard: fix dashboard freeze on missing smb permissions ([pr#65840](https://github.com/ceph/ceph/pull/65840), Pedro Gonzalez Gomez)

- mgr/dashboard: Fix delete listener ([pr#63165](https://github.com/ceph/ceph/pull/63165), Afreen Misbah)

- mgr/dashboard: fix delete subsystem issue ([pr#68160](https://github.com/ceph/ceph/pull/68160), Sagar Gopale)

- mgr/dashboard: Fix display of IP address in host page ([pr#66638](https://github.com/ceph/ceph/pull/66638), Afreen Misbah)

- mgr/dashboard: Fix duplicate selection on multi-select in table component ([pr#65146](https://github.com/ceph/ceph/pull/65146), Aashish Sharma)

- mgr/dashboard: fix duplicated editing of cell ([pr#65669](https://github.com/ceph/ceph/pull/65669), Nizamudeen A)

- mgr/dashboard: Fix edit and delete access for pool-manager role ([pr#68868](https://github.com/ceph/ceph/pull/68868), Afreen Misbah)

- mgr/dashboard: fix flaky promql query test ([pr#63279](https://github.com/ceph/ceph/pull/63279), Aashish Sharma)

- mgr/dashboard: Fix footer of notification panel ([pr#67180](https://github.com/ceph/ceph/pull/67180), Afreen Misbah)

- mgr/dashboard: Fix for EC profile creation modal scrollbar ([pr#69778](https://github.com/ceph/ceph/pull/69778), Devika Babrekar)

- mgr/dashboard: fix generic form submit validator for inline edit ([pr#65973](https://github.com/ceph/ceph/pull/65973), Nizamudeen A)

- mgr/dashboard: fix icon alignment in navigation header ([pr#66084](https://github.com/ceph/ceph/pull/66084), Naman Munet)

- mgr/dashboard: Fix inline markup warning in API documentation ([pr#64164](https://github.com/ceph/ceph/pull/64164), Kefu Chai)

- mgr/dashboard: Fix issue with loading localization module ([pr#64667](https://github.com/ceph/ceph/pull/64667), Afreen Misbah)

- mgr/dashboard: fix KeyError exception in HardwareService<span></span>.get\_summary() ([pr#63721](https://github.com/ceph/ceph/pull/63721), Guillaume Abrioux)

- mgr/dashboard: fix listener add errors ([pr#68745](https://github.com/ceph/ceph/pull/68745), Tomer Haskalovitch)

- mgr/dashboard: fix make check tests ([pr#63180](https://github.com/ceph/ceph/pull/63180), Afreen Misbah)

- mgr/dashboard: fix memory leak in prometheus service ([pr#64905](https://github.com/ceph/ceph/pull/64905), Nizamudeen A)

- mgr/dashboard: fix misaligned text links on login page ([pr#66035](https://github.com/ceph/ceph/pull/66035), prik73, Afreen Misbah)

- mgr/dashboard: fix missing checkbox icon in table ([pr#65568](https://github.com/ceph/ceph/pull/65568), Nizamudeen A)

- mgr/dashboard: fix missing gw group error ([pr#65027](https://github.com/ceph/ceph/pull/65027), Tomer Haskalovitch)

- mgr/dashboard: fix missing schedule interval in rbd API ([pr#65481](https://github.com/ceph/ceph/pull/65481), Nizamudeen A)

- mgr/dashboard: fix multi-cluster route reload logic ([pr#66437](https://github.com/ceph/ceph/pull/66437), Aashish Sharma)

- mgr/dashboard: fix multisite wizard realm configuration mode ([pr#65977](https://github.com/ceph/ceph/pull/65977), Aashish Sharma)

- mgr/dashboard: fix namespace block size in namespace form ([pr#68377](https://github.com/ceph/ceph/pull/68377), Sagar Gopale)

- mgr/dashboard: fix nested shell quoting in cephadm e2e start-cluster ([pr#69116](https://github.com/ceph/ceph/pull/69116), Afreen Misbah)

- mgr/dashboard: fix None force param handling in ns add\_host so it won't raise exceptions ([pr#65519](https://github.com/ceph/ceph/pull/65519), Tomer Haskalovitch)

- mgr/dashboard: fix notification & images cypress e2e failure ([pr#66856](https://github.com/ceph/ceph/pull/66856), Aashish Sharma)

- mgr/dashboard: fix ns add and resize commands help ([pr#66792](https://github.com/ceph/ceph/pull/66792), Tomer Haskalovitch)

- mgr/dashboard: fix nvme certificate name ([pr#66547](https://github.com/ceph/ceph/pull/66547), Tomer Haskalovitch)

- mgr/dashboard: fix nvmeof mtls ([pr#64753](https://github.com/ceph/ceph/pull/64753), Tomer Haskalovitch)

- mgr/dashboard: Fix nvmeof subsystems delete modal ([pr#66771](https://github.com/ceph/ceph/pull/66771), pujaoshahu)

- mgr/dashboard: fix oauth2-service creation UI error ([pr#66124](https://github.com/ceph/ceph/pull/66124), Nizamudeen A)

- mgr/dashboard: Fix osd modal spacings and footer ([pr#68521](https://github.com/ceph/ceph/pull/68521), Afreen Misbah)

- mgr/dashboard: Fix padding of overview page ([pr#68049](https://github.com/ceph/ceph/pull/68049), Afreen Misbah)

- mgr/dashboard: fix Physical Disks identify test race condition ([pr#66187](https://github.com/ceph/ceph/pull/66187), Kefu Chai)

- mgr/dashboard: fix prometheus API error when not configured ([pr#65627](https://github.com/ceph/ceph/pull/65627), Nizamudeen A)

- mgr/dashboard: fix rbd form mirroring toggle ([pr#65558](https://github.com/ceph/ceph/pull/65558), Nizamudeen A)

- mgr/dashboard: fix RBD mirror schedule inheritance in pool and image API ([pr#67026](https://github.com/ceph/ceph/pull/67026), Imran Imtiaz)

- mgr/dashboard: fix rbd-mirror e2e failure ([pr#66925](https://github.com/ceph/ceph/pull/66925), Pedro Gonzalez Gomez)

- mgr/dashboard: Fix redirection of SMB enable module ([pr#64616](https://github.com/ceph/ceph/pull/64616), Afreen Misbah)

- mgr/dashboard: fix RGW Bucket Notification Dashboard units ([pr#65384](https://github.com/ceph/ceph/pull/65384), Aashish Sharma)

- mgr/dashboard: Fix scrubbing state ([pr#67712](https://github.com/ceph/ceph/pull/67712), Afreen Misbah)

- mgr/dashboard: fix server side table sort ([pr#66417](https://github.com/ceph/ceph/pull/66417), Nizamudeen A)

- mgr/dashboard: Fix service form to take into account labels ([pr#68549](https://github.com/ceph/ceph/pull/68549), Afreen Misbah)

- mgr/dashboard: Fix service name disablemnt in servcie form UI ([pr#68046](https://github.com/ceph/ceph/pull/68046), Afreen Misbah)

- mgr/dashboard: fix set spdk log level cli command ([pr#63334](https://github.com/ceph/ceph/pull/63334), Tomer Haskalovitch)

- mgr/dashboard: fix smb button and table column ([pr#65576](https://github.com/ceph/ceph/pull/65576), Pedro Gonzalez Gomez)

- mgr/dashboard: Fix smb module enablement ([pr#64447](https://github.com/ceph/ceph/pull/64447), Afreen Misbah)

- mgr/dashboard: Fix stylus issue ([pr#64633](https://github.com/ceph/ceph/pull/64633), Afreen Misbah)

- mgr/dashboard: fix subsystem creation issue ([pr#68045](https://github.com/ceph/ceph/pull/68045), Sagar Gopale)

- mgr/dashboard: fix subvolume group corruption from smb share form ([pr#68066](https://github.com/ceph/ceph/pull/68066), Nizamudeen A)

- mgr/dashboard: fix table dom re-rendering ([pr#64710](https://github.com/ceph/ceph/pull/64710), Nizamudeen A)

- mgr/dashboard: fix table loading while fetching data ([pr#64634](https://github.com/ceph/ceph/pull/64634), Nizamudeen A)

- mgr/dashboard: Fix table width expansion on manager module dropdown selection #74089 ([pr#66510](https://github.com/ceph/ceph/pull/66510), Sagar Gopale)

- mgr/dashboard: fix tag colors not applied in table cells ([pr#68988](https://github.com/ceph/ceph/pull/68988), Afreen Misbah)

- mgr/dashboard: Fix tags in subvolume list and subvolume groups list ([pr#68199](https://github.com/ceph/ceph/pull/68199), pujaoshahu)

- mgr/dashboard: Fix test\_host<span></span>.py test case ([pr#65208](https://github.com/ceph/ceph/pull/65208), Abhishek Desai)

- mgr/dashboard: fix the missing injectors for child formgroup tpl ([pr#67934](https://github.com/ceph/ceph/pull/67934), Nizamudeen A)

- mgr/dashboard: fix the separation between CLI and API only commands ([pr#65702](https://github.com/ceph/ceph/pull/65702), Tomer Haskalovitch)

- mgr/dashboard: Fix timestamps in APIs ([pr#66008](https://github.com/ceph/ceph/pull/66008), Afreen Misbah)

- mgr/dashboard: fix total capacity value in dashboard ([pr#65537](https://github.com/ceph/ceph/pull/65537), Nizamudeen A)

- mgr/dashboard: fix typo in error when gw does not exist ([pr#66782](https://github.com/ceph/ceph/pull/66782), Tomer Haskalovitch)

- mgr/dashboard: fix unncessary traceback when bucket not exist ([pr#70173](https://github.com/ceph/ceph/pull/70173), Nizamudeen A)

- mgr/dashboard: fix upgrade's cluster alerts popover ([pr#66144](https://github.com/ceph/ceph/pull/66144), Nizamudeen A)

- mgr/dashboard: Fix username validation for special characters by URL-encoding user lookup requests ([pr#69954](https://github.com/ceph/ceph/pull/69954), Aashish Sharma)

- mgr/dashboard: fix zone creation in rgw service creation form ([pr#69704](https://github.com/ceph/ceph/pull/69704), Aashish Sharma)

- mgr/dashboard: fix zone update API forcing STANDARD storage class ([pr#65579](https://github.com/ceph/ceph/pull/65579), Aashish Sharma)

- mgr/dashboard: fix-add-node-issue ([pr#67809](https://github.com/ceph/ceph/pull/67809), Sagar Gopale)

- mgr/dashboard: fix-nvmeof-subsystem-create-firefox-next ([pr#67769](https://github.com/ceph/ceph/pull/67769), Sagar Gopale)

- mgr/dashboard: fix-subsystem-loading-page-issue ([pr#68124](https://github.com/ceph/ceph/pull/68124), Sagar Gopale)

- mgr/dashboard: fix-user-creation-validation ([pr#69982](https://github.com/ceph/ceph/pull/69982), Sagar Gopale)

- mgr/dashboard: Fixed incorrect snapshot scheduled date for rbd block in GUI ([pr#64689](https://github.com/ceph/ceph/pull/64689), Abhishek Desai)

- mgr/dashboard: fixed input field black after selecting an autofill browser input ([pr#64445](https://github.com/ceph/ceph/pull/64445), Abhishek Desai)

- mgr/dashboard: Fixes for overview page ([pr#67503](https://github.com/ceph/ceph/pull/67503), Afreen Misbah)

- mgr/dashboard: fixes for quick-bootstrap script ([pr#66075](https://github.com/ceph/ceph/pull/66075), Nizamudeen A)

- mgr/dashboard: Fixing message when prometheus is disabled in performa… ([pr#67690](https://github.com/ceph/ceph/pull/67690), Devika Babrekar)

- mgr/dashboard: Footer actions shift upward instead of staying pinned at modal bottom in NVMe/TCP subsystem create wizard ([pr#67718](https://github.com/ceph/ceph/pull/67718), Sagar Gopale)

- mgr/dashboard: form and style fixes ([pr#64772](https://github.com/ceph/ceph/pull/64772), Naman Munet)

- mgr/dashboard: Form retains old data when switching from edit to create mode ([pr#65487](https://github.com/ceph/ceph/pull/65487), pujashahu)

- mgr/dashboard: FS - Attach Command showing undefined for MountData ([pr#65600](https://github.com/ceph/ceph/pull/65600), Dnyaneshwari Talwekar)

- mgr/dashboard: gateway-add-modal ([pr#66967](https://github.com/ceph/ceph/pull/66967), Afreen Misbah, Sagar Gopale)

- mgr/dashboard: Generic Performace Chart - Carbon ([pr#67021](https://github.com/ceph/ceph/pull/67021), Devika Babrekar)

- mgr/dashboard: generic redirect link for a table item ([pr#66049](https://github.com/ceph/ceph/pull/66049), Nizamudeen A)

- mgr/dashboard: Glacier Storage Class - create and list ([pr#63421](https://github.com/ceph/ceph/pull/63421), Dnyaneshwari Talwekar)

- mgr/dashboard: Grafana dashboard/Filesystem Overview: "matching labels must be unique on one side" ([pr#67654](https://github.com/ceph/ceph/pull/67654), bst2002git)

- mgr/dashboard: Group similar alerts ([pr#65312](https://github.com/ceph/ceph/pull/65312), Abhishek Desai)

- mgr/dashboard: Handle pool creation in tiering local storage class creation ([pr#65409](https://github.com/ceph/ceph/pull/65409), Dnyaneshwari, Naman Munet)

- mgr/dashboard: Health card hardware tab ([pr#67474](https://github.com/ceph/ceph/pull/67474), Afreen Misbah)

- mgr/dashboard: Improve oauth2 sso configuration ([pr#67417](https://github.com/ceph/ceph/pull/67417), Alexandre Jardon)

- mgr/dashboard: improve RBD group API endpoint documentation ([pr#66975](https://github.com/ceph/ceph/pull/66975), Imran Imtiaz)

- mgr/dashboard: Include executing tasks in notification panel ([pr#66855](https://github.com/ceph/ceph/pull/66855), Aashish Sharma)

- mgr/dashboard: Initiator add shows success but host is not added/displayed in Subsystem Initiators table ([pr#67713](https://github.com/ceph/ceph/pull/67713), Sagar Gopale)

- mgr/dashboard: introduce details card component ([pr#64631](https://github.com/ceph/ceph/pull/64631), Naman Munet, Nizamudeen A)

- mgr/dashboard: introduce NvmeofCLICommand's success\_message\_template … ([pr#66879](https://github.com/ceph/ceph/pull/66879), Tomer Haskalovitch)

- mgr/dashboard: introduce side panel as a reusable component ([pr#63872](https://github.com/ceph/ceph/pull/63872), Nizamudeen A)

- mgr/dashboard: introduce traddr for backward compatibility ([pr#68393](https://github.com/ceph/ceph/pull/68393), Tomer Haskalovitch)

- mgr/dashboard: keep notification tests in the past ([pr#68129](https://github.com/ceph/ceph/pull/68129), Aryan-coder06)

- mgr/dashboard: link rgw user with account e2e failure ([pr#66286](https://github.com/ceph/ceph/pull/66286), Naman Munet)

- mgr/dashboard: loading state for inventory card ([pr#64911](https://github.com/ceph/ceph/pull/64911), Nizamudeen A)

- mgr/dashboard: Local Storage Class - create and list ([pr#64061](https://github.com/ceph/ceph/pull/64061), Dnyaneshwari Talwekar)

- mgr/dashboard: Made expandable table row height consistent across the cluster ([pr#64698](https://github.com/ceph/ceph/pull/64698), Abhishek Desai)

- mgr/dashboard: Maintain sentence case consistency in side nav bar titles ([pr#65870](https://github.com/ceph/ceph/pull/65870), Aashish Sharma)

- mgr/dashboard: mgr/dashboard: Carbonize Realm Name and Token block in Multi-site Replication Wizard ([pr#68441](https://github.com/ceph/ceph/pull/68441), Sagar Gopale)

- mgr/dashboard: Migrate from promtail to grafana alloy ([pr#64728](https://github.com/ceph/ceph/pull/64728), Aashish Sharma)

- mgr/dashboard: Misleading warning when no eligible devices are available for OSD creation ([pr#67444](https://github.com/ceph/ceph/pull/67444), Naman Munet)

- mgr/dashboard: Multi-site-sync-status UI distortion for status in data sync ([pr#63175](https://github.com/ceph/ceph/pull/63175), Prachi)

- mgr/dashboard: multisite sync-policy page should include daemon selection ([pr#68734](https://github.com/ceph/ceph/pull/68734), Naman Munet)

- mgr/dashboard: Namespace size should accept GiB in NVMe/TCP ([pr#67734](https://github.com/ceph/ceph/pull/67734), Sagar Gopale)

- mgr/dashboard: NFS enhancements - terminology alignment ([pr#68970](https://github.com/ceph/ceph/pull/68970), Dnyaneshwari Talwekar)

- mgr/dashboard: nfs export creation fails with obj deserialization ([pr#67345](https://github.com/ceph/ceph/pull/67345), Nizamudeen A)

- mgr/dashboard: NFS: Toggle visibility of CephFS snapshots ([pr#67301](https://github.com/ceph/ceph/pull/67301), Dnyaneshwari Talwekar)

- mgr/dashboard: Notification endpoints for create ,list and delete ([pr#62701](https://github.com/ceph/ceph/pull/62701), pujashahu)

- mgr/dashboard: Notification footer ([pr#64707](https://github.com/ceph/ceph/pull/64707), Afreen Misbah, Anikait Sehwag)

- mgr/dashboard: ns list now support not passing nqn param ([pr#65841](https://github.com/ceph/ceph/pull/65841), Tomer Haskalovitch)

- mgr/dashboard: NVMe – Fix host,listeners namespace list display on Subsystem resource page ([pr#67159](https://github.com/ceph/ceph/pull/67159), pujaoshahu)

- mgr/dashboard: NVME-Delete Gateway group ([pr#66418](https://github.com/ceph/ceph/pull/66418), pujaoshahu)

- mgr/dashboard: NVme-gateway-resource ([pr#66906](https://github.com/ceph/ceph/pull/66906), Sagar Gopale)

- mgr/dashboard: NVMe-of Initiator Hostname Pre-validation ([pr#68224](https://github.com/ceph/ceph/pull/68224), Sagar Gopale)

- mgr/dashboard: NVme-Subsystem list ([pr#66751](https://github.com/ceph/ceph/pull/66751), pujaoshahu, Puja Shahu)

- mgr/dashboard: NVMeoF -Create Gatway group Form ([pr#66546](https://github.com/ceph/ceph/pull/66546), pujaoshahu)

- mgr/dashboard: NVMeoF backports ([pr#69723](https://github.com/ceph/ceph/pull/69723), Vallari Agrawal, Tomer Haskalovitch)

- mgr/dashboard: nvmeof cli feedback fixes ([pr#64363](https://github.com/ceph/ceph/pull/64363), Tomer Haskalovitch)

- mgr/dashboard: NVMeoF CLI migrate prs ([pr#64215](https://github.com/ceph/ceph/pull/64215), Tomer Haskalovitch)

- mgr/dashboard: Nvmeof CLI plain format support ([pr#63327](https://github.com/ceph/ceph/pull/63327), Tomer Haskalovitch)

- mgr/dashboard: Nvmeof expand namespace size ([pr#67328](https://github.com/ceph/ceph/pull/67328), Sagar Gopale)

- mgr/dashboard: NVMeoF namespace create form should show subsystem selection first ([pr#68175](https://github.com/ceph/ceph/pull/68175), Sagar Gopale)

- mgr/dashboard: Optimize css styles<span></span>.css bundle ([pr#65247](https://github.com/ceph/ceph/pull/65247), Afreen Misbah)

- mgr/dashboard: Option to select archive option while Import Multi-site token ([pr#68411](https://github.com/ceph/ceph/pull/68411), Aashish Sharma)

- mgr/dashboard: raise an error when invalid server-address was provided ([pr#68728](https://github.com/ceph/ceph/pull/68728), Tomer Haskalovitch)

- mgr/dashboard: raise exception if both size and rbd\_image\_size are being passed in ns add ([pr#65676](https://github.com/ceph/ceph/pull/65676), Tomer Haskalovitch)

- mgr/dashboard: RBAC issues ([pr#70482](https://github.com/ceph/ceph/pull/70482), Abhishek Desai)

- mgr/dashboard: rbd-mirroring - hide create/import token buttons for ([pr#69952](https://github.com/ceph/ceph/pull/69952), Aashish Sharma)

- mgr/dashboard: Remove `ng-click-outside` and `ngx-toast` ([pr#68952](https://github.com/ceph/ceph/pull/68952), Afreen Misbah)

- mgr/dashboard: remove archive option from master zone creation ([pr#68486](https://github.com/ceph/ceph/pull/68486), Aashish Sharma)

- mgr/dashboard: Remove cephfs mirroring navigation from Umbrella ([pr#68967](https://github.com/ceph/ceph/pull/68967), Dnyaneshwari Talwekar)

- mgr/dashboard: Remove font awesome icon package ([pr#68962](https://github.com/ceph/ceph/pull/68962), Afreen Misbah)

- mgr/dashboard: remove hardcoded strings in About component ([pr#66034](https://github.com/ceph/ceph/pull/66034), prik73, Afreen Misbah)

- mgr/dashboard: Remove illegible texts from the dashboard ([pr#66291](https://github.com/ceph/ceph/pull/66291), Afreen Misbah)

- mgr/dashboard: Remove ng script ([pr#66402](https://github.com/ceph/ceph/pull/66402), Afreen Misbah)

- mgr/dashboard: remove not needed 'cli\_version' field from gw info com… ([pr#66714](https://github.com/ceph/ceph/pull/66714), Tomer Haskalovitch)

- mgr/dashboard: remove sync\_from entry when sync\_from\_all is true ([pr#68490](https://github.com/ceph/ceph/pull/68490), Aashish Sharma)

- mgr/dashboard: Remove tabs under subsystem ([pr#67472](https://github.com/ceph/ceph/pull/67472), pujaoshahu)

- mgr/dashboard: Remove the clear-alerts parameter from NVMeoF CLI ([pr#67736](https://github.com/ceph/ceph/pull/67736), Gil Bregman)

- mgr/dashboard: Remove the time dropdown from grafana iframe ([pr#64327](https://github.com/ceph/ceph/pull/64327), Abhishek Desai)

- mgr/dashboard: remove trailing space from directory name ([pr#67174](https://github.com/ceph/ceph/pull/67174), Ville Ojamo)

- mgr/dashboard: rename 'Zone Group' labels to 'Zonegroup' ([pr#66680](https://github.com/ceph/ceph/pull/66680), Sagar Gopale)

- mgr/dashboard: Rename Alert breadcrumb to Alert Rules ([pr#68198](https://github.com/ceph/ceph/pull/68198), Sagar Gopale)

- mgr/dashboard: Rename Alerts tab to All Alerts ([pr#66478](https://github.com/ceph/ceph/pull/66478), Sagar Gopale)

- mgr/dashboard: Rename namespace block size field and reorder namespace form order ([pr#67995](https://github.com/ceph/ceph/pull/67995), Sagar Gopale)

- mgr/dashboard: Rename side-nav panel items ([pr#65704](https://github.com/ceph/ceph/pull/65704), Naman Munet)

- mgr/dashboard: replace bootstrap badges with carbon tags ([pr#60361](https://github.com/ceph/ceph/pull/60361), pujaoshahu)

- mgr/dashboard: Replace data-cy with data-testid for cypress IDs ([pr#62922](https://github.com/ceph/ceph/pull/62922), Mohammad saif)

- mgr/dashboard: replace deprecated codecs<span></span>.open with open ([pr#68329](https://github.com/ceph/ceph/pull/68329), Kefu Chai)

- mgr/dashboard: Replace htmllint with Prettier for HTML linting ([pr#68953](https://github.com/ceph/ceph/pull/68953), Afreen Misbah)

- mgr/dashboard: replace traddr with server\_address in NVMeoF CLI ([pr#66822](https://github.com/ceph/ceph/pull/66822), Tomer Haskalovitch)

- mgr/dashboard: replace usage or progress bar with carbon meter chart ([pr#60416](https://github.com/ceph/ceph/pull/60416), Naman Munet)

- mgr/dashboard: resolve the redirect url with the prop name ([pr#66160](https://github.com/ceph/ceph/pull/66160), Nizamudeen A)

- mgr/dashboard: rgw accounts form group mode disable option is not working ([pr#66319](https://github.com/ceph/ceph/pull/66319), Naman Munet)

- mgr/dashboard: rgw\_crypt\_kmip\_addr in SSE-KMS kmip address input field validation updated ([pr#64827](https://github.com/ceph/ceph/pull/64827), Abhishek Desai)

- mgr/dashboard: rm requirements-extra file ([pr#64380](https://github.com/ceph/ceph/pull/64380), Nizamudeen A)

- mgr/dashboard: Round off y-axis value of area chart ([pr#68525](https://github.com/ceph/ceph/pull/68525), Afreen Misbah)

- mgr/dashboard: run kcli commands in libvritd group ([pr#68178](https://github.com/ceph/ceph/pull/68178), Nizamudeen A)

- mgr/dashboard: server side table rendering improvements ([pr#65482](https://github.com/ceph/ceph/pull/65482), Nizamudeen A)

- mgr/dashboard: service creation fails if service name is same as sevice type ([pr#66346](https://github.com/ceph/ceph/pull/66346), Naman Munet)

- mgr/dashboard: services page breaking for test\_orchestrator module ([pr#67847](https://github.com/ceph/ceph/pull/67847), Naman Munet)

- mgr/dashboard: Set max subsystem count to 512 rather than 4096 ([pr#66273](https://github.com/ceph/ceph/pull/66273), Afreen Misbah)

- mgr/dashboard: set MOTD fails on FIPS enabled systems ([pr#70373](https://github.com/ceph/ceph/pull/70373), Aashish Sharma)

- mgr/dashboard: set up dashboard as a app shell for plugin framework ([pr#61767](https://github.com/ceph/ceph/pull/61767), Afreen Misbah, Ivo Almeida)

- mgr/dashboard: Show notification for multi-site sync status in case there is some error ([pr#62241](https://github.com/ceph/ceph/pull/62241), Aashish Sharma)

- mgr/dashboard: show rados ns in 'ceph nvmeof top io' ([pr#68469](https://github.com/ceph/ceph/pull/68469), Vallari Agrawal)

- mgr/dashboard: show System metadata used ([pr#67708](https://github.com/ceph/ceph/pull/67708), Aashish Sharma)

- mgr/dashboard: show warning message in nvmeof cli ([pr#68996](https://github.com/ceph/ceph/pull/68996), Vallari Agrawal)

- mgr/dashboard: side-panel enhancements ([pr#67018](https://github.com/ceph/ceph/pull/67018), Naman Munet)

- mgr/dashboard: skip RGW daemons whose frontend is unreachable ([pr#72047](https://github.com/ceph/ceph/pull/72047), Matthew N. Heler)

- mgr/dashboard: skip the table when an nvmeof cli result has no columns ([pr#69710](https://github.com/ceph/ceph/pull/69710), Kefu Chai)

- mgr/dashboard: Stabilizing the storage overview card ([pr#67807](https://github.com/ceph/ceph/pull/67807), Afreen Misbah)

- mgr/dashboard: Stale RGW user/account metadata cache in mgr after delete and recreate ([pr#70194](https://github.com/ceph/ceph/pull/70194), Naman Munet)

- mgr/dashboard: start node virtual-env after starting ceph cluster ([pr#66143](https://github.com/ceph/ceph/pull/66143), Nizamudeen A)

- mgr/dashboard: Step three subsystem creation form ([pr#67170](https://github.com/ceph/ceph/pull/67170), Afreen Misbah)

- mgr/dashboard: Step two subsystem creation form ([pr#67128](https://github.com/ceph/ceph/pull/67128), Afreen Misbah)

- mgr/dashboard: Stop rules api being polled on every page ([pr#64773](https://github.com/ceph/ceph/pull/64773), Afreen Misbah)

- mgr/dashboard: Storage Class - Update ([pr#64527](https://github.com/ceph/ceph/pull/64527), Dnyaneshwari Talwekar)

- mgr/dashboard: style fixes for shared components ([pr#65140](https://github.com/ceph/ceph/pull/65140), Naman Munet)

- mgr/dashboard: Subsystem details page opens at stale scroll position after Add Namespace ([pr#67759](https://github.com/ceph/ceph/pull/67759), Sagar Gopale)

- mgr/dashboard: support custom image for bootstrapping ([pr#67346](https://github.com/ceph/ceph/pull/67346), Nizamudeen A)

- mgr/dashboard: support custom prop for table item redirection ([pr#66407](https://github.com/ceph/ceph/pull/66407), Nizamudeen A)

- mgr/dashboard: support custom validator messages in inline edit ([pr#65833](https://github.com/ceph/ceph/pull/65833), Nizamudeen A)

- mgr/dashboard: support gw get\_stats and listener info ([pr#65787](https://github.com/ceph/ceph/pull/65787), Tomer Haskalovitch)

- mgr/dashboard: support human friendly size parameter split commands to separate api and cli functions ([pr#64516](https://github.com/ceph/ceph/pull/64516), Tomer Haskalovitch)

- mgr/dashboard: support inline edit for datatable ([pr#64559](https://github.com/ceph/ceph/pull/64559), Nizamudeen A)

- mgr/dashboard: support templates in table component title ([pr#65857](https://github.com/ceph/ceph/pull/65857), Naman Munet)

- mgr/dashboard: sync policy created for a bucket in Object >> Multi-site >> Sync-policy, is not reflecting under bucket's replication ([pr#67869](https://github.com/ceph/ceph/pull/67869), Naman Munet)

- mgr/dashboard: table cell inline edit emit editing state ([pr#68301](https://github.com/ceph/ceph/pull/68301), Nizamudeen A)

- mgr/dashboard: tearsheet-layout-fix ([pr#68440](https://github.com/ceph/ceph/pull/68440), Sagar Gopale)

- mgr/dashboard: telemetry banner causes UI freeze on initial load ([pr#68053](https://github.com/ceph/ceph/pull/68053), Naman Munet)

- mgr/dashboard: Tieiring - allow read through ([pr#62943](https://github.com/ceph/ceph/pull/62943), Dnyaneshwari Talwekar)

- mgr/dashboard: Tiering form -  Placement Target in Advanced Section ([pr#64992](https://github.com/ceph/ceph/pull/64992), Dnyaneshwari Talwekar)

- mgr/dashboard: Title says "Gateways" but it displays gateway group names in NVME/TCP ([pr#67781](https://github.com/ceph/ceph/pull/67781), pujaoshahu)

- mgr/dashboard: tolerate nodeenv leaving no src directory behind ([pr#72169](https://github.com/ceph/ceph/pull/72169), David Galloway)

- mgr/dashboard: update npm dependencies ([pr#55875](https://github.com/ceph/ceph/pull/55875), Nizamudeen A)

- mgr/dashboard: update onboarding screen as per design ([pr#67647](https://github.com/ceph/ceph/pull/67647), Aashish Sharma)

- mgr/dashboard: Update permissions for pool-manager role ([pr#68658](https://github.com/ceph/ceph/pull/68658), Afreen Misbah)

- mgr/dashboard: update teuth\_ref hash in api test ([pr#66700](https://github.com/ceph/ceph/pull/66700), Nizamudeen A)

- mgr/dashboard: Update translations ([pr#62978](https://github.com/ceph/ceph/pull/62978), Afreen Misbah)

- mgr/dashboard: upgrade angular to 19 ([pr#66713](https://github.com/ceph/ceph/pull/66713), Nizamudeen A)

- mgr/dashboard: upgrade carbon components package@5<span></span>.59<span></span>.2 ([pr#65305](https://github.com/ceph/ceph/pull/65305), Naman Munet)

- mgr/dashboard: Use illustration image for empty state table ([pr#67639](https://github.com/ceph/ceph/pull/67639), Sagar Gopale)

- mgr/dashboard: use osd metrics in performance charts and remove storage type filter ([pr#67768](https://github.com/ceph/ceph/pull/67768), Aashish Sharma)

- mgr/dashboard: use system packages when running tox ([pr#62239](https://github.com/ceph/ceph/pull/62239), Nizamudeen A)

- mgr/dashboard: user accounts enhancements ([pr#64628](https://github.com/ceph/ceph/pull/64628), Naman Munet)

- mgr/dashboard: validate args in nvmeof top cmds ([pr#68275](https://github.com/ceph/ceph/pull/68275), Vallari Agrawal)

- mgr/dashboard: Validate no added hosts in second step ([pr#68531](https://github.com/ceph/ceph/pull/68531), Afreen Misbah)

- mgr/dashboard: where the alert page tag colors are not being applied ([pr#66588](https://github.com/ceph/ceph/pull/66588), pujashahu)

- mgr/dashboard:[NFS] Missing Subvolume Groups and Subvolumes on Edit NFS Export ([pr#64858](https://github.com/ceph/ceph/pull/64858), Dnyaneshwari Talwekar)

- mgr/dashboard:Added a dropdown menu for all size inputs ([pr#62926](https://github.com/ceph/ceph/pull/62926), Ankit Kumar)

- mgr/dashboard:Adding MSR EC Profile via dashboard ([pr#67872](https://github.com/ceph/ceph/pull/67872), Devika Babrekar)

- mgr/dashboard:revamp on-boarding screen ([pr#67360](https://github.com/ceph/ceph/pull/67360), Aashish Sharma)

- mgr/dashboard:RGW- Storage Class ACL Mapping ([pr#64788](https://github.com/ceph/ceph/pull/64788), Dnyaneshwari Talwekar)

- mgr/dashboard; setup husky ([pr#64586](https://github.com/ceph/ceph/pull/64586), Afreen Misbah)

- mgr/feedback: fix flaky test\_issue\_tracker\_create\_with\_invalid\_key ([pr#68297](https://github.com/ceph/ceph/pull/68297), Kefu Chai)

- mgr/mirroring: Display mon\_host and fsid in daemon status command ([pr#67335](https://github.com/ceph/ceph/pull/67335), Kotresh HR)

- mgr/mirroring: json pretty formatting ([pr#65911](https://github.com/ceph/ceph/pull/65911), Kotresh HR)

- mgr/nfs: Add Monitoring\_Addr parameter to ganesha<span></span>.conf and provide option for user to provide ips for bind\_addr ([pr#62927](https://github.com/ceph/ceph/pull/62927), Shweta Bhosale)

- mgr/nfs: Add VIP to HAProxy\_Hosts list for ingress type haproxy-protocol ([pr#62891](https://github.com/ceph/ceph/pull/62891), Shweta Bhosale)

- mgr/nfs: Cephadm support for NFS-Ganesha TLS configuration adding new option xprtsec ([pr#66194](https://github.com/ceph/ceph/pull/66194), Shweta Bhosale)

- mgr/nfs: make sure sectype is a list when parsed ([pr#62718](https://github.com/ceph/ceph/pull/62718), Adam King)

- mgr/nfs: NFS cluster and export commands to enable and disable ops control ([pr#61826](https://github.com/ceph/ceph/pull/61826), Shweta Bhosale)

- mgr/nfs: read full conf object when removing export URL ([pr#70073](https://github.com/ceph/ceph/pull/70073), Shweta Bhosale)

- mgr/nfs: reuse CephfsClient for path checks and earmark resolver ([pr#68842](https://github.com/ceph/ceph/pull/68842), Shweta Bhosale)

- mgr/nvmeof: add nvmeof module which will create <span></span>.nvmeof rbd pool ([pr#67167](https://github.com/ceph/ceph/pull/67167), Tomer Haskalovitch)

- mgr/nvmeof: Adding missing CLICommand field to nvmeof mgr module ([pr#67782](https://github.com/ceph/ceph/pull/67782), Redouane Kachach)

- mgr/nvmeof: change pool application to nvmeof-meta instead of rbd ([pr#70445](https://github.com/ceph/ceph/pull/70445), Tomer Haskalovitch)

- mgr/orchestrator: sort host labels in ceph orch host ls output ([pr#66763](https://github.com/ceph/ceph/pull/66763), Shubha Jain)

- mgr/pg\_autoscaler: Add 'osd pool get threshold' command which returns the current threshold value ([pr#65015](https://github.com/ceph/ceph/pull/65015), Connor Fawcett)

- mgr/progress: compare up set instead of acting set ([pr#65131](https://github.com/ceph/ceph/pull/65131), Kamoltat Sirivadhna)

- mgr/progress: expose API from CLI ([pr#65412](https://github.com/ceph/ceph/pull/65412), Ernesto Puerta)

- mgr/prometheus: add share name as label to SMB\_METADATA metric ([pr#64671](https://github.com/ceph/ceph/pull/64671), Avan Thakkar)

- mgr/prometheus: add smb\_metadata metric ([pr#64437](https://github.com/ceph/ceph/pull/64437), Avan Thakkar)

- mgr/prometheus: cleanup the smb share processing logs ([pr#68094](https://github.com/ceph/ceph/pull/68094), Nizamudeen A)

- mgr/prometheus: fix enabled\_modules check for smb metadata ([pr#65084](https://github.com/ceph/ceph/pull/65084), Avan Thakkar)

- mgr/prometheus: fix metrics service not coming up ([pr#64385](https://github.com/ceph/ceph/pull/64385), Nizamudeen A)

- mgr/prometheus: Handle empty JSON from orch get-security-config ([pr#65033](https://github.com/ceph/ceph/pull/65033), Sunnatillo)

- mgr/prometheus: Make prometheus TLS config work with Rook orchestrator ([pr#61468](https://github.com/ceph/ceph/pull/61468), Sunnatillo, Redouane Kachach)

- mgr/prometheus: Use RLock to fix deadlock in HealthHistory ([pr#66571](https://github.com/ceph/ceph/pull/66571), Nitzan Mordechai)

- mgr/PyModule: clear Python exception when NOTIFY\_TYPES is missing ([pr#66505](https://github.com/ceph/ceph/pull/66505), Kefu Chai)

- mgr/rbd\_support: Fix "start-time" arg behavior ([pr#66735](https://github.com/ceph/ceph/pull/66735), Ramana Raja)

- mgr/rbd\_support: Stagger mirror snapshot and trash purge schedules ([pr#66758](https://github.com/ceph/ceph/pull/66758), Ramana Raja)

- mgr/rgw: don't fail realm bootstrap if system user exists already ([pr#62808](https://github.com/ceph/ceph/pull/62808), Adam King)

- mgr/rgw: fix unreachable code path ([pr#65469](https://github.com/ceph/ceph/pull/65469), Kushal Deb)

- mgr/rgw: Improve error handling and add --resume flag to 'ceph rgw realm bootstrap' ([pr#63391](https://github.com/ceph/ceph/pull/63391), Kushal Deb)

- mgr/smb: add cluster-level QoS update command for CephFS shares ([pr#68257](https://github.com/ceph/ceph/pull/68257), Avan Thakkar)

- mgr/smb: Add configurable options to share ([pr#63897](https://github.com/ceph/ceph/pull/63897), Shwetha K Acharya)

- mgr/smb: Add new configs to share definition ([pr#63399](https://github.com/ceph/ceph/pull/63399), Shwetha K Acharya)

- mgr/smb: add rate limiting support ([pr#64818](https://github.com/ceph/ceph/pull/64818), Avan Thakkar)

- mgr/smb: Allow whitespace in share login names ([pr#66574](https://github.com/ceph/ceph/pull/66574), Anoop C S)

- mgr/smb: Disable posix locking in share definition ([pr#65999](https://github.com/ceph/ceph/pull/65999), Anoop C S)

- mgr/smb: Enable per-share profile counters ([pr#64254](https://github.com/ceph/ceph/pull/64254), Shachar Sharon)

- mgr/smb: fix error handling for fundamental resource parsing ([pr#65631](https://github.com/ceph/ceph/pull/65631), John Mulligan)

- mgr/smb: fix incorrect referenced variable ([pr#69128](https://github.com/ceph/ceph/pull/69128), Xavi Hernandez)

- mgr/smb: general refactoring with the intent of making future additions easier ([pr#64310](https://github.com/ceph/ceph/pull/64310), John Mulligan)

- mgr/smb: gracefully handle transient sqlitedb errors ([pr#70116](https://github.com/ceph/ceph/pull/70116), Avan Thakkar)

- mgr/smb: QoS bandwidth pass-through and burst\_mult parameter ([pr#67435](https://github.com/ceph/ceph/pull/67435), Avan Thakkar)

- mgr/smb: relax name length validation to support KMIP/GKLM aliases ([pr#66385](https://github.com/ceph/ceph/pull/66385), Avan Thakkar)

- mgr/smb: remove restriction on 1MiB smb config objects in rados ([pr#63562](https://github.com/ceph/ceph/pull/63562), John Mulligan)

- mgr/smb: use lazy\_init to create the rados store ([pr#65101](https://github.com/ceph/ceph/pull/65101), Sachin Prabhu)

- mgr/snap\_schedule: fix typo in error message during retention add ([pr#59161](https://github.com/ceph/ceph/pull/59161), Milind Changire)

- mgr/snap\_schedule: restrict retention period multipliers set ([pr#57263](https://github.com/ceph/ceph/pull/57263), Milind Changire)

- mgr/telemetry: add 'ec\_optimizations' flag to 'basic\_pool\_flags' collection ([pr#65774](https://github.com/ceph/ceph/pull/65774), Laura Flores)

- mgr/test\_orchestrator: fixing daemon\_action method signature ([pr#67998](https://github.com/ceph/ceph/pull/67998), Redouane Kachach)

- mgr/ThreadMonitor: monitor interval running in seconds and not nanose… ([pr#69125](https://github.com/ceph/ceph/pull/69125), Nitzan Mordechai)

- mgr/tox: adding coverage target to the main tox<span></span>.ini ([pr#68570](https://github.com/ceph/ceph/pull/68570), Redouane Kachach)

- mgr/vol: don't delete user-created pool in "volume create" command ([pr#62843](https://github.com/ceph/ceph/pull/62843), Rishabh Dave)

- mgr/vol: include group name in subvolume's pool namespace name ([pr#62668](https://github.com/ceph/ceph/pull/62668), Rishabh Dave)

- mgr/vol: keep and show clone source info ([pr#63214](https://github.com/ceph/ceph/pull/63214), Rishabh Dave)

- mgr/vol: make "snapshot getpath" cmd work with v1 and legacy ([pr#63127](https://github.com/ceph/ceph/pull/63127), Rishabh Dave)

- mgr/vol: some improvements for stats\_util<span></span>.py and async\_cloner<span></span>.py ([pr#62638](https://github.com/ceph/ceph/pull/62638), Rishabh Dave)

- mgr/volumes: handle bad arguments during subvolume create ([pr#53989](https://github.com/ceph/ceph/pull/53989), Milind Changire)

- mgr/volumes: Keep mon caps if auth key has remaining mds/osd caps ([pr#59435](https://github.com/ceph/ceph/pull/59435), Enrico Bocchi)

- mgr/volumes: reduce noisy health check logs ([pr#67030](https://github.com/ceph/ceph/pull/67030), Indira Sawant)

- mgr/volumes: use depth-first, non-recursive approach for cloning ([pr#64774](https://github.com/ceph/ceph/pull/64774), Rishabh Dave)

- mgr: add config to load modules in main interpreter instead of subinterpreter ([pr#66244](https://github.com/ceph/ceph/pull/66244), Samuel Just)

- mgr: Add per-module performance counters to mgr ([pr#61131](https://github.com/ceph/ceph/pull/61131), Nitzan Mordechai)

- mgr: avoid explicit dropping of ref ([pr#62445](https://github.com/ceph/ceph/pull/62445), Milind Changire)

- mgr: Bucket scoped OSD upgrades using ok-to-upgrade ([pr#68398](https://github.com/ceph/ceph/pull/68398), Ashwin M. Joshi)

- mgr: change cleanup and scanning cephfs connection logs to be less noisy ([pr#68634](https://github.com/ceph/ceph/pull/68634), Omid Yoosefi)

- mgr: don't record a crash dump for NotImplementedError from dispatch\_remote ([pr#70983](https://github.com/ceph/ceph/pull/70983), Nitzan Mordechai, Sebastian Marschke)

- mgr: ensure that all modules have started before advertising active mgr ([pr#63859](https://github.com/ceph/ceph/pull/63859), Laura Flores)

- mgr: filter root logger fallback ([pr#69928](https://github.com/ceph/ceph/pull/69928), Matthew N Heler)

- mgr: Fix autoscaling PG distribution ([pr#67551](https://github.com/ceph/ceph/pull/67551), Eric Zhang)

- mgr: fix continous smb MgrDBNotReady ([pr#68483](https://github.com/ceph/ceph/pull/68483), Pedro Gonzalez Gomez)

- mgr: fix dispatch throttle bottleneck causing OSD connection timeouts ([pr#69941](https://github.com/ceph/ceph/pull/69941), Nitzan Mordechai)

- mgr: fix PyObject leak in the remote() pickle calls ([pr#69858](https://github.com/ceph/ceph/pull/69858), Kefu Chai)

- mgr: fix PyObject\* refcounting in TTLCache and cleanup logic ([pr#65245](https://github.com/ceph/ceph/pull/65245), Nitzan Mordechai)

- mgr: guard close\_section calls in get\_perf\_schema\_python ([pr#68213](https://github.com/ceph/ceph/pull/68213), Lumir Sliva)

- mgr: handle SIGTERM/SIGINT in standby mgr to avoid CEPHADM\_FAILED\_DAEMON ([pr#69781](https://github.com/ceph/ceph/pull/69781), Nitzan Mordechai)

- mgr: isolated CherryPy to prevent global state sharing ([pr#67227](https://github.com/ceph/ceph/pull/67227), Nizamudeen A)

- mgr: migrate from boost::variant to std::variant ([pr#62977](https://github.com/ceph/ceph/pull/62977), Kefu Chai)

- mgr: Properly set description in labeled get\_perf\_schema\_python ([pr#69817](https://github.com/ceph/ceph/pull/69817), stzuraski898)

- mgr: PyModule memory leaks fix ([pr#62197](https://github.com/ceph/ceph/pull/62197), Nitzan Mordechai)

- mgr: reduce header dependencies ([pr#65508](https://github.com/ceph/ceph/pull/65508), Max Kellermann)

- mgr: remove health msgs from the metrics if osd destroyed ([pr#65422](https://github.com/ceph/ceph/pull/65422), Nitzan Mordechai)

- mgr: replace deprecated PyImport\_ImportModuleNoBlock with PyImport\_ImportModule ([pr#68085](https://github.com/ceph/ceph/pull/68085), Kefu Chai)

- mgr:python: avoid pyo3 errors by running certain cryptographic functions in a child process ([pr#62951](https://github.com/ceph/ceph/pull/62951), John Mulligan, Paulo E. Castro)

- mgr\_module tox failure fix ([pr#67954](https://github.com/ceph/ceph/pull/67954), Nitzan Mordechai)

- mgt/dashboard: Add the CPU, Memory to CephFS dashboard ([pr#68412](https://github.com/ceph/ceph/pull/68412), Ankush Behl)

- mixed balance read and rwordered in read ops ([pr#62806](https://github.com/ceph/ceph/pull/62806), Nitzan Mordechai)

- mon [stretch mode]: restrict changing mon election strategy post stretch mode ([pr#59515](https://github.com/ceph/ceph/pull/59515), Kamoltat Sirivadhna)

- mon [stretch-mode]: Allow a max bucket weight diff threshold ([pr#66580](https://github.com/ceph/ceph/pull/66580), Kamoltat Sirivadhna)

- mon/AuthMonitor: add osd w cap for superuser client ([pr#67406](https://github.com/ceph/ceph/pull/67406), Venky Shankar, Patrick Donnelly)

- mon/config: trim whitespace in config target ([pr#69802](https://github.com/ceph/ceph/pull/69802), Nitzan Mordechai)

- mon/Elector<span></span>.cc: prevent assertion failure when receiving pings from r… ([pr#65615](https://github.com/ceph/ceph/pull/65615), chungfengz)

- mon/FSCommands: avoid unreachable code triggering compiler warning ([pr#63621](https://github.com/ceph/ceph/pull/63621), Patrick Donnelly)

- mon/HealthMonitor: avoid MON\_DOWN for freshly added Monitor ([pr#66328](https://github.com/ceph/ceph/pull/66328), Patrick Donnelly)

- mon/MgrMonitor: add a space before "is already disabled" ([pr#64186](https://github.com/ceph/ceph/pull/64186), Zehua Qi)

- mon/MgrStatMonitor<span></span>.cc: cleanup pool\_availability ([pr#64004](https://github.com/ceph/ceph/pull/64004), Shraddha Agrawal)

- mon/MonClient: check stopping for auth request handling ([pr#68245](https://github.com/ceph/ceph/pull/68245), Patrick Donnelly)

- mon/MonClient: post version request completions outside of monc\_lock ([pr#65177](https://github.com/ceph/ceph/pull/65177), Ilya Dryomov)

- mon/MonMap: Dump addr in backward compatible format ([pr#66531](https://github.com/ceph/ceph/pull/66531), Anoop C S)

- mon/MonMap: remove redundant method ([pr#63364](https://github.com/ceph/ceph/pull/63364), Patrick Donnelly)

- mon/OSDMonitor<span></span>.cc: optionally display availability status in json ([pr#65489](https://github.com/ceph/ceph/pull/65489), Shraddha Agrawal)

- mon/OSDMonitor: call no\_reply() on ignored osd alive ([pr#64135](https://github.com/ceph/ceph/pull/64135), Nitzan Mordechai)

- mon/OSDMonitor: remove unused crush rules after erasure code pools deleted ([pr#53457](https://github.com/ceph/ceph/pull/53457), Nitzan Mordechai)

- mon/PGmap: Add warn description for bluestore fragmentation ([pr#64458](https://github.com/ceph/ceph/pull/64458), Michael J. Kidd)

- mon/PGMap: sort 'osd df' and 'osd perf' outputs by OSD ID ([pr#67915](https://github.com/ceph/ceph/pull/67915), falconlee236)

- mon: Add command "nvme-gw listeners" ([pr#65689](https://github.com/ceph/ceph/pull/65689), Vallari Agrawal)

- mon: add command osd pool clear-availability-status ([pr#63552](https://github.com/ceph/ceph/pull/63552), Shraddha Agrawal)

- mon: add config option to change availability score update interval ([pr#65172](https://github.com/ceph/ceph/pull/65172), Shraddha Agrawal)

- mon: add config option to toggle availability score feature ([pr#63159](https://github.com/ceph/ceph/pull/63159), Shraddha Agrawal)

- Mon: Add health warning for blaum-roth EC profile when w+1 is not prime ([issue#64419](http://tracker.ceph.com/issues/64419), [pr#65940](https://github.com/ceph/ceph/pull/65940), Tom Sollers)

- Mon: Add new health warning for non prime w+1 in blaum-roth EC profiles ([issue#64419](http://tracker.ceph.com/issues/64419), [pr#66129](https://github.com/ceph/ceph/pull/66129), Tom Sollers)

- mon: Avoid false stuck peering warning ([pr#65390](https://github.com/ceph/ceph/pull/65390), Mohit Agrawal)

- mon: ceph pg repeer should propose a correctly sized pg temp ([pr#66323](https://github.com/ceph/ceph/pull/66323), Alex Ainscow)

- mon: default chunk size change ([pr#64908](https://github.com/ceph/ceph/pull/64908), Jake Squelch)

- mon: Deny EC optimizations (fast EC) for non-4k-aligned chunk-sizes ([pr#67314](https://github.com/ceph/ceph/pull/67314), Alex Ainscow)

- mon: fix ConnectionTracker::notify\_rank\_removed ([pr#69771](https://github.com/ceph/ceph/pull/69771), Kamoltat (Junior) Sirivadhna)

- mon: fix source file permissions ([pr#67965](https://github.com/ceph/ceph/pull/67965), Patrick Donnelly)

- mon: Health warning for colocated monitors ([pr#67451](https://github.com/ceph/ceph/pull/67451), Eric Zhang)

- mon: implement mon backup mechanism ([pr#69586](https://github.com/ceph/ceph/pull/69586), Matthew N. Heler)

- mon: include cleanup ([pr#68400](https://github.com/ceph/ceph/pull/68400), Max Kellermann)

- mon: increase dns buffer size ([pr#59565](https://github.com/ceph/ceph/pull/59565), Nuckal777)

- mon: make tiebreaker mon optional in stretch-mode ([pr#68409](https://github.com/ceph/ceph/pull/68409), Kamoltat (Junior) Sirivadhna)

- mon: paxos\_service\_min\_trim bug fix, ceph tracker issue: 71610 ([pr#63890](https://github.com/ceph/ceph/pull/63890), Shreya Subramanian)

- mon: reduce header dependencies ([pr#65509](https://github.com/ceph/ceph/pull/65509), Max Kellermann)

- mon: require EC optimizations for Crimson EC pools ([pr#70331](https://github.com/ceph/ceph/pull/70331), Ronen Friedman)

- mon: Revert "mon: Add nvmeof group/gateway name in "ceph -s"" ([pr#63416](https://github.com/ceph/ceph/pull/63416), Vallari Agrawal)

- mon: simplify discard queue health warning ([pr#68353](https://github.com/ceph/ceph/pull/68353), Jaya Prakash)

- monc: synchronize tick() of MonClient with shutdown() ([pr#64756](https://github.com/ceph/ceph/pull/64756), Radoslaw Zarzynski)

- monitor: Enhance historic ops command output and error handling ([pr#64038](https://github.com/ceph/ceph/pull/64038), Nitzan Mordechai)

- monitoring/ceph-mixin/dashboards\_out: Correct panel title in ceph-cluster-advanced<span></span>.json ([pr#63685](https://github.com/ceph/ceph/pull/63685), Anthony D'Atri)

- monitoring: Add alert NVMeoFHostKeepAliveTimeout ([pr#64067](https://github.com/ceph/ceph/pull/64067), Vallari Agrawal)

- monitoring: Add per share metrics to SMB dashboard ([pr#64719](https://github.com/ceph/ceph/pull/64719), Ankush Behl)

- monitoring: Add subvolume dashboard ([pr#66802](https://github.com/ceph/ceph/pull/66802), Aashish Sharma, Ankush Behl)

- monitoring: add user-agent headers to the urllib ([pr#65470](https://github.com/ceph/ceph/pull/65470), Nizamudeen A)

- monitoring: fix "In" OSDs in Cluster-Advanced grafana panel<span></span>. Also change units from decbytes to bytes wherever used in the panel ([pr#65561](https://github.com/ceph/ceph/pull/65561), Aashish Sharma)

- monitoring: fix "Total gateway" and "Ceph Health NVMeoF WARNING" grafana graphs ([pr#63353](https://github.com/ceph/ceph/pull/63353), Vallari Agrawal)

- monitoring: Fix application overview to show Raw used ([pr#68788](https://github.com/ceph/ceph/pull/68788), Ankush Behl)

- monitoring: fix CephPgImbalance alert rule expression ([pr#66604](https://github.com/ceph/ceph/pull/66604), Aashish Sharma)

- monitoring: Fix Filesystem grafana dashboard units ([pr#65930](https://github.com/ceph/ceph/pull/65930), Ankush Behl)

- monitoring: fix MTU Mismatch alert rule and expr ([pr#64467](https://github.com/ceph/ceph/pull/64467), Aashish Sharma)

- monitoring: Fix NVMeoF subsys/namespace limit alerts ([pr#62947](https://github.com/ceph/ceph/pull/62947), Vallari Agrawal)

- monitoring: fix rgw\_servers filtering in rgw sync overview grafana ([pr#66791](https://github.com/ceph/ceph/pull/66791), Aashish Sharma)

- monitoring: Fixes for development ([pr#66326](https://github.com/ceph/ceph/pull/66326), Afreen Misbah)

- monitoring: Fixes for smb overview ([pr#65938](https://github.com/ceph/ceph/pull/65938), Ankush Behl)

- monitoring: Improve grafana dashboards naming convention ([pr#65711](https://github.com/ceph/ceph/pull/65711), Aashish Sharma)

- monitoring: make cluster matcher backward compatible for pre-reef metrics ([pr#66661](https://github.com/ceph/ceph/pull/66661), Aashish Sharma)

- monitoring: remove cephfs<span></span>.libsonnet mention from dashboards<span></span>.libsonnet ([pr#66311](https://github.com/ceph/ceph/pull/66311), Aashish Sharma)

- monitoring: Rename Ceph Object - Sync Overview - Replication (objects) from Source Zone ([pr#70270](https://github.com/ceph/ceph/pull/70270), Aashish Sharma)

- monitoring: update NVMeoFTooManyNamespaces to 4096 ns ([pr#66988](https://github.com/ceph/ceph/pull/66988), Vallari Agrawal)

- monitoring: upgrade grafana version to 12<span></span>.3<span></span>.1 ([pr#66917](https://github.com/ceph/ceph/pull/66917), Aashish Sharma)

- mr/dashboard: remove rgw\_servers filter from radosgw-sync-overview grafana dashboard ([pr#68576](https://github.com/ceph/ceph/pull/68576), Aashish Sharma)

- msg/async/Event: use eventfd on Linux ([pr#60105](https://github.com/ceph/ceph/pull/60105), Max Kellermann)

- msg/async/frames\_v2: doc: FRAME\_EARLY\_DATA\_COMPRESSED is used in prologue, not epilogue ([pr#66746](https://github.com/ceph/ceph/pull/66746), Johannes Cornelis Draaijer)

- msg/async/ProtocolV2: Speed up connection logic when peer restarts & Added Netsplit Grace Period ([pr#64122](https://github.com/ceph/ceph/pull/64122), Kamoltat Sirivadhna)

- msg/async: make msgr\_active\_connections counter a gauge to prevent underflow ([pr#68676](https://github.com/ceph/ceph/pull/68676), Joshua Blanch)

- msg/async: SMC on s390x ([pr#64894](https://github.com/ceph/ceph/pull/64894), Aliaksei Makarau)

- msg: drain stack before stopping processors to avoid shutdown hang ([pr#63261](https://github.com/ceph/ceph/pull/63261), Nitzan Mordechai)

- msg: include cleanup ([pr#68628](https://github.com/ceph/ceph/pull/68628), Max Kellermann)

- msg: include cleanup ([pr#65404](https://github.com/ceph/ceph/pull/65404), Max Kellermann)

- mstart: allow setting the base mon port from env variable ([pr#63852](https://github.com/ceph/ceph/pull/63852), Yuval Lifshitz)

- neorados/cls/fifo/detail/fifo: include strtol<span></span>.h ([pr#64952](https://github.com/ceph/ceph/pull/64952), Matan Breizman)

- neorados/cls/log: fix infinite trim loop on empty data log shards ([pr#68874](https://github.com/ceph/ceph/pull/68874), Oguzhan Ozmen)

- neorados: avoid using std::aligned\_storage\_t ([pr#64037](https://github.com/ceph/ceph/pull/64037), Kefu Chai)

- neorados: Fix Neorados CephContext leak and prevent future ones ([pr#66368](https://github.com/ceph/ceph/pull/66368), Adam C. Emerson)

- neorados: Increase timeouts in watch/notify poll tests ([pr#63987](https://github.com/ceph/ceph/pull/63987), Adam C. Emerson)

- neorados: specify alignments for aligned\_storage ([pr#66396](https://github.com/ceph/ceph/pull/66396), Casey Bodley)

- neorados: Various Fixes to Watch/Notify ([pr#67729](https://github.com/ceph/ceph/pull/67729), Adam C. Emerson)

- node-proxy: address `ceph orch hardware status` cmd ([pr#63556](https://github.com/ceph/ceph/pull/63556), Guillaume Abrioux)

- node-proxy: atollon hardware monitoring (FCM stats, temperatures, fan speed<span></span>.<span></span>.) ([pr#69707](https://github.com/ceph/ceph/pull/69707), Guillaume Abrioux)

- node-proxy: don't crash on empty Redfish logout ([pr#71727](https://github.com/ceph/ceph/pull/71727), Guillaume Abrioux)

- node-proxy: fix NodeProxySpec deserialization from JSON ([pr#70336](https://github.com/ceph/ceph/pull/70336), Guillaume Abrioux)

- node-proxy: major refactor and various fixes ([pr#67221](https://github.com/ceph/ceph/pull/67221), Guillaume Abrioux)

- nvmeof: Change the NVMEOF image version to 1<span></span>.6 ([pr#66959](https://github.com/ceph/ceph/pull/66959), Gil Bregman)

- nvmeof: Change the NVMEOF image version to 1<span></span>.7 ([pr#67467](https://github.com/ceph/ceph/pull/67467), Gil Bregman)

- nvmeof: Change the NVMEOF image version to 1<span></span>.8 ([pr#69144](https://github.com/ceph/ceph/pull/69144), Gil Bregman)

- nvmeof: create /dev/dsa if DSA acceleration is enabled and the device is missing ([pr#64779](https://github.com/ceph/ceph/pull/64779), Alexander Indenbaum)

- nvmeof: refactor beacon timer for exact frequency timing with drift correction ([pr#66001](https://github.com/ceph/ceph/pull/66001), Alexander Indenbaum)

- nvmeofgw ([pr#64245](https://github.com/ceph/ceph/pull/64245), Leonid Chernin)

- nvmeofgw : ignore  beacons and send empty maps to  GWs in DELETING state ([pr#67331](https://github.com/ceph/ceph/pull/67331), Leonid Chernin)

- nvmeofgw: arm beacon timeouts for GWs in Created state ([pr#70320](https://github.com/ceph/ceph/pull/70320), Leonid Chernin)

- nvmeofgw: cleanup pending map upon monitor restart ([pr#64863](https://github.com/ceph/ceph/pull/64863), Leonid Chernin)

- nvmeofgw: delay failback ([pr#67717](https://github.com/ceph/ceph/pull/67717), Leonid Chernin)

- nvmeofgw: fix issue of delete all gws from the pool/group ([pr#65236](https://github.com/ceph/ceph/pull/65236), Leonid Chernin)

- nvmeofgw: fix sending acks during upgrade ([pr#63883](https://github.com/ceph/ceph/pull/63883), Leonid Chernin)

- nvmeofgw: introduce nvme-gw show-all ([pr#70317](https://github.com/ceph/ceph/pull/70317), Leonid Chernin)

- nvmeofgw: stretched cluster fix relocate ([pr#70322](https://github.com/ceph/ceph/pull/70322), Leonid Chernin)

- nvmeofgw:fix forcing unavailable gw exit by sending ([pr#69728](https://github.com/ceph/ceph/pull/69728), Leonid Chernin)

- objecter: request OSDMap after idle ticks ([pr#63425](https://github.com/ceph/ceph/pull/63425), Nitzan Mordechai)

- Objecter: respect higher epoch subscription in tick ([pr#66304](https://github.com/ceph/ceph/pull/66304), Nitzan Mordechai)

- Ok to stop check for osd redeploy or reconfig ([pr#72032](https://github.com/ceph/ceph/pull/72032), Shweta Bhosale)

- Optimised EC: Ignore snapshot scrubbing on non-primary shards ([pr#63843](https://github.com/ceph/ceph/pull/63843), Alex Ainscow)

- Optimized Erasure Coding - Fixpack 2 ([pr#64501](https://github.com/ceph/ceph/pull/64501), Bill Scales, Alex Ainscow, Jon Bailey)

- options/global: raise bluestore\_compression\_min\_blob\_size\_hdd to 64K ([pr#67421](https://github.com/ceph/ceph/pull/67421), Igor Fedotov)

- options/mon: disable availability tracking by default ([pr#65545](https://github.com/ceph/ceph/pull/65545), Shraddha Agrawal)

- options: fix typos ([pr#64346](https://github.com/ceph/ceph/pull/64346), N Balachandran)

- orch/cephadm: fix osd<span></span>.default creation ([pr#67955](https://github.com/ceph/ceph/pull/67955), Guillaume Abrioux)

- orch/cephadm: Fixes an unlimited env append in cephadm agent ([pr#66477](https://github.com/ceph/ceph/pull/66477), Rafal Wadolowski)

- orch/module: Make orch unpause an alias for orch resume ([pr#63048](https://github.com/ceph/ceph/pull/63048), Joshua Blanch)

- os,common:change osd\_target\_transaction\_size to uint ([pr#64500](https://github.com/ceph/ceph/pull/64500), Kefu Chai)

- os/bluestore/bluefs: Fix stat() for WAL envelope mode ([pr#66512](https://github.com/ceph/ceph/pull/66512), Adam Kupczyk)

- os/bluestore/BlueFS: use nullptr when appropriate ([pr#63603](https://github.com/ceph/ceph/pull/63603), Kefu Chai)

- os/bluestore/compression: Fix Estimator::split\_and\_compress ([pr#63373](https://github.com/ceph/ceph/pull/63373), Adam Kupczyk)

- os/bluestore: add 'bluefs stats reset' admin socket command ([pr#67609](https://github.com/ceph/ceph/pull/67609), Igor Fedotov)

- os/bluestore: add health warn for shared DB/WAL ratio ([pr#67192](https://github.com/ceph/ceph/pull/67192), Indira Sawant)

- os/bluestore: add omap\_bytes perf counter ([pr#66527](https://github.com/ceph/ceph/pull/66527), Garry Drankovich)

- os/bluestore: Add printing shards to Onode::printer ([pr#62815](https://github.com/ceph/ceph/pull/62815), Adam Kupczyk)

- os/bluestore: add static and runtime object fragmentation tracking ([pr#67019](https://github.com/ceph/ceph/pull/67019), Jaya Prakash)

- os/bluestore: avoid redundant map lookup for deferred op ([pr#67889](https://github.com/ceph/ceph/pull/67889), Garry Drankovich)

- os/bluestore: BlueFS Spillover Cleaner Evolution ([pr#68430](https://github.com/ceph/ceph/pull/68430), Jaya Prakash)

- os/bluestore: complete fix for extent spanning over shard boundaries ([pr#65065](https://github.com/ceph/ceph/pull/65065), Igor Fedotov, Adam Kupczyk, Jaya Prakash)

- os/bluestore: Cputrace measurements for core BlueStore functions ([pr#66261](https://github.com/ceph/ceph/pull/66261), Adam Kupczyk)

- os/bluestore: Debug code to make reshard fail faster ([pr#62817](https://github.com/ceph/ceph/pull/62817), Adam Kupczyk)

- os/bluestore: do not add expanded space to allocator after allocmap recovery ([pr#70203](https://github.com/ceph/ceph/pull/70203), Igor Fedotov)

- os/bluestore: do not increment \*issued\_deferred\* counters twice ([pr#68775](https://github.com/ceph/ceph/pull/68775), Garry Drankovich)

- os/bluestore: Do not recompress large compressed blobs ([pr#63161](https://github.com/ceph/ceph/pull/63161), Adam Kupczyk)

- os/bluestore: do not use buffered IO for BlueFS WAL ([pr#65275](https://github.com/ceph/ceph/pull/65275), Igor Fedotov)

- os/bluestore: dump effective elastic shared blobs mode in OSD metadata report ([pr#68898](https://github.com/ceph/ceph/pull/68898), Garry Drankovich)

- os/bluestore: Fix bluefs\_fnode\_t::seek ([pr#63188](https://github.com/ceph/ceph/pull/63188), Adam Kupczyk)

- os/bluestore: Fix ExtentMap::reshard produce stray spanning blobs ([pr#68798](https://github.com/ceph/ceph/pull/68798), Igor Fedotov, Adam Kupczyk)

- os/bluestore: fix incorrect bluefs\_used accounting when releasing old extents ([pr#67420](https://github.com/ceph/ceph/pull/67420), Jaya Prakash)

- os/bluestore: fix memory leak in HybridAllocator destructor ([pr#64193](https://github.com/ceph/ceph/pull/64193), Kefu Chai)

- os/bluestore: Fix problem with onode cache causing stalls ([pr#65792](https://github.com/ceph/ceph/pull/65792), Adam Kupczyk)

- os/bluestore: fix reallocation and corruption when shared\_blob key is missing/undecodable ([pr#69085](https://github.com/ceph/ceph/pull/69085), dheart)

- os/bluestore: fix vselector update after enveloped WAL recovery ([pr#67312](https://github.com/ceph/ceph/pull/67312), Igor Fedotov)

- os/bluestore: Get rid of unused CACHE\_BLOB\_BL ([pr#64352](https://github.com/ceph/ceph/pull/64352), Adam Kupczyk)

- os/bluestore: Implemented create-bdev-label ([pr#62148](https://github.com/ceph/ceph/pull/62148), Jaya Prakash)

- os/bluestore: In BlueFS::truncate accept wierd alloc\_unit ([pr#62121](https://github.com/ceph/ceph/pull/62121), Adam Kupczyk)

- os/bluestore: introduce device type specific allocation policy ([pr#57789](https://github.com/ceph/ceph/pull/57789), Igor Fedotov)

- os/bluestore: Make extblkdev mandatory ([pr#67289](https://github.com/ceph/ceph/pull/67289), Adam Kupczyk)

- os/bluestore: make full device discard on mkfs a default behavior ([pr#64418](https://github.com/ceph/ceph/pull/64418), Igor Fedotov)

- os/bluestore: make vselector reserved\* parameters applicable in run-time ([pr#63642](https://github.com/ceph/ceph/pull/63642), Igor Fedotov)

- os/bluestore: Optimize Blob::put() for single-reference fast path ([pr#66022](https://github.com/ceph/ceph/pull/66022), Jaya Prakash)

- os/bluestore: optimize shared blob unsharing during snapshot removal ([pr#68607](https://github.com/ceph/ceph/pull/68607), dheart)

- os/bluestore: print effective extra in 'bluefs stats' report ([pr#68036](https://github.com/ceph/ceph/pull/68036), Igor Fedotov)

- os/bluestore: remove obsolete "zoned" freelist type ([pr#68502](https://github.com/ceph/ceph/pull/68502), Igor Fedotov)

- os/bluestore: report metadata/data ratio in BlueFS perf counter ([pr#65375](https://github.com/ceph/ceph/pull/65375), Igor Fedotov)

- os/bluestore: separate slow scrub ops from normal slow ops ([pr#66577](https://github.com/ceph/ceph/pull/66577), Jaya Prakash)

- os/bluestore: Set of various fixes to bluefs ([pr#63761](https://github.com/ceph/ceph/pull/63761), Adam Kupczyk)

- os/bluestore: show RocksDB sharding information ([pr#66526](https://github.com/ceph/ceph/pull/66526), Garry Drankovich)

- os/bluestore: Solve NCB recovery asserting when onode key is missing ([pr#67699](https://github.com/ceph/ceph/pull/67699), Adam Kupczyk)

- os/bluestore: track compression\\_\*blob\_size\* parameters for online update ([pr#67433](https://github.com/ceph/ceph/pull/67433), Igor Fedotov)

- os/bluestore: track max latencies for key bluestore/bluefs perf counters ([pr#65274](https://github.com/ceph/ceph/pull/65274), Igor Fedotov)

- os/bluestore: use \_release\_pending\_allocations() during file migration ([pr#70436](https://github.com/ceph/ceph/pull/70436), Jaya Prakash)

- os/bluestore: use default value for non-decoded field in test instances ([pr#63935](https://github.com/ceph/ceph/pull/63935), Kefu Chai)

- os/bluestore:fix bluestore\_volume\_selection\_reserved\_factor usage ([pr#63358](https://github.com/ceph/ceph/pull/63358), Igor Fedotov)

- os/Transaction: initialize unused fields in TransactionData ([pr#65075](https://github.com/ceph/ceph/pull/65075), Kefu Chai)

- os: drop KStore ([pr#65173](https://github.com/ceph/ceph/pull/65173), Radoslaw Zarzynski)

- os: eliminate ObjectStore::get\_omap\_keys method ([pr#65763](https://github.com/ceph/ceph/pull/65763), Garry Drankovich)

- os: Page class: disable move operations and improve custom delete operator for proper memory management ([pr#64957](https://github.com/ceph/ceph/pull/64957), Edwin Rodriguez)

- os: resolve unused variable warning ([pr#65714](https://github.com/ceph/ceph/pull/65714), Patrick Donnelly)

- os: Use custom delete operator for raw\_combined ([pr#64965](https://github.com/ceph/ceph/pull/64965), Edwin Rodriguez)

- osd shard changes upon restart ([pr#64975](https://github.com/ceph/ceph/pull/64975), Chunmei Liu, chunmei liu)

- osd, os, mon: s/assert/ceph\_assert/g' ([pr#63374](https://github.com/ceph/ceph/pull/63374), Matan Breizman)

- osd-recovery-prio: race condition fix in TEST\_recovery\_pool\_priority ([pr#69689](https://github.com/ceph/ceph/pull/69689), Nitzan Mordechai)

- osd/ECExtentCache: cleanup and optimization ([pr#64063](https://github.com/ceph/ceph/pull/64063), Kefu Chai)

- osd/ECTransaction: fix truncate+write planning for EC shard sizes ([pr#69719](https://github.com/ceph/ceph/pull/69719), Alex Ainscow)

- osd/ECUtil: Fix erase\_after\_ro\_offset length calculation and add tests ([pr#66817](https://github.com/ceph/ceph/pull/66817), Alex Ainscow)

- osd/PeeringState: add perf counters for PG rebuild times ([pr#69962](https://github.com/ceph/ceph/pull/69962), Sridhar Seshasayee)

- osd/PeeringState: don't clear PG rebuild latch on same-primary interval restart ([pr#70990](https://github.com/ceph/ceph/pull/70990), Sridhar Seshasayee)

- osd/PeeringState: handle race condition of DeferBackfill event for Backfilling state ([pr#63572](https://github.com/ceph/ceph/pull/63572), Naveen Naidu)

- osd/PeeringState: handle race condition of RemoteReservationRevoked event for Backfilling state ([pr#67122](https://github.com/ceph/ceph/pull/67122), Naveen Naidu)

- osd/PeeringState: re-evaluate full OSDs while waiting for recovery re… ([pr#63296](https://github.com/ceph/ceph/pull/63296), Nitzan Mordechai)

- osd/PeeringState: Record the departing primary's rebuild segment on handover & survive a PG split ([pr#72178](https://github.com/ceph/ceph/pull/72178), Sridhar Seshasayee)

- osd/PeeringState: track the PG vulnerability window via last\_degraded/last\_clean, repurpose PG rebuild duration counter ([pr#72496](https://github.com/ceph/ceph/pull/72496), Sridhar Seshasayee)

- osd/PrimaryLogPG: avoid redundant container clones and lookups ([pr#65513](https://github.com/ceph/ceph/pull/65513), Garry Drankovich)

- osd/PrimaryLogPG: Do not log REPLACE until require\_osd\_release is umbrella ([pr#71183](https://github.com/ceph/ceph/pull/71183), Aishwarya Mathuria)

- osd/PrimaryLogPG: encode an empty data\_bl for empty sparse reads ([pr#66912](https://github.com/ceph/ceph/pull/66912), Ilya Dryomov)

- osd/PrimaryLogPG: Relax replicated reads when recovering ([pr#62805](https://github.com/ceph/ceph/pull/62805), Matan Breizman)

- osd/rados/rgw/cephfs: Modernize cls interface with compile time safety ([pr#66258](https://github.com/ceph/ceph/pull/66258), Alex Ainscow)

- osd/scheduler: Classify subOp reads according to op priority for mClock ([pr#69761](https://github.com/ceph/ceph/pull/69761), Sridhar Seshasayee)

- osd/scrub: 'repairing' scrubs allowed at all times ([pr#69110](https://github.com/ceph/ceph/pull/69110), Ronen Friedman)

- osd/scrub: 'starts' messages should name PGs, not shards ([pr#64211](https://github.com/ceph/ceph/pull/64211), Ronen Friedman)

- osd/scrub: allow auto-repair on operator-initiated scrubs ([pr#64567](https://github.com/ceph/ceph/pull/64567), Ronen Friedman)

- osd/scrub: always round up reported scrub duration ([pr#62996](https://github.com/ceph/ceph/pull/62996), Ronen Friedman)

- osd/scrub: auto-correct accounting-only stat mismatches ([pr#68684](https://github.com/ceph/ceph/pull/68684), Ronen Friedman)

- osd/scrub: avoid using moved-from auth\_n\_errs ([pr#64859](https://github.com/ceph/ceph/pull/64859), Ronen Friedman)

- osd/scrub: calculate EC digest map size only once ([pr#65151](https://github.com/ceph/ceph/pull/65151), Ronen Friedman)

- osd/scrub: check all(\*) conditions in restrictions\_on\_scrubbing() ([pr#63093](https://github.com/ceph/ceph/pull/63093), Ronen Friedman)

- osd/scrub: clarify that osd\_scrub\_auto\_repair\_num\_errors counts objects ([pr#64048](https://github.com/ceph/ceph/pull/64048), Ronen Friedman)

- osd/scrub: clean up inconsistent\_obj\_wrapper and ScrubStore ([pr#69177](https://github.com/ceph/ceph/pull/69177), Ronen Friedman)

- osd/scrub: clear m\_ec\_digest\_map between objects ([pr#65421](https://github.com/ceph/ceph/pull/65421), Ronen Friedman)

- osd/scrub: do not attempt to read past the end of an object ([pr#66375](https://github.com/ceph/ceph/pull/66375), Ronen Friedman)

- osd/scrub: do not limit operator-initiated repairs ([pr#64849](https://github.com/ceph/ceph/pull/64849), Ronen Friedman)

- osd/scrub: do not reduce min chunk on preemption ([pr#65859](https://github.com/ceph/ceph/pull/65859), Ronen Friedman)

- osd/scrub: extract\_crc\_from\_bufferlist: fix off-by-1 error ([pr#67613](https://github.com/ceph/ceph/pull/67613), Ronen Friedman)

- osd/scrub: fix blocked scrub accounting ([pr#65834](https://github.com/ceph/ceph/pull/65834), Ronen Friedman)

- osd/scrub: fix deadline calculations ([pr#63183](https://github.com/ceph/ceph/pull/63183), Ronen Friedman)

- osd/scrub: fix heap-buffer-overflow when checking digest emptiness ([pr#65193](https://github.com/ceph/ceph/pull/65193), Kefu Chai)

- osd/scrub: fixing additional log messages to name pgids ([pr#64244](https://github.com/ceph/ceph/pull/64244), Ronen Friedman)

- osd/scrub: improve scrub target dumps ([pr#66749](https://github.com/ceph/ceph/pull/66749), Ronen Friedman)

- osd/scrub: increasing the default data-read stride ([pr#66230](https://github.com/ceph/ceph/pull/66230), Ronen Friedman)

- osd/scrub: make m\_session\_started\_at at Session state ctor ([pr#63758](https://github.com/ceph/ceph/pull/63758), Ronen Friedman)

- osd/scrub: making Scrub's fadvide flags a constant ([pr#63056](https://github.com/ceph/ceph/pull/63056), Ronen Friedman)

- osd/scrub: minor cleanups ([pr#68002](https://github.com/ceph/ceph/pull/68002), Ronen Friedman)

- osd/scrub: modify OMAP stats collection ([pr#65338](https://github.com/ceph/ceph/pull/65338), Ronen Friedman)

- osd/scrub: modify repair\_object() to accept a single auth peer ([pr#65484](https://github.com/ceph/ceph/pull/65484), Ronen Friedman)

- osd/scrub: no auto-repair in 'after\_repair' type of scrubs ([pr#63525](https://github.com/ceph/ceph/pull/63525), Ronen Friedman)

- osd/scrub: only periodic\_regular scrubs should suffer extended sleeps ([pr#63559](https://github.com/ceph/ceph/pull/63559), Ronen Friedman)

- osd/scrub: remove OsdScrub::LoadTracker ([pr#63379](https://github.com/ceph/ceph/pull/63379), Ronen Friedman)

- osd/scrub: remove the 2'nd option for determining 'low load' for scrub ([pr#63325](https://github.com/ceph/ceph/pull/63325), Ronen Friedman)

- osd/scrub: removing the unused next\_deepscrub\_interval() ([pr#66998](https://github.com/ceph/ceph/pull/66998), Ronen Friedman)

- osd/scrub: scanning the rollbacks not mandating a reschedule ([pr#65780](https://github.com/ceph/ceph/pull/65780), Ronen Friedman)

- osd/scrub: scrub\_job cleanup ([pr#69148](https://github.com/ceph/ceph/pull/69148), Ronen Friedman)

- osd/scrub: some perf counters had their priority set to '0' ([pr#64182](https://github.com/ceph/ceph/pull/64182), Ronen Friedman)

- osd/scrub: support an operator-abort command ([pr#66515](https://github.com/ceph/ceph/pull/66515), Ronen Friedman)

- osd/scrubber: replace deprecated fmt::localtime() with localtime\_r() ([pr#63970](https://github.com/ceph/ceph/pull/63970), Kefu Chai)

- osd/SnapMapper: fix Crimson logs ([pr#66336](https://github.com/ceph/ceph/pull/66336), Matan Breizman)

- osd/SnapMapper: fix SnapMapper::Scrubber shard parsing ([pr#65525](https://github.com/ceph/ceph/pull/65525), Matan Breizman, ethanwu)

- osd/SnapMapper: more efficient object list generation in ([pr#65511](https://github.com/ceph/ceph/pull/65511), Garry Drankovich)

- osd/SnapMapper::update\_snaps() to handle a missing OBJ\\_ record ([pr#68707](https://github.com/ceph/ceph/pull/68707), Ronen Friedman)

- osd/test: Add EC peering test infrastructure and recovery test cases ([pr#68697](https://github.com/ceph/ceph/pull/68697), Alex Ainscow)

- osd/test: Fix build breakage when WITH\_EC\_ISA\_PLUGIN is OFF ([pr#68872](https://github.com/ceph/ceph/pull/68872), Krunal Chheda)

- osd: \_send\_boot() doesn't put stale, cached cluster\_addrs in MOSDBoot ([pr#64141](https://github.com/ceph/ceph/pull/64141), Radoslaw Zarzynski)

- osd: Access/Modify epoch maps under mutex in OSDSuperblock class ([pr#62916](https://github.com/ceph/ceph/pull/62916), Mohit Agrawal)

- OSD: Add EC backend test infrastructure with peering support ([pr#67584](https://github.com/ceph/ceph/pull/67584), Alex Ainscow)

- osd: Add flag to Identify Scrub IO ([pr#66552](https://github.com/ceph/ceph/pull/66552), Jaya Prakash)

- osd: add last\_degraded field to pg\_stat\_t ([pr#68910](https://github.com/ceph/ceph/pull/68910), Sridhar Seshasayee)

- OSD: add latency data to DEQUEUE\_OP\_END event ([pr#65054](https://github.com/ceph/ceph/pull/65054), Oguzhan Ozmen)

- osd: add pg-upmap-primary to clean\_pg\_upmaps ([pr#62067](https://github.com/ceph/ceph/pull/62067), Laura Flores)

- osd: Add unittests for PeeringState ([pr#67304](https://github.com/ceph/ceph/pull/67304), Bill Scales)

- osd: Added perf counters for full and incremental maps ([pr#63889](https://github.com/ceph/ceph/pull/63889), Shreya Subramanian)

- osd: Allow multiple objects with same version in missing list ([pr#68284](https://github.com/ceph/ceph/pull/68284), Alex Ainscow)

- osd: Avoid assertion on empty object read when reading multiple objects ([pr#68637](https://github.com/ceph/ceph/pull/68637), Alex Ainscow)

- osd: avoid ceph\_abort in build\_incremental\_map\_msg when newest\_map is misssig ([pr#67253](https://github.com/ceph/ceph/pull/67253), Vinayak Tiwari)

- osd: Avoid pwlc spanning intervals ([pr#67244](https://github.com/ceph/ceph/pull/67244), Bill Scales)

- osd: be more verbose in OSD::run\_osd\_bench\_test ([pr#62866](https://github.com/ceph/ceph/pull/62866), Igor Fedotov)

- osd: cast uint8\_t we output as string so they get displayed as numbers and not strings ([pr#70387](https://github.com/ceph/ceph/pull/70387), Jon Bailey)

- osd: Change rmissing map key from version\_t to eversion\_t ([pr#66799](https://github.com/ceph/ceph/pull/66799), Alex Ainscow)

- osd: Choose PDW over traditional RMW if number of reads required is equal ([pr#65388](https://github.com/ceph/ceph/pull/65388), Jamie Pryde)

- osd: Correct missing list on divergent merge of partial writes ([pr#68727](https://github.com/ceph/ceph/pull/68727), Alex Ainscow)

- osd: Correct scrub analysis for optimised EC ([pr#62952](https://github.com/ceph/ceph/pull/62952), Alex Ainscow)

- osd: delete duplicate data in enqueue\_op() log message ([pr#64243](https://github.com/ceph/ceph/pull/64243), Ronen Friedman)

- osd: Deleting PG should discard pwlc ([pr#66511](https://github.com/ceph/ceph/pull/66511), Bill Scales)

- osd: Do not remove objects with divergent logs if only partial writes ([pr#66698](https://github.com/ceph/ceph/pull/66698), Alex Ainscow)

- OSD: EC recovery zero detect ([pr#63408](https://github.com/ceph/ceph/pull/63408), Alex Ainscow, Radoslaw Zarzynski)

- osd: FastEC: always update pwlc epoch when activating ([pr#66685](https://github.com/ceph/ceph/pull/66685), Bill Scales)

- osd: fix ASAN ODR violations in denc-mod-osd ([pr#68084](https://github.com/ceph/ceph/pull/68084), Kefu Chai)

- osd: Fix bug when calculating min\_peer\_features ([pr#68936](https://github.com/ceph/ceph/pull/68936), Bill Scales)

- osd: Fix condition for rolling forward pg log entries ([pr#68888](https://github.com/ceph/ceph/pull/68888), Matty Williams)

- osd: Fix fast EC truncate to whole stripe ([pr#66542](https://github.com/ceph/ceph/pull/66542), Alex Ainscow)

- osd: fix for "data digests are inconsistent" ([pr#65623](https://github.com/ceph/ceph/pull/65623), Jon Bailey)

- osd: Fix for num\_bytes mismatch occurring from snapshot workloads with partial writes in fast\_ec ([pr#67136](https://github.com/ceph/ceph/pull/67136), Jon Bailey)

- osd: Fix inconsistency in how we check if writes are blocked by scrub ([pr#72196](https://github.com/ceph/ceph/pull/72196), Jon Bailey)

- osd: Fix incorrect rollback logic for partial write OI ([pr#68609](https://github.com/ceph/ceph/pull/68609), Alex Ainscow)

- osd: fix init of op\_queue\_type\_t due to returnable ceph\_assert() ([pr#62809](https://github.com/ceph/ceph/pull/62809), Radoslaw Zarzynski)

- osd: Fix memory leak of ECDummyOp ([pr#66961](https://github.com/ceph/ceph/pull/66961), Alex Ainscow)

- osd: fix ODR violation in max\_prio\_map ([pr#66440](https://github.com/ceph/ceph/pull/66440), Kefu Chai)

- osd: fix PrimaryLogPG op ordering during laggy state ([pr#67945](https://github.com/ceph/ceph/pull/67945), Dror Guy)

- osd: Fix stats mismatch cluster error seen during scrubbing occasionally ([pr#65788](https://github.com/ceph/ceph/pull/65788), Jon Bailey)

- osd: handle all the updated keys in OSD::maybe\_override\_options\_for\_qos ([pr#67126](https://github.com/ceph/ceph/pull/67126), Garry Drankovich)

- osd: hash function for eversion\_t ([pr#65717](https://github.com/ceph/ceph/pull/65717), Ronen Friedman)

- osd: Improved pg-upmap computing speed ([pr#53891](https://github.com/ceph/ceph/pull/53891), Kefu Chai, Hu-Yuxuan)

- osd: migrate from boost::variant to std::variant ([pr#63414](https://github.com/ceph/ceph/pull/63414), Kefu Chai)

- osd: Multiple fixes to optimized EC and peering ([pr#63873](https://github.com/ceph/ceph/pull/63873), Alex Ainscow, Bill Scales)

- OSD: Optimised EC Deep Scrubbing Implementation ([pr#63184](https://github.com/ceph/ceph/pull/63184), Jon Bailey)

- osd: Perform shard look up correctly in partial EC writes ([pr#66453](https://github.com/ceph/ceph/pull/66453), Alex Ainscow)

- osd: PGLog Attach correct version to missing list when ignoring log entries ([pr#67870](https://github.com/ceph/ceph/pull/67870), Alex Ainscow)

- osd: prevent OSDMap::check\_health() from asserting due to new OSDs found in subtree ([pr#64009](https://github.com/ceph/ceph/pull/64009), Radoslaw Zarzynski)

- osd: pwlc was able to retain values larger than the last\_update ([pr#72193](https://github.com/ceph/ceph/pull/72193), Jon Bailey)

- osd: recalculate coll\_t::\_str during decode() to fix stale values ([pr#63938](https://github.com/ceph/ceph/pull/63938), Kefu Chai)

- osd: Reduce pg\_stats invalidations occurring in fast ec ([pr#67292](https://github.com/ceph/ceph/pull/67292), Jon Bailey)

- osd: Reduce reads when rebalancing healthy Erasure Coded PGs ([pr#64502](https://github.com/ceph/ceph/pull/64502), Alex Ainscow)

- osd: Relax missing entry assert for partial writes ([pr#65770](https://github.com/ceph/ceph/pull/65770), Alex Ainscow)

- osd: Remove all references to hinfo from optimized EC ([pr#63960](https://github.com/ceph/ceph/pull/63960), Alex Ainscow)

- osd: Remove monc reference from scheduler ([pr#65694](https://github.com/ceph/ceph/pull/65694), Mohit Agrawal)

- osd: Replace deprecated std::align\_storage\_t with alignas ([pr#64595](https://github.com/ceph/ceph/pull/64595), Alex Ainscow)

- osd: run\_bench() - unify Crimson/Classic randomness implementation ([pr#67963](https://github.com/ceph/ceph/pull/67963), Ronen Friedman)

- osd: shuffle FastEC code needed by crimson from ECBackend to ECCommon ([pr#64577](https://github.com/ceph/ceph/pull/64577), Radoslaw Zarzynski)

- osd: stop scrub\_purged\_snaps() from ignoring osd\_beacon\_report\_interval ([pr#64837](https://github.com/ceph/ceph/pull/64837), Radoslaw Zarzynski)

- osd: Support for OMAPs in EC Pools - Classic ([pr#66726](https://github.com/ceph/ceph/pull/66726), Matty Williams)

- osd: Support for omaps in EC pools - Enabled ([pr#70155](https://github.com/ceph/ceph/pull/70155), Matty Williams)

- osd: Support for Synchronous Reads in EC ([pr#67079](https://github.com/ceph/ceph/pull/67079), Matty Williams)

- osd: Twiddle should create a full sized vector for optimized EC ([pr#67974](https://github.com/ceph/ceph/pull/67974), Alex Ainscow)

- osd: unregister admin socket commands in fast shutdown ([pr#69061](https://github.com/ceph/ceph/pull/69061), Jane Zhu)

- osd\_types: Restore new\_object marking for delete missing entries ([pr#62705](https://github.com/ceph/ceph/pull/62705), Nitzan Mordechai)

- osdc: Add minimum allowable split size for replica IOs ([pr#72197](https://github.com/ceph/ceph/pull/72197), Jon Bailey)

- osdc: add missing include ([pr#68629](https://github.com/ceph/ceph/pull/68629), Max Kellermann)

- osdc: deliver neorados completions to associated executor ([pr#69741](https://github.com/ceph/ceph/pull/69741), Radoslaw Zarzynski, Shilpa Jagannath)

- osdc: deliver neorados completions to associated executor ([pr#69253](https://github.com/ceph/ceph/pull/69253), Casey Bodley)

- osdc: Objecter::linger\_by\_cookie() for safe cast from uint64 ([pr#65698](https://github.com/ceph/ceph/pull/65698), Casey Bodley)

- osdc: remove unused rados<span></span>.h include from error\_code<span></span>.h ([pr#64260](https://github.com/ceph/ceph/pull/64260), Kefu Chai)

- osdc: unconditionally disable split reads for replica pools ([pr#70472](https://github.com/ceph/ceph/pull/70472), Callum James)

- osdc: uninline methods to reduce header dependencies and compile times ([pr#65391](https://github.com/ceph/ceph/pull/65391), Max Kellermann)

- osdc: Update CB\_ObjectOperation to use value types for patterns ([pr#64956](https://github.com/ceph/ceph/pull/64956), Edwin Rodriguez)

- OSDMap::calc\_pg\_maps: fix balancing for some (important) corner cases ([pr#71916](https://github.com/ceph/ceph/pull/71916), Dan van der Ster)

- OSDMonitor: Make sure pcm is initialised ([pr#62510](https://github.com/ceph/ceph/pull/62510), Brad Hubbard)

- Paxos: use mono clock for latency calculate in latency perfcount ([pr#64003](https://github.com/ceph/ceph/pull/64003), Nitzan Mordechai)

- PeeringState::needs\_recovery(): log first missing item ([pr#66606](https://github.com/ceph/ceph/pull/66606), Shraddha Agrawal)

- Prometheus configuration generation improvements ([pr#61770](https://github.com/ceph/ceph/pull/61770), Redouane Kachach)

- prometheus: Add Cephadm orch ps output metric to prometheus ([pr#64912](https://github.com/ceph/ceph/pull/64912), Ankush Behl)

- prometheus: Add OSD full and nearfull ratio to prometheus ([pr#64890](https://github.com/ceph/ceph/pull/64890), Ankush Behl)

- prometheus: Add RBD image metadata to prometheus ([pr#64835](https://github.com/ceph/ceph/pull/64835), Ankush Behl)

- Propagate quorum features to client ([pr#67951](https://github.com/ceph/ceph/pull/67951), Leonid Chernin)

- ProtocolV2: Revert "make handle\_existing\_connection check for cookie mismatch first" ([pr#64047](https://github.com/ceph/ceph/pull/64047), Kamoltat Sirivadhna)

- ptl-tool: add options to append to branch name ([pr#66298](https://github.com/ceph/ceph/pull/66298), Patrick Donnelly)

- ptl-tool: drop deprecated codecs<span></span>.open ([pr#68327](https://github.com/ceph/ceph/pull/68327), Jos Collin)

- pybind,cephfs: enhancements for rmtree() ([pr#65496](https://github.com/ceph/ceph/pull/65496), Rishabh Dave)

- pybind/ceph\_daemon: add 10s timeout to admin socket client ([pr#70335](https://github.com/ceph/ceph/pull/70335), Nitzan Mordechai)

- pybind/cephfs, mgr/volumes: introduce non-recurisve rmtree(), refactor purge() to use it and add MDS optimizations ([pr#63917](https://github.com/ceph/ceph/pull/63917), Rishabh Dave)

- pybind/cephfs: fix including of platform\_errno<span></span>.h ([pr#65839](https://github.com/ceph/ceph/pull/65839), Rishabh Dave)

- pybind/mgr/dashboard/frontend: add NPM\_CACHEDIR envvar, use in bwc ([pr#65055](https://github.com/ceph/ceph/pull/65055), Dan Mick)

- pybind/mgr/dashboard: dashboard/requirements-lint<span></span>.txt: re-pin rsscheck ([pr#66774](https://github.com/ceph/ceph/pull/66774), Ronen Friedman)

- pybind/mgr/dashboard: Use teuthology's actual requirements ([pr#65414](https://github.com/ceph/ceph/pull/65414), David Galloway)

- pybind/mgr/mgr\_module: isolate logging per mgr module ([pr#67327](https://github.com/ceph/ceph/pull/67327), Nitzan Mordechai)

- pybind/mgr/mirroring: modifies the cli command type to read ([pr#65265](https://github.com/ceph/ceph/pull/65265), Utkarsh Bhatt)

- pybind/mgr/pg\_autoscaler: Introduce dynamic threshold to improve scal… ([pr#65687](https://github.com/ceph/ceph/pull/65687), Prashant D)

- pybind/mgr/progress: cleanups ([pr#65318](https://github.com/ceph/ceph/pull/65318), Kefu Chai)

- pybind/mgr/status: drop asserts that fight the defaultdict defaults ([pr#68743](https://github.com/ceph/ceph/pull/68743), Kefu Chai)

- pybind/mgr/volumes: fix typo in casesensitive vxattr ([pr#62872](https://github.com/ceph/ceph/pull/62872), Patrick Donnelly)

- pybind/mgr/volumes: make casesensitive attr uniform in interface ([pr#62904](https://github.com/ceph/ceph/pull/62904), Patrick Donnelly)

- pybind/mgr: add default set of cmake/ctest labels to tests ([pr#65699](https://github.com/ceph/ceph/pull/65699), John Mulligan)

- pybind/mgr: call new \_ceph\_exit for killpoints ([pr#67632](https://github.com/ceph/ceph/pull/67632), Patrick Donnelly)

- pybind/mgr: disable mypy error in diskprediction\_local module ([pr#63931](https://github.com/ceph/ceph/pull/63931), John Mulligan)

- pybind/mgr: Fix missing empty lines in documentation in mgr\_module<span></span>.py ([pr#62785](https://github.com/ceph/ceph/pull/62785), Ville Ojamo)

- pybind/mgr: pin cheroot version in requirements-required<span></span>.txt ([pr#65633](https://github.com/ceph/ceph/pull/65633), Adam King)

- pybind/mgr: update modules to use independent CLICommand subtypes with distinct COMMAND attributes ([pr#66467](https://github.com/ceph/ceph/pull/66467), Samuel Just)

- pybind/orchestrator/cli: fix OrchestratorError retval sign ([pr#67652](https://github.com/ceph/ceph/pull/67652), Nitzan Mordhai)

- pybind/rados: Add list\_lockers() and break\_lock() to Rados Python interface ([pr#65022](https://github.com/ceph/ceph/pull/65022), Gil Bregman)

- pybind/rbd: handle non-existent groups properly in list\_snaps() ([pr#70256](https://github.com/ceph/ceph/pull/70256), VinayBhaskar-V)

- pybind: add pyproject<span></span>.toml to fix ReadTheDocs builds with pip 25<span></span>.3+ ([pr#66966](https://github.com/ceph/ceph/pull/66966), Kefu Chai)

- pybind: fix callback function type compatibility for GCC 14/15 ([pr#64176](https://github.com/ceph/ceph/pull/64176), Kefu Chai)

- pybind: remove deprecated PyEval\_InitThreads() calls ([pr#66508](https://github.com/ceph/ceph/pull/66508), Kefu Chai)

- pybind: replace deprecated IF statements with Tempita templates ([pr#66447](https://github.com/ceph/ceph/pull/66447), Kefu Chai)

- pybind: replace deprecated IF with C preprocessor macro ([pr#67135](https://github.com/ceph/ceph/pull/67135), Kefu Chai)

- pybind: replace deprecated license classifiers with SPDX expression ([pr#64705](https://github.com/ceph/ceph/pull/64705), Kefu Chai)

- python-common/hostspec: normalize hostnames for case-insensitive matc… ([pr#66820](https://github.com/ceph/ceph/pull/66820), Shubha Jain)

- python-common/rgw: fix get\_realm\_tokens returning empty result for realms with a secondary zone ([pr#70416](https://github.com/ceph/ceph/pull/70416), Aashish Sharma)

- python-common: Adding precheck for placement<span></span>.count\_per\_host in NFSServiceSpec ([pr#70074](https://github.com/ceph/ceph/pull/70074), Shweta Bhosale)

- python-common: enable consistent code formatting with 'black' ([pr#65155](https://github.com/ceph/ceph/pull/65155), John Mulligan)

- python-common: fix raw OSD prepare to use osd-id instead of osd-ids ([pr#67842](https://github.com/ceph/ceph/pull/67842), Yonatan Zaken)

- python-common: Improve mgmt-gateway descriptions in service\_spec<span></span>.py ([pr#66383](https://github.com/ceph/ceph/pull/66383), Ville Ojamo)

- python-common: Improve profile name string validation ([pr#69734](https://github.com/ceph/ceph/pull/69734), Ashwin M. Joshi)

- python-common: multi-line for yaml ([pr#68034](https://github.com/ceph/ceph/pull/68034), Timothy Q Nguyen)

- qa,src: replace deprecated egrep/fgrep with grep -E/grep -F ([pr#68095](https://github.com/ceph/ceph/pull/68095), Lumir Sliva)

- qa/cephadm: add default container image name base ([pr#66847](https://github.com/ceph/ceph/pull/66847), Adam King)

- qa/cephadm: derive container image from cephadm release ([pr#68288](https://github.com/ceph/ceph/pull/68288), Lumir Sliva)

- qa/cephadm: ensure host has been fully saved before considering bootstrap complete ([pr#67419](https://github.com/ceph/ceph/pull/67419), Adam King)

- qa/cephadm: fix NFS ganesha startup failure in containers ([pr#68305](https://github.com/ceph/ceph/pull/68305), Redouane Kachach)

- qa/cephadm: fix test\_set\_mon\_crush\_locations test ([pr#67436](https://github.com/ceph/ceph/pull/67436), Adam King)

- qa/cephadm: ignore CEPHADM\_HOST\_TIMEOUT\_ERROR in timeout test ([pr#67428](https://github.com/ceph/ceph/pull/67428), Adam King)

- qa/cephadm: ignore transient CEPHADM\_FAILED\_DAEMON in smoke-singlehost ([pr#67622](https://github.com/ceph/ceph/pull/67622), Kefu Chai)

- qa/cephadm: pull compiled cephadm for squid branch ([pr#71943](https://github.com/ceph/ceph/pull/71943), Yonatan Zaken)

- qa/cephadm: query iSCSI gateway FQDN from inside the container ([pr#69214](https://github.com/ceph/ceph/pull/69214), Kefu Chai)

- qa/cephadm: start upgrade tests from tentacle instead of reef on main ([pr#68848](https://github.com/ceph/ceph/pull/68848), Adam King)

- qa/cephfs: don't return undefined variable ([pr#65805](https://github.com/ceph/ceph/pull/65805), Rishabh Dave)

- qa/cephfs: exclude ceph-osd-{classic,crimson} in fs:upgrade:featurefu… ([pr#68464](https://github.com/ceph/ceph/pull/68464), Venky Shankar)

- qa/cephfs: ignore `OSD\_DOWN/osds down` warning ([issue#71446](http://tracker.ceph.com/issues/71446), [pr#63517](https://github.com/ceph/ceph/pull/63517), Venky Shankar)

- qa/cephfs: increase clones for test\_for\_6\_ongoing\_clones ([pr#64731](https://github.com/ceph/ceph/pull/64731), Rishabh Dave)

- qa/cephfs: install ceph-mgr-modules-standard for cephfs tests ([pr#69118](https://github.com/ceph/ceph/pull/69118), Venky Shankar)

- qa/cephfs: lua to respect missing kernel in yaml ([pr#66092](https://github.com/ceph/ceph/pull/66092), Kyr Shatskyy)

- qa/cephfs: make test\_journal\_migration immune to stdout changes ([issue#75083](http://tracker.ceph.com/issues/75083), [pr#67710](https://github.com/ceph/ceph/pull/67710), Venky Shankar)

- qa/cephfs: replace deprecated assertEquals with assertEqual ([pr#63323](https://github.com/ceph/ceph/pull/63323), Emmanuel Ferdman)

- qa/cephfs: treat "implicit declaration of function" for blogbench workunit for newer gcc version ([issue#75380](http://tracker.ceph.com/issues/75380), [pr#67867](https://github.com/ceph/ceph/pull/67867), Venky Shankar)

- qa/clusters/crimson: increase reactors count ([pr#66333](https://github.com/ceph/ceph/pull/66333), Shraddha Agrawal)

- qa/clusters/crimson: increase reactors in fixed-1 cluster ([pr#66307](https://github.com/ceph/ceph/pull/66307), Shraddha Agrawal)

- qa/config,crontab: Adjust to Crimson flavor cleanup ([pr#66648](https://github.com/ceph/ceph/pull/66648), Matan Breizman)

- qa/crontab/teuthology-cronjobs: Use Crimson flavors ([pr#63557](https://github.com/ceph/ceph/pull/63557), Matan Breizman)

- qa/crontab: add tentacle nightlies ([pr#63046](https://github.com/ceph/ceph/pull/63046), Patrick Donnelly)

- qa/crontab: run Crimson tentacle nightly ([pr#63331](https://github.com/ceph/ceph/pull/63331), Matan Breizman)

- qa/crontab: update priority for tentacle upgrade command ([pr#63528](https://github.com/ceph/ceph/pull/63528), Laura Flores)

- qa/d4n: Fix redis scanning in workunit ([pr#65866](https://github.com/ceph/ceph/pull/65866), Samarah)

- qa/d4n: Remove suite until D4N is introduced as a feature ([pr#71470](https://github.com/ceph/ceph/pull/71470), Samarah Uriarte)

- qa/distros/crimson-supported-all-distro: reinstate centos ([pr#67936](https://github.com/ceph/ceph/pull/67936), Shraddha Agrawal)

- qa/distros/crimson-supported-all-distros: remove centos 9 ([pr#68755](https://github.com/ceph/ceph/pull/68755), Shraddha Agrawal)

- qa/distros: add centos 9 stream back to supported distros ([pr#67957](https://github.com/ceph/ceph/pull/67957), Casey Bodley)

- qa/distros: add rocky 10<span></span>.0 as supported distro/container host ([pr#66055](https://github.com/ceph/ceph/pull/66055), Adam King, David Galloway, Casey Bodley)

- qa/distros: add ubuntu 24<span></span>.04 as supported distro/container host ([pr#67683](https://github.com/ceph/ceph/pull/67683), Patrick Donnelly, Adam King, Casey Bodley)

- qa/distros: ask for Rocky by major, not a point release ([pr#71195](https://github.com/ceph/ceph/pull/71195), David Galloway)

- qa/dnsmasq: use managed dnsmasq instead of editing resolv<span></span>.conf ([pr#70005](https://github.com/ceph/ceph/pull/70005), Casey Bodley)

- qa/lsan<span></span>.supp: suppress CPython 3<span></span>.10 interpreter shutdown leaks ([pr#68615](https://github.com/ceph/ceph/pull/68615), Kefu Chai)

- qa/multisite: fix test\_bucket\_remove failure ([pr#68167](https://github.com/ceph/ceph/pull/68167), Shilpa Jagannath)

- qa/multisite: switch to boto3 ([pr#67011](https://github.com/ceph/ceph/pull/67011), Shilpa Jagannath)

- qa/nvme\_loop: connect directly through nvme-fabrics ([pr#72088](https://github.com/ceph/ceph/pull/72088), Redouane Kachach)

- qa/rados: Fix problem with recompression failing osd bench testing ([pr#63429](https://github.com/ceph/ceph/pull/63429), Adam Kupczyk)

- qa/radosgw\_admin: replace boto2 with boto3 ([pr#67095](https://github.com/ceph/ceph/pull/67095), Casey Bodley)

- qa/rbd/iscsi/cluster: ignore PG\_DEGRADED warning ([pr#67431](https://github.com/ceph/ceph/pull/67431), Adam King)

- qa/rbd/iscsi: ignore MON\_DOWN warning in logs ([pr#63407](https://github.com/ceph/ceph/pull/63407), Adam King)

- qa/rgw/multisite: remove boto2 BotoJSONEncoder ([pr#67486](https://github.com/ceph/ceph/pull/67486), Casey Bodley)

- qa/rgw/upgrade: exclude ceph-osd-classic/crimson on squid and tentacle ([pr#66341](https://github.com/ceph/ceph/pull/66341), Casey Bodley)

- qa/rgw/upgrade: symlinks are explicit about distro versions ([pr#68001](https://github.com/ceph/ceph/pull/68001), Casey Bodley)

- qa/rgw: add test\_account\_migration workunit ([pr#66594](https://github.com/ceph/ceph/pull/66594), Casey Bodley)

- qa/rgw: bucket notifications use pynose ([pr#67423](https://github.com/ceph/ceph/pull/67423), Casey Bodley)

- qa/rgw: bump maven version in hadoop task to resolve 404 Not Found ([pr#63793](https://github.com/ceph/ceph/pull/63793), Casey Bodley)

- qa/rgw: bump tempest version from 34<span></span>.1<span></span>.0 to 45<span></span>.0<span></span>.0 ([pr#69172](https://github.com/ceph/ceph/pull/69172), Casey Bodley)

- qa/rgw: crypt subsuite tests compress-encrypted ([pr#67958](https://github.com/ceph/ceph/pull/67958), Casey Bodley)

- qa/rgw: fix perl tests missing Amazon::S3 module ([pr#63760](https://github.com/ceph/ceph/pull/63760), Mark Kogan)

- qa/rgw: prepare for tentacle testing ([pr#63041](https://github.com/ceph/ceph/pull/63041), Casey Bodley)

- qa/rgw: remove hadoop-s3a subsuite ([pr#64568](https://github.com/ceph/ceph/pull/64568), Casey Bodley)

- qa/rgw: remove ragweed from multifs subsuite ([pr#69171](https://github.com/ceph/ceph/pull/69171), Casey Bodley)

- qa/rgw: remove ragweed from verify subsuite ([pr#68000](https://github.com/ceph/ceph/pull/68000), Casey Bodley)

- qa/rgw: Revive crypt kmip ([pr#68269](https://github.com/ceph/ceph/pull/68269), Kyr Shatskyy)

- qa/smoke/basic: add log-ignorelist entries for expected smoke test warnings ([pr#70052](https://github.com/ceph/ceph/pull/70052), Adarsha Dinda)

- qa/standalone/availability<span></span>.sh: retry after feature is turned on ([pr#67181](https://github.com/ceph/ceph/pull/67181), Shraddha Agrawal)

- qa/standalone/misc: make less noise for asok calculation ([pr#67096](https://github.com/ceph/ceph/pull/67096), Kyr Shatskyy)

- qa/standalone/scrub: extra delay in osd-scrub-test<span></span>.sh ([pr#63400](https://github.com/ceph/ceph/pull/63400), Ronen Friedman)

- qa/standalone/scrub: fix "scrubbed in 0ms" in osd-scrub-test<span></span>.sh ([pr#64429](https://github.com/ceph/ceph/pull/64429), Ronen Friedman)

- qa/standalone/scrub: fix expected outputs in repair tests ([pr#63010](https://github.com/ceph/ceph/pull/63010), Ronen Friedman)

- qa/standalone/scrub: re-code osd-scrub-dump<span></span>.sh to test scrub repair ([pr#65048](https://github.com/ceph/ceph/pull/65048), Ronen Friedman)

- qa/standalone: Add a test for running repeer on simple ec and rep pools ([pr#66575](https://github.com/ceph/ceph/pull/66575), Tom Sollers)

- qa/standalone: fix/improve bluefs tests ([pr#67275](https://github.com/ceph/ceph/pull/67275), Igor Fedotov)

- qa/standalone: improve reliability of osd-backfill tests ([pr#67295](https://github.com/ceph/ceph/pull/67295), Kamoltat (Junior) Sirivadhna)

- qa/suite/rados/encoder: update release N-2 for ceph-dencoder tests ([pr#66337](https://github.com/ceph/ceph/pull/66337), Nitzan Mordechai)

- qa/suites/crimson-rados/<span></span>.<span></span>./pggrow: increase op\_delay ([pr#68225](https://github.com/ceph/ceph/pull/68225), Matan Breizman)

- qa/suites/crimson-rados/rgw/sts/tasks/1-keycloak: dont install java-1… ([pr#68844](https://github.com/ceph/ceph/pull/68844), Matan Breizman)

- qa/suites/crimson-rados/singleton: add install task ([pr#64370](https://github.com/ceph/ceph/pull/64370), Matan Breizman)

- qa/suites/crimson-rados/thrash: enable seastore ([pr#66266](https://github.com/ceph/ceph/pull/66266), Matan Breizman)

- qa/suites/crimson-rados: Accommodate to new crimson flavors ([pr#63833](https://github.com/ceph/ceph/pull/63833), Matan Breizman)

- qa/suites/crimson-rados: Add pg splitting tests to crimson thrash tes… ([pr#65814](https://github.com/ceph/ceph/pull/65814), Aishwarya Mathuria)

- qa/suites/crimson-rados: disable chance\_trim\_stale\_osdmaps ([pr#63226](https://github.com/ceph/ceph/pull/63226), Matan Breizman)

- qa/suites/crimson-rados: enable cephadm tests ([pr#67726](https://github.com/ceph/ceph/pull/67726), Shraddha Agrawal)

- qa/suites/crimson-rados: Enable Seastore Thrash tests (w/ Recovery) ([pr#64715](https://github.com/ceph/ceph/pull/64715), Matan Breizman)

- qa/suites/crimson-rados: first version of cephfs/ ([pr#67268](https://github.com/ceph/ceph/pull/67268), Jose J Palacios-Perez)

- qa/suites/crimson-rados: run full librbd test suite ([pr#65240](https://github.com/ceph/ceph/pull/65240), Kautilya Tripathi)

- qa/suites/crimson-rados: Seastore recovery tests ([pr#63166](https://github.com/ceph/ceph/pull/63166), Matan Breizman)

- qa/suites/krbd: request msgr1 explicitly in unmap subsuite ([pr#64711](https://github.com/ceph/ceph/pull/64711), Ilya Dryomov)

- qa/suites/krbd: use a standard fixed-1 cluster in unmap subsuite ([pr#64712](https://github.com/ceph/ceph/pull/64712), Ilya Dryomov)

- qa/suites/nvmeof/upgrade: use refresh True for wait\_for\_service ([pr#70619](https://github.com/ceph/ceph/pull/70619), Vallari Agrawal)

- qa/suites/nvmeof: add upgrade sub-suite ([pr#59608](https://github.com/ceph/ceph/pull/59608), Vallari Agrawal)

- qa/suites/nvmeof: set beacon grace and connect panic ([pr#69135](https://github.com/ceph/ceph/pull/69135), Vallari Agrawal)

- qa/suites/orch/cephadm: ignore intentional OSD\_DOWN warning from test\_host\_drain task ([pr#64845](https://github.com/ceph/ceph/pull/64845), Laura Flores)

- qa/suites/rados/encoder: exclude ceph-osd-classic when installing LTS… ([pr#66372](https://github.com/ceph/ceph/pull/66372), Kefu Chai)

- qa/suites/rados/encoder: remove rocky from supported distros ([pr#68326](https://github.com/ceph/ceph/pull/68326), Laura Flores)

- qa/suites/rados/thrash-old-clients: Add OSD warnings to ignore list ([pr#64603](https://github.com/ceph/ceph/pull/64603), Naveen Naidu)

- qa/suites/rados/thrash-old-clients: ignore "Reduced data availability" warning ([pr#68473](https://github.com/ceph/ceph/pull/68473), Laura Flores)

- qa/suites/rados: temporarily disable ceph-post-file test ([pr#68366](https://github.com/ceph/ceph/pull/68366), Laura Flores)

- qa/suites/rbd/valgrind: don't hardcode os\_type in memcheck<span></span>.yaml ([pr#66191](https://github.com/ceph/ceph/pull/66191), Ilya Dryomov)

- qa/suites/rbd/valgrind: pin to centos\_9<span></span>.stream instead of rpm\_latest ([pr#70132](https://github.com/ceph/ceph/pull/70132), Ilya Dryomov)

- qa/suites/thrash-old-clients/1-install: exclude ceph-osd-classic ([pr#66268](https://github.com/ceph/ceph/pull/66268), Matan Breizman)

- qa/suites/upgrade: ignore fs down variant ([pr#70402](https://github.com/ceph/ceph/pull/70402), Patrick Donnelly)

- qa/suites/upgrade: ignore osd in unknown state ([pr#69055](https://github.com/ceph/ceph/pull/69055), Patrick Donnelly)

- qa/suites/upgrade: ignore PG\_DAMAGED ([pr#68365](https://github.com/ceph/ceph/pull/68365), Kamoltat (Junior) Sirivadhna)

- qa/suites/upgrade: ignore temporary OSD\_HOST\_DOWN health warning ([pr#68241](https://github.com/ceph/ceph/pull/68241), Laura Flores)

- qa/suites/upgrade: ignore undersized PG during stress splits ([pr#68897](https://github.com/ceph/ceph/pull/68897), Patrick Donnelly)

- qa/suites/upgrade: update ignorelist with cephfs specific warnings (under stress-split) ([issue#71615](http://tracker.ceph.com/issues/71615), [pr#64494](https://github.com/ceph/ceph/pull/64494), Venky Shankar)

- qa/suites/upgrade: update upgrade paths and exclude rocky10 from non-supported distros ([pr#67127](https://github.com/ceph/ceph/pull/67127), Laura Flores)

- qa/suites: Exclude ceph-osd-\* when installing LTS releases ([pr#67086](https://github.com/ceph/ceph/pull/67086), Matan Breizman)

- qa/suites: remove centos restriction from valgrind yaml ([issue#20360](http://tracker.ceph.com/issues/20360), [issue#18126](http://tracker.ceph.com/issues/18126), [pr#66193](https://github.com/ceph/ceph/pull/66193), Samuel Just)

- qa/suites: wait longer before stopping OSDs with valgrind ([pr#62823](https://github.com/ceph/ceph/pull/62823), Nitzan Mordechai)

- qa/tasks/admin\_socket<span></span>.py: replace git<span></span>.ceph<span></span>.com with GitHub raw URLs ([pr#68342](https://github.com/ceph/ceph/pull/68342), Matan Breizman)

- qa/tasks/backfill\_toofull<span></span>.py: Fix assert failures with & without compression ([pr#67829](https://github.com/ceph/ceph/pull/67829), Sridhar Seshasayee)

- qa/tasks/cbt: install pdsh from el9 RPMs on el10 systems ([pr#68424](https://github.com/ceph/ceph/pull/68424), Nitzan Mordechai)

- qa/tasks/cbt: select appropriate CBT branch based on Ceph version ([pr#72206](https://github.com/ceph/ceph/pull/72206), Mohan Thondapu)

- qa/tasks/cbt: stop hardcoding the pdsh version for el10 ([pr#71498](https://github.com/ceph/ceph/pull/71498), David Galloway)

- qa/tasks/ceph\_manager: population must be a sequence ([pr#62880](https://github.com/ceph/ceph/pull/62880), Kyr Shatskyy)

- qa/tasks/cephadm<span></span>.py: only pass --objectstore when not bluestore ([pr#68104](https://github.com/ceph/ceph/pull/68104), Shraddha Agrawal)

- qa/tasks/cephadm: add support for distro-suffix ([pr#66171](https://github.com/ceph/ceph/pull/66171), Samuel Just)

- qa/tasks/cephadm: allow to select from 'cephadm' and 'cephadm<span></span>.py' ([pr#64185](https://github.com/ceph/ceph/pull/64185), Kyr Shatskyy)

- qa/tasks/cephadm: override container image tags ([pr#64184](https://github.com/ceph/ceph/pull/64184), Kyr Shatskyy)

- qa/tasks/cephfs: raise exception if incorrect fstype found ([pr#64709](https://github.com/ceph/ceph/pull/64709), Dhairya Parmar)

- qa/tasks/daemonwatchdog: fix unbound variable in bark\_reason message ([pr#67353](https://github.com/ceph/ceph/pull/67353), Ilya Dryomov)

- qa/tasks/dnsmasq: set no-resolv on the systemd-resolved path ([pr#70577](https://github.com/ceph/ceph/pull/70577), Oguzhan Ozmen)

- qa/tasks/keycloak: drop unused local variable ([pr#67626](https://github.com/ceph/ceph/pull/67626), Kefu Chai)

- qa/tasks/keystone: restart mariadb for rocky and alma linux too ([pr#67123](https://github.com/ceph/ceph/pull/67123), Kyr Shatskyy)

- qa/tasks/keystone: upgrade keystone to 2025<span></span>.2 ([pr#67660](https://github.com/ceph/ceph/pull/67660), Kyr Shatskyy)

- qa/tasks/mgr: test\_module\_selftest set influx hostname to avoid warnings ([pr#66376](https://github.com/ceph/ceph/pull/66376), Nitzan Mordechai)

- qa/tasks/mgr: test\_module\_selftest set influx hostname to avoid warni… ([pr#67649](https://github.com/ceph/ceph/pull/67649), Nitzan Mordechai)

- qa/tasks/nvme\_loop: fall back to sysfs-based discovery if needed ([pr#72086](https://github.com/ceph/ceph/pull/72086), Redouane Kachach)

- qa/tasks/qemu: rocky 10 enablement ([pr#67142](https://github.com/ceph/ceph/pull/67142), Ilya Dryomov)

- qa/tasks/quiescer: remove racy assertion ([pr#67555](https://github.com/ceph/ceph/pull/67555), Patrick Donnelly)

- qa/tasks/rbd\_mirror\_thrash: don't use random<span></span>.randrange() on floats ([pr#67144](https://github.com/ceph/ceph/pull/67144), Ilya Dryomov)

- qa/tasks/thrashosds-health: fine tune ignorelist for degraded and undersized pgs ([pr#64844](https://github.com/ceph/ceph/pull/64844), Laura Flores)

- qa/tasks/workunit: fix no module named 'pipes' ([pr#65891](https://github.com/ceph/ceph/pull/65891), Kyr Shatskyy)

- qa/tasks/workunit: skip keyring merge if ceph-authtool is absent ([pr#72435](https://github.com/ceph/ceph/pull/72435), Avan Thakkar)

- qa/tasks: Add a task which performs an offline check of the consistency of parity shards ([pr#59903](https://github.com/ceph/ceph/pull/59903), Connor Fawcett)

- qa/tasks: capture CommandCrashedError when running nvme list cmd ([pr#69163](https://github.com/ceph/ceph/pull/69163), Redouane Kachach)

- qa/tasks: fix import error ([pr#67201](https://github.com/ceph/ceph/pull/67201), Nizamudeen A)

- qa/tasks: fix SyntaxWarning for invalid escape sequences in vstart\_ru… ([pr#66694](https://github.com/ceph/ceph/pull/66694), Kefu Chai)

- qa/tasks: generalize stuck pg ignorelist entry ([pr#62112](https://github.com/ceph/ceph/pull/62112), Laura Flores)

- qa/tasks: Ignore expected `backfill\_toofull` warning ([pr#64377](https://github.com/ceph/ceph/pull/64377), Laura Flores)

- qa/tasks: make rbd\_mirror\_thrash inherit from ThrasherGreenlet ([pr#67590](https://github.com/ceph/ceph/pull/67590), Ilya Dryomov)

- qa/tasks: make the cephadm and vstart\_runner tasks aware of watchdog ([pr#66137](https://github.com/ceph/ceph/pull/66137), Laura Flores)

- qa/tasks: move smb related task funcs out of cephadm<span></span>.py to smb<span></span>.py ([pr#65757](https://github.com/ceph/ceph/pull/65757), John Mulligan)

- qa/tasks: update egrep to 'grep -E' ([pr#66155](https://github.com/ceph/ceph/pull/66155), Nitzan Mordechai, Samuel Just)

- qa/test\_mirroring: Fix flake8 errors ([pr#67370](https://github.com/ceph/ceph/pull/67370), Kotresh HR)

- qa/tests: added "tentacle" option ([pr#63112](https://github.com/ceph/ceph/pull/63112), Yuri Weinstein)

- qa/tests: fix POOL\_FULL ignorelist pattern in upgrade tests ([pr#70507](https://github.com/ceph/ceph/pull/70507), Yuri Weinstein)

- qa/tests: skip rgw site tests in api ([pr#63126](https://github.com/ceph/ceph/pull/63126), Nizamudeen A)

- qa/tests: skipping test\_cephfs\_clients\_get\_after\_mds\_down in test\_cephfs ([pr#63231](https://github.com/ceph/ceph/pull/63231), Nizamudeen A)

- qa/tests: wait for module to be available for connection ([pr#67177](https://github.com/ceph/ceph/pull/67177), Nizamudeen A)

- qa/valgrind<span></span>.supp: make gcm\_cipher\_internal suppression more resilient ([pr#67138](https://github.com/ceph/ceph/pull/67138), Ilya Dryomov)

- qa/valgrind: generalize suppressions for gcc-14 MismatchedFree ([pr#68289](https://github.com/ceph/ceph/pull/68289), Casey Bodley)

- qa/vstart\_runner: Add get\_file and write\_file equivalents to the LocalRemoteProcess class ([pr#60833](https://github.com/ceph/ceph/pull/60833), Connor Fawcett)

- qa/workunits/ceph-helpers-root: Add Rocky support for install packages ([pr#67102](https://github.com/ceph/ceph/pull/67102), Nitzan Mordechai)

- qa/workunits/nvmeof/basic\_tests: use nvme-cli 2<span></span>.13 ([pr#67203](https://github.com/ceph/ceph/pull/67203), Vallari Agrawal)

- qa/workunits/rados/test<span></span>.sh: add timeout mechanism and more info to workloads with parallel tests ([pr#64219](https://github.com/ceph/ceph/pull/64219), Kamoltat Sirivadhna, Laura Flores)

- qa/workunits/rados: fetch files via GitHub instead of git<span></span>.ceph<span></span>.com ([pr#69180](https://github.com/ceph/ceph/pull/69180), Laura Flores)

- qa/workunits/rados: remove cache tier test ([pr#64504](https://github.com/ceph/ceph/pull/64504), Nitzan Mordechai)

- qa/workunits/rbd: adapt rbd\_mirror<span></span>.sh for trial nodes ([pr#67108](https://github.com/ceph/ceph/pull/67108), Ilya Dryomov)

- qa/workunits/rbd: drop racy assert in test\_tasks\_recovery() ([pr#67896](https://github.com/ceph/ceph/pull/67896), Ilya Dryomov)

- qa/workunits/rbd: reduce randomized sleeps in live import tests ([pr#67139](https://github.com/ceph/ceph/pull/67139), Ilya Dryomov)

- qa/workunits/rbd: remove build dependency on ceph-mds and dashboard ([pr#64263](https://github.com/ceph/ceph/pull/64263), Miki Patel)

- qa/workunits/rbd: use the same qemu-iotests version throughout ([pr#67143](https://github.com/ceph/ceph/pull/67143), Ilya Dryomov)

- qa/workunits/rgw: drop netstat usage ([pr#66370](https://github.com/ceph/ceph/pull/66370), Kyr Shatskyy)

- qa/workunits/smb: work around test failures by pinning smbprotocol version ([pr#70828](https://github.com/ceph/ceph/pull/70828), John Mulligan)

- qa/workunits: add crimson/test\_crimson\_dump\_metrics<span></span>.sh ([pr#67723](https://github.com/ceph/ceph/pull/67723), Jose J Palacios-Perez)

- qa/workunits: add Rocky Linux support to librados tests ([pr#66232](https://github.com/ceph/ceph/pull/66232), Nitzan Mordechai)

- qa/workunits: Add updated kernel archive URL ([pr#68013](https://github.com/ceph/ceph/pull/68013), Brad Hubbard)

- qa/workunits: skip unpublished stable repos in test\_repos<span></span>.sh ([issue#77248](http://tracker.ceph.com/issues/77248), [pr#70199](https://github.com/ceph/ceph/pull/70199), Yael Azulay)

- qa/{asan,lsan}<span></span>.supp: suppress Python module and libstdc++ false positives ([pr#65408](https://github.com/ceph/ceph/pull/65408), Kefu Chai)

- qa: Add "osds down" in log-ignorelist to avoid the test case failure during upgrade ([pr#63239](https://github.com/ceph/ceph/pull/63239), Radoslaw Zarzynski, Mohit Agrawal)

- qa: add 'refresh' config to cephadm<span></span>.wait\_for\_service ([pr#65941](https://github.com/ceph/ceph/pull/65941), Vallari Agrawal)

- qa: Add a config setting to the teuthology erasure code tests so that we can test with EC optimizations on and/or off ([pr#64553](https://github.com/ceph/ceph/pull/64553), Jamie Pryde)

- qa: Add cauchy and 16K chunk size profiles to rados erasure code teuthology suites ([pr#64554](https://github.com/ceph/ceph/pull/64554), Jamie Pryde)

- qa: Add cephadm-signed mtls test in nvmeof/mtls\_test<span></span>.sh ([pr#70612](https://github.com/ceph/ceph/pull/70612), Vallari Agrawal)

- qa: add MDS\_INSUFFICIENT\_STANDBY to ignorelist ([pr#68893](https://github.com/ceph/ceph/pull/68893), Patrick Donnelly)

- qa: Add new task module template<span></span>.py ([pr#65721](https://github.com/ceph/ceph/pull/65721), John Mulligan)

- qa: Add nvmeof upgrade from v20<span></span>.2<span></span>.0 and tentacle ([pr#67742](https://github.com/ceph/ceph/pull/67742), Vallari Agrawal)

- qa: Add retry logic to remove most sleeps in mirroring tests ([pr#67305](https://github.com/ceph/ceph/pull/67305), Kotresh HR)

- qa: Add rgw sts suites to crimson-rados ([pr#67358](https://github.com/ceph/ceph/pull/67358), Kautilya Tripathi)

- qa: Add Teuthology test for BlueStore ESB assertion failure ([pr#62913](https://github.com/ceph/ceph/pull/62913), Jaya Prakash)

- qa: Add Teuthology tests for BlueStore faster allocation recovery ([pr#68984](https://github.com/ceph/ceph/pull/68984), Jaya Prakash)

- qa: Adding a new class so the DaemonWatchdog can moitor remote IO exercisers and other processes ([pr#64889](https://github.com/ceph/ceph/pull/64889), Bill Scales, Chris Harris)

- qa: allow multiple mgr sessions during eviction test ([pr#67556](https://github.com/ceph/ceph/pull/67556), Patrick Donnelly)

- qa: cephfs suite changes for rocky ([pr#66294](https://github.com/ceph/ceph/pull/66294), Patrick Donnelly)

- qa: clean up and simplify client 2 caps ([pr#67125](https://github.com/ceph/ceph/pull/67125), Patrick Donnelly)

- qa: cleanup distros ([pr#67961](https://github.com/ceph/ceph/pull/67961), Patrick Donnelly)

- qa: Disable OSD benchmark from running for tests ([pr#67058](https://github.com/ceph/ceph/pull/67058), Sridhar Seshasayee)

- qa: don't assume that /dev/sda or /dev/vda is present in unmap<span></span>.t ([pr#67063](https://github.com/ceph/ceph/pull/67063), Ilya Dryomov)

- qa: drop creating huge files in test\_cephfs\_mirror\_cancel\_sync ([pr#65950](https://github.com/ceph/ceph/pull/65950), Jos Collin)

- qa: enable libcephfs debug logs for fio workload with nfs ([pr#61547](https://github.com/ceph/ceph/pull/61547), Dhairya Parmar)

- qa: exclude crimson from random-objectstore ([pr#66485](https://github.com/ceph/ceph/pull/66485), Shraddha Agrawal)

- qa: Exclude missing ceph-osd-classic and ceph-osd-crimson from tentacle installs ([pr#68110](https://github.com/ceph/ceph/pull/68110), Alex Ainscow)

- qa: Extend Kafka SASL Security Tests ([pr#67158](https://github.com/ceph/ceph/pull/67158), sujay-d07)

- qa: Fix coredumps caused by udisks ([pr#67348](https://github.com/ceph/ceph/pull/67348), Vallari Agrawal)

- qa: fix mds\_upgrade\_sequence cephadm bootstrap failure (roleless + mon roles) ([pr#71497](https://github.com/ceph/ceph/pull/71497), David Galloway)

- qa: fix misleading "in cluster log" failures during cluster log scan ([pr#68392](https://github.com/ceph/ceph/pull/68392), Redouane Kachach)

- qa: fix multi-fs tests in test\_mds\_metrics<span></span>.py ([pr#62842](https://github.com/ceph/ceph/pull/62842), Jos Collin)

- qa: Fix nvmeof 'errors during thrashing' ([pr#67804](https://github.com/ceph/ceph/pull/67804), Vallari Agrawal)

- qa: fix nvmeof upgrade from v20<span></span>.2<span></span>.0 ([pr#68266](https://github.com/ceph/ceph/pull/68266), Vallari Agrawal)

- qa: Fix pg autoscaler tests ([pr#69176](https://github.com/ceph/ceph/pull/69176), Eric Zhang)

- qa: fix setting rbd\_sparse\_read\_threshold\_bytes in test\_migration\_clone() ([pr#68454](https://github.com/ceph/ceph/pull/68454), Ilya Dryomov)

- qa: Fix test\_cephfs\_mirror\_restart\_sync\_on\_blocklist ([pr#67385](https://github.com/ceph/ceph/pull/67385), Kotresh HR)

- qa: fix test\_cephfs\_mirror\_stats failure ([pr#63131](https://github.com/ceph/ceph/pull/63131), Jos Collin)

- qa: fixing cephadm mgmt-gateway test to remove openssl dependency ([pr#67695](https://github.com/ceph/ceph/pull/67695), Redouane Kachach)

- qa: fixing failures in TestShellOpts ([pr#70187](https://github.com/ceph/ceph/pull/70187), Neeraj Pratap Singh)

- qa: fixing nvmeof orch smoke test ([pr#68281](https://github.com/ceph/ceph/pull/68281), Redouane Kachach)

- qa: fixing target release for MDS upgrade to be umbrella ([pr#68285](https://github.com/ceph/ceph/pull/68285), Redouane Kachach)

- qa: fixing the qa test in mon/misc<span></span>.sh after adding beacon-diff feature ([pr#67307](https://github.com/ceph/ceph/pull/67307), Leonid Chernin)

- qa: get\_rand\_pg\_acting\_set needs to wait for pool to create PGs ([pr#64016](https://github.com/ceph/ceph/pull/64016), Bill Scales)

- qa: Handle TypeError in test\_filelock ([pr#68389](https://github.com/ceph/ceph/pull/68389), Karthik U S)

- qa: ignore cephadm failed daemon warnings during thrashing ([pr#68896](https://github.com/ceph/ceph/pull/68896), Patrick Donnelly)

- qa: ignore cluster warning (evicting unresponsive <span></span>.<span></span>.<span></span>.) with tasks/mgr-osd-full ([issue#73278](http://tracker.ceph.com/issues/73278), [pr#65693](https://github.com/ceph/ceph/pull/65693), Venky Shankar)

- qa: ignore evicted client warnings for singletone bluestore ([pr#68837](https://github.com/ceph/ceph/pull/68837), Nitzan Mordechai)

- qa: ignore expected MON\_DOWN ([pr#68360](https://github.com/ceph/ceph/pull/68360), Patrick Donnelly)

- qa: ignore pg stuck peering ([pr#68907](https://github.com/ceph/ceph/pull/68907), Patrick Donnelly)

- qa: ignore POOL\_FULL for rbd tests exercising full pools ([pr#68899](https://github.com/ceph/ceph/pull/68899), Patrick Donnelly)

- qa: Improve scalability test ([pr#64292](https://github.com/ceph/ceph/pull/64292), Vallari Agrawal)

- qa: increase the randomness to trigger the directory import/export ([pr#64549](https://github.com/ceph/ceph/pull/64549), Jos Collin)

- qa: increase the wait time to prevent check\_counter failing ([pr#64305](https://github.com/ceph/ceph/pull/64305), Jos Collin)

- qa: install nvme-cli only if distro remains rocky10 ([pr#69222](https://github.com/ceph/ceph/pull/69222), Patrick Donnelly)

- qa: krbd\_blkroset<span></span>.t: eliminate a race in the open\_count test ([pr#67048](https://github.com/ceph/ceph/pull/67048), Ilya Dryomov)

- qa: krbd\_rxbounce<span></span>.sh: do more reads to generate more errors ([pr#67351](https://github.com/ceph/ceph/pull/67351), Ilya Dryomov)

- qa: Leak\_StillReachable RocksDB error\_handler ([pr#67733](https://github.com/ceph/ceph/pull/67733), Nitzan Mordechai)

- qa: make test\_progress atomically capture OSD marked in/out events ([pr#67659](https://github.com/ceph/ceph/pull/67659), Kamoltat (Junior) Sirivadhna)

- qa: Port rgw lifecycle test to crimson-rados ([pr#68407](https://github.com/ceph/ceph/pull/68407), Kautilya Tripathi)

- qa: Port rgw multifs test to crimson-rados ([pr#67372](https://github.com/ceph/ceph/pull/67372), Kautilya Tripathi)

- qa: rbd\_mirror\_fsx\_compare<span></span>.sh doesn't error out as expected ([pr#67629](https://github.com/ceph/ceph/pull/67629), Ilya Dryomov)

- qa: reduce nvmeof thrasher fio to 32 devices from 200 ([pr#63291](https://github.com/ceph/ceph/pull/63291), Vallari Agrawal)

- qa: Remove cephadm e2e tests from teuthology ([pr#66254](https://github.com/ceph/ceph/pull/66254), Afreen Misbah)

- qa: remove long retired ceph-deploy ([pr#67682](https://github.com/ceph/ceph/pull/67682), Patrick Donnelly)

- qa: remove unused qa\_scripts ([pr#67823](https://github.com/ceph/ceph/pull/67823), Patrick Donnelly)

- qa: resolve py3<span></span>.12 regression for random<span></span>.sample ([pr#67557](https://github.com/ceph/ceph/pull/67557), Patrick Donnelly)

- qa: Run fewer RGW jobs at higher priority every week ([pr#65498](https://github.com/ceph/ceph/pull/65498), Adam C. Emerson)

- qa: Run test\_admin with the squid client ([pr#64005](https://github.com/ceph/ceph/pull/64005), Kotresh HR)

- qa: setup mount\_b in test\_mirroring<span></span>.py ([pr#62949](https://github.com/ceph/ceph/pull/62949), Jos Collin)

- qa: Skip error inject tests when external error inject is happening ([pr#70848](https://github.com/ceph/ceph/pull/70848), Matty Williams)

- qa: suppress false positive delete map mismatch errors ([pr#67230](https://github.com/ceph/ceph/pull/67230), Nitzan Mordechai)

- qa: suppress MismatchedFree operator delete RocksDB ([pr#66651](https://github.com/ceph/ceph/pull/66651), Nitzan Mordechai)

- qa: suppress OpenSSL valgrind leaks ([pr#65634](https://github.com/ceph/ceph/pull/65634), Laura Flores)

- qa: suppress reachable dlopen leak in libceph-common ([pr#68218](https://github.com/ceph/ceph/pull/68218), Nitzan Mordechai)

- qa: temporarily disable some mirroring test (see: https://tracker<span></span>.ceph<span></span>.com/issues/74984) ([pr#67477](https://github.com/ceph/ceph/pull/67477), Venky Shankar)

- qa: test\_pool\_min\_size should kill osds first then mark them down ([pr#65074](https://github.com/ceph/ceph/pull/65074), Bill Scales)

- qa: undo supported-random-distros mishap ([pr#68168](https://github.com/ceph/ceph/pull/68168), Patrick Donnelly)

- qa: update ignorelists for expected cluster log warnings ([pr#66393](https://github.com/ceph/ceph/pull/66393), Laura Flores)

- qa: update yaml file for TestCorruptedSubvolumes ([pr#68351](https://github.com/ceph/ceph/pull/68351), Jos Collin)

- qa: Use a more pythonic way to install CBT python requirements ([pr#66188](https://github.com/ceph/ceph/pull/66188), Chris Harris)

- qa: wipe disks in case of raw option is provided ([pr#67953](https://github.com/ceph/ceph/pull/67953), Redouane Kachach)

- qs/standalone/scrub: modify osd-scrub-snaps<span></span>.sh to match ceph-objectstore-tool changes ([pr#66303](https://github.com/ceph/ceph/pull/66303), Ronen Friedman)

- rados/lttng: add lttng open \*tp<span></span>.so error message ([pr#65181](https://github.com/ceph/ceph/pull/65181), lizhipeng)

- rados/osd: enable compact\_running perfcounter at PRIO=5 ([pr#65995](https://github.com/ceph/ceph/pull/65995), Paul Cuzner)

- rados: Add API to disable version querying with reads in librados ([pr#66162](https://github.com/ceph/ceph/pull/66162), Alex Ainscow)

- radosgw-admin: 'account rm --purge-data' deletes oidc by account id ([pr#71532](https://github.com/ceph/ceph/pull/71532), Casey Bodley)

- radosgw-admin: fix output of sync status ([pr#68567](https://github.com/ceph/ceph/pull/68567), Alexander Hussein-Kershaw)

- radosgw-admin: output bucket sync checkpoint to stdout ([issue#72088](http://tracker.ceph.com/issues/72088), [pr#68097](https://github.com/ceph/ceph/pull/68097), cheese-cakee)

- radosgw-admin: Pass max\_entries for bucket list ([pr#64683](https://github.com/ceph/ceph/pull/64683), Tobias Urdin)

- rbd-mirror: add cluster fsid to remote meta cache key ([pr#65773](https://github.com/ceph/ceph/pull/65773), Mykola Golub)

- rbd-mirror: allow incomplete demote snapshot to sync after rbd-mirror daemon restart ([pr#65953](https://github.com/ceph/ceph/pull/65953), VinayBhaskar-V)

- rbd-mirror: fix strict weak ordering in PeerSpec::operator< ([pr#70590](https://github.com/ceph/ceph/pull/70590), Sun Yuechi)

- rbd-mirror: prevent image deletion if remote image is not primary ([pr#63270](https://github.com/ceph/ceph/pull/63270), VinayBhaskar-V)

- rbd-mirror: prune obsolete primary mirror snapshots after relocation ([pr#69765](https://github.com/ceph/ceph/pull/69765), Miki Patel, Prasanna Kumar Kalever)

- rbd-mirror: return after finishing on unsupported mirror mode ([pr#70592](https://github.com/ceph/ceph/pull/70592), Sun Yuechi)

- rbd-mirror: take MirrorStatusUpdater lock by value in queue\_update\_task ([pr#70591](https://github.com/ceph/ceph/pull/70591), Sun Yuechi)

- rbd: add --estimated-size option for import from stdin ([pr#61535](https://github.com/ceph/ceph/pull/61535), Kirill Nazarov, Ilya Dryomov)

- rbd: fix unused function warning when WITH\_KRBD is disabled ([pr#64137](https://github.com/ceph/ceph/pull/64137), Kefu Chai)

- rbd: improve mirror image status and validation error messages ([pr#68015](https://github.com/ceph/ceph/pull/68015), Prasanna Kumar Kalever)

- rbd\_support: make schedule phase offset calculation FIPS compliant ([pr#71167](https://github.com/ceph/ceph/pull/71167), Ramana Raja)

- README: add Build Types section ([pr#63378](https://github.com/ceph/ceph/pull/63378), Matan Breizman)

- Reapply "qa/rgw/crypt: disable failing kmip testing" ([pr#69718](https://github.com/ceph/ceph/pull/69718), Casey Bodley, Adam C. Emerson)

- Redmine transform status ([pr#64821](https://github.com/ceph/ceph/pull/64821), Patrick Donnelly)

- Relax scrub of shard sizes for upgraded EC pools ([pr#65872](https://github.com/ceph/ceph/pull/65872), Alex Ainscow)

- Remove git clean -fdx ([pr#65222](https://github.com/ceph/ceph/pull/65222), Dan Mick)

- remove github workflows ([pr#70718](https://github.com/ceph/ceph/pull/70718), Patrick Donnelly)

- Remove map collection dec ([pr#63038](https://github.com/ceph/ceph/pull/63038), Tomer Haskalovitch)

- Replace capacity threshold data with prometheus metrics ([pr#64945](https://github.com/ceph/ceph/pull/64945), Afreen Misbah)

- Revert "common/options: fix heap-use-after-free by using never-destro… ([pr#67020](https://github.com/ceph/ceph/pull/67020), Matan Breizman)

- Revert "crimson/os/seastore/cache: TRIM\_DIRTY/CLEANER\\_\* transactions won't invalidate other transactions anymore" ([pr#67261](https://github.com/ceph/ceph/pull/67261), Aishwarya Mathuria, Matan Breizman)

- Revert "mds: enable osdc op throttles" ([pr#72186](https://github.com/ceph/ceph/pull/72186), Edwin Rodriguez)

- Revert "Merge PR #67630 into main" ([pr#67780](https://github.com/ceph/ceph/pull/67780), Patrick Donnelly)

- Revert "Merge pull request #64111 from zdover23/wip-doc-2025-06-23-tr71796-rados-ops-balancer" ([pr#64153](https://github.com/ceph/ceph/pull/64153), Patrick Donnelly)

- Revert "Merge pull request #65940 from Tom-Sollers/fixing\_blaum\_roth\_for\_ec\_profiles" ([pr#66114](https://github.com/ceph/ceph/pull/66114), Patrick Donnelly)

- Revert "Merge pull request #67167 from Hezko/nvme-module-two" ([pr#67608](https://github.com/ceph/ceph/pull/67608), Patrick Donnelly)

- Revert "mgr/cephadm: align nodeid and add register\_service for NFS Ganesha service visibility" ([pr#69042](https://github.com/ceph/ceph/pull/69042), Shubha Jain)

- Revert "mgr/dashboard: Fix stylus issue" ([pr#64661](https://github.com/ceph/ceph/pull/64661), Afreen Misbah)

- Revert "mgr/volumes: handle bad arguments during subvolume create" ([pr#63281](https://github.com/ceph/ceph/pull/63281), Venky Shankar)

- Revert "qa/cephadm: add default container image name base" ([pr#67054](https://github.com/ceph/ceph/pull/67054), David Galloway)

- Revert "qa/rgw: the rgw/verify suite runs java tests last" ([pr#67678](https://github.com/ceph/ceph/pull/67678), Casey Bodley)

- Revert "Reapply "qa/rgw/crypt: disable failing kmip testing"" ([pr#70092](https://github.com/ceph/ceph/pull/70092), Casey Bodley)

- Revert "Use GANESHA\_REPO\_BASEURL for NFS-Ganesha on all distros" ([pr#68985](https://github.com/ceph/ceph/pull/68985), David Galloway)

- Revert common/version: strip trailing newline from vendor release file ([pr#68479](https://github.com/ceph/ceph/pull/68479), Naveen Naidu)

- Revert: "only msgr commits in msg/async/ProtocolV2: Speed up connection logic when peer restarts & Added Netsplit Grace Period" ([pr#71957](https://github.com/ceph/ceph/pull/71957), Kamoltat (Junior) Sirivadhna)

- Revert: mgr/dashboard: reverting the nx tool changes ([pr#68951](https://github.com/ceph/ceph/pull/68951), Afreen Misbah)

- RGW - Fix dedup build ([pr#65643](https://github.com/ceph/ceph/pull/65643), Daniel Gryniewicz)

- RGW - Posix Test - initialize "existed" bools ([pr#65748](https://github.com/ceph/ceph/pull/65748), Daniel Gryniewicz)

- RGW - POSIXDriver - Cleanup vstart ([pr#65586](https://github.com/ceph/ceph/pull/65586), Daniel Gryniewicz)

- RGW - Standalone - Enable building without librados ([pr#65374](https://github.com/ceph/ceph/pull/65374), Daniel Gryniewicz)

- RGW - zipper - Remove target from get\_obj\_attrs() ([pr#62787](https://github.com/ceph/ceph/pull/62787), Daniel Gryniewicz)

- RGW SSE-KMS secrets cache ([pr#61256](https://github.com/ceph/ceph/pull/61256), Marcel Lauhoff, Casey Bodley)

- RGW | fix conditional Delete, MultiDelete and Put ([pr#63348](https://github.com/ceph/ceph/pull/63348), Ali Masarwa)

- RGW | fix conditional MultiWrite ([pr#64830](https://github.com/ceph/ceph/pull/64830), Ali Masarwa)

- RGW | fixed enqueueing the overwritten object for gc ([pr#64997](https://github.com/ceph/ceph/pull/64997), Ali Masarwa)

- rgw, common: OpenSSL provider support ([pr#64253](https://github.com/ceph/ceph/pull/64253), cailianchun)

- rgw-admin: report correct error code for non-existent bucket on deletion ([pr#63081](https://github.com/ceph/ceph/pull/63081), Seena Fallah)

- rgw-nfs: run quota threads by default ([pr#67473](https://github.com/ceph/ceph/pull/67473), Matt Benjamin)

- rgw/account: bucket acls are not completely migrated once the user is migrated to an account ([pr#65370](https://github.com/ceph/ceph/pull/65370), kchheda3)

- rgw/account: Support backward compatibility for s3:PutAcls calls for users migrated to account ([pr#66170](https://github.com/ceph/ceph/pull/66170), Krunal Chheda, kchheda3, Casey Bodley)

- rgw/admin: add --yes-i-really-mean-it gate to bilog trim admin command ([pr#72403](https://github.com/ceph/ceph/pull/72403), Oguzhan Ozmen)

- rgw/admin: Add max-entries and marker to bucket list ([pr#62777](https://github.com/ceph/ceph/pull/62777), Tobias Urdin)

- rgw/admin: allow listing account's root users ([pr#65366](https://github.com/ceph/ceph/pull/65366), Casey Bodley)

- rgw/admin: enhance bucket list --marker to support versioned bucket pagination ([pr#68163](https://github.com/ceph/ceph/pull/68163), Oguzhan Ozmen)

- rgw/admin: Fix assert on datalog list of invalid shard ([pr#62770](https://github.com/ceph/ceph/pull/62770), Adam C. Emerson)

- rgw/admin: fix infinite loop in role list pagination ([pr#71312](https://github.com/ceph/ceph/pull/71312), Ashish Singh)

- rgw/admin: guard bilog autotrim on non-exporting (archive) zones ([pr#70455](https://github.com/ceph/ceph/pull/70455), Oguzhan Ozmen)

- rgw/adminops: support for adding restore operation ([pr#66249](https://github.com/ceph/ceph/pull/66249), Jiffin Tony Thottan)

- rgw/auth: Fixed Content-Type always needing to be in the signature and don't require x-amz-content-sha256 in signed headers ([pr#71363](https://github.com/ceph/ceph/pull/71363), Casey Bodley, Adam C. Emerson, Elliot Courant)

- rgw/auth: Remove legacy Keystone admin token ([pr#62201](https://github.com/ceph/ceph/pull/62201), Tobias Urdin)

- rgw/beast: add frontend option 'tls\_groups' ([pr#67856](https://github.com/ceph/ceph/pull/67856), Casey Bodley)

- rgw/beast: add ssl\_ciphersuites option for tls 1<span></span>.3 ([pr#68934](https://github.com/ceph/ceph/pull/68934), Casey Bodley)

- rgw/beast: disable keepalive for responses before 100 Continue ([pr#65864](https://github.com/ceph/ceph/pull/65864), Casey Bodley)

- rgw/beast: use strand executor for timeout timer to prevent concurrent socket access ([pr#67424](https://github.com/ceph/ceph/pull/67424), Oguzhan Ozmen)

- rgw/bucket-logging: fix typos ([pr#65649](https://github.com/ceph/ceph/pull/65649), N Balachandran)

- rgw/bucket-logging: handle SigV2 presigned URLs ([pr#68540](https://github.com/ceph/ceph/pull/68540), Nithya Balachandran)

- rgw/bucket-logging: minor code cleanup ([pr#65559](https://github.com/ceph/ceph/pull/65559), N Balachandran)

- rgw/bucket-logging: support EC pools ([pr#65900](https://github.com/ceph/ceph/pull/65900), Nithya Balachandran)

- rgw/cloud-restore [PART2] : Add Restore support from Glacier/Tape cloud endpoints ([pr#62713](https://github.com/ceph/ceph/pull/62713), Soumya Koduri)

- rgw/cloud-restore: admin CLI for restore list and status ([pr#62830](https://github.com/ceph/ceph/pull/62830), Jiffin Tony Thottan)

- rgw/cloud-restore: allow copy of temporary object ([pr#63034](https://github.com/ceph/ceph/pull/63034), Jiffin Tony Thottan)

- rgw/cloud-restore: Fix the restore workers' shutdown order ([pr#68452](https://github.com/ceph/ceph/pull/68452), Soumya Koduri)

- rgw/cloud-restore: Restoring to non-existent storage-class should fail ([pr#67601](https://github.com/ceph/ceph/pull/67601), Soumya Koduri)

- rgw/cloud-restore: strip quotes from ETag on cloud tier fetch ([pr#67560](https://github.com/ceph/ceph/pull/67560), Matthew N. Heler)

- rgw/cloud-transition: add per-bucket target options ([pr#66373](https://github.com/ceph/ceph/pull/66373), Matthew N. Heler)

- rgw/cloud-transition: Include LocationConstraint while transitioning data to AWS non-default regions ([pr#66038](https://github.com/ceph/ceph/pull/66038), Soumya Koduri)

- rgw/cloud-transition: url-encode rgwx-source-key metadata header ([pr#68784](https://github.com/ceph/ceph/pull/68784), Matthew N. Heler)

- rgw/cls: fix usage log issues caused by incorrect form of name-by-user keys ([pr#65329](https://github.com/ceph/ceph/pull/65329), Matthew N Heler)

- rgw/configstore:  don't reinitialize the rados client in RadosRealmWatcher ([pr#67287](https://github.com/ceph/ceph/pull/67287), Nithya Balachandran)

- rgw/create-bucket: Do not re-create the bucket instance & bucket index shard object if if bucket already exist ([pr#65415](https://github.com/ceph/ceph/pull/65415), kchheda3)

- rgw/d3n: fix teuthology run-datacache<span></span>.sh FAIL when stripe\_size!=4MiB ([pr#63381](https://github.com/ceph/ceph/pull/63381), Mark Kogan)

- rgw/d3n: fix valgrind invalid read during exit ([pr#63352](https://github.com/ceph/ceph/pull/63352), Mark Kogan)

- rgw/d3n: store cached objects using hash digest ([pr#62516](https://github.com/ceph/ceph/pull/62516), Mark Kogan)

- rgw/d4n: Add config option for local RGW address ([pr#65942](https://github.com/ceph/ceph/pull/65942), Samarah)

- rgw/d4n: change cache write ::open() flags ([pr#65528](https://github.com/ceph/ceph/pull/65528), Mark Kogan)

- rgw/d4n: erasing dirty object entry for delete markers ([pr#67777](https://github.com/ceph/ceph/pull/67777), Pritha Srivastava)

- rgw/d4n: fix deprecated async\_run overload in RedisPool ([pr#68834](https://github.com/ceph/ceph/pull/68834), Kefu Chai)

- rgw/d4n: Implement bucket check\_empty and remove methods ([pr#65626](https://github.com/ceph/ceph/pull/65626), Samarah)

- rgw/d4n: Integration of optimization in iterate, connection pool and pipelining ([pr#63921](https://github.com/ceph/ceph/pull/63921), Pritha Srivastava, galsalomon66)

- rgw/d4n: passing the dpp to RedisPool::acquire to fix nullptr crash ([pr#66845](https://github.com/ceph/ceph/pull/66845), gal salomon)

- rgw/d4n: refactor unused conf rgw\_d4n\_l1\_datacache\_size ([pr#65529](https://github.com/ceph/ceph/pull/65529), Mark Kogan)

- rgw/d4n: removing fmt related code as it is ([pr#65284](https://github.com/ceph/ceph/pull/65284), Pritha Srivastava)

- rgw/datalog: Remove use of 'detached' in `rgw\_log\_backing` watch ([pr#65722](https://github.com/ceph/ceph/pull/65722), Adam C. Emerson)

- rgw/dbstore: fix memory leaks in unittest\_dbstore\_tests ([pr#66852](https://github.com/ceph/ceph/pull/66852), Kefu Chai)

- rgw/dbstore: free objectmap in DB::Destroy() ([pr#63599](https://github.com/ceph/ceph/pull/63599), Kefu Chai)

- rgw/dedup: add --allow/deny lists for bucket/storage-class ([pr#68575](https://github.com/ceph/ceph/pull/68575), Gabriel BenHanokh, benhanokh)

- rgw/dedup: add Admin OPS REST API for dedup commands ([pr#68863](https://github.com/ceph/ceph/pull/68863), Gabriel BenHanokh, benhanokh)

- rgw/dedup: Add support for RGW versions ([pr#66233](https://github.com/ceph/ceph/pull/66233), Gabriel BenHanokh)

- rgw/dedup: add throttling mechanism ([pr#64730](https://github.com/ceph/ceph/pull/64730), Gabriel BenHanokh)

- rgw/dedup: Bug-Fix ([pr#63715](https://github.com/ceph/ceph/pull/63715), Gabriel BenHanokh)

- rgw/dedup: extend shard tiers, add overflow guard, and fix bucket filter ([pr#70037](https://github.com/ceph/ceph/pull/70037), benhanokh)

- rgw/dedup: full object dedup ([pr#62179](https://github.com/ceph/ceph/pull/62179), Yuval Lifshitz, Gabriel BenHanokh)

- rgw/dedup: full object dedup continuous work ([pr#63560](https://github.com/ceph/ceph/pull/63560), Gabriel BenHanokh)

- rgw/dedup: Grant dedup process full RGW permissions ([pr#65783](https://github.com/ceph/ceph/pull/65783), Gabriel BenHanokh)

- rgw/dedup: Prevent the dup-counter from wrapping around ([pr#66380](https://github.com/ceph/ceph/pull/66380), Gabriel BenHanokh)

- rgw/dedup: split-head for objects with tails ([pr#68113](https://github.com/ceph/ceph/pull/68113), benhanokh)

- rgw/dedup: split-head mechanism ([pr#65423](https://github.com/ceph/ceph/pull/65423), benhanokh, Gabriel BenHanokh)

- rgw/dedup: Tech preview of full dedup support which means duplicate objects will be removed ([pr#64271](https://github.com/ceph/ceph/pull/64271), Gabriel BenHanokh)

- rgw/driver/posix: closedir() to free dir handle ([pr#63605](https://github.com/ceph/ceph/pull/63605), Kefu Chai)

- rgw/frontend: Allow multiple RGWs to run on same port on same host ([pr#62011](https://github.com/ceph/ceph/pull/62011), kchheda3)

- rgw/frontend: fix typo in function name ([pr#66107](https://github.com/ceph/ceph/pull/66107), Yuval Lifshitz)

- rgw/gc: mark rgw\_gc\_max\_objs as startup-only ([pr#68478](https://github.com/ceph/ceph/pull/68478), Matthew N. Heler)

- rgw/http: look up requests by id when applying state changes ([pr#71492](https://github.com/ceph/ceph/pull/71492), Matthew N. Heler)

- rgw/http: skip pause/resume when the request already finished ([pr#71597](https://github.com/ceph/ceph/pull/71597), Matthew N. Heler)

- rgw/http: take reqs\_lock when appending to reqs\_change\_state ([pr#69051](https://github.com/ceph/ceph/pull/69051), Matthew N. Heler)

- rgw/iam: fix NotEquals handling for multiple values ([pr#65606](https://github.com/ceph/ceph/pull/65606), liubingrun)

- rgw/iam: getAccountSummary API ([pr#63945](https://github.com/ceph/ceph/pull/63945), Raja Sharma)

- rgw/iam: match value of Null condition ([pr#67188](https://github.com/ceph/ceph/pull/67188), Casey Bodley)

- rgw/iam: User/Group/Role apis map ECANCELED to ERR\_CONCURRENT\_MODIFICATION ([pr#68007](https://github.com/ceph/ceph/pull/68007), Casey Bodley)

- rgw/kafka: add mTLS support (extends #61572) ([issue#67427](http://tracker.ceph.com/issues/67427), [pr#68771](https://github.com/ceph/ceph/pull/68771), Jan Radon)

- rgw/kafka: honor verify-ssl and separate cached connections ([pr#67978](https://github.com/ceph/ceph/pull/67978), 邓伟键)

- rgw/kafka: setting maximum batch size when sending messages ([pr#68394](https://github.com/ceph/ceph/pull/68394), Yuval Lifshitz)

- rgw/keystone: perf counter for cache hit wrong ([pr#66146](https://github.com/ceph/ceph/pull/66146), Tobias Urdin)

- rgw/lc: add coroutine support for cloud-transition and cloud-restore ([pr#68453](https://github.com/ceph/ceph/pull/68453), Matthew N. Heler)

- rgw/lc: add per-bucket lifecycle performance monitoring ([pr#66064](https://github.com/ceph/ceph/pull/66064), Matthew N. Heler)

- rgw/lc: Do not delete DM if its at end of pagination list ([pr#65947](https://github.com/ceph/ceph/pull/65947), kchheda3)

- rgw/lc: enforce consistent rgw\_lc\_debug\_interval start times ([pr#65585](https://github.com/ceph/ceph/pull/65585), Casey Bodley)

- rgw/lc: Increase the timeout value while fetching the lc shard lock and update the logic on expired session ([pr#65607](https://github.com/ceph/ceph/pull/65607), kchheda3)

- rgw/lc: LCOpAction\_CurrentExpiration checks mtime for delete markers ([pr#65664](https://github.com/ceph/ceph/pull/65664), Casey Bodley)

- rgw/lc: optimize lifecycle processing for multiple rules ([pr#66367](https://github.com/ceph/ceph/pull/66367), Matthew N. Heler)

- rgw/lc: replace WorkPool with ceph::async::spawn\_throttle ([pr#63762](https://github.com/ceph/ceph/pull/63762), Casey Bodley, mheler)

- rgw/lc: report x-amz-expiration only for the current version ([pr#70495](https://github.com/ceph/ceph/pull/70495), Lumir Sliva)

- rgw/lc: stop using merge\_and\_store\_attrs in remove\_bucket\_config ([pr#62980](https://github.com/ceph/ceph/pull/62980), Casey Bodley)

- rgw/lc: Warn against changing rgw\_lc\_max\_objs once lifecycle is in use ([pr#69786](https://github.com/ceph/ceph/pull/69786), Matthew N. Heler)

- rgw/logging: add error message when log\_record fails ([pr#65494](https://github.com/ceph/ceph/pull/65494), Yuval Lifshitz)

- rgw/logging: add mtime to get-bucket-logging response ([pr#63377](https://github.com/ceph/ceph/pull/63377), Yuval Lifshitz)

- rgw/logging: add size in MPU complete in standard mode ([pr#63244](https://github.com/ceph/ceph/pull/63244), Yuval Lifshitz)

- rgw/logging: allow committing empty objects ([pr#65387](https://github.com/ceph/ceph/pull/65387), Yuval Lifshitz)

- rgw/logging: do not create empty temporary objects ([pr#66238](https://github.com/ceph/ceph/pull/66238), Yuval Lifshitz)

- rgw/logging: extract tenant from bucket name on admin flush ([pr#62955](https://github.com/ceph/ceph/pull/62955), Yuval Lifshitz)

- rgw/logging: fix canonical names ([pr#63909](https://github.com/ceph/ceph/pull/63909), Yuval Lifshitz)

- rgw/logging: fix partitioned key format ([pr#63677](https://github.com/ceph/ceph/pull/63677), Yuval Lifshitz)

- rgw/logging: fix race condition when name update returns ECANCELED ([pr#65902](https://github.com/ceph/ceph/pull/65902), Yuval Lifshitz)

- rgw/logging: fix source bucket cleanup process ([pr#66110](https://github.com/ceph/ceph/pull/66110), Yuval Lifshitz)

- rgw/logging: fixes data loss during rollover ([pr#65281](https://github.com/ceph/ceph/pull/65281), N Balachandran)

- rgw/logging: log only object ACls in journal mode ([pr#63750](https://github.com/ceph/ceph/pull/63750), Yuval Lifshitz)

- rgw/logging: make unique part of log file both random and incremental ([pr#63959](https://github.com/ceph/ceph/pull/63959), Yuval Lifshitz)

- rgw/logging: Make unique portion of log object name ordered ([pr#63264](https://github.com/ceph/ceph/pull/63264), Yuval Lifshitz)

- rgw/logging: part upload operation name should be REST<span></span>.PUT<span></span>.PART ([pr#63268](https://github.com/ceph/ceph/pull/63268), Yuval Lifshitz)

- rgw/logging: rollover objects when conf changes ([pr#65456](https://github.com/ceph/ceph/pull/65456), Yuval Lifshitz)

- rgw/logging: send flushed object name in API reply ([pr#63160](https://github.com/ceph/ceph/pull/63160), Yuval Lifshitz)

- rgw/logging: support object metadata changes in journal mode ([pr#63240](https://github.com/ceph/ceph/pull/63240), Yuval Lifshitz)

- rgw/logging: use assumed-role ARN as Requester for STS requests ([pr#68887](https://github.com/ceph/ceph/pull/68887), ShreeJejurikar, Shree Jejurikar)

- rgw/logging: use trans\_id for standard access log record ([issue#75416](http://tracker.ceph.com/issues/75416), [pr#67984](https://github.com/ceph/ceph/pull/67984), cheese-cakee)

- rgw/lua: Add new Lua postAuth hook that is being run after authorization ([pr#67548](https://github.com/ceph/ceph/pull/67548), Emin Sunacoglu)

- rgw/lua: create fresh VM for each background script execution ([pr#67396](https://github.com/ceph/ceph/pull/67396), Rotem Shapira)

- rgw/lua: fix a crash when D4N is enabled ([pr#67638](https://github.com/ceph/ceph/pull/67638), Nithya Balachandran)

- rgw/multisite: 'bucket sync run' command during full sync does not take a bucket-wide lock ([pr#67616](https://github.com/ceph/ceph/pull/67616), Shilpa Jagannath)

- rgw/multisite: Balance sync traffic across DNS-resolved backends using CURLOPT\_CONNECT\_TO ([pr#69553](https://github.com/ceph/ceph/pull/69553), Oguzhan Ozmen)

- rgw/multisite: change HTTP error handling from EIO to ERR\_INTERNAL\_ERROR ([issue#71337](http://tracker.ceph.com/issues/71337), [pr#63303](https://github.com/ceph/ceph/pull/63303), Mark Kogan)

- rgw/multisite: check the local bucket's versioning status when replicating deletion from remote ([pr#65948](https://github.com/ceph/ceph/pull/65948), Jane Zhu)

- rgw/multisite: convert lock/unlock coroutines to use aio\_operate ([pr#67962](https://github.com/ceph/ceph/pull/67962), Shilpa Jagannath)

- rgw/multisite: don't reset push\_all before joining the CR thread ([pr#71542](https://github.com/ceph/ceph/pull/71542), Shilpa Jagannath, Adam C. Emerson)

- RGW/multisite: fix bucket-full-sync infinite loop caused by stale bucket\_list\_result reuse ([pr#66203](https://github.com/ceph/ceph/pull/66203), Oguzhan Ozmen)

- rgw/multisite: fix forwarded requests using awsv4 with UNSIGNED-PAYLOAD ([pr#67083](https://github.com/ceph/ceph/pull/67083), Shilpa Jagannath)

- rgw/multisite: Fix lifetime issues ([pr#63698](https://github.com/ceph/ceph/pull/63698), Adam C. Emerson)

- rgw/multisite: fix period pull command ([pr#65593](https://github.com/ceph/ceph/pull/65593), Shilpa Jagannath)

- rgw/multisite: fix segfault during multisite startup ([pr#66466](https://github.com/ceph/ceph/pull/66466), Shilpa Jagannath)

- rgw/multisite: fix sync requests on existing objects ([pr#65479](https://github.com/ceph/ceph/pull/65479), Shilpa Jagannath)

- RGW/Multisite: fix uninitialized LatencyMonitor causing spurious "OSD cluster is overloaded" warning ([pr#68659](https://github.com/ceph/ceph/pull/68659), Oguzhan Ozmen)

- rgw/multisite: Remove generally unneeded hourly runs of recovery ([pr#63759](https://github.com/ceph/ceph/pull/63759), Adam C. Emerson)

- rgw/multisite: remove old zonegroup name on the remote zone after a rename ([pr#68033](https://github.com/ceph/ceph/pull/68033), Shilpa Jagannath)

- rgw/multisite: rgw\_forward\_request\_to\_master() preserves Error responses ([pr#62993](https://github.com/ceph/ceph/pull/62993), Casey Bodley)

- rgw/multisite: sync object tagging deletion ([pr#62813](https://github.com/ceph/ceph/pull/62813), Shilpa Jagannath, Daniel Gryniewicz)

- rgw/multisite: sync put-object-lock-configuration ([pr#63089](https://github.com/ceph/ceph/pull/63089), Shilpa Jagannath)

- rgw/multisite: update api\_name during a zonegroup rename ([pr#65398](https://github.com/ceph/ceph/pull/65398), Shilpa Jagannath)

- rgw/multisite: url-encode list\_bucket query param 'key-marker' ([pr#64376](https://github.com/ceph/ceph/pull/64376), Shilpa Jagannath)

- rgw/multisite: use libfmt to format Date header ([pr#67306](https://github.com/ceph/ceph/pull/67306), Casey Bodley)

- rgw/notification: Fix the crash in parse\_url while initializing the regex ([pr#66316](https://github.com/ceph/ceph/pull/66316), kchheda3)

- rgw/notification: fix zero eventTime in bucket notifications on concurrent PUT race ([pr#69033](https://github.com/ceph/ceph/pull/69033), Krunal Chheda)

- rgw/notification: notification Event is not printing the correct  x\_amz\_request\_id ([pr#67722](https://github.com/ceph/ceph/pull/67722), Krunal Chheda)

- rgw/notification: Prevent reserved\_size leak by decrementing overhead on commit/abort ([pr#67169](https://github.com/ceph/ceph/pull/67169), Krunal Chheda, kchheda3)

- rgw/notifications: add http request timeout and max inflight ([pr#64110](https://github.com/ceph/ceph/pull/64110), Yuval Lifshitz)

- rgw/notifications: add support for sharded persistent bucket notifications ([pr#64018](https://github.com/ceph/ceph/pull/64018), Adarsh)

- rgw/notifications: prevent deletion of skipped notifications ([pr#64010](https://github.com/ceph/ceph/pull/64010), Yuval Lifshitz)

- rgw/notifications: relax topic names validation ([pr#68622](https://github.com/ceph/ceph/pull/68622), Yuval Lifshitz)

- rgw/notifications: replace timer waiter with async waiter ([pr#63986](https://github.com/ceph/ceph/pull/63986), Yuval Lifshitz)

- rgw/notifications: test refactoring ([pr#64662](https://github.com/ceph/ceph/pull/64662), Yuval Lifshitz)

- rgw/notify: fix reading the entries in a loop ([pr#66246](https://github.com/ceph/ceph/pull/66246), Yuval Lifshitz, N Balachandran)

- rgw/oidc: make the thumprint field optional ([pr#67656](https://github.com/ceph/ceph/pull/67656), Krunal Chheda)

- rgw/placement: display storage class in user info dump ([pr#60387](https://github.com/ceph/ceph/pull/60387), Jiffin Tony Thottan)

- rgw/posix: Account for incomplete uploads during deletes ([pr#66206](https://github.com/ceph/ceph/pull/66206), Samarah Uriarte)

- rgw/posix: add destructor to BucketCache to fix memory leaks ([pr#66850](https://github.com/ceph/ceph/pull/66850), Kefu Chai)

- rgw/posix: fix Inotify member initialization order race ([pr#68298](https://github.com/ceph/ceph/pull/68298), Kefu Chai)

- rgw/posix: fix leaks in error paths ([pr#69183](https://github.com/ceph/ceph/pull/69183), Kefu Chai)

- rgw/posix: Fix race condition in Inotify causing segfault ([pr#66186](https://github.com/ceph/ceph/pull/66186), Kefu Chai)

- rgw/posix: start the Inotify thread last, after the rest is built ([pr#69233](https://github.com/ceph/ceph/pull/69233), Kefu Chai)

- rgw/posix: WIP Standalone User ([pr#63687](https://github.com/ceph/ceph/pull/63687), Samarah Uriarte)

- rgw/pubsub: fix topic num\_shards serialization and some multisite test improvements ([pr#67798](https://github.com/ceph/ceph/pull/67798), Oguzhan Ozmen)

- rgw/qa/d3n: improve D3N test robustness ([pr#64359](https://github.com/ceph/ceph/pull/64359), Mark Kogan)

- rgw/rados: fix init/shutdown order for RGWIndexCompletionManager ([pr#66487](https://github.com/ceph/ceph/pull/66487), Casey Bodley)

- rgw/radosgw-admin: minor typo fixes ([pr#68020](https://github.com/ceph/ceph/pull/68020), Nithya Balachandran)

- rgw/restore: add configurable wait timeout for cloud restore read-through ([pr#66057](https://github.com/ceph/ceph/pull/66057), Matthew N. Heler)

- rgw/restore: Add notifications for restore events ([pr#65023](https://github.com/ceph/ceph/pull/65023), Soumya Koduri)

- rgw/restore: increase read\_thorugh restore period ([pr#65926](https://github.com/ceph/ceph/pull/65926), Soumya Koduri)

- rgw/restore: Persistently store the restore state for cloud-s3 tier ([pr#64933](https://github.com/ceph/ceph/pull/64933), Soumya Koduri)

- rgw/restore: run shard hash through HASH\_PRIME ([pr#69606](https://github.com/ceph/ceph/pull/69606), Matthew N. Heler)

- rgw/restore: Update expiry-date of restored copies ([pr#64804](https://github.com/ceph/ceph/pull/64804), Soumya Koduri)

- rgw/rgw\_cksum: work around -Wsometimes-uninitialized ([pr#62946](https://github.com/ceph/ceph/pull/62946), Max Kellermann)

- rgw/rgw\_lua\_utils: fix memory leak in luaL\_error() formatting ([pr#63819](https://github.com/ceph/ceph/pull/63819), Kefu Chai)

- rgw/rgw\_rest: determine the domain uri prefix by rgw\_transport\_is\_secure ([pr#63151](https://github.com/ceph/ceph/pull/63151), Xuehan Xu)

- rgw/s3: Always include x-amz-content-sha256 header in AWS v4 signatures ([pr#65723](https://github.com/ceph/ceph/pull/65723), Matthew N. Heler)

- rgw/s3: don't require sse-c headers to complete a multipart upload ([pr#71841](https://github.com/ceph/ceph/pull/71841), Matthew N. Heler)

- rgw/s3: fix PutObject's canned\_acl comparisons for BlockPublicAcls ([pr#64290](https://github.com/ceph/ceph/pull/64290), Casey Bodley)

- rgw/s3: reject an empty x-amz-server-side-encryption header ([pr#71536](https://github.com/ceph/ceph/pull/71536), Matthew N. Heler)

- rgw/s3: remove 'aws-chunked' from Content-Encoding response ([pr#64440](https://github.com/ceph/ceph/pull/64440), Casey Bodley)

- rgw/s3: support paginated ListBuckets ([pr#64742](https://github.com/ceph/ceph/pull/64742), Casey Bodley)

- RGW/s3select : variables initialization ([pr#66067](https://github.com/ceph/ceph/pull/66067), galsalomon66)

- rgw/s3select: Disable stringop truncation warning for s3select<span></span>.h ([pr#64971](https://github.com/ceph/ceph/pull/64971), Edwin Rodriguez)

- rgw/sal: Serializer::unlock() takes optional\_yield ([pr#63926](https://github.com/ceph/ceph/pull/63926), Casey Bodley)

- rgw/sns: ListTopics uses account root arn for policy evaluation ([pr#68429](https://github.com/ceph/ceph/pull/68429), Casey Bodley)

- RGW/standalone: Build without RadosStore ([pr#61850](https://github.com/ceph/ceph/pull/61850), Ali Masarwa)

- RGW/standalone: refactor rgw\_zone<span></span>.h with configstore ([pr#62398](https://github.com/ceph/ceph/pull/62398), Ali Masarwa)

- rgw/sts :  get-caller-identity issue fix ([pr#65734](https://github.com/ceph/ceph/pull/65734), Raja Sharma)

- rgw/sts: correct error code to 400 (from 403) ([pr#65847](https://github.com/ceph/ceph/pull/65847), Pritha Srivastava)

- rgw/sts: correcting authentication in case s3 ops are directed to a primary from secondary after assumerole ([pr#56576](https://github.com/ceph/ceph/pull/56576), Pritha Srivastava)

- rgw/sts: GetCallerIdentity API ([pr#63672](https://github.com/ceph/ceph/pull/63672), Raja Sharma)

- rgw/sts: Implementation of validating JWT using modulus and exponent ([pr#61796](https://github.com/ceph/ceph/pull/61796), Pritha Srivastava)

- rgw/sts: removing default value of rgw sts key and adding checks to return error when it is not set in config options ([pr#63212](https://github.com/ceph/ceph/pull/63212), Pritha Srivastava)

- rgw/test/notification: add more info when retry test fail ([pr#64535](https://github.com/ceph/ceph/pull/64535), Yuval Lifshitz)

- rgw/test: add Journal mode support to bucket logging test suite ([pr#68274](https://github.com/ceph/ceph/pull/68274), Shree Jejurikar)

- rgw/test: add more output in boto3 versioning testing ([pr#67190](https://github.com/ceph/ceph/pull/67190), J. Eric Ivancich)

- rgw/test: fix rgw versioning test fix ([pr#67247](https://github.com/ceph/ceph/pull/67247), J. Eric Ivancich)

- rgw/testing: update cpanm command to be more robust ([pr#72257](https://github.com/ceph/ceph/pull/72257), J. Eric Ivancich)

- rgw/tests: add os-specific java 1<span></span>.7 install commands to keycloak task ([pr#67578](https://github.com/ceph/ceph/pull/67578), J. Eric Ivancich)

- rgw/website: preserve nameservers for future use in dnsmasq ([pr#66625](https://github.com/ceph/ceph/pull/66625), Kyr Shatskyy)

- rgw/zone: remove duplicated startup logic in RGWSI\_Zone ([pr#63266](https://github.com/ceph/ceph/pull/63266), Casey Bodley)

- rgw: `account rm --purge-data` can delete users/roles/groups/oidcs too ([pr#67405](https://github.com/ceph/ceph/pull/67405), Casey Bodley)

- rgw: `radosgw-admin object put <span></span>.<span></span>.<span></span>.` broken w/ versioned buckets ([pr#66673](https://github.com/ceph/ceph/pull/66673), J. Eric Ivancich)

- rgw: account presigned POST bytes\_received in usage log ([pr#68571](https://github.com/ceph/ceph/pull/68571), Lumir Sliva)

- rgw: Add AES-256-GCM support for RGW server-side encryption ([pr#67246](https://github.com/ceph/ceph/pull/67246), Matthew N. Heler)

- rgw: Add bucket logging pytest test suite ([pr#67115](https://github.com/ceph/ceph/pull/67115), ShreeJejurikar)

- RGW: Add Bucket metadata attribute for Lua scripts ([pr#67219](https://github.com/ceph/ceph/pull/67219), Emin Sunacoglu, Emin Mert Sunacoglu)

- rgw: add Content-Type header to Vault KMS requests ([pr#68279](https://github.com/ceph/ceph/pull/68279), wuhongsong)

- rgw: Add documentation for the --pretty-format option ([issue#75988](http://tracker.ceph.com/issues/75988), [pr#68355](https://github.com/ceph/ceph/pull/68355), Nathan Hoad)

- rgw: add internal docs for `radosgw-admin object manifest <span></span>.<span></span>.<span></span>.` sub-command ([pr#66704](https://github.com/ceph/ceph/pull/66704), J. Eric Ivancich)

- rgw: Add Keystone scope information to ops logging ([pr#66111](https://github.com/ceph/ceph/pull/66111), Filipp Akinfiev)

- rgw: Add Lua functionality for blocking requests ([pr#66065](https://github.com/ceph/ceph/pull/66065), mertsunacoglu)

- rgw: add metric when send message with kafka and ampq ([pr#62971](https://github.com/ceph/ceph/pull/62971), Hoai-Thu Vuong)

- rgw: Add parameter to `get\_storage` to indicate radosgw-admin call ([pr#64070](https://github.com/ceph/ceph/pull/64070), Samarah)

- rgw: add RestoreStatus support to object listings ([pr#67547](https://github.com/ceph/ceph/pull/67547), Matthew N. Heler)

- rgw: add Retry-After header and configurable rate-limit response ([pr#68210](https://github.com/ceph/ceph/pull/68210), Lumir Sliva)

- rgw: add s3control apis for account-wide PublicAccessBlock ([pr#64293](https://github.com/ceph/ceph/pull/64293), Casey Bodley)

- rgw: add support for --shard-id in gc process and gc list commands ([pr#70451](https://github.com/ceph/ceph/pull/70451), Nathan Hoad)

- RGW: add support for global CORS rule ([pr#66500](https://github.com/ceph/ceph/pull/66500), Ali Masarwa)

- rgw: add support replication actions in policy ([pr#61962](https://github.com/ceph/ceph/pull/61962), Seena Fallah)

- rgw: add wildcard "\*" support for conditional read ([pr#64428](https://github.com/ceph/ceph/pull/64428), sungjoon_koh)

- rgw: align period/zone commands in radosgw-admin help ([pr#68278](https://github.com/ceph/ceph/pull/68278), cheese-cakee, Farzan)

- rgw: allow lc listing order to be configurable ([pr#63731](https://github.com/ceph/ceph/pull/63731), mheler)

- rgw: allow specifying ssl certificate for radosgw-admin operations ([pr#44283](https://github.com/ceph/ceph/pull/44283), Mark Kogan)

- rgw: always decompress in CopyObject when source is compressed ([pr#68011](https://github.com/ceph/ceph/pull/68011), Matthew N. Heler)

- rgw: authorization avoids sal::Object::get\_instance() ([pr#68055](https://github.com/ceph/ceph/pull/68055), Casey Bodley)

- rgw: auto-create missing bucket index shards during reindex operations ([pr#64801](https://github.com/ceph/ceph/pull/64801), Joshua Blanch)

- rgw: avoid doubled ARN in GetBucketReplication for pre-existing data ([pr#68137](https://github.com/ceph/ceph/pull/68137), Lumir Sliva)

- rgw: avoid using std::aligned\_storage\_t ([pr#64042](https://github.com/ceph/ceph/pull/64042), Kefu Chai)

- rgw: beast add ssl hot-reload ([pr#65842](https://github.com/ceph/ceph/pull/65842), Henry Richter)

- rgw: bind gcm object keys to the bucket marker ([pr#71038](https://github.com/ceph/ceph/pull/71038), Matthew N. Heler)

- rgw: break the coupling of olh epoch and epochs of olh ops ([pr#67661](https://github.com/ceph/ceph/pull/67661), Jane Zhu, Casey Bodley)

- rgw: bucket index list can go backwards and may loop ([pr#66623](https://github.com/ceph/ceph/pull/66623), J. Eric Ivancich)

- rgw: bump Apache Arrow submodule from 17<span></span>.0<span></span>.0 to 19<span></span>.0<span></span>.1 ([pr#69068](https://github.com/ceph/ceph/pull/69068), Kefu Chai)

- rgw: catch exception from abort\_early() on client disconnect ([pr#68782](https://github.com/ceph/ceph/pull/68782), Shilpa Jagannath)

- RGW: Change prerequest hook to run after authorization process ([pr#66567](https://github.com/ceph/ceph/pull/66567), Emin Sunacoglu)

- rgw: check all JWKS for STS ([pr#63047](https://github.com/ceph/ceph/pull/63047), Alex Wojno)

- rgw: Check if `HTTP\_X\_AMZ\_COPY\_SOURCE` header is empty ([pr#65159](https://github.com/ceph/ceph/pull/65159), Suyash Dongre)

- rgw: CompleteMultipartUpload can fail with 404 NoSuchUpload ([pr#68186](https://github.com/ceph/ceph/pull/68186), Casey Bodley)

- rgw: CompleteMultipartUpload renews cls\_lock on multipart meta object ([pr#67696](https://github.com/ceph/ceph/pull/67696), Casey Bodley)

- rgw: compress/decompress objects during lifecycle transitions ([pr#70687](https://github.com/ceph/ceph/pull/70687), Matthew N. Heler)

- rgw: copy\_obj\_data() record uncompressed size for a compressed source ([pr#70239](https://github.com/ceph/ceph/pull/70239), Oguzhan Ozmen)

- rgw: D4N Test Updates ([pr#62982](https://github.com/ceph/ceph/pull/62982), Samarah)

- rgw: DeleteObject supports sigv4 with Transfer-Encoding: chunked ([pr#64569](https://github.com/ceph/ceph/pull/64569), Casey Bodley)

- rgw: Deprecate OMAP datalog ([pr#68941](https://github.com/ceph/ceph/pull/68941), Adam C. Emerson)

- rgw: discard olh\\_ attributes when copying object from a versioning-suspended bucket to a versioning-disabled bucket ([pr#65158](https://github.com/ceph/ceph/pull/65158), Jane Zhu)

- rgw: do not include unused header ([pr#64181](https://github.com/ceph/ceph/pull/64181), Kefu Chai)

- rgw: enforce max max for reshard logs listings ([pr#66622](https://github.com/ceph/ceph/pull/66622), J. Eric Ivancich)

- rgw: enhanced java s3-tests change setting of JAVA\_HOME ([pr#68233](https://github.com/ceph/ceph/pull/68233), J. Eric Ivancich)

- rgw: Externalize Keystone secret key cache TTL ([pr#63271](https://github.com/ceph/ceph/pull/63271), Rafael Weingärtner)

- rgw: fix 'bucket rm --bypass-gc' for copied objects ([pr#65772](https://github.com/ceph/ceph/pull/65772), Casey Bodley)

- rgw: fix 'bucket stats' when bucket index doesn't exist ([pr#67189](https://github.com/ceph/ceph/pull/67189), Casey Bodley)

- rgw: fix `radosgw-admin object unlink <span></span>.<span></span>.<span></span>.` ([pr#66123](https://github.com/ceph/ceph/pull/66123), J. Eric Ivancich)

- rgw: fix aclRequired for bucket-logging ([pr#64251](https://github.com/ceph/ceph/pull/64251), N Balachandran)

- rgw: fix AES-256-GCM key/IV reuse on multipart part re-upload ([pr#69683](https://github.com/ceph/ceph/pull/69683), Matthew N. Heler)

- rgw: fix bilog autotrim of stale bucket<span></span>.instance metadata after peer deletion ([pr#70454](https://github.com/ceph/ceph/pull/70454), Oguzhan Ozmen)

- rgw: fix boost::intrusive::list iterator handling for erase ([pr#66235](https://github.com/ceph/ceph/pull/66235), Jane Zhu)

- rgw: fix bucket logging AuthType field ([pr#64349](https://github.com/ceph/ceph/pull/64349), N Balachandran)

- rgw: fix build with Lua 5<span></span>.5 ([pr#68833](https://github.com/ceph/ceph/pull/68833), Kefu Chai)

- rgw: fix checksum for get part request ([pr#66042](https://github.com/ceph/ceph/pull/66042), sungjoon_koh)

- rgw: fix cloud tier multipart resume using part number 0 ([pr#68324](https://github.com/ceph/ceph/pull/68324), Matthew N. Heler)

- rgw: fix conditional writes on versioning-suspended buckets ([pr#72048](https://github.com/ceph/ceph/pull/72048), Matthew N. Heler)

- rgw: Fix crashes on realm reload ([pr#70300](https://github.com/ceph/ceph/pull/70300), Lumir Sliva, Adam C. Emerson, Oguzhan Ozmen)

- rgw: fix fixup\_range cascade for compressed+encrypted objects ([pr#67966](https://github.com/ceph/ceph/pull/67966), Matthew N. Heler)

- rgw: fix GetObject ETag with part number parameter ([pr#65194](https://github.com/ceph/ceph/pull/65194), sungjoon_koh)

- rgw: fix log\_remove spurious -EIO on non-existent FIFO shards ([pr#70305](https://github.com/ceph/ceph/pull/70305), Shilpa Jagannath)

- rgw: fix luarocks directory permissions ([pr#62227](https://github.com/ceph/ceph/pull/62227), Ansgar Jazdzewski)

- rgw: fix memory leak in RGWHTTPManager thread cleanup ([pr#66874](https://github.com/ceph/ceph/pull/66874), Kefu Chai)

- rgw: fix overflow of outstanding counter in SimpleThrottler ([pr#66455](https://github.com/ceph/ceph/pull/66455), Xinying Song)

- rgw: fix policy enforcement for GetObjectAttributes ([pr#65441](https://github.com/ceph/ceph/pull/65441), Matt Benjamin)

- rgw: Fix the version of restore\_pool and dedup\_pool ([pr#64361](https://github.com/ceph/ceph/pull/64361), Soumya Koduri)

- rgw: fix typos in log messages ([pr#64448](https://github.com/ceph/ceph/pull/64448), N Balachandran)

- rgw: fix uninitalized fields in pubsub topic creation ([pr#68204](https://github.com/ceph/ceph/pull/68204), Abhishek Bansal)

- rgw: fix use-after-free on cancellation in shard\_io::async\_reads() ([pr#71136](https://github.com/ceph/ceph/pull/71136), Casey Bodley)

- rgw: frontend reads/writes respect rgw\_beast\_enable\_async ([pr#62851](https://github.com/ceph/ceph/pull/62851), Casey Bodley)

- rgw: group lifecycle versioned deletes to reduce OLH contention ([pr#67700](https://github.com/ceph/ceph/pull/67700), Matthew N. Heler)

- RGW: handle plain-text object tags in RGWObjTags::decode() ([pr#67336](https://github.com/ceph/ceph/pull/67336), Oguzhan Ozmen)

- rgw: honor CopyObject tagging-directive ([pr#70681](https://github.com/ceph/ceph/pull/70681), Matthew N. Heler)

- rgw: Implement Admin REST APIs for Setting Account Quota ([pr#65480](https://github.com/ceph/ceph/pull/65480), Nicholas Liu)

- rgw: implement CopyObject for encrypted objects ([pr#63794](https://github.com/ceph/ceph/pull/63794), Seena Fallah, Marcus Watts)

- rgw: implements timestamp-based epochs for versioned objects ([pr#62469](https://github.com/ceph/ceph/pull/62469), Igor Gomon)

- rgw: include cleanup ([pr#65393](https://github.com/ceph/ceph/pull/65393), Max Kellermann)

- rgw: Inject keystone roles into IAM policy ([pr#67752](https://github.com/ceph/ceph/pull/67752), Supriti Singh, Marcel Lauhoff)

- rgw: introduce rgw\_bucket\_eexist\_override ([pr#62186](https://github.com/ceph/ceph/pull/62186), Matt Benjamin)

- rgw: java s3-tests change setting of JAVA\_HOME ([pr#68208](https://github.com/ceph/ceph/pull/68208), J. Eric Ivancich)

- rgw: ListRoles returns "Access Denied" for a regular user with valid allow policy ([pr#66923](https://github.com/ceph/ceph/pull/66923), Theofilos Mouratidis)

- rgw: Lua Package management fixes ([pr#67479](https://github.com/ceph/ceph/pull/67479), Nithya Balachandran)

- rgw: make keystone work without admin token(service ac requirement) ([pr#60515](https://github.com/ceph/ceph/pull/60515), Deepika Upadhyay)

- rgw: make sure max\_objs\_per\_shard is appropriate in debugging scenarios ([pr#63443](https://github.com/ceph/ceph/pull/63443), J. Eric Ivancich)

- rgw: match CORS rules like Amazon S3 ([pr#69651](https://github.com/ceph/ceph/pull/69651), ramin.najarbashi)

- rgw: migrate from boost::variant to std::variant ([pr#63179](https://github.com/ceph/ceph/pull/63179), Kefu Chai)

- rgw: Move declaration inline to solve compiler warning about an unused variable ([pr#68702](https://github.com/ceph/ceph/pull/68702), Nathan Hoad)

- rgw: move rados-specific parts of RGWRealmWatcher into ConfigStore ([pr#63189](https://github.com/ceph/ceph/pull/63189), Casey Bodley)

- rgw: move SWIFT error\_handler out-of-line to fix link failure ([pr#69166](https://github.com/ceph/ceph/pull/69166), Sun Yuechi)

- RGW: multi object delete op; skip olh update for all deletes but the last one ([pr#64800](https://github.com/ceph/ceph/pull/64800), Oguzhan Ozmen)

- rgw: multisite sync data\_log error handling broken in tentacle ([pr#68601](https://github.com/ceph/ceph/pull/68601), Alexander Hussein-Kershaw)

- rgw: only log errors to add\_datalog\_entry when error ([pr#67378](https://github.com/ceph/ceph/pull/67378), J. Eric Ivancich)

- rgw: ops large budget caused by rate limiter was enabled and max\_ops … ([pr#66509](https://github.com/ceph/ceph/pull/66509), morphes1995)

- rgw: Policy evalaution logging ([pr#70531](https://github.com/ceph/ceph/pull/70531), Adam C. Emerson)

- rgw: prefetch data from versioned object instance head ([pr#62903](https://github.com/ceph/ceph/pull/62903), Jane Zhu)

- RGW: prevent shutdown hang by reconciling race between async processor and multisite sync threads ([pr#66369](https://github.com/ceph/ceph/pull/66369), Oguzhan Ozmen)

- rgw: radosgw-admin bi list follows max-entries ([pr#71043](https://github.com/ceph/ceph/pull/71043), J. Eric Ivancich)

- rgw: rate limit for LIST and DELETE ops ([pr#64762](https://github.com/ceph/ceph/pull/64762), Mark Kogan)

- rgw: read user usage log in S3 GetUsage ([pr#71102](https://github.com/ceph/ceph/pull/71102), ramin.najarbashi)

- rgw: read\_obj\_policy() consults s3:prefix when deciding between 403/404 ([pr#68577](https://github.com/ceph/ceph/pull/68577), Casey Bodley)

- rgw: recognize checksum from x-amz-checksum-{type} alone ([pr#63326](https://github.com/ceph/ceph/pull/63326), Matt Benjamin)

- rgw: redirect to the endpoint of the bucket's zonegroup ([issue#64983](http://tracker.ceph.com/issues/64983), [pr#71524](https://github.com/ceph/ceph/pull/71524), ramin.najarbashi)

- rgw: reduce default thread pool size ([pr#69747](https://github.com/ceph/ceph/pull/69747), Mark Kogan, Adam C. Emerson)

- rgw: refact by encapsulating io\_context\_pool to enforce lazy initialization ([pr#66721](https://github.com/ceph/ceph/pull/66721), swjtu-zhanglei)

- rgw: Remove blank file ([pr#68979](https://github.com/ceph/ceph/pull/68979), Nathan Hoad)

- RGW: remove custom copy ctor for RGWObjectCtx and enforce no copy/move ([pr#66514](https://github.com/ceph/ceph/pull/66514), Oguzhan Ozmen)

- rgw: Remove invalid Content-Type header from RGW OIDC discovery requests ([pr#66280](https://github.com/ceph/ceph/pull/66280), Jonathan Suever)

- rgw: remove redundant close\_section() call in RGWDeleteMultiObj end\_response() ([pr#68740](https://github.com/ceph/ceph/pull/68740), Shilpa Jagannath)

- rgw: Replace deprecated Barbican payload endpoint with alternative ([pr#65011](https://github.com/ceph/ceph/pull/65011), Marcel Lauhoff)

- rgw: report copy obj progress from the frontend CR ([pr#62887](https://github.com/ceph/ceph/pull/62887), Seena Fallah)

- rgw: require RestoreObject Days >= 1 ([pr#67685](https://github.com/ceph/ceph/pull/67685), Matthew N. Heler)

- rgw: retry ENOENT if bucket reshard races with index operation ([pr#66553](https://github.com/ceph/ceph/pull/66553), Shilpa Jagannath)

- rgw: return an etag header for all successful complete-multipart ([pr#68364](https://github.com/ceph/ceph/pull/68364), Matt Benjamin)

- rgw: rgw-orphan-list can continue with empty intermediate file(s) ([pr#66938](https://github.com/ceph/ceph/pull/66938), J. Eric Ivancich)

- rgw: rgw\_rest\_account<span></span>.cc: Fix quota variable types from int32\_t to int64\_t ([pr#70394](https://github.com/ceph/ceph/pull/70394), Theofilos Mouratidis)

- rgw: RGWPostBucketLoggingOp uses yield context ([pr#63561](https://github.com/ceph/ceph/pull/63561), Casey Bodley)

- rgw: RGWSI\_Notify drains the finisher before deleting RGWWatchers ([pr#65775](https://github.com/ceph/ceph/pull/65775), Casey Bodley)

- rgw: stop crashing when an admin tries to assume a nonexistent role ([pr#67863](https://github.com/ceph/ceph/pull/67863), Matthew N. Heler)

- rgw: support S3 Object Ownership controls to disable object ACLs ([pr#64152](https://github.com/ceph/ceph/pull/64152), Casey Bodley)

- rgw: treat -EFBIG as advance-and-retry in unordered listing ([pr#65319](https://github.com/ceph/ceph/pull/65319), PARK BEOMSEOK)

- rgw: Update buffer size for HMAC signature ([pr#64959](https://github.com/ceph/ceph/pull/64959), Edwin Rodriguez)

- rgw: update keystone repo stable branch to 2024<span></span>.2 ([pr#66198](https://github.com/ceph/ceph/pull/66198), Kyr Shatskyy)

- rgw: use later versions of Apache Arrow at utf8proc submodules ([pr#65797](https://github.com/ceph/ceph/pull/65797), J. Eric Ivancich)

- rgw: use local error code in handle\_individual\_object() ([pr#69737](https://github.com/ceph/ceph/pull/69737), Casey Bodley)

- rgw: vault code cleanup ([pr#62908](https://github.com/ceph/ceph/pull/62908), Seena Fallah)

- rgw: Verify key id before sending to Barbican ([pr#65010](https://github.com/ceph/ceph/pull/65010), Marcel Lauhoff)

- rgw: VLAs are no longer welcome ([pr#68014](https://github.com/ceph/ceph/pull/68014), Adam C. Emerson)

- RGW: When using Keystone auth for RGW, include the Keystone user in ops log ([pr#53365](https://github.com/ceph/ceph/pull/53365), Ali Masarwa)

- rgw: Work around Boost<span></span>.Containers bug in 1<span></span>.91 ([pr#68721](https://github.com/ceph/ceph/pull/68721), Adam C. Emerson)

- rgw:oidc  add metadata handler to support OpenIDConnectProvider replication ([pr#67536](https://github.com/ceph/ceph/pull/67536), Krunal Chheda)

- rgw\_file: always assign string\_view of current common\_prefix ([pr#67828](https://github.com/ceph/ceph/pull/67828), Matt Benjamin)

- rgw\_file: restore ability of attributes to be<span></span>.<span></span>.<span></span>.restored ([pr#66178](https://github.com/ceph/ceph/pull/66178), Matt Benjamin)

- rgw\_gc: don't fail when processing entry with nonexisting pool ([pr#70395](https://github.com/ceph/ceph/pull/70395), Mykola Golub)

- rgw\_rest\_s3<span></span>.cc: update how we report bucket quota cfg info for max size (bytes) and max objects ([pr#63879](https://github.com/ceph/ceph/pull/63879), Oguzhan Ozmen)

- rgwlc: fix removal of delete markers (SAL) ([pr#64272](https://github.com/ceph/ceph/pull/64272), Matt Benjamin)

- rimson/net: cap outgoing message batch size to prevent seastar packet fragment overflow ([pr#70661](https://github.com/ceph/ceph/pull/70661), Ronen Friedman)

- rocky 10 build error fixes ([pr#64681](https://github.com/ceph/ceph/pull/64681), Samuel Just)

- rpm: default to gcc-toolset-13, not just for crimson ([pr#65130](https://github.com/ceph/ceph/pull/65130), Casey Bodley)

- rpm: Migrate license in ceph<span></span>.spec to SPDX ([pr#59650](https://github.com/ceph/ceph/pull/59650), Miroslav Suchý)

- rpm: reenable lto for gcc-toolset-13 by requiring 13<span></span>.3 ([pr#58881](https://github.com/ceph/ceph/pull/58881), Casey Bodley)

- run-make: work around package conflicts from llvm<span></span>.sh ([pr#63409](https://github.com/ceph/ceph/pull/63409), Casey Bodley)

- script/backport-create-issue: catch errors during traversal ([pr#69219](https://github.com/ceph/ceph/pull/69219), Patrick Donnelly)

- script/backport-create-issue: fix the syntax warning ([pr#63128](https://github.com/ceph/ceph/pull/63128), Kyr Shatskyy)

- script/backport-create-issue: update custom field name ([pr#69152](https://github.com/ceph/ceph/pull/69152), Patrick Donnelly)

- script/build-with-container<span></span>.: fixes and improvments towards el10 ([pr#64072](https://github.com/ceph/ceph/pull/64072), John Mulligan)

- script/build-with-container: add CONFIGURE\_ARGS env var to configure step ([pr#67783](https://github.com/ceph/ceph/pull/67783), John Mulligan)

- script/build-with-container: add distro references for ubuntu 26<span></span>.04 ([pr#68602](https://github.com/ceph/ceph/pull/68602), John Mulligan)

- script/build-with-container: add more detailed variants ([pr#65994](https://github.com/ceph/ceph/pull/65994), John Mulligan)

- script/build-with-container: add workarounds for older python versions ([pr#63913](https://github.com/ceph/ceph/pull/63913), John Mulligan)

- script/buildcontainer-setup: fix package install on debian trixie ([pr#70128](https://github.com/ceph/ceph/pull/70128), David Galloway)

- script/ceph-backport: skip fetch if merge commit already exists locally ([pr#68422](https://github.com/ceph/ceph/pull/68422), Kefu Chai)

- script/gen-corpus: cleanup and improve readability and performance ([pr#66554](https://github.com/ceph/ceph/pull/66554), Nitzan Mordechai)

- script/ptl-tool: add CEPH-BUILD-JOB trailer support ([pr#66818](https://github.com/ceph/ceph/pull/66818), Patrick Donnelly)

- script/ptl-tool: add option to explicitly push to ci ([pr#66843](https://github.com/ceph/ceph/pull/66843), Patrick Donnelly)

- script/ptl-tool: add option to not create a tag ([pr#68641](https://github.com/ceph/ceph/pull/68641), Patrick Donnelly)

- script/ptl-tool: allow automatic links for commit sha ([pr#69004](https://github.com/ceph/ceph/pull/69004), Patrick Donnelly)

- script/ptl-tool: allow PR numbers as GH urls ([pr#68655](https://github.com/ceph/ceph/pull/68655), Patrick Donnelly)

- script/ptl-tool: allow setting private on QA issue ([pr#66844](https://github.com/ceph/ceph/pull/66844), Patrick Donnelly)

- script/ptl-tool: consolidate conflict reviews ([pr#68923](https://github.com/ceph/ceph/pull/68923), Patrick Donnelly)

- script/ptl-tool: fix typo ([pr#66953](https://github.com/ceph/ceph/pull/66953), Patrick Donnelly)

- script/ptl-tool: get git dir via git command ([pr#68639](https://github.com/ceph/ceph/pull/68639), Patrick Donnelly)

- script/ptl-tool: improve help messages during startup ([pr#68582](https://github.com/ceph/ceph/pull/68582), Patrick Donnelly)

- script/ptl-tool: refactor ptl-tool and introduce event-driven CI backport auditing ([pr#68703](https://github.com/ceph/ceph/pull/68703), Patrick Donnelly)

- script/ptl-tool: remove debug suffix on branch name ([pr#67094](https://github.com/ceph/ceph/pull/67094), Patrick Donnelly)

- script/ptl-tool: source githumap from main branch ([pr#68640](https://github.com/ceph/ceph/pull/68640), Patrick Donnelly)

- script/ptl-tool: use provided base even in conflict ([pr#68987](https://github.com/ceph/ceph/pull/68987), Patrick Donnelly)

- script/redmine-upkeep: add Filter class ([pr#64487](https://github.com/ceph/ceph/pull/64487), Patrick Donnelly)

- script/redmine-upkeep: avoid spurious warnings for backport PRs ([pr#67563](https://github.com/ceph/ceph/pull/67563), Patrick Donnelly)

- script/redmine-upkeep: bump issue limit for scheduled runs ([pr#65266](https://github.com/ceph/ceph/pull/65266), Patrick Donnelly)

- script/redmine-upkeep: codify commit abbreviation ([pr#64486](https://github.com/ceph/ceph/pull/64486), Patrick Donnelly)

- script/redmine-upkeep: do not try to update status if open subtasks exist ([pr#65569](https://github.com/ceph/ceph/pull/65569), Patrick Donnelly)

- script/redmine-upkeep: fix formatting of comment ([pr#65331](https://github.com/ceph/ceph/pull/65331), Patrick Donnelly)

- script/redmine-upkeep: handle invalid PRs ([pr#64446](https://github.com/ceph/ceph/pull/64446), Patrick Donnelly)

- script/redmine-upkeep: include each issue changed in summary ([pr#65555](https://github.com/ceph/ceph/pull/65555), Patrick Donnelly)

- script/redmine-upkeep: reset merge state after PR change ([pr#65499](https://github.com/ceph/ceph/pull/65499), Patrick Donnelly)

- script/redmine-upkeep: resolve comment misformatting ([pr#68555](https://github.com/ceph/ceph/pull/68555), Patrick Donnelly)

- script: add configuration diff tool ([pr#63136](https://github.com/ceph/ceph/pull/63136), Naveen Naidu)

- script: add redmine-upkeep script ([pr#64191](https://github.com/ceph/ceph/pull/64191), Patrick Donnelly)

- script: add script to help format QA review summaries ([pr#64463](https://github.com/ceph/ceph/pull/64463), Laura Flores)

- script: ceph-backport<span></span>.sh adds redmine key to api requests ([pr#63565](https://github.com/ceph/ceph/pull/63565), Casey Bodley)

- script: ignore main branch when cleaning ci ([pr#63221](https://github.com/ceph/ceph/pull/63221), Patrick Donnelly)

- script: import github token for redmine-upkeep ([pr#65217](https://github.com/ceph/ceph/pull/65217), Patrick Donnelly)

- script: improve qa-summary<span></span>.sh script ([pr#67234](https://github.com/ceph/ceph/pull/67234), Laura Flores)

- script: sanitize git branch names for OCI tag compliance ([pr#66404](https://github.com/ceph/ceph/pull/66404), Kefu Chai)

- scripts/build/ceph<span></span>.spec<span></span>.in: fix rhel version checks ([pr#66772](https://github.com/ceph/ceph/pull/66772), Ronen Friedman)

- scripts: add Jenkins unit test analysis tool ([pr#68851](https://github.com/ceph/ceph/pull/68851), Steven Zuraski)

- scripts: ceph\_dump\_log<span></span>.py change global context access ([pr#67337](https://github.com/ceph/ceph/pull/67337), Brad Hubbard)

- scroll up by default when clicking on side navigation ([pr#62683](https://github.com/ceph/ceph/pull/62683), Alexander Gomez, alexjr2001)

- seastar: bump up seastar submodule ([pr#67604](https://github.com/ceph/ceph/pull/67604), Aishwarya Mathuria)

- seastar: bump up seastar submodule ([pr#66149](https://github.com/ceph/ceph/pull/66149), Aishwarya Mathuria)

- seastar: bump up seastar submodule ([pr#63232](https://github.com/ceph/ceph/pull/63232), Aishwarya Mathuria)

- seastore/omap\_manager/btree: change node insert/del funcs to coroutines ([pr#68626](https://github.com/ceph/ceph/pull/68626), Shraddha Agrawal)

- seastore/omap\_manager/btree: change omap manager funcs to coroutines ([pr#68625](https://github.com/ceph/ceph/pull/68625), Shraddha Agrawal)

- seastore: misc cleanups, coroutine conversions ([pr#65394](https://github.com/ceph/ceph/pull/65394), Samuel Just)

- sestore/omap\_manager/btree: prevent heap buffer overflow in log ([pr#68701](https://github.com/ceph/ceph/pull/68701), Shraddha Agrawal)

- smb: add a ceph based smb remote control client tool ([pr#68756](https://github.com/ceph/ceph/pull/68756), John Mulligan)

- smb: add a smb remote control client tool frontend ([pr#68825](https://github.com/ceph/ceph/pull/68825), John Mulligan)

- smb: add debug level options to smb cluster resource ([pr#67534](https://github.com/ceph/ceph/pull/67534), John Mulligan)

- smb: add keybridge support and fscrypt configuration ([pr#64641](https://github.com/ceph/ceph/pull/64641), John Mulligan)

- smb: add remote control server ([pr#64372](https://github.com/ceph/ceph/pull/64372), John Mulligan)

- smb: add remote-control local mode feature ([pr#67571](https://github.com/ceph/ceph/pull/67571), John Mulligan)

- smb: allow smb clusters to use cephfs from a different ceph cluster ([pr#66557](https://github.com/ceph/ceph/pull/66557), John Mulligan)

- smb: fix ceph smb show ceph<span></span>.smb<span></span>.ext<span></span>.cluster ([pr#67615](https://github.com/ceph/ceph/pull/67615), John Mulligan)

- smb: fix custom ports feature with remote-control sidecar ([pr#65069](https://github.com/ceph/ceph/pull/65069), John Mulligan)

- smb: improve smb mgr module resource type error handling ([pr#68010](https://github.com/ceph/ceph/pull/68010), John Mulligan)

- smb: qa workunit for smb ([pr#66322](https://github.com/ceph/ceph/pull/66322), John Mulligan)

- smb: support custom ip address binds ([pr#64142](https://github.com/ceph/ceph/pull/64142), John Mulligan)

- smb: support custom ports ([pr#63924](https://github.com/ceph/ceph/pull/63924), John Mulligan)

- smb: support shares equivalent for hosts allow ([pr#65632](https://github.com/ceph/ceph/pull/65632), John Mulligan)

- smb: Update the configuration logic for smbd ports ([pr#65931](https://github.com/ceph/ceph/pull/65931), Anoop C S)

- smb: wildcard deletion of smb shares and clusters ([pr#68522](https://github.com/ceph/ceph/pull/68522), John Mulligan)

- src/arch: fix hwprobe include path and ZBC/ZVBC offsets for riscv64 ([pr#68047](https://github.com/ceph/ceph/pull/68047), WenLei)

- src/ceph-volume: fast device unavailable as error ([pr#67745](https://github.com/ceph/ceph/pull/67745), Timothy Q Nguyen)

- src/ceph\_osd, osd: Implement running benchmark during OSD creation - Phase 1 ([pr#64289](https://github.com/ceph/ceph/pull/64289), Sridhar Seshasayee)

- src/cephadm/cephadmlib/daemons: Fix typos in ceph<span></span>.py and elsewhere ([pr#65510](https://github.com/ceph/ceph/pull/65510), Anthony D'Atri)

- src/cephadm: added ceph-exporter to post-rotate signal list ([pr#68902](https://github.com/ceph/ceph/pull/68902), Timothy Q Nguyen)

- src/cephadm: updated crash dir creation ([pr#66559](https://github.com/ceph/ceph/pull/66559), Timothy Q Nguyen)

- src/CMakeLists<span></span>.txt: Allow Seastar to reuse HAVE\_LIBURING ([pr#67165](https://github.com/ceph/ceph/pull/67165), Matan Breizman, Mohit Agrawal)

- src/CMakeLists: Crimson - enable libhwloc ([pr#63350](https://github.com/ceph/ceph/pull/63350), Matan Breizman)

- src/common/options/global<span></span>.yaml<span></span>.in: Fix BlueStore capitalization ([pr#66115](https://github.com/ceph/ceph/pull/66115), Anthony D'Atri)

- src/common/options: Clarify mon\_target\_pg\_per\_osd in mgr<span></span>.yaml<span></span>.in ([pr#62017](https://github.com/ceph/ceph/pull/62017), Anthony D'Atri)

- src/common/options: Clarify scope of scrub intervals in osd<span></span>.yaml<span></span>.in ([pr#63487](https://github.com/ceph/ceph/pull/63487), Anthony D'Atri)

- src/common/options: Improve global<span></span>.yaml<span></span>.in ([pr#65399](https://github.com/ceph/ceph/pull/65399), Anthony D'Atri)

- src/common/options: Increase autoscaler PG target and overload values ([pr#69452](https://github.com/ceph/ceph/pull/69452), Anthony D'Atri)

- src/common/options: Modernize language in global<span></span>.yaml<span></span>.in ([pr#68062](https://github.com/ceph/ceph/pull/68062), Anthony D'Atri)

- src/common: Add a destructor to shared\_mutex\_debug ([pr#66497](https://github.com/ceph/ceph/pull/66497), Hui Tong)

- src/common: add crc32c support for riscv64 ([pr#66026](https://github.com/ceph/ceph/pull/66026), lvshuo2016)

- src/common: fix from\_iso\_8601 had no exception define ([pr#64208](https://github.com/ceph/ceph/pull/64208), Wang Linke)

- src/common: fix missing return ([pr#64249](https://github.com/ceph/ceph/pull/64249), Zhu Wei)

- src/common: Fix text formatting in options/rgw<span></span>.yaml<span></span>.in ([pr#65983](https://github.com/ceph/ceph/pull/65983), Ville Ojamo)

- src/common: optimize crc32c using zbc extension for riscv64 ([pr#68154](https://github.com/ceph/ceph/pull/68154), WenLei)

- src/crimson/seastore: improve block size validation assert message ([pr#68550](https://github.com/ceph/ceph/pull/68550), Shraddha Agrawal)

- src/crimson: Improve message ([pr#63858](https://github.com/ceph/ceph/pull/63858), Anthony D'Atri)

- src/mgr/ClusterState<span></span>.cc: micro improve ingest\_pgstats ([pr#63792](https://github.com/ceph/ceph/pull/63792), Kamoltat Sirivadhna)

- src/mon/MgrStatMonitor: fix invalid iterator increment in calc\_pool\_availability() ([pr#63398](https://github.com/ceph/ceph/pull/63398), Nitzan Mordechai)

- src/msg/async/Event: collect and ignore return value for read() ([pr#67763](https://github.com/ceph/ceph/pull/67763), Kamoltat (Junior) Sirivadhna)

- src/nvmeof/NVMeofGwMonitorClient: connect panic ([pr#64713](https://github.com/ceph/ceph/pull/64713), Alexander Indenbaum)

- src/osd/OSDMap<span></span>.cc: Display SUM of PGs in ceph osd df ([pr#66920](https://github.com/ceph/ceph/pull/66920), Kamoltat (Junior) Sirivadhna)

- src/osd: add more logs to the AllReplicasRecovered handler ([pr#68306](https://github.com/ceph/ceph/pull/68306), Shraddha Agrawal)

- src/osd: fix typo in asok command help in OSD<span></span>.cc ([pr#68235](https://github.com/ceph/ceph/pull/68235), Ville Ojamo)

- src/osd: Improve message in OSD<span></span>.cc ([pr#65231](https://github.com/ceph/ceph/pull/65231), Anthony D'Atri)

- src/pybind/mgr/cephadm/service\_discovery: fixed HAProxy labels ([pr#62299](https://github.com/ceph/ceph/pull/62299), Bernard Landon)

- src/pybind/mgr/cephadm: Improve text in module<span></span>.py ([pr#65796](https://github.com/ceph/ceph/pull/65796), Anthony D'Atri)

- src/pybind/mgr/prometheus: Add five OSD metadata metrics to module<span></span>.py ([pr#67097](https://github.com/ceph/ceph/pull/67097), adatri)

- src/pybind/mgr: handle json-pretty for perf stats ([pr#66492](https://github.com/ceph/ceph/pull/66492), Neeraj Pratap Singh)

- src/pybind: fixing the test\_invalid\_client\_id failure ([pr#70608](https://github.com/ceph/ceph/pull/70608), Neeraj Pratap Singh)

- src/rgw: Adding "sync error trim" option ([pr#58926](https://github.com/ceph/ceph/pull/58926), Kalpesh Pandya)

- src/script/build-integration-branch improvements ([pr#64543](https://github.com/ceph/ceph/pull/64543), John Mulligan)

- src/script/build-with-container<span></span>.py: fix a few spelling errors ([pr#67145](https://github.com/ceph/ceph/pull/67145), Dan Mick)

- src/script: add bookworm to build scripts ([pr#65804](https://github.com/ceph/ceph/pull/65804), Dan Mick)

- src/test: add libcephfs tests for async(nonblocking) calls ([pr#54435](https://github.com/ceph/ceph/pull/54435), Dhairya Parmar)

- src/vstart<span></span>.sh: fix start\_ganesha() to avoid crashing nfs-ganesha server ([pr#66154](https://github.com/ceph/ceph/pull/66154), Dhairya Parmar)

- src: Add sign-compare warnings to clang ([pr#65012](https://github.com/ceph/ceph/pull/65012), Alex Ainscow)

- src: fix 'recieved' typo across codebase ([pr#68083](https://github.com/ceph/ceph/pull/68083), Lumir Sliva)

- src: Fix memory leaks in generate\_test\_instance() by returning values instead of pointers ([pr#63910](https://github.com/ceph/ceph/pull/63910), Kefu Chai)

- src: fix NDEBUG typo ([pr#63486](https://github.com/ceph/ceph/pull/63486), Matan Breizman)

- src: make enums castable and build with Python 3<span></span>.14 on Fedora >= 43 ([pr#66773](https://github.com/ceph/ceph/pull/66773), Dmitrii Sharshakov)

- src: Move the decision to build the ISA plugin to the top level makefile ([pr#67877](https://github.com/ceph/ceph/pull/67877), Alex Ainscow)

- src: remove showing traceback from assert\_valid\_host when it fails ([pr#60156](https://github.com/ceph/ceph/pull/60156), Neeraj Pratap Singh)

- src: replace push\_back(T{}) with emplace\_back() ([pr#65227](https://github.com/ceph/ceph/pull/65227), Kefu Chai)

- src: typo in radosgw-admin<span></span>.cc ([pr#63922](https://github.com/ceph/ceph/pull/63922), Mouratidis Theofilos)

- Standalone RGW fix for test\_versioning\_concurrent\_multi\_object\_delete ([pr#66800](https://github.com/ceph/ceph/pull/66800), Samarah Uriarte)

- Stretched cluster ([pr#66624](https://github.com/ceph/ceph/pull/66624), Leonid Chernin)

- suites/rados/cephadm: typo in ignotr list for still running message ([pr#64927](https://github.com/ceph/ceph/pull/64927), Nitzan Mordechai)

- Support build image with docker ([pr#66678](https://github.com/ceph/ceph/pull/66678), bugwz)

- systemd services: fix configuring ceph-volume@ service to use correct path to executable ([pr#66670](https://github.com/ceph/ceph/pull/66670), Thomas Lamprecht)

- tasks/cbt\_performance: Tolerate exceptions during performance data up… ([pr#66016](https://github.com/ceph/ceph/pull/66016), Nitzan Mordechai)

- tasks/cephfs/mount: use 192<span></span>.168<span></span>.144<span></span>.0<span></span>.0/20 for brxnet ([pr#62709](https://github.com/ceph/ceph/pull/62709), Kyr Shatskyy)

- tentacle kickoff v2 ([pr#62089](https://github.com/ceph/ceph/pull/62089), Patrick Donnelly)

- test/bluestore: fix memory leaks in ExtentMap<span></span>.reshard\_failure test ([pr#66898](https://github.com/ceph/ceph/pull/66898), Kefu Chai)

- test/ceph-helpers: add timeout to ceph pg query ([pr#67715](https://github.com/ceph/ceph/pull/67715), Nitzan Mordechai)

- test/ceph-helpers: Pass timeout and add timeout for commands in test\_pg\_scrub ([pr#66457](https://github.com/ceph/ceph/pull/66457), Nitzan Mordechai)

- test/ceph\_assert<span></span>.cc: Disable core files ([pr#62765](https://github.com/ceph/ceph/pull/62765), Bob Ham)

- test/ceph\_assert: fix death test timeout with threadsafe style ([pr#67085](https://github.com/ceph/ceph/pull/67085), Kefu Chai)

- test/common: fix memory leak in librados completion tests ([pr#63595](https://github.com/ceph/ceph/pull/63595), Kefu Chai)

- test/common: Fix signed comparison ([pr#62672](https://github.com/ceph/ceph/pull/62672), Adam Emerson)

- test/common: unittest\_fault\_injector omits unit-main target ([pr#63822](https://github.com/ceph/ceph/pull/63822), Casey Bodley)

- test/crimson/seastore/CMakeLists: tune ASan's UAR fake stack size ([pr#64810](https://github.com/ceph/ceph/pull/64810), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: add heavy update UT ([pr#64575](https://github.com/ceph/ceph/pull/64575), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: add monotonic inc UT ([pr#64998](https://github.com/ceph/ceph/pull/64998), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: add unit test for clear ([pr#64528](https://github.com/ceph/ceph/pull/64528), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: faster check mappings ([pr#65008](https://github.com/ceph/ceph/pull/65008), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: redesign depth3 split ([pr#64942](https://github.com/ceph/ceph/pull/64942), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: redesign test basic ([pr#64566](https://github.com/ceph/ceph/pull/64566), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: redesign test leafnodes ([pr#64499](https://github.com/ceph/ceph/pull/64499), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: redesign test replay ([pr#64489](https://github.com/ceph/ceph/pull/64489), Chanyoung Park)

- test/crimson/seastore/test\_omap\_manager: redesign test variable sizes ([pr#64522](https://github.com/ceph/ceph/pull/64522), Chanyoung Park)

- test/crimson/seastore/test\_transaction\_manager: improve check\_available() ([pr#64019](https://github.com/ceph/ceph/pull/64019), Yingxin Cheng)

- test/crimson/seastore: add missing crimson::gtest to link libraries ([pr#68217](https://github.com/ceph/ceph/pull/68217), Kefu Chai)

- test/crimson/test\_crimson\_coroutine: introduce interruptible repeat example ([pr#66637](https://github.com/ceph/ceph/pull/66637), Matan Breizman)

- test/d4n: Change D4N filter test cleaning interval values to ints ([pr#64017](https://github.com/ceph/ceph/pull/64017), Samarah)

- test/encoding/readable: Add backward incompat checks ([pr#66544](https://github.com/ceph/ceph/pull/66544), Nitzan Mordechai)

- test/encoding: use setarch -R for ASAN builds in readable<span></span>.sh ([pr#67531](https://github.com/ceph/ceph/pull/67531), Kefu Chai)

- test/erasure-code: fix memory leak in ErasureCodePlugin<span></span>.parity\_delta\\_… ([pr#63840](https://github.com/ceph/ceph/pull/63840), Kefu Chai)

- test/erasure-code: fix memory leak when erasure\_code\_init() fails ([pr#64221](https://github.com/ceph/ceph/pull/64221), Kefu Chai)

- test/erasure-code: fix stack-use-after-scope by replacing initializer\_list with array ([pr#64238](https://github.com/ceph/ceph/pull/64238), Kefu Chai)

- test/erasure-code: Use memory comparisons that are safe on big endian arch ([pr#67218](https://github.com/ceph/ceph/pull/67218), Jamie Pryde)

- test/fio\_ceph\_messenger: fix building errors ([pr#70198](https://github.com/ceph/ceph/pull/70198), Igor Fedotov)

- test/fs/CMakeLists<span></span>.txt: add ceph-common to ceph\_test\_trim\_caps and ceph\_test\_ino\_release\_cb ([pr#63925](https://github.com/ceph/ceph/pull/63925), Samuel Just)

- test/kafka: support archived kafka versions ([pr#71450](https://github.com/ceph/ceph/pull/71450), Yuval Lifshitz, Adam C. Emerson)

- test/lazy-omap-stats: overload get\_output() to accept both lvalue and… ([pr#66277](https://github.com/ceph/ceph/pull/66277), Nitzan Mordechai)

- test/libcephfs: copy DT\_NEEDED entries from input libraries ([pr#62865](https://github.com/ceph/ceph/pull/62865), Patrick Donnelly)

- test/libcephfs: reduce SnapDiffDeletionRecreation bulk\_count on Windows ([pr#69203](https://github.com/ceph/ceph/pull/69203), Kefu Chai)

- test/librados/aio\_cxx: Fix potential mutex destruction failure on Pool EIOFlag ([pr#64087](https://github.com/ceph/ceph/pull/64087), Nitzan Mordechai)

- test/librados/aio\_cxx: skip EIO boundary assertion when no in-flight I/Os ([pr#63177](https://github.com/ceph/ceph/pull/63177), Nitzan Mordechai)

- test/librbd/fsx: initialize effective\_size variable ([pr#64964](https://github.com/ceph/ceph/pull/64964), Edwin Rodriguez)

- test/mds: Fix catch by value ([pr#62675](https://github.com/ceph/ceph/pull/62675), Adam Emerson)

- test/mds: fix flaky RepeatedQuiesceAwait ([pr#68560](https://github.com/ceph/ceph/pull/68560), Kefu Chai)

- test/mds: fix stack-use-after-scope in unittest\_mds\_quiesce\_db ([pr#66851](https://github.com/ceph/ceph/pull/66851), Kefu Chai)

- test/mgr: Improve unit-test coverage for ceph-mgr ([pr#66432](https://github.com/ceph/ceph/pull/66432), szuraski898)

- test/mon/test\_election: fix memory leaks of Owner and ConnectionTracker ([pr#64065](https://github.com/ceph/ceph/pull/64065), Kefu Chai)

- test/neorados: Catch timeouts in Watch/Poll test ([pr#65372](https://github.com/ceph/ceph/pull/65372), Adam C. Emerson)

- test/objectstore/TestRocksdbOptionParse<span></span>.cc: Fix race hazard ([pr#58194](https://github.com/ceph/ceph/pull/58194), Bill Scales)

- test/objectstore: fix memory leak test\_bluestore\_types<span></span>.cc ([pr#63600](https://github.com/ceph/ceph/pull/63600), Kefu Chai)

- test/objectstore: Fix signed comparison warning ([pr#62671](https://github.com/ceph/ceph/pull/62671), Adam Emerson)

- test/osd: Adapt strategy for testing asserts in interval\_sets ([pr#62496](https://github.com/ceph/ceph/pull/62496), Alex Ainscow)

- test/osd: Extend ceph\_test\_rados\_io\_sequence to support copy operations ([pr#64562](https://github.com/ceph/ceph/pull/64562), Adam Lyon-Jones)

- test/osd: fix buffer alignment issue in unittest\_ecbackend ([pr#66849](https://github.com/ceph/ceph/pull/66849), Kefu Chai)

- test/osd: Fix issue where ceph\_test\_rados\_io\_sequence could select a chunksize of zero ([pr#64121](https://github.com/ceph/ceph/pull/64121), Jon Bailey)

- test/osd: fix Message and Connection refcount leaks ([pr#68614](https://github.com/ceph/ceph/pull/68614), Kefu Chai)

- test/osd: Fix pack for minor issues in ceph\_test\_rados\_io\_sequence ([pr#64136](https://github.com/ceph/ceph/pull/64136), Jon Bailey)

- test/osd: Fix unittest\_peeringstate message leaks ([pr#67544](https://github.com/ceph/ceph/pull/67544), Kefu Chai)

- test/osd: Improve readability of errors in ceph\_test\_rados\_io\_sequence ([pr#64046](https://github.com/ceph/ceph/pull/64046), Jon Bailey)

- test/osd: Move initialisation of overwrites and optimisation earlier in ceph\_test\_rados\_io\_sequence ([pr#64564](https://github.com/ceph/ceph/pull/64564), Jon Bailey)

- test/osd: Suppress subobject-linkage warning in SelectMappingAndLayers ([pr#64973](https://github.com/ceph/ceph/pull/64973), Edwin Rodriguez)

- test/pybind/test\_rbd<span></span>.py: remove skip\_if\_crimson ([pr#64470](https://github.com/ceph/ceph/pull/64470), Matan Breizman)

- test/rbd-mirror: eliminate a race in ResyncRequestedRemoteNotPrimary ([pr#64757](https://github.com/ceph/ceph/pull/64757), VinayBhaskar-V)

- test/rbd: remove unit tests about cache tiering ([pr#64391](https://github.com/ceph/ceph/pull/64391), Laura Flores)

- test/rgw/kafka: cleanup kafka tgz file ([pr#68472](https://github.com/ceph/ceph/pull/68472), Yuval Lifshitz)

- test/rgw/kafka: fix kafka relase to more recent one ([pr#67653](https://github.com/ceph/ceph/pull/67653), Yuval Lifshitz)

- test/rgw/lua: ignore hours for zero mtime ([pr#67432](https://github.com/ceph/ceph/pull/67432), Kyr Shatskyy)

- test/rgw/notification: fix rabbitmq dependency for rocky10 ([pr#68021](https://github.com/ceph/ceph/pull/68021), Yuval Lifshitz)

- test/rgw/notification: fix the cloudevents package version ([pr#68003](https://github.com/ceph/ceph/pull/68003), Yuval Lifshitz)

- test/rgw/notification: remove depracated dependencies ([pr#67387](https://github.com/ceph/ceph/pull/67387), Yuval Lifshitz)

- test/rgw/posix: free the quota handler in TestDriver ([pr#69285](https://github.com/ceph/ceph/pull/69285), Kefu Chai)

- test/rgw/test\_d4n\_filter: remove unused captures ([pr#64000](https://github.com/ceph/ceph/pull/64000), Ronen Friedman)

- test/rgw: fix -Wstring-plus-char warning in test\_d4n\_policy ([pr#67665](https://github.com/ceph/ceph/pull/67665), Kefu Chai)

- test/rgw: link lua test against unit-main for g\_ceph\_context ([pr#63434](https://github.com/ceph/ceph/pull/63434), Casey Bodley)

- test/rgw: Refactor CORS configuration handling for S3 ([pr#64963](https://github.com/ceph/ceph/pull/64963), Edwin Rodriguez)

- test/run-cli-tests: inherit ASAN\_OPTIONS and LSAN\_OPTIONS ([pr#64521](https://github.com/ceph/ceph/pull/64521), Kefu Chai)

- test/run-cli-tests: install wheel before cram to fix build failure ([pr#66733](https://github.com/ceph/ceph/pull/66733), Kefu Chai)

- test/standalone/scrub: improve build\_pg\_dicts() performance ([pr#64861](https://github.com/ceph/ceph/pull/64861), Ronen Friedman)

- test/test\_not\_before\_queue: Fix memory leak by freeing ineligible items in destructor ([pr#63292](https://github.com/ceph/ceph/pull/63292), Kefu Chai)

- test: add missing includes ([pr#69007](https://github.com/ceph/ceph/pull/69007), Max Kellermann)

- test: Add option to not delete created objects ([pr#65912](https://github.com/ceph/ceph/pull/65912), Matty Williams)

- test: Add option to select data generation type ([pr#65917](https://github.com/ceph/ceph/pull/65917), Matty Williams)

- test: Add optional timestamps to ceph\_test\_rados ([pr#63851](https://github.com/ceph/ceph/pull/63851), Alex Ainscow)

- test: add replica pool support to ceph\_test\_rados\_io\_sequence ([pr#62747](https://github.com/ceph/ceph/pull/62747), Bill Scales, Jon Bailey)

- test: disable known flaky tests in run-rbd-unit-tests ([pr#67525](https://github.com/ceph/ceph/pull/67525), Ilya Dryomov)

- test: Exit with relevant error message when enabling EC optimisations fails ([pr#65875](https://github.com/ceph/ceph/pull/65875), Matty Williams)

- test: Fix gcc warnings about subobject-linkage in ceph\_test\_rados\_io\_sequence ([pr#67553](https://github.com/ceph/ceph/pull/67553), Jon Bailey)

- test: Fix unittest\_peeringstate as fix for 74218 has merged ([pr#67509](https://github.com/ceph/ceph/pull/67509), Bill Scales)

- test: improvments for running make check test suite in containers ([pr#64069](https://github.com/ceph/ceph/pull/64069), John Mulligan)

- test: rados singleton-bluestore missing mds for cephtool tests ([pr#67640](https://github.com/ceph/ceph/pull/67640), Nitzan Mordechai)

- test: Remove invalid unit test ([pr#70665](https://github.com/ceph/ceph/pull/70665), Jon Bailey)

- test: repeer\_on\_down\_acting\_member\_coming\_back is continuously failing ([pr#65433](https://github.com/ceph/ceph/pull/65433), Mohit Agrawal)

- test: use json\_extract instead of awkward json\_tree ([pr#67251](https://github.com/ceph/ceph/pull/67251), Patrick Donnelly)

- tools/ceph-dencoder: do not test HitSet types ([pr#64601](https://github.com/ceph/ceph/pull/64601), Kefu Chai)

- tools/ceph-erasure-code-tool: Fix issue stopping parity shards being generated when running encode ([pr#63522](https://github.com/ceph/ceph/pull/63522), Connor Fawcett)

- tools/ceph-kvstore-tool: fix crash on db close ([pr#67069](https://github.com/ceph/ceph/pull/67069), Igor Fedotov)

- tools/ceph\_dedup: improve const-ness and use ranged-for loop when appropriate ([pr#63289](https://github.com/ceph/ceph/pull/63289), Kefu Chai)

- tools/ceph\_dedup: remove 'using namespace std' ([pr#63145](https://github.com/ceph/ceph/pull/63145), Kefu Chai)

- tools/cephfs/first-damage: default conf if CEPH\_CONF not set ([pr#63194](https://github.com/ceph/ceph/pull/63194), Dan van der Ster)

- tools/cephfs: add new cephfs-tool ([pr#67032](https://github.com/ceph/ceph/pull/67032), Patrick Donnelly)

- tools/cephfs: allow scanning and flushing journal in batches ([pr#70275](https://github.com/ceph/ceph/pull/70275), Dhairya Parmar)

- tools/cephfs: always execute scan\\_{extents,inodes,frags} and cleanup ([issue#75083](http://tracker.ceph.com/issues/75083), [pr#67709](https://github.com/ceph/ceph/pull/67709), Venky Shankar)

- tools/cephfs\_mirror: Distribute datasync threads evenly across snapshots ([pr#67546](https://github.com/ceph/ceph/pull/67546), Kotresh HR)

- tools/cephfs\_mirror: Fix dir sync hang ([pr#68128](https://github.com/ceph/ceph/pull/68128), Kotresh HR)

- tools/cephfs\_mirror: Multi-threaded Mirroring ([pr#66572](https://github.com/ceph/ceph/pull/66572), Kotresh HR)

- tools/cephfs\_mirror: Remove additional wait in pop\_dataq\_entry ([pr#67689](https://github.com/ceph/ceph/pull/67689), Kotresh HR)

- tools/contrib: add upmap-remapped<span></span>.py utility ([pr#70855](https://github.com/ceph/ceph/pull/70855), Dan van der Ster)

- tools/immutable\_object\_cache: don't leak in-flight replies on teardown ([pr#70589](https://github.com/ceph/ceph/pull/70589), Sun Yuechi)

- tools/kvstore\_tool: add missing `#ifdef WITH\_BLUESTORE` ([pr#61020](https://github.com/ceph/ceph/pull/61020), Max Kellermann)

- tools/kvstore\_tool: reduce BlueStore<span></span>.h exposure ([pr#65937](https://github.com/ceph/ceph/pull/65937), Igor Fedotov)

- tools/rados: Remove plain text snippets from rados bench JSON output ([pr#66936](https://github.com/ceph/ceph/pull/66936), Jacques Heunis)

- tools: ceph-objectstore-tool check for invalid pgid ([pr#64987](https://github.com/ceph/ceph/pull/64987), Alex Ainscow)

- tools: handle get-attr as read-only ops in ceph-objectstore-tool ([pr#66120](https://github.com/ceph/ceph/pull/66120), Jaya Prakash)

- tools: make rados ls aware about the locator concept ([pr#64696](https://github.com/ceph/ceph/pull/64696), Radoslaw Zarzynski)

- uadk: Build with ceph fork (for FORTIFY\_SOURCE fix) ([pr#65396](https://github.com/ceph/ceph/pull/65396), David Galloway)

- uadk: remove \_\_DATE\_\_ and \_\_TIME\_\_ from compilation ([pr#65161](https://github.com/ceph/ceph/pull/65161), Dan Mick)

- Umbrella checklist kickoff! ([pr#66524](https://github.com/ceph/ceph/pull/66524), Alex Ainscow, Chris Harris)

- Update cc file tab settings ([pr#65742](https://github.com/ceph/ceph/pull/65742), Edwin Rodriguez)

- Update Ceph to compile with Boost 1<span></span>.90 ([pr#66878](https://github.com/ceph/ceph/pull/66878), Adam C. Emerson)

- Update CephFS option descriptions ([pr#64659](https://github.com/ceph/ceph/pull/64659), Anthony D'Atri)

- Update dashboard Pending release notes ([pr#65431](https://github.com/ceph/ceph/pull/65431), Afreen Misbah)

- Update foundation<span></span>.rst ([pr#67222](https://github.com/ceph/ceph/pull/67222), Anthony M)

- Update header file tab settings ([pr#65741](https://github.com/ceph/ceph/pull/65741), Edwin Rodriguez)

- Update misc file tab settings ([pr#65743](https://github.com/ceph/ceph/pull/65743), Edwin Rodriguez)

- Update the POSIXDriver readme to current state ([pr#67739](https://github.com/ceph/ceph/pull/67739), Daniel Gryniewicz)

- Use GANESHA\_REPO\_BASEURL for NFS-Ganesha on all distros ([pr#69073](https://github.com/ceph/ceph/pull/69073), Shweta Bhosale)

- Use GANESHA\_REPO\_BASEURL for NFS-Ganesha on all distros ([pr#68909](https://github.com/ceph/ceph/pull/68909), Shweta Bhosale)

- v21<span></span>.1<span></span>.0 ([pr#70267](https://github.com/ceph/ceph/pull/70267), Ceph Release Team, David Galloway, Yuri Weinstein, Kefu Chai)

- various: update pip+https URLs to new form ([pr#65443](https://github.com/ceph/ceph/pull/65443), Dan Mick)

- vstart<span></span>.sh: revert unintended allocator type change ([pr#66886](https://github.com/ceph/ceph/pull/66886), Igor Fedotov)

- vstart: all rgw debug logs must honor the -d flag ([pr#66275](https://github.com/ceph/ceph/pull/66275), Yuval Lifshitz)

- vstart: disable extblkdev plugins for file-backed OSDs ([pr#68173](https://github.com/ceph/ceph/pull/68173), Annmool)

- vstart: replace obsolescent egrep with grep -E ([pr#67114](https://github.com/ceph/ceph/pull/67114), Kefu Chai)

- win32\_deps\_bild: bump openssl version ([pr#63606](https://github.com/ceph/ceph/pull/63606), Lucian Petrut)

- WIP D4N remove erase from update ([pr#66484](https://github.com/ceph/ceph/pull/66484), Samarah)

- WIP DNM doc/radosgw/s3: Document delete-if-unmodified-since ([pr#63351](https://github.com/ceph/ceph/pull/63351), Anthony D'Atri)

- Wip libcephfs perf dump ([issue#71233](http://tracker.ceph.com/issues/71233), [pr#62632](https://github.com/ceph/ceph/pull/62632), Venky Shankar)

- Wip rgw/lua: performance improvements ([pr#66832](https://github.com/ceph/ceph/pull/66832), Nithya Balachandran)

- zstd: Update zstd to 1<span></span>.5<span></span>.6 for cmake 4 compatability ([pr#65915](https://github.com/ceph/ceph/pull/65915), Edwin Rodriguez)
