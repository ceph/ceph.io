---
title: "Using Ceph-deploy"
date: "2013-07-30"
author: "syndicated"
tags: 
---

## Install the ceph cluster

### On each node :

create a user “ceph” and configure sudo for nopassword :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ useradd -d /home/ceph -m ceph
</span><span class="line">$ passwd ceph
</span><span class="line">$ echo "ceph ALL = (root) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/ceph
</span><span class="line">$ chmod 0440 /etc/sudoers.d/ceph</span></code></pre></td></tr></tbody></table>

Update hosts file

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ vim /etc/hosts
</span><span class="line">192.168.0.100       cephnode-01 cephnode-01.local
</span><span class="line">192.168.0.101       cephnode-02 cephnode-02.local
</span><span class="line">192.168.0.102       cephnode-03 cephnode-03.local
</span><span class="line">192.168.0.103       cephnode-04 cephnode-04.local
</span><span class="line">192.168.0.104       cephnode-05 cephnode-05.local</span></code></pre></td></tr></tbody></table>

### On admin server

(for me on cephnode-01)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ ssh-keygen</span></code></pre></td></tr></tbody></table>

Deploy the key on each node

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ cluster="cephnode-01 cephnode-02 cephnode-03 cephnode-04 cephnode-05"
</span><span class="line">$ for i in $cluster; do
</span><span class="line">    ssh-copy-id ceph@$i
</span><span class="line">  done</span></code></pre></td></tr></tbody></table>

Add option on ssh config to connect with ceph user :

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ vim /root/.ssh/config
</span><span class="line">Host ceph*
</span><span class="line">User ceph</span></code></pre></td></tr></tbody></table>

Install ceph-deploy (Dumpling Version)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
</pre></td><td class="code"><pre><code class=""><span class="line">$ wget -q -O- 'https://ceph.com/git/?p=ceph.git;a=blob_plain;f=keys/release.asc' | sudo apt-key add -
</span><span class="line">$ echo deb http://ceph.com/debian-dumpling/ $(lsb_release -sc) main | sudo tee /etc/apt/sources.list.d/ceph.list
</span><span class="line">$ apt-get update
</span><span class="line">$ apt-get install python-pkg-resources python-setuptools ceph-deploy</span></code></pre></td></tr></tbody></table>

Install ceph on the cluster :

Before you need to create partition on ssd device (if use seperate journal)

For my exemple, I use :

```
sda 1: system partition
    2: swap
    5: osd journal (10 GB)
    6: osd journal (10 GB)
    7: osd journal (10 GB)
sdb  : osd
sdc  : osd
sdd  : osd
```

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
</pre></td><td class="code"><pre><code class=""><span class="line">$ mkdir ceph-deploy; cd ceph-deploy
</span><span class="line">$ ceph-deploy install $cluster
</span><span class="line">$ ceph-deploy new cephnode-01 cephnode-02 cephnode-03
</span><span class="line">$ ceph-deploy --overwrite-conf mon create cephnode-01 cephnode-02 cephnode-03
</span><span class="line">$ ceph-deploy gatherkeys cephnode-01
</span><span class="line">$ ceph-deploy osd create \
</span><span class="line">    cephnode-01:/dev/sdb:/dev/sda5 \
</span><span class="line">    cephnode-01:/dev/sdc:/dev/sda6 \
</span><span class="line">    cephnode-01:/dev/sdd:/dev/sda7 \
</span><span class="line">    cephnode-02:/dev/sdb:/dev/sda5 \
</span><span class="line">    cephnode-02:/dev/sdc:/dev/sda6 \
</span><span class="line">    cephnode-02:/dev/sdd:/dev/sda7 \
</span><span class="line">    cephnode-03:/dev/sdb:/dev/sda5 \
</span><span class="line">    cephnode-03:/dev/sdc:/dev/sda6 \
</span><span class="line">    cephnode-03:/dev/sdd:/dev/sda7 \
</span><span class="line">    cephnode-04:/dev/sdb:/dev/sda5 \
</span><span class="line">    cephnode-04:/dev/sdc:/dev/sda6 \
</span><span class="line">    cephnode-04:/dev/sdd:/dev/sda7 \
</span><span class="line">    cephnode-05:/dev/sdb:/dev/sda5 \
</span><span class="line">    cephnode-05:/dev/sdc:/dev/sda6 \
</span><span class="line">    cephnode-05:/dev/sdd:/dev/sda7</span></code></pre></td></tr></tbody></table>

## Destroy cluster and remove all data

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
</pre></td><td class="code"><pre><code class=""><span class="line">$ ceph-deploy purgedata $cluster
</span><span class="line">$ ceph-deploy purge $cluster
</span><span class="line">
</span><span class="line">$ for host in $cluster
</span><span class="line">  do
</span><span class="line">    ssh $host &lt;&lt;EOF
</span><span class="line">      sudo dd if=/dev/zero of=/dev/sdb bs=1M count=100
</span><span class="line">      sudo dd if=/dev/zero of=/dev/sdc bs=1M count=100
</span><span class="line">      sudo dd if=/dev/zero of=/dev/sdd bs=1M count=100
</span><span class="line">      sudo sgdisk -g --clear /dev/sdb
</span><span class="line">      sudo sgdisk -g --clear /dev/sdc
</span><span class="line">      sudo sgdisk -g --clear /dev/sdd
</span><span class="line">    EOF
</span><span class="line">  done</span></code></pre></td></tr></tbody></table>
