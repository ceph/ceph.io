---
title: "The RADOS distributed object store"
date: "2009-05-19"
author: "sage"
tags: 
---

The Ceph architecture can be pretty neatly broken into two key layers.  The first is RADOS, a reliable autonomic distributed object store, which provides an extremely scalable storage service for variably sized objects.  The Ceph file system is built on top of that underlying abstraction: file data is striped over objects, and the MDS (metadata server) cluster provides distributed access to a POSIX file system namespace (directory hierarchy) that’s ultimately backed by more objects.

Until now, RADOS’ only user has been Ceph.  But if the success of Amazon’s S3 (simple storage service) has shown nothing else, it’s that there is ample use (and demand) for a reliable and scalable object-based storage interface.

The underlying storage abstraction provided by RADOS is relatively simple:

- The unit of storage is an **object**.  Each object has a name (currently a fixed-size 20 byte identifier, though that may change), some number of named attributes (i.e., xattrs), and a variable-sized data payload (like a file).
- Objects are stored in object **pools**.  Each pool has a name (e.g. “foo”) and forms a distinct object namespace.  Each pool also has a few parameters that define how the object is stored, namely a replication level (2x, 3x, etc.) and a mapping rule describing how replicas should be distributed across the storage cluster (e.g., each replica in a separate rack).
- The storage cluster consists of some (potentially large) number of storage servers, or **OSD**s (object storage daemons/devices), and the combined cluster can store any number of pools.

A key design feature of RADOS is that the OSDs are able to operate with a relative autonomy when it comes to recovering from failures or migrating data in response to cluster expansion.  By minimizing the role of the central cluster coordinator (actually a small Paxos cluster managing key cluster state), the overall system is extremely scalable.  A small system of a few nodes can seamlessly grow to hundreds or thousands of nodes (or contract again) as needed.

The API provided by librados will be quite simple.  Something along the lines of:

> /\* initialization \*/  
> int rados\_initialize(int argc, const char \*\*argv);  
> void rados\_deinitialize();
> 
> int rados\_open\_pool(const char \*name, rados\_pool\_t \*pool);  
> void rados\_close\_pool(rados\_pool\_t pool);
> 
> int rados\_write(rados\_pool\_t pool, struct ceph\_object \*oid, const char \*buf, off\_t off, size\_t len);  
> int rados\_read(rados\_pool\_t pool, struct ceph\_object \*oid, char \*buf, off\_t off, size\_t len);

An asynchronous I/O interface will also be exposed, as well as a buffering/caching facility (currently in use by the Ceph fuse client) with the ability to selectively flush/invalidate sets of objects (e.g., the set of objects a file is striped over).

What are the benefits of using this sort of interface?  Clearly, anything you can do with objects you can also do with files in a distributed fs (like Ceph): just create a file at /foo/$poolname/$objectname.

- Simplicity — many applications don’t need all of the complexities provided by a POSIX file system.  That, in turn, means an object store can optimize for a much simpler interface and workload
- Scalability — most of the problems with making distributed file systems scale over large numbers of storage nodes are related to the rules imposed by POSIX (case in point: Ceph’s MDS is quite complex).  A simple object abstraction is much more scalable.
- Stability — simple systems are much easier to validate.

One goal is to make applications that currently use the S3 client library trivially portable to librados, allowing users to maintain control of the full storage stack.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/the-rados-distributed-object-store/&bvt=rss&p=wordpress)
