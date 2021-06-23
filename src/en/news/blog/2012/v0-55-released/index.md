---
title: "v0.55 released"
date: "2012-12-04"
author: "sage"
tags: 
---

We had originally planned to make v0.55 a long-term stable release, but a lot of last-minute changes and fixes went into this cycle, so we are going to wait another cycle and make v0.56 bobtail.   A lot of work went into v0.55, however.  If you aren’t running argonaut (v0.48.\*), please give v0.55 a try and help us make sure it is rock solid!

**WARNING**: The default authentication behavior changed.  Please read below before upgrading or your cluster may not start.

Notable changes since v0.54 include:  

- **auth: enable cephx by default**
- librbd: fine-grained striping feature
- librbd: improved caching (of object non-existence)
- rbd: import from stdin, export to stdout
- osd: optional ‘min’ pg size
- osd: recovery reservations
- osd: client vs recovery io priotitization
- osd: use syncfs(2) even when glibc is old
- crush: fixed retry behavior with chooseleaf via tunable
- radosgw: POST support
- radosgw: stripe large (non-multipart) objects
- radosgw: openstack keystone integration
- radosgw: vanity bucket dns names
- mon: improved ENOSPC, fs error checking
- libcephfs: java wrapper
- ceph-fuse/libcephfs: many misc fixes, admin socket debugging
- mds: misc fixes
- mon, radosgw, ceph-fuse: fixed memory leaks!
- mkcephfs: support for formatting xfs, ext4 (as well as btrfs)
- upstart: ceph, ceph-osd meta-jobs
- many many bug fixes

The biggest item to watch out for with this release is that cephx authentication is now on by default.  That means that **if you don’t already explicitly enable or disable authentication in your ceph.conf, upgrading will prevent your cluster from starting**.  You need to either disable authentication explicitly, or [enable it before upgrading](http://ceph.com/docs/master/rados/operations/authentication/#configuring-cephx).

There is a lot of new stuff here, including performance work on the OSD, new features in radosgw, and stability improvements all around.  Lots of memory leaks were fixed (monitor, radosgw, OSD, ceph-fuse), many bugs were squashed.  Please give this release a try; we’d love to get as much testing as possible before the next release v0.56 becomes a long-term stable version.

You can get v0.55 from the usual locations:

- - Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
    - Tarball at [http://ceph.com/download/ceph-0.55.tar.gz](http://ceph.com/download/ceph-0.55.tar.gz)
    - For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
    - For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)
    

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-55-released/&bvt=rss&p=wordpress)
