---
title: "为什么关不掉所有的OSD"
date: "2017-08-21"
author: "admin"
tags: 
  - "planet"
---

## 前言

碰到一个cepher问了一个问题：

> 为什么我的OSD关闭到最后有92个OSD无法关闭,总共的OSD有300个左右

想起来在很久以前帮人处理过一次问题，当时环境是遇上了一个BUG，需要升级到新版本进行解决，然后当时我来做操作，升级以后，发现osd无法启动，进程在，状态无法更新，当时又回滚回去，就可以了，当时好像是K版本升级到J版本，想起来之前看过这个版本里面有数据结构的变化，需要把osd全部停掉以后才能升级，然后就stop掉所有osd，当时发现有的osd还是无法stop，然后就手动去标记了，然后顺利升级  
  
今天这个现象应该跟当时是一个问题，然后搜索了一番参数以后，最后定位在确实是参数进行了控制

## 实践

我的一个8个osd的单机环境，对所有OSD进行stop以后就是这个状态，还有2个状态无法改变  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph -s</span></span><br><span class="line">    cluster <span class="number">49</span>ee8a7f-fb7c-<span class="number">4239</span><span class="operator">-a</span>4b7-acf0bc37430d</span><br><span class="line">     health HEALTH_ERR</span><br><span class="line">            <span class="number">295</span> pgs are stuck inactive <span class="keyword">for</span> more than <span class="number">300</span> seconds</span><br><span class="line">            <span class="number">295</span> pgs stale</span><br><span class="line">            <span class="number">295</span> pgs stuck stale</span><br><span class="line">            too many PGs per OSD (<span class="number">400</span> &gt; max <span class="number">300</span>)</span><br><span class="line">     monmap e1: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">3</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">     osdmap e77: <span class="number">8</span> osds: <span class="number">2</span> up, <span class="number">2</span> <span class="keyword">in</span>; <span class="number">178</span> remapped pgs</span><br><span class="line">            flags sortbitwise,require_jewel_osds</span><br><span class="line">      pgmap v296: <span class="number">400</span> pgs, <span class="number">1</span> pools, <span class="number">0</span> bytes data, <span class="number">0</span> objects</span><br><span class="line">            <span class="number">76440</span> kB used, <span class="number">548</span> GB / <span class="number">548</span> GB avail</span><br><span class="line">                 <span class="number">295</span> stale+active+clean</span><br><span class="line">                 <span class="number">105</span> active+clean</span><br></pre></td></tr></tbody></table>

看下这组参数：  

<table><tbody><tr><td class="code"><pre><span class="line">mon_osd_min_up_ratio = <span class="number">0.3</span></span><br><span class="line">mon_osd_min_<span class="keyword">in</span>_ratio = <span class="number">0.3</span></span><br></pre></td></tr></tbody></table>

我们修改成0 后再测试

<table><tbody><tr><td class="code"><pre><span class="line">mon_osd_min_up_ratio = <span class="number">0</span></span><br><span class="line">mon_osd_min_<span class="keyword">in</span>_ratio = <span class="number">0</span></span><br></pre></td></tr></tbody></table>

停止进程  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl stop ceph-osd.target</span><br></pre></td></tr></tbody></table>

查看状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph -s</span></span><br><span class="line">    cluster <span class="number">49</span>ee8a7f-fb7c-<span class="number">4239</span><span class="operator">-a</span>4b7-acf0bc37430d</span><br><span class="line">     health HEALTH_ERR</span><br><span class="line">            <span class="number">48</span> pgs are stuck inactive <span class="keyword">for</span> more than <span class="number">300</span> seconds</span><br><span class="line">            <span class="number">85</span> pgs degraded</span><br><span class="line">            <span class="number">15</span> pgs peering</span><br><span class="line">            <span class="number">400</span> pgs stale</span><br><span class="line">            <span class="number">48</span> pgs stuck inactive</span><br><span class="line">            <span class="number">48</span> pgs stuck unclean</span><br><span class="line">            <span class="number">85</span> pgs undersized</span><br><span class="line">            <span class="number">8</span>/<span class="number">8</span> <span class="keyword">in</span> osds are down</span><br><span class="line">     monmap e1: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">4</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">     osdmap e86: <span class="number">8</span> osds: <span class="number">0</span> up, <span class="number">8</span> <span class="keyword">in</span></span><br><span class="line">            flags sortbitwise,require_jewel_osds</span><br><span class="line">      pgmap v310: <span class="number">400</span> pgs, <span class="number">1</span> pools, <span class="number">0</span> bytes data, <span class="number">0</span> objects</span><br><span class="line">            <span class="number">286</span> MB used, <span class="number">2193</span> GB / <span class="number">2194</span> GB avail</span><br><span class="line">                 <span class="number">300</span> stale+active+clean</span><br><span class="line">                  <span class="number">85</span> stale+undersized+degraded+peered</span><br><span class="line">                  <span class="number">15</span> stale+peering</span><br></pre></td></tr></tbody></table>

可以看到状态已经可以正常全部关闭了

## 分析

这里不清楚官方做这个的理由，个人推断是这样的，默认的副本为3，那么在集群有三分之二的OSD都挂掉了以后，再出现OSD挂掉的情况下，这个集群其实就是一个废掉的状态的集群，而这个时候，还去触发down和out，对于环境来说已经是无效的操作了，触发的迁移也属于无效的迁移了，这个时候保持一个最终的可用的osdmap状态，对于整个环境的恢复也有一个基准点

在Luminous版本中已经把这个参数改成

> mon\_osd min\_up\_ratio = 0.3  
> mon\_osd\_min\_in\_ratio = 0.75

来降低其他异常情况引起的down，来避免过量的迁移

## 总结

本篇就是一个参数的实践

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-08-21 |

Source: zphj1987@gmail ([为什么关不掉所有的OSD](http://www.zphj1987.com/2017/08/21/why-can-not-stop-allosd/))
