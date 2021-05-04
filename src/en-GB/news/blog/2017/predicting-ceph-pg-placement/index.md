---
title: "Predicting Ceph PG placement"
date: "2017-03-29"
author: "admin"
tags: 
  - "planet"
---

When creating a new [Ceph](http://ceph.com) pool, deciding for the number of PG requires [some thinking](http://docs.ceph.com/docs/master/rados/operations/placement-groups/) to ensure there are a few hundred PGs per OSD. The distribution can be verified with [crush analyze](http://crush.readthedocs.io/) as follows:

$ crush analyze --rule data --type device 
                --replication-count 2 
                --crushmap crushmap.txt 
                --pool 0 --pg-num 512 --pgp-num 512
         ~id~  ~weight~  ~over/under used %~
~name~
device0     0       1.0                 9.86
device5     5       2.0                 8.54
device2     2       1.0                 1.07
device3     3       2.0                -1.12
device1     1       2.0                -5.52
device4     4       1.0               -14.75

The argument of the **–pool** option is unknown because the pool was not created yet, but pool numbers are easy to predict. If the highest pool number is 5, the next pool number will be 6. The output shows the PGs will not be evenly distributed because there are not enough of them. If there was a thousand times more PGs, they would be evenly distributed:

$ crush analyze --rule data --type device 
                --replication-count 2 
                --crushmap crushmap 
                --pool 0 --pg-num 512000 --pgp-num 512000
         ~id~  ~weight~  ~over/under used %~
~name~
device4     4       1.0                 0.30
device3     3       2.0                 0.18
device2     2       1.0                -0.03
device5     5       2.0                -0.04
device1     1       2.0                -0.13
device0     0       1.0                -0.30

Increasing the number of PGs is not a practical solution because having more than a few hundred PGs per OSD requires too much CPU and RAM. Knowing that **device0** will be the first OSD to fill up, [reweight-by-utilization](http://docs.ceph.com/docs/hammer/rados/operations/control/) should be used when it is too full.  

### PG mapping details

The **crush** command uses the same C++ functions as **Ceph** to map a PG to an OSD. This is done in two steps:

- the pool and pg number are hashed into a value
- the value is mapped to OSDs using a crushmap

The **–verbose** flags displays the details of the mapping, with the name of the PG:

$ crush analyze --rule data --type device 
                --verbose 
                --replication-count 2 
                --crushmap crushmap 
                --pool 0 --pg-num 512000 --pgp-num 512000
...
2017-03-27 09:37:14,382 DEBUG 0.6b == 105507960 mapped to \[u'device5', u'device0'\]
2017-03-27 09:37:14,382 DEBUG 0.6c == 1533389179 mapped to \[u'device5', u'device3'\]
...

The PG **0.6b** is hashed to the value **105507960** and mapped to **device5** and **device0**. The accuracy of the mapping can be verified with the output of **ceph pg dump**.

### caveat

The **crush** hash assumes the [hashpspool](https://github.com/ceph/ceph/blob/kraken/src/common/config_opts.h#L681) flag is set for the pool. It is the default and the only reason to unset that flag is to support legacy clusters.

Source: Dachary ([Predicting Ceph PG placement](http://dachary.org/?p=4020))
