---
layout: content-simple
title: Crimson Project
order: 4
---

# {{ title }}

## Goal

Crimson is designed to be a faster OSD, in the sense that

- It targets fast storage devices, like NVMe storage, to take advantage of the high performance of random I/O and high throughput of the new hardware.
- It will be able to bypass the kernel when talking to networking/storage devices which support polling.
- It will be more computationally efficient, so the load is more balanced in a multi-core system, and each core will be able to serve the same amount of IO with lower CPU usage.
- It will achieve these goals by a design from scratch. It also utilizes modern techniques, like SPDK, DPDK and the Seastar framework, so it can 1) bypass the kernel, 2) avoid memcpy between, 3) avoid lock contention.

Crismon will be a drop-in-replacement of the classic OSD. Our long-term goal is to redesign the object storage backend from scratch, This new backend is dubbed “Seastore”. The disk layout we will use for Seastore won’t necessarily be optimal for HDDs. But Seastore is still in its early stage, and is still missing a detailed design. As an intermediate solution, bluestore is adapted to crimson-osd for testing purposes. But if the new object storage backend does not work well with HDD, we will continue using bluestore in crimson just for supporting HDD.

We are using a C++ framework named Seastar to implement Crimson, but we are not porting classic OSD to Seastar, as the design philosophy and various considerations could be very different between them. So, again, please bear in mind, to port classic OSD to Seastar and adapt it to bluestore is never our final goal.

The new Crimson OSD will be compatible with classic OSD, so existing users will be able to upgrade from classic OSD to Crimson OSD. Put in other words, crimson-osd will:

- Support librados protocol
  - Be able to talk to existing librados clients
  - Be able to join an existing Ceph cluster as an OSD
- Support most existing OSD commands

Note that some existing options won’t apply to the Crimson OSD, and new options will be added.

## Current support

As Crimson is in under active development not all not featurewise on par with its predecessor yet.
Crimson OSD currently supports:

- Librados operations including snap support
- Log based recovery and Backfill
- RBD workloads on Replicated pools
- Bluestore, Seastore and cyanstore (memory-based) object store backends
- Deployment via Cephadm

Work in progeress:

- Initial Scrub
- EC pools
- RGW
- Multi-shard messenger/OSD/objectstores

## Test Coverage

The `crimson-rados` suite is rather minimal. However, it has been stablized and is used
to gate PRs merges and prevent regressions. The suite also includes performance tests which are driven by CBT.

## Future Work

- ### Performance Review and CI integration

Currently we have a preliminary CI support for checking of the significant
regressions, but we need to update the test harness and test cases
whenever it’s necessary. Also we need to

- Review the performance to see if there is any regression not caught by the CI
  tests.
- Compare the performance of classic OSD and crimson-osd on monthly basis.

* ### PG Scaling - Splits/Merges

* ### Seastore

The next generation objectstore optimized for modern devices. And it would take
a long time before its GA. As a reference, bluestore started in early 2015, and
it was ready for production in late 2017. There will be three phases:

- Prototyping/Design:

  - Prototyping

    - define typical use cases, the constraints and assumptions.
    - evaluate different options and understand the tradeoffs, probably do some
      experiments, before solidifying on a specific design

  - Design:

    - in-memory/on-disk data structures
    - A sequence diagram to illustrate how to coordinate the foreground IOPS and
      background maintenance task.
    - define its interfaces talking to the other part of OSD

- Implementation:

  - Integrate the object store with crimson-osd. If seastore cannot support HDD
    well, it should be able to coexist with bluestore.
  - Stabilize the disk layout
  - Dynamic disk sharding. The current sharded seastore only shards the disk space
    statically upon mkfs (Sufficient for performance evaluation and optimization).
  - Improve the efficiency from write-amplification and computational perspective.
    Mostly under 4K random read and write scenarios that are CPU and I/O intensive,
    so that switching from classic + bluestore to crimson + alienstore and later
    on to crimson + seastore would become attractive.
    This might be an important metric that the solution is leaving the prototyping phase.

* ### Seastar+SPDK evaluation/integration

- To evaluate different approaches of kernel-bypassing techniques.
- To integrate SPDK into Seastar

## Useful Project Links:

- [Tracker](tracker.ceph.com/projects/crimson/issues)
- [Docs](docs.ceph.com/en/latest/dev/crimson)
- [Slack](ceph-storage.slack.com) - #crimson
- [Trello](https://trello.com/b/lbHkWKxh/crimson)

## Blog Posts:

- [Crimson: Next-generation Ceph OSD for Multi-core Scalability](https://ceph.io/en/news/blog/2023/crimson-multi-core-scalability)

## Talks:

- [Cephalocon 2023 - Crimson Project Update](https://www.youtube.com/watch?v=LaP4YX1lQ3I)
- [From Classical to the Future](https://www.youtube.com/watch?v=8N_1WAEPw0o)
- [Understanding SeaStore through profiling](https://www.youtube.com/watch?v=SUJjZ9bjXJc)
- [Ceph Virtual 2022 - What's new with Crimson and Seastore?](https://www.youtube.com/watch?v=vc5w2mn93cY)
- [Ceph Month 2021: Crimson Update](https://www.youtube.com/watch?v=vzJPOA7aJMk)
- [Rebuilding a Faster OSD with Future](https://www.youtube.com/watch?v=3NmCPTJI1JE)
- [Vault '20 - Crimson: A New Ceph OSD for the Age of Persistent Memory and Fast NVMe Storage](https://www.youtube.com/watch?v=FuFmMB9rbRA)
- [A Glimpse of the New Ceph Messenger Built on Seastar](https://www.youtube.com/watch?v=X4Pz-dqrwi8)
- [Error handling in a futurized environment](https://www.youtube.com/watch?v=HXfFX0wGKL4)
- [Rebuilding the Ceph Distributed Storage Solution with Seastar](https://www.youtube.com/watch?v=A_25U4j7quA)
