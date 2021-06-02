---
title: "v0.22.1 released"
date: "2010-10-24"
author: "sage"
tags: 
---

This release fixes a few critical bugs in v0.22:

- osd: fix hang during mkfs journal creation
- objecter: fix rare hang during shutdown
- msgr: fix reconnect errors due to timeouts
- init-ceph: check for correct instance in daemon\_is\_running()
- filestore: deliberate crash on ENOSPC/EIO to avoid corruption
- filestore: split xattrs into chunks (partial workaround for xattr size limitations on btrfs)
- filestore: ignore ENOSPC on xattrs until workaround for extN is implemented
- radosgw: return 204 on removal of bucket/object

The main issue was the messenger bug, which causes internal cluster messages to be dropped and triggered random cosd crashes.  The ENOSPC/EIO issue is also a bit strange: previously we silently ignored these errors.  Now we crash to avoid corrupting our data with partially committing transaction, except in the case where we are trying to set a large xattr.  The problem here is that both btrfs have size limitations we hadn’t noticed before, btrfs on an individual xattr, and extN on the total size of all xattrs.  We will continue to ignore errors on extN (aside from logging them) until we implement a workaround.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.22.1.tar.gz](http://ceph.newdream.net/download/ceph-0.22.1.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

