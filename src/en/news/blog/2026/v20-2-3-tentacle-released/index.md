---
title: "v20.2.3 Tentacle released"
date: "2026-08-05"
author: "Yuri Weinstein"
tags:
  - "release"
  - "tentacle"
---
This is the third minor release in the Tentacle series.
We recommend that all users update to this release.

Release Date
------------

August 5, 2026

## Notable Changes
---------------

MDS (Metadata Server)
----------------------

- Fixed a crash and shutdown hang that could occur when ephemeral pins were active and `max_mds` was set to 0.
- Session reclaim could miss blocklisting an old session; this is now handled correctly.
- Fixed a case where scrub was unable to identify damage from an irreparable hard link.

OSD (Object Storage Daemon)
----------------------------

- BlueStore: Fixed a BlueFS WAL envelope-mode bug that caused write buffer misalignment.
- Erasure Coding: Fixed truncate+write planning for EC shard sizes.
- Fixed a condition that prevented rolling forward of PG log entries.
- Prevented `OSDMap::check_health()` from asserting when new OSDs are found in a subtree.
- Scrub: "repairing" scrubs — deep scrubs re-run specifically to fix a previously detected inconsistency — are no longer blocked by the configured allowed scrub hours/days; they can now run at any time.

RGW (RADOS Gateway)
---------------------

- Added the `ssl_ciphersuites` option for the Beast front-end to support TLS 1.3 cipher customization.
- Fixed PutObject's `canned_acl` comparison bug affecting `BlockPublicAcls`.
- Fixed crashes occurring on realm reload.
- Implemented CopyObject support for encrypted objects.
- Added mTLS client-certificate authentication support for Kafka notifications.
- Fixed removal of delete markers in lifecycle processing.

RADOS / librados / neorados
-----------------------------

- neorados: Fixed an infinite trim loop on empty data log shards.
- Fixed cancellation-slot cleanup in librados/asio's associated executor.

Dashboard
-----------------

- Added a hardware-monitoring dashboard backed by node-proxy metrics.
- Fixed a bind-address regression caused by CherryPy isolation.
- Added support for adding hosts via CSV upload.
- NVMeoF: multiple CLI and UI backports (EC pool support, IO statistics, role management).
- Object: The global RGW Roles tab has been removed. Role management is now
  scoped under RGW Accounts, where roles can be listed, created, edited, and
  deleted for a selected account.

ceph-volume
-----------

- Reworked OSD mapper lifecycle handling (LVM + raw) for activate.
- Improved detection of rotational media under dm-crypt to bypass the workqueue correctly.
- Fixed OSD re-deployment issues with disk-selection filters and DB devices.
- Added retry handling for `lvs` when it returns an empty result or a "devices file is missing" error.

NVMe-oF
-------

- Added configurable delayed failback (default 0, no delay) to accommodate initiators that recover paths with a delay.
- Gateways in the DELETING state now ignore beacons and send empty maps instead of processing them.
- `rbd_with_crc32c` is now enabled by default via cephadm.
- Introduced a new NVMeoF mgr module. The module automatically creates the
  `".nvmeof"` metadata pool if it does not already exist. Gateway-group state
  files are stored in this pool unless the user specifies another pool. The
  module is enabled automatically on fresh installs; on upgrades from an older
  cluster, it must be enabled manually.

RBD
---

- Fixed a use-after-free bug releasing object map locks during deep copy.
- Fixed memory leaks in PWL discard operations.
- Obsolete primary mirror snapshots are now pruned after relocation.

## Changelog

