---
title: "RBD快速删除的方法分析与改进"
date: "2017-07-27"
author: "admin"
tags: 
  - "planet"
---

  
![delete](http://7xweck.com1.z0.glb.clouddn.com/deleting.gif?imageMogr2/thumbnail/!75p)  

## 前言

这个问题在很久以前就有一篇文章进行过讨论 [remove-big-rbd](http://cephnotes.ksperis.com/blog/2014/07/04/remove-big-rbd-image),这个文章写的比较清楚了，并且对不同的方法做了分析，这里先把结论说下

| rbd类型 | rbd rm 方法 | rados -p rm方法 |
| --- | --- | --- |
| 未填充很多 | 慢 | 快 |
| 已填充很多 | 快 | 慢 |

在rbd进行删除的时候，即使内部没有对象数据，也一样需要一个个对象去发请求，即使对象不存在，这个可以开日志看到

## 实验过程

### 开启日志的方法

在/etc/ceph/ceph.conf中添加  

<table><tbody><tr><td class="code"><pre><span class="line">[client]</span><br><span class="line">debug_ms=<span class="number">1</span></span><br><span class="line"><span class="built_in">log</span>_file=/var/<span class="built_in">log</span>/ceph/rados.log</span><br></pre></td></tr></tbody></table>

然后执行操作后，去分析每秒钟的操作数目即可,类似下面的这个，也可以用日志系统进行分析，这里不赘述  

<table><tbody><tr><td class="code"><pre><span class="line">cat  /var/<span class="built_in">log</span>/ceph/rados.log|grep delete|grep -v <span class="string">"&gt;"</span>|grep <span class="number">13</span>:<span class="number">29</span>:<span class="number">46</span>|wc <span class="operator">-l</span></span><br></pre></td></tr></tbody></table>

原始的快速删除方法  

<table><tbody><tr><td class="code"><pre><span class="line">rados -p rbd ls | grep <span class="string">'^rbd_data.25ae86b8b4567'</span> | xargs -n <span class="number">200</span>  rados -p rbd rm</span><br></pre></td></tr></tbody></table>

## 开启多进程删除的方法

这个比上面那种方法好的是：

- 可以显示当前删除的进度
- 可以指定删除的进程并发数
- 可以显示当时正在删除的对象
- 可以增加一个中断时间降低负载

首先获取一个需要快速删除的rbd的列表  
获取prifix  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 put]<span class="comment"># rbd info testrbd|grep prefix</span></span><br><span class="line">	block_name_prefix: rbd_data.<span class="number">32</span>c0f6b8b4567</span><br></pre></td></tr></tbody></table>

获取列表  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 put]<span class="comment"># rados -p rbd ls |grep rbd_data.32c0f6b8b4567 &gt; delobject</span></span><br></pre></td></tr></tbody></table>

这里可以看下内容有没有问题，检查确认下

