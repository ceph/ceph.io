---
title: "v0.56.5 released"
date: "2013-05-03"
author: "sage"
tags: 
---

Behold, another Bobtail update!  This one serves three main purposes: it fixes a small issue with monitor features that is important when upgrading from argonaut -> bobtail -> cuttlefish, it backports many changes to the ceph-disk helper scripts that allow bobtail clusters to be deployed with [the new ceph-deploy tool](http://ceph.com/docs/master/rados/deployment/) or [our chef cookbooks](https://github.com/ceph/ceph-cookbooks), and it fixes several important bugs in librbd.  There is also, of course, the usual collection of important bug fixes in other parts of the system.

Notable changes include:

- mon: fix recording of quorum feature set (important for argonaut -> bobtail -> cuttlefish mon upgrades)
- osd: minor peering bug fixes
- osd: fix a few bugs when pools are renamed
- osd: fix occasionally corrupted pg stats
- osd: fix behavior when broken v0.56\[.0\] clients connect
- rbd: avoid FIEMAP ioctl on import (it is broken on some kernels)
- librbd: fixes for several request/reply ordering bugs
- librbd: only set STRIPINGV2 feature on new images when needed
- librbd: new async flush method to resolve qemu hangs (requires Qemu update as well)
- librbd: a few fixes to flatten
- ceph-disk: support for dm-crypt
- ceph-disk: many backports to allow bobtail deployments with ceph-deploy, chef
- sysvinit: do not stop starting daemons on first failure
- udev: fixed rules for redhat-based distros
- build fixes for raring

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.56.5.txt).

You can get v0.56.5 from the usual places:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.56.5.tar.gz](http://ceph.com/download/ceph-0.56.5.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-56-5-released/&bvt=rss&p=wordpress)
