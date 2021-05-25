---
title: "bluestore对象挂载到系统进行提取"
date: "2019-07-26"
author: "admin"
tags: 
  - "planet"
---

## 前言

之前在filestore里面，pg是直接暴露到文件系统的，也就是可以直接进去查看或者拷贝，在极端情况下，多个osd无法启动，pg无法导出的时候，那么对pg内部对象的操作处理，是可以作为最后恢复数据的一种方式的

这个在bluestore里面就没那么直接了，之前也碰到过一次，osd无法启动，内部死循环，pg无法export，osd就僵死在那里了，实际上，bluestore也提供了接口把对象能够直接显示出来

## 具体操作实践

我们选择一个pg 1.7  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># ceph pg dump|grep 1.7</span></span><br><span class="line">dumped all</span><br><span class="line"><span class="number">1.7</span>         <span class="number">128</span>                  <span class="number">0</span>        <span class="number">0</span>         <span class="number">0</span>       <span class="number">0</span> <span class="number">524353536</span> <span class="number">1583</span>     <span class="number">1583</span> active+clean <span class="number">2019</span>-<span class="number">07</span>-<span class="number">26</span> <span class="number">10</span>:<span class="number">05</span>:<span class="number">17.715749</span> <span class="number">14</span><span class="string">'3583  14:3670 [1]          1    [1]              1        0'</span><span class="number">0</span> <span class="number">2019</span>-<span class="number">07</span>-<span class="number">26</span> <span class="number">10</span>:<span class="number">01</span>:<span class="number">20.337218</span>             <span class="number">0</span><span class="string">'0 2019-07-26 10:01:20.337218</span></span><br></pre></td></tr></tbody></table>

可以看到pg 1.7是有128个对象存储在osd.1上

检查挂载点  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># df -h|grep ceph-1</span></span><br><span class="line">tmpfs                     <span class="number">16</span>G   <span class="number">48</span>K   <span class="number">16</span>G   <span class="number">1</span>% /var/lib/ceph/osd/ceph-<span class="number">1</span></span><br></pre></td></tr></tbody></table>

可以看到是挂载到tmpfs的，我们先停止掉osd.1

我们把osd的数据挂载起来  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># ceph-objectstore-tool --op fuse --data-path /var/lib/ceph/osd/ceph-1 --mountpoint /osdmount/</span></span><br><span class="line">mounting fuse at /osdmount/ ...</span><br></pre></td></tr></tbody></table>

开另外一个终端  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># df -h|grep osdmount</span></span><br><span class="line">foo                      <span class="number">3.7</span>T  <span class="number">3.7</span>T  <span class="number">3.7</span>T  <span class="number">51</span>% /osdmount</span><br></pre></td></tr></tbody></table>

可以看到有了新的挂载点，我们看下里面的数据结构

我们随便选取一个对象  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># ll /osdmount/1.7_head/all/#1:fc00bae4:::rbd_data.10166b8b4567.00000000000001fc:head#/data</span></span><br><span class="line">-rwx------ <span class="number">1</span> root root <span class="number">4194304</span> Jan  <span class="number">1</span>  <span class="number">1970</span> /osdmount/<span class="number">1.7</span>_head/all/<span class="comment">#1:fc00bae4:::rbd_data.10166b8b4567.00000000000001fc:head#/data</span></span><br><span class="line">[root@lab101 ~]<span class="comment"># md5sum /osdmount/1.7_head/all/#1:fc00bae4:::rbd_data.10166b8b4567.00000000000001fc:head#/data</span></span><br><span class="line"><span class="number">7</span>def453c4a818e6<span class="built_in">cd</span>542bfba4dea9943  /osdmount/<span class="number">1.7</span>_head/all/<span class="comment">#1:fc00bae4:::rbd_data.10166b8b4567.00000000000001fc:head#/data</span></span><br></pre></td></tr></tbody></table>

这个对象的名称为：rbd\_data.10166b8b4567.00000000000001fc

我们把数据弄到本地  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># cp /osdmount/1.7_head/all/#1:fc00bae4:::rbd_data.10166b8b4567.00000000000001fc:head#/data /tmp/rbd_data.10166b8b4567.00000000000001fc-inbluestore</span></span><br></pre></td></tr></tbody></table>

我们通过rados的接口查询获取这个对象  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># rados -p rbd ls|grep 00000000000001fc</span></span><br><span class="line">rbd_data.<span class="number">10166</span>b8b4567.<span class="number">00000000000001</span><span class="built_in">fc</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># rados -p rbd get rbd_data.10166b8b4567.00000000000001fc /tmp/rbd_data.10166b8b4567.00000000000001fc-radosget</span></span><br></pre></td></tr></tbody></table>

现在就有下面两个对象了  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># ls /tmp/rbd_data.10166b8b4567.00000000000001fc-* -hl</span></span><br><span class="line">-rwx------ <span class="number">1</span> root root <span class="number">4.0</span>M Jul <span class="number">26</span> <span class="number">10</span>:<span class="number">17</span> /tmp/rbd_data.<span class="number">10166</span>b8b4567.<span class="number">00000000000001</span><span class="built_in">fc</span>-inbluestore</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root <span class="number">4.0</span>M Jul <span class="number">26</span> <span class="number">10</span>:<span class="number">19</span> /tmp/rbd_data.<span class="number">10166</span>b8b4567.<span class="number">00000000000001</span><span class="built_in">fc</span>-radosget</span><br></pre></td></tr></tbody></table>

这两个对象分别从rados获取的，也就是前端获取的，一个从底层磁盘提取的，也就是模拟的故障提取

我们来比较一下两个文件的md5值  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># md5sum /tmp/rbd_data.10166b8b4567.00000000000001fc-* </span></span><br><span class="line"><span class="number">7</span>def453c4a818e6<span class="built_in">cd</span>542bfba4dea9943  /tmp/rbd_data.<span class="number">10166</span>b8b4567.<span class="number">00000000000001</span><span class="built_in">fc</span>-inbluestore</span><br><span class="line"><span class="number">7</span>def453c4a818e6<span class="built_in">cd</span>542bfba4dea9943  /tmp/rbd_data.<span class="number">10166</span>b8b4567.<span class="number">00000000000001</span><span class="built_in">fc</span>-radosget</span><br></pre></td></tr></tbody></table>

可以看到文件的内容一样的了

因此通过这个方法在底层获取对象是可以获取到正确的对象的

## 总结

之前对bluestore的感觉一直不太好，是因为一旦出现故障，数据的提取相当困难，之前还有过bluestore内部数据库损坏无法启动osd的，如果用过filestore，应该都做过很多故障的修复，leveldb的数据库的损坏，从其他机器弄回来，bluestore这个在封装以后，一些操作变的困难，虽然也有提供一些repair的工具，但是有时还是无法生效，并不是每个人都能够去做代码级的修复

随着文件系统对外接口提供的越来越多的时候，修复的方式方法也会增多，相信这个也会越来越稳定的，我们需要做的就是，在任何故障下，做最大的可能去修复，才能更好的面对未来的故障

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2019-07-26 |

Source: zphj1987@gmail ([bluestore对象挂载到系统进行提取](http://www.zphj1987.com/2019/07/26/get-object-from-bluestore/))