- [Stretch Mode] mon: restrict changing mon election strategy post stretch mode ([pr#65457](https://github.com/ceph/ceph/pull/65457), Kamoltat Sirivadhna)

- ceph-exporter: fix systemd unit ([pr#70193](https://github.com/ceph/ceph/pull/70193), Henry Hirsch)

- ceph-volume: detect rotational media under dm-crypt for workqueue bypass ([pr#69228](https://github.com/ceph/ceph/pull/69228), Guillaume Abrioux)

- ceph-volume: fallback to default for empty get\_file\_contents values ([pr#68883](https://github.com/ceph/ceph/pull/68883), Guillaume Abrioux)

- ceph-volume: fix argparse dmcrypt opts: use str type ([pr#68882](https://github.com/ceph/ceph/pull/68882), Guillaume Abrioux)

- ceph-volume: fix raw activate when device path is stale ([pr#69410](https://github.com/ceph/ceph/pull/69410), Guillaume Abrioux)

- ceph-volume: fix re-deployment of OSD issues with disk selection filters and DB Devices ([pr#69093](https://github.com/ceph/ceph/pull/69093), Raimund Sacherer)

- ceph-volume: has\_bluestore\_label checks all bluestore label replica o… ([pr#68586](https://github.com/ceph/ceph/pull/68586), Guillaume Abrioux, Redouane Kachach)

- ceph-volume: make TPM2 PCR policy configurable (default to PCR 7) ([pr#68681](https://github.com/ceph/ceph/pull/68681), Guillaume Abrioux)

- ceph-volume: OSD mapper lifecycle (LVM + raw) for activate ([pr#69091](https://github.com/ceph/ceph/pull/69091), Guillaume Abrioux)

- ceph-volume: pass --set-keepcaps for FCM crush device class on mkfs ([pr#68633](https://github.com/ceph/ceph/pull/68633), Guillaume Abrioux)

- ceph-volume: retry lvs after empty result and "devices file is missing" stderr ([pr#69206](https://github.com/ceph/ceph/pull/69206), Guillaume Abrioux)

- ceph-volume: skip internal raid mirror LVs in inventory ([pr#69703](https://github.com/ceph/ceph/pull/69703), Guillaume Abrioux)

- cephadm/nvmeof: enable rbd\_with\_crc32c by default ([pr#66957](https://github.com/ceph/ceph/pull/66957), Alexander Indenbaum)

- cephadm: fix EndPoint to handle bracketed IPv6 addresses ([pr#68573](https://github.com/ceph/ceph/pull/68573), Redouane Kachach)

- Containerfile: Support pulp repo URLs ([pr#69581](https://github.com/ceph/ceph/pull/69581), David Galloway)

- doc/rados/configuration: recommend wpq for EC clusters seeing slow ops ([pr#68943](https://github.com/ceph/ceph/pull/68943), Matthew N. Heler)

- doc/rbd: clarify mirror resync snapshot behavior ([pr#70080](https://github.com/ceph/ceph/pull/70080), Miki Patel)

- Include s3tests in Ceph repo ([pr#69775](https://github.com/ceph/ceph/pull/69775), Adam C. Emerson)

- journal/ObjectPlayer: don't acquire locks in destructor ([pr#70015](https://github.com/ceph/ceph/pull/70015), Kefu Chai)

- librados/asio: clear cancellation slot in associated executor ([pr#69050](https://github.com/ceph/ceph/pull/69050), Casey Bodley)

- librbd/pwl: fix memory leaks in discard operations ([pr#68955](https://github.com/ceph/ceph/pull/68955), Kefu Chai)

- librbd: fix use-after-free releasing object map locks in deep copy ([pr#70010](https://github.com/ceph/ceph/pull/70010), Kefu Chai)

- mds/MDSMap: Enhance set\_min\_compat\_client to validate iterator range before sorting feature bits ([pr#65533](https://github.com/ceph/ceph/pull/65533), Edwin Rodriguez)

- mds: fix crash and shutdown hang when ephemeral pins active and max\_mds is 0 ([pr#69486](https://github.com/ceph/ceph/pull/69486), chungfengz)

- mds: for an irreparable hard link scrub is not able to identify the damage ([pr#68853](https://github.com/ceph/ceph/pull/68853), Md Mahamudur Rahaman Sajib)

- mds: prevent CDir omap commit with empty updates/removals/header ([issue#76455](http://tracker.ceph.com/issues/76455), [pr#69502](https://github.com/ceph/ceph/pull/69502), Venky Shankar)

- mds: session reclaim could miss blocklisting an old session ([pr#69504](https://github.com/ceph/ceph/pull/69504), Venky Shankar)

- messages: MOSDOpReply encode and decode errorcode32\_t with PGID64 fea… ([pr#66269](https://github.com/ceph/ceph/pull/66269), Nitzan Mordechai)

- mgr/cephadm: Add degraded namespace flag to NVMEoF spec file ([pr#69679](https://github.com/ceph/ceph/pull/69679), Gil Bregman)

- mgr/cephadm: Add IO statistics enable field to the cephadm NVMEoF spec file ([pr#70312](https://github.com/ceph/ceph/pull/70312), Gil Bregman)

- mgr/cephadm: renames ceph\_device to ceph\_device\_lvm ([pr#68751](https://github.com/ceph/ceph/pull/68751), Robert Sander)

- mgr/DaemonServer: Aggregate and globally sort OSDs for ok-to-upgrade ([pr#69542](https://github.com/ceph/ceph/pull/69542), Sridhar Seshasayee)

- mgr/DaemonServer: auto-tune stats period when message queue gets backed up ([pr#69015](https://github.com/ceph/ceph/pull/69015), Nitzan Mordechai)

- mgr/DaemonServer: clarify ok-to-upgrade error message for CRUSH buckets ([pr#69369](https://github.com/ceph/ceph/pull/69369), Sridhar Seshasayee)

- mgr/DaemonServer: Make an ok-to-upgrade error message more generic ([pr#70392](https://github.com/ceph/ceph/pull/70392), Sridhar Seshasayee)

- mgr/dashboard:  Add hardware monitoring dashboard using node proxy metrics ([pr#69925](https://github.com/ceph/ceph/pull/69925), Afreen Misbah)

- mgr/dashboard: "Access Denied" being shown on overview page for read-only user ([pr#68786](https://github.com/ceph/ceph/pull/68786), Devika Babrekar)

- mgr/dashboard: Add "connection get\_io\_statistics" to NVMeoF CLI ([pr#67844](https://github.com/ceph/ceph/pull/67844), Gil Bregman)

- mgr/dashboard: Add EC pools support to NVMEoF CLI ([pr#69142](https://github.com/ceph/ceph/pull/69142), Gil Bregman)

- mgr/dashboard: Add Hosts via CSV Upload ([pr#69213](https://github.com/ceph/ceph/pull/69213), Sagar Gopale)

- mgr/dashboard: Align RGW role management with Carbon and scope to accounts ([pr#69589](https://github.com/ceph/ceph/pull/69589), Sagar Gopale)

- mgr/dashboard: Backport cephadm e2e test fixes ([pr#69848](https://github.com/ceph/ceph/pull/69848), Afreen Misbah, Nizamudeen A)

- mgr/dashboard: Carbonize cluster-wide OSD flags modal ([pr#69022](https://github.com/ceph/ceph/pull/69022), Sagar Gopale)

- mgr/dashboard: Combining Quorum tables data on Monitors page ([pr#69534](https://github.com/ceph/ceph/pull/69534), Devika Babrekar)

- mgr/dashboard: fix bind address regression from CherryPy isolation ([pr#69715](https://github.com/ceph/ceph/pull/69715), Afreen Misbah)

- mgr/dashboard: fix errors after PR merge https://github<span></span>.com/ceph/ceph/pull/68566 ([pr#70184](https://github.com/ceph/ceph/pull/70184), Tomer Haskalovitch)

- mgr/dashboard: Fix for EC profile creation modal scrollbar ([pr#69661](https://github.com/ceph/ceph/pull/69661), Devika Babrekar)

- mgr/dashboard: Fix username validation for special characters by URL-encoding user lookup requests ([pr#69953](https://github.com/ceph/ceph/pull/69953), Aashish Sharma)

- mgr/dashboard: fix zone creation in rgw service creation form ([pr#69705](https://github.com/ceph/ceph/pull/69705), Aashish Sharma)

- mgr/dashboard: introduce details card component ([pr#67633](https://github.com/ceph/ceph/pull/67633), Naman Munet, Nizamudeen A)

- mgr/dashboard: introduce NvmeofCLICommand's success\_message\_template and success\_message\_map parameters to allow meaningful success messages ([pr#67964](https://github.com/ceph/ceph/pull/67964), Tomer Haskalovitch)

- mgr/dashboard: introduce traddr for backward compatibility ([pr#68566](https://github.com/ceph/ceph/pull/68566), Tomer Haskalovitch)

- mgr/dashboard: NVMeoF backports ([pr#70271](https://github.com/ceph/ceph/pull/70271), Vallari Agrawal, Tomer Haskalovitch)

- mgr/dashboard: rbd-mirroring - hide create/import token buttons for ([pr#69951](https://github.com/ceph/ceph/pull/69951), Aashish Sharma)

- mgr/dashboard: skip the table when an nvmeof cli result has no columns ([pr#69709](https://github.com/ceph/ceph/pull/69709), Kefu Chai)

- mgr/nvmeof: change pool application to nvmeof-meta instead of rbd ([pr#70444](https://github.com/ceph/ceph/pull/70444), Tomer Haskalovitch)

- mgr/pg\_autoscaler: Add 'osd pool get threshold' command which returns the current threshold value ([pr#68692](https://github.com/ceph/ceph/pull/68692), Connor Fawcett)

- mgr/smb: fix incorrect referenced variable ([pr#69150](https://github.com/ceph/ceph/pull/69150), Xavi Hernandez)

- mgr/snap\_schedule: restrict retention period multipliers set ([pr#67265](https://github.com/ceph/ceph/pull/67265), Milind Changire)

- mgr: filter root logger fallback ([pr#69927](https://github.com/ceph/ceph/pull/69927), Matthew N Heler)

- mgr: handle SIGTERM/SIGINT in standby mgr to avoid CEPHADM\_FAILED\_DAEMON ([pr#69780](https://github.com/ceph/ceph/pull/69780), Nitzan Mordechai)

- mgr: Properly set description in labeled get\_perf\_schema\_python ([pr#69818](https://github.com/ceph/ceph/pull/69818), stzuraski898)

- mgr: replace deprecated PyImport\_ImportModuleNoBlock with PyImport\_ImportModule ([pr#69665](https://github.com/ceph/ceph/pull/69665), Kefu Chai)

- mon/config: trim whitespace in config target ([pr#69803](https://github.com/ceph/ceph/pull/69803), Nitzan Mordechai)

- mon/HealthMonitor: avoid MON\_DOWN for freshly added Monitor ([pr#67323](https://github.com/ceph/ceph/pull/67323), Anoop C S, Patrick Donnelly)

- mon/MonClient: check stopping for auth request handling ([pr#68508](https://github.com/ceph/ceph/pull/68508), Patrick Donnelly)

- mon/OSDMonitor: remove unused crush rules after erasure code pools deleted ([pr#69075](https://github.com/ceph/ceph/pull/69075), Nitzan Mordechai)

- mon: fix ConnectionTracker::notify\_rank\_removed ([pr#69720](https://github.com/ceph/ceph/pull/69720), Kamoltat (Junior) Sirivadhna)

- monitoring: Add subvolume dashboard ([pr#67592](https://github.com/ceph/ceph/pull/67592), Ankush Behl, Aashish Sharma)

- neorados/cls/log: fix infinite trim loop on empty data log shards ([pr#69113](https://github.com/ceph/ceph/pull/69113), Oguzhan Ozmen)

- node-proxy: atollon hardware monitoring (FCM stats, temperatures, fan speed<span></span>.<span></span>.) ([pr#69708](https://github.com/ceph/ceph/pull/69708), Guillaume Abrioux)

- nvmeof: Change the NVMEOF image version to 1<span></span>.7 ([pr#69980](https://github.com/ceph/ceph/pull/69980), Gil Bregman)

- nvmeofgw : do not process starting  beacons from GWs in DELETING state ([pr#69025](https://github.com/ceph/ceph/pull/69025), Leonid Chernin)

- nvmeofgw: delay failback ([pr#69236](https://github.com/ceph/ceph/pull/69236), Leonid Chernin)

- nvmeofgw:fix forcing unavailable gw exit by sending ([pr#69518](https://github.com/ceph/ceph/pull/69518), Leonid Chernin)

- os/bluestore: Fix BlueFS WAL envelope mode rendering write buffer misalignment ([pr#68426](https://github.com/ceph/ceph/pull/68426), Adam Kupczyk, Igor Fedotov)

- osd/ECTransaction: fix truncate+write planning for EC shard sizes ([pr#70249](https://github.com/ceph/ceph/pull/70249), Alex Ainscow)

- osd/PeeringState: add perf counters for PG rebuild times ([pr#69965](https://github.com/ceph/ceph/pull/69965), Sridhar Seshasayee)

- osd/PrimaryLogPG: encode an empty data\_bl for empty sparse reads ([pr#67357](https://github.com/ceph/ceph/pull/67357), Ilya Dryomov)

- osd/scheduler: Classify subOp reads according to op priority for mClock ([pr#69773](https://github.com/ceph/ceph/pull/69773), Sridhar Seshasayee)

- osd/scrub: 'repairing' scrubs allowed at all times ([pr#69160](https://github.com/ceph/ceph/pull/69160), Ronen Friedman)

- osd: Fix condition for rolling forward pg log entries ([pr#69575](https://github.com/ceph/ceph/pull/69575), Matty Williams)

- osd: prevent OSDMap::check\_health() from asserting due to new OSDs found in subtree ([pr#68865](https://github.com/ceph/ceph/pull/68865), Radoslaw Zarzynski)

- osdc: deliver neorados completions to associated executor ([pr#69742](https://github.com/ceph/ceph/pull/69742), Radoslaw Zarzynski, Shilpa Jagannath, Casey Bodley)

- pybind/cephfs, mgr/volumes: introduce non-recursive rmtree(), refactor purge() to use it and add MDS optimizations ([pr#65812](https://github.com/ceph/ceph/pull/65812), Rishabh Dave)

- python-common: multi-line for yaml ([pr#68579](https://github.com/ceph/ceph/pull/68579), Timothy Q Nguyen)

- qa/cephfs: increase clones for test\_for\_6\_ongoing\_clones ([pr#68645](https://github.com/ceph/ceph/pull/68645), Rishabh Dave)

- qa/rgw/upgrade: remove rocky from reef upgrade ([pr#69845](https://github.com/ceph/ceph/pull/69845), Casey Bodley)

- qa/rgw: remove ragweed from verify subsuite ([pr#69115](https://github.com/ceph/ceph/pull/69115), Casey Bodley)

- qa/standalone: fix/improve bluefs tests ([pr#67885](https://github.com/ceph/ceph/pull/67885), Igor Fedotov)

- qa/suite/rados/encoder: update release N-2 for ceph-dencoder tests ([pr#67176](https://github.com/ceph/ceph/pull/67176), Nitzan Mordechai, Kefu Chai)

- qa/suites/nvmeof: set beacon grace and connect panic ([pr#69338](https://github.com/ceph/ceph/pull/69338), Vallari Agrawal)

- qa/suites/rados: temporarily disable ceph-post-file test ([pr#68610](https://github.com/ceph/ceph/pull/68610), Laura Flores)

- qa/suites/rbd/valgrind: pin to centos\_9<span></span>.stream instead of rpm\_latest ([pr#70131](https://github.com/ceph/ceph/pull/70131), Ilya Dryomov)

- qa/suites/upgrade: ignore fs down variant ([pr#70403](https://github.com/ceph/ceph/pull/70403), Patrick Donnelly)

- qa/tasks/keystone: restart mariadb for rocky and alma linux too ([pr#67542](https://github.com/ceph/ceph/pull/67542), Kyr Shatskyy)

- qa/tasks/mgr: test\_module\_selftest set influx hostname to avoid warnings ([pr#67801](https://github.com/ceph/ceph/pull/67801), Nitzan Mordechai)

- qa/tasks/thrashosds-health: fine tune ignorelist for degraded and undersized pgs ([pr#67338](https://github.com/ceph/ceph/pull/67338), Laura Flores)

- qa/tests: Add client-upgrade-tentacle-umbrella test ([pr#69888](https://github.com/ceph/ceph/pull/69888), Yuri Weinstein)

- qa: fix nvmeof upgrade from v20<span></span>.2<span></span>.0 ([pr#69729](https://github.com/ceph/ceph/pull/69729), Vallari Agrawal)

- qa: ignore evicted client warnings for singletone bluestore ([pr#69377](https://github.com/ceph/ceph/pull/69377), Nitzan Mordechai)

- qa: ignore expected MON\_DOWN ([pr#68515](https://github.com/ceph/ceph/pull/68515), Patrick Donnelly)

- qa: pykmip task defaults to ceph fork ([pr#70091](https://github.com/ceph/ceph/pull/70091), Casey Bodley)

- rbd-mirror: prune obsolete primary mirror snapshots after relocation ([pr#69762](https://github.com/ceph/ceph/pull/69762), Miki Patel, Prasanna Kumar Kalever)

- Revive nvme module ([pr#67933](https://github.com/ceph/ceph/pull/67933), Laura Flores, Redouane Kachach, Vallari Agrawal, Avan Thakkar, Tomer Haskalovitch)

- rgw/beast: add ssl\_ciphersuites option for tls 1<span></span>.3 ([pr#69178](https://github.com/ceph/ceph/pull/69178), Casey Bodley)

- rgw/bucket-logging: handle SigV2 presigned URLs ([pr#68968](https://github.com/ceph/ceph/pull/68968), Nithya Balachandran)

- rgw/datalog: Remove use of 'detached' in `rgw\_log\_backing` watch ([pr#69967](https://github.com/ceph/ceph/pull/69967), Adam C. Emerson)

- rgw/gc: mark rgw\_gc\_max\_objs as startup-only ([pr#68993](https://github.com/ceph/ceph/pull/68993), Matthew N. Heler)

- rgw/http: use a dedicated mutex for reqs\_change\_state ([pr#69935](https://github.com/ceph/ceph/pull/69935), Matthew N. Heler)

- rgw/iam: fix NotEquals handling for multiple values ([pr#67214](https://github.com/ceph/ceph/pull/67214), liubingrun)

- rgw/iam: match value of Null condition ([pr#68444](https://github.com/ceph/ceph/pull/68444), Casey Bodley)

- rgw/kafka: add mTLS client certificate auth support for Kafka notifications ([issue#67427](http://tracker.ceph.com/issues/67427), [pr#69216](https://github.com/ceph/ceph/pull/69216), Jan Radon, Matthew N. Heler)

- rgw/lc: Warn against changing rgw\_lc\_max\_objs once lifecycle is in use ([pr#69787](https://github.com/ceph/ceph/pull/69787), Matthew N. Heler)

- rgw/lua: Add Lua functionality for blocking requests ([pr#68599](https://github.com/ceph/ceph/pull/68599), mertsunacoglu)

- rgw/notification: Prevent reserved\_size leak by decrementing overhead on commit/abort ([pr#67576](https://github.com/ceph/ceph/pull/67576), Krunal Chheda, kchheda3)

- rgw/notify: fix reading the entries in a loop ([pr#66491](https://github.com/ceph/ceph/pull/66491), Yuval Lifshitz, Nithya Balachandran, N Balachandran)

- rgw/restore: take the hash mod HASH\_PRIME when picking a shard ([pr#69607](https://github.com/ceph/ceph/pull/69607), Matthew N. Heler)

- rgw/rgw\_lua\_utils: fix memory leak in luaL\_error() formatting ([pr#70018](https://github.com/ceph/ceph/pull/70018), Kefu Chai)

- rgw/s3: fix PutObject's canned\_acl comparisons for BlockPublicAcls ([pr#69480](https://github.com/ceph/ceph/pull/69480), Casey Bodley)

- rgw/sns: ListTopics uses account root arn for policy evaluation ([pr#69273](https://github.com/ceph/ceph/pull/69273), Casey Bodley)

- rgw: `account rm --purge-data` can delete users/roles/groups/oidcs too ([pr#68059](https://github.com/ceph/ceph/pull/68059), Casey Bodley)

- rgw: avoid doubled ARN in GetBucketReplication for pre-existing data ([pr#69024](https://github.com/ceph/ceph/pull/69024), Lumir Sliva)

- rgw: Fix crashes on realm reload ([pr#70262](https://github.com/ceph/ceph/pull/70262), Lumir Sliva, Adam C. Emerson, Oguzhan Ozmen)

- rgw: fix overflow of outstanding counter in SimpleThrottler ([pr#67692](https://github.com/ceph/ceph/pull/67692), Xinying Song)

- rgw: implement CopyObject for encrypted objects ([pr#69277](https://github.com/ceph/ceph/pull/69277), Matthew Heler, Casey Bodley, Matthew N. Heler, Seena Fallah)

- rgw: ListRoles returns "Access Denied" for a regular user with valid allow policy ([pr#68028](https://github.com/ceph/ceph/pull/68028), Theofilos Mouratidis)

- rgw: return an etag header for all successful complete-multipart ([pr#70108](https://github.com/ceph/ceph/pull/70108), Matt Benjamin)

- rgw: RGWSI\_Notify drains the finisher before deleting RGWWatchers ([pr#66522](https://github.com/ceph/ceph/pull/66522), Casey Bodley)

- rgw: stop crashing when an admin tries to assume a nonexistent role ([pr#69001](https://github.com/ceph/ceph/pull/69001), Matthew N. Heler)

- rgw: use local error code in handle\_individual\_object() ([pr#69740](https://github.com/ceph/ceph/pull/69740), Casey Bodley)

- rgwlc: fix removal of delete markers (SAL) ([pr#69543](https://github.com/ceph/ceph/pull/69543), Matt Benjamin)

- test/ceph-helpers: Pass timeout and add timeout for commands in test\_pg\_scrub ([pr#66888](https://github.com/ceph/ceph/pull/66888), Nitzan Mordechai)

- test/kafka: support archived kafka versions ([pr#70301](https://github.com/ceph/ceph/pull/70301), Yuval Lifshitz, Adam C. Emerson)

- test/rgw/notification: fix rabbitmq dependency for rocky10 ([pr#69291](https://github.com/ceph/ceph/pull/69291), Yuval Lifshitz)

- test: rados singleton-bluestore missing mds for cephtool tests ([pr#68689](https://github.com/ceph/ceph/pull/68689), Nitzan Mordechai)
