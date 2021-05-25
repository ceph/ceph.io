---
title: "Ceph实现数据的'不拆分'"
date: "2017-03-22"
author: "admin"
tags: 
  - "planet"
---

  
![oct](images/octopus.png)  

## 前言

之前看过一个朋友一篇文章，讲述的是Vsan为什么使用的是两副本，而ceph则大多数情况下需要三副本，当时个人观点是这个并不是关键点，但是在仔细考虑了问题的出发点以后，这个也可以说是其中的一个点  
  
一个集群数据丢失可以从多方面去看

- 发生丢失数据的事件，这个来说，出现这个事件的概率是一致的，同等硬件情况下没有谁的系统能够说在两副本情况下把这个出现坏盘概率做的比其他系统更低
- 发生坏盘事件以后，数据丢失波及的范围，这个就是那个朋友提出的一个观点，对于Vsan来说因为文件的不拆分，也就是在丢了的情况下，只是局部数据的丢失，而ceph的数据因为拆分到整个集群，基本上说就是全军覆没了，这一点没有什么争议

一般来说，ceph都是配置的分布式文件系统，也就是数据以PG为组合，以对象为最小单元的形式分布到整个集群当中去，通过控制crush能够增加一定的可用概率，但是有没有办法实现真的丢盘的情况下，数据波及没有那么广，答案当然是有的，只是需要做一些更细微的控制，前端的使用的接口也需要做一定的改动，本篇将讲述这个如何去实现，以及前端可能需要的变动

## 方案实现

首先来一张示意图，来介绍大致的实现方式，下面再给出操作步骤

  
![osd不拆分.png-15.7kB](images/osd%E4%B8%8D%E6%8B%86%E5%88%86.png)  

主要包括三步

- 横向划条带
- 创建对应规则
- 根据规则创建相关存储池

### 横向划条带

创建虚拟根  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd crush add-bucket default<span class="operator">-a</span> root</span><br><span class="line">ceph osd crush add-bucket default-b root</span><br><span class="line">ceph osd crush add-bucket default-c root</span><br><span class="line">ceph osd crush add-bucket default<span class="operator">-d</span> root</span><br></pre></td></tr></tbody></table>

创建虚拟主机  

<table><tbody><tr><td class="code"><pre><span class="line">ceph  osd crush add-bucket host1<span class="operator">-a</span> host</span><br><span class="line">ceph  osd crush add-bucket host2<span class="operator">-a</span> host</span><br><span class="line">ceph  osd crush add-bucket host3<span class="operator">-a</span> host</span><br><span class="line">ceph  osd crush add-bucket host1-b host</span><br><span class="line">ceph  osd crush add-bucket host2-b host</span><br><span class="line">ceph  osd crush add-bucket host3-b host</span><br><span class="line">ceph  osd crush add-bucket host1-c host</span><br><span class="line">ceph  osd crush add-bucket host2-c host</span><br><span class="line">ceph  osd crush add-bucket host3-c host</span><br><span class="line">ceph  osd crush add-bucket host1<span class="operator">-d</span> host</span><br><span class="line">ceph  osd crush add-bucket host2<span class="operator">-d</span> host</span><br><span class="line">ceph  osd crush add-bucket host3<span class="operator">-d</span> host</span><br></pre></td></tr></tbody></table>

将虚拟主机挪到虚拟根里面  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd crush move host1<span class="operator">-a</span> root=default<span class="operator">-a</span></span><br><span class="line">ceph osd crush move host2<span class="operator">-a</span> root=default<span class="operator">-a</span></span><br><span class="line">ceph osd crush move host3<span class="operator">-a</span> root=default<span class="operator">-a</span></span><br><span class="line">ceph osd crush move host1-b root=default-b</span><br><span class="line">ceph osd crush move host2-b root=default-b</span><br><span class="line">ceph osd crush move host3-b root=default-b</span><br><span class="line">ceph osd crush move host1-c root=default-c</span><br><span class="line">ceph osd crush move host2-c root=default-c</span><br><span class="line">ceph osd crush move host3-c root=default-c</span><br><span class="line">ceph osd crush move host1<span class="operator">-d</span> root=default<span class="operator">-d</span></span><br><span class="line">ceph osd crush move host2<span class="operator">-d</span> root=default<span class="operator">-d</span></span><br><span class="line">ceph osd crush move host3<span class="operator">-d</span> root=default<span class="operator">-d</span></span><br></pre></td></tr></tbody></table>

