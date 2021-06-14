---
title: "Ceph and Cinder multi-backend"
date: "2013-04-25"
author: "shan"
tags: 
  - "planet"
---

![](images/ceph-cinder-multi-backed.jpg)

Grizzly brought the multi-backend functionality to cinder and tons of new drivers. The main purpose of this article is to demonstrate how we can take advantage of the tiering capability of Ceph.

# I. Ceph

To configure Ceph to use different storage devices see my previous article: [Ceph 2 speed storage with CRUSH](http://www.sebastien-han.fr/blog/2012/12/07/ceph-2-speed-storage-with-crush/).

  

# II. Cinder

Assuming your 2 pools are called:

- rbd-sata points to the SATA rack
- rbd-ssd points to the SSD rack

## II.1 Configuration

Cinder configuration file:

```
# Multi backend options

# Define the names of the groups for multiple volume backends
enabled_backends=rbd-sata,rbd-ssd

# Define the groups as above
[rbd-sata]
volume_driver=cinder.volume.driver.RBDDriver
rbd_pool=cinder-sata
volume_backend_name=RBD_SATA
# if cephX is enable
#rbd_user=cinder
#rbd_secret_uuid=<None>
[rbd-ssd]
volume_driver=cinder.volume.driver.RBDDriver
rbd_pool=cinder-ssd
volume_backend_name=RBD_SSD
# if cephX is enable
#rbd_user=cinder
#rbd_secret_uuid=<None>
```

Unfortunately the rbd driver doesn’t support this variable yet (most of the drivers don’t). This feature has been submitted here: [https://review.openstack.org/#/c/28208/](https://review.openstack.org/#/c/28208/).

Then create the pointers:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>cinder <span class="nb">type</span>-key ssd <span class="nb">set </span><span class="nv">volume_backend_name</span><span class="o">=</span>RBD_SSD
</span><span class="line"><span class="nv">$ </span>cinder <span class="nb">type</span>-key sata <span class="nb">set </span><span class="nv">volume_backend_name</span><span class="o">=</span>RBD_SATA
</span><span class="line"><span class="nv">$ </span>cinder extra-specs-list
</span><span class="line">+--------------------------------------+------+---------------------------------------+
</span><span class="line">|                  ID                  | Name |              extra_specs              |
</span><span class="line">+--------------------------------------+------+---------------------------------------+
</span><span class="line">| b1522968-e4fa-4372-8ac4-3925b7c79ee1 | ssd  |  <span class="o">{</span>u<span class="s1">'volume_backend_name'</span>: u<span class="s1">'RBD_SSD'</span><span class="o">}</span> |
</span><span class="line">| b50bf5a3-6044-4392-beeb-432302f6421c | sata | <span class="o">{</span>u<span class="s1">'volume_backend_name'</span>: u<span class="s1">'RBD_SATA'</span><span class="o">}</span> |
</span><span class="line">+--------------------------------------+------+---------------------------------------+
</span></code></pre></td></tr></tbody></table>

Then restart cinder services:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo restart cinder-api ; sudo restart cinder-scheduler ; sudo restart cinder-volume
</span></code></pre></td></tr></tbody></table>

Eventually create 2 volume type, one for each backend:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>cinder <span class="nb">type</span>-create ssd
</span><span class="line">+--------------------------------------+------+
</span><span class="line">|                  ID                  | Name |
</span><span class="line">+--------------------------------------+------+
</span><span class="line">| b1522968-e4fa-4372-8ac4-3925b7c79ee1 | ssd  |
</span><span class="line">+--------------------------------------+------+
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>cinder <span class="nb">type</span>-create sata
</span><span class="line">+--------------------------------------+------+
</span><span class="line">|                  ID                  | Name |
</span><span class="line">+--------------------------------------+------+
</span><span class="line">| b50bf5a3-6044-4392-beeb-432302f6421c | sata |
</span><span class="line">+--------------------------------------+------+
</span></code></pre></td></tr></tbody></table>

  

## II.2. Play with it

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>cinder create --volume_type ssd --display_name vol-ssd 1
</span><span class="line">+---------------------+--------------------------------------+
</span><span class="line">|       Property      |                Value                 |
</span><span class="line">+---------------------+--------------------------------------+
</span><span class="line">|     attachments     |                  <span class="o">[]</span>                  |
</span><span class="line">|  availability_zone  |                 nova                 |
</span><span class="line">|       bootable      |                <span class="nb">false</span>                 |
</span><span class="line">|      created_at     |      2013-04-22T14:54:53.917580      |
</span><span class="line">| display_description |                 None                 |
</span><span class="line">|     display_name    |               vol-ssd                |
</span><span class="line">|          id         | 4c777d96-66e4-4f85-815c-92d4503c5c8c |
</span><span class="line">|       metadata      |                  <span class="o">{}</span>                  |
</span><span class="line">|         size        |                  1                   |
</span><span class="line">|     snapshot_id     |                 None                 |
</span><span class="line">|     source_volid    |                 None                 |
</span><span class="line">|        status       |               creating               |
</span><span class="line">|     volume_type     |                 ssd                  |
</span><span class="line">+---------------------+--------------------------------------+
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>cinder create --volume_type ssd --display_name vol-sata 1
</span><span class="line">+---------------------+--------------------------------------+
</span><span class="line">|       Property      |                Value                 |
</span><span class="line">+---------------------+--------------------------------------+
</span><span class="line">|     attachments     |                  <span class="o">[]</span>                  |
</span><span class="line">|  availability_zone  |                 nova                 |
</span><span class="line">|       bootable      |                <span class="nb">false</span>                 |
</span><span class="line">|      created_at     |      2013-04-22T14:54:58.831327      |
</span><span class="line">| display_description |                 None                 |
</span><span class="line">|     display_name    |               vol-sata               |
</span><span class="line">|          id         | 8e347bd1-2044-40a2-ae87-ee9a23cddd71 |
</span><span class="line">|       metadata      |                  <span class="o">{}</span>                  |
</span><span class="line">|         size        |                  1                   |
</span><span class="line">|     snapshot_id     |                 None                 |
</span><span class="line">|     source_volid    |                 None                 |
</span><span class="line">|        status       |               creating               |
</span><span class="line">|     volume_type     |                 ssd                  |
</span><span class="line">+---------------------+--------------------------------------+
</span></code></pre></td></tr></tbody></table>

Does it work?

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>rbd -p cinder-ssd ls
</span><span class="line">volume-8e347bd1-2044-40a2-ae87-ee9a23cddd71
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>rbd -p cinder-sata ls
</span><span class="line">volume-4c777d96-66e4-4f85-815c-92d4503c5c8c
</span></code></pre></td></tr></tbody></table>

  

> It’s nice that the multi-backend came with Cinder, we are gradually getting to enjoy the full power of Ceph!
