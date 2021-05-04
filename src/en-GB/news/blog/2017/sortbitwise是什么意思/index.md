---
title: "'sortbitwise'是什么意思"
date: "2017-01-12"
author: "admin"
tags: 
  - "planet"
---

  
![](images/techie.jpg)  

## 问题

flag sortbitwise 在ceph中是什么意思,在Jewel版本下可以看到多了这个flags

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 current]<span class="comment"># ceph -s</span></span><br><span class="line">    cluster ffe7a8db-c671-<span class="number">4</span>b45<span class="operator">-a</span>784-ddb41e633905</span><br><span class="line">     health HEALTH_OK</span><br><span class="line">     monmap e1: <span class="number">1</span> mons at {lab8106=<span class="number">192.168</span>.<span class="number">8.106</span>:<span class="number">6789</span>/<span class="number">0</span>}</span><br><span class="line">            election epoch <span class="number">4</span>, quorum <span class="number">0</span> lab8106</span><br><span class="line">      fsmap e4: <span class="number">1</span>/<span class="number">1</span>/<span class="number">1</span> up {<span class="number">0</span>=lab8106=up:active}</span><br><span class="line">     osdmap e132: <span class="number">8</span> osds: <span class="number">8</span> up, <span class="number">8</span> <span class="keyword">in</span></span><br><span class="line">            flags sortbitwise</span><br><span class="line">      pgmap v206294: <span class="number">201</span> pgs, <span class="number">5</span> pools, <span class="number">4684</span> MB data, <span class="number">1214</span> objects</span><br><span class="line">            <span class="number">9669</span> MB used, <span class="number">2216</span> GB / <span class="number">2226</span> GB avail</span><br><span class="line">                 <span class="number">201</span> active+clean</span><br></pre></td></tr></tbody></table>

## 找到的相关资料

> After upgrading, users should set the ‘sortbitwise’ flag to enable the new internal object sort order: ceph osd set sortbitwise  
> This flag is important for the new object enumeration API and for new backends like BlueStore.

From [Ceph release notes](http://docs.ceph.com/docs/master/release-notes/#upgrading-from-infernalis-or-hammer)

> commit 383185bfbae74797cdb44f50b4bf651422800ff1  
> Author: Sage Weil [sage@redhat.com](mailto:sage@redhat.com)  
> Date: Fri Aug 7 16:14:09 2015 -0400  
> mon/OSDMonitor: osd set/unset sortbitwise  
> Add monitor command to flip the switch on the OSD hobject\_t sort  
> order.

From git

第一次在源码中出现:

> commit 138f58493715e386929f152424b70df37843541b  
> Author: John Spray [john.spray@redhat.com](mailto:john.spray@redhat.com)  
> Date: Mon Aug 17 14:40:46 2015 -0400  
> osdc/Objecter: new-style pgls  
> Signed-off-by: John Spray [john.spray@redhat.com](mailto:john.spray@redhat.com)  
> Signed-off-by: Sage Weil [sage@redhat.com](mailto:sage@redhat.com)

From git

Related github issue: [https://github.com/ceph/ceph/pull/4919/commits](https://github.com/ceph/ceph/pull/4919/commits)

初步结论: sortbitwise 内部排序算法的一个变化.之所以暴露出来是因为要兼容一些pre-jewel版本.在新的版本中应该保持开启状态.

以上转载自博客：[What ‘sortbitwise’ flag means in Ceph?](https://medium.com/@george.shuklin/what-is-sortbitwise-flag-means-in-ceph-b4176748da42#.dfaw54rpf)

## 红帽的官方回答

- 如果你使用dev版本Infernalis或仍在开发中的LTS版本的Ceph的Jewel版本，你会看到这个标志在ceph状态输出默认启用
- 这个标志sortbitwise在Infernalis版本中引入
- 这个标志是在这个版本提交的upstream commit 968261b11ac30622c0606d1e2ddf422009e7d330

下载ceph的源码，进入源码目录  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 all]<span class="comment"># git show 968261b11ac30622c0606d1e2ddf422009e7d330</span></span><br><span class="line">commit <span class="number">968261</span>b11ac30622c0606d1e2ddf422009e7d330</span><br><span class="line">Author: Sage Weil &lt;sage@redhat.com&gt;</span><br><span class="line">Date:   Fri Aug <span class="number">7</span> <span class="number">16</span>:<span class="number">01</span>:<span class="number">12</span> <span class="number">2015</span> -<span class="number">0400</span></span><br><span class="line"></span><br><span class="line">    osd/OSDMap: add a SORTBITWISE OSDMap flag</span><br><span class="line"></span><br><span class="line">    This flag will indicate that hobject_t<span class="string">'s shall hence-forth be</span><br><span class="line">    sorted in a bitwise fashion.</span><br><span class="line"></span><br><span class="line">    Signed-off-by: Sage Weil &lt;sage@redhat.com&gt;</span></span><br></pre></td></tr></tbody></table>

正如我们在上面给定的提交的描述中所说，该标志将表明hobject\_t的将以 bitwise fashion方式排序。  
现在意味着现在的对象将在OSDs中以按位方式排序，并且此标志默认在Infernalis和Jewel发布版本中启用。

## 总结

目前来看这个是底层的一个排序的算法的变动，对上层目前还不清楚是有什么可以可见的变化，总之，这个让它默认开启就行，不要去修改它就可以了

## 我的公众号-磨磨谈

  
![](images/qrcode_for_gh_6998a54d68f7_430.jpg)  

Source: zphj1987@gmail (['sortbitwise'是什么意思](http://www.zphj1987.com/2017/01/12/sortbitwise-mean/))
