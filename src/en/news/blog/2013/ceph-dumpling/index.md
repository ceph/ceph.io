---
title: "Ceph Dumpling"
date: "2013-08-18"
author: "nwl"
tags: 
  - "release"
---

The Ceph community just finished its latest three-month cycle of development, culminating in a new major release of Ceph called “Dumpling,” or v0.67 for those of a more serious demeanor.

Inktank is proud to have contributed two major pieces of functionality to Dumpling.

1\. **Global Namespace and Region Support** – Many service providers and IT departments want to deploy object storage using the region and zone concepts familiar to users of Amazon Web Services. In this release, the S3 and Swift API compatible Ceph Object Gateway has been extended to enable this capability. Organizations using Ceph can now have multiple, geographically dispersed gateways to be connected together into a single, logical system with a single, global namespace. Users can then choose from multiple zones per region and to place multiple copies of the same object in different physical locations for resiliency.

This new eventually-consistent connected architecture also serves as a foundation for additional features for multi-site storage that are coming soon on the Ceph roadmap. In the next release, an entire zone will be able to be copied to separate data centers. This enables not only the implementation of disaster recovery architectures but also read-affinity based policies to guide users to the nearest available copy of their data. We only just missed getting this feature into the Dumpling release and are working to get the external agents that power the copying of data between clusters out in the next few weeks.

2\. **Ceph REST API for monitoring and management functions** relating to the Ceph Storage Cluster itself (RADOS). While software-defined storage has multiple meanings, for Inktank having a programmatically driven architecture is core and the new API means that administrators can now easily hook Ceph into their existing monitoring or management systems. We’re really interested to see what integrations the Ceph community can now build through the API!

On the **Ceph Block Storage** (RBD) side, we were excited to see external projects continuing to integrate Ceph into their cloud solutions. Citrix released a tech preview of their XenServer hypervisor product with support for RBD; the full release is slated for later in the year. Documentation was also provided for Red Hat’s new community OpenStack distribution – RDO, also showing how to use RBD as part of a RHEL-based deployment. Finally, full support for RBD was merged into the code base for the upcoming Apache CloudStack 4.2 release by joint-community member Wido den Hollander.

We’re really proud of Ceph Dumpling and invite users and developers to join us on on IRC (#ceph on OFTC) or on the ceph-devel and ceph-user mailing lists to share their feedback. You can also join our [Dumpling Webinar](http://www.inktank.com/webinars/ "Dumpling Webinar") on September 5th to learn more.

