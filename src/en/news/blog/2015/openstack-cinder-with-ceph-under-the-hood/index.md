---
title: "OpenStack Cinder with Ceph under the hood"
date: "2015-01-23"
author: "shan"
tags: 
  - "planet"
---

{% img center http://sebastien-han.fr/images/cinder-ceph-under-the-hood.jpg OpenStack Cinder with Ceph under the hood %}

What's happening under the hood while playing with Cinder and Ceph? Answer table :-).

  

|  | ACTION | RESULTS |
| --- | --- | --- |
|  | Create a volume | New RBD image gets created in the pool configured in your cinder.conf. |
|  | Create a volume backup | Create a new volume in the destination pool, the first backup is a full copy, the new ones will be incremental. |
|  | Create a volume from a snapshot (with rbd\_flatten\_volume\_from\_snapshot=false) | Creates a new volume. Will be a clone in Ceph and the parent will be the snapshot. |
|  | Create a snapshot from a volume (with rbd\_flatten\_volume\_from\_snapshot=true) | Creates a new volume. Will be a new RBD image in Ceph. |
|  | Create a volume from a volume | The source volume gets snapshotted and the volume will be clone of this snapshot. |
|  | Create volume from image | If the image is in a Ceph pool and its location exposed then the volume will be a clone. |
|  | Create a snapshot | Creates an RBD snapshot. |
