---
title: "根据一段话判断情绪"
date: "2017-02-10"
author: "admin"
tags: 
  - "planet"
---

  
![emotion](images/gre.jpg)  

## 引言

看到一个好玩的项目，[女朋友的微博情绪监控](https://www.anotherhome.net/2920),这个是根据一段话来判断情绪的，记得之前有在哪里看到过，未来的一切都是API，也就是很多东西会被封装好，你只需要去用就可以了，这个就是一个很好的例子，你可以不懂语意分析，不懂分词，这些都不要紧，只要你给出你的素材，后面就交给api去处理  

## 代码

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#!/usr/bin/env python</span></span><br><span class="line"><span class="comment"># -*- coding: UTF-8 -*-</span></span><br><span class="line">import sys</span><br><span class="line">import json</span><br><span class="line">import requests</span><br><span class="line">def main():</span><br><span class="line">    <span class="keyword">if</span> len(sys.argv) != <span class="number">2</span>:</span><br><span class="line">        <span class="built_in">help</span>()</span><br><span class="line">    <span class="keyword">else</span>:</span><br><span class="line">        printpromotion(sys.argv[<span class="number">1</span>])</span><br><span class="line">def <span class="built_in">help</span>():</span><br><span class="line">    <span class="built_in">print</span> <span class="string">""</span><span class="string">"Usage : qingxu.py [-h] [word]</span><br><span class="line">        情绪鉴定 - 判断一段话的情绪</span><br><span class="line">        OPTIONS</span><br><span class="line">        ========</span><br><span class="line">        sample:</span><br><span class="line">        [root@host ~]# python  qingxu.py 开心</span><br><span class="line">        说的话: word</span><br><span class="line">        正面情绪: 98.3%</span><br><span class="line">        负面情绪: 1.7%</span><br><span class="line">        ========</span><br><span class="line">        "</span><span class="string">""</span></span><br><span class="line">def printpromotion(word):</span><br><span class="line">    weburl=<span class="string">'https://api.prprpr.me/emotion/wenzhi?password=DIYgod&amp;text='</span>+word</span><br><span class="line">    r = requests.get(<span class="string">'%s'</span> %weburl)</span><br><span class="line">    json_str = json.loads(r.text)</span><br><span class="line">    <span class="built_in">print</span> <span class="string">"说的话:"</span>,<span class="string">"%s"</span> %word</span><br><span class="line">    <span class="built_in">print</span> <span class="string">"正面情绪:"</span>,(format(json_str[<span class="string">"positive"</span>],<span class="string">'0.1%'</span>))</span><br><span class="line">    <span class="built_in">print</span> <span class="string">"负面情绪:"</span>,(format(json_str[<span class="string">"negative"</span>],<span class="string">'0.1%'</span>))</span><br><span class="line"><span class="keyword">if</span> __name__ == <span class="string">'__main__'</span>:</span><br><span class="line">    main()</span><br></pre></td></tr></tbody></table>

## 运行效果

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ~]<span class="comment"># python qingxu.py 很高兴</span></span><br><span class="line">说的话: 很高兴</span><br><span class="line">正面情绪: <span class="number">92.4</span>%</span><br><span class="line">负面情绪: <span class="number">7.6</span>%</span><br><span class="line">[root@lab8106 ~]<span class="comment"># python qingxu.py 被坑了</span></span><br><span class="line">说的话: 被坑了</span><br><span class="line">正面情绪: <span class="number">5.7</span>%</span><br><span class="line">负面情绪: <span class="number">94.3</span>%</span><br></pre></td></tr></tbody></table>

## 总结

内部的语义分析的准确度有多少还不清楚，但是也是一个很好玩的东西，程序员的想法还是挺多的

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-02-10 |

Source: zphj1987@gmail ([根据一段话判断情绪](http://www.zphj1987.com/2017/02/10/word-to-motion/))
