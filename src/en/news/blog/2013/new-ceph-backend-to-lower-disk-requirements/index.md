---
title: "New Ceph Backend to Lower Disk Requirements"
date: "2013-06-11"
author: "scuttlemonkey"
tags: 
  - "ceph"
  - "erasure-encoding"
  - "scality"
---

I get a fair number of questions on the current [Ceph blueprints](http://wiki.ceph.com/01Planning/02Blueprints), especially those coming from the community. Loic Dachary, one of the owners of the Erasure Encoding blueprint, has done a great job taking a look at some of issues at hand.

> When evaluating Ceph to run a new storage service, the replication factor only matters after the hardware provisioned from the start is almost full. It may happen months after the first user starts to store data. In the meantime a new storage backend ( erasure encoded ) reducing up to 50% of the hardware requirements [is being developped](http://wiki.ceph.com/01Planning/02Blueprints/Dumpling/Erasure_encoding_as_a_storage_backend) in Ceph.
> 
> It does not matters to save disk from the beginning : it is not used anyway. The question is to figure out when the erasure encoded will be ready to double the usage value of the storage already in place.
> 
> When looking for a new storage solution the hardware requirements are an important factor. If Ceph is configured with three replicates, 1PB of usable storage requires 3PB of actual storage. The users are expected to occupy an increasing amount of disk space over time:
> 
>             ^
>        10PB |
>             |
>             |
>         6PB |
>             |                                          /--
>             |                                     /----
>         4PB |                                /----
>             |                           /---- usage
>             |                      /----
>         2PB |                 /----
>             |             /---
>             |        /----
>             |   /----
>             +----------------+----------------+------------>
>                           A months          B months
> 
> Hardware provisioning is expected to follow the usage curve. In the following, 4PB are provisionned initialy, an additional 2PB after A months of operation etc.
> 
>             ^
>        10PB |                                 +-----------
>             |                                 |
>             |                                 |
>         6PB |                +----------------+
>             |                |    provisioning         /---
>             |                |                    /----
>         4PB +----------------+               /----
>             |                           /---- usage
>             |                      /----
>         2PB |                 /----
>             |             /---
>             |        /----
>             |   /----
>             +----------------+----------------+------------>
>                           A months          B months
> 
> An erasure encoded Ceph backend could reduce the requirements for raw storage : 1PB of usable storage fits in 1.5PB of raw storage. If it was available the curve would not grow as fast and the need for provisioning more hardware would happen at a later time.
> 
>             ^
>        10PB |
>             |
>             |
>         6PB |                                    +---------
>             |                                    |
>             |                                    |
>         4PB +------------------------------------+
>             |                  provisioning
>             |                                    /---------
>         2PB |                          /--------- usage
>             |                /---------
>             |        /-------
>             |   /----
>             +----------------+----------------+------------>
>                           A months          B months
> 
> The implementation of an erasure encoded backend for Ceph started in may 2012 and when it is released, it will progressively lower the disk space requirements. In the example above it will save money if it happens before A months. However, even if it happens later, it will still save money by reducing the storage footprint and make better use of the existing hardware.
> 
>             ^
>        10PB |
>             |
>             |
>         6PB |
>             |
>             |
>         4PB +-----------------
>             |
>             |
>         2PB |
>             |
>             |
>             |
>             +----------------+
>                           A months
> 
> In any case, it does not save any money to have erasure encoding from the start because the provisionned hardware is completely empty. Up to A months, the investment to provision 4PB was done anyway.
> 
> Originally posted by [Loic Dachary](http://dachary.org/?p=2048).  
> 
> scuttlemonkey out
> 
> ![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/new-ceph-backend-to-lower-disk-requirements/&bvt=rss&p=wordpress)
