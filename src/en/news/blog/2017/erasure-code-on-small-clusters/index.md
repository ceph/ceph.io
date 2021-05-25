---
title: "Erasure Code on Small Clusters"
date: "2017-01-27"
author: "admin"
tags: 
  - "planet"
---

Erasure code is rather designed for clusters with a sufficient size. However if you want to use it with a small amount of hosts you can also adapt the crushmap for a better matching distribution to your need.

Here a first example for distributing data with 1 host OR 2 drive fault tolerance with k=4, m=2 on 3 hosts and more.

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
</pre></td><td class="code"><pre><code class=""><span class="line">rule erasure_ruleset {
</span><span class="line">  ruleset X
</span><span class="line">  type erasure
</span><span class="line">  min_size 6
</span><span class="line">  max_size 6
</span><span class="line">  step take default
</span><span class="line">  step choose indep 3 type host
</span><span class="line">  step choose indep 2 type osd
</span><span class="line">  step emit
</span><span class="line">}</span></code></pre></td></tr></tbody></table>

Testing it on sample crushmap :

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
</pre></td><td class="code"><pre><code class=""><span class="line"># crushtool --test -i crushmap.bin --rule 1 --show-mappings --x 1 --num-rep 6
</span><span class="line">CRUSH rule 1 x 1 [0,1,8,7,5,3]
</span><span class="line">
</span><span class="line"># crushtool --test -i crushmap.bin --tree
</span><span class="line">ID    WEIGHT  TYPE NAME
</span><span class="line">-5      4.00000 root default
</span><span class="line">-1      1.00000         host host-01
</span><span class="line">0       1.00000                 osd.0   &lt;-- DATA
</span><span class="line">1       1.00000                 osd.1   &lt;-- DATA
</span><span class="line">2       1.00000                 osd.2
</span><span class="line">-2      1.00000         host host-02
</span><span class="line">3       1.00000                 osd.3   &lt;-- PARITY
</span><span class="line">4       1.00000                 osd.4
</span><span class="line">5       1.00000                 osd.5   &lt;-- PARITY
</span><span class="line">-3      1.00000         host host-03
</span><span class="line">6       1.00000                 osd.6
</span><span class="line">7       1.00000                 osd.7   &lt;-- DATA
</span><span class="line">8       1.00000                 osd.8   &lt;-- DATA
</span><span class="line">-4      1.00000         host host-04
</span><span class="line">9       1.00000                 osd.9
</span><span class="line">10      1.00000                 osd.10
</span><span class="line">11      1.00000                 osd.11
</span><span class="line">
</span></code></pre></td></tr></tbody></table>

Here is an other example for distributing data with ( 1 host AND 1 drive ) OR ( 3 drives ) fault tolerance with k=5, m=3 on 4 hosts and more.

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
</pre></td><td class="code"><pre><code class=""><span class="line">rule erasure_ruleset {
</span><span class="line">  ruleset X
</span><span class="line">  type erasure
</span><span class="line">  min_size 8
</span><span class="line">  max_size 8
</span><span class="line">  step take default
</span><span class="line">  step choose indep 4 type host
</span><span class="line">  step choose indep 2 type osd
</span><span class="line">  step emit
</span><span class="line">}</span></code></pre></td></tr></tbody></table>

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
</pre></td><td class="code"><pre><code class=""><span class="line"># crushtool --test -i crushmap.bin --rule 2 --show-mappings --x 1 --num-rep 8
</span><span class="line">CRUSH rule 2 x 1 [0,1,8,7,9,11,5,3]
</span><span class="line">
</span><span class="line"># crushtool --test -i crushmap.bin --tree
</span><span class="line">ID      WEIGHT  TYPE NAME
</span><span class="line">-5      4.00000 root default
</span><span class="line">-1      1.00000         host host-01
</span><span class="line">0       1.00000                 osd.0   &lt;-- DATA
</span><span class="line">1       1.00000                 osd.1   &lt;-- DATA
</span><span class="line">2       1.00000                 osd.2
</span><span class="line">-2      1.00000         host host-02
</span><span class="line">3       1.00000                 osd.3   &lt;-- PARITY
</span><span class="line">4       1.00000                 osd.4
</span><span class="line">5       1.00000                 osd.5   &lt;-- PARITY
</span><span class="line">-3      1.00000         host host-03
</span><span class="line">6       1.00000                 osd.6
</span><span class="line">7       1.00000                 osd.7   &lt;-- DATA
</span><span class="line">8       1.00000                 osd.8   &lt;-- DATA
</span><span class="line">-4      1.00000         host host-04
</span><span class="line">9       1.00000                 osd.9   &lt;-- DATA
</span><span class="line">10      1.00000                 osd.10
</span><span class="line">11      1.00000                 osd.11  &lt;-- PARITY</span></code></pre></td></tr></tbody></table>

And a last example for distributing data with ( 1 host AND 2 drives ) OR ( 4 drives ) fault tolerance with k=8, m=4 on 4 hosts and more.

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
</pre></td><td class="code"><pre><code class=""><span class="line">rule erasure_ruleset {
</span><span class="line">  ruleset X
</span><span class="line">  type erasure
</span><span class="line">  min_size 12
</span><span class="line">  max_size 12
</span><span class="line">  step take default
</span><span class="line">  step choose indep 4 type host
</span><span class="line">  step choose indep 3 type osd
</span><span class="line">  step emit
</span><span class="line">}</span></code></pre></td></tr></tbody></table>

An other possibility is to use LRC Erasure code plugin :

[http://docs.ceph.com/docs/master/rados/operations/erasure-code-lrc/](http://docs.ceph.com/docs/master/rados/operations/erasure-code-lrc/)

Source: Laurent Barbe ([Erasure Code on Small Clusters](http://cephnotes.ksperis.com/blog/2017/01/27/erasure-code-on-small-clusters/))
