---
title: "brctl 增加桥接网卡"
date: "2020-01-09"
author: "admin"
tags: 
  - "planet"
---

## 前言

之前有一篇介绍配置桥接网卡的，这个桥接网卡一般是手动做虚拟化的时候会用到，通过修改网卡的配置文件的方式会改变环境的原有的配置，而很多情况，我只是简单的用一下，并且尽量不要把网络搞断了，万一有问题，远程把机器重启一下也就恢复了，不至于反复去定位哪里改错了，当然如果是能够直连的修改的时候，还是建议通过配置文件的方式去修改

安装必要的软件包

```bash
yum install bridge-utils
```

选择想要修改的网卡

```bash
[root@lab101 ~]# ifconfig 
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.101  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::20c:29ff:fe19:3efb  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:19:3e:fb  txqueuelen 1000  (Ethernet)
        RX packets 181  bytes 16447 (16.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 98  bytes 16871 (16.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

我的环境为ens33

修改配置文件，把onboot改错no，也就是开机不启动

```bash
/etc/sysconfig/network-scripts/ifcfg-ens33 
ONBOOT="no"
```

修改/etc/rc.local

```bash
ifconfig ens33 down
ifconfig ens33 0.0.0.0
brctl addbr br0
brctl addif br0 ens33
ifconfig br0 192.168.0.101/24 up
brctl stp br0 off
route add default gw 192.168.0.1 br0
```

```bash
chmod +x /etc/rc.d/rc.local
```

```bash
[root@lab101 ~]# brctl show
bridge name     bridge id               STP enabled     interfaces
br0             8000.000c29193efb       no              ens33
```

可以看到br0已经桥接到了ens33上面去了，并且网络也没有中断

如果需要还原，就把/etc/rc.local这些注释掉，并且把onboot改成yes就可以了

或者通过脚本还原

```bash
ifconfig ens33 down
ifconfig br0 down
brctl delif br0 ens33
brctl delbr br0
ifconfig ens33 192.168.0.101/24 up
route add default gw 192.168.0.1 ens33
```

然后去掉rc.local和onboot改成yes就可以了

## 总结

修改网卡的方式很多，本篇记录的是怎么方便快捷，怎么避免出错，并且比较好还原，不中断的修改网卡桥接的方式

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2020-01-09 |

Source: zphj1987@gmail ([brctl 增加桥接网卡](http://zphj1987.com/2020/01/09/brctl-add-bridge/))
