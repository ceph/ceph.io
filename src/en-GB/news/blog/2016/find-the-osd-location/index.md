---
title: "Find the OSD Location"
date: "2016-05-24"
author: "admin"
tags: 
  - "planet"
---

Of course, the simplest way is using the command `ceph osd tree`.

Note that, if an osd is down, you can see “last address” in `ceph health detail` :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph health detail
</span><span class="line">...
</span><span class="line">osd.37 is down since epoch 16952, last address 172.16.4.68:6804/628
</span></code></pre></td></tr></tbody></table>

Also, you can use:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph osd find 37
</span><span class="line"><span class="o">{</span>
</span><span class="line">    <span class="s2">"osd"</span>: 37,
</span><span class="line">    <span class="s2">"ip"</span>: <span class="s2">"172.16.4.68:6804/636"</span>,
</span><span class="line">    <span class="s2">"crush_location"</span>: <span class="o">{</span>
</span><span class="line">        <span class="s2">"datacenter"</span>: <span class="s2">"pa2.ssdr"</span>,
</span><span class="line">        <span class="s2">"host"</span>: <span class="s2">"lxc-ceph-main-front-osd-03.ssdr"</span>,
</span><span class="line">        <span class="s2">"physical-host"</span>: <span class="s2">"store-front-03.ssdr"</span>,
</span><span class="line">        <span class="s2">"rack"</span>: <span class="s2">"pa2-104.ssdr"</span>,
</span><span class="line">        <span class="s2">"root"</span>: <span class="s2">"ssdr"</span>
</span><span class="line">    <span class="o">}</span>
</span><span class="line"><span class="o">}</span>
</span></code></pre></td></tr></tbody></table>

To get partition UUID, you can use `ceph osd dump` (see at the end of the line) :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph osd dump | grep ^osd.37
</span><span class="line">osd.37 down out weight 0 up_from 56847 up_thru 57230 down_at 57538 last_clean_interval <span class="o">[</span>56640,56844<span class="o">)</span> 172.16.4.72:6801/16852 172.17.2.37:6801/16852 172.17.2.37:6804/16852 172.16.4.72:6804/16852 exists d7ab9ac1-c68c-4594-b25e-48d3a7cfd182
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ssh 172.17.2.37 | blkid | grep d7ab9ac1-c68c-4594-b25e-48d3a7cfd182
</span><span class="line">/dev/sdg1: <span class="nv">UUID</span><span class="o">=</span><span class="s2">"98594f17-eae5-45f8-9e90-cd25a8f89442"</span> <span class="nv">TYPE</span><span class="o">=</span><span class="s2">"xfs"</span> <span class="nv">PARTLABEL</span><span class="o">=</span><span class="s2">"ceph data"</span> <span class="nv">PARTUUID</span><span class="o">=</span><span class="s2">"d7ab9ac1-c68c-4594-b25e-48d3a7cfd182"</span>
</span><span class="line"><span class="c">#(Depending on how the partitions are created, PARTUUID label is not necessarily present.)</span>
</span></code></pre></td></tr></tbody></table>

Source: Laurent Barbe ([Find the OSD Location](http://cephnotes.ksperis.com/blog/2016/05/24/find-the-osd-location/))
