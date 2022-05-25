---
title: "v0.80.6 Firefly released"
date: "2014-10-02"
author: "sage"
tags:
  - "release"
  - "firefly"
---

This is a major bugfix release for firefly, fixing a range of issues in the OSD and monitor, particularly with cache tiering. There are also important fixes in librados, with the watch/notify mechanism used by librbd, and in radosgw.

A few pieces of new functionality of been backported, including improved ‘ceph df’ output (view amount of writeable space per pool), support for non-default cluster names when using sysvinit or systemd, and improved (and fixed) support for dmcrypt.

We recommend that all v0.80.x Firefly users upgrade to this release.

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.80.6.txt).

### NOTABLE CHANGES

- build: fix atomic64\_t on i386 (#8969 Sage Weil)
- build: fix build on alpha (Michael Cree, Dmitry Smirnov)
- build: fix build on hppa (Dmitry Smirnov)
- build: fix yasm detection on x32 arch (Sage Weil)
- ceph-disk: fix ‘list’ function with dmcrypt (Sage Weil)
- ceph-disk: fix dmcrypt support (Alfredo Deza)
- ceph: allow non-default cluster to be specified (#8944)
- common: fix dup log messages to mon (#9080 Sage Weil)
- global: write pid file when -f is used (systemd, upstart) (Alexandre Oliva)
- librados: fix crash when read timeout is enabled (#9362 Matthias Kiefer, Sage Weil)
- librados: fix lock leaks in error paths (#9022 Pavan Rallabhandi)
- librados: fix watch resend on PG acting set change (#9220 Samuel Just)
- librados: python: fix aio\_read handling with 0 (Mohammad Salehe)
- librbd: add interface to invalidate cached data (Josh Durgin)
- librbd: fix crash when using clone of flattened image (#8845 Josh Durgin)
- librbd: fix error path cleanup on open (#8912 Josh Durgin)
- librbd: fix null pointer check (Danny Al-Gaaf)
- librbd: limit dirty object count (Haomai Wang)
- mds: fix rstats for root and mdsdir (Yan, Zheng)
- mon: add ‘get’ command for new cache tier pool properties (Joao Eduardo Luis)
- mon: add ‘osd pool get-quota’ (#8523 Joao Eduardo Luis)
- mon: add cluster fingerprint (Sage Weil)
- mon: disallow nonsensical cache-mode transitions (#8155 Joao Eduardo Luis)
- mon: fix cache tier rounding error on i386 (Sage Weil)
- mon: fix occasional memory leak (#9176 Sage Weil)
- mon: fix reported latency for ‘osd perf’ (#9269 Samuel Just)
- mon: include ‘max avail’ in ‘ceph df’ output (Sage Weil, Xioaxi Chen)
- mon: persistently mark pools where scrub may find incomplete clones (#8882 Sage Weil)
- mon: preload erasure plugins (Loic Dachary)
- mon: prevent cache-specific settings on non-tier pools (#8696 Joao Eduardo Luis)
- mon: reduce log spam (Aanchal Agrawal, Sage Weil)
- mon: warn when cache pools have no hit\_sets enabled (Sage Weil)
- msgr: fix trivial memory leak (Sage Weil)
- osd: automatically scrub PGs with invalid stats (#8147 Sage Weil)
- osd: avoid sharing PG metadata that is not durable (Samuel Just)
- osd: cap hit\_set size (#9339 Samuel Just)
- osd: create default erasure profile if needed (#8601 Loic Dachary)
- osd: dump tid as JSON int (not string) where appropriate (Joao Eduardo Luis)
- osd: encode blacklist in deterministic order (#9211 Sage Weil)
- osd: fix behavior when cache tier has no hit\_sets enabled (#8982 Sage Weil)
- osd: fix cache tier flushing of snapshots (#9054 Samuel Just)
- osd: fix cache tier op ordering when going from full to non-full (#8931 Sage Weil)
- osd: fix crash on dup recovery reservation (#8863 Sage Weil)
- osd: fix division by zero when pg\_num adjusted with no OSDs (#9052 Sage Weil)
- osd: fix hint crash in experimental keyvaluestore\_dev backend (Hoamai Wang)
- osd: fix leak in copyfrom cancellation (#8894 Samuel Just)
- osd: fix locking for copyfrom finish (#8889 Sage Weil)
- osd: fix long filename handling in backend (#8701 Sage Weil)
- osd: fix min\_size check with backfill (#9497 Samuel Just)
- osd: fix mount/remount sync race (#9144 Sage Weil)
- osd: fix object listing + erasure code bug (Guang Yang)
- osd: fix race on reconnect to failed OSD (#8944 Greg Farnum)
- osd: fix recovery reservation deadlock (Samuel Just)
- osd: fix tiering agent arithmetic for negative values (#9082 Karan Singh)
- osd: improve shutdown order (#9218 Sage Weil)
- osd: improve subop discard logic (#9259 Samuel Just)
- osd: introduce optional sleep, io priority for scrub and snap trim (Sage Weil)
- osd: make scrub check for and remove stale erasure-coded objects (Samuel Just)
- osd: misc fixes (#9481 #9482 #9179 Sameul Just)
- osd: mix keyvaluestore\_dev improvements (Haomai Wang)
- osd: only require CRUSH features for rules that are used (#8963 Sage Weil)
- osd: preload erasure plugins on startup (Loic Dachary)
- osd: prevent PGs from falling behind when consuming OSDMaps (#7576 Sage Weil)
- osd: prevent old clients from using tiered pools (#8714 Sage Weil)
- osd: set min\_size on erasure pools to data chunk count (Sage Weil)
- osd: trim old erasure-coded objects more aggressively (Samuel Just)
- rados: enforce erasure code alignment (Lluis Pamies-Juarez)
- rgw: align object stripes with erasure pool alignment (#8442 Yehuda Sadeh)
- rgw: don’t send error body on HEAD for civetweb (#8539 Yehuda Sadeh)
- rgw: fix crash in CORS preflight request (Yehuda Sadeh)
- rgw: fix decoding of + in URL (#8702 Yehuda Sadeh)
- rgw: fix object removal on object create (#8972 Patrycja Szabowska, Yehuda Sadeh)
- systemd: use systemd-run when starting radosgw (JuanJose Galvez)
- sysvinit: support non-default cluster name (Alfredo Deza)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.80.6.tar.gz](http://ceph.com/download/ceph-0.80.6.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
