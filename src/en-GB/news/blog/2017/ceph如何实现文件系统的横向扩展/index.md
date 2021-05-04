---
title: "Ceph如何实现文件系统的横向扩展"
date: "2017-03-29"
author: "admin"
tags: 
  - "planet"
---

  
![box](images/box.jpg)  

## 前言

在跟一个朋友聊天的时候，聊到一个技术问题，他们的一个环境上面小文件巨多，是我目前知道的集群里面规模算非常大的了，但是目前有个问题，一方面会进行一倍的硬件的扩容，而文件的数量也在剧烈的增长着，所以有没有什么办法来 缓解这个增长的压力  
  
当时也没想到太多的办法,只是觉得这么用下去风险太大

后来在思考了一段时间后，大概有了一个想法，这个就要看是否能把方案做下去，如果是我自己在用的集群，而非客户，我会这么去用的

## 方案介绍

### 方案一

也就是默认的方案，一般来说就是一个主MDS，然后几个备用MDS，整个一个挂载点，全局混用的空间

存在问题：

- 扩容以后，有大量的数据迁移
- 所有的元数据请求，只有一个MDS服务，到了巨型数据的时候，可能出现卡顿或MDS卡掉的问题

优点：

- 全局统一命名空间

### 方案二：

采用分存储池的结构，也就是将集群内的目录树分配到整个集群的多个相互独立的空间里面

存在问题：

- 同样是所有的元数据请求，只有一个MDS服务，到了巨型数据的时候，可能出现卡顿或MDS卡掉的问题

优点：

- 全局统一命名空间下面对应目录到不同的存储池当中，在进行扩容的时候，不会影响原有的数据，基本是没有迁移数据

### 方案三：

物理分存储池的结构并没有解决元数据压力过大的问题，而元数据的处理能力并非横向扩展的，而文件数量和集群规模都是在横向增长，所以必然是一个瓶颈点

这个方案其实很简单，相当于方案二的扩展，我们在方案二中进行了物理存储池的分离，然后把空间映射到子目录，来实现数据的分离，既然规模能够大到分物理空间，那么我们可以考虑部署多套集群，并且来真正的实现了数据处理能力的横向扩展，因为MDS，可以是多个的了，那么比较重要的问题就是统一命名空间的问题了，怎么实现，这个也简单，主要是跟客户沟通好，让客户接受提出的方案

我们在一些商业系统上面可以看到一些限制，比如单卷的大小最大支持多大，在这里我们需要跟客户沟通好，无限的扩展，会带来一些压力的风险，有方案能够解决这种问题，而这种数据量在之前是没有太多的案例可借鉴的，所以需要人为控制一个目录的最大空间，也就是单套集群的大小，下面举例来说明下

假设我们的空间一期规模为2P，二期规模要4P，三期规模6P  
那么我们的命名空间上就分离出三个逻辑空间，也就是对应三套集群

弄清楚客户的存储的目录结构，一般来说客户并不太关心目录的设计，如果能够引导的情况下，可以引导客户，我们需要弄清楚目录可变化的那个点在哪里，举例说明，假如客户的数据可以去按年进行分类的话，数据就可以是  

<table><tbody><tr><td class="code"><pre><span class="line">2014</span><br><span class="line">2015 </span><br><span class="line">2016</span><br><span class="line">2017</span><br></pre></td></tr></tbody></table>

这样的增长趋势，并且数据量之前的肯定已知，未来可大概估计，并且集群准备存储多少年的数据，也是可大概预估的，那么这个环境我们就先认为到2017的数据我们放在集群一内，2017年以后的数据放在集群二内，那么挂载点是这样的  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">192.168</span>.<span class="number">10.101</span><span class="symbol">:/</span><span class="number">2014</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">10.101</span><span class="symbol">:/</span><span class="number">2015</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">10.101</span><span class="symbol">:/</span><span class="number">2016</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">10.101</span><span class="symbol">:/</span><span class="number">2017</span></span><br><span class="line"></span><br><span class="line"><span class="number">192.168</span>.<span class="number">10.102</span><span class="symbol">:/</span><span class="number">2018</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">10.102</span><span class="symbol">:/</span><span class="number">2019</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">10.102</span><span class="symbol">:/</span><span class="number">2020</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">10.102</span><span class="symbol">:/</span><span class="number">2021</span></span><br></pre></td></tr></tbody></table>

挂载到本地的服务的机器上  
本地创建好目录  

<table><tbody><tr><td class="code"><pre><span class="line">/share/<span class="number">2014</span></span><br><span class="line">/share/<span class="number">2015</span></span><br><span class="line">/share/<span class="number">2016</span></span><br><span class="line">/share/<span class="number">2017</span></span><br><span class="line">/share/<span class="number">2018</span></span><br><span class="line">/share/<span class="number">2019</span></span><br><span class="line">/share/<span class="number">2020</span></span><br><span class="line">/share/<span class="number">2021</span></span><br></pre></td></tr></tbody></table>

然后把上面的集群挂载点按名称挂载到本地的这些目录上面

本地的共享就把/share共享出去，那么用户看到的就是一个全局命名空间了，这个是用本地子目录映射的方式来实现统一命名空间，技术难度小，难点在于跟客户沟通好数据的层级结构，如果客户能够自己随意增加目录，那么更好实现了，随意的将目录分配到两个集群即可，最终能达到满意的效果就行

当然主要还是需要客户能够接受你的方案，海量小文件的情况下，分开到多个集群当然会更好些，并且集群万一崩溃，也是只会影响局部的集群了

## 总结

我们在利用一些新的技术的时候我们很多时候关注的是他最好的那个点，而这个点有的时候反而阻碍了我们的想法，比如集群，那就是把所有硬盘管理起来，搞成一个集群，那么为什么不能往上再走一层，我用管理的方式把多套集群在管理的层面组合成一个集群池呢？然后从多个集群里面来分配我们需要的资源即可

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-03-29 |

Source: zphj1987@gmail ([Ceph如何实现文件系统的横向扩展](http://www.zphj1987.com/2017/03/29/Ceph-filesystem-scaleout/))
