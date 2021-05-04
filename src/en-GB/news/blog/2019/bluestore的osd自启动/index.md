---
title: "bluestore的osd自启动"
date: "2019-09-04"
author: "admin"
tags: 
  - "planet"
---

## 前言

自启动相关的文章很多，有分析的很详细的文章，这里就不做赘述，本篇讲述的是什么情况下用，怎么用的问题

## 使用场景

一台机器的系统盘坏了，需要重装系统，相关的一些信息没有了，但是上面的数据盘还是在的，所以需要保留

某个磁盘需要换台机器进行启动，但是那台机器上没有相关的信息  

## 处理过程

### 自启动的相关处理

先扫描下lvm  

<table><tbody><tr><td class="code"><pre><span class="line">vgscan</span><br><span class="line">pvscan</span><br><span class="line">lvscan</span><br></pre></td></tr></tbody></table>

本篇的场景是lvm没有损坏的情况，如果lvm本身损坏了，那么就是去恢复lvm的问题，本篇的基础是有一个完整的osd的数据盘，也就是磁盘本身是没问题的

### 查询osd相关的磁盘信息

<table><tbody><tr><td class="code"><pre><span class="line">lvdisplay |grep <span class="string">"LV Path"</span>|grep ceph</span><br><span class="line"> LV Path                /dev/ceph-b748833c-b646-<span class="number">4</span>b1c<span class="operator">-a</span>2ef<span class="operator">-f</span>50576b0a165/osd-block-<span class="number">38657557</span>-<span class="number">5</span>ce3-<span class="number">43</span>a1-<span class="number">861</span>a<span class="operator">-e</span>690c880ddf6</span><br><span class="line"> LV Path                /dev/ceph-aa2304f1<span class="operator">-a</span>098-<span class="number">4990</span>-<span class="number">8</span>f3a-<span class="number">46</span>f176d4cece/osd-block<span class="operator">-f</span>8a30c38-<span class="number">48</span>fd-<span class="number">465</span>c-<span class="number">9982</span>-<span class="number">14</span><span class="built_in">cd</span>22d00d21</span><br><span class="line"> LV Path                /dev/ceph-<span class="number">8</span>b987af1<span class="operator">-f</span>10a-<span class="number">4</span>c9a<span class="operator">-a</span>096-<span class="number">352</span>e63c7ef83/osd-block-<span class="number">07</span>d1c423-<span class="number">8777</span>-<span class="number">4</span>eea-<span class="number">8</span>a1d-<span class="number">34</span>dc06f840ae</span><br><span class="line"> LV Path                /dev/ceph<span class="operator">-f</span>39ac1da-<span class="number">2811</span>-<span class="number">4486</span>-<span class="number">8690</span>-<span class="number">4</span>ccfb1e45e18/osd-block-<span class="number">0</span>cb9186e-<span class="number">6512</span>-<span class="number">4582</span><span class="operator">-a</span>30d-<span class="number">9</span>fb4cf03c964</span><br><span class="line"> LV Path                /dev/ceph-<span class="number">6167</span>d452<span class="operator">-a</span>121-<span class="number">4602</span>-<span class="number">836</span>a-ab378cf6eccc/osd-block-<span class="number">2</span>e77e3b5-<span class="number">9</span>d5c-<span class="number">4</span>d5f-bf18-c33ddf0bbc0a</span><br></pre></td></tr></tbody></table>

注意osd-block后面的字段，这个信息是会记录在osd dump输出信息的，我们查询下osd-block-38657557-5ce3-43a1-861a-e690c880ddf6这个的信息  

<table><tbody><tr><td class="code"><pre><span class="line">[root@node1 ~]<span class="comment"># ceph osd dump|grep 38657557-5ce3-43a1-861a-e690c880ddf6</span></span><br><span class="line">osd.<span class="number">31</span> down <span class="keyword">in</span>  weight <span class="number">1</span> up_from <span class="number">395</span> up_thru <span class="number">395</span> down_at <span class="number">399</span> last_clean_interval [<span class="number">391</span>,<span class="number">392</span>) <span class="number">66.66</span>.<span class="number">66.60</span>:<span class="number">6830</span>/<span class="number">10392</span> <span class="number">66.66</span>.<span class="number">66.60</span>:<span class="number">6847</span>/<span class="number">10392</span> <span class="number">66.66</span>.<span class="number">66.60</span>:<span class="number">6875</span></span><br><span class="line">/<span class="number">10392</span> <span class="number">66.66</span>.<span class="number">66.60</span>:<span class="number">6882</span>/<span class="number">10392</span> exists <span class="number">38657557</span>-<span class="number">5</span>ce3-<span class="number">43</span>a1-<span class="number">861</span>a<span class="operator">-e</span>690c880ddf6</span><br></pre></td></tr></tbody></table>

### 做自动挂载

