---
title: "Crushmap for 2 DC"
date: "2017-01-23"
author: "admin"
tags: 
  - "planet"
---

An example of crushmap for 2 Datacenter replication :

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
</pre></td><td class="code"><pre><code class=""><span class="line">rule replicated_ruleset {
</span><span class="line">  ruleset X
</span><span class="line">  type replicated
</span><span class="line">  min_size 2
</span><span class="line">  max_size 3
</span><span class="line">  step take default
</span><span class="line">  step choose firstn 2 type datacenter
</span><span class="line">  step chooseleaf firstn -1 type host
</span><span class="line">  step emit
</span><span class="line">}</span></code></pre></td></tr></tbody></table>

This working well with pool size=2 (not recommended!) or 3. If you set pool size more than 3 (and increase the max\_size in crush), be careful : you will have n-1 replica on one side and only one on the other datacenter.

If you want to be able to write data even when one of the datacenters is inaccessible, pool min\_size should be set at 1 even if size is set to 3. In this case, pay attention to the monitors location.

Other posts about crushmap : [http://cephnotes.ksperis.com/blog/categories/crushmap/](http://cephnotes.ksperis.com/blog/categories/crushmap/)

Source: Laurent Barbe ([Crushmap for 2 DC](http://cephnotes.ksperis.com/blog/2017/01/23/crushmap-for-2-dc/))
