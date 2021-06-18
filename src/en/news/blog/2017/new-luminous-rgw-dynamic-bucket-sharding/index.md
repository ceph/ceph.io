---
title: "New in Luminous: RGW dynamic bucket sharding"
date: "2017-09-01"
author: "yehuda"
tags: 
  - "luminous"
  - "rgw"
---

Luminous features a new RGW capability to automatically manage the sharding of RGW bucket index objects. This completely automates management of RGW's internal index objects, something that until now Ceph administrators had to pay close attention to in order to prevent users with very large buckets from causing performance and reliability problems.

### Background

One of the most important design requirements when we deal with Ceph features is that everything should be able to scale. Ceph has been built from the ground up to allow horizontal scaling, and every feature that we add needs to conform to this property. This philosophy was used when we designed all the internal Ceph components (mon, osd, mds, rgw, etc.): when running out of resources, it should always be possible to add more hardware where new daemons can be spawned so that the overall cluster performance increases.

One property of RADOS (Ceph's underlying object store) is that it doesn't keep an index for all of the objects in the system. Instead, it leverages the CRUSH algorithm to calculate the location of any object based on its name, cluster configuration, and cluster state. This is a scalability enabler: the overall IO capacity can scale with the number of OSDs in the system since there aren't any metadata servers or lookups that need to be used for these IO operations. The RADOS gateway (RGW), which provides an S3-compatible object storage service on top of RADOS, leverages this property, and indeed, when accessing RGW objects there is no need to touch any index.

However, RGW still maintains an index per bucket, in which it holds a list and metadata of all the objects it contains. This is needed since RGW needs to be able to provide this data when requested (for example, when listing RGW bucket contents), and RADOS itself does not provide an efficient listing capability. This bucket index is also being used for other tasks, like maintaining a journal for versioned operations, bucket quota metadata, and a log for multi-zone synchronization. The bucket index does not affect read operations on objects, but it does add extra operations when writing and modifying RGW objects.

The implications of this are twofold. First, there is a limited amount of data that we can store on a single bucket index object. The RADOS object key-value interface that we use for the bucket index is not unlimited, and and only a single RADOS inex object per bucket is used by default. A very large index object can lead to performance and reliability problems, in extreme cases even taking down OSDs due to slow recovery operations. The second issue is that it ends up being a performance bottleneck, as all writes to a bucket end up modifying and serializing around a single RADOS object.

A **bucket sharding** feature was introduced in Hammer to deal with large buckets. Every bucket index could now be spread across multiple RADOS objects, allowing the number of objects that a bucket can hold to scale with the number of index objects (_shards_). However, this was only applicable to newly created buckets, and required some pre-planning and foreknowledge of the eventual bucket capacity. We added a **bucket resharding** administrator command (originally in Kraken, but backported to Jewel and Hammer) which allowed modifying the number of bucket index shards for a bucket to alleviate this.  However, resharding was typically done after the fact, when the bucket index already showed problematic symptoms (or otherwise got the attention of an administrator), and it required the quiescing of writes to the bucket during the resharding process (which was not always convenient or possible).

### Dynamic bucket resharding

Luminous finally introduces a **dynamic bucket resharding** capability. Bucket indexes will now reshard automatically as the number of objects in the bucket grows. Furthermore, there is no need to stop IO operations that go to the bucket (although some concurrent operations may experience additional latency when resharding is in progress). The radosgw process automatically identifies buckets that need to be resharded (if number of the objects per shard is loo large), and schedules a resharding for these buckets. A special thread is responsible for processing the scheduled reshard operations.

### Configuration

The feature itself is enabled by default; no action is needed and administrators should no longer have to worry about this implementation detail.

Resharding can be disabled via the '_rgw dynamic resharding_' by setting it to _false_ (default is true). The number of objects per shards can be controlled with '_rgw max objs per shard_' (which defaults to 100k). The reshard thread period can be configured through the '_rgw reshard thread interval_' option (which defaults to 10 minutes).

There are few new _radosgw-admin_ commands that can be used to monitor and control on-going resharding:

- Manually schedule a resharding of a bucket:

> $ radosgw-admin reshard add --bucket=<bucket> --num-shards=<num\_shards>

- List scheduled bucket reshards:

> $ radosgw-admin reshard list

- Manually process scheduled reshards:

> $ radosgw-admin reshard process

- Cancel a scheduled reshard:

> $ radosgw-admin reshard cancel --bucket=<bucket>

### Conclusion

Internal sharding of indexes is not something users should worry about, and finally that is now the case with RGW in Luminous.  This capability is the result of one of many efforts underway to improve the simplicity, ease of use, and automated management of Ceph.
