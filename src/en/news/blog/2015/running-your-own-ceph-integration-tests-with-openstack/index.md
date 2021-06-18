---
title: "Running your own Ceph integration tests with OpenStack"
date: "2015-07-11"
author: "loic"
tags: 
  - "ceph"
---

**Note: this is obsoleted by [Ceph integration tests made simple with OpenStack](http://dachary.org/?p=3828)**

The [Ceph](http://ceph.com/) lab has [hundreds of machines](http://pulpito.ceph.com/nodes/) continuously running [integration and upgrade tests](https://github.com/ceph/ceph-qa-suite). For instance, when a [pull request](https://github.com/ceph/ceph/pulls) modifies the Ceph core, it goes through a run of the [rados suite](https://github.com/ceph/ceph-qa-suite/tree/master/suites/rados) before being merged into master. The Ceph lab has between 100 to 3000 jobs in its queue at all times and it is convenient to be able to run integration tests on an independent infrastructure to:

- run a failed job and verify a patch fixes it
- run a full suite prior to submitting a complex modification
- verify the upgrade path from a given Ceph version to another
- etc.

[![](images/pulpito-1024x533.png "pulpito")](http://dachary.org/wp-uploads/2015/07/pulpito.png)

If an [OpenStack](http://openstack.org/) account is not available (a tenant in the OpenStack parlance), it is possible to [rent one (it takes a few minutes)](http://dachary.org/?p=3741). For instance, [OVH](https://www.ovh.com/fr/cloud/) provides an [horizon](https://launchpad.net/horizon) dashboard showing how many instances are being used to run integration tests:

[![](images/ovh-1024x579.png "ovh")](http://dachary.org/wp-uploads/2015/07/ovh.png)

The OpenStack usage is billed monthly and the accumulated costs are displayed on the customer dashboard:

[![](images/ovh-usage-1024x593.png "ovh-usage")](http://dachary.org/wp-uploads/2015/07/ovh-usage.png)  
  
After [following the installation instructions](https://github.com/dachary/teuthology/tree/wip-6502-openstack/#openstack-backend), the integration tests should be run to verify it actually works.

[![](images/tox.png "tox")](http://dachary.org/wp-uploads/2015/07/tox.png)

The [teuthology workers](https://github.com/ceph/teuthology/blob/master/scripts/worker.py#L12) process jobs. One teuthology worker can run a single job and uses from three to five virtual machines. Running two workers in parallel is the maximum for the default OpenStack quotas provided by OVH (10 instances).

teuthology-worker --tube openstack -l /tmp --archive-dir /usr/share/nginx/html

The firefly upgrade suite can then be run with:

teuthology-suite \\
  --filter=ubuntu\_14.04 \\
  --suite upgrade/firefly \\
  --suite-branch firefly \\
  --machine-type openstack \\
  --ceph firefly \\
  ~/src/ceph-qa-suite\_master/machine\_types/vps.yaml \\
  $(pwd)/teuthology/test/integration/archive-on-error.yaml

The **vps.yaml** file has settings that are suitable for virtual machines. The **archive-on-error.yaml** file make it so only failed jobs are archived, which saves ~500MB per successful job (useful when there is not a lot of disk space). The “screen” utility can be used to group workers together with the shell used to run the suites.

[![](images/screen-1024x329.png "screen")](http://dachary.org/wp-uploads/2015/07/screen.png)
