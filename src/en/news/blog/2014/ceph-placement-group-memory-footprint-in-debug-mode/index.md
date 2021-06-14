---
title: "Ceph placement group memory footprint, in debug mode"
date: "2014-09-19"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

A [Ceph](http://ceph.com/) cluster is run from sources with

CEPH\_NUM\_MON=1 CEPH\_NUM\_OSD=5 ./vstart.sh -d -n -X -l mon osd

and each **ceph-osd** uses approximately 50MB of resident memory

USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
loic      7489  1.7  0.2 586080 **43676** ?        Ssl  17:55   0:01  ceph-osd
loic      7667  1.6  0.2 586080 **43672** ?        Ssl  17:55   0:01  ceph-osd

A pool is created with 10,000 placement groups

$ ceph osd pool create manypg 10000
pool 'manypg' created

the creation completes within half an hour

$ ceph -w
...
2014-09-19 **17:57:35**.193706 mon.0 \[INF\] pgmap v40: 10152
   pgs: 10000 creating, 152 active+clean; 0 bytes data, 808 GB used, 102 GB / 911 GB avail
...
2014-09-19 18:35:08.668877 mon.0 \[INF\] pgmap v583: 10152
   pgs: 46 active, 10106 active+clean; 0 bytes data, 815 GB used, 98440 MB / 911 GB avail
2014-09-19 **18:35:13**.505841 mon.0 \[INF\] pgmap v584: 10152
   pgs: 10152 active+clean; 0 bytes data, 815 GB used, 98435 MB / 911 GB avail

The OSD now use approximately 150MB which suggests that each additional placement group uses ~10KB of resident memory.

USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
loic      7489  0.7  1.0 725952 **166144** ?       Ssl  17:55   2:02 ceph-osd
loic      7667  0.7  0.9 720808 **160440** ?       Ssl  17:55   2:03 ceph-osd
