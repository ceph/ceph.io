---
title: "Ceph对象主本损坏的修复方法"
date: "2018-01-02"
author: "admin"
tags: 
  - "planet"
---

  
![dog](images/dog.jpg)  

## 前言

问题的触发是在进行一个目录的查询的时候，osd就会挂掉，开始以为是osd操作超时了，后来发现每次访问这个对象都有问题  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="built_in">log</span> [WRN] ： slow request <span class="number">60.793196</span> seconds old, received at osd_op(mds.<span class="number">0.188</span>:<span class="number">728345234100006</span>c6ddc.<span class="number">00000000</span> [o map-get-header <span class="number">0</span>-<span class="number">0</span>,omap-get-vals <span class="number">0</span>~<span class="number">16</span>,getxattr parent] snapc <span class="number">0</span>=[] ack+<span class="built_in">read</span>+known_<span class="keyword">if</span>_redirected+full_force e218901) currently started</span><br><span class="line">heartbeat_map is_healthy  ··· osd_op_tp thread ··· had timed out after <span class="number">60</span></span><br></pre></td></tr></tbody></table>

这个对象是元数据的一个空对象，保留数据在扩展属性当中  
  
然后做了一个操作判断是对象损坏了:

直接列取omapkeys

<table><tbody><tr><td class="code"><pre><span class="line">rados -p metadata listomapvals <span class="number">100006</span>c6ddc.<span class="number">00000000</span></span><br></pre></td></tr></tbody></table>

发现会卡住，然后关闭这个osd再次做操作，就可以了，启动后还是不行，这里可以判断是主本的对象已经有问题了，本篇将讲述多种方法来解决这个问题

## 处理办法

本章将会根据操作粒度的不同来讲述三种方法的恢复，根据自己的实际情况，和风险的判断来选择自己的操作

### 方法一：通过repair修复

首先能确定是主本损坏了，那么先把主本的对象进行一个备份，然后移除  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># systemctl stop ceph-osd@0</span></span><br><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># cp -ra 100.00000000__head_C5265AB3__2 ../../</span></span><br></pre></td></tr></tbody></table>

通过ceph-object-tool进行移除的时候有bug,无法移除metadata的对象，已经提了一个[bug](http://tracker.ceph.com/issues/22553)  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># mv 100.00000000__head_C5265AB3__2 ../</span></span><br></pre></td></tr></tbody></table>

注意一下在老版本的时候，对对象进行删除以后，可能元数据里面记录了对象信息，而对象又不在的时候可能会引起osd无法启动，这个在10.2.10是没有这个问题

重启osd  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># systemctl restart ceph-osd@0</span></span><br></pre></td></tr></tbody></table>

对pg做scrub  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># ceph pg scrub 2.0</span></span><br><span class="line">instructing pg <span class="number">2.0</span> on osd.<span class="number">0</span> to scrub</span><br></pre></td></tr></tbody></table>

这种方法就是需要做scrub的操作，如果对象特别多，并且是线上环境，可能不太好去做scrub的操作  
检查状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># ceph -s</span></span><br><span class="line">    cluster <span class="number">03580</span>f14-<span class="number">9906</span>-<span class="number">4257</span>-<span class="number">9182</span>-<span class="number">65</span>c886e7f5a7</span><br><span class="line">     health HEALTH_ERR</span><br><span class="line">            <span class="number">1</span> pgs inconsistent</span><br><span class="line">            <span class="number">1</span> scrub errors</span><br><span class="line">            too few PGs per OSD (<span class="number">3</span> &lt; min <span class="number">30</span>)</span><br><span class="line">     monmap e1: <span class="number">1</span> mons at {lab71=<span class="number">20.20</span>.<span class="number">20.71</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">4</span>, quorum <span class="number">0</span> lab71</span><br><span class="line">      fsmap e30: <span class="number">1</span>/<span class="number">1</span>/<span class="number">1</span> up {<span class="number">0</span>=lab71=up:active}</span><br><span class="line">     osdmap e101: <span class="number">2</span> osds: <span class="number">2</span> up, <span class="number">2</span> <span class="keyword">in</span></span><br><span class="line">            flags sortbitwise,require_jewel_osds</span><br><span class="line">      pgmap v377: <span class="number">3</span> pgs, <span class="number">3</span> pools, <span class="number">100814</span> bytes data, <span class="number">41</span> objects</span><br><span class="line">            <span class="number">70196</span> kB used, <span class="number">189</span> GB / <span class="number">189</span> GB avail</span><br><span class="line">                   <span class="number">2</span> active+clean</span><br><span class="line">                   <span class="number">1</span> active+clean+inconsistent</span><br></pre></td></tr></tbody></table>

发起修复请求  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># ceph pg repair 2.0</span></span><br><span class="line">instructing pg <span class="number">2.0</span> on osd.<span class="number">0</span> to repair</span><br></pre></td></tr></tbody></table>

修复完成后检查集群状态和对象，到这里可以恢复正常了

### 方法二：通过rsync拷贝数据方式恢复

跟上面一样这里首先能确定是主本损坏了，那么先把主本的对象进行一个备份，然后移除  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># systemctl stop ceph-osd@0</span></span><br><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># cp -ra 100.00000000__head_C5265AB3__2 ../../</span></span><br></pre></td></tr></tbody></table>

移除对象  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># mv 100.00000000__head_C5265AB3__2 ../</span></span><br></pre></td></tr></tbody></table>

在副本的机器上执行rsync命令，这里我们直接从副本拷贝对象过来，注意下不能直接使用scp会掉扩展属性  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab72 <span class="number">2.0</span>_head]<span class="comment"># rsync  -avXH  /var/lib/ceph/osd/ceph-1/current/2.0_head/100.00000000__head_C5265AB3__2 20.20.20.71:/var/lib/ceph/osd/ceph-0/current/2.0_head/100.00000000__head_C5265AB3__2</span></span><br></pre></td></tr></tbody></table>

