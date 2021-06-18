---
title: "Ceph Community Newsletter, July 2020 Edition"
date: "2020-08-01"
author: "thingee"
---

## Announcements

#### Ceph Tech Talk for July 2020: A Different Scale - Running small ceph clusters in multiple data centers

Yuval Freund presented a different perspective of smaller Ceph clusters running in multiple data centers.

[More on Ceph Tech Talks](https://ceph.io/ceph-tech-talks/)

* * *

## Project updates

### CephFS

- Continuing work on \`ceph fs top\`
- master/slave terminology removed from CephFS codebase
- New cephfs required features command: [https://docs.ceph.com/docs/master/cephfs/administration/#minimum-client-version](https://docs.ceph.com/docs/master/cephfs/administration/#minimum-client-version)
- New automatic subtree pinning policies: [https://docs.ceph.com/docs/master/cephfs/multimds/#setting-subtree-partitioning-policies](https://docs.ceph.com/docs/master/cephfs/multimds/#setting-subtree-partitioning-policies)

### Dashboard

- Lots of ongoing work to establish the dashboard’s API backend as the new Ceph REST API (see [https://tracker.ceph.com/issues/40907](https://tracker.ceph.com/issues/40907) for the epic)
- UI framework refactoring (using SCSS, more Bootstrap variables)
- Improving cephadm integration (e.g. service deployment)
- New landing page design under review (see [https://github.com/ceph/ceph/pull/36476](https://github.com/ceph/ceph/pull/36476) for the proposal)
- New feature: assigning flags to individual OSDs (see [https://github.com/ceph/ceph/pull/36449](https://github.com/ceph/ceph/pull/36449) for the draft)

### RADOS

- Ability to cancel on-going scrubs
- More fine-grained memory tracking in BlueStore
- Crimson OSD testing in Teuthology
- Crimson Backfill Code Walkthrough [https://www.youtube.com/watch?v=xZswk3yAF5U&list=PLrBUGiINAakOXlMQbSdZB\_PoLhqpSa3NU&index=4](https://www.youtube.com/watch?v=xZswk3yAF5U&list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU&index=4)
- dmClock Code Walkthrough [https://www.youtube.com/watch?v=D27XlS8Z\_sc&feature=youtu.be](https://www.youtube.com/watch?v=D27XlS8Z_sc&feature=youtu.be)

* * *

## Releases

- [Mimic is retired](https://ceph.io/releases/mimic-is-retired/)

fd

* * *

## Ceph Planet

- [SUSE Enterprise Storage delivers best CephFS benchmark on Arm](https://ceph.io/planet/suse-enterprise-storage-7-first-public-beta-2/)

* * *

## Project Meeting Recordings

[All meetings](https://ceph.io/community/meetings/)

#### [**Ceph Tech Talk**](https://www.youtube.com/playlist?list=PLrBUGiINAakM36YJiTT0qYepZTVncFDdc)

- [A Different Scale: running small Ceph clusters in multiple data centers](https://www.youtube.com/watch?v=XS7jpFxUYQ0)

[**Ceph Code Walkthrough**](https://www.youtube.com/playlist?list=PLrBUGiINAakN87iSX3gXOXSU3EB8Y1JLd)

- [DmClock](https://www.youtube.com/watch?v=D27XlS8Z_sc)

#### [**Ceph Crimson/SeaStor OSD Weekly**](https://www.youtube.com/playlist?list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU)

- [2020-07-01](https://www.youtube.com/watch?v=UI2AuNRJD6A)
- [2020-07-08](https://www.youtube.com/watch?v=xZswk3yAF5U)
- [2020-07-15](https://www.youtube.com/watch?v=OZyMWyKaYuk)
- [2020-07-22](https://www.youtube.com/watch?v=IOPHeqIQIqE)
- [2020-07-29](https://www.youtube.com/watch?v=nqzillJME4E)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakOXlMQbSdZB_PoLhqpSa3NU)

#### [**Ceph Developers Monthly**](https://www.youtube.com/playlist?list=PLrBUGiINAakNbcSOvOM0IJHqqv5dzusZ6)

- [Ceph Developers Monthly (July 2020)](https://www.youtube.com/watch?v=fHQ4rYsyvhg)

#### [**Ceph DocUBetter**](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy)

- [2020-07-08](https://www.youtube.com/watch?v=-B9E62Tz7wo)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakNe0PzkhHnr1c54O7Zh--zy)

#### [**Ceph Performance Weekly**](https://ceph.com/performance-2/)

- [2020-07-30](https://www.youtube.com/watch?v=htehgoEtMpQ)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakN2qXjxSgfmIwCCLqgiyBqw)

#### [**Ceph Orchestration**](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)

- [2020-07-06](https://www.youtube.com/watch?v=pO_tXJAsbKo)
- [2020-07-13](https://www.youtube.com/watch?v=Itz_KX9Nbh0)
- [2020-07-20](https://www.youtube.com/watch?v=3LnzPIpYohI)
- [2020-07-27](https://www.youtube.com/watch?v=0zMFq9t4rBM)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakMAVH7XC1FyE22rjUB4IWYZ)

#### [**Ceph Science Working Group**](https://www.youtube.com/playlist?list=PLrBUGiINAakM3d4bw6Rb7EZUcLd98iaWG)

- [2020-07-23](https://www.youtube.com/watch?v=m-ogTC8J7Y4)
- [Full playlist](https://www.youtube.com/playlist?list=PLrBUGiINAakM3d4bw6Rb7EZUcLd98iaWG)
