---
title: "v0.28.2 released"
date: "2011-05-29"
author: "sage"
tags: 
---

We’ve tagged v0.28.2, which includes several bugs fixed over the past week.  These include:

- mds: crash on unlink (uninitialized variable)
- mds: fix for multiclient writer vs stat hang
- mds: tolerate ENOENT on journal prezeroing
- osd: disable automatic marking of objects as lost (paranoia)
- osd: fix race on pg activation (crash)
- mkcephfs: fix for mon setup

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.28.2.tar.gz](http://ceph.newdream.net/download/ceph-0.28.2.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

