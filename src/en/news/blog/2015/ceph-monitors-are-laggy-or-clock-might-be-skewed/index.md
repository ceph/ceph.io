---
title: "Ceph Monitors are laggy or clock might be skewed"
date: "2015-11-16"
author: "admin"
tags: 
  - "planet"
---

This weekend I got to investigate a Ceph cluster which had issues where the Monitors were constantly performing new elections. After some investigation on of the three monitors was eating 100% CPU on a single core and kept printing this in the logs: mon.charlie@2(peon).paxos(paxos updating c 106399655..106400232) lease\_expire from mon.0 \[2a00:XXX:121:XXX::6789:1\]:6789/0 is 2.380296 seconds in … [Continue reading Ceph Monitors are laggy or clock might be skewed](https://blog.widodh.nl/2015/11/ceph-monitors-are-laggy-or-clock-might-be-skewed/)

Source: widodh ([Ceph Monitors are laggy or clock might be skewed](https://blog.widodh.nl/2015/11/ceph-monitors-are-laggy-or-clock-might-be-skewed/))
