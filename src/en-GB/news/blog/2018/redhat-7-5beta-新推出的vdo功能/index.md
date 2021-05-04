---
title: "REDHAT 7.5beta 新推出的VDO功能"
date: "2018-02-10"
author: "admin"
tags: 
  - "planet"
---

  
![network](images/hat.jpg)  

## 前言

### 关于VDO

VOD的技术来源于收购的Permabit公司，一个专门从事重删技术的公司，所以技术可靠性是没有问题的

VDO是一个内核模块，目的是通过重删减少磁盘的空间占用，以及减少复制带宽，VDO是基于块设备层之上的，也就是在原设备基础上映射出mapper虚拟设备，然后直接使用即可，功能的实现主要基于以下技术：

- 零区块的排除：
    
    在初始化阶段，整块为0的会被元数据记录下来，这个可以用水杯里面的水和沙子混合的例子来解释，使用滤纸（零块排除），把沙子（非零空间）给过滤出来，然后就是下一个阶段的处理
    

- 重复数据删除：
    
    在第二阶段，输入的数据会判断是不是冗余数据（在写入之前就判断），这个部分的数据通过UDS内核模块来判断（U niversal D eduplication S ervice），被判断为重复数据的部分不会被写入，然后对元数据进行更新，直接指向原始已经存储的数据块即可
    
- 压缩：
    
    一旦消零和重删完成，LZ4压缩会对每个单独的数据块进行处理，然后压缩好的数据块会以固定大小4KB的数据块存储在介质上，由于一个物理块可以包含很多的压缩块，这个也可以加速读取的性能
    

上面的技术看起来很容易理解，但是实际做成产品还是相当大的难度的，技术设想和实际输出还是有很大距离，不然redhat也不会通过收购来获取技术，而不是自己去重新写一套了  

### 如何获取VDO

主要有两种方式，一种是通过申请测试版的方式申请redhat 7.5的ISO，这个可以进行一个月的测试

另外一种方式是申请测试版本，然后通过源码在你正在使用的ISO上面进行相关的测试，从适配方面在自己的ISO上面进行测试能够更好的对比，由于基于redhat的源码做分发会涉及法律问题，这里就不做过多讲解，也不提供rpm包，自行申请测试即可

## 实践过程

### 安装VDO

安装的操作系统为CentOS Linux release 7.4.1708  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># lsb_release -a</span></span><br><span class="line">LSB Version:	:core-<span class="number">4.1</span>-amd64:core-<span class="number">4.1</span>-noarch</span><br><span class="line">Distributor ID:	CentOS</span><br><span class="line">Description:	CentOS Linux release <span class="number">7.4</span>.<span class="number">1708</span> (Core) </span><br><span class="line">Release:	<span class="number">7.4</span>.<span class="number">1708</span></span><br><span class="line">Codename:	Core</span><br></pre></td></tr></tbody></table>

内核版本如下  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># uname -a</span></span><br><span class="line">Linux lab101 <span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64 <span class="comment">#1 SMP Tue Aug 22 21:09:27 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># rpm -qa|grep kernel</span></span><br><span class="line">kernel-tools-libs-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64</span><br><span class="line">abrt-addon-kerneloops-<span class="number">2.1</span>.<span class="number">11</span>-<span class="number">48</span>.el7.centos.x86_64</span><br><span class="line">kernel-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693</span>.el7.x86_64</span><br></pre></td></tr></tbody></table>

我们把内核升级一下，因为这个模块比较新，所以选择目前updates里面最新的  

<table><tbody><tr><td class="code"><pre><span class="line">wget http://mirror.centos.org/centos/<span class="number">7</span>/updates/x86_64/Packages/kernel-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693.17</span>.<span class="number">1</span>.el7.x86_64.rpm</span><br></pre></td></tr></tbody></table>

