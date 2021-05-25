---
title: "使用日志系统graylog获取Ceph集群状态"
date: "2017-06-09"
author: "admin"
tags: 
  - "planet"
---

  
![](images/graylog.png)  

## 前言

在看集群的配置文件的时候看到ceph里面有一个graylog的输出选择，目前看到的是可以收集mon日志和clog，osd单个的日志没有看到，Elasticsearch有整套的日志收集系统，可以很方便的将所有日志汇总到一起，这个graylog的收集采用的是自有的udp协议，从配置上来说可以很快的完成，这里只做一个最基本的实践  

## 系统实践

graylog日志系统主要由三个组件组成的

- MongoDB – 存储配置信息和一些元数据信息的，MongoDB (>= 2.4)
- Elasticsearch – 用来存储Graylog server收取的log messages的，Elasticsearch (>= 2.x)
- Graylog server – 用来解析日志的并且提供内置的web的访问接口

配置好基础源文件

> CentOS-Base.repo  
> epel.repo

### 安装java

要求版本Java (>= 8)  

<table><tbody><tr><td class="code"><pre><span class="line">yum install java-<span class="number">1.8</span>.<span class="number">0</span>-openjdk</span><br></pre></td></tr></tbody></table>

### 安装MongoDB

安装软件  

<table><tbody><tr><td class="code"><pre><span class="line">yum install mongodb mongodb-server</span><br></pre></td></tr></tbody></table>

启动服务并且加入自启动  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl restart mongod</span><br><span class="line">systemctl <span class="built_in">enable</span> mongod</span><br></pre></td></tr></tbody></table>

安装完成检查服务启动端口  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># netstat -tunlp|grep 27017</span></span><br><span class="line">tcp        <span class="number">0</span>      <span class="number">0</span> <span class="number">127.0</span>.<span class="number">0.1</span>:<span class="number">27017</span>         <span class="number">0.0</span>.<span class="number">0.0</span>:*               LISTEN      <span class="number">151840</span>/mongod</span><br></pre></td></tr></tbody></table>

### 安装Elasticsearch

倒入认证文件  

<table><tbody><tr><td class="code"><pre><span class="line">rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch</span><br></pre></td></tr></tbody></table>

添加源文件  

<table><tbody><tr><td class="code"><pre><span class="line">vim /etc/yum.repos.d/elasticsearch.repo</span><br><span class="line">添加</span><br><span class="line">[elasticsearch-<span class="number">2</span>.x]</span><br><span class="line">name=Elasticsearch repository <span class="keyword">for</span> <span class="number">2</span>.x packages</span><br><span class="line">baseurl=https://packages.elastic.co/elasticsearch/<span class="number">2</span>.x/centos</span><br><span class="line">gpgcheck=<span class="number">1</span></span><br><span class="line">gpgkey=https://packages.elastic.co/GPG-KEY-elasticsearch</span><br><span class="line">enabled=<span class="number">1</span></span><br></pre></td></tr></tbody></table>

安装elasticsearch包  

<table><tbody><tr><td class="code"><pre><span class="line">yum install elasticsearch</span><br></pre></td></tr></tbody></table>

配置自启动  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl <span class="built_in">enable</span> elasticsearch</span><br></pre></td></tr></tbody></table>

修改配置文件  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># vim /etc/elasticsearch/elasticsearch.yml</span></span><br><span class="line"></span><br><span class="line">cluster.name: graylog</span><br></pre></td></tr></tbody></table>

重启服务  

<table><tbody><tr><td class="code"><pre><span class="line">systemctl restart  elasticsearch</span><br></pre></td></tr></tbody></table>

检查运行服务端口  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># netstat -tunlp|grep java</span></span><br><span class="line">tcp        <span class="number">0</span>      <span class="number">0</span> <span class="number">127.0</span>.<span class="number">0.1</span>:<span class="number">9200</span>          <span class="number">0.0</span>.<span class="number">0.0</span>:*               LISTEN      <span class="number">154116</span>/java </span><br><span class="line">tcp        <span class="number">0</span>      <span class="number">0</span> <span class="number">127.0</span>.<span class="number">0.1</span>:<span class="number">9300</span>          <span class="number">0.0</span>.<span class="number">0.0</span>:*               LISTEN      <span class="number">154116</span>/java</span><br></pre></td></tr></tbody></table>

