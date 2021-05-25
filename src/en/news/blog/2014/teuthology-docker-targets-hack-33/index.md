---
title: "Teuthology docker targets hack (3/4)"
date: "2014-12-15"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [teuthology](https://github.com/ceph/teuthology/) [container hack](http://dachary.org/?p=3354) is [improved](https://github.com/dachary/teuthology/compare/wip-container?w=1) so each [Ceph](http://ceph.com/) command is run via **docker exec -i** which can [read from stdin](https://github.com/docker/docker/issues/9286) as of [docker 1.4](http://docs.docker.com/release-notes/) released in December 2014. 
It can run the following job

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
- ceph:

under one minute, when repeated a second time and the bulk of the installation [can be reused](http://dachary.org/?p=3354).

{duration: 50.01510691642761, flavor: basic,
  owner: loic@dachary.org, success: true}

  
The **docker exec -i** commands a run with

        self.p = subprocess.Popen(self.args,
                                  stdin=self.stdin\_r,
                                  stdout=stdout, stderr=stderr,
                                  close\_fds=True,)

The **stdin** is set when the command is created, as an **os.pipe**, so that it can be written to immediately, even before the command is actually run (which may happen at a later time if the thread is already busy finished a previous command). The **stdout** and **stderr** are consumed immediately after the command is run and copied over to the arguments provided by the caller:

        while ( self.file\_copy(self.p.stdout, self.stdout) or
                self.file\_copy(self.p.stderr, self.stderr) ):

All other file descriptors are closed (with **close\_fds=True**), otherwise the child process will hang until they are all closed.
