---
title: "New in Nautilus: ceph-iscsi Improvements"
date: "2019-04-18"
author: "lenz"
tags: 
  - "dashboard"
  - "iscsi"
  - "management"
  - "nautilus"
---

The [ceph-iscsi](https://github.com/ceph/ceph-iscsi/) project provides a framework, REST API and CLI tool for creating and managing iSCSI targets and gateways for Ceph via [LIO](http://linux-iscsi.org/wiki/LIO). It is the successor and a consolidation of two formerly separate projects, the [ceph-iscsi-cli](https://github.com/ceph/ceph-iscsi-cli/) and [ceph-iscsi-config](https://github.com/ceph/ceph-iscsi-config) which were initially started in 2016 by [Paul Cuzner](https://github.com/pcuzner) at Red Hat.

While this is not a new feature of Ceph Nautilus per se, improving ceph-iscsi was required for achieving one of the goals for the Ceph Dashboard in Nautilus: reaching feature parity with the [openATTIC](https://openattic.org/) project.

One of these features was the possibility to manage iSCSI targets and all related aspects via the Dashboard UI. The key challenge here was to overcome some of the limitations in the openATTIC implementation, which relied on [lrbd](https://github.com/SUSE/lrbd/) and [DeepSea](https://github.com/SUSE/DeepSea/) for performing the actual configuration changes on the iSCSI gateway nodes.

While ceph-iscsi and lrbd use a similar approach in storing the configuration in RADOS objects, there are some fundamental differences in how the configuration is modified and applied. For example, lrbd provides a command-line interface that needed to be triggered remotely via Salt/DeepSea.

The Dashboard now talks to the REST API provided by the `ceph-iscsi-api` daemon on the respective node that provides the iSCSI gateway service. This makes it possible to manage the iSCSI gateway configuration (locally and remote) from both the command line via the `gwcli` command as well as the Dashboard.

[Ricardo Marques](https://github.com/ricardoasmarques) from the Ceph Dashboard team at SUSE added numerous features to ceph-iscsi in order to bridge the gap between what openATTIC/lrbd provided and to remove some limitations in ceph-iscsi.

Some noteworthy changes include:

- [Python3 support](https://github.com/ceph/ceph-iscsi/pull/2)
- [Multiple iSCSI target support](https://github.com/ceph/ceph-iscsi/pull/9)
- [Support “/” in password fields](https://github.com/ceph/ceph-iscsi/pull/37)
- [Support for dots in pool/image names](https://github.com/ceph/ceph-iscsi/pull/29)
- [Support for iSCSI discovery and mutual CHAP authentication](https://github.com/ceph/ceph-iscsi/pull/9)
- Support for no authentication
- [Support for encrypting discovery passwords](https://github.com/ceph/ceph-iscsi/pull/37)
- [Support for configurable Ceph pool names](https://github.com/ceph/ceph-iscsi/pull/32)
- [Support for attaching existing RBD images and detaching images without deleting them](https://github.com/ceph/ceph-iscsi/pull/9)
- [Support for multiple backstores (to support kernel-lio-rbd in addition to tcmu-runner)](https://github.com/ceph/ceph-iscsi/pull/23)
- [Support for disabling ACL authentication](https://github.com/ceph/ceph-iscsi/pull/24)
- Many enhancements to the REST API (e.g. new endpoints)
- Numerous bug fixes and minor enhancements

See the [Ceph Dashboard documentation](http://docs.ceph.com/docs/nautilus/mgr/dashboard/#enabling-iscsi-management) on how to enable iSCSI management support in the Dashboard. Please note that you need a very recent version of ceph-iscsi to make use of this functionality. Packages for the most common Linux distributions are still in the works. Packages for SUSE Linux distributions can be found on the [openSUSE Build Service](https://build.opensuse.org/package/show/filesystems:ceph/ceph-iscsi), RPMs for CentOS 7 can be found on Ceph’s [Shaman build service](https://shaman.ceph.com/repos/ceph-iscsi/).

Special thanks to [Jason Dillaman](https://github.com/dillaman) and [Mike Christie](https://github.com/mikechristie) from Red Hat for the guidance and help with reviewing and merging these changes!
