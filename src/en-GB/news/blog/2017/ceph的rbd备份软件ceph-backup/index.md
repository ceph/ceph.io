---
title: "ceph的rbd备份软件ceph-backup"
date: "2017-01-19"
author: "admin"
tags: 
  - "planet"
---

  
![](images/backupmp.png)  

teralytics是一家国外的大数据公司，这个是他们开源的ceph的备份的工具，在twitter上搜索相关信息的时候看到，觉得不错就拿来试用一番

## 这是个什么软件

一个用来备份ceph的RBD的image的开源软件，提供了两种模式  
增量：在给定备份时间窗口内基于rbd快照的增量备份  
完全：完整映像导出时不包含快照

> 注意一致性：此工具可以生成rbd图像的快照，而不会感知到它们的文件系统的状态，注意下rbd快照的一致性限制（[http://docs.ceph.com/docs/hammer/rbd/rbd-snapshot/）由于“完全”模式不使用快照，“完全”模式下的实时映像备份不一致（“增量”模式始终使用快照）](http://docs.ceph.com/docs/hammer/rbd/rbd-snapshot/）由于“完全”模式不使用快照，“完全”模式下的实时映像备份不一致（“增量”模式始终使用快照）)

超过时间窗口以后，会进行一次全量备份，并且把之前的快照进行删除掉，重新备份一次全量，并且基于这个时间计算是否需要删除备份的文件

软件包含以下功能：

- 支持存储池和多image的只对
- 支持自定义备份目标路径
- 配置文件支持
- 支持备份窗口设置
- 支持压缩选项
- 支持增量和全量备份的配置
    
    ## 编译安装
    
    <table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment">#git clone https://github.com/teralytics/ceph-backup.git</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># cd ceph-backup</span></span><br><span class="line">[root@lab8106 ceph-backup]<span class="comment"># python setup.py install</span></span><br></pre></td></tr></tbody></table>
    

安装过程中会下载一些东西，注意要有网络，需要等待一会

## 准备配置文件

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph-backup]<span class="comment"># mkdir /etc/cephbackup/</span></span><br><span class="line">[root@lab8106 ceph-backup]<span class="comment"># cp ceph-backup.cfg /etc/cephbackup/cephbackup.conf</span></span><br></pre></td></tr></tbody></table>

我的配置文件如下，备份rbd存储的zp的镜像，支持多image，images后面用逗号隔开就可以  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># cat /etc/cephbackup/cephbackup.conf </span></span><br><span class="line">[rbd]</span><br><span class="line">window size = <span class="number">7</span></span><br><span class="line">window unit = days</span><br><span class="line">destination directory = /tmp/</span><br><span class="line">images = zp</span><br><span class="line">compress = yes</span><br><span class="line">ceph config = /etc/ceph/ceph.conf</span><br><span class="line">backup mode = full</span><br><span class="line">check mode = no</span><br></pre></td></tr></tbody></table>

## 开始备份

### 全量备份配置

上面的配置文件已经写好了，直接执行备份命令就可以了  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># cephbackup</span></span><br><span class="line">Starting backup <span class="keyword">for</span> pool rbd</span><br><span class="line">Full ceph backup</span><br><span class="line">Images to backup:</span><br><span class="line">	rbd/zp</span><br><span class="line">Backup folder: /tmp/</span><br><span class="line">Compression: True</span><br><span class="line">Check mode: False</span><br><span class="line">Taking full backup of images: zp</span><br><span class="line">rbd image <span class="string">'zp'</span>:</span><br><span class="line">	size <span class="number">40960</span> MB <span class="keyword">in</span> <span class="number">10240</span> objects</span><br><span class="line">	order <span class="number">22</span> (<span class="number">4096</span> kB objects)</span><br><span class="line">	block_name_prefix: rbd_data.<span class="number">25496</span>b8b4567</span><br><span class="line">	format: <span class="number">2</span></span><br><span class="line">	features: layering</span><br><span class="line">	flags: </span><br><span class="line">Exporting image zp to /tmp/rbd/zp/zp_UTC20170119T092933.full</span><br><span class="line">Compress mode activated</span><br><span class="line"><span class="comment"># rbd export rbd/zp /tmp/rbd/zp/zp_UTC20170119T092933.full</span></span><br><span class="line">Exporting image: <span class="number">100</span>% complete...done.</span><br><span class="line"><span class="comment"># tar Scvfz /tmp/rbd/zp/zp_UTC20170119T092933.full.tar.gz /tmp/rbd/zp/zp_UTC20170119T092933.full</span></span><br><span class="line">tar: Removing leading `/<span class="string">' from member names</span></span><br></pre></td></tr></tbody></table>

压缩的如果开了，正好文件也是稀疏文件的话，需要等很久，压缩的效果很好，dd生成的文件可以压缩到很小

