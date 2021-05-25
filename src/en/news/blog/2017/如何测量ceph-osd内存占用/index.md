---
title: "如何测量Ceph OSD内存占用"
date: "2017-08-10"
author: "admin"
tags: 
  - "planet"
---

  
![](images/newmemory.png)  

## 前言

这个工具我第一次看到是在填坑群里面看到，是由研发-北京-蓝星同学分享的，看到比较有趣，就写一篇相关的记录下用法

火焰图里面也可以定位内存方面的问题，那个是通过一段时间的统计，以一个汇总的方式来查看内存在哪个地方可能出了问题  
  
本篇是另外一个工具，这个工具的好处是有很清晰的图表操作，以及基于时间线的统计，下面来看下这个工具怎么使用的

本篇对具体的内存函数的调用占用不会做更具体的分析，这里是提供一个工具的使用方法供感兴趣的研发同学来使用

## 环境准备

目前大多数的ceph运行在centos7系列上面，笔者的环境也是在centos7上面，所以以这个举例，其他平台同样可以

需要用到的工具

- valgrind
- massif-visualizer

安装valgrind  

<table><tbody><tr><td class="code"><pre><span class="line">yum install valgrind</span><br></pre></td></tr></tbody></table>

massif-visualizer是数据可视化的工具，由于并没有centos的发行版本，但是有fedora的版本，从网上看到资料说这个可以直接安装忽略掉需要的依赖即可，我自己跑了下，确实可行

下载massif-visualizer  

<table><tbody><tr><td class="code"><pre><span class="line">wget ftp://ftp.pbone.net/mirror/download.fedora.redhat.com/pub/fedora/linux/releases/<span class="number">23</span>/Everything/x86_64/os/Packages/m/massif-visualizer-<span class="number">0.4</span>.<span class="number">0</span>-<span class="number">6</span>.fc23.x86_64.rpm</span><br></pre></td></tr></tbody></table>

安装massif-visualizer  

<table><tbody><tr><td class="code"><pre><span class="line">rpm -ivh massif-visualizer-<span class="number">0.4</span>.<span class="number">0</span>-<span class="number">6</span>.fc23.x86_64.rpm  --nodeps</span><br></pre></td></tr></tbody></table>

不要漏了后面的nodeps

## 抓取ceph osd运行时内存数据

停掉需要监控的osd（例如我的是osd.4）  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># systemctl stop ceph-osd@4</span></span><br></pre></td></tr></tbody></table>

开始运行监控  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># valgrind --tool=massif /usr/bin/ceph-osd -f --cluster ceph --id 4 --setuser ceph --setgroup ceph</span></span><br><span class="line">==<span class="number">21522</span>== Massif, a heap profiler</span><br><span class="line">==<span class="number">21522</span>== Copyright (C) <span class="number">2003</span>-<span class="number">2015</span>, and GNU GPL<span class="string">'d, by Nicholas Nethercote</span><br><span class="line">==21522== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info</span><br><span class="line">==21522== Command: /usr/bin/ceph-osd -f --cluster ceph --id 4 --setuser ceph --setgroup ceph</span><br><span class="line">==21522== </span><br><span class="line">==21522== </span><br><span class="line">starting osd.4 at :/0 osd_data /var/lib/ceph/osd/ceph-4 /var/lib/ceph/osd/ceph-4/journal</span><br><span class="line">2017-08-10 16:36:42.395682 a14d680 -1 osd.4 522 log_to_monitors {default=true}</span></span><br></pre></td></tr></tbody></table>

监控已经开始了,在top下可以看到有这个进程运行，占用cpu还是比较高的，可能是要抓取很多数据的原因  
![valtop](images/image.png)

等待一段时间后，就可以把之前运行的命令ctrl+C掉

在当前目录下面就会生成一个【massif.out.进程号】的文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ll massif.out.21522 </span></span><br><span class="line">-rw------- <span class="number">1</span> root root <span class="number">142682</span> Aug <span class="number">10</span> <span class="number">16</span>:<span class="number">39</span> massif.out.<span class="number">21522</span></span><br></pre></td></tr></tbody></table>

## 查看截取的数据

### 命令行下的查看

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ms_print massif.out.21522 |less</span></span><br></pre></td></tr></tbody></table>

这个方式是文本方式的查看，也比较方便，自带的文本分析工具，效果如下：  
![image.png-38kB](images/image.png)  
![image.png-94.6kB](images/image.png)

### 图形界面的查看

首先在windows上面运行好xmanager-Passive，这个走的x11转发的（也可以用另外一个工具MobaXterm）  
![image.png-4.4kB](images/image.png)  
运行好了后，直接在xshell命令行运行  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># massif-visualizer massif.out.21522 </span></span><br><span class="line">massif-visualizer(<span class="number">22494</span>)/kdeui (kdelibs): Attempt to use QAction <span class="string">"toggleDataTree"</span> with KXMLGUIFactory! </span><br><span class="line">massif-visualizer(<span class="number">22494</span>)/kdeui (kdelibs): Attempt to use QAction <span class="string">"toggleAllocators"</span> with KXMLGUIFactory! </span><br><span class="line">description: <span class="string">"(none)"</span> </span><br><span class="line"><span class="built_in">command</span>: <span class="string">"/usr/bin/ceph-osd -f --cluster ceph --id 4"</span> </span><br><span class="line">time unit: <span class="string">"i"</span> </span><br><span class="line">snapshots: <span class="number">56</span> </span><br><span class="line">peak: snapshot <span class="comment"># 52 after "2.3138e+09i" </span></span><br><span class="line">peak cost: <span class="string">"16.2 MiB"</span>  heap <span class="string">"749.0 KiB"</span>  heap extra <span class="string">"0 B"</span>  stacks</span><br></pre></td></tr></tbody></table>

然后在windows上面就会弹出下面的  
![osdmem.png-282kB](images/osdmem.png)  
就可以交互式的查看快照点的内存占用了，然后根据这个就可以进行内存分析了，剩下的工作就留给研发去做了

## 相关链接

[linux – 如何测量应用程序或进程的实际内存使用情况？](https://codeday.me/bug/20170415/1699.html)

## 总结

只有分析落地到数据层面，这样的分析才是比较精准的

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-08-10 |

Source: zphj1987@gmail ([如何测量Ceph OSD内存占用](http://www.zphj1987.com/2017/08/10/how-to-get-Ceph-OSD-mem-used/))
