---
title: "CephFS MDS Status Discussion"
date: "2013-03-05"
author: "gfarnum"
tags: 
  - "planet"
---

There have been a lot of questions lately about the current status of the Ceph MDS and when to expect a stable release. Inktank has been having some internal discussions around CephFS release development, and I’d like to share them with you and ask for feedback!

A couple quick notes: first, this blog post is from the perspective of Inktank’s development. We aren’t the [only](https://github.com/ceph/ceph/commit/b7e698a52bf7838f8e37842074c510a6561f165b) ones generating metadata server (MDS) patches, and other parties might make contributions with different priorities! Second, this is a discussion about MDS development — look for a blog about what the MDS does and how it works coming soon!

**Current Status**

Over the past year, we at Inktank have regretfully stepped back from the filesystem — we still believe its feature set and capabilities will revolutionize storage, but we realized it required a lot more work to become a stable product than RBD and RGW, so we focused our efforts on the software we could give to customers. That is still Inktank’s organizational focus, but at the turn of the year something wonderful (for me personally) happened! We created an internal CephFS team and I and Sam Lang have been devoting an increasing amount of our time to work on the MDS and filesystem development. This renewed focus has emphasized what kinds of issues remain. There are a few brave organizations using CephFS in testing or production capacities, but the more important its use is to them the less functionality they rely on. For community members my recommendation has been to test CephFS under your workload for two weeks, inject some failures (node restarts, etc), and if it works through that then it should continue working — some people have run systems for months without issues, but others run into trouble on their second or third command. Basically, if your workload happens to look like one of the test suites we regularly run it should be good — but if it deviates even a little there are hidden traps lying in wait from bugs that we haven’t yet discovered.

Initially our goal was to stabilize the features the filesystem already has and develop fsck, but through recent discussions we realized we hadn’t sat down and figured out what our users and customers actually needed CephFS to do in order to put it into production deployments. More than that, while we’ve viewed CephFS for years as this big ball of awesomeness with features like snapshotting and multiple active servers and unlimited directory sizes, we don’t know which of those features are actually necessary for a first release — and the bugs we’ve been working on have reminded us that some of them require a lot more stability work than others.

Keeping that thought in mind, we’re now starting a discussion with customers, users, and the community at large to discuss what a “[minimum viable product](http://en.wikipedia.org/wiki/Minimum_viable_product)” for CephFS would look like. Our starting point is just what’s easy from a development perspective, and we would welcome feedback from users on if this works for them, or how it would need to change before they could deploy it.

**Minimum Viable Product Proposal**

As we put more engineering resources back into CephFS, we are looking at what we would consider as the minimal useful feature set in order to get CephFS into the hands of production users as soon as possible. We are currently considering it to be a single active MDS, with a maximum number of entries in a single directory, no fsck, and no snapshots. This delivers a POSIX-compliant filesystem that can be mounted on thousands of clients, scales to arbitrarily large data throughputs, allows an unlimited number of files in the hierarchy, is location-aware, and can be used through a number of interfaces (Ganesha NFS, Hadoop, the in-kernel and FUSE-based clients, Samba, etc).

Let me break down what each of those assertions means in more detail.

_Single active MDS_

One of CephFS’ flagship features is its horizontal scalability across very large numbers of metadata server daemons. This will continue to be a flagship feature in the future, but right now it introduces significant system instability so it will not be a part of our initial supported release.

_However_, the standby and active standby features are very stable and will be part of the first release. This means that the fast failover features (30 seconds or much less, depending on user settings, hardware, and tolerance for unnecessary failovers) will function, allowing users to provision as many servers as they wish in case of a hardware failure, or to take over during maintenance.

The primary limits implied by a single-MDS configuration are the number of metadata operations/second the system can handle, the number of simultaneous client connections it can handle, and the amount of metadata the MDS can store in memory. This last provides a limit on how many files can be in use simultaneously with good performance, but _not_ on total number of files in the system (which remains effectively unlimited). As always, the amount of RAM and CPU available to the MDS node will have a dramatic impact on where precisely these limits fall.

Aside: We currently default to 100,000 inodes in the cache, but that is extremely conservative and fits inside the low hundreds of MB of RAM. We don’t yet have recent specific values on memory consumption per inode.

_Maximum number of entries in a single directory_

CephFS includes preliminary support for directory “fragmenting” (or sharding), which allows us to both split up a single directory on-disk and to split it up between multiple MDS servers. Again though, while the code exists it requires a significant amount of validation and debugging, so our first release will not provide support and we will need to limit the total number of entries allowed within a single directory. This is a soft limit open to negotiation — the MDS needs to be able to hold the whole directory in-memory whenever it is read off disk, and if the directory holds more entries than the MDS cache can hold the cache efficiency and overall performance will naturally degrade (and, if more than one directory is in use they will feed back on each other).

However, “manually” sharding directories by splitting them up according to any given heuristic (which splits them finely enough) works just fine, and this limit does not imply a limit on the total number of files in the system. (As long as one considers the maximum amount of active metadata discussed above.)

_No fsck_

As with many distributed systems, CephFS does not currently provide an fsck. Initial design work has been done but not yet implemented. CephFS does of course inherit RADOS’ underlying reliability methods, which include a periodic scrub of the data for consistency between replicas, checksum-based validity checks (upcoming in the Cuttlefish release), and replication of data and recovery when it degrades. Unfortunately this does not completely insure CephFS — objects which are completely lost will translate into file holes, and will not necessarily trigger alarms. Any lost directories in the filesystem hierarchy (which will be detected) must be repaired manually.

On the positive side, due to Ceph’s design, any portions of the hierarchy which have not been damaged will continue to function even if data has been lost.

_No snapshots_

While CephFS has preliminary support for snapshots of directory hierarchies, it too requires significant hardening and debugging. We will not support them in our initial release. When they are released, it will be a pioneering feature among distributed filesystems.

_POSIX-compliant_

CephFS is POSIX-compliant, always has been, and always will be. It provides proper consistency (rather than open-to close as NFS does), and supports even less commonly-used features such as file locking.

Hard links are also supported, although in their current implementation each link requires a small bit of MDS memory and so there is an implied limit based on your available memory. We have designed but not implemented a new solution to avoid this problem.

_Can be used by thousands of clients simultaneously_

In past testing (during Sage Weil’s PhD thesis work), MDS servers have had no trouble handling 1000 clients each, and while we haven’t tested recently we expect that number to have improved rather than degraded.

_Scales to arbitrary data throughputs_

In CephFS, once the client has opened a file, the MDS does not play a further role in the data path. That means that if your clients can send the data, and your OSDs can write the data, the single-MDS limit will not directly impact the aggregate bandwidth available. The implied limits are those based on how much each client can send out and the total number of active files the MDS can handle.

_Allows an unlimited number of files in the hierarchy_

Although there are limits to the size of a single directory as discussed above, Ceph does not require that every file in the system take up MDS memory at all times. This means that unlike many other systems, it does not and never will have a hard limit on the total number of files available.

_Is location aware_

CephFS is built on RADOS, which has a failure domain-based layout engine (which by default naturally maps onto the physical host, rack, row, room layouts of the data center). CephFS allows clients to query this layout data for files and optionally to read from local replicas. Systems which are interested in location awareness will also appreciate the ability to set custom layouts on every file, specifying the underlying object size and pool (which further dictates the the striping strategy in use).

_Many interfaces_

Native ceph clients are available in the upstream Linux kernel and in userspace as both a library and a FUSE module. In addition to the regular interface options available through those standard mechanisms, the library has been integrated into the Ganesha NFS server and Samba; fully integrates with Hadoop; and can be integrated into any custom application.

**Feedback**

As I said, we would love to get your feedback on these ideas. I’m starting a discussion thread on ceph-users as this blog goes up; you can comment here; or you can drop by irc and ping any of us. We’d appreciate any information you can provide!

\-Greg out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/cephfs-mds-status-discussion/&bvt=rss&p=wordpress)
