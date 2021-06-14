---
title: "Quick update Ceph: from Argonaut to Cuttlefish"
date: "2013-11-27"
author: "shan"
tags: 
  - "planet"
---

![](images/ceph-argonaut-to-cuttlefish.jpg "Quick update Ceph: from Argonaut to Cuttlefish")

Memory leaks disappeared and CPU load dramatically reduced. Yay!

  

The upgrade started during the **week 39**.

![](images/ceph-upgrade-load.png "Before and after upgrade")

  

The first graph shows the amount of RAM used before and after the Ceph upgrade. As you might know, they were numerous memory leaks in Argonaut and the picture clearly demonstrates that. It’s obvious that the upgrade solved them.

The second graph shows the CPU usage by the Ceph OSDs. Once again, the upgrade improved the general CPU utilisation.

  

> Significant improvements!
