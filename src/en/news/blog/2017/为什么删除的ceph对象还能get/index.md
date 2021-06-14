---
title: "为什么删除的Ceph对象还能get"
date: "2017-04-19"
author: "admin"
tags: 
  - "planet"
---

  
![rm](images/rm.jpg)  

## 前言

在很久以前在研究一套文件系统的时候，当时发现一个比较奇怪的现象，没有文件存在，磁盘容量还在增加，在研究了一段时间后，发现这里面有一种比较奇特的处理逻辑

这套文件系统在处理一个文件的时候放入的是一个临时目录，最开始在发送第一个写请求后，在操作系统层面马上进行了一个delete操作，而写还在继续，并且需要处理这个数据的进程一直占着的，一旦使用完这个文件，不需要做处理，这个文件就会自动释放掉，而无需担心临时文件占用空间的问题

在Ceph集群当中，有人碰到了去后台的OSD直接rm一个对象后，在前端通过rados还能get到这个删除的对象，而不能rados ls到，我猜测就是这个原因，我们来看下怎么验证这个问题  

## 验证步骤

### 准备测试数据，并且put进去集群

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># cat zp1 </span></span><br><span class="line">sdasdasd</span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd put zp1 zp1</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados -p rbd ls</span></span><br><span class="line">zp1</span><br></pre></td></tr></tbody></table>

### 找到测试数据并且直接 rm 删除

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph osd map rbd zp1</span></span><br><span class="line">osdmap e90 pool <span class="string">'rbd'</span> (<span class="number">3</span>) object <span class="string">'zp1'</span> -&gt; pg <span class="number">3.43</span>eb7bdb (<span class="number">3.1</span>b) -&gt; up ([<span class="number">0</span>], p0) acting ([<span class="number">0</span>], p0)</span><br><span class="line">[root@lab8106 ~]<span class="comment"># ll /var/lib/ceph/osd/ceph-0/current/3.1b_head/DIR_B/DIR_D/zp1__head_43EB7BDB__3 </span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph <span class="number">9</span> Apr <span class="number">19</span> <span class="number">14</span>:<span class="number">46</span> /var/lib/ceph/osd/ceph-<span class="number">0</span>/current/<span class="number">3.1</span>b_head/DIR_B/DIR_D/zp1__head_43EB7BDB__3</span><br><span class="line">[root@lab8106 ~]<span class="comment"># rm -rf /var/lib/ceph/osd/ceph-0/current/3.1b_head/DIR_B/DIR_D/zp1__head_43EB7BDB__3</span></span><br></pre></td></tr></tbody></table>

### 尝试查询数据，get数据

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 tmp]<span class="comment"># rados  -p rbd ls</span></span><br><span class="line">[root@lab8106 tmp]<span class="comment"># rados  -p rbd get zp1 zp1</span></span><br><span class="line">[root@lab8106 tmp]<span class="comment"># cat zp1</span></span><br><span class="line">sdasdasd</span><br></pre></td></tr></tbody></table>

可以看到数据确实可以查询不到，但是能get下来，并且数据是完整的

### 验证我的猜测

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 tmp]<span class="comment"># lsof |grep zp1</span></span><br><span class="line">ms_pipe_w  <span class="number">4737</span>  <span class="number">5620</span>           ceph   <span class="number">86</span>u      REG               <span class="number">8</span>,<span class="number">33</span>          <span class="number">9</span>  <span class="number">201496748</span> /var/lib/ceph/osd/ceph-<span class="number">0</span>/current/<span class="number">3.1</span>b_head/DIR_B/DIR_D/zp1__head_43EB7BDB__3 (deleted)</span><br><span class="line">···</span><br></pre></td></tr></tbody></table>

可以看到这个标记为delete的对象就是我们删除的zp1，这个输出的意思是，进程4737上面删除了一个文件，文件描述符为86的

我们直接去拷贝下这个数据看下  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 tmp]<span class="comment"># cp  /proc/4737/fd/86 /tmp/zp_save</span></span><br><span class="line">[root@lab8106 tmp]<span class="comment"># cat /tmp/zp_save </span></span><br><span class="line">sdasdasd</span><br></pre></td></tr></tbody></table>

可以看到这个数据确实是存在的，还没有释放，所有可以get的到

我们试下重启下这个进程，看下delete的文件是不是会释放  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 tmp]<span class="comment"># systemctl restart ceph-osd@0</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 tmp]<span class="comment"># lsof |grep zp1</span></span><br></pre></td></tr></tbody></table>

可以看到已经没有这个delete了，现在我们尝试下get  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 tmp]<span class="comment"># rados  -p rbd get zp1 zp1</span></span><br><span class="line">error getting rbd/zp1: (<span class="number">2</span>) No such file or directory</span><br></pre></td></tr></tbody></table>

可以看到文件释放掉了，问题确实跟我猜测的是一致的，当然这并不是什么问题

## 总结

本篇是对删除了的对象还能get的现象进行了解释

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-04-19 |

Source: zphj1987@gmail ([为什么删除的Ceph对象还能get](http://www.zphj1987.com/2017/04/19/why-rm-object-can-get/))
