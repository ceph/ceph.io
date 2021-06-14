---
title: "v15.2.4 Octopus released"
date: "2020-06-30"
author: "TheAnalyst"
---

This is the fourth release of the Ceph Octopus stable release series. In addition to a security fix in RGW, this release brings a range of fixes across all components. We recommend that all Octopus users upgrade to this release.

## Notable Changes[¶](#notable-changes "Permalink to this headline")

- CVE-2020-10753: rgw: sanitize newlines in s3 CORSConfiguration’s ExposeHeader (William Bowling, Adam Mohammed, Casey Bodley)
    
- Cephadm: There were a lot of small usability improvements and bug fixes:
    
    - Grafana when deployed by Cephadm now binds to all network interfaces.
        
    - `cephadm check-host` now prints all detected problems at once.
        
    - Cephadm now calls `ceph dashboard set-grafana-api-ssl-verify false` when generating an SSL certificate for Grafana.
        
    - The Alertmanager is now correctly pointed to the Ceph Dashboard
        
    - `cephadm adopt` now supports adopting an Alertmanager
        
    - `ceph orch ps` now supports filtering by service name
        
    - `ceph orch host ls` now marks hosts as offline, if they are not accessible.
        
- Cephadm can now deploy NFS Ganesha services. For example, to deploy NFS with a service id of mynfs, that will use the RADOS pool nfs-ganesha and namespace nfs-ns:
    
    ceph orch apply nfs mynfs nfs\-ganesha nfs\-ns
    
- Cephadm: `ceph orch ls --export` now returns all service specifications in yaml representation that is consumable by `ceph orch apply`. In addition, the commands `orch ps` and `orch ls` now support `--format yaml` and `--format json-pretty`.
    
- Cephadm: `ceph orch apply osd` supports a `--preview` flag that prints a preview of the OSD specification before deploying OSDs. This makes it possible to verify that the specification is correct, before applying it.
    
- RGW: The `radosgw-admin` sub-commands dealing with orphans – `radosgw-admin orphans find`, `radosgw-admin orphans finish`, and `radosgw-admin orphans list-jobs` – have been deprecated. They have not been actively maintained and they store intermediate results on the cluster, which could fill a nearly-full cluster. They have been replaced by a tool, currently considered experimental, `rgw-orphan-list`.
    
- RBD: The name of the rbd pool object that is used to store rbd trash purge schedule is changed from “rbd\_trash\_trash\_purge\_schedule” to “rbd\_trash\_purge\_schedule”. Users that have already started using `rbd trash purge schedule` functionality and have per pool or namespace schedules configured should copy “rbd\_trash\_trash\_purge\_schedule” object to “rbd\_trash\_purge\_schedule” before the upgrade and remove “rbd\_trash\_purge\_schedule” using the following commands in every RBD pool and namespace where a trash purge schedule was previously configured:
    
    rados \-p <pool\-name\> \[\-N namespace\] cp rbd\_trash\_trash\_purge\_schedule rbd\_trash\_purge\_schedule
    rados \-p <pool\-name\> \[\-N namespace\] rm rbd\_trash\_trash\_purge\_schedule
    
    or use any other convenient way to restore the schedule after the upgrade.
    

## Changelog[¶](#changelog "Permalink to this headline")

