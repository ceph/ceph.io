---
title: "New in Luminous: CephFS subtree pinning"
date: "2017-10-02"
author: "batrick"
tags: 
  - "cephfs"
  - "luminous"
---

The Ceph file system (CephFS) allows for portions of the file system tree to be carved up into subtrees which can be managed authoritatively by multiple MDS ranks. This empowers the cluster to scale performance with the size and usage of the file system by simply adding more MDS servers into the cluster. Where possible, new subtrees are created and shipped off to an underloaded MDS.

In Luminous, [multiple active metadata servers](http://ceph.com/community/new-luminous-multiple-active-metadata-servers-cephfs/) are considered stable. It is now also possible in Luminous to pin a directory to a particular rank. This allows the operator some freedom in dictating which MDS a subtree may be assigned to and whether it can be split into smaller subtrees.

### Viewing the subtree partitions

You can view the current subtree divisions of the file system by querying the admin socket of each MDS (on the host each MDS is operating on):

> $ ceph fs status
> cephfs - 0 clients
> ========
> +------+--------+-----+---------------+-------+-------+
> | Rank | Stat e | MDS | Activity      | dns   | inos  |
> +------+--------+-----+---------------+-------+-------+
> | 0    | active | b   | Reqs: 0 /s    |     0 |     0 |
> | 1    | active | c   | Reqs: 0 /s    |     0 |     0 |
> | 2    | active | a   | Reqs: 0 /s    |     0 |     0 |
> +------+--------+-----+---------------+-------+-------+
> +-------------------+----------+-------+-------+
> | Pool              | type     | used  | avail |
> +-------------------+----------+-------+-------+
> | cephfs\_metadata   | metadata |  4098 | 9554M |
> | cephfs\_data       | data     |     0 | 9554M |
> +-------------------+----------+-------+-------+
> $ bin/ceph daemon mds.a get subtrees | jq '.\[\] | \[.dir.path, .auth\_first\]'
> \["~mds2", 2\]
> \["", 0\]
> \["/tmp", 2\]

The “” subtree is the root of the file system (“/”) and is always managed by rank 0. The “/tmp” subtree is being managed by rank 2. (A subtree path beginning with “~” is an internal subtree and not part of the file system hierarchy.)

(A word of caution for anyone trying this command at home: please be aware that each MDS does not necessarily have the full picture of the subtree divisions of the file system. An MDS only needs to know the neighboring subtrees for each of its own subtrees. You must run this command on every MDS if you want to perform any kind of analysis on the subtree divisions of the entire file system.)

### Pinning subtrees

The CephFS balancer automatically and dynamically splits or merges subtrees which allows dividing the metadata load across the MDS ranks. However, sometimes the operator may wish to override the balancer by pinning a directory (and its children) to a particular rank. This can be attractive for administrative reasons.

For example, it can prevent a directory from splitting into multiple subtrees and using the resources of multiple MDS servers. Alternatively, if the operator has a priori knowledge of the metadata load to be placed on the cluster, directories can be pinned in a way that evenly divides the work across ranks. This technique was used to evaluate the performance of CephFS with multiple active metadata servers, presented in talks at [Vault 2017](https://vault2017.sched.com/event/9WQp/large-scale-stability-and-performance-of-the-ceph-file-system-patrick-donnelly-red-hat) and a [seminar at CERN](https://indico.cern.ch/event/644915/).

Pinning a directory to a particular rank is done by setting an extended attribute:

> $ setfattr -n ceph.dir.pin -v 2 /mnt/cephfs/tmp

This has the effect of preventing the CephFS directory “/tmp” from being split into smaller subtrees and also pinning “/tmp” to rank 2 (if that rank exists). Once this is done, you may query the rank 2 MDS to see its subtree map:

> $ ceph daemon mds.b get subtrees | jq '.\[\] | \[.dir.path, .auth\_first, .export\_pin\]'
> \["", 0, -1\]
> \["~mds0", 0, -1\]
> \["/tmp", 2, 2\]

Here we can see that “/tmp” has its export\_pin set to 2 and rank 2 is authoritative (auth\_first).

(N.B. a pinned directory is only shipped to its rank if it is not empty.)

### Pin hierarchy

You may also have a hierarchy of pins. This means a child directory can have a pin set which overrides the pin of a parent. So we may have:

> $ setfattr -n ceph.dir.pin -v 0 /mnt/cephfs/users/
> $ setfattr -n ceph.dir.pin -v 1 /mnt/cephfs/users/joe/
> $ ceph daemon mds.b get subtrees | jq '.\[\] | \[.dir.path, .auth\_first, .export\_pin\]'
> \["", 0, -1\]
> \["~mds0", 0, -1\]
> \["/tmp", 2, 2\]
> \["/users/joe", 1, 1\]
> \["/users", 0, 0\]

The “/users” subtree sets a “default” pin for itself and its children (home directories) to rank 0. However, “/users/joe” has a pin to rank 1 which overrides the “/users” pin.

### Future Direction

Early on CephFS [worked to make subtree management and load balancing dynamic](https://dl.acm.org/citation.cfm?id=1049948). This gave CephFS a distinct edge versus other file systems by allowing for scalable metadata partitioning and adaptive load balancing. However, statically dictated subtrees can still be useful for operators to establish a policy keeping a directory tree on a single MDS or splitting load across the cluster in a defined way. In the future, the CephFS team plans to improve the balancer’s behavior so that dynamic subtree partitioning is more consistent and performant, even against “perfect” static partitions with a priori known load patterns.
