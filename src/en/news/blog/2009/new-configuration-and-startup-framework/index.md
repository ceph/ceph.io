---
title: "New configuration and startup framework"
date: "2009-03-06"
author: "sage"
tags: 
---

Yehuda and I spent last week polishing his configuration framework and reworking the way everything is configured and started up.  I think the end result is pretty slick:

There are now two configuration files.  The first, **cluster.conf**, defines which hosts participate in the cluster, which daemons run on which hosts, and what paths are used to store data.  It is used by the /etc/init.d/ceph init script (src/init-ceph in the git tree) and mkcephfs.  The trick is that the cluster.conf defines daemon startup parameters for the entire cluster, but by default the init script only pays attention to those assigned to the local host, allowing you do distribute the same file across the cluster without adjusting it for each host.  Alternatively, the **\-a** switch (e.g. /etc/init.d/ceph -a start) will start (or stop) daemons on all hosts via ssh.

The **ceph.conf** file defines runtime parameters, like debugging levels, log locations, and thread pool sizes, and so forth.  By default everything looks at /etc/ceph/ceph.conf, or you can specify a separate configuration file on a per-daemon basis via the **cluster.conf**.

The new framework is [described in detail in the wiki](http://ceph.newdream.net/wiki/Main_Page).

UPDATE: Okay, we’ve since revised this scheme to use a **single** ceph.conf file.  Even better.

