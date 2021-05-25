---
title: "CTDB使用rados object作为lock file"
date: "2018-01-06"
author: "admin"
tags: 
  - "planet"
---

  
![object](images/object.jpg)  

## 前言

服务器的服务做HA有很多种方式，其中有一种就是是用CTDB，之前这个是独立的软件来做HA的，现在已经跟着SAMBA主线里面了，也就是跟着samba发行包一起发行

之前CTDB的模式是需要有一个共享文件系统，并且在这个共享文件系统里面所有的节点都去访问同一个文件，会有一个Master会获得这个文件的锁

在cephfs的使用场景中可以用cephfs的目录作为这个锁文件的路径，这个有个问题就是一旦有一个节点down掉的时候，可能客户端也会卡住目录，这个目录访问会被卡住，文件锁在其他机器无法获取到，需要等到这个锁超时以后，其它节点才能获得到锁，这个切换的周期就会长一点了

CTDB在最近的版本当中加入了cluster mutex helper using Ceph RADOS的支持，本篇将介绍这个方式锁文件配置方式  

## 实践过程

### 安装CTDB

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># yum install samba ctdb</span></span><br></pre></td></tr></tbody></table>

检查默认包里面是否有rados的支持  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># rpm -qpl ctdb-4.6.2-12.el7_4.x86_64.rpm</span></span><br><span class="line">…</span><br><span class="line">usr/libexec/ctdb</span><br><span class="line">/usr/libexec/ctdb/ctdb_event</span><br><span class="line">/usr/libexec/ctdb/ctdb_eventd</span><br><span class="line">/usr/libexec/ctdb/ctdb_killtcp</span><br><span class="line">/usr/libexec/ctdb/ctdb_lock_helper</span><br><span class="line">/usr/libexec/ctdb/ctdb_lvs</span><br><span class="line">/usr/libexec/ctdb/ctdb_mutex_fcntl_helper</span><br><span class="line">/usr/libexec/ctdb/ctdb_natgw</span><br><span class="line">/usr/libexec/ctdb/ctdb_recovery_helper</span><br><span class="line">/usr/libexec/ctdb/ctdb_takeover_helper</span><br><span class="line">/usr/libexec/ctdb/smnotify</span><br><span class="line">…</span><br></pre></td></tr></tbody></table>

这个可以看到默认并没有包含这个rados的支持，这个很多通用软件都会这么处理，因为支持第三方插件的时候需要开发库，而开发库又有版本的区别，所以默认并不支持，需要支持就自己编译即可，例如fio支持librbd的接口就是这么处理的，等到插件也通用起来的时候，可能就会默认支持了

很多软件的编译可以采取源码的编译方式，如果不是有很强的代码合入和patch跟踪能力，直接用发行包的方式是最稳妥的，所以为了不破坏这个稳定性，本篇采用的是基于发行版本，增加模块的方式，这样不会破坏核心组件的稳定性，并且后续升级也是比较简单的，这个也是个人推荐的方式

查询当前使用的samba版本  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># rpm -qa|grep samba</span></span><br><span class="line">samba-<span class="number">4.6</span>.<span class="number">2</span>-<span class="number">12</span>.el7_4.x86_64</span><br></pre></td></tr></tbody></table>

### 打包新的CTDB

可以查询得到这个的源码包为samba-4.6.2-12.el7\_4.src.rpm,进一步搜索可以查询的到这个src源码rpm包  

<table><tbody><tr><td class="code"><pre><span class="line">http://vault.centos.org/<span class="number">7.4</span>.<span class="number">1708</span>/updates/Source/SPackages/samba-<span class="number">4.6</span>.<span class="number">2</span>-<span class="number">12</span>.el7_4.src.rpm</span><br></pre></td></tr></tbody></table>

下载这个rpm包  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># wget http://vault.centos.org/7.4.1708/updates/Source/SPackages/samba-4.6.2-12.el7_4.src.rpm</span></span><br></pre></td></tr></tbody></table>

