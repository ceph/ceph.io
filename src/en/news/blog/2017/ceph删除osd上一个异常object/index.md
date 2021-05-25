---
title: "Ceph删除OSD上一个异常object"
date: "2017-04-19"
author: "admin"
tags: 
  - "planet"
---

  
![delete](images/delete.png)  

## 前言

ceph里面的数据是以对象的形式存储在OSD当中的，有的时候因为磁盘的损坏或者其它的一些特殊情况，会引起集群当中的某一个对象的异常，那么我们需要对这个对象进行处理

在对象损坏的情况下，启动OSD有的时候都会有问题，那么通过rados rm的方式是没法发送到这个无法启动的OSD的，也就无法删除，所以需要用其他的办法来处理这个情况  

## 处理步骤

### 查找对象的路径

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph osd map rbd  rbd_data.857e6b8b4567.00000000000000ba</span></span><br><span class="line">osdmap e53 pool <span class="string">'rbd'</span> (<span class="number">0</span>) object <span class="string">'rbd_data.857e6b8b4567.00000000000000ba'</span> -&gt; pg <span class="number">0.2</span>daee1ba (<span class="number">0.3</span>a) -&gt; up ([<span class="number">1</span>], p1) acting ([<span class="number">1</span>], p1)</span><br></pre></td></tr></tbody></table>

先找到这个对象所在的OSD以及PG

### 设置集群的noout

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment">#ceph osd set noout</span></span><br></pre></td></tr></tbody></table>

这个是为了防止osd的停止产生不必要的删除

### 停止OSD

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ]<span class="comment">#systemctl stop ceph-osd@1</span></span><br></pre></td></tr></tbody></table>

如果osd已经是停止的状态就不需要做这一步

### 使用ceph-objectstore-tool工具删除单个对象

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ]<span class="comment">#ceph-objectstore-tool --data-path /var/lib/ceph/osd/ceph-1/ --journal-path /var/lib/ceph/osd/ceph-1/journal --pgid 0.3a  rbd_data.857e6b8b4567.00000000000000ba remove</span></span><br></pre></td></tr></tbody></table>

如果有多个副本的情况下，最好都删除掉，影响的数据就是包含这个对象的数据，这个操作的前提是这个对象数据已经被破坏了，如果是部分破坏，可以用集群的repair进行修复，这个是无法修复的情况下的删除对象，来实现启动OSD而不影响其它的数据的

### 启动OSD

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ]<span class="comment"># systemctl start ceph-osd@1</span></span><br></pre></td></tr></tbody></table>

### 解除noout

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment">#ceph osd unset noout</span></span><br></pre></td></tr></tbody></table>

## 总结

一般情况下比较少出现这个情况，如果有这样的删除损坏的对象的需求，就可以这么处理

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-04-19 |

Source: zphj1987@gmail ([Ceph删除OSD上一个异常object](http://www.zphj1987.com/2017/04/19/ceph-delete-an-error-object/))
