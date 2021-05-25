---
title: "基于Docker UI 配置ceph集群"
date: "2017-03-16"
author: "admin"
tags: 
  - "planet"
---

  
![](images/docker2.png)  

## 前言

前一篇介绍了docker在命令行下面进行的ceph部署，本篇用docker的UI进行ceph的部署，目前来说市面上还没有一款能够比较简单就能直接在OS上面去部署Ceph的管理平台，这是因为OS的环境差异化太大，并且包的版本，以及各种软件的适配都可能造成失败，而docker比较固化环境，因此即使一个通用的UI也能很方便的部署出一个Cpeh集群

本篇就是对Docker UI部署集群做一个实践，对ceph了解，对docker了解，对dokcer的UI操作进行一定的了解的情况下，再做实践会比较好，总体上还是比较简单的  

## 安装并运行portainer

### 安装软件

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">cd</span> /opt</span><br><span class="line">wget https://github.com/portainer/portainer/releases/download/<span class="number">1.12</span>.<span class="number">1</span>/portainer-<span class="number">1.12</span>.<span class="number">1</span>-linux-amd64.tar.gz</span><br><span class="line">tar xvpfz portainer-<span class="number">1.12</span>.<span class="number">1</span>-linux-amd64.tar.gz</span><br><span class="line"><span class="built_in">cd</span> portainer</span><br></pre></td></tr></tbody></table>

### 运行软件

<table><tbody><tr><td class="code"><pre><span class="line">.<span class="regexp">/portainer -H unix:/</span><span class="regexp">//</span><span class="reserved">var</span>/run/docker.sock  -p <span class="string">":9999"</span></span><br></pre></td></tr></tbody></table>

注意下这里-H是指定的docker的连接，也就是要控制哪个docker，这个支持本地的sock的方式，也支持远程的tcp的方式，这个进入ui界面后还可以添加更多的  
\-p是指定的访问的接口

### 扩展知识

如何在centos7下面启用 remote api  
打开文件  

<table><tbody><tr><td class="code"><pre><span class="line">/usr/lib/systemd/system/docker.service</span><br></pre></td></tr></tbody></table>

在 `$INSECURE_REGISTRY` 后面添加 `-H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock`  

<table><tbody><tr><td class="code"><pre><span class="line">ExecStart=/usr/bin/dockerd-current </span><br><span class="line">          --add-runtime docker-runc=/usr/libexec/docker/docker-runc-current </span><br><span class="line">          --default-runtime=docker-runc </span><br><span class="line">          --exec-opt native.cgroupdriver=systemd </span><br><span class="line">          --userland-proxy-path=/usr/libexec/docker/docker-proxy-current </span><br><span class="line">          <span class="variable">$OPTIONS</span> </span><br><span class="line">          <span class="variable">$DOCKER_STORAGE_OPTIONS</span> </span><br><span class="line">          <span class="variable">$DOCKER_NETWORK_OPTIONS</span> </span><br><span class="line">          <span class="variable">$ADD_REGISTRY</span> </span><br><span class="line">          <span class="variable">$BLOCK_REGISTRY</span> </span><br><span class="line">          <span class="variable">$INSECURE_REGISTRY</span>  -H tcp://<span class="number">0.0</span>.<span class="number">0.0</span>:<span class="number">2376</span> -H unix:///var/run/docker.sock</span><br></pre></td></tr></tbody></table>

修改好了后  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment">#systemctl daemon-reload</span></span><br><span class="line">[root@lab8106 ~]<span class="comment">#systemctl restart docker</span></span><br></pre></td></tr></tbody></table>

检查端口和asok  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># netstat -tunlp|grep 2376</span></span><br><span class="line">tcp6       <span class="number">0</span>      <span class="number">0</span> :::<span class="number">2376</span>                 :::*                    LISTEN      <span class="number">24484</span>/dockerd-curre </span><br><span class="line">[root@lab8106 ~]<span class="comment"># ll /var/run/docker.sock</span></span><br><span class="line">srw-rw---- <span class="number">1</span> root root <span class="number">0</span> Mar <span class="number">16</span> <span class="number">16</span>:<span class="number">39</span> /var/run/docker.sock</span><br></pre></td></tr></tbody></table>

生成了配置没有问题

#### portainer的自身数据

默认情况下portainer的数据是存储在/data目录下面的，如果想重新配置密码或者内容的话，删除这个目录里面的数据就行  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># ll /data/</span></span><br><span class="line">total <span class="number">24</span></span><br><span class="line">-rw------- <span class="number">1</span> root root <span class="number">32768</span> Mar <span class="number">16</span> <span class="number">16</span>:<span class="number">32</span> portainer.db</span><br><span class="line">drwx------ <span class="number">2</span> root root     <span class="number">6</span> Mar <span class="number">16</span> <span class="number">16</span>:<span class="number">32</span> tls</span><br></pre></td></tr></tbody></table>

## UI界面登陆

