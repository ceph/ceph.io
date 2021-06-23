---
title: "v15.2.13 Octopus released"
date: "2021-05-26"
author: "dgalloway"
---

This is the 13th backport release in the Octopus series. We recommend all users update to this release.

  
  

## Notable Changes

- RADOS: Ability to dynamically adjust trimming rate in the monitor and several other bug fixes.
    

  
  

## Changelog

- blk/kernel: fix io\_uring got (4) Interrupted system call ([pr#39899](https://github.com/ceph/ceph/pull/39899), Yanhu Cao)
    
- ceph.spec.in: Enable tcmalloc on IBM Power and Z ([pr#39487](https://github.com/ceph/ceph/pull/39487), Nathan Cutler, Yaakov Selkowitz)
    
- \`cephadm ls\` broken for SUSE downstream alertmanager container ([pr#39802](https://github.com/ceph/ceph/pull/39802), Patrick Seidensal)
    
- cephadm: Allow to use paths in all <\_devices> drivegroup sections ([pr#40838](https://github.com/ceph/ceph/pull/40838), Juan Miguel Olmo Martínez)
    
- cephadm: add docker.service dependency in systemd units ([pr#39804](https://github.com/ceph/ceph/pull/39804), Sage Weil)
    
- cephadm: allow redeploy of daemons in error state if container running ([pr#39717](https://github.com/ceph/ceph/pull/39717), Adam King)
    
- cephadm: fix failure when using --apply-spec and --shh-user ([pr#40737](https://github.com/ceph/ceph/pull/40737), Daniel Pivonka)
    
- cephadm: run containers using \`--init\` ([pr#39914](https://github.com/ceph/ceph/pull/39914), Michael Fritch, Sage Weil)
    
- cephfs: client: only check pool permissions for regular files ([pr#40779](https://github.com/ceph/ceph/pull/40779), Xiubo Li)
    
- cephfs: client: wake up the front pos waiter ([pr#40771](https://github.com/ceph/ceph/pull/40771), Xiubo Li)
    
- client: fire the finish\_cap\_snap() after buffer being flushed ([pr#40778](https://github.com/ceph/ceph/pull/40778), Xiubo Li)
    
- cmake: build static libs if they are internal ones ([pr#40789](https://github.com/ceph/ceph/pull/40789), Kefu Chai)
    
- cmake: define BOOST\_ASIO\_USE\_TS\_EXECUTOR\_AS\_DEFAULT globaly ([pr#40784](https://github.com/ceph/ceph/pull/40784), Kefu Chai)
    
- common/buffer: adjust align before calling posix\_memalign() ([pr#41247](https://github.com/ceph/ceph/pull/41247), Ilya Dryomov)
    
- common/ipaddr: Allow binding on lo ([pr#39343](https://github.com/ceph/ceph/pull/39343), Thomas Goirand)
    
- common/ipaddr: skip loopback interfaces named 'lo' and test it ([pr#40424](https://github.com/ceph/ceph/pull/40424), Dan van der Ster)
    
- common/mempool: Improve mempool shard selection ([pr#39978](https://github.com/ceph/ceph/pull/39978), singuliere, Adam Kupczyk)
    
- common/options/global.yaml.in: increase default value of bluestore\_cache\_trim\_max\_skip\_pinned ([pr#40919](https://github.com/ceph/ceph/pull/40919), Neha Ojha)
    
- common/options: bluefs\_buffered\_io=true by default ([pr#40392](https://github.com/ceph/ceph/pull/40392), Dan van der Ster)
    
- common: Fix assertion when disabling and re-enabling clog\_to\_monitors ([pr#39935](https://github.com/ceph/ceph/pull/39935), Gerald Yang)
    
- common: remove log\_early configuration option ([pr#40550](https://github.com/ceph/ceph/pull/40550), Changcheng Liu)
    
- crush/CrushLocation: do not print logging message in constructor ([pr#40791](https://github.com/ceph/ceph/pull/40791), Alex Wu)
    
- crush/CrushWrapper: update shadow trees on update\_item() ([pr#39919](https://github.com/ceph/ceph/pull/39919), Sage Weil)
    
- debian/ceph-common.postinst: do not chown cephadm log dirs ([pr#40275](https://github.com/ceph/ceph/pull/40275), Sage Weil)
    
- doc/cephfs/nfs: Add note about cephadm NFS-Ganesha daemon port ([pr#40777](https://github.com/ceph/ceph/pull/40777), Varsha Rao)
    
- doc/cephfs/nfs: Add rook pod restart note, export and log block example ([pr#40766](https://github.com/ceph/ceph/pull/40766), Varsha Rao)
    
\* refs/pull/40766/head: doc/cephfs/nfs: Add rook pod restart note, export and log block example- doc: snap-schedule documentation ([pr#40775](https://github.com/ceph/ceph/pull/40775), Jan Fajerski)
    
- install-deps.sh: remove existing ceph-libboost of different version ([pr#40286](https://github.com/ceph/ceph/pull/40286), Kefu Chai)
    
- krbd: make sure the device node is accessible after the mapping ([pr#39968](https://github.com/ceph/ceph/pull/39968), Ilya Dryomov)
    
- librbd/api: avoid retrieving more than max mirror image info records ([pr#39964](https://github.com/ceph/ceph/pull/39964), Jason Dillaman)
    
- librbd/io: conditionally disable move optimization ([pr#39958](https://github.com/ceph/ceph/pull/39958), Jason Dillaman)
    
- librbd/io: send alloc\_hint when compression hint is set ([pr#40386](https://github.com/ceph/ceph/pull/40386), Jason Dillaman)
    
- librbd/mirror/snapshot: avoid UnlinkPeerRequest with a unlinked peer ([pr#41302](https://github.com/ceph/ceph/pull/41302), Arthur Outhenin-Chalandre)
    
- librbd: allow interrupted trash move request to be restarted ([pr#40387](https://github.com/ceph/ceph/pull/40387), Jason Dillaman)
    
- librbd: explicitly disable readahead for writearound cache ([pr#39962](https://github.com/ceph/ceph/pull/39962), Jason Dillaman)
    
- librbd: refuse to release exclusive lock when removing ([pr#39966](https://github.com/ceph/ceph/pull/39966), Ilya Dryomov)
    
- mds: fix race of fetching large dirfrag ([pr#40774](https://github.com/ceph/ceph/pull/40774), Erqi Chen)
    
- mds: trim cache regularly for standby-replay ([pr#40743](https://github.com/ceph/ceph/pull/40743), Xiubo Li, Patrick Donnelly)
    
- mds: update defaults for recall configs ([pr#40764](https://github.com/ceph/ceph/pull/40764), Patrick Donnelly)
    
- mgr/PyModule: put mgr\_module\_path before Py\_GetPath() ([pr#40534](https://github.com/ceph/ceph/pull/40534), Kefu Chai)
    
- mgr/cephadm: alias rgw-nfs -> nfs ([pr#40009](https://github.com/ceph/ceph/pull/40009), Michael Fritch)
    
- mgr/cephadm: on ssh connection error, advice chmod 0600 ([pr#40823](https://github.com/ceph/ceph/pull/40823), Sebastian Wagner)
    
- mgr/dashboard: Add badge to the Label column in Host List ([pr#40433](https://github.com/ceph/ceph/pull/40433), Nizamudeen A)
    
- mgr/dashboard: Device health status is not getting listed under hosts section ([pr#40495](https://github.com/ceph/ceph/pull/40495), Aashish Sharma)
    
- mgr/dashboard: Fix for alert notification message being undefined ([pr#40589](https://github.com/ceph/ceph/pull/40589), Nizamudeen A)
    
- mgr/dashboard: Fix for broken User management role cloning ([pr#40399](https://github.com/ceph/ceph/pull/40399), Nizamudeen A)
    
- mgr/dashboard: OSDs placement text is unreadable ([pr#41124](https://github.com/ceph/ceph/pull/41124), Aashish Sharma)
    
- mgr/dashboard: Remove redundant pytest requirement ([pr#40657](https://github.com/ceph/ceph/pull/40657), Kefu Chai)
    
- mgr/dashboard: Remove username and password from request body ([pr#41057](https://github.com/ceph/ceph/pull/41057), Nizamudeen A)
    
- mgr/dashboard: Remove username, password fields from Manager Modules/dashboard,influx ([pr#40491](https://github.com/ceph/ceph/pull/40491), Aashish Sharma)
    
- mgr/dashboard: Revoke read-only user's access to Manager modules ([pr#40649](https://github.com/ceph/ceph/pull/40649), Nizamudeen A)
    
- mgr/dashboard: Splitting tenant$user when creating rgw user ([pr#40297](https://github.com/ceph/ceph/pull/40297), Nizamudeen A)
    
- mgr/dashboard: additional logging to SMART data retrieval ([pr#37972](https://github.com/ceph/ceph/pull/37972), Kiefer Chang, Patrick Seidensal)
    
- mgr/dashboard: allow getting fresh inventory data from the orchestrator ([pr#41387](https://github.com/ceph/ceph/pull/41387), Kiefer Chang)
    
- mgr/dashboard: debug nodeenv hangs ([pr#40816](https://github.com/ceph/ceph/pull/40816), Ernesto Puerta)
    
- mgr/dashboard: filesystem pool size should use stored stat ([pr#41020](https://github.com/ceph/ceph/pull/41020), Avan Thakkar)
    
- mgr/dashboard: fix base-href: revert it to previous approach ([pr#41252](https://github.com/ceph/ceph/pull/41252), Avan Thakkar)
    
- mgr/dashboard: fix dashboard instance ssl certificate functionality ([pr#40001](https://github.com/ceph/ceph/pull/40001), Avan Thakkar)
    
- mgr/dashboard: improve telemetry opt-in reminder notification message ([pr#40894](https://github.com/ceph/ceph/pull/40894), Waad Alkhoury)
    
- mgr/dashboard: test prometheus rules through promtool ([pr#39987](https://github.com/ceph/ceph/pull/39987), Aashish Sharma, Kefu Chai)
    
- mgr/progress: ensure progress stays between \[0,1\] ([pr#41311](https://github.com/ceph/ceph/pull/41311), Dan van der Ster)
    
- mgr/rook: Add timezone info ([pr#39716](https://github.com/ceph/ceph/pull/39716), Varsha Rao)
    
- mgr/telemetry: check if 'ident' channel is active ([pr#39922](https://github.com/ceph/ceph/pull/39922), Sage Weil, Yaarit Hatuka)
    
- mgr/volumes: Retain suid guid bits in clone ([pr#40268](https://github.com/ceph/ceph/pull/40268), Kotresh HR)
    
- mgr: fix deadlock in ActivePyModules::get\_osdmap() ([pr#39341](https://github.com/ceph/ceph/pull/39341), peng jiaqi)
    
- mgr: relax osd ok-to-stop condition on degraded pgs ([pr#39887](https://github.com/ceph/ceph/pull/39887), Xuehan Xu)
    
- mgr: update mon metadata when monmap is updated ([pr#39219](https://github.com/ceph/ceph/pull/39219), Kefu Chai)
    
- mon/ConfigMap: fix stray option leak ([pr#40298](https://github.com/ceph/ceph/pull/40298), Sage Weil)
    
- mon/MgrMonitor: populate available\_modules from promote\_standby() ([pr#40757](https://github.com/ceph/ceph/pull/40757), Sage Weil)
    
- mon/MonClient: reset authenticate\_err in \_reopen\_session() ([pr#41017](https://github.com/ceph/ceph/pull/41017), Ilya Dryomov)
    
- mon/OSDMonitor: drop stale failure\_info after a grace period ([pr#40558](https://github.com/ceph/ceph/pull/40558), Kefu Chai)
    
- mon/OSDMonitor: fix safety/idempotency of {set,rm}-device-class ([pr#40276](https://github.com/ceph/ceph/pull/40276), Sage Weil)
    
- mon: Modifying trim logic to change paxos\_service\_trim\_max dynamically ([pr#40699](https://github.com/ceph/ceph/pull/40699), Aishwarya Mathuria)
    
- mon: check mdsmap is resizeable before promoting standby-replay ([pr#40783](https://github.com/ceph/ceph/pull/40783), Patrick Donnelly)
    
- monmaptool: Don't call set\_port on an invalid address ([pr#40758](https://github.com/ceph/ceph/pull/40758), Brad Hubbard, Kefu Chai)
    
- mount.ceph: collect v2 addresses for non-legacy ms\_mode options ([pr#40763](https://github.com/ceph/ceph/pull/40763), Jeff Layton)
    
- os/FileStore: don't propagate split/merge error to "create"/"remove" ([pr#40988](https://github.com/ceph/ceph/pull/40988), Mykola Golub)
    
- os/FileStore: fix to handle readdir error correctly ([pr#41237](https://github.com/ceph/ceph/pull/41237), Misono Tomohiro)
    
- os/bluestore/BlueFS: do not \_flush\_range deleted files ([pr#40793](https://github.com/ceph/ceph/pull/40793), weixinwei)
    
- os/bluestore/BlueFS: use iterator\_impl::copy instead of bufferlist::c\_str() to avoid bufferlist rebuild ([pr#39884](https://github.com/ceph/ceph/pull/39884), weixinwei)
    
- os/bluestore: Make Onode::put/get resiliant to split\_cache ([pr#40441](https://github.com/ceph/ceph/pull/40441), Igor Fedotov, Adam Kupczyk)
    
- os/bluestore: be more verbose in \_open\_super\_meta by default ([pr#41061](https://github.com/ceph/ceph/pull/41061), Igor Fedotov)
    
- osd/OSDMap: An empty bucket or OSD is not an error ([pr#39970](https://github.com/ceph/ceph/pull/39970), Brad Hubbard)
    
- osd: add osd\_fast\_shutdown\_notify\_mon option (default false) ([issue#46978](http://tracker.ceph.com/issues/46978), [pr#40013](https://github.com/ceph/ceph/pull/40013), Mauricio Faria de Oliveira)
    
- osd: compute OSD's space usage ratio via raw space utilization ([pr#41112](https://github.com/ceph/ceph/pull/41112), Igor Fedotov)
    
- osd: do not dump an osd multiple times ([pr#40788](https://github.com/ceph/ceph/pull/40788), Xue Yantao)
    
- osd: don't assert in-flight backfill is always in recovery list ([pr#41321](https://github.com/ceph/ceph/pull/41321), Mykola Golub)
    
- osd: fix potential null pointer dereference when sending ping ([pr#40277](https://github.com/ceph/ceph/pull/40277), Mykola Golub)
    
- osd: propagate base pool application\_metadata to tiers ([pr#40274](https://github.com/ceph/ceph/pull/40274), Sage Weil)
    
- packaging: require ceph-common for immutable object cache daemon ([pr#40666](https://github.com/ceph/ceph/pull/40666), Ilya Dryomov)
    
- pybind/ceph\_argparse.py: use a safe value for timeout ([pr#40476](https://github.com/ceph/ceph/pull/40476), Kefu Chai)
    
- pybind/cephfs: DT\_REG and DT\_LNK values are wrong ([pr#40770](https://github.com/ceph/ceph/pull/40770), Varsha Rao)
    
- pybind/mgr/balancer/module.py: assign weight-sets to all buckets before balancing ([pr#40127](https://github.com/ceph/ceph/pull/40127), Neha Ojha)
    
- pybind/mgr/dashboard: bump flake8 to 3.9.0 ([pr#40492](https://github.com/ceph/ceph/pull/40492), Kefu Chai, Volker Theile)
    
- qa/\\\*/thrash\_cache\_writeback\_proxy\_none.yaml: disable writeback overlay tests ([pr#39578](https://github.com/ceph/ceph/pull/39578), Neha Ojha)
    
- qa/ceph-ansible: Update ansible version and ceph\_stable\_release ([pr#40945](https://github.com/ceph/ceph/pull/40945), Brad Hubbard)
    
- qa/suites/krbd: address recent issues caused by newer kernels ([pr#40065](https://github.com/ceph/ceph/pull/40065), Ilya Dryomov)
    
- qa/suites/rados/cephadm/upgrade: change starting version by distro ([pr#40364](https://github.com/ceph/ceph/pull/40364), Sage Weil)
    
- qa/suites/rados/cephadm: rm ubuntu\_18.04\_podman ([pr#39949](https://github.com/ceph/ceph/pull/39949), Sebastian Wagner)
    
- qa/suites/rados/singletone: whitelist MON\_DOWN when injecting msgr errors ([pr#40138](https://github.com/ceph/ceph/pull/40138), Sage Weil)
    
- qa/tasks/mgr/test\_progress.py: remove calling of \_osd\_in\_out\_completed\_events\_count() ([pr#40225](https://github.com/ceph/ceph/pull/40225), Kamoltat)
    
- qa/tasks/mgr/test\_progress: fix wait\_until\_equal ([pr#39360](https://github.com/ceph/ceph/pull/39360), Kamoltat)
    
- qa/tasks/vstart\_runner.py: start max required mgrs ([pr#40792](https://github.com/ceph/ceph/pull/40792), Alfonso Martínez)
    
- qa/tests: advanced octopus initial version to 15.2.10 ([pr#41228](https://github.com/ceph/ceph/pull/41228), Yuri Weinstein)
    
- qa: add sleep for blocklisting to take effect ([pr#40773](https://github.com/ceph/ceph/pull/40773), Patrick Donnelly)
    
- qa: bump osd heartbeat grace for ffsb workload ([pr#40767](https://github.com/ceph/ceph/pull/40767), Patrick Donnelly)
    
- qa: delete all fs during tearDown ([pr#40772](https://github.com/ceph/ceph/pull/40772), Patrick Donnelly)
    
- qa: for the latest kclient it will also return EIO ([pr#40765](https://github.com/ceph/ceph/pull/40765), Xiubo Li)
    
- qa: krbd\_blkroset.t: update for separate hw and user read-only flags ([pr#40211](https://github.com/ceph/ceph/pull/40211), Ilya Dryomov)
    
- rbd-mirror: bad state and crashes in snapshot-based mirroring ([pr#39961](https://github.com/ceph/ceph/pull/39961), Jason Dillaman)
    
- rbd-mirror: delay update snapshot mirror image state ([pr#39967](https://github.com/ceph/ceph/pull/39967), Jason Dillaman)
    
- rbd-mirror: fix UB while registering perf counters ([pr#40790](https://github.com/ceph/ceph/pull/40790), Arthur Outhenin-Chalandre)
    
- rbd/bench: include used headers ([pr#40388](https://github.com/ceph/ceph/pull/40388), Kefu Chai)
    
- rgw/amqp: fix race condition in amqp manager initialization ([pr#40382](https://github.com/ceph/ceph/pull/40382), Yuval Lifshitz)
    
- rgw/http: add timeout to http client ([pr#40384](https://github.com/ceph/ceph/pull/40384), Yuval Lifshitz)
    
- rgw/notification: support GetTopicAttributes API ([pr#40812](https://github.com/ceph/ceph/pull/40812), Yuval Lifshitz)
    
- rgw/notification: trigger notifications on changes from any user ([pr#40029](https://github.com/ceph/ceph/pull/40029), Yuval Lifshitz)
    
- rgw: Use correct bucket info when put or get large object with swift ([pr#40296](https://github.com/ceph/ceph/pull/40296), zhiming zhang, yupeng chen)
    
- rgw: add MD5 in forward\_request ([pr#39758](https://github.com/ceph/ceph/pull/39758), caolei)
    
- rgw: allow rgw-orphan-list to handle intermediate files w/ binary data ([pr#39766](https://github.com/ceph/ceph/pull/39766), J. Eric Ivancich)
    
- rgw: catch non int exception ([pr#39746](https://github.com/ceph/ceph/pull/39746), caolei)
    
- rgw: during reshard lock contention, adjust logging ([pr#41157](https://github.com/ceph/ceph/pull/41157), J. Eric Ivancich)
    
- rgw: fix sts get\_session\_token duration check failed ([pr#39954](https://github.com/ceph/ceph/pull/39954), yuliyang\_yewu)
    
- rgw: multisite: fix single-part-MPU object etag misidentify problem ([pr#39611](https://github.com/ceph/ceph/pull/39611), Yang Honggang)
    
- rgw: objectlock: improve client error messages ([pr#40755](https://github.com/ceph/ceph/pull/40755), Matt Benjamin)
    
- rgw: return error when trying to copy encrypted object without key ([pr#40672](https://github.com/ceph/ceph/pull/40672), Ilsoo Byun)
    
- rgw: tooling to locate rgw objects with missing rados components ([pr#39785](https://github.com/ceph/ceph/pull/39785), Michael Kidd, J. Eric Ivancich)
    
- run-make-check.sh: let ctest generate XML output ([pr#40406](https://github.com/ceph/ceph/pull/40406), Kefu Chai)
    
- src/global/signal\_handler.h: fix preprocessor logic for alpine ([pr#39940](https://github.com/ceph/ceph/pull/39940), Duncan Bellamy)
    
- test/rbd-mirror: fix broken ceph\_test\_rbd\_mirror\_random\_write ([pr#39965](https://github.com/ceph/ceph/pull/39965), Jason Dillaman)
    
- test/rgw: test\_datalog\_autotrim filters out new entries ([pr#40673](https://github.com/ceph/ceph/pull/40673), Casey Bodley)
    
- test: cancelling both noscrub \\\*and\\\* nodeep-scrub ([pr#40278](https://github.com/ceph/ceph/pull/40278), Ronen Friedman)
    
- test: reduce number of threads to 32 in LibCephFS.ShutdownRace ([pr#40776](https://github.com/ceph/ceph/pull/40776), Jeff Layton)
    
- test: use std::atomic instead of volatile for cb\_done var ([pr#40708](https://github.com/ceph/ceph/pull/40708), Jeff Layton)
    
- tests: ceph\_test\_rados\_api\_watch\_notify: Allow for reconnect ([pr#40756](https://github.com/ceph/ceph/pull/40756), Brad Hubbard)
    
- tools/cephfs: don't bind to public\_addr ([pr#40762](https://github.com/ceph/ceph/pull/40762), "Yan, Zheng")
    
- vstart.sh: disable "auth\_allow\_insecure\_global\_id\_reclaim" ([pr#40958](https://github.com/ceph/ceph/pull/40958), Kefu Chai)