如果下载比较慢的话就用迅雷下载，会快很多，国内的源里面把源码包的rpm都删除掉了，上面的是官网会有最全的包

解压这个rpm包  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># rpm2cpio samba-4.6.2-12.el7_4.src.rpm |cpio -div</span></span><br></pre></td></tr></tbody></table>

检查包的内容  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos myctdb]<span class="comment"># ls</span></span><br><span class="line">CVE-<span class="number">2017</span>-<span class="number">12150</span>.patch                                 samba-v4-<span class="number">6</span>-fix-cross-realm-refferals.patch</span><br><span class="line">CVE-<span class="number">2017</span>-<span class="number">12151</span>.patch                                 samba-v4-<span class="number">6</span>-fix-kerberos-debug-message.patch</span><br><span class="line">CVE-<span class="number">2017</span>-<span class="number">12163</span>.patch                                 samba-v4-<span class="number">6</span>-fix_net_ads_changetrustpw.patch</span><br><span class="line">CVE-<span class="number">2017</span>-<span class="number">14746</span>.patch                                 samba-v4-<span class="number">6</span>-fix-net-ads-keytab-handling.patch</span><br><span class="line">CVE-<span class="number">2017</span>-<span class="number">15275</span>.patch                                 samba-v4-<span class="number">6</span>-fix_path_substitutions.patch</span><br><span class="line">CVE-<span class="number">2017</span>-<span class="number">7494</span>.patch                                  samba-v4-<span class="number">6</span>-fix_smbclient_session_setup_info.patch</span><br><span class="line">gpgkey-<span class="number">52</span>FBC0B86D954B0843324CDC6F33915B6568B7EA.gpg  samba-v4-<span class="number">6</span>-fix_smbclient_username_parsing.patch</span><br><span class="line">pam_winbind.conf                                     samba-v4.<span class="number">6</span>-fix_smbpasswd_user_<span class="built_in">pwd</span>_change.patch</span><br><span class="line">README.dc                                            samba-v4-<span class="number">6</span>-fix-spoolss-<span class="number">32</span>bit-driver-upload.patch</span><br><span class="line">README.downgrade                                     samba-v4-<span class="number">6</span>-fix-vfs-expand-msdfs.patch</span><br><span class="line">samba-<span class="number">4.6</span>.<span class="number">2</span>-<span class="number">12</span>.el7_4.src.rpm                         samba-v4-<span class="number">6</span>-fix_winbind_child_crash.patch</span><br><span class="line">samba-<span class="number">4.6</span>.<span class="number">2</span>.tar.asc                                  samba-v4-<span class="number">6</span>-fix_winbind_normalize_names.patch</span><br><span class="line">samba-<span class="number">4.6</span>.<span class="number">2</span>.tar.xz                                   samba-v4.<span class="number">6</span>-graceful_fsctl_validate_negotiate_info.patch</span><br><span class="line">samba.log                                            samba-v4.<span class="number">6</span>-gss_krb5_import_cred.patch</span><br><span class="line">samba.pamd                                           samba-v4.<span class="number">6</span>-lib-crypto-implement-samba.crypto-Python-module-for-.patch</span><br><span class="line">samba.spec                                           samba-v4.<span class="number">7</span>-config-dynamic-rpc-port-range.patch</span><br><span class="line">samba-v4.<span class="number">6</span>-credentials-fix-realm.patch               smb.conf.example</span><br><span class="line">samba-v4-<span class="number">6</span>-fix-building-with-new-glibc.patch         smb.conf.vendor</span><br></pre></td></tr></tbody></table>

可以看到在源码包基础上还打入了很多的patch，内部的编译采用的是waf编译的方式，内部的过程就不做太多介绍了，这里只去改动我们需要的部分即可，也就是去修改samba.spec文件

