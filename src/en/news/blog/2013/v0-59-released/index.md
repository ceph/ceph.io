---
title: "v0.59 released"
date: "2013-03-21"
author: "sage"
tags: 
---

Another sprint and another release! This one is delayed a day or two due to power issues in our data center. The most exciting bit here is a big refactor in the monitor that has finally landed (thanks go to Joao Luis), but there is lots of other good stuff to go around:

- mon: rearchitected to utilize single instance of paxos and a key/value store (Joao Luis)
- mon: new ‘ceph df \[detail\]‘ command
- osd: support for improved hashing of PGs across OSDs via HASHPSPOOL pool flag and feature
- osd: refactored watch/notify infrastructure (fixes protocol, removes many bugs) (Sam Just)
- osd, librados: ability to list watchers (David Zafman)
- osd, librados: new listsnaps command (David Zafman)
- osd: trim log more aggressively, avoid appearance of leak memory
- osd: misc split fixes (Sam Just)
- osd: a few journaling bug fixes (Sam Just)
- osd: connection handling bug fixes
- rbd: avoid FIEMAP when importing from file (it can be buggy) (Josh Durgin)
- librados: fix linger bugs (Josh Durgin)
- librbd: fixed flatten deadlock (Josh Durgin)
- rgw: fixed >4MB range requests (Jan Harkes)
- rgw: fix log rotation
- mds: allow xattrs on root
- ceph-fuse: fix statfs(2) reporting
- msgr: optionally tune TCP buffer size to avoid throughput collapse (Jim Schutt)
- consume less memory for logging by default
- always use system leveldb (Gary Lowell)

When upgrading, try to avoid leaving mixed monitor versions for long periods of time; see the [release notes](http://ceph.com/docs/master/release-notes/#v0-59) for more details.

WARNING: We noticed just as this went out that the librados headers are broken and the fix just missed the build.  We’ll do a point release if anybody needs it.

In other news, the [ceph-cookbooks for Chef](http://github.com/ceph/ceph-cookbooks) just got a long-overdue update. If you are a Chef user, please take a look at the updated repo on github and let us know what you think (or better yet start sending your pull requests our way).

I should also mention that, although you don’t see much action here, Caleb and Yehuda are hard at work on the multi-site, disaster recovery, and API features for radosgw.

You can get v0.59 from the usual places:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.59.tar.gz](http://ceph.com/download/ceph-0.59.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-59-released/&bvt=rss&p=wordpress)
