---
title: "Ceph has a REST API!"
date: "2013-12-07"
author: "dmsimard"
tags: 
  - "ceph"
---

[Ceph](http://ceph.com/) is a distributed object store and file system designed to provide excellent performance, reliability and scalability.  
It’s a technology I’ve been following and working with for the past couple months, especially around [deploying it with puppet](http://dmsimard.com/2013/11/26/how-to-contribute-to-puppet-openstack/), I really have a feeling it is going to revolutionize the world of storage.

I just realized Ceph has a [REST API](http://ceph.com/docs/master/man/8/ceph-rest-api/) since the Dumpling (0.67) release.  
This API essentially wraps around the command line tools allowing you to monitor and manage your cluster.

[Inktank](http://www.inktank.com/), the company behind Ceph (a bit like Canonical is behind Ubuntu) recently released an [enterprise offering](http://www.inktank.com/enterprise/) that includes a web interface to manage your cluster and it is based on that API.  
Calamari, their interface, is unfortunately closed source.

Open source initiatives are already being worked on ([1](https://github.com/dontalton/kraken), [2](https://github.com/inkscope/inkscope)), can’t wait to see what kind of nice things we can craft !
