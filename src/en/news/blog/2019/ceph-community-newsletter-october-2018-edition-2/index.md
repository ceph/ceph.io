---
title: "Ceph Community Newsletter, December 2018 edition"
date: "2019-01-21"
author: "thingee"
---

Hey Cephers happy new year! We are catching up again on our community newsletters, so this will include November and December.

### Announcements

#### The Ceph Foundation

On November 12 at Ceph Day Berlin we announced the Ceph Foundation, a new organization to bring industry members together to support the Ceph open source community. The new foundation is organized as a directed fund under the [Linux Foundation](https://www.linuxfoundation.org/), which is also home to many other [projects](https://www.linuxfoundation.org/projects/) and cross-project foundations, including Linux and the Cloud Native Computing Foundation (CNCF) that hosts Kubernetes and [Rook](https://rook.io). [Read more](https://ceph.com/community/announce-the-ceph-foundation/)

#### Cephalocon Barcelona 2019

[Cephalocon Barcelona 2019](https://ceph.com/cephalocon/barcelona-2019/) aims to bring together more than 800 technologists and adopters from across the globe to showcase Ceph’s history and its future, demonstrate real-world applications, and highlight vendor solutions. Join us in Barcelona, Spain on 19-20 May 2019 for our second international conference event. The CFP is now [open](https://linuxfoundation.smapply.io/prog/cephalocon_2019/) and [sponsorship](https://ceph.com/wp-content/uploads/2018/12/sponsor-Cephalocon19.pdf) opportunities are available!

### Project updates

#### RADOS

- Ability to adjust legacy custom CRUSH maps to use the new 'device classes' without triggering any data migration

- New, streamlined ceph::mutex to replace old Mutex

- librados3 cleans up some of the cruft in the librados2 interface, and also separates out the C and C++ libraries so that they can be revised and versioned independently

#### RGW

- New in-place appendable object S3 extension

- Dynamic resharding bugfixes (important)

- Permit S3 server object encryption when SSL is provided by a proxy

#### RBD

- Live image migration: an in-use image can be migrated to a new pool or to a new image with different layout settings with minimal downtime.

- Simplified mirroring setup: The monitor addresses and CephX keys for remote clusters can now be stored in the local Ceph cluster.

- Initial support for namespace isolation: a single RBD pool can be used to store RBD images for multiple tenants

- Simplified configuration overrides: global, pool-, and image-level configuration overrides now supported

- Image timestamps: last modified and accessed timestamps are now supported

- RBD performance metrics gathering is work-in-progress

#### CephFS

New 'volumes' mgr module to streamline creation of cephfs volumes (file systems) and subvolumes (shared subdirctories with quota and independent access).  Creating a new volume will also trigger creation of MDS daemons via the new orchestrator interface (if it is enabled), and conversely deleting volumes will tear down ceph-mds daemons.

#### Dashboard

A lot has happened since the last Ceph Newsletter was published! Tina Kallio has been selected as our outreachy intern and she started this week, currently working on getting her development environment up and finalizing her next code contribution (mgr/dashboard: Filter out tasks depending on permissions — [https://github.com/ceph/ceph/pull/25426)](https://github.com/ceph/ceph/pull/25426)).

Fujitsu has appointed three engineers to work on the dashboard and orchestrator. They're based in Poland and are working on setting up their development environments this week. Igor Podoski (aka "aiicore" on IRC) represents the team. Welcome!

Lenz Grimmer's talk for DevConf.CZ ([https://devconf.info/cz/2019)](https://devconf.info/cz/2019)) in Brno (CZ) has been accepted, he will be talking about managing and monitoring Ceph via the Ceph Manager Dashboard.

Some representatives of the Dashboard and Orchestrator teams met after Ceph Day in Berlin to further discuss the integration and development of these features: [https://pad.ceph.com/p/ceph-dashboard&orchestrator-f2f-2018-11](https://pad.ceph.com/p/ceph-dashboard&orchestrator-f2f-2018-11)

The team working on the Ceph Manager Dashboard added the following new features and noteworthy changes:

- Profiles for configuring the cluster's rebuild performance — [https://github.com/ceph/ceph/pull/24968](https://github.com/ceph/ceph/pull/24968) (Tatjana Dehler)

- Move Cluster/Audit logs from front page to dedicated Logs page — [https://github.com/ceph/ceph/pull/23834](https://github.com/ceph/ceph/pull/23834) (Diksha Godbole)

- Add I18N support — [https://github.com/ceph/ceph/pull/24803](https://github.com/ceph/ceph/pull/24803) (Tiago Melo and Sebastian Krah)

- Public translation platform on Transifex [https://www.transifex.com/ceph/ceph-dashboard/](https://www.transifex.com/ceph/ceph-dashboard/)

- zh\_CN and fr\_FR translations making good progress (thanks Kefu!)

- Erasure code profile management — [https://github.com/ceph/ceph/pull/24627](https://github.com/ceph/ceph/pull/24627) (Stephan Müller)

- SSO - SAML 2.0 support — [https://github.com/ceph/ceph/pull/24489](https://github.com/ceph/ceph/pull/24489) (Ricardo Marques, Ricardo Dias)

- Audit REST API calls — [https://github.com/ceph/ceph/pull/24475](https://github.com/ceph/ceph/pull/24475) (Volker Theile)

- CRUSH map viewer — [https://github.com/ceph/ceph/pull/24766](https://github.com/ceph/ceph/pull/24766) (Dan Guo)

- **Notable features currently under review**

- Add support for managing RBD QoS (Patrick Nawracay) — [https://github.com/ceph/ceph/pull/25233](https://github.com/ceph/ceph/pull/25233)

- Support configuring block mirroring pools and peers (Jason Dillaman) — [https://github.com/ceph/ceph/pull/25210](https://github.com/ceph/ceph/pull/25210)

- Prometheus alert manager integration — [https://github.com/ceph/ceph/pull/25309](https://github.com/ceph/ceph/pull/25309)

- **Other ongoing dashboard feature work (no pull requests yet):**

- iSCSI target mgmt (via ceph-iscsi REST API) (Ricardo Marques) - [https://tracker.ceph.com/issues/35903](https://tracker.ceph.com/issues/35903)

- Ricardo also submitted several PRs to ceph-iscsi, to lay some groundwork for this feature: [https://github.com/ceph/ceph-iscsi/pulls](https://github.com/ceph/ceph-iscsi/pulls)

- NFS Ganesha (via RADOS config object) (Tiago Melo, Ricardo Dias) - [https://tracker.ceph.com/issues/26876](https://tracker.ceph.com/issues/26876)

- Mgr module configuration (Volker Theile), e.g. balancer, disk prediction, telemetry ([https://tracker.ceph.com/issues/36237)](https://tracker.ceph.com/issues/36237))

#### Orchestrator

- Merged initial Ansible orchestrator module.

- Merged initial DeepSea orchestrator module.

- Rook orchestrator adds the ability to remove RGW and MDS services.

- Adding and removing OSDs in the Ansible orchestrator is work in progress.

- Configuring RBD mirroring via the dashboard is work-in-progress

#### Rook

- v0.9 release

- rbd-mirror support

- ceph-volume support

### Releases

- [Luminous v12.2.10](https://ceph.com/releases/v12-2-10-luminous-released/)

### Ceph Planet

- [Ceph at KubeCon Seattle 2018](https://ceph.com/community/ceph-at-kubecon-seattle-2018/)

### Project meetings

#### Ceph Developers Monthly

- [Ceph Developers Monthly (Jul 11)](https://youtu.be/BT--5ARbU2U)
- [Ceph Developers Monthly (Aug 1)](https://youtu.be/h_-QEcvv5Iw)

#### Ceph Performance Weekly

- [Ceph Performance Weekly (Nov 1)](https://www.youtube.com/watch?v=Z1-uM3MRAdU)

#### Ceph Testing Weekly

- [Ceph Testing Weekly (Oct 31)](https://youtu.be/koTxbdRAeg8)

#### Ceph Code Walkthrough

- [Consistency with OSD peering (Oct 23)](https://www.youtube.com/watch?v=GULp4dvwN3I&feature=youtu.be)

### Recent events

#### Ceph Day Berlin

#### KubeCon Seattle 2019

Ceph was well represented at the [Rook](https://rook.io) booth providing an versatile open-source persistent storage solution in Kubernetes. We gave demos on Rook orchestrating deploying a containerized Ceph Luminous environment, as well as doing a rolling upgrade to Mimic. See our blog post

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
