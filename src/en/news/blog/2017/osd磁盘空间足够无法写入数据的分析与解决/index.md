---
title: "osd磁盘空间足够无法写入数据的分析与解决"
date: "2017-09-04"
author: "admin"
tags: 
  - "planet"
---

  
![](images/full.png)  

## 前言

这个问题的来源是ceph社区里面一个群友的环境出现在85%左右的时候，启动osd报错，然后在本地文件系统当中进行touch文件的时候也是报错，df -i查询inode也是没用多少，使用的也是inode64挂载的，开始的时候排除了配置原因引起的，在ceph的邮件列表里面有一个相同[问题](http://lists.ceph.com/pipermail/ceph-users-ceph.com/2016-October/013929.html)，也是没有得到解决

看到这个问题比较感兴趣，就花了点时间来解决来定位和解决这个问题，现在分享出来，如果有类似的生产环境，可以提前做好检查预防工作

## 现象描述

ceph版本

> \[root@lab8107 mnt\]# ceph -v  
> ceph version 10.2.9 (2ee413f77150c0f375ff6f10edd6c8f9c7d060d0)  
> 我复现的环境为这个版本  
>   
> 查询使用空间

![image.png-19.8kB](images/image.png)  
可以看到空间才使用了54%  
![image.png-28kB](images/image.png)  
可以看到，inode剩余比例很多，而文件确实无法创建

这个时候把一个文件mv出来，然后又可以创建了，并且可以写入比mv出来的文件更大的文件，写完一个无法再写入更多文件了

这里有个初步判断，不是容量写完了，而是文件的个数限制住了

那么来查询下文件系统的inode还剩余多少，xfs文件系统的inode是动态分配的，我们先检查无法写入的文件系统的  

<table><tbody><tr><td class="code"><pre><span class="line">xfs_db -r -c <span class="string">"sb 0"</span> -c <span class="string">"p"</span> -c <span class="string">"freesp -s"</span> /dev/sdb1|grep ifree</span><br></pre></td></tr></tbody></table>

![image.png-5.1kB](images/image.png)  
可以看到剩余的inode确实为0，这里确实是没有剩余inode了，所以通过df -i来判断inode是否用完并不准确，那个是已经使用值与理论值的相除的结果

查询xfs碎片，也是比例很低

## 定位问题

首先查看xfs上面的数据结构  

<table><tbody><tr><td class="code"><pre><span class="line">xfs_db -r -c <span class="string">"sb 0"</span> -c <span class="string">"p"</span> -c <span class="string">"freesp -s "</span> /dev/sdb1</span><br></pre></td></tr></tbody></table>

![image.png-13.7kB](images/image.png)

上面的输出结果这里简单解释一下，这里我也是反复比对和查看资料才理解这里的意思，这里有篇[novell](https://www.novell.com/support/kb/doc.php?id=7014320)的资料有提到这个，这里我再拿一个刚刚格式化完的分区结果来看下  
![image.png-14.3kB](images/image.png)

这里用我自己的理解来描述下，这个extents的剩余数目是动态变化的，刚分完区的那个，有4个1048576-1220608左右的逻辑区间，而上面的无法写入数据的数据结构，剩下的extent的平均大小为22个block，而这样的blocks总数有1138886个，占总体的99.85，也就是剩余的空间的的extents所覆盖的区域全部是16个block到31个block的这种空洞，相当于蛋糕被切成很多小块了，大的都拿走了，剩下的总量还很多，但是都是很小的碎蛋糕，所以也没法取了

## 解决办法

下个段落会讲下为什么会出现上面的情况，现在先说解决办法，把文件mv出来，然后mv进去，这个是在其他场景下的一个解决方法，这个操作要小心，因为有扩展属性，操作不小心会弄掉了，这里建议用另外一个办法xfs\_dump的方法

我的环境比较小，20G的盘，如果盘大就准备大盘,这里是验证是否可行  

<table><tbody><tr><td class="code"><pre><span class="line">xfsdump -L osd0 -M osd0 <span class="operator">-f</span> /mnt/osd0 /var/lib/ceph/osd/ceph-<span class="number">0</span></span><br></pre></td></tr></tbody></table>

还原回去  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ceph-<span class="number">0</span>]<span class="comment"># xfsrestore -f /mnt/osd0 /var/lib/ceph/osd/ceph-0</span></span><br><span class="line">xfsrestore: using file dump (drive_simple) strategy</span><br><span class="line">xfsrestore: version <span class="number">3.1</span>.<span class="number">4</span> (dump format <span class="number">3.0</span>) - <span class="built_in">type</span> ^C <span class="keyword">for</span> status and control</span><br><span class="line">xfsrestore: ERROR: unable to create /var/lib/ceph/osd/ceph-<span class="number">0</span>/xfsrestorehousekeepingdir: No space left on device</span><br><span class="line">xfsrestore: Restore Status: ERROR</span><br></pre></td></tr></tbody></table>

直接还原还是会有问题,没有可以写的地方了，这里因为已经dump了一份，这里就mv pg的数据目录出去  

<table><tbody><tr><td class="code"><pre><span class="line">mv /var/lib/ceph/osd/ceph-<span class="number">0</span>/current/ /mnt</span><br></pre></td></tr></tbody></table>

开始还原  

<table><tbody><tr><td class="code"><pre><span class="line">xfsrestore  -o <span class="operator">-f</span> /mnt/osd0 /var/lib/ceph/osd/ceph-<span class="number">0</span></span><br></pre></td></tr></tbody></table>

还原以后如果有权限需要处理的就处理下权限，先检查下文件系统的数据结构  
![image.png-19.6kB](images/image.png)  
可以看到数据结构已经很理想了  
然后启动osd  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl restart ceph-osd@<span class="number">0</span></span><br></pre></td></tr></tbody></table>

然后检查下数据是不是都可以正常写进去了

- 如果出现了上面的空间已经满了的情况，处理的时候需要注意
- 备份好数据
- 单个盘进行处理
- 备份的数据先保留好以防万一
- 启动好了后，验证下集群的状态后再继续，可以尝试get下数据检查数据

## 为什么会出现这样

我们在本地文件系统里面连续写100个文件  
准备一个a文件里面有每行150个a字符，700行，这个文件大小就是100K  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 <span class="built_in">test</span>]<span class="comment"># seq 100|xargs -i dd if=a of=a{} bs=100K count=1</span></span><br></pre></td></tr></tbody></table>

