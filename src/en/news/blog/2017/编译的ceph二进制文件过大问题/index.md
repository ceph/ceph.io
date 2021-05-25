---
title: "编译的Ceph二进制文件过大问题"
date: "2017-03-23"
author: "admin"
tags: 
  - "planet"
---

  
![binary](images/codebug.jpg)  

## 前言

在ceph的研发群里看到一个cepher提出一个问题，编译的ceph的二进制文件过大，因为我一直用的打包好的rpm包，没有关注这个问题，重新编译了一遍发现确实有这个问题

本篇就是记录如何解决这个问题的  

## 打rpm包的方式

用我自己的环境编译的时候发现一个问题，编译出来的rpm包还是很大，开始怀疑是机器的原因，换了一台发现二进制包就很小了，然后查询了很多资料以后，找到了问题所在

在打rpm包的时候可以通过宏变量去控制是否打出一个的debug的包，这个包的作用就是把二进制文件当中包含的debug的相关的全部抽离出来形成一个新的rpm包，而我的环境不知道什么时候在/root/.rpmmacros添加进去了一个  

<table><tbody><tr><td class="code"><pre><span class="line">d%ebug_package      %{nil}</span><br></pre></td></tr></tbody></table>

搜寻资料后确定就是这个的问题,这个变量添加了以后，在打包的时候就不会进行debug相关包的剥离，然后打出的包就是巨大的，可以这样检查自己的rpmbuild的宏变量信息  

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment">#  rpmbuild --showrc|grep debug_package</span></span><br><span class="line">    %{!?__debug_package:</span><br><span class="line">    %{?__debug_package:%{__debug_install_post}}</span><br><span class="line">-<span class="number">14</span>: _<span class="built_in">enable</span>_debug_packages	<span class="number">1</span></span><br><span class="line">-<span class="number">14</span>: debug_package	</span><br><span class="line">%global __debug_package <span class="number">1</span></span><br><span class="line">-<span class="number">14</span>: install	%{?_<span class="built_in">enable</span>_debug_packages:%{?buildsubdir:%{debug_package}}}</span><br></pre></td></tr></tbody></table>

如果开启了debug包抽离（默认就是开启的），那么rpmbuild在打包的过程中会有个调用  

<table><tbody><tr><td class="code"><pre><span class="line">/usr/lib/rpm/find-debuginfo.sh --strict-build-id -m --run-dwz --dwz-low-mem-die-limit <span class="number">10000000</span> --dwz-max-die-limit <span class="number">110000000</span> /root/rpmbuild/BUILD/ceph-<span class="number">10.2</span>.<span class="number">5</span></span><br></pre></td></tr></tbody></table>

这个就是rpmbuild过程中，进行抽离debug信息的操作，也就是缩小二进制的过程，这个并不能直接执行命令，需要用rpmbuild -bb ceph.spec 打包的时候内部自动进行调用的

上面是rpm打包过程中进行的二进制缩小，那么如果我们是源码编译安装时候，如何缩小这个二进制，答案当然是可以的

## 源码编译安装的方式

./configure 后make生成的二进制文件就在./src下面了  
我们以ceph-mon为例进行抽离

这个-O3并没有影响到太多的生成的二进制的大小，—with-debug会有一定的影响，关键还是strip的这个操作  

<table><tbody><tr><td class="code"><pre><span class="line">./configure --with-debug  CXXFLAGS=-O3 CFLAGS=-O3 CCASFLAGS=-O3</span><br></pre></td></tr></tbody></table>

所以默认的就行

如果整体进行安装就使用make install-strip安装即可  

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># make install-strip</span></span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># ll /usr/local/bin/ceph-osd</span></span><br><span class="line">-rwxr-xr-x <span class="number">1</span> root root <span class="number">14266576</span> Mar <span class="number">23</span> <span class="number">17</span>:<span class="number">57</span> /usr/<span class="built_in">local</span>/bin/ceph-osd</span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># ll /usr/local/bin/ceph-osd -hl</span></span><br><span class="line">-rwxr-xr-x <span class="number">1</span> root root <span class="number">14</span>M Mar <span class="number">23</span> <span class="number">17</span>:<span class="number">57</span> /usr/<span class="built_in">local</span>/bin/ceph-osd</span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># ll src/ceph-osd -hl</span></span><br><span class="line">-rwxr-xr-x <span class="number">1</span> root root <span class="number">248</span>M Mar <span class="number">23</span> <span class="number">17</span>:<span class="number">54</span> src/ceph-osd</span><br></pre></td></tr></tbody></table>

## 关键的strip的用法

gcc编译的时候带上-g参数,就是添加了debug的信息

> gcc -g -o

### 分离debug information

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment">#objcopy --only-keep-debug src/ceph-osd src/ceph-osd.debug</span></span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># ll src/ceph-osd -hl</span></span><br><span class="line">-rwxr-xr-x <span class="number">1</span> root root <span class="number">248</span>M Mar <span class="number">23</span> <span class="number">17</span>:<span class="number">54</span> src/ceph-osd</span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># ll src/ceph-osd.debug -hl</span></span><br><span class="line">-rwxr-xr-x <span class="number">1</span> root root <span class="number">235</span>M Mar <span class="number">23</span> <span class="number">18</span>:<span class="number">08</span> src/ceph-osd.debug</span><br></pre></td></tr></tbody></table>

另外一种方法：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># cp src/ceph-osd src/ceph-osd.debug</span></span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># strip --only-keep-debug src/ceph-osd.debug</span></span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># ll src/ceph-osd.debug -hl</span></span><br><span class="line">-rwxr-xr-x <span class="number">1</span> root root <span class="number">235</span>M Mar <span class="number">23</span> <span class="number">18</span>:<span class="number">10</span> src/ceph-osd.debug</span><br></pre></td></tr></tbody></table>

### 从原始文件去掉 debug information

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># objcopy --strip-debug src/ceph-osd</span></span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># ll src/ceph-osd -hl</span></span><br><span class="line">-rwxr-xr-x <span class="number">1</span> root root <span class="number">18</span>M Mar <span class="number">23</span> <span class="number">18</span>:<span class="number">11</span> src/ceph-osd</span><br><span class="line">objcopy --strip-debug main</span><br></pre></td></tr></tbody></table>

另外一种方法：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># strip --strip-debug --strip-unneeded src/ceph-osd</span></span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># ll src/ceph-osd -hl</span></span><br><span class="line">-rwxr-xr-x <span class="number">1</span> root root <span class="number">14</span>M Mar <span class="number">23</span> <span class="number">18</span>:<span class="number">12</span> src/ceph-osd</span><br></pre></td></tr></tbody></table>

### 启用debuglink模式

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># objcopy --add-gnu-debuglink  src/ceph-osd.debug src/ceph-osd</span></span><br><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># gdb src/ceph-osd</span></span><br></pre></td></tr></tbody></table>

或者  

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph-<span class="number">10.2</span>.<span class="number">6</span>]<span class="comment"># gdb -s src/ceph-osd.debug -e src/ceph-osd</span></span><br></pre></td></tr></tbody></table>

## 总结

二进制包里面包含了debug的一些相关信息，可以通过strip的方式将内部的debug内容清理掉，这样就可以得到比较小的二进制包了

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-03-23 |

Source: zphj1987@gmail ([编译的Ceph二进制文件过大问题](http://www.zphj1987.com/2017/03/23/compile-ceph-binary-big/))
