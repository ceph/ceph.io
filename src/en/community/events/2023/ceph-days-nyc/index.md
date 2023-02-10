---
title: Ceph Days NYC
date: 2023-02-21
end: 2023-02-21
location: 120 Park Ave, New York, NY 10165
venue: Bloomberg
image: "/assets/bitmaps/events/2023/ceph-days-nyc/banner.png"
sponsors:
  - label: Platinum
    list:
      - name: Bloomberg
        logo: "/assets/bitmaps/logo-bloomberg.png"
        website: "https://bloomberg.com"
tags:
  - ceph days
---

## Bringing Ceph to NYC!

Come find out why leading enterprises are adopting Ceph, why Ceph is the lowest cost per gig storage solution, and how easy it is to deploy your own Ceph cluster!

### Event description

A full-day event dedicated to sharing Ceph’s transformative power and fostering the vibrant Ceph community.

The expert Ceph team, Ceph’s customers and partners, and the Ceph community join forces to discuss things like the status of the Ceph project, recent Ceph project improvements and roadmap, and Ceph community news. The day ends with a networking reception, to foster more Ceph learning.

Space is limited, so register soon.

<a class="button" href="https://go.bloomberg.com/attend/invite/ceph-days-nyc">Register</a>

Join the Ceph announcement list, or follow Ceph on social media for updates:

