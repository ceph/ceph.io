---
title: "Manage a multi-datacenter crush map with the command line"
date: "2013-11-21"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

A new datacenter is added to the [crush map](http://ceph.com/docs/master/rados/operations/crush-map/) of a [Ceph](http://ceph.com/) cluster:

\# ceph osd crush add-bucket fsf datacenter
added bucket fsf type datacenter to crush map
# ceph osd crush move fsf root=default
moved item id -13 name 'fsf' to location {root=default} in crush map
# ceph osd tree
# id    weight  type name       up/down reweight
-13     0               datacenter fsf
-5      7.28            datacenter ovh
-2      1.82                    host bm0014
0       1.82                            osd.0   up      1
...

The **datacenter** bucket type already exists by default in the default crush map that is provided when the cluster is created. The **fsf** bucket is moved ( with **crush move** ) to the root of the crush map.  
  
A new rule is created to take objects in the **fsf** datacenter and ensure no **host** holds more than one copy:

\# ceph osd crush rule create-simple fsf-rule fsf host
# ceph osd crush rule dump
...
    { "rule\_id": 6,
      "rule\_name": "fsf",
      "ruleset": **6**,
      "type": 1,
      "min\_size": 1,
      "max\_size": 10,
      "steps": \[
            { "op": "take",
              "item": -13},
            { "op": "chooseleaf\_firstn",
              "num": 0,
              "type": "host"},
            { "op": "emit"}\]}\]

A new pool is created and associated with the newly created rule ( id **6** ):

\# ceph osd pool create fsf 128
pool 'fsf' created
# ceph osd pool set fsf crush\_ruleset 6
set pool 7 crush\_ruleset to 6

The OSDs are automatically added to the **fsf** bucket by adding the following to **/etc/ceph/ceph.conf**:

osd\_crush\_update\_on\_start = 1
osd\_crush\_location = datacenter=fsf

It is interpreted [by the ceph-osd upstart script](https://github.com/ceph/ceph/blob/v0.67.4/src/upstart/ceph-osd.conf#L19) that is triggered when a new OSD is created or when the machine boots.

\# ceph-deploy osd create bm0101.the.re:/dev/sdb:/dev/sdc
...
# ceph osd tree
...
-13     3.64            datacenter fsf
-14     3.64                    host bm0101
8       3.64                            osd.8   up      1
