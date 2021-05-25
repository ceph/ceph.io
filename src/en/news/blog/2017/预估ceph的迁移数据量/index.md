---
title: "预估ceph的迁移数据量"
date: "2017-02-08"
author: "admin"
tags: 
  - "planet"
---

  
![cal](images/calculator.png)  

## 引言

我们在进行 ceph 的 osd 的增加和减少的维护的时候，会碰到迁移数据，但是我们平时会怎么去回答关于迁移数据量的问题，一般来说，都是说很多，或者说根据环境来看，有没有精确的一个说法，到底要迁移多少数据?这个我以前也有思考过这个问题，当时想是对比前后的pg的分布，然后进行计算，正好在翻一些资料的时候，看到有alram写的一篇博客，alram是Inktank的程序员，也就是sage所在的公司，程序是一个python脚本，本篇会分析下这个对比的思路，以及运行效果

计算迁移量只需要一个修改后的crushmap就可以了，这个是离线计算的，所以不会对集群有什么影响  

## 运行效果

### 准备修改后的crushmap

获取当前crushmap  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd getcrushmap -o crushmap</span><br></pre></td></tr></tbody></table>

解码crushmap  

<table><tbody><tr><td class="code"><pre><span class="line">crushtool <span class="operator">-d</span> crushmap -o crushmap.txt</span><br></pre></td></tr></tbody></table>

修改crushmap.txt  
这个根据自己需要，修改成自己想修改成的crushmap即可，可以是增加，也可以是删除

### 减少节点的计算

假如删除一个osd.5 我们需要迁移多少数据  
将crushmap里面的osd.5的weight改成0  

<table><tbody><tr><td class="code"><pre><span class="line">crushtool -c crushmap.txt -o crushmapnew</span><br></pre></td></tr></tbody></table>

运行计算脚本  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># python jisuan.py --crushmap-file crushmapnew</span></span><br><span class="line">POOL                 REMAPPED OSDs        BYTES REBALANCE      OBJECTS REBALANCE   </span><br><span class="line">rbd                  <span class="number">59</span>                   <span class="number">6157238296</span>           <span class="number">1469</span>                </span><br><span class="line">data                 <span class="number">54</span>                   <span class="number">5918162968</span>           <span class="number">1412</span>                </span><br><span class="line">metadata             <span class="number">53</span>                   <span class="number">5825888280</span>           <span class="number">1390</span></span><br></pre></td></tr></tbody></table>

可以看到迁移的数据量  
REMAPPED OSDs 下面就是有多少份的PG数据需要迁移，这里面计算的方式是比较前后的分布

> \[1,2\] - > \[1,2\] 迁移0个  
> \[1,2\] - > \[4,2\] 迁移1个  
> \[1,2\] - > \[4,3\] 迁移2个

上面的统计的是这样的个数，所以不太好说是PG或者是OSD，可以理解为PG内数据的份数，因为单个PG可能需要迁移一份，也有可能迁移两份，或者多份

### 增加节点的计算

如果增加一个osd.6 我们需要迁移多少数据  
直接运行脚本  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># python jisuan.py --crushmap-file crushmapnew</span></span><br><span class="line">POOL                 REMAPPED OSDs        BYTES REBALANCE      OBJECTS REBALANCE   </span><br><span class="line">rbd                  <span class="number">0</span>                    <span class="number">0</span>                    <span class="number">0</span>                   </span><br><span class="line">data                 <span class="number">0</span>                    <span class="number">0</span>                    <span class="number">0</span>                   </span><br><span class="line">metadata             <span class="number">0</span>                    <span class="number">0</span>                    <span class="number">0</span></span><br></pre></td></tr></tbody></table>

可以看到没有输出，这个是因为计算的脚本里面有个地方报错了，ceph内部有个限制，在将crushmap import进osdmap的时候，ceph会验证osdmap里面的osd个数和crushmap里面的osd个数是不是相同  
所以这个地方需要多做一步，将osd的个数设置成跟预估的一致，这个是唯一对现有集群做的修改操作，  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># ceph osd setmaxosd 7</span></span><br><span class="line"><span class="built_in">set</span> new max_osd = <span class="number">7</span></span><br></pre></td></tr></tbody></table>

