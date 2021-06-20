---
title: "v0.46 released"
date: "2012-04-30"
author: "sage"
tags: 
---

Another sprint, and v0.46 is ready.  Big items in this release include:

- rbd: new caching mode (see below)
- rbd: trim/discard support
- cluster naming
- osd: new default locations (slimmer .conf files, see below)
- osd: various journal replay fixes for non-btrfs file systems
- log: async and multi-level logging (see below)

The biggest new item here is the new RBD (librbd) cache mode that Josh has been working on.  This reuses a caching module that ceph-fuse and libcephfs have used for ages, so the cache portion of the code is well-tested, but the integration with librbd is new, and there are some (rare) failure cases that are not yet handled in this version. We recommend it for performance and failure testing at this stage, but not for production use just yet–wait for v0.47.  librbd also got trim/discard support.  Patches for wire it up to qemu are still working their way upstream (and won’t work for virtio until virtio gets discard support).

We’ve revamped some of the default locations for data directories and log files and incoporated a cluster name configurable.  By default, the cluster name is ‘ceph’, and the config file is /etc/ceph/$cluster.conf (so ceph.conf is still the default).  The $cluster substitution variable is used the other default locations, allowing the same host to contain daemons participating in different clusters.  All data defaults to /var/lib/ceph/$type/$cluster-$id (e.g., /var/lib/ceph/osd/ceph-123 for osd\_data), and logs go to /var/log/ceph/$cluster.$type.$id.  You can, of course, still override these with your own locations as before.

There is also new logging code that allows the daemons to gather debug information at a different (higher) log level than what is actually written to the log (asynchronously).  In the event of a crash (seg fault, failed assertion), the full log is dumped to the log for our reading pleasure.  The general syntax looks like:

> debug foo = 1/10

where ‘foo’ is the subsystem name (e.g., “osd”, “filestore”, etc.), the first number is the debug level that is written to the log, and the second number is the level that is gathered in memory (we keep many thousands of past entries around by default).  The hope is that people can gather debug information in memory with a lower performance impact and avoid eating their disk space.  We’ll need some more operational experience to find out how expensive that will really be.

You can get v0.46 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.46.tar.gz](http://ceph.newdream.net/download/ceph-0.46.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/master/ops/install/mkcephfs/#installing-the-packages)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-46-released/&bvt=rss&p=wordpress)
