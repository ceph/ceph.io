---
title: Ceph Days India
date: 2023-05-05
end: 2023-05-05
location: IBM Office
venue: A Block, Embassy Golf Links Business Park, Challaghatta, Bengaluru, Karnataka 560071
image: "/assets/bitmaps/ceph-days.png"
tags:
  - ceph days
---

### Bringing Ceph to India

<a class="button" href="#">Registration SOLD OUT</a>

A full-day event dedicated to sharing Ceph’s transformative power and fostering
the vibrant Ceph community with the community in India!

The expert Ceph team, Ceph’s customers and partners, and the Ceph community
join forces to discuss things like the status of the Ceph project, recent Ceph
project improvements and roadmap, and Ceph community news. The day ends with
a networking reception, to foster more Ceph learning.

The CFP is now open and registration is limited!

## Important Dates

- **CFP Opens:** 2023-02-21
- **CFP Closes:** 2023-03-29
- **Speakers receive confirmation of acceptance:** 2023-04-03
- **Schedule Announcement:** 2023-04-05
- **Event Date:** 2023-05-05

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
   <td>9:00
   </td>
   <td><strong>Keynote: Kickoff with Community updates</strong>
   </td>
   <td>
<center><img src="/assets/bitmaps/events/2023/ceph-days-india/gaurav-sitlani.jpg"><br /><strong>Gaurav Sitlani</strong><br />
   IBM</center>
   </td>
  </tr>
  <tr>
   <td>9:20
   </td>
   <td><strong>CephFS Under The Hood</strong>
<p>
This talk would go into detail on how Ceph File System works under the hood. We start by explaining about CephFS, how it has an edge over other distributed file systems. We move on to uncover the on-disk format explaining in detail about how and where (all) CephFS stores its metadata and user data. Further, we introduce the concept of snapshots. The on-disk format is essential to understanding this. Lastly, we lightly touch upon the concept of "caps" (capabilities).
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-india/venky-shankar.jpg"><strong>Venky Shankar</strong>
<p>
IBM India Pvt. Ltd.</center>
   </td>
  </tr>
  <tr>
   <td>10:05
   </td>
   <td><strong>Ceph RBD integration with DPUs</strong>
<p>
DPU will start running CEPH client, Crush and librbd libraries to virtualize the rbd, and present the rbd to host as a PCIe connected NVMe disk like NVMeOF. All the read and write requests to the cluster are converted from pcie to rados requests. A special daemon runs on the cores and becomes a client to the ceph cluster. It can fetch the cluster maps, runs crush. It can understand the failures and redirects the TCP connections to new OSDs to fetch data and load balances the traffic well.
   </td>
   <td><strong>Varada Raja Kumar Kari</strong>
<p>
AMD India Pvt Ltd
   </td>
  </tr>
  <tr>
   <td>10:40
   </td>
   <td><strong>When should we use cephadm or cephadm-ansible?</strong>
<p>
"In an Octopus release, the cephadm utility was introduced to properly manage a single Ceph cluster. However, if we need to scale the size of multiple Ceph clusters that are geographically distributed, or if we want to automate the steps for tuning a single cluster, we cannot use cephadm.
<p>
Therefore, to automate and manage simple tasks across multiple clusters or multiple on a single cluster, we can use Ansible to perform these tasks at scale by using cephadm-ansible instead of cephadm."
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-india/kritik-sachdeva.jpg"><strong>Kritik Sachdeva</strong>
<p>
IBM</center>
   </td>
  </tr>
  <tr>
   <td>11:00
   </td>
   <td><strong>Break</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>11:20
   </td>
   <td><strong>Critical Troubleshooting Tools for Rook Clusters</strong>
<p>
While Rook simplifies the deployment and management of Ceph in Kubernetes, it can still be challenging to troubleshoot issues that arise. Common issues include network connectivity, losing mon quorum, removing failed OSDs, and so on. This talk will present tools for admin to restore the Mon quorum from just one single healthy mon, remove the failed OSDs, debug mon and OSD pods, and many more.
   </td>
   <td><strong>Subham Kumar Rai</strong>
<p>
Red Hat
   </td>
  </tr>
  <tr>
   <td>11:55
   </td>
   <td><strong>Enabling Read Affinity for workloads with Rook</strong>
<p>
Rook spreads OSDs across the nodes of cluster to provide redundancy and availability using node topology labels, which are also added to the desired level in the CRUSH map. Currently, reads for Containerised workloads(pods) are served from the primary OSD of the PG which maybe located on a different node, zone or even region.
<p>
Leveraging read affinity feature, reads are served from the OSDs which are in proximity to the client, reducing data transfer and improving performance.
   </td>
   <td><strong>Rakshit</strong>
<p>
IBM
   </td>
  </tr>
  <tr>
   <td>12:20 PM
   </td>
   <td><strong>RADOS Gateway Integration with Hashicorp Vault</strong>
<p>
RGW integration with Vault presents opportunities for encryption to be more flexible. While OSD encryption is one key per underlying block device, encryption configured with a key management service makes the process flexible through bucket policies; now keys can be unique on a bucket-level or even on object-level. Vault itself can be configured to be highly available and provide encryption as a service. This ensures that the keys are stored safely within vault, much like in the case of an HSM.
   </td>
   <td><strong>K Gopal Krishna</strong>
