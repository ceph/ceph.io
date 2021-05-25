---
title: "Recovering from a cinder RBD host failure"
date: "2014-05-05"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

[OpenStack Havana](https://www.openstack.org/software/havana/) [Cinder](https://wiki.openstack.org/wiki/Cinder) volumes associated with a [RBD](http://ceph.com/docs/master/rbd/rbd/) Ceph pool are bound to a host.

cinder service-list --host bm0014.the.re@rbd-ovh
+---------------+-----------------------+------+---------+-------+
|     Binary    |          Host         | Zone |  Status | State |
+---------------+-----------------------+------+---------+-------+
| cinder-volume | bm0014.the.re@rbd-ovh | ovh  | enabled |   up  |
+---------------+-----------------------+------+---------+-------+

A volume created on this host is permanently associated with it:

$ mysql -e "select host from volumes where deleted = 0 and display\_name = 'nerrant.fr'" cinder
+-----------------------+
| host                  |
+-----------------------+
| bm0014.the.re@rbd-ovh |
+-----------------------+

If the host fails, any attempt to detach the volume will fail because the **cinder-api** cannot reach the host:

/var/log/cinder/cinder-api.log
2014-05-04 17:50:59.928 15128 TRACE cinder.api.middleware.fault Timeout: Timeout while
   waiting on RPC response - topic: "cinder-volume:bm0014.the.re@rbd-ovh",
   RPC method: "terminate\_connection" info: "" 

The failed cinder host is first disabled so the scheduler will no longer try to access it:

cinder service-disable bm0014.the.re cinder-volume

The database is updated with another host configured with access to the same Ceph pool.

$ mysql -e "update volumes set host = 'bm0015.the.re@rbd-ovh' \\
   where deleted = 0 and display\_name = 'nerrant.fr'" cinder
