---
title: "Puppet modules for Ceph finally landed!"
date: "2013-03-25"
author: "shan"
tags: 
  - "bobtail"
  - "ceph"
  - "planet"
  - "storage"
---

Quite recently [François Charlier](https://github.com/fcharlier) and [I](http://sebastien-han.fr/) worked together on the Puppet modules for Ceph on behalf of our employer [eNovance](http://www.enovance.com/). In fact, François started to work on them last summer, back then he achieved the Monitor manifests. So basically, we worked on the OSD manifest. Modules are in pretty good shape thus we thought it was important to communicate to the community. That’s enough talk, let’s dive into these modules and explain what do they do. See below what’s available:

- Testing environment is [Vagrant](http://www.vagrantup.com/) ready.
- Bobtail Debian latest stable version will be installed
- The module only supports CephX, at least for now
- Generic deployment for 3 monitors based on a template file examples/common.sh which respectively includes mon.sh, osd.sh, mds.sh.
- Generic deployment for N OSDs. OSD disks need to be set from the examples/site.pp file (line 71). Puppet will format specified disks in XFS (only filesystem implemented) using these options: `-f -d agcount=<cpu-core-number> -l size=1024m -n size=64k` and finally mounted with: `rw,noatime,inode64`. Then it will mount all of them and append the appropriate lines in the fstab file of each storage node. Finally the OSDs will be added into Ceph.

All the necessary materials (sources and how-to) are publicly available (and for free) under AGPL license on [Github](https://github.com/enovance/puppet-ceph). Those manifests do the job quite nicely, although we still need to work on MDS (90% done, just need a validation),  RGW (0% done) and a more flexible implementation (authentication and filesystem support). Obviously comments, constructive critics and feedback are more then welcome. Thus don’t hesitate to drop an email to either François (f.charlier@enovance.com) or I (sebastien@enovance.com) if you have further questions.
