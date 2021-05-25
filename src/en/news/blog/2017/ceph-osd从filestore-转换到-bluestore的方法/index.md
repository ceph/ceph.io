---
title: "Ceph OSD从filestore 转换到 bluestore的方法"
date: "2017-05-03"
author: "admin"
tags: 
  - "planet"
---

  
![myceph](images/blueprint.png)  

## 前言

前段时间看到[豪迈的公众号](https://mp.weixin.qq.com/s?__biz=MzI0NDE0NjUxMQ==&mid=2651256389&idx=1&sn=e11edcce5722853f442b9a7b8211787e&chksm=f2901e65c5e79773c7690f29e35dbd1870a5bfdb92c70541979f5d080d6580e3af9ba85fff66&mpshare=1&scene=23&srcid=0502SazrSPsWnszP3xfdEId4#rd)上提到了这个离线转换工具，最近看到群里有人问，找了下没什么相关文档，就自己写了一个，供参考  

## 实践步骤

### 获取代码并安装

<table><tbody><tr><td class="code"><pre><span class="line">git <span class="built_in">clone</span> https://github.com/ceph/ceph.git</span><br><span class="line"><span class="built_in">cd</span> ceph</span><br><span class="line">git submodule update --init --recursive</span><br><span class="line">./make-dist</span><br><span class="line">rpm -bb ceph.spec</span><br></pre></td></tr></tbody></table>

生成rpm安装包后进行安装,这个过程就不讲太多，根据各种文档安装上最新的版本即可，这个代码合进去时间并不久，大概是上个月才合进去的

### 配置集群

首先配置一个filestore的集群，这个也是很简单的，我的环境配置一个单主机三个OSD的集群  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph -s</span></span><br><span class="line">    cluster <span class="number">3</span>daaf51a-eeba-<span class="number">43</span>a6-<span class="number">9</span>f58-c26c5796f928</span><br><span class="line">     health HEALTH_WARN</span><br><span class="line">            mon.lab8106 low disk space</span><br><span class="line">     monmap e2: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">4</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">        mgr active: lab8106 </span><br><span class="line">     osdmap e16: <span class="number">3</span> osds: <span class="number">3</span> up, <span class="number">3</span> <span class="keyword">in</span></span><br><span class="line">      pgmap v34: <span class="number">64</span> pgs, <span class="number">1</span> pools, <span class="number">0</span> bytes data, <span class="number">0</span> objects</span><br><span class="line">            <span class="number">323</span> MB used, <span class="number">822</span> GB / <span class="number">822</span> GB avail</span><br><span class="line">                  <span class="number">64</span> active+clean</span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd tree</span></span><br><span class="line">ID WEIGHT  TYPE NAME        UP/DOWN REWEIGHT PRIMARY-AFFINITY </span><br><span class="line">-<span class="number">1</span> <span class="number">0.80338</span> root default                                       </span><br><span class="line">-<span class="number">2</span> <span class="number">0.80338</span>     host lab8106                                   </span><br><span class="line"> <span class="number">0</span> <span class="number">0.26779</span>         osd.<span class="number">0</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">1</span> <span class="number">0.26779</span>         osd.<span class="number">1</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">2</span> <span class="number">0.26779</span>         osd.<span class="number">2</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span></span><br></pre></td></tr></tbody></table>

### 写入少量数据

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rados -p rbd bench 10 write --no-cleanup</span></span><br></pre></td></tr></tbody></table>

### 设置noout

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph osd set noout</span></span><br><span class="line">noout is <span class="built_in">set</span></span><br></pre></td></tr></tbody></table>

### 停止OSD.0

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># systemctl stop ceph-osd@0</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># ceph osd down 0</span></span><br><span class="line">osd.<span class="number">0</span> is already down.</span><br></pre></td></tr></tbody></table>

将数据换个目录挂载，换个新盘挂载到原路径  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># mkdir /var/lib/ceph/osd/ceph-0.old/</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># umount /var/lib/ceph/osd/ceph-0</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># mount /dev/sdb1 /var/lib/ceph/osd/ceph-0.old/</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># mount /dev/sde1 /var/lib/ceph/osd/ceph-0/</span></span><br><span class="line"></span><br><span class="line">[root@lab8106 ~]<span class="comment"># df -h|grep osd</span></span><br><span class="line">/dev/sdc1       <span class="number">275</span>G  <span class="number">833</span>M  <span class="number">274</span>G   <span class="number">1</span>% /var/lib/ceph/osd/ceph-<span class="number">1</span></span><br><span class="line">/dev/sdd1       <span class="number">275</span>G  <span class="number">833</span>M  <span class="number">274</span>G   <span class="number">1</span>% /var/lib/ceph/osd/ceph-<span class="number">2</span></span><br><span class="line">/dev/sdb1       <span class="number">275</span>G  <span class="number">759</span>M  <span class="number">274</span>G   <span class="number">1</span>% /var/lib/ceph/osd/ceph-<span class="number">0</span>.old</span><br><span class="line">/dev/sde1       <span class="number">280</span>G   <span class="number">33</span>M  <span class="number">280</span>G   <span class="number">1</span>% /var/lib/ceph/osd/ceph-<span class="number">0</span></span><br></pre></td></tr></tbody></table>

在配置文件/etc/ceph/ceph.conf中添加  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">enable</span>_experimental_unrecoverable_data_corrupting_features = bluestore</span><br></pre></td></tr></tbody></table>

如果需要指定osd的block的路径需要写配置文件  
在做`ceph-objectstore-tool --type bluestore --data-path --op mkfs`这个操作之前，在配置文件的全局里面添加上

> bluestore\_block\_path = /dev/sde2

然后再创建的时候就可以是链接到设备了，这个地方写全局变量，然后创建完了后就删除掉这项配置文件，写单独的配置文件的时候发现没读取成功,生成后应该是这样的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ll /var/lib/ceph/osd/ceph-0</span></span><br><span class="line">total <span class="number">20</span></span><br><span class="line">lrwxrwxrwx <span class="number">1</span> root root  <span class="number">9</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">40</span> block -&gt; /dev/sde2</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root  <span class="number">2</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">40</span> bluefs</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root <span class="number">37</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">40</span> fsid</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root  <span class="number">8</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">40</span> kv_backend</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root  <span class="number">4</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">40</span> mkfs_<span class="keyword">done</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root <span class="number">10</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">40</span> <span class="built_in">type</span></span><br></pre></td></tr></tbody></table>

如果不增加这个就是以文件形式的存在

### 获取osd.0的fsid

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># cat /var/lib/ceph/osd/ceph-0.old/fsid </span></span><br><span class="line">b2f73450-<span class="number">5</span>c4a-<span class="number">45</span>fb-<span class="number">9</span>c24-<span class="number">8218</span>a5803434</span><br></pre></td></tr></tbody></table>

### 创建一个bluestore的osd.0

<table><tbody><tr><td class="code"><pre><span class="line"><span class="title">[</span><span class="comment">root@lab8106</span> <span class="comment">~</span><span class="title">]</span><span class="comment">#</span> <span class="comment">ceph</span><span class="literal">-</span><span class="comment">objectstore</span><span class="literal">-</span><span class="comment">tool</span> <span class="literal">-</span><span class="literal">-</span><span class="comment">type</span> <span class="comment">bluestore</span> <span class="literal">-</span><span class="literal">-</span><span class="comment">data</span><span class="literal">-</span><span class="comment">path</span> <span class="comment">/var/lib/ceph/osd/ceph</span><span class="literal">-</span><span class="comment">0</span> <span class="literal">-</span><span class="literal">-</span><span class="comment">fsid</span> <span class="comment">b2f73450</span><span class="literal">-</span><span class="comment">5c4a</span><span class="literal">-</span><span class="comment">45fb</span><span class="literal">-</span><span class="comment">9c24</span><span class="literal">-</span><span class="comment">8218a5803434</span> <span class="literal">-</span><span class="literal">-</span><span class="comment">op</span> <span class="comment">mkfs</span></span><br></pre></td></tr></tbody></table>

### 转移数据

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph-objectstore-tool --data-path /var/lib/ceph/osd/ceph-0.old --target-data-path /var/lib/ceph/osd/ceph-0 --op dup</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># chown -R ceph:ceph /var/lib/ceph/osd/ceph-0</span></span><br></pre></td></tr></tbody></table>

这个操作是将之前的filestore的数据转移到新的bluestore上了

### 启动OSD.0

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 osd]<span class="comment"># systemctl restart ceph-osd@0</span></span><br></pre></td></tr></tbody></table>

