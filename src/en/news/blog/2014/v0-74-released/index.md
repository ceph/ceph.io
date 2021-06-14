---
title: "v0.74 released"
date: "2014-01-02"
author: "sage"
tags: 
  - "planet"
---

This release includes a few substantial pieces for Firefly, including a long-overdue switch to 3x replication by default and a switch to the “new” CRUSH tunables by default (supported since bobtail). There is also a fix for a long-standing radosgw bug (stalled GET) that has already been backported to emperor and dumpling.

Upgrading:

- We now default to the ‘bobtail’ CRUSH tunable values that are first supported by Ceph clients in bobtail (v0.48) and Linux kernel version v3.9. If you plan to access a newly created Ceph cluster with an older kernel client, you should use ‘ceph osd crush tunables legacy’ to switch back to the legacy behavior. Note that making that change will likely result in some data movement in the system, so adjust the setting before populating the new cluster with data.
- We now set the HASHPSPOOL flag on newly created pools (and new clusters) by default. Support for this flag first appeared in v0.64; v0.67 Dumpling is the first major release that supports it. It is first supported by the Linux kernel version v3.9. If you plan to access a newly created Ceph cluster with an older kernel or clients (e.g, librados, librbd) from a pre-dumpling Ceph release, you should add ‘osd pool default flag hashpspool = false’ to the ‘\[global\]’ section of your ‘ceph.conf’ prior to creating your monitors (e.g., after ‘ceph-deploy new’ but before ‘ceph-deploy mon create …’).
- The configuration option ‘osd pool default crush rule’ is deprecated and replaced with ‘osd pool default crush replicated ruleset’. ‘osd pool default crush rule’ takes precedence for backward compatibility and a deprecation warning is displayed when it is used.

Notable changes

- buffer: some zero-copy groundwork (Josh Durgin)
- ceph-disk: avoid fd0 (Loic Dachary)
- crush: default to bobtail tunables (Sage Weil)
- crush: many additional tests (Loic Dachary)
- crush: misc fixes, cleanups (Loic Dachary)
- crush: new rule steps to adjust retry attempts (Sage Weil)
- debian: integrate misc fixes from downstream packaging (James Page)
- doc: big update to install docs (John Wilkins)
- libcephfs: fix resource leak (Zheng Yan)
- misc coverity fixes (Xing Lin, Li Wang, Danny Al-Gaaf)
- misc portability fixes (Noah Watkins, Alan Somers)
- mon, osd: new ‘erasure’ pool type (still not fully supported)
- mon: add ‘mon getmap EPOCH’ (Joao Eduardo Luis)
- mon: collect misc metadata about osd (os, kernel, etc.), new ‘osd metadata’ command (Sage Weil)
- osd: default to 3x replication
- osd: do not include backfill targets in acting set (David Zafman)
- osd: new ‘chassis’ type in default crush hierarchy (Sage Weil)
- osd: requery unfound on stray notify (#6909) (Samuel Just)
- osd: some PGBackend infrastructure (Samuel Just)
- osd: support for new ‘memstore’ (memory-backed) backend (Sage Weil)
- rgw: fix fastcgi deadlock (do not return data from librados callback) (Yehuda Sadeh)
- rgw: fix reading bucket policy (#6940)
- rgw: fix use-after-free when releasing completion handle (Yehuda Sadeh)

Getting v0.74:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.74.tar.gz](http://ceph.com/download/ceph-0.74.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-74-released/&bvt=rss&p=wordpress)
