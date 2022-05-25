---
title: "v0.73 released"
date: "2013-12-12"
author: "sage"
tags: 
  - "release"
---

This release, the first development release after emperor, includes many bug fixes and a few additional pieces of functionality. The first batch of larger changes will be landing in the next version, v0.74.

Notable changes:

- mon: trim MDSMaps (Joao Eduardo Luis)
- ceph-kvstore-tool: expanded command set and capabilities (Joao Eduardo Luis)
- sysvinit, upstart: prevent both init systems from starting the same daemons (Josh Durgin)
- rgw: fix error setting empty owner on ACLs (Yehuda Sadeh)
- mon: prevent extreme changes in pool pg\_num (Greg Farnum)
- mon: ‘osd dump’ dumps pool snaps as array, not object (Dan Mick)
- mon: take ‘osd pool set …’ value as an int, not string (Joao Eduardo Luis)
- osd: fix object\_info\_t encoding bug from emperor ([\*\*](http://ceph.com/docs/master/release-notes/#id1)[\*\*](http://ceph.com/docs/master/release-notes/#id3)
- mon: allow debug quorum\_{enter,exit} commands via admin socket
- misc portability fixes (Noah Watkins, Christophe Courtaut, Alan Somers, huanjun)
- misc cleanups from coverity (Xing Lin)
- rgw: add ‘status’ command to sysvinit script (David Moreau Simard)
- doc: many many install doc improvements (John Wilkins)
- ceph-crush-location: new hook for setting CRUSH location of osd daemons on start
- mds: fix readdir end check (Zheng Yan)
- rgw: support for password (instead of admin token) for keystone authentication (Christophe Courtaut)
- rgw: optionally defer to bucket ACLs instead of object ACLs (Liam Monahan)
- common: fix aligned buffer allocation (Loic Dachary)
- ceph.spec: fix build dependency (Loic Dachary)
- rbd: add ‘rbdmap’ init script for mapping rbd images on book (Adam Twardowski)
- mds: update old-format backtraces opportunistically (Zheng Yan)

You can get Ceph v0.73 from the usual places:

- Git at [git://github.com/ceph/ceph](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.73.tar.gz](http://ceph.com/download/ceph-0.73.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages/](http://ceph.com/docs/master/install/get-packages/)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy/](http://ceph.com/docs/master/install/install-ceph-deploy/)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-73-released/&bvt=rss&p=wordpress)
