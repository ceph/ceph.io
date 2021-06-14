---
title: "The Schrodinger Ceph cluster"
date: "2017-04-04"
author: "admin"
tags: 
  - "planet"
---

Inspired by Schrodinger’s famous thought experiment, this is the the story of a Ceph cluster that was both full and empty until reality kicked in.

### The cluster

Let’s imagine a small 3 servers cluster. All servers are identical and contain 10x 2 TB hard drives. All Ceph pools are **triple replicated on three different hosts**.

The total capacity of the cluster is 60 TB raw and 20 TB usable. All is well.

### The increase

After some time you need more capacity and decide to add a new node, but this time with 10x 6 TB drives. The anticipated capacity is then 120 TB raw and 40 TB usable.

After the installation `ceph status` reports the expected raw capacity of 120 TB.

```
 health HEALTH_OK
[...]
 osdmap e10: 40 osds: 40 up, 40 in
  pgmap v20: 256 pgs, 2 pools, 30 TB data, 1000 objects
        30 TB used, 90 TB / 120 TB avail
```

### The problem

The problem with this setup is that the **usable capacity is lower than expected**. If you would try to fill the pool with data you would notice that the maximum usable capacity of this cluster is 30TB, that’s **10 TB lower than anticipated**: simply because of triple replication.

The table below shows the space usage when you try to to fill this cluster.

| Server | Disks | % of Total | Used |  Available |
| --- | --- | --- | --- | --- |
| ceph1 | 10x2TB | 16.7% | 20 TB | 0 TB |
| ceph2 | 10x2TB | 16.7% | 20 TB | 0 TB |
| ceph3 | 10x2TB | 16.7% | 20 TB | 0 TB |
| ceph4 | 10x6TB | 50% | 30 TB | 30 TB |

In this situation you see that the last node (ceph4) still has 30 TB raw available: that’s the missing 10 TB usable. Since all other nodes (ceph1-3) are full, there is nowhere to store the additional copies required by the storage policy (3 copies on 3 different hosts), so that space is not usable for a triple replication pool.

### The solutions

This is happening when using replication with N copies (N=3 in this example) and a single node is responsible for more than 1/N (33% in this example) of the overall cluster capacity.

#### Theoretical solution

Some would say:

> Just use N=1, then you would be guaranteed that no node will be responsible for more than 100% of the cluster capacity

That’s right, but in practice that would disable the data protection (1 copy = no replication), so definitly not what we want.

#### Equilibrate the cluster

The most practical way to address this is to equilibrate the servers. We can swap half of the 2TB drives in ceph3 with half of the 6 TB drives in ceph4.

| Server | 2 TB drive |  6 TB drive | % of Total |
| --- | --- | --- | --- |
| ceph1 | 10 | 0 | 16.7% |
| ceph2 | 10 | 0 | 16.7% |
| ceph3 | 5 | 5 | 33% |
| ceph4 | 5 | 5 | 33% |

I recommend you to first update the CRUSHmap, this will start the data re-balancing and will make the new space available quickly, but will relax your storage policy (3 copies on 2 different servers) until you also swap the disks physically.

```
# Move 5x2TB OSDs to ceph4
for i in {20..25}
do
  ceph osd crush set osd.$i 2.0 root=default host=ceph4
done
# Move 5x6TB OSDs to ceph3
for i in {30..35}
do
  ceph osd crush set osd.$i 6.0 root=default host=ceph3
done
```

Source: Maxime Guyot ([The Schrodinger Ceph cluster](http://www.root314.com/ceph/2017/04/05/schrodinger-ceph-cluster/))
