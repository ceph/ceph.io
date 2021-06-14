---
title: "Ceph: update Cephx Keys"
date: "2013-07-26"
author: "shan"
tags: 
  - "planet"
---

![](images/cephx-update-keys.jpg "Ceph update Cephx Keys")

It’s not really clear from the command line

Generate a dummy key for the exercise

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph auth get-or-create client.dummy mon <span class="s1">'allow r'</span> osd  <span class="s1">'allow rwx pool=dummy'</span>
</span><span class="line">
</span><span class="line"><span class="o">[</span>client.dummy<span class="o">]</span>
</span><span class="line">    <span class="nv">key</span> <span class="o">=</span> <span class="nv">AQAPiu1RCMb4CxAAmP7rrufwZPRqy8bpQa2OeQ</span><span class="o">==</span>
</span></code></pre></td></tr></tbody></table>

Verify that the key is present:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph auth list
</span><span class="line">installed auth entries:
</span><span class="line">...
</span><span class="line">client.dummy
</span><span class="line">    key: <span class="nv">AQAPiu1RCMb4CxAAmP7rrufwZPRqy8bpQa2OeQ</span><span class="o">==</span>
</span><span class="line">    caps: <span class="o">[</span>mon<span class="o">]</span> allow r
</span><span class="line">    caps: <span class="o">[</span>osd<span class="o">]</span> allow rwx <span class="nv">pool</span><span class="o">=</span>dummy
</span><span class="line">...
</span></code></pre></td></tr></tbody></table>

Then grant more permission on the mon:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph auth caps client.dummy mon <span class="s1">'allow rwx'</span> osd <span class="s1">'allow rwx pool=dummy'</span>
</span><span class="line">updated caps <span class="k">for </span>client.dummy
</span></code></pre></td></tr></tbody></table>

Verify that the change has been applied:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph auth list
</span><span class="line">installed auth entries:
</span><span class="line">client.dummy
</span><span class="line">    key: <span class="nv">AQAPiu1RCMb4CxAAmP7rrufwZPRqy8bpQa2OeQ</span><span class="o">==</span>
</span><span class="line">    caps: <span class="o">[</span>mon<span class="o">]</span> allow rwx
</span><span class="line">    caps: <span class="o">[</span>osd<span class="o">]</span> allow allow rwx <span class="nv">pool</span><span class="o">=</span>dummy
</span></code></pre></td></tr></tbody></table>

  

> Hope it helps!
