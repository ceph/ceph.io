---
title: "Running Ceph with the tcmalloc heap profiler"
date: "2014-10-02"
author: "loic"
tags: 
  - "ceph"
---

When running a [Ceph](http://ceph.com/) cluster from sources, the [tcmalloc heap profiler](https://google-perftools.googlecode.com/svn/trunk/doc/heap_checker.html) can be [started](https://github.com/ceph/ceph/blob/giant/src/perfglue/heap_profiler.cc#L32) for all daemons with:

CEPH\_HEAP\_PROFILER\_INIT=true \\
  CEPH\_NUM\_MON=1 CEPH\_NUM\_OSD=3 \\
  ./vstart.sh -n -X -l mon osd

The **osd.0** stats can be displayed with

$ ceph tell osd.0 heap stats
\*\*\* DEVELOPER MODE: setting PATH, PYTHONPATH and LD\_LIBRARY\_PATH \*\*\*
osd.0tcmalloc heap stats:------------------------------------------------
MALLOC:        6084984 (    5.8 MiB) Bytes in use by application
MALLOC: +       180224 (    0.2 MiB) Bytes in page heap freelist
MALLOC: +      1430776 (    1.4 MiB) Bytes in central cache freelist
MALLOC: +      7402112 (    7.1 MiB) Bytes in transfer cache freelist
MALLOC: +      5873424 (    5.6 MiB) Bytes in thread cache freelists
MALLOC: +      1290392 (    1.2 MiB) Bytes in malloc metadata
MALLOC:   ------------
MALLOC: =     22261912 (   21.2 MiB) Actual memory used (physical + swap)
MALLOC: +            0 (    0.0 MiB) Bytes released to OS (aka unmapped)
MALLOC:   ------------
MALLOC: =     22261912 (   21.2 MiB) Virtual address space used
MALLOC:
MALLOC:           1212              Spans in use
MALLOC:             65              Thread heaps in use
MALLOC:           8192              Tcmalloc page size
------------------------------------------------

See the Ceph [memory profiling](http://ceph.com/docs/v0.71/rados/troubleshooting/memory-profiling/) documentation for more information.
