---
title: "Red Hat Ceph Storage 3.3 BlueStore compression performance"
date: "2019-09-25"
author: "jbrooks"
---

With the BlueStore OSD backend, Red Hat Ceph Storage  gained a new capability known as "on-the-fly data compression" that helps save disk space. Compression can be enabled or disabled on each Ceph pool created on BlueStore OSDs. In addition to this, using the Ceph CLI the compression algorithm and mode can be changed anytime, regardless of whether the pool contains data or not. In this blog we will take a deep dive into BlueStore’s compression mechanism and understand its impact on performance.

[Read More](https://www.redhat.com/en/blog/red-hat-ceph-storage-33-bluestore-compression-performance)