我们先获取相关的编译选项，这个我最开始的时候打算独立编译ctdb的rpm包，发现有依赖关系太多，后来多次验证后，发现直接可以在samba编译里面增加选项的，选项获取方式  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab211 samba-<span class="number">4.6</span>.<span class="number">2</span>]<span class="comment"># ./configure --help|grep ceph</span></span><br><span class="line">  --with-libcephfs=LIBCEPHFS_DIR</span><br><span class="line">            Directory under <span class="built_in">which</span> libcephfs is installed</span><br><span class="line">  --enable-cephfs</span><br><span class="line">            Build with cephfs support (default=yes)</span><br><span class="line">  --enable-ceph-reclock</span><br></pre></td></tr></tbody></table>

这个可以知道需要添加ceph-reclock的支持就添加这个选项，我们把这个选项添加到samba.spec当中  
修改samba.spec文件  

<table><tbody><tr><td class="code"><pre><span class="line">…</span><br><span class="line">%configure </span><br><span class="line">        --enable-fhs </span><br><span class="line">        --with-piddir=/run </span><br><span class="line">        --with-sockets-dir=/run/samba </span><br><span class="line">        --with-modulesdir=%{_libdir}/samba </span><br><span class="line">        --with-pammodulesdir=%{_libdir}/security </span><br><span class="line">        --with-lockdir=/var/lib/samba/lock </span><br><span class="line">        --with-statedir=/var/lib/samba </span><br><span class="line">        --with-cachedir=/var/lib/samba </span><br><span class="line">        --disable-rpath-install </span><br><span class="line">        --with-shared-modules=%{_samba4_modules} </span><br><span class="line">        --bundled-libraries=%{_samba4_libraries} </span><br><span class="line">        --with-pam </span><br><span class="line">        --with-pie </span><br><span class="line">        --with-relro </span><br><span class="line">        --enable-ceph-reclock </span><br><span class="line">        --without-fam </span><br><span class="line">…</span><br><span class="line">%dir %{_libexecdir}/ctdb</span><br><span class="line">%{_libexecdir}/ctdb/ctdb_event</span><br><span class="line">%{_libexecdir}/ctdb/ctdb_eventd</span><br><span class="line">%{_libexecdir}/ctdb/ctdb_killtcp</span><br><span class="line">%{_libexecdir}/ctdb/ctdb_lock_helper</span><br><span class="line">%{_libexecdir}/ctdb/ctdb_lvs</span><br><span class="line">%{_libexecdir}/ctdb/ctdb_mutex_fcntl_helper</span><br><span class="line">%{_libexecdir}/ctdb/ctdb_mutex_ceph_rados_helper</span><br><span class="line">…</span><br><span class="line">%{_mandir}/man1/ctdb.<span class="number">1</span>.gz</span><br><span class="line">%{_mandir}/man1/ctdb_diagnostics.<span class="number">1</span>.gz</span><br><span class="line">%{_mandir}/man1/ctdbd.<span class="number">1</span>.gz</span><br><span class="line">%{_mandir}/man1/onnode.<span class="number">1</span>.gz</span><br><span class="line">%{_mandir}/man1/ltdbtool.<span class="number">1</span>.gz</span><br><span class="line">%{_mandir}/man1/ping_pong.<span class="number">1</span>.gz</span><br><span class="line">%{_mandir}/man7/ctdb_mutex_ceph_rados_helper.<span class="number">7</span>.gz</span><br><span class="line">%{_mandir}/man1/ctdbd_wrapper.<span class="number">1</span>.gz</span><br><span class="line">…</span><br></pre></td></tr></tbody></table>

这个文件当中一共添加了三行内容  

<table><tbody><tr><td class="code"><pre><span class="line">--enable-ceph-reclock </span><br><span class="line">%{_libexecdir}/ctdb/ctdb_mutex_ceph_rados_helper</span><br><span class="line">%{_mandir}/man7/ctdb_mutex_ceph_rados_helper.<span class="number">7</span>.gz</span><br></pre></td></tr></tbody></table>

把解压后的目录里面的所有文件都拷贝到源码编译目录,就是上面ls列出的那些文件，以及修改好的samba.spec文件都一起拷贝过去  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos myctdb]<span class="comment"># cp -ra * /root/rpmbuild/SOURCES/</span></span><br></pre></td></tr></tbody></table>

