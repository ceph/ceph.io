---
title: "v16.2.2 Pacific released"
date: "2021-05-05"
author: "dgalloway"
---

This is the second backport release in the Pacific stable series. We recommend all Pacific users upgrade.

  
  

## Notable Changes[¶](#notable-changes "Permalink to this headline")

- Cephadm now supports an **ingress** service type that provides load balancing and HA (via haproxy and keepalived on a virtual IP) for RGW service. The experimental **rgw-ha** service has been removed.
    

  
  

## Changelog[¶](#changelog "Permalink to this headline")

- ceph-fuse: src/include/buffer.h: 1187: FAILED ceph\_assert(\_num <= 1024) ([pr#40628](https://github.com/ceph/ceph/pull/40628), Yanhu Cao)
    
- ceph-volume: fix "device" output ([pr#41054](https://github.com/ceph/ceph/pull/41054), Sébastien Han)
    
- ceph-volume: fix raw listing when finding OSDs from different clusters ([pr#40985](https://github.com/ceph/ceph/pull/40985), Sébastien Han)
    
- ceph.spec.in: Enable tcmalloc on IBM Power and Z ([pr#39488](https://github.com/ceph/ceph/pull/39488), Nathan Cutler, Yaakov Selkowitz)
    
- cephadm april batch 3 ([issue#49737](http://tracker.ceph.com/issues/49737), [pr#40922](https://github.com/ceph/ceph/pull/40922), Adam King, Sage Weil, Daniel Pivonka, Shreyaa Sharma, Sebastian Wagner, Juan Miguel Olmo Martínez, Zac Dover, Jeff Layton, Guillaume Abrioux, 胡玮文, Melissa Li, Nathan Cutler, Yaakov Selkowitz)
    
- cephadm: april batch 1 ([pr#40544](https://github.com/ceph/ceph/pull/40544), Sage Weil, Daniel Pivonka, Joao Eduardo Luis, Adam King)
    
- cephadm: april batch backport 2 ([pr#40746](https://github.com/ceph/ceph/pull/40746), Guillaume Abrioux, Sage Weil, Paul Cuzner)
    
- cephadm: specify addr on bootstrap's host add ([pr#40554](https://github.com/ceph/ceph/pull/40554), Joao Eduardo Luis)
    
- cephfs: minor ceph-dokan improvements ([pr#40627](https://github.com/ceph/ceph/pull/40627), Lucian Petrut)
    
- client: items pinned in cache preventing unmount ([pr#40629](https://github.com/ceph/ceph/pull/40629), Xiubo Li)
    
- client: only check pool permissions for regular files ([pr#40686](https://github.com/ceph/ceph/pull/40686), Xiubo Li)
    
- cmake: define BOOST\_ASIO\_USE\_TS\_EXECUTOR\_AS\_DEFAULT globally ([pr#40706](https://github.com/ceph/ceph/pull/40706), Kefu Chai)
    
- cmake: pass unparsed args to add\_ceph\_test() ([pr#40523](https://github.com/ceph/ceph/pull/40523), Kefu Chai)
    
- cmake: use --smp 1 --memory 256M to crimson tests ([pr#40568](https://github.com/ceph/ceph/pull/40568), Kefu Chai)
    
- crush/CrushLocation: do not print logging message in constructor ([pr#40679](https://github.com/ceph/ceph/pull/40679), Alex Wu)
    
- doc/cephfs/nfs: add user id, fs name and key to FSAL block ([pr#40687](https://github.com/ceph/ceph/pull/40687), Varsha Rao)
    
- include/librados: fix doxygen syntax for docs build ([pr#40805](https://github.com/ceph/ceph/pull/40805), Josh Durgin)
    
- mds: "cluster \[WRN\] Scrub error on inode 0x1000000039d (/client.0/tmp/blogbench-1.0/src/blogtest\_in) see mds.a log and \`damage ls\` output for details" ([pr#40825](https://github.com/ceph/ceph/pull/40825), Milind Changire)
    
- mds: skip the buffer in UnknownPayload::decode() ([pr#40682](https://github.com/ceph/ceph/pull/40682), Xiubo Li)
    
- mgr/PyModule: put mgr\_module\_path before Py\_GetPath() ([pr#40517](https://github.com/ceph/ceph/pull/40517), Kefu Chai)
    
- mgr/dashboard: Device health status is not getting listed under hosts section ([pr#40494](https://github.com/ceph/ceph/pull/40494), Aashish Sharma)
    
- mgr/dashboard: Fix for alert notification message being undefined ([pr#40588](https://github.com/ceph/ceph/pull/40588), Nizamudeen A)
    
- mgr/dashboard: Fix for broken User management role cloning ([pr#40398](https://github.com/ceph/ceph/pull/40398), Nizamudeen A)
    
- mgr/dashboard: Improve descriptions in some parts of the dashboard ([pr#40545](https://github.com/ceph/ceph/pull/40545), Nizamudeen A)
    
- mgr/dashboard: Remove username and password from request body ([pr#40981](https://github.com/ceph/ceph/pull/40981), Nizamudeen A)
    
- mgr/dashboard: Remove username, password fields from Manager Modules/dashboard,influx ([pr#40489](https://github.com/ceph/ceph/pull/40489), Aashish Sharma)
    
- mgr/dashboard: Revoke read-only user's access to Manager modules ([pr#40648](https://github.com/ceph/ceph/pull/40648), Nizamudeen A)
    
- mgr/dashboard: Unable to login to ceph dashboard until clearing cookies manually ([pr#40586](https://github.com/ceph/ceph/pull/40586), Avan Thakkar)
    
- mgr/dashboard: debug nodeenv hangs ([pr#40815](https://github.com/ceph/ceph/pull/40815), Ernesto Puerta)
    
- mgr/dashboard: filesystem pool size should use stored stat ([pr#40980](https://github.com/ceph/ceph/pull/40980), Avan Thakkar)
    
- mgr/dashboard: fix broken feature toggles ([pr#40474](https://github.com/ceph/ceph/pull/40474), Ernesto Puerta)
    
- mgr/dashboard: fix duplicated rows when creating NFS export ([pr#40990](https://github.com/ceph/ceph/pull/40990), Alfonso Martínez)
    
- mgr/dashboard: fix errors when creating NFS export ([pr#40822](https://github.com/ceph/ceph/pull/40822), Alfonso Martínez)
    
- mgr/dashboard: improve telemetry opt-in reminder notification message ([pr#40887](https://github.com/ceph/ceph/pull/40887), Waad Alkhoury)
    
- mgr/dashboard: test prometheus rules through promtool ([pr#40929](https://github.com/ceph/ceph/pull/40929), Aashish Sharma, Kefu Chai)
    
- mon: Modifying trim logic to change paxos\_service\_trim\_max dynamically ([pr#40691](https://github.com/ceph/ceph/pull/40691), Aishwarya Mathuria)
    
- monmaptool: Don't call set\_port on an invalid address ([pr#40690](https://github.com/ceph/ceph/pull/40690), Brad Hubbard, Kefu Chai)
    
- os/FileStore: don't propagate split/merge error to "create"/"remove" ([pr#40989](https://github.com/ceph/ceph/pull/40989), Mykola Golub)
    
- os/bluestore/BlueFS: do not \_flush\_range deleted files ([pr#40677](https://github.com/ceph/ceph/pull/40677), weixinwei)
    
- osd/PeeringState: fix acting\_set\_writeable min\_size check ([pr#40759](https://github.com/ceph/ceph/pull/40759), Samuel Just)
    
- packaging: require ceph-common for immutable object cache daemon ([pr#40665](https://github.com/ceph/ceph/pull/40665), Ilya Dryomov)
    
- pybind/mgr/volumes: deadlock on async job hangs finisher thread ([pr#40630](https://github.com/ceph/ceph/pull/40630), Kefu Chai, Patrick Donnelly)
    
- qa/suites/krbd: don't require CEPHX\_V2 for unmap subsuite ([pr#40826](https://github.com/ceph/ceph/pull/40826), Ilya Dryomov)
    
- qa/suites/rados/cephadm: stop testing on broken focal kubic podman ([pr#40512](https://github.com/ceph/ceph/pull/40512), Sage Weil)
    
- qa/tasks/ceph.conf: shorten cephx TTL for testing ([pr#40663](https://github.com/ceph/ceph/pull/40663), Sage Weil)
    
- qa/tasks/cephfs: create enough subvolumes ([pr#40688](https://github.com/ceph/ceph/pull/40688), Ramana Raja)
    
- qa/tasks/vstart\_runner.py: start max required mgrs ([pr#40612](https://github.com/ceph/ceph/pull/40612), Alfonso Martínez)
    
- qa/tasks: Add wait\_for\_clean() check prior to initiating scrubbing ([pr#40461](https://github.com/ceph/ceph/pull/40461), Sridhar Seshasayee)
    
- qa: "AttributeError: 'NoneType' object has no attribute 'mon\_manager'" ([pr#40645](https://github.com/ceph/ceph/pull/40645), Rishabh Dave)
    
- qa: "log \[ERR\] : error reading sessionmap 'mds2\_sessionmap'" ([pr#40852](https://github.com/ceph/ceph/pull/40852), Patrick Donnelly)
    
- qa: fix ino\_release\_cb racy behavior ([pr#40683](https://github.com/ceph/ceph/pull/40683), Patrick Donnelly)
    
- qa: fs:cephadm mount does not wait for mds to be created ([pr#40528](https://github.com/ceph/ceph/pull/40528), Patrick Donnelly)
    
- qa: test standby\_replay in workloads ([pr#40853](https://github.com/ceph/ceph/pull/40853), Patrick Donnelly)
    
- rbd-mirror: fix UB while registering perf counters ([pr#40680](https://github.com/ceph/ceph/pull/40680), Arthur Outhenin-Chalandre)
    
- rgw: add latency to the request summary of an op ([pr#40448](https://github.com/ceph/ceph/pull/40448), Ali Maredia)
    
- rgw: Backport of datalog improvements to Pacific ([pr#40559](https://github.com/ceph/ceph/pull/40559), Yuval Lifshitz, Adam C. Emerson)
    
- test: disable mgr/mirroring for \`test\_mirroring\_init\_failure\_with\_recovery\` test ([issue#50020](http://tracker.ceph.com/issues/50020), [pr#40684](https://github.com/ceph/ceph/pull/40684), Venky Shankar)
    
- tools/cephfs\_mirror/PeerReplayer.cc: add missing include ([pr#40678](https://github.com/ceph/ceph/pull/40678), Duncan Bellamy)
    
- vstart.sh: disable "auth\_allow\_insecure\_global\_id\_reclaim" ([pr#40957](https://github.com/ceph/ceph/pull/40957), Kefu Chai)
