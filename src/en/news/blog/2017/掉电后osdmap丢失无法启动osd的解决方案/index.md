---
title: "掉电后osdmap丢失无法启动osd的解决方案"
date: "2017-09-27"
author: "admin"
tags: 
  - "planet"
---

  
![](images/recuva.png)  

## 前言

本篇讲述的是一个比较极端的故障的恢复场景，在整个集群全部服务器突然掉电的时候，osd里面的osdmap可能会出现没刷到磁盘上的情况，这个时候osdmap的最新版本为空或者为没有这个文件

还有一种情况就是机器宕机了，没有马上处理，等了一段时间以后，服务器机器启动了起来，而这个时候osdmap已经更新了，全局找不到需要的旧版本的osdmap和incmap，osd无法启动

一般情况下能找到的就直接从其他osd上面拷贝过来，然后就可以启动了，本篇讲述的是无法启动的情况  

## 解决方案

### 获取运行的ceph集群当前版本

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ~]<span class="comment"># ceph -v</span></span><br><span class="line">ceph version <span class="number">10.2</span>.<span class="number">9</span> (<span class="number">2</span>ee413f77150c0f375ff6f10edd6c8f9c7d060d0)</span><br></pre></td></tr></tbody></table>

获取最新的osdmap  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 ~]<span class="comment"># ceph osd getmap -o /tmp/productosdmap</span></span><br><span class="line">got osdmap epoch <span class="number">142</span></span><br></pre></td></tr></tbody></table>

通过osdmap可以得到crushmap，fsid，osd，存储池，pg等信息

提取crushmap  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 tmp]<span class="comment"># osdmaptool /tmp/productosdmap --export-crush /tmp/productcrushmap</span></span><br><span class="line">osdmaptool: osdmap file <span class="string">'/tmp/productosdmap'</span></span><br><span class="line">osdmaptool: exported crush map to /tmp/productcrushmap</span><br></pre></td></tr></tbody></table>

拷贝到开发环境的机器上面

通过osdmap获取集群的fsid  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 tmp]<span class="comment"># osdmaptool --print productosdmap |grep fsid</span></span><br><span class="line">osdmaptool: osdmap file <span class="string">'productosdmap'</span></span><br><span class="line">fsid d153844c-<span class="number">16</span>f5-<span class="number">4</span>f48-<span class="number">829</span>d-<span class="number">87</span>fb49120bbe</span><br></pre></td></tr></tbody></table>

获取存储池相关的信息  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 tmp]<span class="comment"># osdmaptool --print productosdmap |grep  pool</span></span><br><span class="line">osdmaptool: osdmap file <span class="string">'productosdmap'</span></span><br><span class="line">pool <span class="number">0</span> <span class="string">'rbd'</span> replicated size <span class="number">2</span> min_size <span class="number">1</span> crush_ruleset <span class="number">0</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">64</span> pgp_num <span class="number">64</span> last_change <span class="number">1</span> flags hashpspool stripe_width <span class="number">0</span></span><br></pre></td></tr></tbody></table>

获取osd相关的信息  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 tmp]<span class="comment"># osdmaptool --print productosdmap |grep  osd</span></span><br><span class="line">osdmaptool: osdmap file <span class="string">'productosdmap'</span></span><br><span class="line">flags sortbitwise,require_jewel_osds</span><br><span class="line">max_osd <span class="number">3</span></span><br><span class="line">osd.<span class="number">0</span> up   <span class="keyword">in</span>  weight <span class="number">1</span> up_from <span class="number">135</span> up_thru <span class="number">141</span> down_at <span class="number">127</span> last_clean_interval [<span class="number">23</span>,<span class="number">24</span>) <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6800</span>/<span class="number">28245</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6801</span>/<span class="number">28245</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6802</span>/<span class="number">28245</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6803</span>/<span class="number">28245</span> exists,up d8040272-<span class="number">7</span>afb-<span class="number">49</span>c0-bb78-<span class="number">9</span>ff13cf7d31b</span><br><span class="line">osd.<span class="number">1</span> up   <span class="keyword">in</span>  weight <span class="number">1</span> up_from <span class="number">140</span> up_thru <span class="number">141</span> down_at <span class="number">131</span> last_clean_interval [<span class="number">33</span>,<span class="number">130</span>) <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6808</span>/<span class="number">28698</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6809</span>/<span class="number">28698</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6810</span>/<span class="number">28698</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6811</span>/<span class="number">28698</span> exists,up c6ac4c7a-<span class="number">0227</span>-<span class="number">4</span>af4-ac3f-bd844b2480f8</span><br><span class="line">osd.<span class="number">2</span> up   <span class="keyword">in</span>  weight <span class="number">1</span> up_from <span class="number">137</span> up_thru <span class="number">141</span> down_at <span class="number">133</span> last_clean_interval [<span class="number">29</span>,<span class="number">132</span>) <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6804</span>/<span class="number">28549</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6805</span>/<span class="number">28549</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6806</span>/<span class="number">28549</span> <span class="number">192.168</span>.<span class="number">8.107</span>:<span class="number">6807</span>/<span class="number">28549</span> exists,up <span class="number">2170260</span>b-bb05-<span class="number">4965</span>-baf2-<span class="number">12</span>d1c41b3ba0</span><br></pre></td></tr></tbody></table>

