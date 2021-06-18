---
title: "The first telemetry results are in"
date: "2019-08-07"
author: "lmb"
---

Since the Mimic (13.2.x) release, Ceph includes the telemetry module. This (opt-in) component sends anonymous, non-identifiable metrics about the cluster back to the Ceph project. These include for example high-level summaries of pool configuration, number of nodes and OSDs, as well Ceph, OS, kernel versions, crashes encountered, and total cluster capacity. More details are available in a [previous blog post.](https://ceph.io/community/new-in-nautilus-crash-dump-telemetry/)

This module is not yet widely enabled, and the data reported is still evolving and under refinement. As a storage system, we are taking a careful approach with strong emphasis on privacy.

To understand which reports would be beneficial to developers and the community at large, we made our first steps through manual exploration, based on current support incidents. And we were positively surprised that already, the data proved useful!

### Early findings

At the time of this writing in July 2019, some 320 clusters reported, at some point in their lifecycle, their status to our telemetry service. These clusters jointly hosted over 40 petabytes of data on over 10000 OSDs. Given how few clusters have the module enabled so far, and how many of those might be lab or development clusters, it’s too early to draw too many conclusions from this data.

However, during exploration, an oddity was noticed that was surprising even under those caveats - a number of clusters reported some of their pools using a _pg\_num_ setting that was not a power of two:

![](https://lh3.googleusercontent.com/SrXDx6NyO644-Ze3PcrsuPe-14O5980iYpuvUcawdqQ6EMI_ym_HEdotYHRQBIj1cl2HcCofY1EaCgNO0OQS1cvuybHylFPa1QBxuiCSLkc1mv3SqNVpzIG01T8ejtjdQSaT0Yph)

While the distribution clearly shows the expected bias towards powers of two, just over 4% of all pools did not follow this recommendation. One might speculate that since telemetry needs to be explicitly enabled still, these users are slightly more familiar with Ceph than average and thus this percentage might be even higher in the field at large.

Let’s take a look at why this matters, and the actions this insight triggered.

## Data placement in Ceph

### A quick refresher

Ultimately, all data stored on a Ceph cluster - whether through RBD, iSCSI, CephFS, Samba, NFS, S3, Swift, or the low-level librados protocol - are mapped to low-level RADOS objects within pools. Large entities are sliced up into many smaller objects; 4 MiB by default. A full 1 terabyte RBD would, for example, result in 262144 objects of four megabytes each in the RADOS cluster. Since 4 MiB is small compared to modern storage device sizes, this is fairly fine-grained.

These object identifiers are hashed and then distributed across Placement Groups (PGs). Ceph uses CRUSH to algorithmically map and pseudo-randomly balance the PGs to the Ceph Object Storage Daemons (OSDs) according to rules that ensure the right level of redundancy and fault tolerance.

### Benefits of balanced data placement

Evenly balancing the data across the OSDs (relative to their capacity) is important for two reasons in particular. First and most prominently, this optimizes the amount of data a cluster can store. When new data is (deterministically, but pseudo-randomly) directed to an OSD that is already full, it cannot be written. Thus, the first OSD filling up is a choke point for the entire cluster. (This is why Ceph extrapolates the remaining available space in the cluster not from the average utilization of OSDs but from the most full one instead.)

The second one is performance per capacity - assuming a somewhat even pattern of IO, then more data an OSD holds, the more IO it would receive. Since IOPS and bandwidth are limited by the storage device and the network, over-utilization means some IO will be slower than necessary, and under-utilized OSDs would leave some performance on the table.

Simplified: an unbalanced cluster stores less data at lower performance.

### Balancing PGs across OSDs

Since Ceph uses a pseudo-random algorithmic data distribution, data placement is rarely perfect. You may be familiar with using “_ceph osd reweight_”, or “_reweight-by-utilization_” to adjust the OSD weights so that OSDs receive more or fewer PGs.

Since Luminous, Ceph includes the [balancer module](https://docs.ceph.com/docs/master/rados/operations/balancer/), which supports two modes for handling this automatically or assisted. The module is enabled by default in new Nautilus and later clusters. The “_crush-compat_” mode modifies the weights as before, but more intelligently. The newer “_upmap_” mode adds explicit mappings for PGs to OSDs as exceptions, thus being able to perfectly balance the number of PGs per OSD (relative to the OSD’s capacity).

So, in our ideal world so far (assuming equal size OSDs), every OSD now has the same number of PGs assigned.

### Introducing number of PGs per pool

Now we need to back up two steps - starting with how many PGs are configured on a pool. Every PG ideally will receive the same share of the total data. e.g., with _pg\_num_ set to _20_, every PG would hold 5%.

The rule of thumb is to target about 100 PGs per OSD. However, this must take the pool’s “_size_” into account, since there are shadow PGs created to handle the redundancy Ceph requires - the total number of copies for a replicated pool, or _k+m_ for an Erasure Coded pool.

If we assume a 10 node cluster with 10 OSDs each and three way replication and this PG/OSD goal, we would set _pg\_num_ to _4096_. If we wanted to use Erasure Coding with similar fault tolerance but better space efficiency, we might choose _8+2_ as the _k+m_ values - now our EC pool’s _size_ is _10_, and our target _pg\_num_ would be _1024_. We can see already that with EC, every PG represents a larger fraction of the total data. (A factor of four, in this case.)

And while the Ceph documentation already recommended that the total number of PGs per pool should be rounded to a power of two, it did not do so very strongly. As we looked into why users choose such values, we found that [other parts of our documentation](https://docs.ceph.com/docs/mimic/rados/operations/placement-groups/#object-distribution-within-a-pool) even used them in their examples. Some of our users focused on the number of PGs per OSD, and sometimes erred on the low side as well, striving to lower the cost of PGs.

Now, we are finally ready to look at where the problem occurs - how objects are mapped to PGs based on their name.

### Mapping objects to PGs

An object’s name is not used directly to map it to a PG. Since it can be any random string, RADOS computes a standard-length 32 bit hash of the object’s name. It is this hash that is used to decide into which PG the object will be placed within the pool. To do so, RADOS applies a bitmask to this hash, which is very fast - the lowest n bits are used to decide which PG an object goes into. However, crucially, it can only decide at bit boundaries - which is where the power of two comes in. Simplifying further, this means PGs can only double or half the number of objects they hold.

Objects that would be mapped to a PG above pg\_num (if pg\_num is not a power of two) will instead be mapped to the first few PGs again. 

Let us now look at two simple scenarios: a pool with either 1000 or 1024 PGs.

With 1024 (210) PGs, this is all easy - we have a straightforward bitmask of _0b111111111_ that we can apply consistently and evenly, resulting in PG numbers from 0 through 1023.

With 1000 PGs only (which is a very close number and might appeal to someone thinking in metric), only the first 1000 of those PGs can be mapped directly via the bitmask; the remaining “hypothetical” 24 PGs (1000 through 1023) will be masked using one bit less (as if the pool only had 512 PGs configured) to ensure the number fits within pg\_num. This maps them to PGs 488 through 511 again - these 24 PGs thus receive twice the amount of data.

(Short cut: given a _pg\_num_ one below a power of two, only one PG will be “large”; for just one above a power of two, the outlier will be a half-sized PG. If one picked a _pg\_num_ exactly in the middle between _2^n_ and _2^(n+1)_, a third of PGs will be doubled.)

These outlier PGs cannot be perfectly distributed to OSDs (unless they, times the pool’s size, were an integer multiple of the OSD count). Since hashes are rarely perfect, there are only (relatively) few of these outliers, and the pseudo-random distribution is further constrained in its choices - the replica have to be placed on different nodes, for example - there is a high chance that an OSD will be assigned several of them (or none).

The probability math is non-trivial and beyond the scope of this blog, but we have observed significant data imbalance (in the two-digit percent range) in Ceph clusters due to this, in particular for pools with few OSDs/nodes or with large size values (as with Erasure Coding mentioned above, which increases the impact).

### Why does Ceph allow this problem?

At this stage, one might wonder why Ceph allows _pg\_num_ to be set to values that are not powers of two at all. And the reason is that we want to be able to go from one recommended _pg\_num_ value to another in response to actual cluster utilization. (Prior to Nautilus, this meant only increasing _pg\_num_, but since then we can also handle decrease.)

If this was done by immediately setting pg\_num to the new value of either _2x_ or _0.5x_, every PG would be immediately affected; either by being cut in half, or being doubled. By adjusting _pg\_num_ in smaller increments, the load on the cluster caused by the split or merge can be limited and the imbalance then is only transitionary.

And if Ceph simply distributed objects perfectly evenly, objects from each PG would be moved. Again, this would affect every single OSD in the cluster.

However, it was assumed this would indeed be temporary; and our analysis of telemetry data showed that this was apparently a permanent state for some clusters and pools!

## Steps we took in response

It became clear to us that we needed to more strongly discourage the use of such values, and instead shift the clusters out there towards optimal values to improve our user’s experience.

### Documentation refinement

Our documentation is being updated to state clearly that _pg\_num_ must be a power of two at the end, and that other values should only be temporary. The examples that were presented using different values [were corrected](https://github.com/ceph/ceph/pull/29364).

### Removing the manual setting entirely

Manually setting _pg\_num_ exposes an implementation detail of Ceph’s algorithms. It depends on how much data will be stored in a pool and how many OSDs there will be once a cluster is build out. In previous releases, since _pg\_num_ could only be increased, Ceph was unable to dynamically adapt to how the cluster was utilized, requiring aids such as [pg\_calc](https://ceph.io/pgcalc/) and manually setting this ahead of time based on the intended workload.

With [Ceph’s Nautilus release](https://ceph.com/rados/new-in-nautilus-pg-merging-and-autotuning/), a new manager module “_pg\_autoscaler_” has been added that can both warn about sub-optimal _pg\_num_ choices as well as fully automatically adjusting the setting on a per-pool basis. This new module will be enabled by default in the next major release, but we strongly suggest enabling it today at least in warn mode to be made aware of issues.

### Dashboard pool management

In Ceph’s Dashboard, we [automatically adjust](https://github.com/ceph/ceph/blob/master/src/pybind/mgr/dashboard/frontend/src/app/ceph/pool/pool-form/pool-form.component.ts#L253) the user-provided _pg\_num_ to the nearest power-of-two value. If we enable other values, we will recommend they only be used to transition, in case the user wishes to do so manually. We will also work on suggesting to users to enable both the _balancer_ and the _pg\_autoscaler_ module.

## Conclusion

Even though it is very early in the life of Ceph’s telemetry capabilities, already these insights on how Ceph is deployed and configured have contributed directly to improving our documentation, suggesting new features, and informing development decisions on default settings.

As we evolve the telemetry functionality, the data will allow us to answer more and more sophisticated questions - ranging from the adoption rate of new Ceph versions and understanding the reasons why some clusters might delay this step, which platforms and features are particularly relevant to test, and eventually even spotting subtle performance regressions that may not show up in our own testing but in production deployments.

And, last but not least, showing the Ceph contributor community that our work helps solve real world needs of our users.

## Next steps

If you are operating a Ceph cluster that supports it, please consider [enabling the telemetry module](https://docs.ceph.com/docs/master/mgr/telemetry/) and contributing to our data corpus! If you have suggestions or questions what we should investigate or about the data shared, please [join the discussion](https://lists.ceph.io/postorius/lists/ceph-users.ceph.io/).
