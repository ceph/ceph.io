---
title: "Ceph paxos propose interval"
date: "2014-02-01"
author: "loic"
tags: 
  - "ceph"
---

When a command is sent to the [Ceph](http://ceph.com/) monitor, such as [ceph osd pool create](https://github.com/ceph/ceph/blob/v0.75/src/mon/OSDMonitor.cc#L3960), it will [add a pool](https://github.com/ceph/ceph/blob/v0.75/src/mon/OSDMonitor.cc#L3960) to the pending changes of the maps. The modification is [stashed](https://github.com/ceph/ceph/blob/v0.75/src/mon/OSDMonitor.cc#L4053) for [paxos propose interval](https://github.com/ceph/ceph/blob/master/src/common/config_opts.h#L218) seconds before it is used to build new maps and becomes effective. This guarantees that the mons are not updated more than once a second ( the default value of **paxos propose interval** ).  
When running **make check** changing the **paxos propose interval** value to **0.01** seconds for [the cephtool tests](https://github.com/ceph/ceph/blob/v0.75/qa/workunits/cephtool/test.sh) roughly saves half the time (going from ~2.5mn to ~1.25mn real time).

\--paxos-propose-interval=0.01
