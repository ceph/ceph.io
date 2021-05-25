---
title: "ceph 的crush算法 straw"
date: "2017-01-05"
author: "admin"
tags: 
  - "planet"
---

  
![](images/crushmode.jpg)  

很多年以前，Sage 在写CRUSH的原始算法的时候，写了不同的Bucket类型，可以选择不同的伪随机选择算法，大部分的模型是基于RJ Honicky写的RUSH algorithms 这个算法，这个在网上可以找到资料，这里面有一个新的特性是sage很引以为豪的，straw算法，也就是我们现在常用的一些算法，这个算法有下面的特性：

- items 可以有任意的weight
- 选择一个项目的算法复杂度是O(n)
- 如果一个item的weight调高或者调低，只会在调整了的item直接变动，而没有调整的item是不会变动的

> O(n)找到一个数组里面最大的一个数，你要把n个变量都扫描一遍，操作次数为n，那么算法复杂度是O(n)  
> 冒泡法的算法复杂度是O(n²)

这个过程的算法基本动机看起来像画画的颜料吸管，最长的一个将会获胜，每个item 基于weight有自己的随机straw长度

这些看上去都很好，但是第三个属性实际上是不成立的，这个straw 长度是基于bucket中的其他的weights来进行的一个复杂的算法的，虽然iteam的PG的计算方法是很独立的，但是一个iteam的权重变化实际上影响了其他的iteam的比例因子，这意味着一个iteam的变化可能会影响其他的iteam

这个看起来是显而易见的，但是事实上证明，8年都没有人去仔细研究底层的代码或者算法，这个影响就是用户做了一个很小的权重变化，但是看到了一个很大的数据变动过程，sage 在做的时候写过一个很好的测试，来验证了第三个属性是真的，但是当时的测试只用了几个比较少的组合，如果大量测试是会发现这个问题的

sage注意到这个问题也是很多人抱怨在迁移的数据超过了预期的数据，但是这个很难量化和验证，所以被忽视了很久

无论如何，这是个坏消息

好消息是，sage找到了如何解决分布算法来的实现这三个属性，新的算法被称为 ‘straw2’,下面是不同的算法  
straw的算法  

<table><tbody><tr><td class="code"><pre><span class="line">max_x = -<span class="number">1</span></span><br><span class="line">max_item = -<span class="number">1</span></span><br><span class="line"><span class="keyword">for</span> each item:</span><br><span class="line">    x = random value from <span class="number">0</span>..<span class="number">65535</span></span><br><span class="line">    x *= scaling factor</span><br><span class="line">    <span class="keyword">if</span> x &gt; max_x:</span><br><span class="line">       max_x = x</span><br><span class="line">       max_item = item</span><br><span class="line"><span class="built_in">return</span> item</span><br></pre></td></tr></tbody></table>

这个就有问题了scaling factor(比例因子) 是其他iteam的权重所有的，这个就意味着改变A的权重，可能会影响到B和C的权重了

新的straw2的算法是这样的  

<table><tbody><tr><td class="code"><pre><span class="line">max_x = -<span class="number">1</span></span><br><span class="line">max_item = -<span class="number">1</span></span><br><span class="line"><span class="keyword">for</span> each item:</span><br><span class="line">   x = random value from <span class="number">0</span>..<span class="number">65535</span></span><br><span class="line">   x = ln(x / <span class="number">65536</span>) / weight</span><br><span class="line">   <span class="keyword">if</span> x &gt; max_x:</span><br><span class="line">      max_x = x</span><br><span class="line">      max_item = item</span><br><span class="line"><span class="built_in">return</span> item</span><br></pre></td></tr></tbody></table>

可以看到这个是一个weight的简单的函数，这个意味着改变一个item的权重不会影响到其他的项目

