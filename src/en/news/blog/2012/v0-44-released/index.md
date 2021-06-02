---
title: "v0.44 released"
date: "2012-03-21"
author: "sage"
tags: 
---

v0.44 is ready!  Changes since v0.43 include:

- osd: key/value objects (objects are now blobs, key/value bundles, and xattrs)
- osd: cleaned up PG state, stats
- osd: fixed transaction replay on non-btrfs after ill-timed failures
- osd: several recovery fixes
- radosgw: improved PUT performance
- radosgw: improved list objects performance, filtering
- radosgw: manifests for large objects
- radosgw: Swift/S3 ACL interoperability (last set ACL type wins)
- librados: new key/value object API
- Ubuntu 12.04 precise packages

The exciting part of this release is that the key/value “object map”  work has been merged, along with radosgw changes to take advantage of the new API.  This allows you to use a key/value interface to manage many small records in a single object, in addition of the regular object data and attributes.   Keys in the same object are stored together on disk–just like object data would be–so there are locality advantages to putting related keys in the same object.  However, there are no limits on how many keys per object beyond concerns about load and space balancing (all keys in an object are stored together on the same set of Ceph OSDs).  This provides an interesting alternative to conventional distributed key/value  stores like Cassandra that distribute all keys in a single namespace across all nodes.  For example, radosgw now uses the new object map API to manage the index object for each bucket.

For v0.45, we’re continuing work on RBD caching, performance and bug fixes, and working around xattr size limitations in ext3/4.

You can get v0.44 from the usual locations:

- Git at git://[github.com/ceph](http://github.com/ceph)/ceph.git
- Tarball at [http://ceph.newdream.net/download/ceph-0.44.tar.gz](http://ceph.newdream.net/download/ceph-0.44.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/ops/install/mkcephfs/#installing-the-packages](http://ceph.newdream.net/docs/master/ops/install/mkcephfs/#installing-the-packages)

