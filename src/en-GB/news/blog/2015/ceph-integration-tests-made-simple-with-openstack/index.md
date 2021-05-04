---
title: "Ceph integration tests made simple with OpenStack"
date: "2015-07-24"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

If an [OpenStack](http://openstack.org/) tenant (account in the OpenStack parlance) is available, the [Ceph](http://ceph.com/) [integration tests](https://github.com/ceph/ceph-qa-suite) can be run with the **teuthology-openstack** command , which will create the necessary virtual machines automatically (see [the detailed instructions to get started](https://github.com/dachary/teuthology/tree/wip-6502-openstack-v2/#openstack-backend)). To do its work, it uses the [teuthology OpenStack backend](http://dachary.org/?p=3767) behind the scenes so the user does not need to know about it.  
The **teuthology-openstack** command has the same options as **teuthology-suite** and can be run as follows:

$ teuthology-openstack \\
  --simultaneous-jobs 70 --key-name myself \\
  --subset 10/18 --suite rados \\
  --suite-branch next --ceph next
...
Scheduling rados/thrash/{0-size-min-size-overrides/...
Suite rados in suites/rados scheduled 248 jobs.

web interface: http://167.114.242.148:8081/
ssh access   : ssh ubuntu@167.114.242.148 # logs in /usr/share/nginx/html

As the suite progresses, its status can be monitored by visiting the web interface::

[![](images/s-pulpito-1024x460.png "s-pulpito")](http://dachary.org/wp-uploads/2015/07/s-pulpito.png)

And the horizon OpenStack dashboard shows resource usage for the run:

[![](images/s-ovh-1024x479.png "s-ovh")](http://dachary.org/wp-uploads/2015/07/s-ovh.png)  
  
If something goes wrong, the easiest way to free all resources is to run

ssh ubuntu@167.114.242.148 sudo /etc/init.d/teuthology restart

where the IP address is the one listed as a reminder (“ssh access: …”) in the output of each **teuthology-openstack** command (see example above)..  
When the run terminates, the virtual machine hosting the web interface and hosting the test results is not destroyed (that would be inconvenient for forensic analysis). Instead, it will be re-used by the next **teuthology-openstack** run.  
When the cluster is no longer needed (and the results have been analyzed) it can be destroyed entirely with

teuthology-openstack --teardown

Special thanks to Zack Cerza, Andrew Schoen, Nathan Cutler and Kefu Chai for testing, patching, advising, proofreading and moral support over the past two months ![;-)](http://dachary.org/wp-includes/images/smilies/icon_wink.gif)
