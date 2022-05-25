---
title: "v0.67.5 Dumpling released"
date: "2013-12-22"
author: "sage"
tags: 
  - "release"
  - "dumpling"
---

This release includes a few critical bug fixes for the radosgw, including a fix for hanging operations on large objects. There are also several bug fixes for radosgw multi-site replications, and a few backported features. Also, notably, the ‘osd perf’ command (which dumps recent performance information about active OSDs) has been backported.

We recommend that all 0.67.x Dumpling users upgrade.

Notable changes:

- ceph-fuse: fix crash in caching code
- mds: fix looping in populate\_mydir()
- mds: fix standby-replay race
- mon: accept ‘osd pool set …’ as string
- mon: backport: ‘osd perf’ command to dump recent OSD performance stats
- osd: add feature compat check for upcoming object sharding
- rbd.py: increase parent name size limit
- rgw: backport: allow wildcard in supported keystone roles
- rgw: backport: improve swift COPY behavior
- rgw: backport: log and open admin socket by default
- rgw: backport: validate S3 tokens against keystone
- rgw: fix bucket removal
- rgw: fix client error code for chunked PUT failure
- rgw: fix hang on large object GET
- rgw: fix rare use-after-free
- rgw: various DR bug fixes
- sysvinit, upstart: prevent starting daemons using both init systems

Please see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.67.5.txt) for more details.

You can get v0.67.5 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.67.5.tar.gz](http://ceph.com/download/ceph-0.67.5.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-67-5-dumpling-released/&bvt=rss&p=wordpress)
