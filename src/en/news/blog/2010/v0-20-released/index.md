---
title: "v0.20 released"
date: "2010-04-30"
author: "sage"
tags: 
---

After a long few weeks of debugging, we’re releasing v0.20.  The goal here is to get something out prior to the v2.6.34 kernel release (which includes the Ceph client) with most of the pending improvements.  Changes since v0.19 include:

- osd: new filestore, journaling infrastructure.  (lower latency writes, btrfs no longer strictly required)
- msgr: wire protocol improvements
- mds: reduced memory utilization (still more to do!)
- auth: many auth\_x cleanups and improvements
- librados: some cleanup; C++ API now usable
- many bug fixes throughout

There are a handful of bugs that we’ve seen but haven’t been able to reproduce reliably.  As those are fixed there will be a v0.20.1 point release.  In the meantime, work continues on v0.21.  Upcoming changes include:

- performance improvements
- rbd: rados block device (kvm and native linux drivers)
- flock/fnctl lock support
- lazy io
- allow client reconnect even after mds has restarted (useful for clients temporarily disconnected during mds restarts)
- cluster mds fixes

To get it:

- Direct download at [http://ceph.newdream.net/download/ceph-0.20.tar.gz](http://ceph.newdream.net/download/ceph-0.20.tar.gz)
- For Debian packages see [http://ceph.newdream.net/wiki/Debian](http://ceph.com/wiki/Debian)

RPMs will be included in the soon to be released Fedora 13.  There is also a ceph.spec file in git to build your own.

