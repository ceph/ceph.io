---
title: "Inktank’s Roadmap for Ceph: Massive scale with Minimal effort"
date: "2013-03-21"
author: "nwl"
tags: 
  - "ceph"
---

It’s been just over a year since Inktank was formed with a goal of making Ceph the ‘Linux of Storage’. But while Inktank is a young company, Ceph itself has a longer history, going back to Sage Weil’s PhD in 2005. The intervening years saw much of the engineering work focused on building the foundations for an architecture that can scale to meet the demands of today’s data growth. The design of that architecture both reflects the cutting edge of academic research into distributed storage systems and the experience of people running hosting providers, who continue to be in the vanguard of handling storage scaling issues.

This engineering effort and design factors have turned Ceph into the only open storage platform that can scale with near-linear performance while being flexible enough for a variety of storage needs, including object, block and file.

The goal now is to bring these benefits to as many people as possible. As such, Inktank’s focus for the next set of stable releases of Ceph is on lowering the barriers to installing and managing Ceph while continuing to deliver enterprise robustness.

We believe that scale is not just about capacity and performance but about people and processes and this has informed our roadmap.

First, this means deployment needs to be as easy as possible. To this end we have introduced a new all-in-one script for quickly bootstrapping and managing a Ceph cluster, called ceph-deploy. This script is ideal for users who want to quickly try out Ceph without the overhead of installing extra tools. We are also working hard on ensuring the Ceph packages are available and tested on as many platforms as possible, including Red Hat Enterprise Linux, CentOS, SLES and Ubuntu. Our packages will always be available at ceph.com but we are working to make them directly available inside these distributions too.

Second, we want to ensure that Ceph can integrate into whatever tools your team are already using. We are developing simple RESTful APIs to the common management functions giving admins the freedom to choose their owns tools or integrate Ceph into existing operations environments. We are starting with the Ceph Object Gateway (rgw) so customers can hook Ceph into their user provisioning and billing systems and we will subsequently be working on APIs into the Ceph Storage Cluster itself (rados).

Finally, and reflecting one of the most common requests from customers, the Ceph Object Gateway will allow users to deploy Ceph across multiple regions. This will not only give users the flexibility to choose which physical location to store object data but also allow administrators to create a disaster recovery setup to ensure continuous service.

These features reflect just a small section of the activity that Inktank and the rest of the Ceph community are working on for the Cuttlefish and Dumpling releases and beyond, and most importantly they will be **100% open-source**.

To take a look at the rest of the roadmap, check out [http://www.inktank.com/about-inktank/roadmap](http://www.inktank.com/about-inktank/roadmap) or the project tracker at [http://tracker.ceph.com](http://tracker.ceph.com/)

