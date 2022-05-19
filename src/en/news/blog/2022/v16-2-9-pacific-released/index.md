---
title: "v16.2.9 Pacific released"
date: "2022-05-18"
author: "dgalloway"
tags:
  - "release"
  - "pacific"
---

This is a hotfix release in the Pacific series to address a bug in 16.2.8 that could cause MGRs to deadlock.

## Changelog
- mgr/ActivePyModules.cc: fix cases where GIL is held while attempting to lock mutex ([issue#55687](https://tracker.ceph.com/issues/55687), [pr#46302](https://github.com/ceph/ceph/pull/46302), Cory Snyder)
