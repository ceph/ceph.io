---
title: "v0.38 released"
date: "2011-11-11"
author: "sage"
tags: 
---

It”s a week delayed, but v0.38 is ready.  The highlights:

- osd: some peering refactoring
- osd: “replay” period is per-pool (now only affects fs data pool)
- osd: clean up old osdmaps
- osd: allow admin to revert lost objects to prior versions (or delete)
- mkcephfs: generate reasonable crush map based on “host” and “rack” fields in \[osd.NN\] sections of ceph.conf
- radosgw: bucket index improvements
- radosgw: improved swift support
- rbd: misc command line tool fixes
- debian: misc packaging fixes (including dependency breakage on upgrades)
- ceph: query daemon perfcounters via command line tool

The big upcoming items for v0.39 are RBD layering (image cloning), [online casino gambling](http://www.7thcity.org/) further improvements to radosgw”s Swift support, and some monitor failure recovery and bootstrapping improvements.  We”re also continuing work on the automation bits that the [Chef cookbooks](https://github.com/NewDreamNetwork/ceph-cookbooks) and [Juju](https://launchpad.net/canonical-ensemble) charms will use, and a [Crowbar barclamp](https://github.com/NewDreamNetwork/barclamp-ceph) was also just posted on github.  Several patches are still working their way into libvirt and qemu to improve support for RBD authentication.

You can get v0.38 from the usual places:

- Git at git://github.com/NewDreamNetwork/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.38.tar.gz](http://ceph.newdream.net/download/ceph-0.38.tar.gz)
- For Debian/Ubuntu packages see [http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages)
- For RPMs see [build.opensuse.org](https://build.opensuse.org/project/show?project=home:hmacht:storage)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-38-released/&bvt=rss&p=wordpress)
