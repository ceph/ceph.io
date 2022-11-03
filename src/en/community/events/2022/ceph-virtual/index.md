---
title: Ceph Virtual 2022
date: 2022-11-03
end: 2022-11-16
location: Virtual
tags:
  - ceph days
---

## Bringing Ceph Virtual!

Ceph Virtual 2022 is a collection of live presentations from November 3-16.
Join the community for discussions around our great line-up of talks!

No registration is required. The meeting link will be provided on this event
page on November 4th. Sign up for the <a
href="https://lists.ceph.io/postorius/lists/ceph-announce.ceph.io/">Ceph
Announcement list</a> or follow Ceph on <a
href="https://twitter.com/ceph">Twitter</a> to get notified before we start
each day.

### Schedule

## Introduction 11/03

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:00
   </td>
   <td><strong>The State of the Cephalopod</strong>
   </td>
   <td>
   Multiple
   </td>
  </tr>
  <tr>
   <td>14:35
   </td>
   <td><strong>Community Update</strong>
<p>
   </td>
   <td>Mike Perez
   </td>
  </tr>
<tr>
   <td>14:50
   </td>
   <td><strong>Ceph Crash Telemetry - Observability in Action </strong>
<p>
To increase product observability and robustness, Ceph’s telemetry module allows users to automatically report anonymized crash dumps. Ceph’s telemetry backend runs tools that detect similarities among these reported crash events, then feed them to Ceph’s bug tracking system. In this session we will explore Ceph crash telemetry end-to-end, and how it helps the developer community to detect emerging and frequent issues encountered by production systems in the wild. We will share our insights so far, and learn how users benefit from this module, and how they can contribute.
   </td>
   <td>Yaarit Hatuka
   </td>
  </tr>

</table>

## Users 11/04

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:00
   </td>
   <td><strong>Operating Ceph from the Ceph Dashboard: past, present and future</strong>
   </td>
   <td>
   Nizamudeen A
   </td>
  </tr>
  <tr>
   <td>14:35
   </td>
   <td><strong>Putting the Compute in your Storage</strong>
<p>
This presentation walks through what is required to create an environment that will enable you to get started programming with librados and examines in detail its core capabilities, including key/value storage, atomic transactions, object cloning, and snapshot support. We will then explore how to extend the object interface using arbitrary code executed on the storage nodes themselves. We aim to show you how to bring your code to the data for high value, high volume, and background data-munging tasks, inverting the industry-standard path of retrieving the data and bringing it to the code. We will demo performing operations automatically on newly uploaded data, in a truly serverless fashion.
   </td>
   <td>Federico Lucifredi
   </td>
  </tr>
  <tr>
   <td>15:10
   </td>
   <td>Ceph in Scientific Computing and Large Clusters BoF
   </td>
   <td>Kevin Hrpcek
   </td>
  </tr>
</table>

## RGW 11/07

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:35
   </td>
   <td><strong>Optimizing RGW Object Storage Mixed Media through Storage Classes and Lua Scripting</strong>
<p>
Ceph enables flexible and scalable object storage of unstructured data for a wide variety of workloads. RGW (RADOS GateWay) deployments experience a wide variety of object sizes and must balance workload, cost, and performance requirements. S3 storage classes are an established way to steer data onto underlying media that meet specific resilience, cost, and performance requirements. One might for example define RGW back end storage classes for SSD or HDD media, non-redundant vs replicated vs erasure coding pools, etc. Diversion of individual objects or entire buckets into a non-default storage class usually requires specific client action. Compliance however can be awkward to request and impossible to enforce, especially in multi-tenant deployments that may include paying customers as well as internal users. This work enables the RGW back end to enforce storage class on uploaded objects based on specific criteria without requiring client actions. For example one might define a default storage class on performance TLC or Optane media for resource-intensive small S3 objects while assigning larger objects to Matt Vandermeulendense and cost-effective QLC SSD media.
   </td>
   <td>Curt Burns
