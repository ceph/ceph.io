---
title: "v16.2.4 Pacific released"
date: "2021-05-14"
author: "dgalloway"
tags:
  - "release"
  - "pacific"
---

This is a hotfix release addressing a number of security issues and regressions. We recommend all users update to this release.

  
  

## Changelog

- mgr/dashboard: fix base-href: revert it to previous approach ([issue#50684](https://tracker.ceph.com/issues/50684), Avan Thakkar)
    
- mgr/dashboard: fix cookie injection issue ([CVE-2021-3509](https://docs.ceph.com/en/latest/security/CVE-2021-3509), Ernesto Puerta)
    
- mgr/dashboard: fix set-ssl-certificate{,-key} commands ([issue#50519](https://tracker.ceph.com/issues/50519), Alfonso Martínez)
    
- rgw: RGWSwiftWebsiteHandler::is\_web\_dir checks empty subdir\_name ([CVE-2021-3531](https://docs.ceph.com/en/latest/security/CVE-2021-3531), Felix Huettner)
    
- rgw: sanitize \\r in s3 CORSConfiguration's ExposeHeader ([CVE-2021-3524](https://docs.ceph.com/en/latest/security/CVE-2021-3524), Sergey Bobrov, Casey Bodley)
    
- systemd: remove ProtectClock=true for ceph-osd@.service ([issue#50347](https://tracker.ceph.com/issues/50347), Wong Hoi Sing Edison)
