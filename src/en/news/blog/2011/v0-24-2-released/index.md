---
title: "v0.24.2 released"
date: "2011-01-25"
author: "sage"
tags: 
---

This is a bugfix release.  Changes since v0.24.1 include:

- osd: fix journal ordering bug (crash)
- osd: fix long sync delay
- osd: don’t overflow journal size
- osd: snapshot trimming bugs
- osd: fix msgr connection issues after osd restart
- osd: don’t crash on no-journal case
- mds: fix double-pinning of stray inodes (crash)
- mds: don’t block signals after restart
- mds: fix journaling of root inode layout policy
- mds: fix journal dump
- mds: C\_Gather locking fix
- msgr: fix connection cleanup on non-daemons
- monclinet: fix locking

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.24.2.tar.gz](http://ceph.newdream.net/download/ceph-0.24.2.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-24-2-released/&bvt=rss&p=wordpress)
