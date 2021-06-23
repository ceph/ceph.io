---
title: "v0.67.7 Dumpling released"
date: "2014-02-20"
author: "sage"
---

This Dumpling point release fixes a few critical issues in v0.67.6.

All v0.67.6 users are urgently encouraged to upgrade. We also recommend that all v0.67.5 (or older) users upgrade.

The v0.67.7 point release contains a number of important fixed for the OSD, monitor, and radosgw. Most significantly, a change that forces large object attributes to spill over into leveldb has been backported that can prevent objects and the cluster from being damaged by large attributes (which can be induced via the radosgw). There is also a set of fixes that improves data safety and RADOS semantics when the cluster becomes full and then non-full.

### UPGRADING

- Once you have upgraded a radosgw instance or OSD to v0.67.7, you should not downgrade to a previous version.
- The OSD has long contained a feature that allows large xattrs to spill over into the leveldb backing store in situations where not all local file systems are able to store them reliably. This option is now enabled unconditionally in order to avoid rare cases where storing large xattrs renders the object unreadable. This is known to be triggered by very large multipart objects, but could be caused by other workloads as well. Although there is some small risk that performance for certain workloads will degrade, it is more important that data be retrievable. Note that newer versions of Ceph (e.g., firefly) do some additional work to avoid the potential performance regression in this case, but that is current considered too complex for backport to the Dumpling stable series.
- It is very dangerous to downgrade from v0.67.6 to a prior version of Dumpling. If the old version does not have ‘filestore xattr use omap = true’ it may not be able to read all xattrs for an object and can cause undefined behavior.

### NOTABLE CHANGES (v0.67.7)

- ceph-disk: additional unit tests
- librbd: revert caching behavior change in v0.67.6
- osd: fix problem reading xattrs due to incomplete backport in v0.67.6
- radosgw-admin: fix reading object policy

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.67.7.txt).

### NOTABLE CHANGES (v0.67.6)

- ceph-disk: misc bug fixes, particularly on RHEL (Loic Dachary, Alfredo Deza, various)
- ceph-fuse, libcephfs: fix crash from read over certain sparseness patterns (Sage Weil)
- ceph-fuse, libcephfs: fix integer overflow for sync reads racing with appends (Sage Weil)
- ceph.spec: fix udev rule when building RPM under RHEL (Derek Yarnell)
- common: fix crash from bad format from admin socket (Loic Dachary)
- librados: add optional timeouts (Josh Durgin)
- librados: do not leak budget when resending localized or redirected ops (Josh Durgin)
- librados, osd: fix and improve full cluster handling (Josh Durgin)
- librbd: fix use-after-free when updating perfcounters during image close (Josh Durgin)
- librbd: remove limit on objects in cache (Josh Durgin)
- mon: avoid on-disk full OSDMap corruption from pg\_temp removal (Sage Weil)
- mon: avoid stray pg\_temp entries from pool deletion race (Joao Eduardo Luis)
- mon: do not generate spurious MDSMaps from laggy daemons (Joao Eduardo Luis)
- mon: fix error code from ‘osd rm|down|out|in ...’ commands (Loic Dachary)
- mon: include all health items in summary output (John Spray)
- osd: fix occasional race/crash during startup (Sage Weil)
- osd: ignore stray OSDMap messages during init (Sage Weil)
- osd: unconditionally let xattrs overflow into leveldb (David Zafman)
- rados: fix a few error checks for the CLI (Josh Durgin)
- rgw: convert legacy bucket info objects on demand (Yehuda Sadeh)
- rgw: fix bug causing system users to lose privileges (Yehuda Sadeh)
- rgw: fix CORS bugs related to headers and case sensitivity (Robin H. Johnson)
- rgw: fix multipart object listing (Yehuda Sadeh)
- rgw: fix racing object creations (Yehuda Sadeh)
- rgw: fix racing object put and delete (Yehuda Sadeh)
- rgw: fix S3 auth when using response-\* query string params (Sylvain Munaut)
- rgw: use correct secret key for POST authentication (Robin H. Johnson)

For more detailed information, see [the complete changelog](http://ceph.com/docs/master/_downloads/v0.67.6.txt). You can get v0.67.7 from the usual locations:

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.67.7.tar.gz](http://ceph.com/download/ceph-0.67.7.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