sage发现问题的一半，然后 sam根据[这个算法](https://en.wikipedia.org/wiki/Exponential_distribution#Distribution_of_the_minimum_of_exponential_random_variables)解决了问题

计算ln()函数有点讨厌，因为这个是一个浮点功能，CRUSH是定点运算（整数型），当前的实施方法是128KB的查找表，在做一个小的单元测试的时候比straw慢了25%，单这个可能跟一些缓存和输入也有关系

以上是2014年sage在开发者邮件列表里面提出来的，相信到现在为止straw2的算法已经改进了很多，目前默认的还是straw算法，内核在kernel4.1以后才支持的这个属性的

## 那么我们在0.9x中来看下这个属性,来从实际环境中看下具体有什么区别

## 实践过程

![基础环境.png-8.6kB](images/%E5%9F%BA%E7%A1%80%E7%8E%AF%E5%A2%83.png)

基础的环境为这个，我的机器为8个osd的单机节点，通过修改crush模拟成如上图所示的环境，设置的pg数目为800，保证每个osd上的pg为100左右，这个增加pg的数目，来扩大测试的样本

straw2和straw的区别在于，straw算法改变一个bucket的权重的时候，因为内部算法的问题，造成了其他机器的item的计算因子也会变化，就会出现其他没修改权重的bucket也会出现pg的相互间的流动，这个跟设计之初的想法是不一致的，造成的后果就是，在增加或者减少存储节点的时候，如果集群比较大，数据比较多，就会造成很大的无关数据的迁移，这个就是上面提到的问题

为了解决这个问题就新加入了算法straw2，这个算法保证在bucket的crush权重发生变化的时候，只会在变化的bucket有数据流入或者流出，不会出现其他bucket间的数据流动，减少数据的迁移量，下面的测试将会直观的看到这种变化

### 一、环境配置

调整tunables 为 hammer，这个里面才支持crush v4(straw2)属性  

<table><tbody><tr><td class="code"><pre><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd crush tunables hammer</span></span><br><span class="line">adjusted tunables profile to hammer</span><br><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd crush set-tunable straw_calc_version 1</span></span><br><span class="line">adjusted tunable straw_calc_version to <span class="number">1</span></span><br></pre></td></tr></tbody></table>

设置完了检查这两个个属性，如果是straw\_calc\_version 0的时候profile会显示unknow  

<table><tbody><tr><td class="code"><pre><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd crush dump|egrep "allowed_bucket_algs|profile"</span></span><br><span class="line">        <span class="string">"allowed_bucket_algs"</span>: <span class="number">54</span>,</span><br><span class="line">        <span class="string">"profile"</span>: <span class="string">"hammer"</span>,</span><br><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd crush dump|grep alg</span></span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw"</span>,</span><br></pre></td></tr></tbody></table>

设置完了后并不能马上生效的，这个是为了防止集群大的变动,可以用这个触发，或者等待下次crush发生变动的时候会自动触发  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd crush reweight-all</span><br></pre></td></tr></tbody></table>

### 二、先来测试straw

开始第一步测试，将osd.7从集群中crush改为0，那么变动的就是host4的crush，那么我们来看下数据的变化  
首先需要记录原始的pg分布  

<table><tbody><tr><td class="code"><pre><span class="line">root@lab8107:~ ceph pg dump pgs|awk <span class="string">'{print $1,$15}'</span> &gt; oringin</span><br><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd crush reweight osd.7 0</span></span><br><span class="line">reweighted item id <span class="number">7</span> name <span class="string">'osd.7'</span> to <span class="number">0</span> <span class="keyword">in</span> crush map</span><br><span class="line">root@lab8107:~ceph pg dump pgs|awk <span class="string">'{print $1,$15}'</span> &gt; rewei70</span><br></pre></td></tr></tbody></table>

现在比较oringin 和rewei70 的变化  

<table><tbody><tr><td class="code"><pre><span class="line">diff oringin rewei70 -y -W <span class="number">30</span> --suppress-common-lines</span><br></pre></td></tr></tbody></table>

查看非调整节点的数据流动  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">0.3</span>d [<span class="number">2</span>]      | <span class="number">0.3</span>d [<span class="number">5</span>]</span><br><span class="line"><span class="number">0.316</span> [<span class="number">2</span>]     | <span class="number">0.316</span> [<span class="number">5</span>]</span><br><span class="line"><span class="number">0.26</span>c [<span class="number">5</span>]     | <span class="number">0.26</span>c [<span class="number">1</span>]</span><br><span class="line"><span class="number">0.241</span> [<span class="number">2</span>]     | <span class="number">0.241</span> [<span class="number">0</span>]</span><br><span class="line"><span class="number">0.235</span> [<span class="number">5</span>]     | <span class="number">0.235</span> [<span class="number">2</span>]</span><br><span class="line"><span class="number">0.128</span> [<span class="number">0</span>]     | <span class="number">0.128</span> [<span class="number">3</span>]</span><br></pre></td></tr></tbody></table>

再来一次将osd.6的crush weight弄成0  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd crush reweight osd.<span class="number">6</span> <span class="number">0</span></span><br></pre></td></tr></tbody></table>

再次查看变化  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">0</span>.cb [<span class="number">4</span>]      | <span class="number">0</span>.cb [<span class="number">2</span>]</span><br><span class="line"><span class="number">0.30</span>b [<span class="number">4</span>]     | <span class="number">0.30</span>b [<span class="number">2</span>]</span><br><span class="line"><span class="number">0.2</span>e9 [<span class="number">1</span>]     | <span class="number">0.2</span>e9 [<span class="number">4</span>]</span><br><span class="line"><span class="number">0.2</span>d8 [<span class="number">3</span>]     | <span class="number">0.2</span>d8 [<span class="number">1</span>]</span><br><span class="line"><span class="number">0.28</span>e [<span class="number">3</span>]     | <span class="number">0.28</span>e [<span class="number">4</span>]</span><br><span class="line"><span class="number">0.286</span> [<span class="number">1</span>]     | <span class="number">0.286</span> [<span class="number">4</span>]</span><br><span class="line"><span class="number">0.1</span>f7 [<span class="number">3</span>]     | <span class="number">0.1</span>f7 [<span class="number">1</span>]</span><br><span class="line"><span class="number">0.1</span>b6 [<span class="number">1</span>]     | <span class="number">0.1</span>b6 [<span class="number">4</span>]</span><br><span class="line"><span class="number">0.163</span> [<span class="number">0</span>]     | <span class="number">0.163</span> [<span class="number">3</span>]</span><br><span class="line"><span class="number">0.14</span>f [<span class="number">2</span>]     | <span class="number">0.14</span>f [<span class="number">4</span>]</span><br><span class="line"><span class="number">0.10</span>a [<span class="number">0</span>]     | <span class="number">0.10</span>a [<span class="number">3</span>]</span><br></pre></td></tr></tbody></table>

上面的两组就是在一个bucket的里面的出现单点和整个bucket的crush weight减少的时候触发的其他节点的数据变动

### 三、现在把环境恢复后再来测试straw2

修改crush map 里面的bucket的alg  

<table><tbody><tr><td class="code"><pre><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd getcrushmap -o crushmap.txt</span></span><br><span class="line">got crush map from osdmap epoch <span class="number">390</span></span><br><span class="line">root@lab8107:~/ceph/crush<span class="comment"># crushtool -d crushmap.txt -o crushmap-decompile</span></span><br><span class="line">root@lab8107:~/ceph/crush<span class="comment"># vim crushmap-decompile</span></span><br><span class="line">将文件里面的所有straw修改成straw2</span><br><span class="line">root@lab8107:~/ceph/crush<span class="comment"># crushtool -c crushmap-decompile  -o crushmap-compile</span></span><br><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd setcrushmap -i crushmap-compile</span></span><br></pre></td></tr></tbody></table>

> 如果出现报错就把crushmap里面的straw2\_calc\_version改成straw\_calc\_version

并且设置算法(最关键的一步，否则即使设置straw2也不生效)  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd crush <span class="built_in">set</span>-tunable straw_calc_version <span class="number">2</span></span><br></pre></td></tr></tbody></table>

查询当前的crush算法  

<table><tbody><tr><td class="code"><pre><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd crush dump|grep alg</span></span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw2"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw2"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw2"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw2"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw2"</span>,</span><br><span class="line">            <span class="string">"alg"</span>: <span class="string">"straw2"</span>,</span><br><span class="line">        <span class="string">"allowed_bucket_algs"</span>: <span class="number">54</span>,</span><br></pre></td></tr></tbody></table>

做一次重新内部算法  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd crush reweight-all</span><br></pre></td></tr></tbody></table>

可以重复上面的测试了

获取当前的pg分布  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 pgf]<span class="comment"># ceph pg dump pgs|awk '{print $1,$15}' &gt; oringin</span></span><br><span class="line">root@lab8107:~/ceph/crush<span class="comment"># ceph osd crush reweight osd.7 0</span></span><br><span class="line">[root@lab8106 pgf]<span class="comment"># ceph pg dump pgs|awk '{print $1,$15}' &gt; rewei70</span></span><br></pre></td></tr></tbody></table>