大版本一致，小版本不同，直接安装即可  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># rpm -ivh kernel-3.10.0-693.17.1.el7.x86_64.rpm </span></span><br><span class="line">Preparing...                          <span class="comment">################################# [100%]</span></span><br><span class="line">Updating / installing...</span><br><span class="line">   <span class="number">1</span>:kernel-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">693.17</span>.<span class="number">1</span>.el7       <span class="comment">################################# [100%]</span></span><br><span class="line">[root@lab101 ~]<span class="comment"># grub2-set-default 'CentOS Linux (3.10.0-693.17.1.el7.x86_64) 7 (Core)'</span></span><br></pre></td></tr></tbody></table>

重启服务器  
安装  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># rpm -ivh kmod-kvdo-6.1.0.98-11.el7.centos.x86_64.rpm </span></span><br><span class="line">Preparing...                          <span class="comment">################################# [100%]</span></span><br><span class="line">Updating / installing...</span><br><span class="line">   <span class="number">1</span>:kmod-kvdo-<span class="number">6.1</span>.<span class="number">0.98</span>-<span class="number">11</span>.el7.centos <span class="comment">################################# [100%]</span></span><br><span class="line">[root@lab101 ~]<span class="comment"># yum install PyYAML   </span></span><br><span class="line">[root@lab101 ~]<span class="comment"># rpm -ivh vdo-6.1.0.98-13.x86_64.rpm </span></span><br><span class="line">Preparing...                          <span class="comment">################################# [100%]</span></span><br><span class="line">Updating / installing...</span><br><span class="line">   <span class="number">1</span>:vdo-<span class="number">6.1</span>.<span class="number">0.98</span>-<span class="number">13</span>                  <span class="comment">################################# [100%]</span></span><br></pre></td></tr></tbody></table>

到这里安装就完成了

### 配置VDO

创建一个vdo卷  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># vdo create --name=my_vdo  --device=/dev/sdb1   --vdoLogicalSize=80G --writePolicy=sync</span></span><br><span class="line">Creating VDO my_vdo</span><br><span class="line">Starting VDO my_vdo</span><br><span class="line">Starting compression on VDO my_vdo</span><br><span class="line">VDO instance <span class="number">0</span> volume is ready at /dev/mapper/my_vdo</span><br></pre></td></tr></tbody></table>

参数解释：  
name是创建的vdo名称，也就是生成的新设备的名称，device是指定的设备，vdoLogicalSize是指定新生成的设备的大小，因为vdo是支持精简配置的，也就是你原来1T的物理空间，这里可以创建出超过1T的逻辑空间，因为内部支持重删，可以根据数据类型进行放大，writePolicy是指定写入的模式的

如果磁盘设备是write back模式的可以设置为aysnc，如果没有的话就设置为sync模式

如果磁盘没有写缓存或者有write throuth cache的时候设置为sync模式  
如果磁盘有write back cache的时候就必须设置成async模式

默认是sync模式的，这里的同步异步实际上是告诉vdo，我们的底层存储是不是有写缓存，有缓存的话就要告诉vdo我们底层是async的，没有缓存的时候就是sync

检查我们的磁盘的写入方式  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># cat /sys/block/sdb/device/scsi_disk/0:0:1:0/cache_type </span></span><br><span class="line">write through</span><br></pre></td></tr></tbody></table>

这个输出的根据上面的规则，我们设置为sync模式

修改缓存模式的命令  

<table><tbody><tr><td class="code"><pre><span class="line">vdo changeWritePolicy --writePolicy=sync_or_async --name=vdo_name</span><br></pre></td></tr></tbody></table>

