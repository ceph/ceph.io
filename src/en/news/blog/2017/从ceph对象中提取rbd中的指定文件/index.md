---
title: "从ceph对象中提取RBD中的指定文件"
date: "2017-07-22"
author: "admin"
tags: 
  - "planet"
---

  
![](images/BLDG.png)  

## 前言

之前有个想法，是不是有办法找到rbd中的文件与对象的关系，想了很久但是一直觉得文件系统比较复杂，在fs 层的东西对ceph来说是透明的，并且对象大小是4M，而文件很小，可能在fs层进行了合并，应该很难找到对应关系，最近看到小胖有提出这个问题，那么就再次尝试了，现在就是把这个实现方法记录下来  
  
这个提取的作用个人觉得最大的好处就是一个rbd设备，在文件系统层被破坏以后，还能够从rbd提取出文件，我们知道很多情况下设备的文件系统一旦破坏，无法挂载，数据也就无法读取，而如果能从rbd中提取出文件，这就是保证了即使文件系统损坏的情况下，数据至少不丢失

本篇是基于xfs文件系统情况下的提取，其他文件系统有时间再看看，因为目前使用的比较多的就是xfs文件系统

本篇也回答了一个可能会经常被问起的问题，能告诉我虚拟机里面的文件在后台存储在哪里么，看完本篇就知道存储在哪里了

## XFS文件系统介绍

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># mkfs.xfs -f /dev/rbd0p1 </span></span><br><span class="line">warning: device is not properly aligned /dev/rbd0p1</span><br><span class="line">meta-data=/dev/rbd0p1            isize=<span class="number">256</span>    agcount=<span class="number">9</span>, agsize=<span class="number">162816</span> blks</span><br><span class="line">         =                       sectsz=<span class="number">512</span>   attr=<span class="number">2</span>, projid32bit=<span class="number">1</span></span><br><span class="line">         =                       crc=<span class="number">0</span>        finobt=<span class="number">0</span></span><br><span class="line">data     =                       bsize=<span class="number">4096</span>   blocks=<span class="number">1310475</span>, imaxpct=<span class="number">25</span></span><br><span class="line">         =                       sunit=<span class="number">1024</span>   swidth=<span class="number">1024</span> blks</span><br><span class="line">naming   =version <span class="number">2</span>              bsize=<span class="number">4096</span>   ascii-ci=<span class="number">0</span> ftype=<span class="number">0</span></span><br><span class="line"><span class="built_in">log</span>      =internal <span class="built_in">log</span>           bsize=<span class="number">4096</span>   blocks=<span class="number">2560</span>, version=<span class="number">2</span></span><br><span class="line">         =                       sectsz=<span class="number">512</span>   sunit=<span class="number">8</span> blks, lazy-count=<span class="number">1</span></span><br><span class="line">realtime =none                   extsz=<span class="number">4096</span>   blocks=<span class="number">0</span>, rtextents=<span class="number">0</span></span><br></pre></td></tr></tbody></table>

XFS文件系统采取是AG管理的，每个AG维护自己的inode和数据，所以XFS文件系统是一种很容易扩展的文件系统，本篇里面主要用到的命令是xfs\_bmap这个命令  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># xfs_bmap -lvp /etc/fstab</span></span><br><span class="line">/etc/fstab:</span><br><span class="line"> EXT: FILE-OFFSET      BLOCK-RANGE        AG AG-OFFSET        TOTAL FLAGS</span><br><span class="line">   <span class="number">0</span>: [<span class="number">0</span>..<span class="number">7</span>]:          <span class="number">26645424</span>..<span class="number">26645431</span>  <span class="number">1</span> (<span class="number">431024</span>..<span class="number">431031</span>)     <span class="number">8</span> <span class="number">00000</span></span><br></pre></td></tr></tbody></table>

一个文件最小就是8个block（512b），也就是4k,这个因为上面默认的xfs的格式化就是data bsize=4K,这个值可以自行调整的，本篇尽量用默认常规的参数来讲例子

查看man xfs\_bmap这个命令可以看到：

> Holes are marked by replacing the startblock..endblock with hole. All the file offsets and disk blocks are in units of 512-byte blocks, no matter what the filesystem’s block size is.

意思是这个查询到的里面的计数单位都是512-byte，不管上层设置的block大小是多少，我们知道文件系统底层的sector就是512-byte，所以这个查询到的结果就可以跟当前的文件系统的sector的偏移量联系起来，这里强调一下，这个偏移量的起始位子为当前文件系统所在分区的偏移量，如果是多分区的情况，在计算整个偏移量的时候就要考虑分区的偏移量了，这个会在后面用实例进行讲解的

