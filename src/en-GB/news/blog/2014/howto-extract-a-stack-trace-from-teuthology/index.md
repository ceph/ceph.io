---
title: "HOWTO extract a stack trace from teuthology"
date: "2014-09-23"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

When a [teuthology](https://github.com/ceph/teuthology/) test suite fails on [Ceph](http://ceph.com/), it shows in [pulpito](http://pulpito.ceph.com/). For instance there is one failure in the [monthrash test suite](http://pulpito.ceph.com/ubuntu-2014-09-19_04:50:17-rados:monthrash-wip-9343-erasure-code-feature-testing-basic-multi/) with [details](http://pulpito.ceph.com/ubuntu-2014-09-19_04:50:17-rados:monthrash-wip-9343-erasure-code-feature-testing-basic-multi/497498/) and a [link to the logs](http://qa-proxy.ceph.com/teuthology/ubuntu-2014-09-19_04:50:17-rados:monthrash-wip-9343-erasure-code-feature-testing-basic-multi/497498/teuthology.log). By removing the **teuthology.log** part of the link a directory listing shows all informations [archived for this run are available](http://qa-proxy.ceph.com/teuthology/ubuntu-2014-09-19_04:50:17-rados:monthrash-wip-9343-erasure-code-feature-testing-basic-multi/497498/).  
In the example above the logs show:

client.0.plana34.stderr:+ ceph\_test\_rados\_api\_io
client.0.plana34.stdout:Running main() from gtest\_main.cc
client.0.plana34.stdout:\[==========\] Running 43 tests from 4 test cases.
client.0.plana34.stdout:\[----------\] Global test environment set-up.
client.0.plana34.stdout:\[----------\] 11 tests from LibRadosIo
client.0.plana34.stdout:\[ RUN      \] LibRadosIo.SimpleWrite
client.0.plana34.stdout:\[       OK \] LibRadosIo.SimpleWrite (1509 ms)
client.0.plana34.stdout:\[ RUN      \] LibRadosIo.ReadTimeout
client.0.plana34.stderr:Segmentation fault (core dumped)

That shows **ceph\_test\_rados\_api\_io** is running from the **plana34** machine and core dumped and the [remote/plana34/coredump](http://qa-proxy.ceph.com/teuthology/ubuntu-2014-09-19_04:50:17-rados:monthrash-wip-9343-erasure-code-feature-testing-basic-multi/497498/remote/plana34/coredump/) subdirectory contains the corresponding core dump.  
The [teuthology logs](http://qa-proxy.ceph.com/teuthology/ubuntu-2014-09-19_04:50:17-rados:monthrash-wip-9343-erasure-code-feature-testing-basic-multi/497498/teuthology.log) show the repository from which the binary was downloaded (it was produced by [gitbuilder](http://ceph.com/gitbuilder.cgi)).

echo deb http://gitbuilder.ceph.com/ceph-deb-precise-x86\_64-basic/sha1/f5c1d3b6988bae5ffb914d2ac0b2858caeffe12c precise main | sudo tee /etc/apt/sources.list.d/ceph.list

and running this line on an [Ubuntu precise 12.04 64bits](http://releases.ubuntu.com/12.04/) as suggested by the name of the subdirectory **precise-x86\_64** will make the corresponding binary packages available. It is also possible to download them directly from the [pool/main/c/ceph](http://gitbuilder.ceph.com/ceph-deb-precise-x86_64-basic/sha1/f5c1d3b6988bae5ffb914d2ac0b2858caeffe12c/pool/main/c/ceph/) subdirectory. The packages that are suffixed with **\-dbg** [retain the debug symbols](https://github.com/ceph/ceph/blob/giant/debian/rules#L141) that are necessary for gdb to display an informative stack trace.  
The [ceph\_test\_rados\_api\_io](https://github.com/ceph/ceph/blob/master/src/test/Makefile.am#L736) binary is part of the **ceph-test** package and can be extracted with

$ dpkg --fsys-tarfile ceph-test\_0.85-726-gf5c1d3b-1precise\_amd64.deb | \\
  tar xOf - ./usr/bin/ceph\_test\_rados\_api\_io \\
  > ceph\_test\_rados\_api\_io

and the stack trace displayed with

$ gdb /usr/bin/ceph\_test\_rados\_api\_io 1411176209.8835.core
(gdb) bt
#0  0x00007f541b95750a in pthread\_rwlock\_wrlock () from /lib/x86\_64-linux-gnu/libpthread.so.0
#1  0x00007f541bd41341 in RWLock::get\_write(bool) () from /usr/lib/librados.so.2
#2  0x00007f541bd2bbc9 in Objecter::op\_cancel(Objecter::OSDSession\*, unsigned long, int) () from /usr/lib/librados.so.2
#3  0x00007f541bcf1349 in Context::complete(int) () from /usr/lib/librados.so.2
#4  0x00007f541bdad5ea in RWTimer::timer\_thread() () from /usr/lib/librados.so.2
#5  0x00007f541bdb149d in RWTimerThread::entry() () from /usr/lib/librados.so.2
#6  0x00007f541b953e9a in start\_thread () from /lib/x86\_64-linux-gnu/libpthread.so.0
#7  0x00007f541b16a3fd in clone () from /lib/x86\_64-linux-gnu/libc.so.6
#8  0x0000000000000000 in ?? ()
