---
title: "v14.2.16 Nautilus released"
date: "2020-12-17"
author: "dgalloway"
---

This is the 16th backport release in the Nautilus series. This release fixes a security flaw in CephFS. We recommend users to update to this release

## Notable Changes

- CVE-2020-27781 : OpenStack Manila use of ceph\_volume\_client.py library allowed tenant access to any Ceph credential's secret. (Kotresh Hiremath Ravishankar, Ramana Raja)
    

## Changelog

- pybind/ceph\_volume\_client: disallow authorize on existing auth ids (Kotresh Hiremath Ravishankar, Ramana Raja)
