---
title: "Ceph support in OpenNebula 4.0"
date: "2013-04-04"
author: "scuttlemonkey"
tags: 
---

The Ceph team has been extremely blessed with the number of new people who choose to become involved with our community in some way. Even more exciting are the sheer numbers of people committing code and integration work, and the folks from OpenNebula are a great example of this in action.

At the end of February, one of the OpenNebula developers reached out to let us know that their integration work with Ceph was nearly complete. Below you can find a brief overview of how Ceph behaves in an OpenNebula environment, as well as a link to how to get it set up. Read on for details!

[![](images/opennebula_logo.png "OpenNebula logo")](http://opennebula.org)

scuttlemonkey: It’s worth noting that the 4.0 release is still in beta and there was a bug discovered in the Ceph driver. Thankfully this has a [workaround](http://opennebula.org/documentation%3Arel4.0%3Aceph_ds) noted in the doc as well as a [fix](http://dev.opennebula.org/projects/opennebula/repository/revisions/85eeb4b240881f1918b37ab2ee7c201e311cd474/diff/src/datastore_mad/remotes/ceph/cp) already committed for the release. If you have any issues feel free to stop by the [#opennebula](irc://irc.freenode.net/opennebula) channel and let them know.

> OpenNebula continues with its growing support of new storage technologies. OpenNebula 4.0 comes with a fresh integration with [Ceph](http://ceph.com/), an impressive distributed object store and file system.
> 
> OpenNebula provides an interface for [Ceph RBDs (RADOS Block Device)](http://ceph.com/ceph-storage/block-storage/), which allows registering images directly in a Ceph pool, and running VMs using that backend.
> 
> There is an extensive [Ceph for OpenNebula guide](http://opennebula.org/documentation%3Arel4.0%3Aceph_ds), but it can be summarized as follows:
> 
> - OpenNebula worker nodes should be part of a [working Ceph cluster](http://ceph.com/docs/master/).
> - The ”one” Ceph pool should be available (the name is configurable).
> - Use Libvirt/KVM as the hypervisor. Xen is not yet supported.
> 
> Once we have that up and running using it is extremely simple!
> 
> 1. Make sure we have the ”one” Ceph pool
>     
>     $ ceph osd lspools
>     0 data,1 metadata,2 rbd,3 one,
>     
> 2. Create a Ceph datastore
>     
>     $ cat ceph.one
>     NAME      = ceph
>     DS\_MAD    = ceph
>     TM\_MAD    = ceph
>     
>     DISK\_TYPE = RBD
>     
>     HOST = ceph0
>     POOL\_NAME = one
>     SAFE\_DIRS="/"
>     
>     $ onedatastore create ceph.one
>     ID: 101
>     
> 3. Register an image
>     
>     $ oneimage create --name centos-6.4 --path /tmp/centos-6.4.img -d ceph
>     ID: 4
>     
> 4. Run your VM
>     
>     $ onevm create --name centos-6.4 --cpu 1 --memory 768 --nic 1 --disk centos-6.4 --nic net\_172
>     ID: 10
>     
> 
> What happens behind the scenes is that OpenNebula interacts with the Ceph cluster and clones the base image. The Libvirt/KVM deployment file uses that clone image as the OS:
> 
>     <disk type='network' device='disk'>
>         <source protocol='rbd' name='one/one-4-10-0' />
>         <target dev='hdb' bus='ide'/>
>     </disk>
> 
> All the image handling and manipulation (cloning, renaming, removing, etc…) is performed in a specific server defined in the datastore template, in our case ”HOST = ceph0”, using the ”rbd” capabilities of ”qemu-img” the  
> registration of new images.

Thanks to the OpenNebula team for hammering out this integration, we love to see new use cases for Ceph!

If you have your own use case story, we would love to hear about it (and share it with the world). Feel free to drop us your thoughts in the form of a suggested blog title, raw data that you wish us to write some prose about, or a fully formed blog post that we can push out to the community. Thanks, and happy Ceph-ing.

(cross-posted on the [OpenNebula blog](http://blog.opennebula.org/?p=4441) as well)

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/ceph-support-in-opennebula-4-0/&bvt=rss&p=wordpress)
