---
title: Ceph Days India 2024
date: 2024-05-31
end: 2024-05-31
location: Bengaluru, Karnataka
venue: Hilton Bengaluru Embassy Manyata Business Park, Block A, Hotel Building, 1, Outer Ring Rd, MS Ramaiah North City, Nagavara
image: "/assets/bitmaps/ceph-days.png"
sponsors:
  - label:
    list:
      - name: Clyso
        logo: /assets/bitmaps/logo-clyso.png
  - label:
    list:
      - name: IBM
tags:
  - ceph days
---

### Bringing Ceph to India

<a class="button" href="https://konfhub.com/cephdaysindia2024">Registration Open!</a>

A full-day event dedicated to sharing Ceph’s transformative power and fostering
the vibrant Ceph community with the community in India!

The expert Ceph team, Ceph’s customers and partners, and the Ceph community
join forces to discuss things like the status of the Ceph project, recent Ceph
project improvements and roadmap, and Ceph community news. The day ends with
a networking reception, to foster more Ceph learning.

The CFP is closed and registration is limited!

## Important Dates

- **CFP Opens:** 2024-04-01
- **CFP Closes:** 2024-04-30
- **Speakers receive confirmation of acceptance:** 2024-05-06
- **Schedule Announcement:** 2024-05-08
- **Event Date:** 2024-05-31

<br />



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
   <td>9:15
   </td>
   <td><strong>Registration</strong>
   </td>
  </tr>
    <tr>
   <td>10:00
   </td>
   <td><strong>Welcome & Keynote</strong>
   </td>
  </tr>
  <tr>
   <td>10:25
   </td>
   <td><strong>Introduction to NVMeOF in Ceph</strong>
   </td>
   <td><strong>Manohar M</strong>
<p>
IBM
   </td>
  </tr>  
  <tr>
   <td>10:50
   </td>
   <td><strong>Exploring Ceph RGW scalability: Synchronizing a billion objects across a multisite.</strong>
<p>
In this talk, we would investigate the scalability of Ceph RGW by uploading a billion objects to a single bucket and synchronizing them across a multisite setup. The test involves setting up the environment, implementing dynamic resharding of the bucket, and monitoring system behaviour during the resharding and IO operations. 

The talk would provide valuable considerations for managing large-scale data in Ceph RGW clusters. Moreover, it discusses the challenges and limitations encountered in optimizing the performance of dynamic resharding, offering essential insights for addressing such issues for feature enhancements in the future.
   </td>
   <td><strong>Vidushi Mishra & Madhavi Kasturi</strong>
<p>
IBM
   </td>
  </tr>  
  <tr>
   <td>11:15
   </td>
   <td><strong>RGW and S3-Select: Use case for CEPH QE logs</strong>
<p>
We want to present on how we use ceph s3-select to query on the log data generated for every build of every release
   </td>
   <td><strong>Hemanth Sai Maheswarla & Madhavi Kasturi</strong>
<p>
IBM
   </td>
  </tr>  
  <tr>
   <td>11:25
   </td>
   <td><strong>Tea/Coffee Break</strong>
   </td>
  </tr> 
  <tr>
   <td>11:40
   </td>
   <td><strong>D4N in RGW</strong>
<p>
D4N is an intelligent caching framework within Ceph RGW. This project is a collaboration between MOC team at Boston University and Ceph RGW team. The ongoing effort to upstream D4N into Ceph is mainly going to target accelerating analytics workload.
   </td>
   <td><strong>Pritha Srivastava</strong>
<p>
IBM
   </td>
  </tr> 
  <tr>
   <td>11:50
   </td>
   <td><strong>Exploring NFS-Ganesha's Integration with Ceph</strong>
<p>
NFS-Ganesha operates as a user-space NFS server and provides support for CephFS FSAL via libcephfs. This presentation suggests a comprehensive examination of the integration between NFS Ganesha and Ceph, a distributed storage system acclaimed for its scalability and reliability. We will commence by delving into the foundational architectures of NFS Ganesha and Ceph, elucidating how they synergize to furnish a resilient storage solution. Subsequently, we will delve into the technical nuances of merging NFS-Ganesha with CephFS, encompassing aspects such as setup, deployment, and operational considerations
   </td>
   <td><strong>Manisha Saini</strong>
<p>
IBM
   </td>
  </tr>
<tr>
   <td>12:00
   </td>
   <td><strong>Highly avaialble Ceph Cluster Using Haproxy.</strong>
   </td>
   <td><strong> &emsp; Nilesh Chandekar</strong>
   <p>
   Clear-Trail
   </td>
  </tr> 
  </tr>  
  <tr>
   <td>12:25
   </td>
   <td><strong>Panel Discussion - Object Storage: Large Scale AL/ML Workload handling challenges  </strong>
   </td>
   <td><strong> &emsp; K Gopal Krishna, Madhavi Kasturi, Jiffin Tony Thottan</strong>
   </td>
  </tr> 
  </tr> 
  <tr>
   <td>13:00
   </td>
   <td><strong>Lunch</strong>
   </td>
  </tr>
   <tr>
   <td>14:00
   </td>
   <td><strong>Panel Discussion</strong>