rbd的对象是不清楚内部分区的偏移量，所以在rbd层进行提取的时候是需要得到的是分区当中的文件相对整个磁盘的一个sector的偏移量

## rbd的对象结构

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rados -p rbd ls|grep data</span></span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">00000000000009</span>ff</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">00000000000001</span>dd</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">0000000000000000</span></span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">000000000000009</span>f</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">0000000000000459</span></span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">000000000000027</span>e</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">00000000000004</span>ff</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">000000000000027</span>c</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">000000000000027</span>d</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">0000000000000001</span></span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">000000000000013</span>e</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">00000000000003</span>ba</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">000000000000031</span>b</span><br><span class="line">rbd_data.<span class="number">25</span>a636b8b4567.<span class="number">00000000000004</span>f8</span><br></pre></td></tr></tbody></table>

rbd被xfs格式化以后会产生一些对象，这些对象是以16进制名称的方式存储在后台的，也就是rbd大小一定的情况下对象数目是一定的，也就是名称也是一定的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># parted -s /dev/rbd0 unit s print</span></span><br><span class="line">Model: Unknown (unknown)</span><br><span class="line">Disk /dev/rbd0: <span class="number">20971520</span>s</span><br><span class="line">Sector size (logical/physical): <span class="number">512</span>B/<span class="number">512</span>B</span><br><span class="line">Partition Table: gpt</span><br><span class="line">Disk Flags: </span><br><span class="line"></span><br><span class="line">Number  Start      End        Size       File system  Name     Flags</span><br><span class="line"> <span class="number">1</span>      <span class="number">1953</span>s      <span class="number">10485759</span>s  <span class="number">10483807</span>s  xfs          primari</span><br><span class="line"> <span class="number">2</span>      <span class="number">10485760</span>s  <span class="number">20963327</span>s  <span class="number">10477568</span>s               primari</span><br></pre></td></tr></tbody></table>

上面可以看到rbd0的sector个数为20971520s  
20971520s\*512byte=10737418240byte=10485760KB=10240MB  
sector的大小一定，总rbd大小一定的情况下sector的数目也是一定的，本篇实例的rbd大小  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rbd info zp</span></span><br><span class="line">rbd image <span class="string">'zp'</span>:</span><br><span class="line">	size <span class="number">10000</span> MB <span class="keyword">in</span> <span class="number">2500</span> objects</span><br><span class="line">	order <span class="number">22</span> (<span class="number">4096</span> kB objects)</span><br><span class="line">	block_name_prefix: rbd_data.<span class="number">25</span>a776b8b4567</span><br><span class="line">	format: <span class="number">2</span></span><br><span class="line">	features: layering</span><br><span class="line">	flags: </span><br><span class="line">	create_timestamp: Sat Jul <span class="number">22</span> <span class="number">18</span>:<span class="number">04</span>:<span class="number">12</span> <span class="number">2017</span></span><br></pre></td></tr></tbody></table>

## sector和ceph object的对应关系的查询

这个就像个map一样，需要把这个关系给找到，一个sector的区间对应到object的map，这里我用python写个简单的方法来做查询，也可以自己用其他语言来实现

首先查询到rbd的对象数目  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rbd info zp</span></span><br><span class="line">rbd image <span class="string">'zp'</span>:</span><br><span class="line">	size <span class="number">10000</span> MB <span class="keyword">in</span> <span class="number">2500</span> objects</span><br><span class="line">	order <span class="number">22</span> (<span class="number">4096</span> kB objects)</span><br><span class="line">	block_name_prefix: rbd_data.<span class="number">25</span>a776b8b4567</span><br><span class="line">	format: <span class="number">2</span></span><br><span class="line">	features: layering</span><br><span class="line">	flags: </span><br><span class="line">	create_timestamp: Sat Jul <span class="number">22</span> <span class="number">18</span>:<span class="number">04</span>:<span class="number">12</span> <span class="number">2017</span></span><br></pre></td></tr></tbody></table>

处理脚本如下:  

<table><tbody><tr><td class="code"><pre><span class="line">vim getsecob.py</span><br></pre></td></tr></tbody></table>

