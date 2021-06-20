---
title: "What cinder volume is missing an RBD object ?"
date: "2014-08-31"
author: "loic"
tags: 
  - "ceph"
---

Although it is extremely unlikely to loose an object stored in [Ceph](http://ceph.com/), it is not impossible. When it happens to a [Cinder volume](http://docs.openstack.org/developer/cinder/api/cinder.volume.drivers.rbd.html) based on [RBD](http://ceph.com/docs/master/rbd/rbd/), knowing which has an object missing will help with disaster recovery.  
  
The [list\_missing](http://ceph.com/docs/master/rados/troubleshooting/troubleshooting-pg/#unfound-objects) command shows **rbd\_data.9ad9d26b8b4567.00000000000007b1** is the name of the missing object.

\# ceph pg 4.46 list\_missing
{ "offset": { "oid": "",
      "key": "",
      "snapid": 0,
      "hash": 0,
      "max": 0,
      "pool": -1,
      "namespace": ""},
  "num\_missing": 1,
  "num\_unfound": 1,
  "objects": \[
        { "oid": { "oid": "rbd\_data.9ad9d26b8b4567.00000000000007b1",
              "key": "",
              "snapid": -2,
              "hash": 197180870,
              "max": 0,
              "pool": 4,
              "namespace": ""},
          "need": "328685'1233912",
          "have": "328683'1233904",
          "locations": \[\]}\],
  "more": 0}

The corresponding RBD image name is displayed by **rbd info**

\# rbd --pool ovh ls |
   while read image ; do
      rbd --pool ovh info $image
    done | grep -C 5 9ad9d26b8b4567

        format: 2
        features: layering
rbd image 'volume-**1f0c5446-8671-4096-9954-ed2cb8b1e33e**':
        size 30720 MB in 7680 objects
        order 22 (4096 KB objects)
        block\_name\_prefix: rbd\_data.9ad9d26b8b4567
        format: 2
        features: layering
rbd image 'volume-215afc73-21f0-4234-8389-f36bbe473300':
        size 10240 MB in 2560 objects
        order 22 (4096 KB objects)

The human readable name of the cinder volume is the last part of the RBD image and **cinder show** will display it:

\# cinder show **1f0c5446-8671-4096-9954-ed2cb8b1e33e**
...
|          display\_name          |   osrm |
...
