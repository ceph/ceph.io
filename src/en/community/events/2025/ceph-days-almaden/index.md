---
title: Ceph Days Silicon Valley 2025
date: 2025-03-25
end: 2025-03-25
location: 650 Harry Road, Coyote Valley, San Jose, CA 95120-6099
venue: IBM, Almaden Research Center, San Jose, CA
image: "/assets/bitmaps/ceph-days.png"
sponsors:
tags:
  - ceph days
---

### Bringing Ceph to Silicon Valley, California

A full-day event dedicated to sharing Ceph’s transformative power and fostering
the vibrant Ceph community with the community in Silicon Valley, California!

The expert Ceph team, Ceph’s customers and partners, and the Ceph community
join forces to discuss things like the status of the Ceph project, recent Ceph
project improvements and roadmap, and Ceph community news. The day ends with
a networking reception, to foster more Ceph learning.

## Important Dates

- **CFP Opens:** 2025-01-13
- **CFP Closes:** 2025-02-21
- **Speakers receive confirmation of acceptance:** 2025-02-28
- **Schedule Announcement:** 2025-03-07
- **Event Date:** 2025-03-25

<a class="button" href="https://linuxfoundation.regfox.com/ceph-days-sv-2025">Registration Open!</a>

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
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/Vincent Hsu.jpeg" width="400" />Vincent Hsu (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>9:10 AM
   </td>
   <td><strong>Keynote - State of Ceph</strong>
<p>
A look at the Ceph roadmap, current development priorities, and the latest activity in the Ceph community.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/02 - Keynote - State of Ceph.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/neha-ojha.jpg" width="400" />Neha Ojha (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>9:30 AM
   </td>
   <td><strong>Ceph Operations at scale</strong>
<p>
In this presentation we will go over DigitalOcean's journey with Ceph as the primary storage backend for Block and Object workloads and how we automate, monitor, alert, and operate Ceph day-to-day.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/03 - Alex - Ceph operations - Ceph days SV _25.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/Alex_Maragone.jpg" width="400" />Alex Marangone (DigitalOcean)</strong></center>
   </td>
  </tr>
  <tr>
   <td>10:00 AM
   </td>
   <td><strong>MSR(Mutli-Step Retry): An generalization of CRUSH allowing multiple OSDs per failure domain</strong>
<p>
There are use cases where one might, for example, want to spread an 8+6 erasure coded pool such that no host (or rack) has more than 4 shards.  Existing CRUSH rules struggle with this because CHOOSELEAF is the only way to allow an out OSD to be mapped to another failure domain, but CHOOSELEAF does not allow the placement of more than one OSD per failure domain.  MSR rules generalize the CRUSH algorithm to allow retrying the full sequence of selections while still respecting placement limitations.  This talk will describe the algorithm, implementation, and use cases.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/04 - Sam - 3-25-msr-cephday.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/Sam_Just.jpg" width="400" />Samuel Just (IBM)</strong></center>
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
   <td><strong>9 years of Ceph at Walmart</strong>
<p>
This talk covers the humble beginnings of Ceph at Walmart aimed to provide reliable, flexible, future-proof storage for our on-premises cloud, and how it has evolved in supporting Walmart's triplet cloud model, challenges that were uncovered operating Ceph at large scale supporting variety of use-cases ranging from latency sensitive databases, eCommerce applications, backups and others.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/05 - Pavan Anton - Walmart Ceph Days 2025 Presentation.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/Pavan Rallabhandi.jpg" width="400" />Pavan Rallabhandi (Walmart)</strong></center>
   </td>
  </tr>
  <tr>
   <td>11:30 AM
   </td>
   <td><strong>Supporting 3 Availability Zones Stretch Cluster</strong>
<p>
A Ceph cluster stretched across 3 zones faces a potential scenario where data loss can occur due to unforeseeable circumstances. An example of such a scenario is when we have 6 replicas spread across 3 datacenters with a min_size of 3 and the setup is intended to prevent I/O from happening when there is only 1 datacenter available, however, there is an edge case where a placement group (PG) becomes available due to a lack of safeguarding during the process of temporary PG mappings in order ensure data availability. This scenario poses a risk when the sole surviving data center accepts writes, and then suddenly the 2 unavailable data centers come back up. At the same time, the surviving data center suddenly goes down, which means we would have a data loss situation. To prevent such a scenario from happening, we created a solution that utilizes an existing feature in stretch mode that would restrict how we choose the OSDs that would go into the acting set of a PG. This talk will take a deep dive into how this feature is implemented in the latest Ceph upstream as well as other features that improve the user experience with stretch cluster in the latest Ceph upstream release.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/06 - Kamoltat (Junior) Sirivadhna Supporting 3 Availability Zones Stretch Cluster_.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/Kamoltat.jpg" width="400" />Kamoltat (Junior) Sirivadhna (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>12:00 PM
   </td>
   <td><strong>Zero trust data lakehouse</strong>
