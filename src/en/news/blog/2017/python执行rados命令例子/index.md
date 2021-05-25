---
title: "python执行rados命令例子"
date: "2017-02-28"
author: "admin"
tags: 
  - "planet"
---

  
![python](images/we-love-python-800-600.png)  

## 前言

我们以前的管理平台在python平台下面做的，内部做的一些操作采用的是命令执行，然后解析的方式去做的，ceph自身有python的rados接口，可以直接调用原生接口，然后直接解析json的方式，这样更靠近底层  
  
在看ceph-dash内部的实现的时候，发现里面的获取集群信息的代码可以留存备用

## 代码实例

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#!/usr/bin/env python</span></span><br><span class="line"><span class="comment"># -*- coding: UTF-8 -*-</span></span><br><span class="line">import json</span><br><span class="line"></span><br><span class="line">from rados import Rados</span><br><span class="line">from rados import Error as RadosError</span><br><span class="line"></span><br><span class="line">class CephClusterCommand(dict):</span><br><span class="line">    <span class="string">""</span><span class="string">"</span><br><span class="line">    Issue a ceph command on the given cluster and provide the returned json</span><br><span class="line">    "</span><span class="string">""</span></span><br><span class="line"></span><br><span class="line">    def __init__(self, cluster, **kwargs):</span><br><span class="line">        dict.__init__(self)</span><br><span class="line">        ret, buf, err = cluster.mon_<span class="built_in">command</span>(json.dumps(kwargs), <span class="string">''</span>, timeout=<span class="number">5</span>)</span><br><span class="line">        <span class="keyword">if</span> ret != <span class="number">0</span>:</span><br><span class="line">            self[<span class="string">'err'</span>] = err</span><br><span class="line">        <span class="keyword">else</span>:</span><br><span class="line">            self.update(json.loads(buf))</span><br><span class="line"></span><br><span class="line">config={<span class="string">'conffile'</span>: <span class="string">'/etc/ceph/ceph.conf'</span>, <span class="string">'conf'</span>: {}}</span><br><span class="line">with Rados(**config) as cluster:</span><br><span class="line">    cluster_status = CephClusterCommand(cluster, prefix=<span class="string">'status'</span>, format=<span class="string">'json'</span>)</span><br><span class="line">    <span class="built_in">print</span> cluster_status</span><br></pre></td></tr></tbody></table>

## 总结

调用原生接口的好处在于,只需要很少的库就可以取得监控系统所需要的值

最近在研究系统的时候发现一个问题

> 跟着错误的文档实践只会掉进同一个坑

在遇到一个小的错误的时候，翻到了一个github的Issue，然后看到一个人把自己的配置过程和配置文件详详细细的都写在Issue下面，然后就跟着他的过程走了一遍，发现不论怎么弄都是同样的错误

而返回去根据另一个正确的文档又走一遍的时候，发现终于跑通了，回顾了一遍，发现是那个错误的过程里面的配置文件里面是有配置项目，不兼容的，而软件也没有抛出相关的错误，然后在同一个地方找了两天

所以如果有碰到无法解决的操作步骤文档的时候，就尽量不要去根据那个文档操作了，除非自己对细节弄的很清楚了

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-02-28 |

Source: zphj1987@gmail ([python执行rados命令例子](http://www.zphj1987.com/2017/02/28/python-command-rados-sample/))
