---
title: "ceph的ISCSI GATEWAY"
date: "2018-04-11"
author: "admin"
tags: 
  - "planet"
---

  
  
![gateway](images/gateway.jpg)  
  

## 前言

最开始接触这个是在L版本的监控平台里面看到的，有个iscsi网关，但是没看到有类似的介绍，然后通过接口查询到了一些资料，当时由于有比较多的东西需要新内核，新版本的支持，所以并没有配置出来，由于内核已经更新迭代了几个小版本了，经过测试验证可以跑起来了，这里只是把东西跑起来，性能相关的对比需要根据去做

## 实践过程

### 架构图

![Ceph_iSCSI_HA_424879_1116_ECE-01.png-79.4kB](images/Ceph_iSCSI_HA_424879_1116_ECE-01.png)

这个图是引用的红帽的架构图，可以理解为一个多路径的实现方式，那么这个跟之前的有什么不同

主要是有个新的tcmu-runner来处理LIO TCM后端存储的用户空间端的守护进程，这个是在内核之上多了一个用户态的驱动层，这样只需要根据tcmu的标准来对接接口就可以了，而不用去直接跟内核进行交互

### 需要的软件

Ceph Luminous 版本的集群或者更新的版本  
RHEL/CentOS 7.5或者Linux kernel v4.16或者更新版本的内核  
其他控制软件

> targetcli-2.1.fb47 or newer package  
> ython-rtslib-2.1.fb64 or newer package  
> cmu-runner-1.3.0 or newer package  
> eph-iscsi-config-2.4 or newer package  
> eph-iscsi-cli-2.5 or newer package

以上为配置这个环境需要的软件，下面为我使用的版本的软件，统一打包放在一个下载路径  
我安装的版本如下：

> kernel-4.16.0-0.rc5.git0.1  
> targetcli-fb-2.1.fb48  
> python-rtslib-2.1.67  
> tcmu-runner-1.3.0-rc4  
> ceph-iscsi-config-2.5  
> ceph-iscsi-cli-2.6

下载链接：

