---
title: "Docker Containers in Just 10 Commands"
date: "2015-05-31"
author: "syndicated"
tags: 
---

![Docker container in 10 commands](images/docker.png "Docker container in 10 commands")

If you are on this page, then you definately know what is Docker , i will not take your time with the introduction part.

## Lets do Docker !!!

- Install docker packages on your Linux host , in my case its CentOS.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># yum install -y docker-io</span>
</span></code></pre></td></tr></tbody></table>

- Start Docker service and enable it as a startup process.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># service docker start ; chkconfig docker on</span>
</span></code></pre></td></tr></tbody></table>

- Docker pull CentOS image

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># docker pull centos:latest</span>
</span></code></pre></td></tr></tbody></table>

- Check docker images

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c"># docker images</span>
</span><span class="line">REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
</span><span class="line">docker.io/centos    latest              fd44297e2ddb        <span class="m">5</span> weeks ago         215.7 MB
</span><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

- Create Docker container

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c"># docker create -ti --name="mona" centos bash</span>
</span><span class="line">c7f9eb6b32eba38242b9d9ced309314f8eee720dbf29c656885aa0cbfff15aa6
</span><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

- Start your docker container

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># docker start mona</span>
</span></code></pre></td></tr></tbody></table>

- Get IP address of your newly created docker container

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c"># docker inspect mona | grep -i ipaddress</span>
</span><span class="line">        <span class="s2">"IPAddress"</span>: <span class="s2">"172.17.0.1"</span>,
</span><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

- Attach (login) to your docker container

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
<span class="line-number">11</span>
<span class="line-number">12</span>
<span class="line-number">13</span>
<span class="line-number">14</span>
<span class="line-number">15</span>
<span class="line-number">16</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c"># docker attach mona</span>
</span><span class="line">
</span><span class="line"><span class="o">[</span>root@c7f9eb6b32eb /<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@c7f9eb6b32eb /<span class="o">]</span><span class="c"># cat /etc/redhat-release</span>
</span><span class="line">CentOS Linux release 7.1.1503 <span class="o">(</span>Core<span class="o">)</span>
</span><span class="line"><span class="o">[</span>root@c7f9eb6b32eb /<span class="o">]</span><span class="c"># df -h</span>
</span><span class="line">Filesystem                                                                                          Size  Used Avail Use% Mounted on
</span><span class="line">/dev/mapper/docker-253:1-16852579-c7f9eb6b32eba38242b9d9ced309314f8eee720dbf29c656885aa0cbfff15aa6  9.8G  268M  9.0G   3% /
</span><span class="line">tmpfs                                                                                               1.6G     <span class="m">0</span>  1.6G   0% /dev
</span><span class="line">shm                                                                                                  64M     <span class="m">0</span>   64M   0% /dev/shm
</span><span class="line">tmpfs                                                                                               1.6G     <span class="m">0</span>  1.6G   0% /run
</span><span class="line">tmpfs                                                                                               1.6G     <span class="m">0</span>  1.6G   0% /tmp
</span><span class="line">/dev/vda1                                                                                            10G  1.6G  8.5G  16% /etc/hosts
</span><span class="line">tmpfs                                                                                               1.6G     <span class="m">0</span>  1.6G   0% /run/secrets
</span><span class="line">tmpfs                                                                                               1.6G     <span class="m">0</span>  1.6G   0% /proc/kcore
</span><span class="line"><span class="o">[</span>root@c7f9eb6b32eb /<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

To detach from docker container use **_ctrl+p+q_** , avoid using **exit** command as it will stop container and exit.

- List container

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c"># docker ps</span>
</span><span class="line">CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
</span><span class="line">c7f9eb6b32eb        centos:latest       <span class="s2">"bash"</span>              <span class="m">9</span> minutes ago       Up <span class="m">28</span> seconds                           mona
</span><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

- Stop and destroy container

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c"># docker stop mona ; docker kill mona</span>
</span><span class="line">mona
</span><span class="line">mona
</span><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c">#</span>
</span><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c"># docker ps</span>
</span><span class="line">CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
</span><span class="line"><span class="o">[</span>root@karan-ws ~<span class="o">]</span><span class="c">#</span>
</span></code></pre></td></tr></tbody></table>

> These are elementary basic docker operations that you can perform to take a feel of Docker Container technology. In future posts i will cover more advance docker topics. Stay Tuned !!!
