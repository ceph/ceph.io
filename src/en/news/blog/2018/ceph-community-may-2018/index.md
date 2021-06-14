---
title: "Ceph Community Newsletter, May 2018 edition"
date: "2018-06-01"
author: "lvaz"
---

Hey Cephers! May 2018 was a very busy month for the project: the final development stages for Ceph Mimic release, the Ceph User Survey and several community events including KubeCon Europe in Copenhagen, Red Hat Summit in San Francisco, the OpenStack Summit in Vancouver and openSUSECon in Prague. Here's a summary of our activities and news. Enjoy!

### Announcements

#### Mountpoint.io

Ceph community is joining forces with Gluster and other projects for a two-day event dedicated to Open Source Software-Defined Storage technologies! [Mountpoint.io](https://mountpoint.io/) happens in Vancouver, BC on August 27th and 28th, before the [Open Source Summit North America](https://events.linuxfoundation.org/events/open-source-summit-north-america-2018/). The [Call for Proposals](https://docs.google.com/forms/d/1_gsVGmfiFIVGZSjiwmV325MI1Jeo00OMUG3DCivDSBc/viewform?ts=5ae8d19d&edit_requested=true) is open until June 15th and the [registration is in progress](http://www.regonline.com/mountpoint2018)!

#### Ceph users Survey

The Ceph User Survey 2018 was open until May 26th and we were able to collect the feedback from almost 350 users. At the moment we are processing this valuable information and we will announce a full report with all results in our website within few days.

#### Ceph Code Walkthrough

The Code Walkthrough meeting has been added to [Ceph public calendar](https://calendar.google.com/calendar/b/1?cid=OXRzOWM3bHQ3dTF2aWMyaWp2dnFxbGZwbzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ) to introduce the subsystems and explains how they work. Sage started talking about BlueStore on the first meeting and the [video recording](https://youtu.be/f0H-XhcZGP) has been already uploaded to [our channel on YouTube](https://www.youtube.com/channel/UCno-Fry25FJ7B4RycCxOtfw).

### Project updates

#### RADOS

- Move to openssl (from libnss) reduces cost of message signature checks
- Kicked off Nautilus development
- Mon ranks (priority order for leader) can now be adjusted (Nautilus)

#### RGW

- Faster radosgw-admin command startup
- Improved multi-site sync status reporting
- Improved debug log readability
- New librgw\_admin\_user
- AWS-compat improvements (InvalidRange)
- Bugfixes

#### CephFS

- Gating of clients based on version/features.

#### Dashboard

- While the primary focus of the team was on getting the dashboard ready for the initial Mimic release (e.g. fixing bugs discovered during testing and making minor improvements), a number of new features and improvements have been developed in parallel. For example, the REST controller architecture in the backend [has been refactored](https://github.com/ceph/ceph/pull/22210), to ease the development of new API end points.
- Pull requests for new features currently under review:
    - A [role-based authentication/authorization system](https://github.com/ceph/ceph/pull/22283) (backend implementation)
    - A [Swagger-UI based Dashboard REST API page](https://github.com/ceph/ceph/pull/22282)
    - [Adding scrub actions to the OSDs/Hosts tables](https://github.com/ceph/ceph/pull/22122)
    - [Add ability to list,set and unset cluster-wide OSD flags to the backend](https://github.com/ceph/ceph/pull/21998)
    - [Grafana proxy backend](https://github.com/ceph/ceph/pull/21644)
    - [Ceph Pool management](https://github.com/ceph/ceph/pull/21614)
    - [Config options integration (read-only)](https://github.com/ceph/ceph/pull/21460)

#### Rook

- When running Ceph in a Kubernetes environment, Rook is the recommended solution. Rook automates many of the details to help you get a storage cluster up and running.
- John Spray also [gave an update](https://www.spinics.net/lists/ceph-devel/msg41492.html) on the progress of creating an orchestrator interface that will make it possible to manage Ceph resources by the manager dashboard or the command line via Ceph-Ansible, DeepSea/Salt or Rook. See [this screencast demo](https://imgur.com/a/1iOUR6o) of a prototype based on Rook.

### Releases

- [Mimic v13.1.0](https://ceph.com/releases/v13-1-0-mimic-rc1-released/) (Release Candidate)

### Ceph Planet

- [See you at the Red Hat summit](https://ceph.com/planet/see-you-at-the-red-hat-summit/)
- [Crypto Unleashed](https://ceph.com/planet/crypto-unleashed/)
- [See you at the OpenStack Summit](https://ceph.com/planet/see-you-at-the-openstack-summit/)
- [OpenStack Summit Vancouver: How to Survive an OpenStack Cloud Meltdown with Ceph](https://ceph.com/planet/openstack-summit-vancouver-how-to-survive-an-openstack-cloud-meltdown-with-ceph/)
- [How to Survive an OpenStack Cloud Meltdown with Ceph](https://ceph.com/planet/how-to-survive-an-openstack-cloud-meltdown-with-ceph/)
- [Ceph and Ceph Manager Dashboard presentations at openSUSE Conference 2018](https://ceph.com/planet/ceph-and-ceph-manager-dashboard-presentations-at-opensuse-conference-2018/)
- [Cephfs 元数据池故障的恢复](https://ceph.com/planet/cephfs%e5%85%83%e6%95%b0%e6%8d%ae%e6%b1%a0%e6%95%85%e9%9a%9c%e7%9a%84%e6%81%a2%e5%a4%8d/)
- [Storage for Data Platforms in 10 minutes](https://ceph.com/planet/storage-for-data-platforms-in-10-minutes/)

### Project Meetings

The following virtual project meetings happened in May and the video recordings have been uploaded to [Ceph YouTube channel](https://www.youtube.com/channel/UCno-Fry25FJ7B4RycCxOtfw).

#### Ceph Developers Monthly

- [Ceph Developers Monthly (May 2nd)](https://www.youtube.com/watch?v=aFDM56qZTtg)

#### Ceph Performance Weekly

- [Ceph Performance Weekly (May 3rd)](https://www.youtube.com/watch?v=auBy20GpRi0)
- [Ceph Performance Weekly (May 10th)](https://www.youtube.com/watch?v=Qos9AF16j5w)
- [Ceph Performance Weekly (May 17th)](https://www.youtube.com/watch?v=YlXGBNfc8Tc)
- [Ceph Performance Weekly (May 24th)](https://www.youtube.com/watch?v=qnCWprRHzxc)
- [Ceph Performance Weekly (May 31st)](https://youtu.be/fZVg60B5Xxs)

#### Ceph Tech Talk

- [Deploy Ceph with Rook on Kubernetes (May 24th)](https://www.youtube.com/watch?v=IdX53Ddcd9E)

#### Ceph Code Walkthrough

- [BlueStore Code Walkthrough (May 29th)](https://youtu.be/f0H-XhcZGP0)

### Ceph User Group Meetups

See [the list of Ceph User Groups](http://tracker.ceph.com/projects/ceph/wiki/Meetups) for the future Meetups.

#### Ceph Meetup Berlin

- [High available (active/active) NFS and SMB exports upon CephFS](https://www.meetup.com/Ceph-Berlin/events/qbpxrhyxhblc/)

### Recent events

#### Kubecon Europe 2018

The [KubeCon Europe 2018](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/) happened in Copenhagen, DK from May 2-4. Several talks were given that will provide a great launch point to help you get going with the project, including "[Rook Project Intro](https://www.youtube.com/watch?v=To1ldyb_9NA)", "[Rook Deep Dive](https://www.youtube.com/watch?v=yknGKzJw7_k)" and "[Kubernetes runs anywhere, but does your data?](https://www.youtube.com/watch?v=Ot66g1WzXEU)" presented by out [Upbound](https://upbound.io/) fellows including Bassam Tabbara, Tony Allen & Jared Watts.

#### Red Hat Summit 2018

The [Red Hat Summit 2018](https://www.redhat.com/en/summit/2018) happened on May 8-11 in San Francisco, US and we had several presentations including "[Monitoring Red Hat Ceph Storage the easy way](https://hubb.blob.core.windows.net/c2511cea-81c5-4386-8731-cc444ff806df-public/resources/M1082%20-%20Monitoring%20Red%20Hat%20Ceph%20Storage%20the%20easy%20way%20Distribution.pdf)" presented by Paul Cuzner, "[Optimize Ceph object storage for production in multisite clouds](https://hubb.blob.core.windows.net/c2511cea-81c5-4386-8731-cc444ff806df-public/resources/Optimize%20Ceph%20object%20storage%20for%20production%20in%20multisite%20clouds.pdf)" by Michael Hackett, John Wilkins, "[Scalable application platform on Ceph, OpenStack and Ansible](https://hubb.blob.core.windows.net/c2511cea-81c5-4386-8731-cc444ff806df-public/resources/P1208%20-%20Scalable%20application%20platform%20on%20Ceph,%20OpenStack%20and%20Ansible%20Distribution.pdf)", by Senthivelrajan Lakshmanan, Michael Pagan, Sacha Dubois, Alexander Brovman, Nikhil Shah and "[Ceph BlueStore performance on latest Intel Server Platforms](https://hubb.blob.core.windows.net/c2511cea-81c5-4386-8731-cc444ff806df-public/resources/M1205%20-Ceph%20BlueStore%20performance%20on%20latest%20Intel%20Server%20Platforms%20Distribution.pdf)" by Orlando Moreno.

#### OpenStack Summit Vancouver

The [OpenStack Summit Vancouver](https://www.openstack.org/summit/vancouver-2018), happened on May 21-24 in Vancouver, CA. A full list of Ceph Community members attending the OpenStack Summit Vancouver as well the Ceph presentations can be found on the [organization etherpad](https://pad.ceph.com/p/openstack-summit-vancouver-2018).

#### openSUSE Conference 2018

The [openSUSE Conference 2018](https://events.opensuse.org/conference/oSC18), happened on May 25-27 in Prague, CZ and we had several presentations about Ceph. A full list of Ceph Manager & Dashboard presentations at the openSUSE Conference [is available here](https://www.openattic.org/posts/ceph-and-ceph-manager-dashboard-presentations-at-opensuse-conference-2018/).

### Upcoming conferences

If you plan to submit a Ceph-related presentation, check out [this Etherpad](https://pad.ceph.com/p/cfp-coordination), to ensure that nobody else has submitted a similar topic!

#### June

- [OpenInfra Days China](http://china.openinfradays.org/En), Jun 21-22 in Beijing, CN
- [OpenInfra Days Korea](https://openinfradays.kr/index_en.html), Jun 28-29, in Seoul, SK

#### July

- [FISL 18](http://fisl.softwarelivre.org/), Jul 11-14 in Porto Alegre, BR
- [OpenStack Days Sao Paulo](http://openstackbr.com.br/events/2018/), Jul 27-28 in Sao Paulo, BR

#### August

- [Mountpoint](https://mountpoint.io/), Aug 27-28 in Vancouver, BC
- [Open Source Summit North America](https://events.linuxfoundation.org/events/open-source-summit-north-america-2018/), Aug 29-31 in Vancouver, BZ

#### September

- Ceph Day UC Santa Cruz, Sep 19 in Santa Cruz US (website to be announced soon)

#### October

- [CentOS Dojo @ CERN](https://blog.centos.org/2018/05/cern-dojo-october-19th-2018/), Oct 19 in Geneva, CH
- [Open Source Summit Europe](https://events.linuxfoundation.org/events/open-source-summit-europe-2018/), Oct 22-24 in Edinburgh, UK

#### November

- Ceph Day Berlin (date and website to be announced soon)
- [Supercomputing 2018](https://sc18.supercomputing.org/), Nov 11-16 in Dallas, US
- [OpenStack Summit Berlin](https://www.openstack.org/summit/berlin-2018/), Nov 13-15 in Berlin, DE

#### December

- [KubeCon North America 2018](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/), Dec 11-13, in Seattle, US
