---
title: "Predicting which Ceph OSD will fill up first"
date: "2017-03-14"
author: "admin"
tags: 
  - "planet"
---

When a device is added to [Ceph](http://ceph.com/), it is assigned a weight that reflects its capacity. For instance if **osd.1** is a 1TB disk, its weight will be **1.0** and if **osd.2** is a 4TB disk, its weight will be **4.0**. It is expected that **osd.1** will receive exactly four times more objects than **osd.2**. So that when **osd.1** is 80% full, **osd.2** is also 80% full.

But running a simulation on a crushmap with four 4TB disks and one 1TB disk, shows something different:

         WEIGHT     %USED
osd.4       1.0       86%
osd.3       4.0       81%
osd.2       4.0       79%
osd.1       4.0       79%
osd.0       4.0       78%

It happens when these devices are used in a two replica pool because the distribution of the second replica [depends on the distribution of the first replica](http://tracker.ceph.com/issues/15653#detailed-explanation). If the pool only has one copy of each object, the distribution is as expected (there is a variation but it is around 0.2% in this case):

         WEIGHT     %USED
osd.4       1.0       80%
osd.3       4.0       80%
osd.2       4.0       80%
osd.1       4.0       80%
osd.0       4.0       80%

This variation is not new but there was no way to conveniently show it from the crushmap. It can now be displayed with [crush analyze](http://crush.readthedocs.io/) command. For instance:

    $ ceph osd crush dump > crushmap-ceph.json
    $ crush ceph --convert crushmap-ceph.json > crushmap.json
    $ crush analyze --rule replicated --crushmap crushmap.json
            ~id~  ~weight~  ~over/under used~
    ~name~
    g9       -22  2.299988     10.400604
    g3        -4  1.500000     10.126750
    g12      -28  4.000000      4.573330
    g10      -24  4.980988      1.955702
    g2        -3  5.199982      1.903230
    n7        -9  5.484985      1.259041
    g1        -2  5.880997      0.502741
    g11      -25  6.225967     -0.957755
    g8       -20  6.679993     -1.730727
    g5       -15  8.799988     -7.884220

shows that **g9** will be ~90% full when **g1** is ~80% full (i.e. 10.40 – 0.50 ~= 10% difference) and **g5** is ~74% full.

By monitoring disk usage on **g9** and adding more disk space to the cluster when the disks on **g9** reach a reasonable threshold (like 85% or 90%), one can ensure that the cluster will never fill up, since it is known that **g9** will always be the first node to become overfull. Another possibility is to run the [ceph osd reweight-by-utilization](http://docs.ceph.com/docs/hammer/rados/operations/control/) command from time to time and try to even the distribution.  

### Counting PGs, not objects

When analyzing the crushmap, the results must be compared to the Ceph PG distribution, not the object distribution. For instance in a pool with 5000 PGs and two replicas, **crush analyze** will show which osd are assigned to which PG. It is assumed that each PG will get an equal number of objects because they are distributed using the equivalent of a modulo. For instance in the following:

$ ceph osd df tree
ID WEIGHT  REWEIGHT SIZE  USE  AVAIL  %USE  VAR  PGS  TYPE NAME
-1 4.09999        - 1107G 817G   290G 73.77 1.00    - root default
-2 4.09999        - 1107G 817G   290G 73.77 1.00    - host 7e302bd2aa5a
 0 1.00000  1.00000  221G 163G 59528M 73.76 1.00 1206         osd.0
 1 1.00000  1.00000  221G 163G 59469M 73.78 1.00 1239         osd.1
 2 1.00000  1.00000  221G 163G 59517M 73.76 1.00 1198         osd.2
 3 1.00000  1.00000  221G 163G 59496M 73.77 1.00 1253         osd.3
 4 0.09999  1.00000  221G 163G 59486M 73.78 1.00  **128**         osd.4
              TOTAL 1107G 817G   290G 73.77
MIN/MAX VAR: 1.00/1.00  STDDEV: 0.01

which contains one pool of size 1, the **PGS** column shows osd.4 has 10 times less PGs than osd.1 which exactly matches the ratio between their respective weights (1 / 0.09999). Changing to a size 3 pool shows osd.4 has 6 times less PGs than osd.1 although it has 10 times less space. It will therefore fill more quickly than the larger disks.

$ ceph osd df tree
ID WEIGHT  REWEIGHT SIZE  USE  AVAIL  %USE  VAR  PGS  TYPE NAME
-1 4.09999        - 1107G 817G   290G 73.81 1.00    - root default
-2 4.09999        - 1107G 817G   290G 73.81 1.00    - host 7e302bd2aa5a
 0 1.00000  1.00000  221G 163G 59424M 73.80 1.00 3645         osd.0
 1 1.00000  1.00000  221G 163G 59389M 73.82 1.00 3676         osd.1
 2 1.00000  1.00000  221G 163G 59410M 73.81 1.00 3562         osd.2
 3 1.00000  1.00000  221G 163G 59385M 73.82 1.00 3598         osd.3
 4 0.09999  1.00000  221G 163G 59424M 73.80 1.00  **543**         osd.4
              TOTAL 1107G 817G   290G 73.81
MIN/MAX VAR: 1.00/1.00  STDDEV: 0.01

### Observing the failure domain, not the devices

Many crushmaps are designed to require that copies of the same object are on different hosts, because the cluster must sustain the failure of a host without loosing more than one copy of the object. This is expressed in a crush rule with a step like:

step chooseleaf firstn 0 type host

where the **host** is the type of the bucket designated as the **failure domain**. When the crush rule selects hosts for a PG, it is entirely possible that the same host comes up twice. In this case it is rejected (possibly multiple times) until another suitable host is found. In other words drawing the second host in a PG depends on which host was drawn first and this conditional probability is the source of the unbalance. Since it happens at the host level (or more generally at the failure domain level) **crush analyze** only displays hosts and not devices:

$ crush analyze --rule replicated --crushmap crushmap.json
            ~id~  ~weight~  ~over/under used~
    ~name~
    g9       -22  2.299988     10.400604
    g3        -4  1.500000     10.126750
    g12      -28  4.000000      4.573330
    g10      -24  4.980988      1.955702
    g2        -3  5.199982      1.903230
    n7        -9  5.484985      1.259041
    g1        -2  5.880997      0.502741
    g11      -25  6.225967     -0.957755
    g8       -20  6.679993     -1.730727
    g5       -15  8.799988     -7.884220

There is a correlation between the host weight and the usage difference. The devices are within the hosts and the usage difference they show exclusively come from the usage difference of the bucket that contain them. Since there can only be one device selected for a bucket in the failure domain, there can be no rejection and therefore no conditional probability to modify the distribution set by the device weights.

$ crush analyze --type device --rule replicated 
                --crushmap crushmap.json
        ~id~  ~weight~  ~over/under used~
~name~
osd.35    35  2.299988     10.400604
osd.2      2  1.500000     10.126750
osd.47    47  2.500000      5.543335
osd.46    46  1.500000      2.956655
osd.29    29  1.784988      2.506855
osd.1      1  3.899994      2.315382
osd.37    37  2.681000      2.029613
osd.38    38  2.299988      1.869548
osd.27    27  1.699997      1.275095
osd.21    21  1.299988      0.666766
osd.0      0  3.199997      0.515785
osd.20    20  2.681000      0.487172
osd.8      8  2.000000      0.131729
osd.44    44  1.812988     -0.155715
osd.11    11  2.599991     -1.238497
osd.3      3  1.812988     -1.357188
osd.9      9  4.000000     -1.616832
osd.13    13  2.679993     -1.900721
osd.26    26  3.000000     -7.577257
osd.25    25  2.799988     -7.733660
osd.24    24  3.000000     -8.331705

### Thanks

Many thanks to Nathan Cutler for proofread part of this post. The well written parts are from him, the rest is my doing.

Source: Dachary ([Predicting which Ceph OSD will fill up first](http://dachary.org/?p=3980))