添加下面内容  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#! /bin/python</span></span><br><span class="line"><span class="comment"># *-* conding=UTF-8 *-*</span></span><br><span class="line"></span><br><span class="line">import commands</span><br><span class="line"></span><br><span class="line">def main():</span><br><span class="line">    getmap(<span class="number">2500</span>)</span><br><span class="line"></span><br><span class="line"></span><br><span class="line">def getmap(object):</span><br><span class="line">    sector=int(object)*<span class="number">4096</span>*<span class="number">1024</span>/<span class="number">512</span></span><br><span class="line">    <span class="built_in">print</span> <span class="string">"object:"</span>+str(object)</span><br><span class="line">    <span class="built_in">print</span> <span class="string">"sector:"</span>+str(sector)</span><br><span class="line">    incre=sector/object</span><br><span class="line">    <span class="keyword">for</span> item <span class="keyword">in</span> range(int(object)):</span><br><span class="line">        a=int(item*<span class="number">8192</span>)</span><br><span class="line">        b=int((item+<span class="number">1</span>)*<span class="number">8192</span>-<span class="number">1</span>)</span><br><span class="line">        <span class="built_in">print</span> str([a,b])+<span class="string">"  --&gt;  "</span>+<span class="string">"%016x"</span> %item</span><br><span class="line"></span><br><span class="line"><span class="keyword">if</span> __name__ == <span class="string">'__main__'</span>:</span><br><span class="line">    main()</span><br></pre></td></tr></tbody></table>

其中getmap后面为对象数目  
输出是这个形式的：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># python getsecob.py</span></span><br><span class="line">object:<span class="number">2500</span></span><br><span class="line">sector:<span class="number">20480000</span></span><br><span class="line">[<span class="number">0</span>, <span class="number">8191</span>]  --&gt;  <span class="number">0000000000000000</span></span><br><span class="line">[<span class="number">8192</span>, <span class="number">16383</span>]  --&gt;  <span class="number">0000000000000001</span></span><br><span class="line">[<span class="number">16384</span>, <span class="number">24575</span>]  --&gt;  <span class="number">0000000000000002</span></span><br><span class="line">[<span class="number">24576</span>, <span class="number">32767</span>]  --&gt;  <span class="number">0000000000000003</span></span><br><span class="line">[<span class="number">32768</span>, <span class="number">40959</span>]  --&gt;  <span class="number">0000000000000004</span></span><br><span class="line">[<span class="number">40960</span>, <span class="number">49151</span>]  --&gt;  <span class="number">0000000000000005</span></span><br><span class="line">···</span><br></pre></td></tr></tbody></table>

对rbd0进行分区，分区后的结果如下  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># parted -s /dev/rbd0 unit s print</span></span><br><span class="line">Model: Unknown (unknown)</span><br><span class="line">Disk /dev/rbd0: <span class="number">20480000</span>s</span><br><span class="line">Sector size (logical/physical): <span class="number">512</span>B/<span class="number">512</span>B</span><br><span class="line">Partition Table: gpt</span><br><span class="line">Disk Flags: </span><br><span class="line"></span><br><span class="line">Number  Start      End        Size       File system  Name     Flags</span><br><span class="line"> <span class="number">1</span>      <span class="number">1953</span>s      <span class="number">10240000</span>s  <span class="number">10238048</span>s               primari</span><br><span class="line"> <span class="number">2</span>      <span class="number">10248192</span>s  <span class="number">20471807</span>s  <span class="number">10223616</span>s               primari</span><br></pre></td></tr></tbody></table>

这个是个测试用的image，大小为10G分成两个5G的分区，现在我们在两个分区里面分别写入两个测试文件，然后经过计算后，从后台的对象中把文件读出  

<table><tbody><tr><td class="code"><pre><span class="line">mount /dev/rbd0p1 /mnt1</span><br><span class="line">mount /dev/rbd0p2 /mnt2</span><br><span class="line">cp /etc/fstab /mnt1</span><br><span class="line">cp /etc/hostname /mnt2</span><br></pre></td></tr></tbody></table>

首先获取文件在分区上的sector的偏移量  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># xfs_bmap -lvp /mnt1/fstab </span></span><br><span class="line">/mnt1/fstab:</span><br><span class="line"> EXT: FILE-OFFSET      BLOCK-RANGE      AG AG-OFFSET        TOTAL FLAGS</span><br><span class="line">   <span class="number">0</span>: [<span class="number">0</span>..<span class="number">7</span>]:          <span class="number">8224</span>..<span class="number">8231</span>        <span class="number">0</span> (<span class="number">8224</span>..<span class="number">8231</span>)         <span class="number">8</span> <span class="number">01111</span></span><br></pre></td></tr></tbody></table>

可以得到是(8224..8231)共8个sector  
从上面的分区1的start的sector可以知道起始位置是1953，那么相对于磁盘的偏移量就变成了

