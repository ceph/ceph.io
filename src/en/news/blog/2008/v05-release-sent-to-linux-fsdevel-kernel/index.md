---
title: "v0.5 release sent to linux-fsdevel, -kernel"
date: "2008-11-14"
author: "sage"
tags: 
---

I’ve tagged a v0.5 release, and this time sent the client portion in patch form to linux-kernel and linux-fsdevel for review.  We’ll see what happens!  It weights in a 20k lines of code, so I’ll be impressed if anyone decides to wade through it immediately.

New in this release:

- Lots of bug fixes, especially in the object storage area.  We’ve been doing lots of recovery testing (big thanks again to Brent Nelson at UFL for his help testing) and things have improved dramatically.  Snapshots appear to be pretty solid at this point as well.
- The OSD storage now accepts “compound” operations that make multiple updates to an object in one go.  For now, this is just used by the MDS to set some additional attributes on directory objects that can be used by fsck-type tools.  The larger goal is for this to support higher order object mutations for a sort of lightweight “active storage” system.  (The [systems research group at UCSC](http://www.ssrc.ucsc.edu/proj/ceph.html) has been looking at this recently.)
- The btrfs storage layer continues to evolve.  Updated ioctl patches have been submitted to btrfs (these hit [btrfs-unstable](http://git.kernel.org/?p=linux/kernel/git/mason/btrfs-unstable.git) yesterday).
- You can now forcibly unmount a ceph mount (if, say, the servers go permanently offline).
- OSDs shut down nicely when sent SIGTERM or SIGINT.
- OSD recovery is managed by a separate thread and (naively) throttled.
- Too many small improvements and fixes to count.

Items on the todo list for the next release include:

- ENOSPC handling.
- Async metadata operations.  Currently all metadata updates are synchronously journaled, making a lot of operations (like untar) quite slow.  When a client is the exclusive user of a directory, we should perform these operations asynchronously, and only block on an fsync on the containing directory.  The existing file capability and internal MDS locking infrastructure should make this pretty straightforward, and the performance win will be pretty huge.
- Fully integrated Content addressible storage (CAS) is still on the list, and most of the groundwork has already been laid.  I hope to get to it soon, although it’s certainly not at the top of the list yet.

