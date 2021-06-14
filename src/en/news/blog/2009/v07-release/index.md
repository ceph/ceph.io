---
title: "v0.7 release"
date: "2009-03-10"
author: "sage"
tags: 
---

I’ve tagged a v0.7 release.  Probably the biggest change in this release (aside from the usual bug fixes and performance improvements) is the new start/stop and configuration framework.  Notably, the entire cluster configuration can be described by a single cluster.conf file that is shared by all nodes (distributed via scp or NFS or whatever) and used for mkfs, startup, and shutdown.

New in v0.7:

- smart osd ‘sync’ behavior
- osd bug fixes
- fast truncate strategy
- improved start/stop scripts
- new cluster configuration framework

Source tarballs are at [http://ceph.newdream.net/download](http://ceph.newdream.net/download), debian packages are at http://ceph.newdream.net/debian, and the source repository can be [cloned via git](http://ceph.newdream.net/wiki/Checking_out).

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v07-release/&bvt=rss&p=wordpress)
