---
title: "CentOS GRUB损坏修复方法"
date: "2017-11-30"
author: "admin"
tags: 
  - "planet"
---

  
![grub](images/grub.jpg)  

## 前言

博客很久没有更新了，一个原因就是原来存放部署博客的环境坏了，硬盘使用的是SSD，只要读取到某个文件，整个磁盘就直接识别不到了，还好博客环境之前有做备份，最近一直没有把部署环境做下恢复，今天抽空把环境做下恢复并且记录一篇基础的GRUB的处理文档

这两天正好碰到GRUB损坏的事，很久前处理过，但是没留下文档，正好现在把流程梳理一下，来解决grub.cfg损坏的情况,或者无法启动的情况  

## 实践步骤

安装操作系统的时候会有多种可能分区的方法，一个直接的分区，一个是用了lvm,本篇将几种分区的情况分别写出来

### lvm分区的情况

<table><tbody><tr><td class="code"><pre><span class="line">[root@localhost ~]<span class="comment"># df -h</span></span><br><span class="line">Filesystem               Size  Used Avail Use% Mounted on</span><br><span class="line">/dev/mapper/centos-root   <span class="number">17</span>G  <span class="number">927</span>M   <span class="number">17</span>G   <span class="number">6</span>% /</span><br><span class="line">devtmpfs                 <span class="number">901</span>M     <span class="number">0</span>  <span class="number">901</span>M   <span class="number">0</span>% /dev</span><br><span class="line">tmpfs                    <span class="number">912</span>M     <span class="number">0</span>  <span class="number">912</span>M   <span class="number">0</span>% /dev/shm</span><br><span class="line">tmpfs                    <span class="number">912</span>M  <span class="number">8.6</span>M  <span class="number">904</span>M   <span class="number">1</span>% /run</span><br><span class="line">tmpfs                    <span class="number">912</span>M     <span class="number">0</span>  <span class="number">912</span>M   <span class="number">0</span>% /sys/fs/cgroup</span><br><span class="line">/dev/sda1               <span class="number">1014</span>M  <span class="number">143</span>M  <span class="number">872</span>M  <span class="number">15</span>% /boot</span><br><span class="line">tmpfs                    <span class="number">183</span>M     <span class="number">0</span>  <span class="number">183</span>M   <span class="number">0</span>% /run/user/<span class="number">0</span></span><br></pre></td></tr></tbody></table>

模拟/boot/grub2/grub.cfg的破坏

<table><tbody><tr><td class="code"><pre><span class="line">[root@localhost ~]<span class="comment"># mv /boot/grub2/grub.cfg /boot/grub2/grub.cfgbk</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@localhost ~]<span class="comment"># reboot</span></span><br></pre></td></tr></tbody></table>

重启后就会出现这个

![image.png-13.4kB](images/image.png)

使用ls查询当前的分区情况

![image.png-7.7kB](images/image.png)  
查询分区情况  
![image.png-29.1kB](images/image.png)

可以看到(hd0,msdos1)可以列出/boot里面的内容，可以确定这个就是启动分区

设置root  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; <span class="built_in">set</span> root=(hd0,msdos1)</span><br></pre></td></tr></tbody></table>

命令后面的路径可以用tab键补全,/dev/mapper/centos-root为根分区，因为当前的分区模式是lvm的  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; linux16 /vmlinuz-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64 root=/dev/mapper/centos-root</span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; initrd16 /initramfs-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64.img</span><br></pre></td></tr></tbody></table>

启动  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; boot</span><br></pre></td></tr></tbody></table>

进入系统后重新生成grub.cfg  

<table><tbody><tr><td class="code"><pre><span class="line">grub2-mkconfig -o /boot/grub2/grub.cfg</span><br></pre></td></tr></tbody></table>

然后重启下系统验证是否好了

### 一个完整的/分区的形式的

这种情况，整个安装的系统就一个分区，boot是作为/分区的一个子目录的情况  
ls 查询分区  
![image.png-4.6kB](images/image.png)

设置根分区  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; <span class="built_in">set</span> root=(hd0,msdos3)</span><br></pre></td></tr></tbody></table>

可以看到上面是msdos3分区对应的就是root=/dev/sda3,下面就设置这个root

设置linux16  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; linux16 /root/vmlinuz-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64 root=/dev/sda3</span><br></pre></td></tr></tbody></table>

设置initrd16  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; initrd16 /root/initramfs-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64.img</span><br></pre></td></tr></tbody></table>

启动  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; boot</span><br></pre></td></tr></tbody></table>

进入系统后重新生成grub.cfg  

<table><tbody><tr><td class="code"><pre><span class="line">grub2-mkconfig -o /boot/grub2/grub.cfg</span><br></pre></td></tr></tbody></table>

然后重启下系统验证是否好了

### /分区和/boot分区独立分区的情况

![image.png-16.3kB](images/image.png)

设置根分区  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; <span class="built_in">set</span> root=(hd0,msdos1)</span><br></pre></td></tr></tbody></table>

根据/分区为msdos2可以知道root分区为/dev/sda2  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; linux16 /vmlinuz-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64 root=/dev/sda2</span><br></pre></td></tr></tbody></table>

设置initrd16  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; initrd16 /initramfs-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64.img</span><br></pre></td></tr></tbody></table>

启动  

<table><tbody><tr><td class="code"><pre><span class="line">grub&gt; boot</span><br></pre></td></tr></tbody></table>

进入系统后重新生成grub.cfg  

<table><tbody><tr><td class="code"><pre><span class="line">grub2-mkconfig -o /boot/grub2/grub.cfg</span><br></pre></td></tr></tbody></table>

然后重启下系统验证是否好了

## 总结

主要的处理流程如下：

- 首先通过`ls`得到分区的情况
- 通过`set`设置/boot所在的分区为root
- 分别设置linux16，initrd16并且指定root分区为/分区所在的目录
- 重启后重新生成grub即可

本篇作为一个总结以备不时之需

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-11-30 |

Source: zphj1987@gmail ([CentOS GRUB损坏修复方法](http://www.zphj1987.com/2017/11/30/recovery-from-grub-damage/))
