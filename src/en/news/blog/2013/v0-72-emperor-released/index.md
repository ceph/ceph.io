---
title: "v0.72 Emperor Released"
date: "2013-11-09"
author: "sage"
tags: 
---

This is the fifth major release of Ceph, the fourth since adopting a 3-month development cycle. This release brings several new features, including multi-datacenter replication for the radosgw, improved usability, and lands a lot of incremental performance and internal refactoring work to support upcoming features in Firefly.

Highlights include:

- common: improved crc32c performance
- librados: new example client and class code
- mds: many bug fixes and stability improvements
- mon: health warnings when pool pg\_num values are not reasonable
- mon: per-pool performance stats
- osd, librados: new object copy primitives
- osd: improved interaction with backend file system to reduce latency
- osd: much internal refactoring to support ongoing erasure coding and tiering support
- rgw: bucket quotas
- rgw: improved CORS support
- rgw: performance improvements
- rgw: validate S3 tokens against Keystone

Coincident with core Ceph, the Emperor release also brings:

- radosgw-agent: support for multi-datacenter replication for disaster recovery (buliding on the multi-site features that appeared in Dumpling)
- tgt: improved support for iSCSI via upstream tgt

**Upgrading**

There are no specific upgrade restrictions on the order or sequence of upgrading from 0.67.x Dumpling.  We normally suggest a rolling upgrade of monitors first, and then OSDs, followed by the radosgw and ceph-mds daemons (if any).

It is also possible to do a rolling upgrade from 0.61.x Cuttlefish, but there are ordering restrictions. (This is the same set of restrictions for Cuttlefish to Dumpling.)

1. Upgrade ceph-common on all nodes that will use the command line ‘ceph’ utility.
2. Upgrade all monitors (upgrade ceph package, restart ceph-mon daemons). This can happen one daemon or host at a time. Note that because cuttlefish and dumpling monitors can’t talk to each other, all monitors should be upgraded in relatively short succession to minimize the risk that an a untimely failure will reduce availability.
3. Upgrade all osds (upgrade ceph package, restart ceph-osd daemons). This can happen one daemon or host at a time.
4. Upgrade radosgw (upgrade radosgw package, restart radosgw daemons).

There are several minor compatibility changes in the librados API that direct users of librados should be aware of.  For a full summary of those changes, please see the [complete release notes](http://ceph.com/docs/master/release-notes/#v0-72-emperor).

The next major release of Ceph, Firefly, is scheduled for release in February of 2014.

You can download v0.72 Emperor from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.72.tar.gz](http://ceph.com/download/ceph-0.72.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/next/install/get-packages/#id1](http://ceph.com/docs/next/install/get-packages/#id1)
- For RPMs, see [http://ceph.com/docs/next/install/get-packages/#id2](http://ceph.com/docs/next/install/get-packages/#id2)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-72-emperor-released/&bvt=rss&p=wordpress)
