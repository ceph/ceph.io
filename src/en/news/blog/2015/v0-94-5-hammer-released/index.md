---
title: "v0.94.5 Hammer released"
date: "2015-11-06"
author: "sage"
---

This Hammer point release fixes a critical regression in librbd that can cause Qemu/KVM to crash when caching is enabled on images that have been cloned.

All v0.94.4 Hammer users are strongly encouraged to upgrade.

### NOTABLE CHANGES

- librbd: potential assertion failure during cache read ([issue#13559](http://tracker.ceph.com/issues/13559), [pr#6348](http://github.com/ceph/ceph/pull/6348), Jason Dillaman)
- osd: osd/ReplicatedPG: remove stray debug line ([issue#13455](http://tracker.ceph.com/issues/13455), [pr#6362](http://github.com/ceph/ceph/pull/6362), Sage Weil)
- tests: qemu workunit refers to apt-mirror.front.sepia.ceph.com ([issue#13420](http://tracker.ceph.com/issues/13420), [pr#6330](http://github.com/ceph/ceph/pull/6330), Yuan Zhou)

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.94.5.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.94.5.tar.gz](http://ceph.com/download/ceph-0.94.5.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
