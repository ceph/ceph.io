---
title: "RBD Image Real Size"
date: "2013-08-28"
author: "syndicated"
tags: 
  - "planet"
---

To get the real size used by a rbd image :

```
rbd diff $POOL/$IMAGE | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }'
```

For exemple :

```
$rbd info myrbd
rbd image 'myrbd':
    size 2048 MB in 512 objects
    order 22 (4096 KB objects)
    block_name_prefix: rb.0.2c6a.238e1f29
    format: 1

$ rbd diff myrbd | awk '{ SUM += $2 } END { print SUM/1024/1024 " MB" }'
14.2812 MB
```

From Josh in Ceph User mailing list : [http://permalink.gmane.org/gmane.comp.file-systems.ceph.user/3684](http://permalink.gmane.org/gmane.comp.file-systems.ceph.user/3684)
