---
title: "Kernel RBD的QOS配置方案"
date: "2018-01-05"
author: "admin"
tags: 
  - "planet"
---

  
![io](images/io.png)  

## 前言

关于qos的讨论有很多，ceph内部也正在实现着一整套的基于dmclock的qos的方案，这个不是本篇的内容，之前在社区的邮件列表看过有研发在聊qos的相关的实现的，当时一个研发就提出了在使用kernel rbd的时候，可以直接使用linux的操作系统qos来实现，也就是cgroup来控制读取写入

cgroup之前也有接触过，主要测试了限制cpu和内存相关的，没有做io相关的测试，这个当然可以通过ceph内部来实现qos，但是有现成的解决方案的时候，可以减少很多开发周期，以及测试的成本

本篇将介绍的是kernel rbd的qos方案  

## 时间过长

首先介绍下几个测试qos相关的命令，用来比较设置前后的效果  
验证写入IOPS命令  

<table><tbody><tr><td class="code"><pre><span class="line">fio -filename=/dev/rbd0 -direct=<span class="number">1</span> -iodepth <span class="number">1</span> -thread -rw=write -ioengine=libaio -bs=<span class="number">4</span>K -size=<span class="number">1</span>G -numjobs=<span class="number">1</span> -runtime=<span class="number">60</span> -group_reporting -name=mytest</span><br></pre></td></tr></tbody></table>

验证写入带宽的命令  

<table><tbody><tr><td class="code"><pre><span class="line">fio -filename=/dev/rbd0 -direct=<span class="number">1</span> -iodepth <span class="number">1</span> -thread -rw=write -ioengine=libaio -bs=<span class="number">4</span>M -size=<span class="number">1</span>G -numjobs=<span class="number">1</span> -runtime=<span class="number">60</span> -group_reporting -name=mytest</span><br></pre></td></tr></tbody></table>

验证读取IOPS命令  

<table><tbody><tr><td class="code"><pre><span class="line">fio -filename=/dev/rbd0 -direct=<span class="number">1</span> -iodepth <span class="number">1</span> -thread -rw=<span class="built_in">read</span> -ioengine=libaio -bs=<span class="number">4</span>K -size=<span class="number">1</span>G -numjobs=<span class="number">1</span> -runtime=<span class="number">60</span> -group_reporting -name=mytest</span><br></pre></td></tr></tbody></table>

验证读取带宽命令  

<table><tbody><tr><td class="code"><pre><span class="line">fio -filename=/dev/rbd0 -direct=<span class="number">1</span> -iodepth <span class="number">1</span> -thread -rw=<span class="built_in">read</span> -ioengine=libaio -bs=<span class="number">4</span>M -size=<span class="number">1</span>G -numjobs=<span class="number">1</span> -runtime=<span class="number">60</span> -group_reporting -name=mytest</span><br></pre></td></tr></tbody></table>

上面为什么会设置不同的块大小，这个是因为测试的存储是会受到带宽和iops的共同制约的，当测试小io的时候，这个时候的峰值是受到iops的限制的，测试大io的时候，受到的是带宽限制，所以在做测试的时候，需要测试iops是否被限制住的时候就使用小的bs=4K，需要测试大的带宽的限制的时候就采用bs=4M来测试

测试的时候都是，开始不用做qos来进行测试得到一个当前不配置qos的性能数值，然后根据需要进行qos设置后通过上面的fio去测试是否能限制住

启用cgroup的blkio模块  

<table><tbody><tr><td class="code"><pre><span class="line">mkdir -p  /cgroup/blkio/</span><br><span class="line">mount -t cgroup -o blkio blkio /cgroup/blkio/</span><br></pre></td></tr></tbody></table>

获取rbd磁盘的major/minor numbers  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab211 ~]<span class="comment"># lsblk </span></span><br><span class="line">NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT</span><br><span class="line">rbd0   <span class="number">252</span>:<span class="number">0</span>    <span class="number">0</span>  <span class="number">19.5</span>G  <span class="number">0</span> disk </span><br><span class="line">sda      <span class="number">8</span>:<span class="number">0</span>    <span class="number">1</span> <span class="number">238.4</span>G  <span class="number">0</span> disk </span><br><span class="line">├─sda4   <span class="number">8</span>:<span class="number">4</span>    <span class="number">1</span>     <span class="number">1</span>K  <span class="number">0</span> part </span><br><span class="line">├─sda2   <span class="number">8</span>:<span class="number">2</span>    <span class="number">1</span>  <span class="number">99.9</span>G  <span class="number">0</span> part </span><br><span class="line">├─sda5   <span class="number">8</span>:<span class="number">5</span>    <span class="number">1</span>     <span class="number">8</span>G  <span class="number">0</span> part [SWAP]</span><br><span class="line">├─sda3   <span class="number">8</span>:<span class="number">3</span>    <span class="number">1</span>     <span class="number">1</span>G  <span class="number">0</span> part /boot</span><br><span class="line">├─sda1   <span class="number">8</span>:<span class="number">1</span>    <span class="number">1</span>   <span class="number">100</span>M  <span class="number">0</span> part </span><br><span class="line">└─sda6   <span class="number">8</span>:<span class="number">6</span>    <span class="number">1</span> <span class="number">129.4</span>G  <span class="number">0</span> part /</span><br></pre></td></tr></tbody></table>

通过lsblk命令可以获取到磁盘对应的major number和minor number,这里可以看到rbd0对应的编号为252:0

设置rbd0的iops的qos为10  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">echo</span> <span class="string">"252:0 10"</span> &gt; /cgroup/blkio/blkio.throttle.write_iops_device</span><br></pre></td></tr></tbody></table>

如果想清理这个规则,把后面的数值设置为0就清理了，后面几个配置也是相同的方法  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">echo</span> <span class="string">"252:0 0"</span> &gt; /cgroup/blkio/blkio.throttle.write_iops_device</span><br></pre></td></tr></tbody></table>

限制写入的带宽为10MB/s  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">echo</span> <span class="string">"252:0 10485760"</span> &gt; /cgroup/blkio/blkio.throttle.write_bps_device</span><br></pre></td></tr></tbody></table>

限制读取的qos为10  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">echo</span> <span class="string">"252:0 10"</span> &gt; /cgroup/blkio/blkio.throttle.read_iops_device</span><br></pre></td></tr></tbody></table>

限制读取的带宽为10MB/s  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">echo</span> <span class="string">"252:0 10485760"</span> &gt; /cgroup/blkio/blkio.throttle.read_bps_device</span><br></pre></td></tr></tbody></table>

以上简单的设置就完成了kernel rbd的qos设置了，我测试了下，确实是生效了的

## 总结

这个知识点很久前就看到了，一直没总结，现在记录下，个人观点是能快速，有效，稳定的实现功能是最好的，所以使用这个在kernel rbd方式下可以不用再进行qos的开发了

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-01-05 |

Source: zphj1987@gmail ([Kernel RBD的QOS配置方案](http://www.zphj1987.com/2018/01/05/Kernel-RBD-QOS/))
