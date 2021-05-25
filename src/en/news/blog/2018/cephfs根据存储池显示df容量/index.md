---
title: "cephfs根据存储池显示df容量"
date: "2018-08-19"
author: "admin"
tags: 
  - "planet"
---

  
![pool.png-115.2kB](images/pool1.png)  

## 前言

如果用cephfs比较多，应该都知道，在cephfs的客户端进行mount以后，看到的容量显示的是集群的总的容量，也就是你的总的磁盘空间是多少这个地方显示的就是多少

这个一直都是这样显示的，我们之前在hammer版本的时候，阿茂和大黄一起在公司内部实现了这个功能，社区会慢慢的集成一些类似的面向面向商业用户的需求

社区已经开发了一个版本，接口都做的差不多了，那么稍微改改，就能实现想要的需求的

本篇内的改动是基于内核客户端代码的改动，改动很小，应该能够看的懂

## 改动过程

首先找到这个补丁

> Improve accuracy of statfs reporting for Ceph filesystems comprising exactly one data pool. In this case, the Ceph monitor can now report the space usage for the single data pool instead of the global data for the entire Ceph cluster. Include support for this message in mon\_client and leverage it in ceph/super.

地址：[https://www.spinics.net/lists/ceph-devel/msg37937.html](https://www.spinics.net/lists/ceph-devel/msg37937.html)

这个说的是改善了statfs的显示，这个statfs就是在linux下面的mount的输出的显示的，说是改善了在单存储池下的显示效果，也就是在单存储池下能够显示存储池的容量空间，而不是全局的空间

这里就有个疑问了，单存储池？那么多存储池呢？我们测试下看看

这里这个补丁已经打到了centos7.5的默认内核里面去了，也就是内核版本

> Linux lab103 3.10.0-862.el7.x86\_64

对应的rpm包的版本是  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># rpm -qa|grep  3.10.0-862</span></span><br><span class="line">kernel-devel-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">862</span>.el7.x86_64</span><br><span class="line">kernel-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">862</span>.el7.x86_64</span><br></pre></td></tr></tbody></table>

下载的地址为：  

<table><tbody><tr><td class="code"><pre><span class="line">http://mirrors.<span class="number">163</span>.com/centos/<span class="number">7.5</span>.<span class="number">1804</span>/os/x86_64/Packages/kernel-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">862</span>.el7.x86_64.rpm</span><br></pre></td></tr></tbody></table>

或者直接安装centos7.5也行，这里只要求是这个内核就可以了

我们看下默认情况下是怎样的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph -s</span></span><br><span class="line">  data:</span><br><span class="line">    pools:   <span class="number">3</span> pools, <span class="number">72</span> pgs</span><br><span class="line">    objects: <span class="number">22</span> objects, <span class="number">36179</span> bytes</span><br><span class="line">    usage:   <span class="number">5209</span> MB used, <span class="number">11645</span> GB / <span class="number">11650</span> GB avail</span><br><span class="line">    pgs:     <span class="number">72</span> active+clean</span><br><span class="line"> </span><br><span class="line">[root@lab102 ~]<span class="comment"># ceph fs ls</span></span><br><span class="line">name: ceph, metadata pool: metadata, data pools: [data ]</span><br><span class="line">[root@lab102 ~]<span class="comment"># ceph df</span></span><br><span class="line">GLOBAL:</span><br><span class="line">    SIZE       AVAIL      RAW USED     %RAW USED </span><br><span class="line">    <span class="number">11650</span>G     <span class="number">11645</span>G        <span class="number">5209</span>M          <span class="number">0.04</span> </span><br><span class="line">POOLS:</span><br><span class="line">    NAME         ID     USED      %USED     MAX AVAIL     OBJECTS </span><br><span class="line">    data         <span class="number">9</span>          <span class="number">0</span>         <span class="number">0</span>         <span class="number">3671</span>G           <span class="number">0</span> </span><br><span class="line">    metadata     <span class="number">10</span>     <span class="number">36179</span>         <span class="number">0</span>        <span class="number">11014</span>G          <span class="number">22</span> </span><br><span class="line">    newdata      <span class="number">11</span>         <span class="number">0</span>         <span class="number">0</span>         <span class="number">5507</span>G           <span class="number">0</span> </span><br><span class="line">[root@lab102 ~]<span class="comment"># ceph osd dump|grep pool</span></span><br><span class="line">pool <span class="number">9</span> <span class="string">'data'</span> replicated size <span class="number">3</span> min_size <span class="number">1</span> crush_rule <span class="number">0</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">32</span> pgp_num <span class="number">32</span> last_change <span class="number">136</span> flags hashpspool stripe_width <span class="number">0</span> application cephfs</span><br><span class="line">pool <span class="number">10</span> <span class="string">'metadata'</span> replicated size <span class="number">1</span> min_size <span class="number">1</span> crush_rule <span class="number">0</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">32</span> pgp_num <span class="number">32</span> last_change <span class="number">112</span> flags hashpspool stripe_width <span class="number">0</span> application cephfs</span><br><span class="line">pool <span class="number">11</span> <span class="string">'newdata'</span> replicated size <span class="number">2</span> min_size <span class="number">1</span> crush_rule <span class="number">0</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">8</span> pgp_num <span class="number">8</span> last_change <span class="number">134</span> flags hashpspool  stripe_width <span class="number">0</span> application cephfs</span><br></pre></td></tr></tbody></table>

从上面可以看到我的硬盘裸空间为12T左右，data存储池副本3那么可用空间为4T左右，文件系统里面只有一个data存储池，看下挂载的情况  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># uname -a</span></span><br><span class="line">Linux lab101 <span class="number">3.10</span>.<span class="number">0</span>-<span class="number">862</span>.el7.x86_64 <span class="comment">#1 SMP Fri Apr 20 16:44:24 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux</span></span><br><span class="line">[root@lab101 ~]<span class="comment"># df -Th|grep mnt</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">19.102</span>:/        ceph      <span class="number">3.6</span>T     <span class="number">0</span>  <span class="number">3.6</span>T   <span class="number">0</span>% /mnt</span><br></pre></td></tr></tbody></table>

可以看到显示的容量就是存储池的可用容量为总空间的，现在我们加入一个数据池

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph mds add_data_pool newdata</span></span><br><span class="line">added data pool <span class="number">11</span> to fsmap</span><br></pre></td></tr></tbody></table>

再次查看df的显示  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab101 ~]<span class="comment"># df -Th|grep mnt</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">19.102</span>:/        ceph       <span class="number">12</span>T  <span class="number">5.1</span>G   <span class="number">12</span>T   <span class="number">1</span>% /mnt</span><br></pre></td></tr></tbody></table>

