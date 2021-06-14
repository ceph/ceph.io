---
title: "Non profit OpenStack & Ceph cluster distributed over five datacenters"
date: "2014-05-03"
author: "loic"
tags: 
  - "ceph"
---

A few non profit organizations ([April](http://april.org/), [FSF France](http://fsffrance.org/), [tetaneutral.net](http://tetaneutral.net/)…) and volunteers constantly research how to get compute, storage and bandwidth that are:

- 100% Free Software
- Content neutral
- Low maintenance
- Reliable
- Cheap

The latest setup, in use since ocbober 2013, is based on a [Ceph](http://ceph.com/) and [OpenStack](http://openstack.org/) cluster spread over five datacenters. It has been designed for the following use cases:

- Free Software development and continuous integration
- Hosting low activity web sites, mail servers etc.
- Keeping backups
- Sharing movies and music

[![](images/datacenters.png "datacenters")](http://dachary.org/wp-uploads/2014/05/datacenters.png)

  
The cluster is made of twenty nodes with ~100 cores, 500GB RAM and 60TB of raw storage.

## OpenStack

All hypervisors run [OpenStack Havana](https://www.openstack.org/software/havana/) [installed with puppet](http://redmine.the.re/projects/there/wiki/HOWTO_setup_OpenStack/). Each individual and organization is trusted ultimately and the tenants are a convenient way to avoid mistakes, not to enforce security. It greatly reduced the number of human errors compared to sharing root access on a [Ganeti](http://code.google.com/p/ganeti/) cluster.

[![](images/dashboard-1024x646.png "dashboard")](http://dachary.org/wp-uploads/2014/05/dashboard.png)

Each hypervisor is paid for by a different entity, with very different access policy and cost. The general consensus is that everyone consumes roughly the amount of resources it contributes to the cluster. With the exception of transition phases (when renewing an hypervisor) or hardware breakage, in which case the spare resources of the cluster are used for as long as it takes to recover. For instance when decommissioning an OVH hardware, all instances it contains are restarted on other hypervisors and the Ceph OSD is removed.  
A number of users feel more comfortable running their instances on the hardware they pay for. The **forced\_host** policy is allowed for everyone so that [–availability-zone ovh:bm0014.the.re](http://dachary.org/?p=1082) can be used to target the **bm0014.the.re** hypervisor.

## Network

Datacenters have various levels of internal connectivity (down to 100Mb/s for OVH hosted hardware, up to 10Gb/s at tetaneutral.net) and latency (over 20ms between tetaneutral and Hetzner and less than 5ms between Cloudwatt and FSF France). Some datacenters are assigned a public IPv4 subnet, others do not have public IPs.  
A [tinc based full mesh](http://dachary.org/?p=1190) connects all the nodes in the cluster so that all nodes share a common subnet. When the tinc daemon is a performance bottleneck, routes are added to bypass it. For instance it is used to maximize the performances of two Ceph OSDs residing on the gigabit network at FSF France.  
[![](images/network.png "network")](http://dachary.org/wp-uploads/2014/05/network.png)  
Each datacenter runs an [L3 agent](http://developer.rackspace.com/blog/neutron-networking-l3-agent.html) routing the IPs of the AS in which it resides (possibly with a [hack when isolated IPs are to be handled](http://dachary.org/?p=2466)).  
An instance running anywhere in the cluster can use a floating IP exiting in another datacenter. [dachary.org](http://dachary.org/) is an instance running on the OVH datacenter and using a floating IP from the FSF France datacenter.  
[Neutron](https://wiki.openstack.org/wiki/Neutron) is configured with [OpenVSwitch](http://openvswitch.org/) and [GRE](http://en.wikipedia.org/wiki/Generic_Routing_Encapsulation), making sure each L3 agent [runs with a linux-3.13 kernel](http://dachary.org/?p=2961) to avoid performance issues.

## Storage

Each hypervisor provides an LVM pool designed to be [associated with the instances running on it](http://dachary.org/?p=2494), for performance reasons. The Ceph cluster is given the rest of the storage capacity. It has one pool encompassing all disks, with a placement rule imposing that no two copies of a given object are in the same datacenter. It also defines one pool per datacenter which can be used to improve performances. The data stored in such a pool would be lost if the datacenter was to be destroyed.

\# ceph osd tree
# id	weight	type name	up/down	reweight
-1	33.57	root default
-5	7.28		datacenter ovh
-2	1.82			host bm0014
0	1.82				osd.0	up	1
-3	1.82			host bm0015
1	1.82				osd.1	up	1
-12	3.64			host bm0017
7	3.64				osd.7	up	1
-6	4.55		datacenter hetzner
-7	2.73		datacenter cloudwatt
-8	0.91			host bm0501
3	0.91				osd.3	up	1
-9	0.91			host bm0502
4	0.91				osd.4	up	1
-10	0.91			host bm0503
5	0.91				osd.5	up	1
-13	11.73		datacenter fsf
-14	7.23			host bm0101
8	3.64				osd.8	up	1
13	3.59				osd.13	up	1
-15	4.5			host bm0102
9	0.91				osd.9	up	1
12	3.59				osd.12	up	1
...

Both [storage policies are made available to each tenant](http://dachary.org/?p=2518) via the dashboard or the command line:

$ cinder create --availability-zone bm0014 \\
   --volume-type lvm \\
   --display-name volume-in-the-bm0014-hypervisor-vg 100
$ cinder create --volume-type fsf --display-name volume-in-fsf-ceph-pool 100

The Ceph overhead cross datacenter has never been a problem, despite datacenter failures lasting hours. Because it is distributed over WAN, it is disrupted much more often than a Ceph cluster with a good connectivity.

## Compute

All hypervisors run KVM.

## Neutrality

The content stored and shared outside the cluster is the responsibility of each individual and organization. The cluster is deliberately designed to know as little as possible about the activity of its users and they are encouraged to systematically use cryptography to protect their privacy.  
For instance, the disk of a virtual machine should be [encrypted](http://en.wikipedia.org/wiki/Dm-crypt) when it is allocated from [RBD](http://ceph.com/docs/master/rbd/rbd/) so that its content, although spread among many disks, cannot be recovered or analyzed by a third party.

## Use cases

### Instances archives

When an instance booted from a Ceph RBD volume is no longer needed, it is shutdown. When and if it is needed again, it can be booted again. If the associated Ceph pool becomes full, an erasure coded tier can be added to evict objects colder than a month.

### Sharing movies and music

A 4TB disk is allocated to store movies and music shared by a few individuals. The disk is allocated from Ceph and can [grow dynamically when necessary](http://dachary.org/?p=2241). The Ceph pool used is going to be tiered with an [erasure coded](http://ceph.com/docs/firefly/dev/erasure-coded-pool/) pool to reduce the raw disk usage.

### Continuous integration

Short lived instances are booted from LVM volumes [located on the same hypervisor](http://dachary.org/?p=1082) for maximum I/O performances without network usage.

## Free Software

Proprietary software does not exist.

## Usage value

Bare metal resources are at least five times cheaper than their equivalent in the cloud. The high reliability of Ceph helps volunteers to reduce the maintenance cost (time or money) by choosing when to replace a hardware. It extends beyond storage : if an hypervisor fails entirely, only the data needs to be recovered, not the CPU or the RAM or the network connectivity. The replacement of the hypervisor can wait until it can be done cheaply or conveniently. When installing a new hardware, the manual steps require two or three hours, all included. A recent machine is expected to work reliably during at least three years. Before the OpenStack Havana + Ceph cluster, an OpenStack Essex + LVM cluster has been used and part of it still exists. It went through a few [accidents](http://dachary.org/?p=1961), as is to be expected in any cluster, but most tenants were able to use it without any intervention during more than six months at a time.

## Conclusion

I find such a cooperatively maintained cluster more flexible, cheaper and more reliable than any other solution. Although I spend more time than anyone caring for it, I’ve been able to use it during months (december 2013 to february 2014 included) without any system administration related work. Being able to use raw compute/storage/network over long periods of time without maintenance is made possible by highly reliable software such as KVM or Ceph. Human error then becomes the main source of problem but OpenStack tenants gradually reduces this burden. I hope to be able to forget about maintenance during a full year while using the cluster on a daily basis. I’m already quite happy to have runs of three months ![;-)](http://dachary.org/wp-includes/images/smilies/icon_wink.gif)