> 链接:[https://pan.baidu.com/s/12OwR5ZNtWFW13feLXy3Ezg](https://pan.baidu.com/s/12OwR5ZNtWFW13feLXy3Ezg) 密码:m09k

如果环境之前有安装过其他版本，需要先卸载掉，并且需要提前部署好一个Luminous 最新版本的集群  
官方建议调整的参数  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># ceph tell osd.* injectargs '--osd_client_watch_timeout 15'</span></span><br><span class="line"><span class="comment"># ceph tell osd.* injectargs '--osd_heartbeat_grace 20'</span></span><br><span class="line"><span class="comment"># ceph tell osd.* injectargs '--osd_heartbeat_interval 5'</span></span><br></pre></td></tr></tbody></table>

### 配置过程

创建一个存储池  
需要用到rbd存储池，用来存储iscsi的配置文件，提前创建好一个名字是rbd的存储池

创建iscsi-gateway配置文件  

<table><tbody><tr><td class="code"><pre><span class="line">touch /etc/ceph/iscsi-gateway.cfg</span><br></pre></td></tr></tbody></table>

修改iscsi-gateway.cfg配置文件  

<table><tbody><tr><td class="code"><pre><span class="line">[config]</span><br><span class="line"><span class="comment"># Name of the Ceph storage cluster. A suitable Ceph configuration file allowing</span></span><br><span class="line"><span class="comment"># access to the Ceph storage cluster from the gateway node is required, if not</span></span><br><span class="line"><span class="comment"># colocated on an OSD node.</span></span><br><span class="line">cluster_name = ceph</span><br><span class="line"></span><br><span class="line"><span class="comment"># Place a copy of the ceph cluster's admin keyring in the gateway's /etc/ceph</span></span><br><span class="line"><span class="comment"># drectory and reference the filename here</span></span><br><span class="line">gateway_keyring = ceph.client.admin.keyring</span><br><span class="line"></span><br><span class="line"></span><br><span class="line"><span class="comment"># API settings.</span></span><br><span class="line"><span class="comment"># The API supports a number of options that allow you to tailor it to your</span></span><br><span class="line"><span class="comment"># local environment. If you want to run the API under https, you will need to</span></span><br><span class="line"><span class="comment"># create cert/key files that are compatible for each iSCSI gateway node, that is</span></span><br><span class="line"><span class="comment"># not locked to a specific node. SSL cert and key files *must* be called</span></span><br><span class="line"><span class="comment"># 'iscsi-gateway.crt' and 'iscsi-gateway.key' and placed in the '/etc/ceph/' directory</span></span><br><span class="line"><span class="comment"># on *each* gateway node. With the SSL files in place, you can use 'api_secure = true'</span></span><br><span class="line"><span class="comment"># to switch to https mode.</span></span><br><span class="line"></span><br><span class="line"><span class="comment"># To support the API, the bear minimum settings are:</span></span><br><span class="line">api_secure = <span class="literal">false</span></span><br><span class="line"></span><br><span class="line"><span class="comment"># Additional API configuration options are as follows, defaults shown.</span></span><br><span class="line"><span class="comment"># api_user = admin</span></span><br><span class="line"><span class="comment"># api_password = admin</span></span><br><span class="line"><span class="comment"># api_port = 5001</span></span><br><span class="line"><span class="comment"># trusted_ip_list = 192.168.0.10,192.168.0.11</span></span><br></pre></td></tr></tbody></table>

最后一行的trusted\_ip\_list修改为用来配置网关的主机IP，我的环境为

> trusted\_ip\_list =192.168.219.128,192.168.219.129

所有网关节点的这个配置文件的内容需要一致，修改好一台直接scp到每个网关节点上

启动API服务  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 install]<span class="comment"># systemctl daemon-reload</span></span><br><span class="line">[root@lab101 install]<span class="comment"># systemctl enable rbd-target-api</span></span><br><span class="line">[root@lab101 install]<span class="comment"># systemctl start rbd-target-api</span></span><br><span class="line">[root@lab101 install]<span class="comment"># systemctl status rbd-target-api</span></span><br><span class="line">● rbd-target-api.service - Ceph iscsi target configuration API</span><br><span class="line">   Loaded: loaded (/usr/lib/systemd/system/rbd-target-api.service; enabled; vendor preset: disabled)</span><br><span class="line">   Active: active (running) since Thu <span class="number">2018</span>-<span class="number">03</span>-<span class="number">15</span> <span class="number">09</span>:<span class="number">44</span>:<span class="number">34</span> CST; <span class="number">18</span>min ago</span><br><span class="line"> Main PID: <span class="number">1493</span> (rbd-target-api)</span><br><span class="line">   CGroup: /system.slice/rbd-target-api.service</span><br><span class="line">           └─<span class="number">1493</span> /usr/bin/python /usr/bin/rbd-target-api</span><br><span class="line"></span><br><span class="line">Mar <span class="number">15</span> <span class="number">09</span>:<span class="number">44</span>:<span class="number">34</span> lab101 systemd[<span class="number">1</span>]: Started Ceph iscsi target configuration API.</span><br><span class="line">Mar <span class="number">15</span> <span class="number">09</span>:<span class="number">44</span>:<span class="number">34</span> lab101 systemd[<span class="number">1</span>]: Starting Ceph iscsi target configuration API...</span><br><span class="line">Mar <span class="number">15</span> <span class="number">09</span>:<span class="number">44</span>:<span class="number">58</span> lab101 rbd-target-api[<span class="number">1493</span>]: Started the configuration object watcher</span><br><span class="line">Mar <span class="number">15</span> <span class="number">09</span>:<span class="number">44</span>:<span class="number">58</span> lab101 rbd-target-api[<span class="number">1493</span>]: Checking <span class="keyword">for</span> config object changes every <span class="number">1</span>s</span><br><span class="line">Mar <span class="number">15</span> <span class="number">09</span>:<span class="number">44</span>:<span class="number">58</span> lab101 rbd-target-api[<span class="number">1493</span>]:  * Running on http://<span class="number">0.0</span>.<span class="number">0.0</span>:<span class="number">5000</span>/</span><br></pre></td></tr></tbody></table>

配置iscsi  
执行gwcli命令  
![image.png-23kB](images/image.png)

默认是这样的

进入icsi-target创建一个target  

<table><tbody><tr><td class="code"><pre><span class="line">/&gt; <span class="built_in">cd</span> iscsi-target </span><br><span class="line">/iscsi-target&gt; create iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw</span><br><span class="line">ok</span><br></pre></td></tr></tbody></table>

