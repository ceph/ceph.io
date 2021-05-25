---
title: "How Many Mouvement When I Add a Replica ?"
date: "2017-07-28"
author: "admin"
tags: 
  - "planet"
---

Make a simple simulation !

Use your own crushmap :

```
$ ceph osd getcrushmap -o crushmap 

got crush map from osdmap epoch 28673
```

Or create a sample clushmap :

```
$ crushtool --outfn crushmap --build --num_osds 36 host straw 12 root straw 0

2017-07-28 15:01:16.240974 7f4dda123760  1 
ID  WEIGHT  TYPE NAME
-4  36.00000    root root
-1  12.00000        host host0
0   1.00000         osd.0
1   1.00000         osd.1
2   1.00000         osd.2
3   1.00000         osd.3
4   1.00000         osd.4
5   1.00000         osd.5
6   1.00000         osd.6
7   1.00000         osd.7
8   1.00000         osd.8
9   1.00000         osd.9
10  1.00000         osd.10
11  1.00000         osd.11
-2  12.00000        host host1
12  1.00000         osd.12
13  1.00000         osd.13
14  1.00000         osd.14
15  1.00000         osd.15
16  1.00000         osd.16
17  1.00000         osd.17
18  1.00000         osd.18
19  1.00000         osd.19
20  1.00000         osd.20
21  1.00000         osd.21
22  1.00000         osd.22
23  1.00000         osd.23
-3  12.00000        host host2
24  1.00000         osd.24
25  1.00000         osd.25
26  1.00000         osd.26
27  1.00000         osd.27
28  1.00000         osd.28
29  1.00000         osd.29
30  1.00000         osd.30
31  1.00000         osd.31
32  1.00000         osd.32
33  1.00000         osd.33
34  1.00000         osd.34
35  1.00000         osd.35
```

Simulate the rule 0 or your own :

```
$ crushtool --test -i crushmap --rule 0 --show-mappings --min-x 0 --max-x 10 --num-rep 2

CRUSH rule 0 x 0 [0,12]
CRUSH rule 0 x 1 [5,24]
CRUSH rule 0 x 2 [9,14]
CRUSH rule 0 x 3 [30,11]
CRUSH rule 0 x 4 [20,10]
CRUSH rule 0 x 5 [28,0]
CRUSH rule 0 x 6 [6,34]
CRUSH rule 0 x 7 [19,31]
CRUSH rule 0 x 8 [17,26]
CRUSH rule 0 x 9 [9,20]
CRUSH rule 0 x 10 [10,33]

crushtool --test -i crushmap --rule 0 --show-mappings --min-x 0 --max-x 10 --num-rep 3

CRUSH rule 0 x 0 [0,12,32]
CRUSH rule 0 x 1 [5,24,20]
CRUSH rule 0 x 2 [9,14,28]
CRUSH rule 0 x 3 [30,11,13]
CRUSH rule 0 x 4 [20,10,31]
CRUSH rule 0 x 5 [28,0,12]
CRUSH rule 0 x 6 [6,34,14]
CRUSH rule 0 x 7 [19,31,6]
CRUSH rule 0 x 8 [17,26,5]
CRUSH rule 0 x 9 [9,20,30]
CRUSH rule 0 x 10 [10,33,12]
```

In general it’s going well. But in some cases it could be better to test.

Source: Laurent Barbe ([How Many Mouvement When I Add a Replica ?](http://cephnotes.ksperis.com/blog/2017/07/28/how-many-mouvement-when-i-add-a-replica/))
