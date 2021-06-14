---
title: "State of the union: Ceph and Citrix"
date: "2013-05-23"
author: "scuttlemonkey"
tags: 
  - "planet"
---

Since last month saw huge amounts of OpenStack news coming out of the Developer Summit in Portland, I thought it might be worth spending some time on CloudStack and its ecosystem this month. With the Citrix Synergy event in full swing, a ‘State of the Union’ with respect to Ceph and Citrix is probably the easiest way to look at all the great things going on.

There are a number of products that Ceph plugs into, and many of them are built on top of open source projects. One of the great parts about Ceph is that a single cluster can service all of your data storage needs, especially as it relates to the Citrix portfolio. Much like Linux in the datacenter, it’s only a matter of time before Open Source becomes the dominant force in this last bastion of proprietary-driven infrastructure.

Let’s take a look at how Ceph can work with:

- Apache CloudStack / Citrix CloudPlatform
- Citrix CloudPortal
- Citrix XenDesktop
- Citrix Sharefile
- Xen / XenServer

### CloudStack/CloudPlatform

As of last year, Citrix handed over CloudStack to the Apache community and it came out of incubation a few months ago. There is a really vibrant community around it and Citrix is a major part of that community. Citrix CloudPlatform is a commercial version of Apache Cloudstack, fully tested and supported by Citrix.

Rather than separate storage into APIs by **type** as in Openstack (Cinder for Block and Swift for Object), CloudStack/CloudPlatform have a concept of Primary and Secondary Storage which aggregate the different storage options based on **purpose**:

- **Primary Storage:** is the storage used by a running virtual machine for its live filesystem. It can be delivered by either local,NFS, iSCSI, Fiber Channel or RBD storage.
- **Secondary Storage:** is used for storing snapshots, ISOs, templates and can be delivered via local, NFS, iSCSI or, as of 4.1, S3 or Swift compatible object storage.

With great work being done by the Ceph community (thanks Wido!), version 4.0 saw the Ceph Block Device (RBD) enabled as a Primary Storage option. This gives you most of Ceph’s powerful features like copy-on-write cloning and thin provisioning with snapshotting and cloning coming in 4.2, which is due out in June. Also, as of 4.2,  Secondary Storage via the RADOS Gateway (RGW) using the generic S3/Swift API but \*without\* using a NFS server will also be possible.

### CloudPortal

Citrix CloudPortal is a web UI that allows end users to request services from underlying IT resources. It is designed to hide the underlying technology from users who merely request the service or product they need and makes the interaction between users and IT departments feel like the interaction between a customer and a service provider.

An administrator configures what services are available, which are then presented as a catalog to end-users to choose from. It is extensible, so can be integrated with any type of underlying software, however it’s initial connection to Ceph is via its being a method of interacting with CloudPlatform.

CloudPortal interacts with CloudPlatform to discover what resources are available so it can present them to end-users via the web UI. As such, the fact that Ceph is storage in CloudPlatform is transparent to the end-user of CloudPortal and they merely make a request for storage capacity.

CloudPortal is currently able to request Primary storage (delivered by Ceph) in CloudPlatform. Pending development work, CloudPortal will also be able to request Secondary Storage (delivered as object storage) which is delivered by Ceph.

### XenDesktop (VDI)

XenDesktop is one of Citrix’s flagship products and provides a Virtual Desktop Infrastructure (VDI). VDI is a means to simplify the administration of hundreds or thousands of desktops by an IT department. Rather than IT managing each individual desktop or laptop, the desktops are hosted on a server and delivered over the network to a locked-down end-user device.

In this way, the end-user device requires almost no software management. The desktop, its applications, and content are stored remotely where it can be upgraded, patched and backed-up by the IT department in a single location.

As part of Project Avalon, Citrix has been working to enable XenDesktop on top of cloud infrastructure, including their CloudPlatform product. This means it is now possible to use Ceph as the storage system for desktop virtual machines. Given that storage is one of the biggest administrative pain points for VDI, Ceph’s scale-out nature and its copy-on-write and thin-provisioning features, which lead to fast boot times, are a huge advantage.

### Sharefile

Sharefile offers an on-premise/behind the firewall enterprise Dropbox-style user-interface for IT departments. The administrator can configure a number of backends to store the data both on-premise or in the cloud (backed by Amazon S3).

Currently the easiest way to take advantage of Ceph with Sharefile is via CephFS using a Samba gateway (for CIFS). However, since CephFS hasn’t been given the requisite QA love to receive an Inktank blessing, it is worth noting that Citrix is working on modifying Sharefile to use any S3-compatible object storage. This would allow RGW to plug directly in to Sharefile.

### Xen/XenServer

As of the latest versions of the open-source Xen code, there is direct use of the upstream RBD-enabled Qemu code. This means that the Xen hypervisor can now natively access RBD images similar to the integration with KVM. Other members of the Ceph community (thanks Sylvain!) have also been working on integrating RBD into the blktap driver that the Xen ecosystem uses, including XenServer (Citrix’s free & commercial product). At the moment, there is no date for which version of XenServer these changes will appear in, but if you are interested be sure to let us or the folks at Citrix know!

### Conclusion

With OpenStack, CloudStack, and raw storage Ceph really is becoming the [new black](http://ceph.com/community/ceph-is-the-new-black-it-goes-with-everything/), ready to go with any shade of integration you might want to throw at it. It’s great to see open source projects like Ceph redefining the storage space and providing unified answers to what used to be very proprietary questions. The shift towards software-defined storage and a more horizontally scalable approach is clear, however, and is even starting to show in some [fancy marketing retreads](http://www.inktank.com/storage-2/vipr-a-software-defined-storage-mullet/) as the big proprietary folks work to get caught up.

Of course, there are more integrations happening every day. Other cloud flavors like [OpenNebula](http://blog.opennebula.org/?p=4168), [Ganeti](http://ceph.com/community/ceph-comes-to-synnefo-and-ganeti/), and [Proxmox](http://pve.proxmox.com/wiki/Storage%3A_Ceph) have Ceph support as well as any number of applications available from hypervisor- and kernel-level integrations. If you have integration work that you would like to share, be sure to hit up our [community team](mailto:%20community@inktank.com). We look forward to seeing how Open Source, and the associated communities, will shape the storage industry going forward.

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/state-of-the-union-ceph-and-citrix/&bvt=rss&p=wordpress)
