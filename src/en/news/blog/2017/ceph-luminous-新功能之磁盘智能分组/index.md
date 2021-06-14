---
title: "ceph luminous 新功能之磁盘智能分组"
date: "2017-06-28"
author: "admin"
tags: 
  - "planet"
---

  
![](images/ssd.png)  

## 前言

本篇是luminous一个新功能介绍，关于磁盘智能分组的，这个在ceph里面叫crush class，这个我自己起名叫磁盘智能分组，因为这个实现的功能就是根据磁盘类型进行属性关联，然后进行分类，减少了很多的人为操作

以前我们需要对ssd和hdd进行分组的时候，需要大量的修改crush map，然后绑定不同的存储池到不同的 crush 树上面，现在这个逻辑简化了很多

> ceph crush class {create,rm,ls} manage the new CRUSH device  
> class feature. ceph crush set-device-class  
> will set the clas for a particular device.
> 
> Each OSD can now have a device class associated with it (e.g., hdd or  
> ssd), allowing CRUSH rules to trivially map data to a subset of devices  
> in the system. Manually writing CRUSH rules or manual editing of the CRUSH is normally not required.

这个是发布的公告里面关于这两个功能的说明的，本篇就来看看这个功能怎么用

## 实践

### 首先创建分类的规则

创建一个ssd的分组  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd crush class create  ssd</span></span><br><span class="line">created class ssd with id <span class="number">0</span> to crush map</span><br></pre></td></tr></tbody></table>

也就是一个名称，这里我认为是ssd的分组就创建名词为ssd

再创建一个hdd的分组  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd crush class create  hdd</span></span><br><span class="line">created class hdd with id <span class="number">1</span> to crush map</span><br></pre></td></tr></tbody></table>

### 查询分组规则

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd crush class ls</span></span><br><span class="line">[</span><br><span class="line">    <span class="string">"ssd"</span>,</span><br><span class="line">    <span class="string">"hdd"</span></span><br><span class="line">]</span><br></pre></td></tr></tbody></table>

### 把osd绑定不同的属性(属性名称就是上面的分类)

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd crush set-device-class osd.0  ssd</span></span><br><span class="line"><span class="built_in">set</span>-device-class item id <span class="number">0</span> name <span class="string">'osd.0'</span> device_class ssd</span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd crush set-device-class osd.2  ssd</span></span><br><span class="line"><span class="built_in">set</span>-device-class item id <span class="number">2</span> name <span class="string">'osd.2'</span> device_class ssd</span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd crush set-device-class osd.1  hdd</span></span><br><span class="line"><span class="built_in">set</span>-device-class item id <span class="number">1</span> name <span class="string">'osd.1'</span> device_class hdd</span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd crush set-device-class osd.3  hdd</span></span><br><span class="line">Error ENOENT: osd.<span class="number">4</span> does not exist.  create it before updating the crush map</span><br></pre></td></tr></tbody></table>

查询设置以后的效果  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd tree</span></span><br><span class="line">ID WEIGHT  TYPE NAME            UP/DOWN REWEIGHT PRIMARY-AFFINITY </span><br><span class="line">-<span class="number">6</span> <span class="number">0.54559</span> root default~hdd                                       </span><br><span class="line">-<span class="number">5</span> <span class="number">0.54559</span>     host lab8106~hdd                                   </span><br><span class="line"> <span class="number">1</span> <span class="number">0.27280</span>         osd.<span class="number">1</span>             up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">3</span> <span class="number">0.27280</span>         osd.<span class="number">3</span>             up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">4</span> <span class="number">0.54559</span> root default~ssd                                       </span><br><span class="line">-<span class="number">3</span> <span class="number">0.54559</span>     host lab8106~ssd                                   </span><br><span class="line"> <span class="number">0</span> <span class="number">0.27280</span>         osd.<span class="number">0</span>             up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">2</span> <span class="number">0.27280</span>         osd.<span class="number">2</span>             up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">1</span> <span class="number">1.09119</span> root default                                           </span><br><span class="line">-<span class="number">2</span> <span class="number">1.09119</span>     host lab8106                                       </span><br><span class="line"> <span class="number">0</span> <span class="number">0.27280</span>         osd.<span class="number">0</span>             up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">1</span> <span class="number">0.27280</span>         osd.<span class="number">1</span>             up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">2</span> <span class="number">0.27280</span>         osd.<span class="number">2</span>             up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">3</span> <span class="number">0.27280</span>         osd.<span class="number">3</span>             up  <span class="number">1.00000</span>          <span class="number">1.00000</span></span><br></pre></td></tr></tbody></table>

