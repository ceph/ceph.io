---
title: "Incremental Snapshots with RBD"
date: "2013-05-14"
author: "scuttlemonkey"
tags: 
  - "backup"
  - "cloudstack"
  - "eucalyptus"
  - "opennebula"
  - "planet"
  - "snapshots"
---

While Ceph has a wide range of use cases, the most frequent application that we are seeing is that of block devices as data store for public and private clouds managed by OpenStack, CloudStack, Eucalyptus, and OpenNebula. This means that we frequently get questions about things like geographic replication, backup, and disaster recovery (or some combination therein, given the amount of overlap on these topics). While a full-featured, robust solution to geo-replication is currently being hammered out there are a number of different approaches already being tinkered with (like Sebastien Han’s [setup with DRBD](http://www.sebastien-han.fr/blog/2013/01/28/ceph-geo-replication-sort-of/) or the upcoming work [using RGW](http://permalink.gmane.org/gmane.comp.file-systems.ceph.devel/12238)).

However, since one of the primary focuses in managing a cloud is the manipulation of images, the solution to disaster recovery and general backup can often be quite simplistic. Incremental snapshots can fill this, and several other, roles quite well. To that end I wanted to share a few thoughts from RBD developer Josh Durgin for those of you who may have missed his [great talk](http://www.openstack.org/summit/portland-2013/session-videos/presentation/new-features-for-ceph-with-cinder-and-beyond) at the OpenStack Developer Summit a few weeks ago.

For the purposes of disaster recovery, the idea is that you could run two simultaneous Ceph clusters in different geographic locations and instead of copying a new snapshot each time, you could simply generate and transfer a delta. The incantation would look something like this:

rbd export-diff --from-snap snap1 pool/image@snap2 pool\_image\_snap1\_to\_snap2.diff

This creates a simple binary file that stores the following information:

- original snapshot name (if applicable)
- end snapshot name
- size of the image at ending snapshot
- the diff between snapshots

The format of this file can be seen in the [RBD doc](http://ceph.com/docs/master/dev/rbd-diff/).

After exporting a diff you could either simply back up the file somewhere offsite or import the diff on top of the existing image on a remote Ceph cluster.

rbd import-diff /path/to/diff backup\_image

This will write the contents of the differential to the backup image and create a snapshot with the same name as the original ending snapshot. It will fail and do nothing if a snapshot with this name already exists. Since overwriting the same data is idempotent, it’s safe to have an import-diff interrupted in the middle.

These commands can work with stdin and stdout as well, so you could do something like:

rbd export-diff --from-snap snap1 pool/image@snap2 - | ssh user@second\_cluster rbd import-diff - pool2/image

You can see which extents changed (in plain text, json, or xml) via:

rbd diff --from-snap snap1 pool/image@snap2 --format plain

There are a couple of limitations in the current implementation, however.

1. There’s no guarantee you’re importing a diff onto an image in the right state (i.e. the same image at the same snapshot as the diff was exported from).
2. There’s no way to inspect the diff files to see what snapshots they refer to, so you’d have to depend on the filename containing that information.

While the implementation is still relatively simple, you can see how this could be quite useful in managing not only cloud images, but any of your Ceph block devices. This functionality hit the streets with the recent ‘[cuttlefish](http://ceph.com/releases/v0-61-cuttlefish-released/)‘ stable release, but if you have questions or enhancement requests please let us know.

To learn more about some of the new things coming in future versions of Ceph you can check out the current [published roadmap](http://www.inktank.com/about-inktank/roadmap/) of work Inktank is planning on contributing. Also if you missed the virtual [Ceph Developer Summit](http://ceph.com/events/ceph-developer-summit/), the videos have been posted for review. In the meantime, if you have questions, comments, or anything for the good of the cause feel free to stop by our [irc channel](irc://irc.oftc.net/ceph) or drop a note to one of the [mailing lists](http://ceph.com/resources/mailing-list-irc/).

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/incremental-snapshots-with-rbd/&bvt=rss&p=wordpress)
