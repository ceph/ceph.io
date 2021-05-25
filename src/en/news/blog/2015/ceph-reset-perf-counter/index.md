---
title: "Ceph reset perf counter"
date: "2015-01-16"
author: "shan"
tags: 
  - "planet"
---

![Ceph reset perf counter](http://sebastien-han.fr/images/ceph-reset-perf-counter.jpg)

OSD performance counters tend to stack up and sometimes the value shown is not really representative of the current environment. Thus it is quite useful to reset the counters to get the last values. This feature was added in the **Ceph 0.90, so you must wait for the Hammer release.**

This action can be triggered via the admin socket:

`bash $ sudo ceph daemon osd.0 perf reset`
