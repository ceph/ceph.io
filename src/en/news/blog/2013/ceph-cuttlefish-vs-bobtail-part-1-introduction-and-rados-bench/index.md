---
title: "Ceph Cuttlefish VS Bobtail Part 1: Introduction and RADOS Bench"
date: "2013-07-09"
author: "MarkNelson"
tags: 
  - "cuttlefish"
  - "planet"
---

Contents

1. [Introduction](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/)
2. [System Setup](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#setup)
3. [Test Setup](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#test_setup)
4. [4KB Results](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#4kbrados)
5. [128KB Results](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#128kbrados)
6. [4MB Results](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#4mbrados)
7. [Conclusion](http://ceph.com/community/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/#conclusion)

### INTRODUCTION

Hello readers! You probably thought you had finally gotten rid of me after the strict radio silence I’ve been keeping since the last performance tuning article. No such luck I’m afraid! In reality we here at Inktank have been busy busy busy. Unfortunately this data is way over-due and is coming out about a month later than I wanted. Silly things like meeting contractual obligations and sleeping kept getting in the way! But now dear reader, I’ve finally snuck away to bombard you with preposterous amounts of new data (oh, and will I ever!). So what exactly shall we be looking at? Cuttlefish VS Bobtail performance of course! (Yes, I know it’s close to Dumpling now.) Unlike our previous articles, We are going to do a little more than just run RADOS Bench on a local system this time. We’ve got a whole slew of RADOS Bench, Kernel RBD, and QEMU/KVM tests that we’ll be exploring over the course of a couple different articles. Not only that, but we’ve got a separate client node and are doing all of this over bonded 10GbE links. This time we are kicking things into overdrive! ALLONS-Y!

![](images/drawing.png)

### SYSTEM SETUP

Unlike in some of the previous articles, we are only testing the disks in a JBOD configuration this time. In fact we have our Supermicro 36 drive chassis filled with 4 LSI SAS9207-8i controllers, 24 spinning disks, and 8 SSDs for the journals. Based on what we saw in our [previous tests](http://ceph.com/uncategorized/argonaut-vs-bobtail-performance-preview/ "Argonaut VS Bobtail Performance Preview"), this should be a pretty high performance configuration. A round-robin bonded 10GbE link was setup between the client and the server node. In basic iperf tests, this link was shown to be capable of transferring around 2GB/s of data in both directions when given enough concurrency.

Hardware setup for the OSD node:

- Chassis: Supermicro 4U 36-drive SC847A
- Motherboard: Supermicro X9DRH-7F
- Disk Controller: 4 X LSI SAS9207-8i
- CPUS: 2 X Intel XEON E5-2630L (2.0GHz, 6-core)
- RAM: 8 X 4GB Supermicro ECC Registered DDR1333 (32GB total)
- Disks: 24 X 7200RPM Seagate Constellation ES 1TB Enterprise SATA
- SSDs: 8 X Intel 520 180GB
- NIC: Intel X520-DA2 10GBE

Hardware setup for the client node:

- Chassis: Supermicro 1U 4-drive SC815
- Motherboard: Supermicro X9SCM
- Disk Controller: Intel Integrated C204
- CPUS: 1 X Intel XEON E3-1220 V2 (3.1GHz, 4-core)
- RAM: 4 X 2GB Hynix ECC DDR1333 (8GB total)
- Disks: 1 X 7200RPM Seagate Constellation ES 1TB Enterprise SATA
- NIC: Intel X520-DA2 10GBE

As far as software goes, these tests will use:

- OS: Ubuntu 12.04
- Kernel: 3.8.0-19 from the Ubuntu repository
- Tools: collectl 3.6.0-1
- Ceph: 0.56.4, 0.61.2
- qemu-kvm: 1.0+noroms-0ubuntu14.8

### TEST SETUP

In the following set of tests, we’ll be looking at Cuttlefish and Bobtail performance in a couple of different scenarios:

- Remote Server RADOS bench
- Remote Server fio tests using multiple Kernel RBD Volumes
- Remote Guest fio tests using multiple QEMU/KVM Volumes
- Remote Guest fio tests using multiple QEMU/KVM Guests

CFQ was used as the IO Scheduler on all devices and the default nr\_requests and read\_ahead\_kb settings were used. Ceph authentication was disabled and filestore xattr use omap was enabled. Before every test, sync was called and caches were dropped on all nodes. Ceph was configured to use 1x (ie no) replication in these tests to stress RBD client throughput as much as possible.

For the RBD tests, 100GB volumes were created and formatted with the XFS filesystem on a pool with 4096 PGs. fio was configured to pre-allocate 1 64GB file per process to ensure proper behavior during reads. Direct IO was used to limit the influence of client side page cache, while the libaio engine was used so that multiple IO depths could be tested.

Detailed settings for each of the above tests follows:

- RADOS Bench: 4 concurrent instances of RADOS bench were run on the client with 32 concurrent IOs each. A separate 2048 PG pool was created for each instance of RADOS bench to ensure that duplicate reads did not come from page cache.
- Kernel RBD: fio was run in a variety of ways on 1 to 8 kernel RBD volumes. No special parameters were used.
- Multi-Volume QEMU/KVM: fio was run in a variety of ways on 1 to 8 virtio volumes on a single QEMU/KVM guest running on the client node. The guest was configured with 4 cores and 6GB of RAM. RBD cache was enabled.
- Multi-Guest QEMU/KVM: fio was run in a variety of ways on 1 to 8 QEMU/KVM guests running on the client node. Each Guest was configured with 1 core and 768MB of RAM. RBD cache was enabled.

For all tests, the following IO sizes were used:

- 4KB
- 128KB
- 4M

RADOS Bench tests write out objects and read them back in the same order they were written. fio was tested with the above IO sizes using various patterns:

- Random Writes
- Random Reads
- Sequential Writes
- Sequential Reads

For each permutation, BTRFS, XFS, and EXT4 were each used as the underlying OSD file system. Unfortunately there was not enough time to reformat the cluster between each test as literally thousands of independent tests were run to produce the results. It is possible that this may have had an effect on the performance of certain tests, especially small IO tests where there may be greater metadata fragmentation over time. Depending on your perspective this may or may not be a more valid test. Never the less, this should be kept in mind when comparing these results with results from previous articles where the cluster was rebuilt between every test.

Each file system had mkfs and mount options passed:

- mkfs.btfs options: -l 16k -n 16k
- btrfs mount options: -o noatime
- mkfs.xfs options: -f -i size=2048
- xfs mount options: -o inode64,noatime
- mkfs.ext4 options:
- ext4 mount options: -o noatime,user\_xattr

During the tests, collectl was used to record various system performance metrics.

### 4KB RADOS BENCH RESULTS

[![](images/CVB_RADSOBench_4K_Write.png)](http://ceph.com/?attachment_id=3561)

Ah, RADOS bench. So nice, so simple. Or so you would think! The reality of why these write results are the way they are is frightfully complicated. It involves how journals are written to the SSDs, how objects are written and stored on disk, the various layers of filesystem metadata, write reordering, and how small bits of data get coalesced. This definitely isn’t like doing sequential writes to a disk, but the behavior isn’t totally random either. Ultimately it’s probably best to just take the results for what they are: How fast you can write out lots of concurrent 4K objects via RADOS. Do notice that EXT4 and XFS are doing much better with cuttlefish. XFS specifically is over twice as fast! This is largely due to the work that went into moving pg info and pg log data into leveldb.

[![](images/CVB_RADSOBench_4K_Read.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/attachment/cvb_radsobench_4k_read/)

The first thing to notice is that read performance is across the board better than write performance. I suspect this is largely due to RADOS bench reading back objects in the same order they were written, and getting some benefit from server-side read ahead. Interestingly read performance has actually increased slightly for EXT4 and XFS. Our best guess is that the pg info and pg log improvements that we made in Cuttlefish are allowing EXT4 and XFS to be a bit smarter about how they are laying data out on the disk and this is carrying over into the read tests.

### 128KB RADOS BENCH WRITE RESULTS

[![](images/CVB_RADSOBench_128K_Write.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/attachment/cvb_radsobench_128k_write/)

With 128K objects we are again seeing some nice improvements with Cuttlefish, though in this case XFS seems to be trailing pretty fair behind both BTRFS and EXT4, even after pg info and pg log changes. For some reason this seems to be a trouble spot for XFS in RADOS bench. It will be interesting to see if this behavior is present when we test rbd with fio.

[![](images/CVB_RADSOBench_128K_Read.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/attachment/cvb_radsobench_128k_read/)

Reads see little if any improvement, though that is not entirely unexpected as there were few changes in cuttlefish that affect how OSDs handle reads. In this case, BTRFS seems to be pretty seriously outclassing both EXT4 and XFS.

### 4MB RADOS BENCH RESULTS

[![](images/CVB_RADSOBench_4096K_Write.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/attachment/cvb_radsobench_4096k_write/)

Here’s where the fun really starts! With RADOS bench we are able to saturate the bonded 10GbE link with only 24 spinning disks and 8 SSD journals. There’s a pretty good chance that we don’t even need that many SSDs to pull this off. The one exception is that with bobtail, XFS wasn’t fast enough to saturate the link, but with the changes in cuttlefish all 3 are able to do it. At this point we’ll need either 40GbE or Infiniband with either native RDMA or rsocket to really tell how far we can push things.

[![](images/CVB_RADSOBench_4096K_Read.png)](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/attachment/cvb_radsobench_4096k_read/)

Well, 4MB reads aren’t quite as impressive as the 4MB writes as we aren’t totally saturating the bonded 10GbE link, but 1.8GB/s isn’t bad! XFS performance again has improved with cuttlefish. Again, we suspect this is due to better reordering of data on the disk due to some of the changes we’ve made.

### CONCLUSION

Wait, what? What?! That’s it?! This was probably the lightest article I’ve written yet! Well, don’t worry, we’ll have more coming soon! For now, consider that doing object writes with librados you can pretty easily saturate a bonded 10GbE link both on the client and on the server given a capable hardware setup! With a little tweaking (say an NVRAM card for journals and the whole chassis filled out with spinning disks) we potentially could be getting close to 40GbE or Infiniband limits. That’s pretty incredible!

Also note that it looks like Cuttlefish is providing some big performance gains with XFS and EXT4. I bet you guys are getting a bit sick of looking at RADOS bench numbers by now though. Tomorrow we will release part 2 of this investigation, where we’ll start looking at how RBD stacks up and if we can hit similar levels of performance with fio. See you then!

Update: [Part 2](http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-2-4k-rbd-performance/ "Ceph Cuttlefish VS Bobtail Part 2: 4K RBD Performance") has been released!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/performance-2/ceph-cuttlefish-vs-bobtail-part-1-introduction-and-rados-bench/&bvt=rss&p=wordpress)
