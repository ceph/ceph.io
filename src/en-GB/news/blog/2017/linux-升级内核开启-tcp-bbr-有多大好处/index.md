---
title: "Linux 升级内核开启 TCP BBR 有多大好处"
date: "2017-01-24"
author: "admin"
tags: 
  - "planet"
---

  
![](images/tcp_ip_protocol.gif)  

如果你有订阅一些科技新闻，应该会有看过内核在4.9当中加入了一个新的算法，来解决在有一定的丢包率的情况下的带宽稳定的问题，这个是谷歌为我们带来的干货，新的 TCP 拥塞控制算法 BBR (Bottleneck Bandwidth and RTT)，谷歌一向的做法是，先上生产，然后发论文，然后有可能开源，所以这个已经合并到了内核4.9分支当中，算法带来的改变在出的测试报告当中有很详细的数据展示，这个看多了可能反而不知道到底会有什么明显改变，特别是对于我们自己的场景

那么本篇就是来做一个实践的，开看看在通用的一些场景下，这个改变有多大，先说下结果，是真的非常大  

## 实践

还是我的两台机器lab8106和lab8107,lab8106做一个webserver，lab8107模拟客户端，用简单的wget来进行测试，环境为同一个交换机上的万兆网卡服务器

我们本次测试只测试一种丢包率的情况就是1%，有兴趣的情况下，可以自己去做些其他丢包率的测试，大多数写在丢包率20%以上的时候，效果可能没那么好，这个高丢包率不是我们探讨的情况，毕竟不是常用的场景

### 安装新内核

内核可以自己选择4.9或者以上的进行安装，也可以用yum安装,这里只是测试，就yum直接安装  

<table><tbody><tr><td class="code"><pre><span class="line">yum --enablerepo=elrepo-kernel install kernel-ml</span><br></pre></td></tr></tbody></table>

修改启动项  

<table><tbody><tr><td class="code"><pre><span class="line">grub2-editenv list</span><br><span class="line">grub2-set-default <span class="string">'CentOS Linux (4.9.5-1.el7.elrepo.x86_64) 7 (Core)'</span></span><br><span class="line">grub2-editenv list</span><br></pre></td></tr></tbody></table>

### 准备下载数据

准备一个web服务器然后把一个iso丢到根目录下，用于客户端的wget

### 设置丢包率

这里用tc进行控制的，也就是一条命令就可以了,这个还可以做其他很多控制，可以自行研究  

<table><tbody><tr><td class="code"><pre><span class="line">tc qdisc add dev enp2s0f0 root netem loss <span class="number">1</span>%</span><br></pre></td></tr></tbody></table>

如果需要取消限制  

<table><tbody><tr><td class="code"><pre><span class="line">tc qdisc del root dev enp2s0f0</span><br></pre></td></tr></tbody></table>

### 设置新的算法

讲下面的两个配置文件添加到/etc/sysctl.conf  

<table><tbody><tr><td class="code"><pre><span class="line">net.ipv4.tcp_congestion_control=bbr</span><br><span class="line">net.core.default_qdisc=fq</span><br></pre></td></tr></tbody></table>

然后执行sysctl -p让它生效

检查是参数是否生效  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 rpmbuild]<span class="comment"># sysctl net.ipv4.tcp_available_congestion_control</span></span><br><span class="line">net.ipv4.tcp_available_congestion_control = bbr cubic reno</span><br></pre></td></tr></tbody></table>

检查模块是否开启  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 rpmbuild]<span class="comment"># lsmod | grep bbr</span></span><br><span class="line">tcp_bbr                <span class="number">16384</span>  <span class="number">0</span></span><br></pre></td></tr></tbody></table>

如果需要恢复成默认的就修改成下面这个值，然后执行sysct -p恢复默认  

<table><tbody><tr><td class="code"><pre><span class="line">net.ipv4.tcp_congestion_control = cubic</span><br><span class="line">net.core.default_qdisc = pfifo_fast</span><br></pre></td></tr></tbody></table>

### 开始测试

为了避免磁盘本身的写入速度的影响，我们直接将数据wget到内存当中去  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ~]<span class="comment"># cd /dev/shm</span></span><br></pre></td></tr></tbody></table>

写入到这个目录当中的数据就是直接写入内存的  
我们先来对比下没有丢包的时候的速度

#### 1、默认算法，无丢包率

