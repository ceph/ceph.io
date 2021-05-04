---
title: "怎样禁止Ceph OSD的自动挂载"
date: "2017-09-06"
author: "admin"
tags: 
  - "planet"
---

  
![此处输入图片的描述](images/mount.png)  

## 前言

本篇来源于群里一个人的问题，有没有办法让ceph的磁盘不自动挂载，一般人的问题都是怎样让ceph能够自动挂载，在centos 7 平台下 ceph jewel版本以后都是有自动挂载的处理的，这个我之前也写过两篇文章 [ceph在centos7下一个不容易发现的改变](http://www.zphj1987.com/2016/03/31/ceph%E5%9C%A8centos7%E4%B8%8B%E4%B8%80%E4%B8%AA%E4%B8%8D%E5%AE%B9%E6%98%93%E5%8F%91%E7%8E%B0%E7%9A%84%E6%94%B9%E5%8F%98/)和[Ceph数据盘怎样实现自动挂载](http://www.zphj1987.com/2016/12/22/Ceph%E6%95%B0%E6%8D%AE%E7%9B%98%E6%80%8E%E6%A0%B7%E5%AE%9E%E7%8E%B0%E8%87%AA%E5%8A%A8%E6%8C%82%E8%BD%BD/)，来讲述这个自动挂载的  
  
这里讲下流程：

> 开机后udev匹配95-ceph-osd.rules规则，触发ceph-disk trigger，遍历磁盘，匹配到磁盘的标记后就触发了自动挂载

为什么要取消挂载？  
也许一般都会想：不就是停掉osd，然后umount掉，检查磁盘吗  
这个想法如果放在一般情况下都没有问题，但是为什么有这个需求就是有不一般的情况，这个我在很久前遇到过，所以对这个需求的场景比较清楚

在很久以前碰到过一次，机器启动都是正常的，但是只要某个磁盘一挂载，机器就直接挂掉了，所以这个是不能让它重启机器自动挂载的，也许还有其他的情况，这里总结成一个简单的需求就是不想它自动挂载

## 解决方法

从上面的自启动后的自动挂载流程里面，我们可以知道这里可以有两个方案去解决这个问题，第一种是改变磁盘的标记，第二种就是改变udev的rule的规则匹配，这里两个方法都行，一个是完全不动磁盘，一个是动了磁盘的标记

### 修改udev规则的方式

这个因为曾经有一段时间看过udev相关的一些东西，所以处理起来还是比较简单的，这里顺便把调试过程也记录下来  
/lib/udev/rules.d/95-ceph-osd.rules这个文件里面就是集群自动挂载的触发规则，所以在这里我们在最开始匹配上我们需要屏蔽的盘，然后绕过内部的所有匹配规则，具体办法就是  
在这个文件里面第一行加上

> KERNEL==”sdb1|sdb2”, GOTO=”not\_auto\_mount”

在最后一行加上

> LABEL=”not\_auto\_mount”

验证规则是否正确  

<table><tbody><tr><td class="code"><pre><span class="line">udevadm <span class="built_in">test</span> /sys/block/sdb/sdb1</span><br></pre></td></tr></tbody></table>

我们先看下正常的可以挂载的盘符的触发测试显示  
![image.png-17.2kB](images/image.png)  
再看下屏蔽了后的规则是怎样的  
![image.png-16kB](images/image.png)  
可以看到在加入屏蔽条件以后，就没有触发挂载了，这里要注意，做屏蔽规则的时候需要把这个osd相关的盘都屏蔽，不然在触发相关分区的时候可能顺带挂载起来了，上面的sdb1就是数据盘，sdb2就是bluestore的block盘

测试没问题后就执行下  

<table><tbody><tr><td class="code"><pre><span class="line">udevadm control --reload-rules</span><br></pre></td></tr></tbody></table>

重启后验证是否自动挂载了

### 修改磁盘标记的方式

查询磁盘的标记typecode,也就是ID\_PART\_ENTRY\_TYPE这个属性  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># blkid -o udev -p /dev/sdb1</span></span><br><span class="line">ID_FS_UUID=<span class="number">7</span>a852eec-b32d-<span class="number">4</span>c0a-<span class="number">8</span>b8e-<span class="number">1</span>e056a67ee35</span><br><span class="line">ID_FS_UUID_ENC=<span class="number">7</span>a852eec-b32d-<span class="number">4</span>c0a-<span class="number">8</span>b8e-<span class="number">1</span>e056a67ee35</span><br><span class="line">ID_FS_TYPE=xfs</span><br><span class="line">ID_FS_USAGE=filesystem</span><br><span class="line">ID_PART_ENTRY_SCHEME=gpt</span><br><span class="line">ID_PART_ENTRY_NAME=cephx20data</span><br><span class="line">ID_PART_ENTRY_UUID=<span class="number">7</span>b321ca3-<span class="number">402</span>c-<span class="number">4557</span>-b121-<span class="number">887266</span>a1e1b8</span><br><span class="line">ID_PART_ENTRY_TYPE=<span class="number">4</span>fbd7e29-<span class="number">9</span>d25-<span class="number">41</span>b8-afd0-<span class="number">062</span>c0ceff05d</span><br><span class="line">ID_PART_ENTRY_NUMBER=<span class="number">1</span></span><br><span class="line">ID_PART_ENTRY_OFFSET=<span class="number">2048</span></span><br><span class="line">ID_PART_ENTRY_SIZE=<span class="number">204800</span></span><br><span class="line">ID_PART_ENTRY_DISK=<span class="number">8</span>:<span class="number">16</span></span><br></pre></td></tr></tbody></table>

匹配到这个属性就认为是集群的节点，可以挂载的，那么我们先改变这个  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># /usr/sbin/sgdisk --typecode=1:4fbd7e29-9d25-41b8-afd0-062c0ceff0f9 -- /dev/sdb</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># blkid -o udev -p /dev/sdb1</span></span><br><span class="line">ID_FS_UUID=<span class="number">7</span>a852eec-b32d-<span class="number">4</span>c0a-<span class="number">8</span>b8e-<span class="number">1</span>e056a67ee35</span><br><span class="line">ID_FS_UUID_ENC=<span class="number">7</span>a852eec-b32d-<span class="number">4</span>c0a-<span class="number">8</span>b8e-<span class="number">1</span>e056a67ee35</span><br><span class="line">ID_FS_TYPE=xfs</span><br><span class="line">ID_FS_USAGE=filesystem</span><br><span class="line">ID_PART_ENTRY_SCHEME=gpt</span><br><span class="line">ID_PART_ENTRY_NAME=cephx20data</span><br><span class="line">ID_PART_ENTRY_UUID=<span class="number">7</span>b321ca3-<span class="number">402</span>c-<span class="number">4557</span>-b121-<span class="number">887266</span>a1e1b8</span><br><span class="line">ID_PART_ENTRY_TYPE=<span class="number">4</span>fbd7e29-<span class="number">9</span>d25-<span class="number">41</span>b8-afd0-<span class="number">062</span>c0ceff0f9</span><br><span class="line">ID_PART_ENTRY_NUMBER=<span class="number">1</span></span><br><span class="line">ID_PART_ENTRY_OFFSET=<span class="number">2048</span></span><br><span class="line">ID_PART_ENTRY_SIZE=<span class="number">204800</span></span><br><span class="line">ID_PART_ENTRY_DISK=<span class="number">8</span>:<span class="number">16</span></span><br></pre></td></tr></tbody></table>

可以看到type的属性已经被修改了  
再次测试，可以看到已经不匹配了  
![image.png-14.1kB](images/image.png)

如果需要恢复就执行  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># /usr/sbin/sgdisk --typecode=1:4fbd7e29-9d25-41b8-afd0-062c0ceff05d -- /dev/sdb</span></span><br></pre></td></tr></tbody></table>

这里同样需要改掉相关的block盘的标记，否则一样被关联的挂载起来了

## 总结

本篇用两种方法来实现了ceph osd的盘符的不自动挂载，这个一般情况下都不会用到，比较特殊的情况遇到了再这么处理就可以了，或者比较暴力的方法就是直接把挂载的匹配的规则全部取消掉，使用手动触发挂载的方式也行，这个方法很多，能够快速，简单的满足需求即可

此mount非彼mount，题图无关

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-09-07 |

Source: zphj1987@gmail ([怎样禁止Ceph OSD的自动挂载](http://www.zphj1987.com/2017/09/07/how-to-disable-Ceph-OSD-automount/))
