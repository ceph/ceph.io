---
title: "Asynchronous metadata operations"
date: "2009-01-12"
author: "sage"
tags: 
  - "planet"
---

The focus for the last few weeks has been on speeding up metadata operations.  The problem has been that the focus was first and foremost on reliability and recoverability.  Each metadata operation was performed by the MDS, and it was journaled safely to the OSDs before being applied.  This meant that every metadata operation went something like client -> mds -> primary osd -> replica osd -> primary osd -> mds -> client.  This was very safe (a failure of the client, mds, or osd would not cause any problems) but was especially slow for things like untar (open/create, chmod, chown).

We’ve improved the situation in a number of ways.  First, the MDS can now send two replies to metadata requests.  The first indicates that the operation has succeeded and includes the result, and the second indicates that the operation has safely journaled to disk.  The client tracks “unsafe” (uncommitted) operations during the interval between the two responses, and an fsync() on the relevant directory will block until the operations fully commit.

The client/MDS protocol has also been improved to make the capability and lease infrastructure more useful.  The key difference is that the MDS can now give the client and exclusive capability to update inode fields asynchronously.  By default, when a file is created, the MDS issues an exclusive lease over the file fields (size, mtime, atime), auth fields (uid, gid, mode) and xattrs.  A subsequent chmod or chown simply updates those fields on the client and asynchronously flushes the changes back to the MDS at a later time.

This drops the untar workload down to just two MDS round trips per file (one request to determine the file doesn’t exist, one to create+open the file and obtain the exclusive capabilities/leases), without any blocking while the journal flushes.  The logical next step is to allow file creation to be fully asynchronous when, say, the client is the only user of a directory.  Really, something like untar should be able to proceed completely on the client and by asynchronously written back to the MDS.  Most of the infrastructure to allow this is now in place (the main item being the locking infrastructure to ensure the client is the exclusive user of a directory).  I think we’re going to hold off on getting that working a bit longer, though, until we’ve shaken out the bugs from this last set of changes and cut a new release.

The next step is to run some benchmarks to see how much the performance has improved, and to make some long overdue comparisons to NFS.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/asynchronous-metadata-operations/&bvt=rss&p=wordpress)
