---
title: "v0.56.3 released"
date: "2013-02-14"
author: "sage"
tags: 
  - "planet"
---

We’ve fixed an important bug that a few users were hitting with unresponsive OSDs and internal heartbeat timeouts.  This, along with a range of less critical fixes, was sufficient to justify another point release.  Any production users should upgrade.

Notable changes include:

- osd: flush peering work queue prior to start
- osd: persist osdmap epoch for idle PGs
- osd: fix and simplify connection handling for heartbeats
- osd: avoid crash on invalid admin command
- mon: fix rare races with monitor elections and commands
- mon: enforce that OSD reweights be between 0 and 1 (NOTE: not CRUSH weights)
- mon: approximate client, recovery bandwidth logging
- radosgw: fixed some XML formatting to conform to Swift API inconsistency
- radosgw: fix usage accounting bug; add repair tool
- radosgw: make fallback URI configurable (necessary on some web servers)
- librbd: fix handling for interrupted ‘unprotect’ operations
- mds, ceph-fuse: allow file and directory layouts to be modified via virtual xattrs

You can get v0.56.3 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.56.3.tar.gz](http://ceph.com/download/ceph-0.56.3.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

