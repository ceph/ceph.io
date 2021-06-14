---
title: "v14.2.12 Nautilus Released"
date: "2020-10-20"
author: "TheAnalyst"
---

This is the 12th backport release in the Nautilus series. This release brings a number of bugfixes across all major components of Ceph. We recommend that all Nautilus users upgrade to this release.

## Notable Changes[¶](#notable-changes "Permalink to this headline")

- The `ceph df` command now lists the number of pgs in each pool.
    
- Monitors now have a config option `mon_osd_warn_num_repaired`, 10 by default. If any OSD has repaired more than this many I/O errors in stored data a `OSD_TOO_MANY_REPAIRS` health warning is generated. In order to allow clearing of the warning, a new command `ceph tell osd.# clear_shards_repaired [count]` has been added. By default it will set the repair count to 0. If you wanted to be warned again if additional repairs are performed you can provide a value to the command and specify the value of `mon_osd_warn_num_repaired`. This command will be replaced in future releases by the health mute/unmute feature.
    
- It is now possible to specify the initial monitor to contact for Ceph tools and daemons using the `mon_host_override` config option or `--mon-host-override <ip>` command-line switch. This generally should only be used for debugging and only affects initial communication with Ceph’s monitor cluster.
    

## Changelog[¶](#changelog "Permalink to this headline")

