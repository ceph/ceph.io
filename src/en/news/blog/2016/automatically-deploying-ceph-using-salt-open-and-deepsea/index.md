---
title: "Automatically deploying Ceph using Salt Open and DeepSea"
date: "2016-11-06"
author: "admin"
tags: 
  - "planet"
---

One key part of implementing Ceph management capabilities within openATTIC revolves around the possibilities to install, deploy and manage Ceph cluster nodes in an automatic fashion. This requires remote node management capabilities, that openATTIC currently does not provide out of the box. For "traditional" storage configurations, openATTIC needs to be installed on any storage node that is managed, but you can use a single web interface for managing all of the node's storage resources.

Naturally, installing openATTIC on all nodes belonging to a Ceph cluster is not feasible.

As I mentioned in my post [Sneak Preview: Ceph Pool Performance Graphs](/posts/sneak-preview-ceph-pool-performance-graphs/), SUSE is developing a [collection of Salt files](https://github.com/SUSE/DeepSea) for deploying, managing and automating Ceph that openATTIC will build on.

The [DeepSea Documentation on github](https://github.com/SUSE/DeepSea/wiki) is a good start, but sometimes it's helpful to get a simple step-by-step guide on how to get started.

Thankfully, SUSE's [Tim Serong](http://ourobengr.com/about/) has written up a nice article that guides you through the various steps and stages involved in installing Ceph with DeepSea: [Hello Salty Goodness](http://ourobengr.com/2016/11/hello-salty-goodness/).

Hope you enjoy it!

Source: SUSE ([Automatically deploying Ceph using Salt Open and DeepSea](https://www.openattic.org/posts/automatically-deploying-ceph-using-salt-open/))