<p>
This talk examines the integration of Ceph with Apache Polaris, an advanced technical catalog for Apache Iceberg. Polaris introduces credential vending, where it generates session tokens for engines to use with object stores that are scoped according to catalog namespace and table policies. In doing so, table and namespace level access controls are enforced at the storage level, instead of requiring the engine itself to be a trusted policy enforcement point. We will demonstrate the integration, and explain in full detail the mechanics of how this functionality works in conjunction with Ceph’s IAM and STS capabilities.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/07 - Kyle - Ceph Day SVL.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/Bader.jpeg" width="400" />Kyle Bader (IBM)</strong></center>
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
   <td><strong>A Solid case for NVMe</strong>
<p>
How to prepare for the future by embracing NVMe and when to leave spinning disks in the past.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/08 - Jason - A_Solid_Case_for_NVMe_CephDays_SJC2025.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/Burris.jpg" width="400" />Jason Burris (Sony)</strong></center>
   </td>
  </tr>
   <tr>
   <td>2:00 PM
   </td>
   <td><strong>Cephadm at Scale for Detractors: Why it's time to reconsider containerized Ceph deployments</strong>
<p>
Let's face it: Cephadm hasn't won over everyone. Many longtime Ceph users still prefer package-based deployments with custom automation, arguing that containers add unnecessary complexity and reduce control.</p>

<p>In this talk, we'll take a cold, hard look at Cephadm: why it exists, what problems it solves (and creates), and how it compares to previous deployment tools like Ceph-deploy, Ceph-Ansible, DeepSea, and Rook. We'll look at the main concerns of Cephadm's detractors, from container overhead to troubleshooting, and discuss whether those concerns are still valid today.</p>

<p>Most importantly, we'll look at real-world results, starting with the Pawsey 100-node, 4000-OSD scale test, which proved that Cephadm is not just for toy clusters. We'll also cover the latest usability improvements and what's next for Cephadm.</p>
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/09 - Ernesto - Cephadm at Scale for Detractors.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/Ernesto.jpg" width="400" />Ernesto Puerta (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>2:30 PM
   </td>
   <td><strong>CephFS Basics & What's New</strong>
<p>
We start with a light introduction on the CephFS architecture and modern components, with a focus on newer components such as the ceph-mgr’s role in working with a CephFS filesystem. Then we move on to new features: the mgr/volume has grown to a complete solution for scalably handling internal and public cloud filesystems, and has grown new capabilities such as server-side quiescing that enables multi-client, multi-volume consistent snapshots. Filesystem protocol integration with samba and NFS-Ganesha has dramatically improved. Hear about these and other new features! With any leftover time, we will preview the development roadmap for where we hope to take CephFS in the future.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/10 - Greg - CephFS.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/GFarnum.jpeg" width="400" />Greg Farnum (IBM)</strong></center>
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
   <td><strong>Ceph Telemetry - The Why, What, and How</strong>
<p>
Whether you are a Ceph user or a developer, you have probably wondered at some point: How many Ceph clusters are out there? What Ceph versions are they running? What does their storage capacity distribution look like? Answers to these questions and more are available thanks to Ceph’s telemetry module. In this session, we will deep dive into this module and explore the value it brings to users and developers alike.
<a href="/assets/pdfs/events/2025/ceph-days-silicon-valley/11 - Yaarit - Ceph Telemetry - Ceph Day Silicon Valley 2025.pdf">slides</a>
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/yaarit.jpg" width="400" />Yaarit Hatuka (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>4:00 PM
   </td>
   <td><strong>Optimizing Ceph for Scale: Lessons from Large-Scale Operations and Performance Tuning</strong>
<p>
Ceph is a powerful, scalable storage solution, but operating it effectively at scale presents unique challenges. In this talk, I’ll share insights from years of experience managing and supporting some of the largest Ceph deployments. We’ll explore best practices for maintaining stability, ensuring high availability, and optimizing performance for demanding workloads. Key topics will include tuning Ceph for large-scale customers, troubleshooting common performance bottlenecks, and strategies for extracting the best possible performance from Ceph. Whether you’re running a growing cluster or supporting mission-critical workloads, these practical lessons will help you get the most out of your Ceph deployment.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2025/ceph-days-silicon-valley/dan-van-der-ster.jpg" width="400" />Dan van der Ster (CLYSO)</strong></center>
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
   <td>
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
