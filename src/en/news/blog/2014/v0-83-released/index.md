---
title: "v0.83 released"
date: "2014-07-30"
author: "sage"
---

Another Ceph development release! This has been a longer cycle, so there has been quite a bit of bug fixing and stabilization in this round. There is also a bunch of packaging fixes for RPM distros (RHEL/CentOS, Fedora, and SUSE) and for systemd. We’ve also added a new librados-striper library from Sebastien Ponce that provides a generic striping API for applications to code to.

### UPGRADING

- The experimental keyvaluestore-dev OSD backend had an on-disk format change that prevents existing OSD data from being upgraded. This affects developers and testers only.
- mon-specific and osd-specific leveldb options have been removed. From this point onward users should use ‘[leveldb\_](http://ceph.com/docs/master/release-notes/#id103)‘ generic options and add the options in the appropriate sections of their configuration files. Monitors will still maintain the following monitor-specific defaults:
    
    > leveldb\_write\_buffer\_size = 32\*1024\*1024 = 33554432 // 32MB leveldb\_cache\_size = 512\*1024\*1204 = 536870912 // 512MB leveldb\_block\_size = 64\*1024 = 65536 // 64KB leveldb\_compression = false leveldb\_log = “”
    
    OSDs will still maintain the following osd-specific defaults:
    
    > leveldb\_log = “”
    

### NOTABLE CHANGES

- ceph-disk: fix dmcrypt support (Stephen Taylor)
- cephtool: fix help (Yilong Zhao)
- cephtool: test cleanup (Joao Eduardo Luis)
- doc: librados example fixes (Kevin Dalley)
- doc: many doc updates (John Wilkins)
- doc: update erasure docs (Loic Dachary, Venky Shankar)
- filestore: disable use of XFS hint (buggy on old kernels) (Samuel Just)
- filestore: fix xattr spillout (Greg Farnum, Haomai Wang)
- keyvaluestore: header cache (Haomai Wang)
- librados\_striper: striping library for librados (Sebastien Ponce)
- libs3: update to latest (Danny Al-Gaaf)
- log: fix derr level (Joao Eduardo Luis)
- logrotate: fix osd log rotation on ubuntu (Sage Weil)
- mds: fix xattr bug triggered by ACLs (Yan, Zheng)
- misc memory leaks, cleanups, fixes (Danny Al-Gaaf, Sahid Ferdjaoui)
- misc suse fixes (Danny Al-Gaaf)
- misc word size fixes (Kevin Cox)
- mon: drop mon- and osd- specific leveldb options (Joao Eduardo Luis)
- mon: ec pool profile fixes (Loic Dachary)
- mon: fix health down messages (Sage Weil)
- mon: fix quorum feature check (#8738, Greg Farnum)
- mon: ‘osd crush reweight-subtree ...’ (Sage Weil)
- mon, osd: relax client EC support requirements (Sage Weil)
- mon: some instrumentation (Sage Weil)
- objecter: flag operations that are redirected by caching (Sage Weil)
- osd: clean up shard\_id\_t, shard\_t (Loic Dachary)
- osd: fix connection reconnect race (Greg Farnum)
- osd: fix dumps (Joao Eduardo Luis)
- osd: fix erasure-code lib initialization (Loic Dachary)
- osd: fix extent normalization (Adam Crume)
- osd: fix loopback msgr issue (Ma Jianpeng)
- osd: fix LSB release parsing (Danny Al-Gaaf)
- osd: improved backfill priorities (Sage Weil)
- osd: many many core fixes (Samuel Just)
- osd, mon: config sanity checks on start (Sage Weil, Joao Eduardo Luis)
- osd: sharded threadpool to improve parallelism (Somnath Roy)
- osd: simple io prioritization for scrub (Sage Weil)
- osd: simple scrub throttling (Sage Weil)
- osd: tests for bench command (Loic Dachary)
- osd: use xfs hint less frequently (Ilya Dryomov)
- pybind/rados: fix small timeouts (John Spray)
- qa: xfstests updates (Ilya Dryomov)
- rgw: cache bucket info (Yehuda Sadeh)
- rgw: cache decoded user info (Yehuda Sadeh)
- rgw: fix multipart object attr regression (#8452, Yehuda Sadeh)
- rgw: fix radosgw-admin ‘show log’ command (#8553, Yehuda Sadeh)
- rgw: fix URL decoding (#8702, Brian Rak)
- rgw: handle empty extra pool name (Yehuda Sadeh)
- rpm: do not restart daemons on upgrade (Alfredo Deza)
- rpm: misc packaging fixes for rhel7 (Sandon Van Ness)
- rpm: split ceph-common from ceph (Sandon Van Ness)
- systemd: wrap started daemons in new systemd environment (Sage Weil, Dan Mick)
- sysvinit: less sensitive to failures (Sage Weil)
- upstart: increase max open files limit (Sage Weil)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.83.tar.gz](http://ceph.com/download/ceph-0.83.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
