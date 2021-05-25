---
title: "Back from the Juno summit Ceph integration into OpenStack"
date: "2014-05-29"
author: "shan"
tags: 
  - "ceph"
  - "planet"
---

Six months have passed since Hong Kong and it is always really exciting to see all the folks from the community gathered all-together in a (bit chilly) convention center. As far I saw from the submitted and accepted talks, Ceph continues its road to the top. There is still a huge growing interest about Ceph.  
On tuesday May 13th, Josh and I led a (3 hours long) session to discuss the next steps of the integration of Ceph into OpenStack. To be honest, back when we were in Hong Kong, I believe that we were too optimistic about our roadmap. So this time we decided to be a little more realistic and took a more step-by-step approach rather than “let’s add everything we can”. However, this doesn’t mean that the Icehouse cycle was limited in terms of features, not at all! Indeed the Icehouse cycle has seen some tremendous improvements. I don’t know if you remember my last year article right after the Icehouse summit, there was a feature that I wanted so much: RADOS as a backend for Swift. And yes, we made it, so if you want more details you’d better continue the reading :).

# Integration bad new

In order to give you a little bit of background, during the Havana cycle we introduced a new backend to store virtual machine disks. Basically, it allows you to seamlessly boot virtual machines into Ceph, so yes your virtual machine disks will live inside Ceph and not on the traditional filesystem path /var/lib/nova/instances//disk. The flag that manages this behavior is called ‘libvirt\_image\_type’ along with the rbd option. This feature is very useful since a lot people want to ease the management/maintenance of their virtual machines. Things such as live-migration and recovery are made easier thanks to the RBD shared storage backend.  
However, even with this backend, we were still using the standard way to boot an instance. Meaning that we have to pull the image from Glance (which is already inside Ceph), stream it to the compute node under ‘/var/lib/nova/instances/\_base’ directory and eventually import it into Ceph (yes again!). This operation is extremely inefficient and slow, so we came up with another approach. We decided to use the copy-on-write clone functionality from Ceph RBD. Given that during the import into Glance, images are snapshotted and protected, we can easily create clones from them, we already do this in Cinder when you want to create a volume from an image.

In Icehouse, we had a patch to implement COW clones. This code went through feature freeze but was ultimately rejected because of a tiny bug (fixed righ way by Jay Pipes btw). Given that the little time frame that we had, this patch was judged to critical by the Nova guys. For the complete discussion please read this thread [http://lists.openstack.org/pipermail/openstack-dev/2014-March/029127.html](http://lists.openstack.org/pipermail/openstack-dev/2014-March/029127.html).  
Fortunately, Dmitry Borodaenko created a special branch for Nova that contains the COW clones code. The branch is available on his Github [https://github.com/angdraug/nova/commits/rbd-ephemeral-clone](https://github.com/angdraug/nova/commits/rbd-ephemeral-clone). Debian and Ubuntu packages already made available by eNovance in the official Debian mirrors for Sid and Jessie. However for Debian Wheezy, Ubuntu Precise and Trusty you shoud look at: http://cloud.pkgs.enovance.com/{wheezy,precise,trusty}-icehouse.

# Ceph in OpenStack?

[![unify-all-the-things-with-ceph](images/unify-all-the-things-with-ceph-1024x661.png)](http://techs.enovance.com/wp-content/uploads/2014/05/unify-all-the-things-with-ceph.png)

As you can see, we have been putting a lot of effort in continuously integrating Ceph into OpenStack. Ceph has been present in OpenStack since the very beginning and during each release we integrated new features.

# What’s new in Icehouse?

## Clone non-raw images in Glance RBD backend

After some production setups, we discovered that the libvirt\_image\_type RBD backend was not compatible with QCOW2 Glance images. This was a well-known issue for those who already attempted to perform a boot from volume with Cinder. Essentially, Ceph doesn’t support QCOW2 for hosting virtual machine disk. Obviously this is a problem, since users tend to upload QCOW2 images given that they are sparse. This is why we introduced a new method to check the image format before booting the virtual machine, thus if we detect that the image is not RAW we convert it. The caveat with this method is that you do not take advantage of the cloning functionality anymore because you will get a new flat image into Ceph. That is the reason why I usually recommend private cloud user to always import RAW images. If they can not or if it takes too long to upload the image, they can still boot a virtual machine from a QCOW2 image, this image will be converted into RAW and then the virtual machine will be available. After this, you can simply snapshot this instance and re-use the snapshot as an image template later. With this little trick you do not need to upload large RAW images (who said large Windows images?)  
Final note, the new piece of code works for both Cinder boot from volume and Nova ephemeral RBD backend.

## Nova ephemeral backend dedicated pool and user

Prior Icehouse, we had to use client.admin in libvirt to authenticate and interact with the Ceph cluster. This was a huge security breach since the key had access and control to the entire cluster. Now, we have the ability to use a dedicated and right-limited user to access the Nova pool and nothing else.

## RADOS as a backend for Swift

That’s the BIG announcement :D.

As you may know, Swift does not follow the OpenStack release cycle, so this new feature might not directly be considered as an Icehouse addition.

Swift has a multi-backend functionality that allows you to store objects as:  
a file on a filesystem  
a file on a glusterfs share  
an object into Ceph RADOS

One important thing that I would like to highlight is that you won’t find these backends into Swift’s core code. Swift has a policy to let all the storage backends outside the core code. Given that, each backend has its individual external repository on Stackforge.

How does it work?

Well the implementation is fairly easy to understand. Since Swift has a built-in multi-engine called DiskFile, we just relied on it. Everything is happening at the swift-object-server level, so you can still take advantage of the Swift API, Swift middlewares and all the Swift’s functionality. In this situation, Ceph handles the replication and Swift is configured with a single replica.

Now you might be wondering what is the state of the implementation?

We passed all the unit tests and functional tests coverage. We got 100% for both. We, at eNovance, have been playing with it for the last couple of weeks. We ran tons of heavy benchmarks and functional tests and it never broke. That is fantastic, and at eNovance we consider it as production ready, we are even about to start implementing it with some of our customers.  
The only issues are at the accounts and DBs level. Actually there is currently no multi-backend engine for this, a patch is already on the pipe here [https://review.openstack.org/#/c/47713/](https://review.openstack.org/#/c/47713/).  
Then as soon as this patch gets merged ,we will implement a RADOS backend to store accounts and DBs.

How can I test it?

We have an Ansible repository: [https://github.com/enovance/swiftceph-ansible](https://github.com/enovance/swiftceph-ansible) available and ready.  
The code will soon be available on StackForge, in the meantime you can use our repository: [https://github.com/enovance/swift-ceph-backend](https://github.com/enovance/swift-ceph-backend)

## Juno’s roadmap

For this upcoming cycle, we will try to be more realistic than the last release cycle, basically we chose critical features that need to be implemented, there are sorted by priority order:

- Get COW clones into stable (Dmitry Borodaenko): key points here are to validate features like live-migration and instance evacuation.

- Use RBD snapshot instead of qemu-img (Vladik Romanovsky): efficient since we don’t need to snapshot, get a flat file and upload it into Ceph

- DevStack Ceph (Sébastien Han): ease the adoption for developers

- Continuous integration system (Sébastien Han): having an infrastructure for testing RBD will help us to get patch easily merged

- Volume migration support with volume retype (Josh Durgin): move block from Ceph to other backend and the other way around

Once again, I feel that this new cycle is going to be interesting. The recent acquisition of Inktank by Red Hat is a good thing, and will definitely strengthen the integration of Ceph into OpenStack. I look forward to seeing all those things happening.  
See you next time.