创建iSCSI网关。以下使用的IP是用于iSCSI数据传输的IP,它们可以与trusted\_ip\_list中列出的用于管理操作的IP相同，也可以不同，看有没有做多网卡分离  

<table><tbody><tr><td class="code"><pre><span class="line">/iscsi-target&gt; <span class="built_in">cd</span> iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw/</span><br><span class="line">/iscsi-target...-gw:iscsi-igw&gt; <span class="built_in">cd</span> gateways </span><br><span class="line">/iscsi-target...-igw/gateways&gt; create lab101 <span class="number">192.168</span>.<span class="number">219.128</span> skipchecks=<span class="literal">true</span></span><br><span class="line">OS version/package checks have been bypassed</span><br><span class="line">Adding gateway, syncing <span class="number">0</span> disk(s) and <span class="number">0</span> client(s)</span><br><span class="line">  /iscsi-target...-igw/gateways&gt; create lab102 <span class="number">192.168</span>.<span class="number">219.129</span> skipchecks=<span class="literal">true</span></span><br><span class="line">OS version/package checks have been bypassed</span><br><span class="line">Adding gateway, sync<span class="string">'ing 0 disk(s) and 0 client(s)</span><br><span class="line">ok</span><br><span class="line">/iscsi-target...-igw/gateways&gt; ls</span><br><span class="line">o- gateways ............. [Up: 2/2, Portals: 2]</span><br><span class="line">  o- lab101 ............. [192.168.219.128 (UP)]</span><br><span class="line">  o- lab102 ............. [192.168.219.129 (UP)]</span></span><br></pre></td></tr></tbody></table>

创建一个rbd设备disk\_1  

<table><tbody><tr><td class="code"><pre><span class="line">/iscsi-target...-igw/gateways&gt; <span class="built_in">cd</span> /disks </span><br><span class="line">/disks&gt; create pool=rbd image=disk_1 size=<span class="number">100</span>G</span><br><span class="line">ok</span><br></pre></td></tr></tbody></table>

创建一个客户端名称iqn.1994-05.com.redhat:75c3d5efde0  

<table><tbody><tr><td class="code"><pre><span class="line">/disks&gt; <span class="built_in">cd</span> /iscsi-target/iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw/hosts </span><br><span class="line">/iscsi-target...csi-igw/hosts&gt; create iqn.<span class="number">1994</span>-<span class="number">05</span>.com.redhat:<span class="number">75</span>c3d5efde0</span><br><span class="line">ok</span><br></pre></td></tr></tbody></table>

创建chap的用户名密码，由于用户名密码都有特殊要求，如果你不确定，就按我给的去设置，并且chap必须设置，否则服务端是禁止连接的  

<table><tbody><tr><td class="code"><pre><span class="line">/iscsi-target...t:<span class="number">75</span>c3d5efde0&gt; auth chap=iqn.<span class="number">1994</span>-<span class="number">05</span>.com.redhat:<span class="number">75</span>c3d5efde0/admin@a_12a-bb</span><br><span class="line">ok</span><br></pre></td></tr></tbody></table>

chap的命名规则可以这样查询  

<table><tbody><tr><td class="code"><pre><span class="line">/iscsi-target...t:<span class="number">75</span>c3d5efde0&gt; <span class="built_in">help</span> auth</span><br><span class="line"></span><br><span class="line">SYNTAX</span><br><span class="line">======</span><br><span class="line">auth [chap] </span><br><span class="line"></span><br><span class="line"></span><br><span class="line">DESCRIPTION</span><br><span class="line">===========</span><br><span class="line"></span><br><span class="line">Client authentication can be <span class="built_in">set</span> to use CHAP by supplying the</span><br><span class="line">a string of the form &lt;username&gt;/&lt;password&gt;</span><br><span class="line"></span><br><span class="line">e.g.</span><br><span class="line">auth chap=username/password | nochap</span><br><span class="line"></span><br><span class="line">username ... the username is <span class="number">8</span>-<span class="number">64</span> character string. Each character</span><br><span class="line">             may either be an alphanumeric or use one of the following</span><br><span class="line">             special characters .,:,-,@.</span><br><span class="line">             Consider using the hosts <span class="string">'shortname'</span> or the initiators IQN</span><br><span class="line">             value as the username</span><br><span class="line"></span><br><span class="line">password ... the password must be between <span class="number">12</span>-<span class="number">16</span> chars <span class="keyword">in</span> length</span><br><span class="line">             containing alphanumeric characters, plus the following</span><br><span class="line">             special characters @,_,-</span><br><span class="line"></span><br><span class="line">WARNING: Using unsupported special characters may result <span class="keyword">in</span> truncation,</span><br><span class="line">         resulting <span class="keyword">in</span> failed logins.</span><br><span class="line"></span><br><span class="line"></span><br><span class="line">Specifying <span class="string">'nochap'</span> will remove chap authentication <span class="keyword">for</span> the client</span><br><span class="line">across all gateways.</span><br></pre></td></tr></tbody></table>

