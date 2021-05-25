---
title: "rados put striper功能的调试"
date: "2017-04-26"
author: "admin"
tags: 
  - "planet"
---

  
![strip](images/strip.jpg)  

## 前言

之前对于striper这个地方的功能并没研究太多，只是知道这个里面可以以条带方式并行的去写对象，从而加大并发性来提高性能，而默认的条带数目为1，也就是以对象大小去写，并没有条带，所以不是很好感觉到差别，今天就尝试下用rados命令来看下这个条带是怎么回事  

## 实践过程

最开始我的集群是用rpm包进行安装的，这个可以做一些常规的测试，如果需要改动一些代码的话，就比较麻烦了，本文后面会讲述怎么改动一点点代码，然后进行测试

我们一般来说用rados put操作就是一个完整的文件，并不会进行拆分，我们尝试下看下  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># dd if=/dev/zero of=16M bs=4M count=4</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd put 16M 16M</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd stat 16M</span></span><br><span class="line">rbd/<span class="number">16</span>M mtime <span class="number">2017</span>-<span class="number">04</span>-<span class="number">26</span> <span class="number">15</span>:<span class="number">08</span>:<span class="number">14.000000</span>, size <span class="number">16777216</span></span><br></pre></td></tr></tbody></table>

可以看到我们put 16M的文件，在后台就是一个16M的对象

这个rados命令还有个参数是striper  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># rados  --help|grep stri</span></span><br><span class="line">   --striper</span><br><span class="line">        Use radostriper interface rather than pure rados</span><br></pre></td></tr></tbody></table>

我们来用这个命令试一下  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># dd if=/dev/zero of=strip16M bs=4M count=4</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd put strip16M strip16M --striper</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd ls |grep strip</span></span><br><span class="line">strip16M.<span class="number">0000000000000002</span></span><br><span class="line">strip16M.<span class="number">0000000000000003</span></span><br><span class="line">strip16M.<span class="number">0000000000000000</span></span><br><span class="line">strip16M.<span class="number">0000000000000001</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd  --striper ls |grep strip</span></span><br><span class="line">strip16M</span><br><span class="line">[root@lab8106 ~]<span class="comment">#  rados  -p rbd stat strip16M.0000000000000002</span></span><br><span class="line">rbd/strip16M.<span class="number">0000000000000002</span> mtime <span class="number">2017</span>-<span class="number">04</span>-<span class="number">26</span> <span class="number">15</span>:<span class="number">11</span>:<span class="number">06.000000</span>, size <span class="number">4194304</span></span><br></pre></td></tr></tbody></table>

可以看到这个16M的文件是被拆分成了4M一个的对象，存储到了后台的,我们开启下日志后看下有没有什么详细的信息，因为在rados参数当中确实没有找到可配置的选项  
在/etc/ceph/ceph.conf当中添加  

<table><tbody><tr><td class="code"><pre><span class="line">debug_rados=<span class="number">20</span></span><br><span class="line">debug_striper=<span class="number">20</span></span><br></pre></td></tr></tbody></table>

再次测试  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># dd if=/dev/zero of=strip116M bs=4M count=4</span></span><br><span class="line">[root@lab8106 ~]<span class="comment"># rados  -p rbd put strip116M strip116M --striper</span></span><br><span class="line">···</span><br><span class="line">sc is one, reset su to os</span><br><span class="line">su <span class="number">4194304</span> sc <span class="number">1</span> os <span class="number">4194304</span> stripes_per_object <span class="number">1</span></span><br><span class="line">···</span><br></pre></td></tr></tbody></table>

这个地方解释下意思

> strip count is 1,重置strip unit为object size ，也就是4M  
> strip unit 4194304 ，strip count 1，object size 4194304,每个对象的条带为1

