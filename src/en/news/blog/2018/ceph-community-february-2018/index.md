---
title: "Ceph Community Newsletter, Feb 2018 edition"
date: "2018-03-01"
author: "lvaz"
tags:
  - "ceph"
  - "community"
  - "newsletter"
---

Hey Cephers! We are starting this new section on Ceph website to talk about the project highlights on a monthly newsletter. We hope you enjoy it!

### Project updates

- The SUSE OpenAttic team is porting their management dashboard upstream into ceph-mgr, where it will replace the current 'dashboard' module and be expanded to include greater management functionality.
- [Rook](https://rook.io/) v0.7 was released with a new container image based on upstream Ceph. Rook is an operator for managing Ceph clusters in kubernetes.
- ceph-volume now has full support for both bluestore and filestore, with and without encryption. ceph-disk will be deprecated for mimic. The latest ceph-volume has been backported to [Luminous in v12.2.3](https://ceph.com/releases/v12-2-3-luminous-released/).
- Cephalocon [conference program was finally published](http://cephalocon.doit.com.cn/index_en.html#agenda), thanks a lot to everyone which submitted proposals!
- At the moment we are working on a brand new survey for Ceph users and we will be posting it soon! Stay tuned!

### Releases

- [Luminous v12.2.3](https://ceph.com/releases/v12-2-3-luminous-released/)
- [Luminous v12.2.4](https://ceph.com/releases/v12-2-4-luminous-released/)

### Ceph Planet

- [How to do a Ceph cluster maintenance/shutdown](https://ceph.com/planet/how-to-do-a-ceph-cluster-maintenance-shutdown/)
- [Ceph Manager Dashboard v2](https://ceph.com/planet/ceph-manager-dashboard-v2/)

### Project Meetings

The following project meetings happened in February, the video recordings have been uploaded to Ceph YouTube channel.

- [Ceph Developers Montly (Feb 07)](https://www.youtube.com/watch?v=9JIboNGIiA8)
- [Ceph Performance Weekly (Feb 01)](https://www.youtube.com/watch?v=m1T4yBUOE8Y)
- [Ceph Performance Weekly (Feb 08)](https://www.youtube.com/watch?v=fSwDVVy2sPM)
- [Ceph Performance Weekly (Feb 15)](https://www.youtube.com/watch?v=9DryqawCMkY)
- [Ceph Performance Weekly (Feb 22)](https://www.youtube.com/watch?v=DQCn0yQ2utk)

### Conferences

#### linux.conf.au 2018

[Sage Weil](https://x.com/liewegas) went to [LCA](https://linux.conf.au/) in Sydney and presented the talk "[Making distributed storage easy: usability in Ceph Luminous and beyond](https://www.youtube.com/watch?v=GrStE7XSKFE)" about the current status of Ceph as well the future plans for the project.

#### DevConf.cz

[Orit Wasserman](https://x.com/oritwas), [Greg Farnum](https://x.com/gregsfortytwo) and [Leo Vaz](https://x.com/leonardovaz) attended to [DevConf](https://devconf.info/cz/2018) in Brno, Czechia. Orit presented the talk "[Everything you wanted to know about object storage](https://www.youtube.com/watch?v=sHLEjKfACuk)", Greg talked about "[Programming your Storage with Ceph](https://www.youtube.com/watch?v=gEKPoBxP5ZQ)". Besides the talks we also had the "Cephers at DevConf" meetup which was attended by 10 people.

#### FOSDEM

Ceph joined Gluster, OpenStack Swift, LizardFS and OpenEBS on the [Software Defined Storage DevRoom](https://fosdem.org/2018/schedule/track/software_defined_storage/) at [FOSDEM 2018](https://fosdem.org/2018/) and the following Ceph talks have been presented:

- [Ceph management with openATTIC](https://fosdem.org/2018/schedule/event/ceph_mgmt_openattic/), by [Kai Wagner](https://x.com/ImTheKai)
- [Ceph & ELK: Use the power of the ELK stack to know more about your Ceph Cluster!](https://fosdem.org/2018/schedule/event/ceph_and_elk/) by [Abhishek Lekshmanan](http://includeio.stream/) and [Denis Kondratenko](https://twitter.com/stdden)
- [CephFS Gateways: Distributed Filesystem Access via NFS and Samba](https://fosdem.org/2018/schedule/event/cephfs_gateways/), by [David Disseldorp](https://x.com/dmdiss) and [Supriti Singh](https://github.com/supriti)
- [How to backup Ceph at scale](https://fosdem.org/2018/schedule/event/backup_ceph_at_scale/), by [Bartłomiej Święcki](https://github.com/byo)

We also had a talk presented by [John Spray](https://x.com/jcsp_tweets) at the [Virtualization and IaaS DevRoom](https://fosdem.org/2018/schedule/track/virtualization_and_iaas/) called "[Distributed File Storage in Multi-Tenant Clouds using CephFS](https://fosdem.org/2018/schedule/event/vai_distributed_file_storage/)".

Finally, we shared a table with our friends from Gluster project at FOSDEM's booth area and we distributed a lot of cool swag and stickers!

#### Ceph Day Germany

[Deutsche Telekom AG](https://www.telekom.com/en) hosted the [Ceph Day Germany](https://ceph.com/cephdays/germany/) in Darmstadt. The event was attended by over 150 people from Europe Ceph Community and the video recordings for the 14 talks presented have been [published on Ceph's YouTube channel](https://www.youtube.com/watch?v=5W6K_ruq66w&list=PLrBUGiINAakOYmNQsjbl7KidgY9p-5QBX). Special thanks to [Danny Al-Gaaf](https://x.com/dannyalgaaf) for all his help to organize the event and also for recording the presentations.

### Upcoming conferences

- [Cephalocon APAC](http://cephalocon.doit.com.cn/index_en.html), Mar 22-23 in Beijing, China
- [Ceph Day London](https://ceph.com/cephdays/london/), Apr 19 in London, United Kingdom
- [KubeCon Europe 2018](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/), May 2-4 in Copenhagen, Denmark
- [OpenStack Summit Vancouver](https://www.openstack.org/summit/vancouver-2018), May 21-24 in Vancouver, Canada
