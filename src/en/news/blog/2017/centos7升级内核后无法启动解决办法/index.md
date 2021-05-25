---
title: "Centos7升级内核后无法启动解决办法"
date: "2017-06-01"
author: "admin"
tags: 
  - "planet"
---

  
![kernel](http://7xweck.com1.z0.glb.clouddn.com/newkernel.png?imageMogr2/thumbnail/!75p)  

## 前言

这个问题存在有一段时间了，之前做的centos7的ISO，在进行内核的升级以后就存在这个问题：

- 系统盘在板载sata口上是可以正常启动新内核并且能识别面板硬盘
- 系统盘插在面板口上新内核无法启动，调试发现无法找到系统盘
- 系统盘插在面板上默认的3.10内核可以正常启动 暂时的解决办法就是让系统插在板载的sata口上，因为当时没找到具体的解决办法，在这个问题持续了一段时间后，最近再次搜索资料的时候，把问题定位在了initramfs内的驱动的问题，并且对问题进行了解决

## 解决过程

查询initramfs的驱动  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 lab103]<span class="comment"># lsinitrd -k 3.10.0-327.el7.x86_64|grep mpt[23]sas</span></span><br><span class="line">drwxr-xr-x   <span class="number">2</span> root     root            <span class="number">0</span> Apr <span class="number">17</span> <span class="number">12</span>:<span class="number">05</span> usr/lib/modules/<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">327</span>.el7.x86_64/kernel/drivers/scsi/mpt2sas</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root     root       <span class="number">337793</span> Nov <span class="number">20</span>  <span class="number">2015</span> usr/lib/modules/<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">327</span>.el7.x86_64/kernel/drivers/scsi/mpt2sas/mpt2sas.ko</span><br></pre></td></tr></tbody></table>

可以看到在3.10内核的时候是mpt2sas驱动

可以在4.x内核中看到  
新版的内核已经把mpt2sas升级为mpt3sas  

<table><tbody><tr><td class="code"><pre><span class="line">/lib/modules/<span class="number">4.4</span>.<span class="number">46</span>/kernel/drivers/scsi/mpt3sas/mpt3sas.ko</span><br></pre></td></tr></tbody></table>

查询initramfs内的模块  

<table><tbody><tr><td class="code"><pre><span class="line">lsinitrd -k  <span class="number">4.4</span>.<span class="number">46</span>|grep mpt[<span class="number">23</span>]sas</span><br></pre></td></tr></tbody></table>

可以看到并没有输出，说明initramfs并没有把这个驱动打进去

这个地方有两种方式来解决

### 方法一：

修改 /etc/dracut.conf文件，增加字段

> add\_drivers+=”mpt3sas”

重新生成initramfs  

<table><tbody><tr><td class="code"><pre><span class="line">dracut <span class="operator">-f</span> /boot/initramfs-<span class="number">4.4</span>.<span class="number">46</span>.img <span class="number">4.4</span>.<span class="number">46</span></span><br></pre></td></tr></tbody></table>

### 方法二：

强制加载驱动  

<table><tbody><tr><td class="code"><pre><span class="line">dracut --force --add-drivers mpt3sas --kver=<span class="number">4.4</span>.<span class="number">46</span></span><br></pre></td></tr></tbody></table>

以上方法二选一做下驱动的集成，然后做下面的检查  

<table><tbody><tr><td class="code"><pre><span class="line">lsinitrd -k  <span class="number">4.4</span>.<span class="number">46</span>|grep mpt[<span class="number">23</span>]sas</span><br></pre></td></tr></tbody></table>

如果有输出就是正常了的

然后重启操作系统即可

## 总结

目前出现这个问题的原因不清楚来自内核还是dracut生成的地方，如果遇到这个问题就按照上面的方法进行处理下即可解决，问题能找到解决办法后就会发现只是小问题，没找到的时候，完全不知道问题在哪里

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-06-01 |

Source: zphj1987@gmail ([Centos7升级内核后无法启动解决办法](http://www.zphj1987.com/2017/06/01/centos7-update-kernel-can-not-boot/))