格式化硬盘  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># mkfs.xfs -K /dev/mapper/my_vdo </span></span><br><span class="line">meta-data=/dev/mapper/my_vdo     isize=<span class="number">512</span>    agcount=<span class="number">4</span>, agsize=<span class="number">5242880</span> blks</span><br><span class="line">         =                       sectsz=<span class="number">4096</span>  attr=<span class="number">2</span>, projid32bit=<span class="number">1</span></span><br><span class="line">         =                       crc=<span class="number">1</span>        finobt=<span class="number">0</span>, sparse=<span class="number">0</span></span><br><span class="line">data     =                       bsize=<span class="number">4096</span>   blocks=<span class="number">20971520</span>, imaxpct=<span class="number">25</span></span><br><span class="line">         =                       sunit=<span class="number">0</span>      swidth=<span class="number">0</span> blks</span><br><span class="line">naming   =version <span class="number">2</span>              bsize=<span class="number">4096</span>   ascii-ci=<span class="number">0</span> ftype=<span class="number">1</span></span><br><span class="line"><span class="built_in">log</span>      =internal <span class="built_in">log</span>           bsize=<span class="number">4096</span>   blocks=<span class="number">10240</span>, version=<span class="number">2</span></span><br><span class="line">         =                       sectsz=<span class="number">4096</span>  sunit=<span class="number">1</span> blks, lazy-count=<span class="number">1</span></span><br><span class="line">realtime =none                   extsz=<span class="number">4096</span>   blocks=<span class="number">0</span>, rtextents=<span class="number">0</span></span><br></pre></td></tr></tbody></table>

使用-K参数是加速了格式化的操作，也就是不发送丢弃的请求，因为之前创建了vdo，已经将其初始化为0了，所以可以采用这个操作

我们挂载的时候最好能加上discard的选项，精简配置的设备需要对之前的空间进行回收，一般来说有在线的和离线的回收，离线的就通过fstrim来进行回收即可

挂载设备  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># mount -o discard /dev/mapper/my_vdo /myvod/</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># vdostats --human-readable </span></span><br><span class="line">Device                    Size      Used Available Use% Space saving%</span><br><span class="line">/dev/mapper/my_vdo       <span class="number">50.0</span>G      <span class="number">4.0</span>G     <span class="number">46.0</span>G   <span class="number">8</span>%           <span class="number">99</span>%</span><br></pre></td></tr></tbody></table>

默认创建完vdo设备就会占用4G左右的空间，这个用来存储UDS和VDO的元数据

检查重删和压缩是否开启  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># vdo status -n my_vdo|grep Deduplication</span></span><br><span class="line">    Deduplication: enabled</span><br><span class="line">[root@lab101 ~]<span class="comment"># vdo status -n my_vdo|grep Compress</span></span><br><span class="line">    Compression: enabled</span><br></pre></td></tr></tbody></table>

如果没有开启，可以通过下面的命令开启  

<table><tbody><tr><td class="code"><pre><span class="line">vdo <span class="built_in">enable</span>Compression -n &lt;vdo_vol_name&gt;</span><br><span class="line">vdo <span class="built_in">enable</span>Deduplication -n &lt;vdo_vol_name&gt;</span><br></pre></td></tr></tbody></table>

### 验证重删功能

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab<span class="number">101</span> ~]<span class="title"># df -h|grep vdo</span><br><span class="line">/dev/mapper/my_vdo   80</span>G   <span class="number">33</span>M   <span class="number">80</span>G   <span class="number">1</span><span class="preprocessor">%</span> /myvod</span><br><span class="line">[root@lab<span class="number">101</span> ~]<span class="title"># vdostats --hu</span><br><span class="line">Device                    Size      Used Available Use% Space saving%</span><br><span class="line">/dev/mapper/my_vdo       50</span><span class="number">.0</span>G      <span class="number">4.0</span>G     <span class="number">46.0</span>G   <span class="number">8</span><span class="preprocessor">%</span>           <span class="number">99</span><span class="preprocessor">%</span></span><br></pre></td></tr></tbody></table>

传入一个ISO文件CentOS-7-x86\_64-NetInstall-1708.iso 422M的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># df -h|grep vdo</span></span><br><span class="line">/dev/mapper/my_vdo   <span class="number">80</span>G  <span class="number">455</span>M   <span class="number">80</span>G   <span class="number">1</span>% /myvod</span><br><span class="line">[root@lab101 ~]<span class="comment"># vdostats --hu</span></span><br><span class="line">Device                    Size      Used Available Use% Space saving%</span><br><span class="line">/dev/mapper/my_vdo       <span class="number">50.0</span>G      <span class="number">4.4</span>G     <span class="number">45.6</span>G   <span class="number">8</span>%            <span class="number">9</span>%</span><br></pre></td></tr></tbody></table>

