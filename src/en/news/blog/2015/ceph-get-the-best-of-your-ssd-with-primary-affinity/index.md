---
title: "Ceph: get the best of your SSD with primary affinity"
date: "2015-08-06"
author: "shan"
tags: 
---

![](images/ceph-ssd-primary-affinity.jpg "Ceph: get the best of your SSD with primary affinity")

Using SSD drives in some part of your cluster might useful. Specially under read oriented workloads. Ceph has a mechanism called primary affinity, which allows you to put a higher affinity on your OSDs so they will likely be primary on some PGs. The idea is to have reads served by the SSDs so clients can get faster reads.

Let's see how we can configure this. First edit your `ceph.conf` to enable the functionnality:

```
[mon]
...
mon osd allow primary affinity = true
...
```

Then pick up your SATA drives and set their primary affinity to 0, so they won't become primary:

```
$ ceph osd primary-affinity osd.<id> 0
```

Real life example:

```
$ ceph osd tree
ID WEIGHT   TYPE NAME          UP/DOWN REWEIGHT PRIMARY-AFFINITY
-1 18.63977 root default
-2  4.65994     host ceph-eno2
 0  0.89999         osd.0           up  1.00000                0
 5  0.89999         osd.5           up  1.00000                0
 8  0.89999         osd.8           up  1.00000                0
12  0.89999         osd.12          up  1.00000                0
16  0.89999         osd.16          up  1.00000                0
21  0.07999         osd.21          up  1.00000          1.00000
26  0.07999         osd.26          up  1.00000          1.00000
-3  4.65994     host ceph-eno4
 2  0.89999         osd.2           up  1.00000                0
 4  0.89999         osd.4           up  1.00000                0
 9  0.89999         osd.9           up  1.00000                0
13  0.89999         osd.13          up  1.00000                0
17  0.89999         osd.17          up  1.00000                0
20  0.07999         osd.20          up  1.00000          1.00000
25  0.07999         osd.25          up  1.00000          1.00000
-4  4.65994     host ceph-eno5
 1  0.89999         osd.1           up  1.00000                0
 7  0.89999         osd.7           up  1.00000                0
10  0.89999         osd.10          up  1.00000                0
14  0.89999         osd.14          up  1.00000                0
18  0.89999         osd.18          up  1.00000                0
23  0.07999         osd.23          up  1.00000          1.00000
27  0.07999         osd.27          up  1.00000          1.00000
-5  4.65994     host ceph-eno3
 3  0.89999         osd.3           up  1.00000                0
 6  0.89999         osd.6           up  1.00000                0
11  0.89999         osd.11          up  1.00000                0
15  0.89999         osd.15          up  1.00000                0
19  0.89999         osd.19          up  1.00000                0
22  0.07999         osd.22          up  1.00000          1.00000
24  0.07999         osd.24          up  1.00000          1.00000
```

  

> That's all!
