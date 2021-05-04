---
title: "Ceph erasure coding overhead in a nutshell"
date: "2015-03-27"
author: "dmsimard"
tags: 
  - "ceph"
  - "planet"
---

Calculating the storage overhead of a replicated pool in [Ceph](http://ceph.com/) is easy. You divide the amount of space you have by the “size” (amount of replicas) parameter of your storage pool.

Let’s work with some rough numbers: 64 OSDs of 4TB each.

Raw size: 64 \* 4  = 256TB
Size 2  : 128 / 2 = 128TB
Size 3  : 128 / 3 = 85.33TB

Replicated pools are expensive in terms of overhead: Size 2 provides the same resilience and overhead as RAID\-1. Size 3 provides more resilience than RAID\-1 but at the tradeoff of even more overhead.

Explaining what [Erasure coding](http://en.wikipedia.org/wiki/Erasure_code) is about gets complicated quickly.

I like to compare replicated pools to [RAID\-1](http://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_1) and Erasure coded pools to [RAID\-5](http://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_5) (or [RAID\-6](http://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_6)) in the sense that there are data chunks and recovery/parity/coding chunks.

What’s appealing with erasure coding is that it can provide the same (or better) resiliency than replicated pools but with less storage overhead - at the cost of the computing it requires.

Ceph has had erasure coding support for a good while already and interesting documentation is available:

- [http://ceph.com/docs/master/rados/operations/erasure-code/](http://ceph.com/docs/master/rados/operations/erasure-code/)
- [http://ceph.com/docs/master/rados/operations/erasure-code-profile/](http://ceph.com/docs/master/rados/operations/erasure-code-profile/)
- [http://ceph.com/docs/master/dev/erasure-coded-pool/](http://ceph.com/docs/master/dev/erasure-coded-pool/)

The thing with erasure coded pools, though, is that you’ll need a [cache tier](http://docs.ceph.com/docs/master/rados/operations/cache-tiering/) in front of them to be able to use them in most cases.

This makes for a perfect synergy of slower/larger/less expensive drives for your erasure coded pool and faster, more expensive drives in front as your cache tier.

To calculate the overhead of a erasure coded pool, you need to know your ‘k’ and ‘m’ values of your erasure code profile.

> **chunk**
> 
>   When the encoding function is called, it returns chunks of the same size. Data chunks which can be concatenated to reconstruct the original object and coding chunks which can be used to rebuild a lost chunk.
> 
> **K**
> 
>   The number of data chunks, i.e. the number of chunks in which the original object is divided. For instance if K = 2 a 10KB object will be divided into K objects of 5KB each.
> 
> **M**
> 
>   The number of coding chunks, i.e. the number of additional chunks computed by the encoding functions. If there are 2 coding chunks, it means 2 OSDs can be out without losing data.

The formula to calculate the overhead is:

nOSD \* k / (k+m) \* OSD Size

Finally, let’s look at a couple different erasure coding profile configurations based on 64 OSDs of 4 TB ranging from m=1 to m=4 and k=1 to k=10:

|     | 1      | 2      | 3      | 4      |
|-----|--------|--------|--------|--------|
| 1   | 128.00 | 85.33  | 64.00  | 51.20  |
| 2   | 170.67 | 128.00 | 102.40 | 85.33  |
| 3   | 192.00 | 153.60 | 128.00 | 109.71 |
| 4   | 204.80 | 170.67 | 146.29 | 128.00 |
| 5   | 213.33 | 182.86 | 160.00 | 142.22 |
| 6   | 219.43 | 192.00 | 170.67 | 153.60 |
| 7   | 224.00 | 199.11 | 179.20 | 162.91 |
| 8   | 227.56 | 204.80 | 186.18 | 170.67 |
| 9   | 230.40 | 209.45 | 192.00 | 177.23 |
| 10  | 232.73 | 213.33 | 196.92 | 182.86 |
| Raw | 256    | 256    | 256    | 256    |
