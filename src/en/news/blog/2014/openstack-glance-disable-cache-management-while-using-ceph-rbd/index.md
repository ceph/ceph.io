---
title: "OpenStack Glance: disable cache management while using Ceph RBD"
date: "2014-11-03"
author: "shan"
tags: 
  - "planet"
---

![](images/glance-rbd-disable-cache.jpg "OpenStack Glance: disable cache management while using Ceph RBD")

The OpenStack documentation often recommends to enable the Glance cache while using the default store `file`, with the Ceph RBD backend things are slightly different.

Depending on how you are consuming your Cloud platform, using the `keystone+cachemanagement` in Glance can be extremely harmful. Enabling this cache will result in images getting cached in your OpenStack controllers under `/var/lib/glance/image-cache/` everytime an image goes into `/var/lib/nova/instances/_base`. Implying that you booted a virtual machine, just think about a 50 GB big Windows image, now think about 10 of them. This will potentially lead to a full system sooner or later unless your entire `/var/` is mounted on a big volume. Everytime a virtual machine is booted often, this image will go into the cache.

As mentioned, the cache gets activated when an image goes into `/var/lib/nova/instances/_base`, this can happen during multiple circumstances:

- You are using Juno but you are using QCOW2 images (**for Ceph we want RAW images**)
- You are using an OpenStack version prior to Juno and didn't apply the patch that provides support for COW clones

This means that People only using RAW images and the COW clones in Nova will not be affected since nothing goes into `/var/lib/nova/instances/_base`. Everything is happening at the Ceph level (image snapshot and clone creation).

Now assuming your cache was enabled, let's check the images present in the cache:

\`\`\`bash $ glance-cache-manage list-cached Found 1 cached images... ID Last Accessed (UTC) Last Modified (UTC) Size Hits

* * *

2a178579-f203-4f4c-91e9-3f8012178bf5 N/A 2014-04-25T19:27:21 2361393152 0 \`\`\`

Delete the cached images:

`bash $ glance-cache-manage -f delete-all-cached-images $ glance-cache-manage list-cached No cached images.`

Now it is time to disable it, edit your `/etc/glance/glance-api.conf`:

```
[paste_deploy]
flavor = keystone
```

Then restart Glance:

`bash $ sudo glance-control all restart`

  

> Ceph doc impact has already been [submitted and merged](https://github.com/ceph/ceph/pull/2835).
