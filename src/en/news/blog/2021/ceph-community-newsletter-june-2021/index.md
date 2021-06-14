---
title: "Ceph Community Newsletter, June 2021"
date: "2021-06-04"
author: "thingee"
---

## Announcements

### [Ceph Month June](https://pad.ceph.com/p/ceph-month-june-2021)

This week starts our June 2021 Ceph Month: full of Ceph presentations, lightning talks, and unconference sessions such as BOFs. There is no registration or cost to attend this event.

Join the Ceph community as we discuss how Ceph, the massively scalable, open-source, software-defined storage system, can radically improve the economics and management of data storage for your enterprise.

\[[See full schedule and recordings from this week](https://pad.ceph.com/p/ceph-month-june-2021)\]

### [2021 Ceph User Survey Results](https://ceph.io/community/2021-ceph-user-survey-results/)

For the third year, we surveyed the population of Ceph users and published that data for the benefit of all interested. Thank you to the 245 respondents who shared your usage, information, and opinions this year... [\[read more\]](https://ceph.io/community/2021-ceph-user-survey-results/)

### [CephFS Code Walkthroughs](https://tracker.ceph.com/projects/ceph/wiki/CephFS_Code_Walkthroughs)

A new series of Code Walkthroughs with a focus on CephFS has started. You can find the covered topics on the [Youtube playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakOXvawFetHtUGYi2HlK6HGE) as well as the [Ceph wiki](https://tracker.ceph.com/projects/ceph/wiki/CephFS_Code_Walkthroughs) which has future topics. While we're focused on Ceph Month currently, the series will start back up on July 5th at 14:00 UTC / 10 AM EDT. Join us live to ask your questions with CephFS developers!

### [Ceph Developer Summit: Quincy Recordings](https://www.youtube.com/playlist?list=PLrBUGiINAakPEoaacUQwA6Aqv0uS4N7Yi)

The Ceph Developer Summit for Quincy was April 6-9, which included discussions for Ceph's various components and adjacent projects. Recordings for these discussions can be found on the [Ceph Youtube Channel](https://www.youtube.com/playlist?list=PLrBUGiINAakPEoaacUQwA6Aqv0uS4N7Yi).

https://www.youtube.com/playlist?list=PLrBUGiINAakPEoaacUQwA6Aqv0uS4N7Yi

* * *

## Community Blog

### [New in Pacific: Persistent Bucket Notifications](https://ceph.io/community/persistent-bucket-notifications-deep-dive/)

[Persistent bucket notifications](https://docs.ceph.com/en/latest/radosgw/notifications/#notification-reliability) are going to be introduced in Ceph "Pacific". The idea behind them is to allow for reliable and asynchronous delivery of notifications from the RADOS gateway (RGW) to the endpoint configured at the topic. Regular notifications could also be considered reliable since the delivery to the endpoint is performed synchronously during the request. [\[read more\]](https://ceph.io/community/persistent-bucket-notifications-deep-dive/)

### [New in Pacific: SQL on Ceph](https://ceph.io/community/new-in-pacific-sql-on-ceph/)

A new libcephsqlite library is available in Pacific that provides a ceph SQLite3 Virtual File System (VFS). The VFS implements backend support for SQLite3 to store and manipulate a database file on Ceph’s distributed object store, RADOS. Normal unmodified applications using SQLite can switch to this new VFS with trivial reconfiguration. [\[read more\]](https://ceph.io/community/new-in-pacific-sql-on-ceph/)

### [New in Pacific: CephFS Updates](https://ceph.io/community/new-in-pacific-cephfs-updates/)

The Ceph file system (CephFS) is the file storage solution of Ceph. Pacific brings many exciting changes to CephFS with a strong focus on usability, performance, and integration with other platforms, like Kubernetes CSI. Let’s talk about some of those enhancements. Multiple File System Support CephFS has had experimental support for multiple file systems for... [\[read more\]](https://ceph.io/community/new-in-pacific-cephfs-updates/)

### [QoS Study with mClock and WPQ Schedulers](https://ceph.io/community/qos-study-with-mclock-and-wpq-schedulers/)

Introduction Ceph’s use of mClock was primarily experimental and approached with an exploratory mindset. This is still true with other organizations and individuals continuing to either use the code base or modifying it according to their needs. DmClock exists in its own repository. Prior to the Ceph Pacific release, mClock could be enabled by setting... [\[read more\]](https://ceph.io/community/qos-study-with-mclock-and-wpq-schedulers/)

### [Bucket Notifications with Knative and Rook on minikube!](https://ceph.io/community/bucket-notifications-with-knative-and-rook-on-minikube/)

[Bucket notifications](https://docs.ceph.com/en/latest/radosgw/notifications/) is a powerful integration feature, with some [interesting applications](https://medium.com/analytics-vidhya/automated-data-pipeline-using-ceph-notifications-and-kserving-5e1e9b996661), but like anything that has to do with integration, it has lots of moving parts that require setup. I thought that trying to create such a setup from scratch, as a small demo running on my laptop, is probably the best way to figure out the pain points in the process... [\[read more\]](https://ceph.io/community/bucket-notifications-with-knative-and-rook-on-minikube/)

* * *

## Releases

- Pacific
    - [v.16.2.4](https://ceph.io/releases/v16-2-4-pacific-released/)
    - [v.16.2.3](https://ceph.io/releases/v16-2-3-pacific-released/)
    - [v16.2.1](https://ceph.io/releases/v16-2-1-pacific-released/)
    - [v.16.2.2](https://ceph.io/releases/v16-2-2-pacific-released/)
    - [v.16.2.0](https://ceph.io/releases/v16-2-0-pacific-released/)
- Octopus
    
    - [v15.2.13](https://ceph.io/releases/v15-2-13-octopus-released/)
    
    - [v15.2.12](https://ceph.io/releases/v15-2-12-octopus-released/)
    - [v15.2.11](https://ceph.io/releases/v15-2-11-octopus-released/)
    - [v15.2.10](https://ceph.io/releases/v15-2-10-octopus-released/)
- Nautilus
    - [v14.2.21](https://ceph.io/releases/v14-2-21-nautilus-released/)
    - [v14.2.20](https://ceph.io/releases/v14-2-20-nautilus-released/)
    - [v14.2.19](https://ceph.io/releases/v14-2-19-nautilus-released/)
    - [v.14.2.18](https://ceph.io/releases/v14-2-18-nautilus-released/)
    - [v.14.2.17](https://ceph.io/releases/v14-2-17-nautilus-released/)

* * *

## Project Meeting Recordings

[All meetings](https://ceph.io/community/meetings/)

#### [Ceph Tech Talks](https://www.youtube.com/playlist?list=PLrBUGiINAakM36YJiTT0qYepZTVncFDdc)

- [What’s New in the Pacific Release](https://youtu.be/PVtn53MbxTc) \[Sage Weil\]
- [Bucket Notifications](https://www.youtube.com/watch?v=57Ejl6R-L20) \[Yuval Lifshitz\]

#### [**Ceph Code Walkthrough**](https://www.youtube.com/playlist?list=PLrBUGiINAakN87iSX3gXOXSU3EB8Y1JLd)

- [RADOS Snapshots](https://www.youtube.com/watch?v=KACx5yRoo1c) \[Samuel Just\]
- [RGW Bucket Notifications with AMQA/Kafka](https://www.youtube.com/watch?v=hMaw_bxAc-I) \[Yuval Lifshitz\]

#### [CephFS Code Walkthrough](https://tracker.ceph.com/projects/ceph/wiki/CephFS_Code_Walkthroughs)

- [CephFS Mirroring](https://www.youtube.com/watch?v=nZSN1zkSXSs) \[Venky Shankar\]
- [cephfs-mirror daemon part 2](https://www.youtube.com/watch?v=oMs7appb20s) \[Venky Shankar\]
- [MDSMonitor](https://www.youtube.com/watch?v=rUJZy-2jKOo) \[Patrick Donnelly\]

#### [Ceph Developer Monthly](https://tracker.ceph.com/projects/ceph/wiki/Planning)

- [2021-06-02](https://www.youtube.com/watch?v=3dKjAgZb6Kk)
- [2021-05-05](https://www.youtube.com/watch?v=AZ1DDwgzw3c)

#### [**Ceph Crimson/SeaStor OSD Weekly**](https://www.youtube.com/playlist?list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU)

#### [**Ceph DocUBetter**](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy)

#### [**Ceph Performance Weekly**](https://ceph.com/performance-2/)

#### [**Ceph Orchestration**](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)

#### [**Ceph Science Working Group**](https://www.youtube.com/playlist?list=PLrBUGiINAakM3d4bw6Rb7EZUcLd98iaWG)
