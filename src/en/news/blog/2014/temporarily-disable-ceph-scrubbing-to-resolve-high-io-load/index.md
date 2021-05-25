---
title: "Temporarily disable Ceph scrubbing to resolve high IO load"
date: "2014-08-02"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

In a [Ceph](http://ceph.com/) cluster with [low bandwidth](http://dachary.org/?p=2969), the root disk of an OpenStack instance became extremely slow during days.  
[![](images/overload.png "overload")](http://dachary.org/wp-uploads/2014/08/overload.png)  
When an OSD is [scrubbing](http://ceph.com/docs/master/rados/operations/placement-groups/#scrub-a-placement-group) a placement group, it has a significant impact on performances and this is expected, for a short while. In this case, however it slowed down to the point where the OSD was marked down because it did not reply in time:

2014-07-30 06:43:27.331776 7fcd69ccc700  1
   mon.bm0015@0(leader).osd e287968
   we have enough reports/reporters to mark osd.12 down

To get out of this situation, both scrub and deep scrub were deactivated with:

root@bm0015:~# ceph osd set noscrub
set noscrub
root@bm0015:~# ceph osd set nodeep-scrub
set nodeep-scrub

After a day, as the IO load remained stable confirming that no other factor was causing it, scrubbing was re-activated. The context causing the excessive IO load was changed and it did not repeat itself after another 24 hours, although scrubbing was confirmed to resume when examining the logs on the same machine:

2014-07-31 15:29:54.783491 7ffa77d68700  0 log \[INF\] : 7.19 deep-scrub ok
2014-07-31 15:29:57.935632 7ffa77d68700  0 log \[INF\] : 3.5f deep-scrub ok
2014-07-31 15:37:23.553460 7ffa77d68700  0 log \[INF\] : 7.1c deep-scrub ok
2014-07-31 15:37:39.344618 7ffa77d68700  0 log \[INF\] : 3.22 deep-scrub ok
2014-08-01 03:25:05.247201 7ffa77d68700  0 log \[INF\] : 3.46 deep-scrub ok
