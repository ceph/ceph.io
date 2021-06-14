---
title: "v0.24 released"
date: "2010-12-21"
author: "sage"
tags: 
  - "planet"
---

We’ve released v0.24, just in time for the holidays!  Big changes this time around include:

- mds: many fixes with clustered failure recovery
- mds: bloom filter to reduce directory reads
- mds: configurable directory hash functions (for fragmentation)
- rbd: import/export tools are smart about holes (i.e., use FIEMAP)
- osd: many recovery improvements, mostly making data available more quickly
- osd: automatic background scrubbing when load is low
- osd: fixes with dedicated backend replication network
- osd: use new (2.6.37) btrfs ioctls for async snapshot creation
- replaced openssl dependency with libcrypto++ (licensing issue)
- librados: “zero-copy” reads
- misc bug fixes, man pages, and code cleanup

The focus for the next release (v0.25) is on OSD and MDS stability, directory fragmentation recovery, and fsck preliminaries; see [the roadmap](http://tracker.newdream.net/projects/ceph/roadmap) for more details.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.24.tar.gz](http://ceph.newdream.net/download/ceph-0.24.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/uncategorized/v0-24-released/&bvt=rss&p=wordpress)
