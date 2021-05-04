---
title: "Start considering Ceph as a backend for OpenStack Cinder (to replace LVM)"
date: "2014-06-02"
author: "shan"
tags: 
  - "planet"
---

![Please drop LVM and use Ceph as a backend for OpenStack Cinder](http://sebastien-han.fr/images/drop-lvm-for-ceph-cinder-openstack.jpg)

Just back from the Juno summit, I attended most of the storage sessions and was extremely shocked how Ceph was avoided by storage vendors. However LVM, the reference storage backend for Cinder was always mentioned. Maybe, is it a sign that Ceph is taking over? Talking about LVM, the last OpenStack survey showed that it was the more used backend.

  

# Genesis

It is funny to see how storage guys picture the OpenStack Cinder ecosystem. On one side, you have the default open source LVM driver that is considered cheap and a decent way to start providing block storage for your virtual machines (which is true). On the other side, you have proprietary solutions like EMC, NetApp and Solidfire. The latest are considered as real solutions for deploying block storage for Cinder since they provide high availability and performance. It looks like there is nothing in between... Oh! Wait a second, I feel something strange here... OH yes we completely move out of the scope other reliable, scalable and robust solutions such as Ceph and Sheepdog. Both have a distributed architecture that makes them highly available. So yes, real open source alternatives exist to start with block storage for OpenStack. If you read this blog, you have certainly understood how much I love Ceph and how powerful is it. This article doesn't intend to put oil on the fire and starting a huge debate. I will just try to be realistic, honest and fair.

  

# So why Ceph instead of LVM?

To give you some background, Cinder is the Openstack component that is responsible for exposing block devices to virtual machines. Cinder has 27 storage drivers, and only 4 of them are open source, the rest are proprietary solutions:

- Ceph RBD
- GlusterFS
- NFS
- LVM: reference implementation

Getting Ceph the de facto storage backend for Openstack. You can start with ceph with the exact same amount of machines than other backend like LVM or NFS.

In order to get into Cinder, LVM is easy and I believe it is a good exercise to go through at least once in your OpenStack experience. However this won't last, as production is coming you will definitely consider something more scalable that provides some high availability functions. Nowadays, it's all about these 2 and there are the only missing things from LVM. By introducing the multi-backend functionality LVM has been extended in terms of scalability. Unfortunately achieving high availability remains difficult, if the server doing LVM goes down, all your Cinder blocks won't response anymore and will be stuck unavailable for a certain amount of time.

This is why you're looking for reliability, availability and robustness. These 3 factors are what's defining Ceph.

  

> Ceph is a unified, distributed, massively scalable open source storage solution!

  

The learning curve for Ceph is pretty steep but trust me, it is worth learning it. Some of you might think that in order to start with Ceph you need at least 3 machines. Well the answer is yes and no. Yes it's recommended to start with 3 machines especially if you want to test the replication and the recovery mechanisms. However these 3 machines don't have to be dedicated, so you can easily collocate compute nodes with your storage entities. Let's be realistic if you seriously want to start with OpenStack, you will at least need 3 machines. You can easily collocate everything on them, thanks to this you will be able to test features like high availability, live migration etc...

Basically your 3 machines will run:

- HAProxy | Keepalived
- OpenStack APIs
- MySQL Galera | RabbitMQ | MongoDB
- Nova-compute
- Ceph

This setup can be consider as a sandbox where you can test diverse things from OpenStack.

Although, if you are a developer and the only thing you seek is a dev environment, will then you might be interested into [Devstack Ceph](https://review.openstack.org/#/c/65113/). With its help, you will be able to efficiently and quickly bootstrap a dev environment and start playing with OpenStack with Ceph. I expect to see this patch getting into Devstack pretty soon (well I've been saying this for months now...).

  

  

> Don't get me wrong, the purpose wasn't to reject LVM or anything like this. It's just that I believe Ceph is the way to go when it comes to storage with OpenStack. A recent study showed that Ceph was at the second position (and really close) just behing LVM (LVM has 63 and Ceph 58). What I wanted to demonstrate in this article is that we can definitely get to the top. As usual comments are welcome.