在主本机器检查扩展属性  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># getfattr 100.00000000__head_C5265AB3__2 </span></span><br><span class="line"><span class="comment"># file: 100.00000000__head_C5265AB3__2</span></span><br><span class="line">user.ceph._</span><br><span class="line">user.ceph._@<span class="number">1</span></span><br><span class="line">user.ceph.snapset</span><br><span class="line">user.cephos.spill_out</span><br></pre></td></tr></tbody></table>

重启osd  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># systemctl restart ceph-osd@0</span></span><br></pre></td></tr></tbody></table>

检查对象的扩展属性  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 <span class="number">2.0</span>_head]<span class="comment"># rados -p metadata listomapvals 100.00000000</span></span><br></pre></td></tr></tbody></table>

### 方法三：通过删除PG的方式恢复

这个方式是删除PG，然后重新启动的方式  
这种方式操作比较危险，所以提前备份好pg的数据，最好主备pg都备份下，万一出了问题或者数据不对，可以根据需要再导入  
备份PG  

<table><tbody><tr><td class="code"><pre><span class="line">ceph-objectstore-tool --pgid <span class="number">2.0</span> --op <span class="built_in">export</span> --data-path /var/lib/ceph/osd/ceph-<span class="number">0</span>/ --journal-path   /var/lib/ceph/osd/ceph-<span class="number">0</span>/journal --file /root/<span class="number">2.0</span></span><br></pre></td></tr></tbody></table>

删除PG的操作  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 current]<span class="comment"># ceph-objectstore-tool --pgid 2.0  --op remove --data-path /var/lib/ceph/osd/ceph-0/ --journal-path /var/lib/ceph/osd/ceph-0/journal</span></span><br><span class="line">SG_IO: bad/missing sense data, sb[]:  <span class="number">70</span> <span class="number">00</span> <span class="number">05</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">0</span>a <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">20</span> <span class="number">00</span> <span class="number">00</span> c0 <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span></span><br><span class="line">SG_IO: bad/missing sense data, sb[]:  <span class="number">70</span> <span class="number">00</span> <span class="number">05</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">0</span>a <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">20</span> <span class="number">00</span> <span class="number">00</span> c0 <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span> <span class="number">00</span></span><br><span class="line"> marking collection <span class="keyword">for</span> removal</span><br><span class="line">setting <span class="string">'_remove'</span> omap key</span><br><span class="line">finish_remove_pgs <span class="number">2.0</span>_head removing <span class="number">2.0</span></span><br><span class="line">Remove successful</span><br></pre></td></tr></tbody></table>

重启osd  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 current]<span class="comment"># systemctl restart ceph-osd@0</span></span><br></pre></td></tr></tbody></table>

等待回复即可

本方法里面还可以衍生一种就是，通过导出的副本的PG数据,在主本删除了相应的PG以后,进行导入的方法，这样就不会产生迁移  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab71 current]<span class="comment">#  ceph-objectstore-tool --pgid 2.0  --op import --data-path /var/lib/ceph/osd/ceph-0/ --journal-path /var/lib/ceph/osd/ceph-0/journal --file /root/2.0</span></span><br></pre></td></tr></tbody></table>

## 总结

上面用三种方法来实现了副本向主本同步的操作，判断主本是否有问题的方法就是主动的把主本所在的OSD停掉，然后检查请求是否可达，在确定主本已经坏掉的情况下，就可以做将副本同步到主本的操作，可以根据PG的对象的多少来选择需要做哪种操作

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-01-02 |

Source: zphj1987@gmail ([Ceph对象主本损坏的修复方法](http://www.zphj1987.com/2018/01/02/ceph-primary-object-damage-recover/))
