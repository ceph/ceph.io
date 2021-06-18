---
title: "Benchmarking Ceph jerasure version 2 plugin"
date: "2014-03-06"
author: "loic"
tags: 
  - "ceph"
---

The Ceph erasure code plugin [benchmark for jerasure version 1](http://dachary.org/?p=2594) are compared after an [upgrade to jerasure version 2](http://tracker.ceph.com/issues/7599), using the same command, on the same hardware.

- **Encoding:** 5.2GB/s which is ~20% better than 4.2GB/s
- **Decoding:** no processing necessary (because the code is [systematic](http://en.wikipedia.org/wiki/Systematic_code))
- **Recovering the loss of one OSD:** 11.3GB/s which is ~13% better than 10GB/s
- **Recovering the loss of two OSD:** 4.42GB/s which is ~35% better than 3.2GB/s

The relevant lines from the [full output of the benchmark](http://dachary.org/wp-uploads/2014/03/bench.txt) are:

seconds         KB      plugin          k m work.   iter.   size    eras.
0.088136        1048576 jerasure        6 2 decode  1024    1048576 1
0.226118        1048576 jerasure        6 2 decode  1024    1048576 2
0.191825        1048576 jerasure        6 2 encode  1024    1048576 0

The improvements are likely to be greater for larger K+M values.
