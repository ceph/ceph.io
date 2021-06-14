---
title: "First Impressions Through Fscache and Ceph"
date: "2013-11-05"
author: "scuttlemonkey"
tags: 
---

It’s always great when we can single out the development efforts of our community (there are so many good ones!). But it’s even better when the developers of our community feel brave enough to share their hard work with the community directly. Recently Milosz Tanski has been putting in some hard work to combine the magic of Ceph and fscache to help CephFS along the path to success. The result is some great work on both projects, and a far better cache than even a squirrel could come up with, read on for details!

[![](images/squirrel-cache-250x220.jpg "squirrel cache")](http://ceph.com/wp-content/uploads/2013/11/squirrel-cache.jpg)

> When I came upon Ceph I immediately though I would have a use for it.  
> Here at [Adfin](http://adfin.com/) we’ve developed a distributed relational (like) database  
> explicitly for storing large amounts of time series data about our  
> industry (advertising). The original database stored data locally and  
> balanced it between nodes, but using Ceph would give us an ability to  
> separate data storage capacity from the computational capacity. Before  
> we hadn’t really considered using a network filesystem, since many  
> either had lack-luster performance or SPOF (single point of failure).  
> The way Ceph deals with storing and striping data solved both  
> throughput and durability requirements for us.
> 
> Having CephFS be part of the kernel has a lot of advantages. The page  
> cache and a high optimized IO system alone have years of effort put  
> into them, and it would be a big undertaking to try to replicate them using  
> something like libcephfs. The motivation for adding fscache support  
> was solving one of trades we would have to make if we switched to Ceph;  
> latency. Since now our IO path wouldn’t be hitting local  
> disk, but instead going over network many smaller.
> 
> With the help of Sage guiding me through the details of MDS  
> and CephFS metadata inner workings, I was able to get up and running  
> pretty quickly with the initial implementation. A big chunk of time  
> was spent reading NFS and CIFS code bases to see how they were using  
> fscache. It took me about a month but I was able to run some simple  
> tests on trivial workloads.
> 
> My biggest challenges came from more complicated workloads, and  
> most of that boiled down to concurrency in a kernel. There are a lot of  
> things going on in the kernel and Ceph at the same time like  
> concurrent opens / closes, MDS messages (that revoke  
> our CACHE capability), writing and reading from fscache backends and  
> revoking of cached pages. What makes it worse is that concurrency bugs  
> only rear their ugly head in some workloads, sometimes after running  
> for days, and they are hard to reproduce. And when things go bad…  
> your nodes oops, or worse, busy hang. Ultimately I was able to work  
> through these problems, but it took much longer then getting to the  
> initial implementation (3 times longer). Ultimately, I was able to  
> build a mental model of what was going on. It took a lot of reading  
> the kernel locking documentation, reading the code, bugging people  
> (Sage, David, Yan), and beating my head against the wall.
> 
> The fscache addition to Cephfs helped us regain most of the losses by  
> taming the latency through a local cache. A nice side effect that I  
> didn’t consider in the beginning was the reduction of network traffic  
> going to the OSDs. When your clients only have a 1 gigabit connection  
> it’s easy to saturate their network connection.
> 
> This has been the first significant change I’ve made to the kernel.  
> And, since my changes touched a few places (cephfs, fscache and  
> cachesfilesd) a big chunk of my work towards the end was actually  
> coordinating the changes between the different trees for finally  
> getting it upstream into mainline. This isn’t a gripe, and really has  
> more to do with what I was working on. In the end this gave me am  
> appreciation for the kernel development process.
> 
> I think the fscache subsystem also benefited from the process of doing  
> this work. David Howells, who maintains fscache, solved numerous  
> problems as a result of my bug reports, testing and some patches.  
> All the filesystems that support fscache (9p, nfs, samba) have  
> benefited from that work and are much more solid in highly concurrent  
> workloads.

It’s always great to hear from our users about the cool projects they are working on. If you have some Ceph-related development, a real-world implementation, or anything else that might be tangentially-related to Ceph, we’d love to hear from you too! Please drop a line to our [Community Team](mailto:community@inktank.com) and fill us in. Thanks to Milosz, and all the rest of our Ceph developers.

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/first-impressions-through-fscache-and-ceph/&bvt=rss&p=wordpress)
