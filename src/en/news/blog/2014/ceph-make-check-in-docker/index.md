---
title: "Ceph make check in docker"
date: "2014-10-07"
author: "loic"
tags: 
  - "ceph"
---

After [Ceph](http://ceph.com/) is built from sources, unit and functional tests can be run with **make check**. Delegating the execution to a container makes it possible to:

- keep working on the sources without disrupting the run
- run functional tests that require root privileges without modifying the development environment
- check various operating systems

The [src/test/docker-test-helper.sh](https://github.com/dachary/ceph/commit/241c839ce54131ebf8f40f3623ffd5a186bf6d22#diff-74a0b360984aea2adfc7358e2952c655R222) library can be used [from the command line](https://github.com/dachary/ceph/commit/241c839ce54131ebf8f40f3623ffd5a186bf6d22#diff-e3ca68f782a6113dafc4931d96dd648eR1):

$ test/docker-test.sh --os-type ubuntu --os-version 14.04 make check &
$ test/docker-test.sh --os-type centos --os-version centos7 make check &

Each run uses a clone of the current repository and pulls from origin before executing the command. For instance, if running from **/srv/ceph**, the centos run will run make check in **/srv/ceph-centos-centos7** which is [bind mounted](https://docs.docker.com/userguide/dockervolumes/) in the container. A possible workflow is:

- work
- commit
- test/docker-test.sh make check which pulls the latest commits
- keep working
- check the make check output

In case an error happens, debugging starts by running a shell in the container

$ test/docker-test.sh --os-type ubuntu --os-version 14.04 --shell
remote: Counting objects: 10, done.
remote: Compressing objects: 100% (10/10), done.
remote: Total 10 (delta 8), reused 0 (delta 0)
Unpacking objects: 100% (10/10), done.
From /home/loic/software/ceph/ceph
 + 15046fe...8a39cad wip-9665 -> origin/wip-9665
HEAD is now at 8a39cad autotools: add --enable-docker
loic@203c085f3dc1:/srv/ceph-ubuntu-14.04$

The first time **test/docker-test.sh** runs, it creates [a docker images populated](https://github.com/dachary/ceph/commit/241c839ce54131ebf8f40f3623ffd5a186bf6d22#diff-74a0b360984aea2adfc7358e2952c655R99) with the packages necessary to compile and run Ceph. This lowers the overhead to run a test in the container:

$ time test/docker-test.sh --os-type ubuntu --os-version 14.04 unittest\_str\_map
HEAD is now at 8a39cad autotools: add --enable-docker
Running main() from gtest\_main.cc
\[==========\] Running 2 tests from 1 test case.
\[----------\] Global test environment set-up.
\[----------\] 2 tests from str\_map
\[ RUN      \] str\_map.json
\[       OK \] str\_map.json (1 ms)
\[ RUN      \] str\_map.plaintext
\[       OK \] str\_map.plaintext (0 ms)
\[----------\] 2 tests from str\_map (1 ms total)

\[----------\] Global test environment tear-down
\[==========\] 2 tests from 1 test case ran. (1 ms total)
\[  PASSED  \] 2 tests.

real	0m3.340s
user	0m0.071s
sys	0m0.046s
