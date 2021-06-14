---
title: "CloudPlatform and Ceph: Delivering the Power of Choice"
date: "2013-09-24"
author: "scuttlemonkey"
tags: 
---

The [CloudPlatform 4.2](http://blogs.citrix.com/2013/09/24/future-proof-your-cloud-strategy-with-citrix-cloudplatform-4-2/) eagle has landed! This is especially exciting for Ceph users as it expands the integration footprint to give much better breadth and depth. The best part? The Ceph community was leading the charge on the integration work, and has done an amazing job in delivering powerful options to the end users.

While I have been interacting with the Open Source community for well over a decade, I am still surprised and impressed at how much momentum can be created by a single developer who is simply “scratching an itch.” Of course with many developers, and many itches, comes a wealth of choices for software consumers. Thankfully an ever growing number of savvy companies are helping to fuel this effort, packing it up, and putting their stamp of approval on it (to say nothing about putting their support organizations behind it) so that more traditional enterprises can easily consume this software with confidence. While I’m most intimately involved with how [Inktank](http://inktank.com) is [bringing Ceph](http://www.inktank.com/products/) to the world, I thought it might be more interesting to explore this phenomenon through the number of community-driven efforts leading to powerful options for [CloudPlatform users](http://www.citrix.com/products/cloudplatform/overview.html).

### Community Built

Before the instantiation of Inktank, the Ceph community was already building integrations and solution to many things, including CloudStack, and by extension, CloudPlatform. The first of these was an integration built by [42on](http://42on.com)‘s Wido den Hollander that allowed CloudStack to utilize Ceph as alternate Primary storage. This allows Virtual Machines being hosted in that users public or private cloud to have their data stored on distributed storage with no single point of failure that was designed to scale to exabytes and beyond. The integration has since grown to also be able to function as _the_ primary storage device, replacing the previously required NFS mount, as well as being able to provide secondary storage (ISOs, backups, etc).

More recently users have also built an integration that allows Ceph to [work with the Xen hypervisor](http://xenserver.org/blog/entry/tech-preview-of-xenserver-libvirt-ceph.html). This gives users the flexibility of interchangeable hypervisors depending on their needs or preferences between Qemu/KVM and Qemu/Xen. Many users, especially those in mixed-OS environments, have already gravitated towards Xen, so now users can leverage the power of Ceph regardless of which hypervisor makes the most sense for their particular use case.

These are both great examples of community-driven projects that, while originally born out of a single user’s need or curiosity, have come together to offer consumers many integration options in their technology stack.

### No Lock In

The obvious question here is: “What about this is new? Open Source has been providing these types of solutions for years.” While the approach is certainly not new, the industry it is affecting is. Historically, the storage industry has been held hostage by large, monolithic solutions that are both inflexible and closed. The net result is that users have had to pay huge costs, both in capital outlay and opportunity cost, to adapt their infrastructure to accomodate. CloudPlatform, Ceph, and others are all working to bring Open Source ideals to bear on the problem and provide the freedom of choice.

Storage especially is an incredibly intricate and complex problem to solve, especially as it relates to the cloud. Ceph is working hard to give users the flexibility and power they need while offering the simplicity of management that wont exacerbate and already complex solution. Likewise, CloudPortal is working hard to package the many moving parts that go into a cloud solution, include implementation choices at every step, while still maintaining the end-to-end simplicity of a comprehensive enterprise solution.

This lack of lock-in gives users a fungible solution that is capable of fitting many different use cases while maintaining the solidity of an enterprise solution. This also means that the software can come with enterprise-grade support which both CloudPlatform and Ceph have available.

### Looking Forward

The future of this integration is definitely bright. With CloudPlatform 4.2 the integration is getting even better. [Copy-on-write](https://en.wikipedia.org/wiki/Copy-on-write), [snapshotting](https://en.wikipedia.org/wiki/Snapshot_(computer_storage)), and [cloning](https://en.wikipedia.org/wiki/Disk_cloning) will all be included with this release of the software. This gives users enterprise storage features as a part of their cloud deployment.

The deployability and integrations continue to evolve, and will only accelerate as more users get involved. There has definitely been a jump in interest as word has spread. One great example of this was the results from the [Fintech Innovation Program](http://www.americanbanker.com/issues/178_134/fintech-event-showcases-security-storage-big-data-startups-1060572-1.html). This showcase, and many others like it, are shining the spotlight on Open Source solutions to help large companies stay ahead of the technology curve as it relates to infrastructure, of which cloud is featuring prominently.

### Conclusion

Open Source, once again, is demonstrating its power and dominance in reshaping the market by allowing the power of distributed development to work together with enterprise packaging and support. CloudPlatform and Ceph are great examples of offerings that are both open and adaptable as well as available via shrink-wrapped and ready-to-run offerings. The combination is allowing a wide range of adoption and engagement that will only serve to further fuel the power and acceleration with which these offerings are developed. The future of cloud, Ceph, and CloudPlatform is bright, can’t wait to see what comes next.

scuttlemonkey out

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/open-source-gives-the-gift-of-options-cloudplatform-and-ceph/&bvt=rss&p=wordpress)
