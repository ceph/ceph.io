---
title: "v18.2.7 Reef released"
date: "2025-05-05"
author: "Yuri Weinstein"
tags:
  - "release"
  - "reef"
---

This is the seventh backport (hotfix) release in the Reef series. We recommend that all users update to this release.

## Notable Changes

This release also includes several other important BlueStore fixes:

- https://github.com/ceph/ceph/pull/62840

- https://github.com/ceph/ceph/pull/62054

- https://github.com/ceph/ceph/pull/62152

## Changelog

- [reef] os/bluestore: fix \_extend\_log seq advance ([pr#61653](https://github.com/ceph/ceph/pull/61653), Pere Diaz Bou)

- blk/kerneldevice: notify\_all only required when discard\_drain wait for condition ([pr#62152](https://github.com/ceph/ceph/pull/62152), Yite Gu)

- os/bluestore: Fix ExtentDecoderPartial::\_consume\_new\_blob ([pr#62054](https://github.com/ceph/ceph/pull/62054), Adam Kupczyk)

- os/bluestore: Fix race in BlueFS truncate / remove ([pr#62840](https://github.com/ceph/ceph/pull/62840), Adam Kupczyk)
