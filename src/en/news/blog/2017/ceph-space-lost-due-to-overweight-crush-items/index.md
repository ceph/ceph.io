---
title: "Ceph space lost due to overweight CRUSH items"
date: "2017-05-11"
author: "admin"
tags: 
  - "planet"
---

When a [CRUSH](http://libcrush.org) bucket contains five [Ceph](http://ceph.com/) OSDs with the following weights:

      weight
osd.0   5
osd.1   1
osd.2   1
osd.3   1
osd.4   1

20% of the space in osd.0 will never be used by a pool with two replicas.

The **osd.0** gets 55% of the values for the first replica (i.e 5 / 9), as expected. But **osd.0** can only get 45% for the second replica, because that is all there is left.

The upper bound for the weight of an item within a bucket that contains either devices or items designated to be the failure domain can be calculated as follows:

- N is the number of replicas
- O is the number of overweight items, i.e. items that have a weight greater than (sum of the weights)/N
- the effective weight of all overweight items is equal to (sum of the weights of non-overweight items) / (N – O)

In the example above, the effective weight of **osd.0** is therefore ( 1 + 1 + 1 + 1) / ( 2 – 1 ) = 4.

The [crush analyze](http://crush.readthedocs.io/) command detects weights that are above the maximum and uses their effective weight to get meaningful results. For instance:

$ crush analyze ...
        ~id~  ~weight~  ~objects~  ~over/under filled %~
~name~
osd.3      5         1        646                26.17
osd.4      6         1        610                19.14
osd.2      4         1        575                12.30
osd.1      3         1        571                11.52
osd.0      2         5       1694               -37.29

Worst case scenario if a osd fails:

        ~overfilled %~
~type~
osd             21.14
root             0.00

The following are overweight and should be cropped:

        ~id~  ~weight~  ~cropped weight~  ~cropped %~
~name~
osd.0      2         5               4.0         20.0

The **osd.0** is reported to be 37.29% underfilled but 20% of that amount comes from the fact that the item is overweight. The remaining 17.29% come from the [conditional probability bias](https://github.com/plafl/notebooks/commits/master/converted/replication.pdf) and random noise due to a low number of objects.

Source: Dachary ([Ceph space lost due to overweight CRUSH items](http://dachary.org/?p=4061))
