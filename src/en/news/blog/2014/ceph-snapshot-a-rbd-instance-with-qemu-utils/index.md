---
title: "Ceph: snapshot a RBD instance with QEMU-UTILS"
date: "2014-01-20"
author: "shan"
tags: 
  - "planet"
---

![](images/rbd-instance-snap-qemu-utils.jpg "Ceph: snapshot a RBD instance with QEMU-UTILS")

Quick tip to perform a full snapshot of an RBD image. (only MtG players can recognize this picture!)

`bash $ qemu-img convert -O raw rbd:<pool>/<rbd-images> <destination-snapshot-file>`

The `qemu-img` tool supports several parameters:

- if you want to authenticate with a specific user you can use: `id=<username>`
- if you want to point to a specific Ceph config file you can use: `conf=/etc/ceph/ceph.conf`

Obviously your `ceph.conf` has a dedicated section that points to the user key file (where the file contains the key):

```
[client.leseb]
    keyring = /etc/ceph/ceph.client.leseb.keyring
```

Final note, every option are separated by a `:`, so this will give you for example:

`bash $ qemu-img convert -O raw rbd:instances/vmdisk01:id=leseb:conf=/etc/ceph/ceph-leseb.conf /tmp/snap`
