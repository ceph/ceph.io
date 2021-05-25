---
title: "Ceph erasure code jerasure plugin benchmarks"
date: "2014-05-27"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

On a **Intel(R) Xeon(R) CPU E5-2630 0 @ 2.30GHz** processor (and all [SIMD](http://en.wikipedia.org/wiki/SIMD) capable Intel processors) the **Reed Solomon Vandermonde** technique of the [jerasure](http://jerasure.org/jerasure/jerasure) plugin, which is [the default](https://github.com/ceph/ceph/blob/firefly/src/common/config_opts.h#L433) in [Ceph Firefly](http://ceph.com/), performs better.

[![Reed Solomon vs Cauchy](images/simd.png "Reed Solomon vs Cauchy")](http://dachary.org/wp-uploads/2014/05/simd.png)

The chart is for decoding erasure coded objects. **Y** are in **GB/s** and the **X** are **K/M/erasures**. For instance **10/3/2** is K=10,M=3 and 2 erasures, meaning each object is sliced in K=10 equal chunks and M=3 parity chunks have been computed and the jerasure plugin is used to recover from the loss of two chunks (i.e. 2 erasures).  

### Benchmark reports

The [bench.sh](https://github.com/ceph/ceph/pull/1875) output is rendered in a standalone HTML page with [Flot](http://www.flotcharts.org/) from the root directory of the source file.

- [SIMD optimized](http://dachary.org/wp-uploads/2014/05/simd/bench.html)
    
    TOTAL\_SIZE=$((4 \* 1024 \* 1024 \* 1024)) \\
    CEPH\_ERASURE\_CODE\_BENCHMARK=src/ceph\_erasure\_code\_benchmark \\
    PLUGIN\_DIRECTORY=src/.libs \\
      qa/workunits/erasure-code/bench.sh fplot jerasure
    
- [no optimization](http://dachary.org/wp-uploads/2014/05/generic/bench.html)
    
    PARAMETERS='--parameter jerasure-variant=generic' \\
    TOTAL\_SIZE=$((4 \* 1024 \* 1024 \* 1024)) \\
    CEPH\_ERASURE\_CODE\_BENCHMARK=src/ceph\_erasure\_code\_benchmark \\
    PLUGIN\_DIRECTORY=src/.libs \\
      qa/workunits/erasure-code/bench.sh fplot jerasure
    

### Results interpretation

The benchmarks are presented in two charts, one for encoding performances and another for decoding performances. The **Y** axis is the amount data processed in GB/s : more is better.

[![simd encode 4KB](images/simd-encode-4KB.png "simd encode 4KB")](http://dachary.org/wp-uploads/2014/05/simd-encode-4KB.png)

The **X** axis has one K/M pair for each point, ordered from the simpler on the left (K=2, M=1 which is also [the default in Firefly](https://github.com/ceph/ceph/blob/firefly/src/common/config_opts.h#L434)) to the one requiring more effort on the right (K=10, M=4).

[![simd optimized decode 4KB](images/simd-decode-4KB.png "simd optimized decode 4KB")](http://dachary.org/wp-uploads/2014/05/simd-decode-4KB.png)

The **X** axis of the chart for decoding performances is further divided to show the cost of recovering from an increasing number of erasures. For instance the **4/3/1** point for **Reed Solomon** shows that an object encoded with K=4, M=3 that has lost one chunk (one erasure) can be decoded at a rate over **0.75 GB/s**. The next point, **4/3/2** shows that when there are two erasures, the rate falls under **0.75 GB/s**. The points that share the same K/M pair are connected with a line.

### SIMD improvements and previous benchmarks

jerasure version 2 can use SIMD to accelerate encoding and decoding. Without SIMD, the [Cauchy technique](http://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction#Data_transmission) performs better than the **Reed Solomon Vandermonde** technique with 1MB objects.

[![generic decode 1MB](images/generic-decode-1MB.png "generic decode 1MB")](http://dachary.org/wp-uploads/2014/05/generic-decode-1MB.png)

With SIMD the **Reed Solomon Vandermonde** technique is faster.

[![](images/simd-encode-1MB.png "simd-encode-1MB")](http://dachary.org/wp-uploads/2014/05/simd-encode-1MB.png)

The [previous jerasure benchmarks](http://dachary.org/?p=2594) were on version one but they also show that the **Cauchy** technique is faster. However, these benchmarks were conducted before the implementation of [erasure coded pools](http://ceph.com/docs/firefly/dev/erasure-coded-pool/). The actual stripe size is 4KB and the 1MB results are only included to compare with previous results.
