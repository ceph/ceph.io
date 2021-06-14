---
title: "Play with Ceph - Vagrant Box"
date: "2013-04-22"
author: "shan"
tags: 
---

![](images/vagrant-logo.png "Play with Ceph - Vagrant Box")

Materials to start playing with Ceph. This Vagrant box contains a all-in-one Ceph installation.

# I. Setup

First [Download](http://downloads.vagrantup.com/) and [Install](http://docs.vagrantup.com/v2/installation/index.html) Vagrant.

Download the Ceph box: [here](https://www.dropbox.com/s/hn28qgjn59nud6h/ceph-all-in-one.box). This box contains one virtual machine:

- Ceph VM contains 2 OSDs (1 disk each), 1 MDS, 1 MON, 1 RGW. A modified CRUSH Map, it simply represents a full datacenter and applies a replica per OSD
- VagrantFile for both VM client and ceph
- Other include files

Download an extra VM for the client [here](http://dl.dropbox.com/u/1537815/precise64.box), note that Debian and Red Hat based system work perfectly, thus it’s up to you:

- Client: just an Ubuntu installation

Initialize the Ceph box:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>wget https://www.dropbox.com/s/hn28qgjn59nud6h/ceph-all-in-one.box
</span><span class="line">...
</span><span class="line">...
</span><span class="line"><span class="nv">$ </span>vagrant box add big-ceph ceph-all-in-one.box
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Downloading with Vagrant::Downloaders::File...
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Copying box to temporary location...
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Extracting box...
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Verifying box...
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Cleaning up downloaded box...
</span></code></pre></td></tr></tbody></table>

Initialize the Client box:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>wget http://dl.dropbox.com/u/1537815/precise64.box
</span><span class="line"><span class="nv">$ </span>vagrant box add ubuntu-12.04.1 precise64.box
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Downloading with Vagrant::Downloaders::File...
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Copying box to temporary location...
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Extracting box...
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Verifying box...
</span><span class="line"><span class="o">[</span>vagrant<span class="o">]</span> Cleaning up downloaded box...
</span></code></pre></td></tr></tbody></table>

Check your boxes:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>vagrant box list
</span><span class="line">ceph-all-in-one
</span><span class="line">ubuntu-12.04.1
</span></code></pre></td></tr></tbody></table>

Import all the files from the box:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>mkdir setup
</span><span class="line"><span class="nv">$ </span>cp /Users/leseb/.vagrant.d/boxes/ceph-all-in-one/include/* setup/
</span><span class="line"><span class="nv">$ </span>mv setup/_Vagrantfile Vagrantfile
</span></code></pre></td></tr></tbody></table>

In order to make the setup easy, I assume that your working directory is `$HOME/ceph`. At the end, your tree directory looks like this:

```
.
├── Vagrantfile
├── ceph-all-in-one.box
├── precise64.box
└── setup
    ├── ceph.conf
    ├── ceph.sh
    └── keyring
```

  

# II. Start it!

Check the state of your virtual machines:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>vagrant status
</span><span class="line">Current VM states:
</span><span class="line">
</span><span class="line">client                   poweroff
</span><span class="line">ceph                     poweroff
</span><span class="line">
</span><span class="line">This environment represents multiple VMs. The VMs are all listed
</span><span class="line">above with their current state. For more information about a specific
</span><span class="line">VM, run <span class="sb">`</span>vagrant status NAME<span class="sb">`</span>.
</span></code></pre></td></tr></tbody></table>

Eventually run them:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>vagrant up ceph <span class="o">&amp;&amp;</span> vagrant up client
</span><span class="line">...
</span><span class="line">...
</span></code></pre></td></tr></tbody></table>

The next time, you’ll run the client, run it this way to don’t re-provision the machine:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>vagrant up --no-provision client
</span></code></pre></td></tr></tbody></table>

Eventually SSH on your client:

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
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>vagrant ssh client
</span><span class="line">...
</span><span class="line">
</span><span class="line">vagrant@ceph:~<span class="nv">$ </span>sudo ceph -s
</span><span class="line">   health HEALTH_OK
</span><span class="line">   monmap e3: 1 mons at <span class="o">{</span><span class="nv">1</span><span class="o">=</span>192.168.251.100:6790/0<span class="o">}</span>, election epoch 1, quorum 0 1
</span><span class="line">   osdmap e179: 2 osds: 2 up, 2 in
</span><span class="line">    pgmap v724: 96 pgs: 96 active+clean; 9199 bytes data, 2071 MB used, 17906 MB / 19978 MB avail; 232B/s wr, 0op/s
</span><span class="line">   mdsmap e54: 1/1/1 up <span class="o">{</span><span class="nv">0</span><span class="o">=</span><span class="nv">0</span><span class="o">=</span>up:active<span class="o">}</span>
</span><span class="line">
</span><span class="line">vagrant@ceph:~<span class="nv">$ </span>sudo ceph osd tree
</span><span class="line"><span class="c"># id  weight  type name up/down reweight</span>
</span><span class="line">-1  2 root default
</span><span class="line">-4  2   datacenter dc
</span><span class="line">-5  2     room laroom
</span><span class="line">-6  2       row larow
</span><span class="line">-3  2         rack lerack
</span><span class="line">-2  2           host ceph
</span><span class="line">0 1             osd.0 up  1
</span><span class="line">1 1             osd.1 up  1
</span></code></pre></td></tr></tbody></table>

  

# III. Bonus upgrades

## III.1. Ceph upgrades

It’s fairly easy to upgrade the box to last stable version Cuttlefish. For this simply edit `/etc/apt/sources.list.d/ceph.list/ceph.list` with the following:

```
deb http://ceph.com/debian-cuttlefish/ precise main
```

Then run:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>sudo apt-get update <span class="o">&amp;&amp;</span> apt-get install ceph
</span><span class="line"><span class="nv">$ </span>sudo service ceph restart
</span><span class="line"><span class="nv">$ </span>sudo ceph -v
</span><span class="line">ceph version 0.61 <span class="o">(</span>237f3f1e8d8c3b85666529860285dcdffdeda4c5<span class="o">)</span>
</span></code></pre></td></tr></tbody></table>

## III.2. Vagrant version 2

Thanks to freshteapot.

Vagrant file:

```
Vagrant.configure("2") do |config|

  config.vm.define :ceph do |role|
    role.vm.box = "big-ceph"
    role.vm.network :private_network, ip: "192.168.251.100"
    role.vm.hostname = "ceph"
  end

  config.vm.define :client do |role|
    role.vm.box = "ubuntu1304"
    role.vm.hostname = "ceph-client"
    role.vm.provision :shell, :path => "setup/ceph.sh"
    role.vm.network :private_network, ip: "192.168.251.101"
  end

end
```

Then run:

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
</pre></td><td class="code"><pre><code class="bash"><span class="line"><span class="nv">$ </span>vagrant halt <span class="o">[</span>vm-name<span class="o">]</span>
</span><span class="line"><span class="nv">$ </span>vagrant up <span class="o">[</span>vm-name<span class="o">]</span>
</span></code></pre></td></tr></tbody></table>

  

R Note: if for some reasons you get a status were only 1/2 OSDs are up, just restart the mon. This should do the trick :-).

  

> I use this box everyday for all my test, it’s quite handy to destroy and rebuild it within a minute. Build, destroy, build destroy, I think you got it! Hope it ;-)
