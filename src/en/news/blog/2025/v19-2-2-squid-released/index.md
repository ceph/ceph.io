---
title: "v19.2.2 Squid released"
date: "2025-04-10"
author: "Yuri Weinstein"
tags:
  - "release"
  - "squid"
---

This is the second backport release in the Squid series.
We recommend all users update to this release.

## Notable Changes

- This hotfix release resolves an RGW data loss bug when CopyObject is used to copy an object onto itself. 
  S3 clients typically do this when they want to change the metadata of an existing object. 
  Due to a regression caused by an earlier fix for https://tracker.ceph.com/issues/66286, 
  any tail objects associated with such objects are erroneously marked for garbage collection. 
  RGW deployments on Squid are encouraged to upgrade as soon as possible to minimize the damage. 
  The experimental rgw-gap-list tool can help to identify damaged objects.

## Changelog

- squid: rgw: keep the tails when copying object to itself ([pr#62711](https://github.com/ceph/ceph/pull/62711), cbodley)
