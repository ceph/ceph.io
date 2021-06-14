---
title: "基于docker部署ceph以及修改docker image"
date: "2017-03-15"
author: "admin"
tags: 
  - "planet"
---

  
![docker](images/docker.png)  

## 前言

容器和ceph的结合已经在一些生产环境当中做了尝试，容器的好处就是对运行环境的一个封装，传统的方式是集成为ISO，这个需要一定的维护量，而容器的相关操作会简单很多，也就有了一些尝试，个人觉得如果玩的转容器可以考虑，当然得懂ceph，不然两套系统在一起，问题都不知道是哪个的，就比较麻烦了

本篇是基于之前我的填坑群里面的牛鹏举的一个问题，他的环境出现了创建osd的时候权限问题，我这边没遇到，现在实践了一遍，感觉应该是之前目录提前创建了的问题  

## 实践步骤

### 安装docker

<table><tbody><tr><td class="code"><pre><span class="line">yum install docker</span><br></pre></td></tr></tbody></table>

### 下载ceph镜像

这个镜像是sebastien维护的，他是redhat的ceph工程师，ceph-ansible的负责人,很多一线的资料都是来自他的分享，这个是一个集成好的镜像  

<table><tbody><tr><td class="code"><pre><span class="line">docker pull ceph/daemon</span><br></pre></td></tr></tbody></table>

准备好一些目录  

<table><tbody><tr><td class="code"><pre><span class="line">mkdir -p /etc/ceph</span><br><span class="line">mkdir -p /var/lib/ceph/</span><br></pre></td></tr></tbody></table>

注意只需要做这个两个目录，不要创建子目录，docker内部有相关的操作

### 创建一个mon

<table><tbody><tr><td class="code"><pre><span class="line">sudo docker run <span class="operator">-d</span> --net=host  --name=mon </span><br><span class="line">-v /etc/ceph:/etc/ceph </span><br><span class="line">-v /var/lib/ceph/:/var/lib/ceph </span><br><span class="line"><span class="operator">-e</span> MON_IP=<span class="number">192.168</span>.<span class="number">8.106</span> </span><br><span class="line"><span class="operator">-e</span> CEPH_PUBLIC_NETWORK=<span class="number">192.168</span>.<span class="number">0.0</span>/<span class="number">16</span> </span><br><span class="line">ceph/daemon mon</span><br></pre></td></tr></tbody></table>

MON\_IP就是宿主机的IP地址

执行完了后  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment">#  docker ps -l</span></span><br><span class="line">CONTAINER ID        IMAGE               COMMAND                CREATED              STATUS              PORTS               NAMES</span><br><span class="line"><span class="number">86</span>ed05173432        ceph/daemon         <span class="string">"/entrypoint.sh mon"</span>   About a minute ago   Up <span class="number">59</span> seconds                           mon</span><br></pre></td></tr></tbody></table>

可以看到退出了，我们来docker logs -f mon看下日志的输出  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># docker logs -f mon</span></span><br><span class="line">/sbin/ip</span><br><span class="line">creating /etc/ceph/ceph.client.admin.keyring</span><br><span class="line">creating /etc/ceph/ceph.mon.keyring</span><br><span class="line">creating /var/lib/ceph/bootstrap-osd/ceph.keyring</span><br><span class="line">creating /var/lib/ceph/bootstrap-mds/ceph.keyring</span><br><span class="line">creating /var/lib/ceph/bootstrap-rgw/ceph.keyring</span><br><span class="line">monmaptool: monmap file /etc/ceph/monmap-ceph</span><br><span class="line">monmaptool: <span class="built_in">set</span> fsid to cb5df106-<span class="number">25</span>b3-<span class="number">4</span>f93-<span class="number">9</span>f54-baca2976a47b</span><br><span class="line">monmaptool: writing epoch <span class="number">0</span> to /etc/ceph/monmap-ceph (<span class="number">1</span> monitors)</span><br><span class="line">creating /tmp/ceph.mon.keyring</span><br><span class="line">importing contents of /etc/ceph/ceph.client.admin.keyring into /tmp/ceph.mon.keyring</span><br><span class="line">importing contents of /var/lib/ceph/bootstrap-osd/ceph.keyring into /tmp/ceph.mon.keyring</span><br><span class="line">importing contents of /var/lib/ceph/bootstrap-mds/ceph.keyring into /tmp/ceph.mon.keyring</span><br><span class="line">importing contents of /var/lib/ceph/bootstrap-rgw/ceph.keyring into /tmp/ceph.mon.keyring</span><br><span class="line">importing contents of /etc/ceph/ceph.mon.keyring into /tmp/ceph.mon.keyring</span><br><span class="line">ceph-mon: <span class="built_in">set</span> fsid to cb5df106-<span class="number">25</span>b3-<span class="number">4</span>f93-<span class="number">9</span>f54-baca2976a47b</span><br><span class="line">ceph-mon: created monfs at /var/lib/ceph/mon/ceph-lab8106 <span class="keyword">for</span> mon.lab81</span><br></pre></td></tr></tbody></table>

