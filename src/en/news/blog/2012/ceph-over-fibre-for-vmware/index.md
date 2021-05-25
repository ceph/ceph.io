---
title: "Ceph Over Fibre for VMWare"
date: "2012-12-24"
author: "scuttlemonkey"
tags: 
  - "planet"
---

We always love it when Ceph users choose to share what they have been doing with the community. Recently, a couple of regulars to the #ceph [IRC channel](http://ceph.com/resources/mailing-list-irc/) were good enough to give us a very detailed look at how they were using Ceph to power their VMWare infrastructure. So, without further ado, read on for a great visual representation and quick summary of Chris Holcombe and Robert Blair’s pet Ceph project!

  

[![](images/2012-12-10_13-51-31-220x140.png "2012-12-10_13-51-31")](http://ceph.com/wp-content/uploads/2012/12/2012-12-10_13-51-31.png)

> We have extremely expensive storage here for everything. The only choices when people ask for storage are expensive, or extremely expensive. After reading about Ceph in the kernel change logs it got me thinking. If I could build my own fibre-based storage it could save the company millions. We have a large need for storage that is cheap and expandable. Our infrastructure is virtual machine heavy. The storage for that doesn’t need to be the fastest out there it just needs to keep expanding. Ceph did most of the heavy lifting already with self-healing and easy expansion. My goal for this project was to create storage that could be used to migrate our pre-production and development VMware clusters onto. Eventually when enough time passed that everyone felt comfortable I would make the case for migrating the production virtual machine clusters over to this. At this point I’m using it as a way to stretch our expensive storage a lot further.
> 
> Right now we have purchased hardware for the production cluster that we’re waiting to come in. I have built a testing instance of Ceph with the fibre proxies and hooked it up to Vmware. LIO gives you the ability to create a fibre target with any block device. I created a python script that automatically mounts Ceph block devices at boot time in the correct order so LIO can export them again. Testing will begin later today on failing back and forth between the fibre channel paths while ensuring no interruptions to the VMware clients.
> 
> My next milestone will be when we are satisfied with the failover ability of all the pieces and we start migrating virtual machines onto the storage. I expect that will happen in the next month or so.
> 
> All of this is built on HP DL180G6 servers with 1GB flash cache raid cards and 12 3TB drives. These have internal usb drives that I might use to install the operating system onto and save space.

We would love to hear about _your_ Ceph project. If you wouldn’t mind sharing your interesting project with the community we encourage you to [email us](mailto:community@inktank.com) or just poke ‘scuttlemonkey’ on the #ceph [IRC channel](http://ceph.com/resources/mailing-list-irc/). There are so many great use cases for Ceph, and it’s always great to see another one that we hadn’t even thought of. There is even a free Ceph t-shirt or two in it for those with truly interesting or innovative ideas that we can let our community know about. And who doesn’t love a free t-shirt?

