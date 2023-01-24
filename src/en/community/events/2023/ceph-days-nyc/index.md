---
title: Ceph Days NYC
date: 2023-02-21
end: 2023-02-21
location: 120 Park Ave, New York, NY 10165
venue: Bloomberg
image: "/assets/bitmaps/ceph-days.png"
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
   <td>Welcoming
   </td>
   <td>Bloomberg
   </td>
  </tr>
  <tr>
   <td>9:15 AM
   </td>
   <td><strong>State of the Cephalopod</strong>
<p>
In this talk, we'll provide an update on the state of the Ceph upstream project, recent development efforts, current priorities, and community initiatives. We will share details of features released across components in the latest Ceph release, Quincy and explain how this release is different from previous Ceph releases. The talk will also provide a sneak peek into features being planned for the next Ceph release, Reef.
   </td>
   <td>Neha Ojha & Josh Durgin<br />
   IBM
   </td>
  </tr>
  <tr>
   <td>9:45 AM
   </td>
   <td><strong>NVMe-over-Fabrics support for Ceph</strong>
<p>
NVMe-over-Fabrics (NVMeoF) is a widely adopted, defacto standard in remote block storage access. Ceph clients use the RADOS protocol to access RBD images but there are good reasons to enable access via NVMeoF: to allow existing NVMeoF storage users to easily migrate to Ceph and to enable the use of NVMeoF offloading hardware. This talk presents our effort to provide native NVMeoF support for Ceph. We discuss some of the challenges including multi-pathing for fault tolerance and performance.
   </td>
   <td><img src="/assests/bitmaps/events/2023/ceph-days-nyc/jonas-pfefferle.jpg"><br />Jonas Pfefferle<br />
   IBM Research
   </td>
  </tr>
  <tr>
   <td>10:15 AM
   </td>
   <td><strong>Ceph crossing the chasm</strong>
<p>
The new generation of hybrid cloud provides a common platform across all your cloud, on-premises, and edge environments. That means you can skill once, build once and manage from a single pane of glass. That also implies platform needs to support diverse workloads and different level of maturity in management skills. In this presentation, we will cover the open source projects and proposals to enhance Ceph's consumability and manageability to enable Ceph in more environments.
   </td>
   <td>Vincent Hsu<br />
   IBM
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
   <td><strong>TBD</strong>
   <td>
   </td>
  </tr>
  <tr>
   <td>11:00 AM
   </td>
   <td><strong>Ceph Telemetry - Observability in Action</strong>
<p>
To increase product observability and robustness, Ceph’s telemetry module allows users to automatically report anonymized data about their clusters. Ceph’s telemetry backend runs tools that analyze this data to help developers understand how Ceph is used and what problems users may be experiencing. In this session we will overview the various aspects of Ceph’s upstream telemetry and its benefits for users, and explore how telemetry can be deployed independently as a tool for fleet observability.
   </td>
   <td><img src="/assests/bitmaps/events/2023/ceph-days-nyc/nathan-hoad.jpg"><br />Yaarit Hatuka<br />
   IBM
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
   <td><img src="/assests/bitmaps/events/2023/ceph-days-nyc/nathan-hoad.jpg"><br />Nathan Hoad<br />
   Bloomberg
   </td>
  </tr>
  <tr>
   <td>1:30 PM
   </td>
   <td><strong>Introducing Sibench: A New Open Source Benchmarking Optimized for Ceph</strong>
<p>
Benchmarking Ceph has always been a complex task - there are lots of tools but many have drawbacks and are written for more general-purpose use. For Ceph we need to benchmark Librados, RBD, CephFS, and RGW and each of these protocols has unique challenges and typical deployment scenarios. Not only that, Ceph works better at scale and so we need to ensure that we can build a benchmarking system that will also scale and be able to generate an adequate load at large scale.
   </td>
   <td><img src="/assests/bitmaps/events/2023/ceph-days-nyc/danny-abukalam.jpg"><br />Danny Abukalam<br />
   SoftIron
   </td>
  </tr>
  <tr>
   <td>2:00 PM
   </td>
   <td><strong>Introducing the new RBD image encryption feature</strong>
<p>
We present a new encryption capability in librbd that was initially introduced in the Ceph Pacific release. This feature allows users to secure their RBD images by setting per-image passphrases, which will be used to unlock a new data-at-rest encryption layer. Greater flexibility, ease-of-use, new functionality and minimal performance overhead are the main advantages of this feature over alternatives of using external encryption components, such as dm-crypt and qemu LUKS.
   </td>
   <td><img src="/assests/bitmaps/events/2023/ceph-days-nyc/danny-harnik.jpg">Danny Harnik<br />
   IBM Research
   </td>
  </tr>
  <tr>
   <td>2:30 PM
   </td>
   <td><strong>Ceph at CERN: A Ten-Year Retrospective</strong>
<p>
In 2013, the data storage team at CERN began investigating Ceph to solve an emerging problem: how to provide reliable, flexible, future-proof storage for our growing on-premises OpenStack cloud. Beginning with a humble 3PB cluster, the infrastructure has grown to support the entire lab, with 50PB of storage across multiple data centres used across a variety of use-cases ranging from basic IT apps, databases, HPC, cloud storage, and others.
   </td>
   <td>Dan van der Ster
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
   <td><strong>Lightning Talks</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>3:30PM
   </td>
   <td><strong>SQL on Ceph</strong>
<p>
Ceph was originally designed to fill a need for a distributed file system within scientific computing environments but has since grown to become a dominant **unified** software-defined distribute storage system. This talk will cover the new development of an SQLite Virtual File System (VFS) on top of Ceph's distributed object store (RADOS). I will show how SQL can now be run on Ceph for both its internal use and for new application storage requirements.
   </td>
   <td><img src="/assests/bitmaps/events/2023/ceph-days-nyc/patrick-donnelly.jpg"><br />Patrick Donnelly<br />
   IBM
   </td>
  </tr>
  <tr>
   <td>4:00 PM
   </td>
   <td><strong>Data Security and Storage Hardening in Rook and Ceph</strong>
<p>
We explore the security model exposed by Rook with Ceph, the leading software-defined storage platform of the Open Source world. Digging increasingly deeper in the stack, we examine hardening options for Ceph storage appropriate for a variety of threat profiles.
   </td>
   <td><img src="/assests/bitmaps/events/2023/ceph-days-nyc/federico-lucifredi.jpg"><img src="/assests/bitmaps/events/2023/ceph-days-nyc/ana-mctaggart.png">Federico Lucifredi & Ana McTaggart<br />
   IBM
   </td>
  </tr>
  <tr>
   <td>4:30
   </td>
   <td><strong>Dynamic multi-cluster management with Rook for cloud native IaaS providers for the private clouds.</strong>
<p>
Over the last few years, we have been gaining experience with Rook in production. One of our challenges was to implement dynamic resource management between 50+ Ceph clusters. Kubernetes events dynamically and fully automatically distribute loads and capacity between Ceph clusters. This is done by removing single or multiple Ceph nodes from Ceph clusters while ensuring data integrity at all times. In the next step, the released Ceph nodes are integrated into other Ceph clusters as needed.
   </td>
   <td><img src="/assests/bitmaps/events/2023/ceph-days-nyc/joachim-kraftmayer.jpg"><br />Joachim Kraftmayer<br />
   Clyso
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
