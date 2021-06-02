---
title: "Stretching Ceph networks"
date: "2015-04-17"
author: "shan"
tags: 
---

This is a quick note about Ceph networks, so do not expect anything lengthy here :).

Usually Ceph networks are presented as `cluster public` and `cluster private`. However it is never mentioned that you can use a separate network for the monitors. This might sound obvious for some people but it is completely possible. The only requirement of course is to have this monitor network accessible from all the Ceph nodes.

We can then easily imagine 4 VLANs:

- Ceph monitor
- Ceph public
- Ceph cluster
- Ceph heartbeat

  

> I know this does not sound much, but I've been hearing this question so many times :).