比较调整前后  

<table><tbody><tr><td class="code"><pre><span class="line">diff oringin rewei70  -y -W <span class="number">30</span> --suppress-common-lines|less</span><br></pre></td></tr></tbody></table>

再次调整osd.6  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="title">ceph</span> osd crush reweight osd.<span class="number">6</span> <span class="number">0</span></span><br><span class="line">ceph pg dump pgs|awk <span class="string">'{print <span class="variable">$1</span>,<span class="variable">$15</span>}'</span> &gt; rewei60</span><br></pre></td></tr></tbody></table>

已经没有非调整bucket的pg在节点间的变化了

### 四、简短的做个总结就是

straw算法里面添加节点或者减少节点，其他服务器上的osd之间会有pg的流动  
straw2算法里面添加节点或者减少节点，只会pg从变化的节点移出或者从其他点移入，其他节点间没有数据流动

#### 设置方法

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd crush tunables hammer</span><br><span class="line">ceph osd crush <span class="built_in">set</span>-tunable straw_calc_version <span class="number">2</span></span><br></pre></td></tr></tbody></table>

开始设置好了 新创建的默认就是会straw2就会省去修改crushmap的操作

注意librados是服务端支持，客户端就支持，涉及到内核客户端的，就需要内核版本的支持，内核从4.1开始支持，也就是cephfs和rbd的块设备方式需要内核4.1及以上支持，openstack对接的是librados可以默认支持，其他的也都默认可以支持的

## 相关链接

[https://en.wikipedia.org/wiki/Exponential\_distribution#Distribution\_of\_the\_minimum\_of\_exponential\_random\_variables](https://en.wikipedia.org/wiki/Exponential_distribution#Distribution_of_the_minimum_of_exponential_random_variables)

### 我的公众号-磨磨谈

  
![](images/qrcode_for_gh_6998a54d68f7_430.jpg)  

Source: zphj1987@gmail ([ceph 的crush算法 straw](http://www.zphj1987.com/2017/01/05/ceph-crush-straw/))