<p>
croit GmbH
   </td>
  </tr>
  <tr>
   <td>12:55
   </td>
   <td><strong>Enhancing Observability using Tracing in Ceph</strong>
<p>
With the introduction of opentelemetry tracing in Ceph, we can identify
<p>
abnormalities in your Ceph cluster more easily. This will make your
<p>
Ceph cluster reach a much-improved monitoring state, supporting visibility to its
<p>
background distributed processes. This would, in turn, add up to the ways Ceph
<p>
is being debugged, “making Ceph more transparent” in identifying abnormalities
<p>
and troubleshooting performance issues.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-india/deepika-upadhyay.jpg"><strong>Deepika Upadhyay</strong>
<p>
Koor Technologies Inc.</center>
   </td>
  </tr>
  <tr>
   <td>1:15
   </td>
   <td><strong>Break</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>2:00
   </td>
   <td><strong>Quiz</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>2:15
   </td>
   <td><strong>IBM Ceph and Storage Insights integration strategy and plan</strong>
   <p>
   Storage Insights integration will help multi-cluster monitoring for multiple Ceph clusters. This will provide a single tool for monitoring high level cluster metrics like cluster health, fullness and other identified metrics with no drill down and click through. Most Ceph customer have more than one cluster deployed and multi-cluster monitoring has been a gap for a long time in Ceph management tooling. So SI integration will help to fill that gap. Storage Insights will be integrated into the call-home workflow of IBM Ceph. IBM Ceph also will be integrated into the alerting workflow of Storage Insights. This near real-time alerting capability in SI will be a significant value add to Ceph.
   </td>
   <td><strong>Vijay Patidar</strong>
   <p>
   IBM
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>2:35
   </td>
   <td><strong>Monitoring and Centralized Logging in Ceph</strong>
<p>
The objective of the talk is to highlight the various aspects and importance of two of the pillars of Observability: Metrics & Logs in Ceph Storage cluster. We will talk about the current architecture of metrics collection and logging, technology stack used and how you can easily deploy them in Ceph. This talk will also highlight the various aspects and importance of Centralized Logging, which can be very useful to view and manage the logs in a Dashboard view. Including a short demo at end.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-india/avan-thakkar.jpg"><strong>Avan Thakkar & Aashish Sharma</strong>
<p>
IBM
   </td>
  </tr>
  <tr>
   <td>3:15
   </td>
   <td><strong>Autoscaling with KEDA for Ceph Object Store aka RGW</strong>
<p>
Scaling your object store is complex, payloads vary in size - objects can be as large as virtual machine images or as small as emails. In behaviour - some are mostly reading, writing, and listing objects. Other payloads delete objects, and some keep them forever. Using CPU and RAM to autoscale the pods horizontally or vertically is limited and may have adverse effects. Treating our object store as a queueing system: converting HTTP requests to actions on disks may just be the solution!
   </td>
   <td><strong>Jiffin Tony Thottan</strong>
<p>
IBM
   </td>
  </tr>
  <tr>
   <td>3:50
   </td>
   <td><strong>External Rook Ceph Cluster</strong>
<p>
You may have an existing Ceph cluster that you want to integrate with Kubernetes, or wanted centralized ceph management in a single cluster connected to multiple Kubernetes clusters what's the solution? External Rook-Ceph Cluster.
<p>
An external cluster is a Ceph configuration that is managed outside of the local K8s cluster.
<p>
This lightning talk will give a quick overview of the Rook external cluster, which includes its deployment, demo, and how the latest ceph features can be used with this.
   </td>
   <td><center><img src="/assets/bitmaps/events/2023/ceph-days-india/parth-arora.jpg"><strong>Parth Arora</strong>
<p>
IBM</center>
   </td>
  </tr>
  <tr>
   <td>4:15
   </td>
   <td><strong>Break</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>4:45
   </td>
   <td><strong>NVMeOF support for Ceph</strong>
<p>
Provide access to RBD volumes via generic NVMe block devices
   </td>
   <td><strong>Rahul Lepakshi</strong>
<p>
IBM
   </td>
  </tr>
  <tr>
   <td>5:20
   </td>
   <td><strong>Teuthology - Integration Test Framework</strong>
<p>
Teuthology is a test framework for Ceph which is used to run vast majority of Ceph tests. In the presentation we will talk about it's infrastructure, installation and how to get started with it.
   </td>
   <td><strong>Subhashree Mishra & Yash Ajgaonkar</strong>
<p>
Red Hat
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td><strong>Quiz</strong>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>5:50
   </td>
   <td><strong>Ceph Days Closure note</strong>
   </td>
   <td>
   </td>
  </tr>
</table>

Join the Ceph announcement list, or follow Ceph on social media for Ceph event
updates:

- [Ceph Announcement list](https://lists.ceph.io/postorius/lists/ceph-announce.ceph.io/)
- [Twitter](https://twitter.com/ceph)
- [LinkedIn](https://www.linkedin.com/company/ceph/)
- [FaceBook](https://www.facebook.com/cephstorage/)
