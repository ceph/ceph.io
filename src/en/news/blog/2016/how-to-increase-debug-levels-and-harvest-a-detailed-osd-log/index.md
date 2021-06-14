---
title: "How to increase debug levels and harvest a detailed OSD log"
date: "2016-11-25"
author: "admin"
tags: 
  - "planet"
---

Your OSD doesn't start and you want to find out why. Here's how to increase the debug levels and harvest a detailed OSD log:  
  
First, rotate the OSD log, or just do "cd /var/log/ceph ; mv ceph-osd.0.log ceph-osd.0.log-foo"  
  
Then, edit /etc/ceph/ceph.conf to add the following lines to the `[osd]` section:  
  

\[osd\]  
    debug osd = 20  
    debug filestore = 20  
    debug ms = 1  

  
Make sure you know the "number" (id) of the OSD. You can find this out by looking at, e.g. `ceph osd tree`  
  
Then start the OSD manually, by running the following command as root:  
  

\# /usr/bin/ceph-osd -f --cluster ceph --id 0 --setuser ceph --setgroup ceph  

  
Harvest the log - it is in `/var/log/ceph/ceph-osd.${OSD_ID}.log`  
  
Finally, restore `/etc/ceph/ceph.conf` back the way it was! (Otherwise, the increased debug levels cause OSDs to emit huge quantities of log messages which could easily fill up your root filesystem.)

Source: Nathan Cutler ([How to increase debug levels and harvest a detailed OSD log](http://smithfarm-thebrain.blogspot.com/2016/11/how-to-increase-debug-levels-and.html))
