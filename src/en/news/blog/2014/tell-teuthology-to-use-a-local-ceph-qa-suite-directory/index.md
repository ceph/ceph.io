---
title: "Tell teuthology to use a local ceph-qa-suite directory"
date: "2014-08-14"
author: "loic"
tags: 
  - "ceph"
---

By default [teuthology](https://github.com/ceph/teuthology/) will [clone](https://github.com/ceph/teuthology/blob/master/teuthology/repo_utils.py#L61) the [ceph-qa-suite](https://github.com/ceph/ceph-qa-suite) repository and use the [tasks](https://github.com/ceph/ceph-qa-suite/tree/master/tasks) it contains. If tasks have been modified localy, teuthology can be instructed to [use a local directory](https://github.com/ceph/teuthology/blob/master/teuthology/run.py#L77) by inserting something like:

suite\_path: /home/loic/software/ceph/ceph-qa-suite

in the teuthology job yaml file. The directory must then be added to the **PYTHONPATH**

PYTHONPATH=/home/loic/software/ceph/ceph-qa-suite \\
   ./virtualenv/bin/teuthology  --owner loic@dachary.org \\
   /tmp/work.yaml targets.yaml
