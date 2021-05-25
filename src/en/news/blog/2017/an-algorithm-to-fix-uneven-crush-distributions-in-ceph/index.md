---
title: "An algorithm to fix uneven CRUSH distributions in Ceph"
date: "2017-05-12"
author: "admin"
tags: 
  - "planet"
---

The current [CRUSH](http://libcrush.org/) implementation [in Ceph does not always provide an even distribution](http://dachary.org/?p=4040).

The most common cause of unevenness is when only a few thousands PGs, or less, are mapped. This is not enough samples and the variations can be as high as 25%. For instance, when there are two OSDs with the same weight, distributing randomly four PGs among them may lead to one OSD having three PGs and the other only one. This problem would be resolved by having at least thousands of PGs per OSD, but that is not recommended because it would require too many resources.

The other cause of uneven distribution is [conditional probability](https://github.com/plafl/notebooks/blob/master/converted/replication.pdf). For a two-replica pool, PGs are mapped to OSDs that must be different: the second OSD is chosen at random, on the condition that it is not the same as the first OSD. When all OSDs have the same probability, this bias is not significant. But when OSDs have different weights it makes a difference. For instance, given nine OSDs with weight 1 and one OSD with weight 5, the smaller OSDs will be overfilled (from 7% to 10%) and the bigger OSD will be ~15% underfilled.

The proposed algorithm fixes both cases by producing new weights that can be used as a [weight set](http://dachary.org/?p=4040) in Luminous clusters.

For a given pool the input parameters are:

- pool size
- numeric id
- number of PGs
- root of the CRUSH rule (take step)
- the CRUSH rule itself

   for size in \[1,pool size\]
     copy all weights to the size - 1 weight set
     recursively walk the root
     for each bucket at a given level in the hierarchy
       repeat until the difference with the expected distribution is small
         map all PGs in the pool, with size instead of pool size
         in the size - 1 weight set
           lower the weight of the most overfilled child
           increase  the weight of the most underfilled child

It is common to change the size of a pool in a Ceph cluster. When increasing the size from 2 to 3, the user expects the existing objects to stay where they are, with new objects being created to provide an additional replica. To preserve this property while optimizing the weights, there needs to be a different weight set for each possible size. This is what the outer loop (for size in \[1,pool size\]) does.

If the distribution is not as expected at the highest level of the hierarchy, there is no way to fix that at the lowest levels. For instance if a host receives 100 more PGs that it should, the OSDs it contains will inevitably be overfilled. This is why the optimization proceeds from the top of the hierarchy.

When a bucket is given precisely the expected number of PGs and fails to distribute them evenly among its children, the children’s weights can be modified to get closer to the ideal distribution. Increasing the weight of the most underfilled item will capture PGs from the other buckets. And decreasing the weight of the most overfilled will push PGs out of it. A simulation is run to determine precisely which PGs will be distributed to which item because there is no known mathematical formula to calculate that. This is why all PGs are mapped to determine which items are over- or underfilled.

### Caveats

Only straw2

The proposed optimization algorithm is designed for **straw2** buckets and is unlikely to yield the expected results for **uniform** and **list** buckets.

Making things worse

After modifying the weights to get closer to the expected distribution, there is a chance that the removal of an item (for instance a host failing) might lead to [a situation that is worse](http://dachary.org/?p=4044) than before the optimization. Such an optimization should be discarded.

Multiple roots

When a rule has multiple roots, each is associated with a replica level and is optimized independently. For instance:

rule critical {
	ruleset 4
	type replicated
	min\_size 1
	max\_size 10
	step take 0513-R-0060
	step chooseleaf firstn 2 type ipservice
	step emit
	step take 0513-R-0050
	step chooseleaf firstn -2 type rack
	step emit
}

In this CRUSH rule, the root **0513-R-0060** is used to optimize pool size 1 and 2 and **0513-R-0050** only when optimizing pool size 3. Each optimization leads to a distinct weight set for each bucket in the selected root.

### Future directions

Better algorithm

Adding an subtracting 1% to the two items that have the greater difference works but is naïve. There should be a better way to do the same and converge faster and closer to the expected distribution

Source: Dachary ([An algorithm to fix uneven CRUSH distributions in Ceph](http://dachary.org/?p=4055))
