---
title: "More Than an Object Store"
date: "2012-10-02"
author: "rturk"
tags: 
---

Today, Dmitry Ukov wrote a great post on the Mirantis Blog entitled [Object Storage approaches for OpenStack Cloud: Understanding Swift and Ceph](http://www.mirantis.com/blog/object-storage-openstack-cloud-swift-ceph/trackback/). Dmitry’s overview on Ceph was a solid introduction to those needing an object store for their OpenStack deployment, and it was an interesting read. Thanks, Dmitry!

Naturally, since I spend most of my days thinking about [Ceph](http://ceph.com), I couldn’t resist going a bit deeper with a few of Dmitry’s ideas. Here we go:

### Ceph is More Than Just An Object Store

Ceph is a great object store. If you strip it down to its bare minimum, that’s what it is. Comparing the entire Ceph platform with Swift is apples and oranges, though, since Ceph can be much **more** than just an object store. Bonus points to the first person who writes a jingle that best accompanies that last part there.

The Ceph Object Store (also called RADOS), is a collection of two kinds of services: object storage daemons (ceph-osd) and monitors (ceph-mon). The monitors’ primary function is to keep track of which nodes are operational at any given time, while the OSDs perform actual data storage/retrieval operations. A cluster can have between a handful and thousands of OSDs, but only a small number of monitors – usually 3, 5, or 7 – are enough for most clusters. There’s a client library, [librados](http://ceph.com/docs/master/api/librados/), that allows apps to store and retrieve objects.

The [RADOS gateway](http://ceph.com/docs/master/radosgw/) (radosgw) is a separate daemon that runs on top of RADOS and provides a REST-based object storage API. This is what allows Ceph to work with applications that were written for S3 or Swift. It’s not nearly as efficient or capable as librados (which it consumes), but it’s a lot simpler.

The [RADOS Block Device](http://ceph.com/docs/master/rbd/rbd/) allows users to create virtual disks inside the Ceph Object Store and mount them with a Linux kernel module or boot a VM from them.  It requires no additional server-side components at all (although it’s still really neat and totally useful).

The Ceph Metadata Server (ceph-mds) is required for Ceph to behave like a shared filesystem, and it’s responsible for maintaining the directory hierarchy, file metadata, and all of the locking and permissions stuff that you need to manage simultaneous access. It’s also designed to scale out (though it still needs tons of testing), and we believe it can avoid the centralized metadata challenge that has plagued many distributed filesystems.

[![](images/ceph-arch-overview1.png "Ceph Architectural Overview")](http://ceph.com/wp-content/uploads/2012/10/ceph-arch-overview1.png)

Because most of Ceph’s services have been built, more or less, as applications running on top of the Ceph Object Store, we tend to think of Ceph as a unified platform instead of just a distributed filesystem or object store. Who knows – one day someone may build a relational database, a mail system, or a trendy new picture sharing site on top of it.

### Running Only The Components You Need

Because of the way Ceph was built, you don’t always need to deploy every component. For example, you don’t need to run the Metadata Server unless you’re planning to use Ceph’s shared filesystem. Same goes for radosgw: you only need it when you want your cluster to speak REST.

If your app only needs to use the Ceph Object Store via librados, you just need OSDs and monitors. If you need REST-based object storage, though, you need the RADOS Gateway. If you need a shared filesystem, run the Metadata Server. But run them only if you need them.

This clear separation of functions (and the ability to turn entire parts of the platform off) is one of the benefits of an architecture that was designed to scale without tons of interdependency.

### CRUSH is Cool Enough to Write Lots of Words About

Dmitry didn’t say much about CRUSH, which is kind of a bummer because – above all else – CRUSH is what makes Ceph different. CRUSH is an acronym, meaning “Controlled Replication Under Scalable Hashing”.

If you had to build a hotel with a million rooms, how many front desk counters do you think you’d need? Can you make a massive hotel by just scaling up all of the components of a small hotel? No, you’d have to [think about hotels](http://www.youtube.com/watch?v=xRCEHI2pStI) in an entirely new way. That’s what CRUSH does for data placement. It’s a totally different approach.

Data placement in a cluster is traditionally accomplished in one of three ways:

1. The client keeps track of where it puts stuff
2. There’s a cluster service somewhere that keeps track of where everything is
3. The client **calculates** where things belong

Dmitry described CRUSH as “an algorithm that can look up the physical location of data in Ceph, given the object name as input”, which is the right idea but it’s not completely accurate. The first important thing to know about CRUSH is that it doesn’t look anything up, it calculates it. When a client wants to access an object stored in the cluster, it uses the CRUSH algorithm to calculate where it lives. That location isn’t stored anywhere, making the difficult-to-scale, centralized recording of data placement unnecessary.

The second important thing to know about CRUSH (and the part that makes it a totally different approach) is that you don’t only pass the object name as input. You pass it three things:

1. The object (or, more accurately, the [placement group](http://ceph.com/docs/master/cluster-ops/placement-groups/)…but now we’re getting picky)
2. A cluster map, containing the latest known state of the cluster
3. A [crush map](http://ceph.com/docs/master/cluster-ops/crush-map/), containing a set of data placement policies

CRUSH is repeatable, which means that calling it twice with the same inputs will yield the same results. That’s why it’s essential that CRUSH has the latest cluster map: when the cluster changes, CRUSH’s results must change too. In the event of any change, the OSDs work together to reposition data accordingly (although it moves as little data as possible: if you lose one drive out of a hundred, for example, 1% of the data has to move).

CRUSH is configurable via the crush map, which allows you to specify how many replicas are required, define failure domains, and adjust weighting. For example, a crush map lets you specify that you want four replicas of each object with two in the same rack and the other two in rows of their own.

You can read more about CRUSH in all of its scholarly glory here: [CRUSH: Controlled, Scalable, Decentralized Placement of Replicated Data](http://ceph.newdream.net/papers/weil-crush-sc06.pdf)

Once again, I’d like to thank Dmitry for starting such an interesting conversation. Comments and questions are welcome. Encouraged, even!

