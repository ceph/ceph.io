---
title: "Placement_pools on Rados-GW"
date: "2014-11-28"
author: "laurentbarbe"
tags: 
---

The purpose of this test is to map a RadosGw Bucket to a specific Ceph pool. For exemple, if using a fast pool with ssd and a low pool for archive…

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">   standard_bucket datas  --&gt; .rgw.buckets        (default pool)
</span><span class="line">   specific_bucket datas  --&gt; .rgw.buckets.custom</span></code></pre></td></tr></tbody></table>

First, we create a pool .rgw.buckets.custom, with, for example, some specific parameters (different size and different ruleset in crushmap) :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>ceph osd pool create .rgw.buckets.custom 64 64
</span><span class="line">pool <span class="s1">'.rgw.buckets.custom'</span> created
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph osd pool <span class="nb">set</span> .rgw.buckets.custom size 2
</span><span class="line"><span class="nb">set </span>pool 59 size to 2
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>ceph osd pool <span class="nb">set</span> .rgw.buckets.custom crush_ruleset 6
</span><span class="line"><span class="nb">set </span>pool 59 crush_ruleset to 6
</span></code></pre></td></tr></tbody></table>

Then, we need to configure a specific placement\_targets in region map and zone. For next step, you need to have a running config of rados-gw…

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>radosgw-admin region get &gt; region.conf.json
</span><span class="line"><span class="nv">$ </span>vim region.conf.json            <span class="c"># Add an entry in placement_targets</span>
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
</pre></td><td class="code"><pre><code class="json"><span class="line"><span class="p">{</span> <span class="nt">"name"</span><span class="p">:</span> <span class="s2">"default"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"api_name"</span><span class="p">:</span> <span class="s2">""</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"is_master"</span><span class="p">:</span> <span class="s2">"true"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"endpoints"</span><span class="p">:</span> <span class="p">[],</span>
</span><span class="line">  <span class="nt">"master_zone"</span><span class="p">:</span> <span class="s2">""</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"zones"</span><span class="p">:</span> <span class="p">[</span>
</span><span class="line">        <span class="p">{</span> <span class="nt">"name"</span><span class="p">:</span> <span class="s2">"default"</span><span class="p">,</span>
</span><span class="line">          <span class="nt">"endpoints"</span><span class="p">:</span> <span class="p">[],</span>
</span><span class="line">          <span class="nt">"log_meta"</span><span class="p">:</span> <span class="s2">"false"</span><span class="p">,</span>
</span><span class="line">          <span class="nt">"log_data"</span><span class="p">:</span> <span class="s2">"false"</span><span class="p">}],</span>
</span><span class="line">  <span class="nt">"placement_targets"</span><span class="p">:</span> <span class="p">[</span>
</span><span class="line">        <span class="p">{</span> <span class="nt">"name"</span><span class="p">:</span> <span class="s2">"default-placement"</span><span class="p">,</span>
</span><span class="line">          <span class="nt">"tags"</span><span class="p">:</span> <span class="p">[]},</span>
</span><span class="line">        <span class="p">{</span> <span class="nt">"name"</span><span class="p">:</span> <span class="s2">"custom-placement"</span><span class="p">,</span>
</span><span class="line">          <span class="nt">"tags"</span><span class="p">:</span> <span class="p">[]}],</span>
</span><span class="line">  <span class="nt">"default_placement"</span><span class="p">:</span> <span class="s2">"default-placement"</span><span class="p">}</span>
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>radosgw-admin region <span class="nb">set</span> &lt; region.conf.json
</span><span class="line">....
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>radosgw-admin zone get &gt; zone.conf.json
</span><span class="line"><span class="nv">$ </span>vim zone.conf.json            <span class="c"># Add an entry in placement_pools with key "custom-placement"</span>
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
</pre></td><td class="code"><pre><code class="json"><span class="line"><span class="p">{</span> <span class="nt">"domain_root"</span><span class="p">:</span> <span class="s2">".rgw"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"control_pool"</span><span class="p">:</span> <span class="s2">".rgw.control"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"gc_pool"</span><span class="p">:</span> <span class="s2">".rgw.gc"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"log_pool"</span><span class="p">:</span> <span class="s2">".log"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"intent_log_pool"</span><span class="p">:</span> <span class="s2">".intent-log"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"usage_log_pool"</span><span class="p">:</span> <span class="s2">".usage"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"user_keys_pool"</span><span class="p">:</span> <span class="s2">".users"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"user_email_pool"</span><span class="p">:</span> <span class="s2">".users.email"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"user_swift_pool"</span><span class="p">:</span> <span class="s2">".users.swift"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"user_uid_pool"</span><span class="p">:</span> <span class="s2">".users.uid"</span><span class="p">,</span>
</span><span class="line">  <span class="nt">"system_key"</span><span class="p">:</span> <span class="p">{</span> <span class="nt">"access_key"</span><span class="p">:</span> <span class="s2">""</span><span class="p">,</span>
</span><span class="line">      <span class="nt">"secret_key"</span><span class="p">:</span> <span class="s2">""</span><span class="p">},</span>
</span><span class="line">  <span class="nt">"placement_pools"</span><span class="p">:</span> <span class="p">[</span>
</span><span class="line">        <span class="p">{</span> <span class="nt">"key"</span><span class="p">:</span> <span class="s2">"default-placement"</span><span class="p">,</span>
</span><span class="line">          <span class="nt">"val"</span><span class="p">:</span> <span class="p">{</span> <span class="nt">"index_pool"</span><span class="p">:</span> <span class="s2">".rgw.buckets.index"</span><span class="p">,</span>
</span><span class="line">              <span class="nt">"data_pool"</span><span class="p">:</span> <span class="s2">".rgw.buckets"</span><span class="p">,</span>
</span><span class="line">              <span class="nt">"data_extra_pool"</span><span class="p">:</span> <span class="s2">".rgw.buckets.extra"</span><span class="p">}},</span>
</span><span class="line">        <span class="p">{</span> <span class="nt">"key"</span><span class="p">:</span> <span class="s2">"custom-placement"</span><span class="p">,</span>
</span><span class="line">          <span class="nt">"val"</span><span class="p">:</span> <span class="p">{</span> <span class="nt">"index_pool"</span><span class="p">:</span> <span class="s2">".rgw.buckets.index"</span><span class="p">,</span>
</span><span class="line">              <span class="nt">"data_pool"</span><span class="p">:</span> <span class="s2">".rgw.buckets.custom"</span><span class="p">,</span>
</span><span class="line">              <span class="nt">"data_extra_pool"</span><span class="p">:</span> <span class="s2">".rgw.buckets.extra"</span><span class="p">}}]}</span>
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>radosgw-admin zone <span class="nb">set</span> &lt;zone.conf.json
</span><span class="line">2014-11-25 18:03:23.894153 7f728c0f2780  0 couldn<span class="err">'</span>t find old data placement pools config, setting up new ones <span class="k">for </span>the zone
</span><span class="line">.....
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
<span class="line-number">23</span>
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
<span class="line-number">27</span>
<span class="line-number">28</span>
<span class="line-number">29</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>radosgw-admin regionmap update
</span><span class="line"><span class="o">{</span> <span class="s2">"regions"</span>: <span class="o">[</span>
</span><span class="line">        <span class="o">{</span> <span class="s2">"key"</span>: <span class="s2">"default"</span>,
</span><span class="line">          <span class="s2">"val"</span>: <span class="o">{</span> <span class="s2">"name"</span>: <span class="s2">"default"</span>,
</span><span class="line">              <span class="s2">"api_name"</span>: <span class="s2">""</span>,
</span><span class="line">              <span class="s2">"is_master"</span>: <span class="s2">"true"</span>,
</span><span class="line">              <span class="s2">"endpoints"</span>: <span class="o">[]</span>,
</span><span class="line">              <span class="s2">"master_zone"</span>: <span class="s2">""</span>,
</span><span class="line">              <span class="s2">"zones"</span>: <span class="o">[</span>
</span><span class="line">                    <span class="o">{</span> <span class="s2">"name"</span>: <span class="s2">"default"</span>,
</span><span class="line">                      <span class="s2">"endpoints"</span>: <span class="o">[]</span>,
</span><span class="line">                      <span class="s2">"log_meta"</span>: <span class="s2">"false"</span>,
</span><span class="line">                      <span class="s2">"log_data"</span>: <span class="s2">"false"</span><span class="o">}]</span>,
</span><span class="line">              <span class="s2">"placement_targets"</span>: <span class="o">[</span>
</span><span class="line">                    <span class="o">{</span> <span class="s2">"name"</span>: <span class="s2">"custom-placement"</span>,
</span><span class="line">                      <span class="s2">"tags"</span>: <span class="o">[]}</span>,
</span><span class="line">                    <span class="o">{</span> <span class="s2">"name"</span>: <span class="s2">"default-placement"</span>,
</span><span class="line">                      <span class="s2">"tags"</span>: <span class="o">[]}]</span>,
</span><span class="line">              <span class="s2">"default_placement"</span>: <span class="s2">"default-placement"</span><span class="o">}}]</span>,
</span><span class="line">  <span class="s2">"master_region"</span>: <span class="s2">"default"</span>,
</span><span class="line">  <span class="s2">"bucket_quota"</span>: <span class="o">{</span> <span class="s2">"enabled"</span>: <span class="nb">false</span>,
</span><span class="line">      <span class="s2">"max_size_kb"</span>: -1,
</span><span class="line">      <span class="s2">"max_objects"</span>: -1<span class="o">}</span>,
</span><span class="line">  <span class="s2">"user_quota"</span>: <span class="o">{</span> <span class="s2">"enabled"</span>: <span class="nb">false</span>,
</span><span class="line">      <span class="s2">"max_size_kb"</span>: -1,
</span><span class="line">      <span class="s2">"max_objects"</span>: -1<span class="o">}}</span>
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>/etc/init.d/radosgw reload
</span><span class="line">Reloading ...
</span></code></pre></td></tr></tbody></table>

