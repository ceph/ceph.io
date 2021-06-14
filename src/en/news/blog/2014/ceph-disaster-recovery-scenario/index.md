---
title: "Ceph disaster recovery scenario"
date: "2014-07-04"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

A datacenter containing three hosts [of a non profit Ceph and OpenStack cluster](http://dachary.org/?p=2969) suddenly lost connectivity and it could not be restored within 24h. The corresponding OSDs were marked out manually. The [Ceph](http://ceph.com/) pool dedicated to this datacenter became unavailable as expected. However, a pool that was supposed to have at most one copy per datacenter turned out to have a faulty [crush ruleset](http://ceph.com/docs/master/rados/operations/crush-map/). As a result some [placement groups](http://ceph.com/docs/master/rados/operations/placement-groups/) in this pool were stuck.

$ ceph -s
...
health HEALTH\_WARN 1 pgs degraded; 7 pgs down;
   7 pgs peering; 7 pgs recovering;
   7 pgs stuck inactive; 15 pgs stuck unclean;
   recovery 184/1141208 degraded (0.016%)
...

  
[![](images/restore.png "restore")](http://dachary.org/wp-uploads/2014/07/restore.png)  
The disks are extracted from the rackable machines and plugged in a laptop via USB shoes. To prevent data loss, their content are copied to a single machine via

mount /dev/sdc1 /mnt/
rsync -aX /mnt/ /var/lib/ceph/osd/ceph-$(cat /mnt/whoami)/

where the **X** is to copy **xattr**. The journal is copied from the dedicated partition with

rm /var/lib/ceph/osd/ceph-$(cat /mnt/whoami)/journal
dd if=/mnt/journal of=/var/lib/ceph/osd/ceph-$(cat /mnt/whoami)/journal

where the first **rm** removes the symbolic link to the destination and the **dd** actually copies the content of the journal.  
The **/etc/ceph/ceph.conf** is copied from the live cluster to the temporary host **bm4202** and the latest [emperor release](https://en.wikipedia.org/wiki/Ceph_%28software%29#Emperor_.28v0.72.29) is installed. The OSDs are started one by one to observe their progress:

$ start ceph-osd id=3
$ tail -f /var/log/ceph/ceph-osd.3.log
2014-07-04 16:55:12.217359 7fa264bb1800  0
  ceph version 0.72.2
  (a913ded2ff138aefb8cb84d347d72164099cfd60), process ceph-osd,
  pid 450
...
$ ceph osd tree
...
-11	2.73		host bm4202
3	0.91			osd.3	up	0
4	0.91			osd.4	up	0
5	0.91			osd.5	up	0

After a while the necessary information is recovered from OSDs marked **out** and there is no more placement groups in the stuck state.

$ ceph -s
...
pgmap v12582933: 856 pgs: 856 active+clean
...
