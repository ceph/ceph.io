---
title: "Cephfs的文件存到哪里了"
date: "2017-04-20"
author: "admin"
tags: 
  - "planet"
---

  
![file](images/file.png)  

## 前言

在ceph里面使用rbd接口的时候，存储的数据在后台是以固定的prifix的对象存在的，这样就能根据相同的前缀对象去对image文件进行拼接或者修复

在文件系统里面这一块就要复杂一些，本篇就写的关于这个，文件和对象的对应关系是怎样的，用系统命令怎么定位，又是怎么得到这个路径的  

## 实践

### 根据系统命令进行文件的定位

写入测试文件  

<table><tbody><tr><td class="code"><pre><span class="line">dd <span class="keyword">if</span>=/dev/zero of=/mnt/testfile bs=<span class="number">4</span>M count=<span class="number">10</span></span><br></pre></td></tr></tbody></table>

查看文件的映射  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 mnt]<span class="comment"># cephfs /mnt/testfile  map</span></span><br><span class="line">WARNING: This tool is deprecated.  Use the layout.* xattrs to query and modify layouts.</span><br><span class="line">    FILE OFFSET                    OBJECT        OFFSET        LENGTH  OSD</span><br><span class="line">              <span class="number">0</span>      <span class="number">10000001188.00000000</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">1</span></span><br><span class="line">        <span class="number">4194304</span>      <span class="number">10000001188.00000001</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">0</span></span><br><span class="line">        <span class="number">8388608</span>      <span class="number">10000001188.00000002</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">1</span></span><br><span class="line">       <span class="number">12582912</span>      <span class="number">10000001188.00000003</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">0</span></span><br><span class="line">       <span class="number">16777216</span>      <span class="number">10000001188.00000004</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">1</span></span><br><span class="line">       <span class="number">20971520</span>      <span class="number">10000001188.00000005</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">0</span></span><br><span class="line">       <span class="number">25165824</span>      <span class="number">10000001188.00000006</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">0</span></span><br><span class="line">       <span class="number">29360128</span>      <span class="number">10000001188.00000007</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">1</span></span><br><span class="line">       <span class="number">33554432</span>      <span class="number">10000001188.00000008</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">1</span></span><br><span class="line">       <span class="number">37748736</span>      <span class="number">10000001188.00000009</span>             <span class="number">0</span>       <span class="number">4194304</span>  <span class="number">0</span></span><br></pre></td></tr></tbody></table>

查找文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 mnt]<span class="comment"># ceph osd map data 10000001188.00000000</span></span><br><span class="line">osdmap e109 pool <span class="string">'data'</span> (<span class="number">2</span>) object <span class="string">'10000001188.00000000'</span> -&gt; pg <span class="number">2.9865</span>f84d (<span class="number">2</span>.d) -&gt; up ([<span class="number">1</span>], p1) acting ([<span class="number">1</span>], p1)</span><br><span class="line">[root@lab8106 mnt]<span class="comment"># ll /var/lib/ceph/osd/ceph-1/current/2.d_head/10000001188.00000000__head_9865F84D__2 </span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph <span class="number">4194304</span> Apr <span class="number">20</span> <span class="number">09</span>:<span class="number">35</span> /var/lib/ceph/osd/ceph-<span class="number">1</span>/current/<span class="number">2</span>.d_head/<span class="number">10000001188.00000000</span>__head_9865F84D__2</span><br></pre></td></tr></tbody></table>

根据上面的命令已经把文件和对象的关系找到了，我们要看下这个关系是根据什么计算出来的

### 根据算法进行文件定位

写入测试文件(故意用bs=3M模拟后台不为整的情况)  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># dd if=/dev/zero of=/mnt/myfile bs=3M count=10</span></span><br></pre></td></tr></tbody></table>

获取文件的inode信息  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># fileinode=`stat  -c %i  "/mnt/myfile"`</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># echo $fileinode</span></span><br></pre></td></tr></tbody></table>

获取文件的大小和对象个数信息  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># filesize=`stat  -c %s  "/mnt/myfile"`</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># echo $filesize</span></span><br><span class="line"><span class="number">31457280</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># objectnumori=`echo "scale = 1; $filesize/$objectsize"|bc`</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># echo $objectnumori</span></span><br><span class="line"><span class="number">7.5</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># objectnum=`echo $((${objectnumori//.*/+1}))`</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># echo $objectnum</span></span><br><span class="line"><span class="number">8</span></span><br></pre></td></tr></tbody></table>

获取对象名称前缀  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># declare -l $objectname</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># objectname=`echo "obase=16;$fileinode"|bc`</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># echo $objectname</span></span><br><span class="line"><span class="number">1000000118</span>b</span><br></pre></td></tr></tbody></table>

上面的declare -l操作后，对象名称的变量才能自动赋值为小写的，否则的话就是大写的，会出现对应不上的问题  
对象的后缀(后面的0即为编号)  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment">#objectbackname=`printf "%.8xn" 0`</span></span><br><span class="line">[root@lab8106 ~]<span class="comment">#echo $objectbackname</span></span><br></pre></td></tr></tbody></table>

真正的对象名称为：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment">#realobjectback=$objectname.$objectbackname</span></span><br></pre></td></tr></tbody></table>

打印出所有对象名称  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># for num in `seq  0 $objectnum` ;do backname=`printf "%.8xn" $num`;echo $objectname.$backname;done;</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000000</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000001</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000002</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000003</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000004</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000005</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000006</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000007</span></span><br><span class="line"><span class="number">1000000118</span>b.<span class="number">00000008</span></span><br></pre></td></tr></tbody></table>

可以看到用算法进行定位的时候，整个过程都没有跟集群ceph进行查询交互，只用到了获取文件的stat的信息，所以根据算法就可以完全定位到具体的对象名称了

## 总结

本篇是介绍了cephfs中文件跟后台具体对象对应的关系，这个对于系统的可恢复性上面还是有很大的作用的，在cephfs当中只要对象还在，数据就还在，哪怕所有的服务全挂掉，这个在之前的某个别人的生产环境当中已经实践过一次，当然那个是rbd的相对来说要简单一些，当然文件系统的恢复也可以用OSD重构集群的方式进行恢复，本篇的对于元数据丢失的情况下文件恢复会有一定的指导作用

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-04-20 |

Source: zphj1987@gmail ([Cephfs的文件存到哪里了](http://www.zphj1987.com/2017/04/20/where-is-cephfs-data-store/))
