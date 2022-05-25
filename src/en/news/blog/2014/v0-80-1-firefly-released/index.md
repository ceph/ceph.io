---
title: "v0.80.1 Firefly released"
date: "2014-05-12"
author: "sage"
tags:
  - "release"
  - "firefly"
---

This first Firefly point release fixes a few bugs, the most visible being a problem that prevents scrub from completing in some cases.

### NOTABLE CHANGES

- osd: revert incomplete scrub fix (Samuel Just)
- rgw: fix stripe calculation for manifest objects (Yehuda Sadeh)
- rgw: improve handling, memory usage for abort reads (Yehuda Sadeh)
- rgw: send Swift user manifest HTTP header (Yehuda Sadeh)
- libcephfs, ceph-fuse: expose MDS session state via admin socket (Yan, Zheng)
- osd: add simple throttle for snap trimming (Sage Weil)
- monclient: fix possible hang from ill-timed monitor connection failure (Sage Weil)
- osd: fix trimming of past HitSets (Sage Weil)
- osd: fix whiteouts for non-writeback cache modes (Sage Weil)
- osd: prevent divide by zero in tiering agent (David Zafman)
- osd: prevent busy loop when tiering agent can do no work (David Zafman)

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.80.1.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.80.1.tar.gz](http://ceph.com/download/ceph-0.80.1.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
