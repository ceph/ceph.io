---
title: "Making RBD images persistent"
date: "2017-10-17"
author: "admin"
tags: 
  - "planet"
---

## [](#Making-RBD-images-persistent "Making RBD images persistent")Making RBD images persistent

Here’s a quick tutorial on how to make RBD’s, disable their features, and make them persistent at startup.

### [](#Creating-the-RBD-image "Creating the RBD image")Creating the RBD image

_Note - You really should go into your cepf.conf file and set `rbd_default_features = 1` under the `[global]` section before going any further. Failure to do so will result in you images not wanting to map. If needed these features can be enabled later with `red feature enable`_

In order to create the RBD image simply run the following command

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">rbd create pool_name/image_name --size 100GB</div></pre></td></tr></tbody></table>

### [](#Mapping-the-RBD-image "Mapping the RBD image")Mapping the RBD image

On the machine you wish to map this image run

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div></pre></td><td class="code"><pre><div class="line">rbd map pool_name/image_name</div><div class="line"></div><div class="line"># Or if you have Cephx enabled you can use</div><div class="line">rbd map pool_name/image_name --id admin --keyfile /secretfile.txt</div></pre></td></tr></tbody></table>

This will map the image (if it is your first) to `/dev/rbd0`. It will also be mapped to `/dev/rbd/pool_name/image_name`. From here we can treat this as a normal block device and map it.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div></pre></td><td class="code"><pre><div class="line">mkfs.xfs /dev/rbd/pool_name/image_name</div><div class="line">mount /dev/rbd/pool_name/image_name /mnt/</div></pre></td></tr></tbody></table>

### [](#Making-this-a-persistent-mount "Making this a persistent mount")Making this a persistent mount

To make this mountable upon boot, we need to edit our rbdmap file.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">vi /etc/ceph/rbdmap</div></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div></pre></td><td class="code"><pre><div class="line"># RbdDevice             Parameters</div><div class="line">#poolname/imagename     id=client,keyring=/etc/ceph/ceph.client.keyring</div><div class="line"></div><div class="line">pool_name/image_name    id=admin,keyring=/etc/ceph/ceph.client.admin.keyring</div></pre></td></tr></tbody></table>

Create an `/etc/fstab` entry.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">/dev/rbd/pool_name/image_name /mnt/target_dir xfs noauto 0 0</div></pre></td></tr></tbody></table>

And last but not least enable the rbdmap service.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">systemctl enable rbdmap</div></pre></td></tr></tbody></table>

I hope this ends up helping someone, thank you for reading!

Source: Stephen McElroy ([Making RBD images persistent](http://obsidiancreeper.com/2017/10/17/Making-RBD-images-persistent/))
