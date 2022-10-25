---
title: Ceph Days Dublin 2022
date: 2022-09-13
end: 2022-09-13
location: Dublin, Ireland
venue: WeWork Office Space Charlemont Exchange
register: "https://www.eventbrite.com/e/ceph-days-dublin-2022-tickets-388837191507"
image: "/assets/bitmaps/ceph-days.png"
sponsors:
  - label: Platinum
    list:
      - name: Red Hat
        logo: "/assets/bitmaps/logo-redhat.png"
        website: "https://redhat.com"
tags:
  - ceph days
---

## Bringing Ceph to Dublin!

Come find out why leading enterprises are adopting Ceph, why Ceph is the lowest cost per gig storage solution, and how easy it is to deploy your own Ceph cluster!

### Event description

A full-day event dedicated to sharing Ceph’s transformative power and fostering the vibrant Ceph community.

The expert Ceph team, Ceph’s customers and partners, and the Ceph community join forces to discuss things like the status of the Ceph project, recent Ceph project improvements and roadmap, and Ceph community news. The day ends with a networking reception, to foster more Ceph learning.

## Important Dates:

- CFP Opens: 2022-07-21
- CFP Closes: 2022-08-17
- Schedule Announcement: 2022-08-22
- Event Date: 2022-09-13

## Agenda

<table style="width:100%">
  <tr>
   <td style="width:10%">Time
   </td>
   <td style="width:50%">Abstract
   </td>
   <td style="width:40%">Speaker
   </td>
  </tr>
  <tr>
   <td>9:00 AM
   </td>
   <td>Welcoming
   </td>
   <td>Florian Moss
   </td>
  </tr>
  <tr>
   <td>9:15 AM
   </td>
   <td>Community / Foundation
   </td>
   <td>Michael Perez
   </td>
  </tr>
  <tr>
   <td>9:30 AM
   </td>
   <td>Sponsor Talk TBD
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>9:45 AM
   </td>
   <td><p class="semibold">Ceph at Scale</p>
   <p class="p">A few years ago we started using Ceph in Workday DCs for block and object storage for a number of services delivering improved resiliency, performance and the ability to scale at will As we’ve expanded our footprint we’ve doubled the number of clusters in less than a year, and increased the raw storage from just 3 PB to more than 25 PB; heading for over 65 PB We will discuss the delivery of this explosive growth and the challenges we've encountered during this journey.</p>
   </td>
   <td>Vasyl Purchel
   </td>
  </tr>
  <tr>
   <td>10:20 AM
   </td>
   <td><p class="p">The Ceph object gateway now has a layering API based on stackable modules/drivers, similar to Unix filesystems (VFS). The composability offered by these changes has resulted in a surge of interest, and there are several store driver SALs that exist in the community (Seagate CORTX, Intel DAOS, SUSE s3gw). When a store driver is in use, the Ceph object gateway isn't dependent on a RADOS cluster.</p>
   </td>
   <td>Brett Niver
   </td>
  </tr>
  <tr>
   <td>10:55 AM
   </td>
   <td>BREAK
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>11:15 AM
   </td>
   <td><p class="semibold">Introducing Sibench: A New Open Source Benchmarking Optimized for Ceph</p>
   <p class="p">Benchmarking Ceph has always been a complex task - there are lots of tools but many have drawbacks and are written for more general-purpose use. For Ceph we need to benchmark Librados, RBD, CephFS, and RGW and each of these protocols has unique challenges and typical deployment scenarios. Not only that, Ceph works better at scale and so we need to ensure that we can build a benchmarking system that will also scale and be able to generate an adequate load at large scale.</p>
   </td>
   <td>Danny Abukalam
   </td>
  </tr>
  <tr>
   <td>11:45 AM
   </td>
   <td>BREAK
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>12:50 PM
   </td>
   <td><p class="semibold">Over a billion requests served per day: Ensuring
   everyone is happy with our Ceph clusters’ performance</p>
   <p class="p">We built a distributed software-defined Quality of Service product that is running on Layer 7 of the OSI model, which sits in front of our Ceph clusters. This allows us to do aggregated QoS and traffic shaping on multiple dimensions. The flows are controlled through policies generated based on instantaneous usage patterns. These policies can be applied on various combinations of IP addresses, Ceph users, S3 buckets, number of simultaneous connections, as well as request type.</p>
   </td>
   <td>Jane Zhu
   </td>
  </tr>
  <tr>
   <td>1:25 PM
   </td>
   <td><p class="semibold">Auto resource allocation for distributed storage system</p>
   <p class="p">After studying comparison among mclock and WPQ scheduler came across it’s drawbacks in some situations and figured out new dynamic auto resource scheduler algorithm In auto resource allocation any of the request type is completed it auto assigns resources to that request where it needs that resource also when we have multiple requests of same type and same resources then based on priority which request to process also automatically changes the scheduler parameter values based on its intelligence</p>
   </td>
   <td>Sunil Angadi
   </td>
  </tr>
  <tr>
   <td>2:00 PM
   </td>
   <td>BREAK
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>2:20 PM
   </td>
   <td><p class="p">A talk around and how to provide S3 static webpages with the Radosgw.  When using RadosGW in a multitenant-setup with keystone Static-Webpages will not work out of the box. The talk will provide some handy configurations to make it work even with https and custom-certificates and userprovided domains, much like github-pages work.  The talk takes a dive into the RadosGW, the ACME protocol (letsencrpt) and Haproxy.
