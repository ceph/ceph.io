---
title: "rbd-mirror配置指南-单向备份"
date: "2017-01-22"
author: "admin"
tags: 
  - "planet"
---

  
![](images/mirrorpng.png)  

RBD 的 mirroring 功能将在Jewel中实现的，这个Jewel版本已经发布了很久了,这个功能已经在这个发布的版本中实现了，本来之前写过一篇文章，但是有几个朋友根据文档配置后，发现还是有问题，自己在进行再次配置的时候也发现有些地方没讲清楚，容易造成误解，这里对文档进行再一次的梳理

一、基本原理  
我们试图解决的或者至少需要克服的问题是，ceph在内部是强一致性的，这个对于跨区域的情况数据同步是无法接受的，一个请求需要异地返回再确认完成，这个在性能上肯定是无法接受的，这就是为什么基本上无法部署跨区域的ceph集群

因此我们需要有一种机制能够让我们在不同区域的集群之间复制块设备。这个能够帮助我们实现两个功能：

- 灾难恢复
- 全球块设备分布（跨地理位置）

二、内部的实现

![画图.png-34.8kB](images/%E7%94%BB%E5%9B%BE.png)

从上图所示是进行的主备模式的备份，其实这个只是看怎么应用了，在里面是自动实现的主主的模式，双向同步的，只是在应用中需要注意不要去同时操作同一个image，这个功能是作为主备去使用的，以备真正有问题的时候去实现故障恢复，这个同步是异步的

二、一个新的进程  
一个新的守护程序：rbd-mirror 将会负责将一个镜像从一个集群同步到另一个，rbd-mirror需要在两个集群上都配置，它会同时连接本地和远程的集群。在jewel版本中还是一对一的方式，在以后的版本中会实现一对多的，所以在以后的版本可以配置一对多的备份

作为起点，这个功能讲使用配置文件连接集群，使用用户和密钥。使用admin用户就可以了，使用的验证方式就是默认的cephx的方式

为了相互识别，两个集群都需要相互注册使用 `rbd mirror pool peer add`命令， 这个在下面会实践

二、镜像  
![ceph-rbd-mirror-inside.png-80.8kB](images/ceph-rbd-mirror-inside.png)  
The RBD mirroring 依赖两个新的rbd的属性

- journaling: 启动后会记录image的事件
- mirroring: 明确告诉rbd-mirror需要复制这个镜像

也有命令可以禁用单独的某个镜像。journaling可以看做是另一个rbd的image（一些rados对象），一般情况下，先写日志，然后返回客户端，然后被写入底层的rbd的image，出于性能考虑，这个journal可以跟它的镜像不在一个存储池当中，目前是一个image一个journal，最近应该会沿用这个策略，直到ceph引入一致性组。关于一致性组的概念就是一组卷，然后用的是一个RBD image。可以在所有的组中执行快照操作，有了一致性的保证，所有的卷就都在一致的状态。当一致性组实现的时候，我们就可以用一个journal来管理所有的RBD的镜像

可以给一个已经存在image开启journal么，可以的，ceph将会将你的镜像做一个快照，然后对快照做一个复制，然后开启journal，这都是后台执行的一个任务

可以启用和关闭单个镜像或者存储池的mirror功能，如果启用了journal功能，那么每个镜像将会被复制

可以使用 rbd mirror pool enable启用它

三、灾难恢复  
交叉同步复制是可以的，默认的就是这个方式，这意味着**两个地方的存储池名称需要相同的**这个会带来两个问题

- 使用相同的存储做备份做使用会影响性能的
- 相同的池名称在进行恢复的时候也更容易。openstack里面只需要记录卷ID即可

每个image都有 mirroring\_directory 记录当前active的地方。在本地镜像提示为 primary的时候，是可写的并且远程的站点上就会有锁，这个image就是不可写的。只有在primary镜像降级，备份的点升级就可以了，demoted 和 promoted来控制这里，这就是为什么引入了等级制度，一旦备份的地方升级了，那么主的就自动降级了，这就意味着同步的方向就会发生变化了

