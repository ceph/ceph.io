---
title: "Dealing With Some Osd Timeouts"
date: "2017-03-03"
author: "admin"
tags: 
  - "planet"
---

In some cases, some operations may take a little longer to be processed by the osd. And the operation may fail, or even make the OSD to suicide. There are many parameters for these timeouts. Some examples :

## Thread suicide timed out

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">heartbeat_map is_healthy 'OSD::osd_op_tp thread 0x7f1ee3ca7700' had suicide timed out after 150
</span><span class="line">common/HeartbeatMap.cc: In function 'bool ceph::HeartbeatMap::_check(ceph::heartbeat_handle_d*, const char*, time_t)' thread 7f1f0c2a3700 time 2017-03-03 11:03:46.550118
</span><span class="line">common/HeartbeatMap.cc: 79: FAILED assert(0 == "hit suicide timeout")</span></code></pre></td></tr></tbody></table>

In ceph.conf :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">[osd]
</span><span class="line">osd_op_thread_suicide_timeout = 900</span></code></pre></td></tr></tbody></table>

## Operation thread timeout

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">heartbeat_map is_healthy 'OSD::osd_op_tp thread 0x7fd306416700' had timed out after 15</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">ceph tell osd.XX injectargs --osd-op-thread-timeout 90
</span><span class="line">(default value is 15s)</span></code></pre></td></tr></tbody></table>

## Recovery thread timout

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">heartbeat_map is_healthy 'OSD::recovery_tp thread 0x7f4c2edab700' had timed out after 30</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">ceph tell osd.XX injectargs --osd-recovery-thread-timeout 180
</span><span class="line">(default value is 30s)</span></code></pre></td></tr></tbody></table>

For more details, please refer to ceph documentation :

[http://docs.ceph.com/docs/master/rados/configuration/osd-config-ref/](http://docs.ceph.com/docs/master/rados/configuration/osd-config-ref/)

Source: Laurent Barbe ([Dealing With Some Osd Timeouts](http://cephnotes.ksperis.com/blog/2017/03/03/dealing-with-some-osd-timeouts/))
