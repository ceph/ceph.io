---
title: "CephFS Admin Tips - Create a new user and share"
date: "2018-03-06"
author: "admin"
tags: 
  - "planet"
---

* * *

Hi my name is Stephen McElroy, and in this guide I will be showing how to create a new user, set permissions, set quotas, mount the share, and make them persistent on the client.

## Creating the user

On the Ceph admin nodeLets create a basic user and give it capabilities to read the `/` and the `/test_folder` in CephFS.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div><div class="line">6</div><div class="line">7</div><div class="line">8</div><div class="line">9</div><div class="line">10</div><div class="line">11</div></pre></td><td class="code"><pre><div class="line">$ ceph-authtool --create-keyring /etc/ceph/ceph.client.test_user.keyring --gen-key -n client.test_user</div><div class="line">$ vi /etc/ceph/ceph.client.test_user.keyring</div><div class="line"></div><div class="line"># Initial keyring only has key value</div><div class="line">[client.test_user]</div><div class="line">    key = AQAX4PBZw5tcGhAaaaaaBCSJR8qZ25uQB3yYA2gw==</div><div class="line">    </div><div class="line"># We will add in our capabilities here</div><div class="line">    caps mds = "allow r path=/, allow rw path=/test_folder"</div><div class="line">    caps mon = "allow r"</div><div class="line">    caps osd = "allow class-read object_prefix rbd_children, allow rw pool=cephfs_data"</div></pre></td></tr></tbody></table>

Once we are done adding capabilities, we will use ceph auth import to update -or- create our user entry. I personally like this way of updating the capabilities for a user for two reasons. First, it allows me to backup clients CAPS, most importantly, It allows me to not accidentally override their CAPS with ceph auth caps command.  

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">$ ceph auth import -i /etc/ceph/ceph.client.test_user.keyring</div></pre></td></tr></tbody></table>

## Creating the CephFS share

If you don’t already have CephFS mounted somewhere to be able to create directories, lets mount the root directory now. Then create a subdirectory names test\_folder.

Note - If you want to set user quotas on directory, use ceph-fuse when mounting. So far its the only way I’ve been able to get quotas to work.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div></pre></td><td class="code"><pre><div class="line">$ mkdir /mnt/cephfs</div><div class="line">$ ceph-fuse /mnt/cephfs</div><div class="line">$ mkdir /mnt/cephfs/test_folder</div></pre></td></tr></tbody></table>

Lets set a quota on test\_folder.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div></pre></td><td class="code"><pre><div class="line">$ cd /mnt/cephfs/</div><div class="line">$ setfattr -n ceph.quota.max_bytes -v 107300000000 test_folder</div></pre></td></tr></tbody></table>

Lets mount up the test folder to ensure quotas worked.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div></pre></td><td class="code"><pre><div class="line">$ ceph-fuse -r /test_folder /mnt/cephfs</div><div class="line">$ df -h</div><div class="line">~~~</div><div class="line">ceph-fuse                     100G     0  100G   0% /mnt/cephfs</div></pre></td></tr></tbody></table>

Next, install packages for ceph-fuse

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div></pre></td><td class="code"><pre><div class="line">$ yum install ceph-fuse</div></pre></td></tr></tbody></table>

### Create Mount Points

Copy over your client key you made on the admin node, and ceph.conf, to “/etc/ceph/“  
Then we will make two directories that will be use for mounting CephFS.  
**_Personally I like to keep the mount directory and Ceph directory name the same._**

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div></pre></td><td class="code"><pre><div class="line">$ mkdir /etc/cephfs_root</div><div class="line">$ mkdir /etc/test_folder</div></pre></td></tr></tbody></table>

Make this a persistent mount by adding entries in “/etc/fstab”. Change the information as needed.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div></pre></td><td class="code"><pre><div class="line"># Ceph Fuse mount of root cephfs</div><div class="line">id=test_user,conf=/etc/ceph/ceph.conf,client_mountpoint=/ /mnt/cephfs_root fuse.ceph noatime 0 0</div><div class="line"></div><div class="line"># Specific Directory in cephfs</div><div class="line">id=test_user,conf=/etc/ceph/ceph.conf,client_mountpoint=/test_folder /mnt/test_folder fuse.ceph noatime 0 0</div></pre></td></tr></tbody></table>

Run `mount -a` and `df -h` to ensure everything mounted correctly.

<table><tbody><tr><td class="gutter"><pre><div class="line">1</div><div class="line">2</div><div class="line">3</div><div class="line">4</div><div class="line">5</div></pre></td><td class="code"><pre><div class="line">$ mount -a</div><div class="line">$ df -h</div><div class="line">~~~</div><div class="line">ceph-fuse                     4.2E     0  4.2E   0% /mnt/cephfs_root</div><div class="line">ceph-fuse                     100G     0  100G   0% /mnt/test_folder</div></pre></td></tr></tbody></table>

## Fin

There you have it, you should now have a fully working CephFS share. I hope this helps out peeps and makes like a little easier. If this even helped out one admin, then it was well worth it. If you have any questions, or need to hire a Ceph Engineer, free to contact me at magusnebula@gmail.com!

Source: Stephen McElroy ([CephFS Admin Tips - Create a new user and share](http://obsidiancreeper.com/2018/03/06/CephFS-Admin-Tips-Create-a-new-user-and-share/))
