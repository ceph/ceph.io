---
title: "Linus vs FUSE"
date: "2011-07-08"
author: "sage"
tags: 
---

I can’t decide whether Linus is amused or annoyed by the extent to which people hang on his every word, or go nuts over his random rants about this or that. People still talk about his pronouncement about [O\_DIRECT and tripping monkeys](http://lkml.org/lkml/2002/5/11/58) (which has now found a home on [the open(2) man page](http://linux.die.net/man/2/open)). The latest hullabaloo is about his decree that all [FUSE-based file systems are toys](https://lkml.org/lkml/2011/6/9/462).

Clearly, as [many](http://www.gluster.com/2011/06/28/linus-torvalds-doesnt-understand-user-space-storage/) [have](http://cloudfs.org/2011/06/user-space-filesystems/) [pointed](http://zaitcev.livejournal.com/210078.html) [out](http://cloudfs.org/2011/06/user-space-file-systems-again/), calling all such systems “toys” isn’t completely fair. But then it wouldn’t be fun to say it if it were strictly true. There are real systems (big and fast) built on FUSE, just as there are such systems built with Java, Visual BASIC, Cobol, and every other platform/technology we love to mock.

I haven’t seen [PLFS](http://institutes.lanl.gov/plfs/) come up yet in the discussion, but I think it’s worth mentioning just because it is such a good example of optimizing for the cases that actually matter for your workload. For those not familiar, PLFS (parallel log-structured file system) is a FUSE-based file system built at LANL for their huge many-thousand node clusters that turns all random IO sequential by building a mess of intermediate indices. It sounds like it would be a disaster, but in practice it speeds up their workloads by _several_ orders of magnitude, simply because the underlying parallel file systems on which it is stacked are so bad at those workloads.

Anyway, there are just a few points I wanted to make about the kernel vs userspace file systems, having implemented the Ceph client using both. At the risk of stating the obvious:

- **There is nothing you can do in userspace that you can’t also do in the kernel**. Sure, development can be harder in the kernel, but you have unparalleled access to the system. The only significant technical disadvantage of a kernel implementation is fault isolation: a buggy FUSE-based file system won’t take down the system with it.
- **Implementation is easier with FUSE**. At least for something basic. There are some key problems that are harder to solve because of limitations in the interface.
- **Memory management is easier in the kernel**. AB is right when [he says](http://www.gluster.com/2011/06/28/linus-torvalds-doesnt-understand-user-space-storage/) that the memory management and file system need to work together. The problem is that it is difficult to push memory management into userspace when you are not the only tenant on the machine. (I suspect that in most of the big production environments where userspace file systems are used, the fs either is the sole tenant or is given some fixed amount of RAM to work with.) The kernel VM, on the other hand, will apply cache pressure dynamically based on the demands of all users of the system. Trying to do that in userspace is extremely awkward at best.
- **Managing cache coherency is easier in the kernel**. Some people don’t care about this (e.g., see NFS, or any of the “toys” Linus was referring to), but we do. This is mainly a result of the limited FUSE interface. You can probably avoid the issue by simply not using the kernel dentry and page caches and reimplementing it all in userspace. That’s a simple enough approach, but is slow, and fails to leverage years of work invested in the core Linux VFS code.
- **FUSE may be partly to blame**. Jeff Darcy has made the point that many of the FUSE shortcomings aren’t inherent to userspace storage, but artifacts of the current interface and kernel politics. Maybe that’s the case, but that is the world we live in. No file system that doesn’t work on Linux (or maybe \*BSD) is relevant. And for what it’s worth, most of the people I see complaining about kernel community intransigence haven’t even tried to work upstream; it’s easier than you think, as long as the code you’re pushing isn’t crap.

Which is better for any given project in the end is probably more of a business decision: technical investment, performance, time to market, ease of deployment. If you’re talking purely about the technical limitations of the environment, however, it’s hard to beat the kernel.

Or, if you can, implement both. It makes these sorts of debates that much more fun.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/linus-vs-fuse/&bvt=rss&p=wordpress)
