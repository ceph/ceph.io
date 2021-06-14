---
title: "Ceph RBD objects placement"
date: "2013-11-19"
author: "shan"
tags: 
  - "planet"
---

Quick script to evaluate the placement of the objects contained in a RBD image.

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
<span class="line-number">16</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c">#!/bin/bash</span>
</span><span class="line">
</span><span class="line"><span class="c"># USAGE</span>
</span><span class="line"><span class="c"># ./rbd-loc &lt;pool&gt; &lt;image&gt;</span>
</span><span class="line">
</span><span class="line"><span class="k">if</span> <span class="o">[</span> -z <span class="k">${</span><span class="nv">1</span><span class="k">}</span> <span class="o">]</span> <span class="o">||</span> <span class="o">[</span> -z <span class="k">${</span><span class="nv">2</span><span class="k">}</span> <span class="o">]</span>;
</span><span class="line"><span class="k">then</span>
</span><span class="line"><span class="k">    </span><span class="nb">echo</span> <span class="s2">"USAGE: ./rbd-loc &lt;pool&gt; &lt;image&gt;"</span>
</span><span class="line">    <span class="nb">exit </span>1
</span><span class="line"><span class="k">fi</span>
</span><span class="line">
</span><span class="line"><span class="nv">rbd_prefix</span><span class="o">=</span><span class="k">$(</span>rbd -p <span class="k">${</span><span class="nv">1</span><span class="k">}</span> info <span class="k">${</span><span class="nv">2</span><span class="k">}</span> | grep block_name_prefix | awk <span class="s1">'{print $2}'</span><span class="k">)</span>
</span><span class="line"><span class="k">for </span>i in <span class="k">$(</span>rados -p <span class="k">${</span><span class="nv">1</span><span class="k">}</span> ls | grep <span class="k">${</span><span class="nv">rbd_prefix</span><span class="k">})</span>
</span><span class="line"><span class="k">do</span>
</span><span class="line"><span class="k">    </span>ceph osd map <span class="k">${</span><span class="nv">1</span><span class="k">}</span> <span class="k">${</span><span class="nv">i</span><span class="k">}</span>
</span><span class="line"><span class="k">done</span>
</span></code></pre></td></tr></tbody></table>