这个代码里面写了  
[https://github.com/ceph/ceph/blob/master/src/tools/rados/rados.cc](https://github.com/ceph/ceph/blob/master/src/tools/rados/rados.cc)  

<table><tbody><tr><td class="code"><pre><span class="line">--striper</span><br><span class="line">       Use radostriper interface rather than pure rados</span><br></pre></td></tr></tbody></table>

也就是这个rados在加了参数之后是调用了radostriper interface这个接口的，所以猜测这个条带的相关参数应该是在接口里面写死了的  
[https://github.com/ceph/ceph/blob/master/src/libradosstriper/RadosStriperImpl.cc](https://github.com/ceph/ceph/blob/master/src/libradosstriper/RadosStriperImpl.cc)  

<table><tbody><tr><td class="code"><pre><span class="line">/// default object layout</span><br><span class="line">struct ceph_file_layout default_file_layout = {</span><br><span class="line"> fl_stripe_unit: init_le32(<span class="number">1</span>&lt;&lt;<span class="number">22</span>),</span><br><span class="line"> fl_stripe_count: init_le32(<span class="number">1</span>),</span><br><span class="line"> fl_object_size: init_le32(<span class="number">1</span>&lt;&lt;<span class="number">22</span>),</span><br><span class="line"> fl_cas_<span class="built_in">hash</span>: init_le32(<span class="number">0</span>),</span><br><span class="line"> fl_object_stripe_unit: init_le32(<span class="number">0</span>),</span><br><span class="line"> fl_unused: init_le32(-<span class="number">1</span>),</span><br><span class="line"> fl_pg_pool : init_le32(-<span class="number">1</span>),</span><br><span class="line">};</span><br></pre></td></tr></tbody></table>

下面开始看下调试模式下改下这几个数值

### 下载代码

<table><tbody><tr><td class="code"><pre><span class="line">git <span class="built_in">clone</span> https://github.com/ceph/ceph.git</span><br><span class="line">git checkout -b myceph2 v10.<span class="number">2.3</span></span><br><span class="line">git submodule update --init --recursive</span><br></pre></td></tr></tbody></table>

切换到10.2.3版本,用的make模式，没用cmake  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">cd</span> ceph</span><br><span class="line">./install-deps.sh</span><br><span class="line">./autogen.sh</span><br><span class="line">./configure</span><br><span class="line">make -j <span class="number">12</span></span><br></pre></td></tr></tbody></table>

启动开发模式服务  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">cd</span> src</span><br><span class="line">./vstart.sh --mon_num <span class="number">1</span> --osd_num <span class="number">3</span> --mds_num <span class="number">1</span>  --short -n <span class="operator">-d</span></span><br></pre></td></tr></tbody></table>

这样，dev cluster就起来了。修改部分源码重新make之后，需要关闭cluster，重启让代码生效，当然最好的是，你修改哪个模块，就重启那个模块就行，这里使用重启集群  

<table><tbody><tr><td class="code"><pre><span class="line">./stop.sh all</span><br><span class="line">./vstart.sh --mon_num <span class="number">1</span> --osd_num <span class="number">3</span> --mds_num <span class="number">1</span> --short  <span class="operator">-d</span></span><br></pre></td></tr></tbody></table>

查看状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment"># ./ceph -s -c ./ceph.conf</span></span><br></pre></td></tr></tbody></table>

我们修改下代码  
vim libradosstriper/RadosStriperImpl.cc  

<table><tbody><tr><td class="code"><pre><span class="line">/// default object layout</span><br><span class="line">struct ceph_file_layout default_file_layout = {</span><br><span class="line"> fl_stripe_unit: init_le32(<span class="number">1</span>&lt;&lt;<span class="number">21</span>),</span><br><span class="line"> fl_stripe_count: init_le32(<span class="number">2</span>),</span><br><span class="line"> fl_object_size: init_le32(<span class="number">1</span>&lt;&lt;<span class="number">22</span>),</span><br><span class="line"> fl_cas_<span class="built_in">hash</span>: init_le32(<span class="number">0</span>),</span><br><span class="line"> fl_object_stripe_unit: init_le32(<span class="number">0</span>),</span><br><span class="line"> fl_unused: init_le32(-<span class="number">1</span>),</span><br><span class="line"> fl_pg_pool : init_le32(-<span class="number">1</span>),</span><br><span class="line">};</span><br></pre></td></tr></tbody></table>

修改的是stripe\_unit为2M，stripe\_count为2，object\_size为4M，也就是条带为2  
修改完了后重新make  

<table><tbody><tr><td class="code"><pre><span class="line">./stop.sh all</span><br><span class="line">./vstart.sh --mon_num <span class="number">1</span> --osd_num <span class="number">3</span> --mds_num <span class="number">1</span> --short  <span class="operator">-d</span></span><br></pre></td></tr></tbody></table>

初始化集群，修改下配置文件增加调试信息  
vim ./ceph.conf  

<table><tbody><tr><td class="code"><pre><span class="line">debug_rados=<span class="number">20</span></span><br><span class="line">debug_striper=<span class="number">20</span></span><br></pre></td></tr></tbody></table>

创建文件  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># dd if=/dev/zero of=debugstrip16M bs=4M count=4</span></span><br><span class="line">[root@lab8106 src]<span class="comment"># ./rados -c ./ceph.conf --striper  -p rbd  put  debugstrip16M debugstrip16M</span></span><br><span class="line">[root@lab8106 src]<span class="comment">#./rados -c ./ceph.conf  -p rbd  stat debugstrip16M.0000000000000001</span></span><br><span class="line">rbd/debugstrip16M.<span class="number">0000000000000001</span> mtime <span class="number">2017</span>-<span class="number">04</span>-<span class="number">26</span> <span class="number">15</span>:<span class="number">38</span>:<span class="number">41.483464</span> </span><br><span class="line"><span class="number">2017</span>-<span class="number">04</span>-<span class="number">26</span> <span class="number">15</span>:<span class="number">37</span>:<span class="number">27.000000</span>, size <span class="number">4194304</span></span><br></pre></td></tr></tbody></table>

可以看到对象还是4M  
我们截取下日志分析  

<table><tbody><tr><td class="code"><pre><span class="line">su <span class="number">2097152</span> sc <span class="number">2</span> os <span class="number">4194304</span> stripes_per_object <span class="number">2</span></span><br><span class="line">off <span class="number">0</span> blockno <span class="number">0</span> stripeno <span class="number">0</span> stripepos <span class="number">0</span> objectsetno <span class="number">0</span> objectno <span class="number">0</span> block_start <span class="number">0</span></span><br><span class="line">added new extent(debugstrip16M.<span class="number">0000000000000000</span> (<span class="number">0</span>) </span><br><span class="line">off <span class="number">2097152</span> blockno <span class="number">1</span> stripeno <span class="number">0</span> stripepos <span class="number">1</span> objectsetno <span class="number">0</span> objectno <span class="number">1</span> block_start <span class="number">0</span> </span><br><span class="line">added new extent(debugstrip16M.<span class="number">0000000000000001</span> (<span class="number">1</span>) </span><br><span class="line">off <span class="number">4194304</span> blockno <span class="number">2</span> stripeno <span class="number">1</span> stripepos <span class="number">0</span> objectsetno <span class="number">0</span> objectno <span class="number">0</span> block_start <span class="number">2097152</span></span><br><span class="line">added new extent(debugstrip16M.<span class="number">0000000000000000</span> (<span class="number">0</span>)   </span><br><span class="line">off <span class="number">6291456</span> blockno <span class="number">3</span> stripeno <span class="number">1</span> stripepos <span class="number">1</span> objectsetno <span class="number">0</span> objectno <span class="number">1</span> block_start <span class="number">2097152</span></span><br><span class="line">added new extent(debugstrip16M.<span class="number">0000000000000001</span> (<span class="number">1</span>)</span><br><span class="line">off <span class="number">8388608</span> blockno <span class="number">4</span> stripeno <span class="number">2</span> stripepos <span class="number">0</span> objectsetno <span class="number">1</span> objectno <span class="number">2</span> block_start <span class="number">0</span></span><br><span class="line">added new extent(debugstrip16M.<span class="number">0000000000000002</span> (<span class="number">2</span>) </span><br><span class="line">off <span class="number">10485760</span> blockno <span class="number">5</span> stripeno <span class="number">2</span> stripepos <span class="number">1</span> objectsetno <span class="number">1</span> objectno <span class="number">3</span> block_start <span class="number">0</span></span><br><span class="line">added new extent(debugstrip16M.<span class="number">0000000000000003</span> (<span class="number">3</span>) </span><br><span class="line">off <span class="number">12582912</span> blockno <span class="number">6</span> stripeno <span class="number">3</span> stripepos <span class="number">0</span> objectsetno <span class="number">1</span> objectno <span class="number">2</span> block_start <span class="number">2097152</span> </span><br><span class="line">added new extent(debugstrip16M.<span class="number">0000000000000002</span> (<span class="number">2</span>)</span><br><span class="line">off <span class="number">14680064</span> blockno <span class="number">7</span> stripeno <span class="number">3</span> stripepos <span class="number">1</span> objectsetno <span class="number">1</span> objectno <span class="number">3</span> block_start <span class="number">2097152</span> </span><br><span class="line">added new extent(debugstrip16M.<span class="number">0000000000000003</span> (<span class="number">3</span>)</span><br></pre></td></tr></tbody></table>

从上面可以看到先在debugstrip16M.0000000000000000写了2M，在debugstrip16M.0000000000000001写了2M，  
然后在debugstrip16M.0000000000000000追加写了2M，并且是从block\_start 2097152开始的，每个对象是写了两次的并且每次写的就是条带的大小的2M，跟修改上面的条带大小和对象大小是一致的，并且可以很清楚的看到写对象的过程

## 总结

本篇尝试了用rados来测试strip功能，并且顺带讲了下怎么在开发模式下修改代码并测试，如果自己写客户端的话，利用librados的时候，可以考虑使用libradosstriper条带来增加一定的性能

## 参考文档

[准备Ceph开发环境](http://ivanjobs.github.io/2016/05/11/prepare-ceph-dev-env/)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-04-26 |

Source: zphj1987@gmail ([rados put striper功能的调试](http://www.zphj1987.com/2017/04/26/rados-put-strip-debug/))