然后重复传入3个相同文件，一共四个文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># df -h|grep vdo</span></span><br><span class="line">/dev/mapper/my_vdo   <span class="number">80</span>G  <span class="number">1.7</span>G   <span class="number">79</span>G   <span class="number">3</span>% /myvod</span><br><span class="line">[root@lab101 ~]<span class="comment"># vdostats --hu</span></span><br><span class="line">Device                    Size      Used Available Use% Space saving%</span><br><span class="line">/dev/mapper/my_vdo       <span class="number">50.0</span>G      <span class="number">4.4</span>G     <span class="number">45.6</span>G   <span class="number">8</span>%           <span class="number">73</span>%</span><br></pre></td></tr></tbody></table>

可以看到后面传入的文件，并没有占用底层存储的实际空间

### 验证压缩功能

测试数据来源 silesia的资料库

<table><tbody><tr><td class="code"><pre><span class="line">http://sun.aei.polsl.pl/~sdeor/corpus/silesia.zip</span><br></pre></td></tr></tbody></table>

通过资料库里面的文件来看下对不同类型的数据的压缩情况

| Filename | 描述 | 类型 | 原始空间（KB） | 实际占用空间（KB） |
| --- | --- | --- | --- | --- |
| dickens | 狄更斯文集 | 英文原文 | 9953 | 9948 |
| mozilla | Mozilla的1.0可执行文件 | 执行程序 | 50020 | 33228 |
| mr | 医用resonanse图像 | 图片 | 9736 | 9272 |
| nci | 结构化的化学数据库 | 数据库 | 32767 | 10168 |
| ooffice | Open Office.org 1.01 DLL | 可执行程序 | 6008 | 5640 |
| osdb | 基准测试用的MySQL格式示例数据库 | 数据库 | 9849 | 9824 |
| reymont | 瓦迪斯瓦夫·雷蒙特的书 | PDF | 6471 | 6312 |
| samba | samba源代码 | src源码 | 21100 | 11768 |
| sao | 星空数据 | 天文格式的bin文件 | 7081 | 7036 |
| webster | 辞海 | HTML | 40487 | 40144 |
| xml | XML文件 | HTML | 5220 | 2180 |
| x-ray | 透视医学图片 | 医院数据 | 8275 | 8260 |

可以看到都有不同程度的压缩，某些类型的数据压缩能达到50%的比例

停止vdo操作  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># vdo stop  -n my_vdo</span></span><br></pre></td></tr></tbody></table>

启动vdo操作  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># vdo start  -n my_vdo</span></span><br></pre></td></tr></tbody></table>

删除vdo操作  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># vdo remove -n my_vdo</span></span><br></pre></td></tr></tbody></table>

## VDO和CEPH能产生什么火花？

在ceph里面可以用到vdo的地方有两个，一个是作为Kernel rbd的前端，在块设备的上层，另外一个是作为OSD的底层，也就是把VDO当OSD来使用，我们看下怎么使用

### 作为rbd的上层

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># rbd create testvdorbd --size 20G</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># rbd map testvdorbd</span></span><br></pre></td></tr></tbody></table>

创建rbd的vdo  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># vdo create --name=rbd_vdo  --device=/dev/rbd/rbd/testvdorbd</span></span><br><span class="line">Creating VDO rbd_vdo</span><br><span class="line">vdo: ERROR - Device /dev/rbd/rbd/testvdorbd not found (or ignored by filtering).</span><br></pre></td></tr></tbody></table>

被默认排除掉了，这个以前正好见过类似的问题，比较好处理

这个地方因为vdo添加存储的时候内部调用了lvm相关的配置，然后lvm默认会排除掉rbd，这里修改下lvm的配置文件即可  
在/etc/lvm/lvm.conf的修改如下  

<table><tbody><tr><td class="code"><pre><span class="line">types = [ <span class="string">"fd"</span>, <span class="number">16</span> ,<span class="string">"rbd"</span>, <span class="number">64</span> ]</span><br></pre></td></tr></tbody></table>

