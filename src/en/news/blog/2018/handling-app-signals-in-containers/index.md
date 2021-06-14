---
title: "Handling app signals in containers"
date: "2018-03-26"
author: "admin"
tags: 
  - "planet"
---

![Title](images/ceph-container-handling-signals.jpg)

A year ago, I was describing how we were debugging our ceph containers; today I’m back with yet another great thing we wrote :). Sometimes, when a process receives a signal and if that process runs within a container, you might want to do something before or after its termination. That’s what we are going to discuss.

## [](#Running-actions-before-or-after-terminating-a-process "Running actions before or after terminating a process")Running actions before or after terminating a process

Performing actions before or after a process get terminated on a host is easy because you don’t lose its environment. In the micro-services world, your application runs in a container, and this application is PID 1, which means if it exits then your container goes away.

However, sometimes you want to gracefully terminate your programs, just like if they were running on a host and that systemd was doing this for you. For example, on ceph-container we realized at some point that stopping an OSD running on an encrypted partition (dmcrypt + LUKS) was causing issues. Indeed LUKS was not being closed after the OSD process exited which caused us a lot of trouble to merely do a restart of that container.

Typically what we are looking at here is to unmount OSD partitions and close LUKS devices, **but after** the OSD termination. Remember the lines above, how can you perform that action if the container stops? Well your LUKS remained open and stuck in your dead container namespace… Not appealing right?

Fortunately, we came up with a solution that supersedes our debugging mechanism.

As explained in the previous article we remapped the `exec` function. Traditionally, we start our container process with `exec`, so we fork the entrypoint process by breaking any relationship with it. Our new [`exec` function](https://github.com/ceph/ceph-container/blob/master/src/daemon/docker_exec.sh#L47-L64) contains a [`trap`](https://github.com/ceph/ceph-container/blob/master/src/daemon/docker_exec.sh#L51) that ‘traps’ signal, we look for `SIGTERM` here. If the container receives a `SIGTERM` by let’s say `docker stop` then our trap gets activated. The trap calls a [function](https://github.com/ceph/ceph-container/blob/master/src/daemon/docker_exec.sh#L35-L45) that has two capabilities:

- run a [pre task function](https://github.com/ceph/ceph-container/blob/master/src/daemon/docker_exec.sh#L42) before [sending `SIGTERM`](https://github.com/ceph/ceph-container/blob/master/src/daemon/docker_exec.sh#L43) to the process
- run a [post task function](https://github.com/ceph/ceph-container/blob/master/src/daemon/docker_exec.sh#L44) after `SIGTERM` was sent to the process

In our scenario, this is our [`sigterm_cleanup_post` function](https://github.com/ceph/ceph-container/blob/master/src/daemon/osd_scenarios/osd_disk_activate.sh#L77-L84).

Et voilà, that’s how you handle signal for your containers.

  

> More articles to follow on containers!

Source: Sebastian Han ([Handling app signals in containers](https://sebastien-han.fr/blog/2018/03/26/Handling-app-signals-in-containers/))
