---
title: "Ceph Cuttlefish Release has Arrived!"
date: "2013-05-07"
author: "nwl"
tags: 
  - "ceph"
---

­­Today marks another milestone for Ceph with the release of Cuttlefish (v0.61), the third stable release of Ceph. Inktank’s development efforts for the Cuttlefish release have been focused around Red Hat support and making it easier to install and configure Ceph while improving the operational ease of integrating with 3rd party tools, such as provisioning and billing systems. As ever, there have also been a ton of new features we have added to the object and block capabilities of Ceph, as well as with the underlying storage cluster (RADOS), alongside some great contributions from the community.

So what’s new for Ceph users in Cuttlefish?

**Ease of installation:**

- Ceph-deploy: a new deployment tool which requires no other tools and allows a user to start running a multi-node Ceph cluster in minutes. Ideal for users who want to do quick proof of concepts with Ceph.

- Chef recipes: a new set of reference Chef recipes for deploying a Ceph storage cluster, which Inktank will keep authoritative as new features emerge in Ceph. These are in addition to the Puppet scripts contributed by eNovance and Bloomberg, the Crowbar Barclamps developed with Dell, and the Juju charms produced in conjunction by Canonical, ensuring customers can install Ceph using most popular tools.

- Fully tested RPM packages for Red Hat Enterprise Linux and derivatives, available on both the ceph.com repo and in EPEL (Extra Packages for Enterprise Linux).

**Administrative functionality:**

- Admins can now create, delete or modify users and their access keys as well as manipulate and audit users’ bucket and object data using the RESTful API of the Ceph Object Gateway. This makes it easy to hook Ceph into provisioning or billing systems.

- Administrators can now quickly and easily set a quota for a RADOS pool. This helps with capacity planning management as well as preventing specific Ceph clients from consuming all available data at the expense of other users.

- In addition, to the pool quotas, administrators can now quickly see the total used and available capacity of a cluster using the _ceph df_ command, very similar to how the generic UNIX df command works with other local file systems.

**Ceph Block Device (RBD) Incremental Snapshots**

It is now possible to just take a snapshot of the recent changes to a Ceph block image. Not only does this reduce the amount of space needed to store snapshots on a cluster, but forms the foundation for delivering disaster recovery options for volumes, as part of the popular cloud platforms such as OpenStack and CloudStack.

You can see the complete list of features in the release notes are available at  [http://ceph.com/docs/master/release-notes/](http://ceph.com/docs/master/release-notes/). You can also check out our [roadmap page](http://www.inktank.com/about-inktank/roadmap/) for more information on what’s coming up in future releases of Ceph. If you would like to contribute towards Ceph, you can visit [Ceph.com](http://ceph.com/) for more information on how you can get started and we invite you to join our online Ceph Development Summit on Tuesday May 7th, more details available at [http://wiki.ceph.com](http://wiki.ceph.com/).

![](http://track.hubspot.com/__ptq.gif?a=265024&k=14&bu=http%3A%2F%2Fwww.inktank.com&r=http%3A%2F%2Fwww.inktank.com%2Fceph-blog%2Fceph-cuttlefish-release-has-arrived-2%2F&bvt=rss&p=wordpress)
