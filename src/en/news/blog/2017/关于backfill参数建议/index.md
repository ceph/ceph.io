---
title: "关于backfill参数建议"
date: "2017-04-27"
author: "admin"
tags: 
  - "planet"
---

  
![](images/fill.gif)  

## 前言

在做一个比较满的集群的扩容的时候，遇到了一些问题，在这里做下总结，一般来说很难遇到，扩容要趁早，不然出的问题都是稀奇古怪的一些问题  

## 建议

环境一般来说在70%左右就需要考虑扩容了，这个时候的扩容数据迁移的少，遇到的问题自然会少很多，所谓的参数设置并不是一个单纯的参数的设置，所以一般来说在调优参数的时候，个人觉得只有适配硬件进行调优，所以本篇的参数同样是一个组合形式的

首先罗列出本篇涉及的所有参数

> mon\_osd\_full\_ratio = 0.95  
> osd\_backfill\_full\_ratio = 0.85  
> osd\_max\_backfills = 1

最少的OSD的PG数目

> min\_pg=\`ceph osd df|awk ‘{print $9}’|awk ‘NF’|grep -v PGS|sort|head -n 1\`

那么最好满足

> (osd\_max\_backfills/min\_pg)+osd\_backfill\_full\_ratio < mon\_osd\_full\_ratio

这个在老版本里面进行backfill full的检测的时候，只在启动backfill的时候做了检测，如果设置的backfill足够大，而迁移的又足够多的时候，就会一下涌过去，直径把OSD给弄full然后挂掉了，新版本还没验证是否做了实时控制，但是如果遵循了上面的设置，即使没控制一样不会出问题

## 总结

有的参数不光对速度有控制，对量上面同样可能有影响，所以在设置的时候，需要尽量综合考虑

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-04-27 |

Source: zphj1987@gmail ([关于backfill参数建议](http://www.zphj1987.com/2017/04/27/about-backfill-conf/))
