---
title: "Map/unmap RBD device on boot/shutdown"
date: "2013-11-22"
author: "shan"
tags: 
  - "planet"
---

![](images/ceph-automount-at-boot.jpg "Map-unmap RBD device on boot-shutdown")

Quick how-to on mapping/unmapping a RBD device during startup and shutdown.

We are going to use an init script provided by the `ceph` package. During the boot sequence, the init script first looks at `/etc/rbdmap` and will map devices accordingly. Then, it will trigger `mount -a`. As soon as the system is halted or rebooted, the script will unmount and unmap the devices.

Since you are not going to map/unmap RBD devices from one of your Ceph node you have to download the init script and install it on the client machine.

Download the init script and add it to the boot sequence:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo wget https://raw.github.com/ceph/ceph/a4ddf704868832e119d7949e96fe35ab1920f06a/src/init-rbdmap -O /etc/init.d/rbdmap
</span><span class="line"><span class="nv">$ </span>sudo chmod +x /etc/init.d/rbdmap
</span><span class="line"><span class="nv">$ </span>sudo update-rc.d rbdmap defaults
</span><span class="line"> Adding system startup <span class="k">for</span> /etc/init.d/rbdmap ...
</span><span class="line">   /etc/rc0.d/K20rbdmap -&gt; ../init.d/rbdmap
</span><span class="line">   /etc/rc1.d/K20rbdmap -&gt; ../init.d/rbdmap
</span><span class="line">   /etc/rc6.d/K20rbdmap -&gt; ../init.d/rbdmap
</span><span class="line">   /etc/rc2.d/S20rbdmap -&gt; ../init.d/rbdmap
</span><span class="line">   /etc/rc3.d/S20rbdmap -&gt; ../init.d/rbdmap
</span><span class="line">   /etc/rc4.d/S20rbdmap -&gt; ../init.d/rbdmap
</span><span class="line">   /etc/rc5.d/S20rbdmap -&gt; ../init.d/rbdmap
</span><span class="line"><span class="nv">$ </span>sudo apt-get install ceph-common -y
</span></code></pre></td></tr></tbody></table>

Create the device:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo rbd -p leseb create boot --size 10240
</span></code></pre></td></tr></tbody></table>

Assuming the pool `leseb` is readable and writable by a user `leseb` who has the corresponding key.

Edit `/etc/ceph/rbdmap`:

```
# RbdDevice     Parameters
leseb/boot        id=leseb,keyring=/etc/ceph/ceph.client.leseb.keyring
```

Format your device:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo mkfs.xfs /dev/rbd/leseb/boot
</span><span class="line">log stripe unit <span class="o">(</span>4194304 bytes<span class="o">)</span> is too large <span class="o">(</span>maximum is 256KiB<span class="o">)</span>
</span><span class="line">log stripe unit adjusted to 32KiB
</span><span class="line">meta-data<span class="o">=</span>/dev/rbd/rbd/boot      <span class="nv">isize</span><span class="o">=</span>256    <span class="nv">agcount</span><span class="o">=</span>17, <span class="nv">agsize</span><span class="o">=</span>162816 <span class="nv">blks</span>
</span><span class="line">         <span class="o">=</span>                       <span class="nv">sectsz</span><span class="o">=</span>512   <span class="nv">attr</span><span class="o">=</span>2, <span class="nv">projid32bit</span><span class="o">=</span>0
</span><span class="line"><span class="nv">data</span>     <span class="o">=</span>                       <span class="nv">bsize</span><span class="o">=</span>4096   <span class="nv">blocks</span><span class="o">=</span>2621440, <span class="nv">imaxpct</span><span class="o">=</span><span class="nv">25</span>
</span><span class="line">         <span class="o">=</span>                       <span class="nv">sunit</span><span class="o">=</span>1024   <span class="nv">swidth</span><span class="o">=</span>1024 blks
</span><span class="line"><span class="nv">naming</span>   <span class="o">=</span>version 2              <span class="nv">bsize</span><span class="o">=</span>4096   ascii-ci<span class="o">=</span>0
</span><span class="line"><span class="nv">log</span>      <span class="o">=</span>internal log           <span class="nv">bsize</span><span class="o">=</span>4096   <span class="nv">blocks</span><span class="o">=</span>2560, <span class="nv">version</span><span class="o">=</span><span class="nv">2</span>
</span><span class="line">         <span class="o">=</span>                       <span class="nv">sectsz</span><span class="o">=</span>512   <span class="nv">sunit</span><span class="o">=</span>8 blks, lazy-count<span class="o">=</span>1
</span><span class="line"><span class="nv">realtime</span> <span class="o">=</span>none                   <span class="nv">extsz</span><span class="o">=</span>4096   <span class="nv">blocks</span><span class="o">=</span>0, <span class="nv">rtextents</span><span class="o">=</span>0
</span></code></pre></td></tr></tbody></table>

Then edit your fstab with:

```
/dev/rbd/leseb/boot /mnt/  xfs defaults,_netdev        0       0
```

Manual testing:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo /etc/init.d/rbdmap start
</span><span class="line"> * Starting RBD Mapping                                                          <span class="o">[</span> OK <span class="o">]</span>
</span><span class="line"> * Mounting all filesystems...                                                   <span class="o">[</span> OK <span class="o">]</span>
</span></code></pre></td></tr></tbody></table>

Verify:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo rbd showmapped
</span><span class="line">id pool   image snap device
</span><span class="line">1  leseb  boot  - /dev/rbd1
</span><span class="line">
</span><span class="line"><span class="nv">$ </span>sudo mount | grep mnt
</span><span class="line">/dev/rbd1 on /mnt <span class="nb">type </span>xfs <span class="o">(</span>rw,_netdev<span class="o">)</span>
</span></code></pre></td></tr></tbody></table>

  

> Obviously you definitely want to reboot your system to try it out :)
