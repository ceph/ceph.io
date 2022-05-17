---
title: "v0.87.2 Giant released"
date: "2015-04-27"
author: "sage"
tags:
  - "release"
  - "giant"
---

This is the second (and possibly final) point release for Giant.

We recommend all v0.87.x Giant users upgrade to this release.

### NOTABLE CHANGES

- ceph-objectstore-tool: only output unsupported features when incompatible (#11176 David Zafman)
- common: do not implicitly unlock rwlock on destruction (Federico Simoncelli)
- common: make wait timeout on empty queue configurable (#10818 Samuel Just)
- crush: pick ruleset id that matches and rule id (Xiaoxi Chen)
- crush: set\_choose\_tries = 100 for new erasure code rulesets (#10353 Loic Dachary)
- librados: check initialized atomic safely (#9617 Josh Durgin)
- librados: fix failed tick\_event assert (#11183 Zhiqiang Wang)
- librados: fix looping on skipped maps (#9986 Ding Dinghua)
- librados: fix op submit with timeout (#10340 Samuel Just)
- librados: pybind: fix memory leak (#10723 Billy Olsen)
- librados: pybind: keep reference to callbacks (#10775 Josh Durgin)
- librados: translate operation flags from C APIs (Matthew Richards)
- libradosstriper: fix write\_full on ENOENT (#10758 Sebastien Ponce)
- libradosstriper: use strtoll instead of strtol (Dongmao Zhang)
- mds: fix assertion caused by system time moving backwards (#11053 Yan, Zheng)
- mon: allow injection of random delays on writes (Joao Eduardo Luis)
- mon: do not trust small osd epoch cache values (#10787 Sage Weil)
- mon: fail non-blocking flush if object is being scrubbed (#8011 Samuel Just)
- mon: fix division by zero in stats dump (Joao Eduardo Luis)
- mon: fix get\_rule\_avail when no osds (#10257 Joao Eduardo Luis)
- mon: fix timeout rounds period (#10546 Joao Eduardo Luis)
- mon: ignore osd failures before up\_from (#10762 Dan van der Ster, Sage Weil)
- mon: paxos: reset accept timeout before writing to store (#10220 Joao Eduardo Luis)
- mon: return if fs exists on ‘fs new’ (Joao Eduardo Luis)
- mon: use EntityName when expanding profiles (#10844 Joao Eduardo Luis)
- mon: verify cross-service proposal preconditions (#10643 Joao Eduardo Luis)
- mon: wait for osdmon to be writeable when requesting proposal (#9794 Joao Eduardo Luis)
- mount.ceph: avoid spurious error message about /etc/mtab (#10351 Yan, Zheng)
- msg/simple: allow RESETSESSION when we forget an endpoint (#10080 Greg Farnum)
- msg/simple: discard delay queue before incoming queue (#9910 Sage Weil)
- osd: clear\_primary\_state when leaving Primary (#10059 Samuel Just)
- osd: do not ignore deleted pgs on startup (#10617 Sage Weil)
- osd: fix FileJournal wrap to get header out first (#10883 David Zafman)
- osd: fix PG leak in SnapTrimWQ (#10421 Kefu Chai)
- osd: fix journalq population in do\_read\_entry (#6003 Samuel Just)
- osd: fix operator== for op\_queue\_age\_hit and fs\_perf\_stat (#10259 Samuel Just)
- osd: fix rare assert after split (#10430 David Zafman)
- osd: get pgid ancestor from last\_map when building past intervals (#10430 David Zafman)
- osd: include rollback\_info\_trimmed\_to in {read,write}\_log (#10157 Samuel Just)
- osd: lock header\_lock in DBObjectMap::sync (#9891 Samuel Just)
- osd: requeue blocked op before flush it was blocked on (#10512 Sage Weil)
- osd: tolerate missing object between list and attr get on backfill (#10150 Samuel Just)
- osd: use correct atime for eviction decision (Xinze Chi)
- rgw: flush XML header on get ACL request (#10106 Yehuda Sadeh)
- rgw: index swift keys appropriately (#10471 Hemant Bruman, Yehuda Sadeh)
- rgw: send cancel for bucket index pending ops (#10770 Baijiaruo, Yehuda Sadeh)
- rgw: swift: support X\_Remove\_Container-Meta-{key} (#01475 Dmytro Iurchenko)

For more detailed information, see [the complete changelog](http://docs.ceph.com/docs/master/_downloads/v0.87.2.txt).

### GETTING CEPH

- Git at [git://github.com/ceph/ceph.git](http://github.com/ceph/ceph)
- Tarball at [http://ceph.com/download/ceph-0.87.2.tar.gz](http://ceph.com/download/ceph-0.87.2.tar.gz)
- For packages, see [http://ceph.com/docs/master/install/get-packages](http://ceph.com/docs/master/install/get-packages)
- For ceph-deploy, see [http://ceph.com/docs/master/install/install-ceph-deploy](http://ceph.com/docs/master/install/install-ceph-deploy)
