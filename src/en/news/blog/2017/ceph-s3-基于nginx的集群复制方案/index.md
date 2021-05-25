---
title: "Ceph S3 基于NGINX的集群复制方案"
date: "2017-08-10"
author: "admin"
tags: 
  - "planet"
---

  
![](images/nginx.png)  

## 前言

ceph的s3数据的同步可以通过radosgw-agent进行同步，同region可以同步data和metadata，不同region只能同步metadata，这个地方可以参考下秦牧羊梳理的 [ceph radosgw 多集群同步部署流程](https://my.oschina.net/diluga/blog/391928)，本篇讲述的方案与radosgw-agent的复制方案不同在于,这个属于前端复制，后端相当于透明的两个相同集群，在入口层面就将数据进行了复制分流  
  
在某些场景下，需求可能比较简单：

- 需要数据能同时存储在两个集群当中
- 数据写一次，读多次
- 两个集群都能写

一方面两个集群可以增加数据的可靠性，另一方面可以提高读带宽，两个集群同时可以提供读的服务

radosgw-agent是从底层做的同步，正好看到秦牧羊有提到nginx新加入了ngx\_http\_mirror\_module 这个模块，那么本篇就尝试用这个模块来做几个简单的配置来实现上面的需求，这里纯架构的尝试，真正上生产还需要做大量的验证和修改的测试的

## 结构设想

![nginxs3.png-30.8kB](images/nginxs3.png)

当数据传到nginx的server的时候，nginx本地进行负载均衡到两个本地端口上面，本地的两个端口对应到两个集群上面,一个主写集群1，一个主写集群2，这个是最简结构，集群的civetweb可以是很多机器，nginx这个也可以是多台的机器，在一台上面之所以做个均衡是可以让两个集群是对等关系，而不是一个只用nginx写，另一个只mirror写

## 环境准备

准备两个完全独立的集群，分别配置一个s3的网关，我的环境为：  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="number">192.168</span>.<span class="number">19.101</span>:<span class="number">8080</span></span><br><span class="line"><span class="number">192.168</span>.<span class="number">19.102</span>:<span class="number">8080</span></span><br></pre></td></tr></tbody></table>

在每个机器上都创建一个管理员的账号，这个用于后面的通过restapi来进行管理的,其他的后面的操作都通过http来做能保证两个集群的数据是一致的

> nginx的机器在192.168.19.104

在两个集群当中都创建相同的管理用户  

<table><tbody><tr><td class="code"><pre><span class="line">radosgw-admin user create --uid=admin --display-name=admin --access_key=admin --secret=<span class="number">123456</span></span><br></pre></td></tr></tbody></table>

这里为了测试方便使用了简单密码

此时admin还仅仅是普通的权限，需要通过—cap添加user的capabilities，例如：  

<table><tbody><tr><td class="code"><pre><span class="line">radosgw-admin caps add --uid=admin --caps=<span class="string">"users=read, write"</span></span><br><span class="line">radosgw-admin caps add --uid=admin --caps=<span class="string">"usage=read, write"</span></span><br></pre></td></tr></tbody></table>

下面就用到了nginx的最新的模块了  
Nginx 1.13.4 发布，新增 ngx\_http\_mirror\_module 模块

软件下载：  

<table><tbody><tr><td class="code"><pre><span class="line">wget https://nginx.org/packages/mainline/centos/<span class="number">7</span>/x86_64/RPMS/nginx-<span class="number">1.13</span>.<span class="number">4</span>-<span class="number">1</span>.el7.ngx.x86_64.rpm</span><br></pre></td></tr></tbody></table>

下载rpm包然后安装  
安装：  

<table><tbody><tr><td class="code"><pre><span class="line">rpm -ivh nginx-<span class="number">1.13</span>.<span class="number">4</span>-<span class="number">1</span>.el7.ngx.x86_64.rpm</span><br></pre></td></tr></tbody></table>

修改nginx配置文件：  

<table><tbody><tr><td class="code"><pre><span class="line">upstream s3 {</span><br><span class="line">      server <span class="number">127.0</span>.<span class="number">0.1</span>:<span class="number">81</span>;</span><br><span class="line">      server <span class="number">127.0</span>.<span class="number">0.1</span>:<span class="number">82</span>;</span><br><span class="line">}</span><br><span class="line"></span><br><span class="line">server {</span><br><span class="line">    listen       <span class="number">81</span>;</span><br><span class="line">    server_name  localhost;</span><br><span class="line"></span><br><span class="line">    location / {</span><br><span class="line">    mirror /mirror;</span><br><span class="line">    proxy_pass http://<span class="number">192.168</span>.<span class="number">19.101</span>:<span class="number">8080</span>;</span><br><span class="line">    }</span><br><span class="line"></span><br><span class="line">    location /mirror {</span><br><span class="line">    internal;</span><br><span class="line">    proxy_pass http://<span class="number">192.168</span>.<span class="number">19.102</span>:<span class="number">8080</span><span class="variable">$request_uri</span>;</span><br><span class="line">    }</span><br><span class="line">}</span><br><span class="line"></span><br><span class="line">server {</span><br><span class="line">    listen       <span class="number">82</span>;</span><br><span class="line">    server_name  localhost;</span><br><span class="line">    </span><br><span class="line">    location / {</span><br><span class="line">    mirror /mirror;</span><br><span class="line">    proxy_pass http://<span class="number">192.168</span>.<span class="number">19.102</span>:<span class="number">8080</span>;</span><br><span class="line">    }</span><br><span class="line"></span><br><span class="line">    location /mirror {</span><br><span class="line">    internal;</span><br><span class="line">    proxy_pass http://<span class="number">192.168</span>.<span class="number">19.101</span>:<span class="number">8080</span><span class="variable">$request_uri</span>;</span><br><span class="line">    }</span><br><span class="line">}</span><br><span class="line">server{</span><br><span class="line">    listen <span class="number">80</span>;</span><br><span class="line">    location / {</span><br><span class="line">        proxy_pass         http://s3;</span><br><span class="line">    }</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

负载均衡的设置有很多种，这里用最简单的轮训的模式，想配置其他负载均衡模式可以参考我的[这篇文章](http://www.zphj1987.com/2015/03/22/%E5%85%B3%E4%BA%8Enginx-upstream%E7%9A%84%E5%87%A0%E7%A7%8D%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F/)

重启进程并检查服务  

<table><tbody><tr><td class="code"><pre><span class="line">[root@node04 ~]<span class="comment"># systemctl restart nginx</span></span><br><span class="line">[root@node04 ~]<span class="comment"># netstat -tunlp|grep nginx</span></span><br><span class="line">tcp        <span class="number">0</span>      <span class="number">0</span> <span class="number">0.0</span>.<span class="number">0.0</span>:<span class="number">80</span>              <span class="number">0.0</span>.<span class="number">0.0</span>:*               LISTEN      <span class="number">1582973</span>/nginx: mast </span><br><span class="line">tcp        <span class="number">0</span>      <span class="number">0</span> <span class="number">0.0</span>.<span class="number">0.0</span>:<span class="number">81</span>              <span class="number">0.0</span>.<span class="number">0.0</span>:*               LISTEN      <span class="number">1582973</span>/nginx: mast </span><br><span class="line">tcp        <span class="number">0</span>      <span class="number">0</span> <span class="number">0.0</span>.<span class="number">0.0</span>:<span class="number">82</span>              <span class="number">0.0</span>.<span class="number">0.0</span>:*               LISTEN      <span class="number">1582973</span>/nginx: mast</span><br></pre></td></tr></tbody></table>

整个环境就配置完成了，下面我们就来验证下这个配置的效果是什么样的，下面会提供几个s3用户的相关的脚本

## s3用户相关脚本

### 创建用户的脚本

<table><tbody><tr><td class="code"><pre><span class="line"><span class="shebang">#!/bin/bash</span></span><br><span class="line"><span class="comment">###</span></span><br><span class="line"><span class="comment">#S3 USER ADMIN </span></span><br><span class="line"><span class="comment">###</span></span><br><span class="line"></span><br><span class="line"><span class="comment">###==============WRITE BEGIN=============###</span></span><br><span class="line">ACCESS_KEY=admin <span class="comment">## ADMIN_USER_TOKEN</span></span><br><span class="line">SECRET_KEY=<span class="number">123456</span> <span class="comment">## ADMIN_USER_SECRET</span></span><br><span class="line">HOST=<span class="number">192.168</span>.<span class="number">19.104</span>:<span class="number">80</span></span><br><span class="line">USER_ACCESS_KEY=<span class="string">"&amp;access-key=user1"</span></span><br><span class="line">USER_SECRET_KEY=<span class="string">"&amp;secret-key=123456"</span></span><br><span class="line"><span class="comment">###==============WRITE  FINAL=======FINAL=====###</span></span><br><span class="line"></span><br><span class="line">query2=admin/user</span><br><span class="line">userid=<span class="variable">$1</span></span><br><span class="line">name=<span class="variable">$2</span></span><br><span class="line">uid=<span class="string">"&amp;uid="</span></span><br><span class="line">date=`TZ=GMT LANG=en_US date <span class="string">"+%a, %d %b %Y %H:%M:%S GMT"</span>`</span><br><span class="line">header=<span class="string">"PUTnnn<span class="variable">${date}</span>n/<span class="variable">${query2}</span>"</span></span><br><span class="line">sig=$(<span class="built_in">echo</span> -en <span class="variable">${header}</span> | openssl sha1 -hmac <span class="variable">${SECRET_KEY}</span> -binary | base64)</span><br><span class="line">curl -v -H <span class="string">"Date: <span class="variable">${date}</span>"</span> -H <span class="string">"Authorization: AWS <span class="variable">${ACCESS_KEY}</span>:<span class="variable">${sig}</span>"</span> -L -X PUT <span class="string">"http://<span class="variable">${HOST}</span>/<span class="variable">${query2}</span>?format=json<span class="variable">${uid}</span><span class="variable">${userid}</span>&amp;display-name=<span class="variable">${name}</span><span class="variable">${USER_ACCESS_KEY}</span><span class="variable">${USER_SECRET_KEY}</span>"</span> -H <span class="string">"Host: <span class="variable">${HOST}</span>"</span></span><br><span class="line"><span class="built_in">echo</span> <span class="string">""</span></span><br></pre></td></tr></tbody></table>

运行脚本：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@node01 ~]<span class="comment"># sh  addusernew.sh user1 USER1</span></span><br><span class="line">* About to connect() to <span class="number">192.168</span>.<span class="number">19.104</span> port <span class="number">80</span> (<span class="comment">#0)</span></span><br><span class="line">*   Trying <span class="number">192.168</span>.<span class="number">19.104</span>...</span><br><span class="line">* Connected to <span class="number">192.168</span>.<span class="number">19.104</span> (<span class="number">192.168</span>.<span class="number">19.104</span>) port <span class="number">80</span> (<span class="comment">#0)</span></span><br><span class="line">&gt; PUT /admin/user?format=json&amp;uid=user1&amp;display-name=USER1&amp;access-key=user1&amp;secret-key=<span class="number">123456</span> HTTP/<span class="number">1.1</span></span><br><span class="line">&gt; User-Agent: curl/<span class="number">7.29</span>.<span class="number">0</span></span><br><span class="line">&gt; Accept: */*</span><br><span class="line">&gt; Date: Wed, <span class="number">09</span> Aug <span class="number">2017</span> <span class="number">07</span>:<span class="number">51</span>:<span class="number">58</span> GMT</span><br><span class="line">&gt; Authorization: AWS admin:wuqQUUXhhar5nQS5D5B14Dpx+Rw=</span><br><span class="line">&gt; Host: <span class="number">192.168</span>.<span class="number">19.104</span>:<span class="number">80</span></span><br><span class="line">&gt; </span><br><span class="line">&lt; HTTP/<span class="number">1.1</span> <span class="number">200</span> OK</span><br><span class="line">&lt; Server: nginx/<span class="number">1.13</span>.<span class="number">4</span></span><br><span class="line">&lt; Date: Wed, <span class="number">09</span> Aug <span class="number">2017</span> <span class="number">07</span>:<span class="number">51</span>:<span class="number">58</span> GMT</span><br><span class="line">&lt; Content-Type: application/json</span><br><span class="line">&lt; Content-Length: <span class="number">195</span></span><br><span class="line">&lt; Connection: keep-alive</span><br><span class="line">&lt; </span><br><span class="line">* Connection <span class="comment">#0 to host 192.168.19.104 left intact</span></span><br><span class="line">{<span class="string">"user_id"</span>:<span class="string">"user1"</span>,<span class="string">"display_name"</span>:<span class="string">"USER1"</span>,<span class="string">"email"</span>:<span class="string">""</span>,<span class="string">"suspended"</span>:<span class="number">0</span>,<span class="string">"max_buckets"</span>:<span class="number">1000</span>,<span class="string">"subusers"</span>:[],<span class="string">"keys"</span>:[{<span class="string">"user"</span>:<span class="string">"user1"</span>,<span class="string">"access_key"</span>:<span class="string">"user1"</span>,<span class="string">"secret_key"</span>:<span class="string">"123456"</span>}],<span class="string">"swift_keys"</span>:[],<span class="string">"caps"</span>:[]}</span><br></pre></td></tr></tbody></table>

在两个集群中检查：  
![usercreate.png-36.5kB](images/usercreate.png)

可以看到两个集群当中都产生了相同的用户信息

### 修改用户

直接把上面的创建脚本里面的PUT改成POST就是修改用户的脚本

### 删除用户脚本

<table><tbody><tr><td class="code"><pre><span class="line"><span class="shebang">#!/bin/bash</span></span><br><span class="line"><span class="comment">###</span></span><br><span class="line"><span class="comment">#S3 USER ADMIN</span></span><br><span class="line"><span class="comment">###</span></span><br><span class="line"></span><br><span class="line"><span class="comment">###==============WRITE BEGIN=============###</span></span><br><span class="line">ACCESS_KEY=admin <span class="comment">## ADMIN_USER_TOKEN</span></span><br><span class="line">SECRET_KEY=<span class="number">123456</span> <span class="comment">## ADMIN_USER_SECRET</span></span><br><span class="line">HOST=<span class="number">192.168</span>.<span class="number">19.104</span>:<span class="number">80</span></span><br><span class="line"><span class="comment">###==============WRITE  FINAL=======FINAL=====###</span></span><br><span class="line"></span><br><span class="line">query2=admin/user</span><br><span class="line">userid=<span class="variable">$1</span></span><br><span class="line">uid=<span class="string">"&amp;uid="</span></span><br><span class="line">date=`TZ=GMT LANG=en_US date <span class="string">"+%a, %d %b %Y %H:%M:%S GMT"</span>`</span><br><span class="line">header=<span class="string">"DELETEnnn<span class="variable">${date}</span>n/<span class="variable">${query2}</span>"</span></span><br><span class="line">sig=$(<span class="built_in">echo</span> -en <span class="variable">${header}</span> | openssl sha1 -hmac <span class="variable">${SECRET_KEY}</span> -binary | base64)</span><br><span class="line">curl -v -H <span class="string">"Date: <span class="variable">${date}</span>"</span> -H <span class="string">"Authorization: AWS <span class="variable">${ACCESS_KEY}</span>:<span class="variable">${sig}</span>"</span> -L -X DELETE <span class="string">"http://<span class="variable">${HOST}</span>/<span class="variable">${query2}</span>?format=json<span class="variable">${uid}</span><span class="variable">${userid}</span>"</span> -H <span class="string">"Host: <span class="variable">${HOST}</span>"</span></span><br><span class="line"><span class="built_in">echo</span> <span class="string">""</span></span><br></pre></td></tr></tbody></table>

执行删除用户：  

<table><tbody><tr><td class="code"><pre><span class="line">[root@node01 ~]<span class="comment"># sh deluser.sh user1</span></span><br></pre></td></tr></tbody></table>

![deluser.png-6.3kB](images/deluser.png)

可以看到两边都删除了

### 获取用户的信息脚本

<table><tbody><tr><td class="code"><pre><span class="line"><span class="shebang">#! /bin/sh</span></span><br><span class="line"><span class="comment">###</span></span><br><span class="line"><span class="comment">#S3 USER ADMIN </span></span><br><span class="line"><span class="comment">###</span></span><br><span class="line"></span><br><span class="line"><span class="comment">###==============WRITE BEGIN=============###</span></span><br><span class="line">ACCESS_KEY=admin <span class="comment">## ADMIN_USER_TOKEN</span></span><br><span class="line">SECRET_KEY=<span class="number">123456</span> <span class="comment">## ADMIN_USER_SECRET</span></span><br><span class="line">HOST=<span class="number">192.168</span>.<span class="number">19.101</span>:<span class="number">8080</span></span><br><span class="line"><span class="comment">###==============WRITE  FINAL=======FINAL=====###</span></span><br><span class="line"></span><br><span class="line">query2=admin/user</span><br><span class="line">userid=<span class="variable">$1</span></span><br><span class="line">uid=<span class="string">"&amp;uid="</span></span><br><span class="line">date=`TZ=GMT LANG=en_US date <span class="string">"+%a, %d %b %Y %H:%M:%S GMT"</span>`</span><br><span class="line">header=<span class="string">"GETnnn<span class="variable">${date}</span>n/<span class="variable">${query2}</span>"</span></span><br><span class="line">sig=$(<span class="built_in">echo</span> -en <span class="variable">${header}</span> | openssl sha1 -hmac <span class="variable">${SECRET_KEY}</span> -binary | base64)</span><br><span class="line">curl -v -H <span class="string">"Date: <span class="variable">${date}</span>"</span> -H <span class="string">"Authorization: AWS <span class="variable">${ACCESS_KEY}</span>:<span class="variable">${sig}</span>"</span> -L -X GET <span class="string">"http://<span class="variable">${HOST}</span>/<span class="variable">${query2}</span>?format=json<span class="variable">${uid}</span><span class="variable">${userid}</span>&amp;display-name=<span class="variable">${name}</span>"</span>  -H <span class="string">"Host: <span class="variable">${HOST}</span>"</span></span><br></pre></td></tr></tbody></table>

### 测试上传一个文件

通过192.168.19.104:80端口上传一个文件，然后通过nginx的端口，以及两个集群的端口进行查看

![same.png-24.6kB](images/same.png)

可以看到在上传一次的情况下，两个集群里面同时拥有了这个文件

## 总结

真正将方案运用到生产还需要做大量的验证测试，中间的失效处理，以及是否可以将写镜像，读取的时候不镜像，这些都需要进一步做相关的验证工作

本篇中的S3用户的管理接口操作参考了网上的其他资料

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-08-10 |

Source: zphj1987@gmail ([Ceph S3 基于NGINX的集群复制方案](http://www.zphj1987.com/2017/08/10/Ceph-S3-nginx-mirror/))
