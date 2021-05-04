---
title: "DevStack and remote Ceph cluster"
date: "2014-12-11"
author: "shan"
tags: 
  - "planet"
---

![DevStack and remote Ceph cluster](http://sebastien-han.fr/images/devstack-ceph-remote-cluster.jpg)

Introducing the ability to connect DevStack to a remote Ceph cluster. So DevStack won't bootstrap any Ceph cluster, it will simply connect to a remote one.

The patch is currently [under review](https://review.openstack.org/#/c/139125/). Sometimes we want to run some benchmarks on virtual machines that will be backed by a Ceph cluster. The first idea that comes in our mind is to use DevStack to quickly get an OpenStack up and running but what about the configuration of Devstack with this remote cluster? There is currently no way to automatically connect this DevStack to another cluster.

Thanks to the above patch it is now possible to use an existing Ceph cluster. In this case Devstack just needs two things:

- the location of the Ceph config file (by default devstack will look for /etc/ceph/ceph.conf
- the admin key of the remote ceph cluster (by default devstack will look for /etc/ceph/ceph.client.admin.keyring)

Devstack will then create the necessary pools, users, keys and will connect the OpenStack environment as usual. During the unstack phase every pools, users and keys will be deleted on the remote cluster while local files and ceph-common package will be removed from the current Devstack host.

To enable this mode simply add `REMOTE_CEPH=True` to your localrc file. To specify a different path for the admin key do `REMOTE_CEPH_ADMIN_KEY_PATH=/etc/ceph/ceph.client.admin.keyring`
