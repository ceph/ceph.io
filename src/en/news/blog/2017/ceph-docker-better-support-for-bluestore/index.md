---
title: "Ceph Docker better support for Bluestore"
date: "2017-06-14"
author: "admin"
tags: 
  - "planet"
---

![Title](images/better-bluestore-support-container.jpg)

I have been extensively working on [ceph-docker](https://github.com/ceph/ceph-docker) for the last few months and it’s getting better. With the upcoming arrival of Ceph Luminous (next LTS), Bluestore will be the default backend to store objects. Thus, I had to spend some time working on improving the support for Bluestore.

Now, if you want to prepare a device with Bluestore you can specify different device for:

- `OSD_DEVICE`: device where data will be stored
- `OSD_BLUESTORE_BLOCK_DB`: device that store RocksDB metadata
- `OSD_BLUESTORE_BLOCK_WAL`: device that stores RocksDB write-ahead journal

See it in action, this is the command to prepare a Bluestore OSD:

<table><tbody><tr><td class="code"><pre><span class="line">$ docker run -d </span><br><span class="line">-<span class="ruby">-net=host </span><br><span class="line"></span>-<span class="ruby">-pid=host </span><br><span class="line"></span>-<span class="ruby">-privileged=<span class="literal">true</span> </span><br><span class="line"></span>-<span class="ruby">v /etc/<span class="symbol">ceph:</span>/etc/ceph </span><br><span class="line"></span>-<span class="ruby">v /var/lib/ceph/<span class="symbol">:/var/lib/ceph/</span> </span><br><span class="line"></span>-<span class="ruby">v /dev/<span class="symbol">:/dev/</span> </span><br><span class="line"></span>-<span class="ruby">e OSD_DEVICE=<span class="regexp">/dev/sda</span> </span><br><span class="line"></span>-<span class="ruby">e OSD_BLUESTORE_BLOCK_WAL=<span class="regexp">/dev/sdb</span> </span><br><span class="line"></span>-<span class="ruby">e OSD_BLUESTORE_BLOCK_DB=<span class="regexp">/dev/sdc</span> </span><br><span class="line"></span>-<span class="ruby">e CEPH_DAEMON=OSD_CEPH_DISK_PREPARE </span><br><span class="line"></span>-<span class="ruby">e OSD_BLUESTORE=<span class="number">1</span> </span><br><span class="line"></span>ceph/daemon</span><br></pre></td></tr></tbody></table>

Soon, Bluestore will be the ‘real’ default and the `OSD_BLUESTORE=1` won’t be necessary anymore.

  

> Hopefully, more posts coming soon :).

Source: Sebastian Han ([Ceph Docker better support for Bluestore](https://sebastien-han.fr/blog/2017/06/14/Ceph-Docker-better-support-for-Bluestore/))
