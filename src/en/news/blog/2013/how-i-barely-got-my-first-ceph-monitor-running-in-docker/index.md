---
title: "How I barely got my first Ceph monitor running in Docker"
date: "2013-09-19"
author: "shan"
tags: 
  - "planet"
---

![](images/docker-ceph-mon.jpg "Your first ceph-mon with Docker")

Docker is definitely the new trend. Thus I quickly wanted to try to put a Ceph monitor inside a Docker container. Story of a tough journey…

  

First let’s start with the DockerFile, this makes the setup easy and repeatable by anybody:

```
FROM    ubuntu:latest
MAINTAINER Sebastien Han <han.sebastien@gmail.com>

# Hack for initctl not being available in Ubuntu
RUN dpkg-divert --local --rename --add /sbin/initctl
RUN ln -s /bin/true /sbin/initctl

# Repo and packages
RUN echo deb http://archive.ubuntu.com/ubuntu precise main | tee /etc/apt/sources.list
RUN echo deb http://archive.ubuntu.com/ubuntu precise-updates main | tee -a /etc/apt/sources.list
RUN echo deb http://archive.ubuntu.com/ubuntu precise universe | tee -a /etc/apt/sources.list
RUN echo deb http://archive.ubuntu.com/ubuntu precise-updates universe | tee -a /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y --force-yes wget lsb-release sudo

# Fake a fuse install otherwise ceph won't get installed
RUN apt-get install libfuse2
RUN cd /tmp ; apt-get download fuse
RUN cd /tmp ; dpkg-deb -x fuse_* .
RUN cd /tmp ; dpkg-deb -e fuse_*
RUN cd /tmp ; rm fuse_*.deb
RUN cd /tmp ; echo -en '#!/bin/bash\nexit 0\n' > DEBIAN/postinst
RUN cd /tmp ; dpkg-deb -b . /fuse.deb
RUN cd /tmp ; dpkg -i /fuse.deb

# Install Ceph
CMD wget -q -O- 'https://ceph.com/git/?p=ceph.git;a=blob_plain;f=keys/release.asc' | apt-key add -
RUN echo deb http://ceph.com/debian-dumpling/ $(lsb_release -sc) main | tee /etc/apt/sources.list.d/ceph-dumpling.list
RUN apt-get update
RUN apt-get install -y --force-yes ceph ceph-deploy

# Avoid host resolution error from ceph-deploy
RUN echo ::1    ceph-mon | tee /etc/hosts

# Deploy the monitor
RUN ceph-deploy new ceph-mon

EXPOSE 6789
```

Then build the image:

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
<span class="line-number">17</span>
<span class="line-number">18</span>
<span class="line-number">19</span>
<span class="line-number">20</span>
<span class="line-number">21</span>
<span class="line-number">22</span>
<span class="line-number">23</span>
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo docker build -t leseb/ceph-mon .
</span><span class="line">...
</span><span class="line">...
</span><span class="line">...
</span><span class="line"> ---&gt; 113b00f4dc3a
</span><span class="line">Step 23 : RUN <span class="nb">echo</span> ::1    ceph-mon | tee /etc/hosts
</span><span class="line"> ---&gt; Running in 1f67db0c963a
</span><span class="line">::1 ceph-mon
</span><span class="line"> ---&gt; 556d638a365b
</span><span class="line">Step 24 : RUN ceph-deploy new ceph-mon
</span><span class="line"> ---&gt; Running in 547e61297891
</span><span class="line">/usr/lib/python2.7/dist-packages/pushy/transport/ssh.py:323: UserWarning: No paramiko or native ssh transport
</span><span class="line">  warnings.warn<span class="o">(</span><span class="s2">"No paramiko or native ssh transport"</span><span class="o">)</span>
</span><span class="line"><span class="o">[</span>ceph_deploy.new<span class="o">][</span>DEBUG <span class="o">]</span> Creating new cluster named ceph
</span><span class="line"><span class="o">[</span>ceph_deploy.new<span class="o">][</span>DEBUG <span class="o">]</span> Resolving host ceph-mon
</span><span class="line"><span class="o">[</span>ceph_deploy.new<span class="o">][</span>DEBUG <span class="o">]</span> Monitor ceph-mon at ::1
</span><span class="line"><span class="o">[</span>ceph_deploy.new<span class="o">][</span>DEBUG <span class="o">]</span> Monitor initial members are <span class="o">[</span><span class="s1">'ceph-mon'</span><span class="o">]</span>
</span><span class="line"><span class="o">[</span>ceph_deploy.new<span class="o">][</span>DEBUG <span class="o">]</span> Monitor addrs are <span class="o">[</span><span class="s1">'::1'</span><span class="o">]</span>
</span><span class="line"><span class="o">[</span>ceph_deploy.new<span class="o">][</span>DEBUG <span class="o">]</span> Creating a random mon key...
</span><span class="line"><span class="o">[</span>ceph_deploy.new<span class="o">][</span>DEBUG <span class="o">]</span> Writing initial config to ceph.conf...
</span><span class="line"><span class="o">[</span>ceph_deploy.new<span class="o">][</span>DEBUG <span class="o">]</span> Writing monitor keyring to ceph.mon.keyring...
</span><span class="line"> ---&gt; 2b087f2f3ead
</span><span class="line">Step 25 : EXPOSE 6789
</span><span class="line"> ---&gt; Running in 0c174fbe7a5b
</span><span class="line"> ---&gt; 460e2d2c900a
</span><span class="line">Successfully built 460e2d2c900a
</span></code></pre></td></tr></tbody></table>

