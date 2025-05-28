---
title: Ceph Days Seattle 2025
date: 2025-05-15
end: 2025-05-15
location: Seattle, United States
venue: SURF Incubator Event Space, 999 3rd Ave, Suite 700, Seattle, WA 98104
image: "/assets/bitmaps/cephdayseattle.jpg"
sponsors:
  - label:
    list:
      - name: OSNEXUS
        logo: /assets/bitmaps/logo-osnexus.png
  - label:
    list:
      - name: CLYSO
        logo: /assets/bitmaps/logo-clyso.png
tags:
  - ceph days
---

### Bringing Ceph to Seattle 

A full-day event dedicated to sharing Ceph's transformative power and fostering
the vibrant Ceph community with the community in Seattle!

The expert Ceph team, Ceph's customers and partners, and the Ceph community
join forces to discuss things like the status of the Ceph project, recent Ceph
project improvements and roadmap, and Ceph community news. The day ends with
a networking reception.

## Important Dates

- **CFP Opens:** 2025-03-30
- **CFP Closes:** ~~2025-04-25~~ Extended to 2025-05-02
- **Speakers receive confirmation of acceptance:** 2025-05-10
- **Schedule Announcement:** 2025-05-10
- **Event Date:** 2025-05-15

<a class="button" href="https://forms.gle/qQdBPe6qsuU2TSq67">Apply to be a Presenter!</a>

<a class="button" href="https://osnexus.regfox.com/ceph-days-seattle-2025">Register to Attend!</a>

<br />

## Schedule


<table><thead>
  <tr>
    <th>What</th>
    <th>Who</th>
    <th>When</th>
  </tr></thead>
<tbody>
  <tr>
    <td>Welcome, Check-in, Coffee, Pastries</td>
    <td></td>
    <td>12:00 - 13:00</td>
  </tr>
  <tr>
    <td>Introduction to Ceph:  The State of the Cephalopod in 2025<br><a href="https://ceph.io/en/community/events/2025/ceph-day-seattle/ceph.day.seattle.intro.to.ceph.2025.05.15.pdf">Slide Deck</a><br>New to Ceph? Or a seasoned operator curious about the latest updates?<br>This talk is your fast track to understanding Ceph in 2025. We’ll cover<br>what Ceph is, how it works, and where the project is headed — from<br>new features and architectural changes to project governance and<br>ecosystem growth. Whether you're deploying your first cluster or<br>managing petabytes, this session will bring you up to speed.</td>
    <td>Dan van der Ster (CLYSO)</td>
    <td>13:00 - 13:30</td>
  </tr>
  <tr>
    <td>Choosing the Right Data Protection Strategies For Your Ceph Deployments<br><a href="https://ceph.io/en/community/events/2025/ceph-day-seattle/ChoosingDataProtectionCephDaySeattle2025.pdf">Slide Deck</a><br>Choosing the right data protection strategy for Ceph deployments can be<br>complicated:<br><br>Usable to raw capacity ratio<br>Replication vs erasure coding<br>EC profile values for k and m<br>Read and Write performance<br>Recovery performance<br>Failure domains<br>Fault tolerance<br>Media saturation<br>min_alloc_size vs IU<br><br>Moreover, a given Ceph cluster often benefits from or even needs a<br>combination of strategies and media types. These decisions can be<br>daunting, and many clusters require or would benefit from a mixture<br>of approaches based on use-case and per-pool requirements.<br><br></td>
    <td>Anthony D'Atri (IBM)</td>
    <td>13:30 - 14:00</td>
  </tr>
  <tr>
    <td>Ceph Solution Design Tool<br><a href="https://ceph.io/en/community/events/2025/ceph-day-seattle/osn_ceph_days_seattle_2024_data_placement.pdf">Slide Deck</a><br>In this talk we'll be going over general cluster design recommendations<br>and how to employ those using the Ceph Solution Design utilities.<br>We'll also discuss some of the tradeoffs between using EC vs replicas,<br>sizing of the ratio between HDD and flash in hybrid configurations, and more<br></td>
    <td>Steven Umbehocker (OSNEXUS)</td>
    <td>14:00 - 14:30</td>
  </tr>
  <tr>
    <td>Coffee / Tea break</td>
    <td></td>
    <td>14:30 - 15:00</td>
  </tr>
  <tr>
    <td>Ceph in Proxmox VE<br><a href="https://ceph.io/en/community/events/2025/ceph-day-seattle/ceph.in.proxmox.ve.pdf">Slide Deck</a><br>Proxmox embraced Ceph early on, and now this has become very<br>relevant for those migrating virtualization platforms.  This talk will<br>provide a technical overview of Ceph implementation in Proxmox <br>VE, Proxmox Backup server, and ISS experiences.<br></td>
    <td>Alex Gorbachev (ISS)</td>
    <td>15:00 - 15:30</td>
  </tr>
  <tr>
    <td>NVMe over TCP and Block Performance<br>A seasoned IT professional with over 20 years of leadership experience<br>in technology solutions and consulting, Mike specializes in data center<br>modernization, cloud architectures, and disaster recovery strategies.<br>Currently serving as a Technical Product Manager for IBM Storage<br>Ceph, he focuses on NVMe over TCP and VMware vSphere integration<br>for block storage. His expertise spans decades of IT Consulting, public<br>peaking, customer education, strategic planning and high-value solutions<br>architecture.<br></td>
    <td>Mike Burkhart</td>
    <td>15:30 - 16:00</td>
  </tr>
  <tr>
    <td>Ceph Object Storage - Keycloak ID Broker With Azure<br><a href="https://ceph.io/en/community/events/2025/ceph-day-seattle/seth-trade-show-slides.pptx.pdf">Slide Deck</a><br>This live demonstration explores the integration of Azure<br> Active Directory (AzureAD) with Keycloak using the Identity<br> Brokering and User Federation features. Keycloak, an open-source<br>identity and access management solution, supports seamless<br>authentication through external identity providers. In this<br>session, we will walk through the end-to-end process of<br>configuring AzureAD as an OIDC (OpenID Connect) identity<br> provider within Keycloak, enabling users to authenticate using<br>their existing Microsoft credentials. We will cover key<br>aspects such as registering an application in AzureAD,<br>configuring redirect URIs, exchanging metadata, and establishing<br>trust within Keycloak. The demonstration will also highlight<br>user federation settings, automatic user account linking,<br>and group/role mappings to synchronize identity attributes<br>between AzureAD and Keycloak.<br>
