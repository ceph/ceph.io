---
title: "v0.21.3 released"
date: "2010-09-18"
author: "sage"
tags: 
---

The v0.21.3 release is out.  Changes since v0.21.2 include:

- cfuse: fix readdir for large directories
- cfuse: fixed truncation (now passes fsx)
- radosgw: fixed some info leakage between users
- radosgw: support wildcard dns for bucketname.domain/object access
- mon: less log noise
- mds: fixed snap bug with directory renames
- mds: fixed journal replay bug with reconnecting clients
- mds: fixed journal replay bug with inconsistent lock state, subsequent crash

Nothing groundbreaking, but v0.21.2 users experiencing any problems should upgrade.

This will likely be the last v0.21 series release; v0.22 is due in about two weeks (see the [roadmap](http://tracker.newdream.net/projects/ceph/roadmap)).

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.21.3.tar.gz](http://ceph.newdream.net/download/ceph-0.21.3.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-21-3-released/&bvt=rss&p=wordpress)
