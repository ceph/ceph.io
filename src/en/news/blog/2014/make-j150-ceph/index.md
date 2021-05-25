---
title: "make -j150 ceph"
date: "2014-11-06"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

A [power8](https://en.wikipedia.org/wiki/POWER8) machine was [recently donated](https://mail.gna.org/public/gcc-cfarm-users/2014-11/msg00000.html) to the [GCC compile farm](https://gcc.gnu.org/wiki/CompileFarm) and **/proc/cpuinfo** shows 160 processors. Compiling [Ceph](http://ceph.com/) from sources with **make -j150** makes for a nice [htop](http://hisham.hm/htop/) display.

[![](images/make-j-150-1024x576.png "make-j-150")](http://dachary.org/wp-uploads/2014/11/make-j-150.png)

The result of the compilation passes most of the unit tests, with a few minor exceptions such as [bloom filter](http://tracker.ceph.com/issues/10020).
