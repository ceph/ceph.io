---
title: "Red Hat Ceph Storage 5: Livin' La Vida Loca"
date: "2021-05-14"
author: "admin"
tags: 
  - "planet"
---

## _The Red Hat Ceph Storage life cycle: upgrade scenarios and long-lived deployments_

_with Sean Murphy (Red Hat)_

Different industries have varying requirements for the software systems on which their respective businesses rely. Some operators choose to quickly embrace the latest and greatest release when facing change and integration updates. Others defer upgrades for as long as possible, trying to continue on a tried-and-true combination of software components until end-of-support (or security patching) forces a change.

The distinction is somewhat artificial, as most operators really adopt a combination of the two strategies for different parts of their infrastructure. The Red Hat Ceph Storage life cycle aims to address both faster and slower movers. In this post, we’ll share how we’re helping customers stay current while also providing longer life cycle options where needed.

# Software Changes, our Commitment Doesn’t

A phrase some of us use when working with customers on their IT evolution process is, “software changes, our commitment doesn’t.”

The expression implies that the mechanics of how stuff gets done in software systems necessarily changes over time, but these changes should ideally be of little concern (and eventually even of little interest), and present as little disruption as possible to customers keeping pace.

One example is compatibility between minor releases. Once a customer has deployed a major release of Red Hat Ceph Storage (at the time of writing, this would be Red Hat Ceph Storage 4), they can fully expect to be able to upgrade for three years (or even longer, as we shall see shortly) without updating integration with other components, or re-testing compatibility in staging environments.

# The Ceph life cycle and Red Hat Ceph Storage

Red Hat is a leading contributor in the [Ceph Community](https://ceph.io/), which releases a new major release of the project annually, usually named with a cephalopod-related theme—recently we had Luminous and Nautilus, and Pacific was just released a few days ago.

Red Hat products are built on the community project, tested for months before release, and then supported for our enterprise customers with a three-year life cycle. In this manner, Luminous became Red Hat Ceph Storage 3, and Pacific will soon become—after almost a year of grueling testing work by our quality team—Red Hat Ceph Storage 5.

Customers can count on [36 months of standard support](https://access.redhat.com/product-life-cycles?product=Red%20Hat%20Ceph%20Storage) on Red Hat Ceph Storage major releases, including feature [backports during the first 12 months](https://access.redhat.com/support/policy/updates/ceph-storage). Generally customers are not looking for additional features in cycle, but they do rely on the bug fixes delivered during this period—sometimes in hours as part of critical hotfix processes that shield customers from any extended downtime.

Our six-week cadence for minor releases is less dramatic yet just as useful. We offer regular, predictable security and bug fixes for less pressing routine maintenance to the customer’s operations.

We are proud to have exceeded our 12 and 36-month published life cycle for major versions of Red Hat Ceph Storage shipped by Red Hat in the past six years, going above and beyond to assist our customers as different occasions arose.

We strive to ensure that minor version upgrades do not alter features in an incompatible fashion, or reduce storage client compatibility. The development team schedules any change breaking compatibility for the next major version, and not during a minor release cycle. Customers can therefore integrate to a major version and carry out minimal testing for minor version upgrades.

We use APIs in our networked storage to insulate customers from implementation details. This is one way we address security concerns in the underlying software, but avoid causing compatibility issues.

# The Red Hat Ceph Storage software life cycle

Today, Red Hat Ceph Storage succeeds in addressing both faster and slower movers by jointly working with customers on planning and enabling them to stay current, while also providing longer life cycle options where more time is required. The latter path relies on our Extended Lifecycle Support (ELS) offering.

A number of Red Hat customers make the move to newer major versions of Red Hat Ceph Storage during the first year since its initial release. We like that, as newer versions have more features for the customer and more robust and easier to support — everybody wins!

Ceph Storage is the flagship software-defined storage component of our software infrastructure offerings. It powers Red Hat Openstack Platform in major telcos around the globe, underpins a number of our Red Hat OpenShift deployments across industries with Red Hat OpenShift Container Storage, and serves as the foundation for global enterprises’ most valuable asset next to their employees - their data.

We also have a number of customers who prefer to stay with a Red Hat Ceph Storage release for longer than three years. For example, Red Hat Ceph Storage is tightly coupled with Red Hat OpenStack Platform releases. Some of our customers choose to operate a cloud for five years, and then replace that wholesale with next-generation hardware and software, rather than performing in-place upgrades. The telco industry, likewise, has long refresh cycles.

These customers (and others) are the reason we offer Extended Lifecycle Support (ELS), stretching further the life of a Ceph Storage release.

# Extended Lifecycle Support and Red Hat Ceph Storage 3 end-of-life

ELS for Red Hat Ceph Storage 3 began, as one would expect, when the standard support period of the Red Hat Ceph Storage 3 release concluded at the end of February 2021. Some of you may recall seeing a [notice](https://www.redhat.com/en/blog/red-hat-announces-product-life-cycle-changes) from the Customer Experience team from April 2020 extending the full support phase of Red Hat Ceph Storage 3 by three months. This was done to facilitate customers affected by COVID-19, which limited staff availability and physical access to data centers.

Just as we want our customers to stay current with software updates, we too in Product Management need to stay current with our customers to better understand what we can do to help them be successful and enable them to move forward with us. To that end, we made some additions to the Red Hat Ceph Storage ELS program in 2020, reflecting what we have heard from customers of the extended life cycle program for release 2.

Through customer engagement over time, we’ve learned that requiring customers to be on the latest point release of a Red Hat Ceph Storage version was not always desirable for the customer, even if running an older point release limited the availability of bug fixes.

Consequently, starting with the ELS program for Red Hat Ceph Storage 3, while bug fixes continue to be supplied only for the latest dot release of that major version, technical support including troubleshooting assistance and work-arounds will be provided for dot releases of that major release. The customer is required to upgrade to the latest point release only if a fix is required to address an issue, which is often not the case for environments that have already been in production for years.

Contact your Red Hat account representative for inquiries and to purchase the extended support add-on.

# Now available: Red Hat Ceph Storage 5 Beta 6

We are taking this occasion to announce that Red Hat Ceph Storage 5 has entered the beta phase of its development. We want to note very clearly that Red Hat Ceph Storage 5 Beta is early access and provided with no support. Do not upgrade a production installation to an early access release!

Red Hat Ceph Storage 5 Beta 6 is available via [anonymous FTP](ftp://partners.redhat.com/d960e6f2052ade028fa16dfc24a827f5). The container image is [available through the Red Hat Container Catalog](https://access.redhat.com/containers-r6/?hide_beta=false#/search/ceph-5). Please submit feedback through your Red Hat contact or via [Red Hat Bugzilla](https://bugzilla.redhat.com/).

# We’re ready to support you

As our portfolio platforms and software-defined storage evolve, we continue to work across the organization to evolve our own process for delivering and to align life cycles and planning horizons to stay ahead of our customers and partners’ needs.

Across all industries and sectors public and private, as business and operational needs evolve over time and software infrastructure technologies start to resemble living, breathing entities, life cycle considerations will present increasing challenges for IT professionals. We intend to continue incenting staying current, while accommodating the need for less rapid upgrade scenarios in the real world. And we are listening.

Cross-posted to the [Red Hat Blog](https://www.redhat.com/en/blog/understanding-red-hat-ceph-storage-life-cycle).

Source: Federico Lucifredi ([Red Hat Ceph Storage 5: Livin' La Vida Loca](https://f2.svbtle.com/red-hat-ceph-storage-5-livin-la-vida-loca))
