---
title: "The new Ceph container demo is super dope!"
date: "2017-06-27"
author: "admin"
tags: 
  - "planet"
---

![Title](images/ceph-demo-container-dope.jpg)

I have been recently working on refactoring our Ceph container images. We used to have two separate images for `daemon` and `demo`. Recently, for Luminous, I decided to merge the demo container into daemon. It makes everything easier, code is in a single place, we only have a single image to test with the CI and users have a single image to play with.

As reminder, this is what the container can do for you:

- Bootstrap a single Ceph monitor
- Bootstrap a single Ceph OSD with Bluestore (running on a filesystem)
- Bootstrap a single MDS server
- Bootstrap a RGW instance with optionally a user and the ability to interact with `s3cmd`.
- Bootstrap a rbd-mirror daemon
- Bootstrap a ceph-mgr daemon with its dashboard

This is how to run it:

<table><tbody><tr><td class="code"><pre><span class="line">docker run -d </span><br><span class="line">-<span class="ruby">-name demo </span><br><span class="line"></span>-<span class="ruby">e MON_IP=<span class="number">0</span>.<span class="number">0</span>.<span class="number">0</span>.<span class="number">0</span> </span><br><span class="line"></span>-<span class="ruby">e CEPH_PUBLIC_NETWORK=<span class="number">0</span>.<span class="number">0</span>.<span class="number">0</span>.<span class="number">0</span>/<span class="number">0</span> </span><br><span class="line"></span>-<span class="ruby">-net=host </span><br><span class="line"></span>-<span class="ruby">v /var/lib/<span class="symbol">ceph:</span>/var/lib/ceph </span><br><span class="line"></span>-<span class="ruby">v /etc/<span class="symbol">ceph:</span>/etc/ceph </span><br><span class="line"></span>-<span class="ruby">e CEPH_DEMO_UID=qqq </span><br><span class="line"></span>-<span class="ruby">e CEPH_DEMO_ACCESS_KEY=qqq </span><br><span class="line"></span>-<span class="ruby">e CEPH_DEMO_SECRET_KEY=qqq </span><br><span class="line"></span>-<span class="ruby">e CEPH_DEMO_BUCKET=qqq </span><br><span class="line"></span>ceph/daemon </span><br><span class="line">demo</span><br></pre></td></tr></tbody></table>

Obviously adapt both `MON_IP` and `CEPH_PUBLIC_NETWORK` with your host specificity. It’s handy to bindmount both `/var/lib/ceph` and `/etc/ceph` so the container can survive a restart.

Output example on my test system:

<table><tbody><tr><td class="code"><pre><span class="line">$ sudo ceph -s</span><br><span class="line"><span class="symbol">  cluster:</span></span><br><span class="line"><span class="symbol">    id:</span>     <span class="number">940848</span>cd<span class="number">-658</span>a<span class="number">-46</span>d1<span class="number">-8161</span><span class="number">-4</span>bcd37c36ce9</span><br><span class="line"><span class="symbol">    health:</span> HEALTH_OK</span><br><span class="line"><span class="symbol"> </span><br><span class="line">  services:</span></span><br><span class="line"><span class="symbol">    mon:</span> <span class="number">1</span> daemons, quorum leseb-tarox</span><br><span class="line"><span class="symbol">    mgr:</span> leseb-tarox(active)</span><br><span class="line"><span class="symbol">    mds:</span> <span class="number">1</span>/<span class="number">1</span>/<span class="number">1</span> <span class="class">up </span>{<span class="number">0</span>=<span class="number">0</span>=up:active}</span><br><span class="line"><span class="symbol">    osd:</span> <span class="number">1</span> osds: <span class="number">1</span> up, <span class="number">1</span> in</span><br><span class="line"><span class="symbol"> </span><br><span class="line">  data:</span></span><br><span class="line"><span class="symbol">    pools:</span>   <span class="number">8</span> pools, <span class="number">120</span> pgs</span><br><span class="line"><span class="symbol">    objects:</span> <span class="number">216</span> objects, <span class="number">5030</span> bytes</span><br><span class="line"><span class="symbol">    usage:</span>   <span class="number">1091</span> MB used, <span class="number">9212</span> MB / <span class="number">10303</span> MB avail</span><br><span class="line"><span class="symbol">    pgs:</span>     <span class="number">120</span> active+clean</span><br></pre></td></tr></tbody></table>

Obviously, this container enables the new dashboard manager:

![Title](images/ceph-mgr-dashboard.png)

  

> Enjoy this nice preview on Luminous, the current image from the Docker Hub is build on the first Luminous RC.

Source: Sebastian Han ([The new Ceph container demo is super dope!](https://sebastien-han.fr/blog/2017/06/27/New-Ceph-container-demo-is-super-dope/))
