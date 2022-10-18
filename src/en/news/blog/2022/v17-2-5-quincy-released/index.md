---
title: "v17.2.5 Quincy released"
date: "2022-10-19"
author: "yuriw"
tags:
  - "release"
  - "quincy"
---

This is a hotfix release that addresses missing commits in the 17.2.4 release.
We recommend that all users update to this release.

Related tracker: https://tracker.ceph.com/issues/57858

## Notable Changes

- A ceph-volume regression introduced in bea9f4b that makes the
  activate process take a very long time to complete has been
  fixed.

  Related tracker: https://tracker.ceph.com/issues/57627

- An exception that occurs with some NFS commands
  in Rook clusters has been fixed.

  Related tracker: https://tracker.ceph.com/issues/55605

- A crash in the Telemetry module that may affect some users opted
  into the perf channel has been fixed.

  Related tracker: https://tracker.ceph.com/issues/57700

## Changelog

- ceph-volume: fix regression in activate ([pr#48201](https://github.com/ceph/ceph/pull/48201), Guillaume Abrioux)

- mgr/rook: fix error when trying to get the list of nfs services ([pr#48199](https://github.com/ceph/ceph/pull/48199), Juan Miguel Olmo)

- mgr/telemetry: handle daemons with complex ids ([pr#48283](https://github.com/ceph/ceph/pull/48283), Laura Flores)

- Revert PR 47901 ([pr#48104](https://github.com/ceph/ceph/pull/48104), Laura Flores)
