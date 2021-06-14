---
title: "v0.48.2 ‘argonaut’ stable update released"
date: "2012-09-20"
author: "sage"
tags: 
---

Another update to the stable “argonaut” series has been released. This fixes a few important bugs in rbd and radosgw and includes a series of changes to upstart and deployment related scripts that will allow the upcoming ‘ceph-deploy’ tool to work with the argonaut release.

Upgrading:

- The default search path for keyring files now includes /etc/ceph/ceph.$name.keyring. If such files are present on your cluster, be aware that by default they may now be used.
- There are several changes to the upstart init files. These have not been previously documented or recommended. Any existing users should review the changes before upgrading.
- The ceph-disk-prepare and ceph-disk-active scripts have been updated significantly. These have not been previously documented or recommended. Any existing users should review the changes before upgrading.

Notable changes include:

- mkcephfs: fix keyring generation for mds, osd when default paths are used
- radosgw: fix bug causing occasional corruption of per-bucket stats
- radosgw: workaround to avoid previously corrupted stats from going negative
- radosgw: fix bug in usage stats reporting on busy buckets
- radosgw: fix Content-Range: header for objects bigger than 2 GB.
- rbd: avoid leaving watch acting when command line tool errors out (avoids 30s delay on subsequent operations)
- rbd: friendlier use of pool/image options for import (old calling convention still works)
- librbd: fix rare snapshot creation race (could lose a snap when creation is concurrent)
- librbd: fix discard handling when spanning holes
- librbd: fix memory leak on discard when caching is enabled
- objecter: misc fixes for op reordering
- objecter: fix for rare startup-time deadlock waiting for osdmap
- ceph: fix usage
- mon: reduce log noise about check\_sub
- ceph-disk-activate: misc fixes, improvements
- ceph-disk-prepare: partition and format osd disks automatically
- upstart: start everyone on a reboot
- upstart: always update the osd crush location on start if specified in the config
- config: add /etc/ceph/ceph.$name.keyring to default keyring search path
- ceph.spec: don’t package crush headers

You can get this release from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.48.2.tar.gz](http://ceph.newdream.net/download/ceph-0.48.2.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/install/debian](http://ceph.newdream.net/docs/master/install/debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-48-2-argonaut-stable-update-released/&bvt=rss&p=wordpress)
