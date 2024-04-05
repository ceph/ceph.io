---
title: Ceph Days NYC 2024
date: 2024-04-26
end: 2024-04-26
location: Convene, 75 Rockefeller Plaza, New York, NY, 10019
image: "/assets/bitmaps/events/2024/ceph-days-nyc/banner.png"
sponsors:
  - label: Hosted by
    list:
      - name: Bloomberg
        logo: /assets/bitmaps/logo-bloomberg.png
  - label:
    list:
      - name: CLYSO
        logo: /assets/bitmaps/logo-clyso.png
tags:
  - ceph days
---

### Bringing Ceph to New York City

Come find out why leading enterprises are adopting Ceph, why Ceph is the lowest cost per gig storage solution, and how easy it is to deploy your own Ceph cluster!

This event is proudly hosted by Bloomberg and CLYSO.

#### What to Expect

A full-day event dedicated to sharing Ceph’s transformative power and fostering the vibrant Ceph community.

The expert Ceph team, Ceph’s customers and partners, and the Ceph community join forces to discuss things like the status of the Ceph project, recent Ceph project improvements and roadmap, and Ceph community news. The day ends with a networking reception, to foster more Ceph learning.

Space is limited, so register soon!

## Important Dates

Based on popular demand, we've extended the CFP deadline by one week.  Get your proposals in folks!

- **CFP Opens:** 2024-03-07
- **CFP Closes:** 2024-04-02
- **CFP Acceptance Notifications:** 2024-04-05
- **Schedule Announcement:** 2024-04-10
- **Event Date:** 2024-04-26

<br />

<a class="button" href="https://www.eventbrite.com/e/ceph-day-new-york-tickets-848746643057">Register to attend!</a>

## Hotel Recommendations

