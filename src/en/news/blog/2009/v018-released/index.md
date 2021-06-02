---
title: "v0.18 released"
date: "2009-12-04"
author: "sage"
tags: 
---

There’s a v0.18 release to match the latest posting of the kernel client code on the Linux email lists.  If there are no final issues there, that will be what I send to Linus for 2.6.33.

Most of the changes since v0.17 are bug fixes in the MDS and kclient.  The main other item is an authentication framework to restrict access to the cluster and it’s services to authorized clients.  Two protocols/schemes are implemented: an AUTH\_NONE framework that does no real authentication (and is essentially equivalent to what we’ve had until now) and a AUTH\_CEPHX scheme that uses  Kerberos-like tickets to mutually authenticate clients and services.

Changes since v0.17 include:

- osd: basic ENOSPC handling
- big endian fixes
- osd: improved object -> pg hash function; selectable
- crush: selectable hash functions
- mds restart bug fixes
- kclient: mds reconnect bug fixes
- fixed mds log trimming bug
- fixed mds cap vs snap deadlock
- filestore: faster flushing
- uclient,kclient: snapshot fixes
- mds: fixed recursive accounting bug
- uclient: fixes for 32bit clients
- auth: ‘none’ security framework
- mon: safely bail on write errors (e.g. ENOSPC)
- mds: fix replay/reconnect race (causing a fast client reconnect to fail)
- mds: misc journal replay, session fixes

There is a known memory leak in the MDS in this release.  It should be fixed in the unstable git shortly.

Looking forward, the main items are:

- stability
- fixing a few pressing MDS performance issues
- improving OSD interaction with btrfs (we may switch to using btrfs snapshots in place of the user transaction ioctls)
- stability

Relevant URLs:

- Direct download at [http://ceph.newdream.net/download/ceph-0.18.tar.gz](http://ceph.newdream.net/download/ceph-0.18.tar.gz)
- For Debian packages see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

