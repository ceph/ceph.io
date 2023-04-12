---
title: "v16.2.11 Pacific released"
date: "2023-01-25"
author: "yuriw"
tags:
  - "release"
  - "pacific"
---

This is a hotfix release that resolves several performance flaws in ceph-volume,
particularly during osd activation (https://tracker.ceph.com/issues/57627)

## Notable Changes

## Changelog

- ceph-volume: do not raise RuntimeError in util<span></span>.lsblk ([pr#50145](https://github.com/ceph/ceph/pull/50145), Guillaume Abrioux)

- ceph-volume: fix a bug in get\_all\_devices\_vgs() ([pull#49454](https://github.com/ceph/ceph/pull/49454), Guillaume Abrioux)

- ceph-volume: fix a bug in lsblk\_all() ([pr#49869](https://github.com/ceph/ceph/pull/49869), Guillaume Abrioux)

- ceph-volume: fix issue with fast device allocs when there are multiple PVs per VG ([pr#50878](https://github.com/ceph/ceph/pull/50878), Cory Snyder)

- ceph-volume: fix regression in activate ([pr#50162](https://github.com/ceph/ceph/pull/50162), Guillaume Abrioux)

- ceph-volume: legacy\_encrypted() shouldn't call lsblk() when device is 'tmpfs' ([pull#50162](https://github.com/ceph/ceph/pull/50162), Guillaume Abrioux)

- ceph-volume: update the OS before deploying Ceph (pacific) ([pull#50996](https://github.com/ceph/ceph/pull/50996), Guillaume Abrioux)
