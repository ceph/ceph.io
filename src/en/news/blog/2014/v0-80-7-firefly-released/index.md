---
title: "v0.80.7 Firefly released"
date: "2014-10-16"
author: "sage"
---

This release fixes a few critical issues with v0.80.6, particularly with clusters running mixed versions.

We recommend that all v0.80.x Firefly users upgrade to this release.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.80.7.txt).

### NOTABLE CHANGES

- osd: fix invalid memory reference in log trimming (#9731 Samuel Just)
- osd: fix use-after-free in cache tiering code (#7588 Sage Weil)
- osd: remove bad backfill assertion for mixed-version clusters (#9696 Samuel Just)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.80.7.tar.gz](http://ceph.com/download/ceph-0.80.7.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
