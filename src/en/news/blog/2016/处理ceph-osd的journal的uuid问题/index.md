---
title: "处理Ceph osd的journal的uuid问题"
date: "2016-12-26"
author: "admin"
tags: 
  - "planet"
---

  
![write](images/writefor.jpg)  

一、前言  
之前有一篇文章介绍的是，在centos7的jewel下面如果自己做的分区如何处理自动挂载的问题，当时的环境对journal的地方采取的是文件的形式处理的，这样就没有了重启后journal的磁盘偏移的问题  
  
如果采用的是ceph自带的deploy去做分区的处理的时候，是调用的sgdisk去对磁盘做了一些处理的，然后deploy能够识别一些特殊的标记，然后去做了一些其他的工作，而自己分区的时候，是没有做这些标记的这样就可能会有其他的问题

我们看下如何在部署的时候就处理好journal的uuid的问题

### 二、实践

#### 2.1 按常规流程部署OSD

准备测试的自分区磁盘  

<table><tbody><tr><td class="code"><pre><span class="line">dd <span class="keyword">if</span>=/dev/zero of=/dev/sde bs=<span class="number">4</span>M count=<span class="number">100</span>;</span><br><span class="line">dd <span class="keyword">if</span>=/dev/zero of=/dev/sdf bs=<span class="number">4</span>M count=<span class="number">100</span>; parted /dev/sde mklabel gpt;</span><br><span class="line">parted /dev/sdf mklabel gpt;</span><br><span class="line">parted /dev/sde mkpart primary <span class="number">1</span> <span class="number">100</span>%;</span><br><span class="line">parted /dev/sdf mkpart primary <span class="number">1</span> <span class="number">100</span>%</span><br></pre></td></tr></tbody></table>

使用的sde1作为数据盘，使用sdf1作为ssd的独立分区的journal磁盘

我们线按照常规的步骤去部署下

##### 做osd的prepare操作

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph-deploy osd prepare lab8106:/dev/sde1:/dev/sdf1</span></span><br><span class="line">···</span><br><span class="line">[lab8106][WARNIN] adjust_symlink: Creating symlink /var/lib/ceph/tmp/mnt.<span class="number">7</span>HuS8k/journal -&gt; /dev/sdf1</span><br><span class="line">···</span><br></pre></td></tr></tbody></table>

##### 做osd的activate操作

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph-deploy osd activate lab8106:/dev/sde1:/dev/sdf</span></span><br><span class="line">···</span><br><span class="line">[lab8106][WARNIN] ceph_disk.main.Error: Error: [<span class="string">'ceph-osd'</span>, <span class="string">'--cluster'</span>, <span class="string">'ceph'</span>, <span class="string">'--mkfs'</span>, <span class="string">'--mkkey'</span>, <span class="string">'-i'</span>, <span class="string">'7'</span>, <span class="string">'--monmap'</span>, <span class="string">'/var/lib/ceph/tmp/mnt.yOP4gv/activate.monmap'</span>, <span class="string">'--osd-data'</span>, <span class="string">'/var/lib/ceph/tmp/mnt.yOP4gv'</span>, <span class="string">'--osd-journal'</span>, <span class="string">'/var/lib/ceph/tmp/mnt.yOP4gv/journal'</span>, <span class="string">'--osd-uuid'</span>, <span class="string">'5c59284b-8d82-4cc6-b566-8b102dc25568'</span>, <span class="string">'--keyring'</span>, <span class="string">'/var/lib/ceph/tmp/mnt.yOP4gv/keyring'</span>, <span class="string">'--setuser'</span>, <span class="string">'ceph'</span>, <span class="string">'--setgroup'</span>, <span class="string">'ceph'</span>] failed : <span class="number">2016</span>-<span class="number">12</span>-<span class="number">26</span> <span class="number">13</span>:<span class="number">11</span>:<span class="number">54.211543</span> <span class="number">7</span>f585e926800 -<span class="number">1</span> filestore(/var/lib/ceph/tmp/mnt.yOP4gv) mkjournal error creating journal on /var/lib/ceph/tmp/mnt.yOP4gv/journal: (<span class="number">13</span>) Permission denied</span><br><span class="line">[lab8106][WARNIN] <span class="number">2016</span>-<span class="number">12</span>-<span class="number">26</span> <span class="number">13</span>:<span class="number">11</span>:<span class="number">54.211564</span> <span class="number">7</span>f585e926800 -<span class="number">1</span> OSD::mkfs: ObjectStore::mkfs failed with error -<span class="number">13</span></span><br><span class="line">[lab8106][WARNIN] <span class="number">2016</span>-<span class="number">12</span>-<span class="number">26</span> <span class="number">13</span>:<span class="number">11</span>:<span class="number">54.211616</span> <span class="number">7</span>f585e926800 -<span class="number">1</span>  ** ERROR: error creating empty object store <span class="keyword">in</span> /var/lib/ceph/tmp/mnt.yOP4gv: (<span class="number">13</span>) Permission denied</span><br><span class="line">···</span><br></pre></td></tr></tbody></table>

