---
title: "Don't Forget Unmap Before Remove Rbd"
date: "2013-08-02"
author: "laurentbarbe"
tags: 
  - "planet"
---

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd rm rbd/myrbd
</span><span class="line">Removing image: 99% complete...failed.2013-08-02 14:07:17.530470 7f3ba2692760 -1 librbd: error removing header: (16) Device or resource busy
</span><span class="line">rbd: error: image still has watchers
</span><span class="line">This means the image is still open or the client using it crashed. Try again after closing/unmapping it or waiting 30s for the crashed client to timeout.</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd showmapped
</span><span class="line">id pool image snap  device    
</span><span class="line">1  rbd  myrbd - /dev/rbd1</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ service rbdmap stop
</span><span class="line">[ ok ] Stopping RBD Mapping: /dev/rbd1
</span><span class="line">
</span><span class="line">$ rbd rm rbd/myrbd
</span><span class="line">Removing image: 100% complete...done.
</span><span class="line">$ vim /etc/ceph/rbdmap </span></code></pre></td></tr></tbody></table>

To know who is using rbd device you can use listwatchers :

## Image format 1 :

```
$ rados -p rbd listwatchers myrbd.rbd
watcher=10.2.0.131:0/1013964 client.34453 cookie=1
```

## Image format 2 :

```
$ rbd info myrbd
rbd image 'myrbd':
        size 1024 TB in 268435456 objects
        order 22 (4096 kB objects)
        block_name_prefix: rbd_data.82072ae8944a
        format: 2
        features: layering

$ rados -p rbd listwatchers rbd_header.82072ae8944a
watcher=10.2.0.131:0/1013964 client.34453 cookie=1
```
