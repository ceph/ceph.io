---
title: "v18.2.6 Reef released"
date: "2025-04-21"
author: "Yuri Weinstein"
tags:
  - "release"
  - "reef"
---

This is the sixth backport (hotfix) release in the Reef series. We recommend that all users update to this release.

## Notable Changes

- ceph-volume: A bug related to cryptsetup version handling has been fixed.

  Related tracker: https://tracker.ceph.com/issues/66393

- RADOS: A bug related to IPv6 support is now fixed.

  Related tracker: https://tracker.ceph.com/issues/67517

## Changelog

- ceph-volume: fix regex usage in `set_dmcrypt_no_workqueue` ([pr#62791](https://github.com/ceph/ceph/pull/62791), Matt1360)

- common/pick_address: Add IPv6 support to `is_addr_in_subnet` ([pr#62814](https://github.com/ceph/ceph/pull/62814), rzarzynski)
