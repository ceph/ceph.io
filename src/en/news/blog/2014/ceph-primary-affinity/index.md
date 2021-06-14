---
title: "Ceph Primary Affinity"
date: "2014-08-20"
author: "laurentbarbe"
tags: 
---

This option allows you to answer a fairly constant worry in the case of heterogeneous cluster. Indeed, all HDD do not have the same performance or not the same ratio performance / size. With this option, it is possible to reduce the load on a specific disk without reducing the amount of data it contains. Furthermore, the option is easy to modify because it does not result in data migration. Only preference between primary / secondary will be modified and propagated to clients.

Before playing with cluster options and tune crushmap, remember to verify that your client is compatible with those options.

> You must enable ‘mon osd allow primary affinity = true’ on the mons before you can adjust primary-affinity. note that older clients will no longer be able to communicate with the cluster.

( For client kernel module you can have a look to [http://cephnotes.ksperis.com/blog/2014/01/21/feature-set-mismatch-error-on-ceph-kernel-client.](http://cephnotes.ksperis.com/blog/2014/01/21/feature-set-mismatch-error-on-ceph-kernel-client.) )

Look if the monitor has the primary affinity option: # ceph –admin-daemon /var/run/ceph/ceph-mon.\*.asok config show | grep ‘primary\_affinity’ “mon\_osd\_allow\_primary\_affinity”: “false”,

Edit ceph.conf dans add in section \[mon\]: mon osd allow primary affinity = true

Reload mon and test. We look how many pg is primary on osd.0, and how many is secondary :

```
# ceph pg dump | grep active+clean | egrep "\[0," | wc -l
100
# ceph pg dump | grep active+clean | egrep ",0\]" | wc -l
80
```

Try to change primary affinity :

```
# ceph osd primary-affinity osd.0 0.5
set osd.0 primary-affinity to 0.5 (8327682)

# ceph pg dump | grep active+clean | egrep "\[0," | wc -l
48
# ceph pg dump | grep active+clean | egrep ",0\]" | wc -l
132

# ceph osd primary-affinity osd.0 0
set osd.0 primary-affinity to 0 (802)

# ceph pg dump | grep active+clean | egrep "\[0," | wc -l
0
# ceph pg dump | grep active+clean | egrep ",0\]" | wc -l
180
```

Now there will be no more reading on this OSD.
