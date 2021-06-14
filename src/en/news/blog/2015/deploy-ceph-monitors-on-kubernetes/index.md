---
title: "Deploy Ceph monitors on Kubernetes"
date: "2015-06-18"
author: "shan"
tags: 
  - "planet"
---

![](images/ceph-monitors-kubernetes.png "Deploy Ceph monitors on Kubernetes")

As part of my work on [ceph-docker](https://github.com/ceph/ceph-docker), I have been playing a bit with Kubernetes. As a first exercise, I thought it would be interesting to run my Ceph monitors with Kubernetes. Let's see how we can achieve that.

The following assumes that you have a Kubernetes cluster up and running.

\`\`\`bash $ wget https://raw.githubusercontent.com/ceph/ceph-docker/master/examples/kubernetes/ceph-mon.json

$ kubectl create -f mon.json replicationControllers/ceph-mon

$ kubectl get pod POD IP CONTAINER(S) IMAGE(S) HOST LABELS STATUS CREATED MESSAGE ceph-mon-qo4yc 127.0.0.1/ name=frontend Pending 3 seconds

```
                       ceph-mon       ceph/daemon
```

ceph-mon-sv56v 127.0.0.1/ name=frontend Pending 3 seconds

```
                       ceph-mon       ceph/daemon
```

ceph-mon-zc0lb 127.0.0.1/ name=frontend Pending 3 seconds

```
                       ceph-mon       ceph/daemon
```

$ kubectl log ceph-mon-qo4yc creating /etc/ceph/ceph.client.admin.keyring creating /etc/ceph/ceph.mon.keyring creating /var/lib/ceph/bootstrap-osd/ceph.keyring creating /var/lib/ceph/bootstrap-mds/ceph.keyring creating /var/lib/ceph/bootstrap-rgw/ceph.keyring monmaptool: monmap file /etc/ceph/monmap monmaptool: set fsid to ef67b6f1-8d50-49fe-a8dd-c81bd7dd09c2 monmaptool: writing epoch 0 to /etc/ceph/monmap (1 monitors) creating /tmp/ceph.mon.keyring importing contents of /etc/ceph/ceph.client.admin.keyring into /tmp/ceph.mon.keyring importing contents of /var/lib/ceph/bootstrap-osd/ceph.keyring into /tmp/ceph.mon.keyring importing contents of /var/lib/ceph/bootstrap-mds/ceph.keyring into /tmp/ceph.mon.keyring importing contents of /var/lib/ceph/bootstrap-rgw/ceph.keyring into /tmp/ceph.mon.keyring importing contents of /etc/ceph/ceph.mon.keyring into /tmp/ceph.mon.keyring ceph-mon: set fsid to b2beb954-6791-408c-8212-9559fd5daf36 ceph-mon: created monfs at /var/lib/ceph/mon/ceph-ceph-mon-qo4yc for mon.ceph-mon-qo4yc 2015-06-18 09:29:11.347368 7f4924a168c0 0 ceph version 0.94.2 (5fb85614ca8f354284c713a2f9c610860720bbf3), process ceph-mon, pid 1 2015-06-18 09:29:11.717765 7f4924a168c0 0 mon.ceph-mon-qo4yc does not exist in monmap, will attempt to join an existing cluster 2015-06-18 09:29:11.718113 7f4924a168c0 0 using public\_addr 172.17.0.11:6789/0 -> 172.17.0.11:6789/0 2015-06-18 09:29:11.718225 7f4924a168c0 0 starting mon.ceph-mon-qo4yc rank -1 at 172.17.0.11:6789/0 mon\_data /var/lib/ceph/mon/ceph-ceph-mon-qo4yc fsid b2beb954-6791-408c-8212-9 559fd5daf36 ... ... ... ... \`\`\`

It seems to run fine, now let's have a look at the Ceph status:

\`\`\`bash $ sudo docker ps CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES 1f86ffbd3897 ceph/daemon:latest "/entrypoint.sh" 18 seconds ago Up 17 seconds k8s\_ceph-mon.b9e89a17\_ceph-mon-zc0lb\_de fault\_76b6b559-159c-11e5-9d52-fa163ebdff5b\_895951f7 a0f966c5cd54 ceph/daemon:latest "/entrypoint.sh" 26 seconds ago Up 23 seconds k8s\_ceph-mon.b9e89a17\_ceph-mon-qo4yc\_de fault\_76b6eefc-159c-11e5-9d52-fa163ebdff5b\_cea0ff5e a9fa1663d712 ceph/daemon:latest "/entrypoint.sh" 26 seconds ago Up 24 seconds k8s\_ceph-mon.b9e89a17\_ceph-mon-sv56v\_de fault\_76b71555-159c-11e5-9d52-fa163ebdff5b\_8d5b1f56 fceabf9c1b77 gcr.io/google\_containers/pause:0.8.0 "/pause" 28 seconds ago Up 26 seconds k8s\_POD.e4cc795\_ceph-mon-sv56v\_default _76b71555-159c-11e5-9d52-fa163ebdff5b\_998441ff 5f9eecd36fb5 gcr.io/google\_containers/pause:0.8.0 "/pause" 28 seconds ago Up 26 seconds k8s\_POD.e4cc795\_ceph-mon-qo4yc\_default_ 76b6eefc-159c-11e5-9d52-fa163ebdff5b\_3af31e82 c99221438e93 gcr.io/google\_containers/pause:0.8.0 "/pause" 28 seconds ago Up 26 seconds k8s\_POD.e4cc795\_ceph-mon-zc0lb\_default\_ 76b6b559-159c-11e5-9d52-fa163ebdff5b\_dfc6b697

$ sudo docker exec 1f86ffbd3897 ceph -s

```
cluster b2beb954-6791-408c-8212-9559fd5daf36
 health HEALTH_ERR
        64 pgs stuck inactive
        64 pgs stuck unclean
        no osds
 monmap e3: 3 mons at {ceph-mon-qo4yc=172.17.0.11:6789/0,ceph-mon-sv56v=172.17.0.12:6789/0,ceph-mon-zc0lb=172.17.0.10:6789/0}
        election epoch 8, quorum 0,1,2 ceph-mon-zc0lb,ceph-mon-qo4yc,ceph-mon-sv56v
 osdmap e1: 0 osds: 0 up, 0 in
  pgmap v2: 64 pgs, 1 pools, 0 bytes data, 0 objects
        0 kB used, 0 kB / 0 kB avail
              64 creating
```

\`\`\`

  

> As we can see, all the three monitors successfully formed a quorum.
