---
title: "Configure Ceph RBD caching on OpenStack Nova"
date: "2013-08-22"
author: "shan"
tags: 
---

![](images/rbd-caching-nova.jpg "Configure RBD caching on Nova")

By default, OpenStack doesn’t use any caching. However, you might want to enable the RBD caching.

As you may recall, the current implementation of the RBD caching is in-memory caching solution. Although, at the last Ceph Developer Summit (last week), was discussed the refactoring of the current implementation was discussed in order to bring a better caching solution. For more information, please refer to the official blueprint [here](http://wiki.ceph.com/01Planning/02Blueprints/Emperor/rbd%3A_shared_read_cache).

  

# I. Ceph configuration

Edit your `ceph.conf` with the following:

```
[client]
    rbd cache = true
    rbd cache writethrough until flush = true
```

Available flags:

```
rbd cache size = 
rbd cache max dirty = 
rbd cache target dirty = 
rbd cache max dirty age = 
```

For more detailed information check the [official documentation](http://ceph.com/docs/next/rbd/rbd-config-ref/).

  

# II. Nova configuration

Edit your `nova.conf` with:

```
disk_cachemodes="network=writeback"
```

Several options can be used depending on the disk type:

- file
- block
- network
- mount

Caching methods available:

- `none`,
- `writethrough`,
- `writeback`,
- `directsync`,
- `writethrough`,
- `unsafe`,

  

> That’s all for now. Please note that things changed in the version of libvirt above 1.2
