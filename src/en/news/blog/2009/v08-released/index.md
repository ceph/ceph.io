---
title: "v0.8 released"
date: "2009-05-19"
author: "sage"
tags: 
---

Ceph v0.8 has been released.  [Debian packages for amd64 and i386](http://ceph.newdream.net/wiki/Debian) have been built and there is a [tarball](http://ceph.newdream.net/download/), or you can [pull the ‘master’ branch from Git](http://ceph.newdream.net/wiki/Checking_out).  This update has a lot of important protocol changes and corresponding performance improvements:

- Client / MDS protocol simplification — faster, less fragile
- Online adjustment of data and/or metadata replication
- O\_DIRECT support
- Debug hooks moved from /proc to /debug (debugfs)
- Faster xattrs
- Faster readdir (client can cache the result)
- Support for upcoming 2.6.30 kernel
- Better error reporting on mount errors (permission, protocol version mismatches) or disk format mismatches
- Lots and lots of bug fixes

Things have sped up significantly (single threaded dbench, for example, is almost twice as fast), and overall things are much less vulnerable to obscure race conditions.  MDS clustering is somewhat more stable (although still not stable enough to be recommended ![:)](http://ceph.com/wp-includes/images/smilies/icon_smile.gif) .  The most bug fixes, though, are in the distributed object storage layer’s failure recovery and data migration code. The next release is mostly going to focus on object storage.  We are cleaning up the interfaces and building a ‘librados’ (RADOS is the name for the object storage cluster) that provides a simple storage interface similar to S3.  More on that soon!

