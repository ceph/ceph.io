---
title: "v0.67 Dumpling released"
date: "2013-08-14"
author: "sage"
tags: 
---

Another three months have gone by, and the next stable release of Ceph is ready: Dumpling!  Thank you to everyone who has contributed to this release (42 authors in all)!

This release focuses on a few major themes since v0.61 Cuttlefish:

- rgw: global namespace and region support for S3/Swift object storage
- new RESTful API endpoint for administering the cluster, based on a new and improved management API and updated CLI
- mon: stability and performance
- osd: stability performance
- cephfs: open-by-ino support (for improved NFS reexport)
- improved support for Red Hat platforms
- use of the Intel CRC32c instruction when available

As with previous stable releases, you can upgrade from previous versions of Ceph without taking the entire cluster online, as long as a few simple guidelines are followed.

- For Dumpling, we have tested upgrades from both Bobtail and Cuttlefish.  If you are running Argonaut, please upgrade to Bobtail and then to Dumpling.
- Please upgrade daemons/hosts in the following order:
    1. Upgrade ceph-common on all nodes that will use the command line ‘ceph’ utility.
    2. Upgrade all monitors (upgrade ceph package, restart ceph-mon daemons). This can happen one daemon or host at a time. Note that because cuttlefish and dumpling monitors can’t talk to each other, all monitors should be upgraded in relatively short succession to minimize the risk that an a untimely failure will reduce availability.
    3. Upgrade all osds (upgrade ceph package, restart ceph-osd daemons). This can happen one daemon or host at a time.
    4. Upgrade radosgw (upgrade radosgw package, restart radosgw daemons).

There are several small compatibility changes between Cuttlefish and Dumpling, particularly with the CLI interface.  Please see [the complete release notes](http://ceph.com/docs/master/release-notes/#v0-67-dumpling) for a summary of the changes since v0.66 and v0.61 Cuttlefish, and other possible issues that should be considered before upgrading.

Dumpling is the second Ceph release on our new three-month stable release cycle.  We are very pleased to have pulled everything together on schedule.  The next stable release, which will be code-named Emperor, is slated for three months from now (beginning of November).

You can download v0.67 Dumpling from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.com/download/ceph-0.67.tar.gz](http://ceph.com/download/ceph-0.67.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.com/docs/master/install/debian](http://ceph.com/docs/master/install/debian)
- For RPMs, see [http://ceph.com/docs/master/install/rpm](http://ceph.com/docs/master/install/rpm)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-67-dumpling-released/&bvt=rss&p=wordpress)
