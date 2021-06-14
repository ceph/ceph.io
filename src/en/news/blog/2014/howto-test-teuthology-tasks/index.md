---
title: "HOWTO test teuthology tasks"
date: "2014-09-10"
author: "loic"
tags: 
  - "ceph"
---

The [Ceph](http://ceph.com/) integration tests run by [teuthology](https://github.com/ceph/teuthology/) are described with YAML files in the [ceph-qa-suite](https://github.com/ceph/ceph-qa-suite/) repository. The actual work is carried out on machines provisioned by teuthology via [tasks](https://github.com/ceph/ceph-qa-suite/tree/master/tasks). For instance, the [workunit](https://github.com/dachary/ceph-qa-suite/blob/wip-workunit/tasks/workunit.py) task runs a script found in the [qa/workunits](https://github.com/ceph/ceph/tree/firefly/qa/workunits/) directory of the [Ceph repository](https://github.com/ceph/ceph/).  
The [workunit.py](https://github.com/dachary/ceph-qa-suite/blob/wip-workunit/tasks/workunit.py) script, although small, is complex enough to deserve testing. Creating unit tests would require a lot of mocking and it would not catch a typo in a shell command to be run on an actual machine. Another approach is to create light weight integration tests within the ceph-qa-suite repository itself. For instance [tests/workunit](https://github.com/dachary/ceph-qa-suite/blob/wip-workunit/tests/workunit/) is designed to maximize coverage of the workunit.py script and run as quickly as possible.  
  
After modifying the workunit.py script, a target (i.e. a machine) is placed in the target.yaml file as follows:

$ ./virtualenv/bin/teuthology-lock --list-targets \\
  --owner loic@dachary.org | tee target.yaml
targets:
  vpm027.feph.com: ssh-rsa AAAAB...UNwN

and it will be used to run the tests from [tests/workunit](https://github.com/dachary/ceph-qa-suite/blob/wip-workunit/tests/workunit/) with the following command

PYTHONPATH=/home/loic/software/ceph/ceph-qa-suite \\
  ./virtualenv/bin/teuthology  --owner loic@dachary.org \\
  ~/software/ceph/ceph-qa-suite/tests/workunit/\*.yaml \\
  target.yaml

It will concatenate the files in alphabetical order and start running on the target machine, using the local copy of the workunit.py script to drive the test. However, the target machine will pull files from the net and it is convenient to override the locations from which it pulls resources to experiment without actually modifying the ceph repository (because it will trigger the gitbuilder.cgi every time and that is resources consuming) or going through the review process (which takes too much time). The following override.yaml file

overrides:
  workunit:
    branch: wip-workunits
    get\_workunits: >-
      curl -L https://github.com/dachary/ceph/archive/{branch}.tar.gz |
      tar -C {srcdir} -zxvf- --transform s:ceph-{branch}/qa/workunits:: ceph-{branch}/qa/workunits

will pull the workunits from a temporary branch of https://github.com/dachary/ceph/ instead. When foccusing on a given area of the code, only part of the tests can be run by selecting which YAML files are concatenated. For instance

PYTHONPATH=/home/loic/software/ceph/ceph-qa-suite \\
  ./virtualenv/bin/teuthology  --owner loic@dachary.org \\
  ~/software/ceph/ceph-qa-suite/tests/workunit/{01-cluster,04-inline-workunit}.yaml \\
  target.yaml

will not install Ceph or pull the workunits and only check the code dealing with the **inline\_workunit** config option works as expected. On success the output of teuthology will end with

{duration: 251.9832820892334, flavor: basic, owner: loic@dachary.org, success: true}

otherwise the lines near the **Trackback** should contain a hint related to the problem.
