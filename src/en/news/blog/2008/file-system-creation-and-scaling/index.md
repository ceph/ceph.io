---
title: "File system creation and scaling"
date: "2008-03-19"
author: "sage"
tags: 
  - "planet"
---

I’ve spent the last week or so revamping the whole “mkfs” process and some of the machinery needed to adjust data distribution when the size of the cluster changes by an order of magnitude or more. The basic problem is that data is distributed in a two-step process: objects are first statically mapped into one of many “placement groups” (PGs), and PGs then move somewhat dynamically between storage nodes as storage is added or removed from the system, disks fail, and so forth.

Click title to read more…

First, the creation of new PGs has to be a reliable process, even when creating many thousands or millions of PGs across hundreds or thousands of devices, and as with everything else, has to be robust in the face of device failures. To ensure this happens in an orderly fashion, the monitor cluster now keeps track of what PGs should exist and their current state (e.g. how much data they contain, whether they are fully replicated, etc.), including which PGs are pending creation. The monitor then sends PGCreate messages to OSDs to initiate creation of new PGs.  If and when creation succeeds, notification reaches the monitor through the standard PG state reporting mechanism (which is used for disk space ‘df’ accounting).

PG creation is a bit tricky because an OSD needs to be certain that the PG doesn’t already exist (possibly with some data in it) before it creates the PG locally and declares it empty. To ensure this, the monitor makes note of the OSD map epoch in which the PG was logically created, and communicates that to the OSD in the PGCreate message. The OSD determines which other OSDs (if any) the PG would have mapped to since that epoch, and explicitly queries them first to ensure the PG does not yet exist. When it is clear that it is safe to proceed, the PG is created locally, replicas are notified, and any read/write operations waiting for the PG can proceed. The monitor will then periodically resend PGCreate messages on missing PGs to catch instances where an OSD failed before responding.

This takes care of the initial creation of PGs during the initial file system creation (mkfs) process. PGs may also be created down the road, however, as the file system grows. For example, if a storage cluster initially consists of 8 storage nodes (OSDs) and 800 PGs, that puts about 100 PGs on each node, our rough target for a good balance between device utilization variance and device peering. However, if the cluster eventually grows to 80 nodes, that leaves only 10 (very large) PGs per device, which is likely suboptimal.

In this situation, we’d like to increase the number of PGs by “splitting” existing PGs into smaller bits. This is done by increasing the **pg\_num** parameter in the OSD map. However, since we’d like to initially keep the new PGs colocated with their parents (to make the “splitting” process simple), we leave **pgp\_num** (that second **p** is for placement) unchanged. As the map update is distributed, OSDs across the cluster split existing PGs by recalculating the object to PG mapping. This is basically like a bitmask (the least significant bits of the hash function output determine the PG), but with some minor smarts to allow pg\_num and pgp\_num to be any value (not just a power of 2).

In any case, once the existing PGs have be split to form a new total of pg\_num PGs, pgp\_num can be increased to match pg\_num, allowing the new PGs to be independently mapped to storage nodes. Since this process is initiated by the administrator, it can be done gradually as well (since both the splitting and migration steps will incur load on the cluster). For example, in our example of 8 OSDs and 80 PGs, we might slowly increase the PG count to 128 in increments of 16 (PGs 16-63 will split to form PGs 80-127). Once that completes, we now have the desired PG count, but because pgp\_num is unchanged, data is still distributed among devices as if we still only had 80. We can then slowly increase pgp\_num up to 128 in small increments, so that only a small number of PGs are migrated between devices at a time.

Slowly ramping these values is a good example of something that could be automated, but for now, I’m just working on getting all the basic functionality in place. As usual, reworking PG creation to be more robust happily resulted in some cleanup and a few bug fixes in the OSD peering and recovery code.  Progress!  
Next up, adjusting the [CRUSH](http://www.ssrc.ucsc.edu/Papers/weil-sc06.pdf) map that controls exactly how OSDs for each PG are chosen…

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/file-system-creation-and-scaling/&bvt=rss&p=wordpress)