安装librados2的devel包  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos myctdb]<span class="comment"># yum install librados2-devel</span></span><br></pre></td></tr></tbody></table>

如果编译过程缺其他的依赖包就依次安装即可，这个可以通过解压源码先编译一次的方式来把依赖包找全，然后再打rpm包

开始编译rpm包  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos myctdb]<span class="comment"># rpmbuild -bb samba.spec</span></span><br></pre></td></tr></tbody></table>

这个可以就在当前的目录执行即可

检查生成的包  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos myctdb]<span class="comment"># rpm -qpl /root/rpmbuild/RPMS/x86_64/ctdb-4.6.2-12.el7.centos.x86_64.rpm|grep rados</span></span><br><span class="line">/usr/libexec/ctdb/ctdb_mutex_ceph_rados_helper</span><br><span class="line">/usr/share/man/man7/ctdb_mutex_ceph_rados_helper.<span class="number">7</span>.gz</span><br></pre></td></tr></tbody></table>

可以看到已经生成了这个，把这个包拷贝到需要更新的机器上面

### 配置ctdb

首先要升级安装下新的ctdb包，因为名称有改变，会提示依赖问题,这里忽略依赖的问题  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># rpm -Uvh ctdb-4.6.2-12.el7.centos.x86_64.rpm --nodeps</span></span><br></pre></td></tr></tbody></table>

添加一个虚拟IP配置  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># cat /etc/ctdb/public_addresses </span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">0.99</span>/<span class="number">16</span> ens33</span><br></pre></td></tr></tbody></table>

添加node配置  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># cat /etc/ctdb/nodes </span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">0.18</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">0.201</span></span><br></pre></td></tr></tbody></table>

修改配置文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># cat /etc/ctdb/ctdbd.conf|grep -v "#"</span></span><br><span class="line"> CTDB_RECOVERY_LOCK=<span class="string">"!/usr/libexec/ctdb/ctdb_mutex_ceph_rados_helper ceph client.admin rbd lockctdb"</span></span><br><span class="line"> CTDB_NODES=/etc/ctdb/nodes</span><br><span class="line"> CTDB_PUBLIC_ADDRESSES=/etc/ctdb/public_addresses</span><br><span class="line"> CTDB_LOGGING=file:/var/<span class="built_in">log</span>/log.ctdb</span><br><span class="line"><span class="comment"># CTDB_DEBUGLEVEL=debug</span></span><br></pre></td></tr></tbody></table>

上面为了调试，我开启了debug来查看重要的信息

> CTDB\_RECOVERY\_LOCK=”!/usr/libexec/ctdb/ctdb\_mutex\_ceph\_rados\_helper ceph client.admin rbd lockctdb”  
> 最重要的是这行配置文件规则是  
> 
> <table><tbody><tr><td class="code"><pre><span class="line">CTDB_RECOVERY_LOCK=<span class="string">"!/usr/libexec/ctdb/ctdb_mutex_ceph_rados_helper [Cluster] [User] [Pool] [Object]"</span></span><br><span class="line">Cluster: Ceph cluster name (e.g. ceph)</span><br><span class="line">User: Ceph cluster user name (e.g. client.admin)</span><br><span class="line">Pool: Ceph RADOS pool name</span><br><span class="line">Object: Ceph RADOS object name</span><br></pre></td></tr></tbody></table>

在ctdb的机器上面准备好librados2和ceph配置文件，这个配置的rbd的lockctdb对象会由ctdb去生成  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ~]<span class="comment"># systemctl restart ctdb</span></span><br></pre></td></tr></tbody></table>

配置好了以后就可以启动进程了，上面的/etc/ctdb/ctdbd.conf配置文件最好是修改好一台机器的，然后scp到其它机器，里面内容有一点点偏差都会判断为异常的，所以最好是相同的配置文件