### 构建新集群

下载这个版本的源码  

<table><tbody><tr><td class="code"><pre><span class="line">http://mirrors.aliyun.com/ceph/rpm-jewel/el7/SRPMS/ceph-<span class="number">10.2</span>.<span class="number">9</span>-<span class="number">0</span>.el7.src.rpm</span><br></pre></td></tr></tbody></table>

放到一台独立的机器上面

解压rpm包  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 bianyi]<span class="comment"># rpm2cpio ceph-10.2.9-0.el7.src.rpm |cpio -div</span></span><br><span class="line">[root@lab8106 bianyi]<span class="comment"># tar -xvf ceph-10.2.9.tar.bz2</span></span><br></pre></td></tr></tbody></table>

编译环境  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">cd</span> ceph</span><br><span class="line">./install-deps.sh</span><br><span class="line">./autogen.sh</span><br><span class="line">./configure</span><br><span class="line">make -j <span class="number">12</span></span><br><span class="line"><span class="built_in">cd</span> src</span><br></pre></td></tr></tbody></table>

修改vstart.sh里面的fsid  
启动集群  

<table><tbody><tr><td class="code"><pre><span class="line">./vstart.sh -n  --mon_num <span class="number">1</span> --osd_num <span class="number">3</span> --mds_num <span class="number">0</span>  --short  <span class="operator">-d</span></span><br></pre></td></tr></tbody></table>

检查集群状态：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment"># ./ceph -c ceph.conf -s</span></span><br><span class="line">    cluster d153844c-<span class="number">16</span>f5-<span class="number">4</span>f48-<span class="number">829</span>d-<span class="number">87</span>fb49120bbe</span><br><span class="line">     health HEALTH_OK</span><br><span class="line">     monmap e1: <span class="number">1</span> mons at {a=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">3</span>, quorum <span class="number">0</span> a</span><br><span class="line">     osdmap e12: <span class="number">3</span> osds: <span class="number">3</span> up, <span class="number">3</span> <span class="keyword">in</span></span><br><span class="line">            flags sortbitwise,require_jewel_osds</span><br><span class="line">      pgmap v16: <span class="number">8</span> pgs, <span class="number">1</span> pools, <span class="number">0</span> bytes data, <span class="number">0</span> objects</span><br><span class="line">            <span class="number">115</span> GB used, <span class="number">1082</span> GB / <span class="number">1197</span> GB avail</span><br><span class="line">                   <span class="number">8</span> active+clean</span><br></pre></td></tr></tbody></table>

导入crushmap  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment"># ./ceph -c ceph.conf osd setcrushmap -i /root/rpmbuild/bianyi/productcrushmap </span></span><br><span class="line"><span class="built_in">set</span> crush map</span><br><span class="line"><span class="number">2017</span>-<span class="number">09</span>-<span class="number">26</span> <span class="number">14</span>:<span class="number">13</span>:<span class="number">29.052246</span> <span class="number">7</span>f19fd01d700  <span class="number">0</span> lockdep stop</span><br></pre></td></tr></tbody></table>

设置PG  