然后再次运行就可以了  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab8106 ceph]<span class="comment"># python jisuan.py --crushmap-file crushmapnew</span></span><br><span class="line">POOL                 REMAPPED OSDs        BYTES REBALANCE      OBJECTS REBALANCE   </span><br><span class="line">rbd                  <span class="number">31</span>                   <span class="number">3590324224</span>           <span class="number">856</span>                 </span><br><span class="line">data                 <span class="number">34</span>                   <span class="number">3372220416</span>           <span class="number">804</span>                 </span><br><span class="line">metadata             <span class="number">41</span>                   <span class="number">4492099584</span>           <span class="number">1071</span></span><br></pre></td></tr></tbody></table>

上面就是运行的效果，下面我们对内部的逻辑进行分析

## 代码和代码分析

### 代码

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#!/usr/bin/env python</span></span><br><span class="line"></span><br><span class="line">import ast</span><br><span class="line">import json</span><br><span class="line">import os</span><br><span class="line">import subprocess</span><br><span class="line">import argparse</span><br><span class="line">import sys</span><br><span class="line"></span><br><span class="line">FNULL = open(os.devnull, <span class="string">'w'</span>)</span><br><span class="line"></span><br><span class="line"><span class="comment"># assume the osdmap test output</span></span><br><span class="line"><span class="comment"># is the same lenght and order...</span></span><br><span class="line"><span class="comment"># if add support for PG increase</span></span><br><span class="line"><span class="comment"># that's gonna break</span></span><br><span class="line">def diff_output(original, new, pools):</span><br><span class="line">    number_of_osd_remap = <span class="number">0</span></span><br><span class="line">    osd_data_movement = <span class="number">0</span></span><br><span class="line"></span><br><span class="line">    results = {}</span><br><span class="line"></span><br><span class="line">    pg_data, pg_objects = get_pg_info()</span><br><span class="line"></span><br><span class="line">    <span class="keyword">for</span> i <span class="keyword">in</span> range(len(original)):</span><br><span class="line">        orig_i = original[i]</span><br><span class="line">        new_i = new[i]</span><br><span class="line"></span><br><span class="line">        <span class="keyword">if</span> orig_i[<span class="number">0</span>].isdigit():</span><br><span class="line">            pg_id = orig_i.split(<span class="string">'t'</span>)[<span class="number">0</span>]</span><br><span class="line">            pool_id = pg_id[<span class="number">0</span>]</span><br><span class="line">            pool_name = pools[pool_id][<span class="string">'pool_name'</span>]</span><br><span class="line"></span><br><span class="line">            <span class="keyword">if</span> not pool_name <span class="keyword">in</span> results:</span><br><span class="line">                results[pool_name] = {}</span><br><span class="line">                results[pool_name][<span class="string">'osd_remap_counter'</span>] = <span class="number">0</span></span><br><span class="line">                results[pool_name][<span class="string">'osd_bytes_movement'</span>] = <span class="number">0</span></span><br><span class="line">                results[pool_name][<span class="string">'osd_objects_movement'</span>] = <span class="number">0</span></span><br><span class="line"></span><br><span class="line">            original_mappings = ast.literal_<span class="built_in">eval</span>(orig_i.split(<span class="string">'t'</span>)[<span class="number">1</span>])</span><br><span class="line">            new_mappings = ast.literal_<span class="built_in">eval</span>(new_i.split(<span class="string">'t'</span>)[<span class="number">1</span>])</span><br><span class="line">            intersection = list(<span class="built_in">set</span>(original_mappings).intersection(<span class="built_in">set</span>(new_mappings)))</span><br><span class="line"></span><br><span class="line">            osd_movement_<span class="keyword">for</span>_this_pg = int(pools[pool_id][<span class="string">'pool_size'</span>]) - len(intersection)</span><br><span class="line">            osd_data_movement_<span class="keyword">for</span>_this_pg = int(osd_movement_<span class="keyword">for</span>_this_pg) * int(pg_data[pg_id])</span><br><span class="line">            osd_object_movement_<span class="keyword">for</span>_this_pg = int(osd_movement_<span class="keyword">for</span>_this_pg) * int(pg_objects[pg_id])</span><br><span class="line"></span><br><span class="line">            results[pool_name][<span class="string">'osd_remap_counter'</span>] += osd_movement_<span class="keyword">for</span>_this_pg</span><br><span class="line">            results[pool_name][<span class="string">'osd_bytes_movement'</span>] += int(osd_data_movement_<span class="keyword">for</span>_this_pg)</span><br><span class="line">            results[pool_name][<span class="string">'osd_objects_movement'</span>] += int(osd_object_movement_<span class="keyword">for</span>_this_pg)</span><br><span class="line"></span><br><span class="line">        <span class="keyword">elif</span> orig_i.startswith(<span class="string">'#osd'</span>):</span><br><span class="line">            <span class="built_in">break</span></span><br><span class="line"></span><br><span class="line">    <span class="built_in">return</span> results</span><br><span class="line"></span><br><span class="line">def get_pools_info(osdmap_path):</span><br><span class="line">    pools = {}</span><br><span class="line">    args = [<span class="string">'osdmaptool'</span>, <span class="string">'--print'</span>, osdmap_path]</span><br><span class="line">    osdmap_out = subprocess.check_output(args, stderr=FNULL).split(<span class="string">'n'</span>)</span><br><span class="line">    <span class="keyword">for</span> line <span class="keyword">in</span> osdmap_out:</span><br><span class="line">        <span class="keyword">if</span> line.startswith(<span class="string">'pool'</span>):</span><br><span class="line">            pool_id = line.split()[<span class="number">1</span>]</span><br><span class="line">            pool_size = line.split()[<span class="number">5</span>]</span><br><span class="line">            pool_name = line.split()[<span class="number">2</span>].replace(<span class="string">"'"</span>,<span class="string">""</span>)</span><br><span class="line">            pools[pool_id] = {}</span><br><span class="line">            pools[pool_id][<span class="string">'pool_size'</span>] = pool_size</span><br><span class="line">            pools[pool_id][<span class="string">'pool_name'</span>] = pool_name</span><br><span class="line">        <span class="keyword">elif</span> line.startswith(<span class="string">'max_osd'</span>):</span><br><span class="line">            <span class="built_in">break</span></span><br><span class="line"></span><br><span class="line">    <span class="built_in">return</span> pools</span><br><span class="line"></span><br><span class="line">def get_osd_map(osdmap_path):</span><br><span class="line">    args = [<span class="string">'sudo'</span>, <span class="string">'ceph'</span>, <span class="string">'osd'</span>, <span class="string">'getmap'</span>, <span class="string">'-o'</span>, osdmap_path]</span><br><span class="line">    subprocess.call(args, stdout=FNULL, stderr=subprocess.STDOUT)</span><br><span class="line"></span><br><span class="line">def get_pg_info():</span><br><span class="line">    pg_data = {}</span><br><span class="line">    pg_objects = {}</span><br><span class="line">    args = [<span class="string">'sudo'</span>, <span class="string">'ceph'</span>, <span class="string">'pg'</span>, <span class="string">'dump'</span>]</span><br><span class="line">    pgmap = subprocess.check_output(args, stderr=FNULL).split(<span class="string">'n'</span>)</span><br><span class="line"></span><br><span class="line">    <span class="keyword">for</span> line <span class="keyword">in</span> pgmap:</span><br><span class="line">        <span class="keyword">if</span> line[<span class="number">0</span>].isdigit():</span><br><span class="line">            pg_id = line.split(<span class="string">'t'</span>)[<span class="number">0</span>]</span><br><span class="line">            pg_bytes = line.split(<span class="string">'t'</span>)[<span class="number">6</span>]</span><br><span class="line">            pg_obj = line.split(<span class="string">'t'</span>)[<span class="number">1</span>]</span><br><span class="line">            pg_data[pg_id] = pg_bytes</span><br><span class="line">            pg_objects[pg_id] = pg_obj</span><br><span class="line">        <span class="keyword">elif</span> line.startswith(<span class="string">'pool'</span>):</span><br><span class="line">            <span class="built_in">break</span></span><br><span class="line"></span><br><span class="line">    <span class="built_in">return</span> pg_data, pg_objects</span><br><span class="line"></span><br><span class="line">def osdmaptool_<span class="built_in">test</span>_map_pgs_dump(original_osdmap_path, crushmap):</span><br><span class="line">    new_osdmap_path = original_osdmap_path + <span class="string">'.new'</span></span><br><span class="line">    get_osd_map(original_osdmap_path)</span><br><span class="line">    args = [<span class="string">'osdmaptool'</span>, <span class="string">'--test-map-pgs-dump'</span>, original_osdmap_path]</span><br><span class="line">    original_osdmaptool_output = subprocess.check_output(args, stderr=FNULL).split(<span class="string">'n'</span>)</span><br><span class="line"></span><br><span class="line">    args = [<span class="string">'cp'</span>, original_osdmap_path, new_osdmap_path]</span><br><span class="line">    subprocess.call(args, stdout=FNULL, stderr=subprocess.STDOUT)</span><br><span class="line">    args = [<span class="string">'osdmaptool'</span>, <span class="string">'--import-crush'</span>, crushmap, new_osdmap_path]</span><br><span class="line">    subprocess.call(args, stdout=FNULL, stderr=subprocess.STDOUT)</span><br><span class="line">    args = [<span class="string">'osdmaptool'</span>, <span class="string">'--test-map-pgs-dump'</span>, new_osdmap_path]</span><br><span class="line">    new_osdmaptool_output = subprocess.check_output(args, stderr=FNULL).split(<span class="string">'n'</span>)</span><br><span class="line"></span><br><span class="line">    pools = get_pools_info(original_osdmap_path)</span><br><span class="line">    results = diff_output(original_osdmaptool_output, new_osdmaptool_output, pools)</span><br><span class="line"></span><br><span class="line">    <span class="built_in">return</span> results</span><br><span class="line"></span><br><span class="line"></span><br><span class="line">def dump_plain_output(results):</span><br><span class="line">    sys.stdout.write(<span class="string">"%-20s %-20s %-20s %-20sn"</span> % (<span class="string">"POOL"</span>, <span class="string">"REMAPPED OSDs"</span>, <span class="string">"BYTES REBALANCE"</span>, <span class="string">"OBJECTS REBALANCE"</span>))</span><br><span class="line"></span><br><span class="line">    <span class="keyword">for</span> pool <span class="keyword">in</span> results:</span><br><span class="line">        sys.stdout.write(<span class="string">"%-20s %-20s %-20s %-20sn"</span> % (</span><br><span class="line">            pool,</span><br><span class="line">            results[pool][<span class="string">'osd_remap_counter'</span>],</span><br><span class="line">            results[pool][<span class="string">'osd_bytes_movement'</span>],</span><br><span class="line">            results[pool][<span class="string">'osd_objects_movement'</span>]</span><br><span class="line">            ))</span><br><span class="line"></span><br><span class="line">def cleanup(osdmap):</span><br><span class="line">    FNULL.close()</span><br><span class="line">    new_osdmap = osdmap + <span class="string">'.new'</span></span><br><span class="line">    os.remove(new_osdmap)</span><br><span class="line"></span><br><span class="line">def parse_args():</span><br><span class="line">    parser = argparse.ArgumentParser(description=<span class="string">'Ceph CRUSH change data movement calculator.'</span>)</span><br><span class="line"></span><br><span class="line">    parser.add_argument(</span><br><span class="line">        <span class="string">'--osdmap-file'</span>,</span><br><span class="line">        <span class="built_in">help</span>=<span class="string">"Where to save the original osdmap. Temp one will be &lt;location&gt;.new. Default: /tmp/osdmap"</span>,</span><br><span class="line">        default=<span class="string">"/tmp/osdmap"</span>,</span><br><span class="line">        dest=<span class="string">"osdmap_path"</span></span><br><span class="line">        )</span><br><span class="line">    parser.add_argument(</span><br><span class="line">        <span class="string">'--crushmap-file'</span>,</span><br><span class="line">        <span class="built_in">help</span>=<span class="string">"CRUSHmap to run the movement test against."</span>,</span><br><span class="line">        required=True,</span><br><span class="line">        dest=<span class="string">"new_crushmap"</span></span><br><span class="line">        )</span><br><span class="line"></span><br><span class="line">    parser.add_argument(</span><br><span class="line">        <span class="string">'--format'</span>,</span><br><span class="line">        <span class="built_in">help</span>=<span class="string">"Output format. Default: plain"</span>,</span><br><span class="line">        choices=[<span class="string">'json'</span>, <span class="string">'plain'</span>],</span><br><span class="line">        dest=<span class="string">"format"</span>,</span><br><span class="line">        default=<span class="string">"plain"</span></span><br><span class="line">        )</span><br><span class="line"></span><br><span class="line">    args = parser.parse_args()</span><br><span class="line">    <span class="built_in">return</span> args</span><br><span class="line"></span><br><span class="line"><span class="keyword">if</span> __name__ == <span class="string">'__main__'</span>:</span><br><span class="line">    ctx = parse_args()</span><br><span class="line"></span><br><span class="line">    results = osdmaptool_<span class="built_in">test</span>_map_pgs_dump(ctx.osdmap_path, ctx.new_crushmap)</span><br><span class="line">    cleanup(ctx.osdmap_path)</span><br><span class="line"></span><br><span class="line">    <span class="keyword">if</span> ctx.format == <span class="string">'json'</span>:</span><br><span class="line">        <span class="built_in">print</span> json.dumps(results)</span><br><span class="line">    <span class="keyword">elif</span> ctx.format == <span class="string">'plain'</span>:</span><br><span class="line">        dump_plain_output(results)</span><br></pre></td></tr></tbody></table>

