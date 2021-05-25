---
title: "Ceph Loves Jumbo Frames"
date: "2015-04-25"
author: "syndicated"
tags: 
  - "planet"
---

![Ceph Loves Jumbo Frames](images/jumbo-frames.png "Ceph Loves Jumbo Frames") Who doesn’t loves a high performing Ceph storage cluster. To get this you need to tame it , i mean not only Ceph tuning but also Network needs to be tuned. The quickest way to tune your network is to enable Jumbo Frames.

## What are they :

- They are ethernet frames with payload more than 1500 MTU
- Can significantly improve network performance by making data transmission efficient.
- Requires Gigabit ethernet
- Most of the enterprise network device supports Jumbo Frames
- Some people also call them ‘Giants’

## Enabling Jumbo Frames

- Make sure your switch port is configured to accept Jumbo frames
- On server side , set your network interface MTU to 9000

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="sh"><span class="line"><span class="c"># ifconfig eth0 mtu 9000</span>
</span></code></pre></td></tr></tbody></table>

- Make changes permanent by updating network interface file and restart network services

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="sh"><span class="line"><span class="c"># echo "MTU 9000" &gt;&gt; /etc/sysconfig/network-script/ifcfg-eth0</span>
</span></code></pre></td></tr></tbody></table>

- Confirm if MTU is used between two specific devices

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="sh"><span class="line"><span class="c"># ip route get {IP-address}</span>
</span></code></pre></td></tr></tbody></table>

> **In my production Ceph cluster, i have seen improvements after enabling Jumbo Frames both on Ceph as well as on OpenStack nodes.**
