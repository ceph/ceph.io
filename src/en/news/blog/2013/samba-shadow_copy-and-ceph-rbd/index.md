---
title: "Samba Shadow_copy and Ceph RBD"
date: "2013-08-09"
author: "laurentbarbe"
tags: 
  - "planet"
---

I add script to create snapshot on rbd for use with samba shadow\_copy2. For more details go on [https://github.com/ksperis/autosnap-rbd-shadow-copy](https://github.com/ksperis/autosnap-rbd-shadow-copy)

##  How to use :

Before you need to have ceph cluster running and samba installed.

Verify admin access to the ceph cluster : (should not return error)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd ls</span></code></pre></td></tr></tbody></table>

Get the script :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mkdir -p /etc/ceph/scripts/
</span><span class="line">$ cd /etc/ceph/scripts/
</span><span class="line">$ wget https://raw.github.com/ksperis/autosnap-rbd-shadow-copy/master/autosnap.conf
</span><span class="line">$ wget https://raw.github.com/ksperis/autosnap-rbd-shadow-copy/master/autosnap.sh
</span><span class="line">$ chmod +x autosnap.sh</span></code></pre></td></tr></tbody></table>

Create a block device :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd create myshare --size=1024
</span><span class="line">$ echo "myshare" &gt;&gt; /etc/ceph/rbdmap
</span><span class="line">$ /etc/init.d/rbdmap reload
</span><span class="line">[ ok ] Starting RBD Mapping: rbd/myshare.
</span><span class="line">[ ok ] Mounting all filesystems...done.</span></code></pre></td></tr></tbody></table>

Format the block device :

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
</pre></td><td class="code"><pre><code class=""><span class="line">$ mkfs.xfs /dev/rbd/rbd/myshare
</span><span class="line">log stripe unit (4194304 bytes) is too large (maximum is 256KiB)
</span><span class="line">log stripe unit adjusted to 32KiB
</span><span class="line">meta-data=/dev/rbd/rbd/myshare   isize=256    agcount=9, agsize=31744 blks
</span><span class="line">         =                       sectsz=512   attr=2, projid32bit=0
</span><span class="line">data     =                       bsize=4096   blocks=262144, imaxpct=25
</span><span class="line">         =                       sunit=1024   swidth=1024 blks
</span><span class="line">naming   =version 2              bsize=4096   ascii-ci=0
</span><span class="line">log      =internal log           bsize=4096   blocks=2560, version=2
</span><span class="line">         =                       sectsz=512   sunit=8 blks, lazy-count=1
</span><span class="line">realtime =none                   extsz=4096   blocks=0, rtextents=0</span></code></pre></td></tr></tbody></table>

Mount the share :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mkdir /myshare
</span><span class="line">$ echo "/dev/rbd/rbd/myshare /myshare xfs defaults 0 0" &gt;&gt; /etc/fstab
</span><span class="line">$ mount /myshare</span></code></pre></td></tr></tbody></table>

Add this section in your /etc/samba/smb.conf :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class=""><span class="line">[myshare]
</span><span class="line">    path = /myshare
</span><span class="line">    writable = yes
</span><span class="line">  vfs objects = shadow_copy2
</span><span class="line">  shadow:snapdir = .snapshots
</span><span class="line">  shadow:sort = desc</span></code></pre></td></tr></tbody></table>

Reload samba

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ /etc/init.d/samba reload</span></code></pre></td></tr></tbody></table>

Create snapshot directory and run the script :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mkdir -p /myshare/.snapshots
</span><span class="line">$ /etc/ceph/scripts/autosnap.sh
</span><span class="line">* Create snapshot for myshare: @GMT-2013.08.09-10.16.10-autosnap
</span><span class="line">synced, no cache, snapshot created.
</span><span class="line">* Shadow Copy to mount for rbd/myshare :
</span><span class="line">GMT-2013.08.09-10.14.44</span></code></pre></td></tr></tbody></table>

Verify that the first snapshot is correctly mount :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mount | grep myshare
</span><span class="line">/dev/rbd1 on /myshare type xfs (rw,relatime,attr2,inode64,sunit=8192,swidth=8192,noquota)
</span><span class="line">/dev/rbd2 on /myshare/.snapshots/@GMT-2013.08.09-10.14.44 type xfs (ro,relatime,nouuid,norecovery,attr2,inode64,sunit=8192,swidth=8192,noquota)</span></code></pre></td></tr></tbody></table>

Also, you can add this on crontab to run everyday the script :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ echo "00 0    * * *   root    /bin/bash /etc/ceph/scripts/autosnap.sh" &gt;&gt; /etc/crontab</span></code></pre></td></tr></tbody></table>
