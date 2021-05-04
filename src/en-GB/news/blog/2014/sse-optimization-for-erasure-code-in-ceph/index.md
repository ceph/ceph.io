---
title: "SSE optimization for erasure code in Ceph"
date: "2014-03-28"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [jerasure](http://jerasure.org/jerasure/jerasure) library [is the default erasure code plugin](https://github.com/ceph/ceph/tree/v0.78/src/erasure-code/jerasure/) of [Ceph](http://ceph.com/). The [gf-complete](http://jerasure.org/jerasure/gf-complete) companion library supports SSE optimizations at compile time, when the compiler provides them (**\-msse4.2** etc.). The jerasure (and gf-complete with it) plugin is compiled multiple times with various levels of [SSE features](http://en.wikipedia.org/wiki/CPUID#EAX.3D1:_Processor_Info_and_Feature_Bits):

- **jerasure\_sse4** uses SSE4.2, SSE4.1, SSSE3, SSE3, SSE2, SSE
- **jerasure\_sse3** uses SSSE3, SSE3, SSE2, SSE
- **jerasure\_generic** uses no SSE instructions

When an OSD loads the jerasure plugin, the [CPU features are probed](https://github.com/ceph/ceph/blob/firefly/src/arch/intel.c#L55) and the [appropriate plugin is selected](https://github.com/ceph/ceph/blob/firefly/src/erasure-code/jerasure/ErasureCodePluginSelectJerasure.cc#L42) depending on their availability.  
The gf-complete source code is cleanly divided into functions that take advantage of specific SSE features. It should be easy to use [the ifunc attribute](http://gcc.gnu.org/onlinedocs/gcc-4.7.2/gcc/Function-Attributes.html#index-g_t_0040code_007bifunc_007d-attribute-2529) to semi-manually select each function individually, at runtime and without performance penalty (because the choice is made the first time the function is called and recorded for later calls). With such a fine grain selection, there would be no need to compile three plugins because each function would be compiled with exactly the set of flag it needs.
