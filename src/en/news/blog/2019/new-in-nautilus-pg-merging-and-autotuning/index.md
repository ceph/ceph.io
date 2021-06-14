---
title: "New in Nautilus: PG merging and autotuning"
date: "2019-04-05"
author: "sage"
tags: 
  - "nautilus"
---

Since the beginning, choosing and tuning the PG count in Ceph has been one of the more frustrating parts of managing a Ceph cluster.  Guidance for choosing an appropriate pool is confusing, inconsistent between sources, and frequently surrounded by caveats and exceptions.  And most importantly, if a bad value is chosen, it can't always be corrected, and performance and/or stability can suffer.  The key limitation in Ceph versions prior to Nautilus is that the _pg\_num_ value can always be increased if the value is too  small, but it can't be decreased if it is too high.

No more!  In Nautilus, a pool's _pg\_num_ value can be decreased.  And, more importantly, a **pg autotuner** can be enabled that allows the system to make any appropriate adjustments automatically so that a user can completely ignore the former black art of _pg\_num_ tuning.

## What are PGs, anyway?

Data objects stored in RADOS, Ceph's underlying storage layer, are grouped into logical **pools**.  Pools have properties like replication factor, erasure code scheme, and possibly rules to place data on HDDs or SSDs only.  Internally, pools are broken into _pg\_num_ placement groups, or PGs, based on a hash of the names of objects stored in the pool.  Each placement group is thus a pseudo-random slice, shard, or fragment of the overall pool, and all objects in a particular PG are grouped and stored together on the same set of storage devices (OSDs).

Small pools with very few objects only need a few PGs.  Large pools--for example, those containing the bulk of the data stored in the cluster--need lots of PGs to ensure that the data is spread around across lots of devices, both to balance space utilization across all OSDs, and to provide good parallelism when the system is under load.  Too few PGs will bottleneck performance on a small number of storage devices, and too many PGs can make Ceph behave inefficiently--and, in extreme cases, unstably--due to the internal tracking that is needed for managing each PG.

The standard rule of thumb is that we want about 100 PGs per OSD, but figuring out how many PGs that means for each pool in the system--while taking factors like replication and erasure codes into consideration--is can be a challenge.

## PG splitting and merging

Ceph has supported PG "splitting" since 2012, enabling existing PGs to "split" their contents into many smaller PGs, increasing the total number of PGs for a pool.  This allows a cluster that starts small and then grows to scale over time.  Starting in Nautilus, we can now also "merge" two existing PGs into one larger PG, allowing the total number of PGs to be reduced.  This is useful if the relative amount of data in a pool decreases over time such that fewer PGs are needed or appropriate, if the overall cluster shrinks, or if the initial number of PGs chosen was too large.

PG splitting when the number of PGs is increased has traditionally been done all in one go.  For example, to adjust a pool's _pg\_num_ value from 16 to 64, one can simply

> $ ceph osd pool set foo pg\_num 64

and the cluster will split each of the 16 PGs into 4 pieces all at once. Previously, a second step would also be necessary to adjust the _placement_ of those new PGs as well so that they would be stored on new devices:

> $ ceph osd pool set foo pgp\_num 64

This is the expensive part where actual data is moved.  Starting in Nautilus, this second step is no longer necessary: as long as _pgp\_num_ and _pg\_num_ currently match, _pgp\_num_ will automatically track any _pg\_num_ changes.  More importantly, the adjustment of _pgp\_num_ to migrate data and (eventually) converge to _pg\_num_ is done gradually to limit the data migration load on the system based on the new _target\_max\_misplaced\_ratio_ config option (which defaults to .05, or 5%).  That is, by default, Ceph will try to have no more than 5% of the data in a "misplaced" state and queued for migration, limiting the impact on client workloads.

PG merging works similarly to splitting, except that internally the _pg\_num_ value is always decreased a single PG at a time.  Merging is a more complicated and delicate process that requires IO to the PG to be paused for a few seconds, and doing merges a single PG at a time allows the system to both minimize the impact and simplify the overall complexity of the process.  When the foo pool's _pg\_num_ is reduced with a command like the one below, an internal _pg\_num\_target_ value is set indicating the desired value for _pg\_num__,_ and the cluster works to slowly converge on that value.  For example, to reduce the pool foo's PGs from 64 down to 4,

> $ ceph osd pool set foo pg\_num 4
> $ ceph osd pool ls detail | grep foo
> pool 1 'foo' replicated size 3 min\_size 2 crush\_rule 0 object\_hash rjenkins pg\_num 63 pgp\_num 62 pg\_num\_target 4 **pgp\_num\_target 4** autoscale\_mode warn last\_change 391 lfor 0/391/389 flags hashpspool stripe\_width 0

## PG auto-scaler

The ability to adjust the _pg\_num_ value is a critical step forward, but it doesn't address the problem of PG tuning seeming like black magic to most users.  Nautilus includes a new manager module called _pg\_autoscaler_ that allows the cluster to consider the amount of data actually stored (or expected to be stored) in each pool and choose appropriate _pg\_num_ values automatically.

Because the autoscaler is new, it needs to be explicitly enabled in Nautilus:

> $ ceph mgr module enable pg\_autoscaler

The autoscaler is configured on a per-pool basis, and can run in a few modes:

- In **warn** mode, a health warning is issued if the suggested _pg\_num_ value is too different from the current value.  This is the default for new and existing pools.
- In autoscaler **on** mode, the pool _pg\_num_ is adjusted automatically with no need for any administrator interaction.
- The autoscaler can also be turned **off** for any given pool, leaving the administrator to manage _pg\_num_ manually as before.

To enable the autoscale for a particular pool,

