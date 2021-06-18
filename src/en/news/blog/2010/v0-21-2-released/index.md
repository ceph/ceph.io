---
title: "v0.21.2 released"
date: "2010-08-28"
author: "sage"
tags: 
---

This is a second bugfix release for the v0.21 series.  Changes include:

- osd: less log noise
- osd: mark down old heartbeat peers
- filejournal: clean up init sequence, less confusing errors on startup
- msgr: fix throttler leak (fixes deadlock)
- osdmaptool: don’t crash on corrupt input
- mds: error to client on invalid opcode
- mds: fix ENOTEMPTY checks on rmdir
- osd: fix race between reads and cloned objects
- auth: fix keyring search path when $HOME not defined
- client: fix xattr writeback
- client: fix snap vs metadata writeback
- osd: fix journal, btrfs throttling
- msgr: fix memory leak on closed connections

Relevant URLs:

- Direct download at [http://ceph.newdream.net/download/ceph-0.21.2.tar.gz](http://ceph.com/download/ceph-0.21.2.tar.gz)
- For Debian packages see [http://ceph.newdream.net/wiki/Debian](http://ceph.com/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/uncategorized/v0-21-2-released/&bvt=rss&p=wordpress)
