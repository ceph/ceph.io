---
title: "调整PG分多次调整和一次到位的迁移差别分析"
date: "2017-06-14"
author: "admin"
tags: 
  - "planet"
---

  
![different](images/diff.png)  

## 前言

这个问题来源于我们研发的一个问题，在进行pg调整的时候，是一次调整到位好，还是分多次调整比较好，分多次调整的时候会不会出现某个pg反复挪动的问题，造成整体迁移量大于一次调整的

最近自己的项目上也有pg调整的需求，这个需求一般来源于pg规划好了，后期出现节点扩容的情况，需要对pg进行增加的调整

本篇用具体的数据来分析两种方式的差别

因为本篇的篇幅较长，直接先把结论拿出来  

## 数据结论

| 调整pg | 迁移pg | 迁移对象 |
| --- | --- | --- |
| 1200->1440 | 460 | 27933 |
| 1440->1680 | 458 | 27730 |
| 1680->1920 | 465 | 27946 |
| 1920->2160 | 457 | 21141 |
| 2160->2400 | 458 | 13938 |
| 总和 | 2305 | 132696 |

| 调整pg | 迁移pg | 迁移对象 |
| --- | --- | --- |
| 1200->2400 | 2299 | 115361 |

结论：  
分多次调整的时候，PG迁移量比一次调整多了6个，多了0.2%，对象的迁移量多了17335，多了15%

从数据上看pg迁移的数目基本一样，但是数据量是多了15%，这个是因为分多次迁移的时候，在pg基数比较小的时候，迁移一个pg里面的对象要比后期分裂以后的对象要多，就产生了这个数据量的差别

从整体上来看二者需要迁移的pg基本差不多，数据量上面会增加15%，分多次的时候是可以进行周期性调整的，拆分到不同的时间段来做，所以各有好处

## 实践

### 环境准备

本次测试采用的是开发环境，使用开发环境可以很快的部署一个需要的环境，本次分析采用的就是一台机器模拟的4台机器48个 4T osd的环境

#### 环境搭建

生成集群  

<table><tbody><tr><td class="code"><pre><span class="line">./vstart.sh -n  --mon_num <span class="number">1</span> --osd_num <span class="number">48</span> --mds_num <span class="number">1</span> --short  <span class="operator">-d</span></span><br></pre></td></tr></tbody></table>

后续操作都在源码的src目录下面执行

设置存储池副本为2

修改crush weight 为3.7模拟4T盘  

<table><tbody><tr><td class="code"><pre><span class="line">seq <span class="number">0</span> <span class="number">47</span>| xargs -i ./ceph -c ceph.conf osd crush reweight osd.{} <span class="number">3.8</span></span><br></pre></td></tr></tbody></table>

模拟主机分组  

<table><tbody><tr><td class="code"><pre><span class="line">seq <span class="number">0</span> <span class="number">11</span> |xargs -i ./ceph -c ceph.conf osd crush <span class="built_in">set</span> osd.{} <span class="number">3.8</span> host=lab8106 root=default</span><br><span class="line">seq <span class="number">12</span> <span class="number">23</span> |xargs -i ./ceph -c ceph.conf osd crush <span class="built_in">set</span> osd.{} <span class="number">3.8</span> host=lab8107 root=default</span><br><span class="line">seq <span class="number">24</span> <span class="number">35</span> |xargs -i ./ceph -c ceph.conf osd crush <span class="built_in">set</span> osd.{} <span class="number">3.8</span> host=lab8108 root=default</span><br><span class="line">seq <span class="number">36</span> <span class="number">47</span> |xargs -i ./ceph -c ceph.conf osd crush <span class="built_in">set</span> osd.{} <span class="number">3.8</span> host=lab8109 root=default</span><br></pre></td></tr></tbody></table>

48个osd设置初始pg为1200，让每个osd上面差不多50个pg左右，做一下均衡操作，后续目标调整为pg为2400

准备120000个小文件准备put进去集群，使每个pg上面对象100个左右  

<table><tbody><tr><td class="code"><pre><span class="line">./rados -c ceph.conf -p rbd bench -b <span class="number">1</span>K <span class="number">600</span> write --no-cleanup</span><br></pre></td></tr></tbody></table>

### 一次调整pg到2400

统计一次调整到位的情况下的数据迁移情况  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph  -c ceph.conf  osd pool <span class="built_in">set</span> rbd pg_num <span class="number">2400</span></span><br></pre></td></tr></tbody></table>