> $ ceph osd pool set foo pg\_autoscale\_mode on

Once enabled, the current state of all pools and the proposed adjustments can be queried via the CLI.  For example, on our lab cluster we have:

> $ ceph osd pool autoscale-status
>  POOL                          SIZE  TARGET SIZE  RATE  RAW CAPACITY   RATIO  TARGET RATIO  PG\_NUM  NEW PG\_NUM  AUTOSCALE 
>  device\_health\_metrics       18331k                3.0        431.3T  0.0000                     1              warn      
>  default.rgw.buckets.non-ec      0                 3.0        431.3T  0.0000                     8              warn      
>  default.rgw.meta             2410                 3.0        431.3T  0.0000                     8              warn      
>  default.rgw.buckets.index   38637k                3.0        431.3T  0.0000                     8              warn      
>  default.rgw.control             0                 3.0        431.3T  0.0000                     8              warn      
>  default.rgw.buckets.data    743.5G                3.0        431.3T  0.0050                    32              on        
>  .rgw.root                    1113                 3.0        431.3T  0.0000                     8              warn      
>  djf\_tmp                      1169G                3.0        431.3T  0.0079                  4096          32  off       
>  libvirt-pool                 2048M                3.0        431.3T  0.0000                  3000           4  off       
>  data                        66692G                3.0        431.3T  0.4529                  4096              warn      
>  default.rgw.log              8146k                3.0        431.3T  0.0000                     8              warn      
>  metadata                    54050M                4.0        431.3T  0.0005                    64           4  off

You'll note that the bulk of the data is in the 'metadata' and 'data' pools for the CephFS that stores all of our QA results.  Most of the other pools are left over from various tests and (mostly) empty.

Let's look at each column:

- The **SIZE** column simply reports the total amount of data (in bytes) stored in the pool.  This includes both object data and omap key/value data.
- **TARGET SIZE** reports any administrator input as to the _expected_ size of the pool.  If a pool has just been created it will initially store no data, but the administrator generally has some sense of how much data will eventually be stored.  If provided, this the larger of this value or the actual size is used to calculate the pool's ideal number of PGs.
- The **RATE** value is the ratio of raw storage consumption to user data stored, and is simply the replication factor for replicated buckets or a (typically) smaller ratio for erasure coded pools.
- **RAW CAPACITY** is the raw storage capacity on the storage devices the pool is mapped to by CRUSH.
- **RATIO** is the ratio of that total storage that is consumed by the pool.
- The **TARGET RATIO** is a administrator-provided value, similar to TARGET SIZE, indicating what fraction of the total cluster's storage the user expects the pool to consume.
- Finally, **PG\_NUM** is the current number of PGs for the pool, and **NEW PG\_NUM** (if present) is the proposed value.
- The **AUTOSCALE** column indicates the mode for the pool, either _off_, _warn_, or _on**.**_

The proposed value takes several inputs into consideration, including the fraction of the overall cluster a pool consumes (or is expected to consume), which OSDs the pool is distributed across, and the target number of PGs for each OSD (as defined by the _mon\_target\_pg\_per\_osd_ config option, which defaults to 100).  The autoscaler will always select a _pg\_num_ value that is a power of two, as this is somewhat more efficient for Ceph (it means that all PGs in the same pool are approximately the same size), and it will only propose a change in _pg\_num_ if its suggested value is more than three times the actual value.  This means that, in most cases, a growing pool's _pg\_num_ value will jump by a factor of 4 each time it changes, and will tend to stick with the same value unless there is a pretty significant change in its size.

When a cluster is first set up, it is generally helpful to set the target ratio for pools so that the autoscaler can make good initial decisions.  For example, if the primary use of the cluster is for block storage, you might set the target ratio for the rbd pool to .8 and enable PG auto-scaling:

> $ ceph osd pool create foo 1
> $ rbd pool init foo
> $ ceph osd pool set foo target\_size\_ratio .8
> $ ceph osd pool set foo pg\_autoscale\_mode on

At this point the cluster will select a _pg\_num_ on its own and apply it in the background.

You can control what _pg\_autoscale\_mode_ is used for newly created pools with

> $ ceph config set global osd\_pool\_default\_autoscale\_mode &lt;mode&gt;

## Can I go completely hands-off?

Yes.  If you enable auto-scaling for new pools and enable it on existing pools, then the system will scale PGs up as data is stored in the cluster.

The only problem with this approach is that adjusting the PG count after data is stored moves data around in the cluster, which is expensive.  As a rule of thumb, if an empty pool is created and then filled to consume all of the cluster's available space, then all data that is written will end up moving approximately once after it is written.  This isn't ideal--you're better off providing a _target ratio_ or _target bytes_ value when creating a pool so that an appropriate initial PG count is chosen--but the overhead of ignorance is at least bounded and reasonable.

## What's next?

Automating the management of placement groups is a big step forward in making Ceph easier to deploy and operate for non-experts.  In the near future, expect to see the _pg\_autoscaler_ module enabled by default, once we have more user feedback and (hopefully) better confidence that the recommendations that it is making are correct.  In the first Nautilus point release, for example, we are already making some adjustments to metadata-heavy pools (like CephFS metadata and RGW bucket index pools) to allocate them a larger number of PGs for performance reasons.

We're eager to get feedback on this new capability!  Please let us know what you think via the email list, IRC, or even in person at [Cephalocon in Barcelona next month](https://ceph.com/cephalocon/barcelona-2019/)!

And, of course, we will be looking for other areas where Ceph tuning and management is confusing and continue working to add automation in those areas as well.

For more information, refer to the documentation around [Placement Groups](http://docs.ceph.com/docs/master/rados/operations/placement-groups/), which has more details about the auto-scaling behavior.
