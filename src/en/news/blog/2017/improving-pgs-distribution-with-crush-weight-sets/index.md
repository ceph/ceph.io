---
title: "Improving PGs distribution with CRUSH weight sets"
date: "2017-04-25"
author: "admin"
tags: 
  - "planet"
---

In a [Ceph](http://ceph.com) cluster with a single pool of 1024 Placement Groups (PGs), the PG distribution among devices will not be as expected. (see [Predicting Ceph PG placement](http://dachary.org/?p=4020) for details about this uneven distribution).

In the following, the difference between the expected number of PGs on a given host or device and the actual number of PGs can be as high as 25%. For instance, **device4** has a weight of 1 and is expected to get 128 PGs but it only gets 96. And **host2** (containing **device4**) has 83 less PGs than expected.

         ~expected~  ~actual~  ~delta~   ~delta%~  ~weight~
dc1            1024      1024        0   0.000000       1.0
 host0          256       294       38  14.843750       2.0
  device0       128       153       25  19.531250       1.0
  device1       128       141       13  10.156250       1.0
 host1          256       301       45  17.578125       2.0
  device2       128       157       29  22.656250       1.0
  device3       128       144       16  12.500000       1.0
 host2          512       429      -83 -16.210938       4.0
  device4       128        96      -32 -25.000000       1.0
  device5       128       117      -11  -8.593750       1.0
  device6       256       216      -40 -15.625000       2.0

Using [minimization methods](https://docs.scipy.org/doc/scipy-0.18.1/reference/generated/scipy.optimize.minimize.html#scipy.optimize.minimize) it is possible to [find alternate weights](http://libcrush.org/main/python-crush/merge_requests/40/diffs) for hosts and devices that significantly reduce the uneven distribution, as shown below.

         ~expected~  ~actual~  ~delta~  ~delta%~  ~weight~
dc1            1024      1024        0  0.000000  1.000000
 host0          256       259        3  1.171875  0.680399
  device0       128       129        1  0.781250  0.950001
  device1       128       130        2  1.562500  1.050000
 host1          256       258        2  0.781250  0.646225
  device2       128       129        1  0.781250  0.867188
  device3       128       129        1  0.781250  1.134375
 host2          512       507       -5 -0.976562  7.879046
  device4       128       126       -2 -1.562500  1.111111
  device5       128       127       -1 -0.781250  0.933333
  device6       256       254       -2 -0.781250  1.955555

For each host or device, we now have two weights. First, there is the **target weight** which is used to calculate the expected number of PGs. For instance, host0 should get 1024 \* (target weight host0 = 2 / (target weight host0 = 2 + target weight host1 = 2 + target weight host3 = 4)) PGs, that is 1024 \* ( 2 / ( 2 + 2 + 4 ) ) = 256. The second weight is **weight set**, which is used to choose where a PGs is mapped.

The problem is that the crushmap format only allows one weight per host or device. Although it would be possible to store the **target weight** outside of the crushmap, it would be inconvenient and difficult to understand. Instead, the crushmap syntax [was extended to allow additional weights](http://libcrush.org/main/python-crush/merge_requests/40/diffs) (via **weight set**) to be associated with each item (i.e. disk or host in the example below).

                                                    target
         ~expected~  ~actual~  ~delta~   ~delta%~  ~weight~ ~weight set~
dc1            1024      1024        0   0.000000       1.0     1.000000
 host0          256       294       38  14.843750       2.0     0.680399
  device0       128       153       25  19.531250       1.0     0.950001
  device1       128       141       13  10.156250       1.0     1.050000
 host1          256       301       45  17.578125       2.0     0.646225
  device2       128       157       29  22.656250       1.0     0.867188
  device3       128       144       16  12.500000       1.0     1.134375
 host2          512       429      -83 -16.210938       4.0     7.879046
  device4       128        96      -32 -25.000000       1.0     1.111111
  device5       128       117      -11  -8.593750       1.0     0.933333
  device6       256       216      -40 -15.625000       2.0     1.955555

The **weight set** feature will be part of the “Luminous” release of Ceph. In [python-crush](http://crush.readthedocs.io/) the feature has already been implemented and released in [version 1.0.17](https://pypi.python.org/pypi/crush/1.0.17) .

Source: Dachary ([Improving PGs distribution with CRUSH weight sets](http://dachary.org/?p=4040))
