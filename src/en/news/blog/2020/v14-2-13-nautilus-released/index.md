---
title: "v14.2.13 Nautilus released"
date: "2020-11-02"
author: "TheAnalyst"
---

This is the 13th backport release in the Nautilus series. This release fixes a regression introduced in v14.2.12, and a few ceph-volume & RGW fixes. We recommend users to update to this release.

## Notable Changes

- Fixed a regression that caused breakage in clusters that referred to ceph-mon hosts using dns names instead of ip addresses in the `mon_host` param in `ceph.conf` ([issue#47951](https://tracker.ceph.com/issues/47951))
    
- ceph-volume: the `lvm batch` subcommand received a major rewrite
    

## Changelog

- ceph-volume: major batch refactor ([pr#37522](https://github.com/ceph/ceph/pull/37522), Jan Fajerski)
    
- mgr/dashboard: Proper format iSCSI target portals ([pr#37060](https://github.com/ceph/ceph/pull/37060), Volker Theile)
    
- rpm: move python-enum34 into rhel 7 conditional ([pr#37747](https://github.com/ceph/ceph/pull/37747), Nathan Cutler)
    
- mon/MonMap: fix unconditional failure for init\_with\_hosts ([pr#37816](https://github.com/ceph/ceph/pull/37816), Nathan Cutler, Patrick Donnelly)
    
- rgw: allow rgw-orphan-list to note when rados objects are in namespace ([pr#37799](https://github.com/ceph/ceph/pull/37799), J. Eric Ivancich)
    
- rgw: fix setting of namespace in ordered and unordered bucket listing ([pr#37798](https://github.com/ceph/ceph/pull/37798), J. Eric Ivancich)
