---
title: "v0.25.1 released"
date: "2011-03-15"
author: "sage"
tags: 
---

This a bugfix release.  If you’re using librados or librbd, please

upgrade, as there are some small API fixes.  If not, there isn’t anything

too critical here aside from some OSD recovery corner cases.

\* librados: some size\_t -> uint64\_t type conversions to support large

objects

\* librbd: lots of size\_t -> uint64\_t conversions for 32-bit systems

\* cfuse: daemonize fixed

\* debian: rbd udev rules

\* time conversions fixed for some cases (off by factor of 10)

\* osd: pool creation faster

\* osd: some recovery fixes

\* mds: fixed a mds failover bug (corrupted journal)

\* misc small fixes

We’re trying to do a quicker major release cycle as we move toward 1.0,

and are aiming for v0.26 in another week and a half.

As always, the thing we are most interested in is help with testing.

Please send bug reports to the list or stick them directly in the tracker

at http://tracker.newdream.net.

Relevant URLs:

\* Direct download at: http://ceph.newdream.net/download/ceph-0.25.1.tar.gz

\* For Debian and Ubuntu packages, see http://ceph.newdream.net/wiki/Debian

This a bugfix release.  If you’re using librados or librbd, please upgrade, as there are some small API fixes.  If not, there isn’t anything too critical here aside from some OSD recovery corner cases.

- librados: some size\_t -> uint64\_t type conversions to support large  objects
- librbd: lots of size\_t -> uint64\_t conversions for 32-bit systems
- cfuse: daemonize fixed
- debian: rbd udev rules
- time conversions fixed for some cases (off by factor of 10)
- osd: pool creation faster
- osd: some recovery fixes
- mds: fixed a mds failover bug (corrupted journal)
- misc small fixes

We’re trying to do a quicker major release cycle as we move toward 1.0, and are aiming for v0.26 in another week and a half.

As always, the thing we are most interested in is help with testing. Please send bug reports to the list or stick them directly in the tracker at [http://tracker.newdream.net](http://tracker.newdream.net).

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.25.1.tar.gz](http://ceph.newdream.net/download/ceph-0.25.1.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-25-1-released/&bvt=rss&p=wordpress)
