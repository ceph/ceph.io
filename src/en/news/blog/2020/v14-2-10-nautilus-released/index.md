---
title: "v14.2.10 Nautilus released"
date: "2020-06-26"
author: "TheAnalyst"
---

This is the tenth release in the Nautilus series. In addition to fixing a security-related bug in RGW, this release brings a number of bugfixes across all major components of Ceph. We recommend that all Nautilus users upgrade to this release.

## Notable Changes

- CVE-2020-10753: rgw: sanitize newlines in s3 CORSConfiguration’s ExposeHeader (William Bowling, Adam Mohammed, Casey Bodley)
    
- RGW: Bucket notifications now support Kafka endpoints. This requires librdkafka of version 0.9.2 and up. Note that Ubuntu 16.04.6 LTS (Xenial Xerus) has an older version of librdkafka, and would require an update to the library.
    
- The pool parameter `target_size_ratio`, used by the pg autoscaler, has changed meaning. It is now normalized across pools, rather than specifying an absolute ratio. For details, see [Autoscaling placement groups](../../rados/operations/placement-groups/#pg-autoscaler). If you have set target size ratios on any pools, you may want to set these pools to autoscale `warn` mode to avoid data movement during the upgrade:
    
    ceph osd pool set <pool\-name\> pg\_autoscale\_mode warn
    
- The behaviour of the `-o` argument to the rados tool has been reverted to its orignal behaviour of indicating an output file. This reverts it to a more consistent behaviour when compared to other tools. Specifying object size is now accomplished by using an upper case O `-O`.
    
- The format of MDSs in ceph fs dump has changed.
    
- Ceph will issue a health warning if a RADOS pool’s `size` is set to 1 or in other words the pool is configured with no redundancy. This can be fixed by setting the pool size to the minimum recommended value with:
    
    ceph osd pool set <pool\-name\> size <num\-replicas\>
    
    The warning can be silenced with:
    
    ceph config set global mon\_warn\_on\_pool\_no\_redundancy false
    
- RGW: bucket listing performance on sharded bucket indexes has been notably improved by heuristically – and significantly, in many cases – reducing the number of entries requested from each bucket index shard.
    

## Changelog

- build/ops: address SElinux denials observed in rgw/multisite test run ([pr#34539](https://github.com/ceph/ceph/pull/34539), Kefu Chai, Kaleb S. Keithley)
    
- build/ops: ceph.spec.in: build on el8 ([pr#35599](https://github.com/ceph/ceph/pull/35599), Kefu Chai, Brad Hubbard, Alfonso Martínez, Nathan Cutler, Sage Weil, luo.runbing)
    
- build/ops: cmake: Improve test for 16-byte atomic support on IBM Z ([pr#33716](https://github.com/ceph/ceph/pull/33716), Ulrich Weigand)
    
- build/ops: do\_cmake.sh: fix application of -DWITH\_RADOSGW\_KAFKA\_ENDPOINT=OFF ([pr#34008](https://github.com/ceph/ceph/pull/34008), Nathan Cutler, Kefu Chai)
    
- build/ops: install-deps.sh: Use dnf for rhel/centos 8 ([pr#35461](https://github.com/ceph/ceph/pull/35461), Brad Hubbard)
    
- build/ops: rpm: add python3-saml as install dependency ([pr#34475](https://github.com/ceph/ceph/pull/34475), Kefu Chai, Ernesto Puerta)
    
- build/ops: selinux: Allow ceph to setsched ([pr#34433](https://github.com/ceph/ceph/pull/34433), Brad Hubbard)
    
- build/ops: selinux: Allow ceph-mgr access to httpd dir ([pr#34434](https://github.com/ceph/ceph/pull/34434), Brad Hubbard)
    
- build/ops: selinux: Allow getattr access to /proc/kcore ([pr#34870](https://github.com/ceph/ceph/pull/34870), Brad Hubbard)
    
- build/ops: spec: address some warnings raised by RPM 4.15.1 ([pr#34527](https://github.com/ceph/ceph/pull/34527), Nathan Cutler)
    
- ceph-volume/batch: check lvs list before access ([pr#34481](https://github.com/ceph/ceph/pull/34481), Jan Fajerski)
    
- ceph-volume/batch: return success when all devices are filtered ([pr#34478](https://github.com/ceph/ceph/pull/34478), Jan Fajerski)
    
- ceph-volume: add and delete lvm tags in a single lvchange call ([pr#35453](https://github.com/ceph/ceph/pull/35453), Jan Fajerski)
    
- ceph-volume: add ceph.osdspec\_affinity tag ([pr#35132](https://github.com/ceph/ceph/pull/35132), Joshua Schmid)
    
- ceph-volume: devices/simple/scan: Fix string in log statement ([pr#34445](https://github.com/ceph/ceph/pull/34445), Jan Fajerski)
    
- ceph-volume: fix nautilus functional tests ([pr#33391](https://github.com/ceph/ceph/pull/33391), Jan Fajerski)
    
- ceph-volume: lvm: get\_device\_vgs() filter by provided prefix ([pr#33616](https://github.com/ceph/ceph/pull/33616), Jan Fajerski, Yehuda Sadeh)
    
- ceph-volume: prepare: use \*-slots arguments for implicit sizing ([pr#34278](https://github.com/ceph/ceph/pull/34278), Jan Fajerski)
    
- ceph-volume: silence ‘ceph-bluestore-tool’ failures ([pr#33428](https://github.com/ceph/ceph/pull/33428), Sébastien Han)
    
- ceph-volume: strip \_dmcrypt suffix in simple scan json output ([pr#33722](https://github.com/ceph/ceph/pull/33722), Jan Fajerski)
    
- cephfs/tools: add accounted\_rstat/rstat when building file dentry ([pr#35185](https://github.com/ceph/ceph/pull/35185), Xiubo Li)
    
- cephfs/tools: cephfs-journal-tool: correctly parse –dry\_run argument ([pr#34784](https://github.com/ceph/ceph/pull/34784), Milind Changire)
    
- cephfs: allow pool names with hyphen and period ([pr#35391](https://github.com/ceph/ceph/pull/35391), Rishabh Dave, Ramana Raja)
    
- cephfs: ceph-fuse: link to libfuse3 and pass “-o big\_writes” to libfuse if libfuse < 3.0.0 ([pr#34771](https://github.com/ceph/ceph/pull/34771), Kefu Chai, Xiubo Li, “Yan, Zheng”)
    
- cephfs: client: expose Client::ll\_register\_callback via libcephfs ([pr#35393](https://github.com/ceph/ceph/pull/35393), Kefu Chai, Jeff Layton)
    
- cephfs: client: fix Finisher assert failure ([pr#35000](https://github.com/ceph/ceph/pull/35000), Xiubo Li)
    
- cephfs: client: fix bad error handling in lseek SEEK\_HOLE / SEEK\_DATA ([pr#34308](https://github.com/ceph/ceph/pull/34308), Jeff Layton)
    
- cephfs: client: only set MClientCaps::FLAG\_SYNC when flushing dirty auth caps ([pr#35118](https://github.com/ceph/ceph/pull/35118), Jeff Layton)
    
- cephfs: client: reset requested\_max\_size if file write is not wanted ([pr#34767](https://github.com/ceph/ceph/pull/34767), “Yan, Zheng”)
    
- cephfs: mds: Handle blacklisted error in purge queue ([pr#35149](https://github.com/ceph/ceph/pull/35149), Varsha Rao)
    
- cephfs: mds: SIGSEGV in Migrator::export\_sessions\_flushed ([pr#33751](https://github.com/ceph/ceph/pull/33751), “Yan, Zheng”)
    
- cephfs: mds: Using begin() and empty() to iterate the xlist ([pr#34338](https://github.com/ceph/ceph/pull/34338), Shen Hang, “Yan, Zheng”)
    
- cephfs: mds: add configurable snapshot limit ([pr#33295](https://github.com/ceph/ceph/pull/33295), Milind Changire)
    
- cephfs: mds: display scrub status in ceph status ([issue#41508](http://tracker.ceph.com/issues/41508), [issue#42713](http://tracker.ceph.com/issues/42713), [issue#44520](http://tracker.ceph.com/issues/44520), [issue#42168](http://tracker.ceph.com/issues/42168), [issue#42169](http://tracker.ceph.com/issues/42169), [issue#42569](http://tracker.ceph.com/issues/42569), [issue#41424](http://tracker.ceph.com/issues/41424), [issue#42835](http://tracker.ceph.com/issues/42835), [issue#36370](http://tracker.ceph.com/issues/36370), [issue#42325](http://tracker.ceph.com/issues/42325), [pr#30704](https://github.com/ceph/ceph/pull/30704), Venky Shankar, Patrick Donnelly, Sage Weil, Kefu Chai)
    
- cephfs: mds: don’t shallow copy when decoding xattr map ([pr#35199](https://github.com/ceph/ceph/pull/35199), “Yan, Zheng”)
    
- cephfs: mds: handle bad purge queue item encoding ([pr#34307](https://github.com/ceph/ceph/pull/34307), “Yan, Zheng”)
    
- cephfs: mds: handle ceph\_assert on blacklisting ([pr#34435](https://github.com/ceph/ceph/pull/34435), Milind Changire)
    
- cephfs: mds: just delete MDSIOContextBase during shutdown ([pr#34343](https://github.com/ceph/ceph/pull/34343), “Yan, Zheng”, Patrick Donnelly)
    
- cephfs: mds: take xlock in the order requests start locking ([pr#35392](https://github.com/ceph/ceph/pull/35392), “Yan, Zheng”)
    
- common/bl: fix memory corruption in bufferlist::claim\_append() ([pr#34516](https://github.com/ceph/ceph/pull/34516), Radoslaw Zarzynski)
    
- common/blkdev: compilation of telemetry and device backports ([pr#33726](https://github.com/ceph/ceph/pull/33726), Sage Weil, Difan Zhang, Patrick Seidensal, Kefu Chai)
    
- common/blkdev: fix some problems with smart scraping ([pr#33421](https://github.com/ceph/ceph/pull/33421), Sage Weil)
    
- common/ceph\_time: tolerate mono time going backwards ([pr#34542](https://github.com/ceph/ceph/pull/34542), Sage Weil)
    
- common/options: Disable bluefs\_buffered\_io by default again ([pr#34297](https://github.com/ceph/ceph/pull/34297), Mark Nelson)
    
- compressor/lz4: work around bug in liblz4 versions <1.8.2 ([pr#35004](https://github.com/ceph/ceph/pull/35004), Sage Weil, Dan van der Ster)
    
- core: bluestore/bdev: initialize size when creating object ([pr#34832](https://github.com/ceph/ceph/pull/34832), Willem Jan Withagen)
    
- core: bluestore: Don’t pollute old journal when add new device ([pr#34796](https://github.com/ceph/ceph/pull/34796), Yang Honggang)
    
- core: bluestore: fix ‘unused’ calculation ([pr#34794](https://github.com/ceph/ceph/pull/34794), xie xingguo, Igor Fedotov)
    
- core: bluestore: fix extent leak after main device expand ([pr#34711](https://github.com/ceph/ceph/pull/34711), Igor Fedotov)
    
- core: bluestore: more flexible DB volume space usage ([pr#33889](https://github.com/ceph/ceph/pull/33889), Igor Fedotov)
    
- core: bluestore: open DB in read-only when expanding DB/WAL ([pr#34611](https://github.com/ceph/ceph/pull/34611), Igor Fedotov, Jianpeng Ma, Adam Kupczyk)
    
- core: bluestore: prevent BlueFS::dirty\_files from being leaked when syncing metadata ([pr#34515](https://github.com/ceph/ceph/pull/34515), Xuehan Xu)
    
- core: msg/async/rdma: fix bug event center is blocked by rdma construct connection for transport ib sync msg ([pr#34780](https://github.com/ceph/ceph/pull/34780), Peng Liu)
    
- core: msgr: backport the EventCenter-related fixes ([pr#33820](https://github.com/ceph/ceph/pull/33820), Radoslaw Zarzynski, Jeff Layton, Kefu Chai)
    
- core: rados: prevent ShardedOpWQ suicide\_grace drop when waiting for work ([pr#34882](https://github.com/ceph/ceph/pull/34882), Dan Hill)
    
- doc/mgr/telemetry: added device channel details ([pr#33684](https://github.com/ceph/ceph/pull/33684), Yaarit Hatuka)
    
- doc/releases/nautilus: restart OSDs to make them bind to v2 addr ([pr#34524](https://github.com/ceph/ceph/pull/34524), Nathan Cutler)
    
- doc: fix parameter to set pg autoscale mode ([pr#34518](https://github.com/ceph/ceph/pull/34518), Changcheng Liu)
    
- doc: mds-config-ref: update ‘mds\_log\_max\_segments’ value ([pr#35278](https://github.com/ceph/ceph/pull/35278), Konstantin Shalygin)
    
- doc: reset PendingReleaseNotes following 14.2.8 release ([pr#33863](https://github.com/ceph/ceph/pull/33863), Nathan Cutler)
    
- global: ensure CEPH\_ARGS is decoded before early arg processing ([pr#33261](https://github.com/ceph/ceph/pull/33261), Kefu Chai, Jason Dillaman)
    
- mgr/DaemonServer: fix pg merge checks ([pr#34354](https://github.com/ceph/ceph/pull/34354), Sage Weil)
    
- mgr/PyModule: fix missing tracebacks in handle\_pyerror() ([pr#34627](https://github.com/ceph/ceph/pull/34627), Tim Serong)
    
- mgr/balancer: tolerate pgs outside of target weight map ([pr#34761](https://github.com/ceph/ceph/pull/34761), Sage Weil)
    
- mgr/dashboard/grafana: Add rbd-image details dashboard ([pr#35248](https://github.com/ceph/ceph/pull/35248), Enno Gotthold)
    
- mgr/dashboard: ‘destroyed’ view in CRUSH map viewer ([pr#33764](https://github.com/ceph/ceph/pull/33764), Avan Thakkar)
    
- mgr/dashboard: Add more debug information to Dashboard RGW backend ([pr#34399](https://github.com/ceph/ceph/pull/34399), Volker Theile)
    
- mgr/dashboard: Dashboard does not allow you to set norebalance OSD flag ([pr#33927](https://github.com/ceph/ceph/pull/33927), Nizamudeen)
    
- mgr/dashboard: Disable cache for static files ([pr#33763](https://github.com/ceph/ceph/pull/33763), Tiago Melo)
    
- mgr/dashboard: Display the aggregated number of request ([pr#35212](https://github.com/ceph/ceph/pull/35212), Tiago Melo)
    
- mgr/dashboard: Fix HomeTest setup ([pr#35086](https://github.com/ceph/ceph/pull/35086), Tiago Melo)
    
- mgr/dashboard: Fix cherrypy request logging error ([pr#31586](https://github.com/ceph/ceph/pull/31586), Kiefer Chang)
    
- mgr/dashboard: Fix error in unit test caused by timezone ([pr#34473](https://github.com/ceph/ceph/pull/34473), Tiago Melo)
    
- mgr/dashboard: Fix error when listing RBD while deleting or moving ([pr#34120](https://github.com/ceph/ceph/pull/34120), Tiago Melo)
    
- mgr/dashboard: Fix iSCSI’s username and password validation ([pr#34550](https://github.com/ceph/ceph/pull/34550), Tiago Melo)
    
- mgr/dashboard: Fixes rbd image ‘purge trash’ button & modal text ([pr#33697](https://github.com/ceph/ceph/pull/33697), anurag)
    
- mgr/dashboard: Improve workaround to redraw datatables ([pr#34413](https://github.com/ceph/ceph/pull/34413), Volker Theile)
    
- mgr/dashboard: Not able to restrict bucket creation for new user ([pr#34692](https://github.com/ceph/ceph/pull/34692), Volker Theile)
    
- mgr/dashboard: Pool read/write OPS shows too many decimal places ([pr#34039](https://github.com/ceph/ceph/pull/34039), anurag, Ernesto Puerta)
    
- mgr/dashboard: Prevent iSCSI target recreation when editing controls ([pr#34551](https://github.com/ceph/ceph/pull/34551), Tiago Melo)
    
- mgr/dashboard: REST API: OpenAPI docs require internet connection ([pr#33032](https://github.com/ceph/ceph/pull/33032), Patrick Seidensal)
    
- mgr/dashboard: RGW port autodetection does not support “Beast” RGW frontend ([pr#34400](https://github.com/ceph/ceph/pull/34400), Volker Theile)
    
- mgr/dashboard: Refactor Python unittests and controller ([pr#34662](https://github.com/ceph/ceph/pull/34662), Volker Theile)
    
- mgr/dashboard: Repair broken grafana panels ([pr#34417](https://github.com/ceph/ceph/pull/34417), Kristoffer Grönlund)
    
- mgr/dashboard: Searchable objects for table ([pr#32891](https://github.com/ceph/ceph/pull/32891), Stephan Müller)
    
- mgr/dashboard: Tabs does not handle click events ([issue#39326](http://tracker.ceph.com/issues/39326), [pr#34282](https://github.com/ceph/ceph/pull/34282), Tiago Melo)
    
- mgr/dashboard: UI fixes ([pr#34038](https://github.com/ceph/ceph/pull/34038), Avan Thakkar)
    
- mgr/dashboard: Updated existing E2E tests to match new format ([pr#33024](https://github.com/ceph/ceph/pull/33024), Nathan Weinberg)
    
- mgr/dashboard: Use booleanText pipe ([pr#33234](https://github.com/ceph/ceph/pull/33234), Alfonso Martínez, Volker Theile)
    
- mgr/dashboard: Use default language when running “npm run build” ([pr#33668](https://github.com/ceph/ceph/pull/33668), Tiago Melo)
    
- mgr/dashboard: do not show RGW API keys if only read-only privileges ([pr#33665](https://github.com/ceph/ceph/pull/33665), Alfonso Martínez)
    
- mgr/dashboard: fix COVERAGE\_PATH in run-backend-api-tests.sh ([pr#34489](https://github.com/ceph/ceph/pull/34489), Alfonso Martínez)
    
- mgr/dashboard: fix backport #33764 ([pr#34640](https://github.com/ceph/ceph/pull/34640), Ernesto Puerta)
    
- mgr/dashboard: fix error when enabling SSO with cert. file ([pr#34129](https://github.com/ceph/ceph/pull/34129), Alfonso Martínez)
    
- mgr/dashboard: fix py2 strptime ImportError (not thread safe) ([pr#35016](https://github.com/ceph/ceph/pull/35016), Alfonso Martínez)
    
- mgr/dashboard: fixing RBD purge error in backend ([pr#34847](https://github.com/ceph/ceph/pull/34847), Kiefer Chang)
    
- mgr/dashboard: install teuthology using pip ([pr#35174](https://github.com/ceph/ceph/pull/35174), Nathan Cutler, Kefu Chai)
    
- mgr/dashboard: list configured prometheus alerts ([pr#34373](https://github.com/ceph/ceph/pull/34373), Patrick Seidensal, Tiago Melo)
    
- mgr/dashboard: monitoring menu entry should indicate firing alerts ([pr#34823](https://github.com/ceph/ceph/pull/34823), Tiago Melo, Volker Theile)
    
- mgr/dashboard: remove ‘config-opt: read’ perm. from system roles ([pr#33739](https://github.com/ceph/ceph/pull/33739), Alfonso Martínez)
    
- mgr/dashboard: show checkboxes for booleans ([pr#33388](https://github.com/ceph/ceph/pull/33388), Tatjana Dehler)
    
- mgr/dashboard: use FQDN for failover redirection ([pr#34497](https://github.com/ceph/ceph/pull/34497), Ernesto Puerta)
    
- mgr/insights: fix prune-health-history ([pr#35214](https://github.com/ceph/ceph/pull/35214), Sage Weil)
    
- mgr/pg\_autoscaler: fix division by zero ([pr#33420](https://github.com/ceph/ceph/pull/33420), Sage Weil)
    
- mgr/pg\_autoscaler: treat target ratios as weights ([pr#34087](https://github.com/ceph/ceph/pull/34087), Josh Durgin)
    
- mgr/prometheus: ceph\_pg\_\* metrics contains last value instead of sum across all reported states ([pr#34162](https://github.com/ceph/ceph/pull/34162), Jacek Suchenia)
    
- mgr/run-tox-tests: Fix issue with PYTHONPATH ([pr#33688](https://github.com/ceph/ceph/pull/33688), Brad Hubbard)
    
- mgr/telegraf: catch FileNotFoundError exception ([pr#34628](https://github.com/ceph/ceph/pull/34628), Kefu Chai)
    
- mgr/telemetry: add ‘last\_upload’ to status ([pr#33409](https://github.com/ceph/ceph/pull/33409), Yaarit Hatuka)
    
- mgr/telemetry: catch exception during requests.put ([pr#33141](https://github.com/ceph/ceph/pull/33141), Sage Weil)
    
- mgr/telemetry: fix UUID and STR concat ([pr#33666](https://github.com/ceph/ceph/pull/33666), Yaarit Hatuka)
    
- mgr/telemetry: fix and document proxy usage ([pr#33649](https://github.com/ceph/ceph/pull/33649), Lars Marowsky-Bree)
    
- mgr/volumes: Add interface to get subvolume metadata ([pr#34679](https://github.com/ceph/ceph/pull/34679), Kotresh HR)
    
- mgr/volumes: fs subvolume clone cancel ([issue#44208](http://tracker.ceph.com/issues/44208), [pr#34036](https://github.com/ceph/ceph/pull/34036), Venky Shankar, Michael Fritch)
    
- mgr/volumes: minor fixes ([pr#35482](https://github.com/ceph/ceph/pull/35482), Kotresh HR)
    
- mgr/volumes: synchronize ownership (for symlinks) and inode timestamps for cloned subvolumes ([issue#24880](http://tracker.ceph.com/issues/24880), [issue#43965](http://tracker.ceph.com/issues/43965), [pr#33877](https://github.com/ceph/ceph/pull/33877), Ramana Raja, Rishabh Dave, huanwen ren, Venky Shankar, Jos Collin)
    
- mgr: Add get\_rates\_from\_data to mgr\_util.py ([pr#33893](https://github.com/ceph/ceph/pull/33893), Stephan Müller, Ernesto Puerta)
    
- mgr: Improve internal python to c++ interface ([pr#34356](https://github.com/ceph/ceph/pull/34356), David Zafman)
    
- mgr: close restful socket after exec ([pr#35213](https://github.com/ceph/ceph/pull/35213), liushi)
    
- mgr: force purge normal ceph entities from service map ([issue#44677](http://tracker.ceph.com/issues/44677), [pr#34563](https://github.com/ceph/ceph/pull/34563), Venky Shankar)
    
- mgr: synchronize ClusterState’s health and mon\_status ([pr#34326](https://github.com/ceph/ceph/pull/34326), Radoslaw Zarzynski)
    
- mgr: update “hostname” when we already have the daemon state from that entity ([pr#33834](https://github.com/ceph/ceph/pull/33834), Kefu Chai)
    
- mon/FSCommands: Fix ‘add\_data\_pool’ command and ‘fs new’ command ([pr#34774](https://github.com/ceph/ceph/pull/34774), Ramana Raja)
    
- mon/OSDMonitor: Always tune priority cache manager memory on all mons ([pr#34916](https://github.com/ceph/ceph/pull/34916), Sridhar Seshasayee)
    
- mon/OSDMonitor: allow trimming maps even if osds are down ([pr#34983](https://github.com/ceph/ceph/pull/34983), Joao Eduardo Luis)
    
- mon/PGMap: fix summary display of >32bit pg states ([pr#33275](https://github.com/ceph/ceph/pull/33275), Sage Weil, Adam C. Emerson)
    
- mon: Get session\_map\_lock before remove\_session ([pr#34677](https://github.com/ceph/ceph/pull/34677), Xiaofei Cui)
    
- mon: calculate min\_size on osd pool set size ([pr#34585](https://github.com/ceph/ceph/pull/34585), Deepika Upadhyay)
    
- mon: disable min pg per osd warning ([pr#34618](https://github.com/ceph/ceph/pull/34618), Sage Weil)
    
- mon: fix/improve mon sync over small keys ([pr#33765](https://github.com/ceph/ceph/pull/33765), Sage Weil)
    
- mon: stash newer map on bootstrap when addr doesn’t match ([pr#34500](https://github.com/ceph/ceph/pull/34500), Sage Weil)
    
- monitoring: Fix “10% OSDs down” alert description ([pr#35211](https://github.com/ceph/ceph/pull/35211), Benoît Knecht)
    
- monitoring: Fix pool capacity incorrect ([pr#34450](https://github.com/ceph/ceph/pull/34450), James Cheng)
    
- monitoring: alert for pool fill up broken ([pr#35137](https://github.com/ceph/ceph/pull/35137), Volker Theile)
    
- monitoring: alert for prediction of disk and pool fill up broken ([pr#34394](https://github.com/ceph/ceph/pull/34394), Patrick Seidensal)
    
- monitoring: fix RGW grafana chart ‘Average GET/PUT Latencies’ ([pr#33860](https://github.com/ceph/ceph/pull/33860), Alfonso Martínez)
    
- monitoring: fix decimal precision in Grafana %percentages ([pr#34829](https://github.com/ceph/ceph/pull/34829), Ernesto Puerta)
    
- monitoring: root volume full alert fires false positives ([pr#34419](https://github.com/ceph/ceph/pull/34419), Patrick Seidensal)
    
- osd/OSD: Log slow ops/types to cluster logs ([pr#33503](https://github.com/ceph/ceph/pull/33503), Sage Weil, Sridhar Seshasayee)
    
- osd/OSDMap: Show health warning if a pool is configured with size 1 ([pr#31842](https://github.com/ceph/ceph/pull/31842), Sridhar Seshasayee)
    
- osd/PeeringState.h: ignore RemoteBackfillReserved in WaitLocalBackfillReserved ([pr#34512](https://github.com/ceph/ceph/pull/34512), Neha Ojha)
    
- osd/PeeringState: do not trim pg log past last\_update\_ondisk ([pr#34957](https://github.com/ceph/ceph/pull/34957), Samuel Just, xie xingguo)
    
- osd/PeeringState: transit async\_recovery\_targets back into acting before backfilling ([pr#32849](https://github.com/ceph/ceph/pull/32849), xie xingguo)
    
- osd: dispatch\_context and queue split finish on early bail-out ([pr#35024](https://github.com/ceph/ceph/pull/35024), Sage Weil)
    
- osd: fix racy accesses to OSD::osdmap ([pr#33530](https://github.com/ceph/ceph/pull/33530), Radoslaw Zarzynski)
    
- pybind/mgr/\*: fix config\_notify handling of default values ([pr#34116](https://github.com/ceph/ceph/pull/34116), Nathan Cutler, Sage Weil)
    
- pybind/mgr: use six==1.14.0 ([pr#34316](https://github.com/ceph/ceph/pull/34316), Kefu Chai)
    
- pybind/rbd: RBD.create() method’s ‘old\_format’ parameter now defaults to False ([pr#35183](https://github.com/ceph/ceph/pull/35183), Jason Dillaman)
    
- pybind/rbd: ensure image is open before permitting operations ([pr#34424](https://github.com/ceph/ceph/pull/34424), Mykola Golub)
    
- pybind/rbd: fix no lockers are obtained, ImageNotFound exception will be output ([pr#34388](https://github.com/ceph/ceph/pull/34388), zhangdaolong)
    
- rbd: librbd: copy API should not inherit v1 image format by default ([pr#35182](https://github.com/ceph/ceph/pull/35182), Jason Dillaman)
    
- rbd: rbd-mirror: improve detection of blacklisted state ([pr#33533](https://github.com/ceph/ceph/pull/33533), Mykola Golub)
    
- rgw/kafka: add kafka endpoint support ([pr#32960](https://github.com/ceph/ceph/pull/32960), Yuval Lifshitz, Willem Jan Withagen, Kefu Chai)
    
- rgw/notifications: backporting features and bug fix ([pr#34107](https://github.com/ceph/ceph/pull/34107), Yuval Lifshitz)
    
- rgw/notifications: fix topic action fail with “MethodNotAllowed” ([issue#44614](http://tracker.ceph.com/issues/44614), [pr#33978](https://github.com/ceph/ceph/pull/33978), Yuval Lifshitz)
    
- rgw/notifications: version id was not sent in versioned buckets ([pr#35181](https://github.com/ceph/ceph/pull/35181), Yuval Lifshitz)
    
- rgw: when you abort a multipart upload request, the quota may be not updated ([pr#33268](https://github.com/ceph/ceph/pull/33268), Richard Bai(白学余))
    
- rgw: Add support bucket policy for subuser ([pr#33714](https://github.com/ceph/ceph/pull/33714), Seena Fallah)
    
- rgw: Fix dynamic resharding not working for empty zonegroup in period ([pr#33266](https://github.com/ceph/ceph/pull/33266), Or Friedmann)
    
- rgw: Fix upload part copy range able to get almost any string ([pr#33265](https://github.com/ceph/ceph/pull/33265), Or Friedmann)
    
- rgw: GET/HEAD and PUT operations on buckets w/lifecycle expiration configured do not return x-amz-expiration header ([pr#32924](https://github.com/ceph/ceph/pull/32924), Matt Benjamin, Yuval Lifshitz)
    
- rgw: MultipartObjectProcessor supports stripe size > chunk size ([pr#33271](https://github.com/ceph/ceph/pull/33271), Casey Bodley)
    
- rgw: ReplaceKeyPrefixWith and ReplaceKeyWith can not set at the same … ([pr#34599](https://github.com/ceph/ceph/pull/34599), yuliyang)
    
- rgw: anonomous swift to obj that dont exist should 401 ([pr#35045](https://github.com/ceph/ceph/pull/35045), Matthew Oliver)
    
- rgw: clear ent\_list for each loop of bucket list ([issue#44394](http://tracker.ceph.com/issues/44394), [pr#34099](https://github.com/ceph/ceph/pull/34099), Yao Zongyou)
    
- rgw: dmclock: wait until the request is handled ([pr#34954](https://github.com/ceph/ceph/pull/34954), GaryHyg)
    
- rgw: find oldest period and update RGWMetadataLogHistory() ([pr#34597](https://github.com/ceph/ceph/pull/34597), Shilpa Jagannath)
    
- rgw: fix SignatureDoesNotMatch when use ipv6 address in s3 client ([pr#33267](https://github.com/ceph/ceph/pull/33267), yuliyang)
    
- rgw: fix bug with (un)ordered bucket listing and marker w/ namespace ([pr#34609](https://github.com/ceph/ceph/pull/34609), J. Eric Ivancich)
    
- rgw: fix lc does not delete objects that do not have exactly the same tags as the rule ([pr#35002](https://github.com/ceph/ceph/pull/35002), Or Friedmann)
    
- rgw: fix multipart upload’s error response ([pr#35019](https://github.com/ceph/ceph/pull/35019), GaryHyg)
    
- rgw: fix rgw crash when duration is invalid in sts request ([pr#33273](https://github.com/ceph/ceph/pull/33273), yuliyang)
    
- rgw: fix some list buckets handle leak ([pr#34986](https://github.com/ceph/ceph/pull/34986), Tianshan Qu)
    
- rgw: get barbican secret key request maybe return error code ([pr#33965](https://github.com/ceph/ceph/pull/33965), Richard Bai(白学余))
    
- rgw: increase log level for same or older period pull msg ([pr#34833](https://github.com/ceph/ceph/pull/34833), Ali Maredia)
    
- rgw: make max\_connections configurable in beast ([pr#33340](https://github.com/ceph/ceph/pull/33340), Tiago Pasqualini)
    
- rgw: making implicit\_tenants backwards compatible ([issue#24348](http://tracker.ceph.com/issues/24348), [pr#33749](https://github.com/ceph/ceph/pull/33749), Marcus Watts)
    
- rgw: multisite: enforce spawn window for incremental data sync ([pr#33270](https://github.com/ceph/ceph/pull/33270), Casey Bodley)
    
- rgw: radosgw-admin: add support for –bucket-id in bucket stats command ([pr#34815](https://github.com/ceph/ceph/pull/34815), Vikhyat Umrao)
    
- rgw: radosgw-admin: fix infinite loops in ‘datalog list’ ([pr#35001](https://github.com/ceph/ceph/pull/35001), Casey Bodley)
    
- rgw: reshard: skip stale bucket id entries from reshard queue ([pr#34735](https://github.com/ceph/ceph/pull/34735), Abhishek Lekshmanan)
    
- rgw: set bucket attr twice when delete lifecycle config ([pr#34598](https://github.com/ceph/ceph/pull/34598), zhang Shaowen)
    
- rgw: set correct storage class for append ([pr#34064](https://github.com/ceph/ceph/pull/34064), yuliyang)
    
- rgw: sts: add all http args to req\_info ([pr#33355](https://github.com/ceph/ceph/pull/33355), yuliyang)
    
- rgw: tune sharded bucket listing ([pr#33675](https://github.com/ceph/ceph/pull/33675), J. Eric Ivancich)
    
- tests: migrate qa/ to python3 ([pr#34171](https://github.com/ceph/ceph/pull/34171), Kefu Chai, Sage Weil, Casey Bodley, Rishabh Dave, Patrick Donnelly, Kyr Shatskyy, Michael Fritch, Xiubo Li, Ilya Dryomov, Alfonso Martínez, Thomas Bechtold)
    
- tools/cli: bash\_completion: Do not auto complete obsolete and hidden cmds ([pr#35117](https://github.com/ceph/ceph/pull/35117), Kotresh HR)
    
- tools/cli: ceph\_argparse: increment matchcnt on kwargs ([pr#33160](https://github.com/ceph/ceph/pull/33160), Matthew Oliver, Shyukri Shyukriev)
    
- tools/rados: Unmask ‘-o’ to restore original behaviour ([pr#33641](https://github.com/ceph/ceph/pull/33641), Brad Hubbard)
