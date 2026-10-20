---
title: Ceph Days Zürich 2026
date: 2026-10-14
end: 2026-10-14
location: Zürich, Switzerland
venue: University Zürich, Rämistrasse 59, CH-8006 Zürich 
image: "/assets/bitmaps/events/2026/ceph-days-zurich/banner.png"
sponsors: CLYSO
tags:
  - ceph days
---

### Bringing Ceph back to Switzerland

Join us for a full-day celebration of Ceph in Zürich / Switzerland, bringing together the people and ideas driving open-source storage forward. Connect with Ceph experts, core contributors, customers, and partners as they dive into the current state of the project, highlight recent improvements, preview what's on the roadmap, and share the latest community news. Stick around afterward for a networking reception to meet fellow community members.

A Note on Tickets & Accessibility
As an open-source community event, organizers aim to bring people together while covering essential costs for hosting, venue, and catering. However, they want to ensure that financial constraints don’t keep our community away. The Ceph Foundation does not set the event's price and does not receive any money from the Ceph Day event.

Here is how you can join us:
- **Speak at Ceph Day**: Submit a talk via our Call for Papers (CFP)! All selected speakers will receive a free ticket to the event. It’s the perfect opportunity to share your expertise and shape the agenda.
- **Financial Support**: If the ticket fee is currently a barrier for you but you would love to attend, please don't hesitate to reach out to our organizing team directly. We are committed to making this event accessible and will work with you to find a solution.


## Important Dates

- ~~**CFP Opens:** 2026-06-15~~
- ~~**CFP Closes:** 2026-09-11~~
- ~~**Speakers receive confirmation of acceptance:** 2026-09-18~~
- ~~**Registration Opens:** 2026-06-15~~
- ~~**Schedule Announcement:** 2026-09-18~~
- ~~**Registration Closes:** 2026-10-07~~
- ~~**Event Date:** 2026-10-14~~

<br/>

## Schedule

### Block 1: Welcome, Keynote & Operations Management

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
<tr><td style="white-space:nowrap;">8:30 AM</td><td>Registration &amp; Welcome Coffee</td><td></td><td></td></tr>
<tr><td style="white-space:nowrap;">9:00 AM</td><td>Welcome Ceph Days Zürich: AI Impact to the Ceph Project</td><td>How has AI already changed the Ceph project, what measures are in place or under discussion, and what does the near future look like across the project.</td><td>Joachim Kraftmayer (CLYSO GmbH)</td></tr>
<tr><td style="white-space:nowrap;">9:15 AM</td><td>When Petabytes Go Quiet: Operating CephFS for Research Through Two Major Outages</td><td>Two multi-week CephFS outages on a multi-petabyte research HPC cluster, told from the user-impact side, plus the recovery and storage redesign that followed, including a new NVMe-based filesystem now in pilot.</td><td>Bastian Bukatz (University of Zürich)</td></tr>
<tr><td style="white-space:nowrap;">9:45 AM</td><td>Making Sense of Cephadm and Rook: Two Ways to Manage Ceph</td><td>A comparison of Cephadm and Rook's architecture and philosophy, and how the differences play out in day-2 operations like upgrades, OSD replacement, and failure recovery. No prior Kubernetes knowledge required. <a href="/assets/pdfs/events/2026/cd-zurich/3_Making_Sense_of_Cephadm_and_Rook.pdf">Slides</a></td><td>David Mohren (CLYSO GmbH)</td></tr>
<tr><td style="white-space:nowrap;">10:15 AM</td><td>Automating Ceph Deployments with Ansible</td><td>How the cephadm-ansible project's playbooks and modules automate node-preparation tasks that fall outside the Ceph orchestrator's scope. <a href="/assets/pdfs/events/2026/cd-zurich/4_Automating_Ceph_Deployments_with_Ansible.pdf">Slides</a></td><td>Robert Sander (Heinlein Consulting GmbH)</td></tr>
<tr><td style="white-space:nowrap;">10:25 AM</td><td>Ceph in Production: Things We Swore We'd Never Do Twice</td><td>Real-world lessons from running and changing a production Ceph cluster with confidence, covering quorum mishaps, maintenance surprises, and migration challenges, aimed at helping new operators avoid the same mistakes. <a href="/assets/pdfs/events/2026/cd-zurich/5_Ceph_in_Production_Things_We_Swore_Wed_Never_Do_Twice.pdf">Slides</a></td><td>Wannes Smet (ICsense NV)</td></tr>
<tr><td style="white-space:nowrap;">10:55 AM</td><td>Group Photo</td><td></td><td></td></tr>
<tr><td style="white-space:nowrap;">11:10 AM</td><td>Coffee Break &amp; Networking</td><td></td><td></td></tr>
</tbody>
</table>

### Block 2: Hardware & Infrastructure Efficiency

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
<tr><td style="white-space:nowrap;">11:45 AM</td><td>Every Byte Counts! Ceph Capacity Optimization in Expensive Times</td><td>With hardware prices soaring, a look at the options for reducing Ceph's data footprint and cutting physical hardware needs without sacrificing reliability. <a href="/assets/pdfs/events/2026/cd-zurich/6_Every_Byte_Counts!_Ceph_Capacity_Optimization_in_Expensive_Times.pdf">Slides</a></td><td>Frédéric Nass (CLYSO GmbH)</td></tr>
<tr><td style="white-space:nowrap;">12:10 PM</td><td>Ceph on a Shoestring and a Song: Repurposing Older Hardware as a Hedge Against Component Price Inflation</td><td>War stories from running hand-me-down hardware to dodge the AI-driven price surge in NAND and RAM. <a href="/assets/pdfs/events/2026/cd-zurich/7_Repurposing_Older_Hardware_Hedge_Against_Component_Price_Inflation.pdf">Slides</a></td><td>Francois Baillargeon (Croit GmbH)</td></tr>
<tr><td style="white-space:nowrap;">12:20 PM</td><td>One Slow Disk, Zero Customer IOPS: Automating Ceph Failure Response at Scale</td><td>How Infomaniak's two very different multi-petabyte storage platforms fail, and Ceph Companion, the Go tool built to detect and remediate failing OSDs automatically before they take the cluster down. <a href="/assets/pdfs/events/2026/cd-zurich/8_Automating_Ceph_Failure_Response_Scale.pdf">Slides</a></td><td>Olivier Chaze (Infomaniak Network SA)</td></tr>
<tr><td style="white-space:nowrap;">12:30 PM</td><td>Lunch Break &amp; Networking</td><td></td><td></td></tr>
</tbody>
</table>