检查文件的分布  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 <span class="built_in">test</span>]<span class="comment"># seq 100|xargs -i xfs_bmap -v a{} |less</span></span><br></pre></td></tr></tbody></table>

![image.png-47.1kB](images/image.png)

大部分情况下这个block的分配是连续的

先检查下当前的数据结构  
![image.png-30.8kB](images/image.png)

我们把刚刚的100个对象put到集群里面去，监控下集群的数据目录的写入情况  

<table><tbody><tr><td class="code"><pre><span class="line">inotifywait -m --timefmt <span class="string">'%Y %B %d %H:%M:%S'</span> --format <span class="string">'%T %w %e %f'</span> -r -m /var/lib/ceph/osd/ceph-<span class="number">0</span>/</span><br></pre></td></tr></tbody></table>

put数据进去  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="keyword">for</span> a <span class="keyword">in</span> `ls ./`;<span class="keyword">do</span> rados -p rbd put <span class="variable">$a</span> <span class="variable">$a</span>;<span class="keyword">done</span></span><br></pre></td></tr></tbody></table>

![image.png-53.7kB](images/image.png)  
![image.png-64.2kB](images/image.png)  
查看对象的数据，里面并没有连续起来，并且写入的数据的方式是:  
打开文件，设置扩展属性，填充内容，设置属性，关闭，很多并发在一起做

写完的数据结构  
![image.png-30.9kB](images/image.png)

结果就是在100K这个数据模型下，会产生很多小的block空隙，最后就是无法写完文件的情况，这里产生空隙并不是很大的问题，问题是这里剩下的空隙无法完成inode的动态分配的工作，这里跟一个格式化选项的变化有关

准备一个集群  
然后写入  

<table><tbody><tr><td class="code"><pre><span class="line">rados -p rbd bench -b <span class="number">100</span>K <span class="number">60</span> write --no-cleanup</span><br></pre></td></tr></tbody></table>

就可以必现这个问题，可以看到上面的从16-31 block的区间从 12 extents涨到了111 extents

## 解决办法

用deploy在部署的时候默认的格式化参数为  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">command</span>_check_call: Running <span class="built_in">command</span>: /usr/sbin/mkfs -t xfs <span class="operator">-f</span> -i size=<span class="number">2048</span> -- /dev/sdb1</span><br></pre></td></tr></tbody></table>

这个isize设置的是2048，这个在后面剩余的空洞比较小的时候就无法写入新的数据了，所以在ceph里面存储100K这种小文件的场景的时候，把mkfs.xfs的isize改成默认的256就可以提前避免这个问题  
修改 /usr/lib/python2.7/site-packages/ceph\_disk/main.py的256行  

<table><tbody><tr><td class="code"><pre><span class="line">xfs=[</span><br><span class="line">    <span class="comment"># xfs insists on not overwriting previous fs; even if we wipe</span></span><br><span class="line">    <span class="comment"># partition table, we often recreate it exactly the same way,</span></span><br><span class="line">    <span class="comment"># so we'll see ghosts of filesystems past</span></span><br><span class="line">    <span class="string">'-f'</span>,</span><br><span class="line">    <span class="string">'-i'</span>, <span class="string">'size=2048'</span>,</span><br><span class="line">],</span><br></pre></td></tr></tbody></table>

改成  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="string">'-i'</span>, <span class="string">'size=256'</span>,</span><br></pre></td></tr></tbody></table>

![image.png-24.4kB](images/image.png)  
这个地方检查下是不是对的，然后就可以避免这个问题了，可以测试下是不是一直可以写到很多，我的这个测试环境写到91%还没问题

## 总结

在特定的数据写入模型下，可能出现一些可能无法预料的问题，而参数的改变可能也没法覆盖所有场景，本篇就是其中的一个比较特殊的问题，定位好问题，在遇到的时候能够解决，或者提前避免掉

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-09-04 |

Source: zphj1987@gmail ([osd磁盘空间足够无法写入数据的分析与解决](http://www.zphj1987.com/2017/09/04/osd-has-inode-cannot-write/))
