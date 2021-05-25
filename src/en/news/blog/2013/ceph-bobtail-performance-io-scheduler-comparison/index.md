---
title: "Ceph Bobtail Performance – IO Scheduler Comparison"
date: "2013-01-22"
author: "MarkNelson"
tags: 
  - "planet"
---

Contents

1. [Introduction](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/)
2. [System Setup](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/#setup)
3. [Test Setup](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/#test_setup)
4. [4KB Results](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/#4kbradoswrite)
5. [128KB Results](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/#128kbradoswrite)
6. [4MB Results](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/#4mbradoswrite)
7. [Results Summary](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/#summary)
8. [Conclusion](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/#conclusion)

### INTRODUCTION

One of the strangest things about the holidays is how productive I am. Maybe it’s the fact that Minnesota is bitterly cold this time of year, and the only entertaining things to do outside often involve subzero winds rushing at your face. Or perhaps it’s the desire to escape from all other forms of life after 4-5 consecutive holiday celebrations. In any event, this is the time of year where (assuming I’m not shoveling 3 feet of snow) I tend to get a bit more done. Luckily for you that means we’ve got a couple of new articles already in the works.

One of the things that people have periodically asked me is what IO scheduler they should be using to get maximum performance with Ceph. In case you don’t know, an IO scheduler is typically an algorithm that employs a queue, or set of queues, where block IO requests go and are operated on before being sent to the underlying storage device. In this article we’ll take a look at how Ceph performs with some of the common Linux IO schedulers in a couple of different scenarios. Without further ado, lets get to work:

   
![](images/drawing-ioscheduler.png)

On many Linux systems there are typically three IO schedulers to choose from. Here’s a very brief (and somewhat incomplete) explanation of each:

- CFQ: Puts IO requests into per-process queues and allocates time slices for each queue.
- Deadline: Assigns deadlines to IO requests and puts them into queues that are sorted by their deadlines.
- NOOP: Puts IO requests into a simple FIFO queue. Any scheduling is performed at another layer.

People often recommend Deadline or NOOP when using SSDs or a controller with write-back cache. CFQ tends to excel with spinning disks on desktops or workstations where there is a user directly interacting with the system. It’s not clear that CFQ would help something like Ceph though. Rather than just making recommendations up based on this second hand knowledge, I figured it was time to go looking for some answers and see how these schedulers really perform.

### SYSTEM SETUP

We are going to use the SAS2208 controller for these tests. It supports JBOD, multiple single-drive RAID0, and single-OSD RAID0 configurations. Unfortunately different controllers will have different IO reordering capabilities so these results may not be representative for other controllers. Hopefully they will at least provide an initial starting point and perhaps a guess as to how similar configurations may perform.

Hardware being used in this setup includes:

- Chassis: Supermicro 4U 36-drive SC847A
- Motherboard: Supermicro X9DRH-7F
- Disk Controller: On-board SAS2208
- CPUS: 2 X Intel XEON E5-2630L (2.0GHz, 6-core)
- RAM: 8 X 4GB Supermicro ECC Registered DDR1333 (32GB total)
- Disks: 8 X 7200RPM Seagate Constellation ES 1TB Enterprise SATA
- NIC: Intel X520-DA2 10GBE

As far as software goes, these tests will use:

- OS: Ubuntu 12.04
- Kernel: 3.6.3 from Ceph’s GitBuilder archive
- Tools: blktrace, collectl, perf
- Ceph: Ceph “next” branch from just before the 0.56 bobtail release.

### TEST SETUP

Similarly to what we’ve done in previous articles, we are running tests directly on the SC847a using localhost TCP socket connections. We are performing both read and write tests. A 10G journal partition was setup at the beginning of each device. The following controller modes were tested:

- JBOD Mode (Acts like a standard SAS controller.  Does not use on-board cache.)
- 8xRAID0 mode (A single drive RAID0 group for each OSD. Uses on-board write-back cache.)
- RAID0 Mode (A single OSD on a multi-disk RAID0 group.  Uses on-board write-back cache.)

To generate results, we are using Ceph’s trusty built-in benchmarking command: “RADOS bench” which writes new objects for every chunk of data that is to be written out (Some day I’ll get to the promised smalliobench article!). RADOS bench has certain benefits and drawbacks. On one hand it gives you a very clear picture of how fast OSDs can write out and read objects at various sizes. What it does not test is how quickly small IO to large objects are performed. For that reason and others, these results are not necessarily reflective of how RBD will ultimately perform.

Like in our previous articles, we are running 8 concurrent instances of RADOS bench and aggregating the results to ensure that it is not a bottleneck. We are instructing each instance of RADOS bench to write to its own pool with 2048 PGs each. This is done to ensure that later on during read tests each instance of RADOS bench reads unique objects that were not previously read into page cache by one of the other instances. You may also notice that we are using a power-of-2 number of PGs per pool. Due to the way that Ceph implements PG splitting behavior, having a power-of-2 number of PGs (especially at low PG counts!) may improve how evenly data is distributed across OSDs. At larger PG counts this may not be as important.

RADOS bench gives you some flexibility regarding how big objects should be, how many to concurrently keep in flight, and how long tests should be run for. We’ve settled on 5 minute tests using the following permutations:

- 4KB Objects, 16 Concurrent Operations (2 per rados bench instance)
- 4KB Objects, 256 Concurrent Operations (32 per rados bench instance)
- 128KB Objects, 16 Concurrent Operations (2 per rados bench instance)
- 128KB Objects, 256 Concurrent Operations (32 per rados bench instance)
- 4M Objects, 16 Concurrent Operations (2 per rados bench instance)
- 4M Objects, 256 Concurrent Operations (32 per rados bench instance)

For each permutation, we run the same test using either BTRFS, XFS, or EXT4 for the underlying OSD file system and CFQ, Deadline, or NOOP for the IO scheduler. File systems are reformatted and mkcephfs is re-run between every test to ensure that fragmentation from previous tests does not affect the outcome. Keep in mind that this may be misleading if trying to use these results to determine how a production cluster would perform. Each file system appears to age differently and may perform quite differently over time.  Despite this, reformatting between each test is necessary to ensure that the comparisons are fair.

We left most Ceph tunables in their default state for these tests except for two. “filestore xattr use omap” was enabled to ensure that EXT4 worked properly. CephX authentication was also disabled as it was not necessary for these tests.

We did pass certain mkfs and mount options to the underlying file systems where it made sense. In response to the Bobtail performance preview, Christoph Hellwig [pointed out](http://comments.gmane.org/gmane.comp.file-systems.ceph.devel/11530) that Ceph would likely benefit from using the inode64 mount option with XFS, and mentioned a couple of other tunable options that might be worth trying. We didn’t have time to explore all of them, but did enable inode64 for these tests.

- mkfs.btfs options: -l 16k -n 16k
- btrfs mount options: -o noatime
- mkfs.xfs options: -f -i size=2048 (-d su-64k, sw=8 for RAID0 tests)
- xfs mount options: -o inode64,noatime
- mkfs.ext4 options: (-b 4096 -E stride=16,stripe-width=128 for RAID0 tests)
- ext4 mount options: -o noatime,user\_xattr

During the tests, collectl was used to record various system performance statistics.

### 4KB RADOS BENCH WRITE RESULTS

[![](images/IO_Scheduler-write-0004K-016.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-write-0004k-016/)  
 

Well, so far it looks like some of our suspicions are holding true. In modes where WB cache is being used, Deadline and NOOP seem have some advantages over CFQ. That probably makes sense considering that the controller can do it’s own reordering. In JBOD mode though it looks like the situation is reversed with CFQ tending to perform better.

[![](images/IO_Scheduler-write-0004K-256.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-write-0004k-256/)

With more concurrent operations, CFQ continues to do well in JBOD mode. In the two RAID modes, the race has tightened, but CFQ continues to do poorly with EXT4 in the single-OSD RAID0 configuration.

### 4KB RADOS BENCH READ RESULTS

[![](images/IO_Scheduler-read-0004K-016.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-read-0004k-016/)

With few concurrent 4K reads, it looks like NOOP and Deadline tend to be a better choice for BTRFS, but EXT4 and XFS results are a little more muddled. In the 8xRAID0 mode it actually likes like CFQ may be pulling ahead, but more samples should probably be taken to make sure.

[![](images/IO_Scheduler-read-0004K-256.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-read-0004k-256/)

Wow! There are some crazy trends here. BTRFS performance seems to be pretty consistent across IO schedulers now, but XFS and EXT4 are showing some pretty big differences. EXT4 in 1 disk per OSD setups seems to do far better with CFQ than either Deadline or NOOP. With XFS on the other hand, CFQ seems to be doing far worse than Deadline or NOOP in the JBOD configuration.

### 128KB RADOS BENCH WRITE RESULTS

[![](images/IO_Scheduler-write-0128K-016.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-write-0128k-016/)

With few concurrent 128k writes, it looks like BTRFS is tending to favor Deadline and NOOP. CFQ seems to pull out a solitary win with EXT4. In the single-osd RAID0 configuration though, XFS and EXT4 do significantly better with Deadline and NOOP.

[![](images/IO_Scheduler-write-0128K-256.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-write-0128k-256/)

Adding more concurrent 128k writes seems to push CFQ back into the lead in the JBOD tests. Deadline and NOOP seem to generally be better in the modes with WB cache, especially with EXT4.

### 128KB RADOS BENCH READ RESULTS

[![](images/IO_Scheduler-read-0128K-016.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-read-0128k-016/)

The results here at kind of muddled. I think the only clear thing is that EXT4 really seems to favor CFQ in the multi-OSD modes, while BTRFS seems to favor Deadline and NOOP in the big RAID0 configuration.

[![](images/IO_Scheduler-read-0128K-256.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-read-0128k-256/)

With more concurrent reads, it’s still tough to make any significant conclusions other than to say that EXT4 read performance continues to be highest in multi-OSD configurations with CFQ.

### 4MB RADOS BENCH WRITE RESULTS

[![](images/IO_Scheduler-write-4096K-016.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-write-4096k-016/)

It’s tough to make any strong conclusions here except that EXT4 seems to do better with Deadline and NOOP in the big RAID0 configuration.

[![](images/IO_Scheduler-write-4096K-256.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-write-4096k-256/)

Again, tough to make any real strong conclusions here, other than maybe that EXT4 is doing better with CFQ in JBOD mode, and does worst with Deadline in the 8-OSD, single disk, RAID0 mode.

### 4MB RADOS BENCH READ RESULTS

[![](images/IO_Scheduler-read-4096K-016.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-read-4096k-016/)

Looks like XFS and BTRFS are slightly favoring Deadline and NOOP across the board, while EXT4 favors CFQ in the multi-OSD configurations, but favors Deadline and NOOP in the 1-OSD RAID0 configuration.

[![](images/IO_Scheduler-read-4096K-256.png)](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/io_scheduler-read-4096k-256/)

The big obvious thing here is the dramatic performance drop with Deadline and NOOP when using EXT4 with the 8-OSD RAID0 configuration. Otherwise, Deadline and NOOP seem to maybe do slightly better than CFQ.

### RESULTS SUMMARY

Alright, that wasn’t nearly as intense as the last article. A proverbial walk in the park. Still, it’s not exactly easy to draw meaningful trends from the scatter plots shown above. Lets take a look at the averages for each IO scheduler and examine how they compare at different IO sizes. I’m color-coding the results based on how the mean and standard deviation ranges for the results compare. Specifically, I take the scheduler with the highest mean throughput and compare its 1-standard deviation range to that of the lowest performing scheduler. If the ranges overlap, no color coding is done. If the ranges are distinct, the highest performing scheduler mean is colored green and the lowest colored red. The middle scheduler’s mean is color coded based on how it compares to the other two. This probably isn’t precise enough for a scientific journal, but I figure for a blog post it isn’t entirely unreasonable.

[![](images/4K_summary.png "4K_summary")](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/4k_summary/)

I think so far our hypothesis that DEADLINE and NOOP are better for modes with WB cache is roughly correct. Interestingly CFQ does pull off a number of wins in the JBOD mode. There’s some mixed results in the 8xRAID0 mode, but it looks like the only really major CFQ win there is for EXT4 reads. In RAID0 mode CFQ doesn’t show any advantages at all as far as I can tell.

[![](images/128K_summary.png "128K_summary")](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/128k_summary/)

The results look pretty consistent with the 4K results. CFQ tends to do pretty well in JBOD mode, but otherwise is often beat out by Deadline and NOOP in the other modes, except for 8xRAID0 EXT4 reads.

[![](images/4M_summary.png "4M_summary")](http://ceph.com/community/ceph-bobtail-performance-io-scheduler-comparison/attachment/4m_summary/)

With large IOs, the only times were CFQ seems to be a consistent win is with EXT4 in JBOD and 8xRAID0 modes. Otherwise, it looks like if you want to optimize for large IOs you are best off with Deadline and in some cases NOOP.

### CONCLUSION

Well there you have it. If you’ve ever wondered what IO scheduler to use with Ceph, this will hopefully provide some insight. Namely, that if you use EXT4 or have a JBOD configuration, CFQ might be worth looking at. In many of the other configurations, you may want to choose Deadline (or sometimes NOOP). In some cases, you may have to sacrifice read or write performance to improve the other. Given that every controller is different these results may not be universal, but it looks like these results at least fall roughly in line with the conventional wisdom regarding these schedulers. This concludes our article, but keep your eyes peeled for the next one where we will examine how different Ceph tunables affect performance. Until next time Ceph enthusiasts!