记录当前的pg分布的情况  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappg_1200_pgp_2400</span><br></pre></td></tr></tbody></table>

调整存储池的pgp为2400  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf osd pool <span class="built_in">set</span> rbd  pgp_num <span class="number">2400</span></span><br></pre></td></tr></tbody></table>

等迁移完成以后，统计最终的pg分布情况  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappg2400_pgp2400</span><br></pre></td></tr></tbody></table>

这里说明一下，调整pg的时候只会触发pg的分裂，并不会影响集群的分布，也就是不会出现pg迁移的情况，调整pgp以后才会去改变pg的分布，所以本次数据分析统计的是pgp变动后的迁移的数据量，这个量才是集群的真正的迁移量

用比较的脚本来进行统计（脚本会在本文文末提供）  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment">#python compair.py pgmappg_1200_pgp_2400 pgmappg2400_pgp2400</span></span><br><span class="line">| pgs | objects |</span><br><span class="line">-----------------</span><br><span class="line">[<span class="number">2299</span>, <span class="number">115361</span>]</span><br></pre></td></tr></tbody></table>

也就是整个环境有2299次pg的变动，总共迁移的对象数目为115361个

### 分五次调整到2400PG

#### 初始pg为1200个第一次调整，1200PG调整到1440PG

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf osd pool <span class="built_in">set</span> rbd pg_num <span class="number">1440</span></span><br></pre></td></tr></tbody></table>

调整pg为1440,当前pgp为1200  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappaira1</span><br></pre></td></tr></tbody></table>

调整pgp为1440,当前pg为1440  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappaira2</span><br></pre></td></tr></tbody></table>

统计第一次调整后的迁移量  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 pgdata]<span class="comment"># python compair.py pgmappaira1 pgmappaira2</span></span><br><span class="line">| pgs | objects |</span><br><span class="line">-----------------</span><br><span class="line">[<span class="number">460</span>, <span class="number">27933</span>]</span><br></pre></td></tr></tbody></table>

#### 第二次调整，1440PG调整到1680PG

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf osd pool <span class="built_in">set</span> rbd pg_num <span class="number">1680</span></span><br></pre></td></tr></tbody></table>

调整pg为1680,当前pgp为1440  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappairb1</span><br></pre></td></tr></tbody></table>

调整pgp为1680,当前pg为1680  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappairb2</span><br></pre></td></tr></tbody></table>

统计第二次调整后的迁移量  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 pgdata]<span class="comment"># python compair.py pgmappairb1 pgmappairb2</span></span><br><span class="line">| pgs | objects |</span><br><span class="line">-----------------</span><br><span class="line">[<span class="number">458</span>, <span class="number">27730</span>]</span><br></pre></td></tr></tbody></table>

#### 第三次调整，1680PG调整到1920PG

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf osd pool <span class="built_in">set</span> rbd pg_num <span class="number">1920</span></span><br></pre></td></tr></tbody></table>

调整pg为1920,当前pgp为1680  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappairc1</span><br></pre></td></tr></tbody></table>

调整pgp为1920,当前pg为1920  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappairc2</span><br></pre></td></tr></tbody></table>

统计第三次调整后的迁移量  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 pgdata]<span class="comment"># python compair.py  pgmappairc1 pgmappairc2</span></span><br><span class="line">| pgs | objects |</span><br><span class="line">-----------------</span><br><span class="line">[<span class="number">465</span>, <span class="number">27946</span>]</span><br></pre></td></tr></tbody></table>

#### 第四次调整，1920PG调整到2160PG

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf osd pool <span class="built_in">set</span> rbd pg_num <span class="number">2160</span></span><br></pre></td></tr></tbody></table>

调整pg为2160,当前pgp为1920  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappaird1</span><br></pre></td></tr></tbody></table>

调整pgp为2160,当前pg为2160  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappaird2</span><br></pre></td></tr></tbody></table>

统计第四次调整后的迁移量  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 pgdata]<span class="comment"># python compair.py pgmappaird1 pgmappaird2</span></span><br><span class="line">| pgs | objects |</span><br><span class="line">-----------------</span><br><span class="line">[<span class="number">457</span>, <span class="number">21141</span>]</span><br></pre></td></tr></tbody></table>

#### 第五次调整，2160PG调整到2400PG

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf osd pool <span class="built_in">set</span> rbd pg_num <span class="number">2400</span></span><br></pre></td></tr></tbody></table>

调整pg为2400,当前pgp为2160  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappaire1</span><br></pre></td></tr></tbody></table>

