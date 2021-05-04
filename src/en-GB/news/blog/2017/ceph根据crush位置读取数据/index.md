---
title: "Ceph根据Crush位置读取数据"
date: "2017-04-27"
author: "admin"
tags: 
  - "planet"
---

  
![](http://7xweck.com1.z0.glb.clouddn.com/read.gif?imageMogr2/thumbnail/!75p)  

## 前言

在ceph研发群里面看到一个cepher在问关于怎么读取ceph的副本的问题，这个功能应该在2012年的时候,我们公司的研发就修改了代码去实现这个功能，只是当时的硬件条件所限，以及本身的稳定性问题，后来没有在生产当中使用  
  
我们都知道ceph在写数据的时候，是先写主本，然后去写副本，而读取的时候，实际上只有主本能够提供服务，这对于磁盘的整体带宽来说，并没有充分的发挥其性能，所以能够读取副本当然是会有很大好处的，特别是对于读场景比较多的情况

那么在ceph当中是不是有这个功能呢？其实是有的，这个地方ceph更往上走了一层，是基于crush定义的地址去进行文件的读取，这样在读取的客户端眼里，就没有什么主副之分，他会按自己想要的区域去尽量读取，当然这个区域没有的时候就按正常读取就可以了  

## 实践

如果你看过关于ceph hadoop的相关配置文档，应该会看到这么一个配置

> ceph.localize.reads  
> Allow reading from file replica objects  
> Default value: true

显示的是可以从非主本去读取对象，这个对于hadoop场景肯定是越近越好的，可以在ceph的代码里面搜索下 localize-reads  
[https://github.com/ceph/ceph/blob/master/src/ceph\_fuse.cc](https://github.com/ceph/ceph/blob/master/src/ceph_fuse.cc)  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="keyword">for</span> (std::vector&lt;const char*&gt;::iterator i = args.begin(); i != args.end(); ) {</span><br><span class="line">  <span class="keyword">if</span> (ceph_argparse_double_dash(args, i)) {</span><br><span class="line">    <span class="built_in">break</span>;</span><br><span class="line">  } <span class="keyword">else</span> <span class="keyword">if</span> (ceph_argparse_flag(args, i, <span class="string">"--localize-reads"</span>, (char*)NULL)) {</span><br><span class="line">    cerr &lt;&lt; <span class="string">"setting CEPH_OSD_FLAG_LOCALIZE_READS"</span> &lt;&lt; std::endl;</span><br><span class="line">    filer_flags |= CEPH_OSD_FLAG_LOCALIZE_READS;</span><br><span class="line">  } <span class="keyword">else</span> <span class="keyword">if</span> (ceph_argparse_flag(args, i, <span class="string">"-h"</span>, <span class="string">"--help"</span>, (char*)NULL)) {</span><br><span class="line">    usage();</span><br><span class="line">  } <span class="keyword">else</span> {</span><br><span class="line">    ++i;</span><br><span class="line">  }</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

可以看到在ceph-fuse的情况下，是有这个隐藏的一个参数的，本篇就是用这个隐藏的参数来进行实践

### 配置一个两节点集群

配置完成了以后ceph的目录树如下,mon部署在lab8106上面  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ~]<span class="comment"># ceph osd tree</span></span><br><span class="line">ID WEIGHT  TYPE NAME        UP/DOWN REWEIGHT PRIMARY-AFFINITY </span><br><span class="line">-<span class="number">1</span> <span class="number">1.07336</span> root default                                       </span><br><span class="line">-<span class="number">2</span> <span class="number">0.53778</span>     host lab8106                                   </span><br><span class="line"> <span class="number">1</span> <span class="number">0.26779</span>         osd.<span class="number">1</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">0</span> <span class="number">0.26999</span>         osd.<span class="number">0</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">3</span> <span class="number">0.53558</span>     host lab8107                                   </span><br><span class="line"> <span class="number">2</span> <span class="number">0.26779</span>         osd.<span class="number">2</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">3</span> <span class="number">0.26779</span>         osd.<span class="number">3</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span></span><br><span class="line">[root@lab8107 ~]<span class="comment"># ceph -s|grep mon</span></span><br><span class="line">monmap e1: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br></pre></td></tr></tbody></table>

### 在lab8107上挂载客户端

在/etc/ceph/ceph.conf中增加一个配置  

<table><tbody><tr><td class="code"><pre><span class="line">[client]</span><br><span class="line">crush_location = <span class="string">"host=lab8107 root=default"</span></span><br></pre></td></tr></tbody></table>

这个配置的作用是告诉这个客户端尽量去读取lab8107上面的对象  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ~]<span class="comment"># ceph-fuse -m lab8106:6789 /mnt  --localize-reads</span></span><br></pre></td></tr></tbody></table>

写入一个大文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ~]<span class="comment"># dd if=/dev/zero of=a bs=4M count=4000</span></span><br></pre></td></tr></tbody></table>

在lab8106和lab8107上监控磁盘  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ~]<span class="comment"># iostat -dm 1</span></span><br></pre></td></tr></tbody></table>

读取数据  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ~]<span class="comment"># dd if=a of=/dev/null</span></span><br></pre></td></tr></tbody></table>

可以看到只有lab8107上有磁盘的读取，也就是读取的数据里面肯定也有副本，都是从lab8107上面读取了

如果需要多次测试，需要清除下缓存  

<table><tbody><tr><td class="code"><pre><span class="line">sync; <span class="built_in">echo</span> <span class="number">3</span> &gt; /proc/sys/vm/drop_caches</span><br></pre></td></tr></tbody></table>

并且重新挂载客户端，这个读取crush的位置的操作是在mount的时候读取的

## 使用场景

上面的配置是可以指定多个平级的位置的  

<table><tbody><tr><td class="code"><pre><span class="line">[client]</span><br><span class="line">crush_location = <span class="string">"host=lab8106 host=lab8107 root=default"</span></span><br></pre></td></tr></tbody></table>

这样，在一些读请求很多的场景下，可以把整个后端按逻辑上划分为一个个的区域，然后前面的客户端就可以平级分配到这些区域当中，这样就可以比较大的限度去把副本的读取也调动起来的

目前在ceph-fuse上已经实现，rbd里面也有类似的一些处理，这个是一个很不错的功能

## 总结

ceph里面有很多可配置的东西，怎么用好它，最大限度的去适配使用场景，还是有很大的可调的空间的，所谓学无止境，我也在学习python coding了，有很多想法等着去实现

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-04-27 |

Source: zphj1987@gmail ([Ceph根据Crush位置读取数据](http://www.zphj1987.com/2017/04/27/Ceph-depend-Crush-read-data/))