<table><tbody><tr><td class="code"><pre><span class="line"> wget http://<span class="number">192.168</span>.<span class="number">8.106</span>/FreeBSD-<span class="number">10.2</span>-RELEASE-amd64-dvd1.iso</span><br><span class="line"><span class="number">2017</span>-<span class="number">01</span>-<span class="number">24</span> <span class="number">12</span>:<span class="number">34</span>:<span class="number">01</span> (<span class="number">909</span> MB/s) - ‘FreeBSD-<span class="number">10.2</span>-RELEASE-amd64-dvd1.iso’ saved</span><br></pre></td></tr></tbody></table>

#### 2、BBR算法，无丢包率

<table><tbody><tr><td class="code"><pre><span class="line">wget http://<span class="number">192.168</span>.<span class="number">8.106</span>/FreeBSD-<span class="number">10.2</span>-RELEASE-amd64-dvd1.iso</span><br><span class="line"><span class="number">2017</span>-<span class="number">01</span>-<span class="number">24</span> <span class="number">12</span>:<span class="number">36</span>:<span class="number">21</span> (<span class="number">913</span> MB/s) - ‘FreeBSD-<span class="number">10.2</span>-RELEASE-amd64-dvd1.iso’ saved</span><br></pre></td></tr></tbody></table>

上面的两组数据基本一样，没有什么差别  
下面的测试将丢包率控制到1%，然后继续测试

#### 3、默认算法，1%丢包率

<table><tbody><tr><td class="code"><pre><span class="line">wget http://<span class="number">192.168</span>.<span class="number">8.106</span>/FreeBSD-<span class="number">10.2</span>-RELEASE-amd64-dvd1.iso</span><br><span class="line"><span class="number">2017</span>-<span class="number">01</span>-<span class="number">24</span> <span class="number">12</span>:<span class="number">38</span>:<span class="number">47</span> (<span class="number">142</span> MB/s) - ‘FreeBSD-<span class="number">10.2</span>-RELEASE-amd64-dvd1.iso’ saved</span><br></pre></td></tr></tbody></table>

可以看到在1%丢包率下，速度已经降为正常的1/6左右了，是一个很大的衰减

#### 4、BBR算法，1%丢包率

<table><tbody><tr><td class="code"><pre><span class="line">wget http://<span class="number">192.168</span>.<span class="number">8.106</span>/FreeBSD-<span class="number">10.2</span>-RELEASE-amd64-dvd1.iso</span><br><span class="line"><span class="number">2017</span>-<span class="number">01</span>-<span class="number">24</span> <span class="number">12</span>:<span class="number">40</span>:<span class="number">25</span> (<span class="number">896</span> MB/s) - ‘FreeBSD-<span class="number">10.2</span>-RELEASE-amd64-dvd1.iso’</span><br></pre></td></tr></tbody></table>

可以看到在1%丢包率下，还能维持接近900MB/s的下载速度，相对于默认算法，相差了真是非常非常的大，google在很多情况下技术甩了其他公司真的是几条街了

## 总结

上面的测试通过一个简单的场景来验证了bbr算法对于丢包情况下的带宽的优化，这个对于一些提供下载服务，并且有一定的丢包率的场景的情况下，能够有很大的改善，所以算法对于技术的改变还是非常大的，很多时候就是这种异常情况下的差别，才是真正的差别

顺便提一句微博的技术经理@来去之间说的一句话：

> 曾经有同事问我，为啥有些新业务给老员工做，交学费，而不是市场上招人更有效率。。。俺说渣浪业务起起伏伏，如果所有战线都用雇佣兵，顺的时候势如破竹，逆的时候兵败山倒了。。公司和员工都是相互扶持的，有些新业务，员工有能力做，只是经验不足，公司多付出一些，就当给未来不顺的时候上一份保险了

所以作为管理者，是不是多考虑多留住一些老员工，少期待一些雇佣兵

## 相关链接

[Linux Kernel 4.9 中的 BBR 算法与之前的 TCP 拥塞控制相比有什么优势？](https://www.zhihu.com/question/53559433)  
[Linux 升级内核开启 TCP BBR 实现高效单边加速](https://www.mf8.biz/linux-kernel-with-tcp-bbr/)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-01-24 |

Source: zphj1987@gmail ([Linux 升级内核开启 TCP BBR 有多大好处](http://www.zphj1987.com/2017/01/24/Linux-kernel-TCP-BBR-better/))
