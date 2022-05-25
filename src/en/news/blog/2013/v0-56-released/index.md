---
title: "v0.56 released"
date: "2013-01-01"
author: "sage"
tags: 
  - "release"
  - "bobtail"
---

We’re bringing in the new year with a new release, v0.56, which will form the basis of the next stable series “bobtail.”  There is little in the way of new functionality since v0.55, as we’ve been focusing primarily on stability, performance, and upgradability from the previous argonaut stable series (v0.48.x).  If you are a current argonaut user, you can either upgrade now, or watch the [Inktank blog](http://www.inktank.com/news-events/blog/) for the bobtail announcement after some additional testing has been completed.  If you are a v0.55 or v0.55.1 user, we recommend upgrading now.

Notable changes since v0.55 include:  

- librbd: fixes for read-only pools for image cloning
- osd: fix for mixing argonaut and post-v0.54 OSDs
- osd: some recovery tuning
- osd: fix for several scrub, recovery, and watch/notify races/bugs
- osd: fix pool\_stat\_t backwawrd compatibility with pre-v0.41 clients
- osd: experimental split support
- mkcephfs: misc fixes for fs initialization, mounting
- radosgw: usage and op logs off by default
- radosgw: keystone authentication off by default
- upstart: only enabled with ‘upstart’ file exists in daemon data directory
- mount.fuse.ceph: allow mounting of ceph-fuse via /etc/fstab
- config: always complain about config parsing errors
- mon: fixed memory leaks, misc bugs
- mds: many misc fixes

Notable changes since v0.48.2 (“argonaut”):

- auth: authentication is now on by default; see [release notes](http://ceph.com/docs/master/release-notes/#v0-56-bobtail)!
- osd: improved threading, small io performance
- osd: deep scrubbing (verify object data)
- osd: chunky scrubs (more efficient)
- osd: improved performance during recovery
- librbd: cloning support
- librbd: fine-grained striping support
- librbd: better caching
- radosgw: improved Swift and S3 API coverage (POST, multi-object delete, striping)
- radosgw: OpenStack Keystone integration
- radosgw: efficient usage stats aggregation (for billing)
- crush: improvements in distribution (still off by default; see [CRUSH tunables](http://ceph.com/docs/master/rados/operations/crush-map/#tunables))
- ceph-fuse, mds: general stability improvements
- release RPMs for OpenSUSE, SLES, Fedora, RHEL, CentOS
- tons and bug fixes and small improvements across the board

If you are upgrading from v0.55, there are no special upgrade instructions.  If you are upgrading from an older version, please read the [release notes](http://ceph.com/docs/master/release-notes/#v0-56-bobtail).  **Authentication is now enabled by default, and if you do not adjust your ceph.conf accordingly before upgrading the system will not come up by itself.**

You can get this release from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.56.tar.gz](http://ceph.com/download/ceph-0.56.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-56-released/&bvt=rss&p=wordpress)
