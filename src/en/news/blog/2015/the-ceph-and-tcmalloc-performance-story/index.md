---
title: "The Ceph and TCMalloc performance story"
date: "2015-09-07"
author: "shan"
tags: 
---

![The Ceph and TCMalloc performance store](http://sebastien-han.fr/images/ceph-tcmalloc-performance.jpg)

This article simply relays some recent discovery made around Ceph performance. The finding behind this story is one of the biggest improvement in Ceph performance that has been seen in years. So I will just highlight and summarize the study in case you do not want to read it entirely.

  

# The story

In the spring of 2015, two Sandisk employees named Somnath Roy and Chaitanya Huilgol investigated and reported an issue with the version of TCMalloc being distributed in many of the recent releases of major Linux distributions. Under heavy multi-threaded memory allocation workloads, TCMalloc can consume significant amounts of CPU when it doesn't have enough thread cache available. There is a setting that allows the user to increase the amount of thread cache beyond the default 32MB, though due to a bug this settings was ignored until the 2.2+ releases of gperftools which have not yet been packaged. Sandisk, along with several other community members, provided initial Ceph benchmarks showing performance benefits when using jemalloc or the newer TCMalloc with higher thread cache values. Recently at the 2015 Ceph Hackathon, Jian Zhang from Intel presented further results showing up to a 4.7x increase in IOPS performance when using jemalloc rather than the older version of TCMalloc. This provided Red Hat with a perfect opportunity to replicate Sandisk and Intel's findings at the Ceph Hackathon using a new performance test cluster donated to the Ceph community by Intel.

  

# What was observed?

Under small IO workloads JEMalloc was roughly 4.21x faster than TCMalloc 2.1 for 4KB random writes! While jemalloc produced the best 4KB random write performance of all of the configurations that were tested, it also consumed the most memory. It was estimated that for each OSD jemalloc was consumming an additional 300MB of RSS and 600MB of Virt memory.

Latency data was recorded by fio for every test, though only the 4K random write and random read results were graphed. In these tests 512 concurrent IOs were issued from 16 fio processes (2 per node). In the write case, this resulted in additional concurrency due to journal writes and 3x replication. In the write case, over 50% of the IOs took 20-50ms to complete when using the TCMalloc 2.1. When jemalloc was used, over 87% of the IOs completed in 10ms or less. TCMalloc 2.4 with 128MB thread cache showed a similar average improvement but with a wider overall spread. When jemalloc was used in the 4K random read test, Ceph was able to process 98% of the IOs in 2ms or less. While this is not yet sub millisecond latency, it's much closer than what could be obtained through TCMalloc even with 128MB of thread cache!

  

> If you want to read the entire report it is [available here](http://nhm.ceph.com/hackathon/Ceph_Hackathon_Memory_Allocator_Testing.pdf). Mark Nelson also discussed this subject during the last [Ceph Tech Talk](https://www.youtube.com/watch?v=oxixZPSTzDQ&feature=youtu.be).
