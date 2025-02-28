---
title: "Ceph Community Newsletter, April 2018 edition"
date: "2018-05-01"
author: "lvaz"
---

Hey Cephers! March was a very busy month for Ceph Project that we are releasing the Newsletter on April. Besides all Mimic development tasks we had our first Cephalocon in Beijing and we have lots of cool things to share with our vibrant community on this newsletter. We hope you enjoy it!

### Announcements

#### Ceph user Survey

It's been 5 years since [Ross Turk](https://x.com/rossturk) organized the [Ceph Census](https://ceph.com/geen-categorie/results-from-the-ceph-census/) and a lot of things changed since then. We created [this survey](https://www.surveymonkey.com/r/ceph2018) to collect the feedback from our community and it will be accepting answers until May 15th, 2018. The results will be shared with the community on Ceph blog.

#### Changes on Bluejeans meetings and the new Ceph Calendar

Recently, some BlueJeans video conferencing sessions used for meetings expired and we had to create new ones for the team meetings. The new conference details are available on the meeting URLs below:

- [Ceph Developer Monthly](https://tracker.ceph.com/projects/ceph/wiki/Planning)
- [Ceph Performance Weekly](https://ceph.com/performance/)
- [Ceph on ARM](https://ceph.com/arm/)
- [Ceph Tech Talks](https://ceph.com/ceph-tech-talks/)

We also created a [Ceph calendar](https://calendar.google.com/calendar/b/1?cid=OXRzOWM3bHQ3dTF2aWMyaWp2dnFxbGZwbzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ) for the project meetings. Feel free to import it to your calendar!

#### An Evening of Ceph and RDO - Get-Together at OpenStack Summit Vancouver

If you’re attending [OpenStack Summit Vancouver](https://www.openstack.org/summit/vancouver-2018), you won’t want to miss celebrating the recent releases of Mimic (Ceph) and Queens (RDO). Join us from 6-8pm on Wednesday night at [The Portside Pub](http://theportsidepub.com/) for free food & drinks and to get to know your fellow community members. For more information please check [the event page](https://www.eventbrite.com/e/an-evening-of-ceph-and-rdo-tickets-43215726401).

### Project updates

On April 18th Sage announced the [Mimic freeze](https://www.spinics.net/lists/ceph-devel/msg41044.html) and the release is expected to the end of May. Bellow we have some highlights from the development on March and April:

#### RADOS

- Async recovery ([PR #19811](https://github.com/ceph/ceph/pull/19811))
- More precise degraded object counts ([PR #19850](https://github.com/ceph/ceph/pull/19850))
- Centralized config stored in monitors ([PR #20172](https://github.com/ceph/ceph/pull/20172))
- Beginnings of seastar-based OSD - interface between seastar/non-seastar threads ([discussion](https://groups.google.com/forum/#!topic/seastar-dev/AskkPlFhpgQ))
- Ceph-volume replaces ceph-disk for more reliability

#### RGW

- Partial-order bucket listing
- Async/parallel garbage collection
- Metadata cache epoch

#### CephFS

- MDS now maintains a table of opened files to reduce load on the MDS journal and to speed up recovery. ([PR #20132](https://github.com/ceph/ceph/pull/20132))

#### Dashboard

- The dashboard development team can now be reached via the #ceph-dashboard IRC channel on OFTC.net. Come by if you have any questions or comments!
- Lenz Grimmer presented the Dashboard at Cephalocon in Beijing - you can find the slide deck [here](https://speakerdeck.com/lenzgr/ceph-management-and-monitoring-with-dashboard-v2), a recording of the presentation is now available on [YouTube](https://www.youtube.com/watch?v=z5vu-3FEWVo) as well.
- Work on the dashboard is making good progress after the initial merge. After some cleanups and build improvements, the team is now focusing on adding more management functionality. For details, see [Lenz Grimmer's blog post](https://www.openattic.org/posts/ceph-dashboard-v2-update/).
- Since this blog post, a number of additional features have been merged. Most noteworthy, you can now manage RBDs and get a more detailed insight into the Object Gateway's users and buckets. Check out the [dashboard documentation](http://docs.ceph.com/docs/master/mgr/dashboard/) for more details on the available features.

### Releases

- Mimic v13.0.2 (development checkpoint)
- [Luminous v12.2.5](https://ceph.com/releases/v12-2-5-luminous-released/) (bugfix release)

### Ceph Planet

- [The Ceph Dashboard v2 pull request is ready for review!](https://ceph.com/planet/the-ceph-dashboard-v2-pull-request-is-ready-for-review/)
- [CephFS Admin Tips – Create a new user and share](https://ceph.com/planet/cephfs-admin-tips-create-a-new-user-and-share/)
- [openATTIC 3.6.2 has been released](https://ceph.com/planet/openattic-3-6-2-has-been-released/)
- [The initial Ceph Dashboard v2 pull request has been merged!](https://ceph.com/planet/the-initial-ceph-dashboard-v2-pull-request-has-been-merged/)
- [Ansible module to create CRUSH hierarchy](https://ceph.com/planet/ansible-module-to-create-crush-hierarchy/)
- [Huge changes in ceph-container](https://ceph.com/planet/huge-changes-in-ceph-container/)
- [See you at the first Cephalocon](https://ceph.com/planet/see-you-at-the-first-cephalocon/)
- [Parted 会启动你的 Ceph OSD，意外不？](https://ceph.com/planet/parted%e4%bc%9a%e5%90%af%e5%8a%a8%e4%bd%a0%e7%9a%84ceph-osd%ef%bc%8c%e6%84%8f%e5%a4%96%e4%b8%8d%ef%bc%9f/)
- [Handling app signals in containers](https://ceph.com/planet/handling-app-signals-in-containers/)
- [The Ceph MON synchronization (election)](https://ceph.com/planet/the-ceph-mon-synchronization-election/)
- [Ceph Dashboard v2 update](https://ceph.com/planet/ceph-dashboard-v2-update/)
- [Ceph 的 ISCSI GATEWAY](https://ceph.com/planet/ceph%e7%9a%84iscsi-gateway/)
- [Cosbench 使用方法](https://ceph.com/planet/cosbench%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95/)
- [Ceph Nano big updates](https://ceph.com/planet/ceph-nano-big-updates/)

### Project Meetings

The following project meetings happened on March and April, the video recordings have been uploaded to Ceph YouTube channel.

- [Ceph Developers Montly (Mar 07)](https://youtu.be/ydvERDHPIBk)
- [Ceph Developers Montly (Apr 04)](https://youtu.be/V1FLhOWnsfo)
- [Ceph Performance Weekly (Mar 01)](https://youtu.be/-jC2-zfN2oo)
- [Ceph Performance Weekly (Mar 08)](https://youtu.be/iuUD9Ox8btE)
- [Ceph Performance Weekly (Mar 15)](https://youtu.be/0QB7iw1MQh0)
- [Ceph Performance Weekly (Apr 05)](https://youtu.be/08weN8Kxhns)
- [Ceph Performance Weekly (Apr 12)](https://youtu.be/i1tgMfbgtWg)
- [Ceph Performance Weekly (Apr 19)](https://youtu.be/s0ej7d1kFoU)
- [Ceph Performance Weekly (Apr 26)](https://youtu.be/I_TxLKiYLCw)

### Recent events

#### Cephalocon APAC 2018

On March 22-23, 2018 the first Cephalocon in the world was successfully held in Beijing, China. During the two conference days over 1000 people including developers, users, companies, community members and other Ceph enthusiasts attended to the 52 keynotes and talks about Enterprise applications, Development, Operation and Maintenance practices. All session recordings have been uploaded to [Ceph YouTube channel](https://www.youtube.com/playlist?list=PLrBUGiINAakNgeLvjald7NcWps_yDCblr), the slides to [Slideshare](https://www.slideshare.net/Inktank_Ceph/tag/cephalocon-apac-2018) and a [report is available here](https://ceph.com/community/cephalocon-apac-2018-report/).

#### Ceph Meetup in Santiago de Compostela, ES

The [Ceph Meetup in Santiago de Compostela](https://cdtic.xunta.gal/es/ceph), ES happened on April 4th at [Amtega](https://x.com/amtega) and it was organized by [Javier Muñoz](https://x.com/javimunhoz). Approximately 50 people attended to the event which had the main goal to discuss the technology and topics including Ceph adoption, hardware, use cases, features among others. Although the event had the Galician community in mind they had participants from northwest Spain (A Coruña, Lugo, Pontevedra and Ourense) and also from Belgium and Portugal.

#### Ceph Day London

On April 19th we joined our [Apache CloudStack](https://cloudstack.apache.org/) friends for the [Ceph Day in London](https://ceph.com/cephdays/london/). The event was attended by approximately 120 people and we had 11 talks about Ceph presented by community contributors including [Wido den Hollander](https://x.com/widodh) (42on), [John Spray](https://x.com/jcsp_tweets) (Red Hat), [Lars Marowsky-Brée](https://x.com/larsmb) (SUSE), [Kai Wagner](https://x.com/ImTheKai) (SUSE), [Danny Al-Gaaf](https://x.com/dannyalgaaf) (Deutsche Telekom) and Nick Fisk (SysGroup PLC). Special thanks to Wido for organizing the event.

#### TEQnation in Jaarbeurs Utrecht, NL

[Kai Wagner](https://x.com/ImTheKai) (SUSE) presented a talk about Ceph Management and Monitoring at [TEQnation](https://teqnation.nl/) which happened from April 25th to 26th in in Jaarbeurs Utrecht, NL.

### Upcoming conferences

- [KubeCon Europe 2018](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/), May 2-4 in Copenhagen, DK
- [OpenStack Summit Vancouver](https://www.openstack.org/summit/vancouver-2018), May 21-24 in Vancouver, CA
- [openSUSE Conference 2018](https://events.opensuse.org/conference/oSC18), May 25-27 in Prague, CZ
- [OpenStack Days SP 2018](http://openstackbr.com.br/events/2018/), July 27-28 in São Paulo, BR
