---
title: "v18.2.5 Reef released"
date: "2025-04-08"
author: "Yuri Weinstein"
tags:
  - "release"
  - "reef"
---

This is the fifth backport release in the Reef series. We recommend that all users update to this release.

## Notable Changes

- RBD: The ``try-netlink`` mapping option for rbd-nbd has become the default
  and is now deprecated. If the NBD netlink interface is not supported by the
  kernel, then the mapping is retried using the legacy ioctl interface.

- RADOS: A new command, `ceph osd rm-pg-upmap-primary-all`, has been added that allows
  users to clear all pg-upmap-primary mappings in the osdmap when desired.
  
  Related trackers:
   - https://tracker.ceph.com/issues/67179
   - https://tracker.ceph.com/issues/66867

## Changelog

- (reintroduce) test/librados: fix LibRadosIoECPP<span></span>.CrcZeroWrite ([pr#61395](https://github.com/ceph/ceph/pull/61395), Samuel Just, Nitzan Mordechai)

- <span></span>.github: sync the list of paths for rbd label, expand tests label to qa/\* ([pr#57727](https://github.com/ceph/ceph/pull/57727), Ilya Dryomov)

- <common> fix formatter buffer out-of-bounds ([pr#61105](https://github.com/ceph/ceph/pull/61105), liubingrun)

- [reef] os/bluestore: introduce allocator state histogram ([pr#61318](https://github.com/ceph/ceph/pull/61318), Igor Fedotov)

- [reef] qa/multisite: stabilize multisite testing ([pr#60402](https://github.com/ceph/ceph/pull/60402), Shilpa Jagannath, Casey Bodley)

- [reef] qa/rgw: the rgw/verify suite runs java tests last ([pr#60849](https://github.com/ceph/ceph/pull/60849), Casey Bodley)

- [RGW] Fix the handling of HEAD requests that do not comply with RFC standards ([pr#59122](https://github.com/ceph/ceph/pull/59122), liubingrun)

- a series of optimizations for kerneldevice discard ([pr#59048](https://github.com/ceph/ceph/pull/59048), Adam Kupczyk, Joshua Baergen, Gabriel BenHanokh, Matt Vandermeulen)

- Add Containerfile and build<span></span>.sh to build it ([pr#60228](https://github.com/ceph/ceph/pull/60228), Dan Mick)

- add RBD Mirror monitoring alerts ([pr#56552](https://github.com/ceph/ceph/pull/56552), Arun Kumar Mohan)

- AsyncMessenger<span></span>.cc : improve error messages ([pr#61402](https://github.com/ceph/ceph/pull/61402), Anthony D'Atri)

- AsyncMessenger: Don't decrease l\_msgr\_active\_connections if it is negative ([pr#60445](https://github.com/ceph/ceph/pull/60445), Mohit Agrawal)

- blk/aio: fix long batch (64+K entries) submission ([pr#58675](https://github.com/ceph/ceph/pull/58675), Yingxin Cheng, Igor Fedotov, Adam Kupczyk, Robin Geuze)

- blk/KernelDevice: using join() to wait thread end is more safe ([pr#60615](https://github.com/ceph/ceph/pull/60615), Yite Gu)

- bluestore/bluestore\_types: avoid heap-buffer-overflow in another way to keep code uniformity ([pr#58817](https://github.com/ceph/ceph/pull/58817), Rongqi Sun)

- BlueStore: Improve fragmentation score metric ([pr#59263](https://github.com/ceph/ceph/pull/59263), Adam Kupczyk)

- build-with-container fixes exec bit, dnf cache dir option ([pr#61913](https://github.com/ceph/ceph/pull/61913), John Mulligan)

- build-with-container: fixes and enhancements ([pr#62162](https://github.com/ceph/ceph/pull/62162), John Mulligan)

- build: Make boost\_url a list ([pr#58315](https://github.com/ceph/ceph/pull/58315), Adam Emerson)

- ceph-mixin: Update mixin to include alerts for the nvmeof gateway(s) ([pr#56948](https://github.com/ceph/ceph/pull/56948), Adam King, Paul Cuzner)

- ceph-volume: allow zapping partitions on multipath devices ([pr#62178](https://github.com/ceph/ceph/pull/62178), Guillaume Abrioux)

- ceph-volume: create LVs when using partitions ([pr#58220](https://github.com/ceph/ceph/pull/58220), Guillaume Abrioux)

- ceph-volume: do source devices zapping if they're detached ([pr#58996](https://github.com/ceph/ceph/pull/58996), Igor Fedotov)

- ceph-volume: fix set\_dmcrypt\_no\_workqueue() ([pr#58997](https://github.com/ceph/ceph/pull/58997), Guillaume Abrioux)

- ceph-volume: Fix unbound var in disk<span></span>.get\_devices() ([pr#59262](https://github.com/ceph/ceph/pull/59262), Zack Cerza)

- ceph-volume: fix unit tests errors ([pr#59956](https://github.com/ceph/ceph/pull/59956), Guillaume Abrioux)

- ceph-volume: update functional testing ([pr#56857](https://github.com/ceph/ceph/pull/56857), Guillaume Abrioux)

- ceph-volume: use importlib from stdlib on Python 3<span></span>.8 and up ([pr#58005](https://github.com/ceph/ceph/pull/58005), Guillaume Abrioux, Kefu Chai)

- ceph-volume: use os<span></span>.makedirs for mkdir\_p ([pr#57472](https://github.com/ceph/ceph/pull/57472), Chen Yuanrun)

- ceph<span></span>.spec<span></span>.in: remove command-with-macro line ([pr#57357](https://github.com/ceph/ceph/pull/57357), John Mulligan)

- ceph<span></span>.spec<span></span>.in: we need jsonnet for all distroes for make check ([pr#60076](https://github.com/ceph/ceph/pull/60076), Kyr Shatskyy)

- ceph\_mon: Fix MonitorDBStore usage ([pr#54150](https://github.com/ceph/ceph/pull/54150), Matan Breizman)

- ceph\_test\_rados\_api\_misc: adjust LibRadosMiscConnectFailure<span></span>.ConnectTimeout timeout ([pr#58137](https://github.com/ceph/ceph/pull/58137), Lucian Petrut)

- cephadm/services/ingress: configure security user in keepalived template ([pr#61151](https://github.com/ceph/ceph/pull/61151), Bernard Landon)

- cephadm: add idmap<span></span>.conf to nfs sample file ([pr#59453](https://github.com/ceph/ceph/pull/59453), Adam King)

- cephadm: added check for `--skip-firewalld` to section on adding explicit Ports to firewalld ([pr#57519](https://github.com/ceph/ceph/pull/57519), Michaela Lang)

- cephadm: CephExporter doesn't bind to IPv6 in dual stack ([pr#59461](https://github.com/ceph/ceph/pull/59461), Mouratidis Theofilos)

- cephadm: change loki/promtail default image tags ([pr#57475](https://github.com/ceph/ceph/pull/57475), Guillaume Abrioux)

- cephadm: disable ms\_bind\_ipv4 if we will enable ms\_bind\_ipv6 ([pr#61714](https://github.com/ceph/ceph/pull/61714), Dan van der Ster, Joshua Blanch)

- cephadm: emit warning if daemon's image is not to be used ([pr#61721](https://github.com/ceph/ceph/pull/61721), Matthew Vernon)

- cephadm: fix `cephadm shell --name <daemon-name>` for stopped/failed daemon ([pr#56490](https://github.com/ceph/ceph/pull/56490), Adam King)

- cephadm: fix apparmor profiles with spaces in the names ([pr#61712](https://github.com/ceph/ceph/pull/61712), John Mulligan)

- cephadm: fix host-maintenance command always exiting with a failure ([pr#59454](https://github.com/ceph/ceph/pull/59454), John Mulligan)

- cephadm: have agent check for errors before json loading mgr response ([pr#59455](https://github.com/ceph/ceph/pull/59455), Adam King)

- cephadm: make bootstrap default to "global" section for public\_network setting ([pr#61918](https://github.com/ceph/ceph/pull/61918), Adam King)

- cephadm: pin pyfakefs version for tox tests ([pr#56762](https://github.com/ceph/ceph/pull/56762), Adam King)

- cephadm: pull container images from quay<span></span>.io ([pr#60474](https://github.com/ceph/ceph/pull/60474), Guillaume Abrioux)

- cephadm: rgw: allow specifying the ssl\_certificate by filepath ([pr#61922](https://github.com/ceph/ceph/pull/61922), Alexander Hussein-Kershaw)

- cephadm: Support Docker Live Restore ([pr#61916](https://github.com/ceph/ceph/pull/61916), Michal Nasiadka)

- cephadm: turn off cgroups\_split setting  when bootstrapping with --no-cgroups-split ([pr#61716](https://github.com/ceph/ceph/pull/61716), Adam King)

- cephadm: use importlib<span></span>.metadata for querying ceph\_iscsi's version ([pr#58323](https://github.com/ceph/ceph/pull/58323), Zac Dover)

- CephContext: acquire \_fork\_watchers\_lock in notify\_post\_fork() ([issue#63494](http://tracker.ceph.com/issues/63494), [pr#59266](https://github.com/ceph/ceph/pull/59266), Venky Shankar)

- cephfs-journal-tool: Add preventive measures to avoid fs corruption ([pr#57761](https://github.com/ceph/ceph/pull/57761), Jos Collin)

- cephfs-mirror: use monotonic clock ([pr#56701](https://github.com/ceph/ceph/pull/56701), Jos Collin)

- cephfs-shell: excute cmd 'rmdir\_helper' reported error ([pr#58812](https://github.com/ceph/ceph/pull/58812), teng jie)

- cephfs-shell: fixing cephfs-shell test failures ([pr#60410](https://github.com/ceph/ceph/pull/60410), Neeraj Pratap Singh)

- cephfs-shell: prints warning, hangs and aborts when launched ([pr#58088](https://github.com/ceph/ceph/pull/58088), Rishabh Dave)

- cephfs-top: fix exceptions on small/large sized windows ([pr#59898](https://github.com/ceph/ceph/pull/59898), Jos Collin)

- cephfs: add command "ceph fs swap" ([pr#54942](https://github.com/ceph/ceph/pull/54942), Rishabh Dave)

- cephfs: Fixed a bug in the readdir\_cache\_cb function that may have us… ([pr#58805](https://github.com/ceph/ceph/pull/58805), Tod Chen)

- cephfs\_mirror, qa: fix mirror daemon doesn't restart when blocklisted or failed ([pr#58632](https://github.com/ceph/ceph/pull/58632), Jos Collin)

- cephfs\_mirror, qa: fix test failure test\_cephfs\_mirror\_cancel\_mirroring\_and\_readd ([pr#60182](https://github.com/ceph/ceph/pull/60182), Jos Collin)

- cephfs\_mirror: 'ceph fs snapshot mirror ls' command ([pr#60178](https://github.com/ceph/ceph/pull/60178), Jos Collin)

- cephfs\_mirror: fix crash in update\_fs\_mirrors() ([pr#57451](https://github.com/ceph/ceph/pull/57451), Jos Collin)

- cephfs\_mirror: increment sync\_failures when sync\_perms() and sync\_snaps() fails ([pr#57437](https://github.com/ceph/ceph/pull/57437), Jos Collin)

- cephfs\_mirror: provide metrics for last successful snapshot sync ([pr#59071](https://github.com/ceph/ceph/pull/59071), Jos Collin)

- client: check mds down status before getting mds\_gid\_t from mdsmap ([pr#58492](https://github.com/ceph/ceph/pull/58492), Yite Gu, Dhairya Parmar)

- client: clear resend\_mds only after sending request ([pr#57174](https://github.com/ceph/ceph/pull/57174), Patrick Donnelly)

- client: disallow unprivileged users to escalate root privileges ([pr#61379](https://github.com/ceph/ceph/pull/61379), Xiubo Li, Venky Shankar)

- client: do not proceed with I/O if filehandle is invalid ([pr#58397](https://github.com/ceph/ceph/pull/58397), Venky Shankar, Dhairya Parmar)

- client: Fix leading / issue with mds\_check\_access ([pr#58982](https://github.com/ceph/ceph/pull/58982), Kotresh HR, Rishabh Dave)

- client: Fix opening and reading of symlinks ([pr#60373](https://github.com/ceph/ceph/pull/60373), Anoop C S)

- client: flush the caps release in filesystem sync ([pr#59397](https://github.com/ceph/ceph/pull/59397), Xiubo Li)

- client: log debug message when requesting unmount ([pr#56955](https://github.com/ceph/ceph/pull/56955), Patrick Donnelly)

- client: Prevent race condition when printing Inode in ll\_sync\_inode ([pr#59620](https://github.com/ceph/ceph/pull/59620), Chengen Du)

- client: set LIBMOUNT\_FORCE\_MOUNT2=always ([pr#58529](https://github.com/ceph/ceph/pull/58529), Jakob Haufe)

- cls/cas/cls\_cas\_internal: Initialize 'hash' value before decoding ([pr#59237](https://github.com/ceph/ceph/pull/59237), Nitzan Mordechai)

- cls/user: reset stats only returns marker when truncated ([pr#60165](https://github.com/ceph/ceph/pull/60165), Casey Bodley)

- cmake/arrow: don't treat warnings as errors ([pr#57375](https://github.com/ceph/ceph/pull/57375), Casey Bodley)

- cmake: use ExternalProjects to build isa-l and isa-l\_crypto libraries ([pr#60108](https://github.com/ceph/ceph/pull/60108), Casey Bodley)

- common,osd: Use last valid OSD IOPS value if measured IOPS is unrealistic ([pr#60659](https://github.com/ceph/ceph/pull/60659), Sridhar Seshasayee)

- common/admin\_socket: add a command to raise a signal ([pr#54357](https://github.com/ceph/ceph/pull/54357), Leonid Usov)

- common/dout: fix FTBFS on GCC 14 ([pr#59056](https://github.com/ceph/ceph/pull/59056), Radoslaw Zarzynski)

- common/Formatter: dump inf/nan as null ([pr#60061](https://github.com/ceph/ceph/pull/60061), Md Mahamudur Rahaman Sajib)

- common/options: Change HDD OSD shard configuration defaults for mClock ([pr#59972](https://github.com/ceph/ceph/pull/59972), Sridhar Seshasayee)

- common/pick\_address: check if address in subnet all public address ([pr#57590](https://github.com/ceph/ceph/pull/57590), Nitzan Mordechai)

- common/StackStringStream: update pointer to newly allocated memory in overflow() ([pr#57362](https://github.com/ceph/ceph/pull/57362), Rongqi Sun)

- common/TrackedOp: do not count the ops marked as nowarn ([pr#58744](https://github.com/ceph/ceph/pull/58744), Xiubo Li)

- common/TrackedOp: rename and raise prio of slow op perfcounter ([pr#59280](https://github.com/ceph/ceph/pull/59280), Yite Gu)

- common: fix md\_config\_cacher\_t ([pr#61403](https://github.com/ceph/ceph/pull/61403), Ronen Friedman)

- common: use close\_range on Linux ([pr#61625](https://github.com/ceph/ceph/pull/61625), edef)

- container/build<span></span>.sh: don't require repo creds on NO\_PUSH ([pr#61582](https://github.com/ceph/ceph/pull/61582), Dan Mick)

- container/build<span></span>.sh: fix up org vs<span></span>. repo naming ([pr#61581](https://github.com/ceph/ceph/pull/61581), Dan Mick)

- container/build<span></span>.sh: remove local container images ([pr#62065](https://github.com/ceph/ceph/pull/62065), Dan Mick)

- container/Containerfile: replace CEPH\_VERSION label for backward compat ([pr#61580](https://github.com/ceph/ceph/pull/61580), Dan Mick)

- container: add label ceph=True back ([pr#61612](https://github.com/ceph/ceph/pull/61612), John Mulligan)

- containerized build tools [V2] ([pr#61683](https://github.com/ceph/ceph/pull/61683), John Mulligan, Ernesto Puerta)

- debian pkg: record python3-packaging dependency for ceph-volume ([pr#59201](https://github.com/ceph/ceph/pull/59201), Kefu Chai, Thomas Lamprecht)

- debian: add ceph-exporter package ([pr#56541](https://github.com/ceph/ceph/pull/56541), Shinya Hayashi)

- debian: add missing bcrypt to ceph-mgr <span></span>.requires to fix resulting package dependencies ([pr#54662](https://github.com/ceph/ceph/pull/54662), Thomas Lamprecht)

- debian: recursively adjust permissions of /var/lib/ceph/crash ([pr#58458](https://github.com/ceph/ceph/pull/58458), Max Carrara)

- doc,mailmap: update my email / association to ibm ([pr#60339](https://github.com/ceph/ceph/pull/60339), Patrick Donnelly)

- doc/ceph-volume: add spillover fix procedure ([pr#59541](https://github.com/ceph/ceph/pull/59541), Zac Dover)

- doc/cephadm/services: Re-improve osd<span></span>.rst ([pr#61953](https://github.com/ceph/ceph/pull/61953), Anthony D'Atri)

- doc/cephadm/upgrade: ceph-ci containers are hosted by quay<span></span>.ceph<span></span>.io ([pr#58681](https://github.com/ceph/ceph/pull/58681), Casey Bodley)

- doc/cephadm: add default monitor images ([pr#57209](https://github.com/ceph/ceph/pull/57209), Zac Dover)

- doc/cephadm: add malformed-JSON removal instructions ([pr#59664](https://github.com/ceph/ceph/pull/59664), Zac Dover)

- doc/cephadm: Clarify "Deploying a new Cluster" ([pr#60810](https://github.com/ceph/ceph/pull/60810), Zac Dover)

- doc/cephadm: clean "Adv<span></span>. OSD Service Specs" ([pr#60680](https://github.com/ceph/ceph/pull/60680), Zac Dover)

- doc/cephadm: correct note ([pr#61529](https://github.com/ceph/ceph/pull/61529), Zac Dover)

- doc/cephadm: edit "Using Custom Images" ([pr#58941](https://github.com/ceph/ceph/pull/58941), Zac Dover)

- doc/cephadm: how to get exact size\_spec from device ([pr#59431](https://github.com/ceph/ceph/pull/59431), Zac Dover)

- doc/cephadm: improve "Activate Existing OSDs" ([pr#61748](https://github.com/ceph/ceph/pull/61748), Zac Dover)

- doc/cephadm: improve "Activate Existing OSDs" ([pr#61726](https://github.com/ceph/ceph/pull/61726), Zac Dover)

- doc/cephadm: link to "host pattern" matching sect ([pr#60645](https://github.com/ceph/ceph/pull/60645), Zac Dover)

- doc/cephadm: Reef default images procedure ([pr#57236](https://github.com/ceph/ceph/pull/57236), Zac Dover)

- doc/cephadm: remove downgrade reference from upgrade docs ([pr#57086](https://github.com/ceph/ceph/pull/57086), Adam King)

- doc/cephadm: simplify confusing math proposition ([pr#61575](https://github.com/ceph/ceph/pull/61575), Zac Dover)

- doc/cephadm: Update operations<span></span>.rst ([pr#60638](https://github.com/ceph/ceph/pull/60638), rhkelson)

- doc/cephfs: add cache pressure information ([pr#59149](https://github.com/ceph/ceph/pull/59149), Zac Dover)

- doc/cephfs: add doc for disabling mgr/volumes plugin ([pr#60497](https://github.com/ceph/ceph/pull/60497), Rishabh Dave)

- doc/cephfs: add metrics to left pane ([pr#57736](https://github.com/ceph/ceph/pull/57736), Zac Dover)

- doc/cephfs: disambiguate "Reporting Free Space" ([pr#56872](https://github.com/ceph/ceph/pull/56872), Zac Dover)

- doc/cephfs: disambiguate two sentences ([pr#57704](https://github.com/ceph/ceph/pull/57704), Zac Dover)

- doc/cephfs: disaster-recovery-experts cleanup ([pr#61447](https://github.com/ceph/ceph/pull/61447), Zac Dover)

- doc/cephfs: document purge queue and its perf counters ([pr#61194](https://github.com/ceph/ceph/pull/61194), Dhairya Parmar)

- doc/cephfs: edit "Cloning Snapshots" in fs-volumes<span></span>.rst ([pr#57666](https://github.com/ceph/ceph/pull/57666), Zac Dover)

- doc/cephfs: edit "Disabling Volumes Plugin" ([pr#60468](https://github.com/ceph/ceph/pull/60468), Rishabh Dave)

- doc/cephfs: edit "Dynamic Subtree Partitioning" ([pr#58910](https://github.com/ceph/ceph/pull/58910), Zac Dover)

- doc/cephfs: edit "is mount helper present" ([pr#58579](https://github.com/ceph/ceph/pull/58579), Zac Dover)

- doc/cephfs: edit "Layout Fields" text ([pr#59022](https://github.com/ceph/ceph/pull/59022), Zac Dover)

- doc/cephfs: edit "Pinning Subvolumes<span></span>.<span></span>.<span></span>." ([pr#57663](https://github.com/ceph/ceph/pull/57663), Zac Dover)

- doc/cephfs: edit 2nd 3rd of mount-using-kernel-driver ([pr#61059](https://github.com/ceph/ceph/pull/61059), Zac Dover)

- doc/cephfs: edit 3rd 3rd of mount-using-kernel-driver ([pr#61081](https://github.com/ceph/ceph/pull/61081), Zac Dover)

- doc/cephfs: edit disaster-recovery-experts ([pr#61424](https://github.com/ceph/ceph/pull/61424), Zac Dover)

- doc/cephfs: edit disaster-recovery-experts (2 of x) ([pr#61444](https://github.com/ceph/ceph/pull/61444), Zac Dover)

- doc/cephfs: edit disaster-recovery-experts (3 of x) ([pr#61454](https://github.com/ceph/ceph/pull/61454), Zac Dover)

- doc/cephfs: edit disaster-recovery-experts (4 of x) ([pr#61480](https://github.com/ceph/ceph/pull/61480), Zac Dover)

- doc/cephfs: edit disaster-recovery-experts (5 of x) ([pr#61500](https://github.com/ceph/ceph/pull/61500), Zac Dover)

- doc/cephfs: edit disaster-recovery-experts (6 of x) ([pr#61522](https://github.com/ceph/ceph/pull/61522), Zac Dover)

- doc/cephfs: edit first 3rd of mount-using-kernel-driver ([pr#61042](https://github.com/ceph/ceph/pull/61042), Zac Dover)

- doc/cephfs: edit front matter in client-auth<span></span>.rst ([pr#57122](https://github.com/ceph/ceph/pull/57122), Zac Dover)

- doc/cephfs: edit front matter in mantle<span></span>.rst ([pr#57792](https://github.com/ceph/ceph/pull/57792), Zac Dover)

- doc/cephfs: edit fs-volumes<span></span>.rst (1 of x) ([pr#57418](https://github.com/ceph/ceph/pull/57418), Zac Dover)

- doc/cephfs: edit fs-volumes<span></span>.rst (1 of x) followup ([pr#57427](https://github.com/ceph/ceph/pull/57427), Zac Dover)

- doc/cephfs: edit fs-volumes<span></span>.rst (2 of x) ([pr#57543](https://github.com/ceph/ceph/pull/57543), Zac Dover)

- doc/cephfs: edit grammar in snapshots<span></span>.rst ([pr#61460](https://github.com/ceph/ceph/pull/61460), Zac Dover)

- doc/cephfs: edit vstart warning text ([pr#57815](https://github.com/ceph/ceph/pull/57815), Zac Dover)

- doc/cephfs: fix "file layouts" link ([pr#58876](https://github.com/ceph/ceph/pull/58876), Zac Dover)

- doc/cephfs: fix "OSD capabilities" link ([pr#58893](https://github.com/ceph/ceph/pull/58893), Zac Dover)

- doc/cephfs: fix typo ([pr#58469](https://github.com/ceph/ceph/pull/58469), spdfnet)

- doc/cephfs: improve "layout fields" text ([pr#59251](https://github.com/ceph/ceph/pull/59251), Zac Dover)

- doc/cephfs: improve cache-configuration<span></span>.rst ([pr#59215](https://github.com/ceph/ceph/pull/59215), Zac Dover)

- doc/cephfs: improve ceph-fuse command ([pr#56968](https://github.com/ceph/ceph/pull/56968), Zac Dover)

- doc/cephfs: rearrange subvolume group information ([pr#60436](https://github.com/ceph/ceph/pull/60436), Indira Sawant)

- doc/cephfs: refine client-auth (1 of 3) ([pr#56780](https://github.com/ceph/ceph/pull/56780), Zac Dover)

- doc/cephfs: refine client-auth (2 of 3) ([pr#56842](https://github.com/ceph/ceph/pull/56842), Zac Dover)

- doc/cephfs: refine client-auth (3 of 3) ([pr#56851](https://github.com/ceph/ceph/pull/56851), Zac Dover)

- doc/cephfs: s/mountpoint/mount point/ ([pr#59295](https://github.com/ceph/ceph/pull/59295), Zac Dover)

- doc/cephfs: s/mountpoint/mount point/ ([pr#59287](https://github.com/ceph/ceph/pull/59287), Zac Dover)

- doc/cephfs: s/subvolumegroups/subvolume groups ([pr#57743](https://github.com/ceph/ceph/pull/57743), Zac Dover)

- doc/cephfs: separate commands into sections ([pr#57669](https://github.com/ceph/ceph/pull/57669), Zac Dover)

- doc/cephfs: streamline a paragraph ([pr#58775](https://github.com/ceph/ceph/pull/58775), Zac Dover)

- doc/cephfs: take Anthony's suggestion ([pr#58360](https://github.com/ceph/ceph/pull/58360), Zac Dover)

- doc/cephfs: update cephfs-shell link ([pr#58371](https://github.com/ceph/ceph/pull/58371), Zac Dover)

- doc/cephfs: use 'p' flag to set layouts or quotas ([pr#60483](https://github.com/ceph/ceph/pull/60483), TruongSinh Tran-Nguyen)

- doc/dev/developer\_guide/essentials: update mailing lists ([pr#62376](https://github.com/ceph/ceph/pull/62376), Laimis Juzeliunas)

- doc/dev/peering: Change acting set num ([pr#59063](https://github.com/ceph/ceph/pull/59063), qn2060)

- doc/dev/release-process<span></span>.rst: New container build/release process ([pr#60972](https://github.com/ceph/ceph/pull/60972), Dan Mick)

- doc/dev/release-process<span></span>.rst: note new 'project' arguments ([pr#57644](https://github.com/ceph/ceph/pull/57644), Dan Mick)

- doc/dev: add "activate latest release" RTD step ([pr#59655](https://github.com/ceph/ceph/pull/59655), Zac Dover)

- doc/dev: add formatting to basic workflow ([pr#58738](https://github.com/ceph/ceph/pull/58738), Zac Dover)

- doc/dev: add note about intro of perf counters ([pr#57758](https://github.com/ceph/ceph/pull/57758), Zac Dover)

- doc/dev: add target links to perf\_counters<span></span>.rst ([pr#57734](https://github.com/ceph/ceph/pull/57734), Zac Dover)

- doc/dev: edit "Principles for format change" ([pr#58576](https://github.com/ceph/ceph/pull/58576), Zac Dover)

- doc/dev: Fix typos in encoding<span></span>.rst ([pr#58305](https://github.com/ceph/ceph/pull/58305), N Balachandran)

- doc/dev: improve basic-workflow<span></span>.rst ([pr#58938](https://github.com/ceph/ceph/pull/58938), Zac Dover)

- doc/dev: instruct devs to backport ([pr#61064](https://github.com/ceph/ceph/pull/61064), Zac Dover)

- doc/dev: link to ceph<span></span>.io leads list ([pr#58106](https://github.com/ceph/ceph/pull/58106), Zac Dover)

- doc/dev: origin of Labeled Perf Counters ([pr#57914](https://github.com/ceph/ceph/pull/57914), Zac Dover)

- doc/dev: remove "Stable Releases and Backports" ([pr#60273](https://github.com/ceph/ceph/pull/60273), Zac Dover)

- doc/dev: repair broken image ([pr#57008](https://github.com/ceph/ceph/pull/57008), Zac Dover)

- doc/dev: s/to asses/to assess/ ([pr#57423](https://github.com/ceph/ceph/pull/57423), Zac Dover)

- doc/dev\_guide: add needs-upgrade-testing label info ([pr#58730](https://github.com/ceph/ceph/pull/58730), Zac Dover)

- doc/developer\_guide: update doc about installing teuthology ([pr#57750](https://github.com/ceph/ceph/pull/57750), Rishabh Dave)

- doc/foundation<span></span>.rst: update Intel point of contact ([pr#61032](https://github.com/ceph/ceph/pull/61032), Neha Ojha)

- doc/glossary<span></span>.rst: add "Dashboard Plugin" ([pr#60897](https://github.com/ceph/ceph/pull/60897), Zac Dover)

- doc/glossary<span></span>.rst: add "OpenStack Swift" and "Swift" ([pr#57942](https://github.com/ceph/ceph/pull/57942), Zac Dover)

- doc/glossary: add "ceph-ansible" ([pr#59008](https://github.com/ceph/ceph/pull/59008), Zac Dover)

- doc/glossary: add "ceph-fuse" entry ([pr#58944](https://github.com/ceph/ceph/pull/58944), Zac Dover)

- doc/glossary: add "DC" (Data Center) to glossary ([pr#60876](https://github.com/ceph/ceph/pull/60876), Zac Dover)

- doc/glossary: add "flapping OSD" ([pr#60865](https://github.com/ceph/ceph/pull/60865), Zac Dover)

- doc/glossary: add "object storage" ([pr#59425](https://github.com/ceph/ceph/pull/59425), Zac Dover)

- doc/glossary: add "PLP" to glossary ([pr#60504](https://github.com/ceph/ceph/pull/60504), Zac Dover)

- doc/glossary: add "Prometheus" ([pr#58978](https://github.com/ceph/ceph/pull/58978), Zac Dover)

- doc/glossary: Add "S3" ([pr#57983](https://github.com/ceph/ceph/pull/57983), Zac Dover)

- doc/governance: add exec council responsibilites ([pr#60140](https://github.com/ceph/ceph/pull/60140), Zac Dover)

- doc/governance: add Zac Dover's updated email ([pr#60135](https://github.com/ceph/ceph/pull/60135), Zac Dover)

- doc/install: fix typos in openEuler-installation doc ([pr#56413](https://github.com/ceph/ceph/pull/56413), Rongqi Sun)

- doc/install: Keep the name field of the created user consistent with … ([pr#59757](https://github.com/ceph/ceph/pull/59757), hejindong)

- doc/man/8/radosgw-admin: add get lifecycle command ([pr#57160](https://github.com/ceph/ceph/pull/57160), rkhudov)

- doc/man: add missing long option switches ([pr#57707](https://github.com/ceph/ceph/pull/57707), Patrick Donnelly)

- doc/man: edit ceph-bluestore-tool<span></span>.rst ([pr#59683](https://github.com/ceph/ceph/pull/59683), Zac Dover)

- doc/man: supplant "wsync" with "nowsync" as the default ([pr#60200](https://github.com/ceph/ceph/pull/60200), Zac Dover)

- doc/mds: improve wording ([pr#59586](https://github.com/ceph/ceph/pull/59586), Piotr Parczewski)

- doc/mgr/dashboard: fix TLS typo ([pr#59032](https://github.com/ceph/ceph/pull/59032), Mindy Preston)

- doc/mgr: Add root CA cert instructions to rgw<span></span>.rst ([pr#61885](https://github.com/ceph/ceph/pull/61885), Anuradha Gadge, Zac Dover)

- doc/mgr: edit "Overview" in dashboard<span></span>.rst ([pr#57336](https://github.com/ceph/ceph/pull/57336), Zac Dover)

- doc/mgr: edit "Resolve IP address to hostname before redirect" ([pr#57296](https://github.com/ceph/ceph/pull/57296), Zac Dover)

- doc/mgr: explain error message - dashboard<span></span>.rst ([pr#57109](https://github.com/ceph/ceph/pull/57109), Zac Dover)

- doc/mgr: remove Zabbix 1 information ([pr#56798](https://github.com/ceph/ceph/pull/56798), Zac Dover)

- doc/monitoring: Improve index<span></span>.rst ([pr#62266](https://github.com/ceph/ceph/pull/62266), Anthony D'Atri)

- doc/rados/operations: Clarify stretch mode vs device class ([pr#62078](https://github.com/ceph/ceph/pull/62078), Anthony D'Atri)

- doc/rados/operations: improve crush-map-edits<span></span>.rst ([pr#62318](https://github.com/ceph/ceph/pull/62318), Anthony D'Atri)

- doc/rados/operations: Improve health-checks<span></span>.rst ([pr#59583](https://github.com/ceph/ceph/pull/59583), Anthony D'Atri)

- doc/rados/operations: Improve pools<span></span>.rst ([pr#61729](https://github.com/ceph/ceph/pull/61729), Anthony D'Atri)

- doc/rados/operations: remove vanity cluster name reference from crush… ([pr#58948](https://github.com/ceph/ceph/pull/58948), Anthony D'Atri)

- doc/rados/operations: rephrase OSDs peering ([pr#57157](https://github.com/ceph/ceph/pull/57157), Piotr Parczewski)

- doc/rados/troubleshooting: Improve log-and-debug<span></span>.rst ([pr#60825](https://github.com/ceph/ceph/pull/60825), Anthony D'Atri)

- doc/rados/troubleshooting: Improve troubleshooting-pg<span></span>.rst ([pr#62321](https://github.com/ceph/ceph/pull/62321), Anthony D'Atri)

- doc/rados: add "pgs not deep scrubbed in time" info ([pr#59734](https://github.com/ceph/ceph/pull/59734), Zac Dover)

- doc/rados: add blaum\_roth coding guidance ([pr#60538](https://github.com/ceph/ceph/pull/60538), Zac Dover)

- doc/rados: add bucket rename command ([pr#57027](https://github.com/ceph/ceph/pull/57027), Zac Dover)

- doc/rados: add confval directives to health-checks ([pr#59872](https://github.com/ceph/ceph/pull/59872), Zac Dover)

- doc/rados: add link to messenger v2 info in mon-lookup-dns<span></span>.rst ([pr#59795](https://github.com/ceph/ceph/pull/59795), Zac Dover)

- doc/rados: add options to network config ref ([pr#57916](https://github.com/ceph/ceph/pull/57916), Zac Dover)

- doc/rados: add osd\_deep\_scrub\_interval setting operation ([pr#59803](https://github.com/ceph/ceph/pull/59803), Zac Dover)

- doc/rados: add pg-states and pg-concepts to tree ([pr#58050](https://github.com/ceph/ceph/pull/58050), Zac Dover)

- doc/rados: add stop monitor command ([pr#57851](https://github.com/ceph/ceph/pull/57851), Zac Dover)

- doc/rados: add stretch\_rule workaround ([pr#58182](https://github.com/ceph/ceph/pull/58182), Zac Dover)

- doc/rados: correct "full ratio" note ([pr#60738](https://github.com/ceph/ceph/pull/60738), Zac Dover)

- doc/rados: credit Prashant for a procedure ([pr#58258](https://github.com/ceph/ceph/pull/58258), Zac Dover)

- doc/rados: document manually passing search domain ([pr#58432](https://github.com/ceph/ceph/pull/58432), Zac Dover)

- doc/rados: document unfound object cache-tiering scenario ([pr#59381](https://github.com/ceph/ceph/pull/59381), Zac Dover)

- doc/rados: edit "Placement Groups Never Get Clean" ([pr#60047](https://github.com/ceph/ceph/pull/60047), Zac Dover)

- doc/rados: edit troubleshooting-osd<span></span>.rst ([pr#58272](https://github.com/ceph/ceph/pull/58272), Zac Dover)

- doc/rados: explain replaceable parts of command ([pr#58060](https://github.com/ceph/ceph/pull/58060), Zac Dover)

- doc/rados: fix outdated value for ms\_bind\_port\_max ([pr#57048](https://github.com/ceph/ceph/pull/57048), Pierre Riteau)

- doc/rados: fix sentences in health-checks (2 of x) ([pr#60932](https://github.com/ceph/ceph/pull/60932), Zac Dover)

- doc/rados: fix sentences in health-checks (3 of x) ([pr#60950](https://github.com/ceph/ceph/pull/60950), Zac Dover)

- doc/rados: followup to PR#58057 ([pr#58162](https://github.com/ceph/ceph/pull/58162), Zac Dover)

- doc/rados: improve leader/peon monitor explanation ([pr#57959](https://github.com/ceph/ceph/pull/57959), Zac Dover)

- doc/rados: improve pg\_num/pgp\_num info ([pr#62057](https://github.com/ceph/ceph/pull/62057), Zac Dover)

- doc/rados: make sentences agree in health-checks<span></span>.rst ([pr#60921](https://github.com/ceph/ceph/pull/60921), Zac Dover)

- doc/rados: pool and namespace are independent osdcap restrictions ([pr#61524](https://github.com/ceph/ceph/pull/61524), Ilya Dryomov)

- doc/rados: PR#57022 unfinished business ([pr#57265](https://github.com/ceph/ceph/pull/57265), Zac Dover)

- doc/rados: remove dual-stack docs ([pr#57073](https://github.com/ceph/ceph/pull/57073), Zac Dover)

- doc/rados: remove redundant pg repair commands ([pr#57040](https://github.com/ceph/ceph/pull/57040), Zac Dover)

- doc/rados: s/cepgsqlite/cephsqlite/ ([pr#57247](https://github.com/ceph/ceph/pull/57247), Zac Dover)

- doc/rados: standardize markup of "clean" ([pr#60501](https://github.com/ceph/ceph/pull/60501), Zac Dover)

- doc/rados: update how to install c++ header files ([pr#58308](https://github.com/ceph/ceph/pull/58308), Pere Diaz Bou)

- doc/radosgw/config-ref: fix lc worker thread tuning ([pr#61438](https://github.com/ceph/ceph/pull/61438), Laimis Juzeliunas)

- doc/radosgw/multisite: fix Configuring Secondary Zones -> Updating the Period ([pr#60333](https://github.com/ceph/ceph/pull/60333), Casey Bodley)

- doc/radosgw/s3: correct eTag op match tables ([pr#61309](https://github.com/ceph/ceph/pull/61309), Anthony D'Atri)

- doc/radosgw: disambiguate version-added remarks ([pr#57141](https://github.com/ceph/ceph/pull/57141), Zac Dover)

- doc/radosgw: Improve archive-sync-module<span></span>.rst ([pr#60853](https://github.com/ceph/ceph/pull/60853), Anthony D'Atri)

- doc/radosgw: Improve archive-sync-module<span></span>.rst more ([pr#60868](https://github.com/ceph/ceph/pull/60868), Anthony D'Atri)

- doc/radosgw: s/zonegroup/pools/ ([pr#61557](https://github.com/ceph/ceph/pull/61557), Zac Dover)

- doc/radosgw: update Reef S3 action list ([pr#57365](https://github.com/ceph/ceph/pull/57365), Zac Dover)

- doc/radosgw: update rgw\_dns\_name doc ([pr#60886](https://github.com/ceph/ceph/pull/60886), Zac Dover)

- doc/radosgw: use 'confval' directive for reshard config options ([pr#57024](https://github.com/ceph/ceph/pull/57024), Casey Bodley)

- doc/rbd/rbd-exclusive-locks: mention incompatibility with advisory locks ([pr#58864](https://github.com/ceph/ceph/pull/58864), Ilya Dryomov)

- doc/rbd: add namespace information for mirror commands ([pr#60270](https://github.com/ceph/ceph/pull/60270), N Balachandran)

- doc/rbd: fix typos in NVMe-oF docs ([pr#58188](https://github.com/ceph/ceph/pull/58188), N Balachandran)

- doc/rbd: use https links in live import examples ([pr#61604](https://github.com/ceph/ceph/pull/61604), Ilya Dryomov)

- doc/README<span></span>.md - add ordered list ([pr#59799](https://github.com/ceph/ceph/pull/59799), Zac Dover)

- doc/README<span></span>.md: create selectable commands ([pr#59835](https://github.com/ceph/ceph/pull/59835), Zac Dover)

- doc/README<span></span>.md: edit "Build Prerequisites" ([pr#59638](https://github.com/ceph/ceph/pull/59638), Zac Dover)

- doc/README<span></span>.md: improve formatting ([pr#59786](https://github.com/ceph/ceph/pull/59786), Zac Dover)

- doc/README<span></span>.md: improve formatting ([pr#59701](https://github.com/ceph/ceph/pull/59701), Zac Dover)

- doc/releases: add actual\_eol for quincy ([pr#61360](https://github.com/ceph/ceph/pull/61360), Zac Dover)

- doc/releases: Add ordering comment to releases<span></span>.yml ([pr#62193](https://github.com/ceph/ceph/pull/62193), Anthony D'Atri)

- doc/rgw/d3n: pass cache dir volume to extra\_container\_args ([pr#59768](https://github.com/ceph/ceph/pull/59768), Mark Kogan)

- doc/rgw/notification: persistent notification queue full behavior ([pr#59234](https://github.com/ceph/ceph/pull/59234), Yuval Lifshitz)

- doc/rgw/notifications: specify which event types are enabled by default ([pr#54500](https://github.com/ceph/ceph/pull/54500), Yuval Lifshitz)

- doc/security: remove old GPG information ([pr#56914](https://github.com/ceph/ceph/pull/56914), Zac Dover)

- doc/security: update CVE list ([pr#57018](https://github.com/ceph/ceph/pull/57018), Zac Dover)

- doc/src: add inline literals (``) to variables ([pr#57937](https://github.com/ceph/ceph/pull/57937), Zac Dover)

- doc/src: invadvisable is not a word ([pr#58190](https://github.com/ceph/ceph/pull/58190), Doug Whitfield)

- doc/start/os-recommendations: remove 16<span></span>.2<span></span>.z support for CentOS 7 ([pr#58721](https://github.com/ceph/ceph/pull/58721), gukaifeng)

- doc/start: Add Beginner's Guide ([pr#57822](https://github.com/ceph/ceph/pull/57822), Zac Dover)

- doc/start: add links to Beginner's Guide ([pr#58203](https://github.com/ceph/ceph/pull/58203), Zac Dover)

- doc/start: add tested container host oses ([pr#58713](https://github.com/ceph/ceph/pull/58713), Zac Dover)

- doc/start: add vstart install guide ([pr#60462](https://github.com/ceph/ceph/pull/60462), Zac Dover)

- doc/start: Edit Beginner's Guide ([pr#57845](https://github.com/ceph/ceph/pull/57845), Zac Dover)

- doc/start: fix "are are" typo ([pr#60709](https://github.com/ceph/ceph/pull/60709), Zac Dover)

- doc/start: fix wording & syntax ([pr#58364](https://github.com/ceph/ceph/pull/58364), Piotr Parczewski)

- doc/start: Mention RGW in Intro to Ceph ([pr#61927](https://github.com/ceph/ceph/pull/61927), Anthony D'Atri)

- doc/start: remove "intro<span></span>.rst" ([pr#57949](https://github.com/ceph/ceph/pull/57949), Zac Dover)

- doc/start: remove mention of Centos 8 support ([pr#58390](https://github.com/ceph/ceph/pull/58390), Zac Dover)

- doc/start: s/http/https/ in links ([pr#57871](https://github.com/ceph/ceph/pull/57871), Zac Dover)

- doc/start: s/intro<span></span>.rst/index<span></span>.rst/ ([pr#57903](https://github.com/ceph/ceph/pull/57903), Zac Dover)

- doc/start: separate package and container support tables ([pr#60789](https://github.com/ceph/ceph/pull/60789), Zac Dover)

- doc/start: separate package chart from container chart ([pr#60699](https://github.com/ceph/ceph/pull/60699), Zac Dover)

- doc/start: update mailing list links ([pr#58684](https://github.com/ceph/ceph/pull/58684), Zac Dover)

- doc: add snapshots in docs under Cephfs concepts ([pr#61247](https://github.com/ceph/ceph/pull/61247), Neeraj Pratap Singh)

- doc: Amend dev mailing list subscribe instructions ([pr#58697](https://github.com/ceph/ceph/pull/58697), Paulo E. Castro)

- doc: clarify availability vs integrity ([pr#58131](https://github.com/ceph/ceph/pull/58131), Gregory O'Neill)

- doc: clarify superuser note for ceph-fuse ([pr#58615](https://github.com/ceph/ceph/pull/58615), Patrick Donnelly)

- doc: Clarify that there are no tertiary OSDs ([pr#61731](https://github.com/ceph/ceph/pull/61731), Anthony D'Atri)

- doc: clarify use of location: in host spec ([pr#57647](https://github.com/ceph/ceph/pull/57647), Matthew Vernon)

- doc: Correct link to "Device management" ([pr#58489](https://github.com/ceph/ceph/pull/58489), Matthew Vernon)

- doc: Correct link to Prometheus docs ([pr#59560](https://github.com/ceph/ceph/pull/59560), Matthew Vernon)

- doc: correct typo ([pr#57884](https://github.com/ceph/ceph/pull/57884), Matthew Vernon)

- doc: document metrics exported by CephFS ([pr#57724](https://github.com/ceph/ceph/pull/57724), Jos Collin)

- doc: Document the Windows CI job ([pr#60034](https://github.com/ceph/ceph/pull/60034), Lucian Petrut)

- doc: Document which options are disabled by mClock ([pr#60672](https://github.com/ceph/ceph/pull/60672), Niklas Hambüchen)

- doc: documenting the feature that scrub clear the entries from damage… ([pr#59079](https://github.com/ceph/ceph/pull/59079), Neeraj Pratap Singh)

- doc: explain the consequence of enabling mirroring through monitor co… ([pr#60526](https://github.com/ceph/ceph/pull/60526), Jos Collin)

- doc: fix email ([pr#60234](https://github.com/ceph/ceph/pull/60234), Ernesto Puerta)

- doc: fix incorrect radosgw-admin subcommand ([pr#62005](https://github.com/ceph/ceph/pull/62005), Toshikuni Fukaya)

- doc: fix typo ([pr#59992](https://github.com/ceph/ceph/pull/59992), N Balachandran)

- doc: Fixes a typo in controllers section of hardware recommendations ([pr#61179](https://github.com/ceph/ceph/pull/61179), Kevin Niederwanger)

- doc: fixup #58689 - document SSE-C iam condition key ([pr#62298](https://github.com/ceph/ceph/pull/62298), dawg)

- doc: Improve doc/radosgw/placement<span></span>.rst ([pr#58974](https://github.com/ceph/ceph/pull/58974), Anthony D'Atri)

- doc: improve tests-integration-testing-teuthology-workflow<span></span>.rst ([pr#61343](https://github.com/ceph/ceph/pull/61343), Vallari Agrawal)

- doc: s/Whereas,/Although/ ([pr#60594](https://github.com/ceph/ceph/pull/60594), Zac Dover)

- doc: SubmittingPatches-backports - remove backports team ([pr#60298](https://github.com/ceph/ceph/pull/60298), Zac Dover)

- doc: Update "Getting Started" to link to start not install ([pr#59908](https://github.com/ceph/ceph/pull/59908), Matthew Vernon)

- doc: update Key Idea in cephfs-mirroring<span></span>.rst ([pr#60344](https://github.com/ceph/ceph/pull/60344), Jos Collin)

- doc: update nfs doc for Kerberos setup of ganesha in Ceph ([pr#59940](https://github.com/ceph/ceph/pull/59940), Avan Thakkar)

- doc: update tests-integration-testing-teuthology-workflow<span></span>.rst ([pr#59549](https://github.com/ceph/ceph/pull/59549), Vallari Agrawal)

- doc: Upgrade and unpin some python versions ([pr#61932](https://github.com/ceph/ceph/pull/61932), David Galloway)

- doc:update e-mail addresses governance ([pr#60085](https://github.com/ceph/ceph/pull/60085), Tobias Fischer)

- docs/rados/operations/stretch-mode: warn device class is not supported ([pr#59100](https://github.com/ceph/ceph/pull/59100), Kamoltat Sirivadhna)

- docs: removed centos 8 and added squid to the build matrix ([pr#58902](https://github.com/ceph/ceph/pull/58902), Yuri Weinstein)

- exporter: fix regex for rgw sync metrics ([pr#57658](https://github.com/ceph/ceph/pull/57658), Avan Thakkar)

- exporter: handle exceptions gracefully ([pr#57371](https://github.com/ceph/ceph/pull/57371), Divyansh Kamboj)

- fix issue with bucket notification test ([pr#61881](https://github.com/ceph/ceph/pull/61881), Yuval Lifshitz)

- global: Call getnam\_r with a 64KiB buffer on the heap ([pr#60126](https://github.com/ceph/ceph/pull/60126), Adam Emerson)

- install-deps<span></span>.sh, do\_cmake<span></span>.sh: almalinux is another el flavour ([pr#58522](https://github.com/ceph/ceph/pull/58522), Dan van der Ster)

- install-deps: save and restore user's XDG\_CACHE\_HOME ([pr#56993](https://github.com/ceph/ceph/pull/56993), luo rixin)

- kv/RocksDBStore: Configure compact-on-deletion for all CFs ([pr#57402](https://github.com/ceph/ceph/pull/57402), Joshua Baergen)

- librados: use CEPH\_OSD\_FLAG\_FULL\_FORCE for IoCtxImpl::remove ([pr#59282](https://github.com/ceph/ceph/pull/59282), Chen Yuanrun)

- librbd/crypto/LoadRequest: clone format for migration source image ([pr#60170](https://github.com/ceph/ceph/pull/60170), Ilya Dryomov)

- librbd/crypto: fix issue when live-migrating from encrypted export ([pr#59151](https://github.com/ceph/ceph/pull/59151), Ilya Dryomov)

- librbd/migration/HttpClient: avoid reusing ssl\_stream after shut down ([pr#61094](https://github.com/ceph/ceph/pull/61094), Ilya Dryomov)

- librbd/migration: prune snapshot extents in RawFormat::list\_snaps() ([pr#59660](https://github.com/ceph/ceph/pull/59660), Ilya Dryomov)

- librbd: add rbd\_diff\_iterate3() API to take source snapshot by ID ([pr#62129](https://github.com/ceph/ceph/pull/62129), Ilya Dryomov, Vinay Bhaskar Varada)

- librbd: avoid data corruption on flatten when object map is inconsistent ([pr#61167](https://github.com/ceph/ceph/pull/61167), Ilya Dryomov)

- librbd: clear ctx before initiating close in Image::{aio\\_,}close() ([pr#61526](https://github.com/ceph/ceph/pull/61526), Ilya Dryomov)

- librbd: create rbd\_trash object during pool initialization and namespace creation ([pr#57603](https://github.com/ceph/ceph/pull/57603), Ramana Raja)

- librbd: diff-iterate shouldn't crash on an empty byte range ([pr#58211](https://github.com/ceph/ceph/pull/58211), Ilya Dryomov)

- librbd: disallow group snap rollback if memberships don't match ([pr#58207](https://github.com/ceph/ceph/pull/58207), Ilya Dryomov)

- librbd: don't crash on a zero-length read if buffer is NULL ([pr#57570](https://github.com/ceph/ceph/pull/57570), Ilya Dryomov)

- librbd: fix a crash in get\_rollback\_snap\_id ([pr#62045](https://github.com/ceph/ceph/pull/62045), Ilya Dryomov, N Balachandran)

- librbd: fix a deadlock on image\_lock caused by Mirror::image\_disable() ([pr#62127](https://github.com/ceph/ceph/pull/62127), Ilya Dryomov)

- librbd: fix mirror image status summary in a namespace ([pr#61831](https://github.com/ceph/ceph/pull/61831), Ilya Dryomov)

- librbd: make diff-iterate in fast-diff mode aware of encryption ([pr#58345](https://github.com/ceph/ceph/pull/58345), Ilya Dryomov)

- librbd: make group and group snapshot IDs more random ([pr#57091](https://github.com/ceph/ceph/pull/57091), Ilya Dryomov)

- librbd: stop filtering async request error codes ([pr#61644](https://github.com/ceph/ceph/pull/61644), Ilya Dryomov)

- Links to Jenkins jobs in PR comment commands / Remove deprecated commands ([pr#62037](https://github.com/ceph/ceph/pull/62037), David Galloway)

- log: save/fetch thread name infra ([pr#60728](https://github.com/ceph/ceph/pull/60728), Milind Changire, Patrick Donnelly)

- Make mon addrs consistent with mon info ([pr#60750](https://github.com/ceph/ceph/pull/60750), shenjiatong)

- mds/client: return -ENODATA when xattr doesn't exist for removexattr ([pr#58770](https://github.com/ceph/ceph/pull/58770), Xiubo Li)

- mds/purgequeue: add l\_pq\_executed\_ops counter ([pr#58328](https://github.com/ceph/ceph/pull/58328), shimin)

- mds: Add fragment to scrub ([pr#56895](https://github.com/ceph/ceph/pull/56895), Christopher Hoffman)

- mds: batch backtrace updates by pool-id when expiring a log segment ([issue#63259](http://tracker.ceph.com/issues/63259), [pr#60689](https://github.com/ceph/ceph/pull/60689), Venky Shankar)

- mds: cephx path restriction incorrectly rejects snapshots of deleted directory ([pr#59519](https://github.com/ceph/ceph/pull/59519), Patrick Donnelly)

- mds: check relevant caps for fs include root\_squash ([pr#57343](https://github.com/ceph/ceph/pull/57343), Patrick Donnelly)

- mds: CInode::item\_caps used in two different lists ([pr#56886](https://github.com/ceph/ceph/pull/56886), Dhairya Parmar)

- mds: defer trim() until after the last cache\_rejoin ack being received ([pr#56747](https://github.com/ceph/ceph/pull/56747), Xiubo Li)

- mds: do remove the cap when seqs equal or larger than last issue ([pr#58295](https://github.com/ceph/ceph/pull/58295), Xiubo Li)

- mds: don't add counters in warning for standby-replay MDS ([pr#57834](https://github.com/ceph/ceph/pull/57834), Rishabh Dave)

- mds: don't stall the asok thread for flush commands ([pr#57560](https://github.com/ceph/ceph/pull/57560), Leonid Usov)

- mds: fix session/client evict command ([issue#68132](http://tracker.ceph.com/issues/68132), [pr#58726](https://github.com/ceph/ceph/pull/58726), Venky Shankar, Neeraj Pratap Singh)

- mds: fix the description for inotable testing only options ([pr#57115](https://github.com/ceph/ceph/pull/57115), Xiubo Li)

- mds: getattr just waits the xlock to be released by the previous client ([pr#60692](https://github.com/ceph/ceph/pull/60692), Xiubo Li)

- mds: Implement remove for ceph vxattrs ([pr#58350](https://github.com/ceph/ceph/pull/58350), Christopher Hoffman)

- mds: inode\_t flags may not be protected by the policylock during set\_vxattr ([pr#57177](https://github.com/ceph/ceph/pull/57177), Patrick Donnelly)

- mds: log at a lower level when stopping ([pr#57227](https://github.com/ceph/ceph/pull/57227), Kotresh HR)

- mds: misc fixes for MDSAuthCaps code ([pr#60207](https://github.com/ceph/ceph/pull/60207), Xiubo Li)

- mds: prevent scrubbing for standby-replay MDS ([pr#58493](https://github.com/ceph/ceph/pull/58493), Neeraj Pratap Singh)

- mds: relax divergent backtrace scrub failures for replicated ancestor inodes ([issue#64730](http://tracker.ceph.com/issues/64730), [pr#58502](https://github.com/ceph/ceph/pull/58502), Venky Shankar)

- mds: set the correct WRLOCK flag always in wrlock\_force() ([pr#58497](https://github.com/ceph/ceph/pull/58497), Xiubo Li)

- mds: set the proper extra bl for the create request ([pr#58528](https://github.com/ceph/ceph/pull/58528), Xiubo Li)

- mds: some request errors come from errno<span></span>.h rather than fs\_types<span></span>.h ([pr#56664](https://github.com/ceph/ceph/pull/56664), Patrick Donnelly)

- mds: try to choose a new batch head in request\_clientup() ([pr#58842](https://github.com/ceph/ceph/pull/58842), Xiubo Li)

- mds: use regular dispatch for processing beacons ([pr#57683](https://github.com/ceph/ceph/pull/57683), Patrick Donnelly)

- mds: use regular dispatch for processing metrics ([pr#57681](https://github.com/ceph/ceph/pull/57681), Patrick Donnelly)

- mgr/BaseMgrModule: Optimize CPython Call in Finish Function ([pr#55110](https://github.com/ceph/ceph/pull/55110), Nitzan Mordechai)

- mgr/cephadm: add "original\_weight" parameter to OSD class ([pr#59411](https://github.com/ceph/ceph/pull/59411), Adam King)

- mgr/cephadm: add command to expose systemd units of all daemons ([pr#61915](https://github.com/ceph/ceph/pull/61915), Adam King)

- mgr/cephadm: Allows enabling NFS Ganesha NLM ([pr#56909](https://github.com/ceph/ceph/pull/56909), Teoman ONAY)

- mgr/cephadm: ceph orch host drain command to return error for invalid hostname ([pr#61919](https://github.com/ceph/ceph/pull/61919), Shweta Bhosale)

- mgr/cephadm: cleanup iscsi and nvmeof keyrings upon daemon removal ([pr#59459](https://github.com/ceph/ceph/pull/59459), Adam King)

- mgr/cephadm: create OSD daemon deploy specs through make\_daemon\_spec ([pr#61923](https://github.com/ceph/ceph/pull/61923), Adam King)

- mgr/cephadm: fix flake8 test failures ([pr#58076](https://github.com/ceph/ceph/pull/58076), Nizamudeen A)

- mgr/cephadm: fix typo with vrrp\_interfaces in keepalive setup ([pr#61904](https://github.com/ceph/ceph/pull/61904), Adam King)

- mgr/cephadm: make client-keyring deploying ceph<span></span>.conf optional ([pr#59451](https://github.com/ceph/ceph/pull/59451), Adam King)

- mgr/cephadm: make setting --cgroups=split configurable for adopted daemons ([pr#59460](https://github.com/ceph/ceph/pull/59460), Gilad Sid)

- mgr/cephadm: make SMB and NVMEoF upgrade last in staggered upgrade ([pr#59462](https://github.com/ceph/ceph/pull/59462), Adam King)

- mgr/cephadm: mgr orchestrator module raise exception if there is trailing tab in yaml file ([pr#61921](https://github.com/ceph/ceph/pull/61921), Shweta Bhosale)

- mgr/cephadm: set OSD cap for NVMEoF daemon to "profile rbd" ([pr#57234](https://github.com/ceph/ceph/pull/57234), Adam King)

- mgr/cephadm: Update multi-site configs before deploying  daemons on rgw service create ([pr#60350](https://github.com/ceph/ceph/pull/60350), Aashish Sharma)

- mgr/cephadm: use double quotes for NFSv4 RecoveryBackend in ganesha conf ([pr#61924](https://github.com/ceph/ceph/pull/61924), Adam King)

- mgr/cephadm: use host address while updating rgw zone endpoints ([pr#59947](https://github.com/ceph/ceph/pull/59947), Aashish Sharma)

- mgr/dashboard: add a custom warning message when enabling feature ([pr#61038](https://github.com/ceph/ceph/pull/61038), Nizamudeen A)

- mgr/dashboard: add absolute path validation for pseudo path of nfs export ([pr#57637](https://github.com/ceph/ceph/pull/57637), avanthakkar)

- mgr/dashboard: add cephfs rename REST API ([pr#60729](https://github.com/ceph/ceph/pull/60729), Yite Gu)

- mgr/dashboard: add dueTime to rgw bucket validator ([pr#58247](https://github.com/ceph/ceph/pull/58247), Nizamudeen A)

- mgr/dashboard: add NFS export button for subvolume/ grp ([pr#58657](https://github.com/ceph/ceph/pull/58657), Avan Thakkar)

- mgr/dashboard: add prometheus federation config for mullti-cluster monitoring ([pr#57255](https://github.com/ceph/ceph/pull/57255), Aashish Sharma)

- mgr/dashboard: Administration > Configuration > Some of the config options are not updatable at runtime ([pr#61182](https://github.com/ceph/ceph/pull/61182), Naman Munet)

- mgr/dashboard: bump follow-redirects from 1<span></span>.15<span></span>.3 to 1<span></span>.15<span></span>.6 in /src/pybind/mgr/dashboard/frontend ([pr#56877](https://github.com/ceph/ceph/pull/56877), dependabot[bot])

- mgr/dashboard: Changes for Sign out text to Login out ([pr#58989](https://github.com/ceph/ceph/pull/58989), Prachi Goel)

- mgr/dashboard: Cloning subvolume not listing \_nogroup if no subvolume ([pr#59952](https://github.com/ceph/ceph/pull/59952), Dnyaneshwari talwekar)

- mgr/dashboard: critical confirmation modal changes ([pr#61980](https://github.com/ceph/ceph/pull/61980), Naman Munet)

- mgr/dashboard: disable deleting bucket with objects ([pr#61973](https://github.com/ceph/ceph/pull/61973), Naman Munet)

- mgr/dashboard: exclude cloned-deleted RBD snaps ([pr#57219](https://github.com/ceph/ceph/pull/57219), Ernesto Puerta)

- mgr/dashboard: fix clone async validators with different groups ([pr#58338](https://github.com/ceph/ceph/pull/58338), Nizamudeen A)

- mgr/dashboard: fix dashboard not visible on disabled anonymous access ([pr#56965](https://github.com/ceph/ceph/pull/56965), Nizamudeen A)

- mgr/dashboard: fix doc links in rgw-multisite ([pr#60155](https://github.com/ceph/ceph/pull/60155), Pedro Gonzalez Gomez)

- mgr/dashboard: fix duplicate grafana panels when on mgr failover ([pr#56929](https://github.com/ceph/ceph/pull/56929), Avan Thakkar)

- mgr/dashboard: fix edit bucket failing in other selected gateways ([pr#58245](https://github.com/ceph/ceph/pull/58245), Nizamudeen A)

- mgr/dashboard: fix handling NaN values in dashboard charts ([pr#59962](https://github.com/ceph/ceph/pull/59962), Aashish Sharma)

- mgr/dashboard: Fix Latency chart data units in rgw overview page ([pr#61237](https://github.com/ceph/ceph/pull/61237), Aashish Sharma)

- mgr/dashboard: fix readonly landingpage ([pr#57752](https://github.com/ceph/ceph/pull/57752), Pedro Gonzalez Gomez)

- mgr/dashboard: fix setting compression type while editing rgw zone ([pr#59971](https://github.com/ceph/ceph/pull/59971), Aashish Sharma)

- mgr/dashboard: fix snap schedule delete retention ([pr#56862](https://github.com/ceph/ceph/pull/56862), Ivo Almeida)

- mgr/dashboard: fix total objects/Avg object size in RGW Overview Page ([pr#61458](https://github.com/ceph/ceph/pull/61458), Aashish Sharma)

- mgr/dashboard: Fix variable capitalization in embedded rbd-details panel ([pr#62209](https://github.com/ceph/ceph/pull/62209), Juan Ferrer Toribio)

- mgr/dashboard: Forbid snapshot name "<span></span>." and any containing "/" ([pr#59994](https://github.com/ceph/ceph/pull/59994), Dnyaneshwari Talwekar)

- mgr/dashboard: handle infinite values for pools ([pr#61097](https://github.com/ceph/ceph/pull/61097), Afreen)

- mgr/dashboard: introduce server side pagination for osds ([pr#60295](https://github.com/ceph/ceph/pull/60295), Nizamudeen A)

- mgr/dashboard: Move features to advanced section and expand by default rbd config section ([pr#56921](https://github.com/ceph/ceph/pull/56921), Afreen)

- mgr/dashboard: nfs export enhancement for CEPHFS ([pr#58475](https://github.com/ceph/ceph/pull/58475), Avan Thakkar)

- mgr/dashboard: pin lxml to fix run-dashboard-tox-make-check failure ([pr#62256](https://github.com/ceph/ceph/pull/62256), Nizamudeen A)

- mgr/dashboard: remove cherrypy\_backports<span></span>.py ([pr#60633](https://github.com/ceph/ceph/pull/60633), Nizamudeen A)

- mgr/dashboard: remove minutely from retention ([pr#56917](https://github.com/ceph/ceph/pull/56917), Ivo Almeida)

- mgr/dashboard: remove orch required decorator from host UI router (list) ([pr#59852](https://github.com/ceph/ceph/pull/59852), Naman Munet)

- mgr/dashboard: service form hosts selection only show up to 10 entries ([pr#59761](https://github.com/ceph/ceph/pull/59761), Naman Munet)

- mgr/dashboard: snapshot schedule repeat frequency validation ([pr#56880](https://github.com/ceph/ceph/pull/56880), Ivo Almeida)

- mgr/dashboard: Update and correct zonegroup delete notification ([pr#61236](https://github.com/ceph/ceph/pull/61236), Aashish Sharma)

- mgr/dashboard: update period after migrating to multi-site ([pr#59963](https://github.com/ceph/ceph/pull/59963), Aashish Sharma)

- mgr/dashboard: update translations for reef ([pr#60358](https://github.com/ceph/ceph/pull/60358), Nizamudeen A)

- mgr/dashboard: When configuring the RGW Multisite endpoints from the UI allow FQDN(Not only IP) ([pr#62354](https://github.com/ceph/ceph/pull/62354), Aashish Sharma)

- mgr/dashboard: Wrong(half) uid is observed in dashboard ([pr#59876](https://github.com/ceph/ceph/pull/59876), Dnyaneshwari Talwekar)

- mgr/dashboard: Zone details showing incorrect data for data pool values and compression info for Storage Classes ([pr#59877](https://github.com/ceph/ceph/pull/59877), Aashish Sharma)

- mgr/diskprediction\_local: avoid more mypy errors ([pr#62369](https://github.com/ceph/ceph/pull/62369), John Mulligan)

- mgr/diskprediction\_local: avoid mypy error ([pr#61292](https://github.com/ceph/ceph/pull/61292), John Mulligan)

- mgr/k8sevents: update V1Events to CoreV1Events ([pr#57994](https://github.com/ceph/ceph/pull/57994), Nizamudeen A)

- mgr/Mgr<span></span>.cc: clear daemon health metrics instead of removing down/out osd from daemon state ([pr#58513](https://github.com/ceph/ceph/pull/58513), Cory Snyder)

- mgr/nfs: Don't crash ceph-mgr if NFS clusters are unavailable ([pr#58283](https://github.com/ceph/ceph/pull/58283), Anoop C S, Ponnuvel Palaniyappan)

- mgr/nfs: scrape nfs monitoring endpoint ([pr#61719](https://github.com/ceph/ceph/pull/61719), avanthakkar)

- mgr/orchestrator: fix encrypted flag handling in orch daemon add osd ([pr#61720](https://github.com/ceph/ceph/pull/61720), Yonatan Zaken)

- mgr/pybind/object\_format: fix json-pretty being marked invalid ([pr#59458](https://github.com/ceph/ceph/pull/59458), Adam King)

- mgr/rest: Trim  requests array and limit size ([pr#59371](https://github.com/ceph/ceph/pull/59371), Nitzan Mordechai)

- mgr/rgw: Adding a retry config while calling zone\_create() ([pr#61717](https://github.com/ceph/ceph/pull/61717), Kritik Sachdeva)

- mgr/rgw: fix error handling in rgw zone create ([pr#61713](https://github.com/ceph/ceph/pull/61713), Adam King)

- mgr/rgw: fix setting rgw realm token in secondary site rgw spec ([pr#61715](https://github.com/ceph/ceph/pull/61715), Adam King)

- mgr/snap\_schedule: correctly fetch mds\_max\_snaps\_per\_dir from mds ([pr#59648](https://github.com/ceph/ceph/pull/59648), Milind Changire)

- mgr/snap\_schedule: restore yearly spec to lowercase y ([pr#57446](https://github.com/ceph/ceph/pull/57446), Milind Changire)

- mgr/stats: initialize mx\_last\_updated in FSPerfStats ([pr#57441](https://github.com/ceph/ceph/pull/57441), Jos Collin)

- mgr/status: Fix 'fs status' json output ([pr#60188](https://github.com/ceph/ceph/pull/60188), Kotresh HR)

- mgr/vol : shortening the name of helper method ([pr#60369](https://github.com/ceph/ceph/pull/60369), Neeraj Pratap Singh)

- mgr/vol: handle case where clone index entry goes missing ([pr#58556](https://github.com/ceph/ceph/pull/58556), Rishabh Dave)

- mgr: fix subuser creation via dashboard ([pr#62087](https://github.com/ceph/ceph/pull/62087), Hannes Baum)

- mgr: remove out&down osd from mgr daemons ([pr#54533](https://github.com/ceph/ceph/pull/54533), shimin)

- Modify container/ software to support release containers and the promotion of prerelease containers ([pr#60961](https://github.com/ceph/ceph/pull/60961), Dan Mick)

- mon, osd, \*: expose upmap-primary in OSDMap::get\_features() ([pr#57794](https://github.com/ceph/ceph/pull/57794), Radoslaw Zarzynski)

- mon, osd: add command to remove invalid pg-upmap-primary entries ([pr#62191](https://github.com/ceph/ceph/pull/62191), Laura Flores)

- mon, qa: suites override ec profiles with --yes\_i\_really\_mean\_it; monitors accept that ([pr#59274](https://github.com/ceph/ceph/pull/59274), Radoslaw Zarzynski, Radosław Zarzyński)

- mon,cephfs: require confirmation flag to bring down unhealthy MDS ([pr#57837](https://github.com/ceph/ceph/pull/57837), Rishabh Dave)

- mon/ElectionLogic: tie-breaker mon ignore proposal from marked down mon ([pr#58687](https://github.com/ceph/ceph/pull/58687), Kamoltat)

- mon/LogMonitor: Use generic cluster log level config ([pr#57495](https://github.com/ceph/ceph/pull/57495), Prashant D)

- mon/MDSMonitor: fix assert crash in `fs swap` ([pr#57373](https://github.com/ceph/ceph/pull/57373), Patrick Donnelly)

- mon/MonClient: handle ms\_handle\_fast\_authentication return ([pr#59307](https://github.com/ceph/ceph/pull/59307), Patrick Donnelly)

- mon/MonmapMonitor: do not propose on error in prepare\_update ([pr#56400](https://github.com/ceph/ceph/pull/56400), Patrick Donnelly)

- mon/OSDMonitor: Add force-remove-snap mon command ([pr#59404](https://github.com/ceph/ceph/pull/59404), Matan Breizman)

- mon/OSDMonitor: fix rmsnap command ([pr#56431](https://github.com/ceph/ceph/pull/56431), Matan Breizman)

- mon/OSDMonitor: relax cap enforcement for unmanaged snapshots ([pr#61602](https://github.com/ceph/ceph/pull/61602), Ilya Dryomov)

- mon/scrub: log error details of store access failures ([pr#61345](https://github.com/ceph/ceph/pull/61345), Yite Gu)

- mon: add created\_at and ceph\_version\_when\_created meta ([pr#56681](https://github.com/ceph/ceph/pull/56681), Ryotaro Banno)

- mon: do not log MON\_DOWN if monitor uptime is less than threshold ([pr#56408](https://github.com/ceph/ceph/pull/56408), Patrick Donnelly)

- mon: fix `fs set down` to adjust max\_mds only when cluster is not down ([pr#59705](https://github.com/ceph/ceph/pull/59705), chungfengz)

- mon: Remove any pg\_upmap\_primary mapping during remove a pool ([pr#59270](https://github.com/ceph/ceph/pull/59270), Mohit Agrawal)

- mon: stuck peering since warning is misleading ([pr#57408](https://github.com/ceph/ceph/pull/57408), shreyanshjain7174)

- mon: validate also mons and osds on {rm-,}pg-upmap-primary ([pr#59275](https://github.com/ceph/ceph/pull/59275), Radosław Zarzyński)

- msg/async: Encode message once features are set ([pr#59286](https://github.com/ceph/ceph/pull/59286), Aishwarya Mathuria)

- msg/AsyncMessenger: re-evaluate the stop condition when woken up in 'wait()' ([pr#53717](https://github.com/ceph/ceph/pull/53717), Leonid Usov)

- msg: always generate random nonce; don't try to reuse PID ([pr#53269](https://github.com/ceph/ceph/pull/53269), Radoslaw Zarzynski)

- msg: insert PriorityDispatchers in sorted position ([pr#61507](https://github.com/ceph/ceph/pull/61507), Casey Bodley)

- node-proxy: make the daemon discover endpoints ([pr#58483](https://github.com/ceph/ceph/pull/58483), Guillaume Abrioux)

- nofail option in fstab not supported ([pr#52985](https://github.com/ceph/ceph/pull/52985), Leonid Usov)

- orch: refactor boolean handling in drive group spec ([pr#61914](https://github.com/ceph/ceph/pull/61914), Guillaume Abrioux)

- os/bluestore: add perfcount for bluestore/bluefs allocator ([pr#59103](https://github.com/ceph/ceph/pull/59103), Yite Gu)

- os/bluestore: add some slow count for bluestore ([pr#59104](https://github.com/ceph/ceph/pull/59104), Yite Gu)

- os/bluestore: allow use BtreeAllocator ([pr#59499](https://github.com/ceph/ceph/pull/59499), tan changzhi)

- os/bluestore: enable async manual compactions ([pr#58741](https://github.com/ceph/ceph/pull/58741), Igor Fedotov)

- os/bluestore: expand BlueFS log if available space is insufficient ([pr#57241](https://github.com/ceph/ceph/pull/57241), Pere Diaz Bou)

- os/bluestore: Fix BlueRocksEnv attempts to use POSIX ([pr#61112](https://github.com/ceph/ceph/pull/61112), Adam Kupczyk)

- os/bluestore: fix btree allocator ([pr#59264](https://github.com/ceph/ceph/pull/59264), Igor Fedotov)

- os/bluestore: fix crash caused by dividing by 0 ([pr#57197](https://github.com/ceph/ceph/pull/57197), Jrchyang Yu)

- os/bluestore: fix the problem of l\_bluefs\_log\_compactions double recording ([pr#57194](https://github.com/ceph/ceph/pull/57194), Wang Linke)

- os/bluestore: fix the problem that \_estimate\_log\_size\_N calculates the log size incorrectly ([pr#61892](https://github.com/ceph/ceph/pull/61892), Wang Linke)

- os/bluestore: Improve documentation introduced by #57722 ([pr#60894](https://github.com/ceph/ceph/pull/60894), Anthony D'Atri)

- os/bluestore: Make truncate() drop unused allocations ([pr#60237](https://github.com/ceph/ceph/pull/60237), Adam Kupczyk, Igor Fedotov)

- os/bluestore: set rocksdb iterator bounds for Bluestore::\_collection\_list() ([pr#57625](https://github.com/ceph/ceph/pull/57625), Cory Snyder)

- os/bluestore: Warning added for slow operations and stalled read ([pr#59466](https://github.com/ceph/ceph/pull/59466), Md Mahamudur Rahaman Sajib)

- os/store\_test: Retune tests to current code ([pr#56139](https://github.com/ceph/ceph/pull/56139), Adam Kupczyk)

- os: introduce ObjectStore::refresh\_perf\_counters() method ([pr#55136](https://github.com/ceph/ceph/pull/55136), Igor Fedotov)

- os: remove unused btrfs\_ioctl<span></span>.h and tests ([pr#60612](https://github.com/ceph/ceph/pull/60612), Casey Bodley)

- osd/OSDMonitor: check svc is writeable before changing pending ([pr#57067](https://github.com/ceph/ceph/pull/57067), Patrick Donnelly)

- osd/PeeringState: introduce osd\_skip\_check\_past\_interval\_bounds ([pr#60284](https://github.com/ceph/ceph/pull/60284), Matan Breizman)

- osd/perf\_counters: raise prio of before queue op perfcounter ([pr#59105](https://github.com/ceph/ceph/pull/59105), Yite Gu)

- osd/scheduler: add mclock queue length perfcounter ([pr#59034](https://github.com/ceph/ceph/pull/59034), zhangjianwei2)

- osd/scrub: Change scrub cost to average object size ([pr#59629](https://github.com/ceph/ceph/pull/59629), Aishwarya Mathuria)

- osd/scrub: decrease default deep scrub chunk size ([pr#59792](https://github.com/ceph/ceph/pull/59792), Ronen Friedman)

- osd/scrub: reduce osd\_requested\_scrub\_priority default value ([pr#59886](https://github.com/ceph/ceph/pull/59886), Ronen Friedman)

- osd/SnapMapper: fix \_lookup\_purged\_snap ([pr#56813](https://github.com/ceph/ceph/pull/56813), Matan Breizman)

- osd/TrackedOp: Fix TrackedOp event order ([pr#59108](https://github.com/ceph/ceph/pull/59108), YiteGu)

- osd: Add memstore to unsupported objstores for QoS ([pr#59285](https://github.com/ceph/ceph/pull/59285), Aishwarya Mathuria)

- osd: adding 'reef' to pending\_require\_osd\_release ([pr#60981](https://github.com/ceph/ceph/pull/60981), Philipp Hufangl)

- osd: always send returnvec-on-errors for client's retry ([pr#59273](https://github.com/ceph/ceph/pull/59273), Radoslaw Zarzynski)

- osd: avoid watcher remains after "rados watch" is interrupted ([pr#58846](https://github.com/ceph/ceph/pull/58846), weixinwei)

- osd: bump versions of decoders for upmap-primary ([pr#58802](https://github.com/ceph/ceph/pull/58802), Radoslaw Zarzynski)

- osd: CEPH\_OSD\_OP\_FLAG\_BYPASS\_CLEAN\_CACHE flag is passed from ECBackend ([pr#57621](https://github.com/ceph/ceph/pull/57621), Md Mahamudur Rahaman Sajib)

- osd: Change PG Deletion cost for mClock ([pr#56475](https://github.com/ceph/ceph/pull/56475), Aishwarya Mathuria)

- osd: do not assert on fast shutdown timeout ([pr#55135](https://github.com/ceph/ceph/pull/55135), Igor Fedotov)

- osd: ensure async recovery does not drop a pg below min\_size ([pr#54550](https://github.com/ceph/ceph/pull/54550), Samuel Just)

- osd: fix for segmentation fault on OSD fast shutdown ([pr#57615](https://github.com/ceph/ceph/pull/57615), Md Mahamudur Rahaman Sajib)

- osd: full-object read CRC mismatch due to 'truncate' modifying oi<span></span>.size w/o clearing 'data\_digest' ([pr#57588](https://github.com/ceph/ceph/pull/57588), Samuel Just, Matan Breizman, Nitzan Mordechai, jiawd)

- osd: make \_set\_cache\_sizes ratio aware of cache\_kv\_onode\_ratio ([pr#55220](https://github.com/ceph/ceph/pull/55220), Raimund Sacherer)

- osd: optimize extent comparison in PrimaryLogPG ([pr#61336](https://github.com/ceph/ceph/pull/61336), Dongdong Tao)

- osd: Report health error if OSD public address is not within subnet ([pr#55697](https://github.com/ceph/ceph/pull/55697), Prashant D)

- pybind/ceph\_argparse: Fix error message for ceph tell command ([pr#59197](https://github.com/ceph/ceph/pull/59197), Neeraj Pratap Singh)

- pybind/mgr/mirroring: Fix KeyError: 'directory\_count' in daemon status ([pr#57763](https://github.com/ceph/ceph/pull/57763), Jos Collin)

- pybind/mgr: disable sqlite3/python autocommit ([pr#57190](https://github.com/ceph/ceph/pull/57190), Patrick Donnelly)

- pybind/rados: fix missed changes for PEP484 style type annotations ([pr#54358](https://github.com/ceph/ceph/pull/54358), Igor Fedotov)

- pybind/rbd: expose CLONE\_FORMAT and FLATTEN image options ([pr#57309](https://github.com/ceph/ceph/pull/57309), Ilya Dryomov)

- python-common: fix valid\_addr on python 3<span></span>.11 ([pr#61947](https://github.com/ceph/ceph/pull/61947), John Mulligan)

- python-common: handle "anonymous\_access: false" in to\_json of Grafana spec ([pr#59457](https://github.com/ceph/ceph/pull/59457), Adam King)

- qa/cephadm: use reef image as default for test\_cephadm workunit ([pr#56714](https://github.com/ceph/ceph/pull/56714), Adam King)

- qa/cephadm: wait a bit before checking rgw daemons upgraded w/ `ceph versions` ([pr#61917](https://github.com/ceph/ceph/pull/61917), Adam King)

- qa/cephfs: a bug fix and few missing backport for caps\_helper<span></span>.py ([pr#58340](https://github.com/ceph/ceph/pull/58340), Rishabh Dave)

- qa/cephfs: add mgr debugging ([pr#56415](https://github.com/ceph/ceph/pull/56415), Patrick Donnelly)

- qa/cephfs: add more ignorelist entries ([issue#64746](http://tracker.ceph.com/issues/64746), [pr#56022](https://github.com/ceph/ceph/pull/56022), Venky Shankar)

- qa/cephfs: add probabilistic ignorelist for pg\_health ([pr#56666](https://github.com/ceph/ceph/pull/56666), Patrick Donnelly)

- qa/cephfs: CephFSTestCase<span></span>.create\_client() must keyring ([pr#56836](https://github.com/ceph/ceph/pull/56836), Rishabh Dave)

- qa/cephfs: fix test\_single\_path\_authorize\_on\_nonalphanumeric\_fsname ([pr#58560](https://github.com/ceph/ceph/pull/58560), Rishabh Dave)

- qa/cephfs: fix TestRenameCommand and unmount the clinet before failin… ([pr#59399](https://github.com/ceph/ceph/pull/59399), Xiubo Li)

- qa/cephfs: ignore variant of MDS\_UP\_LESS\_THAN\_MAX ([pr#58789](https://github.com/ceph/ceph/pull/58789), Patrick Donnelly)

- qa/cephfs: ignore when specific OSD is reported down during upgrade ([pr#60390](https://github.com/ceph/ceph/pull/60390), Rishabh Dave)

- qa/cephfs: ignorelist clog of MDS\_UP\_LESS\_THAN\_MAX ([pr#56403](https://github.com/ceph/ceph/pull/56403), Patrick Donnelly)

- qa/cephfs: improvements for "mds fail" and "fs fail" ([pr#58563](https://github.com/ceph/ceph/pull/58563), Rishabh Dave)

- qa/cephfs: remove dependency on centos8/rhel8 entirely ([pr#59054](https://github.com/ceph/ceph/pull/59054), Venky Shankar)

- qa/cephfs: switch to ubuntu 22<span></span>.04 for stock kernel testing ([pr#62492](https://github.com/ceph/ceph/pull/62492), Venky Shankar)

- qa/cephfs: use different config options to generate MDS\_TRIM ([pr#59375](https://github.com/ceph/ceph/pull/59375), Rishabh Dave)

- qa/distros: reinstall nvme-cli on centos 9 nodes ([pr#59463](https://github.com/ceph/ceph/pull/59463), Adam King)

- qa/distros: remove centos 8 from supported distros ([pr#57932](https://github.com/ceph/ceph/pull/57932), Guillaume Abrioux, Casey Bodley, Adam King, Laura Flores)

- qa/fsx: use a specified sha1 to build the xfstest-dev ([pr#57557](https://github.com/ceph/ceph/pull/57557), Xiubo Li)

- qa/mgr/dashboard: fix test race condition ([pr#59697](https://github.com/ceph/ceph/pull/59697), Nizamudeen A, Ernesto Puerta)

- qa/multisite: add boto3<span></span>.client to the library ([pr#60850](https://github.com/ceph/ceph/pull/60850), Shilpa Jagannath)

- qa/rgw/crypt: disable failing kmip testing ([pr#60701](https://github.com/ceph/ceph/pull/60701), Casey Bodley)

- qa/rgw/sts: keycloak task installs java manually ([pr#60418](https://github.com/ceph/ceph/pull/60418), Casey Bodley)

- qa/rgw: avoid 'user rm' of keystone users ([pr#62104](https://github.com/ceph/ceph/pull/62104), Casey Bodley)

- qa/rgw: barbican uses branch stable/2023<span></span>.1 ([pr#56819](https://github.com/ceph/ceph/pull/56819), Casey Bodley)

- qa/rgw: bump keystone/barbican from 2023<span></span>.1 to 2024<span></span>.1 ([pr#61022](https://github.com/ceph/ceph/pull/61022), Casey Bodley)

- qa/rgw: fix s3 java tests by forcing gradle to run on Java 8 ([pr#61054](https://github.com/ceph/ceph/pull/61054), J. Eric Ivancich)

- qa/rgw: force Hadoop to run under Java 1<span></span>.8 ([pr#61121](https://github.com/ceph/ceph/pull/61121), J. Eric Ivancich)

- qa/rgw: pull Apache artifacts from mirror instead of archive<span></span>.apache<span></span>.org ([pr#61102](https://github.com/ceph/ceph/pull/61102), J. Eric Ivancich)

- qa/standalone/mon/mon\_cluster\_log<span></span>.sh: retry check for log line ([pr#60780](https://github.com/ceph/ceph/pull/60780), Shraddha Agrawal, Naveen Naidu)

- qa/standalone/scrub: increase status updates frequency ([pr#59975](https://github.com/ceph/ceph/pull/59975), Ronen Friedman)

- qa/suites/krbd: drop pre-single-major and move "layering only" coverage ([pr#57464](https://github.com/ceph/ceph/pull/57464), Ilya Dryomov)

- qa/suites/krbd: stress test for recovering from watch errors for -o exclusive ([pr#58856](https://github.com/ceph/ceph/pull/58856), Ilya Dryomov)

- qa/suites/rados/singleton: add POOL\_APP\_NOT\_ENABLED to ignorelist ([pr#57487](https://github.com/ceph/ceph/pull/57487), Laura Flores)

- qa/suites/rados/thrash-old-clients: update supported releases and distro ([pr#57999](https://github.com/ceph/ceph/pull/57999), Laura Flores)

- qa/suites/rados/thrash/workloads: remove cache tiering workload ([pr#58413](https://github.com/ceph/ceph/pull/58413), Laura Flores)

- qa/suites/rados/verify/validater/valgrind: increase op thread timeout ([pr#54527](https://github.com/ceph/ceph/pull/54527), Matan Breizman)

- qa/suites/rados/verify/validater: increase heartbeat grace timeout ([pr#58786](https://github.com/ceph/ceph/pull/58786), Sridhar Seshasayee)

- qa/suites/rados: Cancel injectfull to allow cleanup ([pr#59157](https://github.com/ceph/ceph/pull/59157), Brad Hubbard)

- qa/suites/rbd/iscsi: enable all supported container hosts ([pr#60088](https://github.com/ceph/ceph/pull/60088), Ilya Dryomov)

- qa/suites/rbd: override extra\_system\_packages directly on install task ([pr#57765](https://github.com/ceph/ceph/pull/57765), Ilya Dryomov)

- qa/suites/upgrade/reef-p2p/reef-p2p-parallel: increment upgrade to 18<span></span>.2<span></span>.2 ([pr#58411](https://github.com/ceph/ceph/pull/58411), Laura Flores)

- qa/suites: add "mon down" log variations to ignorelist ([pr#61711](https://github.com/ceph/ceph/pull/61711), Laura Flores)

- qa/suites: drop --show-reachable=yes from fs:valgrind tests ([pr#59069](https://github.com/ceph/ceph/pull/59069), Jos Collin)

- qa/tasks/ceph\_manager<span></span>.py: Rewrite test\_pool\_min\_size ([pr#59268](https://github.com/ceph/ceph/pull/59268), Kamoltat)

- qa/tasks/cephadm: enable mon\_cluster\_log\_to\_file ([pr#55431](https://github.com/ceph/ceph/pull/55431), Dan van der Ster)

- qa/tasks/nvme\_loop: update task to work with new nvme list format ([pr#61027](https://github.com/ceph/ceph/pull/61027), Adam King)

- qa/tasks/qemu: Fix OS version comparison ([pr#58170](https://github.com/ceph/ceph/pull/58170), Zack Cerza)

- qa/tasks: Include stderr on tasks badness check ([pr#61434](https://github.com/ceph/ceph/pull/61434), Christopher Hoffman, Ilya Dryomov)

- qa/tasks: watchdog should terminate thrasher ([pr#59193](https://github.com/ceph/ceph/pull/59193), Nitzan Mordechai)

- qa/tests: added client-upgrade-reef-squid tests ([pr#58447](https://github.com/ceph/ceph/pull/58447), Yuri Weinstein)

- qa/upgrade: fix checks to make sure upgrade is still in progress ([pr#61718](https://github.com/ceph/ceph/pull/61718), Adam King)

- qa/workunits/rbd: avoid caching effects in luks-encryption<span></span>.sh ([pr#58853](https://github.com/ceph/ceph/pull/58853), Ilya Dryomov)

- qa/workunits/rbd: wait for resize to be applied in rbd-nbd ([pr#62218](https://github.com/ceph/ceph/pull/62218), Ilya Dryomov)

- qa: account for rbd\_trash object in krbd\_data\_pool<span></span>.sh + related ceph{,adm} task fixes ([pr#58540](https://github.com/ceph/ceph/pull/58540), Ilya Dryomov)

- qa: add a YAML to ignore MGR\_DOWN warning ([pr#57565](https://github.com/ceph/ceph/pull/57565), Dhairya Parmar)

- qa: Add multifs root\_squash testcase ([pr#56690](https://github.com/ceph/ceph/pull/56690), Rishabh Dave, Kotresh HR)

- qa: add support/qa for cephfs-shell on CentOS 9 / RHEL9 ([pr#57162](https://github.com/ceph/ceph/pull/57162), Patrick Donnelly)

- qa: adjust expected io\_opt in krbd\_discard\_granularity<span></span>.t ([pr#59231](https://github.com/ceph/ceph/pull/59231), Ilya Dryomov)

- qa: barbican: restrict python packages with upper-constraints ([pr#59326](https://github.com/ceph/ceph/pull/59326), Tobias Urdin)

- qa: cleanup snapshots before subvolume delete ([pr#58332](https://github.com/ceph/ceph/pull/58332), Milind Changire)

- qa: disable mon\_warn\_on\_pool\_no\_app in fs suite ([pr#57920](https://github.com/ceph/ceph/pull/57920), Patrick Donnelly)

- qa: do the set/get attribute on the remote filesystem ([pr#59828](https://github.com/ceph/ceph/pull/59828), Jos Collin)

- qa: enable debug logs for fs:cephadm:multivolume subsuite ([issue#66029](http://tracker.ceph.com/issues/66029), [pr#58157](https://github.com/ceph/ceph/pull/58157), Venky Shankar)

- qa: enhance per-client labelled perf counters test ([pr#58251](https://github.com/ceph/ceph/pull/58251), Jos Collin, Rishabh Dave)

- qa: failfast mount for better performance and unblock `fs volume ls` ([pr#59920](https://github.com/ceph/ceph/pull/59920), Milind Changire)

- qa: fix error reporting string in assert\_cluster\_log ([pr#55391](https://github.com/ceph/ceph/pull/55391), Dhairya Parmar)

- qa: fix krbd\_msgr\_segments and krbd\_rxbounce failing on 8<span></span>.stream ([pr#57030](https://github.com/ceph/ceph/pull/57030), Ilya Dryomov)

- qa: fix log errors for cephadm tests ([pr#58421](https://github.com/ceph/ceph/pull/58421), Guillaume Abrioux)

- qa: fixing tests in test\_cephfs\_shell<span></span>.TestShellOpts ([pr#58111](https://github.com/ceph/ceph/pull/58111), Neeraj Pratap Singh)

- qa: ignore cluster warnings generated from forward-scrub task ([issue#48562](http://tracker.ceph.com/issues/48562), [pr#57611](https://github.com/ceph/ceph/pull/57611), Venky Shankar)

- qa: ignore container checkpoint/restore related selinux denials for centos9 ([issue#64616](http://tracker.ceph.com/issues/64616), [pr#56019](https://github.com/ceph/ceph/pull/56019), Venky Shankar)

- qa: ignore container checkpoint/restore related selinux denials for c… ([issue#67118](http://tracker.ceph.com/issues/67118), [issue#66640](http://tracker.ceph.com/issues/66640), [pr#58809](https://github.com/ceph/ceph/pull/58809), Venky Shankar)

- qa: ignore human-friendly POOL\_APP\_NOT\_ENABLED in clog ([pr#56951](https://github.com/ceph/ceph/pull/56951), Patrick Donnelly)

- qa: ignore PG health warnings in CephFS QA ([pr#58172](https://github.com/ceph/ceph/pull/58172), Patrick Donnelly)

- qa: ignore variation of PG\_DEGRADED health warning ([pr#58231](https://github.com/ceph/ceph/pull/58231), Patrick Donnelly)

- qa: ignore warnings variations ([pr#59618](https://github.com/ceph/ceph/pull/59618), Patrick Donnelly)

- qa: increase debugging for snap\_schedule ([pr#57172](https://github.com/ceph/ceph/pull/57172), Patrick Donnelly)

- qa: increase the http postBuffer size and disable sslVerify ([pr#53628](https://github.com/ceph/ceph/pull/53628), Xiubo Li)

- qa: load all dirfrags before testing altname recovery ([pr#59522](https://github.com/ceph/ceph/pull/59522), Patrick Donnelly)

- qa: relocate subvol creation overrides and test ([pr#59923](https://github.com/ceph/ceph/pull/59923), Milind Changire)

- qa: suppress \_\_trans\_list\_add valgrind warning ([pr#58791](https://github.com/ceph/ceph/pull/58791), Patrick Donnelly)

- qa: suppress Leak\_StillReachable mon leak in centos 9 jobs ([pr#58692](https://github.com/ceph/ceph/pull/58692), Laura Flores)

- qa: switch to use the merge fragment for fscrypt ([pr#55857](https://github.com/ceph/ceph/pull/55857), Xiubo Li)

- qa: test test\_kill\_mdstable for all mount types ([pr#56953](https://github.com/ceph/ceph/pull/56953), Patrick Donnelly)

- qa: unmount clients before damaging the fs ([pr#57524](https://github.com/ceph/ceph/pull/57524), Patrick Donnelly)

- qa: use centos9 for fs:upgrade ([pr#58113](https://github.com/ceph/ceph/pull/58113), Venky Shankar, Dhairya Parmar)

- qa: wait for file creation before changing mode ([issue#67408](http://tracker.ceph.com/issues/67408), [pr#59686](https://github.com/ceph/ceph/pull/59686), Venky Shankar)

- rbd-mirror: clean up stale pool replayers and callouts better ([pr#57306](https://github.com/ceph/ceph/pull/57306), Ilya Dryomov)

- rbd-mirror: fix possible recursive lock of ImageReplayer::m\_lock ([pr#62043](https://github.com/ceph/ceph/pull/62043), N Balachandran)

- rbd-mirror: use correct ioctx for namespace ([pr#59772](https://github.com/ceph/ceph/pull/59772), N Balachandran)

- rbd-nbd: use netlink interface by default ([pr#62175](https://github.com/ceph/ceph/pull/62175), Ilya Dryomov, Ramana Raja)

- rbd: "rbd bench" always writes the same byte ([pr#59501](https://github.com/ceph/ceph/pull/59501), Ilya Dryomov)

- rbd: amend "rbd {group,} rename" and "rbd mirror pool" command descriptions ([pr#59601](https://github.com/ceph/ceph/pull/59601), Ilya Dryomov)

- rbd: handle --{group,image}-namespace in "rbd group image {add,rm}" ([pr#61171](https://github.com/ceph/ceph/pull/61171), Ilya Dryomov)

- rbd: open images in read-only mode for "rbd mirror pool status --verbose" ([pr#61169](https://github.com/ceph/ceph/pull/61169), Ilya Dryomov)

- Revert "reef: rgw/amqp: lock erase and create connection before emplace" ([pr#59016](https://github.com/ceph/ceph/pull/59016), Rongqi Sun)

- Revert "rgw/auth: Fix the return code returned by AuthStrategy," ([pr#61405](https://github.com/ceph/ceph/pull/61405), Casey Bodley, Pritha Srivastava)

- rgw/abortmp: Race condition on AbortMultipartUpload ([pr#61133](https://github.com/ceph/ceph/pull/61133), Casey Bodley, Artem Vasilev)

- rgw/admin/notification: add command to dump notifications ([pr#58070](https://github.com/ceph/ceph/pull/58070), Yuval Lifshitz)

- rgw/amqp: lock erase and create connection before emplace ([pr#59018](https://github.com/ceph/ceph/pull/59018), Rongqi Sun)

- rgw/amqp: lock erase and create connection before emplace ([pr#58715](https://github.com/ceph/ceph/pull/58715), Rongqi Sun)

- rgw/archive: avoid duplicating objects when syncing from multiple zones ([pr#59341](https://github.com/ceph/ceph/pull/59341), Shilpa Jagannath)

- rgw/auth: ignoring signatures for HTTP OPTIONS calls ([pr#60455](https://github.com/ceph/ceph/pull/60455), Tobias Urdin)

- rgw/beast: fix crash observed in SSL stream<span></span>.async\_shutdown() ([pr#57425](https://github.com/ceph/ceph/pull/57425), Mark Kogan)

- rgw/http/client-side: disable curl path normalization ([pr#59258](https://github.com/ceph/ceph/pull/59258), Oguzhan Ozmen)

- rgw/http: finish\_request() after logging errors ([pr#59440](https://github.com/ceph/ceph/pull/59440), Casey Bodley)

- rgw/iam: fix role deletion replication ([pr#59126](https://github.com/ceph/ceph/pull/59126), Alex Wojno)

- rgw/kafka: refactor topic creation to avoid rd\_kafka\_topic\_name() ([pr#59764](https://github.com/ceph/ceph/pull/59764), Yuval Lifshitz)

- rgw/kafka: set message timeout to 5 seconds ([pr#56158](https://github.com/ceph/ceph/pull/56158), Yuval Lifshitz)

- rgw/lc: make lc worker thread name shorter ([pr#61485](https://github.com/ceph/ceph/pull/61485), lightmelodies)

- rgw/lua: add lib64 to the package search path ([pr#59343](https://github.com/ceph/ceph/pull/59343), Yuval Lifshitz)

- rgw/lua: add more info on package install errors ([pr#59127](https://github.com/ceph/ceph/pull/59127), Yuval Lifshitz)

- rgw/multisite: allow PutACL replication ([pr#58546](https://github.com/ceph/ceph/pull/58546), Shilpa Jagannath)

- rgw/multisite: avoid writing multipart parts to the bucket index log ([pr#57127](https://github.com/ceph/ceph/pull/57127), Juan Zhu)

- rgw/multisite: don't retain RGW\_ATTR\_OBJ\_REPLICATION\_TRACE attr on copy\_object ([pr#58764](https://github.com/ceph/ceph/pull/58764), Shilpa Jagannath)

- rgw/multisite: Fix use-after-move in retry logic in logbacking ([pr#61329](https://github.com/ceph/ceph/pull/61329), Adam Emerson)

- rgw/multisite: metadata polling event based on unmodified mdlog\_marker ([pr#60793](https://github.com/ceph/ceph/pull/60793), Shilpa Jagannath)

- rgw/notifications/test: fix rabbitmq and kafka issues in centos9 ([pr#58312](https://github.com/ceph/ceph/pull/58312), Yuval Lifshitz)

- rgw/notifications: cleanup all coroutines after sending the notification ([pr#59354](https://github.com/ceph/ceph/pull/59354), Yuval Lifshitz)

- rgw/rados: don't rely on IoCtx::get\_last\_version() for async ops ([pr#60097](https://github.com/ceph/ceph/pull/60097), Casey Bodley)

- rgw/rgw\_rados: fix server side-copy orphans tail-objects ([pr#61367](https://github.com/ceph/ceph/pull/61367), Adam Kupczyk, Gabriel BenHanokh, Daniel Gryniewicz)

- rgw/s3select: s3select response handler refactor ([pr#57229](https://github.com/ceph/ceph/pull/57229), Seena Fallah, Gal Salomon)

- rgw/sts: changing identity to boost::none, when role policy ([pr#59346](https://github.com/ceph/ceph/pull/59346), Pritha Srivastava)

- rgw/sts: fix to disallow unsupported JWT algorithms ([pr#62046](https://github.com/ceph/ceph/pull/62046), Pritha Srivastava)

- rgw/swift: preserve dashes/underscores in swift user metadata names ([pr#56615](https://github.com/ceph/ceph/pull/56615), Juan Zhu, Ali Maredia)

- rgw/test/kafka: let consumer read events from the beginning ([pr#61595](https://github.com/ceph/ceph/pull/61595), Yuval Lifshitz)

- rgw: add versioning status during `radosgw-admin bucket stats` ([pr#59261](https://github.com/ceph/ceph/pull/59261), J. Eric Ivancich)

- rgw: append query string to redirect URL if present ([pr#61160](https://github.com/ceph/ceph/pull/61160), Seena Fallah)

- rgw: compatibility issues on BucketPublicAccessBlock ([pr#59125](https://github.com/ceph/ceph/pull/59125), Seena Fallah)

- rgw: cumulatively fix 6 AWS SigV4 request failure cases ([pr#58435](https://github.com/ceph/ceph/pull/58435), Zac Dover, Casey Bodley, Ali Maredia, Matt Benjamin)

- rgw: decrement qlen/qactive perf counters on error ([pr#59669](https://github.com/ceph/ceph/pull/59669), Mark Kogan)

- rgw: Delete stale entries in bucket indexes while deleting obj ([pr#61061](https://github.com/ceph/ceph/pull/61061), Shasha Lu)

- rgw: do not assert on thread name setting failures ([pr#58058](https://github.com/ceph/ceph/pull/58058), Yuval Lifshitz)

- rgw: fix bucket link operation ([pr#61052](https://github.com/ceph/ceph/pull/61052), Yehuda Sadeh)

- RGW: fix cloud-sync not being able to sync folders ([pr#56554](https://github.com/ceph/ceph/pull/56554), Gabriel Adrian Samfira)

- rgw: fix CompleteMultipart error handling regression ([pr#57301](https://github.com/ceph/ceph/pull/57301), Casey Bodley)

- rgw: fix data corruption when rados op return ETIMEDOUT ([pr#61093](https://github.com/ceph/ceph/pull/61093), Shasha Lu)

- rgw: Fix LC process stuck issue ([pr#61531](https://github.com/ceph/ceph/pull/61531), Soumya Koduri, Tongliang Deng)

- rgw: fix the Content-Length in response header of static website ([pr#60741](https://github.com/ceph/ceph/pull/60741), xiangrui meng)

- rgw: fix user<span></span>.rgw<span></span>.user-policy attr remove by modify user ([pr#59134](https://github.com/ceph/ceph/pull/59134), ivan)

- rgw: increase log level on abort\_early ([pr#59124](https://github.com/ceph/ceph/pull/59124), Seena Fallah)

- rgw: invalidate and retry keystone admin token ([pr#59075](https://github.com/ceph/ceph/pull/59075), Tobias Urdin)

- rgw: keep the tails when copying object to itself ([pr#62656](https://github.com/ceph/ceph/pull/62656), Jane Zhu)

- rgw: link only radosgw with ALLOC\_LIBS ([pr#60733](https://github.com/ceph/ceph/pull/60733), Matt Benjamin)

- rgw: load copy source bucket attrs in putobj ([pr#59415](https://github.com/ceph/ceph/pull/59415), Seena Fallah)

- rgw: modify string match\_wildcards with fnmatch ([pr#57901](https://github.com/ceph/ceph/pull/57901), zhipeng li, Adam Emerson)

- rgw: optimize gc chain size calculation ([pr#58168](https://github.com/ceph/ceph/pull/58168), Wei Wang)

- rgw: S3 Delete Bucket Policy should return 204 on success ([pr#61432](https://github.com/ceph/ceph/pull/61432), Simon Jürgensmeyer)

- rgw: swift: tempurl fixes for ceph ([pr#59356](https://github.com/ceph/ceph/pull/59356), Casey Bodley, Marcus Watts)

- rgw: update options yaml file so LDAP uri isn't an invalid example ([pr#56721](https://github.com/ceph/ceph/pull/56721), J. Eric Ivancich)

- rgw: when there are a large number of multiparts, the unorder list result may miss objects ([pr#60745](https://github.com/ceph/ceph/pull/60745), J. Eric Ivancich)

- rgwfile: fix lock\_guard decl ([pr#59351](https://github.com/ceph/ceph/pull/59351), Matt Benjamin)

- run-make-check: use get\_processors in run-make-check script ([pr#58872](https://github.com/ceph/ceph/pull/58872), John Mulligan)

- src/ceph-volume/ceph\_volume/devices/lvm/listing<span></span>.py : lvm list filters with vg name ([pr#58998](https://github.com/ceph/ceph/pull/58998), Pierre Lemay)

- src/exporter: improve usage message ([pr#61332](https://github.com/ceph/ceph/pull/61332), Anthony D'Atri)

- src/mon/ConnectionTracker<span></span>.cc: Fix dump function ([pr#60004](https://github.com/ceph/ceph/pull/60004), Kamoltat)

- src/pybind/mgr/pg\_autoscaler/module<span></span>.py: fix 'pg\_autoscale\_mode' output ([pr#59444](https://github.com/ceph/ceph/pull/59444), Kamoltat)

- suites: test should ignore osd\_down warnings ([pr#59146](https://github.com/ceph/ceph/pull/59146), Nitzan Mordechai)

- test/cls\_lock: expired lock before unlock and start check ([pr#59271](https://github.com/ceph/ceph/pull/59271), Nitzan Mordechai)

- test/lazy-omap-stats: Convert to boost::regex ([pr#57456](https://github.com/ceph/ceph/pull/57456), Brad Hubbard)

- test/librbd/fsx: switch to netlink interface for rbd-nbd ([pr#61259](https://github.com/ceph/ceph/pull/61259), Ilya Dryomov)

- test/librbd/test\_notify<span></span>.py: conditionally ignore some errors ([pr#62688](https://github.com/ceph/ceph/pull/62688), Ilya Dryomov)

- test/librbd: clean up unused TEST\_COOKIE variable ([pr#58549](https://github.com/ceph/ceph/pull/58549), Rongqi Sun)

- test/rbd\_mirror: clear Namespace::s\_instance at the end of a test ([pr#61959](https://github.com/ceph/ceph/pull/61959), Ilya Dryomov)

- test/rbd\_mirror: flush watch/notify callbacks in TestImageReplayer ([pr#61957](https://github.com/ceph/ceph/pull/61957), Ilya Dryomov)

- test/rgw/multisite: add meta checkpoint after bucket creation ([pr#60977](https://github.com/ceph/ceph/pull/60977), Casey Bodley)

- test/rgw/notification: use real ip address instead of localhost ([pr#59304](https://github.com/ceph/ceph/pull/59304), Yuval Lifshitz)

- test/rgw: address potential race condition in reshard testing ([pr#58793](https://github.com/ceph/ceph/pull/58793), J. Eric Ivancich)

- test/store\_test: fix deferred writing test cases ([pr#55778](https://github.com/ceph/ceph/pull/55778), Igor Fedotov)

- test/store\_test: fix DeferredWrite test when prefer\_deferred\_size=0 ([pr#56199](https://github.com/ceph/ceph/pull/56199), Igor Fedotov)

- test/store\_test: get rid off assert\_death ([pr#55774](https://github.com/ceph/ceph/pull/55774), Igor Fedotov)

- test/store\_test: refactor spillover tests ([pr#55200](https://github.com/ceph/ceph/pull/55200), Igor Fedotov)

- test: ceph daemon command with asok path ([pr#61481](https://github.com/ceph/ceph/pull/61481), Nitzan Mordechai)

- test: Create ParallelPGMapper object before start threadpool ([pr#58920](https://github.com/ceph/ceph/pull/58920), Mohit Agrawal)

- Test: osd-recovery-space<span></span>.sh extends the wait time for "recovery toofull" ([pr#59043](https://github.com/ceph/ceph/pull/59043), Nitzan Mordechai)

- teuthology/bluestore: Fix running of compressed tests ([pr#57094](https://github.com/ceph/ceph/pull/57094), Adam Kupczyk)

- tool/ceph-bluestore-tool: fix wrong keyword for 'free-fragmentation' … ([pr#62124](https://github.com/ceph/ceph/pull/62124), Igor Fedotov)

- tools/ceph\_objectstore\_tool: Support get/set/superblock ([pr#55015](https://github.com/ceph/ceph/pull/55015), Matan Breizman)

- tools/cephfs: recover alternate\_name of dentries from journal ([pr#58232](https://github.com/ceph/ceph/pull/58232), Patrick Donnelly)

- tools/objectstore: check for wrong coll open\_collection ([pr#58734](https://github.com/ceph/ceph/pull/58734), Pere Diaz Bou)

- valgrind: update suppression for SyscallParam under call\_init ([pr#52611](https://github.com/ceph/ceph/pull/52611), Casey Bodley)

- win32\_deps\_build<span></span>.sh: pin zlib tag ([pr#61630](https://github.com/ceph/ceph/pull/61630), Lucian Petrut)

- workunit/dencoder: dencoder test forward incompat fix ([pr#61750](https://github.com/ceph/ceph/pull/61750), NitzanMordhai, Nitzan Mordechai)
