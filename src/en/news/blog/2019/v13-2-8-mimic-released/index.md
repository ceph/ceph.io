---
title: "v13.2.8 Mimic released"
date: "2019-12-13"
author: "TheAnalyst"
tags:
  - "release"
  - "mimic"
---

This is the eighth release in the Ceph Mimic stable release series. Its sole purpose is to fix a regression that found its way into the previous release.

## Notable Changes

- Due to a missed backport, clusters in the process of being upgraded from 13.2.6 to 13.2.7 might suffer an OSD crash in build\_incremental\_map\_msg. This regression was reported in [https://tracker.ceph.com/issues/43106](https://tracker.ceph.com/issues/43106) and is fixed in 13.2.8 (this release). Users of 13.2.6 can upgrade to 13.2.8 directly - i.e., skip 13.2.7 - to avoid this.
    

## Changelog

- osd: fix sending incremental map messages (more) ([issue#43106](https://tracker.ceph.com/issues/43106), [pr#32000](https://github.com/ceph/ceph/pull/32000), Sage Weil)
    
- tests: added missing point release versions ([pr#32087](https://github.com/ceph/ceph/pull/32087), Yuri Weinstein)
    
- tests: rgw: add missing force-branch: ceph-mimic for swift tasks ([pr#32033](https://github.com/ceph/ceph/pull/32033), Casey Bodley)
