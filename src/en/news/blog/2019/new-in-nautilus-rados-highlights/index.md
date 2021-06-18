---
title: "New in Nautilus: RADOS Highlights"
date: "2019-05-10"
author: "neha"
---

## BlueStore

Nautilus comes with a bunch of new features and improvements for RADOS. To begin with, BlueStore is even more awesome now! If you were ever wondering how BlueStore uses space on your devices, stop wondering any further. With Nautilus, [BlueStore space utilization information](http://docs.ceph.com/docs/nautilus/releases/nautilus/#upgrade-compatibility-notes) is much more granular and accurate, with separate accounting of space used by data, metadata and omap. There is also usage breakdown at the pool level for you to easily glance at the information that matters. It should be noted though that, in a mixed cluster, with pre-nautilus and nautilus OSDs, this accounting may not be perfect. ‘ceph df’ can also be used to see available raw space by device class.  

Tuning BlueStore is easier than ever - with the bluestore\_cache\_autotune option enabled, BlueStore uses a best effort algorithm to keep OSD memory usage under a designated target size via the [osd\_memory\_target](http://docs.ceph.com/docs/nautilus/rados/configuration/bluestore-config-ref/#automatic-cache-sizing) configuration option. In general, BlueStore is now also smarter about cache management, making sure the higher priority stuff is cached before the rest.  

Nautilus also introduces a new ‘bitmap’ allocator, a disk allocator that outperforms its precursors, both in terms of throughput and memory utilization. A [detailed comparison](https://docs.google.com/presentation/d/1_1Otkgv76fbCU2Zogjz748sEAG-1Nfiidbb6mgTON-A/edit#slide=id.p) of the new ‘bitmap’ and old allocator has been done by Igor Fedotov.  

## Recovery, scrub and other background activities  

A lot of work has been done in Nautilus to make Ceph resilient to failures and make recovery seamless. We have refocused on the prioritization order of PGs during recovery and backfill to ensure that we can quickly and reliably get the cluster to an active state whenever feasible. We have added [new configuration options](http://docs.ceph.com/docs/nautilus/rados/operations/placement-groups/#prioritize-backfill-recovery-of-a-placement-group-s) to manually trigger forced recovery/backfill at a pool level. To force recovery/backfill you can just use:

ceph osd pool force-recovery/backfill {pool-name}

or to cancel it just say:

ceph osd pool cancel-force-recovery/backfill {pool-name}

The backfill mechanism has been made smarter to defer backfill if the expected amount of space required to complete is not available.  

Historically, recovery and backfill have been notorious for consuming unbounded amounts of memory to store PG logs. This problem has now been addressed with the implementation of a hard limit for the PG log length, which ensures that we cap the amount of memory consumption during such operations.  

An improved version of [asynchronous recovery](http://docs.ceph.com/docs/nautilus/rados/operations/placement-groups/#prioritize-backfill-recovery-of-a-placement-group-s) is available in Nautilus. Unlike the original version in mimic, which considered the difference in length of PG logs as the cost of recovery, this version also takes into account missing objects to select OSDs for asynchronous recovery. This is generally a better way of choosing OSDs to postpone recovery on. Similar to throttling recovery and scrubbing, we have introduced a configuration option called osd\_delete\_sleep that allows users to throttle deletes on placement groups.  

[Scrub and repair](http://docs.ceph.com/docs/nautilus/rados/configuration/osd-config-ref/#scrubbing) also have new options that can be targeted on a per-pool basis. Also, scrub “auto repair” has now been implemented for replicated pools, which means that in all but the most unusual circumstances the cluster is able to heal itself without intervention.  

## Miscellaneous Improvements  

Several other exciting features are now available with Nautilus. One of the promising new experimental features is a new erasure code plugin called [Coupled-Layer "Clay" erasure code](http://docs.ceph.com/docs/nautilus/rados/operations/erasure-code-clay/), which has the potential to improve recovery performance drastically. We are eager to hear user experiences about it!  

NUMA node monitoring and configuration has been simplified with the addition of the ‘ceph osd numa-status’ command that reports the OSD network and storage of NUMA nodes, and the new ‘osd\_numa\_node’ config setting to easily pin OSDs to NUMA nodes.  

Another cool addition is the progress module in the manager that provides the ability to track the progress of some rados operations like recovery using the ceph status command.  

## Summar**y**  

Usability and performance have been our key areas of focus for Nautilus, and we believe that RADOS is now more robust than ever before. With every release, we try to incorporate a range of improvements in RADOS and we are very excited to hear what users have to say about Nautilus. A big thank you to all the contributors who made it happen, and a special shout out to Myna V, whose contribution of the Clay erasure code plugin is a great example of academic research becoming part of open-source software.