We built a distributed software-defined Quality of Service product that is running on Layer 7 of the OSI model, which sits in front of our Ceph clusters. This allows us to do aggregated QoS and traffic shaping on multiple dimensions. The flows are controlled through policies generated based on instantaneous usage patterns. These policies can be applied on various combinations of IP addresses, Ceph users, S3 buckets, number of simultaneous connections, as well as request type.</p>
   </td>
   <td>Ansgar Jazdzewski
   </td>
  </tr>
  <tr>
   <td>2:50 PM
   </td>
   <td><p class="semibold">Data Security and Storage Hardening in Rook and Ceph</p>
   <p class="p">We explore the security model exposed by Rook with Ceph, the leading software-defined storage platform of the Open Source world. Digging increasingly deeper in the stack, we examine hardening options for Ceph storage appropriate for a variety of threat profiles. Options include defining a threat model, limiting the blast radius of an attack by implementing separate security zones, the use of encryption at rest and in-flight and FIPS 140-2 validated ciphers, hardened builds and default configuration, as well as user access controls and key management. Data retention and secure deletion are also addressed. The very process of containerization creates additional security benefits with lightweight separation of domains. Rook makes the process of applying hardening options easier, as this becomes a matter of simply modifying a .yaml file with the appropriate security context upon creation, making it a snap to apply the standard hardening options of Ceph to a container-based storage system.</p>
   </td>
   <td>Federico Lucifredi
   </td>
  </tr>
  <tr>
   <td>3:25 PM
   </td>
   <td><p class="semibold">Ceph Crash Telemetry - Observability in Action</p>
   <p class="p">To increase product observability and robustness, Ceph’s telemetry module allows users to automatically report anonymized crash dumps. Ceph’s telemetry backend runs tools that detect similarities among these reported crash events, then feed them to Ceph’s bug tracking system. In this session we will explore Ceph crash telemetry end-to-end, and how it helps the developer community to detect emerging and frequent issues encountered by production systems in the wild. We will share our insights so far, and learn how users benefit from this module, and how they can contribute.
   </td>
   <td>
   Yaarit Hatuka
   </td>
  </tr>
  <tr>
   <td>
   3:55 PM
   </td>
   <td>Let's go from YAML files to Ceph Cluster in Kubernetes with this intro talk about Rook.
Rook is an open source cloud-native storage operator for Kubernetes, providing the platform, framework, and support for Ceph to natively integrate with Kubernetes. The recent features in the v1.10 release will be covered to further illustrate how Rook continues to be enhanced for production environments.
The Rook project will be introduced to attendees of all levels and experiences.
   <td>
   Alexander Trost
   </td>
  </tr>

</table>
