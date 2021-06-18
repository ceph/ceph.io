---
title: "Ceph RBD With LXC Containers"
date: "2014-11-17"
author: "laurentbarbe"
tags: 
---

A simple way to secure your data with containers is to use a distributed storage such as Ceph for LXC root storage.

For exemple :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># lxc-create -n mycontainer -t debian -B rbd --pool rbd --rbd mycontainer --fstype ext4 --fssize 500</span>
</span></code></pre></td></tr></tbody></table>

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
<span class="line-number">38</span>
<span class="line-number">39</span>
<span class="line-number">40</span>
<span class="line-number">41</span>
<span class="line-number">42</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line">mke2fs 1.42.5 <span class="o">(</span>29-Jul-2012<span class="o">)</span>
</span><span class="line">Filesystem <span class="nv">label</span><span class="o">=</span>
</span><span class="line">OS <span class="nb">type</span>: Linux
</span><span class="line">Block <span class="nv">size</span><span class="o">=</span>1024 <span class="o">(</span><span class="nv">log</span><span class="o">=</span>0<span class="o">)</span>
</span><span class="line">Fragment <span class="nv">size</span><span class="o">=</span>1024 <span class="o">(</span><span class="nv">log</span><span class="o">=</span>0<span class="o">)</span>
</span><span class="line"><span class="nv">Stride</span><span class="o">=</span>4096 blocks, Stripe <span class="nv">width</span><span class="o">=</span>4096 blocks
</span><span class="line">128016 inodes, 512000 blocks
</span><span class="line">25600 blocks <span class="o">(</span>5.00%<span class="o">)</span> reserved <span class="k">for </span>the super user
</span><span class="line">First data <span class="nv">block</span><span class="o">=</span>1
</span><span class="line">Maximum filesystem <span class="nv">blocks</span><span class="o">=</span>67633152
</span><span class="line">63 block groups
</span><span class="line">8192 blocks per group, 8192 fragments per group
</span><span class="line">2032 inodes per group
</span><span class="line">Superblock backups stored on blocks:
</span><span class="line">  8193, 24577, 40961, 57345, 73729, 204801, 221185, 401409
</span><span class="line">
</span><span class="line">Allocating group tables: <span class="k">done                            </span>
</span><span class="line">Writing inode tables: <span class="k">done                            </span>
</span><span class="line">Creating journal <span class="o">(</span>8192 blocks<span class="o">)</span>: <span class="k">done</span>
</span><span class="line">Writing superblocks and filesystem accounting information: <span class="k">done </span>
</span><span class="line">
</span><span class="line">Note: Usually the template option is called with a configuration
</span><span class="line">file option too, mostly to configure the network.
</span><span class="line">For more information look at lxc.conf <span class="o">(</span>5<span class="o">)</span>
</span><span class="line">
</span><span class="line">debootstrap is /usr/sbin/debootstrap
</span><span class="line">Checking cache download in /var/cache/lxc/debian/rootfs-wheezy-amd64 ...
</span><span class="line">Copying rootfs to /var/lib/lxc/mycontainer/rootfs...Generating locales <span class="o">(</span>this might take a <span class="k">while</span><span class="o">)</span>...
</span><span class="line">  en_US.UTF-8... <span class="k">done</span>
</span><span class="line">Generation complete.
</span><span class="line">update-rc.d: using dependency based boot sequencing
</span><span class="line">update-rc.d: using dependency based boot sequencing
</span><span class="line">update-rc.d: using dependency based boot sequencing
</span><span class="line">update-rc.d: using dependency based boot sequencing
</span><span class="line">
</span><span class="line">Current default <span class="nb">time </span>zone: <span class="s1">'America/New_York'</span>
</span><span class="line">Local <span class="nb">time </span>is now:      Tue Nov 18 09:34:16 EST 2014.
</span><span class="line">Universal Time is now:  Tue Nov 18 14:34:16 UTC 2014.
</span><span class="line">
</span><span class="line">Root password is <span class="s1">'root'</span>, please change !
</span><span class="line"><span class="s1">'debian'</span> template installed
</span><span class="line"><span class="s1">'mycontainer'</span> created
</span></code></pre></td></tr></tbody></table>

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># mount | grep mycontainer</span>
</span><span class="line">/dev/rbd1 on /var/lib/lxc/mycontainer/rootfs <span class="nb">type </span>ext4 <span class="o">(</span>rw,relatime,stripe<span class="o">=</span>4096,data<span class="o">=</span>ordered<span class="o">)</span>
</span></code></pre></td></tr></tbody></table>