检查备份生成的文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ll /tmp/rbd/zp/zp_UTC20170119T092933.full*</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root <span class="number">42949672960</span> Jan <span class="number">19</span> <span class="number">17</span>:<span class="number">29</span> /tmp/rbd/zp/zp_UTC20170119T092933.full</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root           <span class="number">0</span> Jan <span class="number">19</span> <span class="number">17</span>:<span class="number">29</span> /tmp/rbd/zp/zp_UTC20170119T092933.full.tar.gz</span><br></pre></td></tr></tbody></table>

#### 全量备份的还原

<table><tbody><tr><td class="code"><pre><span class="line">rbd import /tmp/rbd/zp/zp_UTC20170119T092933.full zpbk</span><br></pre></td></tr></tbody></table>

检查数据，没有问题

### 增量备份配置

写下增量配置的文件，修改下备份模式的选项  

<table><tbody><tr><td class="code"><pre><span class="line">[rbd]</span><br><span class="line">window size = <span class="number">7</span></span><br><span class="line">window unit = day</span><br><span class="line">destination directory = /tmp/</span><br><span class="line">images = zp</span><br><span class="line">compress = yes</span><br><span class="line">ceph config = /etc/ceph/ceph.conf</span><br><span class="line">backup mode = incremental</span><br><span class="line">check mode = no</span><br></pre></td></tr></tbody></table>

执行多次进行增量备份以后是这样的  

<table><tbody><tr><td class="code"><pre><span class="line"> [root@lab8106 ~]<span class="comment">#ll  /tmp/rbd/zpbk/</span></span><br><span class="line">total <span class="number">146452</span></span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root <span class="number">42949672960</span> Jan <span class="number">19</span> <span class="number">18</span>:<span class="number">04</span> zpbk@UTC20170119T100339.full</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root       <span class="number">66150</span> Jan <span class="number">19</span> <span class="number">18</span>:<span class="number">05</span> zpbk@UTC20170119T100546.diff_from_UTC20170119T100339</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root          <span class="number">68</span> Jan <span class="number">19</span> <span class="number">18</span>:<span class="number">05</span> zpbk@UTC20170119T100550.diff_from_UTC20170119T100546</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root          <span class="number">68</span> Jan <span class="number">19</span> <span class="number">18</span>:<span class="number">06</span> zpbk@UTC20170119T100606.diff_from_UTC20170119T100550</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root root          <span class="number">68</span> Jan <span class="number">19</span> <span class="number">18</span>:<span class="number">06</span> zpbk@UTC20170119T100638.diff_from_UTC20170119T100606</span><br></pre></td></tr></tbody></table>

#### 增量备份的还原

分成多个步骤进行  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">1</span>、进行全量的恢复</span><br><span class="line"><span class="comment"># rbd import config@UTC20161130T170848.full dest_image</span></span><br><span class="line"><span class="number">2</span>、重新创建基础快照</span><br><span class="line"><span class="comment"># rbd snap create dest_image@UTC20161130T170848</span></span><br><span class="line"><span class="number">3</span>、还原增量的快照(多次执行)</span><br><span class="line"><span class="comment"># rbd import-diff config@UTC20161130T170929.diff_from_UTC20161130T170848 dest_image</span></span><br></pre></td></tr></tbody></table>

本测试用例还原步骤就是  

<table><tbody><tr><td class="code"><pre><span class="line">rbd  import zpbk@UTC20170119T100339.full zpnew</span><br><span class="line">rbd snap create zpnew@UTC20170119T100339</span><br><span class="line">rbd import-diff zpbk@UTC20170119T100546.diff_from_UTC20170119T100339  zpnew</span><br><span class="line">rbd import-diff zpbk@UTC20170119T100550.diff_from_UTC20170119T100546  zpnew</span><br><span class="line">rbd import-diff zpbk@UTC20170119T100606.diff_from_UTC20170119T100550  zpnew</span><br><span class="line">rbd import-diff zpbk@UTC20170119T100638.diff_from_UTC20170119T100606  zpnew</span><br></pre></td></tr></tbody></table>

检查数据，没有问题

## 总结

这个软件基于python的实现，可以说作者的实现逻辑是很清晰的，并且提供了配置文件的方式，基本上是各个细节都考虑的比较到位，很容易上手，可以直接拿来使用，或者集成到自己的平台中去，是一个很好的软件

## 相关链接

[rbd的增量备份和恢复](http://www.zphj1987.com/2016/06/22/rbd%E7%9A%84%E5%A2%9E%E9%87%8F%E5%A4%87%E4%BB%BD%E5%92%8C%E6%81%A2%E5%A4%8D/)  
[ceph-backup的github](https://github.com/teralytics/ceph-backup)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-01-19 |

Source: zphj1987@gmail ([ceph的rbd备份软件ceph-backup](http://www.zphj1987.com/2017/01/19/ceph-rbd-ceph-backup/))
