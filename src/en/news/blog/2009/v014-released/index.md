---
title: "v0.14 released"
date: "2009-09-08"
author: "sage"
tags: 
  - "planet"
---

We”ve released v0.14.  Changes since v0.13 include:

- Messenger library changes (client now initiates all tcp connections)
- Improved client/monitor protocol
- Working [Hadoop](http://hadoop.apache.org/) and [Hypertable](http://www.hypertable.org/) file system modules (many associated libceph, uclient fixes)
- man page fixes
- Debian packages fixed (now libcrush, libcrush-dev, librados, librados-dev, libceph, libceph-dev all work)
- Streamlined client startup (fewer messages, faster client id assignment)

The messaging changes are the big item here.  They greatly simplify the implementation for the kernel client.  The monitor interface is also improved: clients maintain an open session and “subscribe” to map updates they [play online casino](http://usabestonlinecasinos.com/) want (generally, all MDS maps, and the next OSD map only when I/O stalls).  This also simplifies things on the monitor, and interestingly brings the monitor design somewhat closer to [Zookeeper](http://hadoop.apache.org/zookeeper/) and [CLD](http://hail.wiki.kernel.org/index.php/CLD).

We”re currenting working on the security infrastructure (mutual authentication of clients, MDSs, OSDs, monitors), the Hadoop and Hypertable file system modules, and getting the kernel client in shape for a merge upstream.

Here are the relevant URLs:

- Git tree at [git://ceph.newdream.net/ceph.git](git://ceph.newdream.net/ceph.git)
- Direct download at [http://ceph.newdream.net/download/ceph-0.14.tar.gz](http://ceph.newdream.net/download/ceph-0.14.tar.gz)
- For Debian packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

