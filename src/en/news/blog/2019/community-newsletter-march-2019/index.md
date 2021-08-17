---
title: "Ceph Community Newsletter, March 2019 edition"
date: "2019-04-10"
author: "thingee"
---

### Announcements

#### Nautilus stable release is out!

[![](images/nautilus.svg_-300x160.png)](images/nautilus.svg_.png)

March 19 we announced the new release of Ceph Nautilus! Take a look at our [blog post](https://ceph.com/releases/v14-2-0-nautilus-released/) that captures the major features and upgrade notes.

 

#### Cephalocon Barcelona May 19-20: Registration and Sponsor slots still available!

We're very excited for the upcoming Cephalocon in Barcelona! We have a convenient [blog post](https://ceph.com/community/cephalocon-barcelona/) that tells you everything you need to know about the upcoming event. See our great lineup with the posted [schedule](http://ceph.com/cephalocon/barcelona-2019/cephalocon-2019-barcelona-schedule/). [Registration](https://www.cvent.com/d/p6qjsh/4W?tw=0A-C7-A7-F1-14-4C-37-96-92-DD-A4-1A-9A-96-AB-50) is still available and we still have some [sponsorship](https://www2.thelinuxfoundation.org/sponsor-cephalocon19) slots left.

#### New Ceph Docubetter Meeting Time / Season of Docs

The [Ceph Docubetter Weekly](https://pad.ceph.com/p/Ceph_Documentation) meeting will now meet on the second and fourth Wednesday of each month. We're going to begin discussions in our April 10th meeting on our participation with [Season of Docs](https://developers.google.com/season-of-docs/). [Read full post](https://marc.info/?l=ceph-devel&m=154844885015165&w=2)

### Project updates

#### Dashboard

In the last two months, the team working on the Dashboard was working hard on getting the remaining key features into the Nautilus release. In addition to countless bug fixes, cleanups and improvements of our QA tests, some user-visible features include the following ones:

- NFS Ganesha management — [https://github.com/ceph/ceph/pull/26085](https://github.com/ceph/ceph/pull/26085) / [https://github.com/ceph/ceph/pull/25918](https://github.com/ceph/ceph/pull/25918) (Ricardo Dias, Tiago Melo)
- iSCSI management via ceph-iscsi— [https://github.com/ceph/ceph/pull/25995](https://github.com/ceph/ceph/pull/25995) (and many follow-up PRs) (Ricardo Marques, Tiago Melo)
- Added support for managing RBD QoS — [https://github.com/ceph/ceph/pull/25233](https://github.com/ceph/ceph/pull/25233) (PatrickNawracay)
- Prometheusalertmanagerintegration — [https://github.com/ceph/ceph/pull/25309](https://github.com/ceph/ceph/pull/25309) (Stephan Mueller)
- Added Feature Toggles — [https://github.com/ceph/ceph/pull/26102](https://github.com/ceph/ceph/pull/26102) (Ernesto Puerta)
- Manage all mgr modules in the Dashboard UI — [https://github.com/ceph/ceph/pull/26116](https://github.com/ceph/ceph/pull/26116) (Volker Theile)
- Improved support for generating OpenAPI Spec documentation — [https://github.com/ceph/ceph/pull/26227](https://github.com/ceph/ceph/pull/26227) (thanks to our Outreachy intern, Tina Kallio)
- Implemented OSD purge — [https://github.com/ceph/ceph/pull/26242](https://github.com/ceph/ceph/pull/26242) (PatrickNawracay)
- Added refresh interval to the dashboard landing page — [https://github.com/ceph/ceph/pull/26396](https://github.com/ceph/ceph/pull/26396) (Dan Guo)
- Added date range and log search functionality — [https://github.com/ceph/ceph/pull/26562](https://github.com/ceph/ceph/pull/26562) (Dan Guo)

The community of translators was also very busy: Indonesian, Polish and Czech have been added and are (almost) complete! If you would help us with completing the existing translations or adding new ones, please see [https://www.transifex.com/ceph/ceph-dashboard/dashboard/](https://www.transifex.com/ceph/ceph-dashboard/dashboard/) and get in touch with us if you need any guidance or help.

 

Thanks a lot to everyone who helped with the translations, particularly Kefu Chai (zh\_CN), Danni Setiawan (id\_ID), Jarosław Owsiewski and Elzbieta Dziomdziora (pl\_PL) and Pavel Borecki (cs)!

New features currently under review:

- [SSO - SAML 2.0 support](https://github.com/ceph/ceph/pull/24489)

- [Audit REST API calls](https://github.com/ceph/ceph/pull/24475)

- [I18N support](https://github.com/ceph/ceph/pull/24803)

- [Erasure Code Profile management](https://github.com/ceph/ceph/pull/24627)

- [CRUSH Map Viewer](https://github.com/ceph/ceph/pull/24766)

We're also taking part in [Outreachy](https://www.outreachy.org/)) and have merged a first patch from an applicant: Tina Kallio contributed a fixed for the documentation links on the [RGW page](https://github.com/ceph/ceph/pull/24612) (thank you!)

#### Orchestrator

- Ansible orchestrator now supports creating and removing OSDs

- We've merged an initial SSH orchestrator that doesn't use any external orchestrator

- The Rook orchestrator now deploys NFS ganesha

- Blinking of HDD LEDs in DeepSea is now merged.

- \`ceph fs volume\` now makes use of the orchestrator framework

- The orchestrator now has a dedicated channel on OFTC: #ceph-orchestrators

### Releases

- - [Nautilus v14.2.0](https://ceph.com/releases/v14-2-0-nautilus-released/)

- [Mimic v13.2.5](https://ceph.com/releases/v13-2-5-mimic-released/)
- [Mimic v13.2.4](https://ceph.com/releases/13-2-4-mimic-released/)

- [Luminous v12.2.11](https://ceph.com/releases/v12-2-11-luminous-released/)
- [Luminous v12.2.10](https://ceph.com/releases/v12-2-10-luminous-released/)

### Ceph Planet

- [慢话crush-各种crush组合](https://ceph.com/planet/%e6%85%a2%e8%af%9dcrush-%e5%90%84%e7%a7%8dcrush%e7%bb%84%e5%90%88/)
- [Run ceph CLI commands from Python](https://ceph.com/planet/run-ceph-cli-commands-from-python/)
- [OpenStack and Ceph for Distributed Hyperconverged Edge Deployments](https://ceph.com/planet/openstack-and-ceph-for-distributed-hyperconverged-edge-deployments/)
- [ceph的pg的分布的快速查看](https://ceph.com/planet/ceph%e7%9a%84pg%e7%9a%84%e5%88%86%e5%b8%83%e7%9a%84%e5%bf%ab%e9%80%9f%e6%9f%a5%e7%9c%8b/)
- [Ceph nano is getting better and better](https://ceph.com/planet/ceph-nano-is-getting-better-and-better/)

### Project meetings

#### Ceph Developers Monthly

- [Ceph Developers Monthly (Jan 2019)](https://youtu.be/RMmxE0p1j6Q)
- [Ceph Developers Monthly (Feb 2019)](https://youtu.be/h_-QEcvv5Iw)
- [Ceph Developers Monthly (April 2019)](https://youtu.be/j1prn3dyxls)

#### [Ceph Performance Weekly](https://ceph.com/performance-2/)

- [April 4](https://www.youtube.com/watch?v=INtcGM0fO2w&list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw&index=3&t=0s)
- [March 28](https://www.youtube.com/watch?v=NUxiEnnEKi8&list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw&index=2&t=0s)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw)

#### Ceph DocuBetter

We're behind on uploading these. View the [full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy) for now and watch [@Ceph](https://twitter.com/ceph) on twitter for updates.

#### Ceph Testing Weekly

- [April 3](https://www.youtube.com/watch?v=W-IjDwTG9LU&list=PLrBUGiINAakMV7gKMQjFvcWL3PeY0y0lq&index=19&t=0s)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakMV7gKMQjFvcWL3PeY0y0lq)

### Recent events

#### FOSDEM

We shared a [booth](https://twitter.com/gluster/status/1091626500741320705) with our Gluster friends. Thanks to FOSDEM for having us and for providing recordings from the Software Defined Storage room!

- Sage Weil gave a project update with what's new in Nautilus. - [video](https://fosdem.org/2019/schedule/event/ceph_project_status_update/)
- Ricardo Dias: Ceph wire protocol revisited - Messenger V2 - [video](https://fosdem.org/2019/schedule/event/ceph_msgrv2/)
- Joao Eduardo Luis: Leveraging ceph-mgr modules for fun and profit - [video](https://fosdem.org/2019/schedule/event/cehp_mgr_modules_fun_and_profit/)
- Alexander Trost : Ceph storage with Rook Running Ceph on Kubernetes - [video](https://fosdem.org/2019/schedule/event/ceph_storage_with_rook/)
- Lenz Grimmer: Managing and Monitoring Ceph with the Ceph Dashboard - [video](https://fosdem.org/2019/schedule/event/ceph_manager_dashboard/)
- Abhishek Lekshmanan: Exporting Ceph Object Storage data to the outside world - [video](https://fosdem.org/2019/schedule/event/ceph_rgw_sync_modules/)

#### SUSECON

The Ceph Foundation was present at [SUSECON 2019](http://susecon.com/) in Nashville, TN. We had a [booth](https://twitter.com/Ceph/status/1113132623424032768) provided by the wonderful people at SUSE. We got to meet lots of Ceph fans, [Dolly Parton](https://twitter.com/Ceph/status/1113418431108403200), and [dance like a chameleon](https://twitter.com/Ceph/status/1114251350379040768). [Lenz Grimmer](https://twitter.com/LenzGrimmer) presented some [live demos](https://twitter.com/LenzGrimmer/status/1113959707172114433) showing off the new dashboard in Nautilus!

### Upcoming conferences

Please coordinate your Ceph CFP's with the community on our [CFP coordination pad](https://pad.ceph.com/p/cfp-coordination).

#### April

- [CentOS Dojo:](https://wiki.centos.org/Events/Dojo/ORNL2019) April 16th, 2019 in Oak Ridge National Labs, in Oak Ridge,TN
- [China Open Source Hackathon](images/image.png), April 18-20 in Shenzhen, CN
- [Open Infrastructure Los Angeles Meet up](https://www.meetup.com/OpenInfrastructure-LA/events/260117839/?_xtd=gqFyqDMwMzY3MTYyoXCmaXBob25l&from=ref), Rook, April 24 at 6pm in LA, CA
- [Cloud Native Computing](https://www.meetup.com/San-Diego-Cloud-Native-Computing-Meetup/events/259072266/), Rook, April 25th at 6pm in San Diego, CA
- [Open Infrastructure](https://www.openstack.org/summit/), April 29 - May 4 Denver, CO

#### May

- [PyCon US](https://us.pycon.org/2019/): May 3-5 in Cleveland, OH
- [Red Hat Summit](https://www.redhat.com/en/summit/2019): May 7-9, Boston, MA
- [Cephalocon](https://ceph.com/cephalocon/barcelona-2019/): May 19-20, Barcelona, SP
- [KubeCon + CloudNativeCon](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2019/): May 18-21
- [OpenStack Day @ CERN:](https://openstackdayscern.web.cern.ch/) May 27, Geneva, CH
