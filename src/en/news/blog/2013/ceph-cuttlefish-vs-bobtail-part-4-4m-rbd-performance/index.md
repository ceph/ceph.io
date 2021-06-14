---
title: "Ceph Cuttlefish VS Bobtail Part 4: 4M RBD Performance"
date: "2013-07-12"
author: "MarkNelson"
tags: 
  - "planet"
---

Contents

1. [Introduction](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-4-4M-RBD-Performance/)
2. [Sequential Writes](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-4-4M-RBD-Performance/#seqwritebtrfs)
3. [Random Writes](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-4-4M-RBD-Performance/#randwritebtrfs)
4. [Sequential Reads](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-4-4M-RBD-Performance/#seqreadbtrfs)
5. [Random Reads](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-4-4M-RBD-Performance/#seqreadbtrfs)
6. [Conclusion](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-4-4M-RBD-Performance/#conclusion)

### INTRODUCTION

This is the part I’ve been waiting for. We’ll be testing just how fast we can make Ceph perform with 4M IOs on Kernel and QEMU/KVM RBD volumes. Again, we’ll be looking at how performance scales as the number of concurrent IOs increases across volumes and even different virtual machines. We’ll use the same sequential write, random write, sequential read, and random read IO patterns we used in [part 2](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/ "Ceph Cuttlefish VS Bobtail Part 2: 4K RBD Performance") and [part 3](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-3-128k-rbd-performance/ "Ceph Cuttlefish VS Bobtail Part 3: 128K RBD Performance"). The big question in my mind is this: Just how close can we get to the RADOS performance we saw in Part 1? Now we’ll find out! ALLONS-Y!

As always, if you’d like a brief overview of the hardware and software being used in these tests, [click here](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#setup). If you’d like an overview of the test setup, please [click here](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#test_setup).

To recap, in each image below you will see 6 3-dimensional graphs representing the throughput results for a given IO pattern. Images on the left show results for the Bobtail release, while images on the right are for Cuttlefish. The top images show throughput when testing Kernel RBD with 1-8 volumes and 1-16 concurrent IOs per volume. The next set of images from the top are for QEMU/KVM on a single guest and multiple volumes, similar to the Kernel RBD tests. The bottom images are for QEMU/KVM, but running on 1-8 guests with a single volume per guest.

### 4M FIO SEQUENTIAL WRITES (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-write-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_btrfs-write-4096k/)

Ok, starting out with slightly sad news: We didn’t quite max out the bonded 10GbE link and I was really hoping we would! I am being silly though. 1.6GB/s aggregate from a VM host and 1.4GB/s from a single VM is pretty impressive by itself! It’s entirely possible that with more client nodes we could increase that throughput further. One thing to take note of is how much the QEMU/KVM results have improved since bobtail. That’s due to Josh Durgin’s improvements to the RBD cache layer in Cuttlefish. It’s making a huge difference in these tests, and I suspect will make a huge difference for EXT4 and XFS as well.

### 4M FIO SEQUENTIAL WRITES (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-write-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_ext4-write-4096k/)

EXT4 isn’t quite as fast as BTRFS, but the results with Cuttlefish again look much better. Kernel RBD is around 25% faster and QEMU/KVM is up to 6-7 times faster depending on the level of concurrency! With Cuttlefish we are also seeing really nice even scaling behavior in all of the tests.

### 4M FIO SEQUENTIAL WRITES (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-write-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_xfs-write-4096k/)

If you were to just look at the Kernel RBD performance for XFS it would look pretty mediocre compared to BTRFS and EXT4. QEMU/KVM however turns out to be a surprising win for XFS. In the single-guest tests it beats out EXT4 and comes very close to BTRFS performance, and in the multi-guest tests it actually pulls ahead! Again we are seeing some really funky behavior with RBD cache in Bobtail, but Cuttlefish is looking really good.

### 4M FIO RANDOM WRITES (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-randwrite-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_btrfs-randwrite-4096k/)

4M random writes on BTRFS behave almost identically to 4M sequential writes, but are just a hair slower.

### 4M FIO RANDOM WRITES (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-randwrite-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_ext4-randwrite-4096k/)

Just like with BTRFS, we are seeing 4M random write behavior on EXT4 look very similar to EXT4′s 4M sequential behavior. Performance is a bit lower, but otherwise the results look nearly identical.

### 4M FIO RANDOM WRITES (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-randwrite-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_xfs-randwrite-4096k/)

XFS doesn’t have any surprises in store. Scaling behavior is very similar to what we saw in the sequential tests. Throughput is just a bit slower. For QEMU/KVM, XFS seems to be a fantastic choice for large writes. Let’s take a look and see what happens with reads.

### 4M FIO SEQUENTIAL READS (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-read-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_btrfs-read-4096k/)

After the strange results we got with 128K sequential reads, these results look pretty good in comparison. We see some less than ideal behavior with bobtail, but in Cuttlefish the scaling looks relatively good. Interestingly, Kernel RBD is doing much better than QEMU/KVM in these tests, and is getting pretty close to maxing out the bonded 10GbE connection. QEMU/KVM is slower, but appears to still be improving quite a bit with more concurrent reads. It may be that with higher IO depth or more VMs we could get throughput closer to what kernel RBD could do. Regardless, it appears there are some limitations somewhere that is holding us back.

### 4M FIO SEQUENTIAL READS (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-read-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_ext4-read-4096k/)

The EXT4 results seem to confirm our suspicion that something is limiting us on the QEMU/KVM side. While we get around 1.5GB/s with kernel RBD, performance is about half that with QEMU/KVM in many of the cases. Interestingly Bobtail did a bit better in the multi-client tests, but not consistently so. In the 128K read tests, BTRFS and EXT4 had some issues while XFS tended to perform more consistently. Let’s move on and see how it does.

### 4M FIO SEQUENTIAL READS (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-read-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_xfs-read-4096k/)

Well, these results aren’t as exciting as what we saw for 128k sequential reads. Kernel RBD performance is still low, and single-guest QEMU/KVM performance is both low and scaling strangely with multiple volumes on Cuttlefish. The one redeeming point here is that the multi-guest QEMU/KVM results are looking pretty good. In fact compared to the BTRFS results, with just 1 volume on 1 guest, XFS seems to be scaling much better with IO depth when compared with BTRFS.

Something I should mention again is that we are using the default read\_ahead\_kb settings in these tests, and almost certainly this is going to have a big effect with large sequential reads like this. Tweaking it both on the client side device and on the OSDs could have a major effect.

### 4M FIO RANDOM READS (BTRFS OSDS)

   
[![](images/cuttlefish-rbd_btrfs-randread-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_btrfs-randread-4096k/)

4M Random Reads are definitely slower with BTRFS than sequential reads. Again we are seeing some strange scaling effects with Bobtail, but BTRFS looks less unusual. Again, we are seeing lower performance with QEMU/KVM, and the slope of the curve may indicate that with more concurrency we could improve performance.

### 4M FIO RANDOM READS (EXT4 OSDS)

   
[![](images/cuttlefish-rbd_ext4-randread-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_ext4-randread-4096k/)

With EXT4, random 4M reads are also slower than sequential reads with kernel RBD. Nothing really unexpected.

### 4M FIO RANDOM READS (XFS OSDS)

   
[![](images/cuttlefish-rbd_xfs-randread-4096K.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/attachment/cuttlefish-rbd_xfs-randread-4096k/)

Again, nothing too surprising here. XFS 4M random read performance is a bit lower than sequential read performance. IO behavior is mostly similar.

### CONCLUSION

Alright, some good and some not so good things in here. Write performance was pretty good with nice consistent scaling and relatively high peak throughput, especially with multiple VMs targeting XFS backed OSDs. On the read side, we saw that the potential is there to hit nearly 2GB/s as we saw in the sequential BTRFS read tests on kernel RBD. On the other hand, we saw poor scaling and low performance in some of the read tests too. Now, there is probably a reasonable argument that it was foolhardy to run hundreds of read tests and not set read\_ahead\_kb to something slightly more reasonable than the default 128k. To that I say balderdash! Frankly I’m happy we managed to get this all of this written up at all. We’ll come back to read ahead in a future article and see what happens. Consider this just the preview.

So, that’s the end of the RBD tests. In the thrilling conclusion to our investigation of Cuttlefish VS Bobtail performance, we’ll review all of the data we’ve looked at and see if we can derive any meaning from it all. Stay tuned, you’re almost to the end!

Update: [Part 5](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-5-results-summary-conclusion/ "Ceph Cuttlefish VS Bobtail Part 5: Results Summary & Conclusion"), the last in this series has been released! Huzzah!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-4-4m-rbd-performance/&bvt=rss&p=wordpress)
