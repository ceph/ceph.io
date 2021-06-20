---
title: "Running node-rados from sources"
date: "2014-09-17"
author: "loic"
tags: 
  - "ceph"
---

The [nodejs rados](https://github.com/ksperis/node-rados) module comes [with an example](https://github.com/ksperis/node-rados/blob/master/example.js) that requires a Ceph cluster.  
If [Ceph](http://ceph.com/) was [compiled from source](http://ceph.com/docs/master/install/build-ceph/), a cluster can be run from the source tree with

rm -fr dev out ;  mkdir -p dev
CEPH\_NUM\_MON=1 CEPH\_NUM\_OSD=3 \\
 ./vstart.sh -d -n -X -l mon osd

It can be used by modifying the **/etc/ceph/ceph.conf** [in the example](https://github.com/ksperis/node-rados/blob/master/example.js#L8) to the one from the sources : **$CEPHSOURCE/src/ceph.conf**. The expected output is

$ node exemple.js
fsid : c041968a-a895-4a5c-a0a7-6621e08a4f07
ls pools : rbd
 --- RUN Sync Write / Read ---
Read data : 01234567ABCDEF
 --- RUN ASync Write / Read ---
 --- RUN Attributes Write / Read ---
testfile3 xattr = {"attr1":"first attr","attr2":"second attr","attr3":"last attr value"}
