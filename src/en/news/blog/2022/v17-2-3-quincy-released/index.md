---
title: "v17.2.3 Quincy released"
date: "2022-07-29"
author: "dgalloway"
tags:
  - "release"
  - "quincy"
---

This is a hotfix release that addresses a libcephsqlite crash in the mgr.

## Notable Changes

- A libcephsqlite bug that caused the mgr to crash repeatedly and die is now
  fixed. The bug was exposed due to 17.2.2 being built with gcc 8.5.0-14, which contains
  a new patch to check for invalid regex. 17.2.1 was built using gcc 8.5.0-13, which
  does not contain the invalid regex patch.

  Relevant tracker: https://tracker.ceph.com/issues/55304

  Relevant BZ: https://bugzilla.redhat.com/show_bug.cgi?id=2110797

## Changelog

- libcephsqlite: ceph-mgr crashes when compiled with gcc12 ([pr#47270](https://github.com/ceph/ceph/pull/47270), Ganesh Maharaj Mahalingam)
