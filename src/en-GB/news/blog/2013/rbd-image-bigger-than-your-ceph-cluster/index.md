---
title: "RBD image bigger than your Ceph cluster"
date: "2013-12-12"
author: "shan"
tags: 
  - "planet"
---

![](images/gigantic-rbd-images.jpg "RBD image bigger than your Ceph cluster")

Some experiment with gigantic overprovisioned RBD images.

First, create a large image, let’s 1 PB:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd create --size 1073741824 huge
</span><span class="line"><span class="nv">$ </span>rbd info huge
</span><span class="line">rbd image <span class="s1">'huge'</span>:
</span><span class="line">    size 1024 TB in 268435456 objects
</span><span class="line">    order 22 <span class="o">(</span>4096 kB objects<span class="o">)</span>
</span><span class="line">    block_name_prefix: rb.0.8a14.2ae8944a
</span><span class="line">    format: 1
</span></code></pre></td></tr></tbody></table>

Problems rise as soon as you attempt to delete the image. Eventually try to remove it:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span><span class="nb">time </span>rbd rm huge
</span><span class="line">Removing image: 100% complete...done.
</span><span class="line">
</span><span class="line">real    1944m40.850s
</span><span class="line">user    475m37.192s
</span><span class="line">sys     475m51.184s
</span></code></pre></td></tr></tbody></table>

Keeping an of every exiting objects is terribly inefficient since this will kill our performance. The major downside with this technique is when shrinking or deleting an image it must look for all objects above the shrink size.

In dumpling or later RBD can do this in parallel controlled by `--rbd-concurrent-management-ops` (undocumented option), which defaults to 10.

  

You still have another option, if you’ve never written to the image, you can just delete the `rbd_header` file. You can find it by listing all the objects contained in the image. Something like `rados -p <your-pool> ls | grep <block_name_prefix>` will do the trick. After this, removing the RBD image will take a second.

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$rados</span> -p rbd ls
</span><span class="line">huge.rbd
</span><span class="line">rbd_directory
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>rados -p rbd rm huge.rbd
</span><span class="line"><span class="nv">$ </span><span class="nb">time </span>rbd rm huge
</span><span class="line">2013-12-10 09:35:44.168695 7f9c4a87d780 -1 librbd::ImageCtx: error finding header: <span class="o">(</span>2<span class="o">)</span> No such file or directory
</span><span class="line">Removing image: 100% complete...done.
</span><span class="line">
</span><span class="line">real    0m0.024s
</span><span class="line">user    0m0.008s
</span><span class="line">sys     0m0.008s
</span></code></pre></td></tr></tbody></table>
