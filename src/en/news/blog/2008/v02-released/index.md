---
title: "v0.2 Released"
date: "2008-05-07"
author: "sage"
tags: 
  - "planet"
---

The kernel client is holding up well under the latest round of testing, so I’ve cut a v0.2 release and am sending an announcement to LKML and linux-fsdevel. Notable in this release:

- fully functional and reasonably stable kernel client
- NFS re-export of a ceph client mount
- client metadata leases for strict client cache coherency and improved performance
- crushtool for managing storage cluster topology
- improved support for storage cluster expansion
- new tools for mkfs and management
- lots and lots of bug fixes

So far, the v0.3 todo list includes:

- hardening OSD distributed failure recovery code
- xattrs
- large directory support (in client)
- recursive mtime and file size (i.e., directory size is sum of sizes of all files and subdirectories)

Please [grab the source](http://ceph.newdream.net/source-control/) and take a look.

