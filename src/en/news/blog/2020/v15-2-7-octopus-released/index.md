---
title: "v15.2.7 Octopus released"
date: "2020-12-01"
author: "dgalloway"
---

This is the 7th backport release in the Octopus series. This release fixes a serious bug in RGW that has been shown to cause data loss when a read of a large RGW object (i.e., one with at least one tail segment) takes longer than one half the time specified in the configuration option `rgw_gc_obj_min_wait`. The bug causes the tail segments of that read object to be added to the RGW garbage collection queue, which will in turn cause them to be deleted after a period of time.

  

## Changelog

- rgw: during GC defer, prevent new GC enqueue ([pr#38249](https://github.com/ceph/ceph/pull/38249), Eric Ivancich, Casey Bodley)
