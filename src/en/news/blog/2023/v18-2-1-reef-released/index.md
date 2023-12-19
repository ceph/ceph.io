---
title: "v18.2.1 Reef released"
date: "2023-12-18"
author: "Yuri Weinstein"
tags:
  - "release"
  - "reef"
---

This is the first backport release in the Reef series, and the first with Debian packages, for Debian Bookworm.
We recommend all users update to this release.

## Notable Changes

- RGW: S3 multipart uploads using Server-Side Encryption now replicate correctly in
  a multi-site deployment. Previously, the replicas of such objects were corrupted on
  decryption. A new command, ``radosgw-admin bucket resync encrypted multipart``, can be
  used to identify these original multipart uploads. The ``LastModified`` timestamp of
  any identified object is incremented by 1ns to cause peer zones to replicate it again.
  For multi-site deployments that make any use of Server-Side Encryption, we
  recommended running this command against every bucket in every zone after all
  zones have upgraded.

- CEPHFS: MDS now evicts clients which are not advancing their request tids (transaction IDs),
  which causes a large buildup of session metadata, resulting in the MDS going read-only due to
  the RADOS operation exceeding the size threshold. `mds_session_metadata_threshold`
  config controls the maximum size that an (encoded) session metadata can grow.

- RGW: New tools have been added to ``radosgw-admin`` for identifying and
  correcting issues with versioned bucket indexes. Historical bugs with the
  versioned bucket index transaction workflow made it possible for the index
  to accumulate extraneous "book-keeping" olh (object logical head) entries
  and plain placeholder entries. In some specific scenarios where clients made
  concurrent requests referencing the same object key, it was likely that a lot
  of extra index entries would accumulate. When a significant number of these entries are
  present in a single bucket index shard, they can cause high bucket listing
  latencies and lifecycle processing failures. To check whether a versioned
  bucket has unnecessary olh entries, users can now run ``radosgw-admin
  bucket check olh``. If the ``--fix`` flag is used, the extra entries will
  be safely removed. A distinct issue from the one described thus far, it is
  also possible that some versioned buckets are maintaining extra unlinked
  objects that are not listable from the S3/ Swift APIs. These extra objects
  are typically a result of PUT requests that exited abnormally, in the middle
  of a bucket index transaction - so the client would not have received a
  successful response. Bugs in prior releases made these unlinked objects easy
  to reproduce with any PUT request that was made on a bucket that was actively
  resharding. Besides the extra space that these hidden, unlinked objects
  consume, there can be another side effect in certain scenarios, caused by
  the nature of the failure mode that produced them, where a client of a bucket
  that was a victim of this bug may find the object associated with the key to
  be in an inconsistent state. To check whether a versioned bucket has unlinked
  entries, users can now run ``radosgw-admin bucket check unlinked``. If the
  ``--fix`` flag is used, the unlinked objects will be safely removed. Finally,
  a third issue made it possible for versioned bucket index stats to be
  accounted inaccurately. The tooling for recalculating versioned bucket stats
  also had a bug, and was not previously capable of fixing these inaccuracies.
  This release resolves those issues and users can now expect that the existing
  ``radosgw-admin bucket check`` command will produce correct results. We
  recommend that users with versioned buckets, especially those that existed
  on prior releases, use these new tools to check whether their buckets are
  affected and to clean them up accordingly.

- mgr/snap-schedule: For clusters with multiple CephFS file systems, all the
  snap-schedule commands now expect the '--fs' argument.

- RADOS: A POOL_APP_NOT_ENABLED health warning will now be reported if
  the application is not enabled for the pool irrespective of whether
  the pool is in use or not. Always tag a pool with an application
  using ``ceph osd pool application enable`` command to avoid reporting
  of POOL_APP_NOT_ENABLED health warning for that pool.
  The user might temporarily mute this warning using
  ``ceph health mute POOL_APP_NOT_ENABLED``.

- Dashboard: An overview page for RGW to show the overall status of RGW components.

- Dashboard: Added management support for RGW Multi-site and CephFS Subvolumes and groups.

- Dashboard: Fixed few bugs and issues around the new dashboard page including the broken layout,
  some metrics giving wrong values and introduced a popover to display details
  when there are HEALTH_WARN or HEALTH_ERR.

- Dashboard: Fixed several issues in Ceph dashboard on Rook-backed clusters,
  and improved the user experience on the Rook environment.

## Changelog

