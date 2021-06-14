---
title: "openATTIC 3.4.2 has been released"
date: "2017-08-04"
author: "admin"
tags: 
  - "planet"
---

We are very happy to announce the release of openATTIC version 3.4.2.

In this release, we've continued with the integration of Ceph Luminous features. It is now possible to configure the Ceph keyring via the 'System | Settings' menu. This release also implements the WebUI part of the previously introduced backend feature to create erasure coded overwrite enabled pools. openATTIC now also supports to enable compression on pools stored on OSDs with the "Bluestore" storage backend. The WebUI will notify you about RBD features that are not supported when you create a new iSCSI target. Developers will benefit from the ability to overwrite global settings for the backend and frontend via local settings files.

Beside the new features mentioned above, this release also includes various bug fixes and minor improvements. It is possible to delete non-empty RGW buckets now, but please take care, this will also remove buckets that are still in use, e.g. by NFS Ganesha. When a new RBD is created, the old format is not used anymore.

[Read more…](http://openattic.org/posts/openattic-342-has-been-released/) (2 min remaining to read)

Source: SUSE ([openATTIC 3.4.2 has been released](http://openattic.org/posts/openattic-342-has-been-released/))
