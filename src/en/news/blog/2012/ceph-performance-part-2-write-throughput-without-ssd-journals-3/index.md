---
title: "Ceph Performance Part 2: Write Throughput Without SSD Journals"
date: "2012-11-09"
author: "MarkNelson"
tags: 
  - "ceph"
  - "hardware"
---

### INTRODUCTION

Hello again!

If you are new around these parts you may want to start out by reading the first article in this series available [here](http://ceph.com/community/ceph-performance-part-1-disk-controller-write-throughput/).

For the rest of you, I am sure you are no doubt aware by now of the epic battle that Mark Shuttleworth and I are waging over who can generate more page hits on the ceph.com website.  I’ve made a totally original and in no way inaccurate illustration to document the saga for future generations:

![Shuttleworth is going down!](images/drawing-e1351859643830.png)  
  
After writing the first article I realized that my 15 minutes of Internet fame had started and that I better milk it for all it’s worth before people start moving back to Lolcats and Slashdot.  Unfortunately I used half of my budgeted time producing the _trompe l’oeil_ shown above, so you’ll have to forgive me for recycling the format of the last article for this one.  In fact you should probably just consider this to be a continuation rather than a new one.  If that excites you, please continue reading.  This time we are going to look at how each of the disk controllers used in the last set of tests performs with 8 spinning disks that have data and journal partitions both stored on the same device(s).

### HARDWARE AND SOFTWARE SETUP

Here’s a recap of the system setup we’ll be testing:

[![SAS/Raid Controllers](images/controllers-400x300.jpg)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/controllers/)

The SAS/RAID Controllers we will be testing.

- **High Point Rocket 2720SGL (center top):** This is an entry level SAS controller with a marvel 9485 RAID chipset. This particular model has a JBOD-mode-only firmware and can be had for a measly $150 on the net.
- **Areca ARC-1880 (middle left):** This is Areca’s previous-generation high end RAID controller. Still considered to be quite fast. Supports disks in JBOD mode, a pass-through mode, and RAID0-6 setups.
- **Areca ARC-1222 (middle right):** This is a much older Areca RAID controller and is only really being included in this comparison because we happened to have a spare one laying around. Supports disks in JBOD mode, a pass-through mode, and RAID0-6 setups.
- **LSI SAS 9207-8i (bottom left):** This is LSI’s newest budget controller using the SAS2308 chipset. Interestingly they ship it with the IT/JBOD firmware which does not support any RAID configurations at all. Card can be had for about $240.
- **LSI SAS 9211-8i (bottom right):** Ah, the 9211-8i. It uses the venerable SAS2008 chipset, widely known and used in ZFS deployments all over the world. It’s basically a SAS controller that supports JBOD mode and very basic RAID0/1 functionality. There appears to be little or no write-through or write-back cache. Can be had for around $225.
- **LSI SAS 2208 (not shown):** It just so happens that the Supermicro motherboard we purchased has LSIs current higher-end SAS 2208 chipset on it with 1GB of cache and full JBOD and RAID0-6 mode support. LSI’s equivalent standalone card is the SAS 9265-8i, which retails for around $630.

Other hardware being used in this setup includes:

- Chassis: Supermicro 4U 36-drive SC847A
- Motherboard: Supermicro X9DRH-7F
- CPUS: 2 X Intel XEON E5-2630L (2.0GHz, 6-core)
- RAM: 8 X 4GB Supermicro ECC Registered DDR1333 (32GB total)
- Disks: 8 X 7200RPM Seagate Constellation ES 1TB Enterprise SATA
- NIC: Intel X520-DA2 10GBE

As far as software goes, these tests will use:

- OS: Ubuntu 12.04
- Ceph: 0.50
- Kernel: 3.4 from source
- Tools: blktrace, collectl, perf

In a response to the previous article, a reader asked if hardware crc32c instruction support was enabled.  Ceph itself does not currently make use of hardware crc32c (it uses a C based slice-by-8 implementation), but apparently BTRFS can.  A quick look at /proc/crypto shows:

name         : crc32c
driver       : crc32c-intel
module       : crc32c\_intel
priority     : 200
refcnt       : 2
selftest     : passed
type         : shash
blocksize    : 1
digestsize   : 4

Theoretically BTRFS should be using hardware crc32c instructions both for the results in this article and for the results in the previous one.

### Test Setup

In this article the focus is specifically on the raw controller/disk throughput that can be obtained, so these tests are being run directly on the SC847a using localhost TCP socket connections.  As opposed to the first article, the controllers’ ability to help the drives deal with conflicting writes to the journal and data partitions will be of paramount importance.  Each controller being tested supports a variety of operational modes. To keep things reasonable we are testing 3 configurations that all use the same number of data and journal disks:

- JBOD Mode (Supported by all controllers in these tests. Acts like a standard SAS controller.  Journals are on separate 10G partitions on each drive.)
- Pass-through/8xRAID0 mode (Supported on the Areca controllers and can be simulated on the SAS2208 by creating a single drive RAID0 for each OSD. Uses on-board write-back cache.  Journals are on separate 10G partitions on each drive.)
- RAID0 Mode (A single OSD on a 8-disk RAID0 array. A single 80G Journal is placed on a separate partition on the RIAD0 array. Write-back cache is enabled on the controllers that support it.

Based on the tests performed in the previous article and some on-line rumors, it appears that Areca’s JBOD mode is indeed using on-board cache and should perform similarly to the pass-through mode.  This may give it an advantage over JBOD modes on other controllers.

To generate results, we are using Ceph’s built-in benchmarking command: “RADOS bench” which writes new objects for every chunk of data that is to be written out. RADOS bench has certain benefits and drawbacks. On one hand it gives you a very clear picture of how fast OSDs can write out new objects at various sizes. What it does not test is how quickly small writes to existing objects are performed. This is relevant, because this is exactly what happens when doing small random writes to an RBD volume.  Recently Inktank’s own Sam Just wrote another set of benchmarks called smalliobench and smalliobenchfs and introduced them into the Ceph master git branch that simulates these kinds of IO.  In future articles we’ll start to look at those tools, but for now we’ll again be using RADOS bench.  Again, we are running 8 concurrent instances of the benchmark and aggregating the results to ensure that the benchmark is not a bottleneck.

RADOS bench gives you some flexibility regarding how big objects should be, how many to concurrently keep in flight, and how long the test should be run for. We’ve settled on 5 minute tests using the following permutations:

- 4KB Objects, 16 Concurrent Operations (2 per rados bench instance)
- 4KB Objects, 256 Concurrent Operations (32 per rados bench instance)
- 128KB Objects, 16 Concurrent Operations (2 per rados bench instance)
- 128KB Objects, 256 Concurrent Operations (32 per rados bench instance)
- 4M Objects, 16 Concurrent Operations (2 per rados bench instance)
- 4M Objects, 256 Concurrent Operations (32 per rados bench instance)

For each permutation, we run the same test using BTRFS, XFS, and EXT4 for the underlying OSD filesystems. Filesystems are reformatted and mkcephfs is re-run between every test to ensure that fragmentation from previous tests does not affect the outcome. We left most Ceph tunables in their default state for these tests except for: “filestore xattr use omap = true” to ensure that EXT4 worked properly. We did pass certain mkfs and mount options to the underlying file systems where it made sense:

- mkfs.btfs options: -l 16k -n 16k
- btrfs mount options: -o noatime
- mkfs.xfs options: -f -i size=2048 (-d su-64k, sw=8 for RAID0 tests)
- xfs mount options: -o noatime
- mkfs.ext4 options: (-b 4096 -E stride=16,stripe-width=128 for RAID0 tests)
- ext4 mount options: -o noatime,user\_xattr

During the tests, collectl was used to record various system performance statistics, and perf was used to gather profiling data on the running processes. blktrace was also run against every OSD data disk so that we could potentially go back and examine seek behavior on the underlying block devices.

### 4KB RADOS BENCH RESULTS

[![16 Concurrent 4K Writes](images/A2_16Concurrent4KWrite.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4kwrite/)

Before we get started you may want to open the [Ceph Performance Part 1](http://ceph.com/community/ceph-performance-part-1-disk-controller-write-throughput/) article in another window and scroll down to the first set of tests.  I’ll be comparing the numbers in this article to those found in the previous one.  The first thing that you might notice here is that some of the controllers have very different performance characteristics than they did when SSDs were used for journals.  The RAID controllers that have write-back cache are now leading the pack when used in 8-OSD modes.  It looks like the cache may be helping reorder writes to mitigate extra seeks caused by the journal being stored on the same disks.  Like in the last article, using a single OSD with a big RAID0 array is pretty slow.  Surprisingly this is not the slowest configuration.  In the previous article when SSDs were used for the journals, the cheap SAS controllers in JBOD mode were among the fastest controllers tested (Specifically the SAS2308, 2720SGL, and SAS2008). Without SSD drives for the journals they are now amongst the slowest.  What happened?  I suspect the lack of on-board cache is really hurting them.  Writes are likely taking longer to complete, and I suspect that with few concurrent operations per OSD there just isn’t enough concurrency to hide it.  In the previous article we never showed RADOS Bench operation latencies for each of the tests, but we did collect the information. We’ve done so again now.  Lets compare the results and see if the theory holds up:

_Click on any of the images below (and click again) to enlarge them…_

[![16 Concurrent 4K Write Op Latency (BTRFS)](images/A2_16Concurrent4KWriteLatencyBTRFS-220x140.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4kwritelatencybtrfs/)

16 Concurrent 4K Write Op Latency (BTRFS)

[![16 Concurrent 4K Write Op Latency (XFS)](images/A2_16Concurrent4KWriteLatencyXFS-220x140.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4kwritelatencyxfs/)

16 Concurrent 4K Write Op Latency (XFS)

[![16 Concurrent 4K Write Op Latency (EXT4)](images/A2_16Concurrent4KWriteLatencyEXT4-220x140.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4kwritelatencyext4/)

16 Concurrent 4K Write Op Latency (EXT4)

Indeed, it’s pretty clear that if there are few concurrent OPs, it really helps to have a controller with on-board cache or have SSD journals.  In a bit we’ll look and see if this trend holds true with more concurrent OPs.  First though, lets look at the CPU utilization and average disk queue times.

_Click on any of the images below (and click again) to enlarge them…_

[![16 Concurrent 4K Writes - CPU Utilization](images/A2_16Concurrent4KWriteCPU-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4kwritecpu/)

16 Concurrent 4K Writes - CPU Utilization

[![16 Concurrent 4K Writes - Disk Waits](images/A2_16Concurrent4KWriteWait-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4kwritewait/)

16 Concurrent 4K Writes - Disk Waits

If you’ve read the previous article there should be no real surprises as far as CPU utilization goes.  BTRFS continues to use significantly more CPU resources than the other filesystems, even when it is barely edging out EXT4.  As far as wait times go, BTRFS seems to cause extremely high device queue wait times on the Areca controllers despite performing similarly to the SAS2208.

How do things change with 256 Concurrent OPs?

[![256 Concurrent 4K Writes](images/A2_256Concurrent4KWrite.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4kwrite/)

With 256 Concurrent 4K writes, the RAID controllers with BBU cache are still leading the pack in 8-OSD modes, but the cheaper SAS controllers have caught up considerably.  BTRFS performance is now equal to or maybe even slightly faster than the more expensive controllers.  XFS and EXT4 performance has improve as well, but still lags behind the performance of those filesystems on the controllers with BBU cache.  How do the latencies look?

_Click on any of the images below (and click again) to enlarge them…_

[![256 Concurrent 4K Write Latency (BTRFS)](images/A2_256Concurrent4KWriteLatencyBTRFS-220x140.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4kwritelatencybtrfs/)

256 Concurrent 4K Write Latency (BTRFS)

[![256 Concurrent 4K Write Latency (XFS)](images/A2_256Concurrent4KWriteLatencyXFS-220x140.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4kwritelatencyxfs/)

256 Concurrent 4K Write Latency (XFS)

[![256 Concurrent 4K Write Latency (EXT4)](images/A2_256Concurrent4KWriteLatencyEXT4-220x140.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4kwritelatencyext4/)

256 Concurrent 4K Write Latency (EXT4)

With many concurrent operations in flight, the latencies have increased across the board, but not at the same rate.  The latencies for the cheaper SAS controllers are now more in-line with the latencies of the higher end RAID controllers.  One thing you may notice in this set of tests is that with enough concurrent operations, there is basically no sustained IOP advantage to having journals on SSDs.  Nor is there any advantage to having 2 additional OSDs (Though the journals are on the same disks.)  It’s not entirely clear what this may indicate, but it may be that there are software limitations in play here.  Indeed, several improvements have been made to the OSD threading and locking code recently in the Ceph master branch that may increase performance of small writes in some cases.

_Click on any of the images below (and click again) to enlarge them…_

[![256 Concurent 4K Writes - CPU Utilization](images/A2_256Concurrent4KWriteCPU-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4kwritecpu/)

256 Concurent 4K Writes - CPU Utilization

[![256 Concurent 4K Writes - Disk Waits](images/A2_256Concurrent4KWriteWait-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4kwritewait/)

256 Concurent 4K Writes - Disk Waits

Again we are seeing BTRFS use relatively more CPU in higher performance configurations.  Queue wait times are high again for BTRFS on the Areca cards which we also saw for this test when SSDs were used.  The JBOD cards are showing somewhat high queue wait times for XFS as well.

### 128KB RADOS BENCH RESULTS

[![16 Concurrent 128K Writes](images/A2_16Concurrent128KWrite.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent128kwrite/)

The results with few concurrent 128K writes look similar to the 4K write results.  BTRFS is again mostly on top. Controllers with WB cache are doing well while the controllers with no cache are doing terribly.  The Areca cards specifically are doing exceptionally well; even the outdated ARC-1222.    In fact the Areca cards are performing better in this test with 8 spinning disks serving both the data and journals than in the 6 spinning disk, 2 SSD configuration.  The processors on these controllers must be doing such a good job that the journal writes have little affect on the 128k writes to the data portion of the disks.  While the SAS2208 is the next fastest controller in this test, it is quite a bit slower than the ARC-1880 and slower than the ARC-1222 when using BTRFS.

_Click on any of the images below (and click again) to enlarge them…_

[![16 Concurrent 128K Writes - CPU Utilization](images/A2_16Concurrent128KWriteCPU-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent128kwritecpu/)

16 Concurrent 128K Writes - CPU Utilization

[![16 Concurrent 128K Write - Disk Waits](images/A2_16Concurrent128KWriteWait-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent128kwritewait/)

16 Concurrent 128K Write - Disk Waits

One interesting things to note about the CPU Utilization shown here is that the BTRFS results, while still quite high, appear to be much lower per unit throughput than for the same tests in the previous article.  Part of this might be because the throughput is overall slower. If you compare the fastest results from this test to those from the previous article though, it’s pretty clear that the CPU Utilization is higher with some controllers for the same level of performance than with others.  The high queue wait times for BTRFS on the Areca controllers has disappeared with 128K writes and XFS now appears to be causing higher queue wait times than the other filesystems.  The SAS2008 in RAID0 mode specifically seems to cause high queue waits despite being slow, which is something we glimpsed in the previous article as well.

[![256 Concurrent 128K Writes](images/A2_256Concurrent128KWrite.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent128kwrite/)

With 256 concurrent 128K writes, the SAS2208 performance with 8 single drive RAID0 arrays has improved significantly and now holds the top spot, just barely edging out the ARC-1880.  The ARC-1880 performs significantly better with EXT4, while performing only slightly worse with BTRFS and significantly worse with XFS.  Performance of the cache-less SAS controllers has again improved and now perform roughly the same as the ARC-1222 in 8-OSD modes.  BTRFS performance on all of these controllers is relatively high, while EXT4 and XFS performance is poor.  The single OSD RAID0 mode is again quite slow on the controllers that support it.

_Click on any of the images below (and click again) to enlarge them…_

[![256 Concurrent 128K Writes - CPU Utilization](images/A2_256Concurrent128KWriteCPU-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent128kwritecpu/)

256 Concurrent 128K Writes - CPU Utilization

[![256 Concurrent 128K Writes - Disk Latency](images/A2_256Concurrent128KWriteWait-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent128kwritewait/)

256 Concurrent 128K Writes - Disk Waits

CPU Utilization is still high across the board with BTRFS, but not quite as high for this test as when SSDs were used for journals.  Disk wait times are again high with XFS, which is something we saw with SSD journals as well.

### 4MB RADOS BENCH RESULTS

[![16 Concurrent 4M Writes](images/A2_16Concurrent4MWrite.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4mwrite/)

With 16 concurrent 4MB writes, a very curious thing happens.  The high-end SAS2208 and ARC-1880 controllers are again in the top positions which is no surprise.  What is surprising is that the RAID0 configuration on these controllers is doing very well, but only with EXT4!  In fact with EXT4, the SAS2208 in the fastest controller in this test when configured with an 8 drive RAID0 array.  It narrowly beats out the same controller configured with single disk RAID0 arrays when using BTRFS.  The same story is true for the ARC-1880, though the performance is about 15% lower in both cases. Despite all of this, we now are starting to see some limitations when putting the journals on the same disks as the data.  Despite having 2 more spinning disks, the fastest configuration in this test is only able to hit about 450MB/s, while the cheap SAS controllers were able to hit closer to 700MB/s when SSDs were used for the journals.  Speaking of the SAS controllers, they are still slow without SSD backed journals, but at least they don’t look quite as pathetic as they did in tests with smaller writes.  The ARC-1222 is finally showing its age and despite having WB cache only barely keeps up with the SAS controllers.  Finally the SAS2008 just can’t keep up at all in RAID0 mode with its lack of cache and slower processor and falls far behind everything else.

_Click on any of the images below (and click again) to enlarge them…_

[![16 Concurrent 4M Writes - CPU Utilization](images/A2_16Concurrent4MWriteCPU-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4mwritecpu/)

16 Concurrent 4M Writes - CPU Utilization

[![16 Concurrent 4M Writes - Disk Waits](images/A2_16Concurrent4MWriteWait-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_16concurrent4mwritewait/)

16 Concurrent 4M Writes - Disk Waits

CPU Utilization with BTRFS appears to be high again in these tests, but if you look at the scale you’ll see that it only goes up to about 28%.  In the previous tests, the CPU utilization when using BTRFS was closer to 80%, though performance was also quite a bit higher.  Disk queue wait times all seem to be roughly even except for the Areca cards.  The ARC-1880 has somewhat higher queue wait times while the ARC-1222 has much higher queue wait times (especially with XFS).

[![256 Concurrent 4M Writes](images/A2_256Concurrent4MWrite.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4mwrite/)With more concurrent ops we again see the SAS controllers improve, but not quite enough to surpass the SAS2208 and the ARC-1880.  When you factor in journal writes, all of the controllers except the ARC-1222 are now able to break 110MB/s per drive with BTRFS data partitions.  The SAS2208 and the ARC-1880 are able to push more like 120-130MB/s and are getting close to the drive throughput limits.  Sadly XFS and EXT4 performance is typically quite a bit lower and often tops out at 80-100MB/s per drive.

_Click on any of the images below (and click again) to enlarge them…_

[![256 Concurrent 4M Writes - CPU Utilization](images/A2_256Concurrent4MWriteCPU-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4mwritecpu/)

256 Concurrent 4M Writes - CPU Utilization

[![256 Concurrent 4M Writes - Disk Waits](images/A2_256Concurrent4MWriteWait-293x220.png)](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/attachment/a2_256concurrent4mwritewait/)

256 Concurrent 4M Writes - Disk Waits

Both the CPU utilization numbers and the queue wait times look similar to what we saw with 16 concurrent 4M writes, just scaled higher.  The Queue Wait times specifically are much higher on the Areca controllers in 8-OSD modes and with XFS specifically.

### CONCLUSION

Alright, another article finished.  Now I can get back to playing World of War^H^H^H^H diligently working on important problems. (Really, it’s past working hours!)  Oh wait, I should probably say something here.  Ok, first things first, BTRFS again (at least on the surface) looks like it performs quite a bit better than XFS.  EXT4 is mixed and sometimes does slightly better than BTRFS and other times almost as bad as XFS.  In the future we’ll want to compare the filesystems in more depth and look at how performance changes over time (Hint: BTRFS small write performance tends to degrade rather quickly).  For now, if you want the highest performance possible on freshly created filesystems with no regard for CPU utilization, BTRFS is your thing.

Beyond that we see that when you are putting journals on the same drives as data, controllers with write-back cache really do make a big difference.  It’s most pronounced when there are few IOs in flight. Even when there are many IOs in flight it still appears to help a bit.  This is pretty much the opposite of what we saw when journals were on SSDs.  In that case, cheaper SAS controllers are often the highest performing cards no matter how many IOs in flight. 

Curiously, switching from dedicated SSDs to shared spinning disks for the journals does not seem to decrease IOP throughput noticeably, but it does significantly decrease throughput when writing out large 4MB objects.  It’s possible that tuning various ceph parameters might help here but it’s also possible that there are some areas in Ceph where small IO throughput could be improved.

As to whether or not it’s better to buy expensive controllers and use all of your drive bays for spinning disks or cheap controllers and use some portion of your bays for SSDs/Journals, there are trade-offs.  If built right, systems with SSD journals provide higher large block write throughput, while putting journals on the data disks provides higher storage density.  Without any tuning both solutions currently provide similar IOP throughput.

### FUTURE WORK

I really wanted to do a scaling and tuning article next, but I think before I tackle that we should do a quick investigation of Argonaut vs the upcoming and shiny Bobtail release.  There are a number of performance improvements and the new smalliobench benchmarking tools available that will really be worth digging into.  Beyond that, we still have everything (minus this set of tests!) left from our list in last article to investigate, plus a couple of other investigations I’ve got planned.  There’s definitely a lot more to do!  I hope this has been valuable for you guys.  As always, if you have any questions or suggestions, feel free to [email](mailto:mark.nelson@inktank.com) me or leave a comment below.

P.S. If you are going to SC12 this year stop by the Ceph booth! We are booth #3361 and right by the whisper suites. I’ll be there on the opening Gala night and also wandering around during the rest of the convention.

Thanks for reading!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/&bvt=rss&p=wordpress)
