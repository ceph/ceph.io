---
title: "Main New Features in the Latest Versions of Ceph"
date: "2017-01-06"
author: "admin"
tags: 
  - "planet"
---

It’s always pleasant to see how fast new features appear in Ceph. :)

Here is a non-exhaustive list of some of theme on the latest releases :

## Kraken (October 2016)

- BlueStore declared as stable
- AsyncMessenger
- RGW : metadata indexing via Elasticseasrch, index resharding, compression
- S3 bucket lifecycle API, RGW Export NFS version 3 throw Ganesha
- Rados support overwrites on erasure-coded pools / RBD on erasure coded pool (experimental)

## Jewel (April 2016)

- CephFS declared as stable
- RGW multisite rearchitected (Allow active/active configuration)
- AWS4 compatibility
- RBD mirroring
- BlueStore (experimental)

## Infernalis (November 2015)

- Erasure coding declared as stable and support many new features
- New features for Swift API (Object expiration,…)
- Systemd

## Hammer (April 2015)

- RGW object versioning, bucket sharding
- Crush straw2

## Giant (October 2014)

- LRC erasure code
- CephFS journal recovery, diagnostic tools

## Firefly (May 2014)

- Erasure coding
- Cache tiering
- Key/value OSD backend
- Standalone radosgw (with civetweb)

Maybe this will make you want to upgrade your cluster.

[http://docs.ceph.com/docs/master/releases/](http://docs.ceph.com/docs/master/releases/)

[http://docs.ceph.com/docs/master/release-notes/](http://docs.ceph.com/docs/master/release-notes/)

Source: Laurent Barbe ([Main New Features in the Latest Versions of Ceph](http://cephnotes.ksperis.com/blog/2017/01/06/main-new-features-in-the-latest-versions-of-ceph/))
