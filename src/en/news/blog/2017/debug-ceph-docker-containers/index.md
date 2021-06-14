---
title: "Debug Ceph Docker containers"
date: "2017-03-27"
author: "admin"
tags: 
  - "planet"
---

![Title](images/ceph-docker-debug.jpg)

For the last couple of weeks, [Erwan Velu](https://github.com/ErwanAliasr1) and I have been busy refactoring the entire [ceph-docker](https://github.com/ceph/ceph-docker) code base. Through these cosmetic changes, we implemented new mechanisms to finely grained debug containers at run time. This article was co-written with Erwan Velu and will explain what we worked on.

# [](#I-Rationale "I. Rationale")I. Rationale

People tend to believe that containers make everything easier, well this might be true when it comes to going in production and managing application lifecycle. However, while developing new functionality, it is handy to have a mechanism to handle failure to debug your Docker containers properly. Being able to inject or activate some code on the fly is a must have when developing a new containerized application. Running bash containers and/or overriding entrypoints is not enough and is quite time-consuming during your development cycle. So in a single run, you should be able to debug your code execution, inject new code if needed and get into the container to analyze what’s going on.

# [](#II-What’s-new "II. What’s new?")II. What’s new?

We implemented container’s debugging at a different level. Everything happens during container’s runtime, so any problem can be caught right away. We currently have 3 debugging options that I’ll explain in the next sections.

## [](#II-1-VERBOSE "II.1. VERBOSE")II.1. VERBOSE

This option is quite simple but very useful at the same time since it enables bash debugging, yes just that. This is done by activating `set -x`. Since all the code base is written in bash this makes the debugging quite easy. Traces of each command plus its arguments are printed to standard output after the commands have been expanded but before they are executed.

This option can be enabled during your `docker run` with the environment variable `-e DEBUG=verbose`.

## [](#II-2-FS-TREE "II.2. FS TREE")II.2. FS TREE

This is where we go deeper into the debugging. Imagine a timing issue, meaning that your code’s execution is being a slowdown for whatever reasons. It can be that the code runs in a CI with tons of virtualisation layer (nested virtualisation) or that the code runs on a heavy loaded platform (production platform with in-flight IO etc).

These issues are usually hard to identify and to replicate as well, but once you have an environment that can reproduce it, here is what we can do. We now have the ability to inject, at the very beginning of the runtime a new OS tree that might contain a new binarie or new version of a code (e.g: ceph-disk). The idea is to provide us an URL pointing to a tarball that contains this OS, then we download this archive and uncompress it on the container’s filesystem. This will override any existing files.

For instance, let’s assume you want to debug the execution of `ceph-disk`, you can easily provide a tarball containing `/usr/lib/python2.7/dist-packages/ceph_disk/main.py`. This `main.py` will replace the existing one, the one provided by the package initially.

Once the container will run and execute `ceph-disk` you will be able to analyze what’s going on based on the edit you made into `ceph-disk`‘s code.

This option can be enabled during your `docker run` with the environment variable `-e DEBUG=fstree=http://url-to-my-os-tree/`. A typical usage with a Github repository could be ‘DEBUG=fstree=[https://github.com/ErwanAliasr1/debug\_ci/archive/evelu-disk.zip’](https://github.com/ErwanAliasr1/debug_ci/archive/evelu-disk.zip’)

## [](#II-3-STAYALIVE "II.3. STAYALIVE")II.3. STAYALIVE

This one is probably the one we are most proud of, this was implemented by my fellow colleague Erwan Velu. As a developer and/or operator I’m pretty sure you already ran a container and this one failed miserably. Then you tried to look into your container’s log with `docker logs <container>` but the error was long gone and you wished you could bash inside this container to debug properly.

It’s a common thing to have the entrypoint as a bash script inside the container image and run container’s PID with an `exec()` call. The main reasons are about making the container stop if the process dies but also propagate `SIGTERM` if a user uses the `docker stop` command. If we want to keep the container alive while keeping a light footprint, the idea is to override the built-in `exec()` function of our own.

It has to run a process in background, intercept the signals to propagate the `SIGTERM` but also catches the process faults. If the process faults, a trap will run an endless loop. In such state, anyone can enter the container to debug it. To get into the container, just run `sudo docker exec -i -t <container name> /bin/bash`.

If the user runs the `docker stop` command, the `SIGTERM` is forwarded by the installed trap to the process running in background and the fault generated is voluntary ignored. This tooling is already part of the ceph-docker project and can be enabled during your `docker run` with the environment variable `-e DEBUG=stayalive`.

Note this trick isn’t specific to our project can be reused in any docker container. If you want to use it, just install the hack by copying [docker\_exec.sh](https://raw.githubusercontent.com/ceph/ceph-docker/master/ceph-releases/kraken/ubuntu/16.04/daemon/docker_exec.sh) into your container and source it into your entrypoint.

  

> One more thing, you can chain these options altogether, so they can all be activated at the same time. Simply do: `-e DEBUG=verbose,stayalive,fstree=http://url-to-my-os-tree/`. What you have to remember from this is that the code we implemented is **not only** applicable to [ceph-docker](https://github.com/ceph/ceph-docker) but can be easily re-used in any other container project.

Source: Sebastian Han ([Debug Ceph Docker containers](https://sebastien-han.fr/blog/2017/03/27/Debug-Ceph-Docker-containers/))
