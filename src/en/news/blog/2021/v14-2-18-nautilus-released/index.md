---
title: "v14.2.18 Nautilus released"
date: "2021-03-15"
author: "dgalloway"
tags:
  - "release"
  - "nautilus"
---

This is the 18th backport release in the Nautilus series. It fixes a regression introduced in 14.2.17 in which the manager module tries to use a couple python modules that do not exist in some environments. We recommend users to update to this release

## Notable Changes

- This release fixes issues loading the dashboard and volumes manager modules in some environments.
    

## Changelog

- nautilus: .github: add workflow for adding labels and milestone ([pr#39926](https://github.com/ceph/ceph/pull/39926), Kefu Chai, Ernesto Puerta)
    
- nautilus: mgr/dashboard: Python2 Cookie module import fails on Python3 ([pr#40116](https://github.com/ceph/ceph/pull/40116), Volker Theile)
    
- nautilus: mgr/volumes: don't require typing ([pr#40095](https://github.com/ceph/ceph/pull/40095), Josh Durgin)
    
- nautilus: qa/suites/krbd: address recent issues caused by newer kernels ([pr#40064](https://github.com/ceph/ceph/pull/40064), Ilya Dryomov)
