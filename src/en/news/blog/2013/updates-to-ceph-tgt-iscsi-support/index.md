---
title: "Updates to Ceph tgt (iSCSI) support"
date: "2013-11-12"
author: "dmick"
tags: 
---

In [a previous blog post](http://ceph.com/dev-notes/adding-support-for-rbd-to-stgt/) I introduced work we’ve done to the user-space [tgt iSCSI project](http://stgt.sourceforge.net/) to allow exporting RADOS block device (rbd) images as iSCSI targets. I’ve recently taken a short break from working on the [Calamari](http://www.inktank.com/enterprise/) project to update that support to bypass some limitations and add some functionality.

The **tgt-admin** utility now works with the rbd backend **bs\_rbd**. **tgt-admin** is used to set up tgtd from a target-configuration file, and is typically used at boot time, so this makes it handier to have persistent targets mapped on a host.

There is no more 20-rbd-image-per-tgtd limit.

**tgtadm** accepts a new **–bsopts** parameter for each mapped image to set **bs\_rbd** options:

- conf=<path-to-ceph.conf> allows you to refer to a different ceph cluster for each image (each image has its own cluster connection)
- id=<client-id> allows each image to use a different Ceph client id, which allows per-client configuration for each image (including things like permissions, log settings, rbd cache settings, etc.) The full client name will be “client.<client-id>” in normal Ceph fashion. (The default id is “admin”, as usual, for a default client name of “client.admin”.)

So, for example, you might use

tgtadm --lld iscsi --mode logicalunit --op new --tid 1 --lun 1 --bstype rbd --backing-store public-image --bsopts "conf=/etc/ceph/pubcluster.conf;id=public"

to establish a target in the “pubcluster” for an image named “public-image” whose configuration is expressed in sections named “client.public”. (The doublequotes are required to hide the ‘;’ bsopts separator from the shell.)

You can pick up packages built with the Ceph rbd support from the Debian and RPM repositories at [http://ceph.com/packages/ceph-extras](http://ceph.com/packages/ceph-extras).

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/dev-notes/updates-to-ceph-tgt-iscsi-support/&bvt=rss&p=wordpress)
