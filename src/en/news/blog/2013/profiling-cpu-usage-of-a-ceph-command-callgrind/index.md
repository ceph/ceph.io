---
title: "Profiling CPU usage of a ceph command (callgrind)"
date: "2013-12-12"
author: "loic"
tags: 
  - "ceph"
---

After [compiling Ceph](http://ceph.com/docs/master/install/) from sources with:

./configure --with-debug CFLAGS='-g' CXXFLAGS='-g'

The [crushtool](http://ceph.com/docs/master/man/8/crushtool/) test mode is used to profile the [crush](http://ceph.com/papers/weil-crush-sc06.pdf) implementation with:

valgrind --tool=callgrind \\
         --callgrind-out-file=crush.callgrind \\
         src/crushtool \\
         -i src/test/cli/crushtool/one-hundered-devices.crushmap \\
         --test --show-bad-mappings

The resulting **crush.callgrind** file can then be analyzed with

kcachegrind crush.callgrind

[![](images/kcachegrind-1024x636.png "kcachegrind")](http://dachary.org/wp-uploads/2013/12/kcachegrind.png)  
Any [Ceph](http://ceph.com/) command can be profiled in this way.
