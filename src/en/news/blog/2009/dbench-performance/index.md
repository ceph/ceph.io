---
title: "dbench performance"
date: "2009-03-11"
author: "sage"
tags: 
---

Yehuda and I did some performance tuning with dbench a couple weeks back and made some significant improvements.  Here are the rough numbers, before I forget.  We were testing on a simple client/server setup to make a reasonable comparison with NFS: single server on a single SATA disk, and a single client. Since we were mainly interested in metadata latency, we were using just a single thread (‘dbench 1′).

- sync NFS  ~2.5 MB/sec
- Ceph ~7 MB/sec
- local disk on server ~11 MB/sec
- async NFS ~13 MB/sec

The async NFS was presumably faster than the local disk because the fsync() (or close()) wasn’t really waiting for anything to be flushed to disk on the server.  Considering Ceph started out around 2 MB/sec two days earlier, we were pretty happy, and there’s still room for improvement.

**UPDATE 7/7/09**: I’m not sure what machine I was using at the time, but in retrospect the local disk numbers look way too low.  Don’t read too much into these numbers!

