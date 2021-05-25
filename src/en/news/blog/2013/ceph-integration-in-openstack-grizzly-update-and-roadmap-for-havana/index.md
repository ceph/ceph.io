---
title: "Ceph integration in OpenStack: Grizzly update and roadmap for Havana"
date: "2013-06-03"
author: "shan"
tags: 
  - "planet"
---

![](images/ceph-openstack-update-roadmap-havana.jpg "Ceph integration in OpenStack: Grizzly update and roadmap for Havana")

What a perfect picture, a Cephalopod smoking a cigar! Updates! The OpenStack developer summit was great and obviously one of the most exciting session was the one about the Ceph integration with OpenStack. I had the great pleasure to attend this session (led by Josh Durgin from Inktank). The session was too short, but we had enough time to discuss upcoming features and establish a proper roadmap. With the help of this article, I’d like to share some of the discussions that we had and blueprints that we wrote.

  

# I. Some Grizzly updates

Unfortunately there are not that much addition on the Ceph corner… :/ Nevertheless Cinder itself brought some nifty features, therefore I selected some of them that are more or less connected with Ceph:

- [https://review.openstack.org/#/c/19408/](https://review.openstack.org/#/c/19408/) this brings the `direct_url` support to Nova, but only for the backend known as `file`, - Thus NOT for Ceph yet… But close to this [blueprint](https://blueprints.launchpad.net/nova/+spec/rapid-cloning).
- The boot from volume functionnality doesn’t need an `--image <id>` anymore, thus nova will attempt to boot from volume if it sees `--block-device-mapping`.
- When you run the `cinder list` command, there is a new field in the line returned, it’s called `Bootable`, if Cinder notices any Glance metadata the field will appear as `true`.
- Not sure if it came with Grizzly but back then during Folsom I used to convert my image to RAW to perform a boot from volume. So the process was grab the image, convert it to raw, re-import it to Glance and eventually run `cinder create --image-id` (and point to the glance image id). Now while running `cinder create --image-id` Glance will automatically convert the image to RAW. Thus we saved some steps :-).

  

# II. Roadmap for Havana

## II.1. Glance oriented

- [Ability to put snapshots and images into different pools](https://blueprints.launchpad.net/glance/+spec/ability-to-separate-snapshots-and-images), the goal is to offer different availability level for both images and snapshots. Ideally one pool for the images and one pool for the snapshots.
- Populate a Glance with an existing Ceph cluster. Refer to my previous [article](http://www.sebastien-han.fr/blog/2013/05/07/use-existing-rbd-images-and-put-it-into-glance/). Targeted for Havana.

  

## II.2.Cinder oriented

- Driver refactor: the main goal is use the librbd instead of the CLI, this will bring better bug tracking.
- RBD as a backup target for the cinder backup service, it currently only supports Swift.
- Implement differential backups (new feature from the latest stable version of Ceph: Cuttlefish 0.61)
- Implement a disaster recovery functionality where volumes are backed up to a secondary cluster located in a different datacenter.
- Volume encryption :
    
    - [https://blueprints.launchpad.net/nova/+spec/encrypt-cinder-volumes](https://blueprints.launchpad.net/nova/+spec/encrypt-cinder-volumes)
    - [https://github.com/ceph/ceph/commit/c6ac0ddf91915ba2aeae46d21367f017e18e82cd](https://github.com/ceph/ceph/commit/c6ac0ddf91915ba2aeae46d21367f017e18e82cd)

  

## II.3. Nova oriented

- [Better libvirt network volume support](https://blueprints.launchpad.net/nova/+spec/better-libvirt-network-volume-support). This blueprint tries to bring a better support for network volume libvirt in general. But also addresses the case when libvirt needs to be configured to store backend secret when authentication is enabled. In order to configure Nova with CephX (authentication service from Ceph handled by the monitors), a secret (user key) needs to be imported into libvirt… This fastidious action must be repeated N times, where N is the number of your compute nodes since all of them have to know about the secret, unfortunately one secret can’t be share through multiple libvirt.
- [Enable RBD tuning options](https://blueprints.launchpad.net/nova/+spec/enable-rbd-tuning-options), here the KVM process spawned by Nova doesn’t take advantage of all the QEMU options available for the RBD driver (e.g. caching).
- [Bring RBD support to `libvirt_images_types`](https://blueprints.launchpad.net/nova/+spec/bring-rbd-support-libvirt-images-type), the main goal is to unified the use of RBD and make a portage to the epheremal images. (more or less close to [this blueprint](https://blueprints.launchpad.net/nova/+spec/rapid-cloning)).

  

## II.4. Ceilometer

Nothing for the time beeing and we didn’t say much that much about it. However Ceilometer could track and report some specific metrics from the Ceph monitors. The same goes for the RADOS Gateway and volume usage statistics.

  

## II.5 Alternative projects

New comers projects like key management system API have also been discussed (initially the authentication and the key management are handle by the monitors). If Ceph could provide an API, the key management part could be detach from the monitors and then managed by a key management system.

  

# III. More or less in relation with Ceph

The following blueprints are generic but I think it’s worth knowing them:

- [https://blueprints.launchpad.net/nova/+spec/flexible-block-device-config](https://blueprints.launchpad.net/nova/+spec/flexible-block-device-config)
- [https://blueprints.launchpad.net/nova/+spec/block-mapping-model](https://blueprints.launchpad.net/nova/+spec/block-mapping-model)
- [https://blueprints.launchpad.net/nova/+spec/improve-block-device-handling](https://blueprints.launchpad.net/nova/+spec/improve-block-device-handling)
- [https://blueprints.launchpad.net/nova/+spec/improve-boot-from-volume](https://blueprints.launchpad.net/nova/+spec/improve-boot-from-volume)
- [https://etherpad.openstack.org/instance-volume-collocation](https://etherpad.openstack.org/instance-volume-collocation)
- [https://blueprints.launchpad.net/glance/+spec/multiple-image-locations](ttps://blueprints.launchpad.net/glance/+spec/multiple-image-locations)
- [https://blueprints.launchpad.net/nova/+spec/disk-blkio-operations](https://blueprints.launchpad.net/nova/+spec/disk-blkio-operations)

  

> As you can see, tons of different subjects have been discussed. The roadmap is well established, a lot of things can be implemented thus it’s up to the community to work on them.
