---
title: "Ceph Community Newsletter, July 2019 edition"
date: "2019-08-13"
author: "thingee"
---

### Announcements

#### Ceph Upstream Documenter Opportunity

While the Ceph community continues to grow and the software improves, an essential part of our success will be a focus on improving our documentation.

We’re excited to announce a new contract opportunity that would be funded by the Ceph Foundation to help with this initiative. Below is the contract description. [Read more for full description and how to apply](https://ceph.io/community/ceph-upstream-documenter-opportunity/).

#### Ceph User Survey Discussion

It's that time of the year again for us to form this year's user survey. The user survey gives the Ceph community insight with how people are using Ceph and where we should be spending our efforts. You can see last year's survey in this [blog post](https://ceph.com/ceph-blog/ceph-user-survey-2018-results). The previous set of questions and the answer options that will be available are being discussed both on the [ceph-user's mailing list](https://lists.ceph.io/hyperkitty/list/ceph-users@ceph.io/thread/Q3NCHOJN45DPPZUGDXFRO7A7E2W22YUO/) and [etherpad](https://pad.ceph.com/p/user-survey-2019).

#### New Ceph Foundation Member: SWITCH

Eight months ago the Ceph Foundation was announced with 31 founding organization members to create an open, collaborative, and neutral home for project stakeholders to coordinate their development and community investments in the Ceph ecosystem. Since then, three more members have joined, two as General members and one as an Associate member.

Today we’re excited to announce our newest associate member of the Foundation, SWITCH. [Read more](https://ceph.io/community/new-ceph-foundation-associate-member-switch/)

#### Don't forget your Nautilus release shirt

[![](images/nautilus.svg_-300x160.png)](http://ceph.com/wp-content/uploads/2019/03/nautilus.svg_.png)

March 19 we announced the new release of Ceph Nautilus! Take a look at our [blog post](https://ceph.com/releases/v14-2-0-nautilus-released/) that captures the major features and upgrade notes. [Watch the talk](https://youtu.be/MVJ2eFMBVSI) from Sage Weil, co-creator and project leader, on the state of the cephalopod. We're now pleased to announce the availability of official Ceph Nautilus shirts in the [Ceph store](http://bit.ly/ceph-store)!

### Project updates

[**All changes for July**](https://github.com/ceph/ceph/pull/29333/files#diff-c68f721c5a09387645aab32634cdc0e3)

#### Rados

- The version of rocksdb has been updated to v6.1.2, which incorporates a number of fixes and improvements since 5.17.2.

- The number of concurrent bluestore rocksdb compactions has been changed to 2 from the earlier default of 1, which will provide improved performance with OMAP heavy write workloads.

- We now have higher default priority for recovery of rgw metadata pools and cephfs metadata pools.

- Several improvements in the crash module: 

- "ceph crash ls-new" - reports info about new crashes

- "ceph crash archive <crashid>" - archives a crash report

- "ceph crash archive-all" - archives all new crash reports

- recent crashes raise \`\`RECENT\_CRASH\`\` health warning for two weeks by default, duration can be controlled by "ceph config set mgr/crash/warn\_recent\_interval <duration>" - duration of 0 disables the warnings

- crash reports are retained for a year by default, duration can be changed by "ceph config set mgr/crash/warn\_recent\_interval <duration>"

#### CephFS

- - Attempt to revive inline support in the kernel client driver determined not to be worth the effort. Current thinking is to remove file inlining from CephFS in Octopus.

- - \`ceph fs volume\` and related interfaces reaching feature completeness in 14.2.2.

- Support for the kernel client to reconnect after getting blacklisted is nearly complete. Current patchset in testing. See related threads on ceph-devel for more information.

#### RBD

- Long-running background tasks can now be scheduled to run via the MGR 'rbd\_support' module
    - ceph rbd task add remove <image-spec>
    - ceph rbd task add flatten <image-spec>
    - ceph rbd task add trash remove <image-id-spec>
    - ceph rbd task add migration execute <image-spec>
    - ceph rbd task add migration commit <image-spec>
    - ceph rbd task add migration abort <image-spec
    - ceph rbd task cancel <task-id>
    - ceph rbd task list \[<task-id>\]
    - Note: these will also be integrated w/ the standard 'rbd' CLI in the near future
- RBD parent image persistent cache
    - Data blocks for parent images are now optionally cached persistently on librbd client nodes
    - This offloads read requests for "golden" base
    - [More information](http://docs.ceph.com/docs/master/rbd/rbd-persistent-cache/)
- RBD online image (re-)sparsify now supports EC-backed data pools

#### Dashboard

- Work on dashboard features for Ceph Octopus is progressing well - see [https://pad.ceph.com/p/ceph-dashboard-octopus-priorities](https://pad.ceph.com/p/ceph-dashboard-octopus-priorities) for the prioritized list for Ceph Octopus
- Noteworthy dashboard features that were merged in the past 5 weeks:
    
    - - Prevent deletion of iSCSI IQNs with open sessions — [https://github.com/ceph/ceph/pull/29133](https://github.com/ceph/ceph/pull/29133)
    
    - - Show iSCSI gateways status in the health page — [https://github.com/ceph/ceph/pull/29112](https://github.com/ceph/ceph/pull/29112)
    
    - - Allow disabling redirection on standby Dashboards — [https://github.com/ceph/ceph/pull/29088](https://github.com/ceph/ceph/pull/29088)
    
    - - Integrate progress mgr module events into dashboard tasks list — [https://github.com/ceph/ceph/pull/29048](https://github.com/ceph/ceph/pull/29048)
    
    - - Provide user enable/disable capability — [https://github.com/ceph/ceph/pull/29046](https://github.com/ceph/ceph/pull/29046)
    
    - - Allow users to change their password on the UI — [https://github.com/ceph/ceph/pull/28935](https://github.com/ceph/ceph/pull/28935)
    
    - - Evict a CephFS client — [https://github.com/ceph/ceph/pull/28898](https://github.com/ceph/ceph/pull/28898)
    
    - - Display iSCSI "logged in" info — [https://github.com/ceph/ceph/pull/28265](https://github.com/ceph/ceph/pull/28265)
    
    - - Watch for pool PGs increase and decrease — [https://github.com/ceph/ceph/pull/28006](https://github.com/ceph/ceph/pull/28006)
    
    - - Allow viewing and setting pool quotas — [https://github.com/ceph/ceph/pull/27945](https://github.com/ceph/ceph/pull/27945)
    
    - Silence Prometheus Alertmanager alerts — [https://github.com/ceph/ceph/pull/27277](https://github.com/ceph/ceph/pull/27277)
- Ongoing feature development work:
    - progress: support rbd\_support module async tasks — [https://github.com/ceph/ceph/pull/29424](https://github.com/ceph/ceph/pull/29424)
    - Controller models proposal — [https://github.com/ceph/ceph/pull/29383](https://github.com/ceph/ceph/pull/29383)
    - Orchestrator integration initial works — [https://github.com/ceph/ceph/pull/29127](https://github.com/ceph/ceph/pull/29127)
    - Force change the password — [https://github.com/ceph/ceph/pull/28405](https://github.com/ceph/ceph/pull/28405)

#### Rook

- ceph/ceph:v14.2.2 is out, and Rook being updated to use it: [https://github.com/rook/rook/pull/3489](https://github.com/rook/rook/pull/3489)

- Lots of work done on making Ceph on Kubernetes PersistenVolumes

#### Orchestrator

- Nautilus: Deepsea orchestrator now supports configuring the Ceph Dashboard (v14.2.3)

- Work started on adding container support for the SSH orchestrator

- Rook orchestrator now supports \`ceph orchestrator host ls\`

### Releases

- [Nautilus v14.2.2](https://ceph.io/releases/v14-2-2-nautilus-released/)

### Ceph Planet

- [Part - 4: RHCS 3.2 Bluestore Advanced Performance Investigation](https://ceph.io/community/part-4-rhcs-3-2-bluestore-advanced-performance-investigation/)

### Project Meeting Recordings

#### [Ceph Developers Monthly](https://www.youtube.com/playlist?list=PLrBUGiINAakNbcSOvOM0IJHqqv5dzusZ6)

- [Ceph Developers Monthly (July 2019)](https://www.youtube.com/watch?v=tK_gIAp7BWA&list=PLrBUGiINAakNbcSOvOM0IJHqqv5dzusZ6&index=36)

#### [Ceph DocUBetter](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy)

- [2019-07-10](https://www.youtube.com/watch?v=FQturLnIVEY&list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy&index=8)
- [2019-07-24](https://www.youtube.com/watch?v=FQturLnIVEY&list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy&index=8)

#### [Ceph Performance Weekly](https://ceph.com/performance-2/)

- [2019-07-18](https://www.youtube.com/watch?v=7sukIiyEHh4&list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw&index=4)
- [2019-07-25](https://www.youtube.com/watch?v=fKekdXhEENY&list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw&index=3)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw)

#### [Ceph Orchestration](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)

- [2019-07-01](https://www.youtube.com/watch?v=puzqO4smNkU&list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ&index=20&t=0s)
- [2019-07-10](https://www.youtube.com/watch?v=2guNQbsXUWk&list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ&index=21&t=0s)
- [2019-07-15](https://www.youtube.com/watch?v=_oqsdhZwWDM&list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ&index=22&t=0s)
- [2019-07-17](https://www.youtube.com/watch?v=qydmShw6OYg&list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ&index=23&t=0s)
- [2019-07-22](https://www.youtube.com/watch?v=S_IpmIcEehg&list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ&index=24&t=0s)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)

### Recent events we were at

#### Cephalocon Barcelona

Our recent big Ceph event! We enjoyed hearing user stories, presentations from members of the community. [Watch over 70 videos now](https://www.youtube.com/playlist?list=PLrBUGiINAakNCnQUosh63LpHbf84vegNu)!

- [Ceph Day Netherlands (July 2nd)](https://ceph.com/cephdays/netherlands-2019/)

### Upcoming conferences

Please coordinate your Ceph CFP's with the community on our [CFP coordination pad](https://pad.ceph.com/p/cfp-coordination).

- [Ceph Day CERN](https://ceph.com/cephdays/ceph-day-cern-2019/) - September 16th
- [Ceph Day London](https://ceph.com/cephdays/ceph-day-london/) - October 24th
