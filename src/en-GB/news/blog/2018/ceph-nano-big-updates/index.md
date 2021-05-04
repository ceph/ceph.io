---
title: "Ceph Nano big updates"
date: "2018-04-30"
author: "admin"
tags: 
  - "planet"
---

![Title](images/introducing-ceph-nano.png)

With its two latest versions (v1.3.0 and v1.4.0) Ceph Nano brought some nifty new functionalities that I’d like to highlight in the article.

## Multi cluster support

This is feature is available since v1.3.0.

You can now run more than a single instance of cn, you can run as many as your system allows it (CPU and memory wise). This is how you run a new cluster:

<table><tbody><tr><td class="code"><pre><span class="line"> $ ./cn cluster start s3 <span class="_">-d</span> /tmp</span><br><span class="line">2018/04/30 16:12:07 Running cluster s3...</span><br><span class="line"></span><br><span class="line">HEALTH_OK is the Ceph status</span><br><span class="line">S3 object server address is: http://10.36.116.231:8001</span><br><span class="line">S3 user is: nano</span><br><span class="line">S3 access key is: JZYOITC0BDLPB0K6E5WX</span><br><span class="line">S3 secret key is: sF0Vu6seb64hhlsmtxKT6BSrs2KY8cAB8la8kni1</span><br><span class="line">Your working directory is: /tmp</span><br></pre></td></tr></tbody></table>

And how you can retrieve the list of running clusters:

<table><tbody><tr><td class="code"><pre><span class="line">$ ./cn cluster ls</span><br><span class="line">+--------+---------+--------------------+----------------+--------------------------------+</span><br><span class="line">| NAME   | STATUS  | IMAGE              | IMAGE RELEASE  | IMAGE CREATION TIME            |</span><br><span class="line">+--------+---------+--------------------+----------------+--------------------------------+</span><br><span class="line">| s3     | running | ceph/daemon:latest | master<span class="_">-d</span>0d98c4 | 2018-04-20T13:37:06.933085171Z |</span><br><span class="line">| trolol | exited  | ceph/daemon:latest | master<span class="_">-d</span>0d98c4 | 2018-04-20T13:37:06.933085171Z |</span><br><span class="line">| e      | running | ceph/daemon:latest | master<span class="_">-d</span>0d98c4 | 2018-04-20T13:37:06.933085171Z |</span><br><span class="line">+--------+---------+--------------------+----------------+--------------------------------+</span><br></pre></td></tr></tbody></table>

This feature works well in conjunction with the image support. You can run any container using any container image available in the Docker Hub. You can even your own one if you want to test a fix.

You can list the available image like this:

<table><tbody><tr><td class="code"><pre><span class="line">$ ./cn image ls</span><br><span class="line">latest-bislatest</span><br><span class="line">latest-luminouslatest-kraken</span><br><span class="line">latest-jewelmaster-da37788-kraken-centos-7-x86_64</span><br><span class="line">master-da37788-jewel-centos-7-x86_64master-da37788-kraken-ubuntu-16.04-x86_64</span><br><span class="line">master-da37788-jewel-ubuntu-14.04-x86_64master-da37788-jewel-ubuntu-16.04-x86_64</span><br></pre></td></tr></tbody></table>

Use `-a` to list **all** our images. So using the `-i` option when starting a cluster will run the image you want.

## Dedicated device or directory support

This feature is available since v1.4.0.

You might be after providing more persistent and fast storage for cn. This is possible by specifying either a dedicated block device (a partition works too) or a directory that you might have configured on a particular device.

You have to run cn with `sudo` here since it performs a couple of checks on that device to make sure its eligible for usage. Thus higher privileges to run cn are required.

<table><tbody><tr><td class="code"><pre><span class="line">sudo ./cn cluster start -b /dev/disk/by-id/wwn-0x600508b1001c4257dacb9870dbc6b1c8 block</span><br></pre></td></tr></tbody></table>

Using a directory is identical, just run with `-b /srv/cn/` for instance.

  

> I’m so glad to see how cn has evolved, I’m proud of this little tool that I use on daily basis for so many things. I hope you are enjoying it as much as I do.

Source: Sebastian Han ([Ceph Nano big updates](https://sebastien-han.fr/blog/2018/04/30/Ceph-Nano-big-updates/))
