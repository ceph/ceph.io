---
title: "v0.39 released"
date: "2011-12-02"
author: "sage"
tags: 
  - "planet"
---

v0.39 has been tagged and uploaded.  There was a lot of bug fixing going on that isn’t terribly exciting.  That aside, the highlights include:

- mon: rearchitected bootstrap (mkfs)
- mon: vastly simplified mon cluster expansion
- config: choose daemon ip based on subnet instead of explicitly
- hadoop: misc hadoop client fixes
- osd: many bugs fixed
- make: pretty V=0 mode
- radosgw: swift support improvements
- radosgw, objecter: perfcounter instrumentation
- we now build on FreeBSD
- debian: packaging cleanup

The monitor and network config changes are worth mentioning.  We simplified monitor bootstrapping to make it easier to use tools like Chef or Juju to bring up a fresh cluster.  At the same time we made monitor cluster expansion almost trivial, and fixed an important performance problem when a monitor was down for a long time and then came back up.

Specifying the network config for daemons is also simple now that you can constrain the choice to a specific subnet.  That means that when you have a whole cluster with a public and private network for, say, the OSDs, you can force ceph-osd to choose an ip for each interface from the appropriate subnet without explicitly setting the IP in the ceph.conf for each daemon.

Ceph now builds on FreeBSD, thanks to some porting work by [Stanislav Sedov](https://github.com/stass).

There were a lot of small fixes to the OSD.  A few bugs remain, however, in strange recovery corner cases.  Some of the core recovery code is being rewritten for v0.40 that will vastly simplify things and make the system more performant and less of a memory hog during recovery (see the wip-backfill branch in ceph.git).

For v0.40 we are also working on the RBD image cloning (“layering”), and it’s going to be pretty slick.  And the vastly improved ceph.spec file is almost ready and should land in v0.40 as well.

To download v0.39:

- Git at git://github.com/NewDreamNetwork/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.39.tar.gz](http://ceph.newdream.net/download/ceph-0.39.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-39-released/&bvt=rss&p=wordpress)
