---
title: "v17.2.2 Quincy released"
date: "2022-07-21"
author: "dgalloway"
tags:
  - "release"
  - "quincy"
---

This is a hotfix release addressing two security flaws. We recommend all users update to this release.

## Notable Changes

- Users who were running OpenStack Manila to export native CephFS, who
  upgraded their Ceph cluster from Nautilus (or earlier) to a later
  major version, were vulnerable to an attack by malicious users. The
  vulnerability allowed users to obtain access to arbitrary portions of
  the CephFS filesystem hierarchy, instead of being properly restricted
  to their own subvolumes. The vulnerability is due to a bug in the
  "volumes" plugin in Ceph Manager. This plugin is responsible for
  managing Ceph File System subvolumes which are used by OpenStack
  Manila services as a way to provide shares to Manila users.

  With this hotfix, the vulnerability is fixed. Administrators who are
  concerned they may have been impacted should audit the CephX keys in
  their cluster for proper path restrictions.

  Again, this vulnerability only impacts OpenStack Manila clusters which
  provided native CephFS access to their users.

- A regression made it possible to dereference a null pointer for
  s3website requests that don't refer to a bucket resulting in an RGW
  segfault.

## Changelog

- mgr/volumes: Fix subvolume discover during upgrade ([CVE-2022-0670](https://docs.ceph.com/en/latest/security/CVE-2022-0670/), Kotresh HR)

- mgr/volumes: V2 Fix for test_subvolume_retain_snapshot_invalid_recreate ([CVE-2022-0670](https://docs.ceph.com/en/latest/security/CVE-2022-0670/), Kotresh HR)

- qa: validate subvolume discover on upgrade (Kotresh HR)

- rgw: s3website check for bucket before retargeting (Seena Fallah)
