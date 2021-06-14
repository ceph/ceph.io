---
title: "Freebsd10.2安装包升级pkg引起环境破坏的解决"
date: "2017-05-24"
author: "admin"
tags: 
  - "planet"
---

  
![](http://7xweck.com1.z0.glb.clouddn.com/brock.png?imageMogr2/thumbnail/!75p)  

## 前言

freebsd10.2环境在安装一个新软件包的时候提示升级pkg到1.10.1，然后点击了升级，然后整个pkg环境就无法使用了

## 记录

升级完了软件包以后第一个错误提示

> FreeBSD: /usr/local/lib/libpkg.so.3: Undefined symbol “utimensat”

这个是因为这个库是在freebsd的10.3当中才有的库，而我的环境是10.2的环境

### 网上有一个解决办法

更新源  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># cat /usr/local/etc/pkg/repos/FreeBSD.conf</span></span><br><span class="line">FreeBSD: {</span><br><span class="line">  url: <span class="string">"pkg+http://pkg.FreeBSD.org/<span class="variable">${ABI}</span>/release_2"</span>,</span><br><span class="line">  enabled: yes</span><br><span class="line">}</span><br></pre></td></tr></tbody></table>

检查当前版本  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># pkg --version</span></span><br><span class="line"><span class="number">1.10</span>.<span class="number">1</span></span><br></pre></td></tr></tbody></table>

更新缓存  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># pkg update</span></span><br></pre></td></tr></tbody></table>

卸载  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># pkg delete -f pkg</span></span><br></pre></td></tr></tbody></table>

重新安装  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># pkg install -y pkg</span></span><br><span class="line"><span class="comment"># pkg2ng</span></span><br></pre></td></tr></tbody></table>

检查版本  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># pkg --version</span></span><br><span class="line"><span class="number">1.5</span>.<span class="number">4</span></span><br></pre></td></tr></tbody></table>

这个在我的环境下没有生效

### 还有一个办法

有个pkg-static命令可以使用，，然后/var/cache/pkg里边缓存的包。执行命令：  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment"># pkg-static install -f /var/cache/pkg/pkg-1.5.4.txz</span></span><br><span class="line">``` </span><br><span class="line"></span><br><span class="line">这个在我的环境下报错</span><br><span class="line">```bash</span><br><span class="line">root@mkiso:/usr/ports/ports-mgmt/pkg <span class="comment"># pkg info sqlite3</span></span><br><span class="line">pkg: warning: database version <span class="number">34</span> is newer than libpkg(<span class="number">3</span>) version <span class="number">33</span>, but still compatible</span><br><span class="line">pkg: sqlite error <span class="keyword">while</span> executing INSERT OR ROLLBACK INTO pkg_search(id, name, origin) VALUES (?<span class="number">1</span>, ?<span class="number">2</span> || <span class="string">'-'</span> || ?<span class="number">3</span>, ?<span class="number">4</span>); <span class="keyword">in</span> file pkgdb.c:<span class="number">1544</span>: no such table: pkg_search</span><br></pre></td></tr></tbody></table>

这个在网上看到有很多人出现了

### 最终解决的办法

在邮件列表里面看到一个解决办法，我是用的这个办法解决了的  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#pkg shell</span></span><br></pre></td></tr></tbody></table>

进入交互模式,执行下面的操作  

<table><tbody><tr><td class="code"><pre><span class="line">CREATE VIRTUAL TABLE pkg_search USING fts4(id, name, origin);</span><br><span class="line">pragma user_version=<span class="number">33</span>;</span><br></pre></td></tr></tbody></table>

执行完了以后pkg 环境可用了

## 避免这个问题

锁定本机的pkg版本  

<table><tbody><tr><td class="code"><pre><span class="line">pkg lock pkg</span><br></pre></td></tr></tbody></table>

如果需要手动找包就是这个路径  

<table><tbody><tr><td class="code"><pre><span class="line">http://pkg.freebsd.org/FreeBSD:<span class="number">10</span>:amd64/</span><br></pre></td></tr></tbody></table>

我的机器最终版本是  

<table><tbody><tr><td class="code"><pre><span class="line"><span class="comment">#pkg -v</span></span><br><span class="line"><span class="number">1.8</span>.<span class="number">7</span></span><br></pre></td></tr></tbody></table>

## 参考资料

[freebsd pkg升级问题报错](http://www.07net01.com/2017/02/1816847.html)  
[FreeBSD: /usr/local/lib/libpkg.so.3: Undefined symbol “utimensat”](http://glasz.org/sheeplog/2017/02/freebsd-usrlocalliblibpkgso3-undefined-symbol-utimensat.html)  
[升级pkg失败, 安装低版本pkg失败](http://bbs.chinaunix.net/thread-4260263-1-1.html)  
[pkg database issue: database version 34 is newer than libpkg(3) version 33 ?](https://lists.freebsd.org/pipermail/freebsd-ports/2017-January/106799.html)

## 变更记录

| Why | Who | When |
| --- | --- | --- |
| 创建 | 武汉-运维-磨渣 | 2017-05-24 |

Source: zphj1987@gmail ([Freebsd10.2安装包升级pkg引起环境破坏的解决](http://www.zphj1987.com/2017/05/24/Freebsd-pkg-destroy/))
