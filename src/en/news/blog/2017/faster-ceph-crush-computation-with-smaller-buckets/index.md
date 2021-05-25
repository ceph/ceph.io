---
title: "Faster Ceph CRUSH computation with smaller buckets"
date: "2017-04-18"
author: "admin"
tags: 
  - "planet"
---

The [CRUSH](http://libcrush.org/main/libcrush) function maps [Ceph](http://ceph.com) placement groups (PGs) and objects to OSDs. It is used extensively in Ceph clients and daemons as well as in the Linux kernel modules and its CPU cost should be reduced to the minimum.

It is common to define the Ceph CRUSH map so that PGs use OSDs on different hosts. The hierarchy can be as simple as 100 hosts, each containing 7 OSDs. When determining which OSDs belong to a given PG, in this scenario the CRUSH function will hash each of the 100 hosts to the PG, compare the results, and select the OSDs that score the highest. That is 100 + 7 calls to the hash function.

If the hierarchy is modified to have 20 racks, each containing 5 hosts with 7 OSDs per host, we only have 20 + 5 + 7 calls to the hash function. The first 20 calls are to select the rack, the next 5 to select the host in the rack and the last 7 to select the OSD within the host.

In other words, this hierarchical subdivision of the CRUSH map reduces the number of calls to the hash function from 107 to 32. It does not have any influence on how the PGs are mapped to OSDs but it saves CPU.

### Thanks

Many thanks to Nathan Cutler for proofreading part of this post. The well written parts are from him, the rest is my doing.

Source: Dachary ([Faster Ceph CRUSH computation with smaller buckets](http://dachary.org/?p=4029))
