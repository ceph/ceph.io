---
title: "v14.2.19 Nautilus released"
date: "2021-03-30"
author: "dgalloway"
tags:
  - "release"
  - "nautilus"
---

This is the 19th update to the Ceph Nautilus release series. This is a hotfix release to prevent daemons from binding to loopback network interfaces. All nautilus users are advised to upgrade to this release.

## Notable Changes

- This release fixes a regression introduced in v14.2.17 whereby in certain environments, OSDs will bind to 127.0.0.1. See [https://tracker.ceph.com/issues/49938](https://tracker.ceph.com/issues/49938).
    

## Changelog

- common/ipaddr: also skip just `lo` ([pr#40423](https://github.com/ceph/ceph/pull/40423), Dan van der Ster)
