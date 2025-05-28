---
title: "v17.2.9 Quincy released"
date: "2025-05-27"
author: "Yuri Weinstein"
tags:
  - "release"
  - "quincy"
---

This is the ninth backport (hotfix) release in the Quincy series. We recommend that all users update to this release.

Please be aware that this hotfix was finalized after its end-of-life (EOL) declaration and subsequent removal from the build system. As a result, container builds were not created, and the hotfix has only been subject to limited testing.

Users should expect to see the el8 rpm subdirectory empty and the "dnf" commands are expected
to fail with 17.2.9.
They can choose to use 17.2.9 RPM packages for centos 8/el8 provided by CERN as a community
member or stay at 17.2.7 following instructions
from https://docs.ceph.com/en/latest/install/get-packages/#rhel, the ceph.repo file should
point to https://download.ceph.com/rpm-17.2.7/el8 instead of https://download.ceph.com/rpm-quincy/el8

These CERN packages come with no warranty and have not been tested. The software in them has been
tested by Ceph according to [platforms](https://docs.ceph.com/en/latest/start/os-recommendations/#platforms).
The repository for el8 builds is hosted by CERN on [Linux@CERN](https://linuxsoft.cern.ch/repos/ceph-ext-quincy8el-stable/).
The public part of the GPG key used to sign the
packages is available at [RPM-GPG-KEY-Ceph-Community](https://linuxsoft.cern.ch/repos/RPM-GPG-KEY-Ceph-Community).

Also note that Ceph now builds against OpenSSL 3.5.0, which may affect EL package users who are on distros that
still reference an older version.

Notable Changes
---------------

This release fixes a critical BlueStore regression in versions 17.2.8 (#63122). Users running this releas are recommended to upgrade at the earliest convenience.

Changelog
---------

- [quincy] os/bluestore: fix \_extend\_log seq advance ([pr#63122](https://github.com/ceph/ceph/pull/63122), aclamk)

