---
title: "Ceph and RBD mirroring, upcoming enhancements"
date: "2017-02-16"
author: "admin"
tags: 
  - "planet"
---

![Ceph and RBD mirroring, upcoming enhancements](images/rbd-mirror-upcoming-enhancements.jpg)

I’ve been getting a lot of questions about the RBD mirroring daemon so I thought I will do a blog post similar to a FAQ. Most of the features described in this article will likely be released for Ceph Luminous. Luminous should land this fall, so be patient :).

## HA support

A crucial part of an application is its ability to be deployed in a highly available fashion. The ideal scenario is when the application natively handles its own HA. This is exactly the design that will be implemented for the rbd-mirror daemon. We will have the possibility to run any number of daemons on any number of machines. They will all deterministically distribute the load and the number images that a daemon should be responsible for.

The HA model will rely on collaborative daemons, where they will be able to discuss altogether and determines which one should handle which image. The depends on some factors, such as the current load and/or the current number of images being replicated by a specific daemon.

## Multiple peers

Currently, on Ceph Jewel and Kraken, we do support the following relationships between daemons:

- 1 to 1: one primary and one non-primary cluster. This is mostly a disaster recovery use case where you have a main Ceph cluster that serves application data and on another site, you have an idle cluster only receiving images from the primary site. The secondary site does not run any applications that might consume it.
    
- 1 to many: same as 1 to 1, the only difference is that we have multiple non-primary locations to where we replicate our Ceph images.
    

However, we do not support the ‘many’ to ‘many’ case, which plays a crucial role on multi-site deployments. If an operator decides to deploy three OpenStack regions, it will definitely want to create a mesh replication between each site. This is currently not possible. The only thing we can do to mitigate this is to configure a chained replication like this A –> B –> C –> A. This forms a replication ring.

This is not ideal as not every site will have each other data, since we want resiliency we need that.

## Delayed deletion

The replication using the rbd-mirror is asynchronous, however, if someone deletes the primary image, the non-primary image on the secondary cluster will be deleted as well. This means that if someone accidentally deletes an image, then this image is lost forever. Operators would like to prevent this kind of events, this is why a configuration delayed deletion is important. It will allow us to, for example, set a delayed time for deletion to 4 hours. Within that time frame, anyone who might have accidentally deleted an image can claim it back.

## Clone non-primary images

One major use case and fit for Ceph is to use it as the de facto block storage solution for OpenStack. Cloud providers want to deploy OpenStack across multiple sites in a resilient way. To achieve this resiliency, they could deploy two independent OpenStack clouds from each other and configure a cross-replication of Glance and Cinder images between both sites.

Since this setup runs in an active-active fashion, one would want to utilize Glance images from any site. Let’s assume for a second we have the ability to replicate Glance images metadata (DB records) seamlessly from one cloud to another. Along with this, the rbd-mirror will configure to replicate any images from any site to the other one. Presently, non-primary images, the ones being replicated can not be read. They are basically read-only, even worse they can not be cloned. The cloning functionality is one of the keystones of the integration between Glance and Nova when booting an image. If you lose this, we are losing one of the best Ceph features we have brought into OpenStack.

If we can not clone the images we replicated from the primary site then these images can not be used by the secondary OpenStack environment. As a result, they are useless. This is why we need to be able to clone non-primary images on that secondary site.

## QoS throttles for replication

Depending on the type and the distance, links between datacenter can be very expensive. Putting the monetary aspect on the side they could also serve a different purpose. Consequently, one would want to configure a certain QoS on the replication between two rbd-mirror daemons.

## Configurable replication delay

Connected to the previous feature, it is pretty fair to assume that the replication can be delayed on purpose. In the scenario, we allow an administrator to configure a time-delay for rbd-mirror asynchronous replication (e.g. the non-primary site is X hours behind the primary site).

## Add a promote-all call on a pool

In an event of a failure, non-primary images need to be promoted to primary (so a failover is happening). OpenStack Cinder current replication API implementation iterates through each image of a pool and promotes them. Going through each image one by one can take a substantial amount of time so we are looking at parallelizing this sequence.

Since the primary/non-primary state of an image is per-image (not per-pool), no matter what, it would involve looping through all images in a pool. The cli could do some tricks like batch X promotions in parallel, we will use something similar to `concurrent_management_ops` would be nice I guess

  

> Don’t get too exciting, Ceph Luminous is scheduled for this Fall and not before. Also, keep in mind that not all the features listed above might make it to Luminous.

Source: Sebastian Han ([Ceph and RBD mirroring, upcoming enhancements](https://sebastien-han.fr/blog/2017/02/16/Ceph-and-RBD-mirroring-upcoming-enhancements/))