检查状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 osd]<span class="comment"># ceph -s</span></span><br><span class="line"><span class="number">2017</span>-<span class="number">05</span>-<span class="number">03</span> <span class="number">17</span>:<span class="number">05</span>:<span class="number">13.119492</span> <span class="number">7</span>f20a501b700 -<span class="number">1</span> WARNING: the following dangerous and experimental features are enabled: bluestore</span><br><span class="line"><span class="number">2017</span>-<span class="number">05</span>-<span class="number">03</span> <span class="number">17</span>:<span class="number">05</span>:<span class="number">13.150181</span> <span class="number">7</span>f20a501b700 -<span class="number">1</span> WARNING: the following dangerous and experimental features are enabled: bluestore</span><br><span class="line">    cluster <span class="number">3</span>daaf51a-eeba-<span class="number">43</span>a6-<span class="number">9</span>f58-c26c5796f928</span><br><span class="line">     health HEALTH_WARN</span><br><span class="line">            noout flag(s) <span class="built_in">set</span></span><br><span class="line">            mon.lab8106 low disk space</span><br><span class="line">     monmap e2: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">4</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">        mgr active: lab8106 </span><br><span class="line">     osdmap e25: <span class="number">3</span> osds: <span class="number">3</span> up, <span class="number">3</span> <span class="keyword">in</span></span><br><span class="line">            flags noout</span><br><span class="line">      pgmap v80: <span class="number">64</span> pgs, <span class="number">1</span> pools, <span class="number">724</span> MB data, <span class="number">182</span> objects</span><br><span class="line">            <span class="number">3431</span> MB used, <span class="number">555</span> GB / <span class="number">558</span> GB avail</span><br><span class="line">                  <span class="number">64</span> active+clean</span><br></pre></td></tr></tbody></table>

