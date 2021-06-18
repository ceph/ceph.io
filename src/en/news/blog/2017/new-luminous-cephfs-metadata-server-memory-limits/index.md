---
title: "New in Luminous: CephFS metadata server memory limits"
date: "2017-10-10"
author: "batrick"
tags: 
  - "cephfs"
  - "luminous"
---

The Ceph file system uses a cluster of metadata servers to provide an authoritative cache for the CephFS metadata stored in RADOS. The most basic reason for this is to maintain a hot set of metadata in memory without talking to the metadata pool in RADOS. Another important reason is to allow clients to also safely cache metadata by obtaining capabilities from authoritative MDSs without introducing inconsistency across multiple client caches. In other words, a client obtains guarantees from metadata servers that its cache will be consistent as long as it holds the capability (which may be recalled by the MDS in the future).

Prior to Luminous, a Metadata Server (MDS) would necessarily limit the size of its cache by the operator setting the [_mds cache size_ config setting](http://docs.ceph.com/docs/jewel/cephfs/mds-config-ref/). This would set a soft limit for the number of inodes the MDS would hold in its cache. When this limit is exceeded, the MDS would begin recalling capabilities from the clients. Each client would then attempt to trim their respective caches in order to release the capabilities. Once all the capabilities for an MDS cached object are recalled, the MDS may trim the object from its own cache.

There are a few issues with this design:

- An inode limit is a poor proxy for memory usage which is what we actually want to limit. There are other types of metadata objects which are cached  including directory metadata and directory entries (dentries) which are not accounted for. So certain file system hierarchies may use more RAM than others.
- The operator must attempt to learn the memory usage given a certain inode limit. In the past, we have suggested 100k inodes per 1GB of RAM.

### Changes in Luminous

In [Luminous (12.2.1)](http://ceph.com/releases/v12-2-1-luminous-released/), the MDS cache is now managed within memory pools which allows tracking allocations. Along with this change, we’ve added new cache limits by memory usage which (by default) supersede the old inode count limits:

- **mds cache memory limit** The soft memory limit (in bytes) the MDS should enforce for its cache. Administrators should use this instead of mds cache size. Type:  64-bit Integer Unsigned Default: 1 GB
- **mds cache reservation** The cache reservation (memory or inodes) for the MDS cache to maintain. Once the MDS begins dipping into its reservation, it will recall client state until its cache size shrinks to restore the reservation. Type:  Float Default: 0.05

By default, the cache memory limit for an MDS is 1GB. The old mds cache size limit (the inode limit) still functions but is now 0 by default, indicating no inode limit.

The new config option _mds cache reservation_ indicates a reservation of memory to maintain for future use. By default, this reservation is 5% of the memory (or inode) limit. Once the MDS begins dipping into its reservation, it will begin recalling capabilities from clients.

Like _mds cache size_, the _mds cache memory limit_ is a soft limit. Because misbehaving applications or buggy clients may not relinquish their capabilities, it is sometimes necessary for the MDS to exceed its cache size in order to allow the cluster to continue operating. The _mds health cache threshold_ config option allows the operator to set the multiple of the _mds cache memory limit_ (default 1.5) where the MDS begins sending cluster health warning messages (MDS\_CACHE\_OVERSIZED) informing you that the cache is too large.

### See it in action

Observing the new limit in action is a simple exercise of filling the MDS cache with metadata. We’ll look at a test cluster with 1 active MDS, _mds.a_:

> $ ceph status
>   cluster:
>     id: 7c30394b-edf4-4193-b441-7ffcdb33a411
>     health: HEALTH\_OK
>  
>   services:
>     mon: 3 daemons, quorum a,b,c
>     mgr: x(active)
>     mds: cephfs\_a-1/1/1 up  {0=a=up:active}, 2 up:standby

We set a 20MB memory limit to see the results quickly:

> $ ceph daemon mds.a config get mds\_cache\_memory\_limit
> {“mds\_cache\_memory\_limit": "20971520"}

Now copy in some files to begin building up the MDS cache:

> $ cp -av /usr/include/ /mnt/cephfs &

And finally observe the MDS cache:

> $ while sleep 1; do ceph daemon mds.a perf dump | jq '.mds\_mem.rss'; ceph daemon mds.a dump\_mempools | jq -c '.mds\_co'; done
> 26436
> {"items":143,"bytes":38296}
> 26436
> {"items":143,"bytes":38296}
> 26420
> {"items":147,"bytes":38456}
> 26420
> ...
> 83300
> {"items":104082,"bytes":19102080}
> 83300
> {"items":105234,"bytes":19418768}
> 83300
> {"items":107092,"bytes":19653712}
> 79752
> {"items":108748,"bytes":19988144}
> 79752
> {"items":110238,"bytes":20311504}
> 92412
> {"items":111258,"bytes":20577632}
> 92412
> {"items":114742,"bytes":21102672}
> 92412
> {"items":106456,"bytes":19662976}
> 85088
> {"items":95473,"bytes":17542536}

We can see the MDS recalls state when the number of bytes allocated to cached objects (“_.mds\_co_” in the mempool statistics) reaches around 19MB. The client begins releasing its capabilities and the MDS finally trims its cache down to 17MB.

### Conclusions

With each release of Ceph, CephFS continues to get easier to setup and use. This change resolves a recurring request from the community to make deploying and administrating MDSs easier. Please continue to give us feedback on how to improve CephFS and enjoy!
