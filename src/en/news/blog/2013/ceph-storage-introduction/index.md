---
title: "Ceph Storage :: Introduction"
date: "2013-12-05"
author: "syndicated"
tags: 
  - "ceph"
---

##   

## What is CEPH[![](images/pencil.png)](https://wiki.csc.fi/wiki/CloudComputing/CEPHStorage# "What Is CEPH")

Ceph is an open-source, massively scalable, software-defined storage system which provides object, block and file system storage from a single clustered platform. Ceph's main goals is to be completely distributed without a single point of failure, scalable to the exabyte level, and freely-available. The data is replicated, making it fault tolerant. Ceph software runs on commodity hardware. The system is designed to be both self-healing and self-managing and self awesome :-)

  
CEPH Internals  

- **OSD**: A Object Storage Daemon (OSD) stores data, handles data replication, recovery, backfilling, rebalancing, and provides some monitoring information to Ceph Monitors by checking other Ceph OSD Daemons for a heartbeat. A Ceph Storage Cluster requires at least two Ceph OSD Daemons to achieve an active + clean state when the cluster makes two copies of your data . 
- **Monitor**: A Ceph Monitor maintains maps of the cluster state, including the monitor map, the OSD map, the Placement Group (PG) map, and the CRUSH map. Ceph maintains a history (called an “epoch”) of each state change in the Monitors, Ceph OSD Daemons, and PGs.
- **MDS**: A Ceph Metadata Server (MDS) stores metadata on behalf of the Ceph Filesystem . Ceph Metadata Servers make it feasible for POSIX file system users to execute basic commands like ls, find, etc. without placing an enormous burden on the Ceph Storage Cluster.

**Note :: Please use http://ceph.com/docs/master/ and other official InkTank and ceph community resources as a primary source of information on ceph . This entire blog is an attempt help beginners in setting up ceph cluster and sharing my troubleshooting with you.**

  

  

![](http://feeds.feedburner.com/~r/CephStorageNextBigThing/~4/cEnHTGlcfyo)
