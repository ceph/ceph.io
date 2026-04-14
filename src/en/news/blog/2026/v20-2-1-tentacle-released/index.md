---
title: "v20.2.1 Tentacle released"
date: "2026-04-06"
author: "Yuri Weinstein"
tags:
  - "release"
  - "reef"
---
This is the first minor release in the Tentacle series. 
We recommend that all users update to this release.

Release Date
------------

April 06, 2026

Notable Changes
---------------

OSD / BlueStore
---------------

* EC Recovery: Fixed a length calculation bug in erase_after_ro_offset() that caused empty shards to retain data, leading to shard_size >= tobj_size assertion failures when recovering small objects in EC pools.
* BlueFS Volume Selector: Updated the BlueFS volume selector to properly account for file size changes when recovering the WAL in envelope mode.
* BlueFS: Fixed a bug where stat() missed the actual file size update after indexing WAL envelope files.

Monitor (mon)
-------------

* Fast EC Restrictions: Denied the ability to enable EC optimizations ("fast EC") for non-4K-aligned chunk sizes. Unaligned chunk sizes handled by fast EC perform poorly and suffer from bugs, so attempts to force this configuration are now rejected.
* Peering: Ensured ceph pg repeer proposes a correctly sized pg temp, as optimized EC cannot cope with mismatched sizes.
* NVMeoF Gateway: Added a new nvme-gw listeners command to display all existing listeners (including auto-listeners) inside a pool/group.
* NVMeoF Failover: Overhauled the NVMeoF Gateway fast-failover logic. Beacon timeouts are now evaluated within prepare_beacon to support shorter intervals, and the mechanism for detecting monitor slowness was improved.

librbd & rbd-mirror
-------------------

* RBD: Introduced a new ``RBD_LOCK_MODE_EXCLUSIVE_TRANSIENT`` policy for ``rbd_lock_acquire()``. This is a low-level interface intended to allow a peer to grab exclusive lock manually for short periods of time with other peers pausing their activity and waiting for the lock to be released rather than instantly aborting I/O and returning an error. It's possible to switch from ``RBD_LOCK_MODE_EXCLUSIVE`` to ``RBD_LOCK_MODE_EXCLUSIVE_TRANSIENT`` policy and vice versa even if the lock is already held.

Ceph Object Gateway (RGW)
-------------------------

* Multi-Part Operations: Fixed conditional validation handling in MultiWrite, Delete, and MultiDelete workflows.

mgr/dashboard
-------------

* UI Navigation: Redesigned the main landing page; the "Dashboard" navigation item was renamed to "Overview" and uses a new carbonized productive card layout.
* NVMeoF Management: Added the nvmeof get_subsystems CLI command, fixed JSON output indentation for NVMeoF CLI commands, and reverted the server_addr API parameter back to traddr for consistency.
* Hosts View: Fixed a bug causing the IP addresses of hosts to be hidden on the Hosts page due to an issue with fact merging.
* Forms & Modals: Standardized forms onto the Carbon Design System, including the pools form, service form, multi-site realm token export modal, delete zone modal, and password change forms.
* Form Validation: Generalized form error handling and validations using a new cdValidate directive.

mgr/cephadm
-----------

* Monitoring Stack: Bumped the default container image versions for the monitoring stack: Prometheus to v3.6.0, Node-exporter to v1.9.1, Alertmanager to v0.28.1, and Grafana to v12.2.0.

Security Changes
----------------

* Monitoring Stack Images: Updated Prometheus, Alertmanager, and Grafana container image versions, picking up upstream security and stability fixes.

Configuration Changes
---------------------

* ``bluefs_check_volume_selector_on_mount``: The previous bluefs_check_volume_selector_on_umount debug setting was renamed and repurposed. It now checks for volume selector inconsistencies on both mount and unmount phases.

* ``mon_nvmeofgw_beacon_grace``: The default grace period before marking a gateway as failed has been reduced from 10 seconds to 7 seconds for faster failover.

* ``nvmeof_mon_client_tick_period``: The default beacon tick interval has been lowered from 2 seconds to 1 second.

## Changelog

