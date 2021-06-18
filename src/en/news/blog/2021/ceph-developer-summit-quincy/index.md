---
title: "Ceph Developer Summit: Quincy"
date: "2021-04-01"
author: "thingee"
---

Now that the [Ceph Pacific release](https://ceph.io/releases/v16-2-0-pacific-released/) is available, it's time to start discussions for our next major release at the Ceph Developer Summit: Quincy April 6-9.

The event will consist of developer sessions focused on Ceph components and adjacent projects.

If you would like to join in the discussion, please see the Ceph community calendar, which you can [view directly in a browser](https://calendar.google.com/calendar/embed?src=9ts9c7lt7u1vic2ijvvqqlfpo0%40group.calendar.google.com&ctz=America%2FChicago) or add to your Google calendar with the code 9ts9c7lt7u1vic2ijvvqqlfpo0@group.calendar.google.com (highly recommended to avoid any ambiguity around time zones and schedule changes).

Topic proposals and a more updated schedule can be found on the [Ceph Developer Summit Quincy etherpad](https://pad.ceph.com/p/cds-quincy). 

| Date / Time | Topics |
| --- | --- |
| April 6  
15:00-17:00 UTC  
11:00-13:00 EDT  
**RADOS** | [Split Cache Improvements](https://pad.ceph.com/p/split_cache_improvements)  
[Immutable Content Improvements](https://pad.ceph.com/p/immutable-content-improvements)  
[Ceph Manager Improvements](https://pad.ceph.com/p/ceph-mgr-improvements)  
[Auto-scale Improvements](https://pad.ceph.com/p/pg_autoscaler_improvements)  
[Confvals YAML to Ceph Documentation](https://pad.ceph.com/p/confva-yaml-doc) |
| April 7  
01:00 - 02:00 UTC  
09:00 - 10:00 CST  
  
NOTE: April 6  
21:00-22:00 EDT  
  
**Crimson/RADOS** | \- Adapt boost::asio-based in seastar reactor?  
(e.g., neorados and crimson messenger + librbd and SPDK for nvmeof gateway)  
\-Manage RWL Replication Info - Design ReplicDaemon & ReplicaMonitor to manage RWL Replication Info |
| April 7  
14:00 - 15:00 UTC  
10:00-11:00 EDT  
  
**Orchestrator** | \- Cephadm resource scheduling  
\- Autotuning OSD, MON, MDS memory  
\- Dashboard integration: Facilitate initial deployment tasks and Day 2 ops:  
\- [Previous priorities](https://pad.ceph.com/p/ceph-dashboard-pacific-priorities)  
\- Cephadm host draining  
\- Cephadm-exporter  
\- Crimson deployment  
\- nfs + rgw (rgw block in bootstrap or rados config) |
| April 7  
15:00-16:00 UTC  
11:00 - 12:00 EDT  
**Rook** | \- mgr/rook todo  
\- Dashboard: status and next steps & UX feedback. |
| April 7  
16:00-18:00 UTC  
12:00 - 14:00 EDT  
**RGW** | \- Dashboard and RGW: overview of current status and next steps  
Ability to execute radosgw-admin commands.  
\- Alternate bucket indexing schemes: tree-based, SQLite.  
\- QoS and group communications progress.  
\- Cache  
\- Zipper  
\- Bucket inventory  
\- RGW Dedup |
| April 8,  
12:00-13:00 UTC  
08:00 - 09:00 EDT  
20:00 - 21:00 CST  
**Dashboard** | \- [Leftovers](https://pad.ceph.com/p/ceph-dashboard-pacific-priorities)  
\- Dashboard integration with orch/cephadm: Facilitate initial deployment tasks and Day 2 ops.  
\- Workflow needs discussion and prioritization.  
\- Telemetry: should we report usage? which pages? etc? |
| April 8  
14:00 - 15:00 UTC  
10:00 - 11:00 EDT  
**CI** | \- Make check / API tests / infra reliability  
\- Teuthology / paddles / pulpito improvements |
| April 8  
15:00 - 16:00 UTC  
11:00 - 12:00 EDT  
**RBD** | \- Dashboard and RBD: overview of current status and next steps  
\- nvmeof status and next steps  
\- Can the boost::asio reactor be swapped with seastar, so that we can play nice with SPDK?  
\- [RBD Mirroring monitoring](https://pad.ceph.com/p/mirorring-metrics)  
\- Volume groups for snap mirroring |
| April 9  
16:00-17:00 UTC  
12:00 - 13:00 EDT  
  
**CephFS** | \- Dashboard and FS/NFS: overview of current status and next steps  
mds\_memory\_target? (prioritycache would be nice if possible!) |
