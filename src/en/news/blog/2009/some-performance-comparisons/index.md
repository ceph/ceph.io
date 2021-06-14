---
title: "Some performance comparisons"
date: "2009-01-30"
author: "sage"
tags: 
---

I did a few basic tests comparing Ceph to NFS on a simple benchmark, a Linux kernel untar.  I tried to get as close as possible to an “apples to apples” comparison.  The same client machine is used for NFS and Ceph; another machine is either the NFS server or the Ceph MDS.  The same disk type is used for both tests.  The underlying file system for the NFS server was ext2. In the Ceph case, additional machines were used for the OSDs (each using btrfs).  Ceph came in somewhere in between NFS sync and async:

- NFS async – ~60s
- Ceph – ~90s
- NFS sync – ~120s

The comparison isn’t really ideal for a number of reasons.  Most obviously, an NFS server is a single point of failure, while Ceph is going to great lengths to replicate all data on multiple nodes and to seamlessly tolerate the failure of any one of them (in this case, everything was replicated 2x).  Also, the NFS async case throws out all data safetly from the client’s perspective: an application fsync() is meaningless.  In contrast, although Ceph is operating somewhat asynchronously (for both metadata and data operations), an fsync() on a file or directory means what it is supposed to mean.

I can’t say that I’m all that pleased with these results (I was expecting things to be faster), but we’re not done yet.  For each file, Ceph is still expending two round trips to the MDS (to create and then to close the file) and one to the OSD (to write the data).  Although OSD op and the second MDS op are asynchronous, they still take time (the second MDS op in particular takes time on the MDS).  The eventual goal is to do file creation asynchronously by preallocating unused inode numbers to the client; that will allow the client to create and close the (already written) file with a single MDS op.  But this is a decent start for now.

I should mention that the OSD write latency has minimal impact on these numbers; both the MDS and client file data writeback do not typically block forward progress while waiting for IOs to complete.  Using expensive hardware (NVRAM) for the storage will improve other aspects of performance (particularly when multiple clients are accessing the same files, and the MDS does wait for changes to hit the journal), but it won’t have much effect on single client workloads like this one.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/updates/some-performance-comparisons/&bvt=rss&p=wordpress)
