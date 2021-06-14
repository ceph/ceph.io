---
title: "Building Ceph master with C++17 support on openSUSE Leap 42.3"
date: "2018-01-29"
author: "admin"
tags: 
  - "planet"
---

[Ceph](https://github.com/ceph/ceph) now requires [C++17](https://en.wikipedia.org/wiki/C%2B%2B17) support, which is available with modern compilers such as gcc-7. [openSUSE Leap](https://www.opensuse.org/#Leap) 42.3, my current OS of choice, includes gcc-7. However, it's not used by default.  
  
Using gcc-7 for the Ceph build is a simple matter of:  

\> sudo zypper in gcc7-c++  
\> CC=gcc-7 CXX=/usr/bin/g++-7 ./do\_cmake.sh ...  
\> cd build && make -j  

Source: David Disseldorp ([Building Ceph master with C++17 support on openSUSE Leap 42.3](http://blog.elastocloud.org/2018/01/building-ceph-master-with-c17-support.html))
