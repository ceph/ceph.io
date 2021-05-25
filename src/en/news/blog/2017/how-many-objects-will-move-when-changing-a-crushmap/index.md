---
title: "How many objects will move when changing a crushmap ?"
date: "2017-03-19"
author: "admin"
tags: 
  - "planet"
---

After a crushmap is changed (e.g. addition/removal of devices, modification of weights or tunables), objects may move from one device to another. The [crush compare](http://crush.readthedocs.io/) command can be used to show what would happen for a given rule and replication count. In the following example, two new OSDs are added to the crushmap, causing 22% of the objects to move from the existing OSDs to the new ones.

$ crush compare --rule firstn 
                --replication-count 1 
                --origin before.json --destination after.json
There are 1000 objects.

Replacing the crushmap specified with --origin with the crushmap
specified with --destination will move 229 objects (22.9% of the total)
from one item to another.

The rows below show the number of objects moved from the given
item to each item named in the columns. The objects% at the
end of the rows shows the percentage of the total number
of objects that is moved away from this particular item. The
last row shows the percentage of the total number of objects
that is moved to the item named in the column.

         osd.8    osd.9    objects%
osd.0        3        4       0.70%
osd.1        1        3       0.40%
osd.2       16       16       3.20%
osd.3       19       21       4.00%
osd.4       17       18       3.50%
osd.5       18       23       4.10%
osd.6       14       23       3.70%
osd.7       14       19       3.30%
objects%   10.20%   12.70%   22.90%

The **crush compare** command can also show the impact of a change in one or more “tunables”, such as setting **chooseleaf\_stable** to 1.

$ diff -u original.json destination.json
--- original.json	2017-03-14 23:41:47.334740845 +0100
+++ destination.json	2017-03-04 18:36:00.817610217 +0100
@@ -608,7 +608,7 @@
         "choose\_local\_tries": 0,
         "choose\_total\_tries": 50,
         "chooseleaf\_descend\_once": 1,
- "chooseleaf\_stable": 0,
+        "chooseleaf\_stable": 1,
         "chooseleaf\_vary\_r": 1,
         "straw\_calc\_version": 1
     }

In the following example some columns were removed for brevity and replaced with dots. It shows that 33% of the objects will move after **chooseleaf\_stable** is changed from 0 to 1. Each device will receive and send more than 1% and less than 3% of these objects.

$ crush compare --origin original.json --destination destination.json 
                --rule replicated\_ruleset --replication-count 3
There are 300000 objects.

Replacing the crushmap specified with --origin with the crushmap
specified with --destination will move 99882 objects (33.294% of the total)
from one item to another.

The rows below show the number of objects moved from the given
item to each item named in the columns. The objects% at the
end of the rows shows the percentage of the total number
of objects that is moved away from this particular item. The
last row shows the percentage of the total number of objects
that is moved to the item named in the column.

          osd.0  osd.1 osd.11 osd.13 osd.20 ... osd.8  osd.9 objects%
osd.0         0    116    180      0   3972 ...   138    211    1.89%
osd.1       121      0    129     64    116 ...   112    137    1.29%
osd.11      194    126      0     12      0 ...   168    222    1.94%
osd.13        0     75     19      0    211 ...     0   4552    2.06%
osd.20     4026    120      0    197      0 ...    90      0    1.92%
osd.21      120   2181     65    130    116 ...    85     75    1.29%
osd.24      176    150    265     63      0 ...   160    258    2.29%
osd.25      123     99    190    198     99 ...    92    182    2.19%
osd.26       54     83     62    258    254 ...    51     69    2.27%
osd.27      124    109      0     90     73 ...  1840      0    1.55%
osd.29       43     54      0     98    123 ...  1857      0    1.60%
osd.3        74     82   2112    137    153 ...    61     44    1.62%
osd.37       65    108      0      0    166 ...    67      0    1.66%
osd.38      163    119      0      0     73 ...    58      0    1.68%
osd.44       56     73   2250    148    173 ...    77     43    1.68%
osd.46       60     71    132     67      0 ...    39    125    1.31%
osd.47        0     51     70    126     70 ...     0     73    1.35%
osd.8       151    112    163      0     76 ...     0    175    1.67%
osd.9       197    130    202   4493      0 ...   188      0    2.03%
objects%  1.92%  1.29%  1.95%  2.03%  1.89% ... 1.69%  2.06%   33.29%

### Comparing Ceph crushmaps

Sometimes it is useful to compare two Ceph crushmaps – one real and one hypothetical – for example, to model what will happen if OSDs are added or other parameters (such as weights and tunables) are changed. The crushmap of a running Ceph cluster can be exported in JSON format by issuing the command **ceph osd crush dump > origin.json**. The “origin.json” file can then be copied to make a new file “destination.json” which is edited to reflect the proposed changes (addition of OSDs, etc.). Please note that the JSON produced by Ceph is different from [the JSON consumed by python-crush](http://crush.readthedocs.io/en/latest/api.html#crush.Crush.parse) so an extra conversion step (see the “crush ceph –convert” command) is required. Then use the following command to compare the two crushmaps:

crush compare --rule firstn --replication-count 1 
              --origin <(crush ceph --convert origin.json) 
              --destination <(crush ceph --convert destination.json)

### Caveat

Movement of objects in a real Ceph cluster may be influenced by parameters that are not stored in the crushmap, such as device weight (stored in the OSDMap) and [primary affinity](http://docs.ceph.com/docs/master/rados/operations/crush-map/#primary-affinity).

### Thanks

Many thanks to Nathan Cutler for proofreading part of this post. The well written parts are from him, the rest is my doing.

Source: Dachary ([How many objects will move when changing a crushmap ?](http://dachary.org/?p=4003))
