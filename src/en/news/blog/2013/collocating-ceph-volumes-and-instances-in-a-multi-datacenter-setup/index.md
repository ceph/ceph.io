---
title: "Collocating Ceph volumes and instances in a multi-datacenter setup"
date: "2013-11-12"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

[OpenStack Havana](http://redmine.the.re/projects/there/wiki/HOWTO_setup_OpenStack) is installed on machines rented from [OVH](http://ovh.com) and [Hetzner](http://hetzner.de). An [aggregate is created](http://russellbryantnet.wordpress.com/2013/05/21/availability-zones-and-host-aggregates-in-openstack-compute-nova/) for machines hosted at OVH and another for machines hosted at Hetzner. A [Ceph](http://ceph.com) cluster is created with a pool using disks from OVH and another pool using disks from Hetzner. A [cinder](https://en.wikipedia.org/wiki/OpenStack#Block_Storage_.28Cinder.29) backend is created for each Ceph pool. From the [dashboard](https://en.wikipedia.org/wiki/OpenStack#Dashboard_.28Horizon.29), an instance can be created in the OVH availability zone using a Ceph volume provided by the matching OVH pool.  
[![](images/instance-create.png "instance-create")](http://dachary.org/wp-uploads/2013/11/instance-create.png)  

### Creating availability zones

The availability zones are created as a side effect of [creating an aggregate](http://russellbryantnet.wordpress.com/2013/05/21/availability-zones-and-host-aggregates-in-openstack-compute-nova/).

\# nova aggregate-create ovh ovh
+----+------+-------------------+-------+--------------------------------+
| Id | Name | Availability Zone | Hosts | Metadata                       |
+----+------+-------------------+-------+--------------------------------+
| 2  | ovh  | ovh               | \[\]    | {u'availability\_zone': u'ovh'} |
+----+------+-------------------+-------+--------------------------------+
# nova aggregate-create hetzner hetzner
+----+---------+-------------------+-------+------------------------------------+
| Id | Name    | Availability Zone | Hosts | Metadata                           |
+----+---------+-------------------+-------+------------------------------------+
| 3  | hetzner | hetzner           | \[\]    | {u'availability\_zone': u'hetzner'} |
+----+---------+-------------------+-------+------------------------------------+

The hosts are assigned to their availability zone:

\# nova aggregate-add-host ovh bm0015.the.re
Aggregate 2 has been successfully updated.
+----+------+-------------------+--------------------+--------------------------------+
| Id | Name | Availability Zone | Hosts              | Metadata                       |
+----+------+-------------------+--------------------+--------------------------------+
| 2  | ovh  | ovh               | \[u'bm0015.the.re'\] | {u'availability\_zone': u'ovh'} |
+----+------+-------------------+--------------------+--------------------------------+

The result can be checked with

\# nova availability-zone-list
+-----------------------+----------------------------------------+
| Name                  | Status                                 |
+-----------------------+----------------------------------------+
| internal              | available                              |
| |- bm0015.the.re      |                                        |
| | |- nova-conductor   | enabled ![:-)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)  2013-11-11T14:26:43.000000 |
| | |- nova-consoleauth | enabled ![:-)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)  2013-11-11T14:26:43.000000 |
| | |- nova-scheduler   | enabled ![:-)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)  2013-11-11T14:26:43.000000 |
| | |- nova-cert        | enabled ![:-)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)  2013-11-11T14:26:43.000000 |
| ovh                   | available                              |
| |- bm0015.the.re      |                                        |
| | |- nova-compute     | enabled ![:-)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)  2013-11-11T14:26:48.000000 |
| hetzner               | available                              |
| |- bm0016.the.re      |                                        |
| | |- nova-compute     | enabled ![:-)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)  2013-11-11T14:26:49.000000 |
| nova                  | available                              |
+-----------------------+----------------------------------------+

### Creating the Ceph pools

The crush map is extracted with

ceph osd getcrushmap -o crush.bin
crushtool -d crush.bin -o crush.txt

It is edited to add

datacenter ovh {
        id -5
        alg straw
        hash 0
        item bm0014 weight 1.820
        item bm0015 weight 1.820
}

rule ovh {
        ruleset 3
        type replicated
        min\_size 1
        max\_size 10
        step take ovh
        step chooseleaf firstn 0 type host
        step emit
}

and sent back to the Ceph monitors with

crushtool -c crush.txt -o crush.bin
ceph osd setcrushmap crush.bin

An ovh pool is created and set to use the ovh ruleset:

ceph osd pool create ovh 128
ceph osd pool set ovh crush\_ruleset 3

The [crush.txt](http://dachary.org/wp-uploads/2013/11/crush.txt) file also contains the ruleset for the hetzner pool.

### Creating cinder backends

In the /etc/cinder/cinder.conf file of the host running cinder-volume, one [cinder backend](http://docs.openstack.org/admin-guide-cloud/content/managing-volumes.html#multi_backend) is defined for each Ceph pool:

enabled\_backends=rbd-hetzner,rbd-ovh
\[rbd-hetzner\]
volume\_driver=cinder.volume.driver.RBDDriver
rbd\_pool=hetzner
volume\_backend\_name=RBD\_HETZNER
\[rbd-ovh\]
volume\_driver=cinder.volume.driver.RBDDriver
rbd\_pool=ovh
volume\_backend\_name=RBD\_OVH

In order to enable the **–volume-type ovh** option of **cinder create**, the corresponding type keys must be created:

\# cinder type-create ovh
+--------------------------------------+------+
|                  ID                  | Name |
+--------------------------------------+------+
| 48645332-4835-4a9b-9078-cd735f47dae5 | ovh  |
+--------------------------------------+------+
# cinder type-key ovh set volume\_backend\_name=RBD\_OVH
# cinder extra-specs-list
+--------------------------------------+---------+------------------------------------------+
|                  ID                  |   Name  |               extra\_specs                |
+--------------------------------------+---------+------------------------------------------+
| 48645332-4835-4a9b-9078-cd735f47dae5 |   ovh   |   {u'volume\_backend\_name': u'RBD\_OVH'}   |
+--------------------------------------+---------+------------------------------------------+

Check that the cinder scheduler is set as follows in **/etc/cinder/cinder.conf**

scheduler\_driver=cinder.scheduler.filter\_scheduler.FilterScheduler

### Assembling instance and volume

After creating a volume using the OVH cinder backend:

cinder create --volume-type ovh --display-name test 1

An instance is created in the OVH availability zone:

nova boot --availability-zone ovh \\
               --image 'cirros image' \\
               --key-name key\_loic \\
               --nic net-id=e1d72366-1f25-42c1-a953-a944c9f932e3 \\
               --flavor m1.tiny --poll try

The volume is attached to the instance

nova volume-attach try 045d1cae-cd9b-4d64-b0b8-544f5b6d0c5a /dev/vdb
