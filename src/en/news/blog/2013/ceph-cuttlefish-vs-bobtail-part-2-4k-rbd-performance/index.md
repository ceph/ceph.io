---
title: "Ceph Cuttlefish VS Bobtail Part 2: 4K RBD Performance"
date: "2013-07-10"
author: "MarkNelson"
tags: 
  - "planet"
---

Contents

1. [Introduction](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-2-4K-RBD-Performance/)
2. [Sequential Writes](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-2-4K-RBD-Performance/#seqwritebtrfs)
3. [Random Writes](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-2-4K-RBD-Performance/#randwritebtrfs)
4. [Sequential Reads](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-2-4K-RBD-Performance/#seqreadbtrfs)
5. [Random Reads](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-2-4K-RBD-Performance/#seqreadbtrfs)
6. [Conclusion](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-2-4K-RBD-Performance/#conclusion)

### INTRODUCTION

Welcome back! If you haven’t gotten a chance to read [part 1](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench "Ceph Cuttlefish VS Bobtail Part 1: Introduction and RADOS Bench") of our Ceph Cuttlefish VS Bobtail comparison, right now is a great time. Today, we will be looking at how the Ceph Kernel and QEMU/KVM RBD implementations perform with 4K IOs using fio. We’ll test how performance scales as the number of concurrent IOs increases across different volumes and even different virtual machines.

There is a lot of data here, and you might wonder why we’ve put so much effort into all of this testing. Each IO pattern and IO size helps us get a better idea of how Ceph and RBD perform in different situations. By looking at different scaling scenarios, we can determine what kinds of concurrency and how much is needed to hit peak throughput numbers on this platform. With this data in hand, we can start to guess at how different kinds of applications will perform.  
  
In each image below, you will see 6 3-dimensional graphs representing the throughput results for a given IO pattern. Images on the left show results for the Bobtail release, while images on the right are for Cuttlefish. The top images show throughput when testing Kernel RBD with 1-8 volumes and 1-16 concurrent IOs per volume. The next set of images from the top are for QEMU/KVM on a single guest and multiple volumes, similar to the Kernel RBD tests. The bottom images are for QEMU/KVM, but running on 1-8 guests with a single volume per guest.

Before we move on, if you’d like a brief overview of the hardware and software being used in these tests, click [here](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#setup "System Setup"). If you’d like an overview of the test setup itself, please click [here](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#test_setup "Test Setup").

### 4KB FIO SEQUENTIAL WRITES (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-write-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_btrfs-write-0004k/)

Yikes! If these graphs are hard to see, you can click on any of them to (eventually) see a larger full sized image. So what do we have going on here? Well the first obvious thing is that for sequential 4K writes, the RBD cache layer in QEMU/KVM is helping dramatically. Even though we are doing direct IO and by-passing client side buffer cache, RBD cache behaves more like a disk cache and allows writes to be coalesced behind the scenes where possible. For that reason, the QEMU/KVM tests are all significantly faster for sequential 4K writes. An interesting side effect is that it doesn’t always seem to scale linearly with higher concurrency. When testing multiple volumes on 1 guest, we hit a point where increasing the number of concurrent operations per fio process starts hurting instead of helping. When we increase the number of guests on 1 host, performance scales in strange and somewhat unexpected ways. In fact the kernel RBD results are the cleanest looking ones, where we see nice scaling across volumes and a moderate performance bump for cuttlefish. Interestingly kernel RBD performance is not really scaling that well with increased IO depth.

### 4KB FIO SEQUENTIAL WRITES (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-write-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_ext4-write-0004k/)

EXT4 performance results appear to be pretty similar to the BTRFS results. We see many of the same scaling behaviors and throughput numbers, with some minor variations. It looks like with Cuttlefish, RBD cache behavior may have changed slightly, though it’s difficult to tell with how noisy the results seem to be.

### 4KB FIO SEQUENTIAL WRITES (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-write-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_xfs-write-0004k/)

One of the things we haven’t really touched on yet is how much performance increases with more volumes/guests/io depth. Ceph tends to like a lot of concurrency. The more concurrency, the better IOs get spread across all of the OSDs and the better each OSD stays fully utilized, just like with threads in a massively parallel computer. Nothing really new is showing up with the XFS results, though the kernel RBD results do show a pretty big improvement for Cuttlefish. That meshes well with what we saw with RADOS Bench.

### 4KB FIO RANDOM WRITES (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-randwrite-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_btrfs-randwrite-0004k/)

Looking at the kernel RBD results first, we see quite a bit of scaling as the IO depth increases. There is some scaling across volumes as well, though less so than with sequential writes. Kernel RBD seems to be topping out at around 15 MB/s, which is around 160 IOPS per OSD. That’s on the high end of what these drives should be able to do.

Moving on to the QEMU/KVM results, performance appears to scale only minimally with more volumes/guests, but is higher than Kernel RBD pretty much across the board. It tops out at around 27 MB/s, which is around 288 IOPs per OSD. This is definitely higher than what the disks can support, so something is definitely going on. It may be that BTRFS is providing some advantages, or possibly that by only using a small fraction of the total disk space for writes (64GB per volume), we are gaining some beneficial caching behavior even with random writes. The journals will also provide some limited advantages for bursts of small random writes since writes to the journal are all sequential and the OSD can acknowledge a request as soon as it gets committed to the journal. Potentially any or all of these things could be having an effect.

### 4KB FIO RANDOM WRITES (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-randwrite-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_ext4-randwrite-0004k/)

Performance is definitely lower across the board vs BTRFS. Part of this is probably explained by how the filestore flusher affects small write behavior on BTRFS, EXT4, and XFS. Back in Bobtail, we disabled it for operations smaller than 64KB in size, and that helped when using XFS and BTRFS but not EXT4. More information about those results is available in our [Bobtail Performance Tuning Article](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/#summary "Bobtail Performance Tuning Article").

Beyond that, it looks like small random write performance has pretty much improved across the board for EXT4 when comparing Bobtail and Cuttlefish.

### 4KB FIO RANDOM WRITES (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-randwrite-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_xfs-randwrite-0004k/)

With XFS, Kernel RBD 4K random write performance was as low as EXT4 in Bobtail, but improved even more than EXT4 did with Cuttlefish. It’s still not as fast as BTRFS. This may be due to the way that BTRFS lays data out on the disk. QEMU/KVM is another story. Performance improved substantially and appears to be ever so slightly faster than BTRFS. This means that the high QEMU/KVM IOPS rates are definitely due to something more than just underlying filesystem behavior. Looking at the collectl data on both one of the client virtual machines and on the underlying OSDs, it appears the journals are correctly writing out 4k chunks of data to the SSDs. Writes to the OSD disks however have a range of sizes. It’s possible that some of what we are seeing is due to at least a small amount of write reordering and coalescing by the IO scheduler when data is flushed from the journals to the data disks.

I should probably point out that we aren’t doing a whole lot tuning of the filesystem and devices for either RBD or the OSDs beyond tweaking some basic filesystem options. It’s possible that with more tuning these results could change. Certainly when we start looking at OSDs directly on SSDs, quite a bit of tweaking will almost certainly be necessary for high throughput small random write workloads.

### 4KB FIO SEQUENTIAL READS (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-read-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_btrfs-read-0004k/)

Moving on to RBD 4K sequential reads, it appears that performance scales a bit higher for reads vs writes with lots of concurrency. I suspect that read ahead, both on the client side and on the OSD side is helping here. Tuning read\_ahead\_kb on both the client and server side potentially could improve performance quite a bit more, but could also hurt random small reads if it is increased too much. Kernel RBD and QEMU/KVM RBD throughput results are similar, though the kernel version may be marginally faster. Increasing IO depth improves performance pretty dramatically at low values, but seems to have diminishing returns as IO depth increases. Again it seems that multiple volumes and/or clients is needed to achieve high aggregate throughput.

4K sequential reads also appear to be a bit faster in Cuttlefish and the scaling looks like it is a bit smoother in the multi-guest tests.

### 4KB FIO SEQUENTIAL READS (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-read-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_ext4-read-0004k/)

4K sequential read performance with EXT4 is extremely similar to BTRFS, except in the multi-guest tests on bobtail. In this case, there is some really strange scaling going on where it appears that at high io depths on lots of guests performance is much higher than what we’ve seen in other cases. It’s hard to guess what exactly is going on here without digging into it more, but for now it may be worth noting that there could be something odd going on.

### 4KB FIO SEQUENTIAL READS (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-read-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_xfs-read-0004k/)

No real surprises here. XFS 4K sequential read performance looks pretty smooth and is pretty close to what we were seeing with BTRFS (and in mostly close to what we saw with EXT4). Performance again scales when the io depth is bumped to 2, but after that is mostly flat. Using multiple volumes and/or clients does tend to improve performance.

### 4KB FIO RANDOM READS (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-randread-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_btrfs-randread-0004k/)

4K random read performance is understandably lower than the sequential read results. There is definitely some strange scaling behavior going on with bobtail. Cuttlefish is mostly scaling nicely, though at large IO depth values with concurrent writes on lots of guests, it looks like there is a performance dip. This is something we’ll want to watch to make sure we aren’t running into any ceph-specific scaling issues.

### 4KB FIO RANDOM READS (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-randread-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_ext4-randread-0004k/)

EXT4 is also showing some strange scaling 4K random read scaling behavior with Bobtail. Theoretically cuttlefish is slower in some of these tests, but it’s not entirely clear why. In this case, it may be a good idea to run multiple tests and see how consistent these results are.

### 4KB FIO RANDOM READS (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-randread-0004K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/attachment/cuttlefish-rbd_xfs-randread-0004k/)

XFS probably provides the most stable looking 4K random read performance. While the throughput does not peak quite as high as with BTRFS, the numbers look pretty good and work out to top out at about 85 IOPs per disk when multiple guests are involved. That’s reasonably good, but there is still room for improvement. Like with 4K random writes, there are various device and filesystem tunables that could potentially improve these numbers.

### CONCLUSION

Alright, that is what I was talking about when I said we had a lot of data to throw at you guys! So what have we learned here? Cuttlefish definitely provides some major performance improvements for small writes. We also saw that with the RADOS bench tests. For small sequential writes, RBD cache improved write performance considerably, but also made the scaling behavior much less predictable. On the read side, it’s not clear that Cuttlefish is consistently faster, but at least for small sequential reads seems to often provide a modest improvement.

Speaking of RADOS bench, these numbers can’t really be directly compared to the RADOS bench numbers from part 1 as RADOS get stressed differently when RBD is used (4k IOs to 4MB objects vs 4k IOs to 4k objects). Beyond that, we’ve preallocated all of the fio data, so all of the objects that represent the blocks in RBD already exist. In RADOS bench we are creating a new object for every write, while for RBD we are modifying the data in an existing object that may or may not have its existing metadata cached. Having said all that, with the exception of sequential writes where RBD cache makes a huge difference, all of our numbers are reasonably close. That may be a false comfort, but hopefully indicates that RBD is doing a reasonably good job here. So this concludes our investigation into 4K RBD performance. Next up we will do all of this over again for 128K IOs. See you again tomorrow!

Update: [Part 3](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/ "Ceph Cuttlefish VS Bobtail Part 3: 128K RBD Performance") has been released!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/&bvt=rss&p=wordpress)
