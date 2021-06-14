---
title: "CephFS: determine a file location"
date: "2015-08-31"
author: "shan"
tags: 
  - "planet"
---

{% img center http://sebastien-han.fr/images/cephfs-file-location.jpg CephFS determine a file location %}

Quick tip to determine the location of a file stored on CephFS.

To achieve that we simply need the inode number of this file. For this we will be using `stat`, just like this:

```
$ stat -c %i /mnt/blah
1099511627776
```

Now we get the hex format of the inode:

```
$ printf '%x\n' 1099511627776
10000000000
```

Eventually, we search across our OSD directories:

```
$ sudo find /var/lib/ceph/osd -name 10000000000*
/var/lib/ceph/osd/ceph-3/current/1.30_head/10000000000.00000000__head_F0B56F30__1
```

  

> Tada! That's all!
