---
title: "Analyse OpenStack guest writes and reads running on Ceph"
date: "2015-02-27"
author: "shan"
tags: 
---

{% img center http://sebastien-han.fr/images/librbd-io-pattern.jpg Analyse OpenStack guest writes and reads running on Ceph %}

Analyse IO pattern of all your guest machines.

Append the following in your `ceph.conf`:

```
[client]
log file = /var/log/qemu/qemu-guest.$pid.log
debug rbd = 20
```

**The path of the log file must be writable by QEMU.** The log show the offset and the lenght of the IO that was submitted.

Some examples:

- DD one time 4K: `dd if=/dev/zero of=/dev/vdb bs=4k count=1 conv=fsync`

  

```
librbd: aio_write 0x7f2b01690ab0 off = 0 len = 4096 buf = 0x7f2a981b2000
```

- DD 10 times 1M: `dd if=/dev/zero of=/dev/vdb bs=1M count=10 conv=fsync`

  

```
librbd: aio_write 0x7f2b01690ab0 off = 0 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 1048576 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 2097152 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 3145728 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 4194304 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 5242880 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 6291456 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 7340032 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 8388608 len = 1048576 buf = 0x7f2a98338200
librbd: aio_write 0x7f2b01690ab0 off = 9437184 len = 1048576 buf = 0x7f2a98338200
```

  

> Note that most these data are also aggregated through the admin socket which can be setup for virtual machines running on Ceph as well.