如果出现脑裂的情况，那么rbd-mirror将会停止同步，你自己需要判断哪个是最新的image，然后手动强制去同步`rbd mirror image resync`

上面基本参照的是sebastien翻译的，原文只是做了简短的说明，下面是我的实践部分

* * *

### 配置实践部分

先介绍下一些简单的概念

#### rbd-mirror 进程

rbd-mirror进程负责将镜像从一个Ceph集群同步到另一个集群

根据复制的类型，rbd-mirror可以在单个集群上或者是镜像的两个集群上都运行

- 单向备份
    - 当数据从主集群备份到备用的集群的时候，rbd-mirror仅在备份群集上运行。
- 双向备份
    - 如果两个集群互为备份的时候，rbd-mirror需要在两个集群上都运行

为了更清晰的理解这个配置，我们本次实践只进行单向备份的配置，也就是只备份一个集群的镜像到另外一个集群

> rbd-mirror的每个实例必须能够同时连接到两个Ceph集群,因为需要同两个集群都进行数据通信  
> 每个Ceph集群只运行一个rbd-mirror进程

#### Mirroring 模式

mirroring是基于存储池进行的peer，ceph支持两种模式的镜像，根据镜像来划分有：

- 存储池模式
    
    - 一个存储池内的所有镜像都会进行备份
- 镜像模式
    
    - 只有指定的镜像才会进行备份

本次配置选择的模式是镜像的模式，也就是指定的镜像才会进行备份

#### Image 状态

做了mirroring的Image的状态有:  
primary (可以修改)  
non-primary (不能修改).  
当第一次对image进行开启mirroring的时候 .Images 自动 promoted 为 primary

## 开始配置

首先配置两个集群，配置的集群都没有更改名称，都是ceph，我们通过配置文件来控制集群的识别，我的环境是单主机集群，lab8106和lab8107两台机器  
lab8106为local集群，lab8107为remote集群，准备把lab8106的image备份到lab8107的集群上  
在ceph.conf当中添加：

> rbd default features = 125

需要exclusive-lock和journaling属性  
开启这两个个属性可以在创建的时候指定  
语法：  

<table><tbody><tr><td class="code"><pre><span class="line">rbd create &lt;image-name&gt; --size &lt;megabytes&gt; --pool &lt;pool-name&gt; --imagefeature &lt;feature&gt;</span><br></pre></td></tr></tbody></table>

例子：  

<table><tbody><tr><td class="code"><pre><span class="line">rbd create image-<span class="number">1</span> --size <span class="number">1024</span> --pool rbd --image-feature exclusive-lock,journaling</span><br></pre></td></tr></tbody></table>

这个是在lab8106上执行，因为我们需要对lab8106进行备份  
也可以在创建以后开启属性：  
语法：  

<table><tbody><tr><td class="code"><pre><span class="line">rbd feature <span class="built_in">enable</span> &lt;pool-name&gt;/&lt;image-name&gt; &lt;feature-name&gt;</span><br></pre></td></tr></tbody></table>

例子：  

<table><tbody><tr><td class="code"><pre><span class="line">rbd feature <span class="built_in">enable</span> rbd/image-<span class="number">1</span> exclusive-lock</span><br><span class="line">rbd feature <span class="built_in">enable</span> rbd/image-<span class="number">1</span> journaling</span><br></pre></td></tr></tbody></table>

上面有三种方法开启属性，选择习惯或者需要的一种就可以

#### 一、开启存储池的mirror的模式

我们准备开启集群镜像备份模式  
语法：  

<table><tbody><tr><td class="code"><pre><span class="line">rbd mirror pool <span class="built_in">enable</span> &lt;pool-name&gt; &lt;mode&gt;</span><br></pre></td></tr></tbody></table>

在lab8106主机上执行:  

<table><tbody><tr><td class="code"><pre><span class="line">rbd mirror pool <span class="built_in">enable</span> rbd image</span><br></pre></td></tr></tbody></table>

在lab8107主机上执行：  

