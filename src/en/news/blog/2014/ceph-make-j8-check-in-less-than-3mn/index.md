---
title: "Ceph make -j8 check in less than 3mn"
date: "2014-10-19"
author: "loic"
tags: 
  - "ceph"
---

The [Ceph](http://ceph.com/) [sources](https://github.com/ceph/ceph) contain [tests](https://github.com/ceph/ceph/tree/master/src/test) that can be run with **make check**. As of [v0.85](https://github.com/ceph/ceph/tree/4fc12b66d78be2d716a93479fe3600b1e4c2f6b4) then can only be run sequentially because some tests bind the same ports and use the same files. It takes around 18 minutes on a spinner and 12 minutes on a SSD because of some I/O intensive ones. It becomes problematic because it’s a long time to wait when adding code and trying to validate it works and also because it keeps increasing as more tests are added. It’s also a recurring frustration because they conflict with [vstart.sh](https://github.com/ceph/ceph/blob/4fc12b66d78be2d716a93479fe3600b1e4c2f6b4/src/vstart.sh) cluster running for manual testing.  
The tests [have been reworked](https://github.com/ceph/ceph/pull/2750) to ensure that none of them use the the same port or the same files. It reduces the time to **12mn** on a spinner and around **2mn** on a SSD with **make -j8 check**.

\[loic@rex001 src\]$ time make -j8 check
make\[4\]: Entering directory \`/home/loic/ceph/src'
./check\_version ./.git\_version
...
make\[1\]: Leaving directory \`/home/loic/ceph/src'

real    **2m21.907s**
user    5m45.958s
sys     1m50.431s

A number of tests such as [qa/workunits/cephtool/test.sh](https://github.com/ceph/ceph/blob/master/qa/workunits/cephtool/test.sh) take a long time but do not require much CPU or disk I/O. When on a 4 core machine setting **\-j8** gives a chance for these tests to run while more CPU intensive tests are using most of the CPU power.  
Using larger values (for instance **\-j16**) does not help much because a few tests take around 3mn to run anyway.
