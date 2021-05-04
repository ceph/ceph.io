---
title: "Deploy a Ceph MDS server"
date: "2013-05-13"
author: "shan"
tags: 
  - "planet"
---

**How-to quickly deploy a MDS server.**

Assuming that `/var/lib/ceph/mds/mds.$id` is the mds data point.

Edit `ceph.conf` and add a MDS section like so: `[mds.$id] host = {hostname}`

Create the authentication key (**only if you use cephX**):

<table style="height: 50px;" width="1600"><tbody><tr><td class="code"><pre><code class="bash"><span class="line">$ sudo ceph auth get-or-create mds.$id mon 'profile mds' mgr 'profile mds' mds 'allow *' osd 'allow *' &gt; /var/lib/ceph/mds/ceph-$id/keying</span></code></pre></td></tr></tbody></table>

Eventually start the service:

<table><tbody><tr><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo service ceph start mds.$id
</span><span class="line"><span class="o">===</span> mds.$id <span class="o">===</span>
</span><span class="line">Starting Ceph mds.$id on ceph...
</span><span class="line">starting mds.$id at :/0
</span></code></pre></td></tr></tbody></table>

Check the status of the cluster:

<table><tbody><tr><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph -s
</span><span class="line">   cluster:
</span><span class="line">      id:     109d9955-2d85-4222-a29f-77a25ec492b3
</span><span class="line">      health HEALTH_OK
<div></div>
</span><span class="line">   services:
</span><span class="line">      mon: 3 daemons, quorum a,b,c
</span><span class="line">      mgr: x(active)
</span><span class="line">      mds: cephfs_a-1/1/1 up  {0=c=up:active}, 3 up:standby
</span><span class="line">      osd: 3 osds: 3 up, 3 in
<div></div>
</span><span class="line">   data:
</span><span class="line">      pools:   2 pools, 16 pgs
</span><span class="line">      objects: 22  objects, 2.2 KiB
</span><span class="line">      usage:   3.2 GiB used, 27 GiB / 30 GiB avail
</span><span class="line">      pgs:     16 active+clean
</span></code></pre></td></tr></tbody></table>

Note if you want to add more MDSs, they will appear like this:

<table><tbody><tr><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph -s
</span><span class="line">   cluster:
</span><span class="line">      id:     109d9955-2d85-4222-a29f-77a25ec492b3
</span><span class="line">      health HEALTH_OK
<div></div>
</span><span class="line">   services:
</span><span class="line">      mon: 3 daemons, quorum a,b,c
</span><span class="line">      mgr: x(active)
</span><span class="line">      mds: cephfs_a-1/1/1 up  {0=c=up:active}, 4 up:standby
</span><span class="line">      osd: 3 osds: 3 up, 3 in
<div></div>
</span><span class="line">   data:
</span><span class="line">      pools:   2 pools, 16 pgs
</span><span class="line">      objects: 22  objects, 2.2 KiB
</span><span class="line">      usage:   3.2 GiB used, 27 GiB / 30 GiB avail
</span><span class="line">      pgs:     16 active+clean
</span></code></pre></td></tr></tbody></table>

 

> Easy, isn’t it? The filesystem metadata live in RADOS cluster. So MDS servers are quite ephemeral daemons. Don’t be surprised if you don’t find anything (expect the MDS key) inside the mds data directory.
