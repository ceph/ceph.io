---
title: "See what the Ceph client sees"
date: "2015-07-08"
author: "shan"
tags: 
  - "planet"
---

![](images/see-what-the-ceph-client-sees.jpg "See what the Ceph client sees")

The title is probably weird and misleading but I could not find better than this :). The idea here is to dive a little bit into what the kernel client sees for each client that has a RBD device mapped. In this article, we are focusing on the Kernel RBD feature.

In order to see things, you need to adjust some debug values. So you need to add the following into your `ceph.conf`:

```
[mon]
...
debug ms = 1
...

[osd]
...
debug ms = 1
```

Then you can create and map a device like so:

```
$ rbd create foo -s 10240
$ rbd map foo
/dev/rbd0
```

Since we increased the debug level, you should now have noticed that we have a client directory in `/sys/kernel/debug/ceph/`.

```
$ sudo ls /sys/kernel/debug/ceph/dee72d38-cd8b-42c1-93c1-3be0698206ca.client24166/
monc  monmap  osdc  osdmap
```

So as you see we have several crucial information that the client will use to interact with the cluster. Important files such as the OSD map are present:

```
$ sudo cat /sys/kernel/debug/ceph/dee72d38-cd8b-42c1-93c1-3be0698206ca.client24166/osdmap
epoch 68
flags
pool 0 pg_num 64 (63) read_tier -1 write_tier -1
osd0    10.143.114.189:6800     100%    (exists, up)    100%
osd1    10.143.114.187:6800     100%    (exists, up)    100%
osd2    10.143.114.186:6800     100%    (exists, up)    100%
osd3    10.143.114.188:6800     100%    (exists, up)    100%
osd4    10.143.114.186:6804     100%    (exists, up)    100%
osd5    10.143.114.187:6804     100%    (exists, up)    100%
osd6    10.143.114.188:6804     100%    (exists, up)    100%
osd7    10.143.114.189:6804     100%    (exists, up)    100%
osd8    10.143.114.187:6808     100%    (exists, up)    100%
osd9    10.143.114.188:6808     100%    (exists, up)    100%
osd10   10.143.114.189:6808     100%    (exists, up)    100%
osd11   10.143.114.186:6808     100%    (exists, up)    100%
osd12   10.143.114.188:6812     100%    (exists, up)    100%
osd13   10.143.114.189:6812     100%    (exists, up)    100%
osd14   10.143.114.187:6812     100%    (exists, up)    100%
osd15   10.143.114.186:6812     100%    (exists, up)    100%
osd16   10.143.114.188:6816     100%    (exists, up)    100%
osd17   10.143.114.189:6816     100%    (exists, up)    100%
osd18   10.143.114.186:6806     100%    (exists, up)    100%
osd19   10.143.114.187:6801     100%    (exists, up)    100%
```

And the monitors map:

```
$ sudo cat /sys/kernel/debug/ceph/dee72d38-cd8b-42c1-93c1-3be0698206ca.client24166/monmap
epoch 1
        mon0    10.143.114.185:6789
        mon1    10.143.114.186:6789
        mon2    10.143.114.187:6789
```

  

> That's all!