To configure s3cmd for RadosGW you can have a look here : [http://lollyrock.com/articles/s3cmd-with-radosgw/](http://lollyrock.com/articles/s3cmd-with-radosgw/)

Now we can test bucket creation :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>s3cmd mb s3://custombucket --bucket-location<span class="o">=</span>custom-placement
</span><span class="line">Bucket <span class="s1">'custombucket'</span> created
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>touch <span class="s2">"file_on_custom_pool"</span>
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>s3cmd put file_on_custom_pool s3://custombucket
</span><span class="line">WARNING: Module python-magic is not available. Guessing MIME types based on file extensions.
</span><span class="line">file_on_custom_pool -&gt; s3://custombucket/file_on_custom_pool  <span class="o">[</span>1 of 1<span class="o">]</span>
</span><span class="line"> 0 of 0     0% in    0s     0.00 B/s  <span class="k">done</span>
</span></code></pre></td></tr></tbody></table>

Verify :

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>radosgw-admin bucket stats --bucket<span class="o">=</span>custombucket
</span><span class="line"><span class="o">{</span> <span class="s2">"bucket"</span>: <span class="s2">"custombucket"</span>,
</span><span class="line">  <span class="s2">"pool"</span>: <span class="s2">".rgw.buckets.custom"</span>,
</span><span class="line">  <span class="s2">"index_pool"</span>: <span class="s2">".rgw.buckets.index"</span>,
</span><span class="line">  <span class="s2">"id"</span>: <span class="s2">"default.240909.1"</span>,
</span><span class="line">  <span class="s2">"marker"</span>: <span class="s2">"default.240909.1"</span>,
</span><span class="line">  <span class="s2">"owner"</span>: <span class="s2">"testuser"</span>,
</span><span class="line">  <span class="s2">"ver"</span>: 1,
</span><span class="line">  <span class="s2">"master_ver"</span>: 0,
</span><span class="line">  <span class="s2">"mtime"</span>: 1417016078,
</span><span class="line">  <span class="s2">"max_marker"</span>: <span class="s2">""</span>,
</span><span class="line">  <span class="s2">"usage"</span>: <span class="o">{}</span>,
</span><span class="line">  <span class="s2">"bucket_quota"</span>: <span class="o">{</span> <span class="s2">"enabled"</span>: <span class="nb">false</span>,
</span><span class="line">      <span class="s2">"max_size_kb"</span>: -1,
</span><span class="line">      <span class="s2">"max_objects"</span>: -1<span class="o">}}</span>
</span></code></pre></td></tr></tbody></table>

Pool var is set on “.rgw.buckets.custom”.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rados -p .rgw.buckets.custom ls
</span><span class="line">default.241071.1_file_on_custom_pool
</span></code></pre></td></tr></tbody></table>

It’s here !

Data placement pool is define in this order :

1. from the request (“bucket location”)
2. from user (“default\_placement” : see with `radosgw-admin metadata get user:<uid>`)
3. from region map (“default\_placement”)
