---
title: "Results From the Ceph Census"
date: "2013-03-01"
author: "rturk"
tags: 
  - "planet"
---

Hi!

From February 13-18, we ran our very first Ceph Census. The purpose of this survey was to get a sense of how many Ceph clusters are out there, what they are used for, and which technologies they are used alongside.

The Census was announced on the [ceph-devel](http://article.gmane.org/gmane.comp.file-systems.ceph.devel/13110/match=census) and [ceph-users](http://lists.ceph.com/pipermail/ceph-users-ceph.com/2013-February/000071.html) mailing lists and a link was placed in the topic of the #ceph IRC channel. There were 10 questions in total. The survey was anonymous by default, although people could provide their email address if they chose. In total, we received data from 81 respondents.

Raw responses (without email addresses and other personally-identifiable information) are available at the bottom of this post. Between here and there is my attempt to summarize the most important data. Some questions were optional and some allowed for multiple answers, so the number of responses for each question was often more or less than 81. Enjoy!

![Status](images/status.png "status.png")

- It’s close to an even three-way split between those who are assessing Ceph, those with concrete production plans, and those in production.
    
    The community reported 21 production clusters with a combined raw storage of **1,154TB**. Apparently the team at DreamHost didn’t participate in the Census; [DreamObjects](http://dreamhost.com/cloud/dreamobjects/) alone is over 3PB!
    
    Pre-production clusters represent a total raw storage of **2,466TB** (excluding a reported 20PB cluster.)
    
- | Answer | # |
    | --- | --- |
    | Assessment / Investigation | 36 |
    | Pre-Production | 24 |
    | Production | 21 |
    

![Storage](images/storage.png "storage.png")

- The total amount of storage reported was **5,635TB**, and most of it is in clusters with less than 50TB. The average cluster size is just over 72TB.
    
    Since this question allowed for a free-form text response, I converted each response into TB. If a range was specified, I chose the lower number.
    
    Of the two largest responses, one was the mysterious 20PB pre-production cluster I mentioned above that provides storage for an OpenStack deployment. The other was a 1PB cluster in pre-production at GRNET SA.
    
- | Answer | # |
    | --- | --- |
    | <= 10TB | 28 |
    | 11-50TB | 26 |
    | 51-100TB | 11 |
    | 101-200TB | 6 |
    | 201-500TB | 6 |
    | \> 500TB | 2 |
    

![Use case](images/use_case.png "use_case.png")

- It’s no surprise that half of the reported Ceph clusters are being used to provide storage for cloud deployments. It is interesting, though, that private cloud deployments represent a far larger set of clusters than public ones.
    
    I didn’t anticipate so much interest in Ceph for backup and archival, but I should have – Ceph’s low cost per gig and ease of expansion make it great for that.
    
    I am pleased to see big data as a popular use case as well. Many open source distributed filesystems can be used to replace HDFS, and Ceph [is no exception](http://ceph.com/docs/master/cephfs/hadoop/).
    
- | Answer | # |
    | --- | --- |
    | Private Cloud | 53 |
    | Backup / Archival | 29 |
    | Public Cloud | 23 |
    | Big Data | 20 |
    | HPC | 13 |
    | Legacy | 6 |
    

![Client](images/client.png "client.png")

- This was kind of an odd question because the “client” OS only matters for some use cases. It doesn’t really matter what OS a REST client is running, for example, but it matters a lot for clients of Ceph’s block and file interfaces.
    
    Even so, Ubuntu has a substantial lead. Top among the “Other” responses were Gentoo and SLES.
    
- | Answer | # |
    | --- | --- |
    | Ubuntu | 45 |
    | Debian | 25 |
    | CentOS | 15 |
    | RHEL | 12 |
    | Other | 21 |
    

![Server](images/server.png "server.png")

- On the server-side, Ubuntu is king. Over half of those polled said they were currently running, or planning to run, their clusters on Ubuntu.
    
    We worked hard early last year to make sure that the Ceph experience on Ubuntu was great, and similar efforts are currently being put into the other major distributions.
    
    Ubuntu and Debian combined (the apt-get cabal!) account for all but two of the production clusters reflected in this Census.
    
- | Answer | # |
    | --- | --- |
    | Ubuntu | 43 |
    | Debian | 15 |
    | CentOS | 7 |
    | RHEL | 3 |
    | Other | 12 |
    

![Stacks](images/stacks.png "stacks.png")

- This was kind of a surprise! Actually, **two** surprises.
    
    First, OpenStack is the most dominant cloud stack. Integrations with Apache CloudStack, ProxMox, and others have been generating interest – I wouldn’t be surprised to see a more even distribution in the next Census.
    
    The second surprise is that most respondents use no cloud stack at all…even though the #1 and #3 use cases were cloud deployments!
    
    The top responses under “Other” were Ganeti and VMWare vCloud.
    
- | Answer | # |
    | --- | --- |
    | None | 35 |
    | OpenStack | 17 |
    | ProxMox | 6 |
    | OpenNebula | 5 |
    | CloudStack | 4 |
    | Other | 11 |
    

So! That concludes our first Ceph Census. I think it was incredibly worthwhile, and I appreciate the participation of all those involved! Full results can be downloaded in CSV [here](http://objects.dreamhost.com/cephcom/2013-02-ceph-census.csv).

We hope to repeat this Census regularly, and we’ll continue to publish results. Until next time!

Cheers,  
  
Ross

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/community/results-from-the-ceph-census/&bvt=rss&p=wordpress)
