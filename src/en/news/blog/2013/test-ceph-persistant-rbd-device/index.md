---
title: "Test Ceph Persistant Rbd Device"
date: "2013-08-03"
author: "laurentbarbe"
tags: 
  - "planet"
---

## Create persistant rbd device

Create block device and map it with /etc/ceph/rbdmap

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd create rbd/myrbd --size=1024
</span><span class="line">$ echo "rbd/myrbd" &gt;&gt; /etc/ceph/rbdmap
</span><span class="line">$ service rbdmap reload
</span><span class="line">[ ok ] Starting RBD Mapping: rbd/myrbd.
</span><span class="line">[ ok ] Mounting all filesystems...done.</span></code></pre></td></tr></tbody></table>

View rbd mapped :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd showmapped
</span><span class="line">id pool image snap device    
</span><span class="line">1  rbd  myrbd - /dev/rbd1</span></code></pre></td></tr></tbody></table>

Create FS and mount :

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
</pre></td><td class="code"><pre><code class=""><span class="line">$ mkfs.xfs /dev/rbd/rbd/myrbd 
</span><span class="line">log stripe unit (4194304 bytes) is too large (maximum is 256KiB)
</span><span class="line">log stripe unit adjusted to 32KiB
</span><span class="line">meta-data=/dev/rbd/rbd/myrbd     isize=256    agcount=9, agsize=31744 blks
</span><span class="line">         =                       sectsz=512   attr=2, projid32bit=0
</span><span class="line">data     =                       bsize=4096   blocks=262144, imaxpct=25
</span><span class="line">         =                       sunit=1024   swidth=1024 blks
</span><span class="line">naming   =version 2              bsize=4096   ascii-ci=0
</span><span class="line">log      =internal log           bsize=4096   blocks=2560, version=2
</span><span class="line">         =                       sectsz=512   sunit=8 blks, lazy-count=1
</span><span class="line">realtime =none                   extsz=4096   blocks=0, rtextents=0
</span><span class="line">
</span><span class="line">$ mkdir -p /mnt/myrbd
</span><span class="line">$ blkid | grep rbd1
</span><span class="line">/dev/rbd1: UUID="a07e969e-bb1a-4921-9171-82cf7a737a69" TYPE="xfs"
</span><span class="line">$ echo "UUID=a07e969e-bb1a-4921-9171-82cf7a737a69 /mnt/myrbd xfs defaults 0 0" &gt;&gt; /etc/fstab
</span><span class="line">$ mount -a</span></code></pre></td></tr></tbody></table>

Check :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mount | grep rbd1
</span><span class="line">/dev/rbd1 on /mnt/myrbd type xfs (rw,relatime,attr2,inode64,sunit=8192,swidth=8192,noquota)</span></code></pre></td></tr></tbody></table>

## Test snapshot

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ touch /mnt/myrbd/v1</span></code></pre></td></tr></tbody></table>

Make snapshot :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ sync &amp;&amp; xfs_freeze -f /mnt/
</span><span class="line">$ rbd snap create rbd/myrbd@snap1
</span><span class="line">$ xfs_freeze -u /mnt/</span></code></pre></td></tr></tbody></table>

Change a file :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mv /mnt/myrbd/v1 /mnt/myrbd/v2</span></code></pre></td></tr></tbody></table>

Mount snapshot in RO :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mkdir -p /mnt/myrbd@snap1
</span><span class="line">$ rbd map rbd/myrbd@snap1
</span><span class="line">$ mount -t xfs -o ro,norecovery,nouuid "/dev/rbd/rbd/myrbd@snap1" "/mnt/myrbd@snap1"</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ls "/mnt/myrbd"
</span><span class="line">total 0
</span><span class="line">v2</span></code></pre></td></tr></tbody></table>

OK.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ls "/mnt/myrbd@snap1"
</span><span class="line">total 0</span></code></pre></td></tr></tbody></table>

Nothing ??? Something went wrong with the sync ?

Try again :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ sync &amp;&amp; xfs_freeze -f /mnt/
</span><span class="line">$ rbd snap create rbd/myrbd@snap2
</span><span class="line">$ xfs_freeze -u /mnt/
</span><span class="line">$ mkdir -p /mnt/myrbd@snap2
</span><span class="line">$ rbd map rbd/myrbd@snap2
</span><span class="line">$ mount -t xfs -o ro,norecovery,nouuid "/dev/rbd/rbd/myrbd@snap2" "/mnt/myrbd@snap2"</span></code></pre></td></tr></tbody></table>

Move again the file.

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ mv /mnt/myrbd/v2 /mnt/myrbd/v3</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ls /mnt/myrbd@snap2
</span><span class="line">total 0
</span><span class="line">v2
</span><span class="line">$ ls /mnt/myrbd
</span><span class="line">total 0
</span><span class="line">v3</span></code></pre></td></tr></tbody></table>

All right.

Stop rbdmap (will remove all rbd mapped device)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ service rbdmap remove</span></code></pre></td></tr></tbody></table>

Remove line added in /etc/ceph/rbdmap

Remove myrbd :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ rbd snap purge rbd/myrbd
</span><span class="line">Removing all snapshots: 100% complete...done.
</span><span class="line">$ rbd rm rbd/myrbd
</span><span class="line">Removing image: 100% complete...done.</span></code></pre></td></tr></tbody></table>
