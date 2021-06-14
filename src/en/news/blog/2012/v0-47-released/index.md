---
title: "v0.47 released"
date: "2012-05-21"
author: "sage"
tags: 
  - "planet"
---

It’s been another three weeks and v0.47 is ready.  The highlights include:

- mon: admin tools to control unwieldy clusters (temporarily block osd boots, failures, etc.)
- osd: reduced memory footprint for peering/thrashing
- librbd: write-thru cache mode
- librbd: improved error handling
- osd: removal of ill-conceived ‘localized pg’ feature (those annoying PGs with ‘p’ in them)
- rest-bench: simple tool to benchmark radosgw (or S3) (based on ‘rados bench’ command)

In truth it wasn’t the most productive sprint because of the work that went into the launch of the web sites, the launch party, and the subsequent inebriation.  However, the new RBD caching feature is looking very good at this point, and patches are working their way upstream in Qemu/KVM to enable it with the generic ‘cache=writethrough’ or ‘cache=writeback’ settings.

One other noteworthy item is that I generated [a new PGP key to sign releases](https://raw.github.com/ceph/ceph/master/keys/release.asc) with.  The key is now in ceph.git, and has been signed by my personal key.  If you are installing debs from our repositories, you’ll want to add the new key to your APT keyring to avoid annoying security warnings.

For v0.48, we are working on a ceph-osd refactor to improve threading and performance, multi-monitor and OSD hotplugging support for upstart and Chef, improvements to the OSD and monitor bootstrapping to make that possible, and RBD groundwork for the much-anticipated layering feature.

You can get v0.47 from the usual places:

- Git at git://[github.com/ceph/ceph](http://github.com/ceph/ceph).git
- Tarball at [http://ceph.newdream.net/download/ceph-0.47.tar.gz](http://ceph.newdream.net/download/ceph-0.47.tar.gz)
- For Debian/Ubuntu packages, see [http://ceph.newdream.net/docs/master/install/debian](http://ceph.newdream.net/docs/master/install/debian)

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/releases/v0-47-released/&bvt=rss&p=wordpress)
