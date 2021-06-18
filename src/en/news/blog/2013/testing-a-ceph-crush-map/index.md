---
title: "Testing a Ceph crush map"
date: "2013-12-09"
author: "loic"
tags: 
  - "ceph"
---

After [modifying a crush map](http://ceph.com/docs/master/rados/operations/crush-map/) it should be tested to check that all rules can provide the specified number of replicas. If a pool is created to use the **metadata** rule with seven replicas, could it fail to find enough devices ? The [crushtool](http://ceph.com/docs/master/man/8/crushtool/) test mode can be used to simulate the situation as follows:

$ crushtool -i the-new-crush-map --test --show-bad-mappings
bad mapping rule 1 x 781 num\_rep 7 result \[8,10,2,11,6,9\]

The output shows that for rule 1 ( **metadata** by default is rule 1 ), an attempt to find seven replicas ( **num\_rep 7** ) for the object **781** (the hash of its name) failed and only returned six ( **\[8,10,2,11,6,9\]** ). It can be resolved by increasing the number of devices, lowering the number of replicas or changing the way replicas are selected.

When all attempts to find the required number of replicas are one device short, it simply means there are not enough devices to satisfy the rule and the only solution is to add at least one. CRUSH may not find a device mapping that satisfies all constraints the first time around and it will need to try again. If it fails more [than fifty times](https://github.com/ceph/ceph/blob/v0.72.1/src/crush/CrushWrapper.h#L110) it will give up and return less devices than required. Lowering the required number of replica is one way to solve this problem.

Although it is possible to increase the number of times CRUSH will try, this is dangerous on a running cluster because it may modify the mapping for existing objects.
