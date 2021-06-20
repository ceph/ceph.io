---
title: "Display the default Ceph configuration"
date: "2013-11-16"
author: "loic"
tags: 
  - "ceph"
---

The [ceph-conf](http://ceph.com/docs/master/man/8/ceph-conf/) command line queries the **/etc/ceph/ceph.conf** file.

\# ceph-conf --lookup fsid
571bb920-6d85-44d7-9eca-1bc114d1cd75

The **–show-config** option can be used to [display the config of a running daemon](http://tracker.ceph.com/issues/2684):

ceph -n osd.123 --show-config

When no name is specified, it will show the default Ceph configuration

ceph --show-config --conf /dev/null
