---
title: Ceph Days London 2025
date: 2025-06-04
end: 2025-06-04
location: London, United Kingdom
venue: IBM UK, York Road
image: "/assets/bitmaps/ceph-days.png"
sponsors:
tags:
  - ceph days
---

### Bringing Ceph to London yet again

A full-day event dedicated to sharing Ceph’s transformative power and fostering
the vibrant Ceph community with the community in London!

The expert Ceph team, Ceph’s customers and partners, and the Ceph community
join forces to discuss things like the status of the Ceph project, recent Ceph
project improvements and roadmap, and Ceph community news. The day ends with
a networking reception, to foster more Ceph learning.

## Important Dates

- **CFP Opens:** 2025-03-17
- **CFP Closes:** 2025-04-20
- **Speakers receive confirmation of acceptance:** 2025-04-25
- **Schedule Announcement:** 2025-05-05
- **Event Date:** 2025-06-04

Registration is Open! (Closing on 2025-06-02)

<a class="button" href="https://ti.to/open-source-events/ceph-days-london-2025">Registration</a>

<br />

## Schedule

<table>
  <tr>
   <td width="10%">Time
   </td>
   <td width="50%">Abstract
   </td>
   <td width="40%"><center>Speaker</center>
   </td>
  </tr>
  <tr>
   <td>8:00 AM
   </td>
   <td><strong>Check-in and Breakfast</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>9:00 AM
   </td>
   <td><strong>Welcome</strong>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Phil Williams.jpg" width="400" />Phil Williams (Canonical)</strong></center>
   </td>
  </tr>
  <tr>
   <td>9:10 AM
   </td>
   <td><strong>Keynote - State of Ceph</strong>
<p>
A look at the Ceph roadmap, current development priorities, and the latest activity in the Ceph community.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/neha-ojha.jpg" width="400" />Neha Ojha (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>9:40 AM
   </td>
   <td><strong>The Circular Migration Trick: Repurposing Ceph's Cloud-S3 Module for Internal Bucket Transfers</strong>
<p>
Introducing a novel approach addressing one of Ceph's RGW limitations: no support for direct data movement between buckets within the same cluster. By creatively repurposing the cloud-s3 module - originally designed for external cloud migrations - we create a self-syncing system that enables bucket-to-bucket transfers via lifecycle processing. This technique effectively creates a circular migration path within a single cluster while providing flexible storage class capabilities to reduce space consumption. All without requiring modifications to Ceph's core functionality or any third party tools.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/LaimisJuzeliunas.jpg" width="400" />Laimis Juzeliūnas (Oxylabs)</strong></center>
   </td>
  </tr>
  <tr>
   <td>10:00 AM
   </td>
   <td><strong>Erasure Coding Enhancements for Tentacle</strong>
<p>
A preview of the new erasure coding features in the upcoming Tentacle release, covering what the benefits are for block, file and object workloads and best practice advice.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Bill Scales.jpg" width="400" />Bill Scales (IBM)
   <br>
    <img src="/assets/bitmaps/events/2025/ceph-days-london/Alex Ainscow.jpg" width="400" />Alex Ainscow (IBM)</strong></center>
   </td>
  </tr>
    <tr>
   <td>10:30 AM
   </td>
   <td><strong>Tea/Coffee Break</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>11:00 AM
   </td>
   <td><strong>Lightning Talk (LT): Cephalautopsy - When Erasure Coding Goes Wrong</strong>
<p>
The work to improve erasure coding has produced two new tools for checking consistency in erasure code pools for Ceph. One useful progression for these tools is to improve them to identify which shard on which OSD has caused the consistency check to fail. This talk will show some off a proof of concept for this tool, some of the techniques used to identify where the failure was identified, and information about how this tool can be used on real Ceph clusters when it's ready.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Jamie Pryde.jpg" width="400" />Jamie Pryde (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>11:10 AM
   </td>
   <td><strong>Lightning Talk (LT): Learning opportunities from an 100PB, 8 year old Ceph clusterr</strong>
