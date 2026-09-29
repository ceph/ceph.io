---
title: "Ceph Q3 2026 Newsletter"
date: "2026-09-29"
author: "Anthony Middleton"
categories: "newsletter"
image: "images/ceph-banner.png"
tags:
  - "community"
  - "governance"
  - "ceph events"
---
During the third quarter, the Ceph Foundation focused on strengthening the project's governance structure and continuing to expand our global event footprint. This edition of our quarterly newsletter covers the trademark transition to the Linux Foundation, a new member joining the Foundation, recaps from KCD x Ceph x OpenInfra Day Korea and the Ceph Developer Summit for Vampire, an updated pitch deck for prospective members, and a new transparency initiative around board meeting recordings. If you have an idea for a Ceph-related event, outreach effort, or project, we encourage you to submit a <a href="https://form.asana.com/?k=7aCHVRhp0x1Ga1nOCXlckQ&d=9283783873717">funding request</a> and work with the Foundation to help bring it to life.

## In This Issue
- [Ceph Trademark Moves to the Linux Foundation](#ceph-trademark-moves-to-the-linux-foundation)
- [Governance Roles and Accountability](#governance-roles-and-accountability)
- [Welcome New Member Long Van](#welcome-new-member-long-van)
- [Ceph Days Continue to Grow](#ceph-days-continue-to-grow)
- [Ceph Developer Summit Vampire](#ceph-developer-summit-vampire)
- [Updated Ceph Foundation Pitch Deck](#updated-ceph-foundation-pitch-deck)
- [Board Meeting Recordings Now on YouTube](#board-meeting-recordings-now-on-youtube)

---

## Ceph Trademark Moves to the Linux Foundation

The Ceph trademark has officially transferred from IBM/Red Hat to the Linux Foundation. This change places ownership of the Ceph name and mark under the same neutral, vendor-independent umbrella that already supports the Foundation's governance, legal, and financial operations. This transfer marks the completion of the Ceph Foundation's integration into the Linux Foundation. We highlighted this in our Q1 newsletter.

The move reinforces Ceph's standing as an open, community-governed project rather than one tied to a single commercial sponsor. It also aligns trademark stewardship with how the project is actually run today, through the CSC and the Governing Board, rather than with the company that created it.

**Why it matters:** Vendor-neutral trademark ownership is a marker of project maturity that many organizations look for before adopting or contributing to open source infrastructure. It signals that Ceph's direction is set by its community and governing bodies, not by any one company's roadmap.

---

## Governance Roles and Accountability

The Board and CSC used this quarter's joint meeting to clarify the roles and responsibilities of the three pillars supporting the project: the Linux Foundation, the CSC, and the Foundation Board. Matthew offered a working definition for each: the Linux Foundation provides stewardship along with business services such as legal, accounting, and banking, paid for as needed; the Foundation serves as a neutral place to raise funds and recruit members in support of the project; and the CSC sets the project's technical direction, with the Board contributing industry perspective without directing that work.

The Foundation's financial health continues to improve. It now sits above its minimum cushion, defined as twice the highest membership tier, added two new members this year (one associate, one silver), and brought on two full-time staff, Anthony and Emmanuel. That stronger position means the Foundation can now consider funding lab hardware and has opened discussion on a 2027 conference.

### Key Takeaways
- Roles across the Linux Foundation, CSC, and Foundation Board were clarified, though some open questions may remain.
- Ceph trademark migration to the Linux Foundation is complete.
- A full inventory of Linux Foundation benefits and tools will be requested so the CSC can evaluate them as a set.

---

## Welcome New Member Long Van

The Ceph Foundation is pleased to welcome Long Van as a Silver member. New members bring fresh perspective and resources to the project, and their participation helps fund the events, documentation, and community programs covered elsewhere in this newsletter. We look forward to working with Long Van to expand their involvement in the Ceph community.

To learn more about Long Van and other Ceph Foundation members, visit <a href="https://ceph.io/en/foundation/">ceph.io/foundation</a>.

---

## Ceph Days Continue to Grow

### KCD x Ceph x OpenInfra Day Korea 2026

The Ceph community joined forces for a joint conference celebrating Kubernetes Community Days (KCD), Ceph Day, and OpenInfra Day in a single event with multiple technical tracks. Ceph Ambassadors Myoungwon Oh and Sungmin Lee played a major role in bringing this community-led event together. Thank you both for your support and dedication to the Ceph project.

- **Date:** September 1, 2026
- **Location:** Baekbeom Kim Koo Museum & Library, Seoul, South Korea
- **Format:** Joint conference with parallel technical tracks across the three communities
- **Attendance:** Nearly 400 attendees
- **Call for Papers:** Closed with 40 submissions across all three organizations
- **Schedule:** 7 Ceph-related talks
- **Registration & Sponsors:** Managed through an <a href="https://event.plan9.co.kr/#/kcd_odk2026">external event platform</a>; confirmed sponsors included 4 Platinum (AWS, Seagate, Nutanix, Hitachi), 1 Gold, and 4 Silver.

Combining three community events into one gave attendees access to a wider range of technical content in a single event. It gave Ceph a stronger presence within the broader cloud-native and open infrastructure audience in the region.

Check the upcoming and tentative Ceph Days events for the rest of 2026, including Ceph Days Zürich, Chicago, and Ceph Meetup Melbourne.

---

## Ceph Developer Summit Vampire

The Ceph Developer Summit for the upcoming Vampire release, scheduled for Spring 2027, ran online from August 4–13, 2026. Nine sessions brought together contributors across the major Ceph components to plan the next release cycle.

Sessions covered:
- RADOS — <a href="https://pad.ceph.com/p/cds-vampire-RADOS">Notes (Aug 4)</a>
- NVMe-oF Gateway — <a href="https://pad.ceph.com/p/cds-vampire-NVMe-oFgateway">Notes (Aug 6)</a>
- Telemetry / Ceph-MGR — <a href="https://pad.ceph.com/p/cds-vamire-telemetry">Notes (Aug 10)</a>
- BlueStore — <a href="https://pad.ceph.com/p/cds-vampire-BlueStore">Notes (Aug 11)</a>
- Cephadm — <a href="https://pad.ceph.com/p/cds-vampire-cephadm">Notes (Aug 11)</a>
- Dashboard — <a href="https://pad.ceph.com/p/cds-vampire-dashboard">Notes (Aug 12)</a>
- CephFS — <a href="https://pad.ceph.com/p/cds-vampire-CephFS">Notes (Aug 12)</a>
- RGW — <a href="https://pad.ceph.com/p/cds-vampire-rgw">Notes (Aug 12)</a>
- RBD — <a href="https://pad.ceph.com/p/cds-vampire-RBD">Notes (Aug 13)</a>
- Crimson / SeaStore — <a href="https://pad.ceph.com/p/cds-vampire-crimson">Notes (Aug 13)</a>
- Performance — <a href="https://pad.ceph.com/p/cds-vampire-performance">Notes (Aug 13)</a>

The full schedule and session links are available at <a href="https://t.ly/CDS-Vampire">Ceph Events</a>, and recordings from every session are posted to the <a href="https://www.youtube.com/playlist?list=PLAYbnnO0qf9U">Ceph YouTube playlist</a>.

These sessions give the community visibility into what's shaping the Vampire release well before it ships, and give anyone who couldn't attend live a way to catch up on the technical direction for RADOS, storage backends, gateways, and tooling. Thank you to every component lead for taking the time to lead a session and help keep the Ceph project moving forward.

---

## Updated Ceph Foundation Pitch Deck

The Ceph Foundation pitch deck has been refreshed for the first time in more than four years. The updated version is available on the <a href="https://ceph.io/en/foundation/about/">Foundation's about page</a>.

The deck is built for organizations already running Ceph in production, giving them a clear case for joining the Foundation and supporting the project that underpins their infrastructure. If your organization works with a company using Ceph, this is a useful resource to share with their leadership.

---

## Board Meeting Recordings Now on YouTube

The Governing Board has started publishing meeting recordings on YouTube, a new step toward greater transparency around the Foundation's budget, priorities, and upcoming events.

Community members can now follow board discussions directly rather than relying solely on written summaries, giving a clearer view into how funding and program decisions get made.

Find the playlist of board meetings <a href="https://www.youtube.com/playlist?list=PLRSaZR21yGac">here</a>.

---

## Get Involved

Interested in organizing a meetup, hosting a Ceph Days, speaking at an event, or promoting Ceph in your region? Community participation is what makes these events successful. If you need support for a Ceph event, meetup, travel, or community campaign, submit a funding request to the Ceph Foundation. The Governing Board and Linux Foundation staff review requests and consider them based on available budget and community impact.

<a href="https://form.asana.com/?k=7aCHVRhp0x1Ga1nOCXlckQ&d=9283783873717">Ceph Foundation Community Request Form</a>

<a href="https://docs.google.com/document/d/1IhUXxaD8ofz_rGqKKgL9MTM35S2yg4HxrqgAHyuTYWE/edit?usp=sharing">Ceph Days Planning Guide</a>
