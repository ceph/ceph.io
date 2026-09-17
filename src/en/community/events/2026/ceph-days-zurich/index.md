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
- **CFP Closes:** 2026-09-11
- **Speakers receive confirmation of acceptance:** 2026-09-18
- **Registration Opens:** 2026-06-15
- **Schedule Announcement:** 2026-09-22
- **Registration Closes:** 2026-10-07
- **Event Date:** 2026-10-14

Registration is now open! (Closes on Oct 7, 2026)

<br/>

<a class="button" href="https://luma.com/b4d2ffox">Register Here!</a>

<br/>

## Schedule
## Agenda

### Block 1: Welcome, Keynote & Operations Management

<table>
<thead>
<tr><th>Time</th><th>Talk</th><th>Description</th><th>Speaker</th></tr>
</thead>
<tbody>
<tr><td>8:30 AM</td><td>Registration &amp; Welcome Coffee</td><td></td><td></td></tr>
<tr><td>9:00 AM</td><td>Welcome Ceph Days Zürich: AI Impact to the Ceph Project</td><td>How has AI already changed the Ceph project, what measures are in place or under discussion, and what does the near future look like across the project.</td><td>Joachim Kraftmayer (CLYSO GmbH)</td></tr>
<tr><td>9:15 AM</td><td>When Petabytes Go Quiet: Operating CephFS for Research Through Two Major Outages</td><td>Two multi-week CephFS outages on a multi-petabyte research HPC cluster, told from the user-impact side, plus the recovery and storage redesign that followed, including a new NVMe-based filesystem now in pilot.</td><td>Bastian Bukatz (University of Zürich)</td></tr>
<tr><td>9:45 AM</td><td>Making Sense of Cephadm and Rook: Two Ways to Manage Ceph</td><td>A comparison of Cephadm and Rook's architecture and philosophy, and how the differences play out in day-2 operations like upgrades, OSD replacement, and failure recovery. No prior Kubernetes knowledge required.</td><td>David Mohren (CLYSO GmbH)</td></tr>
<tr><td>10:15 AM</td><td>Automating Ceph Deployments with Ansible</td><td>How the cephadm-ansible project's playbooks and modules automate node-preparation tasks that fall outside the Ceph orchestrator's scope.</td><td>Robert Sander (Heinlein Consulting GmbH)</td></tr>
<tr><td>10:25 AM</td><td>Ceph in Production: Things We Swore We'd Never Do Twice</td><td>Real-world lessons from running and changing a production Ceph cluster with confidence, covering quorum mishaps, maintenance surprises, and migration challenges, aimed at helping new operators avoid the same mistakes.</td><td>Wannes Smet (ICsense NV)</td></tr>
<tr><td>10:55 AM</td><td>Group Photo</td><td></td><td></td></tr>
<tr><td>11:10 AM</td><td>Coffee Break &amp; Networking</td><td></td><td></td></tr>
</tbody>
</table>

### Block 2: Hardware & Infrastructure Efficiency

<table>
<thead>
<tr><th>Time</th><th>Talk</th><th>Description</th><th>Speaker</th></tr>
</thead>
<tbody>
<tr><td>11:45 AM</td><td>Every Byte Counts! Ceph Capacity Optimization in Expensive Times</td><td>With hardware prices soaring, a look at the options for reducing Ceph's data footprint and cutting physical hardware needs without sacrificing reliability.</td><td>Frédéric Nass (CLYSO GmbH)</td></tr>
<tr><td>12:10 PM</td><td>Ceph on a Shoestring and a Song: Repurposing Older Hardware as a Hedge Against Component Price Inflation</td><td>War stories from running hand-me-down hardware to dodge the AI-driven price surge in NAND and RAM.</td><td>Francois Baillargeon (Croit GmbH)</td></tr>
<tr><td>12:20 PM</td><td>One Slow Disk, Zero Customer IOPS: Automating Ceph Failure Response at Scale</td><td>How Infomaniak's two very different multi-petabyte storage platforms fail, and Ceph Companion, the Go tool built to detect and remediate failing OSDs automatically before they take the cluster down.</td><td>Olivier Chaze (Infomaniak Network SA)</td></tr>
<tr><td>12:30 PM</td><td>Lunch Break &amp; Networking</td><td></td><td></td></tr>
</tbody>
</table>