- [rgw][tentacle] backport of cloud-restore related PRs ([pr#65830](https://github.com/ceph/ceph/pull/65830), Soumya Koduri)

- Add normalization and casesensitive options to the subvolume group creation command ([pr#65564](https://github.com/ceph/ceph/pull/65564), Venky Shankar, Xavi Hernandez)

- auth: msgr2 can return incorrect allowed\_modes through AuthBadMethodFrame ([pr#65336](https://github.com/ceph/ceph/pull/65336), Miki Patel)

- backports variants improvements and Dockerfile<span></span>.build changes ([pr#66010](https://github.com/ceph/ceph/pull/66010), John Mulligan, Zack Cerza)

- Beacon diff ([pr#66958](https://github.com/ceph/ceph/pull/66958), Leonid Chernin, Samuel Just)

- blk/kernel: bring "bdev\_async\_discard" config parameter back ([pr#65609](https://github.com/ceph/ceph/pull/65609), Igor Fedotov)

- blk/kernel: improve DiscardThread life cycle ([pr#65213](https://github.com/ceph/ceph/pull/65213), Igor Fedotov)

- bluestore/BlueFS: fix bytes\_written\_slow counter with aio\_write ([pr#66355](https://github.com/ceph/ceph/pull/66355), chungfengz)

- build-with-container: add argument groups to organize options ([pr#65628](https://github.com/ceph/ceph/pull/65628), John Mulligan)

- build-with-container: build image variants ([pr#65946](https://github.com/ceph/ceph/pull/65946), John Mulligan)

- ceph-mixin: Update monitoring mixin ([pr#65692](https://github.com/ceph/ceph/pull/65692), Aashish Sharma, SuperQ, Ankush Behl)

- ceph-volume: fix UdevData initialisation from empty /run/udev/data/\* file ([pr#65923](https://github.com/ceph/ceph/pull/65923), Matteo Paramatti)

- ceph-volume: lvm<span></span>.Lvm<span></span>.setup\_metadata\_devices refactor ([pr#65925](https://github.com/ceph/ceph/pull/65925), Guillaume Abrioux)

- ceph-volume: support additional dmcrypt params ([pr#65544](https://github.com/ceph/ceph/pull/65544), Guillaume Abrioux)

- ceph-volume: use udev data instead of LVM subprocess in get\_devices() ([pr#65921](https://github.com/ceph/ceph/pull/65921), Guillaume Abrioux)

- ceph\_release, doc/dev: update tentacle as stable release ([pr#65988](https://github.com/ceph/ceph/pull/65988), Laura Flores)

- cephadm, debian/rules: Use system packages for cephadm bundled dependencies ([pr#66256](https://github.com/ceph/ceph/pull/66256), Kefu Chai)

- cephadm: fix building rpm-sourced cephadm zippapp on el10 ([pr#65292](https://github.com/ceph/ceph/pull/65292), John Mulligan)

- cephadm: set default image for tentacle release ([pr#65719](https://github.com/ceph/ceph/pull/65719), Adam King)

- cephadm: support custom distros by falling back to ID\_LIKE ([pr#65696](https://github.com/ceph/ceph/pull/65696), bachmanity1)

- cephfs-journal-tool: Journal trimming issue ([pr#65601](https://github.com/ceph/ceph/pull/65601), Kotresh HR)

- client: fix async/sync I/O stalling due to buffer list exceeding INT\_MAX ([pr#65256](https://github.com/ceph/ceph/pull/65256), Dhairya Parmar)

- client: fix dump\_mds\_requests to valid json format ([issue#73639](http://tracker.ceph.com/issues/73639), [pr#66156](https://github.com/ceph/ceph/pull/66156), haoyixing)

- client: fix unmount hang after lookups ([pr#65254](https://github.com/ceph/ceph/pull/65254), Dhairya Parmar)

- client: use path supplied in statfs ([pr#65132](https://github.com/ceph/ceph/pull/65132), Christopher Hoffman)

- common/frag: properly convert frag\_t to net/store endianness ([pr#66540](https://github.com/ceph/ceph/pull/66540), Patrick Donnelly, Max Kellermann)

- common: Allow PerfCounters to return a provided service ID ([pr#65587](https://github.com/ceph/ceph/pull/65587), Adam C. Emerson)

- debian/control: add iproute2 to build dependencies ([pr#66737](https://github.com/ceph/ceph/pull/66737), Kefu Chai)

- debian/control: Add libxsimd-dev build dependency for vendored Arrow ([pr#66248](https://github.com/ceph/ceph/pull/66248), Kefu Chai)

- debian/control: record python3-packaging dependency for ceph-volume ([pr#66590](https://github.com/ceph/ceph/pull/66590), Thomas Lamprecht, Max R. Carrara)

- doc/cephfs: fix docs for pause\_purging and pause\_cloning ([pr#66452](https://github.com/ceph/ceph/pull/66452), Rishabh Dave)

- doc/mgr/smb: document the 'provider' option for smb share ([pr#65617](https://github.com/ceph/ceph/pull/65617), Sachin Prabhu)

- doc/radosgw: change all intra-docs links to use ref (1 of 6) ([pr#67043](https://github.com/ceph/ceph/pull/67043), Ville Ojamo)

- doc/radosgw: change all intra-docs links to use ref (2 of 6) ([pr#67084](https://github.com/ceph/ceph/pull/67084), Ville Ojamo)

- doc/radosgw: Cosmetic improvements and ref links in account<span></span>.rst ([pr#67064](https://github.com/ceph/ceph/pull/67064), Ville Ojamo)

- doc/rbd/rbd-config-ref: add clone settings section ([pr#66175](https://github.com/ceph/ceph/pull/66175), Ilya Dryomov)

- doc: add Tentacle to os recommendations ([pr#66464](https://github.com/ceph/ceph/pull/66464), Casey Bodley, Joseph Mundackal)

- doc: fetch releases from main branch ([pr#67002](https://github.com/ceph/ceph/pull/67002), Patrick Donnelly)

- doc: Pin pip to <25<span></span>.3 for RTD as a workaround for pybind in admin/doc-read-the-docs<span></span>.txt ([pr#66106](https://github.com/ceph/ceph/pull/66106), Ville Ojamo)

- doc: Remove sphinxcontrib-seqdiag Python package from RTD builds ([pr#67296](https://github.com/ceph/ceph/pull/67296), Ville Ojamo)

- doc: Update dashboard pending release notes ([pr#65984](https://github.com/ceph/ceph/pull/65984), Afreen Misbah)

- encode: Fix bad use of DENC\_DUMP\_PRE ([pr#66565](https://github.com/ceph/ceph/pull/66565), Adam Kupczyk)

- Fast failover ([pr#67150](https://github.com/ceph/ceph/pull/67150), leonidc, Leonid Chernin)

- Fix multifs auth caps check ([pr#65358](https://github.com/ceph/ceph/pull/65358), Kotresh HR)

- Form retains old data when switching from edit to create ([pr#65654](https://github.com/ceph/ceph/pull/65654), pujashahu)

- Generalize error handling for angular forms ([pr#66904](https://github.com/ceph/ceph/pull/66904), Afreen Misbah)

- github: pin GH Actions to SHA-1 commit ([pr#65761](https://github.com/ceph/ceph/pull/65761), Ernesto Puerta)

- install-deps<span></span>.sh: install proper compiler version on Debian/Ubuntu ([pr#66015](https://github.com/ceph/ceph/pull/66015), Dan Mick)

- install-deps: Replace apt-mirror ([pr#66672](https://github.com/ceph/ceph/pull/66672), David Galloway)

- libcephfs: New feature - add ceph\_setlk and ceph\_getlk functions ([pr#65258](https://github.com/ceph/ceph/pull/65258), Giorgos Kappes)

- librbd: fix ExclusiveLock::accept\_request() when !is\_state\_locked() ([pr#66628](https://github.com/ceph/ceph/pull/66628), Ilya Dryomov)

- librbd: introduce RBD\_LOCK\_MODE\_EXCLUSIVE\_TRANSIENT ([pr#67279](https://github.com/ceph/ceph/pull/67279), Ilya Dryomov)

- mds/FSMap: fix join\_fscid being incorrectly reset for active MDS during filesystem removal ([pr#65777](https://github.com/ceph/ceph/pull/65777), ethanwu)

- mds/MDSDaemon: unlock `mds\_lock` while shutting down Beacon and others ([pr#64885](https://github.com/ceph/ceph/pull/64885), Max Kellermann)

- mds: dump export\_ephemeral\_random\_pin as double ([pr#65163](https://github.com/ceph/ceph/pull/65163), Enrico Bocchi)

- mds: fix rank 0 marked damaged if stopping fails after Elid flush ([pr#65778](https://github.com/ceph/ceph/pull/65778), ethanwu)

- mds: Fix readdir when osd is full ([pr#65346](https://github.com/ceph/ceph/pull/65346), Kotresh HR)

- mds: fix snapdiff result fragmentation ([pr#65362](https://github.com/ceph/ceph/pull/65362), Igor Fedotov, Md Mahamudur Rahaman Sajib)

- mds: include auth credential in session dump ([pr#65255](https://github.com/ceph/ceph/pull/65255), Patrick Donnelly)

- mds: Return ceph<span></span>.dir<span></span>.subvolume vxattr ([pr#65779](https://github.com/ceph/ceph/pull/65779), Edwin Rodriguez)

- mds: skip charmap handler check for MDS requests ([pr#64953](https://github.com/ceph/ceph/pull/64953), Patrick Donnelly)

- mds: wrong snap check for directory with parent snaps ([pr#65259](https://github.com/ceph/ceph/pull/65259), Patrick Donnelly)

- mgr/alerts: enforce ssl context to SMTP\_SSL ([pr#66140](https://github.com/ceph/ceph/pull/66140), Nizamudeen A)

- mgr/cephadm: Add some new fields to the cephadm NVMEoF spec file ([pr#66987](https://github.com/ceph/ceph/pull/66987), Gil Bregman)

- mgr/cephadm: bump monitoring stack versions ([pr#65895](https://github.com/ceph/ceph/pull/65895), Nizamudeen A)

- mgr/cephadm: Change the default of max hosts per namespace in NVMEoF to 16 ([pr#66819](https://github.com/ceph/ceph/pull/66819), Gil Bregman)

- mgr/cephadm: don't mark nvmeof daemons without pool and group in name as stray ([pr#65594](https://github.com/ceph/ceph/pull/65594), Adam King)

- mgr/cephadm: update grafana conf for disconnected environment ([pr#66209](https://github.com/ceph/ceph/pull/66209), Nizamudeen A)

- mgr/cephadm: Use a persistent volume to store Loki DB ([pr#66023](https://github.com/ceph/ceph/pull/66023), Aashish Sharma)

- mgr/DaemonServer: fixed mistype for mgr\_osd\_messages ([pr#63345](https://github.com/ceph/ceph/pull/63345), Konstantin Shalygin)

- mgr/DaemonState: Minimise time we hold the DaemonStateIndex lock ([pr#65464](https://github.com/ceph/ceph/pull/65464), Brad Hubbard)

- mgr/dasboard : Carbonize pools form ([pr#66789](https://github.com/ceph/ceph/pull/66789), Abhishek Desai, Ankit Kumar)

- mgr/dashboard :  Fixed labels issue ([pr#66603](https://github.com/ceph/ceph/pull/66603), Abhishek Desai)

- mgr/dashboard : Carbonize -> Report an issue modal ([pr#66048](https://github.com/ceph/ceph/pull/66048), Abhishek Desai)

- mgr/dashboard : fix - about model tooltip issue ([pr#66276](https://github.com/ceph/ceph/pull/66276), Devika Babrekar)

- mgr/dashboard : fix - CephFS Authorize Modal Update issue ([pr#66419](https://github.com/ceph/ceph/pull/66419), Devika Babrekar)

- mgr/dashboard : fix css for carbon input fields ([pr#65490](https://github.com/ceph/ceph/pull/65490), Abhishek Desai)

- mgr/dashboard : Fix secure-monitoring-stack creds issue ([pr#65943](https://github.com/ceph/ceph/pull/65943), Abhishek Desai)

- mgr/dashboard : Fixed mirrored image usage info bar ([pr#65491](https://github.com/ceph/ceph/pull/65491), Abhishek Desai)

- mgr/dashboard : Fixed usage bar for secondary site in rbd mirroing ([pr#65927](https://github.com/ceph/ceph/pull/65927), Abhishek Desai)

- mgr/dashboard : Fixed warning icon colour issue with carbon colour ([pr#66271](https://github.com/ceph/ceph/pull/66271), Abhishek Desai)

- mgr/dashboard : Hide suppressed  alert on landing page ([pr#65737](https://github.com/ceph/ceph/pull/65737), Abhishek Desai)

- mgr/dashboard : Remove subalerts details for multiple subalerts ([pr#66295](https://github.com/ceph/ceph/pull/66295), Abhishek Desai)

- mgr/dashboard : Skip calls until secure\_monitoring\_stack is enabled ([pr#65673](https://github.com/ceph/ceph/pull/65673), Abhishek Desai)

- mgr/dashboard: --no-group-append default value to False, aligned with old cli" ([pr#65678](https://github.com/ceph/ceph/pull/65678), Tomer Haskalovitch)

- mgr/dashboard: Add Archive zone configuration to the Dashboard ([pr#67131](https://github.com/ceph/ceph/pull/67131), Aashish Sharma)

- mgr/dashboard: add customizations to table-actions ([pr#65956](https://github.com/ceph/ceph/pull/65956), Naman Munet)

- mgr/dashboard: Add full page tearsheet component ([pr#66892](https://github.com/ceph/ceph/pull/66892), Afreen Misbah)

- mgr/dashboard: Add generic wizard component ([pr#66893](https://github.com/ceph/ceph/pull/66893), Afreen Misbah)

- mgr/dashboard: add get\_subsystem nvme command ([pr#66941](https://github.com/ceph/ceph/pull/66941), Tomer Haskalovitch)

- mgr/dashboard: add indentation to the json output of nvmeof cli commands ([pr#66940](https://github.com/ceph/ceph/pull/66940), Tomer Haskalovitch)

- mgr/dashboard: add multiple ceph users deletion ([pr#65658](https://github.com/ceph/ceph/pull/65658), Pedro Gonzalez Gomez)

- mgr/dashboard: add nsid param to ns add command ([pr#65677](https://github.com/ceph/ceph/pull/65677), Tomer Haskalovitch)

- mgr/dashboard: add nsid param to ns list command ([pr#65749](https://github.com/ceph/ceph/pull/65749), Tomer Haskalovitch)

- mgr/dashboard: Add overview page and change 'Dashboard' to 'Overview' ([pr#67118](https://github.com/ceph/ceph/pull/67118), Afreen Misbah)

- mgr/dashboard: Add productive card component ([pr#67147](https://github.com/ceph/ceph/pull/67147), Afreen Misbah)

- mgr/dashboard: add text-label-list component ([pr#66312](https://github.com/ceph/ceph/pull/66312), Pedro Gonzalez Gomez)

- mgr/dashboard: Adding QAT Compression dropdown on RGW Service form ([pr#66642](https://github.com/ceph/ceph/pull/66642), Devika Babrekar)

- mgr/dashboard: allow deletion of non-default zone and zonegroup ([pr#66211](https://github.com/ceph/ceph/pull/66211), Aashish Sharma)

- mgr/dashboard: Allow FQDN in Connect Cluster form -> Cluster API URL ([pr#65622](https://github.com/ceph/ceph/pull/65622), Aashish Sharma)

- mgr/dashboard: Blank entry for Storage Capacity in dashboard under Cluster > Expand Cluster > Review ([pr#65705](https://github.com/ceph/ceph/pull/65705), Naman Munet)

- mgr/dashboard: bump validator package to address vulnerability ([pr#66227](https://github.com/ceph/ceph/pull/66227), Naman Munet)

- mgr/dashboard: Carbonize - Multisite Zone ([pr#67117](https://github.com/ceph/ceph/pull/67117), Dnyaneshwari Talwekar)

- mgr/dashboard: Carbonize Administration module > Create Realm/Zone group/zone ([pr#66986](https://github.com/ceph/ceph/pull/66986), Dnyaneshwari Talwekar)

- mgr/dashboard: Carbonize multisite sync policy forms ([pr#66302](https://github.com/ceph/ceph/pull/66302), Naman Munet)

- mgr/dashboard: carbonize service form ([pr#66978](https://github.com/ceph/ceph/pull/66978), Pedro Gonzalez Gomez)

- mgr/dashboard: Carbonize the Change Password Form ([pr#66401](https://github.com/ceph/ceph/pull/66401), Afreen Misbah)

- mgr/dashboard: carbonize-delete-zone-modal ([pr#67100](https://github.com/ceph/ceph/pull/67100), Sagar Gopale)

- mgr/dashboard: carbonize-delete-zonegroup-modal ([pr#67014](https://github.com/ceph/ceph/pull/67014), Sagar Gopale)

- mgr/dashboard: carbonized-multisite-export-realm-token-modal ([pr#66649](https://github.com/ceph/ceph/pull/66649), Sagar Gopale)

- mgr/dashboard: change the default max namespace from 4096 to None in subsystem add command ([pr#65951](https://github.com/ceph/ceph/pull/65951), Tomer Haskalovitch)

- mgr/dashboard: Edit user via UI throwing multiple server errors ([pr#66081](https://github.com/ceph/ceph/pull/66081), Naman Munet)

- mgr/dashboard: empty-data-message ([pr#66902](https://github.com/ceph/ceph/pull/66902), Sagar Gopale)

- mgr/dashboard: fetch all namespaces in a gateway group ([pr#67140](https://github.com/ceph/ceph/pull/67140), Afreen Misbah)

- mgr/dashboard: fix command alias help message ([pr#65750](https://github.com/ceph/ceph/pull/65750), Tomer Haskalovitch)

- mgr/dashboard: fix dashboard freeze on missing smb permissions ([pr#65873](https://github.com/ceph/ceph/pull/65873), Pedro Gonzalez Gomez)

- mgr/dashboard: fix data mismatch in Advance section in Tiering ([pr#65672](https://github.com/ceph/ceph/pull/65672), Dnyaneshwari Talwekar)

- mgr/dashboard: Fix display of IP address in host page ([pr#67146](https://github.com/ceph/ceph/pull/67146), Afreen Misbah)

- mgr/dashboard: fix icon alignment in navigation header ([pr#66091](https://github.com/ceph/ceph/pull/66091), Naman Munet)

- mgr/dashboard: fix misaligned text links on login page ([pr#66052](https://github.com/ceph/ceph/pull/66052), prik73, Afreen Misbah)

- mgr/dashboard: fix missing schedule interval in rbd API ([pr#65560](https://github.com/ceph/ceph/pull/65560), Nizamudeen A)

- mgr/dashboard: fix multi-cluster route reload logic ([pr#66504](https://github.com/ceph/ceph/pull/66504), Aashish Sharma)

- mgr/dashboard: fix multisite wizard realm configuration mode ([pr#66017](https://github.com/ceph/ceph/pull/66017), Aashish Sharma)

- mgr/dashboard: fix None force param handling in ns add\_host so it won't raise exceptions ([pr#65679](https://github.com/ceph/ceph/pull/65679), Tomer Haskalovitch)

- mgr/dashboard: fix ns add and resize commands help ([pr#66939](https://github.com/ceph/ceph/pull/66939), Tomer Haskalovitch)

- mgr/dashboard: fix oauth2-service creation UI error ([pr#66139](https://github.com/ceph/ceph/pull/66139), Nizamudeen A)

- mgr/dashboard: fix prometheus API error when not configured ([pr#65856](https://github.com/ceph/ceph/pull/65856), Nizamudeen A)

- mgr/dashboard: fix rbd form mirroring toggle ([pr#65874](https://github.com/ceph/ceph/pull/65874), Nizamudeen A)

- mgr/dashboard: fix RBD mirror schedule inheritance in pool and image APIs ([pr#67107](https://github.com/ceph/ceph/pull/67107), Imran Imtiaz)

- mgr/dashboard: fix smb button and table column ([pr#65657](https://github.com/ceph/ceph/pull/65657), Pedro Gonzalez Gomez)

- mgr/dashboard: Fix table width expansion on manager module dropdown selection #74089 ([pr#66647](https://github.com/ceph/ceph/pull/66647), Sagar Gopale)

- mgr/dashboard: fix the separation between CLI and API only commands ([pr#65781](https://github.com/ceph/ceph/pull/65781), Tomer Haskalovitch)

- mgr/dashboard: Fix timestamps in APIs ([pr#66029](https://github.com/ceph/ceph/pull/66029), Afreen Misbah)

- mgr/dashboard: fix total capacity value in dashboard ([pr#65647](https://github.com/ceph/ceph/pull/65647), Nizamudeen A)

- mgr/dashboard: fix typo in error when gw does not exist ([pr#66956](https://github.com/ceph/ceph/pull/66956), Tomer Haskalovitch)

- mgr/dashboard: fix zone update API forcing STANDARD storage class ([pr#65619](https://github.com/ceph/ceph/pull/65619), Aashish Sharma)

- mgr/dashboard: fixes for quick-bootstrap script ([pr#67040](https://github.com/ceph/ceph/pull/67040), Nizamudeen A)

- mgr/dashboard: FS - Attach Command showing undefined for MountData ([pr#65675](https://github.com/ceph/ceph/pull/65675), Dnyaneshwari Talwekar)

- mgr/dashboard: Group similar alerts ([pr#65493](https://github.com/ceph/ceph/pull/65493), Abhishek Desai)

- mgr/dashboard: Handle pool creation in tiering local storage class creation ([pr#65680](https://github.com/ceph/ceph/pull/65680), Dnyaneshwari, Naman Munet)

- mgr/dashboard: Maintain sentence case consistency in side nav bar titles ([pr#66050](https://github.com/ceph/ceph/pull/66050), Aashish Sharma)

- mgr/dashboard: ns list now support not passing nqn param ([pr#65897](https://github.com/ceph/ceph/pull/65897), Tomer Haskalovitch)

- mgr/dashboard: raise exception if both size and rbd\_image\_size are being passed in ns add ([pr#65816](https://github.com/ceph/ceph/pull/65816), Tomer Haskalovitch)

- mgr/dashboard: rbd consistency group and snapshot APIs ([pr#66935](https://github.com/ceph/ceph/pull/66935), Imran Imtiaz)

- mgr/dashboard: Remove illegible texts from the dashboard ([pr#66306](https://github.com/ceph/ceph/pull/66306), Afreen Misbah)

- mgr/dashboard: remove not needed 'cli\_version' field from gw info com… ([pr#66942](https://github.com/ceph/ceph/pull/66942), Tomer Haskalovitch)

- mgr/dashboard: Remove the time dropdown from grafana iframe ([pr#65853](https://github.com/ceph/ceph/pull/65853), Abhishek Desai)

- mgr/dashboard: removes nx folder ([pr#67003](https://github.com/ceph/ceph/pull/67003), Afreen Misbah)

- mgr/dashboard: rename 'Zone Group' labels to 'Zonegroup' ([pr#66790](https://github.com/ceph/ceph/pull/66790), Sagar Gopale)

- mgr/dashboard: Rename Alerts tab to All Alerts ([pr#66532](https://github.com/ceph/ceph/pull/66532), Sagar Gopale)

- mgr/dashboard: Rename side-nav panel items ([pr#65846](https://github.com/ceph/ceph/pull/65846), Naman Munet)

- mgr/dashboard: replace bootstrap badges with carbon tags ([pr#66350](https://github.com/ceph/ceph/pull/66350), pujaoshahu)

- mgr/dashboard: replace usage or progress bar with carbon meter chart ([pr#66934](https://github.com/ceph/ceph/pull/66934), Naman Munet)

- mgr/dashboard: rgw accounts form group mode disable option is not working ([pr#66351](https://github.com/ceph/ceph/pull/66351), Naman Munet)

- mgr/dashboard: server side table rendering improvements ([pr#65828](https://github.com/ceph/ceph/pull/65828), Nizamudeen A)

- mgr/dashboard: service creation fails if service name is same as sevice type ([pr#66481](https://github.com/ceph/ceph/pull/66481), Naman Munet)

- mgr/dashboard: Set max subsystem count to 512 rather than 4096 ([pr#66284](https://github.com/ceph/ceph/pull/66284), Afreen Misbah)

- mgr/dashboard: support gw get\_stats and listener info ([pr#65896](https://github.com/ceph/ceph/pull/65896), Tomer Haskalovitch)

- mgr/dashboard: Tiering form - Placement Target in Advanced Section ([pr#65653](https://github.com/ceph/ceph/pull/65653), Dnyaneshwari Talwekar)

- mgr/dashboard: update teuth\_ref hash in api test ([pr#66706](https://github.com/ceph/ceph/pull/66706), Nizamudeen A)

- mgr/dashboard:[NFS] add Subvolume Groups and Subvolumes in "Edit NFS Export form" ([pr#65650](https://github.com/ceph/ceph/pull/65650), Dnyaneshwari Talwekar)

- mgr/prometheus: Handle empty/invalid JSON from orch get-security-config ([pr#65906](https://github.com/ceph/ceph/pull/65906), Sunnatillo)

- mgr/telemetry: add 'ec\_optimizations' flag to 'basic\_pool\_flags' collection ([pr#65969](https://github.com/ceph/ceph/pull/65969), Laura Flores)

- mgr/vol: handling the failed non-atomic operation ([pr#65728](https://github.com/ceph/ceph/pull/65728), Neeraj Pratap Singh)

- mgr/vol: keep and show clone source info ([pr#64650](https://github.com/ceph/ceph/pull/64650), Rishabh Dave)

- mgr/volumes: Keep mon caps if auth key has remaining mds/osd caps ([pr#65262](https://github.com/ceph/ceph/pull/65262), Enrico Bocchi)

- mgr/volumes: remove unnecessary log error lines from earmark handling ([pr#66991](https://github.com/ceph/ceph/pull/66991), Avan Thakkar)

- mgr: avoid explicit dropping of ref ([pr#65005](https://github.com/ceph/ceph/pull/65005), Milind Changire)

- mgr:python: avoid pyo3 errors by running certain cryptographic functions in a child process ([pr#66794](https://github.com/ceph/ceph/pull/66794), Nizamudeen A, John Mulligan, Paulo E. Castro)

- mon/FSCommands: avoid unreachable code triggering compiler warning ([pr#65261](https://github.com/ceph/ceph/pull/65261), Patrick Donnelly)

- mon/MgrMonitor: add a space before "is already disabled" ([pr#64687](https://github.com/ceph/ceph/pull/64687), Zehua Qi)

- mon/OSDMonitor<span></span>.cc: optionally display availability status in json ([pr#65794](https://github.com/ceph/ceph/pull/65794), Shraddha Agrawal)

- mon: Add command "nvme-gw listeners" ([pr#66584](https://github.com/ceph/ceph/pull/66584), Vallari Agrawal)

- mon: ceph pg repeer should propose a correctly sized pg temp ([pr#66324](https://github.com/ceph/ceph/pull/66324), Alex Ainscow)

- mon: Deny EC optimizations (fast EC) for non-4k-aligned chunk-sizes ([pr#67319](https://github.com/ceph/ceph/pull/67319), Alex Ainscow)

- monc: synchronize tick() of MonClient with shutdown() ([pr#66916](https://github.com/ceph/ceph/pull/66916), Radoslaw Zarzynski)

- monitoring: fix "In" OSDs in Cluster-Advanced grafana panel<span></span>. Also change units from decbytes to bytes wherever used in the panel ([pr#65670](https://github.com/ceph/ceph/pull/65670), Aashish Sharma)

- monitoring: fix "Total gateway" and "Ceph Health NVMeoF WARNING" grafana graphs ([pr#66225](https://github.com/ceph/ceph/pull/66225), Vallari Agrawal)

- monitoring: fix CephPgImbalance alert rule expression ([pr#66828](https://github.com/ceph/ceph/pull/66828), Aashish Sharma)

- monitoring: Fix Filesystem grafana dashboard units ([pr#66018](https://github.com/ceph/ceph/pull/66018), Ankush Behl)

- monitoring: fix MTU Mismatch alert rule and expr ([pr#65708](https://github.com/ceph/ceph/pull/65708), Aashish Sharma)

- monitoring: fix rgw\_servers filtering in rgw sync overview grafana ([pr#66989](https://github.com/ceph/ceph/pull/66989), Aashish Sharma)

- monitoring: Fixes for smb overview ([pr#66019](https://github.com/ceph/ceph/pull/66019), Ankush Behl)

- monitoring: make cluster matcher backward compatible for pre-reef metrics ([pr#66984](https://github.com/ceph/ceph/pull/66984), Aashish Sharma)

- monitoring: update NVMeoFTooManyNamespaces to 4096 ns ([pr#67039](https://github.com/ceph/ceph/pull/67039), Vallari Agrawal)

- monitoring: upgrade grafana version to 12<span></span>.3<span></span>.1 ([pr#66963](https://github.com/ceph/ceph/pull/66963), Aashish Sharma)

- nvmeof: refactor beacon timer for exact frequency timing with drift correction ([pr#66536](https://github.com/ceph/ceph/pull/66536), Alexander Indenbaum)

- Objecter: respect higher epoch subscription in tick ([pr#66972](https://github.com/ceph/ceph/pull/66972), Nitzan Mordechai)

- os/bluestore: cumulative patch to fix extent map resharding and around ([pr#65964](https://github.com/ceph/ceph/pull/65964), Igor Fedotov, Adam Kupczyk, Jaya Prakash)

- os/bluestore: fix vselector update after enveloped WAL recovery ([pr#67333](https://github.com/ceph/ceph/pull/67333), Igor Fedotov, Adam Kupczyk)

- os/bluestore: introduce device type specific allocation policy ([pr#66839](https://github.com/ceph/ceph/pull/66839), Igor Fedotov)

- osd/ECUtil: Fix erase\_after\_ro\_offset length calculation and add tests ([pr#66825](https://github.com/ceph/ceph/pull/66825), Alex Ainscow)

- osd/PeeringState: re-evaluate full OSDs while waiting for recovery re… ([pr#65701](https://github.com/ceph/ceph/pull/65701), Nitzan Mordechai)

- osd/scrub: do not reduce min chunk on preemption ([pr#66214](https://github.com/ceph/ceph/pull/66214), Ronen Friedman)

- osd/scrub: fix blocked scrub accounting ([pr#66220](https://github.com/ceph/ceph/pull/66220), Ronen Friedman)

- osd/scrub: new/modified perf counters for scrub preemption ([pr#66234](https://github.com/ceph/ceph/pull/66234), Ronen Friedman)

- osd: Do not remove objects with divergent logs if only partial writes ([pr#66725](https://github.com/ceph/ceph/pull/66725), Alex Ainscow)

- osd: Fix fast EC truncate to whole stripe ([pr#66543](https://github.com/ceph/ceph/pull/66543), Alex Ainscow)

- osd: Fix for num\_bytes mismatch occurring from snapshot workloads with partial writes in fast\_ec ([pr#67137](https://github.com/ceph/ceph/pull/67137), Jon Bailey)

- osd: Fix memory leak of ECDummyOp ([pr#66977](https://github.com/ceph/ceph/pull/66977), Alex Ainscow)

- osd: Fix stats mismatch cluster error seen during scrubbing occasionally ([pr#65793](https://github.com/ceph/ceph/pull/65793), Jon Bailey)

- osd: Relax missing entry assert for partial writes ([pr#65860](https://github.com/ceph/ceph/pull/65860), Alex Ainscow)

- osd: stop scrub\_purged\_snaps() from ignoring osd\_beacon\_report\_interval ([pr#65478](https://github.com/ceph/ceph/pull/65478), Radoslaw Zarzynski)

- pickup object corpus 20<span></span>.2<span></span>.0 380 gdbcbbd3f281 ([pr#66592](https://github.com/ceph/ceph/pull/66592), Nitzan Mordechai)

- prometheus: Add Cephadm orch ps output metric to prometheus ([pr#66760](https://github.com/ceph/ceph/pull/66760), Ankush Behl)

- pybind/mgr/dashboard: dashboard/requirements-lint<span></span>.txt: re-pin rsscheck ([pr#66877](https://github.com/ceph/ceph/pull/66877), Ronen Friedman)

- pybind/mgr/pg\_autoscaler: Introduce dynamic threshold to improve scal… ([pr#66871](https://github.com/ceph/ceph/pull/66871), Prashant D)

- pybind/mgr: pin cheroot version in requirements-required<span></span>.txt ([pr#65635](https://github.com/ceph/ceph/pull/65635), Adam King)

- pybind/rados: Add list\_lockers() and break\_lock() to Rados Python interface ([pr#65098](https://github.com/ceph/ceph/pull/65098), Gil Bregman)

- qa/multisite: switch to boto3 ([pr#67318](https://github.com/ceph/ceph/pull/67318), Shilpa Jagannath, Adam C. Emerson)

- qa/rgw: bucket notifications use pynose ([pr#67449](https://github.com/ceph/ceph/pull/67449), Casey Bodley, Adam C. Emerson)

- qa/standalone/availability<span></span>.sh: retry after feature is turned on ([pr#67226](https://github.com/ceph/ceph/pull/67226), Shraddha Agrawal)

- qa/suites/nvmeof: add upgrade sub-suite ([pr#65583](https://github.com/ceph/ceph/pull/65583), Vallari Agrawal)

- qa/suites/rados/thrash-old-clients: Add OSD warnings to ignore list ([pr#65369](https://github.com/ceph/ceph/pull/65369), Naveen Naidu)

- qa/suites/rbd/valgrind: don't hardcode os\_type in memcheck<span></span>.yaml ([pr#66196](https://github.com/ceph/ceph/pull/66196), Ilya Dryomov)

- qa/suites/upgrade: add "Replacing daemon mds" to ignorelist ([issue#71615](http://tracker.ceph.com/issues/71615), [issue#50279](http://tracker.ceph.com/issues/50279), [pr#64888](https://github.com/ceph/ceph/pull/64888), Venky Shankar)

- qa/suites: wait longer before stopping OSDs with valgrind ([pr#63716](https://github.com/ceph/ceph/pull/63716), Nitzan Mordechai)

- qa/tasks/ceph\_manager: population must be a sequence ([pr#64746](https://github.com/ceph/ceph/pull/64746), Kyr Shatskyy)

- qa/tasks/qemu: rocky 10 enablement ([pr#67283](https://github.com/ceph/ceph/pull/67283), Ilya Dryomov)

- qa/tasks/rbd\_mirror\_thrash: don't use random<span></span>.randrange() on floats ([pr#67163](https://github.com/ceph/ceph/pull/67163), Ilya Dryomov)

- qa/tasks/workunit: fix no module named 'pipes' ([pr#66250](https://github.com/ceph/ceph/pull/66250), Kyr Shatskyy)

- qa/tests: added inital draft for tentacle-p2p ([pr#67765](https://github.com/ceph/ceph/pull/67765), Patrick Donnelly, Yuri Weinstein)

- qa/tests: added messages to the whitelist ([pr#65645](https://github.com/ceph/ceph/pull/65645), Laura Flores, Yuri Weinstein)

- qa/tests: wait for module to be available for connection ([pr#67196](https://github.com/ceph/ceph/pull/67196), Nizamudeen A)

- qa/valgrind<span></span>.supp: make gcm\_cipher\_internal suppression more resilient ([pr#67281](https://github.com/ceph/ceph/pull/67281), Ilya Dryomov)

- qa/workunits/nvmeof/basic\_tests: use nvme-cli 2<span></span>.13 ([pr#67285](https://github.com/ceph/ceph/pull/67285), Vallari Agrawal)

- qa/workunits/rados: remove cache tier test ([pr#65540](https://github.com/ceph/ceph/pull/65540), Nitzan Mordechai)

- qa/workunits/rbd: adapt rbd\_mirror<span></span>.sh for trial nodes ([pr#67152](https://github.com/ceph/ceph/pull/67152), Ilya Dryomov)

- qa/workunits/rbd: reduce randomized sleeps in live import tests ([pr#67154](https://github.com/ceph/ceph/pull/67154), Ilya Dryomov)

- qa/workunits/rbd: use the same qemu-iotests version throughout ([pr#67282](https://github.com/ceph/ceph/pull/67282), Ilya Dryomov)

- qa/workunits/rgw: drop netstat usage ([pr#67184](https://github.com/ceph/ceph/pull/67184), Kyr Shatskyy)

- qa/workunits: add Rocky Linux support to librados tests ([pr#67091](https://github.com/ceph/ceph/pull/67091), Nitzan Mordechai)

- qa: Disable OSD benchmark from running for tests ([pr#67068](https://github.com/ceph/ceph/pull/67068), Sridhar Seshasayee)

- qa: don't assume that /dev/sda or /dev/vda is present in unmap<span></span>.t ([pr#67077](https://github.com/ceph/ceph/pull/67077), Ilya Dryomov)

- qa: Fix test\_with\_health\_warn\_with\_2\_active\_MDSs ([pr#65260](https://github.com/ceph/ceph/pull/65260), Kotresh HR)

- qa: ignore cluster warning (evicting unresponsive <span></span>.<span></span>.<span></span>.) with tasks/mgr-osd-full ([issue#73278](http://tracker.ceph.com/issues/73278), [pr#66125](https://github.com/ceph/ceph/pull/66125), Venky Shankar)

- qa: Improve scalability test ([pr#66224](https://github.com/ceph/ceph/pull/66224), Vallari Agrawal)

- qa: krbd\_blkroset<span></span>.t: eliminate a race in the open\_count test ([pr#67075](https://github.com/ceph/ceph/pull/67075), Ilya Dryomov)

- qa: Run RADOS suites with ec optimizations on and off ([pr#65471](https://github.com/ceph/ceph/pull/65471), Jamie Pryde)

- qa: suppress OpenSSL valgrind leaks ([pr#65660](https://github.com/ceph/ceph/pull/65660), Laura Flores)

- rbd-mirror: add cluster fsid to remote meta cache key ([pr#66297](https://github.com/ceph/ceph/pull/66297), Mykola Golub)

- rbd-mirror: allow incomplete demote snapshot to sync after rbd-mirror daemon restart ([pr#66164](https://github.com/ceph/ceph/pull/66164), VinayBhaskar-V)

- Relax scrub of shard sizes for upgraded EC pools ([pr#66021](https://github.com/ceph/ceph/pull/66021), Alex Ainscow)

- Revert "Merge pull request #66958 from Hezko/wip-74413-tentacle" ([pr#67750](https://github.com/ceph/ceph/pull/67750), Patrick Donnelly)

- Revert "PrimeryLogPG: don't accept ops with mixed balance\_reads and rwordered flags" ([pr#66611](https://github.com/ceph/ceph/pull/66611), Radoslaw Zarzynski)

- RGW | fix conditional Delete, MultiDelete and Put ([pr#65949](https://github.com/ceph/ceph/pull/65949), Ali Masarwa)

- RGW | fix conditional MultiWrite ([pr#67425](https://github.com/ceph/ceph/pull/67425), Ali Masarwa)

- rgw/account: bucket acls are not completely migrated once the user is migrated to an account ([pr#65666](https://github.com/ceph/ceph/pull/65666), kchheda3)

- rgw/admin: Add max-entries and marker to bucket list ([pr#65485](https://github.com/ceph/ceph/pull/65485), Tobias Urdin)

- rgw/lc: LCOpAction\_CurrentExpiration checks mtime for delete markers ([pr#65965](https://github.com/ceph/ceph/pull/65965), Casey Bodley)

- rgw/tentacle: clean up <span></span>.rgw\_op<span></span>.cc<span></span>.swn file ([pr#66161](https://github.com/ceph/ceph/pull/66161), Soumya Koduri)

- rgw: add metric when send message with kafka and ampq ([pr#65904](https://github.com/ceph/ceph/pull/65904), Hoai-Thu Vuong)

- rgw: fix 'bucket rm --bypass-gc' for copied objects ([pr#66004](https://github.com/ceph/ceph/pull/66004), Casey Bodley)

- rgw: fix `radosgw-admin object unlink <span></span>.<span></span>.<span></span>.` ([pr#66151](https://github.com/ceph/ceph/pull/66151), J. Eric Ivancich)

- RGW: multi object delete op; skip olh update for all deletes but the last one ([pr#65488](https://github.com/ceph/ceph/pull/65488), Oguzhan Ozmen)

- rgw: update keystone repo stable branch to 2024<span></span>.2 ([pr#66241](https://github.com/ceph/ceph/pull/66241), Kyr Shatskyy)

- rpm: default to gcc-toolset-13, not just for crimson ([pr#65752](https://github.com/ceph/ceph/pull/65752), John Mulligan, Casey Bodley)

- scripts/build/ceph<span></span>.spec<span></span>.in: fix rhel version checks ([pr#66865](https://github.com/ceph/ceph/pull/66865), Ronen Friedman)

- src/ceph\_osd, osd: Implement running benchmark during OSD creation - Phase 1 ([pr#65522](https://github.com/ceph/ceph/pull/65522), Sridhar Seshasayee)

- src: Move the decision to build the ISA plugin to the top level make file ([pr#67894](https://github.com/ceph/ceph/pull/67894), Alex Ainscow)

- sync build-with-container patches from main ([pr#65843](https://github.com/ceph/ceph/pull/65843), John Mulligan, Dan Mick)

- systemd services: fix installing ceph-volume@ ([pr#66861](https://github.com/ceph/ceph/pull/66861), Thomas Lamprecht)

- tasks/cbt\_performance: Tolerate exceptions during performance data up… ([pr#66102](https://github.com/ceph/ceph/pull/66102), Nitzan Mordechai)

- test/ceph\_assert<span></span>.cc: Disable core files ([pr#66334](https://github.com/ceph/ceph/pull/66334), Bob Ham)

- test/neorados: Catch timeouts in Poll test ([pr#65605](https://github.com/ceph/ceph/pull/65605), Adam C. Emerson)

- test: disable known flaky tests in run-rbd-unit-tests ([pr#67559](https://github.com/ceph/ceph/pull/67559), Ilya Dryomov)

- tools: handle get-attr as read-only ops in ceph\_objectstore\_tool ([pr#66537](https://github.com/ceph/ceph/pull/66537), Jaya Prakash)


