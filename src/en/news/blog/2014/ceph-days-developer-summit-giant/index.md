---
title: "Ceph Days and Developer Summit Giant"
date: "2014-03-07"
author: "scuttlemonkey"
---

The past couple of weeks have been a veritable sharknado of activity for the Ceph Community. From our most successful Ceph Day yet last week in Frankfurt, Germany, to another great quarterly developer summit as work begins on the "Giant" release. It is great to see that the engagement and adoption trends are continuing and we are definitely enjoying the fruits of a rich and productive community.

[![SHARKNADO](images/SHARKNADO-300x153.jpg)](http://ceph.com/wp-content/uploads/2014/03/SHARKNADO.jpg)

Read on for details of these Ceph community events.

### Ceph Day Frankfurt

If you haven't been to a Ceph Day event yet, you are certainly missing out! Each one has been bigger and better than the last, and the event in Frankfurt was certainly no exception. With over 150 people, we stretched the logistical limits of the Dell Solutions Center, and had a great time doing it. We started the morning off with a continental breakfast, Sage describing both Ceph's history and its future, and a very detailed examination of real world Ceph numbers by Dieter Kasper from Fujitsu.

All of the speakers at Ceph day did an amazing job, so it's hard to call out some and not other. However, a few talks have created conversations that are continuing far beyond the reaches of the event itself:

**_"Building AuroraObjects"_** -- Wido den Hollander from 42On.com had a great breakdown of creating a public object store with some very clever uses of the RADOS gateway with Logstash and Elasticsearch for accounting.

**_"Ceph at the Digital Repository of Ireland"_** -- Peter Tiernan from Trinity College gave a great breakdown of their storage evaluation for the DRI. The summary and side-by-side comparison of architectural capabilities of Ceph against HDFS, iRODS, and GPFS was an interesting exploration.

**_"Ceph Performance & Optimization"_** -- Given the sheer number of tuneables and the vast number of ways you can optimize your Ceph cluster, eNovance's Sebastien Han did a great job of breaking down the task to a easy-to-digest format. Given the FUD flying around about distributed systems performance, it seems like lots of people could benefit from a bit of Sebastien's knowledge!

Other talks featured a masterful breakdown of Ceph and OpenStack by Martin Loschwitz from Hastexo, vendor solutions from Dell, SUSE, and OStack.de, and another captivating exploration of Ceph at CERN by Dan van der Ster.

We ended the day with a brief roundtable with all of the speakers and then enjoyed beer, pizza, and great conversations well into the evening. Keep an eye on the [Ceph Day page](http://www.inktank.com/cephdays/) for events in your neighborhood. We are currently working on events in:

- Kuala Lumpur, Malaysia
- Sunnyvale, CA
- Austin, TX
- Boston, MA
- Paris, France
- and several others!

If you have a venue to host, or would like to otherwise participate in putting on a Ceph day, the Ceph community is always looking for helping hands. You can head over to the [sponsorship page](http://info.inktank.com/ceph_day_sponsorships) (for anything Ceph Day related) or just contact our [community team](mailto:community@inktank.com).

### Ceph Developer Summit

In addition to the in-person events, we also just hosted our latest virtual developer summit to discuss the upcoming work for the "Giant" release of Ceph. Spread over two days, the event gathered input from over 60 developers in 15 countries and spanned 4 continents! These gatherings always impress me with how substantive the discussions are and just how talented our developer community is.

All blueprints, notes, and videos of the sessions are available from the [CDS wiki page](https://wiki.ceph.com/Planning/CDS/CDS_Giant_(Mar_2014)). While each session had great results, there were a few highlights from the event:

**_"Accelio RDMA Messenger"_** -- Matt Benjamin from the CohortFS crew is doing some great work in cooperation with Mellanox to add a flexible RDMA/Infiniband transport to Ceph. This is particularly exciting because it aims to add some substantial abstraction and improvement to the Ceph messenger as well as a fair bit of performance tuning.

**_"Discuss moving to CMake"_** -- The Ceph community gathered to discuss build systems and seem to unanimously agree that it's time to refresh the way we approach cross-platform builds. Several options were discussed, but it sounds like CMake is looming in the near future for Ceph.

**_"Pyramid Erasure Code"_** -- Continuing the great efforts around erasure coding, Loic Dachary featured plans to extend this feature to be even more flexible. Erasure coding continues to be a point of great interest and a focal point for many developers in the Ceph community.

**_"Create backend for Seagate Kinetic"_** -- In addition to discussing the particulars of leveraging new tech from Seagate, Sage was also able to show the Ceph community an advance copy of this hardware. Should be exciting to see how Ceph is able to leverage this new tech over time.

There were many other great talks, so if you are interested in Ceph development I strongly suggest you spend some time watching the sessions on YouTube. Thanks to all who made this an amazing event, I'll see you next quarter or on the lists!

scuttlemonkey out
