---
title: "Real size of a Ceph RBD image"
date: "2013-12-19"
author: "shan"
tags: 
---

![](images/real-size-rbd-image.jpg "Real size of a Ceph RBD image")

RBD images are thin-provisionned thus you don’t always know the real size of the image. Moreover, Ceph doesn’t provide any simple facility to check the real size of an image. This blog post took his inspiration from the [Ceph mailing list](http://permalink.gmane.org/gmane.comp.file-systems.ceph.user/3684).

Create an image:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd create -s 1024 toto
</span></code></pre></td></tr></tbody></table>

The magic formula using block differential:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd diff rbd/tota | awk <span class="s1">'{ SUM += $2 } END { print SUM/1024/1024 " MB" }'</span>
</span><span class="line">0 MB
</span></code></pre></td></tr></tbody></table>

Further testing:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd map toto
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>rbd showmapped
</span><span class="line">id pool image snap device
</span><span class="line">2  rbd  toto  - /dev/rbd1
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>dd <span class="k">if</span><span class="o">=</span>/dev/zero <span class="nv">of</span><span class="o">=</span>/dev/rbd1 <span class="nv">bs</span><span class="o">=</span>1M <span class="nv">count</span><span class="o">=</span>10 <span class="nv">oflag</span><span class="o">=</span>direct
</span><span class="line">10+0 records in
</span><span class="line">10+0 records out
</span><span class="line">10485760 bytes <span class="o">(</span>10 MB<span class="o">)</span> copied, 6.91826 s, 1.5 MB/s
</span></code></pre></td></tr></tbody></table>

So we wrote 10M, we should get 10MB in the ouput :).

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd diff rbd/toto | awk <span class="s1">'{ SUM += $2 } END { print SUM/1024/1024 " MB" }'</span>
</span><span class="line">10 MB
</span></code></pre></td></tr></tbody></table>

  

> Thanks to Olivier Bonvalet for the AWK command.
