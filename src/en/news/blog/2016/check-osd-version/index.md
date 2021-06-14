---
title: "Check OSD Version"
date: "2016-05-26"
author: "admin"
tags: 
  - "planet"
---

Occasionally it may be useful to check the version of the OSD on the entire cluster :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">ceph tell osd.* version
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
<span class="line-number">11</span>
<span class="line-number">12</span>
<span class="line-number">13</span>
<span class="line-number">14</span>
<span class="line-number">15</span>
<span class="line-number">16</span>
<span class="line-number">17</span>
<span class="line-number">18</span>
<span class="line-number">19</span>
<span class="line-number">20</span>
<span class="line-number">21</span>
<span class="line-number">22</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">osd.0: <span class="o">{</span>
</span><span class="line">    <span class="s2">"version"</span>: <span class="s2">"ceph version 0.94.5-224-g4051bc2 (4051bc2a5e4313ac0f6236d7a34ed5fb4a1d9ea2)"</span>
</span><span class="line"><span class="o">}</span>
</span><span class="line">osd.1: <span class="o">{</span>
</span><span class="line">    <span class="s2">"version"</span>: <span class="s2">"ceph version 0.94.5-224-g4051bc2 (4051bc2a5e4313ac0f6236d7a34ed5fb4a1d9ea2)"</span>
</span><span class="line"><span class="o">}</span>
</span><span class="line">osd.2: <span class="o">{</span>
</span><span class="line">    <span class="s2">"version"</span>: <span class="s2">"ceph version 0.94.5-224-g4051bc2 (4051bc2a5e4313ac0f6236d7a34ed5fb4a1d9ea2)"</span>
</span><span class="line"><span class="o">}</span>
</span><span class="line">osd.3: <span class="o">{</span>
</span><span class="line">    <span class="s2">"version"</span>: <span class="s2">"ceph version 0.94.6 (e832001feaf8c176593e0325c8298e3f16dfb403)"</span>
</span><span class="line"><span class="o">}</span>
</span><span class="line">osd.4: <span class="o">{</span>
</span><span class="line">    <span class="s2">"version"</span>: <span class="s2">"ceph version 0.94.6 (e832001feaf8c176593e0325c8298e3f16dfb403)"</span>
</span><span class="line"><span class="o">}</span>
</span><span class="line">osd.5: <span class="o">{</span>
</span><span class="line">    <span class="s2">"version"</span>: <span class="s2">"ceph version 0.94.6 (e832001feaf8c176593e0325c8298e3f16dfb403)"</span>
</span><span class="line"><span class="o">}</span>
</span><span class="line">osd.6: <span class="o">{</span>
</span><span class="line">    <span class="s2">"version"</span>: <span class="s2">"ceph version 0.94.6 (e832001feaf8c176593e0325c8298e3f16dfb403)"</span>
</span><span class="line"><span class="o">}</span>
</span><span class="line">...
</span></code></pre></td></tr></tbody></table>

Source: Laurent Barbe ([Check OSD Version](http://cephnotes.ksperis.com/blog/2016/05/26/check-osd-version/))
