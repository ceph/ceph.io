---
title: "v0.57 released"
date: "2013-02-19"
author: "sage"
tags: 
  - "planet"
---

We’ve been spending a lot of time working on bobtail-related stabilization and bug fixes, but our next development release v0.57 is finally here!  Notable changes include:

- osd: default to libaio for the journal (some performance boost)
- osd: validate snap collections on startup
- osd: ceph-filestore-dump tool for debugging
- osd: deep-scrub omap keys/values
- ceph tool: some CLI interface cleanups
- mon: easy adjustment of crush tunables via ‘ceph osd crush tunables …’
- mon: easy creation of crush rules vai ‘ceph osd rule …’
- mon: approximate recovery, IO workload stats
- mon: avoid marking entire CRUSH subtrees out (e.g., if an entire rack goes offline)
- mon: safety check for pool deletion
- mon: new checks for identifying and reporting clock drift
- radosgw: misc fixes
- rbd: wait for udev to settle in strategic places (avoid spurious errors, failures)
- rbd-fuse: new tool, package
- mds, ceph-fuse: manage layouts via xattrs
- mds: misc bug fixes with clustered MDSs and failure recovery
- mds: misc bug fixes with readdir
- libcephfs: many fixes, cleanups with the Java bindings
- auth: ability to require new cephx signatures on messages (still off by default)

The last couple of weeks have also seen steady forward progress on v0.58, which will be out in two weeks.  Now is probably as good a time as any to mention that we’ve solidified our release timeline for the next couple of months.  Each development release will be out on a regular two-week schedule (feature-frozen and then delayed one sprint, or two weeks, for QA), culminating in the freeze for v0.61 “cuttlefish” at the beginning of April, to be released at the end of the month.

You can get v0.57 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.57.tar.gz](http://ceph.com/download/ceph-0.57.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-57-released/&bvt=rss&p=wordpress)
