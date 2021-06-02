---
title: "v0.10 released"
date: "2009-07-16"
author: "sage"
tags: 
---

We’ve released v0.10.  The big items this time around:

- kernel client: some cleanup, unaligned memory access fixes
- much debugging of MDS recovery: kernel client will now correctly untar, compile kernel with MDS server running in a 60 second restart loop.
- a few misc mds fixes
- osd recovery fixes
- userspace client: many bug fixes, now quite stable
- librados improvements

Also,

- libceph: a thin wrapper around the POSIXy ceph interface

which is being used to write a file system ‘Broker’ for the [Hypertable distributed database](http://www.hypertable.org/) project.  We’re also planning on (finally) getting the Hadoop ceph client in working order.

We’re also continuing to work on the librados object storage layer, including a standalone fastcgi-based gateway exposing an S3-compatible restful interface, the goal being a drop-in replacement for apps using S3. (It won’t let you use the rados snapshots or object classes, though, and won’t scale as efficiently.)

As far as testing goes, we’re filling up a 100TB cluser locally and will start failure testing on that shortly.  And this past week we’ve been thorougly testing single-node) MDS recovery.  Next up is looping OSD restarts and power cycling.

Major todo items coming up next:

- client authentication
- additional metadata to facilitate catastrophic rebuild of fs hierarchy
- stabilize clustered mds

We’ve also sent the Linux kernel client code off to LKML and -fsdevel again, and are continuing to work toward a merge into the mainline kernel.

**UPDATE**: Here are the relevant URLs:

- Git tree at [git://ceph.newdream.net/ceph.git](git://ceph.newdream.net/ceph.git)
- Direct download at [http://ceph.newdream.net/download/ceph-0.10.tar.gz](http://ceph.newdream.net/download/ceph-0.10.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

