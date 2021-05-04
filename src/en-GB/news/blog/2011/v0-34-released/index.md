---
title: "v0.34 released"
date: "2011-08-27"
author: "sage"
tags: 
  - "planet"
---

Another 2 weeks, another release. Notable changes in v0.34:

- radosgw: atomic GET and PUT (and some groundwork for supporting versioning)
- librados: API tests
- mon: fix for data corruption for certain crashes
- cfuse/libceph: many many many bug fixes
- osd: fix for various races during pool/pg creation
- osd: fix for a few peering crashes
- mds: misc fixes

For v0.35 the focus remains on testing and stability. The FileStore changes should land in the next release, and will include an on-disk format change and a slightly-manual upgrade process (sorry!). These will let the object store efficiently scale pool sizes (PG counts). Eventually automatically. There is also work on RBD, librbd, libvirt, collectd plugins, and of course ongoing improvements to radosgw.

We’re having an increasingly difficult time breaking the OSDs, cfuse, and a (single-node) MDS. Any bug reports are most welcome!

We’ve also been working on some Chef cookbooks internally, and hope to share those in the next couple weeks.

Where to get v0.34:

- Git at: [git://ceph.newdream.net/git/ceph.git](git://ceph.newdream.net/git/ceph.git)
- Tarball at: [http://ceph.newdream.net/downloads/ceph-0.34.tar.gz](http://ceph.newdream.net/downloads/ceph-0.34.tar.gz)
- For Debian/Ubuntu packages see: [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

