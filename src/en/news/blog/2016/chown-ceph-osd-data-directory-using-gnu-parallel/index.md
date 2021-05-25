---
title: "Chown Ceph OSD data directory using GNU Parallel"
date: "2016-08-09"
author: "admin"
tags: 
  - "planet"
---

Starting with Ceph version Jewel (10.2.X) all daemons (MON and OSD) will run under the privileged user ceph. Prior to Jewel daemons were running under root which is a potential security issue. This means data has to change ownership before a daemon running the Jewel code can run. Chown data As the Release Notes state … [Continue reading Chown Ceph OSD data directory using GNU Parallel](https://blog.widodh.nl/2016/08/chown-ceph-osd-data-directory-using-gnu-parallel/)

Source: widodh ([Chown Ceph OSD data directory using GNU Parallel](https://blog.widodh.nl/2016/08/chown-ceph-osd-data-directory-using-gnu-parallel/))
