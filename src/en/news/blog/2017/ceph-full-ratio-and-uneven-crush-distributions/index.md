---
title: "Ceph full ratio and uneven CRUSH distributions"
date: "2017-05-04"
author: "admin"
tags: 
  - "planet"
---

A common [CRUSH](http://libcrush.org/) rule in [Ceph](http://ceph.com) is

    step chooseleaf firstn 0 type host

meaning Placement Groups (PGs) will place replicas on different hosts so the cluster can sustain the failure of any host without losing data. The missing replicas are then restored from the surviving replicas (via a process called “backfilling”) and placed on the remaining hosts.

To make sure there is enough space in the cluster to cope with the failure of a host, a certain percentage of free space in the cluster is reserved (from the beginning) and never used. This percentage needs to be adjusted to take into account the [most overfull OSD](http://dachary.org/?p=4020) in case the PG distribution is not even.

For instance, in a cluster with five hosts containing two identical disks each, reserving 20% plus 6.45% to account for the most overfull OSD displayed below should be enough:

crush analyze --type device --rule data 
              --replication-count 2 
              --crushmap mymap.txt 
              --pool 0 --pg-num 1024 --pgp-num 1024
         ~id~  ~weight~  ~objects~  ~over/under used %~
~name~
device9     9       1.0        218                 6.45
device5     5       1.0        214                 4.49
device7     7       1.0        214                 4.49
device0     0       1.0        212                 3.52
device8     8       1.0        212                 3.52
device6     6       1.0        208                 1.56
device2     2       1.0        201                -1.86
device3     3       1.0        201                -1.86
device4     4       1.0        192                -6.25
device1     1       1.0        176               -14.06

However this uneven distribution will be different when a host is removed, because that causes a change in the most overfull OSD – and the new most overfull OSD may even be worse (more overfull) than the previous one. In our example cluster, device9 was the most (6.45%) overfull. If the host containing device8 and device9 is removed, device5 becomes the most overfull OSD, and it is worse (8.98%):

         ~id~  ~weight~  ~objects~  ~over/under used %~
~name~
device5     5       1.0        279                 8.98
device7     7       1.0        270                 5.47
device2     2       1.0        268                 4.69
device0     0       1.0        267                 4.30
device3     3       1.0        249                -2.73
device6     6       1.0        246                -3.91
device1     1       1.0        241                -5.86
device4     4       1.0        228               -10.94

It would therefore be better to reserve 28.98% instead of 26.45% to make sure the cluster does not become too full after a host failure. To help with that, the [crush analyze](http://crush.readthedocs.io/) command was modified to display the worst case scenario for each bucket type in the crushmap:

crush analyze --type device --rule data 
              --replication-count 2 
              --crushmap mymap.txt 
              --pool 0 --pg-num 1024 --pgp-num 1024
         ~id~  ~weight~  ~objects~  ~over/under used %~
~name~
device9     9       1.0        218                 6.45
device5     5       1.0        214                 4.49
device7     7       1.0        214                 4.49
device0     0       1.0        212                 3.52
device8     8       1.0        212                 3.52
device6     6       1.0        208                 1.56
device2     2       1.0        201                -1.86
device3     3       1.0        201                -1.86
device4     4       1.0        192                -6.25
device1     1       1.0        176               -14.06

Worst case scenario if a host fails:

        ~over used %~
~type~
device           8.98
host             4.49
root             0.00

Source: Dachary ([Ceph full ratio and uneven CRUSH distributions](http://dachary.org/?p=4044))