这个就是这个功能比较核心的地方，会根据磁盘类型不同，自动的创建了不同的树，并且把磁盘放入到了树里面去了

### 根据根创建规则（这个地方有bug，下面会提及）

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd crush rule create-simple ssd default~ssd host firstn</span></span><br></pre></td></tr></tbody></table>

检查创建的rule规则：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 build]<span class="comment"># ceph   osd  crush rule  dump ssd</span></span><br><span class="line">{</span><br><span class="line">    <span class="string">"rule_id"</span>: <span class="number">1</span>,</span><br><span class="line">    <span class="string">"rule_name"</span>: <span class="string">"ssd"</span>,</span><br><span class="line">    <span class="string">"ruleset"</span>: <span class="number">1</span>,</span><br><span class="line">    <span class="string">"type"</span>: <span class="number">1</span>,</span><br><span class="line">    <span class="string">"min_size"</span>: <span class="number">1</span>,</span><br><span class="line">    <span class="string">"max_size"</span>: <span class="number">10</span>,</span><br><span class="line">    <span class="string">"steps"</span>: [</span><br><span class="line">        {</span><br><span class="line">            <span class="string">"op"</span>: <span class="string">"take"</span>,</span><br><span class="line">            <span class="string">"item"</span>: -<span class="number">4</span>,</span><br><span class="line">            <span class="string">"item_name"</span>: <span class="string">"default~ssd"</span></span><br><span class="line">        },</span><br><span class="line">        {</span><br><span class="line">            <span class="string">"op"</span>: <span class="string">"chooseleaf_firstn"</span>,</span><br><span class="line">            <span class="string">"num"</span>: <span class="number">0</span>,</span><br><span class="line">            <span class="string">"type"</span>: <span class="string">"host"</span></span><br><span class="line">        },</span><br><span class="line">        {</span><br><span class="line">            <span class="string">"op"</span>: <span class="string">"emit"</span></span><br><span class="line">        }</span><br><span class="line">    ]</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

### 根据rule创建存储池

<table><tbody><tr><td class="code"><pre><span class="line">ceph  osd pool create testpool <span class="number">64</span> <span class="number">64</span> ssd</span><br><span class="line">ceph   osd dump|grep pool</span><br><span class="line">pool <span class="number">3</span> <span class="string">'testpool'</span> replicated size <span class="number">3</span> min_size <span class="number">1</span> crush_rule <span class="number">1</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">64</span> pgp_num <span class="number">64</span> last_change <span class="number">27</span> flags hashpspool stripe_width <span class="number">0</span></span><br></pre></td></tr></tbody></table>

这里有个验证规则的小bug 代码在src/mon/MonCommands.h  

<table><tbody><tr><td class="code"><pre><span class="line"> COMMAND(<span class="string">"osd crush rule create-simple "</span> </span><br><span class="line"><span class="string">"name=name,type=CephString,goodchars=[A-Za-z0-9-_.] "</span> </span><br><span class="line"><span class="string">"name=root,type=CephString,goodchars=[A-Za-z0-9-_.] "</span> </span><br><span class="line"><span class="string">"name=type,type=CephString,goodchars=[A-Za-z0-9-_.] "</span> </span><br></pre></td></tr></tbody></table>

默认的goodchars不包含’~’,这里不清楚社区是准备去改创建的逻辑去掉这个特殊符号，还是去改创建rule相关的规则，我已经提交了[issue#20446](http://tracker.ceph.com/issues/20446)，等待社区的修改方案

## 功能逻辑

### 现在方法

创建一个磁盘类型的class，给磁盘标记class的统一标签，自动会根据class的类型创建一个树，根据树创建rule，根据rule创建存储池，整个操作没有动crushmap的操作

增加或修改盘的时候，设置下属性即可

### 以前的方法

先添加盘，手动创建树，新加的osd要找下原来的树的名称，然后把osd放到这个树里面去，然后创建规则，根据rule创建存储池

增加盘或修改盘的时候，需要查找下，然后根据查找的规则进行相关操作

## 总结

现在方法对用户操作来说更透明，直接对磁盘进行分类打标签即可，减少了一些复杂的操作逻辑，是一个很不错的功能

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-06-28 |

Source: zphj1987@gmail ([ceph luminous 新功能之磁盘智能分组](http://www.zphj1987.com/2017/06/28/ceph-luminous-new-osd-class/))
