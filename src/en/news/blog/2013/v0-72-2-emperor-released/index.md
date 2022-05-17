---
title: "v0.72.2 Emperor released"
date: "2013-12-22"
author: "sage"
tags: 
  - "release"
  - "emperor"
---

This is the second bugfix release for the v0.72.x Emperor series. We have fixed a hang in radosgw, and fixed (again) a problem with monitor CLI compatiblity with mixed version monitors. (In the future this will no longer be a problem.)

Upgrading:

- The JSON schema for the ‘osd pool set …’ command changed slightly. Please avoid issuing this particular command via the CLI while there is a mix of v0.72.1 and v0.72.2 monitor daemons running.

Changes:

- mon: ‘osd pool set …’ syntax change
- osd: added test for missing on-disk HEAD object
- osd: fix osd bench block size argument
- rgw: fix hang on large object GET
- rgw: fix rare use-after-free
- rgw: various DR bug fixes
- rgw: do not return error on empty owner when setting ACL
- sysvinit, upstart: prevent starting daemons using both init systems

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.72.2.txt).

You can get v0.72.2 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.72.2.tar.gz](http://ceph.com/download/ceph-0.72.2.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-72-2-emperor-released/&bvt=rss&p=wordpress)
