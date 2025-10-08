---
title: "Benchmarking the Ceph Object Gateway: A Deep Dive into Secure, Scalable Object Storage Performance. Part 1"
date: "2025-09-17"
author: "Daniel Alexander Parkes, Anthony D'Atri"
categories: "rgw"
image: "images/blueoctopus.jpg"
tags:
  - "ceph"
  - "rgw"
  - "s3"
  - "benchmarking"
---

## Introduction: Why Performance Matters for Secure Object Storage

Organizations today are challenged not only with managing massive volumes of
data — often in the tens of petabytes — but also with the responsibility of
securing that data across hybrid and multicloud environments. Object storage
systems (especially Ceph) provide the scalability and flexibility required to
meet these challenges, offering S3-compatible access, native redundancy, and
a growing set of enterprise features.

As encryption in transit and at rest is configured and layered with Ceph Object
Gateway (RGW) deployments, it becomes essential to understand their impact on
latency, throughput, and resource utilization.

This blog series presents the results of a comprehensive performance benchmarking
effort conducted by the IBM Storage Ceph Performance and Interoperability team.
Special thanks to Jay Rajput for leading the execution of test cases and data
collection. Our evaluation focuses on how real-world workloads interact with
different configurations of encryption, data protection, and horizontal scaling,
offering practical insights for architects, administrators, and developers alike.

## Hardware and Software Setup

We tested on a production-grade Ceph cluster, deployed with collocated RGW, OSD,
Monitor, Manager, and Ingress services.

### Hardware Specifications

| **Component** | **Role(s)** | **Quantity** | **CPU** | **RAM** | **Storage** |
| --- | --- | --- | --- | --- | --- |
| Dell R760 | Monitor, Manager, OSD, RGW, Ingress | 12 | 2× Intel Xeon Gold 6438N (64 threads) | 512 GB | 24 × 3.84 TB NVMe |
| Dell R660 | Benchmarking Clients, Monitoring | 13 | 2× Intel Xeon Gold 5418Y (48 threads) | 384 GB | 2 × 3.84 TB NVMe |

Each test cluster configuration (4-node, 8-node, and 12-node) maintained consistent
OSD density (24 per node) and 4 RGW daemons per node, with dedicated VIPs for
Ingress-based load balancing.

| **Ceph Cluster Setup** | **Details** |
| --- | --- |
| **Cluster Size** | 4 node, 8 node, 12 node |
| **Total OSD Counts** | 96, 192, 288 |
| **OSDs** | 24 per node |
| **RGWs** | 4 per node |
| **Ingress** | 1 VIP per node |
| **RGW data pool** | Replica 3, EC 2+2, 4+2, 8+3 |
| **PG Replica Count per OSD** | ~400 |
| **Collocated Ceph Daemons** | Monitor, Manager, OSD, RGW, Ingress |
| **Object Count per bucket shard** | Default: 100K |

### Software version matrix

| **Component** | **Version / Notes** |
| --- | --- |
| **Ceph** | 19.2.0-52 |
| **Elbencho** | 3.0-26 (benchmarking tool) |
| **HashiCorp Vault** | 1.19.1 (for SSE key management) |
| **Prometheus + Grafana** | Monitoring stack |
| **RHEL** | 9.5 with BIOS profile set to “performance” |

### Ceph Cluster Configuration

| **Ceph Cluster Config** | **Value** |
| --- | --- |
| **Scrubs/Deep-scrubs** | Disabled |
| **Ceph Balancer** | Disabled |
| **Progress Module** | Disabled |
| **PG Autoscaler** | Disabled |
| **OSDMAP\_FLAGS** | Muted |
| **Dynamic Bucket Re-sharding** | Disabled |

### PG counts

| **Cluster Size** | **OSD Count** | **Target PG replicas per OSD** | **Pool Type** | **PG Count (Index / Data pool)** |
| --- | --- | --- | --- | --- |
| 4 Node | 96 | 400 | EC 2+2 / Replicated | 512 / 8192 |
| 8 Node | 192 | 400 | EC 2+2 | 1024 / 32768 |
| 8 Node | 192 | 400 | EC 4+2 | 1024 / 16384 |
| 8 Node | 192 | 400 | EC 8+3 | 1024 / 8192 |
| 12 Node | 288 | 400 | EC 2+2 | 1024 / 32768 |
| 12 Node | 288 | 400 | EC 4+2 | 1024 / 16384 |
| 12 Node | 288 | 400 | EC 8+3 | 1024 / 8192 |

### **Network Architecture & Hardware Connectivity**

To complement the compute/storage setup, our network underpins the cluster's
high-throughput performance:

* Leaf–Spine topology: We’re running a 100 GE leaf–spine network with one
  spine (QFX5120) and three leaf switches (QFX5120), enabling a scalable,
  low-latency design. This offers port density now and a future upgrade
  path (e.g., adding a true spine and repurposing the current one) without
  impacting performance.
    
* Dual 100 Gbps uplinks per server via LACP: Each Ceph node utilizes two 100 GE
  ports on a single NIC, bonded using LACP, to connect to both leaf switches
  for redundancy and link aggregation.
    
