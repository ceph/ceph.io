---
title: Ceph Days Korea
date: 2023-06-14
end: 2023-06-14
location: aT Center, 27 Gangnam-daero, Seocho-gu, Seoul, South Korea
venue: aT 센터
image: "/assets/bitmaps/ceph-days.png"
sponsors:
  - label: Platinum
    list:
      - name: Samsung Electronics
        logo: "/assets/bitmaps/logo-samsung.png"
        website: "https://semiconductor.samsung.com/"
      - name: Seagate
        logo: "/assets/bitmaps/logo-seagate.png"
        website: "https://seagate.com/kr/ko/"
      - name: IBM
        logo: "/assets/bitmaps/logo-ibm.png"
        website: "https://ibm.com/kr-ko/"

tags:
  - ceph days
---

### Save the Date - Ceph is coming to Korea!

<a class="button" href="https://festa.io/events/3215">Register</a>

A full-day event dedicated to sharing Ceph’s transformative power and fostering
the vibrant Ceph community in South Korea.

The expert Ceph team, Ceph’s customers and partners, and the Ceph community
join forces to discuss things like the status of the Ceph project, recent Ceph
project improvements and roadmap, and Ceph community news. The day ends with
a networking reception, to foster more Ceph learning.

## Important Dates

- CFP Opens: 2023-02-24
- CFP Closes: 2023-04-28
- Speakers receive confirmation of acceptance: 2023-05-12
- Schedule Announcement: 2023-05-16
- Sponsorship Deadline: 2023-04-28
- Event Date: 2023-06-14

## Schedule

<table>
  <tr>
   <td width="10%"><strong>Time</strong>
   </td>
   <td width="50%"><strong>Abstract</strong>
   </td>
   <td width="40%"><center><strong>Speaker</strong></center>
   </td>
  </tr>
  <tr>
   <td>9:00
   </td>
   <td><strong>Opening</strong>
   </td>
   <td><center><strong>Committee members</strong></center>
   </td>
  </tr>
  <tr>
   <td>9:10
   </td>
   <td><strong>Keynote: TBD</strong>
   </td>
   <td><center>Samsung Electronics</center>
   </td>
  </tr>
  <tr>
   <td>9:45
   </td>
   <td><strong>Keynote: TBD</strong>
   </td>
   <td><center>Seagate</center>
   </td>
  </tr>
  <tr>
   <td>10:20
   </td>
   <td><strong>Keynote: IBM and IBM Storage Ceph's Future</strong>
     <p>Congratulations on becoming a member of a family in the open source community, and I would like to talk about Ceph's plan through synergy with IBM.</p>
   </td>
   <td><center><strong>Jin su Kim</strong><br />IBM Korea</center>
   </td>
  </tr>
  <tr>
   <td>10:45
   </td>
   <td><strong>Break</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>11:00
   </td>
   <td><strong>Distributed storage system architecture and Ceph’s strength</strong>
     <p>From local storage systems to regular NAS, explore the reliability structurally and discuss considerations from a distributed system perspective. Finally, talk about the advantages and disadvantages of Ceph and what workloads are useful.</p>
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-korea/myoungwon-oh.jpg" height="150"><strong>Myoungwon Oh</strong><br />Samsung</center>
   </td>
  </tr>
  <tr>
   <td>11:40
   </td>
   <td><strong>Role of RocksDB in Ceph</strong>
     <p>In Ceph, RocksDB is used by default as a Metadata store for stored objects. However, this is not limited to providing critical features for top-tier applications such as RadosGW and MDS, and has a critical impact on performance. Surprisingly, however, many people tend to think of RocksDB as a black box and not pay attention to it. While looking at the internal logic of Ceph and RocksDB, I would like to look at the impact of RocksDB and introduce some points to note.</p>
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-korea/ilsoo-byun.jpg" height="150"><strong>Ilsoo Byun</strong><br />LINE</center>
   </td>
  </tr>
  <tr>
   <td>12:10
   </td>
   <td><strong>Lunch</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>13:40
   </td>
   <td><strong>Ceph case study and large-scale cluster operation plan in NAVER</strong>
     <p>In this pressentation, we will look at NAVER's case study of Ceph and how to operate storage. We would like to explain the problems and solutions that we struggled with when introducing Ceph and provide useful information for companies that want to adopt Ceph.</p>
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-korea/jangseon-ryu.jpg" height="150"><strong>Jangseon Ryu and Hyun Ha</strong><br />NAVER</center>
   </td>
  </tr>
  <tr>
   <td>14:20
   </td>
   <td><strong>A New MDS Partitioning for CephFS</strong>
     <p>This talk will present a new MDS partitioning strategy for CephFS that combines static pinning and dynamic partitioning with the bal_rank_mask option based on user metadata workload analysis. We will also share our experiences with the implementation of these optimizations in our production service and the results of our experiments. Finally, we will discuss how we can contribute our work to the Ceph community.</p>
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-korea/yongseok-oh.jpg" height="150"><strong>Yongseok Oh</strong><br />LINE</center>
   </td>
  </tr>
  <tr>
   <td>14:50
   </td>
   <td><strong>Break</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>15:10
   </td>
   <td><strong>Revisiting S3 features on Ceph Rados</strong>
     <p>In this presentation, we will first explore the S3 API execution path from a client to the Ceph Object Storage Daemon (OSD). It will cover how RGW translates S3 requests into internal Rados requests and how OSD stores S3 objects and metadata in the case of Bluestore. Second, we will analyze S3 performance with and without versioning-related features on three different S3-compatible storage platforms: Ceph, MinIO, and OpenStack Swift with Swift3. We conducted a synthetic benchmark to measure S3 performance, especially ListObject performance, while considering versioning-related features.</p>
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-korea/kyujin-cho.jpg" height="150"><strong>Kyujin Cho</strong><br />Seoul National Univ.</center>
   </td>
  </tr>
  <tr>
   <td>15:50
   </td>
   <td><strong>Technical discussion</strong>
   </td>
   <td><center><strong>All attendees</strong></center>
   </td>
  </tr>
  <tr>
   <td>16:40
   </td>
   <td><strong>Networking session</strong>
   </td>
   <td><center><strong>All attendees</strong></center>
   </td>
  </tr>
  <tr>
   <td>17:10
   </td>
   <td><strong>Closing</strong>
   </td>
   <td><center><strong>Committee members</strong></center>
   </td>
  </tr>
</table>

Join the Ceph announcement list, or follow Ceph on social media for Ceph event
updates:

- [Ceph Announcement list](https://lists.ceph.io/postorius/lists/ceph-announce.ceph.io/)
- [Twitter](https://twitter.com/ceph)
- [LinkedIn](https://www.linkedin.com/company/ceph/)
- [FaceBook Ceph Korea Group](https://www.facebook.com/groups/cephkr)
- [FaceBook](https://www.facebook.com/cephstorage/)