将osd塞入到指定的bucker内  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd  crush create-or-move  osd.<span class="number">0</span> <span class="number">1.83</span>  host=host1<span class="operator">-a</span></span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">4</span> <span class="number">1.83</span>  host=host2<span class="operator">-a</span></span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">8</span> <span class="number">1.83</span>  host=host3<span class="operator">-a</span></span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">1</span> <span class="number">1.83</span>  host=host1-b</span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">5</span> <span class="number">1.83</span>  host=host2-b</span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">9</span> <span class="number">1.83</span>  host=host3-b</span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">2</span> <span class="number">1.83</span>  host=host1-c</span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">6</span> <span class="number">1.83</span>  host=host2-c</span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">10</span> <span class="number">1.83</span>  host=host3-c</span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">3</span> <span class="number">1.83</span>  host=host1<span class="operator">-d</span></span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">7</span> <span class="number">1.83</span>  host=host2<span class="operator">-d</span></span><br><span class="line">ceph osd  crush create-or-move  osd.<span class="number">11</span> <span class="number">1.83</span>  host=host3<span class="operator">-d</span></span><br></pre></td></tr></tbody></table>

查看现在的树  

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph]<span class="comment"># ceph osd tree</span></span><br><span class="line">ID  WEIGHT  TYPE NAME        UP/DOWN REWEIGHT PRIMARY-AFFINITY </span><br><span class="line"> -<span class="number">8</span> <span class="number">5.44080</span> root default<span class="operator">-d</span>                                     </span><br><span class="line">-<span class="number">18</span> <span class="number">1.81360</span>     host host1<span class="operator">-d</span>                                   </span><br><span class="line">  <span class="number">3</span> <span class="number">1.81360</span>         osd.<span class="number">3</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">19</span> <span class="number">1.81360</span>     host host2<span class="operator">-d</span>                                   </span><br><span class="line">  <span class="number">7</span> <span class="number">1.81360</span>         osd.<span class="number">7</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">20</span> <span class="number">1.81360</span>     host host3<span class="operator">-d</span>                                   </span><br><span class="line"> <span class="number">11</span> <span class="number">1.81360</span>         osd.<span class="number">11</span>        up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> -<span class="number">7</span> <span class="number">5.44080</span> root default-c                                     </span><br><span class="line">-<span class="number">15</span> <span class="number">1.81360</span>     host host1-c                                   </span><br><span class="line">  <span class="number">2</span> <span class="number">1.81360</span>         osd.<span class="number">2</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">16</span> <span class="number">1.81360</span>     host host2-c                                   </span><br><span class="line">  <span class="number">6</span> <span class="number">1.81360</span>         osd.<span class="number">6</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">17</span> <span class="number">1.81360</span>     host host3-c                                   </span><br><span class="line"> <span class="number">10</span> <span class="number">1.81360</span>         osd.<span class="number">10</span>        up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> -<span class="number">6</span> <span class="number">5.44080</span> root default-b                                     </span><br><span class="line">-<span class="number">12</span> <span class="number">1.81360</span>     host host1-b                                   </span><br><span class="line">  <span class="number">1</span> <span class="number">1.81360</span>         osd.<span class="number">1</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">13</span> <span class="number">1.81360</span>     host host2-b                                   </span><br><span class="line">  <span class="number">5</span> <span class="number">1.81360</span>         osd.<span class="number">5</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">14</span> <span class="number">1.81360</span>     host host3-b                                   </span><br><span class="line">  <span class="number">9</span> <span class="number">1.81360</span>         osd.<span class="number">9</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> -<span class="number">5</span> <span class="number">5.44080</span> root default<span class="operator">-a</span>                                     </span><br><span class="line"> -<span class="number">9</span> <span class="number">1.81360</span>     host host1<span class="operator">-a</span>                                   </span><br><span class="line">  <span class="number">0</span> <span class="number">1.81360</span>         osd.<span class="number">0</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">10</span> <span class="number">1.81360</span>     host host2<span class="operator">-a</span>                                   </span><br><span class="line">  <span class="number">4</span> <span class="number">1.81360</span>         osd.<span class="number">4</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line">-<span class="number">11</span> <span class="number">1.81360</span>     host host3<span class="operator">-a</span>                                   </span><br><span class="line">  <span class="number">8</span> <span class="number">1.81360</span>         osd.<span class="number">8</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"> -<span class="number">1</span>       <span class="number">0</span> root default                                       </span><br><span class="line"> -<span class="number">2</span>       <span class="number">0</span>     host host1                                     </span><br><span class="line"> -<span class="number">3</span>       <span class="number">0</span>     host host2                                     </span><br><span class="line"> -<span class="number">4</span>       <span class="number">0</span>     host host3</span><br></pre></td></tr></tbody></table>

