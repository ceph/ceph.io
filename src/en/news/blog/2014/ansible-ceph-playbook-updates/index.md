---
title: "Ansible Ceph playbook updates"
date: "2014-03-17"
author: "shan"
tags: 
---

![](images/ceph-ansible-updates.jpg "Ansible Ceph playbook updates")

It has been two weeks now since we released the Ansible playbook for Ceph. This article is a little update concerning new features and roadmap.

I have to say that I am pretty satisfied about the way the module was received, we've got a lot of enthusiastic people.

- RADOS Gateway support
- Load balancing support for multiple RADOS Gateway instance
- Improve distribution support, we now support RedHat based systems. Although we only tested the playbook against CentOS 6.4.
- New OSDs scenarios

Special thanks to:

- Alfredo Deza for all the reviews
- Jimmy Tang for the reviews and his work on the RADOS Gateway load balancer.
- Guys behind GUEST.it for all the tests and suggestions to the playbook

Moving forward:

- Testing factory: we need an integration test suite to validate the deployment, I am thinking about [ServerSpec](http://serverspec.org/).
- Refactor the playbook for Ansible Galaxy in order to make them shareable with the Ansible community
- More OSD scenarios:
    
    - LVM journals for journal, [description here](https://github.com/ceph/ceph-ansible/issues/9).
    - Loopdevice disks for OSD, test Ceph in a minimal environment, [description here](https://github.com/ceph/ceph-ansible/issues/14).

  

> Once again if you like the project, if you have ideas, suggestions that you would like to share, features that you would like to see. No matter if you have coding abilities or not [please open an issue](https://github.com/ceph/ceph-ansible/issues?state=open). We will be happy to improve the playbook!
