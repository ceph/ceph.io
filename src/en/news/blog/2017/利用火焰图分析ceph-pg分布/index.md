---
title: "利用火焰图分析ceph pg分布"
date: "2017-07-18"
author: "admin"
tags: 
  - "planet"
---

  
![](images/flame.png)  

## 前言

性能优化大神Brendan Gregg发明了火焰图来定位性能问题，通过图表就可以发现问题出在哪里，通过svg矢量图来查看性能卡在哪个点，哪个操作占用的资源最多  
  
在查看了原始数据后，这个分析的原理是按层级来对调用进行一个计数，然后以层级去做比对，来看横向的占用的比例情况

基于这个原理，把osd tree的数据和pg数据可以做一个层级的组合，从而可以很方便的看出pg的分布情况，主机的分布情况，还可以进行搜索，在一个简单的图表内汇聚了大量的信息

## 实践

获取需要的数据，这个获取数据是我用一个脚本解析的osd tree 和pg dump，然后按照需要的格式进行输出

> default;lab8106;osd.2;0.0 6  
> default;lab8106;osd.3;0.0 6  
> default;rack1;lab8107;osd.0;0.0 6

需要的格式是这个样的，最后一个为权重，使用的是对象数，因为对象数可能为0，所以默认在每个数值进行了加一的操作，前面就是osd的分布的位置

脚本/sbin/stackcollapse-crush内容如下：  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#! /bin/python</span></span><br><span class="line"><span class="comment"># -*- coding: UTF-8 -*-</span></span><br><span class="line">import os</span><br><span class="line">import commands</span><br><span class="line">import json</span><br><span class="line"></span><br><span class="line"></span><br><span class="line">def main():</span><br><span class="line">    global list_all_host</span><br><span class="line">    list_all_host = commands.getoutput(<span class="string">'ceph osd tree -f json-pretty  2&gt;/dev/null'</span>)</span><br><span class="line">    getosd(<span class="string">'osd.1'</span>)</span><br><span class="line">    getpgmap()</span><br><span class="line">def getosd(osd):</span><br><span class="line">    mylist=[]</span><br><span class="line">    crushid={}</span><br><span class="line">    json_str = json.loads(list_all_host)</span><br><span class="line">    <span class="keyword">for</span> item <span class="keyword">in</span> json_str[<span class="string">'nodes'</span>]:</span><br><span class="line">        <span class="keyword">if</span> item.has_key(<span class="string">'children'</span>):</span><br><span class="line">            crushid[str(item[<span class="string">'id'</span>])]=str(item[<span class="string">'name'</span>])</span><br><span class="line">            <span class="keyword">for</span> child <span class="keyword">in</span> item[<span class="string">'children'</span>]:</span><br><span class="line">                tmplist=[item[<span class="string">'id'</span>],child]</span><br><span class="line">                mylist.append(tmplist)</span><br><span class="line">        <span class="keyword">if</span> item[<span class="string">'type'</span>] == <span class="string">"osd"</span>:</span><br><span class="line">            crushid[str(item[<span class="string">'id'</span>])]=str(item[<span class="string">'name'</span>])</span><br><span class="line">    listnum=len(mylist)</span><br><span class="line">    compareindex=<span class="number">0</span></span><br><span class="line"><span class="comment">###从数组开始跟后面的数组进行比较，如果有就改变后面的数组，然后删除当前比较的list(index),进行list更新</span></span><br><span class="line"><span class="comment">###如果没有改变，就把索引往后推即可</span></span><br><span class="line">    <span class="keyword">while</span> compareindex &lt; len(mylist):</span><br><span class="line">        change = False</span><br><span class="line">        <span class="keyword">for</span> index,num <span class="keyword">in</span> enumerate(mylist):</span><br><span class="line">            <span class="keyword">if</span> compareindex != index and compareindex &lt; index:</span><br><span class="line">                <span class="keyword">if</span> str(mylist[compareindex][-<span class="number">1</span>]) == str(num[<span class="number">0</span>]):</span><br><span class="line">                    del mylist[index][<span class="number">0</span>]</span><br><span class="line">                    mylist[index]=mylist[compareindex]+mylist[index]</span><br><span class="line">                    change=True</span><br><span class="line">                <span class="keyword">if</span> str(mylist[compareindex][<span class="number">0</span>]) == str(num[-<span class="number">1</span>]):</span><br><span class="line">                    del mylist[index][-<span class="number">1</span>]</span><br><span class="line">                    mylist[index]=mylist[index]+mylist[compareindex]</span><br><span class="line">                    change=True</span><br><span class="line">        <span class="keyword">if</span> change == True:</span><br><span class="line">            del mylist[compareindex]</span><br><span class="line">        <span class="keyword">if</span> change == False:</span><br><span class="line">            compareindex = compareindex + <span class="number">1</span></span><br><span class="line"></span><br><span class="line">    <span class="keyword">for</span> index,crushlist <span class="keyword">in</span> enumerate(mylist):</span><br><span class="line">        osdcrushlist=[]</span><br><span class="line">        <span class="keyword">for</span> osdlocaltion <span class="keyword">in</span> crushlist:</span><br><span class="line">            <span class="built_in">local</span>=str(crushid[<span class="string">'%s'</span> %osdlocaltion])</span><br><span class="line">            osdcrushlist.append(<span class="built_in">local</span>)</span><br><span class="line">        <span class="keyword">if</span> osdcrushlist[-<span class="number">1</span>] == osd:</span><br><span class="line">            <span class="built_in">return</span> osdcrushlist</span><br><span class="line"></span><br><span class="line">def getpgmap():</span><br><span class="line">    list_all_host = commands.getoutput(<span class="string">'ceph pg  ls --format json-pretty  2&gt;/dev/null'</span>)</span><br><span class="line">    json_str = json.loads(list_all_host)</span><br><span class="line">    <span class="keyword">for</span> item <span class="keyword">in</span> json_str:</span><br><span class="line">        <span class="keyword">for</span> osdid <span class="keyword">in</span> item[<span class="string">'up'</span>]:</span><br><span class="line">            osd=<span class="string">"osd."</span>+str(osdid)</span><br><span class="line">            b=<span class="string">""</span></span><br><span class="line">            <span class="keyword">for</span> a <span class="keyword">in</span> getosd(osd):</span><br><span class="line">                b=b+str(a)+<span class="string">";"</span></span><br><span class="line">            <span class="built_in">print</span> b+item[<span class="string">'pgid'</span>]+<span class="string">" "</span>+str(item[<span class="string">'stat_sum'</span>][<span class="string">'num_objects'</span>]+<span class="number">1</span>)</span><br><span class="line"></span><br><span class="line"><span class="keyword">if</span> __name__ == <span class="string">'__main__'</span>:</span><br><span class="line">    main()</span><br></pre></td></tr></tbody></table>