增加磁盘到客户端  

<table><tbody><tr><td class="code"><pre><span class="line">/iscsi-target...t:<span class="number">75</span>c3d5efde0&gt; disk add rbd.disk_1</span><br><span class="line">ok</span><br></pre></td></tr></tbody></table>

到这里就配置完成了，我们看下最终应该是怎么样的  
![image.png-38.5kB](images/image.png)

## windows客户端配置

这个地方我配置的时候用的win10配置的时候出现了无法连接的情况，可能是windows10自身的认证要求跟服务端冲突了，这里用windows server 2016 进行连接测试

windows server开启下Multipath IO

修改windows iscsi客户端的名称  
![image.png-47.5kB](images/image.png)  
修改为上面创建的客户端名称

发现门户  
![image.png-37.7kB](images/image.png)  
点击发现门户，填写好服务端的IP后直接点确定，这里先不用高级里面的配置

![image.png-35.1kB](images/image.png)

这个时候目标里面已经有一个发现的目标了，显示状态是不活动的，准备点击连接

![image.png-80.7kB](images/image.png)  
点击高级，选择门户IP，填写chap登陆信息，然后chap名称就是上面设置的用户名称，因为跟客户端名称设置的一致，也就是客户端的名称，密码就是上面设置的admin@a\_12a-bb

![image.png-21.9kB](images/image.png)

切换到卷和设备，点击自动配置  
![image.png-47.4kB](images/image.png)

可以看到已经装载设备了

在服务管理器，文件存储服务，卷，磁盘里面查看设备  
![image.png-92.8kB](images/image.png)

可以看到是配置的LIO-ORG TCMU设备，对设备进行格式化即可

![image.png-42.6kB](images/image.png)

完成了连接了

## Linux的客户端连接

Linux客户端选择建议就选择3.10默认内核，选择高版本的内核的时候在配置多路径的时候碰到内核崩溃的问题

安装连接软件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ~]<span class="comment"># yum install iscsi-initiator-utils</span></span><br><span class="line">[root@lab103 ~]<span class="comment"># yum install device-mapper-multipath</span></span><br></pre></td></tr></tbody></table>

配置多路径

开启服务  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ~]<span class="comment"># mpathconf --enable --with_multipathd y</span></span><br></pre></td></tr></tbody></table>

修改配置文件/etc/multipath.conf  

<table><tbody><tr><td class="code"><pre><span class="line">devices {</span><br><span class="line">        device {</span><br><span class="line">                vendor                 <span class="string">"LIO-ORG"</span></span><br><span class="line">                hardware_handler       <span class="string">"1 alua"</span></span><br><span class="line">                path_grouping_policy   <span class="string">"failover"</span></span><br><span class="line">                path_selector          <span class="string">"queue-length 0"</span></span><br><span class="line">                failback               <span class="number">60</span></span><br><span class="line">                path_checker           tur</span><br><span class="line">                prio                   alua</span><br><span class="line">                prio_args              exclusive_pref_bit</span><br><span class="line">                fast_io_fail_tmo       <span class="number">25</span></span><br><span class="line">                no_path_retry          queue</span><br><span class="line">        }</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

重启多路径服务  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ~]<span class="comment"># systemctl reload multipathd</span></span><br></pre></td></tr></tbody></table>

配置chap的认证

修改配置客户端的名称为上面设置的名称  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ~]<span class="comment"># cat /etc/iscsi/initiatorname.iscsi </span></span><br><span class="line">InitiatorName=iqn.<span class="number">1994</span>-<span class="number">05</span>.com.redhat:<span class="number">75</span>c3d5efde0</span><br></pre></td></tr></tbody></table>

