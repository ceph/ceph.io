---
title: "Stable (‘master’) branch updated"
date: "2008-05-23"
author: "sage"
tags: 
---

I’ve just merged a bunch of recent changes into the ‘master’ branch in git.  The big items are

- lots of kernel client fixes
- improved stability of NFS re-export of a ceph client mount
- xattrs
- various OSD failure recovery fixes, and a corruption bug fix in EBOFS
- a big cleanup of the userspace client code, to bring it in line with the kernel client implementation
- endian and wordsize safety (freely mix x86 and x86\_64, etc)

Big thanks go to Brent Nelson at UFL for his tireless testing and countless bug reports.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/stable-master-branch-updated/&bvt=rss&p=wordpress)
