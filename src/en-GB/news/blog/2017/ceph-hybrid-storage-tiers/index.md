---
title: "Ceph hybrid storage tiers"
date: "2017-04-29"
author: "admin"
tags: 
  - "planet"
---

In a previous post I showed you [how to deploy storage tiering for Ceph](http://www.root314.com/2017/01/15/Ceph-storage-tiers/), today I will explain how to setup hybrid storage tiers.

## What is hybrid storage?

Hybrid storage is a combination of two different storage tiers like SSD and HDD. In Ceph terms that means that the copies of each objects are located in different tiers - maybe 1 copy on SSD and 2 copies on HDDs.

The idea is to keep 1 copy of the data on a high performance tier (usually SSD or NVMe) and 2 additional copies on a lower cost tier (usually HDDs) in order to improve the read performance at a lower cost.

The following diagram explains the difference between read and write I/O, when using a hybrid storage tier:

![wdm usage](http://www.root314.com/img/posts/hybrid-storage-tier.svg)

## How to set it up?

To get this to work in Ceph, we create a two step storage policy:

- First step: choose the primary OSD (`firstn 1`) in the high performance tier, “root-ssd” in the example
- Second step: choose the rest of the OSDs (`firstn -1`) in the low performance tier, “root-hdd” in the example

Assuming a replication factor of 3, the following Ceph ruleset will place 1 copy of each object on SSD and 2 copies on HDDs.

```
# Hybrid storage policy
rule hybrid {
  ruleset 2
  type replicated
  min_size 1
  max_size 10
  step take root-ssd
  step chooseleaf firstn 1 type host
  step emit
  step take root-hdd
  step chooseleaf firstn -1 type host
  step emit
}
```

Now that you know how to set it up, it’s up to you to combine all the storage tiers.

Source: Maxime Guyot ([Ceph hybrid storage tiers](http://www.root314.com/ceph/2017/04/30/Ceph-hybrid-storage-tiers/))
