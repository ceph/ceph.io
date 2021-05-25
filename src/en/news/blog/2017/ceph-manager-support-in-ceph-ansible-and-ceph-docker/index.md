---
title: "Ceph manager support in ceph-ansible and ceph-docker"
date: "2017-04-10"
author: "admin"
tags: 
  - "planet"
---

![Ceph manager support in ceph-ansible and ceph-docker](images/ceph-mgr-support-ceph-ansible-docker.png)

Thanks to this recent [pull request](https://github.com/ceph/ceph-ansible/pull/1377), you can now bootstrap the [Ceph Manager](http://docs.ceph.com/docs/master/mgr/) daemon. This new daemon was added during the Kraken development cycle, its main goal is to act as a hook for existing system to get monitoring information from the Ceph cluster. It normally runs alongside monitor daemons but can be deployed to any particular node. Using your preferred method, you can deploy it in a non-containerized or containerized fashion with ceph-ansible.

Also, we just released a new tag for ceph-ansible, 2.2.0, we will go through heavy testing during the next couple of weeks. This will result in a new stable version branched on stable-2.2. I will a new blog post for stable-2.2 once it’s out to highlight some of the best features and functionality we added.

Source: Sebastian Han ([Ceph manager support in ceph-ansible and ceph-docker](https://sebastien-han.fr/blog/2017/04/10/Ceph-manager-support-in-ceph-ansible-and-ceph-docker/))