<table><tbody><tr><td class="code"><pre><span class="line">rbd mirror pool <span class="built_in">enable</span> rbd image</span><br></pre></td></tr></tbody></table>

上面的操作是对rbd存储池启动image模式的mirror配置  
如果需要关闭：  
语法：  

<table><tbody><tr><td class="code"><pre><span class="line">rbd mirror pool <span class="built_in">disable</span> &lt;pool-name&gt; &lt;mode&gt;</span><br></pre></td></tr></tbody></table>

执行:  

<table><tbody><tr><td class="code"><pre><span class="line">rbd mirror pool <span class="built_in">disable</span> rbd image</span><br></pre></td></tr></tbody></table>

#### 二、处理配置文件和kerring

在lab8106上执行  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># scp /etc/ceph/ceph.conf lab8107:/etc/ceph/local.conf</span></span><br><span class="line">[root@lab8106 ceph]<span class="comment"># scp /etc/ceph/ceph.client.admin.keyring lab8107:/etc/ceph/local.client.admin.keyring</span></span><br><span class="line">[root@lab8106 ceph]<span class="comment">#cp /etc/ceph/ceph.conf /etc/ceph/local.conf</span></span><br><span class="line">[root@lab8106 ceph]<span class="comment">#cp /etc/ceph/ceph.client.admin.keyring /etc/ceph/local.client.admin.keyring</span></span><br></pre></td></tr></tbody></table>

在lab8107上执行：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ceph]<span class="comment"># scp /etc/ceph/ceph.conf lab8106:/etc/ceph/remote.conf</span></span><br><span class="line">[root@lab8107 ceph]<span class="comment"># scp /etc/ceph/ceph.client.admin.keyring lab8106:/etc/ceph/remote.client.admin.keyring</span></span><br><span class="line">[root@lab8107 ceph]<span class="comment">#cp /etc/ceph/ceph.conf /etc/ceph/remote.conf</span></span><br><span class="line">[root@lab8107 ceph]<span class="comment">#cp /etc/ceph/ceph.client.admin.keyring /etc/ceph/remote.client.admin.keyring</span></span><br></pre></td></tr></tbody></table>

执行完了后在两台机器上给予权限  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># chown ceph:ceph -R /etc/ceph</span></span><br><span class="line">[root@lab8107 ceph]<span class="comment"># chown ceph:ceph -R /etc/ceph</span></span><br></pre></td></tr></tbody></table>

检验上面设置是否完成  
在lab8106执行  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph --cluster local mon stat</span></span><br><span class="line">e1: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}, election epoch <span class="number">3</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">[root@lab8106 ceph]<span class="comment"># ceph --cluster remote mon stat</span></span><br><span class="line">e1: <span class="number">1</span> mons at {lab8107=<span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6789</span>/<span class="number">0</span>}, election epoch <span class="number">3</span>, quorum <span class="number">0</span> lab8107</span><br></pre></td></tr></tbody></table>

在lab8107执行  

<table><tbody><tr><td class="code"><pre><span class="line">root@lab8107:~/ceph<span class="comment"># ceph --cluster local mon stat</span></span><br><span class="line">e1: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}, election epoch <span class="number">3</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">root@lab8107:~/ceph<span class="comment"># ceph --cluster remote mon stat</span></span><br><span class="line">e1: <span class="number">1</span> mons at {lab8107=<span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6789</span>/<span class="number">0</span>}, election epoch <span class="number">3</span>, quorum <span class="number">0</span> lab8107</span><br></pre></td></tr></tbody></table>

到这里就是两个集群可以通过local和remote进行通信了

#### 三、增加peer

我们这里是做单个集群的备份，为了方便我们这里都用admin的keyring  
语法  

<table><tbody><tr><td class="code"><pre><span class="line">rbd mirror pool peer add &lt;pool-name&gt; &lt;client-name&gt;@&lt;cluster-name&gt;</span><br></pre></td></tr></tbody></table>

