---
title: "cephfs元数据池故障的恢复"
date: "2018-05-29"
author: "admin"
tags: 
  - "planet"
---

## 前言

cephfs 在L版本已经比较稳定了，这个稳定的意义个人觉得是在其故障恢复方面的成熟，一个文件系统可恢复是其稳定必须具备的属性，本篇就是根据官网的文档来实践下这个恢复的过程

## 实践过程

### 部署一个ceph Luminous集群

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph -v</span></span><br><span class="line">ceph version <span class="number">12.2</span>.<span class="number">5</span> (cad919881333ac92274171586c827e01f554a70a) luminous (stable)</span><br></pre></td></tr></tbody></table>

创建filestore  

<table><tbody><tr><td class="code"><pre><span class="line">ceph-deploy osd create  lab102  --filestore  --data /dev/sdb1  --journal /dev/sdb2</span><br></pre></td></tr></tbody></table>

这里想用filestore进行测试就按上面的方法去创建osd即可

传入测试数据

- doc
- pic
- vidio  
    这里提供下载链接

> 链接：[https://pan.baidu.com/s/19tlFi4butA2WjnPAdNEMwg](https://pan.baidu.com/s/19tlFi4butA2WjnPAdNEMwg) 密码：ugjo

这个是网上下载的模板的数据，方便进行真实的文件的模拟，dd产生的是空文件，有的时候会影响到测试

需要更多的测试文档推荐可以从下面网站下载

视频下载：

> [https://videos.pexels.com/popular-videos](https://videos.pexels.com/popular-videos)

图片下载：

> [https://www.pexels.com/](https://www.pexels.com/)

文档下载：

> [http://office.mmais.com.cn/Template/Home.shtml](http://office.mmais.com.cn/Template/Home.shtml)

### 元数据模拟故障

跟元数据相关的故障无非就是mds无法启动，或者元数据pg损坏了，这里我们模拟的比较极端的情况，把metadata的元数据对象全部清空掉，这个基本能覆盖到最严重的故障了，数据的损坏不在元数据损坏的范畴

清空元数据存储池  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="keyword">for</span> object <span class="keyword">in</span> `rados -p metadata ls`;<span class="keyword">do</span> rados -p metadata rm <span class="variable">$object</span>;<span class="keyword">done</span></span><br></pre></td></tr></tbody></table>

重启下mds进程，应该mds是无法恢复正常的  

<table><tbody><tr><td class="code"><pre><span class="line">cluster:</span><br><span class="line">    id:     <span class="number">9</span>ec7768a-<span class="number">5</span>e7c-<span class="number">4</span>f8e-<span class="number">8</span>a85-<span class="number">89895</span>e338cca</span><br><span class="line">    health: HEALTH_ERR</span><br><span class="line">            <span class="number">1</span> filesystem is degraded</span><br><span class="line">            <span class="number">1</span> mds daemon damaged</span><br><span class="line">            too few PGs per OSD (<span class="number">16</span> &lt; min <span class="number">30</span>)</span><br><span class="line"> </span><br><span class="line">  services:</span><br><span class="line">    mon: <span class="number">1</span> daemons, quorum lab102</span><br><span class="line">    mgr: lab102(active)</span><br><span class="line">    mds: ceph-<span class="number">0</span>/<span class="number">1</span>/<span class="number">1</span> up , <span class="number">1</span> up:standby, <span class="number">1</span> damaged</span><br><span class="line">    osd: <span class="number">1</span> osds: <span class="number">1</span> up, <span class="number">1</span> <span class="keyword">in</span></span><br></pre></td></tr></tbody></table>

准备开始我们的修复过程

### 元数据故障恢复

设置允许多文件系统  

<table><tbody><tr><td class="code"><pre><span class="line">ceph fs flag <span class="built_in">set</span> <span class="built_in">enable</span>_multiple <span class="literal">true</span> --yes-i-really-mean-it</span><br></pre></td></tr></tbody></table>

创建一个新的元数据池，这里是为了不去动原来的metadata的数据，以免损坏原来的元数据  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd pool create recovery <span class="number">8</span></span><br></pre></td></tr></tbody></table>

将老的存储池data和新的元数据池recovery关联起来并且创建一个新的recovery-fs  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph fs new recovery-fs recovery data --allow-dangerous-metadata-overlay</span></span><br><span class="line">new fs with metadata pool <span class="number">3</span> and data pool <span class="number">2</span></span><br></pre></td></tr></tbody></table>

做下新的文件系统的初始化相关工作  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment">#cephfs-data-scan init --force-init --filesystem recovery-fs --alternate-pool recovery</span></span><br></pre></td></tr></tbody></table>

reset下新的fs  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment">#ceph fs reset recovery-fs --yes-i-really-mean-it</span></span><br><span class="line">[root@lab102 ~]<span class="comment">#cephfs-table-tool recovery-fs:all reset session</span></span><br><span class="line">[root@lab102 ~]<span class="comment">#cephfs-table-tool recovery-fs:all reset snap</span></span><br><span class="line">[root@lab102 ~]<span class="comment">#cephfs-table-tool recovery-fs:all reset inode</span></span><br></pre></td></tr></tbody></table>

做相关的恢复  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># cephfs-data-scan scan_extents --force-pool --alternate-pool recovery --filesystem ceph  data</span></span><br><span class="line">[root@lab102 ~]<span class="comment"># cephfs-data-scan scan_inodes --alternate-pool recovery --filesystem ceph --force-corrupt --force-init data</span></span><br><span class="line">[root@lab102 ~]<span class="comment"># cephfs-data-scan scan_links --filesystem recovery-fs</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># systemctl start ceph-mds@lab102</span></span><br><span class="line">等待mds active 以后再继续下面操作</span><br><span class="line">[root@lab102 ~]<span class="comment"># ceph daemon mds.lab102 scrub_path / recursive repair</span></span><br></pre></td></tr></tbody></table>

设置成默认的fs  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph fs set-default recovery-fs</span></span><br></pre></td></tr></tbody></table>

挂载检查数据  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment">#  mount -t ceph 192.168.19.102:/ /mnt</span></span><br><span class="line">[root@lab102 ~]<span class="comment"># ll /mnt</span></span><br><span class="line">total <span class="number">0</span></span><br><span class="line">drwxr-xr-x <span class="number">1</span> root root <span class="number">1</span> Jan  <span class="number">1</span>  <span class="number">1970</span> lost+found</span><br><span class="line">[root@lab102 ~]<span class="comment"># ll /mnt/lost+found/</span></span><br><span class="line">total <span class="number">226986</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root   <span class="number">569306</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000001</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root <span class="number">16240627</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000002</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root  <span class="number">1356367</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000003</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root   <span class="number">137729</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000004</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root   <span class="number">155163</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000005</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root   <span class="number">118909</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000006</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root  <span class="number">1587656</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000007</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root   <span class="number">252705</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000008</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root  <span class="number">1825192</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000009</span></span><br><span class="line">-r-x------ <span class="number">1</span> root root   <span class="number">156990</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">1000000000</span>a</span><br><span class="line">-r-x------ <span class="number">1</span> root root  <span class="number">3493435</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">1000000000</span>b</span><br><span class="line">-r-x------ <span class="number">1</span> root root   <span class="number">342390</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">1000000000</span>c</span><br><span class="line">-r-x------ <span class="number">1</span> root root  <span class="number">1172247</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">1000000000</span>d</span><br><span class="line">-r-x------ <span class="number">1</span> root root  <span class="number">2516169</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">1000000000</span>e</span><br><span class="line">-r-x------ <span class="number">1</span> root root  <span class="number">3218770</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">1000000000</span>f</span><br><span class="line">-r-x------ <span class="number">1</span> root root   <span class="number">592729</span> May <span class="number">25</span> <span class="number">16</span>:<span class="number">16</span> <span class="number">10000000010</span></span><br></pre></td></tr></tbody></table>

可以看到在lost+found里面就有数据了  

<table><tbody><tr><td class="code"><pre><span class="line">[root<span class="annotation">@lab</span>102 ~]# file <span class="regexp">/mnt/</span>lost+found/<span class="number">10000000010</span> </span><br><span class="line"><span class="regexp">/mnt/</span>lost+found/<span class="number">10000000010</span>: Microsoft PowerPoint <span class="number">2007</span>+</span><br><span class="line">[root<span class="annotation">@lab</span>102 ~]# file <span class="regexp">/mnt/</span>lost+found/<span class="number">10000000011</span></span><br><span class="line"><span class="regexp">/mnt/</span>lost+found/<span class="number">10000000011</span>: Microsoft Word <span class="number">2007</span>+</span><br><span class="line">[root<span class="annotation">@lab</span>102 ~]# file <span class="regexp">/mnt/</span>lost+found/<span class="number">10000000012</span></span><br><span class="line"><span class="regexp">/mnt/</span>lost+found/<span class="number">10000000012</span>: Microsoft Word <span class="number">2007</span>+</span><br><span class="line">[root<span class="annotation">@lab</span>102 ~]# file <span class="regexp">/mnt/</span>lost+found/<span class="number">10000000013</span></span><br><span class="line"><span class="regexp">/mnt/</span>lost+found/<span class="number">10000000013</span>: Microsoft PowerPoint <span class="number">2007</span>+</span><br></pre></td></tr></tbody></table>

这个生成的文件名称就是实际文件存储的数据的prifix，也就是通过原始inode进行的运算得到的

如果提前备份好了原始的元数据信息  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph daemon mds.lab102 dump cache &gt; /tmp/mdscache</span></span><br></pre></td></tr></tbody></table>

那么可以比较轻松的找到丢失的文件

## 总结

在我另外一篇文章当中已经写过了，通过文件的inode可以把文件跟后台的对象结合起来，在以前我的恢复的思路是，把后台的对象全部抓出来，然后自己手动去对对象进行拼接，实际是数据存在的情况下，反向把文件重新link到一个路径，这个是官方提供的的恢复方法，mds最大的担心就是mds自身的元数据的损坏可能引起整个文件系统的崩溃，而现在，基本上只要data的数据还在的话，就不用担心数据丢掉，即使文件路径信息没有了，但是文件还在

通过备份mds cache可以把文件名称，路径，大小和inode关联起来，而恢复的数据是对象前缀，也就是备份好了mds cache 就可以把整个文件信息串联起来了

虽然cephfs的故障不是常发生，但是万一呢

后续准备带来一篇关于cephfs从挂载点误删除数据后的数据恢复的方案，这个目前已经进行了少量文件的恢复试验了，等后续进行大量文件删除的恢复后，再进行分享

## 参考文档

[disaster-recovery](http://docs.ceph.com/docs/luminous/cephfs/disaster-recovery/)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-05-29 |

Source: zphj1987@gmail ([cephfs元数据池故障的恢复](http://www.zphj1987.com/2018/05/29/cephfs-metadatapool-disaster-recover/))
