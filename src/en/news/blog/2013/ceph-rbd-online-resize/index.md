---
title: "Ceph RBD Online Resize"
date: "2013-06-11"
author: "laurentbarbe"
tags: 
  - "planet"
---

## Extend rbd drive with libvirt and XFS

First, resize the device on the physical host.

Get the current size :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ qemu-img info -f rbd "rbd:rbd/myrbd"</span></code></pre></td></tr></tbody></table>

Be careful, you must specify a bigger size, shrink a volume is destructive for the FS.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ qemu-img resize -f rbd "rbd:rbd/myrbd" 600G</span></code></pre></td></tr></tbody></table>

List device define for myVM :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ virsh domblklist myVM</span></code></pre></td></tr></tbody></table>

Resize libvirt blockdevice :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ virsh blockresize --domain myVM --path vdb --size 600G
</span><span class="line">$ rbd info rbd/myrb</span></code></pre></td></tr></tbody></table>

Extend xfs on guest :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ xfs_growfs /mnt/rbd/myrbd</span></code></pre></td></tr></tbody></table>

## Extend rbd with kernel module

You need at least kernel 3.10 on ceph client to support resizing. For previous version look at [http://dachary.org/?p=2179](http://dachary.org/?p=2179)

Get current size :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd info rbd/myrbd</span></code></pre></td></tr></tbody></table>

Just do :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd resize rbd/myrbd --size 600000
</span><span class="line">$ xfs_growfs /mnt/rbd/myrbd</span></code></pre></td></tr></tbody></table>

Also, since cuttlefish you can’t shrink a bloc device without specify additional option (–allow-shrink)
