---
title: "Teuthology docker targets hack (4/5)"
date: "2015-01-02"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [teuthology](https://github.com/ceph/teuthology/) [container hack](http://dachary.org/?p=3441) is improved by [adding a flag to retrieve packages from a user specified repository](https://github.com/dachary/teuthology/compare/wip-container#diff-c1f38d4216fbc347c57aad6ec8d85064R239) instead of **gitbuilder.ceph.com**. The user can [build packages from sources](http://dachary.org/?p=3491) and run a job, which will implicitly [save a docker image with the package installed](http://dachary.org/?p=3354). The second time the same job is run, it will go faster because it reuses the image. For instance the following job:

machine\_type: container
os\_type: ubuntu
os\_version: "14.04"
suite\_path: /home/loic/software/ceph/ceph-qa-suite
roles:
- - mon.a
  - osd.0
  - osd.1
  - client.0
overrides:
  install:
    ceph:
      branch: master
  ceph:
    wait-for-scrub: false
tasks:
- install:
    repository\_url: http://172.17.42.1/trusty
- ceph:

runs under one minute:

{duration: 47.98, flavor: basic, owner: loic@dachary.org, success: true}
