---
title: "Roadmap update"
date: "2011-09-03"
author: "sage"
tags: 
  - "planet"
---

We spent some time this week working on our technical roadmap for the next few months. It’s all been mostly translated into issues and priorities in the tracker ([here’s a sorted priority list](http://tracker.newdream.net/rb/master_backlogs/ceph)), but from that level of gory detail it’s hard to see the forest for the trees.

At a high level, the basic priorities are:

- osd, librados, RGW, single-mds stabilization
- RBD (rados block device) and virtualization
- packaging, general usability of tools, better docs
- OpenStack integration (mainly RBD, but also RGW)
- Hadoop integration
- clustered MDS stability

A bit more specifically, the priority list goes something like:

- expand OSD QA coverage
- RPMs, documentation, tools
- RBD performance improvements
- expand QA coverage to include (non-failure) multi-mds configurations
- basic RBD layering (copy-on-write images)
- OpenStack integration (starting with RBD backend for glance)
- Hadoop testing, QA coverage
- libvirt support for kernel RBD driver (and with it support for RBD with non-KVM hypervisors)
- improved RBD layering (various optimizations to improve performance)
- libvirt support for RBD pools (and with it e.g. gui support via virt-manager)
- RGW support for object versioning, google storage api

There are several mostly parallel goals we are pursuing here, so in the end figuring out which pieces to work on at any point of time is always a bit of a challenge (especially when it comes to features vs bugs vs qa). There will inevitably be some shift in what ends up in each release (every 2-3 weeks).

In case it isn’t clear from the above, improving stability and testing coverage continues to be a key goal. We tend to focus on bugs we currently see (or users are seeing), and expand testing on the core systems first. Although there isn’t much about the file system on this list, cfuse and kclient testing are already fairly well covered in our test suite, and that continues to expand. It just isn’t our primary focus at this point.

Questions/comments welcome! If any of these areas interests you in particular (from a technical, business, or potential employment perspective), we would of course love to hear from you.

