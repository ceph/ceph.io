---
title: "Ceph Community Newsletter, August 2020 Edition"
date: "2020-09-01"
author: "thingee"
---

## Announcements

#### Outeachy December 2020

We’re excited to announce that Ceph and [Rook](https://rook.io) will participate in this next Outreachy December 2020 round! See our latest [blog post](https://ceph.io/community/december-2020-outreachy-ceph-rook/) for more details.

#### [Code Walkthrough: KRBD I/O Flow](https://www.youtube.com/watch?v=XClnvd_BX6I)

Illya Dryomov gives a code walkthrough of the Linux Kernel RBD client. Catch our next walkthrough with Patrick Donnelly on the metadata servers with Ceph FS September 29th at 17:00 UTC.

[View archive](https://tracker.ceph.com/projects/ceph/wiki/Code_Walkthroughs)

* * *

## Project updates

### RADOS

- Racially charged terms have been eliminated from the Ceph codebase. A few configuration options and commands have been renamed. Details in [https://github.com/ceph/ceph/blob/master/PendingReleaseNotes](https://github.com/ceph/ceph/blob/master/PendingReleaseNotes)

### Dashboard

Noteworthy highlights:

- Proceeding on establishing the Ceph Dashboard backend as the new official Ceph REST API. See [https://tracker.ceph.com/issues/40907](https://tracker.ceph.com/issues/40907) for more details and ongoing activity. The intention is to deprecate the restful module in Pacific (and remove it post-Pacific).
- Landing Page improvements (new widgets, improved ordering) have been merged (can we include the screen shot from the PR?): [https://github.com/ceph/ceph/pull/36476](https://github.com/ceph/ceph/pull/36476)
- Ability to deploy Ceph services via Orchestrator by using ServiceSpec: [https://github.com/ceph/ceph/pull/36119](https://github.com/ceph/ceph/pull/36119)
- WIP: Assign flags (e.g. “noup”, “nodown”, etc.) to individual OSDs: https://github.com/ceph/ceph/pull/36449

## Releases                               

- [v14.2.11 Nautilus released](https://ceph.io/releases/v14-2-11-nautilus-released/)

* * *

## Project Meeting Recordings

[All meetings](https://ceph.io/community/meetings/)

#### [**Ceph Tech Talk**](https://www.youtube.com/playlist?list=PLrBUGiINAakM36YJiTT0qYepZTVncFDdc)

- [Edge Application: Steaming Multiple Video Sources](https://www.youtube.com/watch?v=Q8bU-m07Czo)
- [Secure Token Service in the Rados Gateway](https://www.youtube.com/watch?v=Lc32meILfNI)

[**Ceph Code Walkthrough**](https://www.youtube.com/playlist?list=PLrBUGiINAakN87iSX3gXOXSU3EB8Y1JLd)

- [kRBD I/O Flow](https://www.youtube.com/watch?v=XClnvd_BX6I)

#### [**Ceph Crimson/SeaStor OSD Weekly**](https://www.youtube.com/playlist?list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU)

- [2020-08-05](https://www.youtube.com/watch?v=ttFQ9Fnen5I)
- [2020-08-12](https://www.youtube.com/watch?v=SGUBV6tD8hM)
- [2020-08-19](https://www.youtube.com/watch?v=nF83fB6Ivwg)
- [2020-08-26](https://www.youtube.com/watch?v=igexNYX6V7g)
- [2020-09-02](https://www.youtube.com/watch?v=Q9ZtcK83Vc8)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU)

#### [**Ceph DocUBetter**](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy)

- [2020-08-12](https://www.youtube.com/watch?v=WxDHdaxNHYw)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy)

#### [**Ceph Performance Weekly**](https://ceph.com/performance-2/)

- [2020-08-06](https://www.youtube.com/watch?v=4GONcW3g69Y)
- [2020-08-13](https://www.youtube.com/watch?v=uvsVMnCXqFI)
- [2020-08-20](https://www.youtube.com/watch?v=qGtTUvmEVq8)
- [2020-08-28](https://www.youtube.com/watch?v=rbiDSCFEF3c)
- [2020-08-31](https://www.youtube.com/watch?v=J48ZrzsZ4Z0)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw)

#### [**Ceph Orchestration**](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)

- [2020-08-03](https://www.youtube.com/watch?v=DuRCXpDg-3Q)
- [2020-08-10](https://www.youtube.com/watch?v=otJH-AfrquM)
- [2020-08-17](https://www.youtube.com/watch?v=sYUk2qm-ym8)
- [2020-08-24](https://www.youtube.com/watch?v=nw-sFKUc4e8)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)