修改认证的配置文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ~]<span class="comment"># cat /etc/iscsi/iscsid.conf |grep "node.session.auth.username|node.session.auth.password|node.session.auth.authmethod"</span></span><br><span class="line">node.session.auth.authmethod = CHAP</span><br><span class="line">node.session.auth.username = iqn.<span class="number">1994</span>-<span class="number">05</span>.com.redhat:<span class="number">75</span>c3d5efde0</span><br><span class="line">node.session.auth.password = admin@a_12a-bb</span><br></pre></td></tr></tbody></table>

查询iscsi target  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ~]<span class="comment"># iscsiadm -m discovery -t st -p 192.168.219.128</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">219.128</span>:<span class="number">3260</span>,<span class="number">1</span> iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw</span><br><span class="line"><span class="number">192.168</span>.<span class="number">219.129</span>:<span class="number">3260</span>,<span class="number">2</span> iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw</span><br></pre></td></tr></tbody></table>

连接target  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ~]<span class="comment"># iscsiadm -m node -T iqn.2003-01.com.redhat.iscsi-gw:iscsi-igw -l</span></span><br><span class="line">Logging <span class="keyword">in</span> to [iface: default, target: iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw, portal: <span class="number">192.168</span>.<span class="number">219.129</span>,<span class="number">3260</span>] (multiple)</span><br><span class="line">Logging <span class="keyword">in</span> to [iface: default, target: iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw, portal: <span class="number">192.168</span>.<span class="number">219.129</span>,<span class="number">3260</span>] (multiple)</span><br><span class="line">Login to [iface: default, target: iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw, portal: <span class="number">192.168</span>.<span class="number">219.129</span>,<span class="number">3260</span>] successful.</span><br><span class="line">Login to [iface: default, target: iqn.<span class="number">2003</span>-<span class="number">01</span>.com.redhat.iscsi-gw:iscsi-igw, portal: <span class="number">192.168</span>.<span class="number">219.129</span>,<span class="number">3260</span>] successful.</span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># multipath -ll</span></span><br><span class="line">mpathb (<span class="number">360014052</span><span class="built_in">fc</span>39ba627874fdba9aefcf6c) dm-<span class="number">4</span> LIO-ORG ,TCMU device     </span><br><span class="line">size=<span class="number">100</span>G features=<span class="string">'1 queue_if_no_path'</span> hwhandler=<span class="string">'1 alua'</span> wp=rw</span><br><span class="line">|-+- policy=<span class="string">'queue-length 0'</span> prio=<span class="number">10</span> status=active</span><br><span class="line">| `- <span class="number">5</span>:<span class="number">0</span>:<span class="number">0</span>:<span class="number">0</span> sdc <span class="number">8</span>:<span class="number">32</span> active ready running</span><br><span class="line">`-+- policy=<span class="string">'queue-length 0'</span> prio=<span class="number">10</span> status=enabled</span><br><span class="line">  `- <span class="number">6</span>:<span class="number">0</span>:<span class="number">0</span>:<span class="number">0</span> sdd <span class="number">8</span>:<span class="number">48</span> active ready running</span><br></pre></td></tr></tbody></table>

查看盘符  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># parted -s /dev/mapper/mpathb print</span></span><br><span class="line">Model: Linux device-mapper (multipath) (dm)</span><br><span class="line">Disk /dev/mapper/mpathb: <span class="number">107</span>GB</span><br><span class="line">Sector size (logical/physical): <span class="number">512</span>B/<span class="number">512</span>B</span><br><span class="line">Partition Table: gpt</span><br><span class="line">Disk Flags: </span><br><span class="line"></span><br><span class="line">Number  Start   End    Size   File system  Name                          Flags</span><br><span class="line"> <span class="number">1</span>      <span class="number">17.4</span>kB  <span class="number">134</span>MB  <span class="number">134</span>MB               Microsoft reserved partition  msftres</span><br><span class="line"> <span class="number">2</span>      <span class="number">135</span>MB   <span class="number">107</span>GB  <span class="number">107</span>GB  ntfs         Basic data partition</span><br></pre></td></tr></tbody></table>

直接使用这个/dev/mapper/mpathb设备即可

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-04-11 |

Source: zphj1987@gmail ([ceph的ISCSI GATEWAY](http://www.zphj1987.com/2018/04/11/ceph-ISCSI-GATEWAY/))
