---
title: "v0.42 released"
date: "2012-02-20"
author: "sage"
tags: 
---

v0.42 is ready!  This has mostly been a stabilization release, with a few critical bugs fixed.  There is also an across-the-board change in data structure encoding that is **not backwards-compatible**, but is designed to allow future changes to be (both forwards- and backwards-).

Notable changes include:

- osd: **new (non-backwards compatible!) encoding for all structures**
- osd: fixed bug with transactions being non-atomic (leaking across commit boundaries)
- osd: track in-progress requests, log slow ones
- osd: randomly choose pull target during recovery (better load balance)
- osd: fixed recovery stall
- mon: a few recovery bug fixes
- mon: trim old auth files
- mon: better detection/warning about down pgs
- objecter: expose in-process requests via admin socket
- new infrastructure for testing data structure encoding changes (forward and backward compatibility)

Aside from the data structure encoding change, there is relatively little new code since v0.41.  This should be a pretty solid release.

For v0.43, we are working on merging a few big changes.  The main one is a new key/value interface for objects: each object, instead of storing a blob of bytes, would consist of a (potentially large) set of key/value pairs that can be set/queried efficiently.  This is going to make a huge difference for radosgw performance with large buckets, and will help with large directories as well.  There is also ongoing stabilization work with the OSD and new interfaces for administrators to query the state of the cluster and diagnose common problems.

v0.42 can be found from the usual locations:

- Git at git://github.com/NewDreamNetwork/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.42.tar.gz](http://ceph.newdream.net/download/ceph-0.42.tar.gz)
- For Debian/Ubuntu packages, see[http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages)

