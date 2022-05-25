---
title: "v0.24.1 released"
date: "2011-01-10"
author: "sage"
tags: 
  - "release"
---

v0.24.1 has been released, with a number of bug fixes from v0.24.  These include:

- msgr: fix races during connection teardown
- mds: fix bug during directory removal
- mds: fix replay issue when mds restarts immediately after mkfs
- filestore: fix journal ordering problem (triggered under load)
- osd: fix recovery issue
- osd: several scrub bug fixes

This is also the first time I’ve built Ubuntu packages (for lucid and maverick), as the libcrypto++ dependency resolves to a different library version on Ubuntu and Debian sid.  If anyone has any problems there, please let us know.  libcrypto++ is unfortunately also a hassle under Redhat, as it is not included in RHEL and was only recently added to Fedora.  We plan to start building RHEL/CentOS and Fedora packages soon, and will be updating the wiki with information on gathering all the dependencies to build from source shortly.

Relevant URLs:

- Direct download at: [http://ceph.newdream.net/download/ceph-0.24.1.tar.gz](http://ceph.newdream.net/download/ceph-0.24.1.tar.gz)
- For Debian and Ubuntu packages, see [http://ceph.newdream.net/wiki/Debian](http://ceph.newdream.net/wiki/Debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-24-1-released/&bvt=rss&p=wordpress)
