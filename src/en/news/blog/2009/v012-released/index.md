---
title: "v0.12 released"
date: "2009-08-05"
author: "sage"
tags: 
---

I’ve just tagged a v0.12 released, and sent the kernel client patchset off to the Linux kernel and fsdevel lists again.  There was a v0.11 a week ago as well that incorporated some earlier feedback from the kernel lists.

Changes since v0.11:

- mapping\_set\_error on failed writepage
- document correct debugfs mount point
- simplify layout/striping ioctls
- removed bad kmalloc in writepages
- use mempools for writeback allocations where appropriate (\*)
- fixed a problem with capability, snap metadata writeback
- cleaned up f(data)sync wrt metadata writeback
- fixed a messenger bug causing random EBADF
- some mds clustering fixes

And since v0.10:

- server-specified max file size
- kclient: simplified pr\_debug macro
- kclient: respond to control-c on mount
- kclient: misc cleanups, fixes (LKML review)
- mount updates /etc/mtab

Testing on our 100TB cluster is going well.  Planned items for v0.13 include:

- improved availability of OSDs when cluster membership changes
- client authentication
- S3 compatible REST gateway for RADOS object store
- Ceph file system module for Hadoop

\* There are still some potential OOM situations during writeback from the messaging layer, but the fixes for that are planned for a bit later when it’s clear the messaging protocol isn’t going to change further.

