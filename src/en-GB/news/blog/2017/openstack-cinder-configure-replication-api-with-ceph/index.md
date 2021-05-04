---
title: "OpenStack Cinder configure replication API with Ceph"
date: "2017-06-19"
author: "admin"
tags: 
  - "planet"
---

![Title](images/openstack-cinder-replication-ceph-mirror-journaling.jpg)

I just figured out that there hasn’t been much coverage on that functionality, even though we presented it last year at the [OpenStack Summit](http://sebastien-han.fr/blog/2016/04/27/OpenStack-Summit-Austin-protecting-the-galaxy-Multi-Region-Disaster-Recovery-with-OpenStack-and-Ceph/).

## I . Rationale

What will follow is useful in the context of disaster recovery. This functionality was implemented during the Ocata cycle for the v2.1 replication in the RBD driver. In the context of disaster recovery, you typically have one primary site with your OpenStack and Ceph environment and on a secondary site you have another Ceph cluster. The secondary cluster is basically receiving copies of some of the Cinder block devices from the primary site.

This replication mechanism is possible with the help of the rbd-mirror daemon, responsible for replicated block devices from one cluster to another. So from an OpenStack perspective, we will have different Cinder backend/types with different capabilities. In the disaster recovery scenario, we will have a _replicated_ type. Under the hood, the RBD driver will apply two RBD features on the images created on that type: `journaling` and `exclusive-lock`. If you want to read more around RBD mirroring, I encourage you to read [my article about it](http://www.sebastien-han.fr/blog/2016/03/28/ceph-jewel-preview-ceph-rbd-mirroring/).

In an event of a failure, a failover is operated, this means each replicated volume is promoted to primary on the secondary cluster. In the meantime, you might have to force-detach and re-attach your volume to your virtual machine. Additionally, you might have to reboot the virtual machine completely if this guest was booted from a volume. Later new connection requests will receive connection information for the volume on the secondary cluster.

## II. Setup

The following implies that you already have two Ceph clusters up and running and that the RBD mirror daemon is configured. If you don’t know how to deploy such setup I encourage you to [read this article](http://www.sebastien-han.fr/blog/2016/05/09/Bootstrap-two-Ceph-and-configure-RBD-mirror-using-Ceph-Ansible/).

So let’s get into it, first create a new Cinder type:

<table><tbody><tr><td class="code"><pre><span class="line"><span class="section">$ cinder type-create replicated</span><br><span class="line">+--------------------------------------+------------+-------------+-----------+</span></span><br><span class="line"><span class="section">| ID                                   | Name       | Description | Is_Public |</span><br><span class="line">+--------------------------------------+------------+-------------+-----------+</span></span><br><span class="line"><span class="section">| 1f08657f-4486-4270-a4c7-c1822872c88e | replicated | - | True      |</span><br><span class="line">+--------------------------------------+------------+-------------+-----------+</span></span><br></pre></td></tr></tbody></table>

Then set the backend name and apply an extra argument to enabling replication on that type:

<table><tbody><tr><td class="code"><pre><span class="line">$ cinder type-key replicated set volume<span class="emphasis">_backend_</span>name=ceph</span><br><span class="line"></span><br><span class="line">$ cinder type-key replicated set replication<span class="emphasis">_enabled='&lt;is&gt; True'</span><br><span class="line"></span><br><span class="line"></span><span class="section">$ cinder extra-specs-list</span><br><span class="line">+--------------------------------------+------------+---------------------------------------------------------------------+</span></span><br><span class="line"><span class="section">| ID                                   | Name       | extra_specs                                                         |</span><br><span class="line">+--------------------------------------+------------+---------------------------------------------------------------------+</span></span><br><span class="line"><span class="section">| 16146866-3f4f-4c6e-918c-36cd0ebf1dc2 | replicated | {'replication_enabled': '&lt;is&gt; True', 'volume_backend_name': 'ceph'} |</span><br><span class="line">+--------------------------------------+------------+---------------------------------------------------------------------+</span></span><br></pre></td></tr></tbody></table>

Finally, define a secondary backend in `cinder.conf`:

```
[ceph]
...
replication_device = backend_id:secondary,
                     conf:/etc/ceph/secondary.conf,
                     user:cinder,
                     pool:volumes
```

You can now create a volume like this:

<table><tbody><tr><td class="code"><pre><span class="line">$ cinder <span class="keyword">create</span> --<span class="built_in">volume</span>-<span class="built_in">type</span> REPL --name fingers-crossed <span class="number">1</span></span><br></pre></td></tr></tbody></table>

To operate a failover run (assuming your backend name is ‘ceph’):

<table><tbody><tr><td class="code"><pre><span class="line"><span class="variable">$ </span>cinder failover-host client<span class="variable">@ceph</span></span><br></pre></td></tr></tbody></table>

You can get the list of available host for failover using `cinder service-list --withreplication`.

  

> You now have a fully working disaster recovery configuration that can failover to another location. Simply note that at the moment, there is no failback support. This would require efforts from an operator.

Source: Sebastian Han ([OpenStack Cinder configure replication API with Ceph](https://sebastien-han.fr/blog/2017/06/19/OpenStack-Cinder-configure-replication-api-with-ceph/))