成功转移

### 不同的block方式

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ll /var/lib/ceph/osd/ceph-0/ -al|grep block</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph <span class="number">10737418240</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">32</span> block</span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ll /var/lib/ceph/osd/ceph-4/ -al|grep block</span></span><br><span class="line">lrwxrwxrwx  <span class="number">1</span> ceph ceph  <span class="number">58</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">16</span> block -&gt; /dev/disk/by-partuuid/<span class="number">846</span>e93a2-<span class="number">0</span>f6d-<span class="number">47</span>d4-<span class="number">8</span>a90-<span class="number">85</span>ab3cf4ec4e</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph  <span class="number">37</span> May  <span class="number">3</span> <span class="number">17</span>:<span class="number">16</span> block_uuid</span><br></pre></td></tr></tbody></table>

可以看到直接创建的时候的block是以链接的方式链接到一个分区的，而不改配置文件的转移的方式里面是一个文件的形式，根据需要进行选择

## 总结

转移工具的出现方便了以后从filestore到bluestore的转移，可以采取一个个osd的转移方式将整个集群进行转移，而免去了剔除osd，再添加的方式，减少了迁移量，可以一个个的离线进行操作

ceph的工具集越来越完整了

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-05-03 |

Source: zphj1987@gmail ([Ceph OSD从filestore 转换到 bluestore的方法](http://www.zphj1987.com/2017/05/03/Ceph-filestore-to-bluestore/))