这个是为了让rbd-mirror进程找到它peer的集群的存储池  
在lab8106上执行  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># rbd --cluster local mirror pool peer add rbd client.admin@remote</span></span><br><span class="line">[root@lab8106 ceph]<span class="comment"># rbd --cluster remote mirror pool peer add rbd client.admin@local</span></span><br></pre></td></tr></tbody></table>

查询peer状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># rbd mirror pool info rbd --cluster local</span></span><br><span class="line">Mode: image</span><br><span class="line">Peers: </span><br><span class="line">  UUID                                 NAME   CLIENT       </span><br><span class="line">  a050a0f5-<span class="number">9448</span>-<span class="number">43</span>f2-<span class="number">872</span>f-<span class="number">87</span>c394083871 remote client.admin</span><br><span class="line">[root@lab8106 ceph]<span class="comment"># rbd mirror pool info rbd --cluster remote</span></span><br><span class="line">Mode: image</span><br><span class="line">Peers: </span><br><span class="line">  UUID                                 NAME  CLIENT       </span><br><span class="line">  <span class="number">8</span>d7b3fa4-be44-<span class="number">4</span>e25-b0b7-cf4bdb62bf10 <span class="built_in">local</span> client.admin</span><br></pre></td></tr></tbody></table>

如果需要删除peer  
语法：  

<table><tbody><tr><td class="code"><pre><span class="line">rbd mirror pool peer remove &lt;pool-name&gt; &lt;peer-uuid&gt;</span><br></pre></td></tr></tbody></table>

查询存储池状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># rbd mirror pool status rbd</span></span><br><span class="line">health: OK</span><br><span class="line">images: <span class="number">0</span> total</span><br></pre></td></tr></tbody></table>

#### 四、开启image的mirror

在lab8106执行  

<table><tbody><tr><td class="code"><pre><span class="line">rbd mirror image <span class="built_in">enable</span> rbd/image-<span class="number">1</span></span><br></pre></td></tr></tbody></table>

查询镜像的状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># rbd info rbd/image-1</span></span><br><span class="line">rbd image <span class="string">'image-1'</span>:</span><br><span class="line">	size <span class="number">1024</span> MB <span class="keyword">in</span> <span class="number">256</span> objects</span><br><span class="line">	order <span class="number">22</span> (<span class="number">4096</span> kB objects)</span><br><span class="line">	block_name_prefix: rbd_data.<span class="number">102</span>c2ae8944a</span><br><span class="line">	format: <span class="number">2</span></span><br><span class="line">	features: exclusive-lock, journaling</span><br><span class="line">	flags: </span><br><span class="line">	journal: <span class="number">102</span>c2ae8944a</span><br><span class="line">	mirroring state: enabled</span><br><span class="line">	mirroring global id: dabdbbed-<span class="number">7</span>c06-<span class="number">4</span>e1d-b860-<span class="number">8</span>dd104509565</span><br><span class="line">	mirroring primary: <span class="literal">true</span></span><br></pre></td></tr></tbody></table>

#### 五、开启rbd-mirror的同步进程

先用调试模式启动进程看看情况  
在lab8107的机器上执行  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ceph]<span class="comment"># rbd-mirror -d --setuser ceph --setgroup ceph --cluster remote -i admin</span></span><br><span class="line"><span class="number">2017</span>-<span class="number">01</span>-<span class="number">22</span> <span class="number">17</span>:<span class="number">43</span>:<span class="number">53.688820</span> <span class="number">7</span><span class="built_in">fc</span>926dc6c40  <span class="number">0</span> <span class="built_in">set</span> uid:gid to <span class="number">167</span>:<span class="number">167</span> (ceph:ceph)</span><br><span class="line"><span class="number">2017</span>-<span class="number">01</span>-<span class="number">22</span> <span class="number">17</span>:<span class="number">43</span>:<span class="number">53.688840</span> <span class="number">7</span><span class="built_in">fc</span>926dc6c40  <span class="number">0</span> ceph version <span class="number">10.2</span>.<span class="number">5</span> (c461ee19ecbc0c5c330aca20f7392c9a00730367), process rbd-mirror, pid <span class="number">32080</span></span><br></pre></td></tr></tbody></table>