直接访问宿主机的`http://ip:9999`  
![login](images/image_1bbb4ogmqu1ir8049n1okfq4j9.png)  
输入一个8位数的密码  
输入好了以后，登陆即可

![endponit](images/image_1bbb4r1eb1qnj0pcjmsbf1ucgm.png)

检查endpoint，可以看到就是我刚才命令行当中加入的sock

## 获取image

![get ceph](images/image_1bbb4vs5h1ri522q8avkrb1ko716.png)

在上面填写`ceph/daemon` 然后点击pull

有可能会超时，如果多次失败，就去后台命令行执行，这个地方等同于后台的命令  

<table><tbody><tr><td class="code"><pre><span class="line">docker pull ceph/daemon</span><br></pre></td></tr></tbody></table>

也可以直接在后台执行这个命令  
可以用dstat -n观察下载的速度

下载好了去页面上看下是否好了  
![download](images/image_1bbb6c50tip1iud1gfv9m4uku1j.png)

## 配置CEPH集群

配置集群可以都在页面做了，因为之前有篇命令行部署docker的ceph，建议先回顾一下，再看这个比较好

### 创建MON

点击增加容器  
![add comn](images/image_1bbb6fpgmpgh1enf6pm1kk818q920.png)

注意创建好两个目录  

<table><tbody><tr><td class="code"><pre><span class="line">mkdir -p /etc/ceph</span><br><span class="line">mkdir -p /var/lib/ceph/</span><br></pre></td></tr></tbody></table>

这两个目录里面不要有任何东西,保持空目录状态

![ceph mon](images/image_1bbb6pbf811pesikkrmemt9du2d.png)

- 填写名称为mon，这个是容器名称，可以自定义
- 填写Image，这个填写下载好的ceph/daemon
- 填写command,这个填写mon，为固定值
- 填写Entry Ponit ,这个填写/entrypoint.sh，为固定值
- 填写Environment variable，这个填写两个变量
    - MON\_IP 192.168.8.106
    - CEPH\_PUBLIC\_NETWORK 192.168.0.0/16

填写完了切换第二个标签页Volumes  
![volume](images/image_1bbb6rsb01etg1ebt1hr317lo1met2q.png)

- 填写Volume
    - /etc/ceph /etc/ceph
    - /var/lib/ceph/ /var/lib/ceph/

![network](images/image_1bbb6tgov1kvr1rcc1keg1e0a1i4537.png)

- 填写Network为host
- 填写hostname为宿主机的主机名  
    上面都填写完了后就点击create

没出异常的话，就可以进入console进行查询了  
![console](images/image_1bbb726491l5it2d1kf31at614lb3k.png)  
点击connect  
![image_1bbb73gjif91s70a6f8pg1vg141.png-79.5kB](images/image_1bbb73gjif91s70a6f8pg1vg141.png)  
没有问题

### 创建OSD

点击增加容器  
![add comn](images/image_1bbb6fpgmpgh1enf6pm1kk818q920.png)

![osd0](images/image_1bbb7a1dm1gv1n4j1odoo3k1n2u4e.png)

- 填写Name，这个为容器名称，可以自定义
- 填写Image,这个为ceph/daemon,固定的值
- 填写command,这个为osd\_ceph\_disk，为定值
- 填写Entry Ponit ,这个填写/entrypoint.sh，为固定值
- 填写Environment variable，这个填写一个OSD磁盘变量
    - OSD\_DEVICE /dev/sdb

切换到第二个Volume标签页

- 填写Volume
    - /etc/ceph /etc/ceph
    - /var/lib/ceph/ /var/lib/ceph/
    - /dev/ /dev/

![osd0 add](images/image_1bbb7aqg21jso1ku51mdgajtr0p4r.png)

切换到Network标签页

- 填写Network为host
- 填写hostname为宿主机的主机名  
    上面都填写完了后就点击create

![osdsd add](images/image_1bbb7c5d17b21o1uoc1i7h1cr458.png)  
切换到Security/Host标签页  
勾选上 `privileged`,一定要选上，不然没有权限去格式化磁盘

![osd addd ](images/image_1bbb7okcj8mj1c301tdb16mtecn5l.png)  
上面都填写完了后就点击create  
没出异常的话，就可以进入console进行查询了  
![good](images/image_1bbb7ufgk12nj1unpoq5taa1iah9.png)

基本上一个简单的集群就配置好了，跨主机的情况，就提前把配置文件拷贝到另外一台主机，还有bootstrap keyring也拷贝过去，就可以了，这里就不做过多的赘述

## 总结

本篇基于portainer以及一个现有的ceph容器做的部署实践，从整个操作来说，UI的部署，环境的搭建都非常的简单，这个得益于UI环境的简单，还有docker的封装，更多的玩法可以自己去探索，也可以运用这个UI做更多其他的容器操作

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-03-16 |

Source: zphj1987@gmail ([基于Docker UI 配置ceph集群](http://www.zphj1987.com/2017/03/16/base-on-docker-ui-deploy-ceph/))
