---
title: "v0.80.4 Firefly released"
date: "2014-07-15"
author: "sage"
---

This Firefly point release fixes an potential data corruption problem when ceph-osd daemons run on top of XFS and service Firefly librbd clients. A recently added allocation hint that RBD utilizes triggers an XFS bug on some kernels (Linux 3.2, and likely others) that leads to data corruption and deep-scrub errors (and inconsistent PGs). This release avoids the situation by disabling the allocation hint until we can validate which kernels are affected and/or are known to be safe to use the hint on.

We recommend that all v0.80.x Firefly users urgently upgrade, especially if they are using RBD.

### NOTABLE CHANGES

- osd: disable XFS extsize hint by default (#8830, Samuel Just)
- rgw: fix extra data pool default name (Yehuda Sadeh)

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.80.4.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.80.4.tar.gz](http://ceph.com/download/ceph-0.80.4.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
