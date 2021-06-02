---
title: "Exploring Ceph cache pool implementation"
date: "2014-01-04"
author: "loic"
tags: 
  - "ceph"
---

Sage Weil and Greg Farnum [presentation during the](http://www.youtube.com/watch?v=DWK5RrNRhHU&feature=share&%23038;t=2h29m18s&%23038;html5=True) [Firefly Ceph Developer Summit](http://wiki.ceph.com/Planning/CDS/CDS_Firefly) in 2013 is used as an introduction to the cache pool that is being implemented for the upcoming Firefly release.  
The [CEPH\_OSD\_OP\_COPY\_FROM etc..](https://github.com/ceph/ceph/blob/master/src/include/rados.h#L225) rados operations have been introduced in Emperor and [tested by ceph\_test\_rados](https://github.com/ceph/ceph/blob/master/src/test/osd/TestRados.cc#L156) which is [used by teuthology](https://github.com/ceph/teuthology/blob/3cffea4917d7a00220723cf013cd2f95d436c78b/teuthology/task/rados.py#L15) for integration tests by doing **COPY\_FROM** and **COPY\_GET** at random.  
After a [cache pool has been defined](https://github.com/ceph/ceph/blob/master/doc/dev/cache-pool.rst) using the [osd tier](https://github.com/ceph/ceph/blob/master/src/mon/MonCommands.h#L542) commands, objects can be promoted to the cache pool ( see [the corresponding test case](https://github.com/ceph/ceph/blob/master/src/test/librados/tier.cc#L182) ).  
The [HitSet](https://github.com/ceph/ceph/blob/master/src/osd/HitSet.cc)s keep track of which object have been read or written ( using [bloom filters](https://github.com/ceph/ceph/blob/master/src/common/bloom_filter.hpp) ).
