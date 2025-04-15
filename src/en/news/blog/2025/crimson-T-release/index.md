---
title: "A Crimson colored Tentacle"
date: "2025-04-21"
author: "Matan Breizman (IBM), Yingxin Cheng (Intel)"
image: "images/Crimson_T.jpg"
tags:
  - "release"
  - "tentacle"
  - "crimson"
---

The Crimson project continues to progress, with the Squid release marking the first technical preview available for Crimson.
The Tentacle release introduces a host of improvements and new functionalities that enhance the robustness, performance, and usability
of both Crimson-OSD and the Seastore object store.
Below, we highlight some of the recent work included in the latest release, moving us closer to fully replacing the existing Classical OSD in the future.
If you're new to the Crimson project, please visit the [project page](https://ceph.io/en/news/crimson) for more information and resources.

## Crimson Tentacle Updates:

### Robustness:

Over 100 pull requests have been merged since the Squid code freeze. There is a dedicated and ongoing effort
to stabilize and strengthen recovery scenarios and critical paths.

For more details on recent PRs, visit the [Crimson GitHub project page](https://github.com/orgs/ceph/projects/8).

### Tests:

A cron job has been added to run the full Crimson-RADOS test suite twice a week.
Frequent suite runs help us spot any regressions early, as changes to Crimson can be delicate.
Additionally, Backfill and PGLog-based recovery test cases have been added.

See the latest test [runs](https://pulpito.ceph.com/teuthology-2025-04-05_20:56:02-crimson-rados-main-distro-crimson-smithi/).

### OSD Feature-Fullness:

- **OSD scheduler**:
  Integrate a recovery operation throttler to improve Quality of Service (QoS) when handling both client and recovery/backfill operations.
  This is the initial step towards fully supporting the Mclock scheduler used by the Classical OSD.
  For more details, see the [pull request](https://github.com/ceph/ceph/pull/62080).

- **Allow for Per-object Processing**:
  Rework the client I/O pipeline to enable concurrent processing of one request per object.
  Writes still need to serialize at submission time. For random reads with high concurrency,
  this results in increased throughput on a single OSD with Seastore.
  For more details, see the [pull request](https://github.com/ceph/ceph/pull/61005).

- **PG Splitting and Merging:**
  Splitting existing placement groups (PGs) allows the cluster to scale over time as storage requirements increase.
  Ongoing work to support the PG auto-scaler feature is aimed to be included in the T release.
  For more details, see the [pull request](https://github.com/ceph/ceph/pull/60428).

### Coroutines, Coroutines, Coroutines:

From [Seastar's documentation](https://docs.seastar.io/master/split/5.html):

> The simplest way to write efficient asynchronous code with Seastar is to use coroutines.
> Coroutines don’t share most of the pitfalls of traditional continuations, and so are the preferred way to write new code.

With the introduction of coroutine support in C++20, any new code added to Crimson is highly prioritized to be implemented with coroutines.
This approach makes the code more readable and helps avoid issues like variable lifecycle responsibilities.

For an example of a rewritten code section, see [commit](https://github.com/ceph/ceph/pull/61536/commits/878f3bff706bf3e4acd0d4176310dd3fc5230a83).

### CMake Tidy Up:

The common components used by both the Classical OSD and Crimson might need slight adjustments to work with both architectures.
For example, Crimson does not require mutexes due to its lockless shard-nothing design, so ceph::mutex is overridden to use a "dummy_mutex" under the hood.
To differentiate between the two types when compiling the OSD, we've introduced the `WITH_SEASTAR` macro.

Crimson supports both native (Seastar-based object stores, such as Seastore, and non-native object stores, like Bluestore.
To accommodate this, further adjustments to our common components' usage were necessary. For this reason,
the `WITH_ALIENSTORE` macro was used in combination with the `SEASTAR` macro.

To prevent technical debt from accumulating and to make the code more readable for other developers,
the two macros above were replaced with a _single_ `WITH_CRIMSON` macro that supports all the nuances mentioned.

For more details, see the [pull request](https://github.com/ceph/ceph/pull/61672).

### Updated Seastar Submodule:

Crimson architecture is based on the Seastar framework. Our usage of the framework requires some Crimson-specific modifications -
for this reason we use our fork of Seastar (located at ceph/seastar). To keep up with recent fixes and updates to the upstream framework
our submodule is updated regualry.

See [ceph/seastar Submodule](https://github.com/ceph/seastar/commits/wip-matanb-seastar-feb-25/).

### Seastar Reactor Options:

Seastar provides reactor configuration options that can affect the behavior of the OSD.
We've exposed some of these options as Ceph configurables, supported via ceph.conf.
For more details, see the [pull request](https://github.com/ceph/ceph/pull/61494).

### Deployment Changes:

From the [Kernel documatnion](https://www.kernel.org/doc/Documentation/sysctl/fs.txt):

> aio-nr is the running total of the number of events specified on the
> io_setup system call for all currently active aio contexts.

Due to Crimson architectures, the default value used may sometimes not be sufficient when deploying multiple Crimson-OSDs on the same host.
Therefore, we've updated both package-based and Cephadm deployments to increase this value.

For more details, see the [pull request](https://github.com/ceph/ceph/pull/60611).

### Seastore

**Lookup Optimizations:** SeaStore is responsible for managing RADOS objects, including their data and metadata.
As such, optimizing lookup operations is a critical aspect of performance improvements. These optimizations primarily focus on the B+ tree implementations, balancing performance and complexity.
For more details, see: [Encapsulate lba pointer PR](https://github.com/ceph/ceph/pull/61347) or [OMap and pg log optimization PR](https://github.com/ceph/ceph/pull/59213).

**Data Overwrite Optimizations:** It is common for write sizes to differ from the arrangement of low-level blocks in SeaStore.
Various optimization strategies can be applied, and it remains worthwhile to explore better approaches.
For more details, see the [RBM inplace rewrite PR](https://github.com/ceph/ceph/pull/54525) or [Control memory copy PR](https://github.com/ceph/ceph/pull/56353)

**General Performance Enhancements:** Performance issues can arise in various areas. The best approach is to conduct extensive testing,
gain a deeper understanding of system behaviors, and prioritize addressing the most impactful problems.
For example, see:

- [Support partial reads PR](https://github.com/ceph/ceph/pull/60654)
- [Cache metadata during cleanup PR](https://github.com/ceph/ceph/pull/56250)
- [Batch remap operations PR](https://github.com/ceph/ceph/pull/57818)
- [Write ool without padding PR](https://github.com/ceph/ceph/pull/58250)
- [Split out root meta PR](https://github.com/ceph/ceph/pull/60655)
- [Seastore fadvise support PR](https://github.com/ceph/ceph/pull/60891)
- [Promote logical address to be block aligned PR](https://github.com/ceph/ceph/pull/59182)

**Periodic Status Reports:** To monitor and understand internal operations, periodic reports can be enabled in the logs to summarize the latest status from various aspects. These reports are primarily for development and optimization purposes and are continuously evolving.
For more details, see some of the recent stats enhancements: [Reactor Utilization](https://github.com/ceph/ceph/pull/56775) , [Disk-IO](https://github.com/ceph/ceph/pull/57788),
[Transaction](https://github.com/ceph/ceph/pull/58467) or [LRU Cache](https://github.com/ceph/ceph/pull/59212)

**Enhanced Checksum Support:** Integrity checks are crucial due to the unpredictable reliability of disks. Recent enhancements include Read [Checksum support](https://github.com/ceph/ceph/pull/55449).

**Random Block Manager:** SeaStore aims to support various storage mediums, particularly those capable of random writes without significantly sacrificing bandwidth.
This allows SeaStore to avoid sequential writes, making certain tasks more efficient. For more details, see RBM's [inplace-rewrite](https://github.com/ceph/ceph/pull/54525) or
[the Checksum offload](https://github.com/ceph/ceph/pull/57782).

**Code Cleanup and Bug Fixes:** To ensure the project's sustainability during the development of important features and optimizations, maintaining understandable code is crucial.
Despite the inevitable increase in complexity, we continuously fix unexpected bugs, review logic, and take action whenever parts of the code become unclear.
This sometimes leads to major refactors, as developing and reviewing based on inappropriate or overly complicated structures can be more challenging.
These efforts typically account for nearly half of the total work, and sometimes even more.

**SeaStore CI:** tests have been implemented to ensure confidence in promoting Seastore as the default option.
