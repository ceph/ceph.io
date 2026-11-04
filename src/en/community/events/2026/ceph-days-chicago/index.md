---
title: Ceph Days Chicago 2026
date: 2026-11-16
end: 2026-11-16
location: 1201 East 60th Street
venue: City View Room
image: "/assets/bitmaps/events/2026/ceph-days-chicago/CD-Chicago-bannner.png"
sponsors:
tags:
  - ceph days
---

### Bringing Ceph to Chicago

A full-day event dedicated to sharing Ceph’s transformative power and fostering
the vibrant Ceph community with the community in Chicago!

The expert Ceph team, Ceph’s customers and partners, and the Ceph community
join forces to discuss things like the status of the Ceph project, recent Ceph
project improvements and roadmap, and Ceph community news. The day ends with
a networking reception to foster more Ceph learning.

### Registration
Registration is now open for the Ceph Days event!
 
<br>
<a class="button" href="https://osnexus.regfox.com/ceph-days-chicago-2026">Register</a>
<br>

 
## Important Dates
 
- ~~CFP Opens: 2026-08-26~~ 
- ~~CFP Closes: 2026-10-15~~ 
- ~~Registration Opens: 2026-08-20~~ 
- Event Date: 2026-11-16
 
 
## Schedule
 

<table style="width:100%; table-layout:fixed; border-collapse:collapse;">
<colgroup>
<col style="width:12%">
<col style="width:26%">
<col style="width:42%">
<col style="width:20%">
</colgroup>
<thead>
<tr><th style="white-space:nowrap;">Time</th><th>Talk</th><th>Description</th><th>Speaker</th></tr>
</thead>
<tbody>
<tr><td style="white-space:nowrap;">9:00 AM</td><td>Welcome</td><td>A list of Chicago attractions, and the dos and don'ts of the city.</td><td>Anthony Middleton, Laura Flores</td></tr>
<tr><td style="white-space:nowrap;">9:15 AM</td><td>State of the Cephalopod</td><td>A look at the Ceph roadmap, current development priorities, and the latest activity in the Ceph community.</td><td>Neha Ojha, Dan van der Ster</td></tr>
<tr><td style="white-space:nowrap;">9:30 AM</td><td>Ceph on a Shoestring: Repurposing Old Hardware</td><td>War stories about how we reuse old hardware to fit into manageable TCO.</td><td>Francois Baillargeon</td></tr>
<tr><td style="white-space:nowrap;">10:00 AM</td><td>BaraCUDA, Riding the Torpedo</td><td>Follow an S3 GET where the response precedes the HTTP reply, the gateway answers for unseen data, and only a number returns through the front door. An opaque token passes between components; a new RADOS op triggers an unusual side effect; and one-sided RDMA writes land directly in GPU memory. In the finale, a dozen OSDs work independently, placing each stripe precisely through arithmetic alone. The gateway holds only the reins—no staging buffers, RDMA NIC, or data path—and read bandwidth scales with OSD count. We'll cover the design, the fallback ladder that keeps ordinary clusters unaware, and lessons from teaching a distributed system to deliver payloads it cannot retrieve.</td><td>Kyle Bader</td></tr>
<tr><td style="white-space:nowrap;">10:30 AM</td><td>Break</td><td></td><td></td></tr>
</tbody>
</table>


<table style="width:100%; table-layout:fixed; border-collapse:collapse;">
<colgroup>
<col style="width:12%">
<col style="width:26%">
<col style="width:42%">
<col style="width:20%">
</colgroup>
<tbody>
<tr><td style="white-space:nowrap;">10:45 AM</td><td>Kubernetes-Native Identity for Ceph Object Storage</td><td>Managing Ceph object storage IAM across Kubernetes clusters creates operational overhead and security risks. Traditional methods rely on static credentials, manual policy distribution, and workflows unlike Kubernetes-native patterns. This talk presents a Kubernetes-native approach using Ceph Account and STS capabilities. Inspired by Kubernetes RBAC, ObjectRoles and ObjectRoleBindings declaratively manage access. Applications authenticate directly with Kubernetes Service Account identities and projected tokens, not static credentials. Following AWS EKS pod identity webhook patterns, a mutating webhook configures AWS SDKs to exchange Service Account tokens for temporary credentials through Ceph STS. Developers reference a Service Account; credential management happens transparently. Using each cluster’s native OIDC provider, this approach enables secure, declarative, multi-cluster access in a scalable, GitOps-friendly model that eliminates static secrets, simplifies policy management, and fits familiar Kubernetes workflows.</td><td>Billy Ridgway</td></tr>
<tr><td style="white-space:nowrap;">11:00 AM</td><td>Superconducting Ceph in the Age of AI</td><td>As HPC and AI push storage limits, Ceph is evolving to meet extreme performance and scale demands, aided by AI engineering. I'll highlight recent upstream contributions, from online defrag and smarter device monitoring to revived ideas like LazyIO for IO500 performance. We'll consider expanding Ceph's reach with NFS-like relaxed POSIX semantics for extreme concurrency—and why I'm more optimistic than ever about Ceph as the ubiquitous, open storage platform. Stay for "one more thing."</td><td>Dan van der Ster</td></tr>
<tr><td style="white-space:nowrap;">11:30 AM</td><td>Preparing Ceph for the SMR Era</td><td>Shingled magnetic recording (SMR) hard drives achieve higher data density by overlapping adjacent tracks, making them an ideal choice for capacity and archive storage tiers. As a result, cloud providers are rapidly deploying SMR drives at scale. Adoption is accelerating: Western Digital reports that host-managed SMR HDDs now account for more than half of its total HDD shipments. Currently, SeaStore supports SMR HDDs, but BlueStore, the storage backend used by most Ceph installations, still lacks full support. Previous attempts to integrate SMR compatibility into Ceph were ultimately rolled back in 2024. To reassess the feasibility, we revived and updated the original zoned storage patches for BlueStore on the latest Ceph main branch. This talk introduces zoned storage/SMR HDDs and demonstrates the updated patch series in action on real host-managed SMR drives. We will also showcase a deployment using Rook on Kubernetes. We'll discuss benchmark results, critical tuning parameters, remaining gaps, and whether zone cleaning remains effective under sustained overwrite workloads.</td><td>Dennis Maisenbacher</td></tr>
<tr><td style="white-space:nowrap;">12:00 PM</td><td>Lunch</td><td></td><td></td></tr>
</tbody>
</table>


