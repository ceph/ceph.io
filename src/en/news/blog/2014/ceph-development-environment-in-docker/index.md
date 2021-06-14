---
title: "Ceph development environment in Docker"
date: "2014-09-28"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [Docker](http://docker.io/) package is installed with

sudo apt-get install docker.io

and the **loic** user is made part of the **docker** group to allow it to run containers.

$ grep docker /etc/group
docker:x:142:loic

The most popular [ubuntu](http://ubuntu.com/) image collection reported by

$ docker search ubuntu | head -2
NAME    DESCRIPTION                 STARS ...
ubuntu  Official Ubuntu base image  715   ...

is pulled locally with

docker pull ubuntu

A container is created from the desired image (as found by **docker images**) is selected with:

docker run -v /home/loic:/home/loic -t -i ubuntu:14.04

the home directory is mounted into the container because it contains the local [Ceph](http://ceph.com/) clone used for development. The user **loic** is recreated in the container with

adduser loic

and the necessary development packages are installed with

apt-get build-dep ceph
apt-get install libudev-dev git-core python-virtualenv emacs24-nox ccache

The state of the container is saved for re-use with

$ docker ps
CONTAINER ID        IMAGE               ...
2c694d6d5f90        ubuntu:14.04        ...
$ docker commit 2c694d6d5f90 ubuntu-14.04-ceph-devel

Ceph is then compiled and tested locally with

cd ~/software/ceph/ceph
./autogen.sh
./configure --disable-static --with-debug \\
   CC='ccache gcc' CFLAGS="-Wall -g" \\
   CXX='ccache g++' CXXFLAGS="-Wall -g"
make -j4
make check

  
If there is not enough space in **/var/lib/docker** it can be moved with

$ grep ^DOCKER\_OPTS /etc/default/docker
DOCKER\_OPTS="-g=/home/docker"
$ restart docker

The **devicemapper** storage backend is [preferred](http://www.projectatomic.io/docs/filesystems/).

$ grep ^DOCKER\_OPTS /etc/default/docker
DOCKER\_OPTS="-g=/home/docker --storage-driver=devicemapper"
$ restart docker

By default it uses files but Yann Dupont found that it can also be mapped to block devices instead with

\--storage-opt dm.metadatadev=/dev/dm-26
--storage-opt dm.datadev=/dev/dm-27
--storage-opt dm.fs=xfs

to save I/O.
