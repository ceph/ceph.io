---
title: "Ceph Cuttlefish VS Bobtail Part 5: Results Summary & Conclusion"
date: "2013-07-12"
author: "MarkNelson"
tags: 
  - "planet"
---

Contents

1. [RESULTS SUMMARY](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-5-Results-Summary-&-Conclusion/#results)
2. [4K RELATIVE PERFORMANCE](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-5-Results-Summary-&-Conclusion/#4K)
3. [128K RELATIVE PERFORMANCE](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-5-Results-Summary-&-Conclusion/#128K)
4. [4M RELATIVE PERFORMANCE](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-5-Results-Summary-&-Conclusion/#4M)
5. [CONCLUSION](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-5-Results-Summary-&-Conclusion/#conclusion)

### RESULTS SUMMARY

For those of you that may have just wandered in from some obscure corner of the internet and haven’t seen the earlier parts of this series, you may want to go back and start at the [beginning](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/ "Ceph Cuttlefish VS Bobtail Part 1: Introduction and RADOS Bench").

If you’ve made it all the way from Part 1 to this article and are still reading, I’ve got to applaud you. There aren’t many people that have the attention span to make it through that much data and still care. Even Sage lost interest after a while! If you skipped portions of [Part 2](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/ "Ceph Cuttlefish VS Bobtail Part 2: 4K RBD Performance"), [Part 3](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/ "Ceph Cuttlefish VS Bobtail Part 3: 128K RBD Performance"), and [Part 4](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/), I won’t hold it against you. We collected a vast amount of information in those tests. Unless you are willing to make parsing performance data a major part of your life, it’s pretty easy to get lost in it all. The goal in this final article is to see if we can distill that data down into something a little more manageable and draw some useful conclusions from it. We won’t be talking about absolute performance numbers as we already have plenty of those. Instead, we’ll look at relative performance.  
  
So let’s stop and think for a little bit about what people actually want out of all of this data. We’ve got quite a bit of information about how Bobtail and Cuttlefish compare in parts 2 through 4, but I’ve taken too long to get this out, many people have already upgraded to Cuttlefish, and Dumpling is just around the corner. To make things easier on us, lets just focus on Cuttlefish. We’ve gotten a lot of questions from people about how Kernel RBD and QEMU/KVM compare, whether or not to use RBD cache, and what underlying filesystem people should use on their OSDs. The answers to these questions are really multi-faceted. BTRFS for instance, may appear to be a fine choice from a performance perspective. Even in fairly recent versions of the kernel however, BTRFS still has some bugs that could be undesirable in a production deployment. This is first and foremost a performance article though, so we’ll focus on that.

The first order of business is to figure out how we can distill down all of this data. What we really want is an idea of which RBD implementation and which File Systems perform well together for different classes of IO. To do that, we can look at how every combination of RBD and the different file systems compare to each other using a given IO pattern, size, depth and volume/guest count. We can then average the results for the same IO pattern and size to get a small set of numbers we can visually compare. Now, it is very important to note that we took samples in such a way that there are fewer samples at high IO depths and volume counts than at low ones (1, 2, 4, 8, 16, etc). At first I was tempted to weight the averages to account for this. After thinking about it, I actually prefer having more samples with lower levels of concurrency. In a real deployment, it’s not likely that you will always have enough concurrency to keep the entire cluster busy 100% of the time. Beyond that, at a certain level of concurrency, performance levels out. If you over-sample at high concurrency levels you lose a lot of valuable information about how things perform with lower levels of concurrency. For those reasons, I decided to proceed with a straight average. This may not be 100% representative if you expect to keep your cluster busy with lots of concurrency 100% of the time, but I think it provides a reasonable comparison in a typical setting. Lets start out with 4K operations.

### 4K RELATIVE PERFORMANCE

   
[![](images/CVB_Summary_4K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-5-results-summary-conclusion/attachment/cvb_summary_4k/)

If you have a high resolution screen, I apologize, that’s probably nearly illegible. If you click on it, you should eventually be able to get to the full resolution version of the chart. Has our attempt to distill the data down helped? I think so. If we look at performance across all IO depths and volume counts, what stands out? First is that QEMU/KVM is much better for writes (this was pretty obvious in part 2), and appears to be nearly as good at reads. Another thing that stands out is that EXT4 really isn’t keeping up for random workloads. BTRFS is definitely the fastest for random reads, but it lags in the 1-guest, multi-volume QEMU/KVM sequential write tests. Based on these observations, I think I’d say that from a performance perspective, the best options for small sized IO are:

All Workloads:  
**QEMU/KVM, BTRFS or XFS**

Read Heavy Only Workloads:  
**Kernel RBD, BTRFS, EXT4, or XFS**

### 128K RELATIVE PERFORMANCE

   
[![](images/CVB_Summary_128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-5-results-summary-conclusion/attachment/cvb_summary_128k/)

I think it’s pretty clear from these results that for 128K writes, you are still best off using the QEMU/KVM RBD implementation with RBD cache. The reads are definitely a much harder decision. Ignoring all of the minute information we saw in part 3 and just going by these averages, you are probably best off with Kernel RBD and BTRFS or EXT4. On the other hand, XFS is the only file system with QEMU/KVM that does comparatively fairly well. If you are going to use QEMU/KVM, XFS seems to provide the most consistently good results across all IO Patterns. If you are going to use Kernel RBD, BTRFS or EXT4 may be a better choice.

Write heavy workloads with moderate reads:  
**QEMU/KVM, XFS**

Read heavy workloads with moderate writes:  
**Kernel RBD, BTRFS or EXT4**

### 4M RELATIVE PERFORMANCE

   
[![](images/CVB_Summary_4M.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-5-results-summary-conclusion/attachment/cvb_summary_4m/)

At large IO sizes, the story is actually pretty similar to what we saw with 128K IOs with the exception that the lack of RBD cache in QEMU/KVM isn’t hurting nearly as much. I think we can say:

Write heavy workloads with moderate reads:  
**QEMU/KVM, XFS**

Read heavy workloads with moderate writes:  
**Kernel RBD, BTRFS or EXT4**

### CONCLUSION

   
Well there you go! I think based on all of this, if you are using XFS with QEMU/KVM you are probably in pretty good shape overall. It’s not always the fastest, but it’s consistently pretty good. If you are using Kernel RBD, BTRFS and EXT4 tend to perform better, but you should also weigh file system stability and potentially long term performance degradation into the equation too.

Now that I’m on the line for making recommendations, I’m sure that in a couple of weeks I’ll find that changing read ahead, or log buffer sizes, or using a different file system on the RBD volume changes everything. These tests are all with 1X replication, and at higher replication levels there will be a lot more writes flying around which could mean greater concurrency just by virtue of the replication traffic. For now, I think if you are really interested in how Ceph and RBD perform, the combined data in these articles should give you a good base to build from when examining your own setup. In part 1 we saw that if you target RADOS directly you can max out the bonded 10GbE links. In parts 2 through 4, we saw in minute detail how RBD scales in a variety of scenarios, and how much improvement has been made with Cuttlefish over Bobtail. Finally in Part 5, we’ve demonstrated that XFS is overall a viable choice for QEMU/KVM while BTRFS or EXT4 may be slightly faster with Kernel RBD.

I hope this series of articles has been useful to you! If you happen to do any of your own testing, let us know on IRC or the mailing list. We’d be happy to take a look! If you’d like to talk to us about hardware architecture or helping out with performance analysis, we have a great bunch of guys in our professional services group ready to help. Until next time fellow Ceph enthusiasts!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-5-results-summary-conclusion/&bvt=rss&p=wordpress)
