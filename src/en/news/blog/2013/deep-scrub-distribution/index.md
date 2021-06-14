---
title: "Deep Scrub Distribution"
date: "2013-08-27"
author: "syndicated"
tags: 
---

To verify the integrity of data, Ceph uses a mechanism called deep scrubbing which browse all your data once per week for each placement group. This can be the cause of overload when all osd running deep scrubbing at the same time.

You can easly see if a deep scrub is current running (and how many) with ceph status `` `ceph -w` ``. But the most interesting is to see the distribution over a week to anticipate the load :

### Get the distribution for the week

```
$ for date in `ceph pg dump | grep active | awk '{print $20}'`; do date +%A -d $date; done | sort | uniq -c
    239 monday
     41 tuesday
      2 saturday
    410 sunday
```

We can easy see when are done the deep scrub (in my case sunday and monday).

The default interval for deep scrubbing is every week but it could be tunable with parameter ‘osd deep scrub interval’ : [http://ceph.com/docs/master/rados/configuration/osd-config-ref/#scrubbing](http://ceph.com/docs/master/rados/configuration/osd-config-ref/#scrubbing)

### Distribution per hours

```
$ for date in `ceph pg dump | grep active | awk '{print $21}'`; do date +%H -d $date; done | sort | uniq -c
     11 00
     26 01
     34 02
     37 03
     26 04
     25 05
     14 06
      1 08
     28 09
     49 10
     52 11
     46 12
     37 13
     31 14
     29 15
     45 16
     34 17
     33 18
     27 19
     33 20
     27 21
     25 22
     22 23
```