检查elasticsearch状态  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment">#  curl -X GET http://localhost:9200</span></span><br><span class="line">{</span><br><span class="line">  <span class="string">"name"</span> : <span class="string">"Vibro"</span>,</span><br><span class="line">  <span class="string">"cluster_name"</span> : <span class="string">"graylog"</span>,</span><br><span class="line">  <span class="string">"cluster_uuid"</span> : <span class="string">"11Y2GOTmQ9ynNbTlruFcyA"</span>,</span><br><span class="line">  <span class="string">"version"</span> : {</span><br><span class="line">    <span class="string">"number"</span> : <span class="string">"2.4.5"</span>,</span><br><span class="line">    <span class="string">"build_hash"</span> : <span class="string">"c849dd13904f53e63e88efc33b2ceeda0b6a1276"</span>,</span><br><span class="line">    <span class="string">"build_timestamp"</span> : <span class="string">"2017-04-24T16:18:17Z"</span>,</span><br><span class="line">    <span class="string">"build_snapshot"</span> : <span class="literal">false</span>,</span><br><span class="line">    <span class="string">"lucene_version"</span> : <span class="string">"5.5.4"</span></span><br><span class="line">  },</span><br><span class="line">  <span class="string">"tagline"</span> : <span class="string">"You Know, for Search"</span></span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># curl -XGET 'http://localhost:9200/_cluster/health?pretty=true'</span></span><br><span class="line">{</span><br><span class="line">  <span class="string">"cluster_name"</span> : <span class="string">"graylog"</span>,</span><br><span class="line">  <span class="string">"status"</span> : <span class="string">"green"</span>,</span><br></pre></td></tr></tbody></table>

状态应该是green

### 安装graylog

安装源  

<table><tbody><tr><td class="code"><pre><span class="line">rpm -Uvh https://packages.graylog2.org/repo/packages/graylog-<span class="number">2.2</span>-repository_latest.rpm</span><br></pre></td></tr></tbody></table>

安装软件包  

<table><tbody><tr><td class="code"><pre><span class="line">yum install graylog-server pwgen</span><br></pre></td></tr></tbody></table>

生成password\_secret  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># pwgen -N 1 -s 96</span></span><br><span class="line">DoqTYuvQPHaNW6XGFj5jru3FH8qxMjehj7Xk9OaVxhxaLYphF871CyiCMOKuAsHsJc0DtUUkK3ioFeqYo73mkMDUN7YklqgS</span><br></pre></td></tr></tbody></table>

在配置文件/etc/graylog/server/server.conf中password\_secret填上上面的输出

生成root\_password\_sha2（后面生成的-不需要）  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># echo -n 123456 |shasum -a 256</span></span><br><span class="line"><span class="number">8</span>d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92  -</span><br></pre></td></tr></tbody></table>

123456是我设置的密码  
在配置文件/etc/graylog/server/server.conf中root\_password\_sha2填上上面的输出

设置时区  

<table><tbody><tr><td class="code"><pre><span class="line">root_timezone = Asia/Shanghai</span><br></pre></td></tr></tbody></table>

配置web监听端口  

<table><tbody><tr><td class="code"><pre><span class="line">rest_listen_uri = http://<span class="number">192.168</span>.<span class="number">10.2</span>:<span class="number">9000</span>/api/</span><br><span class="line">web_listen_uri = http://<span class="number">192.168</span>.<span class="number">10.2</span>:<span class="number">9000</span>/</span><br></pre></td></tr></tbody></table>

这里注意写上你的web准备使用的那个网卡的IP地址，不要全局监听

启动服务并配置自启动  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># systemctl restart graylog-server</span></span><br><span class="line">[root@lab102 ~]<span class="comment"># systemctl enable graylog-server</span></span><br></pre></td></tr></tbody></table>

