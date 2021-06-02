---
title: "Ceph: find who's mapping a RBD device"
date: "2013-11-25"
author: "shan"
tags: 
---

![](images/ceph-whos-mapping-rbd.jpg "Ceph: find who's mapping a RBD device")

Curious? Wanna know who has a RBD device mapped?

W Important note: **this method only works with the Emperor version of Ceph and above.**

Grab the image information:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd info boot
</span><span class="line">rbd image <span class="s1">'boot'</span>:
</span><span class="line">    size 10240 MB in 2560 objects
</span><span class="line">    order 22 <span class="o">(</span>4096 kB objects<span class="o">)</span>
</span><span class="line">    block_name_prefix: rb.0.89ee.2ae8944a
</span><span class="line">    format: 1
</span></code></pre></td></tr></tbody></table>

Then list the objects part of the pool and get the image header. Eventually run:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rados -p rbd listwatchers boot.rbd
</span><span class="line"><span class="nv">watcher</span><span class="o">=</span>192.168.251.102:0/2550823152 client.35321 <span class="nv">cookie</span><span class="o">=</span>1
</span></code></pre></td></tr></tbody></table>

As we can see the machine: `192.168.251.102` has the device `boot` mapped.
