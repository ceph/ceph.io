---
title: "Ceph OSD uuid conversion to OSD id and vice versa"
date: "2015-03-09"
author: "loic"
tags: 
  - "ceph"
---

When handling a [Ceph](http://ceph.com/) OSD, it is convenient to assign it a symbolic name that can be chosen even before it is created. That’s what the **uuid** argument for **ceph osd create** is for. Without a **uuid** argument, a random uuid will be assigned to the OSD and can be used later. Since the **ceph osd create uuid** is idempotent, it can also be used to lookup the id of a given OSD.

$ osd\_uuid=b2e780fc-ec82-4a91-a29d-20cd9159e5f6
# convert the OSD uuid into an OSD id
$ ceph osd create $osd\_uuid
0
# convert the OSD id into an OSD uuid
$ ./ceph --format json osd dump | jq '.osds\[\] | select(.osd==0) | .uuid'
"b2e780fc-ec82-4a91-a29d-20cd9159e5f6"
