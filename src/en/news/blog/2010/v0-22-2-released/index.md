---
title: "v0.22.2 released"
date: "2010-10-30"
author: "sage"
tags: 
  - "release"
---

v0.22.2 is out with a few minor bug fixes:

- cfuse: fix truncation issue
- osd: fix decoding of legacy (0.21 and earlier) coll\_t (which caused problems for people upgrading)
- osd: handle missing objects on snap reads
- filestore: escape xattr chunk names

Not too much here, but the decoding error would bite anyone upgrading from v0.21.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.22.2.tar.gz](http://ceph.newdream.net/download/ceph-0.22.2.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/uncategorized/v0-22-2-released/&bvt=rss&p=wordpress)
