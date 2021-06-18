---
title: "v14.2.15 Nautilus released"
date: "2020-11-24"
author: "dgalloway"
---

This is the 15th backport release in the Nautilus series. This release fixes a ceph-volume regression introduced in v14.2.13 and includes few other fixes. We recommend users to update to this release.

## Notable Changes

- ceph-volume: Fixes lvm batch --auto, which breaks backward compatibility when using non rotational devices only (SSD and/or NVMe).
    
- BlueStore: Fixes a bug in collection\_list\_legacy which makes pgs inconsistent during scrub when running mixed versions of osds, prior to 14.2.12 with newer
    

- MGR: progress module can now be turned on/off, using the commands: `ceph progress on` and `ceph progress off`.

## Changelog

- ceph-volume: fix filestore/dmcrypt activate ([pr#38198](https://github.com/ceph/ceph/pull/38198), Guillaume Abrioux)
    
- ceph-volume: fix lvm batch auto with full SSDs ([pr#38046](https://github.com/ceph/ceph/pull/38046), Dimitri Savineau, Guillaume Abrioux)
    
- os/bluestore: fix "end reached" check in collection\_list\_legacy ([pr#38100](https://github.com/ceph/ceph/pull/38100), Mykola Golub)
    
- mgr/progress: introduce turn off/on feature ([pr#38173](https://github.com/ceph/ceph/pull/38173), kamoltat)
