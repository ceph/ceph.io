---
title: "v0.79 released"
date: "2014-04-07"
author: "sage"
tags:
  - "release"
---

This release is intended to serve as a release candidate for firefly, which will hopefully be v0.80. No changes are being made to the code base at this point except those that fix bugs. Please test this release if you intend to make use of the new erasure-coded pools or cache tiers in firefly.

This release fixes a range of bugs found in v0.78 and streamlines the user experience when creating erasure-coded pools. There is also a raft of fixes for the MDS (multi-mds, directory fragmentation, and large directories). The main notable new piece of functionality is a small change to allow radosgw to use an erasure-coded pool for object data.

### UPGRADING

- Erasure pools created with v0.78 will no longer function with v0.79. You will need to delete the old pool and create a new one.
- A bug was fixed in the authentication handshake with big-endian architectures that prevent authentication between big- and little-endian machines in the same cluster. If you have a cluster that consists entirely of big-endian machines, you will need to upgrade all daemons and clients and restart.
- The ‘ceph.file.layout’ and ‘ceph.dir.layout’ extended attributes are no longer included in the listxattr(2) results to prevent problems with ‘cp -a’ and similar tools.
- Monitor ‘auth’ read-only commands now expect the user to have ‘rx’ caps. This is the same behavior that was present in dumpling, but in emperor and more recent development releases the ‘r’ cap was sufficient. The affected commands are:
    
    ceph auth export
    ceph auth get
    ceph auth get-key
    ceph auth print-key
    ceph auth list
    

### NOTABLE CHANGES

- ceph-conf: stop creating bogus log files (Josh Durgin, Sage Weil)
- common: fix authentication on big-endian architectures (Dan Mick)
- debian: change directory ownership between ceph and ceph-common (Sage Weil)
- init: fix startup ordering/timeout problem with OSDs (Dmitry Smirnov)
- librbd: skip zeroes/holes when copying sparse images (Josh Durgin)
- mds: cope with MDS failure during creation (John Spray)
- mds: fix crash from client sleep/resume (Zheng Yan)
- mds: misc fixes for directory fragments (Zheng Yan)
- mds: misc fixes for larger directories (Zheng Yan)
- mds: misc fixes for multiple MDSs (Zheng Yan)
- mds: remove .ceph directory (John Spray)
- misc coverity fixes, cleanups (Danny Al-Gaaf)
- mon: add erasure profiles and improve erasure pool creation (Loic Dachary)
- mon: ‘ceph osd pg-temp ...’ and primary-temp commands (Ilya Dryomov)
- mon: fix pool count in ‘ceph -s’ output (Sage Weil)
- msgr: improve connection error detection between clients and monitors (Greg Farnum, Sage Weil)
- osd: add/fix CPU feature detection for jerasure (Loic Dachary)
- osd: improved scrub checks on clones (Sage Weil, Sam Just)
- osd: many erasure fixes (Sam Just)
- osd: move to jerasure2 library (Loic Dachary)
- osd: new tests for erasure pools (David Zafman)
- osd: reduce scrub lock contention (Guang Yang)
- rgw: allow use of an erasure data pool (Yehuda Sadeh)

### DOWNLOADING

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.79.tar.gz](http://ceph.com/download/ceph-0.79.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