### 获取数据

<table><tbody><tr><td class="code"><pre><span class="line">/sbin/stackcollapse-crush &gt; /tmp/mydata</span><br></pre></td></tr></tbody></table>

### 解析数据

获取解析脚本，这个脚本是Brendan Gregg写好的，这地方托管到我的github里面了  

<table><tbody><tr><td class="code"><pre><span class="line">wget -O /sbin/flamegraph https://raw.githubusercontent.com/zphj1987/cephcrushflam/master/flamegraph.pl</span><br></pre></td></tr></tbody></table>

对数据进行解析  

<table><tbody><tr><td class="code"><pre><span class="line">/sbin/flamegraph  --title  <span class="string">"Ceph crush flame graph"</span> --width <span class="string">"1800"</span> --countname <span class="string">"num"</span> /tmp/mydata &gt; /tmp/mycrush.svg</span><br></pre></td></tr></tbody></table>

将/tmp/mycrush.svg拷贝到windows机器，然后用浏览器打开即可，推荐chrome

### 效果图如下

Example (右键在新窗口中打开):  
[![Example](http://7xweck.com1.z0.glb.clouddn.com/mycrush.svg)](http://7xweck.com1.z0.glb.clouddn.com/mycrush.svg)

- 通过颜色来区分比例占用的区别
- 支持搜索
- tree方式，可以清楚看到分布
- 可以查看pg对象数目
- 可以查看osd上面有哪些pg，主机上有哪些osd

## 总结

通过ceph osd tree可以查到整个的信息，但是一个屏幕的信息量有限，而通过滚屏或者过滤进行查询的信息，需要做一下关联，而这种可以缩放的svg位图的方式，可以包含大量的信息，如果是做分析的时候还是能比较直观的看到，上面的难点在于获取数据部分，而绘图的部分是直接用的现有的处理，比自己重新开发一个要简单的多，类似的工具还有个桑基图方式，这个在inkscope这个管理平台里面有用到

本篇就是在最小的视野里容纳尽量多的信息量一个实例，其他的数据有类似模型的也可以做相似的处理

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-07-18 |

Source: zphj1987@gmail ([利用火焰图分析ceph pg分布](http://www.zphj1987.com/2017/07/18/use-flame-show-ceph-pg/))
