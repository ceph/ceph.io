---
title: "RADOS snapshots"
date: "2009-06-06"
author: "sage"
tags: 
  - "planet"
---

Some interesting issues came up when we started considering how to expose the RADOS snapshot functionality to librados users.  The object store exposes a pretty low-level interface to control when objects are cloned (i.e. when an object snapshot is taken via the btrfs copy-on-write ioctls).  The basic design in Ceph is that the client provides a “SnapContext” with each write operation that indicates which snapshots logically exist for the given object; if the version already stored by the OSD is older than the newest snapshot in the SnapContext, a clone is created before the write is applied.  It is the Ceph MDS’s responsibility to keep track of which snapshots apply to which objects (remember, Ceph lets you snapshot any subdirectory) and to do all the synchronization that ensures mounted clients have up to date SnapContexts.

In creating a raw object storage interface, how is that underlying functionality best exposed?  One option is to expose some functions that allow users to create, manipulate, and possibly store SnapContexts, and manually specify a context for each write (or a snapshot id to read).  This exposes the same functionality Ceph makes use of, but essentially drops all of the issues with synchronization and storage in librados user’s lap.  How should one go about keeping multiple processes accessing the RADOS store in sync (i.e. agreeing on which snapshots exist) to get the semantics people want?

Our solution is to introduce some basic snapshot accounting to RADOS.  We allow per-pool snapshots to be created via RADOS itself, and include that snap information in the OSDMap (the global data structure used to synchronize the activities of OSDs and clients).  If a client performs a write and does not manually specify a SnapContext (as Ceph does), an appropriate context will be generated from the pool snapshot information in the OSDMap.

Snapshot creation is done via the monitor, either via a librados API call or an administrator command like ‘ceph osd pool mksnap poolname snapname’.  This updates the OSDMap to include the new snap for that pool, and that map propagates across the cluster.

> int rados\_snap\_create(rados\_pool\_t pool, const char \*snapname);  
> int rados\_snap\_remove(rados\_pool\_t pool, const char \*snapname);  
> int rados\_snap\_list(rados\_pool\_t pool, rados\_snapid\_t \*snaps, int maxlen);  
> int rados\_snap\_get\_name(raods\_pool\_t pool, rados\_snapid\_t id, char \*name, int maxlen);

To read an existing snapshot, a new RADOS pool context is opened and a specific snapshot id is selected (the id can be obtained via rados\_snap\_list above):

> rados\_pool\_t snapped\_pool;  
> rados\_open\_pool(“data”, &snapped\_pool);  
> rados\_set\_snap(snapped\_pool, 2);

Subsequent reads via the _snapped\_pool_ handle will return data from snapid 2, and any attempts to write will return -EROFS (Read-only file system).  Reading and writing via other _rados\_pool\_t_ handles will be unaffected.  By default any newly opened pool handle will be “positioned” at the “head”–the current, writeable version of the object pool.

Map propagation is fast, but not synchronous: it is possible for one client to create a snapshot and for another client to then perform a write that does not preserve some data in the new snap.  So we do not completely solve the synchronization problem for you to create a global, ‘instantaneous’ point-in-time snapshot.  Doing so in a large distributed environment with many clients and many servers, operating in parallel, is a challenge in any system.

From the perspective of the client creating the snapshot, however, the snapshot is ordered with respect to IO performed before and after rados\_snap\_create.   RADOS already does some synchronization with respect to OSDMap updates to ensure that readers, writers and OSDs all agree on the current state of a placement group when performing IO.  Any IO initiated after the snapshot is created will be tagged with the new OSDMap version, and any OSD will make sure it has either the same or a newer version of the map before performing that IO.  Other clients will not see a clear ordering unless the librados user takes steps to coordinate clients such that they all obtain the updated OSDMap (describing the new snapshot) before performing new IO.

If there is demand, we may still expose an API to manipulate raw SnapContexts for advanced users wanting different snapshot schedules for different objects.  It will be their responsibility to manage all client synchronization in that case, as that snapshot information won’t be propagated via the OSDMap.

For anybody wanting perfect cluster-wide point-in-time snapshots without any client coordination… well, sorry.  Experience with file system snapshots has shown that proper synchronization is never something that the storage system alone can get right due to caching at all layers of the system.  NFS client write-back caches make server-based snapshots (e.g., NetApp filers) imperfect.  Snapshots in local file systems utilize some kernel machinery to momentarily quiesce all IO while the snapshot is created, but even applications may not have the on-disk files (as seen by the OS) in a consistent state.  Coordination with applications is always necessary for any fully ‘correct’ solution, so we won’t try to solve the whole problem based on some false sense of what ‘correct’ is.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/rados-snapshots/&bvt=rss&p=wordpress)