提示成功了

我们看下生成的文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ll /etc/ceph</span></span><br><span class="line">total <span class="number">16</span></span><br><span class="line">-rw------- <span class="number">1</span> root  root  <span class="number">137</span> Mar <span class="number">14</span> <span class="number">17</span>:<span class="number">53</span> ceph.client.admin.keyring</span><br><span class="line">-rw-r--r-- <span class="number">1</span> root  root  <span class="number">285</span> Mar <span class="number">14</span> <span class="number">17</span>:<span class="number">53</span> ceph.conf</span><br><span class="line">-rw------- <span class="number">1</span> <span class="number">64045</span> <span class="number">64045</span>  <span class="number">77</span> Mar <span class="number">14</span> <span class="number">17</span>:<span class="number">53</span> ceph.mon.keyring</span><br><span class="line">-rw-r--r-- <span class="number">1</span> <span class="number">64045</span> <span class="number">64045</span> <span class="number">187</span> Mar <span class="number">14</span> <span class="number">17</span>:<span class="number">53</span> monmap-ceph</span><br></pre></td></tr></tbody></table>

从这里可以看到内部的cpeh的用户的id是64045，所以在docker宿主机不要随便去给ceph权限，可能id不匹配，容器内部还是无法操作

### 创建一个osd

<table><tbody><tr><td class="code"><pre><span class="line">sudo docker run <span class="operator">-d</span> --net=host --name=myosd1 </span><br><span class="line">--privileged=<span class="literal">true</span> </span><br><span class="line">-v /etc/ceph:/etc/ceph </span><br><span class="line">-v /var/lib/ceph/:/var/lib/ceph </span><br><span class="line">-v /dev/:/dev/ </span><br><span class="line"><span class="operator">-e</span> OSD_DEVICE=/dev/sdb </span><br><span class="line">ceph/daemon osd_ceph_disk</span><br></pre></td></tr></tbody></table>

如果查询日志  

<table><tbody><tr><td class="code"><pre><span class="line">docker logs <span class="operator">-f</span> myosd1</span><br></pre></td></tr></tbody></table>

如果执行命令  

<table><tbody><tr><td class="code"><pre><span class="line">docker <span class="built_in">exec</span> -it mon ceph <span class="operator">-s</span></span><br></pre></td></tr></tbody></table>

如果想进入容器内部  

<table><tbody><tr><td class="code"><pre><span class="line">docker <span class="built_in">exec</span> -it mon  /bin/bash</span><br></pre></td></tr></tbody></table>

修改集群的副本数  

<table><tbody><tr><td class="code"><pre><span class="line">docker <span class="built_in">exec</span> -it mon  ceph osd pool <span class="built_in">set</span> rbd size <span class="number">1</span></span><br></pre></td></tr></tbody></table>

查看集群状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># docker exec -it mon  ceph -s</span></span><br><span class="line">    cluster cb5df106-<span class="number">25</span>b3-<span class="number">4</span>f93-<span class="number">9</span>f54-baca2976a47b</span><br><span class="line">     health HEALTH_WARN</span><br><span class="line">            mon.lab8106 low disk space</span><br><span class="line">     monmap e2: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">4</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">        mgr no daemons active </span><br><span class="line">     osdmap e7: <span class="number">1</span> osds: <span class="number">1</span> up, <span class="number">1</span> <span class="keyword">in</span></span><br><span class="line">            flags sortbitwise,require_jewel_osds,require_kraken_osds</span><br><span class="line">      pgmap v15: <span class="number">64</span> pgs, <span class="number">1</span> pools, <span class="number">0</span> bytes data, <span class="number">0</span> objects</span><br><span class="line">            <span class="number">34288</span> kB used, <span class="number">279</span> GB / <span class="number">279</span> GB avail</span><br><span class="line">                  <span class="number">64</span> active+clean</span><br></pre></td></tr></tbody></table>

上面的操作都很顺利，但是某些情况可能出现异常情况，或者镜像内部本身就有问题需要自己修改，这个怎么处理