<p>
As our largest cluster 'Echo' approaches it's 9th year of storing scientific data for the LHC experiments, we reflect on the ups, downs, and interesting technical details of keeping a larger-than-normal Ceph cluster running for nearly a decade.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Tom Byrne.png" width="400" />Tom Byrne (UKRI)</strong></center>
   </td>
  </tr>
  <tr>
   <td>11:20 AM
   </td>
   <td><strong>Lightning Talk (LT): Ceph Benchmarking - an update on CBT's vision</strong>
<p>
The vision for CBT is a universal easy to use tool for the Ceph community to benchmark their clusters in a single click way with the goal of crowdsourcing performance data within the community. This lightning talk is sharing on the progress we have made and what is next for CBT.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Lee Sanders.jpg" width="400" />Lee Sanders (IBM)</strong></center>
   </td>
  </tr>
  <tr>
     <td>11:30 AM
   </td>
   <td><strong>Multi-Cluster and Protocol Visibility with the New Ceph Dashboard</strong>
<p>
As Ceph deployments scale across data centers, clouds, and protocols, the need for a powerful, unified dashboard becomes critical. In this talk, we’ll introduce the Tentacle release of the Ceph Dashboard—a major leap in usability, observability, and control.
<p>
We’ll walk through new features including multi-cluster support, RGW tiering and rate limiting, multi-site automation, and protocol dashboards for SMB, NFS, and CephFS. With a fresh Carbon-based UI and advanced monitoring for NVMe, CephFS and SMB, the new dashboard brings everything together lots of new operations.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Ankush Behl.jpg" width="400" />Ankush Behl (IBM)</strong></center>
   </td>
  </tr>
  <tr>
     <td>12:00 PM
   </td>
   <td><strong>Ceph on ARM: The Next Tentacle</strong>
<p>
Ceph support for the ARM architecture has been fragmentary, with limited investment both upstream and downstream. IBM and Ampere are changing this, with the results of years of effort starting to bear fruit this year. 
<p>
Join us for a review of what has been done so far, what remains to be achieved for parity with x86, and an open discussion of the state of the art and the challenges that remain ahead. We bring interesting announcements, and we are interested in feedback — what would you use Ceph on ARM for?
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Federico Mugshot.jpg" width="400" />Federico Lucifredi (IBM)
   <br>
   <img src="/assets/bitmaps/events/2025/ceph-days-london/Peter Pouliot.jpeg" width="400" />Peter Pouliot (Ampere)</strong></center>
   </td>
  </tr>
   <tr>
   <td>12:30 PM
   </td>
   <td><strong>Lunch</strong>
   </td>
   <td>
   </td>
  </tr>
   <tr>
   <td>1:30 PM
   </td>
   <td><strong>Disaster Recovery User Story</strong>
<p>
For this Ceph day in London, I would like to present a talk discussing a major CephFS outage we experienced for our backup system and the disaster recovery steps we took in order to recover the filesystem and return the cluster to service. After being in service for a year, we suffered a catastrophic failure of the filesystem that resulted in the filesystem being offline and the MDSes being unable to leave replay and enter the active state. My talk would comprise of how the outage presented itself, how we investigated the error, the tools we used to investigate and ultimately resolve the issue, and the subsequent preventative measures we’ve taken where hopefully this talk will encourage further discussion amongst the attendees to share their own disaster recovery experiences.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/clayson_ivan.jpg" width="400" />Ivan Clayson (MRC Laboratory of Molecular Biology)</strong></center>
   </td>
  </tr>
   <tr>
   <td>2:00 PM
   </td>
   <td><strong>NVMeoF in Ceph - What's New and What's Next</strong>