<p>
Anthony D'Atri
   </td>
  </tr>
</table>

## Scale 11/08

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:00
   </td>
   <td><strong>How we operate Ceph at scale</strong>
<p>
As clusters grow in both size and quantity, operator effort should not grow at the same pace. In this talk, Matt Vandermeulen will discuss strategies and challenges for operating clusters of varying sizes in a rapidly growing environment for both RBD and object storage workloads based on DigitalOcean's experiences.
   </td>
   <td>
   Matt Vandermeulen
   </td>
  </tr>
  <tr>
   <td>15:05
   </td>
   <td><strong>Ceph and 6G: Are we ready for zettabytes?</strong>
<p>
Ceph has been a promising solution for the 5G storage requirements and the edge data center. But what's next? This talk will give the audience a brief yet comprehensive overview of the future 6G technology challenges and how Ceph should embrace itself for these challenges.
   </td>
   <td>
   Babar Khan
   </td>
  </tr>
</table>

## Crimson/Bluestore/SeaStore 11/09

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:00
   </td>
   <td><strong>What's new with Crimson and Seastore?</strong>
<p>
Next generation storage devices require a change in strategy, so the community has been developing Crimson, an eventual replacement for ceph-osd intended to minimize cpu overhead and improve throughput and latency. Seastore is a new backing store for crimson-osd targeted at emerging storage technologies including persistent memory and ZNS devices. This talk will explain recent developments in the Crimson project and Seastore.
   </td>
   <td>Samuel Just
   </td>
  </tr>
  <tr>
   <td>14:35
   </td>
   <td><strong>Understanding SeaStore through profiling</strong>
<p>
SeaStore is the new ObjectStore designed to complement Crimson OSD to support new generation of storage interfaces/technologies (NVMe, ZNS, Persistent Memory, etc). As SeaStore matures, profiling becomes increasingly critical to understand comprehensive performance impact of design choices and to set direction moving forward as the backend moves to mainstream. Profiling infrastructure will also aid new contributors understand the inner workings of SeaStore. In this session, we will talk about SeaStore support for performance profiling, optimizations made based on the initial analysis, the current status or gaps vs BlueStore along with performance data.
   </td>
   <td>Yingxin Cheng
   </td>
  </tr>
  <tr>
   <td>15:10
   </td>
   <td><strong>Accelerating PMEM Device operations in bluestore with hardware based memory offloading technique</strong>
   <p>
With more and more fast devices (especially persistent memory) equipped in data center, there is great pressure on CPU to drive those devices (e.g., Intel Optane DC persistent memory) for persistency purpose under heavy workloads. Because there is no DMA related capability provided by persistent memory compared with those hdds and SSDs.  And the same issue also exists in Ceph while using persistent memory. We would like to address such pain points by leveraging memory offloading devices (e.g.,  DSA). So generally in this talk, we will talk: 1) While persistent memory integration is not very successful in Ceph due to the high CPU overhead while performing I/O operations on persistency device; 2) We introduce the memory offloading devices (e.g., DSA) in order to offload the CPU pressure while doing I/Os; 3) We will describe the main change in pmem device (i.e., src/blk/pmemdevice.cc) and state how we can achieve the offloading including the challenges. 4) We would like to have some early performance results if Intel's SPR platform is available in public.  
   </td>
   <td>Ziye Yang
   </td>
  </tr>
</table>

## Developer 11/10

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:00
   </td>
   <td><strong>S3select: Computational Storage in S3</strong>
<p>
S3 Select is an S3 operation (introduced by Amazon in 2018) that implements a pushdown paradigm that pulls out only the data you need from an object, which can dramatically improve the performance and reduce the cost of applications that need to access data in S3. The talk will introduce s3select operation and architecture. It will describe what the pushdown technique is, why and where it is beneficial for the user. It will cover s3select supported features and their integration with analytic applications. It will discuss the main differences between columnar and non-columnar formats (CSV vs Parquet). We’ll also discuss recent developments for ceph/s3select. The presentation will show how easy it is to use ceph/s3select.
   </td>
   <td>Gal Salomon
   </td>
  </tr>
  <tr>
   <td>14:35
   </td>
   <td><strong>Optimize Ceph messenger Performance</strong>
