---
title: "v20.2.5 Tentacle released"
date: "2026-11-02"
author: "Yuri Weinstein"
image: "images/title-card.png"
tags:
  - "release"
  - "tentacle"
---
This is the fifth minor release in the Tentacle series.
We recommend that all users update to this release.

Release Date
------------

November 2, 2026

## Notable Changes
---------------

Security
-----------------------

- CephX: hardened service ticket verification.

RGW (RADOS Gateway)
-----------------------

- Added AES-256-GCM support for server-side encryption.
- Added support for a global CORS rule, and CORS rules are now matched the way Amazon S3 matches them.
- Added `radosgw-admin bucket suspend` and `unsuspend` commands.
- Added `--shard-id` support to `radosgw-admin gc process` and `gc list`.
- `radosgw-admin bilog trim` now requires `--yes-i-really-mean-it`.
- STS Lite is deprecated for Tentacle.
- Fixed conditional writes on versioning-suspended buckets.
- Fixed SigV4 signature handling so `Content-Type` is no longer always required in the signature and `x-amz-content-sha256` need not be a signed header.
- S3 `GetUsage` now reads the user usage log.
- Added Keystone scope information to ops logging.
- Fixed several multisite issues: bucket object-lock sync, bucket reshard racing with index updates, and bilog autotrim on archive zones and stale bucket instance metadata.

RADOS / OSD / BlueStore
-----------------------

- BlueStore: fixed unsharing blobs on remove, stray spanning blobs produced by `ExtentMap::reshard`, onode cache stalls, and expanded space being added to the allocator after allocmap recovery.
- BlueStore: BlueFS spillover cleaner improvements.
- Autoscaler: PG autoscaling is now allowed for overlapped CRUSH roots, and PG distribution is fixed.
- Scrub now auto-corrects accounting-only stat mismatches.
- mClock: bounded the `high_priority` queue drain to prevent starvation.
- `pg_upmap_primary` mappings are now removed for PG merge targets.
- The read balancer no longer aborts on float rounding.
- Reverted the `msg/async/ProtocolV2` connection-speedup and netsplit grace period change.

CephFS
-----------------------

- MDS now persists the session `auth_name` in the `ESession` journal event.
- The client accounts for mixed quotas in `statfs`.
- `cephfs-journal-tool` can now scan and flush the journal in batches.
- Fixed `ceph fs perf stats` handling of the `json-pretty` output format.

RBD
-----------------------

- It's possible to specify the source cluster's `mon_host` and `key` for
  `native` format migration via the migration spec now.  This eliminates the
  dependency on a `<cluster-name>.conf` file in a known location, which is
  rather rigid and also challenging to disseminate in some environments.  The
  key can be embedded in the migration spec or just referenced from there while
  stored in the MON config-key store.
- Fixed a use-after-free in trash purge on image open error.
- Fixed `list_snaps()` handling of non-existent groups in `pybind/rbd`.

cephadm / NVMe-oF
-----------------------

- Added a command to send signals to daemons.
- Upgrades onto hosts whose CPU cannot run the target release are now blocked.
- NVMe-oF gateways are disabled and enabled around host maintenance.
- Added CNC and Prometheus frequency fields to the NVMe-oF spec file, `--keep-connections` to the NVMe-oF CLI, and `--force` to the NVMe-oF CLI `delete kmip server` command.
- Fixed several NVMe-oF gateway monitor issues, including stretched-cluster relocate and beacon timeouts for gateways in the Created state.

Dashboard
-----------------------

- Upgraded Angular (19, then 20.3.29).
- Backported the notification panel, overview page fixes, and a batch of other dashboard fixes.
- OAuth2 SSO configuration fixes.

Platform and Packaging
-----------------------

- Ubuntu 24.04 is now a supported distro and container host.
- Builds now use FUSE 3, and the C standard moved from C99 to C11.
- s390x CRC assembly no longer requires an ELF executable stack.

## Changelog

