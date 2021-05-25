---
title: "Ceph编译加速的小技巧"
date: "2017-01-05"
author: "admin"
tags: 
  - "planet"
---

  
![此处输入图片的描述](images/octoalien.jpg)  

总结了几个小技巧，用于在ceph编译过程中，能够更快一点  

## 一、修改clone的地址

> git clone [https://github.com/ceph/ceph.git](https://github.com/ceph/ceph.git)

可以修改成

> git clone git://github.com/ceph/ceph.git

某些时候可能可以加快一些  
![1.png-5.9kB](images/1.png)

![1.png-5.](images/2.png)

## 二、根据需要下载分支

假如现在想看10.2.5版本的代码

### 2.1 常规做法

先下载整个库  

<table><tbody><tr><td class="code"><pre><span class="line">git <span class="built_in">clone</span> git://github.com/ceph/ceph.git all</span><br></pre></td></tr></tbody></table>

总共的下载对象数目为46万

> Counting objects: 460384

这个是包含所有的分支和分支内的文件的所有版本的  
我们切换到分支  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 mytest]<span class="comment">#cd all</span></span><br><span class="line">[root@lab8106 all]<span class="comment"># git branch</span></span><br><span class="line">* master</span><br><span class="line">[root@lab8106 all]<span class="comment"># git checkout -b all10.2.5  v10.2.5</span></span><br><span class="line">Switched to a new branch <span class="string">'all10.2.5'</span></span><br><span class="line">[root@lab8106 all]<span class="comment"># git branch</span></span><br><span class="line">* all10.<span class="number">2.5</span></span><br><span class="line">  master</span><br><span class="line">[root@lab8106 all]<span class="comment"># ls -R|wc -l</span></span><br><span class="line"><span class="number">4392</span></span><br><span class="line">可以看到有这么多的文件</span><br></pre></td></tr></tbody></table>

#### 2.2 现在只复制一个分支的

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 mytest]<span class="comment"># git clone -b v10.2.5 --single-branch   git://github.com/ceph/ceph.git single</span></span><br></pre></td></tr></tbody></table>

总共下载的对象数目为34万

> Counting objects: 344026  
> 
> <table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 mytest]<span class="comment"># cd single/</span></span><br><span class="line">[root@lab8106 single]<span class="comment"># git checkout -b single10.2.5</span></span><br><span class="line">Switched to a new branch <span class="string">'single10.2.5'</span></span><br><span class="line">[root@lab8106 single]<span class="comment"># git branch</span></span><br><span class="line">* single10.<span class="number">2.5</span></span><br><span class="line">[root@lab8106 single]<span class="comment"># ls -R |wc -l</span></span><br><span class="line"><span class="number">4392</span></span><br></pre></td></tr></tbody></table>

#### 2.3 现在只复制一个分支的最后一个版本的代码

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 mytest]<span class="comment"># git clone -b v10.2.5 --single-branch --depth 1  git://github.com/ceph/ceph.git singledep1</span></span><br></pre></td></tr></tbody></table>

总共下载的对象数目为3682

> Counting objects: 3682  
> 
> <table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 mytest]<span class="comment">#  cd singledep1/</span></span><br><span class="line"> [root@lab8106 singledep1]<span class="comment"># git checkout -b singledep110.2.5</span></span><br><span class="line">Switched to a new branch <span class="string">'singledep110.2.5'</span></span><br><span class="line">[root@lab8106 singledep1]<span class="comment"># git branch</span></span><br><span class="line">* singledep110.<span class="number">2.5</span></span><br><span class="line">[root@lab8106 singledep1]<span class="comment"># ls -R |wc -l</span></span><br><span class="line"><span class="number">4392</span></span><br></pre></td></tr></tbody></table>

从上面的可以看到三个版本的代码是一致的，那么区别在哪里

- clone：包含所有分支和分支的所有文件版本
- clone single-branch：包含指定分支和指定分支的所有文件的版本
- clone single-branch depth 1 ：包含指定分支和指定分支的最后一个版本的文件

## 准备编译前的install-deps慢

提前准备好epel  

<table><tbody><tr><td class="code"><pre><span class="line">yum install http://mirrors.aliyun.com/epel/<span class="number">7</span>/x86_64/e/epel-release-<span class="number">7</span>-<span class="number">8</span>.noarch.rpm</span><br><span class="line">rm -rf /etc/yum.repos.d/epel*</span><br></pre></td></tr></tbody></table>

装完了删除，这个是为了绕过包验证  

<table><tbody><tr><td class="code"><pre><span class="line">wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-<span class="number">7</span>.repo</span><br></pre></td></tr></tbody></table>

删除慢速的 aliyuncs  

<table><tbody><tr><td class="code"><pre><span class="line">sed -i <span class="string">'/aliyuncs/d'</span> /etc/yum.repos.d/epel.repo</span><br></pre></td></tr></tbody></table>

install-deps.sh第72行的需要修改

> yum-config-manager —add-repo [https://dl.fedoraproject.org/pub/epel/$MAJOR\_VERSION/x86\_64/](https://dl.fedoraproject.org/pub/epel/$MAJOR_VERSION/x86_64/)  
> 执行下面的命令  
> 
> <table><tbody><tr><td class="code"><pre><span class="line">sed -i <span class="string">'s/https://dl.fedoraproject.org/pub//http://mirrors.aliyun.com//g'</span> install-deps.sh</span><br></pre></td></tr></tbody></table>

然后执行install-deps.sh，这样会快很多的

## 总结

目前就这么多，后续有更多的影响速度的地方会增加上去

## 我的公众号-磨磨谈

  
![](images/qrcode_for_gh_6998a54d68f7_430.jpg)  

Source: zphj1987@gmail ([Ceph编译加速的小技巧](http://www.zphj1987.com/2017/01/05/Ceph-compile-speedup/))
