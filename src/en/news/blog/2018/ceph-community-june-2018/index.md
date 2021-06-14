---
title: "Ceph Community Newsletter, June 2018 edition"
date: "2018-07-01"
author: "lvaz"
---

Hey Cephers! June 2018 is about to end and here is a summary of activities and news for Ceph Project. Enjoy!

### Announcements

#### Mimic is out!

After 9 months of work the Engineering released [Ceph Mimic](https://ceph.com/releases/v13-2-0-mimic-released/) (v13.2.x series) with lots of features and improvements. A [full list of changes](https://ceph.com/releases/v13-2-0-mimic-released/#major-changes-from-luminous), as well the [upgrading instructions](https://ceph.com/releases/v13-2-0-mimic-released/#upgrading-from-luminous) and a [detailed changelog](https://ceph.com/releases/v13-2-0-mimic-released/#detailed-changelog) are available on the [release notes](https://ceph.com/releases/v13-2-0-mimic-released/).

#### Mountpoint.io

As [we previously announced](https://ceph.com/newsletter/ceph-community-may-2018/) Ceph community is joining forces with Gluster and other projects for a two-day event dedicated to Open Source Software-Defined Storage technologies called [Mountpoint](https://mountpoint.io/), which happens in Vancouver, BC on August 27th and 28th. The call for proposals was closed on June 15th, the conference program has been announced ([day 1](https://mountpoint.io/schedule-day1) and [day 2](https://mountpoint.io/schedule-day2)) and the [registration is in progress](http://www.regonline.com/mountpoint2018)!

#### Heads-up: Ceph Developers Monthly of July postponed!

Due the July 4th holiday in the United States the [Ceph Developers Monthly](https://tracker.ceph.com/projects/ceph/wiki/Planning) meeting of July has been [postponed to June 11th](http://wiki.ceph.com/CDM_11-JUL-2018).

#### Bluestore Code Walkthrough

In May we started the Ceph Code Walkthrough series and Sage Weil presented the [first part of about BlueStore](https://www.youtube.com/watch?v=f0H-XhcZGP0). On June 26th Sage presented the [second part](https://www.youtube.com/watch?v=1o2UjIPHIZo) and the video recording has been uploaded to our YouTube channel.

#### Ceph Testing Weekly

The [Ceph Testing Weekly](https://ceph.com/testing/) meeting has been added to [Ceph community calendar](https://calendar.google.com/calendar/b/1?cid=OXRzOWM3bHQ3dTF2aWMyaWp2dnFxbGZwbzBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ) and the video recordings of the first meetings have been uploaded to our channel on YouTube.

### Project updates

#### RADOS

- New bitmap allocator for BlueStore improves performance and performance stability for flash devices
- Initial infrastructure for tracking device health metrics is merged. This will allow Ceph to predict HDD/SSD failures before they happen.
- Ceph-disk, deprecated in Mimic, has been removed.

#### RGW

- [RGW broker for kubernetes service catalog](https://github.com/yehudasa/rgw-object-broker)
- Partial order bucket listing support to reduce memory footprint of bucket listing in sharded buckets

#### CephFS

- \[master\] MDS adds a new command to dump an inode in cache with the inode number ([PR #22569](https://github.com/ceph/ceph/pull/22569))
- \[master 13.2.1\] cephx auth caps for CephFS clients may restrict ability to take snapshots. ([PR #22560](https://github.com/ceph/ceph/pull/22560))
- \[in-progress\] ceph\_futimens support in libcephfs  ([PR #22751](https://github.com/ceph/ceph/pull/22751))
- \[in-progress\] Another pass at LAZYIO (suspended client cache coherency) support in CephFS  ([PR #22450](https://github.com/ceph/ceph/pull/22450))
- \[in-progress\] MDS drop\_cache "ceph tell mds" command (to support performance evaluations) ([PR #21566](https://github.com/ceph/ceph/pull/21566))

#### Dashboard

Major features merged into master recently:

- Role based authentication/authorization system ([PR #22283](https://github.com/ceph/ceph/pull/22283))
- Add ability to list,set and unset cluster-wide OSD flags to the backend ([PR #21998](https://github.com/ceph/ceph/pull/21998))
- Config options integration (read-only) ([PR #21460](https://github.com/ceph/ceph/pull/21460))
- Update Angular to version 6  ([PR #22082](https://github.com/ceph/ceph/pull/22082))
- Listen on port 8443 by default and not 8080 ([PR #22409](https://github.com/ceph/ceph/pull/22409))
- Add scrub action to the OSDs table  ([PR #22122](https://github.com/ceph/ceph/pull/22122))
- Swagger-UI based Dashboard REST API page ([PR #22282](https://github.com/ceph/ceph/pull/22282))
- Add help menu entry  ([PR #22303](https://github.com/ceph/ceph/pull/22303))

Work in progress / under review:

- Add option to disable SSL ([PR #22593](https://github.com/ceph/ceph/pull/22593))
- Add UI for Cluster-wide OSD Flags configuration ([PR #22461](https://github.com/ceph/ceph/pull/22461))
- Add backend support for changing dashboard configuration settings via the REST API ([PR #22457](https://github.com/ceph/ceph/pull/22457))
- Pool management ([PR #21614](https://github.com/ceph/ceph/pull/21614))
- Ceph dashboard user management from the UI ([PR #22758](https://github.com/ceph/ceph/pull/22758))

#### Rook

The 0.8 release is planned for next week including the following improvements to be merged this week:

- "One OSD per pod" will run the OSDs independently for higher reliability
- Improved security model with reduced privileges required by the Rook operator
- Ceph pod names match more closely the daemon name to improve troubleshooting
- OpenShift compatibility

### Releases

- [Mimic v13.2.0](https://ceph.com/releases/v13-2-0-mimic-released/)

### Ceph Planet

- [v13.2.0 Mimic released](https://ceph.com/releases/v13-2-0-mimic-released/)
- [Mimic contributor credits](https://ceph.com/community/mimic-contributor-credits/)
- [New in Mimic: Introducing a new Ceph Manager Dashboard](https://ceph.com/community/mimic-new-ceph-manager-dashboard/)
- [New in Mimic: centralized configuration management](https://ceph.com/community/new-mimic-centralized-configuration-management/)
- [New in Mimic: Simplified RBD Image Cloning](https://ceph.com/community/new-mimic-simplified-rbd-image-cloning/)
- [New in Mimic: iostat plugin](https://ceph.com/community/new-mimic-iostat-plugin/)
- [ceph erasure 默认的 min\_size 分析](https://ceph.com/planet/ceph-erasure%e9%bb%98%e8%ae%a4%e7%9a%84min_size%e5%88%86%e6%9e%90/)

### Project meetings

#### Ceph Developers Monthly

- [Ceph Developers Monthly (Jun 6th)](https://www.youtube.com/watch?v=ghxzvJ51nFQ)

#### Ceph Performance Weekly

- [Ceph Performance Weekly (Jun 7th)](https://www.youtube.com/watch?v=hYquLBHkTWY)
- [Ceph Performance Weekly (Jun 14th)](https://www.youtube.com/watch?v=-sR1PiumuaM)
- [Ceph Performance Weekly (Jun 21st)](https://www.youtube.com/watch?v=wrUfiHll0lw)
- [Ceph Performance Weekly (Jun 28th)](https://www.youtube.com/watch?v=fOra8AUKNMw)

#### Ceph Testing Weekly

- [Ceph Testing Weekly (Jun 13th)](https://www.youtube.com/watch?v=MtK8bJmFi1k)
- [Ceph Testing Weekly (Jun 20th)](https://www.youtube.com/watch?v=CU21wxeFtoo)
- [Ceph Testing Weekly (Jun 27th)](https://www.youtube.com/watch?v=IvNwg7Y-QB8)

#### Ceph Tech Talks

- [Ceph used on Cancer Research at OICR (Jun 28th)](https://www.youtube.com/watch?v=TL2Slb9UYLE)

#### Ceph Code Walkthrough

- [Bluestore Code Walkthrough (Jun 26th)](https://www.youtube.com/watch?v=1o2UjIPHIZo)

### Recent events

#### OpenInfra Days China

The [OpenInfra Days China](http://china.openinfradays.org/En) happened in Beijing on June 21-22 and our fellow [Kefu Chai](https://tracker.ceph.com/users/2317) represented the Ceph Project at the conference presenting the talk "What's new on Ceph Mimic".

#### OpenInfra Days Korea

The [OpenInfra Days Korea 2018](https://openinfradays.kr/) happened on June 28-29 in Seol, and we had two talks about Ceph including "[CephFS with OpenStack Manila based on Bluestore and Erasure Code](https://event.openinfradays.kr/2018/session1/track_3_5)", presented by Yoo Jang-lin and "[Ceph Storage, service/operation with PaaS](https://event.openinfradays.kr/2018/session1/track_4_6)" presented by Ha-Hyun.

### Upcoming conferences

#### July

- [FISL 18](http://fisl.softwarelivre.org/), Jul 11-14 in Porto Alegre, BR
- [OpenStack Days Sao Paulo](http://openstackbr.com.br/events/2018/), Jul 27-28 in Sao Paulo, BR

#### August

- [Mountpoint](https://mountpoint.io/), Aug 27-28 in Vancouver, BC
- [Open Source Summit North America](https://events.linuxfoundation.org/events/open-source-summit-north-america-2018/), Aug 29-31 in Vancouver, BC

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
