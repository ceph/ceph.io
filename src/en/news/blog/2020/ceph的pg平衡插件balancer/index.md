---
title: "ceph的pg平衡插件balancer"
date: "2020-06-17"
author: "admin"
tags: 
  - "planet"
---

## 前言

ceph比较老的版本使用的reweight或者osd weight来调整平衡的，本篇介绍的是ceph新的自带的插件balancer的使用，官网有比较详细的操作手册可以查询

## 使用方法

查询插件的开启情况

```bash
[root@node1 ceph]# ceph mgr module ls
{
    "enabled_modules": [
        "balancer",
        "restful",
        "status"
    ],
    "disabled_modules": [
        "dashboard",
        "influx",
        "localpool",
        "prometheus",
        "selftest",
        "telemetry",
        "zabbix"
    ]
}
```

默认balancer就是enable的

查询balancer活动情况

```bash
[root@node1 ceph]# ceph  balancer status
{
    "last_optimize_duration": "", 
    "plans": [], 
    "mode": "none", 
    "active": false, 
    "optimize_result": "", 
    "last_optimize_started": ""
}
```

可以看到active是false，这里有手动的方法和自动的方法，我一般使用自动的，然后调整完了关闭

首先设置兼容模式

```bash
ceph balancer mode crush-compat
```

开启调整前，我们需要先看下我们的调整的效果，这里可以用

[查询osd上的pg数](https://zphj1987.com/2015/10/14/%e6%9f%a5%e8%af%a2osd%e4%b8%8a%e7%9a%84pg%e6%95%b0/)  
提供的脚本来进行查询，效果如下

```bash
[root@node1 ceph]# sh getpg.sh 
dumped all

pool :  6   | SUM 
------------------------
osd.0   159 | 159
osd.1   136 | 136
osd.2   167 | 167
osd.3   163 | 163
osd.4   143 | 143
------------------------
SUM :   768 |
Osd :   5   |
AVE :   153.60  |
Max :   167 |
Osdid : osd.2   |
per:    8.7%    |
------------------------
min :   136 |
osdid : osd.1   |
per:    -11.5%  |
```

之所以要这个脚本，是因为自带的提供的是osd上面的pg之和，有的时候我们的存储池混用物理osd的，上面的有的空存储池的pg会影响查看效果，所以需要分存储池去计算统计

开启调整

```bash
ceph balancer on
```

查看情况

```bash
[root@node1 ceph]# ceph  balancer status
{
    "last_optimize_duration": "0:00:00.989178", 
    "plans": [], 
    "mode": "crush-compat", 
    "active": true, 
    "optimize_result": "Optimization plan created successfully", 
    "last_optimize_started": "Wed Jun 17 14:34:53 2020"
}
```

现在的这个状态查询比以前做的好了，还带上了最后的执行时间，从监控来看，1分钟会触发一次，差不多等个几分钟，基本就调整完了，这个的前提是空的环境，有数据的环境，那就看每一轮的需要迁移的数据量了，所以搭建完集群，一定需要调整平衡  
我们检查下我们的环境

```bash
[root@node1 ceph]# sh getpg.sh 
dumped all

pool :  6   | SUM 
------------------------
osd.0   153 | 153
osd.1   153 | 153
osd.2   154 | 154
osd.3   154 | 154
osd.4   154 | 154
------------------------
SUM :   768 |
Osd :   5   |
AVE :   153.60  |
Max :   154 |
Osdid : osd.2   |
per:    0.3%    |
------------------------
min :   153 |
osdid : osd.1   |
per:    -0.4%   |
```

再次查询

```bash
[root@node1 ceph]# ceph  balancer status
{
    "last_optimize_duration": "0:00:00.114673", 
    "plans": [], 
    "mode": "crush-compat", 
    "active": true, 
    "optimize_result": "Unable to find further optimization, change balancer mode and retry might help", 
    "last_optimize_started": "Wed Jun 17 14:40:57 2020"
}
```

效果相当惊人，结果提示这个无法更好了，这个调整看自己接受的程度了，之前遇到过一次主机不对称的crush，实际上会出现永远调不平的情况，所以自己判断下即可，目前的情况非常的均衡了，这个时候我个人的操作是关闭掉这个调整，以免后面有变化，有数据的时候自动触发了调整引起不必要的麻烦

关闭自动平衡

```bash
[root@node1 ceph]# ceph balancer off
[root@node1 ceph]# ceph  balancer status
{
    "last_optimize_duration": "0:00:00.114152", 
    "plans": [], 
    "mode": "crush-compat", 
    "active": false, 
    "optimize_result": "Unable to find further optimization, change balancer mode and retry might help", 
    "last_optimize_started": "Wed Jun 17 14:44:58 2020"
}
```

## 总结

现在的平衡跟之前通过weight的调整，最终的效果比之前会好很多，之前H版本J版本一个集群能调整到5%，基本就是调整极限了

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2020-06-17 |

Source: zphj1987@gmail ([ceph的pg平衡插件balancer](https://zphj1987.com/2020/06/17/ceph-balancer/))
