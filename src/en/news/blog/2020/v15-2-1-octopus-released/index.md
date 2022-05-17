---
title: "v15.2.1 Octopus released"
date: "2020-04-09"
author: "TheAnalyst"
tags:
  - "release"
  - "octopus"
---

This is the first bugfix release of Ceph Octopus, we recommend all Octopus users upgrade. This release fixes an upgrade issue and also fixes 2 security issues

## Notable Changes

- issue#44759: Fixed luminous->nautilus->octopus upgrade asserts
- CVE-2020-1759: Fixed nonce reuse in msgr V2 secure mode
- CVE-2020-1760: Fixed XSS due to RGW GetObject header-splitting

## Changelog

- build/ops: fix ceph\_release type to ‘stable’ ([pr#34194](https://github.com/ceph/ceph/pull/34194), Sage Weil)
- build/ops: vstart\_runner.py: fix OSError when checking if non-existent path is mounted ([pr#34132](https://github.com/ceph/ceph/pull/34132), Alfonso Martínez)
- cephadm: Add alertmanager adopt ([pr#34157](https://github.com/ceph/ceph/pull/34157), Eric Jackson)
- cephadm: Add alertmanager sample ([pr#34158](https://github.com/ceph/ceph/pull/34158), Eric Jackson)
- cephadm: Fix truncated output of “ceph mgr dump” ([pr#34258](https://github.com/ceph/ceph/pull/34258), Sebastian Wagner)
- mgr/cephadm: Add example to run when debugging ssh failures ([pr#34153](https://github.com/ceph/ceph/pull/34153), Sebastian Wagner)
- mgr/cephadm: DriveGroupSpec needs to support/ignore \_unmanaged\_ ([pr#34185](https://github.com/ceph/ceph/pull/34185), Joshua Schmid)
- mgr/cephadm: bind grafana to all interfaces ([pr#34191](https://github.com/ceph/ceph/pull/34191), Sage Weil)
- mgr/cephadm: fix ‘orch ps –refresh’ ([pr#34190](https://github.com/ceph/ceph/pull/34190), Sage Weil)
- mgr/cephadm: fix ‘upgrade start’ message when specifying a version ([pr#34186](https://github.com/ceph/ceph/pull/34186), Sage Weil)
- mgr/cephadm: include alerts in prometheus deployment ([pr#34155](https://github.com/ceph/ceph/pull/34155), Sage Weil)
- mgr/cephadm: point alertmanager at all mgr/dashboard URLs ([pr#34154](https://github.com/ceph/ceph/pull/34154), Sage Weil)
- mgr/cephadm: provision nfs-ganesha via orchestrator ([pr#34192](https://github.com/ceph/ceph/pull/34192), Michael Fritch)
- mgr/dashboard: Check for missing npm resolutions ([pr#34202](https://github.com/ceph/ceph/pull/34202), Tiago Melo)
- mgr/dashboard: NoRebalance flag is added to the Dashboard ([pr#33939](https://github.com/ceph/ceph/pull/33939), Nizamudeen)
- mgr/dashboard: correct Orchestrator documentation link ([pr#34212](https://github.com/ceph/ceph/pull/34212), Tatjana Dehler)
- mgr/dashboard: do not fail on user creation (CLI) ([pr#34280](https://github.com/ceph/ceph/pull/34280), Tatjana Dehler)
- mgr/orch: allow list daemons by service\_name ([pr#34160](https://github.com/ceph/ceph/pull/34160), Kiefer Chang)
- mgr/prometheus: ceph\_pg\_\* metrics contains last value instead of sum across all reported states ([pr#34163](https://github.com/ceph/ceph/pull/34163), Jacek Suchenia)
- mgr/rook: Blinking lights ([pr#34199](https://github.com/ceph/ceph/pull/34199), Juan Miguel Olmo Martínez)
- osd/PeeringState: drop mimic assert ([pr#34204](https://github.com/ceph/ceph/pull/34204), Sage Weil)
- osd/PeeringState: fix pending want\_acting vs osd offline race ([pr#34123](https://github.com/ceph/ceph/pull/34123), xie xingguo)
- pybind/mgr: fix config\_notify handling of default values ([pr#34178](https://github.com/ceph/ceph/pull/34178), Nathan Cutler)
- rbd: librbd: fix client backwards compatibility issues ([issue#39450](http://tracker.ceph.com/issues/39450), [issue#38834](http://tracker.ceph.com/issues/38834), [pr#34323](https://github.com/ceph/ceph/pull/34323), Jason Dillaman)
- tools: ceph-backport.sh: add deprecation warning ([pr#34125](https://github.com/ceph/ceph/pull/34125), Nathan Cutler)
