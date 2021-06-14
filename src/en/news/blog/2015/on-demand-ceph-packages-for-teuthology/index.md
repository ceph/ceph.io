---
title: "On demand Ceph packages for teuthology"
date: "2015-09-26"
author: "admin"
tags: 
  - "planet"
---

When a [teuthology](https://github.com/ceph/teuthology/) jobs install [Ceph](http://ceph.com/), it uses packages created by [gitbuilder](http://ceph.com/gitbuilder.cgi). These packages are built every time a branch is pushed to the [official repository](https://github.com/ceph/ceph).

Contributors who do not have write access to the official repository, can either ask a developer with access to push a branch for them or setup a gitbuilder repository, using [autobuild-ceph](https://github.com/ceph/autobuild-ceph/). Asking a developer is inconvenient because it takes time and also because it creates packages for every supported operating system, even when only one of them would be enough. In addition there often is a long wait queue because the gitbuilder of the [sepia](http://ceph.github.io/sepia/) lab is very busy. Setting up a gitbuilder repository reduces wait time but it has proven to be too time and resources consuming for most contributors.

The [buildpackages](https://github.com/ceph/ceph-qa-suite/blob/master/tasks/buildpackages.py) task can be used to resolve that problem and create the packages required for a particular job on demand. When added to a job that has an [install](https://github.com/ceph/teuthology/blob/master/teuthology/task/install.py) task, it will:

- always run before the install task regardless of its position in the list of tasks (see the buildpackages\_prep function in [the teuthology internal tasks](https://github.com/ceph/teuthology/blob/master/teuthology/task/internal.py) for more information).
- create an http server, unless it already exists
- set **gitbuilder\_host** in ~/.teuthology.yaml to the http server
- find the SHA1 of the commit that the install task needs
- checkout the ceph repository at SHA1 and build the package, in a dedicated server
- upload the packages to the http server, using directory names that mimic the gitbuilder conventions used in the lab [gitbuilder](http://ceph.com/gitbuilder.cgi) and destroy the server used to build them

When the install task looks for packages, it uses the http server populated by the **buildpackages** task. The teuthology cluster keeps track of which packages were built for which architecture (via makefile timestamp files). When another job needs the same packages, the **buildpackages** task will notice they already have been built and uploaded to the http server and do nothing.

A [test suite](https://github.com/ceph/ceph-qa-suite/tree/master/suites/teuthology/buildpackages) verifies the **buildpackages** task works as expected and can be run with:

teuthology-openstack --verbose 
   --key-name myself --key-filename ~/Downloads/myself 
   --ceph-git-url http://workbench.dachary.org/ceph/ceph.git 
   --ceph hammer --suite teuthology/buildpackages

The **–ceph-git-url** is the repository from which the branch specified with **–ceph** is cloned. It defaults to **http://github.com/ceph/ceph** which requires write access to the official Ceph repository.

Source: Dachary ([On demand Ceph packages for teuthology](http://dachary.org/?p=3891))
