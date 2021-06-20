---
title: "New in Luminous: Improved Scalability"
date: "2017-09-20"
author: "sage"
tags: 
  - "cern"
  - "luminous"
---

\[caption id="" align="aligncenter" width="640"\]![](https://cds.cern.ch/record/2262233/files/_DSC0219.jpg?subformat=icon-640) © 2017 CERN\[/caption\]

[CERN](https://cern.ch) has been a long-time Ceph user and active community member, running one of the largest production OpenStack clouds backed by Ceph.  They are also using Ceph for other storage use-cases, backing a range of high energy physics experiments.  Overall scalability is understandably an area of interest.

### **Big Bang I and II**

In 2015, CERN ran a [Ceph scalability experiment](https://cds.cern.ch/record/2015206/files/CephScaleTestMarch2015.pdf) with 30 PB across 7200 OSDs.  New storage hardware for an unrelated infrastructure project had just been procured and CERN’s Ceph team had a limited window of time to use the new nodes for testing before they were put into production.  The results were mixed, highlighting several scalability issues in the monitor daemons and OSDMap management.

The next year CERN repeated the experiment together with the Ceph developers, dubbing it "Big Bang II.” This test incorporated various changes in the Jewel release and achieved much better results.  However, scalability was still ultimately limited by architectural issues in the monitor; namely, that utilization information was being regularly reported by OSDs and overwhelming the monitors replication and IO capabilities.  This provided additional motivation for the design and implementation of the new Ceph manager (ceph-mgr) daemon, which offloads all but the most critical functions from the monitor and is able to much more efficiently manage ephemeral utilization information.

### **Big Bang III**

This spring we reiterated a third time--"Big Bang III"--this time with an even larger hardware footprint and an early Luminous release candidate:

- 225 servers
- 48 6TB hard drives per server
- 10,800 OSDs in total, nearly 65 petabytes!
- 3 monitors and managers, colocated with OSDs

The timing was fortuitous as it coincided with the final testing and development of the ceph-mgr stats management, which meant we were able to validate that the new approach is effective (spoiler: it is!).  During our testing we also identified a related issue with monitor sluggishness while creating extremely large pools (in our case, 256,000 PGs).  An improved approach that throttles PG creation was designed, implemented, and tested during our (relatively narrow) time window of access to the CERN cluster.

[![](images/CERN-logo.jpg)](https://cern.ch)In the end, the cluster contained over 10,000 OSDs and was stable and responsive, even in the face of several stress tests.  There are a large number of deployed Ceph clusters with over 1,000 OSDs, but we see very few reports over 2,000.  This test demonstrates at least a five-fold increase in single-cluster capacity.  And although most Ceph clusters are not this big, all users benefit from the increased robustness and reduced resource requirements these changes bring for all users.

It is ordinarily very difficult for Ceph developers to get access to clusters of this size for real-world testing, even for short periods of time.  This latest round of collaborative testing at CERN (which included direct access by developers to the environment) was instrumental in validating and debugging our architectural changes at scale.  Special thanks are in order to Dan van der Ster at CERN who orchestrated the endeavor.
