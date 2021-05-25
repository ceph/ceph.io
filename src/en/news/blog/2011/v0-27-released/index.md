---
title: "v0.27 released"
date: "2011-04-24"
author: "sage"
tags: 
  - "planet"
---

v0.27 is done!  This mostly bugfixes, cleanups, and incremental

improvements.  Notably:

\* lots of cleanups in config file loading, handling, to make library

behavior sane, warn on config file errors, etc.

\* osd: fix out of order ack bug

\* mount.ceph: uses kernel keys interface (when available) to pass secrets

\* osd, mon: use new syncfs() syscall where available

\* librados: compound object operation support

\* librbd: snapshot images no longer writeable

\* librbd: rollback to snapshot and other misc fixes

\* mds: journal replay cleanups, performance, bug fixes

\* mds: many clustered mds fixes (mostly with rename and recovery)

\* mds: standby-replay mode fixes

\* mds: robust lookuphash for better nfs reexport support

\* mon: bugfixes with mds takeover

\* obsync: synchronize object buckets between s3, directory, swift, rados

\* osd: misc recovery fixes

\* radosgw: dup bucket creation fixes

\* radosgw: many small protocol fixes

As part of the radosgw work we’ve created s3-tests.git, which includes a

bunch of simple tests to verify implementations of the s3 protocol.  See

git://ceph.newdream.net/git/s3-tests.git

http://ceph.newdream.net/git/?p=s3-tests.git;a=summary

For v0.28 we’re focusing on the OSD cluster, radosgw, and continuing with

the MDS clustering fixes.  Sam and Josh are working on a refactor in the

OSD peering code that will make peering more understandable, verifiable,

and (we hope) less buggy.

Relevant URLs:

\* Direct download at: http://ceph.newdream.net/download/ceph-0.27.tar.gz

\* For Debian and Ubuntu packages, see http://ceph.newdream.net/wiki/Debian

v0.27 is done!  This mostly bugfixes, cleanups, and incremental improvements.  Notably:

- lots of cleanups in config file loading, handling, to make library behavior sane, warn on config file errors, etc.
- osd: fix out of order ack bug
- mount.ceph: uses kernel keys interface (when available) to pass secrets
- osd, mon: use new syncfs() syscall where available
- librados: compound object operation support
- librbd: snapshot images no longer writeable
- librbd: rollback to snapshot and other misc fixes
- mds: journal replay cleanups, performance, bug fixes
- mds: many clustered mds fixes (mostly with rename and recovery)
- mds: standby-replay mode fixes
- mds: robust lookuphash for better nfs reexport support
- mon: bugfixes with mds takeover
- obsync: synchronize object buckets between s3, directory, swift, rados
- osd: misc recovery fixes
- radosgw: dup bucket creation fixes
- radosgw: many small protocol fixes

As part of the radosgw work we’ve created s3-tests.git, which includes a  bunch of simple tests to verify implementations of the s3 protocol.  See

- [git://ceph.newdream.net/git/s3-tests.git](http://ceph.newdream.net/git/?p=s3-tests.git;a=summary)

For v0.28 we’re focusing on the OSD cluster, radosgw, and continuing with the MDS clustering fixes.  Sam and Josh are working on a refactor in the  OSD peering code that will make peering more understandable, verifiable, and (we hope) less buggy.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.27.tar.gz](http://ceph.newdream.net/download/ceph-0.27.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

