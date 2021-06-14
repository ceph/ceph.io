---
title: "Teuthology docker targets hack (5/5)"
date: "2015-06-06"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [teuthology](https://github.com/ceph/teuthology/) [container hack](http://dachary.org/?p=3441) is improved [to run teuthology-suite](https://github.com/ceph/teuthology/compare/master...dachary:wip-docker-integration-v2). For instance:

./virtualenv/bin/teuthology-suite \\
  --distro ubuntu \\
  --suite-dir $HOME/software/ceph/ceph-qa-suite \\
  --config-file docker-integration/teuthology.yaml \\
  --machine-type container \\
  --owner loic@dachary.org \\
  --filter 'rados:basic/{clusters/fixed-2.yaml fs/btrfs.yaml \\
     msgr-failures/few.yaml tasks/rados\_cls\_all.yaml}' \\
  --suite rados/basic --ceph ANY \\
  $(pwd)/docker-integration/ubuntu.yaml

schedules a single job out of the rados suite and the results can be collected in the teuthology-worker archive directory:

$ tail -5 /tmp/a/loic-2015-06-06\_16:06:57-rados:\\
    basic-ANY---basic-container/22/teuthology.log
06:57-rados:basic-ANY---basic-container/22/teuthology.log
    tasks/rados\_cls\_all.yaml}', duration: 1017.5819008350372, \\
  flavor: basic, owner: loic@dachary.org,
  success: true}
2015-06-06T16:24:38.634 WARNING:teuthology.report:No result\_server \\
  in config; not reporting results
2015-06-06T16:24:38.634 INFO:teuthology.run:pass

### tox integration tests

The [docker-delegate](https://github.com/dachary/teuthology/commit/019fc540ecc49a6da460e537456aad720054427d#diff-b91f3d5bd63fcd17221b267e851608e8R45) tox environment can be used to setup a teuthology cluster to run integration tests [such as lock –list –all](https://github.com/dachary/teuthology/commit/30c4d6f2f130cd6ff293947c404a081573caab82#diff-5b0fb4159ba8a00519e51cd3674ed386R55).  
A container is created with **tox -e docker-delegate**, a cluster setup and tox run again in the container to take advantage of it with **tox -e docker-integration**.

$ tox -e docker-delegate
GLOB sdist-make: /home/loic/software/ceph/teuthology/setup.py
docker-delegate runtests: PYTHONHASHSEED='1772658356'
...
docker run --rm --privileged --name teuthology-ubuntu-14.04 \\
   --hostname teuthology-ubuntu-14.04 \\
   -v /tmp:/tmp -v /packages \\
   -v /var/run/docker.sock:/run/docker.sock \\
   -v /usr/bin/docker:/bin/docker \\
   -v /home/loic:/home/loic \\
   -w /home/loic/software/ceph/teuthology \\
   --user 1000 teuthology-ubuntu-14.04 \\
   env HOME=/home/loic tox -e docker-integration
...
GLOB sdist-make: /home/loic/software/ceph/teuthology/setup.py
docker-integration recreate: /home/loic/software/ceph/teuthology/.tox/docker-integration
...
docker-integration/test.py::TestLock::test\_list PASSED

=========================== 1 passed in 0.12 seconds ===========================
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ summary \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  docker-integration: commands succeeded
  congratulations ![:)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ summary \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  docker-delegate: commands succeeded
  congratulations ![:)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)

### container based teuthology-suite

The container created for tox integration tests can be re-used to manually run jobs.

docker run \\
  --privileged \\
  --rm --name teuthology-ubuntu-14.04 \\
  -v /srv/hosts \\
  -v /tmp:/tmp/tmp \\
  -v /home/tmp:/packages \\
  -v /var/run/docker.sock:/run/docker.sock \\
  -v $(which docker):/bin/docker \\
  -v $HOME:$HOME -w $(pwd) \\
  --user $(id -u) -t -i \\
  teuthology-ubuntu-14.04 bash

The **/home/tmp** directory must first be populated with [make-debs.sh](https://github.com/ceph/ceph/blob/master/make-debs.sh)

$ make-debs.sh /home/tmp

Once in the container, the teuthology cluster is created with

loic@85fdacf1c0e3:~/software/ceph/teuthology$ docker-integration/setup.sh
docker-integration/setup.sh
Current branch master is up to date.
New python executable in ./virtualenv/bin/python
...
loic@85fdacf1c0e3:~/software/ceph/teuthology$ ps
  PID TTY          TIME CMD
    1 ?        00:00:01 bash
  215 ?        00:00:04 pecan
  221 ?        00:00:00 beanstalkd
12126 ?        00:00:00 teuthology-worker

The [beanstalkd](http://kr.github.com/beanstalkd/) bus is used by **teuthology-schedule** to communicate with the **teuthology-worker** which will **teuthology-lock** machines from **paddles** (the **pecan** daemon). When the machines are locked, it calls **teuthology** to run the job and stores the results in the archive directory for forensic analysis (/tmp/a in the example above).
