---
title: "ceph luminous 新功能之内置dashboard"
date: "2017-06-25"
author: "admin"
tags: 
  - "planet"
---

  
![](images/dashboard.jpg)  

## 前言

ceph luminous版本新增加了很多有意思的功能，这个也是一个长期支持版本，所以这些新功能的特性还是很值得期待的，从底层的存储改造，消息方式的改变，以及一些之前未实现的功能的完成，都让ceph变得更强，这里面有很多核心模块来自中国的开发者，在这里准备用一系列的文章对这些新功能进行一个简单的介绍，也是自己的一个学习的过程

## 相关配置

### 配置ceph国内源

修改 /etc/yum.repos.d/ceph.repo文件  

<table><tbody><tr><td class="code"><pre><span class="line">[ceph]</span><br><span class="line">name=ceph</span><br><span class="line">baseurl=http://mirrors.<span class="number">163</span>.com/ceph/rpm-luminous/el7/x86_64/</span><br><span class="line">gpgcheck=<span class="number">0</span></span><br><span class="line">[ceph-noarch]</span><br><span class="line">name=cephnoarch</span><br><span class="line">baseurl=http://mirrors.<span class="number">163</span>.com/ceph/rpm-luminous/el7/noarch/</span><br><span class="line">gpgcheck=<span class="number">0</span></span><br></pre></td></tr></tbody></table>

添加完更新下缓存  

<table><tbody><tr><td class="code"><pre><span class="line">yum makecache</span><br></pre></td></tr></tbody></table>

前一段时间163源上的ceph没有了，可能是误操作的，现在的163源已经恢复，上面添加的是最新的luminous版本源，本篇实践的功能是在这个版本才加入的

### 安装ceph相关软件包

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># yum install ceph-deploy ceph</span></span><br></pre></td></tr></tbody></table>

检查版本  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ceph -v</span></span><br><span class="line">ceph version <span class="number">12.1</span>.<span class="number">0</span> (<span class="number">262617</span>c9f16c55e863693258061c5b25dea5b086) luminous (dev)</span><br></pre></td></tr></tbody></table>

### 搭建一个集群

这个就不描述配置集群的步骤，这个网上很多资料，也是很基础的操作  
这里提几个luminous重要的变化

- 默认的消息处理从simple变成了async了（ms\_type = async+posix）
- 默认的后端存储从filestore变成了bluestore了
- ceph-s的命令的输出发生了改变(显示如下)

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph -s</span></span><br><span class="line">  cluster:</span><br><span class="line">    id:     <span class="number">49</span>ee8a7f-fb7c-<span class="number">4239</span><span class="operator">-a</span>4b7-acf0bc37430d</span><br><span class="line">    health: HEALTH_OK</span><br><span class="line"> </span><br><span class="line">  services:</span><br><span class="line">    mon: <span class="number">1</span> daemons, quorum lab8106</span><br><span class="line">    mgr: lab8106(active)</span><br><span class="line">    osd: <span class="number">2</span> osds: <span class="number">2</span> up, <span class="number">2</span> <span class="keyword">in</span></span><br><span class="line"> </span><br><span class="line">  data:</span><br><span class="line">    pools:   <span class="number">1</span> pools, <span class="number">64</span> pgs</span><br><span class="line">    objects: <span class="number">0</span> objects, <span class="number">0</span> bytes</span><br><span class="line">    usage:   <span class="number">2110</span> MB used, <span class="number">556</span> GB / <span class="number">558</span> GB avail</span><br><span class="line">    pgs:     <span class="number">64</span> active+clean</span><br></pre></td></tr></tbody></table>

### 开启监控模块

在/etc/ceph/ceph.conf中添加  

<table><tbody><tr><td class="code"><pre><span class="line">[mgr]</span><br><span class="line">mgr modules = dashboard</span><br></pre></td></tr></tbody></table>

设置dashboard的ip和端口  

<table><tbody><tr><td class="code"><pre><span class="line">ceph config-key put mgr/dashboard/server_addr <span class="number">192.168</span>.<span class="number">8.106</span></span><br><span class="line">ceph config-key put mgr/dashboard/server_port <span class="number">7000</span></span><br></pre></td></tr></tbody></table>

这个从代码上看应该是可以支持配置文件方式的设置，目前还没看到具体的文档，先按这个设置即可，默认的端口是7000

重启mgr服务  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># systemctl restart ceph-mgr@lab8106</span></span><br></pre></td></tr></tbody></table>

检查端口  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># netstat -tunlp|grep 7000</span></span><br><span class="line">tcp        <span class="number">0</span>      <span class="number">0</span> <span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">7000</span>      <span class="number">0.0</span>.<span class="number">0.0</span>:*               LISTEN      <span class="number">31485</span>/ceph-mgr</span><br></pre></td></tr></tbody></table>

### 访问界面

![dashboard](images/image.png)  
这个是首页的信息

![image.png-137.3kB](images/image.png)  
如果配置了cephfs文件系统后，会有这个文件系统相关的监控

![servers](images/image.png)  
这个界面是显示的主机的信息的

## 总结

从部署方便性来说，这个部署还是非常的方便的，而且走的是ceph原生接口，ceph通过增加一个mgr模块，可以把一些管理的功能独立出来，从而让mon自己做最重要的一些事情

目前的监控功能还比较少，主要是监控功能，未来应该会慢慢增加更多的功能，从产品角度来看，一个原生的UI监控使得ceph整个模块更加的完整了

有的时候也许 simple is the best

## 参考资料

/usr/lib64/ceph/mgr/dashboard/README.rst

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-06-26 |

Source: zphj1987@gmail ([ceph luminous 新功能之内置dashboard](http://www.zphj1987.com/2017/06/25/ceph-luminous-new-dashboard/))
