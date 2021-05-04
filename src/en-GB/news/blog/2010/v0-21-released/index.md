---
title: "v0.21 released"
date: "2010-07-29"
author: "sage"
tags: 
  - "planet"
---

It’s been a while, but v0.21 is ready.  Most of the work this time around has been on stability. There is one key new feature, however: RBD, the rados block device, which let you create a virtual disk backed by objects stored in the Ceph cluster.  The images can be mapped natively by the ceph kernel module or via a driver in qemu/KVM.  Although neither of those drivers is upstream yet, the server side functionality and admin tools are in place.

Changes since v0.20 include:

- improved logging infrastructure
- log rotate
- mkfs improvements
- rbd tool, and rados class
- mds: return ENOTEMPTY when removing directory with snapshots
- mds: lazy io support (experimental)
- msgr: send messages directory to connection handles (more efficient)
- faster atomic\_t via libatomic-ops
- mon: recovery improvements, fixes (e.g. when one mon is down for a long time)
- mon: warn on monitor clock drift
- osd: large object support
- osd: heartbeat improvements, fixes
- osd: journaling fixes, improvements (bugs, better use of direct io)
- osd: snapshot rollback op (for rbd)
- radosgw fixes, improvements
- many memory leaks and other bugs fixed

The project roadmap has been updated and is [available via the issue tracker](http://tracker.newdream.net/projects/ceph/roadmap).

Relevant URLs:

- Direct download at [http://ceph.newdream.net/download/ceph-0.21.tar.gz](http://ceph.newdream.net/download/ceph-0.21.tar.gz)
- For Debian packages see [http://ceph.newdream.net/wiki/Debian](http://ceph.com/wiki/Debian)