<p>
1. The NIC SR-IOV is used. Each OSD uses an exclusive VF NIC. 2. The DPDK interrupt mode is added. 3. The single-CPU core and multiple NIC queues are implemented to improve performance. 4. The admin socket command is added to obtain the NIC status, collect statistics, and locate faults. 5. Adjust the CEPH throttling parameters, TCP, and DPDK packet sending and receiving buffer sizes to prevent packet loss and retransmission. 6. The Crimson message component uses the Seastar DPDK.
   </td>
   <td>Chunsong Feng
   </td>
  </tr>
  <tr>
   <td>15:40
   </td>
   <td><strong>RGW Zipper</strong>
<p>
RGW was developed to provide object access (S3/Swift) to a Ceph cluster. The Zipper abstraction API divides the RGW into an upper half containing the Operations (Ops) for S3 and Swift, and a lower half, called a Store, containing the details of how to store data and metadata. This allows the same Ops code to provide correct S3 and Swift semantics via a variety of storage platforms. The primary Store is the current RadosStore, which provides access to a Ceph cluster via RADOS. However, new Stores are possible that store the data in any desired platform. One such Store, called DBStore, has been developed that stores data in SQL, and specifically in a local SQLite database. Additional Stores, such as S3, are planned to provide additional flexibility. Zipper also allows intermediate Filter layers that can transform Ops, perform policy (such as directing different objects to different Stores), or perform caching for data and metadata. The first planned Filter is a LuaFilter, which will allow rapid prototyping and testing of other filters. An individual instance of RGW will consist of a stack of Filters, along with one or more Stores providing actual data. This presentation will cover information about Zipper, about the existing DBStore, and plans for the future.
   </td>
   <td>Daniel Gryniewicz
   </td>
  </tr>
</table>

## Containers 11/11

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:00
   </td>
   <td><strong>Revealing BlueStore Corruption Bugs in Containerized Ceph Clusters</strong>
