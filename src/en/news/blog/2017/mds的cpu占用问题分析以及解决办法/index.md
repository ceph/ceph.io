---
title: "mds的cpu占用问题分析以及解决办法"
date: "2017-12-04"
author: "admin"
tags: 
  - "planet"
---

  
![ganesha](images/ganesha.png)  

## 前言

mds是ceph里面处理文件接口的组件，一旦使用文件系统，不可避免的会出现一种场景就是目录很多，目录里面的文件很多，而mds是一个单进程的组件，现在虽然有了muti mds，但稳定的使用的大部分场景还是单acitve mds的

这就会出现一种情况，一旦一个目录里面有很多文件的时候，去查询这个目录里的文件就会在当前目录做一次遍历，这个需要一个比较长的时间，如果能比较好的缓存文件信息，也能避免一些过载情况，本篇讲述的是内核客户端正常，而export nfs后mds的负载长时间过高的情况  

## 问题复现

### 准备测试数据,准备好监控环境

监控mds cpu占用  

<table><tbody><tr><td class="code"><pre><span class="line">pidstat -u  <span class="number">1</span> -p <span class="number">27076</span> &gt; /tmp/mds.cpu.log</span><br><span class="line">UserParameter=mds.cpu,cat /tmp/mds.cpu.log|tail -n <span class="number">1</span>|grep -v Average| awk <span class="string">'{print $8}'</span></span><br></pre></td></tr></tbody></table>

整个测试避免屏幕的打印影响时间统计,把输出需要重定向  
测试一：  
内核客户端写入10000文件查看时间以及cpu占用  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsserver kc10000]<span class="comment"># time seq 10000|xargs -i dd if=/dev/zero of=a{} bs=1K count=1  2&gt;/dev/null</span></span><br><span class="line">real	<span class="number">0</span>m30.<span class="number">121</span>s</span><br><span class="line">user	<span class="number">0</span>m1.<span class="number">901</span>s</span><br><span class="line">sys	<span class="number">0</span>m10.<span class="number">420</span>s</span><br></pre></td></tr></tbody></table>

![aa.png-32.5kB](images/aa.png)

测试二：  
内核客户端写入20000文件查看时间以及cpu占用  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsserver kc20000]<span class="comment"># time seq 20000|xargs -i dd if=/dev/zero of=a{} bs=1K count=1  2&gt;/dev/null</span></span><br><span class="line">real	<span class="number">1</span>m38.<span class="number">233</span>s</span><br><span class="line">user	<span class="number">0</span>m3.<span class="number">761</span>s</span><br><span class="line">sys	<span class="number">0</span>m21.<span class="number">510</span>s</span><br></pre></td></tr></tbody></table>

![bbb.png-39kB](images/bbb.png)  
测试三：  
内核客户端写入40000文件查看时间以及cpu占用  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsserver kc40000]<span class="comment">#  time seq 40000|xargs -i dd if=/dev/zero of=a{} bs=1K count=1  2&gt;/dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">2</span>m55.<span class="number">261</span>s</span><br><span class="line">user	<span class="number">0</span>m7.<span class="number">699</span>s</span><br><span class="line">sys	<span class="number">0</span>m42.<span class="number">410</span>s</span><br></pre></td></tr></tbody></table>

![cccc.png-57.3kB](images/cccc.png)

测试4：  
内核客户端列目录10000文件，第一次写完有缓存情况  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsserver kc10000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m0.<span class="number">228</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">063</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">048</span>s</span><br></pre></td></tr></tbody></table>

内核客户端列目录20000文件，第一次写完有缓存情况  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsserver kc20000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m0.<span class="number">737</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">141</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">092</span>s</span><br></pre></td></tr></tbody></table>

内核客户端列目录40000文件，第一次写完有缓存情况  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsserver kc40000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m1.<span class="number">658</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">286</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">196</span>s</span><br></pre></td></tr></tbody></table>

都是比较快的返回，CPU可以忽略不计

现在重启mds后再次列目录  
客户端如果不umount,直接重启mds的话,还是会缓存在  
新版本这个地方好像已经改了（重启了mds 显示inode还在，但是随着时间的增长inode会减少，说明还是有周期，会释放，这个还不知道哪个地方控制，用什么参数控制，这个不是本篇着重关注的地方，后续再看下,jewel版本已经比hammer版本的元数据时间快了很多了）  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsserver kc10000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m0.<span class="number">380</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">065</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">041</span>s</span><br><span class="line">[root@nfsserver kc10000]<span class="comment"># cd ../kc20000/</span></span><br><span class="line">[root@nfsserver kc20000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m0.<span class="number">868</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">154</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">074</span>s</span><br><span class="line">[root@nfsserver kc20000]<span class="comment"># cd ../kc40000/</span></span><br><span class="line">[root@nfsserver kc40000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m1.<span class="number">947</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">300</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">166</span>s</span><br></pre></td></tr></tbody></table>

测试都是看到很快的返回，以上都是正常的，下面开始将这个目录exportnfs出去，看下是个什么情况

### 负载问题复现

从nfs客户端第一次列10000个小文件的目录

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc10000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m4.<span class="number">038</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">095</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">069</span>s</span><br></pre></td></tr></tbody></table>

![nfs10000.png-36.7kB](images/nfs10000.png)

从nfs客户端第一次列20000个小文件的目录  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc20000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m17.<span class="number">446</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">175</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">141</span>s</span><br></pre></td></tr></tbody></table>