<p>
Ceph's NVMe over Fabrics (NVMeoF) support, introduced in the Tentacle release, marks a significant step forward in the project's scalability and performance. This session will explore the key features supported in the Tentacle release, including enhancements for NVMeoF, and provide an overview of the ongoing development of new features. Topics will include the upcoming Stretch cluster support, Virtual Volumes (vVols), reservations, the cancel command, and more. Join us for an in-depth discussion of Ceph’s NVMeoF future and how it is evolving to meet the growing demands of modern storage environments.</p>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Aviv Caro.jpg" width="400" />Aviv Caro (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>2:30 PM
   </td>
   <td><strong>Lightning Talk (LT): Optimising Erasure Coding: The testing that makes us confident</strong>
<p>
An overview of the test tooling we developed for Erasure Coding, why it was developed, how it works and what specifically it tests. This talk will give an insight into the test tooling created and used during the development process.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/JonathanBaileyHeadshot.jpeg" width="400" />Jonathan Bailey (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>2:40 PM
   </td>
   <td><strong>Lightning Talk (LT): 56 weeks later: becoming a jack of all trades</strong>
<p>
Opensource and Ceph in particular have provided me with an invaluable empirical technical growing experience. In this my first year in the project, I summarise the opportunities to tackle the challenges: from writing my own automating testing infrastructure to generate performance test reports, to contributing to existing github projects, and creating my own. From learning and applying new programming languages, to deploy containers. I am very grateful to the Ceph community that encourages our technical grow and expertise in a constructive environment.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/CDL_JJPP_IBM.jpeg" width="400" />Jose J Palacios-Perez (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>2:50 PM
   </td>
   <td><strong>Lightning Talk (LT): Whats new in MicroCeph?</strong>
<p>
MicroCeph is the quickest and easiest way to deploy a Ceph cluster. Its an opinionated solution to provide single commands for deployment and management of a Ceph cluster.
<p>
This LT will give an update on the new funtionaility added to MicroCeph in the last year, API driven RBD-Mirror support, support for QAT, and more.  It will also discuss where people are using it and whats coming next for MicroCeph.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Phil Williams.jpg" width="400" />Phil Williams (Canonical)</strong></center>
   </td>
  </tr>
  <tr>
   <td>3:00 PM
   </td>
   <td><strong>Snack Break</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>3:30 PM
   </td>
    <td><strong>Zero trust data lakehouse</strong>
<p>
This talk examines the integration of Ceph with Apache Polaris, an advanced technical catalog for Apache Iceberg. Polaris introduces credential vending, where it generates session tokens for engines to use with object stores that are scoped according to catalog namespace and table policies. In doing so, table and namespace level access controls are enforced at the storage level, instead of requiring the engine itself to be a trusted policy enforcement point. We will demonstrate live the integration, and explain in full detail the mechanics of how this functionality works in conjunction with Ceph’s IAM and STS capabilities.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Daniel Parkes.jpg" width="400" />Daniel Parkes (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>4:00 PM
   </td>
   <td><strong>Ceph-SMB: Opening Windows to the Ceph world</strong>
<p>
Ceph-SMB provides a managed SMB support to Ceph allowing Microsoft Windows clients to mount Cephfs volumes. We look at how we can use the SMB manager module to deploy and manage SMB shares using the imperative and declarative methods. We then connect to these newly created shares using Windows and Linux clients. We also take a peak under the hood to look at the underlying services run to make this happen.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-london/Sachin Prabhu.jpeg" width="400" />Sachin Prabhu (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>4:30 PM
   </td>
   <td><strong>Closing Panel and Remarks</strong>
   </td>
   <td><center><strong>All Speakers</strong></center>
   </td>
  </tr>
  <tr>
   <td>5:00 PM
   </td>
   <td><strong>Networking Reception</strong>
   </td>
  </tr>
   <td>6:00 PM
   </td>
   <td><strong>Event Close</strong>
   </td>
   <td>
   </td>
  </tr>
 
</table>
