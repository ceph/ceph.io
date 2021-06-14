---
title: "v0.13 released"
date: "2009-08-24"
author: "sage"
tags: 
  - "planet"
---

We’ve made a v0.13 release.  This mostly fixes bugs with v0.12 that have come up over the past couple weeks:

- \[ku\]lcient: fix sync read vs eof, lseek(…, SEEK\_END)
- mds: misc bug fixes for multiclient file access

But also a few other big things:

- osd: stay active during backlog generation
- osdmap: override mappings (pg\_temp)
- kclient: some improvements in kmalloc, memory preallocation

The OSD changes mean that the storage cluster can temporarily delegate authority for a placement group to the node that has the complete data while an index is being generated for recovery (that can take a while). Once that’s ready, control will fall back to the new/correct node and the usual recovery will kick in.

The disk format and wire protocols have changed with this version.

We’re continuing to work on the security infrastructure… hopefully will be ready for v0.14.

Here are the relevant URLs:

- Git tree at [git://ceph.newdream.net/ceph.git](git://ceph.newdream.net/ceph.git)
- Direct download at [http://ceph.newdream.net/download/ceph-0.13.tar.gz](http://ceph.newdream.net/download/ceph-0.13.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v013-released/&bvt=rss&p=wordpress)