<p>
Cybozu has been running and testing their Rook/Ceph clusters for two years. During this time, they have suffered from a bunch of BlueStore corruption (e.g. #51034 and #53184). Most corruptions happened just after OSD creation or on restarting OSDs. They have been able to detect these problems because the nodes in their clusters are restarted frequently and lots of OSD creation happens for each integration test. These scenarios are not so popular in traditional Ceph clusters but are common in containerized Ceph clusters. They will share what the known problems are in detail and how they have overcome these problems with the Ceph community. In addition, they will also propose improvements to the QA process to prevent similar problems in the future.
   </td>
   <td>Satoru Takeuchi
   </td>
  </tr>
  <tr>
   <td>14:35
   </td>
   <td><strong>DATA SECURITY AND STORAGE HARDENING IN ROOK AND CEPH</strong>
<p>
1. The NIC SR-IOV is used. Each OSD uses an exclusive VF NIC. 2. The DPDK interrupt mode is added. 3. The single-CPU core and multiple NIC queues are implemented to improve performance. 4. The admin socket command is added to obtain the NIC status, collect statistics, and locate faults. 5. Adjust the CEPH throttling parameters, TCP, and DPDK packet sending and receiving buffer sizes to prevent packet loss and retransmission. 6. The Crimson message component uses the Seastar DPDK.
   </td>
   <td>Federico Lucifredi
   </td>
  </tr>
</table>

## Performance 11/14

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:00
   </td>
   <td><strong>DisTRaC: Accelerating High-Performance Compute Processing for Temporary Data Storage</strong>
<p>
There is a growing desire within scientific and research communities to start using object stores to store and process their data in high performance (HPC) clusters. However, object stores are not necessarily designed for performance and are better suited for long term storage. Therefore, users often use a High-Performance File system when processing data. However, network filesystems have issues where one user could potentially thrash the network and affect the performance of everyone else's data processing jobs in the cluster. This talk presents a solution to this problem DisTRaC - (Dis)tributed (T)raisent (Ra)m (C)eph. DisTRaC offers a solution to this problem by providing a method for users to deploy Ceph onto their HPC clusters using RAM. Their intermediate data processing can now be done in RAM, taking the pressure off the networked filesystem by using the node interconnect to transfer data. In addition, all the data is localized, creating a hyper-converged HPC cluster for the duration of the job. DisTRaC reduces the I/O overhead of the networked filesystem and offers a potential data processing performance increase.
   </td>
   <td>Gabryel Mason-Williams
   </td>
  </tr>
<tr>
   <td>14:35
   </td>
   <td><strong>New workload balancer in Ceph</strong>
<p>
One of the new features in the Quincy release is the introduction of a new workload balancer (aka primary balancer). While capacity balancing exists and works well since the introduction of the upmap balancer, the issue of primary balancing in order to even the load on all the OSDs was never handled. This proves to be a performance problem, especially in small clusters and in pools with less PGs. In this presentation we will discuss the difference (and sometimes the contradiction) between capacity balancing and workload balancing, explain what we did for Quincy, and outline future plans to further improve the Ceph balancing process.
   </td>
   <td>Josh Salomon & Laura Flores
   </td>
  </tr>

</table>

## Cloud 11/16

<table>
  <tr>
   <td width="10%"><strong>Time (UTC)</strong>
   </td>
   <td width="50%"><strong>Title / Abstract</strong>
   </td>
   <td width="40"><strong>Speaker</strong>
   </td>
  </tr>
  <tr>
   <td>14:00
   </td>
   <td><strong>NVMe-over-Fabrics support for Ceph</strong>
<p>
NVMe-over-Fabrics (NVMeoF) is an open, widely adopted, defacto standard in high performance remote block storage access. More and more storage vendors are introducing NVMeoF target support, with hardware offloads both for NVMeoF targets and initiators. Ceph does not support the NVMeoF protocol for block storage access; its clients use the Ceph RADOS protocol to access RBD images for good reason: RADOS is a distributed m-to-n protocol that provides reliable object access to sharded and replicated (or erasure coded) Ceph storage. However, there are good reasons to enable NVMeoF for Ceph: to enable its use in datacenters that are already utilizing storage hardware that offload NVMeoF capabilities, and to allow existing NVMeoF storage users to easily migrate to Ceph. In this talk we present our effort to integrate a native NVMeoF target for Ceph RBD. We discuss some of the challenges of implementing such a support for Ceph including subsystem/namespace discovery, multi-pathing for fault tolerance and performance, authentication and access control (e.g., namespace masking). Furthermore, we describe how the NVMeoF target design can be extended to allow reducing additional network hops by leveraging the Ceph CRUSH algorithm (ADNN).
   </td>
   <td>Jonas Pfefferle
   </td>
  </tr>
  <tr>
   <td>14:40
   </td>
   <td><strong>Introduction to Container Object Storage Interface aka COSI for ceph RGW</strong>
<p>
For applications in Kubernetes, CSI provides a way to consume file/block storage for their workloads. The main motivation behind the Container Object Storage Interface is to provide a similar experience for Object Store. Basic idea is to provide a generic, dynamic provisioning API to consume the object store and the app pods can access the bucket in the underlying object-store like a PVC. The major challenge for this implementation there is no standard protocol defined for object and the COSI project need to be vendor agonistic. It won't handle the orchestration/management of object store, rather it will be another client and provide bucket access on behalf of applications running in Kubernetes. The initial version of the ceph-cosi driver can be found at https://github.com/ceph/ceph-cosi.
   </td>
   <td>Jiffin Tony Thottan
   </td>
  </tr>
</table>
