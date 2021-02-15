---
title: v15.2.2 Octopus released 2
date: 2020-05-16
author: abhishekl
image: "/assets/placeholder-photo-1280x720.jpg"
tags:
  - "octopus"
---

This is the second bugfix release of Ceph Octopus stable release series, we
recommend that all Octopus users upgrade. This release has a range of fixes
across all components and a security fix.

## Notable Changes

- CVE-2020-10736: Fixed an authorization bypass in mons & mgrs (Olle SegerDahl, Josh Durgin)

## Changelog

- ceph-volume/batch: check lvs list before access (pr#34480, Jan Fajerski)
- ceph-volume/batch: return success when all devices are filtered (pr#34477, Jan Fajerski)
- ceph-volume: update functional testing deploy.yml playbook (pr#34886, Guillaume Abrioux)
- cephadm: Fix check_ip_port to work with IPv6 (pr#34350, Ricardo Marques)
- cephadm: Update images used (pr#34686, Sebastian Wagner)
- cephadm: ceph-volume: disallow concurrent execution (pr#34423, Sage Weil)
- cephadm: rm-cluster clean up /etc/ceph (pr#34299, Daniel-Pivonka)
- devices/simple/scan: Fix string in log statement (pr#34446, Jan Fajerski)
- mgr/dashboard: ‘Prometheus / All Alerts’ page shows progress bar (pr#34631, Volker Theile)
- mgr/dashboard: Fix ServiceDetails and PoolDetails unit tests (pr#34760, Tiago Melo)
- mgr/dashboard: Fix iSCSI’s username and password validation (pr#34547, Tiago Melo)
- mgr/dashboard: Improve iSCSI CHAP message (pr#34630, Ricardo Marques)
- mgr/dashboard: Prevent iSCSI target recreation when editing controls (pr#34548, Tiago Melo)
- mgr/dashboard: RGW auto refresh is not working (pr#34739, Avan Thakkar)
- mgr/dashboard: Repair broken grafana panels (pr#34495, Kristoffer Grönlund)
- mgr/dashboard: Update translations on octopus (pr#34309, Sebastian Krah)
- mgr/dashboard: add crush rule test suite (pr#34211, Tatjana Dehler)
- mgr/dashboard: fix API tests to be py3 compatible (pr#34759, Kefu Chai, Laura Paduano, Alfonso Martínez)
- mgr/dashboard: fix errors related to frontend service subscriptions (pr#34467, Alfonso Martínez)
- mgr/dashboard: fix tasks.mgr.dashboard.test_rgw.RgwBucketTest.test_all (pr#34708, Alfonso Martínez)
- mgr/dashboard: lint error on plugins/debug.py (pr#34625, Volker Theile)
- mgr/dashboard: shorten “Container ID” and “Container image ID” in Services page (pr#34648, Volker Theile)
- mgr/dashboard: use FQDN for failover redirection (pr#34498, Ernesto Puerta)
- monitoring: Fix pool capacity incorrect (pr#34449, James Cheng)
- monitoring: alert for prediction of disk and pool fill up broken (pr#34395, Patrick Seidensal)
- monitoring: fix decimal precision in Grafana %percentages (pr#34828, Ernesto Puerta)
- monitoring: root volume full alert fires false positives (pr#34418, Patrick Seidensal)
- qa/suites/rados/cephadm/upgrade: start from v15.2.0 (pr#34440, Sage Weil)
- qa/tasks/cephadm: add ‘roleless’ mode (pr#34407, Sage Weil)
- bluestore,core: common/options: Disable bluefs_buffered_io by default again (pr#34353, Mark Nelson)
- bluestore: os/bluestore: Don’t pollute old journal when add new device (pr#34795, Yang Honggang)
- bluestore: os/bluestore: fix ‘unused’ calculation (pr#34793, Igor Fedotov, xie xingguo)
- bluestore: os/bluestore: open DB in read-only when expanding DB/WAL (pr#34610, Adam Kupczyk, Igor Fedotov)
- build/ops: rpm: add python3-saml as install dependency (pr#34474, Ernesto Puerta)
- build/ops: rpm: drop “is_opensuse” conditional in SUSE-specific bcond block (pr#34790, Nathan Cutler)
- build/ops: spec: address some warnings raised by RPM 4.15.1 (pr#34526, Nathan Cutler)
- cephfs,mgr: mgr/volumes: Add interface to get subvolume metadata (pr#34681, Kotresh HR)
- cephfs,mgr: mgr: force purge normal ceph entities from service map (issue#44677, pr#34800, Venky Shankar)
- cephfs,tools: cephfs-journal-tool: correctly parse –dry_run argument (pr#34804, Milind Changire)
- cephfs,tools: tools/cephfs: add accounted_rstat/rstat when building file dentry (pr#34803, Xiubo Li)
- cephfs: ceph-fuse: link to libfuse3 and pass -o big_writes to libfuse if libfuse < 3.0.0 (pr#34769, Xiubo Li, “Yan, Zheng”, Kefu Chai)
- cephfs: client: reset requested_max_size if file write is not wanted (pr#34766, “Yan, Zheng”)
- cephfs: mds: fix ‘if there is lock cache on dir’ check (pr#34273, “Yan, Zheng”)
- cephfs: mon/FSCommands: Fix ‘add_data_pool’ command and ‘fs new’ command (pr#34775, Ramana Raja)
- cephfs: qa: install task runs twice with double unwind causing fatal errors (pr#34912, Patrick Donnelly)
- core,mon: mon/OSDMonitor: allow trimming maps even if osds are down (pr#34924, Joao Eduardo Luis)
- core: ceph-object-corpus: update to octopus (pr#34797, Josh Durgin)
- core: mgr/DaemonServer: fetch metadata for new daemons (e.g., mons) (pr#34416, Sage Weil)
- core: mon/OSDMonitor: Always tune priority cache manager memory on all mons (pr#34917, Sridhar Seshasayee)
- core: mon: calculate min_size on osd pool set size (pr#34528, Deepika Upadhyay)
- core: osd/PeeringState: do not trim pg log past last_update_ondisk (pr#34807, xie xingguo, Samuel Just)
- core: osd/PrimaryLogPG: fix SPARSE_READ stat (pr#34809, Yan Jun)
- doc: cephadm: Batch backport April (1) (pr#34554, Matthew Oliver, Sage Weil, Sebastian Wagner, Michael Fritch, Tim, Jeff Layton, Juan Miguel Olmo Martínez, Joshua Schmid)
- doc: cephadm: Batch backport April (2) (issue#45029, pr#34687, Maran Hidskes, Kiefer Chang, Matthew Oliver, Sebastian Wagner, Andreas Haase, Tim Serong, Zac Dover, Michael Fritch, Joshua Schmid)
- doc: cephadm: Batch backport April (3) (pr#34742, Sebastian Wagner, Dimitri Savineau, Michael Fritch)
- doc: cephadm: batch backport March (pr#34438, Jan Fajerski, Sebastian Wagner, Daniel-Pivonka, Michael Fritch, Sage Weil)
- doc: doc/releases/nautilus: restart OSDs to make them bind to v2 addr (pr#34523, Nathan Cutler)
- mgr: mgr/PyModule: fix missing tracebacks in handle_pyerror() (pr#34626, Tim Serong)
- mgr: mgr/telegraf: catch FileNotFoundError exception (pr#34629, Kefu Chai)
- pybind,rbd: pybind/rbd: ensure image is open before permitting operations (pr#34425, Mykola Golub)
- pybind,rbd: pybind/rbd: fix no lockers are obtained, ImageNotFound exception will be output (pr#34387, zhangdaolong)
- rbd,tests: tests: update unmap.t for table spacing changes (pr#34819, Ilya Dryomov)
- rbd: rbd-mirror: improved replication statistics (pr#34810, Mykola Golub, Jason Dillaman)
- rbd: rbd: ignore tx-only mirror peers when adding new peers (pr#34638, Jason Dillaman)
- rgw: radosgw-admin: add support for –bucket-id in bucket stats command (pr#34816, Vikhyat Umrao)
- rgw: Disable prefetch of entire head object when GET request with range header (pr#34826, Or Friedmann)
- rgw: pubsub sync module ignores ERR_USER_EXIST (pr#34825, Casey Bodley)
- rgw: reshard: skip stale bucket id entries from reshard queue (pr#34734, Abhishek Lekshmanan)
- rgw: use DEFER_DROP_PRIVILEGES flag unconditionally (pr#34731, Casey Bodley)
