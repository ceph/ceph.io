---
title: "v18.2.2 Reef released"
date: "2024-03-11"
author: "Yuri Weinstein"
tags:
  - "release"
  - "reef"
---

This is a hotfix release that resolves several flaws including Prometheus crashes and an encoder fix.

## Notable Changes

* mgr/Prometheus: refine the orchestrator availability check to prevent against crashes
  in the prometheus module during startup. Introduce additional checks to handle
  daemon_ids generated within the Rook environment, thus preventing potential issues
  during RGW metrics metadata generation.

## Changelog

- mgr/prometheus: fix orch check to prevent Prometheus crash ([pr#55491](https://github.com/ceph/ceph/pull/55491), Redouane Kachach)

- debian/\*<span></span>.postinst: add adduser as a dependency and specify --home when adduser ([pr#55709](https://github.com/ceph/ceph/pull/55709), Kefu Chai)

- src/osd/OSDMap<span></span>.cc: Fix encoder to produce same bytestream ([pr#55712](https://github.com/ceph/ceph/pull/55712), Kamoltat)
