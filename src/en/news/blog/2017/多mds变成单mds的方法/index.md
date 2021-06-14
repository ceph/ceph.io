---
title: "多MDS变成单MDS的方法"
date: "2017-05-03"
author: "admin"
tags: 
  - "planet"
---

## 前言

之前有个cepher的环境上是双活MDS的，需要变成MDS，目前最新版本是支持这个操作的

## 方法

### 设置最大mds

多活的mds的max\_mds会超过1，这里需要先将max\_mds设置为1  

<table><tbody><tr><td class="code"><pre><span class="line">ceph mds <span class="built_in">set</span> max_mds <span class="number">1</span></span><br></pre></td></tr></tbody></table>

### deactive mds

看下需要停掉的mds是rank 0 还是rank1,然后执行下面的命令即可  

<table><tbody><tr><td class="code"><pre><span class="line">[root@server8 ~]<span class="comment"># zbkc -s|grep mdsmap</span></span><br><span class="line">     mdsmap e13: <span class="number">1</span>/<span class="number">1</span>/<span class="number">1</span> up {<span class="number">0</span>=lab8106=up:clientreplay}</span><br></pre></td></tr></tbody></table>

这个输出的lab8106前面的0，就是这个mds的rank，根据需要停止对应的rank  

<table><tbody><tr><td class="code"><pre><span class="line">ceph mds deactivate <span class="number">1</span></span><br></pre></td></tr></tbody></table>

## 总结

不建议用多活mds

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-05-03 |

Source: zphj1987@gmail ([多MDS变成单MDS的方法](http://www.zphj1987.com/2017/05/03/mutimds-to-single-mds/))
