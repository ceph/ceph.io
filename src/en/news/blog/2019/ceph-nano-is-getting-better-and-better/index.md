---
title: "Ceph nano is getting better and better"
date: "2019-02-24"
author: "admin"
tags: 
  - "planet"
---

![cn big updates](images/introducing-ceph-nano.png)

Long time no blog, I know, I know… Soon, I will do another blog entry to “explain” a little why I am not blogging as much I used too but if you’re still around and reading this then thank you! For the past few months, `cn` has grown in functionality so let’s explore what’s new and what’s coming.

To get up to speed on the project and some of the main feature, I encourage to read my [last presentation](http://www.sebastien-han.fr/blog/2018/11/05/Ceph-meetup-Paris/)

# Config file and templates

`cn` now has a configuration file that can be used to create _flavors_ of your `cn` clusters. They represent different classes of a cluster where CPU, memory, the image can be tuned.

These flavors can be used via the `--flavor` argument to the `cn cluster start` CLI call.

Here is an example of a `mimic` flavor in `$HOME/.cn/cn.toml`, which creates a new image new for a specific image you built:

<table><tbody><tr><td class="code"><pre><span class="line">[images]</span><br><span class="line">  [images.complex]</span><br><span class="line">    image_name="this.url.is.complex/cool/for-a-test"</span><br></pre></td></tr></tbody></table>

`cn` comes with some pre-defined flavors you can use as well:

<table><tbody><tr><td class="code"><pre><span class="line">$ cn flavors ls</span><br><span class="line">+---------+-------------+-----------+</span><br><span class="line">| NAME    | MEMORY_SIZE | CPU_COUNT |</span><br><span class="line">+---------+-------------+-----------+</span><br><span class="line">| large   | 1GB         | 1         |</span><br><span class="line">| huge    | 4GB         | 2         |</span><br><span class="line">| default | 512MB       | 1         |</span><br><span class="line">| medium  | 768MB       | 1         |</span><br></pre></td></tr></tbody></table>

For images, we also implemented aliases for most-commonly used images:

<table><tbody><tr><td class="code"><pre><span class="line">$ cn image show-aliases</span><br><span class="line">+----------+--------------------------------------------------+</span><br><span class="line">| ALIAS    | IMAGE_NAME                                       |</span><br><span class="line">+----------+--------------------------------------------------+</span><br><span class="line">| redhat   | registry.access.redhat.com/rhceph/rhceph-3-rhel7 |</span><br><span class="line">| mimic    | ceph/daemon:latest-mimic                         |</span><br><span class="line">| luminous | ceph/daemon:latest-luminous                      |</span><br><span class="line">+----------+--------------------------------------------------+</span><br></pre></td></tr></tbody></table>

For more examples of possible configuration see the [example file](https://github.com/ceph/cn/blob/master/cmd/cn-test.toml).

# Container memory auto-tuning

This specific work happened in the container image via the [ceph-container project](https://github.com/ceph/ceph-container). With recent versions of Ceph, Bluestore has implemented its cache in its own memory space. The default values are not meant to run on a small restricted environment such as `cn` where the memory limit is usually low. So we had to adapt these Bluestore flags on the fly by detecting the memory available and whether or not the memory is capped. Based on several data we are capable of tuning these value, so `ceph-osd` does not consume too much memory.

This work was crucial for `cn` reliability since after some time the processes were receiving OOM call from the kernel. So you had to restart the container, but it’ll die eventually again and again.

# New core incoming

Initially, the scenario that is used to bootstrap `cn` is by using a bash script from the [ceph-container project](https://github.com/ceph/ceph-container). When `cn` starts, it instantiates a particular scenario called `demo` which deploys all the ceph daemons, the UI etc.

Bash is good, I love it, but it has its limitations. For instance, performing correct logging, error handling, unit test, all of that becomes increasingly difficult as the project grows. So I decided to switch to Golang with some hope to get below 20 or 15 seconds bootstrap time too.

Typically `cn` needs around 20 seconds to bootstrap on my laptop, with `cn-core` we have been able to go below the 15 sec, see by yourself:

<table><tbody><tr><td class="code"><pre><span class="line">$ time cn cluster start -i quay.io/ceph/cn-core:v0.4 core</span><br><span class="line">2019/02/24 14:52:47 Running cluster core | image quay.io/ceph/cn-core:v0.4 | flavor default {512MB Memory, 1 CPU} ...</span><br><span class="line"></span><br><span class="line">Endpoint: http://10.36.117.68:8001</span><br><span class="line">Dashboard: http://10.36.117.68:5001</span><br><span class="line">Access key: PCJEU83FCKAZGM3NO609</span><br><span class="line">Secret key: Ie1fRQuJMqoFI9dis2fOYKIf2Yg08H8R1PeZB8QI</span><br><span class="line">Working directory: /usr/share/ceph-nano</span><br><span class="line"></span><br><span class="line"></span><br><span class="line">real    0m14.730s</span><br><span class="line">user    0m0.032s</span><br><span class="line">sys     0m0.018s</span><br></pre></td></tr></tbody></table>

The new is core is still in Beta, but it’s a matter of weeks before we switch to `cn-core` by default. We almost got feature parity with `demo.sh,` and there are just a few bugs to fix.

You can contribute to this new core as much as you want in the [cn-core repository](https://github.com/ceph/cn-core).

  

> Voilà voilà, I hope you still like the project. If there is anything, you would like to see then tell us, something you hate then tell us too!

Source: Sebastian Han ([Ceph nano is getting better and better](https://sebastien-han.fr/blog/2019/02/24/Ceph-nano-is-getting-better-and-better/))