In addition, we will demonstrate how Ceph’s Object Gateway (RGW)<br>leverages Keycloak as an OIDC provider to support Security<br>Token Service (STS) operations, enabling fine-grained, federated<br>access control for object storage workloads in cloud-native<br>environments.<br></td>
    <td>Seth Cagampang</td>
    <td>16:00 - 16:30</td>
  </tr>
  <tr>
    <td>Ceph Durability: How Safe Is My Data?<br><a href="https://ceph.io/en/community/events/2025/ceph-day-seattle/ceph.durability.2025.05.15.pdf">Slide Deck</a><br>How many nines does your cluster really have? Whether you’re running<br>a small 50-disk setup or a hyperscale 5000 OSD deployment,<br>understanding Ceph’s actual data durability is key to making the right<br>design choices. Replication vs. erasure coding, failure domains,<br>recovery speeds: these all impact real-world reliability. In this talk, we<br>introduce a new Ceph durability calculator based on Monte Carlo<br>simulations to give updated, practical insights into how safe your<br>data really is with Ceph. Bring your cluster size and<br>settings — and walk away with numbers.<br></td>
    <td>Dan van der Ster (CLYSO)</td>
    <td>16:30 - 17:00</td>
  </tr>
  <tr>
    <td>Optimizing Ceph RGW for Specific Workloads Including AI<br><a href="https://ceph.io/en/community/events/2025/ceph-day-seattle/osn_ceph_days_seattle_2024_data_placement.pdf">Slide Deck</a><br>One of the big barriers to getting great performance and scalability in<br>object storage configurations has to do with data placement.<br>Inefficiently writing small objects to EC storage can kill performance<br>and cause unintentional wasted space due to padding. We'll talk<br>about Ceph's RGW's support for embedded Lua and how we've<br>used that in QuantaStor to solve these issues.  We'll then dive<br>into&nbsp;&nbsp;Lua examples you can customize to optimize your object<br>storage workloads.<br></td>
    <td>Steven Umbehocker (OSNEXUS)</td>
    <td>17:00 - 17:30</td>
  </tr>
  <tr>
    <td>Dinner &amp; Drinks &amp; Networking oh my!</td>
    <td></td>
    <td>17:30 - 19:00</td>
  </tr>
</tbody></table>
