---
title: "Introducing Ceph Ansible profile library"
date: "2017-11-27"
author: "admin"
tags: 
  - "planet"
---

![Introducing Ceph Ansible profile library](images/introducing-ceph-ansible-profile-library.jpg)

A couple of releases ago, in order to minimize changes within the `ceph.conf.j2` Jinja template, we introduced a new module that we took from the OpenStack Ansible guy. This module is called `config_template` and allows us to declare Ceph configuration options as variables in your group\_vars files. This is extremely useful for us

Based on that work and as part of the big ceph-ansible 3.0 release we added a [profile directory](https://github.com/ceph/ceph-ansible/tree/master/profiles) that guides users on how to properly inject new configuration options. All of that is based on use cases. For instance, we currently have profile examples for configuring Ceph Rados Gateway with OpenStack Keystone.

Here is the current list of profiles:

- rgw-keystone-v2
- rgw-keystone-v3
- rgw-radosgw-static-website
- rgw-usage-log

More are coming and we expect to get more during the lifetime of the project. One particular profile that we might create is a performance oriented one when running Bluestore on NVMe drives.

  

> Don’t hesitate to add yours to the repository!

Source: Sebastian Han ([Introducing Ceph Ansible profile library](https://sebastien-han.fr/blog/2017/11/27/Introducing-Ceph-Ansible-profile-library/))
