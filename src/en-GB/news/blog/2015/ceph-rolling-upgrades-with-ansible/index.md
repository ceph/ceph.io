---
title: "Ceph rolling upgrades with Ansible"
date: "2015-03-30"
author: "shan"
tags: 
  - "planet"
---

![Ceph rolling upgrades with Ansible](http://sebastien-han.fr/images/ansible-ceph-upgrades.jpg)

Recently I improved a playbook that I wrote a couple of months ago regarding Ceph rolling upgrades. This playbook is part of the [Ceph Ansible repository](https://github.com/ceph/ceph-ansible) and available as [rolling\_update.yml](https://github.com/ceph/ceph-ansible/blob/master/rolling_update.yml) Let's have a look at it.

Yet another goodness of Ceph is its ability to perform rolling upgrade while the cluster being live. For some of you this might be obvious but for people (like me :p) that have been working on OpenStack they all know that's a different story ;-). So it is definitely good to see that developers have been thinking about upgrades as well. I already ran a couple of different Ceph upgrades and they all went fine, thanks to the [tremendous notes](http://ceph.com/docs/master/install/upgrading-ceph/) from the developers. A couple of months ago, I started a rolling upgrade work in [Ceph Ansible repository](https://github.com/ceph/ceph-ansible), I tested it and validated it. The playbook is working well, however it was mostly relying on pre/postexec scripts from packages. I was not really happy about this, since while running the playbook we didn't take into consideration the state of the cluster. Now things have changed thanks to two major important checks. Let's dive into this playbook.

  

# I. General workflow

To properly perform a Ceph upgrade, an order has to be followed, where components have to upgraded in the following order:

- Monitors servers
- **O**bject **S**torage **D**aemons servers
- **M**eta**D**ata **S**ervers
- **R**ados **G**ateway servers

This is exactly what how we proceed in the Ansible playbook. Components upgrade is being serialised, so we go nodes by nodes.

  

# II. Monitor upgrades

During this process, one monitor will be out of the quorum, depending on the number of monitors you have this can be tricky. As a reminder the recommended **minimum** minimum number of monitors for a production cluster is **3**. This node **must** always be an odd number. This is not a comfortable situation to run with 2 monitors left. Knowing that if you lose a node while another one is upgrading you lose the quorum. Thus your cluster will be dead until other monitor finishes its upgrade.

But let's be optimistic, this process is not that risky and is quite fast anyway. When the upgrade of the node is done and the monitor has been restarted, we must make sure that monitor rejoins the quorum. So basically we are looping over the following command and wait until the monitor is back in the quorum.

```
ceph -s | grep monmap | sed 's/.*quorum//' | egrep -q \{\{ ansible_hostname \}\}
```

> We could potentially try to start with a peon, I'm just not sure if this really matters.

  

# III. Object storage daemon

During this process, some placement groups will be in a degraded state since OSDs might be down (or restarting) and we don't want to trigger a recovery. To fulfill this requirement we will tell the cluster to know do anything if an OSD gets downs. The default behaviour is to mark an OSD as out of the CRUSH map it has been down for 5 minutes. Here we just don't do anything after these 5 minutes.

So we send the following command to the monitors:

`bash $ ceph osd set noout`

Now we can start (sequentially) running the upgrade, we will:

- upgrade the Ceph packages
- run the OSD role
- eventually restart the OSD processes

During the steps above placement groups will be a degraded state, so we have wait until the OSD restarted and that all the placement groups are clean. So we perform the following check where we compare the total number of placement groups versus the number `active+clean` placement groups. While they are not equal we don't move to the next node:

```
test "$(ceph pg stat | sed 's/^.*pgs://;s/active+clean.*//;s/ //')"
-eq "$(ceph pg stat | sed 's/pgs.*//;s/^.*://;s/ //')" \
&& ceph health | egrep -sq "HEALTH_OK|HEALTH_WARN"
```

At the same time, we make sure that the cluster is either `HEALTH_OK` or `HEALTH_WARN`, it will obviously have a `HEALTH_WARN` because of the flag we set earlier.

  

# IV. Metadata Server

The upgrade is pretty straightforward, there is not much to do unless restarting the daemon after the package upgrade is complete.

  

# V. Rados Gateway

Depending on the size of the setup (more than two?), your Rados Gateways servers are running behind a load-balancer. It can be HAProxy or a F5 it doesn't really matter here. To successfully complete the upgrade you will have to play outside Ceph. With a load-balancer the process is pretty easy. You just remove a Rados Gateway from your balancers, wait until no requests are being served. Then you can upgrade and restart it. When this done, re-add the Rados Gateway to your load-balancer and move to the next node.

  

# VI. Run the playbook

Simply run:

`bash $ ansible-playbook rolling_update.yml`

  

> Please try it out, and help us improving it. Pull requests are also more than welcome on [Ceph Ansible](https://github.com/ceph/ceph-ansible)
