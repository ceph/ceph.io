---
title: "UNSTABLE: test the dynamic tree partitionning with multiple Ceph MDS"
date: "2014-07-02"
author: "shan"
tags: 
---

![UNSTABLE: test the dynamic tree partitionning of the Ceph MDS](http://sebastien-han.fr/images/ceph-mds-unstable-dynamic-subtree-partionning.jpg)

Quick tip to enable the dynamic subtree tree partitionning with multiple Ceph MDS servers.

If you want this to take effect during cluster creation edit your `ceph.conf`:

```
[mds]
mds max =  5
```

Then restart your MDSs, they will be all active.

Or inject the following command:

`bash $ ceph mds set_max_mds 5 max_mds = 5`

Before and after:

\`\`\`bash $ ceph -s

```
cluster 04c9ddfb-a420-4fac-bbee-997fd182f527
 health HEALTH_OK
 monmap e1: 1 mons at {ceph001=192.168.0.100:6789/0}, election epoch 1, quorum 0 ceph001
 mdsmap e20: 1/1/1 up {0=ceph006=up:active}, 4 up:standby
 osdmap e103: 29 osds: 29 up, 29 in
  pgmap v18261: 1216 pgs, 4 pools, 2145 bytes data, 23 objects
        1237 MB used, 26771 GB / 26773 GB avail
               6 active+clean+replay
            1210 active+clean
```

$ ceph -s

```
cluster 04c9ddfb-a420-4fac-bbee-997fd182f527
 health HEALTH_OK
 monmap e1: 1 mons at {ceph001=192.168.0.100:6789/0}, election epoch 1, quorum 0 ceph001
 mdsmap e30: 5/5/5 up {0=ceph006=up:active,1=ceph005=up:active,2=ceph003=up:active,3=ceph002=up:active,4=ceph004=up:active}
 osdmap e103: 29 osds: 29 up, 29 in
  pgmap v18274: 1216 pgs, 4 pools, 5893 bytes data, 85 objects
        1239 MB used, 26771 GB / 26773 GB avail
            1216 active+clean
```

\`\`\`

Now enable the subtree partitionning with the following flag:

```
[mds]
mds bal frag = true
```

For [all the options](https://github.com/ceph/ceph/blob/master/src/common/config_opts.h#L320-L344).