- [Andaz 5th Avenue](https://www.hyatt.com/en-US/hotel/new-york/andaz-5th-avenue/nycam)
- [Hyatt Grand Central](https://www.hyatt.com/en-US/hotel/new-york/hyatt-grand-central-new-york/nycgh)
- [Library Hotel](https://libraryhotel.com/)
- [The Westin New York Grand Central](https://www.marriott.com/en-us/hotels/nyczw-the-westin-new-york-grand-central)
- [The Kitano Hotel New Yorl](https://www.kitano.com/)

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
   <td>9:00 AM
   </td>
   <td><strong>Welcome</strong>
   </td>
   <td><center><strong>Matt Leonard (Bloomberg)<br />Dan van der Ster (CLYSO)</strong></center>
   </td>
  </tr>
  <tr>
   <td>9:05 AM
   </td>
   <td><strong>Diving Deep with Squid</strong>
<p>
A look at the newest Ceph release, current development priorities, and the latest activity in the Ceph community.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2024/ceph-days-nyc/josh-durgin.png">Josh Durgin (IBM)<img src="/assets/bitmaps/events/2024/ceph-days-nyc/neha-ojha.jpg">Neha Ojha (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>09:30 AM
   </td>
   <td><strong>Designing and Tuning for All-Flash Ceph RBD Storage</strong>
<p>
OpenStack cloud providers and operators. Ceph RBD integrates well with Cinder services and provides very reliable, highly performant block storage. Unfortunately, while Ceph RBD clusters are easy to get up and going, extracting the maximum possible performance from all-flash Ceph RBD clusters is a bit of a black art.

A cursory online search might suggest that one use specific RocksDB settings, place multiple OSDs on each NVMe, or even set some unusual sysctls. However, when tested, we found that most of these suggestions found online are either ineffective, actually degrade performance, or are no longer applicable to recent versions of Ceph. On the other hand, much of the tuning we have found to be effective was only discovered by the community at large more recently, or has yet to be fully realized.

In this talk, we will go over some tips and tricks that have worked well for us in designing and configuring performant RBD clusters using modern versions of Ceph, as well as future possible code changes we believe will extract even more performance out of flash-backed OSDs.
   </td>
   <td><center><img src="/assets/bitmaps/events/2024/ceph-days-nyc/tyler-stachecki.jpg"><strong>Tyler Stachecki (Bloomberg)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>9:55 AM
   </td>
   <td><strong>Ceph: A Journey to 1 TiB/s</strong>
<p>
This talk will cover the trials and joys of transforming an HDD based Ceph cluster to a high performance NVMe deployment and the level of performance we were able to achieve during testing.  We'll cover hardware choices we made, how we ran tests, and how we tackled bottlenecks and bugs.
   </td>
   <td><center><img src="/assets/bitmaps/events/2024/ceph-days-nyc/mark-nelson.jpg"><strong>Mark Nelson (CLYSO)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>10:20 AM
   </td>
   <td>Break
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>10:45 AM
   </td>
   <td><strong>Designing a multitenancy file system for cloud environment</strong>
<p>
In the dynamic landscape of cloud technology, creating multitenant file systems to meet industry-specific needs presents a unique set of challenges. This talk details a project by 45Drives, aimed at developing a multitenant filesystem for a Fortune 100 client within the Media & Entertainment industry. The project faced considerable design challenges, primarily due to the traditional file systems' lack of inherent multitenancy and the client's requirement for a filesystem workflow accessible via SMB or NFS over object storage.

To overcome these hurdles, the 45Drives team employed RADOS Namespaces & Cephx Keyrings for effective data segregation among tenants in a single cluster, and virtualized NFS/SMB gateways to separate storage protocols for each tenant. The solution was further enhanced by integrating advanced automation and deployment tools, including Proxmox, Ansible, Terraform, and Cloud-init. A notable requirement was the use of Self-Encrypting Drives (SEDs), necessitating the development of custom software to unlock drives on boot, as dmcrypt proved unsuitable from customers perspecrive.

An unexpected requirement for network micro-segmentation to meet the client's security standards introduced additional complexity towards the project's completion. Nevertheless, the project succeeded in delivering scalable performance results. Future directions include efforts to automate the scaling of Multi Daemon Servers (MDS) and the transition from Virtual Machines on Proxmox to Containers on Kubernetes, aiming to enhance efficiency and flexibility in cloud infrastructure deployments.
This presentation will share insights from the experience of navigating the complexities of developing a multitenant filesystem for the Media & Entertainment industry, reflecting on both the achieved outcomes and prospective future improvements in cloud infrastructure.
</td>
   <td><center><strong>Mitch Hall & Brett Kelly (45 Drives)</strong></center>
   </td>
  </tr>
  <tr>
   <td>11:10 AM
   </td>
   <td><strong>Community Initiatives: Improving Ceph through User Feedback</strong>
<p>
We launched the creation of the Ceph User Council in March 2024. We want to leverage this workgroup to focus on Ceph users' experience and provide consistent and strcutured  feedback to Ceph technical team. For this presentation, we want to give an update of the council and raise the aware of this initiative.

Additionally, the Ceph Foundation Board would like to capture feedback from the Ceph user community by means of a recurring series of meetings called the Ceph User Dev Community Meeting.

The overarching goal of these meetings is to elicit feedback from the users, companies, and organizations who use Ceph in their production environments. This feedback will be collected and combined to form broad themes of pain points, issues, missing features etc.

While we expect most of the feedback to be constructive, sharing what you like about the project, what strengths you see, and what things you wish the project to continue to do are also valuable. This feedback will be anonymized, organized, and shared with the Ceph Leadership Team (CLT) with the goal of providing feedback to the developer community to incorporate invaluable insight from real Ceph users on how the project is used in the wild.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2024/ceph-days-nyc/laura-flores.jpg">Laura Flores (IBM)<img src="/assets/bitmaps/events/2024/ceph-days-nyc/vincent-hsu.jpg">Vincent Hsu (IBM)<img src="/assets/bitmaps/events/2024/ceph-days-nyc/neha-ojha.jpg">Neha Ojha (IBM)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>11:35 AM
   </td>
   <td><strong>Practical Business Ceph Examples</strong>
<p>
ISS has run Ceph operations in business settings for 10 years with great success.  Alex will present several use cases for midrange datacenter use: Proxmox VMs, SAN replacement, Backup, Kubernetes CSI, S3, RHEL/Pacemaker, NFS.
   </td>
   <td><center><img src="/assets/bitmaps/events/2024/ceph-days-nyc/alex-gorbachev.jpg"><strong>Alex Gorbachev (ISS)</strong>
   </center>
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
   <td><strong>NVMe-Over-Fabrics Support for Ceph</strong>
<p>
With the introduction of NVMe drives, data center and cloud workloads alike have benefitted from their increase performance, durability and parallelism. Combine these qualities with the scale and agility of Ceph block storage, leveraging existing networks as transport, and you've got a recipe for cost-effective success at scale, with a high level of reliability and redundancy. Come explore what NVMe over Fabrics and specifically NVMe over TCP looks like, and how it can optimize not only your storage, but your budget as well!
</td>
   <td><center><strong>Mike Burkhart (IBM)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>1:25 PM
   </td>
   <td><strong>Ceph Data Placement with Upmap / Introducing Chorus: A Swiss-Army Knife Frontend for S3</strong>
<p>
Ceph data placement is a simple yet nuanced subject. Using it's secret sauce "CRUSH", Ceph empowers organizations to easily implement complex data placement policies in a way which maximizes the reliability of the storage infrastructure. However CRUSH is not perfect -- imbalances lead to costly space inefficiencies. To fix this, Ceph introduce the upmap balancer several releases ago. But the internal mechanism upmap created a new opportunity in Ceph -- arbitrary data placement to enable new and extremely powerful cluster maintenance operations.

In this talk, Dan will describe "how it works" internally, and present practical easy to use tools to make the lives of Ceph operators better.

One more thing... Dan will conclude with an introduction of Chorus, a Swiss-Army Knife frontend for S3.
   </td>
   <td><center><img src="/assets/bitmaps/events/2024/ceph-days-nyc/dan-van-der-ster.jpg"><strong>Dan van der Ster (CLYSO)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>1:50 PM
   </td>
   <td><strong>Making RBD snapshot based mirroring robust for disaster recovery scenarios</strong>
<p>
The feature to mirror RADOS block device (RBD) images across clusters by asynchronous replication of RBD snapshots was introduced a few years ago. It's been recently integrated into the disaster recovery (DR) solution for container workloads backed by RBD in OpenShift kubernetes environment. The integration and testing of the DR solution uncovered bugs and helped identify missing pieces in snapshot based mirroring. Bug fixes and enhancements have been made to librbd and kernel RBD clients, and in the ceph-mgr service that schedules mirror snapshots. There is still a lot of scope for improvement here. This talk will give an overview of the current state of RBD snapshot based mirroring, its usage in Openshift's Ceph storage disaster recovery solution, and the planned improvements for the feature. Folks interested in using RBD mirroring for their disaster recovery solutions will find this talk especially useful.
   </td>
   <td><center><img src="/assets/bitmaps/events/2024/ceph-days-nyc/ramana-raja.jpg"><strong>Ramana Raja (IBM)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>2:15 PM
   </td>
   <td><strong>Data Security and Storage Hardening in Rook and Ceph</strong>
<p>
We explore the security model exposed by Rook with Ceph, the leading software-defined storage platform of the Open Source world. Digging increasingly deeper in the stack, we examine options for hardening Ceph storage that are appropriate for a variety of threat profiles.
   </td>
   <td><center><strong><img src="/assets/bitmaps/events/2024/ceph-days-nyc/federico-lucifredi.jpg">Federico Lucifredi (IBM)<img src="/assets/bitmaps/events/2024/ceph-days-nyc/sage-mctaggart.png">Sage McTaggart (IBM)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>2:40 PM
   </td>
   <td>Break
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>3:05 PM
   </td>
   <td><strong>How we Operate Ceph at Scale</strong>
<p>
As clusters grow in both size and quantity, operator effort should not grow at the same pace. In this talk, Matt Vandermeulen will discuss strategies and challenges for operating clusters of varying sizes in a rapidly growing environment for both RBD and object storage workloads based on DigitalOcean's experiences.
   <td>
   <center><img src="/assets/bitmaps/events/2024/ceph-days-nyc/matt-vandermeulen.jpg"><strong>Matt Vandermeulen (Digital Ocean)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>3:30 PM
   </td>
   <td><strong>Attempting to Improve Discard Performance</strong>
<p>
While digging into RBD performance issues, it was observed that some fragmented OSDs were struggling to keep up with their normal performance, and they were struggling with their internal discard mechanism. Enabling discards in Ceph helped, but it still falls behind, as discards were single threaded. In this lightning talk, we'll discuss what DigitalOcean observed, and how we approached solutions by making discards multi-threaded, as well as limitations of certain nameless drives.
   </td>
   <td><center><img src="/assets/bitmaps/events/2024/ceph-days-nyc/matt-vandermeulen.jpg"><strong>Matt Vandermeulen (Digital Ocean)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>3:40 PM
   </td>
   <td><strong>MicroCeph from Development to Solutions</strong>
<p>
In this talk, we will discuss MicroCeph and explore the various use cases for providing quick and simple Ceph storage - from the developer workstation, to CI systems, to edge computing and the data center.
   </td>
   <td><center><strong>Billy Olsen (Canonical)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>4:05 PM
   </td>
   <td><strong>Chill out - Apache Iceberg and Ceph</strong>
<p>
Ceph object storage is a popular substrate for data lakes due to its scalability, rich S3 dialect, and ability to run on industry standard hardware. The first generation of organizations using Ceph based data lakes primarily leveraged Hive tables. Working with practitioners we saw the Hadoop S3A filesystem grow to maturity. Modern data lake and lakehouse architectures have been trending towards open table formats like Apache Iceberg. In this session we will dig into the design goals of Iceberg tables, the influence of object storage, and cover best practices for using Iceberg tables with Ceph based data lakes.
   </td>
   <td><center><strong>Kyle Bader (IBM)</strong>
   </center>
   </td>
  </tr>
  <tr>
   <td>4:30 PM
   </td>
   <td><strong>Panel Discussion</strong>
   </td>
   <td><center><strong>All Speakers</strong>
   </td>
  </tr>
  <tr>
   <td>4:55 PM
   </td>
   <td><strong>Closing Remarks</strong>
   </td>
   <td><center><strong>Matt Leonard (Bloomberg)<br />Dan van der Ster (CLYSO)</strong></center>
   </td>
  </tr>
  <tr>
   <td>5:00 PM
   </td>
   <td>Evening Reception
   </td>
   <td>
   </td>
  </tr>
</table>
