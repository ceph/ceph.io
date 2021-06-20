---
title: "Ceph Cuttlefish VS Bobtail Part 3: 128K RBD Performance"
date: "2013-07-11"
author: "MarkNelson"
tags: 
---

Contents

1. [Introduction](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-3-128K-RBD-Performance/)
2. [Sequential Writes](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-3-128K-RBD-Performance/#seqwritebtrfs)
3. [Random Writes](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-3-128K-RBD-Performance/#randwritebtrfs)
4. [Sequential Reads](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-3-128K-RBD-Performance/#seqreadbtrfs)
5. [Random Reads](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-3-128K-RBD-Performance/#seqreadbtrfs)
6. [Conclusion](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-3-128K-RBD-Performance/#conclusion)

### INTRODUCTION

I’m amazed you are still here! You must be a glutton for punishment (or you haven’t read [part 1](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/ "Part 1") and [part 2](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/ "Part 2") yet!) If you haven’t run away in fear yet, then prepare yourself! Today we will be looking at how the Ceph Kernel and QEMU/KVM RBD implementations perform with 128K IOs using fio. Again, we’ll be testing how performance scales as the number of concurrent IOs increases across different volumes and even different virtual machines. We’ll use the same sequential write, random write, sequential read, and random read IO patterns we used in part 2. 
  
As always, if you’d like a brief overview of the hardware and software being used in these tests, click [here](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#setup "System Setup"). If you’d like an overview of the test setup, please click [here](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#test_setup "Test Setup").

To recap, in each image below you will see 6 3-dimensional graphs representing the throughput results for a given IO pattern. Images on the left show results for the Bobtail release, while images on the right are for Cuttlefish. The top images show throughput when testing Kernel RBD with 1-8 volumes and 1-16 concurrent IOs per volume. The next set of images from the top are for QEMU/KVM on a single guest and multiple volumes, similar to the Kernel RBD tests. The bottom images are for QEMU/KVM, but running on 1-8 guests with a single volume per guest.

### 128KB FIO SEQUENTIAL WRITES (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-write-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_btrfs-write-0128k/)

Alright, some interesting results right out of the gate. Just like with the 4K sequential reads, we are seeing RBD cache helping dramatically. While we can get pretty good performance with Kernel RBD, it can’t touch the performance we can get when IOs are coalesced. Speaking of which, this should give you a hint of what to expect when we look at 4M IOs in the next article. One thing to note here is the strange throughput scaling on Bobtail. We improved how RBD cache works in Cuttlefish and it really seems to be visible here. Also note how the multi-guest tests are scaling higher vs adding multiple volumes to a single guest. We’ll want to watch for that in other tests to see if this is a single-client limitation. Speaking of the multi-guest tests, consider for a second that we are:

- Doing 128k IOs to filesystems…
- Running on top of virtual block devices…
- Running on virtual machines…
- Using virtual network interfaces…
- Running on top of a software defined network bridge…
- Utilizing a software defined bonded network interface…
- On one single physical client…

And getting over 1.4GB/s. That doesn’t even get into all of the layers of software involved in the server side! Isn’t modern technology amazing?

### 128KB FIO SEQUENTIAL WRITES (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-write-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_ext4-write-0128k/)

EXT4 is looking pretty similar to BTRFS, though it’s not scaling quite as high in the multi-guest tests with Cuttlefish. Bobtail is again showing the same odd RBD cache behavior. Like in the 4K sequential write tests, we are seeing that increasing IO depth is having some effect, but not nearly as significant of an effect as increasing the number of volumes/guests.

### 128KB FIO SEQUENTIAL WRITES (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-write-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_xfs-write-0128k/)

XFS performance in Cuttlefish is right in-line with BTRFS, though there is a curious drop in performance in the multi-guest tests with high IO depth and VM counts. This may be a random slow result, or may indicate that we are hitting some client side limit (which is entirely possible given the specs of our client node and the throughput involved). In any event, Cuttlefish is again looking much better than Bobtail, both because we improved OSD performance with XFS and because we improved how RBD cache works.

### 128KB FIO RANDOM WRITES (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-randwrite-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_btrfs-randwrite-0128k/)

Moving on to 128K random writes, we can see that Cuttlefish performance is quite a bit higher than Bobtail, even for kernel RBD. QEMU/KVM results improved dramatically in the single-guest tests as well. Multi-guest tests may have improved a bit, but in this case Bobtail was actually doing pretty well. Again, RBD cache seems to be doing a good job of allowing even low levels of concurrency to saturate the disk back-end. Even though we are doing direct IO, the caching is happening below the buffer cache layer.

### 128KB FIO RANDOM WRITES (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-randwrite-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_ext4-randwrite-0128k/)

Ugh! Just like with the 4K results, we are seeing EXT4 doing quite a bit worse than BTRFS. Performance actually tends to degrade with more volumes. Having said that, we can see that performance is quite a bit better with Cuttlefish than with Bobtail, so it’s not all bad news. Clearly though, without any tuning Ceph is definitely a lot faster on BTRFS for random 128K writes.

### 128KB FIO RANDOM WRITES (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-randwrite-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_xfs-randwrite-0128k/)

If you just look at the Bobtail results, XFS is almost as slow as EXT4. The improvements to Cuttlefish really help though. It’s still not as fast as BTRFS, but it’s getting a lot closer in Cuttlefish. In both the kernel rbd and single-guest tests, performance degrades slightly with more volumes which is a bit concerning. It might make some sense if you consider that the random writes are being spread over a greater portion of the drives as volumes are added, so less write coalescing could potentially be happening in the OSDs. On the other hand, performances seems to be going up in the multi-guest tests, so it could be some kind of single-client limitation.

### 128KB FIO SEQUENTIAL READS (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-read-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_btrfs-read-0128k/)

Yikes! Kernel RBD sequential read performance looks great. Good scaling, reasonable performance given the workload, etc. QEMU/KVM performance is quite a bit lower though, especially in the single-guest case. In the multi-guest case, it’s low except when we go to 8 VMs with an IO depth of 16, where it spikes up dramatically! I went back and looked at the collectl data showing how much data was being read from each underlying OSD device. At least a casual inspection seems to verify that these results are accurate. Something very strange appears to be going on with QEMU/KVM when doing 128k sequential reads on BTRFS. Some candidates that might be worth investigating are what the IO schedulers on the client and OSDs are doing, how tweaking read\_ahead\_kb changes things, and whether or not client side filesystem tweaks make any difference.

### 128KB FIO SEQUENTIAL READS (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-read-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_ext4-read-0128k/)

EXT4 128K sequential read performance on kernel RBD looks similar to btrfs, if a bit slower. On the QEMU/KVM tests, the results look slightly less crazy, but there is still a hint of the strange scaling at high IO depths we saw with BTRFS. Having said that, part of the reason these results may appear more “normal” is that in the multi-guest tests Cuttlefish throughput never spikes up with high concurrency the way that bobtail throughput does.

### 128KB FIO SEQUENTIAL READS (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-read-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_xfs-read-0128k/)

Wow! If you just look at Kernel RBD, XFS is quite a bit slower for 128K sequential reads than either BTRFS or EXT4. It does maintain the same smooth scaling behavior however. If this was all we had tested, XFS would look pretty bad. In fact if you go back and look at the [128k object read results](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#128kbrados "128K Object Read Results") from part 1, you wouldn’t be that surprised that XFS is the slowest of the bunch in this test.

As soon as you look at the QEMU/KVM results though, a different story emerges. While BTRFS and EXT4 show very strange (and generally poor) scaling behavior in the QEMU/KVM tests, XFS seems to scale as well as it does with Kernel RBD. In fact the QEMU/KVM results are quite a bit faster than the kernel RBD results. I don’t have a particularly good explanation for what is going on here yet, but at least superficially XFS appears to provide the most consistently good results if you are going to be using QEMU/KVM for 128K sequential reads. We’ll have to see if that continues to be the case after tweaking read ahead and other tunables.

### 128KB FIO RANDOM READS (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-randread-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_btrfs-randread-0128k/)

128K random reads are definitely a bit slower than sequential reads which is pretty reasonable on spinning disks. Bobtail is again showing nice scaling behavior with kernel RBD but not with QEMU/KVM. Cuttlefish thankfully is showing much nicer behavior across the board and the QEMU/KVM results are around 20% faster than Kernel RBD. With QEMU/KVM we are getting somewhere around 80-85 IOPS per disk.

### 128KB FIO RANDOM READS (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-randread-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_ext4-randread-0128k/)

EXT4 on the other hand looks pretty mediocre in comparison. Performance isn’t very high relative to what the drives should be able to do (and how BTRFS does). The scaling behavior is fairly straightforward with kernel RBD but looks a little strange with QEMU/KVM. Let’s see if XFS looks any better.

### 128KB FIO RANDOM READS (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-randread-0128K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/attachment/cuttlefish-rbd_xfs-randread-0128k/)

XFS is a bit slower than BTRFS at 128k random reads, but overall the performance is pretty close to what BTRFS can do and much better than what we saw with EXT4. The scaling behavior also looks nice and smooth. The multi-guest tests are again scaling better than both the multi-volume kernel RBD tests and single-guest QEMU/KVM tests. Based on all of this, it looks like XFS is a good choice for 128k reads if you are using QEMU/KVM.

### CONCLUSION

Well that was pretty intense! We saw a lot of interesting things going on this time, with some pretty impressive sequential write numbers with RBD cache and bizarre scaling issues with QEMU/KVM on bobtail (and in some cases Cuttlefish!). XFS came out as a surprisingly good overall choice for 128K reads with QEMU/KVM, while BTRFS is still faster when using kernel RBD. I think the read results here raise as many questions as they answer though, and we will need to dig in more deeply to really explain them. That however will have to wait for another day, because coming up next, we have the large 4M IO tests. Will we be able to saturate the bonded 10GbE links like we were able to do in part 1 with RADOS bench? You’ll have to wait for part 4 tomorrow to find out!

Update: [Part 4](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/ "Ceph Cuttlefish VS Bobtail Part 4: 4M RBD Performance") has been released!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/&bvt=rss&p=wordpress)
