---
title: "v12.2.4 Luminous Released"
date: "2018-02-28"
author: "TheAnalyst"
---

This is the fourth bugfix release of Luminous v12.2.x long term stable release series. This was primarily intended to fix a few build, ceph-volume/ceph-disk and RGW issues. We recommend all the users of 12.2.x series to update.

### Notable Changes

- ceph-volume: adds support to zap encrypted devices ([issue#22878](http://tracker.ceph.com/issues/22878), [pr#20545](https://github.com/ceph/ceph/pull/20545), Andrew Schoen)
- ceph-volume: log the current running command for easier debugging ([issue#23004](http://tracker.ceph.com/issues/23004), [pr#20597](https://github.com/ceph/ceph/pull/20597), Andrew Schoen)
- ceph-volume: warn on mix of filestore and bluestore flags ([issue#23003](http://tracker.ceph.com/issues/23003), [pr#20568](https://github.com/ceph/ceph/pull/20568), Alfredo Deza)
- cmake: check bootstrap.sh instead before downloading boost ([issue#23071](http://tracker.ceph.com/issues/23071), [pr#20515](https://github.com/ceph/ceph/pull/20515), Kefu Chai)
- core: Backport of cache manipulation: issues #22603 and #22604 ([issue#22604](http://tracker.ceph.com/issues/22604), [issue#22603](http://tracker.ceph.com/issues/22603), [pr#20353](https://github.com/ceph/ceph/pull/20353), Adam C. Emerson)
- core: last-stat-seq returns 0 because osd stats are cleared ([issue#23093](http://tracker.ceph.com/issues/23093), [pr#20548](https://github.com/ceph/ceph/pull/20548), Sage Weil, David Zafman)
- core: Snapset inconsistency is detected with its own error ([issue#22996](http://tracker.ceph.com/issues/22996), [pr#20501](https://github.com/ceph/ceph/pull/20501), David Zafman)
- rgw: make init env methods return an error ([issue#23039](http://tracker.ceph.com/issues/23039), [pr#20564](https://github.com/ceph/ceph/pull/20564), Abhishek Lekshmanan)
- rgw: parse old rgw\_obj with namespace correctly ([issue#22982](http://tracker.ceph.com/issues/22982), [pr#20566](https://github.com/ceph/ceph/pull/20566), Yehuda Sadeh)
- rgw: return valid Location element, CompleteMultipartUpload ([issue#22655](http://tracker.ceph.com/issues/22655), [pr#20266](https://github.com/ceph/ceph/pull/20266), Matt Benjamin)
- rgw: URL-decode S3 and Swift object-copy URLs ([issue#22121](http://tracker.ceph.com/issues/22121), [issue#22729](http://tracker.ceph.com/issues/22729), [pr#20236](https://github.com/ceph/ceph/pull/20236), Malcolm Lee, Matt Benjamin)
- rgw: use explicit index pool placement ([issue#22928](http://tracker.ceph.com/issues/22928), [pr#20565](https://github.com/ceph/ceph/pull/20565), Yehuda Sadeh)
- tools: ceph-disk: v12.2.2 unable to create bluestore osd using ceph-disk ([issue#22354](http://tracker.ceph.com/issues/22354), [pr#20563](https://github.com/ceph/ceph/pull/20563), Kefu Chai)
- tools: ceph-objectstore-tool: “$OBJ get-omaphdr” and “$OBJ list-omap” scan all pgs instead of using specific pg ([issue#21327](http://tracker.ceph.com/issues/21327), [pr#20283](https://github.com/ceph/ceph/pull/20283), David Zafman)
