---
title: "Implementing a more scalable storage management framework in openATTIC 3.0"
date: "2017-04-19"
author: "admin"
tags: 
  - "planet"
---

Over the course of the last years, we've been working on expanding and enhancing both our "traditional" local storage management functionality (NFS/CIFS/iSCSI on top of local attached disks) as well as the Ceph management features in openATTIC.

Along the way, it became more and more clear to us that our current approach for managing storage locally does not scale well, as it requires openATTIC to be installed on every node.

When openATTIC was originally started, this wasn't so much of a concern, but today's IT infrastructures are evolving and demand more flexibility and scalability. Also, our goal of making it possible for an administrator to make changes on the command line outside of openATTIC is difficult to achieve in the current local storage implementation, in which the Django models are considered to be the "single source of truth" of a server's storage configuration.

The ongoing development of additional Ceph management functionality based on [DeepSea](https://github.com/SUSE/DeepSea) and [Salt](https://saltstack.com/salt-open-source/) allowed us to gather a lot of experience in implementing a more scalable approach using these frameworks and make it possible to decouple openATTIC from the node delivering the actual service. Communicating with a Salt master via the [Salt REST API](https://docs.saltstack.com/en/latest/ref/netapi/all/salt.netapi.rest_cherrypy.html) also enables us to separate the management UI (openATTIC) from the admin node (the Salt master).

Based on these findings, we wanted to create a playground for our developers to apply the lessons learned to the openATTIC code base. We therefore moved the current openATTIC 2.0 implementation into a separate 2.x git branch and have started working on version 3.x in the current master branch. Note that this will not be a complete rewrite of openATTIC, but rather an adaption/refinement of the existing code base.

In addition to the already existing Ceph management functionality based on librados (e.g. Ceph Pool management, RBD management), we're currently working on adding more Ceph-based storage management functionality e.g. managing iSCSI targets as well as NFS volume management via [NFS Ganesha](https://github.com/nfs-ganesha/nfs-ganesha).

The focus in this 3.0 branch will be on completing the Ceph-related management functionality first, while aiming at being able to implement the "traditional" storage management functionality using this framework (e.g. providing storage services based on node-local disks) at a later step. Salt already includes a large number of modules for these purposes.

As usual, we welcome your feedback and comments! If you have any ideas or if you can help with implementing some of these features, please [get involved](/get-involved.html)!

Source: SUSE ([Implementing a more scalable storage management framework in openATTIC 3.0](https://www.openattic.org/posts/implementing-a-more-scalable-storage-management-framework-in-openattic-30/))