Now we almost have th full image, we just need to instruct Docker to install the monitor. For this, we simply run the image that we just created and we pass the command that creates the monitor:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>docker run -d -h<span class="o">=</span><span class="s2">"ceph-mon"</span> leseb/ceph-mon ceph-deploy --overwrite-conf mon create ceph-mon
</span><span class="line">e2f48f3cca26
</span></code></pre></td></tr></tbody></table>

Check if it works properly:

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
<span class="line-number">17</span>
<span class="line-number">18</span>
<span class="line-number">19</span>
<span class="line-number">20</span>
<span class="line-number">21</span>
<span class="line-number">22</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>docker logs e2f48f3cca26
</span><span class="line">/usr/lib/python2.7/dist-packages/pushy/transport/ssh.py:323: UserWarning: No paramiko or native ssh transport
</span><span class="line">  warnings.warn<span class="o">(</span><span class="s2">"No paramiko or native ssh transport"</span><span class="o">)</span>
</span><span class="line"><span class="o">[</span>ceph_deploy.mon<span class="o">][</span>DEBUG <span class="o">]</span> Deploying mon, cluster ceph hosts ceph-mon
</span><span class="line"><span class="o">[</span>ceph_deploy.mon<span class="o">][</span>DEBUG <span class="o">]</span> detecting platform <span class="k">for </span>host ceph-mon ...
</span><span class="line"><span class="o">[</span>ceph_deploy.mon<span class="o">][</span>INFO  <span class="o">]</span> distro info: Ubuntu 12.04 precise
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>DEBUG <span class="o">]</span> deploying mon to ceph-mon
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>DEBUG <span class="o">]</span> remote hostname: ceph-mon
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> write cluster configuration to /etc/ceph/<span class="o">{</span>cluster<span class="o">}</span>.conf
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> creating path: /var/lib/ceph/mon/ceph-ceph-mon
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>DEBUG <span class="o">]</span> checking <span class="k">for done </span>path: /var/lib/ceph/mon/ceph-ceph-mon/done
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>DEBUG <span class="o">]</span> <span class="k">done </span>path does not exist: /var/lib/ceph/mon/ceph-ceph-mon/done
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> creating keyring file: /var/lib/ceph/tmp/ceph-ceph-mon.mon.keyring
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> create the monitor keyring file
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> Running <span class="nb">command</span>: ceph-mon --cluster ceph --mkfs -i ceph-mon --keyring /var/lib/ceph/tmp/ceph-ceph-mon.mon.keyring
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> ceph-mon: mon.noname-a <span class="o">[</span>::1<span class="o">]</span>:6789/0 is <span class="nb">local</span>, renaming to mon.ceph-mon
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> ceph-mon: <span class="nb">set </span>fsid to b8344267-3857-4ead-bb38-2fb54566341e
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> ceph-mon: created monfs at /var/lib/ceph/mon/ceph-ceph-mon <span class="k">for </span>mon.ceph-mon
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> unlinking keyring file /var/lib/ceph/tmp/ceph-ceph-mon.mon.keyring
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> create a <span class="k">done </span>file to avoid re-doing the mon deployment
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> create the init path <span class="k">if </span>it does not exist
</span><span class="line"><span class="o">[</span>ceph-mon<span class="o">][</span>INFO  <span class="o">]</span> Running <span class="nb">command</span>: initctl emit ceph-mon <span class="nv">cluster</span><span class="o">=</span>ceph <span class="nv">id</span><span class="o">=</span>ceph-mon
</span></code></pre></td></tr></tbody></table>

Then commit the last version of your image to save the latest change:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>docker commit e2f48f3cca26 leseb/ceph-mon
</span><span class="line">86f44bce988e
</span></code></pre></td></tr></tbody></table>

