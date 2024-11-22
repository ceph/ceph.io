---
title: IBM Cephalocon Blog 2024
date: 2024-11-23
author: IBM
image: "images/ibm_logo.png"
tags:
  - ibm
  - cephalocon
---

### Industry trends:

Many clients are transforming their IT infrastructure to enterprise platforms
because their mission critical applications are demanding a cloud native
experience on premises with the following:

- Web scale
- On-demand consumption
- Scalable elastic infrastructure
- Platform-as-a-Service
- Containers & Bare Metal
- API on everything
- Multi-protocol storage services (block, file, object)

### Client requirements:

As IT leaders build out their enterprise platforms, they have the following
requirements for the underlying enterprise storage platform:

- Multiprotocol: deliver block, file and object from a single software platform
- Software-defined: software solution that runs on commodity servers
- Modular scalability: modular design that can scale up and down without
  disruption
- Intelligent security: automatic protection, detection, and recovery from
  threats
- Uniform control: Common unified control plane with standard APIs
- API-driven: REST APIs to fully automate management tasks

### Ceph capabilities:

Clients have issued vendor requests for proposals (RFP) for enterprise storage
platforms and evaluated the responses. IT leaders have learned that only Ceph
can meet their requirements for multiprotocol, software-defined enterprise
storage platforms. None of the other alternatives can deliver all three
protocols (block-NVMeoF, file-NFS,SMB and object-S3) from a single
software-defined platform.

Clients that have implemented enterprise storage platforms on Ceph have
reported 50% lower total cost of ownership (TCO) and 67% faster deployment
times.

### IBM client examples:

A global IBM client was struggling with their legacy HDFS environment due to
the tight coupling of compute and storage along with limits around scalability,
erasure coding support, hardware alternatives and security. The client replaced
HDFS with IBM Storage Ceph with open-source S3A interface, erasure coding,
encryption at rest and inflight all running on open compute style hardware of
their choice. The client had a parallel effort to modernize their analytics
environment so IBM Storage Ceph support for Iceberg, Parquet, Trino and Apache
Spark was also a benefit. In the end, the transition from HDFS to IBM Storage
Ceph reduced their TCO by 50%.

Another government agency IBM client was seeking to modernize their legacy
infrastructure and applications with a new enterprise storage platform. The
client was struggling with a legacy storage platform that was difficult to
expand, difficult to secure, difficult to manage and expensive to maintain. As
the client containerized their cloud applications that serve 35 million users,
they needed S3 object storage to store large amounts of unstructured data. The
client turned to IBM Storage Ceph as their new enterprise storage platform. The
open standard S3 APIs made it much easier to onboard new applications and
services ultimately reducing deployment times by 67%.

A third global IBM client is planning to eventually migrate all their workloads
to NVMe over TCP starting with their block workloads running on VMware. The
client wants to move away from proprietary initiators that lock them in and
toward more open alternatives where they have the flexibility to change vendors
and improve business agility. The client also wants to significantly improve
the security compared to legacy block solutions by using mutual challenge
handshake authentication protocol (CHAP), transport layer security (TLS)
inflight encryption, and host IP tables. The improved agility and security
along with lower TCO are the compelling reasons this client is building an
enterprise storage platform with IBM Storage Ceph.

### Conclusion:

IBM employees and clients continue to make large contributions to the Ceph
community to help mature the technology to maintain Ceph as the leading
enterprise storage platform. Please join us in the community.
