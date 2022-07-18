---
title: "Quincy @ Scale: Testing with the Pawsey Supercomputing Centre"
date: "2022-07-18"
author: "Paul Cuzner"
tags:
  - scalability
  - quincy
  - cephadm
---

During the development of new features, one of the most difficult considerations for Ceph developers is whether a new feature needs to be validated at scale. Our lab environments allow us to test new features in clusters with hundreds of OSDs, and in most circumstances this works well!

However, our developers are a cautious bunch and like to test beyond our typical 'test ceiling', if the opportunity arises.

Late last year, such an opportunity presented itself. The **[Pawsey Supercomputing Centre](https://pawsey.org.au/)** based in Perth, Australia reached out with a potential test window. They identified several weeks in their rollout plan where their hardware was ‘racked and stacked’ but would remain unused.

As we were approaching the end of the development cycle for the Quincy release, this was an opportunity too good to miss!

---

## Hardware

Pawsey provided access to over **200** servers, all connected via 100Gb networking. The server specifications were optimized for a large Object storage use case, and enabled us to create the following Ceph cluster;

- 180 OSD Hosts
- 4,320 OSDs
- 69 PB (_raw capacity_)
- 100Gb Networking (_multiple VLANs_)
- Separate mon/mgr nodes (_'service'_ nodes)

## Test Objectives

Although the orchestrator/cephadm control plane has been in place since the Ceph Octopus release, the challenge of deploying and managing a cluster of this size were defined as our main goals.

In addition to cluster management, we also wanted to assess monitoring/alerting and 'road-test' the experimental `cephadm agent` feature.

## Key Findings

By using Pawsey's cluster we were able to identify and resolve a number of scale issues prior to Quincy's initial release, and identify areas of further work to deliver improvements in the Ceph Reef release.

### Core

- All Ceph daemons report their performance counters to the active manager every 5 seconds by default. We found that the responsiveness of the mgr and CLI became intermittent beyond 2,800 OSDs due to this data load and the interaction with the `mgr/prometheus` module. A [PR](https://github.com/ceph/ceph/pull/44162) was merged which reduced this issue significantly.
- A bug was identified in the scale up profile of the [`pg_autoscaler`](https://docs.ceph.com/en/quincy/rados/operations/placement-groups/#autoscaling-placement-groups), which prevented pg’s from peering. This has been subsequently fixed, and backported to [Pacific](https://github.com/ceph/ceph/pull/44869) and [Octopus](https://github.com/ceph/ceph/pull/44541).

### Orchestrator/cephadm

- `ceph-volume` was enhanced to better handle unexpected disk formats like Atari partitions and GPT based devices.
- `cephadm` uses SSH as the control path to each cluster host. During our negative testing, we found that when ssh issues were encountered (bad/missing keys), the resulting information returned to the user was overly verbose. This was fixed in [PR 45132](https://github.com/ceph/ceph/pull/45132).
- Cephadm’s experimental 'agent' feature was used to provide the orchestrator with host, device and daemon state metadata. Testing showed that deployment and data quality were as expected, but the agent generated too much log traffic, making potential troubleshooting problematic. The intent is for the Agent to become a supported feature in the Ceph Reef release.
- With so many hosts, the lack of filtering in the `orch host ls command` made interacting with the cluster more difficult. Filtering was added in [PR 44020](https://github.com/ceph/ceph/pull/44020), addressing this usability issue.

### UI Management

Historically, Ceph clusters of this size have been managed with a CLI-based toolchain, but we took this opportunity to briefly look at the integrated Ceph UI (dashboard).

Whilst the monitoring capabilities of the dashboard were functional, management of hosts and OSDs were problematic leading to browser timeouts.

The lack of pagination has been identified as the root cause for most of these responsiveness issues. Work is currently under way to introduce pagination to the dashboard's backend services layer ([PR 46644](https://github.com/ceph/ceph/pull/46644/)).

### Monitoring

Out-of-the-box, `cephadm` deploys a Prometheus server to provide the cluster with monitoring and alerting capabilities. The data sent to Prometheus is emitted by the `mgr/prometheus` module which interacts with ceph-mgr to present Ceph counters in Prometheus exposition format.

As the cluster scaled beyond 2,800 OSDs the Prometheus server was unable to consistently retrieve data from the `mgr/prometheus` endpoint, primarily due to the volume of data returned (> 400K samples from a single endpoint).

Despite the monitoring issues, we were able to determine some sizing guidelines for a Prometheus instance monitoring a 69PB Ceph cluster (YMMV!)

- The prometheus TSDB saw I/O peaks between 3000-6000 IOPS, so selecting an appropriate SSD or NVMe device is recommended.
- If you have to share a mon host, use a separate device for the TSDB to avoid introducing latency or capacity conflicts with the Ceph monitor store.
- Plan for approximately 512GB of storage, based on the default 15 day retention cycle.

Gaining a deeper understanding of the effects of scale on the metrics 'path' was a key finding, and formed the basis for further analysis that will be covered in a subsequent blog post.

## Summary

So what did we learn?

- The orchestrator/cephadm feature was able to successfully deploy and manage a cluster of 4,320 OSDs, across 180 hosts.
- OSD deployment with cephadm took around 8-11 secs per OSD.
- We were able to identify 'Rule of thumb' sizing for the Prometheus server required to monitor such a large cluster.
- Several scale issues were identified within the monitoring and dashboard layers, which are currently being worked on for the Ceph Reef release.