Finally run the monitor in a new container:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>docker run -d -p 6789 -h<span class="o">=</span><span class="s2">"ceph-mon"</span> leseb/ceph ceph-mon --conf /ceph.conf --cluster<span class="o">=</span>ceph -i ceph-mon -f
</span><span class="line">12974394437d
</span><span class="line">root@hp-docker:~# docker ps
</span><span class="line">ID                  IMAGE               COMMAND                CREATED             STATUS              PORTS
</span><span class="line">12974394437d        leseb/ceph:latest   ceph-mon --conf /cep   2 seconds ago       Up 1 seconds        49175-&gt;6789
</span></code></pre></td></tr></tbody></table>

Now the tough part, because of the use of `ceph-deploy` the monitor listens to the IPv6 local address. Which in normal circonstances is not a problem since we can access from either its local IP (lo) or its private address (eth0 or something else). However with Docker, things are a little bit different, the monitor is only accessible from its namespace, so even if you expose a port this won’t work. Basically exposing a port creates an Iptables DNAT rule, that says: everything that goes from anywhere to the host IP address on a specific port is redirected to the IP address within the container namespace. In the end, if you try to access the monintor using the IP address of the host plus the exposed port you will get something like this:

```
.connect claims to be [::1]:6804/1031425 not [::1]:6804/31537 - wrong node!
```

Although there is a way to access the monitor! We need to access it from host directly through the namespace.

First grab your container’s ID:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>docker ps
</span><span class="line">ID                  IMAGE               COMMAND                CREATED             STATUS              PORTS
</span><span class="line">9cfa541f6be9        leseb/ceph:latest   ceph-mon --conf /cep   25 hours ago        Up 25 hours         49156-&gt;6789
</span></code></pre></td></tr></tbody></table>

Use this script, **stolen and adapt** from Jérôme Petazzoni [here](https://github.com/jpetazzo/pipework/blob/master/pipework#L54). This script creates the entry point on the host to access the namespace of the container.

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
<span class="line-number">17</span>
<span class="line-number">18</span>
<span class="line-number">19</span>
<span class="line-number">20</span>
<span class="line-number">21</span>
<span class="line-number">22</span>
<span class="line-number">23</span>
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
<span class="line-number">27</span>
<span class="line-number">28</span>
<span class="line-number">29</span>
<span class="line-number">30</span>
<span class="line-number">31</span>
<span class="line-number">32</span>
<span class="line-number">33</span>
<span class="line-number">34</span>
<span class="line-number">35</span>
<span class="line-number">36</span>
<span class="line-number">37</span>
<span class="line-number">38</span>
<span class="line-number">39</span>
<span class="line-number">40</span>
<span class="line-number">41</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c">#!/bin/bash</span>
</span><span class="line"><span class="nb">set</span> -e
</span><span class="line">
</span><span class="line"><span class="nv">GUESTNAME</span><span class="o">=</span><span class="nv">$1</span>
</span><span class="line">
</span><span class="line"><span class="c"># Second step: find the guest (for now, we only support LXC containers)</span>
</span><span class="line"><span class="nv">CGROUPMNT</span><span class="o">=</span><span class="k">$(</span>grep ^cgroup.*devices /proc/mounts | cut -d<span class="s2">" "</span> -f2 | head -n 1<span class="k">)</span>
</span><span class="line"><span class="o">[</span> <span class="s2">"$CGROUPMNT"</span> <span class="o">]</span> <span class="o">||</span> <span class="o">{</span>
</span><span class="line">    <span class="nb">echo</span> <span class="s2">"Could not locate cgroup mount point."</span>
</span><span class="line">    <span class="nb">exit </span>1
</span><span class="line"><span class="o">}</span>
</span><span class="line">
</span><span class="line"><span class="nv">N</span><span class="o">=</span><span class="k">$(</span>find <span class="s2">"$CGROUPMNT"</span> -name <span class="s2">"$GUESTNAME*"</span> | wc -l<span class="k">)</span>
</span><span class="line"><span class="k">case</span> <span class="s2">"$N"</span> in
</span><span class="line">    0<span class="o">)</span>
</span><span class="line">        <span class="nb">echo</span> <span class="s2">"Could not find any container matching $GUESTNAME."</span>
</span><span class="line">        <span class="nb">exit </span>1
</span><span class="line">        ;;
</span><span class="line">    1<span class="o">)</span>
</span><span class="line">        <span class="nb">true</span>
</span><span class="line">        ;;
</span><span class="line">    *<span class="o">)</span>
</span><span class="line">        <span class="nb">echo</span> <span class="s2">"Found more than one container matching $GUESTNAME."</span>
</span><span class="line">        <span class="nb">exit </span>1
</span><span class="line">        ;;
</span><span class="line"><span class="k">esac</span>
</span><span class="line">
</span><span class="line"><span class="nv">NSPID</span><span class="o">=</span><span class="k">$(</span>head -n 1 <span class="k">$(</span>find <span class="s2">"$CGROUPMNT"</span> -name <span class="s2">"$GUESTNAME*"</span> | head -n 1<span class="k">)</span>/tasks<span class="k">)</span>
</span><span class="line"><span class="o">[</span> <span class="s2">"$NSPID"</span> <span class="o">]</span> <span class="o">||</span> <span class="o">{</span>
</span><span class="line">    <span class="nb">echo</span> <span class="s2">"Could not find a process inside container $GUESTNAME."</span>
</span><span class="line">    <span class="nb">exit </span>1
</span><span class="line"><span class="o">}</span>
</span><span class="line">mkdir -p /var/run/netns
</span><span class="line">rm -f /var/run/netns/<span class="nv">$NSPID</span>
</span><span class="line">ln -s /proc/<span class="nv">$NSPID</span>/ns/net /var/run/netns/<span class="nv">$NSPID</span>
</span><span class="line">
</span><span class="line"><span class="nb">echo</span> <span class="s2">""</span>
</span><span class="line"><span class="nb">echo</span> <span class="s2">"Namespace is ${NSPID}"</span>
</span><span class="line"><span class="nb">echo</span> <span class="s2">""</span>
</span><span class="line">
</span><span class="line">ip netns <span class="nb">exec</span> <span class="nv">$NSPID</span> ip a s eth0
</span></code></pre></td></tr></tbody></table>

