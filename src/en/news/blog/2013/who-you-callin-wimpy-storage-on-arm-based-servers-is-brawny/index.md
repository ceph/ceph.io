---
title: "Who You Callin’ Wimpy? Storage on ARM-based Servers Is Brawny!"
date: "2013-09-03"
author: "syndicated"
tags: 
---

[![](images/Registered-Calxeda-Logo.png)](http://calxeda.com/)

### A Guest Blogpost from  
John Mao, Product Marketing, Calxeda

Wimpy a good thing? For CPU cores? Maybe so….

Now, I’m not exactly a fan of the term _wimpy_—the voice in this [80s trash bag commercial](http://www.youtube.com/watch?v=wEuuECHZaeU) tends to haunt me—but in his research note last Wednesday called [“Are Wimpy Cores Good for Brawny Storage?”](http://www.moorinsightsstrategy.com/research-note-are-wimpy-cores-good-for-brawny-storage/), Paul Teich of Moor Insights & Strategy highlighted one of the obvious use cases for _wimpy_ CPU cores: distributed, software-defined storage.

Wimpy and all, it’s great to read that energy-efficient, ARM-based servers and scale-out storage applications like Ceph are intersecting. Here at [Calxeda](http://www.calxeda.com/), we’ve been on a mission to prove that this marriage will afford [significant cost and power saving advantages](http://armservers.com/2013/06/11/inktank-and-calxeda-partner-to-transform-ceph-storage-solutions/) for data centers around the world. In fact, back in June, we [announced a strategic partnership](http://www.calxeda.com/calxeda-and-inktank-team-to-deliver-transformative-ceph-based-storage-platform/) with [Inktank](http://www.inktank.com/) to help accelerate the development and productization of Ceph on Calxeda solutions.

Helping our cause, Teich’s research note reveals interesting points about: (1) horizontal scalability and (2) throughput performance. Take the former topic. Teich says, “The take-away…is that the aggregate storage bandwidth of these Calxeda-based Ceph system configurations does increase in a predictable fashion as both the number of nodes increases and as the number of HDDs increases.” So there you have it: Ceph’s architecture and its ability to scale horizontally and with very little overhead has measurable benefit. How far this can truly be stretched in a hyperscale-sized deployment is yet to be seen, but the EnergyCore’s integrated 10Gb fabric will surely help carry some of the burden as we look to scale out beyond 36-nodes in testing.

So that leaves the note’s second topic: throughput. While write performance deserves some investigation, the read numbers for raw throughput performance look pretty good. We’re hoping to publish some head-to-head performance comparisons soon, but early indicators seem to show that performance will be on par with most commodity x86-based servers. (Obviously, your mileage will vary based on configuration/price.) And once you factor in the entire TCO (cost and power consumption), the comparisons will get even more interesting.

While we still have plenty of work ahead, it’s great to see the first small fruits of our Inktank partnership. If these _very_ early results are any signs of what’s to come, the Ceph/Calxeda combination for storage on ARM-based servers will be a serious contender to replace traditional storage solutions—for service providers and enterprises alike.

Join our [upcoming Webinar](https://www.brighttalk.com/webcast/8847/78221) for a roundtable panel discussion on the high-growth trend of software-defined storage and how ARM-based servers can help you increase the scalability and reliability of your storage tier.

