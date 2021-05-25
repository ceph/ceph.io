---
title: "定位一个网络问题引起的ceph异常"
date: "2018-01-16"
author: "admin"
tags: 
  - "planet"
---

  
![network](images/ne.png)  

## 前言

有一个ceph环境出现了异常，状态就是恢复异常的慢，但是所有数据又都在走，只是非常的慢，本篇将记录探测出问题的过程，以便以后处理类似的问题有个思路  

## 处理过程

问题的现象是恢复的很慢，但是除此以外并没有其它的异常，通过iostat监控磁盘，也没有出现异常的100%的情况，暂时排除了是osd底层慢的问题

### 检测整体写入的速度

通过rados bench写入  

<table><tbody><tr><td class="code"><pre><span class="line">rados -p rbd bench <span class="number">5</span> write</span><br></pre></td></tr></tbody></table>

刚开始写入的时候没问题，但是写入了以后不久就会出现一只是0的情况，可以判断在写入某些对象的时候出现了异常

本地生成一些文件  

<table><tbody><tr><td class="code"><pre><span class="line">seq <span class="number">0</span> <span class="number">30</span>|xargs -i dd <span class="keyword">if</span>=/dev/zero of=benchmarkzp{} bs=<span class="number">4</span>M count=<span class="number">2</span></span><br></pre></td></tr></tbody></table>

通过rados put 命令把对象put进去  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="keyword">for</span> a <span class="keyword">in</span> `ls ./`;<span class="keyword">do</span> time rados -p rbd put <span class="variable">$a</span> <span class="variable">$a</span>;<span class="built_in">echo</span> <span class="variable">$a</span>;ceph osd map rbd <span class="variable">$a</span>;<span class="keyword">done</span></span><br></pre></td></tr></tbody></table>

得到的结果里面会有部分是好的，部分是非常长的时间，对结果进行过滤，分为bad 和good

开始怀疑会不会是固定的盘符出了问题，首先把磁盘组合分出来，完全没问题的磁盘全部排除，结果最后都排除完了，所以磁盘本省是没问题的

### 根据pg的osd组合进行主机分类

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">1</span>  <span class="number">2</span>  <span class="number">4</span>  ok</span><br><span class="line"><span class="number">3</span>  <span class="number">1</span>   <span class="number">2</span>  bad</span><br><span class="line"><span class="number">2</span>  <span class="number">4</span>   <span class="number">1</span> ok</span><br><span class="line"><span class="number">3</span>  <span class="number">1</span> <span class="number">2</span>   bad</span><br><span class="line"><span class="number">3</span>  <span class="number">4</span>  <span class="number">2</span>  bad</span><br><span class="line">……</span><br></pre></td></tr></tbody></table>

上面的编号是写入对象所在的pg对应的osd所在的主机，严格按照顺序写入，第一个主机为发送数据方，第二个和第三个为接收数据方，并且使用了cluster network

通过上面的结果发现了从3往2进行发送副本数据的时候出现了问题，然后去主机上排查网络

在主机2上面做iperf -s  
在主机3上面做iperf -c host2然后就发现了网络异常了

最终还是定位在了网络上面

已经在好几个环境上面发现没装可以监控实时网络流量dstat工具或者ifstat的动态监控，做操作的时候监控下网络，可以发现一些异常

## 总结

这个环境在最开始的时候就怀疑是网络可能有问题，但是没有去进行全部服务器的网络的检测，这个在出现一些奇奇怪怪的异常的时候，还是可能出现在网络上面，特别是这种坏掉又不是完全坏掉，只是掉速的情况，通过集群的一些内部告警还没法完全体现出来，而主机很多的时候，又没有多少人愿意一个个的去检测，就容易出现这种疏漏了

在做一个ceph的管理平台的时候，对整个集群做全员对等网络带宽测试还是很有必要的，如果有一天我来设计管理平台，一定会加入这个功能进去

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-01-16 |

Source: zphj1987@gmail ([定位一个网络问题引起的ceph异常](http://www.zphj1987.com/2018/01/16/catch-a-problem-with-network-in-ceph/))
