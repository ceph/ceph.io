---
title: "OpenVZ: Kernel 3.10 With Rbd Module"
date: "2015-05-04"
author: "laurentbarbe"
tags: 
---

3.X Kernel for OpenVZ is out and it is compiled with rbd module:

```
root@debian:~# uname -a
Linux debian 3.10.0-3-pve #1 SMP Thu Jun 12 13:50:49 CEST 2014 x86_64 GNU/Linux

root@debian:~# modinfo rbd
filename:       /lib/modules/3.10.0-3-pve/kernel/drivers/block/rbd.ko
license:        GPL
author:         Jeff Garzik <jeff@garzik.org>
description:    rados block device
author:         Yehuda Sadeh <yehuda@hq.newdream.net>
author:         Sage Weil <sage@newdream.net>
srcversion:     F459625E3E9943C5880D8BE
depends:        libceph
intree:         Y
vermagic:       3.10.0-3-pve SMP mod_unload modversions 
```

There will be new things to test …

By default, no CephFS module.

The announcement of the publication of the source code : [http://lists.openvz.org/pipermail/announce/2015-April/000579.html](http://lists.openvz.org/pipermail/announce/2015-April/000579.html)
