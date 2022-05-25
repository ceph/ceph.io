---
title: "v0.67.11 Dumpling released"
date: "2014-09-25"
author: "sage"
tags:
  - "release"
  - "dumpling"
---

This stable update for Dumpling fixes several important bugs that affect a small set of users.

We recommend that all Dumpling users upgrade at their convenience. If none of these issues are affecting your deployment there is no urgency.

### NOTABLE CHANGES

- common: fix sending dup cluster log items (#9080 Sage Weil)
- doc: several doc updates (Alfredo Deza)
- libcephfs-java: fix build against older JNI headesr (Greg Farnum)
- librados: fix crash in op timeout path (#9362 Matthias Kiefer, Sage Weil)
- librbd: fix crash using clone of flattened image (#8845 Josh Durgin)
- librbd: fix error path cleanup when failing to open image (#8912 Josh Durgin)
- mon: fix crash when adjusting pg\_num before any OSDs are added (#9052 Sage Weil)
- mon: reduce log noise from paxos (Aanchal Agrawal, Sage Weil)
- osd: allow scrub and snap trim thread pool IO priority to be adjusted (Sage Weil)
- osd: fix mount/remount sync race (#9144 Sage Weil)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.67.11.tar.gz](http://ceph.com/download/ceph-0.67.11.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
