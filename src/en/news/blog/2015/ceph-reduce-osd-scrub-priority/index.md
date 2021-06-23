---
title: "Ceph : Reduce OSD Scrub Priority"
date: "2015-05-08"
author: "syndicated"
tags: 
---

![Ceph : Reduce OSD Scrub Priority](images/scrubbing.jpg "Ceph : Reduce OSD Scrub Priority") Let’s assume ! on a nice sunny day , you receives complaints that your Ceph storage cluster is not performing as it was performing yesterday. After checking cluster status you found that placement groups scrubbing is going on and depending on your scenario , you would like to decrease its priority. Here is how you can do it.

**Note :** OSD disk thread I/O priority can only be changed if the disk scheduler is **cfq**.

- Check disk scheduler, if its not cfq you can change it to cfq dynamically.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo cat /sys/block/sda/queue/scheduler
</span><span class="line">noop <span class="o">[</span>deadline<span class="o">]</span> cfq
</span><span class="line"><span class="nv">$ </span>sudo <span class="nb">echo </span>cfq &gt; /sys/block/sda/queue/scheduler
</span></code></pre></td></tr></tbody></table>

- Next check for the current values of OSD disk thread io priority , the default values should be as shown below.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo ceph daemon osd.0 config get osd_disk_thread_ioprio_class
</span><span class="line"><span class="o">{</span> <span class="s2">"osd_disk_thread_ioprio_class"</span>: <span class="s2">""</span><span class="o">}</span>
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo ceph daemon osd.0 config get osd_disk_thread_ioprio_priority
</span><span class="line"><span class="o">{</span> <span class="s2">"osd_disk_thread_ioprio_priority"</span>: <span class="s2">"-1"</span><span class="o">}</span>
</span></code></pre></td></tr></tbody></table>

- Reduce the osd\_disk\_thread\_ioprio by executing

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo ceph tell osd.* injectargs <span class="s1">'--osd_disk_thread_ioprio_priority 7'</span>
</span><span class="line"><span class="nv">$ </span>sudo ceph tell osd.* injectargs <span class="s1">'--osd_disk_thread_ioprio_class idle'</span>
</span></code></pre></td></tr></tbody></table>

- Finally recheck osd\_disk\_thread\_ioprio

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo ceph daemon osd.0 config get osd_disk_thread_ioprio_class
</span><span class="line"><span class="o">{</span> <span class="s2">"osd_disk_thread_ioprio_class"</span>: <span class="s2">"idle"</span><span class="o">}</span>
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo ceph daemon osd.0 config get osd_disk_thread_ioprio_priority
</span><span class="line"><span class="o">{</span> <span class="s2">"osd_disk_thread_ioprio_priority"</span>: <span class="s2">"7"</span><span class="o">}</span>
</span></code></pre></td></tr></tbody></table>

> This should reduce OSD scrubbing priority and is useful to slow down scrubbing on an OSD that is busy handling client operations. Once the coast is clear , its a good idea to revert back the changes.