> (8224+1953..8231+1953) = (10177..10184)

这里说下，这个地方拿到偏移量后，直接通过对rbd设备进行dd读取也可以把这个文件读取出来，这个顺带讲下，本文主要是从对象提取：  

<table><tbody><tr><td class="code"><pre><span class="line">dd <span class="keyword">if</span>=/dev/rbd0 of=a bs=<span class="number">512</span> count=<span class="number">8</span> skip=<span class="number">10177</span></span><br></pre></td></tr></tbody></table>

bs取512是因为sector的单位就是512b  
这样就把刚刚的fstab文件读取出来了，skip就是文件的sector相对磁盘的起始位置，count就是文件所占的block数目

继续我们的对象提取方式，上面的（10177..10184）这个我们根据上面那个脚本输出的对象列表来找到对象

> \[8192, 16383\] —> 0000000000000001  
> 获取名称，这个因为我的是测试环境，就只有一个匹配，多个image的时候要过滤出对用的rbd的对象，用prifix过滤即可

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rados -p rbd ls|grep 0000000000000001</span></span><br><span class="line">rbd_data.<span class="number">25</span>a776b8b4567.<span class="number">0000000000000001</span></span><br></pre></td></tr></tbody></table>

下载对象  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rados -p rbd get rbd_data.25a776b8b4567.0000000000000001 rbd_data.25a776b8b4567.0000000000000001</span></span><br></pre></td></tr></tbody></table>

根据偏移量计算对象中的偏移量  

<table><tbody><tr><td class="code"><pre><span class="line">（<span class="number">10177</span>..<span class="number">10184</span>）</span><br><span class="line">[<span class="number">8192</span>, <span class="number">16383</span>]  --&gt;  <span class="number">0000000000000001</span></span><br></pre></td></tr></tbody></table>

得到  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">10177</span>-<span class="number">8192</span>=<span class="number">1985</span></span><br><span class="line"></span><br><span class="line">dd <span class="keyword">if</span>=rbd_data.<span class="number">25</span>a776b8b4567.<span class="number">0000000000000001</span> of=a bs=<span class="number">512</span> count=<span class="number">8</span> skip=<span class="number">1985</span></span><br></pre></td></tr></tbody></table>

得到的文件a的内容即为之前文件的内容

准备取第二个分区的文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># xfs_bmap -lvp /mnt2/hostname </span></span><br><span class="line">/mnt2/hostname:</span><br><span class="line"> EXT: FILE-OFFSET      BLOCK-RANGE      AG AG-OFFSET        TOTAL FLAGS</span><br><span class="line">   <span class="number">0</span>: [<span class="number">0</span>..<span class="number">7</span>]:          <span class="number">8224</span>..<span class="number">8231</span>        <span class="number">0</span> (<span class="number">8224</span>..<span class="number">8231</span>)         <span class="number">8</span> <span class="number">01111</span></span><br></pre></td></tr></tbody></table>

8224+10248192..8231+10248192=10256416..10256423

从磁盘方式  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># dd if=/dev/rbd0 of=a bs=512 count=8 skip=10256416</span></span><br></pre></td></tr></tbody></table>

从对象方式  
10256416..10256423 对应  
\[10256384, 10264575\] —> 00000000000004e4  
对象偏移量  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">10256416</span>-<span class="number">10256384</span>=<span class="number">32</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">rados -p rbd get </span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados -p rbd get rbd_data.25a776b8b4567.00000000000004e4 rbd_data.25a776b8b4567.00000000000004e4</span></span><br></pre></td></tr></tbody></table>

获取文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># dd if=rbd_data.25a776b8b4567.00000000000004e4 of=a bs=512 count=8 skip=32</span></span><br></pre></td></tr></tbody></table>

如果文件比较大的情况，可能出现就是文件是跨对象的，那么还是跟上面的提取方法一样，然后进行提取后的文件进行合并即可

## 总结

在存储系统上面存储的文件必然会对应到底层磁盘的sector，而sector也是会一一对应到后台的对象的，这个在本文当中得到了验证，所以整个逻辑就是，在文件系统层找到文件对应的sector位置，然后再在底层把sector和对象关系找好，就能从找到文件在对象当中的具体的位置，也就能定位并且能提取了，本篇是基于xfs的，其他文件系统只要能定位文件的sector，就可以在底层找到文件，这个以后会补充其他文件系统进来

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-07-22 |

Source: zphj1987@gmail ([从ceph对象中提取RBD中的指定文件](http://www.zphj1987.com/2017/07/22/from-ceph-object-get-rbd-file/))
