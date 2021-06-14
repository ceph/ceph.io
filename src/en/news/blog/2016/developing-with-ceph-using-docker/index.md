---
title: "Developing with Ceph using Docker"
date: "2016-10-28"
author: "admin"
tags: 
  - "planet"
---

As you're probably aware, we're putting a lot of effort into improving the Ceph management and monitoring capabilities of openATTIC in collaboration with SUSE.

One of the challenges here is that Ceph is a distributed system, usually running on a number of independent nodes/hosts. This can be somewhat of a challenge for a developer who just wants to "talk" to a Ceph cluster without actually having to fully set up and manage it.

Of course, you could be using tools like SUSE's Salt-based [DeepSea](https://github.com/SUSE/DeepSea) project or [ceph-ansible](https://github.com/ceph/ceph-ansible), which automate the deployment and configuration of an entire Ceph cluster to a high degree. But that still requires setting up multiple (virtual) machines, which could be a daunting or at least resource-intensive task for a developer.

While we do have a number of internal Ceph clusters in our data center that we can use for testing and development purposes, sometimes it's sufficient to have something that behaves like a Ceph cluster from an API perspective, but must not necessarily perform like a full-blown distributed system (and can be set up locally).

Fortunately, [Docker](https://www.docker.com/) comes to the rescue here - the nice folks at Ceph kindly provide a special Docker image labeled [ceph/demo](https://hub.docker.com/r/ceph/demo/), which can be described as a "Ceph cluster in a box".

[Read more…](/posts/developing-with-ceph-using-docker/) (2 min remaining to read)

Source: SUSE ([Developing with Ceph using Docker](https://www.openattic.org/posts/developing-with-ceph-using-docker/))
