---
title: Ceph Days Asia 2024
date: 2024-09-03
end: 2024-09-04
location: 140 Gwanggyojungang-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do, Republic of Korea
venue: Room 202, Suwon Convention Center
image: "/assets/bitmaps/ceph-days.png"
sponsors:
  - label: Hosted by
    list:
      - name: Samsung
        logo: /assets/bitmaps/logo-samsung.png

tags:
  - ceph days
---

### Bringing Ceph to OpenInfra Summit Asia

A full-day event dedicated to sharing Ceph’s transformative power and fostering
the vibrant Ceph community co-located at <a href="https://2024.openinfraasia.org/">
OpenInfra Summit Asia</a> in South Korea.

This event is hosted by the Ceph community and Samsung.

The expert Ceph team, Ceph’s customers and partners, and the Ceph community
join forces to discuss things like the status of the Ceph project, recent Ceph
project improvements and roadmap, and Ceph community news. The day ends with
a networking reception, to foster more Ceph learning.

<a class="button" href="https://2024.openinfraasia.org">Register now!</a>

## Important Dates

- CFP Opens: 2024-05-27
- CFP Closes: 2024-07-12
- Speakers receive confirmation of acceptance: 2024-07-19
- Schedule Announcement: 2024-07-24
- Event Date: 2024-09-03 ~ 2024-09-04
  <br />

## Schedule

### Sep 3rd (Tue)

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
   <td>2:00 PM
   </td>
   <td><strong>State of the Cephalopod</strong>
<p>
An update from the leaders of the Ceph project about recent developments, current priorities, and other activity in the Ceph community, including what's new in the latest Squid release, and what is coming up for the next major release, Tentacle.
   </td>
   <td><center><strong>Josh Durgin (IBM)</strong></center>
   </td>
  </tr>
  <tr>
   <td>2:45 PM
   </td>
   <td><strong>Is Rook Ceph good for Large Scale S3 storage?</strong>
<p>
In this talk, we will explore Rook, its strengths, and how it compares to Cephadm. 
We'll address the question, "Is Rook a good fit for you?" by examining its deployment in large-scale production environments and its integration with existing clusters.

We will discuss benchmarking and optimizing your Rook cluster for production, along with monitoring and troubleshooting strategies. Additionally, we will look at potential future improvements in Rook Ceph.

This session offers a concise overview of our journey from zero to a fully operational Rook Ceph cluster, sharing key learnings and insights along the way.

   </td>
   <td><center><strong>Deepika Upadhyay, Joachim Kraftmayer (Clyso GmBH)</strong></center>
   </td>
  </tr>
  <tr>
   <td>3:30 PM
   </td>
   <td><strong>NVMe-oF recovery: Robust Ceph design through disaggregating domains</strong>
<p>
In this talk, we will explore NVMe-oF Recovery, which enables fast recovery through NVMe-oF-based storage disaggregation. In large-scale distributed storage systems, compute node failures are common. These failures may trigger unexpected I/Os to restore system availability. NVMe-oF offers an opportunity to disaggregate compute and storage resources, reducing the impact of such failures. However, Ceph's Converged Architecture tightly couples compute and storage resources, so a compute failure brings storage down as well. This forces the storage to undergo recovery, even if it's still usable. To overcome this, we will introduce NVMe-oF Recovery, a solution that ensures fast recovery by separating compute and storage failure domains within the CRUSH Map, while maintaining the reliability and scalability of traditional systems.
   </td>
   <td><center><strong>Cheolho Kang, Myoungwon Oh (Samsung Electronics)</strong></center>
   </td>
  </tr>
  <tr>
   <td>4:15 PM
   </td>
   <td><strong>Ceph with Arrow: How object gateway can accelerate querying data</strong>
<p>
Data processing large amount of data on traditional storage comsumes large amount resources. Offloading computation to object storage provides several benefits to users. This session briefly intoduce typical data processing, what is Apache Arrow and how it can help users with Ceph.
   </td>
   <td><center><strong>Jinkyu Yi (Korea Ceph User Group)</strong></center>
   </td>
	</tr>
  <tr>
   <td>5:00 PM
   </td>
   <td><strong>Data Security and Storage Hardening in Rook and Ceph</strong>