检查服务端口  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># netstat -tunlp|grep 9000</span></span><br><span class="line">tcp        <span class="number">0</span>      <span class="number">0</span> <span class="number">192.168</span>.<span class="number">10.2</span>:<span class="number">9000</span>       <span class="number">0.0</span>.<span class="number">0.0</span>:*               LISTEN      <span class="number">160129</span>/java</span><br></pre></td></tr></tbody></table>

### 使用web进行访问

使用地址[http://192.168.10.2:9000进行访问](http://192.168.10.2:9000进行访问)  
![image.png-312kB](images/image.png)  
用户名admin  
密码123456

![image.png-69.9kB](images/image.png)  
进来就是引导界面，这个地方是  

<table><tbody><tr><td class="code"><pre><span class="line">1、把日志发送到graylog</span><br><span class="line">2、对收集到的数据做点搜索</span><br><span class="line">3、创建一个图表</span><br><span class="line">4、创建告警</span><br></pre></td></tr></tbody></table>

到这里配置graylog平台的基础工作就完成了，现在看下怎么跟ceph对接

![image.png-38.6kB](images/image.png)

## 配置ceph的支持

日志从ceph里面输出是采用的GELF UDP方式的

GELF is Graylog2 的json格式的数据，内部采用键值对的方式，ceoh内部传输出来的数据不光有message还有下面的

- hostname
- thread id
- priority
- subsystem name and id
- fsid

![image.png-68.5kB](images/image.png)

选择GELF UDP协议

![image.png-77.1kB](images/image.png)

选择节点，配置监听端口为12291，保存

在lab102上检查端口的监听情况  

<table><tbody><tr><td class="code"><pre><span class="line">[root@lab102 ~]<span class="comment"># netstat -tunlp|grep 12201</span></span><br><span class="line">udp        <span class="number">0</span>      <span class="number">0</span> <span class="number">0.0</span>.<span class="number">0.0</span>:<span class="number">12201</span>           <span class="number">0.0</span>.<span class="number">0.0</span>:*                           <span class="number">160129</span>/java</span><br></pre></td></tr></tbody></table>

可以看到已经监听好了

修改ceph的配置文件  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#log_to_graylog = true</span></span><br><span class="line"><span class="comment">#err_to_graylog = true</span></span><br><span class="line"><span class="comment">#log_graylog_host = 192.168.10.2</span></span><br><span class="line"><span class="comment">#log_graylog_port = 12201</span></span><br><span class="line">clog_to_graylog = <span class="literal">true</span></span><br><span class="line">clog_to_graylog_host = <span class="number">192.168</span>.<span class="number">10.2</span></span><br><span class="line">clog_to_graylog_port = <span class="number">12201</span></span><br><span class="line">mon_cluster_<span class="built_in">log</span>_to_graylog = <span class="literal">true</span></span><br><span class="line">mon_cluster_<span class="built_in">log</span>_to_graylog_host = <span class="number">192.168</span>.<span class="number">10.2</span></span><br><span class="line">mon_cluster_<span class="built_in">log</span>_to_graylog_port = <span class="number">12201</span></span><br></pre></td></tr></tbody></table>

ceph.conf当中跟graylog有关的就是这些配置文件了，配置好端口是刚刚监听的那个udp端口，然后重启ceph服务，这里我只需要mon\_cluster日志和clog，这个根据自己的需要选择

![image.png-199.9kB](images/image.png)

可以看到ceph -w的输出都可以在这个里面查询了

### 配置告警

![image.png-128.7kB](images/image.png)  
出现异常的时候  
![image.png-62.2kB](images/image.png)

## 总结

这个系统通过原生的支持把日志输出到这个日志系统，未来这个原生的日志应该可以输出更多的日志信息到这套系统当中，这样相当于有了一个日志搜索系统了，当然还有很多其他的方案，从功能完整性来说Elasticsearch要比这个强大，这个目前来看配置是非常的简单

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-06-09 |

Source: zphj1987@gmail ([使用日志系统graylog获取Ceph集群状态](http://www.zphj1987.com/2017/06/09/use-graylog-get-Ceph-status/))