## 碰上问题想修改image

我们看下我们运行的docker  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># docker ps </span></span><br><span class="line">CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES</span><br><span class="line"><span class="number">874</span>d78ccae55        ceph/daemon         <span class="string">"/entrypoint.sh osd_c"</span>   <span class="number">14</span> hours ago        Up <span class="number">14</span> hours                             myosd1</span><br><span class="line"><span class="number">86</span>ed05173432        ceph/daemon         <span class="string">"/entrypoint.sh mon"</span>     <span class="number">15</span> hours ago        Up <span class="number">15</span> hours                             mon</span><br></pre></td></tr></tbody></table>

COMMAND这里有个/entrypoint.sh

如果存在ENTRYPOINT和CMD，那么CMD就是ENTRYPOINT的参数，如果没有ENTRYPOINT，则CMD就是默认执行指令  
也就是容器启动的时候默认是会去执行/entrypoint.sh 这个了

我们不需要他执行这个，就需要加参数了  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># docker run -i -t --entrypoint /bin/bash ceph/daemon</span></span><br></pre></td></tr></tbody></table>

比如我上次做的一个操作，把ceph用户绑定到root的id  

<table><tbody><tr><td class="code"><pre><span class="line">root@<span class="number">9</span>b269bf751f9:/<span class="comment"># cat /etc/passwd|grep ceph</span></span><br><span class="line">ceph:x:<span class="number">64045</span>:<span class="number">64045</span>:Ceph storage service:/var/lib/ceph:/bin/<span class="literal">false</span></span><br><span class="line">root@<span class="number">9</span>b269bf751f9:/<span class="comment"># sed -i 's/64045/0/g' /etc/passwd</span></span><br><span class="line">root@<span class="number">9</span>b269bf751f9:/<span class="comment"># cat /etc/passwd|grep ceph</span></span><br><span class="line">ceph:x:<span class="number">0</span>:<span class="number">0</span>:Ceph storage service:/var/lib/ceph:/bin/<span class="literal">false</span></span><br></pre></td></tr></tbody></table>

退出容器  

<table><tbody><tr><td class="code"><pre><span class="line">root@<span class="number">9</span>b269bf751f9:/<span class="comment"># exit</span></span><br></pre></td></tr></tbody></table>

查询我们最后运行的容器，修改回entrypoint我们再把容器修改提交到基础image  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># docker ps -l</span></span><br><span class="line">CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES</span><br><span class="line"><span class="number">9</span>b269bf751f9        ceph/daemon         <span class="string">"/bin/bash"</span>         <span class="number">2</span> minutes ago       Exited (<span class="number">0</span>) <span class="number">15</span> seconds ago                       angry_hawking</span><br><span class="line"></span><br><span class="line">[root@lab8106 ~]<span class="comment"># docker run -i -t --entrypoint /entrypoint.sh ceph/daemon</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># docker ps -l</span></span><br><span class="line">CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES</span><br><span class="line">c2ea602c18ac        ceph/daemon         <span class="string">"/entrypoint.sh"</span>    <span class="number">10</span> seconds ago      Exited (<span class="number">1</span>) <span class="number">7</span> seconds ago                       ecstatic_bartik</span><br><span class="line"></span><br><span class="line">[root@lab8106 ceph]<span class="comment"># docker commit c2ea602c18ac ceph/daemon</span></span><br></pre></td></tr></tbody></table>

再次启动容器,并且检查内容，可以看到已经修改好了  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># docker run -i -t --entrypoint /bin/bash ceph/daemon</span></span><br><span class="line">root@<span class="number">65</span>b538fdc61e:/<span class="comment"># cat /etc/passwd|grep ceph</span></span><br><span class="line">ceph:x:<span class="number">0</span>:<span class="number">0</span>:Ceph storage service:/var/lib/ceph:/bin/<span class="literal">false</span></span><br></pre></td></tr></tbody></table>

如果需要做其他的改动，这样改下就行

## 总结

本篇主要是根据sebastien的镜像做的部署，并且给出一些常用的命令，以及如何进入固化的容器的内部进行修改，方便自己调试环境

## 相关资料

[bootstrap-your-ceph-cluster-in-docker/](http://www.sebastien-han.fr/blog/2015/06/23/bootstrap-your-ceph-cluster-in-docker/)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-03-15 |

Source: zphj1987@gmail ([基于docker部署ceph以及修改docker image](http://www.zphj1987.com/2017/03/15/base-on-docker-deploy-ceph/))
