---
title: "A tool to rebalance uneven Ceph pools"
date: "2017-05-27"
author: "admin"
tags: 
  - "planet"
---

The algorithm to fix uneven CRUSH distributions in Ceph was implemented as the [crush optimize](http://crush.readthedocs.io/) subcommand. Given the output of **ceph report**, **crush analyze** can show buckets that are over/under filled:

$ ceph report > ceph\_report.json
$ crush analyze --crushmap ceph\_report.json --pool 3
             ~id~  ~weight~  ~PGs~  ~over/under filled %~
~name~
cloud3-1363    -6    419424   1084                   7.90
cloud3-1364    -7    427290   1103                   7.77
cloud3-1361    -4    424668   1061                   4.31
cloud3-1362    -5    419424   1042                   3.72
cloud3-1359    -2    419424   1031                   2.62
cloud3-1360    -3    419424    993                  -1.16
cloud3-1396    -8    644866   1520                  -1.59
cloud3-1456   -11    665842   1532                  -3.94
cloud3-1397    -9    644866   1469                  -4.90
cloud3-1398   -10    644866   1453                  -5.93

Worst case scenario if a host fails:

        ~over filled %~
~type~
device            30.15
host              10.53
root               0.00

The **crush optimize** command will create a crushmap rebalancing the PGs:

$ crush optimize --crushmap ceph\_report.json 
                 --out-path optimized.crush --pool 3
2017-05-27 20:22:17,638 argv = optimize --crushmap ceph\_report.json 
  --out-path optimized.crush --pool 3 --replication-count=3 
  --pg-num=4096 --pgp-num=4096 --rule=data --out-version=j 
  --no-positions --choose-args=3
2017-05-27 20:22:17,670 default optimizing
2017-05-27 20:22:24,165 default wants to swap 447 PGs
2017-05-27 20:22:24,172 cloud3-1360 optimizing
2017-05-27 20:22:24,173 cloud3-1359 optimizing
2017-05-27 20:22:24,174 cloud3-1361 optimizing
2017-05-27 20:22:24,175 cloud3-1362 optimizing
2017-05-27 20:22:24,177 cloud3-1364 optimizing
2017-05-27 20:22:24,177 cloud3-1363 optimizing
2017-05-27 20:22:24,179 cloud3-1396 optimizing
2017-05-27 20:22:24,188 cloud3-1397 optimizing
2017-05-27 20:22:27,726 cloud3-1360 wants to swap 21 PGs
2017-05-27 20:22:27,734 cloud3-1398 optimizing
2017-05-27 20:22:29,151 cloud3-1364 wants to swap 48 PGs
2017-05-27 20:22:29,176 cloud3-1456 optimizing
2017-05-27 20:22:29,182 cloud3-1362 wants to swap 32 PGs
2017-05-27 20:22:29,603 cloud3-1361 wants to swap 47 PGs
2017-05-27 20:22:31,406 cloud3-1396 wants to swap 77 PGs
2017-05-27 20:22:33,045 cloud3-1397 wants to swap 61 PGs
2017-05-27 20:22:33,160 cloud3-1456 wants to swap 58 PGs
2017-05-27 20:22:33,622 cloud3-1398 wants to swap 47 PGs
2017-05-27 20:23:51,645 cloud3-1359 wants to swap 26 PGs
2017-05-27 20:23:52,090 cloud3-1363 wants to swap 43 PGs

Before uploading the crushmap (with **ceph osd setcrushmap -i optimized.crush**), **crush analyze** can be used again to verify it improved as expected:

$ crush analyze --crushmap optimized.crush --pool 3 --replication-count=3 
                --pg-num=4096 --pgp-num=4096 --rule=data --choose-args=0
             ~id~  ~weight~  ~PGs~  ~over/under filled %~
~name~
cloud3-1359    -2    419424   1007                   0.24
cloud3-1363    -6    419424   1006                   0.14
cloud3-1360    -3    419424   1005                   0.04
cloud3-1361    -4    424668   1017                  -0.02
cloud3-1396    -8    644866   1544                  -0.04
cloud3-1397    -9    644866   1544                  -0.04
cloud3-1398   -10    644866   1544                  -0.04
cloud3-1364    -7    427290   1023                  -0.05
cloud3-1456   -11    665842   1594                  -0.05
cloud3-1362    -5    419424   1004                  -0.06

Worst case scenario if a host fails:

        ~over filled %~
~type~
device            11.39
host               3.02
root               0.00

### Incremental rebalancing

The number of PGs moved during rebalancing can be controlled with the **–step** option. For instance, **–step 64** will stop rebalancing after 64 PGs are moved:

$ crush optimize --crushmap ceph\_report.json --out-path optimized.crush 
                 --pool 3 --step 64
2017-05-27 21:23:31,498 default optimizing
2017-05-27 21:23:32,208 default wants to swap 72 PGs
2017-05-27 21:23:32,208 default will swap 72 PGs
2017-05-27 21:23:32,218 the optimized crushmap was written to optimized.crush
2017-05-27 21:23:32,218 now running simulation of the next steps
2017-05-27 21:23:32,218 this can be disabled with --no-forecast
2017-05-27 21:23:32,250 default optimizing
2017-05-27 21:23:33,087 default wants to swap 70 PGs
2017-05-27 21:23:33,087 default will swap 70 PGs
...
2017-05-27 21:39:33,421 cloud3-1363 already optimized
2017-05-27 21:39:44,724 cloud3-1359 already optimized
2017-05-27 21:39:44,757 step 13 moves 0 PGs

The forecast shows it needs 12 rounds to complete the rebalancing. Once the cluster finished rebalancing the PGs for the first round, **crush optimize** can be called again with the output of **ceph report**.

### Caveats

If two pools share the same crush rule, they cannot be rebalanced. Only pools with a dedicated rule can be rebalanced.

### Backward compatibility

Rebalancing is implemented for Luminous clusters and up. However, for clusters with a single pool, rebalancing can be done for pre-Luminous clusters. See the [python-crush Ceph cookbook](http://crush.readthedocs.io/en/latest/ceph/optimize.html) for more information.

Source: Dachary ([A tool to rebalance uneven Ceph pools](http://dachary.org/?p=4076))
