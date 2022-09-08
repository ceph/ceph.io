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

<a class="button" href="https://www.eventbrite.com/e/ceph-days-dublin-2022-tickets-388837191507" rel="noreferrer noopener" target="_blank">Register</a>
<a class="button" href="https://ceph.io/assets/pdfs/ceph-days-dublin-sponsor-prospectus.pdf" rel="noreferrer noopener" target="_blank">Sponsor Ceph Days Dublin</a>


## Agenda

<table style="width:100%">
  <tr>
   <td style="width:20%">Time
   </td>
   <td style="width:50%">Abstract
   </td>
   <td style="width:30%">Speaker
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
   <td>Ceph at Scale A few years ago we started using Ceph in Workday DCs for block and object storage for a number of services delivering improved resiliency, performance and the ability to scale at will As we’ve expanded our footprint we’ve doubled the number of clusters in less than a year, and increased the raw storage from just 3 PB to more than 25 PB; heading for over 65 PB We will discuss the delivery of this explosive growth and the challenges we've encountered during this journey
   </td>
   <td>Vasyl Purchel
   </td>
  </tr>
  <tr>
   <td>10:20 AM
   </td>
   <td>The Ceph object gateway now has a layering API based on stackable modules/drivers, similar to Unix filesystems (VFS). The composability offered by these changes has resulted in a surge of interest, and there are several store driver SALs that exist in the community (Seagate CORTX, Intel DAOS, SUSE s3gw). When a store driver is in use, the Ceph object gateway isn't dependent on a RADOS cluster.aaaa
   </td>
   <td>Kyle Bader
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
   <td>Benchmarking Ceph has always been a complex task - there are lots of tools but many have drawbacks and are written for more general-purpose use. For Ceph we need to benchmark Librados, RBD, CephFS, and RGW and each of these protocols has unique challenges and typical deployment scenarios. Not only that, Ceph works better at scale and so we need to ensure that we can build a benchmarking system that will also scale and be able to generate an adequate load at large scale.
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
   <td>We built a distributed software-defined Quality of Service product that is running on Layer 7 of the OSI model, which sits in front of our Ceph clusters. This allows us to do aggregated QoS and traffic shaping on multiple dimensions. The flows are controlled through policies generated based on instantaneous usage patterns. These policies can be applied on various combinations of IP addresses, Ceph users, S3 buckets, number of simultaneous connections, as well as request type.
   </td>
   <td>Jane Zhu
   </td>
  </tr>
  <tr>
   <td>1:25 PM
   </td>
   <td>After studying comparison among mclock and WPQ scheduler came across it’s drawbacks in some situations and figured out new dynamic auto resource scheduler algorithm In auto resource allocation any of the request type is completed it auto assigns resources to that request where it needs that resource also when we have multiple requests of same type and same resources then based on priority which request to process also automatically changes the scheduler parameter values based on its intelligence
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
   <td>I hope to enable Ceph administrators to provide static-hosted webpages out of the RadosGW/S3-bucket. It will also point to some improvements, that can be done to the Rados-Gateway itself so it will be easier to setup in the future.
   </td>
   <td>Ansgar Jazdzewski
   </td>
  </tr>
  <tr>
   <td>2:50 PM
   </td>
   <td>TBD
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>3:25 PM
   </td>
   <td>TBD
   </td>
   <td>
   </td>
  </tr>
</table>
