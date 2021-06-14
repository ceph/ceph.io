---
title: "Convert RBD to Format V2"
date: "2013-07-30"
author: "syndicated"
tags: 
---

## Simple Import / Export

Don’t forget to stop IO before sync and unmap rbd before rename.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd export rbd/myrbd - | rbd import --image-format 2 - rbd/myrbd_v2
</span><span class="line">$ rbd mv rbd/myrbd rbd/myrbd_old
</span><span class="line">$ rbd mv rbd/myrbd_v2 rbd/myrbd</span></code></pre></td></tr></tbody></table>

Check :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd info rbd/myrbd
</span><span class="line">$ rbd image 'myrbd':
</span><span class="line">  size 102400 KB in 25 objects
</span><span class="line">  order 22 (4096 KB objects)
</span><span class="line">  block_name_prefix: rbd_data.24f72ae8944a
</span><span class="line">  format: 2
</span><span class="line">  features: layering</span></code></pre></td></tr></tbody></table>

## Using DIFF

For the first sync, you don’t need to stop IO on device. Make snap, and sync until this snapshot.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd snap create rbd/myrbd@snap1
</span><span class="line">$ rbd export rbd/myrbd@snap1 - | rbd import --image-format 2 - rbd/myrbd_v2
</span><span class="line">$ rbd snap create rbd/myrbd_v2@snap1</span></code></pre></td></tr></tbody></table>

Check snapshot :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd snap ls rbd/myrbd_v2</span></code></pre></td></tr></tbody></table>

Sync diff : Stop IO before last sync

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd snap create rbd/myrbd@snap2
</span><span class="line">$ rbd export-diff --from-snap snap1 rbd/myrbd@snap2 - | rbd import-diff - rbd/myrbd_v2</span></code></pre></td></tr></tbody></table>
