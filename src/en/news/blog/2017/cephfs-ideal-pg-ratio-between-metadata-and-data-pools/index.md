---
title: "cephfs: ideal PG ratio between metadata and data pools"
date: "2017-08-07"
author: "admin"
tags: 
  - "planet"
---

Scenario: I'm deploying CephFS for the first time. I know I need a metadata pool as well as a data pool, but I don't know how many PGs for one pool and the other? Can I use the same number, or should they be different?  
  
This question is a FAQ. The number of PGs should be chosen in line with the expected amount of data. In a typical cephfs usage pattern, there will be less data in the metadata pool than in the data pool, but nobody really knows exactly how \*much\* less. In this thread, John Spray suggests "something like" a 1:4 metadata-to-data ratio.  
  
[http://lists.ceph.com/pipermail/ceph-users-ceph.com/2017-March/016965.html](http://lists.ceph.com/pipermail/ceph-users-ceph.com/2017-March/016965.html)  
  
Quoting John's answer there:  

> As you suggest, it is probably sensible to use a smaller number of PGs  
> for the metadata pool than for the data pool.  I would be tempted to  
> try something like an 80:20 ratio perhaps, that's just off the top of  
> my head.  
>   
> Remember that there is no special prioritisation for metadata traffic  
> over data traffic on the OSDs, so if you're mixing them together on  
> the same drives, then you may see MDS slowdown if your clients  
> saturate the system with data writes.  The alternative is to dedicate  
> some SSD OSDs for metadata.

Source: Nathan Cutler ([cephfs: ideal PG ratio between metadata and data pools](http://smithfarm-thebrain.blogspot.com/2017/08/cephfs-ideal-pg-ratio-between-metadata.html))
