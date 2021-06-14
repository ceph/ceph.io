---
title: "XenServer Support for RBD"
date: "2013-07-08"
author: "nwl"
tags: 
---

Ceph has been enjoying tremendous success in the Openstack and Cloudstack communities, and a large part of this is due to the ease of using the Ceph block device (RBD) with the KVM or the open-source Xen hypervisor . This was achieved through patches that were made by Josh Durgin, an Inktank engineer, to Qemu and libvirt which are two generic virtualizations tools used by the hypervisors.

Today, we are pleased to announce that a tech preview of RBD support for Citrix’s XenServer is also now available. XenServer is the fully supported, commercial product that Citrix sell, based on open-source Xen. XenServer itself was also open-sourced by Citrix two weeks ago and, as part of this process, the development team committed themselves to using upstream tools like Qemu and libvirt. As part of this architectural change, this meant they could now benefit from integrations with projects such as Ceph and the release of the tech preview now means Openstack and Cloudstack with Ceph can be deployed on top of XenServer.

The Tech Preview will be followed towards the end of the year by a fully supported version of the XenServer product by Citrix. In the meantime, for technical information about how to deploy the technology, check out the [blog post](http://xenserver.org/blog/entry/tech-preview-of-xenserver-libvirt-ceph.html) by Citrix’s Dave Scott over at the new XenServer website.

It’s exciting to see so many upstream communities integrating with Ceph, such as KVM, Xen, XenServer, Ganeti, Proxmox and others. If you’d like to discuss ways to integrate Ceph with other open-source projects please let us know on the mailing list or feel free to submit a proposal for the next [Ceph Developer Summit](http://wiki.ceph.com/01Planning/CDS/Emperor)!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/xenserver-support-for-rbd/&bvt=rss&p=wordpress)
