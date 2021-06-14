---
title: "Ceph Bobtail JBOD Performance Tuning"
date: "2013-02-04"
author: "MarkNelson"
tags: 
---

Contents

1. [Introduction](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/)
2. [System Setup](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/#setup)
3. [Test Setup](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/#test_setup)
4. [4KB Results](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/#4kbradoswrite)
5. [128KB Results](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/#128kbradoswrite)
6. [4MB Results](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/#4mbradoswrite)
7. [Results Summary](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/#summary)
8. [Conclusion](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/#conclusion)

### INTRODUCTION

One of the things that makes Ceph particularly powerful is the number of tunable options it provides. You can control how much data and how many operations are buffered at nearly every stage of the pipeline. You can introduce different flushing behavior, or change how many threads are used for filestore operations. The downside is that it can be a bit daunting to dive into all of this and even to know where to start. Here at Inktank we’ve gotten a lot of questions about how these options affect performance. The answer is often that it depends. Different hardware and software configurations will favor different Ceph options. To give people an at least a rough idea of what kinds of things might be worth looking at, we decided to dive in and sweep through some of the options that most likely would have an effect on performance. Specifically in this article we’ll look at different Ceph parameters when using disks in a JBOD configuration.

   
Since Inktank is willing to pay me to draw web comics (Hi Guys!), Here’s a picture of approximately what I looked like after getting through all of this:

   
![](images/drawing-parametric.png)

Before we move on, if you are not yet familiar with configuring Ceph, there’s a great introduction in the Ceph documentation available [here](http://ceph.com/docs/master/rados/configuration/ceph-conf/). Once you’ve got that under your belt, you’ll want to review the list of tunable parameters and their descriptions [here](http://ceph.com/docs/master/rados/configuration/filestore-config-ref).

### SYSTEM SETUP

We are going to use the SAS2208 controller for these tests. It supports JBOD, multiple single-drive RAID0 LUNs, and single-LUN RAID0 configurations. Unfortunately different controllers will behave differently, so these results may not be representative for other controllers. Hopefully they will at least provide an initial starting point and perhaps a guess as to how similar configurations may perform.

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

A small python tool was written that reads in a YAML configuration file and automatically generates a number of ceph.conf files with different parameters set. These are then used with our benchmarking tools to run through a number of tests for each configuration. Some configuration parameters have been grouped together to reduce the total number of permutations that need to be tested. The following YAML snippet shows the default settings used along with the ones that are iterated through:

default:
  global:
    log\_to\_syslog: "false"
    log\_file: "/var/log/ceph/$name.log"
    auth\_cluster\_required: "none"
    auth\_service\_required: "none"
    auth\_client\_required: "none"
    filestore\_xattr\_use\_omap: "true"

  mon:
    mon\_osd\_data: "/srv/mon.$id"
  mon.a:
    host: "burnupiX"
    mon\_addr: "127.0.0.1:6789"

parametric:
  debugging\_off:
    debug\_lockdep: "0/0"
    debug\_context: "0/0"
    debug\_crush: "0/0"
    debug\_mds: "0/0"
    debug\_mds\_balancer: "0/0"
    debug\_mds\_locker: "0/0"
    debug\_mds\_log: "0/0"
    debug\_mds\_log\_expire: "0/0"
    debug\_mds\_migrator: "0/0"
    debug\_buffer: "0/0"
    debug\_timer: "0/0"
    debug\_filer: "0/0"
    debug\_objecter: "0/0"
    debug\_rados: "0/0"
    debug\_rbd: "0/0"
    debug\_journaler: "0/0"
    debug\_objectcacher: "0/0"
    debug\_client: "0/0"
    debug\_osd: "0/0"
    debug\_optracker: "0/0"
    debug\_objclass: "0/0"
    debug\_filestore: "0/0"
    debug\_journal: "0/0"
    debug\_ms: "0/0"
    debug\_mon: "0/0"
    debug\_monc: "0/0"
    debug\_paxos: "0/0"
    debug\_tp: "0/0"
    debug\_auth: "0/0"
    debug\_finisher: "0/0"
    debug\_heartbeatmap: "0/0"
    debug\_perfcounter: "0/0"
    debug\_rgw: "0/0"
    debug\_hadoop: "0/0"
    debug\_asok: "0/0"
    debug\_throttle: "0/0"

  osd\_op\_threads: \[1, 4, 8\]
  osd\_disk\_threads: \[2, 4, 8\]
  filestore\_op\_threads: \[1, 4, 8\]

  flush\_true:
    filestore\_flush\_min: 0
    filestore\_flusher: "true"

  flush\_false:
    filestore\_flush\_min: 0
    filestore\_flusher: "false"

  journal\_aio: \["true"\]
  ms\_nocrc: \["true"\]

  big\_bytes:
    filestore\_queue\_max\_bytes: 1048576000
    filestore\_queue\_committing\_max\_bytes: 1048576000
    journal\_max\_write\_bytes: 1048576000
    journal\_queue\_max\_bytes: 1048576000
    ms\_dispatch\_throttle\_bytes: 1048576000
    objecter\_infilght\_op\_bytes: 1048576000

  big\_ops:
    filestore\_queue\_max\_ops: 5000
    filestore\_queue\_committing\_max\_ops: 5000
    journal\_max\_write\_entries: 1000
    journal\_queue\_max\_ops: 5000
    objecter\_inflight\_ops: 8192

  small\_bytes:
    filestore\_queue\_max\_bytes: 10485760
    filestore\_queue\_committing\_max\_bytes: 10485760
    journal\_max\_write\_bytes: 10485760
    journal\_queue\_max\_bytes: 10485760
    ms\_dispatch\_throttle\_bytes: 10485760
    objecter\_infilght\_op\_bytes: 10485760

  small\_ops:
    filestore\_queue\_max\_ops: 50
    filestore\_queue\_committing\_max\_ops: 50
    journal\_max\_write\_entries: 10
    journal\_queue\_max\_ops: 50
    objecter\_inflight\_ops: 128

Similar to previous articles, we are running tests directly on the SC847a using localhost TCP socket connections. We are performing both read and write tests. A 10G journal partition was set up at the beginning of each device. Only the SAS2208′s JBOD mode was tested for this article, which does not use on-board cache. Other modes may be tested in later articles. CFQ was used as the IO Scheduler for all tests.

To generate results, we are using Ceph’s trusty built-in benchmarking command: “RADOS bench” which writes new objects for every chunk of data that is to be written out (Some day I’ll get to the promised smalliobench article!). RADOS bench has certain benefits and drawbacks. On one hand it gives you a very clear picture of how fast OSDs can write out and read objects at various sizes. What it does not test is how quickly small IO to large objects are performed. For that reason and others, these results are not necessarily reflective of how RBD will ultimately perform.

Like in our previous articles, we are running 8 concurrent instances of RADOS bench and aggregating the results to ensure that it is not a bottleneck. We are instructing each instance of RADOS bench to write to its own pool with 2048 PGs each. This is done to ensure that later on during read tests each instance of RADOS bench reads unique objects that were not previously read into page cache by one of the other instances. You may also notice that we are using a power-of-2 number of PGs per pool. Due to the way that Ceph implements PG splitting behavior, having a power-of-2 number of PGs (especially at low PG counts!) may improve how evenly data is distributed across OSDs. At larger PG counts this may not be as important.

RADOS bench gives you some flexibility regarding how big objects should be, how many to concurrently keep in flight, and how long tests should be run for. We’ve settled on 5 minute tests using the following permutations:

- 4KB Objects, 16 Concurrent Operations (2 per rados bench instance)
- 4KB Objects, 256 Concurrent Operations (32 per rados bench instance)
- 128KB Objects, 16 Concurrent Operations (2 per rados bench instance)
- 128KB Objects, 256 Concurrent Operations (32 per rados bench instance)
- 4M Objects, 16 Concurrent Operations (2 per rados bench instance)
- 4M Objects, 256 Concurrent Operations (32 per rados bench instance)

For each permutation, we run the same test using either BTRFS, XFS, or EXT4 for the underlying OSD file system. File systems are reformatted and mkcephfs is re-run between every test to ensure that fragmentation from previous tests does not affect the outcome. Keep in mind that this may be misleading if trying to use these results to determine how a production cluster would perform. Each file system appears to age differently and may perform quite differently over time.  Despite this, reformatting between each test is necessary to ensure that the comparisons are fair. Each file system had mkfs and mount options passed:

- mkfs.btfs options: -l 16k -n 16k
- btrfs mount options: -o noatime
- mkfs.xfs options: -f -i size=2048
- xfs mount options: -o inode64,noatime
- mkfs.ext4 options:
- ext4 mount options: -o noatime,user\_xattr

During the tests, collectl was used to record various system performance statistics.

### 4KB RADOS BENCH WRITE RESULTS

[![](images/parametric_jbod-write-0004K-016.png "parametric_jbod-write-0004K-016")](http://ceph.com/?attachment_id=2683)

Ok, hopefully this chart is mostly self-explanatory, but if it is not, basically the idea here is that we’ve got 3 samples for each file system, lots of different parameters, and we draw a colored circle around the results depending on if the performance is higher or lower than the default configuration. Probably the biggest thing to note here is how much of a hit BTRFS and XFS take when the filestore flusher is explicitly enabled. Beyond that, it looks like enabling journal aio is generally a win.

   
[![](images/parametric_jbod-write-0004K-256.png "parametric_jbod-write-0004K-256")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-write-0004k-256/)

Just like in the 16 concurrent OPs results, BTRFS and XFS take a hit when the filestore flusher is enabled. Enabling Journal AIO however appears to be a win again. With 256 OPs, we also can now see that increasing the number of concurrent operations in the queues may increase performance. Decreasing the number of concurrent operations appears likewise to decrease performance.

### 4KB RADOS BENCH READ RESULTS

[![](images/parametric_jbod-read-0004K-016.png "parametric_jbod-read-0004K-016")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-read-0004k-016/)

Things still aren’t looking good for the flusher. It dramatically hurts XFS and EXT4 read performance. Disabling debugging is generally helping performance and it looks like increasing the number of OSD OP threads is having a pretty positive effect on performance as well.

   
[![](images/parametric_jbod-read-0004K-256.png "parametric_jbod-read-0004K-256")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-read-0004k-256/)

I think at this point we’ve pretty much determined that the flusher isn’t doing a lot to help with small IOs. Disabling debugging seems to help again which probably makes sense for a heavy small IO workload with tons of messages being spewed out to the logs. Interestingly increasing the number of OPs allowed in the queues seems to hurt EXT4 performance. Otherwise, we see the same trend where increasing the number of OSD OP threads seems to increase performance. Also notice how many different parameters seem to increase XFS performance in these results. I have a feeling that the samples for the “default” XFS performance are on average lower than they should be and it’s making a lot of the parameters look better than they should.

### 128KB RADOS BENCH WRITE RESULTS

[![](images/parametric_jbod-write-0128K-016.png "parametric_jbod-write-0128K-016")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-write-0128k-016/)

By default the filestore flusher is only enabled for operations larger than 64k. By explicitly disabling it, we see a nice performance boost for BTRFS, but the opposite effect for XFS. Enabling journal AIO is again providing a performance boost.

   
[![](images/parametric_jbod-write-0128K-256.png "parametric_jbod-write-0128K-256")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-write-0128k-256/)

So this is interesting. As we said earlier, by default the filestore flusher is only enabled for operations larger than 64k. In this case disabling it gives a performance boost for EXT4. What is more interesting is that explicitly enabling it for all IO sizes really hurts performance despite the fact that we are doing 128k operations. Journal AIO is again improving performance, and there are a smattering of other options that are increasing or decreasing performance here and there.

### 128KB RADOS BENCH READ RESULTS

[![](images/parametric_jbod-read-0128K-016.png "parametric_jbod-read-0128K-016")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-read-0128k-016/)

There are again a smattering of different options that may provide some performance improvement (seemingly with BTRFS), but the most obvious affect on read performance again seems to be the number of OSD OP threads just like in the 4K read tests.

[![](images/parametric_jbod-read-0128K-256.png "parametric_jbod-read-0128K-256")](http://ceph.com/?attachment_id=2693)

I have a feeling that we are again seeing a case where the samples for the “default” performance are a bit off. In this case, perhaps a bit on the high side (ie a lot of other things look low). Having said that, the number of OSD OP threads again seems to be having a pretty pronounced effect.

### 4MB RADOS BENCH WRITE RESULTS

[![](images/parametric_jbod-write-4096K-016.png "parametric_jbod-write-4096K-016")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-write-4096k-016/)

Looks like disabling the flusher and enabling journal AIO are again the two big changes that improve write performance.

   
[![](images/parametric_jbod-write-4096K-256.png "parametric_jbod-write-4096K-256")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-write-4096k-256/)

For out last set of write results… Strangeness! Disabling the flusher doesn’t help very much, but neither does enabling it. Enabling Journal AIO went from being a performance win to hurting performance with BTRFS. Restricting the number of bytes allowed in the various buffers and queues hurts performance. At least with BTRFS, increasing it hurts performance too! Wouldn’t it be nice if we had 100 samples per test?

### 4MB RADOS BENCH READ RESULTS

[![](images/parametric_jbod-read-4096K-016.png "parametric_jbod-read-4096K-016")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-read-4096k-016/)

Aha! More unexpected results. It looks like OSD OP Threads is still having an effect, but with XFS and EXT4 performance is decreasing as the number of threads increases. It looks like disabling CRC32C in the messenger is also providing a small boost in performance.

   
[![](images/parametric_jbod-read-4096K-256.png "parametric_jbod-read-4096K-256")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/parametric_jbod-read-4096k-256/)

And finally with more concurrent read OPs, we again see that increasing the OSD OP Thread count is hurting EXT4 and XFS performance. With BTRFS, it looks like performance peaks with 4 OSD OP Threads.

### RESULTS SUMMARY

The scatter plots shown above give us a decent idea of how different parameters affect performance relative to each other at different IO sizes, but don’t really provide much insight into how each parameter is going to affect performance over all. Let’s take a look at each parameter individually. In the following charts, the average value and standard deviation of the samples for each parameter test is computed and compared against the average value and standard deviation of the “default” configuration. The percentage difference between the averages is displayed. If the 1-standard deviation ranges of the results overlap, no color-coding is done. If 1-standard deviation ranges do not overlap and the parameter average is higher, the result is color-coded in green. If the ranges do not overlap and the parameter average is lower, it is color-coded red.

[![](images/big_bytes.png "big_bytes")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/big_bytes/)

It looks like small-medium write performance may improve with EXT4 by increasing the number of bytes allowed in the various queues and buffers defined in our “big bytes” test. Having said that, it only appears to have an effect when there are a lot of concurrent IOs in flight, and only seems to consistently benefit EXT4.

   
[![](images/big_ops.png "big_ops")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/big_ops/)

There definitely seems to be a benefit when increasing the number of small operations allowed in the queues when there are a lot of small IOs in flight. There’s a fairly notable exception with EXT4 reads. It may be that by testing each parameter in this group individually we could isolate whatever is causing this and maintain the benefits.

   
[![](images/debugging_off.png "debugging_off")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/debugging_off/)

Disabling debugging seems to benefit with small IO performance, especially for reads. It may be that this is tied to the number of OSD op threads, so it may be worth trying this in combination with more or less threads and seeing what happens.

   
[![](images/filestore_op_threads_1.png "filestore_op_threads_1")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/filestore_op_threads_1/)

This is kind of interesting. Decreasing the number of filestore op threads (ie the ones that actually write data out) from 2 (the default) to 1 seems to increase performance with small to medium sized operations. This may be due to the fact that we are using a JBOD configuration with a single disk behind each OSD.

   
[![](images/filestore_op_threads_4.png "filestore_op_threads_4")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/filestore_op_threads_4/)

Increasing the number of filestore op threads from 2 to 4 possibly provides a couple of slight improvements, but overall performance seems to be roughly the same.

   
[![](images/filestore_op_threads_8.png "filestore_op_threads_8")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/filestore_op_threads_8/)

Increasing the number of filestore op threads from 2 to 8 however seems to cause some performance regressions.

   
[![](images/filestore_xattr_use_omap_false.png "filestore_xattr_use_omap_false")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/filestore_xattr_use_omap_false/)

It looks like keeping XATTRS in the filesystem doesn’t really provide much benefit versus putting them in leveldb. With XFS it looks like leveldb might actually be slightly faster overall, but these results are probably not precise enough to tell for sure.

   
[![](images/flush_false.png "flush_false")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/flush_false/)

In Bobtail the filestore flusher is enable by default, but only for operations that are 64kb or larger. It is curious that when we explicitly disable it we see such a large effect on 256 concurrent 4K EXT4 writes. It makes me wonder if the EXT4 results are skewed. At larger IO sizes, the results are decidedly mixed. It looks to me like it may make sense with BTRFS at least to leave the flusher off entirely.

   
[![](images/flush_true.png "flush_true")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/flush_true/)

Explicitly enabling the flusher however seems to almost universality be bad for small ops, with the exception of 4K writes on EXT4. If you recall from our [Argonaut vs Bobtail Performance Preview](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/#conclusion) article, we noticed that small EXT4 read performance had improved while EXT4 write performance degraded. Argonaut defaulted to having the filestore flusher enabled for all writes while Bobtail changed that behavior to only flush writes that are 64k or larger. It appears that if you are using EXT4, you currently have to choose between having faster small reads or faster small writes.

   
[![](images/journal_aio.png "journal_aio")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/journal_aio/)

Journal AIO looks to be a win nearly across the board for writes, with the possible exception of lots of concurrent large IOs. This is probably something we will consider enabling by default in future Ceph releases.

   
[![](images/ms_nocrc_true.png "ms_nocrc_true")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/ms_nocrc_true/)

With 8 OSDs on the host and 12 2.0GHz Xeon E5 cores, disabling CRC32c calculations in the messenger doesn’t do much. We are not likely very CPU bound. In the two cases where it seems to make a difference, I’m going to go out on a limb and say we don’t have enough samples.

   
[![](images/osd_disk_threads_2.png "osd_disk_threads_2")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/osd_disk_threads_2/)

The results here seem to be pretty inconclusive. I think we again need more samples.

   
[![](images/osd_disk_threads_4.png "osd_disk_threads_4")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/osd_disk_threads_4/)

Again, the results seem to be pretty inconclusive, though perhaps hopeful. Increasing the number of OSD disk threads to 4 may have some positive effects.

   
[![](images/osd_disk_threads_8.png "osd_disk_threads_8")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/osd_disk_threads_8/)

At 8 OSD disk threads, it looks like there may be some negative effects in addition to the positive ones. We probably need more samples to tell.

   
[![](images/osd_op_threads_1.png "osd_op_threads_1")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/osd_op_threads_1/)

Decreasing the number of OSD op threads from 2 (the default) to 1 is almost universally bad for performance except in a couple of specific scenarios. Primarily it looks like it may provide a modest performance increase if you are using EXT4 and doing a lot of large reads.

   
[![](images/osd_op_threads_4.png "osd_op_threads_4")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/osd_op_threads_4/)

We covered this earlier, but to recap, the opposite seems to be true for increasing OSD op threads from 2 to 4. Performance (especially read) improves significantly with more OSD op threads except for large reads with EXT4 and XFS where performance suffers.

   
[![](images/osd_op_threads_8.png "osd_op_threads_8")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/osd_op_threads_8/)

Further increasing the number of OSD op threads increases the gains but also increases the losses.

   
[![](images/small_bytes.png "small_bytes")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/small_bytes/)

Given that we are generally suspicious regarding the 256 concurrent 4K XFS read results, I’m willing to say that reducing the number of bytes allowed in the queues isn’t good for performance, especially with large IOs. What I think is surprising here is that decreasing these values doesn’t cause a greater reduction in performance.

   
[![](images/small_ops.png "small_ops")](http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/attachment/small_ops/)

Finally, decreasing the allowed number of queued ops definitely causes a decrease in performance with small operations. Again we are seeing what looks like an anomaly with 256 concurrent XFS reads. With large IOs we appear to be bottle-necked somewhere else.

### CONCLUSION

While I think we’ve gotten some interesting results out of this exercise, I want to reiterate that we’ve only got 3 samples per test. That is almost certainly too few to really be able to discern subtle effects and there may be both false positives and false negatives. Beyond that, it is likely that different hardware and software configurations will show different behaviors. Take all of these results with an appropriate sized grain of salt.

Having said that, we’ve learned some things about Ceph on this setup. Namely that the flusher may not be worth using at all (but there do seem to be exceptions!), journal AIO is usually a win, and that the number of OSD op threads has a significant effect on read performance. There are many other places where we may isolate performance gains after more investigation as well. Unfortunately there are a couple of things missing too. It would have been interesting to test changes to the filestore sync intervals, and change the subdir merging and splitting behavior. Unfortunately in the process of getting all of these tests set up and running I forget to include those. Oh well, We’ll get them the next time around.

I hope this article has been useful, and that it will provide a starting point for people to tune their own Ceph deployments. If you perform your own performance tests and discover anything interesting, please do share your results on our mailing list! Until next time Ceph enthusiasts!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/ceph-bobtail-jbod-performance-tuning/&bvt=rss&p=wordpress)
