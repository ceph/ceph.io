---
title: "Ceph Community Newsletter, October 2018 edition"
date: "2018-11-02"
author: "thingee"
---

Hey Cephers! We are catching up on our Community newsletters. This edition covers content starting from end of July to October 2018. Enjoy!

### Announcements

#### Ceph Day Berlin

Our Ceph Day Berlin on November 12th is officially sold out! We have a great line up of talks and are looking forward to some productive discussions with the community! You can still [register for our waitlist](https://ceph.com/cephdays/ceph-day-berlin/).

#### An Evening with Ceph and RDO at the OpenStack Summit in Berlin

The discussions of Ceph will continue in a nice evening event joining the RDO community! [Register soon](https://www.eventbrite.com/e/an-evening-of-ceph-and-rdo-at-openstack-summit-berlin-tickets-52156472413) before space fills up and spread the word!

#### FOSDEM Software Defined Storage Dev room CFP Open

The [FOSDEM Software Defined Storage devroom CFP](https://lists.fosdem.org/pipermail/fosdem/2018q4/002734.html) is now open! Come propose topics on your work with Ceph on the various storage layers, dashboard, and monitoring tools. **Deadline is November 25th.**

#### Vault 2019 CFP is open

[Vault](https://www.usenix.org/conference/vault19) 2019 will be happening on February 25-26 in Boston MA. The [CFP is open](https://www.usenix.org/conference/vault19/call-for-participation) and the **deadline is on November 15**.

#### New Ceph Docubetter Meeting

The [Ceph Docubetter Weekly](https://pad.ceph.com/p/Ceph_Documentation) meeting has been added to [Ceph community calendar](https://calendar.google.com/calendar/b/1?cid=OXRzOWM3bHQ3dTF2aWMyaWp2dnFxbGZwbzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ) for every Friday at 2000 UTC. The video recordings of the first meeting has  been uploaded to our [channel on YouTube](https://www.youtube.com/watch?v=x2jFPWTyvw4&list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy).

#### New Ceph Crimson/Seastor OSD Meeting

The Ceph Crimson/Seastor OSD meeting has been added to [Ceph community calendar](https://calendar.google.com/calendar/b/1?cid=OXRzOWM3bHQ3dTF2aWMyaWp2dnFxbGZwbzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ) for every Wednesday at 5:00 UTC. The video recordings of the first meeting has  been uploaded to our [channel on YouTube](https://www.youtube.com/watch?v=deisRgnB_Hs&list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU).

### Project updates

#### RADOS

- ceph-bluestore-tool: ability to add/remove/resize db and wal for an existing bluestore osd

- osd: pg merging has merged

- osd, bluestore: new single osd\_memory\_target option to control osd memory consumption (obsoletes bluestore\_cache\_size)

- mon: track hardware device health for mons, just like osds

#### CephFS

- Multi-filesystem selection support added to ceph-fuse client
- MDS and OSDs now support dropping caches to support performance testing and
- CephFS now supports client reclaim of prior sessions for reliable and correct NFS HA: [http://docs.ceph.com/docs/master/dev/cephfs-](http://docs.ceph.com/docs/master/dev/cephfs-reclaim/)
- ceph-fuse client now indicates if it is blacklisted via a status query of its admin socket.

#### Dashboard

Since the last Ceph Newsletter was published, the team working on the Ceph Manager Dashboard added the following new features:

- Support for managing individual OSD settings/characteristics [(PR #24606)](https://github.com/ceph/ceph/pull/24606)
- UI to configure Cluster-wide OSD Flags [(PR #22461)](https://github.com/ceph/ceph/pull/22461)
- Ceph dashboard user management from the UI [(PR #22758)](https://github.com/ceph/ceph/pull/22758)
- Support for changing dashboard configuration settings via the REST API [(PR #22457)](https://github.com/ceph/ceph/pull/22457)
- A REST API and UI for managing roles [(PR #23322)](https://github.com/ceph/ceph/pull/23322) and [(PR #23409)](https://github.com/ceph/ceph/pull/23409)
- Added support for managing individual OSD settings in the backend [(PR #23491)](https://github.com/ceph/ceph/pull/23491)
- Added support for RBD Trash [(PR #23351)](https://github.com/ceph/ceph/pull/23351)
- Grafana graphs integration with dashboard [(PR #23666)](https://github.com/ceph/ceph/pull/23666)
- A UI to manage cluster configuration settings [(PR #23230)](https://github.com/ceph/ceph/pull/23230)
- Ceph Pool management (create/update/delete) [(PR #21614)](https://github.com/ceph/ceph/pull/21614)
- Grafana dashboard updates and additions — [(PR #24314)](https://github.com/ceph/ceph/pull/24314)
- JWT authentication [(PR #22833)](https://github.com/ceph/ceph/pull/22833)

New features currently under review:

- [SSO - SAML 2.0 support](https://github.com/ceph/ceph/pull/24489)

- [Audit REST API calls](https://github.com/ceph/ceph/pull/24475)

- [I18N support](https://github.com/ceph/ceph/pull/24803)

- [Erasure Code Profile management](https://github.com/ceph/ceph/pull/24627)

- [CRUSH Map Viewer](https://github.com/ceph/ceph/pull/24766)

We're also taking part in [Outreachy](https://www.outreachy.org/)) and have merged a first patch from an applicant: Tina Kallio contributed a fixed for the documentation links on the [RGW page](https://github.com/ceph/ceph/pull/24612) (thank you!)

#### Rook

- Rook container is now decoupled from the Ceph version, enabling arbitrary Ceph versions to be installed, and paving the way for orchestrated Ceph upgrades

### Releases

- [Mimic v13.2.2](https://ceph.com/releases/13-2-2-mimic-released/)

- [Mimic v13.2.1](https://ceph.com/releases/13-2-1-mimic-released/)

- [Luminous v12.2.8](https://ceph.com/releases/v12-2-8-released/)

- [Luminous v12.2.7](https://ceph.com/releases/12-2-7-luminous-released/https://ceph.com/releases/12-2-7-luminous-released/)

### Ceph Planet

- [Ceph User Survey 2018 results](https://ceph.com/ceph-blog/ceph-user-survey-2018-results/)
- [Meeting report: Ceph Manager Dashboard F2F meeting Nuremberg Germany](https://ceph.com/community/meeting-report-ceph-manager-dashboard-f2f-meeting-nuremberg-germany/)
- [Rook: Automating Ceph for Kubernetes](https://ceph.com/community/rook-automating-ceph-kubernetes/)
- [Ceph Day Warsaw](https://ceph.com/community/ceph-day-warsaw-april-25-2017/)
- [New Dashboard landing page for Nautilus has been merged](https://ceph.com/community/new-dashboard-landing-page-nautilus-merged/)
- [Evaluating Ceph Deployments with Rook](https://ceph.com/community/evaluating-ceph-deployments-with-rook/)

### Project meetings

#### Ceph Developers Monthly

- [Ceph Developers Monthly (Jul 11)](https://youtu.be/BT--5ARbU2U)
- [Ceph Developers Monthly (Aug 1)](https://youtu.be/h_-QEcvv5Iw)

#### Ceph Performance Weekly

- [Ceph Performance Weekly (Aug 2)](https://youtu.be/WiEUzoS6Nc4)
- [Ceph Performance Weekly (Aug 16)](https://www.youtube.com/watch?v=tdBK1Maa0R8)
- [Ceph Performance Weekly (Aug 23)](https://www.youtube.com/watch?v=J-mpILsEV58)
- [Ceph Performance Weekly (Sep 6)](https://youtu.be/fHRD27iOAwM)
- [Ceph Performance Weekly (Sep 13)](https://youtu.be/WPEH5T-wAuY)
- [Ceph Performance Weekly (Sep 20)](https://youtu.be/SJAuvGDoEQY)
- [Ceph Performance Weekly (Sep 27)](https://youtu.be/vlFHiWIVejU)
- [Ceph Performance Weekly (Oct 4)](https://youtu.be/X5wa20rYcY8)
- [Ceph Performance Weekly (Oct 11)](https://youtu.be/3ubuc4FElko)
- [Ceph Performance Weekly (Oct 25)](https://youtu.be/Jw4HbEZ5zL4)

#### Ceph Testing Weekly

- [Ceph Testing Weekly (Aug 22)](https://youtu.be/0WHHTjdgarQ)
- [Ceph Testing Weekly (Sep 5)](https://youtu.be/uHWS5et35fQ)
- [Ceph Testing Weekly (Sep 19)](https://youtu.be/LmV6i9PHR_g)
- [Ceph Testing Weekly (Sep 26)](https://youtu.be/sVh6hR3nrmY)
- [Ceph Testing Weekly (Oct 3)](https://youtu.be/SHIU3joQO3A)
- [Ceph Testing Weekly (Oct 10)](https://youtu.be/O4gltqzUFUM)
- [Ceph Testing Weekly (Oct 17)](https://youtu.be/AH7H7TQa9oU)
- [Ceph Testing Weekly (Oct 24)](https://youtu.be/g0SbaXOJ4xI)
- [Ceph Testing Weekly (Oct 31)](https://youtu.be/koTxbdRAeg8)

#### Ceph Code Walkthrough

- [Consistency with OSD peering (Oct 23)](https://www.youtube.com/watch?v=GULp4dvwN3I&feature=youtu.be)

### Recent events

#### Ceph Day Silicon Valley

The [Ceph Day](https://ceph.com/cephdays/ceph-day-silicon-valley-university-santa-cruz-silicon-valley-campus/) at the University of Santa Clara's Silicon Valley campus happened September 19. All presentation slides can be found on the [Ceph Day page](https://ceph.com/cephdays/ceph-day-silicon-valley-university-santa-cruz-silicon-valley-campus/).

#### Open Source Summit Europe

The [Open Source Summit Europe](https://osseu18.sched.com/event/FxWj) conference happened in Edinburgh, Scotland and our fellow [John Spray](http://tracker.ceph.com/users/1235) gave a short intro/current state presentation on Ceph and BoF.

#### Latinoware 2018

[Alfredo Deza](http://tracker.ceph.com/users/1052) gave an introduction Ceph talk at [Latinoware](https://latinoware.org/) sharing how to deploy, configure, and differentiates Ceph with NAS and big storage servers.

### Upcoming conferences

#### November

- [Ceph Meetup Dresden](https://www.meetup.com/Ceph-Dresden/events/254816061/), Nov 5 in Dresden, DE
- [Ceph Day Berlin](https://ceph.com/cephdays/ceph-day-berlin/), Nov 11 in Berlin, DE
- [Supercomputing 2018](https://sc18.supercomputing.org/), Nov 11-16 in Dallas, US
- [OpenStack Summit Berlin](https://www.openstack.org/summit/berlin-2018/), Nov 13-15 in Berlin, DE

#### December

- [KubeCon North America 2018](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/), Dec 11-13 in Seattle, US

#### January

- [Devconf CZ](https://devconf.info/cz) Jan 27-29 Brno, CZ

#### February

- [FOSDEM](https://fosdem.org/2019/) February 2-3 in Brussels, BE - [**CFP deadline November 25**](https://penta.fosdem.org/submission/FOSDEM19)
- [Vault](https://www.usenix.org/conference/vault19) February 25-26 in Boston MA- [**CFP deadline November 15**](https://www.usenix.org/conference/vault19/call-for-participation)