把types里面增加下rbd 的文件类型即可

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># vdo create --name=rbd_vdo  --device=/dev/rbd/rbd/testvdorbd</span></span><br><span class="line">Creating VDO rbd_vdo</span><br><span class="line">Starting VDO rbd_vdo</span><br><span class="line">Starting compression on VDO rbd_vdo</span><br><span class="line">VDO instance <span class="number">2</span> volume is ready at /dev/mapper/rbd_vdo</span><br></pre></td></tr></tbody></table>

挂载  

<table><tbody><tr><td class="code"><pre><span class="line">mount -o discard /dev/mapper/rbd_vdo /mnt</span><br></pre></td></tr></tbody></table>

查看容量  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 mnt]<span class="comment"># vdostats --human-readable</span></span><br><span class="line">Device                    Size      Used Available Use% Space saving%</span><br><span class="line">/dev/mapper/rbd_vdo      <span class="number">20.0</span>G      <span class="number">4.4</span>G     <span class="number">15.6</span>G  <span class="number">22</span>%            <span class="number">3</span>%</span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 mnt]<span class="comment"># ceph df</span></span><br><span class="line">GLOBAL:</span><br><span class="line">    SIZE       AVAIL      RAW USED     %RAW USED </span><br><span class="line">    <span class="number">57316</span>M     <span class="number">49409</span>M        <span class="number">7906</span>M         <span class="number">13.79</span> </span><br><span class="line">POOLS:</span><br><span class="line">    NAME     ID     USED     %USED     MAX AVAIL     OBJECTS </span><br><span class="line">    rbd      <span class="number">0</span>      <span class="number">566</span>M      <span class="number">1.20</span>        <span class="number">46543</span>M         <span class="number">148</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 mnt]<span class="comment"># ceph df</span></span><br><span class="line">GLOBAL:</span><br><span class="line">    SIZE       AVAIL      RAW USED     %RAW USED </span><br><span class="line">    <span class="number">57316</span>M     <span class="number">48699</span>M        <span class="number">8616</span>M         <span class="number">15.03</span> </span><br><span class="line">POOLS:</span><br><span class="line">    NAME     ID     USED      %USED     MAX AVAIL     OBJECTS </span><br><span class="line">    rbd      <span class="number">0</span>      <span class="number">1393</span>M      <span class="number">2.95</span>        <span class="number">45833</span>M         <span class="number">355</span></span><br></pre></td></tr></tbody></table>

多次传入相同的时候可以看到对于ceph内部来说还是会产生对象的，只是这个在vdo的文件系统来看是不占用物理空间的

对镜像做下copy  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># rbd cp testvdorbd testvdorbdclone</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment">#rbd map  testvdorbdclone</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># cat /etc/vdoconf.yml |grep device</span></span><br><span class="line">      device: /dev/rbd/rbd/testvdorbdclone</span><br></pre></td></tr></tbody></table>

修改配置文件为对应的设备，就可以启动了,这个操作说明vdo设备是不绑定硬件的，只需要有相关的配置文件，即可对文件系统进行启动

那么这个在一个数据转移用途下，就可以利用vdo对数据进行重删压缩，然后把整个img转移到远端去，这个也符合现在的私有云和公有云之间的数据传输量的问题，会节省不少空间

### vdo作为ceph的osd

ceph对设备的属性有要求，这里直接采用目录部署的方式  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># vdo create --name sdb1 --device=/dev/sdb1</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># vdo create --name sdb2 --device=/dev/sdb2</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># mkfs.xfs -K -f /dev/mapper/sdb1</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># mkfs.xfs -K -f /dev/mapper/sdb2</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># mkdir /osd1</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># mkdir /osd2</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># mount /dev/mapper/sdb1 /osd1/</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># mount /dev/mapper/sdb2 /osd2/</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># chown ceph:ceph /osd1</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># chown ceph:ceph /osd2</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># ceph-deploy osd prepare lab101:/osd1/</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># ceph-deploy osd prepare lab101:/osd2/</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># ceph-deploy osd activate lab101:/osd1/</span></span><br><span class="line">[root@lab101 ceph]<span class="comment"># ceph-deploy osd activate lab101:/osd2/</span></span><br></pre></td></tr></tbody></table>

