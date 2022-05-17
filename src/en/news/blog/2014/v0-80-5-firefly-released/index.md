---
title: "v0.80.5 Firefly released"
date: "2014-07-29"
author: "sage"
tags:
  - "release"
  - "firefly"
---

This release fixes a few important bugs in the radosgw and fixes several packaging and environment issues, including OSD log rotation, systemd environments, and daemon restarts on upgrade.

We recommend that all v0.80.x Firefly users upgrade, particularly if they are using upstart, systemd, or radosgw.

### NOTABLE CHANGES

- ceph-dencoder: do not needlessly link to librgw, librados, etc. (Sage Weil)
- do not needlessly link binaries to leveldb (Sage Weil)
- mon: fix mon crash when no auth keys are present (#8851, Joao Eduaro Luis)
- osd: fix cleanup (and avoid occasional crash) during shutdown (#7981, Sage Weil)
- osd: fix log rotation under upstart (Sage Weil)
- rgw: fix multipart upload when object has irregular size (#8846, Yehuda Sadeh, Sylvain Munaut)
- rgw: improve bucket listing S3 compatibility (#8858, Yehuda Sadeh)
- rgw: improve delimited bucket listing (Yehuda Sadeh)
- rpm: do not restart daemons on upgrade (#8849, Alfredo Deza)

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.80.5.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.80.5.tar.gz](http://ceph.com/download/ceph-0.80.5.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