<p>
Panel discussion lead by our Experts around - <br />
* Getting users feedback about Ceph <br />
* Sharing about Ceph User Council Iinitiative <br />
* Improvements going in Community Ceph releases <br />
* Ceph release updates <br />
   </td>
   <td><strong>Ceph Leaders & Experts</strong>
   </td>
  </tr>
   <tr>
   <td>15:00
   </td>
   <td><strong>Chorus</strong>
<p>
Efficiently migrating petabytes of object storage data between two production Ceph clusters posed a significant challenge with live data being written to both clusters, necessitating a seamless process to minimize disruptions. The migration strategy involved extracting user accounts, including access and secret keys, from the old cluster and seamlessly transferring them to the new one. The synchronization of buckets and live data has been improved by extending and enhancing powerful tools such as rclone, executed in parallel. This migration endeavor not only resulted in the successful transfer of vast amounts of data but also paved the way for the creation of a robust tool named Chorus. Chorus, specifically designed for synchronizing S3 data, emerged as a versatile solution capable of harmonizing data seamlessly across multiple cloud storage backends. This innovative tool is helpful in effective bridging of data between Ceph clusters, demonstrating the adaptability and scalability required for modern data management challenges. Key highlights of Chorus include persistence of migration, execution of migration on multiple machines, rate limiting RAM/network usage during migration. <br />
   </td>
   <td><strong> &emsp; Deepika Upadhyay</strong>
   <p>
   Clyso GmBH
   </td>
  </tr>
  <tr>
   <td>15:15
   </td>
   <td><strong>Evaluating Ceph bluestore RocksDB compression using Warp</strong>
<p>
This presentation sheds light on an essential tuning enhancement in Ceph, specifically the RocksDB compression, now enabled by default in versions Reef and above. Through this presentation, our aim is to familiarize a broader audience with rocksDB compression’s significance, advantages and usage in Ceph, particularly in non-collocated deployments where NVMe drives store WAL/DB data.
By exercising this optimization, we achieve nearly identical performance while considerably reducing space utilization for storing metadata. 
In addition to explaining rocksDB compression, we delve into the testing workflow employed during the performance evaluation and highlight the enhancements made to MinIO Warp to cater to our requirements. Furthermore, we emphasize the newfound flexibility in S3 benchmarking facilitated by Warp, providing a comprehensive overview of its implications and benefits.
   </td>
   <td><strong>Shreyansh Sancheti & Harsh Kumar</strong>
<p>
IBM
   </td>
  </tr> 
  <tr>
   <td>15:40
   </td>
   <td><strong>Tea/Coffee Break</strong>
   </td>
  </tr> 
<tr>
   <td>16:00
   </td>
   <td><strong>Rook Community Updates & Lightning talks</strong>
   </td>
   <td><strong>Subham Kumar Rai, Parth Arora, Rakshith R & Deepika Upadhyay</strong>
<p>
Rook.io
   </td>
  </tr> 
  <tr>
   <td>16:30
   </td>
   <td><strong>Configure vhost style for RGW in Kubernetes Appilcations</strong>
<p>
This presentation outlines the configuration of a virtual hosting style for Ceph Rados Gateway (RGW) using Ingress and  Rook for AL/ML applications like Milvus. The s3 buckets can be accessed either path based or host style. Path is deprecated by S3 protocol and lot of application defaults with vhost style. Ingress provides the wildcard support for endpoint and Rook can deploy RGW with vhost style access.
   </td>
   <td><strong>Jiffin Tony Thottan</strong>
<p>
IBM
   </td>
  </tr>
  <tr>
   <td>16:40
   </td>
   <td><strong>Deep-dive into Cephadm internals & troubleshooting common issues</strong>
<p>
In an Octopus release, the Cephadm utility was introduced to manage a single Ceph cluster which does not rely on external tools like rook & ansible. However, due to its complex nature it is difficult to troubleshoot cephadm issues for operations such as OSD redeployment or deployment of any new service. 
Understanding Cephadm's internal working concepts is necessary for troubleshooting issues, as it will help us identify which component needs to be troubleshooted.
Along with the internals working concepts, an approach/guidance for troubleshooting common issues related to Cephadm makes it easier & quicker to find resolutions.
   </td>
   <td><strong>Kritik Sachdeva & Vaishnavi Deshpande</strong>
<p>
IBM
   </td>
  </tr>
  <tr>
   <td>17:10
   </td>
   <td><strong>Closing Remarks</strong>
  </tr>


Join the Ceph announcement list, or follow Ceph on social media for Ceph event
updates:

- [Ceph Announcement list](https://lists.ceph.io/postorius/lists/ceph-announce.ceph.io/)
- [Twitter](https://twitter.com/ceph)
- [LinkedIn](https://www.linkedin.com/company/ceph/)
- [FaceBook](https://www.facebook.com/cephstorage/)