写入测试数据  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># rados  -p rbd bench 60 write --no-cleanup</span></span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ceph]<span class="comment"># df -h</span></span><br><span class="line">Filesystem        Size  Used Avail Use% Mounted on</span><br><span class="line">/dev/sda2          <span class="number">56</span>G  <span class="number">2.0</span>G   <span class="number">54</span>G   <span class="number">4</span>% /</span><br><span class="line">devtmpfs          <span class="number">983</span>M     <span class="number">0</span>  <span class="number">983</span>M   <span class="number">0</span>% /dev</span><br><span class="line">tmpfs             <span class="number">992</span>M     <span class="number">0</span>  <span class="number">992</span>M   <span class="number">0</span>% /dev/shm</span><br><span class="line">tmpfs             <span class="number">992</span>M  <span class="number">8.8</span>M  <span class="number">983</span>M   <span class="number">1</span>% /run</span><br><span class="line">tmpfs             <span class="number">992</span>M     <span class="number">0</span>  <span class="number">992</span>M   <span class="number">0</span>% /sys/fs/cgroup</span><br><span class="line">/dev/sda1        <span class="number">1014</span>M  <span class="number">151</span>M  <span class="number">864</span>M  <span class="number">15</span>% /boot</span><br><span class="line">tmpfs             <span class="number">199</span>M     <span class="number">0</span>  <span class="number">199</span>M   <span class="number">0</span>% /run/user/<span class="number">0</span></span><br><span class="line">/dev/mapper/sdb1   <span class="number">22</span>G  <span class="number">6.5</span>G   <span class="number">16</span>G  <span class="number">30</span>% /osd1</span><br><span class="line">/dev/mapper/sdb2   <span class="number">22</span>G  <span class="number">6.5</span>G   <span class="number">16</span>G  <span class="number">30</span>% /osd2</span><br><span class="line">[root@lab101 ceph]<span class="comment"># vdostats --human-readable </span></span><br><span class="line">Device                    Size      Used Available Use% Space saving%</span><br><span class="line">/dev/mapper/sdb2         <span class="number">25.0</span>G      <span class="number">3.0</span>G     <span class="number">22.0</span>G  <span class="number">12</span>%           <span class="number">99</span>%</span><br><span class="line">/dev/mapper/sdb1         <span class="number">25.0</span>G      <span class="number">3.0</span>G     <span class="number">22.0</span>G  <span class="number">12</span>%           <span class="number">99</span>%</span><br></pre></td></tr></tbody></table>

可以看到虽然在df看到了空间的占用，实际上因为rados bench写入的是填充的空洞数据，vdo作为osd对数据直接进行了重删了，测试可以看到vdo是可以作为ceph osd的，由于我的测试环境是在vmware虚拟机里面的，所以并不能做性能测试，有硬件环境的情况下可以对比下开启vdo和不开启的情况的性能区别

## 参考文档

[vdo-qs-creating-a-volume](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/storage_administration_guide/vdo-qs-creating-a-volume)  
[Determining the space savings of virtual data optimizer (VDO) in RHEL 7.5 Beta](https://rhelblog.redhat.com/tag/vdo/)

## 总结

本篇从配置和部署以及适配方面对vdo进行一次比较完整的实践，从目前的测试情况来看，配置简单，对环境友好，基本是可以作为一个驱动层嵌入到任何块设备之上的，未来应该有广泛的用途，目前还不清楚红帽是否会把这个属性放到centos下面去，目前可以通过在[https://access.redhat.com/downloads/](https://access.redhat.com/downloads/) 申请测试版本的ISO进行功能的测试

应该是农历年前的最后一篇文章了，祝新春快乐！

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-02-10 |

Source: zphj1987@gmail ([REDHAT 7.5beta 新推出的VDO功能](http://www.zphj1987.com/2018/02/10/REDHAT-7-5beta-with-VDO/))