可以看到提示的是权限不足，我们检查下权限  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># mount /dev/sde1 /mnt</span></span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ll /mnt/</span></span><br><span class="line">total <span class="number">32</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root <span class="number">193</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> activate.monmap</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph  <span class="number">37</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> ceph_fsid</span><br><span class="line">drwxr-xr-x <span class="number">3</span> ceph ceph  <span class="number">37</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> current</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph  <span class="number">37</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> fsid</span><br><span class="line">lrwxrwxrwx <span class="number">1</span> ceph ceph   <span class="number">9</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> journal -&gt; /dev/sdf1</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph  <span class="number">37</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> journal_uuid</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph  <span class="number">21</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> magic</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph   <span class="number">4</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> store_version</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph  <span class="number">53</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> superblock</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph   <span class="number">2</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> whoami</span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ll /dev/sdf1</span></span><br><span class="line">brw-rw---- <span class="number">1</span> root disk <span class="number">8</span>, <span class="number">81</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">03</span> /dev/sdf1</span><br></pre></td></tr></tbody></table>

创建sdf1的journal的时候权限有问题，我们给下磁盘权限  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># chown ceph:ceph /dev/sdf1 </span></span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ceph-deploy osd activate lab8106:/dev/sde1:/dev/sdf1</span></span><br></pre></td></tr></tbody></table>

可以看到成功了

##### 检查下osd的目录：

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ll /var/lib/ceph/osd/ceph-7</span></span><br><span class="line">total <span class="number">56</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root  <span class="number">193</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">15</span> activate.monmap</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph    <span class="number">3</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">15</span> active</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph   <span class="number">37</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> ceph_fsid</span><br><span class="line">drwxr-xr-x <span class="number">166</span> ceph ceph <span class="number">4096</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">16</span> current</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph   <span class="number">37</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> fsid</span><br><span class="line">lrwxrwxrwx   <span class="number">1</span> ceph ceph    <span class="number">9</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">11</span> journal -&gt; /dev/sdf1</span><br></pre></td></tr></tbody></table>

可以看到journal链接到了/dev/sdf1，这次的部署是成功了，但是这里就有个问题，如果下次重启的时候，sdf1不是sdf1盘符变了，那么问题就会产生了，osd可能就无法启动了

## 2.2 优化下部署流程

这里是优化后的流程，解决上面的问题的  
准备测试的自分区磁盘  

<table><tbody><tr><td class="code"><pre><span class="line">dd <span class="keyword">if</span>=/dev/zero of=/dev/sde bs=<span class="number">4</span>M count=<span class="number">100</span>;</span><br><span class="line">dd <span class="keyword">if</span>=/dev/zero of=/dev/sdf bs=<span class="number">4</span>M count=<span class="number">100</span>; </span><br><span class="line">parted /dev/sde mklabel gpt;</span><br><span class="line">parted /dev/sdf mklabel gpt;</span><br><span class="line">parted /dev/sde mkpart primary <span class="number">1</span> <span class="number">100</span>%;</span><br><span class="line">parted /dev/sdf mkpart primary <span class="number">1</span> <span class="number">100</span>%</span><br></pre></td></tr></tbody></table>

