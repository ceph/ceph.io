---
title: "lockdep for pthreads"
date: "2008-11-06"
author: "sage"
tags: 
---

Linux has a great tool called lockdep for identifying locking dependency problems.  Instead of waiting until an actual deadlock occurs (which may be extremely difficult when it is a timing-sensitive thing), lockdep keeps track of which locks are already held when any new lock is taken, and ensures that there are no cycles in the dependency graph.

The other day I was sifting through gdb backtraces decoding a deadlock bug in the OSD daemon when it occured to me that it would be nice to have a similar tool for user space applications using pthreads.  A quick search didn’t turn up anything promising, so I put together a simple dependency checker and hooked it into Ceph’s existing Mutex and RWLock wrappers. It was surprisingly quick to put together, and it works!  I was a little disappointed to only find two real dependency bugs.  But the project also motivated me to disable recursive locking (since my lockdep doesn’t cope with that), and that turned up a half dozen other instances of lazyness.

My lockdep code (C++) is [here](http://ceph.newdream.net/git/?p=ceph.git;a=blob;f=src/common/lockdep.cc;h=2c5f017421180a26cc7666e25c2288405bbb43b3;hb=unstable) and [here](http://ceph.newdream.net/git/?p=ceph.git;a=blob;f=src/common/lockdep.h;h=00026b30b972179f7f05600540d377e288a12370;hb=unstable), plus the hooks into the [mutex wrapper](http://ceph.newdream.net/git/?p=ceph.git;a=blob;f=src/common/Mutex.h;h=a6490cc975192d40dbdd0044f3d76f8e4fb04ee0;hb=unstable).