![nfs20000.png-43.2kB](images/nfs20000.png)  
从nfs客户端第二次列20000个小文件目录  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc20000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m21.<span class="number">215</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">182</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">151</span>s</span><br></pre></td></tr></tbody></table>

![nfs200002.png-56.7kB](images/nfs200002.png)

从nfs客户端第三次列20000个小文件目录  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc20000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m16.<span class="number">222</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">189</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">143</span>s</span><br></pre></td></tr></tbody></table>

可以看到在20000量级的时候列目录维持在20000左右，CPU维持一个高位

从nfs客户端列40000个小文件的目录  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc40000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">7</span>m15.<span class="number">663</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">319</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">581</span>s</span><br><span class="line">[root@nfsclient kc40000]<span class="comment">#</span></span><br></pre></td></tr></tbody></table>

![nfs40000.png-77.2kB](images/nfs40000.png)  
第一次列完，马上第二次列看下情况  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc40000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">1</span>m12.<span class="number">816</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">163</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">142</span>s</span><br></pre></td></tr></tbody></table>

可以看到第二次列的时间已经缩短了，再来第三次  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc40000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">1</span>m33.<span class="number">549</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">162</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">183</span>s</span><br></pre></td></tr></tbody></table>

![nfs400003.png-61.3kB](images/nfs400003.png)  
可以看到在后面列的时候时间确实缩短了，但是还是维持一个非常高CPU的占用，以及比较长的一个时间，这个很容易造成过载

这个地方目前看应该是内核客户端与内核NFS的结合的问题

## 解决办法:用ganesha的ceph用户态接口替代kernel nfs

我们看下另外一种方案用户态的NFS+ceph同样的环境下测试结果：

从nfs客户端第一次列40000个小文件的目录  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc40000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m3.<span class="number">289</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">335</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">386</span>s</span><br></pre></td></tr></tbody></table>

从nfs客户端第二次列40000个小文件的目录

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc40000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m1.<span class="number">686</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">351</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">389</span>s</span><br></pre></td></tr></tbody></table>

从nfs客户端第三次列40000个小文件的目录  

<table><tbody><tr><td class="code"><pre><span class="line">[root@nfsclient kc40000]<span class="comment"># time ll 2&gt;&amp;1 &gt; /dev/null</span></span><br><span class="line"></span><br><span class="line">real	<span class="number">0</span>m1.<span class="number">675</span>s</span><br><span class="line">user	<span class="number">0</span>m0.<span class="number">320</span>s</span><br><span class="line">sys	<span class="number">0</span>m0.<span class="number">391</span>s</span><br></pre></td></tr></tbody></table>

![ganesha.png-51.5kB](images/ganesha.png)  
基本mds无多余的负载，非常快的返回

可以从上面的测试看到差别是非常的大的，这个地方应该是内核模块与内核之间的问题，而采用用户态的以后解决了列目录慢以及卡顿的问题

## 如何配置ganesha支持ceph的nfs接口

<table><tbody><tr><td class="code"><pre><span class="line">git <span class="built_in">clone</span> -b V2.<span class="number">3</span>-stable https://github.com/nfs-ganesha/nfs-ganesha.git</span><br><span class="line"><span class="built_in">cd</span> nfs-ganesha/</span><br><span class="line">git submodule update --init --recursive</span><br><span class="line"><span class="built_in">cd</span> ..</span><br><span class="line"><span class="built_in">cd</span> nfs-ganesha/</span><br><span class="line">ll src/FSAL/FSAL_CEPH/</span><br><span class="line"><span class="built_in">cd</span> ..</span><br><span class="line">mkdir mybuild</span><br><span class="line"><span class="built_in">cd</span> mybuild/</span><br><span class="line">cmake -DUSE_FSAL_CEPH=ON ../nfs-ganesha/src/</span><br><span class="line">ll FSAL/FSAL_CEPH/</span><br><span class="line">make</span><br><span class="line">make -j <span class="number">12</span></span><br><span class="line">make install</span><br></pre></td></tr></tbody></table>

vim /etc/ganesha/ganesha.conf  
修改配置文件  

<table><tbody><tr><td class="code"><pre><span class="line">EXPORT</span><br><span class="line">{</span><br><span class="line">    Export_ID=<span class="number">1</span>;</span><br><span class="line"></span><br><span class="line">    Path = <span class="string">"/"</span>;</span><br><span class="line"></span><br><span class="line">    Pseudo = <span class="string">"/"</span>;</span><br><span class="line"></span><br><span class="line">    Access_Type = RW;</span><br><span class="line"></span><br><span class="line">    NFS_Protocols = <span class="number">4</span>;</span><br><span class="line"></span><br><span class="line">    Transport_Protocols = TCP;</span><br><span class="line"></span><br><span class="line">    FSAL {</span><br><span class="line">        Name = CEPH;</span><br><span class="line">    }</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

停止掉原生的nfs  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl stop nfs</span><br></pre></td></tr></tbody></table>

启用ganesha nfs  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl start  nfs-ganesha.service</span><br></pre></td></tr></tbody></table>

然后在客户端进行nfs的挂载即可

## 总结

ganesha在需要用到cephfs又正好是要用到nfs接口的时候，可以考虑这个方案，至少在缓存文件，降低负载上面能够比kernel client有更好的效果，这个可以根据测试情况用数据来做比较

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-12-04 |

Source: zphj1987@gmail ([mds的cpu占用问题分析以及解决办法](http://www.zphj1987.com/2017/12/04/mds-use-too-more-cpu/))