Diff file for lxc-create :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="c"># diff -u /usr/bin/lxc-create.orig /usr/bin/lxc-create</span>
</span></code></pre></td></tr></tbody></table>

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
<span class="line-number">38</span>
<span class="line-number">39</span>
<span class="line-number">40</span>
<span class="line-number">41</span>
<span class="line-number">42</span>
<span class="line-number">43</span>
<span class="line-number">44</span>
<span class="line-number">45</span>
<span class="line-number">46</span>
<span class="line-number">47</span>
<span class="line-number">48</span>
<span class="line-number">49</span>
<span class="line-number">50</span>
<span class="line-number">51</span>
<span class="line-number">52</span>
<span class="line-number">53</span>
<span class="line-number">54</span>
<span class="line-number">55</span>
<span class="line-number">56</span>
<span class="line-number">57</span>
<span class="line-number">58</span>
<span class="line-number">59</span>
<span class="line-number">60</span>
<span class="line-number">61</span>
<span class="line-number">62</span>
<span class="line-number">63</span>
<span class="line-number">64</span>
<span class="line-number">65</span>
<span class="line-number">66</span>
<span class="line-number">67</span>
<span class="line-number">68</span>
<span class="line-number">69</span>
<span class="line-number">70</span>
<span class="line-number">71</span>
<span class="line-number">72</span>
<span class="line-number">73</span>
</pre></td><td class="code"><pre><code class="diff"><span class="line"><span class="gd">--- /usr/bin/lxc-create.orig    2014-11-17 04:16:41.181942000 -0500</span>
</span><span class="line"><span class="gi">+++ /usr/bin/lxc-create  2014-11-17 04:35:27.225942000 -0500</span>
</span><span class="line"><span class="gu">@@ -24,6 +24,7 @@</span>
</span><span class="line">     echo "usage: lxc-create -n &lt;name&gt; [-f configuration] [-t template] [-h] [fsopts] -- [template_options]"
</span><span class="line">     echo "   fsopts: -B none"
</span><span class="line">     echo "   fsopts: -B lvm [--lvname lvname] [--vgname vgname] [--fstype fstype] [--fssize fssize]"
</span><span class="line"><span class="gi">+    echo "   fsopts: -B rbd [--pool poolname] [--rbd rbd] [--fstype fstype] [--fssize fssize]"</span>
</span><span class="line">     echo "   fsopts: -B btrfs"
</span><span class="line">     echo "           flag is not necessary, if possible btrfs support will be used"
</span><span class="line"> #    echo "   fsopts: -B union [--uniontype overlayfs]"
</span><span class="line"><span class="gu">@@ -64,7 +65,7 @@</span>
</span><span class="line"> }
</span><span class="line">
</span><span class="line"> shortoptions='hn:f:t:B:'
</span><span class="line"><span class="gd">-longoptions='help,name:,config:,template:,backingstore:,fstype:,lvname:,vgname:,fssize:'</span>
</span><span class="line"><span class="gi">+longoptions='help,name:,config:,template:,backingstore:,fstype:,lvname:,vgname:,pool:,rbd:,fssize:'</span>
</span><span class="line"> localstatedir=/var
</span><span class="line"> lxc_path=${localstatedir}/lib/lxc
</span><span class="line"> bindir=/usr/bin
</span><span class="line"><span class="gu">@@ -119,6 +120,16 @@</span>
</span><span class="line">      vgname=$1
</span><span class="line">      shift
</span><span class="line">      ;;
</span><span class="line"><span class="gi">+        --pool)</span>
</span><span class="line"><span class="gi">+        shift</span>
</span><span class="line"><span class="gi">+        pool=$1</span>
</span><span class="line"><span class="gi">+        shift</span>
</span><span class="line"><span class="gi">+        ;;</span>
</span><span class="line"><span class="gi">+        --rbd)</span>
</span><span class="line"><span class="gi">+        shift</span>
</span><span class="line"><span class="gi">+        rbd=$1</span>
</span><span class="line"><span class="gi">+        shift</span>
</span><span class="line"><span class="gi">+        ;;</span>
</span><span class="line">      --fstype)
</span><span class="line">      shift
</span><span class="line">      fstype=$1
</span><span class="line"><span class="gu">@@ -161,7 +172,7 @@</span>
</span><span class="line"> fi
</span><span class="line">
</span><span class="line"> case "$backingstore" in
</span><span class="line"><span class="gd">- lvm|none|btrfs|_unset) :;;</span>
</span><span class="line"><span class="gi">+    lvm|rbd|none|btrfs|_unset) :;;</span>
</span><span class="line">     *) echo "'$backingstore' is not known ('none', 'lvm', 'btrfs')"
</span><span class="line">         usage
</span><span class="line">         exit 1
</span><span class="line"><span class="gu">@@ -216,6 +227,13 @@</span>
</span><span class="line">         echo "please delete it (using \"lvremove $rootdev\") and try again"
</span><span class="line">         exit 1
</span><span class="line">     fi
</span><span class="line"><span class="gi">+elif [ "$backingstore" = "rbd" ]; then</span>
</span><span class="line"><span class="gi">+    which rbd &gt; /dev/null</span>
</span><span class="line"><span class="gi">+    if [ $? -ne 0 ]; then</span>
</span><span class="line"><span class="gi">+        echo "rbd command not found. Please install ceph-common package"</span>
</span><span class="line"><span class="gi">+        exit 1</span>
</span><span class="line"><span class="gi">+    fi</span>
</span><span class="line"><span class="gi">+    rootdev=/dev/rbd/$pool/$rbd</span>
</span><span class="line"> elif [ "$backingstore" = "btrfs" ]; then
</span><span class="line">     mkdir "$lxc_path/$lxc_name"
</span><span class="line">     if ! out=$(btrfs subvolume create "$rootfs" 2&gt;&amp;1); then
</span><span class="line"><span class="gu">@@ -257,6 +275,14 @@</span>
</span><span class="line">     mkfs -t $fstype $rootdev || exit 1
</span><span class="line">     mount -t $fstype $rootdev $rootfs
</span><span class="line"> fi
</span><span class="line"><span class="gi">+</span>
</span><span class="line"><span class="gi">+if [ $backingstore = "rbd" ]; then</span>
</span><span class="line"><span class="gi">+    [ -d "$rootfs" ] || mkdir $rootfs</span>
</span><span class="line"><span class="gi">+    rbd create $pool/$rbd --size=$fssize || exit 1</span>
</span><span class="line"><span class="gi">+    rbd map $pool/$rbd || exit 1</span>
</span><span class="line"><span class="gi">+    mkfs -t $fstype $rootdev || exit 1</span>
</span><span class="line"><span class="gi">+    mount -t $fstype $rootdev $rootfs</span>
</span><span class="line"><span class="gi">+fi</span>
</span><span class="line">
</span><span class="line"> if [ ! -z $lxc_template ]; then
</span></code></pre></td></tr></tbody></table>

If you want to make persistent after reboot, you must add rbd in /etc/ceph/rbdmap and add line in fstab.