### Block 3: Object Storage & CephFS Deep Dive

<table>
<thead>
<tr><th>Time</th><th>Talk</th><th>Description</th><th>Speaker</th></tr>
</thead>
<tbody>
<tr><td>2:00 PM</td><td>Benchmarking the Journey to Object Storage (300PB+ Migration)</td><td>Viridien's benchmarking methodology and findings from migrating hundreds of internal POSIX storage clusters to Ceph RGW, for teams planning large greenfield deployments.</td><td>Colin Morey (Viridien Group)</td></tr>
<tr><td>2:30 PM</td><td>Performance of FastEC Optimizations in RADOS Gateway Context</td><td>Benchmarks of the Fast Erasure Coding optimizations in the latest Ceph release against RGW workloads, using elbencho and warp.</td><td>Sayafdine Said &amp; Enrico Bocchi (CERN)</td></tr>
<tr><td>2:40 PM</td><td>CephFS Subvolume Quarantine: A Kill Switch for Ransomware</td><td>How subvolume quarantine freezes I/O to a compromised subvolume on command, the multi-MDS coordination behind it, and testing a feature that only matters when things go very wrong.</td><td>Igor Golikov (IBM)</td></tr>
<tr><td>3:10 PM</td><td>Accelerating CephFS Backups with Recursive Change-Time Detection</td><td>How CERN's restic-based CBACK backup tool uses CephFS's recursive change-time attribute to skip unchanged directory subtrees, cutting metadata load and improving backup performance.</td><td>Roberto Valverde (CERN)</td></tr>
<tr><td>3:20 PM</td><td>Coffee Break &amp; Networking</td><td></td><td></td></tr>
</tbody>
</table>

### Block 4: Advanced Engineering & Deep Dives

<table>
<thead>
<tr><th>Time</th><th>Talk</th><th>Description</th><th>Speaker</th></tr>
</thead>
<tbody>
<tr><td>4:00 PM</td><td>Taming Upmap Sprawl at Proton: Graph-Driven PG Rebalancing at Petabyte Scale</td><td>How modeling upmap mappings as directed multigraphs let Proton cut needed upmaps by over 80% while preserving cluster balance, with a practical operational playbook from production clusters.</td><td>Jan Veverka (Proton AG)</td></tr>
<tr><td>4:10 PM</td><td>OSD Replacement in Rook: An Imperative Operation in a Declarative World</td><td>Using Rook's upcoming automated OSD replacement feature to explore the Kubernetes operator model and GitOps, and which cluster operations fit that model easily versus which need more thought. No Kubernetes knowledge assumed.</td><td>Artem Torubarov (CLYSO GmbH)</td></tr>
<tr><td>4:40 PM</td><td>eBPF Instrumentation for RGW: When Ceph's Native Tracing Isn't Enough</td><td>Why built-in Jaeger tracing falls short for pinpointing which OSD ate a request's time, and how rgwtrace attaches to running binaries to emit per-request OTel traces instead.</td><td>Ondřej Kukla (CDN77)</td></tr>
<tr><td>5:10 PM</td><td>A Tour of Garbage Collection</td><td>Why RGW defers object deletion to garbage collection, when it doesn't apply, and a tour of the GC's internal data structures with practical monitoring and throughput-tuning experience.</td><td>Tobias Brunnwieser (Hetzner Cloud GmbH)</td></tr>
<tr><td>5:40 PM</td><td>Podium Discussion with All Speakers</td><td></td><td></td></tr>
<tr><td>6:00 PM</td><td>Closing Remarks &amp; Event Wrap-Up</td><td></td><td></td></tr>
<tr><td>6:10 PM</td><td>Network Reception with Drinks</td><td></td><td></td></tr>
</tbody>
</table>

<br />

