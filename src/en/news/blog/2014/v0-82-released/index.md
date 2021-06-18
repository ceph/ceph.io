---
title: "v0.82 released"
date: "2014-06-27"
author: "sage"
---

This is the second post-firefly development release. It includes a range of bug fixes and some usability improvements. There are some MDS debugging and diagnostic tools, an improved ‘ceph df’, and some OSD backend refactoring and cleanup.

### NOTABLE CHANGES

- ceph-brag: add tox tests (Alfredo Deza)
- common: perfcounters now use atomics and go faster (Sage Weil)
- doc: CRUSH updates (John Wilkins)
- doc: osd primary affinity (John Wilkins)
- doc: pool quotas (John Wilkins)
- doc: pre-flight doc improvements (Kevin Dalley)
- doc: switch to an unencumbered font (Ross Turk)
- doc: update openstack docs (Josh Durgin)
- fix hppa arch build (Dmitry Smirnov)
- init-ceph: continue starting other daemons on crush or mount failure (#8343, Sage Weil)
- keyvaluestore: fix hint crash (#8381, Haomai Wang)
- libcephfs-java: build against older JNI headers (Greg Farnum)
- librados: fix rados\_pool\_list bounds checks (Sage Weil)
- mds: cephfs-journal-tool (John Spray)
- mds: improve Journaler on-disk format (John Spray)
- mds, libcephfs: use client timestamp for mtime/ctime (Sage Weil)
- mds: misc encoding improvements (John Spray)
- mds: misc fixes for multi-mds (Yan, Zheng)
- mds: OPTracker integration, dump\_ops\_in\_flight (Greg Farnum)
- misc cleanup (Christophe Courtaut)
- mon: fix default replication pool ruleset choice (#8373, John Spray)
- mon: fix set cache\_target\_full\_ratio (#8440, Geoffrey Hartz)
- mon: include per-pool ‘max avail’ in df output (Sage Weil)
- mon: prevent EC pools from being used with cephfs (Joao Eduardo Luis)
- mon: restore original weight when auto-marked out OSDs restart (Sage Weil)
- mon: use msg header tid for MMonGetVersionReply (Ilya Dryomov)
- osd: fix bogus assert during OSD shutdown (Sage Weil)
- osd: fix clone deletion case (#8334, Sam Just)
- osd: fix filestore removal corner case (#8332, Sam Just)
- osd: fix hang waiting for osdmap (#8338, Greg Farnum)
- osd: fix interval check corner case during peering (#8104, Sam Just)
- osd: fix journal-less operation (Sage Weil)
- osd: include backend information in metadata reported to mon (Sage Weil)
- rest-api: fix help (Ailing Zhang)
- rgw: check entity permission for put\_metadata (#8428, Yehuda Sadeh)

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.82.tar.gz](http://ceph.com/download/ceph-0.82.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