查看进程状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@customos ceph]<span class="comment"># ctdb status</span></span><br><span class="line">Number of nodes:<span class="number">2</span></span><br><span class="line">pnn:<span class="number">0</span> <span class="number">192.168</span>.<span class="number">0.18</span>     OK (THIS NODE)</span><br><span class="line">pnn:<span class="number">1</span> <span class="number">192.168</span>.<span class="number">0.201</span>    OK</span><br><span class="line">Generation:<span class="number">1662303628</span></span><br><span class="line">Size:<span class="number">2</span></span><br><span class="line"><span class="built_in">hash</span>:<span class="number">0</span> lmaster:<span class="number">0</span></span><br><span class="line"><span class="built_in">hash</span>:<span class="number">1</span> lmaster:<span class="number">1</span></span><br><span class="line">Recovery mode:NORMAL (<span class="number">0</span>)</span><br><span class="line">Recovery master:<span class="number">1</span></span><br></pre></td></tr></tbody></table>

查看/var/log/log.ctdb日志  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">2018</span>/<span class="number">01</span>/<span class="number">06</span> <span class="number">23</span>:<span class="number">18</span>:<span class="number">11.399849</span> ctdb-recoverd[<span class="number">129134</span>]: Node:<span class="number">1</span> was <span class="keyword">in</span> recovery mode. Start recovery process</span><br><span class="line"><span class="number">2018</span>/<span class="number">01</span>/<span class="number">06</span> <span class="number">23</span>:<span class="number">18</span>:<span class="number">11.399879</span> ctdb-recoverd[<span class="number">129134</span>]: ../ctdb/server/ctdb_recoverd.c:<span class="number">1267</span> Starting <span class="keyword">do</span>_recovery</span><br><span class="line"><span class="number">2018</span>/<span class="number">01</span>/<span class="number">06</span> <span class="number">23</span>:<span class="number">18</span>:<span class="number">11.399903</span> ctdb-recoverd[<span class="number">129134</span>]: Attempting to take recovery lock (!/usr/libexec/ctdb/ctdb_mutex_ceph_rados_helper ceph client.admin rbd lockctdb)</span><br><span class="line"><span class="number">2018</span>/<span class="number">01</span>/<span class="number">06</span> <span class="number">23</span>:<span class="number">18</span>:<span class="number">11.400657</span> ctdb-recoverd[<span class="number">129134</span>]: ../ctdb/server/ctdb_cluster_mutex.c:<span class="number">251</span> Created PIPE FD:<span class="number">17</span></span><br><span class="line"><span class="number">2018</span>/<span class="number">01</span>/<span class="number">06</span> <span class="number">23</span>:<span class="number">18</span>:<span class="number">11.579865</span> ctdbd[<span class="number">129038</span>]: ../ctdb/server/ctdb_daemon.c:<span class="number">907</span> client request <span class="number">40</span> of <span class="built_in">type</span> <span class="number">7</span> length <span class="number">72</span> from node <span class="number">1</span> to <span class="number">4026531841</span></span><br></pre></td></tr></tbody></table>

日志中可以看到ctdb-recoverd已经是采用的ctdb\_mutex\_ceph\_rados\_helper来获取的recovery lock

停掉ctdb的进程，IP可以正常的切换，到这里，使用对象作为lock文件的功能就实现了，其他更多的ctdb的高级控制就不在这个里作过多的说明

## 总结

本篇是基于发行版本的ctdb包进行模块的加入重新发包，并且把配置做了一次实践，这个可以作为一个ctdb的方案之一，具体跟之前的方案相比切换时间可以改善多少，需要通过数据进行对比，这个进行测试即可

## 资源

已经打好包的ctdb共享一下，可以直接使用

> [http://7xweck.com1.z0.glb.clouddn.com/ctdb-4.6.2-12.el7.centos.x86\_64.rpm](http://7xweck.com1.z0.glb.clouddn.com/ctdb-4.6.2-12.el7.centos.x86_64.rpm)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-01-06 |

Source: zphj1987@gmail ([CTDB使用rados object作为lock file](http://www.zphj1987.com/2018/01/06/CTDB-use-rados-object-as-lock-file/))
