---
title: "Ceph Block Devices in OpenStack Folsom"
date: "2012-10-15"
author: "josh"
tags: 
  - "folsom"
---

The latest version of OpenStack, Folsom, was recently released. This release makes block devices in general, and Ceph block devices (RBD) in particular, much easier to use. If you’re not familiar with OpenStack terminology, there are a few things you should know before proceeding:

- instance – a virtual machine
- image – a template for a virtual machine
- volume – a block device
- Cinder – OpenStack service for managing block devices (replaces nova-volumes from previous versions)
- Glance – OpenStack service for storing images and metadata about them (image type, size, owner, etc.)

In previous releases, you could create volumes and attach them to virtual machines, and you could even boot from them, but there was no way to put data on them without going and doing it manually yourself. To boot from a volume, you’d have to:

1. start an instance
2. create a volume
3. attach the volume to the instance
4. write a bootable image to the volume from within the instance
5. detach the volume
6. boot from the volume

Now you may be wondering, why would I want to boot from a volume? By default, you’re booting from a file on a local disk. That’s ok, but if you boot from a volume, you can take advantage of more advanced features of volume storage:

#### Persistence

Volumes in OpenStack are persistent by default, so you can have vms that behave more like traditional servers which do not disappear when you reboot them.

#### Not tied to a single host

- vms can be migrated.
- compute and storage resources can be scaled independently.
- compute hosts can be diskless.

#### Advanced storage system features are available

- different types of storage (e.g. fast vs slow, replicated vs single copy, etc) can be accessed from the same compute host.
- snapshots can be created directly by the storage system instead of going through several other layers and acting more like a backup than a snapshot (this is what ‘snapshots’ of instances are in OpenStack).
- copy-on-write clones of existing volume snapshots can be created, providing a fast and easy way to restore to a past state of an instance.

In Folsom, using volumes is much easier. You can use a single API request to create a volume and populate it with the contents of an image from Glance, and you’re ready to boot from it. Thus, the 6 step manual process has been reduced to a 2 step automatic one.

Even better, if both your Glance images and your volumes are stored as Ceph block devices (RBD), creating a volume from an image can be a copy-on-write clone. This means you get a thin-provisioned, highly available disk along with fast instance creation. Plus it supports all the advanced features mentioned above.

You can find instructions for [setting this up](http://ceph.com/docs/master/rbd/rbd-openstack/) on the main Ceph.com site.

If you’d like to learn more about and Ceph and Cinder, you should check out my [talk at the OpenStack conference](http://openstacksummitfall2012.sched.org/event/49d780b281a05e215c40990c08ab7bf6#.UHk2ahLfu5k).

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/rbd/ceph-block-devices-in-openstack-folsom/&bvt=rss&p=wordpress)
