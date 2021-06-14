---
title: "Ceph: release RAM used by TCMalloc"
date: "2015-09-09"
author: "shan"
tags: 
---

{% img center http://sebastien-han.fr/images/ceph-release-memory-tcmalloc.jpg Ceph release RAM used by TCMalloc %}

Quick tip to release the memory that tcmalloc has allocated but which is not being used by the Ceph daemon itself.

```
$ ceph tell osd.* heap release
osd.0: osd.0 releasing free RAM back to system.
osd.1: osd.1 releasing free RAM back to system.
osd.2: osd.2 releasing free RAM back to system.
osd.3: osd.3 releasing free RAM back to system.
osd.4: osd.4 releasing free RAM back to system.
osd.5: osd.5 releasing free RAM back to system.
osd.6: osd.6 releasing free RAM back to system.
osd.7: osd.7 releasing free RAM back to system.
```

  

> Et voilà !
