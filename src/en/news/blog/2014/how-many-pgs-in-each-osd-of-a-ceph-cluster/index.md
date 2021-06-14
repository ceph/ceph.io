---
title: "How many PGs in each OSD of a Ceph cluster ?"
date: "2014-12-09"
author: "loic"
tags: 
  - "ceph"
---

To display how many [PGs](http://ceph.com/docs/master/rados/operations/placement-groups/) in each [OSD](http://ceph.com/docs/master/glossary/#term-ceph-osd-daemon) of a [Ceph](http://ceph.com/) cluster:

$ ceph --format xml pg dump | \\
   xmlstarlet sel -t -m "//pg\_stats/pg\_stat/acting" -v osd -n | \\
   sort -n | uniq -c
    332 0
    312 1
    299 2
    326 3
    291 4
    295 5
    316 6
    311 7
    301 8
    313 9

Where [xmlstarlet](http://xmlstar.sourceforge.net/) loops over each PG acting set ( **\-m “//pg\_stats/pg\_stat/acting”** ) and displays the OSDs it contains (**\-v osd**), one by line (**\-n**). The first column is the number of PGs in which the OSD in the second column shows.  
To restrict the display to the PGs belonging to a given pool:

ceph --format xml pg dump |  \\
  xmlstarlet sel -t -m "//pg\_stats/pg\_stat\[starts-with(pgid,'0.')\]/acting" -v osd -n | \\
  sort -n | uniq -c

Where **0.** is the prefix of each PG that belongs to pool **0**.
