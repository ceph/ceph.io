---
title: "Argonaut vs Bobtail Performance Preview"
date: "2012-12-20"
author: "MarkNelson"
tags: 
  - "argonaut"
  - "bobtail"
  - "ceph"
---

Contents

1. [Introduction](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/)
2. [System Setup](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#setup)
3. [Test Setup](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#test_setup)
4. [4KB Write Results](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#4kbradoswrite)
5. [4KB Read Results](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#4kbradosread)
6. [128KB Write Results](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#128kbradoswrite)
7. [128KB Read Results](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#128kbradosread)
8. [4MB Write Results](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#4mbradoswrite)
9. [4MB Read Results](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#4mbradosread)
10. [Conclusion](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#conclusion)

### INTRODUCTION

Hello again!

War. War never changes. Some of you may have been following my bitter rivalry with Mark Shuttleworth.  Now, I am perfectly aware that I share nearly as much blame as he does for this entire debacle. We”ve both [done things](http://slashdot.org/comments.pl?sid=3274815&cid=42095137) that can”t be undone and we”re just going to have get past it. (Come on Slashdot? flamebait? You really need an _incredibly obvious_ click-baiting descriptor.) Anyway, I think it”s time to finally bury the hatchet. Let bygones be bygones and all that? I say we all sit down, calmly work through our differences, and find peace in mutual… Oh who am I kidding. The only way to resolve this is through a fight to the death!

Oh no, not me and Shuttleworth. I wouldn”t stand a chance. I”ve heard rumors that Unity can now plant subliminal messages in your dreams. How am I supposed to fight when I can”t even sleep? No this must be resolved through _aquatic lifeform combat_. Can the champion Argonaut defend his title from the likes of the upstart challenger Bobtail? Will competitive fighting arcade games from the early 90s make a come back? Will Protendo and Kobatashi ever be able to reclaim their lost honor? Let the battle commence!

   
![Round 1: Fight!](images/argonautvsbobtail.png)

Some of you may notice a slight discrepancy. Technically we are not actually benchmarking Bobtail here. You see, at one point 0.55 was supposed to be Bobtail. Me, being the diligent little worker I am, went through and ran (and re-ran) a \*lot\* of tests. I then found out roughly a day after they were done that Bobtail would in fact be based off 0.56. Oh well… You”ve got to break a few eggs (like what”s left of my sanity) to make an omelet. For the most part these results should provide a relatively good idea of what Bobtail has in store.  Why destroy all of our _delicious_ brain cells by running these tests in the first place though?  I”ll tell you why. (Like you had a choice!)  Bobtail includes a whole slew of new enhancements that should help improve small IO performance:

- Revamp of the OSD threading code
- Much finer grained locking
- More efficient commits (The whole queue no longer has to drain)
- Small writes are no longer  explicitly flushed (filestore\_flush\_min)

For a more in depth look at some of the changes we”ve made in Bobtail, read Sam Just”s excellent article [What”s New in the Land of OSD?](http://ceph.com/dev-notes/whats-new-in-the-land-of-osd/ "What’s New in the Land of OSD?")

Before we move on, I should mention that when I say we ran a \*lot\* of tests, I mean a \*LOT\* of tests.  If your attention span is as short as mine is, you may want to skip right down the conclusion section.  There are interesting things going on in the charts below, but it”s a lot of data to absorb.  Just be happy I didn”t include the hundreds of system utilization charts that were created during these tests too!

### SYSTEM SETUP

Unlike what we”ve done previously, we are only going to look at one controller this time: The SAS2208. There just wasn”t enough time to test them all. The SAS2208 does an ok job of representing the group as a whole since you can do JBOD, multiple single-drive RAID0, and single-OSD RAID0 configurations.

Hardware being used in this setup includes:

- Chassis: Supermicro 4U 36-drive SC847A
- Motherboard: Supermicro X9DRH-7F
- Disk Controller: On-board SAS2208
- CPUS: 2 X Intel XEON E5-2630L (2.0GHz, 6-core)
- RAM: 8 X 4GB Supermicro ECC Registered DDR1333 (32GB total)
- Disks: 6 or 8 X 7200RPM Seagate Constellation ES 1TB Enterprise SATA
- SSDs: 2 or 0 x 180GB Intel 520 SSDs
- NIC: Intel X520-DA2 10GBE

As far as software goes, these tests will use:

- OS: Ubuntu 12.04
- Kernel: 3.6.3 from Ceph”s GitBuilder archive
- Tools: blktrace, collectl, perf

For these tests, Ceph 0.48.2 from Ceph”s GitBuilder archive was downloaded and compared against the “next” git branch of Ceph from oh… say about a week before Ceph 0.55 was released.

### TEST SETUP

Similarly to what we”ve done previously, we are running tests directly on the SC847a using localhost TCP socket connections. The majority of the improvements to the underlying OSD code relates to how the filestore works. Keeping the network out of the picture will help us focus on how much of a difference those changes make without network latencies masking the effects.

Since we are only testing a single controller, we had more time to look at a variety of different tests. We are performing both reads and writes this time. We are also testing the same controller modes we tested in the previous articles:

- JBOD Mode (Acts like a standard SAS controller.  Does not use on-board cache.)
- 8xRAID0 mode (A single drive RAID0 group for each OSD. Uses on-board write-back cache.)
- RAID0 Mode (A single OSD on a multi-disk RAID0 group.  Uses on-board write-back cache.)

In JBOD and 8xRAID0 modes, we test:

- 8 spinning disks with data and 10G journals on each disk in separate partitions.
- 6 spinning disks for data and 2 SSDs for journals (3 10G journal partitions per SSD).

In RAID0 mode we test:

- 8 spinning disks in 1 RAID0 with data and an 80G journal partition.
- 6 spinning disks in a RAID0 for data and 2 SSDs in a 80G RAID0 for journals.

To generate results, we are again using Ceph”s built-in benchmarking command: “RADOS bench” which writes new objects for every chunk of data that is to be written out. RADOS bench has certain benefits and drawbacks. On one hand it gives you a very clear picture of how fast OSDs can write out and read objects at various sizes. What it does not test is how quickly small writes to and reads from large objects are performed.

Like in our prior articles, we are running 8 concurrent instances of RADOS bench and aggregating the results to ensure that it is not a bottleneck. This time however, we are instructing each instance of RADOS bench to write to its own pool with 2048 PGs each. This is done to ensure that later on during read tests each instance of RADOS bench reads unique objects that were not previously read into page cache by one of the other instances. You may also notice that we are using a power-of-2 number of PGs per pool. Due to the way that Ceph implements PG splitting behavior, having a power-of-2 number of PGs (especially at low PG counts!) may improve how evenly data is distributed across OSDs. At larger PG counts this may not be as important.

RADOS bench gives you some flexibility regarding how big objects should be, how many to concurrently keep in flight, and how long tests should be run for. We”ve settled on 5 minute tests using the following permutations:

- 4KB Objects, 16 Concurrent Operations (2 per rados bench instance)
- 4KB Objects, 256 Concurrent Operations (32 per rados bench instance)
- 128KB Objects, 16 Concurrent Operations (2 per rados bench instance)
- 128KB Objects, 256 Concurrent Operations (32 per rados bench instance)
- 4M Objects, 16 Concurrent Operations (2 per rados bench instance)
- 4M Objects, 256 Concurrent Operations (32 per rados bench instance)

For each permutation, we run the same test using BTRFS, XFS, and EXT4 for the underlying OSD file systems. File systems are reformatted and mkcephfs is re-run between every test to ensure that fragmentation from previous tests does not affect the outcome. Keep in mind that this may be misleading if trying to use these results to determine how a production cluster would perform. Each file system appears to age differently and may perform quite differently over time.  Despite this, we are endeavoring to make sure that each file system is tested fairly.  In the future it would be useful to build a tool to age file systems to a pre-determined level and see how it affects the results.

We left most Ceph tunables in their default state for these tests except for: “filestore xattr use omap = true” to ensure that EXT4 worked properly. In 0.55, CephX authentication was enabled by default while previously it had been disabled.  We explicitly disabled it in 0.55 to match the default behavior in Argonaut. We did pass certain mkfs and mount options to the underlying file systems where it made sense:

- mkfs.btfs options: -l 16k -n 16k
- btrfs mount options: -o noatime
- mkfs.xfs options: -f -i size=2048 (-d su-64k, sw=8 for RAID0 tests)
- xfs mount options: -o noatime
- mkfs.ext4 options: (-b 4096 -E stride=16,stripe-width=128 for RAID0 tests)
- ext4 mount options: -o noatime,user\_xattr

During the tests, collectl was used to record various system performance statistics, and perf was used to gather profiling data on the running processes. blktrace was also run against every OSD data disk so that we could potentially go back and examine seek behavior on the underlying block devices.

### 4KB RADOS BENCH WRITE RESULTS

[![](images/AVB_16Concurrent4KWrite8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4kwrite8disk/)Alright, out the gate things are looking pretty good.  With 8 spinning disks and few concurrent 4K writes, BTRFS and XFS are showing some nice improvements.  Interestingly EXT4 only shows minor improvement when 8 single disk RAID0 arrays are used.  Otherwise it is showing noticeable regression.  Lets see what happens when the number of concurrent IOs is increased.

[casino online](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4kwrite8disk/) src=”http://ceph.com/wp-content/uploads/2013/12/AVB\_256Concurrent4KWrite8Disk.png” alt=”" width=”576″ height=”432″ />Bobtail again provides a significantly improvement with XFS and some minor improvements for BTRFS.  EXT4 performance improves noticeably in the 8xRAID0 configuration, but again regresses in the JBOD and single-OSD RAID0 tests.

One point I want to make here is that the BTRFS numbers both for Argonaut and Bobtail have improved substantially relative to [previous tests](http://ceph.com/community/ceph-performance-part-2-write-throughput-without-ssd-journals/ "Ceph Performance Part 2: Write Throughput Without SSD Journals") we”ve done.  There are two differences that might account for this.  One is that we are now writing each file to its own pool instead of to a single pool. Perhaps in the single pool tests the data is not distributed ideally or some bottleneck is limiting small IO throughput.  The other difference is that the tests from the previous articles were run using kernel 3.4 while these tests were run using 3.6.3.  It is entirely possible that the new kernel includes enhancements (especially to BTRFS!) that have improved performance.

[![](images/AVB_16Concurrent4KWrite6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4kwrite6disk2ssd/)Some strange results here!  Why for example are writes faster in the 8xRAID0 config with just spinning disks vs when journals are put on SSDs?  Yes we are giving up two OSDs, but the reduced load on the disks should make up for it and then some. On the other hand, BTRFS performance in JBOD mode is faster with SSD journals than it is with spinning disks.  Mysteries to explore!  (But not now!)  BTRFS performance has improved with Bobtail in the JBOD case.  XFS performance also appears to have increased in the JBOD and RAID0 cases and may have improved slightly in the 8xRAID0 case.  It”s probably too close to to tell.  EXT4 performance didn”t change much in the JBOD and 8xRAID0 cases, but seems to have again regressed in the RAID0 configuration with Bobtail.

[![](images/AVB_256Concurrent4KWrite6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4kwrite6disk2ssd/)Aha, now that looks a little closer to what we”d expect.  The 8xRAID0 mode again takes the lead, especially on Bobtail.  Bobtail shows a noticeable increase in BTRFS performance in both 8xRAID0 and JBOD modes.  XFS performance has increased across the board.  EXT4 performance is mixed, with JBOD and singe-OSD RAID0 modes showing regressions while 8xRAID0 performance has increased.

### 4KB RADOS BENCH READ RESULTS

[![](images/AVB_16Concurrent4KRead8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4kread8disk/)So this is the first time we”ve done a read test and wow: EXT4 and XFS performance improved in a major way in JBOD and 8xRAID0 modes!  In some cases reads were 3x faster than they were with Argonaut!  BTRFS performance didn”t change much, and singe-OSD RAID0 modes didn”t really change either.  Still, it looks like the work the core team did to improve small IO performance definitely had an effect here.

[![](images/AVB_256Concurrent4KRead8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4kread8disk/)Again, some very interesting results.  BTRFS performance more or less stayed the same.  XFS improved pretty dramatically in JBOD mode, but something strange seems to have happened in the 8xRAID0 test.  Performance regressed, and with 256 concurrent threads the performance is actually below what we just saw with 16 threads.  The real star here is EXT4.  In Argonaut the EXT4 performance is better than XFS, but still pretty far behind BTRFS.  In Bobtail, EXT4 is beating BTRFS in both the JBOD and 8xRAID0 modes.

[![](images/AVB_16Concurrent4KRead6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4kread6disk2ssd/)Before we start, I”d like to point out that SSD journals don”t improve performance for reads.  In fact by using up some of the available bays for SSD drives we are lowing the number of OSDs we can test. So in reality all we are testing here is the performance of reads to 6 OSDs on spinning disks vs the previous tests where there were 8 OSDs.  For that reason the story doesn”t change a whole lot. There are large increases for XFS and EXT4 in JBOD and 8xRAID0 modes.  In this case BTRFS also saw a bit of improvement in JBOD mode.

[![](images/AVB_256Concurrent4KRead6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4kread6disk2ssd/)Again the story is quite similar to the case with 8 spinning disks.  Note that XFS performance again decreased in the 8xRAID0 mode with Bobtail, so the 8-disk result does not appear to be an outlier.  EXT4 performance again showed dramatic increases with Bobtail, but this time not enough to beat BTRFS.  This seems to indicate that in Bobtail at least, EXT4 may scale better than BTRFS as the number of drives per node increases.  Given that BTRFS has in the past had some problems with file system fragmentation and performance degradation, this may make EXT4 an attractive target for applications focusing on small reads.

### BONUS: 4KB RADOS BENCH READ RESULTS FROM PAGE CACHE

The first time I ran through all of these tests, I forget to ensure that my script drop caches between the write and the read tests.  That meant that all of the 4KB reads ended up coming straight from page cache.  Rather than throwing these results away, I figured my loss (of time) should be your gain.  I am including them here to show what Ceph can do when it is reading directly from memory (Note that these tests are using default tuning parameters, so it is possible the results could improve with tuning).

[![](images/AVB_16Concurrent4KReadPC8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4kreadpc8disk/)Since we are reading from page cache, all of the file systems are performing pretty similarly.  In the JBOD and 8xRAID0 cases it looks like Bobtail provides a nice 15-20% improvement in performance over Argonaut.  It also looks like it may improve RAID0 performance slightly as well.  What”s interesting here is that there sems to be a  limitation of around 4000 IOPS per OSD.  Lets see if increasing the number of concurrent OPs helps.

[![](images/AVB_256Concurrent4KReadPC8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4kreadpc8disk/)In the single-OSD RAID0 case, we are again limited to 4000 IOPS.  Throwing more concurrent operations at the problem didn”t improve things at all.  In both of the other cases where we had 8 OSDs, performance improved pretty dramatically.  In those cases Bobtail provided about a 20% improvement.  With 8 OSDs, each OSD seems to be capable of about 3000 IOPS, or about 24,000 IOPS aggregate.  Keep in mind that the clients are running on localhost.  They are however using all of the standard Ceph messenger code and the standard TCPIP stack.

[![](images/AVB_16Concurrent4KReadPC6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4kreadpc6disk2ssd/)With few concurrent OPs, the performance with 6 OSDs looks almost the same as it does with 8 OSDs.  There just aren”t enough concurrent OPs to keep the OSDs busy.  The single-OSD RAID0 results look more or less exactly the same since there are enough concurrent OPs to saturate a single OSD.

[![](images/AVB_256Concurrent4KReadPC6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4kreadpc6disk2ssd/)Bobtail is again showing a nice improvement over Argonaut in these tests.  What”s interesting here is that with 6 OSDs we are seeing very close numbers to what we saw with 8 OSDs.  In this case each OSD is doing about 3.8K IOPS, very close to the 4K IOP limitation we saw earlier.  The aggregate performance in this case is about 22.5K IOPS.  This seems to imply that regardless of the number of OSDs we may be approaching a bottleneck at somewhere around 24-25K IOPS with Ceph on this server.

### 128KB RADOS BENCH WRITE RESULTS

[![](images/AVB_16Concurrent128KWrite8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent128kwrite8disk/)With 128K writes the story looks a lot murkier than it did at 4KB.  XFS performance improves across the board which is great.  BTRFS performance doesn”t change much either way.  EXT4 performance is where we see a problem.  In JBOD mode we see a moderate improvement, and in 8xRAID0 mode we see a moderate degradation.  The big change is in the RAID0 performance.  We”ve already seen that single-OSD RAID0 modes tend to be slow.  In this case EXT4 performance is exceptionally slow.  Bobtail is not even half as fast as Argonaut in that test, and performs far more slowly than in any of the other configurations.

[![](images/AVB_256Concurrent128KWrite8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent128kwrite8disk/)With more concurrent OPs, the story doesn”t change much.  XFS performance has again improved significantly with Bobtail.  Despite the improvements, it still trails both EXT4 and BTRFS in all configurations.  BTRFS performance is showing a nice gain in the 8xRAID0 mode, but otherwise doesn”t change.  Ext4 Performance is again mixed.  In JBOD mode Bobtail is improving the performance, but in 8xRAID0 mode it has regressed.  In single-OSD RAID0 mode Bobtail has regressed significantly.

[![](images/AVB_16Concurrent128KWrite6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent128kwrite6disk2ssd/)Well, lets get the obvious out of the way first.  For whatever reason, JBOD mode with BTRFS is doing ridiculously well compared to any other combination in this test.  Bobtail just takes that and makes it another 30% faster.  Otherwise, performance with 6 OSDs and 2 SSDs for journals is often on par with or lower than it is with 8 spinning disks.  That”s rather disappointing given that moving the journal writes to SSDs should have allowed the spinning disks to do more work.

Ok, having said that, the interesting news here is that Bobtail has increased BTRFS performance pretty significantly in JBOD mode, but not so much for the other RAID modes.  XFS performance has improved, while EXT4 performance has improved in JBOD and 8xRAID0 modes but regressed again in RAID0 mode.

[![](images/AVB_256Concurrent128KWrite6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent128kwrite6disk2ssd/)Alright, with 256 concurrent ops, BTRFS continues to stomp all over the other file systems, and Bobtail just makes the difference that much more apparent.  Bobtail greatly improves EXT4 performance in the JBOD and 8xRAID0 modes.  In RAID0 mode the performance has again regressed.  XFS performance has improved across the board, but it is so slow relative to both EXT4 and BTRFS that there isn”t much to get excited about it.

### 128KB RADOS BENCH READ RESULTS

[![](images/AVB_16Concurrent128KRead8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent128kread8disk/)Performance looks slightly better overall with 128K reads compared to writes.  The story with Bobtail vs Argonaut looks rather muddled though.  single-OSD RAID0 performance has decreased with Bobtail across all file systems.  JBOD performance has improved slightly with BTRFS and XFS, but EXT4 is probably too close to call.   In 8xRAID0  mode, Bobtail improves BTRFS performance, slightly decreases XFS performance, and greatly decreases EXT4 performance.

[![](images/AVB_256Concurrent128KRead8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent128kread8disk/)Ugh.  8xRAID0 performance is slower with Bobtail across the board.  BTRFS and EXT4 performance have both decreased in JBOD mode.  The only test where Bobtail is clearly faster is the BTRFS RAID0 test.  Unfortunately that result isn”t very interesting since it”s so much slower than the other configurations.  Overall these are disappointing results given that we were hoping to see similar improvements to what we saw in the 4KB read tests.

[![](images/AVB_16Concurrent128KRead6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent128kread6disk2ssd/)The results with 6 OSDs and 16 concurrent OPs are not very reassuring.  Sometimes Bobtail eeks out a slight win, but overall the results are on par with or slower when compared to Argonaut.  Single-OSD RAID0 results particularly are showing regression.

[![](images/AVB_256Concurrent128KRead6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent128kread6disk2ssd/)The good news is that with 256 concurrent ops on 6 OSDs, Bobtail is showing less regression compared to the tests with 8 OSDs.  The bad news is that it is the higher performing configurations like BTRFS on JBOD and 8xRAID0 modes that are showing slight regression.  I think the bigger picture here is that both the Bobtail and Argonaut numbers for 128K reads are lower than we”d like.  This is something we”ll definitely be looking more into in the future.

### 4MB RADOS BENCH WRITE RESULTS

[![](images/AVB_16Concurrent4MWrite8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4mwrite8disk/)With 16 concurrent 4MB writes, things are looking pretty close between Bobtail and Argonaut.  BTRFS results are roughly the same between Bobtail and Argonuat.  XFS performance has improved moderately across the board, while EXT4 performance has again regressed in 8xRAID0 and single-OSD RAID0 configurations.

[![](images/AVB_256Concurrent4MWrite8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4mwrite8disk/)With more concurrent operations, the situation brightens considerably.  BTRFS performance has improved in the 8xRAID0 test.  EXT4 performance has improved a bit across the board, and it looks like XFS performance has improved as well.

[![](images/AVB_16Concurrent4MWrite6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4mwrite6disk2ssd/)Like shown in our [previous article](http://ceph.com/community/ceph-performance-part-1-disk-controller-write-throughput/ "Ceph Performance Part 1: Disk Controller Write Throughput"), SSD journals really shine when doing large sequential writes on JBOD controllers.  Everything is looking pretty similar between Bobtail and Argonaut here, except for a moderate increase in XFS performance in the JBOD configuration.

[![](images/AVB_256Concurrent4MWrite6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4mwrite6disk2ssd/)With more concurrent ops, The cache stops being a hindrance and actually helps improve BTRFS performance in the 8xRAID0 mode.  Having said that, Bobtail actually appears to be slightly slower than Argonaut in that test, though the results are close.  In 8xRAID0 mode performance has increased with XFS and EXT4.  Otherwise, Bobtail and Argonaut perform pretty similarly.

### 4MB RADOS BENCH READ RESULTS

[![](images/AVB_16Concurrent4MRead8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4mread8disk/)What a difference 4MB reads make.  While the 128K read results were uninspiring, the 4MB reads look much better in both Bobtail and Argonaut.  Most of the results are pretty comparable except for a couple of slight regressions in the single-OSD RAID0 tests.  Overall the performance numbers look pretty good.

[![](images/AVB_256Concurrent4MRead8Disk.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4mread8disk/)With more concurrent ops, the numbers look even better (Well, in 8xRAID0 and JBOD modes at least).  It does look like BTRFS performance has regressed slightly with Bobtail.  EXT4 performance has increased to varying degrees in all configurations.  It looks like XFS performance hasn”t changed much between the versions.

[![](images/AVB_16Concurrent4MRead6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_16concurrent4mread6disk2ssd/)Not too much to say here.  The results look similar to the 16 concurrent request tests on 8 OSDs, just slower since we now have 6 OSDs for reads instead of 8.

[![](images/AVB_256Concurrent4MRead6Disk2SSD.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_256concurrent4mread6disk2ssd/)Alright, in our last set of tests we again see a little bit of BTRFS performance regression at the high end and a little bit of improvement at the low end.  Other than that, all of the results are pretty comparable between Bobtail and Argonaut.

### CONCLUSION

OMG, is it finally over?  I”m free! FREEEEE!!!  Ahem, ok, not quite yet.  So after staring at all of those charts for hours on end, have we learned anything?  Lets do a quick recap and look at exactly how performance has changed across all of these tests.  Again, we only had time to run a single instance of each test, so we may be seeing some noise in these results.  In the future it would be nice to run several iterations of each test to examine this.  Having said that, lets take a look at what we”ve got:

[![](images/AVB_4KB_Percentages.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avb_4kb_percentages/)

In this form, it is easy to see just how much 4K read and write performance has improved, with the very notable exception of EXT4 writes.  We”ll need to go back and study why this is the case, but our current thought is that disabling explicit flushing for small writes may not be beneficial on EXT4.  If you run XFS or BTRFS though, upgrading to Bobtail should provide a substantial small IO performance boost.  With EXT4, your write throughput may suffer, though it looks like read throughput should increase rather significantly.

[![](images/AVG_128K_Percentages.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avg_128k_percentages/)

For 128K IOs, Bobtail improves write throughput substantially for XFS, but again we see a couple of cases where EXT4 performance regresses.  BTRFS write performance has increased in a couple of cases with no major regressions.  On the read side, the story isn”t great. There are a number of cases where performance has regressed.  It is not all bad as there are a couple of wins too, but we were hoping to see more gains given the performance improvements that have been made.  We”ll have to go back and figure out what is holding us back.

[![](images/AVG_4M_Percentages.png)](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/attachment/avg_4m_percentages/)

Finally with 4MB transfers, the differences in performance are more subtle.  Most of the changes that were made for Bobtail have a greater affect on small IO performance vs large IO performance, so this isn”t entirely unexpected.  Having said that, we do see a notable improvement in XFS write performance.  Otherwise there are some wins and losses (especially some big swings in EXT4 performance), but otherwise Bobtail and Argonaut perform fairly similarly.

So there you have it.  Another fine day in Ceph performance testing.  Next time we”ll look at smalliobench and later at parametric sweeps of various Ceph configurables to see how they affect performance under different circumstances.  Until next time Ceph enthusiasts!

