---
title: "figuring out why ccache misses"
date: "2014-02-09"
author: "loic"
tags: 
  - "ceph"
---

When compiling [Ceph](http://ceph.com/), [ccache](http://ccache.samba.org/) may appear to miss more than expected, as shown by the **cache miss** line of **ccache -s**

cache directory                     /home/loic/.ccache
cache hit (direct)                     1
cache hit (preprocessed)               0
cache miss                             1
files in cache                         3
cache size                           392 Kbytes
max cache size                      10.0 Gbytes

Compiling Ceph from clones in two different directories does not explain the miss, unless **CCACHE\_HASHDIR** is set. It should be unset with:

unset CCACHE\_HASHDIR

  
Although **CCACHE\_BASEDIR** not being set to the source directory could cause cache miss, in the case of Ceph it makes no difference (or too little to notice) because the absolute path name of the source directory is not included in the sources being compiled.  
A verbose output explaining why ccache does not hit can be produced by setting **CCACHE\_LOGFILE**:

export CCACHE\_LOGFILE=/tmp/cache.debug

The following script can be used to get more information about what ccache does when used in two Ceph clones of the master branch:

export CCACHE\_LOGFILE=/tmp/cache.debug
git clone https://github.com/ceph/ceph.git
cp -a ceph ceph-other
cd ceph/src
o=cls/replica\_log/cls\_replica\_log\_ops.o
ccache -zC
rm /tmp/a
rm -f $o
make $o
( cd ../../ceph-other/src ; rm -f $o ; make $o )
ccache -s

should show exactly one hit and one miss.

cache directory                     /home/loic/.ccache
cache hit (direct)                     1
cache hit (preprocessed)               0
cache miss                             1
files in cache                         3
cache size                           568 Kbytes
max cache size                      10.0 Gbytes

If not, the ccache logs can be inspected in **/tmp/cache.debug**. It contains the CPP lines used to pre-process both files. They can be run again and their ouput compared to read the difference between the two.