给jounral盘做一个标记(特殊标记，下面的字符串不要变动固定写法)  

<table><tbody><tr><td class="code"><pre><span class="line">/usr/sbin/sgdisk  --change-name=<span class="number">1</span>:<span class="string">'ceph journal'</span> --typecode=<span class="number">1</span>:<span class="number">45</span>b0969e-<span class="number">9</span>b03-<span class="number">4</span>f30-b4c6-b4b80ceff106  -- /dev/sdf</span><br></pre></td></tr></tbody></table>

给数据盘做一个标记(特殊标记，下面的字符串不要变动固定写法)  

<table><tbody><tr><td class="code"><pre><span class="line">/usr/sbin/sgdisk  --change-name=<span class="number">1</span>:<span class="string">'ceph data'</span> --typecode=<span class="number">1</span>:<span class="number">4</span>fbd7e29-<span class="number">9</span>d25-<span class="number">41</span>b8-afd0-<span class="number">062</span>c0ceff05d -- /dev/sde</span><br></pre></td></tr></tbody></table>

检查下当前的分区标记情况  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph-disk list</span></span><br><span class="line">/dev/sde :</span><br><span class="line"> /dev/sde1 ceph data, unprepared</span><br><span class="line">/dev/sdf :</span><br><span class="line"> /dev/sdf1 ceph journal</span><br></pre></td></tr></tbody></table>

### 做osd的prepare操作

<table><tbody><tr><td class="code"><pre><span class="line">ceph-deploy osd prepare lab8106:/dev/sde1:/dev/sdf1</span><br><span class="line">ceph-deploy osd activate lab8106:/dev/sde1:/dev/sdf1</span><br></pre></td></tr></tbody></table>

再次检查下当前的分区标记情况  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph-disk list</span></span><br><span class="line">···</span><br><span class="line">/dev/sde :</span><br><span class="line"> /dev/sde1 ceph data, active, cluster ceph, osd.<span class="number">8</span>, journal /dev/sdf1</span><br><span class="line">/dev/sdf :</span><br><span class="line"> /dev/sdf1 ceph journal, <span class="keyword">for</span> /dev/sde1</span><br></pre></td></tr></tbody></table>

##### 查看jounral的数据

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ll /var/lib/ceph/osd/ceph-8</span></span><br><span class="line">total <span class="number">56</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root  <span class="number">193</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">26</span> activate.monmap</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph    <span class="number">3</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">26</span> active</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph   <span class="number">37</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">25</span> ceph_fsid</span><br><span class="line">drwxr-xr-x <span class="number">164</span> ceph ceph <span class="number">4096</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">26</span> current</span><br><span class="line">-rw-r--r-- <span class="number">1</span> ceph ceph   <span class="number">37</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">25</span> fsid</span><br><span class="line">lrwxrwxrwx   <span class="number">1</span> ceph ceph   <span class="number">58</span> Dec <span class="number">26</span> <span class="number">13</span>:<span class="number">25</span> journal -&gt; /dev/disk/by-partuuid/<span class="built_in">cd</span>72d6e8-<span class="number">07</span>d0-<span class="number">4</span><span class="built_in">cd</span>3-<span class="number">8</span>c6b<span class="operator">-a</span>33d624cae36</span><br><span class="line">···</span><br></pre></td></tr></tbody></table>

可以看到已经正确的链接了,并且部署过程中也没有了上面的需要进行权限的处理，这个是deploy工具在中间帮做了

## 三、总结

处理的核心在于做的那两个标记，其他的就交给deploy工具自己处理就行了，如果有兴趣可以深入研究，没兴趣的话，就安装上面说的方法进行处理就行

## 六、我的公众号-磨磨谈

  
![](images/qrcode_for_gh_6998a54d68f7_430.jpg)  

Source: zphj1987@gmail ([处理Ceph osd的journal的uuid问题](http://www.zphj1987.com/2016/12/26/manage-ceph-osd-journal-uuid/))