- auth/cephx: harden service ticket verification ([pr#72127](https://github.com/ceph/ceph/pull/72127), Dan van der Ster, Matthew Heler)

- blk/kernel : skip AIO thread for devices with size < block\_size ([pr#70381](https://github.com/ceph/ceph/pull/70381), Jaya Prakash)

- blk:Warning added for discard queue overflow ([pr#71602](https://github.com/ceph/ceph/pull/71602), Jaya Prakash)

- bluestore: Fix unsharing blobs on remove ([pr#70488](https://github.com/ceph/ceph/pull/70488), Adam Kupczyk)

- ceph-objectstore-tool: update clear-snapset command doc ([pr#66918](https://github.com/ceph/ceph/pull/66918), Ronen Friedman, Naveen Naidu)

- ceph<span></span>.spec<span></span>.in: build with fuse 3 ([pr#65813](https://github.com/ceph/ceph/pull/65813), Andreas Stieger)

- cephadm/smb: Bind mount /run with 0755 ([pr#69514](https://github.com/ceph/ceph/pull/69514), Anoop C S)

- cephadm: add command to send signals to daemons ([pr#65590](https://github.com/ceph/ceph/pull/65590), Adam King)

- cephadm: disable/enable NVMe-oF gateways during host maintenance ([pr#70414](https://github.com/ceph/ceph/pull/70414), Alexander Indenbaum)

- cephadm: pass wal/db slot count to ceph-volume ([pr#65597](https://github.com/ceph/ceph/pull/65597), Ksawery Dziekoński)

- cephfs: fix monclient not subscribed monmap/config ([pr#66468](https://github.com/ceph/ceph/pull/66468), Shaohui Wang)

- client: account for mixed quotas in statfs ([pr#66470](https://github.com/ceph/ceph/pull/66470), Christopher Hoffman)

- cmake: update C standard from C99 to C11 ([pr#67743](https://github.com/ceph/ceph/pull/67743), Edwin Rodriguez)

- common: drop stack singleton object of temp messenger for foreground ceph daemons ([pr#66896](https://github.com/ceph/ceph/pull/66896), dongdong tao)

- common: Log when we leak and disallow inlining ([pr#69975](https://github.com/ceph/ceph/pull/69975), Brad Hubbard)

- dashboard: use metadata = event<span></span>.get('refs', {}) instead of dict(event<span></span>.get('refs', {})) ([pr#70225](https://github.com/ceph/ceph/pull/70225), Aarti Dhikale)

- doc/cephadm: document the cephfs-proxy sidecar ([pr#71266](https://github.com/ceph/ceph/pull/71266), Emmanuel Ameh)

- doc/cephadm: fix spec webhook key name in services/monitoring<span></span>.rst ([pr#71426](https://github.com/ceph/ceph/pull/71426), Ville Ojamo)

- doc/cephfs: Remove spaces from command ([pr#68295](https://github.com/ceph/ceph/pull/68295), Zac Dover)

- doc/man: document ceph-bluestore-tool set-label-key and rm-label-key ([pr#71245](https://github.com/ceph/ceph/pull/71245), Akshay Nazare)

- doc/rados: cephx upgrade OSD key rotation step to update osd\_key bluestore label ([pr#71226](https://github.com/ceph/ceph/pull/71226), Adam King)

- doc/rados: fix command syntax in add-or-rm-mons<span></span>.rst ([pr#68251](https://github.com/ceph/ceph/pull/68251), Ville Ojamo)

- doc/radosgw: deprecate STS Lite for tentacle ([pr#66054](https://github.com/ceph/ceph/pull/66054), Casey Bodley)

- doc/radosgw: document account-root for PUT and POST /admin/user ([pr#68770](https://github.com/ceph/ceph/pull/68770), Casey Bodley)

- doc/radosgw: Small improvements in s3\_objects\_dedup<span></span>.rst ([pr#70545](https://github.com/ceph/ceph/pull/70545), Ville Ojamo)

- doc: correct inverted logic for health warning check ([pr#71229](https://github.com/ceph/ceph/pull/71229), Patrick Donnelly)

- doc: document ceph nvmeof CLI subcommands for target configuration ([pr#71268](https://github.com/ceph/ceph/pull/71268), Emmanuel Ameh, oduameh)

- doc: remove past release notes ([pr#71471](https://github.com/ceph/ceph/pull/71471), Patrick Donnelly, Ville Ojamo)

- erasure-code/clay: decode sub-chunks in place ([pr#72182](https://github.com/ceph/ceph/pull/72182), Lumir Sliva)

- fix make check / API / cli / qa breakage from the cephx (CVE-2025-30156) merge ([pr#71191](https://github.com/ceph/ceph/pull/71191), David Galloway)

- fix unreachable code path ([pr#65695](https://github.com/ceph/ceph/pull/65695), Kushal Deb)

- libcephfs: convert ceph errno to host-based errno ([pr#65826](https://github.com/ceph/ceph/pull/65826), Rishabh Dave)

- librbd/cache/pwl: cancel periodic\_stats timer before perf\_stop() ([pr#70425](https://github.com/ceph/ceph/pull/70425), Sun Yuechi)

- librbd/migration/NativeFormat: support specifying mon\_host and key via spec ([pr#70285](https://github.com/ceph/ceph/pull/70285), Ilya Dryomov, Leonid Chernin)

- librbd: fix use-after-free in trash purge on image open error ([pr#70428](https://github.com/ceph/ceph/pull/70428), Sun Yuechi)

- mclock\_common, mClockScheduler: Bound high\_priority drain to prevent starvation ([pr#72029](https://github.com/ceph/ceph/pull/72029), Sridhar Seshasayee)

- mds/Server: return after responding on error paths ([pr#70748](https://github.com/ceph/ceph/pull/70748), Sun Yuechi)

- mds: persist session auth\_name in ESession journal event ([pr#69262](https://github.com/ceph/ceph/pull/69262), Dhairya Parmar)

- mgr, osd, mon: remove pg\_upmap\_primary mappings for PG merge targets ([pr#71049](https://github.com/ceph/ceph/pull/71049), Laura Flores)

- mgr/ActivePyModules: fix dangling string\_view in get\_perf\_schema\_python ([pr#68107](https://github.com/ceph/ceph/pull/68107), Nitzan Mordechai)

- mgr/ActivePyModules: refactor perf schema section management to use RAII ([pr#70503](https://github.com/ceph/ceph/pull/70503), stzuraski898)

- mgr/cephadm/nvmeof: Add fields for prometheus frequency to NVMEOF spec file ([pr#65552](https://github.com/ceph/ceph/pull/65552), Gil Bregman)

- mgr/cephadm: Add CNC fields to NVMEoF spec file ([pr#71026](https://github.com/ceph/ceph/pull/71026), Gil Bregman)

- mgr/cephadm: block upgrades onto hosts whose CPU cannot run the target release ([pr#72513](https://github.com/ceph/ceph/pull/72513), David Galloway)

- mgr/cephadm: drop orphaned noautoscale cleanup in \_mark\_upgrade\_complete ([pr#71206](https://github.com/ceph/ceph/pull/71206), David Galloway)

- mgr/cephadm: fix custom alertmanager webhooks ([pr#64693](https://github.com/ceph/ceph/pull/64693), Adam King)

- mgr/cephadm: set mgr cap for NVMeoF to allow cmd "service dump" ([pr#70610](https://github.com/ceph/ceph/pull/70610), Vallari Agrawal)

- mgr/cephadm: show NO DATA when a host is missing a hardware category ([pr#71726](https://github.com/ceph/ceph/pull/71726), Guillaume Abrioux)

- mgr/cephadm: suppress CEPHADM\_FAILED\_DAEMON for services being removed ([pr#70117](https://github.com/ceph/ceph/pull/70117), Avan Thakkar)

- mgr/cephadm: update osdspec\_affinity bdev label on set-spec-affinity ([pr#71732](https://github.com/ceph/ceph/pull/71732), Guillaume Abrioux)

- mgr/crash: fix race in do\_post() ([pr#72275](https://github.com/ceph/ceph/pull/72275), Nitzan Mordechai)

- mgr/DaemonServer: erase daemon\_connections ref on reset for all peer types ([pr#71009](https://github.com/ceph/ceph/pull/71009), Sunnatillo)

- mgr/dashboard: Add --keep-connections parameter to NVMEoF CLI ([pr#71386](https://github.com/ceph/ceph/pull/71386), Gil Bregman)

- mgr/dashboard: add account name duplicate check ([pr#70063](https://github.com/ceph/ceph/pull/70063), Naman Munet)

- mgr/dashboard: Add force parameter to NVMEoF CLI delete kmip server command ([pr#71314](https://github.com/ceph/ceph/pull/71314), Gil Bregman)

- mgr/dashboard: add more html lint rules and fixer ([pr#71217](https://github.com/ceph/ceph/pull/71217), Nizamudeen A, Afreen Misbah)

- mgr/dashboard: add validation for username ([pr#70325](https://github.com/ceph/ceph/pull/70325), Sagar Gopale)

- mgr/dashboard: backport notification panel to tentacle ([pr#70460](https://github.com/ceph/ceph/pull/70460), Afreen Misbah, Shashiranjan singh, Shashiranjan Singh, Aryan-coder06, Aashish Sharma, Anikait Sehwag, Abhishek Desai, Naman Munet)

- mgr/dashboard: Backport of overview page fixes ([pr#70286](https://github.com/ceph/ceph/pull/70286), Afreen Misbah)

- mgr/dashboard: Batch backport ([pr#70670](https://github.com/ceph/ceph/pull/70670), Afreen Misbah, Naman Munet, Sagar Gopale, Dnyaneshwari Talwekar, Anurag Raut, Pedro Gonzalez Gomez)

- mgr/dashboard: bump angular 20<span></span>.3<span></span>.29 ([pr#72483](https://github.com/ceph/ceph/pull/72483), Afreen Misbah, Nizamudeen A)

- mgr/dashboard: disable ibm telemetry on CI env ([pr#70478](https://github.com/ceph/ceph/pull/70478), Nizamudeen A)

- mgr/dashboard: fix osd\_removal status dict serialization ([pr#71324](https://github.com/ceph/ceph/pull/71324), Nizamudeen A)

- mgr/dashboard: fix rgw-accounts unit test failure ([pr#71270](https://github.com/ceph/ceph/pull/71270), Nizamudeen A)

- mgr/dashboard: fix stale metrics in hardware dashboards ([pr#70584](https://github.com/ceph/ceph/pull/70584), Afreen Misbah)

- mgr/dashboard: fix unncessary traceback when bucket not exist ([pr#70174](https://github.com/ceph/ceph/pull/70174), Nizamudeen A)

- mgr/dashboard: fix-user-creation-validation ([pr#69979](https://github.com/ceph/ceph/pull/69979), Sagar Gopale)

- mgr/dashboard: hide number spinners for fixed priority values ([pr#70772](https://github.com/ceph/ceph/pull/70772), Sagar Gopale)

- mgr/dashboard: multisite sync-policy page should include daemon selection ([pr#70065](https://github.com/ceph/ceph/pull/70065), Naman Munet)

- mgr/dashboard: oauth2 sso configuration fixes and oauth2-proxy prerequisit ([pr#68895](https://github.com/ceph/ceph/pull/68895), Pedro Gonzalez Gomez, Alexandre Jardon)

- mgr/dashboard: set MOTD fails on FIPS enabled systems ([pr#70374](https://github.com/ceph/ceph/pull/70374), Aashish Sharma)

- mgr/dashboard: skip RGW daemons whose frontend is unreachable ([pr#72046](https://github.com/ceph/ceph/pull/72046), Matthew N. Heler)

- mgr/dashboard: Stale RGW user/account metadata cache in mgr after delete and recreate ([pr#70195](https://github.com/ceph/ceph/pull/70195), Naman Munet)

- mgr/dashboard: tolerate nodeenv leaving no src directory behind ([pr#72168](https://github.com/ceph/ceph/pull/72168), David Galloway)

- mgr/dashboard: Update nvmeof proto/submodule to 1<span></span>.7<span></span>.23 ([pr#71333](https://github.com/ceph/ceph/pull/71333), Vallari Agrawal)

- mgr/dashboard: upgrade angular to 19 ([pr#69763](https://github.com/ceph/ceph/pull/69763), Nizamudeen A)

- mgr/rook: don't leak a watcher thread per orchestrator call ([pr#71754](https://github.com/ceph/ceph/pull/71754), Kefu Chai)

- mgr/smb: Allow whitespace in share login names ([pr#66595](https://github.com/ceph/ceph/pull/66595), Anoop C S)

- mgr/smb: fix sqlite3<span></span>.InternalError crash on lost RADOS lock ([pr#71321](https://github.com/ceph/ceph/pull/71321), Nitzan Mordechai)

- mgr/smb: gracefully handle transient sqlitedb errors ([pr#70115](https://github.com/ceph/ceph/pull/70115), Avan Thakkar)

- Mgr: Allow autoscaling for overlapped roots + mgr: Fix autoscaling PG distribution ([pr#70730](https://github.com/ceph/ceph/pull/70730), Eric Zhang)

- mgr: change cleanup and scanning cephfs connection logs to be less noisy ([pr#69096](https://github.com/ceph/ceph/pull/69096), Indira Sawant, Omid Yoosefi)

- mgr: don't record a crash dump for NotImplementedError from dispatch\_remote ([pr#71041](https://github.com/ceph/ceph/pull/71041), Nitzan Mordechai, Sebastian Marschke)

- mgr: fix PyObject leak in the remote() pickle calls ([pr#69857](https://github.com/ceph/ceph/pull/69857), Kefu Chai)

- mgr: forward the root-logger fallback at the record's own level ([pr#70960](https://github.com/ceph/ceph/pull/70960), Kefu Chai)

- mon: surface data dir + db size as perf counters ([pr#71149](https://github.com/ceph/ceph/pull/71149), Lumir Sliva)

- monitoring: Rename Ceph Object - Sync Overview - Replication (objects) from Source Zone ([pr#70269](https://github.com/ceph/ceph/pull/70269), Aashish Sharma)

- node-proxy: don't crash on empty Redfish logout ([pr#71728](https://github.com/ceph/ceph/pull/71728), Guillaume Abrioux)

- nvmeofgw: arm beacon timeouts for GWs in Created state ([pr#70319](https://github.com/ceph/ceph/pull/70319), Leonid Chernin)

- nvmeofgw: stop proposing a new epoch for healthy locations ([pr#71997](https://github.com/ceph/ceph/pull/71997), Leonid Chernin)

- nvmeofgw: stretched cluster fix relocate ([pr#70321](https://github.com/ceph/ceph/pull/70321), Leonid Chernin)

- os/bluestore: BlueFS Spillover Cleaner Evolution ([pr#69249](https://github.com/ceph/ceph/pull/69249), Jaya Prakash)

- os/bluestore: do not add expanded space to allocator after allocmap recovery ([pr#70293](https://github.com/ceph/ceph/pull/70293), Igor Fedotov)

- os/bluestore: Fix ExtentMap::reshard produce stray spanning blobs ([pr#70487](https://github.com/ceph/ceph/pull/70487), Igor Fedotov, Adam Kupczyk)

- os/bluestore: Fix problem with onode cache causing stalls ([pr#70490](https://github.com/ceph/ceph/pull/70490), Adam Kupczyk)

- os/bluestore: Re-introduce truncation in `BlueRocksWritableFile<span></span>.Close()` ([pr#71855](https://github.com/ceph/ceph/pull/71855), Igor Fedotov, Viliam Durina)

- osd/OSDMap: don't abort on float rounding in read balancer ([pr#72026](https://github.com/ceph/ceph/pull/72026), Lumir Sliva)

- osd/PeeringState: don't clear PG rebuild latch on same-primary interval restart ([pr#70991](https://github.com/ceph/ceph/pull/70991), Sridhar Seshasayee)

- osd/PeeringState: Record the departing primary's rebuild segment on handover & survive a PG split ([pr#71671](https://github.com/ceph/ceph/pull/71671), Sridhar Seshasayee)

- osd/scrub: auto-correct accounting-only stat mismatches ([pr#70649](https://github.com/ceph/ceph/pull/70649), Ronen Friedman)

- osd: Correct missing list on divergent merge of partial writes ([pr#70570](https://github.com/ceph/ceph/pull/70570), Alex Ainscow)

- osd: Set projected\_size to current\_size on cache invalidate ([pr#72012](https://github.com/ceph/ceph/pull/72012), Alex Ainscow)

- pybind/mgr/status: drop asserts that fight the defaultdict defaults ([pr#68954](https://github.com/ceph/ceph/pull/68954), Kefu Chai)

- pybind/rbd: handle non-existent groups properly in list\_snaps() ([pr#70257](https://github.com/ceph/ceph/pull/70257), VinayBhaskar-V)

- pybind/rbd: reset element count on iterator errors ([pr#71338](https://github.com/ceph/ceph/pull/71338), Ramana Raja)

- qa,src: replace deprecated egrep/fgrep with grep -E/grep -F ([pr#71917](https://github.com/ceph/ceph/pull/71917), Lumir Sliva)

- qa/distros: add ubuntu 24<span></span>.04 as supported distro/container host ([pr#72064](https://github.com/ceph/ceph/pull/72064), Redouane Kachach, Patrick Donnelly, Adam King, Casey Bodley)

- qa/distros: ask for Rocky by major, not a point release ([pr#71194](https://github.com/ceph/ceph/pull/71194), David Galloway)

- qa/dnsmasq: use managed dnsmasq instead of editing resolv<span></span>.conf ([pr#70400](https://github.com/ceph/ceph/pull/70400), Casey Bodley, Adam C. Emerson)

- qa/multisite: fix test\_bucket\_remove false failure on bucket deletion check ([pr#70406](https://github.com/ceph/ceph/pull/70406), Shilpa Jagannath)

- qa/rgw: bump tempest version from 34<span></span>.1<span></span>.0 to 45<span></span>.0<span></span>.0 ([pr#72341](https://github.com/ceph/ceph/pull/72341), Casey Bodley, Adam C. Emerson)

- qa/suites/nvmeof/upgrade: use refresh True for wait\_for\_service ([pr#70620](https://github.com/ceph/ceph/pull/70620), Vallari Agrawal)

- qa/tasks: move smb related task funcs out of cephadm<span></span>.py to smb<span></span>.py ([pr#65890](https://github.com/ceph/ceph/pull/65890), John Mulligan)

- qa/tests: fix POOL\_FULL ignorelist pattern in upgrade tests ([pr#70508](https://github.com/ceph/ceph/pull/70508), Yuri Weinstein)

- qa/workunits/nvmeof/basic\_tests<span></span>.sh: reinstall nvme-cli for rocky10 ([pr#71374](https://github.com/ceph/ceph/pull/71374), Vallari Agrawal)

- qa/workunits/rados/test<span></span>.sh: add timeout mechanism and more info to workloads with parallel tests ([pr#65059](https://github.com/ceph/ceph/pull/65059), Kamoltat Sirivadhna, Laura Flores)

- qa: Add new task module template<span></span>.py ([pr#65756](https://github.com/ceph/ceph/pull/65756), John Mulligan)

- qa: fix mds\_upgrade\_sequence cephadm bootstrap failure (roleless + mon roles) ([pr#72538](https://github.com/ceph/ceph/pull/72538), David Galloway)

- qa: fix misleading "in cluster log" failures during cluster log scan ([pr#68447](https://github.com/ceph/ceph/pull/68447), Redouane Kachach)

- qa: get\_rand\_pg\_acting\_set needs to wait for pool to create PGs ([pr#70516](https://github.com/ceph/ceph/pull/70516), Bill Scales)

- qa: Handle TypeError in test\_filelock ([pr#69094](https://github.com/ceph/ceph/pull/69094), Karthik U S)

- radosgw-admin: 'account rm --purge-data' deletes oidc by account id ([pr#71530](https://github.com/ceph/ceph/pull/71530), Casey Bodley)

- radosgw-admin: warn before changing quota metadata on secondary zones ([pr#71354](https://github.com/ceph/ceph/pull/71354), Casey Bodley)

- Revert "Merge PR #71699 into tentacle" ([pr#72599](https://github.com/ceph/ceph/pull/72599), Patrick Donnelly)

- Revert "Merge PR #72012 into tentacle" ([pr#72650](https://github.com/ceph/ceph/pull/72650), Alex Ainscow)

- Revert: "only msgr commits in msg/async/ProtocolV2: Speed up connection logic when peer restarts & Added Netsplit Grace Period" ([pr#71847](https://github.com/ceph/ceph/pull/71847), Kamoltat (Junior) Sirivadhna)

- rgw/admin: add --yes-i-really-mean-it gate to bilog trim admin command ([pr#72404](https://github.com/ceph/ceph/pull/72404), Oguzhan Ozmen)

- rgw/admin: fix infinite loop in role list pagination ([pr#71310](https://github.com/ceph/ceph/pull/71310), Ashish Singh)

- rgw/admin: guard bilog autotrim on non-exporting (archive) zones ([pr#70457](https://github.com/ceph/ceph/pull/70457), Oguzhan Ozmen)

- rgw/amqp: check the iterator before dereferencing it ([pr#71748](https://github.com/ceph/ceph/pull/71748), Kefu Chai)

- rgw/auth: Fixed Content-Type always needing to be in the signature and don't require x-amz-content-sha256 in signed headers ([pr#71364](https://github.com/ceph/ceph/pull/71364), Casey Bodley, Adam C. Emerson, Elliot Courant)

- rgw/cloud-restore: strip quotes from ETag on cloud tier fetch ([pr#71414](https://github.com/ceph/ceph/pull/71414), Matthew N. Heler)

- rgw/http: look up requests by id when applying state changes ([pr#71493](https://github.com/ceph/ceph/pull/71493), Matthew N. Heler)

- rgw/http: skip pause/resume when the request already finished ([pr#71596](https://github.com/ceph/ceph/pull/71596), Matthew N. Heler)

- rgw/lc: report x-amz-expiration only for the current version ([pr#70494](https://github.com/ceph/ceph/pull/70494), Lumir Sliva)

- rgw/lua: cache lua bytecode ([pr#70843](https://github.com/ceph/ceph/pull/70843), Nithya Balachandran)

- rgw/multisite: drain children before collect() returns error in RGWInitDataSyncStatusCoroutine() ([pr#71699](https://github.com/ceph/ceph/pull/71699), Shilpa Jagannath)

- rgw/multisite: sync bucket obj\_lock ([pr#70500](https://github.com/ceph/ceph/pull/70500), Shilpa Jagannath)

- rgw/reshard: bucket reshard may race with bucket index update ([pr#70497](https://github.com/ceph/ceph/pull/70497), Shilpa Jagannath)

- rgw/s3: don't require sse-c headers to complete a multipart upload ([pr#71842](https://github.com/ceph/ceph/pull/71842), Matthew N. Heler)

- rgw/s3: reject an empty x-amz-server-side-encryption header ([pr#71535](https://github.com/ceph/ceph/pull/71535), Matthew N. Heler)

- rgw/testing: update cpanm command to be more robust ([pr#72258](https://github.com/ceph/ceph/pull/72258), J. Eric Ivancich)

- rgw: account presigned POST bytes\_received in usage log ([pr#68959](https://github.com/ceph/ceph/pull/68959), Lumir Sliva)

- rgw: Add AES-256-GCM support for RGW server-side encryption ([pr#71238](https://github.com/ceph/ceph/pull/71238), Matthew N. Heler)

- rgw: Add Keystone scope information to ops logging ([pr#71580](https://github.com/ceph/ceph/pull/71580), Filipp Akinfiev)

- rgw: add radosgw-admin bucket suspend/unsuspend commands ([pr#71103](https://github.com/ceph/ceph/pull/71103), ramin.najarbashi)

- rgw: add support for --shard-id in gc process and gc list commands ([pr#70452](https://github.com/ceph/ceph/pull/70452), Nathan Hoad)

- RGW: add support global CORS rule ([pr#72141](https://github.com/ceph/ceph/pull/72141), Ali Masarwa)

- rgw: copy\_obj\_data() record uncompressed size for a compressed source ([pr#70241](https://github.com/ceph/ceph/pull/70241), Oguzhan Ozmen)

- rgw: fix bilog autotrim of stale bucket<span></span>.instance metadata after peer deletion ([pr#70456](https://github.com/ceph/ceph/pull/70456), Oguzhan Ozmen)

- rgw: fix cloud tier multipart resume starting at part number 0 ([pr#71415](https://github.com/ceph/ceph/pull/71415), Matthew N. Heler)

- rgw: fix conditional writes on versioning-suspended buckets ([pr#72050](https://github.com/ceph/ceph/pull/72050), Matthew N. Heler)

- rgw: fix frontend crash in abort\_early() on client disconnect ([pr#68982](https://github.com/ceph/ceph/pull/68982), Shilpa Jagannath)

- rgw: fix log\_remove spurious -EIO on non-existent FIFO shards ([pr#70303](https://github.com/ceph/ceph/pull/70303), Shilpa Jagannath)

- rgw: fix memory leak in RGWHTTPManager thread cleanup ([pr#68957](https://github.com/ceph/ceph/pull/68957), Kefu Chai)

- rgw: fix use-after-free on cancellation in shard\_io::async\_reads() ([pr#71135](https://github.com/ceph/ceph/pull/71135), Casey Bodley)

- rgw: Lua Package management fixes ([pr#71514](https://github.com/ceph/ceph/pull/71514), Nithya Balachandran)

- rgw: match CORS rules like Amazon S3 ([pr#69647](https://github.com/ceph/ceph/pull/69647), ramin.najarbashi)

- rgw: Policy evalaution logging ([pr#70533](https://github.com/ceph/ceph/pull/70533), Adam C. Emerson)

- rgw: read user usage log in S3 GetUsage ([pr#71100](https://github.com/ceph/ceph/pull/71100), ramin.najarbashi)

- rgw: redirect to the endpoint of the bucket's zonegroup ([issue#64983](http://tracker.ceph.com/issues/64983), [pr#71522](https://github.com/ceph/ceph/pull/71522), ramin.najarbashi)

- rgw: rgw\_rest\_account<span></span>.cc: Fix quota variable types from int32\_t to int64\_t ([pr#70393](https://github.com/ceph/ceph/pull/70393), Theofilos Mouratidis)

- rgw: skip writing ObjectCache when incoming obj\_version is stale ([pr#71060](https://github.com/ceph/ceph/pull/71060), Saravanan Palanisamy)

- s390x CRC assembly not requiring ELF execstack ([pr#67478](https://github.com/ceph/ceph/pull/67478), Aliaksei Makarau)

- src/pybind/mgr: handle json-pretty output format for `ceph fs perf stats` command ([pr#69348](https://github.com/ceph/ceph/pull/69348), Neeraj Pratap Singh)

- test/encoding/readable: Add backward incompat checks ([pr#67394](https://github.com/ceph/ceph/pull/67394), Nitzan Mordechai)

- test/libcephfs: validate asynchronous write and fsync executing concurrently ([issue#71515](http://tracker.ceph.com/issues/71515), [pr#65648](https://github.com/ceph/ceph/pull/65648), Venky Shankar)

- test/mds: fix flaky RepeatedQuiesceAwait ([pr#69034](https://github.com/ceph/ceph/pull/69034), Kefu Chai)

- tools/cephfs: allow scanning and flushing journal in batches ([pr#70276](https://github.com/ceph/ceph/pull/70276), Kefu Chai, Dhairya Parmar)

- V20<span></span>.2<span></span>.4 tag ([pr#71161](https://github.com/ceph/ceph/pull/71161), Ceph Release Team, Patrick Donnelly, Adam King, Adam C. Emerson, Shilpa Jagannath, Marcus Watts, Pritha Srivastava, Yehuda Sadeh, Matan Breizman, Max Kellermann, Kamoltat Sirivadhna)

- vstart<span></span>.sh: only skip fs volume create when there's no mgr to run it ([pr#70019](https://github.com/ceph/ceph/pull/70019), Kefu Chai)

- win32\_deps\_bild: bump openssl version ([pr#71204](https://github.com/ceph/ceph/pull/71204), Lucian Petrut)
