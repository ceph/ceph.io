---
title: "New in Luminous: PG overdose protection"
date: "2017-10-25"
author: "sage"
tags: 
  - "luminous"
---

Choosing the right number of PGs ("placement groups") for your cluster is a bit of black art--and a usability nightmare.  Getting a reasonable value can have a big impact on a cluster's performance and reliability, both in a good way and a bad way.  Unfortunately, over the past few years we've seen our share of the bad ways.  In Luminous we've taken major steps to finally eliminate one of the most common ways to drive your cluster into a ditch, and looking forward we aim to eventually hide PGs entirely so that they are not something most users will ever have to know or think about.

### Background

Objects in RADOS are stored in logical pools.  Each pool is sharded into _pg\_num_ placement groups (PGs), so that each PG contains some fragment of the overall pool's objects.  If it is a replicated PG, you'll get identical copies of those objects on each OSD that CRUSH decides the PGs should be mapped to.  If it's an erasure coded pool, each PG instance contains a different shard of each object in the PG, such that object's content can be reconstructed from _k_ out of the _k+m_ PG instances.  Thus, if you have a 3x replicated pool with 128 PGs, you will have 384 PG instances spread across however many OSDs you have.  If it were a 8+3 erasure pool it would be 1408 PG instances.

PGs serve two main purposes:

1. Data distribution.  In particular, if a single OSD fails, the other copies of the PGs it stores are spread across lots of other OSDs, such that when the cluster repairs itself the work is parallelized across lots of sources and targets across the cluster, reducing the recovery time and impact.
2. Parallelism within the OSD.  Inside each OSD, we use the PGs to shard work to allow parallelism across cores and reduce lock contention.

The rule of thumb is that you want somewhere around 100 PG instances per OSD.  If you have way less than that the load distribution won't be as balanced (some OSDs will store more than others), and if you have too many more than that then each OSD will be coordinating with too many other OSDs, increasing overhead and reducing overall reliability.

### Changing pg\_num

The reason why picking a decent PG count is important is that the _pg\_num_ value for a pool can be increased--splitting and migrating existing PGs into smaller pieces--but cannot be decreased.  Splitting is comparatively easy to implement (and has been possible since Bobtail), so if you undershoot the PG count or your cluster grows over time you can fix it.  If you have too many PGs, though, you can't yet merge them back together.  (We are looking at adding this capability, but it is a release or two away.) Also, even though you can split PGs, doing so is a relatively expensive operation.  For example, doubling the PG count will move half of the data in your cluster.

For this reason many operators have chosen to overshoot the recommended PG count with the expectation that the cluster is going to grow.  Until that growth materializes, the cluster will perform suboptimally.  More commonly, operators simply don't have a good idea what value to choose and end up with something that is less than ideal (or make use of an automated deployment tool that makes a bad choice for them).

### Problems with past intervals

Simply having lots of PGs isn't usually problematic on its own. However, if the cluster becomes unhealthy, and especially if it remains unhealthy for an extended period of time, a combination of effects can cause problems.

In order to facilitate correct recovery after OSD failures and/or PG migrations to other OSDs, each PG keeps track of what are called _past intervals_ since the PG was last "clean" or completely healthy.  An interval in this case is a period of time during which the system decided the PG should be stored on a particular set of OSDs.  When a system is "thrashing"--for example, when OSDs are stopping and restarting and stopping again due to a flaky network or unreliable hardware or some misconfiguration--lots of past intervals can be generated in a short period of time, and we have to remember all of them.  If these changes happen quickly, before data actually migrates to the new location(s), the list of past intervals can grow quite large.  If a cluster is unhealthy for an extended period of time (e.g., days or even weeks), the past interval set can become large enough to require a significant amount of memory.  And, if the system is configured with lots of PGs (perhaps more than it should have), the problem gets even worse because past interval sets are maintained for each PG.

In extreme cases the OSD daemons can end up consuming so much memory that they are killed by the kernel.  Then they are restarted automatically by the init system (or an administrator) and the cluster state change generates yet another interval to add to the past intervals set, making the problem just a little bit worse.  The longer this goes on, the deeper the hole that the system has to climb back out of.

### Problems with the "min in" limit

