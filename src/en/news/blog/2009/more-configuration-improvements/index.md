---
title: "More configuration improvements"
date: "2009-03-12"
author: "sage"
tags: 
  - "planet"
---

We’ve updated the configuration framework (again) so that only a single configuration file is needed for the entire cluster.

The **ceph.conf** file consists of a _global_ section, a section for each daemon type (e.g., _mon_, _mds_, _osd_), and a section for each daemon instance (e.g., _mon0_, _mds.foo_, _osd12_).  This allows you to specify options in a generic fashion where possible, using a few simple variable substitions, or in the section specific to the daemon type or daemon.  For example,

> \[global\]
> 
>         pid file = /var/run/ceph/$name.pid
> 
> \[osd\]
> 
>         osd data = /data/osd$id
> 
> \[osd0\]
> 
>         host = node0
> 
>         debug osd = 10   ; just for this osd
> 
> \[osd1\]
> 
>         host = node1

and so forth. You can then distribute the file unmodified to all nodes, and on each machine the startup script will only pay attention to the daemons assignd to that host.

[See the wiki for details](http://ceph.newdream.net/wiki/Cluster_configuration).

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/updates/more-configuration-improvements/&bvt=rss&p=wordpress)
