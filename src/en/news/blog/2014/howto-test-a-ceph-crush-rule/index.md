---
title: "HOWTO test a Ceph crush rule"
date: "2014-09-16"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

The [crushtool](http://ceph.com/docs/master/man/8/crushtool/) utility can be used to test [Ceph](http://ceph.com/) crush rules before applying them to a cluster.

$ crushtool --outfn crushmap --build --num\_osds 10 \\
   host straw 2 rack straw 2 default straw 0
# id	weight	type name	reweight
-9	10	default default
-6	4		rack rack0
-1	2			host host0
0	1				osd.0	1
1	1				osd.1	1
-2	2			host host1
2	1				osd.2	1
3	1				osd.3	1
-7	4		rack rack1
-3	2			host host2
4	1				osd.4	1
5	1				osd.5	1
-4	2			host host3
6	1				osd.6	1
7	1				osd.7	1
-8	2		rack rack2
-5	2			host host4
8	1				osd.8	1
9	1				osd.9	1	

Creates a crushmap from scratch (**–build**). It assumes there is a total of 10 OSDs available ( **–num\_osds 10** ). It then places two OSDs in each host ( **host straw 2** ). The resulting hosts (five of them) are then placed in racks, at most two per racks ( **rack straw 2** ). All racks are placed in the default root (that’s what the zero stands for : all of them) ( **default straw 0** ). The last rack only has one host because there is an odd number of hosts available.  
The crush rule to be tested can be injected in the crushmap with

crushtool --outfn crushmap --build --num\_osds 10 host straw 2 rack straw 2 default straw 0
crushtool -d crushmap -o crushmap.txt
cat >> crushmap.txt <<EOF
rule myrule {
	ruleset 1
	type replicated
	min\_size 1
	max\_size 10
	step take default
	step choose firstn 2 type rack
	step chooseleaf firstn 2 type host
	step emit
}
EOF
crushtool -c crushmap.txt -o crushmap

This crushmap should be able to provide two OSDs ( for placement groups for instance ) and it can be verified with the **–test** option.

$ crushtool -i crushmap --test --show-statistics --rule 1 --min-x 1 --max-x 2 --num-rep 2
rule 1 (myrule), x = 1..2, numrep = 2..2
CRUSH rule 1 x 1 \[0,2\]
CRUSH rule 1 x 2 \[7,4\]
rule 1 (myrule) num\_rep 2 result size == 2:	2/2

The **–rule 1** designates the rule that was injected. The **–rule 0** is the default rule that is created by default. The **x** can be thought of as the unique name of the placement group for which OSDs are reclaimed. The **–min-x 1 –max-x 2** varies the value of **x** from 1 to 2 therefore trying the rule only twice. **–min-x 1 –max-x 2048** would create 2048 lines. Each line shows the value of x after the rule number. In **rule 1 x 2** the **1** is the rule number and the **2** is the value of **x**. The last line shows that for all values of x (**2/2** i.e. 2 values of x out of 2), when asked to provide 2 OSDs (**num\_rep 2**) the crush rule was able to provide 2 (**result size == 2**).

If asked for **4** OSDs, the same crush rule may fail because it has barely enough resources to satisfy the requirements.

$ crushtool -i crushmap --test --show-statistics --rule 1 --min-x 1 --max-x 2 --num-rep 4
rule 1 (myrule), x = 1..2, numrep = 4..4
CRUSH rule 1 x 1 \[0,2,9\]
CRUSH rule 1 x 2 \[7,4,1,3\]
rule 1 (myrule) num\_rep 4 result size == 3:	1/2
rule 1 (myrule) num\_rep 4 result size == 4:	1/2

The statistics at the end shows that one of the two mappings failed: the **result size == 3** is lower than the required number **num\_rep 4**. If asked for more OSDs than the rule can provide, the rule will always fail.

crushtool -i crushmap --test --show-statistics --rule 1 --min-x 1 --max-x 2 --num-rep 5
rule 1 (myrule), x = 1..2, numrep = 5..5
CRUSH rule 1 x 1 \[0,2,9\]
CRUSH rule 1 x 2 \[7,4,1,3\]
rule 1 (myrule) num\_rep 5 result size == 3:	1/2
rule 1 (myrule) num\_rep 5 result size == 4:	1/2

More examples of crushtool usage can be found in the [crushtool](https://github.com/ceph/ceph/tree/giant/src/test/cli/crushtool) directory of the Ceph sources.
