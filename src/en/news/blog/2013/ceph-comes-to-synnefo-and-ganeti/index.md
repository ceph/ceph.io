---
title: "Ceph Comes to Synnefo and Ganeti"
date: "2013-02-12"
author: "scuttlemonkey"
tags: 
---

During my most recent schlep through Europe I met some really great people, and heard some awesome Ceph use cases. One particularly interesting case was the work the guys at Synnefo shared with me at [FOSDEM](https://fosdem.org/2013/) that they have been doing with Ganeti and RADOS. They were nice enough to write up some of the details on their blog and give me permission to repost here.

If any of you have interesting things that you have done with Ceph we always want to hear about it. Feel free to send a link to [@Ceph](http://twitter.com/ceph) or email it to our [Community](mailto:community@inktank.com) alias. Now, on to the goods!

[![](images/synnefo-logo.png "synnefo-logo")](http://www.synnefo.org/)

### Synnefo + RADOS = < 3

We are happy to announce that Synnefo now supports completely unified storage (Files/Images/VM disks) over commodity hardware using RADOS. And since it’s passed the testing phase, it is now heading to our production environment (~okeanos). And it scales!

But what does “completely unified storage” mean and why RADOS?

Let’s take things from the beginning.

### Problem #1

Trying to scale a public cloud service over commodity hardware is not a trivial task. At first (mid 2011), we had all our VMs running over DRBD with Ganeti, and our File/Object Storage service (Pithos) backed by a big NAS. DRBD is great, production-quality software, enabling live migrations with no shared storage, and aggregate bandwidth that scales with the number of compute nodes. We wanted to keep all that. On the other hand, we knew that if we wanted the Storage service to scale, we had to get rid of the NAS eventually. We were also eager to explore new paths of having the same backing storage for VM disks and files.

An obvious choice would be to use a distributed filesystem running over commodity hardware, such as Lustre, GPFS or GlusterFS. Ganeti already supported VM disks over shared files, so the only overhead would be to write a shared file driver for our Storage service, which was trivial. However, we quickly realized that we didn’t really need filesystem semantics to store VM volumes, and we could certainly avoid the burden of having to take care of a distributed filesystem. Object/block semantics was what we were looking for.

So, we decided to test RADOS, since we had already been following the progress of Ceph from mid 2010. For the VM disks part, we implemented RBD support inside Ganeti and merged it into the official upstream. Starting with version 2.6, Ganeti supports instance disks on RADOS out of the box. It uses the RBD kernel driver and the RBD tools to do that. Furthermore, we implemented a RADOS backend driver for our Storage service. We chose not to go with RadosGW since we already had in production a storage frontend that implemented the OpenStack Object Storage API and also allowed for more advanced features such as deduplication via content hashing, file sharing among users etc.

By late 2011, we had it all up and running for testing. The architecture looked like this:

[![](images/synnefo_arch-300x184.png "synnefo_arch")](http://ceph.com/wp-content/uploads/2013/02/synnefo_arch.png)

The above made two things possible: a) it enabled selection of the storage type for VMs, either RBD or DRBD, as an option for Synnefo end users, and b) it enabled Synnefo administrators to choose between a RADOS cluster or NFS / NAS as a backend for the Storage service. With this approach, we continued to do live migrations of VMs with no physically shared storage, this time over RBD to any physical node and not just DRBD’s secondary node. And we experimented with having RBD-based VM disks in the same RADOS storage cluster as files. So far, so good.

### Problem #2

This seemed quite a success at the time, but still didn’t allow us to do magic. And by magic we mean the type of Image handling we were envisioning. We wanted to achieve three things at the same time:

- From the perspective of the Storage service, Images being treated as common files, with full support for remote syncing and sharing among users.
- From the perspective of the Compute service, Images cloned and snapshotted repetitively, with zero data copying from service to service.
- And finally, snapshots appearing as new Image files, again with zero data movement.

So, what could we do? We liked the architecture so far, with Synnefo, Ganeti and RADOS. RADOS seemed a good choice for consolidating storage of VM disks and files in a single place. We decided to design and implement a thin, distributed, custom storage layer completely independent from Synnefo, Ganeti or RADOS that could be plugged in the middle and do the job. If this worked, we could get to keep the goodies of all three base technologies, and work with well-defined abstractions among them. And that’s what we did.

By mid 2012 we had the prototype ready. We called it Archipelago. Then, we needed to integrate it with the rest of the infrastructure and start stress-testing. The integration happened in two directions: with Ganeti, on one side, and with RADOS, on the other.

To integrate with Ganeti, we stopped using Ganeti’s native RBD support to talk to RADOS, since we now had Archipelago in between. We exploited Ganeti’s ExtStorage Interface and wrote the corresponding Archipelago driver (ExtStorage provider) for Ganeti.

To integrate with RADOS, we implemented a RADOS driver for Archipelago. Finally, by late 2012 we had the code completed and have been testing it ever since. The architecture now looks like this:

[![](images/synnefo_arch1-300x184.png "synnefo_arch1")](http://ceph.com/wp-content/uploads/2013/02/synnefo_arch1.png)

After 3 months of stress testing, we are now in the process of moving everything into ~okeanos production, which is running more than 2700 active VMs for more than 1900 users, at the time of this writing.

For the impatient, the new feature is already up and running on our free trial demo infrastructure at:

[http://www.okeanos.io](http://www.okeanos.io)

So, create a free trial account and choose the “Archipelago” disk option when creating your new VM. You will see it coming up in seconds, thinly! Backed by RADOS ![:)](http://ceph.com/wp-includes/images/smilies/icon_smile.gif)

Enjoy!

—————-

_REPOSTED FROM:_ [http://www.synnefo-software.blogspot.com/2013/02/we-are-happy-to-announce-that-synnefo\_11.html](http://www.synnefo-software.blogspot.com/2013/02/we-are-happy-to-announce-that-synnefo_11.html)