下面老的一些bucket可以清理掉  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd pool delete rbd rbd  --yes-i-really-really-mean-it</span><br><span class="line">ceph osd crush rule rm replicated_ruleset</span><br><span class="line">ceph osd crush remove host1</span><br><span class="line">ceph osd crush remove host2</span><br><span class="line">ceph osd crush remove host3</span><br><span class="line">ceph osd crush remove default</span><br></pre></td></tr></tbody></table>

### 创建对应规则

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd crush rule create-simple rule048  default<span class="operator">-a</span> host</span><br><span class="line">ceph osd crush rule create-simple rule159  default-b host</span><br><span class="line">ceph osd crush rule create-simple rule2610  default-c host</span><br><span class="line">ceph osd crush rule create-simple rule3711  default<span class="operator">-d</span> host</span><br></pre></td></tr></tbody></table>

检查下规则  

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph]<span class="comment"># ceph osd crush rule dump|grep "rule_name|item_name"</span></span><br><span class="line">        <span class="string">"rule_name"</span>: <span class="string">"rule048"</span>,</span><br><span class="line">                <span class="string">"item_name"</span>: <span class="string">"default-a"</span></span><br><span class="line">        <span class="string">"rule_name"</span>: <span class="string">"rule159"</span>,</span><br><span class="line">                <span class="string">"item_name"</span>: <span class="string">"default-b"</span></span><br><span class="line">        <span class="string">"rule_name"</span>: <span class="string">"rule2610"</span>,</span><br><span class="line">                <span class="string">"item_name"</span>: <span class="string">"default-c"</span></span><br><span class="line">        <span class="string">"rule_name"</span>: <span class="string">"rule3711"</span>,</span><br><span class="line">                <span class="string">"item_name"</span>: <span class="string">"default-d"</span></span><br></pre></td></tr></tbody></table>

### 根据规则创建相关存储池

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph]<span class="comment"># ceph osd pool create poola048 64 64 replicated rule048</span></span><br><span class="line">pool <span class="string">'poola048'</span> created</span><br><span class="line">[root@host1 ceph]<span class="comment"># ceph osd pool create poolb159 64 64 replicated rule159</span></span><br><span class="line">pool <span class="string">'poolb159'</span> created</span><br><span class="line">[root@host1 ceph]<span class="comment"># ceph osd pool create poolc2610 64 64 replicated rule2610</span></span><br><span class="line">pool <span class="string">'poolb2610'</span> created</span><br><span class="line">[root@host1 ceph]<span class="comment"># ceph osd pool create poold3711 64 64 replicated rule3711</span></span><br><span class="line">pool <span class="string">'poolb3711'</span> created</span><br></pre></td></tr></tbody></table>

检查存储池  

<table><tbody><tr><td class="code"><pre><span class="line">[root@host1 ceph]<span class="comment"># ceph osd dump|grep pool</span></span><br><span class="line">pool <span class="number">1</span> <span class="string">'poola048'</span> replicated size <span class="number">2</span> min_size <span class="number">1</span> crush_ruleset <span class="number">0</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">64</span> pgp_num <span class="number">64</span> last_change <span class="number">145</span> flags hashpspool stripe_width <span class="number">0</span></span><br><span class="line">pool <span class="number">2</span> <span class="string">'poolb159'</span> replicated size <span class="number">2</span> min_size <span class="number">1</span> crush_ruleset <span class="number">1</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">64</span> pgp_num <span class="number">64</span> last_change <span class="number">147</span> flags hashpspool stripe_width <span class="number">0</span></span><br><span class="line">pool <span class="number">3</span> <span class="string">'poolc2610'</span> replicated size <span class="number">2</span> min_size <span class="number">1</span> crush_ruleset <span class="number">2</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">64</span> pgp_num <span class="number">64</span> last_change <span class="number">149</span> flags hashpspool stripe_width <span class="number">0</span></span><br><span class="line">pool <span class="number">4</span> <span class="string">'poold3711'</span> replicated size <span class="number">2</span> min_size <span class="number">1</span> crush_ruleset <span class="number">3</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">64</span> pgp_num <span class="number">64</span> last_change <span class="number">151</span> flags hashpspool stripe_width <span class="number">0</span></span><br></pre></td></tr></tbody></table>

