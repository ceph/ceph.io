---
title: "v0.51 released"
date: "2012-08-26"
author: "sage"
tags: 
  - "planet"
---

The latest development release v0.51 is ready.  Notable changes include:

- crush: tunables documented; feature bit now present and enforced
- osd: various fixes for out-of-order op replies
- osd: several rare peering cases fixed
- osd: fixed detection of EIO errors from fs on read
- osd: new ‘lock’ rados class for generic object locking
- librbd: fixed memory leak on discard
- librbd: image layering/cloning
- radosgw: fix range header for large objects, ETag quoting, GMT dates, other compatibility fixes
- mkcephfs: fix for default keyring, osd data/journal locations
- wireshark: ceph protocol dissector patch updated
- ceph.spec: fixed packaging problem with crush headers

Full RBD cloning support will be in place in v0.52, as will a refactor of the messenger code with many bug fixes in the socket failure handling.  This is available for testing now in ‘next’ for the adventurous.  Improved OSD scrubbing is also coming soon.  We should (finally) be building some release RPMs for v0.52 as well.

You can get v0.51 from the usual locations:

- Git at git://[github.com/ceph/ceph](http://github.com/ceph/ceph).git
- Tarball at [http://ceph.newdream.net/download/ceph-0.51.tar.gz](http://ceph.newdream.net/download/ceph-0.51.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/install/debian](http://ceph.newdream.net/docs/master/install/debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-51-released/&bvt=rss&p=wordpress)
