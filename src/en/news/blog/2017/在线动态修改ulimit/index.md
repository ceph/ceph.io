---
title: "在线动态修改ulimit"
date: "2017-03-06"
author: "admin"
tags: 
  - "planet"
---

  
![limit](images/limit.jpg)  

## 前言

系统中有些地方会进行资源的限制，其中的一个就是open file的限制，操作系统默认限制的是1024,这个值可以通过各种方式修改，本篇主要讲的是如何在线修改，生产上是不可能随便重启进程的  

## 实践

### 查看系统默认的限制

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ulimit -a|grep open</span></span><br><span class="line">open files                      (-n) <span class="number">1024</span></span><br></pre></td></tr></tbody></table>

默认的打开文件是1024  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ps -ef|grep ceph-osd</span></span><br><span class="line">ceph     <span class="number">28176</span>     <span class="number">1</span>  <span class="number">0</span> <span class="number">18</span>:<span class="number">08</span> ?        <span class="number">00</span>:<span class="number">00</span>:<span class="number">00</span> /usr/bin/ceph-osd <span class="operator">-f</span> --cluster ceph --id <span class="number">0</span> --setuser ceph --setgroup ceph</span><br><span class="line">root     <span class="number">28619</span> <span class="number">26901</span>  <span class="number">0</span> <span class="number">18</span>:<span class="number">10</span> pts/<span class="number">3</span>    <span class="number">00</span>:<span class="number">00</span>:<span class="number">00</span> grep --color=auto ceph-osd</span><br><span class="line">[root@lab8106 ~]<span class="comment"># cat /proc/28176/limits |grep open</span></span><br><span class="line">Max open files            <span class="number">1048576</span>              <span class="number">1048576</span>              files</span><br></pre></td></tr></tbody></table>

ceph osd的进程的这个参数是1048576

### 通过配置文件修改

这个参数控制是放在：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># cat  /usr/lib/systemd/system/ceph-osd@.service |grep LimitNOFILE -B 1</span></span><br><span class="line">[Service]</span><br><span class="line">LimitNOFILE=<span class="number">1048576</span></span><br></pre></td></tr></tbody></table>

这个地方设置的，如果我们有需要修改，那么可以修改这里，这不是本篇的重点，对于运行中的进程如何修改呢

### 在线修改进程的limit

这里调用的是prlimit进行的在线修改  
查询指定进程的限制  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># prlimit --pid 28176</span></span><br><span class="line">RESOURCE   DESCRIPTION                             SOFT      HARD UNITS</span><br><span class="line">AS         address space <span class="built_in">limit</span>                unlimited unlimited bytes</span><br><span class="line">CORE       max core file size                         <span class="number">0</span> unlimited blocks</span><br><span class="line">CPU        CPU time                           unlimited unlimited seconds</span><br><span class="line">DATA       max data size                      unlimited unlimited bytes</span><br><span class="line">FSIZE      max file size                      unlimited unlimited blocks</span><br><span class="line">LOCKS      max number of file locks held      unlimited unlimited </span><br><span class="line">MEMLOCK    max locked-in-memory address space     <span class="number">65536</span>     <span class="number">65536</span> bytes</span><br><span class="line">MSGQUEUE   max bytes <span class="keyword">in</span> POSIX mqueues            <span class="number">819200</span>    <span class="number">819200</span> bytes</span><br><span class="line">NICE       max nice prio allowed to raise             <span class="number">0</span>         <span class="number">0</span> </span><br><span class="line">NOFILE     max number of open files             <span class="number">1048576</span>   <span class="number">1048576</span> </span><br><span class="line">NPROC      max number of processes              <span class="number">1048576</span>   <span class="number">1048576</span> </span><br><span class="line">RSS        max resident <span class="built_in">set</span> size              unlimited unlimited pages</span><br><span class="line">RTPRIO     max real-time priority                     <span class="number">0</span>         <span class="number">0</span> </span><br><span class="line">RTTIME     timeout <span class="keyword">for</span> real-time tasks        unlimited unlimited microsecs</span><br><span class="line">SIGPENDING max number of pending signals         <span class="number">192853</span>    <span class="number">192853</span> </span><br><span class="line">STACK      max stack size                       <span class="number">8388608</span> unlimited bytes</span><br></pre></td></tr></tbody></table>

修改指定运行进程的限制  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># prlimit --pid 28176 --nofile=104857</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># prlimit --pid 28176 |grep NOFILE</span></span><br><span class="line">NOFILE     max number of open files              <span class="number">104857</span>    <span class="number">104857</span></span><br></pre></td></tr></tbody></table>

可以看到修改成功了

## 总结

一般来说ulimit这个限制都是在终端上修改对下次生效，本篇用来记录如何在线修改，如果碰到了，可以这样处理

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-03-06 |

Source: zphj1987@gmail ([在线动态修改ulimit](http://www.zphj1987.com/2017/03/06/online-change-ulimit/))
