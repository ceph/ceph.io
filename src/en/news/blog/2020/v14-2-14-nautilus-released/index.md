---
title: "v14.2.14 Nautilus released"
date: "2020-11-19"
author: "TheAnalyst"
---

This is the 14th backport release in the Nautilus series. This releases fixes a security flaw affecting Messenger V2 for Octopus & Nautilus, among other fixes across components. We recommend users to update to this release.

## Notable Changes

- CVE 2020-25660: Fix a regression in Messenger V2 replay attacks
    

## Changelog

- mgr/dashboard: Strange iSCSI discovery auth behavior ([pr#37333](https://github.com/ceph/ceph/pull/37333), Volker Theile)
    
- mgr/dashboard: redirect to original URL after successful login ([pr#36834](https://github.com/ceph/ceph/pull/36834), Avan Thakkar)
    
- mgr/prometheus: add pool compression stats ([pr#37563](https://github.com/ceph/ceph/pull/37563), Paul Cuzner)
    
- bluestore: test/objectstore/store\_test: kill ExcessiveFragmentation test case ([pr#37824](https://github.com/ceph/ceph/pull/37824), Igor Fedotov)
    
- bluestore: BlockDevice.cc: use pending\_aios instead of iovec size as ios num ([pr#37823](https://github.com/ceph/ceph/pull/37823), weixinwei)
    
- bluestore: Support flock retry ([pr#37842](https://github.com/ceph/ceph/pull/37842), Kefu Chai, wanghongxu)
    
- bluestore: attach csum for compressed blobs ([pr#37843](https://github.com/ceph/ceph/pull/37843), Igor Fedotov)
    
- osdc/ObjectCacher: overwrite might cause stray read request callbacks ([pr#37813](https://github.com/ceph/ceph/pull/37813), Jason Dillaman)
    
- mgr: avoid false alarm of MGR\_MODULE\_ERROR ([pr#38069](https://github.com/ceph/ceph/pull/38069), Kefu Chai, Sage Weil)
    
- mgr: fix race between module load and notify ([pr#37844](https://github.com/ceph/ceph/pull/37844), Mykola Golub, Patrick Donnelly)
    
- mon: set session\_timeout when adding to session\_map ([pr#37554](https://github.com/ceph/ceph/pull/37554), Ilya Dryomov)
    
- osd/osd-rep-recov-eio.sh: TEST\_rados\_repair\_warning: return 1 ([pr#37815](https://github.com/ceph/ceph/pull/37815), David Zafman)
    
- rbd: librbd: ignore -ENOENT error when disabling object-map ([pr#37814](https://github.com/ceph/ceph/pull/37814), Jason Dillaman)
    
- rbd: rbd-nbd: don’t ignore namespace when unmapping by image spec ([pr#37811](https://github.com/ceph/ceph/pull/37811), Mykola Golub)
    
- rgw/rgw\_file: Fix the incorrect lru object eviction ([pr#37804](https://github.com/ceph/ceph/pull/37804), luo rixin)
    
- rgw: fix expiration header returned even if there is only one tag in the object the same as the rule ([pr#37806](https://github.com/ceph/ceph/pull/37806), Or Friedmann)
    
- rgw: fix: S3 API KeyCount incorrect return ([pr#37810](https://github.com/ceph/ceph/pull/37810), 胡玮文)
    
- rgw: radosgw-admin should paginate internally when listing bucket ([pr#37802](https://github.com/ceph/ceph/pull/37802), J. Eric Ivancich)
    
- rgw: rgw\_file: avoid long-ish delay on shutdown ([pr#37552](https://github.com/ceph/ceph/pull/37552), Matt Benjamin)
    
- rgw: use yum rather than dnf for teuthology testing of rgw-orphan-list ([pr#37805](https://github.com/ceph/ceph/pull/37805), J. Eric Ivancich)
