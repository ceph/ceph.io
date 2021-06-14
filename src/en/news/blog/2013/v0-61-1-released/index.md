---
title: "v0.61.1 released"
date: "2013-05-09"
author: "sage"
tags: 
---

This release is a small update to Cuttlefish that fixes a problem when upgrading a bobtail cluster that had snapshots. Please use this instead of v0.61 if you are upgrading to avoid possible ceph-osd daemon crashes. There is also fix for a problem deploying monitors and generating new authentication keys.

Notable changes:

- osd: handle upgrade when legacy snap collections are present; repair from previous failed restart
- ceph-create-keys: fix race with ceph-mon startup (which broke ‘ceph-deploy gatherkeys …’)
- ceph-create-keys: gracefully handle bad response from ceph-osd
- sysvinit: do not assume default osd\_data when automatically weighting OSD
- osd: avoid crash from ill-behaved classes using getomapvals
- debian: fix squeeze dependency
- mon: debug options to log or dump leveldb transactactions

You can get v0.61.1 from the usual places:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.61.1.tar.gz](http://ceph.com/download/ceph-0.61.1.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-1-released/&bvt=rss&p=wordpress)
