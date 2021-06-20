---
title: "configuring ansible for teuthology"
date: "2015-07-08"
author: "loic"
tags: 
  - "ceph"
---

As of July 8th, 2015, [teuthology](https://github.com/ceph/teuthology/) (the [Ceph](http://ceph.com/) integration test software) switched from using Chef to using Ansible. To keep it working, two files must be created. The **/etc/ansible/hosts/group\_vars/all.yml** file with:

modify\_fstab: false

The **modify\_fstab** is necessary for OpenStack provisioned instances but it won’t hurt if it’s always there (the only drawback being that mount options are not persisted in /etc/fstab, but they are set as they should). The **/etc/ansible/hosts/mylab** file must then be populated with

\[testnodes\]
ovh224000.teuthology
ovh224001.teuthology
...

where **ovh224000.teuthology** etc. are the fqdns of all machines that will be used as teuthology targets. The Ansible playbooks will expect to find all targets under the **\[testnodes\]** section. The output of a teuthology job should show that the Ansible playbook is being used with something like:

...
teuthology.run\_tasks:Running task ansible.cephlab...
...
INFO:teuthology.task.ansible.out:PLAY \[all\] \*\*\*\*\*
...
TASK: \[ansible-managed | Create the sudo group.\] \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
...

  
Prior to [roles used by teuthology should not require a secrets repo](https://github.com/ceph/ceph-cm-ansible/pull/73) the following had to be in **/etc/ansible/hosts/group\_vars/all.yml**.

lab\_domain: teuthology

ansible\_sudo: true
ansible\_user: ubuntu
# add 64.90.32.37 apt-mirror.front.sepia.ceph.com to /etc/hosts
mirror\_host: apt-mirror.front.sepia.ceph.com
git\_mirror\_host: git.ceph.com
kernel\_options: ''
lab\_name: lab
ansible\_user\_ssh\_keys: \[\]
ntp\_servers:
  - 0.us.pool.ntp.org
  - 1.us.pool.ntp.org
  - 2.us.pool.ntp.org
  - 3.us.pool.ntp.org
gitbuilder\_host: gitbuilder.ceph.com
epel\_mirror\_baseurl: "http://dl.fedoraproject.org/pub/epel"
teuthology\_user: "ubuntu"
admin\_users: \[\]
lab\_users: \[\]
resolvconf: \[\]
modify\_fstab: false
