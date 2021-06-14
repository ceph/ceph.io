---
title: "Using Erasure Coding with RadosGW"
date: "2017-10-23"
author: "admin"
tags: 
  - "planet"
---

This is going to be a quick write up of Erasure Coding and how to use it with our RadosGW. First lets look at our default profile for erasure coding on Ceph, understand it, and go and create our own.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div></pre></td><td class="code"><pre><div class="line">root&gt; ceph osd erasure-code-profile get <span class="keyword">default</span></div><div class="line">k=<span class="number">2</span></div><div class="line">m=<span class="number">1</span></div><div class="line">plugin=jerasure</div><div class="line">crush-failure-domain=host</div><div class="line">technique=reed_sol_van</div></pre></td></tr></tbody></table>

Erasure coding profiles break down using the following formula.

- **n = k + m**

**k =** the number of data chunks in which the original object is divided. For instance, in the default profile where `K = 2`, a 10KB object will be divided into K objects of 5KB each.

**m =** the number of coding chunks, i.e additional chunks that represent reliability level. If there are 2 coding chunks, it means 2 OSDs can be out without losing data.

**n =** The sum of the `k` and `m`chunks created.

In our default profile above this means we have 3 total chunks _(2 + 1 = 3)_, and can lose `m` number of chunks, anything more than that and its Bad News Bears.

### [](#So-what-advantage-is-there-to-using-erasure-coding "So what advantage is there to using erasure coding?")So what advantage is there to using erasure coding?

The main advantage is that your data footprint is not that large as compared to replicating your data by a factor of 3. 
For example purposes lets use a 100GB file to determine our final raw data footprint using erasure coding. Using the following 2 formulas and our default profile;

- **ratio = k / n** - (~.66 = 2/3)
- **total\_\_raw = file\_size \* (1/ratio)** - (~151.51GB = 100GB \* (1/.66))

Our file size ends up being 151.51GB, instead of 300GB if replicated 3 times.

### [](#So-what-disadvantage-is-there-to-using-erasure-coding "So what disadvantage is there to using erasure coding?")So what disadvantage is there to using erasure coding?

Mainly speed. Erasure coding takes time to process the chunks. And the mode chunks you have, the more resources and time it will take to process those. Most of the time, but not always the case, erasure coding will be slower. A good balance between size, reliability, and performance is to set `k=4` and `m=2`.

### [](#Creating-a-erasure-coding-profile "Creating a erasure coding profile")Creating a erasure coding profile

So lets create one for our RGW pool using `k=4` and `m=2`.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">ceph osd erasure-code-profile set EC_RGW k=4 m=2 crush-failure-domain=host</div></pre></td></tr></tbody></table>

_Note - `crush-failure-domain` can be set to `osd`/`host`/`rack` etc etc_

### [](#Converting-a-RGW-pool-to-use-erasure-coding "Converting a RGW pool to use erasure coding")Converting a RGW pool to use erasure coding

**_CAUTION - Take it from me DO NOT convert any other pool besides `default.rgw.buckets.data`. I converted `default.rgw.buckets.index` to EC and after 5 hours I found the problem to be related to converting it. See below for examples of errors that occurred because of this._**

Sadly you can’t (as far as I know), just switch a pool over to use erasure coding. But what we can do is run a mini script that will create a pool with erasure set, copy the old pool to the new pool, rename the old pool, and then rename the new pool to the old pools name. Sound confusing? Yeah I agree, but once you get it, it clicks and makes sense. This is how I like to convert pools, but as always, try this in a test environment before doing anything like this in production.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div></pre></td><td class="code"><pre><div class="line">pool=default.rgw.buckets.data</div><div class="line">ceph osd pool create <span class="variable">$pool</span>.new 128 128 erasure EC_RGW</div><div class="line">rados cppool <span class="variable">$pool</span> <span class="variable">$pool</span>.new</div><div class="line">ceph osd pool rename <span class="variable">$pool</span> <span class="variable">$pool</span>.old</div><div class="line">ceph osd pool rename <span class="variable">$pool</span>.new <span class="variable">$pool</span></div></pre></td></tr></tbody></table>

Create a user, or use an existing one, and try to create a bucket or file. You should be able to create files like normal.

### [](#Troubleshooting "Troubleshooting")Troubleshooting

More than likely you are going to see these errors when you set any other pool to EC that isn’t `default.rgw.buckets.data`. This is easy enough to fix by essentially renaming everything back to the way it was before running the conversion script.

This example here is from me converting `default.rgw.buckets.index` to EC. I was able to read all files just fine, but I could not write anything, or create anything.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div></pre></td><td class="code"><pre><div class="line"><span class="number">2017</span><span class="number">-10</span><span class="number">-12</span> <span class="number">10</span>:<span class="number">54</span>:<span class="number">45.108810</span> <span class="number">7f</span>380338a700  <span class="number">1</span> ====== starting <span class="keyword">new</span> request req=<span class="number">0x7f3803384710</span> =====</div><div class="line"><span class="number">2017</span><span class="number">-10</span><span class="number">-12</span> <span class="number">10</span>:<span class="number">54</span>:<span class="number">45.138562</span> <span class="number">7f</span>380338a700  <span class="number">0</span> ERROR: could not get stats <span class="keyword">for</span> buckets</div><div class="line"><span class="number">2017</span><span class="number">-10</span><span class="number">-12</span> <span class="number">10</span>:<span class="number">54</span>:<span class="number">45.138582</span> <span class="number">7f</span>380338a700  <span class="number">0</span> WARNING: set_req_state_err err_no=<span class="number">5</span> resorting to <span class="number">500</span></div><div class="line"><span class="number">2017</span><span class="number">-10</span><span class="number">-12</span> <span class="number">10</span>:<span class="number">54</span>:<span class="number">45.138655</span> <span class="number">7f</span>380338a700  <span class="number">1</span> ====== req done req=<span class="number">0x7f3803384710</span> op status=<span class="number">-5</span> http_status=<span class="number">500</span> ======</div></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">Oct <span class="number">12</span> <span class="number">14</span>:<span class="number">25</span>:<span class="number">36</span> ceph-rgw1 radosgw[<span class="number">19834</span>]: <span class="number">2017</span><span class="number">-10</span><span class="number">-12</span> <span class="number">14</span>:<span class="number">25</span>:<span class="number">36.197153</span> <span class="number">7f</span>e05b2ac9c0 <span class="number">-1</span> Couldn'<span class="function">t init storage <span class="title">provider</span> <span class="params">(RADOS)</span></span></div></pre></td></tr></tbody></table>

### [](#Fin "Fin")Fin

I hope this helps out peeps and makes like a little easier. If this even helped out one admin, then it was well worth it.  
Thanks for reading and feel free to contact me at magusnebula@gmail.com!

Source: Stephen McElroy ([Using Erasure Coding with RadosGW](http://obsidiancreeper.com/2017/10/23/Using-Erasure-Coding-with-RadosGW/))
