---
title: "Get cracking with Ceph 12.2 Luminous!"
date: "2017-09-01"
author: "admin"
tags: 
  - "planet"
---

I’ve repeatedly [blogged](https://www.hastexo.com/blogs/florian/2016/02/08/hx212-is-live/) about our **Ceph Distributed Storage Fundamentals (HX212)** course, which enables you to learn the fundamentals of the Ceph distributed storage platform, and apply your new knowledge in a fully distributed learning environment where you build your own Ceph cluster. Like all of our courses on [hastexo Academy](//academy.hastexo.com), HX212 is refreshed monthly, and the September 2017 course run comes with some very interesting news.

## Ceph 12.2 Luminous: the next generation

The 12.2 Luminous release, [announced on August 29,](http://ceph.com/releases/v12-2-0-luminous-released/) is a big leap for Ceph. It is the first release with a new OSD backend (BlueStore), there is better support for EC pools, `ceph-mgr` has been added, and there are a multitude of other improvements across the board.

* * *

## What’s new in HX212?

We’ve actually had some support for Luminous in our August HX212 course run, but we can finally make it official now that the release has dropped. [The September run](https://academy.hastexo.com/courses/course-v1:hastexo+hx212+201709/about) has a bunch of interesting additions.

### Updates from Jewel to Luminous

By popular demand (we listen to our customers), we chose _not_ to just rebase the entire course on Luminous. Instead, HX212 learners will continue to start out deploying a cluster based on the prior release, Jewel — and then run through a full, live, no-downtime upgrade process.

### `ceph-ansible`

We’re also combining that with another new piece of technology we want to introduce you to: rather than upgrading your cluster with `ceph-deploy`, you can now take over the entire cluster with Ansible (making use of the [ceph-ansible](//github.com/ceph/ceph-ansible) set of roles and playbooks), which exposes you to another very popular way of managing Ceph clusters.

### BlueStore (of course)

And finally, we’re showing you how you can convert your entire cluster, OSD by OSD, to BlueStore. Not only does this give you the ability to explore and experiment with BlueStore, it also illustrates what little disruption a FileStore to BlueStore migration causes.

* * *

## Want to know more?

We’re always happy to answer questions you may have about HX212 or any other courses in our curriculum. [Feel free to drop us a line!](/contact)

Source: Hastexo ([Get cracking with Ceph 12.2 Luminous!](https://www.hastexo.com/blogs/florian/2017/09/01/hx212-luminous/))
