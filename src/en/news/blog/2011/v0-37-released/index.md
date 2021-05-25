---
title: "v0.37 released"
date: "2011-10-18"
author: "sage"
tags: 
  - "planet"
---

v0.37 is ready.  Notable changes this time around:

- radosgw: backend on-disk format changes
- radosgw: improved logging
- radosgw: package improvements (init script, fixed deps)
- osd: bug fixes!
- teuthology: btrfs testing

If you are currently storing data with radosgw, you will need to export and reimport your data as the backend storage strategy has changed to improve scaling.

Other work not directly in the release includes work with the Chef cookbooks (will hit ceph-cookbooks.git soon), an RBD backend for Glance (OpenStack), and ongoing work improving the libvirt support for qemu/KVM + RBD.  We’ve also been fighting with the ceph.spec file to get something that will build on all of Fedora, RHEL/CentOS, openSUSE, and SLES (with mixed success).

You can get v0.37 from:

- Git at git://github.com/NewDreamNetwork/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.37.tar.gz](http://ceph.newdream.net/download/ceph-0.37.tar.gz)
- For Debian/Ubuntu packages see [http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/latest/ops/install/mkcephfs/#installing-the-packages)
- For RPMs see [build.opensuse.org](https://build.opensuse.org/package/show?package=ceph&project=home:liewegas).

