---
title: "mds/journal.cc: 2929: FAILED assert解决"
date: "2017-04-27"
author: "admin"
tags: 
  - "planet"
---

  
![](images/session.png)  

## 前言

在处理一个其他双活MDS无法启动环境的时候，查看mds的日志看到了这个错误mds/journal.cc: 2929: FAILED assert(mds->sessionmap.get\_version() == cmapv)，在查询资料以后，暂时得到了解决,在生产环境下还是不建议使用双活MDS  

## 处理步骤

这个是双MDS多活情况下出现的一个问题，在什么情况下出现还无法判断，目前只看到是有这个问题，并且有其他人也出现了 [issue17113](http://tracker.ceph.com/issues/17113)  
按照[disaster-recovery](http://docs.ceph.com/docs/master/cephfs/disaster-recovery/)建议的步骤做了如下处理：

### 备份下journal

<table><tbody><tr><td class="code"><pre><span class="line">cephfs-journal-tool journal <span class="built_in">export</span> backup.bin</span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">cephfs-journal-tool journal reset</span><br><span class="line">cephfs-table-tool all reset session</span><br></pre></td></tr></tbody></table>

做了上两步后环境并没有恢复,还有个下面的操作没有做，这个操作会引起数据的丢失， MDS ranks other than 0 will be ignored: as a result it is possible for this to result in data loss，所以暂缓操作  

<table><tbody><tr><td class="code"><pre><span class="line">ceph fs reset &lt;fs name&gt; --yes-i-really-mean-it</span><br></pre></td></tr></tbody></table>

再次启动后还是，看到日志提示的是sessionmap的问题，正常情况下这个地方重置了session应该是可以好的

Yan, Zheng 2014年的时候在[邮件列表](https://www.mail-archive.com/ceph-devel@vger.kernel.org/msg18629.html)里面提过一个配置  

<table><tbody><tr><td class="code"><pre><span class="line">mds wipe_sessions = <span class="number">1</span></span><br></pre></td></tr></tbody></table>

当时解决一个replay的问题，尝试加入这个参数，然后启动mds

环境恢复了变成了双active，提示还有damage，但是数据属于可访问了

### 后续操作

建议是导出数据，重新配置为主备MDS集群，然后倒入数据

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-04-27 |

Source: zphj1987@gmail ([mds/journal.cc: 2929: FAILED assert解决](http://www.zphj1987.com/2017/04/27/mds-journal-cc-2929-FAILED-assert/))
