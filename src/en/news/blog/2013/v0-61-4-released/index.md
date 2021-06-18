---
title: "v0.61.4 released"
date: "2013-06-20"
author: "sage"
tags: 
---

We have resolved a number of issues that v0.61.x Cuttlefish users have been hitting and have prepared another point release, v0.61.4.  This release fixes a rare data corruption during power cycle when using the XFS file system, a few monitor sync problems, several issues with ceph-disk and ceph-deploy on RHEL/CentOS, and a problem with OSD memory utilization during scrub.

Notable changes include:

- mon: fix daemon exit behavior when error is encountered on startup
- mon: more robust sync behavior
- osd: do not use sync\_file\_range(2), posix\_fadvise(…DONTNEED) (can cause data corruption on power loss on XFS)
- osd: avoid unnecessary log rewrite (improves peering speed)
- osd: fix scrub efficiency bug (problematic on old clusters)
- rgw: fix listing objects that start with underscore
- rgw: fix deep URI resource, CORS bugs
- librados python binding: fix truncate on 32-bit architectures
- ceph-disk: fix udev rules
- rpm: install sysvinit script on package install
- ceph-disk: fix OSD start on machine reboot on Debian wheezy
- ceph-disk: activate OSD when journal device appears second
- ceph-disk: fix various bugs on RHEL/CentOS 6.3
- ceph-disk: add ‘zap’ command
- ceph-disk: add ‘\[un\]suppress-activate’ command for preparing spare disks
- upstart: start on runlevel \[2345\] (instead of after the first network interface starts)
- ceph-fuse, libcephfs: handle mds session reset during session open
- ceph-fuse, libcephfs: fix two capability revocation bugs
- ceph-fuse: fix thread creation on startup
- all daemons: create /var/run/ceph directory on startup if missing

Please see the [full release notes](http://ceph.com/docs/master/release-notes/#v0-61-4-cuttlefish).

You can get v0.61.4 from the usual places:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.61.4.tar.gz](http://ceph.com/download/ceph-0.61.4.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-61-4-released/&bvt=rss&p=wordpress)
