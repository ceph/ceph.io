---
title: "v15.2.3 Octopus released"
date: "2020-05-30"
author: "TheAnalyst"
tags:
  - "release"
  - "octopus"
---

We're happy to announce the availability of the third Octopus stable release series. This release mainly is a workaround for a potential OSD corruption in v15.2.2. We advise users to upgrade to v15.2.3 directly. For users running v15.2.2 please execute the following::

ceph config set osd bluefs\_preextend\_wal\_files false 

### **Changelog**

- bluestore: common/options.cc: disable bluefs\_preextend\_wal\_files ([issue#45613](https://tracker.ceph.com/issues/45613), [commit](https://github.com/ceph/ceph/commit/4f6be8347b27f79389f3829602246cd31102d829))
