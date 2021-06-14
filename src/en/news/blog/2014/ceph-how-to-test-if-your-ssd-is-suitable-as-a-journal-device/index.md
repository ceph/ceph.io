---
title: "Ceph: how to test if your SSD is suitable as a journal device?"
date: "2014-10-10"
author: "shan"
tags: 
---

![](images/ceph-ssd-approved.jpg "Ceph: how to test if your SSD is suitable as a journal device?")

A simple benchmark job to determine if your SSD is suitable to act as a journal device for your OSDs.

To give you a little bit of background when the OSD writes into his journal it uses `D_SYNC` and `O_DIRECT`. Writing with `O_DIRECT` bypasses the Kernel page cache, while `D_SYNC` ensures that the command won't return until every single write is complete. So yes, basically the OSD forces all the writes to be flushed prior to start the next IO.

First disable the write cache on the disk:

`bash $ sudo hdparm -W 0 /dev/hda 0`

Now you can start benchmarking your SSD correctly using two different methods. The FIO way:

`bash $ sudo fio --filename=/dev/sda --direct=1 --sync=1 --rw=write --bs=4k --numjobs=2 --group_reporting --invalidate=0 --name=journal-test`

The `dd` way:

`bash $ sudo dd if=randfile of=/dev/sda bs=4k count=100000 oflag=direct,dsync`

  

> What matters the most here is to find how the SSD is performing while using D\_SYNC. At some point [users reported](http://lists.ceph.com/pipermail/ceph-users-ceph.com/2013-November/025515.html) some SSD misbehaving with DSYNC. Then you better always test your SSD prior to go in production.

  

  

## Data agregation table

Gathering all the comments in a table:

  

|  | SSD MODEL | RESULTS |
| --- | --- | --- |
|  | Crucial m550 | 200 IOPS |
|  | intel s3500 | 10 000 IOPS |
|  | Micron p400e, 400GB | 3.0 MB/s |
|  | Intel S3700, 200GB | 22.5 MB/s |
|  | FusionIO IOdrive2, 410GB | 85.1 MB/s |
|  | Micron M500DC, 480GB | 33.6 MB/s |
|  | Intel 510 | 4.2 MB/s |