Unlike convention RAID systems, Ceph subscribes to the philosophy that a "standby" device is a wasted device: why not make use of the drive now, and later, when there is a failure, spread the remaining work across the surviving devices?  This generally works beautifully when a small number of devices fail.  Each time an OSD fails, the data is squeezed a bit more onto the remaining OSDs.

Eventually, however, we have to decide that this can't go on indefinitely.  The _mon\_osd\_min\_in\_ratio_ configuration parameter controls the minimum fraction of all OSDs in the system that have to be "in" (i.e., online and actually storing data) in order for another down OSD to be marked "out" and for its data to be re-replicated onto the remaining OSDs.  Until recently this value defaulted to .3, or 30%, which meant that if you started out with a cluster with 100 PGs per OSD, and steadily failed each one, your data would keep collapsing down onto a smaller and smaller set until eventually the surviving 30% of the OSDs would have more than 300 PGs each.

The combination of the above two issues has led several clusters into apparent death spirals where the OSDs were unable to start or recover without various heroic measures by administrators and developers to reduce their memory requirements and nurse them back to health.

### Fixing all of it in Luminous

After seeing this a few times and pulling out the same bag of tricks to get clusters back online it was clear there were several things we could do to prevent this going forward.  First, the easy things:

- We increased the _mon\_osd\_min\_in\_ratio_ to a more **reasonable default** of .75, which means that once 25% of your devices have failed the cluster will stop trying to heal on its own and require some operator intervention.  Of course, you can adjust this to whatever makes sense in your environment.
- We put some **better limits** around the PG counts you could use in a cluster.  There is now a _mon\_max\_pg\_per\_osd_ limit (default: 200) that prevents you from creating new pools or adjusting _pg\_num_ or replica count for existing pools if it pushes you over the configured limit (as determined by dividing the total number of PG instances by the total number of "in" OSDs).  Again, if you really need to, you can increase the limit, but 2x the recommendation seems like a reasonable point to prevent users from making trouble for themselves.

The _real_ problems, though, were the high memory usage for past intervals and the fact that it was possible for the cluster--through whatever sequence of failures or misconfigurations--to try to cram too many PGs onto a single OSD.

### Past intervals memory

One of the main behind-the-scenes refactors leading up to the Luminous release was a rewrite of the past interval tracking.  Previously, we would keep a list all intervals since the PG was last clean, mark which ones could have potentially included writes, and keep that list around (sharing it gratuitously) until the PG was eventually fully "clean" again.  It turns out that knowing the full history of PG locations is a _lot_ more information than we really need, however.  What the PG peering algorithm _actually_ needs to know is which OSDs it needs to contact during peering in order to be certain it has discovered any past updates, and that can be derived from the (roughly speaking) "set of minimal sets" of OSDs that may have processed updates.  When the past intervals tracking structure was rebuilt around exactly the information required, it became extremely compact and relatively insensitive to extended periods of cluster unhealthiness, eliminating the source of memory growth that caused so many problems.  Hooray!

### Hard limit on PGs on each OSD

The other core problem was that any individual OSDs were ever allowed to instantiate more PGs than they could handle.  Because PG mappings are the result of a mathematical calculation in CRUSH, any number of CRUSH or cluster state changes could potentially lead to a situation where CRUSH put too many PGs in one place.  Even if we fixed the "min in" problem above, some other scenario or misconfiguration could potentially lead to too many PGs on one OSD.

In Luminous, we've added a hard limit on the number of PGs that can be instantiated on a single OSD, expressed as _osd\_max\_pg\_per\_osd\_hard\_ratio_, a multiple of the _mon\_max\_pg\_per\_osd_ limit (the limit we mentioned above that prevents you from configuring too many PGs).  If any individual OSD is ever asked to create more PGs than it should it will simply refuse and ignore the request.  The cluster will be partially unavailable if that happens (those PGs won't be able to peer and service IO until the data distribution is corrected), but we will avoid putting the system into a situation where it may have a hard time recovering.  Hopefully an administrator has been alerted and become involved long before this, but in cases of extreme neglect, the system won't dig itself into a hole.

### Conclusion

Hearing about things that used to go wrong but can't anymore isn't as much fun as reading about shiny new features, but we hope it will let users that have experienced some of these issues (or skirted less extreme instances) rest easier.  We certainly sleep much better these days!
