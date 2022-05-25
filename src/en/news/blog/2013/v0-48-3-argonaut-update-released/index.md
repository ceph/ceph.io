---
title: "v0.48.3 argonaut update released"
date: "2013-01-09"
author: "sage"
tags: 
  - "release"
  - "argonaut"
---

After several months, we have an important update for the argonaut v0.48.x series.  This release contains a **critical fix that can prevent data loss or corruption** in a power loss or kernel panic situation.  There are also several fixes for the OSDs and for the radosgw.  We recommend all v0.48.x users upgrade.

Notes on upgrading:

- If you are using the undocumented ceph-disk-prepare and ceph-disk-activate tools, they have several new features and some additional functionality. Please review the changes in behavior carefully before upgrading.
- The .deb packages now require xfsprogs.

Notable changes since v0.48.2:

- filestore: fix op\_seq write order (fixes journal replay after power loss)
- osd: fix occasional indefinitely hung “slow” request
- osd: fix encoding for pool\_snap\_info\_t when talking to pre-v0.48 clients
- osd: fix heartbeat check
- osd: reduce log noise about rbd watch
- log: fixes for deadlocks in the internal logging code
- log: make log buffer size adjustable
- init script: fix for ‘ceph status’ across machines
- radosgw: fix swift error handling
- radosgw: fix swift authentication concurrency bug
- radosgw: don’t cache large objects
- radosgw: fix some memory leaks
- radosgw: fix timezone conversion on read
- radosgw: relax date format restrictions
- radosgw: fix multipart overwrite
- radosgw: stop processing requests on client disconnect
- radosgw: avoid adding port to url that already has a port
- radosgw: fix copy to not override ETAG
- common: make parsing of ip address lists more forgiving
- common: fix admin socket compatibility with old protocol (for collectd plugin)
- mon: drop dup commands on paxos reset
- mds: fix loner selection for multiclient workloads
- mds: fix compat bit checks
- ceph-fuse: fix segfault on startup when keyring is missing
- ceph-authtool: fix usage
- ceph-disk-activate: misc backports
- ceph-disk-prepare: misc backports
- debian: depend on xfsprogs (we use xfs by default)
- rpm: build rpms, some related Makefile changes

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.48.3argonaut.txt).

You can get v0.48.3 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.48.3argonaut.tar.gz](http://ceph.com/download/ceph-0.48.3argonaut.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-48-3-argonaut-update-released/&bvt=rss&p=wordpress)