- build/ops: address SElinux denials observed in rgw/multisite test run ([pr#34538](https://github.com/ceph/ceph/pull/34538), Kefu Chai, Kaleb S. Keithley)
    
- ceph-volume: add and delete lvm tags in a single lvchange call ([pr#35452](https://github.com/ceph/ceph/pull/35452), Jan Fajerski)
    
- ceph-volume: add ceph.osdspec\_affinity tag ([pr#35134](https://github.com/ceph/ceph/pull/35134), Joshua Schmid)
    
- cephadm: batch backport May (1) ([pr#34893](https://github.com/ceph/ceph/pull/34893), Michael Fritch, Ricardo Marques, Matthew Oliver, Sebastian Wagner, Joshua Schmid, Zac Dover, Varsha Rao)
    
- cephadm: batch backport May (2) ([pr#35188](https://github.com/ceph/ceph/pull/35188), Michael Fritch, Sebastian Wagner, Kefu Chai, Georgios Kyratsas, Kiefer Chang, Joshua Schmid, Patrick Seidensal, Varsha Rao, Matthew Oliver, Zac Dover, Juan Miguel Olmo Martínez, Tim Serong, Alexey Miasoedov, Ricardo Marques, Satoru Takeuchi)
    
- cephadm: batch backport June (1) ([pr#35347](https://github.com/ceph/ceph/pull/35347), Sebastian Wagner, Zac Dover, Georgios Kyratsas, Kiefer Chang, Ricardo Marques, Patrick Seidensal, Patrick Donnelly, Joshua Schmid, Matthew Oliver, Varsha Rao, Juan Miguel Olmo Martínez, Michael Fritch)
    
- cephadm: batch backport June (2) ([pr#35475](https://github.com/ceph/ceph/pull/35475), Sebastian Wagner, Kiefer Chang, Joshua Schmid, Michael Fritch, shinhwagk, Kefu Chai, Juan Miguel Olmo Martínez, Daniel Pivonka)
    
- cephfs: allow pool names with hyphen and period ([pr#35251](https://github.com/ceph/ceph/pull/35251), Ramana Raja)
    
- cephfs: bash\_completion: Do not auto complete obsolete and hidden cmds ([pr#34996](https://github.com/ceph/ceph/pull/34996), Kotresh HR)
    
- cephfs: cephfs-shell: Change tox testenv name to py3 ([pr#34998](https://github.com/ceph/ceph/pull/34998), Kefu Chai, Varsha Rao, Aditya Srivastava)
    
- cephfs: client: expose Client::ll\_register\_callback via libcephfs ([pr#35150](https://github.com/ceph/ceph/pull/35150), Jeff Layton)
    
- cephfs: client: fix Finisher assert failure ([pr#34999](https://github.com/ceph/ceph/pull/34999), Xiubo Li)
    
- cephfs: client: only set MClientCaps::FLAG\_SYNC when flushing dirty auth caps ([pr#34997](https://github.com/ceph/ceph/pull/34997), Jeff Layton)
    
- cephfs: fuse: add the ‘-d’ option back for libfuse ([pr#35449](https://github.com/ceph/ceph/pull/35449), Xiubo Li)
    
- cephfs: mds: Handle blacklisted error in purge queue ([pr#35148](https://github.com/ceph/ceph/pull/35148), Varsha Rao)
    
- cephfs: mds: preserve ESlaveUpdate logevent until receiving OP\_FINISH ([pr#35253](https://github.com/ceph/ceph/pull/35253), songxinying)
    
- cephfs: mds: take xlock in the order requests start locking ([pr#35252](https://github.com/ceph/ceph/pull/35252), “Yan, Zheng”)
    
- cephfs: src/client/fuse\_ll: compatible with libfuse3.5 or higher ([pr#35450](https://github.com/ceph/ceph/pull/35450), Jeff Layton, Xiubo Li)
    
- cephfs: vstart\_runner: set mounted to True at the end of mount() ([pr#35447](https://github.com/ceph/ceph/pull/35447), Rishabh Dave)
    
- core: bluestore: fix large (>2GB) writes when bluefs\_buffered\_io = true ([pr#35446](https://github.com/ceph/ceph/pull/35446), Igor Fedotov)
    
- core: bluestore: introduce hybrid allocator ([pr#35498](https://github.com/ceph/ceph/pull/35498), Igor Fedotov, Adam Kupczyk)
    
- core: cls/queue: fix empty markers when listing entries ([pr#35241](https://github.com/ceph/ceph/pull/35241), Pritha Srivastava, Yuval Lifshitz)
    
- core: objecter: don’t attempt to read from non-primary on EC pools ([pr#35444](https://github.com/ceph/ceph/pull/35444), Ilya Dryomov)
    
- core: osd: add –osdspec-affinity flag ([pr#35382](https://github.com/ceph/ceph/pull/35382), Joshua Schmid)
    
- core: osd: make “missing incremental map” a debug log message ([pr#35442](https://github.com/ceph/ceph/pull/35442), Nathan Cutler)
    
- core: osd: prevent ShardedOpWQ suicide\_grace drop when waiting for work ([pr#34881](https://github.com/ceph/ceph/pull/34881), Dan Hill)
    
- core: rocksdb: Update to ceph-octopus-v5.8-1436 ([pr#35036](https://github.com/ceph/ceph/pull/35036), Brad Hubbard)
    
- doc: drop obsolete cache tier options ([pr#35105](https://github.com/ceph/ceph/pull/35105), Nathan Cutler)
    
- doc: mgr/dashboard: Add troubleshooting guide ([pr#34947](https://github.com/ceph/ceph/pull/34947), Tatjana Dehler)
    
- doc: rgw: document ‘rgw gc max concurrent io’ ([pr#34987](https://github.com/ceph/ceph/pull/34987), Casey Bodley)
    
- mds: cleanup uncommitted fragments before mds goes to active ([pr#35448](https://github.com/ceph/ceph/pull/35448), “Yan, Zheng”)
    
- mds: don’t assert empty io context list when shutting down ([pr#34509](https://github.com/ceph/ceph/pull/34509), “Yan, Zheng”)
    
- mds: don’t shallow copy when decoding xattr map ([pr#35147](https://github.com/ceph/ceph/pull/35147), “Yan, Zheng”)
    
- mds: flag backtrace scrub failures for new files as okay ([pr#35555](https://github.com/ceph/ceph/pull/35555), Milind Changire)
    
- mgr/dashboard/grafana: Add rbd-image details dashboard ([pr#35247](https://github.com/ceph/ceph/pull/35247), Enno Gotthold)
    
- mgr/dashboard: Asynchronous unique username validation for User Component ([pr#34849](https://github.com/ceph/ceph/pull/34849), Nizamudeen)
    
- mgr/dashboard: ECP modal enhancement ([pr#35152](https://github.com/ceph/ceph/pull/35152), Stephan Müller)
    
- mgr/dashboard: Fix HomeTest setup ([pr#35085](https://github.com/ceph/ceph/pull/35085), Tiago Melo)
    
- mgr/dashboard: Fix e2e chromium binary validation ([pr#35679](https://github.com/ceph/ceph/pull/35679), Tiago Melo)
    
- mgr/dashboard: Fix random E2E error in mgr-modules ([pr#35706](https://github.com/ceph/ceph/pull/35706), Tiago Melo)
    
- mgr/dashboard: Fix redirect after changing password ([pr#35243](https://github.com/ceph/ceph/pull/35243), Tiago Melo)
    
- mgr/dashboard: Prevent dashboard breakdown on bad pool selection ([pr#35135](https://github.com/ceph/ceph/pull/35135), Stephan Müller)
    
- mgr/dashboard: Proposed About Modal box ([pr#35291](https://github.com/ceph/ceph/pull/35291), Ngwa Sedrick Meh, Tiago Melo)
    
- mgr/dashboard: Reduce requests in Mirroring page ([pr#34992](https://github.com/ceph/ceph/pull/34992), Tiago Melo)
    
- mgr/dashboard: Replace Protractor with Cypress ([pr#34910](https://github.com/ceph/ceph/pull/34910), Tiago Melo)
    
- mgr/dashboard: Show labels in hosts page ([pr#35517](https://github.com/ceph/ceph/pull/35517), Volker Theile)
    
- mgr/dashboard: Show table details inside the datatable ([pr#35270](https://github.com/ceph/ceph/pull/35270), Sebastian Krah)
    
- mgr/dashboard: add telemetry report component ([pr#34850](https://github.com/ceph/ceph/pull/34850), Tatjana Dehler)
    
- mgr/dashboard: displaying Service detail inside table ([pr#35269](https://github.com/ceph/ceph/pull/35269), Kiefer Chang)
    
- mgr/dashboard: fix autocomplete input backgrounds in chrome and firefox ([pr#35718](https://github.com/ceph/ceph/pull/35718), Ishan Rai)
    
- mgr/dashboard: grafana panels for rgw multisite sync performance ([pr#35693](https://github.com/ceph/ceph/pull/35693), Alfonso Martínez)
    
- mgr/dashboard: monitoring menu entry should indicate firing alerts ([pr#34822](https://github.com/ceph/ceph/pull/34822), Tiago Melo, Volker Theile)
    
- mgr/dashboard: redesign the login screen ([pr#35268](https://github.com/ceph/ceph/pull/35268), Ishan Rai)
    
- mgr/dashboard: remove space after service name in the Hosts List table ([pr#35531](https://github.com/ceph/ceph/pull/35531), Kiefer Chang)
    
- mgr/dashboard: replace hard coded telemetry URLs ([pr#35231](https://github.com/ceph/ceph/pull/35231), Tatjana Dehler)
    
- mgr/rbd\_support: rename “rbd\_trash\_trash\_purge\_schedule” oid ([pr#35436](https://github.com/ceph/ceph/pull/35436), Nathan Cutler, Mykola Golub)
    
- mgr/status: Fix “ceph fs status” json format writing to stderr ([pr#34727](https://github.com/ceph/ceph/pull/34727), Kotresh HR)
    
- mgr/test\_orchestrator: fix \_get\_ceph\_daemons() ([pr#34979](https://github.com/ceph/ceph/pull/34979), Alfonso Martínez)
    
- mgr/volumes: Add snapshot info command ([pr#35670](https://github.com/ceph/ceph/pull/35670), Kotresh HR)
    
- mgr/volumes: Create subvolume with isolated rados namespace ([pr#35671](https://github.com/ceph/ceph/pull/35671), Kotresh HR)
    
- mgr/volumes: Fix subvolume create idempotency ([pr#35256](https://github.com/ceph/ceph/pull/35256), Kotresh HR)
    
- mgr: synchronize ClusterState’s health and mon\_status ([pr#34995](https://github.com/ceph/ceph/pull/34995), Radoslaw Zarzynski)
    
- monitoring: Fix “10% OSDs down” alert description ([pr#35151](https://github.com/ceph/ceph/pull/35151), Benoît Knecht)
    
- monitoring: fixing some issues in RBD detail dashboard ([pr#35463](https://github.com/ceph/ceph/pull/35463), Kiefer Chang)
    
- rbd: librbd: Watcher should not attempt to re-watch after detecting blacklisting ([pr#35439](https://github.com/ceph/ceph/pull/35439), Jason Dillaman)
    
- rbd: librbd: avoid completing mirror:DisableRequest while holding its lock ([pr#35126](https://github.com/ceph/ceph/pull/35126), Jason Dillaman)
    
- rbd: librbd: copy API should not inherit v1 image format by default ([pr#35255](https://github.com/ceph/ceph/pull/35255), Jason Dillaman)
    
- rbd: librbd: make rbd\_read\_from\_replica\_policy actually work ([pr#35438](https://github.com/ceph/ceph/pull/35438), Ilya Dryomov)
    
- rbd: pybind: RBD.create() method’s ‘old\_format’ parameter now defaults to False ([pr#35435](https://github.com/ceph/ceph/pull/35435), Jason Dillaman)
    
- rbd: rbd-mirror: don’t hold (stale) copy of local image journal pointer ([pr#35430](https://github.com/ceph/ceph/pull/35430), Jason Dillaman)
    
- rbd: rbd-mirror: stop local journal replayer first during shut down ([pr#35440](https://github.com/ceph/ceph/pull/35440), Jason Dillaman, Mykola Golub)
    
- rbd: rbd-mirror: wait for in-flight start/stop/restart ([pr#35437](https://github.com/ceph/ceph/pull/35437), Mykola Golub)
    
- rgw: add “rgw-orphan-list” tool and “radosgw-admin bucket radoslist …” ([pr#34991](https://github.com/ceph/ceph/pull/34991), J. Eric Ivancich)
    
- rgw: amqp: fix the “routable” delivery mode ([pr#35433](https://github.com/ceph/ceph/pull/35433), Yuval Lifshitz)
    
- rgw: anonomous swift to obj that dont exist should 401 ([pr#35120](https://github.com/ceph/ceph/pull/35120), Matthew Oliver)
    
- rgw: fix bug where bucket listing end marker not always set correctly ([pr#34993](https://github.com/ceph/ceph/pull/34993), J. Eric Ivancich)
    
- rgw: fix rgw tries to fetch anonymous user ([pr#34988](https://github.com/ceph/ceph/pull/34988), Or Friedmann)
    
- rgw: fix some list buckets handle leak ([pr#34985](https://github.com/ceph/ceph/pull/34985), Tianshan Qu)
    
- rgw: gc: Clearing off urgent data in bufferlist, before ([pr#35434](https://github.com/ceph/ceph/pull/35434), Pritha Srivastava)
    
- rgw: lc: enable thread-parallelism in RGWLC ([pr#35431](https://github.com/ceph/ceph/pull/35431), Matt Benjamin)
    
- rgw: notifications: fix zero size in notifications ([pr#34940](https://github.com/ceph/ceph/pull/34940), J. Eric Ivancich, Yuval Lifshitz)
    
- rgw: notifications: version id was not sent in versioned buckets ([pr#35254](https://github.com/ceph/ceph/pull/35254), Yuval Lifshitz)
    
- rgw: radosgw-admin: fix infinite loops in ‘datalog list’ ([pr#34989](https://github.com/ceph/ceph/pull/34989), Casey Bodley)
    
- rgw: url: fix amqp urls with vhosts ([pr#35432](https://github.com/ceph/ceph/pull/35432), Yuval Lifshitz)
    
- tests: migrate qa/ to Python3 ([pr#35364](https://github.com/ceph/ceph/pull/35364), Kyr Shatskyy, Ilya Dryomov, Xiubo Li, Kefu Chai, Casey Bodley, Rishabh Dave, Patrick Donnelly, Sidharth Anupkrishnan, Michael Fritch)