<table><tbody><tr><td class="code"><pre><span class="line">./ceph -c ceph.conf osd pool <span class="built_in">set</span> rbd pg_num <span class="number">64</span></span><br><span class="line">./ceph -c ceph.conf osd pool <span class="built_in">set</span> rbd pgp_num <span class="number">64</span></span><br></pre></td></tr></tbody></table>

模拟正式集群上的故障  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 meta]<span class="comment"># systemctl stop ceph-osd@0</span></span><br><span class="line">[root@lab8107 meta]<span class="comment"># mv /var/lib/ceph/osd/ceph-0/current/meta/osdmap.153__0_AC977A95__none  /tmp/</span></span><br><span class="line">[root@lab8107 meta]<span class="comment"># mv /var/lib/ceph/osd/ceph-0/current/meta/incuosdmap.153__0_C67D77C2__none  /tmp/</span></span><br></pre></td></tr></tbody></table>

相当于无法读取这个osdmap和incmap了

尝试启动osd  
设置debug\_osd=20后  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl restart ceph-osd@<span class="number">0</span></span><br></pre></td></tr></tbody></table>

检查日志  

<table><tbody><tr><td class="code"><pre><span class="line">/var/<span class="built_in">log</span>/ceph/ceph-osd.<span class="number">0</span>.log</span><br></pre></td></tr></tbody></table>

![image.png-56.9kB](images/image.png)

可以看到153 epoch的osdmap是有问题的，那么我们需要的就是这个版本的osdmap

检查当前开发集群的osdmap的版本  

<table><tbody><tr><td class="code"><pre><span class="line">osdmap e18: <span class="number">3</span> osds: <span class="number">3</span> up, <span class="number">3</span> <span class="keyword">in</span></span><br></pre></td></tr></tbody></table>

那么先快速把osdmap版本提高到153附近，这里我选择120  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment"># ./ceph -c ceph.conf osd thrash 120</span></span><br><span class="line">will thrash map <span class="keyword">for</span> <span class="number">120</span> epochs</span><br></pre></td></tr></tbody></table>

检查快速变化后的osdmap epoch  

<table><tbody><tr><td class="code"><pre><span class="line">osdmap e138: <span class="number">3</span> osds: <span class="number">2</span> up, <span class="number">1</span> <span class="keyword">in</span>; <span class="number">64</span> remapped pgs</span><br></pre></td></tr></tbody></table>

做了上面的thrash后，集群的osd会是比较乱的，比如我的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment"># ./ceph -c ceph.conf osd tree</span></span><br><span class="line">ID WEIGHT  TYPE NAME        UP/DOWN REWEIGHT PRIMARY-AFFINITY </span><br><span class="line">-<span class="number">1</span> <span class="number">0.80338</span> root default                                       </span><br><span class="line">-<span class="number">2</span> <span class="number">0.80338</span>     host lab8107                                   </span><br><span class="line"> <span class="number">0</span> <span class="number">0.26779</span>         osd.<span class="number">0</span>         up        <span class="number">0</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">1</span> <span class="number">0.26779</span>         osd.<span class="number">1</span>       down        <span class="number">0</span>          <span class="number">1.00000</span> </span><br><span class="line"> <span class="number">2</span> <span class="number">0.26779</span>         osd.<span class="number">2</span>         up  <span class="number">1.00000</span>          <span class="number">1.00000</span> </span><br><span class="line"><span class="number">2017</span>-<span class="number">09</span>-<span class="number">27</span> <span class="number">09</span>:<span class="number">43</span>:<span class="number">24.817177</span> <span class="number">7</span>fbcc7cdb700  <span class="number">0</span> lockdep stop</span><br></pre></td></tr></tbody></table>

做下恢复，启动下相关osd  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment"># ./ceph -c ceph.conf osd reweight 0 1</span></span><br><span class="line">reweighted osd.<span class="number">0</span> to <span class="number">1</span> (<span class="number">10000</span>)</span><br><span class="line"><span class="number">2017</span>-<span class="number">09</span>-<span class="number">27</span> <span class="number">09</span>:<span class="number">45</span>:<span class="number">01.439009</span> <span class="number">7</span>f56c147b700  <span class="number">0</span> lockdep stop</span><br><span class="line">[root@lab8106 src]<span class="comment"># ./ceph -c ceph.conf osd reweight 1 1</span></span><br><span class="line">reweighted osd.<span class="number">1</span> to <span class="number">1</span> (<span class="number">10000</span>)</span><br><span class="line"><span class="number">2017</span>-<span class="number">09</span>-<span class="number">27</span> <span class="number">09</span>:<span class="number">45</span>:<span class="number">04.020686</span> <span class="number">7</span>fea3345c700  <span class="number">0</span> lockdep stop</span><br></pre></td></tr></tbody></table>

