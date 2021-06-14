---
title: "Atomicity of RESTful radosgw operations"
date: "2011-11-07"
author: "yehudasa"
tags: 
  - "planet"
---

A while back we worked on radosgw doing atomic reads and writes.

The first issue was making sure that two or more concurrent writers that write to the same object don’t end up with an inconsistent object. That is the “atomic PUT” issue.

We also wanted to be able to make sure that when one client reads an object via radosgw while another client writes to the same object, the result is consistent. That is, when reading an object a client should get either the old or the new version of the object, and never a mix of the two. That is the “atomic GET” issue.

Radosgw is built directly on top of RADOS and is a prime example of a librados user. The basic issue is that radosgw streams the objects from or to the RADOS objects with a series of relatively small reads or writes. For the atomic PUT and atomic GET we didn’t want to introduce locking. Locking would solve the issue, but implementing it on top of RADOS would not have been trivial, and would have affected scalability and the relative simplicity of the gateway. The Ceph distributed file system implements locking in the metadata server (as part of its POSIX file locking support), and introducing that in the gateway would require holding state on each object and synchronizing it between the different gateway instances. We didn’t want to reimplement the MDS again.

**Atomic PUT**

When radosgw reads or writes an object it can issue multiple read or write librados requests to the RADOS backend. One RADOS feature is that each single operation is atomic. The problem is that for sufficiently large object (which are not too large in any case) we issue multiple write operations, and could end up with an interleaved object.

The solution for the atomic PUT is to write the object into a temporary object. Once the temp object is completely written, we issue a single librados clone-range operation that atomically clones the entire temp object to the destination. Once the data is there we remove the temp object. This is equivalent to write to a temporary file and renaming it over the target when we finish.

Since the RADOS backend is distributed, we need to make sure that both the temp object and the target object will be located in the same placement group (and on the same OSD). Usually the object location is determined by the object name, but for this purpose we used the “object locator” feature, which allows us to provide alternative string that is fed into the hash function. In this case we use the target object name as the object locator for the temporary object, ensuring that both objects end up on the same placement group on the same node so that the clone operation can work.

**Atomic GET**

With atomic PUT we know that the objects are consistent. However, this doesn’t help with clients reading when an object is being written. Since there can be multiple librados read operations for a single GET, some of the reads may happen before the object is replaced and some may happen after that, leading to an inconsistent “torn” result.

In addition to atomic operations, RADOS has a nice feature called compound operations which allow you to send a few operations that are bundled together and applied atomically. If one of the operations fail, nothing is applied. We use this for atomic PUT in order to set both data and metadata on the target object in a single atomic operation.

For the atomic GET we introduce an object “tag,” which is a random value that we generate for each PUT and store as an object attribute (xattr). When radosgw writes to an object it first checks for an existing object and fetches its tag (which it can do atomically). If the object exists it clones it to a new object with the tag as a suffix (taking necessary steps to avoid name collisions) and the original object name as the locator. The compound clone operation looks like:

1. check to see if object <name> tag attribute is <tag>
2. clone to <name>\_<tag>

The first operation is a guard to make sure that the object hasn’t been rewritten since we first read it. (Had it been rewritten, we need to restart the whole operation and reread the tag.) We put the same guard when we write the new object instance, to make sure that there was no racing operation.

A client that reads the object also starts by reading the tag, and putting the same guard before each subsequent read operation. If the guard fails, the client knows that the object has been rewritten. However, it also knows that since it has been rewritten, the object that it started reading can now be found at <name>\_<tag>. So, reading of an object named foo looks like this:

- read object foo tag -> 123
- verify object foo tag is “123″; read object foo (offset = 0, size = 512K) -> ok, read 512K
- check object foo tag is “123″; read object foo (offset = 512K, size = 512K) -> not ok, object was replaced
- read object foo\_123 (offset = 512K, size = 512K) -> ok, read 512K

The final component is an intent log. Since we end up creating multiple instances of the same object under different names, we need to make sure that these object are cleaned up after some reasonable amount of time. We added a log object which we record each such object that needs to be removed. After a sufficient amount of time (however long we expect very slow GETs to still succeed), a process iterates over the log and removes old objects.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/atomicity-of-restful-radosgw-operations/&bvt=rss&p=wordpress)
