---
title: "RadosGW Big Index"
date: "2015-05-12"
author: "laurentbarbe"
tags: 
---

```
$ rados -p .default.rgw.buckets.index listomapkeys .dir.default.1970130.1 | wc -l
166768275
```

With each key containing between 100 and 250 bytes, this make a very big object for rados (several GB)… Especially when migrating it from an OSD to another (this will lock all writes), moreover, the OSD containing this object will use a lot of memory …

Since the hammer release it is possible to shard the bucket index. However, you can not shard an existing one but you can setup it for new buckets. This is a very good thing for the scalability.

## Setting up index max shards

You can specify the default number of shards for new buckets :

- Per zone, in regionmap :

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
</pre></td><td class="code"><pre><code class="json"><span class="line"><span class="err">$</span> <span class="err">radosgw-admin</span> <span class="err">region</span> <span class="err">get</span>
</span><span class="line"><span class="err">...</span>
</span><span class="line"><span class="s2">"zones"</span><span class="err">:</span> <span class="p">[</span>
</span><span class="line">    <span class="p">{</span>
</span><span class="line">        <span class="nt">"name"</span><span class="p">:</span> <span class="s2">"default"</span><span class="p">,</span>
</span><span class="line">        <span class="nt">"endpoints"</span><span class="p">:</span> <span class="p">[</span>
</span><span class="line">            <span class="s2">"http:\/\/storage.example.com:80\/"</span>
</span><span class="line">        <span class="p">],</span>
</span><span class="line">        <span class="nt">"log_meta"</span><span class="p">:</span> <span class="s2">"true"</span><span class="p">,</span>
</span><span class="line">        <span class="nt">"log_data"</span><span class="p">:</span> <span class="s2">"true"</span><span class="p">,</span>
</span><span class="line">        <span class="nt">"bucket_index_max_shards"</span><span class="p">:</span> <span class="mi">8</span>             <span class="err">&lt;===</span>
</span><span class="line">    <span class="p">},</span>
</span><span class="line"><span class="err">...</span>
</span></code></pre></td></tr></tbody></table>

- In in radosgw section in ceph.conf (this override the per zone value)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class="json"><span class="line"><span class="err">...</span>
</span><span class="line"><span class="p">[</span><span class="err">client.radosgw.gateway</span><span class="p">]</span>
</span><span class="line"><span class="err">rgw</span> <span class="err">bucket</span> <span class="err">index</span> <span class="err">max</span> <span class="err">shards</span> <span class="err">=</span> <span class="mi">8</span>
</span><span class="line"><span class="err">....</span>
</span></code></pre></td></tr></tbody></table>

## Verification :

```
$ radosgw-admin metadata get bucket:mybucket | grep bucket_id
            "bucket_id": "default.1970130.1"

$ radosgw-admin metadata get bucket.instance:mybucket:default.1970130.1 | grep num_shards
            "num_shards": 8,

$ rados -p .rgw.buckets.index ls | grep default.1970130.1
.dir.default.1970130.1.0
.dir.default.1970130.1.1
.dir.default.1970130.1.2
.dir.default.1970130.1.3
.dir.default.1970130.1.4
.dir.default.1970130.1.5
.dir.default.1970130.1.6
.dir.default.1970130.1.7
```

## Bucket listing impact :

A simple test with ~200k objects in a bucket :

| num\_shard | time (s) |
| :-- | :-- |
| 0 | 25 |
| 8 | 36 |
| 128 | 109 |

So, do not use buckets with thousands of shards if you do not need it, because the bucket listing will become very slow…

Link to the blueprint :

[https://wiki.ceph.com/Planning/Blueprints/Hammer/rgw%3A\_bucket\_index\_scalability](https://wiki.ceph.com/Planning/Blueprints/Hammer/rgw%3A_bucket_index_scalability)
