---
title: "Kernel client git trees have moved"
date: "2009-10-16"
author: "sage"
tags: 
  - "planet"
---

The kernel client git trees have moved to kernel.org.  The main line of development is in a kernel tree that contains the Ceph client:

>  [git://git.kernel.org/pub/scm/linux/kernel/git/sage/ceph-client.git](http://git.kernel.org/?p=linux/kernel/git/sage/ceph-client.git;a=summary)

Generally speaking, the master branch will contain stable code that is ready to be pushed upstream, while the unstable branch has the bleeding edge (and may be rebased).

There is also a git tree containing just the Ceph module source.  It mirrors commits from the main tree (for fs/ceph/\* only), so there is a useful history, and it also contains ‘backport’ branches that will build on older kernels.

> [git://git.kernel.org/pub/scm/linux/kernel/git/sage/ceph-client-standalone.git](http://git.kernel.org/?p=linux/kernel/git/sage/ceph-client-standalone.git;a=summary)

The userspace server side code (ceph.git) hasn’t moved; it’s still at

> [git://ceph.newdream.net/ceph.git](http://ceph.newdream.net/git/?p=ceph.git;a=summary)

Enjoy!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/uncategorized/kernel-client-git-trees-have-moved/&bvt=rss&p=wordpress)
