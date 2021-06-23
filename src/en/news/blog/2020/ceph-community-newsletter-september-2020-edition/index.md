---
title: "Ceph Community Newsletter, September 2020 Edition"
date: "2020-10-01"
author: "thingee"
---

## Announcements

### Ceph Octopus Release Shirt Update

![](images/shirt.png)

By now, the Ceph Octopus release contributors should have received an email to request a free shirt; if you did not receive an email, contact FOUNDATION AT CEPH dot IO.

Due to individual countries' COVID-19 custom restrictions, we are unable to ship shirts to the following countries:

[http://communitycentral.tv/cool\_stuff\_store](http://communitycentral.tv/cool_stuff_store)

We are currently looking into a local vendor in India.

We are also in the process of setting a Ceph store for people to purchase this shirt or previous Ceph release shirts.

### Ceph User Survey 2020 Planning

Anantha Adiga has just [announced](https://lists.ceph.io/hyperkitty/list/ceph-users@ceph.io/thread/6A4TGUV6UGLY42BNFTGR2JWZQD7FZMHZ/) the start of the Ceph User Survey 2020 planning. Two goals: create a special interest group to annually plan for the next user survey, and improve the questions of the user survey to get the best data with the participation time. You can review the [2019](https://ceph.io/community/ceph-user-survey-2019/) and [2018](https://ceph.io/ceph-blog/ceph-user-survey-2018-results/) survey results for reference.

* * *

## Project updates

### CephFS

- Support for restricting client authorization by file system is now supported in cephx credentials. See also: [https://docs.ceph.com/en/latest/cephfs/client-auth/#file-system-information-restriction](https://docs.ceph.com/en/latest/cephfs/client-auth/#file-system-information-restriction) and [https://docs.ceph.com/en/latest/cephfs/client-auth/#mds-communication-restriction](https://docs.ceph.com/en/latest/cephfs/client-auth/#mds-communication-restriction)

### Dashboard

- In the past month, more than pull requests have been merged in total (of which 19 have been backported into stable branches). Among countless bug fixes, test improvements and minor changes, the following noteworthy/user-visible changes have been added:
    - [mgr/dashboard: Creating a new Login Page Legal Links Component](https://github.com/ceph/ceph/pull/37152)
    - [Enable per-RBD image monitoring](https://github.com/ceph/ceph/pull/37136)
    - [mgr/dashboard/api: generate static API documentation](https://github.com/ceph/ceph/pull/36016)
- The following noteworthy improvements are currently under review (feedback is welcome):
    - [mgr/dashboard: Add clay plugin support](https://github.com/ceph/ceph/pull/37440)
    - [mgr/dashboard: Created a Download and Copy-to-Clipboard option for the logs](https://github.com/ceph/ceph/pull/37193)
    - [mgr/dashboard: support Orchestrator and user-defined Ganesha cluster](https://github.com/ceph/ceph/pull/36948)
    - [mgr/dashboard: assign flags to single OSDs](https://github.com/ceph/ceph/pull/36449)
    - [mgr/dashboard: Display users current quota usage](https://github.com/ceph/ceph/pull/36402)
    - [mgr/dashboard: Add 'Dirs' and 'Caps' for filesystems details](https://github.com/ceph/ceph/pull/36385)
    - [mgr/dashboard: Added Versioning to the REST API](https://github.com/ceph/ceph/pull/35769)
    - [mgr/dashboard: displaying deleting status in the OSD list](https://github.com/ceph/ceph/pull/35039)
- We’ve also started creating high-level specification documents for some bigger future dashboard tasks. You can review and comment on them on the following pull-requests:
    - [doc: High-level workflow for storage devices](https://github.com/ceph/ceph/pull/37144)
    - [docs: Dashboard host management](https://github.com/ceph/ceph/pull/37292)
    - [docs: Add dashboard design principles](https://github.com/ceph/ceph/pull/37287)

* * *

## Releases

- [v15.2.5 Octopus released](https://ceph.io/releases/v15-2-5-octopus-released/)

* * *

## Ceph Planet

- [SUSE publishes first steps towards Windows clients](https://ceph.io/planet/suse-publishes-first-steps-towards-windows-clients/)
- [The \[InfoSec\] Stack](https://ceph.io/planet/the-infosec-stack/)
- [Iver acquires City Network to create a new European cloud alternative](https://ceph.io/planet/iver-acquires-city-network-to-create-a-new-european-cloud-alternative/)
- [The first day of the rest of our journey](https://ceph.io/planet/the-first-day-of-the-rest-of-our-journey/)

* * *

## Project Meeting Recordings

[All meetings](https://ceph.io/community/meetings/)

#### [**Ceph Code Walkthrough**](https://www.youtube.com/playlist?list=PLrBUGiINAakN87iSX3gXOXSU3EB8Y1JLd)

- [Patrick Donnelly - Metadata Servers 2020-09-29](https://www.youtube.com/watch?v=KACx5yRoo1c)

#### [**Ceph Crimson/SeaStor OSD Weekly**](https://www.youtube.com/playlist?list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU)

- [2020-09-23](https://www.youtube.com/watch?v=kIhZyNK2gCc)
- [2020-09-16](https://www.youtube.com/watch?v=0tzxpGIZHsg)
- [2020-09-09](https://www.youtube.com/watch?v=UjOAN4yJGTw)
- [2020-09-02](https://www.youtube.com/watch?v=Q9ZtcK83Vc8)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU)

#### [**Ceph DocUBetter**](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy)

- [2020-09-24](https://www.youtube.com/watch?v=ooNLhEJ-6-Y)
- [2020-09-05](https://www.youtube.com/watch?v=H_e7Eu8U0Ps)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy)

#### [**Ceph Performance Weekly**](https://ceph.com/performance-2/)

- [2020-09-24](https://www.youtube.com/watch?v=oZ1kifTgAqs)
- [2020-09-10](https://www.youtube.com/watch?v=x1ncL7gtdbw)
- [2020-09-02](https://www.youtube.com/watch?v=jgdspWWxaeQ)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw)

#### [**Ceph Orchestration**](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)

- [2020-09-28](https://www.youtube.com/watch?v=eHBh3xyQKrI)
- [2020-09-14](https://www.youtube.com/watch?v=1Z_XE4a1h4Y)
- [2020-09-08](https://www.youtube.com/watch?v=uSjXdolYoaU)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)

#### [**Ceph Science Working Group**](https://www.youtube.com/playlist?list=PLrBUGiINAakM3d4bw6Rb7EZUcLd98iaWG)

- [2020-09-23](https://www.youtube.com/watch?v=rxwxHjDoS1Y)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakM3d4bw6Rb7EZUcLd98iaWG)
