---
title: "LXC 2.0.0 First Support for Ceph RBD"
date: "2016-04-14"
author: "admin"
tags: 
  - "planet"
---

FYI, the first RBD support has been added to LXC commands.

## Example :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
<span class="line-number">11</span>
<span class="line-number">12</span>
<span class="line-number">13</span>
<span class="line-number">14</span>
<span class="line-number">15</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># Install LXC 2.0.0 (ubuntu) :</span>
</span><span class="line"><span class="nv">$ </span>add-apt-repository ppa:ubuntu-lxc/lxc-stable
</span><span class="line"><span class="nv">$ </span>apt-get update
</span><span class="line"><span class="nv">$ </span>apt-get install lxc
</span><span class="line">
</span><span class="line"><span class="c"># Add a ceph pool for lxc bloc devices :</span>
</span><span class="line"><span class="nv">$ </span>ceph osd pool create lxc 64 64
</span><span class="line">
</span><span class="line"><span class="c"># To create the container, you only need to specify "rbd" backingstore :</span>
</span><span class="line"><span class="nv">$ </span>lxc-create -n ctn1 -B rbd -t debian
</span><span class="line">/dev/rbd0
</span><span class="line">debootstrap est /usr/sbin/debootstrap
</span><span class="line">Checking cache download in /var/cache/lxc/debian/rootfs-jessie-amd64 ...
</span><span class="line">Copying rootfs to /usr/lib/x86_64-linux-gnu/lxc...
</span><span class="line">Generation complete.
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd showmapped
</span><span class="line">id pool image snap device
</span><span class="line">0  lxc  ctn1  - /dev/rbd0
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>rbd -p lxc info ctn1
</span><span class="line">rbd image <span class="s1">'ctn1'</span>:
</span><span class="line">  size 1024 MB in 256 objects
</span><span class="line">  order 22 <span class="o">(</span>4096 kB objects<span class="o">)</span>
</span><span class="line">  block_name_prefix: rb.0.1217d.74b0dc51
</span><span class="line">  format: 1
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>lxc-start -n ctn1
</span><span class="line"><span class="nv">$ </span>lxc-attach -n ctn1
</span><span class="line">ctn1<span class="nv">$ </span>mount | grep <span class="s1">' / '</span>
</span><span class="line">/dev/rbd/lxc/ctn1 on / <span class="nb">type </span>ext3 <span class="o">(</span>rw,relatime,stripe<span class="o">=</span>1024,data<span class="o">=</span>ordered<span class="o">)</span>
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>lxc-destroy -n ctn1
</span><span class="line">Removing image: 100% complete...done.
</span><span class="line">Destroyed container ctn1
</span></code></pre></td></tr></tbody></table>

## Some options :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">--rbdpool POOL   : will create the blockdevice in the pool named POOL, rather than the default, which is <span class="s1">'lxc'</span>.
</span><span class="line">
</span><span class="line">--rbdname RBDNAME : will create a blockdevice named RBDNAME rather than the default, which is the container name.
</span><span class="line">
</span><span class="line">--fssize : Create a RBD of size SIZE * unit U <span class="o">(</span>bBkKmMgGtT<span class="o">)</span>
</span></code></pre></td></tr></tbody></table>

For example :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>lxc-create -n ctn2 -B rbd -t debian --rbdpool<span class="o">=</span>rbd --rbdname<span class="o">=</span>lxc-ctn2 --fssize<span class="o">=</span>2G
</span></code></pre></td></tr></tbody></table>

## What is not yet done:

- Persistence on reboot: (RBD can be optionally added to rbdmap file)
- Snapshots
- Params for authentication (user, keyring…)
- Other rbd options (format, …)

The release annoucement :

[https://linuxcontainers.org/fr/lxc/news/#lxc-200-release-announcement-6th-of-april-2016](https://linuxcontainers.org/fr/lxc/news/#lxc-200-release-announcement-6th-of-april-2016)

Source: Laurent Barbe ([LXC 2.0.0 First Support for Ceph RBD](http://cephnotes.ksperis.com/blog/2016/04/14/lxc-2-dot-0-0-first-support-for-ceph-rbd/))