调整pgp为2400,当前pg为2400  
记录当前的pg分布数据  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf pg dump pgs|awk <span class="string">'{print $1,$2,$15,$17}'</span> &gt; pgmappaire2</span><br></pre></td></tr></tbody></table>

统计第五次调整后的迁移量  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 pgdata]<span class="comment"># python compair.py pgmappaire1 pgmappaire2</span></span><br><span class="line">| pgs | objects |</span><br><span class="line">-----------------</span><br><span class="line">[<span class="number">458</span>, <span class="number">13938</span>]</span><br></pre></td></tr></tbody></table>

上面五次加起来的总量为  
2305 PGS 132696 objects

## 统计的脚本

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#!/usr/bin/env python</span></span><br><span class="line"> <span class="comment"># -*- coding: utf-8 -*-</span></span><br><span class="line">__author__ =<span class="string">"zp"</span></span><br><span class="line">import os,sys</span><br><span class="line"></span><br><span class="line">class filetojson(object):</span><br><span class="line">    def __init__(self,orin,new):</span><br><span class="line">        self.origin=orin</span><br><span class="line">        self.new=new</span><br><span class="line"></span><br><span class="line">    def tojson(self,filename):</span><br><span class="line">        data={}</span><br><span class="line">        pginfo={}</span><br><span class="line">        <span class="keyword">for</span> line <span class="keyword">in</span> open(filename):</span><br><span class="line">            <span class="keyword">if</span> <span class="string">"pg_stat"</span> <span class="keyword">in</span> line:</span><br><span class="line">                <span class="built_in">continue</span></span><br><span class="line">            lines=line.split()</span><br><span class="line">            pg=lines[<span class="number">0</span>]</span><br><span class="line">            objects=lines[<span class="number">1</span>]</span><br><span class="line">            withosd=lines[<span class="number">2</span>]</span><br><span class="line"></span><br><span class="line">            data[pg]={<span class="string">'objects'</span>:objects,<span class="string">'osd'</span>:list(<span class="built_in">eval</span>(withosd))}</span><br><span class="line">        <span class="built_in">return</span> data</span><br><span class="line"></span><br><span class="line">    def compare(self):</span><br><span class="line">        movepg=<span class="number">0</span></span><br><span class="line">        allmovepg=<span class="number">0</span></span><br><span class="line">        allmoveobject=<span class="number">0</span></span><br><span class="line">        moveobject=<span class="number">0</span></span><br><span class="line">        oringinmap=self.tojson(self.origin)</span><br><span class="line">        newmap=self.tojson(self.new)</span><br><span class="line">        <span class="keyword">for</span> key <span class="keyword">in</span> oringinmap:</span><br><span class="line">            amapn=<span class="built_in">set</span>(oringinmap[key][<span class="string">'osd'</span>])</span><br><span class="line">            bmapn=<span class="built_in">set</span>(newmap[key][<span class="string">'osd'</span>])</span><br><span class="line">            movepg=len(list(amapn.difference(bmapn)))</span><br><span class="line">            <span class="keyword">if</span> movepg != <span class="number">0</span>:</span><br><span class="line">                moveobject=int(oringinmap[key][<span class="string">'objects'</span>]) * int(movepg)</span><br><span class="line">                allmovepg=allmovepg+movepg</span><br><span class="line">                allmoveobject=allmoveobject+moveobject</span><br><span class="line">        <span class="built_in">return</span> [allmovepg,allmoveobject]</span><br><span class="line"></span><br><span class="line">mycom=filetojson(sys.argv[<span class="number">1</span>],sys.argv[<span class="number">2</span>])</span><br><span class="line"><span class="built_in">print</span> <span class="string">"| pgs | objects |"</span></span><br><span class="line"><span class="built_in">print</span> <span class="string">"-----------------"</span></span><br><span class="line"><span class="built_in">print</span> mycom.compare()</span><br></pre></td></tr></tbody></table>

## 总结

本篇是对集群进行pg调整的这个场景下迁移的数据进行分析的，对于一个集群来说，还是要用数据来进行问题的说明会比较有说服力，凭感觉还是没有那么强的说服力，本篇因为环境所限，所以在模拟的时候采用的是单个pg100个对象的样本，如果需要更精确的数据可以采用多次测试，并且加大这个单个pg的对象数目

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-06-14 |

Source: zphj1987@gmail ([调整PG分多次调整和一次到位的迁移差别分析](http://www.zphj1987.com/2017/06/14/different-change-pg/))