容量回到了原始的显示的方式，这个跟上面的补丁的预期是一样的，我们看下代码这里怎么控制的

## 获取当前内核版本的代码

首先要找到当前的内核的src.rpm包，这样可以拿到当前内核版本的源码  

<table><tbody><tr><td class="code"><pre><span class="line">wget http://vault.centos.org/<span class="number">7.5</span>.<span class="number">1804</span>/os/Source/SPackages/kernel-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">862</span>.el7.src.rpm</span><br></pre></td></tr></tbody></table>

解压源码包  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 origin]<span class="comment"># rpm2cpio kernel-3.10.0-862.el7.src.rpm |cpio -div</span></span><br><span class="line">[root@lab103 origin]<span class="comment"># tar -xvf linux-3.10.0-862.el7.tar.xz</span></span><br><span class="line">[root@lab103 origin]<span class="comment"># cd linux-3.10.0-862.el7/fs/ceph/</span></span><br></pre></td></tr></tbody></table>

上面的操作后我们已经进入了我们想要看的源码目录了  
我们看下super.c这个文件，这个df的显示的控制是在这个文件里面的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># cat super.c |less</span></span><br></pre></td></tr></tbody></table>

看下这段代码  

<table><tbody><tr><td class="code"><pre><span class="line">static int ceph_statfs(struct dentry *dentry, struct kstatfs *buf)</span><br><span class="line">{</span><br><span class="line">        struct ceph_fs_client *fsc = ceph_inode_to_client(dentry-&gt;d_inode);</span><br><span class="line">        struct ceph_monmap *monmap = fsc-&gt;client-&gt;monc.monmap;</span><br><span class="line">        struct ceph_statfs st;</span><br><span class="line">        u64 fsid;</span><br><span class="line">        int err;</span><br><span class="line">        u64 data_pool;</span><br><span class="line"></span><br><span class="line">        <span class="keyword">if</span> (fsc-&gt;mdsc-&gt;mdsmap-&gt;m_num_data_pg_pools == <span class="number">1</span>) {</span><br><span class="line">                data_pool = fsc-&gt;mdsc-&gt;mdsmap-&gt;m_data_pg_pools[<span class="number">0</span>];</span><br><span class="line">        } <span class="keyword">else</span> {</span><br><span class="line">                data_pool = CEPH_NOPOOL;</span><br><span class="line">        }</span><br><span class="line"></span><br><span class="line">        dout(<span class="string">"statfsn"</span>);</span><br><span class="line">        err = ceph_monc_<span class="keyword">do</span>_statfs(&amp;fsc-&gt;client-&gt;monc, data_pool, &amp;st);</span><br><span class="line">        <span class="keyword">if</span> (err &lt; <span class="number">0</span>)</span><br><span class="line">                <span class="built_in">return</span> err;</span><br></pre></td></tr></tbody></table>

其中的fsc->mdsc->mdsmap->m\_num\_data\_pg\_pools == 1和data\_pool = fsc->mdsc->mdsmap->m\_data\_pg\_pools\[0\];这个地方的意思是如果fs里面包含的存储池的存储池个数为1那么data\_pool就取这个存储池的信息，所以上面的我们的实践过程中的就是单个存储池的时候显示存储池的容量，超过一个的时候就显示的全局的容量，这个是跟代码对应的上的

我们基于上面的已经做好的功能改变一下需求

> 需要可以根据自己的需要指定存储池的容量来显示，通过挂载内核客户端的时候传递一个参数进去来进行显示

## 代码改动

\[root@lab103 ceph\]# vim super.h  
在super.h内定义一个默认值  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#define ZP_POOL_DEFAULT      0  /* pool id */</span></span><br><span class="line"><span class="comment">#define CEPH_CAPS_WANTED_DELAY_MAX_DEFAULT     60  /* cap release delay */</span></span><br><span class="line">struct ceph_mount_options {</span><br><span class="line">        int flags;</span><br><span class="line">        int sb_flags;</span><br><span class="line"></span><br><span class="line">        int wsize;            /* max write size */</span><br><span class="line">        int rsize;            /* max <span class="built_in">read</span> size */</span><br><span class="line">        int zp_pool;            /* pool id */</span><br><span class="line">        int rasize;           /* max readahead */</span><br></pre></td></tr></tbody></table>

这里增加了两个一个zp\_pool和ZP\_POOL\_DEFAULT  
这个文件的改动就只有这么多了

改动super.c的代码  
在enum里面加上Opt\_zp\_pool  

<table><tbody><tr><td class="code"><pre><span class="line">enum {</span><br><span class="line">        Opt_wsize,</span><br><span class="line">        Opt_rsize,</span><br><span class="line">        Opt_rasize,</span><br><span class="line">        Opt_caps_wanted_delay_min,</span><br><span class="line">        Opt_zp_pool,</span><br></pre></td></tr></tbody></table>

在match\_table\_t fsopt\_tokens里面添加Opt\_zp\_pool相关的判断，我们自己注意传的是pool在fs里面的id即可  

<table><tbody><tr><td class="code"><pre><span class="line">static match_table_t fsopt_tokens = {</span><br><span class="line">        {Opt_wsize, <span class="string">"wsize=%d"</span>},</span><br><span class="line">        {Opt_rsize, <span class="string">"rsize=%d"</span>},</span><br><span class="line">        {Opt_rasize, <span class="string">"rasize=%d"</span>},</span><br><span class="line">        {Opt_caps_wanted_delay_min, <span class="string">"caps_wanted_delay_min=%d"</span>},</span><br><span class="line">        {Opt_zp_pool, <span class="string">"zp_pool=%d"</span>},</span><br></pre></td></tr></tbody></table>

在static int parse\_fsopt\_token中添加  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="keyword">case</span> Opt_caps_wanted_delay_max:</span><br><span class="line">                <span class="keyword">if</span> (intval &lt; <span class="number">1</span>)</span><br><span class="line">                        <span class="built_in">return</span> -EINVAL;</span><br><span class="line">                fsopt-&gt;caps_wanted_delay_max = intval;</span><br><span class="line">                <span class="built_in">break</span>;</span><br><span class="line">        <span class="keyword">case</span> Opt_zp_pool:</span><br><span class="line">                <span class="keyword">if</span> (intval &lt; <span class="number">0</span>)</span><br><span class="line">                        <span class="built_in">return</span> -EINVAL;</span><br><span class="line">                fsopt-&gt;zp_pool = intval;</span><br><span class="line">                <span class="built_in">break</span>;</span><br><span class="line">        <span class="keyword">case</span> Opt_readdir_max_entries:</span><br><span class="line">                <span class="keyword">if</span> (intval &lt; <span class="number">1</span>)</span><br><span class="line">                        <span class="built_in">return</span> -EINVAL;</span><br><span class="line">                fsopt-&gt;max_readdir = intval;</span><br><span class="line">                <span class="built_in">break</span>;</span><br></pre></td></tr></tbody></table>

判断如果小于0就抛错，这个id从0开始上升的，所以也不允许小于0

在static int parse\_mount\_options中添加  

<table><tbody><tr><td class="code"><pre><span class="line">fsopt-&gt;caps_wanted_delay_min = CEPH_CAPS_WANTED_DELAY_MIN_DEFAULT;</span><br><span class="line">fsopt-&gt;zp_pool = ZP_POOL_DEFAULT;</span><br><span class="line">fsopt-&gt;caps_wanted_delay_max = CEPH_CAPS_WANTED_DELAY_MAX_DEFAULT;</span><br></pre></td></tr></tbody></table>

在static int ceph\_show\_options中添加  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="keyword">if</span> (fsopt-&gt;caps_wanted_delay_min != CEPH_CAPS_WANTED_DELAY_MIN_DEFAULT)</span><br><span class="line">        seq_<span class="built_in">printf</span>(m, <span class="string">",caps_wanted_delay_min=%d"</span>,</span><br><span class="line">                 fsopt-&gt;caps_wanted_delay_min);</span><br><span class="line"><span class="keyword">if</span> (fsopt-&gt;zp_pool)</span><br><span class="line">        seq_<span class="built_in">printf</span>(m, <span class="string">",zp_pool=%d"</span>,</span><br><span class="line">                 fsopt-&gt;zp_pool);</span><br><span class="line"><span class="keyword">if</span> (fsopt-&gt;caps_wanted_delay_max != CEPH_CAPS_WANTED_DELAY_MAX_DEFAULT)</span><br><span class="line">        seq_<span class="built_in">printf</span>(m, <span class="string">",caps_wanted_delay_max=%d"</span>,</span><br><span class="line">                   fsopt-&gt;caps_wanted_delay_max);</span><br></pre></td></tr></tbody></table>

这个是用来在执行mount命令的时候显示选项的数值的  
改动到这里我们检查下我们对super.c做过的的改动  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># cat super.c |grep zp_pool</span></span><br><span class="line">	Opt_zp_pool,</span><br><span class="line">	{Opt_zp_pool, <span class="string">"zp_pool=%d"</span>},</span><br><span class="line">    <span class="keyword">case</span> Opt_zp_pool:</span><br><span class="line">        fsopt-&gt;zp_pool = intval;</span><br><span class="line">	fsopt-&gt;zp_pool = ZP_POOL_DEFAULT;</span><br><span class="line">        <span class="keyword">if</span> (fsopt-&gt;zp_pool)</span><br><span class="line">                seq_<span class="built_in">printf</span>(m, <span class="string">",zp_pool=%d"</span>,</span><br><span class="line">                         fsopt-&gt;zp_pool);</span><br></pre></td></tr></tbody></table>

做了以上的改动后我们就可以把参数给传进来了，现在我们需要把参数传递到需要用的地方  
也就是static int ceph\_statfs内需要调用这个参数

在static int ceph\_statfs中添加上struct ceph\_mount\_options \*fsopt = fsc->mount\_options;  

<table><tbody><tr><td class="code"><pre><span class="line">static int ceph_statfs(struct dentry *dentry, struct kstatfs *buf)</span><br><span class="line">{</span><br><span class="line">        struct ceph_fs_client *fsc = ceph_inode_to_client(dentry-&gt;d_inode);</span><br><span class="line">        struct ceph_monmap *monmap = fsc-&gt;client-&gt;monc.monmap;</span><br><span class="line">        struct ceph_statfs st;</span><br><span class="line">        struct ceph_mount_options *fsopt = fsc-&gt;mount_options;</span><br><span class="line">        u64 fsid;</span><br></pre></td></tr></tbody></table>

然后改掉这个fsc->mdsc->mdsmap->m\_num\_data\_pg\_pools == 1的判断，我们判断大于0即可  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="keyword">if</span> (fsc-&gt;mdsc-&gt;mdsmap-&gt;m_num_data_pg_pools &gt; <span class="number">0</span>) {</span><br><span class="line">        data_pool = fsc-&gt;mdsc-&gt;mdsmap-&gt;m_data_pg_pools[fsopt-&gt;zp_pool];</span><br><span class="line">} <span class="keyword">else</span> {</span><br><span class="line">        data_pool = CEPH_NOPOOL;</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

并且把写死的0改成我们的变量fsopt->zp\_pool

到这里改动就完成了，这里还没有完，我们需要编译成我们的需要的模块  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># modinfo ceph</span></span><br><span class="line">filename:       /lib/modules/<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">862</span>.el7.x86_64/kernel/fs/ceph/ceph.ko.xz</span><br></pre></td></tr></tbody></table>

可以看到内核在高版本的时候已经改成了xz压缩的模块了,这里等会需要多处理一步  
我们只需要这一个模块就编译这一个ceph.ko模块就好  
编译需要装好kernel-devel包kernel-devel-3.10.0-862.el7.x86\_64

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># pwd</span></span><br><span class="line">/home/origin/linux-<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">862</span>.el7/fs/ceph</span><br><span class="line">[root@lab103 ceph]<span class="comment"># make CONFIG_CEPH_FS=m -C /lib/modules/3.10.0-862.el7.x86_64/build/ M=`pwd` modules</span></span><br><span class="line">make: Entering directory `/usr/src/kernels/<span class="number">3.10</span>.<span class="number">0</span>-<span class="number">862</span>.el7.x86_64<span class="string">'</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/super.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/inode.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/dir.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/file.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/locks.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/addr.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/ioctl.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/export.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/caps.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/snap.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/xattr.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/mds_client.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/mdsmap.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/strings.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/ceph_frag.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/debugfs.o</span><br><span class="line">  CC [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/acl.o</span><br><span class="line">  LD [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/ceph.o</span><br><span class="line">  Building modules, stage 2.</span><br><span class="line">  MODPOST 1 modules</span><br><span class="line">  CC      /home/origin/linux-3.10.0-862.el7/fs/ceph/ceph.mod.o</span><br><span class="line">  LD [M]  /home/origin/linux-3.10.0-862.el7/fs/ceph/ceph.ko</span><br><span class="line">make: Leaving directory `/usr/src/kernels/3.10.0-862.el7.x86_64'</span></span><br></pre></td></tr></tbody></table>

正常应该就是上面的没有报错的输出了  
压缩ko模块  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># find * -name '*.ko' | xargs -n 1 xz</span></span><br><span class="line">[root@lab103 ceph]<span class="comment"># rmmod ceph</span></span><br><span class="line">[root@lab103 ceph]<span class="comment"># rm -rf  /lib/modules/3.10.0-862.el7.x86_64/kernel/fs/ceph/ceph.ko.xz</span></span><br><span class="line">[root@lab103 ceph]<span class="comment"># cp -ra ceph.ko.xz /lib/modules/3.10.0-862.el7.x86_64/kernel/fs/ceph/</span></span><br><span class="line">[root@lab103 ceph]<span class="comment"># lsmod |grep ceph</span></span><br><span class="line">ceph                  <span class="number">345111</span>  <span class="number">0</span> </span><br><span class="line">libceph               <span class="number">301687</span>  <span class="number">1</span> ceph</span><br><span class="line">dns_resolver           <span class="number">13140</span>  <span class="number">1</span> libceph</span><br><span class="line">libcrc32c              <span class="number">12644</span>  <span class="number">2</span> xfs,libceph</span><br></pre></td></tr></tbody></table>

现在已经加载好模块了，我们试验下  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># ceph df</span></span><br><span class="line">GLOBAL:</span><br><span class="line">    SIZE       AVAIL      RAW USED     %RAW USED </span><br><span class="line">    <span class="number">11650</span>G     <span class="number">11645</span>G        <span class="number">5210</span>M          <span class="number">0.04</span> </span><br><span class="line">POOLS:</span><br><span class="line">    NAME         ID     USED      %USED     MAX AVAIL     OBJECTS </span><br><span class="line">    data         <span class="number">9</span>          <span class="number">0</span>         <span class="number">0</span>         <span class="number">3671</span>G           <span class="number">0</span> </span><br><span class="line">    metadata     <span class="number">10</span>     <span class="number">36391</span>         <span class="number">0</span>        <span class="number">11014</span>G          <span class="number">22</span> </span><br><span class="line">    newdata      <span class="number">11</span>         <span class="number">0</span>         <span class="number">0</span>         <span class="number">5507</span>G           <span class="number">0</span> </span><br><span class="line"></span><br><span class="line">[root@lab103 ceph]<span class="comment"># mount -t ceph 192.168.19.102:/ /mnt</span></span><br><span class="line">[root@lab103 ceph]<span class="comment"># df -h|grep mnt</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">19.102</span>:/         <span class="number">3.6</span>T     <span class="number">0</span>  <span class="number">3.6</span>T   <span class="number">0</span>% /mnt</span><br><span class="line">[root@lab103 ceph]<span class="comment"># ceph fs ls</span></span><br><span class="line">name: ceph, metadata pool: metadata, data pools: [data newdata ]</span><br></pre></td></tr></tbody></table>

我们给了一个默认存储池的值为0的编号的，现在显示的是data的容量，没有问题，我们想显示newdata存储池的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># mount -t ceph 192.168.19.102:/ /mnt -o zp_pool=1</span></span><br><span class="line">[root@lab103 ceph]<span class="comment"># df -h|grep mnt</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">19.102</span>:/         <span class="number">5.4</span>T     <span class="number">0</span>  <span class="number">5.4</span>T   <span class="number">0</span>% /mnt</span><br></pre></td></tr></tbody></table>

这里我们显示的要么0，要么1的存储池的那么我如果想显示全局的怎么处理？那就是给个不存在的编号就行了  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab103 ceph]<span class="comment"># mount -t ceph 192.168.19.102:/ /mnt -o zp_pool=1000</span></span><br><span class="line">[root@lab103 ceph]<span class="comment"># mount|grep ceph|grep zp_pool</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">19.102</span>:/ on /mnt <span class="built_in">type</span> ceph (rw,relatime,acl,wsize=<span class="number">16777216</span>,zp_pool=<span class="number">1000</span>)</span><br><span class="line">[root@lab103 ceph]<span class="comment"># df -h|grep mnt</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">19.102</span>:/          <span class="number">12</span>T  <span class="number">5.1</span>G   <span class="number">12</span>T   <span class="number">1</span>% /mnt</span><br></pre></td></tr></tbody></table>

也可以自己去改成读取all字段的时候取全局变量，这个是直接用一个不存在的编号去走到全局的容量的逻辑里面去了,这样比较简单

通过mount命令可以查询到挂载的选项

到这里就根据需求改完了

## 总结

本篇里面涉及的知识点包括了rpm包的源码的获取，解压，以及内核模块的单独编译，改动单个模块进行替换，cephfs客户端的内核参数的自定义传递等等，在本博客的第三篇文章就有一个单独编译一个ext4模块的

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-08-20 |

Source: zphj1987@gmail ([cephfs根据存储池显示df容量](http://www.zphj1987.com/2018/08/19/show-useage-for-cephfs-pool/))
