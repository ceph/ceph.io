---
title: "Brace yourself, DevStack Ceph is here!"
date: "2014-07-31"
author: "shan"
tags: 
  - "ceph"
  - "planet"
---

For more than a year, Ceph has become increasingly popular and saw several deployments inside and outside OpenStack. For those of you who do not know Ceph is unified, distributed and massively scalable open source storage technology that provides several ways to access and consume your data such as object, block and filesystem. The community and Ceph itself has greatly matured. More developers have joined the project as well. Since I joined eNovance, I have been thinking about building a Ceph support for DevStack. DevStack is a documented collection of shell scripts to build complete OpenStack development environments. I finally got some time to make this happening. It was not easy though, after 7 months and 42 patch sets (42 was the answer I guess), my patch got merged into DevStack. Here is the link of the review: [https://review.openstack.org/#/c/65113/](https://review.openstack.org/#/c/65113/)

It took me a while to get this into DevStack, however thanks to this patch DevStack got several improvements and new capabilities that we will discuss in this article.

# What does it do?

Basically, the patch configures everything for you. So it will bootstrap a Ceph cluster and then configure all the OpenStack services, meaning: Glance, Cinder, Cinder backup and Nova. Many things are configurable such as Ceph size, pool names, user names, replica level. Setting a replica count greater than 1 does not make sense unless you want to look at the Ceph replication. Using a replica count of 2, will bootstrap 2 OSDs within the exact same loopback device. Thus Ceph will report having twice the amount of space to store object which is not true. So be careful with that. I believe this might be improved in the future but once again DevStack is a development platform not a production. DevStack Swift does the exact same thing for the replication.

This patch relies on a recent patch that came into DevStack, the Cinder multi-backend support. So thanks to Dean Troyer, we can now use several backends for Cinder. This patch was really critical in order to get Ceph into DevStack. To use it, simply add the flag CINDER\_ENABLED\_BACKENDS to your localrc file. Then append comma-separated backends names.

A new capability was introduced because of Ceph as well, the ability to perform a  pre-install phase for extras.d plugins. An additional call hook for the extras.d plugins that is called before any service installation occurs. This is called between the installation of the system packages listed as prerequisites and the installation of the actual services.

# ./stack.sh

Below you will find a complete localrc example with every variables that you can use. Of course every variables like USERS, POOL, PG are not mandatory, we have default values for that:

\# Misc
DATABASE\_PASSWORD=password
ADMIN\_PASSWORD=password
SERVICE\_PASSWORD=password
SERVICE\_TOKEN=password
RABBIT\_PASSWORD=password

# Enable Logging
LOGFILE=/opt/stack/logs/stack.sh.log
VERBOSE=True
LOG\_COLOR=True
SCREEN\_LOGDIR=/opt/stack/logs

# Prerequisite
ENABLED\_SERVICES=rabbit,mysql,key

# Ceph!
ENABLED\_SERVICES+=,ceph
CEPH\_LOOPBACK\_DISK\_SIZE=10G
CEPH\_CONF=/etc/ceph/ceph.conf
CEPH\_REPLICAS=1

# Glance - Image Service
ENABLED\_SERVICES+=,g-api,g-reg
GLANCE\_CEPH\_USER=glancy
GLANCE\_CEPH\_POOL=imajeez

# Cinder - Block Device Service
ENABLED\_SERVICES+=,cinder,c-api,c-vol,c-sch,c-bak
CINDER\_DRIVER=ceph
CINDER\_CEPH\_USER=cindy
CINDER\_CEPH\_POOL=volumeuh
CINDER\_CEPH\_UUID=6d52eb95-12f3-47e3-9eb9-0c1fe4142426
CINDER\_BAK\_CEPH\_POOL=backeups
CINDER\_BAK\_CEPH\_USER=cind-backeups
CINDER\_ENABLED\_BACKENDS=ceph,lvm

# Nova - Compute Service
ENABLED\_SERVICES+=,n-api,n-crt,n-cpu,n-cond,n-sch,n-net
NOVA\_CEPH\_POOL=vmz

# Why is it useful?

Well, as mentioned in the introduction many organizations are interested in Ceph and thus they have committed on new functionalities. As DevStack is the de facto platform to program in OpenStack, the need for a DevStack Ceph was natural.

This patch is part of my commitment to the Juno cycle for the Ceph integration into OpenStack effort. I would like to thank the community for its support with this patch. It was important to see that many people want Ceph to be in DevStack, this helped me a lot and gave me the motivation to persevere. More is coming, we are currently working on getting Ceph into the CI gate so we will see our patches more easily accepted and also for Cinder since it requires a CI per volume backend.

Happy DevStacking!