<table style="width:100%; table-layout:fixed; border-collapse:collapse;">
<colgroup>
<col style="width:12%">
<col style="width:26%">
<col style="width:42%">
<col style="width:20%">
</colgroup>
<tbody>
<tr><td style="white-space:nowrap;">1:00 PM</td><td>Releasing the Kraken (Responsibly)</td><td>The Ceph project has long relied on ad hoc workflows and loosely defined protocols to maintain release branches. As upstream commits and backports have increased, keeping branches stable for predictable releases has become harder.

This talk covers the modernization of Ceph’s release process and creation of the Ceph Release Manager (CRM) role. Topics include stricter branch policies, an eight-week staggered minor-release cadence across supported releases, stronger GitHub protections, and planned pipeline improvements: cryptographically secure releases, community feedback on release candidates, expanded Teuthology upgrade testing, and automated backport QA and review.

Attendees will learn how Ceph coordinates releases and QA, and what’s ahead for its release pipeline.</td><td>Patrick Donnelly</td></tr>
<tr><td style="white-space:nowrap;">1:15 PM</td><td>Minimizing Data Movement on CRUSH Failure Domain Changes</td><td>Regrouping nodes into a higher-level failure domain is the standard fix for "we can only take one node down at a time.” But changing the CRUSH rule on a large EC pool moves nearly all data. On a 1,600-OSD, 86-PB all-NVMe cluster, changing the failure domain from rack to row was projected to relocate ~84% of data. This talk explains why—CRUSH, upmap items, and the acting set—and presents an upstream change that cuts relocation to ~26%, with demos.</td><td>Frédéric Nass</td></tr>
<tr><td style="white-space:nowrap;">1:45 PM</td><td>Closing the CephFS Trust Gap (virtiofs/Manila)</td><td>Giving OpenStack tenants shared filesystems has meant choosing between two bad options: exposing them to the Ceph network, where they can reach cluster daemons and see each other's traffic, or deploying NFS gateways with HA headaches and added operational burden. virtiofs moves the trust boundary to the hypervisor: the guest gets no storage credentials or Ceph access, while the compute host mounts the share and passes it to the VM over virtqueues, with a sandboxed daemon handling requests. I co-designed this Manila and Nova integration and will explain how it works and reduces the attack surface, then cover what's still missing. Nova's VirtIOFS attachment support shipped in OpenStack's Epoxy release with key constraints: attached shares prevent live migration, attaching or detaching requires stopping the VM, and coarse memory backing complicates flavor planning. I'll discuss four specs targeting these gaps, starting in Hibiscus, and the future of hypervisor-mediated storage across Nova, KubeVirt, and Kata.</td><td>Goutham Pacha Ravi</td></tr>
<tr><td style="white-space:nowrap;">2:00 PM</td><td>TBD</td><td>TBD</td><td>TBD</td></tr>
<tr><td style="white-space:nowrap;">2:30 PM</td><td>Break</td><td></td><td></td></tr>
</tbody>
</table>


<table style="width:100%; table-layout:fixed; border-collapse:collapse;">
<colgroup>
<col style="width:12%">
<col style="width:26%">
<col style="width:42%">
<col style="width:20%">
</colgroup>
<tbody>
<tr><td style="white-space:nowrap;">2:45 PM</td><td>The Power of RADOS: Making fsync (Almost) Free</td><td>fsync() is expensive on CephFS: it flushes dirty data to OSDs, then metadata to the MDS. Yet NFS exports may require fsync on every write, while OSDs can handle far more writes than an MDS. I developed a solution that safely bypasses the MDS, reducing fsync to one RADOS data flush—or even a no-op.

This talk covers the “RADOS fsync” option, its use cases and limitations, and how RADOS’s rich interface enabled rapid development. You’ll learn about CephFS consistency and recovery, an upcoming feature for your deployment, and techniques for custom RADOS applications.</td><td>Gregory Farnum</td></tr>
<tr><td style="white-space:nowrap;">3:15 PM</td><td>TBD</td><td>TBD</td><td>TBD</td></tr>
<tr><td style="white-space:nowrap;">3:45 PM</td><td>Speaker Q&amp;A and Closing Remarks</td><td>TBD</td><td>TBD</td></tr>
<tr><td style="white-space:nowrap;">4:00 PM</td><td>Reception</td><td></td><td></td></tr>
</tbody>
</table>
 