直接放在这里方便拷贝，也可以去原作者的gist里面去获取

### 主要代码分析

首先获取osdmap  

<table><tbody><tr><td class="code"><pre><span class="line">ceph osd getmap -o /tmp/osdmap</span><br></pre></td></tr></tbody></table>

获取原始pg分布  

<table><tbody><tr><td class="code"><pre><span class="line">使用osdmaptool  --test-map-pgs-dump /tmp/osdmap</span><br></pre></td></tr></tbody></table>

获取新的crushmap  

<table><tbody><tr><td class="code"><pre><span class="line">这个是自己编辑成需要的crushmap</span><br></pre></td></tr></tbody></table>

将新的crushmap注入到osdmap里面得到新的osdmap  

<table><tbody><tr><td class="code"><pre><span class="line">osdmaptool --import-crush  crushmap  /tmp/new_osdmap_path</span><br></pre></td></tr></tbody></table>

根据新的osdmap进行计算新的分布  

<table><tbody><tr><td class="code"><pre><span class="line">osdmaptool  --test-map-pgs-dump /tmp/new_osdmap_path</span><br></pre></td></tr></tbody></table>

然后比较两个输入进行对比得到结果

## 相关链接

[Calculate data migration when changing the CRUSHmap](http://blog-fromsomedude.rhcloud.com/2017/01/19/Calculate-data-migration-when-changing-the-CRUSHmap/)  
[alram/crush\_data\_movement\_calculator.py](https://gist.github.com/alram/c6b1129a4c9100ab5184197d1455a6bd)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-02-08 |

Source: zphj1987@gmail ([预估ceph的迁移数据量](http://www.zphj1987.com/2017/02/08/%E9%A2%84%E4%BC%B0ceph%E7%9A%84%E8%BF%81%E7%A7%BB%E6%95%B0%E6%8D%AE%E9%87%8F/))