- bluestore/bluefs: make accounting resiliant to unlock() ([pr#36909](https://github.com/ceph/ceph/pull/36909), Adam Kupczyk)
    
- bluestore: Rescue procedure for extremely large bluefs log ([pr#36930](https://github.com/ceph/ceph/pull/36930), Adam Kupczyk)
    
- bluestore: dump onode that has too many spanning blobs ([pr#36756](https://github.com/ceph/ceph/pull/36756), Igor Fedotov)
    
- bluestore: enable more flexible bluefs space management by default ([pr#37091](https://github.com/ceph/ceph/pull/37091), Igor Fedotov)
    
- bluestore: fix collection\_list ordering ([pr#37051](https://github.com/ceph/ceph/pull/37051), Mykola Golub)
    
- ceph-iscsi: selinux fixes ([pr#36304](https://github.com/ceph/ceph/pull/36304), Mike Christie)
    
- ceph-volume: add tests for new functions that run LVM commands ([pr#36615](https://github.com/ceph/ceph/pull/36615), Rishabh Dave)
    
- ceph-volume: dont use container classes in api/lvm.py ([pr#35878](https://github.com/ceph/ceph/pull/35878), Guillaume Abrioux, Rishabh Dave’)
    
- ceph-volume: fix journal size argument not work ([pr#37377](https://github.com/ceph/ceph/pull/37377), wanghongxu)
    
- ceph-volume: fix simple activate when legacy osd ([pr#37195](https://github.com/ceph/ceph/pull/37195), Guillaume Abrioux)
    
- ceph-volume: fix test\_lvm.TestVolume.test\_is\_not\_ceph\_device ([pr#36493](https://github.com/ceph/ceph/pull/36493), Jan Fajerski)
    
- ceph-volume: handle idempotency with batch and explicit scenarios ([pr#35881](https://github.com/ceph/ceph/pull/35881), Andrew Schoen)
    
- ceph-volume: remove container classes from api/lvm.py ([pr#36610](https://github.com/ceph/ceph/pull/36610), Rishabh Dave)
    
- ceph-volume: remove unneeded call to get\_devices() ([pr#37413](https://github.com/ceph/ceph/pull/37413), Marc Gariepy)
    
- ceph-volume: report correct rejected reason in inventory if device type is invalid ([pr#36453](https://github.com/ceph/ceph/pull/36453), Satoru Takeuchi)
    
- ceph-volume: retry when acquiring lock fails ([pr#36926](https://github.com/ceph/ceph/pull/36926), Sxc3xa9bastien Han)
    
- ceph-volume: simple scan should ignore tmpfs ([pr#36952](https://github.com/ceph/ceph/pull/36952), Andrew Schoen)
    
- ceph.in: ignore failures to flush stdout ([pr#37226](https://github.com/ceph/ceph/pull/37226), Dan van der Ster)
    
- ceph.spec.in, debian/control: add smartmontools and nvme-cli dependenxe2x80xa6 ([pr#37288](https://github.com/ceph/ceph/pull/37288), Yaarit Hatuka)
    
- cephfs-journal-tool: fix incorrect read\_offset when finding missing objects ([pr#37479](https://github.com/ceph/ceph/pull/37479), Xue Yantao)
    
- cephfs: client: fix extra open ref decrease ([pr#36966](https://github.com/ceph/ceph/pull/36966), Xiubo Li)
    
- cephfs: client: make Client::open() pass proper cap mask to path\_walk ([pr#37231](https://github.com/ceph/ceph/pull/37231), “Yan, Zheng”)
    
- cephfs: mds/CInode: Optimize only pinned by subtrees check ([pr#36965](https://github.com/ceph/ceph/pull/36965), Mark Nelson)
    
- cephfs: mds: After restarting an mds, its standy-replay mds remained in the “resolve” state ([pr#37179](https://github.com/ceph/ceph/pull/37179), Wei Qiaomiao)
    
- cephfs: mds: do not defer incoming mgrmap when mds is laggy ([issue#44638](http://tracker.ceph.com/issues/44638), [pr#36168](https://github.com/ceph/ceph/pull/36168), Nathan Cutler, Venky Shankar)
    
- cephfs: mds: fix incorrect check for if dirfrag is being fragmented ([pr#37035](https://github.com/ceph/ceph/pull/37035), “Yan, Zheng”)
    
- cephfs: mds: fix mds forwarding request no\_available\_op\_found ([pr#36963](https://github.com/ceph/ceph/pull/36963), Yanhu Cao’)
    
- cephfs: mds: fix purge\_queues \_calculate\_ops is inaccurate ([pr#37481](https://github.com/ceph/ceph/pull/37481), Yanhu Cao’)
    
- cephfs: mds: kcephfs parse dirfrags ndist is always 0 ([pr#37177](https://github.com/ceph/ceph/pull/37177), Yanhu Cao’)
    
- cephfs: mds: place MDSGatherBuilder on the stack ([pr#36967](https://github.com/ceph/ceph/pull/36967), Patrick Donnelly)
    
- cephfs: mds: recover files after normal session close ([pr#37178](https://github.com/ceph/ceph/pull/37178), “Yan, Zheng”)
    
- cephfs: mds: resolve SIGSEGV in waiting for uncommitted fragments ([pr#36968](https://github.com/ceph/ceph/pull/36968), Patrick Donnelly)
    
- cephfs: osdc/Journaler: do not call onsafe->complete() if onsafe is 0 ([pr#37229](https://github.com/ceph/ceph/pull/37229), Xiubo Li)
    
- client: handle readdir reply without Fs cap ([pr#37232](https://github.com/ceph/ceph/pull/37232), “Yan, Zheng”)
    
- common, osd: add sanity checks around osd\_scrub\_max\_preemptions ([pr#37470](https://github.com/ceph/ceph/pull/37470), xie xingguo)
    
- common/config: less noise about configs from mon we cant apply ([pr#36289](https://github.com/ceph/ceph/pull/36289), Sage Weil’)
    
- common: ignore SIGHUP prior to fork ([issue#46269](http://tracker.ceph.com/issues/46269), [pr#36181](https://github.com/ceph/ceph/pull/36181), Willem Jan Withagen, hzwuhongsong)
    
- compressor: Add a config option to specify Zstd compression level ([pr#37254](https://github.com/ceph/ceph/pull/37254), Bryan Stillwell)
    
- core: include/encoding: Fix encode/decode of float types on big-endian systems ([pr#37033](https://github.com/ceph/ceph/pull/37033), Ulrich Weigand)
    
- doc/rados: Fix osd\_op\_queue default value ([pr#36354](https://github.com/ceph/ceph/pull/36354), Benoxc3xaet Knecht)
    
- doc/rados: Fix osd\_scrub\_during\_recovery default value ([pr#37472](https://github.com/ceph/ceph/pull/37472), Benoxc3xaet Knecht)
    
- doc/rbd: add rbd-target-gw enable and start ([pr#36415](https://github.com/ceph/ceph/pull/36415), Zac Dover)
    
- doc: enable Read the Docs ([pr#37204](https://github.com/ceph/ceph/pull/37204), Kefu Chai)
    
- krbd: optionally skip waiting for udev events ([pr#37284](https://github.com/ceph/ceph/pull/37284), Ilya Dryomov)
    
- kv/RocksDBStore: make options compaction\_threads/disableWAL/flusher\_txe2x80xa6 ([pr#37055](https://github.com/ceph/ceph/pull/37055), Jianpeng Ma)
    
- librados: add LIBRADOS\_SUPPORTS\_GETADDRS support ([pr#36853](https://github.com/ceph/ceph/pull/36853), Xiubo Li, Jason Dillaman, Kaleb S. KEITHLEY, Kefu Chai)
    
- messages,mds: Fix decoding of enum types on big-endian systems ([pr#36814](https://github.com/ceph/ceph/pull/36814), Ulrich Weigand)
    
- mgr/balancer: use “==” and “!=” for comparing str ([pr#37471](https://github.com/ceph/ceph/pull/37471), Kefu Chai)
    
- mgr/dashboard/api: increase API health timeout ([pr#36607](https://github.com/ceph/ceph/pull/36607), Ernesto Puerta)
    
- mgr/dashboard: Allow editing iSCSI targets with initiators logged-in ([pr#37278](https://github.com/ceph/ceph/pull/37278), Tiago Melo)
    
- mgr/dashboard: Disabling the form inputs for the read\_only modals ([pr#37241](https://github.com/ceph/ceph/pull/37241), Nizamudeen)
    
- mgr/dashboard: Dont use any xlf file when building the default language ([pr#37550](https://github.com/ceph/ceph/pull/37550), Sebastian Krah’)
    
- mgr/dashboard: Fix many-to-many issue in host-details Grafana dashboard ([pr#37306](https://github.com/ceph/ceph/pull/37306), Patrick Seidensal)
    
- mgr/dashboard: Fix pool renaming functionality ([pr#37510](https://github.com/ceph/ceph/pull/37510), Stephan Mxc3xbcller, Ernesto Puerta)
    
- mgr/dashboard: Hide table action input field if limit=0 ([pr#36783](https://github.com/ceph/ceph/pull/36783), Volker Theile)
    
- mgr/dashboard: Monitoring: Fix for the infinite loading bar action ([pr#37161](https://github.com/ceph/ceph/pull/37161), Nizamudeen A)
    
- mgr/dashboard: REST API returns 500 when no Content-Type is specified ([pr#37307](https://github.com/ceph/ceph/pull/37307), Avan Thakkar)
    
- mgr/dashboard: Unable to edit iSCSI logged-in client ([pr#36613](https://github.com/ceph/ceph/pull/36613), Ricardo Marques)
    
- mgr/dashboard: cpu stats incorrectly displayed ([pr#37295](https://github.com/ceph/ceph/pull/37295), Avan Thakkar)
    
- mgr/dashboard: document Prometheus security model ([pr#36920](https://github.com/ceph/ceph/pull/36920), Patrick Seidensal)
    
- mgr/dashboard: fix broken backporting ([pr#37505](https://github.com/ceph/ceph/pull/37505), Ernesto Puerta)
    
- mgr/dashboard: fix perf. issue when listing large amounts of buckets ([pr#37280](https://github.com/ceph/ceph/pull/37280), Alfonso Martxc3xadnez)
    
- mgr/dashboard: fix pool usage calculation ([pr#37309](https://github.com/ceph/ceph/pull/37309), Ernesto Puerta)
    
- mgr/dashboard: remove “This week/month/year” and “Today” time stamps ([pr#36790](https://github.com/ceph/ceph/pull/36790), Avan Thakkar)
    
- mgr/dashboard: table detail rows overflow ([pr#37324](https://github.com/ceph/ceph/pull/37324), Aashish Sharma)
    
- mgr/dashboard: wait longer for health status to be cleared ([pr#36784](https://github.com/ceph/ceph/pull/36784), Tatjana Dehler)
    
- mgr/devicehealth: fix daemon filtering before scraping device ([pr#36741](https://github.com/ceph/ceph/pull/36741), Yaarit Hatuka)
    
- mgr/diskprediction\_local: Fix array size error ([pr#36578](https://github.com/ceph/ceph/pull/36578), Benoxc3xaet Knecht)
    
- mgr/prometheus: automatically discover RBD pools for stats gathering ([pr#36412](https://github.com/ceph/ceph/pull/36412), Jason Dillaman)
    
- mgr/restful: use dict.items() for py3 compatible ([pr#36670](https://github.com/ceph/ceph/pull/36670), Kefu Chai)
    
- mgr/status: metadata is fetched async ([pr#37558](https://github.com/ceph/ceph/pull/37558), Michael Fritch)
    
- mgr/telemetry: fix device id splitting when anonymizing serial ([pr#37318](https://github.com/ceph/ceph/pull/37318), Yaarit Hatuka)
    
- mgr/volumes: add global lock debug ([pr#36828](https://github.com/ceph/ceph/pull/36828), Patrick Donnelly)
    
- mgr: Add missing states to PG\_STATES in mgr\_module.py ([pr#36785](https://github.com/ceph/ceph/pull/36785), Harley Gorrell)
    
- mgr: decrease pool stats if pg was removed ([pr#37476](https://github.com/ceph/ceph/pull/37476), Aleksei Gutikov)
    
- mgr: dont update pending service map epoch on receiving map from mon ([pr#37181](https://github.com/ceph/ceph/pull/37181), Mykola Golub’)
    
- minor tweaks to fix compile issues under latest Fedora ([pr#36726](https://github.com/ceph/ceph/pull/36726), Willem Jan Withagen, Kaleb S. KEITHLEY, Kefu Chai)
    
- mon/OSDMonitor: only take in osd into consideration when trimming osdxe2x80xa6 ([pr#36982](https://github.com/ceph/ceph/pull/36982), Kefu Chai)
    
- mon/PGMap: add pg count for pools in the ceph df command ([pr#36944](https://github.com/ceph/ceph/pull/36944), Vikhyat Umrao)
    
- mon: Warn when too many reads are repaired on an OSD ([pr#36379](https://github.com/ceph/ceph/pull/36379), David Zafman)
    
- mon: fix the Error ERANGEmessage when conf “osd\_objectstore” is filestore’ ([pr#37474](https://github.com/ceph/ceph/pull/37474), wangyunqing’)
    
- mon: mark pgtemp messages as no\_reply more consistenly in preprocess\\\_xe2x80xa6 ([pr#37171](https://github.com/ceph/ceph/pull/37171), Greg Farnum)
    
- mon: store mon updates in ceph context for future MonMap instantiation ([pr#36704](https://github.com/ceph/ceph/pull/36704), Patrick Donnelly, Shyamsundar Ranganathan)
    
- monclient: schedule first tick using mon\_client\_hunt\_interval ([pr#36634](https://github.com/ceph/ceph/pull/36634), Mykola Golub)
    
- msg/async/ProtocolV2: allow rxbuf/txbuf get bigger in testing ([pr#37081](https://github.com/ceph/ceph/pull/37081), Ilya Dryomov)
    
- osd/OSDCap: rbd profile permits use of “rbd\_info” ([pr#36413](https://github.com/ceph/ceph/pull/36413), Florian Florensa)
    
- osd/PeeringState: prevent peers num\_objects going negative ([pr#37473](https://github.com/ceph/ceph/pull/37473), xie xingguo’)
    
- prometheus: Properly split the port off IPv6 addresses ([pr#36984](https://github.com/ceph/ceph/pull/36984), Matthew Oliver)
    
- rbd: include RADOS namespace in krbd symlinks ([pr#37468](https://github.com/ceph/ceph/pull/37468), Ilya Dryomov)
    
- rbd: librbd: Align rbd\_write\_zeroes declarations ([pr#36712](https://github.com/ceph/ceph/pull/36712), Corey Bryant)
    
- rbd: librbd: dont resend async\_complete if watcher is unregistered ([pr#37040](https://github.com/ceph/ceph/pull/37040), Mykola Golub’)
    
- rbd: librbd: global and pool-level config overrides require image refresh to apply ([pr#36725](https://github.com/ceph/ceph/pull/36725), Jason Dillaman)
    
- rbd: librbd: using migration abort can result in the loss of data ([pr#37165](https://github.com/ceph/ceph/pull/37165), Jason Dillaman)
    
- rbd: make common options override krbd-specific options ([pr#37407](https://github.com/ceph/ceph/pull/37407), Ilya Dryomov)
    
- rgw/cls: preserve olh entrys name on last unlink ([pr#37462](https://github.com/ceph/ceph/pull/37462), Casey Bodley’)
    
- rgw: Add bucket name to bucket stats error logging ([pr#37378](https://github.com/ceph/ceph/pull/37378), Seena Fallah)
    
- rgw: Empty reqs\_change\_state queue before unregistered\_reqs ([pr#37461](https://github.com/ceph/ceph/pull/37461), Soumya Koduri)
    
- rgw: Expiration days cant be zero and transition days can be zero ([pr#37465](https://github.com/ceph/ceph/pull/37465), zhang Shaowen’)
    
- rgw: RGWObjVersionTracker tracks version over increments ([pr#37459](https://github.com/ceph/ceph/pull/37459), Casey Bodley)
    
- rgw: Swift API anonymous access should 401 ([pr#37438](https://github.com/ceph/ceph/pull/37438), Matthew Oliver)
    
- rgw: add access log to the beast frontend ([pr#36727](https://github.com/ceph/ceph/pull/36727), Mark Kogan)
    
- rgw: add negative cache to the system object ([pr#37460](https://github.com/ceph/ceph/pull/37460), Or Friedmann)
    
- rgw: append obj: prevent tail from being GCed ([pr#36390](https://github.com/ceph/ceph/pull/36390), Abhishek Lekshmanan’)
    
- rgw: dump transitions in RGWLifecycleConfiguration::dump() ([pr#36880](https://github.com/ceph/ceph/pull/36880), Shengming Zhang)
    
- rgw: fail when get/set-bucket-versioning attempted on a non-existent xe2x80xa6 ([pr#36188](https://github.com/ceph/ceph/pull/36188), Matt Benjamin)
    
- rgw: fix boost::asio::async\_write() does not return error ([pr#37157](https://github.com/ceph/ceph/pull/37157), Mark Kogan)
    
- rgw: fix double slash (//) killing the gateway ([pr#36682](https://github.com/ceph/ceph/pull/36682), Theofilos Mouratidis)
    
- rgw: fix shutdown crash in RGWAsyncReadMDLogEntries ([pr#37463](https://github.com/ceph/ceph/pull/37463), Casey Bodley)
    
- rgw: hold reloader using unique\_ptr ([pr#36770](https://github.com/ceph/ceph/pull/36770), Kefu Chai)
    
- rgw: log resharding events at level 1 (formerly 20) ([pr#36843](https://github.com/ceph/ceph/pull/36843), Or Friedmann)
    
- rgw: ordered bucket listing code clean-up ([pr#37169](https://github.com/ceph/ceph/pull/37169), J. Eric Ivancich)
    
- rgw: policy: reuse eval\_principal to evaluate the policy principal ([pr#36637](https://github.com/ceph/ceph/pull/36637), Abhishek Lekshmanan)
    
- rgw: radosgw-admin: period pull command is not always a raw\_storage\_op ([pr#37464](https://github.com/ceph/ceph/pull/37464), Casey Bodley)
    
- rgw: replace +with “%20” in canonical query string for s3 v4 auth’ ([pr#37467](https://github.com/ceph/ceph/pull/37467), yuliyang\_yewu’)
    
- rgw: urlencode bucket name when forwarding request ([pr#37435](https://github.com/ceph/ceph/pull/37435), caolei)
    
- run-make-check.sh: extract run-make.sh + run sudo with absolute path ([pr#36494](https://github.com/ceph/ceph/pull/36494), Kefu Chai, Ernesto Puerta)
    
- systemd: Support Graceful Reboot for AIO Node ([pr#37301](https://github.com/ceph/ceph/pull/37301), Wong Hoi Sing Edison)
    
- tools/osdmaptool.cc: add ability to clean\_temps ([pr#37477](https://github.com/ceph/ceph/pull/37477), Neha Ojha)
    
- tools/rados: Set locator key when exporting or importing a pool ([pr#37475](https://github.com/ceph/ceph/pull/37475), Iain Buclaw)
