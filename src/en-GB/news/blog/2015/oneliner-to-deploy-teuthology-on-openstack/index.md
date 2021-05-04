---
title: "oneliner to deploy teuthology on OpenStack"
date: "2015-07-13"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

**Note: this is obsoleted by [Ceph integration tests made simple with OpenStack](http://dachary.org/?p=3828)**

The [teuthology](https://github.com/ceph/teuthology/) can be installed as a dedicated [OpenStack](http://openstack.org/) instance on [OVH](https://www.ovh.com/fr/cloud/) using the [OpenStack backend](https://github.com/dachary/teuthology/tree/wip-6502-openstack/#openstack-backend) with:

nova boot \\
   --image 'Ubuntu 14.04' \\
   --flavor 'vps-ssd-1' \\
   --key-name loic \\
   --user-data <(curl --silent \\
     https://raw.githubusercontent.com/dachary/teuthology/wip-6502-openstack/openstack-user-data.txt | \\
     sed -e "s|OPENRC|$(env | grep OS\_ | tr '\\n' ' ')|") teuthology

Assuming the IP assigned to the instance is **167.114.235.222**, the following will display the progress of the integration tests that are run immediately after the instance is created:

ssh ubuntu@167.114.235.222 tail -n 2000000 -f /tmp/init.out

If all goes well, it will complete with:

...
========================= 8 passed in 1845.59 seconds =============
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ summary \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
  openstack-integration: commands succeeded
  congratulations ![:)](http://dachary.org/wp-includes/images/smilies/icon_smile.gif)

And the pulpito dashboard will display the remains of the integration tests at **167.114.235.222:8081** like so:

[![](images/integration.png "integration")](http://dachary.org/wp-uploads/2015/07/integration.png)