注意提取下开发集群上面新生成的osdmap的文件（多次执行以免刷掉了）  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment">#rsync -qvzrtopg   dev/osd0/current/meta/ /root/meta/</span></span><br></pre></td></tr></tbody></table>

重启一遍开发集群  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment"># ./vstart.sh   --mon_num 1 --osd_num 3 --mds_num 0  --short  -d</span></span><br></pre></td></tr></tbody></table>

注意这里少了一个参数 -n,n是重建集群，这里我们只需要重启即可  
再次检查  

<table><tbody><tr><td class="code"><pre><span class="line">osdmap e145: <span class="number">3</span> osds: <span class="number">3</span> up, <span class="number">3</span> <span class="keyword">in</span></span><br></pre></td></tr></tbody></table>

还是不够，不够的时候就执行上面的这个多次即可，一直到epoch到满足即可

将得到的osdmap拷贝到无法启动的osd的主机上面  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 src]<span class="comment"># scp /root/meta/osdmap.153__0_AC977A95__none 192.168.8.107:/root</span></span><br><span class="line">osdmap.<span class="number">153</span>__0_AC977A95__none                            <span class="number">100</span>% <span class="number">2824</span>     <span class="number">2.8</span>KB/s   <span class="number">00</span>:<span class="number">00</span>    </span><br><span class="line">[root@lab8106 src]<span class="comment"># scp /root/meta/incuosdmap.153__0_C67D77C2__none 192.168.8.107:/root</span></span><br><span class="line">incuosdmap.<span class="number">153</span>__0_C67D77C2__none                       <span class="number">100</span>%  <span class="number">198</span>     <span class="number">0.2</span>KB/s   <span class="number">00</span>:<span class="number">00</span></span><br></pre></td></tr></tbody></table>

拷贝到osdmap的路径下面  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 meta]<span class="comment"># cp /root/osdmap.153__0_AC977A95__none ./</span></span><br><span class="line">[root@lab8107 meta]<span class="comment"># cp /root/incuosdmap.153__0_C67D77C2__none ./</span></span><br><span class="line">[root@lab8107 meta]<span class="comment"># chown ceph:ceph osdmap.153__0_AC977A95__none </span></span><br><span class="line">[root@lab8107 meta]<span class="comment"># chown ceph:ceph incuosdmap.153__0_C67D77C2__none</span></span><br></pre></td></tr></tbody></table>

启动并且观测  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8107 meta]<span class="comment"># systemctl start ceph-osd@0</span></span><br><span class="line">[root@lab8107 meta]<span class="comment">#tailf /var/log/ceph/ceph-osd.0.log</span></span><br></pre></td></tr></tbody></table>

检查集群状态，可以看到已经可以启动了

## 总结

一般来说，出问题的时候都会说一句，如果备份了，就没那多事情，在一套生产环境当中，可以考虑下，什么是可以备份的，备份对环境的影响大不大，这种关键数据，并且可以全局共用，数据量也不大的数据，就需要备份好，比如上面的osdmap就可以在一个osd节点上面做一个实时的备份，或者短延时备份

本篇讲的是已经没有备份的情况下的做的一个恢复，掉电不是没有可能发生，至少解决了一个在osdmap无法找回的情况下的恢复办法

当然这里如果能够通过直接基于最新的osdmap和incmap做一定的解码，修改，编码，这样的方式应该也是可行的，这个就需要有一定的开发基础了，如果后面有找到这个方法会补充进本篇文章

你备份可osdmap了么？

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-09-27 |

Source: zphj1987@gmail ([掉电后osdmap丢失无法启动osd的解决方案](http://www.zphj1987.com/2017/09/27/lost-osdmap-recovery/))
