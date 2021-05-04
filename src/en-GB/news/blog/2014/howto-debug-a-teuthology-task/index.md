---
title: "HOWTO debug a teuthology task"
date: "2014-11-25"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

To debug a modification to a [ceph-qa-suite](https://github.com/ceph/ceph-qa-suite/) task ( for instance [repair\_test.py](https://github.com/ceph/ceph-qa-suite/blob/master/tasks/repair_test.py)), a [teuthology](https://github.com/ceph/teuthology/) target is locked with:

$ ./virtualenv/bin/teuthology-lock --lock-many 1 --owner loic@dachary.org
$ ./virtualenv/bin/teuthology-lock --list-targets --owner loic@dachary.org > targets.yaml

and used to run the test with:

./virtualenv/bin/teuthology \\
  --suite-path $HOME/software/ceph/ceph-qa-suite \\
  --owner loic@dachary.org \\
  $HOME/software/ceph/ceph-qa-suite/suites/rados/basic/tasks/repair\_test.yaml \\
  roles.yaml

where **roles.yaml** sets all roles to one target:

roles:
- \[mon.0, osd.0, osd.1, osd.2, osd.3, osd.4, client.0\]

Each run requires the installation and deinstallation of all [Ceph](http://ceph.com/) packages and takes minutes. The installation part of [repair\_test.yaml](https://github.com/ceph/ceph-qa-suite/blob/master/suites/rados/basic/tasks/repair_test.yaml#L8) can be commented out and the packages installed manually.

$ cat repair.yaml
...
tasks:
#- install:
- ceph:
- repair\_test:

  
The existing packages are removed:

sudo apt-get remove --purge python-ceph ceph-common librados2 librbd1 ceph-fuse libcephfs1-dbg libcephfs-java libcephfs1 libcephfs-jni ceph-fs-common

The repository is set to the desired branch (for instance **wip-10018-primary-erasure-code-hinfo**), as compiled by [gitbuilder.cgi](http://ceph.com/gitbuilder.cgi) with:

$ echo deb http://gitbuilder.ceph.com/ceph-deb-trusty-x86\_64-basic/ref/wip-10018-primary-erasure-code-hinfo trusty main | sudo tee /etc/apt/sources.list.d/ceph.list

The packages are installed:

$ sudo apt-get update
$ sudo DEBIAN\_FRONTEND=noninteractive apt-get -y --force-yes -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" install ceph ceph-dbg ceph-mds ceph-mds-dbg ceph-common ceph-common-dbg ceph-fuse ceph-fuse-dbg ceph-test ceph-test-dbg radosgw radosgw-dbg python-ceph libcephfs1 libcephfs1-dbg libcephfs-java librados2 librados2-dbg librbd1 librbd1-dbg

and the repositories cleaned (this must be done again after each test completes):

$ rm -fr cephtest/ && sudo rm -fr /var/lib/ceph && sudo rm -fr /var/log/ceph/\*

Utilities must be copied from the teuthology sources with (assuming vpm178 is the target):

$ scp teuthology/task/daemon-helper teuthology/task/adjust-ulimits ubuntu@vpm178:/tmp
$ ssh ubuntu@vpm178 sudo cp -a /tmp/{daemon-helper,adjust-ulimits} /usr/bin