Execute it:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>./pipework.sh 9cfa541f6be9
</span><span class="line">
</span><span class="line">Namespace is 10660
</span><span class="line">
</span><span class="line">607: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP qlen 1000
</span><span class="line">    link/ether b6:96:a3:c3:c7:1f brd ff:ff:ff:ff:ff:ff
</span><span class="line">    inet 172.17.0.8/16 brd 172.17.255.255 scope global eth0
</span><span class="line">    inet6 fe80::b496:a3ff:fec3:c71f/64 scope link
</span><span class="line">       valid_lft forever preferred_lft forever
</span></code></pre></td></tr></tbody></table>

Now, get the monitor’s key:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>cp /var/lib/docker/containers/9cfa541f6be97821131355b4005bc24b509baf3028759f0f871bf43840399f96/rootfs/ceph.mon.keyring ceph.mon.docker.keyring
</span><span class="line"><span class="o">[</span>mon.<span class="o">]</span>
</span><span class="line"><span class="nv">key</span> <span class="o">=</span> AQANAipSAAAAABAApGcUJIxy+DO56vP4UpIV5g<span class="o">==</span>
</span><span class="line">caps <span class="nv">mon</span> <span class="o">=</span> allow *
</span></code></pre></td></tr></tbody></table>

Ouahh YEAH!

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo ip netns <span class="nb">exec </span>10660 ceph -k ceph.mon.docker.keyring -n mon. -m 172.17.0.8 -s
</span><span class="line">  cluster c957629f-525d-4b60-a6b7-e1ccd9494063
</span><span class="line">   health HEALTH_ERR 192 pgs stuck inactive; 192 pgs stuck unclean; no osds
</span><span class="line">   monmap e1: 1 mons at <span class="o">{</span>ceph-mon<span class="o">=</span>172.17.0.8:6789/0<span class="o">}</span>, election epoch 2, quorum 0 ceph-mon
</span><span class="line">   osdmap e1: 0 osds: 0 up, 0 in
</span><span class="line">    pgmap v2: 192 pgs: 192 creating; 0 bytes data, 0 KB used, 0 KB / 0 KB avail
</span><span class="line">   mdsmap e1: 0/0/1 up
</span></code></pre></td></tr></tbody></table>

  

# III. Issues and caveats

I’m not really convinced by this first shot. The biggest issue here is that the monitor needs to be known.

Wow that was a hell of a job to get this working. At the end, the effort is quite useless since nothing can reach the monitor except the host itself. Thus, other Ceph components will only work if they share the same network namespace as the monitor. Sharing all the containers namespace into one could quite difficult as well. But what’s the point to have a Ceph cluster stuck within some namespaces, without any clients accessing it?

  

> I have to admit that this was pretty fun to hack. Although, in practice, that’s not usable at all. Thus you can consider this as an experiment and a way to get into Docker ;-).
