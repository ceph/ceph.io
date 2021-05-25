---
title: "查看ceph集群被哪些客户端连接"
date: "2017-04-13"
author: "admin"
tags: 
  - "planet"
---

  
![connect](images/earth.png)  

## 前言

我们在使用集群的时候，一般来说比较关注的是后台的集群的状态，但是在做一些更人性化的管理功能的时候，就需要考虑到更多的细节

本篇就是其中的一个点，查询ceph被哪些客户端连接了  

## 实践

从接口上来说，ceph提供了文件，块，和对象的接口，所以不同的接口需要不同的查询方式，因为我接触文件和块比较多，并且文件和块存储属于长连接类型，对象属于请求类型，所以主要关注文件和块存储的连接信息查询

我的集群状态如下  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph -s</span></span><br><span class="line">    cluster <span class="number">3</span>daaf51a-eeba-<span class="number">43</span>a6-<span class="number">9</span>f58-c26c5796f928</span><br><span class="line">     health HEALTH_WARN</span><br><span class="line">            mon.lab8106 low disk space</span><br><span class="line">     monmap e1: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">6</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">      fsmap e20: <span class="number">1</span>/<span class="number">1</span>/<span class="number">1</span> up {<span class="number">0</span>=lab8106=up:active}</span><br><span class="line">     osdmap e52: <span class="number">2</span> osds: <span class="number">2</span> up, <span class="number">2</span> <span class="keyword">in</span></span><br><span class="line">            flags sortbitwise,require_jewel_osds</span><br><span class="line">      pgmap v27223: <span class="number">96</span> pgs, <span class="number">3</span> pools, <span class="number">2579</span> MB data, <span class="number">4621</span> objects</span><br><span class="line">            <span class="number">2666</span> MB used, <span class="number">545</span> GB / <span class="number">548</span> GB avail</span><br><span class="line">                  <span class="number">96</span> active+clean</span><br></pre></td></tr></tbody></table>

### 文件接口的连接信息查询

文件接口的连接信息是保存在MDS的，所以需要通过跟MDS进行交互查询,我的0h环境的MDS在lab8106，登陆到lab8106这台机器执行下面命令

<table><tbody><tr><td class="code"><pre><span class="line">[root<span class="variable">@lab8106</span> ~]# ceph daemon mds.lab8106 session <span class="keyword">ls</span>|grep <span class="string">'inst|hostname|kernel_version'</span></span><br><span class="line">        <span class="string">"inst"</span>: <span class="string">"client.34157 192.168.8.106:0/3325402310"</span>,</span><br><span class="line">            <span class="string">"hostname"</span>: <span class="string">"lab8106"</span>,</span><br><span class="line">            <span class="string">"kernel_version"</span>: <span class="string">"4.9.5-1.el7.elrepo.x86_64"</span>,</span><br><span class="line">        <span class="string">"inst"</span>: <span class="string">"client.14118 192.168.8.107:0/2202227749"</span>,</span><br><span class="line">            <span class="string">"hostname"</span>: <span class="string">"lab8107"</span>,</span><br><span class="line">            <span class="string">"kernel_version"</span>: <span class="string">"4.1.12-37.5.1.el7uek.x86_64"</span></span><br></pre></td></tr></tbody></table>

输出结果我做了过滤，主要信息是机器的IP，主机名，和内核版本

### 块接口的连接信息查询

块接口也就是rbd的接口的

首先在一台机器上map  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rbd map rbd/zp1</span></span><br></pre></td></tr></tbody></table>

执行查询  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rbd status zp1</span></span><br><span class="line">Watchers:</span><br><span class="line">	watcher=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">0</span>/<span class="number">1837592013</span> client.<span class="number">34246</span> cookie=<span class="number">1844646259873284096</span></span><br></pre></td></tr></tbody></table>

可以看到是被192.168.8.106使用了，也就是watcher

## 总结

命令都比较简单，如果做成一个监控平台，这种连接信息还是有个地方进行查询比较好

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-04-13 |

Source: zphj1987@gmail ([查看ceph集群被哪些客户端连接](http://www.zphj1987.com/2017/04/13/ceph-cluster-connect-by-which-client/))
