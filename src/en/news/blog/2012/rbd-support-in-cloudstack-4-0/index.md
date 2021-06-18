---
title: "RBD support in CloudStack 4.0"
date: "2012-10-26"
author: "widodh"
tags: 
---

For the past few months I have been working towards a way to use Ceph for virtual machine images in Apache CloudStack. This integration is important to end users because it allows them to use Ceph’s distributed block device (RBD) to speed up provisioning of virtual machines.

We (my company) have been long-time contributors to Ceph (since version 0.17!), and will be using it in our own cloud product. Support for Ceph didn’t exist in CloudStack… So we built it!

I’m co-owner of a Dutch webhosting company called [PCextreme B.V.](http://www.pcextreme.com/) My role as CTO is to do our Research & Development and that enables me to play with Ceph (a lot).

Quite some time ago we were convinced we wanted to use Ceph with RBD in our VPS product, but we weren’t sure how. Were we going to write our own cloud management software? OpenStack seemed like a good choice since it already had RBD integration, but while looking at OpenStack we came across CloudStack. I’m not going to do the OpenStack vs CloudStack discussion, but we decided CloudStack suited us better. It however lacked RBD support!

To make this integration work, a few things needed to be done:

- Add RBD storage pool support to libvirt (Since version [0.9.14](http://libvirt.org/git/?p=libvirt.git;a=commit;h=74951eadef85e2d100c7dc7bd9ae1093fbda722f))
- Update libvirt-java bindings ([Secret handling and misc fixes](http://libvirt.org/git/?p=libvirt-java.git&a=search&h=HEAD&st=author&s=wido))
- Make a few minor libvirt fixes ([Small cephx fix](http://libvirt.org/git/?p=libvirt.git;a=commitdiff;h=ccb94785007d33365d49dd566e194eb0a022148d))
- Add RBD support to CloudStack ([Add RBD primary storage](https://git-wip-us.apache.org/repos/asf?p=incubator-cloudstack.git;a=commit;h=406fd95d87bfcdbb282d65589ab1fb6e9fd0018a))

This work has been completed and merged, and will all be part of the new CloudStack 4.0 release, which is slated for the end of October. Between now and then, we’d like people to try it!

To get started, take a look at the [related documentation](http://eu.ceph.com/docs/master/rbd/rbd-cloudstack/). If you encounter any problems, feel free to ask for help on the [Ceph](http://ceph.com/resources/mailing-list-irc/) or [CloudStack](http://incubator.apache.org/cloudstack/mailing-lists.html) mailing lists. Or join the #ceph (OFTC) or #cloudstack (Freenode) IRC channels, I’m idling there for most of the time.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/rbd-support-in-cloudstack-4-0/&bvt=rss&p=wordpress)
