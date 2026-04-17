---
title: "v19.2.4 Squid released"
date: "2026-04-30"
author: "Yuri Weinstein"
tags:
  - "release"
  - "squid"
---

This is the fourth backport release in the Squid series.
We recommend all users update to this release.

## Notable Changes

OSD / BlueStore
---------------

- BlueFS: Increased the default WAL volume size to 1GB to prevent ENOSPC failures.
- Volume Selection: Fixed the usage of bluestore_volume_selection_reserved_factor and updated row naming conventions in RocksDBBlueFSVolumeSelector.
- Health: Added a time_added field to mon_info_t to prevent freshly added monitors from incorrectly triggering a MON_DOWN health status.
- Tooling: Updated monmaptool to correctly respect set features when adding addresses.

RADOS / Manager (mgr)
---------------------

- RADOS pybind: Fixed a parameter reversal bug in WriteOp.zero() where offset and length were swapped when calling the underlying C API.
- Daemon Health: Modified the manager to clear health metrics for down or out OSDs instead of removing them entirely from the daemon state.
- Autoscaler: Updated pg_autoscale_mode logic to accurately reflect the no_autoscale flag in both standard and JSON command outputs.

RADOS Gateway (RGW)
-------------------

- Notifications: Resolved a reserved_size drift in the 2pc_queue causing ENOSPC errors and fixed a leak where overhead was not properly decremented during commit/abort.
- Multipart Uploads: Fixed an issue where tags could not be retrieved from objects created via multipart uploads.
- Kafka Integration: Updated the internal Kafka version support to 3.9.2.

CephFS / MDS
------------

- Fragments: Simplified fragment printing and corrected frag_t endianness conversion for network and storage consistency.
- FUSE Client: Updated the FUSE client to clarify that fallocate disk space reservation is only supported with specific flags like FALLOC_FL_KEEP_SIZE.
- Metadata: Updated the MDS to dump frag_t as an object and included sysinfo in the status command output for better diagnostics.

Dashboard
---------

- Services: Fixed a bug where changing MDS placement to a label incorrectly triggered the creation of an entirely new MDS service.
- Access Control: Fixed role-based access control permissions and added missing types to the mgr-module list.

librbd & rbd-mirror
-------------------

- RBD: Introduced a new ``RBD_LOCK_MODE_EXCLUSIVE_TRANSIENT`` policy for ``rbd_lock_acquire()``. This is a low-level interface intended to allow a peer to grab exclusive lock manually for short periods of time with other peers pausing their activity and waiting for the lock to be released rather than instantly aborting I/O and returning an error. It's possible to switch from ``RBD_LOCK_MODE_EXCLUSIVE`` to ``RBD_LOCK_MODE_EXCLUSIVE_TRANSIENT`` policy and vice versa even if the lock is already held.


## Changelog

