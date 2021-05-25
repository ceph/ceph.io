---
title: "rbd的image对象数与能写入文件数的关系"
date: "2017-01-03"
author: "admin"
tags: 
  - "planet"
---

  
![](images/2017.png)  

## 一、前言

收到一个问题如下：

> 一个300TB 的RBD，只有7800万的objects，如果存储小文件的话，感觉不够用

对于这个问题，我原来的理解是：对象默认设置的大小是4M一个，存储下去的数据，如果小于4M，就会占用一个小于4M的对象，如果超过4M，那么存储的数据就会进行拆分成多个4M，这个地方其实是不严谨的

对于rados接口来说，数据是多大对象put进去就是多大的对象，并没有进行拆分，进行拆分的是再上一层的应用，比如rbd，比如cephfs

那么对于rbd的image显示的对象数目和文件数目有什么关系呢？本篇将来看看这个问题，到底会不会出现上面的问题  

## 二、实践过程

创建一个image  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rbd create --image zpsize --size 100M</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rbd info zpsize</span></span><br><span class="line">rbd image <span class="string">'zpsize'</span>:</span><br><span class="line">	size <span class="number">102400</span> kB <span class="keyword">in</span> <span class="number">25</span> objects</span><br><span class="line">	order <span class="number">22</span> (<span class="number">4096</span> kB objects)</span><br><span class="line">	block_name_prefix: rbd_data.<span class="number">85</span>c66b8b4567</span><br><span class="line">	format: <span class="number">2</span></span><br><span class="line">	features: layering</span><br><span class="line">	flags:</span><br></pre></td></tr></tbody></table>

可以看到，这个image从集群中分配到了25个对象，每个对象的大小为4M，假如我们写入1000个小文件看下会是什么情况

映射到本地并且格式化xfs文件系统  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rbd map zpsize</span></span><br><span class="line">/dev/rbd0</span><br><span class="line">[root@lab8106 ~]<span class="comment"># mkfs.xfs -f /dev/rbd0 </span></span><br><span class="line"><span class="variable">meta-data=</span>/dev/rbd0              <span class="variable">isize=</span><span class="number">256</span>    <span class="variable">agcount=</span><span class="number">4</span>, <span class="variable">agsize=</span><span class="number">6144</span> <span class="variable">blks</span><br><span class="line">         =</span>                       <span class="variable">sectsz=</span><span class="number">512</span>   <span class="variable">attr=</span><span class="number">2</span>, <span class="variable">projid32bit=</span><span class="number">1</span></span><br><span class="line">         =                       <span class="variable">crc=</span><span class="number">0</span>        <span class="variable">finobt=</span><span class="number">0</span></span><br><span class="line"><span class="variable">data     =</span>                       <span class="variable">bsize=</span><span class="number">4096</span>   <span class="variable">blocks=</span><span class="number">24576</span>, <span class="variable">imaxpct=</span><span class="number">25</span></span><br><span class="line">         =                       <span class="variable">sunit=</span><span class="number">1024</span>   <span class="variable">swidth=</span><span class="number">1024</span> blks</span><br><span class="line"><span class="variable">naming   =</span>version <span class="number">2</span>              <span class="variable">bsize=</span><span class="number">4096</span>   <span class="variable">ascii-ci=</span><span class="number">0</span> <span class="variable">ftype=</span><span class="number">0</span></span><br><span class="line"><span class="variable">log      =</span>internal log           <span class="variable">bsize=</span><span class="number">4096</span>   <span class="variable">blocks=</span><span class="number">624</span>, <span class="variable">version=</span><span class="number">2</span></span><br><span class="line">         =                       <span class="variable">sectsz=</span><span class="number">512</span>   <span class="variable">sunit=</span><span class="number">8</span> blks, <span class="variable">lazy-count=</span><span class="number">1</span></span><br><span class="line"><span class="variable">realtime =</span>none                   <span class="variable">extsz=</span><span class="number">4096</span>   <span class="variable">blocks=</span><span class="number">0</span>, <span class="variable">rtextents=</span><span class="number">0</span></span><br></pre></td></tr></tbody></table>

挂载到本地  
\[root@lab8106 ~\]# mount /dev/rbd0 /mnt

写入1000个1K小文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># seq 1000|xargs -i dd if=/dev/zero of=/mnt/a{} bs=1K count=1</span></span><br></pre></td></tr></tbody></table>

没有报错提示，正常写入了，我们看下写入了多少对象  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd ls|grep rbd_data.85c66b8b4567</span></span><br><span class="line">rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000018</span></span><br><span class="line">rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000000</span></span><br><span class="line">rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000006</span></span><br><span class="line">rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000001</span></span><br><span class="line">rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000017</span></span><br><span class="line">rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">000000000000000</span>c</span><br><span class="line">rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000012</span></span><br><span class="line">rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000002</span></span><br></pre></td></tr></tbody></table>

只写入了少量的对象，我们尝试下载下来看看  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ll -hl rbd_data.85c66b8b4567.0000000000000018</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root <span class="number">4.0</span>M Jan  <span class="number">3</span> <span class="number">14</span>:<span class="number">27</span> rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000018</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd get rbd_data.85c66b8b4567.0000000000000000 rbd_data.85c66b8b4567.0000000000000000</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># ll -hl rbd_data.85c66b8b4567.0000000000000000</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root <span class="number">4.0</span>M Jan  <span class="number">3</span> <span class="number">14</span>:<span class="number">27</span> rbd_data.<span class="number">85</span>c66b8b4567.<span class="number">0000000000000000</span></span><br></pre></td></tr></tbody></table>

可以看到还是4M的对象，实际上写入的小文件已经进行了合并了，在底层已经是一个4M的对象文件了

## 总结

本篇的结论就是，rbd层之上的写入的文件的个数与底层的对象数目是没有关系的，对象数目和对象大小是底层处理的，再上一层就是文件系统去处理的了，总空间占用上是一致的

## 我的公众号-磨磨谈

  
![](images/qrcode_for_gh_6998a54d68f7_430.jpg)  

Source: zphj1987@gmail ([rbd的image对象数与能写入文件数的关系](http://www.zphj1987.com/2017/01/03/rbd-image-write-objects/))
