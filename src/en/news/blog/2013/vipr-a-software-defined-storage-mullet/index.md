---
title: "ViPR: A software-defined storage mullet?"
date: "2013-05-16"
author: "nwl"
tags: 
  - "storage"
---

Almost every few weeks, new storage products are announced by competitors and I generally avoid commenting on them. But EMC’s [ViPR announcement](http://pulseblog.emc.com/2013/05/06/introducing-emc-vipr-software-defined-storage/) contains attempts to perform both marketing and technical sleight of hand around software-defined storage that potentially do much to slow down the inevitable change that is coming to the storage market.

While EMC remain an impressive company with a record of adjusting to the market and re-invention, they have adopted the unfortunate habit of sprinkling “open” and “software-defined storage” over their new product in the hope of convincing customers that ViPR is something new and revolutionary.

While ViPR looks to present a modern interface to the administrator, it still interacts with a mixture of expensive and ill-fitting components on the back.

In others words, it is something of a **Storage Mullet**.

A complex solution of parts united around a vendor-controlled API control plane has but the barest association with what open and software-defined storage really mean, or why they are valuable to a business.

### Vendor open vs really open

Fifteen years ago, the data center was awash in a mix of proprietary hardware and proprietary software. Open-source transformed this by giving users the power to control and adapt software to their own needs, allowing them to optimize performance for their environments while driving costs down at the same time. Linux, MySQL, and Apache spearheaded this shift and now Hadoop and the NoSQL movement are delivering even more innovation.

Storage has been one of the last bastions to withstand this transformation, which is why Inktank believes the time is right for a truly **open-source** storage system. Open APIs are important but this is not just about the control plane and offering the ability to integrate with other vendors’ systems. It is about bringing the benefits of collaboration around shared problems and rapid feature development to the entire storage stack.

Even more, it’s about ensuring customers are not locked into a single vendor. With the move to cloud infrastructure speeding up the innovation cycle, it’s no mystery the most popular cloud platforms such as OpenStack and CloudStack are all open-source and vendor independent. Customers now want open-source throughout for both the compute and storage layer, and an API tied to a single vendor still presents the risk of lock-in.

### Software-Defined vs Software-Managed

EMC are calling ViPR the first software-defined storage platform. Not only is this not the first but it barely qualifies for calling itself a software-defined storage platform at all.

Like cloud, everyone has their own slightly different definition of what software-defined storage means. But at its heart, it is intimately linked to the separation of the software functions from the underlying hardware, allowing customers to use low-cost, commodity hardware of their own choosing without sacrificing features.

ViPR is better described as software-managed storage. It is principally a means for people to integrate their existing legacy storage solutions into a single control layer through which to provision and deploy storage pools. While the API layer does allow integration with modern components (indeed, it can deploy data to a Ceph cluster using the OpenStack Swift API adaptor) it still leaves the bulk of the storage functionality locked up in the proprietary appliances that dominate enterprise IT. No cost savings there.

As for its being the first, well, Ceph has been running in production in multiple sites for many years before last week’s announcement.

### The right side of history

EMC’s announcement shows that they are having to react to the shift that is going on towards customers using low-cost, commodity hardware, and that excessive margin on proprietary appliances is not sustainable. It also shows a recognition that the future of storage is going to be delivered via software and APIs.

At Inktank, we are building a business that completely embraces this change so it’s flattering that EMC now share our vision. However ViPR represents a hedged and rather predictable product that sees EMC wanting to do more to protect existing revenues than embrace the future.

Inktank was established to drive change in the storage industry and create a situation where customers pay less, for better. But the enterprise customer of today, who is comfortable using open-source technology throughout the data center, can no longer be sold more, for more by legacy vendors.

Businesses are now ready for a genuine change in how they deploy storage and no matter many times you use words like open, API or software-defined, customers can tell a fresh choice from an old story.

![](http://track.hubspot.com/__ptq.gif?a=265024&k=14&bu=http%3A%2F%2Fwww.inktank.com&r=http%3A%2F%2Fwww.inktank.com%2Fstorage-2%2Fvipr-a-software-defined-storage-mullet%2F&bvt=rss&p=wordpress)