删除的fastremove.sh脚本如下：  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="shebang">#!/bin/bash</span><br><span class="line"></span></span><br><span class="line"><span class="comment">#####config</span></span><br><span class="line">process=<span class="number">5</span></span><br><span class="line">objectlistfile=<span class="string">"./delobject"</span></span><br><span class="line">deletepool=rbd</span><br><span class="line"><span class="comment">#####</span></span><br><span class="line"></span><br><span class="line">  <span class="function"><span class="title">delete_fun</span></span>()</span><br><span class="line">  {</span><br><span class="line">      date <span class="string">"+%Y-%m-%d %H:%M:%S"</span></span><br><span class="line">      rados -p <span class="variable">$deletepool</span> rm <span class="variable">$1</span></span><br><span class="line">	  <span class="comment">#sleep 1</span></span><br><span class="line">  }</span><br><span class="line"></span><br><span class="line"> <span class="function"><span class="title">concurrent</span></span>()</span><br><span class="line"> {</span><br><span class="line">     start=<span class="variable">$1</span> &amp;&amp; end=<span class="variable">$2</span> &amp;&amp; cur_num=<span class="variable">$3</span></span><br><span class="line">     mkfifo   ./fifo.$$ &amp;&amp;  <span class="built_in">exec</span> <span class="number">4</span>&lt;&gt; ./fifo.$$ &amp;&amp; rm <span class="operator">-f</span> ./fifo.$$</span><br><span class="line">     <span class="keyword">for</span> ((i=<span class="variable">$start</span>; i&lt;<span class="variable">$cur_num</span>+<span class="variable">$start</span>; i++)); <span class="keyword">do</span></span><br><span class="line">         <span class="built_in">echo</span> <span class="string">"init  start delete process <span class="variable">$i</span>"</span> &gt;&amp;<span class="number">4</span></span><br><span class="line">     <span class="keyword">done</span></span><br><span class="line"></span><br><span class="line">     <span class="keyword">for</span>((i=<span class="variable">$start</span>; i&lt;=<span class="variable">$end</span>; i++)); <span class="keyword">do</span></span><br><span class="line">         <span class="built_in">read</span> -u <span class="number">4</span></span><br><span class="line">         {</span><br><span class="line">             <span class="built_in">echo</span> <span class="operator">-e</span> <span class="string">"-- current delete: [:delete <span class="variable">$i</span>/<span class="variable">$objectnum</span>  <span class="variable">$REPLY</span>]"</span></span><br><span class="line">             delob=`sed -n <span class="string">"<span class="variable">${i}</span>p"</span> <span class="variable">$objectlistfile</span>`</span><br><span class="line">             delete_fun <span class="variable">$delob</span></span><br><span class="line">             <span class="built_in">echo</span> <span class="string">"delete <span class="variable">$delob</span> done"</span>  <span class="number">1</span>&gt;&amp;<span class="number">4</span> <span class="comment"># write to $ff_file</span></span><br><span class="line">         } &amp;</span><br><span class="line">     <span class="keyword">done</span></span><br><span class="line">     <span class="built_in">wait</span></span><br><span class="line"> }</span><br><span class="line"></span><br><span class="line">objectnum=`cat <span class="variable">$objectlistfile</span>|wc <span class="operator">-l</span>`</span><br><span class="line">concurrent <span class="number">1</span> <span class="variable">$objectnum</span> <span class="variable">$process</span></span><br></pre></td></tr></tbody></table>

上面直接把配置写到脚本里面了，根据需要进行修改  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#####config</span></span><br><span class="line">process=<span class="number">10</span></span><br><span class="line">objectlistfile=<span class="string">"./delobject"</span></span><br><span class="line">deletepool=rbd</span><br><span class="line"><span class="comment">#####</span></span><br></pre></td></tr></tbody></table>

指定并发数目，指定准备删除的对象的list文件，指定对象所在的存储池

然后执行即可

## 本次测试删除的性能差别

准备对象数据  

<table><tbody><tr><td class="code"><pre><span class="line">rbd map testrbd</span><br><span class="line">dd <span class="keyword">if</span>=/dev/zero of=/dev/rbd2 bs=<span class="number">4</span>M count=<span class="number">1200</span></span><br></pre></td></tr></tbody></table>

获取列表  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 put]<span class="comment"># rados -p rbd ls |grep rbd_data.32c0f6b8b4567 &gt; delobject</span></span><br></pre></td></tr></tbody></table>

执行删除脚本  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 put]<span class="comment"># sh fastremove.sh</span></span><br></pre></td></tr></tbody></table>

测试结果如下：

| 并发数 | 删除时间 |
| --- | --- |
| 1 | 71s |
| 2 | 35s |
| 5 | 5s |
| 25 | 6s |
| 50 | 5s |
| 100 | 5s |

从测试结果来看在并发数为5的时候就能达到每秒删除200个对象了，根据自己的需要进行增减，也可以增减删除的间隔加上sleep

下面看下这个过程：

## 总结

在ceph里面一些系统的操作默认是单进程去处理的，一般情况下都没什么问题，在数据量超大，追求效率的时候，我们可以通过加上一些并发加速这个过程，本篇脚本当中的并发同样适用于其他需要并发的场景

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-07-27 |

Source: zphj1987@gmail ([RBD快速删除的方法分析与改进](http://www.zphj1987.com/2017/07/27/RBD-fast-remove/))
