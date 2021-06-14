---
title: "RBD Replication"
date: "2014-08-12"
author: "laurentbarbe"
tags: 
  - "planet"
---

A simple exemple to make Replication for RBD.

Based on this post from scuttlemonkey : [http://ceph.com/dev-notes/incremental-snapshots-with-rbd/,](http://ceph.com/dev-notes/incremental-snapshots-with-rbd/,) here is a sample script to synchronize rbd image on a remote cluster (eg for backups). In the example below, the sync is made to an “archive” pool on the same cluster. (For remote host, you need to use ssh key.)

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
<span class="line-number">30</span>
<span class="line-number">31</span>
<span class="line-number">32</span>
<span class="line-number">33</span>
<span class="line-number">34</span>
<span class="line-number">35</span>
<span class="line-number">36</span>
<span class="line-number">37</span>
<span class="line-number">38</span>
<span class="line-number">39</span>
<span class="line-number">40</span>
<span class="line-number">41</span>
<span class="line-number">42</span>
<span class="line-number">43</span>
<span class="line-number">44</span>
<span class="line-number">45</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c">#!/bin/bash</span>
</span><span class="line">
</span><span class="line"><span class="nv">pool</span><span class="o">=</span><span class="s1">'rbd'</span>
</span><span class="line"><span class="nv">pooldest</span><span class="o">=</span><span class="s1">'archive'</span>
</span><span class="line"><span class="nv">rbd</span><span class="o">=</span><span class="s2">"myrbd"</span>
</span><span class="line"><span class="nv">destination_host</span><span class="o">=</span><span class="s2">"127.0.0.1"</span>
</span><span class="line"><span class="nv">snapname</span><span class="o">=</span><span class="s1">'rbd-sync-'</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="c"># Retreive last synced id</span>
</span><span class="line"><span class="nv">expr</span><span class="o">=</span><span class="s2">" $snapname\([[:digit:]]\+\)"</span>
</span><span class="line"><span class="k">if </span>rbd info <span class="nv">$pool</span>/<span class="nv">$rbd</span> &gt;/dev/null 2&gt;&amp;1; <span class="k">then</span>
</span><span class="line"><span class="k">        </span>rbd snap ls <span class="nv">$pool</span>/<span class="nv">$rbd</span> | grep <span class="s2">"$expr"</span> | sed  <span class="s2">"s/.*$expr.*/\1/g"</span> | sort -n &gt; /tmp/rbd-sync-snaplistlocal
</span><span class="line"><span class="k">else</span>
</span><span class="line"><span class="k">        </span><span class="nb">echo</span> <span class="s2">"no image $pool/$rbd"</span>
</span><span class="line">        <span class="k">return</span>
</span><span class="line"><span class="k">fi</span>
</span><span class="line"><span class="k">if </span>ssh <span class="nv">$destination_host</span> rbd info <span class="nv">$pooldest</span>/<span class="nv">$rbd</span> &gt;/dev/null 2&gt;&amp;1; <span class="k">then</span>
</span><span class="line"><span class="k">        </span>ssh <span class="nv">$destination_host</span> rbd snap ls <span class="nv">$pooldest</span>/<span class="nv">$rbd</span> | grep <span class="s2">"$expr"</span> | sed <span class="s2">"s/.*$expr.*/\1/g"</span> | sort -n &gt; /tmp/rbd-sync-snaplistremote
</span><span class="line"><span class="k">else</span>
</span><span class="line"><span class="k">        </span><span class="nb">echo</span> <span class="s2">""</span> &gt; /tmp/rbd-sync-snaplistremote
</span><span class="line"><span class="k">fi</span>
</span><span class="line"><span class="nv">syncid</span><span class="o">=</span><span class="k">$(</span>comm -12 /tmp/rbd-sync-snaplistlocal /tmp/rbd-sync-snaplistremote | tail -n1<span class="k">)</span>
</span><span class="line"><span class="nv">lastid</span><span class="o">=</span><span class="k">$(</span>cat /tmp/rbd-sync-snaplistlocal /tmp/rbd-sync-snaplistremote | sort -n | tail -n1<span class="k">)</span>
</span><span class="line"><span class="nv">nextid</span><span class="o">=</span><span class="k">$((</span><span class="nv">$lastid</span> <span class="o">+</span> <span class="m">1</span><span class="k">))</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="c"># Initial sync</span>
</span><span class="line"><span class="k">if</span> <span class="o">[</span> <span class="s2">"$syncid"</span> <span class="o">=</span> <span class="s2">""</span> <span class="o">]</span>; <span class="k">then</span>
</span><span class="line"><span class="k">        </span><span class="nb">echo</span> <span class="s2">"Initial sync with id $nextid"</span>
</span><span class="line">        rbd snap create <span class="nv">$pool</span>/<span class="nv">$rbd</span>@<span class="nv">$snapname$nextid</span>
</span><span class="line">        rbd <span class="nb">export</span> --no-progress <span class="nv">$pool</span>/<span class="nv">$rbd</span>@<span class="nv">$snapname$nextid</span> - <span class="se">\</span>
</span><span class="line">        | ssh <span class="nv">$destination_host</span> rbd import --image-format 2 - <span class="nv">$pooldest</span>/<span class="nv">$rbd</span>
</span><span class="line">        ssh <span class="nv">$destination_host</span> rbd snap create <span class="nv">$pooldest</span>/<span class="nv">$rbd</span>@<span class="nv">$snapname$nextid</span>
</span><span class="line">
</span><span class="line"><span class="c"># Incremental sync</span>
</span><span class="line"><span class="k">else</span>
</span><span class="line"><span class="k">        </span><span class="nb">echo</span> <span class="s2">"Found synced id : $syncid"</span>
</span><span class="line">        rbd snap create <span class="nv">$pool</span>/<span class="nv">$rbd</span>@<span class="nv">$snapname$nextid</span>
</span><span class="line">
</span><span class="line">        <span class="nb">echo</span> <span class="s2">"Sync $syncid -&gt; $nextid"</span>
</span><span class="line">
</span><span class="line">        rbd <span class="nb">export</span>-diff --no-progress --from-snap <span class="nv">$snapname$syncid</span> <span class="nv">$pool</span>/<span class="nv">$rbd</span>@<span class="nv">$snapname$nextid</span> - <span class="se">\</span>
</span><span class="line">        | ssh <span class="nv">$destination_host</span> rbd import-diff - <span class="nv">$pooldest</span>/<span class="nv">$rbd</span>
</span><span class="line"><span class="k">fi</span>
</span></code></pre></td></tr></tbody></table>

An other exemple : [https://www.rapide.nl/blog/item/ceph\_-\_rbd\_replication](https://www.rapide.nl/blog/item/ceph_-_rbd_replication)
