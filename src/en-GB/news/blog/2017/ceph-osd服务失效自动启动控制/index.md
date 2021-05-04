---
title: "Ceph OSD服务失效自动启动控制"
date: "2017-09-06"
author: "admin"
tags: 
  - "planet"
---

  
![](images/restart.png)  

## 前言

服务器上面的服务会因为各种各样的原因失败，磁盘故障，权限问题，或者是服务过载引起超时，这些都可能引起

这个在ceph里面systemctl unit 默认有个on-fail restart,默认的可能并不适合所有的场景，所以自动化的服务应该是尽量去适配你手动处理的过程，手动怎么处理的，就怎么去设置  

## 启动分析

如果有osd失败了，一般上去会先启动一次，尽快让服务启动，然后去检查是否有故障，如果失败了，就开启调试日志，再次重启，在问题解决之前，是不会再启动了，所以这里我们的自动启动设置也这么设置

## 参数配置

ceph的osd的启动配置在这个配置文件

> /usr/lib/systemd/system/ceph-osd@.service

默认参数：  

<table><tbody><tr><td class="code"><pre><span class="line">Restart=on-failure</span><br><span class="line">StartLimitInterval=<span class="number">30</span>min</span><br><span class="line">StartLimitBurst=<span class="number">30</span></span><br><span class="line">RestartSec=<span class="number">20</span>s</span><br></pre></td></tr></tbody></table>

默认的参数意思是  
在30min的周期内，如果没启动成功，那么在失败后20s进行启动，这样的启动尝试30次

这个在启动机器的时候，是尽量在osd启动失败的情况下，能够在30min分钟内尽量把服务都启动起来，这个对于关机启动后的控制是没问题的

参数解释：  
StartLimitInterval不能设置太小，在osd崩溃的情况里面有一种是对象异常了，这个在启动了后，内部会加载一段时间的数据以后才会崩溃，所以RestartSec\*StartLimitBurst 必须小于StartLimitInterval，否则可能出现无限重启的情况

restart的触发条件

| Restart settings/Exit causes | always | on-success | on-failure | on-abnormal | on-abort | on-watchdog |
| --- | --- | --- | --- | --- | --- | --- |
| Clean exit code or signal | X | X |  |  |  |  |
| Unclean exit code | X |  | X |  |  |  |
| Unclean signal | X |  | X | X | X |  |
| Timeout | X |  | X | X |  |  |
| Watchdog | X |  | X | X |  | X |

可调整项目  
Restart=always就是只要非正常的退出了，就满足重启的条件，kill -9 进程也能够自动启动

在osd崩溃的情况里面有一种情况是对象异常了，这个在启动了后，内部会加载一段时间的数据以后才会崩溃，这种崩溃的情况我们不需要尝试多次重启,所以适当降低重启频率  

<table><tbody><tr><td class="code"><pre><span class="line">StartLimitBurst=<span class="number">3</span></span><br><span class="line">RestartSec=<span class="number">10</span>s</span><br></pre></td></tr></tbody></table>

这个设置后能够在运行的集群当中比较好的处理异常退出的情况，但是设置后就要注意关机osd osd启动的问题，一般关机的时候肯定是有人在维护的，所以这个问题不大，人为处理下就行

所以建议的参数是

<table><tbody><tr><td class="code"><pre><span class="line">Restart=always</span><br><span class="line">StartLimitInterval=<span class="number">30</span>min</span><br><span class="line">StartLimitBurst=<span class="number">3</span></span><br><span class="line">RestartSec=<span class="number">10</span>s</span><br></pre></td></tr></tbody></table>

可以根据自己的需要进行设置，这个设置下，停止osd就用systemctl 命令去 stop，然后其他的任何异常退出情况都会把osd给拉起来

## 总结

systemctl在服务控制方面有着很丰富的功能，可以根据自己的需求进行调整，特别是对启动条件有约束的场景，这个是最适合的

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-09-06 |

Source: zphj1987@gmail ([Ceph OSD服务失效自动启动控制](http://www.zphj1987.com/2017/09/06/Ceph-OSD-autorestart-when-fail/))
