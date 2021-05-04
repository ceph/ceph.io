---
title: "Snapshot progress"
date: "2008-07-24"
author: "sage"
tags: 
  - "planet"
---

If things seem a bit slow lately, it’s because I’ve been primarily working  
on implementing the snapshot mechanism for the last few weeks.  This is  
coming along pretty well: I can take snapshots and access snapshotted  
content.  The interaction with recursive accounting has been tricky  
because delayed propagation means changes may propagate into recent  
snapshot as changes work their way up the hierarchy, but I think I have  
that one nailed.

Here’s how it works:

$ tar jxf ~/src/linux-2.6.24.tar.bz2 &
\[1\] 18715
$ mkdir linux-2.6.24/.snap/1   # create a few snapshots
$ mkdir linux-2.6.24/.snap/2
$ mkdir linux-2.6.24/.snap/3
$ kill %1
$ ls -al linux-2.6.24/.snap    # see that dir sizes increased over time
total 3
drwxr-xr-x 1 sage sage 1205808 Jul 24 10:23 ./
drwxr-xr-x 1 sage sage 1205808 Jul 24 10:23 ../   # live copy
drwxr-xr-x 1 sage sage 1028511 Jul 24 10:23 1/
drwxr-xr-x 1 sage sage 1144455 Jul 24 10:23 2/
drwxr-xr-x 1 sage sage 1177913 Jul 24 10:23 3/
\[1\]+  Terminated              tar jxf ~/src/linux-2.6.24.tar.bz2
$ ls linux-2.6.24/.snap/1/Documentation/ | wc
23      24     472
$ ls linux-2.6.24/.snap/3/Documentation/ | wc
32      33     680

Etc.  The ‘.snap’ hidden dir is accessible from anywhere (like .snapshot  
on a Netapp).  Snapshots can be created for any directory at any time,  
however, and recursively apply to all nested content.

Still left to do:

- properly handle directory renames (which interact in interesting ways with the snapshot realm tree).
- snapshot deletion
- garbage collection (metadata and data)
- update kernel client (I’m currently working just with the fuse clientfor faster prototyping)

