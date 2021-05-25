---
title: "Difference Between 'Ceph Osd Reweight' and 'Ceph Osd Crush Reweight'"
date: "2014-12-23"
author: "laurentbarbe"
tags: 
  - "planet"
---

From Gregory and Craig in mailing list…

> “ceph osd crush reweight” sets the CRUSH weight of the OSD. This  
> weight is an arbitrary value (generally the size of the disk in TB or  
> something) and controls how much data the system tries to allocate to  
> the OSD.
> 
> “ceph osd reweight” sets an override weight on the OSD. This value is  
> in the range 0 to 1, and forces CRUSH to re-place (1-weight) of the  
> data that would otherwise live on this drive. It does \*not\* change the  
> weights assigned to the buckets above the OSD, and is a corrective  
> measure in case the normal CRUSH distribution isn’t working out quite  
> right. (For instance, if one of your OSDs is at 90% and the others are  
> at 50%, you could reduce this weight to try and compensate for it.)
> 
> **Gregory Farnum** [lists.ceph.com/pipermail/…](http://lists.ceph.com/pipermail/ceph-users-ceph.com/2014-June/040961.html)

> Note that ‘ceph osd reweight’ is not a persistent setting. When an OSD  
> gets marked out, the osd weight will be set to 0. When it gets marked in  
> again, the weight will be changed to 1.
> 
> Because of this ‘ceph osd reweight’ is a temporary solution. You should  
> only use it to keep your cluster running while you’re ordering more  
> hardware.
> 
> **Craig Lewis** [lists.ceph.com/pipermail/…](http://lists.ceph.com/pipermail/ceph-users-ceph.com/2014-June/040967.html)

[http://lists.ceph.com/pipermail/ceph-users-ceph.com/2014-June/040961.html](http://lists.ceph.com/pipermail/ceph-users-ceph.com/2014-June/040961.html)

I asked myself when one of my osd was marked down (on my old cluster in Cuttlefish…) and I noticed that only the drive of the local machine seemed to fill. Something that seems normal since the weight of the host had not changed in crushmap.

## Testing

Testing on simple cluster (Giant), with this crushmap :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class=""><span class="line">ruleset 0
</span><span class="line">type replicated
</span><span class="line">min_size 1
</span><span class="line">max_size 10
</span><span class="line">step take default
</span><span class="line">step chooseleaf firstn 0 type host
</span><span class="line">  step emit</span></code></pre></td></tr></tbody></table>

Take the example of the 8 pgs on pool 3 :

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph pg dump | grep <span class="s1">'^3.'</span> | awk <span class="s1">'{print $1,$15;}'</span>
</span><span class="line">dumped all in format plain
</span><span class="line">3.4 <span class="o">[</span>0,2<span class="o">]</span>
</span><span class="line">3.5 <span class="o">[</span>4,1<span class="o">]</span>
</span><span class="line">3.6 <span class="o">[</span>2,0<span class="o">]</span>
</span><span class="line">3.7 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.0 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.1 <span class="o">[</span>0,2<span class="o">]</span>
</span><span class="line">3.2 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.3 <span class="o">[</span>2,4<span class="o">]</span>
</span></code></pre></td></tr></tbody></table>

Now I try ceph osd out :

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
<span class="line-number">23</span>
<span class="line-number">24</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph osd out 0    <span class="c"># This is equivalent to "ceph osd reweight 0 0"</span>
</span><span class="line">marked out osd.0.
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph osd tree
</span><span class="line"><span class="c"># id  weight  type name   up/down reweight</span>
</span><span class="line">-1    0.2 root default
</span><span class="line">-2    0.09998     host ceph-01
</span><span class="line">0 0.04999         osd.0   up  0       <span class="c"># &lt;-- reweight has set to "0"</span>
</span><span class="line">4 0.04999         osd.4   up  1   
</span><span class="line">-3    0.04999     host ceph-02
</span><span class="line">1 0.04999         osd.1   up  1   
</span><span class="line">-4    0.04999     host ceph-03
</span><span class="line">2 0.04999         osd.2   up  1   
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph pg dump | grep <span class="s1">'^3.'</span> | awk <span class="s1">'{print $1,$15;}'</span>
</span><span class="line">dumped all in format plain
</span><span class="line">3.4 <span class="o">[</span>2,4<span class="o">]</span>  <span class="c"># &lt;-- [0,2] (move pg on osd.4)</span>
</span><span class="line">3.5 <span class="o">[</span>4,1<span class="o">]</span>
</span><span class="line">3.6 <span class="o">[</span>2,1<span class="o">]</span>  <span class="c"># &lt;-- [2,0] (move pg on osd.1)</span>
</span><span class="line">3.7 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.0 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.1 <span class="o">[</span>2,1<span class="o">]</span>  <span class="c"># &lt;-- [0,2] (move pg on osd.1)</span>
</span><span class="line">3.2 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.3 <span class="o">[</span>2,4<span class="o">]</span>
</span></code></pre></td></tr></tbody></table>

Now I try ceph osd CRUSH out :

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
<span class="line-number">23</span>
<span class="line-number">24</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph osd crush reweight osd.0 0
</span><span class="line">reweighted item id 0 name <span class="s1">'osd.0'</span> to 0 in crush map
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph osd tree
</span><span class="line"><span class="c"># id  weight  type name   up/down reweight</span>
</span><span class="line">-1    0.15    root default
</span><span class="line">-2    0.04999     host ceph-01            <span class="c"># &lt;-- the weight of the host changed</span>
</span><span class="line">0 0               osd.0   up  1       <span class="c"># &lt;-- crush weight is set to "0"</span>
</span><span class="line">4 0.04999         osd.4   up  1   
</span><span class="line">-3    0.04999     host ceph-02
</span><span class="line">1 0.04999         osd.1   up  1   
</span><span class="line">-4    0.04999     host ceph-03
</span><span class="line">2 0.04999         osd.2   up  1   
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph pg dump | grep <span class="s1">'^3.'</span> | awk <span class="s1">'{print $1,$15;}'</span>
</span><span class="line">dumped all in format plain
</span><span class="line">3.4 <span class="o">[</span>4,2<span class="o">]</span>  <span class="c"># &lt;-- [0,2] (move pg on osd.4)</span>
</span><span class="line">3.5 <span class="o">[</span>4,1<span class="o">]</span>
</span><span class="line">3.6 <span class="o">[</span>2,4<span class="o">]</span>  <span class="c"># &lt;-- [2,0] (move pg on osd.4)</span>
</span><span class="line">3.7 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.0 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.1 <span class="o">[</span>4,2<span class="o">]</span>  <span class="c"># &lt;-- [0,2] (move pg on osd.4)</span>
</span><span class="line">3.2 <span class="o">[</span>2,1<span class="o">]</span>
</span><span class="line">3.3 <span class="o">[</span>2,1<span class="o">]</span>
</span></code></pre></td></tr></tbody></table>

This does not seem very logical because the weight assigned to the bucket “host ceph-01” is still higher than the others. This would probably be different with more PG…

## Trying with more pgs

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># Add more pg on my testpool</span>
</span><span class="line"><span class="nv">$ </span>ceph osd pool <span class="nb">set </span>testpool pg_num 128
</span><span class="line"><span class="nb">set </span>pool 3 pg_num to 128
</span><span class="line">
</span><span class="line"><span class="c"># Check repartition</span>
</span><span class="line"><span class="nv">$ </span><span class="k">for </span>i in 0 1 2 4; <span class="k">do </span><span class="nb">echo</span>  <span class="s2">"osd.$i=$(ceph pg dump 2&gt;/dev/null | grep '^3.' | awk '{print $15;}' | grep $i | wc -l) pgs"</span>; <span class="k">done</span>
</span><span class="line">osd.0<span class="o">=</span>48 pgs
</span><span class="line">osd.1<span class="o">=</span>78 pgs
</span><span class="line">osd.2<span class="o">=</span>77 pgs
</span><span class="line">osd.4<span class="o">=</span>53 pgs
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph osd reweight 0 0
</span><span class="line">reweighted osd.0 to 0 <span class="o">(</span>802<span class="o">)</span>
</span><span class="line"><span class="nv">$ </span><span class="k">for </span>i in 0 1 2 4; <span class="k">do </span><span class="nb">echo</span>  <span class="s2">"osd.$i=$(ceph pg dump 2&gt;/dev/null | grep '^3.' | awk '{print $15;}' | grep $i | wc -l) pgs"</span>; <span class="k">done</span>
</span><span class="line">osd.0<span class="o">=</span>0 pgs
</span><span class="line">osd.1<span class="o">=</span>96 pgs
</span><span class="line">osd.2<span class="o">=</span>97 pgs
</span><span class="line">osd.4<span class="o">=</span>63 pgs
</span></code></pre></td></tr></tbody></table>

The distribution seems fair. Why in the same case, with Cuttlefish, distribution is not the same ?

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph osd reweight 0 1
</span><span class="line">reweighted osd.0 to 0 <span class="o">(</span>802<span class="o">)</span>
</span><span class="line"><span class="nv">$ </span><span class="k">for </span>i in 0 1 2 4; <span class="k">do </span><span class="nb">echo</span>  <span class="s2">"osd.$i=$(ceph pg dump 2&gt;/dev/null | grep '^3.' | awk '{print $15;}' | grep $i | wc -l) pgs"</span>; <span class="k">done</span>
</span><span class="line">osd.0<span class="o">=</span>0 pgs
</span><span class="line">osd.1<span class="o">=</span>96 pgs
</span><span class="line">osd.2<span class="o">=</span>97 pgs
</span><span class="line">osd.4<span class="o">=</span>63 pgs
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph osd crush reweight osd.0 0
</span><span class="line">reweighted osd.0 to 0 <span class="o">(</span>802<span class="o">)</span>
</span><span class="line">
</span><span class="line"><span class="nv">$ </span><span class="k">for </span>i in 0 1 2 4; <span class="k">do </span><span class="nb">echo</span>  <span class="s2">"osd.$i=$(ceph pg dump 2&gt;/dev/null | grep '^3.' | awk '{print $15;}' | grep $i | wc -l) pgs"</span>; <span class="k">done</span>
</span><span class="line">osd.0<span class="o">=</span>0 pgs
</span><span class="line">osd.1<span class="o">=</span>87 pgs
</span><span class="line">osd.2<span class="o">=</span>88 pgs
</span><span class="line">osd.4<span class="o">=</span>81 pgs
</span></code></pre></td></tr></tbody></table>

With crush reweight, everything is normal.

## Trying with crush legacy

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
<span class="line-number">23</span>
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
<span class="line-number">27</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph osd crush tunables legacy
</span><span class="line">adjusted tunables profile to legacy
</span><span class="line">root@ceph-01:~/ceph-deploy# <span class="k">for </span>i in 0 1 2 4; <span class="k">do </span><span class="nb">echo</span>  <span class="s2">"osd.$i=$(ceph pg dump 2&gt;/dev/null | grep '^3.' | awk '{print $15;}' | grep $i | wc -l) pgs"</span>; <span class="k">done</span>
</span><span class="line">osd.0<span class="o">=</span>0 pgs
</span><span class="line">osd.1<span class="o">=</span>87 pgs
</span><span class="line">osd.2<span class="o">=</span>88 pgs
</span><span class="line">osd.4<span class="o">=</span>81 pgs
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph osd crush reweight osd.0 0.04999
</span><span class="line">reweighted item id 0 name <span class="s1">'osd.0'</span> to 0.04999 in crush map
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph osd tree
</span><span class="line"><span class="c"># id  weight  type name   up/down reweight</span>
</span><span class="line">-1    0.2 root default
</span><span class="line">-2    0.09998     host ceph-01
</span><span class="line">0 0.04999         osd.0   up  0   
</span><span class="line">4 0.04999         osd.4   up  1   
</span><span class="line">-3    0.04999     host ceph-02
</span><span class="line">1 0.04999         osd.1   up  1   
</span><span class="line">-4    0.04999     host ceph-03
</span><span class="line">2 0.04999         osd.2   up  1   
</span><span class="line">
</span><span class="line"><span class="nv">$ </span><span class="k">for </span>i in 0 1 2 4; <span class="k">do </span><span class="nb">echo</span>  <span class="s2">"osd.$i=$(ceph pg dump 2&gt;/dev/null | grep '^3.' | awk '{print $15;}' | grep $i | wc -l) pgs"</span>; <span class="k">done</span>
</span><span class="line">osd.0<span class="o">=</span>0 pgs
</span><span class="line">osd.1<span class="o">=</span>78 pgs
</span><span class="line">osd.2<span class="o">=</span>77 pgs
</span><span class="line">osd.4<span class="o">=</span>101 pgs   <span class="c"># &lt;--- All pg from osd.0 and osd.4 is here when using legacy value (on host ceph-01)</span>
</span></code></pre></td></tr></tbody></table>

So, it is an evolution of the distribution algorithm to prefer a more global distribution when OSD is marked down (instead of distributing preferably by proximity). Indeed the old distribution can cause problems when there is not a lot of OSD by host, and that they are nearly full.

> When some OSDs are marked out, the data tends to get redistributed to nearby OSDs instead of across the entire hierarchy.
> 
> **Ceph Docs** [ceph.com/docs/master/rados/…](http://ceph.com/docs/master/rados/operations/crush-map/#impact-of-legacy-values)

To view the number of pg per osd :

[http://cephnotes.ksperis.com/blog/2015/02/23/get-the-number-of-placement-groups-per-osd/](http://cephnotes.ksperis.com/blog/2015/02/23/get-the-number-of-placement-groups-per-osd/)
