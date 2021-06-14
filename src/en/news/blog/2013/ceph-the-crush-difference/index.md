---
title: "CEPH – THE CRUSH DIFFERENCE!"
date: "2013-02-13"
author: "syndicated"
tags: 
  - "ceph"
  - "planet"
---

So many people have been asking us for more details on CRUSH, I thought it would be worthwhile to share more about it on our blog. If you have not heard of CRUSH, it stands for “**C**ontrolled **R**eplication **U**nder **S**calable **H**ashing”. CRUSH is the pseudo-random data placement algorithm that efficiently distributes object replicas across a Ceph storage cluster.

Cluster size needs to be flexible, and device failure is going to happen. CRUSH allows for the addition and removal of storage devices with as little movement of data as possible. Ceph utilizes the CRUSH algorithm to deterministically compute where data can be found or should be written. This eliminates metadata bottlenecks, which increases overall efficiency accessing data in the cluster. Ceph clients accessing storage and Ceph devices that replicate data to their peers both run the algorithm. This allows the work to scale linearly with the size of the cluster.

**Financial advantages:**

CRUSH replicates data in multiple locations and fault domains. So when a disk fails, CRUSH replicates data across available OSDs. There is no need for RAID, which typically just adds to the hardware cost.

Ceph and CRUSH allow you to work in a heterogeneous structured environment that frees you from vendor lock-in and expensive proprietary hardware. CRUSH is also self-managing and self-healing, this reduces the overall need for human intervention in your data center.

CRUSH is the secret sauce for Ceph (that really isn’t a secret). It’s one of the key features that makes Ceph powerful and uniquely scalable compared to other storage systems that you see today.

We also have a CRUSH datasheet that you can download [here](http://www.inktank.com/resource/cephs-crush-algorithm/) for more detailed information on CRUSH.

**Give Ceph a Try!**

As free open source software, it’s easy to get started with Ceph. Take advantage of our learning resources to start using Ceph and see for yourself how much a modern approach to reliable, autonomous, distributed storage can do for you:

[http://ceph.com/docs/master/start/](http://ceph.com/docs/master/start/)

[http://www.inktank.com/about-inktank/ceph-overview/](http://www.inktank.com/about-inktank/ceph-overview/)

[http://www.inktank.com/resources/](http://www.inktank.com/resources/)

[http://ceph.com/resources/publications/](http://ceph.com/resources/publications/)

![](http://track.hubspot.com/__ptq.gif?a=265024&k=14&bu=http%3A%2F%2Fwww.inktank.com&r=http%3A%2F%2Fwww.inktank.com%2Fceph%2Fceph-the-crush-difference%2F&bvt=rss&p=wordpress)