* Per-node limit: Each Ceph storage node is equipped with Intel NICs that support
  a maximum aggregate throughput of 100 Gbps, even though two ports are available
  and bonded via LACP. This means that per-node throughput is capped at ~12.5 GB/s
  in optimal conditions.
    
* Cluster-wide switching capacity: Our leaf–spine topology, built with one QFX5120
  spine and three QFX5120 leaf switches, provides full line-rate connectivity
  across all twelve storage nodes. Each leaf connects to four nodes and uplinks
  to the spine at 100 Gbps. This results in a total cluster theoretical switching
  capacity of ~150 GB/s. In our large-object benchmarks, the system achieved an
  aggregate throughput of ~111 GB/s, demonstrating that we were reaching the
  physical network ceiling, particularly for large object read-intensive workloads.
    

**Test Methodology**

We designed our performance evaluation to answer foundational questions regarding how
to deploy the Ceph Object Gateway (RGW) for both performance and security:

* What’s the impact of TLS (SSL) on RGW throughput and latency?
    
* How much overhead does server-side encryption (SSE-S3/KMS) introduce?
    
* Does securing internal daemon communication (msgr v2) affect CPU utilization?
    
* How do EC profiles (2+2, 4+2, 8+3) compare to 3x replication?
    
* What are the performance implications of using HAProxy-based ingress vs direct access?
    
* How does performance scale with node count and concurrency?
    

Each test case was repeated across PUT and GET workloads with varying object
sizes, ranging from 64 KiB to 1 GiB. Elbencho was used in client-server mode
with thread counts of 128 (except for SSE testis that used 64 threads), running
up to eight concurrent clients. Each Elbencho client uses an individual bucket.
Buckets were created in advance, using the default sharding count of eleven shards
per bucket.  Multipart upload was used for objects larger than 1 GiB.

| **Payload Size** | **Workload Category** | **Representative of** |
| --- | --- | --- |
| ≤ 64KB | Small object | Thumbnails, telemetry, and small metadata files |
| 1MB | Medium object | Documents, emails, attachments |
| ≥ 32MB | Large object | Backups, HD media, ML datasets |

## **Executive Summary**

IBM Storage Ceph demonstrates exceptional performance and flexibility when
deployed on cutting-edge, all-flash infrastructure with 100 GE networking,
such as the [IBM Storage Ceph Ready Nodes.](https://community.ibm.com/community/user/blogs/sayalee-raut/2025/01/23/ibm-storage-ready-nodes-a-brief-overview)
As enterprises scale to billions of objects and multi-petabyte workloads, Ceph's
ability to handle diverse data patterns, from high IOPS, low-latency,
metadata-heavy workloads to high-throughput, bandwidth-intensive workloads,
becomes critical.

### **Large Object Workloads (Throughput Focus)**

For objects exceeding 32 MiB, the cluster achieved near-linear scaling up to
twelve storage nodes, peaking at an aggregate PUT throughput of 65 GiB/s and an
aggregate GET throughput of ~115 GiB/s. Beyond these points, 100 GE NIC saturation
on individual nodes became the primary bottleneck. This suggests that future
benchmark testing will benefit from higher-bandwidth NICs, as large object
workloads still have room to achieve higher throughput results from the
current node's available resources. Please note the distinction between the
sum of a NIC's nominal port speeds and the bandwidth that it can handle when
more than one port is in use, as the latter may be smaller than the former on
multiport NICs.

For large objects, fully in-transit secured configurations (TLS + msgr v2)
maintained high throughput with reasonable overhead, demonstrating that Ceph
Object Gateway (RGW) is well-suited for secure data pipelines at scale. There
is room for performance improvement when also enabling server-side encryption (SSE)
to provide object encryption at rest.

### **Small Object Workloads (IOPS & Latency Focus)**

Small object tests (6i4 KB) demonstrated Ceph Object Gateway (RGW)’s ability to
scale IOPS with increasing concurrency and cluster size efficiently. With 64 KiB
objects, the system achieved up to 391K GET IOPS and 86K PUT IOPS on a twelve-node
cluster using erasure coding.

To unlock optimal performance for small-object workloads, especially under high
concurrency, it's essential to deploy on infrastructure with robust CPU capacity
and generous RGW threading, enabling the Ceph Object Gateway to leverage its
parallel processing capabilities fully.

## **What’s Next**

This post introduces the testbed, methodology, and highlights key results. In
the upcoming posts of this series, we’ll delve into each performance axis,
exploring the impact of TLS and SSE on RGW throughput, scaling behaviors
with erasure coding versus replication, how concurrency and daemon density
affect latency, and more. You’ll see detailed graphs and architectural guidance
drawn directly from production-grade testing. Whether you’re building secure
object storage for AI pipelines, backups, or multi-tenant cloud services, stay
tuned, there’s much more to uncover.

Read Part 2 [here](https://ceph.io/en/news/blog/2025/benchmarking-object-part2/).

The authors would like to thank IBM for supporting the community with our time to create these posts.
