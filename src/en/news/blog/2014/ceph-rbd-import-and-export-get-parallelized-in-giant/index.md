---
title: "Ceph: RBD import and export get parallelized in Giant"
date: "2014-09-28"
author: "shan"
tags: 
---

Features for the seventh Ceph release (Giant) have been frozen 3 weeks ago. Thus Giant is just around the corners and bugs are currently being fixed. This article is a quick preview on a new feature.

Giant will introduce a new RBD option: `--rbd-concurrent-management-ops`. The default value is set to 10 which means that the import operation will send 10 concurrent IOs at a time. Prior to this functionnality both import and export were pretty slow.

`bash $ rbd export --rbd-concurrent-management-ops 20 --pool=images e5d3c6dc-37b3-41e8-b375-987fe7935080 mon_image.img`

  

> This new feature will definitely speed up home made RBD backups :).
