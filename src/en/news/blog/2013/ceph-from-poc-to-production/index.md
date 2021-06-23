---
title: "Ceph from PoC to Production"
date: "2013-01-14"
author: "shan"
tags: 
  - "ceph-user-story"
---

[![](images/ceph-poc-prod-460x197.jpg)](http://ceph.com/user-story/ceph-from-poc-to-production/attachment/ceph-poc-prod/)

Through this article I’m delighted to introduce a new category on the Ceph blog called User Story. The aim of this category is to offer general feedback to centralized users . The structure of the article is as follows:

1. Introduction: who am i and what I am doing
2. Company introduction and business (not mandatory)
3. Ceph use case: what do you use Ceph for?
4. Ceph in action! : How Ceph performs in your infrastructure, your hardware setup, technical recommendations, and shares your tips and tricks!
5. Conclusion, general thoughts about Ceph, good/bad things

Since you have the whole gist of the article, let’s start!

For the people who don’t read [my blog](http://sebastien-han.fr/blog/ "my blog"), I’ve been blogging for almost 2 years now, however I’ve been really active and focused since March 2012. This date is not really a coincidence; it’s when my final year internship started. My point of interest is currently directed towards OpenStack, Ceph and Pacemaker.

### The company: [Stone-IT](http://www.stone-it.com)

[Stone-IT](http://www.stone-it.com) is a reliable service provider for organizations that run Linux and open source software business. They design and build highly available Linux platforms for websites and applications and they manage large Linux infrastructures. 2012 was a critical year for [Stone-IT](http://www.stone-it.com). A new company called Smile recently bought them out. Merging, as we can imagine, is not always a trivial affair, especially for the internal management of the organization concerned and inter-agency communication. In addition to this, the current Linux-Cloud has reached its limit in terms of resources available like computers and space. Thanks to Smile they also have acquired some new customers, which have dramatically increased the load on their Cloud. I was recruited during February 2012, so was aware of those problems earlier. Thus I quickly started to work on some solutions. Basically, they needed to find a new core engine for their cloud platform; this will lead to a Linux-Cloud 2.0.

Finally I started my internship in April 2012; I have been doing a lot of research and development on several subjects:

- Open Source Cloud Management Platform
- Open Source Storage Solutions

The mission was well defined; I had to investigate those two topics, elect a technology, design a viable concept and then build the next platform in production based on this research.

### How do we use Ceph?

Since most of our business is based on hosting and maintaining websites, we need a distributed filesystem to bring webservers with consistent data. Our conception is that developers have admin virtual machines where they can put new codes and test them in a pre-production environment. When tests are done they can deliver their updates to the NFS share, which makes new files ‘instantly’ available on every web virtual. This is how things are managed at [Stone-IT](http://www.stone-it.com). I guess it’s a pretty standard method while working with a lot of webservers. As I mentioned earlier, I had to investigate CMP and storage solutions. Ideally both should be compatible in terms of features and integration and one should be able to take advantage of the other. NFS is a viable solution for age, the original plan wasn’t to drop NFS but as an innovative company we wanted to open our business and try to do some new stuff. Thus, I started to evaluate quite a lot of Distributed Filesystems, I will spare you deep technical details but the main software were:

- Ceph
- GlusterFS
- MooseFS

For the CMP part, it was pretty clear that we will use [OpenStack](http://www.openstack.org). In order to make things ideal I had a look at the drivers available for (the old) nova-volume. This is where I came across the Ceph driver. I then started to evaluate Ceph, which eventually led to my article [Introducing Ceph to OpenStack](http://www.sebastien-han.fr/blog/2012/06/10/introducing-ceph-to-openstack/), from which I received a lot of nice reviews and feedback. The original idea was to use CephFS to get rid of NFS, I tried it and as the article attests, I made some nice think working with it like the KVM live migration. However, even if things had gone fine for me I couldn’t have taken the risk to put something in production that core developers hadn’t yet recommended. Things didn’t really change in my head, I ended up with a little temporary workaround in order to continue to use Ceph. Basically we have our Ceph backend and in front of it two servers. On those 2 servers, we map RBD devices; devices that are re-exported by NFS, then each web virtual mounts the share. This might sound like overkill and tricky (ok it’s tricky), but it’s perfectly stable and performance is not that bad. This result is more or less what I described in my article [NFS over RBD](http://www.sebastien-han.fr/blog/2012/07/06/nfs-over-rbd/).

### Ceph in action!

Our infrastructure is not that big, because we are not a big company and we didn’t have the budget of a big company either!

Performance corner, I made **a lot** of benchmarks. Really, a lot. Maybe too many, but after all those tests, the only thing that I can say about Ceph performance is that you should not worry about it. If you know the design you should not be surprised because they are just as expected. Ceph won’t be the bottleneck; it delivers the maximum performance that your hardware and network can offer.

Now let’s bring some details about the hardware we use:

4 storage nodes:

- HP ProLiant DL360G7 1x E5606/  2.13GHz 4C/ 4Gb/ P410i/ ZM/ 4 SFF/ 1x  460W PSU – Entry Model
- HP PSU 460W-F/DL385 G5P
- HP 72GB 15K SAS 2.5inch SFF 6G DP Enterprise HDD
- HP 600GB x3 10K SAS 2.5inch SFF 6G DP Enterprise HDD
- HP DL360G6 SFF HD BKPLN KIT .
- HP 2GB x11 PC3-10600 Registered CAS 9 Dual Rank DRAM Memory Kit (22GB)
- HP 256MB P-Series Cache Upgrade
- 2 SSD Vertex 4 60GB in RAID 1
- Ubuntu 12.04
- Ceph Argonaut 0.48.2
- 11 OSDs, 6703 GB available

Network specification:

- HP Pro Curve Switch 2510G-48; 1G network

Eventually before going live you might like those little tips/best practices:

- Use a logical volume of 10G for the monitor directory (as recommend in the [official documentation](http://ceph.com/docs/master/install/hardware-recommendations/), see Data Storage section)
- Increase the osdmax value
- Set “filestore flusher” option to false, in your \[osd\] section
- Set a number of PG-per-pool according to the calculation from the [Ceph official documentation](http://ceph.com/docs/master/cluster-ops/placement-groups/)
- By default, each object is replicated 2 times, you might want to change this behavior to 3. This value can be changed later after the creation of the pool but it’s quite handy to set it as default. Put the following flag in the \[mon\] section of your ceph.conf: “osd pool default size = 3″
- Enable writeback cache mode on your disk controller, **only if your controller is battery-backed**
- Use XFS for the OSD filesystem with the following recommended options: noatime,nodiratime,logbsize=256k,logbufs=8,inode64

### Conclusion

It has been 6 months since I started working on Ceph and the first thing that popped into my mind is: “what a damn amazing project!” And it didn’t take any threatening to get me to say it, not even from Ross ![:)](http://ceph.com/wp-includes/images/smilies/icon_smile.gif) .

Good:

- RBD + Pacemaker = AWESOME
- Maintenance: performing maintenance is fairly easily; we have already made 2 maintenance trials while running production (restart servers for hardware upgrade)
- Inktank guys are really helpful
- Ceph community is active

Bad:

- No real control on the logging, there is currently no way to specify a facility nor a severity for the logs. For more information about this, check my article about [Ceph and Logging](http://www.sebastien-han.fr/blog/2013/01/07/logging-in-ceph/).
- Recently detected memory leaks from OSDs, that is still being investigated. See the current discussion on the [Ceph Mailing List](http://www.mail-archive.com/ceph-devel@vger.kernel.org/msg11000.html).

To conclude this first user story, I’d like to thank the people from Inktank that gave me this opportunity. Many thanks to the community as well. I’m not a great developer so I can’t really contribute to the code, but I’ve been quite active on testing, reports, feedback and blogging on the project.

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/user-story/ceph-from-poc-to-production/&bvt=rss&p=wordpress)