- <span></span>.github: Clarify checklist details ([pr#54130](https://github.com/ceph/ceph/pull/54130), Anthony D'Atri)

- [CVE-2023-43040] rgw: Fix bucket validation against POST policies ([pr#53756](https://github.com/ceph/ceph/pull/53756), Joshua Baergen)

- Adding rollback mechanism to handle bootstrap failures ([pr#53864](https://github.com/ceph/ceph/pull/53864), Adam King, Redouane Kachach)

- backport of rook orchestrator fixes and e2e automated testing ([pr#54224](https://github.com/ceph/ceph/pull/54224), Redouane Kachach)

- Bluestore: fix bluestore collection\_list latency perf counter ([pr#52950](https://github.com/ceph/ceph/pull/52950), Wangwenjuan)

- build: Remove ceph-libboost\* packages in install-deps ([pr#52769](https://github.com/ceph/ceph/pull/52769), Adam Emerson)

- ceph-volume/cephadm: support lv devices in inventory ([pr#53286](https://github.com/ceph/ceph/pull/53286), Guillaume Abrioux)

- ceph-volume: add --osd-id option to raw prepare ([pr#52927](https://github.com/ceph/ceph/pull/52927), Guillaume Abrioux)

- ceph-volume: fix a regression in `raw list` ([pr#54521](https://github.com/ceph/ceph/pull/54521), Guillaume Abrioux)

- ceph-volume: fix mpath device support ([pr#53539](https://github.com/ceph/ceph/pull/53539), Guillaume Abrioux)

- ceph-volume: fix raw list for lvm devices ([pr#52619](https://github.com/ceph/ceph/pull/52619), Guillaume Abrioux)

- ceph-volume: fix raw list for lvm devices ([pr#52980](https://github.com/ceph/ceph/pull/52980), Guillaume Abrioux)

- ceph-volume: Revert "ceph-volume: fix raw list for lvm devices" ([pr#54429](https://github.com/ceph/ceph/pull/54429), Matthew Booth, Guillaume Abrioux)

- ceph: allow xlock state to be LOCK\_PREXLOCK when putting it ([pr#53661](https://github.com/ceph/ceph/pull/53661), Xiubo Li)

- ceph\_fs<span></span>.h: add separate owner\\_{u,g}id fields ([pr#53138](https://github.com/ceph/ceph/pull/53138), Alexander Mikhalitsyn)

- ceph\_volume: support encrypted volumes for lvm new-db/new-wal/migrate commands ([pr#52875](https://github.com/ceph/ceph/pull/52875), Igor Fedotov)

- cephadm batch backport Aug 23 ([pr#53124](https://github.com/ceph/ceph/pull/53124), Adam King, Luis Domingues, John Mulligan, Redouane Kachach)

- cephadm: add a --dry-run option to cephadm shell ([pr#54220](https://github.com/ceph/ceph/pull/54220), John Mulligan)

- cephadm: add tcmu-runner to logrotate config ([pr#53122](https://github.com/ceph/ceph/pull/53122), Adam King)

- cephadm: Adding support to configure public\_network cfg section ([pr#53110](https://github.com/ceph/ceph/pull/53110), Redouane Kachach)

- cephadm: delete /tmp/cephadm-<fsid> when removing the cluster ([pr#53109](https://github.com/ceph/ceph/pull/53109), Redouane Kachach)

- cephadm: Fix extra\_container\_args for iSCSI ([pr#53010](https://github.com/ceph/ceph/pull/53010), Raimund Sacherer)

- cephadm: fix haproxy version with certain containers ([pr#53751](https://github.com/ceph/ceph/pull/53751), Adam King)

- cephadm: make custom\_configs work for tcmu-runner container ([pr#53404](https://github.com/ceph/ceph/pull/53404), Adam King)

- cephadm: run tcmu-runner through script to do restart on failure ([pr#53866](https://github.com/ceph/ceph/pull/53866), Adam King)

- cephadm: support for CA signed keys ([pr#53121](https://github.com/ceph/ceph/pull/53121), Adam King)

- cephfs-journal-tool: disambiguate usage of all keyword (in tool help) ([pr#53646](https://github.com/ceph/ceph/pull/53646), Manish M Yathnalli)

- cephfs-mirror: do not run concurrent C\_RestartMirroring context ([issue#62072](http://tracker.ceph.com/issues/62072), [pr#53638](https://github.com/ceph/ceph/pull/53638), Venky Shankar)

- cephfs: implement snapdiff ([pr#53229](https://github.com/ceph/ceph/pull/53229), Igor Fedotov, Lucian Petrut, Denis Barahtanov)

- cephfs\_mirror: correctly set top level dir permissions ([pr#53271](https://github.com/ceph/ceph/pull/53271), Milind Changire)

- client: always refresh mds feature bits on session open ([issue#63188](http://tracker.ceph.com/issues/63188), [pr#54146](https://github.com/ceph/ceph/pull/54146), Venky Shankar)

- client: correct quota check in Client::\_rename() ([pr#52578](https://github.com/ceph/ceph/pull/52578), Rishabh Dave)

- client: do not send metrics until the MDS rank is ready ([pr#52501](https://github.com/ceph/ceph/pull/52501), Xiubo Li)

- client: force sending cap revoke ack always ([pr#52507](https://github.com/ceph/ceph/pull/52507), Xiubo Li)

- client: issue a cap release immediately if no cap exists ([pr#52850](https://github.com/ceph/ceph/pull/52850), Xiubo Li)

- client: move the Inode to new auth mds session when changing auth cap ([pr#53666](https://github.com/ceph/ceph/pull/53666), Xiubo Li)

- client: trigger to flush the buffer when making snapshot ([pr#52497](https://github.com/ceph/ceph/pull/52497), Xiubo Li)

- client: wait rename to finish ([pr#52504](https://github.com/ceph/ceph/pull/52504), Xiubo Li)

- cmake: ensure fmtlib is at least 8<span></span>.1<span></span>.1 ([pr#52970](https://github.com/ceph/ceph/pull/52970), Abhishek Lekshmanan)

- Consider setting "bulk" autoscale pool flag when automatically creating a data pool for CephFS ([pr#52899](https://github.com/ceph/ceph/pull/52899), Leonid Usov)

- crimson/admin/admin\_socket: remove path file if it exists ([pr#53964](https://github.com/ceph/ceph/pull/53964), Matan Breizman)

- crimson/ertr: assert on invocability of func provided to safe\_then() ([pr#53958](https://github.com/ceph/ceph/pull/53958), Radosław Zarzyński)

- crimson/mgr: Fix config show command ([pr#53954](https://github.com/ceph/ceph/pull/53954), Aishwarya Mathuria)

- crimson/net: consolidate messenger implementations and enable multi-shard UTs ([pr#54095](https://github.com/ceph/ceph/pull/54095), Yingxin Cheng)

- crimson/net: set TCP\_NODELAY according to ms\_tcp\_nodelay ([pr#54063](https://github.com/ceph/ceph/pull/54063), Xuehan Xu)

- crimson/net: support connections in multiple shards ([pr#53949](https://github.com/ceph/ceph/pull/53949), Yingxin Cheng)

- crimson/os/object\_data\_handler: splitting right side doesn't mean splitting only one extent ([pr#54061](https://github.com/ceph/ceph/pull/54061), Xuehan Xu)

- crimson/os/seastore/backref\_manager: scan backref entries by journal seq ([pr#53939](https://github.com/ceph/ceph/pull/53939), Zhang Song)

- crimson/os/seastore/btree: should add left's size when merging levels… ([pr#53946](https://github.com/ceph/ceph/pull/53946), Xuehan Xu)

- crimson/os/seastore/cache: don't add EXIST\_CLEAN extents to lru ([pr#54098](https://github.com/ceph/ceph/pull/54098), Xuehan Xu)

- crimson/os/seastore/cached\_extent: add prepare\_commit interface ([pr#53941](https://github.com/ceph/ceph/pull/53941), Xuehan Xu)

- crimson/os/seastore/cbj: fix a potential overflow bug on segment\_seq ([pr#53968](https://github.com/ceph/ceph/pull/53968), Myoungwon Oh)

- crimson/os/seastore/collection\_manager: fill CollectionNode::decoded on clean reads ([pr#53956](https://github.com/ceph/ceph/pull/53956), Xuehan Xu)

- crimson/os/seastore/journal/cbj: generalize scan\_valid\_records() ([pr#53961](https://github.com/ceph/ceph/pull/53961), Myoungwon Oh, Yingxin Cheng)

- crimson/os/seastore/omap\_manager: correct editor settings ([pr#53947](https://github.com/ceph/ceph/pull/53947), Zhang Song)

- crimson/os/seastore/omap\_manager: fix the entry leak issue in BtreeOMapManager::omap\_list() ([pr#53962](https://github.com/ceph/ceph/pull/53962), Xuehan Xu)

- crimson/os/seastore/onode\_manager: populate value recorders of onodes to be erased ([pr#53966](https://github.com/ceph/ceph/pull/53966), Xuehan Xu)

- crimson/os/seastore/rbm: make rbm support multiple shards ([pr#53952](https://github.com/ceph/ceph/pull/53952), Myoungwon Oh)

- crimson/os/seastore/transaction\_manager: data loss issues ([pr#53955](https://github.com/ceph/ceph/pull/53955), Xuehan Xu)

- crimson/os/seastore/transaction\_manager: move intermediate\_key by "remap\_offset" when remapping the "back" half of the original pin ([pr#54140](https://github.com/ceph/ceph/pull/54140), Xuehan Xu)

- crimson/os/seastore/zbd: zbdsegmentmanager write path fixes ([pr#54062](https://github.com/ceph/ceph/pull/54062), Aravind Ramesh)

- crimson/os/seastore: add metrics about total invalidated transactions ([pr#53953](https://github.com/ceph/ceph/pull/53953), Zhang Song)

- crimson/os/seastore: create page aligned bufferptr in copy ctor of CachedExtent ([pr#54097](https://github.com/ceph/ceph/pull/54097), Zhang Song)

- crimson/os/seastore: enable SMR HDD ([pr#53935](https://github.com/ceph/ceph/pull/53935), Aravind Ramesh)

- crimson/os/seastore: fix ceph\_assert in segment\_manager<span></span>.h ([pr#53938](https://github.com/ceph/ceph/pull/53938), Aravind Ramesh)

- crimson/os/seastore: fix daggling reference of oid in SeaStore::Shard::stat() ([pr#53960](https://github.com/ceph/ceph/pull/53960), Xuehan Xu)

- crimson/os/seastore: fix in check\_node ([pr#53945](https://github.com/ceph/ceph/pull/53945), Xinyu Huang)

- crimson/os/seastore: OP\_CLONE in seastore ([pr#54092](https://github.com/ceph/ceph/pull/54092), xuxuehan, Xuehan Xu)

- crimson/os/seastore: realize lazy read in split overwrite with overwrite refactor ([pr#53951](https://github.com/ceph/ceph/pull/53951), Xinyu Huang)

- crimson/os/seastore: retire\_extent\_addr clean up ([pr#53959](https://github.com/ceph/ceph/pull/53959), Xinyu Huang)

- crimson/osd/heartbeat: Improve maybe\_share\_osdmap behavior ([pr#53940](https://github.com/ceph/ceph/pull/53940), Samuel Just)

- crimson/osd/lsan\_suppressions<span></span>.cc: Add MallocExtension::Initialize() ([pr#54057](https://github.com/ceph/ceph/pull/54057), Mark Nelson, Matan Breizman)

- crimson/osd/lsan\_suppressions: add MallocExtension::Register ([pr#54139](https://github.com/ceph/ceph/pull/54139), Matan Breizman)

- crimson/osd/object\_context: consider clones found as long as they're in SnapSet::clones ([pr#53965](https://github.com/ceph/ceph/pull/53965), Xuehan Xu)

- crimson/osd/osd\_operations: add pipeline to LogMissingRequest to sync it ([pr#53957](https://github.com/ceph/ceph/pull/53957), Xuehan Xu)

- crimson/osd/osd\_operations: consistent naming to pipeline users ([pr#54060](https://github.com/ceph/ceph/pull/54060), Matan Breizman)

- crimson/osd/pg: check if backfill\_state exists when judging objects' ([pr#53963](https://github.com/ceph/ceph/pull/53963), Xuehan Xu)

- crimson/osd/watch: Add logs around Watch/Notify ([pr#53950](https://github.com/ceph/ceph/pull/53950), Matan Breizman)

- crimson/osd: add embedded suppression ruleset for LSan ([pr#53937](https://github.com/ceph/ceph/pull/53937), Radoslaw Zarzynski)

- crimson/osd: cleanup and drop OSD::ShardDispatcher ([pr#54138](https://github.com/ceph/ceph/pull/54138), Yingxin Cheng)

- Crimson/osd: Disable concurrent MOSDMap handling ([pr#53944](https://github.com/ceph/ceph/pull/53944), Matan Breizman)

- crimson/osd: don't ignore start\_pg\_operation returned future ([pr#53948](https://github.com/ceph/ceph/pull/53948), Matan Breizman)

- crimson/osd: fix ENOENT on accessing RadosGW user's index of buckets ([pr#53942](https://github.com/ceph/ceph/pull/53942), Radoslaw Zarzynski)

- crimson/osd: fix Notify life-time mismanagement in Watch::notify\_ack ([pr#53943](https://github.com/ceph/ceph/pull/53943), Radoslaw Zarzynski)

- crimson/osd: fixes and cleanups around multi-core OSD ([pr#54091](https://github.com/ceph/ceph/pull/54091), Yingxin Cheng)

- Crimson/osd: support multicore osd ([pr#54058](https://github.com/ceph/ceph/pull/54058), chunmei)

- crimson/tools/perf\_crimson\_msgr: integrate multi-core msgr with various improvements ([pr#54059](https://github.com/ceph/ceph/pull/54059), Yingxin Cheng)

- crimson/tools/perf\_crimson\_msgr: randomize client nonce ([pr#54093](https://github.com/ceph/ceph/pull/54093), Yingxin Cheng)

- crimson/tools/perf\_staged\_fltree: fix compile error ([pr#54096](https://github.com/ceph/ceph/pull/54096), Myoungwon Oh)

- crimson/vstart: default seastore\_device\_size will be out of space f… ([pr#53969](https://github.com/ceph/ceph/pull/53969), chunmei)

- crimson: Enable tcmalloc when using seastar ([pr#54105](https://github.com/ceph/ceph/pull/54105), Mark Nelson, Matan Breizman)

- debian/control: add docker-ce as recommends for cephadm package ([pr#52908](https://github.com/ceph/ceph/pull/52908), Adam King)

- Debian: update to dh compat 12, fix more serious packaging errors, correct copyright syntax ([pr#53654](https://github.com/ceph/ceph/pull/53654), Matthew Vernon)

- doc/architecture<span></span>.rst - edit a sentence ([pr#53372](https://github.com/ceph/ceph/pull/53372), Zac Dover)

- doc/architecture<span></span>.rst - edit up to "Cluster Map" ([pr#53366](https://github.com/ceph/ceph/pull/53366), Zac Dover)

- doc/architecture: "Edit HA Auth" ([pr#53619](https://github.com/ceph/ceph/pull/53619), Zac Dover)

- doc/architecture: "Edit HA Auth" (one of several) ([pr#53585](https://github.com/ceph/ceph/pull/53585), Zac Dover)

- doc/architecture: "Edit HA Auth" (one of several) ([pr#53491](https://github.com/ceph/ceph/pull/53491), Zac Dover)

- doc/architecture: edit "Calculating PG IDs" ([pr#53748](https://github.com/ceph/ceph/pull/53748), Zac Dover)

- doc/architecture: edit "Cluster Map" ([pr#53434](https://github.com/ceph/ceph/pull/53434), Zac Dover)

- doc/architecture: edit "Data Scrubbing" ([pr#53730](https://github.com/ceph/ceph/pull/53730), Zac Dover)

- doc/architecture: Edit "HA Auth" ([pr#53488](https://github.com/ceph/ceph/pull/53488), Zac Dover)

- doc/architecture: edit "HA Authentication" ([pr#53632](https://github.com/ceph/ceph/pull/53632), Zac Dover)

- doc/architecture: edit "High Avail<span></span>. Monitors" ([pr#53451](https://github.com/ceph/ceph/pull/53451), Zac Dover)

- doc/architecture: edit "OSD Membership and Status" ([pr#53727](https://github.com/ceph/ceph/pull/53727), Zac Dover)

- doc/architecture: edit "OSDs service clients directly" ([pr#53686](https://github.com/ceph/ceph/pull/53686), Zac Dover)

- doc/architecture: edit "Peering and Sets" ([pr#53871](https://github.com/ceph/ceph/pull/53871), Zac Dover)

- doc/architecture: edit "Replication" ([pr#53738](https://github.com/ceph/ceph/pull/53738), Zac Dover)

- doc/architecture: edit "SDEH" ([pr#53659](https://github.com/ceph/ceph/pull/53659), Zac Dover)

- doc/architecture: edit several sections ([pr#53742](https://github.com/ceph/ceph/pull/53742), Zac Dover)

- doc/architecture: repair RBD sentence ([pr#53877](https://github.com/ceph/ceph/pull/53877), Zac Dover)

- doc/ceph-volume: explain idempotence ([pr#54233](https://github.com/ceph/ceph/pull/54233), Zac Dover)

- doc/ceph-volume: improve front matter ([pr#54235](https://github.com/ceph/ceph/pull/54235), Zac Dover)

- doc/cephadm/services: remove excess rendered indentation in osd<span></span>.rst ([pr#54323](https://github.com/ceph/ceph/pull/54323), Ville Ojamo)

- doc/cephadm: add ssh note to install<span></span>.rst ([pr#53199](https://github.com/ceph/ceph/pull/53199), Zac Dover)

- doc/cephadm: edit "Adding Hosts" in install<span></span>.rst ([pr#53224](https://github.com/ceph/ceph/pull/53224), Zac Dover)

- doc/cephadm: edit sentence in mgr<span></span>.rst ([pr#53164](https://github.com/ceph/ceph/pull/53164), Zac Dover)

- doc/cephadm: edit troubleshooting<span></span>.rst (1 of x) ([pr#54283](https://github.com/ceph/ceph/pull/54283), Zac Dover)

- doc/cephadm: edit troubleshooting<span></span>.rst (2 of x) ([pr#54320](https://github.com/ceph/ceph/pull/54320), Zac Dover)

- doc/cephadm: fix typo in cephadm initial crush location section ([pr#52887](https://github.com/ceph/ceph/pull/52887), John Mulligan)

- doc/cephadm: fix typo in set ssh key command ([pr#54388](https://github.com/ceph/ceph/pull/54388), Piotr Parczewski)

- doc/cephadm: update cephadm reef version ([pr#53162](https://github.com/ceph/ceph/pull/53162), Rongqi Sun)

- doc/cephfs: edit mount-using-fuse<span></span>.rst ([pr#54353](https://github.com/ceph/ceph/pull/54353), Jaanus Torp)

- doc/cephfs: write cephfs commands fully in docs ([pr#53402](https://github.com/ceph/ceph/pull/53402), Rishabh Dave)

- doc/config: edit "ceph-conf<span></span>.rst" ([pr#54463](https://github.com/ceph/ceph/pull/54463), Zac Dover)

- doc/configuration: edit "bg" in mon-config-ref<span></span>.rst ([pr#53347](https://github.com/ceph/ceph/pull/53347), Zac Dover)

- doc/dev/release-checklist: check telemetry validation ([pr#52805](https://github.com/ceph/ceph/pull/52805), Yaarit Hatuka)

- doc/dev: Fix typos in files cephfs-mirroring<span></span>.rst and deduplication<span></span>.rst ([pr#53519](https://github.com/ceph/ceph/pull/53519), Daniel Parkes)

- doc/dev: remove cache-pool ([pr#54007](https://github.com/ceph/ceph/pull/54007), Zac Dover)

- doc/glossary: add "primary affinity" to glossary ([pr#53427](https://github.com/ceph/ceph/pull/53427), Zac Dover)

- doc/glossary: add "Quorum" to glossary ([pr#54509](https://github.com/ceph/ceph/pull/54509), Zac Dover)

- doc/glossary: improve "BlueStore" entry ([pr#54265](https://github.com/ceph/ceph/pull/54265), Zac Dover)

- doc/man/8/ceph-monstore-tool: add documentation ([pr#52872](https://github.com/ceph/ceph/pull/52872), Matan Breizman)

- doc/man/8: improve radosgw-admin<span></span>.rst ([pr#53267](https://github.com/ceph/ceph/pull/53267), Anthony D'Atri)

- doc/man: edit ceph-monstore-tool<span></span>.rst ([pr#53476](https://github.com/ceph/ceph/pull/53476), Zac Dover)

- doc/man: radosgw-admin<span></span>.rst typo ([pr#53315](https://github.com/ceph/ceph/pull/53315), Zac Dover)

- doc/man: remove docs about support for unix domain sockets ([pr#53312](https://github.com/ceph/ceph/pull/53312), Zac Dover)

- doc/man: s/kvstore-tool/monstore-tool/ ([pr#53536](https://github.com/ceph/ceph/pull/53536), Zac Dover)

- doc/rados/configuration: Avoid repeating "support" in msgr2<span></span>.rst ([pr#52998](https://github.com/ceph/ceph/pull/52998), Ville Ojamo)

- doc/rados: add bulk flag to pools<span></span>.rst ([pr#53317](https://github.com/ceph/ceph/pull/53317), Zac Dover)

- doc/rados: edit "troubleshooting-mon" ([pr#54502](https://github.com/ceph/ceph/pull/54502), Zac Dover)

- doc/rados: edit memory-profiling<span></span>.rst ([pr#53932](https://github.com/ceph/ceph/pull/53932), Zac Dover)

- doc/rados: edit operations/add-or-rm-mons (1 of x) ([pr#52889](https://github.com/ceph/ceph/pull/52889), Zac Dover)

- doc/rados: edit operations/add-or-rm-mons (2 of x) ([pr#52825](https://github.com/ceph/ceph/pull/52825), Zac Dover)

- doc/rados: edit ops/control<span></span>.rst (1 of x) ([pr#53811](https://github.com/ceph/ceph/pull/53811), zdover23, Zac Dover)

- doc/rados: edit ops/control<span></span>.rst (2 of x) ([pr#53815](https://github.com/ceph/ceph/pull/53815), Zac Dover)

- doc/rados: edit t-mon "common issues" (1 of x) ([pr#54418](https://github.com/ceph/ceph/pull/54418), Zac Dover)

- doc/rados: edit t-mon "common issues" (2 of x) ([pr#54421](https://github.com/ceph/ceph/pull/54421), Zac Dover)

- doc/rados: edit t-mon "common issues" (3 of x) ([pr#54438](https://github.com/ceph/ceph/pull/54438), Zac Dover)

- doc/rados: edit t-mon "common issues" (4 of x) ([pr#54443](https://github.com/ceph/ceph/pull/54443), Zac Dover)

- doc/rados: edit t-mon "common issues" (5 of x) ([pr#54455](https://github.com/ceph/ceph/pull/54455), Zac Dover)

- doc/rados: edit t-mon<span></span>.rst text ([pr#54349](https://github.com/ceph/ceph/pull/54349), Zac Dover)

- doc/rados: edit t-shooting-mon<span></span>.rst ([pr#54427](https://github.com/ceph/ceph/pull/54427), Zac Dover)

- doc/rados: edit troubleshooting-mon<span></span>.rst (2 of x) ([pr#52839](https://github.com/ceph/ceph/pull/52839), Zac Dover)

- doc/rados: edit troubleshooting-mon<span></span>.rst (3 of x) ([pr#53879](https://github.com/ceph/ceph/pull/53879), Zac Dover)

- doc/rados: edit troubleshooting-mon<span></span>.rst (4 of x) ([pr#53897](https://github.com/ceph/ceph/pull/53897), Zac Dover)

- doc/rados: edit troubleshooting-osd (1 of x) ([pr#53982](https://github.com/ceph/ceph/pull/53982), Zac Dover)

- doc/rados: Edit troubleshooting-osd (2 of x) ([pr#54000](https://github.com/ceph/ceph/pull/54000), Zac Dover)

- doc/rados: Edit troubleshooting-osd (3 of x) ([pr#54026](https://github.com/ceph/ceph/pull/54026), Zac Dover)

- doc/rados: edit troubleshooting-pg (2 of x) ([pr#54114](https://github.com/ceph/ceph/pull/54114), Zac Dover)

- doc/rados: edit troubleshooting-pg<span></span>.rst ([pr#54228](https://github.com/ceph/ceph/pull/54228), Zac Dover)

- doc/rados: edit troubleshooting-pg<span></span>.rst (1 of x) ([pr#54073](https://github.com/ceph/ceph/pull/54073), Zac Dover)

- doc/rados: edit troubleshooting<span></span>.rst ([pr#53837](https://github.com/ceph/ceph/pull/53837), Zac Dover)

- doc/rados: edit troubleshooting/community<span></span>.rst ([pr#53881](https://github.com/ceph/ceph/pull/53881), Zac Dover)

- doc/rados: format "initial troubleshooting" ([pr#54477](https://github.com/ceph/ceph/pull/54477), Zac Dover)

- doc/rados: format Q&A list in t-mon<span></span>.rst ([pr#54345](https://github.com/ceph/ceph/pull/54345), Zac Dover)

- doc/rados: format Q&A list in tshooting-mon<span></span>.rst ([pr#54366](https://github.com/ceph/ceph/pull/54366), Zac Dover)

- doc/rados: improve "scrubbing" explanation ([pr#54270](https://github.com/ceph/ceph/pull/54270), Zac Dover)

- doc/rados: parallelize t-mon headings ([pr#54461](https://github.com/ceph/ceph/pull/54461), Zac Dover)

- doc/rados: remove cache-tiering-related keys ([pr#54227](https://github.com/ceph/ceph/pull/54227), Zac Dover)

- doc/rados: remove FileStore material (in Reef) ([pr#54008](https://github.com/ceph/ceph/pull/54008), Zac Dover)

- doc/rados: remove HitSet-related key information ([pr#54217](https://github.com/ceph/ceph/pull/54217), Zac Dover)

- doc/rados: update monitoring-osd-pg<span></span>.rst ([pr#52958](https://github.com/ceph/ceph/pull/52958), Zac Dover)

- doc/radosgw: Improve dynamicresharding<span></span>.rst ([pr#54368](https://github.com/ceph/ceph/pull/54368), Anthony D'Atri)

- doc/radosgw: Improve language and formatting in config-ref<span></span>.rst ([pr#52835](https://github.com/ceph/ceph/pull/52835), Ville Ojamo)

- doc/radosgw: multisite - edit "migrating a single-site" ([pr#53261](https://github.com/ceph/ceph/pull/53261), Qi Tao)

- doc/radosgw: update rate limit management ([pr#52910](https://github.com/ceph/ceph/pull/52910), Zac Dover)

- doc/README<span></span>.md - edit "Building Ceph" ([pr#53057](https://github.com/ceph/ceph/pull/53057), Zac Dover)

- doc/README<span></span>.md - improve "Running a test cluster" ([pr#53258](https://github.com/ceph/ceph/pull/53258), Zac Dover)

- doc/rgw: correct statement about default zone features ([pr#52833](https://github.com/ceph/ceph/pull/52833), Casey Bodley)

- doc/rgw: pubsub capabilities reference was removed from docs ([pr#54137](https://github.com/ceph/ceph/pull/54137), Yuval Lifshitz)

- doc/rgw: several response headers are supported ([pr#52803](https://github.com/ceph/ceph/pull/52803), Casey Bodley)

- doc/start: correct ABC test chart ([pr#53256](https://github.com/ceph/ceph/pull/53256), Dmitry Kvashnin)

- doc/start: edit os-recommendations<span></span>.rst ([pr#53179](https://github.com/ceph/ceph/pull/53179), Zac Dover)

- doc/start: fix typo in hardware-recommendations<span></span>.rst ([pr#54480](https://github.com/ceph/ceph/pull/54480), Anthony D'Atri)

- doc/start: Modernize and clarify hardware-recommendations<span></span>.rst ([pr#54071](https://github.com/ceph/ceph/pull/54071), Anthony D'Atri)

- doc/start: refactor ABC test chart ([pr#53094](https://github.com/ceph/ceph/pull/53094), Zac Dover)

- doc/start: update "platforms" table ([pr#53075](https://github.com/ceph/ceph/pull/53075), Zac Dover)

- doc/start: update linking conventions ([pr#52912](https://github.com/ceph/ceph/pull/52912), Zac Dover)

- doc/start: update linking conventions ([pr#52841](https://github.com/ceph/ceph/pull/52841), Zac Dover)

- doc/troubleshooting: edit cpu-profiling<span></span>.rst ([pr#53059](https://github.com/ceph/ceph/pull/53059), Zac Dover)

- doc: Add a note on possible deadlock on volume deletion ([pr#52946](https://github.com/ceph/ceph/pull/52946), Kotresh HR)

- doc: add note for removing (automatic) partitioning policy ([pr#53569](https://github.com/ceph/ceph/pull/53569), Venky Shankar)

- doc: Add Reef 18<span></span>.2<span></span>.0 release notes ([pr#52905](https://github.com/ceph/ceph/pull/52905), Zac Dover)

- doc: Add warning on manual CRUSH rule removal ([pr#53420](https://github.com/ceph/ceph/pull/53420), Alvin Owyong)

- doc: clarify upmap balancer documentation ([pr#53004](https://github.com/ceph/ceph/pull/53004), Laura Flores)

- doc: correct option name ([pr#53128](https://github.com/ceph/ceph/pull/53128), Patrick Donnelly)

- doc: do not recommend pulling cephadm from git ([pr#52997](https://github.com/ceph/ceph/pull/52997), John Mulligan)

- doc: Documentation about main Ceph metrics ([pr#54111](https://github.com/ceph/ceph/pull/54111), Juan Miguel Olmo Martínez)

- doc: edit README<span></span>.md - contributing code ([pr#53049](https://github.com/ceph/ceph/pull/53049), Zac Dover)

- doc: expand and consolidate mds placement ([pr#53146](https://github.com/ceph/ceph/pull/53146), Patrick Donnelly)

- doc: Fix doc for mds cap acquisition throttle ([pr#53024](https://github.com/ceph/ceph/pull/53024), Kotresh HR)

- doc: improve submodule update command - README<span></span>.md ([pr#53000](https://github.com/ceph/ceph/pull/53000), Zac Dover)

- doc: make instructions to get an updated cephadm common ([pr#53260](https://github.com/ceph/ceph/pull/53260), John Mulligan)

- doc: remove egg fragment from dev/developer\_guide/running-tests-locally ([pr#53853](https://github.com/ceph/ceph/pull/53853), Dhairya Parmar)

- doc: Update dynamicresharding<span></span>.rst ([pr#54329](https://github.com/ceph/ceph/pull/54329), Aliaksei Makarau)

- doc: Update mClock QOS documentation to discard osd\_mclock\_cost\_per\\_\* ([pr#54079](https://github.com/ceph/ceph/pull/54079), tanchangzhi)

- doc: update rados<span></span>.cc ([pr#52967](https://github.com/ceph/ceph/pull/52967), Zac Dover)

- doc: update test cluster commands in README<span></span>.md ([pr#53349](https://github.com/ceph/ceph/pull/53349), Zac Dover)

- exporter: add ceph\_daemon labels to labeled counters as well ([pr#53695](https://github.com/ceph/ceph/pull/53695), avanthakkar)

- exposed the open api and telemetry links in details card ([pr#53142](https://github.com/ceph/ceph/pull/53142), cloudbehl, dpandit)

- libcephsqlite: fill 0s in unread portion of buffer ([pr#53101](https://github.com/ceph/ceph/pull/53101), Patrick Donnelly)

- librbd: kick ExclusiveLock state machine on client being blocklisted when waiting for lock ([pr#53293](https://github.com/ceph/ceph/pull/53293), Ramana Raja)

- librbd: kick ExclusiveLock state machine stalled waiting for lock from reacquire\_lock() ([pr#53919](https://github.com/ceph/ceph/pull/53919), Ramana Raja)

- librbd: make CreatePrimaryRequest remove any unlinked mirror snapshots ([pr#53276](https://github.com/ceph/ceph/pull/53276), Ilya Dryomov)

- MClientRequest: properly handle ceph\_mds\_request\_head\_legacy for ext\_num\_retry, ext\_num\_fwd, owner\_uid, owner\_gid ([pr#54407](https://github.com/ceph/ceph/pull/54407), Alexander Mikhalitsyn)

- MDS imported\_inodes metric is not updated ([pr#51698](https://github.com/ceph/ceph/pull/51698), Yongseok Oh)

- mds/FSMap: allow upgrades if no up mds ([pr#53851](https://github.com/ceph/ceph/pull/53851), Patrick Donnelly)

- mds/Server: mark a cap acquisition throttle event in the request ([pr#53168](https://github.com/ceph/ceph/pull/53168), Leonid Usov)

- mds: acquire inode snaplock in open ([pr#53183](https://github.com/ceph/ceph/pull/53183), Patrick Donnelly)

- mds: add event for batching getattr/lookup ([pr#53558](https://github.com/ceph/ceph/pull/53558), Patrick Donnelly)

- mds: adjust pre\_segments\_size for MDLog when trimming segments for st… ([issue#59833](http://tracker.ceph.com/issues/59833), [pr#54035](https://github.com/ceph/ceph/pull/54035), Venky Shankar)

- mds: blocklist clients with "bloated" session metadata ([issue#62873](http://tracker.ceph.com/issues/62873), [issue#61947](http://tracker.ceph.com/issues/61947), [pr#53329](https://github.com/ceph/ceph/pull/53329), Venky Shankar)

- mds: do not send split\_realms for CEPH\_SNAP\_OP\_UPDATE msg ([pr#52847](https://github.com/ceph/ceph/pull/52847), Xiubo Li)

- mds: drop locks and retry when lock set changes ([pr#53241](https://github.com/ceph/ceph/pull/53241), Patrick Donnelly)

- mds: dump locks when printing mutation ops ([pr#52975](https://github.com/ceph/ceph/pull/52975), Patrick Donnelly)

- mds: fix deadlock between unlinking and linkmerge ([pr#53497](https://github.com/ceph/ceph/pull/53497), Xiubo Li)

- mds: fix stray evaluation using scrub and introduce new option ([pr#50813](https://github.com/ceph/ceph/pull/50813), Dhairya Parmar)

- mds: Fix the linkmerge assert check ([pr#52724](https://github.com/ceph/ceph/pull/52724), Kotresh HR)

- mds: log message when exiting due to asok command ([pr#53548](https://github.com/ceph/ceph/pull/53548), Patrick Donnelly)

- mds: MDLog::\_recovery\_thread: handle the errors gracefully ([pr#52512](https://github.com/ceph/ceph/pull/52512), Jos Collin)

- mds: session ls command appears twice in command listing ([pr#52515](https://github.com/ceph/ceph/pull/52515), Neeraj Pratap Singh)

- mds: skip forwarding request if the session were removed ([pr#52846](https://github.com/ceph/ceph/pull/52846), Xiubo Li)

- mds: update mdlog perf counters during replay ([pr#52681](https://github.com/ceph/ceph/pull/52681), Patrick Donnelly)

- mds: use variable g\_ceph\_context directly in MDSAuthCaps ([pr#52819](https://github.com/ceph/ceph/pull/52819), Rishabh Dave)

- mgr/cephadm: Add "networks" parameter to orch apply rgw ([pr#53120](https://github.com/ceph/ceph/pull/53120), Teoman ONAY)

- mgr/cephadm: add ability to zap OSDs' devices while draining host ([pr#53869](https://github.com/ceph/ceph/pull/53869), Adam King)

- mgr/cephadm: add is\_host\\_<status> functions to HostCache ([pr#53118](https://github.com/ceph/ceph/pull/53118), Adam King)

- mgr/cephadm: Adding sort-by support for ceph orch ps ([pr#53867](https://github.com/ceph/ceph/pull/53867), Redouane Kachach)

- mgr/cephadm: allow draining host without removing conf/keyring files ([pr#53123](https://github.com/ceph/ceph/pull/53123), Adam King)

- mgr/cephadm: also don't write client files/tuned profiles to maintenance hosts ([pr#53111](https://github.com/ceph/ceph/pull/53111), Adam King)

- mgr/cephadm: ceph orch add fails when ipv6 address is surrounded by square brackets ([pr#53870](https://github.com/ceph/ceph/pull/53870), Teoman ONAY)

- mgr/cephadm: don't use image tag in orch upgrade ls ([pr#53865](https://github.com/ceph/ceph/pull/53865), Adam King)

- mgr/cephadm: fix default image base in reef ([pr#53922](https://github.com/ceph/ceph/pull/53922), Adam King)

- mgr/cephadm: fix REFRESHED column of orch ps being unpopulated ([pr#53741](https://github.com/ceph/ceph/pull/53741), Adam King)

- mgr/cephadm: fix upgrades with nvmeof ([pr#53924](https://github.com/ceph/ceph/pull/53924), Adam King)

- mgr/cephadm: removing double quotes from the generated nvmeof config ([pr#53868](https://github.com/ceph/ceph/pull/53868), Redouane Kachach)

- mgr/cephadm: show meaningful messages when failing to execute cmds ([pr#53106](https://github.com/ceph/ceph/pull/53106), Redouane Kachach)

- mgr/cephadm: storing prometheus/alertmanager credentials in monstore ([pr#53119](https://github.com/ceph/ceph/pull/53119), Redouane Kachach)

- mgr/cephadm: validate host label before removing ([pr#53112](https://github.com/ceph/ceph/pull/53112), Redouane Kachach)

- mgr/dashboard: add e2e tests for cephfs management ([pr#53190](https://github.com/ceph/ceph/pull/53190), Nizamudeen A)

- mgr/dashboard: Add more decimals in latency graph ([pr#52727](https://github.com/ceph/ceph/pull/52727), Pedro Gonzalez Gomez)

- mgr/dashboard: add port and zone endpoints to import realm token form in rgw multisite ([pr#54118](https://github.com/ceph/ceph/pull/54118), Aashish Sharma)

- mgr/dashboard: add validator for size field in the forms ([pr#53378](https://github.com/ceph/ceph/pull/53378), Nizamudeen A)

- mgr/dashboard: align charts of landing page ([pr#53543](https://github.com/ceph/ceph/pull/53543), Pedro Gonzalez Gomez)

- mgr/dashboard: allow PUT in CORS ([pr#52705](https://github.com/ceph/ceph/pull/52705), Nizamudeen A)

- mgr/dashboard: allow tls 1<span></span>.2 with a config option ([pr#53780](https://github.com/ceph/ceph/pull/53780), Nizamudeen A)

- mgr/dashboard: Block Ui fails in angular with target es2022 ([pr#54260](https://github.com/ceph/ceph/pull/54260), Aashish Sharma)

- mgr/dashboard: cephfs volume and subvolume management ([pr#53017](https://github.com/ceph/ceph/pull/53017), Pedro Gonzalez Gomez, Nizamudeen A, Pere Diaz Bou)

- mgr/dashboard: cephfs volume rm and rename ([pr#53026](https://github.com/ceph/ceph/pull/53026), avanthakkar)

- mgr/dashboard: cleanup rbd-mirror process in dashboard e2e ([pr#53220](https://github.com/ceph/ceph/pull/53220), Nizamudeen A)

- mgr/dashboard: cluster upgrade management (batch backport) ([pr#53016](https://github.com/ceph/ceph/pull/53016), avanthakkar, Nizamudeen A)

- mgr/dashboard: Dashboard RGW multisite configuration ([pr#52922](https://github.com/ceph/ceph/pull/52922), Aashish Sharma, Pedro Gonzalez Gomez, Avan Thakkar, avanthakkar)

- mgr/dashboard: disable hosts field while editing the filesystem ([pr#54069](https://github.com/ceph/ceph/pull/54069), Nizamudeen A)

- mgr/dashboard: disable promote on mirroring not enabled ([pr#52536](https://github.com/ceph/ceph/pull/52536), Pedro Gonzalez Gomez)

- mgr/dashboard: disable protect if layering is not enabled on the image ([pr#53173](https://github.com/ceph/ceph/pull/53173), avanthakkar)

- mgr/dashboard: display the groups in cephfs subvolume tab ([pr#53394](https://github.com/ceph/ceph/pull/53394), Pedro Gonzalez Gomez)

- mgr/dashboard: empty grafana panels for performance of daemons ([pr#52774](https://github.com/ceph/ceph/pull/52774), Avan Thakkar, avanthakkar)

- mgr/dashboard: enable protect option if layering enabled ([pr#53795](https://github.com/ceph/ceph/pull/53795), avanthakkar)

- mgr/dashboard: fix cephfs create form validator ([pr#53219](https://github.com/ceph/ceph/pull/53219), Nizamudeen A)

- mgr/dashboard: fix cephfs form validator ([pr#53778](https://github.com/ceph/ceph/pull/53778), Nizamudeen A)

- mgr/dashboard: fix cephfs forms validations ([pr#53831](https://github.com/ceph/ceph/pull/53831), Nizamudeen A)

- mgr/dashboard: fix image columns naming ([pr#53254](https://github.com/ceph/ceph/pull/53254), Pedro Gonzalez Gomez)

- mgr/dashboard: fix progress bar color visibility ([pr#53209](https://github.com/ceph/ceph/pull/53209), Nizamudeen A)

- mgr/dashboard: fix prometheus queries subscriptions ([pr#53669](https://github.com/ceph/ceph/pull/53669), Pedro Gonzalez Gomez)

- mgr/dashboard: fix rgw multi-site import form helper ([pr#54395](https://github.com/ceph/ceph/pull/54395), Aashish Sharma)

- mgr/dashboard: fix rgw multisite error when no rgw entity is present ([pr#54261](https://github.com/ceph/ceph/pull/54261), Aashish Sharma)

- mgr/dashboard: fix rgw page issues when hostname not resolvable ([pr#53214](https://github.com/ceph/ceph/pull/53214), Nizamudeen A)

- mgr/dashboard: fix rgw port manipulation error in dashboard ([pr#53392](https://github.com/ceph/ceph/pull/53392), Nizamudeen A)

- mgr/dashboard: fix the landing page layout issues ([issue#62961](http://tracker.ceph.com/issues/62961), [pr#53835](https://github.com/ceph/ceph/pull/53835), Nizamudeen A)

- mgr/dashboard: Fix user/bucket count in rgw overview dashboard ([pr#53818](https://github.com/ceph/ceph/pull/53818), Aashish Sharma)

- mgr/dashboard: fixed edit user quota form error ([pr#54223](https://github.com/ceph/ceph/pull/54223), Ivo Almeida)

- mgr/dashboard: images -> edit -> disable checkboxes for layering and deef-flatten ([pr#53388](https://github.com/ceph/ceph/pull/53388), avanthakkar)

- mgr/dashboard: minor usability improvements ([pr#53143](https://github.com/ceph/ceph/pull/53143), cloudbehl)

- mgr/dashboard: n/a entries behind primary snapshot mode ([pr#53223](https://github.com/ceph/ceph/pull/53223), Pere Diaz Bou)

- mgr/dashboard: Object gateway inventory card incorrect Buckets and user count ([pr#53382](https://github.com/ceph/ceph/pull/53382), Aashish Sharma)

- mgr/dashboard: Object gateway sync status cards keeps loading when multisite is not configured ([pr#53381](https://github.com/ceph/ceph/pull/53381), Aashish Sharma)

- mgr/dashboard: paginate hosts ([pr#52918](https://github.com/ceph/ceph/pull/52918), Pere Diaz Bou)

- mgr/dashboard: rbd image hide usage bar when disk usage is not provided ([pr#53810](https://github.com/ceph/ceph/pull/53810), Pedro Gonzalez Gomez)

- mgr/dashboard: remove empty popover when there are no health warns ([pr#53652](https://github.com/ceph/ceph/pull/53652), Nizamudeen A)

- mgr/dashboard: remove green tick on old password field ([pr#53386](https://github.com/ceph/ceph/pull/53386), Nizamudeen A)

- mgr/dashboard: remove unnecessary failing hosts e2e ([pr#53458](https://github.com/ceph/ceph/pull/53458), Pedro Gonzalez Gomez)

- mgr/dashboard: remove used and total used columns in favor of usage bar ([pr#53304](https://github.com/ceph/ceph/pull/53304), Pedro Gonzalez Gomez)

- mgr/dashboard: replace sync progress bar with last synced timestamp in rgw multisite sync status card ([pr#53379](https://github.com/ceph/ceph/pull/53379), Aashish Sharma)

- mgr/dashboard: RGW Details card cleanup ([pr#53020](https://github.com/ceph/ceph/pull/53020), Nizamudeen A, cloudbehl)

- mgr/dashboard: Rgw Multi-site naming improvements ([pr#53806](https://github.com/ceph/ceph/pull/53806), Aashish Sharma)

- mgr/dashboard: rgw multisite topology view shows blank table for multisite entities ([pr#53380](https://github.com/ceph/ceph/pull/53380), Aashish Sharma)

- mgr/dashboard: set CORS header for unauthorized access ([pr#53201](https://github.com/ceph/ceph/pull/53201), Nizamudeen A)

- mgr/dashboard: show a message to restart the rgw daemons after moving from single-site to multi-site ([pr#53805](https://github.com/ceph/ceph/pull/53805), Aashish Sharma)

- mgr/dashboard: subvolume rm with snapshots ([pr#53233](https://github.com/ceph/ceph/pull/53233), Pedro Gonzalez Gomez)

- mgr/dashboard: update rgw multisite import form helper info ([pr#54253](https://github.com/ceph/ceph/pull/54253), Aashish Sharma)

- mgr/dashboard: upgrade angular v14 and v15 ([pr#52662](https://github.com/ceph/ceph/pull/52662), Nizamudeen A)

- mgr/rbd\_support: fix recursive locking on CreateSnapshotRequests lock ([pr#54289](https://github.com/ceph/ceph/pull/54289), Ramana Raja)

- mgr/snap\_schedule: allow retention spec 'n' to be user defined ([pr#52748](https://github.com/ceph/ceph/pull/52748), Milind Changire, Jakob Haufe)

- mgr/snap\_schedule: make fs argument mandatory if more than one filesystem exists ([pr#54094](https://github.com/ceph/ceph/pull/54094), Milind Changire)

- mgr/volumes: Fix pending\_subvolume\_deletions in volume info ([pr#53572](https://github.com/ceph/ceph/pull/53572), Kotresh HR)

- mgr: register OSDs in ms\_handle\_accept ([pr#53187](https://github.com/ceph/ceph/pull/53187), Patrick Donnelly)

- mon, qa: issue pool application warning even if pool is empty ([pr#53041](https://github.com/ceph/ceph/pull/53041), Prashant D)

- mon/ConfigMonitor: update crush\_location from osd entity ([pr#52466](https://github.com/ceph/ceph/pull/52466), Didier Gazen)

- mon/MDSMonitor: plug paxos when maybe manipulating osdmap ([pr#52246](https://github.com/ceph/ceph/pull/52246), Patrick Donnelly)

- mon/MonClient: resurrect original client\_mount\_timeout handling ([pr#52535](https://github.com/ceph/ceph/pull/52535), Ilya Dryomov)

- mon/OSDMonitor: do not propose on error in prepare\_update ([pr#53186](https://github.com/ceph/ceph/pull/53186), Patrick Donnelly)

- mon: fix iterator mishandling in PGMap::apply\_incremental ([pr#52554](https://github.com/ceph/ceph/pull/52554), Oliver Schmidt)

- msgr: AsyncMessenger add faulted connections metrics ([pr#53033](https://github.com/ceph/ceph/pull/53033), Pere Diaz Bou)

- os/bluestore: don't require bluestore\_db\_block\_size when attaching new ([pr#52942](https://github.com/ceph/ceph/pull/52942), Igor Fedotov)

- os/bluestore: get rid off resulting lba alignment in allocators ([pr#54772](https://github.com/ceph/ceph/pull/54772), Igor Fedotov)

- osd/OpRequest: Add detail description for delayed op in osd log file ([pr#53688](https://github.com/ceph/ceph/pull/53688), Yite Gu)

- osd/OSDMap: Check for uneven weights & != 2 buckets post stretch mode ([pr#52457](https://github.com/ceph/ceph/pull/52457), Kamoltat)

- osd/scheduler/mClockScheduler: Use same profile and client ids for all clients to ensure allocated QoS limit consumption ([pr#53093](https://github.com/ceph/ceph/pull/53093), Sridhar Seshasayee)

- osd: fix logic in check\_pg\_upmaps ([pr#54276](https://github.com/ceph/ceph/pull/54276), Laura Flores)

- osd: fix read balancer logic to avoid redundant primary assignment ([pr#53820](https://github.com/ceph/ceph/pull/53820), Laura Flores)

- osd: fix use-after-move in build\_incremental\_map\_msg() ([pr#54267](https://github.com/ceph/ceph/pull/54267), Ronen Friedman)

- osd: fix: slow scheduling when item\_cost is large ([pr#53861](https://github.com/ceph/ceph/pull/53861), Jrchyang Yu)

- Overview graph improvements ([pr#53090](https://github.com/ceph/ceph/pull/53090), cloudbehl)

- pybind/mgr/devicehealth: do not crash if db not ready ([pr#52213](https://github.com/ceph/ceph/pull/52213), Patrick Donnelly)

- pybind/mgr/pg\_autoscaler: Cut back osdmap<span></span>.get\_pools calls ([pr#52767](https://github.com/ceph/ceph/pull/52767), Kamoltat)

- pybind/mgr/pg\_autoscaler: fix warn when not too few pgs ([pr#53674](https://github.com/ceph/ceph/pull/53674), Kamoltat)

- pybind/mgr/pg\_autoscaler: noautoscale flag retains individual pool configs ([pr#53658](https://github.com/ceph/ceph/pull/53658), Kamoltat)

- pybind/mgr/pg\_autoscaler: Reorderd if statement for the func: \_maybe\_adjust ([pr#53429](https://github.com/ceph/ceph/pull/53429), Kamoltat)

- pybind/mgr/pg\_autoscaler: Use bytes\_used for actual\_raw\_used ([pr#53534](https://github.com/ceph/ceph/pull/53534), Kamoltat)

- pybind/mgr/volumes: log mutex locks to help debug deadlocks ([pr#53918](https://github.com/ceph/ceph/pull/53918), Kotresh HR)

- pybind/mgr: reopen database handle on blocklist ([pr#52460](https://github.com/ceph/ceph/pull/52460), Patrick Donnelly)

- pybind/rbd: don't produce info on errors in aio\_mirror\_image\_get\_info() ([pr#54055](https://github.com/ceph/ceph/pull/54055), Ilya Dryomov)

- python-common/drive\_group: handle fields outside of 'spec' even when 'spec' is provided ([pr#53115](https://github.com/ceph/ceph/pull/53115), Adam King)

- python-common/drive\_selection: lower log level of limit policy message ([pr#53114](https://github.com/ceph/ceph/pull/53114), Adam King)

- python-common: drive\_selection: fix KeyError when osdspec\_affinity is not set ([pr#53159](https://github.com/ceph/ceph/pull/53159), Guillaume Abrioux)

- qa/cephfs: fix build failure for mdtest project ([pr#53827](https://github.com/ceph/ceph/pull/53827), Rishabh Dave)

- qa/cephfs: fix ior project build failure ([pr#53825](https://github.com/ceph/ceph/pull/53825), Rishabh Dave)

- qa/cephfs: switch to python3 for centos stream 9 ([pr#53624](https://github.com/ceph/ceph/pull/53624), Xiubo Li)

- qa/rgw: add new POOL\_APP\_NOT\_ENABLED failures to log-ignorelist ([pr#53896](https://github.com/ceph/ceph/pull/53896), Casey Bodley)

- qa/smoke,orch,perf-basic: add POOL\_APP\_NOT\_ENABLED to ignorelist ([pr#54376](https://github.com/ceph/ceph/pull/54376), Prashant D)

- qa/standalone/osd/divergent-prior<span></span>.sh: Divergent test 3 with pg\_autoscale\_mode on pick divergent osd ([pr#52721](https://github.com/ceph/ceph/pull/52721), Nitzan Mordechai)

- qa/suites/crimson-rados: add centos9 to supported distros ([pr#54020](https://github.com/ceph/ceph/pull/54020), Matan Breizman)

- qa/suites/crimson-rados: bring backfill testing ([pr#54021](https://github.com/ceph/ceph/pull/54021), Radoslaw Zarzynski, Matan Breizman)

- qa/suites/crimson-rados: Use centos8 for testing ([pr#54019](https://github.com/ceph/ceph/pull/54019), Matan Breizman)

- qa/suites/krbd: stress test for recovering from watch errors ([pr#53786](https://github.com/ceph/ceph/pull/53786), Ilya Dryomov)

- qa/suites/rbd: add test to check rbd\_support module recovery ([pr#54291](https://github.com/ceph/ceph/pull/54291), Ramana Raja)

- qa/suites/rbd: drop cache tiering workload tests ([pr#53996](https://github.com/ceph/ceph/pull/53996), Ilya Dryomov)

- qa/suites/upgrade: enable default RBD image features ([pr#53352](https://github.com/ceph/ceph/pull/53352), Ilya Dryomov)

- qa/suites/upgrade: fix env indentation in stress-split upgrade tests ([pr#53921](https://github.com/ceph/ceph/pull/53921), Laura Flores)

- qa/suites/{rbd,krbd}: disable POOL\_APP\_NOT\_ENABLED health check ([pr#53599](https://github.com/ceph/ceph/pull/53599), Ilya Dryomov)

- qa/tests: added - \(POOL\_APP\_NOT\_ENABLED\) to the ignore list ([pr#54436](https://github.com/ceph/ceph/pull/54436), Yuri Weinstein)

- qa: add centos\_latest (9<span></span>.stream) and ubuntu\_20<span></span>.04 yamls to supported-all-distro ([pr#54677](https://github.com/ceph/ceph/pull/54677), Venky Shankar)

- qa: add POOL\_APP\_NOT\_ENABLED to ignorelist for cephfs tests ([issue#62482](http://tracker.ceph.com/issues/62482), [issue#62508](http://tracker.ceph.com/issues/62508), [pr#54380](https://github.com/ceph/ceph/pull/54380), Venky Shankar, Patrick Donnelly)

- qa: assign file system affinity for replaced MDS ([issue#61764](http://tracker.ceph.com/issues/61764), [pr#54037](https://github.com/ceph/ceph/pull/54037), Venky Shankar)

- qa: descrease pgbench scale factor to 32 for postgresql database test ([pr#53627](https://github.com/ceph/ceph/pull/53627), Xiubo Li)

- qa: fix cephfs-mirror unwinding and 'fs volume create/rm' order ([pr#52656](https://github.com/ceph/ceph/pull/52656), Jos Collin)

- qa: fix keystone in rgw/crypt/barbican<span></span>.yaml ([pr#53412](https://github.com/ceph/ceph/pull/53412), Ali Maredia)

- qa: ignore expected cluster warning from damage tests ([pr#53484](https://github.com/ceph/ceph/pull/53484), Patrick Donnelly)

- qa: lengthen shutdown timeout for thrashed MDS ([pr#53553](https://github.com/ceph/ceph/pull/53553), Patrick Donnelly)

- qa: move nfs (mgr/nfs) related tests to fs suite ([pr#53906](https://github.com/ceph/ceph/pull/53906), Dhairya Parmar, Venky Shankar)

- qa: wait for file to have correct size ([pr#52742](https://github.com/ceph/ceph/pull/52742), Patrick Donnelly)

- qa: wait for MDSMonitor tick to replace daemons ([pr#52235](https://github.com/ceph/ceph/pull/52235), Patrick Donnelly)

- RadosGW API: incorrect bucket quota in response to HEAD /{bucket}/?usage ([pr#53437](https://github.com/ceph/ceph/pull/53437), shreyanshjain7174)

- rbd-mirror: fix image replayer shut down description on force promote ([pr#52880](https://github.com/ceph/ceph/pull/52880), Prasanna Kumar Kalever)

- rbd-mirror: fix race preventing local image deletion ([pr#52627](https://github.com/ceph/ceph/pull/52627), N Balachandran)

- rbd-nbd: fix stuck with disable request ([pr#54254](https://github.com/ceph/ceph/pull/54254), Prasanna Kumar Kalever)

- read balancer documentation ([pr#52777](https://github.com/ceph/ceph/pull/52777), Laura Flores)

- Rgw overview dashboard backport ([pr#53065](https://github.com/ceph/ceph/pull/53065), Aashish Sharma)

- rgw/amqp: remove possible race conditions with the amqp connections ([pr#53516](https://github.com/ceph/ceph/pull/53516), Yuval Lifshitz)

- rgw/amqp: skip idleness tests since it needs to sleep longer than 30s ([pr#53506](https://github.com/ceph/ceph/pull/53506), Yuval Lifshitz)

- rgw/crypt: apply rgw\_crypt\_default\_encryption\_key by default ([pr#52796](https://github.com/ceph/ceph/pull/52796), Casey Bodley)

- rgw/crypt: don't deref null manifest\_bl ([pr#53590](https://github.com/ceph/ceph/pull/53590), Casey Bodley)

- rgw/kafka: failed to reconnect to broker after idle timeout ([pr#53513](https://github.com/ceph/ceph/pull/53513), Yuval Lifshitz)

- rgw/kafka: make sure that destroy is called after connection is removed ([pr#53515](https://github.com/ceph/ceph/pull/53515), Yuval Lifshitz)

- rgw/keystone: EC2Engine uses reject() for ERR\_SIGNATURE\_NO\_MATCH ([pr#53762](https://github.com/ceph/ceph/pull/53762), Casey Bodley)

- rgw/multisite[archive zone]: fix storing of bucket instance info in the new bucket entrypoint ([pr#53466](https://github.com/ceph/ceph/pull/53466), Shilpa Jagannath)

- rgw/notification: pass in bytes\_transferred to populate object\_size in sync notification ([pr#53377](https://github.com/ceph/ceph/pull/53377), Juan Zhu)

- rgw/notification: remove non x-amz-meta-\* attributes from bucket notifications ([pr#53375](https://github.com/ceph/ceph/pull/53375), Juan Zhu)

- rgw/notifications: allow cross tenant notification management ([pr#53510](https://github.com/ceph/ceph/pull/53510), Yuval Lifshitz)

- rgw/s3: ListObjectsV2 returns correct object owners ([pr#54161](https://github.com/ceph/ceph/pull/54161), Casey Bodley)

- rgw/s3select: fix per QE defect ([pr#54163](https://github.com/ceph/ceph/pull/54163), galsalomon66)

- rgw/s3select: s3select fixes related to Trino/TPCDS benchmark and QE tests ([pr#53034](https://github.com/ceph/ceph/pull/53034), galsalomon66)

- rgw/sal: get\_placement\_target\_names() returns void ([pr#53584](https://github.com/ceph/ceph/pull/53584), Casey Bodley)

- rgw/sync-policy: Correct "sync status" & "sync group" commands ([pr#53395](https://github.com/ceph/ceph/pull/53395), Soumya Koduri)

- rgw/upgrade: point upgrade suites to ragweed ceph-reef branch ([pr#53797](https://github.com/ceph/ceph/pull/53797), Shilpa Jagannath)

- RGW: add admin interfaces to get and delete notifications by bucket ([pr#53509](https://github.com/ceph/ceph/pull/53509), Ali Masarwa)

- rgw: add radosgw-admin bucket check olh/unlinked commands ([pr#53823](https://github.com/ceph/ceph/pull/53823), Cory Snyder)

- rgw: add versioning info to radosgw-admin bucket stats output ([pr#54191](https://github.com/ceph/ceph/pull/54191), Cory Snyder)

- RGW: bucket notification - hide auto generated topics when listing topics ([pr#53507](https://github.com/ceph/ceph/pull/53507), Ali Masarwa)

- rgw: don't dereference nullopt in DeleteMultiObj ([pr#54124](https://github.com/ceph/ceph/pull/54124), Casey Bodley)

- rgw: fetch\_remote\_obj() preserves original part lengths for BlockDecrypt ([pr#52816](https://github.com/ceph/ceph/pull/52816), Casey Bodley)

- rgw: fetch\_remote\_obj() uses uncompressed size for encrypted objects ([pr#54371](https://github.com/ceph/ceph/pull/54371), Casey Bodley)

- rgw: fix 2 null versionID after convert\_plain\_entry\_to\_versioned ([pr#53398](https://github.com/ceph/ceph/pull/53398), rui ma, zhuo li)

- rgw: fix multipart upload object leaks due to re-upload ([pr#52615](https://github.com/ceph/ceph/pull/52615), J. Eric Ivancich)

- rgw: fix rgw rate limiting RGWRateLimitInfo class decode\_json max\_rea… ([pr#53765](https://github.com/ceph/ceph/pull/53765), xiangrui meng)

- rgw: fix SignatureDoesNotMatch when extra headers start with 'x-amz' ([pr#53770](https://github.com/ceph/ceph/pull/53770), rui ma)

- rgw: fix unwatch crash at radosgw startup ([pr#53760](https://github.com/ceph/ceph/pull/53760), lichaochao)

- rgw: handle http options CORS with v4 auth ([pr#53413](https://github.com/ceph/ceph/pull/53413), Tobias Urdin)

- rgw: improve buffer list utilization in the chunkupload scenario ([pr#53773](https://github.com/ceph/ceph/pull/53773), liubingrun)

- rgw: pick http\_date in case of http\_x\_amz\_date absence ([pr#53440](https://github.com/ceph/ceph/pull/53440), Seena Fallah, Mohamed Awnallah)

- rgw: retry metadata cache notifications with INVALIDATE\_OBJ ([pr#52798](https://github.com/ceph/ceph/pull/52798), Casey Bodley)

- rgw: s3 object lock avoids overflow in retention date ([pr#52604](https://github.com/ceph/ceph/pull/52604), Casey Bodley)

- rgw: s3website doesn't prefetch for web\_dir() check ([pr#53767](https://github.com/ceph/ceph/pull/53767), Casey Bodley)

- RGW: Solving the issue of not populating etag in Multipart upload result ([pr#51447](https://github.com/ceph/ceph/pull/51447), Ali Masarwa)

- RGW:notifications: persistent topics are not deleted via radosgw-admin ([pr#53514](https://github.com/ceph/ceph/pull/53514), Ali Masarwa)

- src/mon/Monitor: Fix set\_elector\_disallowed\_leaders ([pr#54003](https://github.com/ceph/ceph/pull/54003), Kamoltat)

- test/crimson/seastore/rbm: add sub-tests regarding RBM to the existing tests ([pr#53967](https://github.com/ceph/ceph/pull/53967), Myoungwon Oh)

- test/TestOSDMap: don't use the deprecated std::random\_shuffle method ([pr#52737](https://github.com/ceph/ceph/pull/52737), Leonid Usov)

- valgrind: UninitCondition under \_\_run\_exit\_handlers suppression ([pr#53681](https://github.com/ceph/ceph/pull/53681), Mark Kogan)

- xfstests\_dev: install extra packages from powertools repo for xfsprogs ([pr#52843](https://github.com/ceph/ceph/pull/52843), Xiubo Li)



