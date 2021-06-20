---
title: "Ceph erasure code jerasure plugin benchmarks (Highbank ARMv7)"
date: "2014-06-28"
author: "loic"
tags: 
  - "ceph"
---

The benchmark [described for Intel Xeon](http://dachary.org/?p=3042) is run with a **Highbank ARMv7 Processor rev 0 (v7l)** processor (the maker of the processor was [Calxeda](http://en.wikipedia.org/wiki/Calxeda) ), using the [same codebase](https://github.com/ceph/ceph/commit/2bd3b5050bd8a28e45b51abb55226bd97f1ef75f):

[![](images/encode-arm7.png "encode-arm7")](http://dachary.org/wp-uploads/2014/06/encode-arm7.png)

The encoding speed is ~450MB/s for K=2,M=1 (i.e. a RAID5 equivalent) and ~25MB/s for K=10,M=4.

It is also run with **Highbank ARMv7 Processor rev 2 (v7l)** (note the **2**):

[![](images/encode-arm7rev2.png "encode-arm7rev2")](http://dachary.org/wp-uploads/2014/06/encode-arm7rev2.png)

The encoding speed is ~650MB/s for K=2,M=1 (i.e. a RAID5 equivalent) and ~75MB/s for K=10,M=4.

**Note:** The code of the erasure code plugin does not contain any [NEON](http://en.wikipedia.org/wiki/NEON_%28instruction_set%29#NEON) optimizations.  

### Benchmark reports

The [bench.sh](https://github.com/ceph/ceph/pull/1875) output is rendered in a standalone HTML page with [Flot](http://www.flotcharts.org/) from the root directory of the source file.

- [ARMv7 rev0](http://dachary.org/wp-uploads/2014/06/arm7/bench.html)
- [ARMv7 rev2](http://dachary.org/wp-uploads/2014/06/arm7rev2/bench.html)

Both run with the following:

TOTAL\_SIZE=$((400 \* 1024 \* 1024)) \\
CEPH\_ERASURE\_CODE\_BENCHMARK=src/ceph\_erasure\_code\_benchmark \\
PLUGIN\_DIRECTORY=src/.libs \\
  qa/workunits/erasure-code/bench.sh fplot jerasure

### Results interpretation

See [explanations from the corresponding benchmark Intel Xeon](http://dachary.org/?p=3042)
