---
title: "What is the optimum number of PGs for my pool?"
date: "2017-08-07"
author: "admin"
tags: 
  - "planet"
---

Each pool has a fixed number of Placement Groups (PGs) \*and\* a fixed number of  
OSDs. The former is set when the pool is created and the latter is determined  
by the CRUSH map.  
  
The number of PGs in a pool can be increased, but it cannot easily be decreased  
(there is always the option to create a new pool, copy the data over, and  
destroy the old pool).  
  
If there are too few PGs per OSD, or too many, cluster performance will suffer.  
In general, the number should be between 30 and 300 and the oft-quoted "rule of  
thumb" for ideal performance is \_approximately\_ 100 PGs per OSD.  
  
Since any given OSD may of course belong to several pools, depending on the  
cluster topography and the CRUSH map, it's not easy to generalize about what  
is the optimal/right number of PGs for an arbitrary pool. Still, the  
[Ceph PGs per Pool Calculator](http://ceph.com/pgcalc/) can help.  

Source: Nathan Cutler ([What is the optimum number of PGs for my pool?](http://smithfarm-thebrain.blogspot.com/2017/08/what-is-optimum-number-of-pgs-for-my.html))
