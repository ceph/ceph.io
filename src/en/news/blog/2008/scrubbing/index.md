---
title: "Scrubbing"
date: "2008-12-16"
author: "sage"
tags: 
  - "planet"
---

The last month has seen a lot of work on the storage cluster, fixing recovery related bugs, improving threading, and working out a mechanism for online scrubbing.  In this case, scrubbing is basically a low-level fsck of the object storage layer.  For each PG being scrubbed, the primary and any replica nodes generate a catalog of all objects in the PG and compare them to ensure that no objects are missing or mismatched (currently we check  size and attributes; soon, we’ll pull the checksums out of btrfs to ensure the object contents match too).  Assuming the replicas all match up, one OSD does a final semantic sweep to ensure that all of the snapshot-related object metadata is consistent. Errors are reported to a (new) central system log.

An administrator can tell the system to scrub the entire storage cluster, a single OSD, or a single placement group.   Eventually, we’ll probably want to have the system automatically schedule a slow background scrub when the system is idle.

This is only one piece of the overall ‘fsck’ problem–the file system metadata is more complicated and also needs to be verified.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/uncategorized/scrubbing/&bvt=rss&p=wordpress)
