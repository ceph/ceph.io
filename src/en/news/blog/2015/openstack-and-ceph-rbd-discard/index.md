---
title: "OpenStack and Ceph: RBD discard"
date: "2015-02-02"
author: "shan"
tags: 
---

![OpenStack and Ceph: RBD space reclamation](http://sebastien-han.fr/images/openstack-ceph-discard.jpg)

Only Magic Card player might recognize that post picture :) ([if you're interested](http://gatherer.wizards.com/Pages/Card/Details.aspx?name=reclaim))

  

I have been waiting for this for quite a while now. Discard, also called trim (with SSD), is a space reclamation mechanism that allows you to reclaim unused blocks on a disk. RBD images are sparse by default, this means that the space they occupy increase the more you write data (opposite of preallocation). So while writing on your filesystem you might end up to the end of your device. On the Ceph side, no one knows what is happening on the filesystem, so we actually end up with fully allocated blocks... In the end the cluster believes that the RBD images are fully allocated. From an operator perspective, having the ability to reclaim back the space unused by your running instances is really handy.

  

# About virtio-scsi

Virtio-scsi is a new storage interface for virtual machines. The purpose of this driver is to replace `virtio-blk` by bringing new capabilities to the virtual machine storage such as:

- device pass-through to directly expose physical storage devices to guests
- better performance and support for true SCSI device
- common and standard device naming identical to the physical world thus virtualising physical applications is made easier
- better scalability of the storage where virtual machines can attach more device (more LUNs etc...)

This new controller can now be added and block device can be attached to that controller.

  

The OpenStack support was added in Icehouse with the following two commits:

- [https://review.openstack.org/#/c/70263/](https://review.openstack.org/#/c/70263/)
- [https://review.openstack.org/#/c/70262/](https://review.openstack.org/#/c/70262/)

  

# OpenStack configuration

To enable the virtio-scsi block driver and the discard support we need to configure both Glance and Nova:

- Glance: by image properties, these properties will be detected by Nova and will apply the proper configuration
- Nova: to enable the discard support

Enable the virtio-scsi to the Glance image:

`bash $ glance image-update --property hw_scsi_model=virtio-scsi --property hw_disk_bus=scsi`

Description of the options:

- `hw_scsi_model=virtio-scsi`: add the virtio-scsi controller
- `hw_disk_bus=scsi`: connect every blocks to that controller

Now edit your `nova.conf` libvirt section on your compute node with:

```
[libvirt]
...
hw_disk_discard = unmap
...
```

Note: valid parameters for `hw_disk_discard` are:

- unmap: it unmaps aligned group of sectors
- ignore: it ignores the discard request

  

# Bring it on superstar!

The following assumes that you are using Ceph for the root disk of your virtual machines. This is possible by using the `images_type=rbd` flag in your libvirt section.

Now boot an instance:

`bash $ nova boot foo ...`

Check the number of objects composing the image:

\`\`\`bash $ sudo rbd -p vms ls e75328d3-1d76-45bb-84d5-b581d7113783\_disk

$ sudo rbd info vms/e75328d3-1d76-45bb-84d5-b581d7113783\_disk rbd image 'e75328d3-1d76-45bb-84d5-b581d7113783\_disk':

```
    size 20480 MB in 2560 objects
    order 23 (8192 kB objects)
    block_name_prefix: rbd_data.11e86f017fe7
    format: 2
    features: layering
    parent: images/53bd9dbe-23db-412b-81d5-9743aabdfeb5@snap
    overlap: 2252 MB
```

$ sudo rados -p vms ls |grep rbd\_data.11e86f017fe7 | wc -l 315 \`\`\`

So the clone is formed of 315 objects of 4M. Let's write some dummy data:

`bash $ dd if=/dev/zero of=leseb bs=1M count=200 oflag=direct 200+0 records in 200+0 records out 209715200 bytes (210 MB) copied, 0.650631 s, 322 MB/s`

We verify the number of objects again:

`bash $ sudo rados -p vms ls |grep rbd_data.11e86f017fe7 | wc -l 333`

It jumped from 315 to 333. Now we delete our dummy file:

`bash $ rm -f leseb`

And now let's the magic happening and count again:

\`\`\`bash $ sudo fstrim -v / /: 268439552 bytes were trimmed

$ sudo rados -p vms ls |grep rbd\_data.11e86f017fe7 | wc -l 320 \`\`\`

I can't really explain why we went down from 333 to 320 and not 315, maybe some filesystem metadata.

  

> **Important note**: discard support is not implemented in Cinder yet, so if you attach a Cinder block device you will get it attached to the virtio-scsi controller but won't get the discard option. This issue has been raised, but not addressed yet. I will see what we can do on our side, because I would really like to have this for Kilo. Moreover after looking at the code it seems quite easy to get the same attachement properties as Nova by simplies inheriting from the Nova configuration. [Patch submitted upstream](https://review.openstack.org/#/c/152823/).
