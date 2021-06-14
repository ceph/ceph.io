---
title: "Ceph is in EPEL, and why Red Hat users should care"
date: "2013-03-28"
author: "sage"
tags: 
  - "ceph"
  - "planet"
---

EPEL is [Extra Packages for Enterprise Linux](http://fedoraproject.org/wiki/EPEL), a project that ports software that is part of the Fedora community distribution to the slower-moving RHEL ([Red Hat Enterprise Linux](http://www.redhat.com/products/enterprise-linux/)) distribution (and its derivatives) used by many enterprises. One problem for RHEL users is that although the distribution tends to be rock solid, that stability comes at a price: it can be very difficult to run newer software (like all this newfangled “cloud” stuff). Many organizations adopting Ceph face this challenge, particularly when it comes to support for librbd in the Qemu/KVM hypervisor.

Although the Ceph packages in EPEL are essentially equivalent to [the packages we build and provide over at Ceph.com](http://ceph.com/docs/master/install/rpm/), having them available in EPEL is convenient for many RHEL users, and can avoid potential policy pitfalls in large organizations.  More importantly, however, EPEL is a stepping stone for inclusion into RHEL itself.  We are still working on the last piece of the puzzle: getting librbd support built into a RHEL version of KVM, which is important for many users deploying cloud platforms like OpenStack and CloudStack.  If you are a Red Hat customer, and would like to see Ceph available in RHEL 6.5 or 7, now is the time to tell your Red Hat account manager.

![](http://track.hubspot.com/__ptq.gif?a=265024&k=14&bu=http%3A%2F%2Fwww.inktank.com&r=http%3A%2F%2Fwww.inktank.com%2Fceph%2Fceph-is-in-epel-and-why-red-hat-users-should-care%2F&bvt=rss&p=wordpress)
