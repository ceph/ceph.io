---
title: "ceph erasure默认的min_size分析"
date: "2018-06-12"
author: "admin"
tags: 
  - "planet"
---

  
![desk.jpg-47.1kB](images/desk.jpg)  

## 引言

最近接触了两个集群都使用到了erasure code,一个集群是hammer版本的，一个环境是luminous版本的，两个环境都出现了incomplete，触发的原因有类似的地方，都是有osd的离线的问题

准备在本地环境进行复验的时候，发现了一个跟之前接触的erasure不同的地方，这里做个记录，以防后面出现同样的问题  

## 分析过程

准备了一个luminous的集群，使用默认的erasure的profile进行了创建存储池的相关工作  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph osd erasure-code-profile get default</span></span><br><span class="line">k=<span class="number">2</span></span><br><span class="line">m=<span class="number">1</span></span><br><span class="line">plugin=jerasure</span><br><span class="line">technique=reed_sol_van</span><br></pre></td></tr></tbody></table>

默认的是2+1的纠删码的配置，创建完了以后存储池的配置是这样的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph osd dump|grep pool</span></span><br><span class="line">pool <span class="number">1</span> <span class="string">'rbd'</span> erasure size <span class="number">3</span> min_size <span class="number">3</span> crush_rule <span class="number">2</span> object_<span class="built_in">hash</span> rjenkins pg_num <span class="number">256</span> pgp_num <span class="number">256</span> last_change <span class="number">41</span> flags hashpspool stripe_width <span class="number">8192</span> application rbdrc</span><br></pre></td></tr></tbody></table>

然后停止了一个osd以后，状态变成了这样的  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># ceph -s</span></span><br><span class="line">  cluster:</span><br><span class="line">    id:     <span class="number">9</span>ec7768a-<span class="number">5</span>e7c-<span class="number">4</span>f8e-<span class="number">8</span>a85-<span class="number">89895</span>e338cca</span><br><span class="line">    health: HEALTH_WARN</span><br><span class="line">            <span class="number">1</span> osds down</span><br><span class="line">            Reduced data availability: <span class="number">42</span> pgs inactive, <span class="number">131</span> pgs incomplete</span><br><span class="line"> </span><br><span class="line">  services:</span><br><span class="line">    mon: <span class="number">1</span> daemons, quorum lab102</span><br><span class="line">    mgr: lab102(active)</span><br><span class="line">    osd: <span class="number">6</span> osds: <span class="number">5</span> up, <span class="number">6</span> <span class="keyword">in</span></span><br><span class="line"> </span><br><span class="line">  data:</span><br><span class="line">    pools:   <span class="number">3</span> pools, <span class="number">288</span> pgs</span><br><span class="line">    objects: <span class="number">1666</span>k objects, <span class="number">13331</span> MB</span><br><span class="line">    usage:   <span class="number">319</span> GB used, <span class="number">21659</span> GB / <span class="number">21979</span> GB avail</span><br><span class="line">    pgs:     <span class="number">45.486</span>% pgs not active</span><br><span class="line">             <span class="number">157</span> active+clean</span><br><span class="line">             <span class="number">131</span> incomplete</span><br></pre></td></tr></tbody></table>

停止一个osd也会出现incomplete的状态，也就是在默认状态下，是一个osd也不允许down掉的，不然pg就进入了无法使用的状态，这个在我这里感觉无法理解的，开始以为这个是L版本的bug，在查了下资料以后，发现并不是的

查询到一个这样的patch[：default min\_size for erasure pools](https://patchwork.kernel.org/patch/8546771/)

这个里面就讨论了min\_size的问题，上面的环境我也发现了，默认的配置的2+1,这个在我的理解下，正常应该会配置为min\_size 2,在down掉一个的时候还是可写，可读的

实际上在/src/mon/OSDMonitor.cc 这个里面已经把erasure的min\_size的控制改为了  

<table><tbody><tr><td class="code"><pre><span class="line">*min_size = erasure_code-&gt;get_data_chunk_count();</span><br><span class="line">变成</span><br><span class="line">*min_size = erasure_code-&gt;get_data_chunk_count() + <span class="number">1</span>;</span><br></pre></td></tr></tbody></table>

最后面作者提出了自己的担心，假如在K+M的配置下，只有K个的osd允许可以读写的时候，环境是K个OSD是好的，M个OSD挂掉了，这个时候启动一个M中的osd的时候，会进行backfilling，这个时候如果K个osd当中的某个osd挂掉的话，这个时候实际上PG里面的数据就是不完整的，如果是K+1的时候，这个时候做恢复的时候再挂掉一个，实际上还是完整的，也就是开发者考虑的是恢复过程的异常状况还留一个冗余，这个实际我们在日常的维护过程当中也经常遇到恢复过程中确实有osd的挂掉的情况,这个在其他文件系统里面的做法是设计成可读不可写状态

也就是现在ceph的erasure的min\_size设计成了  

<table><tbody><tr><td class="code"><pre><span class="line">min_size=K+<span class="number">1</span></span><br></pre></td></tr></tbody></table>

也就是默认的环境下的是min\_size是3

到这里就知道上面为什么会出现上面的状况了，也就是这个编码设置的时候需要自己去控制下，比如4+2的ec，最多能挂掉几个，如果在以前可以很肯定的说是2个，实际在新的情况下是4+1=5也就是只允许挂掉一个是可读可写的

当然真正生产环境出现了4+2挂掉两个变成了incomplete的时候，因为这个时候数据还是完整可拼接的，所以可以强制mark-complete或者自己把代码里面的min\_size改掉来触发恢复也是可以的

## 总结

对于ec这块接触的很早，里面还是有很多有意思的可以研究的东西的，ec最适合的场景就是归档，当然在某些配置下面，性能也是很不错的，也能支持一些低延时的任务，这个最大的特点就是一定需要根据实际环境去跑性能测试，拆成几比几性能有多少，这个一般还是不太好预估的，跟写入的文件模型也有关联

虽然作者的设计初衷是没问题的，但是这个默认配置实际是不符合生产要求的，所以个人觉得这个不是很合理，默认的应该是不需要调整也是可用的，一个osd也不允许down的话，真正也没法用起来，所以不清楚是否有其他可改变的配置来处理这个，自己配置的时候注意下这个min\_size，如果未来有控制的参数，会补充进这篇文章

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2018-06-12 |

Source: zphj1987@gmail ([ceph erasure默认的min\_size分析](http://www.zphj1987.com/2018/06/12/ceph-erasure-default-min-size/))
