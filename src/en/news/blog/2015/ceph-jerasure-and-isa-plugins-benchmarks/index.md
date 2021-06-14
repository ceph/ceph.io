---
title: "Ceph Jerasure and ISA plugins benchmarks"
date: "2015-05-12"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

In [Ceph](http://ceph.com/), a [pool](http://ceph.com/docs/hammer/rados/operations/pools/) can be configured to use [erasure coding instead of replication](http://ceph.com/docs/hammer/rados/operations/erasure-code/) to save space. When used with Intel processors, the default [Jerasure](http://ceph.com/docs/hammer/rados/operations/erasure-code-jerasure/) plugin that computes erasure code can be replaced by the [ISA](http://ceph.com/docs/hammer/rados/operations/erasure-code-isa//) plugin for better write performances. Here is how they compare on a **Intel(R) Xeon(R) CPU E3-1245 V2 @ 3.40GHz**.

[![](images/encode.png "encode")](http://dachary.org/wp-uploads/2015/05/encode.png)

[![](images/decode.png "decode")](http://dachary.org/wp-uploads/2015/05/decode.png)

Encoding and decoding all used 4KB objects [which is the default](https://github.com/ceph/ceph/blob/hammer/src/common/config.h#L41) [stripe width](https://github.com/ceph/ceph/blob/hammer/src/common/config_opts.h#L495). Two variants of the jerasure plugins were used: **Generic** (**jerasure\_generic**) and **SIMD** (**erasure\_sse4**) which is used when running on an Intel processor with SIMD instructions.  
This benchmark was run after [compiling from sources](http://ceph.com/docs/hammer/install/build-ceph/) using

$ ( cd src ; make ceph\_erasure\_code\_benchmark )
$ TOTAL\_SIZE=$((4 \* 1024 \* 1024 \* 1024)) \\
CEPH\_ERASURE\_CODE\_BENCHMARK=src/ceph\_erasure\_code\_benchmark \\
PLUGIN\_DIRECTORY=src/.libs \\
  qa/workunits/erasure-code/bench.sh fplot | \\
  tee qa/workunits/erasure-code/bench.js

and displayed with

firefox qa/workunits/erasure-code/bench.html
