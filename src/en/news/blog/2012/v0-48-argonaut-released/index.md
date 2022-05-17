---
title: "v0.48 “argonaut” released"
date: "2012-07-03"
author: "sage"
tags: 
  - "release"
  - "argonaut"
---

![](images/argonaut-600.gif "argonaut")

We’re pleased to annouce the release of Ceph v0.48, code-named “[argonaut](http://en.wikipedia.org/wiki/Argonaut_(animal)).”  This release will be the basis of our first long-term stable branch.  Although we will continue to make releases every 3-4 weeks, this stable release will be maintained with bug fixes and select non-destabilizing feature additions for much longer than that.  Argonaut is recommended for production users of rados and librados, rbd and librbd, and radosgw.

The upgrade to v0.48 argonaut from previous versions includes a disk-format upgrade.  Please note:

- You will not be able to downgrade from v0.48 to a previous version.
- Each ceph-osd will need some time to convert its local data before rejoining the cluster.  If you need to maintain availability, you will need to do a “rolling upgrade” by restarting daemons on each host or rack in sequence and allowing the cluster to recover before moving on to the next one.  Note that for non-btrfs file systems especially this can be slow (many hours); plan accordingly.
- The ceph tool’s -s and -w commands from previous version are incompatible with this version.  Upgrade your client tools with your monitor if you rely on those commands.

The highlights for this release include:

- osd: stability improvements
- osd: capability model simplification
- osd: simpler/safer –mkfs (no longer removes all files; safe to re-run on active osd)
- osd: potentially buggy FIEMAP behavior disabled by default
- rbd: caching improvements
- rbd: improved instrumentation
- rbd: bug fixes
- radosgw: new, scalable usage logging infrastructure
- radosgw: per-user bucket limits
- mon: streamlined process for setting up authentication keys
- mon: stability improvements
- mon: log message throttling
- doc: improved documentation (ceph, rbd, radosgw, chef, etc.)
- config: new default locations for daemon keyrings
- config: arbitrary variable substitutions
- improved ‘admin socket’ daemon admin interface (ceph –admin-daemon …)
- chef: support for multiple monitor clusters
- upstart: basic support for monitors, mds, radosgw; osd support still a work in progress.

The new default keyring locations mean that when enabling authentication (‘auth supported = cephx’), keyring locations do not need to be specified if the keyring file is located inside the daemon’s data directory (/var/lib/ceph/$type/ceph-$id by default).

There is also a lot of librbd code in this release that is laying the groundwork for the upcoming layering functionality, but is not actually used.  Likewise, the upstart support is still incomplete and not recommended; we will backport that functionality later if it turns out to be non-disruptive.

For more information, please see the [complete release notes](http://ceph.com/docs/master/release-notes/).

The current focus for upcoming development releases is on radosgw stability, RBD stability, and RBD layering.  There is also ongoing ‘devops’ work on integration with management and provisioning tools like upstart, Chef, Juju, and Crowbar.  A major refactor of the OSD code is about to be merged which will improve performance and scalability, and our testing coverage continues to improve.

You can get v0.48 argonaut from the usual locations:

- Git at git://[github.com/ceph/ceph](http://github.com/ceph/ceph).git
- Tarball at [http://ceph.newdream.net/download/ceph-0.48.tar.gz](http://ceph.newdream.net/download/ceph-0.48.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/install/debian](http://ceph.newdream.net/docs/master/install/debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-48-argonaut-released/&bvt=rss&p=wordpress)