- auth: msgr2 can return incorrect allowed\_modes through AuthBadMethodFrame ([pr#65335](https://github.com/ceph/ceph/pull/65335), Miki Patel)

- backport build-with-container patches from main ([pr#65186](https://github.com/ceph/ceph/pull/65186), John Mulligan, Dan Mick, Zack Cerza)

- backports variants improvements and Dockerfile<span></span>.build changes ([pr#66011](https://github.com/ceph/ceph/pull/66011), John Mulligan, Zack Cerza)

- blk/kernel: improve DiscardThread life cycle ([pr#65214](https://github.com/ceph/ceph/pull/65214), Igor Fedotov)

- bluestore/BlueFS: fix bytes\_written\_slow counter with aio\_write ([pr#66354](https://github.com/ceph/ceph/pull/66354), chungfengz)

- build-with-container: add argument groups to organize options ([pr#65629](https://github.com/ceph/ceph/pull/65629), John Mulligan)

- build-with-container: build image variants ([pr#65945](https://github.com/ceph/ceph/pull/65945), John Mulligan)

- ceph-fuse: Improve fuse mount usage message ([pr#61274](https://github.com/ceph/ceph/pull/61274), Kotresh HR)

- ceph-volume: drop udevadm subprocess calls ([pr#65302](https://github.com/ceph/ceph/pull/65302), Guillaume Abrioux)

- ceph-volume: fix UdevData initialisation from empty /run/udev/data/\* file ([pr#65924](https://github.com/ceph/ceph/pull/65924), Matteo Paramatti)

- ceph-volume: use udev data instead of LVM subprocess in get\_devices() ([pr#65922](https://github.com/ceph/ceph/pull/65922), Guillaume Abrioux)

- cephadm: add ability to continue on failure when applying multiple specs ([pr#64082](https://github.com/ceph/ceph/pull/64082), Adam King)

- cephadm: rgw: allow specifying the ssl\_certificate by filepath ([pr#64084](https://github.com/ceph/ceph/pull/64084), Alexander Hussein-Kershaw)

- cephadm: stop sidecar systemd units when restarting main units ([pr#62593](https://github.com/ceph/ceph/pull/62593), Adam King, John Mulligan)

- CephContext: acquire \_fork\_watchers\_lock in notify\_post\_fork() ([issue#63494](http://tracker.ceph.com/issues/63494), [pr#62051](https://github.com/ceph/ceph/pull/62051), Venky Shankar)

- cephfs-journal-tool: fix segfault during 'journal import' from invalid dump file ([pr#62115](https://github.com/ceph/ceph/pull/62115), Jos Collin)

- cephfs-journal-tool: Journal trimming issue ([pr#65602](https://github.com/ceph/ceph/pull/65602), Kotresh HR)

- cephfs-shell: add option to remove xattr ([pr#62391](https://github.com/ceph/ceph/pull/62391), Neeraj Pratap Singh)

- cephfs-top: exception when terminal size greater than PAD\_WIDTH ([pr#61774](https://github.com/ceph/ceph/pull/61774), Jos Collin)

- cephfs: fix monclient not subscribed monmap/config ([pr#66471](https://github.com/ceph/ceph/pull/66471), Shaohui Wang)

- cephfs: MDCache request cleanup ([pr#66472](https://github.com/ceph/ceph/pull/66472), Abhishek Lekshmanan)

- cephfs\_mirror: 'ceph fs snapshot mirror ls' command ([pr#60177](https://github.com/ceph/ceph/pull/60177), Jos Collin)

- client: account for mixed quotas in statfs ([pr#66473](https://github.com/ceph/ceph/pull/66473), Christopher Hoffman)

- client: cephfs user-space client fixes ([issue#70726](http://tracker.ceph.com/issues/70726), [issue#71510](http://tracker.ceph.com/issues/71510), [pr#64090](https://github.com/ceph/ceph/pull/64090), Venky Shankar, Adam Emerson, Kotresh HR, Shachar Sharon)

- client: fix unmount hang after lookups ([pr#65289](https://github.com/ceph/ceph/pull/65289), Dhairya Parmar)

- client: Handle empty pathnames for `ceph\_chownat()` and `ceph\_statxat()` ([pr#61166](https://github.com/ceph/ceph/pull/61166), Anoop C S)

- client: ll\_walk will process absolute paths as relative ([pr#62499](https://github.com/ceph/ceph/pull/62499), Patrick Donnelly)

- client: prohibit unprivileged users from setting sgid/suid bits ([pr#66039](https://github.com/ceph/ceph/pull/66039), Kefu Chai)

- client: use path supplied in statfs ([pr#65133](https://github.com/ceph/ceph/pull/65133), Christopher Hoffman)

- cmake: remove \_FORTIFY\_SOURCE define ([pr#65659](https://github.com/ceph/ceph/pull/65659), Casey Bodley)

- common/ceph\_context: use std::atomic<std::shared\_ptr<T>> ([pr#66185](https://github.com/ceph/ceph/pull/66185), Kefu Chai, Max Kellermann)

- common/frag: properly convert frag\_t to net/store endianness ([pr#66541](https://github.com/ceph/ceph/pull/66541), Patrick Donnelly, Max Kellermann)

- common/options: fix typo in description ([pr#64217](https://github.com/ceph/ceph/pull/64217), Lorenz Bausch)

- common: Allow PerfCounters to return a provided service ID ([pr#65588](https://github.com/ceph/ceph/pull/65588), Adam C. Emerson)

- common: drop stack singleton object of temp messenger for foreground ceph daemons ([pr#66897](https://github.com/ceph/ceph/pull/66897), dongdong tao)

- deb/cephadm: add explicit --home for cephadm user ([pr#64605](https://github.com/ceph/ceph/pull/64605), Casey Bodley, Shawn Edwards)

- deb/mgr: remove deprecated distutils from ceph-mgr<span></span>.requires ([pr#64456](https://github.com/ceph/ceph/pull/64456), Casey Bodley)

- deb: use glob match to support systemd unit dir changes ([pr#64013](https://github.com/ceph/ceph/pull/64013), Kefu Chai)

- debian/control: add iproute2 to build dependencies ([pr#66739](https://github.com/ceph/ceph/pull/66739), Kefu Chai)

- debian: radosgw: add media-types packages as alternative for mime-support ([pr#63725](https://github.com/ceph/ceph/pull/63725), Thomas Lamprecht)

- doc/cephadm: remove sections that do not not apply to Squid in rgw<span></span>.rst ([pr#66970](https://github.com/ceph/ceph/pull/66970), Ville Ojamo)

- doc/cephfs: add a note about estimated replay completion time ([issue#71629](http://tracker.ceph.com/issues/71629), [pr#65057](https://github.com/ceph/ceph/pull/65057), Venky Shankar, Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (1 of x) ([pr#64735](https://github.com/ceph/ceph/pull/64735), Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (2 of x) ([pr#64759](https://github.com/ceph/ceph/pull/64759), Zac Dover)

- doc/cephfs: edit ceph-dokan<span></span>.rst (3 of x) ([pr#64785](https://github.com/ceph/ceph/pull/64785), Zac Dover)

- doc/cephfs: edit disaster-recovery<span></span>.rst ([pr#64644](https://github.com/ceph/ceph/pull/64644), Zac Dover)

- doc/cephfs: edit disaster-recovery<span></span>.rst ([pr#64608](https://github.com/ceph/ceph/pull/64608), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65379](https://github.com/ceph/ceph/pull/65379), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65087](https://github.com/ceph/ceph/pull/65087), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65125](https://github.com/ceph/ceph/pull/65125), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65122](https://github.com/ceph/ceph/pull/65122), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65093](https://github.com/ceph/ceph/pull/65093), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65090](https://github.com/ceph/ceph/pull/65090), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65077](https://github.com/ceph/ceph/pull/65077), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65096](https://github.com/ceph/ceph/pull/65096), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65046](https://github.com/ceph/ceph/pull/65046), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65043](https://github.com/ceph/ceph/pull/65043), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65040](https://github.com/ceph/ceph/pull/65040), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65036](https://github.com/ceph/ceph/pull/65036), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#65025](https://github.com/ceph/ceph/pull/65025), Zac Dover, Venky Shankar)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64903](https://github.com/ceph/ceph/pull/64903), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64900](https://github.com/ceph/ceph/pull/64900), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64878](https://github.com/ceph/ceph/pull/64878), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64871](https://github.com/ceph/ceph/pull/64871), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst ([pr#64852](https://github.com/ceph/ceph/pull/64852), Zac Dover)

- doc/cephfs: edit troubleshooting<span></span>.rst (Slow MDS) ([pr#65202](https://github.com/ceph/ceph/pull/65202), Zac Dover)

- doc/cephfs: Improve mount-using-fuse<span></span>.rst ([pr#64472](https://github.com/ceph/ceph/pull/64472), Anthony D'Atri)

- doc/cephfs: Update quota<span></span>.rst ([pr#65082](https://github.com/ceph/ceph/pull/65082), Jannis Speer, Zac Dover)

- doc/dev/config: Document how to use :confval: directive for config op… ([pr#64166](https://github.com/ceph/ceph/pull/64166), Kefu Chai)

- doc/dev/crimson: Update docs ([pr#65311](https://github.com/ceph/ceph/pull/65311), Matan Breizman)

- doc/dev/release-process<span></span>.rst: document new Jenkins job for containers ([pr#62612](https://github.com/ceph/ceph/pull/62612), Dan Mick)

- doc/dev:update blkin<span></span>.rst doc for lttng trace ([pr#65211](https://github.com/ceph/ceph/pull/65211), lizhipeng)

- doc/man/8: Improve mount<span></span>.ceph<span></span>.rst ([pr#65183](https://github.com/ceph/ceph/pull/65183), Anthony D'Atri)

- doc/mgr/crash<span></span>.rst: remove outdated module enabling instructions ([pr#64284](https://github.com/ceph/ceph/pull/64284), Kefu Chai)

- doc/mgr: edit telemetry<span></span>.rst ([pr#63809](https://github.com/ceph/ceph/pull/63809), Zac Dover)

- doc/mgr: edit telemetry<span></span>.rst ([pr#64343](https://github.com/ceph/ceph/pull/64343), Zac Dover)

- doc/rados/configuration: Mention show-with-defaults and ceph-conf ([pr#65206](https://github.com/ceph/ceph/pull/65206), Niklas Hambüchen)

- doc/rados/configuration: Small improvements in ceph-conf<span></span>.rst ([pr#64287](https://github.com/ceph/ceph/pull/64287), Ville Ojamo)

- doc/rados/operations: Improve health-checks<span></span>.rst ([pr#65238](https://github.com/ceph/ceph/pull/65238), Anthony D'Atri)

- doc/rados/ops: add caps restore command ([pr#64321](https://github.com/ceph/ceph/pull/64321), Zac Dover)

- doc/rados/ops: edit cache-tiering<span></span>.rst ([pr#64496](https://github.com/ceph/ceph/pull/64496), Zac Dover)

- doc/rados: document section absent in release < T ([pr#64867](https://github.com/ceph/ceph/pull/64867), Zac Dover)

- doc/rados: remove clonedata command ([pr#64393](https://github.com/ceph/ceph/pull/64393), Zac Dover)

- doc/rados: repair short underline ([pr#65137](https://github.com/ceph/ceph/pull/65137), Zac Dover)

- doc/radosgw/s3: Document delete-if-unmodified-since ([pr#64315](https://github.com/ceph/ceph/pull/64315), Anthony D'Atri)

- doc/radosgw: add rgw\_enable\_lc\_threads & rgw\_enable\_gc\_threads ([pr#64338](https://github.com/ceph/ceph/pull/64338), Zac Dover)

- doc/radosgw: edit "Lifecycle Settings" ([pr#64547](https://github.com/ceph/ceph/pull/64547), Zac Dover)

- doc/radosgw: edit config-ref<span></span>.rst ([pr#64647](https://github.com/ceph/ceph/pull/64647), Zac Dover)

- doc/radosgw: edit metrics<span></span>.rst ([pr#63812](https://github.com/ceph/ceph/pull/63812), Zac Dover)

- doc/radosgw: Improve rgw-cache<span></span>.rst ([pr#64475](https://github.com/ceph/ceph/pull/64475), Ville Ojamo)

- doc/radosgw: remove cloud-restore from squid ([pr#65639](https://github.com/ceph/ceph/pull/65639), Zac Dover)

- doc/rbd/rbd-config-ref: add clone settings section ([pr#66174](https://github.com/ceph/ceph/pull/66174), Ilya Dryomov)

- doc/src/common/options: mgr<span></span>.yaml<span></span>.in edit ([pr#63764](https://github.com/ceph/ceph/pull/63764), Zac Dover)

- doc: add note admonitions in two files ([pr#64492](https://github.com/ceph/ceph/pull/64492), Zac Dover)

- doc: Clarify the status of MS Windows client support ([pr#64481](https://github.com/ceph/ceph/pull/64481), Anthony D'Atri)

- doc: do not depend on typed-ast ([pr#64399](https://github.com/ceph/ceph/pull/64399), Kefu Chai)

- doc: Document ceph-mgr module configuration options ([pr#64396](https://github.com/ceph/ceph/pull/64396), Kefu Chai)

- doc: fetch releases from main branch ([pr#67001](https://github.com/ceph/ceph/pull/67001), Patrick Donnelly)

- doc: Fix links to mClock config reference ([pr#64752](https://github.com/ceph/ceph/pull/64752), Pierre Riteau)

- doc: Fix unterminated inline literal in ceph-conf<span></span>.rst ([pr#64170](https://github.com/ceph/ceph/pull/64170), Kefu Chai)

- doc: Fixed a spelling error ([pr#64147](https://github.com/ceph/ceph/pull/64147), Instelligence.io)

- doc: Fixes a typo in balancer operations ([pr#65550](https://github.com/ceph/ceph/pull/65550), Tyler Brekke)

- doc: Pin pip to <25<span></span>.3 for RTD as a workaround for pybind in admin/doc-read-the-docs<span></span>.txt ([pr#66117](https://github.com/ceph/ceph/pull/66117), Ville Ojamo)

- doc: Remove sphinxcontrib-seqdiag Python package from RTD builds ([pr#67501](https://github.com/ceph/ceph/pull/67501), Ville Ojamo)

- doc: update mgr modules notify\_types ([pr#64530](https://github.com/ceph/ceph/pull/64530), Nitzan Mordechai)

- github: pin GH Actions to SHA-1 commit ([pr#65758](https://github.com/ceph/ceph/pull/65758), Ernesto Puerta)

- Handle failures in metric parsing ([pr#65228](https://github.com/ceph/ceph/pull/65228), Anmol Babu)

- HealthMonitor: Add topology-aware netsplit detection and warning ([pr#63024](https://github.com/ceph/ceph/pull/63024), Kamoltat Sirivadhna)

- install-deps<span></span>.sh: install proper compiler version on Debian/Ubuntu ([pr#66013](https://github.com/ceph/ceph/pull/66013), Dan Mick)

- install-deps: Replace apt-mirror ([pr#66668](https://github.com/ceph/ceph/pull/66668), David Galloway)

- librbd/cache/pwl: WriteLogOperationSet::cell can be garbage ([pr#67704](https://github.com/ceph/ceph/pull/67704), Ilya Dryomov)

- librbd/mirror: detect trashed snapshots in UnlinkPeerRequest ([pr#67582](https://github.com/ceph/ceph/pull/67582), Ilya Dryomov)

- librbd: don't complete ImageUpdateWatchers::shut\_down() prematurely ([pr#67580](https://github.com/ceph/ceph/pull/67580), Ilya Dryomov)

- librbd: fix ExclusiveLock::accept\_request() when !is\_state\_locked() ([pr#66627](https://github.com/ceph/ceph/pull/66627), Ilya Dryomov)

- librbd: images aren't closed in group\_snap\\_\*\_by\_record() on error ([pr#64621](https://github.com/ceph/ceph/pull/64621), Miki Patel)

- librbd: introduce RBD\_LOCK\_MODE\_EXCLUSIVE\_TRANSIENT ([pr#67278](https://github.com/ceph/ceph/pull/67278), Ilya Dryomov)

- mds,client: correct last\_issue struct fields and consistently send last\_issue in cap messages ([pr#61300](https://github.com/ceph/ceph/pull/61300), Patrick Donnelly)

- mds/MDSDaemon: unlock `mds\_lock` while shutting down Beacon and others ([pr#64886](https://github.com/ceph/ceph/pull/64886), Max Kellermann)

- mds: add MDS asok command for dumping stray directories ([issue#56442](http://tracker.ceph.com/issues/56442), [pr#62517](https://github.com/ceph/ceph/pull/62517), Igor Golikov)

- mds: add more debug logs and log events ([pr#65279](https://github.com/ceph/ceph/pull/65279), Xiubo Li)

- mds: check for snapshots on parent snaprealms ([pr#63019](https://github.com/ceph/ceph/pull/63019), Patrick Donnelly)

- mds: do not schedule quiesce for non-head imported inodes ([pr#61857](https://github.com/ceph/ceph/pull/61857), Patrick Donnelly)

- mds: dump export\_ephemeral\_random\_pin as double ([pr#65162](https://github.com/ceph/ceph/pull/65162), Enrico Bocchi)

- mds: dump next\_snap when checking dentry corruption ([pr#61977](https://github.com/ceph/ceph/pull/61977), Milind Changire)

- mds: fix heap-use-after-free in C\_Flush\_Journal ([pr#65141](https://github.com/ceph/ceph/pull/65141), Milind Changire)

- mds: Fix invalid access of mdr->dn[0]<span></span>.back() ([pr#61451](https://github.com/ceph/ceph/pull/61451), Anoop C S)

- mds: fix snapdiff result fragmentation ([pr#65363](https://github.com/ceph/ceph/pull/65363), Igor Fedotov, Md Mahamudur Rahaman Sajib)

- mds: include auth credential in session dump ([pr#65267](https://github.com/ceph/ceph/pull/65267), Patrick Donnelly)

- mds: nudge log for unstable locks after early reply ([pr#64539](https://github.com/ceph/ceph/pull/64539), Patrick Donnelly)

- mds: session in the importing state cannot be cleared if an export subtree task is interrupted while the state of importer is acking ([pr#62055](https://github.com/ceph/ceph/pull/62055), Zhansong Gao)

- mds: skip charmap handler check for MDS requests ([pr#64954](https://github.com/ceph/ceph/pull/64954), Patrick Donnelly)

- memory lock issues causing hangs during connection shutdown ([pr#65785](https://github.com/ceph/ceph/pull/65785), Nitzan Mordechai)

- mgr/alerts: enforce ssl context to SMTP\_SSL ([pr#66141](https://github.com/ceph/ceph/pull/66141), Nizamudeen A)

- mgr/cephadm: add "allow\_set\_io\_flusher\_fail = true;" to ganesha conf ([pr#60360](https://github.com/ceph/ceph/pull/60360), Adam King)

- mgr/cephadm: allow disabling rgw\_run\_sync\_thread through spec ([pr#61350](https://github.com/ceph/ceph/pull/61350), Adam King)

- mgr/cephadm: fix typo with vrrp\_interfaces in keepalive setup ([pr#61902](https://github.com/ceph/ceph/pull/61902), Adam King)

- mgr/cephadm: mgr orchestrator module raise exception if there is trailing tab in yaml file ([pr#64086](https://github.com/ceph/ceph/pull/64086), Shweta Bhosale)

- mgr/cephadm: open ceph-exporter when firewalld is enabled ([pr#59932](https://github.com/ceph/ceph/pull/59932), Redouane Kachach)

- mgr/cephadm: update grafana conf for disconnected environment ([pr#66210](https://github.com/ceph/ceph/pull/66210), Nizamudeen A)

- mgr/cephadm: Use a persistent volume to store Loki DB ([pr#66024](https://github.com/ceph/ceph/pull/66024), Aashish Sharma)

- mgr/DaemonServer: fixed mistype for mgr\_osd\_messages ([pr#63344](https://github.com/ceph/ceph/pull/63344), Konstantin Shalygin)

- mgr/DaemonState: Minimise time we hold the DaemonStateIndex lock ([pr#65462](https://github.com/ceph/ceph/pull/65462), Brad Hubbard)

- mgr/dashboard : Fixed mirrored image usage info bar ([pr#65492](https://github.com/ceph/ceph/pull/65492), Abhishek Desai)

- mgr/dashboard : Fixed usage bar for secondary site in rbd mirroing ([pr#65928](https://github.com/ceph/ceph/pull/65928), Abhishek Desai)

- mgr/dashboard: 72409 : Fixed parsing error in grafana for host overall performance iframe ([pr#64884](https://github.com/ceph/ceph/pull/64884), Abhishek Desai)

- mgr/dashboard: add <span></span>.nvmrc so ci can pick the node version ([pr#64665](https://github.com/ceph/ceph/pull/64665), Nizamudeen A)

- mgr/dashboard: allow deletion of non-default zone and zonegroup ([pr#66212](https://github.com/ceph/ceph/pull/66212), Aashish Sharma)

- mgr/dashboard: Blank entry for Storage Capacity in dashboard under Cluster > Expand Cluster > Review ([pr#65706](https://github.com/ceph/ceph/pull/65706), Naman Munet)

- mgr/dashboard: Changing placement of a mds to label - creates a new mds-service, mds<span></span>.label ([pr#66884](https://github.com/ceph/ceph/pull/66884), Dnyaneshwari Talwekar)

- mgr/dashboard: Dashboard nfs export editor rejects ipv6 addresses ([pr#65242](https://github.com/ceph/ceph/pull/65242), Afreen Misbah)

- mgr/dashboard: fix access control permissions for roles ([pr#62454](https://github.com/ceph/ceph/pull/62454), Nizamudeen A)

- mgr/dashboard: fix bucket replication disable ([pr#64776](https://github.com/ceph/ceph/pull/64776), Naman Munet)

- mgr/dashboard: fix health popover not showing ([pr#66145](https://github.com/ceph/ceph/pull/66145), Nizamudeen A)

- mgr/dashboard: Fix inline markup warning in API documentation ([pr#64269](https://github.com/ceph/ceph/pull/64269), Kefu Chai)

- mgr/dashboard: fix nvmeof mtls ([pr#65167](https://github.com/ceph/ceph/pull/65167), Tomer Haskalovitch)

- mgr/dashboard: fix zone update API forcing STANDARD storage class ([pr#65620](https://github.com/ceph/ceph/pull/65620), Aashish Sharma)

- mgr/dashboard: Fixed incorrect snapshot scheduled date for rbd block in GUI ([pr#64880](https://github.com/ceph/ceph/pull/64880), Abhishek Desai)

- mgr/dashboard: service creation fails if service name is same as service type ([pr#66480](https://github.com/ceph/ceph/pull/66480), Naman Munet)

- mgr/dashboard: update teuth\_ref hash in api test ([pr#66707](https://github.com/ceph/ceph/pull/66707), Nizamudeen A)

- mgr/dashboard: use system packages when running tox ([pr#64613](https://github.com/ceph/ceph/pull/64613), Nizamudeen A, Paulo E. Castro)

- mgr/Mgr<span></span>.cc: clear daemon health metrics instead of removing down/out osd from daemon state ([pr#67527](https://github.com/ceph/ceph/pull/67527), Cory Snyder)

- mgr/nfs: make sure sectype is a list when parsed ([pr#63115](https://github.com/ceph/ceph/pull/63115), Adam King)

- mgr/nfs: scrape nfs monitoring endpoint ([pr#64081](https://github.com/ceph/ceph/pull/64081), avanthakkar)

- mgr/orchestrator: allow passing group to apply/add nvmeof commands ([pr#59880](https://github.com/ceph/ceph/pull/59880), Adam King)

- mgr/orchestrator: fix nvmeof group parameter for backward compatibility ([pr#67623](https://github.com/ceph/ceph/pull/67623), Kefu Chai, Alexander Indenbaum)

- mgr/snap\_schedule: correctly fetch mds\_max\_snaps\_per\_dir from mds ([pr#59647](https://github.com/ceph/ceph/pull/59647), Milind Changire)

- mgr/telemetry: add stretch cluster data ([pr#66389](https://github.com/ceph/ceph/pull/66389), Naveen Naidu)

- mgr/vol: add command to get snapshot path ([pr#62918](https://github.com/ceph/ceph/pull/62918), Rishabh Dave)

- mgr/vol: include group name in subvolume's pool namespace name ([pr#64205](https://github.com/ceph/ceph/pull/64205), Rishabh Dave)

- mgr/vol: keep and show clone source info ([pr#64652](https://github.com/ceph/ceph/pull/64652), Rishabh Dave)

- mgr/vol: make "snapshot getpath" cmd work with v1 and legacy ([pr#63222](https://github.com/ceph/ceph/pull/63222), Rishabh Dave)

- mgr: avoid explicit dropping of ref ([pr#65006](https://github.com/ceph/ceph/pull/65006), Milind Changire)

- mon,cephfs: require confirmation when changing max\_mds on unhealthy cluster ([pr#60398](https://github.com/ceph/ceph/pull/60398), Rishabh Dave)

- mon/HealthMonitor: avoid MON\_DOWN for freshly added Monitor ([pr#67324](https://github.com/ceph/ceph/pull/67324), Patrick Donnelly)

- mon/MgrMonitor: add a space before "is already disabled" ([pr#64686](https://github.com/ceph/ceph/pull/64686), Zehua Qi)

- mon/MonMap: Dump addr in backward compatible format ([pr#68323](https://github.com/ceph/ceph/pull/68323), Anoop C S)

- mon/OSDMonitor: call no\_reply() on ignored osd alive ([pr#64509](https://github.com/ceph/ceph/pull/64509), Nitzan Mordechai)

- mon: Track and process pending pings after election ([pr#62924](https://github.com/ceph/ceph/pull/62924), Kamoltat Sirivadhna)

- monc: synchronize tick() of MonClient with shutdown() ([pr#66915](https://github.com/ceph/ceph/pull/66915), Radoslaw Zarzynski)

- monitor: Enhance historic ops command output and error handling ([pr#64842](https://github.com/ceph/ceph/pull/64842), Nitzan Mordechai)

- monitoring: add user-agent headers to the urllib ([pr#65475](https://github.com/ceph/ceph/pull/65475), Nizamudeen A)

- monitoring: fix "In" OSDs in Cluster-Advanced grafana panel<span></span>. Also change units from decbytes to bytes wherever used in the panel ([pr#65671](https://github.com/ceph/ceph/pull/65671), Aashish Sharma)

- monitoring: fix CephPgImbalance alert rule expression ([pr#66829](https://github.com/ceph/ceph/pull/66829), Aashish Sharma)

- monitoring: fix MTU Mismatch alert rule and expr ([pr#65709](https://github.com/ceph/ceph/pull/65709), Aashish Sharma)

- monitoring: fix rgw\_servers filtering in rgw sync overview grafana ([pr#66990](https://github.com/ceph/ceph/pull/66990), Aashish Sharma)

- monitoring: make cluster matcher backward compatible for pre-7<span></span>.1 metrics ([pr#66985](https://github.com/ceph/ceph/pull/66985), Aashish Sharma)

- monitoring: upgrade grafana version to 12<span></span>.3<span></span>.1 ([pr#66964](https://github.com/ceph/ceph/pull/66964), Aashish Sharma)

- msg/async: Encode message once features are set ([pr#65624](https://github.com/ceph/ceph/pull/65624), Aishwarya Mathuria)

- msg: drain stack before stopping processors to avoid shutdown hang ([pr#64924](https://github.com/ceph/ceph/pull/64924), Nitzan Mordechai)

- os/bluestore: compact patch to fix extent map resharding ([pr#66518](https://github.com/ceph/ceph/pull/66518), Igor Fedotov, Adam Kupczyk)

- os/bluestore: Disable invoking unittest\_deferred ([pr#66357](https://github.com/ceph/ceph/pull/66357), Adam Kupczyk)

- os/bluestore: Fix default base size for histogram ([pr#67398](https://github.com/ceph/ceph/pull/67398), Adam Kupczyk)

- os/bluestore: In BlueFS::truncate accept wierd alloc\_unit ([pr#63753](https://github.com/ceph/ceph/pull/63753), Adam Kupczyk)

- os/bluestore:fix bluestore\_volume\_selection\_reserved\_factor usage ([pr#66838](https://github.com/ceph/ceph/pull/66838), Igor Fedotov)

- osd/PrimaryLogPG: encode an empty data\_bl for empty sparse reads ([pr#67356](https://github.com/ceph/ceph/pull/67356), Ilya Dryomov)

- osd/scrub: avoid using moved-from auth\_n\_errs ([pr#66247](https://github.com/ceph/ceph/pull/66247), Ronen Friedman)

- osd/scrub: do not limit operator-initiated repairs ([pr#64915](https://github.com/ceph/ceph/pull/64915), Ronen Friedman)

- osd/scrub: do not reduce min chunk on preemption ([pr#66236](https://github.com/ceph/ceph/pull/66236), Ronen Friedman)

- osd: Access/Modify epoch maps under mutex in OSDSuperblock class ([pr#64732](https://github.com/ceph/ceph/pull/64732), Mohit Agrawal)

- osd: add clear\_shards\_repaired command ([pr#60567](https://github.com/ceph/ceph/pull/60567), Daniel Radjenovic)

- osd: stop scrub\_purged\_snaps() from ignoring osd\_beacon\_report\_interval ([pr#65584](https://github.com/ceph/ceph/pull/65584), Radoslaw Zarzynski)

- OSDMonitor: Make sure pcm is initialised ([pr#63804](https://github.com/ceph/ceph/pull/63804), Brad Hubbard)

- pybind/mgr/dashboard: Use teuthology's actual requirements ([pr#65417](https://github.com/ceph/ceph/pull/65417), David Galloway)

- pybind/mgr: Fix missing empty lines in mgr\_module<span></span>.py ([pr#64266](https://github.com/ceph/ceph/pull/64266), Ville Ojamo)

- pybind/mgr: pin cheroot version in requirements-required<span></span>.txt ([pr#65636](https://github.com/ceph/ceph/pull/65636), Nizamudeen A, Adam King)

- pybind/rados: fix the incorrect order of offset,length in WriteOp<span></span>.zero ([pr#61894](https://github.com/ceph/ceph/pull/61894), Wang Chao)

- qa/cephadm: stop cephadm mgr module during cleanup ([pr#61905](https://github.com/ceph/ceph/pull/61905), Adam King)

- qa/cephfs: ignore warning that pg is stuck peering for upgrade jobs ([pr#65449](https://github.com/ceph/ceph/pull/65449), Rishabh Dave)

- qa/cephfs: ignore when specific OSD is reported down during upgrade ([pr#60391](https://github.com/ceph/ceph/pull/60391), Rishabh Dave)

- qa/cephfs: override testing kernel with -k option ([pr#61301](https://github.com/ceph/ceph/pull/61301), Patrick Donnelly)

- qa/cephfs: randomize configs in `fs:thrash:workloads` ([pr#60839](https://github.com/ceph/ceph/pull/60839), Venky Shankar, Patrick Donnelly)

- qa/cephfs: update ignorelist ([pr#61417](https://github.com/ceph/ceph/pull/61417), Rishabh Dave)

- qa/rbd/iscsi: ignore MON\_DOWN warning in logs ([pr#64597](https://github.com/ceph/ceph/pull/64597), Adam King)

- qa/rgw: bucket notifications use pynose ([pr#67450](https://github.com/ceph/ceph/pull/67450), Casey Bodley)

- qa/rgw: remove hadoop-s3a subsuite ([pr#64668](https://github.com/ceph/ceph/pull/64668), Casey Bodley)

- qa/standalone/scrub: fix "scrubbed in 0ms" in osd-scrub-test<span></span>.sh ([pr#64455](https://github.com/ceph/ceph/pull/64455), Ronen Friedman)

- qa/standalone: fix/improve bluefs tests ([pr#67884](https://github.com/ceph/ceph/pull/67884), Igor Fedotov)

- qa/suites/krbd: use a standard fixed-1 cluster in unmap subsuite ([pr#64919](https://github.com/ceph/ceph/pull/64919), Ilya Dryomov)

- qa/suites/upgrade: add "Replacing daemon mds" to ignorelist ([issue#71615](http://tracker.ceph.com/issues/71615), [issue#50279](http://tracker.ceph.com/issues/50279), [pr#65298](https://github.com/ceph/ceph/pull/65298), Venky Shankar)

- qa/tasks/backfill\_toofull<span></span>.py: Fix assert failures with & without compression ([pr#68119](https://github.com/ceph/ceph/pull/68119), Sridhar Seshasayee)

- qa/tasks/ceph\_manager: population must be a sequence ([pr#64747](https://github.com/ceph/ceph/pull/64747), Kyr Shatskyy)

- qa/tasks/cephfs/mount: use 'ip route' instead 'route' ([pr#63130](https://github.com/ceph/ceph/pull/63130), Kyr Shatskyy)

- qa/tasks/mgr: test\_module\_selftest set influx hostname to avoid warnings ([pr#67800](https://github.com/ceph/ceph/pull/67800), Nitzan Mordechai)

- qa/tasks/rbd\_mirror\_thrash: don't use random<span></span>.randrange() on floats ([pr#67162](https://github.com/ceph/ceph/pull/67162), Ilya Dryomov)

- qa/tasks/thrashosds-health: whitelist PG\_BACKFILL\_FULL ([pr#66973](https://github.com/ceph/ceph/pull/66973), Naveen Naidu)

- qa/tasks/workunit: fix no module named 'pipes' ([pr#66251](https://github.com/ceph/ceph/pull/66251), Kyr Shatskyy)

- qa/tasks: generalize stuck pg ignorelist entry ([pr#64420](https://github.com/ceph/ceph/pull/64420), Laura Flores)

- qa/tasks: make rbd\_mirror\_thrash inherit from ThrasherGreenlet ([pr#67794](https://github.com/ceph/ceph/pull/67794), Ilya Dryomov)

- qa/tests: added 19<span></span>.2<span></span>.3 to the mix ([pr#65244](https://github.com/ceph/ceph/pull/65244), Yuri Weinstein)

- qa/tests: added initial test for `client-upgrade-squid-tentacle` ([pr#64897](https://github.com/ceph/ceph/pull/64897), Yuri Weinstein)

- qa/valgrind<span></span>.supp: make gcm\_cipher\_internal suppression more resilient ([pr#67280](https://github.com/ceph/ceph/pull/67280), Ilya Dryomov)

- qa/workunits/cephtool: add extra privileges to cephtool script ([pr#63026](https://github.com/ceph/ceph/pull/63026), Laura Flores)

- qa/workunits/fs/misc: remove data pool cleanup ([pr#63018](https://github.com/ceph/ceph/pull/63018), Patrick Donnelly)

- qa/workunits/rbd: adapt rbd\_mirror<span></span>.sh for trial nodes ([pr#67151](https://github.com/ceph/ceph/pull/67151), Ilya Dryomov)

- qa/workunits/rbd: reduce randomized sleeps in live import tests ([pr#67153](https://github.com/ceph/ceph/pull/67153), Ilya Dryomov)

- qa/workunits/rgw: drop netstat usage ([pr#67185](https://github.com/ceph/ceph/pull/67185), Kyr Shatskyy)

- qa: add missing <span></span>.qa links ([pr#67497](https://github.com/ceph/ceph/pull/67497), Patrick Donnelly)

- qa: correct daemon for warning conf ([pr#61304](https://github.com/ceph/ceph/pull/61304), Patrick Donnelly)

- qa: Disable OSD benchmark from running for tests ([pr#67066](https://github.com/ceph/ceph/pull/67066), Sridhar Seshasayee)

- qa: do not fail cephfs QA tests for slow bluestore ops ([pr#61302](https://github.com/ceph/ceph/pull/61302), Patrick Donnelly)

- qa: do read checks with non-empty file ([pr#61858](https://github.com/ceph/ceph/pull/61858), Patrick Donnelly)

- qa: don't assume that /dev/sda or /dev/vda is present in unmap<span></span>.t ([pr#67076](https://github.com/ceph/ceph/pull/67076), Ilya Dryomov)

- qa: fix multi-fs tests in test\_mds\_metrics<span></span>.py ([pr#64336](https://github.com/ceph/ceph/pull/64336), Jos Collin)

- qa: ignore cluster warning (evicting unresponsive <span></span>.<span></span>.<span></span>.) with tasks/mgr-osd-full ([issue#73278](http://tracker.ceph.com/issues/73278), [pr#66126](https://github.com/ceph/ceph/pull/66126), Venky Shankar)

- qa: ignore pg availability/degraded warnings ([pr#61303](https://github.com/ceph/ceph/pull/61303), Patrick Donnelly)

- qa: ignore variant of down fs ([pr#62091](https://github.com/ceph/ceph/pull/62091), Patrick Donnelly)

- qa: ignore warnings variations ([pr#59617](https://github.com/ceph/ceph/pull/59617), Patrick Donnelly)

- qa: increase the wait time to prevent check\_counter failing ([pr#64449](https://github.com/ceph/ceph/pull/64449), Jos Collin)

- qa: krbd\_blkroset<span></span>.t: eliminate a race in the open\_count test ([pr#67074](https://github.com/ceph/ceph/pull/67074), Ilya Dryomov)

- qa: krbd\_rxbounce<span></span>.sh: do more reads to generate more errors ([pr#67454](https://github.com/ceph/ceph/pull/67454), Ilya Dryomov)

- qa: make test\_progress atomically capture OSD marked in/out events ([pr#67761](https://github.com/ceph/ceph/pull/67761), Kamoltat (Junior) Sirivadhna)

- qa: multiple fixes in test\_mirroring<span></span>.py ([pr#59829](https://github.com/ceph/ceph/pull/59829), Jos Collin)

- qa: rbd\_mirror\_fsx\_compare<span></span>.sh doesn't error out as expected ([pr#67796](https://github.com/ceph/ceph/pull/67796), Ilya Dryomov)

- qa: relocate subvol creation overrides and test ([pr#59922](https://github.com/ceph/ceph/pull/59922), Milind Changire)

- qa: some test set `refuse\_client\_session`, so the cluster log is expected ([issue#66639](http://tracker.ceph.com/issues/66639), [pr#59688](https://github.com/ceph/ceph/pull/59688), Venky Shankar)

- qa: suppress OpenSSL valgrind leaks ([pr#65661](https://github.com/ceph/ceph/pull/65661), Laura Flores)

- qa: use a larger timeout for kernel\_untar\_build workunit ([issue#68855](http://tracker.ceph.com/issues/68855), [pr#65280](https://github.com/ceph/ceph/pull/65280), Venky Shankar)

- rbd-mirror: add cluster fsid to remote meta cache key ([pr#66296](https://github.com/ceph/ceph/pull/66296), Mykola Golub)

- rbd-mirror: allow incomplete demote snapshot to sync after rbd-mirror daemon restart ([pr#66165](https://github.com/ceph/ceph/pull/66165), VinayBhaskar-V)

- rbd-mirror: prevent image deletion if remote image is not primary ([pr#64739](https://github.com/ceph/ceph/pull/64739), VinayBhaskar-V)

- Recent pipeline backports ([pr#65249](https://github.com/ceph/ceph/pull/65249), Dan Mick)

- Revert "doc: mgr/dashboard: add OAuth2 SSO documentation" ([pr#66797](https://github.com/ceph/ceph/pull/66797), Ville Ojamo)

- Revert "pybind/mgr: Hack around the 'ImportError: PyO3 modules may on… ([pr#65959](https://github.com/ceph/ceph/pull/65959), Nizamudeen A)

- rgw-test: fix bug kafka unexpected keyword argument 'expected\_sizes' ([pr#66033](https://github.com/ceph/ceph/pull/66033), Hoai-Thu Vuong)

- rgw/account: bucket acls are not completely migrated once the user is migrated to an account ([pr#65665](https://github.com/ceph/ceph/pull/65665), kchheda3)

- rgw/admin: Add max-entries and marker to bucket list ([pr#65486](https://github.com/ceph/ceph/pull/65486), Tobias Urdin)

- rgw/lc: LCOpAction\_CurrentExpiration checks mtime for delete markers ([pr#65966](https://github.com/ceph/ceph/pull/65966), Casey Bodley)

- rgw/lc: stop using merge\_and\_store\_attrs in remove\_bucket\_config ([pr#64741](https://github.com/ceph/ceph/pull/64741), Casey Bodley)

- rgw/notification: Prevent reserved\_size leak by decrementing overhead on commit/abort ([pr#67575](https://github.com/ceph/ceph/pull/67575), Krunal Chheda, kchheda3)

- rgw/s3: remove 'aws-chunked' from Content-Encoding response ([pr#65219](https://github.com/ceph/ceph/pull/65219), Casey Bodley)

- rgw: add metric when send message with kafka and ampq ([pr#65903](https://github.com/ceph/ceph/pull/65903), Hoai-Thu Vuong)

- rgw: allow specifying ssl certificate for radosgw-admin operations ([pr#64357](https://github.com/ceph/ceph/pull/64357), Mark Kogan)

- rgw: beast add ssl hot-reload ([pr#66289](https://github.com/ceph/ceph/pull/66289), Anthony D'Atri, Yuval Lifshitz, Henry Richter)

- rgw: check all JWKS for STS ([pr#64936](https://github.com/ceph/ceph/pull/64936), Alex Wojno)

- rgw: discard olh\\_ attributes when copying object from a versioning-suspended bucket to a versioning-disabled bucket ([pr#65556](https://github.com/ceph/ceph/pull/65556), Jane Zhu)

- rgw: don't use merge\_and\_store\_attrs() when recreating a bucket ([pr#64387](https://github.com/ceph/ceph/pull/64387), Casey Bodley)

- rgw: fix 'bucket rm --bypass-gc' for copied objects ([pr#66003](https://github.com/ceph/ceph/pull/66003), Casey Bodley)

- rgw: fix `radosgw-admin object unlink <span></span>.<span></span>.<span></span>.` ([pr#66152](https://github.com/ceph/ceph/pull/66152), J. Eric Ivancich)

- rgw: fix empty storage class on display of multipart uploads ([pr#64313](https://github.com/ceph/ceph/pull/64313), J. Eric Ivancich)

- rgw: fix v2 topics radosgw-admin output in test ([pr#64485](https://github.com/ceph/ceph/pull/64485), Yuval Lifshitz)

- rgw: java s3-tests change setting of JAVA\_HOME ([pr#68227](https://github.com/ceph/ceph/pull/68227), J. Eric Ivancich)

- rgw: make keystone work without admin token(service ac requirement) ([pr#64202](https://github.com/ceph/ceph/pull/64202), Deepika Upadhyay)

- RGW: multi object delete op; skip olh update for all deletes but the last one ([pr#65500](https://github.com/ceph/ceph/pull/65500), Oguzhan Ozmen)

- rgw: trigger resharding of versioned buckets sooner ([pr#63567](https://github.com/ceph/ceph/pull/63567), J. Eric Ivancich, Casey Bodley, Mykola Golub)

- rgw: update keystone repo stable branch to 2024<span></span>.2 ([pr#66242](https://github.com/ceph/ceph/pull/66242), Kyr Shatskyy)

- RGW:fix obj by multipart upload cant get tag ([pr#66335](https://github.com/ceph/ceph/pull/66335), Raja Sharma)

- Rocky 9/10 support backports ([pr#64780](https://github.com/ceph/ceph/pull/64780), Zack Cerza, John Mulligan, David Galloway)

- run-make-check<span></span>.sh: handle sudo and command that may not run in container ([pr#65838](https://github.com/ceph/ceph/pull/65838), John Mulligan)

- src/ceph\_osd, osd: Implement running benchmark during OSD creation - Phase 1 ([pr#65523](https://github.com/ceph/ceph/pull/65523), Sridhar Seshasayee)

- src/common: add guidance for mon\_warn\_pg\_not\_scrubbed ([pr#62551](https://github.com/ceph/ceph/pull/62551), Zac Dover)

- src/pybind/mgr/pg\_autoscaler/module<span></span>.py: fix 'pg\_autoscale\_mode' output ([pr#59443](https://github.com/ceph/ceph/pull/59443), Kamoltat)

- suites/rados/cephadm: typo in ignore list for still running message ([pr#65444](https://github.com/ceph/ceph/pull/65444), Nitzan Mordechai)

- sync build-with-container patches from main ([pr#65844](https://github.com/ceph/ceph/pull/65844), John Mulligan, Dan Mick)

- tasks/cbt\_performance: Tolerate exceptions during performance data up… ([pr#66104](https://github.com/ceph/ceph/pull/66104), Nitzan Mordechai)

- tasks/cephfs/mount: use 192<span></span>.168<span></span>.144<span></span>.0<span></span>.0/20 for brxnet ([pr#63133](https://github.com/ceph/ceph/pull/63133), Kyr Shatskyy)

- test-rgw-multisite: create default realm in multisite test script ([pr#65273](https://github.com/ceph/ceph/pull/65273), Shilpa Jagannath)

- test/common: unittest\_fault\_injector omits unit-main target ([pr#63981](https://github.com/ceph/ceph/pull/63981), Casey Bodley)

- test/encoding/readable: Add backward incompat checks ([pr#67392](https://github.com/ceph/ceph/pull/67392), Nitzan Mordechai)

- test/libcephfs: copy DT\_NEEDED entries from input libraries ([pr#63720](https://github.com/ceph/ceph/pull/63720), Patrick Donnelly)

- test/rbd: remove unit tests about cache tiering ([pr#64589](https://github.com/ceph/ceph/pull/64589), Laura Flores)

- test/rgw/kafka: fix kafka relase to more recent one ([pr#67994](https://github.com/ceph/ceph/pull/67994), Yuval Lifshitz)

- test: disable known flaky tests in run-rbd-unit-tests ([pr#67558](https://github.com/ceph/ceph/pull/67558), Ilya Dryomov)

- test: use json\_extract instead of awkward json\_tree ([pr#67322](https://github.com/ceph/ceph/pull/67322), Patrick Donnelly)

- The compilation of ISAL compress in the current code depends on the macro HAVE\_NASM\_X64\_AVX2<span></span>. However, the macro HAVE\_NASM\_X64\_AVX2 has been removed, resulting in the compression not using ISAL even if the compressor\_zlib\_isal parameter is set to true ([pr#64815](https://github.com/ceph/ceph/pull/64815), Yao guotao)

- tools: handle get-attr as read-only ops in ceph\_objectstore\_tool ([pr#66538](https://github.com/ceph/ceph/pull/66538), Jaya Prakash)

- tools: respect set features when adding addresses ([pr#62061](https://github.com/ceph/ceph/pull/62061), Radosław Zarzyński)

- Wip trackers 50371 67352 67489 69639 squid ([pr#62472](https://github.com/ceph/ceph/pull/62472), Brad Hubbard, Patrick Donnelly)
