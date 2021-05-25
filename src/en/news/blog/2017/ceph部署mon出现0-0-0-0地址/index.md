---
title: "Ceph部署mon出现0.0.0.0地址"
date: "2017-06-06"
author: "admin"
tags: 
  - "planet"
---

  
![monitor](images/monitor.png)  

## 前言

最近在群里两次看到出现mon地址不对的问题，都是显示0.0.0.0:0地址，如下所示：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph -s</span></span><br><span class="line">    cluster <span class="number">3137</span>d009<span class="operator">-e</span>41e-<span class="number">41</span>f0-b8f8-<span class="number">5</span>cb574502572</span><br><span class="line">     health HEALTH_ERR</span><br><span class="line">            <span class="number">1</span> mons down, quorum <span class="number">0</span>,<span class="number">1</span>,<span class="number">2</span> lab8106,node8107,lab104</span><br><span class="line">     monmap e2: <span class="number">4</span> mons at {lab104=<span class="number">192.168</span>.<span class="number">10.4</span>:<span class="number">6789</span>/<span class="number">0</span>,lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>,lab8107=<span class="number">0.0</span>.<span class="number">0.0</span>:<span class="number">0</span>/<span class="number">2</span>,node8107=<span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br></pre></td></tr></tbody></table>

这个之前偶尔会看到有出现这个问题，但是自己一直没碰到过，想看下是什么情况下触发的，在征得这个cepher的同意后，登录上他的环境检查了一下，发现是主机名引起的这个问题

## 问题复现

在部署的过程中，已经规划好了主机名，而又去修改了这个机器的主机名的情况下就会出现这个问题  
比如我的这个机器，开始规划好lab8107主机名是这个，然后再lab8107上执行hostname node8107，就会触发这个问题

这个在deploy的部署输出日志中可以看得到  

<table><tbody><tr><td class="code"><pre><span class="line">[lab8107][WARNIN] ********************************************************************************</span><br><span class="line">[lab8107][WARNIN] provided hostname must match remote hostname</span><br><span class="line">[lab8107][WARNIN] provided hostname: lab8107</span><br><span class="line">[lab8107][WARNIN] remote hostname: node8107</span><br><span class="line">[lab8107][WARNIN] monitors may not reach quorum and create-keys will not complete</span><br><span class="line">[lab8107][WARNIN] ********************************************************************************</span><br></pre></td></tr></tbody></table>

可以看到 provided hostname: lab8107 而remote hostname: node8107，就会出现这个问题了

如果下次出现这个问题，首先就检查下规划的mon的主机名与真实的主机名是否一致

## 总结

新手在部署环境的时候，经常会犯一些比较基础的错误，这个是一个经验积累的过程，当然对于已经比较熟悉的cepher来说，也去尝试多看下各种异常问题，这个对于以后定位异常还是很有帮助的

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-06-06 |

Source: zphj1987@gmail ([Ceph部署mon出现0.0.0.0地址](http://www.zphj1987.com/2017/06/06/Ceph-deploymon-with-error-address/))