可以得到如下信息，osd.31的lvm标记为38657557-5ce3-43a1-861a-e690c880ddf6  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl start ceph-volume@lvm-<span class="number">31</span>-<span class="number">38657557</span>-<span class="number">5</span>ce3-<span class="number">43</span>a1-<span class="number">861</span>a<span class="operator">-e</span>690c880ddf6</span><br><span class="line">systemctl <span class="built_in">enable</span> ceph-volume@lvm-<span class="number">31</span>-<span class="number">38657557</span>-<span class="number">5</span>ce3-<span class="number">43</span>a1-<span class="number">861</span>a<span class="operator">-e</span>690c880ddf6</span><br></pre></td></tr></tbody></table>

检查下挂载  

<table><tbody><tr><td class="code"><pre><span class="line">[root@node1 ~]<span class="comment"># df -h|grep osd|grep 31</span></span><br><span class="line">tmpfs                     <span class="number">48</span>G   <span class="number">24</span>K   <span class="number">48</span>G   <span class="number">1</span>% /var/lib/ceph/osd/ceph-<span class="number">31</span></span><br></pre></td></tr></tbody></table>

可以看到挂载的操作是通过下面这个命令进行挂载的，然后enable下就是自启动了  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl start ceph-volume@lvm-osdid-osdfsid</span><br></pre></td></tr></tbody></table>

### 做自启动osd

启动osd  

<table><tbody><tr><td class="code"><pre><span class="line">[root@node1 ~]<span class="comment"># systemctl start ceph-osd@31</span></span><br><span class="line">[root@node1 ~]<span class="comment"># systemctl enable ceph-osd@31</span></span><br><span class="line">Created symlink from /etc/systemd/system/ceph-osd.target.wants/ceph-osd@<span class="number">31</span>.service to /usr/lib/systemd/system/ceph-osd@.service.</span><br></pre></td></tr></tbody></table>

### 检查启动情况

<table><tbody><tr><td class="code"><pre><span class="line">[root@node1 ~]<span class="comment"># ps -ef|grep osd|grep 31</span></span><br><span class="line">ceph       <span class="number">31177</span>       <span class="number">1</span>  <span class="number">1</span> <span class="number">10</span>:<span class="number">42</span> ?        <span class="number">00</span>:<span class="number">00</span>:<span class="number">02</span> /usr/bin/ceph-osd <span class="operator">-f</span> --cluster ceph --id <span class="number">31</span> --setuser ceph --setgroup ceph</span><br></pre></td></tr></tbody></table>

那么自挂载，自启动的过程就是上面的操作

## 脚本处理整机的osd

如果觉得一个个去查询太麻烦了，那就准备脚本就好了  
创建startosd.sh脚本写入下面的内容  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="shebang">#! /usr/bin/bash</span></span><br><span class="line"><span class="comment"># @Author:momo</span></span><br><span class="line"><span class="comment"># @Time: 2019/9/4 11:05</span></span><br><span class="line">vgscan</span><br><span class="line">pvscan</span><br><span class="line">lvscan</span><br><span class="line">osddump=`ceph osd dump`</span><br><span class="line"></span><br><span class="line"><span class="keyword">for</span> osdfsid <span class="keyword">in</span> `lvdisplay |grep <span class="string">"LV Path"</span>|grep ceph|awk <span class="string">'{print $3}'</span>|cut <span class="operator">-d</span> <span class="string">"/"</span> <span class="operator">-f</span> <span class="number">4</span>|cut <span class="operator">-d</span> - <span class="operator">-f</span> <span class="number">3</span>-<span class="number">7</span>`</span><br><span class="line"><span class="keyword">do</span></span><br><span class="line">    osdid=`<span class="built_in">echo</span> <span class="string">"<span class="variable">${osddump}</span>"</span>|grep <span class="variable">$osdfsid</span>|awk <span class="string">'{print $1}'</span>|cut <span class="operator">-d</span> . <span class="operator">-f</span> <span class="number">2</span>`</span><br><span class="line">    <span class="built_in">echo</span> <span class="string">"start <span class="variable">$osdid</span>  with fsid <span class="variable">$osdfsid</span>"</span></span><br><span class="line">    <span class="comment"># auto mount</span></span><br><span class="line">    systemctl start ceph-volume@lvm-<span class="variable">$osdid</span>-<span class="variable">$osdfsid</span></span><br><span class="line">    systemctl <span class="built_in">enable</span> ceph-volume@lvm-<span class="variable">$osdid</span>-<span class="variable">$osdfsid</span></span><br><span class="line">    <span class="comment"># auto start </span></span><br><span class="line">    systemctl start ceph-osd@<span class="variable">$osdid</span></span><br><span class="line">    systemctl <span class="built_in">enable</span> ceph-osd@<span class="variable">$osdid</span></span><br><span class="line"><span class="keyword">done</span></span><br></pre></td></tr></tbody></table>

## 总结

本篇是因为做对比测试，不想重搭集群，把36盘位的磁盘全部换一个平台测试，想直接启动起来测试，然后就有了这篇文章记录，在filestore下面的处理逻辑比较简单，可以用fstab，可以用trigger，可以用mount tmp检查后手动挂载，方式很多，从Jewel版本开始启动相关的都慢慢集成到数据本身，用服务去控制了

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-09-04 |

Source: zphj1987@gmail ([bluestore的osd自启动](http://www.zphj1987.com/2019/09/04/bluestore-osd-auto-start/))
