---
title: "v0.94.1 Hammer released"
date: "2015-04-13"
author: "sage"
tags:
  - "release"
  - "hammer"
---

This bug fix release fixes a few critical issues with CRUSH. The most important addresses a bug in feature bit enforcement that may prevent pre-hammer clients from communicating with the cluster during an upgrade. This only manifests in some cases (for example, when the ‘rack’ type is in use in the CRUSH map, and possibly other cases), but for safety we strongly recommend that all users use 0.94.1 instead of 0.94 when upgrading.

There is also a fix in the new straw2 buckets when OSD weights are 0.

We recommend that all v0.94 users upgrade.

### NOTABLE CHANGES

- crush: fix divide-by-0 in straw2 (#11357 Sage Weil)
- crush: fix has\_v4\_buckets (#11364 Sage Weil)
- osd: fix negative degraded objects during backfilling (#7737 Guang Yang)

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.94.1.txt).

 

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.94.1.tar.gz](http://ceph.com/download/ceph-0.94.1.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