如果确认没问题就用服务来控制启动  

<table><tbody><tr><td class="code"><pre><span class="line">vim /usr/lib/systemd/system/ceph-rbd-mirror@.service</span><br></pre></td></tr></tbody></table>

修改

> Environment=CLUSTER=remote

然后启动  
语法为：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ceph]<span class="comment">#systemctl start ceph-rbd-mirror@&lt;client-id&gt;</span></span><br></pre></td></tr></tbody></table>

在lab8107上启动进程  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ceph]<span class="comment"># systemctl start  ceph-rbd-mirror@admin</span></span><br><span class="line">[root@lab8107 ceph]<span class="comment"># ps -ef|grep rbd</span></span><br><span class="line">ceph      <span class="number">4325</span>     <span class="number">1</span>  <span class="number">1</span> <span class="number">17</span>:<span class="number">59</span> ?        <span class="number">00</span>:<span class="number">00</span>:<span class="number">00</span> /usr/bin/rbd-mirror <span class="operator">-f</span> --cluster remote --id admin --setuser ceph --setgroup ceph</span><br></pre></td></tr></tbody></table>

查询镜像的同步的状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rbd mirror image status rbd/image-1 --cluster remote</span></span><br><span class="line">image-<span class="number">1</span>:</span><br><span class="line">  global_id:   dabdbbed-<span class="number">7</span>c06-<span class="number">4</span>e1d-b860-<span class="number">8</span>dd104509565</span><br><span class="line">  state:       up+replaying</span><br><span class="line">  description: replaying, master_position=[object_number=<span class="number">2</span>, tag_tid=<span class="number">2</span>, entry_tid=<span class="number">3974</span>], mirror_position=[object_number=<span class="number">3</span>, tag_tid=<span class="number">2</span>, entry_tid=<span class="number">2583</span>], entries_behind_master=<span class="number">1391</span></span><br><span class="line">  last_update: <span class="number">2017</span>-<span class="number">01</span>-<span class="number">22</span> <span class="number">17</span>:<span class="number">54</span>:<span class="number">22</span></span><br></pre></td></tr></tbody></table>

检查数据是否同步  
在lab8107执行  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ceph]<span class="comment"># rbd info rbd/image-1</span></span><br><span class="line">rbd image <span class="string">'image-1'</span>:</span><br><span class="line">	size <span class="number">1024</span> MB <span class="keyword">in</span> <span class="number">256</span> objects</span><br><span class="line">	order <span class="number">22</span> (<span class="number">4096</span> kB objects)</span><br><span class="line">	block_name_prefix: rbd_data.<span class="number">127</span>b515f007c</span><br><span class="line">	format: <span class="number">2</span></span><br><span class="line">	features: exclusive-lock, journaling</span><br><span class="line">	flags: </span><br><span class="line">	journal: <span class="number">127</span>b515f007c</span><br><span class="line">	mirroring state: enabled</span><br><span class="line">	mirroring global id: fb976ffb<span class="operator">-a</span>71e-<span class="number">4714</span>-<span class="number">8464</span>-<span class="number">06381643</span>f984</span><br><span class="line">	mirroring primary: <span class="literal">false</span></span><br></pre></td></tr></tbody></table>

可以看到数据已经同步过来了

## 总结

通过配置文件控制，可以实现集群名称不修改  
rbd-mirror进程是在备份的集群上面启动的，并且是要能跟主集群和备份集群都能通信的，也就是peer都需要做，并且用户权限要控制好

根据上面的操作流程操作下来，应该是能够配置好rbd-mirror的

## 相关链接

[Ceph Jewel Preview: Ceph RBD mirroring](http://www.sebastien-han.fr/blog/2016/03/28/ceph-jewel-preview-ceph-rbd-mirroring/)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-01-22 |

Source: zphj1987@gmail ([rbd-mirror配置指南-单向备份](http://www.zphj1987.com/2017/01/22/rbd-mirror-configure-onesidebackup/))