### Block 3: Object Storage & CephFS Deep Dive

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
<tr><td style="white-space:nowrap;">2:00 PM</td><td>Benchmarking the Journey to Object Storage (300PB+ Migration)</td><td>Viridien's benchmarking methodology and findings from migrating hundreds of internal POSIX storage clusters to Ceph RGW, for teams planning large greenfield deployments. <a href="/assets/pdfs/events/2026/cd-zurich/9_Benchmarking_Journey%20_Object_Storage.pdf">Slides</a></td><td>Colin Morey (Viridien Group)</td></tr>
<tr><td style="white-space:nowrap;">2:30 PM</td><td>Performance of FastEC Optimizations in RADOS Gateway Context</td><td>Benchmarks of the Fast Erasure Coding optimizations in the latest Ceph release against RGW workloads, using elbencho and warp. <a href="/assets/pdfs/events/2026/cd-zurich/10_Performance_FastEC_optimizations_Rados_Gateway_context.pdf">Slides</a></td><td>Sayafdine Said (CERN)</td></tr>
<tr><td style="white-space:nowrap;">2:40 PM</td><td>CephFS Subvolume Quarantine: A Kill Switch for Ransomware</td><td>How subvolume quarantine freezes I/O to a compromised subvolume on command, the multi-MDS coordination behind it, and testing a feature that only matters when things go very wrong. <a href="/assets/pdfs/events/2026/cd-zurich/11_A_Kil_Switch_for_Ransomware.pdf">Slides</a></td><td>Igor Golikov (IBM)</td></tr>
<tr><td style="white-space:nowrap;">3:10 PM</td><td>Accelerating CephFS Backups with Recursive Change-Time Detection</td><td>How CERN's restic-based CBACK backup tool uses CephFS's recursive change-time attribute to skip unchanged directory subtrees, cutting metadata load and improving backup performance. <a href="/assets/pdfs/events/2026/cd-zurich/12_Accelerating_CephFS_Backups_Recursive_Change-Time_Detection.pdf">Slides</a></td><td>Roberto Valverde (CERN)</td></tr>
<tr><td style="white-space:nowrap;">3:20 PM</td><td>Coffee Break &amp; Networking</td><td></td><td></td></tr>
</tbody>
</table>

### Block 4: Advanced Engineering & Deep Dives

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
<tr><td style="white-space:nowrap;">4:00 PM</td><td>Taming Upmap Sprawl at Proton: Graph-Driven PG Rebalancing at Petabyte Scale</td><td>How modeling upmap mappings as directed multigraphs let Proton cut needed upmaps by over 80% while preserving cluster balance, with a practical operational playbook from production clusters. <a href="/assets/pdfs/events/2026/cd-zurich/13_Graph-Driven_PG_Rebalancing_Petabyte_Scale.pdf">Slides</a></td><td>Jan Veverka (Proton AG)</td></tr>
<tr><td style="white-space:nowrap;">4:10 PM</td><td>OSD Replacement in Rook: An Imperative Operation in a Declarative World</td><td>Using Rook's upcoming automated OSD replacement feature to explore the Kubernetes operator model and GitOps, and which cluster operations fit that model easily versus which need more thought. No Kubernetes knowledge assumed. <a href="/assets/pdfs/events/2026/cd-zurich/14_An_Imperative_Operation_Declarative_World.pdf">Slides</a></td><td>Artem Torubarov (CLYSO GmbH)</td></tr>
<tr><td style="white-space:nowrap;">4:40 PM</td><td>eBPF Instrumentation for RGW: When Ceph's Native Tracing Isn't Enough</td><td>Why built-in Jaeger tracing falls short for pinpointing which OSD ate a request's time, and how rgwtrace attaches to running binaries to emit per-request OTel traces instead. <a href="/assets/pdfs/events/2026/cd-zurich/15_When_Cephs_Native_Tracing_Isnt_Enough.pdf">Slides</a></td><td>Ondřej Kukla (CDN77)</td></tr>
<tr><td style="white-space:nowrap;">5:10 PM</td><td>A Tour of Garbage Collection</td><td>Why RGW defers object deletion to garbage collection, when it doesn't apply, and a tour of the GC's internal data structures with practical monitoring and throughput-tuning experience. <a href="/assets/pdfs/events/2026/cd-zurich/16_A_Tour_Garbage_Collection.pdf">Slides</a></td><td>Tobias Brunnwieser (Hetzner Cloud GmbH)</td></tr>
<tr><td style="white-space:nowrap;">5:40 PM</td><td>Podium Discussion with All Speakers</td><td></td><td></td></tr>
<tr><td style="white-space:nowrap;">6:00 PM</td><td>Closing Remarks &amp; Event Wrap-Up</td><td></td><td></td></tr>
<tr><td style="white-space:nowrap;">6:10 PM</td><td>Network Reception with Drinks</td><td></td><td></td></tr>
</tbody>
</table>
