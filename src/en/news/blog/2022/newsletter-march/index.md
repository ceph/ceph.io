---
title: Ceph Community Newsletter March 2022 Edition
date: 2022-03-01
author: Mike Perez (thingee)
tags:
  - newsletter
---

## Ceph Quincy Release Canadidate v17.1.0 Is Now Available

This is the first release candidate for Quincy. The final release is slated for
the end of March.

This release has been through large-scale testing thanks to several
organizations, including Pawsey Supercomputing Centre, who allowed us to harden
cephadm and the ceph dashboard on their 4000-OSD cluster. Subsequent logical
scale testing went up to over 8000 OSDs in a cluster. One major improvement is
in quality of service - the mclock scheduler, providing quality of service for
ceph clients relative to background operations, is now the default. More
information on the scheduler can be found in the latest
[documentation](https://docs.ceph.com/en/latest/rados/configuration/mclock-config-ref/#mclock-profile-types).

You can see these improvements and more in the [release notes
preview](https://github.com/ceph/ceph/blob/quincy/PendingReleaseNotes) and
help contribute to the [pull request](https://github.com/ceph/ceph/pull/45048).

### Quincy RC Downloads

- [Git](git://github.com/ceph/ceph.git)
- [Tarball](https://download.ceph.com/tarballs/ceph-17.1.0.tar.gz)
- [Containers](quay.ceph.io/ceph-ci/ceph@sha256:eadcf0385e99e595a865bcb02845b42e11bb55a62165b1403f954d2f7c4e1e07)
- [Packages](https://docs.ceph.com/docs/master/install/get-packages)

## Ceph at SREcon22 Americas

We are happy to announce Ceph will be sponsoring [SREcon22
Americas](https://www.usenix.org/conference/srecon22americas)! Come visit us at
our booth for discussions, play with a [Ceph cluster on Raspberry
PIs](https://ceph.io/en/news/blog/2022/install-ceph-in-a-raspberrypi-4-cluster/),
and get a Pacific shirt before they are all gone!

![Ceph Pacific release shirt](images/pacific-shirt.png)

## User + Developer Monthly Meetup

In October 2021, the [User + Dev Monthly
Meetup](https://pad.ceph.com/p/ceph-user-dev-monthly-minutes) was started with
the goal for Ceph users to interact with developers directly.

- Share their experience running Ceph clusters
- Provide feedback on Ceph versions they are using
- Ask questions and raise concerns on any matters related to Ceph
- Provide documentation feedback and suggest improvements

Topics such as design ideas or feature improvements will continue to be
discussed in the [Ceph Development
Monthly](https://tracker.ceph.com/projects/ceph/wiki/Planning) meeting.

Meetings occur on the third Thursday of the month, so join us for the following discussion on March 17th at 15:00 UTC.

## Meet the Ceph Ambassadors

The [Ceph Ambassadors](https://ceph.io/en/community/ambassadors/) are
representatives of Ceph. Ambassadors help people understand Ceph and the
ongoing work. Additionally, Ambassadors help grow the community and act as
a liaison to other adjacent FLOSS projects. See the available Ambassadors in
your region and consider reaching out for assistance with your next meet-up,
blog post, CFP assistance, and more!

![Ceph Ambassadors](images/amassador-pin.png)

## Ceph Blog

- [Install Ceph in a Raspberry Pi 4 Cluster](https://ceph.io/en/news/blog/2022/install-ceph-in-a-raspberrypi-4-cluster/)
- [Submit your own post!](https://ceph.io/en/news/contribute)

## Planet

- [CentOS Stream 8 & 9 release cephadm package 16.2.7](https://blog.centos.org/2022/02/centos-community-newsletter-february-2022/)

## Releases

- [Quincy RC](https://download.ceph.com/tarballs/)
- [v16.2.7 Pacific](https://ceph.io/en/news/blog/2021/v16-2-7-pacific-released/)

## Upcoming Conferences

- [SRECon March 14-16th](https://www.usenix.org/srecon)
- [KubeCon EU March 17-20th](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe)
- [Cephalocon 2022
  Postponed](http://localhost:8080/en/news/blog/2022/community-newsletter-february/#cephalocon-2022-postponed)
- [Ceph CFP coordination pad](https://pad.ceph.com/p/cfp-coordination)

## Ceph Jobs

<table>
  <tr>
   <th>
   Date Posted
   </th>
   <th>
   Company
   </th>
   <th>
   Title
   </th>
   </tr>
   <td>Feb 24, 2022
   </td>
   <td>SoftIron
   </td>
   <td><a href="https://softiron.bamboohr.com/jobs/view.php?id=75&source=aWQ9MTU%3D">Senior SMB Protocol Engineer</a>
   </td>
  </tr>
  <tr>
   <td>Feb 24, 2022
   </td>
   <td>SoftIron
   </td>
   <td><a href="https://softiron.bamboohr.com/jobs/view.php?id=76&source=aWQ9MTU%3D">Senior Software Engineer</a>
   </td>
  </tr>
  <tr>
   <td>Feb 24, 2022
   </td>
   <td>SoftIron
   </td>
   <td><a href="https://softiron.bamboohr.com/jobs/view.php?id=70&source=aWQ9MTU%3D">Solutions Architect (Germany - Remote)</a>
   </td>
  </tr>
  <tr>
   <td>Feb 24, 2022
   </td>
   <td>SoftIron
   </td>
   <td><a href="https://softiron.bamboohr.com/jobs/view.php?id=69&source=aWQ9MTU%3D">Software Engineer, C++/Boost and Software Defined Storage</a>
   </td>
  </tr>
  <tr>
   <td>Feb 24, 2022
   </td>
   <td>SoftIron
   </td>
   <td><a href="https://softiron.bamboohr.com/jobs/view.php?id=68&source=aWQ9MTU%3D">Software Engineer, SONiC and Software Defined Networking</a>
   </td>
  </tr>
  <tr>
   <td>Feb 24, 2022
   </td>
   <td>SoftIron
   </td>
   <td><a href="https://softiron.bamboohr.com/jobs/view.php?id=59&source=aWQ9MTU%3D">Systems Engineer (Singapore)</a>
   </td>
  </tr>
  <tr>
   <td>Feb 22, 2022
   </td>
   <td>SUSE
   </td>
   <td><a href="https://jobs.suse.com/us/en/job/71002781/Software-Engineer-Software-Defined-Storage">Software Engineer - Software Defined Storage</a>
   </td>
  </tr>
  <tr>
   <td>Feb 22, 2022
   </td>
   <td>SUSE
   </td>
   <td><a href="https://jobs.suse.com/us/en/job/71002781/Software-Engineer-Software-Defined-Storage">Software Engineer, C++/Boost and Software Defined Storage</a>
   </td>
  </tr>
  <tr>
   <td>Feb 22, 2022
   </td>
   <td>Bloomberg
   </td>
   <td><a href="https://careers.bloomberg.com/job/detail/81144?qe=Senior+Software+Engineer+-+Storage+Engineering">Senior Software Engineer - Storage Engineering</a>
   </td>
  </tr>
  <tr>
   <td>Feb 22, 2022
   </td>
   <td>clyso
   </td>
   <td><a href="https://www.clyso.com/en/linux-open-source-developer/">Linux Open Source Developer (m/f/d) – Cloud Infrastructure</a>
   </td>
  </tr>
  <tr>
   <td>Feb 22, 2022
   </td>
   <td>croit
   </td>
   <td><a href="https://www.croit.io/career/ceph-developer">Senior C++ Ceph Developer m/f/d</a>
   </td>
  </tr>
  <tr>
   <td>Feb 11, 2022
   </td>
   <td>Scaleway
   </td>
   <td><a href="https://scaleway-25152556.hubspotpagebuilder.eu/freelance-golang-ceph">Freelance Golang backend developer with Ceph experience</a>
   </td>
  </tr>
  <tr>
   <td>Oct 26, 2021
   </td>
   <td>Bloomberg
   </td>
   <td><a href="https://careers.bloomberg.com/job/detail/81144?qe=Senior+Software+Engineer+-+Storage+Engineering">Senior Software Engineer - Storage Engineer</a>
   </td>
  </tr>
  <tr>
   <td>Aug 30, 2021
   </td>
   <td>Safespring
   </td>
   <td><a href="https://www.safespring.com/career/ceph-engineer/">Ceph Engineer - Infrastructure Team</a>
   </td>
  </tr>
  <tr>
   <td>Aug 30, 2021
   </td>
   <td>Canonical
   </td>
   <td><a href="https://canonical.com/careers/3326693/linux-engineering-open-source-remote">Senior Software Engineer - Linux Engineering</a>
   </td>
  </tr>
  <tr>
   <td>Aug 30, 2021
   </td>
   <td>Canonical
   </td>
   <td><a href="https://canonical.com/careers/1861978/software-engineer-ceph-and-distributed-storage-remote">Software Engineer, Ceph & Distributed Storage</a>
   </td>
  </tr>
  <tr>
   <td>Aug 30, 2021
   </td>
   <td>Canonical
   </td>
   <td><a href="https://canonical.com/careers/3039369/ceph-and-software-defined-storage-product-manager-remote">Ceph and software-defined storage product manager</a>
   </td>
  </tr>
</table>

[Submit your job posting](https://ceph.io/en/community/jobs/)