- [Ceph Announcement list](https://lists.ceph.io/postorius/lists/ceph-announce.ceph.io/)
- [Twitter](https://twitter.com/ceph)
- [LinkedIn](https://www.linkedin.com/company/ceph/)
- [FaceBook](https://www.facebook.com/cephstorage/)

## Important Dates:

- CFP Opens: 2022-12-01
- CFP Closes: 2023-01-01
- Speakers receive confirmation of acceptance: 2023-01-16
- Schedule Announcement: 2023-01-23
- Event Date: 2023-02-21

## Schedule

<table>
  <tr>
   <td width="10%">Time
   </td>
   <td width="50%">Abstract
   </td>
   <td width="40%">Speaker
   </td>
  </tr>
  <tr>
   <td>9:00 AM
   </td>
   <td><strong>Welcoming</strong>
   </td>
   <td><center><strong>Bloomberg</strong></center>
   </td>
  </tr>
  <tr>
   <td>9:15 AM
   </td>
   <td><strong>State of the Cephalopod</strong>
<p>
In this talk, we'll provide an update on the state of the Ceph upstream project, recent development efforts, current priorities, and community initiatives. We will share details of features released across components in the latest Ceph release, Quincy and explain how this release is different from previous Ceph releases. The talk will also provide a sneak peek into features being planned for the next Ceph release, Reef.
   </td>
   <td><center><strong>Neha Ojha & Josh Durgin</strong><br />
   IBM</center>
   </td>
  </tr>
  <tr>
   <td>9:45 AM
   </td>
   <td><strong>NVMe-over-Fabrics support for Ceph</strong>
<p>
NVMe-over-Fabrics (NVMeoF) is a widely adopted, defacto standard in remote block storage access. Ceph clients use the RADOS protocol to access RBD images but there are good reasons to enable access via NVMeoF: to allow existing NVMeoF storage users to easily migrate to Ceph and to enable the use of NVMeoF offloading hardware. This talk presents our effort to provide native NVMeoF support for Ceph. We discuss some of the challenges including multi-pathing for fault tolerance and performance.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/jonas-pfefferle.jpg"><br /><strong>Jonas Pfefferle</strong><br />
   IBM Research</center>
   </td>
  </tr>
  <tr>
   <td>10:15 AM
   </td>
   <td><strong>Ceph crossing the chasm</strong>
<p>
The new generation of hybrid cloud provides a common platform across all your cloud, on-premises, and edge environments. That means you can skill once, build once and manage from a single pane of glass. That also implies platform needs to support diverse workloads and different level of maturity in management skills. In this presentation, we will cover the open source projects and proposals to enhance Ceph's consumability and manageability to enable Ceph in more environments.
   </td>
   <td><center><strong>Vincent Hsu</strong>
   IBM</center>
   </td>
  </tr>
  <tr>
   <td>10:45 AM
   </td>
   <td>Break
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>11:00 AM
   </td>
   <td>
<strong>100 Years of Sports on Ceph</strong>
<p>
Working together with a major American sports league we built a multi-site 40
PB active archive housing over 100 years of game video and audio assets by
using Ceph as the foundational storage technology. Along the way learned many
lessons about architecting, deploying, and operationalizing Ceph from the
vantage point of a large, modern and rapidly growing media company. We would
like to share our experience and learnings with the community to help others
traveling a similar road.
   </td>
   <td>
<center><strong>Frank Yang<br /><br />& Adam Waters</strong><br />Platina</center>
   </td>
  </tr>
  <tr>
   <td>11:30 AM
   </td>
   <td><strong>Ceph Telemetry - Observability in Action</strong>
<p>
To increase product observability and robustness, Ceph’s telemetry module allows users to automatically report anonymized data about their clusters. Ceph’s telemetry backend runs tools that analyze this data to help developers understand how Ceph is used and what problems users may be experiencing. In this session we will overview the various aspects of Ceph’s upstream telemetry and its benefits for users, and explore how telemetry can be deployed independently as a tool for fleet observability.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/yaarit-hatuka.jpg"><br /><strong>Yaarit Hatuka</strong><br />
   IBM</center>
   </td>
  </tr>
  <tr>
   <td>12:00 PM
   </td>
   <td>Lunch
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>1:00 PM
   </td>
   <td><strong>Why We Built A “Message-Driven Telemetry System At Scale” Ceph Cluster</strong>
<p>
Ceph’s Prometheus module provides performance counter metrics via the ceph-mgr component. While this works well for smaller installations, it can be problematic to put metric workloads into ceph-mgr at scale. Ceph is just one component of our internal S3 product. We also need to gather telemetry data about space, objects per bucket, buckets per tenancy, etc., as well as telemetry from a software-defined distributed quality of service (QoS) system which is not natively supported by Ceph.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/nathan-hoad.png"><br /><strong>Nathan Hoad</strong><br />
   Bloomberg</center>
   </td>
  </tr>
  <tr>
   <td>1:30 PM
   </td>
   <td><strong>Introducing Sibench: A New Open Source Benchmarking Tool Optimized for Ceph</strong>
<p>
Benchmarking Ceph has always been a complex task - there are lots of tools but many have drawbacks and are written for more general-purpose use. For Ceph we need to benchmark Librados, RBD, CephFS, and RGW and each of these protocols has unique challenges and typical deployment scenarios. Not only that, Ceph works better at scale and so we need to ensure that we can build a benchmarking system that will also scale and be able to generate an adequate load at large scale.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/danny-abukalam.jpg"><br /><strong>Danny Abukalam</strong><br />
   SoftIron</center>
   </td>
  </tr>
  <tr>
   <td>2:00 PM
   </td>
   <td><strong>Optimizing RGW Object Storage Mixed Media through Storage Classes and Lua Scripting</strong>
<p>
Ceph enables flexible and scalable object storage of unstructured data for a wide variety of workloads. RGW (RADOS GateWay) deployments experience a wide variety of object sizes and must balance workload, cost, and performance requirements. S3 storage classes are an established way to steer data onto underlying media that meet specific resilience, cost, and performance requirements. One might for example define RGW back end storage classes for SSD or HDD media, non-redundant vs replicated vs erasure coding pools, etc. Diversion of individual objects or entire buckets into a non-default storage class usually requires specific client action. Compliance however can be awkward to request and impossible to enforce, especially in multi-tenant deployments that may include paying customers as well as internal users. This work enables the RGW back end to enforce storage class on uploaded objects based on specific criteria without requiring client actions. For example one might define a default storage class on performance TLC or Optane media for resource-intensive small S3 objects while assigning larger objects to and cost-effective QLC SSD media.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/anthony-datri.jpg"><br /><strong>Anthony D'Atri</strong></center>
   </td>
  </tr>
  <tr>
   <td>2:30 PM
   </td>
   <td><strong>Ceph at CERN: A Ten-Year Retrospective</strong>
<p>
In 2013, the data storage team at CERN began investigating Ceph to solve an emerging problem: how to provide reliable, flexible, future-proof storage for our growing on-premises OpenStack cloud. Beginning with a humble 3PB cluster, the infrastructure has grown to support the entire lab, with 50PB of storage across multiple data centres used across a variety of use-cases ranging from basic IT apps, databases, HPC, cloud storage, and others.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/dan-van-der-ster.jpg"><br /><strong>Dan van der Ster</strong><br />
   CERN</center>
   </td>
  </tr>
  <tr>
   <td>3:00 PM
   </td>
   <td><strong>Break</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>3:15 PM
   </td>
   <td><strong>An Introduction to MicroCeph</strong>
   </td>
   Building up a Ceph cluster can be a bit tricky and time consuming, especially if it’s just for testing or a small home lab. To make this much easier, we’ve started working on microceph.  It's a snap package that uses a small management daemon that allows for very easy clustering of multiple systems which, combined with an easy bootstrap process, allows for setting up a Ceph cluster in just a few minutes!
   </td>
   <td>
   <center><strong>Chris MacNaughton</strong><br />
   Canonical</center>
   </td>
  </tr>
  <tr>
   <td>3:30 PM
   </td>
   <td><strong>SQL on Ceph</strong>
<p>
Ceph was originally designed to fill a need for a distributed file system within scientific computing environments but has since grown to become a dominant **unified** software-defined distribute storage system. This talk will cover the new development of an SQLite Virtual File System (VFS) on top of Ceph's distributed object store (RADOS). I will show how SQL can now be run on Ceph for both its internal use and for new application storage requirements.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/patrick-donnelly.jpg"><br /><strong>Patrick Donnelly</strong><br />
   IBM</center>
   </td>
  </tr>
  <tr>
   <td>4:00 PM
   </td>
   <td><strong>Data Security and Storage Hardening in Rook and Ceph</strong>
<p>
We explore the security model exposed by Rook with Ceph, the leading software-defined storage platform of the Open Source world. Digging increasingly deeper in the stack, we examine hardening options for Ceph storage appropriate for a variety of threat profiles.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/federico-lucifredi.jpg"><img src="/assets/bitmaps/events/2023/ceph-days-nyc/sage-mctaggart.png"><br /><strong>Federico Lucifredi & Sage McTaggart</strong><br />
   IBM</center>
   </td>
  </tr>
  <tr>
   <td>4:30 PM
   </td>
   <td><strong>Dynamic multi-cluster management with Rook for cloud native IaaS providers for the private clouds.</strong>
<p>
Over the last few years, we have been gaining experience with Rook in production. One of our challenges was to implement dynamic resource management between 50+ Ceph clusters. Kubernetes events dynamically and fully automatically distribute loads and capacity between Ceph clusters. This is done by removing single or multiple Ceph nodes from Ceph clusters while ensuring data integrity at all times. In the next step, the released Ceph nodes are integrated into other Ceph clusters as needed.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-nyc/joachim-kraftmayer.jpg"><br /><strong>Joachim Kraftmayer</strong><br />
   Clyso</center>
   </td>
  </tr>
</table>

<table>
  <tr>
   <td>5:00 PM
   </td>
   <td>Evening Event
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
</table>
