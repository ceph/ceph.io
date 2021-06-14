---
title: "Want to Install Ceph, but afraid of Ansible?"
date: "2017-12-11"
author: "admin"
tags: 
  - "ceph"
---

  

  
There is no doubt that [Ansible](https://github.com/ansible/ansible) is a pretty cool automation engine for provisioning and configuration management. [ceph-ansible](https://github.com/ceph/ceph-ansible) builds on this versatility to deliver what is probably the most flexible Ceph deployment tool out there. However, some of you may not want to get to grips with Ansible before you install Ceph...weird right?

  
No, not really.  
  
[![](images/autopilot2.png)](https://2.bp.blogspot.com/-qwNm9p1rQ30/Wi2tgjiTNpI/AAAAAAAAA-U/-uLAvJqSw_E9aJerti3KBiGKAyNCJG28gCLcBGAs/s1600/autopilot2.png)  

If you're short on time, or just want a cluster to try ceph for the first time, a more guided installation approach may help. So I started a project called [ceph-ansible-copilot](https://github.com/pcuzner/ceph-ansible-copilot). 

  

The idea is simple enough; wrap the ceph-ansible playbook with a text GUI. Very 1990's, I know, but now instead of copying and editing various files you simply start the copilot tool, enter the details and click 'deploy'. The playbook runs in the background within the GUI and any errors are shown there and then...no more drowning in an ocean of scary ansible output :)

  
The features and workflows of the UI are described in the project page's [README](https://github.com/pcuzner/ceph-ansible-copilot/blob/master/README.md) file.  
  

Enough rambling, lets look at how you test this stuff out. The process is fairly straight forward;

1. configure some hosts for Ceph
2. create the Ansible environment
3. run copilot

The process below describes each of these steps using [CentOS7](https://www.centos.org/) as the deployment target for Ansible and the Ceph cluster nodes.  

**1\. Configure Some Hosts for Ceph**  

Call me lazy, but I'm not going to tell you how to build vm's or physical servers. To follow along, the bare minimum you need are a few virtual machines - as long as they have some disks on them for Ceph, you're all set!

  
**2\. Create the Ansible environment**  

Typically for a Ceph cluster you'll want to designate a host as the deployment or admin host. The admin host is just a deployment manager, so it can be a virtual machine, a container or even a real (gasp!) server. All that really matters is that your admin host has network connectivity to the hosts you'll be deploying ceph to.  
  

On the admin host, perform these tasks (copilot needs **ansible 2.4** or above)  

<table><tbody><tr><td>&gt; yum install git ansible python-urwid -y</td></tr></tbody></table>

Install ceph-ansible (full installation steps can be found [here](http://docs.ceph.com/ceph-ansible/master/))  

<table><tbody><tr><td>&gt; cd /usr/share<br>&gt; git clone https://github.com/ceph/ceph-ansible.git<br>&gt; cd ceph-ansible<br>&gt; git checkout master</td></tr></tbody></table>

Setup passwordless ssh between the admin host and for candidate ceph hosts  

<table><tbody><tr><td>&gt; ssh-keygen<br>&gt; ssh-copy-id root@&lt;ceph_node&gt;</td></tr></tbody></table>

On the admin host install copilot  

<table><tbody><tr><td>&gt; cd ~<br>&gt; git clone https://github.com/pcuzner/ceph-ansible-copilot.git<br>&gt; cd ceph-ansible-copilot<br>&gt; python setup.py install&nbsp;</td></tr></tbody></table>

**3\. Run copilot**  

The main playbook for ceph-ansible is in /usr/share/ceph-ansible - this is where you need to run copilot from (_it will complain if you try to run it in some other place!_)

<table><tbody><tr><td>&gt; cd /usr/share/ceph-ansible<br>&gt; copilot</td></tr></tbody></table>

Then follow the UI..  
**Example Run**  

Here's a screen capture showing the whole process, so you can see what you get before you hit the command line.

  

  

  

The video shows the deployment of a small 3 node ceph cluster, 6 OSDs, a radosgw (for S3), and an MDS for cephfs testing. It covers the configuration of the admin host, the copilot UI and finally a quick look at the resulting ceph cluster. The video is 9mins in length, but for those of us with short attention spans, here's the timeline so you can jump to the areas that interest you.  
  
00:00 Pre-requisite rpm installs on the admin host  
01:12 Installing ceph-ansible from github  
01:52 Installing copilot  
02:58 Setting up passwordless ssh from the admin host to the candidate ceph hosts  
04:04 Ceph hosts before deployment  
05:04 Starting copilot  
08:10 Copilot complete, review the Ceph hosts  
  

  
  
**What's next?**  
More testing...on more and varied hardware...  
  

So far I've only tested 'simple' deployments using the packages from ceph.com (community deployments) against a CentOS target. So like I said, more testing is needed, a lot more...but for now there's enough of the core code there for me to claim a victory and write a blog post!

  

Aside from the testing, these are the kinds of things that I'd like to see copilot handle  

- **collocation rules** (which daemons can safely run together)
- **resource warnings** (if you have 10 HDD's but not enough RAM, or CPU...issue a warning)
- handle the passwordless **ssh setup**. copilot already checks for passwordless ssh, so instead of leaving it to the admin to resolve any issues, just add another page to the UI.

That's my wishlist - what would you like copilot to do? Leave a comment, or drop by the project on github.  
  
**Demo'd Versions**  

- copilot 0.9.1
- ceph-ansible MASTER as at December 11th 2017
- ansible 2.4.1 on CentOS

  
  
  
  

Source: Paul Cuzner ([Want to Install Ceph, but afraid of Ansible?](http://opensource-storage.blogspot.com/2017/12/want-to-install-ceph-but-afraid-of.html))
