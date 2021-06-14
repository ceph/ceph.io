---
title: "Profiling CPU usage of a ceph command (gperftools)"
date: "2013-12-10"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

After [compiling Ceph](http://ceph.com/docs/master/install/) from sources with:

./configure --with-debug CFLAGS='-g' CXXFLAGS='-g'

The [crushtool](http://ceph.com/docs/master/man/8/crushtool/) test mode is used to profile the [crush](http://ceph.com/papers/weil-crush-sc06.pdf) implementation with:

LD\_PRELOAD=/usr/lib/libprofiler.so.0 \\
CPUPROFILE=crush.prof src/crushtool \\
  -i src/test/cli/crushtool/one-hundered-devices.crushmap \\
  --test --show-bad-mappings

as [instructed in the cpu profiler](http://goog-perftools.sourceforge.net/doc/cpu_profiler.html) documentation. The resulting **crush.prof** file can then be analyzed with

google-pprof --ignore=vector --focus=bucket\_choose \\
  --gv ./src/crushtool crush.prof

and [displays](http://pages.cs.wisc.edu/~ghost/) the following result:  
[![](images/prof-1024x615.png "prof")](http://dachary.org/wp-uploads/2013/12/prof.png)  
Any [Ceph](http://ceph.com/) command can be profiled in this way.
