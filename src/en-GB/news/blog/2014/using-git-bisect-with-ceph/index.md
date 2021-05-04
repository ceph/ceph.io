---
title: "Using git bisect with Ceph"
date: "2014-10-16"
author: "loic"
tags: 
  - "ceph"
  - "planet"
---

When investingating a [a problem](http://tracker.ceph.com/issues/9794) using the latest [Ceph](http://ceph.com/) sources, it was discovered that the problem only shows in the **master** branch and appeared after the **v0.85** tag. The following script reproduces the problem and logs the result:

$ cat try.sh
#!/bin/bash
cd src
log=$(git describe)
echo $log.log
make -j4 >& $log.log
rm -fr dev out ;  mkdir -p dev
MDS=1 MON=1 OSD=3 timeout 120 ./vstart.sh \\
  -o 'paxos propose interval = 0.01' \\
  -n -l mon osd mds >> $log.log 2>&1
status=$?
./stop.sh
exit $status

It can be used with [git bisect](http://git-scm.com/docs/git-bisect) to find the revision in which it first appeared.

$ git bisect start # initialize the search
$ git bad origin/master # the problem happens
$ git good tags/v0.85 # the problem does not happen
$ git bisect run try.sh # binary search in tags/v0.85..origin/master
running try.sh
v0.85-679-g8d3f135.log
Bisecting: 339 revisions left to test after this (roughly 8 steps)
\[ef006ae\] Merge pull request #2658 from athanatos/wip-9625
running try.sh
v0.86-27-gef006ae.log
Bisecting: 169 revisions left to test after this (roughly 7 steps)
\[fa0bd06\] ceph-disk: bootstrap-osd keyring ignores --statedir
running try.sh
v0.85-1116-gfa0bd06.log
...
v0.86-263-g5f6589c.log
d15ecafea4 is the first bad commit
commit d15eca
Author: John Spray Date:   Fri Sep 26 17:24:12 2014 +0100
    vstart: create fewer pgs for fs pools
:040000 040000 f42a324a8
 aa64cdc1ed3 M	src
bisect run success
