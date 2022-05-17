---
title: "v14.2.7 nautilus released"
date: "2020-02-03"
author: "TheAnalyst"
tags:
  - "release"
  - "nautilus"
---

This is the seventh update to the Ceph Nautilus release series. This is a hotfix release primarily fixing a couple of security issues. We recommend that all users upgrade to this release.

## Notable Changes

- CVE-2020-1699: Fixed a path traversal flaw in Ceph dashboard that could allow for potential information disclosure (Ernesto Puerta)
- CVE-2020-1700: Fixed a flaw in RGW beast frontend that could lead to denial of service from an unauthenticated client (Or Friedmann)
