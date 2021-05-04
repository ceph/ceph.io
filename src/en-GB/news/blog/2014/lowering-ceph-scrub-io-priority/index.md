---
title: "Lowering Ceph scrub I/O priority"
date: "2014-10-07"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The disk I/O of a [Ceph](http://ceph.com/) [OSD](http://ceph.com/docs/master/man/8/ceph-osd/) thread [scrubbing](http://ceph.com/docs/giant/dev/osd_internals/scrub/) is the same as all other threads by default. It can be lowered with [ioprio options](http://ceph.com/docs/master/rados/configuration/osd-config-ref/) for all OSDs with:

ceph tell osd.\* injectargs '--osd\_disk\_thread\_ioprio\_priority 7'
ceph tell osd.\* injectargs '--osd\_disk\_thread\_ioprio\_class idle'

All other threads in the OSD will be **be** (best effort) with priority **4** which is the default for daemons. The disk thread will show as **idle**:

$ sudo iotop --batch --iter 1 | grep 'ceph-osd -i 0' | grep -v be/4
 4156 idle loic        0.00 B/s    0.00 B/s  0.00 %  0.00 % ./ceph-osd -i 0 ..

  
The change will only be effective if the scheduler is **cfq** (it can safely be modified at runtime)

\# cat /sys/block/sda/queue/scheduler
noop \[deadline\] cfq
# echo cfq > /sys/block/sda/queue/scheduler

To display the current value for a given OSD the following can be run from the host on which it is running (because it uses the asok file found in /var/run/ceph):

$ ceph daemon osd.0 config get osd\_disk\_thread\_ioprio\_class
{ "osd\_disk\_thread\_ioprio\_class": "idle"}
$ ceph daemon osd.0 config get osd\_disk\_thread\_ioprio\_priority
{ "osd\_disk\_thread\_ioprio\_priority": "7"}
