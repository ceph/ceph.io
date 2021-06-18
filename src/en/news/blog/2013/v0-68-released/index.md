---
title: "v0.68 released"
date: "2013-09-04"
author: "sage"
tags: 
---

Our first development release after Dumpling has arrived!  It includes a lot of small cleanups and documentation improvements, as well as the first blueprint from the Emperor CDS to land (support for ZFS).  There are also new sample implementations for RADOS classes (cls\_hello) and a sample librados application (hello\_world) to help developers and users get started.

Notable changes since v0.67:

- ceph-fuse: fix problem with readahead vs truncate race (Yan, Zheng)
- ceph-post-file: new command to easily share logs or other files with ceph devs
- ceph: parse CEPH\_ARGS env variable
- librados: fix async aio completion wakeup
- librados: hello\_world example (Greg Farnum)
- librados: sync calls now return on commit (instead of ack) (Greg Farnum)
- mds: fix mds rejoin with legacy parent backpointer xattrs (Alexandre Oliva)
- mds: fix rare restart/failure race during fs creation
- mds: notify clients about deleted files (so they can release from their cache) (Yan, Zheng)
- mds: several bug fixes with clustered mds (Yan, Zheng)
- mon: allow logging level of cluster log (/var/log/ceph/ceph.log) to be adjusted
- mon: do not expose uncommitted state from ‘osd crush {add,set} …’ (Joao Luis)
- mon: fix byte counts (off by factor of 4) (Dan Mick, Joao Luis)
- mon: fix paxos corner case
- mon: modify ‘auth add’ semantics to make a bit more sense (Joao Luis)
- mon: new ‘osd perf’ command to dump recent performance information (Samuel Just)
- mon: new and improved ‘ceph -s’ or ‘ceph status’ command (more info, easier to read)
- monc: fix small memory leak
- new wireshark patches pulled into the tree (Kevin Jones)
- objecter: fix possible hang when cluster is unpaused (Josh Durgin)
- osd: ‘osd recover clone overlap limit’ option to limit cloning during recovery (Samuel Just)
- osd: cls\_hello OSD class example
- osd: experiemental support for ZFS (zfsonlinux.org) (Yan, Zheng)
- osd: instrument peering states (David Zafman)
- osd: properly enforce RD/WR flags for rados classes
- osd: remove old pg log on upgrade (Samuel Just)
- rgw: complete in-progress requests before shutting down
- rgw: fix S3 auth with response-\* query string params (Sylvain Munaut, Yehuda Sadeh)
- sysvinit: add condrestart command (Dan van der Ster)

For more information please refer to [the complete release notes](http://ceph.com/docs/master/release-notes/#v0-68).

Meanwhile, the v0.69 development has just gone into feature freeze and includes some preliminary infrastructure and groundwork for the RADOS tiering functionality (initially, cache pools).

You can get v0.68 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.68.tar.gz](http://ceph.com/download/ceph-0.68.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-68-released/&bvt=rss&p=wordpress)
