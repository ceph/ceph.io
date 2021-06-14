---
title: "v14.2.4 nautilus released"
date: "2019-09-17"
author: "TheAnalyst"
---

This is the fourth release in the Ceph Nautilus stable release series. Its sole purpose is to fix a regression that found its way into the previous release.

## Notable Changes

- The ceph-volume in Nautilus v14.2.3 was found to contain a serious regression, described in `https://tracker.ceph.com/issues/41660`, which prevented deployment tools like ceph-ansible, DeepSea, Rook, etc. from deploying/removing OSDs.

## Changelog

- ceph-volume: fix stderr failure to decode/encode when redirected ([pr#30300](https://github.com/ceph/ceph/pull/30300), Alfredo Deza)
