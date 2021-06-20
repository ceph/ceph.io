---
title: "List the versions of OSDs in a Ceph cluster"
date: "2014-09-24"
author: "loic"
tags: 
  - "ceph"
---

List the versions that each OSD in a [Ceph](http://ceph.com/) cluster is running. It is handy to find out how mixed the cluster is.

\# ceph tell osd.\* version
osd.0: { "version": "ceph version 0.67.4 (ad85ba8b6e8252fa0c7)"}
osd.1: { "version": "ceph version 0.67.5 (a60acafad6096c69bd1)"}
osd.3: Error ENXIO: problem getting command descriptions from osd.3
osd.6: { "version": "ceph version 0.72.2 (a913ded64099cfd60)"}
osd.7: { "version": "ceph version 0.72.1 (4d923874997322de)"}
osd.8: { "version": "ceph version 0.72.1 (4d923874997322de)"}
...
