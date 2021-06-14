---
title: "faster debugging of a teuthology workunit"
date: "2015-08-22"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [Ceph](http://ceph.com/) [integration tests](https://github.com/ceph/ceph-qa-suite) run via [teuthology](https://github.com/ceph/teuthology/) rely on [workunits](https://github.com/ceph/ceph/blob/master/qa/workunits/) found in the Ceph repository. For instance:

- the [/cephtool/test.sh](https://github.com/ceph/ceph/blob/hammer/qa/workunits/cephtool/test.sh) workunit is modified
- it is pushed to a **wip-** in the official [Ceph](https://github.com/ceph/ceph) git repository
- the [gitbuilder](http://ceph.com/gitbuilder.cgi) will automatically build packages for all supported distributions for this **wip-** branch
- the [rados/singleton/all/cephtool](https://github.com/ceph/ceph-qa-suite/blob/master/suites/rados/singleton/all/cephtool.yaml#L20) suite can be run with **teuthology-suite –suite rados/singleton**
- the [workunit task](https://github.com/ceph/ceph-qa-suite/blob/master/tasks/workunit.py#L296) fetches the workunits directory from the [Ceph](https://github.com/ceph/ceph) git repository and runs it

There is no need for Ceph to be packaged each time the workunit script is modified. Instead it can be fetched from a pull request:

- the [cephtool/test.sh](https://github.com/ceph/ceph/blob/hammer/qa/workunits/cephtool/test.sh) workunit is modified
- the [pull request](https://github.com/ceph/ceph/pulls) number **2043** is created or updated with the modified workunit
- the **workunit.yaml** file is created with
    
    overrides:
      workunit:
          branch: refs/pull/2043/head
    
- the [rados/singleton/all/cephtool](https://github.com/ceph/ceph-qa-suite/blob/master/suites/rados/singleton/all/cephtool.yaml#L20) suite can be run with **teuthology-suite –suite rados/singleton $(pwd)/workunit.yaml**
- the [workunit task](https://github.com/ceph/ceph-qa-suite/blob/master/tasks/workunit.py#L71) fetch the workunits directory in the branch **refs/pull/2043/head** from the [Ceph](https://github.com/ceph/ceph) git repository and runs it

For each pull request, github implicitly creates a reference in the [target git repository](https://github.com/ceph/ceph). This reference is mirrored to [git.ceph.com](http://git.ceph.com/) where the workunit task can extract it. The **teuthology-suite** command accepts yaml files in argument and they are assumed to be relative to the root of a clone of the **ceph-qa-suite** repository. By providing an absolute path (**$(pwd)/workunit.yaml**) the file is read from the current directory instead and there is no need to commit it to the **ceph-qa-suite** repository.
