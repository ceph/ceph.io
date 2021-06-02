---
title: "Teuthology docker targets hack (2/4)"
date: "2014-11-17"
author: "loic"
tags: 
  - "ceph"
---

The [teuthology](https://github.com/ceph/teuthology/) [container hack](http://dachary.org/?p=3330) is [improved](https://github.com/dachary/teuthology/compare/wip-container) to snapshot the container after [Ceph](http://ceph.com/) and its dependencies have been installed. It helps quickly testing [ceph-qa-suite tasks](https://github.com/ceph/ceph-qa-suite/tree/master/tasks). A job doing nothing but install the Firefly version of Ceph takes **14 seconds** after the initial installation (which can take between 5 to 15 minutes depending on how fast is the machine and how much bandwidth is available).

...
2014-11-17 01:21:00,067.067 INFO:teuthology.worker:Reserved job 42
2014-11-17 01:21:00,067.067 INFO:teuthology.worker:Config is:
machine\_type: container
name: foo
os\_type: ubuntu
os\_version: '14.04'
overrides:
  install:
    ceph: {branch: firefly}
owner: loic@dachary.org
priority: 1000
roles:
- \[mon.a, osd.0, osd.1, client.0\]
tasks:
- {install: null}
tube: container
verbose: false

Fetching from upstream into /home/loic/src/ceph-qa-suite\_master
...
completed on container001: sudo lsb\_release '-is':  Ubuntu
reusing existing image ceph-base-ubuntu-14.04-firefly
running 'docker' 'stop' 'container001'
completed ('docker', 'stop', u'container001') on container001:  container001
...
2014-11-17 01:21:31,677.677 INFO:teuthology.run:Summary data:
{**duration: 14**, flavor: basic, success: true}
2014-11-17 01:21:31,677.677 INFO:teuthology.run:pass

  
The [install\_packages of the install.py task](https://github.com/dachary/teuthology/blob/592ce5163b92953c70206c7e55673d6dab8eb9c7/teuthology/task/install.py#L554) detects when the remote is a container:

if hasattr(remote, 'type') and remote.type == 'container':

and instead of installing the packages in parallel on all the remotes, it checks for the existence of a docker image that has the name of the branch of the Ceph packages to be installed (it should probably be the hash commit id instead):

remote.commit\_name = config\['branch'\]
if remote.image\_exists():

If such an image does not exist, it installs the packages and create the image.

f = install\_pkgs\[system\_type\]
f(ctx, remote, pkgs\[system\_type\], config)
remote.commit(config\['branch'\])

It then stops all the remotes (i.e. all the containers). When a command is send to run on the remote, it will start a docker container based on the image containing the package installed instead of the one that only contains the base operating system.

for remote in ctx.cluster.remotes.iterkeys():
remote.commit\_name = config\['branch'\]
remote.stop()

The code does not show that it starts because it [happens implicitly when the first command is run](https://github.com/dachary/teuthology/blob/592ce5163b92953c70206c7e55673d6dab8eb9c7/teuthology/containers.py#L190).
