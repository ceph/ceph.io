---
title: "A make check bot for Ceph contributors"
date: "2014-12-21"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [automated make check for Ceph](https://github.com/loic-bot) bot runs on [Ceph](http://ceph.com/) [pull requests](https://github.com/ceph/ceph/pulls). It is still experimental and will not be triggered by all pull requests yet.

[![](images/bot.png "bot")](http://dachary.org/wp-uploads/2014/12/bot.png)

It does the following:

- Create a docker container (using [ceph-test-helper.sh](http://workbench.dachary.org/ceph/ceph/blob/pull/3228/src/test/docker-test-helper.sh#L171))
- Checkout the merge of the pull request against the destination branch (tested on master, next, giant, firefly)
- Execute [run-make-check.sh](http://workbench.dachary.org/ceph/ceph/blob/pull/3228/run-make-check.sh)
- Add a [comment to the pull request](https://github.com/ceph/ceph/pull/3228#issuecomment-67777310) with a link to the full output of **run-make-check.sh**.

A use case for developers is:

- write a patch and send a pull request
- switch to another branch and work on another patch while the bot is running
- if the bot reports failure, switch back to the original branch and repush a fix: the bot will notice the repush and run again

It also helps reviewers who can wait until the bot succeeds before looking at the patch closely.  
  
To debug an error, **run-make-check.sh** can be executed locally on the branch of the pull request, after merging or rebasing against the destination branch.

It can also be run in a container for [CentOS 7](http://workbench.dachary.org/ceph/ceph/blob/pull/3228/src/test/container-make-check-centos-centos7.sh) or [Ubuntu 14.04](http://workbench.dachary.org/ceph/ceph/blob/pull/3228/src/test/container-make-check-ubuntu-14.04.sh). Each container needs about 10GB of disk. They are run using a dedicated Ceph clone to not be disturbed while development continues.

The [preparation of the container](http://workbench.dachary.org/ceph/ceph/blob/pull/3228/src/test/centos/Dockerfile.in) uses [install-deps.sh](http://workbench.dachary.org/ceph/ceph/blob/pull/3228/install-deps.sh) and takes a long time (from five to thirty minutes or more depending on the bandwidth). It is however done once and reused as long as its depedencies (ceph.spec.in, debian/control, etc.) are not modified. The second step, including **make -jX check**, takes six minutes on a 64GB RAM, 250GB SSD, 24 core server and fifteen minutes on a 16GB RAM, 250GB spinner, 4 core laptop. The **\-jX** is set to half of the number of processors reported by **/proc/cpuinfo** (i.e. make -j4 if there are 8 processors and make -j12 if there are 24 processors).

The bot runs in a container so that cleaning up a failed test or aborting if it takes too long (30 minutes) can be done by removing the container (for instance with **docker stop ceph-ubuntu-14.04**).

The bot is [triggered](http://dachary.org/wp-uploads/2014/12/gitlab-runner.txt) from [a Gitlab CI](http://dachary.org/dachary.org/?p=3401) based on a [mirror of the git repository](http://dachary.org/wp-uploads/2014/12/mirror.txt). They both need to be polished.