到这里基本的环境就配置好了，采用的是副本2，但是虚拟组里面留了三个osd，这个后面会解释

## 如何使用

假设现在前端需要8个image用来使用了，那么我们创建的时候，就将这个8个平均分布到上面的四个存储里面去，这里是因为是划成了四个条带，在实际环境当中，可以根据需要进行划分，在选择用哪个存储的时候可以去用轮询的算法，进行轮询，也可以自定义去选择在哪个存储池创建，这个都是可以控制的

### 创建image

<table><tbody><tr><td class="code"><pre><span class="line">rbd -p poola048 create image1 --size <span class="number">1</span>G</span><br><span class="line">rbd -p poola048 create image2 --size <span class="number">1</span>G</span><br><span class="line">rbd -p poolb159 create image3 --size <span class="number">1</span>G</span><br><span class="line">rbd -p poolb159 create image4 --size <span class="number">1</span>G</span><br><span class="line">rbd -p poolc2610 create image6 --size <span class="number">1</span>G</span><br><span class="line">rbd -p poolc2610 create image7 --size <span class="number">1</span>G</span><br><span class="line">rbd -p poold3711 create image8 --size <span class="number">1</span>G</span><br><span class="line">rbd -p poold3711 create image9 --size <span class="number">1</span>G</span><br></pre></td></tr></tbody></table>

### 如何跟virsh对接

如果你熟悉virsh配置文件的话，可以看到rbd相关的配置文件是这样的  

<table><tbody><tr><td class="code"><pre><span class="line">&lt;<span class="built_in">source</span> protocol=<span class="string">'rbd'</span> name=<span class="string">'volumes/volume-f20fd994-e600-41da-a6d8-6e216044dbb1'</span>&gt;</span><br><span class="line">        &lt;host name=<span class="string">'192.168.10.4'</span> port=<span class="string">'6789'</span>/&gt;</span><br><span class="line">&lt;/<span class="built_in">source</span>&gt;</span><br></pre></td></tr></tbody></table>

在cinder的相关配置当中虽然我们指定了volume这个存储池值是一个定值，在这个配置文件当中也就读取了这个值，那么需要改造的接口就是在创建云盘的时候，不去将cinder的存储池固定死，volumes/volume-f20fd994-e600-41da-a6d8-6e216044dbb1这样的值可以是上面的poola048/image1,也可以是poolc2610/image6,这个地方就是需要改动的地方，将整个值包含存储池的值作为一个变量，这个改动应该属于可改的

## 分析

按上面的进行处理以后，那么再出现同时坏了两个盘的情况下，数据丢失的波及范围跟Vsan已经是一致了，因为数据打散也只是在这个三个里面打散了，真的出现磁盘损坏波及的也是局部的数据了

问题：  
1、分布范围小了性能怎么样  
比完全分布来说性能肯定降低了一些，但是如果说对于负载比较高的情况，每个盘都在跑的情况下，这个性能是一定的，底层的磁盘提供的带宽是一定的，这个跟VSAN一样的

并且这个上面所示的是极端的情况下的，缩小到3个OSD一组条带，也可以自行放宽到6个一个条带，这个只是提供了一种方法，缩小了波及范围

2、副本2为什么留3个osd一个条带  
比副本数多1的话，这样在坏了一个盘也可以迁移，所以一般来说，至少比副本数多1的故障域

3、如何扩容  
扩容就增加条带即可，并且可以把老的存储池规则指定到新的磁盘的条带上面

4、这个方法还可以用故障域增加可用性么  
可以的，可以从每个故障域里面抽出OSD即可，只要保证底层的数据不重叠，实际是两个不同的需求

## 总结

本篇是提供了一种可能性，在实际运行环境当中，可以根据自己的环境进行设计，设计的方法就是，假设一个数据的全部副本都丢了的情况，允许的数据波及范围是多少，如果拆分两份就是波及二分之一，我的测试环境是分成了四个条带，也就是只影响四分之一的数据

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-03-22 |

Source: zphj1987@gmail ([Ceph实现数据的'不拆分'](http://www.zphj1987.com/2017/03/22/ceph-no-distribute-all/))
