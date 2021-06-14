---
title: "Ceph and Enhanceio"
date: "2014-10-05"
author: "shan"
tags: 
---

![](images/ceph-enhanceio.jpg "Ceph and Enhanceio")

Almost two years ago, I was writing the results of the experiments with [Flashcache](http://www.sebastien-han.fr/blog/2012/11/15/make-your-rbd-fly-with-flashcache/). Today this blog post is a featured post, this howto was written by Andrei Mikhailovsky. Thanks for his contribution to this blog :-).

Here is a howto on installing and using [EnhanceIO](https://github.com/stec-inc/EnhanceIO), a yet another block level caching solution for your OSD servers. From the description page it is:

> EnhanceIO is a dynamic block level cache to improve performance of rotating hard disk drives by using SSDs as cache devices. EnhanceIO derived from Flashcache project but it does not use device mapper and can create and delete caches while a source volume is being used (i.e. mounted). EnhanceIO supports three caching modes: read-only, write-through, and write-back and three cache replacement policies: random, FIFO, and LRU.

This makes it an ideal solution to your ceph OSD spinning disks. It comes in form of a kernel module and a user-end cli tool to create, manage and delete cache devices. It is very simple to implement and can work on top of your existing block device with filesystem and data. There is no need to mess about with preparing the backend device and migrate data to it. One cli command and you are ready to go.

In this howto I am using Ubuntu 12.04 LTS with the latest updates and the kernel from Trusty release. So, let's get started.

To get EnhanceIO kernel modules simply add the following Ubuntu repository:

`bash $ sudo apt-add-repository ppa:enhanceio/daily $ sudo apt-get update $ sudo apt-get install -y enhanceio-dkms`

If you have any issues, you might need to install some dependencies like this:

`bash $ sudo apt-get install build-essential dkms linux-headers-generic-lts-trusty`

Once the modules are compiled and installed for your kernel load them with:

`bash $ sudo modprobe enhanceio_lru`

Or if you are planning to use FIFO cache policy use:

`bash $ sudo modprobe enhanceio_fifo`

Next, you need to get the master branch from github and copy the user-end CLI tool and its man page:

`bash $ sudo mkdir /usr/src/enhanceio && cd /usr/src/enhanceio $ sudo wget https://github.com/stec-inc/EnhanceIO/archive/master.zip $ sudo unzip master.zip && cd EnhanceIO-master/CLI $ sudo cp eio_cli /sbin/ && chmod 700 /sbin/eio_cli $ sudo cp eio_cli.8 /usr/share/man/man8/`

For more information on how to use the `eio_cli` tool please refer to `man eio_cli`.

  

The next steps will depend on your requirements and your budget. If your infrastructure permits, you might use one SSD cache disk per single OSD HDD disk, however, not everyone can do this. For my test setup I am using a single SSD disk for 3 OSD HDD disks. Thus, I will need to partition the SSD disk and create three partitions, one per OSD device. I am also leaving some free space (about 10% of the SSD full capacity) to increase the life of the SSD disk. In my tests I've also found that having some free unpartitioned space on the SSD disk keeps the write performance intact over time, as the performance on some SSDs drastically decreases without that extra free space.

Thus, let's assume that my Crucial cache SSD device is `/dev/sdb` and my ceph OSD HDDs are `/dev/sdd`, `/dev/sde`, `/dev/sdf`.

Partition your SSD disk like this:

`bash $ sudo parted -a optimal /dev/sdb $ (parted) mklabel gpt $ (parted) mkpart primary 0% 30% $ (parted) mkpart primary 30% 60% $ (parted) mkpart primary 60% 90% $ (parted) quit`

Make sure you adjust the percentages according to your needs. Once the disk is partitioned, you should see something like this to indicate that your partitioning has been done:

`bash $ ls -l /dev/sdb* brw-rw---- 1 root disk 8, 16 Oct 4 12:38 /dev/sdb brw-rw---- 1 root disk 8, 17 Oct 1 09:08 /dev/sdb1 brw-rw---- 1 root disk 8, 18 Oct 1 09:08 /dev/sdb2 brw-rw---- 1 root disk 8, 19 Oct 1 09:08 /dev/sdb3`

Note: Once you've set up your caching the cli tool will automatically create one udev rule per cache device. To avoid any possible issues with the changes of the block device names following server reboots, I highly recommend to use the block device names from `/dev/disk/by-id/` folder rather then in `/dev/`. So, locate your SSD and OSD HDD disks in `/dev/disk/by-id/`. My Crutial SSD with the partitions I've just created is shown as:

```
/dev/disk/by-id/scsi-SATA_Crucial_CT512MX_14300CC4FF69 -> ../../sdb
/dev/disk/by-id/scsi-SATA_Crucial_CT512MX_14300CC4FF69-part1 -> ../../sdb1
/dev/disk/by-id/scsi-SATA_Crucial_CT512MX_14300CC4FF69-part2 -> ../../sdb2
/dev/disk/by-id/scsi-SATA_Crucial_CT512MX_14300CC4FF69-part3 -> ../../sdb3
```

And OSD HDD disks as:

```
/dev/disk/by-id/wwn-0x5000cca01a9acbac -> ../../sdd
/dev/disk/by-id/wwn-0x5000cca01a9acbac-part1 -> ../../sdd1
/dev/disk/by-id/wwn-0x5000cca01a9acbac-part2 -> ../../sdd2

/dev/disk/by-id/wwn-0x5000cca01a9b0150 -> ../../sde
/dev/disk/by-id/wwn-0x5000cca01a9b0150-part1 -> ../../sde1
/dev/disk/by-id/wwn-0x5000cca01a9b0150-part2 -> ../../sde2

/dev/disk/by-id/wwn-0x5000cca01a9b030c -> ../../sdf
/dev/disk/by-id/wwn-0x5000cca01a9b030c-part1 -> ../../sdf1
/dev/disk/by-id/wwn-0x5000cca01a9b030c-part2 -> ../../sdf2
```

Right, everything is now ready. The next step would be to add your first cache device. I am using the writethrough cache mode as I have a separate SSD for ceph journals, which I think is a recommended way to go.

Run the following command to create your first enhanceio cache policy:

`bash $ sudo eio_cli create -d /dev/disk/by-id/wwn-0x5000cca01a9acbac \ -s /dev/disk/by-id/scsi-SATA_Crucial_CT512MX_14300CC4FF69-part1 \ -m wt \ -c OSD_0_CACHE`

Where:

```
'-d' is the OSD HDD block device
'-s' is the SSD cache partition
'-m wt' is the writethrough cache mode
'-c' is just the cache name
```

You should get the output similar to this:

```
Cache Name       : OSD_0_CACHE
Source Device    : /dev/disk/by-id/wwn-0x5000cca01a9acbac
SSD Device       : /dev/disk/by-id/scsi-SATA_Crucial_CT512MX_14300CC4FF69-part1
Policy           : lru
Mode             : Write Through
Block Size       : 4096
Associativity    : 256
ENV{ID_SERIAL}=="35000cca01a9ae7f4", ATTR{partition}=="1"
ENV{ID_SERIAL}=="Crucial_CT512MX_14300CC4FF69", ATTR{partition}=="1"
```

Repeat the above `eio_cli` command for the two remaining OSD HDDs changing the respective `-d`, `-s` and `-c` flags.

You can find the cache status information from `/proc/enhanceio/<cache name>/` folder:

`bash $ ls -la /proc/enhanceio/OSD_0_CACHE/ total 0 dr-xr-xr-x 2 root root 0 Oct 4 12:59 . dr-xr-xr-x 3 root root 0 Oct 4 12:59 .. -r--r--r-- 1 root root 0 Oct 4 12:59 config -r--r--r-- 1 root root 0 Oct 4 12:59 errors -r--r--r-- 1 root root 0 Oct 4 12:59 io_hist -r--r--r-- 1 root root 0 Oct 4 12:59 stats`

Check out the cache stats by doing:

\`\`\`bash $ sudo cat /proc/enhanceio/OSD\_0\_CACHE/stats

reads 324560 writes 178624 read\_hits 152 read\_hit\_pct 0 write\_hits 42936 write\_hit\_pct 24 dirty\_write\_hits 0 dirty\_write\_hit\_pct 0 cached\_blocks 57443 rd\_replace 10 wr\_replace 15 noroom 0 cleanings 0 md\_write\_dirty 0 md\_write\_clean 0 md\_SSD\_writes 0 do\_clean 0 nr\_blocks 26263808 nr\_dirty 0 nr\_sets 102593 clean\_index 0 uncached\_reads 1102 uncached\_writes 3721 uncached\_map\_size 0 uncached\_map\_uncacheable 0 disk\_reads 324408 disk\_writes 178624 SSD\_reads 152 SSD\_writes 502680 SSD\_readfills 324408 SSD\_readfill\_unplugs 1084 readdisk 1102 writedisk 1102 readcache 19 readfill 40551 writecache 62835 readcount 1117 writecount 3721 kb\_reads 162280 kb\_writes 89312 rdtime\_ms 16284 wrtime\_ms 465928 \`\`\`

You might want to run the following command (in screen session) to keep the track of the cache read hits percentage:

`bash $ sudo watch -n60 "cat /proc/enhanceio/OSD_*_CACHE/stats |grep read_hit_pct"`

Now, you might want to run some benchmarks to see how your cache performs and the performance gain that you get with it. I've used a simple `dd` test and ran it on 20 guest virtual machines concurrently. The command I've used read 4GB from the root volume:

`bash $ dd if=/dev/vda of=/dev/null bs=1M count=4000 iflag=direct`

I've made sure that the amount of read data considerably exceeds the total RAM on the OSD servers, otherwise a big chunk of your test would be coming from the OSD server RAM and not the cache disks. The first time you run the benchmark you should see a lot of write IO on the cache SSD disk. Your cache disk is being filled with the data requested by your guest virtual machines. Running the benchmark for the second, third, fourth times should show a lot of read IO with some minimal write IO from your cache disk. This indicates that the data is being served from the SSD disk rather than your slow HDDs. On my cluster the dd test gained about 4-5 times the throughput that I was getting without using the cache disk. The read hit percentages was close to 75%. I was pretty happy with the results, however, I do realise that the real life performance figures will not be as good as the test benchmark. They never are. My average read hits was around 20% when I was using the cluster for about two weeks in production. Overall, I've noticed an increase in guest virtual machine responsiveness and my HDD disk utilisation has also dropped.

  

> So, here you go, without too much fuss we have a working cache solution for your ceph cluster utilising the fast SSDs. I do recommend you to perform long term tests before using EnhanceIO in production.
