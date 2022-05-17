---
title: "13.2.4 Mimic released"
date: "2019-01-07"
author: "TheAnalyst"
tags:
  - "release"
  - "mimic"
---

This is the fourth bugfix release of the Mimic v13.2.x long term stable release series. This release includes two security fixes atop of v13.2.3. We recommend that all mimic users upgrade. If you've already upgraded to v13.2.3, the same restrictions from v13.2.2 to v13.2.3 apply here as well.

## Notable Changes

- CVE-2018-16846: rgw: enforce bounds on max-keys/max-uploads/max-parts ([issue#35994](http://tracker.ceph.com/issues/35994))
    - A new param `rgw max listing results` controls the upper bound `max-keys` on Bucket listing operations (ListBucket, ListBucketVersions, ListBucketMultipartUploads(`max-uploads`), ListMultipartUploadParts(`max-parts`)

- CVE-2018-14662: mon: limit caps allowed to access the config store

### Notable Changes in v13.2.3 Mimic

- The default memory utilization for the mons has been increased somewhat. Rocksdb now uses 512 MB of RAM by default, which should be sufficient for small to medium-sized clusters; large clusters should tune this up. Also, the mon\_osd\_cache\_size has been increase from 10 OSDMaps to 500, which will translate to an additional 500 MB to 1 GB of RAM for large clusters, and much less for small clusters.
- Ceph v13.2.2 includes a wrong backport, which may cause mds to go into ‘damaged’ state when upgrading Ceph cluster from previous version. The bug is fixed in v13.2.3. If you are already running v13.2.2, upgrading to v13.2.3 does not require special action.
- The bluestore\_cache\_\* options are no longer needed. They are replaced by osd\_memory\_target, defaulting to 4GB. BlueStore will expand and contract its cache to attempt to stay within this limit. Users upgrading should note this is a higher default than the previous bluestore\_cache\_size of 1GB, so OSDs using BlueStore will use more memory by default. For more details, see the [BlueStore docs](http://docs.ceph.com/docs/mimic/rados/configuration/bluestore-config-ref/#automatic-cache-sizing).
- This version contains an upgrade bug, [http://tracker.ceph.com/issues/36686](http://tracker.ceph.com/issues/36686), due to which upgrading during recovery/backfill can cause OSDs to fail. This bug can be worked around, either by restarting all the OSDs after the upgrade, or by upgrading when all PGs are in “active+clean” state. If you have already successfully upgraded to 13.2.2, this issue should not impact you. Going forward, we are working on a clean upgrade path for this feature.

## Changelog

- CVE-2018-16846: rgw: enforce bounds on max-keys/max-uploads/max-parts ([issue#35994](http://tracker.ceph.com/issues/35994))
- CVE-2018-14662: mon: limit caps allowed to access the config store

For the rest of the changes in v13.2.3 please refer to the [v13.2.3 release blog entry](https://ceph.com/releases/13-2-3-mimic-released/)
