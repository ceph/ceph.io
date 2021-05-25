---
title: "Benchmarking Ceph erasure code plugins"
date: "2013-12-21"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [erasure code](http://dachary.org/?p=2171) implementation in [Ceph](http://ceph.com/) relies on the jerasure library. It is packaged into a [plugin](https://github.com/ceph/ceph/blob/v0.75/src/osd/ErasureCodePluginJerasure/) that is dynamically loaded by erasure coded pools.  
The [ceph\_erasure\_code\_benchmark](https://github.com/ceph/ceph/blob/v0.75/src/test/osd/ceph_erasure_code_benchmark.cc) is implemented to help benchmark the competing erasure code plugins implementations and to find the best parameters for a given plugin. It shows the jerasure technique [cauchy\_good](https://github.com/ceph/ceph/blob/v0.75/src/osd/ErasureCodePluginJerasure/ErasureCodePluginJerasure.cc#L45) with a packet size of **3072** to be the most efficient on a [Intel(R) Xeon(R) CPU E3-1245 V2 @ 3.40GHz](http://ark.intel.com/products/52274/) when compiled with **gcc version 4.6.3 (Ubuntu/Linaro 4.6.3-1ubuntu5)**. The test was done assuming each object is spread over six OSDs and two extra OSDs are used for parity ( K=6 and M=2 ).

- **Encoding:** 4.2GB/s
- **Decoding:** no processing necessary (because the code is [systematic](http://en.wikipedia.org/wiki/Systematic_code))
- **Recovering the loss of one OSD:** 10GB/s
- **Recovering the loss of two OSD:** 3.2GB/s

The processing is done on the primary OSDs and therefore distributed on the Ceph cluster. Encoding and decoding is an order of magnitude faster than the typical storage hardware throughput.  
  
[Ceph](http://ceph.com/) is [compiled from sources](http://ceph.com/docs/master/install/) with:

./autogen.sh ; ./configure ; make

which compiles the [ceph\_erasure\_code\_benchmark](https://github.com/ceph/ceph/blob/v0.75/src/test/osd/ceph_erasure_code_benchmark.cc) benchmark tool.  
The [results](http://dachary.org/wp-uploads/2013/12/bench.txt) of the [erasure code bench](https://github.com/ceph/ceph/blob/v0.75/qa/workunits/erasure-code/bench.sh) script ( which relies on **ceph\_erasure\_code\_benchmark** ) were produced on a [Intel(R) Xeon(R) CPU E3-1245 V2 @ 3.40GHz](http://ark.intel.com/products/52274/) and compiled with **gcc version 4.6.3 (Ubuntu/Linaro 4.6.3-1ubuntu5)**.

CEPH\_ERASURE\_CODE\_BENCHMARK=src/ceph\_erasure\_code\_benchmark  \\
PLUGIN\_DIRECTORY=src/.libs  \\
qa/workunits/erasure-code/bench.sh

They can be interpreted as follows:

seconds         KB      plugin  k m work.       iter.   size    eras.
0.612510        1048576 example 2 1 encode      1024    1048576 0
0.317254        1048576 example 2 1 decode      1024    1048576 1

The first line used the **example** plugin to **encode** **1048576KB** (1GB) in **0.612510** seconds which is ~1.7GB/s. The measure was done by iterating **1024** times to encode a **1048576** (1MB) bytes buffer. The second line used the **example** plugin to **decode** **1048576KB** (1GB) when **1** chunk has been **eras**ed (last column) in **0.317254** seconds which is ~3.1GB/s. The measure was done by iterating **1024** times to decode a **1048576** (1MB) bytes buffer that was encoded once.  
When using the [Jerasure](http://jerasure.org/jerasure/jerasure) [Ceph plugin](https://github.com/ceph/ceph/blob/v0.75/src/osd/ErasureCodePluginJerasure/) and the [Reed Solomon](http://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction) technique to sustain the loss of two OSDs (i.e. K=6 and M=2 ) the results are:

seconds         KB      plugin          k m work.       iter.   size    eras.
0.103921        1048576 jerasure        6 2 decode      1024    1048576 1
0.277644        1048576 jerasure        6 2 decode      1024    1048576 2
0.238322        1048576 jerasure        6 2 encode      1024    1048576 0

The first line shows that if **1** OSD is lost ( **eras**ed ), it can be recovered at a rate of 10GB/s ( 1/0.103921 ). If **2** OSDs are lost, recovering both of them can be done at a rate of 3.6GB/s ( 1/0.277644 ). Encoding can be done at a rate of 4.2GB/s ( 1/0.238322 ).  
The corresponding jerasure technique is [cauchy\_good](https://github.com/ceph/ceph/blob/v0.75/src/osd/ErasureCodePluginJerasure/ErasureCodePluginJerasure.cc#L45) with a packet size of **3072**:

\--parameter erasure-code-packetsize=3072
--parameter erasure-code-technique=cauchy\_good

After [profiling](http://dachary.org/?p=2586) a single call and reducing the number of iterations from 1024 to 10 because valgrind makes the run significantly slower:

valgrind --tool=callgrind src/ceph\_erasure\_code\_benchmark
  --plugin jerasure
  --workload encode
  --iterations 10
  --size 1048576
  --parameter erasure-code-k=6
  --parameter erasure-code-m=2
  --parameter erasure-code-directory=.libs
  --parameter erasure-code-technique=cauchy\_good
  --parameter erasure-code-packetsize=3072

It shows that 97% of the time is spent [in table lookups](https://github.com/ceph/ceph/blob/v0.75/src/osd/ErasureCodePluginJerasure/galois.c#L428).
