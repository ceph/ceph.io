---
title: "Un-installing OpenStack RDO"
date: "2015-07-19"
author: "syndicated"
tags: 
---

![Uninstalling OpenStack](images/uninstalling-openstack-rdo.jpeg "Uninstalling OpenStack")

RedHat Distribution of OpenStack ( [RDO](https://www.rdoproject.org/) ) is one of the most popular openstack distribution for test, dev and production environments. Deploying OpenStack infrastructure using RDO is fairly easy.

However there is no automated [uninstall process for RDO](https://www.rdoproject.org/Uninstalling_RDO) (or OpenStack in general).

With the help of this blog I will share my secret sauce that I personally use to uninstall / remove openstack from my development & test environments. This saves me from reinstalling the entire OS and over the OS configurations + it saves time.

# Uninstalling RDO

- Take necessary backup of your configuration files ( if you like )
- Its advisable to re-read this script before execution ( no blame game )
- Be extra cautious for production environments.

## Get the script and make it executable

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
</pre></td><td class="code"><pre><code class="sh"><span class="line">git clone https://gist.github.com/7a9f1f62c06318a17dad.git
</span><span class="line"><span class="nb">cd </span>7a9f1f62c06318a17dad
</span><span class="line">chmod +x uninstall_rdo.sh
</span></code></pre></td></tr></tbody></table>

[Link to script](https://gist.github.com/ksingh7/7a9f1f62c06318a17dad)

## Boooooom

- Read the script; change it if you want to
- Execute this script on all of your openstack nodes, whether its compute, controller or network node (one by one)

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
</pre></td><td class="code"><pre><code class="sh"><span class="line">sh uninstall_rdo.sh
</span></code></pre></td></tr></tbody></table>

- OpenStack RDO should have removed at this point and you are good to re-install it.

> YAY…. That was easy ;-)
