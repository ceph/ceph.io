---
title: "Use existing RBD images and put it into Glance"
date: "2013-05-07"
author: "shan"
tags: 
---

![](images/glance-location-rbd.jpg "Use existing RBD images and put it into Glance")

The title of the article is not that explicit, actually I had trouble to find a proper one. Thus let me clarify a bit. Here is the context I was wondering if Glance was capable of converting images within its store. The quick answer is no, but I think such feature is worth to be implemented. Glance could be able to convert a QCOW2 image to a RAW format. Usually if you already have an image within let’s say a Ceph cluster (RBD), you have to download the image (since you probably don’t have the source image file anymore), then manually convert it with qemu-img (QCOW2 –> RAW) and eventually import it into Glance. Enough talk about this, I’ll address this in a future article. For now let’s stick to the first matter. Imagine that you have a KVM cluster backed by a Ceph Cluster and your CTO wants you to migrate the whole environment to OpenStack because it’s trendy (joking, OpenStack just rocks!). You’re not going to backup all your images and then build a new cluster or something like that, you might want OpenStack (Glance) to be aware of your Ceph cluster. Generally speaking you _just_ have to connect Glance to one of your image pool. After this, the only thing to do is to create (it’s more registering the images ID and metadata than creating a new image) into Glance. No worries here’s the explanation. Longest introduction ever.

In this article, I’m assuming that Glance is already connected to Ceph and to the proper RBD pool. Before starting anything, please understand that **within the current Grizzly stable branch, the RBD backend is not implemented**. That’s funny because we don’t need that much to implement it. The bug report is on [launchpad](https://bugs.launchpad.net/glance/+bug/1176994) and the proposed feature is under review on [Gerrit](https://review.openstack.org/#/c/28325/).

However if you want to enable the fix now:

- Go to the line **278** of `/opt/stack/glance/glance/api/v1/images.py`
- Then simply edit the line like so:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="python"><span class="line"><span class="k">for</span> <span class="n">scheme</span> <span class="ow">in</span> <span class="p">[</span><span class="s">'s3'</span><span class="p">,</span> <span class="s">'swift'</span><span class="p">,</span> <span class="s">'http'</span><span class="p">,</span> <span class="s">'rbd'</span><span class="p">]:</span>
</span></code></pre></td></tr></tbody></table>

## Let’s test this!

Get the image size from the rbd client:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd -p images info ubuntu-raw
</span><span class="line">rbd image <span class="s1">'ubuntu-raw'</span>:
</span><span class="line">size 2048 MB in 512 objects
</span><span class="line">order 22 <span class="o">(</span>4096 KB objects<span class="o">)</span>
</span><span class="line">block_name_prefix: rb.0.3ded.2eb141f2
</span><span class="line">format: 1
</span></code></pre></td></tr></tbody></table>

Eventually create/register the new image:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>glance image-create --size 2147483648 --name ubuntu-rbd --store rbd --disk-format raw --container-format ovf --location rbd://ubuntu-raw
</span><span class="line">+------------------+--------------------------------------+
</span><span class="line">| Property         | Value                                |
</span><span class="line">+------------------+--------------------------------------+
</span><span class="line">| checksum         | None                                 |
</span><span class="line">| container_format | ovf                                  |
</span><span class="line">| created_at       | 2013-05-06T15:29:26                  |
</span><span class="line">| deleted          | False                                |
</span><span class="line">| deleted_at       | None                                 |
</span><span class="line">| disk_format      | raw                                  |
</span><span class="line">| id               | 0d47c421-b079-44ff-bcc5-ee711d500512 |
</span><span class="line">| is_public        | False                                |
</span><span class="line">| min_disk         | 0                                    |
</span><span class="line">| min_ram          | 0                                    |
</span><span class="line">| name             | ubuntu-rbd-hack                      |
</span><span class="line">| owner            | 19292b3b597b4ecc9a41103cc312a42f     |
</span><span class="line">| protected        | False                                |
</span><span class="line">| size             | 2147483648                           |
</span><span class="line">| status           | active                               |
</span><span class="line">| updated_at       | 2013-05-06T15:29:26                  |
</span><span class="line">+------------------+--------------------------------------+
</span></code></pre></td></tr></tbody></table>

R Note about the URI from the `--location` option, there are 2 way to build it, it can be:

- `rbd://<fsid>/<pool>/<image>/<snapshot>`
- `rbd://<image-name>` ; Glance will figured out the pool since you put it into the Glance configuration.

**It either 1 or 4 field(s).**

  

> Of course the example was only with one image but the method will definitely work for a whole Ceph cluster with tons of images!
