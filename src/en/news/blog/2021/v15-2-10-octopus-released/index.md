---
title: "v15.2.10 Octopus released"
date: "2021-03-18"
author: "dgalloway"
---

This is the 10th backport release in the Octopus series. We recommend users to update to this release.

## Notable Changes[¶](#notable-changes "Permalink to this headline")

- The containers include an updated tcmalloc that avoids crashes seen on 15.2.9 (see [issue#49618](https://tracker.ceph.com/issues/49618) for details.
- RADOS: BlueStore handling of huge(>4GB) writes from RocksDB to BlueFS has been fixed.
- When upgrading from a previous cephadm release, systemctl may hang when trying to start or restart the monitoring containers. (This is caused by a change in the systemd unit to use `type=forking`.) After the upgrade, please run:
  
`ceph orch redeploy nfs`  
`ceph orch redeploy iscsi`  
`ceph orch redeploy node-exporter`  
`ceph orch redeploy prometheus`  
`ceph orch redeploy grafana`  
`ceph orch redeploy alertmanager`

## Changelog[¶](#changelog "Permalink to this headline")

- .github: add workflow for adding label and milestone ([pr#39890](https://github.com/ceph/ceph/pull/39890), Kefu Chai, Ernesto Puerta)
    
- ceph-volume: Fix usage of is\_lv ([pr#39220](https://github.com/ceph/ceph/pull/39220), Michał Nasiadka)
    
- ceph-volume: Update batch.py ([pr#39469](https://github.com/ceph/ceph/pull/39469), shenjiatong)
    
- ceph-volume: add some flexibility to bytes\_to\_extents ([pr#39271](https://github.com/ceph/ceph/pull/39271), Jan Fajerski)
    
- ceph-volume: pass --filter-for-batch from drive-group subcommand ([pr#39523](https://github.com/ceph/ceph/pull/39523), Jan Fajerski)
    
- cephadm: Delete the unnecessary error line in open\_ports ([pr#39633](https://github.com/ceph/ceph/pull/39633), Donggyu Park)
    
- cephadm: fix 'inspect' and 'pull' ([pr#39715](https://github.com/ceph/ceph/pull/39715), Sage Weil)
    
- cephfs: pybind/ceph\_volume\_client: Update the 'volumes' key to 'subvolumes' in auth-metadata file ([pr#39906](https://github.com/ceph/ceph/pull/39906), Kotresh HR)
    
- cmake: boost>=1.74 adds BOOST\_ASIO\_USE\_TS\_EXECUTOR\_AS\_DEFAULT to radosgw ([pr#39885](https://github.com/ceph/ceph/pull/39885), Casey Bodley)
    
- librbd: allow disabling journaling for snapshot based mirroring image ([pr#39864](https://github.com/ceph/ceph/pull/39864), Mykola Golub)
    
- librbd: correct incremental deep-copy object-map inconsistencies ([pr#39577](https://github.com/ceph/ceph/pull/39577), Mykola Golub, Jason Dillaman)
    
- librbd: don't log error if get mirror status fails due to mirroring disabled ([pr#39862](https://github.com/ceph/ceph/pull/39862), Mykola Golub)
    
- librbd: use on-disk image name when storing mirror snapshot state ([pr#39866](https://github.com/ceph/ceph/pull/39866), Mykola Golub)
    
- mgr/dashboard/monitoring: upgrade Grafana version due to CVE-2020-13379 ([pr#39306](https://github.com/ceph/ceph/pull/39306), Alfonso Martínez)
    
- mgr/dashboard: CLI commands: read passwords from file ([pr#39436](https://github.com/ceph/ceph/pull/39436), Ernesto Puerta, Alfonso Martínez, Juan Miguel Olmo Martínez)
    
- mgr/dashboard: Fix for incorrect validation in rgw user form ([pr#39027](https://github.com/ceph/ceph/pull/39027), Nizamudeen A)
    
- mgr/dashboard: Fix missing root path of each session for CephFS ([pr#39868](https://github.com/ceph/ceph/pull/39868), Yongseok Oh)
    
- mgr/dashboard: Monitoring alert badge includes suppressed alerts ([pr#39512](https://github.com/ceph/ceph/pull/39512), Aashish Sharma)
    
- mgr/dashboard: add ssl verify option for prometheus and alert manager ([pr#39872](https://github.com/ceph/ceph/pull/39872), Jean "henyxia" Wasilewski)
    
- mgr/dashboard: avoid using document.write() ([pr#39527](https://github.com/ceph/ceph/pull/39527), Avan Thakkar)
    
- mgr/dashboard: delete EOF when reading passwords from file ([pr#40155](https://github.com/ceph/ceph/pull/40155), Alfonso Martínez)
    
- mgr/dashboard: fix MTU Mismatch alert ([pr#39854](https://github.com/ceph/ceph/pull/39854), Aashish Sharma)
    
- mgr/dashboard: fix issues related with PyJWT versions >=2.0.0 ([pr#39836](https://github.com/ceph/ceph/pull/39836), Alfonso Martínez)
    
- mgr/dashboard: fix tooltip for Provisioned/Total Provisioned fields ([pr#39645](https://github.com/ceph/ceph/pull/39645), Avan Thakkar)
    
- mgr/dashboard: prometheus alerting: add some leeway for package drops and errors ([pr#39507](https://github.com/ceph/ceph/pull/39507), Patrick Seidensal)
    
- mgr/dashboard: report mgr fsid ([pr#39852](https://github.com/ceph/ceph/pull/39852), Ernesto Puerta)
    
- mgr/dashboard: set security headers ([pr#39627](https://github.com/ceph/ceph/pull/39627), Avan Thakkar)
    
- mgr/dashboard: trigger alert if some nodes have a MTU different than the median value ([pr#39103](https://github.com/ceph/ceph/pull/39103), Aashish Sharma)
    
- mgr/dashboard:minimize console log traces of Ceph backend API tests ([pr#39545](https://github.com/ceph/ceph/pull/39545), Aashish Sharma)
    
- mgr/rbd\_support: create mirror snapshots asynchronously ([pr#39376](https://github.com/ceph/ceph/pull/39376), Mykola Golub, Kefu Chai)
    
- mgr/rbd\_support: mirror snapshot schedule should skip non-primary images ([pr#39863](https://github.com/ceph/ceph/pull/39863), Mykola Golub)
    
- mgr/volume: subvolume auth\_id management and few bug fixes ([pr#39390](https://github.com/ceph/ceph/pull/39390), Rishabh Dave, Patrick Donnelly, Kotresh HR, Ramana Raja)
    
- mgr/zabbix: format ceph.\[{#POOL},percent\_used as float ([pr#39235](https://github.com/ceph/ceph/pull/39235), Kefu Chai)
    
- os/bluestore: Add option to check BlueFS reads ([pr#39754](https://github.com/ceph/ceph/pull/39754), Adam Kupczyk)
    
- os/bluestore: fix huge reads/writes at BlueFS ([pr#39701](https://github.com/ceph/ceph/pull/39701), Jianpeng Ma, Igor Fedotov)
    
- os/bluestore: introduce bluestore\_rocksdb\_options\_annex config parame… ([pr#39325](https://github.com/ceph/ceph/pull/39325), Igor Fedotov)
    
- qa/suites/rados/dashboard: whitelist TELEMETRY\_CHANGED ([pr#39704](https://github.com/ceph/ceph/pull/39704), Sage Weil)
    
- qa/suites/upgrade: s/whitelist/ignorelist for octopus specific tests ([pr#40074](https://github.com/ceph/ceph/pull/40074), Deepika Upadhyay)
    
- qa: use normal build for valgrind ([pr#39583](https://github.com/ceph/ceph/pull/39583), Sage Weil)
    
- rbd-mirror: reset update\_status\_task pointer in timer thread ([pr#39867](https://github.com/ceph/ceph/pull/39867), Mykola Golub)
    
- rgw: fix trailing null in object names of multipart reuploads ([pr#39277](https://github.com/ceph/ceph/pull/39277), Casey Bodley)
    
- rgw: radosgw-admin: clarify error when email address already in use ([pr#39662](https://github.com/ceph/ceph/pull/39662), Matthew Vernon)
    
- whitelist -> ignorelist for qa/\\\* only ([pr#39534](https://github.com/ceph/ceph/pull/39534), Neha Ojha, Sage Weil)
    
- qa/tests: fixed branch entry ([pr#39819](https://github.com/ceph/ceph/pull/39819), Yuri Weinstein)
