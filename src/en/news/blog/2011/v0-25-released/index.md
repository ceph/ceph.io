---
title: "v0.25 released"
date: "2011-03-06"
author: "sage"
tags: 
---

We’ve just tagged the v0.25 release.  Most of the work here is in the OSD

cluster, a new librbd library (refactoring existing RBD infrastructure),

and a librados API refresh.

\* osd: fix map churn while peering

\* osd: “watch/notify” framework for RBD synchronization

\* osd: ability to read from closest replica

\* osd: many bug fixes

\* osd: improved recovery behavior (tolerate missing objects)

\* mds: misc clustering fixes

\* mds: fix respawn

\* mds: misc bug fixes

\* mds: “hot standby” behavior

\* /etc/ceph/keyring instead of keyring.bin

\* ability to log to syslog

The focus for v0.26 will remain on stability, primary with the OSD

cluster, RBD, and radosgw.  Internally, we’re focusing on building out our

QA and performance testing infrastructure.

Relevant URLs:

\* Direct download at: http://ceph.newdream.net/download/ceph-0.25.tar.gz

\* For Debian and Ubuntu packages, see http://ceph.newdream.net/wiki/Debian

We’ve just tagged the v0.25 release.  Most of the work here is in the OSD cluster, a new librbd library (refactoring existing RBD infrastructure),  and a librados API refresh.

The librados changes are an attempt to clean up the API warts sooner rather than later.  If there are any issues with the new interface, we’d like to hear about them!

The new librbd library sits on top of librados and captures the RBD striping, snapshotting, and other functionality, presenting a simple block device-like interface.  The qemu/KVM driver is being rewritten in terms of librbd, which will vastly simplify the upstream qemu code and allow us to fix bugs and add functionality without being tied to a specific version of qemu/KVM.

Other changes since v0.24 include:

- osd: fix map churn while peering
- osd: “watch/notify” framework for RBD synchronization
- osd: ability to read from closest replica
- osd: many bug fixes
- osd: improved recovery behavior (tolerate missing objects)
- mds: misc clustering fixes
- mds: fix respawn
- mds: misc bug fixes
- mds: “hot standby” behavior
- /etc/ceph/keyring instead of keyring.bin
- ability to log to syslog

The focus for v0.26 will remain on stability, primary with the OSD cluster, RBD, and radosgw.  Internally, we’re focusing on building out our QA and performance testing infrastructure.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.25.tar.gz](http://ceph.newdream.net/download/ceph-0.25.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-25-released/&bvt=rss&p=wordpress)