<p>
Sage is a security analyst at Red Hat, focusing on storage security, both for containers and for distributed systems. They did a master's degree at UCSC, and have an undergraduate degree in math and computer science from Umass Amherst. In their free time, they enjoy hiking with their dog.
   </td>
   <td><center><strong>Federico Lucifredi, Sage McTaggart (IBM)</strong></center>
   </td>
	</tr>
</table>
<br />

### Sep 4th (Wed)

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
   <td>11:40 AM<br/>(@Convention Hall)
   </td>
   <td><strong>Ceph at 20 Years! Still the Best Choice for Modern Data Storage</strong>
<p>
This talk will explore why Ceph is the best software-defined storage solution available. By examining its technical evolution from 2004 until now, we will highlight the key points that demonstrate its leadership over today's alternatives.
   </td>
   <td><center><strong>Dan van der Ster (CLYSO)</strong></center>
   </td>
  </tr>
  <tr>
   <td>2:00 PM
   </td>
   <td><strong>MicroCeph: Flexible Ceph Orchestration</strong>
<p>
Deploying and operating a Ceph cluster is complex because Ceph is designed to be a general-purpose storage solution. MicroCeph is an open source Ceph orchestration tool which makes it easy to deploy a Ceph on a single node and scale it to a highly available cluster as needed. This reduces the barrier of entry and makes Ceph more accessible to everyone but specially to the new users for training. For operations, MicroCeph makes configuration, scaling CRUSH, spawning services across cluster even easier. The intention of this talk would be to introduce MicroCeph to the viewers and promote the practices it employs for Ceph.
   </td>
   <td><center><strong>Utkarsh Bhatt (Canonical)</strong></center>
   </td>
  </tr>
  <tr>
   <td>2:45 PM
   </td>
   <td><strong>On Deploying Ceph Clusters</strong>
<p>
Ceph is a distributed software-defined storage with scalability, delivering block, file and object in one unified system. It has been used in Cloud Stacks such as OpenStack and Kubernetes. We have been using Ceph clusters for VM image store, Kubernetes Persistent Volumes, NFS servers, iSCSI.

In this talk, we will present how to deploy a new version of a Ceph cluster in four different environments

- New deployment with Internet Connection
- Upgrade from an old version
- New deployment in an air-gapped environment
- Upgrade from an old version of a Ceph in an air-gapped environment
   </td>
   <td><center><strong>DaeGon Kim (CORESPEQ INC)</strong></center>
   </td>
  </tr>
  <tr>
   <td>3:40 PM
   </td>
   <td><strong>Performance experiments and usage tips about RGW object listing</strong>
<p>
The object store provided by RGW has a weakness in that the object listing time increases depending on the number of objects. We share the results and analysis of the performance experiment conducted to prepare a countermeasure to this weakness. And we also share the derived tips for use.
   </td>
   <td><center><strong>GeunYeong Bak (KT NexR)</strong></center>
   </td>
  </tr>
  <tr>
   <td>4:25 PM
   <td><strong>Scrub / Deep-scrub analysis</strong>
<p>
- Ceph의 데이터 정합성을 체크하기 위한 scrub, deep-scrub 집중적으로 분석<br />
- 대부분 scrub / deep-scrub 은 default 로 사용 가능하지만, 대용량과 파일 수가 많은 경우 수행 지연으로 인해 정상적인 운영이 어려운 경우 분석<br />
- scrub / deep-scrub 처리 과정을 이해하고 상황과 환경에 따라 어떻게 하면 보다 효율적으로 운영할 수 있는지에 대한 연구 결과 및 실적용 아이디어를 공유
   </td>
   <td><center><strong>Jaemin Joo, YongBok Eum, Soonyong Jung (Samsung SDS)</strong></center>
   </td>
	</tr>
</table>

You can find the schedule for OpenInfra Summit Asia, including Ceph Days Asia, at the following page.
<a href="https://2024.openinfraasia.org/a/schedule">OpenInfra Summit Asia Schedule</a>

<br />

Join the Ceph announcement list, or follow Ceph on social media for Ceph event
updates:

- [Ceph Announcement list](https://lists.ceph.io/postorius/lists/ceph-announce.ceph.io/)
- [X](https://x.com/ceph)
- [LinkedIn](https://www.linkedin.com/company/ceph/)
- [FaceBook Ceph Korea Group](https://www.facebook.com/groups/cephkr)
- [FaceBook](https://www.facebook.com/cephstorage/)
